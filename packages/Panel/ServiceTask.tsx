import { defineComponent, onMounted, type PropType, ref, watch } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import type { Field, PanelOption } from '../types'
import { isServiceTask } from '../utils/BpmnElementType'
import { getExPropValue, updateExPropValue } from '../utils/BpmnElementHelper'
import { CollapsePanel, Form, FormItem, Input, RadioGroup, Textarea } from '../ui'
import SelectableDrawer from '../SelectableDrawer'
import FieldDrawer from '../FieldDrawer'
import { ServiceTask } from '../utils/BpmnElementProp'

export default defineComponent({
  name: 'ServiceTask',
  props: {
    element: {
      type: Object as PropType<Element>,
      required: true
    },
    option: {
      type: Object as PropType<PanelOption>,
      required: false
    }
  },
  setup(props) {
    const visible = ref<boolean>(false)
    const formProp = ref<{
      serviceType: 'class' | 'expression' | 'delegateExpression'
      serviceValue: string
      resultVariable: string
      type: string
      topic: string
      fields: Field[]
    }>({ serviceType: 'class', serviceValue: '', resultVariable: '', type: '', topic: '', fields: [] })

    const loadProps = () => {
      visible.value = isServiceTask(props.element)
      if (!visible.value) return
      const classVar = getExPropValue<string>(props.element, 'class')
      const expression = getExPropValue<string>(props.element, 'expression')
      const delegateExpression = getExPropValue<string>(props.element, 'delegateExpression')
      if (classVar) {
        formProp.value.serviceType = 'class'
        formProp.value.serviceValue = classVar
      } else if (expression) {
        formProp.value.serviceType = 'expression'
        formProp.value.serviceValue = expression
      } else if (delegateExpression) {
        formProp.value.serviceType = 'delegateExpression'
        formProp.value.serviceValue = delegateExpression
      } else {
        formProp.value.serviceType = 'class'
        formProp.value.serviceValue = ''
      }
      formProp.value.resultVariable = getExPropValue<string>(props.element, 'resultVariable') || ''
      formProp.value.type = getExPropValue<string>(props.element, 'type') || ''
      formProp.value.topic = getExPropValue<string>(props.element, 'topic') || ''
      formProp.value.fields = ServiceTask.getField(props.element)
    }
    const updateProps = () => {
      if (!visible.value) return
      updateExPropValue(props.element, formProp.value.serviceType, formProp.value.serviceValue)
      updateExPropValue(props.element, 'resultVariable', formProp.value.resultVariable)
      updateExPropValue(props.element, 'type', formProp.value.type)
      updateExPropValue(props.element, 'topic', formProp.value.topic)
      ServiceTask.setField(props.element, formProp.value.fields)
    }
    onMounted(loadProps)
    watch(() => props.element, loadProps)

    const typeChange = () => {
      formProp.value.serviceValue = ''
      updateExPropValue(props.element, 'class', '')
      updateExPropValue(props.element, 'expression', '')
      updateExPropValue(props.element, 'delegateExpression', '')
    }
    const serviceTypeOption = ref<{ label: string; value: string }[]>([
      { value: 'class', label: '类' },
      { value: 'expression', label: '表达式' },
      { value: 'delegateExpression', label: '代理表达式' }
    ])

    return () =>
      visible.value ? (
        <CollapsePanel
          key="ElementServiceTask"
          v-slots={{
            header: () => '服务配置',
            default: () => (
              <Form colon={false} model={formProp.value} labelCol={{ span: 6 }} validateTrigger="blur">
                <FormItem name="serviceType" label="服务类型">
                  <RadioGroup onChange={typeChange} v-model:value={formProp.value.serviceType} options={serviceTypeOption.value} />
                </FormItem>
                <FormItem label="服务值" name="serviceValue">
                  <Textarea
                    v-model:value={formProp.value.serviceValue}
                    onChange={updateProps}
                    v-slots={{
                      addonAfter: () => {
                        const select = (res: string) => {
                          formProp.value.serviceValue = res
                          updateProps()
                        }
                        const addon = props.option?.ServiceTask?.serviceAddon
                        return addon ? (
                          addon({ onSelect: select })
                        ) : (
                          <SelectableDrawer dataSource={() => props.option?.ServiceTask?.serviceDataSource?.(formProp.value.serviceType) || []} onSelect={select} />
                        )
                      }
                    }}
                  />
                </FormItem>
                <FormItem label="结果变量名" name="resultVariable">
                  <Input v-model:value={formProp.value.resultVariable} onChange={updateProps} />
                </FormItem>
                <FormItem label="外部类型" name="type" tooltip="如 external、http">
                  <Input v-model:value={formProp.value.type} placeholder="external" onChange={updateProps} />
                </FormItem>
                <FormItem label="主题" name="topic">
                  <Input v-model:value={formProp.value.topic} onChange={updateProps} />
                </FormItem>
                <FieldDrawer v-model:value={formProp.value.fields} onChange={updateProps} />
              </Form>
            )
          }}
        />
      ) : (
        <div style="display: none" />
      )
  }
})
