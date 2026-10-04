# Nevrest Labs

Marketing site for Nevrest Labs, a software company in Kathmandu, Nepal. React + Vite SPA, deployed to Cloudflare Pages.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with the GEO plugin active (`/llms.txt` and `/sitemap.xml` are served locally too) |
| `npm run build` | Production build into `dist/`, then prerender every route to real HTML |
| `npm run check:seo` | Audit `dist/`: unique titles, self-referencing canonicals, rendered body, valid JSON-LD, CSP coverage |
| `npm run images` | Re-encode site art to WebP, generate the 1200×630 share card and icons, refresh `src/data/images.json` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve `dist/` locally |
| `npm run pdf:overview` | Rebuild `public/nevrest-labs-company-overview.pdf` from the site data |
| `npm run cf:deploy` | Build, then deploy to Cloudflare Pages |

## Why this site is prerendered

The app is a client-rendered SPA, so the raw HTML it used to ship was
`<div id="root"></div>` — no content, and no `<title>` in the served document at all,
because the title was only ever set from a `useEffect`. Two consequences:

1. A crawler's first pass saw an empty page, so it fell back to the meta description
   and reported no matching query terms.
2. Every URL carried `<link rel="canonical" href="https://nevrestlabs.com/">`, because
   `headMetaTags()` was called once for a single shared `index.html`. Google reads that
   as *"these pages duplicate the homepage"* and drops them — which is why only the
   homepage ever appeared in results.

`scripts/prerender.mjs` now runs after `vite build` and writes one document per route
into `dist/<route>/index.html`, each with its own title, description, canonical, JSON-LD
and fully rendered body. The site no longer depends on JavaScript for its content to be
readable.

Markup comes from `src/entry-server.jsx`, which renders the same `AppRoutes` tree the
browser mounts, and head tags from the same `headMetaTags()`/`schemaTags()` used for the
shell. `src/main.jsx` uses `hydrateRoot` to adopt that markup instead of discarding it.

`src/lib/route-head.js` is the single answer to "what are this route's head tags?".
The React pages, the prerenderer and the build plugin all read from it, so the runtime
and the static HTML cannot disagree.

## SEO & GEO

Structured data, metadata and the machine-readable files are **generated at build time from
`src/data/site.js`**. Page copy, JSON-LD and `llms.txt` all read from that one module, so they cannot drift apart.

| File | Role |
| --- | --- |
| `src/data/site.js` | Single source of truth: identity, services, technologies, industries, founders, FAQs, page titles/descriptions, derived "fast facts" |
| `src/lib/schema.js` | Pure JSON-LD builders — entity graph, FAQPage, BreadcrumbList, ItemList, SoftwareApplication |
| `src/lib/route-head.js` | Per-route head payload (title, description, canonical, image, JSON-LD). Shared by the runtime, the prerenderer and the build plugin |
| `src/lib/seo-files.js` | Build-time generators: head tags, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `_headers`, `_redirects` |
| `src/lib/seo.js` | Runtime `<head>` manager: per-route title/meta/canonical/OG and page-scoped JSON-LD |
| `src/components/Seo.jsx` | Declarative wrapper used by each page |
| `src/entry-server.jsx` | Server-render entry used only by the prerenderer |
| `src/data/images.json` | Pixel dimensions of every image, written by `npm run images`, used for `og:image:width`/`height` |

### Generated at build time

- **Per-route HTML** — `scripts/prerender.mjs` writes `dist/<route>/index.html` for all 10 routes (see above)
- **Head block + JSON-LD** — injected into `index.html` via the `geoPlugin` in `vite.config.js`, then rewritten per route by the prerenderer
- **`/sitemap.xml`** — every route, derived from `src/lib/seo-files.js` `routes`
- **`/llms.txt`** and **`/llms-full.txt`** — plain-text site summaries for AI assistants
- **`/_headers`** — HSTS, CSP, `Contact:`, cache policy. CSP `script-src` uses SHA-256 hashes of every JSON-LD block this build emits across every route, so no `'unsafe-inline'` is needed
- **`/_redirects`** — a 200 rewrite to each route's **own** prerendered document

