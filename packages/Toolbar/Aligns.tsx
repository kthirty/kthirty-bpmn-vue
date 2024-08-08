import { h, computed, defineComponent } from 'vue'
import type { ComputedRef, Component } from 'vue'
import Modeler from 'bpmn-js/lib/Modeler'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling.js'
import EventEmitter from '../utils/EventEmitter'
import { message } from '../utils/BpmnElementHelper'
import { Button, Divider, Popover } from 'ant-design-vue'
import {
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal
} from 'lucide-vue-next'
console.log(AlignStartVertical)

const Aligns = defineComponent({
  name: 'Aligns',
  setup() {
    const buttons: ComputedRef<{ name: string; key: string; icon: Component }[]> = computed(() => {
      return [
        { name: '左对齐', key: 'left', icon: AlignStartVertical },
        { name: '水平居中', key: 'center', icon: AlignCenterVertical },
        { name: '右对齐', key: 'right', icon: AlignEndVertical },
        { name: '上对齐', key: 'top', icon: AlignStartHorizontal },
        { name: '垂直居中', key: 'middle', icon: AlignCenterHorizontal },
        { name: '下对齐', key: 'bottom', icon: AlignEndHorizontal }
      ]
    })

    let modeling: Modeling | null = null
    let selection: any | null = null
    let align: any = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      modeling = modeler.get('modeling')
      selection = modeler.get('selection')
      align = modeler.get('alignElements')
    })

    const alignElements = (tag: string) => {
      if (modeling && selection) {
        const SelectedElements = selection.get()
        if (!SelectedElements || SelectedElements.length <= 1) {
          return message('warning', '请按住 Shift 键选择多个元素对齐')
        }
        align.trigger(SelectedElements, tag)
      }
    }

    return () => (
      <div>
        <Divider type="vertical" />
        {buttons.value.map((item) => {
          return (
            <Popover
              v-slots={{
                content: () => item.name,
                default: () => (
                  <Button size="small" type="text" onClick={() => alignElements(item.key)}>
                    {() => h(item.icon, { size: 18 })}
                  </Button>
                )
              }}
            ></Popover>
          )
        })}
        <Divider type="vertical" />
      </div>
    )
  }
})

export default Aligns
