import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function publicBasePath(value: string | undefined) {
  const base = value?.trim() || '/'
  if (!base.startsWith('/') || !base.endsWith('/') || base.includes('?') || base.includes('#') || base.includes('..')) {
    throw new Error('PUBLIC_BASE_PATH 必须是以 / 开始和结束、且不含查询参数、片段或 .. 的路径。')
  }
  return base
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: publicBasePath(env.PUBLIC_BASE_PATH),
    plugins: [react()],
  }
})
