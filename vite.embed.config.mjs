import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.mjs',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    // provide process.env shim at build-time (helps some libs that use process.env)
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env': JSON.stringify(process.env || {})
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
