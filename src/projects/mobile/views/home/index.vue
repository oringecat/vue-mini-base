<template>
    <app-scroll-view :threshold="200">
        <template #header-sticky>
            <app-nav-bar title="首页" :show-back-button="false" />
        </template>
        <template #header-scroll>
            <app-status-bar>
                <van-search />
            </app-status-bar>
        </template>
        <app-pull-refresh :refresh-id="activeTab">
            <van-tabs v-model:active="activeTab">
                <van-tab title="标签 1">
                    <van-empty v-for="i in 10" :key="i" />
                </van-tab>
                <van-tab title="标签 2">
                    <product-list :refresh-id="1" />
                </van-tab>
                <van-tab title="标签 3">
                    <order-list :refresh-id="2" />
                </van-tab>
                <van-tab title="标签 4">内容 4</van-tab>
            </van-tabs>
        </app-pull-refresh>
    </app-scroll-view>
</template>

<script lang="ts" setup>
import { shallowRef, defineAsyncComponent } from 'vue'
import { useRefresh } from '@/composables/refresh'
import AppPullRefresh from '@mobile/components/base/pull-refresh/index.vue'

const ProductList = defineAsyncComponent(() => import('./components/product/index.vue'))
const OrderList = defineAsyncComponent(() => import('./components/order/index.vue'))

const activeTab = shallowRef(0)

const { refreshFinish } = useRefresh(() => {
    // 模拟数据请求
    setTimeout(() => refreshFinish(), 1000)
})
</script>