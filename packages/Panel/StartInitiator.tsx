import { defineComponent, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { Start } from '../utils/BpmnElementProp'
import { CollapsePanel, FormItem, Input } from 'ant-design-vue'
import { isCanSetInitiator } from '../utils/BpmnElementType'

export default defineComponent({
  name: 'ElementStartInitiator',
  props: {
    element: {
      type: Object as PropType<Element>,
      required: true
    }
  },
  setup(props) {
    const show = ref<boolean>(false)
    const initiator = ref<string>()
    const setElementInitiator = () => Start.setInitiatorValue(props.element, initiator.value)
    const updateInfo = () => {
      show.value = isCanSetInitiator(props.element)
      if (!show.value) return
      initiator.value = Start.getInitiatorValue(props.element)
    }
    watch(() => props.element, updateInfo)
    onMounted(updateInfo)

    return () =>
      show.value ? (
        <CollapsePanel
          name="StartInitiator"
          v-slots={{
            header: () => '启动配置',
            default: () => (
              <FormItem labelCol={{ span: 6 }} label="启动器" name="initiator">
                <Input v-model:value={initiator.value} onChange={setElementInitiator} />
              </FormItem>
            )
          }}
        />
      ) : (
        <div style="display: none" />
      )
  }
})
