<template>
    <div ref="statusBarElement" class="app-statusbar">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, onMounted, nextTick } from 'vue'
import plus from '@/utils/plus'

const emit = defineEmits(['ready'])

const statusBarElement = shallowRef<HTMLElement>()

// 组件挂载完成
onMounted(() => {
    const el = statusBarElement.value

    if (el) {
        const statusBarHeight = plus.getSystemInfo('statusBarHeight')

        el.style.setProperty('padding-top', statusBarHeight + 'px')

        nextTick(() => emit('ready', el))
    }
})
</script>