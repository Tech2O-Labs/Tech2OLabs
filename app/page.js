'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { S } from '../components/Scene'
import Link from 'next/link'
import Logo from '../components/Logo'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { FAQ, SITE } from './site'
import { JsonLd, faqLd } from './jsonld'

const Scene = dynamic(() => import('../components/Scene'), { ssr: false })

const WHY = [
  ['Judgment', 'AI builds whatever you ask for — including the wrong thing. We help decide what to build, and what to cut.'],
  ['Production', 'Security, scale, payments, data integrity and uptime. The part that decides whether it survives real users.'],
  ['Accountability', 'When it breaks at 3am, someone owns it. We stand behind what we ship.'],
]
const SERVICES = [
  ['Ship your MVP', 'From idea to a working, launch-ready product — fast, without the throwaway code.'],
  ['Rescue & harden', 'Built something with AI that’s half-working? We review, fix and make it production-ready.', '/rescue-ai-built-apps'],
  ['Add AI to your product', 'LLM features, agents and data pipelines that are reliable, measurable and cost-aware.'],
  ['Cloud & care', 'Infrastructure, monitoring and ongoing maintenance, so it keeps working.'],
]
// per-card dot tints (rgb 0-1) for the gravity well
const TINTS = [[0, 1, 0.78], [0.23, 0.55, 1], [0.56, 0.8, 1], [0.13, 0.83, 0.93]]
const well = (i) => (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  S.well = [((r.left + r.width / 2) / innerWidth) * 2 - 1, 1 - ((r.top + r.height / 2) / innerHeight) * 2, TINTS[i % 4]]
}
const unwell = () => (S.well = null)
const PRINCIPLES = [
  ['Honest advice', 'If you can build it yourself with AI, we will tell you. We would rather earn your trust than your budget.'],
  ['Engineered, not just generated', 'AI speeds us up. Every change is reviewed by an engineer, with AI-assisted checks on top, and tested before it ships.'],
  ['You own it', 'The code and assets are yours, handed over with documentation so you are never locked in.'],
]
const WAYS = [
  ['Rescue audit', 'An app you built with AI that needs a safety check.', 'Risk-ranked written findings and a fix-or-rebuild recommendation.', 'Send us your repo.', '/rescue-ai-built-apps'],
  ['MVP build', 'An idea that’s ready to become a real product.', 'A launch-ready product, tested and secured, with scope and timeline fixed up front.', 'A short discovery.'],
  ['Ongoing support', 'Software that’s already live.', 'Maintenance, monitoring, security updates and steady improvements.', 'A handover review.'],
]
const book = SITE.booking || '#contact'
const STEPS = [
  ['Discover', 'We agree what to build — and what not to — with a fixed scope and timeline up front.'],
  ['Build', 'AI-assisted for speed, human-reviewed for quality.'],
  ['Harden', 'Tests, security checks and monitoring before anything goes live.'],
  ['Ship & support', 'Launch, then we stay on to maintain and improve it.'],
]

// water wobble: the shared SVG filter's displacement follows pointer speed
const wobble = { cur: 0, target: 0 }

