export interface HistoryRoute {
    name: string;
    title: string;
    fullPath: string;
    redirected: boolean;
}

export interface HistoryState {
    historys: HistoryRoute[]; // 路由历史栈
    excludes: string[]; // 不缓存的视图
    actionName: '' | 'push' | 'push-replace' | 'replace' | 'forward' | 'back'; // 当前路由动作
}