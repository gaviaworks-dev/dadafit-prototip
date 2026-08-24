import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
for(const W of [1440,1024,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:1000}})).newPage();
  pg.on('pageerror',e=>console.log('!!',e.message));
  await pg.goto(''+BASE+'/fit-testleri-v1.html',{waitUntil:'load'});
  await pg.waitForTimeout(450);
  const r=await pg.evaluate(()=>{
    const ms=[...document.querySelectorAll('.ft-meta')].filter(e=>e.getClientRects().length);
    const satir=m=>{const cs=getComputedStyle(m);const h=m.getBoundingClientRect().height;
      const cip=m.firstElementChild?m.firstElementChild.getBoundingClientRect().height:1;
      return Math.max(1,Math.round((h-parseFloat(cs.paddingBottom))/ (cip+8)));};
    const kartH=[...document.querySelectorAll('.ft-card')].filter(e=>e.getClientRects().length)
      .map(e=>Math.round(e.getBoundingClientRect().height));
    return {
      meta:ms.length,
      cokSatirli:ms.filter(m=>satir(m)>1).length,
      kaydirilabilir:ms.filter(m=>m.scrollWidth>m.clientWidth+1).length,
      wrap:[...new Set(ms.map(m=>getComputedStyle(m).flexWrap))],
      kartYukseklikleri:[...new Set(kartH)],
      yatayTasma:document.documentElement.scrollWidth>document.documentElement.clientWidth+1
    };
  });
  console.log(`@${W}px`, JSON.stringify(r));
}
await b.close();
