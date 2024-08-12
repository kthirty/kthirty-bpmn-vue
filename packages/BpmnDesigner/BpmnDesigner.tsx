import { defineComponent } from 'vue'
import Toolbar from '../Toolbar'
import Panel from '../Panel'
import Designer from '../Designer'
import { Layout, LayoutHeader, LayoutContent, LayoutSider } from 'ant-design-vue'

export default defineComponent({
  name: 'BpmnDesigner',
  components: { Toolbar, Panel, Designer },
  setup() {
    return () => (
      <Layout style="height: 100%" hasSider={true}>
        <Layout>
          <LayoutHeader
            style={{
              height: '5%',
              lineHeight: '5%',
              background: 'none',
              paddingLeft: '15px',
              paddingTop: '10px'
            }}
          >
            <Toolbar />
          </LayoutHeader>
          <LayoutContent style={{ height: '95%' }}>
            <Designer />
          </LayoutContent>
        </Layout>
        <LayoutSider reverseArrow={true} collapsedWidth={0} width={400} theme="light" collapsible={true}>
          <Panel />
        </LayoutSider>
      </Layout>
    )
  }
})
