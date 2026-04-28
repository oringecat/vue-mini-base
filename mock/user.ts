// 200ms - 1000ms 随机延迟响应
const delay = () => Math.random() * 800 + 200

export default [
    {
        url: '/api/user/login',
        method: 'post',
        timeout: delay(),
        response: () => ({
            code: 200,
            data: {
                id: 1000,
                userName: 'admin',
                realName: '@cname', // 随机中文名
                avatar: 'https://picsum.photos/200/200', // 随机头像
                token: '@string(60)' // 随机60位token
            }
        })
    },
    {
        url: '/api/user/checktoken',
        method: 'get',
        timeout: delay(),
        response: () => ({
            code: 200,
            data: {
                id: 1000,
                userName: 'admin',
                realName: '@cname',
                avatar: 'https://picsum.photos/200/200',
                token: '@string(60)'
            }
        })
    },
    {
        url: '/api/user/auths',
        method: 'get',
        timeout: delay(),
        response: () => ({
            code: 200,
            data: ['product', 'order', 'product-list', 'order-list-aftersale', 'order-list']
        })
    },
]