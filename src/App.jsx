import './App.css'

import { useState } from 'react'
import logo from './assets/logo.png'

const services = [
  { number: '01', title: 'Product engineering', text: 'Web platforms and mobile products built for the pace of real businesses.' },
  { number: '02', title: 'Digital systems', text: 'Clear, connected tools that turn complex operations into simple action.' },
  { number: '03', title: 'Technology strategy', text: 'A practical path from a good idea to a durable, useful product.' },
]

const founders = [
  { initials: 'SB', name: 'Sworup Bastola', role: 'Co-founder / Product', linkedin: 'https://www.linkedin.com/in/swarup-bastola-357474398' },
  { initials: 'SR', name: 'Samip Regmi', role: 'Co-founder / Engineering' },
  { initials: 'DD', name: 'Diwas Dahal', role: 'Co-founder / Design', linkedin: 'https://www.linkedin.com/in/diwas-dahal/' },
]

function Mark({ small = false }) {
  return <span className={`brand-mark ${small ? 'brand-mark--small' : ''}`} aria-hidden="true"><i /><b /><em /></span>
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav shell">
          <a className="wordmark" href="#top" onClick={closeMenu}><Mark small /><span>NEVREST</span></a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
          <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
            <a href="#work" onClick={closeMenu}>What we do</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#contact" className="nav-cta" onClick={closeMenu}>Start a conversation <Arrow /></a>
          </div>
        </nav>

        <div className="hero-content shell">
          <div className="eyebrow"><span className="status-dot" /> Kathmandu, Nepal <span className="eyebrow-line" /> Independent technology studio</div>
          <h1>Build what<br /><span>moves people</span><strong>.</strong></h1>
          <div className="hero-bottom"><p className="hero-intro">Nevrest is a technology company helping ambitious teams turn thoughtful ideas into products people return to.</p><a className="circle-link" href="#work" aria-label="Explore what we do"><Arrow /></a></div>
        </div>
        <div className="hero-grid" aria-hidden="true" /><div className="hero-note">N / 01<br /><span>Ideas to impact</span></div>
      </section>

      <section className="statement" id="about"><div className="shell statement-grid"><p className="section-label">The short version</p><div><h2>Technology should feel<br /><span>like a clear next step.</span></h2><p className="body-copy">From Kathmandu, we partner with people solving meaningful problems. We bring sharp thinking, careful craft, and the technical range to make the leap from ambition to momentum.</p></div><div className="signal signal--lime">N<span>↗</span></div></div></section>

      <section className="services" id="work"><div className="shell"><div className="section-heading"><p className="section-label">What we do</p><p className="heading-aside">Small team. Serious range.</p></div><div className="service-list">{services.map((service) => <article className="service" key={service.number}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><span className="service-arrow"><Arrow /></span></article>)}</div></div></section>

      <section className="founders"><div className="shell"><div className="founders-intro"><p className="section-label">The people behind it</p><h2>Three points<br /><span>of view.</span></h2></div><div className="founder-list">{founders.map((founder, index) => <div className={`founder founder--${index + 1}`} key={founder.name}><div className="portrait"><span>{founder.initials}</span></div><div><h3>{founder.name}</h3><p>{founder.role}</p></div>{founder.linkedin && <a className="linkedin-link" href={founder.linkedin} target="_blank" rel="noreferrer" aria-label={`Open ${founder.name}'s LinkedIn profile`}>in <Arrow /></a>}</div>)}</div></div></section>

      <section className="contact" id="contact"><div className="shell contact-inner"><p className="section-label">Have a problem worth solving?</p><h2>Let&apos;s make<br /><span>something useful.</span></h2><a className="contact-link" href="mailto:hello@nevrest.tech">hello@nevrest.tech <Arrow /></a><div className="contact-mark"><Mark /></div></div></section>

      <footer className="footer shell"><a className="footer-logo" href="#top"><img src={logo} alt="Nevrest" /></a><span>Technology, with intent.</span><span>Kathmandu, Nepal / 2026</span></footer>
    </main>
  )
}

export default App
