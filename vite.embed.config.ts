import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'next/image': path.resolve(__dirname, 'src/embed/next-image-shim.tsx'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/embed/entry.tsx'),
      name: 'AccessibilityBarEmbed',
      formats: ['iife'],
      fileName: () => 'embed-bundle.js'
    },
    outDir: path.resolve(__dirname, 'public'),
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    target: 'es2017',
    minify: 'esbuild'
  }
})
