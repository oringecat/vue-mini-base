import { createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useHistoryStore } from './history'
import { useAuthStore } from '@/stores/auth'
import serviceConfig from '@/services/config'
import eventBus from '@/utils/bus'

export default function createRouter() {
  const historyStore = useHistoryStore()
  const authStore = useAuthStore()

  const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      redirect: () => authStore.hasAuth ? authStore.defaultHomeUrl : '/login', // 重定向到默认页面
    },
    {
      path: '/launch',
      name: 'launch',
      component: () => import('../views/launch/index.vue'),
      meta: {
        title: '初始化',
        keepAlive: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
      meta: {
        title: '登录',
        keepAlive: false
      }
    }
  ]

  const router = historyStore.create({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
  })

  router.beforeEach(async (to) => {
    if (serviceConfig.isReady && authStore.hasAuth) {
      return true
    } else {
      if (to.name === 'launch' || to.name === 'login') {
        return true
      } else {
        return {
          name: 'launch',
          query: { redirect: to.fullPath }
        }
      }
    }
  })

  eventBus.on('logout', () => {
    authStore.userRoutes.forEach(({ name }) => {
      if (name) router.removeRoute(name)
    })
    authStore.$reset()
  })

  return router
}