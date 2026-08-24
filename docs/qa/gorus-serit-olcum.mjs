import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2})).newPage();
const hata=[]; pg.on('pageerror',e=>hata.push(e.message));
for(const f of ['hareket-rehberi-v1.html','program-liste-v1.html','enerji-defteri-v1.html?auth=1']){
  await pg.goto(''+BASE+'/'+f,{waitUntil:'load'}); await pg.waitForTimeout(700);
  const r=await pg.evaluate(()=>{
    const t=document.querySelector('.feedback-tab'), rail=document.querySelector('.fb-rail');
    const BAN='.lib-top, .fp-profil .fp-kapak, .cp-top, .kp-top, .chl-hero, .pd-hero, .fs-top, .ol-top, .ed-top, .df-top, .au-top, .pf-banner';
    const ban=document.querySelector(BAN);
    const R=e=>e.getBoundingClientRect(); const cs=e=>getComputedStyle(e);
    return {
      dugme:{w:Math.round(R(t).width),h:Math.round(R(t).height),
        punto:cs(t).fontSize,agirlik:cs(t).fontWeight,buyuk:cs(t).textTransform,
        harf:cs(t).letterSpacing,radius:cs(t).borderRadius,zemin:cs(t).backgroundColor,
        z:cs(t).zIndex,sag:Math.round(innerWidth-R(t).right)},
      serit:rail?{w:Math.round(R(rail).width),h:Math.round(R(rail).height),
        zemin:cs(rail).backgroundColor,z:cs(rail).zIndex,sag:Math.round(innerWidth-R(rail).right),
        ust:Math.round(R(rail).top)}:'YOK',
      sapma: ban?Math.round(Math.abs((R(t).top+scrollY+R(t).height/2)-(R(ban).top+scrollY+R(ban).height/2))):null
    };
  });
  console.log(f.padEnd(30), JSON.stringify(r));
}
await pg.goto(''+BASE+'/hareket-rehberi-v1.html',{waitUntil:'load'}); await pg.waitForTimeout(700);
const g=await pg.evaluate(()=>{const t=document.querySelector('.feedback-tab');const r=t.getBoundingClientRect();
  return {x:Math.max(0,Math.round(r.left)-70),y:Math.max(0,Math.round(r.top)-40),width:Math.round(r.width)+72,height:Math.round(r.height)+80};});
console.log('JS hatası:',hata.length);
await b.close();
