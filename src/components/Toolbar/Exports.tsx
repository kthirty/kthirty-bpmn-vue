import { defineComponent } from 'vue'
import { Button ,Dropdown,Menu,MenuItem  } from 'ant-design-vue'
import { downloadFile, setEncoded } from '../../utils/BpmnElementHelper'
import { getModeler } from '../../utils/BpmnHolder'
import LucideIcon from '../common/LucideIcon.vue'

const Exports = defineComponent({
  name: 'ExportTools',
  setup() {
    // 下载流程图到本地
    /**
     * @param {string} type
     * @param {*} name
     */
    const downloadProcess = async (type: string, name:string = 'diagram') => {
      try {
        const modeler = getModeler()
        // 按需要类型创建文件并下载
        if (type === 'xml' || type === 'bpmn') {
          const { error, xml } = await modeler!.saveXML({})
          // 读取异常时抛出异常
          if (error) {
            console.error(`[Process Designer Warn ]: ${error.message || error}`)
          }
          const { href, filename } = setEncoded(type.toUpperCase(), name, xml!)
          downloadFile(href, filename)
        } else {
          const { svg } = await modeler!.saveSVG()
          // 读取异常时抛出异常
          const { href, filename } = setEncoded('SVG', name, svg!)
          downloadFile(href, filename)
        }
      } catch (e: any) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`)
      }
    }

    const handleMenuClick = ({key}) => downloadProcess(key)

    return () => (
      <Dropdown v-slots={{
        default: () => (<Button size="small" type="text"><LucideIcon size={18} name="FolderDown"/></Button>),
        overlay: () => (
          <Menu onClick={handleMenuClick}>
            <MenuItem key="bpmn">导出为BPMN</MenuItem>
            <MenuItem key="xml">导出为XML</MenuItem>
            <MenuItem key="svg">导出为SVG</MenuItem>
          </Menu>
        )
      }}/>
    )
  }
})

export default Exports
