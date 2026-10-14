import Link from 'next/link'
import SubHeader from '../../components/SubHeader'
import Footer from '../../components/Footer'
import { SITE, RESCUE_FAQ } from '../site'
import { JsonLd, faqLd } from '../jsonld'

const PATH = '/rescue-ai-built-apps'
const TITLE = 'Rescue & Harden Your AI-Built App'
const DESC = 'Built an app with AI that is not ready for real users? Tech2O Labs reviews, fixes and hardens AI-generated code: security, reliability, tests and monitoring.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: { type: 'website', url: PATH, siteName: SITE.name, title: `${TITLE} | ${SITE.name}`, description: DESC },
}

const SIGNS = [
  'It works in the demo but breaks with real data or more than a handful of users.',
  'API keys or other secrets are sitting in the code or visible in the browser.',
  'You are not sure login and permissions are actually enforced, only that they look right.',
  'Changing one thing breaks another, and nobody, including the AI, can say why.',
  'There are no tests, no backups and no way to see when something fails.',
  'Payments, personal data or customer records are involved.',
  'Deployment is manual, or it only works on one person’s machine.',
]
const REVIEW = [
  ['Security', 'Authentication, authorization, exposed secrets, input validation and vulnerable dependencies.'],
  ['Reliability', 'Error handling, edge cases, data integrity and backups, so one bad request does not take it down.'],
  ['Code structure', 'Making the code understandable and changeable, so you are not afraid to touch it.'],
  ['Performance and cost', 'Slow queries, wasteful API and AI usage, and hosting bills that grow faster than your users.'],
  ['Testing and monitoring', 'Automated tests for the flows that matter, plus alerts so you hear about problems before customers do.'],
  ['Deployment', 'A repeatable, documented way to ship changes safely.'],
]
const STEPS = [
  ['Audit', 'A read-only review of your code and setup. You get written findings, ranked by risk.'],
  ['Plan', 'A clear recommendation to fix or rebuild, with a fixed scope, timeline and price agreed up front.'],
  ['Harden', 'We fix the problems and add tests and monitoring. Every change is reviewed by an engineer, with AI-assisted checks on top.'],
  ['Launch and hand over', 'Safe deployment, documentation and, if you want it, ongoing support.'],
]
const DELIVERABLES = [
  'A risk-ranked audit report in plain language',
  'Fixes committed to your own repository',
  'Automated tests and monitoring for the critical paths',
  'Deployment setup and handover documentation',
]

const ld = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.url}${PATH}#service`,
    name: TITLE,
    serviceType: 'AI-generated code review, security hardening and production readiness',
    description: DESC,
    url: `${SITE.url}${PATH}`,
    provider: { '@id': `${SITE.url}/#org` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Rescue AI-built apps', item: `${SITE.url}${PATH}` },
    ],
  },
  faqLd(RESCUE_FAQ),
]

export default function Rescue() {
  return (
    <>
      {ld.map((d, i) => <JsonLd key={i} data={d} />)}
      <SubHeader />

      <main className="doc">
        <section className="hero">
          <p className="crumbs"><Link href="/">Home</Link> / Rescue AI-built apps</p>
          <h1>Rescue and harden your <em>AI-built app</em></h1>
          <p className="lead">You built something with a tool like Cursor, Lovable, Bolt, Replit, v0, ChatGPT or Claude, and it mostly works. We make it safe to put in front of real users.</p>
          <div className="cta"><Link className="btn" href="/#contact">Get a rescue audit</Link><Link className="btn ghost" href="#how">How it works</Link></div>
        </section>

        <section>
          <h2>Signs your AI-built app is not ready yet</h2>
          <ul className="checks">{SIGNS.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="note">If two or more sound familiar, the app is worth a review before you rely on it.</p>
        </section>

        <section>
          <h2>What we review and fix</h2>
          <div className="grid3">{REVIEW.map(([t, d]) => <article key={t} className="card"><h3>{t}</h3><p>{d}</p></article>)}</div>
        </section>

        <section id="how">
          <h2>How a rescue works</h2>
          <ol className="steps">{STEPS.map(([t, d], i) => <li key={t} className="card"><b>0{i + 1}</b>{t}<p>{d}</p></li>)}</ol>
        </section>

        <section>
          <h2>Fix it or rebuild it?</h2>
          <div className="grid3">
            <article className="card"><h3>Usually fix</h3><p>When the data model, login and overall structure are sound. Fixing is faster and cheaper, and keeps what already works.</p></article>
            <article className="card"><h3>Sometimes rebuild the risky parts</h3><p>When the foundations are unsound, patching wastes money. We replace only the parts that need it and keep the rest.</p></article>
          </div>
          <p className="note"><b>Our promise:</b> we recommend whichever is genuinely better for you, even when that is the smaller job.</p>
        </section>

        <section>
          <h2>What you get</h2>
          <ul className="checks">{DELIVERABLES.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="note">The code is yours throughout. Nothing changes in production without your approval.</p>
        </section>

        <section id="faq">
          <h2>Questions about rescuing AI-built apps</h2>
          <div className="faq">{RESCUE_FAQ.map(([q, a]) => <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>)}</div>
        </section>

        <section>
          <h2>Send us your repo and tell us where it hurts</h2>
          <div className="cta"><Link className="btn" href="/#contact">Start with an audit</Link></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
