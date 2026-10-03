import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Arrow, Mark, Nav } from '../components/SiteChrome.jsx'
import { ArtCover } from '../components/Shots.jsx'
import { ClientCard } from '../components/ClientCard.jsx'
import Seo from '../components/Seo.jsx'
import { breadcrumb, faqPage, projectList, webPage } from '../lib/schema.js'
import { faqs, fastFacts, founders, industries, pageDescriptions, pageTitles, services, site, technologies } from '../data/site.js'
import { clients } from '../data/clients.js'
import { projects } from '../data/projects.js'

gsap.registerPlugin(ScrollTrigger)

const facts = fastFacts()

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0)
  const pageRef = useRef(null)

  const jsonLd = useMemo(
    () => [
      { key: 'webpage', data: webPage({ path: '/', name: pageTitles.home, description: pageDescriptions['/'] }) },
      { key: 'breadcrumb', data: breadcrumb([{ name: 'Home', path: '/' }]) },
      { key: 'faq', data: faqPage(faqs) },
      { key: 'itemlist', data: projectList() },
    ],
    [],
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } })
      entrance
        .from('.nav', { y: -20, opacity: 0, duration: 0.7 })
        .from('.eyebrow', { y: 24, opacity: 0, duration: 0.7 }, '-=.35')
        .from('h1', { y: 45, opacity: 0, duration: 1.1 }, '-=.4')
        .from('.hero-bottom', { y: 25, opacity: 0, duration: 0.8 }, '-=.55')
        .from('.hero-stack', { scale: 0.8, opacity: 0, duration: 1.1 }, '-=.85')
      gsap.utils
        .toArray('.statement-grid, .section-heading, .service, .tech-row, .project-card, .team-member, .faq-item, .contact-inner')
        .forEach((element) =>
          gsap.from(element, {
            y: 45,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 84%', once: true },
          }),
        )
    }, pageRef)
    return () => context.revert()
  }, [])

  return (
    <div ref={pageRef}>
      <Seo titleFull={pageTitles.home} description={pageDescriptions['/']} path="/" jsonLd={jsonLd} />
      <section className="hero" id="top">
        <Nav />
        <div className="hero-content shell">
          <div className="eyebrow">
            <span className="status-dot" /> Kathmandu, Nepal <span className="eyebrow-line" /> Building digital products that matter
          </div>
          <h1>
            Build what
            <br />
            <span>moves people</span>
            <strong>.</strong>
          </h1>
          <div className="hero-bottom">
            <p className="hero-intro">
              From web and mobile applications to AI systems, automation, and custom software — we turn meaningful ideas into reliable
              digital products.
            </p>
            <Link className="circle-link" to="/#contact" aria-label="Start a project">
              <Arrow />
            </Link>
          </div>
        </div>
        <div className="hero-stack" aria-label="Our core capabilities">
          <span>WEB</span>
          <span>AI</span>
          <span>PRODUCT</span>
          <span>SYSTEMS</span>
        </div>
        <div className="hero-note">
          N / 01
          <br />
          <span>Ideas to impact</span>
        </div>
      </section>

      <section className="proof">
        <div className="shell proof-grid">
          <p className="section-label">Built with intent</p>
          <div>
            <strong>Web</strong>
            <span>Platforms & products</span>
          </div>
          <div>
            <strong>Mobile</strong>
            <span>Native-feeling experiences</span>
          </div>
          <div>
            <strong>AI</strong>
            <span>Useful intelligence</span>
          </div>
          <div>
            <strong>Systems</strong>
            <span>Built to scale</span>
          </div>
        </div>
      </section>

      <section className="statement" id="about">
        <div className="shell statement-grid">
          <p className="section-label">Who we are</p>
          <div>
            <h2>
              Technology, strategy &<br />
              <span>execution — together.</span>
            </h2>
            <p className="body-copy">
              Nevrest Labs is a technology-focused company helping businesses turn ideas into reliable digital products. We pair
              engineering discipline with user-focused design so the things we build are useful today and maintainable tomorrow.
            </p>
            <p className="body-copy facts-lead">{site.summary}</p>
            <div className="principle-list">
              <span>Engineering-first approach</span>
              <span>Modern technology</span>
              <span>Practical AI integration</span>
              <span>Scalable architecture</span>
              <span>User-focused design</span>
            </div>
            <dl className="facts" id="facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="signal signal--lime">
            N<span>↗</span>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">What we build</p>
            <p className="heading-aside">Small team. Serious range.</p>
          </div>
          <h2 className="section-title">
            Software built for
            <br />
            <span>real businesses.</span>
          </h2>
          <div className="service-list">
            {services.map((service) => (
              <motion.article
                className="service"
                key={service.number}
                whileHover={{ x: 8, backgroundColor: 'rgba(213,246,106,.06)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <Link className="service-arrow" to="/#contact" aria-label={`Explore ${service.title}`}>
                  <Arrow />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="tech">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Our toolkit</p>
            <p className="heading-aside">Chosen for the job, not the trend.</p>
          </div>
          <h2 className="tech-title">
            Built with modern
            <br />
            <span>technology.</span>
          </h2>
          <div className="tech-list">
            {technologies.map(([group, ...items]) => (
              <div className="tech-row" key={group}>
                <p>{group}</p>
                <div>
                  {items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects" id="projects">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Selected work</p>
            <p className="heading-aside">Live products & work in progress.</p>
          </div>
          <h2 className="section-title">
            Things we&apos;re
            <br />
            <span>building.</span>
          </h2>
          <div className="project-grid">
            {projects
              .filter((project) => !project.hidden)
              .map((project) => (
              <article className="project-card" key={project.title}>
                <div className={`project-art project-art--${project.slug === 'nepse-terminal' ? 'nepse' : project.slug}`} aria-hidden="true">
                  <ArtCover src={project.cover} alt={`${project.title} screenshot`}>
                    <i />
                    <b />
                    <em />
                    {project.slug === 'onecompiler' && <code>{'>_'} run</code>}
                  </ArtCover>
                </div>
                <p className="project-kicker">{project.kicker}</p>
                <h3>{project.title}</h3>
                <p>{project.short}</p>
                <div className="project-tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link className="text-link" to={`/projects/${project.slug}`}>
                  View case study <Arrow />
                </Link>
              </article>
            ))}
          </div>
          <div className="home-projects-cta">
            <Link className="text-link text-link--big" to="/projects">
              Explore all work <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="industries">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Where we help</p>
            <p className="heading-aside">Technology that adapts to the problem.</p>
          </div>
          <h2>
            Technology for different
            <br />
            <span>industries.</span>
          </h2>
          <div className="industry-list">
            {industries.map((industry) => (
              <span key={industry}>{industry}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="team" id="founders">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Founders</p>
            <p className="heading-aside">Small, hands-on, and focused.</p>
          </div>
          <div className="team-grid">
            {founders.map((member) => (
              <article className="team-member" key={member.name}>
                <div className="portrait">
                  <span>{member.initials}</span>
                </div>
                <h3>{member.name}</h3>
                <p>
                  {member.role} / Nevrest Labs
                </p>
                {member.linkedin && (
                  <a className="text-link" href={member.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn <Arrow />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="clients-home" id="clients">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Clients</p>
            <p className="heading-aside">Good company, good work.</p>
          </div>
          <h2 className="section-title">
            Teams we<br />
            <span>build with.</span>
          </h2>
          <div className="client-grid">
            {clients.map((client) => (
              <ClientCard key={client.slug} client={client} />
            ))}
          </div>
          <div className="home-projects-cta">
            <Link className="text-link text-link--big" to="/clients">
              Meet all clients <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="shell testimonial-inner">
          <p className="section-label">What our clients say</p>
          <h2>
            Built on work
            <br />
            <span>we can stand behind.</span>
          </h2>
          <p className="body-copy">
            Client testimonials will live here once we have permission to share them. Until then, we prefer to let a thoughtful
            conversation and the work itself do the talking.
          </p>
        </div>
      </section>

      <section className="faq">
        <div className="shell faq-grid">
          <div>
            <p className="section-label">Questions, answered</p>
            <h2>
              Before we
              <br />
              <span>get started.</span>
            </h2>
          </div>
          <div>
            {faqs.map(([question, answer], index) => (
              <article className={`faq-item ${openFaq === index ? 'faq-item--open' : ''}`} key={question}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  <span>{question}</span>
                  <b>{openFaq === index ? '−' : '+'}</b>
                </button>
                <div>
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact-inner">
          <div className="contact-copy">
            <p className="section-label">Have an idea?</p>
            <h2>
              Let&apos;s build
              <br />
              <span>something useful.</span>
            </h2>
            <p>Tell us what you&apos;re trying to build and we&apos;ll help turn the idea into a real product.</p>
            <a className="contact-link" href="mailto:contact@nevrestlabs.com">
              contact@nevrestlabs.com <Arrow />
            </a>
          </div>
          <div className="contact-aside">
            <p>Start with the problem, the opportunity, or the beginning of an idea.</p>
            <a className="circle-link" href="mailto:contact@nevrestlabs.com" aria-label="Email Nevrest Labs">
              <Arrow />
            </a>
          </div>
          <div className="contact-mark">
            <Mark />
          </div>
        </div>
      </section>
    </div>
  )
}
