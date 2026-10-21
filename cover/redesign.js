/* Three visual directions for the TruePay app, shown as the Home screen.
   Common rule in all three: no gradients, no glows, no blur, no aurora. */
export const W = 390, H = 844;
const C = {}, F = {};
function px(css){const c=document.createElement('canvas');c.width=c.height=1;
  const g=c.getContext('2d',{willReadFrequently:true});g.clearRect(0,0,1,1);
  g.fillStyle=css;g.fillRect(0,0,1,1);const d=g.getImageData(0,0,1,1).data;
  return [d[0],d[1],d[2],d[3]/255];}
export function init(){
  C.iris=px('#8A5CFF');
  F.s="'Instrument Serif',serif"; F.b="'Manrope',sans-serif"; F.m="'JetBrains Mono',monospace";
  F.n="'Martian Mono',monospace"; F.u="'Archivo',sans-serif";
}
const rgba=(c,a=1)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
function T(ctx,s,x,y,font,fill,align='left',track=0){
  ctx.font=font;ctx.fillStyle=fill;ctx.textAlign=align;ctx.textBaseline='alphabetic';
  ctx.letterSpacing=track+'px';ctx.fillText(s,x,y);ctx.letterSpacing='0px';}
function rule(ctx,x1,y,x2,col,w=1){ctx.strokeStyle=col;ctx.lineWidth=w;
  ctx.beginPath();ctx.moveTo(x1,y+0.5);ctx.lineTo(x2,y+0.5);ctx.stroke();}
function status(ctx,ink){
  T(ctx,'9:41',22,34,`600 15px ${F.b}`,ink);
  ctx.fillStyle=ink;
  for(let i=0;i<4;i++)ctx.fillRect(330+i*5,30-i*2,3.4,4+i*2);
  ctx.fillRect(354,22,22,10);}
/* banknote line-work — the one real material already in the product */
function guilloche(ctx,cx,cy,R,col,a){
  ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=0.4;
  for(let k=0;k<22;k++){
    const Rr=R,r=R*(0.24+0.028*k),d=R*(0.38-0.009*k);
    ctx.beginPath();
    for(let i=0;i<=200;i++){const t=(i/200)*Math.PI*2*3;
      const x=cx+(Rr-r)*Math.cos(t)+d*Math.cos(((Rr-r)/r)*t);
      const y=cy+(Rr-r)*Math.sin(t)-d*Math.sin(((Rr-r)/r)*t);
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    ctx.stroke();}
  ctx.restore();}

function cluster(ctx,x,y,hs,col,gap=4.6,w=1.4){
  hs.forEach((h,i)=>{ctx.strokeStyle=col(i);ctx.lineWidth=w;
    ctx.beginPath();ctx.moveTo(x+i*gap+0.5,y);ctx.lineTo(x+i*gap+0.5,y-h);ctx.stroke();});}
const HS=[14,20,11,26,17,13,30,12,22,15,24,18,11,27,16,21,13,44,19,14,23,12,20,16,25,13,18,22,15,11];
const ACT=[['Cafe Lumière','9:24 AM · dining','−18.40','ok'],
           ['GX Digital Goods','8:51 AM · online','−482.00','held'],
           ['Daniel Reyes','yest · transfer','+120.00','ok']];

/* ═══ R1 — ENGRAVED: hairlines, no cards, the guilloché made visible ═══ */
function R1(ctx){
  const ink='#0F0E11', paper='#EDE9E0', dim='rgba(237,233,224,0.52)',
        faint='rgba(237,233,224,0.34)', line='rgba(237,233,224,0.16)', acc='#B9A36B';
  ctx.fillStyle=ink;ctx.fillRect(0,0,W,H);
  status(ctx,paper);
  const M=22;
  T(ctx,'TRUEPAY',M,76,`500 11px ${F.m}`,faint,'left',2.4);
  T(ctx,'MAYA OKONKWO',W-M,76,`500 11px ${F.m}`,faint,'right',2.4);
  rule(ctx,M,92,W-M,line);
  guilloche(ctx,W/2,196,120,acc,0.3);
  T(ctx,'BALANCE',M,128,`500 11px ${F.m}`,faint,'left',2.4);
  T(ctx,'8,642.18',M,196,`400 68px ${F.s}`,paper);
  T(ctx,'$',M,152,`400 20px ${F.s}`,acc);
  T(ctx,'+2.4% THIS WEEK',M,224,`500 11px ${F.m}`,acc,'left',1.6);
  T(ctx,'•••• 4827',W-M,224,`500 11px ${F.m}`,faint,'right',1.6);
  rule(ctx,M,248,W-M,line);
  ['SEND','REQUEST','SCAN','CARDS'].forEach((s,i)=>
    T(ctx,s,M+i*87,278,`500 11px ${F.m}`,paper,'left',1.4));
  rule(ctx,M,296,W-M,line);
  /* the hold is the one thing allowed to interrupt the rules */
  ctx.fillStyle='#2A1116';ctx.fillRect(0,312,W,76);
  T(ctx,'HELD FOR REVIEW',M,338,`500 11px ${F.m}`,'#E2654F','left',2);
  T(ctx,'$482.00',M,370,`400 30px ${F.s}`,paper);
  T(ctx,'GX DIGITAL GOODS · 5 SIGNALS',W-M,370,`500 10px ${F.m}`,'rgba(226,101,79,0.75)','right',1.2);
  T(ctx,'TRUST',M,430,`500 11px ${F.m}`,faint,'left',2.4);
  T(ctx,'96',W-M,430,`500 11px ${F.m}`,paper,'right',1.6);
  rule(ctx,M,444,W-M,line);
  for(let i=0;i<24;i++){const h=i===17?16:i===6?12:7;
    ctx.fillStyle=i===17?'#E2654F':i===6?acc:'rgba(237,233,224,0.3)';
    ctx.fillRect(M+i*14.2,470-h,7,h);}
  T(ctx,'SCREENED TODAY',M,492,`500 10px ${F.m}`,faint,'left',1.6);
  T(ctx,'ACTIVITY',M,540,`500 11px ${F.m}`,faint,'left',2.4);
  rule(ctx,M,552,W-M,line);
  ACT.forEach(([n,s,amt,st],i)=>{const y=584+i*52;
    T(ctx,n,M,y,`500 15px ${F.b}`,paper);
    T(ctx,s,M,y+17,`400 10px ${F.m}`,faint,'left',0.8);
    T(ctx,amt,W-M,y,`500 15px ${F.m}`,st==='held'?'#E2654F':paper,'right');
    T(ctx,st==='held'?'HELD':'VERIFIED',W-M,y+17,`500 9px ${F.m}`,st==='held'?'#E2654F':acc,'right',1.2);
    rule(ctx,M,y+32,W-M,line);});
  rule(ctx,0,784,W,line);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s,i)=>
    T(ctx,s,30+i*78,812,`500 10px ${F.m}`,i===0?paper:faint,'center',1.2));
}

