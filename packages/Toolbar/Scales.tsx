import { defineComponent, ref } from 'vue'
import EventEmitter from '../utils/EventEmitter'
import type Modeler from 'bpmn-js/lib/Modeler'
import { Button, Divider, Popover } from 'ant-design-vue'
import { ZoomIn, ZoomOut } from 'lucide-vue-next'

const Scales = defineComponent({
  name: 'Scales',
  setup() {
    const currentScale = ref(1)
    let canvas: any | null = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      try {
        canvas = modeler.get<any>('canvas')
        currentScale.value = canvas.zoom()
      } finally {
        modeler.on('canvas.viewbox.changed', ({ viewbox }: { viewbox: any }) => {
          currentScale.value = (viewbox as any).scale
        })
      }
    })

    const zoomReset = (newScale: number | string) => {
      canvas && canvas.zoom(newScale, newScale === 'fit-viewport' ? undefined : { x: 0, y: 0 })
    }

    const zoomOut = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 - 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    const zoomIn = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 + 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    return () => (
      <div>
        <Divider type="vertical" />
        <Popover content="缩小视图" placement="bottom">
          <Button size="small" type="text" onClick={() => zoomOut()}>
            <ZoomOut size={18} />
          </Button>
        </Popover>
        <Popover content="重置视图" placement="bottom">
          <Button size="small" type="text" onClick={() => zoomReset('fit-viewport')}>
            <span style="width: 40px">{Math.floor(currentScale.value * 10) * 10 + '%'}</span>
          </Button>
        </Popover>
        <Popover content="缩小视图" placement="bottom">
          <Button size="small" type="text" onClick={() => zoomIn()}>
            <ZoomIn size={18} />
          </Button>
        </Popover>
      </div>
    )
  }
})

export default Scales
