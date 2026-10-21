/* Cairn — pale, airy, soft-depth. The stones are rendered objects, not flat marks. */
export const W = 390, H = 844;
const F = {};
export function init(){ F.b="'Manrope',sans-serif"; F.n="'Martian Mono',monospace"; }

const C = {
  bg:'#EFF0EC', card:'#FFFFFF', ink:'#1A1D1A', grey:'#9BA09B', faint:'#C3C7C2',
  sage:'#6F8E78', sageHi:'#A8C0AE', sageWash:'#EAF0EB',
  alarm:'#C9553C', alarmWash:'#FBEEEA',
};

function T(ctx,s,x,y,font,fill,align='left',track=0){
  ctx.font=font;ctx.fillStyle=fill;ctx.textAlign=align;ctx.textBaseline='alphabetic';
  ctx.letterSpacing=track+'px';ctx.fillText(s,x,y);ctx.letterSpacing='0px';}
function RR(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}

/* a card sits on the ground rather than being drawn on it */
function card(ctx,x,y,w,h,r,fill){
  ctx.save();
  ctx.shadowColor='rgba(26,29,26,0.08)';ctx.shadowBlur=24;ctx.shadowOffsetY=8;
  ctx.fillStyle=fill||C.card;RR(ctx,x,y,w,h,r);ctx.fill();
  ctx.restore();}

/* a stone, lit from upper-left, sitting in its own shadow */
function stone(ctx,cx,cy,rx,ry,rot,hi,mid,lo){
  ctx.save();
  ctx.translate(cx,cy);ctx.rotate(rot);
  ctx.shadowColor='rgba(26,29,26,0.22)';ctx.shadowBlur=12;ctx.shadowOffsetY=5;
  const g=ctx.createRadialGradient(-rx*0.34,-ry*0.55,ry*0.08,0,0,rx*1.12);
  g.addColorStop(0,hi);g.addColorStop(0.5,mid);g.addColorStop(1,lo);
  ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,7);ctx.fill();
  ctx.restore();}

/* the stack IS the score: one stone per protection, the unset one an outline */
const STONES=[[0.92,0.226,-0.05,0.00],[0.72,0.212,0.11,-0.06],[0.80,0.196,-0.08,0.06],
              [0.60,0.216,0.14,-0.04],[0.66,0.184,-0.12,0.03],[0.44,0.170,0.09,0.05]];
const SEEDS=[3,17,29,41,53,67];
/* 2-D stones — the same generator the app uses (src/lib/stone.ts), kept in
   sync by hand. A pebble is a circle whose radius wobbles with angle; four
   seeded harmonics keep the wobble periodic so the outline always closes. */
function srng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000}}
function stonePts(seed,rx,ry,N=22){
  const r=srng(seed);
  const harm=[2,3,4,5].map((k,i)=>({k,phase:r()*Math.PI*2,amp:(0.058-i*0.013)*(0.7+r()*0.6)}));
  const pts=[];
  for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2;let w=1;
    for(const h of harm)w+=h.amp*Math.sin(h.k*a+h.phase);
    pts.push([Math.cos(a)*rx*w,Math.sin(a)*ry*w]);}
  return pts;}
function stonePath(ctx,seed,rx,ry){
  const pts=stonePts(seed,rx,ry),N=pts.length,at=i=>pts[(i+N)%N];
  ctx.beginPath();ctx.moveTo(at(0)[0],at(0)[1]);
  for(let i=0;i<N;i++){
    const[x0,y0]=at(i-1),[x1,y1]=at(i),[x2,y2]=at(i+1),[x3,y3]=at(i+2);
    ctx.bezierCurveTo(x1+(x2-x0)/6,y1+(y2-y0)/6,x2-(x3-x1)/6,y2-(y3-y1)/6,x2,y2);}
  ctx.closePath();}

const TONE=['#5F7A68','#6C8574','#7A9081','#889B8D','#96A699','#A4B1A5'];
const TONE_DARK=['#C2CFC5','#B2C1B6','#A3B4A8','#94A79A','#869B8D','#788F80'];

function stack(ctx,cx,base,s,total=6,set=5,dark=false){
  let y=base;
  STONES.slice(0,total).forEach(([w,h,rot,dx],i)=>{
    const on=i<set, rx=(w/2)*s, ry=(h/2)*s;
    y-=ry*1.74;
    ctx.save();ctx.translate(cx+dx*s,y);ctx.rotate(rot);
    stonePath(ctx,SEEDS[i],rx,ry);
    if(on){
      /* a halo in the ground colour keeps adjacent stones apart */
      ctx.strokeStyle=dark?'#0B0F0C':C.bg;ctx.lineWidth=Math.max(1,s*0.023);ctx.stroke();
      ctx.fillStyle=(dark?TONE_DARK:TONE)[i];ctx.fill();
    }else{
      ctx.strokeStyle=dark?'rgba(255,255,255,0.42)':C.faint;
      ctx.setLineDash([Math.max(1,s*0.02),Math.max(1,s*0.027)]);
      ctx.lineWidth=Math.max(1,s*0.009);ctx.stroke();ctx.setLineDash([]);}
    ctx.restore();
    y-=ry*0.26;});}

/* deterministic film grain */
let GRAIN=null;
function grain(ctx,a){
  if(!GRAIN){GRAIN=document.createElement('canvas');GRAIN.width=GRAIN.height=100;
    const g=GRAIN.getContext('2d'),im=g.createImageData(100,100);let seed=7;
    for(let i=0;i<im.data.length;i+=4){seed=(seed*1103515245+12345)&0x7fffffff;
      const v=(seed>>>16)&255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}
    g.putImageData(im,0,0);}
  ctx.save();ctx.globalAlpha=a;ctx.globalCompositeOperation='overlay';
  ctx.fillStyle=ctx.createPattern(GRAIN,'repeat');ctx.fillRect(0,0,W,H);ctx.restore();}

