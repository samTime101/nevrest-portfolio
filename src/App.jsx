import './App.css'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './assets/logo.png'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { number: '01', title: 'Web development', text: 'Modern, responsive web applications designed to grow with the business.' },
  { number: '02', title: 'Mobile development', text: 'Thoughtful iOS and Android experiences with a product-first approach.' },
  { number: '03', title: 'AI & machine learning', text: 'Practical AI systems, LLM applications, intelligent workflows, and automation.' },
  { number: '04', title: 'Custom software', text: 'Business systems, dashboards, internal tools, and purpose-built applications.' },
  { number: '05', title: 'Backend & APIs', text: 'Secure APIs, databases, integrations, authentication, and scalable architecture.' },
  { number: '06', title: 'Automation', text: 'Connected workflows, AI agents, and process improvements that remove busywork.' },
  { number: '07', title: 'UI/UX & product design', text: 'Clear interfaces and product experiences shaped around the people using them.' },
  { number: '08', title: 'Cloud & DevOps', text: 'Deployment, CI/CD, monitoring, and dependable production infrastructure.' },
]

const process = [
  { number: '01', title: 'Discover', text: 'Understand the problem, business goals, users, and what success needs to look like.' },
  { number: '02', title: 'Plan', text: 'Define the scope, architecture, technology, and product direction before we build.' },
  { number: '03', title: 'Build', text: 'Design, develop, integrate, and test in close collaboration with your team.' },
  { number: '04', title: 'Launch', text: 'Deploy with care and make the transition to production clear and dependable.' },
  { number: '05', title: 'Improve', text: 'Monitor, learn, optimise, and keep making the product more useful over time.' },
]

const technologies = [
  ['Frontend', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS'], ['Backend', 'Node.js', 'Python', 'FastAPI', 'Flask'], ['Data', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase'], ['AI', 'OpenAI', 'Gemini', 'LangChain', 'Hugging Face', 'PyTorch'], ['Infrastructure', 'Docker', 'Linux', 'Nginx', 'Cloudflare', 'Vercel'],
]

const industries = ['Education', 'Healthcare', 'FinTech', 'E-Commerce', 'SaaS', 'Hospitality', 'Real Estate', 'Logistics', 'Media', 'Startups', 'Professional services']
const team = [
  { initials: 'SB', name: 'Sworup Bastola', linkedin: 'https://www.linkedin.com/in/swarup-bastola-357474398' }, { initials: 'SR', name: 'Samip Regmi', linkedin: 'https://www.linkedin.com/in/samip-regmi-670a76248' }, { initials: 'DD', name: 'Diwas Dahal', linkedin: 'https://www.linkedin.com/in/diwas-dahal/' }, { initials: 'SA', name: 'Sayuz Acharya' },
]
const reasons = [
  ['01', 'Engineering-first', 'We make deliberate technical decisions that support the product long after launch.'], ['02', 'Practical AI', 'We use AI where it creates real leverage, not just where it makes a good headline.'], ['03', 'Built to evolve', 'Clean systems and thoughtful architecture make the next change less expensive.'], ['04', 'Clear collaboration', 'Direct communication, visible progress, and honest conversations throughout.'], ['05', 'Fast learning loops', 'We focus work on the riskiest assumptions and iterate with purpose.'], ['06', 'Support after launch', 'A launch is the beginning of the product journey, not the end of ours.'],
]
const faqs = [
  ['What kind of projects do you build?', 'We build web platforms, mobile applications, internal tools, custom software, AI-enabled products, and automation systems.'], ['Can you build custom AI solutions?', 'Yes. We can help identify a useful AI opportunity, design the right workflow, and build it into a reliable product or internal system.'], ['Do you work with startups?', 'Yes. We work with early-stage teams as well as established businesses, from product direction through production delivery.'], ['Can you work with an existing development team?', 'Absolutely. We can extend a team, take ownership of a defined product area, or provide focused technical and product support.'], ['How long does a typical project take?', 'The answer depends on scope and complexity. We define a practical delivery plan during discovery before committing to a timeline.'], ['Do you provide maintenance after launch?', 'Yes. We can provide monitoring, ongoing improvements, technical support, and a plan for the product’s next stage.'], ['What technologies do you use?', 'We select tools around the product’s needs, with experience across modern web, mobile, backend, AI, data, and cloud technologies.'],
]

