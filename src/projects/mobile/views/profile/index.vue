<template>
    <app-page-view>
        <template #header>
            <app-nav-bar title="我的" :show-back-button="false" />
        </template>
        <van-cell-group inset>
            <van-cell title="登录" to="/user/login" is-link />
            <van-cell title="设置" to="/setting/language" is-link />
        </van-cell-group>
        <app-block>
            <van-button type="primary" block @click="logout">退出</van-button>
        </app-block>
        <app-block v-if="userStore.token">
            {{ userStore.userInfo }}
        </app-block>
    </app-page-view>
</template>

<script lang="ts" setup>
import { showConfirmDialog } from 'vant'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const logout = () => {
    showConfirmDialog({
        message: '确认退出登录？'
    }).then(() => {
        userStore.userLogout()
    })
}
</script>