/* the instrument field: sage at the edges, dark at the centre, a ticked scale */
function scanner(ctx,cx,cy,rx,ry,accA,accB,accCol){
  ctx.fillStyle='#93AB99';ctx.fillRect(0,0,W,H);
  const g=ctx.createRadialGradient(cx,cy,8,cx,cy,Math.max(W,H)*0.58);
  g.addColorStop(0,'#0B0F0C');g.addColorStop(0.42,'rgba(11,15,12,0.93)');
  g.addColorStop(1,'rgba(11,15,12,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const N=84;
  for(let i=0;i<N;i++){
    const a=(i/N)*Math.PI*2-Math.PI/2, acc=i>=accA&&i<=accB;
    const len=acc?17:(i%7===0?13:8.5);
    ctx.strokeStyle=acc?accCol:'rgba(255,255,255,0.80)';
    ctx.lineWidth=acc?2.6:1.5;ctx.lineCap='butt';
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry);
    ctx.lineTo(cx+Math.cos(a)*(rx+len),cy+Math.sin(a)*(ry+len));ctx.stroke();}
  ctx.strokeStyle='rgba(255,255,255,0.20)';ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(cx,cy,rx*0.70,ry*0.70,0,0,7);ctx.stroke();
  ctx.setLineDash([2,5]);ctx.strokeStyle='rgba(255,255,255,0.30)';
  ctx.beginPath();ctx.moveTo(cx-rx*0.95,cy+ry*0.52);ctx.lineTo(cx-rx*0.30,cy+ry*0.22);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx+rx*0.22,cy+ry*0.86);ctx.lineTo(cx+rx*0.22,cy+ry*1.22);ctx.stroke();
  ctx.setLineDash([]);}

function blob(ctx,cx,cy,r,col,a,blur=46){
  ctx.save();ctx.filter=`blur(${blur}px)`;ctx.globalAlpha=a;
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
  g.addColorStop(0,col);g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.restore();}
function washed(ctx,x,y,w,h,r,fn,fill){
  card(ctx,x,y,w,h,r,fill);
  ctx.save();RR(ctx,x,y,w,h,r);ctx.clip();fn();ctx.restore();}

function pill(ctx,x,y,label,fill,txt){
  ctx.font=`600 10px ${F.b}`;const w=ctx.measureText(label).width+20;
  ctx.fillStyle=fill;RR(ctx,x,y,w,20,10);ctx.fill();
  T(ctx,label,x+10,y+14,`600 10px ${F.b}`,txt);return w;}

/* a stone small enough to sit in a list row */
function bullet(ctx,cx,cy,on){
  if(on) stone(ctx,cx,cy,9,5.4,-0.06,'#C9D4CB','#8EA095','#64756B');
  else{ctx.save();ctx.strokeStyle=C.faint;ctx.setLineDash([2.5,3]);ctx.lineWidth=1.2;
    ctx.beginPath();ctx.ellipse(cx,cy,9,5.4,-0.06,0,7);ctx.stroke();ctx.restore();}}

function chrome(ctx,a,b){
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,C.ink);
  ctx.fillStyle=C.ink;
  for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);
  T(ctx,a,20,84,`800 26px ${F.b}`,C.ink);
  T(ctx,b,20,112,`500 26px ${F.b}`,C.grey);}

function tabbar(ctx,active){
  const M=20;
  card(ctx,M+14,770,W-(M+14)*2,56,28);
  const tabs=['Home','Activity','Pay','Security','Profile'], tw=(W-(M+14)*2)/5;
  tabs.forEach((t,i)=>{const cx=M+14+tw*i+tw/2;
    if(i===active){ctx.fillStyle=C.ink;RR(ctx,cx-tw/2+5,778,tw-10,40,20);ctx.fill();}
    T(ctx,t,cx,803,`600 10.5px ${F.b}`,i===active?'#fff':C.grey,'center');});}

const PROT=[['Biometric approval',1,'+26'],['Multi-layer encryption',1,'+24'],
            ['Real-time monitoring',1,'+22'],['Instant alerts',1,'+14'],
            ['Auto-freeze on anomaly',1,'+10'],['Travel mode',0,'+4']];

export function SECURITY(ctx){
  ctx.setTransform(1,0,0,1,0,0);
  const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Cairn','Security');
  const M=20;
  ctx.strokeStyle=C.grey;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(352,92);ctx.lineTo(359,99);ctx.lineTo(366,92);ctx.stroke();

  /* the stack is the hero here, not a thumbnail */
  washed(ctx,M,132,W-M*2,282,26,()=>blob(ctx,M+120,340,150,'rgba(111,142,120,0.28)',1,54));
  T(ctx,'Trust',M+22,166,`700 15px ${F.b}`,C.ink);
  T(ctx,'Five of six stones set',M+22,186,`500 15px ${F.b}`,C.grey);
  stack(ctx,M+112,392,126);
  T(ctx,'96',W-M-22,348,`300 56px ${F.b}`,C.ink,'right');
  T(ctx,'of 100',W-M-22,372,`500 12px ${F.b}`,C.grey,'right');

  card(ctx,M,426,W-M*2,300,26);
  T(ctx,'Protections',M+22,460,`700 13px ${F.b}`,C.ink);
  T(ctx,'5 of 6 armed',W-M-22,460,`500 12px ${F.b}`,C.grey,'right');
  PROT.forEach(([n,on,w],i)=>{const y=494+i*38;
    if(i){ctx.strokeStyle='#F1F2F0';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(M+22,y-21.5);ctx.lineTo(W-M-22,y-21.5);ctx.stroke();}
    bullet(ctx,M+31,y-5,on);
    T(ctx,n,M+52,y,`${on?600:500} 13px ${F.b}`,on?C.ink:C.grey);
    T(ctx,w,W-M-22,y,`600 12px ${F.b}`,on?C.sage:C.faint,'right');});

  tabbar(ctx,3);
}

