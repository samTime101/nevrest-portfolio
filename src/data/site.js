// Single source of truth for site-wide facts.
// Consumed by the UI, the runtime head manager (src/lib/seo.js) and the
// build-time generators (src/lib/seo-files.js), so the page copy, the
// structured data and llms.txt can never drift apart.

import { clients } from './clients.js'
import { projects } from './projects.js'

export const site = {
  name: 'Nevrest Labs',
  slogan: 'Software, with intent.',
  url: 'https://nevrestlabs.com',
  lang: 'en',
  locale: 'en_US',
  themeColor: '#101113',
  email: 'contact@nevrestlabs.com',
  logo: '/logo.png',
  // Open Graph wants a wide 1200x630 card; the square logo is the fallback until
  // a dedicated og-image lands in /public.
  shareImage: '/logo.png',
  description:
    'Nevrest Labs is a software company in Kathmandu, Nepal. We build web platforms, mobile apps, AI and machine learning systems, automation tools, backend APIs and custom software for businesses.',
  summary: 'Your new basecamp for reliable next-gen software and IT services, shipped directly from Kathmandu, Nepal.',
  keywords: [
    'Nevrest Labs',
    'software company Nepal',
    'technology company Nepal',
    'tech company in Nepal',
    'software development Kathmandu',
    'custom software development Nepal',
    'web development Nepal',
    'mobile app development Nepal',
    'product engineering Nepal',
    'AI development Nepal',
    'automation services Nepal',
  ],
  city: 'Kathmandu',
  country: 'Nepal',
  countryCode: 'NP',
  geoRegion: 'NP-KT',
  coordinates: '27.7172, 85.3240',
  timezone: 'Asia/Kathmandu',
  utcOffset: 'UTC+05:45',
  socials: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/company/143899606/' }],
  // Bumped whenever page content or structured data changes meaningfully.
  lastModified: '2026-10-03',
}

export const services = [
  { number: '01', title: 'Web development', text: 'Modern, responsive web applications designed to grow with the business.' },
  { number: '02', title: 'Mobile development', text: 'Thoughtful iOS and Android experiences with a product-first approach.' },
  { number: '03', title: 'AI & machine learning', text: 'Practical AI systems, LLM applications, intelligent workflows, and automation.' },
  { number: '04', title: 'Custom software', text: 'Business systems, dashboards, internal tools, and purpose-built applications.' },
  { number: '05', title: 'Backend & APIs', text: 'Secure APIs, databases, integrations, authentication, and scalable architecture.' },
  { number: '06', title: 'Automation', text: 'Connected workflows, AI agents, and process improvements that remove busywork.' },
  { number: '07', title: 'UI/UX & product design', text: 'Clear interfaces and product experiences shaped around the people using them.' },
  { number: '08', title: 'Cloud & DevOps', text: 'Deployment, CI/CD, monitoring, and dependable production infrastructure.' },
]

