import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    publicDir: false,
    css: {
      postcss: './postcss.config.mjs',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'next/image': path.resolve(__dirname, 'src/embed/next-image-mock.tsx')
      }
    },
    define: {
      // provide process.env shim at build-time (helps some libs that use process.env)
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env': JSON.stringify(process.env || {}),
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(env.NEXT_PUBLIC_API_URL)
    },
    build: {
      assetsInlineLimit: 1000000, // Inline assets up to 1MB
      lib: {
        entry: path.resolve(__dirname, 'src/embed/entry.tsx'),
        name: 'AccessibilityBarEmbed',
        formats: ['iife'],
        fileName: () => 'embed-standalone.js'
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
  }
})
