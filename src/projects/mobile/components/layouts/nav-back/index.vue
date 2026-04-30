<template>
    <div class="app-nav-back" @click="onBack">
        <slot>
            <Icon name="arrow-left" />
        </slot>
    </div>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from 'vant'

const emit = defineEmits()
const router = useRouter()
const attrs = useAttrs()

// 返回按钮事件
const onBack = () => {
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