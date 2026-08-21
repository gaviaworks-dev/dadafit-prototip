/* =====================================================================
   DADAFIT — FİT PLANIM ÜST ÖZET KARTI TESTİ  (REVİZYON 6 · madde 19)
   ---------------------------------------------------------------------
   Neyi kanıtlar:
   1. Kayıt yokken DÜRÜST BOŞ DURUM — `.fpx-sum.is-empty`, sağ istatistik
      kolonu hiç basılmıyor, ilerleme çubuğu gizli, ekranda uydurma sayı yok.
   2. Bugün ekranından bir hareket işaretlenebiliyor ve işaret sayfa
      yenilendikten sonra DURUYOR (FIT_PLAN.isaretle → localStorage).
   3. `FIT_PLAN.ozet()` oranı DOM'daki üç göstergeyle BİREBİR aynı:
      istatistik kolonu · ilerleme çubuğunun genişliği · meta satırı.
   4. Kaydettiklerim, FIT_PLAN.listele()'den gelen planı satır olarak basıyor
      ve "Plan" süzgeci onu ayırıyor.
   5. Aktivite Kayıtlarım, plandaki işareti tarihiyle listeliyor.
   6. İşaretleme klavyeyle çalışıyor (odak + Enter).
   7. SESSİZ DEĞİŞİM YOK: günün son hareketi işaretlenince kart başka bir
      güne atlamıyor; yerinde kalıp "Gün tamamlandı" durumuna geçiyor ve
      sıradaki günü açıkça yazıyor.

   Depolama sözleşmesi: assets/js/fit-plan-kayit.js (window.FIT_PLAN).

   Çalıştırma:
     python3 -m http.server 8811 &
     PW_HOME=~/.pw node tests/plan-ozet.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const B='http://localhost:8811';
let hata=0; const not=(ok,m)=>{ console.log((ok?'  ✓ ':'  ✗ ')+m); if(!ok)hata++; };
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:1440,height:1000}});
await c.addInitScript(()=>{try{localStorage.setItem('dm-cookie-consent','accepted');
  localStorage.setItem('dm_user',JSON.stringify({auth:true,roles:['kullanici']}));}catch(e){}});
const p=await c.newPage();
const hatalar=[]; p.on('pageerror',e=>hatalar.push(e.message));
p.on('console',m=>{if(m.type()==='error')hatalar.push(m.text());});

/* 0 — bileşen var mı (taban commit'te kırmızıya düşen kapı) */
console.log('\n0 · üst özet kartı ve sözleşme modülü kurulu mu');
await p.goto(`${B}/fit-planim-v1.html`,{waitUntil:'load'}); await p.waitForTimeout(500);
const kurulum = await p.evaluate(()=>({
  sum: !!document.querySelector('.fpx-sum'),
  api: typeof window.FIT_PLAN === 'object' && typeof (window.FIT_PLAN||{}).ozet === 'function',
  stats: !!document.getElementById('fpxStats'), bar: !!document.getElementById('fpxBar')
}));
not(kurulum.sum,   'fit-planim-v1: üst özet kartı (.fpx-sum) sayfada');
not(kurulum.api,   'fit-planim-v1: FIT_PLAN sözleşme modülü yüklü');
not(kurulum.stats && kurulum.bar, 'fit-planim-v1: istatistik kolonu ve ilerleme çubuğu kurulu');
if(!(kurulum.sum && kurulum.api)){
  console.log('\n' + hata + ' SORUN — üst özet kartı kurulu değil, kalan adımlar koşulamaz.');
  await b.close(); process.exit(1);
}

