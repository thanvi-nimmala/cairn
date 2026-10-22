import type { Contact, MonitorEvent, PayCard, Protection, Txn } from './types'

export const USER = {
  name: 'Elena Marsh',
  first: 'Elena',
  handle: '@elenam',
  initials: 'EM',
  balance: 8642.18,
  accountType: 'Keystone Secure · Personal',
  card: '•••• 4827',
  score: 96,
  hue: 152,
}

export const BUSINESS = { name: 'Marsh & Co.', type: 'Business account' }

export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Dad',             handle: '@rajeshn',  initials: 'D',  hue: 152, verified: true,  known: '5 yrs' },
  { id: 'c2', name: 'Ravi M.',         handle: '@ravim',    initials: 'RM', hue: 152, verified: true,  known: '3 yrs' },
  { id: 'c3', name: 'Hannah — rent',   handle: '@hannahq',  initials: 'H',  hue: 148, verified: true,  known: '2 yrs' },
  { id: 'c4', name: 'Nadia K.',        handle: '@nadiak',   initials: 'NK', hue: 96,  verified: true,  known: '8 mo' },
  { id: 'c5', name: 'SQ *SIDECAR',     handle: '@sidecar',  initials: 'SC', hue: 38,  verified: false, known: 'new', biz: true },
]

export const ACTIVITY: Txn[] = [
  {
    id: 't1', kind: 'out', party: 'SQ *SIDECAR DOUGHNUTS', handle: '@sidecar', initials: 'SC', hue: 38,
    amount: 18.4, when: 'Today · 9:24 AM', cat: 'Dining', method: 'Keystone •••• 4827',
    risk: 'safe', note: 'Morning order', biz: true,
  },
  {
    id: 't2', kind: 'flagged', party: 'DNH*LUMOSTORE LTD', handle: '@lumostore', initials: 'LS', hue: 16,
    amount: 482, when: 'Today · 8:51 AM', cat: 'Online purchase', method: 'Keystone •••• 4827',
    risk: 'high', note: 'Held by Keystone',
    factors: [
      { label: 'Unknown merchant',   detail: "First payment to this account, ever",     level: 'high', weight: 0.94 },
      { label: 'Unusual amount',     detail: '6.2× your typical online purchase',        level: 'high', weight: 0.86 },
      { label: 'Distant origin',     detail: 'Request originated in Lisbon, PT',         level: 'med',  weight: 0.62 },
      { label: 'Off-pattern timing', detail: 'Outside your normal activity window',      level: 'low',  weight: 0.34 },
      { label: 'Device match',       detail: 'Your iPhone — this part checks out',       level: 'low',  weight: 0.12 },
    ],
  },
  {
    id: 't3', kind: 'in', party: 'Ravi M.', handle: '@ravim', initials: 'RM', hue: 152,
    amount: 120, when: 'Yesterday · 6:12 PM', cat: 'Transfer', method: 'Keystone balance',
    risk: 'safe', note: 'Dinner split',
  },
  {
    id: 't4', kind: 'out', party: 'Metro Transit', handle: '@metro', initials: 'MT', hue: 152,
    amount: 2.75, when: 'Yesterday · 8:03 AM', cat: 'Transport', method: 'Keystone •••• 4827',
    risk: 'safe', note: 'Tap to ride', biz: true,
  },
  {
    id: 't5', kind: 'in', party: 'Marsh & Co.', handle: '@marshco', initials: 'MC', hue: 152,
    amount: 1450, when: 'Mon · 11:30 AM', cat: 'Invoice', method: 'Business payout',
    risk: 'safe', note: 'Invoice #2041 paid', biz: true,
  },
  {
    id: 't6', kind: 'out', party: 'Nadia K.', handle: '@nadiak', initials: 'NK', hue: 152,
    amount: 45, when: 'Sun · 2:18 PM', cat: 'Transfer', method: 'Keystone balance',
    risk: 'safe', note: 'Concert tickets',
  },
  {
    id: 't7', kind: 'out', party: 'Nimbus Cloud', handle: '@nimbus', initials: 'NC', hue: 190,
    amount: 24, when: 'Sun · 6:00 AM', cat: 'Subscription', method: 'Virtual •••• 9931',
    risk: 'med', note: 'Renews monthly — watched', biz: true,
  },
]

export const PROTECTIONS: Protection[] = [
  { id: 'bio',    icon: 'faceid',   label: 'Biometric approval',     detail: 'Face ID required for payments',   on: true,  weight: 26 },
  { id: 'enc',    icon: 'lock',     label: 'Multi-layer encryption', detail: 'Tokenized · keys rotated 4h ago', on: true,  weight: 24, locked: true },
  { id: 'mon',    icon: 'activity', label: 'Real-time monitoring',   detail: 'AI watching 24/7',                on: true,  weight: 22 },
  { id: 'alerts', icon: 'bell',     label: 'Instant alerts',         detail: 'Every login & transaction',       on: true,  weight: 14 },
  { id: 'vault',  icon: 'snow',     label: 'Auto-freeze on anomaly', detail: 'Card locks itself when unsure',   on: true,  weight: 10 },
  { id: 'travel', icon: 'globe',    label: 'Travel mode',            detail: 'Relax location checks abroad',    on: false, weight: 4 },
]

export const MONITORING: MonitorEvent[] = [
  { id: 'm1', icon: 'shield',   tone: 'warn',  title: 'AI flagged a transaction',   detail: 'DNH*LUMOSTORE LTD · $482.00 held for review', when: '8:51 AM' },
  { id: 'm2', icon: 'faceid',   tone: 'safe',  title: 'Face ID approved a payment', detail: 'SQ *SIDECAR DOUGHNUTS · $18.40',                      when: '9:24 AM' },
  { id: 'm3', icon: 'lock',     tone: 'safe',  title: 'Encryption keys rotated',    detail: 'Automatic 4-hour cycle completed',           when: '7:00 AM' },
  { id: 'm4', icon: 'user',     tone: 'safe',  title: 'New sign-in verified',       detail: 'iPhone 16 Pro · this device',                when: 'Yesterday' },
  { id: 'm5', icon: 'pin',      tone: 'safe',  title: 'Location confirmed',         detail: 'Brooklyn, NY — matches your pattern',        when: 'Yesterday' },
]

export const CARDS: PayCard[] = [
  { id: 'k1', label: 'Keystone Secure',  kind: 'physical', last4: '4827', expiry: '09/29', frozen: false, spent: 1284.5, limit: 4000, hue: 152 },
  { id: 'k2', label: 'Subscriptions',   kind: 'virtual',  last4: '9931', expiry: '02/28', frozen: false, spent: 96,     limit: 250,  hue: 128 },
  { id: 'k3', label: 'Marsh & Co.',  kind: 'business', last4: '5510', expiry: '11/30', frozen: true,  spent: 3120,   limit: 9000, hue: 96 },
]

/** live ticker lines for the security console */
export const CONSOLE_LINES = [
  'tls handshake · pinned cert ok',
  'device attestation · secure enclave',
  'behaviour model v42 · drift 0.3%',
  'token vault · rotate in 03:41:12',
  'graph scan · 214 edges clean',
  'geo fence · brooklyn, ny confirmed',
]

export const fmtMoney = (n: number, opts: { sign?: boolean } = {}) => {
  const sign = opts.sign ? (n >= 0 ? '+' : '−') : ''
  const v = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${sign}$${v}`
}

export const fmtCompact = (n: number) =>
  `$${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
