import { shallowRef } from 'vue'
import axios, { type AxiosRequestConfig } from 'axios'
import type { RequestOptions, BaseResponse, Method } from './types'
import { ResultCode } from './types'
import { useTransitionStore } from '@/stores/transition'
import { useUserStore } from '@/stores/user'
//import serviceConfig from '@/services/config'

export default new (class {
    constructor() {
        // serviceConfig.onReady(() => {
        //     const baseUrl = serviceConfig.getServiceConfig('apiUrl')
        //     this.axiosInstance.defaults.baseURL = baseUrl
        // })
    }

    private readonly axiosInstance = axios.create({
        timeout: 30000,
    })

    private createHeader() {
        const userStore = useUserStore()
        const timestamp = Date.now()

        return {
            timestamp,
            authorization: userStore.token
        }
    }

    private isBaseResponse(obj: unknown): obj is BaseResponse {
        if (obj instanceof Object) {
            return 'code' in obj && 'data' in obj
        }
        return false
    }

    request<T>(config: AxiosRequestConfig) {
        const transitionStore = useTransitionStore()

        return new Promise<T>((resolve, reject) => {
            this.axiosInstance.request<T>(config).then((res) => {
                // 延迟返回结果，防止动画过程中实时渲染，导致动画卡顿
                transitionStore.addTask(() => resolve(res.data))
            }).catch((err) => {
                if (axios.isCancel(err)) {
                    console.warn('请求中断')
                }
                reject(err)
            })
        })
    }

    createRequest<Req extends object, Res>(method: Method, url: string, options: RequestOptions<{ req: Req, res: Res }> = {}) {
        const loading = shallowRef(false)
        const config: AxiosRequestConfig = { method, url }

        let controller: AbortController | null = null

        // 原始请求方法
        const rawFetch = (data: Partial<Req> = {}) => new Promise<Res>((resolve, reject) => {
            abort()
            loading.value = true

            const mergedData = { ...options.data, ...data }

            if (method.toLowerCase() === 'get') {
                config.params = mergedData
            } else {
                config.data = mergedData
            }

            controller = new AbortController()
            config.signal = controller.signal
            config.headers = this.createHeader()

            this.request<Res>(config).then((res) => {
                if (this.isBaseResponse(res)) {
                    switch (res.code) {
                        case ResultCode.Unauthorized:
                            //退出登录
                            //logout();
                            reject('令牌无效')
                            break
                        case ResultCode.Success:
                            resolve(res)
                            break
                        default:
                            reject(res.message ?? '请求失败，请稍后再试')
                    }
                } else {
                    resolve(res)
                }
            }).catch((err) => {
                reject(err)
            }).finally(() => {
                loading.value = false
            })
        })

        // 请求并自动处理回调
        const fetch = async (data: Partial<Req> = {}) => {
            try {
                const res = await rawFetch(data)
                options.onSuccess?.(res)
            } catch (err) {
                options.onError?.(String(err))
            } finally {
                options.onFinally?.()
            }
        }

        // 取消当前请求
        const abort = () => {
            controller?.abort()
        }

        // 默认立即请求
        if (options.immediate ?? true) {
            fetch()
        }

        return {
            loading,
            rawFetch,
            fetch,
            abort
        }
    }
})