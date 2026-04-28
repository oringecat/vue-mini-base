<template>
    <el-form :model="formData">
        <el-form-item>
            <el-tree-select v-model="formData.saleId" :data="trees" :empty-values="[0]" :value-on-clear="0"
                default-expand-all />
        </el-form-item>
        <el-form-item>
            <el-input v-model="formData.specName" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import type { PropType } from 'vue'
import type { Category, SaleAttribute, SaleSpec } from '@/types/product'

const props = defineProps({
    categorys: {
        type: Array as PropType<Category[]>,
        required: true
    },
    sales: {
        type: Array as PropType<SaleAttribute[]>,
        required: true
    }
})

const emit = defineEmits(['submit'])

const formData = reactive<SaleSpec>({
    id: 0,
    saleId: 0,
    specName: '',
})

const trees = computed(() => props.categorys.map((category, index) => ({
    label: category.categoryName,
    value: `${index}_${category.id}`,
    children: props.sales.filter((item) => item.categoryId === category.id).map((item) => ({
        label: item.saleName,
        value: item.id,
    }))
})))

const onSubmit = () => {
    if (formData.saleId && formData.specName) {
        formData.id++
        emit('submit', { ...formData })
        formData.specName = ''
    }
}
</script>