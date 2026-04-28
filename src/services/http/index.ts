import { shallowRef } from 'vue'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { RequestOptions, BaseResponse, Method } from './types'
import { ResultCode } from './types'
import { useTransitionStore } from '@/stores/transition'

export default new (class {
    private readonly axiosInstance = axios.create({
        timeout: 30000,
    })

    private createHeader() {
        const timestamp = Date.now()

        return {
            timestamp
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
        const controller = new AbortController()

        const config: AxiosRequestConfig = {
            method,
            url,
            signal: controller.signal
        }

        // 异步请求数据
        const fetchAsync = (data: Partial<Req> = {}) => new Promise<Res>((resolve, reject) => {
            loading.value = true

            const mergedData = { ...options.data, ...data }

            if (method.toLowerCase() === 'get') {
                config.params = mergedData
            } else {
                config.data = mergedData
            }

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

        // 获取并处理数据
        const fetch = (data: Partial<Req> = {}) => {
            fetchAsync(data).then((res) => {
                options.success?.(res)
            }).catch((err) => {
                options.fail?.(err)
            }).finally(() => {
                options.complete?.()
            })
        }

        // 取消请求
        const abort = () => {
            controller.abort()
        }

        // 自动请求
        if (!options.manual) {
            fetch()
        }

        return {
            loading,
            fetchAsync,
            fetch,
            abort
        }
    }
})