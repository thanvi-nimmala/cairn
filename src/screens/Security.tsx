import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { TrustBloom } from '../components/TrustBloom'
import { Card, Screen, SectionLabel, Switch } from '../components/ui'
import { CONSOLE_LINES, MONITORING, PROTECTIONS } from '../lib/data'

const TONE: Record<string, string> = { safe: 'var(--safe)', warn: 'var(--warn)', danger: 'var(--danger)' }

/** Rolling one-line readout of what the engine is doing right now. */
function Console() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % CONSOLE_LINES.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, height: 34, padding: '0 12px',
      borderRadius: 'var(--r-pill)', background: 'oklch(0 0 0 / .32)',
      border: '1px solid var(--line-soft)', overflow: 'hidden',
    }}>
      <span className="blink" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--safe)', flexShrink: 0 }} />
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}
      >
        {CONSOLE_LINES[i]}
      </motion.span>
    </div>
  )
}

export function Security({ onFraud }: { onFraud: () => void }) {
  const [prot, setProt] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PROTECTIONS.map((p) => [p.id, p.on])),
  )
  const score = useMemo(
    () => PROTECTIONS.reduce((s, p) => s + (prot[p.id] ? p.weight : 0), 0),
    [prot],
  )
  const armed = PROTECTIONS.filter((p) => prot[p.id]).length
  const agitation = 1 - score / 100

  return (
    <Screen>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, margin: '0 0 4px', letterSpacing: '-0.04em' }}>
        Security
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-dim)', margin: '0 0 20px' }}>
        Turn a protection off and watch the score answer.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <TrustBloom score={score} size={168} agitation={agitation} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 13px',
          borderRadius: 'var(--r-pill)',
          background: `color-mix(in oklch, ${score > 80 ? 'var(--safe)' : score > 50 ? 'var(--warn)' : 'var(--danger)'} 13%, transparent)`,
          border: `1px solid color-mix(in oklch, ${score > 80 ? 'var(--safe)' : score > 50 ? 'var(--warn)' : 'var(--danger)'} 34%, transparent)`,
        }}>
          <span className="blink" style={{
            width: 6, height: 6, borderRadius: '50%',
            background: score > 80 ? 'var(--safe)' : score > 50 ? 'var(--warn)' : 'var(--danger)',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
            color: score > 80 ? 'var(--safe)' : score > 50 ? 'var(--warn)' : 'var(--danger)',
          }}>
            {score > 80 ? 'protected · monitoring' : score > 50 ? 'reduced cover' : 'exposed'}
          </span>
        </div>
        <div style={{ width: '100%', marginTop: 4 }}><Console /></div>
      </div>

      {/* review callout */}
      <motion.div
        className="press" onClick={onFraud}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
          borderRadius: 'var(--r-card)', margin: '20px 0 0', cursor: 'pointer',
          background: 'color-mix(in oklch, var(--danger) 12%, var(--surface))',
          border: '1px solid color-mix(in oklch, var(--danger) 38%, transparent)',
        }}
      >
        <span style={{
          width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', flexShrink: 0,
          background: 'color-mix(in oklch, var(--danger) 20%, transparent)', color: 'var(--danger)',
        }}>
          <Icon name="alert" size={18} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13.5 }}>1 item needs your review</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)', marginTop: 2 }}>
            a held payment is waiting on you
          </div>
        </div>
        <Icon name="chevR" size={17} style={{ color: 'var(--danger)' }} />
      </motion.div>

      <SectionLabel right={<span className="mono-label" style={{ color: 'var(--text-dim)' }}>{armed}/{PROTECTIONS.length} armed</span>}>
        Protections
      </SectionLabel>
      <Card style={{ overflow: 'hidden' }}>
        {PROTECTIONS.map((p, i) => {
          const on = prot[p.id]
          return (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px',
              borderTop: i ? '1px solid var(--line-soft)' : 'none',
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: 11, display: 'grid', placeItems: 'center', flexShrink: 0,
                background: on ? 'var(--accent-wash)' : 'var(--surface-2)',
                color: on ? 'var(--accent)' : 'var(--text-faint)', transition: 'all .25s',
              }}>
                <Icon name={p.icon} size={19} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>{p.label}</span>
                  {p.locked && <Icon name="lock" size={11} style={{ color: 'var(--text-faint)' }} />}
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-faint)',
                    padding: '1px 5px', borderRadius: 4, background: 'oklch(1 0 0 / .05)',
                  }}>+{p.weight}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--text-dim)', marginTop: 1 }}>{p.detail}</div>
              </div>
              <Switch on={on} locked={p.locked} demo={`prot-${p.id}`} onChange={(v) => setProt((s) => ({ ...s, [p.id]: v }))} />
            </div>
          )
        })}
      </Card>

      <SectionLabel right={<span className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--safe)' }} />}>
        Live feed
      </SectionLabel>
      <Card style={{ padding: '2px 15px' }}>
        {MONITORING.map((m, i) => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 0',
            borderTop: i ? '1px solid var(--line-soft)' : 'none',
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center',
              background: `color-mix(in oklch, ${TONE[m.tone]} 13%, transparent)`, color: TONE[m.tone],
            }}>
              <Icon name={m.icon} size={16} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>{m.title}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--text-dim)', marginTop: 1 }}>{m.detail}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', flexShrink: 0, marginTop: 2 }}>{m.when}</span>
          </div>
        ))}
      </Card>
    </Screen>
  )
}
