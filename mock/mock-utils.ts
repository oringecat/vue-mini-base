import type { ServerResponse, IncomingMessage } from 'http'
import type { BaseResponse } from '@/services/http/types'
import Mock from 'mockjs'

// 生成指定范围的随机整数
export function randomInt(min = 1, max = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// 模拟数据响应
export function mockResponse<T>(response: ServerResponse<IncomingMessage>, data: BaseResponse<T>, delay = 0) {
    const mockedData = Mock.mock(data)
    const mockDelay = delay || randomInt(50, 300)

    setTimeout(() => {
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(mockedData))
    }, mockDelay)
}