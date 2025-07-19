import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174
  },
  build: {
    // Build de desenvolvimento para facilitar debug
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode !== 'production' ? 'inline' : false,
    // Otimizações para reduzir tamanho dos chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          router: ['react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Garantir que assets sejam copiados corretamente
  publicDir: 'public'
}));
