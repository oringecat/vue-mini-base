import type { AxiosRequestConfig } from 'axios'

export type Method = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

export interface RequestConfig {
    url: string;
    method?: Method;
    headers?: AxiosRequestConfig['headers'];
    data?: object; // 请求参数
}

export interface RequestOptions<T extends { req?: object, res?: unknown } = {}> {
    manual?: boolean; // 是否手动触发
    data?: T extends { req: infer R } ? R : undefined; // 请求参数
    retryCount?: number; // 重试次数，0 = 无限次
    success?: (res: T['res']) => void;
    fail?: (err: string) => void;
    complete?: () => void;
}

/**
 * Http响应结果
 */
export interface BaseResponse<T = unknown> {
    code: ResultCode;
    data: T;
    message: string;
    total: number;
}

/**
 * Http响应结果状态码
 */
export enum ResultCode {
    Success = 200, //成功
    Error = 400, //失败
    Unauthorized = 401, //令牌无效
}