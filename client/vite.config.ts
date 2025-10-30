import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite Configuration
 * 
 * LEARNING NOTES:
 * - Vite is a modern build tool (faster than webpack/CRA)
 * - Uses native ES modules during development
 * - Hot Module Replacement (HMR) for instant updates
 */

export default defineConfig({
  plugins: [react()],
  
  // Path aliases for cleaner imports
  // LEARNING: Import with '@/components/...' instead of '../../../components/...'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: '0.0.0.0', // Required for Docker
    
    // Enable hot reload in Docker on Windows
    watch: {
      usePolling: true,
      interval: 100,
    },
    
    // Proxy API requests to backend
    // LEARNING: In Docker, use service name; outside Docker, use localhost
    // This avoids CORS issues during development
    proxy: {
      '/api': {
        target: process.env.DOCKER_ENV ? 'http://server:5000' : 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
});


