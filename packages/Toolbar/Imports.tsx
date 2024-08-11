import { defineComponent, ref } from 'vue'
import { Button, Popover } from 'ant-design-vue'
import { getModeler } from '../utils/BpmnHolder'
import { FolderInput } from 'lucide-vue-next'

const Imports = defineComponent({
  name: 'Imports',
  setup() {
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
        <Popover content="打开文件" placement="bottom">
          <Button size="small" type="text" onClick={openImportWindow}>
            <FolderInput size={18} />
          </Button>
        </Popover>
        <input type="file" ref={importRef} style="display: none" accept=".xml,.bpmn" onChange={changeImportFile}></input>
      </span>
    )
  }
})

export default Imports
