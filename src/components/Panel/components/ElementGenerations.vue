<template>
  <collapse-panel name="base-info">
    <template #header>
      <collapse-title :title="$t('panel.general')">
        <lucide-icon name="Info" />
      </collapse-title>
    </template>

    <edit-item :label="$t('panel.id')">
      <a-input v-model:value="elementId" maxlength:="32" @change="updateElementId" />
    </edit-item>

    <edit-item :label="$t('panel.name')">
      <a-input v-model:value="elementName" maxlength:="20" @change="updateElementName" />
    </edit-item>

    <template v-if="isProcess">
      <edit-item key="version" :label="$t('panel.version')">
        <a-input v-model:value="elementVersion" maxlength:="20" @change="updateElementVersion" />
      </edit-item>

      <edit-item key="executable" :label="$t('panel.executable')">
        <a-switch v-model:checked="elementExecutable" @change="updateElementExecutable" />
      </edit-item>
    </template>
  </collapse-panel>
</template>

<script lang="ts">
 import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import EditItem from '../../common/EditItem.vue'
  import {CollapsePanel , Input ,Switch } from 'ant-design-vue'
  import { defineComponent } from 'vue'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'
  import { Element } from 'diagram-js/lib/model/Types'
  import { setIdValue } from '../../utils/idUtil'
  import { getNameValue, setNameValue } from '../../utils/nameUtil'
  import {
    getProcessExecutable,
    getProcessVersionTag,
    setProcessExecutable,
    setProcessVersionTag
  } from '../../utils/processUtil'
  import EventEmitter from '@/utils/EventEmitter'
  import { BpmnElement } from '@/components/types'

  export default defineComponent({
    name: 'ElementGenerations',
    props: {
      element: Object as BpmnElement
    },
    components: {
      'a-input': Input,
      'a-switch': Switch,
      CollapseTitle,
      LucideIcon,
      EditItem,
      CollapsePanel
    },
    data() {
      return {
        elementId: '',
        elementName: '',
        elementVersion: '',
        elementExecutable: true,
        isProcess: false
      }
    },
    watch: {
      element: {
        immediate: true,
        handler() {
          console.log(this.element)
        }
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    mounted() {
      console.log('element',this.element)
      this.reloadGenerationData()
      EventEmitter.on('element-update', this.reloadGenerationData)
    },
    methods: {
      reloadGenerationData() {
        this.isProcess = !!this.getActive && this.getActive.type === 'bpmn:Process'
        this.elementId = this.getActiveId as string
        this.elementName = getNameValue(this.getActive as Element) || ''
        if (this.isProcess) {
          this.elementExecutable = getProcessExecutable(this.getActive as Element)
          this.elementVersion = getProcessVersionTag(this.getActive as Element) || ''
        }
      },
      updateElementName(event: Event) {
        const value = (event.target as HTMLInputElement).value
        setNameValue(this.getActive as Element, value)
      },
      updateElementId(event: Event) {
        const value = (event.target as HTMLInputElement).value
        setIdValue(this.getActive as Element, value)
      },
      updateElementVersion(event: Event) {
        const value = (event.target as HTMLInputElement).value
        const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/
        if (reg.test(value)) {
          setProcessVersionTag(this.getActive as Element, value)
        } else {
          window.__messageBox.error('版本号必须符合语义化版本2.0.0 要点')
        }
      },
      updateElementExecutable(checked: boolean) {
        setProcessExecutable(this.getActive as Element, checked)
      }
    }
  })
</script>