const SIG=[['Unknown merchant',0.94,'94'],['Unusual amount',0.86,'86'],
           ['Distant origin',0.62,'62'],['Off-pattern timing',0.34,'34'],
           ['Device match',0.12,'12']];

export function REVIEW(ctx){
  ctx.setTransform(1,0,0,1,0,0);
  const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Held','for review');
  const M=20;
  /* close, not back — this is a sheet the model opened */
  ctx.strokeStyle=C.grey;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(352,88);ctx.lineTo(366,102);
  ctx.moveTo(366,88);ctx.lineTo(352,102);ctx.stroke();

  washed(ctx,M,132,W-M*2,118,26,()=>blob(ctx,W-60,250,120,'rgba(201,85,60,0.26)',1,44),C.alarmWash);
  T(ctx,'Stopped before it left your account',M+22,164,`600 11px ${F.b}`,C.alarm);
  T(ctx,'$482.00',M+22,206,`300 34px ${F.b}`,C.ink);
  T(ctx,'DNH*LUMOSTORE LTD · 08:51',M+22,230,`500 12px ${F.b}`,C.grey);

  card(ctx,M,262,W-M*2,286,26);
  T(ctx,'Why it stopped',M+22,296,`700 13px ${F.b}`,C.ink);
  T(ctx,'strongest first',W-M-22,296,`500 12px ${F.b}`,C.grey,'right');
  SIG.forEach(([n,f,v],i)=>{const y=336+i*42;
    T(ctx,n,M+22,y,`500 12.5px ${F.b}`,C.ink);
    const x0=M+168,x1=W-M-56,bw=x1-x0;
    ctx.fillStyle='#EFF1EE';RR(ctx,x0,y-9,bw,7,3.5);ctx.fill();
    const col=f>0.7?C.alarm:f>0.4?'#C9953C':C.sage;
    ctx.fillStyle=col;RR(ctx,x0,y-9,bw*f,7,3.5);ctx.fill();
    T(ctx,v,W-M-22,y,`600 12px ${F.b}`,C.ink,'right');});

  card(ctx,M,560,W-M*2,66,26);
  T(ctx,'Overall risk',M+22,592,`600 13px ${F.b}`,C.ink);
  T(ctx,'5 of 5 signals weighed',M+22,610,`500 11px ${F.b}`,C.grey);
  T(ctx,'58%',W-M-22,602,`300 30px ${F.b}`,C.alarm,'right');

  /* the decision, always in reach */
  ctx.fillStyle=C.ink;RR(ctx,M,642,W-M*2,54,27);ctx.fill();
  T(ctx,'Yes, this was me',W/2,675,`700 14px ${F.b}`,'#fff','center');
  ctx.strokeStyle=C.alarm;ctx.lineWidth=1.5;RR(ctx,M+0.5,708.5,W-M*2-1,53,26.5);ctx.stroke();
  T(ctx,'Not me — freeze & dispute',W/2,741,`700 14px ${F.b}`,C.alarm,'center');
  T(ctx,'You are not liable while this is reviewed',W/2,790,`500 11px ${F.b}`,C.grey,'center');
}

/* ── shared bits ── */
function avatar(ctx,cx,cy,r,ini,hue){
  const g=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);
  g.addColorStop(0,`hsl(${hue} 22% 82%)`);g.addColorStop(1,`hsl(${hue} 20% 68%)`);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
  T(ctx,ini,cx,cy+r*0.33,`700 ${r*0.72}px ${F.b}`,'#fff','center');}
function sheetX(ctx){ctx.strokeStyle=C.grey;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(352,88);ctx.lineTo(366,102);
  ctx.moveTo(366,88);ctx.lineTo(352,102);ctx.stroke();}
function chev(ctx){ctx.strokeStyle=C.grey;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(352,92);ctx.lineTo(359,99);ctx.lineTo(366,92);ctx.stroke();}
function btn(ctx,x,y,w,h,label,fill,txt,outline){
  if(outline){ctx.strokeStyle=outline;ctx.lineWidth=1.5;RR(ctx,x+0.5,y+0.5,w-1,h-1,h/2);ctx.stroke();}
  else{ctx.fillStyle=fill;RR(ctx,x,y,w,h,h/2);ctx.fill();}
  T(ctx,label,x+w/2,y+h/2+5,`700 14px ${F.b}`,txt,'center');}

/* contacts as people actually save them; merchants as they actually post */
const PEOPLE=[['Dad','@rajeshn','D',200,'5 yrs'],
              ['Ravi M.','@ravim','RM',282,'3 yrs'],
              ['Hannah — rent','@hannahq','H',148,'2 yrs'],
              ['Nadia K.','@nadiak','NK',332,'8 mo'],
              ['SQ *SIDECAR','@sidecar','SC',38,'new']];
const TXNS=[['SQ *SIDECAR DOUGHNUTS','9:24 AM · Dining','−18.40','ok','SC',38],
            ['DNH*LUMOSTORE LTD','8:51 AM · Online','−482.00','held','LS',16],
            ['Ravi M.','Yest · Transfer','+120.00','ok','RM',282],
            ['MTA*NYCT PAYGO','Yest · Transit','−2.90','ok','MT',212],
            ['NETFLIX.COM','Sun · Subscription','−22.99','watch','NF',190]];
const STATC={ok:C.sage,held:C.alarm,watch:'#C9953C'};
const STATL={ok:'verified',held:'held',watch:'watching'};

