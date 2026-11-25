import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { Form, FormItem, Input, Textarea } from '../ui'
import { readScript, writeScript } from '../utils/BpmnPanelModel'
import { Block, useForm } from './shared'

export default defineComponent({
  name: 'ScriptTask',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, (element) => is(element, 'bpmn:ScriptTask'), readScript)
    const save = () => writeScript(props.element, form.value)
    return () => (
      <Block title="脚本配置" open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          <FormItem label="脚本格式" name="scriptFormat">
            <Input v-model:value={form.value.scriptFormat} placeholder="javascript" onChange={save} />
          </FormItem>
          <FormItem label="脚本内容" name="script">
            <Textarea v-model:value={form.value.script} onChange={save} />
          </FormItem>
          <FormItem label="结果变量" name="resultVariable">
            <Input v-model:value={form.value.resultVariable} onChange={save} />
          </FormItem>
          <FormItem label="外部资源" name="resource">
            <Input v-model:value={form.value.resource} placeholder="classpath:script.js" onChange={save} />
          </FormItem>
        </Form>
      </Block>
    )
  }
})
