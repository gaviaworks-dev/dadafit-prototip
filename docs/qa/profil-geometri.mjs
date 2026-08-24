import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch(); const out={};
for(const W of [1440,1024,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:1100}})).newPage();
  pg.on('pageerror',()=>{});
  await pg.goto(''+BASE+'/profil-v1.html',{waitUntil:'load'}); await pg.waitForTimeout(700);
  out[W]=await pg.evaluate(()=>{
    const R=e=>e?[Math.round(e.getBoundingClientRect().width),Math.round(e.getBoundingClientRect().height)]:null;
    const q=s=>document.querySelector(s);
    return {top:R(q('.pf-top')),banner:R(q('.pf-banner')),head:R(q('.pf-head')),
      ava:R(q('.pf-ava')),id:R(q('.pf-id')),stats:R(q('.pf-stats:not([hidden])')),
      mark:R(q('.pf-mark')),crumb:R(q('.pf-crumb'))};
  });
  await pg.close();
}
await b.close(); console.log(JSON.stringify(out));
