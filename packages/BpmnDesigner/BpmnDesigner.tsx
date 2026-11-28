import { defineComponent, ref, type PropType } from 'vue'
import Toolbar from '../Toolbar'
import Panel from '../Panel'
import Designer from '../Designer'
import type { BpmnDesignerOption, ValidateBpmnOptions } from '../types'

export default defineComponent({
  name: 'BpmnDesigner',
  components: { Toolbar, Panel, Designer },
  props: {
    xml: {
      type: String as PropType<string>
    },
    option: {
      type: Object as PropType<BpmnDesignerOption>,
      required: false
    }
  },
  emits: ['update:xml', 'command-stack-changed'],
  setup(props: { xml?: string; option?: BpmnDesignerOption }, { emit, expose }) {
    const handleUpdateXml = (updatedXml: string) => {
      console.groupCollapsed('flowable xml changed')
      console.log(updatedXml)
      console.groupEnd()
      emit('update:xml', updatedXml)
    }
    const handleCommandStackChanged = (event: Event) => emit('command-stack-changed')
    const xml = ref<string>(props.xml || '')
    const collapsed = ref(false)
    const designerRef = ref<{
      ready: () => boolean
      validate: (options?: ValidateBpmnOptions) => Promise<import('../types').BpmnLintResult>
      getXml: () => Promise<string>
      setXml: (xml: string) => Promise<void>
    }>()

    const designerOption = () => ({
      ...props.option?.designer,
      processEngine: props.option?.designer?.processEngine || 'flowable',
      lint: { failOn: props.option?.validate?.failOn, rules: props.option?.validate?.rules, ...props.option?.designer?.lint }
    })

    expose({
      ready: () => designerRef.value?.ready() ?? false,
      validate: (options?: ValidateBpmnOptions) =>
        designerRef.value!.validate({
          failOn: props.option?.validate?.failOn,
          rules: props.option?.validate?.rules,
          ...options
        }),
      getXml: () => designerRef.value!.getXml(),
      setXml: (xmlStr: string) => designerRef.value!.setXml(xmlStr)
    })

    return () => (
      <div class="bpmn-layout">
        <div class="bpmn-layout-main">
          <header class="bpmn-layout-header">
            <Toolbar option={props.option?.toolbar} />
          </header>
          <div class="bpmn-layout-canvas">
            <Designer ref={designerRef} v-model:xml={xml.value} onCommand-stack-changed={handleCommandStackChanged} onUpdate:xml={handleUpdateXml} option={designerOption()} />
          </div>
        </div>
        <aside class={['bpmn-layout-sider', { collapsed: collapsed.value }]} style={collapsed.value ? undefined : { width: '35%' }}>
          <button type="button" class="bpmn-layout-sider-toggle" onClick={() => (collapsed.value = !collapsed.value)}>
            {collapsed.value ? '‹' : '›'}
          </button>
          <div class="bpmn-layout-sider-body">
            <Panel option={props.option?.panel} />
          </div>
        </aside>
      </div>
    )
  }
})
