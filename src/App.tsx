import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { Dragon, Nimbus, Palette, Toaster, greetConsole, isMac, playTactile, playThemeSwitch, summon, toast, useKeys, usePetals, useProgress, useReveal, type Command } from './fx'
import { IpodClassic } from './Ipod'
import { usePlayback } from './playback'
import { QuotesSection } from './Quotes'
import { EMAIL, FEATURED, GITHUB, LINKEDIN, NAV } from './content'
import { Link, navigate, usePath } from './router'
import { About, CaseStudy, Contact, Home, NotFound, OpenSource, Work } from './pages'
import { copyEmail } from './ui'

export type Theme = 'light' | 'dark'

type Origin = { x: number; y: number }
type VTDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } }

function useTheme(): [Theme, (o?: Origin) => void] {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111110' : '#f6f5f1')
  }, [theme])
  const toggle = (o?: Origin) => {
    playThemeSwitch()
    const root = document.documentElement
    const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* private mode */
    }
    const apply = () => {
      flushSync(() => setTheme(next))
      root.dataset.theme = next
    }
    const d = document as VTDoc
    if (!d.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply()
    const x = o?.x ?? innerWidth - 40
    const y = o?.y ?? 28
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    root.classList.add('vt')
    const vt = d.startViewTransition(apply)
    vt.ready.then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 560, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    vt.finished.finally(() => root.classList.remove('vt'))
  }
  return [theme, toggle]
}

