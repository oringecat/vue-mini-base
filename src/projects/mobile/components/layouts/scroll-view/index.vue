<template>
    <div ref="scrollRef" class="app-scroll-view">
        <slot></slot>
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
        default: 200
    }
})

const emit = defineEmits(['update:scrollTop', 'scroll', 'scrollToupper', 'scrollTolower'])

const scrollRef = shallowRef<HTMLDivElement>()
const scrollParent = useScrollParent(scrollRef)
const scrollMap = new Map<string, number>([[props.scrollName, props.scrollTop]])

const setScrollTop = () => {
    const el = scrollRef.value
    if (el) {
        el.scrollTop = scrollMap.get(props.scrollName) ?? props.scrollTop
    }
}

// const onScrollToupper = () => {
//     emit('scrollToupper')
// }

// const onScrollTolower = () => {
//     emit('scrollTolower')
// }

const listener = debounce((e: Event) => {
    const el = e.target as HTMLDivElement
    scrollMap.set(props.scrollName, el.scrollTop)

    emit('update:scrollTop', el.scrollTop)
    emit('scroll', el)
}, props.delay)

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