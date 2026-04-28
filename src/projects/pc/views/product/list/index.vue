<template>
    <div class="block">
        <div>
            <app-category @submit="(item) => categorys.push(item)" />
        </div>
        <div>
            <pre>{{ categorys }}</pre>
        </div>
    </div>
    <div class="block" v-if="categorys.length">
        <div>
            <app-sales v-bind="{ categorys }" @submit="(item) => sales.push(item)" />
        </div>
        <div>
            <pre>{{ sales }}</pre>
        </div>
    </div>
    <div class="block" v-if="sales.length">
        <div>
            <app-spec v-bind="{ categorys, sales }" @submit="(item) => specs.push(item)" />
        </div>
        <div>
            <pre>{{ specs }}</pre>
        </div>
    </div>
    <div class="block" v-if="specs.length">
        <div>
            <app-sku v-bind="{ categorys, sales, specs }" @submit="(item) => skus.push(item)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { ProductSku, Category, SaleAttribute, SaleSpec } from '@/types/product'
import AppCategory from './components/category/index.vue'
import AppSales from './components/sales/index.vue'
import AppSpec from './components/spec/index.vue'
import AppSku from './components/sku/index.vue'

const categorys = reactive<Category[]>([])
const sales = reactive<SaleAttribute[]>([])
const specs = reactive<SaleSpec[]>([])
const skus = reactive<ProductSku[]>([])
</script>

<style lang="less">
.block {
    display: flex;
    border-bottom: 1px solid #f2f2f2;

    .el-select {
        min-width: 160px;
    }
}
</style>