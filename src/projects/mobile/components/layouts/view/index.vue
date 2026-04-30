<template>
    <div ref="viewRef" class="app-view" :class="[`bg-${viewType}`]">
        <slot name="header"></slot>
        <div class="app-view__main">
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, shallowRef, computed, provide, inject } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
    // 背景颜色
    type: {
        type: String as PropType<'default' | 'primary'>,
        default: ''
    }
})

const emit = defineEmits(['ready'])

// 嵌套组件继承父级属性
const injected = inject('viewProps', {
    type: 'default'
})

const viewRef = shallowRef<HTMLDivElement>()

const viewType = computed(() => props.type || injected.type)

onMounted(() => {
    emit('ready', viewRef.value)
})

// 自动注入子组件参数
provide('viewProps', {
    get type() {
        return viewType.value
    }
})
</script>

<style lang="less">
@import './index.less';
</style>