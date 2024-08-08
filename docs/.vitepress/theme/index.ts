import DefaultTheme from 'vitepress/theme'
import './global.less' // global less
// import '../../../dist/style.css'

export default {
  extends: DefaultTheme, // or ...DefaultTheme
  enhanceApp ({ app }) {
  }
}
