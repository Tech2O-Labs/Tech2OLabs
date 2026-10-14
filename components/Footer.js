import Link from 'next/link'
import { SITE } from '../app/site'

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} {SITE.name} · <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
      <p className="flinks">
        <Link href="/rescue-ai-built-apps">Rescue AI-built apps</Link>
        <Link href="/launch-readiness-checklist">Launch-readiness checklist</Link>
        <Link href="/ai-builder-vs-hiring-a-developer">AI builder vs hiring a developer</Link>
      </p>
    </footer>
  )
}
