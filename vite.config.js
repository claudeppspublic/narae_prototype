import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 'react-is': 'react' 제거 — recharts가 실제 react-is(isFragment 등)를 필요로 함(React 19)
    },
  },
  server: {
    port: 5173,
    open: true,
    // WSL2에서 /mnt/* (윈도우 드라이브)는 inotify 파일 감시가 동작하지 않음 → 폴링 필수
    watch: { usePolling: true },
  },
})
