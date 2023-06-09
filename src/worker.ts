import { CompressRequest } from './type'
import registerPromiseWorker from 'promise-worker/register'
import * as jpg from '@jsquash/jpeg'
import * as png from '@jsquash/png'
import initOxiPNG, { optimise as pngOptimize } from '@jsquash/oxipng/codec/pkg/squoosh_oxipng'

async function decode (file: File) {
  const buffer = await file.arrayBuffer()

  switch (file.type) {
    case 'image/jpeg':
    case 'image/jpg':
      return jpg.decode(buffer)

    case 'image/png':
      return png.decode(buffer)

    default:
      return undefined
  }
}

async function encode (imageData: ImageData, type: string) {
  switch (type) {
    case 'image/jpeg':
    case 'image/jpg':
      return jpg.encode(imageData)

    case 'image/png':
      await initOxiPNG()

      return pngOptimize(new Uint8Array(await png.encode(imageData)), 4, false)

    default:
      return undefined
  }
}

async function compress (file: File, type: string) {
  const imageData = await decode(file)

  if (!imageData)
    throw new Error('Image cannot be decoded')

  return await encode(imageData, type)
}

registerPromiseWorker(async (message: CompressRequest) => {
  return await compress(message.file, message.type)
})
