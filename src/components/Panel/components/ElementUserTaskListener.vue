<script setup lang="ts">
  import { Element } from 'bpmn-js/lib/model/Types'
  import { computed, ComputedRef, onMounted, ref, watch } from 'vue'
  import { TaskListener } from '@/components/types'
  import { CollapsePanel, Table, Tag } from 'ant-design-vue'
  import { isUserTask } from '@/components/utils/BpmnElementType'
  import { Listener, UserTaskListener } from '@/components/utils/BpmnElementProp'
  import CollapseTitle from '@/components/common/CollapseTitle.vue'
  import LucideIcon from '@/components/common/LucideIcon.vue'
  import { ColumnsType } from 'ant-design-vue/es/table'

  defineOptions({ name: 'ElementUserTaskListener' })
  const props = defineProps<{ element: Element }>()

  const list = ref<TaskListener[]>()
  const columns : ComputedRef<ColumnsType<Listener>> = computed(() => [
    // todo
  ])

  const loadData = () => {
    list.value = UserTaskListener.getListeners(props.element)
  }
  onMounted(loadData)
  watch(() => props.element,loadData)

</script>
<template>
  <CollapsePanel name="element-user-task-listeners" v-if="isUserTask(props.element)">
    <template #header>
      <CollapseTitle :title="$t('panel.userTaskListeners')">
        <LucideIcon name="Radio" />
      </CollapseTitle>
    </template>
    <template #extra>
      <Tag type="primary" round>{{ list?.length || 0 }}</Tag>
    </template>
    <Table :columns="columns" :data-source="list"></Table>
  </CollapsePanel>
</template>