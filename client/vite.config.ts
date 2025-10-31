import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 5173,
    host: '0.0.0.0',
    
    watch: {
      usePolling: true,
      interval: 100,
    },
    
    proxy: {
      '/api': {
        target: process.env.DOCKER_ENV ? 'http://server:5000' : 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
});
