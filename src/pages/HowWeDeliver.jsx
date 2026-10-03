import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, Nav } from '../components/SiteChrome.jsx'
import Seo from '../components/Seo.jsx'
import { breadcrumb, deliveryModelsNode, faqPage, webPage } from '../lib/schema.js'
import { pageDescriptions, pageTitles } from '../data/site.js'
import '../howdeliver.css'

const subNav = [
  ['#team', 'Team'],
  ['#flow', 'Lifecycle'],
  ['#models', 'Models'],
  ['#workflows', 'How it works'],
  ['#faq', 'Client Q&A'],
  ['#scope', 'What we work on'],
  ['#core', 'Core team'],
  ['#partners', 'Partnerships'],
  ['#start', 'Start'],
]

const leads = [
  {
    tone: 'o',
    tag: 'Outside delivery',
    title: 'Business Development',
    text: 'Finds and qualifies work, agrees the deal, and handles NDAs, contracts and official paperwork.',
  },
  {
    tone: 'o',
    tag: 'Outside delivery',
    title: 'Client Communication',
    text: 'Runs discovery. Your single point of contact, start to finish.',
  },
  {
    tone: 'h',
    tag: 'Inside delivery',
    title: 'Technical Lead',
    text: 'Decides how it is engineered and reviews the technical work.',
  },
  {
    tone: 'h',
    tag: 'Inside delivery',
    title: 'Delivery Lead',
    text: 'Plans, schedules and tracks the work.',
  },
]

const entrySteps = [
  ['o', 'Lead generation'],
  ['o', 'Qualification'],
  ['o', 'NDA'],
  ['o', 'Discovery'],
  ['h', 'Feasibility and capacity check'],
  ['o', 'Model selected'],
  ['o', 'Proposal and agreement'],
  ['o', 'Paperwork and compliance'],
  ['h', 'Handover to delivery'],
]

const models = [
  {
    tag: 'Model 1',
    title: 'Staff augmentation',
    blurb: 'Our engineers join your team.',
    rows: [
      ['Who directs work', 'You'],
      ['Nevrest owns', 'Engineer quality and availability'],
      ['Best when', 'You have a team and lead, and need people'],
    ],
  },
  {
    tag: 'Model 2',
    title: 'Dedicated team',
    blurb: 'A stable team for your product, incl. reserved-capacity retainer.',
    rows: [
      ['Who directs work', 'You set priorities; we manage the team'],
      ['Nevrest owns', 'Team, technical work, cycle delivery'],
      ['Best when', 'Ongoing product with changing backlog'],
    ],
  },
  {
    tag: 'Model 3',
    title: 'Project-based',
    blurb: 'Defined scope, delivered to acceptance.',
    rows: [
      ['Who directs work', 'We do, against agreed scope'],
      ['Nevrest owns', 'Everything from scope to acceptance'],
      ['Best when', 'Clear outcome, no team on your side'],
    ],
  },
]

const workflows = [
  {
    badge: 'MODEL 1',
    title: 'Staff augmentation',
    intro: 'Our engineers join your team. You keep product ownership, task assignment and architecture.',
    steps: [
      ['o', 'Skill profile'],
      ['h', 'Sourcing'],
      ['o', 'Verification and approval'],
      ['h', 'Onboarding'],
      ['h', 'Ongoing support'],
      ['o', 'Renew / replace / end'],
    ],
    recap: [
      ['You', 'confirm the profile, approve each candidate, direct the daily work.'],
      ['We', 'source and verify engineers, manage availability, and replace anyone who is not the right fit.'],
      [
        'How we communicate',
        'your Client Communication Lead is your contact for anything about the engagement. Our engineers work directly inside your team and tools. We check in at agreed intervals to collect your feedback, and we confirm decisions by email.',
      ],
    ],
  },
  {
    badge: 'MODEL 2',
    title: 'Dedicated team',
    intro: 'A stable team on your product, with reserved hours if you want a retainer. We manage the team and delivery.',
    steps: [
      ['o', 'Team design'],
      ['h', 'Assembly'],
      ['o', 'Kickoff and planning'],
      ['h', 'Recurring cycle'],
      ['o', 'Review and adjust'],
      ['o', 'Renew'],
    ],
    recap: [
      ['You', 'set priorities, join the periodic review, approve changes to the team.'],
      ['We', 'build and run the team, plan each cycle, and send regular progress updates with any decisions we need.'],
      [
        'How we communicate',
        'your Client Communication Lead is your single contact. You get a weekly progress update that calls out any decision we need from you, plus a periodic review call. We work in your channels or ours, and confirm decisions by email.',
      ],
    ],
  },
  {
    badge: 'MODEL 3',
    title: 'Project-based',
    intro: 'A defined project delivered from scope to acceptance.',
    steps: [
      ['o', 'Scope'],
      ['h', 'Decompose'],
      ['h', 'Team'],
      ['o', 'Plan'],
      ['h', 'Execute'],
      ['o', 'Monitor and change'],
      ['o', 'QA and demo'],
      ['o', 'Delivery'],
    ],
    table: [
      ['Scope', 'Confirms feasibility', 'Defines scope, deliverables, acceptance criteria', 'Confirms scope with you'],
      ['Decompose', 'Architecture; technical estimate and risks', 'Modules, milestones, dependencies', ''],
      ['Team', 'Defines roles and skills', 'Defines capacity and schedule; assembles team', ''],
      ['Plan', 'Fixes technology and standards', 'Project plan with owners and dates', 'Gets your approval of plan and your actions'],
      ['Execute', 'Reviews all technical work', 'Assigns work; tracks against plan', 'Sends regular progress updates'],
      ['Monitor and change', 'Assesses technical impact of changes', 'Manages risks, blockers, change register; replans', 'Handles change requests with you'],
      ['QA and demo', 'Validates against acceptance criteria', 'Coordinates testing and fixes', 'Runs demo and your review'],
      ['Delivery', 'Deployment; technical documentation', 'Handover package; closure', 'Obtains your acceptance'],
    ],
    recap: [
      ['You', 'confirm scope and plan, review demos, approve any change to cost or dates.'],
      ['We', 'estimate, plan, build and test, keep you updated, and hand over documentation and access.'],
      [
        'How we communicate',
        'your Client Communication Lead is your single contact. You get regular progress updates and a demo at each milestone. Any change to cost or dates is agreed with you in writing before work continues.',
      ],
    ],
  },
]

