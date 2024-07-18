<template>
  <collapse-panel name="element-start-initiator">
    <template #header>
      <collapse-title :title="$t('panel.startInitiator')">
        <lucide-icon name="PlayCircle" />
      </collapse-title>
    </template>
    <div class="element-start-initiator">
      <edit-item :label="$t('panel.initiator')">
        <a-input v-model:value="initiator" @change="setElementInitiator" />
      </edit-item>
    </div>
  </collapse-panel>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import { getInitiatorValue, setInitiatorValue } from '../../utils/initiatorUtil'
  import modeler from '@/store/modeler'
  import { Element } from 'diagram-js/lib/model/Types'
  import EventEmitter from '@/utils/EventEmitter'
  import CollapseTitle from '../../common/CollapseTitle.vue'
  import LucideIcon from '../../common/LucideIcon.vue'
  import EditItem from '../../common/EditItem.vue'
  import {Input,CollapsePanel} from 'ant-design-vue'

  export default defineComponent({
    name: 'ElementStartInitiator',
    components: {CollapseTitle,LucideIcon,CollapsePanel,EditItem,'a-input':Input},
    setup() {
      const modelerStore = modeler()
      const getActive = computed<Element | null>(() => modelerStore.getActive!)
      const initiator = ref<string | undefined>('')

      const getElementInitiator = () => {
        initiator.value = getInitiatorValue(getActive.value!)
      }
      const setElementInitiator = (event: Event) => {
        const value = (event.target as HTMLInputElement).value
        setInitiatorValue(getActive.value!, value)
      }

      onMounted(() => {
        getElementInitiator()

        EventEmitter.on('element-update', getElementInitiator)
      })

      return {
        initiator,
        setElementInitiator
      }
    }
  })
</script>
