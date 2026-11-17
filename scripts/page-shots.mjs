import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const [name, width, theme] of [['desktop-light', 1280, 'light'], ['desktop-dark', 1280, 'dark'], ['mobile-light', 390, 'light']]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme)
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } scrollTo(0, 0) })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `shots/page-${name}.png`, fullPage: true })
  console.log(name, errs.length ? errs : 'no errors')
  await ctx.close()
}
await browser.close()
