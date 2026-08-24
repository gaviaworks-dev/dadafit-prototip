import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
for(const W of [1440,390]){
  const pg=await (await b.newContext({viewport:{width:W,height:1100}})).newPage();
  const hata=[]; pg.on('pageerror',e=>hata.push(e.message));
  await pg.goto(''+BASE+'/enerji-defteri-v1.html?auth=1',{waitUntil:'load'});
  await pg.waitForTimeout(900);
  const r=await pg.evaluate(()=>{
    const R=e=>e?[Math.round(e.getBoundingClientRect().width),Math.round(e.getBoundingClientRect().height)]:null;
    const q=s=>document.querySelector(s); const cs=e=>getComputedStyle(e);
    const kapak=q('.fp-kapak'), kimlik=q('.fp-kimlik'), ava=q('.fp-ava2');
    const hdr=q('.header');
    return {
      eskiKoyuBanner:document.querySelectorAll('.lib-top.fp-top').length,
      profil:R(q('.fp-profil')), kapak:R(kapak), kimlik:R(kimlik), avatar:R(ava),
      kapakRadius:kapak?cs(kapak).borderRadius:null,
      kapakGorsel:kapak?/url\(/.test(cs(kapak).backgroundImage)||!!kapak.querySelector('.px-clip'):null,
      parallax:!!(kapak&&kapak.querySelector('.px-media')),
      avaRadius:ava?cs(ava).borderRadius:null,
      kimlikBinme:kimlik?cs(kimlik).marginTop:null,
      h1:(q('.fp-kimlik-id h1')||{}).textContent,
      overMode:document.body.getAttribute('data-fit-over'),
      headerZemin:hdr?cs(hdr).backgroundColor:null,
      markaRenk:(()=>{const m=q('.brand .ft, .fit-brand .ft, .brand span');return m?cs(m).color:null;})(),
      sekmeRayi:!!q('.pf-tabbar.fp-tabbar'),
      yatayTasma:document.documentElement.scrollWidth>document.documentElement.clientWidth+1
    };
  });
  console.log(`@${W}px`, JSON.stringify(r,null,1), hata.length?('JS:'+hata.join('|')):'');
  await pg.close();
}
await b.close();
