import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

const watchIgnored = [
  '**/.git/**',
  '**/dist/**',
  '**/coverage/**',
  '**/.vercel/**',
  '**/.turbo/**',
]

const usePolling = process.env.VITE_USE_POLLING !== 'false'

export default defineConfig(({ command }) => ({
  base: './',
  plugins: [command === 'serve' ? inspectAttr() : null, react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling,
      interval: 250,
      binaryInterval: 1000,
      ignored: watchIgnored,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor';
          }

          if (id.includes('react-router') || id.includes('@remix-run')) {
            return 'router-vendor';
          }

          if (id.includes('framer-motion')) {
            return 'motion-vendor';
          }

          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts-vendor';
          }

          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }

          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }

          if (id.includes('date-fns')) {
            return 'date-vendor';
          }
        },
      },
    },
  },
}));
