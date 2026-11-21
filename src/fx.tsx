import { useEffect, useMemo, useRef, useState } from 'react'

/* ---------- Toast ---------- */

const listeners = new Set<(msg: string) => void>()
export const toast = (msg: string) => listeners.forEach((l) => l(msg))

/* ---------- Tiny Web Audio feedback: created only after a user gesture ---------- */
let tactileContext: AudioContext | null = null
export function playTactile(kind: 'click' | 'pop' | 'tick' = 'click') {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return
  try {
    tactileContext ??= new AudioContext()
    const context = tactileContext
    if (context.state === 'suspended') void context.resume()
    const now = context.currentTime
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const duration = kind === 'pop' ? 0.045 : kind === 'tick' ? 0.012 : 0.009
    oscillator.type = kind === 'pop' ? 'triangle' : 'sine'
    oscillator.frequency.setValueAtTime(kind === 'tick' ? 390 : kind === 'pop' ? 720 : 560, now)
    oscillator.frequency.exponentialRampToValueAtTime(kind === 'pop' ? 960 : 230, now + duration)
    gain.gain.setValueAtTime(0.055, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.002)
  } catch {
    // Audio feedback must never block or break a normal interaction.
  }
}

export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null)
  const [key, setKey] = useState(0)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const on = (m: string) => {
      setMsg(m)
      setKey((k) => k + 1)
      clearTimeout(t)
      t = setTimeout(() => setMsg(null), 2200)
    }
    listeners.add(on)
    return () => {
      listeners.delete(on)
      clearTimeout(t)
    }
  }, [])
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {msg && (
        <div key={key} className="toast">
          {msg}
        </div>
      )}
    </div>
  )
}

/* ---------- Scroll reveal, active section, progress ---------- */

export function useReveal(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => (el.dataset.shown = ''))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).dataset.shown = ''
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}

export function useProgress(key: string) {
  useEffect(() => {
    const onScroll = () =>
      document.documentElement.style.setProperty('--progress', String(scrollY / Math.max(1, document.body.scrollHeight - innerHeight)))
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [key])
}

/* ---------- Keyboard: shortcuts and secret words ---------- */

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')

// No g followed by h/w/o/a/c: that pair is a page-jump shortcut.
const SECRETS = ['sakura', 'sudo', 'hire', 'kamehameha', 'nimbus', 'dracarys', 'ipod']

export function useKeys(h: { palette: () => void; theme: () => void; sakura: () => void; secret: (word: string) => void; jump: (key: string) => boolean }) {
  const ref = useRef(h)
  ref.current = h
  useEffect(() => {
    let seq: string[] = []
    let buf = ''
    let gAt = 0
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        playTactile('pop')
        ref.current.palette()
        return
      }
      if (typing(e.target) || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === '/' || e.key === '?') {
        e.preventDefault()
        playTactile('pop')
        ref.current.palette()
        return
      }
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length)
      if (seq.join() === KONAMI.join()) {
        seq = []
        ref.current.sakura()
        return
      }
      if (e.key.length !== 1) return
      if (Date.now() - gAt < 1000 && ref.current.jump(e.key.toLowerCase())) {
        gAt = 0
        buf = ''
        return
      }
      gAt = e.key === 'g' ? Date.now() : 0
      buf = (buf + e.key.toLowerCase()).slice(-12)
      const word = SECRETS.find((w) => buf.endsWith(w))
      if (word === 'sakura') {
        buf = ''
        ref.current.sakura()
      } else if (word) {
        buf = ''
        ref.current.secret(word)
      } else if (e.key === 't') {
        playTactile('click')
        ref.current.theme()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])
}

/* ---------- Cherry blossom petals ---------- */

type Petal = { x: number; y: number; r: number; vx: number; vy: number; a: number; va: number; sway: number; hue: number }

export function usePetals() {
  const running = useRef(false)
  return (origin?: { x: number; y: number }) => {
    if (running.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    running.current = true
    const c = document.createElement('canvas')
    c.className = 'petals'
    const dpr = Math.min(2, devicePixelRatio || 1)
    const W = innerWidth
    const H = innerHeight
    c.width = W * dpr
    c.height = H * dpr
    document.body.appendChild(c)
    const ctx = c.getContext('2d')!
    ctx.scale(dpr, dpr)
    const n = Math.round(Math.min(70, W / 16))
    const petals: Petal[] = Array.from({ length: n }, (_, i) => ({
      x: origin ? origin.x + (Math.random() - 0.5) * 120 : Math.random() * W,
      y: origin ? origin.y + (Math.random() - 0.5) * 40 : -20 - Math.random() * H * 0.6,
      r: 4 + Math.random() * 4,
      vx: origin ? (Math.random() - 0.5) * 3 : 0.3 + Math.random() * 0.6,
      vy: origin ? -2 - Math.random() * 3 : 0.6 + Math.random() * 0.9,
      a: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.06,
      sway: i * 0.7,
      hue: 340 + Math.random() * 14,
    }))
    const start = performance.now()
    const DUR = 6500
    const frame = (now: number) => {
      const t = now - start
      ctx.clearRect(0, 0, W, H)
      const fade = t > DUR - 1200 ? Math.max(0, (DUR - t) / 1200) : 1
      for (const p of petals) {
        p.vy = Math.min(p.vy + 0.04, 1.4)
        p.x += p.vx + Math.sin(t / 700 + p.sway) * 0.5
        p.y += p.vy
        p.a += p.va
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.a)
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(t / 500 + p.sway)))
        ctx.globalAlpha = 0.85 * fade
        ctx.fillStyle = `hsl(${p.hue} 72% 84%)`
        ctx.beginPath()
        ctx.moveTo(0, -p.r)
        ctx.bezierCurveTo(p.r, -p.r, p.r, p.r * 0.6, 0, p.r)
        ctx.bezierCurveTo(-p.r, p.r * 0.6, -p.r, -p.r, 0, -p.r)
        ctx.fill()
        ctx.restore()
      }
      if (t < DUR) requestAnimationFrame(frame)
      else {
        c.remove()
        running.current = false
      }
    }
    requestAnimationFrame(frame)
  }
}

