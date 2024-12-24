import '../css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import initRouter from './router'

const pinia = createPinia()
const app = createApp(App)

initRouter.then(router => {
  app.use(router)
  app.use(pinia)
  app.mount('#app')
}).catch(error => {
  console.error('Failed to initialize router:', error)
})
