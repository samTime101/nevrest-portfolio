// Post-build SEO audit. Fails the build if any route regresses.
//
// The bug this exists to prevent: a shared <title> and a hardcoded canonical on
// every page, which Google reads as "these are duplicates of the homepage" and
// silently drops from the index. Nothing about that shows up in a normal build —
// the site still renders fine — so it is checked explicitly here.
//
//   node scripts/check-seo.mjs

import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ORIGIN = 'https://nevrestlabs.com'

const failures = []
const notes = []

const fail = (route, message) => failures.push(`${route}: ${message}`)

const attr = (html, pattern) => html.match(pattern)?.[1]?.trim()

async function audit(path) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html')
  const html = await readFile(file, 'utf8').catch(() => null)
  if (!html) return fail(path, 'no prerendered HTML found')

  const label = path

  // --- title -----------------------------------------------------------------
  const title = attr(html, /<title>([^<]*)<\/title>/)
  if (!title) fail(label, 'no <title>')
  else if (/untitled/i.test(title)) fail(label, `title is "${title}"`)

  // --- canonical -------------------------------------------------------------
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/)
  if (!canonical) fail(label, 'no canonical')
  else if (canonical !== `${ORIGIN}${path}`) fail(label, `canonical points at ${canonical}, expected ${ORIGIN}${path}`)

  // --- description -----------------------------------------------------------
  const description = attr(html, /<meta name="description" content="([^"]*)"/)
  if (!description) fail(label, 'no meta description')
  else if (description.length > 160) fail(label, `meta description is ${description.length} chars (max 160)`)

  // --- robots ----------------------------------------------------------------
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/)
  if (!robots) fail(label, 'no meta robots')

  // --- Open Graph mirrors the title -----------------------------------------
  const unescape = (value) => (value ?? '').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  const ogTitle = attr(html, /<meta property="og:title" content="([^"]*)"/)
  const ogUrl = attr(html, /<meta property="og:url" content="([^"]*)"/)
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/)
  if (!ogImage) fail(label, 'no og:image')
  if (ogUrl && ogUrl !== `${ORIGIN}${path}`) fail(label, `og:url is ${ogUrl}`)
  if (ogTitle && title && unescape(ogTitle) !== unescape(title)) fail(label, 'og:title does not match title')

  // --- rendered body ---------------------------------------------------------
  const body = html.match(/<div id="root">([\s\S]*?)<\/body>/)?.[1] ?? ''
  if (body.length < 1000) fail(label, `body content is only ${body.length} chars — did SSR render?`)

  const h1s = body.match(/<h1[\s>]/g) ?? []
  if (h1s.length !== 1) fail(label, `expected exactly 1 <h1>, found ${h1s.length}`)

  if (!/<a\s+href="/.test(body)) fail(label, 'no internal links in rendered body')

  // Unbuilt source paths mean the prerenderer emitted markup Vite never rewrote.
  // Vite's SSR pass does not process asset imports the way the browser build does,
  // so an imported image lands in the HTML as "/src/assets/x.png" and 404s for
  // every visitor while still looking fine in a build log.
  for (const [, url] of html.matchAll(/(?:src|href)="(\/src\/[^"]*)"/g)) {
    fail(label, `references unbuilt source path ${url} — import assets in components and the prerenderer will not rewrite them`)
  }

  // --- structured data -------------------------------------------------------
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  if (!blocks.length) fail(label, 'no JSON-LD')

  for (const [, json] of blocks) {
    try {
      const parsed = JSON.parse(json)
      // Either a typed node or a @graph envelope (siteGraph uses @graph).
      const typed = parsed['@type'] || (Array.isArray(parsed['@graph']) && parsed['@graph'].every((node) => node['@type']))
      if (!typed) fail(label, 'JSON-LD block has neither @type nor a fully typed @graph')
    } catch (error) {
      fail(label, `invalid JSON-LD: ${error.message}`)
    }
  }

  return { label, title, canonical, chars: body.length, blocks: blocks.length }
}

const routes = [
  '/',
  '/projects',
  '/projects/omedate',
  '/projects/nepse-terminal',
  '/projects/automation-suite',
  '/projects/mail-studio',
  '/projects/justodo',
  '/projects/compliance-compass',
  '/clients',
  '/how-we-deliver',
]

const results = []
for (const path of routes) {
  const result = await audit(path)
  if (result) results.push(result)
}

// --- CSP must allow every inline JSON-LD block on every route -------------
// The prerendered pages each carry a different set of JSON-LD scripts, and
// Cloudflare's _headers script-src lists their hashes. If a route's blocks are
// missing from that list the structured data is blocked in the browser, where
// Google reads it.
const headers = await readFile(join(dist, '_headers'), 'utf8').catch(() => '')
const allowedHashes = new Set([...headers.matchAll(/sha256-([A-Za-z0-9+/=]+)/g)].map((match) => match[1]))

async function htmlFiles(dir = dist, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await htmlFiles(path, found)
    else if (entry.name === 'index.html') found.push(path)
  }
  return found
}

let blocked = 0
for (const file of await htmlFiles()) {
  const html = await readFile(file, 'utf8')
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const digest = createHash('sha256').update(json, 'utf8').digest('base64')
    if (!allowedHashes.has(digest)) {
      fail(file.replace(`${dist}/`, ''), 'inline JSON-LD is not allowed by the CSP script-src hashes')
      blocked++
    }
  }
}

// --- cross-route uniqueness: the regression this audit exists for -----------
const titles = new Map()
for (const { label, title } of results) {
  if (!title) continue
  if (titles.has(title)) fail(label, `duplicate title, also on ${titles.get(title)}`)
  else titles.set(title, label)
}

console.log('\n  route                            title chars  jsonld')
console.log('  ' + '-'.repeat(72))
for (const { label, title, chars, blocks } of results) {
  console.log(`  ${label.padEnd(32)} ${String(chars ?? 0).padStart(5)}  ${String(blocks ?? 0).padStart(5)}  ${title ?? '—'}`)
}

for (const note of notes) console.log(`\n  note: ${note}`)

if (failures.length) {
  console.error(`\n  ${failures.length} SEO failure(s):`)
  for (const failure of failures) console.error(`   ✗ ${failure}`)
  process.exit(1)
}

console.log(`\n  ✓ ${results.length} routes pass: unique titles, self-referencing canonicals, rendered body, valid JSON-LD\n`)