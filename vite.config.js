import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {
  headMetaTags,
  llmsFullTxt,
  llmsTxt,
  noscriptFallback,
  redirectsFile,
  schemaTags,
  securityHeaders,
  sitemapXml,
} from './src/lib/seo-files.js'

/**
 * GEO + hosting layer. Everything a crawler, a language model or a security
 * scanner needs is generated at build time from src/data/site.js: the head block,
 * JSON-LD, sitemap.xml, llms.txt, llms-full.txt, Cloudflare Pages `_headers` and
 * `_redirects`. Nothing here can drift out of sync with the site content.
 */
function geoPlugin() {
  const files = {
    '/sitemap.xml': [sitemapXml(), 'application/xml'],
    '/llms.txt': [llmsTxt(), 'text/plain'],
    '/llms-full.txt': [llmsFullTxt(), 'text/plain'],
  }

  return {
    name: 'nevrest-geo',

    transformIndexHtml(html) {
      return html
        .replace('<!--geo:meta-->', headMetaTags())
        .replace('<!--geo:schema-->', schemaTags())
        .replace('<!--geo:noscript-->', noscriptFallback())
    },

    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: files['/sitemap.xml'][0] })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: files['/llms.txt'][0] })
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: files['/llms-full.txt'][0] })
      this.emitFile({ type: 'asset', fileName: '_headers', source: securityHeaders() })
      this.emitFile({ type: 'asset', fileName: '_redirects', source: redirectsFile() })
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').split('?')[0]
        const file = files[path]
        if (!file) return next()
        res.setHeader('Content-Type', `${file[1]}; charset=utf-8`)
        res.end(file[0])
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), geoPlugin()],
})