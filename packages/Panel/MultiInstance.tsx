import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { Form, FormItem, Input, Switch } from '../ui'
import { readMulti, writeMulti } from '../utils/BpmnPanelModel'
import { Block, useForm } from './shared'

export default defineComponent({
  name: 'MultiInstance',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, (element) => is(element, 'bpmn:Activity'), readMulti)
    const save = () => writeMulti(props.element, form.value)
    return () => (
      <Block title="多实例" open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          <FormItem label="启用" name="enabled">
            <Switch v-model:checked={form.value.enabled} onChange={save} />
          </FormItem>
          {form.value.enabled && (
            <>
              <FormItem label="串行" name="sequential">
                <Switch v-model:checked={form.value.sequential} onChange={save} />
              </FormItem>
              <FormItem label="集合" name="collection">
                <Input v-model:value={form.value.collection} placeholder="${list}" onChange={save} />
              </FormItem>
              <FormItem label="元素变量" name="elementVariable">
                <Input v-model:value={form.value.elementVariable} onChange={save} />
              </FormItem>
              <FormItem label="基数" name="cardinality">
                <Input v-model:value={form.value.cardinality} placeholder="${nrOfInstances}" onChange={save} />
              </FormItem>
              <FormItem label="完成条件" name="completion">
                <Input v-model:value={form.value.completion} placeholder="${nrOfCompletedInstances/nrOfInstances >= 1}" onChange={save} />
              </FormItem>
            </>
          )}
        </Form>
      </Block>
    )
  }
})
