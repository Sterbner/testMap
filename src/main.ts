import { createApp } from 'vue'
// import router from './router/index.ts'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

const pinia = createPinia()
const app = createApp(App)


app.use(pinia)
// app.use(router)
app.use(ElementPlus)
app.mount('#app')
