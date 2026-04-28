import { shallowRef, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Router, RouteRecordRaw } from 'vue-router'
import { getUserAuths } from '@/services/api/user'
import { authRoutes } from './routes'
import { AuthType } from './types'
import type { AuthRoute } from './types'

export const useAuthStore = defineStore('auth', () => {
    // 用户权限
    const userAuths = shallowRef<AuthRoute[]>([])

    // 用户路由
    const userRoutes = computed(() => resolveRoute(userAuths.value))

    // 用户菜单
    const userMenus = computed(() => filterAuthMenus(userAuths.value))

    // 默认首页
    const defaultHomeUrl = computed(() => getFirstRoutePath(userRoutes.value))

    // 是否有权限
    const hasAuth = computed(() => userRoutes.value.length > 0)

    const { loading, fetchAsync } = getUserAuths({
        manual: true
    })

    // 递归查找路由第一个有效路径
    const getFirstRoutePath = (routes: RouteRecordRaw[]): string => {
        for (const node of routes) {
            if (node.children?.length) {
                const path = getFirstRoutePath(node.children)
                if (path) return path
            }
            if (node.path) return node.path
        }
        return '/404'
    }

    // 请求用户权限
    const fetchUserAuths = async (router: Router) => {
        const res = await fetchAsync()
        userAuths.value = filterAuthRoutes(authRoutes, res.data)
        userRoutes.value.forEach(router.addRoute)
    }

    // 过滤权限路由
    const filterAuthRoutes = (data: AuthRoute[], codes: string[]) => data.reduce<AuthRoute[]>((result, route) => {
        const hasAuth = codes.some((code) => code === route.code)
        if (hasAuth) {
            const children = route.children ? filterAuthRoutes(route.children, codes) : []
            result.push({ ...route, children })
        }
        return result
    }, [])

    // 过滤权限菜单
    const filterAuthMenus = (data: AuthRoute[]) => data.reduce<AuthRoute[]>((pre, cur) => {
        if (cur.authType === AuthType.Route || cur.authType === AuthType.Link) {
            pre.push({
                ...cur,
                children: cur.children ? filterAuthMenus(cur.children) : []
            })
        }
        return pre
    }, [])

    // 解析路由
    const resolveRoute = (data: AuthRoute[]) => {
        const result: RouteRecordRaw[] = []
        data.forEach((item) => {
            if (item.authType === AuthType.Route && item.url) {
                const route: RouteRecordRaw = {
                    path: item.url,
                    name: item.code,
                    component: item.component,
                    meta: {
                        title: item.title,
                        icon: item.icon,
                        remark: item.remark,
                        keepAlive: true, // 默认缓存页面
                    },
                    children: item.children?.length ? resolveRoute(item.children) : []
                }
                result.push(route)
            }
        })
        return result
    }

    return {
        loading,
        userRoutes,
        userMenus,
        hasAuth,
        defaultHomeUrl,
        fetchUserAuths
    }
})
