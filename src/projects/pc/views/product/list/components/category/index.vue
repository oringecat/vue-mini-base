<template>
    <el-form :model="formData">
        <el-form-item>
            <el-input v-model="formData.categoryName" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { Category } from '@/types/product'

const emit = defineEmits(['submit'])

const formData = reactive<Category>({
    id: 0,
    parentId: 0,
    categoryName: ''
})

const onSubmit = () => {
    if (formData.categoryName) {
        formData.id++
        emit('submit', { ...formData })
        formData.categoryName = ''
    }
}
</script>