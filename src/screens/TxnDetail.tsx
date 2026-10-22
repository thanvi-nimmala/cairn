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
    ['Reference', `CN-${txn.id.toUpperCase()}-2041`],
  ]

  return (
    <Sheet onClose={onClose} title="Transaction">
      <div style={{ padding: '2px 22px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* the amount is the screen — the party rides underneath it */}
        <div style={{ marginBottom: 26 }}>
          <div className="mono-label" style={{ marginBottom: 8 }}>{inbound ? 'Received' : 'Sent'}</div>
          <div className="num" style={{
            fontSize: 62, lineHeight: 1, letterSpacing: '-0.05em',
            color: inbound ? 'var(--safe)' : 'var(--text)',
          }}>
            {fmtMoney(inbound ? txn.amount : -txn.amount, { sign: true })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <Avatar initials={txn.initials} hue={txn.hue} size={34} biz={txn.biz} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>{txn.party}</div>
              <div className="mono-label" style={{ marginTop: 2 }}>{txn.when}</div>
            </div>
          </div>
        </div>

        <Card tone={watched ? undefined : 'safe'} style={{
          padding: 13, marginBottom: 14, display: 'flex', gap: 11, alignItems: 'center',
          ...(watched ? {
            background: 'color-mix(in srgb, var(--warn) 10%, var(--surface))',
            borderColor: 'color-mix(in srgb, var(--warn) 32%, var(--line))',
          } : {}),
        }}>
          <span style={{
            width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', flexShrink: 0,
            background: `color-mix(in srgb, var(--${watched ? 'warn' : 'safe'}) 18%, transparent)`,
            color: `var(--${watched ? 'warn' : 'safe'})`,
          }}>
            <Icon name={watched ? 'eye' : 'shield'} size={19} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>
              {watched ? 'Recurring — kept under watch' : 'Verified by Keystone'}
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
