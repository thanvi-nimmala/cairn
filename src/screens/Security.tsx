import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { TrustBloom } from '../components/TrustBloom'
import { Card, SectionLabel, Switch } from '../components/ui'
import { AreaChart, HeroField, HeroMetric } from '../components/field'
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
    <div className="glass" style={{
      display: 'flex', alignItems: 'center', gap: 9, height: 34, padding: '0 12px',
      borderRadius: 'var(--r-pill)', overflow: 'hidden',
    }}>
      <span className="blink" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--safe)', flexShrink: 0 }} />
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}
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
    <HeroField>
      <div style={{ padding: '74px 0 120px' }}>
        {/* the figure is the screen, not a widget on it */}
        <div style={{ padding: '0 22px' }}>
          <HeroMetric
            label={`Trust · ${armed} of ${PROTECTIONS.length} set`}
            value={score}
            sub={score > 80 ? 'Protected · monitoring' : score > 50 ? 'Reduced cover' : 'Exposed'}
          />
        </div>

        {/* the stack reads the same number a second way */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 2px' }}>
          <TrustBloom score={score} size={112} agitation={agitation} set={armed} label={false} />
        </div>

        {/* four weeks, flagged where someone changed something */}
        <div style={{ marginTop: 10 }}>
          <AreaChart
            series={[34, 38, 36, 52, 46, 61, 58, 74, 69, 96, 88, 96]}
            flags={[{ at: 3 }, { at: 7 }]}
            selected={9}
            xLabels={['wk 1', 'wk 2', 'wk 3', 'wk 4']}
            height={176}
          />
        </div>

        <div style={{ padding: '0 22px', marginTop: 18 }}>
          <Console />
        </div>

        {/* review callout */}
        <div style={{ padding: '0 22px' }}>
        <motion.div
          className="press" onClick={onFraud}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
            borderRadius: 'var(--r-card)', margin: '16px 0 0', cursor: 'pointer',
            background: 'color-mix(in srgb, var(--danger) 12%, var(--surface))',
            border: '1px solid color-mix(in srgb, var(--danger) 38%, transparent)',
          }}
        >
          <span style={{
            width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', flexShrink: 0,
            background: 'color-mix(in srgb, var(--danger) 20%, transparent)', color: 'var(--danger)',
          }}>
            <Icon name="alert" size={18} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13.5 }}>1 item needs your review</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-dim)', marginTop: 2 }}>
              a held payment is waiting on you
            </div>
          </div>
          <Icon name="chevR" size={17} style={{ color: 'var(--danger)' }} />
        </motion.div>
        </div>

        <div style={{ padding: '0 22px' }}>
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
                    padding: '1px 5px', borderRadius: 4, background: 'var(--chip)',
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
              background: `color-mix(in srgb, ${TONE[m.tone]} 13%, transparent)`, color: TONE[m.tone],
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
        </div>
      </div>
    </HeroField>
  )
}
