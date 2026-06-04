import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://cash-hss6j5sa2-eduardo-sena-s-projects.vercel.app/',
        changeOrigin: true
      }
    }
  }
})
