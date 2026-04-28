import { shallowRef, onUnmounted, nextTick } from 'vue'
import eventBus from '@/utils/bus'

export function useRefresh(callback: () => void, refreshId?: number) {
    const refreshing = shallowRef(false)

    // 监听下拉刷新事件
    const refreshListener = eventBus.on('pull-refresh-start', (id) => {
        if (refreshId !== undefined && id !== refreshId) {
            nextTick(() => eventBus.emit('pull-refresh-finish'))
        } else {
            refreshing.value = true
            callback()
        }
    })

    // 手动触发下拉刷新完成事件
    const refreshFinish = () => {
        refreshing.value = false
        nextTick(() => eventBus.emit('pull-refresh-finish'))
    }

    onUnmounted(() => refreshListener.off())

    return {
        refreshing,
        refreshFinish
    }
}