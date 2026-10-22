import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { PHONE_H, PHONE_W, PhoneFrame } from './components/PhoneFrame'
import { TabBar, type Tab } from './components/TabBar'
import type { Mood } from './components/Aurora'

import { Biometric, Calibrate, Welcome } from './screens/Onboarding'
import { Home } from './screens/Home'
import { Activity } from './screens/Activity'
import { Security } from './screens/Security'
import { Profile } from './screens/Profile'
import { Cards } from './screens/Cards'
import { PayFlow } from './screens/PayFlow'
import { FraudReview } from './screens/FraudReview'
import { TxnDetail } from './screens/TxnDetail'

import { DemoBar } from './stage/DemoBar'
import { DemoCursor } from './demo/DemoCursor'
import { useDemoRunner } from './demo/useDemoRunner'
import { SceneRail } from './stage/SceneRail'
import { TokensPanel } from './stage/TokensPanel'
import { SCENES, type SceneId } from './stage/scenes'

import { ACTIVITY } from './lib/data'
import { DEFAULT_THEME, applyTheme, type Theme, SCHEMES } from './lib/theme'
import type { Txn } from './lib/types'

type Phase = 'onboarding' | 'app'
type Overlay = { type: 'pay' } | { type: 'fraud' } | { type: 'cards' } | { type: 'txn'; txn: Txn } | null

/** ?shot=<scene> renders one screen alone at 390x844 for still capture */
const SHOT = new URLSearchParams(location.search).get('shot')
/** ?scheme=<name> overrides the palette, so a colour study is a URL not a rebuild */
const SCHEME = new URLSearchParams(location.search).get('scheme')
/** ?device=<scene> renders the phone alone on transparency, for reels and
    stills that sit on the portfolio page without a rectangle behind them */
const DEVICE = new URLSearchParams(location.search).get('device')
/** ?reel=<id> plays one reel on the cut-out device, for headless recording.
    The stage, the rail and the demo bar stay out of the frame entirely. */
