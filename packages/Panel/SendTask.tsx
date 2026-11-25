import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { Form, FormItem, Input, RadioGroup, Select } from '../ui'
import { readSend, rootOptions, writeSend } from '../utils/BpmnPanelModel'
import { Block, useForm } from './shared'

const typeOptions = [
  { label: '类', value: 'class' },
  { label: '表达式', value: 'expression' },
  { label: '代理表达式', value: 'delegateExpression' }
]

export default defineComponent({
  name: 'SendTask',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, (element) => is(element, 'bpmn:SendTask'), readSend)
    const save = () => {
      form.value.messageId = writeSend(props.element, form.value)
    }
    return () => (
      <Block title="发送配置" open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          <FormItem label="实现方式" name="serviceType">
            <RadioGroup v-model:value={form.value.serviceType} options={typeOptions} onChange={save} />
          </FormItem>
          <FormItem label="实现值" name="serviceValue">
            <Input v-model:value={form.value.serviceValue} onChange={save} />
          </FormItem>
          <FormItem label="结果变量" name="resultVariable">
            <Input v-model:value={form.value.resultVariable} onChange={save} />
          </FormItem>
          <FormItem label="外部类型" name="type">
            <Input v-model:value={form.value.type} placeholder="external" onChange={save} />
          </FormItem>
          <FormItem label="主题" name="topic">
            <Input v-model:value={form.value.topic} onChange={save} />
          </FormItem>
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
        </Form>
      </Block>
    )
  }
})
