import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const OLC = () => {
  const t=document.querySelector('.pf-top'); if(!t) return {yok:true};
  const cs=e=>getComputedStyle(e); const R=e=>e.getBoundingClientRect();
  const g=sel=>{const e=t.querySelector(sel)||document.querySelector(sel);
    return e?{w:Math.round(R(e).width),h:Math.round(R(e).height),r:cs(e).borderRadius}:null;};
  const kapak=t.querySelector('[class*="banner"],[class*="cover"],[class*="kapak"]');
  return {
    ust:{h:Math.round(R(t).height), bg:cs(t).backgroundColor},
    kapak: kapak?{sinif:kapak.className.slice(0,26),h:Math.round(R(kapak).height),r:cs(kapak).borderRadius,
                  gorsel:/url\(/.test(cs(kapak).backgroundImage)}:null,
    avatar: g('[class*="ava"]'),
    kart: g('[class*="head"],[class*="card"],[class*="id"]'),
    istatistik: (()=>{const s=t.querySelector('[class*="stat"]')||document.querySelector('.pf-stats,[class*="stat"]');
      return s?{sinif:s.className.slice(0,24),kutu:s.children.length,h:Math.round(R(s).height),r:cs(s).borderRadius}:null;})(),
    sekmeRayi: !!document.querySelector('.pf-tabbar,[class*="tab"]')
  };
};
for(const [ad,url] of [['GASTRO  sefler/admin','https://dadagastro.com/sefler/admin'],
                       ['DADAFIT profil-v1',''+BASE+'/profil-v1.html']]){
  const pg=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
  pg.on('pageerror',()=>{});
  try{ await pg.goto(url,{waitUntil:'domcontentloaded',timeout:30000}); await pg.waitForTimeout(1600);
       console.log(ad, JSON.stringify(await pg.evaluate(OLC),null,1)); }
  catch(e){ console.log(ad,'HATA',e.message.slice(0,60)); }
  await pg.close();
}
await b.close();
