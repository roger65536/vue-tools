import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '../layouts/default.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
        },
        {
          path: 'encrypt',
          name: 'encrypt',
          component: () => import('../views/encrypt.vue')
        }
      ]
    }
  ]
})

export default router 