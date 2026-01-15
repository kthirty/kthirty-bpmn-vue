import { defineComponent, ref, type PropType } from 'vue'
import Toolbar from '../Toolbar'
import Panel from '../Panel'
import Designer from '../Designer'
import { Layout, LayoutHeader, LayoutContent, LayoutSider } from 'ant-design-vue'
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

    return () => (
      <Layout style="height: 100%" class="bpmn-vue-layout" hasSider={true}>
        <Layout>
          <LayoutHeader
            style={{
              height: '5%',
              lineHeight: '5%',
              backgroundColor: '#fff',
              paddingLeft: '15px',
              paddingTop: '10px'
            }}
          >
            <Toolbar option={props.option?.toolbar} />
          </LayoutHeader>
          <LayoutContent style={{ height: '95%', backgroundColor: '#fff' }}>
            <Designer v-model:xml={xml.value} onCommand-stack-changed={handleCommandStackChanged} onUpdate:xml={handleUpdateXml} option={props.option?.designer} />
          </LayoutContent>
        </Layout>
        <LayoutSider reverseArrow={true} collapsedWidth={0} width={400} theme="light" collapsible={true}>
          <Panel option={props.option?.panel} />
        </LayoutSider>
      </Layout>
    )
  }
})
