import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { ActivityRow } from '../components/ActivityRow'
import { BalanceCard } from '../components/BalanceCard'
import { TrustBloom } from '../components/TrustBloom'
import { Avatar, Card, Rows, Screen } from '../components/ui'
import { ACTIVITY, USER, fmtMoney } from '../lib/data'
import type { AiLevel } from '../lib/theme'
import type { Txn } from '../lib/types'

/** Every payment the model screened today, as one glanceable bar of verdicts. */
function ScreenedStrip() {
  // 26 slots of screening: mostly clean, one held, one still being watched
  const verdicts: ('safe' | 'med' | 'high')[] = Array.from({ length: 26 }, (_, i) =>
    i === 17 ? 'high' : i === 6 ? 'med' : 'safe',
  )
  const col = { safe: 'var(--safe)', med: 'var(--warn)', high: 'var(--danger)' }
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 22 }}>
      {verdicts.map((v, i) => {
        const flag = v !== 'safe'
        const h = flag ? 22 : 7 + ((i * 29) % 8)
        return (
          <motion.span
            key={i}
            initial={{ height: 3, opacity: 0 }}
            animate={{ height: h, opacity: 1 }}
            transition={{ delay: i * 0.016, type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              flex: 1, borderRadius: 2, background: col[v],
              opacity: flag ? 1 : 0.3,
              boxShadow: flag ? `0 0 9px ${col[v]}` : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

function TrustPill({ level, onClick }: { level: AiLevel; onClick: () => void }) {
  if (level === 'subtle') {
    return (
      <button className="press" onClick={onClick} style={pill}>
        <Icon name="shield" size={19} style={{ color: 'var(--accent)' }} />
      </button>
    )
  }
  return (
    <button className="press" onClick={onClick} style={{ ...pill, width: 'auto', padding: '0 12px 0 9px', gap: 7 }}>
      <span style={{ position: 'relative', display: 'flex' }}>
        <Icon name="shield" size={18} style={{ color: 'var(--accent)' }} />
        <span className="blink" style={{
          position: 'absolute', right: -2, top: -1, width: 5, height: 5,
          borderRadius: '50%', background: 'var(--safe)',
        }} />
      </span>
      <span className="num" style={{ fontWeight: 700, fontSize: 14.5 }}>{USER.score}</span>
    </button>
  )
}
const pill: React.CSSProperties = {
  height: 38, minWidth: 38, borderRadius: 'var(--r-pill)', border: '1px solid var(--line)',
  background: 'oklch(1 0 0 / .05)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)',
}

interface Props {
  aiLevel: AiLevel
  balanceHidden: boolean
  onToggleBalance: () => void
  onScore: () => void
  onPay: () => void
  onCards: () => void
  onTxn: (t: Txn) => void
  onFraud: () => void
}

export function Home({ aiLevel, balanceHidden, onToggleBalance, onScore, onPay, onCards, onTxn, onFraud }: Props) {
  const flagged = ACTIVITY.find((t) => t.kind === 'flagged')!
  const actions: [string, string, () => void][] = [
    ['send', 'Send', onPay],
    ['request', 'Request', onPay],
    ['scan', 'Scan', onPay],
    ['card', 'Cards', onCards],
  ]

  return (
    <Screen>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Avatar initials={USER.initials} hue={USER.hue} size={40} ring />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono-label">Good morning</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18.5, letterSpacing: '-0.02em', marginTop: 1 }}>
            {USER.name}
          </div>
        </div>
        <TrustPill level={aiLevel} onClick={onScore} />
      </div>

      {aiLevel === 'front' && (
        <Card tone="accent" style={{ padding: 13, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="sparkle" size={19} style={{ color: 'var(--accent)', marginTop: 1 }} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45 }}>
            <b>TruePay AI</b> — I held <b style={{ color: 'var(--danger)' }}>1 payment</b> and cleared{' '}
            <b style={{ color: 'var(--safe)' }}>5</b> for you this morning.
          </div>
        </Card>
      )}

      <BalanceCard hidden={balanceHidden} onToggle={onToggleBalance} />

      {/* quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 18 }}>
        {actions.map(([ic, label, fn]) => (
          <button key={label} className="press" onClick={fn} aria-label={label} data-demo={`qa-${label.toLowerCase()}`} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
          }}>
            <span className="sheen" style={{
              width: '100%', aspectRatio: '1', borderRadius: 'var(--r-tile)',
              background: 'oklch(1 0 0 / .045)', border: '1px solid var(--line)',
              display: 'grid', placeItems: 'center', color: 'var(--accent)',
            }}>
              <Icon name={ic} size={22} stroke={2} />
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* held payment */}
      <motion.div
        className="press" onClick={onFraud} data-demo="held-banner"
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
          borderRadius: 'var(--r-card)', marginBottom: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden',
          background: 'color-mix(in oklch, var(--danger) 13%, var(--surface))',
          border: '1px solid color-mix(in oklch, var(--danger) 40%, transparent)',
        }}
      >
        <span className="halo" style={{
          width: 36, height: 36, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center',
          background: 'color-mix(in oklch, var(--danger) 22%, transparent)', color: 'var(--danger)',
        }}>
          <Icon name="shield" size={20} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13.5 }}>
            {fmtMoney(flagged.amount)} held for your review
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)', marginTop: 2 }}>
            {flagged.party} · 5 signals · tap to decide
          </div>
        </div>
        <Icon name="chevR" size={17} style={{ color: 'var(--danger)' }} />
      </motion.div>

      {/* trust summary */}
      {aiLevel !== 'subtle' && (
        <Card onClick={onScore} style={{ padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <TrustBloom score={USER.score} size={62} label={false} animate={false} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
                Trust score {USER.score}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>
                5 of 6 protections armed
              </div>
            </div>
            <Icon name="chevR" size={17} style={{ color: 'var(--text-faint)' }} />
          </div>
          <div style={{ marginTop: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="mono-label">Screened today</span>
              <span className="mono-label" style={{ color: 'var(--text-dim)' }}>6 · 1 held</span>
            </div>
            <ScreenedStrip />
          </div>
        </Card>
      )}

      {/* activity */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, margin: 0, letterSpacing: '-0.02em' }}>
          Recent activity
        </h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>See all</span>
      </div>
      <Rows>
        {ACTIVITY.slice(0, 5).map((t) => (
          <ActivityRow key={t.id} t={t} onClick={() => (t.kind === 'flagged' ? onFraud() : onTxn(t))} />
        ))}
      </Rows>
    </Screen>
  )
}