/* ═══ R2 — STATEMENT: light, paper, a passbook rather than an app ═══ */
function R2(ctx){
  const paper='#F2F0E9', ink='#15140F', dim='rgba(21,20,15,0.56)',
        faint='rgba(21,20,15,0.38)', line='rgba(21,20,15,0.14)', acc='#2F5D43', red='#A8321F';
  ctx.fillStyle=paper;ctx.fillRect(0,0,W,H);
  status(ctx,ink);
  const M=24;
  T(ctx,'TruePay',M,74,`400 22px ${F.s}`,ink);
  T(ctx,'MO',W-M,74,`500 11px ${F.m}`,faint,'right',1.6);
  rule(ctx,M,90,W-M,line);
  T(ctx,'Total balance',M,124,`400 13px ${F.b}`,dim);
  T(ctx,'$8,642.18',M,186,`400 56px ${F.s}`,ink);
  T(ctx,'+2.4% this week',M,212,`500 11px ${F.m}`,acc,'left',0.8);
  T(ctx,'•••• 4827',W-M,212,`500 11px ${F.m}`,faint,'right',0.8);
  rule(ctx,M,236,W-M,line,1);
  ['Send','Request','Scan','Cards'].forEach((s,i)=>{
    T(ctx,s,M+i*88,266,`500 13px ${F.b}`,ink);});
  rule(ctx,M,284,W-M,line);
  ctx.fillStyle='#F7E9E4';ctx.fillRect(M,302,W-M*2,84);
  ctx.strokeStyle=red;ctx.lineWidth=1.5;ctx.beginPath();
  ctx.moveTo(M,302);ctx.lineTo(M,386);ctx.stroke();
  T(ctx,'HELD FOR REVIEW',M+16,328,`500 10px ${F.m}`,red,'left',1.8);
  T(ctx,'$482.00',M+16,362,`400 28px ${F.s}`,ink);
  T(ctx,'GX Digital Goods',W-M-16,362,`400 12px ${F.b}`,dim,'right');
  T(ctx,'Trust',M,428,`400 13px ${F.b}`,dim);
  T(ctx,'96 / 100',W-M,428,`500 12px ${F.m}`,ink,'right',0.8);
  rule(ctx,M,442,W-M,line);
  for(let i=0;i<24;i++){const h=i===17?15:i===6?11:6;
    ctx.fillStyle=i===17?red:i===6?'#B07A1E':'rgba(21,20,15,0.22)';
    ctx.fillRect(M+i*14.1,470-h,7,h);}
  T(ctx,'6 screened today · 1 held',M,492,`400 11px ${F.b}`,faint);
  T(ctx,'Activity',M,538,`400 18px ${F.s}`,ink);
  rule(ctx,M,550,W-M,line);
  ACT.forEach(([n,s,amt,st],i)=>{const y=582+i*52;
    T(ctx,n,M,y,`500 14px ${F.b}`,ink);
    T(ctx,s,M,y+17,`400 11px ${F.m}`,faint,'left',0.5);
    T(ctx,amt,W-M,y,`500 14px ${F.m}`,st==='held'?red:ink,'right');
    T(ctx,st==='held'?'held':'verified',W-M,y+17,`400 10px ${F.m}`,st==='held'?red:acc,'right',0.5);
    rule(ctx,M,y+32,W-M,line);});
  rule(ctx,0,784,W,line);
  ['Home','Activity','Pay','Security','Profile'].forEach((s,i)=>
    T(ctx,s,30+i*78,812,`500 11px ${F.b}`,i===0?ink:faint,'center'));
}

/* ═══ R3 — INSTRUMENT: flat panels, hard edges, mono-forward ═══ */
function R3(ctx){
  const bg='#0A0A0B', pan='#141417', ink='#F4F4F2', dim='rgba(244,244,242,0.5)',
        faint='rgba(244,244,242,0.3)', line='rgba(244,244,242,0.1)', acc='#C9F24D', red='#FF5A41';
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  status(ctx,ink);
  const M=0;
  ctx.fillStyle=pan;ctx.fillRect(0,52,W,2);
  T(ctx,'TRUEPAY / MAYA OKONKWO',16,76,`500 10px ${F.m}`,faint,'left',1.6);
  T(ctx,'TRUST 96',W-16,76,`500 10px ${F.m}`,acc,'right',1.6);
  ctx.fillStyle=pan;ctx.fillRect(0,88,W,112);
  T(ctx,'TOTAL BALANCE',16,112,`500 10px ${F.m}`,faint,'left',1.8);
  T(ctx,'8,642.18',16,172,`500 54px ${F.m}`,ink,'left',-2);
  T(ctx,'USD',W-16,172,`500 11px ${F.m}`,faint,'right',1.4);
  ['SEND','REQ','SCAN','CARD'].forEach((s,i)=>{
    const x=i*(W/4);ctx.fillStyle=pan;ctx.fillRect(x+1,208,W/4-2,40);
    T(ctx,s,x+W/8,233,`500 11px ${F.m}`,ink,'center',1.4);});
  ctx.fillStyle=red;ctx.fillRect(0,260,W,4);
  ctx.fillStyle='#1C0F10';ctx.fillRect(0,264,W,70);
  T(ctx,'HELD',16,290,`500 10px ${F.m}`,red,'left',2);
  T(ctx,'482.00',16,322,`500 26px ${F.m}`,ink,'left',-1);
  T(ctx,'GX DIGITAL GOODS',W-16,300,`500 10px ${F.m}`,dim,'right',1.2);
  T(ctx,'5 SIGNALS',W-16,320,`500 10px ${F.m}`,red,'right',1.2);
  T(ctx,'SCREENED TODAY',16,368,`500 10px ${F.m}`,faint,'left',1.6);
  T(ctx,'06 / 01 HELD',W-16,368,`500 10px ${F.m}`,dim,'right',1.2);
  for(let i=0;i<26;i++){const h=i===17?22:i===6?15:8;
    ctx.fillStyle=i===17?red:i===6?'#F0B13C':acc;
    ctx.globalAlpha=(i===17||i===6)?1:0.55;
    ctx.fillRect(16+i*14,392-h,8,h);}
  ctx.globalAlpha=1;
  rule(ctx,0,414,W,line);
  T(ctx,'ACTIVITY',16,440,`500 10px ${F.m}`,faint,'left',1.8);
  ACT.forEach(([n,s,amt,st],i)=>{const y=462+i*62;
    ctx.fillStyle=pan;ctx.fillRect(0,y,W,56);
    ctx.fillStyle=st==='held'?red:acc;ctx.fillRect(0,y,3,56);
    T(ctx,n.toUpperCase(),16,y+24,`500 12px ${F.m}`,ink,'left',0.6);
    T(ctx,s.toUpperCase(),16,y+42,`500 9px ${F.m}`,faint,'left',0.8);
    T(ctx,amt,W-16,y+24,`500 15px ${F.m}`,st==='held'?red:ink,'right');
    T(ctx,st.toUpperCase(),W-16,y+42,`500 9px ${F.m}`,st==='held'?red:acc,'right',1);});
  ctx.fillStyle=pan;ctx.fillRect(0,790,W,54);
  ['HOME','ACTV','PAY','SEC','PROF'].forEach((s,i)=>{
    const x=i*(W/5);
    if(i===0){ctx.fillStyle=acc;ctx.fillRect(x,790,W/5,3);}
    T(ctx,s,x+W/10,818,`500 10px ${F.m}`,i===0?acc:faint,'center',1.2);});
}

/* ═══ R4 — the statement, printed: R2's paper with R1's engraving ═══ */
function R4(ctx){
  const paper='#F2F0E9', ink='#15140F', dim='rgba(21,20,15,0.56)',
        faint='rgba(21,20,15,0.38)', line='rgba(21,20,15,0.14)',
        acc='#2F5D43', red='#A8321F';
  ctx.fillStyle=paper;ctx.fillRect(0,0,W,H);
  status(ctx,ink);
  const M=24;
  T(ctx,'TruePay',M,74,`400 22px ${F.s}`,ink);
  T(ctx,'MO',W-M,74,`500 11px ${F.m}`,faint,'right',1.6);
  rule(ctx,M,90,W-M,line);

  /* the engraving sits off to one side, the way a note carries its rosette,
     so the figures never have to fight it */
  guilloche(ctx,368,168,104,acc,0.17);

  T(ctx,'Total balance',M,124,`400 13px ${F.b}`,dim);
  T(ctx,'$8,642.18',M,186,`400 56px ${F.s}`,ink);
  T(ctx,'+2.4% this week',M,212,`500 11px ${F.m}`,acc,'left',0.8);
  T(ctx,'•••• 4827',W-M,212,`500 11px ${F.m}`,faint,'right',0.8);
  rule(ctx,M,236,W-M,line);

  ['Send','Request','Scan','Cards'].forEach((s2,i)=>
    T(ctx,s2,M+i*88,266,`500 13px ${F.b}`,ink));
  rule(ctx,M,284,W-M,line);

  ctx.fillStyle='#F7E9E4';ctx.fillRect(M,302,W-M*2,84);
  ctx.strokeStyle=red;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(M,302);ctx.lineTo(M,386);ctx.stroke();
  T(ctx,'HELD FOR REVIEW',M+16,328,`500 10px ${F.m}`,red,'left',1.8);
  T(ctx,'$482.00',M+16,362,`400 28px ${F.s}`,ink);
  T(ctx,'GX Digital Goods',W-M-16,362,`400 12px ${F.b}`,dim,'right');

  T(ctx,'Trust',M,428,`400 13px ${F.b}`,dim);
  T(ctx,'96 / 100',W-M,428,`500 12px ${F.m}`,ink,'right',0.8);
  rule(ctx,M,442,W-M,line);
  /* a meter, not a row of squares — height carries the reading */
  const hs=[7,9,6,11,8,7,13,6,9,7,10,8,6,11,7,9,6,19,8,7,10,6,9,7];
  hs.forEach((h,i)=>{
    const flag=i===17?red:i===6?'#B07A1E':null;
    ctx.fillStyle=flag||'rgba(21,20,15,0.26)';
    ctx.fillRect(M+i*14.1,472-h,6.5,h);});
  T(ctx,'6 screened today · 1 held',M,494,`400 11px ${F.b}`,faint);

  T(ctx,'Activity',M,540,`400 18px ${F.s}`,ink);
  rule(ctx,M,552,W-M,line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=584+i*52;
    T(ctx,n,M,y,`500 14px ${F.b}`,ink);
    T(ctx,s2,M,y+17,`400 11px ${F.m}`,faint,'left',0.5);
    T(ctx,amt,W-M,y,`500 14px ${F.m}`,st==='held'?red:ink,'right');
    T(ctx,st==='held'?'held':'verified',W-M,y+17,`400 10px ${F.m}`,st==='held'?red:acc,'right',0.5);
    rule(ctx,M,y+32,W-M,line);});

  rule(ctx,0,784,W,line);
  ['Home','Activity','Pay','Security','Profile'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,812,`500 11px ${F.b}`,i===0?ink:faint,'center'));
}

