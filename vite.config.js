import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/command-center-pamtas/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'src/test/**',
        'src/main.jsx',
        '**/*.config.*',
        'dist/**',
        // Pages dan komponen UI tidak ditest di unit test (butuh integration/e2e)
        'src/pages/**',
        'src/components/**',
        'src/context/**',
        // api.js punya dummy data fallback (lines 246-299) yang tidak bisa ditest
        // tanpa GAS live — business logic sudah ditest via api.normalization.test.js
        // dan api.fetch.test.js
        'src/services/api.js',
      ],
      thresholds: {
        lines:      85,
        functions:  85,
        branches:   75,
        statements: 85,
      },
    },
  },
})
