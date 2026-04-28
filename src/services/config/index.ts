import dayjs from 'dayjs'
import plus from '@/utils/plus'
import { TaskQueue } from '@/utils/queue'
import type { AppConfig, ServiceConfig } from './types'
import { getServerTime } from '../api/common'

export default new (class {
    constructor() {
        // 自动初始化，若断网或其它原因导致初始化失败，需重新初始化
        // IOS上架审核可能会遇到网络权限的情况，应用可能会在未授权网络权限的情况下发起请求，导致请求等待时间过长，最终审核被拒
        //this.init()

        this.onReady(() => {
            // 同步服务器时间
            getServerTime({
                success: (res) => {
                    const serverTime = dayjs(res.data)
                    this.serverDiffTime = dayjs().diff(serverTime)
                }
            })
        })
    }

    isReady = false

    appConfigAsync = this.loadAppConfig()

    private taskQueue = new TaskQueue()

    /** 服务器和本地的时间差(毫秒数) */
    private serverDiffTime = 0

    /** 限制重试次数，0 = 无限制 */
    private maxRetryCount = 5

    private initPromise: Promise<void> | null = null

    private appConfig: AppConfig = {
        AppId: 'com.app.release',
        AppName: 'Vue Project',
        version: '1.0.0',
        versionCode: '100000',
        baseUrl: 'http://localhost',
        tokenStorage: 'session',
    }

    private serviceConfig: ServiceConfig = {
        apiUrl: '',
        fileUrl: ''
    }

    /** 加载本地配置 */
    private async loadAppConfig() {
        const data = await plus.getLocalFileContent<AppConfig>('/appconfig.json')
        Object.assign(this.appConfig, data)
        return data
    }

    /** 加载服务配置 */
    private loadServiceConfig = (url: string, retryCount = 0) => {
        return new Promise<void>((resolve, reject) => {
            if (this.maxRetryCount === 0 || retryCount <= this.maxRetryCount) {
                plus.httpRequest({ url }).then((res) => {
                    this.serviceConfig = res.data.data
                    this.isReady = true
                    this.taskQueue.run()
                    resolve()
                }).catch(() => {
                    setTimeout(() => {
                        retryCount++
                        this.loadServiceConfig(url, retryCount).then(resolve).catch(reject)
                    }, 3000)
                })
            } else {
                this.initPromise = null
                reject('服务加载失败，请稍后再试')
            }
        })
    }

    async init() {
        if (!this.initPromise) {
            try {
                await this.appConfigAsync
            } catch {
                this.appConfigAsync = this.loadAppConfig()
            }
            this.initPromise = new Promise<void>((resolve, reject) => {
                this.appConfigAsync.then((data) => {
                    this.loadServiceConfig(data.baseUrl).then(resolve).catch(reject)
                }).catch(() => {
                    this.initPromise = null
                    reject('配置文件加载失败，请稍后再试')
                })
            })
        }
        // 确保当前只有一个初始化实例
        return this.initPromise
    }

    get timestamp() {
        return Date.now() - this.serverDiffTime
    }

    getAppConfig<K extends keyof AppConfig>(key: K) {
        return this.appConfig[key]
    }

    getServiceConfig<K extends keyof ServiceConfig>(key: K) {
        return this.serviceConfig[key]
    }

    onReady(callback: () => void) {
        const cancel = this.taskQueue.add(callback)
        if (this.isReady) {
            setTimeout(() => this.taskQueue.run(), 0)
        }
        return cancel
    }
})