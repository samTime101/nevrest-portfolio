import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
// Public path, not an import: see the note in scripts/prepare-images.mjs. Vite's
// SSR pass (used by the prerenderer) does not rewrite asset imports, so an
// imported image ships as "/src/assets/…" in the prerendered HTML and 404s.
const logo = '/logo-mark.webp'

export function Mark({ small = false }) {
  return (
    <span className={`brand-mark ${small ? 'brand-mark--small' : ''}`} aria-hidden="true">
      <i />
      <b />
      <em />
    </span>
  )
}

export function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      ↗
    </span>
  )
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const closeMenu = () => setMenuOpen(false)
  const onProjects = location.pathname.startsWith('/projects')

  return (
    <nav className="nav shell">
      <Link className="wordmark" to="/" onClick={closeMenu}>
        <Mark small />
        <span>NEVREST LABS</span>
      </Link>
      <button
        className="menu-toggle"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
      </button>
      <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
        <Link to="/#services" onClick={closeMenu}>
          Services
        </Link>
        <Link to="/projects" onClick={closeMenu} aria-current={onProjects ? 'page' : undefined}>
          Projects
        </Link>
        <Link to="/clients" onClick={closeMenu}>
          Clients
        </Link>
        <Link to="/#about" onClick={closeMenu}>
          About
        </Link>
        <Link to="/#founders" onClick={closeMenu}>
          Founders
        </Link>
        <Link to="/#contact" onClick={closeMenu}>
          Contact
        </Link>
        <Link to="/how-we-deliver" className="nav-cta" onClick={closeMenu}>
          How we work <Arrow />
        </Link>
        <Link to="/#contact" className="nav-cta" onClick={closeMenu}>
          Start a project <Arrow />
        </Link>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="footer shell">
      <Link className="footer-logo" to="/">
        <img src={logo} alt="Nevrest Labs" />
      </Link>
      <div className="footer-links">
        <Link to="/#about">About</Link>
        <Link to="/#services">Services</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/#contact">Contact</Link>
        <a href="https://www.linkedin.com/company/143899606/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
      <span>Software, with intent.</span>
      <span>© 2026 Nevrest Labs</span>
    </footer>
  )
}
