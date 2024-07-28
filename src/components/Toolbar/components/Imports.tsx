import { defineComponent, ref } from 'vue'
import { Button, Popover } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getModeler } from '../../utils/BpmnHolder'
import LucideIcon from '@/components/common/LucideIcon.vue'

const Imports = defineComponent({
  name: 'Imports',
  setup() {
    const { t } = useI18n()
    const importRef = ref<HTMLInputElement | null>(null)

    const openImportWindow = () => {
      importRef.value && importRef.value.click()
    }

    const changeImportFile = () => {
      if (importRef.value && importRef.value.files) {
        const file = importRef.value.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          const xmlStr = this.result
          getModeler()!.importXML(xmlStr as string)
        }
        importRef.value.value = ''
        importRef.value.files = null
      }
    }
    return () => (
      <span>
        <Popover content= {t('toolbar.openFile')} placement="right">
          <Button size="small" type="text" onClick={openImportWindow}>
          <LucideIcon name="FolderInput" size={18}/>
        </Button>
        </Popover>
        <input
          type="file"
          ref={importRef}
          style="display: none"
          accept=".xml,.bpmn"
          onChange={changeImportFile}
        ></input>
      </span>
    )
  }
})

export default Imports
