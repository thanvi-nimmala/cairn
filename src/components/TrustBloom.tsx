import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SETTLE, drift, step } from '../lib/motion'
import { stonePath, STONES } from '../lib/stone'

interface Props {
  score: number
  size?: number
  label?: boolean
  animate?: boolean
  /** 0–1 unease: the crown stone lifts and tilts, as if the stack were settling */
  agitation?: number
  /** how many stones are set. Defaults to deriving from the score, but the two
      are different facts — six protections, a hundred points — so callers that
      know the real armed count should pass it. */
  set?: number
  /** how many stones the stack can hold at all. */
  total?: number
  /** inverts the separator and the unset outlines for a dark ground. */
  dark?: boolean
}

/* Cut from whatever rock the scheme is made of — applyTheme interpolates
   both ramps, so a clay or plum ground never gets a sage cairn. */
const TONE = [1, 2, 3, 4, 5, 6].map((i) => `var(--stone-${i})`)
/* on the scanner field the ramp inverts: the base has to stay off the black */
const TONE_DARK = [1, 2, 3, 4, 5, 6].map((i) => `var(--stone-d${i})`)

/**
 * The app's score visual: a cairn. Each stone is one protection that is set,
 * so the stack height *is* the score — six stones is the full six. Agitation
 * unsettles the crown rather than roughening everything, because an unsteady
 * cairn is legible in a way a ragged wave is not.
 */
export function TrustBloom({
  score, size = 150, label = true, animate = true, agitation = 0,
  set: setProp, total: totalProp, dark = false,
}: Props) {
  const [shown, setShown] = useState(animate ? 0 : score)
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

  const total = Math.max(1, Math.min(STONES.length, totalProp ?? STONES.length))
  const rows = STONES.slice(0, total)
  const set = Math.max(0, Math.min(total,
    setProp ?? Math.round((shown / 100) * total)))

  // lay the stack out bottom-up, tracking bounds so the viewBox fits exactly
  let y = 0, minY = 0, maxY = 0, maxX = 0
  const laid = rows.map((s, i) => {
    const rx = s.w * size, ry = s.h * size
    y -= ry * 1.74
    const extX = Math.abs(rx * Math.cos(s.rot)) + Math.abs(ry * Math.sin(s.rot))
    const extY = Math.abs(rx * Math.sin(s.rot)) + Math.abs(ry * Math.cos(s.rot))
    minY = Math.min(minY, y - extY); maxY = Math.max(maxY, y + extY)
    maxX = Math.max(maxX, Math.abs(s.dx * size) + extX)
    const o = { ...s, rx, ry, y, i }
    y -= ry * 0.26
    return o
  })
  const PAD = 5
  const vw = (maxX + PAD) * 2, vh = maxY - minY + PAD * 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg
        viewBox={`${-vw / 2} ${minY - PAD} ${vw} ${vh}`}
        width={vw} height={vh}
        role="img" aria-label={`Trust score ${shown} of 100, ${set} of ${total} stones set`}
      >
        {laid.map((s) => {
          const isCrown = s.i === set - 1
          const wobble = isCrown ? agitation : 0
          return (
            <g key={s.i} transform={`translate(${s.dx * size},${s.y})`}>
              <motion.g
                animate={{
                  y: -wobble * size * 0.045,
                  rotate: (s.rot * 180) / Math.PI + wobble * 7,
                }}
                transition={wobble ? drift(1.5) : { ...SETTLE, delay: step(s.i, 0.05) }}
                style={{ transformOrigin: '0px 0px' }}
              >
                {s.i < set ? (
                  <path
                    d={stonePath(s.seed, s.rx, s.ry)}
                    fill={(dark ? TONE_DARK : TONE)[s.i] ?? (dark ? TONE_DARK : TONE)[5]}
                    stroke={dark ? 'var(--scan-core)' : 'var(--ink)'}
                    strokeWidth={Math.max(1, size * 0.023)} paintOrder="stroke fill"
                  />
                ) : (
                  <path
                    d={stonePath(s.seed, s.rx, s.ry)}
                    fill="none" stroke={dark ? '#FFFFFF' : 'var(--text-faint)'}
                    strokeOpacity={dark ? 0.42 : 0.55}
                    strokeWidth={Math.max(1, size * 0.009)}
                    strokeDasharray={`${size * 0.02} ${size * 0.027}`}
                  />
                )}
              </motion.g>
            </g>
          )
        })}
      </svg>
      {label && (
        <div style={{ textAlign: 'center' }}>
          <div className="num" style={{ fontSize: size * 0.3, lineHeight: 1, color: 'var(--text)' }}>{shown}</div>
          <div className="mono-label" style={{ marginTop: 5 }}>{set} of {total} set</div>
        </div>
      )}
    </div>
  )
}
