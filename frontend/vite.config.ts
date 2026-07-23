import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://hackathonimpactanalyser-backend-904105072538.asia-south1.run.app',
        changeOrigin: true,
      },
    },
  },
})

