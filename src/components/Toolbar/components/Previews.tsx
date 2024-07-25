import { defineComponent } from 'vue'

// import BpmnModdle from 'bpmn-moddle'
import { Button, Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getModeler } from '../../utils/BpmnHolder'
import { message } from '../../utils/BpmnElementHelper'

const Previews = defineComponent({
  name: 'Previews',
  setup() {
    const { t } = useI18n()

    // const moddle = new BpmnModdle()

    const openXMLPreviewModel = async () => {
      try {
        const modeler = getModeler()

        if (!modeler) {
          return message('warning','模型加载失败，请刷新重试')
        }

        const { xml } = await modeler.saveXML({ format: true, preamble: true })

        // const [modal] = Modal.useModal();
        // modal.info({
        //   title: t('toolbar.previewAs'),
        //   icon: false,
        //   content: () => (
        //     <div class="preview-model">
        //       <Textarea v-model:value={xml} />
        //     </div>
        //   )
        // })
      } catch (e) {
        message("error",(e as Error).message || (e as string))
      }
    }

    const openJsonPreviewModel = async () => {
      const modeler = getModeler()

      if (!modeler) {
        return message('warning','模型加载失败，请刷新重试')
      }

      const { xml } = await modeler.saveXML({ format: true })

      const jsonStr = "{}" // moddle.fromXML(xml!)
      // const [modal] = Modal.useModal();
      // modal.info({
      //   title: t('toolbar.previewAs'),
      //   icon: false,
      //   content: () => (
      //     <div class="preview-model">
      //       <Textarea v-model:value={JSON.stringify(jsonStr, null, 2)} disabled></Textarea>
      //     </div>
      //   )
      // })
    }

    return () => (
      <Dropdown
        v-slots={{
          default: () => (
            <Button>{t('toolbar.previewAs')}</Button>
          ),
          trigger: () => (
            <Menu>
              <MenuItem key="xml"> {t('toolbar.previewAsXML')}</MenuItem>
              <MenuItem key="json">{t('toolbar.previewAsJSON')}</MenuItem>
            </Menu>
          )
        }}
      ></Dropdown>
    )
  }
})

export default Previews
