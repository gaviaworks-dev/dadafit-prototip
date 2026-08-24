/* Banner alt kenarı → dikiş üst kenarı mesafesi (px). Küçük = köşe banner'ın dibinde. */
import { chromium } from '../../tests/_pw.mjs';
import { readdirSync } from 'node:fs';
import path from 'node:path';
const ROOT=new URL('../../',import.meta.url).pathname;
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const pages=readdirSync(ROOT).filter(f=>/-v1\.html$/.test(f)).sort();
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
pg.on('pageerror',()=>{});
const out=[];
for(const f of pages){
  await pg.goto('file://'+path.join(ROOT,f),{waitUntil:'load'});
  await pg.waitForTimeout(300);
  const r=await pg.evaluate(()=>{
    const B='.lib-top,.cp-top,.kp-top,.ol-top,.ed-top,.fs-top,.pd-hero,.chl-hero,.df-top,.au-top';
    const m=document.querySelector('main.page-main'); if(!m) return null;
    const ban=[...m.children].find(e=>e.matches(B));
    const s=document.querySelector('.fit-seam');
    if(!ban||!s) return null;
    const bb=ban.getBoundingClientRect().bottom+scrollY;
    const st=s.getBoundingClientRect().top+scrollY;
    return Math.round(st-bb);
  });
  if(r===null) continue;
  out.push([f,r]);
}
await b.close();
const kotu=out.filter(([,d])=>d>60);
for(const [f,d] of out.sort((a,b)=>b[1]-a[1]).slice(0,10)) console.log(`${String(d).padStart(5)}px  ${f}`);
console.log(`\nölçülen ${out.length} sayfa · mesafe > 60px olan: ${kotu.length}`);
console.log(kotu.length? kotu.map(([f,d])=>`${f} (${d}px)`).join('\n') : '—');
