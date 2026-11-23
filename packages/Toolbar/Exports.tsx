import { defineComponent } from 'vue'
import { Button, Dropdown, Icon, Menu, MenuItem } from '../ui'
import { downloadFile, setEncoded } from '../utils/BpmnElementHelper'
import { getModeler } from '../utils/BpmnHolder'

const Exports = defineComponent({
  name: 'ExportTools',
  setup() {
    const downloadProcess = async (type: string, name: string = 'diagram') => {
      try {
        const modeler = getModeler()
        if (type === 'xml' || type === 'bpmn') {
          const { error, xml } = await modeler!.saveXML({})
          if (error) {
            console.error(`[Process Designer Warn ]: ${error.message || error}`)
          }
          const { href, filename } = setEncoded(type.toUpperCase(), name, xml!)
          downloadFile(href, filename)
        } else {
          const { svg } = await modeler!.saveSVG()
          const { href, filename } = setEncoded('SVG', name, svg!)
          downloadFile(href, filename)
        }
      } catch (e: any) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`)
      }
    }

    return () => (
      <Dropdown
        v-slots={{
          default: () => (
            <Button size="small" type="text">
              <Icon name="folder-down" />
            </Button>
          ),
          overlay: () => (
            <Menu onClick={({ key }: { key: string }) => downloadProcess(String(key))}>
              <MenuItem key="bpmn">导出为BPMN</MenuItem>
              <MenuItem key="xml">导出为XML</MenuItem>
              <MenuItem key="svg">导出为SVG</MenuItem>
            </Menu>
          )
        }}
      />
    )
  }
})

export default Exports
