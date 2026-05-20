import { createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useHistoryStore } from './history'
import { useUserStore } from '@/stores/user'
import serviceConfig from '@/services/config'
import MainLayout from '../components/layouts/page-main/index.vue'
import HomeLayout from '../components/layouts/page-home/index.vue'

export default function createRouter() {
  const historyStore = useHistoryStore()
  const userStore = useUserStore()

  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: MainLayout,
      meta: {
        ignoreAuth: true
      },
      children: [
        {
          path: '',
          component: HomeLayout,
          children: [
            {
              path: '',
              name: 'home',
              component: () => import('../views/home/index.vue')
            },
            {
              path: 'profile',
              name: 'profile',
              component: () => import('../views/profile/index.vue')
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
        ignoreAuth: true
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
          meta: {
            ignoreAuth: true
          }
        }
      ]
    },
    {
      path: '/order',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'order-list',
          component: () => import('../views/order/list/index.vue')
        },
        {
          path: 'detail',
          name: 'order-detail',
          component: () => import('../views/order/detail/index.vue')
        }
      ]
    },
    {
      path: '/setting',
      component: MainLayout,
      meta: {
        ignoreAuth: true
      },
      children: [
        {
          path: 'language',
          name: 'setting-language',
          component: () => import('../views/setting/language/index.vue')
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
      if (to.meta.ignoreAuth || userStore.token) {
        return true
      }
      return { name: 'user-login' }
    } else {
      if (to.name === 'launch' || to.name === 'user-login') {
        return true
      } else {
        return { name: 'launch' }
      }
    }
  })

  return router
}
