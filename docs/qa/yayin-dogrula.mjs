import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
pg.on('pageerror',()=>{});
for(let d=1;d<=12;d++){
  await pg.goto('https://gaviaworks-dev.github.io/dadafit-prototip/dadafit-hub-v1.html?cb='+d,{waitUntil:'domcontentloaded',timeout:30000});
  await pg.waitForTimeout(1500);
  const r=await pg.evaluate(()=>{
    const s=document.querySelector('.fit-seam');
    if(!s) return {seam:'YOK'};
    const cs=getComputedStyle(s);
    return {binen:s.classList.contains('is-onbanner'), mt:cs.marginTop, r:cs.borderTopLeftRadius};
  });
  if(r.binen){ console.log('YAYIN ✓ deneme '+d+':', JSON.stringify(r)); break; }
  console.log('deneme '+d+' — henüz eski:', JSON.stringify(r));
  await pg.waitForTimeout(13000);
}
await b.close();
