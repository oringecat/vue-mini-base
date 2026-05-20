<template>
    <app-popup :show="show && visible" @closed="emit('closed', isRefresh)">
        <app-page-view>
            <template #header>
                <app-nav-bar title="售后" />
            </template>
            <van-button type="success" @click="onSubmit">提交</van-button>
        </app-page-view>
    </app-popup>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import AppPopup from '@mobile/components/base/popup/index.vue'

defineProps<{
    show: boolean;
}>()

const emit = defineEmits(['closed'])

const visible = shallowRef(true)
const isRefresh = shallowRef(false)

const onSubmit = () => {
    isRefresh.value = true
    visible.value = false
}
</script>