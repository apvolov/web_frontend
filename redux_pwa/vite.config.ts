import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/redux-pwa/', 

  plugins: [react()],
  
  server: {
    port: 3000,
  }
})