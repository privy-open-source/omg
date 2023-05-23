import * as jpg from '@jsquash/jpeg'
import * as png from '@jsquash/png'
import { optimise } from '@jsquash/oxipng'
import { CompressRequest } from './type'

async function decode (file: File) {
  const buffer = await file.arrayBuffer()

  switch (file.type) {
    case 'image/jpeg':
    case 'image/jpg':
      return jpg.decode(buffer)

    case 'image/png':
      return png.decode(buffer)
  }
}

async function encode (imageData: ImageData, type: string) {
  switch (type) {
    case 'image/jpeg':
    case 'image/jpg':
      return jpg.encode(imageData)

    case 'image/png':
      return optimise(await png.encode(imageData))
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
