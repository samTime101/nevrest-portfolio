// Runtime head manager. Sets title, meta, canonical and Open Graph / Twitter tags
// per route, and owns the page's JSON-LD graph tagged data-seo="graph" — the same
// block the build writes, so a client-side navigation replaces it in place rather
// than leaving the previous route's structured data behind.

import { site } from '../data/site.js'
import { absolute, pageGraph } from './schema.js'

const MANAGED = 'data-seo'

function setMeta(attribute, key, content) {
  if (!content) return
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  if (element.getAttribute('content') !== content) element.setAttribute('content', content)
}

function setLink(rel, href, attributes = {}) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  if (element.getAttribute('href') !== href) element.setAttribute('href', href)
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
}

function syncJsonLd(blocks) {
  const json = JSON.stringify(pageGraph(blocks.map(({ data }) => data)))
  let element = document.head.querySelector(`script[${MANAGED}="graph"]`)

  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.setAttribute(MANAGED, 'graph')
    document.head.appendChild(element)
  }

  if (element.textContent !== json) element.textContent = json
}

export function applySeo({ title, titleFull, description, path, image, type = 'website', noindex = false, jsonLd = [] }) {
  if (typeof document === 'undefined') return

  const fullTitle = titleFull || (title ? `${title} — ${site.name}` : site.name)
  const url = absolute(path)
  const shareImage = absolute(image || site.shareImage)

  if (document.title !== fullTitle) document.title = fullTitle

  setMeta('name', 'description', description)
  setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
  setLink('canonical', url)

  setMeta('property', 'og:title', fullTitle)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:type', type)
  setMeta('property', 'og:image', shareImage)
  setMeta('property', 'og:image:alt', `${site.name} — ${title || site.name}`)
  setMeta('name', 'twitter:title', fullTitle)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', shareImage)

  syncJsonLd(jsonLd)
}