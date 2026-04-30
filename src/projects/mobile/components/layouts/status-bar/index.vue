<template>
  <div ref="statusbarRef" class="app-status-bar">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import plus from '@/utils/plus'

const emit = defineEmits(['ready'])

const statusbarRef = ref<HTMLElement>()

onMounted(() => {
    const el = statusbarRef.value
    if (el) {
        const statusBarHeight = plus.getSystemInfo('statusBarHeight')
        el.style.setProperty('padding-top', statusBarHeight + 'px')
        nextTick(() => emit('ready', el))
    }
})
</script>