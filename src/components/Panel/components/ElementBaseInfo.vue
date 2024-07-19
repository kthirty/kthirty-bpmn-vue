<script setup lang="ts">
  import { CollapsePanel, Input, Switch } from 'ant-design-vue'
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import EditItem from '../../common/EditItem.vue'
  import { BpmnElement } from '../../types'
  import { onMounted, ref, watch } from 'vue'
  import {isProcess} from '../../utils/BpmnElementType'
  import { Id,Name,Version,Executable} from '../../utils/BpmnElementProp'

  defineOptions({ name: 'ElementGenerations' })
  const props = defineProps({ element: Object as BpmnElement })

  const elementId = ref<string>('')
  const elementName = ref<string>('')
  const elementVersion = ref<string>('')
  const elementExecutable = ref<boolean>(true)
  const elementIsProcess = ref<boolean>(false)

  const updateElementId = () => Id.setIdValue(props.element,elementId.value)
  const updateElementName = () => Name.setNameValue(props.element,elementName.value)
  const updateElementVersion = () => Version.setProcessVersionTag(props.element,elementVersion.value)
  const updateElementExecutable = () => Executable.setProcessExecutable(props.element,elementExecutable.value)

  // 根据element更新本组件字段
  const updateInfo = (element: BpmnElement) => {
    elementIsProcess.value = isProcess(element)
    elementId.value = Id.getIdValue(element)
    elementName.value = Name.getNameValue(element) || ''
    if(elementIsProcess.value){
      elementVersion.value = Version.getProcessVersionTag(element)
      elementExecutable.value = Executable.getProcessExecutable(element)
    }
  }

  onMounted(() => updateInfo(props.element))
  watch(() => props.element,(newVal: BpmnElement) => updateInfo(newVal))
</script>
<template>
  <CollapsePanel name="base-info">
    <template #header>
      <CollapseTitle :title="$t('panel.general')">
        <LucideIcon name="Info" />
      </CollapseTitle>
    </template>
    <EditItem :label="$t('panel.id')">
      <Input v-model:value="elementId" maxlength:="32" @change="updateElementId" />
    </EditItem>
    <EditItem :label="$t('panel.name')">
      <Input v-model:value="elementName" maxlength:="20" @change="updateElementName" />
    </EditItem>
    <template v-if="elementIsProcess">
      <EditItem key="version" :label="$t('panel.version')">
        <Input v-model:value="elementVersion" maxlength:="20" @change="updateElementVersion" />
      </EditItem>
      <EditItem key="executable" :label="$t('panel.executable')">
        <Switch v-model:checked="elementExecutable" @change="updateElementExecutable" />
      </EditItem>
    </template>
  </CollapsePanel>
</template>
