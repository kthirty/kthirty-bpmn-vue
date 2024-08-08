import { defineComponent, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { isCanSetConditional } from '../utils/BpmnElementType'
import { CollapsePanel, Form, FormItem, Select, Textarea } from 'ant-design-vue'
import { Conditional } from '../utils/BpmnElementProp'

interface ConditionForm {
  type: 'none' | 'default' | 'expression' | string
  expression?: string
}

const options = [
  { label: '无条件( None )', value: 'none' },
  { label: '默认路径( Default )', value: 'default' },
  { label: '条件表达式( Expression )', value: 'expression' }
]

export default defineComponent({
  name: 'ElementCondition',
  props: {
    element: {
      type: Object as PropType<Element>,
      required: true
    }
  },
  setup(props) {
    const visible = ref<boolean>(false)
    const conditionForm = ref<ConditionForm>({ type: 'none' })
    const formRef = ref<HTMLFormElement>()

    const loadProps = () => {
      visible.value = isCanSetConditional(props.element)
      conditionForm.value.type = Conditional.getConditionTypeValue(props.element)
      if (conditionForm.value.type === 'expression') {
        conditionForm.value.expression = Conditional.getConditionExpressionValue(props.element)
      }
    }
    const updateProperties = () => {
      Conditional.setConditionTypeValue(props.element, conditionForm.value.type)
      if (conditionForm.value.type === 'expression') {
        Conditional.setConditionExpressionValue(props.element, conditionForm.value.expression)
      }
    }

    onMounted(loadProps)
    watch(() => props.element, loadProps)

    return () =>
      visible.value ? (
        <CollapsePanel
          name="ElementCondition"
          v-slots={{
            header: () => '流转条件',
            default: () => (
              <Form
                ref={formRef}
                model={conditionForm.value}
                autocomplete="off"
                labelCol={{ span: 6 }}
                validateTrigger="blur"
              >
                <FormItem required={true} label="类型" name="type">
                  <Select onChange={updateProperties} options={options} v-model:value={conditionForm.value.type} />
                </FormItem>
                {conditionForm.value.type === 'expression' && (
                  <FormItem required={true} label="条件表达式" name="expression">
                    <Textarea onChange={updateProperties} v-model:value={conditionForm.value.expression} />
                  </FormItem>
                )}
              </Form>
            )
          }}
        />
      ) : (
        <div style="display: none" />
      )
  }
})
