<template>
    <van-list class="app-list" v-model:error="errorState" :finished-text="finishedText"
        :immediate-check="immediateCheck" @load="onLoad">
        <slot></slot>
    </van-list>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
    error: {
        type: Boolean,
        default: false,
    },
    finishedText: {
        type: String,
        default: '没有更多了'
    },
    // 是否在初始化时立即执行滚动位置检查
    immediateCheck: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:error', 'load'])

const errorState = computed({
    get: () => props.error,
    set: (val) => emit('update:error', val)
})

// 下拉刷新过程中禁止上拉加载
const onLoad = () => {
    emit('load')
}
</script>