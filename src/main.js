import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Analytics } from './utils/analytics.js'

// Initialize Google Analytics
Analytics.init()

createApp(App).mount('#app')
