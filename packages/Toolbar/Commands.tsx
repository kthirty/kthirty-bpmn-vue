import { defineComponent } from 'vue'
import EventEmitter from '../utils/EventEmitter'
import type Modeler from 'bpmn-js/lib/Modeler'
import type { CommandStack } from 'bpmn-js/lib/features/modeling/Modeling'
import { Button, Divider, Popover } from 'ant-design-vue'
import { Eraser, Redo2, Undo2 } from 'lucide-vue-next'
import { emptyXml } from '../utils/BpmnElementData'

const Commands = defineComponent({
  name: 'Commands',
  setup() {
    let command: CommandStack | null = null
    let currentModeler: Modeler | null = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      currentModeler = modeler
      command = modeler.get<CommandStack>('commandStack')
    })

    const undo = () => {
      command && command.canUndo() && command.undo()
    }

    const redo = () => {
      command && command.canRedo() && command.redo()
    }

    const restart = () => {
      command && command.clear()
      const xml = emptyXml()
      currentModeler?.importXML(xml)
      EventEmitter.emit('xml-change', xml)
    }

    return () => (
      <div>
        <Divider type="vertical" />
        <Popover content="撤销" placement="bottom">
          <Button size="small" type="text" onClick={undo}>
            <Undo2 size={18} />
          </Button>
        </Popover>
        <Popover content="恢复" placement="bottom">
          <Button size="small" type="text" onClick={redo}>
            <Redo2 size={18} />
          </Button>
        </Popover>
        <Popover content="重做" placement="bottom">
          <Button size="small" type="text" onClick={restart}>
            <Eraser size={18} />
          </Button>
        </Popover>
      </div>
    )
  }
})

export default Commands
