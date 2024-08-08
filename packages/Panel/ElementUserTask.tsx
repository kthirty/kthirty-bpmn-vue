import { defineComponent, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { isUserTask } from '../utils/BpmnElementType'
import { Button, CollapsePanel, Form, FormItem, Input, InputGroup } from 'ant-design-vue'
import { Settings } from 'lucide-vue-next'
import { getExPropValue, updateExPropValue } from '../utils/BpmnElementHelper'

interface UserAssigneeProp {
  assignee?: string
  candidateUsers?: string
  candidateGroups?: string
  dueDate?: string
  priority?: string
}

export default defineComponent({
  name: 'ElementUserTask',
  props: {
    element: {
      type: Object as PropType<Element>,
      required: true
    }
  },
  setup(props) {
    const visible = ref<boolean>(false)
    const formProp = ref<UserAssigneeProp>({})
    const formRef = ref<HTMLFormElement>()

    const loadProps = () => {
      visible.value = isUserTask(props.element)
      if (!visible.value) return
      formProp.value.assignee = getExPropValue<string>(props.element, 'assignee')
      formProp.value.candidateUsers = getExPropValue<string>(props.element, 'candidateUsers')
      formProp.value.candidateGroups = getExPropValue<string>(props.element, 'candidateGroups')
      formProp.value.dueDate = getExPropValue<string>(props.element, 'dueDate')
    }
    const updateProps = () => {
      if (!visible.value) return
      updateExPropValue(props.element, 'assignee', formProp.value.assignee || '')
      updateExPropValue(props.element, 'candidateUsers', formProp.value.candidateUsers || '')
      updateExPropValue(props.element, 'candidateGroups', formProp.value.candidateGroups || '')
      updateExPropValue(props.element, 'dueDate', formProp.value.dueDate || '')
    }

    onMounted(loadProps)
    watch(() => props.element, loadProps)

    return () =>
      visible.value ? (
        <CollapsePanel
          name="ElementUserTask"
          v-slots={{
            header: () => '任务配置',
            default: () => (
              <>
                {formProp.value && (
                  <Form
                    ref={formRef}
                    model={formProp.value}
                    autocomplete="off"
                    labelCol={{ span: 6 }}
                    validateTrigger="blur"
                  >
                    <FormItem label="任务人" name="assignee">
                      <InputGroup compact>
                        <Input
                          style="width: calc(100% - 40px)"
                          v-model:value={formProp.value.assignee}
                          onChange={updateProps}
                        />
                        <Button v-slots={{ icon: () => <Settings size={18} /> }} />
                      </InputGroup>
                    </FormItem>
                    <FormItem label="候选人" name="candidateUsers">
                      <InputGroup compact>
                        <Input
                          style="width: calc(100% - 40px)"
                          v-model:value={formProp.value.candidateUsers}
                          onChange={updateProps}
                        />
                        <Button v-slots={{ icon: () => <Settings size={18} /> }} />
                      </InputGroup>
                    </FormItem>
                    <FormItem label="候选组" name="candidateGroups">
                      <InputGroup compact>
                        <Input
                          style="width: calc(100% - 40px)"
                          v-model:value={formProp.value.candidateGroups}
                          onChange={updateProps}
                        />
                        <Button v-slots={{ icon: () => <Settings size={18} /> }} />
                      </InputGroup>
                    </FormItem>
                    <FormItem label="到期日" name="dueDate">
                      <InputGroup compact>
                        <Input
                          style="width: calc(100% - 40px)"
                          v-model:value={formProp.value.dueDate}
                          onChange={updateProps}
                        />
                        <Button v-slots={{ icon: () => <Settings size={18} /> }} />
                      </InputGroup>
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
