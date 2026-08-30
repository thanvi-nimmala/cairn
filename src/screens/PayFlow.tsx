import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { FaceScan } from '../components/FaceScan'
import { AIBadge, Avatar, Button, Card, Rows, Sheet } from '../components/ui'
import { CONTACTS, fmtMoney } from '../lib/data'
import type { Contact } from '../lib/types'

type Step = 'who' | 'amount' | 'screen' | 'confirm' | 'done'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']

export function PayFlow({ onClose, onComplete, onMood, startAt, startAmount }: {
  onClose: () => void
  onComplete: () => void
  onMood: (m: 'calm' | 'scan' | 'success') => void
  /** enter the flow mid-way, used by the still-capture mode */
  startAt?: Step
  startAmount?: string
}) {
  const [step, setStep] = useState<Step>(startAt ?? 'who')
  const [to, setTo] = useState<Contact | null>(startAt && startAt !== 'who' ? CONTACTS[0] : null)
  const [amount, setAmount] = useState(startAmount ?? '0')
  const [checks, setChecks] = useState(0)
  const [scan, setScan] = useState<'idle' | 'scanning' | 'done'>('idle')

  const amt = parseFloat(amount || '0')

  const press = (k: string) =>
    setAmount((a) => {
      if (k === 'del') return a.length <= 1 ? '0' : a.slice(0, -1)
      if (k === '.') return a.includes('.') ? a : a + '.'
      if (a === '0') return k === '.' ? '0.' : k
      if (a.includes('.') && a.split('.')[1].length >= 2) return a
      return a + k
    })

  /* the screening beat drives the ambient field */
  useEffect(() => {
    if (step !== 'screen') return
    onMood('scan')
    setChecks(0)
    const ts = [1, 2, 3, 4].map((n, i) => window.setTimeout(() => setChecks(n), 480 + i * 520))
    const fin = window.setTimeout(() => { setStep('confirm'); onMood('calm') }, 480 + 4 * 520 + 480)
    return () => { ts.forEach(clearTimeout); clearTimeout(fin) }
  }, [step, onMood])

  const confirm = () => {
    if (scan !== 'idle') return
    setScan('scanning')
    setTimeout(() => setScan('done'), 1400)
    setTimeout(() => { setStep('done'); onMood('success') }, 2150)
  }

  const checkItems = [
    { label: 'Recipient verified', detail: to?.verified ? `Known ${to.known} · 14 clean payments` : 'New account — no history' },
    { label: 'Amount in normal range', detail: 'Matches your typical transfers' },
    { label: 'Device & location trusted', detail: 'This iPhone · Brooklyn, NY' },
    { label: 'Encrypted & tokenized', detail: 'Card number never leaves the vault' },
  ]

  /* ── who ──────────────────────────────────────────────── */
  if (step === 'who') {
    return (
      <Sheet onClose={onClose} title="Send money">
        <div style={{ padding: '4px 20px 24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px',
            borderRadius: 'var(--r-btn)', background: 'var(--surface)', border: '1px solid var(--line)', marginBottom: 18,
          }}>
            <Icon name="search" size={17} style={{ color: 'var(--text-faint)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--text-faint)' }}>
              Name, @handle, or phone
            </span>
          </div>
          <div className="mono-label" style={{ marginBottom: 4 }}>Recents</div>
          <Rows>
            {CONTACTS.map((c) => (
              <div key={c.id} className="press" data-demo={`contact-${c.id}`} onClick={() => { setTo(c); setStep('amount') }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', cursor: 'pointer' }}>
                <Avatar initials={c.initials} hue={c.hue} size={42} biz={c.biz} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15 }}>{c.name}</span>
                    {c.verified && <Icon name="check" size={12} stroke={3} style={{ color: 'var(--safe)' }} />}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginTop: 1 }}>
                    {c.handle} · known {c.known}
                  </div>
                </div>
                {!c.verified && <AIBadge risk="med" />}
                <Icon name="chevR" size={16} style={{ color: 'var(--text-faint)' }} />
              </div>
            ))}
          </Rows>
        </div>
      </Sheet>
    )
  }

  /* ── amount ───────────────────────────────────────────── */
  if (step === 'amount' && to) {
    return (
      <Sheet onClose={() => setStep('who')} back title="Enter amount">
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px',
            borderRadius: 'var(--r-card)', background: 'var(--surface)', border: '1px solid var(--line)',
          }}>
            <Avatar initials={to.initials} hue={to.hue} size={36} biz={to.biz} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>To {to.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{to.handle}</div>
            </div>
            <AIBadge risk={to.verified ? 'safe' : 'med'} />
          </div>

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 6, minHeight: 110,
          }}>
            <div className="num" style={{
              fontWeight: 700, fontSize: 56, letterSpacing: '-0.05em',
              color: amt > 0 ? 'var(--text)' : 'var(--text-faint)',
              display: 'flex', alignItems: 'baseline',
            }}>
              <span style={{ fontSize: 28, opacity: 0.5, marginRight: 3 }}>$</span>{amount}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
              from TruePay •••• 4827
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, marginBottom: 12 }}>
            {KEYS.map((k) => (
              <button key={k} className="press" data-demo={`key-${k}`} onClick={() => press(k)} style={{
                height: 56, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 12,
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 25, color: 'var(--text)',
                display: 'grid', placeItems: 'center',
              }}>
                {k === 'del' ? <Icon name="chevL" size={21} /> : k}
              </button>
            ))}
          </div>

          <div style={{ paddingBottom: 26 }}>
            <Button icon="sparkle" demo="pay-review" disabled={amt <= 0} onClick={() => setStep('screen')}>
              Screen &amp; send
            </Button>
          </div>
        </div>
      </Sheet>
    )
  }

  /* ── screening ────────────────────────────────────────── */
  if (step === 'screen' && to) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: 'absolute', inset: 0, zIndex: 200, background: 'var(--ink)',
          display: 'flex', flexDirection: 'column', padding: '0 26px',
        }}
      >
        <div style={{ paddingTop: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
          <div className="halo" style={{
            width: 80, height: 80, borderRadius: '50%', display: 'grid', placeItems: 'center',
            background: 'var(--accent-wash)', color: 'var(--accent)',
          }}>
            <Icon name="sparkle" size={38} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 23, margin: 0, letterSpacing: '-0.03em' }}>
              Reading the payment
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>
              {fmtMoney(amt)} → {to.name}
            </p>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 13 }}>
          {checkItems.map((c, i) => {
            const on = checks > i
            return (
              <motion.div key={c.label} animate={{ opacity: on ? 1 : 0.35 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center',
                  background: on ? 'color-mix(in oklch, var(--safe) 16%, transparent)' : 'var(--surface)',
                  border: `1px solid ${on ? 'color-mix(in oklch, var(--safe) 45%, transparent)' : 'var(--line)'}`,
                  color: 'var(--safe)', transition: 'all .35s',
                }}>
                  {on ? <Icon name="check" size={15} stroke={2.8} />
                      : <span className="spin" style={{ width: 11, height: 11, borderRadius: '50%', border: '1.8px solid var(--line)', borderTopColor: 'var(--accent)' }} />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>{c.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-faint)', marginTop: 1 }}>{c.detail}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div style={{ height: 70 }} />
      </motion.div>
    )
  }

  /* ── confirm ──────────────────────────────────────────── */
  if (step === 'confirm' && to) {
    return (
      <Sheet onClose={() => setStep('amount')} back title="Confirm">
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Card style={{ padding: 20, textAlign: 'center' }}>
            <span className="mono-label">Sending</span>
            <div className="num" style={{ fontWeight: 700, fontSize: 40, letterSpacing: '-0.045em', margin: '4px 0 8px' }}>
              {fmtMoney(amt)}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 11px 5px 5px',
              borderRadius: 'var(--r-pill)', background: 'var(--surface-2)',
            }}>
              <Avatar initials={to.initials} hue={to.hue} size={22} biz={to.biz} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{to.name}</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
              <AIBadge risk="safe" size="md" />
            </div>
          </Card>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            <FaceScan state={scan === 'idle' ? 'scanning' : scan} size={112} />
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-dim)', maxWidth: 240 }}>
              {scan === 'done' ? 'Approved' : scan === 'scanning' ? 'Verifying your face…' : 'Approve with Face ID to send'}
            </div>
          </div>

          <div style={{ paddingBottom: 26, minHeight: 80 }}>
            {scan === 'idle' && <Button icon="faceid" demo="pay-approve" onClick={confirm}>Approve with Face ID</Button>}
          </div>
        </div>
      </Sheet>
    )
  }

  /* ── done ─────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 200, background: 'var(--ink)',
        display: 'flex', flexDirection: 'column', padding: '0 26px',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          style={{
            width: 94, height: 94, borderRadius: '50%', display: 'grid', placeItems: 'center',
            background: 'color-mix(in oklch, var(--safe) 16%, transparent)',
            border: '1px solid color-mix(in oklch, var(--safe) 45%, transparent)',
            color: 'var(--safe)', boxShadow: '0 0 50px color-mix(in oklch, var(--safe) 30%, transparent)',
          }}
        >
          <Icon name="check" size={46} stroke={2.4} />
        </motion.div>
        <div>
          <h2 className="num" style={{ fontWeight: 700, fontSize: 29, margin: 0, letterSpacing: '-0.04em' }}>
            {fmtMoney(amt)} sent
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-dim)', marginTop: 8 }}>
            to {to?.name} · {to?.handle}
          </p>
        </div>
        <AIBadge risk="safe" size="md" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 40 }}>
        <Button demo="pay-done" onClick={onComplete}>Done</Button>
        <Button variant="ghost" icon="receipt" onClick={onComplete}>View receipt</Button>
      </div>
    </motion.div>
  )
}
