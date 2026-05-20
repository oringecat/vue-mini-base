<template>
    <van-popup class="app-popup" v-model:show="visible" v-bind="popupOptions" @closed="onClosed">
        <render-mode-provider mode="popup">
            <slot></slot>
        </render-mode-provider>
    </van-popup>
</template>

<script lang="ts" setup>
import { shallowRef, onMounted, watch } from 'vue'
import type { PopupProps } from 'vant'
import RenderModeProvider from '@/components/render-mode-provider/index.vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:show', 'closed'])

const visible = shallowRef(false)

const popupOptions: Partial<PopupProps> = {
    teleport: 'body',
    position: 'right',
    overlayClass: 'app-popup__overlay',
    transition: 'app-popup--transition'
}

const updateShow = () => {
    visible.value = props.show
}

const onClosed = () => {
    emit('closed')
}

watch(() => props.show, updateShow)

watch(visible, (val) => emit('update:show', val))

onMounted(updateShow)
</script>

<style lang="less">
@import './index.less';
</style>