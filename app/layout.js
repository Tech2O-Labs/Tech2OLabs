import { Montserrat } from 'next/font/google'
import './globals.css'
import { SITE } from './site'

const mont = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-mont', display: 'swap' })

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Tech2O Labs | AI-Accelerated Software Development Company', template: '%s | Tech2O Labs' },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName: SITE.name, title: 'Tech2O Labs | AI-Accelerated Software Development Company', description: SITE.description },
  twitter: { card: 'summary_large_image', title: 'Tech2O Labs | AI-Accelerated Software Development Company', description: SITE.description },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      logo: `${SITE.url}/logo.png`,
      image: `${SITE.url}/logo.png`,
      foundingDate: SITE.founded,
      ...(SITE.location && { address: { '@type': 'PostalAddress', addressLocality: SITE.location.city, addressCountry: SITE.location.country } }),
      ...(SITE.founder && { founder: { '@type': 'Person', name: SITE.founder.name, jobTitle: SITE.founder.role, ...(SITE.founder.sameAs && { sameAs: SITE.founder.sameAs }) } }),
      description: SITE.description,
      slogan: 'AI-speed delivery. Engineer-grade reliability.',
      knowsAbout: ['Software development', 'MVP development', 'AI integration', 'Production hardening', 'Cloud infrastructure'],
      makesOffer: ['MVP development', 'AI app rescue and production hardening', 'AI feature development', 'Cloud infrastructure and maintenance']
        .map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
      ...(SITE.sameAs.length && { sameAs: SITE.sameAs }),
    },
    { '@type': 'WebSite', '@id': `${SITE.url}/#site`, url: SITE.url, name: SITE.name, publisher: { '@id': `${SITE.url}/#org` }, inLanguage: 'en' },
  ],
}

export default function Root({ children }) {
  return (
    <html lang="en" className={mont.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="water" x="-5%" y="-10%" width="110%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="2" result="n">
              <animate attributeName="baseFrequency" dur="8s" values="0.01 0.02;0.014 0.016;0.01 0.02" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap id="wdisp" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  )
}
