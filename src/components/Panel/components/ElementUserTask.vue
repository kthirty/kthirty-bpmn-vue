<script setup lang="ts">
  import { CollapsePanel,Input } from 'ant-design-vue'
  import EditItem from '../../common/EditItem.vue'
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import { onMounted, ref, watch } from 'vue'
  import { Element } from 'bpmn-js/lib/model/Types'
  import { getExPropValue, updateExPropValue } from '../../utils/BpmnElementHelper'
  import { isUserTask } from '@/components/utils/BpmnElementType'

  defineOptions({ name: 'ElementUserTask' })
  const props = defineProps<{element: Element}>()

  interface UserAssigneeProp {
    assignee?: string
    candidateUsers?: string
    candidateGroups?: string
    dueDate?: string
    priority?: string
  }

  const Form = ref<UserAssigneeProp>({})
  const updateUserAssignProp = (key: string, value: string) => {
    updateExPropValue(props.element, key, value)
  }
  const reloadData = () => {
    Object.keys(Form.value).forEach((key:string) => {
      Form[key] = getExPropValue(props.element,key);
    })
  }
  onMounted(reloadData)
  watch(() => props.element,reloadData)

</script>
<template>
  <CollapsePanel name="element-user-assignment" v-if="isUserTask(props.element)">
    <template #header>
      <CollapseTitle title="用户分配">
        <LucideIcon name="Contact" />
      </CollapseTitle>
    </template>
    <div>
      <EditItem :label-width="100" :label="$t('panel.assignee')">
        <Input v-model:value="Form.assignee" @change="updateUserAssignProp('assignee', Form.assignee || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.candidateUsers')">
        <Input v-model:value="Form.candidateUsers" @change="updateUserAssignProp('candidateUsers', Form.candidateUsers || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.candidateGroups')">
        <Input v-model:value="Form.candidateGroups" @change="updateUserAssignProp('candidateGroups', Form.candidateGroups || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.dueDate')" description="The due date as an EL expression (e.g. ${someDate}) or an ISO date (e.g. 2015-06-26T09:54:00).">
        <Input v-model:value="Form.dueDate" @change="updateUserAssignProp('dueDate', Form.dueDate || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.priority')">
        <Input v-model:value="Form.priority" @change="updateUserAssignProp('priority', Form.priority || '')" />
      </EditItem>
    </div>
  </CollapsePanel>
</template>