import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from '@/i18n'
import { createPinia } from 'pinia'
import 'virtual:svg-icons-register'
import { Modal } from 'ant-design-vue';

const [modal, contextHolder] = Modal.useModal();
window.__messageBox = modal


const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(pinia)

app.mount('#app')
