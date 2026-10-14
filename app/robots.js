import { SITE } from './site'

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'], allow: '/' }, // explicit: let AI engines read and cite us
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
