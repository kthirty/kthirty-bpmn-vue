import type { App } from 'vue'
import Designer from './Designer'

// 使用install方法，在app.use挂载
Designer.install = (app: App): void => {
  app.component(Designer.name as string, Designer)
}

export default Designer
