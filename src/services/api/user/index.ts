import http from '@/services/http'
import type { RequestOptions, BaseResponse } from '@/services/http/types'

/**
 * 用户登录
 */
export function login(options?: RequestOptions<{ req: User.LoginParams; res: BaseResponse<User.UserInfo>; }>) {
  return http.createRequest('POST', '/api/user/login', options)
}

/**
 * 用户登出
 */
export function logout() {
  return http.createRequest('GET', '/api/user/logout')
}

/**
 * 令牌校验
 */
export function checkToken(options?: RequestOptions<{ res: BaseResponse<User.UserInfo>; }>) {
  return http.createRequest('GET', '/api/user/checktoken', options)
}

/**
 * 获取用户权限
 */
export function getUserAuths(options?: RequestOptions<{ res: BaseResponse<string[]>; }>) {
  return http.createRequest('GET', '/api/user/auths', options)
}