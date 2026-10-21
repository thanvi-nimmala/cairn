import { once } from './still'

/* One place for how things move.
   Durations were scattered across components as ad-hoc numbers, which is why
   the app felt like several apps moving at different speeds. */

/** Settling mass — stones landing, pills snapping into place. Slightly
    underdamped so it arrives with a little weight rather than a bounce. */
export const SETTLE = once({ type: 'spring', stiffness: 210, damping: 24, mass: 0.9 } as const)

/** A control answering a tap. Fast, no overshoot worth seeing. */
export const SNAP = once({ type: 'spring', stiffness: 460, damping: 38 } as const)

/** Sheets and anything carrying a surface with it. */
export const SURFACE = once({ type: 'spring', stiffness: 380, damping: 40, mass: 0.9 } as const)

/** Opacity and small offsets. Cubic out — leaves fast, lands soft. */
export const EASE = [0.22, 0.9, 0.3, 1] as const
export const FADE = once({ duration: 0.34, ease: EASE } as const)

/** Continuous instrument motion. Linear is correct here: any easing makes a
    rotating scale look like it is speeding up and slowing down. */
export const spin = (seconds: number) =>
  ({ duration: seconds, repeat: Infinity, ease: 'linear' }) as const

/** A slow reciprocating drift, for anything that should breathe. */
export const drift = (seconds: number) =>
  ({ duration: seconds, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }) as const

/** A staggered entrance. Routed through `once` so a still lands on the
    final frame — inline `transition={{ delay }}` props bypass that and were
    why the welcome screen kept capturing mid-fade. */
export const enter = (delay = 0) => once({ ...FADE, delay } as const)

/** Stagger helper — index to delay, capped so long lists stay responsive. */
export const step = (i: number, per = 0.045, cap = 0.5) => Math.min(i * per, cap)

/** An arrival worth noticing — a verdict icon landing. Underdamped on
    purpose: this is the one place a small overshoot earns its keep. */
export const POP = once({ type: 'spring', stiffness: 260, damping: 16 } as const)

/** A switch knob. Stiffer than SNAP because the travel is tiny and any
    visible settle reads as lag on a control you are holding. */
export const KNOB = once({ type: 'spring', stiffness: 620, damping: 34 } as const)
