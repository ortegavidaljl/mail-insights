import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/main.js'],
      refresh: true,
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./resources/js', import.meta.url))
    }
  },
  // I have the dev env in another host. So I need to set these lines to make previsualization and hmr work
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
        host: '192.168.1.100'
    },
  }
});
