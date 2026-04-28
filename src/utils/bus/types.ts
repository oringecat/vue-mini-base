export type EventBus = {
    'pull-refresh-start': number; // 下拉刷新，结束需配合 pull-refresh-finish 事件
    'pull-refresh-finish': symbol;
    'logout': void;
    'login': User.UserInfo;
}