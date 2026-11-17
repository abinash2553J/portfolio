import type { Theme } from './App'
import { RoveDemo } from './demos/Rove'
import { VectorDemo } from './demos/Vector'
import { LeakLensDemo } from './demos/LeakLens'

export const EMAIL = 'abinashkaran09@gmail.com'
export const GITHUB = 'https://github.com/abinash2553J'
export const LINKEDIN = 'https://www.linkedin.com/in/abinash-karan'

export type Featured = {
  slug: string
  name: string
  kind: string
  tagline: string
  summary: string
  stack: string[]
  links: { label: string; href: string }[]
  Demo: (p: { theme: Theme }) => JSX.Element
  lede: string
  built: string[]
  notes: string[]
}

export const FEATURED: Featured[] = [
  {
    slug: 'rove',
    name: 'Rove',
    kind: 'AI trip planner',
    tagline: 'A one-line brief becomes an editable, shareable itinerary.',
    summary:
      'Turns a one-line travel request into a day-by-day itinerary with stops on a map and a budget per person, then keeps the group’s shared expenses in the same place.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Gemini', 'Leaflet'],
    links: [
      { label: 'Live', href: 'https://rove-rust.vercel.app' },
      { label: 'Source', href: `${GITHUB}/rove` },
    ],
    Demo: RoveDemo,
    lede:
      'Planning a trip usually means a dozen tabs: maps, blog posts, and a spreadsheet for who paid what. Rove collapses that into one plan you can actually edit, share, and settle up on.',
    built: [
      'Itineraries generated from a natural-language brief plus dates, group size, budget style and interests.',
      'Day plans with morning, afternoon and evening blocks, an area to stay, practical notes and a per-person estimate.',
      'Inline editing, and a per-day “rethink” that regenerates one day with extra instructions instead of the whole trip.',
      'Private-by-default share links that can be revoked.',
      'A group expense ledger for up to 12 members, with equal splits, live balances and suggested settlements.',
    ],
    notes: [
      'Splits distribute leftover paise one at a time, so every expense reconciles to the exact amount.',
      'Settlements are computed to clear balances in as few transfers as possible.',
      'Members, expenses and shares live in their own tables, separate from the itinerary JSON, behind member-only access rules.',
      'You can plan without an account; sign-in is only required to save, share or invite.',
    ],
  },
  {
    slug: 'vector',
    name: 'Vector',
    kind: 'Career discovery platform',
    tagline: 'Deterministic role matching, with the model only explaining it.',
    summary:
      'Scores roles against a deterministic career graph first, then uses an LLM only to explain the match and surface the skill gaps worth closing.',
    stack: ['Next.js', 'React', 'Tailwind', 'FastAPI', 'Supabase', 'Gemini'],
    links: [{ label: 'Source', href: `${GITHUB}/vector` }],
    Demo: VectorDemo,
    lede:
      'Most AI career tools let a language model guess. Vector inverts that: the ranking comes from a career graph that is reproducible and testable, and the model is only allowed to explain it.',
    built: [
      'A profile-to-role scoring pass over a structured career graph.',
      'Ranked role matches with a score you can trace back to specific skills.',
      'Plain-language match explanations generated after the score is fixed.',
      'Skill-gap suggestions ordered by how much they would move the match.',
    ],
    notes: [
      'Keeping scoring deterministic means the same profile always gets the same ranking, which makes it unit-testable.',
      'The LLM never sees a chance to reorder results, so a bad generation degrades the prose, not the answer.',
      'A FastAPI service owns scoring; the Next.js front end only renders and streams explanations.',
    ],
  },
  {
    slug: 'leaklens',
    name: 'LeakLens',
    kind: 'Secret scanner CLI',
    tagline: 'A local-first, zero-dependency secret scanner for repos and CI.',
    summary:
      'A zero-dependency scanner that finds credentials, private keys and leaked environment values with provider rules, assignment analysis and entropy scoring, fast enough for a pre-commit hook.',
    stack: ['Python stdlib', 'AST', 'Shannon entropy', 'Regex', 'SARIF'],
    links: [{ label: 'Source', href: `${GITHUB}/LeakLens` }],
    Demo: LeakLensDemo,
    lede:
      'A committed secret can hand someone your cloud account. Hosted scanners want your source code; LeakLens runs entirely on your machine, never calls out to a provider, and redacts everything it reports.',
    built: [
      'Provider-aware rules for AWS, GitHub, GitLab, Slack, Stripe, Google, OpenAI, Hugging Face, SendGrid and private-key headers.',
      'Generic detection of secret-like values assigned to sensitive variables and config keys.',
      'An entropy heuristic for long, random-looking literals that match no known provider.',
      'Terminal, JSON and SARIF 2.1.0 output, with CI exit codes keyed to a severity threshold.',
      'Respects .gitignore and .leaklensignore, with inline suppressions for intentional test fixtures.',
    ],
    notes: [
      'The raw matched value is never stored on a finding object, so redaction holds by construction, not by formatting.',
      'Key names must end in a recognised credential suffix, which keeps names like password_hash and token_url quiet.',
      'Standard library only: no install step beyond Python 3.10, which keeps it trivial to run in a hook.',
      'Binary files, symlinks, vendored directories and oversized files are skipped before reading.',
    ],
  },
]

export const MORE = [
  {
    name: 'Bloomalyzer',
    kind: 'NASA Space Apps 2024',
    summary: 'Satellite NDVI pipeline tracking vegetation health; measured an index shift from 0.1819 to 0.3213.',
    stack: 'Python · Satellite imagery · ML',
  },
  {
    name: 'Road Safety AI',
    kind: 'Predictive risk modeling, 2024',
    summary: 'Explainable accident-likelihood model: 1D-CNN features into gradient-boosted trees, with SHAP explanations.',
    stack: 'Python · 1D-CNN · XGBoost · SHAP',
  },
]

export const UPSTREAM = [
  { repo: 'apache/arrow-rs', title: 'Preserve union nullability when introducing nulls', ref: 'PR #11288', href: 'https://github.com/apache/arrow-rs/pull/11288' },
  { repo: 'freeCodeCamp/freeCodeCamp', title: 'Vowel balance edge cases in the curriculum tests', ref: 'PR #70252', href: 'https://github.com/freeCodeCamp/freeCodeCamp/pull/70252' },
  { repo: 'libredb/libredb-studio', title: 'Preserve nested MongoDB paths in generated test data', ref: 'PR #1555', href: 'https://github.com/libredb/libredb-studio/pull/1555' },
  { repo: 'containers/ramalama', title: 'XDG_CACHE_HOME fallback paths used a literal ~', ref: 'Issue #2943', href: 'https://github.com/containers/ramalama/issues/2943' },
]

export const NAV = [
  { path: '/work', label: 'Work', key: 'w' },
  { path: '/open-source', label: 'Open source', key: 'o' },
  { path: '/about', label: 'About', key: 'a' },
  { path: '/contact', label: 'Contact', key: 'c' },
]
