import { Icon } from './Icon'

/** Biometric affordance — bracket frame, sweeping scan line, resolves to a check. */
export function FaceScan({ state = 'scanning', size = 120 }: { state?: 'scanning' | 'done'; size?: number }) {
  const done = state === 'done'
  const accent = done ? 'var(--safe)' : 'var(--accent)'
  const corner = size * 0.26
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* four corner brackets */}
      {[[0, 0], [1, 0], [1, 1], [0, 1]].map(([hx, hy], i) => (
        <span key={i} style={{
          position: 'absolute',
          [hx ? 'right' : 'left']: 0, [hy ? 'bottom' : 'top']: 0,
          width: corner, height: corner,
          borderTop: hy ? undefined : `2.5px solid ${accent}`,
          borderBottom: hy ? `2.5px solid ${accent}` : undefined,
          borderLeft: hx ? undefined : `2.5px solid ${accent}`,
          borderRight: hx ? `2.5px solid ${accent}` : undefined,
          borderTopLeftRadius: !hx && !hy ? 14 : 0,
          borderTopRightRadius: hx && !hy ? 14 : 0,
          borderBottomRightRadius: hx && hy ? 14 : 0,
          borderBottomLeftRadius: !hx && hy ? 14 : 0,
          transition: 'border-color .35s',
        } as React.CSSProperties} />
      ))}
      <div style={{
        position: 'absolute', inset: size * 0.06, borderRadius: 22,
        boxShadow: `0 0 40px color-mix(in oklch, ${accent} 30%, transparent)`,
        transition: 'box-shadow .35s',
      }} />
      <div style={{ color: accent, transition: 'color .35s' }}>
        <Icon name={done ? 'check' : 'faceid'} size={size * 0.48} stroke={2} />
      </div>
      {!done && (
        <div className="scanline" style={{
          position: 'absolute', left: size * 0.11, right: size * 0.11, height: 2, borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 14px ${accent}`,
        }} />
      )}
    </div>
  )
}
