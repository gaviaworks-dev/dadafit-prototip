import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
for(const W of [1440,1024,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:1000}})).newPage();
  const hata=[]; pg.on('pageerror',e=>hata.push(e.message));
  await pg.goto(''+BASE+'/dadafit-hub-v1.html',{waitUntil:'load'}); await pg.waitForTimeout(500);
  const r=await pg.evaluate(()=>{
    const c=[...document.querySelectorAll('#antrenor .coach-card')].filter(e=>e.getClientRects().length);
    const R=e=>e.getBoundingClientRect();
    const grid=document.querySelector('.df-coach-grid');
    return {
      kart:c.length,
      eskiKart:document.querySelectorAll('.df-coach').length,
      kolon:grid?getComputedStyle(grid).gridTemplateColumns.split(' ').length:0,
      yukseklikler:[...new Set(c.map(e=>Math.round(R(e).height)))],
      adlar:c.map(e=>(e.querySelector('.coach-id b')||{}).textContent),
      gorsel:c.filter(e=>{const m=e.querySelector('.coach-media');return m&&/url\(/.test(getComputedStyle(m).backgroundImage);}).length,
      rozet:c.filter(e=>e.querySelector('.coach-verify')).length,
      hedef:c.map(e=>e.getAttribute('href')),
      tumunuGor:(document.querySelector('#antrenor .see-all')||{}).getAttribute?document.querySelector('#antrenor .see-all').getAttribute('href'):null,
      yatayTasma:document.documentElement.scrollWidth>document.documentElement.clientWidth+1
    };
  });
  console.log(`@${W}px`, JSON.stringify(r), hata.length?('JS:'+hata.join('|')):'');
}
await b.close();
