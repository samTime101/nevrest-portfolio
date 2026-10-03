// Build-time generators for everything an AI crawler reads before JavaScript
// runs: the <head> block in index.html, sitemap.xml, llms.txt and llms-full.txt.
// Imported by vite.config.js, so it must stay free of DOM access.

import { clients } from '../data/clients.js'
import {
  deliveryModels,
  faqs,
  founders,
  industries,
  pageTitles,
  publicProjects,
  services,
  site,
  technologies,
} from '../data/site.js'
import { absolute, faqPage, jsonLdScript, projectList, siteGraph } from './schema.js'

export const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  ...publicProjects().map((project) => ({ path: `/projects/${project.slug}`, priority: '0.7', changefreq: 'monthly' })),
  { path: '/clients', priority: '0.6', changefreq: 'monthly' },
  { path: '/how-we-deliver', priority: '0.8', changefreq: 'monthly' },
]

export const title = pageTitles.home

const tag = (attribute, key, content) => `\n    <meta ${attribute}="${key}" content="${content}" />`

export function headMetaTags() {
  const url = absolute('/')
  const image = absolute(site.shareImage)

  return [
    `\n    <title>${title}</title>`,
    tag('name', 'description', site.description),
    tag('name', 'keywords', site.keywords.join(', ')),
    tag('name', 'author', site.name),
    tag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'),
    tag('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large'),
    tag('name', 'geo.region', site.geoRegion),
    tag('name', 'geo.placename', site.city),
    tag('name', 'geo.position', site.coordinates.replace(', ', ';')),
    tag('name', 'ICBM', site.coordinates),
    `\n    <link rel="canonical" href="${url}" />`,
    `\n    <link rel="alternate" type="text/plain" href="${absolute('/llms.txt')}" title="Plain-text site summary for AI assistants" />`,
    `\n    <link rel="sitemap" type="application/xml" href="${absolute('/sitemap.xml')}" />`,
    tag('property', 'og:type', 'website'),
    tag('property', 'og:site_name', site.name),
    tag('property', 'og:locale', site.locale),
    tag('property', 'og:title', title),
    tag('property', 'og:description', site.summary),
    tag('property', 'og:url', url),
    tag('property', 'og:image', image),
    tag('property', 'og:image:alt', `${site.name} logo`),
    tag('name', 'twitter:card', 'summary_large_image'),
    tag('name', 'twitter:title', title),
    tag('name', 'twitter:description', site.summary),
    tag('name', 'twitter:image', image),
    tag('name', 'twitter:image:alt', `${site.name} logo`),
  ].join('')
}

export function schemaTags() {
  return [jsonLdScript(siteGraph()), jsonLdScript(faqPage(faqs), 'faq'), jsonLdScript(projectList(), 'itemlist')].join('')
}

