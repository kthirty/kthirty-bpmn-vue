import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { Form, FormItem, Input, Select } from '../ui'
import { readCall, writeCall } from '../utils/BpmnPanelModel'
import { Block, EntryList, useForm } from './shared'

const bindingOptions = [
  { label: '最新版本', value: 'latest' },
  { label: '部署版本', value: 'deployment' },
  { label: '指定版本', value: 'version' },
  { label: '版本标签', value: 'versionTag' }
]

export default defineComponent({
  name: 'CallActivity',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, (element) => is(element, 'bpmn:CallActivity'), readCall)
    const save = () => writeCall(props.element, form.value)
    return () => (
      <Block title="调用配置" open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          <FormItem label="被调用流程" name="calledElement">
            <Input v-model:value={form.value.calledElement} onChange={save} />
          </FormItem>
          <FormItem label="绑定方式" name="binding">
            <Select v-model:value={form.value.binding} options={bindingOptions} onChange={save} />
          </FormItem>
          {form.value.binding === 'version' && (
            <FormItem label="版本" name="version">
              <Input v-model:value={form.value.version} onChange={save} />
            </FormItem>
          )}
          {form.value.binding === 'versionTag' && (
            <FormItem label="版本标签" name="versionTag">
              <Input v-model:value={form.value.versionTag} onChange={save} />
            </FormItem>
          )}
          <FormItem label="租户" name="tenantId">
            <Input v-model:value={form.value.tenantId} onChange={save} />
          </FormItem>
          <FormItem label="变量映射">
            <EntryList
              v-model:value={form.value.mappings}
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
                { key: 'source', label: '来源，表达式以 ${ 开头' },
                { key: 'target', label: '目标' }
              ]}
            />
          </FormItem>
        </Form>
      </Block>
    )
  }
})
