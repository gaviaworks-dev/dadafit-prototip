import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const out={};
for(const W of [1440,1024,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:1000}})).newPage();
  pg.on('pageerror',()=>{});
  await pg.goto(''+BASE+'/antrenorler-v1.html',{waitUntil:'load'}); await pg.waitForTimeout(450);
  out[W]=await pg.evaluate(()=>{
    const c=[...document.querySelectorAll('.coach-card')].filter(e=>e.getClientRects().length);
    const R=e=>e.getBoundingClientRect();
    const g=e=>e?[Math.round(R(e).width),Math.round(R(e).height)]:null;
    const k=c[0];
    return {adet:c.length, kart:g(k), medya:g(k&&k.querySelector('.coach-media')),
      govde:g(k&&k.querySelector('.coach-body')), etiket:g(k&&k.querySelector('.coach-tags')),
      meta:g(k&&k.querySelector('.coach-meta')), cta:g(k&&k.querySelector('.coach-cta')),
      yukseklikler:[...new Set(c.map(e=>Math.round(R(e).height)))]};
  });
}
await b.close();
console.log(JSON.stringify(out));
