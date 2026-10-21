import { motion } from 'framer-motion'
import { drift } from '../lib/motion'

/**
 * A depth-scan wireframe, not a face glyph. Apple's own mark — brackets, two
 * dots, a smile — reads as an emoji at this size, which is the wrong register
 * for the moment you authorise money. A lat/long mesh over the head reads as
 * measurement instead, and the scan line gives it a present tense.
 */
export function FaceScan({
  state = 'scanning', size = 120, dark = false,
}: { state?: 'scanning' | 'done'; size?: number; dark?: boolean }) {
  const done = state === 'done'
  const hx = size * 0.38, hy = size * 0.48
  const line = dark ? 'rgba(255,255,255,0.26)' : 'color-mix(in srgb, var(--accent) 38%, transparent)'
  const edge = dark ? 'rgba(255,255,255,0.55)' : 'color-mix(in srgb, var(--accent) 65%, transparent)'
  const brac = dark ? 'rgba(255,255,255,0.92)' : 'var(--accent)'
  const scan = done ? 'var(--safe)' : dark ? 'var(--scan)' : 'var(--accent)'
  const vb = size * 1.3
  const id = `fs-${dark ? 'd' : 'l'}-${size}`

  return (
    <svg
      viewBox={`${-vb / 2} ${-vb / 2} ${vb} ${vb}`} width={size * 1.3} height={size * 1.3}
      role="img" aria-label={done ? 'Face verified' : 'Scanning your face'}
    >
      <defs>
        <clipPath id={id}><ellipse rx={hx} ry={hy} /></clipPath>
      </defs>

      <g clipPath={`url(#${id})`}>
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
          const y = i * (hy / 3.4)
          return <path key={`a${i}`} d={`M${-hx},${y} Q0,${y + hy * 0.15} ${hx},${y}`} fill="none" stroke={line} strokeWidth={1} />
        })}
        {[-2, -1, 0, 1, 2].map((j) => {
          const x = j * (hx / 2.4)
          return <path key={`b${j}`} d={`M${x},${-hy} Q${x + j * 5},0 ${x},${hy}`} fill="none" stroke={line} strokeWidth={1} />
        })}
        {!done && (
          <motion.path
            d={`M${-hx},0 Q0,${hy * 0.15} ${hx},0`}
            fill="none" stroke={scan} strokeWidth={2}
            animate={{ y: [-hy * 0.8, hy * 0.8, -hy * 0.8] }}
            transition={drift(2.4)}
          />
        )}
      </g>

      <ellipse rx={hx} ry={hy} fill="none" stroke={edge} strokeWidth={1.3} />

      {/* registration brackets */}
      <g stroke={done ? 'var(--safe)' : brac} strokeWidth={size * 0.022} strokeLinecap="round" fill="none">
        {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => {
          const x = sx * hx * 1.42, y = sy * hy * 1.2, a = size * 0.13
          return <path key={`${sx}${sy}`} d={`M${x},${y - sy * a} L${x},${y} L${x - sx * a},${y}`} />
        })}
      </g>

      {done && (
        <motion.path
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
          d={`M${-hx * 0.42},0 L${-hx * 0.08},${hy * 0.3} L${hx * 0.5},${-hy * 0.32}`}
          fill="none" stroke="var(--safe)" strokeWidth={size * 0.038}
          strokeLinecap="round" strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