const exitSteps = [
  ['h', 'Delivery complete'],
  ['o', 'Your feedback'],
  ['h', 'Handover and closure'],
  ['o', 'Continue, expand or close'],
]

const faqGroups = [
  {
    title: 'Budget and payment',
    items: [
      [
        'How much will this cost?',
        'It depends on the model. Project-based work is quoted as a fixed price for the agreed scope. Staff augmentation and dedicated teams are priced per person or role, per month. Rates are set out in your proposal. You see the full number in writing before anything starts.',
      ],
      [
        'How do you arrive at the number?',
        'During discovery our Technical Lead estimates the engineering and our Delivery Lead estimates schedule and team size. You get the result with the assumptions behind it, so you can see what drives the cost.',
      ],
      [
        'Our budget is limited. Can we still start?',
        'Yes. Tell us your ceiling in the first call. We will shrink the first release to what fits and plan the rest as later phases, rather than stretch a small budget across everything.',
      ],
      [
        'What if the scope changes midway?',
        'Every change goes through a change register. Our Technical Lead checks the technical impact, our Delivery Lead the time impact, and Client Communication brings you the revised cost and date. Nothing extra is built or billed until you approve it.',
      ],
      [
        'Are there costs outside your fee?',
        'Third-party items such as hosting, licences, app-store fees and paid APIs are listed in the proposal and billed to your own accounts where possible, so nothing appears as a surprise.',
      ],
      [
        'How and when do we pay?',
        'Project work is paid against milestones. Staff and team engagements are paid monthly. The exact schedule sits in the agreement.',
      ],
    ],
  },
  {
    title: 'Timeline and start',
    items: [
      [
        'How long will it take?',
        'You get a dated milestone plan for approval before execution begins. It comes from our Delivery Lead’s schedule and the Technical Lead’s estimate, not a guess.',
      ],
      [
        'When can we start?',
        'After the agreement is signed and handover to delivery is complete. For staff augmentation the start date depends on sourcing and your approval of candidates. We give you that date at proposal stage.',
      ],
      [
        'What if we fall behind?',
        'Our Delivery Lead tracks risks and blockers continuously. If a date is at risk you hear it from us in the next update, together with the recovery plan and any decision we need from you.',
      ],
    ],
  },
  {
    title: 'Communication',
    items: [
      ['Who is my contact?', 'One person: your Client Communication Lead, from discovery to close. You never have to work out who to ask.'],
      [
        'Will I speak with the engineers?',
        'In staff augmentation, yes, they work inside your team. In other models, our leads speak to you and engineers join calls where useful. Working hours and overlap (we are in Kathmandu, UTC+5:45) are agreed at kickoff.',
      ],
      [
        'How will I know what is happening?',
        'Regular progress updates (weekly for teams), decisions needed from you called out clearly, periodic reviews, and a demo before you accept a project.',
      ],
    ],
  },
  {
    title: 'Quality, ownership and risk',
    items: [
      [
        'Do we have to share confidential details to get started?',
        'No. We can give you a first, conditional answer from non-sensitive basics such as the product type, stack and timeline. Confidential briefs and end-client details come only after an NDA, and an agency never has to name its end client.',
      ],
      [
        'Who owns the code and the product?',
        'You do. Ownership is written into the agreement and we hand over source, documentation and access at exit. The exact terms are in your agreement.',
      ],
      [
        'How do you protect our confidential information?',
        'Confidentiality is agreed before we go deep into your requirements, and access rules are set at onboarding. Access rules and security practices are agreed in your proposal.',
      ],
      [
        'How do you make sure the work is good?',
        'Our Technical Lead reviews the technical work throughout and validates the result against acceptance criteria you approved. A project is only closed when you accept it.',
      ],
      [
        'What if an engineer is not the right fit?',
        'Tell your Client Communication Lead. We run the replacement process: the Technical Lead verifies the new person and the Delivery Lead manages the transition.',
      ],
      [
        'What happens after launch?',
        'You receive the handover package. At exit we discuss support, continuation or new work, and you can move into a dedicated team or retainer. Support terms are set out in your proposal.',
      ],
    ],
  },
  {
    title: 'Contracts and paperwork',
    items: [
      [
        'Who handles the NDA, contract and invoicing?',
        'Our Business Development Lead. You sign an NDA first, then a master agreement and a statement of work covering scope, payment terms, ownership and confidentiality. Your Client Communication Lead stays your contact for everything else. Agreement templates: in preparation.',
      ],
      [
        'What paperwork do you need from us?',
        'Company details, an authorized signatory, tax and invoicing information, and any compliance requirements your industry or country adds. We ask only for what the agreement needs.',
      ],
      [
        'Do you handle legal and regulatory requirements?',
        'We coordinate and flag them, and our Technical Lead covers the technical side. We don’t give legal advice, so where terms or compliance matter we recommend each side gets its own legal review. Governing law: agreed in the contract.',
      ],
    ],
  },
  {
    title: 'Fit',
    items: [
      [
        'I am not technical, or not sure what I need.',
        'That is what discovery is for. We turn your goals into requirements and a recommended model in plain language, and you confirm before anything is signed.',
      ],
      [
        'Can we change models later?',
        'Yes, at review points. A finished project can become a dedicated team, or a team can scale up or down as needs change.',
      ],
      [
        'We are an agency. Can you work behind our brand?',
        'Yes. That is our white-label overlay: we talk only to you, follow your reporting format, and never contact your end client unless you say so.',
      ],
    ],
  },
]

