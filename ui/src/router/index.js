import CounterView from '@/modules/counter/CounterView.vue'
import HomeView from '@/modules/home/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/counter',
      name: 'counter',
      component: CounterView
    }
  ],
})

export default router
