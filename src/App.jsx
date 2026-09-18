import './App.css'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './assets/logo.png'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { number: '01', title: 'Product engineering', text: 'Web platforms and mobile products built around your users, goals, and technical requirements.' },
  { number: '02', title: 'Digital systems', text: 'Clear, connected software that turns complex operations into simple, useful action.' },
  { number: '03', title: 'Technology strategy', text: 'A practical technical path from your idea to a durable product your business can grow with.' },
]

const process = [
  { number: '01', title: 'Listen', text: 'You tell us what you are trying to solve, who it is for, and what success should look like.' },
  { number: '02', title: 'Plan', text: 'We shape the scope, priorities, technical direction, timeline, and next practical step.' },
  { number: '03', title: 'Design', text: 'We turn the idea into clear user flows, interfaces, and an experience people can understand.' },
  { number: '04', title: 'Build', text: 'Our team develops, tests, and refines the software with regular communication throughout.' },
  { number: '05', title: 'Launch', text: 'We help get the product into the hands of real users and make the transition smooth.' },
  { number: '06', title: 'Improve', text: 'We keep learning from the product and help you decide what to build next.' },
]

const founders = [
  { initials: 'SB', name: 'Sworup Bastola', linkedin: 'https://www.linkedin.com/in/swarup-bastola-357474398' },
  { initials: 'SR', name: 'Samip Regmi', linkedin: 'https://www.linkedin.com/in/samip-regmi-670a76248' },
  { initials: 'DD', name: 'Diwas Dahal', linkedin: 'https://www.linkedin.com/in/diwas-dahal/' },
  { initials: 'SA', name: 'Sayuz Acharya' },
]

function Mark({ small = false }) {
  return <span className={`brand-mark ${small ? 'brand-mark--small' : ''}`} aria-hidden="true"><i /><b /><em /></span>
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pageRef = useRef(null)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const context = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } })
      entrance.from('.nav', { y: -20, opacity: 0, duration: 0.7 })
        .from('.eyebrow', { y: 24, opacity: 0, duration: 0.7 }, '-=.35')
        .from('h1', { y: 45, opacity: 0, duration: 1.1 }, '-=.4')
        .from('.hero-bottom', { y: 25, opacity: 0, duration: 0.8 }, '-=.55')
        .from('.hero-grid', { scale: 0.7, opacity: 0, duration: 1.2 }, '-=.8')

      gsap.utils.toArray('.statement-grid, .section-heading, .service, .process-step, .audience, .why-grid, .founders-intro, .founder, .contact-inner').forEach((element) => {
        gsap.from(element, {
          y: 45,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 84%', once: true },
        })
      })
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <main ref={pageRef}>
      <section className="hero" id="top">
        <nav className="nav shell">
          <a className="wordmark" href="#top" onClick={closeMenu}><Mark small /><span>NEVREST LABS</span></a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
          <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
            <a href="#work" onClick={closeMenu}>What we do</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#contact" className="nav-cta" onClick={closeMenu}>Start a conversation <Arrow /></a>
          </div>
        </nav>

        <div className="hero-content shell">
          <div className="eyebrow"><span className="status-dot" /> Kathmandu, Nepal <span className="eyebrow-line" /> Independent software company</div>
          <h1>Build what<br /><span>moves people</span><strong>.</strong></h1>
          <div className="hero-bottom"><p className="hero-intro">Nevrest Labs builds thoughtful software for clients who want to turn a meaningful idea, problem, or opportunity into a useful digital product.</p><a className="circle-link" href="#contact" aria-label="Start a conversation"><Arrow /></a></div>
        </div>
        <div className="hero-grid" aria-hidden="true" /><div className="hero-note">N / 01<br /><span>Ideas to impact</span></div>
      </section>

      <section className="statement" id="about"><div className="shell statement-grid"><p className="section-label">The short version</p><div><h2>Technology should feel<br /><span>like a clear next step.</span></h2><p className="body-copy">From Kathmandu, we partner with people solving meaningful problems. We bring sharp thinking, careful craft, and the technical range to make the leap from ambition to momentum.</p></div><div className="signal signal--lime">N<span>↗</span></div></div></section>

      <section className="services" id="work"><div className="shell"><div className="section-heading"><p className="section-label">What we do</p><p className="heading-aside">Small team. Serious range.</p></div><h2 className="section-title">Software built for<br /><span>real businesses.</span></h2><div className="service-list">{services.map((service) => <motion.article className="service" key={service.number} whileHover={{ x: 8, backgroundColor: 'rgba(213,246,106,.06)' }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><span className="service-arrow"><Arrow /></span></motion.article>)}</div></div></section>

      <section className="process" id="how-it-works"><div className="shell"><div className="section-heading"><p className="section-label">How it works</p><p className="heading-aside">A clear path from idea to launch.</p></div><div className="process-grid">{process.map((step) => <article className="process-step" key={step.number}><span className="service-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>

      <section className="audiences"><div className="shell audience-grid"><article id="clients" className="audience audience--companies"><p className="section-label">For clients</p><h2>Bring us the problem.<br /><span>We&apos;ll build the software.</span></h2><p>Whether you have a clear product brief or only the beginning of an idea, we can help shape the right technical path and build something useful.</p><ul><li>Web platforms and mobile applications</li><li>Product design and user experience</li><li>Business tools and digital systems</li><li>Technical direction and ongoing improvement</li></ul><a className="text-link" href="#contact">Tell us what you&apos;re building <Arrow /></a></article><article className="audience audience--approach"><p className="section-label">Our approach</p><h2>Thoughtful work.<br /><span>Useful outcomes.</span></h2><p>We keep the process direct, collaborative, and grounded in the people who will use the product. No unnecessary complexity. No software for its own sake.</p><div className="approach-tags"><span>Understand</span><span>Design</span><span>Build</span><span>Improve</span></div><a className="text-link" href="#contact">Start a conversation <Arrow /></a></article></div></section>

      <section className="why-nepal"><div className="shell why-grid"><p className="section-label">Our philosophy</p><div><h2>Geography should not<br /><span>define opportunity.</span></h2><p className="body-copy">From Kathmandu, we work with clients wherever they are. The important thing is not where the software is built, but whether it solves the right problem for the people who need it.</p></div></div></section>

      <section className="contact" id="contact"><div className="shell contact-inner"><p className="section-label">Have a problem worth solving?</p><h2>Let&apos;s make<br /><span>something useful.</span></h2><a className="contact-link" href="mailto:contact@nevrestlabs.com">contact@nevrestlabs.com <Arrow /></a><div className="contact-mark"><Mark /></div></div></section>

      <section className="founders" id="founders"><div className="shell"><div className="founders-intro"><p className="section-label">The people behind it</p><h2>Four points<br /><span>of view.</span></h2></div><div className="founder-list">{founders.map((founder, index) => <motion.div className={`founder founder--${index + 1}`} key={founder.name} whileHover={{ x: 8 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}><motion.div className="portrait" whileHover={{ rotate: 8, scale: 1.06 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }}><span>{founder.initials}</span></motion.div><div><h3>{founder.name}</h3></div>{founder.linkedin && <a className="linkedin-link" href={founder.linkedin} target="_blank" rel="noreferrer" aria-label={`Open ${founder.name}'s LinkedIn profile`}>in <Arrow /></a>}</motion.div>)}</div></div></section>

      <footer className="footer shell"><a className="footer-logo" href="#top"><img src={logo} alt="Nevrest Labs" /></a><span>Software, with intent.</span><span>Kathmandu, Nepal / 2026</span></footer>
    </main>
  )
}

export default App
