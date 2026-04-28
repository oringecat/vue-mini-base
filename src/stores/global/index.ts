import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
    const state = reactive({
        loading: false
    })

    const loading = computed(() => state.loading)

    return {
        loading
    }
})
