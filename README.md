# Nevrest Labs

Marketing site for Nevrest Labs, a software company in Kathmandu, Nepal. React + Vite SPA, deployed to Cloudflare Pages.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with the GEO plugin active (`/llms.txt` and `/sitemap.xml` are served locally too) |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve `dist/` locally |
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
- **`/sitemap.xml`** — every route, derived from `src/lib/seo-files.js` `routes`
- **`/llms.txt`** and **`/llms-full.txt`** — plain-text site summaries for AI assistants
- **`/_headers`** — HSTS, CSP, `Contact:`, cache policy. CSP `script-src` uses SHA-256 hashes of the JSON-LD blocks this build emits, so no `'unsafe-inline'` is needed
- **`/_redirects`** — canonical host pinning, plus a 200 rewrite to the SPA shell for each known route

### Bump `site.lastModified` in `src/data/site.js` when content changes — it feeds `sitemap.xml`.

### Routing notes

`wrangler.jsonc` sets `not_found_handling: "none"` so unknown URLs return a real **404** (served from
`public/404.html`) instead of a soft 404. App routes stay reachable via the `_redirects` rewrites above, which
are generated from the same `routes` list.

Two things live in the Cloudflare dashboard, not in the repo: **Always Use HTTPS** and **www → apex**
canonicalisation. Confirm both are on after the next deploy.

### Known gap

The app is client-side rendered, so crawlers that do not execute JavaScript receive an empty
`<div id="root">`. Structured data, meta tags and `llms.txt` are all in place, but word count, heading
structure and static links are only visible after hydration. Prerendering would close that gap.