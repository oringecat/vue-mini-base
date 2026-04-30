import type { MockMethod } from 'vite-plugin-mock'
import { randomInt, mockResponse } from './mock-utils'

export default [
    {
        url: '/api/product/list',
        method: 'get',
        rawResponse: (req, res) => {
            const count = randomInt(5, 10)
            
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: Array.from({ length: count }, () => ({
                    productName: '@ctitle(5,10)', // 随机中文标题（5-10字）
                })),
                total: count
            })
        }
    }
] as MockMethod[]