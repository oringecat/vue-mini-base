import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse } from './mock-utils'

export default [
    {
        url: '/api/server/config',
        method: 'get',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: {
                apiUrl: 'http://127.0.0.1/api',
                fileUrl: 'http://127.0.0.1/file'
            },
            total: 0
        })
    },
    {
        url: '/api/server/time',
        method: 'get',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: Date.now(),
            total: 0
        })
    }
] as MockMethod[]