<template>
    <div class="launch" v-loading="true"></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const initializeApp = async () => {
    try {
        await userStore.autoLogin()

        if (userStore.token) {
            await authStore.fetchUserAuths(router)
        }

        if (userStore.token && authStore.hasAuth) {
            const redirected = route.redirectedFrom
            if (redirected) {
                router.replace(redirected.fullPath)
            } else {
                router.replace('/')
            }
        } else {
            router.replace('/login')
        }
    } catch {
        router.replace('/login')
    }
}

initializeApp()
</script>

<style lang="less" scoped>
@import './index.less';
</style>