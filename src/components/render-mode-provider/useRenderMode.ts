import { computed, inject } from 'vue'

export type RenderMode = 'page' | 'popup'

export const RenderModeKey = Symbol('RenderMode')

export function useRenderMode() {
    const mode = inject(RenderModeKey, computed<RenderMode>(() => 'page'))

    const isPage = computed(() => mode.value === 'page')
    const isPopup = computed(() => mode.value === 'popup')

    return {
        isPage,
        isPopup
    }
}