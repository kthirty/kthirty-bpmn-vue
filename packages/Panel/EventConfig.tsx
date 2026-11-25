import { defineComponent, type PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { Form, FormItem, Input, Select, Switch } from '../ui'
import { activityOptions, hasEventConfig, readEvent, rootOptions, writeEvent } from '../utils/BpmnPanelModel'
import { Block, useForm } from './shared'

const timerOptions = [
  { label: '日期', value: 'timeDate' },
  { label: '持续时长', value: 'timeDuration' },
  { label: '循环周期', value: 'timeCycle' }
]
const titles: Record<string, string> = {
  timer: '定时配置',
  message: '消息配置',
  signal: '信号配置',
  error: '错误配置',
  escalation: '升级配置',
  link: '链接配置',
  compensation: '补偿配置',
  conditional: '条件变量'
}

export default defineComponent({
  name: 'EventConfig',
  props: { element: { type: Object as PropType<Element>, required: true } },
  setup(props) {
    const { visible, form } = useForm(props, hasEventConfig, readEvent)
    const save = () => {
      form.value.refId = writeEvent(props.element, form.value)
    }
    const pick = (type: string, labelKey: string, id: string) => {
      form.value.refId = id
      form.value.refName = rootOptions(props.element, type, labelKey).find((item) => item.value === id)?.name || ''
      save()
    }
    return () => (
      <Block title={titles[form.value.kind] || '事件配置'} open={visible.value}>
        <Form colon={false} model={form.value} labelCol={{ span: 6 }}>
          {form.value.kind === 'timer' && (
            <>
              <FormItem label="定时类型" name="timerType">
                <Select v-model:value={form.value.timerType} options={timerOptions} onChange={save} />
              </FormItem>
              <FormItem label="定时值" name="timerValue">
                <Input
                  v-model:value={form.value.timerValue}
                  placeholder={form.value.timerType === 'timeDuration' ? 'PT5M' : form.value.timerType === 'timeCycle' ? 'R3/PT10H' : '2026-01-01T00:00:00'}
                  onChange={save}
                />
              </FormItem>
            </>
          )}
          {form.value.kind === 'message' && (
            <>
              <FormItem label="消息" name="refId">
                <Select
                  v-model:value={form.value.refId}
                  options={rootOptions(props.element, 'bpmn:Message', 'name')}
                  placeholder="选择已有消息"
                  onChange={(id: string) => pick('bpmn:Message', 'name', id)}
                />
              </FormItem>
              <FormItem label="消息名称" name="refName">
                <Input v-model:value={form.value.refName} onChange={save} />
              </FormItem>
            </>
          )}
          {form.value.kind === 'signal' && (
            <>
              <FormItem label="信号" name="refId">
                <Select
                  v-model:value={form.value.refId}
                  options={rootOptions(props.element, 'bpmn:Signal', 'name')}
                  placeholder="选择已有信号"
                  onChange={(id: string) => pick('bpmn:Signal', 'name', id)}
                />
              </FormItem>
              <FormItem label="信号名称" name="refName">
                <Input v-model:value={form.value.refName} onChange={save} />
              </FormItem>
            </>
          )}
          {form.value.kind === 'error' && (
            <>
              <FormItem label="错误" name="refId">
                <Select
                  v-model:value={form.value.refId}
                  options={rootOptions(props.element, 'bpmn:Error', 'errorCode')}
                  placeholder="选择已有错误"
                  onChange={(id: string) => pick('bpmn:Error', 'errorCode', id)}
                />
              </FormItem>
              <FormItem label="错误码" name="refName">
                <Input v-model:value={form.value.refName} onChange={save} />
              </FormItem>
              <FormItem label="错误消息" name="errorMessage">
                <Input v-model:value={form.value.errorMessage} onChange={save} />
              </FormItem>
              <FormItem label="错误码变量" name="errorCodeVariable">
                <Input v-model:value={form.value.errorCodeVariable} onChange={save} />
              </FormItem>
              <FormItem label="错误消息变量" name="errorMessageVariable">
                <Input v-model:value={form.value.errorMessageVariable} onChange={save} />
              </FormItem>
            </>
          )}
          {form.value.kind === 'escalation' && (
            <>
              <FormItem label="升级" name="refId">
                <Select
                  v-model:value={form.value.refId}
                  options={rootOptions(props.element, 'bpmn:Escalation', 'escalationCode')}
                  placeholder="选择已有升级"
                  onChange={(id: string) => pick('bpmn:Escalation', 'escalationCode', id)}
                />
              </FormItem>
              <FormItem label="升级码" name="refName">
                <Input v-model:value={form.value.refName} onChange={save} />
              </FormItem>
              <FormItem label="升级码变量" name="escalationCodeVariable">
                <Input v-model:value={form.value.escalationCodeVariable} onChange={save} />
              </FormItem>
            </>
          )}
          {form.value.kind === 'link' && (
            <FormItem label="链接名称" name="linkName">
              <Input v-model:value={form.value.linkName} onChange={save} />
            </FormItem>
          )}
          {form.value.kind === 'compensation' && (
            <>
              <FormItem label="补偿活动" name="activityId">
                <Select v-model:value={form.value.activityId} options={activityOptions(props.element)} placeholder="选择活动" onChange={save} />
              </FormItem>
              <FormItem label="等待完成" name="waitForCompletion">
                <Switch v-model:checked={form.value.waitForCompletion} onChange={save} />
              </FormItem>
            </>
          )}
          {form.value.kind === 'conditional' && (
            <>
              <FormItem label="变量名" name="variableName">
                <Input v-model:value={form.value.variableName} onChange={save} />
              </FormItem>
              <FormItem label="变量事件" name="variableEvent">
                <Input v-model:value={form.value.variableEvent} placeholder="create,update" onChange={save} />
              </FormItem>
            </>
          )}
        </Form>
      </Block>
    )
  }
})
