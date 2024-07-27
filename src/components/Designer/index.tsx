import { defineComponent, ref, toRefs, onMounted, markRaw } from 'vue'
import type { PropType } from 'vue'
import { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Modeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import EventEmitter from '../utils/EventEmitter'
import { EmptyXml } from '../utils/BpmnElementHelper'
import styles from '../styles.module.scss'
import { getModeler, setModeler } from '../utils/BpmnHolder'
import Logger from '../utils/Logger'
import config from './config'

const Designer = defineComponent({
  name: 'BpmnDesigner',
  props: {
    xml: {
      type: String as PropType<string>
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
        const options: BaseViewerOptions = {
          container: designer!.value as HTMLElement,
          ...config
        }
        // 开始初始化Modeler
        const modeler: Modeler = new Modeler(options)
        setModeler(markRaw(modeler))
        EventEmitter.emit('modeler-init', modeler)
        // 添加监听事件
        modeler.on('commandStack.changed', async (event) => {
          try {
            const { xml } = await modeler.saveXML({ format: true })
            emit('update:xml', xml)
            emit('command-stack-changed', event)
          } catch (error) {
            Logger.prettyError('commandStack.changed event handle error',error)
          }
        })
        const xmlStr = xml!.value || EmptyXml()
        await modeler!.importXML(xmlStr)
      } catch (e) {
        console.error(e)
      }
    })

    return () => <div ref={designer} class={styles.designer}></div>
  }
})
export default Designer