export function ACTIVITY(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Cairn','Activity');chev(ctx);const M=20;

  card(ctx,M,132,W-M*2,92,26);
  [['In','+$1,570',C.sage],['Out','−$572',C.ink],['Held','1',C.alarm]].forEach(([k,v,col],i)=>{
    const x=M+22+i*108;
    T(ctx,k,x,164,`500 12px ${F.b}`,C.grey);
    T(ctx,v,x,196,`600 19px ${F.b}`,col);});

  ['All','Needs review','In','Out'].forEach((t,i)=>{
    ctx.font=`600 12px ${F.b}`;const w=ctx.measureText(t).width+26;
    const x=M+(i?0:0)+[0,46,146,186][i];
    ctx.fillStyle=i===0?C.ink:'#fff';RR(ctx,M+[0,46,152,192][i],240,w,30,15);ctx.fill();
    T(ctx,t,M+[0,46,152,192][i]+w/2,259,`600 12px ${F.b}`,i===0?'#fff':C.grey,'center');});

  T(ctx,'Today',M+2,304,`600 12px ${F.b}`,C.grey);
  card(ctx,M,316,W-M*2,142,26);
  TXNS.slice(0,2).forEach(([n,sub,amt,st,ini,hue],i)=>{const y=354+i*66;
    if(i){ctx.strokeStyle='#F1F2F0';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(M+22,y-33);ctx.lineTo(W-M-22,y-33);ctx.stroke();}
    avatar(ctx,M+44,y-4,17,ini,hue);
    T(ctx,n.length>19?n.slice(0,18)+'…':n,M+72,y-4,`600 13.5px ${F.b}`,C.ink);
    T(ctx,sub,M+72,y+13,`500 11px ${F.b}`,C.grey);
    T(ctx,amt,W-M-22,y-4,`600 15px ${F.b}`,st==='held'?C.alarm:C.ink,'right');
    T(ctx,STATL[st],W-M-22,y+13,`500 10.5px ${F.b}`,STATC[st],'right');});

  T(ctx,'Earlier',M+2,494,`600 12px ${F.b}`,C.grey);
  card(ctx,M,506,W-M*2,208,26);
  TXNS.slice(2).forEach(([n,sub,amt,st,ini,hue],i)=>{const y=544+i*66;
    if(i){ctx.strokeStyle='#F1F2F0';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(M+22,y-33);ctx.lineTo(W-M-22,y-33);ctx.stroke();}
    avatar(ctx,M+44,y-4,17,ini,hue);
    T(ctx,n.length>19?n.slice(0,18)+'…':n,M+72,y-4,`600 13.5px ${F.b}`,C.ink);
    T(ctx,sub,M+72,y+13,`500 11px ${F.b}`,C.grey);
    T(ctx,amt,W-M-22,y-4,`600 15px ${F.b}`,st==='held'?C.alarm:C.ink,'right');
    T(ctx,STATL[st],W-M-22,y+13,`500 10.5px ${F.b}`,STATC[st],'right');});

  tabbar(ctx,1);
}

export function RECIPIENT(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Send','to whom?');sheetX(ctx);const M=20;
  card(ctx,M,136,W-M*2,48,24);
  ctx.strokeStyle=C.faint;ctx.lineWidth=1.6;ctx.beginPath();
  ctx.arc(M+34,160,6.5,0,7);ctx.moveTo(M+39,165);ctx.lineTo(M+44,170);ctx.stroke();
  T(ctx,'Name, @handle, or phone',M+54,165,`500 13px ${F.b}`,C.faint);
  T(ctx,'Recents',M+2,216,`600 12px ${F.b}`,C.grey);
  card(ctx,M,228,W-M*2,330,26);
  PEOPLE.forEach(([n,h,ini,hue,known],i)=>{const y=270+i*64;
    if(i){ctx.strokeStyle='#F1F2F0';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(M+22,y-32);ctx.lineTo(W-M-22,y-32);ctx.stroke();}
    avatar(ctx,M+46,y-4,19,ini,hue);
    T(ctx,n,M+78,y-3,`600 14px ${F.b}`,C.ink);
    T(ctx,`${h} · known ${known}`,M+78,y+14,`500 11px ${F.b}`,C.grey);
    if(known==='new') T(ctx,'new',W-M-24,y+2,`600 10.5px ${F.b}`,'#C9953C','right');
    else{ctx.strokeStyle=C.faint;ctx.lineWidth=1.8;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(W-M-30,y-5);ctx.lineTo(W-M-24,y+1);ctx.lineTo(W-M-30,y+7);ctx.stroke();}});
}

export function AMOUNT(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Send','how much?');sheetX(ctx);const M=20;
  card(ctx,M,136,W-M*2,66,26);
  avatar(ctx,M+42,169,18,'RM',282);
  T(ctx,'Ravi M.',M+72,165,`600 14px ${F.b}`,C.ink);
  T(ctx,'@ravim · known 3 yrs',M+72,183,`500 11px ${F.b}`,C.grey);
  T(ctx,'$45',W/2,286,`200 72px ${F.b}`,C.ink,'center');
  T(ctx,'from Cairn ···· 4827',W/2,318,`500 12px ${F.b}`,C.grey,'center');
  const keys=['1','2','3','4','5','6','7','8','9','.','0','del'];
  const kx=[78,195,312], R=31;
  keys.forEach((k,i)=>{
    const cx=kx[i%3], cy=376+Math.floor(i/3)*68;
    ctx.save();
    ctx.shadowColor='rgba(26,29,26,0.07)';ctx.shadowBlur=14;ctx.shadowOffsetY=4;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();
    ctx.restore();
    if(k==='del'){
      ctx.strokeStyle=C.grey;ctx.lineWidth=1.7;ctx.lineJoin='round';ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(cx-10,cy);ctx.lineTo(cx-3,cy-7);ctx.lineTo(cx+10,cy-7);
      ctx.lineTo(cx+10,cy+7);ctx.lineTo(cx-3,cy+7);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx+1,cy-3);ctx.lineTo(cx+7,cy+3);
      ctx.moveTo(cx+7,cy-3);ctx.lineTo(cx+1,cy+3);ctx.stroke();
    } else T(ctx,k,cx,cy+10,`400 27px ${F.b}`,C.ink,'center');});
  btn(ctx,M,712,W-M*2,56,'Screen & send',C.ink,'#fff');
  T(ctx,'Four checks run before the money moves',W/2,792,`500 11px ${F.b}`,C.grey,'center');
}

