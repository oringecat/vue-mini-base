<template>
    <app-view>
        <template #header>
            <span>我的</span>
        </template>
        <router-link to="/user/login">
            <van-button>登录</van-button>
        </router-link>
    </app-view>
</template>

<script lang="ts" setup>
import AppView from '../../components/layouts/view/index.vue'
</script>