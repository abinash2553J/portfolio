// Renders public/og/*.jpg share images and public/apple-touch-icon.png.
// Run: CHROME_PATH=... node scripts/og.mts
import { chromium } from 'playwright-core'
import { mkdirSync, readFileSync } from 'node:fs'
import { PAGES } from '../src/meta.ts'

const skyline = `data:image/webp;base64,${readFileSync('public/footer-skyline.webp').toString('base64')}`
const fonts =
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&family=Instrument+Serif&display=block'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const card = (p: (typeof PAGES)[number]) => `<!doctype html><html><head><link href="${fonts}" rel="stylesheet"><style>
* { margin: 0; box-sizing: border-box }
body { width: 1200px; height: 630px; background: #f6f5f1; color: #1b1b19; font-family: Geist, sans-serif; position: relative; overflow: hidden }
.top { position: absolute; top: 64px; left: 80px; right: 80px; display: flex; justify-content: space-between; align-items: center;
  font: 500 18px 'Geist Mono', monospace; letter-spacing: .06em; text-transform: uppercase; color: #7a7873 }
.mark { display: flex; align-items: center; gap: 14px; color: #1b1b19; text-transform: none; letter-spacing: 0; font: 500 22px Geist, sans-serif }
.mark i { width: 40px; height: 40px; border-radius: 10px; background: #1b1b19; color: #f6f5f1; display: grid; place-items: center;
  font: 600 17px 'Geist Mono', monospace; font-style: normal }
.body { position: absolute; left: 80px; right: 80px; top: 170px }
h1 { font: 400 ${p.heading.length > 20 ? 76 : 104}px/1 'Instrument Serif', serif; letter-spacing: -.02em; max-width: 960px; text-wrap: balance }
p { margin-top: 28px; font-size: 27px; line-height: 1.4; color: #4a4945; max-width: 860px; text-wrap: pretty }
.sky { position: absolute; left: 0; right: 0; bottom: 0; height: 190px; background: url(${skyline}) center bottom / cover no-repeat;
  -webkit-mask: linear-gradient(to bottom, transparent, #000 70%); opacity: .9 }
</style></head><body>
<div class="top"><span class="mark"><i>ak</i>Abinash Karan</span><span>${esc(p.eyebrow)}</span></div>
<div class="body"><h1>${esc(p.heading)}</h1><p>${esc(p.description)}</p></div>
<div class="sky"></div>
</body></html>`

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
mkdirSync('public/og', { recursive: true })
for (const p of PAGES) {
  await page.setContent(card(p), { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `public/og/${p.og}.jpg`, type: 'jpeg', quality: 82 })
}
await page.setViewportSize({ width: 180, height: 180 })
await page.setContent(`<body style="margin:0">${readFileSync('public/favicon.svg', 'utf8').replace('<svg ', '<svg width="180" height="180" ').replace('rx="8"', '')}</body>`)
await page.screenshot({ path: 'public/apple-touch-icon.png' })
await browser.close()
console.log('wrote', PAGES.length, 'og images')