/* ═══ R5 — sage stock, terracotta states, ruled line-work doing the data ═══ */
function R5(ctx){
  const bg='#D4D6C4', ink='#22251C', mute='rgba(34,37,28,0.52)',
        faint='rgba(34,37,28,0.34)', line='rgba(34,37,28,0.26)',
        terra='#D9603C', terraInk='#FBEDE7';
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  status(ctx,ink);
  const M=22;

  /* avatar + menu, as the reference frames it */
  ctx.fillStyle='rgba(34,37,28,0.14)';ctx.beginPath();ctx.arc(M+19,82,19,0,7);ctx.fill();
  T(ctx,'MO',M+19,87,`600 12px ${F.n}`,ink,'center');
  ctx.fillStyle=faint;
  for(let r=0;r<3;r++)for(let c=0;c<3;c++)ctx.fillRect(W-M-16+c*7,74+r*7,2.6,2.6);

  /* the engraving, tonal and bled off the right */
  guilloche(ctx,372,214,112,ink,0.13);

  T(ctx,'AVAILABLE BALANCE',M,140,`500 10px ${F.n}`,mute,'left',1.2);
  /* figures carry the weight; the cents step back a tone */
  ctx.font=`600 34px ${F.n}`;const head='$8,642.';
  T(ctx,head,M,184,`600 34px ${F.n}`,ink);
  T(ctx,'18',M+ctx.measureText(head).width,184,`600 34px ${F.n}`,faint);

  /* ruled clusters replace bars — the structural line-work from the reference */
  const cluster=(x,y,n,hs,col,gap=4)=>{
    hs.forEach((h,i)=>{ctx.strokeStyle=col(i);ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(x+i*gap+0.5,y);ctx.lineTo(x+i*gap+0.5,y-h);ctx.stroke();});};

  T(ctx,'SCREENED TODAY',M,224,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'06 / 01 HELD',W-M,224,`500 10px ${F.n}`,ink,'right',1.2);
  rule(ctx,M,234,W-M,line);
  const hs1=[14,20,11,26,17,13,30,12,22,15,24,18,11,27,16,21,13,44,19,14,23,12,20,16,25,13,18,22,15,11];
  cluster(M,296,30,hs1,i=>i===17?terra:i===6?'#B07A1E':'rgba(34,37,28,0.42)',4.6);

  T(ctx,'TRUST',M,336,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'96 / 100',W-M,336,`500 10px ${F.n}`,ink,'right',1.2);
  rule(ctx,M,346,W-M,line);
  const hs2=Array.from({length:30},(_,i)=>i<29?34:10);
  cluster(M,390,30,hs2,i=>i<29?'rgba(34,37,28,0.62)':'rgba(34,37,28,0.18)',4.6);

  /* the state is a block of colour, not a tinted card */
  ctx.fillStyle=terra;ctx.fillRect(0,424,W,132);
  ctx.strokeStyle=terraInk;ctx.lineWidth=1.3;ctx.strokeRect(M+0.5,452.5,15,15);
  T(ctx,'!',M+8,464,`600 10px ${F.n}`,terraInk,'center');
  T(ctx,'HELD FOR REVIEW',M+26,464,`500 10px ${F.n}`,terraInk,'left',1.4);
  ctx.font=`600 30px ${F.n}`;const h2='$482.';
  T(ctx,h2,M,512,`600 30px ${F.n}`,terraInk);
  T(ctx,'00',M+ctx.measureText(h2).width,512,`600 30px ${F.n}`,'rgba(251,237,231,0.56)');
  T(ctx,'GX DIGITAL GOODS · 5 SIGNALS',M,536,`500 10px ${F.n}`,'rgba(251,237,231,0.72)','left',1);
  ctx.fillStyle='rgba(251,237,231,0.2)';ctx.beginPath();ctx.arc(W-M-22,500,22,0,7);ctx.fill();
  ctx.strokeStyle=terraInk;ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(W-M-29,507);ctx.lineTo(W-M-15,493);
  ctx.moveTo(W-M-26,493);ctx.lineTo(W-M-15,493);ctx.lineTo(W-M-15,504);ctx.stroke();

  T(ctx,'ACTIVITY',M,604,`500 10px ${F.n}`,mute,'left',1.2);
  rule(ctx,M,614,W-M,line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=646+i*50;
    T(ctx,n,M,y,`500 14px ${F.u}`,ink);
    T(ctx,s2.toUpperCase(),M,y+16,`400 9px ${F.n}`,faint,'left',0.8);
    T(ctx,amt,W-M,y,`500 14px ${F.n}`,st==='held'?terra:ink,'right');
    T(ctx,st.toUpperCase(),W-M,y+16,`500 9px ${F.n}`,st==='held'?terra:mute,'right',1);
    rule(ctx,M,y+30,W-M,line);});

  rule(ctx,0,788,W,line);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,814,`500 9px ${F.n}`,i===0?ink:faint,'center',0.8));
}

/* ═══ V1 — bone stock, the engraving as a full field rather than a corner mark ═══ */
function V1(ctx){
  const bg='#E9E5D9',ink='#1A1A14',mute='rgba(26,26,20,0.54)',faint='rgba(26,26,20,0.34)',
        line='rgba(26,26,20,0.22)',terra='#B8482A';
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);status(ctx,ink);const M=22;
  guilloche(ctx,195,250,210,ink,0.11);
  T(ctx,'MO',M,84,`600 11px ${F.n}`,mute,'left',1.2);
  T(ctx,'TRUEPAY',W-M,84,`500 10px ${F.n}`,faint,'right',2);
  rule(ctx,M,98,W-M,line);
  T(ctx,'AVAILABLE BALANCE',M,140,`500 10px ${F.n}`,mute,'left',1.2);
  ctx.font=`600 34px ${F.n}`;const a='$8,642.';
  T(ctx,a,M,186,`600 34px ${F.n}`,ink);
  T(ctx,'18',M+ctx.measureText(a).width,186,`600 34px ${F.n}`,faint);
  rule(ctx,M,212,W-M,line);
  T(ctx,'SCREENED TODAY',M,244,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'06 / 01 HELD',W-M,244,`500 10px ${F.n}`,ink,'right',1.2);
  cluster(ctx,M,306,HS,i=>i===17?terra:i===6?'#A8812A':'rgba(26,26,20,0.40)');
  rule(ctx,M,324,W-M,line);
  T(ctx,'TRUST',M,356,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'96 / 100',W-M,356,`500 10px ${F.n}`,ink,'right',1.2);
  cluster(ctx,M,400,HS.map((h,i)=>i<29?30:9),i=>i<29?'rgba(26,26,20,0.55)':'rgba(26,26,20,0.16)');
  rule(ctx,M,418,W-M,line);
  /* the hold stays on the stock — a ruled band, not a block of colour */
  ctx.strokeStyle=terra;ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(M,446);ctx.lineTo(M,540);ctx.stroke();
  T(ctx,'HELD FOR REVIEW',M+16,470,`500 10px ${F.n}`,terra,'left',1.4);
  ctx.font=`600 28px ${F.n}`;const b='$482.';
  T(ctx,b,M+16,508,`600 28px ${F.n}`,ink);
  T(ctx,'00',M+16+ctx.measureText(b).width,508,`600 28px ${F.n}`,'rgba(26,26,20,0.32)');
  T(ctx,'GX DIGITAL GOODS · 5 SIGNALS',M+16,532,`500 10px ${F.n}`,mute,'left',1);
  rule(ctx,M,566,W-M,line);
  T(ctx,'ACTIVITY',M,598,`500 10px ${F.n}`,mute,'left',1.2);
  rule(ctx,M,608,W-M,line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=640+i*50;
    T(ctx,n,M,y,`500 14px ${F.u}`,ink);
    T(ctx,s2.toUpperCase(),M,y+16,`400 9px ${F.n}`,faint,'left',0.8);
    T(ctx,amt,W-M,y,`500 14px ${F.n}`,st==='held'?terra:ink,'right');
    T(ctx,st.toUpperCase(),W-M,y+16,`500 9px ${F.n}`,st==='held'?terra:mute,'right',1);
    rule(ctx,M,y+30,W-M,line);});
  rule(ctx,0,788,W,line);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,814,`500 9px ${F.n}`,i===0?ink:faint,'center',0.8));
}

