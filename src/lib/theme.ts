export type AiLevel = 'subtle' | 'present' | 'front'

export interface Theme {
  accent: string
  fonts: FontKey
  roundness: RoundKey
  aiLevel: AiLevel
}

export type FontKey = 'Grotesk' | 'Mono' | 'Neutral'
export type RoundKey = 'Sharp' | 'Rounded' | 'Pillowy'

/* A scheme is the whole ground, not a swapped accent. Changing only the
   accent on a sage field just makes a sage app with an odd button, which
   is why the earlier five-accent list never really changed anything. */
export interface Scheme {
  name: string
  accent: string
  /** the plaster the app sits on, light to deep */
  field: [string, string, string]
  bloom: string
  /** the light on the top of the ground; defaults to white, which only
      works on a light scheme */
  lift?: string
  /** the scale's colour. The instrument earns its separation by running at a
      different temperature from the app, so a warm scheme gets cold ticks and
      a cold scheme gets warm ones. Defaults to cold. */
  scanTick?: string
  /** the hero variant, which runs the other way: deep at the top */
  hero: [string, string, string]
  heroGlow: string
  heroWash: string
  /** the scanner inverts — light rim, near-black core */
  scanRim: string
  scanCore: string
  /** the rock the cairn is made of: base stone, crown stone. The six-step
      ramp is interpolated, so a scheme never has to list six greys. */
  stone: [string, string]
  /** a scheme dark enough to need inverted text carries its own surfaces.
      Without this a dark ground keeps near-black type on it. */
  ui?: UI
}

export interface UI {
  ink: string; surface: string; surface2: string; surface3: string
  line: string; lineSoft: string
  text: string; textDim: string; textFaint: string
  glass: string; glass2: string; glassEdge: string; glassLit: string; glassShadow: string
  /** ink-on-paper marks; these invert in a dark scheme */
  hairline: string; grid: string; rule: string; ruleSoft: string
  fillTop: string; fillBtm: string; chip: string
  dangerWash: string; safeWash: string
  /** the verdict colours. On a dark ground the light-mode hues go muddy or
      acid, so a dark scheme lifts them rather than reusing them. */
  safe: string; warn: string; danger: string
}

const LIGHT_UI: UI = {
  ink: '#E7E9E4', surface: '#FFFFFF', surface2: '#F5F7F3', surface3: '#EBEEE9',
  line: '#E2E5E0', lineSoft: '#EAECE7',
  text: '#1A1D1A', textDim: '#6B716B', textFaint: '#9BA09B',
  glass: 'rgba(255,255,255,0.46)', glass2: 'rgba(255,255,255,0.72)',
  glassEdge: 'rgba(255,255,255,0.5)', glassLit: 'rgba(255,255,255,0.85)',
  glassShadow: 'rgba(26,29,26,0.06)',
  hairline: 'rgba(26,29,26,0.09)', grid: 'rgba(26,29,26,0.18)',
  rule: 'rgba(26,29,26,0.30)', ruleSoft: 'rgba(26,29,26,0.42)',
  fillTop: 'rgba(26,29,26,0.17)', fillBtm: 'rgba(26,29,26,0.02)',
  chip: 'rgba(26,29,26,0.05)',
  dangerWash: '#FBEEEA', safeWash: '#EAF0EB',
  safe: '#5F7A68', warn: '#B5872F', danger: '#C9553C',
}

/* ── colour maths, so the stones follow the ground ── */
const toRGB = (h: string) => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const toHex = (c: number[]) =>
  '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
const mix = (a: string, b: string, t: number) => {
  const A = toRGB(a), B = toRGB(b)
  return toHex(A.map((v, i) => v + (B[i] - v) * t))
}
const tint = (c: string, t: number) => mix(c, '#FFFFFF', t)

