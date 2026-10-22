import { motion } from 'framer-motion'
import { enter } from '../lib/motion'
import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { FaceScan } from '../components/FaceScan'
import { KeystoneMark } from '../components/KeystoneMark'
import { TrustBloom } from '../components/TrustBloom'
import { Button, Screen } from '../components/ui'

/* ── 1. welcome ──────────────────────────────────────────────── */
export function Welcome({ onNext }: { onNext: () => void }) {
  const chips: [string, string][] = [
    ['sparkle', 'AI fraud engine'],
    ['lock', 'Tokenized end-to-end'],
    ['faceid', 'Biometric approval'],
  ]
  return (
    <Screen pad={false} style={{ display: 'flex', flexDirection: 'column', padding: '0 28px' }}>
      {/* the ground alone leaves this screen flat, because the copy sits in the
          darkest band of the gradient. A local source lights the promise. */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(78% 42% at 24% 30%, var(--hero-glow), transparent 72%),' +
            'radial-gradient(60% 34% at 88% 64%, var(--field-bloom), transparent 76%)',
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, paddingTop: 60, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={enter(0.05)}
          style={{ display: 'flex', alignItems: 'center', gap: 11 }}
        >
          <KeystoneMark size={40} color="var(--text)" gap="var(--ink)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, letterSpacing: '-0.02em' }}>
            Keystone
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={enter(0.14)}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 42, lineHeight: 1.02,
            letterSpacing: '-0.045em', margin: 0, textWrap: 'balance',
          }}
        >
          Money that{' '}
          <span style={{
            fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontWeight: 400,
            fontSize: 46, letterSpacing: '-0.01em',
            color: 'var(--accent)',
          }}>
            watches
          </span>{' '}
          its own back.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={enter(0.22)}
          style={{
            fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.52,
            color: 'color-mix(in srgb, var(--text) 82%, transparent)', margin: 0, maxWidth: 300,
          }}
        >
          A security model reads every payment the moment you make it — and shows you
          exactly what it saw. No black box, no waiting on hold.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={enter(0.3)}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}
        >
          {chips.map(([ic, t]) => (
            <span key={t} className="glass-strong" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px',
              borderRadius: 'var(--r-pill)', color: 'var(--text)',
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
            }}>
              <Icon name={ic} size={13} style={{ color: 'var(--accent)' }} />{t}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={enter(0.38)}
        style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 42 }}
      >
        <Button icon="arrowUR" demo="welcome-cta" onClick={onNext}>Create a secure account</Button>
        <Button variant="ghost" onClick={onNext}>I already have one</Button>
      </motion.div>
    </Screen>
  )
}

/* ── 2. calibration ──────────────────────────────────────────── */
const CALIB = [
  'Reading device fingerprint',
  'Sealing keys in the enclave',
  'Learning your spending rhythm',
  'Arming the fraud model',
]

export function Calibrate({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const ts = CALIB.map((_, i) => window.setTimeout(() => setStep(i + 1), 420 + i * 520))
    const fin = window.setTimeout(onDone, 420 + CALIB.length * 520 + 700)
    return () => { ts.forEach(clearTimeout); clearTimeout(fin) }
  }, [onDone])

  return (
    <Screen pad={false} style={{ display: 'flex', flexDirection: 'column', padding: '0 28px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
        <TrustBloom score={Math.round((step / CALIB.length) * 96)} size={168} label={false} animate={false} agitation={step < CALIB.length ? 0.5 : 0} />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 25, margin: 0, letterSpacing: '-0.03em' }}>
            Setting your stones
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginTop: 8, letterSpacing: '.04em', whiteSpace: 'nowrap' }}>
            one-time setup · nothing leaves this device
          </p>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {CALIB.map((c, i) => {
            const on = step > i
            return (
              <div key={c} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: on ? 1 : 0.35, transition: 'opacity .4s',
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                  background: on ? 'color-mix(in srgb, var(--safe) 18%, transparent)' : 'transparent',
                  border: `1px solid ${on ? 'color-mix(in srgb, var(--safe) 45%, transparent)' : 'var(--line)'}`,
                  color: 'var(--safe)', transition: 'all .4s',
                }}>
                  {on ? <Icon name="check" size={12} stroke={3} /> :
                    <span className="spin" style={{ width: 10, height: 10, borderRadius: '50%', border: '1.6px solid var(--line)', borderTopColor: 'var(--accent)' }} />}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text)' }}>{c}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ height: 60 }} />
    </Screen>
  )
}

/* ── 3. biometric ────────────────────────────────────────────── */
export function Biometric({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<'idle' | 'scanning' | 'done'>('idle')

  const run = () => {
    if (state !== 'idle') return
    setState('scanning')
    setTimeout(() => setState('done'), 1500)
    setTimeout(onDone, 2400)
  }

  const copy =
    state === 'done' ? 'Biometric approval is now required for every payment and every sensitive change.'
    : state === 'scanning' ? 'Hold steady — confirming it’s really you.'
    : 'Your face becomes the key. Payments can only be approved by you, on this device.'

  return (
    <Screen pad={false} style={{ display: 'flex', flexDirection: 'column', padding: '0 28px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, textAlign: 'center' }}>
        <FaceScan state={state === 'idle' ? 'scanning' : state} size={136} />
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 27, margin: 0, letterSpacing: '-0.035em' }}>
            {state === 'done' ? 'You’re protected' : 'Set up Face ID'}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.5, color: 'var(--text-dim)', marginTop: 12, maxWidth: 290 }}>
            {copy}
          </p>
        </div>
      </div>
      <div style={{ paddingBottom: 42, minHeight: 96 }}>
        {state === 'idle' && (
          <>
            <Button icon="faceid" demo="faceid-enable" onClick={run}>Enable Face ID</Button>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button onClick={onDone} style={{
                background: 'none', border: 'none', color: 'var(--text-faint)',
                fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', padding: 8,
              }}>Set up later</button>
            </div>
          </>
        )}
      </div>
    </Screen>
  )
}
