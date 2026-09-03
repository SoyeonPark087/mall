import fs from 'node:fs'
import path from 'node:path'

const source = path.resolve('images')
const destination = path.resolve('dist/images')

if (!fs.existsSync(source)) {
  console.warn('[copy-images] images 폴더가 없어 복사를 건너뜁니다.')
  process.exit(0)
}

fs.mkdirSync(path.dirname(destination), { recursive: true })
fs.cpSync(source, destination, { recursive: true })

console.log('[copy-images] images 폴더를 dist/images로 복사했습니다.')