/* 1 — KAYIT YOKKEN DÜRÜST BOŞ DURUM */
console.log('\n1 · kayıt yokken dürüst boş durum');
for(const s of ['fit-planim-v1','fit-planim-ilerleme-v1','fit-planim-gecmis-v1']){
  await p.goto(`${B}/${s}.html`,{waitUntil:'load'}); await p.waitForTimeout(500);
  const r=await p.evaluate(()=>({
    isEmpty:document.querySelector('.fpx-sum').classList.contains('is-empty'),
    statKalem:document.querySelectorAll('.fpx-stats > *').length,
    barGizli:document.getElementById('fpxBar').hidden,
    bosGorunur:!!document.querySelector('.lib-empty.show'),
    sayilar:[...document.querySelectorAll('.fpx-sum b, .fpx-sum-meta')].map(e=>e.textContent.trim()).join('|')
  }));
  not(r.isEmpty && r.statKalem===0 && r.barGizli && r.bosGorunur && r.sayilar==='',
      `${s}: is-empty · 0 istatistik · çubuk gizli · boş durum görünür · uydurma sayı yok`);
}

/* plan yaz */
await p.evaluate(()=>{ FIT_PLAN.kaydet({ ad:'Ev · 3 gün · Başlangıç', kaynak:'antrenman-olusturucu',
  secimler:{gunSayisi:3,sure:25},
  gunler:[{no:1,ad:'Gün 1',odak:'İtiş',hareketler:[{slug:'sinav',ad:'Şınav',set:3,tekrar:8},{slug:'plank',ad:'Plank',set:3,sure:'40 sn'}]},
          {no:2,ad:'Gün 2',odak:'Çekiş',hareketler:[{slug:'kurek',ad:'Kürek Çekiş',set:3,tekrar:12}]},
          {no:3,ad:'Gün 3',odak:'Bacak',hareketler:[{slug:'squat',ad:'Goblet Squat',set:3,tekrar:12},{slug:'hamle',ad:'Hamle',set:3,tekrar:10}]}]}); });

/* 2 — İŞARETLEME + KALICILIK */
console.log('\n2 · işaretleme ve kalıcılık');
await p.goto(`${B}/fit-planim-v1.html`,{waitUntil:'load'}); await p.waitForTimeout(500);
const once=await p.evaluate(()=>document.querySelectorAll('.fpx-mark[aria-pressed="true"]').length);
await p.click('#fpxHareketler .fpx-mark');
await p.waitForTimeout(200);
const sonra=await p.evaluate(()=>document.querySelectorAll('.fpx-mark[aria-pressed="true"]').length);
not(once===0 && sonra===1, `tıklamadan önce ${once} işaret, sonra ${sonra} işaret`);
await p.reload({waitUntil:'load'}); await p.waitForTimeout(600);
const yenile=await p.evaluate(()=>({
  isaret:document.querySelectorAll('.fpx-mark[aria-pressed="true"]').length,
  depo:JSON.parse(localStorage.getItem('dm_fit_planlar_v1')).planlar[0].ilerleme
}));
not(yenile.isaret===1, `sayfa yenilendikten sonra işaret duruyor (${yenile.isaret}) · depo: ${JSON.stringify(yenile.depo)}`);

/* 3 — FIT_PLAN.ozet() ORANI DOM'DAKİYLE BİREBİR */
console.log('\n3 · FIT_PLAN.ozet() ↔ DOM');
for(const s of ['fit-planim-v1','fit-planim-ilerleme-v1']){
  await p.goto(`${B}/${s}.html`,{waitUntil:'load'}); await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{
    const o=FIT_PLAN.ozet();
    const st=[...document.querySelectorAll('.fpx-stats .fpx-stat')].map(e=>e.querySelector('b').textContent.trim());
    const bar=document.getElementById('fpxBar').firstElementChild.style.width;
    const meta=document.getElementById('fpxMeta').textContent;
    return {oran:o.oran, yapilan:o.yapilan, toplam:o.toplam, aktifGun:o.aktifGun, gunSayisi:o.gunSayisi,
            st, bar, metaOran:(meta.match(/%(\d+)/)||[])[1]};
  });
  const bekOran='%'+r.oran;
  not(r.st[0]===bekOran, `${s}: istatistik "${r.st[0]}" = ozet().oran ${bekOran}`);
  not(r.bar===r.oran+'%', `${s}: ilerleme çubuğu ${r.bar} = %${r.oran}`);
  not(String(r.metaOran)===String(r.oran), `${s}: meta satırı %${r.metaOran} = %${r.oran}`);
  not(r.st.some(x=>x===r.yapilan+' / '+r.toplam), `${s}: "${r.yapilan} / ${r.toplam}" hareket sayısı ekranda`);
}

