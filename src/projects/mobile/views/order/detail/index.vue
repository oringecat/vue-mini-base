<template>
    <app-popup>
        <app-page-view>
            <template #header>
                <app-nav-bar title="详情" />
            </template>
            <van-button @click="openView('after')">售后</van-button>
            <component :show="showComponent" :is="components[componentId]" @closed="closeView" />
        </app-page-view>
    </app-popup>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, type Component } from 'vue'
import { useComponent } from '@/composables/component'
import AppPopup from '@mobile/components/base/popup/index.vue'

const components: Record<string, Component> = {
    after: defineAsyncComponent(() => import('../after/index.vue'))
}

const { showComponent, componentId, openComponent, closeComponent } = useComponent()

const openView = (componentName: string) => {
    openComponent(componentName)
}

const closeView = (isRefresh: boolean) => {
    if (isRefresh) {
        console.log('刷新数据')
    }
    closeComponent()
}
</script>