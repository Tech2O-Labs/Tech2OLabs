import Link from 'next/link'
import { SITE } from '../site'
import { JsonLd } from '../jsonld'
import SubHeader from '../../components/SubHeader'
import Footer from '../../components/Footer'
import Checklist from '../../components/Checklist'

const PATH = '/launch-readiness-checklist'
const TITLE = 'App Launch-Readiness Checklist'
const DESC = 'A 13-point checklist covering security, reliability and maintenance. Check your app, especially if built with AI, before real users or money are involved.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: { type: 'article', url: PATH, siteName: SITE.name, title: `${TITLE} | ${SITE.name}`, description: DESC },
}

const GROUPS = [
  ['Security', [
    'Secrets such as API keys and database passwords live in environment settings, not in the code or the browser.',
    'Every page and API action checks who is allowed to see or change that data, not just whether someone is logged in.',
    'User input is validated, and the app has been tested against common attacks such as injection and cross-site scripting.',
    'Dependencies are up to date and checked for known vulnerabilities.',
  ]],
  ['Reliability', [
    'Errors are handled gracefully instead of crashing the app or showing raw error messages.',
    'Data is backed up automatically, and you have tested restoring from a backup.',
    'The app has been tested with realistic amounts of data and several users at the same time.',
    'Monitoring and alerts tell you about failures before your customers do.',
  ]],
  ['Maintenance', [
    'The core user flows are covered by automated tests.',
    'The code is organised so that someone new could understand it and change it safely.',
    'There is a repeatable way to deploy, and a way to roll back a bad release.',
  ]],
  ['Rules and responsibility', [
    'If you handle payments or personal data, you have checked which rules apply (for example payment-card or privacy regulations).',
    'Someone is clearly responsible for fixing problems when they happen.',
  ]],
]

const ld = [
  { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${SITE.url}${PATH}#page`, name: TITLE, description: DESC, url: `${SITE.url}${PATH}`, isPartOf: { '@id': `${SITE.url}/#site` }, publisher: { '@id': `${SITE.url}/#org` } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Launch-readiness checklist', item: `${SITE.url}${PATH}` },
  ] },
]

export default function Page() {
  return (
    <>
      {ld.map((d, i) => <JsonLd key={i} data={d} />)}
      <SubHeader />
      <main className="doc">
        <section className="hero">
          <p className="crumbs"><Link href="/">Home</Link> / Launch-readiness checklist</p>
          <h1>Is your app <em>ready to launch?</em></h1>
          <p className="lead">AI tools can get an app working in a day. This 13-point checklist covers what separates “it works” from “it’s safe for real users”. Tick what’s true for your app.</p>
        </section>
        <section>
          <Checklist groups={GROUPS} bookHref={SITE.booking || '/#contact'} />
        </section>
        <section>
          <h2>Why these 13 points?</h2>
          <p className="lead">They are the areas where fast, AI-generated apps most often fall short: access control, secret handling, error handling, backups, testing and monitoring. Missing one rarely shows up in a demo, which is exactly why it is easy to miss.</p>
          <p className="note">Already built something with AI? See how we <Link className="more" href="/rescue-ai-built-apps">rescue and harden AI-built apps</Link>, or compare <Link className="more" href="/ai-builder-vs-hiring-a-developer">your options</Link>.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
