import { defineComponent } from 'vue'

import Imports from './components/Imports'
import Exports from './components/Exports'
import Previews from './components/Previews'
import styles from '../styles.module.scss'

import {Space} from 'ant-design-vue'

const Toolbar = defineComponent({
  name: 'BpmnToolBar',
  setup() {

    return () => (
      <Space class={styles.toolbar}>
        <Imports />
        <Exports />
        <Previews/>
      </Space>
    )
  }
})

export default Toolbar
