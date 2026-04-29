<template>
    <div class="app-scroll-view">
        <div ref="scrollRef" class="app-scroll-view__main">
            <van-sticky class="status-bar-fixed" :class="{ hide: isScrollDown }" position="top"
                v-if="$slots['statusBarFixed']">
                <slot name="statusBarFixed"></slot>
            </van-sticky>
            <div class="status-bar-scroll" :class="{ show: isScrollDown }" v-if="$slots['statusBarScroll']">
                <slot name="statusBarScroll"></slot>
            </div>
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onActivated, shallowRef, watch } from 'vue'
import { useScrollParent, useEventListener } from '@vant/use'
import { debounce } from 'lodash'

const props = defineProps({
    // 滚动元素名称 (用于共用组件缓存不同滚动条位置)
    scrollName: {
        type: String,
        default: 'default',
    },
    scrollTop: {
        type: Number,
        default: 0
    },
    delay: {
        type: Number,
        default: 80
    },
    // 滚动切换状态栏阈值
    threshold: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['update:scrollTop', 'scroll', 'scrollToupper', 'scrollTolower'])

const scrollRef = shallowRef<HTMLDivElement>()
const scrollParent = useScrollParent(scrollRef)
const scrollMap = new Map<string, number>([[props.scrollName, props.scrollTop]])

// 是否向下滚动（切换两个状态栏）
const isScrollDown = shallowRef(false)

const setScrollTop = () => {
    const el = scrollRef.value
    if (el) {
        el.scrollTop = scrollMap.get(props.scrollName) ?? props.scrollTop
        if (props.threshold > 0) {
            isScrollDown.value = el.scrollTop > props.threshold
        }
    }
}

// const onScrollToupper = () => {
//     emit('scrollToupper')
// }

// const onScrollTolower = () => {
//     emit('scrollTolower')
// }

// 防抖触发滚动事件
const onScroll = debounce((el: HTMLDivElement) => {
    scrollMap.set(props.scrollName, el.scrollTop)
    emit('update:scrollTop', el.scrollTop)
    emit('scroll', el)
}, props.delay)

const listener = (e: Event) => {
    const el = e.target as HTMLDivElement
    if (props.threshold > 0) {
        isScrollDown.value = el.scrollTop > props.threshold // 滚动超过阈值切换状态栏
    }
    onScroll(el)
}

useEventListener('scroll', listener, {
    target: scrollParent,
    passive: true
})

onMounted(() => {
    setScrollTop()
    onActivated(() => setScrollTop())
})

watch(() => props.scrollName, () => setScrollTop())
</script>

<style lang="less">
@import './index.less';
</style>