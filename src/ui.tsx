import { useEffect, useState } from 'react'
import { toast } from './fx'
import { EMAIL } from './content'
import { fullTitle, pageMeta, PAGES } from './meta'

const setMeta = (sel: string, value: string) => document.querySelector(sel)?.setAttribute('content', value)

export function useTitle(title?: string) {
  useEffect(() => {
    const t = fullTitle(title)
    const d = (pageMeta(location.pathname.replace(/(.)\/$/, '$1')) ?? PAGES[0]).description
    document.title = t
    setMeta('meta[name="description"]', d)
    setMeta('meta[property="og:title"]', t)
    setMeta('meta[property="og:description"]', d)
  }, [title])
}

export function Arrow({ dir = 'ne' }: { dir?: 'ne' | 'e' | 'w' }) {
  const d = dir === 'ne' ? 'M3 7 7 3M3.5 3H7v3.5' : dir === 'e' ? 'M2 5h6M5.5 2.5 8 5 5.5 7.5' : 'M8 5H2M4.5 2.5 2 5l2.5 2.5'
  return (
    <svg className={`arrow arrow--${dir}`} width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="copy"
      onClick={() => {
        navigator.clipboard?.writeText(EMAIL).then(() => {
          toast('Email copied to clipboard')
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        })
      }}
    >
      <span className="copy__email">{EMAIL}</span>
      <span className="copy__hint" data-on={copied || undefined}>
        <span>Copy</span>
        <span>Copied</span>
      </span>
    </button>
  )
}

export function Section({ index, label, aside, children }: { index?: string; label: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="section">
      <header className="section__head" data-reveal>
        <h2 className="label">
          {index && <span className="label__index">{index}</span>}
          {label}
        </h2>
        {aside && <span className="label label--aside">{aside}</span>}
      </header>
      {children}
    </section>
  )
}

export function PageHead({ index, label, title, children }: { index: string; label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="pagehead">
      <p className="label">
        <span className="label__index">{index}</span>
        {label}
      </p>
      <h1 className="pagehead__title">{title}</h1>
      {children && <div className="pagehead__intro">{children}</div>}
    </header>
  )
}
