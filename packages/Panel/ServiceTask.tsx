import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { Element } from 'bpmn-js/lib/model/Types'
import { PanelOption } from '../types'
import { isServiceTask } from '../utils/BpmnElementType'
import { getExPropValue, updateExPropValue } from '../utils/BpmnElementHelper'
import { Col, CollapsePanel, Form, FormItem, FormItemRest, Input, Row, Select, Textarea } from 'ant-design-vue'
import SelectableDrawer from '../SelectableDrawer'
import { DefaultOptionType } from 'ant-design-vue/es/select'

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
      serviceType: 'class' | 'expression' | 'delegateExpression',
      serviceValue: string,
      resultVariableName: string
      fields: []
    }>({ serviceType: 'class', serviceValue: '' })

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
    }
    const updateProps = () => {
      if (!visible.value) return
      updateExPropValue(props.element, formProp.value.serviceType, formProp.value.serviceValue)
      updateExPropValue(props.element, 'resultVariableName', formProp.value.resultVariableName)
    }
    onMounted(loadProps)
    watch(() => props.element, loadProps)

    const typeChange =()=> {
      formProp.value.serviceValue = ''
      updateExPropValue(props.element, 'class', '')
      updateExPropValue(props.element, 'expression', '')
      updateExPropValue(props.element, 'delegateExpression', '')
    }
    const serviceTypeOption = ref<DefaultOptionType[]>([
      { value: 'class', label: '类' },
      { value: 'expression', label: '表达式' },
      { value: 'delegateExpression', label: '代理表达式' }
    ])

    return () =>
      visible.value ? (
        <CollapsePanel
          key='ElementServiceTask'
          v-slots={{
            header: () => '服务配置',
            default: () =>
              <Form colon={false} model={formProp.value} labelCol={{ span: 6 }} validateTrigger='blur'>
                <FormItem name="serviceType" label="服务类型">
                  <Select onChange={typeChange} v-model:value={formProp.value.serviceType} options={serviceTypeOption.value} />
                </FormItem>
                <FormItem label="服务值" name="serviceValue">
                  <Textarea
                    v-model:value={formProp.value.serviceValue}
                    onChange={updateProps}
                    v-slots={{
                      addonAfter: () => (
                        <SelectableDrawer dataSource={() => props.option?.ServiceTask?.serviceDataSource(formProp.value.serviceType) || []} onSelect={(res) => (formProp.value.serviceValue = res)} />
                      )
                    }}
                  />
                </FormItem>
                <FormItem label="结果变量名" name="resultVariableName">
                  <Input v-model:value={formProp.value.resultVariableName} onChange={updateProps} />
                </FormItem>
              </Form>
          }}
        />) : (
        <div style='display: none' />
      )
  }
})
