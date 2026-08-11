import CounterView from '@/modules/counter/counter_view.vue'
import HomeView from '@/modules/home/home_view.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
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
    },
    {
      path: '/hospital',
      component: () => import('@/modules/hospital/layout.vue'),
      children: [
        {
          path: 'm-biodata',
          name: 'm-biodata',
          component: () => import('@/modules/hospital/m-biodata/view.vue'),
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/modules/errors/not-found.vue')
    }
  ],
})

export default router
