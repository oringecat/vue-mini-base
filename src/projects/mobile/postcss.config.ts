export default {
    plugins: {
        'postcss-px-to-viewport-8-plugin': {
            viewportWidth: 375,
            landscape: true, // 是否处理横屏情况
            landscapeUnit: 'vw', // 横屏时使用的单位
            landscapeWidth: 844, // 横屏时使用的视口宽度
        },
    },
}