const fitAnswers = [
  {
    tag: 'A · In our arsenal',
    tone: 'a',
    title: 'We have the people',
    text: 'The product matches skills our team has already shipped. We move straight to model selection and planning.',
  },
  {
    tag: 'B · Needs assessment',
    tone: 'b',
    title: 'We’d have to build the team',
    text: 'New to us, or beyond our current depth. Our Technical Lead defines the skill profile, our Delivery Lead checks capacity, and every person is verified. You are told this is new ground, and we only commit if we can dedicate a team that meets the bar.',
  },
  {
    tag: 'C · Not a fit',
    tone: 'c',
    title: 'We say so, early',
    text: 'For example work that needs formal certification or safety sign-off we can’t provide. You hear it before any proposal, not after.',
  },
]

const stages = [
  [
    '1 · Before any NDA',
    'Only non-sensitive basics: type of product (e.g. web app, mobile, data platform), stack, whether it is regulated, engagement type, rough team size and timeline. No client names, no code, no documents.',
    'A conditional answer: A, B or C, with what it depends on',
  ],
  [
    '2 · After the NDA',
    'The product brief or requirements, existing architecture, and context on the end client if you’re comfortable sharing it.',
    'A confirmed fit and a recommended model',
  ],
  [
    '3 · Only if it’s category B',
    'A short call between your technical person and our Technical Lead, to close specific gaps.',
    'A clear commit, or an honest no',
  ],
]

const fallbackCards = [
  {
    title: 'Agency, end client is confidential',
    text: 'Describe the product and industry in general terms. The end client’s name is never required. Our white-label rules apply from the first message.',
  },
  {
    title: 'You don’t have a brief yet',
    text: 'Common and fine. Tell us the goal in plain words and we work it out in discovery, where Client Communication turns it into requirements.',
  },
  {
    title: 'You can’t share anything yet',
    text: 'Then any answer we give is only conditional, and we’ll say so. Nothing is promised until the fit is confirmed at stage 2.',
  },
]

const coreCards = [
  {
    tag: 'Build',
    title: 'What we build',
    pills: ['Web and mobile', 'Backend and APIs', 'Cloud and SaaS', 'UI/UX', 'Automation', 'AI/ML', 'Custom software'],
  },
  {
    tag: 'Domains',
    title: 'Where we work',
    pills: ['E-commerce', 'IoT', 'Embedded systems', 'Gaming', 'Blockchain', 'Engineering', 'IT'],
  },
  {
    tag: 'Process',
    title: 'How we work',
    pills: ['Agile', 'Scrum', 'Kanban'],
  },
]

const coreStack = [
  ['Product management', 'Agile, Scrum, Kanban'],
  ['QA', 'Selenium, Appium, JUnit, Burp Suite'],
  ['Web', 'React.js, Node.js, JavaScript, AngularJS, HTML5 / CSS3, jQuery, ASP.NET MVC, WordPress'],
  ['Mobile', 'React (hybrid), Dart, Java, C# / .NET'],
  ['Backend', 'Node.js, ASP.NET, Entity Framework, Java / J2EE, Python, SQL, NoSQL'],
  ['APIs', 'Web Services, JSON, XML, AJAX'],
  ['Cloud', 'AWS, Cloudfare, Vercel'],
  ['SaaS', 'ERP, CRM, HRM'],
  ['Automation', 'Python, PowerShell, Bash Scripting'],
]

