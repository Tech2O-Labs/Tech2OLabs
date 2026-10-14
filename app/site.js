// single source of truth for SEO/schema. TODO: replace placeholders marked below.
export const SITE = {
  name: 'Tech2O Labs',
  url: 'https://tech2olabs.com', // TODO: confirm final domain (www or not)
  email: 'hello@tech2olabs.com', // TODO: confirm mailbox exists
  description: 'Tech2O Labs is an AI-accelerated software development company. We build MVPs, add AI to products, and rescue and harden AI-built apps for production.',
  founded: '2026',
  booking: null, // TODO: booking link for the free 30-min triage call (Cal.com / Calendly). Falls back to the contact form when null.
  sameAs: [], // TODO: add LinkedIn / GitHub / Clutch / Google Business profile URLs
  // TODO — fill these in and they appear on the About block and in the structured data automatically:
  founder: null, // e.g. { name: 'Jane Doe', role: 'Founder & Lead Engineer', bio: 'One or two honest sentences.', sameAs: ['https://linkedin.com/in/...'] }
  location: null, // e.g. { city: 'Karachi', country: 'PK' } (country = ISO code)
}

// FAQ: rendered on the page AND emitted as FAQPage JSON-LD (text must match).
// Timeline, fixed-price, code-ownership and review statements: confirmed by the owner (review = the engineer plus AI-assisted checks).
export const FAQ = [
  ['Do I still need a software developer if I can build with AI?',
    'For a quick prototype or an internal tool, often not. Once real users, payments or sensitive data are involved, yes. AI generates code quickly, but someone must still design it, secure it, test it, run it and take responsibility when it breaks. That is the work we do.'],
  ['Can you fix an app I built with AI?',
    'Yes. We review the code, find security and reliability problems, fix what is broken and add tests and monitoring so it is safe to launch. If the foundations are too weak, we will tell you honestly and recommend rebuilding the risky parts instead of patching them.'],
  ['What does “production-ready” mean?',
    'It means the software can handle real users safely: proper authentication and data protection, tested core flows, sensible error handling, backups, monitoring and a deployment process you can repeat. Software that merely works on a developer’s laptop, or in a demo, is not production-ready.'],
  ['How long does it take to build an MVP?',
    'It depends on scope. A focused MVP is usually a matter of weeks rather than months, and using AI tools helps us move faster. After a short discovery we give you a fixed scope and timeline in writing, before any build work begins.'],
  ['How much does custom software cost?',
    'It depends on what you need. Rather than quoting by the hour, we agree on a fixed scope and price after discovery, so you know the cost before we start. Tell us what you are building and we will give you an honest estimate.'],
  ['Do you use AI tools to build software?',
    'Yes, openly. AI-assisted development makes us faster, and we pass that speed on to you. Every change is reviewed by an engineer, with AI-assisted checks on top, then tested and checked for security issues before it ships, so you get AI speed without AI-quality surprises.'],
  ['Who owns the code you write?',
    'You do. The code and assets we build for you belong to you, and we hand over the repository, documentation and deployment details so you are never locked in to us.'],
  ['Do you support the software after launch?',
    'Yes. Software needs ongoing updates, security patches and improvements. After launch we can stay on to maintain, monitor and extend it, or hand it over cleanly to your own team.'],
]

// Rescue-page FAQ. Access/approval and timeline statements: confirmed by the owner.
export const RESCUE_FAQ = [
  ['Can you fix an app built with Lovable, Cursor, Bolt, Replit, v0, ChatGPT or Claude?',
    'Yes. The tool does not matter, because we review and fix the code itself. We work from code produced by AI builders and assistants, find what is unsafe or fragile, and turn it into software you can launch with confidence.'],
  ['How do I know if my AI-built app is secure?',
    'You cannot tell from a demo. Typical weak spots are secret keys left in the code, missing checks on who may see or change data, unvalidated input and outdated dependencies. A rescue audit gives you a written, risk-ranked answer instead of a guess.'],
  ['Is it cheaper to fix my app or rebuild it?',
    'If the foundations, such as the data model and login, are sound, fixing is usually cheaper and faster. If they are not, patching wastes money. We decide after the audit, and we will recommend whichever is genuinely better for you, even if it is the smaller job.'],
  ['How long does a rescue take?',
    'It depends on the size of the app and how much needs fixing. We start with an audit, then give you a fixed scope and timeline in writing before any fixing begins, so there are no open-ended hours.'],
  ['What access do you need to my code and accounts?',
    'Read access to your repository, and read-only access to hosting and databases where possible. We never need your personal passwords, and nothing changes in production without your approval.'],
]
