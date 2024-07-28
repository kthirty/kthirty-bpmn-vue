<script setup lang="ts">
  import {
    CollapsePanel,
    Input,
    Tag,
    Table,
    Button,
    Modal,
    Form,
    FormItem,
    Select,
    Textarea,
    RadioGroup,
    FormInstance
  } from 'ant-design-vue'
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import { computed, ComputedRef, markRaw, nextTick, ref } from 'vue'
  import { BpmnExecutionListener, BpmnScript, ExecutionListenerForm, FormItemVisible } from '../../types'
  import { ColumnsType } from 'ant-design-vue/es/table'
  import { Element, ModdleElement } from 'bpmn-js/lib/model/Types'
  import { Listener, Script } from '../../utils/BpmnElementProp'
  import { isExecutable } from '@/components/utils/BpmnElementType'

  defineOptions({ name: 'ElementExecutionListeners' })
  const props = defineProps<{ element: Element }>()
  import { useI18n } from 'vue-i18n'
  import { RadioGroupChildOption } from 'ant-design-vue/es/radio/Group'
  const { t } = useI18n()

  const formRef = ref<FormInstance | null>(null)
  // Table
  const listeners = ref<ExecutionListenerForm[]>([])
  const columns: ComputedRef<ColumnsType<ExecutionListenerForm>> = computed(() => [
    { title: t('panel.index'), dataIndex: 'index', customRender: ({ index }) => index + 1, width: 60 },
    { title: 'EventType', dataIndex: 'event', width: 140 },
    { title: 'ListenerType', dataIndex: 'type', width: 140 },
    { title: t('panel.operations'), dataIndex: 'operation',key:'operation', width: 140, align: 'center' }
  ])
  // Form
  const listenerEventTypeOptions = ref<RadioGroupChildOption[]>([
    { label: 'Start', value: 'start' },
    { label: 'End', value: 'end' },
    { label: 'Take', value: 'take' }
  ])
  const listenerTypeOptions = ref<RadioGroupChildOption[]>([
    { label: 'Java Class', value: 'class' },
    { label: 'Expression', value: 'expression' },
    { label: 'DelegateExpression', value: 'delegateExpression' },
    { label: 'Script', value: 'script' }
  ])
  const scriptTypeOptions = ref<RadioGroupChildOption[]>([
    { label: 'External Resource', value: 'external' },
    { label: 'Inline Script', value: 'inline' },
    { label: 'None', value: 'none' }
  ])
  const formRules = {
    event: { required: true, message: '事件类型不能为空' },
    type: { required: true, message: '监听器类型不能为空' }
  }
  const formItemVisible = ref<FormItemVisible>({
    listenerType: 'class',
    scriptType: 'none'
  })
  const newListener = ref<ExecutionListenerForm>({ event: '', type: 'class' })
  const modelVisible = ref<boolean>(false)
  let activeIndex = -1
  let listenersRaw = markRaw([])

  // function
  const updateScriptType = (value: string) => {
    formItemVisible.value.scriptType = value
    newListener.value.script = {
      scriptFormat: newListener.value.script?.scriptFormat,
      scriptType: value
    }
  }
  const saveExecutionListener = async () => {
    await formRef.value!.validate()
    activeIndex === -1
      ? Listener.addExecutionListener(props.element, newListener.value)
      : Listener.updateExecutionListener(props.element, newListener.value, listenersRaw[activeIndex])
    reloadExtensionListeners()
  }
  const updateListenerType = (value:string) => {
    formItemVisible.value.listenerType = value
    newListener.value = {
      ...newListener.value,
      type: value,
      ...(value === 'script' ? { script: newListener.value.script || {} } : {})
    }
  }
  const reloadExtensionListeners = () => {
    modelVisible.value = false
    updateListenerType('class')
    newListener.value = { event: Listener.getDefaultEvent(props.element), type: 'class' }
    listenerEventTypeOptions.value = Listener.getExecutionListenerTypes(props.element);
    (listenersRaw as ModdleElement[]) = markRaw(Listener.getExecutionListeners(props.element as Element))
    const list = listenersRaw.map(
      (item: ModdleElement & BpmnExecutionListener): ExecutionListenerForm => ({
        ...item,
        ...(item.script ? {
          script: {
            ...item.script,
            scriptType: Script.getScriptType(item.script as ModdleElement & BpmnScript)
          }
        } : {}),
        type: Listener.getExecutionListenerType(item)
      })
    )
    listeners.value = JSON.parse(JSON.stringify(list))
  }
  const openListenerModel = async (index: number, listenerData?: ExecutionListenerForm | any) => {
    activeIndex = index
    listenerData && (newListener.value = JSON.parse(JSON.stringify(listenerData)))
    updateListenerType(listenerData?.type || 'class')
    modelVisible.value = true
    await nextTick()
    formRef.value && formRef.value.clearValidate()
  }
  const removeListener = (index: number) => {
    const listener: ModdleElement = listenersRaw[index]
    Listener.removeExecutionListener(props.element,listener)
    reloadExtensionListeners()
  }

