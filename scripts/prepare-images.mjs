// Image pipeline.
//
// The art in public/ was raw PNG at full resolution — a single project screenshot
// was 1.8 MB. That is a direct Core Web Vitals (LCP) problem, and LCP is a ranking
// input. This script:
//
//   1. re-encodes public/work/* and public/clients/* to WebP at the same dimensions
//   2. generates the 1200x630 social share card (og:image)
//   3. writes src/data/images.json with the real pixel dimensions of every image,
//      so og:image:width/height are correct rather than guessed
//
// Run with `npm run images`. Output is committed, so a normal `npm run build`
// never needs this script or sharp.

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

import { site } from '../src/data/site.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

// 82 is the sweet spot for UI screenshots: visually indistinguishable from PNG,
// typically 10-20x smaller. Anything lower and flat colour areas band.
const QUALITY = 82

const SHARE = { width: 1200, height: 630 }

// Written to src/data/images.json at the end of the run.
const manifest = {}

/** Shared card background: near-black with the brand's violet glow, matching the site. */
function cardSvg({ eyebrow, title, subtitle }) {
  const escape = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Greedy wrap so long project names stay inside the card instead of overflowing.
  const words = title.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > 26 && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  const shown = lines.slice(0, 2)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SHARE.width}" height="${SHARE.height}">
    <defs>
      <radialGradient id="glow" cx="78%" cy="8%" r="72%">
        <stop offset="0%" stop-color="#6E56F8" stop-opacity="0.34"/>
        <stop offset="60%" stop-color="#6E56F8" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#101113" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2A2C31"/>
        <stop offset="100%" stop-color="#1A1B1F"/>
      </linearGradient>
    </defs>
    <rect width="${SHARE.width}" height="${SHARE.height}" fill="#101113"/>
    <rect width="${SHARE.width}" height="${SHARE.height}" fill="url(#glow)"/>
    <rect x="40" y="40" width="${SHARE.width - 80}" height="${SHARE.height - 80}" fill="none" stroke="url(#edge)" stroke-width="1"/>

    <g font-family="Manrope, Segoe UI, Helvetica, Arial, sans-serif" fill="#F2F2EF">
      <text x="88" y="132" font-size="21" letter-spacing="4.5" fill="#9A9C93">${escape(eyebrow.toUpperCase())}</text>
      ${shown
        .map(
          (text, index) =>
            `<text x="88" y="${268 + index * 86}" font-size="72" font-weight="800" letter-spacing="-1.5">${escape(text)}</text>`,
        )
        .join('\n      ')}
      <text x="88" y="470" font-size="27" fill="#B9BBB2">${escape(subtitle)}</text>
      <rect x="88" y="516" width="58" height="4" fill="#FF5A36"/>
    </g>

    <g font-family="'DM Mono', ui-monospace, monospace" font-size="23" fill="#8C8E86">
      <text x="88" y="576">${escape(site.url.replace('https://', ''))}</text>
      <text x="1112" y="576" text-anchor="end">${escape(`${site.city}, ${site.country}`)}</text>
    </g>
  </svg>`
}

async function writeShareCard() {
  const svg = cardSvg({
    eyebrow: `${site.name} · ${site.city}, ${site.country}`,
    title: site.slogan,
    subtitle: 'Web platforms · Mobile apps · AI & automation · Custom software',
  })

  const out = join(publicDir, 'og-card.png')
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out)
  return out
}

/**
 * Brand marks at the sizes they are actually used at.
 *
 * The logo was a single 1080x1080 / 270 KB PNG doing four jobs: the 132x132 footer
 * image, the favicon, the apple-touch-icon and the manifest icon. A browser
 * downloads the favicon on every page view, so that was ~270 KB of the critical
 * path spent on an icon. Each use now gets a file sized for it.
 */
async function writeBrandMarks() {
  // The 1080x1080 master lives in assets/ at the repo root, not public/ — it is the
// source every mark below is derived from and is not itself served, so it should
// not be published.
const source = join(root, 'assets/logo.png')

  // Footer mark. The CSS renders it at 132x132, so 320 covers 2x DPR with room.
  //
  // This lives in public/ and is referenced as a plain path rather than imported
  // from src/. Vite rewrites imported assets to a hashed /assets/ URL for the
  // browser bundle, but the prerenderer renders through Vite's SSR pipeline,
  // which leaves the import as the raw "/src/..." path — a 404 on every page.
  const footer = join(publicDir, 'logo-mark.webp')
  await sharp(source).resize(320, 320, { fit: 'inside' }).webp({ quality: 90 }).toFile(footer)

  // Favicons and install icons, at the sizes those contexts actually request.
  const icons = [
    { file: 'icon-192.png', size: 192 },
    { file: 'icon-512.png', size: 512 },
    { file: 'apple-touch-icon.png', size: 180 },
  ]

  for (const { file, size } of icons) {
    // palette:true quantises to a 256-colour indexed PNG, which is what a flat
    // brand mark wants — a 512px icon drops from ~110 KB to a few KB.
    await sharp(source)
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(join(publicDir, file))
  }

  // schema.org Organization.logo. Google accepts WebP, and it keeps the entity
  // image small without publishing the 270 KB master.
  const orgLogo = join(publicDir, 'logo-512.webp')
  await sharp(source).resize(512, 512, { fit: 'inside' }).webp({ quality: 88 }).toFile(orgLogo)

  const orgMeta = await sharp(orgLogo).metadata()
  const footerMeta = await sharp(footer).metadata()
  manifest['/logo-512.webp'] = { width: orgMeta.width, height: orgMeta.height, type: 'image/webp' }
  manifest['/logo-mark.webp'] = { width: footerMeta.width, height: footerMeta.height, type: 'image/webp' }

  console.log(`  /logo-512.webp${' '.repeat(17)} ${orgMeta.width}×${orgMeta.height} schema.org logo`)
  console.log(`  /icon-192, -512, apple-touch  favicon + install icons`)
  console.log(`  /logo-mark.webp${' '.repeat(16)} ${footerMeta.width}×${footerMeta.height} footer mark (was 1080×1080)`)

  return footer
}

async function convertDir(dir) {
  const entries = (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && extname(entry.name).toLowerCase() === '.png')
    .map((entry) => entry.name)

  return Promise.all(
    entries.map(async (name) => {
      const from = join(dir, name)
      const to = join(dir, `${basename(name, '.png')}.webp`)
      const before = (await readFile(from)).length

      await sharp(from).webp({ quality: QUALITY, effort: 6 }).toFile(to)
      const after = (await readFile(to)).length

      return { name, to, before, after }
    }),
  )
}

async function main() {
  let saved = 0
  const before = { bytes: 0 }
  const after = { bytes: 0 }

  for (const dir of [join(publicDir, 'work'), join(publicDir, 'clients')]) {
    for (const result of await convertDir(dir)) {
      const meta = await sharp(result.to).metadata()
      const publicPath = `/${dir.slice(publicDir.length + 1)}/${basename(result.to)}`
      manifest[publicPath] = { width: meta.width, height: meta.height, type: 'image/webp' }

      before.bytes += result.before
      after.bytes += result.after
      saved += result.before - result.after

      console.log(
        `  ${publicPath.padEnd(34)} ${String(result.before).padStart(8)}B → ${String(result.after).padStart(7)}B  ${meta.width}×${meta.height}`,
      )
    }
  }

  // The share card doubles as the site's default og:image, so a 1200x630 branded
  // card replaces a 268 KB square logo that every platform cropped badly.
  const card = await writeShareCard()
  const cardMeta = await sharp(card).metadata()
  manifest['/og-card.png'] = { width: cardMeta.width, height: cardMeta.height, type: 'image/png' }
  console.log(`  /og-card.png${' '.repeat(21)} ${cardMeta.width}×${cardMeta.height} social card`)

  console.log('')
  await writeBrandMarks()

  await writeFile(join(root, 'src/data/images.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  const savedMb = (saved / 1024 / 1024).toFixed(2)
  // Re-running after the PNGs are gone converts nothing, so only claim a saving
  // when there was actually something to convert.
  if (before.bytes) {
    console.log(
      `\n  ${(before.bytes / 1024 / 1024).toFixed(2)} MB → ${(after.bytes / 1024 / 1024).toFixed(2)} MB  (saved ${savedMb} MB)`,
    )
  }
  console.log('  manifest: src/data/images.json\n')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})