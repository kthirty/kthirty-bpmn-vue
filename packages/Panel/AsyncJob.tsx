import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { Form, FormItem, Input, Switch } from '../ui'
import { canAsync, isFlowable, readAsync, writeAsync } from '../utils/BpmnPanelModel'
import { Block, useForm } from './shared'

export default defineComponent({
  name: 'AsyncJob',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, canAsync, readAsync)
    const save = () => writeAsync(props.element, form.value)
    return () => (
      <Block title="异步作业" open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          <FormItem label="异步前" name="asyncBefore">
            <Switch v-model:checked={form.value.asyncBefore} onChange={save} />
          </FormItem>
          {isFlowable() && (
            <FormItem label="异步后" name="asyncAfter">
              <Switch v-model:checked={form.value.asyncAfter} onChange={save} />
            </FormItem>
          )}
          <FormItem label="排他" name="exclusive">
            <Switch v-model:checked={form.value.exclusive} onChange={save} />
          </FormItem>
          <FormItem label="作业优先级" name="jobPriority">
            <Input v-model:value={form.value.jobPriority} onChange={save} />
          </FormItem>
          <FormItem label="重试周期" name="retry">
            <Input v-model:value={form.value.retry} placeholder="R3/PT10M" onChange={save} />
          </FormItem>
        </Form>
      </Block>
    )
  }
})
