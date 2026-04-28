import type { App } from 'vue'
import PcView from './view/index.vue'

declare module 'vue' {
    interface GlobalComponents {
        PcView: typeof PcView;
    }
}

const components = {
    PcView,
}

const install = (app: App) => {
    for (const [key, value] of Object.entries(components)) {
        app.component(key, value) //注册全局组件
    }
}

export default {
    install,
}