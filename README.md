# Nevrest Labs

Marketing site for Nevrest Labs, a software company in Kathmandu, Nepal. React + Vite SPA, deployed to Cloudflare Pages.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with the GEO plugin active (`/llms.txt` and `/sitemap.xml` are served locally too) |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve `dist/` locally |
| `npm run pdf:overview` | Rebuild `public/nevrest-labs-company-overview.pdf` from the site data |
| `npm run cf:deploy` | Build, then deploy to Cloudflare Pages |

## SEO & GEO

Structured data, metadata and the machine-readable files are **generated at build time from
`src/data/site.js`**. Page copy, JSON-LD and `llms.txt` all read from that one module, so they cannot drift apart.

| File | Role |
| --- | --- |
| `src/data/site.js` | Single source of truth: identity, services, technologies, industries, founders, FAQs, page titles/descriptions, derived "fast facts" |
| `src/lib/schema.js` | Pure JSON-LD builders — entity graph, FAQPage, BreadcrumbList, ItemList, SoftwareApplication |
| `src/lib/seo-files.js` | Build-time generators: head tags, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `_headers`, `_redirects` |
| `src/lib/seo.js` | Runtime `<head>` manager: per-route title/meta/canonical/OG and page-scoped JSON-LD |
| `src/components/Seo.jsx` | Declarative wrapper used by each page |

### Generated at build time

- **Head block + JSON-LD** — injected into `index.html` via the `geoPlugin` in `vite.config.js`
- **`<noscript>` fallback** — a full plain-HTML outline of the site (764 words, question headings, 11 internal links), generated
  from the same data modules as the React pages. This is what a visitor or crawler without JavaScript receives
- **`/sitemap.xml`** — every route, derived from `src/lib/seo-files.js` `routes`
- **`/llms.txt`** and **`/llms-full.txt`** — plain-text site summaries for AI assistants
- **`/_headers`** — HSTS, CSP, `Contact:`, cache policy. CSP `script-src` uses SHA-256 hashes of the JSON-LD blocks this build emits, so no `'unsafe-inline'` is needed
- **`/_redirects`** — a 200 rewrite to the SPA shell for each known route

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

### Known gap

The app is client-side rendered. The `<noscript>` fallback covers crawlers that do not execute JavaScript, but it is a
summary — the hydrated page is still the "real" content. Prerendering would serve the fully rendered HTML per route
and remove the duplication entirely.

### Cloudflare zone config (not in the repo)

Must be set in the Cloudflare dashboard:

- **Always Use HTTPS** (SSL/TLS) — `http://nevrestlabs.com/` currently returns `200`, it should `301` to HTTPS
- **www → apex** — `www.nevrestlabs.com` has no DNS record at all, so it fails to resolve rather than redirecting