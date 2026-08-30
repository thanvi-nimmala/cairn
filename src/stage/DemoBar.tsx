import { motion } from 'framer-motion'
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
        borderRadius: 18, border: '1px solid var(--line)',
        background: 'oklch(0.15 0.022 288 / .86)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        boxShadow: '0 16px 44px oklch(0 0 0 / .6)',
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
          border: '1px solid var(--line-soft)',
          background: recording ? 'var(--danger)' : 'oklch(1 0 0 / .05)',
          color: recording ? '#fff' : 'var(--text-dim)',
        }}
      >
        <span style={{
          width: 11, height: 11, borderRadius: recording ? 3 : '50%',
          background: 'currentColor', display: 'block',
        }} />
      </button>

      <span style={{ width: 1, height: 22, background: 'var(--line-soft)', flexShrink: 0 }} />

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
              color: on ? 'var(--text)' : 'var(--text-dim)', transition: 'color .2s',
            }}
          >
            {on && (
              <>
                <motion.span
                  layoutId="reelPill"
                  transition={{ type: 'spring', stiffness: 480, damping: 40 }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 12,
                    background: 'oklch(1 0 0 / .08)', border: '1px solid var(--line-soft)',
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
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-faint)' }}>
                {r.seconds}s
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
