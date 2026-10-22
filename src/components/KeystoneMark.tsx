import { stonePath } from '../lib/stone'

/* Four stones, read at 16px as well as 160px. The mark is the product:
   each stone is a protection, the stack is the account. */
const MARK = [
  { w: 0.46, h: 0.112, dx:  0.00, rot: -0.05, seed: 3 },
  { w: 0.37, h: 0.104, dx: -0.05, rot:  0.11, seed: 29 },
  { w: 0.30, h: 0.100, dx:  0.05, rot: -0.09, seed: 41 },
  { w: 0.21, h: 0.086, dx:  0.02, rot:  0.10, seed: 67 },
]

export function KeystoneMark({
  size = 24, color = 'currentColor', gap,
}: { size?: number; color?: string; gap?: string }) {
  let y = 0, minY = 0, maxY = 0, maxX = 0
  const laid = MARK.map((s, i) => {
    const rx = s.w * size, ry = s.h * size
    y -= ry * 1.9
    const eX = Math.abs(rx * Math.cos(s.rot)) + Math.abs(ry * Math.sin(s.rot))
    const eY = Math.abs(rx * Math.sin(s.rot)) + Math.abs(ry * Math.cos(s.rot))
    minY = Math.min(minY, y - eY); maxY = Math.max(maxY, y + eY)
    maxX = Math.max(maxX, Math.abs(s.dx * size) + eX)
    const o = { ...s, rx, ry, y, i }
    y -= ry * 0.18
    return o
  })
  const P = size * 0.03
  const vw = (maxX + P) * 2, vh = maxY - minY + P * 2
  return (
    <svg viewBox={`${-vw / 2} ${minY - P} ${vw} ${vh}`} width={vw} height={vh} aria-hidden>
      {laid.map((s) => (
        <path
          key={s.i}
          transform={`translate(${s.dx * size},${s.y}) rotate(${(s.rot * 180) / Math.PI})`}
          d={stonePath(s.seed, s.rx, s.ry)}
          fill={color}
          {...(gap ? { stroke: gap, strokeWidth: size * 0.035, paintOrder: 'stroke fill' as const } : {})}
        />
      ))}
    </svg>
  )
}
