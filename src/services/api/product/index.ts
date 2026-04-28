import http from '@/services/http'
import type { RequestOptions, BaseResponse } from '@/services/http/types'

/**
 * 获取商品列表
 */
export function getProductList(options?: RequestOptions<{ req: Product.ProductParams; res: BaseResponse<Product.ProductItem[]>; }>) {
  return http.createRequest('GET', '/api/product/list', options)
}