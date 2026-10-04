import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Arrow, Nav } from '../components/SiteChrome.jsx'
import Seo from '../components/Seo.jsx'
import { routeHead } from '../lib/route-head.js'
import { getProject, projects } from '../data/projects.js'
import '../projects.css'

// Hidden projects are excluded from `routes`, the sitemap and the prerender, so
// they have no page to link to. The prev/next carousel must walk the same
// published list or it hands visitors a 404.
const published = projects.filter((p) => !p.hidden)

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug || '')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug, project])

  const head = useMemo(() => (project ? routeHead(`/projects/${project.slug}`) : null), [project])

  if (!project || !head) return <Navigate to="/projects" replace />

  const idx = published.findIndex((p) => p.slug === project.slug)
  const next = published[(idx + 1) % published.length]

  return (
    <div className="work-page case-page">
      <Seo {...head} />
      <section className={`case-hero case-hero--${project.accent}`}>
        <Nav />
        <div className="shell case-hero-inner">
          <Link className="case-back" to="/projects">
            ← All work
          </Link>
          <div className="case-top">
            <span className={`work-status work-status--${project.status === 'Live' ? 'live' : 'build'}`}>
              <i />
              {project.status}
            </span>
            <span className="case-no">N / {project.no}</span>
          </div>
          <p className="eyebrow work-eyebrow">{project.kicker}</p>
          <h1>{project.title}</h1>
          <p className="case-tagline">{project.tagline}</p>
          <div className="case-meta">
            <div>
              <span>Status</span>
              <strong>{project.status}</strong>
            </div>
            <div>
              <span>Focus</span>
              <strong>{project.tags[0]}</strong>
            </div>
            <div>
              <span>Stack</span>
              <strong>{project.stack.slice(0, 2).join(' · ')}</strong>
            </div>
            <div>
              <span>Timeline</span>
              <strong>{project.year}</strong>
            </div>
          </div>
          <div className="case-ctas">
            {project.url && (
              <a className="case-btn" href={project.url} target="_blank" rel="noreferrer">
                Visit live site <Arrow />
              </a>
            )}
            <Link className="case-btn case-btn--ghost" to="/#contact">
              Start something similar <Arrow />
            </Link>
          </div>
        </div>
        <span className="case-giant" aria-hidden="true">
          {project.no}
        </span>
      </section>

      <section className="case-body">
        <div className="shell case-grid">
          <div className="case-main">
            <p className="section-label">Overview</p>
            <h2>
              What <span>it is.</span>
            </h2>
            <p className="body-copy case-lead">{project.description}</p>

            <div className="case-stats">
              {project.stats.map((s) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </motion.div>
              ))}
            </div>

            <p className="section-label">Key features</p>
            <div className="case-features">
              {project.highlights.map((h, i) => (
                <motion.article
                  key={h.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                >
                  <span>0{i + 1}</span>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </motion.article>
              ))}
            </div>

            {/* Visuals gallery hidden for now — uncomment when screenshots land in public/work/
            {project.shots && project.shots.length > 0 ? (
              <div className="case-gallery">
                {project.shots.map((shot) => (
                  <Shot key={shot.src} src={shot.src} alt={shot.alt} caption={shot.caption} />
                ))}
              </div>
            ) : (
              <div className="case-shot">
                <p>Visuals</p>
                <strong>Screenshot / demo slot — drop images here.</strong>
                <span>16:9 recommended · real product frames beat mockups</span>
              </div>
            )} */}

            {project.videoId && (
              <div className="case-video">
                <p className="section-label">Watch it in action</p>
                <div className="case-video-frame">
                  <div className="case-figure-bar" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${project.videoId}`}
                    title={`${project.title} demo video`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                {project.videoCaption && <span className="case-video-caption">{project.videoCaption}</span>}
              </div>
            )}

            {project.demoVideo && (
              <div className="case-video">
                <p className="section-label">Demo</p>
                <div className="case-video-frame">
                  <div className="case-figure-bar" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <video src={project.demoVideo} controls preload="none" playsInline />
                </div>
                {project.demoCaption && <span className="case-video-caption">{project.demoCaption}</span>}
              </div>
            )}

            <blockquote className="case-next">“{project.next}”</blockquote>
          </div>

          <aside className="case-side">
            <div className="case-card">
              <p className="section-label">Stack</p>
              <div className="case-chips">
                {project.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="case-card">
              <p className="section-label">Tags</p>
              <div className="case-chips">
                {project.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            {project.extras && (
              <div className="case-card">
                <p className="section-label">Also inside</p>
                <ul>
                  {project.extras.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.roadmap && (
              <div className="case-card">
                <p className="section-label">Roadmap</p>
                <ul>
                  {project.roadmap.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.url && (
              <a className="case-card case-card--link" href={project.url} target="_blank" rel="noreferrer">
                <span>{project.urlLabel}</span>
                <b>
                  Open <Arrow />
                </b>
              </a>
            )}
          </aside>
        </div>
      </section>

      <section className="case-nextproj">
        <div className="shell">
          <p className="section-label">Next project</p>
          <Link to={`/projects/${next.slug}`}>
            <span>
              {next.no} — {next.status}
            </span>
            <strong>
              {next.title} <Arrow />
            </strong>
          </Link>
        </div>
      </section>
    </div>
  )
}
