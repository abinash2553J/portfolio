import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const errs = []
const base = 'http://127.0.0.1:5173'
const routes = ['/', '/work', '/work/rove', '/work/leaklens', '/open-source', '/about', '/contact', '/nope']
for (const [w, tag] of [[1280, 'd'], [390, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: 860 } })
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  p.on('pageerror', (e) => errs.push(String(e)))
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: 'networkidle' })
    await p.waitForTimeout(900)
    await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => (e.dataset.shown = '')))
    await p.waitForTimeout(900)
    const ow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)
    console.log(tag, r, document_title(await p.title()), ow ? 'OVERFLOW' : '')
    await p.screenshot({ path: `shots/rt-${tag}${r.replace(/\//g, '_') || '_'}.png`, fullPage: true })
  }
  await p.close()
}
// client-side nav, keys, back
const p = await b.newPage({ viewport: { width: 1280, height: 860 } })
p.on('pageerror', (e) => errs.push(String(e)))
await p.goto(base + '/', { waitUntil: 'networkidle' })
await p.waitForTimeout(900)
await p.click('.index__row >> nth=1')
await p.waitForTimeout(600)
console.log('click index ->', new URL(p.url()).pathname, await p.$eval('.nav__links a[aria-current]', (e) => e.textContent))
await p.click('.pager__link--next')
await p.waitForTimeout(600)
console.log('pager next ->', new URL(p.url()).pathname)
await p.keyboard.press('g'); await p.keyboard.press('a')
await p.waitForTimeout(600)
console.log('g a ->', new URL(p.url()).pathname)
await p.goBack(); await p.waitForTimeout(600)
console.log('back ->', new URL(p.url()).pathname)
await p.keyboard.press('Control+k'); await p.waitForTimeout(300); await p.keyboard.type('vector'); await p.keyboard.press('Enter')
await p.waitForTimeout(600)
console.log('palette vector ->', new URL(p.url()).pathname)
await p.keyboard.type('hire'); await p.waitForTimeout(600)
console.log('hire ->', new URL(p.url()).pathname)
console.log('errors:', errs.length ? errs : 'none')
await b.close()
function document_title(t) { return t }
