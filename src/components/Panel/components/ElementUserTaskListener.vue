<script setup lang="ts">
  import { Element } from 'bpmn-js/lib/model/Types'
  import { computed, ComputedRef, onMounted, ref, watch } from 'vue'
  import { TaskListener } from '@/components/types'
  import { CollapsePanel, Table, Tag ,Button } from 'ant-design-vue'
  import { isUserTask } from '@/components/utils/BpmnElementType'
  import { UserTaskListener } from '@/components/utils/BpmnElementProp'
  import CollapseTitle from '@/components/common/CollapseTitle.vue'
  import LucideIcon from '@/components/common/LucideIcon.vue'

  defineOptions({ name: 'ElementUserTaskListener' })
  const props = defineProps<{ element: Element }>()

  const list = ref<TaskListener[]>()
  const columns = [
    {
      title: '监听器类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '事件',
      dataIndex: 'event',
      key: 'event',
    }, {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    }
  ]

  const loadData = () => {
    list.value = UserTaskListener.getListeners(props.element)
  }
  const openModal = () => {

  }

  onMounted(loadData)
  watch(() => props.element,loadData)
  watch(() => list,(newVal) => {
    console.log(newVal)
  })

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
    <Table :columns="columns" :data-source="list">
      <template #footer>
        <Button @click="openModal">添加</Button>
      </template>
    </Table>
  </CollapsePanel>
</template>
