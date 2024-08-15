import { defineComponent, ref, toRefs, onMounted, markRaw } from 'vue'
import type { PropType } from 'vue'
import type { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Modeler from 'bpmn-js/lib/Modeler'
import EventEmitter from '../utils/EventEmitter'
import { EmptyXml } from '../utils/BpmnElementHelper'
import { getModeler, setModeler } from '../utils/BpmnHolder'
import Logger from '../utils/Logger'
import config from './config'
import type { DesignerOption } from 'packages/types'

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
  setup(props, { emit }) {
    const { xml } = toRefs(props)
    const designer = ref<HTMLDivElement>()
    onMounted(async () => {
      try {
        if (getModeler()) {
          // 清除旧 modeler
          getModeler()?.destroy()
          setModeler(undefined)
        }
        // 初始化参数
        let designerConfig = { ...config }
        if (props.option?.configEnhance) {
          designerConfig = props.option.configEnhance(designerConfig)
        }
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
        const xmlStr = xml!.value || EmptyXml()
        xmlStr && (await modeler!.importXML(xmlStr))
      } catch (e) {
        console.error(e)
      }
    })

    return () => <div ref={designer} style="height:100%"></div>
  }
})
export default Designer
