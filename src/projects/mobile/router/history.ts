import { reactive, computed } from 'vue'
import { createRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { findLastIndex } from 'lodash'
import type { RouterOptions, RouteLocationRaw, RouteLocationNormalized } from 'vue-router'
import type { HistoryRoute, HistoryState } from './types'

export const useHistoryStore = defineStore('history', () => {
  const sessionKey = 'historys_' + (import.meta.env.PROJECT_ID || 'mobile')

  const state = reactive<HistoryState>({
    historys: [], // 路由历史栈
    excludes: [], // 不缓存的视图
    actionName: '', // 当前路由动作
    transitionName: '', // 过渡动画
    goStep: 0 // 前进后退步数
  })

  const sessionData = sessionStorage.getItem(sessionKey)

  if (sessionData) {
    const sessionHistorys = JSON.parse(sessionData) as HistoryRoute[]
    state.historys = sessionHistorys
  }

  const excludes = computed(() => state.excludes)
  const transitionName = computed(() => state.transitionName)

  // 创建路由
  const create = (options: RouterOptions) => {
    const router = createRouter(options)
    const { push, replace, go, forward, back } = router

    // 跳转
    router.push = (to: RouteLocationRaw) => {
      if (to.replace === true) {
        state.actionName = 'push-replace'
      } else {
        state.actionName = 'push'
      }
      return push(to)
    }

    // 替换
    router.replace = (to: RouteLocationRaw) => {
      state.actionName = 'replace'
      return replace(to)
    }

    // 前进后退
    router.go = (delta: number) => {
      state.goStep = delta
      if (delta > 0) {
        state.actionName = 'forward'
      }
      if (delta < 0) {
        state.actionName = 'back'
      }
      go(delta)
    }

    // 前进
    router.forward = () => {
      state.actionName = 'forward'
      forward()
    }

    // 后退
    router.back = () => {
      state.actionName = 'back'
      back()
    }

    router.beforeResolve((to) => {
      addHistory(to)
    })

    router.afterEach(() => {
      state.excludes = []
    })

    return router
  }

  // 添加历史记录
  const addHistory = (route: RouteLocationNormalized) => {
    const newHistory = {
      name: route.name as string,
      fullPath: route.fullPath,
    }

    // 如果是替换动作，必定是前进
    if (['push-replace', 'replace'].includes(state.actionName)) {
      const lastIndex = state.historys.length - 1
      const lastRecord = state.historys[lastIndex]

      if (lastRecord) {
        state.excludes.push(lastRecord.name as string)
        state.historys[lastIndex] = newHistory // 更新最后一条记录
      } else {
        state.historys.push(newHistory)
      }

      if (state.actionName === 'push-replace') {
        state.transitionName = 'route-in' // 前进动画
      } else {
        state.transitionName = 'fade'
      }
    } else {
      // 倒序查找路由所在的位置
      const targetIndex = findLastIndex(state.historys, (item) => item?.fullPath === route.fullPath)

      if (targetIndex > -1) {
        if (state.actionName === 'push') {
          state.historys.push(newHistory)
          state.transitionName = 'route-in' //前进动画
        } else {
          if (state.historys.length > 1) {
            const i = targetIndex + 1
            const n = state.historys.length - i

            state.excludes = state.historys.slice(i).map((e) => e.name) // 返回数组最后位置开始的n个元素
            state.historys.splice(i, n) // 从i位置开始删除后面所有元素(包括i)
          }

          state.transitionName = 'route-out' //后退动画
        }
      } else {
        if (state.goStep < 0) {
          const i = state.historys.length + state.goStep

          if (i > 0) {
            const n = state.historys.length - i
            state.excludes = state.historys.slice(n).map((e) => e.name) // 返回数组最后位置开始的n个元素
            state.historys.splice(i)
          }
        }

        // 如有存在重定向的页面，判断路由前进还是后退
        if (route.redirectedFrom) {
          if (state.goStep < 0) {
            const index = state.historys.length - 1
            const lastIndex = index > -1 ? index : 0

            state.historys[lastIndex] = newHistory // 更新最后一条记录
            state.transitionName = 'route-out' //后退动画
          } else {
            const [lastRecord] = state.historys.slice(-1)

            if (route.redirectedFrom.fullPath !== lastRecord?.fullPath) {
              state.historys.push(newHistory)
            }

            state.transitionName = 'route-in' // 前进动画
          }
        } else {
          state.historys.push(newHistory)

          if (state.historys.length > 1) {
            state.transitionName = 'route-in' // 前进动画
          }
        }
      }
    }

    state.actionName = ''
    state.goStep = 0

    sessionStorage.setItem(sessionKey, JSON.stringify(state.historys))
  }

  return {
    excludes,
    transitionName,
    create
  }
})