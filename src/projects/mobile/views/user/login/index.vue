<template>
    <app-view>
        <template #header>
            <div>登录</div>
        </template>
        <van-loading v-if="loading" />
        <app-block-group v-else>
            <app-block>{{ total }}</app-block>
        </app-block-group>
        <router-link to="/setting/language">
            <van-button>设置</van-button>
        </router-link>
    </app-view>
</template>

<script lang="ts" setup>
import { useDataTable } from '@/hooks/datatable'
import { getProductList } from '@/services/api/product'

const { total, updateItems } = useDataTable<Product.ProductItem>()

const { loading } = getProductList({
    success: (res) => {
        total.value = res.total
        updateItems(res.data)
    }
})
</script>