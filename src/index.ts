import { CompressRequest } from './type'
import PromiseWorker from 'promise-worker'

function toFile (buffer: ArrayBuffer, filename: string, type: string) {
  return new File([new Uint8Array(buffer)], filename, { type })
}

const worker        = new Worker(new URL('./worker', import.meta.url), { type: 'module' })
const promiseWorker = new PromiseWorker(worker)

export async function compress (file: File, type: CompressRequest['type']): Promise<File> {
  const buffer = await promiseWorker.postMessage({ file, type })

  return toFile(buffer, file.name, type)
}
