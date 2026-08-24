import { chromium } from '../../tests/_pw.mjs';
import { readdirSync } from 'node:fs';
import path from 'node:path';
const ROOT=new URL('../../',import.meta.url).pathname;
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const pages=readdirSync(ROOT).filter(f=>/-v1\.html$/.test(f)).sort();
const b=await chromium.launch();
for(const W of [1440,1024,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:900}})).newPage();
  pg.on('pageerror',()=>{});
  let var_=0, yok=[];
  for(const f of pages){
    await pg.goto('file://'+path.join(ROOT,f),{waitUntil:'load'}); await pg.waitForTimeout(230);
    const r=await pg.evaluate(()=>{
      const s=document.querySelector('.lib-row > .lib-stats');
      if(!s||s.getClientRects().length===0) return null;
      const cs=getComputedStyle(s);
      return {bl:cs.borderLeftWidth, bt:cs.borderTopWidth, pl:cs.paddingLeft, pt:cs.paddingTop, yon:cs.flexDirection};
    });
    if(!r) continue;
    const ayrac = parseFloat(r.bl)>0 || parseFloat(r.bt)>0;
    ayrac ? var_++ : yok.push(f+' '+JSON.stringify(r));
  }
  console.log(`@${W}px · ayraçlı sayaç kolonu: ${var_} sayfa` + (yok.length?`\n  AYRAÇSIZ: ${yok.join(' | ')}`:''));
  const ilk=await pg.evaluate(()=>{const s=document.querySelector('.lib-row > .lib-stats');if(!s)return null;const c=getComputedStyle(s);return c.flexDirection+' · border-left '+c.borderLeftWidth+' · padding-left '+c.paddingLeft+' · border-top '+c.borderTopWidth+' · padding-top '+c.paddingTop;});
  console.log('  örnek ölçü: '+ilk);
}
await b.close();
