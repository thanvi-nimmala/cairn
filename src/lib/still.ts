/* Capture mode.
   Stills were coming out mid-fade because the headless capture relies on
   --virtual-time-budget to run the entrance animations, and framer's
   rAF-driven transitions do not reliably advance under it. Rather than
   guess at a long enough budget, ?shot= now lands every entrance on its
   final frame, so a still is deterministic. */
export const STILL =
  typeof location !== 'undefined' && new URLSearchParams(location.search).has('shot')

/** Collapse a one-shot transition when capturing. */
export const once = <T>(t: T): T => (STILL ? ({ duration: 0 } as unknown as T) : t)