const CHECKS=[['Recipient verified','Known 3 yrs · 14 clean payments'],
              ['Amount in normal range','Matches your typical transfers'],
              ['Device & location trusted','This iPhone · Brooklyn, NY'],
              ['Encrypted & tokenized','Card number never leaves the vault']];

export function SCREENING(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  scanner(ctx,W/2,372,146,160,52,61,'#D6F24E');
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,'#fff');
  ctx.fillStyle='#fff';for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);
  T(ctx,'Screening this payment',W/2,100,`500 19px ${F.b}`,'rgba(255,255,255,0.94)','center');
  T(ctx,'$45.00 to Ravi M.',W/2,124,`500 12px ${F.b}`,'rgba(255,255,255,0.55)','center');
  stack(ctx,W/2,448,116,4,3,true);
  /* leader lines out to what each stone stands for */
  ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1;ctx.setLineDash([2,4]);
  ctx.beginPath();ctx.moveTo(W/2-64,352);ctx.lineTo(46,352);ctx.stroke();
  ctx.beginPath();ctx.moveTo(W/2+66,404);ctx.lineTo(344,404);ctx.stroke();
  ctx.setLineDash([]);
  T(ctx,'RECIPIENT',46,344,`600 8.5px ${F.n}`,'rgba(255,255,255,0.75)','left',1.2);
  T(ctx,'AMOUNT',344,396,`600 8.5px ${F.n}`,'rgba(255,255,255,0.75)','right',1.2);
  CHECKS.forEach(([n],i)=>{const y=584+i*34, on=i<3;
    ctx.fillStyle=on?'#D6F24E':'rgba(255,255,255,0.22)';
    ctx.beginPath();ctx.arc(44,y-4,3.4,0,7);ctx.fill();
    T(ctx,n,60,y,`${on?600:500} 13px ${F.b}`,on?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.4)');
    if(on)T(ctx,'set',W-28,y,`600 10px ${F.n}`,'#D6F24E','right',1);});
  T(ctx,'Three of four stones set',W/2,756,`500 12px ${F.b}`,'rgba(255,255,255,0.55)','center');
  grain(ctx,0.07);
}

export function CONFIRM(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  scanner(ctx,W/2,400,132,146,20,27,'#D6F24E');
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,'#fff');
  ctx.fillStyle='#fff';for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);
  ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(352,88);ctx.lineTo(366,102);
  ctx.moveTo(366,88);ctx.lineTo(352,102);ctx.stroke();
  T(ctx,'Approve to send',W/2,100,`500 19px ${F.b}`,'rgba(255,255,255,0.94)','center');
  T(ctx,'$45.00 · Ravi M. · 4 checks passed',W/2,124,`500 12px ${F.b}`,'rgba(255,255,255,0.55)','center');
  /* a depth-scan wireframe, not a face glyph */
  const cx=W/2, cy=400, hx=46, hy=58;
  ctx.save();
  ctx.beginPath();ctx.ellipse(cx,cy,hx,hy,0,0,7);ctx.clip();
  ctx.strokeStyle='rgba(255,255,255,0.26)';ctx.lineWidth=1;
  for(let i=-3;i<=3;i++){const y=cy+i*17;
    ctx.beginPath();ctx.moveTo(cx-hx,y);
    ctx.quadraticCurveTo(cx,y+9,cx+hx,y);ctx.stroke();}
  for(let j=-2;j<=2;j++){const x=cx+j*20;
    ctx.beginPath();ctx.moveTo(x,cy-hy);
    ctx.quadraticCurveTo(x+j*5,cy,x,cy+hy);ctx.stroke();}
  /* the live scan line */
  ctx.strokeStyle='#D6F24E';ctx.lineWidth=1.8;
  ctx.beginPath();ctx.moveTo(cx-hx,cy-8);
  ctx.quadraticCurveTo(cx,cy+1,cx+hx,cy-8);ctx.stroke();
  ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,0.55)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.ellipse(cx,cy,hx,hy,0,0,7);ctx.stroke();
  /* registration brackets */
  ctx.strokeStyle='rgba(255,255,255,0.92)';ctx.lineWidth=2.4;ctx.lineCap='round';
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{
    const x=cx+sx*72, y=cy+sy*80;
    ctx.beginPath();ctx.moveTo(x,y+sy*-18);ctx.lineTo(x,y);ctx.lineTo(x-sx*18,y);ctx.stroke();});
  T(ctx,'Hold steady',W/2,600,`500 13px ${F.b}`,'rgba(255,255,255,0.72)','center');
  ctx.fillStyle='#fff';RR(ctx,20,712,W-40,56,28);ctx.fill();
  T(ctx,'Approve with Face ID',W/2,747,`700 14px ${F.b}`,'#101410','center');
  grain(ctx,0.07);
}

export function SUCCESS(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,C.ink);
  ctx.fillStyle=C.ink;for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);
  blob(ctx,W/2,268,170,'rgba(111,142,120,0.32)',1,60);
  stack(ctx,W/2,330,138,4,4);
  T(ctx,'$45.00 sent',W/2,404,`300 36px ${F.b}`,C.ink,'center');
  T(ctx,'to Ravi M. · @ravim',W/2,430,`500 13px ${F.b}`,C.grey,'center');
  ctx.fillStyle=C.sageWash;RR(ctx,W/2-78,452,156,30,15);ctx.fill();
  T(ctx,'All four stones set',W/2,472,`600 11.5px ${F.b}`,C.sage,'center');
  btn(ctx,20,690,W-40,56,'Done',C.ink,'#fff');
  btn(ctx,20,754,W-40,50,'View receipt',null,C.grey,'#DCDFDB');
}

