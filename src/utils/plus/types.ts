export interface SystemInfo {
    os: 'Web' | 'Android' | 'iOS'; // 客户端操作系统
    version: string; // 客户端版本号
    versionCode: string; // 客户端版本代码
    statusBarHeight: number; // 状态栏高度
    packageName: string; // 应用包名
}

export interface Exception {
    code: number;
    message: string;
}

export interface CreateBarcodeOptions {
    barcodeId?: string;
    onSuccess: (code: string) => void;
    onError?: (err: Exception) => void;
}

export interface AndroidSuccessCallback {
    granted: string[]; // 已获取权限列表
    deniedPresent: string[]; // 已拒绝（临时）的权限列表
    deniedAlways: string[]; // 永久拒绝的权限列表
}

/**
 * http 请求配置项
 */
export interface HttpRequestConfig {
    url: string | URL;
    method?: string;
    responseType?: XMLHttpRequestResponseType;
    header?: { [key: string]: string };
}