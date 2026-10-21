/* Cairn — five palettes drawn from upland stone, shown as swatches and applied.
   Each keeps the two-ink logic: ink for structure, one spot for the model's own
   marks, one alarm reserved for a held payment. Verified gets no colour at all. */
export const W = 920, H = 1360;
const F = {};
export function init(){ F.n="'Martian Mono',monospace"; F.u="'Archivo',sans-serif"; }

const P = [
 {k:'PLASTER', n:'lime wash, umber, verdigris, vermilion',
  st:'#D3C8B6', ink:'#241C16', spot:'#46615A', alarm:'#B2361A'},
 {k:'OCHRE', n:'raw sienna ground, deep umber, bone marks',
  st:'#C2A079', ink:'#2A1E14', spot:'#3C5048', alarm:'#8E2310'},
 {k:'PATINA', n:'oxidised copper, chalk, iron oxide',
  st:'#A3B0A4', ink:'#1F2622', spot:'#2E3B36', alarm:'#AF3A1C'},
 {k:'UMBER', n:'fired clay after dark, bronze, hot rust',
  st:'#1F1811', ink:'#DACDB9', spot:'#B08A4A', alarm:'#E0592B', dark:true},
 {k:'KILN', n:'near-black, bone, one saturated mark',
  st:'#171412', ink:'#D9CFC0', spot:'#7E8A80', alarm:'#E2512A', dark:true},
];

/* the stock is a material, so it is mottled rather than flat */
function mottle(ctx,x,y,w,h,dark){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  for(let i=0;i<w*h/90;i++){
    const px=x+Math.random()*w, py=y+Math.random()*h, r=Math.random()*5+1.5;
    ctx.fillStyle=`rgba(${dark?'255,255,255':'0,0,0'},${Math.random()*0.022})`;
    ctx.beginPath();ctx.arc(px,py,r,0,7);ctx.fill();}
  ctx.restore();}

function T(ctx,s,x,y,font,fill,align='left',track=0){
  ctx.font=font;ctx.fillStyle=fill;ctx.textAlign=align;ctx.textBaseline='alphabetic';
  ctx.letterSpacing=track+'px';ctx.fillText(s,x,y);ctx.letterSpacing='0px';}
const al=(hex,a)=>{const n=parseInt(hex.slice(1),16);
  return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};

/* the mark: four stones finding balance */
function cairn(ctx,cx,base,s,col){
  /* weights and tilts are uneven on purpose — a stack holds by balance, not symmetry */
  const stones=[[1.00,0.30,-0.04,0.00],[0.74,0.25,0.07,-0.03],
                [0.55,0.21,-0.09,0.04],[0.33,0.17,0.12,-0.02]];
  let y=base;
  ctx.fillStyle=col;
  stones.forEach(([w,h,rot,dx])=>{
    const ww=w*s, hh=h*s*0.60;
    y-=hh;
    ctx.beginPath();
    ctx.ellipse(cx+dx*s, y+hh/2, ww/2, hh/2, rot, 0, 7);
    ctx.fill();
    y-=s*0.015;
  });
}

function sample(ctx,x,y,w,h,p){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  ctx.fillStyle=p.st;ctx.fillRect(x,y,w,h);mottle(ctx,x,y,w,h,p.dark);
  const ink=p.ink, mute=al(p.ink,0.5), faint=al(p.ink,0.3), line=al(p.ink,0.2);
  const AX=x+96, BX=x+w-104;
  ctx.strokeStyle=line;ctx.lineWidth=1;
  [AX,BX].forEach(vx=>{ctx.beginPath();ctx.moveTo(vx+.5,y);ctx.lineTo(vx+.5,y+h);ctx.stroke();});
  ctx.beginPath();ctx.moveTo(x,y+64.5);ctx.lineTo(x+w,y+64.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,y+118.5);ctx.lineTo(x+w,y+118.5);ctx.stroke();

  T(ctx,'BALANCE',x+14,y+38,`500 9px ${F.n}`,faint,'left',1.6);
  ctx.font=`600 22px ${F.n}`;const a='$8,642.';
  T(ctx,'18',x+w-14,y+42,`600 22px ${F.n}`,faint,'right');
  T(ctx,a,x+w-14-ctx.measureText('18').width,y+42,`600 22px ${F.n}`,ink,'right');

  T(ctx,'TRUST',x+14,y+96,`500 9px ${F.n}`,mute,'left',1.6);
  const t0=AX+12,t1=BX-12;
  ctx.strokeStyle=al(p.ink,0.16);ctx.beginPath();
  ctx.moveTo(t0,y+91.5);ctx.lineTo(t1,y+91.5);ctx.stroke();
  ctx.strokeStyle=p.spot;ctx.beginPath();
  ctx.moveTo(t0,y+91.5);ctx.lineTo(t0+(t1-t0)*0.96,y+91.5);ctx.stroke();
  ctx.fillStyle=p.spot;ctx.fillRect(t0+(t1-t0)*0.96-1,y+85,2,13);
  T(ctx,'96',x+w-14,y+96,`500 11px ${F.n}`,ink,'right',0.8);

  T(ctx,'HELD',x+14,y+150,`500 9px ${F.n}`,p.alarm,'left',1.6);
  ctx.font=`600 20px ${F.n}`;const b='$482.';
  T(ctx,b,AX+12,y+156,`600 20px ${F.n}`,ink);
  T(ctx,'00',AX+12+ctx.measureText(b).width,y+156,`600 20px ${F.n}`,faint);
  T(ctx,'5 SIGNALS',x+w-14,y+156,`500 9px ${F.n}`,p.alarm,'right',0.8);

  cairn(ctx,x+48,y+h-20,56,p.spot);
  ctx.restore();
  ctx.strokeStyle=al(p.dark?'#FFFFFF':'#000000',0.18);ctx.lineWidth=1;
  ctx.strokeRect(x+.5,y+.5,w-1,h-1);
}

export function draw(ctx){
  ctx.setTransform(1,0,0,1,0,0);
  const s=ctx.canvas.width/W;ctx.scale(s,s);
  ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,W,H);
  T(ctx,'CAIRN — PALETTE STUDIES',40,48,`500 12px ${F.n}`,'#111','left',2.4);
  T(ctx,'stock · ink · spot (the model) · alarm (held only)',40,68,`400 12px ${F.u}`,'#777');

  P.forEach((p,i)=>{
    const y=96+i*250;
    T(ctx,p.k,40,y+26,`500 11px ${F.n}`,'#111','left',1.6);
    T(ctx,p.n,40,y+44,`400 12px ${F.u}`,'#888');
    [['st','STOCK'],['ink','INK'],['spot','SPOT'],['alarm','ALARM']].forEach(([key,lab],j)=>{
      const cx=40+j*86, cy=y+62;
      ctx.fillStyle=p[key];ctx.fillRect(cx,cy,68,68);mottle(ctx,cx,cy,68,68,key==='ink'||p.dark&&key==='st');
      ctx.strokeStyle='rgba(0,0,0,0.16)';ctx.lineWidth=1;ctx.strokeRect(cx+.5,cy+.5,67,67);
      T(ctx,lab,cx,cy+86,`500 8px ${F.n}`,'#999','left',1);
      T(ctx,p[key].toUpperCase(),cx,cy+100,`500 9px ${F.n}`,'#333','left',0.6);
    });
    sample(ctx,400,y+18,480,206,p);
  });
}
