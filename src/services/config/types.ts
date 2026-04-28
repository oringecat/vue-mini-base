// 本地配置
export interface AppConfig {
    AppId: string;
    AppName: string;
    version: string; // 应用版本
    versionCode: string; // 应用版本号
    baseUrl: string; // 接口地址
    tokenStorage: 'session' | 'local';
}

// 服务配置
export interface ServiceConfig {
    apiUrl: string;
    fileUrl: string;
}