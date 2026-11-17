import { useSyncExternalStore, type AnchorHTMLAttributes } from 'react'

const subs = new Set<() => void>()
const subscribe = (f: () => void) => {
  subs.add(f)
  addEventListener('popstate', f)
  return () => {
    subs.delete(f)
    removeEventListener('popstate', f)
  }
}

export const usePath = () => useSyncExternalStore(subscribe, () => location.pathname.replace(/(.)\/$/, '$1'))

export function navigate(to: string) {
  if (to === location.pathname) {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    return
  }
  history.replaceState({ y: scrollY }, '')
  history.pushState({ y: 0 }, '', to)
  subs.forEach((f) => f())
}

export function Link({ to, onClick, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
    />
  )
}
