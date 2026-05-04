import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'https://print3d-j9x7.onrender.com', changeOrigin: true },
      '/uploads': { target: 'https://print3d-j9x7.onrender.com', changeOrigin: true }
    }
  },
  build: { outDir: 'dist', chunkSizeWarningLimit: 1600 }
})
