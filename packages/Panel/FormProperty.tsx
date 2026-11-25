import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { canEditForm, readFormProperties, writeFormProperties } from '../utils/BpmnPanelModel'
import { Block, EntryList, useForm } from './shared'

export default defineComponent({
  name: 'FormProperty',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, canEditForm, (element) => ({ rows: readFormProperties(element) }))
    const save = () => writeFormProperties(props.element, form.value.rows)
    return () => (
      <Block title="表单字段" open={visible.value}>
        <EntryList
          v-model:value={form.value.rows}
          onChange={save}
          fields={[
            { key: 'id', label: '字段 ID' },
            { key: 'name', label: '名称' },
            { key: 'type', label: '类型，如 string、long、boolean、date' },
            {
              key: 'required',
              label: '必填',
              options: [
                { label: '非必填', value: 'false' },
                { label: '必填', value: 'true' }
              ]
            },
            { key: 'variable', label: '变量' },
            { key: 'default', label: '默认值' }
          ]}
        />
      </Block>
    )
  }
})
