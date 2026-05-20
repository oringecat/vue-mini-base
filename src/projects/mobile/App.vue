<template>
  <render-mode-provider mode="page">
    <router-view />
  </render-mode-provider>
</template>

<script lang="ts" setup>
import RenderModeProvider from '@/components/render-mode-provider/index.vue'
</script>

<style lang="less">
@import './assets/themes/style.less';
</style>