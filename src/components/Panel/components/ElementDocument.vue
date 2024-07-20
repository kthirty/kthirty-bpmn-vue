<script setup lang="ts">
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import EditItem from '../../common/EditItem.vue'
  import {CollapsePanel , Textarea} from 'ant-design-vue'
  import { BpmnElement } from '@/components/types'
  import { onMounted, ref, watch } from 'vue'
  import {Document} from '../../utils/BpmnElementProp'

  defineOptions({ name: 'ElementDocument' })
  const props = defineProps({ element: Object as BpmnElement })

  const elementDoc = ref<string>('')
  const updateElementDoc = () => Document.setDocumentValue(props.element,elementDoc.value)

  const updateInfo = () => {
    elementDoc.value = Document.getDocumentValue(props.element)
  }
  watch(() => props.element, updateInfo)
  onMounted(updateInfo)

</script>
<template>
  <CollapsePanel key="element-documentations">
    <template #header>
      <CollapseTitle :title="$t('panel.documentationSettings')">
        <LucideIcon name="FileText" />
      </CollapseTitle>
    </template>
    <EditItem :label="$t('panel.documentationBody')" :label-width="120">
      <Textarea v-model:value="elementDoc" @change="updateElementDoc" />
    </EditItem>
  </CollapsePanel>
</template>