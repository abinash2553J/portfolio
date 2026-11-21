import type { Theme } from './App'
import { useState } from 'react'
import { JapanBadgeSticker, LuffyHatSticker } from 'stick-it-up'
import { EMAIL, FEATURED, GITHUB, LINKEDIN, MORE } from './content'
import { cleanTitle, usePRs, type PR } from './github'
import { Link } from './router'
import { Arrow, CopyEmail, PageHead, Section, useTitle } from './ui'
import { usePlayback } from './playback'

const ext = { target: '_blank', rel: 'noreferrer' }
const num = (i: number) => String(i + 1).padStart(2, '0')

function ExtLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className="project__links">
      {links.map((l) => (
        <a key={l.label} href={l.href} {...ext}>
          {l.label} <Arrow />
        </a>
      ))}
    </div>
  )
}

function More({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="more-link" data-reveal>
      {children} <Arrow dir="e" />
    </Link>
  )
}

const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

function PRList({ items }: { items: PR[] }) {
  return (
    <ul className="upstream prs">
      {items.map((p, i) => (
        <li key={p.url} style={{ '--i': i } as React.CSSProperties}>
          <a href={p.url} {...ext} className="upstream__row">
            <span className="upstream__repo">{p.repo}</span>
            <span className="upstream__title">{cleanTitle(p.title)}</span>
            <span className="upstream__ref">
              <span className={`pr-state pr-state--${p.state}`}>{p.state}</span>
              <span className="sep">·</span>
              {fmtDate(p.date)} <Arrow />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/* ---------- Home ---------- */

export function Home({ time }: { time: string }) {
  useTitle()
  const { prs } = usePRs()
  const playback = usePlayback()
  return (
    <>
      <header className="hero">
        <div className="hero__row">
          <div className="hero__intro">
            <h1 className="hero__name">Abinash Karan</h1>
            <p className="hero__role">Software Engineering Student · AI &amp; Systems</p>
          </div>
          <div className="hero__sticker" title="Peel the Japan badge!">
            <JapanBadgeSticker size={100} peel />
          </div>
        </div>
        <p className="hero__statement">
          I build software where machine learning meets real systems, and I read the source before I trust the abstraction.
        </p>
        <div className="hero__meta">
          <span className="meta">
            Odisha, India <span className="sep">·</span> {time} IST
          </span>
          <span className="status"><span className="status__dot" />Open to SWE internships</span>
          <span className="currently-pill"><span className="currently-pill__label">Currently</span>{playback.playing && playback.track ? `Listening to: ${playback.track.title}` : 'Reading DDIA · Building systems & ML'}</span>
        </div>
        <div className="hero__links">
          <a href={GITHUB} {...ext}>
            GitHub <Arrow />
          </a>
          <a href={LINKEDIN} {...ext}>
            LinkedIn <Arrow />
          </a>
          <a href={`mailto:${EMAIL}`}>
            Email <Arrow />
          </a>
        </div>
      </header>

      <Section index="01" label="Selected work" aside={<Link to="/work">All work</Link>}>
        <ul className="index">
          {FEATURED.map((f, i) => (
            <li key={f.slug} data-reveal style={{ '--d': `${i * 70}ms` } as React.CSSProperties}>
              <Link to={`/work/${f.slug}`} className="index__row">
                <span className="index__num">{num(i)}</span>
                <span className="index__name">{f.name}</span>
                <span className="index__desc">{f.tagline}</span>
                <Arrow dir="e" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section index="02" label="Open source" aside={<Link to="/open-source">All {prs.length} pull requests</Link>}>
        <div data-reveal>
          <PRList items={prs.filter((p) => p.state === 'merged').slice(0, 3)} />
        </div>
      </Section>

      <Section index="03" label="Now">
        <p className="now" data-reveal>
          Dual-degree student at <strong>IIT Madras</strong> and <strong>BITS Pilani</strong>, reading <em>Designing Data-Intensive Applications</em>,
          and looking for a software engineering internship.
        </p>
        <div className="row-links">
          <More to="/about">More about me</More>
          <More to="/contact">Get in touch</More>
        </div>
      </Section>
    </>
  )
}

/* ---------- Work ---------- */

export function Work({ theme }: { theme: Theme }) {
  useTitle('Work')
  return (
    <>
      <PageHead index="01" label="Work" title="Selected work">
        Three products I designed and built end to end, and the engineering decisions behind them.
      </PageHead>
      <div className="work">
        {FEATURED.map(({ slug, name, kind, summary, stack, links, Demo }, i) => (
          <article key={slug} className="project" data-reveal>
            <div className="project__visual">
              <Demo theme={theme} />
            </div>
            <div className="project__body">
              <div className="project__head">
                <h2 className="project__title">
                  <span className="project__num">{num(i)}</span>
                  <Link to={`/work/${slug}`} className="project__name">
                    {name}
                  </Link>
                  <span className="project__kind">{kind}</span>
                </h2>
                <ExtLinks links={links} />
              </div>
              <p className="project__summary">{summary}</p>
              <ul className="stack">
                {stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <Link to={`/work/${slug}`} className="more-link more-link--tight">
                Read the case study <Arrow dir="e" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="more" data-reveal>
        <p className="label more__label">Also</p>
        {MORE.map((p) => (
          <div key={p.name} className="more__row" tabIndex={0}>
            <div className="more__title">
              {p.href ? (
                <a href={p.href} {...ext} className="more__name">
                  {p.name} <Arrow />
                </a>
              ) : (
                <span className="more__name">{p.name}</span>
              )}
              <span className="project__kind">{p.kind}</span>
              {p.live && (
                <a href={p.live} {...ext} className="more__live">
                  Live demo <Arrow />
                </a>
              )}
            </div>
            <p className="more__summary">{p.summary}</p>
            <p className="more__stack">{p.stack}</p>
            <div className="more__preview" aria-hidden="true">
              <div className="more__preview-chrome"><i /><i /><i /><span>{p.name.toLowerCase()} / overview</span></div>
              <div className="more__preview-body"><strong>{p.name}</strong><span>{p.kind}</span><em>{p.stack.split(' · ').slice(0, 3).join(' · ')}</em></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------- Case study ---------- */

export function CaseStudy({ slug, theme }: { slug: string; theme: Theme }) {
  const i = FEATURED.findIndex((f) => f.slug === slug)
  const f = FEATURED[i]
  useTitle(f?.name ?? 'Not found')
  if (!f) return <NotFound />
  const prev = FEATURED[(i - 1 + FEATURED.length) % FEATURED.length]
  const next = FEATURED[(i + 1) % FEATURED.length]
  const { Demo } = f
  return (
    <article className="case">
      <Link to="/work" className="back">
        <Arrow dir="w" /> All work
      </Link>
      <PageHead index={num(i)} label={f.kind} title={f.name}>
        {f.lede}
      </PageHead>
      <dl className="case__meta">
        <div>
          <dt>Type</dt>
          <dd>{f.kind}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{f.stack.join(', ')}</dd>
        </div>
        <div>
          <dt>Links</dt>
          <dd>
            <ExtLinks links={f.links} />
          </dd>
        </div>
      </dl>
      <div className="case__visual">
        <Demo theme={theme} />
      </div>
      <Section label="What it does">
        <ul className="points">
          {f.built.map((b, j) => (
            <li key={j} data-reveal style={{ '--d': `${j * 50}ms` } as React.CSSProperties}>
              {b}
            </li>
          ))}
        </ul>
      </Section>
      <Section label="Engineering notes">
        <ol className="points points--num">
          {f.notes.map((n, j) => (
            <li key={j} data-reveal style={{ '--d': `${j * 50}ms` } as React.CSSProperties}>
              <span className="points__n">{num(j)}</span>
              {n}
            </li>
          ))}
        </ol>
      </Section>
      <nav className="pager" aria-label="More projects">
        <Link to={`/work/${prev.slug}`} className="pager__link">
          <span className="label">
            <Arrow dir="w" /> Previous
          </span>
          <span className="pager__name">{prev.name}</span>
        </Link>
        <Link to={`/work/${next.slug}`} className="pager__link pager__link--next">
          <span className="label">
            Next <Arrow dir="e" />
          </span>
          <span className="pager__name">{next.name}</span>
        </Link>
      </nav>
    </article>
  )
}

/* ---------- Open source ---------- */

const FILTERS = ['all', 'merged', 'open', 'closed'] as const

export function OpenSource() {
  useTitle('Open source')
  const { prs, live } = usePRs()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const count = (f: (typeof FILTERS)[number]) => (f === 'all' ? prs.length : prs.filter((p) => p.state === f).length)
  const shown = filter === 'all' ? prs : prs.filter((p) => p.state === filter)
  const projects = new Set(prs.map((p) => p.repo)).size
  return (
    <>
      <PageHead index="02" label="Open source" title="Upstream">
        Every pull request I&rsquo;ve opened on other people&rsquo;s projects, newest first. Most started as a bug I hit, then a read through
        the source to find where the assumption broke.
      </PageHead>
      <div className="prs-bar" data-reveal>
        <p className="prs-stats">
          {prs.length} pull requests <span className="sep">·</span> {count('merged')} merged <span className="sep">·</span> {projects} projects
          <span className="prs-live" title={live ? 'Fetched from the GitHub API just now' : 'Snapshot from the last deploy'}>
            <span className={`prs-live__dot${live ? ' is-live' : ''}`} />
            {live ? 'Live from GitHub' : 'Snapshot'}
          </span>
        </p>
        <div className="prs-filter" role="group" aria-label="Filter pull requests">
          {FILTERS.filter((f) => f === 'all' || count(f) > 0).map((f) => (
            <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f} <span>{count(f)}</span>
            </button>
          ))}
        </div>
      </div>
      <div key={filter}>
        <PRList items={shown} />
      </div>
      <div className="row-links">
        <a href={`https://github.com/pulls?q=${encodeURIComponent('is:pr author:abinash2553J')}`} {...ext} className="more-link" data-reveal>
          View on GitHub <Arrow />
        </a>
      </div>
    </>
  )
}

/* ---------- About ---------- */

export function About() {
  useTitle('About')
  return (
    <>
      <div className="about-head">
        <img className="about-head__art" src="/art/pagoda.webp" alt="" width={460} height={538} />
        <PageHead index="03" label="About" title="About">
          Software engineer in training, working where reliable systems, machine-learning pipelines and low-level code overlap.
        </PageHead>
      </div>
      <div className="about" data-reveal>
        <p className="about__lead">
          I&rsquo;m a dual-degree student, reading Data Science &amp; Applications at <strong>IIT Madras</strong> and Computer Science at{' '}
          <strong>BITS Pilani</strong>.
        </p>
        <p>
          I learn by reading source code, weighing the trade-offs in distributed systems, and shipping software people actually use. When a
          library surprises me, I&rsquo;d rather find the line that caused it than work around it, which is how most of my{' '}
          <Link to="/open-source">open-source fixes</Link> started.
        </p>
        <dl className="facts">
          <div>
            <dt>Education</dt>
            <dd>IIT Madras, Data Science &amp; Applications. BITS Pilani, Computer Science.</dd>
          </div>
          <div>
            <dt>Exploring</dt>
            <dd>Distributed systems, storage engines, retrieval-augmented generation, database internals.</dd>
          </div>
          <div>
            <dt>Reading</dt>
            <dd>
              <em>Designing Data-Intensive Applications</em> (Kleppmann) and <em>SICP</em> (Abelson &amp; Sussman).
            </dd>
          </div>
          <div>
            <dt>Works with</dt>
            <dd>Python, TypeScript, React, Next.js, FastAPI, PostgreSQL, XGBoost.</dd>
          </div>
        </dl>
        <div className="about__sticker-wrap" data-reveal>
          <div className="about__sticker" title="Peel Luffy's straw hat!">
            <LuffyHatSticker size={100} peel />
          </div>
        </div>
      </div>
      <div className="row-links">
        <More to="/work">See the work</More>
        <More to="/contact">Get in touch</More>
      </div>
    </>
  )
}

/* ---------- Contact ---------- */

export function Contact({ time, asleep }: { time: string; asleep: boolean }) {
  useTitle('Contact')
  return (
    <>
      <PageHead index="04" label="Contact" title="Building something thoughtful?">
        I&rsquo;m looking for software engineering internships and serious collaborative projects. Email is the fastest way to reach me.
      </PageHead>
      <div className="contact" data-reveal>
        <div className="contact__actions">
          <CopyEmail />
          <a href={GITHUB} {...ext}>
            github/abinash2553J <Arrow />
          </a>
          <a href={LINKEDIN} {...ext}>
            in/abinash-karan <Arrow />
          </a>
        </div>
        <p className="contact__note">
          It&rsquo;s {time} in Odisha{asleep ? ', so I’m probably asleep. Expect a reply in the morning.' : '. I usually reply within a day.'}
        </p>
      </div>
    </>
  )
}

/* ---------- 404 ---------- */

export function NotFound() {
  useTitle('Not found')
  return (
    <div className="notfound">
      <div className="notfound__top">
        <div>
          <p className="label">404</p>
          <h1 className="pagehead__title">This page wandered off.</h1>
          <p className="pagehead__intro">
            <code>{location.pathname}</code> doesn&rsquo;t exist. Try the <Link to="/">home page</Link>, or press <kbd>/</kbd> to search.
          </p>
        </div>
        <div className="notfound__sticker" title="Peel Luffy's straw hat!">
          <LuffyHatSticker size={100} peel />
        </div>
      </div>
      <figure className="duel">
        <img src="/art/duel.gif" alt="Pixel-art Luffy and Crocodile fighting" width={400} height={300} />
        <figcaption>Meanwhile, Luffy is settling it the old-fashioned way.</figcaption>
      </figure>
    </div>
  )
}
