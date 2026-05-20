import { getCurrentInstance, computed } from 'vue'
import { useRoute } from 'vue-router'

export function useNavigation() {
    const instance = getCurrentInstance()
    const route = useRoute()

    // 当前组件是否路由
    const isRoute = computed(() => {
        const currentType = instance?.type
        const matched = route.matched.at(-1)
        if (!currentType || !matched) return false

        // 获取当前路由导出的组件
        const routeComponent = matched.components?.default

        console.log(routeComponent,currentType)
        // 判断路由是否组件本身
        return routeComponent === currentType
    })

    return {
        route,
        isRoute
    }
}