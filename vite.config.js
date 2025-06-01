import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // Min size in bytes (10kb)
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240,
    }),
  ],
  build: {
    // Menggunakan chunking yang lebih baik
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          three: ['three'],
          animations: ['framer-motion', 'vanta'],
          ui: ['@heroicons/react', '@mui/material', '@mui/icons-material'],
        },
        // Optimalkan size chunk
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Meminimalkan output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Hapus console.log pada production
        drop_debugger: true,
      },
    },
    // Pre-load dan prerender
    modulePreload: true,
    // Pengaturan reporting
    reportCompressedSize: false,
    // Pengaturan chunk size
    chunkSizeWarningLimit: 1000, // 1000kb
  },
  // Optimalkan resolusi
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Optimalkan server dev
  server: {
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  // Optimalkan performa
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three', 'vanta'],
    exclude: [],
  },
  // Mengaktifkan Source Map hanya untuk development
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})
