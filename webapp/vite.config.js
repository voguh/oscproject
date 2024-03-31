import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true
  },
  plugins: [react()],
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  }
}))
