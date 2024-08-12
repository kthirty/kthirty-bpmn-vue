import { defineComponent, type PropType } from 'vue'

import Imports from './Imports'
import Exports from './Exports'
import Previews from './Previews'
import LintToggle from './LintToggle'
import Aligns from './Aligns'

import { Space } from 'ant-design-vue'
import { defaultToobarOption, type ToobarOption } from '../types'

const Toolbar = defineComponent({
  name: 'Toolbar',
  props: {
    option: {
      type: Object as PropType<ToobarOption>,
      required: false,
      default: defaultToobarOption
    }
  },
  setup(props) {
    return () => (
      <Space size={1}>
        {props.option.items.includes('Imports') && <Imports />}
        {props.option.items.includes('Exports') && <Exports />}
        {props.option.items.includes('Previews') && <Previews />}
        {props.option.items.includes('LintToggle') && <LintToggle />}
        {props.option.items.includes('Aligns') && <Aligns />}
        {props.option.extra && props.option.extra()}
      </Space>
    )
  }
})

export default Toolbar