export function TXN(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Transfer','received');sheetX(ctx);const M=20;
  card(ctx,M,136,W-M*2,120,26);
  avatar(ctx,M+44,180,22,'RM',282);
  T(ctx,'+$120.00',W-M-22,180,`300 34px ${F.b}`,C.sage,'right');
  T(ctx,'from Ravi M.',M+22,224,`600 14px ${F.b}`,C.ink);
  T(ctx,'Yesterday · 6:12 PM',M+22,242,`500 11px ${F.b}`,C.grey);
  card(ctx,M,268,W-M*2,70,26,C.sageWash);
  T(ctx,'Verified by Cairn',M+22,300,`700 13px ${F.b}`,C.sage);
  T(ctx,'Encrypted · tokenized · biometric-approved',M+22,320,`500 11px ${F.b}`,C.sage);
  card(ctx,M,350,W-M*2,274,26);
  [['Status','Received'],['Category','Transfer'],['Method','Cairn balance'],
   ['Note','Dinner split'],['Reference','CN-T3-2041']].forEach(([k,v],i)=>{
    const y=390+i*50;
    if(i){ctx.strokeStyle='#F1F2F0';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(M+22,y-25);ctx.lineTo(W-M-22,y-25);ctx.stroke();}
    T(ctx,k,M+22,y,`500 13px ${F.b}`,C.grey);
    T(ctx,v,W-M-22,y,`600 13px ${F.b}`,C.ink,'right');});
  btn(ctx,M,650,W-M*2,52,'Share receipt',null,C.ink,'#DCDFDB');
  btn(ctx,M,712,W-M*2,52,'Report this charge',null,C.alarm,'#F0CFC6');
}

const CARDS=[['Cairn Secure','Physical','4827','09/29',0,1284,4000,150],
             ['Subscriptions','Virtual · merchant-locked','9931','02/28',0,96,250,196],
             ['Marsh & Co.','Business','5510','11/30',1,3120,9000,332]];

export function CARDSCREEN(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Cairn','Cards');chev(ctx);const M=20;
  CARDS.forEach(([n,kind,last4,exp,frozen,spent,lim,hue],i)=>{
    const y=136+i*132;
    const g=ctx.createLinearGradient(M,y,W-M,y+116);
    g.addColorStop(0,`hsl(${hue} 18% ${frozen?86:78}%)`);
    g.addColorStop(1,`hsl(${hue} 14% ${frozen?92:88}%)`);
    card(ctx,M,y,W-M*2,116,24,'#fff');
    ctx.save();RR(ctx,M,y,W-M*2,116,24);ctx.clip();
    ctx.fillStyle=g;ctx.fillRect(M,y,W-M*2,116);ctx.restore();
    T(ctx,n,M+22,y+34,`700 14px ${F.b}`,frozen?C.grey:C.ink);
    T(ctx,kind,M+22,y+52,`500 10.5px ${F.b}`,C.grey);
    T(ctx,`···· ${last4}`,M+22,y+92,`600 13px ${F.b}`,frozen?C.grey:C.ink);
    T(ctx,exp,W-M-22,y+92,`500 11px ${F.b}`,C.grey,'right');
    if(frozen){ctx.fillStyle='rgba(255,255,255,0.55)';
      ctx.save();RR(ctx,M,y,W-M*2,116,24);ctx.clip();ctx.fillRect(M,y,W-M*2,116);ctx.restore();
      ctx.fillStyle='#fff';RR(ctx,W-M-96,y+24,74,26,13);ctx.fill();
      T(ctx,'Frozen',W-M-59,y+42,`700 11px ${F.b}`,C.grey,'center');}
    else{const f=spent/lim;
      ctx.fillStyle='rgba(255,255,255,0.7)';RR(ctx,M+22,y+68,W-M*2-44,6,3);ctx.fill();
      ctx.fillStyle=C.sage;RR(ctx,M+22,y+68,(W-M*2-44)*f,6,3);ctx.fill();}});
  card(ctx,M,536,W-M*2,178,26);
  T(ctx,'Cairn Secure',M+22,570,`700 13px ${F.b}`,C.ink);
  T(ctx,'$1,284 of $4,000 this month',M+22,590,`500 11px ${F.b}`,C.grey);
  [['Freeze card','Blocks every new charge',0],['Online payments','Allowed',1],
   ['Location lock','Brooklyn, NY',1]].forEach(([k,v,on],i)=>{
    const y=626+i*32;
    T(ctx,k,M+22,y,`600 12.5px ${F.b}`,C.ink);
    T(ctx,v,M+22,y+14,`500 10px ${F.b}`,C.grey);
    ctx.fillStyle=on?C.sage:'#E3E6E2';RR(ctx,W-M-60,y-11,38,21,10.5);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(W-M-60+(on?27:11),y-0.5,8,0,7);ctx.fill();});
  tabbar(ctx,2);
}

