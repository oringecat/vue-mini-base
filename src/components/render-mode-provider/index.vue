<template>
  <slot />
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { RenderModeKey, type RenderMode } from './useRenderMode'

const props = defineProps<{
  mode: RenderMode
}>()

// 组件渲染模式
provide(RenderModeKey, computed(() => props.mode))
</script>
