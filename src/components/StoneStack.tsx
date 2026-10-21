import { stonePath, STONES } from '../lib/stone'

/* Six tones, base to crown. Flat fills — the stack reads by value and
   silhouette, not by shading. */
const TONE = ['#5F7A68', '#6C8574', '#7A9081', '#889B8D', '#96A699', '#A4B1A5']

export function StoneStack({
  size = 150, set = 5, total = 6, tone = TONE, gap = '#EFF0EC', className,
}: {
  size?: number; set?: number; total?: number; tone?: string[]; gap?: string; className?: string
}) {
  const rows = STONES.slice(0, total)
  let y = 0
  let minY = 0, maxY = 0, maxX = 0
  const laid = rows.map((s, i) => {
    const rx = s.w * size, ry = s.h * size
    y -= ry * 1.74
    const o = { ...s, rx, ry, y, i }
    // the tilt swings the extremes out, so bound on the rotated half-diagonal
    const ext = Math.abs(rx * Math.cos(s.rot)) + Math.abs(ry * Math.sin(s.rot))
    const exty = Math.abs(rx * Math.sin(s.rot)) + Math.abs(ry * Math.cos(s.rot))
    minY = Math.min(minY, y - exty); maxY = Math.max(maxY, y + exty)
    maxX = Math.max(maxX, Math.abs(s.dx * size) + ext)
    y -= ry * 0.26
    return o
  })
  const PAD = 4
  const vw = (maxX + PAD) * 2, vh = maxY - minY + PAD * 2

  return (
    <svg
      className={className}
      viewBox={`${-vw / 2} ${minY - PAD} ${vw} ${vh}`}
      width={vw} height={vh}
      role="img" aria-label={`${set} of ${total} protections set`}
    >
      {laid.map((s) => (
        <g key={s.i} transform={`translate(${s.dx * size},${s.y}) rotate(${(s.rot * 180) / Math.PI})`}>
          {s.i < set ? (
            <path
              d={stonePath(s.seed, s.rx, s.ry)}
              fill={tone[s.i] ?? tone[tone.length - 1]}
              stroke={gap} strokeWidth={Math.max(1, size * 0.023)} paintOrder="stroke fill"
            />
          ) : (
            <path
              d={stonePath(s.seed, s.rx, s.ry)}
              fill="none" stroke="currentColor" strokeOpacity={0.4}
              strokeWidth={1.4} strokeDasharray="3 4"
            />
          )}
        </g>
      ))}
    </svg>
  )
}

/** The single stone used as a list bullet. */
export function StoneDot({ seed = 3, size = 11, on = true }: { seed?: number; size?: number; on?: boolean }) {
  const rx = size / 2, ry = size * 0.36
  return (
    <svg viewBox={`${-rx - 1} ${-ry - 1} ${(rx + 1) * 2} ${(ry + 1) * 2}`} width={size} height={size * 0.72}>
      <path
        d={stonePath(seed, rx, ry)}
        fill={on ? 'currentColor' : 'none'}
        stroke="currentColor" strokeOpacity={on ? 1 : 0.4}
        strokeWidth={on ? 0 : 1.2} strokeDasharray={on ? undefined : '2 3'}
      />
    </svg>
  )
}
