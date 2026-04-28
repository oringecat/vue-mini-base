<template>
    <el-form :model="formData">
        <el-form-item>
            <el-select v-model="formData.categoryId" :empty-values="[0]" :value-on-clear="0">
                <template v-for="item in categorys" :key="item.id">
                    <el-option :label="item.categoryName" :value="item.id" />
                </template>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-input v-model="formData.saleName" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { PropType } from 'vue'
import type { Category, SaleAttribute } from '@/types/product'

defineProps({
    categorys: {
        type: Array as PropType<Category[]>,
        required: true
    }
})

const emit = defineEmits(['submit'])

const formData = reactive<SaleAttribute>({
    id: 0,
    categoryId: 0,
    saleName: '',
    isCustom: true
})

const onSubmit = () => {
    if (formData.categoryId && formData.saleName) {
        formData.id++
        emit('submit', { ...formData })
        formData.saleName = ''
    }
}
</script>