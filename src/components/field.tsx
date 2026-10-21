import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { FADE, SETTLE } from '../lib/motion'
import { FIELD } from './ui'

/* ── the ground ──────────────────────────────────────────────
   Cards are the default move in a finance app and they are why
   most of them look alike. Here the whole screen is one tinted
   field and the data floats on it. */
export function Field({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="scroll"
      style={{
        height: '100%', position: 'relative',
        background: FIELD,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── a figure and what it is ─────────────────────────────────
   Big light numeral, small unit riding its baseline, label under. */
export function BigStat({
  value, unit, label, size = 44, tone, align = 'left',
}: { value: string; unit?: string; label: string; size?: number; tone?: string; align?: 'left' | 'right' }) {
  return (
    <div style={{ textAlign: align, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <span className="num" style={{ fontSize: size, lineHeight: 1, color: tone ?? 'var(--text)' }}>{value}</span>
        {unit && (
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: size * 0.42, color: 'var(--text-dim)' }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-dim)', marginTop: 5 }}>
        {label}
      </div>
    </div>
  )
}

/* ── the dark pill and its companion ─────────────────────────── */
export function FieldAction({
  children, onClick, icon = 'clock', onIcon, demo,
}: { children: ReactNode; onClick?: () => void; icon?: ReactNode; onIcon?: () => void; demo?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <button
        className="press" onClick={onClick} data-demo={demo}
        style={{
          flex: 1, height: 58, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'var(--text)', color: 'var(--surface)',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
        }}
      >
        {children}
      </button>
      <button
        className="press" onClick={onIcon} aria-label="History"
        style={{
          width: 58, height: 58, flexShrink: 0, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'var(--text)', color: 'var(--surface)', display: 'grid', placeItems: 'center',
        }}
      >
        {icon}
      </button>
    </div>
  )
}

/* ── atmospheric hero ────────────────────────────────────────
   One figure, large enough that it is the screen rather than a
   component on it, over a soft depth gradient. */
export function HeroField({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="scroll"
      style={{
        height: '100%', position: 'relative',
        background:
          'radial-gradient(130% 56% at 50% 2%, var(--hero-glow), transparent 64%),' +
          'radial-gradient(90% 44% at 86% 34%, var(--hero-wash), transparent 70%),' +
          'linear-gradient(178deg, var(--hero-1) 0%, var(--hero-2) 38%, var(--hero-3) 100%)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function HeroMetric({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="mono-label" style={{ color: 'var(--text-dim)' }}>{label}</div>
      <div
        className="num"
        style={{ fontSize: 108, lineHeight: 1, marginTop: 6, color: 'var(--text)', letterSpacing: '-0.05em' }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-dim)', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

/* ── area chart with flagged peaks ───────────────────────────
   A flag marks a moment someone changed something. Reading the
   shape tells you the trend; reading the flags tells you why. */
export interface Flag { at: number; label?: string }

export function AreaChart({
  series, flags = [], selected, height = 190, xLabels = [],
}: { series: number[]; flags?: Flag[]; selected?: number; height?: number; xLabels?: string[] }) {
  const W = 350, H = height, padT = 26, padB = xLabels.length ? 24 : 8, padR = 24
  const n = series.length
  const x = (i: number) => (i / (n - 1)) * (W - padR)
  const y = (v: number) => padT + (1 - v / 100) * (H - padT - padB)

  const ridge = useRef<SVGPolylineElement>(null)
  const [ridgeLen, setRidgeLen] = useState(0)

  const pts = series.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const area = `M0,${H - padB} L${pts.split(' ').join(' L')} L${x(n - 1)},${H - padB} Z`

  useEffect(() => {
    const el = ridge.current
    if (el) setRidgeLen(el.getTotalLength())
  }, [pts])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="ac-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--fill-top)" />
          <stop offset="100%" stopColor="var(--fill-btm)" />
        </linearGradient>
      </defs>

      <motion.path
        d={area} fill="url(#ac-fill)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...FADE, duration: 0.9, delay: 0.25 }}
      />
      <polyline
        ref={ridge} points={pts} fill="none" stroke="var(--text)"
        strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round"
        style={ridgeLen ? {
          strokeDasharray: ridgeLen,
          strokeDashoffset: ridgeLen,
          animation: 'drawline 1.3s cubic-bezier(.3,.9,.3,1) forwards',
        } : undefined}
      />

      {/* right-hand scale, as in an instrument rather than a dashboard */}
      <g stroke="var(--rule)" strokeWidth={1}>
        <line x1={W - padR + 10} y1={padT} x2={W - padR + 10} y2={H - padB} />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={W - padR + 10} y1={padT + (i / 4) * (H - padT - padB)} x2={W - padR + 16} y2={padT + (i / 4) * (H - padT - padB)} />
        ))}
      </g>
      <g fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="7.5" fontWeight="600">
        <text x={W - padR + 19} y={padT + 3}>100</text>
        <text x={W - padR + 19} y={H - padB + 3}>0</text>
      </g>

      {/* a flag is planted, so it arrives from the ground up as the ridge
          reaches it rather than fading in where it already was */}
      {flags.map((f) => {
        const fx = x(f.at), fy = y(series[f.at])
        const delay = (f.at / (n - 1)) * 1.3
        return (
          <motion.g
            key={f.at} transform={`translate(${fx},${fy})`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.01, delay }}
          >
            <motion.g
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ ...SETTLE, delay }}
              style={{ transformOrigin: '0px 0px' }}
            >
              <line x1={0} y1={0} x2={0} y2={-17} stroke="var(--text)" strokeWidth={1.2} />
              <path d="M0,-17 L9,-13.5 L0,-10 Z" fill="var(--text)" />
            </motion.g>
            <circle r={2.6} fill="#fff" stroke="var(--text)" strokeWidth={1.3} />
          </motion.g>
        )
      })}

      {selected !== undefined && (
        <g transform={`translate(${x(selected)},0)`}>
          <motion.line
            x1={0} y1={y(series[selected])} x2={0}
            stroke="var(--rule-soft)" strokeWidth={1}
            initial={{ y2: y(series[selected]) }} animate={{ y2: H - padB }}
            transition={{ ...FADE, delay: 1.0 }}
          />
          <motion.circle
            cy={y(series[selected])} r={4} fill="#fff" stroke="var(--text)" strokeWidth={1.8}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ ...SETTLE, delay: 0.95 }}
            style={{ transformOrigin: `0px ${y(series[selected])}px` }}
          />
        </g>
      )}

      {xLabels.length > 0 && (
        <g fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600" textAnchor="middle">
          {xLabels.map((l, i) => (
            <text key={l} x={(i / (xLabels.length - 1)) * (W - padR)} y={H - 6}>{l}</text>
          ))}
        </g>
      )}
    </svg>
  )
}

/* ── the run of screening ────────────────────────────────────
   One mark per payment read, four weeks of them. The product's
   claim is "every payment, before it moves", so the visual is
   literally every payment — read as texture, not as a series.

   The marks are laid out by DAY rather than by index, so busy
   days crowd and quiet ones leave gaps, and the height is the
   payment's size on a log curve: lots of small ones, a few big.
   An even spread with a modular height read as a pattern, which
   is the one thing a record of real spending never looks like. */

function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function ScreenRun({
  days = 28, perDay = 6, held = 0.93, watched = 0.68, height = 76, labels = [], seed = 7,
  caption = true,
}: {
  days?: number
  /** average payments on a weekday; weekends run lighter */
  perDay?: number
  /** where the held and watched payments fall, 0–1 through the period */
  held?: number
  watched?: number
  height?: number
  labels?: string[]
  seed?: number
  /** the tally beneath. Rendered here so the figure is always the number of
      marks actually drawn, rather than a constant that drifts from them. */
  caption?: boolean
}) {
  const W = 350, padB = labels.length ? 20 : 0
  const H = height - padB
  const r = mulberry(seed)

  type Mark = { x: number; h: number; kind: 'ok' | 'held' | 'watched' }
  const marks: Mark[] = []
  for (let d = 0; d < days; d++) {
    const weekend = d % 7 === 5 || d % 7 === 6
    // a quiet day happens; a burst happens too
    const n = Math.max(0, Math.round((weekend ? perDay * 0.42 : perDay) * (0.45 + r() * 1.3)))
    for (let k = 0; k < n; k++) {
      const x = ((d + (k + 0.5) / Math.max(n, 1)) / days) * W
      // most payments are small, a few are not
      const h = 6 + Math.pow(r(), 2.4) * (H - 10)
      marks.push({ x, h, kind: 'ok' })
    }
  }
  const put = (p: number, kind: Mark['kind']) => {
    const i = Math.min(marks.length - 1, Math.round(p * marks.length))
    if (marks[i]) marks[i] = { ...marks[i], h: H, kind }
  }
  put(watched, 'watched')
  put(held, 'held')

  const bw = Math.max(1.1, (W / marks.length) * 0.56)
  const total = marks.length
  const COL = { ok: 'var(--safe)', held: 'var(--danger)', watched: 'var(--warn)' }

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: 'block' }}>
        <g stroke="var(--hairline)" strokeWidth={1}>
          {[1, 2, 3].map((wk) => (
            <line key={wk} x1={((wk * 7) / days) * W} y1={0} x2={((wk * 7) / days) * W} y2={H} />
          ))}
        </g>
        {marks.map((m, i) => {
          const flag = m.kind !== 'ok'
          return (
            <rect
              key={i} x={m.x.toFixed(2)} y={(H - m.h).toFixed(2)}
              width={bw.toFixed(2)} height={m.h.toFixed(2)} rx={bw / 2}
              fill={COL[m.kind]} fillOpacity={flag ? 1 : 0.32}
              style={{
                transformBox: 'fill-box', transformOrigin: 'bottom',
                /* the run fills left to right, then the exceptions arrive last,
                   so the eye lands on them after the field is established */
                animation: `rise .5s cubic-bezier(.2,.9,.3,1) ${(flag ? 0.95 : (i / total) * 0.8).toFixed(2)}s both`,
              }}
            />
          )
        })}
        {labels.length > 0 && (
          <g fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="600" textAnchor="middle">
            {labels.map((l, i) => (
              <text key={l} x={(((i + 0.5) * 7) / days * W).toFixed(1)} y={height - 5}>{l}</text>
            ))}
          </g>
        )}
      </svg>
      {caption && (
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {([[String(total), 'read', 'var(--text-dim)'],
             ['1', 'held', 'var(--danger)'],
             ['1', 'watched', 'var(--warn)']] as const).map(([n, l, c]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span className="num" style={{ fontSize: 15, color: c }}>{n}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--text-dim)' }}>{l}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
