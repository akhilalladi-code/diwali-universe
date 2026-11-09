import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/diwali-universe/',
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false },
})
