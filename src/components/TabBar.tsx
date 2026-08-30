import { motion } from 'framer-motion'
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
        color: active ? 'var(--text)' : 'var(--text-faint)', transition: 'color .2s',
      }}>
        {active && (
          <motion.span
            layoutId="tabPill"
            transition={{ type: 'spring', stiffness: 460, damping: 38 }}
            style={{
              position: 'absolute', inset: '2px 6px', borderRadius: 14,
              background: 'oklch(1 0 0 / .08)', border: '1px solid var(--line-soft)',
            }}
          />
        )}
        <span style={{ position: 'relative', color: active ? 'var(--accent)' : undefined }}>
          <Icon name={it.icon} size={21} stroke={active ? 2.3 : 1.9} />
        </span>
        <span style={{
          position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 8.5,
          letterSpacing: '.08em', textTransform: 'uppercase',
        }}>{it.label}</span>
      </button>
    )
  }

  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 22, zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 4, padding: '5px 6px',
      borderRadius: 26, border: '1px solid var(--line)',
      background: 'oklch(0.18 0.025 288 / .74)',
      backdropFilter: 'blur(22px) saturate(160%)',
      WebkitBackdropFilter: 'blur(22px) saturate(160%)',
      boxShadow: '0 12px 34px oklch(0 0 0 / .5), inset 0 1px 0 oklch(1 0 0 / .08)',
    }}>
      {left.map(item)}
      <button className="press" onClick={onPay} aria-label="Pay" data-demo="fab-pay" style={{
        width: 50, height: 50, flexShrink: 0, borderRadius: 18, border: 'none', cursor: 'pointer',
        background: 'var(--spectrum)', color: 'var(--on-accent)',
        display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 22px var(--accent-glow), inset 0 1px 0 oklch(1 0 0 / .3)',
      }}>
        <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, oklch(1 0 0 / .22), transparent 60%)' }} />
        <Icon name="bolt" size={24} stroke={2.3} style={{ position: 'relative' }} />
      </button>
      {right.map(item)}
    </div>
  )
}
