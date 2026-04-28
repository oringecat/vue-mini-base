<template>
    <pc-view class="login">
        <el-form size="large" label-width="auto">
            <el-form-item label="账号">
                <el-input v-model="formData.account" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="formData.password" placeholder="请输入" />
            </el-form-item>
            <el-form-item label=" ">
                <el-button @click="formSubmit" :loading="loading">登录</el-button>
            </el-form-item>
        </el-form>
    </pc-view>
</template>

<script lang="ts" setup>
import { reactive, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const loading = shallowRef(false)

const formData = reactive<User.LoginParams>({
    account: '',
    password: '',
    client: 'web',
    version: '1.0.0',
})

const formSubmit = async () => {
    try {
        loading.value = true
        await userStore.userLogin(formData)
        await authStore.fetchUserAuths(router)

        if (authStore.hasAuth) {
            router.push('/')
        } else {
            ElMessage.error('权限不足')
        }
    } catch (err) {
        loading.value = false
        formData.password = ''
        ElMessage.error(err as string)
    }
}
</script>