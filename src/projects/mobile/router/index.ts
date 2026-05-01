import { createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useHistoryStore } from './history'
import serviceConfig from '@/services/config'
import MainLayout from '../components/layouts/page-main/index.vue'
import HomeLayout from '../components/layouts/page-home/index.vue'

export default function createRouter() {
  const historyStore = useHistoryStore()

  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          component: HomeLayout,
          children: [
            {
              path: '',
              name: 'home',
              component: () => import('../views/home/index.vue'),
            },
            {
              path: 'profile',
              name: 'profile',
              component: () => import('../views/profile/index.vue'),
            }
          ]
        },
      ]
    },
    {
      path: '/launch',
      name: 'launch',
      component: () => import('../views/launch/index.vue'),
      meta: {
        ignoreAuth: true,
      }
    },
    {
      path: '/user',
      component: MainLayout,
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
      component: MainLayout,
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

  router.beforeEach(async (to) => {
    if (serviceConfig.isReady) {
      return true
    } else {
      if (to.name === 'launch' || to.name === 'user-login') {
        return true
      } else {
        return {
          name: 'launch',
          query: { redirect: to.fullPath }
        }
      }
    }
  })

  return router
}