/* ═══ V2 — the same system inverted, to see if it survives dark ═══ */
function V2(ctx){
  const bg='#191C15',ink='#DDE0CD',mute='rgba(221,224,205,0.54)',faint='rgba(221,224,205,0.30)',
        line='rgba(221,224,205,0.18)',terra='#E2683F';
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);status(ctx,ink);const M=22;
  guilloche(ctx,372,208,112,ink,0.16);
  ctx.fillStyle='rgba(221,224,205,0.12)';ctx.beginPath();ctx.arc(M+19,82,19,0,7);ctx.fill();
  T(ctx,'MO',M+19,87,`600 12px ${F.n}`,ink,'center');
  ctx.fillStyle=faint;for(let r=0;r<3;r++)for(let c=0;c<3;c++)ctx.fillRect(W-M-16+c*7,74+r*7,2.6,2.6);
  T(ctx,'AVAILABLE BALANCE',M,140,`500 10px ${F.n}`,mute,'left',1.2);
  ctx.font=`600 34px ${F.n}`;const a='$8,642.';
  T(ctx,a,M,184,`600 34px ${F.n}`,ink);
  T(ctx,'18',M+ctx.measureText(a).width,184,`600 34px ${F.n}`,faint);
  T(ctx,'SCREENED TODAY',M,224,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'06 / 01 HELD',W-M,224,`500 10px ${F.n}`,ink,'right',1.2);
  rule(ctx,M,234,W-M,line);
  cluster(ctx,M,296,HS,i=>i===17?terra:i===6?'#D8A33C':'rgba(221,224,205,0.44)');
  T(ctx,'TRUST',M,336,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'96 / 100',W-M,336,`500 10px ${F.n}`,ink,'right',1.2);
  rule(ctx,M,346,W-M,line);
  cluster(ctx,M,390,HS.map((h,i)=>i<29?32:9),i=>i<29?'rgba(221,224,205,0.6)':'rgba(221,224,205,0.16)');
  ctx.fillStyle=terra;ctx.fillRect(0,424,W,128);
  const ti='#1B0E09';
  ctx.strokeStyle=ti;ctx.lineWidth=1.3;ctx.strokeRect(M+0.5,452.5,15,15);
  T(ctx,'!',M+8,464,`600 10px ${F.n}`,ti,'center');
  T(ctx,'HELD FOR REVIEW',M+26,464,`500 10px ${F.n}`,ti,'left',1.4);
  ctx.font=`600 30px ${F.n}`;const b='$482.';
  T(ctx,b,M,510,`600 30px ${F.n}`,ti);
  T(ctx,'00',M+ctx.measureText(b).width,510,`600 30px ${F.n}`,'rgba(27,14,9,0.46)');
  T(ctx,'GX DIGITAL GOODS · 5 SIGNALS',M,534,`500 10px ${F.n}`,'rgba(27,14,9,0.7)','left',1);
  T(ctx,'ACTIVITY',M,600,`500 10px ${F.n}`,mute,'left',1.2);
  rule(ctx,M,610,W-M,line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=642+i*50;
    T(ctx,n,M,y,`500 14px ${F.u}`,ink);
    T(ctx,s2.toUpperCase(),M,y+16,`400 9px ${F.n}`,faint,'left',0.8);
    T(ctx,amt,W-M,y,`500 14px ${F.n}`,st==='held'?terra:ink,'right');
    T(ctx,st.toUpperCase(),W-M,y+16,`500 9px ${F.n}`,st==='held'?terra:mute,'right',1);
    rule(ctx,M,y+30,W-M,line);});
  rule(ctx,0,788,W,line);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,814,`500 9px ${F.n}`,i===0?ink:faint,'center',0.8));
}

/* ═══ V3 — two-tone: the instrument lives in its own field of colour ═══ */
function V3(ctx){
  const bg='#D7D9C7',ink='#20231A',mute='rgba(32,35,26,0.54)',faint='rgba(32,35,26,0.32)',
        line='rgba(32,35,26,0.24)',olive='#2E3327',sage='#C8CCB4',terra='#D9603C';
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);status(ctx,ink);const M=22;
  guilloche(ctx,368,180,104,ink,0.14);
  T(ctx,'MO',M,84,`600 11px ${F.n}`,mute,'left',1.2);
  T(ctx,'TRUEPAY',W-M,84,`500 10px ${F.n}`,faint,'right',2);
  T(ctx,'AVAILABLE BALANCE',M,132,`500 10px ${F.n}`,mute,'left',1.2);
  ctx.font=`600 36px ${F.n}`;const a='$8,642.';
  T(ctx,a,M,180,`600 36px ${F.n}`,ink);
  T(ctx,'18',M+ctx.measureText(a).width,180,`600 36px ${F.n}`,faint);
  /* the whole instrument sits on a field of its own */
  ctx.fillStyle=olive;ctx.fillRect(0,212,W,246);
  T(ctx,'SCREENED TODAY',M,248,`500 10px ${F.n}`,'rgba(200,204,180,0.6)','left',1.2);
  T(ctx,'06 / 01 HELD',W-M,248,`500 10px ${F.n}`,sage,'right',1.2);
  cluster(ctx,M,312,HS,i=>i===17?terra:i===6?'#D8A33C':'rgba(200,204,180,0.5)');
  rule(ctx,M,332,W-M,'rgba(200,204,180,0.2)');
  T(ctx,'TRUST',M,364,`500 10px ${F.n}`,'rgba(200,204,180,0.6)','left',1.2);
  T(ctx,'96 / 100',W-M,364,`500 10px ${F.n}`,sage,'right',1.2);
  cluster(ctx,M,412,HS.map((h,i)=>i<29?32:9),i=>i<29?'rgba(200,204,180,0.72)':'rgba(200,204,180,0.2)');
  T(ctx,'5 SIGNALS WEIGHED PER PAYMENT',M,440,`500 9px ${F.n}`,'rgba(200,204,180,0.42)','left',1);
  ctx.fillStyle=terra;ctx.fillRect(0,458,W,8);
  T(ctx,'HELD FOR REVIEW',M,502,`500 10px ${F.n}`,terra,'left',1.4);
  ctx.font=`600 28px ${F.n}`;const b='$482.';
  T(ctx,b,M,540,`600 28px ${F.n}`,ink);
  T(ctx,'00',M+ctx.measureText(b).width,540,`600 28px ${F.n}`,faint);
  T(ctx,'GX DIGITAL GOODS',W-M,540,`500 10px ${F.n}`,mute,'right',1);
  rule(ctx,M,572,W-M,line);
  T(ctx,'ACTIVITY',M,604,`500 10px ${F.n}`,mute,'left',1.2);
  rule(ctx,M,614,W-M,line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=646+i*50;
    T(ctx,n,M,y,`500 14px ${F.u}`,ink);
    T(ctx,s2.toUpperCase(),M,y+16,`400 9px ${F.n}`,faint,'left',0.8);
    T(ctx,amt,W-M,y,`500 14px ${F.n}`,st==='held'?terra:ink,'right');
    T(ctx,st.toUpperCase(),W-M,y+16,`500 9px ${F.n}`,st==='held'?terra:mute,'right',1);
    rule(ctx,M,y+30,W-M,line);});
  rule(ctx,0,788,W,line);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,814,`500 9px ${F.n}`,i===0?ink:faint,'center',0.8));
}

