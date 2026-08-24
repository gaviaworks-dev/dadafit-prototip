import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
for(const W of [1440,1024,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:1000}})).newPage();
  const hata=[]; pg.on('pageerror',e=>hata.push(e.message));
  await pg.goto(''+BASE+'/dadafit-hub-v1.html',{waitUntil:'load'}); await pg.waitForTimeout(600);
  const r=await pg.evaluate(()=>{
    const band=document.querySelector('.df-recipe-band');
    const kart=[...band.querySelectorAll('.rc-card')];
    const eyebrow=band.querySelector('.dg-mark');
    const cs=e=>getComputedStyle(e); const R=e=>e.getBoundingClientRect();
    const grid=band.querySelector('.rc-grid');
    return {
      tarifKarti:kart.length,
      eskiComboKart:band.querySelectorAll('.df-combo-card').length,
      kolon:grid?cs(grid).gridTemplateColumns.split(' ').length:0,
      etiketZemin:cs(eyebrow).backgroundColor, etiketKenarlik:cs(eyebrow).borderTopWidth+' '+cs(eyebrow).borderTopStyle,
      etiketDolgu:cs(eyebrow).padding, etiketRenk:cs(eyebrow).color,
      cip:kart.map(k=>(k.querySelector('.rc-chip')||{}).textContent),
      baslik:kart.map(k=>(k.querySelector('h4')||{}).textContent),
      gorselYemek:kart.filter(k=>{const m=k.querySelector('.rc-media');return m&&/photo-16049|photo-15401|photo-15460/.test(cs(m).backgroundImage);}).length,
      goRenk:[...new Set(kart.map(k=>cs(k.querySelector('.rc-go')).color))],
      yesilKalan:[...band.querySelectorAll('*')].filter(e=>{
        const c=cs(e).color+cs(e).backgroundColor+cs(e).borderTopColor;
        return /rgb\(0, 157, 79\)|rgb\(127, 231, 175\)|rgb\(0, 122, 61\)/.test(c);
      }).length,
      yukseklikler:[...new Set(kart.map(k=>Math.round(R(k).height)))],
      yatayTasma:document.documentElement.scrollWidth>document.documentElement.clientWidth+1
    };
  });
  console.log(`@${W}px`, JSON.stringify(r), hata.length?('JS:'+hata.join('|')):'');
}
await b.close();
