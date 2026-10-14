// <script type="application/ld+json"> helper + FAQPage builder (text must match the visible FAQ)
export const JsonLd = ({ data }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />

export const faqLd = (list) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})
