import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { Guilloche } from '../components/Guilloche'
import { Button, Card, Sheet, Switch } from '../components/ui'
import { CARDS, fmtCompact } from '../lib/data'
import type { PayCard } from '../lib/types'

const KIND_LABEL: Record<PayCard['kind'], string> = {
  physical: 'Physical',
  virtual: 'Virtual · merchant-locked',
  business: 'Business',
}

function CardFace({ c, frozen, active, onClick }: { c: PayCard; frozen: boolean; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      data-demo={`card-${c.id}`}
      animate={{ scale: active ? 1 : 0.955, opacity: active ? 1 : 0.62 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      style={{
        position: 'relative', width: '100%', aspectRatio: '1.586', flexShrink: 0,
        borderRadius: 'calc(var(--r-card) - 2px)', overflow: 'hidden', cursor: 'pointer',
        border: '1px solid oklch(1 0 0 / .13)', padding: 18, textAlign: 'left',
        background: `linear-gradient(145deg, oklch(0.46 0.16 ${c.hue}), oklch(0.20 0.07 ${c.hue}) 62%, oklch(0.32 0.11 ${c.hue + 30}))`,
        boxShadow: active ? '0 18px 40px oklch(0 0 0 / .5)' : '0 6px 18px oklch(0 0 0 / .35)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
    >
      <Guilloche size={300} opacity={0.15} stroke="oklch(0.95 0.05 90)" />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, oklch(1 0 0 / .14), transparent 45%)' }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em', color: '#fff' }}>
            {c.label}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'oklch(1 0 0 / .6)', marginTop: 2, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {KIND_LABEL[c.kind]}
          </div>
        </div>
        <Icon name="shield" size={22} style={{ color: 'oklch(1 0 0 / .7)' }} />
      </div>

      {/* chip */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            width: 34, height: 26, borderRadius: 5, marginBottom: 10,
            background: 'linear-gradient(140deg, oklch(0.9 0.09 92), oklch(0.68 0.11 78))',
            boxShadow: 'inset 0 0 0 1px oklch(0 0 0 / .2)',
          }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#fff', letterSpacing: '.14em' }}>
            •••• {c.last4}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'oklch(1 0 0 / .5)', letterSpacing: '.08em' }}>EXP</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fff' }}>{c.expiry}</div>
        </div>
      </div>

      {frozen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            // frost, not erasure — the card must still read as itself
            background: 'linear-gradient(155deg, oklch(0.8 0.05 225 / .18), oklch(0.6 0.04 250 / .1))',
            backdropFilter: 'blur(2.5px) saturate(70%)',
            WebkitBackdropFilter: 'blur(2.5px) saturate(70%)',
            boxShadow: 'inset 0 0 60px oklch(0.85 0.05 225 / .22)',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px',
            borderRadius: 999, color: '#fff',
            background: 'oklch(0.2 0.03 250 / .62)',
            border: '1px solid oklch(1 0 0 / .22)',
            backdropFilter: 'blur(6px)',
          }}>
            <Icon name="snow" size={16} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase' }}>frozen</span>
          </div>
        </motion.div>
      )}
    </motion.button>
  )
}

export function Cards({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0)
  const [frozen, setFrozen] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CARDS.map((c) => [c.id, c.frozen])),
  )
  const active = CARDS[idx]
  const pct = Math.min(1, active.spent / active.limit)

  return (
    <Sheet onClose={onClose} title="Cards">
      <div style={{ padding: '4px 20px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {CARDS.map((c, i) => (
            <CardFace key={c.id} c={c} frozen={!!frozen[c.id]} active={i === idx} onClick={() => setIdx(i)} />
          ))}
        </div>

        <Card style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <span className="mono-label">This month</span>
              <div className="num" style={{ fontWeight: 700, fontSize: 22, marginTop: 2 }}>
                {fmtCompact(active.spent)}
                <span style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 500 }}> / {fmtCompact(active.limit)}</span>
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 9px', borderRadius: 'var(--r-pill)',
              background: 'var(--accent-wash)', color: 'var(--accent)',
            }}>
              {Math.round(pct * 100)}%
            </span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: 'var(--surface-3)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 22 }}
              style={{ height: '100%', borderRadius: 4, background: 'var(--spectrum)' }}
            />
          </div>
        </Card>

        <Card style={{ overflow: 'hidden' }}>
          {[
            { icon: 'snow', label: 'Freeze card', detail: 'Blocks every new charge instantly', toggle: true },
            { icon: 'globe', label: 'Online payments', detail: 'Allowed', toggle: false },
            { icon: 'pin', label: 'Location lock', detail: 'Brooklyn, NY', toggle: false },
          ].map((r, i) => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px',
              borderTop: i ? '1px solid var(--line-soft)' : 'none',
            }}>
              <span style={{
                width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0,
                background: 'var(--surface-2)', color: r.toggle && frozen[active.id] ? 'var(--accent-3)' : 'var(--text-dim)',
              }}>
                <Icon name={r.icon} size={17} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--text-dim)', marginTop: 1 }}>{r.detail}</div>
              </div>
              <Switch
                demo={r.toggle ? 'card-freeze' : undefined}
                on={r.toggle ? !!frozen[active.id] : true}
                onChange={(v) => r.toggle && setFrozen((s) => ({ ...s, [active.id]: v }))}
                locked={!r.toggle}
              />
            </div>
          ))}
        </Card>

        <Button variant="secondary" icon="plus">Create a virtual card</Button>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
          Virtual cards lock to one merchant. If the number leaks,<br />it is worthless anywhere else.
        </p>
      </div>
    </Sheet>
  )
}
