/* Records the feature-card grid for one full cycle of the mark's build,
   so the logo animates on the portfolio page instead of sitting still. */
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = process.env.URL ?? 'http://localhost:5183/keystone/cards/index.html'
const OUT = 'reels'
const CYCLE = 5.4            // the mark's loop, in seconds
const FPS = 30

mkdirSync(OUT, { recursive: true })
const tmp = join(OUT, '.frames-cards')
rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const ctx = await browser.newContext({ viewport: { width: 1180, height: 740 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
await page.goto(URL, { waitUntil: 'networkidle' })

const cdp = await ctx.newCDPSession(page)
let n = 0
cdp.on('Page.screencastFrame', async ({ data, sessionId }) => {
  writeFileSync(join(tmp, `f${String(n++).padStart(5, '0')}.png`), Buffer.from(data, 'base64'))
  await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
})
// start on a cycle boundary so the capture loops cleanly
await page.waitForTimeout(600)
await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: 2360, maxHeight: 1480 })
const t0 = Date.now()
await page.waitForTimeout(CYCLE * 1000)
await cdp.send('Page.stopScreencast')
const rate = Math.max(1, Math.round(n / ((Date.now() - t0) / 1000)))
await ctx.close(); await browser.close()

const mp4 = join(OUT, 'cards.mp4')
execFileSync(ffmpeg, ['-y', '-framerate', String(rate), '-i', join(tmp, 'f%05d.png'),
  '-vf', `fps=${FPS},scale=trunc(iw/2)*2:trunc(ih/2)*2`, '-c:v', 'libx264',
  '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'slow',
  '-movflags', '+faststart', '-an', mp4], { stdio: 'ignore' })
execFileSync(ffmpeg, ['-y', '-i', mp4, '-vf', 'select=eq(n\\,0)', '-frames:v', '1',
  join(OUT, 'cards-poster.webp')], { stdio: 'ignore' })
rmSync(tmp, { recursive: true, force: true })
console.log(`${n} frames @${rate}fps → ${mp4}`)
