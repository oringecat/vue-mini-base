<template>
    <app-page-view>
        <template #header>
            <app-nav-bar title="订单列表" />
        </template>
        <van-button type="primary" @click="openView('detail')">详情</van-button>
        <component :show="showComponent" :is="components[componentId]" @closed="closeComponent" />
    </app-page-view>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, type Component } from 'vue'
import { useComponent } from '@/composables/component'

const components: Record<string, Component> = {
    detail: defineAsyncComponent(() => import('../detail/index.vue'))
}

const { showComponent, componentId, openComponent, closeComponent } = useComponent()

const openView = (componentName: string) => {
    openComponent(componentName)
}
</script>