const partnerships = [
  {
    number: '01',
    title: 'Referral partnerships',
    text: 'You introduce a client who needs software built, and we take it from there. A single introduction, not an ongoing exchange.',
    who: 'Agencies, consultants, designers, freelancers and advisors who meet clients needing development they do not offer themselves.',
    how: 'You make the introduction. Our Client Communication Lead runs discovery and the fit check, and keeps you updated at agreed points. You do not deliver or manage anything.',
    agreed: 'How the referral is recognised, whether a reward or a referral back, set in writing before the first introduction. The client agrees to be contacted.',
  },
  {
    number: '02',
    title: 'Lead sharing',
    text: 'A two-way, ongoing exchange of opportunities. Leads that do not fit one side go to the partner who suits them.',
    who: 'Agencies and studios whose work overlaps with ours or sits next to it, and who regularly see leads that do not fit.',
    how: 'When a lead is outside our scope, capacity or fit check, we pass it to a partner who suits it. When a partner has one that fits our work, they pass it to us. Business Development records who sent what and when, so credit is clear.',
    agreed: 'An NDA first. What is shared and what is not, who owns the relationship with each lead, and how credit is recorded.',
  },
  {
    number: '03',
    title: 'SaaS growth partnerships',
    text: 'Engineering capacity for SaaS products that need to grow, and for the partners who serve them.',
    who: 'SaaS founders and product teams with a roadmap bigger than their team, and growth, product or marketing partners whose SaaS clients need things built.',
    how: 'SaaS companies take a dedicated team or staff augmentation to ship roadmap work, integrations and improvements, with a reserved-hours retainer for steady progress. Growth partners hand us the engineering that follows their strategy, such as onboarding flows, integrations, billing and analytics. We build it behind them, white-label if they prefer.',
    agreed: 'Which model (staff augmentation or dedicated team), who speaks to the SaaS company, the reporting format, and what stays confidential.',
  },
  {
    number: '04',
    title: 'Software development partnerships',
    text: 'Build capacity when you need it, and specialist skills when we do.',
    who: 'Agencies, studios, consultancies and product companies that want delivery capacity without hiring for it.',
    how: 'Take projects, staff augmentation or dedicated teams, with white-label when you keep the end client. It works the other way too: if we need skills or reach we lack, we bring in a partner. When a client wants international delivery, such as local presence or a legal entity, time-zone coverage, local language or market knowledge, or regional compliance, we either bring a partner in or export our services to theirs.',
    agreed: 'Which model, who owns the client relationship, how we report, and the same fit check as section 06. If it is not a fit, we say so early.',
  },
  {
    number: '05',
    title: 'Revenue-sharing opportunities',
    text: 'Where a partner helps win or deliver the work, we can share the revenue. It is not automatic in every partnership. It applies only where we agree it.',
    who: 'Partners who bring recurring or substantial work, or who deliver part of a project jointly with us.',
    how: 'It can take three shapes: a share when a referred client signs; a share of recurring revenue on ongoing work such as a dedicated team; or a split on a jointly delivered project, based on who does what.',
    agreed: 'What triggers the share, which payments it covers, for how long, how it is reported and when it is paid. Nothing is promised until it is written. Figures are agreed per partner.',
  },
]

const partnershipGlance = [
  ['Referral', 'An introduction to a client', 'Discovery, fit check, delivery', 'Agreed reward or referral back'],
  ['Lead sharing', 'Leads that fit us', 'Pass on leads that fit you', 'Opportunities in both directions'],
  ['SaaS growth', 'A SaaS product or SaaS client', 'Build the roadmap and integrations', 'Faster shipping, or a built-in delivery arm'],
  ['Software development', 'Projects, or your own client work', 'Projects, staff augmentation, dedicated teams', 'Capacity without hiring, skills both ways'],
  ['Revenue-sharing', 'Recurring or joint work', 'Deliver, report, pay as agreed', 'A share of revenue, set in writing'],
]

const partnershipStart = [
  ['o', 'Intro conversation'],
  ['h', 'Fit and capacity check'],
  ['o', 'NDA'],
  ['o', 'Terms of exchange'],
  ['o', 'Proposal and agreement'],
  ['h', 'First engagement'],
]