</script>
<template>
  <CollapsePanel name="element-execution-listeners" v-if="isExecutable(props.element)">
    <template #header>
      <CollapseTitle :title="$t('panel.executionListeners')">
        <LucideIcon name="Radio" />
      </CollapseTitle>
    </template>
    <template #extra>
      <Tag type="primary" round>{{ listeners.length }}</Tag>
    </template>
    <div class="element-extension-listeners">
      <Table size="small" max-height="20vh" :columns="columns" :dataSource="listeners" >
        <template #bodyCell="{index, column, record }">
          <template v-if="column.key === 'operation'">
            <Button @click="openListenerModel(index,record)" type="primary" size="small">{{t('panel.edit')}}</Button>
            <Button @click="removeListener(index)" size="small" danger>{{t('panel.remove')}}</Button>
          </template>
        </template>
      </Table>
      <Button type="primary" @click="openListenerModel(-1)">
        <span>{{ $t('panel.addExecutionListener') }}</span>
      </Button>
    </div>
    <Modal v-model:open="modelVisible" :title="$t('panel.addExecutionListener')" width="640px">
      <Form ref="formRef" :model="newListener" :rules="formRules" :labelCol="{span: 4}">
        <FormItem name="event" :label="$t('panel.executionListenerEventType')">
          <RadioGroup option-type="button" v-model:value="newListener.event" :options="listenerEventTypeOptions" />
        </FormItem>
        <FormItem name="type" :label="$t('panel.executionListenerType')">
          <RadioGroup option-type="button" v-model:value="newListener.type" :options="listenerTypeOptions"  @change="(ev) => updateListenerType(ev.target.value)"/>
        </FormItem>
        <FormItem v-if="formItemVisible.listenerType === 'class'" name="class" :label="$t('panel.javaClass')">
          <Input v-model:value="newListener.class" @keydown.enter.prevent />
        </FormItem>
        <FormItem v-if="formItemVisible.listenerType === 'expression'" name="expression"
                  :label="$t('panel.expression')">
          <Input v-model:value="newListener.expression" @keydown.enter.prevent />
        </FormItem>
        <FormItem v-if="formItemVisible.listenerType === 'delegateExpression'" name="delegateExpression"
                  :label="$t('panel.delegateExpression')">
          <Input v-model:value="newListener.delegateExpression" @keydown.enter.prevent />
        </FormItem>
        <template v-if="formItemVisible.listenerType === 'script' && newListener.script">
          <FormItem key="scriptType" name="script.scriptType" :label="$t('panel.scriptType')">
            <RadioGroup option-type="button" v-model:value="newListener.script.scriptType" :options="scriptTypeOptions" @change="(ev) => updateScriptType(ev.target.value)" />
          </FormItem>
          <FormItem key="scriptFormat" name="script.scriptFormat" :label="$t('panel.scriptFormat')">
            <Input v-model:value="newListener.script.scriptFormat" @keydown.enter.prevent />
          </FormItem>
          <FormItem v-if="formItemVisible.scriptType === 'inline'" key="scriptContent" name="script.value"
                    :label="$t('panel.scriptBody')">
            <Textarea v-model:value="newListener.script.value" @keydown.enter.prevent />
          </FormItem>
          <FormItem v-if="formItemVisible.scriptType === 'external'" key="scriptResource" name="script.resource"
                    :label="$t('panel.scriptResource')">
            <Input v-model:value="newListener.script.resource" @keydown.enter.prevent />
          </FormItem>
        </template>
      </Form>
      <template #footer>
        <Button type="primary" @click="saveExecutionListener">{{ $t('panel.confirm') }}</Button>
      </template>
    </Modal>
  </CollapsePanel>
</template>