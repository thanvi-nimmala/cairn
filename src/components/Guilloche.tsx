/**
 * Spirograph line-work, the way it appears on banknotes and share certificates.
 * Used as a faint security-print texture behind the balance and card faces.
 */
export function Guilloche({
  size = 320, rings = 26, opacity = 0.16, stroke = 'var(--accent-2)',
}: { size?: number; rings?: number; opacity?: number; stroke?: string }) {
  const c = size / 2
  const paths: string[] = []
  for (let k = 0; k < rings; k++) {
    const R = size * 0.42
    const r = size * (0.1 + 0.012 * k)
    const d = size * (0.16 - 0.004 * k)
    const pts: string[] = []
    for (let i = 0; i <= 220; i++) {
      const t = (i / 220) * Math.PI * 2 * 3
      const x = c + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t)
      const y = c + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t)
      pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    paths.push(pts.join(''))
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden
      style={{ position: 'absolute', pointerEvents: 'none', opacity }}>
      <g fill="none" stroke={stroke} strokeWidth={0.4}>
        {paths.map((d, i) => <path key={i} d={d} opacity={1 - i / (rings * 1.6)} />)}
      </g>
    </svg>
  )
}
