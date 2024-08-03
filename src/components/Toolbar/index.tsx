import { defineComponent } from 'vue'

import Imports from './Imports'
import Exports from './Exports'
import Previews from './Previews'
import LintToggle from './LintToggle'
import Aligns from './Aligns'

import {Space} from 'ant-design-vue'

const Toolbar = defineComponent({
    name: 'BpmnToolbar',
    setup() {
        return () => (
            <Space size={1}>
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
