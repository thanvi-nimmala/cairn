export type SceneId =
  | 'welcome' | 'calibrate' | 'faceid'
  | 'home' | 'pay' | 'held' | 'activity' | 'txn' | 'security' | 'cards' | 'profile'

export interface Scene {
  id: SceneId
  label: string
  note: string
  group: 'Onboarding' | 'Core' | 'Flows'
}

export const SCENES: Scene[] = [
  { id: 'welcome',   label: 'Welcome',        note: 'the promise',            group: 'Onboarding' },
  { id: 'calibrate', label: 'Calibrating',    note: 'the stack is built',       group: 'Onboarding' },
  { id: 'faceid',    label: 'Face ID',        note: 'the key is you',         group: 'Onboarding' },

  { id: 'home',      label: 'Home',           note: 'balance + verdict strip', group: 'Core' },
  { id: 'activity',  label: 'Activity',       note: 'filterable ledger',      group: 'Core' },
  { id: 'security',  label: 'Security',       note: 'the stack answers',       group: 'Core' },
  { id: 'profile',   label: 'Profile',        note: 'personal / business',    group: 'Core' },

  { id: 'pay',       label: 'Send money',     note: '5-beat payment',         group: 'Flows' },
  { id: 'held',      label: 'Held payment',   note: 'signals + decision',  group: 'Flows' },
  { id: 'txn',       label: 'Transaction',    note: 'receipt + dispute',      group: 'Flows' },
  { id: 'cards',     label: 'Cards',          note: 'freeze + virtual',       group: 'Flows' },
]
