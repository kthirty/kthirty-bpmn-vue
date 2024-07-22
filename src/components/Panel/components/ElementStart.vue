<script setup lang="ts">
  import { CollapsePanel,Input } from 'ant-design-vue'
  import EditItem from '../../common/EditItem.vue'
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import { onMounted, ref, watch } from 'vue'
  import {Start} from '../../utils/BpmnElementProp'
  import {isCanSetInitiator} from '../../utils/BpmnElementType'
  import { Element } from 'bpmn-js/lib/model/Types'

  defineOptions({ name: 'ElementStart' })
  const props = defineProps<{element: Element}>()

  const initiator = ref<string>()
  const setElementInitiator = () => Start.setInitiatorValue(props.element,initiator.value)

  const updateInfo = () => {
    initiator.value = Start.getInitiatorValue(props.element)
  }
  watch(() => props.element, updateInfo)
  onMounted(updateInfo)
</script>
<template>
  <CollapsePanel name="element-start-initiator" v-if="isCanSetInitiator(props.element)">
    <template #header>
      <CollapseTitle :title="$t('panel.startInitiator')">
        <LucideIcon name="PlayCircle" />
      </CollapseTitle>
    </template>
    <div class="element-start-initiator">
      <EditItem :label="$t('panel.initiator')">
        <Input v-model:value="initiator" @change="setElementInitiator" />
      </EditItem>
    </div>
  </CollapsePanel>
</template>