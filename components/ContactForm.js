'use client'
import { useRef, useState } from 'react'
import { SITE } from '../app/site'

const RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// same rules as /api/contact, so the server never has to be the first to say no
const validate = ({ name, email, message }) => {
  const e = {}
  if (!name.trim()) e.name = 'Please enter your name.'
  if (!RE.test(email.trim())) e.email = 'Please enter a valid email address.'
  if (message.trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters).'
  return e
}

export default function ContactForm() {
  const [state, setState] = useState('idle') // idle | sending | ok | error
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const ref = useRef()

  const clear = (k) => fieldErrors[k] && setFieldErrors({ ...fieldErrors, [k]: undefined })

  async function submit(e) {
    e.preventDefault()
    const form = e.currentTarget, values = Object.fromEntries(new FormData(form))
    const errs = validate(values)
    setFieldErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) { form.elements[first].focus(); return }
    setState('sending'); setError('')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error || 'Something went wrong.')
      form.reset(); setState('ok')
    } catch (err) { setError(err.message); setState('error') }
  }

  if (state === 'ok') return <p className="card" role="status">Thanks! Your message is on its way. We’ll reply to you by email soon.</p>

  const field = (k, label, el) => (
    <div className="field">
      <label className="sr" htmlFor={`cf-${k}`}>{label}</label>
      {el}
      {fieldErrors[k] && <p id={`cf-${k}-err`} className="field-err" role="alert">{fieldErrors[k]}</p>}
    </div>
  )
  const a11y = (k) => ({ id: `cf-${k}`, name: k, 'aria-invalid': !!fieldErrors[k], 'aria-describedby': fieldErrors[k] ? `cf-${k}-err` : undefined, onInput: () => clear(k) })

  return (
    <form ref={ref} onSubmit={submit} noValidate>
      {field('name', 'Name', <input {...a11y('name')} placeholder="Name" maxLength={100} autoComplete="name" />)}
      {field('email', 'Email', <input {...a11y('email')} type="email" placeholder="Email" maxLength={200} autoComplete="email" />)}
      {field('message', 'Message', <textarea {...a11y('message')} rows="4" placeholder="What are you building, and where are you stuck?" maxLength={5000} />)}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" /> {/* honeypot */}
      <button className="btn" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send'}</button>
      <p className="fine">We only use your details to reply to you.</p>
      {state === 'error' && <p role="alert" className="err">{error} You can also email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>}
    </form>
  )
}
