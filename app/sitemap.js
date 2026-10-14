import { SITE } from './site'

export default function sitemap() {
  const now = new Date()
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/rescue-ai-built-apps`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/launch-readiness-checklist`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/ai-builder-vs-hiring-a-developer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
