// Per-route head data: the one place that answers "what are this page's title,
// description, canonical, image and JSON-LD blocks?"
//
// Both consumers derive from here, so they cannot disagree:
//   - src/components/Seo.jsx at runtime, after hydration
//   - scripts/prerender.mjs at build time, for the HTML a crawler reads first
//
// Pure module — no DOM, no React — so the build can import it directly.

import { getProject } from '../data/projects.js'
import { faqGroups, faqs, pageDescriptions, pageTitles, site } from '../data/site.js'
import {
  breadcrumb,
  clientList,
  deliveryModelsNode,
  faqPage,
  projectList,
  softwareApplication,
  webPage,
} from './schema.js'

const shown = () => projectList()

/**
 * Resolve the head payload for a route.
 *
 * @param {string} path Route path, e.g. '/' or '/projects/omedate'.
 * @returns {{titleFull: string, description: string, path: string, image?: string,
 *   type: string, noindex: boolean, jsonLd: Array<{key: string, data: object}>}|null}
 *   `null` for paths that are not indexable routes.
 */
export function routeHead(path) {
  if (path === '/') {
    return {
      titleFull: pageTitles.home,
      description: pageDescriptions['/'],
      path,
      type: 'website',
      noindex: false,
      jsonLd: [
        { key: 'webpage', data: webPage({ path: '/', name: pageTitles.home, description: pageDescriptions['/'] }) },
        { key: 'breadcrumb', data: breadcrumb([{ name: 'Home', path: '/' }]) },
        { key: 'faq', data: faqPage(faqs) },
        { key: 'itemlist', data: shown() },
      ],
    }
  }

  if (path === '/projects') {
    return {
      titleFull: `${pageTitles.projects} — ${site.name}`,
      description: pageDescriptions['/projects'],
      path,
      type: 'website',
      noindex: false,
      jsonLd: [
        {
          key: 'webpage',
          data: webPage({
            path,
            name: pageTitles.projects,
            description: pageDescriptions['/projects'],
            type: 'CollectionPage',
          }),
        },
        { key: 'breadcrumb', data: breadcrumb([{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }]) },
        { key: 'itemlist', data: shown() },
      ],
    }
  }

  if (path === '/clients') {
    return {
      titleFull: `${pageTitles.clients} — ${site.name}`,
      description: pageDescriptions['/clients'],
      path,
      type: 'website',
      noindex: false,
      jsonLd: [
        {
          key: 'webpage',
          data: webPage({
            path,
            name: pageTitles.clients,
            description: pageDescriptions['/clients'],
            type: 'CollectionPage',
          }),
        },
        { key: 'breadcrumb', data: breadcrumb([{ name: 'Home', path: '/' }, { name: 'Clients', path: '/clients' }]) },
        { key: 'clients', data: clientList() },
      ],
    }
  }

  if (path === '/how-we-deliver') {
    return {
      titleFull: `${pageTitles.delivery} — ${site.name}`,
      description: pageDescriptions['/how-we-deliver'],
      path,
      type: 'website',
      noindex: false,
      jsonLd: [
        {
          key: 'webpage',
          data: webPage({ path, name: pageTitles.delivery, description: pageDescriptions['/how-we-deliver'] }),
        },
        {
          key: 'breadcrumb',
          data: breadcrumb([{ name: 'Home', path: '/' }, { name: 'How we deliver', path: '/how-we-deliver' }]),
        },
        { key: 'models', data: deliveryModelsNode() },
        { key: 'faq', data: faqPage(faqGroups.flatMap((group) => group.items)) },
      ],
    }
  }

  const detail = /^\/projects\/([a-z0-9-]+)$/.exec(path)
  if (detail) {
    const project = getProject(detail[1])
    // Hidden projects still render (linked from nowhere), but must stay out of the index.
    if (!project) return null

    return {
      titleFull: `${project.title} — ${site.name}`,
      description: project.short,
      path: `/projects/${project.slug}`,
      image: project.cover,
      type: 'article',
      noindex: Boolean(project.hidden),
      jsonLd: [
        {
          key: 'webpage',
          data: webPage({
            path: `/projects/${project.slug}`,
            name: project.title,
            description: project.description,
            type: 'Article',
          }),
        },
        {
          key: 'breadcrumb',
          data: breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        },
        { key: 'app', data: softwareApplication(project) },
      ],
    }
  }

  return null
}