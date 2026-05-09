import { onMounted, onUnmounted, shallowRef, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import type { RefreshOptions } from './types'
import eventBus from '@/utils/bus'

export function useRefresh(callback: () => void, options: Partial<RefreshOptions> = {}) {
    const route = useRoute()

    const { immediate = true, refreshId = route.path } = options

    const refreshing = shallowRef(false)
    const isEventTriggered = shallowRef(false) // 是否由事件触发

    const startRefresh = () => {
        if (refreshing.value) return
        refreshing.value = true
        nextTick(() => callback())
    }

    // 手动触发下拉刷新完成事件
    const refreshFinish = () => {
        if (isEventTriggered.value) {
            nextTick(() => eventBus.emit('pull-refresh-finish'))
        }
        isEventTriggered.value = false
        refreshing.value = false
    }

    // 监听下拉刷新事件
    const refreshListener = eventBus.on('pull-refresh-start', (key = route.path) => {
        if (key !== refreshId) {
            nextTick(() => eventBus.emit('pull-refresh-finish'))
        } else {
            isEventTriggered.value = true
            startRefresh()
        }
    })

    onMounted(() => {
        if (immediate) {
            startRefresh()
        }
    })

    onUnmounted(() => {
        refreshListener.off()
    })

    return {
        refreshing,
        startRefresh,
        refreshFinish
    }
}