export function PROFILE(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  chrome(ctx,'Cairn','Profile');chev(ctx);const M=20;
  card(ctx,M,132,W-M*2,104,26);
  avatar(ctx,M+50,184,28,'EM',295);
  T(ctx,'Elena Marsh',M+92,178,`700 17px ${F.b}`,C.ink);
  T(ctx,'@elenam',M+92,198,`500 12px ${F.b}`,C.grey);
  ctx.fillStyle=C.sageWash;RR(ctx,W-M-86,170,64,26,13);ctx.fill();
  T(ctx,'Verified',W-M-54,187,`600 10.5px ${F.b}`,C.sage,'center');
  card(ctx,M,248,W-M*2,56,28);
  ['Personal','Business'].forEach((t,i)=>{
    const w=(W-M*2-12)/2, x=M+6+i*w;
    if(!i){ctx.fillStyle=C.ink;RR(ctx,x,254,w,44,22);ctx.fill();}
    T(ctx,t,x+w/2,282,`600 13px ${F.b}`,i?C.grey:'#fff','center');});
  const groups=[['Account',[['Personal information','@elenam'],['Payment methods','3 cards'],['Business account','Marsh & Co.']]],
                ['Security & privacy',[['Face ID & passcode','On'],['Alerts & notifications','All'],['Privacy controls','']]]];
  let y=326;
  groups.forEach(([h,rows])=>{
    T(ctx,h,M+2,y,`600 12px ${F.b}`,C.grey);
    card(ctx,M,y+12,W-M*2,rows.length*46+12,26);
    rows.forEach(([k,v],i)=>{const ry=y+48+i*46;
      if(i){ctx.strokeStyle='#F1F2F0';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(M+22,ry-23);ctx.lineTo(W-M-22,ry-23);ctx.stroke();}
      T(ctx,k,M+22,ry,`600 13px ${F.b}`,C.ink);
      if(v)T(ctx,v,W-M-38,ry,`500 11.5px ${F.b}`,C.grey,'right');
      ctx.strokeStyle=C.faint;ctx.lineWidth=1.6;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(W-M-28,ry-5);ctx.lineTo(W-M-23,ry);ctx.lineTo(W-M-28,ry+5);ctx.stroke();});
    y+=rows.length*46+42;});
  btn(ctx,M,y+4,W-M*2,50,'Sign out',null,C.alarm,'#F0CFC6');
  tabbar(ctx,4);
}

export function WELCOME(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,C.ink);
  ctx.fillStyle=C.ink;for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);
  blob(ctx,W/2,266,185,'rgba(111,142,120,0.30)',1,64);
  stack(ctx,W/2,330,150,6,6);
  T(ctx,'Cairn',W/2,404,`800 30px ${F.b}`,C.ink,'center');
  T(ctx,'Money that shows its',W/2,470,`300 29px ${F.b}`,C.ink,'center');
  T(ctx,'working.',W/2,504,`300 29px ${F.b}`,C.ink,'center');
  T(ctx,'Every payment is screened the moment you',W/2,548,`500 13px ${F.b}`,C.grey,'center');
  T(ctx,'make it — and we show you exactly what we saw.',W/2,568,`500 13px ${F.b}`,C.grey,'center');
  btn(ctx,20,690,W-40,56,'Build your cairn',C.ink,'#fff');
  btn(ctx,20,754,W-40,50,'I already have one',null,C.grey,'#DCDFDB');
}

export function CALIBRATE(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,C.ink);
  ctx.fillStyle=C.ink;for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);
  blob(ctx,W/2,278,170,'rgba(111,142,120,0.28)',1,60);
  stack(ctx,W/2,340,140,5,3);
  T(ctx,'Setting your stones',W/2,412,`800 24px ${F.b}`,C.ink,'center');
  T(ctx,'One-time setup · nothing leaves this device',W/2,436,`500 12px ${F.b}`,C.grey,'center');
  card(ctx,20,470,W-40,236,26);
  [['Reading device fingerprint',1],['Sealing keys in the enclave',1],
   ['Learning your spending rhythm',1],['Arming the fraud model',0]].forEach(([n,on],i)=>{
    const y=516+i*54;
    bullet(ctx,52,y-5,on);
    T(ctx,n,78,y,`600 13.5px ${F.b}`,on?C.ink:C.grey);});
}

export function FACEID(ctx){
  ctx.setTransform(1,0,0,1,0,0);const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,C.ink);
  ctx.fillStyle=C.ink;for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);
  blob(ctx,W/2,330,160,'rgba(111,142,120,0.30)',1,58);
  const cx=W/2, cy=330, hx=50, hy=63;
  /* depth-scan wireframe */
  ctx.save();
  ctx.beginPath();ctx.ellipse(cx,cy,hx,hy,0,0,7);ctx.clip();
  ctx.strokeStyle='rgba(111,142,120,0.38)';ctx.lineWidth=1;ctx.lineCap='butt';
  for(let i=-3;i<=3;i++){const y=cy+i*18;
    ctx.beginPath();ctx.moveTo(cx-hx,y);ctx.quadraticCurveTo(cx,y+10,cx+hx,y);ctx.stroke();}
  for(let j=-2;j<=2;j++){const x=cx+j*21;
    ctx.beginPath();ctx.moveTo(x,cy-hy);ctx.quadraticCurveTo(x+j*5,cy,x,cy+hy);ctx.stroke();}
  ctx.strokeStyle=C.sage;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(cx-hx,cy-9);ctx.quadraticCurveTo(cx,cy+1,cx+hx,cy-9);ctx.stroke();
  ctx.restore();
  ctx.strokeStyle='rgba(111,142,120,0.65)';ctx.lineWidth=1.4;
  ctx.beginPath();ctx.ellipse(cx,cy,hx,hy,0,0,7);ctx.stroke();
  /* registration brackets */
  ctx.strokeStyle=C.sage;ctx.lineWidth=2.8;ctx.lineCap='round';
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{
    const x=cx+sx*62,y=cy+sy*74;
    ctx.beginPath();ctx.moveTo(x,y-sy*14);ctx.lineTo(x,y);ctx.lineTo(x-sx*14,y);ctx.stroke();});
  T(ctx,'Set up Face ID',W/2,474,`800 24px ${F.b}`,C.ink,'center');
  T(ctx,'Your face becomes the key. Payments can only',W/2,506,`500 13px ${F.b}`,C.grey,'center');
  T(ctx,'be approved by you, on this device.',W/2,526,`500 13px ${F.b}`,C.grey,'center');
  btn(ctx,20,690,W-40,56,'Enable Face ID',C.ink,'#fff');
  btn(ctx,20,754,W-40,50,'Set up later',null,C.grey,'#DCDFDB');
}

