import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { Form, FormItem, Input, Select, Switch } from '../ui'
import { readReceive, rootOptions, writeReceive } from '../utils/BpmnPanelModel'
import { Block, useForm } from './shared'

export default defineComponent({
  name: 'ReceiveTask',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, (element) => is(element, 'bpmn:ReceiveTask'), readReceive)
    const save = () => {
      form.value.messageId = writeReceive(props.element, form.value)
    }
    return () => (
      <Block title="接收配置" open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          <FormItem label="消息" name="messageId">
            <Select
              v-model:value={form.value.messageId}
              options={rootOptions(props.element, 'bpmn:Message', 'name')}
              placeholder="选择已有消息"
              onChange={(id: string) => {
                form.value.messageName = rootOptions(props.element, 'bpmn:Message', 'name').find((item) => item.value === id)?.name || ''
                save()
              }}
            />
          </FormItem>
          <FormItem label="消息名称" name="messageName">
            <Input v-model:value={form.value.messageName} onChange={save} />
          </FormItem>
          <FormItem label="实例化" name="instantiate">
            <Switch v-model:checked={form.value.instantiate} onChange={save} />
          </FormItem>
        </Form>
      </Block>
    )
  }
})
