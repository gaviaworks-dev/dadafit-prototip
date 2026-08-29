import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1200}})).newPage();
await pg.goto('http://127.0.0.1:8788/index.html'); await pg.evaluate(()=>localStorage.setItem('dm_fit_login','1'));

const SAYFA=['egzersizlerim-v1.html','programlarim-v1.html','destek-v1.html','hesabim-v1.html',
             'egzersiz-kutuphane-v1.html','program-liste-v1.html','challengelarim-v1.html','pro-v1.html'];
const SEC={
  'kart · .fp-card':'.fp-card', 'kart · .pnl-card':'.pnl-card', 'kart · .ex-card':'.ex-card',
  'kart · .pr-card':'.pr-card', 'kart · .cc-card':'.cc-card',
  'h1':'h1','h2':'h2','h3 · kart başlığı':'.fp-card h3, .pnl-card .pc-title, .fp-head h3',
  'lead':'.lead','eyebrow':'.eyebrow',
  'düğme · birincil':'.btn.btn-primary','düğme · fit':'.btn.btn-fit',
  'düğme · çizgi':'.btn.btn-line','düğme · hayalet':'.btn.btn-ghost',
  'rozet · .fp-badge':'.fp-badge','çip · .df-fchip':'.df-fchip','durum · .pstat':'.pstat',
  'sekme şeridi':'.fit-tabs','sekme':'.fit-tab',
  'boş durum':'.fpx-bos, .lib-empty',
  'form · input':'input[type=text], input:not([type]), .fpx-kolform input',
  'form · textarea':'textarea','form · etiket':'label',
  'satır · .fp-row':'.fp-row','satır · .set-row':'.set-row',
  'bölüm · .sec':'section.sec, section.fp-body, section.hs-body',
  'kayıt düğmesi':'.kyt-btn'
};
const olcum={};
for(const f of SAYFA){
  await pg.goto('http://127.0.0.1:8788/'+f,{waitUntil:'load'}); await pg.waitForTimeout(450);
  const r=await pg.evaluate(sec=>{
    const cs=(e,p)=>getComputedStyle(e)[p];
    const out={};
    for(const [ad,s] of Object.entries(sec)){
      const e=[...document.querySelectorAll(s)].find(x=>x.getClientRects().length>0);
      if(!e) continue;
      const st=getComputedStyle(e), r=e.getBoundingClientRect();
      out[ad]={
        zemin:st.backgroundColor, kenar:st.border!=='0px none rgb(0, 0, 0)'?st.border:'-',
        yaricap:st.borderRadius, golge:st.boxShadow==='none'?'-':st.boxShadow,
        dolgu:st.padding, yukseklik:Math.round(r.height),
        yazi:st.fontSize+'/'+st.fontWeight+'/'+st.lineHeight, renk:st.color,
        harf:st.letterSpacing, altBosluk:st.marginBottom, ustBosluk:st.marginTop,
        aralik:st.gap==='normal'?'-':st.gap
      };
    }
    return out;
  },SEC);
  for(const [k,v] of Object.entries(r)) if(!olcum[k]) olcum[k]={sayfa:f,...v};
}
// :root tokenleri
await pg.goto('http://127.0.0.1:8788/egzersizlerim-v1.html',{waitUntil:'load'}); await pg.waitForTimeout(300);
const tok=await pg.evaluate(()=>{
  const cs=getComputedStyle(document.documentElement); const o={};
  for(const s of document.styleSheets){
    let kurallar; try{kurallar=s.cssRules}catch(e){continue}
    for(const k of kurallar){
      if(k.selectorText===':root'){ for(const p of k.style){ if(p.startsWith('--')) o[p]=cs.getPropertyValue(p).trim(); } }
    }
  }
  return o;
});
console.log(JSON.stringify({olcum, tokenSayisi:Object.keys(tok).length, token:tok},null,1));
await b.close();
