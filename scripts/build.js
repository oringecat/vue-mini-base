import { spawn } from 'child_process'
import { readFile } from 'fs/promises'

const argv = process.argv
const url = new URL('./oem.json', import.meta.url)

readFile(url, 'utf-8').then((content) => {
  const oemConfigs = JSON.parse(content)
  const oem = oemConfigs.find((e) => argv.includes(e.VUE_APP_PLATFORM))

  if (oem) {
    const args = [
      'run-p', // 并行执行命令
      'type-check', // 第一个命令：类型检查
      'build-only', // 第二个命令：仅构建
      '--', // 分隔符，后面的是传给 build-only 的参数（如果需要）
      ...argv, // 传递自定义参数（如 pc，若 build-only 不需要可省略）
    ]

    spawn('npx', args, {
      env: {
        ...process.env,
        ...oem,
      },
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
  } else {
    console.error('环境变量不存在')
  }
})
