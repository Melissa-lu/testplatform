import { createApp } from 'vue'
import App from './App.vue'
import VueI18n from './language'
import router from "./router"
import naive from 'naive-ui'


// createApp(App).use(VueI18n).use(router).mount('#app')
const app = createApp(App)
app.config.globalProperties.$Name = ""
app.use(router)
app.use(VueI18n)
app.use(naive)
app.mount('#app')