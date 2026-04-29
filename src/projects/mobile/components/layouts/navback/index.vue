<template>
    <div class="app-navback" @click="goback">
        <slot>
            <Icon name="arrow-left" />
        </slot>
    </div>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from 'vant'

const emit = defineEmits<{ (event: string, ...args: unknown[]): void }>()
const router = useRouter()
const attrs = useAttrs()

// 返回按钮事件
const goback = () => {
    if (attrs.onBack) {
        emit('back')
    } else {
        router.go(-1)
    }
}
</script>

<style lang="less">
@import './index.less';
</style>