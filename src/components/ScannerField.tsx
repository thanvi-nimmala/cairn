import { motion } from 'framer-motion'
import { spin } from '../lib/motion'
import type { ReactNode } from 'react'

const CX = 195, CY = 400, R = 150, TICKS = 84

/**
 * The instrument the payment is read inside: sage at the edges falling to
 * near-black at the centre, with a ticked scale turning around the subject.
 * Inverted from the rest of the app on purpose — screening is the one moment
 * the product is doing something *to* the payment.
 *
 * The rings are drawn circular and then scaled on Y, so rotation stays uniform
 * inside a tilted disc instead of racing at the poles.
 */
export function ScannerField({
  children, spinning = true, label, caption,
}: { children?: ReactNode; spinning?: boolean; label?: string; caption?: string }) {
  const ang = (i: number) => (i / TICKS) * Math.PI * 2 - Math.PI / 2

  /* the resting scale */
  const baseTick = (i: number) => {
    const t = ang(i)
    const len = i % 7 === 0 ? 13 : 8.5
    return (
      <line
        key={i}
        x1={Math.cos(t) * R} y1={Math.sin(t) * R}
        x2={Math.cos(t) * (R + len)} y2={Math.sin(t) * (R + len)}
        stroke="var(--scan-tick)" strokeWidth={1.4}
      />
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--scan-rim)' }}>
      <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="sf-core" cx="50%" cy="47.4%" r="58%">
            <stop offset="0%"   stopColor="var(--scan-core)" />
            <stop offset="48%"  stopColor="var(--scan-core)" stopOpacity="0.96" />
            <stop offset="100%" stopColor="var(--scan-core)" stopOpacity="0" />
          </radialGradient>
          <filter id="sf-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
        </defs>

        <rect width="390" height="844" fill="url(#sf-core)" />

        <g transform={`translate(${CX},${CY}) scale(1, 1.07)`}>
          {/* the dial turns — that is the motion. The two rings run against
              each other so the relative movement is readable without anything
              travelling around the rim. */}
          <motion.g animate={spinning ? { rotate: 360 } : {}} transition={spin(30)}>
            {Array.from({ length: TICKS }, (_, i) => baseTick(i))}
          </motion.g>

          <motion.ellipse
            rx={R * 0.7} ry={R * 0.7} fill="none"
            stroke="var(--scan-tick)" strokeOpacity={0.42} strokeWidth={1} strokeDasharray="1 7"
            animate={spinning ? { rotate: -360 } : {}} transition={spin(19)}
          />
        </g>

        {/* leader lines — they point at the subject, they are not decoration */}
        <g stroke="rgba(255,255,255,0.32)" strokeWidth={1} strokeDasharray="2 5">
          <line x1="46" y1="372" x2="132" y2="372" />
          <line x1="258" y1="424" x2="344" y2="424" />
        </g>
        <g
          fill="rgba(255,255,255,0.75)" fontFamily="var(--font-mono)"
          fontSize="8.5" fontWeight="600" letterSpacing="1.2"
        >
          <text x="46" y="365">RECIPIENT</text>
          <text x="344" y="417" textAnchor="end">AMOUNT</text>
        </g>

        <rect width="390" height="844" filter="url(#sf-grain)" opacity="0.07" style={{ mixBlendMode: 'overlay' }} />
      </svg>

      {label && (
        <div style={{ position: 'absolute', top: 88, left: 0, right: 0, textAlign: 'center', padding: '0 26px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 19, color: 'rgba(255,255,255,0.94)', letterSpacing: '-0.02em' }}>
            {label}
          </div>
          {caption && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 5 }}>
              {caption}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
