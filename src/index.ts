import { CompressRequest } from './type'

function toFile (buffer: ArrayBuffer, filename: string, type: string) {
  return new File([new Uint8Array(buffer)], 'asdasd', { type })
}

export function compress (file: File, type: CompressRequest['type']): Promise<File> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' })

    const onSuccess = (event: MessageEvent<ArrayBuffer>) => {
      onFinish()
      resolve(toFile(event.data, file.name, type))
    }

    const onError = (error: ErrorEvent) => {
      onFinish()
      reject(error)
    }

    const onFinish = () => {
      worker.removeEventListener('message', onSuccess)
      worker.terminate()
    }

    worker.addEventListener('message', onSuccess)
    worker.addEventListener('error', onError)
    worker.postMessage({ file, type })
  })
}