function LifecycleDiagram() {
  return (
    <div className="hd-diagram">
      <svg viewBox="0 0 900 250" role="img" aria-label="Engagement lifecycle: entry, delivery, exit">
        <defs>
          <marker id="hd-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8z" fill="#FF5A45" />
          </marker>
        </defs>

        <rect x="10" y="30" width="250" height="150" fill="#BF8CFF" fillOpacity=".18" stroke="#BF8CFF" strokeWidth="2" />
        <rect x="325" y="30" width="250" height="150" fill="#CDFF4D" fillOpacity=".45" stroke="#7d9a10" strokeWidth="2" />
        <rect x="640" y="30" width="250" height="150" fill="#BF8CFF" fillOpacity=".18" stroke="#BF8CFF" strokeWidth="2" />

        <text className="hd-diagram-m" x="10" y="20">PART 1 · SAME FOR ALL MODELS</text>
        <text className="hd-diagram-m" x="325" y="20">PART 2 · CHANGES BY MODEL</text>
        <text className="hd-diagram-m" x="640" y="20">PART 3 · SAME FOR ALL MODELS</text>

        <text x="28" y="66" fontSize="24" fontWeight="800">Entry</text>
        <text x="343" y="66" fontSize="24" fontWeight="800">Delivery</text>
        <text x="658" y="66" fontSize="24" fontWeight="800">Exit</text>

        <text x="28" y="98" fontSize="13">Lead → Qualify → NDA → Discovery →</text>
        <text x="28" y="118" fontSize="13">Feasibility → Model → Contract</text>
        <text x="28" y="138" fontSize="13">→ Paperwork → Handover</text>

        <text x="343" y="98" fontSize="13">Technical Lead + Delivery Lead</text>
        <text x="343" y="118" fontSize="13">+ project team run the</text>
        <text x="343" y="138" fontSize="13">chosen model&apos;s workflow</text>

        <text x="658" y="98" fontSize="13">Feedback → Closure and</text>
        <text x="658" y="118" fontSize="13">lessons → Continue,</text>
        <text x="658" y="138" fontSize="13">expand or close</text>

        <line x1="262" y1="105" x2="322" y2="105" stroke="#FF5A45" strokeWidth="2.5" markerEnd="url(#hd-arrow)" />
        <line x1="577" y1="105" x2="637" y2="105" stroke="#FF5A45" strokeWidth="2.5" markerEnd="url(#hd-arrow)" />

        <text className="hd-diagram-m" x="28" y="168">BIZ DEV + CLIENT COMM</text>
        <text className="hd-diagram-m" x="343" y="168">TECH LEAD + DELIVERY LEAD</text>
        <text className="hd-diagram-m" x="658" y="168">CLIENT COMM + BIZ DEV</text>

        <rect x="10" y="205" width="880" height="34" fill="none" stroke="#FF5A45" strokeDasharray="5 4" />
        <text x="450" y="227" textAnchor="middle" fontSize="13" fontWeight="600">
          Client Communication stays your single contact across all three parts
        </text>
      </svg>
    </div>
  )
}

function FitDiagram() {
  return (
    <div className="hd-diagram">
      <svg viewBox="0 0 900 260" role="img" aria-label="Product fit check with three outcomes">
        <defs>
          <marker id="hd-arrow-fit" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8z" fill="#FF5A45" />
          </marker>
        </defs>

        <rect x="10" y="90" width="170" height="80" fill="#fff" stroke="#bdbdb4" strokeWidth="2" />
        <text x="95" y="126" textAnchor="middle" fontSize="16" fontWeight="800">Your product</text>
        <text x="95" y="148" textAnchor="middle" fontSize="12">brief, stack, domain</text>

        <rect x="250" y="90" width="190" height="80" fill="#BF8CFF" fillOpacity=".2" stroke="#BF8CFF" strokeWidth="2" />
        <text x="345" y="126" textAnchor="middle" fontSize="16" fontWeight="800">Fit check</text>
        <text x="345" y="148" textAnchor="middle" fontSize="12">Technical + Delivery Lead</text>

        <line x1="182" y1="130" x2="248" y2="130" stroke="#FF5A45" strokeWidth="2.5" markerEnd="url(#hd-arrow-fit)" />
        <line x1="442" y1="115" x2="528" y2="45" stroke="#FF5A45" strokeWidth="2.5" markerEnd="url(#hd-arrow-fit)" />
        <line x1="442" y1="130" x2="528" y2="130" stroke="#FF5A45" strokeWidth="2.5" markerEnd="url(#hd-arrow-fit)" />
        <line x1="442" y1="145" x2="528" y2="215" stroke="#FF5A45" strokeWidth="2.5" markerEnd="url(#hd-arrow-fit)" />

        <rect x="530" y="10" width="360" height="70" fill="#CDFF4D" fillOpacity=".5" stroke="#7d9a10" strokeWidth="2" />
        <text x="548" y="40" fontSize="16" fontWeight="800">A · We have the people</text>
        <text x="548" y="62" fontSize="12">Choose a model and plan the work</text>

        <rect x="530" y="95" width="360" height="70" fill="#fff" stroke="#7d9a10" strokeWidth="2" strokeDasharray="6 4" />
        <text x="548" y="125" fontSize="16" fontWeight="800">B · We&apos;d have to build the team</text>
        <text x="548" y="147" fontSize="12">Assess the gap; commit only if a verified team is possible</text>

        <rect x="530" y="180" width="360" height="70" fill="#fff" stroke="#bdbdb4" strokeWidth="2" />
        <text x="548" y="210" fontSize="16" fontWeight="800">C · Not a fit</text>
        <text x="548" y="232" fontSize="12">We say so early and point you elsewhere</text>
      </svg>
    </div>
  )
}

