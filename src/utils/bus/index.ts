import type { EventBus } from './types'
import mitt from 'mitt'

export default new (class {
    private readonly emitter = mitt<EventBus>()
    private readonly cleanups = new Map<symbol, () => void>()

    // 获取事件监听器数量
    getListenerCount<T extends keyof EventBus>(event: T) {
        const events = this.emitter.all.get(event) ?? []
        return events.length
    }

    // 触发事件
    emit<T extends keyof EventBus>(event: T, payload?: EventBus[T]) {
        this.emitter.emit(event, payload as EventBus[T])
        return this.getListenerCount(event)
    }

    // 监听事件
    on<T extends keyof EventBus>(event: T, callback: (payload: EventBus[T]) => void, once = false) {
        const key = Symbol()

        const callbackHandler = (payload: EventBus[T]) => {
            if (once) cleanup() // 执行后自动销毁
            callback(payload)
        }

        const cleanup = () => {
            this.emitter.off(event, callbackHandler)
            this.cleanups.delete(key)
        }

        this.cleanups.set(key, cleanup)
        this.emitter.on(event, callbackHandler)

        return {
            key,
            off: () => cleanup()
        }
    }

    // 取消事件
    off(key: symbol) {
        const cleanup = this.cleanups.get(key)
        cleanup?.()
    }
})