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

  const form = ref<UserAssigneeProp>({})
  const updateUserAssignProp = (key: string, value: string) => {
    console.log('updateUserAssignProp', key, value)
    updateExPropValue(props.element, key, value)
  }
  const reloadData = () => {
    if(!isUserTask(props.element)){
      form.value = {}
      return
    }
    form.value.assignee = getExPropValue<string>(props.element,'assignee')
    form.value.candidateUsers = getExPropValue<string>(props.element,'candidateUsers')
    form.value.candidateGroups = getExPropValue<string>(props.element,'candidateGroups')
    form.value.dueDate = getExPropValue(props.element,'dueDate')
    form.value.priority = getExPropValue(props.element,'priority')
    console.log('form',form.value)
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
        <Input v-model:value="form.assignee" @change="updateUserAssignProp('assignee', form.assignee || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.candidateUsers')">
        <Input v-model:value="form.candidateUsers" @change="updateUserAssignProp('candidateUsers', form.candidateUsers || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.candidateGroups')">
        <Input v-model:value="form.candidateGroups" @change="updateUserAssignProp('candidateGroups', form.candidateGroups || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.dueDate')" description="The due date as an EL expression (e.g. ${someDate}) or an ISO date (e.g. 2015-06-26T09:54:00).">
        <Input v-model:value="form.dueDate" @change="updateUserAssignProp('dueDate', form.dueDate || '')" />
      </EditItem>
      <EditItem :label-width="100" :label="$t('panel.priority')">
        <Input v-model:value="form.priority" @change="updateUserAssignProp('priority', form.priority || '')" />
      </EditItem>
    </div>
  </CollapsePanel>
</template>
