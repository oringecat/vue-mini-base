import type { App } from 'vue'
import AppView from './view/index.vue'
import AppScrollView from './scroll-view/index.vue'
import AppBlockGroup from './block-group/index.vue'
import AppBlock from './block/index.vue'
import AppStatusbar from './statusbar/index.vue'
import AppNavbar from './navbar/index.vue'
import AppNavback from './navback/index.vue'

declare module 'vue' {
    interface GlobalComponents {
        AppView: typeof AppView;
        AppScrollView: typeof AppScrollView;
        AppBlockGroup: typeof AppBlockGroup;
        AppBlock: typeof AppBlock;
        AppStatusbar: typeof AppStatusbar;
        AppNavbar: typeof AppNavbar;
        AppNavback: typeof AppNavbar;
    }
}

const components = {
    AppView,
    AppScrollView,
    AppBlockGroup,
    AppBlock,
    AppStatusbar,
    AppNavbar,
    AppNavback
}

const install = (app: App) => {
    for (const [key, value] of Object.entries(components)) {
        app.component(key, value) //注册全局组件
    }
}

export default {
    install,
}