/* ═══ V4 — the serif back for figures, mono holding the labels ═══ */
function V4(ctx){
  const bg='#D4D6C4',ink='#22251C',mute='rgba(34,37,28,0.52)',faint='rgba(34,37,28,0.32)',
        line='rgba(34,37,28,0.26)',terra='#D9603C',ti='#FBEDE7';
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);status(ctx,ink);const M=22;
  guilloche(ctx,368,196,110,ink,0.17);
  ctx.fillStyle='rgba(34,37,28,0.13)';ctx.beginPath();ctx.arc(M+19,82,19,0,7);ctx.fill();
  T(ctx,'MO',M+19,87,`600 12px ${F.n}`,ink,'center');
  ctx.fillStyle=faint;for(let r=0;r<3;r++)for(let c=0;c<3;c++)ctx.fillRect(W-M-16+c*7,74+r*7,2.6,2.6);
  T(ctx,'AVAILABLE BALANCE',M,142,`500 10px ${F.n}`,mute,'left',1.2);
  ctx.font=`400 58px ${F.s}`;const a='$8,642.';
  T(ctx,a,M,196,`400 58px ${F.s}`,ink);
  T(ctx,'18',M+ctx.measureText(a).width,196,`400 58px ${F.s}`,faint);
  T(ctx,'SCREENED TODAY',M,234,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'06 / 01 HELD',W-M,234,`500 10px ${F.n}`,ink,'right',1.2);
  rule(ctx,M,244,W-M,line);
  cluster(ctx,M,306,HS,i=>i===17?terra:i===6?'#B07A1E':'rgba(34,37,28,0.42)');
  T(ctx,'TRUST',M,346,`500 10px ${F.n}`,mute,'left',1.2);
  T(ctx,'96 / 100',W-M,346,`500 10px ${F.n}`,ink,'right',1.2);
  rule(ctx,M,356,W-M,line);
  cluster(ctx,M,400,HS.map((h,i)=>i<29?32:9),i=>i<29?'rgba(34,37,28,0.6)':'rgba(34,37,28,0.18)');
  ctx.fillStyle=terra;ctx.fillRect(0,430,W,126);
  ctx.strokeStyle=ti;ctx.lineWidth=1.3;ctx.strokeRect(M+0.5,458.5,15,15);
  T(ctx,'!',M+8,470,`600 10px ${F.n}`,ti,'center');
  T(ctx,'HELD FOR REVIEW',M+26,470,`500 10px ${F.n}`,ti,'left',1.4);
  ctx.font=`400 46px ${F.s}`;const b='$482.';
  T(ctx,b,M,520,`400 46px ${F.s}`,ti);
  T(ctx,'00',M+ctx.measureText(b).width,520,`400 46px ${F.s}`,'rgba(251,237,231,0.55)');
  T(ctx,'GX DIGITAL GOODS · 5 SIGNALS',M,542,`500 10px ${F.n}`,'rgba(251,237,231,0.72)','left',1);
  T(ctx,'ACTIVITY',M,604,`500 10px ${F.n}`,mute,'left',1.2);
  rule(ctx,M,614,W-M,line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=646+i*50;
    T(ctx,n,M,y,`500 14px ${F.u}`,ink);
    T(ctx,s2.toUpperCase(),M,y+16,`400 9px ${F.n}`,faint,'left',0.8);
    T(ctx,amt,W-M,y,`400 19px ${F.s}`,st==='held'?terra:ink,'right');
    T(ctx,st.toUpperCase(),W-M,y+16,`500 9px ${F.n}`,st==='held'?terra:mute,'right',1);
    rule(ctx,M,y+30,W-M,line);});
  rule(ctx,0,788,W,line);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,814,`500 9px ${F.n}`,i===0?ink:faint,'center',0.8));
}

/* ═══ V5 — ledger: full-bleed rules, dense columns, the engraving as a seal ═══ */
function V5(ctx){
  const bg='#E4E2D6',ink='#171710',mute='rgba(23,23,16,0.52)',faint='rgba(23,23,16,0.3)',
        line='rgba(23,23,16,0.16)',hard='rgba(23,23,16,0.42)',terra='#B8482A';
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);status(ctx,ink);const M=18;
  rule(ctx,0,60,W,hard);
  T(ctx,'TRUEPAY',M,82,`500 9px ${F.n}`,mute,'left',2.2);
  T(ctx,'MAYA OKONKWO',W/2,82,`500 9px ${F.n}`,mute,'center',1.6);
  T(ctx,'2041',W-M,82,`500 9px ${F.n}`,mute,'right',1.6);
  rule(ctx,0,94,W,line);
  T(ctx,'BALANCE',M,122,`500 9px ${F.n}`,faint,'left',1.8);
  ctx.font=`600 30px ${F.n}`;const a='$8,642.';
  T(ctx,a,M,166,`600 30px ${F.n}`,ink);
  T(ctx,'18',M+ctx.measureText(a).width,166,`600 30px ${F.n}`,faint);
  rule(ctx,0,186,W,line);
  const rows=[['SCREENED','06','0.40'],['HELD','01','0.90'],['TRUST','96','0.96'],['SIGNALS','05','0.55']];
  rows.forEach(([k,v,f],i)=>{const y=216+i*34;
    T(ctx,k,M,y,`500 9px ${F.n}`,mute,'left',1.6);
    ctx.strokeStyle=line;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(112,y-4.5);ctx.lineTo(W-64,y-4.5);ctx.stroke();
    ctx.strokeStyle=k==='HELD'?terra:hard;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(112,y-4.5);ctx.lineTo(112+(W-64-112)*parseFloat(f),y-4.5);ctx.stroke();
    T(ctx,v,W-M,y,`500 11px ${F.n}`,k==='HELD'?terra:ink,'right',1);
    rule(ctx,0,y+14,W,line);});
  T(ctx,'TODAY',M,378,`500 9px ${F.n}`,faint,'left',1.8);
  cluster(ctx,M,420,HS,i=>i===17?terra:i===6?'#A8812A':'rgba(23,23,16,0.38)',(W-M*2)/30,1.2);
  rule(ctx,0,440,W,hard);
  T(ctx,'HELD FOR REVIEW',M,468,`500 9px ${F.n}`,terra,'left',1.8);
  ctx.font=`600 26px ${F.n}`;const b='$482.';
  T(ctx,b,M,504,`600 26px ${F.n}`,ink);
  T(ctx,'00',M+ctx.measureText(b).width,504,`600 26px ${F.n}`,faint);
  T(ctx,'GX DIGITAL GOODS',W-M,490,`500 9px ${F.n}`,mute,'right',1);
  T(ctx,'5 SIGNALS',W-M,506,`500 9px ${F.n}`,terra,'right',1);
  rule(ctx,0,526,W,hard);
  T(ctx,'ACTIVITY',M,552,`500 9px ${F.n}`,faint,'left',1.8);
  rule(ctx,0,562,W,line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=592+i*46;
    T(ctx,n.toUpperCase(),M,y,`500 11px ${F.n}`,ink,'left',0.6);
    T(ctx,s2.toUpperCase(),M,y+14,`400 8.5px ${F.n}`,faint,'left',0.8);
    T(ctx,amt,W-M,y,`500 13px ${F.n}`,st==='held'?terra:ink,'right');
    T(ctx,st.toUpperCase(),W-M,y+14,`500 8.5px ${F.n}`,st==='held'?terra:mute,'right',1);
    rule(ctx,0,y+26,W,line);});
  guilloche(ctx,W-56,752,44,ink,0.3);
  rule(ctx,0,788,W,hard);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,814,`500 8.5px ${F.n}`,i===0?ink:faint,'center',0.8));
}

/* ═══ GRID — the rules ARE the layout, and the tracks ARE the data ═══
   Two vertical rules cut the screen into label | instrument | value.
   Every metric is a mark on a track, so the same line both aligns and measures. */