const REEL = new URLSearchParams(location.search).get('reel')
if (SHOT) document.documentElement.dataset.still = ''
if (DEVICE || REEL) document.documentElement.dataset.cutout = ''

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const picked = SCHEME && SCHEMES.find((s) => s.name.toLowerCase() === SCHEME.toLowerCase())
    return picked ? { ...DEFAULT_THEME, accent: picked.accent } : DEFAULT_THEME
  })
  const [phase, setPhase] = useState<Phase>('onboarding')
  const [onbStep, setOnbStep] = useState(0)
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [mood, setMood] = useState<Mood>('calm')
  const [balanceHidden, setBalanceHidden] = useState(false)
  const [mode, setMode] = useState<'personal' | 'business'>('personal')
  const [recording, setRecording] = useState(false)

  const set = useCallback(<K extends keyof Theme>(k: K, v: Theme[K]) => setTheme((t) => ({ ...t, [k]: v })), [])

  /* the device has a fixed 390×844 layout box — scale it to whatever room the
     stage column actually has, rather than guessing with breakpoints */
  const stageRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const main = mainRef.current
    const stage = stageRef.current
    if (!main || !stage) return
    const fit = () => {
      const { width, height } = main.getBoundingClientRect()
      const s = Math.min((width - 24) / PHONE_W, (height - 96) / PHONE_H, 1)
      stage.style.setProperty('--phone-scale', String(Math.max(0.4, s)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(main)
    return () => ro.disconnect()
  }, [])
  useEffect(() => { applyTheme(theme) }, [theme])

  /* the ambient field tracks whatever is on screen */
  useEffect(() => {
    if (overlay?.type === 'fraud') setMood('alert')
    else if (mood === 'alert') setMood('calm')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlay])

  /* ── scene ↔ state mapping ──────────────────────────────── */
  const scene: SceneId = useMemo(() => {
    if (phase === 'onboarding') return (['welcome', 'calibrate', 'faceid'] as const)[onbStep] ?? 'welcome'
    if (overlay?.type === 'pay') return 'pay'
    if (overlay?.type === 'fraud') return 'held'
    if (overlay?.type === 'cards') return 'cards'
    if (overlay?.type === 'txn') return 'txn'
    return tab as SceneId
  }, [phase, onbStep, overlay, tab])

  const goto = useCallback((id: SceneId) => {
    // jumping scenes resets the ambient field; the flows re-colour it themselves
    setMood(id === 'held' ? 'alert' : 'calm')
    switch (id) {
      case 'welcome':   setPhase('onboarding'); setOnbStep(0); setOverlay(null); break
      case 'calibrate': setPhase('onboarding'); setOnbStep(1); setOverlay(null); break
      case 'faceid':    setPhase('onboarding'); setOnbStep(2); setOverlay(null); break
      case 'pay':       setPhase('app'); setOverlay({ type: 'pay' }); break
      case 'held':      setPhase('app'); setOverlay({ type: 'fraud' }); break
      case 'cards':     setPhase('app'); setOverlay({ type: 'cards' }); break
      case 'txn':       setPhase('app'); setOverlay({ type: 'txn', txn: ACTIVITY[2] }); break
      default:          setPhase('app'); setOverlay(null); setTab(id as Tab); break
    }
  }, [])

  /* ── autoplay reels ─────────────────────────────────────── */
  const demo = useDemoRunner({ goto: (id) => goto(id), set, setMood })

  /* ?reel= starts one reel and tells the recorder when it is finished, so a
     capture runs to the reel's own length instead of a guessed duration.
     Held in a ref and fired once: `demo` is a fresh object every render, so
     depending on it made the effect's own cleanup cancel its timers. */
  const demoRef = useRef(demo)
  demoRef.current = demo
  useEffect(() => {
    if (!REEL) return
    const d = demoRef.current
    const r = d.reels.find((x) => x.id === REEL)
    if (!r) return
    const t = window.setTimeout(() => demoRef.current.play(REEL), 500)
    const done = window.setTimeout(() => {
      ;(window as unknown as { __reelDone?: boolean }).__reelDone = true
    }, 500 + r.seconds * 1000 + 1200)
    return () => { clearTimeout(t); clearTimeout(done) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── keyboard shortcuts ─────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.toLowerCase() === 'c') { setRecording((v) => !v); return }
      if (e.key === 'Escape' && demo.activeId) { demo.stop(); return }
      if (demo.activeId) return   // a reel is driving; keep hands off
      const i = SCENES.findIndex((s) => s.id === scene)
      if (e.key === 'ArrowRight') goto(SCENES[(i + 1) % SCENES.length].id)
      else if (e.key === 'ArrowLeft') goto(SCENES[(i - 1 + SCENES.length) % SCENES.length].id)
      else if (e.key.toLowerCase() === 'r') goto('welcome')
      else if (e.key.toLowerCase() === 'f') goto('held')
      else if (e.key === 'Escape') setOverlay(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scene, goto, demo])

  /* ── phone contents ─────────────────────────────────────── */
  let body: React.ReactNode
  if (phase === 'onboarding') {
    body =
      onbStep === 0 ? <Welcome onNext={() => setOnbStep(1)} />
      : onbStep === 1 ? <Calibrate onDone={() => setOnbStep(2)} />
      : <Biometric onDone={() => { setPhase('app'); setOnbStep(0) }} />
  } else {
    const screen =
      tab === 'home' ? (
        <Home
          aiLevel={theme.aiLevel}
          balanceHidden={balanceHidden}
          onToggleBalance={() => setBalanceHidden((v) => !v)}
          onScore={() => setTab('security')}
          onPay={() => setOverlay({ type: 'pay' })}
          onCards={() => setOverlay({ type: 'cards' })}
          onTxn={(t) => setOverlay({ type: 'txn', txn: t })}
          onFraud={() => setOverlay({ type: 'fraud' })}
        />
      ) : tab === 'activity' ? (
        <Activity onTxn={(t) => setOverlay({ type: 'txn', txn: t })} onFraud={() => setOverlay({ type: 'fraud' })} />
      ) : tab === 'security' ? (
        <Security onFraud={() => setOverlay({ type: 'fraud' })} />
      ) : (
        <Profile mode={mode} onMode={setMode} />
      )

    body = (
      <>
        <div key={tab} style={{ height: '100%' }}>{screen}</div>
        <TabBar tab={tab} setTab={setTab} onPay={() => setOverlay({ type: 'pay' })} />
      </>
    )
  }

  const activeScene = SCENES.find((s) => s.id === scene)

  if (SHOT || DEVICE) {
    const [name, variant] = (SHOT || DEVICE || '').split(':')
    const ai = (variant as typeof theme.aiLevel) || theme.aiLevel
    const shotMood: Mood = name === 'fraud' ? 'alert' : name === 'screening' ? 'scan' : name === 'success' ? 'success' : 'calm'
    const noop = () => {}
    const screens: Record<string, React.ReactNode> = {
      welcome:   <Welcome onNext={noop} />,
      calibrate: <Calibrate onDone={noop} />,
      faceid:    <Biometric onDone={noop} />,
      home:      <Home aiLevel={ai} balanceHidden={false} onToggleBalance={noop} onScore={noop} onPay={noop} onCards={noop} onTxn={noop} onFraud={noop} />,
      activity:  <Activity onTxn={noop} onFraud={noop} />,
      security:  <Security onFraud={noop} />,
      profile:   <Profile mode="personal" onMode={noop} />,
      cards:     <Cards onClose={noop} />,
      recipient: <PayFlow onClose={noop} onComplete={noop} onMood={noop} startAt="who" />,
      amount:    <PayFlow onClose={noop} onComplete={noop} onMood={noop} startAt="amount" startAmount="45" />,
      screening: <PayFlow onClose={noop} onComplete={noop} onMood={noop} startAt="screen" startAmount="45" />,
      confirm:   <PayFlow onClose={noop} onComplete={noop} onMood={noop} startAt="confirm" startAmount="45" />,
      success:   <PayFlow onClose={noop} onComplete={noop} onMood={noop} startAt="done" startAmount="45" />,
      fraud:     <FraudReview onMood={noop} onClose={noop} />,
      txn:       <TxnDetail txn={ACTIVITY[2]} onClose={noop} onFraud={noop} />,
    }
    const needsTabBar = ['home', 'activity', 'security', 'profile'].includes(name)
    const body = (
      <>
        {screens[name] ?? <Home aiLevel={ai} balanceHidden={false} onToggleBalance={noop} onScore={noop} onPay={noop} onCards={noop} onTxn={noop} onFraud={noop} />}
        {needsTabBar && <TabBar tab={(name as Tab)} setTab={noop} onPay={noop} />}
      </>
    )
    // ?device= keeps the bezel and drops everything behind it
    if (DEVICE && !REEL) {
      return (
        <div style={{ width: 390, height: 844 }}>
          <PhoneFrame cutout mood={shotMood}>{body}</PhoneFrame>
        </div>
      )
    }
    return (
      <div style={{ width: 390, height: 844, overflow: 'hidden' }}>
        <PhoneFrame bare mood={shotMood}>{body}</PhoneFrame>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* stage backdrop — dropped in reel mode so the device sits on nothing */}
      {!REEL && <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(1100px 620px at 50% 40%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 70%),' +
          'radial-gradient(900px 500px at 12% 90%, color-mix(in srgb, var(--accent-3) 9%, transparent), transparent 68%),' +
          'var(--ink-deep)',
      }} />}
      {!REEL && <div aria-hidden style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: 'radial-gradient(rgba(26, 29, 26, .055) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
        maskImage: 'radial-gradient(closest-side at 50% 45%, transparent 32%, black 90%)',
        WebkitMaskImage: 'radial-gradient(closest-side at 50% 45%, transparent 32%, black 90%)',
      }} />}
      {!REEL && <div className="grain" style={{ opacity: 0.2 }} />}

      <div
        ref={stageRef}
        className={`stage${recording || REEL ? ' recording' : ''}`}
        style={{ position: 'relative', height: '100%', display: 'flex' }}
      >
        <div className="rail"><SceneRail active={scene} onPick={goto} /></div>

        <main ref={mainRef} style={{
          flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 18, padding: '20px 12px',
        }}>
          {!recording && !REEL && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>
                {activeScene?.label}
              </div>
              <div className="mono-label" style={{ marginTop: 2 }}>{activeScene?.note}</div>
            </div>
          )}

          <div className="phone-wrap">
            <div className="phone-scaler">
            <PhoneFrame mood={mood} cutout={!!REEL}>
              {body}
              <AnimatePresence>
                {overlay?.type === 'pay' && (
                  <PayFlow key="pay" onMood={setMood}
                    onClose={() => { setOverlay(null); setMood('calm') }}
                    onComplete={() => { setOverlay(null); setTab('home'); setMood('calm') }} />
                )}
                {overlay?.type === 'fraud' && (
                  <FraudReview key="fraud" onMood={setMood} onClose={() => setOverlay(null)} />
                )}
                {overlay?.type === 'cards' && <Cards key="cards" onClose={() => setOverlay(null)} />}
                {overlay?.type === 'txn' && (
                  <TxnDetail key="txn" txn={overlay.txn}
                    onClose={() => setOverlay(null)}
                    onFraud={() => setOverlay({ type: 'fraud' })} />
                )}
              </AnimatePresence>
            </PhoneFrame>
            </div>
          </div>

          {/* reel narration — the one bit of chrome that survives record mode */}
          <div style={{
            height: 18, display: 'flex', alignItems: 'center',
            opacity: demo.caption ? 1 : 0, transition: 'opacity .3s',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.06em',
              color: 'var(--text-dim)', textAlign: 'center',
            }}>
              {demo.caption}
            </span>
          </div>
        </main>

        <div className="panel"><TokensPanel theme={theme} set={set} onReplay={() => goto('welcome')} onFraud={() => goto('held')} /></div>
      </div>

      <DemoBar
        reels={demo.reels}
        activeId={demo.activeId}
        progress={demo.progress}
        recording={recording}
        onPlay={demo.play}
        onStop={demo.stop}
        onToggleRecording={() => setRecording((v) => !v)}
      />
      <DemoCursor pos={demo.cursor} tapKey={demo.tapKey} />
    </div>
  )
}
