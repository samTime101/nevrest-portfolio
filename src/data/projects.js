export const projects = [
  {
    slug: 'omedate',
    no: '01',
    status: 'Live',
    kicker: 'Social / Realtime — Featured',
    title: 'OmeDate',
    tagline: 'Random video chat & Blind Date.',
    short:
      'Talk to strangers instantly worldwide. Random video chat or 60-second voice-only Blind Date mode — no filters, just real people.',
    description:
      'OmeDate is our live social experiment: instant random video chat paired with a Blind Date mode. No profiles to polish, no feeds to scroll — you meet a stranger, talk, and decide what happens next. Blind Date rounds are 60 seconds, voice-only, with no filters.',
    url: 'https://omedate.nevrestlabs.com/',
    urlLabel: 'omedate.nevrestlabs.com',
    tags: ['WebRTC', 'Realtime', 'Video chat', 'Social'],
    stack: ['React', 'WebRTC', 'WebSockets', 'Cloudflare'],
    accent: 'coral',
    year: '2025 — Present',
    cover: '/work/omedate-home.png',
    shots: [
      {
        src: '/work/omedate-home.png',
        alt: 'OmeDate home screen with Random Chat and 60-second Blind Date options',
        caption: 'Home — Random Chat and 60-second Blind Date entry · omedate.nevrestlabs.com',
      },
    ],
    stats: [
      { value: '60s', label: 'Blind Date rounds' },
      { value: '2', label: 'Modes — video + blind' },
      { value: '0', label: 'Filters. Voice only.' },
    ],
    highlights: [
      {
        title: 'Random video chat',
        text: 'One tap and you are talking to a stranger somewhere in the world. Skip, stay, or start over — the loop is instant.',
      },
      {
        title: 'Blind Date mode',
        text: '60 seconds, voice only, no video preview. Personality first, faces later. The constraint is the feature.',
      },
      {
        title: 'Built for the moment',
        text: 'No accounts to curate, no history to perform. Each session is disposable by design — low stakes, high spontaneity.',
      },
    ],
    next: 'Meet someone new in under 10 seconds. If the vibe is right, keep talking. If not, next.',
  },
  {
    slug: 'nepse-terminal',
    no: '02',
    status: 'In development',
    kicker: 'FinTech / Research — NEPSE',
    title: 'NEPSE Terminal',
    tagline: 'An all-in-one Nepal Stock Exchange companion for studying & learning.',
    short:
      'Live market prices, model-generated stock ideas, real-time signals, model transparency, and plain-English guides. A research environment — not financial advice.',
    description:
      'NEPSE Terminal is an all-in-one Nepal Stock Exchange companion built for studying and learning. It combines live market data with computer-generated ideas, real-time signals during market hours, an inspectable ML pipeline, and ~50 plain-English lessons — so you can examine data, model performance, and history before making your own decisions.',
    tags: ['NEPSE', 'FinTech', 'ML research', 'Education'],
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Python ML'],
    accent: 'lime',
    year: '2025 — Present',
    screenshotNote: 'Screenshots coming soon.',
    cover: '/work/nepse-market.png',
    videoId: 'wz4SCfzD7Yk',
    videoCaption: 'NEPSE Terminal walkthrough',
    shots: [
      {
        src: '/work/nepse-market.png',
        alt: 'NEPSE Terminal market overview with breadth stats and live market feed',
        caption: 'Market Overview — breadth, turnover and the live market feed, updating every 30s',
      },
      {
        src: '/work/nepse-backtest.png',
        alt: 'NEPSE Terminal Model Lab backtest equity curves and strategy returns',
        caption: 'Model Lab — Top-5 5D (+21.5%) and 20D (+26.9%) backtest equity from Rs. 500k, fees + slippage included',
      },
    ],
    stats: [
      { value: '292', label: 'Stocks covered' },
      { value: '118', label: 'Model features' },
      { value: '0–100', label: 'Live signal rank' },
      { value: '~50', label: 'Plain-English lessons' },
    ],
    highlights: [
      {
        title: 'Market Overview',
        text: 'Complete market snapshot — advancers, decliners, flat stocks, LTP, price changes, volume, turnover, sectors, search, sorting, pagination, and company popups with 52-week position and recent trading history.',
      },
      {
        title: 'AI Picks',
        text: 'Model-generated 1-day, 5-day and 20-day predictions ranked by expected return, rising probability and market outlook — compared against live prices and history with hit rates, predicted-vs-actual returns, rank IC, backtests, Sharpe, drawdowns and trade counts.',
      },
      {
        title: 'Live Signals',
        text: 'Available only when the market is open. Ranks stocks 0–100 on trend, momentum, breakout and volume — with entry, stop-loss, targets, risk % and technical explanations, refreshing every 30 seconds.',
      },
      {
        title: 'Model Lab',
        text: 'The ML system exposed: version, 118 features, 292 stocks, train / validation / test periods, out-of-sample accuracy, AUC, ranking performance, backtest equity curves, strategy returns — plus a Train → Test → Simulate → Publish pipeline with live progress and console output.',
      },
      {
        title: 'Learn + Layman Mode',
        text: 'Around 50 plain-English explainers — Sharpe, RSI, stop-loss, breadth, T+2, circuits, NEPSE rules — with examples, graphs, real-life scenarios, search and filters. Layman Mode adds explanations throughout the app.',
      },
    ],
    extras: ['Market OPEN / CLOSED badge with live NEPSE index', 'Terminal + Ember themes', 'Configurable backend + persistent preferences'],
    next: 'Study the market, interrogate the model, then decide for yourself.',
  },
  {
    slug: 'onecompiler',
    no: '06',
    hidden: true,
    status: 'In progress',
    kicker: 'Developer tools — Education',
    title: 'OneCompiler',
    tagline: 'Write and run code instantly in the browser.',
    short:
      'Our own online compiler — fast, shareable, and built for learning and quick experiments. No setup, just code and run.',
    description:
      'OneCompiler is our in-progress online compiler: a zero-setup place to write, run and share code from the browser. It is aimed at learners, interviews, and quick experiments — open a link, type code, see output, share it on.',
    tags: ['Compiler', 'DevTools', 'Education', 'Web'],
    stack: ['React', 'Sandboxed runners', 'WebSockets', 'Docker'],
    accent: 'violet',
    year: '2026 — In build',
    stats: [
      { value: '0', label: 'Setup to run code' },
      { value: 'N', label: 'Languages planned' },
      { value: '1', label: 'Link to share' },
    ],
    highlights: [
      {
        title: 'Instant run',
        text: 'No installs, no project scaffolding. Open the page, pick a language, press run — output in seconds.',
      },
      {
        title: 'Built for learning',
        text: 'Clean defaults, readable errors, and shareable snippets make it ideal for teaching, practice and demos.',
      },
      {
        title: 'Shareable by URL',
        text: 'Every snippet gets a link. Send it to a friend, a classroom, or an interviewer — they see the same code and result.',
      },
    ],
    roadmap: ['Multi-language runners', 'Share links + embeds', 'Classroom-friendly defaults'],
    next: 'Currently in build — shaping the fastest path from idea to running code.',
  },
  {
    slug: 'automation-suite',
    no: '03',
    status: 'Live',
    kicker: 'Desktop / Automation — Shipped',
    title: 'Automation Suite',
    tagline: 'Record once. Replay forever.',
    short:
      'Python-based desktop app that streamlines repetitive marketing and data workflows — GUI workflow recording, CSV tools, contact scraping, and SMTP bulk email in one window.',
    description:
      'Nevrest Labs Automation Suite is a Python-based desktop application designed to streamline repetitive digital marketing and data-management workflows. The platform combines a GUI workflow recorder, CSV cleaning and merging tools, website contact scraping, and SMTP-based bulk email automation — with live progress tracking and structured JSON/CSV exports throughout.',
    tags: ['Automation', 'Python', 'Desktop', 'Marketing'],
    stack: ['Python', 'Desktop GUI', 'SMTP', 'CSV / JSON'],
    accent: 'amber',
    year: 'In use — internal',
    cover: '/work/automation-suite.png',
    videoId: 'P7rEVGPEEGk',
    videoCaption: 'Automation Suite walkthrough — recorder, scraper and bulk email in action',
    shots: [
      {
        src: '/work/automation-suite.png',
        alt: 'Automation Suite workflow recorder with record, run and stop controls',
        caption: 'Workflow Recorder — mouse + keyboard capture with paginated replay',
      },
    ],
    stats: [
      { value: '4', label: 'Modules in one window' },
      { value: 'F8–F11', label: 'Hotkey-driven control' },
      { value: 'CSV/JSON', label: 'Structured exports' },
    ],
    highlights: [
      {
        title: 'Workflow Recorder',
        text: 'Capture mouse and keyboard actions, then replay them with pagination support — F8 to record, F9 to stop, F10 to run, F11 as emergency stop, with URL templates, page ranges and speed control.',
      },
      {
        title: 'CSV Cleaner',
        text: 'Cleaning and merging tools that turn messy contact and campaign spreadsheets into structured, send-ready data.',
      },
      {
        title: 'Contact Scraper',
        text: 'Website contact extraction across paginated results — resumable runs, live progress, and JSON/CSV export.',
      },
      {
        title: 'Bulk Email',
        text: 'SMTP-based bulk sending with customizable templates, per-run progress tracking, and a full activity log.',
      },
    ],
    extras: ['Mouse + keyboard replay', 'Paginated workflows', 'Resumable scraping', 'Live progress + activity log'],
    next: 'Repetitive work, recorded once and replayed forever.',
  },
  {
    slug: 'mail-studio',
    no: '04',
    status: 'Live',
    kicker: 'Web / Automation — Shipped',
    title: 'Mail Studio',
    tagline: 'Campaigns as flows.',
    short:
      'Visual email workflow automation built with React and React Flow — import JSON records, loop recipients, add delays, and send personalized campaigns through a protected mail API.',
    description:
      'Mail Studio is a visual email workflow automation platform built with React and React Flow. It enables users to create and run personalized email campaigns by importing JSON records, looping through recipients, adding timed delays, and inserting dynamic fields into email addresses, subjects, text, and HTML content. The platform includes a secure login system, light and dark themes, workflow monitoring, live execution logs, and server-side email delivery to keep SMTP credentials out of the browser. It is deployed with Vite and Vercel and connects to a protected backend mail API for reliable message delivery.',
    tags: ['Automation', 'React', 'React Flow', 'Email'],
    stack: ['React', 'React Flow', 'Vite', 'Vercel', 'Mail API'],
    accent: 'lime',
    year: 'Shipped — in use',
    cover: '/work/mail-studio.png',
    shots: [
      {
        src: '/work/mail-studio.png',
        alt: 'Mail Studio renewal outreach flow with trigger, loop, wait and email nodes',
        caption: 'Renewal outreach — trigger → loop → wait → email, with dynamic fields in every message',
      },
    ],
    stats: [
      { value: 'JSON', label: 'Record-driven runs' },
      { value: '0', label: 'SMTP secrets in browser' },
      { value: '2', label: 'Light + dark themes' },
    ],
    highlights: [
      {
        title: 'Visual flow builder',
        text: 'Drag-and-drop React Flow canvas — trigger on incoming data, loop for each record, wait between sends, then deliver. Pan, zoom, and inspect every node.',
      },
      {
        title: 'Dynamic fields',
        text: 'Insert {email}, {org_name}, {first_name} and {renewal_date} into recipients, subjects, text and HTML — every message personal, every run repeatable.',
      },
      {
        title: 'Timed, paced delivery',
        text: 'Wait nodes pace each send (e.g. 2 seconds between emails) so campaigns go out steadily instead of all at once.',
      },
      {
        title: 'Secure by design',
        text: 'Login-protected workspaces with server-side delivery through a guarded mail API — SMTP credentials never touch the browser.',
      },
    ],
    extras: ['Workflow monitoring', 'Live execution logs', 'JSON view + expressions', 'Vite + Vercel deploy'],
    next: 'Campaigns as flows — designed visually, delivered reliably.',
  },
  {
    slug: 'justodo',
    no: '05',
    status: 'Live',
    kicker: 'VS Code Extension — Shipped',
    title: 'justodo',
    tagline: 'TODOs with human-readable IDs.',
    short:
      'Lightweight VS Code extension that stamps TODO comments with unique HUIDs and keeps them synced in a workspace-local JSON store.',
    description:
      'justodo is a lightweight VS Code extension that adds human-readable IDs (HUIDs) to TODO comments and keeps them synced in a workspace-local JSON store. Write a TODO, stamp it with a unique timestamped ID, mark it done, or jump to any TODO via Quick Pick — with language-aware comment symbols for 30+ languages and per-project storage under .todos/todos.json.',
    url: 'https://marketplace.visualstudio.com/items?itemName=SamTIme101.justodo',
    urlLabel: 'VS Code Marketplace',
    videoId: 'HQSLscpNsUI',
    videoCaption: 'justodo demo — stamp, complete and search TODOs',
    tags: ['VS Code', 'Extension', 'TypeScript', 'DX'],
    stack: ['TypeScript', 'VS Code API', 'Node 18+', 'JSON store'],
    accent: 'violet',
    year: 'Shipped — v1.0.3',
    stats: [
      { value: '30+', label: 'Languages supported' },
      { value: 'HUID', label: 'Human-readable IDs' },
      { value: '4', label: 'Keybindings' },
    ],
    highlights: [
      {
        title: 'Stamp a HUID',
        text: 'Run todos.createTodo (Ctrl+Shift+6) on any TODO line — it becomes // TODO<YYYYMMDD-HHMMSS>: handle empty state and gets recorded in .todos/todos.json.',
      },
      {
        title: 'Mark done',
        text: 'todos.markTodo (Ctrl+Shift+7) removes the line and flips the entry to done with a timestamp — the log stays truthful.',
      },
      {
        title: 'Jump to any TODO',
        text: 'todos.searchTodos (Ctrl+Shift+8) searches the current file; todos.searchAllTodos (Ctrl+Shift+9) searches the workspace — pick from Quick Pick and land on the line.',
      },
      {
        title: 'Language-aware + local',
        text: 'Correct comment symbols across 30+ languages (JS/TS, Python, Go, Rust, HTML, CSS…), with storage scoped per workspace so each project keeps its own TODO log.',
      },
    ],
    extras: ['Marketplace + VSIX install', 'F5 debug launch config', 'Lint + type-check + tests'],
    next: 'TODOs you can reference, search, and actually finish.',
  },
]

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}
