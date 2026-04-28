// 200ms - 1000ms 随机延迟响应
const delay = () => Math.random() * 800 + 200

export default [
    {
        url: '/api/product/list',
        method: 'get',
        timeout: delay(),
        response: () => ({
            code: 200,
            data: [{
                productName: '@ctitle(4,8)', // 随机中文标题（4-8字）
            }],
            total: 1
        })
    }
]