function Mark({ small = false }) { return <span className={`brand-mark ${small ? 'brand-mark--small' : ''}`} aria-hidden="true"><i /><b /><em /></span> }
function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const pageRef = useRef(null)
  const closeMenu = () => setMenuOpen(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } })
      entrance.from('.nav', { y: -20, opacity: 0, duration: 0.7 }).from('.eyebrow', { y: 24, opacity: 0, duration: 0.7 }, '-=.35').from('h1', { y: 45, opacity: 0, duration: 1.1 }, '-=.4').from('.hero-bottom', { y: 25, opacity: 0, duration: 0.8 }, '-=.55').from('.hero-stack', { scale: 0.8, opacity: 0, duration: 1.1 }, '-=.85')
      gsap.utils.toArray('.statement-grid, .section-heading, .service, .process-step, .tech-row, .project-card, .reason, .faq-item, .contact-inner').forEach((element) => gsap.from(element, { y: 45, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } }))
    }, pageRef)
    return () => context.revert()
  }, [])

  return <main ref={pageRef}>
    <section className="hero" id="top"><nav className="nav shell"><a className="wordmark" href="#top" onClick={closeMenu}><Mark small /><span>NEVREST LABS</span></a><button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button><div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}><a href="#top" onClick={closeMenu}>Home</a><a href="#services" onClick={closeMenu}>Services</a><a href="#projects" onClick={closeMenu}>Projects</a><a href="#about" onClick={closeMenu}>About</a><a href="#process" onClick={closeMenu}>Process</a><a href="#contact" onClick={closeMenu}>Contact</a><a href="#contact" className="nav-cta" onClick={closeMenu}>Start a project <Arrow /></a></div></nav><div className="hero-content shell"><div className="eyebrow"><span className="status-dot" /> Kathmandu, Nepal <span className="eyebrow-line" /> Building digital products that matter</div><h1>Build what<br /><span>moves people</span><strong>.</strong></h1><div className="hero-bottom"><p className="hero-intro">From web and mobile applications to AI systems, automation, and custom software — we turn meaningful ideas into reliable digital products.</p><a className="circle-link" href="#contact" aria-label="Start a project"><Arrow /></a></div></div><div className="hero-stack" aria-label="Our core capabilities"><span>WEB</span><span>AI</span><span>PRODUCT</span><span>SYSTEMS</span></div><div className="hero-note">N / 01<br /><span>Ideas to impact</span></div></section>

    <section className="proof"><div className="shell proof-grid"><p className="section-label">Built with intent</p><div><strong>Web</strong><span>Platforms & products</span></div><div><strong>Mobile</strong><span>Native-feeling experiences</span></div><div><strong>AI</strong><span>Useful intelligence</span></div><div><strong>Systems</strong><span>Built to scale</span></div></div></section>
    <section className="statement" id="about"><div className="shell statement-grid"><p className="section-label">Who we are</p><div><h2>Technology, strategy &<br /><span>execution — together.</span></h2><p className="body-copy">Nevrest Labs is a technology-focused company helping businesses turn ideas into reliable digital products. We pair engineering discipline with user-focused design so the things we build are useful today and maintainable tomorrow.</p><div className="principle-list"><span>Engineering-first approach</span><span>Modern technology</span><span>Practical AI integration</span><span>Scalable architecture</span><span>User-focused design</span></div></div><div className="signal signal--lime">N<span>↗</span></div></div></section>
    <section className="services" id="services"><div className="shell"><div className="section-heading"><p className="section-label">What we build</p><p className="heading-aside">Small team. Serious range.</p></div><h2 className="section-title">Software built for<br /><span>real businesses.</span></h2><div className="service-list">{services.map((service) => <motion.article className="service" key={service.number} whileHover={{ x: 8, backgroundColor: 'rgba(213,246,106,.06)' }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><a className="service-arrow" href="#contact" aria-label={`Explore ${service.title}`}><Arrow /></a></motion.article>)}</div></div></section>
    <section className="tech"><div className="shell"><div className="section-heading"><p className="section-label">Our toolkit</p><p className="heading-aside">Chosen for the job, not the trend.</p></div><h2 className="tech-title">Built with modern<br /><span>technology.</span></h2><div className="tech-list">{technologies.map(([group, ...items]) => <div className="tech-row" key={group}><p>{group}</p><div>{items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div></div></section>
    <section className="projects" id="projects"><div className="shell"><div className="section-heading"><p className="section-label">Selected work</p><p className="heading-aside">Case studies are added as products launch.</p></div><h2 className="section-title">Things we&apos;re<br /><span>building.</span></h2><div className="project-grid"><article className="project-card project-card--large"><div className="project-art"><i /><b /><em /></div><p className="project-kicker">Featured project / In progress</p><h3>Your project could be next.</h3><p>We are building a considered portfolio of products with the teams behind them. Get in touch to see what a good first release could look like.</p><div className="project-tags"><span>Product strategy</span><span>Engineering</span><span>AI</span></div><a className="text-link" href="#contact">Talk about your project <Arrow /></a></article><article className="project-card project-card--note"><p className="section-label">Portfolio note</p><h3>Real work deserves a real story.</h3><p>We do not publish invented case studies or make up outcome metrics. Project stories and measurable results will appear here with our clients&apos; permission.</p></article></div></div></section>
    <section className="industries"><div className="shell"><div className="section-heading"><p className="section-label">Where we help</p><p className="heading-aside">Technology that adapts to the problem.</p></div><h2>Technology for different<br /><span>industries.</span></h2><div className="industry-list">{industries.map((industry) => <span key={industry}>{industry}</span>)}</div></div></section>
    <section className="process" id="process"><div className="shell"><div className="section-heading"><p className="section-label">How we work</p><p className="heading-aside">A clear path from idea to launch.</p></div><div className="process-grid">{process.map((step) => <article className="process-step" key={step.number}><span className="service-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>
    <section className="why-nepal"><div className="shell why-grid"><p className="section-label">Why teams choose us</p><div><h2>Good software starts<br /><span>with good judgement.</span></h2><div className="reason-grid">{reasons.map(([number, title, text]) => <article className="reason" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></div></section>
    <section className="team"><div className="shell"><div className="section-heading"><p className="section-label">Meet the team</p><p className="heading-aside">Small, hands-on, and focused.</p></div><div className="team-grid">{team.map((member) => <article className="team-member" key={member.name}><div className="portrait"><span>{member.initials}</span></div><h3>{member.name}</h3><p>Founding team / Nevrest Labs</p>{member.linkedin && <a className="text-link" href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>}</article>)}</div></div></section>
    <section className="testimonials"><div className="shell testimonial-inner"><p className="section-label">What our clients say</p><h2>Built on work<br /><span>we can stand behind.</span></h2><p className="body-copy">Client testimonials will live here once we have permission to share them. Until then, we prefer to let a thoughtful conversation and the work itself do the talking.</p></div></section>
    <section className="faq"><div className="shell faq-grid"><div><p className="section-label">Questions, answered</p><h2>Before we<br /><span>get started.</span></h2></div><div>{faqs.map(([question, answer], index) => <article className={`faq-item ${openFaq === index ? 'faq-item--open' : ''}`} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? '−' : '+'}</b></button><div><p>{answer}</p></div></article>)}</div></div></section>
    <section className="contact" id="contact"><div className="shell contact-inner"><div className="contact-copy"><p className="section-label">Have an idea?</p><h2>Let&apos;s build<br /><span>something useful.</span></h2><p>Tell us what you&apos;re trying to build and we&apos;ll help turn the idea into a real product.</p><a className="contact-link" href="mailto:contact@nevrestlabs.com">contact@nevrestlabs.com <Arrow /></a></div><div className="contact-aside"><p>Start with the problem, the opportunity, or the beginning of an idea.</p><a className="circle-link" href="mailto:contact@nevrestlabs.com" aria-label="Email Nevrest Labs"><Arrow /></a></div><div className="contact-mark"><Mark /></div></div></section>
    <footer className="footer shell"><a className="footer-logo" href="#top"><img src={logo} alt="Nevrest Labs" /></a><div className="footer-links"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Projects</a><a href="#contact">Contact</a><a href="https://www.linkedin.com/company/143899606/" target="_blank" rel="noreferrer">LinkedIn</a></div><span>Software, with intent.</span><span>© 2026 Nevrest Labs</span></footer>
  </main>
}

export default App