/* 4 — KAYDETTİKLERİM planı listeliyor */
console.log('\n4 · Kaydettiklerim plan satırı');
await p.goto(`${B}/fit-planim-kaydettiklerim-v1.html`,{waitUntil:'load'}); await p.waitForTimeout(600);
const kd=await p.evaluate(()=>{
  const n=document.querySelectorAll('#skList .fp-row[data-tur="plan"]').length;
  document.querySelector('.df-fchip[data-val="plan"]').click();
  const gorunen=[...document.querySelectorAll('#skList .fp-row')].filter(r=>r.style.display!=='none').length;
  return {n, gorunen, sayac:document.getElementById('skCount').textContent};
});
not(kd.n===1 && kd.gorunen===1 && kd.sayac==='1 kayıt', `plan satırı ${kd.n} · "Plan" süzgeci ${kd.gorunen} satır · sayaç "${kd.sayac}"`);

/* 5 — AKTİVİTE KAYITLARIM işareti gösteriyor */
console.log('\n5 · Aktivite Kayıtlarım');
await p.goto(`${B}/fit-planim-gecmis-v1.html`,{waitUntil:'load'}); await p.waitForTimeout(600);
const gk=await p.evaluate(()=>({
  satir:document.querySelectorAll('#fpxIsaretler .fp-row').length,
  bosGizli:!document.getElementById('fpxIsaretBos').classList.contains('show'),
  rozet:document.getElementById('fpxIsaretSayi').textContent
}));
not(gk.satir===1 && gk.bosGizli && gk.rozet==='1 kayıt', `işaret satırı ${gk.satir} · boş durum kapalı · rozet "${gk.rozet}"`);

/* 6 — klavye ile işaretleme */
console.log('\n6 · klavye');
await p.goto(`${B}/fit-planim-v1.html`,{waitUntil:'load'}); await p.waitForTimeout(600);
const kb=await p.evaluate(()=>{ const b=document.querySelector('#fpxHareketler .fpx-mark[aria-pressed="false"]');
  b.focus(); return document.activeElement===b; });
await p.keyboard.press('Enter'); await p.waitForTimeout(200);
const kb2=await p.evaluate(()=>document.querySelectorAll('.fpx-mark[aria-pressed="true"]').length);
not(kb && kb2===2, `düğme odaklanabiliyor · Enter ile işaretlendi (${kb2} işaret)`);
/* 7 — gün bitince kart YERİNDE kalır (sessiz değişim yok) */
console.log('\n7 · sessiz değişim yok');
const g7=await p.evaluate(()=>({gun:document.getElementById('fpxGunAd').textContent,
  rozet:document.getElementById('fpxGunRozet').textContent.trim(),
  not:document.getElementById('fpxGunNot').hidden?null:document.getElementById('fpxGunNot').textContent.trim(),
  sonrakiStat:[...document.querySelectorAll('.fpx-stats .fpx-stat')].map(e=>e.textContent.trim())}));
not(/Gün 1/.test(g7.gun) && /tamamland/i.test(g7.rozet) && g7.not,
  `kart "${g7.gun}" · rozet "${g7.rozet}" · not "${(g7.not||'').slice(0,60)}" · istatistik ${JSON.stringify(g7.sonrakiStat)}`);

console.log('\nkonsol/JS hatası: '+hatalar.length+(hatalar.length?' → '+hatalar.slice(0,3).join(' | '):''));
console.log(hata? `\n${hata} SORUN` : '\n✓ hepsi geçti');
await b.close();
process.exit(hata?1:0);
