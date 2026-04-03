import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
  proxy: {
    '/opensky-api': {  
      target: 'https://opensky-network.org',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/opensky-api/, '/api')  
    },
       '/aviation-api': {
      target: 'https://api.aviationstack.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/aviation-api/, '/v1')
    }
  }
}
})