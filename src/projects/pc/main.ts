import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import createRouter from './router'
import 'element-plus/dist/index.css'
import layouts from './components/layouts' // 全局布局组件

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(createRouter())
app.use(layouts)

app.mount('#app')
