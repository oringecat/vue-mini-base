import type { Component } from 'vue'

/**
 * 权限路由
 */
export interface AuthRoute {
    code: string;
    title: string;
    authType: AuthType;
    url?: string;
    component?: Component;
    icon?: string;
    remark?: string;
    children?: AuthRoute[];
}

/**
 * 权限类型
 */
export enum AuthType {
    Route = 1, // 路由
    Component = 2, // 组件
    Operation = 3, // 操作权限
    Link = 4, // 外链
    Iframe = 5, // 内联框架
}