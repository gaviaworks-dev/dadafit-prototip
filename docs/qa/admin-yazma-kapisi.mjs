/* YAZMA YÜZEYİ KAPISI — boş zorunlu alanda not BASILMAMALI.
   Bu turda üç ayrı yoldan aynı yalan doğdu:
     1. closest('form') null → koruma sessizce atlandı
     2. kaydet düğmesi formun dışında → aynı sonuç
     3. pattern istisna attı → reportValidity() çöktü, not yine basıldı
   Kapı artık üçünü birden yakalar: BOŞ formda not sayısı 0 olmalı. */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
import { readdirSync } from 'fs';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
const S=readdirSync('/Users/gaviaworks/Developer/Projects/dadafit-prototip').filter(f=>/^admin-.*\.html$/.test(f));
let kusur=0;
for(const s of S){
  const hata=[]; const h=m=>{if(m.type()==='error')hata.push(m.text().slice(0,90));};
  pg.on('console',h);
  await pg.goto('http://127.0.0.1:8788/'+s); await pg.waitForTimeout(700);
  // formu açan düğme varsa aç
  const ac=pg.locator('button:has-text("Yeni"), button:has-text("Ekle")').first();
  if(await ac.count()) { try{ await ac.click({timeout:2000}); await pg.waitForTimeout(400);}catch(e){} }
  const r=await pg.evaluate(()=>{
    const notOnce=document.querySelectorAll('.adm-maket-not').length;
    // görünür, zorunlu alanı olan formun kaydet düğmesine bas
    const f=[...document.querySelectorAll('form')].find(x=>x.getClientRects().length && x.querySelector('[required]'));
    if(!f) return {atlandi:true};
    f.querySelectorAll('[required]').forEach(e=>{ if(e.type!=='checkbox') e.value=''; });
    const d=[...document.querySelectorAll('button')].filter(x=>/kaydet|onayla|gönder|başlat|uygula/i.test(x.textContent) && x.getClientRects().length)[0];
    if(!d) return {atlandi:true};
    d.click();
    return {notOnce, notSonra:document.querySelectorAll('.adm-maket-not').length};
  });
  await pg.waitForTimeout(300);
  const notSonra=await pg.locator('.adm-maket-not').count();
  if(!r.atlandi && notSonra>(r.notOnce||0)){ console.log('⚠ YALAN', s, 'boş formda not basıldı'); kusur++; }
  if(hata.length){ console.log('⚠ KONSOL', s, hata[0]); kusur++; }
  pg.off('console',h);
}
console.log('---'); console.log('admin ekranı', S.length, '· yazma yüzeyi kusuru:', kusur);
await b.close();
