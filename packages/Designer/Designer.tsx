import { defineComponent, ref, toRefs, onMounted, onBeforeUnmount, markRaw, watch } from 'vue'
import type { PropType } from 'vue'
import type { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Modeler from 'bpmn-js/lib/Modeler'
import EventEmitter from '../utils/EventEmitter'

import { getModeler, getProcessEngine, setModeler, setProcessEngine } from '../utils/BpmnHolder'
import Logger from '../utils/Logger'
import { getConfig } from './config'
import type { DesignerOption } from '../types'
import { emptyXml } from '../utils/BpmnElementData'
import { refreshCanvasLint, validateBpmn } from '../utils/bpmn-lint'
import type { ValidateBpmnOptions } from '../types'

const Designer = defineComponent({
  name: 'Designer',
  props: {
    xml: {
      type: String as PropType<string>
    },
    option: {
      type: Object as PropType<DesignerOption>,
      required: false
    }
  },
  emits: ['update:xml', 'command-stack-changed'],
  setup(props: { xml?: string; option?: DesignerOption }, { emit, expose }) {
    // 设置流程引擎
    setProcessEngine(props.option?.processEngine || 'flowable')
    watch(
      () => props.option?.processEngine,
      () => {
        setProcessEngine(props.option?.processEngine || 'flowable')
        location.reload()
      }
    )

    const { xml } = toRefs(props)
    const designer = ref<HTMLDivElement>()
    const modelerReady = ref(false)

    expose({
      ready: () => modelerReady.value && !!getModeler(),
      async validate(options?: ValidateBpmnOptions) {
        const processEngine = options?.processEngine || props.option?.processEngine || 'flowable'
        const merged: ValidateBpmnOptions = {
          failOn: props.option?.lint?.failOn,
          rules: props.option?.lint?.rules,
          messages: props.option?.lint?.messages,
          ...options,
          processEngine
        }
        const result = await validateBpmn(merged)
        props.option?.onLintResult?.(result)
        await refreshCanvasLint()
        return result
      },
      async getXml() {
        const modeler = getModeler()
        if (!modeler) return ''
        const { xml: out } = await modeler.saveXML({ format: true })
        return out || ''
      },
      async setXml(xmlStr: string) {
        await getModeler()!.importXML(xmlStr)
      }
    })

    onBeforeUnmount(() => {
      modelerReady.value = false
    })

    onMounted(async () => {
      try {
        if (getModeler()) {
          // 清除旧 modeler
          getModeler()?.destroy()
          setModeler(undefined)
        }
        // 初始化参数
        let designerConfig = { ...getConfig(getProcessEngine()) }
        if (props.option?.configEnhance) {
          designerConfig = props.option.configEnhance(designerConfig)
        }
        Logger.prettyPrimary('Designer Init ', designerConfig)
        const options: BaseViewerOptions = {
          container: designer!.value as HTMLElement,
          ...designerConfig
        }
        // 开始初始化Modeler
        const modeler: Modeler = new Modeler(options)
        setModeler(markRaw(modeler))
        EventEmitter.emit('modeler-init', modeler)
        EventEmitter.on('xml-change', (xml: string) => emit('update:xml', xml))
        // 添加监听事件
        modeler.on('commandStack.changed', async (event) => {
          try {
            const { xml } = await modeler.saveXML({ format: true })
            EventEmitter.emit('xml-change', xml)
            emit('command-stack-changed', event)
          } catch (error) {
            Logger.prettyError('commandStack.changed event handle error', error)
          }
        })
        const xmlStr = xml!.value || emptyXml()
        xmlStr && (await modeler!.importXML(xmlStr))
        modelerReady.value = true
      } catch (e) {
        console.error(e)
        modelerReady.value = false
      }
    })

    return () => <div ref={designer} style="height:100%"></div>
  }
})
export default Designer
