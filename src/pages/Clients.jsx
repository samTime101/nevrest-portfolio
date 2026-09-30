import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Arrow, Nav } from '../components/SiteChrome.jsx'
import { ClientCard } from '../components/ClientCard.jsx'
import { clients } from '../data/clients.js'
import '../projects.css'

export default function Clients() {
  useEffect(() => {
    document.title = 'Clients — Nevrest Labs'
  }, [])

  return (
    <div className="work-page clients-page">
      <section className="work-hero">
        <Nav />
        <div className="shell work-hero-inner">
          <p className="eyebrow work-eyebrow">
            <span className="status-dot" /> Clients & partners <span className="eyebrow-line" /> {String(clients.length).padStart(2, '0')} and growing
          </p>
          <h1>
            Good company,
            <br />
            <span>good work.</span>
          </h1>
          <div className="work-hero-bottom">
            <p>The teams and brands we build with — from digital agencies to production houses.</p>
            <div className="work-counts">
              <span>
                <b>{String(clients.length).padStart(2, '0')}</b> clients
              </span>
              <span>
                <b>01</b> goal
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="clients-list-wrap">
        <div className="shell">
          <div className="client-grid">
            {clients.map((client, i) => (
              <motion.div
                key={client.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              >
                <ClientCard client={client} />
              </motion.div>
            ))}
          </div>

          <div className="clients-cta">
            <div>
              <p className="section-label">Your turn</p>
              <h2>
                Become our<br />
                <span>next client.</span>
              </h2>
            </div>
            <Link className="circle-link" to="/#contact" aria-label="Become a client">
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
