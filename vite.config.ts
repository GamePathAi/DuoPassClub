import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  build: {
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
});
