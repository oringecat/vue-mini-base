<template>
    <div class="page-home">
        <router-view v-slot="{ Component }">
            <router-transition :css="cssTransition">
                <!-- 缓存组件，前进刷新，后退缓存 -->
                <keep-alive>
                    <component class="page-home__main" :is="Component" />
                </keep-alive>
            </router-transition>
        </router-view>
        <van-tabbar v-model="active" :before-change="beforeChange" :fixed="false">
            <van-tabbar-item name="home" icon="home-o" :to="{ name: 'home' }" replace>首页</van-tabbar-item>
            <van-tabbar-item name="profile" icon="friends-o" :to="{ name: 'profile' }" replace>我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RouterTransition from '../../base/router-transition/index.vue'

const route = useRoute()
const router = useRouter()
const active = shallowRef(route.name?.toString())
const cssTransition = shallowRef(true) // 是否使用css动画

const beforeChange = () => {
    cssTransition.value = false
    return true
}

router.afterEach(() => {
    nextTick(() => {
        cssTransition.value = true
    })
})
</script>

<style lang="less">
@import './index.less';
</style>