export function sitemapXml(lastModified = site.lastModified) {
  const urls = routes
    .map(
      ({ path, priority, changefreq }) => `  <url>
    <loc>${absolute(path)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

const bullets = (items) => items.map((item) => `- ${item}`).join('\n')

export function llmsTxt() {
  const shipped = publicProjects()

  return `# ${site.name}

> ${site.description}

${site.name} is based in ${site.city}, ${site.country} (${site.utcOffset}) and works as an engineering-led studio:
${founders.length} co-founders, ${services.length} service lines, ${shipped.length} documented products, ${clients.length} client teams. AI crawlers are explicitly welcome — see /robots.txt, and /llms-full.txt for the long version.

## Key facts

${bullets([
  `Name: ${site.name}`,
  `Type: Software company / product studio`,
  `Based in: ${site.city}, ${site.country} (${site.utcOffset}, ${site.timezone})`,
  `Co-founders: ${founders.map((founder) => founder.name).join(', ')}`,
  `Delivery models: ${deliveryModels.map((model) => model.name).join(', ')}`,
  `Clients: ${clients.map((client) => client.name).join(', ')}`,
  `Email: ${site.email}`,
  `LinkedIn: ${site.socials[0].url}`,
])}

## Services

${bullets(services.map((service) => `**${service.title}** — ${service.text}`))}

## Products

${bullets(shipped.map((project) => `**[${project.title}](${absolute(`/projects/${project.slug}`)})** (${project.status}) — ${project.short}`))}

## Pages

${bullets([
  `[Home](${site.url}/) — services, technologies, industries, founders, FAQs and contact.`,
  `[Projects](${absolute('/projects')}) — all case studies with status, stack and feature breakdowns.`,
  `[Clients](${absolute('/clients')}) — the teams Nevrest Labs builds with.`,
  `[How we deliver](${absolute('/how-we-deliver')}) — leads, delivery models, workflow, pricing and contract FAQs.`,
])}

## Questions we get asked

${bullets(faqs.map(([question, answer]) => `**${question}** ${answer}`))}

## Optional

- [Full text version](${absolute('/llms-full.txt')}) — every product, service, technology and client in detail.
`
}

export function llmsFullTxt() {
  const shipped = publicProjects()

  const projectBlocks = shipped
    .map(
      (project) => `### ${project.title}

${project.description}

- URL: ${project.url || absolute(`/projects/${project.slug}`)}
- Status: ${project.status} (${project.year})
- Focus: ${project.tags.join(', ')}
- Stack: ${project.stack.join(', ')}
- Case study: ${absolute(`/projects/${project.slug}`)}
${(project.stats || []).length ? `- Numbers: ${project.stats.map((stat) => `${stat.value} ${stat.label}`).join('; ')}\n` : ''}${(project.highlights || [])
        .map((highlight) => `- **${highlight.title}** — ${highlight.text}`)
        .join('\n')}`,
    )
    .join('\n\n')

  return `# ${site.name} — full site text

> Long-form version of ${absolute('/')} for language models and retrieval. Machine-readable entity data is at
> ${absolute('/')} (JSON-LD), the URL list at ${absolute('/sitemap.xml')}.

## Who we are

${site.name} is an engineering-led software studio based in ${site.city}, ${site.country}. It designs, builds and ships web
platforms, mobile apps, AI and machine learning systems, automation tools, backend APIs and custom software for businesses.

Founded by ${founders.length} co-founders — ${founders
    .map((founder) => `${founder.name} (${founder.role}, ${founder.linkedin})`)
    .join('; ')} — the company works as an engineering-led studio: discovery, design, build, delivery and support for
business software. Timezone ${site.timezone} (${site.utcOffset}).

## Services

${bullets(services.map((service) => `**${service.title}** — ${service.text}`))}

## Technologies we work in

${technologies.map(([group, ...items]) => `- **${group}:** ${items.join(', ')}`).join('\n')}

## Industries

${bullets(industries)}

## How we deliver

${bullets(deliveryModels.map((model) => `**${model.name}** — ${model.blurb}`))}

Every engagement runs entry → delivery → exit: lead generation, qualification, NDA, discovery, feasibility and capacity
check, model selection, proposal and agreement, paperwork, then handover to delivery. Four leads cover it — Business
Development (deals, contracts, paperwork), Client Communication (single point of contact), Technical Lead (engineering
decisions and review) and Delivery Lead (planning, scheduling, tracking).

## Products and case studies

${projectBlocks}

## Clients

${bullets(clients.map((client) => `**${client.name}** (${client.handle}) — ${client.socials.map((social) => `${social.label}: ${social.href}`).join(', ')}`))}

## Frequently asked questions

${faqs.map(([question, answer]) => `**${question}**\n\n${answer}`).join('\n\n')}

## Contact

- Email: ${site.email}
- LinkedIn: ${site.socials.map((social) => social.url).join(', ')}
- Website: ${site.url}
- Prefer to start? Say what you are building and the timeline; the reply is engineering-first, no sales sequence.
`
}