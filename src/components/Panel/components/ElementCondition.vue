<script setup lang="ts">
  import { CollapsePanel, Input, Select, Textarea } from 'ant-design-vue'
  import { Element } from 'bpmn-js/lib/model/Types'
  import { onMounted, ref, watch } from 'vue'
  import EditItem from '../../common/EditItem.vue'
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import { Conditional } from '../../utils/BpmnElementProp'
  import { isConditionEventDefinition, isStartEvent,isCanSetConditional } from '../../utils/BpmnElementType'
  import { ConditionalForm } from '../../types'
  import { getConditionTypeOptions, scriptTypeOptions } from '../../utils/BpmnElementData'

  defineOptions({ name: 'ElementCondition' })
  const props = defineProps<{ element: Element }>()

  // 变量部门
  const varVisible = ref<boolean>(false)
  const variableName = ref<string | undefined>(undefined)
  const varEventVisible = ref<boolean>(false)
  const variableEvents = ref<string | undefined>(undefined)
  const getElementVariables = () => {
    varVisible.value = isConditionEventDefinition(props.element)
    variableName.value = Conditional.getVariableNameValue(props.element)
    if (varVisible.value) {
      varEventVisible.value = isStartEvent(props.element)
      variableEvents.value = Conditional.getVariableEventsValue(props.element)
    }
  }
  const setElementVariableName = () => Conditional.setVariableNameValue(props.element, variableName.value)
  const setElementVariableEvents = () => Conditional.setVariableEventsValue(props.element, variableEvents.value)

  // 条件类型配置部分
  const conditionTypeOptions = ref<Record<string, string>[]>([])
  const conditionData = ref<ConditionalForm>({
    scriptType: 'none'
  })
  const getElementConditionType = () => {
    conditionData.value.conditionType = Conditional.getConditionTypeValue(props.element)
    conditionData.value.conditionType === 'expression' && getConditionExpression()
    conditionData.value.conditionType === 'script' && getConditionScript()
  }
  const setElementConditionType = () => Conditional.setConditionTypeValue(props.element, conditionData.value.conditionType || '')
  const getConditionExpression = () => conditionData.value.expression = Conditional.getConditionExpressionValue(props.element)
  const setConditionExpression = () => {
    Conditional.setConditionExpressionValue(props.element, conditionData.value.expression)
  }

  const getConditionScript = () => {
    conditionData.value.language = Conditional.getConditionScriptLanguageValue(props.element)
    conditionData.value.scriptType = Conditional.getConditionScriptTypeValue(props.element)
    conditionData.value.body = Conditional.getConditionScriptBodyValue(props.element)
    conditionData.value.resource = Conditional.getConditionScriptResourceValue(props.element)
  }
  const setConditionScriptLanguage = () => Conditional.setConditionScriptLanguageValue(props.element, conditionData.value.language)
  const setElementConditionScriptType = () => Conditional.setConditionScriptTypeValue(props.element, conditionData.value.scriptType)
  const setConditionScriptBody = () => Conditional.setConditionScriptBodyValue(props.element, conditionData.value.body)
  const setConditionScriptResource = () => Conditional.setConditionScriptResourceValue(props.element, conditionData.value.resource)

  onMounted(() => {
    getElementVariables()
    getElementConditionType()
    conditionTypeOptions.value = getConditionTypeOptions(props.element)
  })
  watch(() => props.element, () => {
    getElementVariables()
    getElementConditionType()
    conditionTypeOptions.value = getConditionTypeOptions(props.element)
  })

</script>
<template>
  <CollapsePanel name="element-conditional" v-if="isCanSetConditional(props.element)">
    <template #header>
      <CollapseTitle :title="$t('panel.conditionalSettings')">
        <LucideIcon name="ArrowLeftRight" />
      </CollapseTitle>
    </template>
    <div class="element-conditional">
      <template v-if="varVisible">
        <EditItem key="variableName" :label="$t('panel.variableName')" :label-width="120">
          <Input v-model:value="variableName" maxlength:="32" @change="setElementVariableName" />
        </EditItem>
        <EditItem
          v-if="varEventVisible"
          key="variableEvent"
          :label="$t('panel.variableEvents')"
          :label-width="120"
        >
          <Input v-model:value="variableEvents" @change="setElementVariableEvents" />
        </EditItem>
      </template>
      <EditItem key="condition" :label="$t('panel.conditionType')" :label-width="120">
        <Select
          v-model:value="conditionData.conditionType"
          :options="conditionTypeOptions"
          @change="setElementConditionType"
        />
      </EditItem>
      <EditItem
        v-if="conditionData.conditionType && conditionData.conditionType === 'expression'"
        key="expression"
        :label="$t('panel.conditionExpression')"
        :label-width="120"
      >
        <Input v-model:value="conditionData.expression" @change="setConditionExpression" />
      </EditItem>
      <template v-if="conditionData.conditionType && conditionData.conditionType === 'script'">
        <EditItem key="scriptType" :label="$t('panel.scriptType')" :label-width="120">
          <Select
            v-model:value="conditionData.scriptType"
            :options="scriptTypeOptions"
            @change="setElementConditionScriptType"
          />
        </EditItem>
        <EditItem key="scriptLanguage" :label="$t('panel.scriptLanguage')" :label-width="120">
          <Input v-model:value="conditionData.language" @change="setConditionScriptLanguage" />
        </EditItem>
        <EditItem
          v-show="conditionData.scriptType === 'inline'"
          key="scriptBody"
          :label="$t('panel.scriptBody')"
          :label-width="120"
        >
          <Textarea
            v-model:value="conditionData.body"
            @change="setConditionScriptBody"
          />
        </EditItem>
        <EditItem
          v-show="conditionData.scriptType === 'external'"
          key="scriptResource"
          :label="$t('panel.scriptResource')"
          :label-width="120"
        >
          <Input v-model:value="conditionData.resource" @change="setConditionScriptResource" />
        </EditItem>
      </template>
    </div>
  </CollapsePanel>
</template>