import type { CSSProperties, JSX } from 'react'

interface Props {
  name: string
  size?: number
  stroke?: number
  style?: CSSProperties
  className?: string
}

/** 24×24 stroke icon set, currentColor. */
export function Icon({ name, size = 24, stroke = 1.9, style, className }: Props) {
  const p = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  const paths: Record<string, JSX.Element> = {
    home:     <><path {...p} d="M3 10.5 12 3l9 7.5" /><path {...p} d="M5 9.5V20h14V9.5" /></>,
    activity: <path {...p} d="M3 12h3.5l2-6 4 14 2.8-8H21" />,
    shield:   <path {...p} d="M12 3l7 2.5v5c0 5-3.2 8.5-7 10-3.8-1.5-7-5-7-10v-5L12 3z" />,
    user:     <><circle {...p} cx="12" cy="8.5" r="3.7" /><path {...p} d="M5 20c1-3.6 4-5 7-5s6 1.4 7 5" /></>,
    send:     <><path {...p} d="M21 4 3 11l7 2.5L12.5 21 21 4z" /><path {...p} d="M10 14 21 4" /></>,
    request:  <><path {...p} d="M12 4v13" /><path {...p} d="m6 11 6 6 6-6" /><path {...p} d="M5 20h14" /></>,
    scan:     <><path {...p} d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" /><path {...p} d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" /><path {...p} d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" /><path {...p} d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><path {...p} d="M4 12h16" /></>,
    card:     <><rect {...p} x="3" y="5.5" width="18" height="13" rx="2.6" /><path {...p} d="M3 9.5h18" /><path {...p} d="M6.5 14.5h4" /></>,
    bell:     <><path {...p} d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6.5 2 7H4c.5-.5 2-2 2-7z" /><path {...p} d="M9.5 20a2.5 2.5 0 0 0 5 0" /></>,
    lock:     <><rect {...p} x="5" y="10.5" width="14" height="9.5" rx="2.4" /><path {...p} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
    faceid:   <><path {...p} d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><path {...p} d="M9 9.5v1M15 9.5v1M12 9.5v3l-1 1" /><path {...p} d="M9.2 15c.8.9 1.8 1.3 2.8 1.3s2-.4 2.8-1.3" /></>,
    check:    <path {...p} d="m5 12.5 4.5 4.5L19 6.5" />,
    alert:    <><path {...p} d="M12 4 2.5 20.5h19L12 4z" /><path {...p} d="M12 10v4.5" /><circle cx="12" cy="17.6" r="0.9" fill="currentColor" stroke="none" /></>,
    x:        <path {...p} d="M6 6l12 12M18 6 6 18" />,
    chevR:    <path {...p} d="m9 5 7 7-7 7" />,
    chevL:    <path {...p} d="m15 5-7 7 7 7" />,
    chevD:    <path {...p} d="m5 9 7 7 7-7" />,
    eye:      <><path {...p} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle {...p} cx="12" cy="12" r="3" /></>,
    eyeOff:   <><path {...p} d="M4 4.5 20 19.5" /><path {...p} d="M9.6 6.1A9.6 9.6 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3.2 3.9" /><path {...p} d="M6.4 8.2A17.5 17.5 0 0 0 2.5 12S6 18.2 12 18.2c1.2 0 2.3-.2 3.3-.6" /><path {...p} d="M10.3 10.4a2.9 2.9 0 0 0 3.9 4" /></>,
    plus:     <path {...p} d="M12 5v14M5 12h14" />,
    search:   <><circle {...p} cx="11" cy="11" r="6.5" /><path {...p} d="m20 20-3.8-3.8" /></>,
    bolt:     <path {...p} d="M13 3 5 13.5h6L11 21l8-10.5h-6L13 3z" />,
    sparkle:  <><path {...p} d="M12 3.5c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6z" /><path {...p} d="M18.5 14.5c.3 1.6 1 2.3 2.5 2.6-1.5.3-2.2 1-2.5 2.6-.3-1.6-1-2.3-2.5-2.6 1.5-.3 2.2-1 2.5-2.6z" /></>,
    arrowUR:  <><path {...p} d="M7 17 17 7" /><path {...p} d="M8 7h9v9" /></>,
    arrowDL:  <><path {...p} d="M17 7 7 17" /><path {...p} d="M16 17H7V8" /></>,
    dots:     <><circle cx="5" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="19" cy="12" r="1.6" fill="currentColor" /></>,
    snow:     <><path {...p} d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" /><path {...p} d="M12 6.2 10 4.5M12 6.2 14 4.5M12 17.8l-2 1.7M12 17.8l2 1.7" /></>,
    receipt:  <><path {...p} d="M6 3h12v18l-2.2-1.5L13.6 21 12 19.5 10.4 21 8.2 19.5 6 21V3z" /><path {...p} d="M9 8h6M9 12h6" /></>,
    clock:    <><circle {...p} cx="12" cy="12" r="8" /><path {...p} d="M12 7.5V12l3 2" /></>,
    pin:      <><path {...p} d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle {...p} cx="12" cy="10" r="2.5" /></>,
    settings: <><circle {...p} cx="12" cy="12" r="3" /><path {...p} d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3" /></>,
    building: <><rect {...p} x="5" y="3.5" width="14" height="17" rx="1.5" /><path {...p} d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M10 20.5v-3h4v3" /></>,
    globe:    <><circle {...p} cx="12" cy="12" r="8" /><path {...p} d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16" /></>,
    logout:   <><path {...p} d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" /><path {...p} d="M10 12h10M17 9l3 3-3 3" /></>,
    layers:   <><path {...p} d="m12 3 9 5-9 5-9-5 9-5z" /><path {...p} d="m3 13 9 5 9-5" /></>,
    play:     <path {...p} d="M7 4.5 19 12 7 19.5v-15z" />,
    grid:     <><rect {...p} x="4" y="4" width="7" height="7" rx="2" /><rect {...p} x="13" y="4" width="7" height="7" rx="2" /><rect {...p} x="4" y="13" width="7" height="7" rx="2" /><rect {...p} x="13" y="13" width="7" height="7" rx="2" /></>,
    copy:     <><rect {...p} x="9" y="9" width="11" height="11" rx="2.4" /><path {...p} d="M15 6.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ display: 'block', flexShrink: 0, ...style }}>
      {paths[name] ?? null}
    </svg>
  )
}
