import { defineComponent, Component, markRaw, onMounted, ref, watch } from 'vue'
import { Collapse, PageHeader } from 'ant-design-vue'
import { Element, Connection, Label, Shape } from 'diagram-js/lib/model/Types'
import { BpmnElement } from '@/components/types'
import debounce from 'lodash.debounce'
import EventEmitter from '@/utils/EventEmitter'
import getBpmnIconType from '@/bpmn-icons/getIconType'
import bpmnIcons from '@/bpmn-icons'
import BpmnIcon from '../common/BpmnIcon.vue'
import Logger from '@/utils/Logger'
import modelerStore from '@/store/modeler'
import { Translate } from 'diagram-js/lib/i18n/translate'
import { isCanbeConditional } from '../utils/conditionUtil'
import { isStartInitializable, isUserAssignmentSupported } from '../utils/initiatorUtil'
import styles from '../styles.module.scss'

import { customTranslate } from '@/utils/Translate'
import ElementGenerations from './components/ElementGenerations.vue'
import ElementDocumentations from './components/ElementDocumentations.vue'
import ElementStartInitiator from './components/ElementStartInitiator.vue'
import ElementConditional from './components/ElementConditional.vue'


const Panel = defineComponent({
  name: 'PropertiesPanel',
  setup() {
    const modeler = modelerStore()
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
      renderComponents.push(ElementGenerations)
      renderComponents.push(ElementDocumentations)
      // 开始节点
      isStartInitializable(element) && renderComponents.push(ElementStartInitiator)
      // 连线条件
      isCanbeConditional(element) && renderComponents.push(ElementConditional)

    }

    // 设置选中元素，更新 store
    const setCurrentElement = debounce((element: Shape | Element | Connection | Label | null) => {
      let activatedElement: BpmnElement | undefined = element
      let activatedElementTypeName = ''

      if (!activatedElement) {
        activatedElement =
          modeler.getElRegistry?.find((el) => el.type === 'bpmn:Process') ||
          modeler.getElRegistry?.find((el) => el.type === 'bpmn:Collaboration')

        if (!activatedElement) {
          return Logger.prettyError('No Element found!')
        }
      }
      activatedElementTypeName = getBpmnIconType(activatedElement)

      modeler.setElement(markRaw(activatedElement))
      currentElement.value = activatedElement
      currentElementId.value = activatedElement.id
      currentElementType.value = activatedElement.type.split(':')[1]

      penalTitle.value = modeler.getModeler?.get<Translate>('translate')(currentElementType.value)
      bpmnIconName.value = bpmnIcons[activatedElementTypeName]
      bpmnElementName.value = activatedElementTypeName

      setCurrentComponents(activatedElement)
      EventEmitter.emit('element-update', activatedElement)
      

      Logger.prettyPrimary(
        'Selected element changed',
        `ID: ${activatedElement.id} , type: ${activatedElement.type}`
      )
    }, 100)

    EventEmitter.on('modeler-init', (modeler) => {
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

      // modeler.on('element.click', (event) => {
      //   Logger.prettyInfo('Element Click', event)
      // })
    })

    onMounted(() => !currentElementId.value && setCurrentElement(null))

    return () => (
      <div class={styles.panel} ref={panel}>
        <div class={styles.panel_header}>
          <BpmnIcon name={bpmnIconName.value}/>
          <p class={styles.panel_header_p}>{bpmnElementName.value}</p>
          <p class={styles.panel_header_p}>{customTranslate(currentElementType.value || 'Process')}</p>
        </div>
        <Collapse ghost>
          {renderComponents.map((component) => (
            <component is={component} element={currentElement}></component>
          ))}
        </Collapse>
      </div>
    )
  }
})

export default Panel
