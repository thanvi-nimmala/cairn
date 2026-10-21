import { useState } from 'react'
import { motion } from 'framer-motion'
import { SNAP } from '../lib/motion'
import { ActivityRow } from '../components/ActivityRow'
import { Rows, Screen } from '../components/ui'
import { BigStat } from '../components/field'
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
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, margin: '0 0 3px', letterSpacing: '-0.04em' }}>
          Activity
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-dim)', margin: 0 }}>
          Every line here was read by the model first.
        </p>
      </div>

      {/* the week as three figures on the ground, not boxed */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 22 }}>
        <BigStat value={fmtCompact(inSum)} label="In · 7 days" size={30} tone="var(--safe)" />
        <BigStat value={fmtCompact(outSum)} label="Out · 7 days" size={30} />
        <BigStat value="1" unit="held" label="On you" size={30} tone="var(--danger)" align="right" />
      </div>

      {/* what the model did with them */}
      <div className="glass" style={{ padding: '12px 15px', borderRadius: 'var(--r-card)', marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.45 }}>
          Screened <b style={{ color: 'var(--text)' }}>7 transactions</b> · held{' '}
          <b style={{ color: 'var(--danger)' }}>1</b> · watching <b style={{ color: 'var(--warn)' }}>1</b> · cleared 5.
        </span>
      </div>

      {/* filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 6, overflowX: 'auto' }} className="scroll">
        {FILTERS.map((f) => {
          const on = filter === f.id
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`press ${on ? '' : 'glass'}`} style={{
              position: 'relative', border: on ? 'none' : undefined, background: on ? 'transparent' : undefined,
              borderRadius: 'var(--r-pill)', padding: '7px 13px', cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: on ? 'var(--surface)' : 'var(--text-dim)',
            }}>
              {on && (
                <motion.span layoutId="filterPill" transition={SNAP}
                  style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-pill)', background: 'var(--text)' }} />
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
