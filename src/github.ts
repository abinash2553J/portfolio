import { useEffect, useState } from 'react'
import snapshot from './prs.json'

export type PR = { repo: string; number: number; title: string; url: string; state: 'merged' | 'open' | 'closed'; date: string }

type Item = {
  repository_url: string
  number: number
  title: string
  html_url: string
  state: string
  created_at: string
  pull_request?: { merged_at: string | null }
}

const QUERY = 'is:pr author:abinash2553J -user:abinash2553J'
const URL = `https://api.github.com/search/issues?q=${encodeURIComponent(QUERY)}&sort=created&order=desc&per_page=100`
const KEY = 'prs:v1'
const TTL = 10 * 60_000

const toPR = (i: Item): PR => ({
  repo: i.repository_url.split('/repos/')[1],
  number: i.number,
  title: i.title,
  url: i.html_url,
  state: i.pull_request?.merged_at ? 'merged' : i.state === 'open' ? 'open' : 'closed',
  date: (i.pull_request?.merged_at ?? i.created_at).slice(0, 10),
})

let pending: Promise<PR[]> | null = null

function load(): Promise<PR[]> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) ?? 'null')
    if (cached && Date.now() - cached.at < TTL) return Promise.resolve(cached.prs)
  } catch {
    /* storage unavailable */
  }
  pending ??= fetch(URL, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d: { items: Item[] }) => {
      const prs = d.items.map(toPR)
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), prs }))
      } catch {
        /* storage unavailable */
      }
      return prs
    })
    .finally(() => (pending = null))
  return pending
}

const byDate = (prs: PR[]) => [...prs].sort((a, b) => b.date.localeCompare(a.date))

export function usePRs() {
  const [state, setState] = useState({ prs: byDate(snapshot as PR[]), live: false })
  useEffect(() => {
    let on = true
    load()
      .then((prs) => on && setState({ prs: byDate(prs), live: true }))
      .catch(() => {})
    return () => {
      on = false
    }
  }, [])
  return state
}

export const cleanTitle = (t: string) => {
  const s = t.replace(/^[a-z0-9-]+(\([^)]*\))?!?:\s*/i, '')
  return s.charAt(0).toUpperCase() + s.slice(1)
}
