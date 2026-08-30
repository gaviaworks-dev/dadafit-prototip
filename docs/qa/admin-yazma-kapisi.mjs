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
    /* 🔴 R19 · KAPININ KENDİ KUSURU DÜZELTİLDİ.
       ÖNCEKİ HÂL: boşaltılan form ile tıklanan düğme AYRI olabiliyordu.
       `admin-paketler-v1.html`de yedi form var; kapı `pkGrupF`in yedi
       zorunlu alanını boşaltıp `pkFiyatF`in ("Tutarları kaydet", 0 zorunlu
       alan) düğmesine basıyor ve dürüst basılmış bir notu YALAN sayıyordu.
       Yanlış kırmızı, kırmızıyı değersizleştirir (bkz. lessons §3).
       DOĞRUSU: düğme, boşaltılan formun KENDİ düğmesi olmalı.
       Kaydet düğmesi formun DIŞINDA da olabildiği için (kart ayak çubuğu)
       ikinci yol da denenir: düğmenin bulunduğu kartın içindeki form. */
    const formlar=[...document.querySelectorAll('form')]
      .filter(x=>x.getClientRects().length && x.querySelector('[required]'));
    if(!formlar.length) return {atlandi:true};

    const dugmeler=[...document.querySelectorAll('button')]
      .filter(x=>/kaydet|onayla|gönder|başlat|uygula/i.test(x.textContent) && x.getClientRects().length);

    for(const f of formlar){
      const d = dugmeler.find(x =>
        f.contains(x) ||
        (x.form === f) ||
        (x.closest('.adm-card,.pnl-card,.fp-card') || {}).contains?.(f)
      );
      if(!d) continue;
      f.querySelectorAll('[required]').forEach(e=>{ if(e.type!=='checkbox') e.value=''; });
      d.click();
      return {notOnce, form:f.id||'(idsiz)', dugme:d.textContent.trim().slice(0,24),
              notSonra:document.querySelectorAll('.adm-maket-not').length};
    }
    return {atlandi:true};
  });
  await pg.waitForTimeout(300);
  const notSonra=await pg.locator('.adm-maket-not').count();
  if(!r.atlandi && notSonra>(r.notOnce||0)){
    console.log('⚠ YALAN', s, '— boş formda not basıldı ·', r.form, '→', '"'+r.dugme+'"'); kusur++; }
  if(hata.length){ console.log('⚠ KONSOL', s, hata[0]); kusur++; }
  pg.off('console',h);
}
console.log('---'); console.log('admin ekranı', S.length, '· yazma yüzeyi kusuru:', kusur);
await b.close();
