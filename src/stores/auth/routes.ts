import { AuthType } from './types'
import type { AuthRoute } from './types'
import Page from '@pc/components/layouts/page/index.vue'

export const authRoutes: AuthRoute[] = [
    {
        code: 'product',
        title: '商品管理',
        authType: AuthType.Route,
        url: '/product',
        component: Page,
        icon: 'default',
        children: [
            {
                code: 'product-list',
                title: '商品列表',
                authType: AuthType.Route,
                url: '/product/list',
                component: () => import('@pc/views/product/list/index.vue'),
                icon: 'default',
                children: [
                    {
                        code: 'product-list-modify',
                        title: '修改',
                        authType: AuthType.Button,
                        component: () => import('@pc/views/product/components/edit/index.vue'),
                        icon: 'edit'
                    },
                    {
                        code: 'product-list-delete',
                        title: '删除',
                        authType: AuthType.Button,
                        component: () => import('@pc/views/product/components/delete/index.vue'),
                        icon: 'delete'
                    }
                ]
            }
        ]
    },
    {
        code: 'order',
        title: '订单管理',
        authType: AuthType.Route,
        url: '/order',
        component: Page,
        icon: 'default',
        children: [
            {
                code: 'order-list',
                title: '订单列表',
                authType: AuthType.Route,
                url: '/order/list',
                component: () => import('@pc/views/order/list/index.vue'),
                icon: 'default',
                children: [
                    {
                        code: 'order-list-unshipped',
                        title: '未发货',
                        authType: AuthType.Component,
                        component: () => import('@pc/views/order/unshipped/index.vue'),
                        icon: 'unshipped'
                    },
                    {
                        code: 'order-list-shipped',
                        title: '已发货',
                        authType: AuthType.Component,
                        component: () => import('@pc/views/order/shipped/index.vue'),
                        icon: 'shipped'
                    },
                    {
                        code: 'order-list-aftersale',
                        title: '售后',
                        authType: AuthType.Component,
                        component: () => import('@pc/views/order/aftersale/index.vue'),
                        icon: 'aftersale'
                    }
                ]
            }
        ]
    },
    {
        code: 'user',
        title: '用户管理',
        authType: AuthType.Route,
        url: '/user',
        component: Page,
        icon: 'default',
        children: [
            {
                code: 'user-list',
                title: '用户列表',
                authType: AuthType.Route,
                url: '/user/list',
                component: () => import('@pc/views/user/list/index.vue'),
                icon: 'default',
                children: [
                    {
                        code: 'user-list-details',
                        title: '详情',
                        authType: AuthType.Button,
                        component: () => import('@pc/views/user/components/details/index.vue'),
                        icon: 'detail'
                    },
                    {
                        code: 'user-list-modify',
                        title: '修改',
                        authType: AuthType.Button,
                        component: () => import('@pc/views/user/components/edit/index.vue'),
                        icon: 'edit'
                    }
                ]
            }
        ]
    }
]