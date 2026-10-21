import { motion } from 'framer-motion'
import { SCENES, type SceneId } from './scenes'
import { CairnMark } from '../components/CairnMark'

const GROUPS = ['Onboarding', 'Core', 'Flows'] as const

export function SceneRail({ active, onPick }: { active: SceneId; onPick: (id: SceneId) => void }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column',
      padding: '30px 20px', gap: 22, overflowY: 'auto',
    }} className="scroll">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <CairnMark size={28} color="var(--stage-text)" />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
              Cairn
            </div>
            <div className="mono-label" style={{ fontSize: 9 }}>frontend shell</div>
          </div>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.55,
          color: 'var(--stage-faint)', margin: 0,
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
                  color: on ? 'var(--stage-text)' : 'var(--stage-dim)',
                }}>
                  {on && (
                    <motion.span layoutId="railPill" transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.72)', border: '1px solid var(--stage-soft)',
                      }} />
                  )}
                  <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                      background: on ? 'var(--accent)' : 'var(--stage-tile)',
                      boxShadow: on ? '0 0 8px var(--accent)' : undefined,
                    }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>
                        {s.label}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--stage-faint)', marginTop: 1 }}>
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
              background: 'rgba(255, 255, 255, 0.72)', border: '1px solid var(--stage-soft)', color: 'var(--stage-dim)',
              minWidth: 30, textAlign: 'center',
            }}>{k}</kbd>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stage-faint)' }}>{v}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
