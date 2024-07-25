import { defineComponent, ref } from 'vue'
import { Button } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getModeler } from '../../utils/BpmnHolder'

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
        <Button onClick={openImportWindow}>
          {t('toolbar.openFile')}
        </Button>
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
