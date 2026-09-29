import { useState } from 'react'

/* Cover image for card art. Falls back to `children` (CSS mock art)
   when src is missing or fails to load — so pages look fine
   before screenshots are added. */
export function ArtCover({ src, alt, children }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <>{children}</>
  return (
    <>
      <img className="art-cover" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      <span className="art-shade" aria-hidden="true" />
    </>
  )
}

/* Framed screenshot for case-study galleries, with graceful fallback. */
export function Shot({ src, alt, caption }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className="case-shot">
        <p>Visuals</p>
        <strong>Screenshot / demo slot — drop images here.</strong>
        <span>16:9 recommended · real product frames beat mockups</span>
      </div>
    )
  }
  return (
    <figure className="case-figure">
      <div className="case-figure-bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
