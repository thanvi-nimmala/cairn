import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { POP } from '../lib/motion'
import { Icon } from '../components/Icon'
import { FaceScan } from '../components/FaceScan'
import { ScannerField } from '../components/ScannerField'
import { TrustBloom } from '../components/TrustBloom'
import { AIBadge, Avatar, Button, Rows, Sheet } from '../components/ui'
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
          <div className="glass" style={{
            display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 16px',
            borderRadius: 999, marginBottom: 20,
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
          <div className="glass" style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px',
            borderRadius: 'var(--r-card)',
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
              fontSize: 76, lineHeight: 1, letterSpacing: '-0.055em',
              color: amt > 0 ? 'var(--text)' : 'var(--text-faint)',
              display: 'flex', alignItems: 'baseline',
            }}>
              <span style={{ fontSize: 30, color: 'var(--text-faint)', marginRight: 4 }}>$</span>{amount}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
              from Keystone •••• 4827
            </span>
          </div>

          <div className="glass" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2,
            marginBottom: 12, padding: 6, borderRadius: 'var(--r-card)',
          }}>
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
        style={{ position: 'absolute', inset: 0, zIndex: 200 }}
      >
        <ScannerField label="Screening this payment" caption={`${fmtMoney(amt)} to ${to.name}`}>
          {/* the subject under the instrument */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 800,
            display: 'grid', placeItems: 'center', pointerEvents: 'none',
          }}>
            <TrustBloom score={0} set={checks} total={4} size={118} label={false} animate={false} dark />
          </div>

          <div style={{
            position: 'absolute', left: 26, right: 26, bottom: 96,
            display: 'flex', flexDirection: 'column', gap: 13,
          }}>
            {checkItems.map((c, i) => {
              const on = checks > i
              return (
                <motion.div
                  key={c.label}
                  animate={{ opacity: on ? 1 : 0.42 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                    background: on ? 'var(--scan)' : 'rgba(255,255,255,0.25)',
                    transition: 'background .35s',
                  }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontWeight: on ? 600 : 500, fontSize: 13.5,
                      color: on ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                    }}>{c.label}</div>
                  </div>
                  {on && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
                      letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--scan)',
                    }}>set</span>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 52, textAlign: 'center',
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.55)',
          }}>
            {checks} of {checkItems.length} stones set
          </div>
        </ScannerField>
      </motion.div>
    )
  }

  /* ── confirm ──────────────────────────────────────────── */
  if (step === 'confirm' && to) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ position: 'absolute', inset: 0, zIndex: 200 }}
      >
        <ScannerField
          spinning={scan !== 'done'}
          label={scan === 'done' ? 'Approved' : 'Approve to send'}
          caption={`${fmtMoney(amt)} · ${to.name} · ${checkItems.length} checks passed`}
        >
          <button
            className="press"
            onClick={() => setStep('amount')}
            aria-label="Back"
            style={{
              position: 'absolute', top: 78, right: 24, width: 34, height: 34,
              borderRadius: '50%', border: '1px solid rgba(255,255,255,0.28)',
              background: 'transparent', color: 'rgba(255,255,255,0.8)',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}
          >
            <Icon name="x" size={17} stroke={2.2} />
          </button>

          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 800,
            display: 'grid', placeItems: 'center', pointerEvents: 'none',
          }}>
            <FaceScan state={scan === 'idle' ? 'scanning' : scan} size={120} dark />
          </div>

          <div style={{
            position: 'absolute', left: 26, right: 26, bottom: 108, textAlign: 'center',
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.72)',
          }}>
            {scan === 'done' ? 'Approved' : scan === 'scanning' ? 'Hold steady' : 'Approve with Face ID to send'}
          </div>

          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 34 }}>
            <Button
              demo="pay-approve"
              disabled={scan !== 'idle'}
              onClick={confirm}
              style={{ background: '#fff', color: '#101410' }}
            >
              {scan === 'done' ? 'Approved' : scan === 'scanning' ? 'Verifying…' : 'Approve with Face ID'}
            </Button>
          </div>
        </ScannerField>
      </motion.div>
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
          transition={POP}
          style={{
            width: 94, height: 94, borderRadius: '50%', display: 'grid', placeItems: 'center',
            background: 'color-mix(in srgb, var(--safe) 16%, transparent)',
            border: '1px solid color-mix(in srgb, var(--safe) 45%, transparent)',
            color: 'var(--safe)', boxShadow: '0 0 50px color-mix(in srgb, var(--safe) 30%, transparent)',
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
