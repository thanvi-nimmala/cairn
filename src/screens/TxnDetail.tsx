import { Icon } from '../components/Icon'
import { Avatar, Button, Card, Sheet } from '../components/ui'
import { fmtMoney } from '../lib/data'
import type { Txn } from '../lib/types'

export function TxnDetail({ txn, onClose, onFraud }: { txn: Txn; onClose: () => void; onFraud: () => void }) {
  const inbound = txn.kind === 'in'
  const watched = txn.risk === 'med'
  const meta: [string, string][] = [
    ['Status', inbound ? 'Received' : 'Completed'],
    ['Date', txn.when],
    ['Category', txn.cat],
    ['Payment method', txn.method],
    ['Note', txn.note || '—'],
    ['Reference', `TP-${txn.id.toUpperCase()}-2041`],
  ]

  return (
    <Sheet onClose={onClose} title="Transaction">
      <div style={{ padding: '2px 22px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, marginBottom: 18 }}>
          <Avatar initials={txn.initials} hue={txn.hue} size={60} biz={txn.biz} />
          <div>
            <div className="num" style={{
              fontWeight: 700, fontSize: 34, letterSpacing: '-0.045em',
              color: inbound ? 'var(--safe)' : 'var(--text)',
            }}>
              {fmtMoney(inbound ? txn.amount : -txn.amount, { sign: true })}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-dim)', marginTop: 3 }}>
              {inbound ? 'from' : 'to'} {txn.party}
            </div>
          </div>
        </div>

        <Card tone={watched ? undefined : 'safe'} style={{
          padding: 13, marginBottom: 14, display: 'flex', gap: 11, alignItems: 'center',
          ...(watched ? {
            background: 'color-mix(in oklch, var(--warn) 10%, var(--surface))',
            borderColor: 'color-mix(in oklch, var(--warn) 32%, var(--line))',
          } : {}),
        }}>
          <span style={{
            width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', flexShrink: 0,
            background: `color-mix(in oklch, var(--${watched ? 'warn' : 'safe'}) 18%, transparent)`,
            color: `var(--${watched ? 'warn' : 'safe'})`,
          }}>
            <Icon name={watched ? 'eye' : 'shield'} size={19} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>
              {watched ? 'Recurring — kept under watch' : 'Verified by TruePay AI'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)', marginTop: 1 }}>
              {watched ? 'renews monthly · cancel anytime' : 'encrypted · tokenized · biometric-approved'}
            </div>
          </div>
        </Card>

        <Card style={{ overflow: 'hidden', marginBottom: 18 }}>
          {meta.map(([k, v], i) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              padding: '12px 15px', borderTop: i ? '1px solid var(--line-soft)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{k}</span>
              <span style={{
                fontFamily: k === 'Payment method' || k === 'Reference' ? 'var(--font-mono)' : 'var(--font-body)',
                fontSize: 12.5, fontWeight: 600, textAlign: 'right',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{v}</span>
            </div>
          ))}
        </Card>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="secondary" icon="receipt">Share receipt</Button>
          <Button variant="ghost" danger icon="alert" onClick={onFraud}>Report this charge</Button>
        </div>
      </div>
    </Sheet>
  )
}
