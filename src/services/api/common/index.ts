import http from '@/services/http'
import type { RequestOptions, BaseResponse } from '@/services/http/types'

/**
 * 获取服务器时间
 */
export function getServerTime(options?: RequestOptions<{ res: BaseResponse<number>; }>) {
    return http.createRequest('GET', '/api/server/time', options)
}