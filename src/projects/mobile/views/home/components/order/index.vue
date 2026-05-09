<template>
    <app-list class="order-list" v-model:loading="loading" :finished="!hasMore" @load="loadData">
        <div v-for="(item, index) in dataList" :key="index">
            {{ item.productName }}
        </div>
    </app-list>
</template>

<script lang="ts" setup>
import { useScrollTable } from '@/hooks/datatable'
import { useRefresh } from '@/composables/refresh'
import { getProductList } from '@/services/api/product'
import AppList from '@mobile/components/base/list/index.vue'

const props = defineProps({
    refreshId: Number
})

const { dataList, pageIndex, pageSize, hasMore, updateItems, nextPage } = useScrollTable<Product.ProductItem>()

const { loading, fetch } = getProductList({
    immediate: false,
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    success: (res) => {
        updateItems(res.data, res.total)
    },
    complete: () => {
        refreshFinish()
    }
})

const loadData = () => {
    if (nextPage(refreshing.value)) {
        fetch({
            pageIndex: pageIndex.value
        })
    }
}

const { refreshing, refreshFinish } = useRefresh(loadData, {
    refreshId: props.refreshId
})
</script>