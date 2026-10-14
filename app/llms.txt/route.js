import { SITE } from '../site'

export const dynamic = 'force-static'

// plain-text site summary for AI tools (llms.txt convention). Keep this list in step with app/sitemap.js.
const PAGES = [
  ['/', 'Home', 'What we do, how we work, services, process, about and FAQ.'],
  ['/rescue-ai-built-apps', 'Rescue and harden AI-built apps', 'Audit, fix and production-harden an app built with AI tools.'],
  ['/launch-readiness-checklist', 'Launch-readiness checklist', 'A 13-point self-check for security, reliability and maintenance before launch.'],
  ['/ai-builder-vs-hiring-a-developer', 'AI builder vs hiring a developer', 'An honest comparison of building with AI tools versus hiring a developer or team.'],
]

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.description} Tech2O Labs is a small studio founded in ${SITE.founded}: you work directly with the engineer building your software.

## Pages
${PAGES.map(([path, name, desc]) => `- [${name}](${SITE.url}${path}): ${desc}`).join('\n')}

## Contact
- Email: ${SITE.email}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
