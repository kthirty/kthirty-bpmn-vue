import { defineComponent } from 'vue'

import Imports from './components/Imports'
import Exports from './components/Exports'
import Previews from './components/Previews'
import LintToggle from './components/LintToggle'
import Aligns from './components/Aligns'
import styles from '../styles.module.scss'

import {Space} from 'ant-design-vue'

const Toolbar = defineComponent({
  name: 'BpmnToolBar',
  setup() {

    return () => (
      <Space size={1} class={styles.toolbar} >
        <Imports />
        <Exports />
        <Previews/>
        <LintToggle/>
        <Aligns/>
      </Space>
    )
  }
})

export default Toolbar
