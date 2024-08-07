import { defineComponent, ref } from 'vue'

import BpmnModdle from 'bpmn-moddle'
import { Button, Dropdown, Menu, MenuItem, Modal, Popover, Textarea } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getModeler } from '../../utils/BpmnHolder'
import { message } from '../../utils/BpmnElementHelper'
import LucideIcon from '@/components/common/LucideIcon.vue'

const Previews = defineComponent({
  name: 'Previews',
  setup() {
    const { t } = useI18n()

    const moddle = new BpmnModdle()

    const previewText = ref<string>("")

    const preview = async () => {
      const modeler = getModeler()
      if (!modeler) return message('warning','模型加载失败，请刷新重试')
      const { xml } = await modeler.saveXML({ format: true, preamble: true })

      Modal.info({
        title: t('toolbar.previewAs'),
        icon: false,
        width: '100%',
        footer: false,
        closable: true,
        style: {
          maxWidth: "100vw",
          top: 0,
          paddingBottom: 0
        },
        bodyStyle: {
          height: "calc(100vh - 45px)",
          overflowY: 'auto'
        },
        content: () => (
          <div class="preview-model" style={{height: '100%'}}>
            <Textarea bordered={false} readonly autoSize height='100%' v-model:value={xml} />
          </div>
        )
      })
    }

    return () => (
      <Popover content={t('toolbar.previewAs')} placement="right">
        <Button onClick={preview} size="small" type="text">
          <LucideIcon name="Eye" size={18}/>
        </Button>
      </Popover>
    )
  }
})

export default Previews
