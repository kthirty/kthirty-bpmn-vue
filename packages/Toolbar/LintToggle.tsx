import { defineComponent } from 'vue'
import { Button, Icon, Popover } from '../ui'
import { getModeler } from '../utils/BpmnHolder'

const LintToggle = defineComponent({
  name: 'LintToggle',
  setup() {
    const toggleLint = () => {
      // @ts-ignore
      getModeler()?.get('linting')?.toggle()
    }
    return () => (
      <Popover content="开启/关闭流程验证" placement="bottom">
        <Button size="small" type="text" onClick={toggleLint}>
          <Icon name="badge-alert" />
        </Button>
      </Popover>
    )
  }
})
export default LintToggle
