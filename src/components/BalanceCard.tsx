import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { PointerEvent } from 'react'
import { Icon } from './Icon'
import { Guilloche } from './Guilloche'
import { USER, fmtMoney } from '../lib/data'

/**
 * The balance surface, treated as a physical object: it tilts under the pointer,
 * catches a specular sweep, and carries banknote line-work underneath.
 */
export function BalanceCard({
  hidden, onToggle, delta = 2.4,
}: { hidden: boolean; onToggle: () => void; delta?: number }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 220, damping: 22 })
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 220, damping: 22 })
  const shineX = useTransform(mx, [0, 1], ['-10%', '110%'])

  const track = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const reset = () => { mx.set(0.5); my.set(0.5) }

  return (
    <div style={{ perspective: 900, marginBottom: 18 }}>
      <motion.div
        onPointerMove={track}
        onPointerLeave={reset}
        style={{
          rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d',
          position: 'relative', overflow: 'hidden',
          borderRadius: 'var(--r-card)', padding: '18px 20px 17px',
          background:
            'linear-gradient(152deg, color-mix(in oklch, var(--accent) 26%, var(--surface)) 0%, var(--surface) 58%, color-mix(in oklch, var(--accent-2) 14%, var(--surface)) 100%)',
          border: '1px solid color-mix(in oklch, var(--accent) 26%, var(--line))',
          boxShadow: '0 18px 44px oklch(0 0 0 / .45), inset 0 1px 0 oklch(1 0 0 / .12)',
        }}
      >
        <Guilloche size={300} opacity={0.13} stroke="var(--accent-2)" />
        <div style={{
          position: 'absolute', top: -70, right: -50, width: 190, height: 190, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow), transparent 68%)', pointerEvents: 'none',
        }} />
        {/* specular sweep tracking the pointer */}
        <motion.div style={{
          position: 'absolute', top: 0, bottom: 0, width: '46%', left: shineX,
          background: 'linear-gradient(100deg, transparent, oklch(1 0 0 / .10), transparent)',
          pointerEvents: 'none', filter: 'blur(6px)',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="mono-label">Total balance</span>
          <button className="press" onClick={onToggle} aria-label={hidden ? 'Show balance' : 'Hide balance'}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}>
            <Icon name={hidden ? 'eyeOff' : 'eye'} size={17} />
          </button>
        </div>

        <div className="num" style={{
          fontWeight: 700, fontSize: 42, letterSpacing: '-0.035em',
          marginTop: 5, position: 'relative', display: 'flex', alignItems: 'baseline', gap: 1,
        }}>
          {hidden ? (
            <span style={{ letterSpacing: '0.06em' }}>••••••</span>
          ) : (
            <>
              <span style={{ fontSize: 24, opacity: 0.55, marginRight: 2 }}>$</span>
              {USER.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 9, position: 'relative', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px',
            borderRadius: 'var(--r-pill)', background: 'color-mix(in oklch, var(--safe) 13%, transparent)',
            color: 'var(--safe)', fontFamily: 'var(--font-mono)', fontSize: 10.5,
          }}>
            <Icon name="arrowUR" size={11} stroke={2.6} />{delta}% this week
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-faint)' }}>{USER.card}</span>
          <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--text-faint)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-faint)' }}>
            {hidden ? 'hidden' : fmtMoney(USER.balance / 3.2) + ' available today'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
