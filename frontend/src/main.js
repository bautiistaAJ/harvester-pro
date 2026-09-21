import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import HistoryView from './views/HistoryView.vue'
import './style.css'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/history', name: 'history', component: HistoryView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')