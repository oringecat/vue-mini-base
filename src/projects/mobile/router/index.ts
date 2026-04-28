import { createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useHistoryStore } from './history'
import Pgae from '../components/layouts/page/index.vue'
import PageHome from '../components/layouts/page-home/index.vue'

export default function createRouter() {
  const historyStore = useHistoryStore()

  const routes: RouteRecordRaw[] = [
    {
      path: '/launch',
      name: 'launch',
      component: () => import('../views/launch/index.vue'),
      meta: {
        ignoreAuth: true,
      }
    },
    {
      path: '/',
      component: Pgae,
      children: [
        {
          path: '',
          component: PageHome,
          children: [
            {
              path: '',
              name: 'home',
              component: () => import('../views/home/index.vue'),
            },
            {
              path: '/profile',
              name: 'profile',
              component: () => import('../views/profile/index.vue'),
            }
          ]
        },
      ]
    },
    {
      path: '/user',
      component: Pgae,
      children: [
        {
          path: 'login',
          name: 'user-login',
          component: () => import('../views/user/login/index.vue'),
        }
      ]
    },
    {
      path: '/setting',
      component: Pgae,
      children: [
        {
          path: 'language',
          name: 'setting-language',
          component: () => import('../views/setting/language/index.vue'),
        }
      ]
    }
  ]

  const router = historyStore.create({
    history: createWebHashHistory(),
    routes,
  })

  return router
}
