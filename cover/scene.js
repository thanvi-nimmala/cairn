/* TruePay portfolio card — a reenactment of one moment: a payment is screened,
   five signals weigh in, the verdict resolves to cleared.
   Deterministic: render(ctx, t) is pure, so frame capture and live playback agree. */

export const W = 520, H = 796, FPS = 30, DUR = 5.6;
export const TOTAL = Math.round(DUR * FPS);

/* resolved from the prototype's own custom properties at init — never hard-coded */
const C = {};
function px(css) {
  const c = document.createElement('canvas'); c.width = c.height = 1;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.clearRect(0, 0, 1, 1); g.fillStyle = css; g.fillRect(0, 0, 1, 1);
  const d = g.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2], d[3] / 255];
}
export function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  const v = n => cs.getPropertyValue(n).trim();
  C.ground = px(v('--ink'));
  C.line   = px(v('--line'));
  C.text   = px(v('--text'));
  C.dim    = px(v('--text-dim'));
  C.faint  = px(v('--text-faint'));
  C.iris   = px(v('--accent'));
  C.lime   = px(v('--safe'));
  C.deep   = px(v('--ink-deep'));
  C.bezA   = px('oklch(0.42 0.012 288)');
  C.bezB   = px('oklch(0.17 0.010 288)');
  C.bezC   = px('oklch(0.30 0.012 288)');
  F.display = v('--font-display');
  F.body    = v('--font-body');
  F.mono    = v('--font-mono');
}
/* the app's own stacks */
const F = { display: "'Bricolage Grotesque',sans-serif", body: "'Manrope',sans-serif", mono: "'JetBrains Mono',monospace" };

const CX = 260, CY = 420, R = 64, LR = 84;
/* the device: top in frame, body running off the bottom edge */
const DV = { x: 93, y: 38, w: 334, h: 722, r: 48 };
const SC = { x: 102, y: 47, w: 316, h: 703, r: 39 };

const SIGNALS = [
  { label: 'MERCHANT', v: 8,  a: -90 },
  { label: 'AMOUNT',   v: 12, a: -18 },
  { label: 'LOCATION', v: 6,  a:  54 },
  { label: 'TIMING',   v: 9,  a: 126 },
  { label: 'DEVICE',   v: 4,  a: 198 },
];

/* a low score still has to be visible, so radius floors at .18 of the armature */
const sigR = v => R * (0.18 + v * 0.017);
const rad  = d => d * Math.PI / 180;
const ptAt = (a, r) => [CX + Math.cos(rad(a)) * r, CY + Math.sin(rad(a)) * r];

const cl  = x => x < 0 ? 0 : x > 1 ? 1 : x;
const seg = (t, a, b) => cl((t - a) / (b - a));
const eo  = x => 1 - Math.pow(1 - x, 3);
const eop = x => 1 - Math.pow(1 - x, 5);

const mix = (a, b, m) => [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * m));
const rgba = (c, al) => `rgba(${c[0]},${c[1]},${c[2]},${(c[3] === undefined ? 1 : c[3]) * al})`;

