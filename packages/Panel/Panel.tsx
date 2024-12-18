import { defineComponent, markRaw, type PropType, ref, watch } from 'vue'
import { Collapse, PageHeader } from 'ant-design-vue'
import EventEmitter from '../utils/EventEmitter'
import { getModeler, setCurrentElement, setProcessEngine } from '../utils/BpmnHolder'
import { debounce } from '../utils/BpmnElementHelper'
import type { Element } from 'bpmn-js/lib/model/Types'
import Logger from '../utils/Logger'
import { customTranslate } from '../Designer/config/modules/Translate'
import { defaultPanelOption, type PanelItem, type PanelOption } from '../types'

// 引入子组件
const modules = import.meta.glob('./*.tsx', { eager: true })
const components = Object.keys(modules)
  .filter((path) => path !== './Panel.tsx')
  .reduce(
    (acc, path) => {
      const componentName = path.match(/\.\/(.*)\.tsx$/)?.[1]
      if (componentName) acc[componentName] = (modules[path] as any).default
      return acc
    },
    {} as Record<string, ReturnType<typeof defineComponent>>
  )
Logger.prettyPrimary('Load Panel Sub Component', Object.keys(modules).join('  '))

export default defineComponent({
  name: 'Panel',
  props: {
    option: {
      type: Object as PropType<PanelOption>,
      required: false,
      default: defaultPanelOption
    }
  },
  setup(props) {
    const showItems = props.option.items || defaultPanelOption.items
    const currentElement = ref<Element | null>(null)
    // 设置选中元素，更新 store
    const changeElement = debounce((element: Element | null) => {
      const modeler = getModeler()
      const elementRegistry = modeler?.get<any>('elementRegistry')
      let activatedElement: Element | null = element
      // 验证当前选中节点
      if (!activatedElement) {
        activatedElement = elementRegistry?.find((el: Element) => el.type === 'bpmn:Process') || elementRegistry?.find((el: Element) => el.type === 'bpmn:Collaboration')
        if (!activatedElement) return Logger.prettyError('No Element found!')
      }
      // 缓存当前节点信息
      setCurrentElement(markRaw(activatedElement))
      currentElement.value = activatedElement
      // 推送事件消息
      EventEmitter.emit('element-update', activatedElement)
      Logger.prettyPrimary('Selected element changed', `ID: ${activatedElement.id} , type: ${activatedElement.type}`)
    }, 100)
    // 监听事件
    EventEmitter.on('modeler-init', (modeler: any) => {
      modeler.on('import.done', () => changeElement(null))
      // 监听选择事件，修改当前激活的元素以及表单
      modeler.on('selection.changed', ({ newSelection }: { newSelection: any[] }) => changeElement(newSelection[0] || null))
      modeler.on('element.changed', ({ element }: { element: Element }) => {
        // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === currentElement.value?.id) changeElement(element)
      })
    })

    return () => (
      <div>
        <PageHeader title={currentElement?.value?.type?.split(':')[1] || 'Process'} subTitle={customTranslate(currentElement?.value?.type?.split(':')[1] || 'Process', {})} />
        {!!currentElement.value && (
          <Collapse ghost accordion>
            {Object.entries(components)
              .filter(([name, component]) => showItems.includes(name as PanelItem))
              .map(([name, component]) => (
                <component is={component} v-model:element={currentElement.value} option={props.option} />
              ))}
            {props.option.extra && props.option.extra.map((it) => it())}
          </Collapse>
        )}
      </div>
    )
  }
})
