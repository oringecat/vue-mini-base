import { reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { encryptAES, decryptAES } from '@/utils/crypto'
import { login, checkToken } from '@/services/api/user'
import { localData, sessionData } from '../storage'
import serviceConfig from '@/services/config'
import eventBus from '@/utils/bus'

export const useUserStore = defineStore('user', () => {
    const tokenStorage = serviceConfig.getAppConfig('tokenStorage')

    // 初始化用户信息
    const initUserInfo = (): User.UserInfo => {
        return {
            id: 0,
            userName: '匿名用户',
            realName: '',
            avatar: '',
            token: tokenStorage === 'local' ? localData.getValue('token') : sessionData.getValue('token')
        }
    }

    const state = reactive({
        loading: false,
        rememberMe: localData.getValue('rememberMe'),
        userInfo: initUserInfo(),
    })

    const token = computed(() => state.userInfo.token)

    const tokenRequest = checkToken({ manual: true })
    const loginRequest = login({ manual: true })

    // 自动加载初始数据
    const loadBaseData = (async () => {
        await serviceConfig.init()
    })()

    const getUserInfo = (key: keyof User.UserInfo) => {
        return state.userInfo[key]
    }

    const setUserInfo = (data: User.UserInfo) => {
        if (tokenStorage === 'local') {
            localData.setValue('token', data.token)
        } else {
            sessionData.setValue('token', data.token)
        }
        state.userInfo = data
        eventBus.emit('login', data)
    }

    // 用户登录
    const userLogin = async (params: User.LoginParams) => {
        try {
            state.loading = true
            await loadBaseData
            const res = await loginRequest.fetchAsync(params)

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
        if (token.value) {
            try {
                state.loading = true
                await loadBaseData
                const res = await tokenRequest.fetchAsync()
                setUserInfo(res.data)
            } finally {
                state.loading = false
            }
        } else {
            const encryptedData = localData.getValue('autoLoginEncrypted')

            if (state.rememberMe && encryptedData) {
                const decryptedString = decryptAES(encryptedData)
                const params = JSON.parse(decryptedString)
                await userLogin(params)
            } else {
                throw new Error('自动登录失败')
            }
        }
    }

    // 监听状态变化
    watch(() => state.rememberMe, (newVal) => {
        localData.setValue('rememberMe', newVal)
    })

    eventBus.on('logout', () => {
        sessionData.reset('token')
        localData.reset('token')
        localData.reset('autoLoginEncrypted')
        state.userInfo = initUserInfo()
    })

    return {
        token,
        getUserInfo,
        userLogin,
        autoLogin
    }
})