export function HOME(ctx){
  ctx.setTransform(1,0,0,1,0,0);
  const sc=ctx.canvas.width/W;ctx.scale(sc,sc);
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);

  /* status bar */
  T(ctx,'9:41',22,34,`700 15px ${F.b}`,C.ink);
  ctx.fillStyle=C.ink;
  for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);

  const M=20;
  /* two-tone masthead, the way the reference stacks it */
  T(ctx,'Cairn',M,84,`800 26px ${F.b}`,C.ink);
  T(ctx,'Today',M,112,`500 26px ${F.b}`,C.grey);
  ctx.strokeStyle=C.grey;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(352,92);ctx.lineTo(359,99);ctx.lineTo(366,92);ctx.stroke();

  /* balance */
  washed(ctx,M,132,W-M*2,116,26,()=>blob(ctx,W-70,240,120,'rgba(111,142,120,0.30)',1,40));
  T(ctx,'Total balance',M+22,166,`500 13px ${F.b}`,C.grey);
  ctx.font=`300 42px ${F.b}`;
  const cw=ctx.measureText('.18').width;
  T(ctx,'.18',W-M-22,216,`300 42px ${F.b}`,C.faint,'right');
  T(ctx,'$8,642',W-M-22-cw,216,`300 42px ${F.b}`,C.ink,'right');
  pill(ctx,M+22,196,'+2.4% this week',C.sageWash,C.sage);

  /* trust — the stack is the instrument */
  washed(ctx,M,260,W-M*2,214,26,()=>blob(ctx,M+118,400,130,'rgba(111,142,120,0.26)',1,50));
  T(ctx,'Trust',M+22,294,`700 15px ${F.b}`,C.ink);
  T(ctx,'Five of six set',M+22,314,`500 15px ${F.b}`,C.grey);
  stack(ctx,M+104,456,92);
  T(ctx,'96',W-M-22,420,`300 60px ${F.b}`,C.ink,'right');
  T(ctx,'of 100',W-M-22,444,`500 12px ${F.b}`,C.grey,'right');

  /* the exception */
  washed(ctx,M,486,W-M*2,104,26,()=>blob(ctx,W-60,600,110,'rgba(201,85,60,0.24)',1,40),C.alarmWash);
  T(ctx,'Held for review',M+22,518,`700 13px ${F.b}`,C.alarm);
  T(ctx,'$482.00',M+22,556,`300 30px ${F.b}`,C.ink);
  T(ctx,'DNH*LUMOSTORE LTD · 5 signals',M+22,576,`500 11px ${F.b}`,C.grey);
  ctx.fillStyle=C.alarm;ctx.beginPath();ctx.arc(W-M-40,546,20,0,7);ctx.fill();
  ctx.strokeStyle='#fff';ctx.lineWidth=1.8;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(W-M-47,553);ctx.lineTo(W-M-33,539);
  ctx.moveTo(W-M-44,539);ctx.lineTo(W-M-33,539);ctx.lineTo(W-M-33,550);ctx.stroke();

  /* today — a real axis, drawn softly */
  card(ctx,M,602,W-M*2,152,26);
  T(ctx,'Screened today',M+22,634,`700 13px ${F.b}`,C.ink);
  T(ctx,'6',W-M-22,634,`700 13px ${F.b}`,C.grey,'right');
  const gx0=M+22,gx1=W-M-22,gy0=652,gy1=712;
  ctx.strokeStyle='#E8EAE7';ctx.lineWidth=1;ctx.setLineDash([2,4]);
  for(let i=0;i<3;i++){const y=gy0+i*((gy1-gy0)/2);
    ctx.beginPath();ctx.moveTo(gx0,y+.5);ctx.lineTo(gx1,y+.5);ctx.stroke();}
  ctx.setLineDash([]);
  /* the day's screenings as a soft field with one spike held */
  const pts=[[0,0.05],[0.2,0.08],[0.34,0.30],[0.37,0.92],[0.4,0.26],[0.52,0.34],
             [0.66,0.18],[0.74,0.28],[0.86,0.40],[1,0.16]];
  ctx.beginPath();
  pts.forEach(([f,v],i)=>{const x=gx0+(gx1-gx0)*f,y=gy1-(gy1-gy0)*v;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.lineTo(gx1,gy1);ctx.lineTo(gx0,gy1);ctx.closePath();
  const ag=ctx.createLinearGradient(0,gy0,0,gy1);
  ag.addColorStop(0,'rgba(111,142,120,0.26)');ag.addColorStop(1,'rgba(111,142,120,0.02)');
  ctx.fillStyle=ag;ctx.fill();
  ctx.beginPath();
  pts.forEach(([f,v],i)=>{const x=gx0+(gx1-gx0)*f,y=gy1-(gy1-gy0)*v;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.strokeStyle=C.sage;ctx.lineWidth=1.6;ctx.stroke();
  const hx=gx0+(gx1-gx0)*0.37, hy=gy1-(gy1-gy0)*0.92;
  ctx.strokeStyle=C.alarm;ctx.setLineDash([2,3]);ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx,gy1);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=C.alarm;ctx.beginPath();ctx.arc(hx,hy,3.4,0,7);ctx.fill();
  pill(ctx,hx+8,hy-10,'1 held · 08:51',C.alarmWash,C.alarm);
  ['00','06','12','18','24'].forEach((l,i)=>
    T(ctx,l,gx0+(gx1-gx0)*(i/4),730,`500 9px ${F.b}`,C.faint,'center',0.4));

  /* floating tab bar */
  card(ctx,M+14,770,W-(M+14)*2,56,28);
  const tabs=['Home','Activity','Pay','Security','Profile'];
  const tw=(W-(M+14)*2)/5;
  tabs.forEach((t,i)=>{
    const cx=M+14+tw*i+tw/2;
    if(i===0){ctx.fillStyle=C.ink;RR(ctx,cx-tw/2+5,778,tw-10,40,20);ctx.fill();}
    T(ctx,t,cx,803,`600 10.5px ${F.b}`,i===0?'#fff':C.grey,'center');});
}
