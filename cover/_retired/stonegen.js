/* Renders river stones per-pixel: lit ellipsoid, bump-mapped surface, irregular
   silhouette. Output is saved as PNG assets rather than drawn as shapes. */
function hash(x,y,s){
  let h=(x|0)*374761393+(y|0)*668265263+(s|0)*1013904223;
  h=Math.imul(h^(h>>>13),1274126177);
  return ((h^(h>>>16))>>>0)/4294967295;}
function vnoise(x,y,s){
  const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
  const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);
  return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v;}
function fbm(x,y,s,oct){let v=0,amp=0.5,f=1;
  for(let i=0;i<oct;i++){v+=amp*vnoise(x*f,y*f,s+i*37);amp*=0.5;f*=2;}return v;}

export function renderStone(cw,ch,seed,tint){
  const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;
  const g=cv.getContext('2d');
  const img=g.createImageData(cw,ch), d=img.data;
  const a=cw/2-6, b=ch/2-6, cx=cw/2, cy=ch/2;
  const Lx=-0.46,Ly=-0.70,Lz=0.55, Ln=Math.hypot(Lx,Ly,Lz);
  const lx=Lx/Ln, ly=Ly/Ln, lz=Lz/Ln;
  const hx=lx, hy=ly, hz=lz+1, hl=Math.hypot(hx,hy,hz);

  for(let py=0;py<ch;py++)for(let px=0;px<cw;px++){
    const x=px+0.5-cx, y=py+0.5-cy;
    const ang=Math.atan2(y/b,x/a);
    /* the outline is never a true ellipse */
    const warp=1+0.10*(fbm(Math.cos(ang)*2.3+7,Math.sin(ang)*2.3+7,seed,3)-0.5)*2
                +0.05*(fbm(Math.cos(ang)*5.1+3,Math.sin(ang)*5.1+3,seed+11,2)-0.5)*2;
    const u=x/(a*warp), v=y/(b*warp), r2=u*u+v*v;
    const i=(py*cw+px)*4;
    if(r2>=1){d[i+3]=0;continue;}
    const z=Math.sqrt(1-r2);
    let nx=u, ny=v, nz=z*0.82;
    /* surface relief */
    const sc=2.6/Math.max(cw,ch)*64;
    const n0 =fbm(px*0.052*sc,py*0.070*sc,seed+91,4);
    const nxp=fbm((px+1)*0.052*sc,py*0.070*sc,seed+91,4);
    const nyp=fbm(px*0.052*sc,(py+1)*0.070*sc,seed+91,4);
    nx+=(nxp-n0)*3.1; ny+=(nyp-n0)*3.1;
    const nl=Math.hypot(nx,ny,nz); nx/=nl;ny/=nl;nz/=nl;

    const diff=Math.max(0,nx*lx+ny*ly+nz*lz);
    const spec=Math.pow(Math.max(0,(nx*hx+ny*hy+nz*hz)/hl),26)*0.42;
    const rim=1-Math.pow(r2,2.2)*0.34;
    const ao=0.70+0.30*(1-Math.max(0,v)*0.85);
    const shade=(0.38+0.72*diff)*rim*ao;
    const grain=(fbm(px*1.1,py*1.1,seed+5,2)-0.5)*0.07;

    d[i]  =Math.max(0,Math.min(255,tint[0]*shade+spec*248+grain*255));
    d[i+1]=Math.max(0,Math.min(255,tint[1]*shade+spec*248+grain*255));
    d[i+2]=Math.max(0,Math.min(255,tint[2]*shade+spec*248+grain*255));
    d[i+3]=255*Math.min(1,(1-r2)*11);
  }
  g.putImageData(img,0,0);
  return cv;
}
