import { useState } from 'react'
import { motion } from 'framer-motion'
import { FADE, POP, enter, step } from '../lib/motion'
import { Icon } from '../components/Icon'
import { Avatar, Button, Card, Sheet } from '../components/ui'
import { ACTIVITY, fmtMoney } from '../lib/data'

const LEVEL_COLOR: Record<string, string> = {
  high: 'var(--danger)',
  med: 'var(--warn)',
  low: 'var(--text-faint)',
}

export function FraudReview({ onClose, onMood }: { onClose: () => void; onMood: (m: 'calm' | 'alert' | 'success') => void }) {
  const t = ACTIVITY.find((x) => x.kind === 'flagged')!
  const [resolved, setResolved] = useState<null | 'approved' | 'reported'>(null)
  const factors = t.factors ?? []
  const confidence = Math.round((factors.reduce((s, f) => s + f.weight, 0) / factors.length) * 100)

  if (resolved) {
    const ok = resolved === 'approved'
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: 'absolute', inset: 0, zIndex: 210, background: 'var(--ink)',
          display: 'flex', flexDirection: 'column', padding: '0 26px',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={POP}
            style={{
              width: 92, height: 92, borderRadius: '50%', display: 'grid', placeItems: 'center',
              background: `color-mix(in srgb, ${ok ? 'var(--safe)' : 'var(--accent-3)'} 16%, transparent)`,
              border: `1px solid color-mix(in srgb, ${ok ? 'var(--safe)' : 'var(--accent-3)'} 45%, transparent)`,
              color: ok ? 'var(--safe)' : 'var(--accent-3)',
            }}
          >
            <Icon name={ok ? 'check' : 'snow'} size={44} stroke={2.2} />
          </motion.div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 25, margin: 0, letterSpacing: '-0.035em' }}>
              {ok ? 'Released' : 'Card frozen'}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-dim)', marginTop: 10, maxWidth: 300, lineHeight: 1.5 }}>
              {ok
                ? 'Payment sent. The model has folded DNH*LUMOSTORE LTD into your trusted set — it won’t stop you there again.'
                : 'Your card is locked and a dispute is open. Unauthorized reports are reviewed within 24 hours, and you are not liable meanwhile.'}
            </p>
          </div>
        </div>
        <div style={{ paddingBottom: 40 }}>
          <Button demo="fraud-done" onClick={() => { onMood('calm'); onClose() }}>Done</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <Sheet onClose={() => { onMood('calm'); onClose() }} title="Security review">
      <div style={{ padding: '2px 22px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, margin: 0, letterSpacing: '-0.04em', lineHeight: 1.04 }}>
            Held
          </h2>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', lineHeight: 1.04, color: 'var(--text-faint)' }}>
            for review
          </div>
        </div>

        {/* the stop itself, before any analysis of it */}
        <Card
          tone="danger"
          style={{ padding: '16px 18px', marginBottom: 16 }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, color: 'var(--danger)' }}>
            Stopped before it left your account
          </div>
          <div className="num" style={{ fontSize: 38, lineHeight: 1.1, marginTop: 4, color: 'var(--text)' }}>
            {fmtMoney(t.amount)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8 }}>
            <Avatar initials={t.initials} hue={t.hue} size={26} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', letterSpacing: '.04em' }}>
              {t.party} · {t.when}
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Why it stopped</div>
          <span className="mono-label">strongest first</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 4 }}>
          {factors.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...FADE, delay: 0.1 + step(i, 0.05) }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                background: LEVEL_COLOR[f.level],
                boxShadow: f.level === 'high' ? `0 0 8px ${LEVEL_COLOR[f.level]}` : undefined,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5 }}>{f.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: LEVEL_COLOR[f.level] }}>
                    {Math.round(f.weight * 100)}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', marginTop: 1 }}>{f.detail}</div>
                <div style={{ height: 2.5, borderRadius: 2, background: 'var(--surface-2)', marginTop: 6, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${f.weight * 100}%` }}
                    transition={enter(0.2 + step(i, 0.05))}
                    style={{ height: '100%', background: LEVEL_COLOR[f.level], opacity: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Card style={{ padding: '13px 18px', margin: '14px 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Overall risk</div>
            <div className="mono-label" style={{ marginTop: 2 }}>{factors.length} of {factors.length} signals weighed</div>
          </div>
          <div className="num" style={{ fontSize: 34, lineHeight: 1, color: 'var(--danger)' }}>{confidence}%</div>
        </Card>

        {/* the decision must always be reachable, however long the signal list runs */}
        <div style={{
          position: 'sticky', bottom: 0, marginTop: 'auto',
          display: 'flex', flexDirection: 'column', gap: 9,
          padding: '14px 0 26px',
          background: 'linear-gradient(to top, var(--ink) 72%, transparent)',
        }}>
          <Button icon="check" demo="fraud-approve" onClick={() => setResolved('approved')}>Yes, this was me</Button>
          <Button variant="secondary" danger icon="snow" demo="fraud-report" onClick={() => setResolved('reported')}>
            Not me — freeze &amp; dispute
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
