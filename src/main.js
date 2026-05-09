import './assets/global.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 导入刚才写的路由
import './style.css'

const app = createApp(App)
app.use(router) // 注册路由
app.mount('#app')