export const SCHEMES: Scheme[] = [
  {
    name: 'Sage', accent: '#6F8E78',
    stone: ['#5F7A68', '#A4B1A5'],
    field: ['#E9EDE6', '#DCE5DA', '#D0DBCF'], bloom: 'rgba(150,175,152,.34)',
    hero: ['#B9C7BA', '#D3DDD1', '#E6EAE2'],
    heroGlow: 'rgba(119,146,124,.55)', heroWash: 'rgba(168,192,174,.5)',
    scanRim: '#93AB99', scanCore: '#0B0F0C',
  },
  {
    name: 'Clay', accent: '#A8694A',
    stone: ['#8A5F4A', '#C6B0A0'],
    field: ['#F2ECE4', '#E9E0D5', '#DCD0C2'], bloom: 'rgba(181,139,110,.30)',
    hero: ['#CBB5A3', '#E0D3C6', '#EFE8DF'],
    heroGlow: 'rgba(160,116,88,.48)', heroWash: 'rgba(205,178,156,.5)',
    scanRim: '#B09079', scanCore: '#120D09',
  },
  {
    name: 'Slate', accent: '#5B7390',
    stone: ['#4F6478', '#A8B5C2'],
    field: ['#EAEDF1', '#DEE4EB', '#D0D9E3'], bloom: 'rgba(120,145,175,.30)',
    hero: ['#AFC0D1', '#D0DAE5', '#E6EBF1'],
    heroGlow: 'rgba(92,120,152,.48)', heroWash: 'rgba(164,186,210,.5)',
    scanRim: '#8599AD', scanCore: '#090C10',
  },
  {
    name: 'Dune', accent: '#9A7628',
    stone: ['#7A6433', '#C5B897'],
    field: ['#F4EEE1', '#ECE3D0', '#E0D4BC'], bloom: 'rgba(181,152,78,.30)',
    hero: ['#CDBD95', '#E3D9C2', '#F1ECE0'],
    heroGlow: 'rgba(150,120,54,.45)', heroWash: 'rgba(206,188,148,.5)',
    scanRim: '#B3A074', scanCore: '#110E07',
  },
  {
    name: 'Fog', accent: '#6E5574',
    stone: ['#5E4D64', '#B4A9BA'],
    field: ['#EDEBEF', '#E4DFE7', '#D8D2DD'], bloom: 'rgba(140,115,145,.28)',
    hero: ['#BDB2C4', '#D9D2DF', '#EBE8EF'],
    heroGlow: 'rgba(110,85,116,.44)', heroWash: 'rgba(188,172,194,.5)',
    scanRim: '#9C8BA3', scanCore: '#0E0B10',
  },
  {
    name: 'Umber', accent: '#6B4A33',
    stone: ['#5A3F2C', '#B09578'],
    field: ['#E7DCCC', '#D8C8B4', '#C6B29A'], bloom: 'rgba(140,100,70,.32)',
    hero: ['#B59679', '#D7C7B2', '#EBE2D5'],
    heroGlow: 'rgba(120,82,54,.5)', heroWash: 'rgba(190,164,138,.5)',
    scanRim: '#A98A6B', scanCore: '#120B06',
  },
  {
    name: 'Bark', accent: '#3E2A1C',
    stone: ['#4A3426', '#A78A6E'],
    field: ['#CBB8A2', '#B79F86', '#A0866C'], bloom: 'rgba(90,62,40,.34)',
    hero: ['#8E7258', '#B4987B', '#D2C3AE'],
    heroGlow: 'rgba(72,48,30,.5)', heroWash: 'rgba(160,131,104,.5)',
    scanRim: '#8E7054', scanCore: '#0E0805',
  },
  {
    // Built outward from the instrument. The scanner's cold slate was the
    // part worth keeping, so the ground is the same blue-grey rather than
    // the violet it started as — desaturated, and slate is a real rock.
    name: 'Dusk', accent: '#8FB2CE',
    stone: ['#4E5A69', '#B6C2CE'],
    field: ['#2E3744', '#242B36', '#191E26'], bloom: 'rgba(96,120,150,.42)',
    hero: ['#3A4654', '#28313C', '#1B2129'],
    heroGlow: 'rgba(96,124,158,.44)', heroWash: 'rgba(86,108,134,.46)',
    scanRim: '#39414F', scanCore: '#020306',
    scanTick: 'rgba(226,240,246,0.88)',
    lift: 'rgba(150,172,196,.26)',
    ui: {
      ink: '#1B212A', surface: '#28313C', surface2: '#222A34', surface3: '#2F3A46',
      line: '#37424F', lineSoft: '#2E3843',
      text: '#E8EEF4', textDim: '#A9B6C2', textFaint: '#76838F',
      glass: 'rgba(224,238,255,0.07)', glass2: 'rgba(224,238,255,0.13)',
      glassEdge: 'rgba(218,232,250,0.15)', glassLit: 'rgba(224,238,255,0.32)',
      glassShadow: 'rgba(0,0,0,0.34)',
      hairline: 'rgba(232,238,244,0.12)', grid: 'rgba(232,238,244,0.14)',
      rule: 'rgba(232,238,244,0.28)', ruleSoft: 'rgba(232,238,244,0.38)',
      fillTop: 'rgba(232,238,244,0.16)', fillBtm: 'rgba(232,238,244,0.02)',
      chip: 'rgba(232,238,244,0.08)',
      dangerWash: '#36222A', safeWash: '#1E2C2A',
      safe: '#84B9A4', warn: '#D6AF5C', danger: '#E5806F',
    },
  },
  {
    name: 'Soil', accent: '#C9915C',
    stone: ['#7A5A3F', '#D9C2A4'],
    field: ['#302720', '#251E18', '#1A1410'], bloom: 'rgba(122,90,63,.42)',
    hero: ['#3C2F26', '#2A211B', '#1C1511'],
    heroGlow: 'rgba(150,108,70,.42)', heroWash: 'rgba(110,82,58,.46)',
    // The app is warm; the instrument is cold. On a light scheme the scanner
    // stood out by being dark — against a dark app that contrast is gone, so
    // it inverts on temperature instead. The stones stay warm inside it, which
    // reads as something human being measured by something that is not.
    scanRim: '#4A5A63', scanCore: '#000103',
    // warm, not white — the same light that falls across the hero
    lift: 'rgba(188, 142, 96, 0.34)',
    ui: {
      ink: '#241D18', surface: '#33291F', surface2: '#2C231B', surface3: '#3B2F24',
      line: '#453729', lineSoft: '#392E23',
      text: '#F4ECE1', textDim: '#BFAF9C', textFaint: '#8C7D6B',
      glass: 'rgba(255,244,228,0.07)', glass2: 'rgba(255,244,228,0.12)',
      glassEdge: 'rgba(255,238,215,0.14)', glassLit: 'rgba(255,240,220,0.3)',
      glassShadow: 'rgba(0,0,0,0.3)',
      hairline: 'rgba(244,236,225,0.12)', grid: 'rgba(244,236,225,0.14)',
      rule: 'rgba(244,236,225,0.28)', ruleSoft: 'rgba(244,236,225,0.38)',
      fillTop: 'rgba(244,236,225,0.16)', fillBtm: 'rgba(244,236,225,0.02)',
      chip: 'rgba(244,236,225,0.08)',
      dangerWash: '#3A211A', safeWash: '#20291F',
      // lifted for brown: the light-mode sage reads acid here, and the
      // light-mode red loses its separation from the accent
      safe: '#8FB395', warn: '#D9A850', danger: '#E07E62',
    },
  },
  {
    name: 'Ash', accent: '#4A4F4C',
    stone: ['#4F534F', '#B1B5B0'],
    field: ['#EEEEEC', '#E4E4E1', '#D8D8D4'], bloom: 'rgba(140,142,136,.26)',
    hero: ['#BCBDB9', '#D9D9D5', '#ECECE9'],
    heroGlow: 'rgba(104,108,104,.42)', heroWash: 'rgba(188,190,185,.5)',
    scanRim: '#9A9D98', scanCore: '#0C0C0B',
  },
]

