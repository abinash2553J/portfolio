import { chromium } from 'playwright-core'
const base = process.env.BASE ?? 'http://127.0.0.1:5173'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const errs = []
const page = async (w, theme = 'light') => {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  p.on('pageerror', (e) => errs.push(e.message))
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  await p.addInitScript((t) => localStorage.setItem('theme', t), theme)
  return p
}
for (const [w, t] of [[1440, 'light'], [1024, 'light'], [390, 'light'], [1440, 'dark']]) {
  const p = await page(w, t)
  await p.goto(base + '/about'); await p.waitForTimeout(1400)
  await p.screenshot({ path: `shots/about-${w}-${t}.png` }); await p.close()
}
let p = await page(1280)
await p.goto(base + '/nope'); await p.waitForTimeout(1500)
await p.screenshot({ path: 'shots/404.png', fullPage: true })
await p.goto(base + '/'); await p.waitForTimeout(800)
await p.keyboard.type('nimbus'); await p.waitForTimeout(1300)
await p.screenshot({ path: 'shots/goku.png' })
await p.waitForTimeout(1800)
console.log('nimbus gone', (await p.locator('.nimbus').count()) === 0)
await p.keyboard.type('dracarys'); await p.waitForTimeout(5500)
console.log('dragon flying', await p.locator('.dragon__flight').count())
await p.screenshot({ path: 'shots/dragon.png' })
await p.close()
p = await page(390)
await p.goto(base + '/work'); await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(6000)
console.log('mobile dragon auto', await p.locator('.dragon__flight').count(), 'overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth))
await p.screenshot({ path: 'shots/dragon-m.png' })
console.log('errors:', errs.length ? errs : 'none')
await b.close()
