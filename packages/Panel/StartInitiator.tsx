import { defineComponent, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { Start } from '../utils/BpmnElementProp'
import { CollapsePanel, FormItem, Input } from 'ant-design-vue'
import { isCanSetInitiator } from '../utils/BpmnElementType'
import SelectableDrawer from '../SelectableDrawer'
import type { PanelOption } from '../types'
import { getExPropValue, updateExPropValue } from '../utils/BpmnElementHelper'

export default defineComponent({
  name: 'StartInitiator',
  props: {
    element: {
      type: Object as PropType<Element>,
      required: true
    },
    option: {
      type: Object as PropType<PanelOption>,
      required: false
    }
  },
  setup(props) {
    const show = ref<boolean>(false)
    const initiator = ref<string>()
    const formKey = ref<string>()
    const setElementInitiator = () => Start.setInitiatorValue(props.element, initiator.value)
    const updateFormKey = () => updateExPropValue(props.element, 'formKey', formKey.value)
    const updateInfo = () => {
      show.value = isCanSetInitiator(props.element)
      if (!show.value) return
      initiator.value = Start.getInitiatorValue(props.element)
      formKey.value = getExPropValue<string>(props.element, 'formKey')
    }
    watch(() => props.element, updateInfo)
    onMounted(updateInfo)

    return () =>
      show.value ? (
        <CollapsePanel
          key="StartInitiator"
          v-slots={{
            header: () => '启动配置',
            default: () => (
              <div>
                <FormItem labelCol={{ span: 6 }} label="启动器" name="initiator">
                  <Input v-model:value={initiator.value} onChange={setElementInitiator} />
                </FormItem>
                <FormItem labelCol={{ span: 6 }} label="表单代码" name="formKey">
                  <Input
                    v-model:value={formKey.value}
                    onChange={updateFormKey}
                    v-slots={{
                      addonAfter: () => (
                        <SelectableDrawer dataSource={() => props.option?.StartInitiator?.formKeyDateDataSource() || []} onSelect={(res) => (formKey.value = res)} />
                      )
                    }}
                  />
                </FormItem>
              </div>
            )
          }}
        />
      ) : (
        <div style="display: none" />
      )
  }
})
