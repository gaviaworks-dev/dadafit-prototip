import { chromium } from '../../tests/_pw.mjs';
import { readdirSync } from 'node:fs'; import path from 'node:path';
const ROOT=new URL('../../',import.meta.url).pathname;
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const pages=readdirSync(ROOT).filter(f=>/-v1\.html$/.test(f)).sort();
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
pg.on('pageerror',()=>{});
let yakinda=0, indir=0, soon=0, ornek=null;
for(const f of pages){
  await pg.goto('file://'+path.join(ROOT,f),{waitUntil:'load'}); await pg.waitForTimeout(170);
  const r=await pg.evaluate(()=>{
    const st=[...document.querySelectorAll('.ap-store')];
    const gorunurMetin = st.map(s=>(s.querySelector('small')||{}).textContent||'');
    return {
      yakinda: gorunurMetin.filter(t=>/Yakında/.test(t)).length,
      indir:   gorunurMetin.filter(t=>/İndir/.test(t)).length,
      soon:    document.querySelectorAll('.ap-soon').length,
      title:   st.map(s=>s.getAttribute('title')).join(','),
      dis:     st.filter(s=>s.getAttribute('aria-disabled')==='true').length,
      tag:     st.map(s=>s.tagName).join(',')
    };
  });
  yakinda+=r.yakinda; indir+=r.indir; soon+=r.soon;
  if(!ornek && r.indir) ornek=r;
}
await b.close();
console.log(`66 sayfa · footer mağaza kutusunda görünen "Yakında": ${yakinda}  ·  "İndir": ${indir}`);
console.log(`".ap-soon" paragrafı: ${soon}`);
console.log('örnek kutu:', JSON.stringify(ornek));
