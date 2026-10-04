import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// hydrateRoot, not createRoot: scripts/prerender.mjs writes the rendered markup of
// this same tree into dist at build time, so the browser adopts the existing DOM
// instead of discarding and rebuilding it. That avoids a visible flash and a
// duplicate render pass on every page load.
hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <App />
  </StrictMode>,
)
