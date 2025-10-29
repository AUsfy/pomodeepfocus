
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { Analytics } from './utils/analytics.js'

// Initialize Google Analytics
Analytics.init()

const app = createApp(App)
app.use(router)
app.mount('#app')
