import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@nabla/vite-plugin-eslint';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), eslint(), tailwindcss()],
    server: {
      port: 4001,
      proxy: {
        '/api': {
          target: 'http://localhost:4001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
});
