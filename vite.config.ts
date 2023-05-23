import { defineConfig } from 'vite'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins     : [
    wasm(),
    topLevelAwait(),
  ],
  optimizeDeps: {
    exclude: [
      '@jsquash/png',
      '@jsquash/jpeg',
      '@jsquash/oxipng',
      '@jsquash/resize',
    ]
  },
  // build: {
  //   lib: {
  //     entry   : resolve(__dirname, 'src/worker.ts'),
  //     name    : 'OMG',
  //     fileName: 'omg',
  //   },
  // },
  worker: {
    // Not needed with vite-plugin-top-level-await >= 1.3.0
    // format: "es",
    plugins: [
      wasm(),
      topLevelAwait()
    ]
  }
})
