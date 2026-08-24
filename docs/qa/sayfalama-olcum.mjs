import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
const hata=[]; pg.on('pageerror',e=>hata.push(e.message));
await pg.goto(''+BASE+'/egzersiz-kutuphane-v1.html',{waitUntil:'load'});
await pg.waitForTimeout(800);
const oku=()=>pg.evaluate(()=>{
  const p=document.getElementById('libPagi');
  const gorunur=[...document.querySelectorAll('.ex-card')].filter(c=>c.getClientRects().length);
  const dg=[...p.querySelectorAll('.pg')];
  return {
    gorunurKart:gorunur.length,
    toplamKart:document.querySelectorAll('.ex-card').length,
    dugmeler:dg.map(b=>b.getAttribute('aria-label')||b.textContent.trim()),
    aktif:(p.querySelector('.pg.active')||{}).textContent,
    kapali:dg.filter(b=>b.disabled).map(b=>b.getAttribute('aria-label')),
    not:(p.querySelector('.pagi-note')||{}).textContent,
    ilkKart:(gorunur[0]||{}).getAttribute?gorunur[0].getAttribute('data-name'):null,
    dokunmaHedefi:[...new Set(dg.map(b=>{const r=b.getBoundingClientRect();return Math.round(r.width)+'×'+Math.round(r.height);}))]
  };
});
console.log('SAYFA 1:', JSON.stringify(await oku(),null,1));
await pg.evaluate(()=>{[...document.querySelectorAll('#libPagi .pg')].find(b=>b.textContent.trim()==='2').click();});
await pg.waitForTimeout(500);
console.log('SAYFA 2:', JSON.stringify(await oku(),null,1));
await pg.evaluate(()=>{document.querySelector('#libPagi .pg[aria-label="Son sayfa"]').click();});
await pg.waitForTimeout(500);
console.log('SON SAYFA:', JSON.stringify(await oku(),null,1));
await pg.evaluate(()=>{document.querySelector('#libPagi .pg[aria-label="İlk sayfa"]').click();});
await pg.waitForTimeout(500);
const g=await oku(); console.log('İLKE DÖNÜŞ:', g.aktif, '·', g.not);
console.log('JS hatası:', hata.length, hata.join(' | '));
await b.close();
