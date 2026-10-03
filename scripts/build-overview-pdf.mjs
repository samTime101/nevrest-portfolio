#!/usr/bin/env node
/**
 * Builds the Nevrest Labs company overview PDF.
 *
 * Copy is pulled from the same modules the website renders (src/data/*), so the
 * document cannot drift from the site. Styling reuses the tokens in src/App.css.
 *
 *   node scripts/build-overview-pdf.mjs
 *
 * Output: public/nevrest-labs-company-overview.pdf
 * Intermediate HTML: node_modules/.cache/nevrest-overview/overview.html
 */

import { execFile } from 'node:child_process'
import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

import { clients } from '../src/data/clients.js'
import {
  capabilityStack,
  deliveryModels,
  faqs,
  fastFacts,
  founders,
  industries,
  principles,
  publicProjects,
  services,
  site,
  technologies,
} from '../src/data/site.js'

const run = promisify(execFile)

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workDir = path.join(root, 'node_modules', '.cache', 'nevrest-overview')
const htmlPath = path.join(workDir, 'overview.html')
const pdfPath = path.join(root, 'public', 'nevrest-labs-company-overview.pdf')

const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Images are referenced by absolute file:// URL so the intermediate HTML can sit
// outside the repo tree.
const asset = (publicPath) => pathToFileURL(path.join(root, 'public', publicPath.replace(/^\//, ''))).href

// Mirrors ArtCover: fall back to the CSS mock art when a project has no cover.
const coverArt = (project) =>
  project.cover
    ? `<img src="${coverUrls[project.slug]}" alt="" />`
    : `<i></i><b></b><em></em><span class="mock-no">${esc(project.no)}</span>`

/* ------------------------------------------------------- cover preparation */

// Chrome embeds an image at its full source resolution even when it renders
// ~200px wide, which pushed the PDF past 4 MB. Project covers are therefore
// pre-scaled to COVER_WIDTH and re-encoded as JPEG. Uses ImageMagick when it is
// on PATH and silently falls back to the originals when it is not, so the build
// never hard-depends on it. Client logos are left untouched — they are small
// and need their alpha channel.
const COVER_WIDTH = 900

const findMagick = async () => {
  for (const bin of ['magick', 'convert']) {
    try {
      await run(bin, ['-version'])
      return bin
    } catch {
      /* try the next one */
    }
  }
  return null
}

const magick = await findMagick()
const coverUrls = {}

if (magick) {
  const coverDir = path.join(workDir, 'covers')
  await mkdir(coverDir, { recursive: true })

  await Promise.all(
    publicProjects()
      .filter((project) => project.cover)
      .map(async (project) => {
        const source = path.join(root, 'public', project.cover.replace(/^\//, ''))
        const target = path.join(coverDir, `${project.slug}.jpg`)
        try {
          await access(target)
        } catch {
          await run(magick, [source, '-resize', `${COVER_WIDTH}x`, '-quality', '82', '-strip', target])
        }
        coverUrls[project.slug] = pathToFileURL(target).href
      }),
  )
} else {
  for (const project of publicProjects()) {
    if (project.cover) coverUrls[project.slug] = asset(project.cover)
  }
}

/* ---------------------------------------------------------------- helpers */

// Same polygon as .brand-mark i in App.css, lifted to an SVG so it renders
// identically in print.
const mark = (fill = '#e9e9e4', size = 30) => `
  <svg class="mark" width="${size}" height="${(size * 58) / 80}" viewBox="0 0 80 58" aria-hidden="true">
    <polygon points="0,58 24.8,0 40,37.12 55.2,0 80,58 48.8,58 40,44.08 31.2,58" fill="${fill}" />
  </svg>`

const wordmark = (fill = '#f2f1ec', label = 'NEVREST LABS') => `
  <span class="wordmark">${mark(fill, 30)}<span>${esc(label)}</span></span>`

const pageNo = (n, total = 8) => `<span class="pageno">N / ${String(n).padStart(2, '0')} <span class="pageno-dim">of ${total}</span></span>`

// Formats site.lastModified ("2026-10-03") without inventing a date.
const revised = site.lastModified
const revisedLabel = `${new Date(`${revised}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})}`
const revisedLong = new Date(`${revised}T00:00:00Z`).toLocaleDateString('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/* ------------------------------------------------------------------ sheets */

// 01 — Cover
const cover = `
  <section class="sheet ink cover">
    <div class="gridlines"></div>
    <div class="pad">
      <header class="topbar">
        ${wordmark()}
        <span class="doclabel">Company overview · ${esc(revisedLong)}</span>
      </header>

      <div class="cover-body">
        <p class="eyebrow"><span class="dot"></span>${esc(site.city)}, ${esc(site.country)}<span class="hline"></span>${esc(site.slogan)}</p>
        <h1>Software,<br /><span>with intent.</span><strong>.</strong></h1>
        <div class="cover-bottom">
          <p class="cover-intro">${esc(site.description)}</p>
          <div class="hero-stack">
            ${capabilityStack.map((capability) => `<span>${esc(capability)}</span>`).join('')}
          </div>
        </div>
      </div>

      <footer class="cover-foot">
        <div><span class="k">Contact</span><span class="v">${esc(site.email)}</span></div>
        <div><span class="k">Web</span><span class="v">${esc(site.url.replace('https://', ''))}</span></div>
        <div><span class="k">Timezone</span><span class="v">${esc(site.utcOffset)}</span></div>
        ${pageNo(1)}
      </footer>
    </div>
  </section>`

// 02 — Who we are + at a glance
const skipFacts = new Set(['Services', 'Industries'])
const glance = fastFacts().filter((fact) => !skipFacts.has(fact.label))

const about = `
  <section class="sheet paper">
    <div class="pad">
      <div class="split">
        <div class="rail">
          <p class="label">Who we are</p>
          <div class="signal signal--lime">N<span>↗</span></div>
        </div>
        <div class="about-main">
          <h2 class="dark">Technology, strategy &amp;<br /><span>execution — together.</span></h2>
          <p class="body body--ink">${esc(site.summary)}</p>
          <p class="body body--ink">
            We pair engineering discipline with user-focused design, so the things we build are useful today
            and maintainable tomorrow — across web, mobile, AI, backend and cloud.
          </p>
          <div class="principles">
            ${principles.map((principle) => `<span>${esc(principle)}</span>`).join('')}
          </div>
          <dl class="facts">
            ${glance
              .map(
                (fact) => `<div><dt>${esc(fact.label)}</dt><dd>${esc(fact.value)}</dd></div>`,
              )
              .join('')}
          </dl>
        </div>
      </div>
      <footer class="foot">${pageNo(2)}</footer>
    </div>
  </section>`

// 03 — Services
const serviceRows = `
  <section class="sheet panel">
    <div class="pad">
      <div class="section-heading">
        <p class="label">What we build</p>
        <p class="aside">Small team. Serious range.</p>
      </div>
      <h2>Software built for<br /><span>real businesses.</span></h2>
      <div class="service-list">
        ${services
          .map(
            (service) => `
          <article class="service">
            <span class="service-number">${esc(service.number)}</span>
            <h3>${esc(service.title)}</h3>
            <p>${esc(service.text)}</p>
            <span class="service-arrow">↗</span>
          </article>`,
          )
          .join('')}
      </div>
      <footer class="foot">${pageNo(3)}</footer>
    </div>
  </section>`

// 04 — Toolkit + industries
const toolkit = `
  <section class="sheet ink">
    <div class="pad">
      <div class="section-heading">
        <p class="label">Our toolkit</p>
        <p class="aside">Chosen for the job, not the trend.</p>
      </div>
      <h2>Built with modern<br /><span>technology.</span></h2>
      <div class="tech-list">
        ${technologies
          .map(
            ([group, ...items]) => `
          <div class="tech-row">
            <p>${esc(group)}</p>
            <div>${items.map((item) => `<span>${esc(item)}</span>`).join('')}</div>
          </div>`,
          )
          .join('')}
      </div>

      <div class="section-heading section-heading--spaced">
        <p class="label">Where we help</p>
        <p class="aside">Technology that adapts to the problem.</p>
      </div>
      <h2 class="h2-sm">Technology for different<br /><span>industries.</span></h2>
      <div class="industry-list">
        ${industries.map((industry) => `<span>${esc(industry)}</span>`).join('')}
      </div>
      <footer class="foot">${pageNo(4)}</footer>
    </div>
  </section>`

// 05 — Selected work
const statusTone = { Live: 'live', 'In development': 'dev', 'In progress': 'dev', 'Shipped': 'live' }
const work = `
  <section class="sheet paper">
    <div class="pad">
      <div class="section-heading">
        <p class="label">Selected work</p>
        <p class="aside">Live products &amp; work in progress.</p>
      </div>
      <h2 class="dark">Things we're<br /><span>building.</span></h2>
      <div class="project-grid">
        ${publicProjects()
          .map(
            (project) => `
          <article class="project-card">
            <div class="project-art project-art--${esc(project.accent)}">
              ${coverArt(project)}
            </div>
            <p class="project-kicker">${esc(project.kicker)}</p>
            <h3>${esc(project.title)}</h3>
            <p class="project-short">${esc(project.tagline)}</p>
            <div class="project-tags">${project.tags.slice(0, 3).map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>
            <p class="project-status"><span class="status status--${statusTone[project.status] || 'dev'}">${esc(project.status)}</span>${esc(project.year)}</p>
          </article>`,
          )
          .join('')}
      </div>
      <footer class="foot">${pageNo(5)}</footer>
    </div>
  </section>`

// 06 — Founders + clients
const portraits = ['violet', 'coral', 'lime', 'violet']
const people = `
  <section class="sheet ink people">
    <div class="pad">
      <div class="section-heading">
        <p class="label">Founders</p>
        <p class="aside">Small, hands-on, and focused.</p>
      </div>
      <h2>The people<br /><span>behind the work.</span></h2>
      <div class="founder-list">
        ${founders
          .map(
            (founder, index) => `
          <article class="founder">
            <div class="portrait portrait--${portraits[index % portraits.length]}">${esc(founder.initials)}</div>
            <h3>${esc(founder.name)}</h3>
            <p>${esc(founder.role)}</p>
          </article>`,
          )
          .join('')}
      </div>

      <div class="section-heading section-heading--roomy">
        <p class="label">Clients</p>
        <p class="aside">Good company, good work.</p>
      </div>
      <div class="client-grid">
        ${clients
          .map(
            (client) => `
          <article class="client-card">
            <div class="client-logo"><img src="${asset(client.logo)}" alt="${esc(client.name)} logo" /></div>
            <h3>${esc(client.name)}</h3>
            <p>${esc(client.handle)}</p>
          </article>`,
          )
          .join('')}
      </div>
      <footer class="foot">${pageNo(6)}</footer>
    </div>
  </section>`

// 07 — How we deliver
const pickedFaqs = [0, 2, 3, 5].map((index) => faqs[index])
const delivery = `
  <section class="sheet paper delivery">
    <div class="pad">
      <div class="section-heading">
        <p class="label">How we deliver</p>
        <p class="aside">Four named leads. One client contact.</p>
      </div>
      <h2 class="dark">Three ways to<br /><span>work with us.</span></h2>
      <div class="model-grid">
        ${deliveryModels
          .map(
            (model, index) => `
          <article class="model">
            <p class="model-no">0${index + 1}</p>
            <h3>${esc(model.name)}</h3>
            <p>${esc(model.blurb)}</p>
          </article>`,
          )
          .join('')}
      </div>

      <div class="section-heading section-heading--roomy">
        <p class="label">Questions, answered</p>
        <p class="aside">Straight answers, up front.</p>
      </div>
      <div class="faq-grid">
        ${pickedFaqs
          .map(
            ([question, answer]) => `
          <article class="faq">
            <h3>${esc(question)}</h3>
            <p>${esc(answer)}</p>
          </article>`,
          )
          .join('')}
      </div>
      <footer class="foot">${pageNo(7)}</footer>
    </div>
  </section>`

// 08 — Back cover
const back = `
  <section class="sheet coral back">
    <div class="pad">
      <header class="topbar">
        ${wordmark('#101113')}
        ${pageNo(8)}
      </header>
      <div class="back-body">
        <p class="label label--coral">Have an idea?</p>
        <h2>Let's build<br /><span>something useful.</span></h2>
        <p class="body body--coral">
          Tell us what you're trying to build and we'll help turn the idea into a real product.
          Start with the problem, the opportunity, or the beginning of an idea.
        </p>
        <a class="back-link" href="mailto:${esc(site.email)}">${esc(site.email)} <span>↗</span></a>
      </div>
      <footer class="cover-foot">
        <div><span class="k k--coral">Web</span><span class="v">${esc(site.url.replace('https://', ''))}</span></div>
        <div><span class="k k--coral">Based in</span><span class="v">${esc(site.city)}, ${esc(site.country)} · ${esc(site.utcOffset)}</span></div>
        <div><span class="k k--coral">Revised</span><span class="v">${esc(revisedLabel)}</span></div>
      </footer>
    </div>
  </section>`

/* --------------------------------------------------------------------- css */

const css = `
:root{
  --ink:#101113; --panel:#17181a; --paper:#f2f1ec; --muted:#a8a8a1;
  --lime:#d5f66a; --coral:#ff745e; --violet:#b2a5ff;
  --rule:rgba(242,241,236,.18); --rule-ink:rgba(16,17,19,.18); --rule-ink-2:rgba(16,17,19,.22);
  --dim:#92928c; --dim-2:#bdbdb7; --dim-ink:#706f6a; --plate:#dad8d1;
  --sans:'Manrope',sans-serif; --mono:'DM Mono',monospace;
}
@page{size:210mm 297mm;margin:0;}
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
html,body{background:var(--ink);}
.sheet{position:relative;width:210mm;height:297mm;overflow:hidden;break-after:page;page-break-after:always;}
.sheet:last-child{break-after:auto;page-break-after:auto;}
.sheet.ink{background:var(--ink);color:var(--paper);}
.sheet.paper{background:var(--paper);color:var(--ink);}
.sheet.panel{background:var(--panel);color:var(--paper);}
.sheet.coral{background:var(--coral);color:var(--ink);}
.pad{position:absolute;inset:0;padding:62px 70px;display:flex;flex-direction:column;}

/* type */
.label,.aside,.eyebrow,.k,.doclabel,.model-no,.project-kicker,.project-status,.pageno{
  text-transform:uppercase;letter-spacing:.13em;font-family:var(--mono);font-weight:400;
}
.label{font-size:11px;color:var(--muted);}
.label--coral{color:#713b34;}
.aside{font-size:11px;color:#6e6e68;}
.eyebrow{display:flex;align-items:center;gap:12px;font-size:11px;color:var(--muted);}
.dot{width:6px;height:6px;border-radius:50%;background:var(--lime);box-shadow:0 0 14px var(--lime);}
.hline{height:1px;width:36px;background:var(--rule);margin-left:7px;}
h1{font:800 104px/.9 var(--sans);letter-spacing:-.085em;}
h1 span{color:var(--violet);}
h1 strong{color:var(--coral);}
h2{font:700 50px/1.03 var(--sans);letter-spacing:-.07em;margin:26px 0 30px;}
h2 span{color:var(--violet);}
h2.dark span{color:#8c899c;}
h2.h2-sm{font-size:34px;margin:20px 0 24px;}
.body{font:400 15px/1.75 var(--sans);color:var(--dim-2);max-width:440px;}
.body--ink{color:var(--dim-ink);margin-bottom:16px;}
.body--coral{color:#6d332c;}

/* shared chrome */
.topbar{display:flex;align-items:center;justify-content:space-between;}
.wordmark{display:inline-flex;align-items:center;gap:11px;font:500 13px var(--mono);letter-spacing:.16em;}
.mark{display:block;}
.doclabel{font-size:10px;color:#6d6d69;}
.foot{margin-top:auto;padding-top:20px;display:flex;justify-content:flex-end;}
.pageno{font-size:10px;color:#6d6d69;}
.pageno-dim{color:#4a4a47;}
.section-heading{display:flex;justify-content:space-between;align-items:start;}
.section-heading--spaced{margin-top:38px;}
.section-heading--roomy{margin-top:74px;}
.cover-foot{display:grid;grid-template-columns:repeat(3,auto) 1fr;align-items:end;gap:34px;padding-top:18px;border-top:1px solid var(--rule);}
.cover-foot>div{display:flex;flex-direction:column;gap:7px;}
.k{font-size:9px;color:#6d6d69;}
.k--coral{color:#8a4038;}
.v{font:500 12px var(--mono);letter-spacing:.02em;}
.gridlines{position:absolute;inset:0;opacity:.22;background-image:linear-gradient(rgba(255,255,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:linear-gradient(to bottom,#000,transparent 88%);mask-image:linear-gradient(to bottom,#000,transparent 88%);}
.tri{position:absolute;width:300px;height:240px;bottom:0;right:8%;opacity:.72;clip-path:polygon(50% 0,100% 100%,0 100%);mix-blend-mode:screen;background:linear-gradient(135deg,transparent 49.5%,var(--coral) 50%),linear-gradient(45deg,transparent 49.5%,var(--violet) 50%);}

/* 01 cover */
.cover-body{margin-top:auto;margin-bottom:auto;}
.cover .eyebrow{margin-bottom:30px;}
.cover h1{font-size:96px;}
.cover-bottom{display:flex;align-items:end;justify-content:space-between;gap:40px;margin-top:40px;}
.cover-intro{font:400 14px/1.7 var(--sans);color:var(--dim-2);max-width:340px;}
/* mirrors .hero-stack in App.css */
.hero-stack{position:relative;flex:none;width:228px;height:228px;border:1px solid var(--rule);display:grid;grid-template-columns:1fr 1fr;transform:rotate(-8deg);}
.hero-stack::before{content:'';position:absolute;inset:26px;background:var(--violet);opacity:.17;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);}
.hero-stack span{position:relative;display:grid;place-items:center;padding:10px;border:1px solid rgba(242,241,236,.09);color:var(--paper);font:400 10px var(--mono);letter-spacing:.12em;}

/* 02 about */
.split{display:grid;grid-template-columns:132px 1fr;gap:40px;flex:1;}
.about-main{display:flex;flex-direction:column;justify-content:center;}
.rail{display:flex;flex-direction:column;justify-content:space-between;}
.signal{width:104px;height:104px;border-radius:50%;display:grid;place-items:center;font:31px var(--mono);transform:rotate(-16deg);}
.signal--lime{background:var(--lime);color:var(--ink);}
.signal span{font:19px var(--sans);transform:translate(20px,-14px);}
.principles{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 30px;}
.principles span{border:1px solid var(--rule-ink-2);padding:9px 11px;font:400 11px var(--mono);color:#5d587c;}
.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px;margin:0;border-top:1px solid var(--rule-ink-2);}
.facts>div{padding:14px 0;border-bottom:1px solid var(--rule-ink-2);}
.facts dt{color:var(--dim-ink);font:400 10px var(--mono);text-transform:uppercase;letter-spacing:.12em;}
.facts dd{margin:6px 0 0;font:600 13px/1.5 var(--sans);letter-spacing:-.02em;}

/* 03 services */
.service-list{border-top:1px solid var(--rule);}
.service{display:grid;grid-template-columns:34px 1.15fr 1.5fr 20px;align-items:center;gap:26px;padding:19px 0;border-bottom:1px solid var(--rule);}
.service-number{font:400 12px var(--mono);color:var(--coral);}
.service h3{font:600 23px/1.2 var(--sans);letter-spacing:-.045em;}
.service p{color:var(--dim);font:400 12.5px/1.55 var(--sans);}
.service-arrow{color:var(--lime);font-size:19px;justify-self:end;}

/* 04 toolkit */
.tech-list{border-top:1px solid var(--rule);}
.tech-row{display:grid;grid-template-columns:132px 1fr;align-items:center;gap:26px;padding:16px 0;border-bottom:1px solid var(--rule);}
.tech-row>p{color:var(--muted);font:400 11px var(--mono);text-transform:uppercase;letter-spacing:.1em;}
.tech-row>div{display:flex;flex-wrap:wrap;gap:8px;}
.tech-row span{border:1px solid var(--rule);padding:7px 10px;font:400 11px var(--mono);color:var(--dim-2);}
.industry-list{display:flex;flex-wrap:wrap;gap:8px;}
.industry-list span{border:1px solid var(--rule);padding:9px 12px;font:400 11px var(--mono);color:var(--dim-2);}

/* 05 work */
.project-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:18px;flex:1;}
.project-card{display:flex;flex-direction:column;border:1px solid var(--rule-ink);background:var(--plate);padding:16px;}
.project-art{position:relative;height:112px;overflow:hidden;background:var(--ink);margin-bottom:14px;}
.project-art img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;}
/* mock art for projects with no cover — same shapes as .project-art in App.css */
.project-art i,.project-art b,.project-art em{position:absolute;display:block;}
.project-art i{width:62%;height:50%;left:12%;bottom:18%;border:1px solid rgba(242,241,236,.5);}
.project-art b{width:22%;height:22%;left:18%;top:18%;background:var(--coral);}
.project-art em{width:30%;height:12%;right:14%;bottom:28%;background:var(--violet);}
.project-art--lime b{background:var(--lime);}
.project-art--teal b{background:#2dd4bf;}
.project-art--amber b{background:#f59e0b;}
.project-art .mock-no{position:absolute;right:12px;bottom:10px;font:400 11px var(--mono);color:rgba(242,241,236,.5);}
.project-kicker{font-size:9px;color:#766db2;letter-spacing:.1em;}
.project-card h3{margin:8px 0 7px;font:700 22px/1.05 var(--sans);letter-spacing:-.055em;}
.project-short{font:400 12px/1.5 var(--sans);color:#66645f;}
.project-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
.project-tags span{padding:5px 7px;font:400 9.5px var(--mono);color:#5b5866;border:1px solid rgba(16,17,19,.18);}
.project-status{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:14px;font-size:8.5px;color:#6d6b66;letter-spacing:.06em;white-space:nowrap;}
.status{padding:4px 7px;border:1px solid rgba(16,17,19,.25);font-size:8.5px;}
.status--live{background:rgba(213,246,106,.55);border-color:rgba(16,17,19,.3);}
.status--dev{border-style:dashed;}

/* 06 people */
.founder-list{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.founder{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding-top:16px;border-top:1px solid var(--rule);}
.portrait{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font:400 12px var(--mono);color:var(--ink);border:1px solid var(--rule);}
.portrait--violet{background:var(--violet);}
.portrait--coral{background:var(--coral);}
.portrait--lime{background:var(--lime);}
.founder h3{font:700 16px var(--sans);letter-spacing:-.04em;}
.founder p{font:400 10px var(--mono);text-transform:uppercase;letter-spacing:.08em;color:var(--muted);}
.client-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.client-card{border:1px solid var(--rule);background:var(--panel);padding:14px;display:flex;flex-direction:column;gap:5px;}
.client-logo{background:var(--paper);height:112px;display:grid;place-items:center;padding:14px;overflow:hidden;margin-bottom:11px;}
.client-logo img{max-width:100%;max-height:100%;object-fit:contain;}
.client-card h3{font:700 15px var(--sans);letter-spacing:-.04em;}
.client-card p{font:400 10px var(--mono);color:var(--muted);}

/* 07 delivery */
.model-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.model{border:1px solid var(--rule-ink-2);padding:20px;display:flex;flex-direction:column;gap:10px;}
.model-no{font-size:10px;color:#766db2;}
.model h3{font:700 22px/1.1 var(--sans);letter-spacing:-.05em;}
.model p{font:400 12.5px/1.6 var(--sans);color:var(--dim-ink);}
.faq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0 34px;border-top:1px solid var(--rule-ink-2);}
.faq{padding:16px 0;border-bottom:1px solid var(--rule-ink-2);}
.faq h3{font:700 14px/1.35 var(--sans);letter-spacing:-.03em;}
.faq p{margin-top:7px;font:400 12px/1.6 var(--sans);color:var(--dim-ink);}

/* 08 back */
.back .topbar{padding-bottom:22px;border-bottom:1px solid rgba(16,17,19,.22);}
.back .pageno{color:rgba(16,17,19,.62);}
.back-body{margin-top:auto;margin-bottom:auto;}
.back h2{font-size:66px;color:var(--ink);}
.back h2 span{color:#8f4137;}
.back .back-link{display:inline-block;margin-top:38px;padding-bottom:9px;border-bottom:1px solid var(--ink);font:600 18px var(--mono);color:var(--ink);}
.back .cover-foot{border-top:1px solid rgba(16,17,19,.22);}
`

/* --------------------------------------------------------------------- run */

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${esc(site.name)} — Company Overview</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <style>${css}</style>
  </head>
  <body>
    ${cover}
    ${about}
    ${serviceRows}
    ${toolkit}
    ${work}
    ${people}
    ${delivery}
    ${back}
  </body>
</html>
`

await mkdir(workDir, { recursive: true })
await writeFile(htmlPath, html, 'utf8')
console.log(`html   ${path.relative(root, htmlPath)}`)
console.log(`covers ${magick ? `scaled to ${COVER_WIDTH}px via ${magick}` : 'originals (ImageMagick not found)'}`)

await run(
  'google-chrome',
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--font-render-hinting=none',
    '--virtual-time-budget=20000',
    '--run-all-compositor-stages-before-draw',
    '--no-pdf-header-footer',
    `--user-data-dir=${path.join(workDir, 'chrome-profile')}`,
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
  ],
  { cwd: root },
)

console.log(`pdf    ${path.relative(root, pdfPath)}`)