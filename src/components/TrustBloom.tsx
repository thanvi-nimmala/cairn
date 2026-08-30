import { useEffect, useRef, useState } from 'react'

interface Props {
  score: number
  size?: number
  label?: boolean
  animate?: boolean
  /** 0–1 turbulence: rises when the AI is uneasy, making the bloom ragged */
  agitation?: number
}

const TICKS = 72

/**
 * The app's signature score visual: a radial bloom of ticks whose lengths ride a
 * standing wave. Lit ticks encode the trust score; agitation roughens the wave.
 */
export function TrustBloom({ score, size = 150, label = true, animate = true, agitation = 0 }: Props) {
  const [shown, setShown] = useState(animate ? 0 : score)
  const [phase, setPhase] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    if (!animate) { setShown(score); return }
    let start: number | undefined
    const dur = 1150
    const step = (t: number) => {
      start ??= t
      const p = Math.min(1, (t - start) / dur)
      setShown(Math.round((1 - Math.pow(1 - p, 3)) * score))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [score, animate])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id = 0
    const tick = () => { setPhase((p) => p + 0.016); id = requestAnimationFrame(tick) }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const cx = size / 2
  const cy = size / 2
  const rIn = size * 0.315
  const litCount = Math.round((shown / 100) * TICKS)

  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2
    const lit = i < litCount
    // standing wave + agitation-driven second harmonic
    const wave = Math.sin(i * 0.55 + phase * 1.6) * 0.5 + 0.5
    const rough = agitation * (Math.sin(i * 2.7 + phase * 5.2) * 0.5 + 0.5)
    const len = lit ? size * (0.055 + 0.055 * wave + 0.05 * rough) : size * 0.022
    const r2 = rIn + len
    return {
      x1: cx + Math.cos(a) * rIn, y1: cy + Math.sin(a) * rIn,
      x2: cx + Math.cos(a) * r2,  y2: cy + Math.sin(a) * r2,
      lit, o: lit ? 0.55 + 0.45 * wave : 0.28,
    }
  })

  const uid = `bloom${size}`

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-3)" />
            <stop offset="52%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
          <filter id={`${uid}g`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={size * 0.028} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* inner hairline */}
        <circle cx={cx} cy={cy} r={rIn - size * 0.035} fill="none" stroke="var(--line)" strokeWidth={1} opacity={0.65} />

        <g filter={`url(#${uid}g)`}>
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.lit ? `url(#${uid})` : 'var(--surface-3)'}
              strokeWidth={size * 0.019}
              strokeLinecap="round"
              opacity={t.o}
            />
          ))}
        </g>
      </svg>

      {label && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <div className="num" style={{ fontWeight: 700, fontSize: size * 0.255, lineHeight: 1, color: 'var(--text)' }}>
            {shown}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: Math.max(8, size * 0.062),
            color: 'var(--text-faint)', letterSpacing: '.18em', textTransform: 'uppercase',
          }}>
            trust
          </div>
        </div>
      )}
    </div>
  )
}
