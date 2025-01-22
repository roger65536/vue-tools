import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/default.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/home.vue')
        },
        {
          path: 'qrcode',
          name: 'qrcode',
          component: () => import('../views/qrcode.vue')
        },
        {
          path: 'image',
          name: 'image',
          component: () => import('../views/image.vue')
        }
      ]
    }
  ]
})

export default router 