const PAL = {
  n1:{st:'#E7E4DD',ink:'#1B1A17',spot:'#5B3FC9',alarm:'#A8201A',
      mute:'rgba(27,26,23,0.50)',faint:'rgba(27,26,23,0.30)',
      line:'rgba(27,26,23,0.20)',hard:'rgba(27,26,23,0.38)',track:'rgba(27,26,23,0.16)'},
  n2:{st:'#E9EBEC',ink:'#14171A',spot:'#4B37B8',alarm:'#B3123C',
      mute:'rgba(20,23,26,0.50)',faint:'rgba(20,23,26,0.30)',
      line:'rgba(20,23,26,0.18)',hard:'rgba(20,23,26,0.36)',track:'rgba(20,23,26,0.14)'},
  n3:{st:'#16151A',ink:'#E7E5ED',spot:'#9B82FF',alarm:'#FF5A52',
      mute:'rgba(231,229,237,0.52)',faint:'rgba(231,229,237,0.30)',
      line:'rgba(231,229,237,0.16)',hard:'rgba(231,229,237,0.32)',track:'rgba(231,229,237,0.14)'},
};
const AX=118, BX=288, M=20, RGT=370;   /* the three columns */

function vrule(ctx,x,y1,y2,col){ctx.strokeStyle=col;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x+0.5,y1);ctx.lineTo(x+0.5,y2);ctx.stroke();}

function GRID(ctx,P){
  ctx.fillStyle=P.st;ctx.fillRect(0,0,W,H);
  status(ctx,P.ink);

  /* the engraving, pinned into the instrument column so it reads as part of the grid */


  /* masthead */
  T(ctx,'TRUEPAY',M,80,`500 9px ${F.n}`,P.mute,'left',2.2);
  T(ctx,'MAYA OKONKWO',(AX+BX)/2,80,`500 9px ${F.n}`,P.mute,'center',1.4);
  T(ctx,'2041',RGT,80,`500 9px ${F.n}`,P.mute,'right',1.4);
  rule(ctx,0,96,W,P.hard);

  /* the two column rules — these run the height of the content */
  vrule(ctx,AX,96,772,P.line);
  vrule(ctx,BX,96,772,P.line);

  /* balance is the one element permitted to cross the grid */
  T(ctx,'BALANCE',M,130,`500 9px ${F.n}`,P.faint,'left',1.8);
  ctx.font=`600 26px ${F.n}`;const a='$8,642.';
  const aw=ctx.measureText(a).width;
  T(ctx,'18',RGT,160,`600 26px ${F.n}`,P.faint,'right');
  ctx.font=`600 26px ${F.n}`;
  T(ctx,a,RGT-ctx.measureText('18').width,160,`600 26px ${F.n}`,P.ink,'right');
  rule(ctx,0,186,W,P.line);

  /* metric rows: label | track with a mark | reading */
  const metric=(y,label,frac,read,col)=>{
    T(ctx,label,M,y,`500 9px ${F.n}`,P.mute,'left',1.6);
    const x0=AX+14,x1=BX-14;
    ctx.strokeStyle=P.track;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x0,y-4.5);ctx.lineTo(x1,y-4.5);ctx.stroke();
    ctx.strokeStyle=col;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x0,y-4.5);ctx.lineTo(x0+(x1-x0)*frac,y-4.5);ctx.stroke();
    ctx.fillStyle=col;ctx.fillRect(x0+(x1-x0)*frac-1,y-11,2,13);
    T(ctx,read,RGT,y,`500 11px ${F.n}`,col===P.alarm?P.alarm:P.ink,'right',0.8);
  };
  metric(222,'TRUST',0.96,'96',P.spot);
  rule(ctx,AX,236,W,P.line);
  metric(268,'RISK',0.08,'08',P.spot);
  rule(ctx,AX,282,W,P.line);
  metric(314,'HELD',0.167,'01',P.alarm);
  rule(ctx,0,328,W,P.hard);

  /* the day as an actual axis: position is time, the tall red mark is the hold */
  T(ctx,'TODAY',M,360,`500 9px ${F.n}`,P.mute,'left',1.6);
  T(ctx,'06 SCREENED',RGT,360,`500 9px ${F.n}`,P.ink,'right',1);
  const ax0=M,ax1=RGT,ay=424;
  ctx.strokeStyle=P.hard;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(ax0,ay+0.5);ctx.lineTo(ax1,ay+0.5);ctx.stroke();
  [[0,'00'],[0.25,'06'],[0.5,'12'],[0.75,'18'],[1,'24']].forEach(([f,l])=>{
    const x=ax0+(ax1-ax0)*f;
    ctx.strokeStyle=P.line;ctx.beginPath();ctx.moveTo(x+0.5,ay);ctx.lineTo(x+0.5,ay+5);ctx.stroke();
    T(ctx,l,x,ay+18,`400 8px ${F.n}`,P.faint,'center',0.6);});
  /* each payment sits at its own hour */
  [[0.345,18,0],[0.368,34,1],[0.385,15,0],[0.52,20,0],[0.74,16,0],[0.86,22,0]].forEach(([f,h,flag])=>{
    const x=ax0+(ax1-ax0)*f;
    ctx.strokeStyle=flag?P.alarm:P.spot;ctx.lineWidth=flag?2:1.4;
    ctx.beginPath();ctx.moveTo(x+0.5,ay);ctx.lineTo(x+0.5,ay-h);ctx.stroke();});
  rule(ctx,0,452,W,P.hard);

  /* the exception, and the only place the alarm ink appears at size */
  T(ctx,'HELD FOR REVIEW',M,482,`500 9px ${F.n}`,P.alarm,'left',1.8);
  ctx.font=`600 22px ${F.n}`;const b='$482.';
  T(ctx,b,AX+14,514,`600 22px ${F.n}`,P.ink);
  T(ctx,'00',AX+14+ctx.measureText(b).width,514,`600 22px ${F.n}`,P.faint);
  T(ctx,'GX DIGITAL',RGT,506,`400 8px ${F.n}`,P.mute,'right',0.8);
  T(ctx,'5 SIGNALS',RGT,520,`500 8px ${F.n}`,P.alarm,'right',0.8);
  rule(ctx,0,540,W,P.hard);

  /* activity obeys the same three columns */
  T(ctx,'ACTIVITY',M,568,`500 9px ${F.n}`,P.faint,'left',1.8);
  rule(ctx,0,580,W,P.line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=612+i*52;
    T(ctx,st==='held'?'HELD':'OK',M,y,`500 9px ${F.n}`,st==='held'?P.alarm:P.mute,'left',1.2);
    T(ctx,n,AX+14,y,`500 13px ${F.u}`,P.ink,'left');
    T(ctx,s2.toUpperCase(),AX+14,y+15,`400 8px ${F.n}`,P.faint,'left',0.8);
    T(ctx,amt,RGT,y,`500 13px ${F.n}`,st==='held'?P.alarm:P.ink,'right');
    rule(ctx,0,y+28,W,P.line);});

  /* the engraving sits as a seal, where a document carries one */
  guilloche(ctx,398,812,74,P.spot,P.st==='#16151A'?0.30:0.20);

  rule(ctx,0,772,W,P.hard);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,806,`500 8.5px ${F.n}`,i===0?P.ink:P.faint,'center',0.8));
}

/* ═══ CAIRN — plaster palette on the ruled grid. Flat stock, no texture. ═══ */
const CP={st:'#D3C8B6',ink:'#241C16',spot:'#46615A',alarm:'#B2361A',
  mute:'rgba(36,28,22,0.54)',faint:'rgba(36,28,22,0.33)',
  line:'rgba(36,28,22,0.20)',hard:'rgba(36,28,22,0.40)',track:'rgba(36,28,22,0.17)'};

/* the mark: four stones holding by balance, not symmetry */
function cairnMark(ctx,cx,base,s,col){
  const stones=[[1.00,0.30,-0.04,0.00],[0.74,0.25,0.07,-0.03],
                [0.55,0.21,-0.09,0.04],[0.33,0.17,0.12,-0.02]];
  let y=base;ctx.fillStyle=col;
  stones.forEach(([w,h,rot,dx])=>{
    const ww=w*s,hh=h*s*0.60;y-=hh;
    ctx.beginPath();ctx.ellipse(cx+dx*s,y+hh/2,ww/2,hh/2,rot,0,7);ctx.fill();
    y-=s*0.015;});
}

