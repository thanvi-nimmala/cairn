/* Records a standalone feature panel at full resolution.

   Not a screencast: CDP returns frames at the viewport's CSS size and ignores
   deviceScaleFactor, so screencast capture is stuck at 1x. These panels are
   driven entirely by CSS animation, which means the Web Animations API can
   step them frame by frame instead — every frame is a real screenshot at the
   context's scale factor, and the timeline is exact rather than wall-clock,
   so the loop closes perfectly. */
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PAGES = {
  scan: 'panels.html?p=scan', mark: 'panels.html?p=mark',
  cover: 'cover-motion.html',
}
const ROOT = 'http://localhost:5183/keystone/cards/'
const OUT = 'reels'
/* the cover changes frame to frame throughout, so it is the one that gains
   from a lower rate; the others are mostly held states */
const RATES = { cover: 24, mark: 24, scan: 24 }
/* and a touch more compression: at 24fps each frame carries more change,
   so holding CRF 20 just moves the weight rather than removing it */
const CRFS = { cover: 24, mark: 24, scan: 24 }
const FPS = 30
const SCALE = 2
const SIZES = { scan: [880, 1120], mark: [900, 1140], cover: [520, 796] }
/* each panel's own loop length */
const CYCLES = { scan: 6.0, mark: 6.0, cover: 9.0 }

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: CHROME, headless: true })

for (const p of process.argv.slice(2)) {
  const [w, h] = SIZES[p] ?? [900, 1140]
  const tmp = join(OUT, `.frames-${p}`)
  rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true })

  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: SCALE })
  const page = await ctx.newPage()
  await page.goto(ROOT + (PAGES[p] ?? `panels.html?p=${p}`), { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  const fps = RATES[p] ?? FPS
  const total = Math.round((CYCLES[p] ?? 6.0) * fps)
  process.stdout.write(`  ${p} `)
  for (let i = 0; i < total; i++) {
    // drive every animation to the same instant, then shoot it
    await page.evaluate((ms) => {
      document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms })
    }, (i / fps) * 1000)
    // NOT animations:'disabled' — that rewinds CSS animations to their first
    // frame and silently overrides the currentTime set above, so every frame
    // comes out identical. They are already paused; just shoot them.
    const buf = await page.screenshot({ type: 'png' })
    writeFileSync(join(tmp, `f${String(i).padStart(5, '0')}.png`), buf)
    if (i % 30 === 0) process.stdout.write('.')
  }
  await ctx.close()

  const mp4 = join(OUT, `panel-${p}.mp4`)
  execFileSync(ffmpeg, ['-y', '-framerate', String(fps), '-i', join(tmp, 'f%05d.png'),
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', String(CRFS[p] ?? 20), '-preset', 'slow',
    '-movflags', '+faststart', '-an', mp4], { stdio: 'ignore' })
  execFileSync(ffmpeg, ['-y', '-i', mp4, '-vf', 'select=eq(n\\,0)', '-frames:v', '1',
    join(OUT, `panel-${p}-poster.webp`)], { stdio: 'ignore' })
  rmSync(tmp, { recursive: true, force: true })
  console.log(` ${total} frames → ${mp4}`)
}
await browser.close()
