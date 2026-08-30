import { useCallback, useEffect, useRef, useState } from 'react'
import { REELS, type DemoCtx, type Reel } from './reels'

export interface CursorPos { x: number; y: number }

/**
 * Walks a reel's steps: moves a synthetic pointer to each target, clicks it,
 * and holds. Everything is cancellable so switching reels never leaves a
 * stray timer running.
 */
export function useDemoRunner(ctx: DemoCtx) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [cursor, setCursor] = useState<CursorPos | null>(null)
  const [tapKey, setTapKey] = useState(0)
  const [progress, setProgress] = useState(0)

  const run = useRef(0)
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const stop = useCallback(() => {
    run.current += 1
    setActiveId(null)
    setCaption('')
    setCursor(null)
    setProgress(0)
  }, [])

  const play = useCallback((id: string) => {
    const reel = REELS.find((r) => r.id === id)
    if (!reel) return
    run.current += 1
    const token = run.current
    const alive = () => run.current === token
    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms))

    setActiveId(id)
    setProgress(0)

    void (async () => {
      do {
        for (let i = 0; i < reel.steps.length; i++) {
          if (!alive()) return
          const step = reel.steps[i]
          setProgress((i + 1) / reel.steps.length)
          if (step.caption !== undefined) setCaption(step.caption)

          if (step.target) {
            const el = await waitFor(`[data-demo="${step.target}"]`, alive)
            if (!alive()) return
            if (el) {
              const r = el.getBoundingClientRect()
              setCursor({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
              await sleep(430)
              if (!alive()) return
              setTapKey((k) => k + 1)
              el.click()
            }
          }

          step.act?.(ctxRef.current)
          await sleep(step.hold ?? 800)
        }
      } while (reel.loop && alive())

      if (alive()) {
        setActiveId(null)
        setCaption('')
        setCursor(null)
        setProgress(0)
      }
    })()
  }, [])

  useEffect(() => stop, [stop])

  return { activeId, caption, cursor, tapKey, progress, play, stop, reels: REELS as Reel[] }
}

/** Targets can mount a frame or two late — poll briefly before giving up. */
async function waitFor(sel: string, alive: () => boolean): Promise<HTMLElement | null> {
  for (let i = 0; i < 24; i++) {
    const el = document.querySelector<HTMLElement>(sel)
    if (el) return el
    if (!alive()) return null
    await new Promise<void>((res) => setTimeout(res, 60))
  }
  return null
}
