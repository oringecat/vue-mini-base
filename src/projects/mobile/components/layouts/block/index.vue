<template>
    <div class="app-block" :class="[`app-block--${blockType}`, { 'app-block--inset': injected.inset }]">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
    inset: {
        type: Boolean,
        default: true
    },
    type: {
        type: String as PropType<'default' | 'primary'>
    }
})

const injected = inject('blockProps', props)

const blockType = computed(() => props.type || injected.type || 'default')
</script>

<style lang="less">
@import './index.less';
</style>