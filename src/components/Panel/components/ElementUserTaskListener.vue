<script setup lang='ts'>
  import { Element } from 'bpmn-js/lib/model/Types'
  import { onMounted, ref, watch } from 'vue'
  import { TaskListener } from '@/components/types'
  import { CollapsePanel, Table, Tag, Button, Modal, RadioGroup, Form, FormItem ,Input} from 'ant-design-vue'
  import { isUserTask } from '@/components/utils/BpmnElementType'
  import { UserTaskListener } from '@/components/utils/BpmnElementProp'
  import CollapseTitle from '@/components/common/CollapseTitle.vue'
  import LucideIcon from '@/components/common/LucideIcon.vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  defineOptions({ name: 'ElementUserTaskListener' })
  const props = defineProps<{ element: Element }>()

  const list = ref<TaskListener[]>()
  const modelVisible = ref<boolean>(false)
  const currentIndex = ref<number>(-1)
  const columns = [
    { title: '监听器类型', dataIndex: 'type', key: 'type' }
    , { title: '事件', dataIndex: 'event', key: 'event' }
    , { title: '值', dataIndex: 'value', key: 'value' }
    ,{ title: t('panel.operations'), dataIndex: 'operation',key:'operation', width: 140, align: 'center' }
  ]
  const formRules = {
    event: { required: true, message: '事件类型不能为空' },
    type: { required: true, message: '监听器类型不能为空' },
    value: { required: true, message: '监听器值不能为空' },
  }

  const loadData = () => {
    list.value = UserTaskListener.getListeners(props.element)
  }
  const openModal = (index: number = -1) => {
    if (index === -1) {
      list.value?.push({})
      index = list.value?.length - 1
    }
    currentIndex.value = index
    console.log(currentIndex.value)
    modelVisible.value = true
  }
  const removeData = (index: number) => {
    console.log('remove',index)
    list.value = list.value?.splice(index,1)
    console.log('list.value',list.value)
  }

  onMounted(loadData)
  watch(() => props.element, loadData)
  watch(() => list, (newVal) => {
    console.log(newVal)
  })

</script>
<template>
  <CollapsePanel name='element-user-task-listeners' v-if='isUserTask(props.element)'>
    <template #header>
      <CollapseTitle :title="$t('panel.userTaskListeners')">
        <LucideIcon name='Radio' />
      </CollapseTitle>
    </template>
    <template #extra>
      <Tag type='primary' round>{{ list?.length || 0 }}</Tag>
    </template>
    <Table :columns='columns' :data-source='list'>
      <template #footer>
        <Button @click='openModal()'>添加</Button>
      </template>
      <template #bodyCell="{index, column, record }">
        <template v-if="column.key === 'operation'">
          <Button @click="openModal(index)" type="primary" size="small">{{t('panel.edit')}}</Button>
          <Button @click="removeData(index)" size="small" danger>{{t('panel.remove')}}</Button>
        </template>
      </template>
    </Table>
    <Modal v-model:open='modelVisible' width='640px' :footer='false'>
      <Form ref='formRef' :model='list[currentIndex]' :rules='formRules' :labelCol='{span: 4}'>
        <FormItem name='type' :label="$t('panel.userTaskListenerType')">
          <RadioGroup option-type='button' button-style="solid" v-model:value='list[currentIndex].type' :options='["class","expression","delegateExpression"]' />
        </FormItem>
        <FormItem name='event' :label="$t('panel.userTaskListenerEvent')">
          <RadioGroup option-type='button' button-style="solid" v-model:value='list[currentIndex].event' :options='["create","assignment","complete","delete"]' />
        </FormItem>
        <FormItem name='value' :label="$t('panel.userTaskListenerValue')">
          <Input v-model:value='list[currentIndex].value'/>
        </FormItem>
      </Form>
    </Modal>
  </CollapsePanel>
</template>
