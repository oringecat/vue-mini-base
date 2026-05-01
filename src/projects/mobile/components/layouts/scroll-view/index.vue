<template>
    <div ref="scrollRef" class="app-scroll-view">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onActivated, shallowRef, computed, watch } from 'vue'
import { useScrollParent, useEventListener } from '@vant/use'
import { debounce } from 'lodash'

const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    // 滚动元素名称 (用于共用组件缓存不同滚动条位置)
    scrollName: {
        type: String,
        default: 'default',
    },
    delay: {
        type: Number,
        default: 80
    }
})

const emit = defineEmits(['update:modelValue', 'scroll', 'scrollToupper', 'scrollTolower'])

const scrollRef = shallowRef<HTMLDivElement>()
const scrollParent = useScrollParent(scrollRef)
const scrollMap = new Map<string, number>([[props.scrollName, props.modelValue]])

const scrollTop = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const setScrollTop = () => {
    const el = scrollRef.value
    if (el) {
        el.scrollTop = scrollMap.get(props.scrollName) ?? scrollTop.value
        scrollTop.value = el.scrollTop
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
    emit('scroll', el)
}, props.delay)

const listener = (e: Event) => {
    const el = e.target as HTMLDivElement
    scrollTop.value = el.scrollTop
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