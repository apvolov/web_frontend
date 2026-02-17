import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { api_proxy_addr, img_proxy_addr, dest_root } from './target_config'

export default defineConfig(({ mode }) => {
  const isTauri = mode === 'tauri';

  return {
    base: isTauri ? './' : dest_root, 

    plugins: [react()],
    
    clearScreen: false,
    
    server: {
      port: 3000,
      strictPort: true, 
      proxy: {
        '/rip': { 
          target: img_proxy_addr, 
          changeOrigin: true,
        },
        '/api': { 
          target: api_proxy_addr, 
          changeOrigin: true 
        },
      }
    }
  }
})