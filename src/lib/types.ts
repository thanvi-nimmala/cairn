export type Risk = 'safe' | 'med' | 'high'
export type Tone = 'safe' | 'warn' | 'danger'

export interface Contact {
  id: string
  name: string
  handle: string
  initials: string
  hue: number
  verified: boolean
  biz?: boolean
  /** how long Keystone has known this account — feeds the trust readout */
  known?: string
}

export interface RiskFactor {
  label: string
  detail: string
  level: 'high' | 'med' | 'low'
  /** 0–1, drives the radar geometry */
  weight: number
}

export interface Txn {
  id: string
  kind: 'in' | 'out' | 'flagged'
  party: string
  handle: string
  initials: string
  hue: number
  amount: number
  when: string
  cat: string
  method: string
  risk: Risk
  note?: string
  biz?: boolean
  factors?: RiskFactor[]
}

export interface Protection {
  id: string
  icon: string
  label: string
  detail: string
  on: boolean
  weight: number
  locked?: boolean
}

export interface MonitorEvent {
  id: string
  icon: string
  tone: Tone
  title: string
  detail: string
  when: string
}

export interface PayCard {
  id: string
  label: string
  kind: 'physical' | 'virtual' | 'business'
  last4: string
  expiry: string
  frozen: boolean
  spent: number
  limit: number
  hue: number
}