function CAIRN(ctx){
  const P=CP;
  ctx.fillStyle=P.st;ctx.fillRect(0,0,W,H);
  status(ctx,P.ink);

  cairnMark(ctx,M+9,90,30,P.spot);
  T(ctx,'CAIRN',M+28,86,`600 12px ${F.n}`,P.ink,'left',2.4);
  T(ctx,'MAYA OKONKWO',RGT,86,`500 9px ${F.n}`,P.mute,'right',1.4);
  rule(ctx,0,102,W,P.hard);

  vrule(ctx,AX,102,772,P.line);
  vrule(ctx,BX,102,772,P.line);

  T(ctx,'BALANCE',M,136,`500 9px ${F.n}`,P.faint,'left',1.8);
  ctx.font=`600 26px ${F.n}`;
  T(ctx,'18',RGT,166,`600 26px ${F.n}`,P.faint,'right');
  T(ctx,'$8,642.',RGT-ctx.measureText('18').width,166,`600 26px ${F.n}`,P.ink,'right');
  rule(ctx,0,190,W,P.line);

  const metric=(y,label,frac,read,col)=>{
    T(ctx,label,M,y,`500 9px ${F.n}`,P.mute,'left',1.6);
    const x0=AX+14,x1=BX-14;
    ctx.strokeStyle=P.track;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x0,y-4.5);ctx.lineTo(x1,y-4.5);ctx.stroke();
    ctx.strokeStyle=col;ctx.beginPath();
    ctx.moveTo(x0,y-4.5);ctx.lineTo(x0+(x1-x0)*frac,y-4.5);ctx.stroke();
    ctx.fillStyle=col;ctx.fillRect(x0+(x1-x0)*frac-1,y-11,2,13);
    T(ctx,read,RGT,y,`500 11px ${F.n}`,col===P.alarm?P.alarm:P.ink,'right',0.8);
  };
  metric(222,'TRUST',0.96,'96',P.spot);  rule(ctx,AX,238,W,P.line);
  metric(270,'RISK',0.08,'08',P.spot);   rule(ctx,AX,286,W,P.line);
  metric(318,'HELD',0.167,'01',P.alarm); rule(ctx,0,334,W,P.hard);

  T(ctx,'TODAY',M,366,`500 9px ${F.n}`,P.mute,'left',1.6);
  T(ctx,'06 SCREENED',RGT,366,`500 9px ${F.n}`,P.ink,'right',1);
  const ax0=M,ax1=RGT,ay=424;
  ctx.strokeStyle=P.hard;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(ax0,ay+0.5);ctx.lineTo(ax1,ay+0.5);ctx.stroke();
  [[0,'00'],[0.25,'06'],[0.5,'12'],[0.75,'18'],[1,'24']].forEach(([f,l])=>{
    const x=ax0+(ax1-ax0)*f;
    ctx.strokeStyle=P.line;ctx.beginPath();ctx.moveTo(x+0.5,ay);ctx.lineTo(x+0.5,ay+5);ctx.stroke();
    T(ctx,l,x,ay+18,`400 8px ${F.n}`,P.faint,'center',0.6);});
  [[0.345,18,0],[0.368,34,1],[0.385,15,0],[0.52,20,0],[0.74,16,0],[0.86,22,0]].forEach(([f,h,flag])=>{
    const x=ax0+(ax1-ax0)*f;
    ctx.strokeStyle=flag?P.alarm:P.spot;ctx.lineWidth=flag?2:1.4;
    ctx.beginPath();ctx.moveTo(x+0.5,ay);ctx.lineTo(x+0.5,ay-h);ctx.stroke();});
  rule(ctx,0,452,W,P.hard);

  T(ctx,'HELD FOR REVIEW',M,482,`500 9px ${F.n}`,P.alarm,'left',1.8);
  ctx.font=`600 22px ${F.n}`;const b='$482.';
  T(ctx,b,AX+14,516,`600 22px ${F.n}`,P.ink);
  T(ctx,'00',AX+14+ctx.measureText(b).width,516,`600 22px ${F.n}`,P.faint);
  T(ctx,'GX DIGITAL',RGT,508,`400 8px ${F.n}`,P.mute,'right',0.8);
  T(ctx,'5 SIGNALS',RGT,522,`500 8px ${F.n}`,P.alarm,'right',0.8);
  rule(ctx,0,544,W,P.hard);

  T(ctx,'ACTIVITY',M,572,`500 9px ${F.n}`,P.faint,'left',1.8);
  rule(ctx,0,584,W,P.line);
  ACT.forEach(([n,s2,amt,st],i)=>{const y=616+i*48;
    T(ctx,st==='held'?'HELD':'OK',M,y,`500 9px ${F.n}`,st==='held'?P.alarm:P.mute,'left',1.2);
    T(ctx,n,AX+14,y,`500 13px ${F.u}`,P.ink,'left');
    T(ctx,s2.toUpperCase(),AX+14,y+14,`400 8px ${F.n}`,P.faint,'left',0.8);
    T(ctx,amt,RGT,y,`500 13px ${F.n}`,st==='held'?P.alarm:P.ink,'right');
    rule(ctx,0,y+26,W,P.line);});

  rule(ctx,0,772,W,P.hard);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,806,`500 8.5px ${F.n}`,i===0?P.ink:P.faint,'center',0.8));
}

/* ═══ SECURITY — the same grid under load ═══ */
const PROT=[['BIOMETRIC APPROVAL','ARMED','+26'],['MULTI-LAYER ENCRYPTION','ARMED','+24'],
            ['REAL-TIME MONITORING','ARMED','+22'],['INSTANT ALERTS','ARMED','+14'],
            ['AUTO-FREEZE ON ANOMALY','ARMED','+10'],['TRAVEL MODE','OFF','+04']];
const FEED=[['08:51','AI HELD A TRANSACTION','GX DIGITAL GOODS · $482.00','held'],
            ['09:24','FACE ID APPROVED A PAYMENT','CAFE LUMIÈRE · $18.40','ok'],
            ['07:00','ENCRYPTION KEYS ROTATED','AUTOMATIC 4-HOUR CYCLE','ok'],
            ['YEST','NEW SIGN-IN VERIFIED','IPHONE 16 PRO · THIS DEVICE','ok']];

function head(ctx,P,title){
  ctx.fillStyle=P.st;ctx.fillRect(0,0,W,H);status(ctx,P.ink);
  cairnMark(ctx,M+9,90,30,P.spot);
  T(ctx,title,M+28,86,`600 12px ${F.n}`,P.ink,'left',2.4);
  T(ctx,'MAYA OKONKWO',RGT,86,`500 9px ${F.n}`,P.mute,'right',1.4);
  rule(ctx,0,102,W,P.hard);
}

function SEC(ctx){
  const P=CP; head(ctx,P,'SECURITY');
  vrule(ctx,AX,102,772,P.line); vrule(ctx,BX,102,772,P.line);

  T(ctx,'TRUST',M,136,`500 9px ${F.n}`,P.faint,'left',1.8);
  ctx.font=`600 26px ${F.n}`;
  T(ctx,'/100',RGT,166,`600 26px ${F.n}`,P.faint,'right');
  T(ctx,'96',RGT-ctx.measureText('/100').width,166,`600 26px ${F.n}`,P.ink,'right');
  const t0=AX+14,t1=BX-14;
  ctx.strokeStyle=P.track;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(t0,160.5);ctx.lineTo(t1,160.5);ctx.stroke();
  ctx.strokeStyle=P.spot;ctx.beginPath();
  ctx.moveTo(t0,160.5);ctx.lineTo(t0+(t1-t0)*0.96,160.5);ctx.stroke();
  ctx.fillStyle=P.spot;ctx.fillRect(t0+(t1-t0)*0.96-1,154,2,13);
  rule(ctx,0,190,W,P.hard);

  T(ctx,'PROTECTIONS',M,218,`500 9px ${F.n}`,P.faint,'left',1.8);
  T(ctx,'5 / 6 ARMED',RGT,218,`500 9px ${F.n}`,P.ink,'right',1);
  rule(ctx,0,230,W,P.line);
  PROT.forEach(([n,st,w],i)=>{const y=258+i*42, on=st==='ARMED';
    T(ctx,st,M,y,`500 9px ${F.n}`,on?P.mute:P.faint,'left',1.2);
    T(ctx,n,AX+14,y,`500 11px ${F.n}`,on?P.ink:P.faint,'left',0.6);
    T(ctx,w,RGT,y,`500 10px ${F.n}`,on?P.spot:P.faint,'right',0.8);
    rule(ctx,0,y+16,W,P.line);});

  rule(ctx,0,510,W,P.hard);
  T(ctx,'LIVE',M,538,`500 9px ${F.n}`,P.faint,'left',1.8);
  rule(ctx,0,550,W,P.line);
  FEED.forEach(([t,n,d,st],i)=>{const y=580+i*48;
    T(ctx,t,M,y,`500 9px ${F.n}`,st==='held'?P.alarm:P.mute,'left',1);
    T(ctx,n,AX+14,y,`500 10px ${F.n}`,st==='held'?P.alarm:P.ink,'left',0.6);
    T(ctx,d,AX+14,y+14,`400 8px ${F.n}`,P.faint,'left',0.8);
    rule(ctx,0,y+26,W,P.line);});

  rule(ctx,0,772,W,P.hard);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,806,`500 8.5px ${F.n}`,i===3?P.ink:P.faint,'center',0.8));
}

