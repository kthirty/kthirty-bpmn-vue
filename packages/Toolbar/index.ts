import type { App } from 'vue'
import Toolbar from './Toolbar'

// 使用install方法，在app.use挂载
Toolbar.install = (app: App): void => {
  app.component(Toolbar.name as string, Toolbar)
}

export default Toolbar