/** Kept so the token panel's swatch row keeps working. */
export const ACCENTS = SCHEMES.map((s) => ({ name: s.name, value: s.accent }))

export const FONT_PAIRS: Record<FontKey, { display: string; editorial: string; body: string }> = {
  Grotesk: {
    display: "'Manrope', system-ui, sans-serif",
    editorial: "'Manrope', system-ui, sans-serif",
    body: "'Manrope', system-ui, sans-serif",
  },
  Mono: {
    display: "'Martian Mono', ui-monospace, monospace",
    editorial: "'Manrope', system-ui, sans-serif",
    body: "'Manrope', system-ui, sans-serif",
  },
  Neutral: {
    display: "system-ui, -apple-system, sans-serif",
    editorial: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
  },
}

export const ROUNDNESS: Record<RoundKey, { card: string; btn: string; tile: string }> = {
  Sharp:   { card: '12px', btn: '12px', tile: '9px' },
  Rounded: { card: '26px', btn: '28px', tile: '18px' },
  Pillowy: { card: '34px', btn: '28px', tile: '24px' },
}

export const DEFAULT_THEME: Theme = {
  accent: '#8FB2CE',
  fonts: 'Grotesk',
  roundness: 'Rounded',
  aiLevel: 'present',
}

/** Push theme choices onto the document as CSS custom properties. */
export function applyTheme(t: Theme) {
  const r = document.documentElement.style
  r.setProperty('--accent', t.accent)

  // the ground follows the accent, so picking a colour re-tints the whole app
  const sc = SCHEMES.find((s) => s.accent === t.accent) ?? SCHEMES[0]
  r.setProperty('--field-1', sc.field[0])
  r.setProperty('--field-2', sc.field[1])
  r.setProperty('--field-3', sc.field[2])
  r.setProperty('--field-bloom', sc.bloom)
  r.setProperty('--field-lift', sc.lift ?? 'rgba(255,255,255,0.72)')
  r.setProperty('--scan-tick', sc.scanTick ?? 'rgba(226,240,246,0.78)')
  r.setProperty('--hero-1', sc.hero[0])
  r.setProperty('--hero-2', sc.hero[1])
  r.setProperty('--hero-3', sc.hero[2])
  r.setProperty('--hero-glow', sc.heroGlow)
  r.setProperty('--hero-wash', sc.heroWash)
  r.setProperty('--scan-rim', sc.scanRim)
  r.setProperty('--scan-core', sc.scanCore)

  // a dark scheme brings its own surfaces; a light one resets to the defaults,
  // otherwise switching dark → light leaves inverted type behind
  const ui = sc.ui ?? LIGHT_UI
  r.setProperty('--ink', ui.ink)
  r.setProperty('--surface', ui.surface)
  r.setProperty('--surface-2', ui.surface2)
  r.setProperty('--surface-3', ui.surface3)
  r.setProperty('--line', ui.line)
  r.setProperty('--line-soft', ui.lineSoft)
  r.setProperty('--text', ui.text)
  r.setProperty('--text-dim', ui.textDim)
  r.setProperty('--text-faint', ui.textFaint)
  r.setProperty('--glass', ui.glass)
  r.setProperty('--glass-2', ui.glass2)
  r.setProperty('--glass-edge', ui.glassEdge)
  r.setProperty('--glass-lit', ui.glassLit)
  r.setProperty('--glass-shadow', ui.glassShadow)
  r.setProperty('--hairline', ui.hairline)
  r.setProperty('--grid', ui.grid)
  r.setProperty('--rule', ui.rule)
  r.setProperty('--rule-soft', ui.ruleSoft)
  r.setProperty('--fill-top', ui.fillTop)
  r.setProperty('--fill-btm', ui.fillBtm)
  r.setProperty('--chip', ui.chip)
  r.setProperty('--danger-wash', ui.dangerWash)
  r.setProperty('--safe-wash', ui.safeWash)
  r.setProperty('--safe', ui.safe)
  r.setProperty('--warn', ui.warn)
  r.setProperty('--danger', ui.danger)

  // the cairn is cut from the scheme's own rock. Hardcoded sage stones on a
  // clay or plum ground was the one thing that broke every alternate palette.
  const [base, crown] = sc.stone
  for (let i = 0; i < 6; i++) {
    const t = i / 5
    r.setProperty(`--stone-${i + 1}`, mix(base, crown, t))
    // on the scanner the ramp inverts and lifts, so the base stays off the black
    r.setProperty(`--stone-d${i + 1}`, mix(tint(crown, 0.34), tint(base, 0.3), t))
  }
  // two lighter companions, mixed toward the plaster ground rather than
  // rotated around the wheel — keeps the family earthy at every stop
  r.setProperty('--accent-2', `color-mix(in srgb, ${t.accent} 72%, ${sc.field[0]})`)
  r.setProperty('--accent-3', `color-mix(in srgb, ${t.accent} 44%, ${sc.field[0]})`)
  r.setProperty('--accent-glow', `color-mix(in srgb, ${t.accent} 26%, transparent)`)
  r.setProperty('--accent-wash', `color-mix(in srgb, ${t.accent} 13%, #FFFFFF)`)
  r.setProperty('--spectrum', t.accent)

  const fp = FONT_PAIRS[t.fonts]
  r.setProperty('--font-display', fp.display)
  r.setProperty('--font-editorial', fp.editorial)
  r.setProperty('--font-body', fp.body)

  const rd = ROUNDNESS[t.roundness]
  r.setProperty('--r-card', rd.card)
  r.setProperty('--r-btn', rd.btn)
  r.setProperty('--r-tile', rd.tile)
}
