import { CompressRequest } from './type'
import jpgEncode from '@jsquash/jpeg/encode'
import jpgDecode from '@jsquash/jpeg/decode'
import pngEncode from '@jsquash/png/encode'
import pngDecode from '@jsquash/png/decode'
import init, { optimise as pngOptimize } from '@jsquash/oxipng/codec/pkg/squoosh_oxipng'

async function decode (file: File) {
  const buffer = await file.arrayBuffer()

  switch (file.type) {
    case 'image/jpeg':
    case 'image/jpg':
      return jpgDecode(buffer)

    case 'image/png':
      return pngDecode(buffer)
  }
}

async function encode (imageData: ImageData, type: string) {
  switch (type) {
    case 'image/jpeg':
    case 'image/jpg':
      return jpgEncode(imageData)

    case 'image/png':
      await init()

      return pngOptimize(new Uint8Array(await pngEncode(imageData)), 4, false)
  }
}

async function compress (file: File, type: string) {
  const imageData = await decode(file)

  if (!imageData)
    throw new Error('Image cannot be decoded')

  return await encode(imageData, type)
}

addEventListener('message', async (event: MessageEvent<CompressRequest>) => {
  const { file, type } = event.data

  postMessage(await compress(file, type))
})