export const technologies = [
  ['Frontend', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  ['Backend', 'Node.js', 'Python', 'FastAPI', 'Flask'],
  ['Data', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase'],
  ['AI', 'OpenAI', 'Gemini', 'LangChain', 'Hugging Face', 'PyTorch'],
  ['Infrastructure', 'Docker', 'Linux', 'Nginx', 'Cloudflare', 'Vercel'],
]

export const industries = [
  'Education',
  'Healthcare',
  'FinTech',
  'E-Commerce',
  'SaaS',
  'Hospitality',
  'Real Estate',
  'Logistics',
  'Media',
  'Startups',
  'Professional services',
]

export const founders = [
  { initials: 'SA', name: 'Sayuz Acharya', role: 'Co-founder', linkedin: 'https://www.linkedin.com/in/sayuz-acharya-13453643b/' },
  { initials: 'SR', name: 'Samip Regmi', role: 'Co-founder', linkedin: 'https://www.linkedin.com/in/samip-regmi-670a76248' },
  { initials: 'DD', name: 'Diwas Dahal', role: 'Co-founder', linkedin: 'https://www.linkedin.com/in/diwas-dahal/' },
  { initials: 'SB', name: 'Sworup Bastola', role: 'Co-founder', linkedin: 'https://www.linkedin.com/in/swarup-bastola-357474398' },
]

export const faqs = [
  ['What kind of projects do you build?', 'We build web platforms, mobile applications, internal tools, custom software, AI-enabled products, and automation systems.'],
  ['Can you build custom AI solutions?', 'Yes. We can help identify a useful AI opportunity, design the right workflow, and build it into a reliable product or internal system.'],
  ['Do you work with startups?', 'Yes. We work with early-stage teams as well as established businesses, from product direction through production delivery.'],
  ['Can you work with an existing development team?', 'Absolutely. We can extend a team, take ownership of a defined product area, or provide focused technical and product support.'],
  ['How long does a typical project take?', 'The answer depends on scope and complexity. We define a practical delivery plan during discovery before committing to a timeline.'],
  ['Do you provide maintenance after launch?', "Yes. We can provide monitoring, ongoing improvements, technical support, and a plan for the product's next stage."],
  ['What technologies do you use?', 'We select tools around the product needs, with experience across modern web, mobile, backend, AI, data, and cloud technologies.'],
]

// Mirrors the three delivery models explained on /how-we-deliver.
export const deliveryModels = [
  { name: 'Staff augmentation', blurb: 'Our engineers join your team. You keep product ownership, task assignment and architecture.' },
  { name: 'Dedicated team', blurb: 'A stable team for your product, including reserved-capacity retainers.' },
  { name: 'Project-based', blurb: 'Defined scope, designed and delivered by us against agreed acceptance criteria.' },
]

export const pageTitles = {
  home: `${site.name} — Software Company in Kathmandu, Nepal`,
  projects: 'Projects & Case Studies',
  clients: 'Clients',
  delivery: 'How We Deliver',
}

export const pageDescriptions = {
  '/': site.description,
  '/projects':
    'Case studies from Nevrest Labs, a software company in Kathmandu, Nepal: live web and mobile products, AI and machine learning systems, automation tools and developer utilities we designed, built and shipped.',
  '/clients': 'The teams Nevrest Labs builds with in Nepal and beyond — digital agencies, production houses and software teams, with the kind of work we do for each of them.',
  '/how-we-deliver':
    'How Nevrest Labs delivers software work: four named leads, three delivery models (staff augmentation, dedicated team, project-based), one client contact, and straight answers on budget, timeline, ownership and risk.',
}

export function projectPath(slug) {
  return `/projects/${slug}`
}

export function publicProjects() {
  return projects.filter((project) => !project.hidden)
}

// Quoted facts for the visible "at a glance" block, llms.txt and structured data.
// Every value is derived from content already on the site — nothing invented.
export function fastFacts() {
  const shipped = publicProjects()
  const live = shipped.filter((project) => project.status === 'Live')

  return [
    { label: 'Company', value: `${site.name} — software company & product studio` },
    { label: 'Based in', value: `${site.city}, ${site.country} · ${site.utcOffset}` },
    { label: 'Co-founders', value: `${founders.length} — ${founders.map((founder) => founder.name).join(', ')}` },
    { label: 'Services', value: `${services.length} — ${services.map((service) => service.title).join(', ')}` },
    { label: 'Industries', value: `${industries.length} — ${industries.slice(0, 6).join(', ')} and more` },
    { label: 'Delivery models', value: `${deliveryModels.length} — ${deliveryModels.map((model) => model.name).join(', ')}` },
    { label: 'Products', value: `${shipped.length} documented (${live.length} live)` },
    { label: 'Clients', value: `${clients.length} — ${clients.map((client) => client.name).join(', ')}` },
    { label: 'Contact', value: site.email },
  ]
}