import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from '@/i18n'
import { createPinia } from 'pinia'
import 'virtual:svg-icons-register'

import { message } from 'ant-design-vue';
window.__messageBox = message


const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(pinia)

app.mount('#app')
