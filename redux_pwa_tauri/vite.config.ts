import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isTauri = mode === 'tauri';

  console.log('Current mode:', mode);
  console.log('Is Tauri:', isTauri);

  return {
    base: isTauri ? './' : '/web_frontend/',

    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/rip': { target: 'http://localhost:9000', changeOrigin: true },
        '/api': { target: 'http://localhost:8080', changeOrigin: true },
      }
    }
  }
})