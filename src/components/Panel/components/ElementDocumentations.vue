<template>
  <collapse-panel key="element-documentations">
    <template #header>
      <collapse-title :title="$t('panel.documentationSettings')">
        <LucideIcon name="FileText" />
      </collapse-title>
    </template>
    <edit-item :label="$t('panel.documentationBody')" :label-width="120">
      <a-textarea v-model:value="elementDoc" @change="updateElementDoc" />
    </edit-item>
  </collapse-panel>
</template>

<script lang="ts">
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import EditItem from '../../common/EditItem.vue'
  import {CollapsePanel , Input , Textarea} from 'ant-design-vue'
  import { defineComponent } from 'vue'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'
  import { Element } from 'diagram-js/lib/model/Types'
  import { getDocumentValue, setDocumentValue } from '../../utils/documentationUtil'
  import EventEmitter from '@/utils/EventEmitter'

  export default defineComponent({
    name: 'ElementDocumentations',
    data() {
      return {
        elementDoc: ''
      }
    },
    components: {
      'a-textarea': Textarea,
      LucideIcon,
      CollapseTitle,
      EditItem,
      CollapsePanel
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    watch: {
      getActiveId: {
        immediate: true,
        handler() {
          this.elementDoc = getDocumentValue(this.getActive as Element) || ''
        }
      }
    },
    mounted() {
      this.elementDoc = getDocumentValue(this.getActive as Element) || ''
      EventEmitter.on('element-update', () => {
        this.elementDoc = getDocumentValue(this.getActive as Element) || ''
      })
    },
    methods: {
      updateElementDoc(value) {
        setDocumentValue(this.getActive as Element, value)
      }
    }
  })
</script>
