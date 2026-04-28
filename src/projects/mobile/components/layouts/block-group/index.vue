<template>
    <div class="app-block-group" :style="styles">
        <view class="app-block-group__title" v-if="title">{{ title }}</view>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import type { PropType, CSSProperties } from 'vue'

const props = defineProps({
    title: String,
    inset: {
        type: Boolean,
        default: true
    },
    type: {
        type: String as PropType<'default' | 'primary'>,
        default: 'default'
    },
    gutter: {
        type: [Number, String],
        default: 'var(--block-padding-sm)'
    }
})

//const isGutterPositive = computed(() => typeof props.gutter === 'number' ? props.gutter > 0 : true)

const styles = computed<CSSProperties>(() => ({
    gap: props.gutter + (typeof props.gutter === 'number' ? 'rpx' : '')
}))

// 自动注入子组件参数
provide('blockProps', {
    inset: props.inset,
    type: props.type
})
</script>

<style lang="less">
@import './index.less';
</style>