/* ---------- Summons: the skyline dragon and the Flying Nimbus ---------- */

type Summon = 'dragon' | 'nimbus'
export const summon = (what: Summon) => dispatchEvent(new CustomEvent<Summon>('summon', { detail: what }))
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function useSummon(what: Summon, run: () => void) {
  const ref = useRef(run)
  ref.current = run
  useEffect(() => {
    const on = (e: Event) => (e as CustomEvent<Summon>).detail === what && ref.current()
    addEventListener('summon', on)
    return () => removeEventListener('summon', on)
  }, [what])
}

export function Dragon() {
  const ref = useRef<HTMLDivElement>(null)
  const last = useRef(0)
  const [flight, setFlight] = useState(0)
  const fly = () => {
    if (calm()) return
    last.current = Date.now()
    setFlight((f) => f + 1)
  }
  useSummon('dragon', fly)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && Date.now() - last.current > 25000 && fly(), { threshold: 0.5 })
    io.observe(ref.current!.parentElement!)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="dragon" aria-hidden="true">
      {flight > 0 && (
        <span key={flight} className="dragon__flight" onAnimationEnd={(e) => e.target === e.currentTarget && setFlight(0)}>
          <img src="/art/dragon.webp" alt="" width={260} height={294} />
        </span>
      )}
    </div>
  )
}

export function Nimbus() {
  const [at, setAt] = useState(0)
  useSummon('nimbus', () => !calm() && setAt(Date.now()))
  useEffect(() => {
    if (!at) return
    const t = setTimeout(() => setAt(0), 2600)
    return () => clearTimeout(t)
  }, [at])
  return at ? <img className="nimbus" src={`/art/goku.gif?t=${at}`} alt="" width={300} height={300} aria-hidden="true" /> : null
}

/* ---------- Command palette ---------- */

export type Command = { id: string; label: string; group: string; hint?: string; keywords?: string; run: () => void }

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export function Palette({ open, onClose, commands }: { open: boolean; onClose: () => void; commands: Command[] }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return commands
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(s))
  }, [q, commands])

  useEffect(() => {
    if (!open) return
    setQ('')
    setSel(0)
    const prev = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => input.current?.focus())
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      prev?.focus?.()
    }
  }, [open])

  useEffect(() => setSel(0), [q])

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  if (!open) return null

  const run = (c?: Command) => {
    if (!c) return
    playTactile('click')
    onClose()
    requestAnimationFrame(() => c.run())
  }

  let lastGroup = ''
  return (
    <div className="palette" onMouseDown={onClose}>
      <div className="palette__box" role="dialog" aria-modal="true" aria-label="Command menu" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette__search">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
            <circle cx="7" cy="7" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="m10.6 10.6 3.2 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSel((s) => Math.min(results.length - 1, s + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSel((s) => Math.max(0, s - 1))
              } else if (e.key === 'Enter') run(results[sel])
            }}
          />
          <kbd>esc</kbd>
        </div>
        <div className="palette__list" ref={list}>
          {results.length === 0 && <p className="palette__empty">No matches. Try “sakura”.</p>}
          {results.map((c, i) => {
            const head = c.group !== lastGroup ? c.group : null
            lastGroup = c.group
            return (
              <div key={c.id}>
                {head && <p className="palette__group">{head}</p>}
                <button
                  data-i={i}
                  className="palette__item"
                  data-sel={i === sel || undefined}
                  onMouseMove={() => setSel(i)}
                  onClick={() => run(c)}
                >
                  <span>{c.label}</span>
                  {c.hint && <kbd>{c.hint}</kbd>}
                </button>
              </div>
            )
          })}
        </div>
        <div className="palette__foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span className="palette__secret">psst: there are a few secrets</span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Console note for the curious ---------- */

let greeted = false
export function greetConsole(email: string) {
  if (greeted) return
  greeted = true
  console.log(
    '%cak.%c  Hi, fellow source reader.',
    'font: 600 20px ui-monospace, Menlo, monospace; color: #1b1b19; background: #f6f5f1; padding: 4px 8px; border-radius: 6px',
    'font: 13px ui-sans-serif, system-ui; color: #7a7873',
  )
  console.log(
    `%cThis site is React + TypeScript, with product demos built on stageshow.\nIf you read consoles for fun, we should talk: ${email}\n\nTry ⌘K, g then w/o/a/c to jump between pages, the Konami code, or type "sakura", "nimbus" or "dracarys".`,
    'font: 12px ui-monospace, Menlo, monospace; color: #7a7873; line-height: 1.6',
  )
}
