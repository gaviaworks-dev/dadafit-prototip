import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const URL = 'http://127.0.0.1:8788/rozetlerim-v1.html?auth=1';
const W = [[1440,900],[1024,800],[768,900],[390,844]];

const b = await chromium.launch();
for (const [w,h] of W) {
  const ctx = await b.newContext({ viewport:{width:w,height:h} });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('PAGEERROR '+e.message));
  await p.goto(URL, { waitUntil:'networkidle' });
  await p.waitForTimeout(400);

  // sekme var mı, tıkla
  const tabInfo = await p.evaluate(() => {
    const tabs = [...document.querySelectorAll('.fit-tab')].map(t => ({
      txt: t.innerText.trim(), tab: t.getAttribute('data-tab'),
      vis: t.getClientRects().length > 0
    }));
    return tabs;
  });
  const kd = await p.$('.fit-tab[data-tab="kademe"]');
  if (kd) { await kd.click(); await p.waitForTimeout(350); }

  const m = await p.evaluate(() => {
    const vis = el => !!el && el.getClientRects().length > 0;
    const L = document.getElementById('rzLadder');
    const R = document.getElementById('rzRank');
    const steps = L ? [...L.querySelectorAll('.rank-step')] : [];
    const K = window.FIT_ROZET ? window.FIT_ROZET.kademe() : null;
    const rects = steps.map(s => { const r = s.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height),vis:s.getClientRects().length>0}; });
    return {
      hasEngine: !!window.FIT_ROZET,
      ladderExists: !!L, ladderVisible: vis(L),
      rankVisible: vis(R),
      stepCount: steps.length,
      stepVisible: rects.filter(r=>r.vis).length,
      stepH: rects.map(r=>r.h),
      current: steps.findIndex(s=>s.classList.contains('current'))+1,
      done: steps.filter(s=>s.classList.contains('done')).length,
      locked: steps.filter(s=>s.classList.contains('locked')).length,
      kademe: K && { ad:K.ad, sira:K.sira, toplam:K.toplam, puan:K.puan, aktifGun:K.aktifGun,
                     oran:K.oran, puanOran:K.puanOran, gunOran:K.gunOran, engel:K.engel,
                     kalanPuan:K.kalanPuan, kalanGun:K.kalanGun, kademeSayi:K.kademeler.length },
      barW: (()=>{ const s=document.querySelector('.rn-bar span'); return s? s.style.width : null; })(),
      rankTxt: R ? R.innerText.replace(/\s+/g,' ').trim() : '',
      olcuKart: document.querySelectorAll('#rzOlcu .pd-kart').length,
      overflow: Math.round(document.documentElement.scrollWidth - document.documentElement.clientWidth),
      paneVis: [...document.querySelectorAll('.fit-pane')].map(x=>({p:x.dataset.pane, v:x.getClientRects().length>0}))
    };
  });
  console.log('=== '+w+'x'+h+' ===');
  console.log(JSON.stringify({tabs:tabInfo.map(t=>t.tab+':'+(t.vis?'v':'-')), ...m}, null, 1));
  console.log('konsol hata: '+errs.length, errs.slice(0,5));
  await p.screenshot({ path:`/Users/gaviaworks/Developer/Projects/dadafit-prototip/docs/screenshots/kademe-${w}.png`, fullPage:false });
  await ctx.close();
}
await b.close();
