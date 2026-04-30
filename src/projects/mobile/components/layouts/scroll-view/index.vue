<template>
    <app-view class="app-scroll-view">
        <template #header>
            <slot name="header"></slot>
        </template>
        <app-scroll-container class="app-scroll-view__container" v-model="scrollTop">
            <van-sticky class="header-sticky" :class="{ hide: isScrollDown }" position="top">
                <slot name="header-sticky"></slot>
            </van-sticky>
            <div class="header-scroll" :class="{ show: isScrollDown }" v-if="$slots['header-scroll']">
                <slot name="header-scroll"></slot>
            </div>
            <div class="app-scroll-view__main">
                <slot></slot>
            </div>
        </app-scroll-container>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </app-view>
</template>

<script lang="ts" setup>
import { shallowRef, watch } from 'vue'

const props = defineProps({
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