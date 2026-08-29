import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const URL='http://127.0.0.1:8788/rozetlerim-v1.html?auth=1';
const SEED = () => {
  const s = JSON.parse(localStorage.getItem('dm_fit')||'{}');
  const g=[]; for(let i=0;i<50;i++){const d=new Date();d.setDate(d.getDate()-i);
    g.push({tarihISO:d.toISOString(),ad:'Hareket '+(i%18),slug:'h-'+(i%18),dk:40,
            kaynak:'olculdu',metrik:{set:6,tekrar:60,km:2,adim:4000}});}
  s.surum=2;s.gecmis=g;s.arsiv=s.arsiv||[];s.bildirimler=s.bildirimler||[];
  localStorage.setItem('dm_fit',JSON.stringify(s));
};
const b = await chromium.launch();
for (const senaryo of ['bos','dolu']) {
for (const [w,h] of [[1440,1000],[1024,900],[768,900],[390,844]]) {
  const ctx = await b.newContext({viewport:{width:w,height:h}});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto(URL,{waitUntil:'networkidle'});
  if (senaryo==='dolu'){ await p.evaluate(SEED); await p.reload({waitUntil:'networkidle'}); }
  await p.waitForTimeout(450);
  await p.click('.fit-tab[data-tab="kademe"]');
  await p.waitForTimeout(350);
  const m = await p.evaluate(()=>{
    const vis = el => !!el && el.getClientRects().length>0;
    const K = window.FIT_ROZET.kademe();
    const R = document.getElementById('rzRank');
    const st = [...document.querySelectorAll('#rzLadder .rank-step')];
    const btn = R.querySelector('.btn');
    const br = btn && btn.getBoundingClientRect();
    const txt = document.body.innerText.toLowerCase();
    return {
      sira:K.sira+'/'+K.toplam, ad:K.ad, puan:K.puan, aktifGun:K.aktifGun,
      oran:K.oran, puanOran:K.puanOran, gunOran:K.gunOran, engel:K.engel,
      oranSayiMi: typeof K.oran==='number',
      // boş durum 4 parçası
      kap:R.className,
      peIco: R.querySelectorAll('.pe-ico').length, h4:R.querySelectorAll('h4').length,
      pAdet:R.querySelectorAll('p').length, btnAdet:R.querySelectorAll('.btn').length,
      btnHref: btn?btn.getAttribute('href'):null,
      btnH: br?Math.round(br.height):null, btnW: br?Math.round(br.width):null,
      rankGorunur: vis(R),
      // merdiven
      basamak:st.length, gorunur:st.filter(s=>s.getClientRects().length>0).length,
      done:st.filter(s=>s.classList.contains('done')).length,
      current:st.findIndex(s=>s.classList.contains('current'))+1,
      locked:st.filter(s=>s.classList.contains('locked')).length,
      buradasin:document.querySelectorAll('#rzLadder .rs-now').length,
      // yasak cümleler — innerText'te, büyük/küçük duyarsız (DENETIM §2b)
      yasak_yuz100esik0: (txt.match(/puan %100 · eşik 0/g)||[]).length,
      yasak_gectin: (txt.match(/puan eşiğini geçtin/g)||[]).length,
      yasak_null: (txt.match(/\b(null|nan|undefined)\b/g)||[]).length,
      rankTxt:R.innerText.replace(/\s+/g,' ').trim(),
      overflow:Math.round(document.documentElement.scrollWidth-document.documentElement.clientWidth)
    };
  });
  console.log(senaryo+' '+w+'px '+JSON.stringify({...m,hata:errs.length}));
  if(errs.length) console.log('   HATA:',errs.slice(0,3));
  if(w===1440){ await p.evaluate(()=>document.getElementById('rzRank').scrollIntoView({block:'start'}));
    await p.waitForTimeout(300);
    await p.screenshot({path:`/Users/gaviaworks/Developer/Projects/dadafit-prototip/docs/screenshots/kademe-${senaryo}.png`}); }
  await ctx.close();
}}
await b.close();
