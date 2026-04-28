<template>
    <router-view class="app-page" v-slot="{ Component, route }">
        <router-transition :transition-name="historyStore.transitionName" @leave="onLeave" @after-enter="onAfterEnter">
            <!-- 缓存组件，前进刷新，后退缓存 -->
            <keep-alive :exclude="historyStore.excludes">
                <component :is="handleComponent(Component, route)" :key="getRouteKey(route)" />
            </keep-alive>
        </router-transition>
    </router-view>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { useTransitionStore } from '@/stores/transition'
import { useHistoryStore } from '@/projects/mobile/router/history'
import RouterTransition from '@mobile/components/base/router-transition/index.vue'

const transitionStore = useTransitionStore()
const historyStore = useHistoryStore()

// 手动给组件添加 name 属性，处理缓存 exclude 无效的问题
const handleComponent = (component: Component, route: RouteLocationNormalized) => {
    if ('type' in component) {
        component.type.name = route.name
    }
    return component
}

// key 的作用是当 $route.query 参数发生变化时会刷新页面
// 不直接使用 $route.fullPath 的原因是每次都会刷新页面，导致嵌套路由缓存失效
const getRouteKey = (route: RouteLocationNormalized) => {
    const qs = Object.keys(route.query)
    return qs.length ? route.fullPath : undefined
}

const onLeave = () => {
    transitionStore.startTransition()
}

const onAfterEnter = () => {
    transitionStore.endTransition()
}
</script>