import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { canMapIo, readIo, writeIo } from '../utils/BpmnPanelModel'
import { Block, EntryList, useForm } from './shared'

export default defineComponent({
  name: 'IoMapping',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, canMapIo, (element) => ({ rows: readIo(element) }))
    const save = () => writeIo(props.element, form.value.rows)
    return () => (
      <Block title="输入输出" open={visible.value}>
        <EntryList
          v-model:value={form.value.rows}
          onChange={save}
          fields={[
            {
              key: 'direction',
              label: '方向',
              options: [
                { label: '输入', value: 'in' },
                { label: '输出', value: 'out' }
              ]
            },
            { key: 'name', label: '名称' },
            { key: 'value', label: '值' }
          ]}
        />
      </Block>
    )
  }
})
