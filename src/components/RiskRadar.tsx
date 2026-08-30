import { motion } from 'framer-motion'
import type { RiskFactor } from '../lib/types'

/**
 * Radar of the model's risk signals — shows *shape* of suspicion at a glance,
 * so the list underneath reads as explanation rather than raw output.
 */
export function RiskRadar({ factors, size = 210 }: { factors: RiskFactor[]; size?: number }) {
  const c = size / 2
  const R = size * 0.33
  const n = factors.length

  const pt = (i: number, k: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [c + Math.cos(a) * R * k, c + Math.sin(a) * R * k] as const
  }

  const poly = factors.map((f, i) => pt(i, Math.max(0.08, f.weight)).join(',')).join(' ')
  const grid = [0.25, 0.5, 0.75, 1]

  return (
    <svg width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="riskFill" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--danger)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--danger)" stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {grid.map((k) => (
        <polygon
          key={k}
          points={factors.map((_, i) => pt(i, k).join(',')).join(' ')}
          fill="none" stroke="var(--line)" strokeWidth={k === 1 ? 1 : 0.7} opacity={k === 1 ? 0.8 : 0.4}
        />
      ))}
      {factors.map((_, i) => {
        const [x, y] = pt(i, 1)
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--line)" strokeWidth={0.7} opacity={0.4} />
      })}

      <motion.polygon
        points={poly}
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 130, damping: 18, delay: 0.15 }}
        style={{ transformOrigin: `${c}px ${c}px` }}
        fill="url(#riskFill)" stroke="var(--danger)" strokeWidth={1.6} strokeLinejoin="round"
      />

      {factors.map((f, i) => {
        const [x, y] = pt(i, Math.max(0.08, f.weight))
        return (
          <motion.circle
            key={i} cx={x} cy={y} r={3}
            fill={f.level === 'high' ? 'var(--danger)' : f.level === 'med' ? 'var(--warn)' : 'var(--text-faint)'}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.06 }}
          />
        )
      })}

      {factors.map((f, i) => {
        const [x, y] = pt(i, 1.44)
        return (
          <text
            key={i} x={x} y={y}
            textAnchor={x < c - 4 ? 'end' : x > c + 4 ? 'start' : 'middle'}
            dominantBaseline="middle"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--text-faint)', letterSpacing: '.04em' }}
          >
            {f.label.split(' ')[0].toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}
