import type { AxiosRequestConfig } from 'axios'

export type Method = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

export interface RequestConfig {
    url: string;
    method?: Method;
    headers?: AxiosRequestConfig['headers'];
    data?: object; // 请求参数
}

export interface RequestOptions<T extends { req?: object, res?: unknown } = Record<string, unknown>> {
    immediate?: boolean; // 是否立即执行
    data?: T extends { req: infer R } ? R : unknown; // 请求参数
    retryCount?: number; // 重试次数，0 = 无限次
    onSuccess?: (res: T['res']) => void;
    onError?: (err: string) => void;
    onFinally?: () => void;
}

/**
 * 统一响应结构
 */
export interface BaseResponse<T = unknown> {
    code: ResultCode;
    data: T;
    message: string;
    total: number;
}

// 错误响应结构
export interface ErrorResponse {
    code: ResultCode;
    message: string;
}

/**
 * 响应状态码枚举
 */
export enum ResultCode {
    Success = 200, //成功
    Error = 400, //失败
    Unauthorized = 401, //令牌无效
}