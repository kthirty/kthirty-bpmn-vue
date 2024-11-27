import { defineComponent, ref, onMounted, watch, markRaw } from 'vue'
import type { PropType } from 'vue'
import { CollapsePanel, Form, FormItem, Input, Switch, Textarea } from 'ant-design-vue'
import { isProcess } from '../utils/BpmnElementType'
import { Id, Name, Process, Document } from '../utils/BpmnElementProp'
import type { Element } from 'bpmn-js/lib/model/Types'

interface BasicInfo {
  id: string
  name: string
  version?: string
  doc: string
  executable?: boolean
  nameExpression?: string
}

export default defineComponent({
  name: 'BasicInfo',
  props: {
    element: {
      type: Object as PropType<Element>,
      required: true
    }
  },
  setup(props) {
    const formRef = ref<HTMLFormElement>()
    const basicInfo = ref<BasicInfo>()
    const currentIsProcess = ref<boolean>(false)

    const updateInfo = async (element: Element) => {
      currentIsProcess.value = isProcess(element)
      const info: BasicInfo = {
        id: Id.getIdValue(element),
        name: Name.getNameValue(element) || '',
        doc: Document.getDocumentValue(props.element)
      }
      currentIsProcess.value && (info.version = Process.getProcessVersionTag(element))
      currentIsProcess.value && (info.executable = Process.getProcessExecutable(element))
      currentIsProcess.value && (info.nameExpression = Process.getProcessNameExpression(element))
      basicInfo.value = info
      formRef.value?.clearValidate()
    }
    const updateProperties = () => {
      if (!basicInfo.value) return
      Id.setIdValue(props.element, basicInfo.value.id)
      Name.setNameValue(props.element, basicInfo.value.name)
      Document.setDocumentValue(props.element, basicInfo.value.doc)
      if (currentIsProcess.value) {
        Process.setProcessVersionTag(props.element, basicInfo.value.version || '')
        Process.setProcessExecutable(props.element, basicInfo.value.executable || false)
        Process.setProcessNameExpression(props.element, basicInfo.value.nameExpression || '')
      }
    }
    onMounted(() => updateInfo(props.element))
    watch(
      () => props.element,
      (newVal: Element) => updateInfo(newVal)
    )

    return () => (
      <CollapsePanel
        key="basic"
        v-slots={{
          header: () => '基础属性',
          default: () => (
            <>
              {basicInfo.value && (
                <Form colon={false} ref={formRef} model={basicInfo.value} labelCol={{ span: 6 }} validateTrigger="blur">
                  <FormItem required={true} label="ID" name="id">
                    <Input maxlength={32} v-model:value={basicInfo.value.id} onChange={updateProperties} />
                  </FormItem>
                  <FormItem required={true} label="节点名称" name="name">
                    <Input maxlength={32} v-model:value={basicInfo.value.name} onChange={updateProperties} />
                  </FormItem>
                  <FormItem label="节点描述" name="doc">
                    <Textarea v-model:value={basicInfo.value.doc} onChange={updateProperties} />
                  </FormItem>
                  {currentIsProcess.value && (
                    <FormItem label="版本号" tooltip="仅文本备注作用" name="version">
                      <Input v-model:value={basicInfo.value.version} onChange={updateProperties} />
                    </FormItem>
                  )}
                  {currentIsProcess.value && (
                    <FormItem label="可执行" tooltip="描述类流程可设置为不可执行" name="executable">
                      <Switch v-model:checked={basicInfo.value.executable} onChange={updateProperties} />
                    </FormItem>
                  )}
                  {currentIsProcess.value && (
                    <FormItem label="流程标题" tooltip="自定义流程实例的名称，可使用变量有[pi:流程实例信息]" name="nameExpression">
                      <Textarea v-model:value={basicInfo.value.nameExpression} onChange={updateProperties} />
                    </FormItem>
                  )}
                </Form>
              )}
            </>
          )
        }}
      />
    )
  }
})
