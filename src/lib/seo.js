// Runtime head manager. Sets title, meta, canonical and Open Graph / Twitter tags
// per route, and owns the JSON-LD blocks tagged with data-seo="<key>" — including
// the ones the build injects into index.html, so a route never declares content it
// does not show. Untagged blocks (the site entity graph) are left alone.

import { site } from '../data/site.js'
import { absolute } from './schema.js'

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
  const wanted = new Set(blocks.map((block) => block.key))

  document.head.querySelectorAll(`script[${MANAGED}]`).forEach((element) => {
    if (!wanted.has(element.getAttribute(MANAGED))) element.remove()
  })

  blocks.forEach(({ key, data }) => {
    const json = JSON.stringify(data)
    let element = document.head.querySelector(`script[${MANAGED}="${key}"]`)

    if (!element) {
      element = document.createElement('script')
      element.type = 'application/ld+json'
      element.setAttribute(MANAGED, key)
      document.head.appendChild(element)
    }
    if (element.textContent !== json) element.textContent = json
  })
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