import { defineComponent } from 'vue'
import { Button, Popover } from 'ant-design-vue'
import LucideIcon from '../common/LucideIcon.vue'
import { getModeler } from '../../utils/BpmnHolder'

const LintToggle = defineComponent({
  name: 'LintToggle',
  setup() {

    const toggleLint = () => {
      // @ts-ignore
      getModeler()?.get("linting")?.toggle()
    }
    return () => (
      <Popover content='开启/关闭流程验证' placement="bottom">
      <Button size="small" type="text" onClick={toggleLint}>
        <LucideIcon name="BadgeAlert" size={18}/>
      </Button>
      </Popover>
    )
  }
})
export default LintToggle