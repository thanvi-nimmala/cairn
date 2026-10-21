/* Three directions for the card, drawn as the verdict moment only.
   Shared: the app's tokens, the app's four faces, no gradients, no soft shadows. */
export const W = 520, H = 796;
const C = {}, F = {};
function px(css){const c=document.createElement('canvas');c.width=c.height=1;
  const g=c.getContext('2d',{willReadFrequently:true});g.clearRect(0,0,1,1);
  g.fillStyle=css;g.fillRect(0,0,1,1);const d=g.getImageData(0,0,1,1).data;
  return [d[0],d[1],d[2],d[3]/255];}
export function readTokens(){
  const cs=getComputedStyle(document.documentElement), v=n=>cs.getPropertyValue(n).trim();
  C.ink=px(v('--ink')); C.line=px(v('--line')); C.text=px(v('--text'));
  C.dim=px(v('--text-dim')); C.faint=px(v('--text-faint'));
  C.iris=px(v('--accent')); C.lime=px(v('--safe'));
  C.paper=px('#ECE8E1'); C.inkOnPaper=px('#16150F');
  F.d=v('--font-display'); F.b=v('--font-body'); F.m=v('--font-mono');
}
const rgba=(c,a=1)=>`rgba(${c[0]},${c[1]},${c[2]},${(c[3]===undefined?1:c[3])*a})`;
function T(ctx,s,x,y,font,fill,align='left',track=0){
  ctx.font=font; ctx.fillStyle=fill; ctx.textAlign=align; ctx.textBaseline='alphabetic';
  ctx.letterSpacing=track+'px'; ctx.fillText(s,x,y); ctx.letterSpacing='0px';
}
function RR(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}

const SIG=[{l:'MERCHANT',v:8,a:-90},{l:'AMOUNT',v:12,a:-18},
           {l:'LOCATION',v:6,a:54},{l:'TIMING',v:9,a:126},{l:'DEVICE',v:4,a:198}];
