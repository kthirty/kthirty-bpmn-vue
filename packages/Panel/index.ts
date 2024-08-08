import type { App } from 'vue'
import Panel from './Panel'

// 使用install方法，在app.use挂载
Panel.install = (app: App): void => {
  app.component(Panel.name as string, Panel)
}

export default Panel
