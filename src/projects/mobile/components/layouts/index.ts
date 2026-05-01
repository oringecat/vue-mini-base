import type { App } from 'vue'
import AppView from './view/index.vue'
import AppPageView from './page-view/index.vue'
import AppScrollView from './scroll-view/index.vue'
import AppBlockGroup from './block-group/index.vue'
import AppBlock from './block/index.vue'
import AppStatusBar from './status-bar/index.vue'
import AppNavBar from './nav-bar/index.vue'
import AppNavBack from './nav-back/index.vue'

declare module 'vue' {
    interface GlobalComponents {
        AppView: typeof AppView;
        AppPageView: typeof AppPageView;
        AppScrollView: typeof AppScrollView;
        AppBlockGroup: typeof AppBlockGroup;
        AppBlock: typeof AppBlock;
        AppStatusBar: typeof AppStatusBar;
        AppNavBar: typeof AppNavBar;
        AppNavBack: typeof AppNavBack;
    }
}

const components = {
    AppView,
    AppPageView,
    AppScrollView,
    AppBlockGroup,
    AppBlock,
    AppStatusBar,
    AppNavBar,
    AppNavBack
}

const install = (app: App) => {
    for (const [key, value] of Object.entries(components)) {
        app.component(key, value) //注册全局组件
    }
}

export default {
    install,
}