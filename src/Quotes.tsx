import { useEffect, useState } from 'react'
import { QUOTES } from './content'

export function QuotesSection() {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)

  const changeQuote = (nextIdx: number) => {
    if (fading) return
    setFading(true)
    setTimeout(() => {
      setIndex((nextIdx + QUOTES.length) % QUOTES.length)
      setFading(false)
    }, 220)
  }

  const next = () => changeQuote(index + 1)
  const prev = () => changeQuote(index - 1)
  const random = () => {
    let r = Math.floor(Math.random() * QUOTES.length)
    if (r === index) r = (r + 1) % QUOTES.length
    changeQuote(r)
  }

  // Auto-rotate every 8 seconds, paused on hover
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      changeQuote(index + 1)
    }, 8000)
    return () => clearInterval(id)
  }, [index, paused, fading])

  const current = QUOTES[index]
  const num = String(index + 1).padStart(2, '0')
  const total = String(QUOTES.length).padStart(2, '0')

  return (
    <section
      className="quotes"
      aria-label="Quotes on systems and life"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="quotes__inner">
        <div className="quotes__head">
          <span className="label">
            <span className="quotes__pulse" aria-hidden="true" />
            Words that stick
          </span>
          <div className="quotes__controls">
            <span className="quotes__count" aria-live="polite">
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
            <button
              className="quotes__btn quotes__btn--shuffle"
              onClick={random}
              aria-label="Random quote"
              title="Random quote"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 2h3v3M14 2l-5 5M11 14h3v-3M14 14l-5-5M2 2l4 4M2 14l4-4" />
              </svg>
            </button>
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
