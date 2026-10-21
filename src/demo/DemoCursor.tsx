import { AnimatePresence, motion } from 'framer-motion'
import type { CursorPos } from './useDemoRunner'

/** The synthetic pointer, so a recording reads as someone using the app. */
export function DemoCursor({ pos, tapKey }: { pos: CursorPos | null; tapKey: number }) {
  if (!pos) return null
  return (
    <motion.div
      initial={false}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 190, damping: 24, mass: 0.7 }}
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9000,
        pointerEvents: 'none', willChange: 'transform',
      }}
    >
      <div style={{ position: 'relative', transform: 'translate(-50%, -50%)' }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          border: '1.5px solid rgba(26, 29, 26, .72)',
          background: 'rgba(26, 29, 26, .12)',
          backdropFilter: 'blur(2px)',
          boxShadow: '0 2px 10px oklch(0 0 0 / .5)',
        }} />
        <AnimatePresence>
          {tapKey > 0 && (
            <motion.div
              key={tapKey}
              initial={{ scale: 0.4, opacity: 0.85 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2px solid var(--accent-2)',
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
