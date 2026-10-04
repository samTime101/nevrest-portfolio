import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Arrow, Nav } from '../components/SiteChrome.jsx'
import { ArtCover } from '../components/Shots.jsx'
import Seo from '../components/Seo.jsx'
import { routeHead } from '../lib/route-head.js'
import { projects } from '../data/projects.js'
import '../projects.css'

const glyphs = { omedate: '◉', 'nepse-terminal': '▲', onecompiler: '>_', 'automation-suite': '↻', 'mail-studio': '@', justodo: '//', 'compliance-compass': '◎' }

function OmedateMock() {
  return (
    <div className="work-mock" aria-hidden="true">
      <div className="mock-video-row">
        <div className="mock-video">
          <span className="mock-live">
            <i />
            LIVE
          </span>
          <span className="mock-face mock-face--a" />
        </div>
        <div className="mock-video mock-video--dim">
          <span className="mock-face mock-face--b" />
        </div>
      </div>
      <div className="mock-bar">
        <span className="mock-pill">Blind Date · 00:60</span>
        <span className="mock-pill mock-pill--ghost">voice only · no filters</span>
      </div>
    </div>
  )
}

function NepseMock() {
  return (
    <div className="work-mock" aria-hidden="true">
      <div className="mock-ticker">
        {['NEPSE 2,847 ▲', 'UPPER ▲6.2%', 'RSI 61', 'VOL 8.4M', 'BREADTH +'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <svg className="mock-chart" viewBox="0 0 300 90" preserveAspectRatio="none">
        <polyline points="0,70 30,62 60,66 90,48 120,54 150,36 180,42 210,24 240,30 270,14 300,20" fill="none" strokeWidth="3" />
        <circle cx="270" cy="14" r="5" />
      </svg>
      <div className="mock-bar">
        <span className="mock-pill">Signal 87/100</span>
        <span className="mock-pill mock-pill--ghost">entry · SL · target</span>
      </div>
    </div>
  )
}

function CompilerMock() {
  return (
    <div className="work-mock work-mock--code" aria-hidden="true">
      <div className="mock-window">
        <span />
        <span />
        <span />
      </div>
      <pre>{`def greet(name):\n    return f"hello, {name}"\n\nprint(greet("world"))  # run ▶`}</pre>
      <div className="mock-bar">
        <span className="mock-pill">python · run ▶</span>
        <span className="mock-pill mock-pill--ghost">output: hello, world</span>
      </div>
    </div>
  )
}

function MailMock() {
  return (
    <div className="work-mock" aria-hidden="true">
      <div className="mock-canvas">
        <span className="mock-node">
          <b>TRIGGER</b>Incoming data
        </span>
        <span className="mock-node">
          <b>LOOP</b>For each record
        </span>
        <span className="mock-node">
          <b>WAIT</b>2 seconds
        </span>
        <span className="mock-node">
          <b>EMAIL</b>Send email
        </span>
      </div>
      <div className="mock-bar">
        <span className="mock-pill mock-pill--green">▶ Run workflow</span>
        <span className="mock-pill mock-pill--ghost">{'{{first_name}} · {{org_name}}'}</span>
      </div>
    </div>
  )
}

function JustoMock() {
  return (
    <div className="work-mock work-mock--code" aria-hidden="true">
      <div className="mock-window">
        <span />
        <span />
        <span />
      </div>
      <pre>{`// TODO<20251208-161530>: handle empty state\n// TODO<20251208-170102>: empty cart copy`}</pre>
      <div className="mock-bar">
        <span className="mock-pill">Ctrl+Shift+6 · stamp HUID</span>
        <span className="mock-pill mock-pill--ghost">.todos/todos.json ✓</span>
      </div>
    </div>
  )
}

function CompassMock() {
  return (
    <div className="work-mock" aria-hidden="true">
      <div className="mock-canvas mock-canvas--map">
        <span className="mock-pin">◉</span>
        <span className="mock-verdict">ALLOWED</span>
      </div>
      <div className="mock-bar">
        <span className="mock-pill mock-pill--green">CAAN ✓</span>
        <span className="mock-pill mock-pill--ghost">Home Affairs · permits 2/3</span>
      </div>
    </div>
  )
}

function AutomationMock() {
  return (
    <div className="work-mock" aria-hidden="true">
      <div className="mock-tabs">
        <span className="mock-tab--active">Workflow Recorder</span>
        <span>CSV Cleaner</span>
        <span>Email Scraper</span>
        <span>Bulk Email</span>
      </div>
      <div className="mock-bar">
        <span className="mock-pill mock-pill--red">● Rec [F8]</span>
        <span className="mock-pill mock-pill--green">Run [F10]</span>
        <span className="mock-pill mock-pill--amber">Stop [F11]</span>
      </div>
      <div className="mock-log">
        <i style={{ width: '92%' }} />
        <i style={{ width: '78%' }} />
        <i style={{ width: '85%' }} />
      </div>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const shown = useMemo(() => projects.filter((p) => !p.hidden), [])
  const filters = useMemo(() => ['All', ...new Set(shown.map((p) => p.status))], [shown])
  const visible = useMemo(() => (filter === 'All' ? shown : shown.filter((p) => p.status === filter)), [filter, shown])
  const liveCount = shown.filter((p) => p.status === 'Live').length
  const buildCount = shown.length - liveCount

  const head = useMemo(() => routeHead('/projects'), [])

  return (
    <div className="work-page">
      <Seo {...head} />
      <section className="work-hero">
        <Nav />
        <div className="shell work-hero-inner">
          <p className="eyebrow work-eyebrow">
            <span className="status-dot" /> Selected work <span className="eyebrow-line" /> {String(shown.length).padStart(2, '0')} products
          </p>
          <h1>
            Work that
            <br />
            <span>ships & learns.</span>
          </h1>
          <div className="work-hero-bottom">
            <p>A live social product, a FinTech research terminal, and automation tools doing real work.</p>
            <div className="work-counts">
              <span>
                <b>{String(liveCount).padStart(2, '0')}</b> live
              </span>
              <span>
                <b>{String(buildCount).padStart(2, '0')}</b> in build
              </span>
              <span>
                <b>{String(shown.length).padStart(2, '0')}</b> total
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="work-list-wrap">
        <div className="shell">
          <div className="work-filters" role="tablist" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={`work-filter ${filter === f ? 'work-filter--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="work-list">
            {visible.map((project, i) => (
              <motion.article
                key={project.slug}
                className={`work-card work-card--${project.accent}`}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              >
                <Link className={`work-art work-art--${project.slug}`} to={`/projects/${project.slug}`} aria-label={`Open ${project.title} case study`}>
                  <span className="work-no">{project.no}</span>
                  <span className={`work-status work-status--${project.status === 'Live' ? 'live' : 'build'}`}>
                    <i />
                    {project.status}
                  </span>
                  <span className="work-glyph" aria-hidden="true">
                    {glyphs[project.slug]}
                  </span>
                  <ArtCover src={project.cover} alt={`${project.title} screenshot`}>
                    {project.slug === 'omedate' && <OmedateMock />}
                    {project.slug === 'nepse-terminal' && <NepseMock />}
                    {project.slug === 'onecompiler' && <CompilerMock />}
                    {project.slug === 'automation-suite' && <AutomationMock />}
                    {project.slug === 'mail-studio' && <MailMock />}
                    {project.slug === 'justodo' && <JustoMock />}
                    {project.slug === 'compliance-compass' && <CompassMock />}
                  </ArtCover>
                  <span className="work-open">
                    Open case <Arrow />
                  </span>
                </Link>

                <div className="work-body">
                  <p className="project-kicker">{project.kicker}</p>
                  <h2>{project.title}</h2>
                  <p className="work-tagline">{project.tagline}</p>
                  <p className="work-short">{project.short}</p>
                  <div className="work-stats">
                    {project.stats.slice(0, 3).map((s) => (
                      <div key={s.label}>
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="work-ctas">
                    <Link className="work-btn" to={`/projects/${project.slug}`}>
                      View case study <Arrow />
                    </Link>
                    {project.url ? (
                      <a className="text-link" href={project.url} target="_blank" rel="noreferrer">
                        {project.urlLabel} <Arrow />
                      </a>
                    ) : (
                      !project.cover && <span className="work-soon">{project.screenshotNote || 'Details inside'}</span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="work-band">
        <div className="shell work-band-inner">
          <p className="section-label">Your turn</p>
          <h2>
            Your project
            <br />
            <span>could be next.</span>
          </h2>
          <Link className="circle-link" to="/#contact" aria-label="Start a project">
            <Arrow />
          </Link>
        </div>
      </section>
    </div>
  )
}
