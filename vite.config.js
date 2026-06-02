import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/whattomine': {
        target: 'https://whattomine.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const type = url.searchParams.get('type') || 'asic';
          return `/${type}.json`;
        },
      },
    },
  },
})
