import { motion } from 'framer-motion'
import { SNAP } from '../lib/motion'
import { Icon } from '../components/Icon'
import { Avatar, Card, Screen, SectionLabel } from '../components/ui'
import { BigStat } from '../components/field'
import { BUSINESS, USER } from '../lib/data'

type Mode = 'personal' | 'business'

const GROUPS: { header: string; rows: { icon: string; label: string; detail?: string }[] }[] = [
  { header: 'Account', rows: [
    { icon: 'user', label: 'Personal information', detail: USER.handle },
    { icon: 'card', label: 'Payment methods', detail: '3 cards' },
    { icon: 'building', label: 'Business account', detail: BUSINESS.name },
  ]},
  { header: 'Security & privacy', rows: [
    { icon: 'faceid', label: 'Face ID & passcode', detail: 'On' },
    { icon: 'bell', label: 'Alerts & notifications', detail: 'All' },
    { icon: 'globe', label: 'Privacy controls' },
    { icon: 'layers', label: 'Connected apps', detail: '2' },
  ]},
  { header: 'Support', rows: [
    { icon: 'shield', label: 'Report a problem' },
    { icon: 'settings', label: 'Help center' },
  ]},
]

export function Profile({ mode, onMode }: { mode: Mode; onMode: (m: Mode) => void }) {
  return (
    <Screen>
      {/* the person, stated plainly on the ground */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 24 }}>
        <Avatar initials={USER.initials} hue={USER.hue} size={62} ring />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.035em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{USER.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span className="mono-label">{USER.handle}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--safe)',
              fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 600,
              letterSpacing: '.1em', textTransform: 'uppercase',
            }}>
              <Icon name="check" size={10} stroke={3} />verified
            </span>
          </div>
        </div>
      </div>

      {/* how long the model has been watching, as a figure */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 24,
        paddingBottom: 22, borderBottom: '1px solid var(--hairline)',
      }}>
        <BigStat value="96" label="Trust score" size={34} />
        <BigStat value="214" label="Payments screened" size={34} />
        <BigStat value="3" unit="yrs" label="Known here" size={34} align="right" />
      </div>

      {/* personal / business */}
      <div className="glass" style={{ padding: 5, marginBottom: 8, display: 'flex', gap: 4, borderRadius: 'var(--r-card)' }}>
        {([['personal', 'Personal', 'user'], ['business', 'Business', 'building']] as const).map(([m, label, ic]) => {
          const on = mode === m
          return (
            <button key={m} onClick={() => onMode(m)} className="press" style={{
              position: 'relative', flex: 1, height: 42, borderRadius: 'calc(var(--r-card) - 6px)',
              border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
              color: on ? 'var(--surface)' : 'var(--text-dim)', transition: 'color .2s',
            }}>
              {on && (
                <motion.span layoutId="modePill" transition={SNAP}
                  style={{ position: 'absolute', inset: 0, borderRadius: 'calc(var(--r-card) - 6px)', background: 'var(--text)' }} />
              )}
              <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Icon name={ic} size={16} />{label}
              </span>
            </button>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-faint)', margin: '0 0 4px', textAlign: 'center' }}>
        {mode === 'personal' ? 'personal ledger · face id on every send' : `${BUSINESS.name.toLowerCase()} · dual approval over $1,000`}
      </p>

      {GROUPS.map((g) => (
        <div key={g.header}>
          <SectionLabel>{g.header}</SectionLabel>
          <Card style={{ overflow: 'hidden' }}>
            {g.rows.map((r, i) => (
              <div key={r.label} className="press" style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', cursor: 'pointer',
                borderTop: i ? '1px solid var(--line-soft)' : 'none',
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0,
                  background: 'var(--surface-2)', color: 'var(--text-dim)',
                }}>
                  <Icon name={r.icon} size={17} />
                </span>
                <span style={{
                  flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{r.label}</span>
                {r.detail && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{r.detail}</span>
                )}
                <Icon name="chevR" size={15} style={{ color: 'var(--text-faint)' }} />
              </div>
            ))}
          </Card>
        </div>
      ))}

      <button className="press" style={{
        width: '100%', height: 50, marginTop: 22, borderRadius: 'var(--r-btn)',
        border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--danger)',
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <Icon name="logout" size={17} />Sign out
      </button>
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', marginTop: 14 }}>
        Keystone 2.4.0 · model v42 · prototype
      </p>
    </Screen>
  )
}
