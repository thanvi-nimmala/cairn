export type AiLevel = 'subtle' | 'present' | 'front'

export interface Theme {
  accent: string
  fonts: FontKey
  roundness: RoundKey
  aiLevel: AiLevel
}

export type FontKey = 'Editorial' | 'Grotesk' | 'Neutral'
export type RoundKey = 'Sharp' | 'Rounded' | 'Pillowy'

export const ACCENTS: { name: string; value: string }[] = [
  { name: 'Iris',   value: '#8A5CFF' },
  { name: 'Orchid', value: '#B14BE8' },
  { name: 'Signal', value: '#3D7BFF' },
  { name: 'Vapor',  value: '#22D3C5' },
  { name: 'Ember',  value: '#FF7A45' },
]

export const FONT_PAIRS: Record<FontKey, { display: string; editorial: string; body: string }> = {
  Editorial: {
    display: "'Bricolage Grotesque', system-ui, sans-serif",
    editorial: "'Instrument Serif', Georgia, serif",
    body: "'Manrope', system-ui, sans-serif",
  },
  Grotesk: {
    display: "'Manrope', system-ui, sans-serif",
    editorial: "'Bricolage Grotesque', system-ui, sans-serif",
    body: "'Manrope', system-ui, sans-serif",
  },
  Neutral: {
    display: "system-ui, -apple-system, sans-serif",
    editorial: "'Instrument Serif', Georgia, serif",
    body: "system-ui, -apple-system, sans-serif",
  },
}

export const ROUNDNESS: Record<RoundKey, { card: string; btn: string; tile: string }> = {
  Sharp:   { card: '10px', btn: '10px', tile: '8px' },
  Rounded: { card: '22px', btn: '16px', tile: '14px' },
  Pillowy: { card: '30px', btn: '24px', tile: '20px' },
}

export const DEFAULT_THEME: Theme = {
  accent: '#8A5CFF',
  fonts: 'Editorial',
  roundness: 'Rounded',
  aiLevel: 'present',
}

/** Push theme choices onto the document as CSS custom properties. */
export function applyTheme(t: Theme) {
  const r = document.documentElement.style
  r.setProperty('--accent', t.accent)
  // derive the two companion stops by rotating hue around the chosen accent,
  // so the brand spectrum stays coherent whatever the user picks
  r.setProperty('--accent-2', `oklch(from ${t.accent} clamp(0.6, calc(l + 0.07), 0.8) calc(c + 0.02) calc(h + 34))`)
  r.setProperty('--accent-3', `oklch(from ${t.accent} clamp(0.62, calc(l + 0.12), 0.86) calc(c - 0.02) calc(h - 46))`)
  r.setProperty('--accent-glow', `color-mix(in oklch, ${t.accent} 44%, transparent)`)
  r.setProperty('--accent-wash', `color-mix(in oklch, ${t.accent} 12%, transparent)`)

  const fp = FONT_PAIRS[t.fonts]
  r.setProperty('--font-display', fp.display)
  r.setProperty('--font-editorial', fp.editorial)
  r.setProperty('--font-body', fp.body)

  const rd = ROUNDNESS[t.roundness]
  r.setProperty('--r-card', rd.card)
  r.setProperty('--r-btn', rd.btn)
  r.setProperty('--r-tile', rd.tile)
}
