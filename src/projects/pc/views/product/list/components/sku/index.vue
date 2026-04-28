<template>
    <el-form>
        <el-form-item>
            <el-select v-model="categoryId" :empty-values="[0]" :value-on-clear="0" clearable>
                <template v-for="item in categorys" :key="item.id">
                    <el-option :label="item.categoryName" :value="item.id" />
                </template>
            </el-select>
        </el-form-item>
        <table cellspacing="0" cellpadding="0" v-if="saleAttributes.length">
            <thead>
                <tr>
                    <th>属性</th>
                    <th>规格</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in saleAttributes" :key="index">
                    <td>{{ item.sale.saleName }}</td>
                    <td>
                        <el-checkbox-group v-model="item.checked" @change="(value) => onChecked(item.sale.id, value)">
                            <template v-for="spec in item.specs" :key="spec.id">
                                <el-checkbox :label="spec.specName" :value="spec.id" />
                            </template>
                        </el-checkbox-group>
                        <table cellspacing="0" cellpadding="0" v-if="item.options.length">
                            <thead>
                                <tr>
                                    <th>已选</th>
                                    <th v-if="item.sale.isCustom">自定义</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(option, index) in item.options" :key="index">
                                    <td>{{ option.specName }}</td>
                                    <td v-if="item.sale.isCustom">
                                        <el-input v-model="option.customName" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table cellspacing="0" cellpadding="0" v-if="selected.length">
            <thead>
                <tr>
                    <td v-for="({ sale }, index) in selected" :key="index">{{ sale.saleName }}</td>
                    <td>价格</td>
                    <td>数量</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="({ attrs, sku }, index) in skus" :key="index">
                    <td v-for="{ spec } in attrs" :key="spec.id">
                        {{ spec.customName || spec.specName }}
                    </td>
                    <td>
                        <el-input-number v-model="sku.price" />
                    </td>
                    <td>
                        <el-input-number v-model="sku.stock" />
                    </td>
                </tr>
            </tbody>
        </table>
    </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import type { PropType } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import type { Category, SaleAttribute, SaleSpec, ProductSku } from '@/types/product'

const props = defineProps({
    categorys: {
        type: Array as PropType<Category[]>,
        required: true
    },
    sales: {
        type: Array as PropType<SaleAttribute[]>,
        required: true
    },
    specs: {
        type: Array as PropType<SaleSpec[]>,
        required: true
    }
})

const emit = defineEmits(['submit'])

const categoryId = ref(0)

const saleAttributes = ref<{ sale: SaleAttribute; specs: SaleSpec[]; checked: number[]; options: (SaleSpec & { customName: string; })[] }[]>([])

const skus = ref<{
    attrs: { sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[];
    sku: { price: number; stock: number };
}[]>([])

const selected = computed(() => saleAttributes.value.filter(({ checked }) => checked.length))

const onChecked = (saleId: number, checkedValue: CheckboxValueType[]) => {
    const target = saleAttributes.value.find(({ sale }) => sale.id === saleId)

    if (target) {
        const filtered = target.specs.filter((spec) => checkedValue.includes(spec.id))

        target.options = filtered.map((item) => ({
            ...item,
            customName: ''
        }))
    }

    const options = selected.value.reduce<{ sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[][]>((res, { sale, options }) => {
        return [...res, options.map((spec) => ({ sale, spec }))]
    }, [])

    skus.value = cartesianProduct(options)
}

// 计算笛卡尔积
const cartesianProduct = (options: { sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[][]) => {
    return options.reduce<{
        attrs: { sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[];
        sku: { price: number; stock: number };
    }[]>((res, current) => res.flatMap((prev) => current.map((item) => ({
        attrs: [...prev.attrs, item],
        sku: { price: 0, stock: 0 }
    }))), [{ attrs: [], sku: { price: 0, stock: 0 } }])
}

watch(categoryId, (id) => {
    const filtered = props.sales.filter((item) => item.categoryId === id)

    saleAttributes.value = filtered.map((sale) => ({
        sale,
        specs: props.specs.filter((spec) => spec.saleId === sale.id),
        checked: [],
        options: []
    }))
})
</script>

<style lang="less" scoped>
table,
th,
td {
    border: 1px solid #f2f2f2;
}

table {
    border-collapse: collapse;
}
</style>