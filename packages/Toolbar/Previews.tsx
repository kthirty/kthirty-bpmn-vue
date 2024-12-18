import { defineComponent, ref } from 'vue'

import BpmnModdle from 'bpmn-moddle'
import { Button, Modal, Popover, Textarea } from 'ant-design-vue'
import { getModeler } from '../utils/BpmnHolder'
import { message } from '../utils/BpmnElementHelper'
import { Eye } from 'lucide-vue-next'

const Previews = defineComponent({
  name: 'Previews',
  setup() {
    const moddle = new BpmnModdle()
    const previewText = ref<string>('')

    const preview = async () => {
      const modeler = getModeler()
      if (!modeler) return message('warning', '模型加载失败，请刷新重试')
      const res = await modeler.saveXML({ format: true, preamble: true })
      previewText.value = res.xml || ''
      Modal.info({
        title: '预览文件',
        icon: false,
        width: '100%',
        footer: false,
        closable: true,
        style: {
          maxWidth: '100vw',
          top: 0,
          paddingBottom: 0
        },
        bodyStyle: {
          height: 'calc(100vh - 45px)',
          overflowY: 'auto'
        },
        content: () => (
          <div style={{ height: '100%' }}>
            <Textarea bordered={false} readonly autoSize v-model:value={previewText.value} />
          </div>
        )
      })
    }

    return () => (
      <Popover content="预览文件" placement="bottom">
        <Button onClick={preview} size="small" type="text">
          <Eye size={18} />
        </Button>
      </Popover>
    )
  }
})

export default Previews