function text(ctx, s, x, y, font, fill, align = 'center', track = 0) {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = track + 'px';
  ctx.fillText(s, x, y);
  ctx.letterSpacing = '0px';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* pastel tints of the app's own spectrum — iris, magenta, cyan — blurred soft */
const BLOBS = [
  { x:  70, y: 110, r: 330, c: '#CFC2FF' },
  { x: 470, y: 215, r: 300, c: '#EBD8F6' },
  { x: 110, y: 650, r: 345, c: '#D4E2FB' },
  { x: 440, y: 710, r: 320, c: '#DBCBFA' },
  { x: 260, y: 400, r: 250, c: '#F5F0FF' },
];

function drawBackdrop(ctx) {
  ctx.fillStyle = '#EFE9FC';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.filter = 'blur(70px)';
  for (const b of BLOBS) {
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    g.addColorStop(0, b.c);
    g.addColorStop(1, b.c + '00');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
  }
  ctx.restore();
}

function drawDevice(ctx) {
  drawBackdrop(ctx);

  /* the device casts onto the wash rather than glowing into the dark */
  ctx.save();
  ctx.shadowColor = 'rgba(74, 44, 142, 0.34)';
  ctx.shadowBlur = 58;
  ctx.shadowOffsetY = 22;

  /* the aluminium body */
  const g1 = ctx.createLinearGradient(DV.x, DV.y, DV.x + DV.w, DV.y + DV.w * 1.2);
  g1.addColorStop(0, rgba(C.bezA, 1));
  g1.addColorStop(0.42, rgba(C.bezB, 1));
  g1.addColorStop(1, rgba(C.bezC, 1));
  roundRect(ctx, DV.x, DV.y, DV.w, DV.h, DV.r);
  ctx.fillStyle = g1; ctx.fill();
  ctx.restore();
  roundRect(ctx, DV.x, DV.y, DV.w, DV.h, DV.r);
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1.4; ctx.stroke();
}

function statusBar(ctx) {
  const k = 0.76, y = SC.y + 34;
  text(ctx, '9:41', SC.x + 22, y, `600 14px ${F.body}`, rgba(C.text, 0.92), 'left', 0);
  const rx = SC.x + SC.w - 22;
  ctx.fillStyle = rgba(C.text, 0.92);
  for (let i = 0; i < 4; i++) ctx.fillRect(rx - (76 - i * 6.5) * k, y - (4 + i * 2.6) * k, 4.4 * k, (5 + i * 2.6) * k);
  ctx.beginPath(); ctx.arc(rx - 41 * k, y - 2.5 * k, 2.1 * k, 0, 7); ctx.fill();
  for (let i = 1; i <= 2; i++) {
    ctx.strokeStyle = rgba(C.text, 0.92); ctx.lineWidth = 2 * k;
    ctx.beginPath(); ctx.arc(rx - 41 * k, y - 2.5 * k, (3 + i * 3.4) * k, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke();
  }
  ctx.strokeStyle = rgba(C.text, 0.45); ctx.lineWidth = 1.2 * k;
  roundRect(ctx, rx - 26 * k, y - 12 * k, 25 * k, 12.5 * k, 3.6 * k); ctx.stroke();
  ctx.fillStyle = rgba(C.text, 0.92);
  roundRect(ctx, rx - 24.4 * k, y - 10.4 * k, 18 * k, 9.3 * k, 2.2 * k); ctx.fill();

  ctx.fillStyle = '#000';
  roundRect(ctx, CX - 40, SC.y + 9, 80, 23, 11.5); ctx.fill();

  /* the device is whole now, so it gets its home indicator back */
  ctx.fillStyle = rgba(C.text, 0.34);
  roundRect(ctx, CX - 50, SC.y + SC.h - 15, 100, 4.5, 2.25); ctx.fill();
}

export function render(ctx, t) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sc = ctx.canvas.width / W;
  ctx.scale(sc, sc);

  drawDevice(ctx);
  ctx.save();
  roundRect(ctx, SC.x, SC.y, SC.w, SC.h, SC.r);
  ctx.clip();
  ctx.fillStyle = rgba(C.ground, 1);
  ctx.fillRect(SC.x, SC.y, SC.w, SC.h);

  /* everything but the armature retires into the loop seam */
  const out = 1 - seg(t, 5.15, 5.53);
  const toLime = seg(t, 3.30, 3.60);

  /* ── the dial face: present at frame 0, never leaves ── */
  ctx.lineWidth = 1;
  for (const k of [0.33, 1.0]) {
    ctx.strokeStyle = rgba(C.line, 1);
    ctx.beginPath();
    SIGNALS.forEach((sg, i) => {
      const [x, y] = ptAt(sg.a, R * k);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }
  ctx.strokeStyle = rgba(C.line, 0.85);
  SIGNALS.forEach(sg => {
    const [x, y] = ptAt(sg.a, R);
    ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(x, y); ctx.stroke();
  });
  /* the threshold the silhouette has to stay inside */
  ctx.setLineDash([3, 5]);
  ctx.strokeStyle = rgba(C.iris, 0.32);
  ctx.beginPath();
  SIGNALS.forEach((sg, i) => {
    const [x, y] = ptAt(sg.a, R * 0.62);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.closePath(); ctx.stroke();
  ctx.setLineDash([]);

  /* ── beat 1 — a payment arrives ── */
  const aLab = seg(t, 0.10, 0.50) * (1 - seg(t, 3.45, 3.75)) * out;
  if (aLab > 0) text(ctx, 'SCREENING', 126, 130, `500 14px ${F.mono}`, rgba(C.faint, aLab), 'left', 1.3);

  const pAmt = eo(seg(t, 0.00, 0.70));
  if (pAmt > 0) text(ctx, '$45.00', CX, 206 + (1 - pAmt) * 12, `700 44px ${F.display}`, rgba(C.text, pAmt * out));
  const pTo = eo(seg(t, 0.15, 0.85));
  if (pTo > 0) text(ctx, 'to Daniel Reyes', CX, 232 + (1 - pTo) * 8, `500 14px ${F.body}`, rgba(C.dim, pTo * out));

  /* the scan itself */
  const sw = seg(t, 0.35, 1.15);
  if (sw > 0 && sw < 1) {
    const y = 350 + sw * 140, a = Math.sin(Math.PI * sw) * 0.9 * out;
    const g = ctx.createLinearGradient(CX - R - 50, 0, CX + R + 50, 0);
    g.addColorStop(0, rgba(C.iris, 0)); g.addColorStop(0.5, rgba(C.iris, a)); g.addColorStop(1, rgba(C.iris, 0));
    ctx.fillStyle = g; ctx.fillRect(CX - R - 50, y, (R + 50) * 2, 1.4);
  }

  /* ── beat 2 — five signals weigh in ── */
  const dotCol = mix(C.iris, C.lime, toLime);
  const pts = [];
  SIGNALS.forEach((sg, i) => {
    const p = eop(seg(t, 1.35 + i * 0.18, 1.68 + i * 0.18));
    const [x, y] = ptAt(sg.a, sigR(sg.v));
    pts.push([x, y, p]);
    if (p <= 0) return;
    ctx.fillStyle = rgba(dotCol, p * out);
    ctx.beginPath(); ctx.arc(x, y, 3.4 * (0.6 + 0.4 * p), 0, 7); ctx.fill();

    const labAl = p * out * (1 - seg(t, 3.25, 3.60) * 0.45);
    if (labAl > 0.004) {
      const [lx, ly] = ptAt(sg.a, LR);
      const right = Math.cos(rad(sg.a)) > 0.15, left = Math.cos(rad(sg.a)) < -0.15;
      const al = right ? 'left' : left ? 'right' : 'center';
      /* name, then its weight underneath — the weight carries the verdict's colour */
      text(ctx, sg.label, lx, ly - 2, `500 14px ${F.mono}`, rgba(C.faint, labAl * 1.2), al, 0.9);
      text(ctx, String(sg.v), lx, ly + 15, `500 14px ${F.mono}`, rgba(dotCol, labAl * 0.9), al, 0.9);
    }
  });

  /* the silhouette draws itself */
  const draw = eo(seg(t, 2.40, 2.95));
  if (draw > 0) {
    let per = 0;
    for (let i = 0; i < 5; i++) {
      const a = pts[i], b = pts[(i + 1) % 5];
      per += Math.hypot(b[0] - a[0], b[1] - a[1]);
    }
    const fill = seg(t, 2.85, 3.15) * 0.18 * out;
    if (fill > 0) {
      ctx.fillStyle = rgba(dotCol, fill);
      ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = rgba(dotCol, out);
    ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
    ctx.setLineDash([per * draw, per]);
    ctx.beginPath();
    pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath(); ctx.stroke();
    ctx.setLineDash([]);
  }

  /* ── the readout slot: risk, then verdict ── */
  const riskAl = seg(t, 2.55, 2.85) * (1 - seg(t, 3.45, 3.70)) * out;
  if (riskAl > 0.004) {
    const v = Math.round(8 * eo(seg(t, 2.50, 3.15)));
    text(ctx, v + '%', CX, 620, `700 32px ${F.display}`, rgba(C.text, riskAl));
    text(ctx, 'RISK', CX, 644, `500 14px ${F.mono}`, rgba(C.faint, riskAl), 'center', 1.8);
  }
  const vAl = eo(seg(t, 3.70, 4.05)) * out;
  if (vAl > 0.004) {
    const dy = (1 - eo(seg(t, 3.70, 4.05))) * 6;
    text(ctx, 'Cleared', CX, 620 + dy, `700 33px ${F.display}`, rgba(C.lime, vAl));
    text(ctx, '4 checks passed · encrypted', CX, 644 + dy, `400 14px ${F.mono}`, rgba(C.faint, vAl * 1.2));
  }

  statusBar(ctx);
  ctx.restore();
  ctx.restore();
}
