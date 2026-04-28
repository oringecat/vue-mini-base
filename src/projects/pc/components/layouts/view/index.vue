<template>
    <div ref="viewRef" class="app-view">
        <div class="app-view__header">
            <div class="app-view__container">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="app-view__body">
            <div class="app-view__container">
                <slot></slot>
            </div>
        </div>
        <div class="app-view__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue'

const emit = defineEmits(['ready'])

const viewRef = shallowRef<HTMLDivElement>()

onMounted(() => {
    emit('ready', viewRef.value)
})
</script>

<style lang="less">
@import './index.less';
</style>