<template>
    <div class="launch">
        <van-loading />
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

userStore.autoLogin().finally(() => {
    const redirect = route.query.redirect
    if (redirect) {
        router.replace(redirect.toString())
    } else {
        router.replace('/')
    }
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>