/* Card artwork, drawn from the app's own numbers.
   Every constant here is lifted from the component it depicts — the stone
   table and generator from src/lib/stone.ts, the tick counts and lengths
   from ScannerField, the bar weights and levels from the fraud data, the
   verdict heights from ScreenedStrip. An approximation would read as a
   different product. */

function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000}}
function stonePath(seed,rx,ry,N=22){
  const r=rng(seed);
  const harm=[2,3,4,5].map((k,i)=>({k,phase:r()*Math.PI*2,amp:(0.058-i*0.013)*(0.7+r()*0.6)}));
  const pts=[];
  for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2;let w=1;
    for(const h of harm)w+=h.amp*Math.sin(h.k*a+h.phase);
    pts.push([Math.cos(a)*rx*w,Math.sin(a)*ry*w]);}
  const at=i=>pts[(i+N)%N];
  let d=`M${at(0)[0].toFixed(2)},${at(0)[1].toFixed(2)}`;
  for(let i=0;i<N;i++){const[x0,y0]=at(i-1),[x1,y1]=at(i),[x2,y2]=at(i+1),[x3,y3]=at(i+2);
    d+=`C${(x1+(x2-x0)/6).toFixed(2)},${(y1+(y2-y0)/6).toFixed(2)} ${(x2-(x3-x1)/6).toFixed(2)},${(y2-(y3-y1)/6).toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`;}
  return d+'Z';
}
/* src/lib/stone.ts */
const STONES=[[0.46,0.113,-0.05,0.00,3],[0.36,0.106,0.11,-0.06,17],[0.40,0.098,-0.08,0.06,29],
              [0.30,0.108,0.14,-0.04,41],[0.33,0.092,-0.12,0.03,53],[0.22,0.085,0.09,0.05,67]];
/* the Soil ramp, as applyTheme interpolates it */
const TONE      =['#4E5A69','#636F7D','#788491','#8C98A6','#A1ADBA','#B6C2CE'];
const TONE_DARK =['#CFD7DF','#C0C8D0','#B1B9C2','#A1AAB3','#929BA5','#838C96'];
const INK='#1B212A', SCAN_CORE='#020306', FAINT='#76838F';

function cairn(size, set, dark){
  const tone = dark ? TONE_DARK : TONE, gap = dark ? SCAN_CORE : INK;
  let y=0,minY=0,maxY=0,maxX=0;
  const laid=STONES.map(([w,h,rot,dx,seed],i)=>{
    const rx=w*size, ry=h*size; y-=ry*1.74;
    const eX=Math.abs(rx*Math.cos(rot))+Math.abs(ry*Math.sin(rot));
    const eY=Math.abs(rx*Math.sin(rot))+Math.abs(ry*Math.cos(rot));
    minY=Math.min(minY,y-eY); maxY=Math.max(maxY,y+eY);
    maxX=Math.max(maxX,Math.abs(dx*size)+eX);
    const o={rx,ry,rot,dx,seed,y,i}; y-=ry*0.26; return o;
  });
  const P=5, vw=(maxX+P)*2, vh=maxY-minY+P*2;
  const body=laid.map(s=>{
    const t=`translate(${(s.dx*size).toFixed(1)},${s.y.toFixed(1)}) rotate(${(s.rot*180/Math.PI).toFixed(1)})`;
    return s.i<set
      ? `<g transform="${t}"><path d="${stonePath(s.seed,s.rx,s.ry)}" fill="${tone[s.i]}" stroke="${gap}" stroke-width="${Math.max(1,size*0.023).toFixed(1)}" paint-order="stroke fill"/></g>`
      : `<g transform="${t}"><path d="${stonePath(s.seed,s.rx,s.ry)}" fill="none" stroke="${dark?'#FFFFFF':FAINT}" stroke-opacity="${dark?0.42:0.55}" stroke-width="${Math.max(1,size*0.009).toFixed(1)}" stroke-dasharray="${(size*0.02).toFixed(1)} ${(size*0.027).toFixed(1)}"/></g>`;
  }).join('');
  return {svg:`<svg width="${vw.toFixed(0)}" height="${vh.toFixed(0)}" viewBox="${(-vw/2).toFixed(1)} ${(minY-P).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}">${body}</svg>`, vw, vh};
}

