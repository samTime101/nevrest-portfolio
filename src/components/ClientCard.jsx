import { useState } from 'react'
import { Arrow } from './SiteChrome.jsx'

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ClientLogo({ client }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="client-logo">
      {!failed ? (
        <img src={client.logo} alt={`${client.name} logo`} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="client-fallback" aria-hidden="true">
          {initials(client.name)}
        </span>
      )}
    </div>
  )
}

export function ClientCard({ client }) {
  return (
    <article className="client-card">
      <ClientLogo client={client} />
      <h3>{client.name}</h3>
      <p className="client-handle">{client.handle}</p>
      <div className="client-socials">
        {client.socials.map((s) => (
          <a key={s.label} className="text-link" href={s.href} target="_blank" rel="noreferrer">
            {s.label} <Arrow />
          </a>
        ))}
      </div>
    </article>
  )
}
