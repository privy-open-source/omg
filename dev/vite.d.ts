/// <reference types="vite/client" />

declare module '?worker&inline' {
  const worker: Worker

  export default worker
}