### Images

`npm run images` re-encodes `public/work/*` and `public/clients/*` to WebP, sizes the brand
marks to where they are actually used (the footer mark renders at 132×132, so it ships a
320×320 WebP instead of a 1080×1080 PNG), generates the 1200×630 `og-card.png` share card,
and writes real pixel dimensions to `src/data/images.json`.

Output is committed, so `npm run build` never needs `sharp` — it is a devDependency only.

There is deliberately no `<noscript>` fallback any more. Now that every route ships its
body content, a second copy in `<noscript>` would be duplicate text for the same page.

### Company overview PDF

`npm run pdf:overview` renders an 8-page A4 company overview to
`public/nevrest-labs-company-overview.pdf`. It imports the same `src/data/*` modules the
React pages render and reuses the tokens in `src/App.css`, so the document cannot drift from
the site copy — bump `site.lastModified` and the cover and back-cover dates follow.

`scripts/build-overview-pdf.mjs` composes one HTML file per sheet, then prints it with
headless Chrome (`--print-to-pdf`). There is no PDF library dependency. If ImageMagick is on
`PATH` it pre-scales the project covers before Chrome embeds them, which takes the file from
~4.8 MB to under 1 MB; without it the build still succeeds using the originals. The
intermediate HTML lands in `node_modules/.cache/nevrest-overview/`.

`_redirects` is validated at build time against Cloudflare's rules (one rule per line, 2–3 tokens,
relative target, numeric status). A malformed rule fails the build rather than the deploy.

### Bump `site.lastModified` in `src/data/site.js` when content changes — it feeds `sitemap.xml`.

### Routing notes

This deploys through **Workers Static Assets** (`wrangler deploy`), so `wrangler.jsonc` sets:

- `html_handling: "none"` — no automatic `/projects` → `/projects/` redirects, so canonical URLs stay clean. Consequence: Cloudflare stops resolving `/` to `index.html` on its own, so `_redirects` lists `/` explicitly like every other route
- `not_found_handling: "404-page"` — unknown URLs return a real **404** served from `public/404.html` instead of a soft 404. App routes stay reachable via the `_redirects` rewrites, which are generated from the same `routes` list as the sitemap.

Two things cannot be expressed in `_redirects`, because Cloudflare only allows relative targets there.
Both live in the Cloudflare zone config: **Always Use HTTPS** (SSL/TLS) and **www → apex**
(Redirect Rules). Confirm both are on after the next deploy.

### Static files under `public/`

- **`404.html`** — real 404 page, `noindex`
- **`.well-known/security.txt`** — RFC 9116 security contact
- **`manifest.webmanifest`** — PWA manifest (correct MIME type set in `_headers`)

### Known gaps

- **`dist/assets/index-*.js` is ~580 kB (194 kB gzipped)**, mostly `framer-motion` and `gsap`.
  Not fixed here: route-level `React.lazy` splitting would require the prerenderer to move from
  `renderToString` to `renderToPipeableStream` (so Suspense boundaries resolve before the HTML is
  written) and would put the static markup and the hydrated tree at risk of diverging. The
  prerender is worth more than the bundle split; revisit if Core Web Vitals become a problem.
- **Entrance animations start from `opacity: 0`.** If JavaScript fails to run, `gsap.from` never
  fires but the CSS default is visible, so content still shows — however if JS runs and the
  animation is interrupted the hero can be left transparent. Worth revisiting if you see it.

### Cloudflare zone config (not in the repo)

Must be set in the Cloudflare dashboard:

- **Always Use HTTPS** (SSL/TLS) — `http://nevrestlabs.com/` currently returns `200`, it should `301` to HTTPS
- **www → apex** — `www.nevrestlabs.com` has no DNS record at all, so it fails to resolve rather than redirecting