function useIST() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: (o?: Origin) => void }) {
  return (
    <button
      className="theme-toggle"
      onClick={(e) => {
        const b = e.currentTarget.getBoundingClientRect()
        onToggle({ x: b.left + b.width / 2, y: b.top + b.height / 2 })
      }}
      title="Toggle theme (T)"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
        {theme === 'dark' ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
          </g>
        ) : (
          <path d="M13.5 9.6A5.5 5.5 0 0 1 6.4 2.5a5.5 5.5 0 1 0 7.1 7.1Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )
}

const JUMP: Record<string, string> = { h: '/', ...Object.fromEntries(NAV.map((n) => [n.key, n.path])) }
const openTab = (href: string) => window.open(href, '_blank', 'noopener')

function Route({ path, time, asleep }: { path: string; time: string; asleep: boolean }) {
  if (path === '/') return <Home time={time} />
  if (path === '/work') return <Work />
  if (path.startsWith('/work/')) return <CaseStudy slug={path.slice(6)} />
  if (path === '/open-source') return <OpenSource />
  if (path === '/about') return <About />
  if (path === '/contact') return <Contact time={time} asleep={asleep} />
  return <NotFound />
}

function Page() {
  const [theme, toggleTheme] = useTheme()
  const path = usePath()
  const time = useIST()
  const asleep = Number(time.slice(0, 2)) < 6
  const [palette, setPalette] = useState(false)
  const [ipod, setIpod] = useState(false)
  const playback = usePlayback()
  const petals = usePetals()
  useReveal(path)
  useProgress(path)
  useEffect(() => greetConsole(EMAIL), [])
  useLayoutEffect(() => {
    history.scrollRestoration = 'manual'
    scrollTo({ top: (history.state as { y?: number } | null)?.y ?? 0, behavior: 'instant' as ScrollBehavior })
  }, [path])

  const sakura = () => {
    petals()
    toast('You found the sakura. Nice.')
  }
  const nimbus = () => {
    summon('nimbus')
    toast('Flying Nimbus, landing. Power level: over 9000.')
  }
  const dragon = () => {
    scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    setTimeout(() => summon('dragon'), 700)
    toast('Something is crossing the skyline.')
  }

  useKeys({
    palette: () => setPalette((p) => !p),
    theme: () => toggleTheme(),
    sakura,
    jump: (k) => {
      if (!JUMP[k]) return false
      navigate(JUMP[k])
      return true
    },
    secret: (w) => {
      if (w === 'kamehameha' || w === 'nimbus') nimbus()
      if (w === 'dracarys') dragon()
      if (w === 'sudo') toast('sudo: you are not in the sudoers file. Email works though.')
      if (w === 'ipod') {
        setIpod(true)
        toast('Click wheel activated. Scroll to navigate.')
      }
      if (w === 'hire') {
        navigate('/contact')
        toast('Excellent taste. Taking you to contact.')
      }
    },
  })

  const commands: Command[] = useMemo(
    () => [
      { id: 'go-home', group: 'Pages', label: 'Home', hint: 'G H', run: () => navigate('/') },
      ...NAV.map((n) => ({ id: `go-${n.key}`, group: 'Pages', label: n.label, hint: `G ${n.key.toUpperCase()}`, run: () => navigate(n.path) })),
      ...FEATURED.map((f) => ({ id: `case-${f.slug}`, group: 'Case studies', label: f.name, keywords: `${f.kind} project work`, run: () => navigate(`/work/${f.slug}`) })),
      { id: 'theme', group: 'Actions', label: 'Toggle light / dark theme', hint: 'T', keywords: 'dark mode', run: () => toggleTheme() },
      {
        id: 'copy',
        group: 'Actions',
        label: 'Copy email address',
        keywords: EMAIL,
        run: copyEmail,
      },
      { id: 'mail', group: 'Actions', label: 'Write an email', keywords: 'contact mail', run: () => (location.href = `mailto:${EMAIL}`) },
      { id: 'gh', group: 'Links', label: 'GitHub', hint: '↗', run: () => openTab(GITHUB) },
      { id: 'li', group: 'Links', label: 'LinkedIn', hint: '↗', run: () => openTab(LINKEDIN) },
      { id: 'rove-live', group: 'Links', label: 'Rove, live demo', hint: '↗', keywords: 'trip planner', run: () => openTab('https://rove-rust.vercel.app') },
      { id: 'scorched-live', group: 'Links', label: 'Scorched, live demo', hint: '↗', keywords: 'youtube roast brainrot gemini', run: () => openTab('https://scorched-bice.vercel.app') },
      { id: 'render-live', group: 'Links', label: 'Render, live demo', hint: '↗', keywords: 'social card generator profile', run: () => openTab('https://render-bice-three.vercel.app') },
      { id: 'recall-live', group: 'Links', label: 'Recall, live demo', hint: '↗', keywords: 'sticky notes canvas supabase', run: () => openTab('https://recall-gules-ten.vercel.app') },
      ...FEATURED.map((f) => ({ id: `src-${f.slug}`, group: 'Links', label: `${f.name}, source`, hint: '↗', keywords: f.kind, run: () => openTab(f.links[f.links.length - 1].href) })),
      { id: 'sakura', group: 'Secrets', label: 'Let it bloom', keywords: 'sakura petals cherry easter egg', run: sakura },
      { id: 'nimbus', group: 'Secrets', label: 'Call the Flying Nimbus', keywords: 'goku kamehameha dragon ball dbz easter egg', run: nimbus },
      { id: 'dragon', group: 'Secrets', label: 'Wake the dragon', keywords: 'dragon dracarys skyline fly easter egg', run: dragon },
      { id: 'duel', group: 'Secrets', label: 'Get lost', keywords: '404 luffy crocodile one piece duel easter egg', run: () => navigate('/lost') },
      { id: 'ipod', group: 'Secrets', label: 'Open the iPod', keywords: 'ipod classic music click wheel apple retro easter egg', run: () => { setIpod(true); toast('Click wheel activated. Scroll to navigate.') } },
    ],
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__brand"><Link to="/" className="mark" aria-label="Abinash Karan, home">ak<span>.</span></Link>{playback.playing && playback.track && <button className="now-playing" onClick={() => setIpod(true)} aria-label={`Open iPod: ${playback.track.title} by ${playback.track.artist}`}><span className="equalizer" aria-hidden="true"><i /><i /><i /></span><span className="now-playing__label">{playback.track.title} · {playback.track.artist}</span></button>}</div>
          <div className="nav__links">
            {NAV.map((n) => (
              <Link key={n.path} to={n.path} aria-current={path === n.path || path.startsWith(n.path + '/') ? 'page' : undefined}>
                {n.label}
              </Link>
            ))}
            <button className="kbar" onClick={() => { playTactile('pop'); setPalette(true) }} aria-label="Open command menu" title="Command menu">
              <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
                <circle cx="7" cy="7" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="m10.6 10.6 3.2 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
        <div className="subnav">
          {NAV.map((n) => (
            <Link key={n.path} to={n.path} aria-current={path === n.path || path.startsWith(n.path + '/') ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      <main id="main" key={path} className={`page route${path === '/' ? '' : ' page--inner'}`}>
        <Route path={path} time={time} asleep={asleep} />
      </main>

      <QuotesSection />

      <footer className="footer">
        <div className="skyline" onClick={(e) => petals({ x: e.clientX, y: e.clientY })}>
          <img src="/footer-skyline.webp" alt="" width={1600} height={625} loading="lazy" />
          <Dragon />
        </div>
        <div className="footer__bar">
          <span>
            © {new Date().getFullYear()} Abinash Karan <span className="sep">·</span>{' '}
            <button className="footer__hint" onClick={() => setPalette(true)}>
              {isMac ? '⌘' : 'Ctrl'} K for shortcuts
            </button>
          </span>
          <span>
            Odisha · <span title={asleep ? 'Probably asleep. Replies by morning.' : 'Probably awake'}>{time} IST</span>
            {asleep && <span className="footer__zz"> (probably asleep)</span>} <span className="sep">·</span>{' '}
            <button className="footer__top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>
              Top ↑
            </button>
          </span>
        </div>
      </footer>

      <Palette open={palette} onClose={() => setPalette(false)} commands={commands} />
      <Nimbus />
      <Toaster />
      <IpodClassic open={ipod} onClose={() => setIpod(false)} />
    </>
  )
}

export default function App() {
  return <Page />
}