export default function Home() {
  const [gl, setGl] = useState(false)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const c = navigator.connection
    // heavy 3D scene: skip on reduced-motion, data-saver or slow connections; otherwise load after the page has painted
    const lite = reduce || c?.saveData || /2g|3g/.test(c?.effectiveType || '')
    const capable = !!document.createElement('canvas').getContext('webgl2')
    let lenis, off = false
    const start = () => {
      if (off) return
      if (!lite && capable) setGl(true)
      if (!reduce) import('lenis').then(({ default: Lenis }) => {
        if (off) return
        lenis = new Lenis()
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)
      })
    }
    const run = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1200))
    if (document.readyState === 'complete') run(); else addEventListener('load', run, { once: true })
    const move = (e) => {
      wobble.target = Math.min(Math.hypot(e.movementX, e.movementY) * 0.5, 16)
      S.mouse = [(e.clientX / innerWidth) * 2 - 1, 1 - (e.clientY / innerHeight) * 2]
      S.moved = true
    }
    addEventListener('pointermove', move)
    const down = (e) => S.pending.push([(e.clientX / innerWidth) * 2 - 1, 1 - (e.clientY / innerHeight) * 2])
    addEventListener('pointerdown', down)
    // contact = calm pool (cursor ripples off, clicks only)
    const io = new IntersectionObserver(([e]) => (S.calm = e.isIntersecting), { rootMargin: '-50% 0px -50% 0px' })
    io.observe(document.getElementById('contact'))
    const disp = document.getElementById('wdisp'); let raf
    const loop = () => {
      wobble.cur += (wobble.target - wobble.cur) * 0.15; wobble.target *= 0.9
      disp?.setAttribute('scale', wobble.cur.toFixed(2)); raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { off = true; removeEventListener('load', run); cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('pointerdown', down); io.disconnect(); lenis?.destroy() }
  }, [])

  return (
    <>
      {gl && <Scene />}
      <JsonLd data={faqLd(FAQ)} />
      <header>
      <nav>
        <a href="#top" className="logo" aria-label="Tech2O Labs home" onMouseEnter={() => { S.logo = true; document.body.classList.add('snap') }}
          onMouseLeave={() => { S.logo = false; document.body.classList.remove('snap'); S.pending.push([0, 0]) }}><Logo /><span>Tech<sub>2</sub>O Labs</span></a>
        <div><a href="#why">Why us</a><a href="#services">Services</a><a href="#process">Process</a><a href="#about">About</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></div>
      </nav>
      </header>

      <main>

      <section id="top" className="hero">
        <p className="eyebrow">Software development company · AI-accelerated</p>
        <h1>AI-speed software delivery. <em>Engineer-grade</em> reliability.</h1>
        <p className="lead">Anyone can generate code now. We make it secure, scalable and maintainable — so what you ship keeps working.</p>
        <div className="cta"><a className="btn" href="#contact">Start a project</a><Link className="btn ghost" href="/rescue-ai-built-apps">Rescue my prototype</Link></div>
      </section>

      <section id="why">
        <h2>AI writes code. Someone still has to own it.</h2>
        <div className="grid3">
          {WHY.map(([t, d], i) => <article key={t} className="card" onMouseEnter={well(i)} onMouseLeave={unwell}><h3>{t}</h3><p>{d}</p></article>)}
        </div>
        <p className="note"><b>Honest take:</b> for a quick prototype or an internal tool, build it with AI yourself. Call us when real users, real money or real data are involved.</p>
      </section>

      <section id="services">
        <h2>Software development services: MVPs, AI features and app rescue</h2>
        <div className="grid4">
          {SERVICES.map(([t, d, href], i) => <article key={t} className="card" onMouseEnter={well(i)} onMouseLeave={unwell}><h3>{t}</h3><p>{d}</p>{href && <Link className="more" href={href}>Learn more →</Link>}</article>)}
        </div>
      </section>

      <section id="start">
        <h2>Ways to work with us</h2>
        <div className="grid3">
          {WAYS.map(([t, who, get, start, href], i) => (
            <article key={t} className="card" onMouseEnter={well(i)} onMouseLeave={unwell}>
              <h3>{t}</h3>
              <p><b>For:</b> {who}</p>
              <p><b>You get:</b> {get}</p>
              <p><b>We start with:</b> {start}</p>
              {href && <Link className="more" href={href}>Learn more →</Link>}
            </article>
          ))}
        </div>
        <article className="card triage">
          <h3>Not sure which one you need?</h3>
          <p>Book a free 30-minute triage call. We’ll tell you honestly what you need, even if that’s nothing.</p>
          <a className="btn" href={book} {...(SITE.booking && { target: '_blank', rel: 'noopener noreferrer' })}>Book a free triage call</a>
        </article>
        <p className="note">Not sure whether you need us at all? Read <Link className="more" href="/ai-builder-vs-hiring-a-developer">AI builder vs hiring a developer</Link> or check your app against our <Link className="more" href="/launch-readiness-checklist">launch-readiness checklist</Link>.</p>
      </section>

      <section id="process">
        <h2>Our software development process</h2>
        <ol className="steps">{STEPS.map(([t, d], i) => <li key={t} className="card"><b>0{i + 1}</b>{t}<p>{d}</p></li>)}</ol>
      </section>

      <section id="about">
        <h2>About Tech2O Labs</h2>
        <p className="lead">Tech2O Labs is a software development studio founded in {SITE.founded}. We build web and mobile products, add AI to existing software, and rescue and harden apps built with AI tools.</p>
        <p className="lead">We use AI openly to move fast, and engineering discipline to make sure what ships is secure, tested and maintainable. You deal directly with the engineer doing the work.</p>
        <div className="grid3">
          {PRINCIPLES.map(([t, d]) => <article key={t} className="card"><h3>{t}</h3><p>{d}</p></article>)}
        </div>
        {SITE.founder && (
          <article className="card founder">
            <span className="tag">Founder</span>
            <h3>{SITE.founder.name}</h3>
            <p><b>{SITE.founder.role}</b></p>
            {SITE.founder.bio && <p>{SITE.founder.bio}</p>}
          </article>
        )}
        <dl className="facts">
          <div><dt>Founded</dt><dd>{SITE.founded}</dd></div>
          {SITE.location && <div><dt>Based in</dt><dd>{SITE.location.city}, {SITE.location.country}</dd></div>}
          <div><dt>Focus</dt><dd>AI-accelerated software development</dd></div>
          <div><dt>Contact</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
        </dl>
      </section>

      <section id="faq">
        <h2>Frequently asked questions about AI and custom software development</h2>
        <div className="faq">
          {FAQ.map(([q, a]) => <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>

      <section id="contact">
        <h2>Tell us what you’re building — or what’s half-built.</h2>
        <ContactForm />
      </section>
      </main>
      <Footer />
    </>
  )
}