const rad=d=>d*Math.PI/180;
const cl=x=>x<0?0:x>1?1:x;
const seg=(p,a,b)=>cl((p-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);
const sr=(v,R)=>R*(0.18+v*0.017);

/* the instrument, drawn at whatever size the composition gives it */
function radar(ctx,cx,cy,R,col,grid,fillA=0.16,lw=1.8,p=1){
  ctx.lineWidth=1;
  for(const k of [0.33,0.62,1]){
    ctx.strokeStyle=rgba(grid,k===0.62?0.75:1);
    if(k===0.62){ctx.setLineDash([3,5]);}else{ctx.setLineDash([]);}
    ctx.beginPath();
    SIG.forEach((s,i)=>{const a=rad(s.a),x=cx+Math.cos(a)*R*k,y=cy+Math.sin(a)*R*k;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
    ctx.closePath();ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.strokeStyle=rgba(grid,0.8);
  SIG.forEach(s=>{const a=rad(s.a);ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.stroke();});
  const pts=SIG.map(s=>{const a=rad(s.a),r=sr(s.v,R);return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];});
  const drawP=eo(seg(p,0.45,0.85));
  if(drawP>0){
    const fa=seg(p,0.75,0.95)*fillA;
    if(fa>0){ctx.fillStyle=rgba(col,fa);ctx.beginPath();
      pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
    let per=0;for(let i=0;i<5;i++){const a=pts[i],b=pts[(i+1)%5];per+=Math.hypot(b[0]-a[0],b[1]-a[1]);}
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=lw;ctx.lineJoin='round';
    ctx.setLineDash([per*drawP,per]);
    ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.closePath();ctx.stroke();ctx.setLineDash([]);
  }
  pts.forEach(([x,y],i)=>{const dp=eo(seg(p,0.18+i*0.05,0.34+i*0.05));
    if(dp<=0)return;ctx.fillStyle=rgba(col,dp);ctx.beginPath();ctx.arc(x,y,3.6*dp,0,7);ctx.fill();});
}

/* ══ A — editorial: a left type column, the instrument large and unlabelled ══ */
function A(ctx,p=1){
  ctx.fillStyle=rgba(C.ink);ctx.fillRect(0,0,W,H);
  const M=44;
  const done=seg(p,0.88,1);
  T(ctx,done>0.5?'CLEARED':'SCREENING',M,72,`500 14px ${F.m}`,rgba(done>0.5?C.lime:C.faint),'left',1.6);
  const ai=eo(seg(p,0,0.18));
  T(ctx,'$45.00',M,146+(1-ai)*10,`700 68px ${F.d}`,rgba(C.text,ai));
  T(ctx,'to Daniel Reyes',M,178,`500 16px ${F.b}`,rgba(C.dim,eo(seg(p,0.05,0.24))));
  radar(ctx,350,336,140,done>0.5?C.lime:C.iris,C.line,0.16,1.8,p);
  /* the signals as a ledger, not labels orbiting a chart */
  SIG.forEach((s,i)=>{
    const a=eo(seg(p,0.20+i*0.05,0.36+i*0.05)), y=556+i*26;
    if(a<=0)return;
    T(ctx,s.l,M,y,`500 14px ${F.m}`,rgba(C.faint,a),'left',0.9);
    T(ctx,String(s.v),M+168,y,`500 14px ${F.m}`,rgba(done>0.5?C.lime:C.iris,a),'right',0.9);
  });
  const ra=seg(p,0.62,0.78);
  if(ra>0){ctx.strokeStyle=rgba(C.line,ra);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(M,688);ctx.lineTo(M+168,688);ctx.stroke();
    T(ctx,'RISK',M,712,`500 14px ${F.m}`,rgba(C.faint,ra),'left',1.6);
    T(ctx,Math.round(8*eo(seg(p,0.62,0.82)))+'%',M+168,712,`500 14px ${F.m}`,rgba(C.text,ra),'right',0.9);}
  const va=eo(seg(p,0.88,1));
  if(va>0)T(ctx,'Cleared',M,768-(1-va)*6,`700 44px ${F.d}`,rgba(C.lime,va));
}

/* ══ B — the device pushed right, the leftover margin made into a type column ══ */
function B(ctx,p=1){
  ctx.fillStyle=rgba(C.paper);ctx.fillRect(0,0,W,H);
  const DV={x:228,y:84,w:272,h:628,r:40}, bz=8;
  const SCn={x:DV.x+bz,y:DV.y+bz,w:DV.w-bz*2,h:DV.h-bz*2,r:DV.r-bz};
  ctx.fillStyle='#1B1A17';RR(ctx,DV.x,DV.y,DV.w,DV.h,DV.r);ctx.fill();
  ctx.save();RR(ctx,SCn.x,SCn.y,SCn.w,SCn.h,SCn.r);ctx.clip();
  ctx.fillStyle=rgba(C.ink);ctx.fillRect(SCn.x,SCn.y,SCn.w,SCn.h);
  ctx.fillStyle='#000';RR(ctx,SCn.x+SCn.w/2-34,SCn.y+8,68,20,10);ctx.fill();
  const cx=SCn.x+SCn.w/2;
  const done=seg(p,0.88,1);
  T(ctx,'$45.00',cx,SCn.y+118,`700 40px ${F.d}`,rgba(C.text,eo(seg(p,0,0.18))),'center');
  radar(ctx,cx,SCn.y+310,104,done>0.5?C.lime:C.iris,C.line,0.16,1.8,p);
  const va=eo(seg(p,0.88,1));
  if(va>0)T(ctx,'Cleared',cx,SCn.y+500,`700 30px ${F.d}`,rgba(C.lime,va),'center');
  ctx.fillStyle=rgba(C.text,0.3);RR(ctx,cx-44,SCn.y+SCn.h-14,88,4,2);ctx.fill();
  ctx.restore();
  /* the column the aspect mismatch gives us, used rather than left empty */
  const M=40;
  T(ctx,'TRUEPAY',M,76,`500 14px ${F.m}`,rgba(C.inkOnPaper,0.45),'left',1.8);
  ['A payment,','screened and','explained.'].forEach((ln,i)=>
    T(ctx,ln,M,340+i*30,`700 24px ${F.d}`,rgba(C.inkOnPaper,eo(seg(p,0.05+i*0.05,0.25+i*0.05)))));
  ctx.strokeStyle=rgba(C.inkOnPaper,0.22);ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(M,438);ctx.lineTo(M+148*seg(p,0.25,0.45),438);ctx.stroke();
  T(ctx,'5 SIGNALS',M,468,`500 14px ${F.m}`,rgba(C.inkOnPaper,0.55*seg(p,0.3,0.5)),'left',1.2);
  T(ctx,Math.round(8*eo(seg(p,0.62,0.82)))+'% RISK',M,492,`500 14px ${F.m}`,rgba(C.inkOnPaper,0.55*seg(p,0.6,0.78)),'left',1.2);
}

/* ══ C — technical readout: hairlines, mono, nothing soft ══ */
function Cc(ctx,p=1){
  ctx.fillStyle=rgba(C.ink);ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=rgba(C.line,0.5);ctx.lineWidth=1;
  [96,640].forEach(y=>{ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();});
  const M=40;
  T(ctx,'TXN / 2041',M,62,`500 14px ${F.m}`,rgba(C.faint),'left',1.4);
  const done=seg(p,0.88,1);
  T(ctx,done>0.5?'CLEARED':'SCREENING',W-M,62,`500 14px ${F.m}`,rgba(done>0.5?C.lime:C.faint),'right',1.4);
  const ai=eo(seg(p,0,0.18));
  T(ctx,'$45.00',M,172+(1-ai)*10,`700 76px ${F.d}`,rgba(C.text,ai));
  T(ctx,'DANIEL REYES',M,204,`500 14px ${F.m}`,rgba(C.faint,eo(seg(p,0.05,0.24))),'left',1.4);
  radar(ctx,260,420,128,done>0.5?C.lime:C.iris,C.line,0,1.6,p);
  SIG.forEach((s,i)=>{
    const a=seg(p,0.18+i*0.05,0.30+i*0.05), y=676+i*22, right=W-M;
    if(a<=0)return;
    T(ctx,s.l,M,y,`500 14px ${F.m}`,rgba(C.faint,a),'left',1);
    ctx.strokeStyle=rgba(C.line,0.8*a);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(M+96,y-4);ctx.lineTo(right-72,y-4);ctx.stroke();
    const bar=eo(seg(p,0.22+i*0.05,0.48+i*0.05));
    ctx.fillStyle=rgba(done>0.5?C.lime:C.iris,1);
    ctx.fillRect(M+96,y-6,(right-72-M-96)*(s.v/14)*bar,4);
    T(ctx,String(Math.round(s.v*bar)).padStart(2,'0'),right,y,`500 14px ${F.m}`,rgba(C.text,a),'right',1);
  });
  const va=eo(seg(p,0.88,1));
  if(va>0)T(ctx,'CLEARED',W-M,616-(1-va)*5,`700 40px ${F.d}`,rgba(C.lime,va),'right');
  const ra=seg(p,0.62,0.78);
  if(ra>0)T(ctx,Math.round(8*eo(seg(p,0.62,0.82)))+'% RISK',M,616,`500 14px ${F.m}`,rgba(C.faint,ra),'left',1.4);
}

export function draw(ctx,which,p=1){
  ctx.setTransform(1,0,0,1,0,0);
  const s=ctx.canvas.width/W; ctx.scale(s,s);
  ({a:A,b:B,c:Cc}[which]||A)(ctx,p);
}

/* four beats as a 2x2 contact sheet, so the motion is legible as stills */
export function strip(ctx,which){
  const fn={a:A,b:B,c:Cc}[which]||A;
  const beats=[[0.22,'BEAT 1'],[0.52,'BEAT 2'],[0.80,'BEAT 3'],[1.0,'BEAT 4 / HOLD']];
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle='#fff';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
  beats.forEach(([p,label],i)=>{
    const col=i%2, row=(i/2)|0, gx=26+col*(W+26), gy=26+row*(H+56);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.translate(gx,gy);
    ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();fn(ctx,p);ctx.restore();
    ctx.fillStyle='#16150F';ctx.font=`500 15px ${F.m}`;ctx.textAlign='left';
    ctx.letterSpacing='1.4px';ctx.fillText(label,0,H+26);ctx.letterSpacing='0px';
    ctx.restore();
  });
}
