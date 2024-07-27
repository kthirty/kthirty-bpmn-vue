import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from 'ant-design-vue'
import LucideIcon from '../../common/LucideIcon.vue'
import { getModeler } from '@/components/utils/BpmnHolder'

const LintToggle = defineComponent({
  name: 'LintToggle',
  setup() {
    const { t } = useI18n()

    const toggleLint = () => {
      // @ts-ignore
      getModeler()?.get("linting")?.toggle()
    }

    return () => (
      <Button size="small" type="text" onClick={toggleLint}>
        <LucideIcon name="BadgeAlert" size={18}/>
      </Button>
    )
  }
})
export default LintToggle