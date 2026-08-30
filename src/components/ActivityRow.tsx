import { Icon } from './Icon'
import { Avatar, AIBadge } from './ui'
import { fmtMoney } from '../lib/data'
import type { Txn } from '../lib/types'

export function ActivityRow({ t, onClick, showBadge = true }: { t: Txn; onClick?: () => void; showBadge?: boolean }) {
  const inbound = t.kind === 'in'
  const flagged = t.kind === 'flagged'
  return (
    <div
      className="press"
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', cursor: 'pointer' }}
    >
      <div style={{ position: 'relative' }}>
        <Avatar initials={t.initials} hue={t.hue} size={42} biz={t.biz} />
        {flagged && (
          <span style={{
            position: 'absolute', right: -3, bottom: -3, width: 18, height: 18, borderRadius: '50%',
            background: 'var(--danger)', border: '2px solid var(--ink)', display: 'grid', placeItems: 'center',
          }}>
            <Icon name="alert" size={10} stroke={2.8} style={{ color: '#fff' }} />
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{t.party}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-faint)', marginTop: 2 }}>
          {t.when.replace('Today · ', '').replace('Yesterday · ', 'yest ')} · {t.cat.toLowerCase()}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="num" style={{
          fontWeight: 600, fontSize: 15.5,
          color: inbound ? 'var(--safe)' : flagged ? 'var(--danger)' : 'var(--text)',
        }}>
          {fmtMoney(inbound ? t.amount : -t.amount, { sign: true })}
        </div>
        {showBadge && <div style={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end' }}><AIBadge risk={t.risk} /></div>}
      </div>
    </div>
  )
}
