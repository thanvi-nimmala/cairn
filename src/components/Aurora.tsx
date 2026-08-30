import { useEffect, useRef } from 'react'

export type Mood = 'calm' | 'alert' | 'success' | 'scan'

const MOODS: Record<Mood, { stops: string[]; speed: number; energy: number }> = {
  calm:    { stops: ['--accent', '--accent-3', '--accent-2'], speed: 0.55, energy: 0.9 },
  scan:    { stops: ['--accent-3', '--accent', '--accent'],   speed: 1.5,  energy: 1.15 },
  alert:   { stops: ['--danger', '--warn', '--danger'],       speed: 1.9,  energy: 1.35 },
  success: { stops: ['--safe', '--accent-3', '--safe'],       speed: 0.7,  energy: 1.0 },
}

const readVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#8A5CFF'

/**
 * Low-res canvas of drifting light blobs, upscaled and blurred by CSS.
 * This is the app's ambient "trust field" — its colour tracks security state.
 */
export function Aurora({ mood = 'calm', opacity = 1 }: { mood?: Mood; opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const moodRef = useRef(mood)
  moodRef.current = mood

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const W = (cv.width = 120)
    const H = (cv.height = 260)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // current colours, lerped toward the target mood so transitions feel physical
    let cur = MOODS[moodRef.current].stops.map(readVar)
    let curEnergy = MOODS[moodRef.current].energy

    const blobs = [
      { fx: 0.31, fy: 0.19, px: 0.0, py: 1.1, r: 0.62, i: 0 },
      { fx: 0.23, fy: 0.27, px: 2.1, py: 0.4, r: 0.52, i: 1 },
      { fx: 0.17, fy: 0.13, px: 4.2, py: 3.3, r: 0.7,  i: 2 },
      { fx: 0.37, fy: 0.21, px: 1.2, py: 5.1, r: 0.4,  i: 0 },
    ]

    let raf = 0
    let t = 0
    let last = performance.now()

    const draw = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const m = MOODS[moodRef.current]
      t += (dt / 1000) * m.speed * (reduce ? 0 : 1)

      const target = m.stops.map(readVar)
      cur = cur.map((_, i) => target[i]) // colours swap instantly; opacity ramp does the blending
      curEnergy += (m.energy - curEnergy) * 0.05

      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      for (const b of blobs) {
        const x = W * (0.5 + 0.42 * Math.sin(t * b.fx + b.px))
        const y = H * (0.5 + 0.46 * Math.cos(t * b.fy + b.py))
        const r = W * b.r * curEnergy
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, cur[b.i])
        g.addColorStop(1, 'transparent')
        ctx.globalAlpha = 0.58
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: 'absolute',
        inset: '-18%',
        width: '136%',
        height: '136%',
        filter: 'blur(38px) saturate(150%)',
        opacity: opacity * (mood === 'alert' ? 0.8 : 0.66),
        transition: 'opacity .7s ease',
        pointerEvents: 'none',
      }}
    />
  )
}
