import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
      include: '**/*.svg',
      exclude: '',
    })
  ],
  
  // Otimizações de dependências
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js'
    ]
  },
  
  // Configurações de build para produção
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desabilitar em produção por segurança
    minify: 'terser',
    
    // Configurações do Terser para minificação
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs em produção
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    // Configurações de chunk splitting
     rollupOptions: {
       output: {
         // Nomes de arquivo com hash para cache busting
         chunkFileNames: 'assets/js/[name]-[hash].js',
         entryFileNames: 'assets/js/[name]-[hash].js',
         assetFileNames: (assetInfo) => {
           const info = assetInfo.name.split('.');
           const ext = info[info.length - 1];
           
           if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
             return `assets/images/[name]-[hash].${ext}`;
           }
           
           if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
             return `assets/fonts/[name]-[hash].${ext}`;
           }
           
           if (/\.(css)$/i.test(assetInfo.name)) {
             return `assets/css/[name]-[hash].${ext}`;
           }
           
           return `assets/[name]-[hash].${ext}`;
         }
       }
     },
    
    // Configurações de assets
    assetsInlineLimit: 4096, // 4kb - inline assets menores
    
    // Configurações de CSS
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Configurações do servidor de desenvolvimento
  server: {
    port: 5174,
    host: true,
    open: true,
    cors: true
  },
  
  // Configurações de preview
  preview: {
    port: 4173,
    host: true,
    cors: true
  },
  
  // Alias para imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Variáveis de ambiente
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // Configurações de CSS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  
  // Configurações de PWA (se necessário)
  // Descomente se quiser adicionar PWA
  /*
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**\/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'DuoPass',
        short_name: 'DuoPass',
        description: 'Ofertas exclusivas na Suíça',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
  */
});
