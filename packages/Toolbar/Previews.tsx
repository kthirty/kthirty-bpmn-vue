import { defineComponent, ref } from 'vue'
import { Button, Icon, Modal, Popover, Textarea } from '../ui'
import { getModeler } from '../utils/BpmnHolder'
import { message } from '../utils/BpmnElementHelper'

const Previews = defineComponent({
  name: 'Previews',
  setup() {
    const previewText = ref('')
    const open = ref(false)

    const preview = async () => {
      const modeler = getModeler()
      if (!modeler) return message('warning', '模型加载失败，请刷新重试')
      const res = await modeler.saveXML({ format: true, preamble: true })
      previewText.value = res.xml || ''
      open.value = true
    }

    return () => (
      <span>
        <Popover content="预览文件" placement="bottom">
          <Button onClick={preview} size="small" type="text">
            <Icon name="eye" />
          </Button>
        </Popover>
        <Modal v-model:open={open.value} title="预览文件">
          <Textarea readonly v-model:value={previewText.value} />
        </Modal>
      </span>
    )
  }
})

export default Previews
