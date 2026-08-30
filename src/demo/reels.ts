import type { Mood } from '../components/Aurora'
import type { Theme } from '../lib/theme'
import type { SceneId } from '../stage/scenes'

export interface DemoCtx {
  goto: (id: SceneId) => void
  set: <K extends keyof Theme>(k: K, v: Theme[K]) => void
  setMood: (m: Mood) => void
}

export interface Step {
  /** caption shown under the device while this step runs */
  caption?: string
  /** value of a data-demo attribute to move the pointer to and click */
  target?: string
  /** drive app state directly, where a click would land on stage chrome */
  act?: (c: DemoCtx) => void
  /** ms to hold after the step fires */
  hold?: number
}

export interface Reel {
  id: string
  label: string
  seconds: number
  note: string
  loop?: boolean
  steps: Step[]
}

export const REELS: Reel[] = [
  {
    id: 'hero',
    label: 'Hero walkthrough',
    seconds: 26,
    note: 'onboarding → home → send → screened → approved',
    steps: [
      { act: (c) => c.goto('welcome'), caption: 'Payments that read themselves', hold: 2600 },
      { target: 'welcome-cta', caption: 'Create a secure account', hold: 500 },
      { caption: 'One-time setup — nothing leaves the device', hold: 4200 },
      { caption: 'Your face becomes the key', hold: 1100 },
      { target: 'faceid-enable', hold: 3100 },
      { caption: 'Balance, verdict strip, one held payment', hold: 2400 },
      { target: 'fab-pay', caption: 'Send money', hold: 1000 },
      { target: 'contact-c1', caption: 'A recipient the model already knows', hold: 1100 },
      { target: 'key-4', hold: 280 },
      { target: 'key-5', hold: 800 },
      { target: 'pay-review', caption: 'Four checks before the money moves', hold: 3700 },
      { caption: 'Approve with Face ID', hold: 800 },
      { target: 'pay-approve', hold: 2700 },
      { caption: 'Sent — and verified on the way out', hold: 2300 },
      { target: 'pay-done', hold: 1400 },
    ],
  },
  {
    id: 'fraud',
    label: 'Held payment',
    seconds: 13,
    note: 'risk radar → signals → your decision',
    steps: [
      { act: (c) => c.goto('home'), caption: 'Something was held this morning', hold: 1800 },
      { target: 'held-banner', hold: 1300 },
      { caption: 'The shape of the suspicion, before the list', hold: 2600 },
      { caption: 'Five signals, strongest first', hold: 2600 },
      { target: 'fraud-approve', caption: 'The decision stays with you', hold: 2500 },
      { caption: 'Released — and folded into what it trusts', hold: 2200 },
      { target: 'fraud-done', hold: 1200 },
    ],
  },
  {
    id: 'security',
    label: 'Score you can move',
    seconds: 14,
    note: 'protections off — the bloom frays',
    steps: [
      { act: (c) => c.goto('security'), caption: 'Trust score, computed live', hold: 2800 },
      { target: 'prot-travel', caption: 'Travel mode on · +4', hold: 1300 },
      { target: 'prot-alerts', caption: 'Alerts off · −14', hold: 1500 },
      { target: 'prot-mon', caption: 'Monitoring off · the wave roughens', hold: 1900 },
      { target: 'prot-bio', caption: 'Biometrics off · exposed', hold: 2400 },
      { target: 'prot-bio', caption: 'Arm them again', hold: 1000 },
      { target: 'prot-mon', hold: 1000 },
      { target: 'prot-alerts', caption: 'Protected · monitoring', hold: 1800 },
    ],
  },
  {
    id: 'theme',
    label: 'Token system',
    seconds: 21,
    note: 'accent · corners · AI presence, all live',
    steps: [
      { act: (c) => c.goto('home'), caption: '--accent: iris', hold: 1700 },
      { act: (c) => c.set('accent', '#B14BE8'), caption: '--accent: orchid', hold: 1400 },
      { act: (c) => c.set('accent', '#3D7BFF'), caption: '--accent: signal', hold: 1400 },
      { act: (c) => c.set('accent', '#22D3C5'), caption: '--accent: vapor', hold: 1400 },
      { act: (c) => c.set('accent', '#FF7A45'), caption: '--accent: ember', hold: 1400 },
      { act: (c) => c.set('accent', '#8A5CFF'), caption: 'companion stops derive by hue rotation', hold: 1700 },
      { act: (c) => c.set('roundness', 'Sharp'), caption: '--r-card: 10px', hold: 1300 },
      { act: (c) => c.set('roundness', 'Pillowy'), caption: '--r-card: 30px', hold: 1300 },
      { act: (c) => c.set('roundness', 'Rounded'), caption: '--r-card: 22px', hold: 1400 },
      { act: (c) => c.set('aiLevel', 'subtle'), caption: 'AI presence: subtle', hold: 1900 },
      { act: (c) => c.set('aiLevel', 'present'), caption: 'AI presence: present', hold: 1900 },
      { act: (c) => c.set('aiLevel', 'front'), caption: 'AI presence: front', hold: 2300 },
      { act: (c) => c.set('aiLevel', 'present'), hold: 700 },
    ],
  },
  {
    id: 'cards',
    label: 'Cards',
    seconds: 11,
    note: 'virtual, business, freeze',
    steps: [
      { act: (c) => c.goto('cards'), caption: 'Three cards, one account', hold: 1900 },
      { target: 'card-k2', caption: 'Virtual — locked to one merchant', hold: 1900 },
      { target: 'card-k3', caption: 'Business — already frozen', hold: 1900 },
      { target: 'card-k1', hold: 1300 },
      { target: 'card-freeze', caption: 'Freeze blocks every new charge', hold: 2300 },
      { target: 'card-freeze', caption: 'And back', hold: 1600 },
    ],
  },
  {
    id: 'bloom',
    label: 'Trust Bloom',
    seconds: 5,
    note: 'count-up loop, good as a divider',
    loop: true,
    steps: [
      { act: (c) => c.goto('profile'), hold: 320 },
      { act: (c) => c.goto('security'), caption: '72 ticks on a standing wave', hold: 4300 },
    ],
  },
  {
    id: 'moods',
    label: 'Ambient field',
    seconds: 12,
    note: 'calm · screening · held · cleared',
    loop: true,
    steps: [
      { act: (c) => { c.goto('home'); c.setMood('calm') }, caption: 'calm', hold: 2700 },
      { act: (c) => c.setMood('scan'), caption: 'screening', hold: 2700 },
      { act: (c) => c.setMood('alert'), caption: 'held', hold: 2700 },
      { act: (c) => c.setMood('success'), caption: 'cleared', hold: 2700 },
      { act: (c) => c.setMood('calm'), hold: 900 },
    ],
  },
]
