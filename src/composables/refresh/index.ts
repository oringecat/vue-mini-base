import { onMounted, onUnmounted, shallowRef, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import type { RefreshOptions } from './types'
import eventBus from '@/utils/bus'

export function useRefresh(callback: () => void, options: Partial<RefreshOptions> = {}) {
    const route = useRoute()

    const { immediate = true, refreshId = route.path } = options

    const refreshing = shallowRef(false)
    const isEventTriggered = shallowRef(false) // 是否由事件触发

    // 通知下拉刷新结束
    const emitFinish = (force = false) => {
        if (force || isEventTriggered.value) {
            nextTick(() => eventBus.emit('pull-refresh-finish'))
        }
    }

    // 开始刷新
    const startRefresh = () => {
        if (refreshing.value) {
            emitFinish()
        } else {
            refreshing.value = true
            nextTick(callback)
        }
    }

    // 手动触发下拉刷新完成事件
    const refreshFinish = () => {
        emitFinish()
        isEventTriggered.value = false
        refreshing.value = false
    }

    // 监听下拉刷新事件
    const refreshListener = eventBus.on('pull-refresh-start', (key = route.path) => {
        if (key === refreshId) {
            isEventTriggered.value = true
            startRefresh()
        } else {
            // 非当前组件时通知刷新结束
            emitFinish(true)
        }
    })

    // 组件挂载后触发一次刷新
    onMounted(() => {
        if (immediate) {
            startRefresh()
        }
    })

    onUnmounted(() => {
        emitFinish()
        refreshListener.off()
    })

    return {
        refreshing,
        startRefresh,
        refreshFinish
    }
}