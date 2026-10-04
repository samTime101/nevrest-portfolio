// Pure JSON-LD builders. No DOM access, so this module is safe to import from
// both the browser bundle and vite.config.js (build-time index.html injection).

import { clients } from '../data/clients.js'
import { projects } from '../data/projects.js'
import { deliveryModels, founders, services, site, technologies } from '../data/site.js'

export const ORG_ID = `${site.url}/#organization`
export const WEBSITE_ID = `${site.url}/#website`

export function absolute(path = '/') {
  if (!path) return site.url
  if (/^https?:\/\//.test(path)) return path
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}

const founderId = (founder) => `${site.url}/#founder-${founder.name.toLowerCase().replace(/\s+/g, '-')}`

export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    alternateName: 'Nevrest',
    url: site.url,
    logo: absolute(site.logo),
    image: absolute(site.logo),
    description: site.description,
    slogan: site.slogan,
    email: site.email,
    foundingLocation: { '@type': 'Place', name: `${site.city}, ${site.country}` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressCountry: site.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: Number(site.coordinates.split(',')[0].trim()),
      longitude: Number(site.coordinates.split(',')[1].trim()),
    },
    areaServed: { '@type': 'Country', name: site.country },
    availableLanguage: ['en'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      areaServed: 'Worldwide',
      availableLanguage: ['en'],
    },
    founder: founders.map((founder) => ({ '@id': founderId(founder) })),
    founderOf: { '@id': ORG_ID },
    employee: founders.map((founder) => ({ '@id': founderId(founder) })),
    memberOf: [{ '@type': 'Organization', name: 'Software company in Kathmandu, Nepal' }],
    sameAs: site.socials.map((social) => social.url),
    knowsAbout: [...services.map((service) => service.title), ...technologies.flatMap(([, ...items]) => items)],
    makesOffer: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service.title, description: service.text },
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${site.name} services`,
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: { '@type': 'Service', name: service.title, description: service.text },
      })),
    },
    subjectOf: { '@id': `${site.url}/#website` },
  }
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: site.lang,
    publisher: { '@id': ORG_ID },
    alternateName: 'Nevrest Labs software company Nepal',
  }
}

export function person(founder) {
  return {
    '@type': 'Person',
    '@id': founderId(founder),
    name: founder.name,
    jobTitle: founder.role,
    description: `${founder.name} is a ${founder.role.toLowerCase()} at ${site.name}, a software company in ${site.city}, ${site.country}.`,
    url: founder.linkedin,
    sameAs: founder.linkedin ? [founder.linkedin] : [],
    worksFor: { '@id': ORG_ID },
    knowsAbout: services.map((service) => service.title),
  }
}

export function people() {
  return founders.map(person)
}

export function faqPage(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function breadcrumb(trail) {
  const path = trail[trail.length - 1]?.path ?? '/'
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absolute(path)}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  }
}

export function webPage({ path, name, description, type = 'WebPage' }) {
  return {
    '@type': type,
    '@id': `${absolute(path)}#webpage`,
    url: absolute(path),
    name,
    description,
    inLanguage: site.lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: absolute(site.shareImage) },
    breadcrumb: { '@id': `${absolute(path)}#breadcrumb` },
  }
}

export function projectList(list = projects.filter((project) => !project.hidden)) {
  return {
    '@type': 'ItemList',
    '@id': `${site.url}/#project-list`,
    name: 'Products and projects built by Nevrest Labs',
    numberOfItems: list.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: list.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: absolute(`/projects/${project.slug}`),
    })),
  }
}

export function softwareApplication(project) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${site.url}/projects/${project.slug}#app`,
    name: project.title,
    description: project.description,
    url: project.url || absolute(`/projects/${project.slug}`),
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    author: { '@id': ORG_ID },
    creator: { '@id': ORG_ID },
    keywords: project.tags.join(', '),
    featureList: (project.highlights || []).map((highlight) => highlight.title),
    screenshot: project.cover ? absolute(project.cover) : undefined,
    inLanguage: site.lang,
  }
}

export function clientList() {
  return {
    '@type': 'ItemList',
    '@id': `${site.url}/clients#client-list`,
    name: 'Clients of Nevrest Labs',
    numberOfItems: clients.length,
    itemListElement: clients.map((client, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: client.name,
        url: client.socials.find((social) => social.label === 'Website')?.href,
        sameAs: client.socials.map((social) => social.href),
      },
    })),
  }
}

export function deliveryModelsNode() {
  return {
    '@type': 'ItemList',
    '@id': `${site.url}/how-we-deliver#delivery-models`,
    name: 'Nevrest Labs delivery models',
    numberOfItems: deliveryModels.length,
    itemListElement: deliveryModels.map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: model.name,
        description: model.blurb,
        provider: { '@id': ORG_ID },
      },
    })),
  }
}

// Entity graph injected into index.html at build time. Site-level entities only —
// page-specific nodes (WebPage, BreadcrumbList, FAQPage, ItemList) are managed at
// runtime by src/lib/seo.js so each route only ever declares its own content.
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organization(), website(), ...people()],
  }
}

/**
 * Every node for one page as a single @graph: the site-level entities plus the
 * route's own nodes.
 *
 * One graph per page rather than a separate inline <script> per node, because
 * Cloudflare discards any `_headers` line longer than 2000 characters. With one
 * script per node this build needed 32 CSP hashes and the whole policy was
 * silently dropped; one graph per route needs 10 and leaves room to grow.
 */
export function pageGraph(nodes = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [...siteGraph()['@graph'], ...nodes],
  }
}

export function jsonLdScript(data, key) {
  const attribute = key ? ` data-seo="${key}"` : ''
  return `<script type="application/ld+json"${attribute}>${JSON.stringify(data)}</script>`
}