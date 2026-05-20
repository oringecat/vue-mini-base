import { shallowRef } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { showConfirmDialog } from 'vant'
import type { ComponentManagerOptions } from './types'

function createComponentManager() {
    // 组件关闭回调集合
    const closeActions = new Map<symbol, () => Promise<void>>()

    return (options: Partial<ComponentManagerOptions> = {}) => {
        const { destroyOnClose = true, confirmMessage } = options

        const key = Symbol()
        const componentId = shallowRef('')
        const showComponent = shallowRef(false) // 当前组件实例

        const handleClose = () => {
            if (closeActions.has(key)) {
                showComponent.value = false
                closeActions.delete(key)
            }
        }

        const openComponent = (componentName: string) => {
            //console.log('打开组件', componentName)
            componentId.value = componentName
            showComponent.value = true

            // 注册当前组件关闭回调
            closeActions.set(key, async () => {
                const message = typeof confirmMessage === 'function' ? confirmMessage(componentName) : confirmMessage
                if (message) {
                    await showConfirmDialog({
                        message,
                        closeOnPopstate: false
                    })
                }
                handleClose()
            })
        }

        const closeComponent = () => {
            //console.log('关闭组件', componentId.value)
            if (destroyOnClose) {
                componentId.value = ''
            }
            handleClose()
        }

        // 只会在页面回退时生效
        onBeforeRouteLeave((to, from, next) => {
            if (showComponent.value) {
                const lastAction = [...closeActions.values()].at(-1)
                lastAction?.()
                next(false)
            } else {
                closeActions.clear()
                next()
            }
        })

        return {
            componentId,
            showComponent,
            openComponent,
            closeComponent
        }
    }
}

export const useComponent = createComponentManager()