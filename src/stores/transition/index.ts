import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { TaskQueue } from '@/utils/queue'

export const useTransitionStore = defineStore('transition', () => {
    const queue = new TaskQueue()

    const state = reactive({
        transitionDuration: 200,
        isTransitioning: false
    })

    const transitionDuration = computed(() => state.transitionDuration)

    const isTransitioning = computed(() => state.isTransitioning)

    const startTransition = () => {
        state.isTransitioning = true
    }

    const endTransition = () => {
        state.isTransitioning = false
        queue.run()
    }

    const addTask = (callback: () => void) => {
        if (state.isTransitioning) {
            queue.add(callback)
        } else {
            callback()
        }
    }

    return {
        transitionDuration,
        isTransitioning,
        startTransition,
        endTransition,
        addTask
    }
})
