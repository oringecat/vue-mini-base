export interface LocalStorageKeys {
    language: string;
    token: string;
    autoLoginEncrypted: string; // 自动登录加密凭证
    rememberMe: boolean; // 是否记住登录
}

export interface SessionStorageKeys {
    token: string;
    statusEnums: []; // 枚举信息
    errorCodes: []; // 错误码信息
}