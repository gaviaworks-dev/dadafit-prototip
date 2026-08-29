import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:1000} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:8788/rozetlerim-v1.html?auth=1', { waitUntil:'networkidle' });
await p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('dm_fit')||'{}');
  const g = [];
  for (let i=0;i<50;i++){ const d=new Date(); d.setDate(d.getDate()-i);
    g.push({ tarihISO:d.toISOString(), ad:'Hareket '+(i%18), slug:'h-'+(i%18), dk:40,
             kaynak:'olculdu', metrik:{ set:6, tekrar:60, km:2, adim:4000 } }); }
  s.surum=2; s.gecmis=g; s.arsiv=s.arsiv||[]; s.bildirimler=s.bildirimler||[];
  localStorage.setItem('dm_fit', JSON.stringify(s));
});
await p.reload({ waitUntil:'networkidle' });
await p.waitForTimeout(500);
await p.click('.fit-tab[data-tab="kademe"]');
await p.waitForTimeout(400);
const m = await p.evaluate(() => {
  const K = window.FIT_ROZET.kademe();
  const steps=[...document.querySelectorAll('#rzLadder .rank-step')];
  const rt = document.getElementById('rzRank').innerText.replace(/\s+/g,' ').trim();
  return { ad:K.ad, sira:K.sira+'/'+K.toplam, puan:K.puan, aktifGun:K.aktifGun,
    oran:K.oran, puanOran:K.puanOran, gunOran:K.gunOran, engel:K.engel,
    kalanPuan:K.kalanPuan, kalanGun:K.kalanGun,
    oranDusukMu: K.oran===Math.min(K.puanOran,K.gunOran),
    barW: document.querySelector('.rn-bar span').style.width,
    done: steps.filter(s=>s.classList.contains('done')).length,
    currentIdx: steps.findIndex(s=>s.classList.contains('current'))+1,
    locked: steps.filter(s=>s.classList.contains('locked')).length,
    buradasin: document.querySelectorAll('#rzLadder .rs-now').length,
    engelEkranda: /aktif gün|puan/.test(rt),
    rankTxt: rt,
    overflow: Math.round(document.documentElement.scrollWidth-document.documentElement.clientWidth)
  };
});
console.log(JSON.stringify(m,null,1));
await p.evaluate(()=>document.getElementById('rzRank').scrollIntoView({block:'start'}));
await p.waitForTimeout(300);
await p.screenshot({path:'/Users/gaviaworks/Developer/Projects/dadafit-prototip/docs/screenshots/kademe-dolu.png'});
await b.close();
