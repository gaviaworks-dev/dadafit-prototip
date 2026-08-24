import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
for(const W of [1440,1810,2000]){
  const pg=await (await b.newContext({viewport:{width:W,height:1000}})).newPage();
  pg.on('pageerror',()=>{});
  await pg.goto('file:///Users/gaviaworks/Developer/Projects/dadafit-prototip/anatomi-v1.html',{waitUntil:'load'});
  await pg.waitForTimeout(400);
  const r=await pg.evaluate(()=>{
    const n=document.querySelector('.hr-note'); if(!n) return {yok:true};
    const p=n.querySelector('p');
    const nr=n.getBoundingClientRect(), pr=p.getBoundingClientRect();
    const cs=getComputedStyle(p), ncs=getComputedStyle(n);
    const t=p.textContent.replace(/\s+/g,' ').trim();
    const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.5;
    const satir=Math.max(1,Math.round(pr.height/lh));
    return {
      kutu:Math.round(nr.width), metin:Math.round(pr.width),
      oran:'%'+Math.round(pr.width/nr.width*100),
      pMaxW:cs.maxWidth, nMaxW:ncs.maxWidth, nDisplay:ncs.display,
      karSatir:Math.round(t.length/satir), satir,
      wrap:Math.round((n.closest('.wrap')||{getBoundingClientRect:()=>({width:0})}).getBoundingClientRect().width)
    };
  });
  console.log(W+'px →', JSON.stringify(r));
}
await b.close();
