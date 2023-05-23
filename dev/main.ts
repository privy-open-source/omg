import { compress } from '../src'
import Compressor from 'compressorjs'

function compressor (file: File): Promise<File> {
  return new Promise((resolve) => {
    new Compressor(file, {
      quality    : .75,
      convertSize: 1_000_000,
      success(file) {
        resolve(file as File)
      },
    })
  })
}

function createPreview (file: File, original: File) {
  const div   = document.createElement('div')
  const image = document.createElement('img')
  const p     = document.createElement('p')

  image.src     = URL.createObjectURL(file)
  p.textContent = `Size: ${file.size.toLocaleString('id')} (${Math.round((file.size - original.size) / original.size * 100)})%`

  image.classList.add('img-preview')

  div.append(image)
  div.append(p)

  return div
}

function createPreviews (files: File[]) {
  const container = document.querySelector('#preview') as HTMLDivElement
  const oldImgs   = container.querySelectorAll('img')

  for (const img of oldImgs) {
    if (img.src.startsWith('blob:'))
      URL.revokeObjectURL(img.src)
  }

  container.innerHTML = ''

  for (const file of files) {
    const preview = createPreview(file, files[0])

    container.append(preview)
  }
}

async function onChange (event: Event) {
  const input = event.target as HTMLInputElement
  const file  = input.files?.[0]

  if (file) {
    const queue = file.type === 'image/png'
      ? [compress(file, 'image/png'),compress(file, 'image/jpg')]
      : [compress(file, 'image/jpg')]

    queue.push(compressor(file))

    const output = await Promise.all(queue)

    createPreviews([file, ...output])
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#input') as HTMLInputElement

  input.addEventListener('change', onChange)
})
