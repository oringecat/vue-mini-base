<template>
    <app-statusbar :class="['app-navbar', { 'app-navbar--fixed': fixed }]">
        <div class="app-navbar__header">
            <div class="app-navbar__col app-navbar__col--left">
                <slot name="left">
                    <app-navback v-if="showBackButton" />
                </slot>
            </div>
            <div class="app-navbar__col app-navbar__col--center">
                <slot>
                    <span v-if="title">{{ title }}</span>
                </slot>
            </div>
            <div class="app-navbar__col app-navbar__col--right">
                <slot name="right"></slot>
            </div>
        </div>
        <div class="app-navbar__footer">
            <slot name="footer"></slot>
        </div>
    </app-statusbar>
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