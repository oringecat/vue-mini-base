<template>
    <app-scroll-view>
        <template #header-fixed>
            <app-nav-bar title="我的" :show-back-button="false" />
        </template>
        <van-cell-group inset>
            <van-cell title="登录" to="/user/login" is-link />
            <van-cell title="设置" to="/setting/language" is-link />
        </van-cell-group>
    </app-scroll-view>
</template>

<script lang="ts" setup>
</script>