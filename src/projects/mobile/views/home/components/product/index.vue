<template>
    <app-list class="product-list" v-model:loading="loading" :finished="refreshing || !hasMore" :error="failed"
        @load="onLoad">
        <div v-for="(item, index) in dataList" :key="index">
            {{ item.productName }}
        </div>
    </app-list>
</template>

<script lang="ts" setup>
import { useDataTable } from '@/hooks/datatable'
import { useRefresh } from '@/composables/refresh'
import { getProductList } from '@/services/api/product'
import AppList from '@mobile/components/base/list/index.vue'

const props = defineProps({
    refreshId: {
        type: Number,
        default: 0
    }
})

const { dataList, hasMore, failed, updateItems, resetPage, nextPage } = useDataTable<Product.ProductItem>()

const { loading, fetch } = getProductList({
    manual: true,
    success: (res) => {
        updateItems(res.data, res.total)
    },
    fail: () => {
        failed.value = true
    },
    complete: () => {
        refreshFinish()
    }
})

const onLoad = () => {
    const pageIndex = nextPage()
    fetch({ pageIndex })
}

const { refreshing, refreshFinish } = useRefresh(() => {
    resetPage()
    onLoad()
}, props.refreshId)
</script>