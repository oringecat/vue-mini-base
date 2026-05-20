export interface ComponentManagerOptions {
    destroyOnClose: boolean; // 是否在关闭时销毁内容
    confirmMessage: string | ((componentName: string) => string); // 离开页面时的提示
}