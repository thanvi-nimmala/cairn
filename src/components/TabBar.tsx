import { motion } from 'framer-motion'
import { SNAP } from '../lib/motion'
import { Icon } from './Icon'

export type Tab = 'home' | 'activity' | 'security' | 'profile'

const ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'activity', icon: 'activity', label: 'Activity' },
  { id: 'security', icon: 'shield', label: 'Security' },
  { id: 'profile', icon: 'user', label: 'Profile' },
]

/** Floating glass bar with a shared-element pill and a centred pay trigger. */
export function TabBar({ tab, setTab, onPay }: { tab: Tab; setTab: (t: Tab) => void; onPay: () => void }) {
  const left = ITEMS.slice(0, 2)
  const right = ITEMS.slice(2)

  const item = (it: (typeof ITEMS)[number]) => {
    const active = tab === it.id
    return (
      <button key={it.id} className="press" onClick={() => setTab(it.id)} aria-label={it.label} data-demo={`tab-${it.id}`} style={{
        position: 'relative', flex: 1, background: 'none', border: 'none', cursor: 'pointer',
        padding: '7px 0 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        color: active ? 'var(--surface)' : 'var(--text-faint)', transition: 'color .2s',
      }}>
        {active && (
          <motion.span
            layoutId="tabPill"
            transition={SNAP}
            style={{
              position: 'absolute', inset: '2px 1px', borderRadius: 15,
              background: 'var(--text)',
            }}
          />
        )}
        <span style={{ position: 'relative' }}>
          <Icon name={it.icon} size={21} stroke={active ? 2.3 : 1.9} />
        </span>
        <span style={{
          position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 7,
          fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase',
        }}>{it.label}</span>
      </button>
    )
  }

  return (
    <div className="glass-strong" style={{
      position: 'absolute', left: 14, right: 14, bottom: 22, zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 2, padding: '5px 6px',
      borderRadius: 26,
    }}>
      {left.map(item)}
      <button className="press" onClick={onPay} aria-label="Pay" data-demo="fab-pay" style={{
        width: 50, height: 50, flexShrink: 0, margin: '0 5px', borderRadius: 18, border: 'none', cursor: 'pointer',
        background: 'var(--accent)', color: '#fff',
        display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--sh-1)',
      }}>
        <Icon name="bolt" size={24} stroke={2.3} style={{ position: 'relative' }} />
      </button>
      {right.map(item)}
    </div>
  )
}
