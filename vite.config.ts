import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'vis-creates.png'],
      manifest: {
        name: 'Visweshwaran S - Personal Portfolio',
        short_name: 'Vish288',
        description: 'Personal website and portfolio of Visweshwaran S - Full Stack Developer',
        theme_color: '#7a8450',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'vis-creates.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-toast', 'lucide-react'],
          router: ['react-router-dom'],
          form: ['react-hook-form'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
