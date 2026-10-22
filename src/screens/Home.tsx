import { Icon } from '../components/Icon'
import { KeystoneMark } from '../components/KeystoneMark'
import { TrustBloom } from '../components/TrustBloom'
import { Avatar } from '../components/ui'
import { BigStat, Field, FieldAction, ScreenRun } from '../components/field'
import { ACTIVITY, USER, fmtMoney } from '../lib/data'
import type { AiLevel } from '../lib/theme'
import type { Txn } from '../lib/types'

/** A ledger line with no card around it — a hairline is enough. */
function Line({ t, onClick }: { t: Txn; onClick: () => void }) {
  const tone = t.risk === 'high' ? 'var(--danger)' : t.risk === 'med' ? 'var(--warn)' : 'var(--text)'
  return (
    <button
      className="press" onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '13px 0', background: 'none', border: 'none',
        borderTop: '1px solid var(--hairline)', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <Avatar initials={t.initials} hue={t.hue} size={34} biz={t.biz} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {t.party}
        </div>
        <div className="mono-label" style={{ marginTop: 2 }}>{t.when.replace('Today · ', '').replace('Yesterday · ', 'yest ')}</div>
      </div>
      <div className="num" style={{ fontSize: 16, color: tone }}>
        {t.kind === 'in' ? '+' : '−'}{fmtMoney(t.amount).replace('$', '$')}
      </div>
    </button>
  )
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
  const [whole, cents] = fmtMoney(USER.balance).replace('$', '').split('.')

  return (
    <Field>
      <div style={{ padding: '56px 22px 120px' }}>
        {/* ── identity ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 30 }}>
          <KeystoneMark size={22} color="var(--text)" />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>
            Keystone
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-faint)' }}>Today</div>
          <button
            className="press" onClick={onToggleBalance} aria-label="Hide balance"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
          >
            <Icon name="eye" size={19} />
          </button>
        </div>

        {/* ── the pair of figures that matter ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 26 }}>
          <BigStat
            value={balanceHidden ? '••••' : whole}
            unit={balanceHidden ? undefined : `.${cents}`}
            label="Total balance"
          />
          <BigStat value={balanceHidden ? '••••' : '2,700'} unit=".68" label="Available today" align="right" />
        </div>

        {/* ── actions as text, not tiles ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30,
          paddingBottom: 18, borderBottom: '1px solid var(--hairline)',
        }}>
          {([['Send', onPay], ['Request', onPay], ['Cards', onCards]] as [string, () => void][]).map(([l, fn]) => (
            <button
              key={l} className="press" onClick={fn}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--text)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {l}
              <Icon name="chevR" size={13} style={{ color: 'var(--text-faint)' }} />
            </button>
          ))}
        </div>

        {/* ── four weeks of screening, one mark per payment ──
            This replaced a line chart of weekly totals. The totals plotted
            how much the account spent, which is the user's own behaviour and
            carries no decision; the exceptions are what the product is for,
            so they are the only marks with colour in them. ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              Payments screened
            </div>
            <span className="mono-label">4 weeks</span>
          </div>
          <ScreenRun
            held={0.94}
            watched={0.66}
            labels={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
          />
        </div>

        {/* ── the one thing waiting on a human ── */}
        <FieldAction
          demo="home-held"
          onClick={onFraud}
          onIcon={onScore}
          icon={<Icon name="shield" size={21} />}
        >
          Review {fmtMoney(flagged.amount)} held
        </FieldAction>

        {/* ── the stack, as a quiet aside rather than a headline ── */}
        {aiLevel !== 'subtle' && (
          <button
            className="press" onClick={onScore}
            style={{
              display: 'flex', alignItems: 'center', gap: 16, width: '100%', marginTop: 34,
              padding: '18px 0 0', background: 'none', border: 'none',
              borderTop: '1px solid var(--hairline)', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <TrustBloom score={USER.score} size={76} label={false} animate={false} set={5} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Trust</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>
                Five of six set
              </div>
            </div>
            <div className="num" style={{ fontSize: 40, color: 'var(--text)' }}>{USER.score}</div>
            <Icon name="chevR" size={17} style={{ color: 'var(--text-faint)' }} />
          </button>
        )}

        {/* ── recent lines ── */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Recent</div>
            <span className="mono-label">all screened</span>
          </div>
          {ACTIVITY.slice(0, 4).map((t) => <Line key={t.id} t={t} onClick={() => onTxn(t)} />)}
        </div>
      </div>
    </Field>
  )
}
