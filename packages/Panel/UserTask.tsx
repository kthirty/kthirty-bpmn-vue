import { Col, CollapsePanel, Form, FormItem, FormItemRest, Input, Row, Select } from 'ant-design-vue'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import type { Element } from 'bpmn-js/lib/model/Types'
import type { PropType } from 'vue'
import { defineComponent, onMounted, ref, watch } from 'vue'
import SelectableDrawer from '../SelectableDrawer'
import type { DataSourceItem, PanelOption } from '../types'
import { getExPropValue, updateExPropValue } from '../utils/BpmnElementHelper'
import { isUserTask } from '../utils/BpmnElementType'

export default defineComponent({
  name: 'UserTask',
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
      assigneeType: string
      assigneeValue?: string
      dueDate?: string
      skipExpression?: string
    }>({ assigneeType: 'assignee' })
    const assigneeTypeOption = ref<DefaultOptionType[]>([
      { value: 'assignee', label: '任务人' },
      { value: 'candidateUsers', label: '候选人' },
      { value: 'candidateGroups', label: '候选组' }
    ])

    const loadProps = () => {
      visible.value = isUserTask(props.element)
      if (!visible.value) return
      const assignee = getExPropValue<string>(props.element, 'assignee')
      const candidateUsers = getExPropValue<string>(props.element, 'candidateUsers')
      const candidateGroups = getExPropValue<string>(props.element, 'candidateGroups')
      const skipExpression = getExPropValue<string>(props.element, 'skipExpression')
      if (assignee) {
        formProp.value.assigneeType = 'assignee'
        formProp.value.assigneeValue = assignee
      }
      if (candidateUsers) {
        formProp.value.assigneeType = 'candidateUsers'
        formProp.value.assigneeValue = candidateUsers
      }
      if (candidateGroups) {
        formProp.value.assigneeType = 'candidateGroups'
        formProp.value.assigneeValue = candidateGroups
      }
      formProp.value.dueDate = getExPropValue<string>(props.element, 'dueDate')
      formProp.value.skipExpression = skipExpression
    }
    const updateProps = () => {
      if (!visible.value) return
      updateExPropValue(props.element, formProp.value.assigneeType, formProp.value.assigneeValue)
      updateExPropValue(props.element, 'dueDate', formProp.value.dueDate)
      updateExPropValue(props.element, 'skipExpression', formProp.value.skipExpression)
    }

    onMounted(loadProps)
    watch(() => props.element, loadProps)
    const assigneeTypeChange = () => {
      formProp.value.assigneeValue = undefined
      updateExPropValue(props.element, 'assignee', undefined)
      updateExPropValue(props.element, 'candidateUsers', undefined)
      updateExPropValue(props.element, 'candidateGroups', undefined)
    }

    const dataSource = ref({
      assigneeDataSource: [],
      dueDateDataSource: [],
      skipExpressionDataSource: []
    })

    return () =>
      visible.value ? (
        <CollapsePanel
          key="ElementUserTask"
          v-slots={{
            header: () => '任务配置',
            default: () => (
              <>
                {formProp.value && (
                  <Form colon={false} model={formProp.value} labelCol={{ span: 6 }} validateTrigger="blur">
                    <FormItem name="assignee">
                      <div>
                        <Row>
                          <Col span={6}>
                            <FormItemRest>
                              <Select onChange={assigneeTypeChange} v-model:value={formProp.value.assigneeType} options={assigneeTypeOption.value} />
                            </FormItemRest>
                          </Col>
                          <Col span={18}>
                            <Input
                              v-model:value={formProp.value.assigneeValue}
                              onChange={updateProps}
                              v-slots={
                                dataSource.value.assigneeDataSource.length > 0 && {
                                  addonAfter: () => <SelectableDrawer v-model:value={formProp.value.assigneeValue} dataSource={() => dataSource.value.assigneeDataSource} />
                                }
                              }
                            />
                          </Col>
                        </Row>
                      </div>
                    </FormItem>
                    <FormItem label="到期日" name="dueDate">
                      <Input
                        v-model:value={formProp.value.dueDate}
                        onChange={updateProps}
                        v-slots={
                          dataSource.value.dueDateDataSource.length > 0 && {
                            addonAfter: () => <SelectableDrawer v-model:value={formProp.value.dueDate} dataSource={() => dataSource.value.dueDateDataSource} />
                          }
                        }
                      />
                    </FormItem>
                    <FormItem label="跳过表达式" name="skipExpression">
                      <Input
                        v-model:value={formProp.value.skipExpression}
                        onChange={updateProps}
                        v-slots={dataSource.value.skipExpressionDataSource.length > 0 &&{
                          addonAfter: () => (
                            <SelectableDrawer v-model:value={formProp.value.skipExpression} dataSource={() => dataSource.value.skipExpressionDataSource} />
                          )
                        }}
                      />
                    </FormItem>
                  </Form>
                )}
              </>
            )
          }}
        />
      ) : (
        <div style="display: none" />
      )
  }
})
