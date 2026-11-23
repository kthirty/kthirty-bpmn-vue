import { defineComponent, ref, type PropType } from 'vue'
import Toolbar from '../Toolbar'
import Panel from '../Panel'
import Designer from '../Designer'
import type { BpmnDesignerOption } from '../types'

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
  setup(props: { xml?: string; option?: BpmnDesignerOption }, { emit }) {
    const handleUpdateXml = (updatedXml: string) => {
      console.groupCollapsed('flowable xml changed')
      console.log(updatedXml)
      console.groupEnd()
      emit('update:xml', updatedXml)
    }
    const handleCommandStackChanged = (event: Event) => emit('command-stack-changed')
    const xml = ref<string>(props.xml || '')
    const collapsed = ref(false)

    return () => (
      <div class="bpmn-layout">
        <div class="bpmn-layout-main">
          <header class="bpmn-layout-header">
            <Toolbar option={props.option?.toolbar} />
          </header>
          <div class="bpmn-layout-canvas">
            <Designer v-model:xml={xml.value} onCommand-stack-changed={handleCommandStackChanged} onUpdate:xml={handleUpdateXml} option={props.option?.designer} />
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
