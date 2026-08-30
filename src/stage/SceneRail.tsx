import { motion } from 'framer-motion'
import { SCENES, type SceneId } from './scenes'
import { Icon } from '../components/Icon'

const GROUPS = ['Onboarding', 'Core', 'Flows'] as const

export function SceneRail({ active, onPick }: { active: SceneId; onPick: (id: SceneId) => void }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column',
      padding: '30px 20px', gap: 22, overflowY: 'auto',
    }} className="scroll">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 10, background: 'var(--spectrum)',
            display: 'grid', placeItems: 'center', boxShadow: '0 6px 18px var(--accent-glow)',
          }}>
            <Icon name="shield" size={17} stroke={2.3} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
              TruePay
            </div>
            <div className="mono-label" style={{ fontSize: 9 }}>frontend shell</div>
          </div>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.55,
          color: 'var(--text-faint)', margin: 0,
        }}>
          A payments app whose security model is the interface, not a setting buried three levels down.
        </p>
      </div>

      {GROUPS.map((g) => (
        <div key={g}>
          <div className="mono-label" style={{ marginBottom: 7 }}>{g}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SCENES.filter((s) => s.group === g).map((s) => {
              const on = active === s.id
              return (
                <button key={s.id} onClick={() => onPick(s.id)} aria-label={s.label} aria-current={on} style={{
                  position: 'relative', textAlign: 'left', border: 'none', background: 'none',
                  cursor: 'pointer', padding: '7px 10px', borderRadius: 10,
                  color: on ? 'var(--text)' : 'var(--text-dim)',
                }}>
                  {on && (
                    <motion.span layoutId="railPill" transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 10,
                        background: 'oklch(1 0 0 / .06)', border: '1px solid var(--line-soft)',
                      }} />
                  )}
                  <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                      background: on ? 'var(--accent)' : 'var(--surface-3)',
                      boxShadow: on ? '0 0 8px var(--accent)' : undefined,
                    }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>
                        {s.label}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-faint)', marginTop: 1 }}>
                        {s.note}
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div className="mono-label" style={{ marginBottom: 6 }}>Keys</div>
        {[['← →', 'step scenes'], ['R', 'replay onboarding'], ['F', 'trigger fraud hold']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <kbd style={{
              fontFamily: 'var(--font-mono)', fontSize: 9.5, padding: '2px 6px', borderRadius: 5,
              background: 'oklch(1 0 0 / .06)', border: '1px solid var(--line-soft)', color: 'var(--text-dim)',
              minWidth: 30, textAlign: 'center',
            }}>{k}</kbd>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>{v}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
