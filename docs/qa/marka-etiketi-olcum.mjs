import { chromium } from '../../tests/_pw.mjs';
import { readdirSync } from 'node:fs';
const ROOT=new URL('../../',import.meta.url).pathname;
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const pages=readdirSync(ROOT).filter(f=>/-v1\.html$/.test(f)).sort();
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
pg.on('pageerror',()=>{});
let toplam=0, gorunmez=0, ornekler=[];
for(const f of pages){
  await pg.goto(''+BASE+'/'+f,{waitUntil:'load'}); await pg.waitForTimeout(180);
  const r=await pg.evaluate(()=>{
    const ts=[...document.querySelectorAll('.brand-tag')];
    return ts.map(t=>{
      const bd=t.querySelector('.bd'), sf=t.querySelector('.sf'), i=t.querySelector('i');
      const cs=getComputedStyle(t);
      const ad=t.querySelector('.bt-name,.bs-name');
      const adR=ad?ad.getBoundingClientRect():null;
      return {gorunur:t.getClientRects().length>0,
        adGorunur: !!(ad && ad.getClientRects().length>0 && adR.width>8 &&
                      getComputedStyle(ad).opacity!=='0'),
        adGenislik: adR?Math.round(adR.width):0,
        metin:t.textContent.replace(/\s+/g,' ').trim(),
        bdAg:bd?getComputedStyle(bd).fontWeight:null, sfAg:sf?getComputedStyle(sf).fontWeight:null,
        renk:cs.color, ikonRenk:i?getComputedStyle(i).color:null,
        buyukHarf:cs.textTransform, sinif:t.className.replace('brg-brand brand-tag ','')};
    });
  });
  for(const t of r){ toplam++; if(!t.adGorunur) gorunmez++; }
  if(r.length && ornekler.length<4) ornekler.push(...r.slice(0,3).map(x=>f.slice(0,18)+' :: '+JSON.stringify(x)));
}
await b.close();
console.log('marka etiketi toplam:',toplam,'· ADI GÖRÜNMEYEN:',gorunmez);
ornekler.slice(0,4).forEach(x=>console.log('  '+x));
