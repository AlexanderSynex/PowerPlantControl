import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 8080,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    __APP_ENV__: JSON.stringify(env.APP_ENV),
  },

})


