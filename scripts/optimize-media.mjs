// Génère les médias optimisés du site (public/media) à partir des originaux dans assets/photo.
// Usage : npm run media
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import sharp from 'sharp'
import ffmpeg from 'ffmpeg-static'

const run = promisify(execFile)
const SRC = path.resolve('assets/photo')
const OUT = path.resolve('public/media')
const PUBLIC = path.resolve('public')

const src = name => path.join(SRC, `SaveTik.co_${name}.jpeg`)

// Photos lifestyle : nom de sortie -> fichier source
const photos = {
  'studio-1': src('7547400147727060246_1'),
  'studio-2': src('7547400147727060246_2'),
  'vestiaire-1': src('7547400147727060246_3'),
  'vestiaire-2': src('7547400147727060246_4'),
  'cite-1': src('7611188908633640225_1'),
  'cite-2': src('7611188908633640225_10'),
  'cite-3': src('7611188908633640225_2'),
  'cite-4': src('7611188908633640225_7'),
  'cite-5': src('7611188908633640225_8'),
  'cite-6': src('7611188908633640225_9'),
  'porte-bleue-1': src('7613501283013561633_1'),
  'porte-bleue-2': src('7613501283013561633_7'),
  'flatlay-1': src('7670605136498019617_1'),
  'flatlay-2': src('7670605136498019617_2'),
  'parking-1': src('7673118461530361120_1'),
  'parking-2': src('7673118461530361120_2'),
  'parking-3': src('7673118461530361120_3'),
  'parking-4': src('7673118461530361120_4'),
  'crew-1': src('7688823190004501792_1'),
  'crew-2': src('7688823190004501792_2'),
  'crew-3': src('7688823190004501792_3'),
  'crew-4': src('7688823190004501792_5'),
}

// Packshots découpés dans les planches produit (1080x1350)
const sheet1 = src('7670617087013932320_1')
const sheet2 = src('7670617087013932320_2')
const cut = {
  topLeft: { left: 30, top: 135, width: 500, height: 365 },
  topRight: { left: 530, top: 135, width: 520, height: 365 },
  midLeft: { left: 20, top: 495, width: 510, height: 375 },
  midRight: { left: 530, top: 495, width: 520, height: 375 },
  bottom: { left: 265, top: 925, width: 525, height: 320 },
}
const packshots = {
  'tee-bleu-roi-1': [sheet1, cut.topLeft],
  'tee-bleu-roi-2': [sheet1, cut.topRight],
  'tee-rose-1': [sheet1, cut.midLeft],
  'tee-rose-2': [sheet1, cut.midRight],
  'tee-blanc-1': [sheet1, cut.bottom],
  'tee-noir-1': [sheet2, cut.topLeft],
  'tee-noir-2': [sheet2, cut.topRight],
  'tee-kaki-1': [sheet2, cut.midLeft],
  'tee-kaki-2': [sheet2, cut.midRight],
  'tee-blanc-vert-1': [sheet2, cut.bottom],
}

async function photo(name, file) {
  for (const w of [800, 1600]) {
    await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(OUT, `${name}-${w}.webp`))
  }
}

async function packshot(name, [file, box]) {
  // extract et trim dans deux pipelines séparés : sharp ne garantit pas leur ordre dans un seul
  // Masque le logo d'en-tête de la planche, qui déborde sur les découpes du haut
  const mask = { input: { create: { width: 300, height: 154, channels: 3, background: '#ffffff' } }, left: 400, top: 0 }
  const clean = await sharp(file).composite([mask]).toBuffer()
  const crop = await sharp(clean).extract(box).toBuffer()
  const buf = await sharp(crop).trim({ background: '#ffffff', threshold: 18 }).toBuffer()
  // Packshot centré sur fond blanc, format 4:5
  await sharp(buf)
    .resize(880, 1100, { fit: 'contain', background: '#ffffff' })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, `${name}.webp`))
}

async function brand() {
  const logo = path.join(SRC, 'logo_nb_zarey.png')
  await sharp(logo).trim().resize({ width: 480 }).webp({ quality: 90 }).toFile(path.join(OUT, 'logo.webp'))
  await sharp(logo).trim().resize({ width: 480 }).png().toFile(path.join(OUT, 'logo.png'))
  const square = size => sharp(logo).trim().resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png()
  await square(32).toFile(path.join(PUBLIC, 'favicon.png'))
  await square(180).toFile(path.join(PUBLIC, 'apple-touch-icon.png'))
  await sharp(photos['crew-1']).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 80 }).toFile(path.join(OUT, 'og.jpg'))
}

async function video() {
  const input = path.join(SRC, 'SaveTik.co_7610137532189199648.mp4')
  // Boucle hero : 16 s, muette, légère
  await run(ffmpeg, ['-y', '-loglevel', 'error', '-ss', '0', '-t', '16', '-i', input, '-an', '-vf', 'scale=960:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, 'hero-loop.mp4')])
  // Film complet avec son
  await run(ffmpeg, ['-y', '-loglevel', 'error', '-i', input, '-vf', 'scale=1024:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', path.join(OUT, 'film.mp4')])
  await run(ffmpeg, ['-y', '-loglevel', 'error', '-ss', '1', '-i', input, '-frames:v', '1', '-vf', 'scale=1024:-2', path.join(OUT, 'hero-poster.jpg')])
  await sharp(path.join(OUT, 'hero-poster.jpg')).webp({ quality: 72 }).toFile(path.join(OUT, 'hero-poster.webp'))
  await fs.rm(path.join(OUT, 'hero-poster.jpg'))
}

await fs.mkdir(OUT, { recursive: true })
await Promise.all(Object.entries(photos).map(([n, f]) => photo(n, f)))
await Promise.all(Object.entries(packshots).map(([n, s]) => packshot(n, s)))
await brand()
await video()
console.log('Médias générés dans public/media')
