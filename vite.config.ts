import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { v4 } from 'uuid'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
//import vueDevTools from 'vite-plugin-vue-devtools'

import { VantResolver } from '@vant/auto-import-resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const uuid = v4()
const root = process.env.VUE_APP_ROOT // 启动和编译目录

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  publicDir: resolvePath('./public'),
  root,
  build: {
    outDir: resolvePath('./dist'), // 打包输出目录
  },
  define: {
    'import.meta.env.PROJECT_ID': JSON.stringify(uuid) // 项目唯一标识
  },
  plugins: [
    vue(),
    vueJsx(),
    //vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
    viteMockServe({
      mockPath: './mock', // Mock 文件目录
      enable: command === 'serve', // 仅开发环境启用
    }),
  ],
  resolve: {
    alias: {
      '@public': resolvePath('./public'),
      '@': resolvePath('./src'),
      '@pc': resolvePath('./src/projects/pc'),
      '@mobile': resolvePath('./src/projects/mobile'),
    },
  },
}))
