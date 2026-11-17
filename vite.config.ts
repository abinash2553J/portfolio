import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fullTitle, PAGES, SITE_NAME, type PageMeta } from './src/meta'

const origin = (
  process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  jobTitle: 'Software Engineer',
  email: 'mailto:abinashkaran09@gmail.com',
  address: { '@type': 'PostalAddress', addressRegion: 'Odisha', addressCountry: 'IN' },
  alumniOf: ['Indian Institute of Technology Madras', 'Birla Institute of Technology and Science, Pilani'],
  sameAs: ['https://github.com/abinash2553J', 'https://www.linkedin.com/in/abinash-karan'],
  ...(origin && { url: origin }),
}

function head(p: PageMeta) {
  const title = esc(fullTitle(p.title))
  const desc = esc(p.description)
  const url = `${origin}${p.path}`
  const image = `${origin}/og/${p.og}.jpg`
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    origin && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${p.path.startsWith('/work/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    origin && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(p.heading)} — ${esc(p.eyebrow)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    p.path === '/' && `<script type="application/ld+json">${JSON.stringify(person)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}

function seo(): Plugin {
  return {
    name: 'seo',
    enforce: 'post',
    transformIndexHtml: (html) => html.replace('<!--seo-->', `<!--seo-->${head(PAGES[0])}<!--/seo-->`),
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset') return
      const html = String(index.source)
      for (const p of PAGES.slice(1)) {
        this.emitFile({
          type: 'asset',
          fileName: `${p.path.slice(1)}/index.html`,
          source: html.replace(/<!--seo-->[\s\S]*<!--\/seo-->/, `<!--seo-->${head(p)}<!--/seo-->`),
        })
      }
      const robots = ['User-agent: *', 'Allow: /', origin && `Sitemap: ${origin}/sitemap.xml`].filter(Boolean).join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' })
      if (!origin) return
      const urls = PAGES.map((p) => `  <url><loc>${origin}${p.path}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), seo()],
})
