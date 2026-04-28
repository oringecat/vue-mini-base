// 200ms - 1000ms 随机延迟响应
const delay = () => Math.random() * 800 + 200

export default [
    {
        url: '/api/server/config',
        method: 'get',
        timeout: delay(),
        response: () => ({
            code: 200,
            data: {
                apiUrl: 'http://localhost/api',
                fileUrl: 'http://localhost/file'
            }
        })
    },
    {
        url: '/api/server/time',
        method: 'get',
        timeout: delay(),
        response: () => ({
            code: 200,
            data: Date.now()
        })
    }
]