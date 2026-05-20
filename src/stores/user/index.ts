import { reactive, toRefs, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { encryptAES, decryptAES } from '@/utils/crypto'
import { login, logout, checkToken } from '@/services/api/user'
import { localData, sessionData } from '../storage'
import serviceConfig from '@/services/config'
import eventBus from '@/utils/bus'

export const useUserStore = defineStore('user', () => {
    const tokenStorage = serviceConfig.getAppConfig('tokenStorage')

    // 初始化用户信息
    const initUserInfo = (): User.UserInfo => {
        return {
            id: 0,
            roleId: 0,
            userName: '匿名用户',
            realName: '',
            avatar: '',
            token: tokenStorage === 'local' ? localData.getValue('accessToken') : sessionData.getValue('accessToken')
        }
    }

    const state = reactive({
        loading: false,
        rememberMe: localData.getValue('rememberMe'),
        userInfo: initUserInfo(),
    })

    const token = computed(() => state.userInfo.token)

    const tokenRequest = checkToken({ immediate: false })
    const loginRequest = login({ immediate: false })

    // 加载初始数据
    const loadBaseData = async () => {
        await serviceConfig.init()
    }

    const getUserInfo = (key: keyof User.UserInfo) => {
        return state.userInfo[key]
    }

    const setUserInfo = (data: User.UserInfo) => {
        if (tokenStorage === 'local') {
            localData.setValue('accessToken', data.token)
        } else {
            sessionData.setValue('accessToken', data.token)
        }

        state.userInfo = data
        eventBus.emit('login', data)
    }

    // 用户登录
    const userLogin = async (params: User.LoginParams) => {
        try {
            state.loading = true
            await loadBaseData()
            cleanup()

            const res = await loginRequest.rawFetch(params)

            if (state.rememberMe) {
                const encryptedString = encryptAES(JSON.stringify(params)) // 数据加密
                localData.setValue('autoLoginEncrypted', encryptedString)
            }

            setUserInfo(res.data)
        } finally {
            state.loading = false
        }
    }

    // 自动登录
    const autoLogin = async () => {
        if (!token.value) {
            const encryptedData = localData.getValue('autoLoginEncrypted')

            if (state.rememberMe && encryptedData) {
                const decryptedString = decryptAES(encryptedData)
                const params = JSON.parse(decryptedString)
                await userLogin(params) // 尝试用加密数据登录
                return
            }
        }

        try {
            state.loading = true
            await loadBaseData() // 失败不清除登录信息

            if (token.value) {
                try {
                    const res = await tokenRequest.rawFetch()
                    setUserInfo(res.data)
                } catch {
                    cleanup()
                }
            }
        } finally {
            state.loading = false
        }
    }

    // 清除登录信息
    const cleanup = () => {
        sessionData.reset('accessToken')
        localData.reset('accessToken')
        localData.reset('autoLoginEncrypted')
        state.userInfo = initUserInfo()
    }

    // 用户登出
    const userLogout = () => {
        logout()
        cleanup()
        eventBus.emit('logout')
    }

    // 监听状态变化
    watch(() => state.rememberMe, (newVal) => {
        localData.setValue('rememberMe', newVal)
    })

    return {
        token,
        getUserInfo,
        userLogin,
        autoLogin,
        userLogout,
        ...toRefs(state)
    }
})