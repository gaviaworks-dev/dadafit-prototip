import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const SEED = () => {
  const s = JSON.parse(localStorage.getItem('dm_fit')||'{}');
  const g = [];
  for (let i=0;i<50;i++){ const d=new Date(); d.setDate(d.getDate()-i);
    g.push({ tarihISO:d.toISOString(), ad:'Hareket '+(i%18), slug:'h-'+(i%18), dk:40,
             kaynak:'olculdu', metrik:{ set:6, tekrar:60, km:2, adim:4000 } }); }
  s.surum=2; s.gecmis=g; s.arsiv=s.arsiv||[]; s.bildirimler=s.bildirimler||[];
  localStorage.setItem('dm_fit', JSON.stringify(s));
};
const b = await chromium.launch();
for (const [w,h] of [[1440,1000],[1024,900],[768,900],[390,844]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto('http://127.0.0.1:8788/rozetlerim-v1.html?auth=1',{waitUntil:'networkidle'});
  await p.evaluate(SEED);
  await p.reload({waitUntil:'networkidle'});
  await p.waitForTimeout(450);
  await p.click('.fit-tab[data-tab="kademe"]');
  await p.waitForTimeout(300);
  const geo = await p.evaluate(()=>{
    const st=[...document.querySelectorAll('#rzLadder .rank-step')];
    const r=st.map(s=>s.getBoundingClientRect());
    return { n:st.length, minH:Math.round(Math.min(...r.map(x=>x.height))),
      minW:Math.round(Math.min(...r.map(x=>x.width))),
      kol: new Set(r.map(x=>Math.round(x.left))).size,
      overflow: Math.round(document.documentElement.scrollWidth-document.documentElement.clientWidth) };
  });
  // basamağa tıkla → koleksiyona süzülmeli
  const before = await p.evaluate(()=>document.querySelectorAll('.badge-card').length);
  await p.evaluate(()=>document.querySelectorAll('#rzLadder .rank-step')[2].click());
  await p.waitForTimeout(400);
  const after = await p.evaluate(()=>({
    kart: document.querySelectorAll('.badge-card').length,
    aktifPane: [...document.querySelectorAll('.fit-pane')].filter(x=>x.getClientRects().length>0).map(x=>x.dataset.pane)[0],
    filtreGorunur: document.getElementById('rzFiltre').classList.contains('show'),
    filtreAd: document.getElementById('rzFiltreAd').innerText,
    overflow: Math.round(document.documentElement.scrollWidth-document.documentElement.clientWidth)
  }));
  console.log(w+'px', JSON.stringify({...geo, tiklamaOncesiKart:before, ...after, hata:errs.length}));
  await ctx.close();
}
await b.close();