function StepFlow({ steps }) {
  return (
    <ol className="hd-flow">
      {steps.map(([side, label]) => (
        <li className={`hd-step--${side}`} key={label}>
          {label}
        </li>
      ))}
    </ol>
  )
}

function WorkflowTable({ rows }) {
  return (
    <div className="hd-raci">
      <table className="hd-table">
        <thead>
          <tr>
            <th>Step</th>
            <th className="hd-th--h">Technical Lead</th>
            <th className="hd-th--h">Delivery Lead</th>
            <th className="hd-th--o">Client Communication</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([step, tech, delivery, comm]) => (
            <tr key={step}>
              <td>{step}</td>
              <td className={tech ? undefined : 'hd-cell-empty'}>{tech || '—'}</td>
              <td className={delivery ? undefined : 'hd-cell-empty'}>{delivery || '—'}</td>
              <td className={comm ? undefined : 'hd-cell-empty'}>{comm || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HowWeDeliver() {
  const [openFaq, setOpenFaq] = useState(0)

  const jsonLd = useMemo(
    () => [
      { key: 'webpage', data: webPage({ path: '/how-we-deliver', name: pageTitles.delivery, description: pageDescriptions['/how-we-deliver'] }) },
      { key: 'breadcrumb', data: breadcrumb([{ name: 'Home', path: '/' }, { name: 'How we deliver', path: '/how-we-deliver' }]) },
      { key: 'models', data: deliveryModelsNode() },
      { key: 'faq', data: faqPage(faqGroups.flatMap((group) => group.items)) },
    ],
    [],
  )

  return (
    <div className="hd-page">
      <Seo title={pageTitles.delivery} description={pageDescriptions['/how-we-deliver']} path="/how-we-deliver" jsonLd={jsonLd} />
      <Nav />

      <section className="hd-hero">
        <div className="shell">
          <p className="hd-eye">Kathmandu, Nepal — how we deliver</p>
          <h1 className="hd-h1">
            Clear hands.
            <br />
            <em>Clear steps</em>
            <s>.</s>
          </h1>
          <p className="hd-sub">
            Four leads, three delivery models, one client contact. Here is exactly who does what, at every step.
          </p>
          <div className="hd-pills">
            <span className="hd-tag">3 models</span>
            <span className="hd-tag">1 shared entry</span>
            <span className="hd-tag">1 shared exit</span>
            <span className="hd-tag">1 point of contact</span>
          </div>
        </div>
      </section>

      <nav className="hd-nav" id="hd-subnav" aria-label="Page sections">
        <div className="hd-nav-inner">
          <span className="hd-nav-label">HOW WE DELIVER</span>
          <div className="hd-nav-links">
            {subNav.map(([href, label]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="hd-section" id="team">
        <div className="shell">
          <p className="hd-eye">01 — The four leads</p>
          <h2 className="hd-h2">
            Two face you.
            <br />
            <em>Two build for you.</em>
          </h2>
          <div className="hd-leads">
            {leads.map((lead) => (
              <div className="hd-lead" key={lead.title}>
                <span className={`hd-tag hd-tag--${lead.tone}`}>{lead.tag}</span>
                <b>{lead.title}</b>
                <p>{lead.text}</p>
              </div>
            ))}
          </div>
          <p className="hd-note">
            Plus a <b>project team</b> added per engagement — engineers and specialists sized to the work, not permanent.
          </p>
        </div>
      </section>

      <section className="hd-section hd-section--paper" id="flow">
        <div className="shell">
          <p className="hd-eye">02 — Every engagement, three parts</p>
          <h2 className="hd-h2">
            Entry. Delivery. <em>Exit.</em>
          </h2>
          <LifecycleDiagram />
          <p className="hd-legend">
            <span>
              <i style={{ background: 'var(--violet)' }} />
              Client-facing
            </span>
            <span>
              <i style={{ background: '#9bbd1f' }} />
              Delivery
            </span>
          </p>

          <h3 className="hd-h3">
            Entry <span>SAME FOR ALL MODELS</span>
          </h3>
          <StepFlow steps={entrySteps} />

          <div className="hd-callout hd-callout--paper">
            <span className="hd-tag hd-tag--o">Business Development · deals, contracts and paperwork</span>
            <ul>
              <li>
                <b>NDA:</b> signed before we go into detailed requirements.
              </li>
              <li>
                <b>Proposal and agreement:</b> a master agreement and a statement of work covering scope, payment terms,
                ownership and confidentiality. For white-label work, the partner&apos;s confidentiality and communication
                rules are added. Agreement templates: <span className="hd-prep">in preparation</span>
              </li>
              <li>
                <b>Paperwork and compliance:</b> company, tax and invoicing details, plus any data-protection or regulatory
                requirements from your country or industry. Business Development coordinates these with our Technical Lead,
                and recommends legal review where terms matter. Governing law:{' '}
                <span className="hd-prep">agreed in the contract</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hd-section" id="models">
        <div className="shell">
          <p className="hd-eye">03 — Three models, each with a unique job</p>
          <h2 className="hd-h2">
            Pick by <em>who directs the work.</em>
          </h2>
          <p className="hd-sub">
            Three ways to work with us. Reserved-hours retainers sit inside the Dedicated team, and white-label is a rule
            that applies on top of any model.
          </p>
          <div className="hd-models">
            {models.map((model) => (
              <div className="hd-model" key={model.title}>
                <span className="hd-tag">{model.tag}</span>
                <h4>{model.title}</h4>
                <p>{model.blurb}</p>
                <dl>
                  {model.rows.map(([term, value]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <div className="hd-callout">
            <span className="hd-tag hd-tag--o">Overlay · White-label / subcontracted</span>
            <p style={{ margin: '9px 0 0' }}>
              When a partner or agency keeps the end-client relationship, we run Model 2 or 3 behind them. Only three things
              change:
            </p>
            <ul>
              <li>Client Communication talks only to the partner, in the agreed reporting format.</li>
              <li>Confidentiality and communication rules are agreed before scope.</li>
              <li>Delivery goes to the partner. No end-client contact unless the partner agrees.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hd-section hd-section--paper" id="workflows">
        <div className="shell">
          <p className="hd-eye">04 — How it works</p>
          <h2 className="hd-h2">
            What happens, <em>and what we need from you.</em>
          </h2>
          <p className="hd-sub">
            After the entry steps, this is how each model runs. Purple steps involve you; lime steps are our work.
          </p>

          {workflows.map((workflow) => (
            <div key={workflow.title}>
              <h3 className="hd-h3">
                <span>{workflow.badge}</span>
                {workflow.title}
              </h3>
              <p className="hd-sub">{workflow.intro}</p>
              <StepFlow steps={workflow.steps} />
              {workflow.table && <WorkflowTable rows={workflow.table} />}
              <p className="hd-recap">
                {workflow.recap.map(([label, text], index) => (
                  <span key={label}>
                    {index > 0 && <br />}
                    <b>{label}:</b> {text}
                  </span>
                ))}
              </p>
            </div>
          ))}

          <h3 className="hd-h3">
            <span>PART 3</span>
            Exit
          </h3>
          <StepFlow steps={exitSteps} />
          <p className="hd-recap" style={{ marginTop: '18px' }}>
            <b>Business Development</b> closes out final invoicing and the agreement, and takes any renewal or expansion
            terms forward. Final invoicing terms: <span className="hd-prep">set in the agreement</span>
          </p>
        </div>
      </section>

      <section className="hd-section hd-section--narrow" id="faq">
        <div className="shell">
          <p className="hd-eye">05 — For our clients</p>
          <h2 className="hd-h2">
            Questions you <em>will ask.</em>
          </h2>
          <p className="hd-sub">
            Straight answers on budget, time, communication and risk. Specific figures are confirmed in your proposal.
          </p>

          <div className="hd-faq-wrap">
            <div className="hd-faq-panel">
              {faqGroups.map((group, groupIndex) => (
                <div className="hd-faq-group" key={group.title}>
                  <p className="hd-eye">{group.title}</p>
                  {group.items.map(([question, answer], itemIndex) => {
                    const index = groupIndex * 100 + itemIndex
                    return (
                      <details className="hd-faq-item" key={question} open={openFaq === index}>
                        <summary
                          onClick={(event) => {
                            event.preventDefault()
                            setOpenFaq(openFaq === index ? -1 : index)
                          }}
                        >
                          <h3>{question}</h3>
                        </summary>
                        <p>{answer}</p>
                      </details>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hd-section hd-section--paper" id="scope">
        <div className="shell">
          <p className="hd-eye">06 — What we work on</p>
          <h2 className="hd-h2">
            We start from your product, <em>not a service menu.</em>
          </h2>
          <p className="hd-sub">
            We don&apos;t claim a list of industries. You bring the product, we check it against the people we actually have,
            and we tell you plainly which of three answers it is.
          </p>
          <FitDiagram />

          <div className="hd-cards">
            {fitAnswers.map((answer) => (
              <div className="hd-card" key={answer.title}>
                <span className={`hd-tag hd-tag--${answer.tone}`}>{answer.tag}</span>
                <h4>{answer.title}</h4>
                <p>{answer.text}</p>
              </div>
            ))}
          </div>

          <h3 className="hd-h3">What we&apos;ll ask you for, in stages</h3>
          <p className="hd-sub">
            You don&apos;t have to hand over confidential details to get a first answer. We ask for the least we need at each
            stage, and go deeper only after you&apos;re comfortable.
          </p>
          <div className="hd-raci hd-stages">
            <table className="hd-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>What we ask</th>
                  <th>What you get back</th>
                </tr>
              </thead>
              <tbody>
                {stages.map(([stage, ask, back]) => (
                  <tr key={stage}>
                    <td>{stage}</td>
                    <td>{ask}</td>
                    <td>{back}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="hd-h3">If you can&apos;t share much</h3>
          <div className="hd-cards">
            {fallbackCards.map((card) => (
              <div className="hd-card" key={card.title}>
                <h4>{card.title}</h4>
                <p>{card.text}</p>
              </div>
            ))}
          </div>

          <p className="hd-recap" style={{ marginTop: '18px' }}>
            <b>Our promise:</b> we won&apos;t place a team on your product that we haven&apos;t verified for it, and the
            Technical Lead makes the final call on fit. We&apos;ll never guess a “yes” on thin information.
          </p>
        </div>
      </section>

      <section className="hd-section" id="core">
        <div className="shell">
          <p className="hd-eye">07 — Our core team</p>
          <h2 className="hd-h2">
            A small core team. <em>Skills we can name.</em>
          </h2>
          <p className="hd-sub">
            This is what our core team of five has direct access to today. Anything outside this list goes through the fit
            check in section 06, not a guess.
          </p>
          <div className="hd-cards hd-cards--dark">
            {coreCards.map((card) => (
              <div className="hd-card hd-card--dark" key={card.title}>
                <span className="hd-tag">{card.tag}</span>
                <h4>{card.title}</h4>
                <div className="hd-pills">
                  {card.pills.map((pill) => (
                    <span className="hd-tag" key={pill}>
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="hd-h3">Frameworks and tools</h3>
          <div className="hd-raci hd-raci--dark hd-stack-table">
            <table className="hd-table hd-table--dark">
              <thead>
                <tr>
                  <th>Discipline</th>
                  <th>What we specialize in</th>
                </tr>
              </thead>
              <tbody>
                {coreStack.map(([discipline, stack]) => (
                  <tr key={discipline}>
                    <td>{discipline}</td>
                    <td>{stack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="hd-callout">
            <span className="hd-tag hd-tag--o">Beyond the core team</span>
            <p style={{ margin: '9px 0 0' }}>
              When a project needs more capacity or a skill we don&apos;t hold in-house, we draw on our wider engineering
              network in Nepal. That is a category B answer from section 06: each person is verified for your product before we
              commit, and you are told which people are core team and which are not.
            </p>
          </div>
        </div>
      </section>

      <section className="hd-section hd-section--paper" id="partners">
        <div className="shell">
          <p className="hd-eye">08 — Partnerships</p>
          <h2 className="hd-h2">
            Ways to <em>work together.</em>
          </h2>
          <p className="hd-sub">
            We are open to partnerships with agencies, studios, consultancies, founders and product companies. These are the
            shapes they can take. Most start with one and grow from there.
          </p>

          {partnerships.map((partnership) => (
            <div key={partnership.title}>
              <h3 className="hd-h3">
                <span>{partnership.number}</span>
                {partnership.title}
              </h3>
              <p className="hd-sub">{partnership.text}</p>
              <div className="hd-partner-grid">
                {[
                  ['Who it suits', partnership.who],
                  ['How it works', partnership.how],
                  ['Agreed up front', partnership.agreed],
                ].map(([term, value]) => (
                  <div key={term}>
                    <dl>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <h3 className="hd-h3">At a glance</h3>
          <div className="hd-raci">
            <table className="hd-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th className="hd-th--o">You bring</th>
                  <th className="hd-th--h">We do</th>
                  <th>Return</th>
                </tr>
              </thead>
              <tbody>
                {partnershipGlance.map(([type, you, we, result]) => (
                  <tr key={type}>
                    <td>{type}</td>
                    <td>{you}</td>
                    <td>{we}</td>
                    <td>{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="hd-h3">How a partnership starts</h3>
          <StepFlow steps={partnershipStart} />
          <div className="hd-callout hd-callout--paper">
            <span className="hd-tag hd-tag--o">Cost</span>
            <p style={{ margin: '9px 0 0' }}>
              The cost of any service, whether a project, staff augmentation, a dedicated team or an exchange, is discussed
              during the agreement and proposal stage. It depends on your specific requirements, and we give you an estimate
              before anything starts. Any revenue-sharing terms are agreed at the same stage.
            </p>
          </div>
        </div>
      </section>

      <section className="hd-start" id="start">
        <div className="shell">
          <p className="hd-eye">09 — Start here</p>
          <h2 className="hd-h2">
            Send us the basics. <em>Get a straight answer.</em>
          </h2>
          <p className="hd-sub">
            Product type, main stack, team shape, rough timeline. No names, no documents. You get a conditional answer, A, B
            or C, and what it depends on.
          </p>
          <p className="hd-contact">
            Contact:{' '}
            <a className="hd-mail" href="mailto:contact@nevrestlabs.com">
              contact@nevrestlabs.com
            </a>
          </p>
          <div className="hd-pills">
            <Link className="text-link" to="/#contact">
              Start a conversation <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
