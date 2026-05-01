<template>
    <div class="app-page-view" :class="[`app-page-view--${type}`]">
        <slot name="header"></slot>
        <app-scroll-view class="app-page-view__container" v-model="scrollTop">
            <van-sticky class="app-page-view__header--sticky" :class="{ hide: isScrollDown }" position="top">
                <slot name="header-sticky"></slot>
            </van-sticky>
            <div class="app-page-view__header--scroll" :class="{ show: isScrollDown }" v-if="$slots['header-scroll']">
                <slot name="header-scroll"></slot>
            </div>
            <div class="app-page-view__main">
                <slot></slot>
            </div>
        </app-scroll-view>
        <slot name="footer"></slot>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, watch } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
    type: {
        type: String as PropType<'default' | 'primary'>,
        default: 'default'
    },
    // 滚动切换状态栏阈值
    threshold: {
        type: Number,
        default: 0
    }
})

const isScrollDown = shallowRef(false) // 是否向下滚动（切换两个状态栏）
const scrollTop = shallowRef(0)

watch(scrollTop, (top) => {
    if (props.threshold > 0) {
        isScrollDown.value = top > props.threshold
    }
})
</script>

<style lang="less">
@import './index.less';
</style>