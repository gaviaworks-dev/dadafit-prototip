import { chromium } from '../../tests/_pw.mjs';
import { readdirSync } from 'node:fs';
const ROOT=new URL('../../',import.meta.url).pathname;
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const pages=readdirSync(ROOT).filter(f=>/-v1\.html$/.test(f)).sort();
const b=await chromium.launch();
for(const W of [1440,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:1000}})).newPage();
  pg.on('pageerror',()=>{});
  let var_=0,on=0,off=0,yok=[];
  for(const f of pages){
    await pg.goto(''+BASE+'/'+f,{waitUntil:'load'}); await pg.waitForTimeout(190);
    const r=await pg.evaluate(()=>{
      const s=document.querySelector('.fit-seam'); if(!s) return null;
      return {on:s.classList.contains('is-onbanner'), r:getComputedStyle(s).borderTopLeftRadius};
    });
    if(!r){ yok.push(f.replace('-v1.html','')); continue; }
    var_++; r.on?on++:off++;
  }
  console.log(`@${W}px · dikiş ${var_}/${pages.length} · binen(is-onbanner) ${on} · ray-altı ${off} · yok: ${yok.join(', ')||'—'}`);
  await pg.close();
}
await b.close();
