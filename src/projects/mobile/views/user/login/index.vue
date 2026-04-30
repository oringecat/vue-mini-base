<template>
    <app-view>
        <template #header>
            <app-nav-bar title="登录" />
        </template>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="formData.account" name="account" label="账号" placeholder="必填"
                    autocomplete="username" />
                <van-field v-model="formData.password" type="password" name="password" label="密码" placeholder="必填"
                    autocomplete="new-password" />
            </van-cell-group>
            <app-block>
                <van-button type="primary" native-type="submit" :disabled="userStore.loading" block>登录</van-button>
            </app-block>
        </van-form>
    </app-view>
</template>

<script lang="ts" setup>
import { reactive, } from 'vue'
import { showLoadingToast, showSuccessToast, showFailToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const formData = reactive<User.LoginParams>({
    account: '',
    password: '',
    client: 'web',
    version: '1.0.0',
})

const onSubmit = () => {
    showLoadingToast('登录中...')

    userStore.userLogin(formData).then(() => {
        showSuccessToast('登录成功')
    }).catch((err) => {
        formData.password = ''
        showFailToast(err)
    }).finally(() => {
        closeToast()
    })
}
</script>