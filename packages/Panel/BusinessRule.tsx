import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { Form, FormItem, Input, Select } from '../ui'
import { readBusinessRule, writeBusinessRule } from '../utils/BpmnPanelModel'
import { Block, useForm } from './shared'

const modeOptions = [
  { label: '决策表', value: 'dmn' },
  { label: '类', value: 'class' },
  { label: '表达式', value: 'expression' },
  { label: '代理表达式', value: 'delegateExpression' }
]
const bindingOptions = [
  { label: '最新版本', value: 'latest' },
  { label: '部署版本', value: 'deployment' },
  { label: '指定版本', value: 'version' }
]
const resultOptions = [
  { label: '结果列表', value: 'resultList' },
  { label: '单条结果', value: 'singleResult' },
  { label: '单值', value: 'singleEntry' },
  { label: '收集结果', value: 'collectEntries' }
]

export default defineComponent({
  name: 'BusinessRule',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, (element) => is(element, 'bpmn:BusinessRuleTask'), readBusinessRule)
    const save = () => writeBusinessRule(props.element, form.value)
    return () => (
      <Block title="规则配置" open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          <FormItem label="实现方式" name="mode">
            <Select v-model:value={form.value.mode} options={modeOptions} onChange={save} />
          </FormItem>
          <FormItem label={form.value.mode === 'dmn' ? '决策引用' : '实现值'} name="value">
            <Input v-model:value={form.value.value} onChange={save} />
          </FormItem>
          {form.value.mode === 'dmn' && (
            <>
              <FormItem label="绑定方式" name="binding">
                <Select v-model:value={form.value.binding} options={bindingOptions} onChange={save} />
              </FormItem>
              {form.value.binding === 'version' && (
                <FormItem label="版本" name="version">
                  <Input v-model:value={form.value.version} onChange={save} />
                </FormItem>
              )}
              <FormItem label="租户" name="tenantId">
                <Input v-model:value={form.value.tenantId} onChange={save} />
              </FormItem>
              <FormItem label="结果映射" name="mapDecisionResult">
                <Select v-model:value={form.value.mapDecisionResult} options={resultOptions} onChange={save} />
              </FormItem>
            </>
          )}
          <FormItem label="结果变量" name="resultVariable">
            <Input v-model:value={form.value.resultVariable} onChange={save} />
          </FormItem>
        </Form>
      </Block>
    )
  }
})
