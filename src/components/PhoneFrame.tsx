import type { ReactNode } from 'react'
import { Aurora, type Mood } from './Aurora'

const W = 390
const H = 844

function StatusBar() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 30px 0', pointerEvents: 'none',
    }}>
      <span style={{
        fontFamily: '-apple-system, "SF Pro Text", system-ui', fontWeight: 600,
        fontSize: 15.5, color: 'var(--text)', letterSpacing: '-0.01em',
      }}>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text)' }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx=".7" /><rect x="4.6" y="4.8" width="3" height="6.2" rx=".7" />
          <rect x="9.2" y="2.4" width="3" height="8.6" rx=".7" /><rect x="13.8" y="0" width="3" height="11" rx=".7" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 3.2c2.3 0 4.4.9 5.9 2.4l1.1-1.1A9.7 9.7 0 0 0 8.5 1.5 9.7 9.7 0 0 0 1.5 4.5l1.1 1.1a8.3 8.3 0 0 1 5.9-2.4Z" />
          <path d="M8.5 6.8c1.4 0 2.6.5 3.5 1.4l1.1-1.1A6.9 6.9 0 0 0 8.5 5.1 6.9 6.9 0 0 0 3.9 7.1L5 8.2a5 5 0 0 1 3.5-1.4Z" />
          <circle cx="8.5" cy="10.5" r="1.5" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 27 13">
          <rect x=".5" y=".5" width="23" height="12" rx="3.6" stroke="currentColor" strokeOpacity=".35" fill="none" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.5-1.3 1.5-2s-.7-1.7-1.5-2Z" fill="currentColor" fillOpacity=".4" />
        </svg>
      </span>
    </div>
  )
}

/** Device bezel + ambient field + Dynamic Island + home indicator. */
export function PhoneFrame({ children, mood = 'calm', bare = false }: {
  children: ReactNode; mood?: Mood; bare?: boolean
}) {
  // bare = the screen alone at 390x844, for capturing stills that get dropped
  // into a device frame elsewhere (the portfolio supplies its own bezel)
  if (bare) {
    return (
      <div style={{
        position: 'relative', width: W, height: H, overflow: 'hidden',
        background: 'var(--ink)', isolation: 'isolate',
      }}>
        <Aurora mood={mood} />
        <div className="grain" />
        <StatusBar />
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 118, height: 33, borderRadius: 22, background: '#000', zIndex: 70,
        }} />
        <div style={{ position: 'relative', height: '100%', zIndex: 10 }}>{children}</div>
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 3, background: 'rgba(26, 29, 26, 0.26)', zIndex: 300,
        }} />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: W, height: H, flexShrink: 0 }}>
      {/* ambient bloom cast onto the stage behind the device */}
      <div aria-hidden style={{
        position: 'absolute', inset: -90, borderRadius: '50%', pointerEvents: 'none',
        background: mood === 'alert'
          ? 'radial-gradient(closest-side, color-mix(in srgb, var(--danger) 30%, transparent), transparent 74%)'
          : 'radial-gradient(closest-side, var(--accent-glow), transparent 72%)',
        filter: 'blur(50px)', opacity: 0.75, transition: 'background .8s ease',
      }} />

      <div style={{
        position: 'relative', width: '100%', height: '100%',
        borderRadius: 56, padding: 11,
        background: 'linear-gradient(150deg, oklch(0.42 0.012 288), oklch(0.17 0.01 288) 42%, oklch(0.30 0.012 288))',
        boxShadow: '0 50px 110px oklch(0 0 0 / .62), 0 0 0 1px oklch(0.5 0.02 288 / .35), inset 0 0 0 1px oklch(0 0 0 / .6)',
      }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%', borderRadius: 45,
          overflow: 'hidden', background: 'var(--ink)', isolation: 'isolate',
        }}>
          <Aurora mood={mood} />
          <div className="grain" />
          <StatusBar />

          {/* Dynamic Island */}
          <div style={{
            position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
            width: 118, height: 33, borderRadius: 22, background: '#000', zIndex: 70,
          }} />

          <div style={{ position: 'relative', height: '100%', zIndex: 10 }}>{children}</div>

          {/* home indicator */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            width: 134, height: 5, borderRadius: 3, background: 'rgba(26, 29, 26, 0.26)', zIndex: 300,
          }} />
        </div>
      </div>
    </div>
  )
}

export const PHONE_W = W
export const PHONE_H = H
