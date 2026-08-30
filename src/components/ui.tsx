import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './Icon'
import type { Risk } from '../lib/types'

/* ── screen scroller ─────────────────────────────────────────── */
export function Screen({ children, pad = true, style }: { children: ReactNode; pad?: boolean; style?: CSSProperties }) {
  return (
    <motion.div
      className="scroll"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 0.9, 0.3, 1] }}
      style={{ height: '100%', padding: pad ? '56px 20px 116px' : 0, position: 'relative', ...style }}
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
        background: `linear-gradient(155deg, oklch(0.52 0.15 ${hue}), oklch(0.28 0.09 ${hue}))`,
        color: `oklch(0.97 0.04 ${hue})`,
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: size * 0.35, letterSpacing: '0.01em',
        boxShadow: `inset 0 1px 0 oklch(1 0 0 / .18), 0 2px 8px oklch(0.1 0.05 ${hue} / .5)${ring ? `, 0 0 0 2px var(--ink), 0 0 0 3.5px oklch(0.6 0.16 ${hue})` : ''}`,
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
        background: `color-mix(in oklch, var(--${tone === 'accent' ? 'accent' : tone}) 11%, var(--surface))`,
        borderColor: `color-mix(in oklch, var(--${tone === 'accent' ? 'accent' : tone}) 34%, var(--line))`,
      }
    : {}
  return (
    <div
      onClick={onClick}
      className={`sheen ${onClick ? 'press' : ''}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
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
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, letterSpacing: '-0.005em',
    whiteSpace: 'nowrap', width: full ? '100%' : 'auto', padding: full ? 0 : '0 22px',
    opacity: disabled ? 0.38 : 1, position: 'relative', overflow: 'hidden',
  }
  const variants: Record<string, CSSProperties> = {
    primary: danger
      ? { background: 'var(--danger)', color: '#fff', boxShadow: '0 8px 26px color-mix(in oklch, var(--danger) 42%, transparent)' }
      : { background: 'var(--spectrum)', color: 'var(--on-accent)', boxShadow: '0 8px 26px var(--accent-glow)' },
    secondary: { background: 'var(--surface-2)', color: danger ? 'var(--danger)' : 'var(--text)', border: '1px solid var(--line)' },
    ghost: { background: 'transparent', color: danger ? 'var(--danger)' : 'var(--text-dim)' },
  }
  return (
    <button
      className="press"
      data-demo={demo}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {variant === 'primary' && !danger && (
        <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, oklch(1 0 0 / .22), transparent 55%)', pointerEvents: 'none' }} />
      )}
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 9 }}>
        {icon && <Icon name={icon} size={20} stroke={2.2} />}
        {children}
      </span>
    </button>
  )
}

/* ── AI verdict badge ────────────────────────────────────────── */
const RISK_MAP: Record<Risk, { c: string; t: string; icon: string }> = {
  safe: { c: 'var(--safe)',   t: 'verified', icon: 'check' },
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
        background: `color-mix(in oklch, ${m.c} 13%, transparent)`,
        border: `1px solid color-mix(in oklch, ${m.c} 32%, transparent)`,
        color: m.c, fontFamily: 'var(--font-mono)', fontSize: big ? 11 : 9.5,
        letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
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
        background: on ? 'var(--spectrum)' : 'var(--surface-3)',
        boxShadow: on ? '0 0 14px var(--accent-glow)' : 'inset 0 1px 3px oklch(0 0 0 / .5)',
        transition: 'background .25s, box-shadow .25s',
      }}
    >
      <motion.span
        animate={{ left: on ? 21.5 : 2.5 }}
        transition={{ type: 'spring', stiffness: 620, damping: 34 }}
        style={{
          position: 'absolute', top: 2.5, width: 23, height: 23, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 4px oklch(0 0 0 / .45)',
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
      transition={{ type: 'spring', stiffness: 380, damping: 40, mass: 0.9 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'var(--ink)', display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '52px 18px 10px', flexShrink: 0 }}>
        <button className="press" onClick={onClose} style={sheetBtn} aria-label={back ? 'Back' : 'Close'}>
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
  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
  border: '1px solid var(--line)', background: 'var(--surface)',
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
