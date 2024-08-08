import type { App } from 'vue'
import BpmnDesigner from './BpmnDesigner'

// 使用install方法，在app.use挂载
BpmnDesigner.install = (app: App): void => {
  app.component(BpmnDesigner.name as string, BpmnDesigner)
}

export default BpmnDesigner