/* ScannerField: 84 ticks, the ring scaled 1.07 on Y, inner ring at 0.7 */
function scanner(R){
  const N=84, k=R/150;
  let t='';
  for(let i=0;i<N;i++){
    const a=(i/N)*Math.PI*2-Math.PI/2, len=(i%7===0?13:8.5)*k;
    t+=`<line x1="${(Math.cos(a)*R).toFixed(1)}" y1="${(Math.sin(a)*R).toFixed(1)}" x2="${(Math.cos(a)*(R+len)).toFixed(1)}" y2="${(Math.sin(a)*(R+len)).toFixed(1)}" stroke="rgba(226,240,246,0.88)" stroke-width="1.4"/>`;
  }
  const inner=`<ellipse rx="${(R*0.7).toFixed(1)}" ry="${(R*0.7).toFixed(1)}" fill="none" stroke="rgba(226,240,246,0.42)" stroke-width="1" stroke-dasharray="1 7"/>`;
  const c=cairn(R*0.78, 3, true);
  const S=Math.round(R*1.22);
  return `<svg width="${S*2}" height="${S*2}" viewBox="${-S} ${-S} ${S*2} ${S*2}">
    <g transform="scale(1,1.07)">${t}${inner}</g>
    <g transform="translate(0,${(c.vh*0.34).toFixed(1)})">${c.svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g>
    <g stroke="rgba(255,255,255,0.32)" stroke-width="1" stroke-dasharray="2 5">
      <line x1="${(-R*1.08).toFixed(1)}" y1="${(-R*0.2).toFixed(1)}" x2="${(-R*0.44).toFixed(1)}" y2="${(-R*0.2).toFixed(1)}"/>
      <line x1="${(R*0.44).toFixed(1)}" y1="${(R*0.14).toFixed(1)}" x2="${(R*1.08).toFixed(1)}" y2="${(R*0.14).toFixed(1)}"/>
    </g></svg>`;
}

/* the held payment's signals — weights and levels from src/lib/data.ts */
function bars(){
  const F=[[0.94,'high'],[0.86,'high'],[0.62,'med'],[0.34,'low'],[0.12,'low']];
  const C={high:'#E5806F', med:'#D6AF5C', low:FAINT};
  const W=112, row=17, dot=6, track=2.5;
  let b='';
  F.forEach(([w,lv],i)=>{
    const y=i*row, c=C[lv];
    b+=`<circle cx="${dot/2}" cy="${(y+dot/2).toFixed(1)}" r="${dot/2}" fill="${c}"/>`;
    b+=`<rect x="0" y="${(y+dot+4).toFixed(1)}" width="${W}" height="${track}" rx="2" fill="#222A34"/>`;
    b+=`<rect x="0" y="${(y+dot+4).toFixed(1)}" width="${(W*w).toFixed(1)}" height="${track}" rx="2" fill="${c}" fill-opacity="0.8"/>`;
  });
  return `<svg width="${W}" height="${F.length*row}" viewBox="0 0 ${W} ${F.length*row}">${b}</svg>`;
}

/* ScreenedStrip: 34 marks, one held, one watched */
function strip(){
  const n=34, H=54, g=3, W=250, w=(W-(n-1)*g)/n;
  const C={safe:'#84B9A4', med:'#D6AF5C', high:'#E5806F'};
  let b='';
  for(let i=0;i<n;i++){
    const v = i===23?'high' : i===8?'med' : 'safe', flag = v!=='safe';
    const h = flag ? H : 10 + ((i*29)%26);
    b+=`<rect x="${(i*(w+g)).toFixed(1)}" y="${(H-h).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="1.5" fill="${C[v]}" fill-opacity="${flag?1:0.34}"/>`;
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${b}</svg>`;
}

document.querySelectorAll('[data-art]').forEach(el=>{
  const [kind,arg]=el.dataset.art.split(':');
  el.innerHTML = kind==='cairn'   ? cairn(Number(arg)||104, 5, false).svg
    : kind==='scanner' ? scanner(Number(arg)||86)
    : kind==='bars'    ? bars()
    : kind==='strip'   ? strip() : '';
});
