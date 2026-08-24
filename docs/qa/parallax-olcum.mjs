/* Parallax nöbeti: band kuruldu mu, görsel SABİT mi (scroll'da yer değiştirmiyor mu) */
import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const hata=[]; pg.on('pageerror',e=>hata.push(e.message));
await pg.goto('file:///Users/gaviaworks/Developer/Projects/dadafit-prototip/dadafit-hub-v1.html',{waitUntil:'load'});
await pg.waitForTimeout(600);

const kur=await pg.evaluate(()=>{
  const band=document.querySelector('.df-recipe-band');
  if(!band) return {err:'band yok'};
  const clip=band.querySelector(':scope > .px-clip');
  const media=clip&&clip.querySelector('.px-media');
  const veil=clip&&clip.querySelector('.px-veil');
  return {
    pxBand:band.classList.contains('px-band'),
    clip:!!clip, media:!!media, veil:!!veil,
    mediaPos: media?getComputedStyle(media).position:null,
    img: media?media.style.backgroundImage.slice(0,52):null,
    shift: clip?clip.style.getPropertyValue('--px-shift'):null,
    ilkCocuk: band.firstElementChild?band.firstElementChild.className:null,
    tumunuGor: (band.querySelector('.see-all')||{}).textContent?.trim().slice(0,20)||null,
    href: (band.querySelector('.see-all')||{}).href||null,
    kart: band.querySelectorAll('.df-combo-card').length
  };
});
console.log('KURULUM:', JSON.stringify(kur,null,1));

// sabitlik ölçümü: iki farklı scroll'da .px-media ekran konumu aynı kalmalı
async function konum(y){
  await pg.evaluate(v=>window.scrollTo(0,v), y);
  await pg.waitForTimeout(220);
  return pg.evaluate(()=>{
    const m=document.querySelector('.df-recipe-band .px-media');
    if(!m) return null;
    const r=m.getBoundingClientRect();
    const band=document.querySelector('.df-recipe-band').getBoundingClientRect();
    return {mediaTop:Math.round(r.top), bandTop:Math.round(band.top)};
  });
}
const bandY=await pg.evaluate(()=>document.querySelector('.df-recipe-band').getBoundingClientRect().top+scrollY);
const a=await konum(bandY-700), c=await konum(bandY-200);
console.log('scroll A:',JSON.stringify(a));
console.log('scroll B:',JSON.stringify(c));
console.log('görsel ekranda kaydı mı:', a.mediaTop-c.mediaTop, 'px  (0 = SABİT ✓)');
console.log('band ekranda kaydı mı  :', a.bandTop-c.bandTop, 'px  (>0 = band akıyor ✓)');
console.log('JS hatası:', hata.length, hata.join(' | '));
await b.close();
