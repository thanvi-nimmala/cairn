/* Flat 2-D stone silhouettes.
   A pebble is a circle whose radius wobbles with angle. Summing a few
   sinusoids keeps the wobble periodic, so the outline always closes cleanly,
   and seeding the phases makes every stone its own shape but the same shape
   on every render. */

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000 }
}

/** Closed smooth path for one stone, centred on (0,0), spanning rx × ry. */
export function stonePath(seed: number, rx: number, ry: number, N = 22): string {
  const r = rng(seed)
  // four harmonics: low ones give the lopsided mass, high ones the nicks
  const harm = [2, 3, 4, 5].map((k, i) => ({
    k, phase: r() * Math.PI * 2, amp: (0.058 - i * 0.013) * (0.7 + r() * 0.6),
  }))
  const pts: [number, number][] = []
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    let w = 1
    for (const h of harm) w += h.amp * Math.sin(h.k * a + h.phase)
    pts.push([Math.cos(a) * rx * w, Math.sin(a) * ry * w])
  }
  // Catmull-Rom through the samples, emitted as cubics
  const at = (i: number) => pts[(i + N) % N]
  let d = `M${at(0)[0].toFixed(2)},${at(0)[1].toFixed(2)}`
  for (let i = 0; i < N; i++) {
    const [x0, y0] = at(i - 1), [x1, y1] = at(i), [x2, y2] = at(i + 1), [x3, y3] = at(i + 2)
    const c1x = x1 + (x2 - x0) / 6, c1y = y1 + (y2 - y0) / 6
    const c2x = x2 - (x3 - x1) / 6, c2y = y2 - (y3 - y1) / 6
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`
  }
  return d + 'Z'
}

/** One row of the stack: half-width, half-height, tilt, x-offset — all relative to `size`. */
export const STONES: { w: number; h: number; rot: number; dx: number; seed: number }[] = [
  { w: 0.46, h: 0.113, rot: -0.05, dx:  0.00, seed: 3  },
  { w: 0.36, h: 0.106, rot:  0.11, dx: -0.06, seed: 17 },
  { w: 0.40, h: 0.098, rot: -0.08, dx:  0.06, seed: 29 },
  { w: 0.30, h: 0.108, rot:  0.14, dx: -0.04, seed: 41 },
  { w: 0.33, h: 0.092, rot: -0.12, dx:  0.03, seed: 53 },
  { w: 0.22, h: 0.085, rot:  0.09, dx:  0.05, seed: 67 },
]
