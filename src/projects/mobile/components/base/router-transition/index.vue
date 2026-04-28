<template>
    <transition :name="transitionName">
        <slot></slot>
    </transition>
</template>

<script lang="ts" setup>
defineProps({
    transitionName: {
        type: String,
        default: 'delay'
    }
})
</script>

<style lang="less">
@import './index.less';
</style>