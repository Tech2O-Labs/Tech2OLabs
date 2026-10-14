'use client'
import Link from 'next/link'
import { useState } from 'react'

// groups: [[title, [item, ...]], ...]  — renders server-side too, so every item is crawlable
export default function Checklist({ groups, bookHref }) {
  const [on, setOn] = useState({})
  const total = groups.reduce((n, [, items]) => n + items.length, 0)
  const done = Object.values(on).filter(Boolean).length
  const pct = done / total
  const verdict = pct >= 0.9
    ? ['Looking solid', 'You’ve covered nearly everything. A short independent review is still worth it before you launch.']
    : pct >= 0.6
      ? ['Close, but with gaps', 'You’re part-way there. The unchecked items are the ones most likely to hurt you after launch.']
      : ['Not ready yet', 'Several important safeguards are missing. We’d recommend an audit before real users or real money are involved.']

  return (
    <div className="checker">
      {groups.map(([title, items], g) => (
        <fieldset key={title} className="card">
          <legend><h3>{title}</h3></legend>
          {items.map((t, i) => {
            const id = `c-${g}-${i}`
            return (
              <label key={id} htmlFor={id} className="chk">
                <input id={id} type="checkbox" checked={!!on[id]} onChange={(e) => setOn({ ...on, [id]: e.target.checked })} />
                <span>{t}</span>
              </label>
            )
          })}
        </fieldset>
      ))}
      <div className="card result" role="status" aria-live="polite">
        <div className="bar" aria-hidden="true"><i style={{ width: `${pct * 100}%` }} /></div>
        <p><b>{done} of {total}</b> checked{done > 0 && <> — <b>{verdict[0]}</b></>}</p>
        {done > 0 && <p>{verdict[1]}</p>}
        <p className="fine">This is a quick self-check, not a security audit or a guarantee.</p>
        <div className="cta">
          <Link className="btn" href="/rescue-ai-built-apps">Get a rescue audit</Link>
          <a className="btn ghost" href={bookHref}>Book a free triage call</a>
        </div>
      </div>
    </div>
  )
}
