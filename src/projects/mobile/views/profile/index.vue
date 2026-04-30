<template>
    <app-scroll-view>
        <template #header>
            <app-nav-bar title="我的" :show-back-button="false" />
        </template>
        <van-cell-group inset>
            <van-cell title="登录" to="/user/login" is-link />
            <van-cell title="设置" to="/setting/language" is-link />
        </van-cell-group>
        <app-block>
            <van-button type="primary" block @click="userStore.userLogout">退出</van-button>
        </app-block>
    </app-scroll-view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>