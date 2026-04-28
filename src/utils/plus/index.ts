import { UIStyle, Permissions } from './enums'
import type { SystemInfo, Exception, CreateBarcodeOptions, AndroidSuccessCallback, HttpRequestConfig } from './types'

declare global {
    interface Window {
        plus: any;
    }
}

export default new (class {
    private plus = window.plus

    private systemInfo: SystemInfo = {
        os: 'Web',
        version: '1.0.0',
        versionCode: '100000',
        statusBarHeight: 0,
        packageName: ''
    }

    private logWarning(message = '当前 API 需要在 HTML5+ 环境中运行') {
        console.warn(message)
    }

    constructor() {
        document.addEventListener('plusready', () => {
            this.plus = window.plus
            this.systemInfo.os = this.plus.os.name
            this.systemInfo.statusBarHeight = this.plus.navigator.getStatusbarHeight()

            switch (this.systemInfo.os) {
                case 'Android': {
                    const main = this.plus.android.runtimeMainActivity()
                    this.systemInfo.packageName = main.getPackageName()
                    break
                }
                case 'iOS': {
                    const bundle = this.plus.ios.import('NSBundle')
                    const main = bundle.mainBundle()
                    this.systemInfo.packageName = main.bundleIdentifier()
                    break
                }
            }

            this.plus.runtime.getProperty(this.plus.runtime.appid, (info: any) => {
                this.systemInfo.version = info.version
                this.systemInfo.versionCode = info.versionCode
            })
        })
    }

    get hasPlus() {
        return !!window.plus
    }

    /**
     * 安卓主版本号
     */
    get androidMajorVersion() {
        const [majorVersion] = this.plus.os.version.split('.')
        return +majorVersion
    }

    // 相册权限
    // https://developer.android.google.cn/about/versions/14/changes/partial-photo-video-access?hl=zh-cn
    get galleryPermission() {
        switch (true) {
            case (this.androidMajorVersion <= 12):
                return [Permissions.READ_EXTERNAL_STORAGE]
            case (this.androidMajorVersion === 13):
                return [Permissions.READ_MEDIA_IMAGES, Permissions.READ_MEDIA_VIDEO]
            default:
                return [Permissions.READ_MEDIA_VISUAL_USER_SELECTED]
        }
    }

    /**
     * 获取系统信息
     * @param prop 
     * @returns 
     */
    getSystemInfo<K extends keyof SystemInfo>(prop: K) {
        return this.systemInfo[prop]
    }

    /**
     * 获取系统主题
     * @returns 
     */
    getUIStyle(): UIStyle {
        if (this.hasPlus) {
            return this.plus.navigator.getUIStyle()
        } else {
            const isLight = window.matchMedia('(prefers-color-scheme: light)').matches
            return isLight ? UIStyle.Light : UIStyle.Dark
        }
    }

    /**
     * https://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.openURL
     * @param url 
     */
    openURL(url: string, errorCB?: (error: Exception) => void) {
        if (this.hasPlus) {
            this.plus.runtime.openURL(url, errorCB)
        } else {
            window.open(url, '_blank')
        }
    }

    /**
     * 打开安卓设置
     */
    openAndroidSettings() {
        if (this.hasPlus) {
            const { runtimeMainActivity, importClass } = this.plus.android

            const main = runtimeMainActivity()
            const Intent = importClass('android.content.Intent')
            const Settings = importClass('android.provider.Settings')
            const Uri = importClass('android.net.Uri')

            const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
            const uri = Uri.fromParts('package', main.getPackageName(), null)
            intent.setData(uri)
            main.startActivity(intent)
        } else {
            this.logWarning()
        }
    }

    /**
     * 请求安卓系统权限
     */
    requestAndroidPermission(permissions: string[]) {
        return new Promise<string[]>((resolve, reject) => {
            this.plus.android.requestPermissions(permissions, (e: AndroidSuccessCallback) => {
                if (e.deniedAlways.length > 0) {
                    reject(e.deniedAlways)
                }
                if (e.deniedPresent.length > 0) {
                    reject(e.deniedPresent)
                }
                if (e.granted.length > 0) {
                    resolve(e.granted)
                }
            }, (e: Exception) => {
                reject(e.message)
            })
        })
    }

    /**
     * 检查相册权限
     * https://www.html5plus.org/doc/zh_cn/navigator.html#plus.navigator.checkPermission
     * @returns 
     */
    checkGalleryPermission() {
        if (this.systemInfo.os === 'Android') {

            // 待实现 onRequestPermissionsResult
            // this.galleryPermission.map((permission) => {
            //     const ContextCompat = this.plus.android.importClass('androidx.core.content.ContextCompat')
            //     const mainActivity = this.plus.android.runtimeMainActivity()
            //     const context = mainActivity.getApplicationContext()

            //     const permissionStatus = ContextCompat.checkSelfPermission(context, permission)
            //     const permissionRationale = ContextCompat.shouldShowRequestPermissionRationale(permission)

            //     console.log('checkSelfPermission', permissionStatus, permissionRationale)
            // })

            return this.galleryPermission.map((permission) => ({
                permission,
                status: this.plus.navigator.checkPermission(permission)
            }))
        }
        return []
    }

    /**
     * 创建扫描对象
     * @param options 
     * @returns 
     */
    createBarcode(options: CreateBarcodeOptions) {
        const id = options.barcodeId ?? 'barcode_' + Date.now()

        const start = () => {
            if (this.hasPlus) {
                const barcode = this.plus.barcode.create(id, [this.plus.barcode.QR], {
                    position: 'static',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%'
                })

                barcode.onmarked = (type: number, code: string) => {
                    barcode.close()
                    options.onSuccess(code)
                }

                barcode.onerror = (err: Exception) => {
                    barcode.close()
                    options.onError?.(err)
                }

                this.plus.webview.currentWebview().append(barcode)

                barcode.start()
            } else {
                this.logWarning()
            }
        }

        const close = () => {
            if (this.hasPlus) {
                const barcode = this.plus.barcode.getBarcodeById(id)
                if (barcode) {
                    barcode.close()
                    return true
                }
                return false
            }
            return false
        }

        return {
            start,
            close
        }
    }

    /**
     * http 跨域请求(待完善)
     * @param config 
     * @returns 
     */
    httpRequest(config: HttpRequestConfig) {
        const xhr = this.hasPlus ? new window.plus.net.XMLHttpRequest() : new XMLHttpRequest()
        return new Promise<any>((resolve, reject) => {
            xhr.responseType = config.responseType ?? 'json'
            if (config.header) {
                for (const key in config.header) {
                    xhr.setRequestHeader(key, config.header[key])
                }
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status == 200) {
                        resolve({
                            code: 200,
                            data: xhr.response
                        })
                    } else {
                        reject({
                            code: xhr.status,
                            message: xhr.statusText
                        })
                    }
                }
            }
            xhr.open(config.method ?? 'GET', config.url)
            xhr.send()
        })
    }

    /**
     * 读取本地文件内容
     * https://www.html5plus.org/doc/zh_cn/io.html#plus.io.resolveLocalFileSystemURL
     * @param filePath 
     * @returns 
     */
    getLocalFileContent<T>(filePath: string) {
        return new Promise<T>((resolve, reject) => {
            if (this.hasPlus) {
                this.plus.io.resolveLocalFileSystemURL('_www/' + filePath, (entry: any) => {
                    entry.file((file: any) => {
                        const fileReader = new this.plus.io.FileReader()
                        fileReader.readAsText(file, 'utf-8')
                        fileReader.onloadend = (evt: any) => {
                            const data = evt.target.result
                            try {
                                // 尝试解析内容
                                resolve(JSON.parse(data))
                            } catch (e) {
                                resolve(data)
                            }
                        }
                    })
                }, (e: any) => {
                    reject(e.message)
                })
            } else {
                this.httpRequest({
                    url: filePath
                }).then((res) => {
                    resolve(res.data)
                }).catch((res) => {
                    reject(res.message)
                })
            }
        })
    }
})