// Server-render entry used only by scripts/prerender.mjs.
//
// Renders the exact same component tree the browser mounts (App.jsx exports
// AppRoutes for precisely this reason) inside a StaticRouter, so the HTML a
// crawler reads first is byte-for-byte the markup React would produce, with no
// second implementation to drift.

import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import { AppRoutes } from './App.jsx'

/**
 * Render one route to static HTML.
 *
 * @param {string} url Route path, e.g. '/projects/omedate'.
 * @returns {string} The rendered body markup.
 */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  )
}