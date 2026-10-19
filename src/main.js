import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './fonts.js'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err, _instance, info) => {
  console.error('[CV Builder] Erreur dans', info, err)
}

app.use(createPinia())
app.mount('#app')
