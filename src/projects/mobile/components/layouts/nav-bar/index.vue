<template>
    <app-status-bar :class="['app-nav-bar', { 'app-nav-bar--fixed': fixed }]">
        <div class="app-nav-bar__header">
            <div class="app-nav-bar__col app-nav-bar__col--left">
                <slot name="left">
                    <app-nav-back v-if="showBackButton" />
                </slot>
            </div>
            <div class="app-nav-bar__col app-nav-bar__col--center">
                <slot>
                    <span v-if="title">{{ title }}</span>
                </slot>
            </div>
            <div class="app-nav-bar__col app-nav-bar__col--right">
                <slot name="right"></slot>
            </div>
        </div>
        <div class="app-nav-bar__footer">
            <slot name="footer"></slot>
        </div>
    </app-status-bar>
</template>

<script lang="ts" setup>
const props = defineProps({
    // 导航栏标题
    title: String,
    // 是否固定导航栏
    fixed: Boolean,
    // 是否显示返回按钮
    showBackButton: {
        type: Boolean,
        default: true
    }
})
</script>

<style lang="less">
@import './index.less';
</style>