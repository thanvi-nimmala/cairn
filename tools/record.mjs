/* Headless reel recorder.
   Drives the prototype through one autoplay reel and captures real frames
   over CDP, then encodes them. Earlier still-capture leaned on Chrome's
   --virtual-time-budget, which does not reliably advance rAF-driven
   animation; a screencast records what actually rendered. */
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = process.env.BASE ?? 'http://localhost:5183/keystone/'
const OUT = process.env.OUT ?? 'reels'
/* 24 rather than 30: these carry continuous UI motion, so the saving is
   real, and nothing here reads as film */
const FPS = 24
/** the page under the device, so the capture composites onto the portfolio */
const PAGE_BG = process.env.PAGE_BG ?? '#13161C'

const reels = process.argv.slice(2)
if (!reels.length) { console.error('usage: node tools/record.mjs <reel-id>...'); process.exit(1) }

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME, headless: true })

for (const id of reels) {
  const tmp = join(OUT, `.frames-${id}`)
  rmSync(tmp, { recursive: true, force: true })
  mkdirSync(tmp, { recursive: true })

  // Screencast returns frames at the viewport's CSS size and ignores
  // deviceScaleFactor, so resolution has to come from the layout instead:
  // a viewport twice the size, with the app's own phone scaler driven to 2.
  // The UI re-rasterises at the larger size, so type and vectors stay crisp.
  const ctx = await browser.newContext({
    viewport: { width: 920, height: 1960 },
    deviceScaleFactor: 1,
  })
  const page = await ctx.newPage()
  // the device floats; this is the only thing behind it
  await page.addStyleTag({ content:
    `html,body{background:${PAGE_BG} !important}` +
    `.stage{--phone-scale:2 !important}` +
    `.phone-wrap{width:780px !important;height:1688px !important}` }).catch(() => {})
  await page.goto(`${BASE}?reel=${id}`, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content:
    `html,body{background:${PAGE_BG} !important}` +
    `.stage{--phone-scale:2 !important}` +
    `.phone-wrap{width:780px !important;height:1688px !important}` })

  const cdp = await ctx.newCDPSession(page)
  let n = 0
  cdp.on('Page.screencastFrame', async ({ data, sessionId }) => {
    writeFileSync(join(tmp, `f${String(n++).padStart(5, '0')}.png`), Buffer.from(data, 'base64'))
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: 1000, maxHeight: 2100 })

  process.stdout.write(`  ${id} `)
  const started = Date.now()
  // run to the reel's own length rather than a guessed duration
  while (!(await page.evaluate(() => (window).__reelDone === true))) {
    if (Date.now() - started > 60000) break
    await page.waitForTimeout(250)
    process.stdout.write('.')
  }
  await cdp.send('Page.stopScreencast').catch(() => {})
  await page.waitForTimeout(300)
  await ctx.close()

  const secs = (Date.now() - started) / 1000
  const rate = Math.max(1, Math.round(n / secs))
  const mp4 = join(OUT, `reel-${id}.mp4`)
  execFileSync(ffmpeg, [
    '-y', '-framerate', String(rate), '-i', join(tmp, 'f%05d.png'),
    '-vf', `fps=${FPS},scale=trunc(iw/2)*2:trunc(ih/2)*2`,
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-crf', '25', '-preset', 'slow', '-movflags', '+faststart', '-an', mp4,
  ], { stdio: 'ignore' })
  // a poster for the video element to show before play
  execFileSync(ffmpeg, ['-y', '-i', mp4, '-vf', 'select=eq(n\\,0)', '-frames:v', '1',
    join(OUT, `reel-${id}-poster.webp`)], { stdio: 'ignore' })

  // and an alpha version. H.264 cannot carry transparency, so browsers that
  // support VP9 alpha get a device that genuinely floats and the rest fall
  // back to the mp4 composited on the page colour.
  if (process.env.ALPHA) {
    const webm = join(OUT, `reel-${id}.webm`)
    execFileSync(ffmpeg, [
      '-y', '-framerate', String(rate), '-i', join(tmp, 'f%05d.png'),
      '-vf', `fps=${FPS}`, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
      '-crf', '34', '-b:v', '0', '-an', webm,
    ], { stdio: 'ignore' })
  }
  rmSync(tmp, { recursive: true, force: true })
  console.log(` ${n} frames @${rate}fps → ${mp4}`)
}

await browser.close()
