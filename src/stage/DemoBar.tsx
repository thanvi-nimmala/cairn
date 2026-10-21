import { motion } from 'framer-motion'
import { SNAP } from '../lib/motion'
import { Icon } from '../components/Icon'
import type { Reel } from '../demo/reels'

interface Props {
  reels: Reel[]
  activeId: string | null
  progress: number
  recording: boolean
  onPlay: (id: string) => void
  onStop: () => void
  onToggleRecording: () => void
}

/**
 * Reel picker. In record mode it collapses to a single strip that fades out
 * while a reel plays, so a screen capture stays clean.
 */
export function DemoBar({ reels, activeId, progress, recording, onPlay, onStop, onToggleRecording }: Props) {
  const playing = activeId !== null
  return (
    <div
      className="demo-bar"
      data-playing={playing}
      style={{
        position: 'fixed', left: '50%', bottom: 18, transform: 'translateX(-50%)', zIndex: 8000,
        display: 'flex', alignItems: 'center', gap: 5, padding: '6px 7px',
        borderRadius: 18, border: '1px solid var(--stage-line)',
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        boxShadow: '0 16px 44px rgba(26, 29, 26, 0.12)',
        maxWidth: 'calc(100vw - 32px)', overflowX: 'auto',
      }}
    >
      <button
        onClick={onToggleRecording}
        title={recording ? 'Show stage chrome' : 'Hide stage chrome for recording'}
        className="press"
        style={{
          width: 34, height: 34, borderRadius: 12, flexShrink: 0, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          border: '1px solid var(--stage-soft)',
          background: recording ? 'var(--danger)' : 'rgba(255, 255, 255, 0.72)',
          color: recording ? '#fff' : 'var(--stage-dim)',
        }}
      >
        <span style={{
          width: 11, height: 11, borderRadius: recording ? 3 : '50%',
          background: 'currentColor', display: 'block',
        }} />
      </button>

      <span style={{ width: 1, height: 22, background: 'var(--stage-soft)', flexShrink: 0 }} />

      {reels.map((r) => {
        const on = activeId === r.id
        return (
          <button
            key={r.id}
            onClick={() => (on ? onStop() : onPlay(r.id))}
            title={r.note}
            className="press"
            style={{
              position: 'relative', flexShrink: 0, cursor: 'pointer',
              border: 'none', background: 'none', borderRadius: 12,
              padding: '7px 11px', display: 'flex', alignItems: 'center', gap: 7,
              color: on ? 'var(--stage-text)' : 'var(--stage-dim)', transition: 'color .2s',
            }}
          >
            {on && (
              <>
                <motion.span
                  layoutId="reelPill"
                  transition={SNAP}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 12,
                    background: '#FFFFFF', border: '1px solid var(--stage-soft)', boxShadow: '0 1px 3px rgba(26,29,26,.1)',
                  }}
                />
                <span style={{
                  position: 'absolute', left: 0, bottom: 0, height: 2, borderRadius: 2,
                  width: `${progress * 100}%`, background: 'var(--spectrum)',
                  transition: 'width .3s linear',
                }} />
              </>
            )}
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Icon name={on ? 'x' : 'play'} size={13} stroke={2.2} style={{ color: on ? 'var(--accent)' : undefined }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {r.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--stage-faint)' }}>
                {r.seconds}s
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
