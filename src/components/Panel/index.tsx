import { defineComponent, Component, markRaw, onMounted, ref } from 'vue'
import { Collapse } from 'ant-design-vue'
import { Element, Connection, Label, Shape } from 'bpmn-js/lib/model/Types'
import { BpmnElement } from '@/components/types'
import { debounce } from '../utils/BpmnElementHelper'
import EventEmitter from '../utils/EventEmitter'
import getBpmnIconType from '@/bpmn-icons/getIconType'
import bpmnIcons from '@/bpmn-icons'
import BpmnIcon from '../common/BpmnIcon.vue'
import Logger from '@/utils/Logger'
import styles from '../styles.module.scss'
import {getElRegistry ,setElement , getModeler} from '../utils/BpmnHolder'

import { customTranslate } from '@/utils/Translate'
import ElementGenerations from './components/ElementGenerations.vue'
import ElementDocumentations from './components/ElementDocumentations.vue'
import ElementStartInitiator from './components/ElementStartInitiator.vue'
import ElementConditional from './components/ElementConditional.vue'
import ElementBaseInfo from './components/ElementBaseInfo.vue'


const Panel = defineComponent({
  name: 'PropertiesPanel',
  setup() {
    const panel = ref<HTMLDivElement | null>(null)
    const currentElementId = ref<string | undefined>(undefined)
    const currentElementType = ref<string | undefined>(undefined)
    const penalTitle = ref<string | undefined>('属性配置')
    const bpmnIconName = ref<string>('Process')
    const bpmnElementName = ref<string>('Process')
    const renderComponents = markRaw<Component[]>([])
    const currentElement = ref<BpmnElement | null>(null)

    const setCurrentComponents = (element: BpmnElement) => {
      // 清空
      renderComponents.splice(0, renderComponents.length)
      // 添加基础组件
      renderComponents.push(ElementBaseInfo)
      renderComponents.push(ElementDocumentations)
      // 开始节点
      renderComponents.push(ElementStartInitiator)
      // 连线条件
      renderComponents.push(ElementConditional)

    }

    // 设置选中元素，更新 store
    const setCurrentElement = debounce((element: Shape | Element | Connection | Label | null) => {
      let activatedElement: BpmnElement | undefined = element
      let activatedElementTypeName = ''
      // 验证当前选中节点
      if (!activatedElement) {
        activatedElement =
          getElRegistry()?.find((el) => el.type === 'bpmn:Process') ||
          getElRegistry()?.find((el) => el.type === 'bpmn:Collaboration')
        if (!activatedElement) {
          return Logger.prettyError('No Element found!')
        }
      }
      activatedElementTypeName = getBpmnIconType(activatedElement)
      // 缓存当前节点信息
      setElement(markRaw(activatedElement))
      currentElement.value = activatedElement
      currentElementId.value = activatedElement.id
      currentElementType.value = activatedElement.type.split(':')[1]
      // 面板标题、图标、名称信息
      penalTitle.value = getModeler()?.get<any>('translate')(currentElementType.value)
      bpmnIconName.value = bpmnIcons[activatedElementTypeName]
      bpmnElementName.value = activatedElementTypeName
      // 推送事件消息
      EventEmitter.emit('element-update', activatedElement)
      setCurrentComponents(currentElement.value)

      Logger.prettyPrimary('Selected element changed', `ID: ${activatedElement.id} , type: ${activatedElement.type}`)
    }, 100)

    EventEmitter.on('modeler-init', (modeler: any) => {
      // 导入完成后默认选中 process 节点
      modeler.on('import.done', () => {
        setCurrentElement(null)
      })
      // 监听选择事件，修改当前激活的元素以及表单
      modeler.on('selection.changed', ({ newSelection }) => {
        setCurrentElement(newSelection[0] || null)
      })
      modeler.on('element.changed', ({ element }) => {
        // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === currentElementId.value) {
          setCurrentElement(element)
        }
      })
      modeler.on('element.click', (event: Event) => {
        Logger.prettyPrimary('Element Click', event)
      })
    })

    onMounted(() => !currentElementId.value && setCurrentElement(null))

    return () => (
      <div class={styles.panel} ref={panel}>
        <div class={styles.panel_header}>
          <BpmnIcon name={bpmnIconName.value} />
          <p class={styles.panel_header_p}>{bpmnElementName.value}</p>
          <p class={styles.panel_header_p}>{customTranslate(currentElementType.value || 'Process')}</p>
        </div>
        <Collapse ghost>
          {renderComponents.map((component) => (
            <component is={component} v-model:element={currentElement.value}></component>
          ))}
        </Collapse>
      </div>
    )
  }
})

export default Panel
