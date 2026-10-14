import Link from 'next/link'
import { SITE } from '../site'
import { JsonLd, faqLd } from '../jsonld'
import SubHeader from '../../components/SubHeader'
import Footer from '../../components/Footer'

const PATH = '/ai-builder-vs-hiring-a-developer'
const TITLE = 'AI Builder vs Hiring a Developer'
const DESC = 'Build your software with AI tools or hire a developer or team? An honest comparison of cost, speed, quality, risk and when each is the right choice.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: { type: 'article', url: PATH, siteName: SITE.name, title: `${TITLE} | ${SITE.name}`, description: DESC },
}

const COLS = ['Build it yourself with AI', 'Hire a developer or team']
const ROWS = [
  ['Speed to a first version', 'Fastest, often hours to days.', 'Slower to start, because the work is scoped first, but what you get is built to last.'],
  ['Upfront cost', 'Lowest.', 'Higher. It varies by who you hire, and a fixed scope makes the price predictable.'],
  ['Quality and security', 'Unreviewed. You have to check it yourself.', 'Reviewed, tested and secured by someone who knows what to look for.'],
  ['Support when something goes wrong', 'None. You are on your own.', 'Someone you can ask, who is responsible for fixing it.'],
  ['Accountability', 'You, with no one to call.', 'The developer or team, under a written scope.'],
  ['Maintenance', 'Up to you. AI-made changes can break things nobody understands.', 'Ongoing updates, security patches and a documented handover.'],
  ['Best for', 'Prototypes, internal tools, testing an idea.', 'Products with real users, money or data; anything that must keep running.'],
  ['Watch out for', 'Security gaps and code nobody can maintain.', 'Paying for more than you need. Ask who does the work, and get the scope and the code handover in writing.'],
]
const CHOOSE = [
  ['Build it yourself with AI', 'when you are validating an idea, building something only you or your team will use, or no one’s money or data is at risk.'],
  ['Hire a developer or team', 'when real users, payments or personal data are involved, or the product has to keep working and keep growing.'],
  ['Do both', 'Prototype quickly with AI to test the idea, then bring in a developer to review, harden and extend it before launch. It is a common and sensible path.'],
]
const KINDS = [
  ['A freelancer', 'suits small, well-defined tasks. The risk is depending on one person, so keep the code in your own repository and the scope in writing.'],
  ['A small studio like Tech2O Labs', 'suits MVPs, AI features and hardening AI-built apps, with direct access to the engineer building it. Capacity is limited, and it is not built for very large multi-team projects.'],
  ['A larger agency', 'suits big, long-running projects that need several specialists working in parallel, at a higher cost.'],
]
const FAQ = [
  ['Is it safe to launch an app built entirely with AI?',
    'It can be for a prototype or internal tool, but not by default. AI-generated code often works in a demo while missing safeguards like access control, secret handling, backups and tests. Have it reviewed before real users, payments or personal data are involved.'],
  ['Do I need to hire a developer if I can build with AI?',
    'Not always. For a prototype or an internal tool, AI may be enough. Once real users, payments or personal data are involved, have a developer review it, because AI-generated code often works in a demo while missing safeguards that matter in production.'],
  ['Can I start with AI and hire a developer later?',
    'Yes, and it is a common, sensible path: prototype quickly with AI to test the idea, then bring in a developer to review, harden and extend it before launch. Starting this way often saves money because you arrive with a validated idea.'],
  ['Is Tech2O Labs a large agency?',
    'No. Tech2O Labs is a small studio, and you work directly with the engineer building your software. That brings senior attention and fast decisions, but limited capacity, and it is not the right fit for very large multi-team projects. We will tell you if your project needs a bigger team.'],
]

const ld = [
  { '@context': 'https://schema.org', '@type': 'Article', '@id': `${SITE.url}${PATH}#article`, headline: TITLE, description: DESC, url: `${SITE.url}${PATH}`, inLanguage: 'en', author: { '@id': `${SITE.url}/#org` }, publisher: { '@id': `${SITE.url}/#org` }, mainEntityOfPage: `${SITE.url}${PATH}` },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'AI builder vs hiring a developer', item: `${SITE.url}${PATH}` },
  ] },
  faqLd(FAQ),
]

export default function Page() {
  return (
    <>
      {ld.map((d, i) => <JsonLd key={i} data={d} />)}
      <SubHeader />
      <main className="doc">
        <section className="hero">
          <p className="crumbs"><Link href="/">Home</Link> / AI builder vs hiring a developer</p>
          <h1>AI builder vs <em>hiring a developer</em></h1>
          <p className="lead">Should you build your software with AI tools, or hire a developer or team? It depends on what is at stake. Here is an honest comparison, including when you do not need us at all.</p>
        </section>

        <section>
          <h2>Side-by-side comparison</h2>
          <div className="tablewrap">
            <table className="cmp">
              <caption className="sr">Comparison of building with AI tools and hiring a developer or team</caption>
              <thead><tr><th scope="col">&nbsp;</th>{COLS.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>{ROWS.map(([label, ...cells]) => <tr key={label}><th scope="row">{label}</th>{cells.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>How to choose</h2>
          <div className="grid3">{CHOOSE.map(([t, d]) => <article key={t} className="card"><h3>{t}</h3><p>{d}</p></article>)}</div>
          <p className="note">Check where your app stands with our <Link className="more" href="/launch-readiness-checklist">launch-readiness checklist</Link>, or see how we <Link className="more" href="/rescue-ai-built-apps">rescue and harden AI-built apps</Link>.</p>
        </section>

        <section>
          <h2>If you hire: which kind of developer?</h2>
          <div className="grid3">{KINDS.map(([t, d]) => <article key={t} className="card"><h3>{t}</h3><p>{d}</p></article>)}</div>
        </section>

        <section id="faq">
          <h2>Common questions</h2>
          <div className="faq">{FAQ.map(([q, a]) => <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>)}</div>
        </section>

        <section>
          <h2>Not sure which fits?</h2>
          <p className="lead">Book a free 30-minute triage call. We’ll tell you honestly what you need, even if that’s nothing.</p>
          <div className="cta"><a className="btn" href={SITE.booking || '/#contact'}>Book a free triage call</a></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
