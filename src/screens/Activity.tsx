import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { ActivityRow } from '../components/ActivityRow'
import { Card, Rows, Screen } from '../components/ui'
import { ACTIVITY, fmtCompact } from '../lib/data'
import type { Txn } from '../lib/types'

type Filter = 'all' | 'flagged' | 'in' | 'out'
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'flagged', label: 'Needs review' },
  { id: 'in', label: 'In' },
  { id: 'out', label: 'Out' },
]

export function Activity({ onTxn, onFraud }: { onTxn: (t: Txn) => void; onFraud: () => void }) {
  const [filter, setFilter] = useState<Filter>('all')

  const list = ACTIVITY.filter((t) =>
    filter === 'all' ? true : filter === 'flagged' ? t.kind === 'flagged' || t.risk === 'med' : t.kind === filter,
  )
  const groups: [string, Txn[]][] = [
    ['Today', list.filter((t) => t.when.startsWith('Today'))],
    ['Earlier', list.filter((t) => !t.when.startsWith('Today'))],
  ]
  const inSum = ACTIVITY.filter((t) => t.kind === 'in').reduce((s, t) => s + t.amount, 0)
  const outSum = ACTIVITY.filter((t) => t.kind !== 'in').reduce((s, t) => s + t.amount, 0)

  return (
    <Screen>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, margin: '0 0 4px', letterSpacing: '-0.04em' }}>
        Activity
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-dim)', margin: '0 0 18px' }}>
        Every line here was read by the model first.
      </p>

      {/* flow summary */}
      <Card style={{ padding: 15, marginBottom: 14, display: 'flex', gap: 14 }}>
        {([['In', inSum, 'var(--safe)', 'arrowDL'], ['Out', outSum, 'var(--text)', 'arrowUR']] as const).map(([label, v, c, ic]) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name={ic} size={13} style={{ color: c }} stroke={2.4} />
              <span className="mono-label">{label} · 7 days</span>
            </div>
            <div className="num" style={{ fontWeight: 700, fontSize: 22, color: c, marginTop: 3 }}>{fmtCompact(v)}</div>
          </div>
        ))}
        <div style={{ width: 1, background: 'var(--line)' }} />
        <div style={{ flex: 0.85 }}>
          <span className="mono-label">Held</span>
          <div className="num" style={{ fontWeight: 700, fontSize: 22, color: 'var(--danger)', marginTop: 3 }}>1</div>
        </div>
      </Card>

      {/* AI summary */}
      <Card tone="accent" style={{ padding: 13, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="sparkle" size={18} style={{ color: 'var(--accent)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.4 }}>
          Screened <b style={{ color: 'var(--text)' }}>7 transactions</b> · held{' '}
          <b style={{ color: 'var(--danger)' }}>1</b> · watching <b style={{ color: 'var(--warn)' }}>1</b> · cleared 5.
        </span>
      </Card>

      {/* filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 6, overflowX: 'auto' }} className="scroll">
        {FILTERS.map((f) => {
          const on = filter === f.id
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} className="press" style={{
              position: 'relative', border: '1px solid var(--line)', background: 'transparent',
              borderRadius: 'var(--r-pill)', padding: '7px 13px', cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.03em',
              color: on ? 'var(--on-accent)' : 'var(--text-dim)',
            }}>
              {on && (
                <motion.span layoutId="filterPill" transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                  style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-pill)', background: 'var(--spectrum)' }} />
              )}
              <span style={{ position: 'relative' }}>{f.label}</span>
            </button>
          )
        })}
      </div>

      {groups.map(([label, items]) => items.length > 0 && (
        <div key={label} style={{ marginBottom: 6 }}>
          <div className="mono-label" style={{ margin: '14px 0 2px' }}>{label}</div>
          <Rows>
            {items.map((t) => (
              <ActivityRow key={t.id} t={t} onClick={() => (t.kind === 'flagged' ? onFraud() : onTxn(t))} />
            ))}
          </Rows>
        </div>
      ))}

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          Nothing here — that’s the good outcome.
        </div>
      )}
    </Screen>
  )
}
