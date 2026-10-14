// POST /api/contact -> emails the enquiry to CONTACT_TO via Resend (no extra dependency).
// env: RESEND_API_KEY (required), CONTACT_TO, CONTACT_FROM — see .env.example
const RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const json = (body, status = 200) => Response.json(body, { status })

// ponytail: in-memory limit is per server instance; use Redis/Upstash if you run many serverless instances
const hits = new Map()
const limited = (ip) => {
  const now = Date.now(), recent = (hits.get(ip) || []).filter((t) => now - t < 3600e3)
  recent.push(now); hits.set(ip, recent)
  return recent.length > 5
}

export async function POST(req) {
  let b
  try { b = await req.json() } catch { return json({ error: 'Invalid request.' }, 400) }
  if (b.website) return json({ ok: true }) // honeypot: bots fill it, humans never see it

  const name = String(b.name ?? '').trim(), email = String(b.email ?? '').trim(), message = String(b.message ?? '').trim()
  if (!name || name.length > 100) return json({ error: 'Please enter your name.' }, 400)
  if (!RE.test(email) || email.length > 200) return json({ error: 'Please enter a valid email address.' }, 400)
  if (message.length < 10 || message.length > 5000) return json({ error: 'Please write a message (10–5000 characters).' }, 400)

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (limited(ip)) return json({ error: 'Too many messages. Please try again later or email us directly.' }, 429)

  const key = process.env.RESEND_API_KEY
  if (!key) return json({ error: 'Contact form is not configured yet.' }, 503)

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Tech2O Labs <hello@tech2olabs.com>',
      to: [process.env.CONTACT_TO || 'hello@tech2olabs.com'],
      reply_to: email,
      subject: `New enquiry from ${name.replace(/[\r\n]+/g, ' ')}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`,
    }),
  })
  if (!r.ok) { console.error('[contact] Resend error', r.status, await r.text()); return json({ error: 'Could not send your message. Please email us directly.' }, 502) }
  return json({ ok: true })
}
