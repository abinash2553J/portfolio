import { chromium } from 'playwright-core'
const base = process.env.BASE ?? 'http://127.0.0.1:5173'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const errs = []
for (const [tag, w, theme] of [['d', 1280, 'light'], ['m', 390, 'light'], ['dk', 1280, 'dark']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  p.on('pageerror', (e) => errs.push(e.message))
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  await p.addInitScript((t) => localStorage.setItem('theme', t), theme)
  await p.goto(base + '/open-source')
  await p.waitForSelector('.prs-live__dot.is-live', { timeout: 8000 }).catch(() => errs.push(tag + ': not live'))
  await p.waitForTimeout(900)
  const rows = await p.locator('.prs li').count()
  const stats = await p.locator('.prs-stats').innerText()
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  console.log(tag, 'rows', rows, '|', stats.replace(/\n/g, ' '), '| overflow', overflow)
  await p.screenshot({ path: `shots/prs-${tag}.png`, fullPage: true })
  if (tag === 'd') {
    await p.getByRole('button', { name: /closed/i }).click()
    await p.waitForTimeout(700)
    console.log('closed filter rows', await p.locator('.prs li').count(), 'visible', await p.locator('.prs li').first().isVisible())
    await p.screenshot({ path: `shots/prs-closed.png` })
    await p.goto(base + '/')
    await p.waitForTimeout(1500)
    console.log('home rows', await p.locator('.prs li').count(), await p.locator('.section__aside, [class*=aside]').allInnerTexts())
    await p.locator('.prs').first().scrollIntoViewIfNeeded()
    await p.waitForTimeout(800)
    await p.screenshot({ path: 'shots/prs-home.png' })
  }
  await p.close()
}
console.log('errors:', errs.length ? errs : 'none')
await b.close()