/* ═══ HELD REVIEW — five signals, each a mark on a shared scale ═══ */
const SIGW=[['UNKNOWN MERCHANT',0.94,'94'],['UNUSUAL AMOUNT',0.86,'86'],
            ['DISTANT ORIGIN',0.62,'62'],['OFF-PATTERN TIMING',0.34,'34'],
            ['DEVICE MATCH',0.12,'12']];
function HELD(ctx){
  const P=CP; head(ctx,P,'REVIEW');
  vrule(ctx,AX,102,700,P.line); vrule(ctx,BX,102,700,P.line);

  T(ctx,'HELD',M,136,`500 9px ${F.n}`,P.alarm,'left',1.8);
  ctx.font=`600 30px ${F.n}`;const b='$482.';
  T(ctx,b,AX+14,170,`600 30px ${F.n}`,P.ink);
  T(ctx,'00',AX+14+ctx.measureText(b).width,170,`600 30px ${F.n}`,P.faint);
  T(ctx,'GX DIGITAL',RGT,158,`400 8px ${F.n}`,P.mute,'right',0.8);
  T(ctx,'08:51',RGT,172,`500 8px ${F.n}`,P.mute,'right',0.8);
  rule(ctx,0,196,W,P.hard);

  T(ctx,'WHY IT STOPPED',M,224,`500 9px ${F.n}`,P.faint,'left',1.8);
  T(ctx,'STRONGEST FIRST',RGT,224,`500 9px ${F.n}`,P.mute,'right',1);
  rule(ctx,0,236,W,P.line);
  SIGW.forEach(([n,f,v],i)=>{const y=268+i*46;
    T(ctx,n,M,y,`500 8px ${F.n}`,P.mute,'left',0.9);
    const x0=AX+14,x1=BX-14;
    ctx.strokeStyle=P.track;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x0,y-4.5);ctx.lineTo(x1,y-4.5);ctx.stroke();
    const col=f>0.7?P.alarm:f>0.4?'#9A6B1E':P.spot;
    ctx.strokeStyle=col;ctx.beginPath();
    ctx.moveTo(x0,y-4.5);ctx.lineTo(x0+(x1-x0)*f,y-4.5);ctx.stroke();
    ctx.fillStyle=col;ctx.fillRect(x0+(x1-x0)*f-1,y-11,2,13);
    T(ctx,v,RGT,y,`500 11px ${F.n}`,P.ink,'right',0.8);
    rule(ctx,0,y+16,W,P.line);});

  rule(ctx,0,500,W,P.hard);
  T(ctx,'RISK',M,530,`500 9px ${F.n}`,P.alarm,'left',1.8);
  ctx.font=`600 24px ${F.n}`;
  T(ctx,'58%',RGT,538,`600 24px ${F.n}`,P.alarm,'right');
  T(ctx,'HELD BEFORE IT LEFT YOUR ACCOUNT',AX+14,534,`400 8px ${F.n}`,P.mute,'left',0.8);
  rule(ctx,0,560,W,P.hard);

  /* the decision, never below the fold */
  ctx.fillStyle=P.ink;ctx.fillRect(M,600,W-M*2,52);
  T(ctx,'YES, THIS WAS ME',W/2,631,`600 11px ${F.n}`,P.st,'center',1.6);
  ctx.strokeStyle=P.alarm;ctx.lineWidth=1.5;ctx.strokeRect(M+0.5,668.5,W-M*2-1,51);
  T(ctx,'NOT ME — FREEZE & DISPUTE',W/2,699,`600 11px ${F.n}`,P.alarm,'center',1.6);
  T(ctx,'YOU ARE NOT LIABLE WHILE THIS IS REVIEWED',W/2,748,`400 8px ${F.n}`,P.faint,'center',0.8);
}

/* ═══ SECURITY, ALTERNATIVE — the cairn IS the instrument ═══ */
function SEC2(ctx){
  const st='#DBD2C2', ink='#161008', spot='#3E5A52', alarm='#B2361A',
        mute='rgba(22,16,8,0.52)', faint='rgba(22,16,8,0.30)', line='rgba(22,16,8,0.18)';
  ctx.fillStyle=st;ctx.fillRect(0,0,W,H);status(ctx,ink);
  cairnMark(ctx,M+9,90,30,spot);
  T(ctx,'CAIRN',M+28,86,`600 12px ${F.n}`,ink,'left',2.4);
  T(ctx,'SECURITY',RGT,86,`500 9px ${F.n}`,mute,'right',1.4);
  rule(ctx,0,102,W,line);

  /* six protections, six stones. the stack IS the score. */
  /* real stones: irregular widths, uneven tilt, not a taper */
  const stones=[[1.00,0.34,-0.05,0.00,1],[0.72,0.30,0.11,-0.05,1],[0.84,0.26,-0.07,0.06,1],
                [0.56,0.31,0.14,-0.04,1],[0.66,0.24,-0.12,0.02,1],[0.42,0.22,0.09,0.05,0]];
  const S=210; let y=448;
  stones.forEach(([w,h,rot,dx,on])=>{
    const ww=w*S, hh=h*S*0.60; y-=hh;
    ctx.beginPath();ctx.ellipse(W/2+dx*S, y+hh/2, ww/2, hh/2, rot, 0, 7);
    if(on){ctx.fillStyle=spot;ctx.fill();}
    else{ctx.strokeStyle=faint;ctx.setLineDash([3,4]);ctx.lineWidth=1.4;ctx.stroke();ctx.setLineDash([]);}
    y-=S*0.016;});

  T(ctx,'96',W/2,528,`600 50px ${F.n}`,ink,'center',-1);
  T(ctx,'FIVE OF SIX STONES SET',W/2,554,`500 9px ${F.n}`,mute,'center',1.6);
  rule(ctx,0,600,W,line);

  PROT.forEach(([n,stt,w],i)=>{const yy=634+i*22, on=stt==='ARMED';
    ctx.fillStyle=on?spot:'transparent';
    ctx.strokeStyle=faint;ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(M+7,yy-4,7,3.4,-0.05,0,7);
    on?ctx.fill():ctx.stroke();
    T(ctx,n,M+24,yy,`500 9px ${F.n}`,on?ink:faint,'left',0.6);
    T(ctx,w,RGT,yy,`500 9px ${F.n}`,on?spot:faint,'right',0.8);});

  rule(ctx,0,772,W,line);
  ['HOME','ACTIVITY','PAY','SECURITY','PROFILE'].forEach((s2,i)=>
    T(ctx,s2,30+i*78,806,`500 8.5px ${F.n}`,i===3?ink:faint,'center',0.8));
}

export function draw(ctx,which){
  ctx.setTransform(1,0,0,1,0,0);
  const s=ctx.canvas.width/W;ctx.scale(s,s);
  if(which==='cairn')return CAIRN(ctx);
  if(which==='sec')return SEC(ctx);
  if(which==='held')return HELD(ctx);
  if(which==='sec2')return SEC2(ctx);
  if(PAL[which])return GRID(ctx,PAL[which]);
  ({r1:R1,r2:R2,r3:R3,r4:R4,r5:R5,v1:V1,v2:V2,v3:V3,v4:V4,v5:V5}[which]||R1)(ctx);
}
