import { spawn } from 'child_process'
import { readFile } from 'fs/promises'

const argv = process.argv
const url = new URL('./oem.json', import.meta.url)

readFile(url, 'utf-8').then((content) => {
  const oemConfigs = JSON.parse(content)
  const oem = oemConfigs.find((e) => argv.includes(e.VUE_APP_PLATFORM))

  if (oem) {
    spawn('npx', ['vite'], {
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
