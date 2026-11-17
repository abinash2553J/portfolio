export type PageMeta = { path: string; title?: string; eyebrow: string; heading: string; description: string; og: string }

export const SITE_NAME = 'Abinash Karan'
export const SITE_TITLE = 'Abinash Karan — Software Engineer'

export const PAGES: PageMeta[] = [
  {
    path: '/',
    eyebrow: 'Software Engineer · AI & Systems',
    heading: 'Abinash Karan',
    description:
      'Abinash Karan builds software where machine learning meets real systems. AI & software engineering student at IIT Madras and BITS Pilani.',
    og: 'home',
  },
  {
    path: '/work',
    title: 'Work',
    eyebrow: 'Selected work',
    heading: 'Rove, Vector, LeakLens and more',
    description: 'Case studies of Rove, Vector and LeakLens, plus Bloomalyzer and Road Safety AI, by Abinash Karan.',
    og: 'work',
  },
  {
    path: '/work/rove',
    title: 'Rove',
    eyebrow: 'Case study · AI trip planner',
    heading: 'Rove',
    description: 'Rove turns a one-line brief into an editable, shareable itinerary with a map, route and group expense ledger.',
    og: 'rove',
  },
  {
    path: '/work/vector',
    title: 'Vector',
    eyebrow: 'Case study · Career discovery',
    heading: 'Vector',
    description: 'Vector matches people to roles with deterministic, traceable scoring, and uses an LLM only to explain the ranking.',
    og: 'vector',
  },
  {
    path: '/work/leaklens',
    title: 'LeakLens',
    eyebrow: 'Case study · Secret scanner CLI',
    heading: 'LeakLens',
    description: 'LeakLens is a local-first, zero-dependency secret scanner for repositories and CI, with SARIF output and redaction by construction.',
    og: 'leaklens',
  },
  {
    path: '/open-source',
    title: 'Open source',
    eyebrow: 'Open source',
    heading: 'Upstream contributions',
    description: 'Abinash Karan’s contributions to freeCodeCamp, apache/arrow-rs, libredb-studio and containers/ramalama.',
    og: 'open-source',
  },
  {
    path: '/about',
    title: 'About',
    eyebrow: 'About',
    heading: 'Systems, ML and dependable software',
    description: 'About Abinash Karan: education at IIT Madras and BITS Pilani, interests across systems and machine learning, and tools.',
    og: 'about',
  },
  {
    path: '/contact',
    title: 'Contact',
    eyebrow: 'Contact',
    heading: 'Get in touch',
    description: 'Contact Abinash Karan by email, GitHub or LinkedIn. Based in Odisha, India and open to software engineering internships.',
    og: 'contact',
  },
]

export const pageMeta = (path: string) => PAGES.find((p) => p.path === path)
export const fullTitle = (title?: string) => (title ? `${title} — ${SITE_NAME}` : SITE_TITLE)
