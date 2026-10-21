import { motion } from 'framer-motion'
import { ACCENTS, FONT_PAIRS, ROUNDNESS, type AiLevel, type FontKey, type RoundKey, type Theme } from '../lib/theme'
import { Icon } from '../components/Icon'

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono-label" style={{ marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}

function Segmented<T extends string>({ value, options, onChange, id }: {
  value: T; options: readonly T[]; onChange: (v: T) => void; id: string
}) {
  return (
    <div style={{
      display: 'flex', gap: 2, padding: 3, borderRadius: 11,
      background: 'rgba(26, 29, 26, 0.055)', border: '1px solid var(--stage-soft)',
    }}>
      {options.map((o) => {
        const on = value === o
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            position: 'relative', flex: 1, border: 'none', background: 'none', cursor: 'pointer',
            padding: '6px 4px', borderRadius: 8,
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.02em',
            color: on ? 'var(--stage-text)' : 'var(--stage-faint)', transition: 'color .2s',
          }}>
            {on && (
              <motion.span layoutId={`seg-${id}`} transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                style={{ position: 'absolute', inset: 0, borderRadius: 8, background: '#FFFFFF', boxShadow: '0 1px 3px rgba(26,29,26,.12)' }} />
            )}
            <span style={{ position: 'relative' }}>{o}</span>
          </button>
        )
      })}
    </div>
  )
}

interface Props {
  theme: Theme
  set: <K extends keyof Theme>(k: K, v: Theme[K]) => void
  onReplay: () => void
  onFraud: () => void
}

export function TokensPanel({ theme, set, onReplay, onFraud }: Props) {
  const rd = ROUNDNESS[theme.roundness]
  const fp = FONT_PAIRS[theme.fonts]

  return (
    <aside className="scroll" style={{
      width: 250, flexShrink: 0, height: '100%',
      padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: 22,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>
          Design controls
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, lineHeight: 1.5, color: 'var(--stage-faint)', margin: '5px 0 0' }}>
          Every choice here writes a CSS custom property. Nothing is hard-coded downstream.
        </p>
      </div>

      <Group label="Accent">
        <div style={{ display: 'flex', gap: 7 }}>
          {ACCENTS.map((a) => {
            const on = theme.accent === a.value
            return (
              <button key={a.value} onClick={() => set('accent', a.value)} title={a.name} aria-label={a.name}
                className="press" style={{
                  width: 32, height: 32, borderRadius: 10, cursor: 'pointer', flex: 1,
                  background: a.value, border: `2px solid ${on ? 'var(--stage-text)' : 'transparent'}`,
                  boxShadow: on ? '0 2px 8px rgba(26, 29, 26, 0.18)' : 'none',
                  transition: 'box-shadow .25s, border-color .2s',
                }} />
            )
          })}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--stage-faint)', marginTop: 7 }}>
          --accent: {theme.accent.toLowerCase()}
        </div>
      </Group>

      <Group label="Type">
        <Segmented id="type" value={theme.fonts} options={['Grotesk', 'Mono', 'Neutral'] as FontKey[]} onChange={(v) => set('fonts', v)} />
        <div style={{
          marginTop: 9, padding: '10px 12px', borderRadius: 10,
          background: 'rgba(26, 29, 26, 0.05)', border: '1px solid var(--stage-soft)',
        }}>
          <div style={{ fontFamily: fp.display, fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>$8,642.18</div>
          <div style={{ fontFamily: fp.editorial, fontStyle: 'italic', fontSize: 16, color: 'var(--stage-dim)', marginTop: 1 }}>
            watches
          </div>
        </div>
      </Group>

      <Group label="Corners">
        <Segmented id="corners" value={theme.roundness} options={['Sharp', 'Rounded', 'Pillowy'] as RoundKey[]} onChange={(v) => set('roundness', v)} />
        <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
          {[rd.card, rd.btn, rd.tile].map((r, i) => (
            <div key={i} style={{
              flex: 1, height: 30, borderRadius: r,
              background: 'rgba(255, 255, 255, 0.72)', border: '1px solid var(--stage-soft)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stage-faint)',
            }}>{r}</div>
          ))}
        </div>
      </Group>

      <Group label="AI presence">
        <Segmented id="ai" value={theme.aiLevel} options={['subtle', 'present', 'front'] as AiLevel[]} onChange={(v) => set('aiLevel', v)} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, lineHeight: 1.5, color: 'var(--stage-faint)', margin: '8px 0 0' }}>
          {theme.aiLevel === 'subtle'
            ? 'Security recedes — the mark and nothing more.'
            : theme.aiLevel === 'present'
            ? 'A score you can glance at, and a strip of today’s verdicts.'
            : 'The model narrates: it tells you what it did before you ask.'}
        </p>
      </Group>

      <Group label="Demo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button className="press" onClick={onReplay} style={demoBtn}>
            <Icon name="play" size={14} /> Replay onboarding
          </button>
          <button className="press" onClick={onFraud} style={{ ...demoBtn, color: 'var(--danger)' }}>
            <Icon name="alert" size={14} /> Trigger fraud hold
          </button>
        </div>
      </Group>

      <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--stage-soft)' }}>
        <div className="mono-label" style={{ marginBottom: 6 }}>Palette</div>
        {([['safe', 'verified'], ['warn', 'watching'], ['danger', 'held']] as const).map(([t, l]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: `var(--${t})`, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stage-faint)' }}>--{t} · {l}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

const demoBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
  padding: '9px 11px', borderRadius: 10, cursor: 'pointer',
  background: 'rgba(255, 255, 255, 0.72)', border: '1px solid var(--stage-soft)',
  fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 500, color: 'var(--stage-dim)',
}
