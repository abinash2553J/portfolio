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

export type MoreProject = {
  name: string
  kind: string
  summary: string
  stack: string
  href?: string
  live?: string
}

export const MORE: MoreProject[] = [
  {
    name: 'Scorched',
    kind: 'AI YouTube taste roast, 2026',
    summary:
      'Analyzes up to 200 liked YouTube videos to calculate a deterministic brainrot score, then generates evidence-backed roasts and exportable cards with Gemini.',
    stack: 'Next.js · TypeScript · Gemini · YouTube Data API · Tailwind',
    href: `${GITHUB}/scorched`,
    live: 'https://scorched-bice.vercel.app',
  },
  {
    name: 'Render',
    kind: 'Social card generator, 2026',
    summary:
      'Turns public profiles across X, GitHub, and Instagram into ready-to-post, high-resolution social cards with customizable styles, palettes, and layouts.',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS 4',
    href: `${GITHUB}/Render`,
    live: 'https://render-bice-three.vercel.app',
  },
  {
    name: 'Recall',
    kind: 'Spatial notes canvas, 2026',
    summary:
      'Freeform drag-and-drop sticky notes board with debounced autosave and custom color swatches, persisted to a Supabase PostgreSQL backend.',
    stack: 'React · Vite · Supabase · PostgreSQL · CSS',
    href: `${GITHUB}/Recall`,
    live: 'https://recall-gules-ten.vercel.app',
  },
  {
    name: 'Netflix RecSys',
    kind: 'Content-based recommender, 2026',
    summary:
      'Interactive recommendation demo analyzing genres, plot descriptions (TF-IDF + LSA), cast, and director metadata with diversity reranking.',
    stack: 'Python · scikit-learn · Streamlit · LSA · TF-IDF',
    href: `${GITHUB}/Netflix-Recommendation-System`,
    live: 'https://netflix-recommendation-system-pbczdpzblsnauuq3vgdgpg.streamlit.app/',
  },
  {
    name: 'Nagi',
    kind: 'YouTube focus mode extension, 2026',
    summary:
      'Chrome and Edge extension that hides Shorts, home feeds, and recommendations during study sessions while tracking goals and weekly focus time.',
    stack: 'JavaScript · Chrome Extension Manifest v3 · CSS',
    href: `${GITHUB}/nagi-youtube-focus-mode`,
  },
  {
    name: 'Pixora',
    kind: 'Screenshot studio & archiver, 2026',
    summary:
      'Minimalist web capture tool that renders public URLs in macOS window mockups with customizable 16.7M solid and gradient backdrops.',
    stack: 'JavaScript · HTML5 Canvas · CSS · REST API',
    href: `${GITHUB}/Pixora`,
  },
  {
    name: 'Prisma',
    kind: 'Creative collective landing, 2026',
    summary:
      'Editorial single-page landing site for a global arts collective with background video playback, custom typography, and scroll-triggered animations.',
    stack: 'HTML5 · CSS · JavaScript',
    href: `${GITHUB}/prisma-frontend`,
  },
  {
    name: 'Inko',
    kind: 'Canvas drawing studio, 2026',
    summary:
      'Zero-dependency interactive drawing app with shape rasterization, palette selection, eraser, and image export built with raw HTML5 Canvas.',
    stack: 'JavaScript · HTML5 Canvas · CSS',
    href: `${GITHUB}/Inko`,
  },
  {
    name: 'Not-Your-CV',
    kind: 'Experimental web resume, 2026',
    summary:
      'Unconventional, interactive resume experience that re-imagines traditional CV presentation with modern web typography.',
    stack: 'HTML · CSS · JavaScript',
    href: `${GITHUB}/Not-Your-CV`,
  },
  {
    name: 'Notes App',
    kind: 'Local-first notepad, 2026',
    summary:
      'Fast, minimal in-browser notes application with instant CRUD actions and persistent client-side localStorage sync.',
    stack: 'JavaScript · LocalStorage · CSS',
    href: `${GITHUB}/Notes-app`,
  },
  {
    name: 'Bloomalyzer',
    kind: 'NASA Space Apps 2025',
    summary: 'Satellite NDVI pipeline tracking vegetation health; measured an index shift from 0.1819 to 0.3213.',
    stack: 'Python · Satellite imagery · ML',
  },
  {
    name: 'Road Safety AI',
    kind: 'Predictive risk modeling, 2025',
    summary: 'Explainable accident-likelihood model: 1D-CNN features into gradient-boosted trees, with SHAP explanations.',
    stack: 'Python · 1D-CNN · XGBoost · SHAP',
  },
]

export const NAV = [
  { path: '/work', label: 'Work', key: 'w' },
  { path: '/open-source', label: 'Open source', key: 'o' },
  { path: '/about', label: 'About', key: 'a' },
  { path: '/contact', label: 'Contact', key: 'c' },
]
