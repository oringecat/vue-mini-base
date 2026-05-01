<template>
    <div class="app-view">
        <slot name="header"></slot>
        <div class="app-view__main">
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="less">
@import './index.less';
</style>