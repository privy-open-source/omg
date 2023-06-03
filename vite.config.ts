import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@jsquash/png',
      '@jsquash/jpeg',
      '@jsquash/oxipng',
      '@jsquash/resize',
    ],
  },
  build: {
    lib: {
      entry   : resolve(__dirname, 'src/index.ts'),
      name    : 'OMG',
      fileName: 'omg',
    },
  },
})
