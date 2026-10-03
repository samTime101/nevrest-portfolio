import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { headMetaTags, llmsFullTxt, llmsTxt, schemaTags, sitemapXml } from './src/lib/seo-files.js'

/**
 * GEO layer: everything a crawler or language model needs before JavaScript runs
 * is generated at build time from src/data/site.js — the head block, JSON-LD,
 * sitemap.xml, llms.txt and llms-full.txt.
 */
function geoPlugin() {
  const sitemap = sitemapXml()
  const files = {
    '/sitemap.xml': [sitemap, 'application/xml'],
    '/llms.txt': [llmsTxt(), 'text/plain'],
    '/llms-full.txt': [llmsFullTxt(), 'text/plain'],
  }

  return {
    name: 'nevrest-geo',

    transformIndexHtml(html) {
      return html.replace('<!--geo:meta-->', headMetaTags()).replace('<!--geo:schema-->', schemaTags())
    },

    generateBundle() {
      Object.entries(files).forEach(([fileName, [source]]) => {
        this.emitFile({ type: 'asset', fileName: fileName.slice(1), source })
      })
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