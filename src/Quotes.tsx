import { useCallback, useEffect, useState } from 'react'
import { QUOTES } from './content'

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function QuotesSection() {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduced, setReduced] = useState(prefersReducedMotion())
  const isPaused = paused || hovered || focused

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const changeQuote = useCallback((nextIdx: number) => {
    if (fading) return
    if (reduced) { setIndex((nextIdx + QUOTES.length) % QUOTES.length); return }
    setFading(true)
    setTimeout(() => {
      setIndex((nextIdx + QUOTES.length) % QUOTES.length)
      setFading(false)
    }, 220)
  }, [fading, reduced])

  const next = () => changeQuote(index + 1)
  const prev = () => changeQuote(index - 1)
  // Auto-rotate every 8 seconds, paused on hover, focus, or explicit pause
  useEffect(() => {
    if (isPaused || reduced) return
    const id = setInterval(() => {
      changeQuote(index + 1)
    }, 8000)
    return () => clearInterval(id)
  }, [index, isPaused, reduced, changeQuote])

  const current = QUOTES[index]
  const num = String(index + 1).padStart(2, '0')
  const total = String(QUOTES.length).padStart(2, '0')

  return (
    <section
      className="quotes"
      aria-label="Quotes on systems and life"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false) }}
    >
      <div className="quotes__inner">
        <div className="quotes__head">
          <span className="label">
            <span className="quotes__pulse" aria-hidden="true" />
            Words that stick
          </span>
          <div className="quotes__controls">
            <span className="quotes__count" aria-live="off">
              {num} <span className="quotes__sep">/</span> {total}
            </span>
            <button
              className="quotes__btn"
              onClick={prev}
              aria-label="Previous quote"
              title="Previous quote"
            >
              ←
            </button>
            <button
              className="quotes__btn"
              onClick={next}
              aria-label="Next quote"
              title="Next quote"
            >
              →
            </button>
            <button className="quotes__btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Resume quote rotation' : 'Pause quote rotation'} title={paused ? 'Resume rotation' : 'Pause rotation'}>{paused ? '▶' : 'Ⅱ'}</button>
          </div>
        </div>

        <blockquote className={`quotes__body${fading ? ' quotes__body--fading' : ''}`}>
          <p className="quotes__text">
            &ldquo;{current.quote}&rdquo;
          </p>
          {current.author && (
            <footer className="quotes__author">
              <span className="quotes__dash">—</span> {current.author}
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  )
}
