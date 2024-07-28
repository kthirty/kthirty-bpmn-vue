import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Popover } from 'ant-design-vue'
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
      <Popover content={t('toolbar.toggleProcessLint')} placement="right">
      <Button size="small" type="text" onClick={toggleLint}>
        <LucideIcon name="BadgeAlert" size={18}/>
      </Button>
      </Popover>
    )
  }
})
export default LintToggle