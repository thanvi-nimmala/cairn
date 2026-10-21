import { motion } from 'framer-motion'
import { FADE, KNOB, SURFACE } from '../lib/motion'
import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './Icon'
import type { Risk } from '../lib/types'

/* The ground every screen sits on. Kept here rather than in a wrapper so
   that Screen and Sheet cannot drift apart from each other. */
export const FIELD =
  'radial-gradient(120% 68% at 62% 6%, var(--field-lift), transparent 62%),' +
  'radial-gradient(90% 50% at 8% 96%, var(--field-bloom), transparent 70%),' +
  'linear-gradient(168deg, var(--field-1) 0%, var(--field-2) 48%, var(--field-3) 100%)'

/* ── screen scroller ─────────────────────────────────────────── */
export function Screen({ children, pad = true, style }: { children: ReactNode; pad?: boolean; style?: CSSProperties }) {
  return (
    <motion.div
      className="scroll"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={FADE}
      style={{
        height: '100%', padding: pad ? '56px 20px 116px' : 0, position: 'relative',
        background: FIELD,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ── avatar ──────────────────────────────────────────────────── */
export function Avatar({
  initials, hue = 288, size = 44, biz = false, ring = false, style,
}: { initials: string; hue?: number; size?: number; biz?: boolean; ring?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: size, height: size, flexShrink: 0,
        borderRadius: biz ? size * 0.3 : '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `hsl(${hue} 13% 90%)`,
        color: `hsl(${hue} 20% 34%)`,
        fontFamily: 'var(--font-display)', fontWeight: 600,
        fontSize: size * 0.33, letterSpacing: '0.01em',
        boxShadow: ring ? `0 0 0 2px var(--ink), 0 0 0 3.5px var(--accent)` : 'none',
        ...style,
      }}
    >
      {initials}
    </div>
  )
}

/* ── card surface ────────────────────────────────────────────── */
export function Card({
  children, style, onClick, tone,
}: { children: ReactNode; style?: CSSProperties; onClick?: () => void; tone?: 'accent' | 'safe' | 'danger' }) {
  const toneStyle: CSSProperties = tone
    ? {
        background: `color-mix(in srgb, var(--${tone === 'accent' ? 'accent' : tone}) 9%, var(--surface))`,
        borderColor: `color-mix(in srgb, var(--${tone === 'accent' ? 'accent' : tone}) 26%, var(--line))`,
      }
    : {}
  return (
    <div
      onClick={onClick}
      className={`${tone ? 'sheen' : 'glass'} ${onClick ? 'press' : ''}`}
      style={{
        borderRadius: 'var(--r-card)',
        cursor: onClick ? 'pointer' : undefined,
        ...toneStyle,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── buttons ─────────────────────────────────────────────────── */
export function Button({
  children, variant = 'primary', icon, onClick, full = true, danger = false, disabled = false, style, demo,
}: {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: string
  onClick?: () => void
  full?: boolean
  danger?: boolean
  disabled?: boolean
  style?: CSSProperties
  /** hook for the autoplay runner to target this control */
  demo?: string
}) {
  const base: CSSProperties = {
    height: 54, borderRadius: 'var(--r-btn)', border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.005em',
    whiteSpace: 'nowrap', width: full ? '100%' : 'auto', padding: full ? 0 : '0 22px',
    opacity: disabled ? 0.38 : 1, position: 'relative', overflow: 'hidden',
  }
  const variants: Record<string, CSSProperties> = {
    primary: danger
      ? { background: 'var(--danger)', color: '#fff', boxShadow: 'var(--sh-1)' }
      : { background: 'var(--text)', color: 'var(--surface)', boxShadow: 'var(--sh-1)' },
    secondary: {
      background: 'var(--surface)', color: danger ? 'var(--danger)' : 'var(--text)',
      border: `1px solid ${danger ? 'color-mix(in srgb, var(--danger) 38%, transparent)' : 'var(--line)'}`,
    },
    ghost: { background: 'transparent', color: danger ? 'var(--danger)' : 'var(--text-dim)' },
  }
  return (
    <button
      className="press"
      data-demo={demo}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
    >
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 9 }}>
        {icon && <Icon name={icon} size={20} stroke={2.2} />}
        {children}
      </span>
    </button>
  )
}

/* ── AI verdict badge ────────────────────────────────────────── */
const RISK_MAP: Record<Risk, { c: string; t: string; icon: string }> = {
  safe: { c: 'var(--safe)',   t: 'cleared',  icon: 'check' },
  med:  { c: 'var(--warn)',   t: 'watching', icon: 'eye' },
  high: { c: 'var(--danger)', t: 'held',     icon: 'alert' },
}

export function AIBadge({ risk = 'safe', size = 'sm' }: { risk?: Risk; size?: 'sm' | 'md' }) {
  const m = RISK_MAP[risk]
  const big = size === 'md'
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: big ? '5px 11px 5px 8px' : '3px 8px 3px 6px',
        borderRadius: 'var(--r-pill)',
        background: `color-mix(in srgb, ${m.c} 11%, #fff)`,
        border: `1px solid color-mix(in srgb, ${m.c} 26%, transparent)`,
        color: m.c, fontFamily: 'var(--font-mono)', fontSize: big ? 9.5 : 8.5, fontWeight: 600,
        letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}
    >
      <Icon name={m.icon} size={big ? 13 : 11} stroke={2.6} />
      {m.t}
    </span>
  )
}

/* ── toggle ──────────────────────────────────────────────────── */
export function Switch({ on, onChange, locked = false, demo }: {
  on: boolean; onChange: (v: boolean) => void; locked?: boolean; demo?: string
}) {
  return (
    <button
      disabled={locked}
      data-demo={demo}
      onClick={() => !locked && onChange(!on)}
      aria-pressed={on}
      style={{
        width: 47, height: 28, borderRadius: 999, border: 'none', position: 'relative', flexShrink: 0, padding: 0,
        cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.45 : 1,
        background: on ? 'var(--accent)' : 'var(--surface-3)',
        boxShadow: 'none',
        transition: 'background .25s, box-shadow .25s',
      }}
    >
      <motion.span
        animate={{ left: on ? 21.5 : 2.5 }}
        transition={KNOB}
        style={{
          position: 'absolute', top: 2.5, width: 23, height: 23, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 3px rgba(26,29,26,.22)',
        }}
      />
    </button>
  )
}

/* ── full-screen sheet ───────────────────────────────────────── */
export function Sheet({
  children, onClose, title, back = false, action,
}: { children: ReactNode; onClose: () => void; title?: string; back?: boolean; action?: ReactNode }) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={SURFACE}
      style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: FIELD, display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '52px 18px 10px', flexShrink: 0 }}>
        <button className="press glass" onClick={onClose} style={sheetBtn} aria-label={back ? 'Back' : 'Close'}>
          <Icon name={back ? 'chevL' : 'x'} size={19} stroke={2.2} />
        </button>
        {title && (
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16.5, letterSpacing: '-0.01em' }}>
            {title}
          </div>
        )}
        <div style={{ marginLeft: 'auto' }}>{action}</div>
      </div>
      <div className="scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
    </motion.div>
  )
}

const sheetBtn: CSSProperties = {
  width: 38, height: 38, borderRadius: '50%', flexShrink: 0, border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)',
}

/* ── section label ───────────────────────────────────────────── */
export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 0 9px' }}>
      <span className="mono-label">{children}</span>
      {right}
    </div>
  )
}

/* ── divider-separated list wrapper ──────────────────────────── */
export function Rows({ children }: { children: ReactNode[] }) {
  return (
    <>
      {children.map((c, i) => (
        <div key={i} style={{ borderTop: i ? '1px solid var(--line-soft)' : 'none' }}>{c}</div>
      ))}
    </>
  )
}
