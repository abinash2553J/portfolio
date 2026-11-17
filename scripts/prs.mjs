// Refreshes src/prs.json, the snapshot the Open source page shows before the live GitHub fetch returns.
// Run: node scripts/prs.mjs   (set GITHUB_TOKEN to avoid the unauthenticated rate limit)
import { writeFileSync } from 'node:fs'

const q = 'is:pr author:abinash2553J -user:abinash2553J'
const headers = { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }) }
const res = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=100`, { headers })
if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`)
const { items } = await res.json()
const prs = items.map((i) => ({
  repo: i.repository_url.split('/repos/')[1],
  number: i.number,
  title: i.title,
  url: i.html_url,
  state: i.pull_request?.merged_at ? 'merged' : i.state,
  date: (i.pull_request?.merged_at ?? i.created_at).slice(0, 10),
}))
writeFileSync('src/prs.json', JSON.stringify(prs, null, 2) + '\n')
console.log(`wrote ${prs.length} PRs`)
