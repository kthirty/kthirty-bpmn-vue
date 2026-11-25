import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { canExtend, readProperties, writeProperties } from '../utils/BpmnPanelModel'
import { Block, EntryList, useForm } from './shared'

export default defineComponent({
  name: 'ExtensionProperty',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, canExtend, (element) => ({ rows: readProperties(element) }))
    const save = () => writeProperties(props.element, form.value.rows)
    return () => (
      <Block title="扩展属性" open={visible.value}>
        <EntryList
          v-model:value={form.value.rows}
          onChange={save}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'value', label: '值' }
          ]}
        />
      </Block>
    )
  }
})
