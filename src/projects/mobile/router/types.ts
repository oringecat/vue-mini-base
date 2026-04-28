export interface HistoryRoute {
    name: string;
    fullPath: string;
}

export interface HistoryState {
    historys: HistoryRoute[]; // 路由历史栈
    excludes: string[]; // 不缓存的视图
    actionName: '' | 'push' | 'push-replace' | 'replace' | 'forward' | 'back'; // 当前路由动作
    transitionName: '' | 'route-out' | 'route-in' | 'fade'; // 过渡动画
    goStep: number; // 前进后退步数
}