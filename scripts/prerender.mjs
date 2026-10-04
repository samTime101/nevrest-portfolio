// Build-time prerenderer.
//
// Runs after `vite build` and writes one real HTML document per route into dist/,
// so a crawler receives the page's <title>, description, canonical, JSON-LD *and*
// its full body content in the initial response — before any JavaScript runs.
//
// Why this exists: the app is a client-rendered SPA, so the raw HTML used to ship
// an empty <div id="root"></div> with no <title> and a canonical that pointed at
// the homepage on every URL. Google read that as "9 duplicate pages" and dropped
// them. This step removes the reliance on client-side SEO entirely.
//
// Markup comes from src/entry-server.jsx, which renders the same AppRoutes tree
// the browser mounts, and head tags come from the same headMetaTags()/schemaTags()
// used for the shell — one implementation, no drift.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

// Markers in index.html. `geo:meta`/`geo:schema` are filled by the Vite plugin;
// these sentinels delimit the whole generated block so each route's head can be
// swapped in wholesale, and `app-html` is where the rendered body goes.
const HEAD_BLOCK = /<!--seo:head:start-->[\s\S]*?<!--seo:head:end-->/
const ROOT_BLOCK = /<div id="root">[\s\S]*?<\/div>/

const kb = (text) => `${(Buffer.byteLength(text) / 1024).toFixed(1)} kB`

async function main() {
  const shell = await readFile(join(dist, 'index.html'), 'utf8').catch(() => {
    throw new Error('dist/index.html not found — run `vite build` first.')
  })

  // Sanity-check the shell before transforming it, so a Vite HTML change surfaces
  // as a clear error instead of silently shipping an empty page.
  const rootMatch = shell.match(ROOT_BLOCK)
  if (!rootMatch) throw new Error('Could not find <div id="root">…</div> in dist/index.html')
  if (!HEAD_BLOCK.test(shell)) throw new Error('Missing <!--seo:head:start--> markers in dist/index.html')

  // Load through Vite so JSX and the JSON import in src/lib/seo-files.js are
  // resolved the same way the browser build resolves them.
  const server = await createServer({
    root,
    appType: 'custom',
    logLevel: 'warn',
    server: { middlewareMode: true },
  })

  try {
    const [{ render }, { routes, headMetaTags, schemaTags }] = await Promise.all([
      server.ssrLoadModule('/src/entry-server.jsx'),
      server.ssrLoadModule('/src/lib/seo-files.js'),
    ])

    console.log(`prerendering ${routes.length} routes\n`)

    for (const { path } of routes) {
      const body = render(path)

      if (!body.trim()) throw new Error(`Route ${path} rendered an empty body`)

      const html = buildDocument(shell, path, body, headMetaTags(path), schemaTags(path))
      const outDir = path === '/' ? dist : join(dist, path)

      await mkdir(outDir, { recursive: true })
      await writeFile(join(outDir, 'index.html'), html)

      console.log(`  ${path.padEnd(30)} ${kb(html).padStart(9)}`)
    }

    console.log('\ndone — every route now ships its own title, canonical and content')
  } finally {
    await server.close()
  }
}

/**
 * Produce the final document for one route from the shared shell.
 *
 * Replacements go through functions, not strings: the rendered body and JSON-LD
 * can contain `$&`/`$1`, which String.replace would otherwise interpret as
 * capture-group references.
 */
function buildDocument(shell, path, body, metaTags, schema) {
  return shell
    .replace(HEAD_BLOCK, () => `<!--seo:head:start-->${metaTags}${schema}<!--seo:head:end-->`)
    .replace(ROOT_BLOCK, () => `<div id="root">${body}</div>`)
}

main().catch((error) => {
  console.error(`\nprerender failed: ${error.message}`)
  process.exit(1)
})