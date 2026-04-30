<template>
    <van-pull-refresh class="app-pull-refresh" v-model="loading" @refresh="onRefresh">
        <slot></slot>
    </van-pull-refresh>
</template>

<script lang="ts" setup>
import { onUnmounted, shallowRef } from 'vue'
import eventBus from '@/utils/bus'

const props = defineProps({
    // 刷新事件唯一标识ID，页面存在多组件时进行匹配刷新
    refreshId: {
        type: Number,
        default: 0
    }
})

const loading = shallowRef(false)
const startCounts = shallowRef(0) // 事件触发计数器
const finishCounts = shallowRef(0) // 事件结束计数器

const onRefresh = () => {
    finishCounts.value = 0
    startCounts.value = eventBus.emit('pull-refresh-start', props.refreshId)
}

const refreshListener = eventBus.on('pull-refresh-finish', () => {
    finishCounts.value++
    loading.value = finishCounts.value < startCounts.value
})

onUnmounted(() => refreshListener.off())
</script>

<style lang="less">
@import './index.less';
</style>