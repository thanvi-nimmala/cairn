# TruePay — frontend shell prototype

A navigable front-end shell of the TruePay concept — a payments app whose fraud model
shows its reasoning instead of asserting a verdict. Built out from the Claude Design
concept and expanded into its own visual language.

React 19 · TypeScript · Vite · Framer Motion · Canvas & SVG. No backend, no dependencies
beyond those — all data is mock, every flow is real front-end state.

```bash
npm install
npm run dev     # http://localhost:5183
```

## What it is

An 11-scene prototype of a payments app whose security model *is* the interface.
No backend — all data is mock, all flows are real front-end state.

The page is a **stage**, not just a device on a void:

- **left rail** — jump to any scene; `←` `→` step through, `R` replays onboarding, `F` triggers the fraud hold
- **centre** — the device, with an ambient field behind it
- **right panel** — live design controls (accent, type, corners, AI presence); every choice writes a CSS custom property, nothing downstream is hard-coded

## Autoplay — recording the demo reels

The bar at the bottom of the stage plays scripted walkthroughs hands-free. A synthetic
pointer moves to each control, taps it, and a caption narrates underneath the device —
so a screen recording reads as someone using the app.

| Reel | Length | What it shows |
|---|---|---|
| Hero walkthrough | 26s | onboarding → home → send → screened → approved |
| Held payment | 13s | risk radar → signals → your decision |
| Score you can move | 14s | protections off, the bloom frays, protections back on |
| Token system | 21s | accent, corners and AI presence changing live |
| Cards | 11s | virtual, business, freeze |
| Trust Bloom | 5s | count-up, loops — good as a section divider |
| Ambient field | 12s | calm → screening → held → cleared, loops |

**To record:** hit the red button on the left of the bar (or press `C`) to drop the rail
and panel and leave just the device. Start your screen capture, click a reel — the bar
fades out while it plays and comes back when it ends. `Esc` stops a reel early.

At a viewport ~945px tall the device renders at exactly 1:1 (390×844), so a retina
capture gives you clean 2× pixels with no resampling.

## What was added on top of the source concept

**Ambient trust field** (`components/Aurora.tsx`) — a low-res canvas of drifting
light blobs, upscaled and blurred, whose colour tracks security state: iris when
calm, cyan while the model screens a payment, red when something is held, lime on
success. It is the app's atmosphere and its status indicator at once.

**Trust Bloom** (`components/TrustBloom.tsx`) — replaces the stroke-dashoffset donut.
72 ticks radiating on a standing wave; lit ticks encode the score, and *agitation*
roughens the wave as protections come off. Toggle switches on the Security screen
and watch it fray.

**Risk radar** (`components/RiskRadar.tsx`) — the fraud review leads with the *shape*
of the suspicion, so the signal list beneath reads as explanation rather than output.
The decision buttons sit in a sticky footer so they are always reachable.

**Banknote line-work** (`components/Guilloche.tsx`) — real spirograph geometry, drawn
faintly under the balance and card faces. It is what makes the surfaces feel like money.

**Balance as an object** (`components/BalanceCard.tsx`) — tilts under the pointer,
catches a specular sweep that tracks the cursor.

**Editorial type** — Bricolage Grotesque for display, Instrument Serif *italic* for the
one word that carries the pitch, Manrope for body, JetBrains Mono for data. Acid lime
as the "verified" colour instead of generic green.

**New surfaces** — a calibration beat in onboarding, a filterable Activity ledger with
flow summary, a Cards screen (freeze, virtual merchant-locked cards, spend meters), and
a rolling security console.

## Case study

The written case study for this project lives on the portfolio site, not in this repo.
`case-study.html` here is an earlier standalone draft kept for reference.

## Structure

```
src/
  App.tsx              stage + scene routing + keyboard shortcuts
  lib/                 mock data, types, theme tokens
  components/          Aurora, TrustBloom, RiskRadar, Guilloche, BalanceCard,
                       FaceScan, PhoneFrame, TabBar, Icon, ui primitives
  screens/             Onboarding, Home, Activity, Security, Profile,
                       Cards, PayFlow, FraudReview, TxnDetail
  stage/               SceneRail, TokensPanel, scene manifest
```
