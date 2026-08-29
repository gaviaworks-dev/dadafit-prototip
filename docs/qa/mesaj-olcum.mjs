/* =====================================================================
   ANTRENÖR SOHBETİ — ölçüm sondası   (R15/5 · 2026-08-29)
   ---------------------------------------------------------------------
   Koşma:  PW_HOME=~/.pw node docs/qa/mesaj-olcum.mjs
   Sunucu: http://127.0.0.1:8788

   NE ÖLÇER
     1  yüzen düğmenin konumu · üç genişlikte (1440 · 1024 · 768)
        + "Görüş Bildir" şeridi ve "başa dön" düğmesiyle ÇAKIŞMA
     2  panel açılıyor mu
     3  mesaj kaydı: yazmadan önce → yazdıktan sonra → SAYFA YENİLENDİKTEN sonra
     4  randevusuz kullanıcıda düğmenin metni ve hedefi
     5  okunmamış rozeti
     6  üç genişlikte yatay taşma
     7  dokunma hedefi 44×44
     8  kontrast 4.5:1
     9  konsol hatası
   Görünürlük `getClientRects().length > 0` ile ölçülür (offsetParent DEĞİL).
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const KOK = 'http://127.0.0.1:8788';
const GEN = [[1440, 1200], [1024, 900], [768, 1000]];
const SAYFA = 'egzersizlerim-v1.html';           /* rastgele bir iç sayfa */

const RANDEVULAR = [
  { antrenor:'Selin Aksoy',  slug:'selin-aksoy',  hizmet:'Birebir seans', fiyat:'1.200 TL', tarih:'2 Eylül Sal', saat:'19:00', durum:'onaylandi' },
  { antrenor:'Burak Demir',  slug:'burak-demir',  hizmet:'Program yazımı', fiyat:'2.400 TL', tarih:'5 Eylül Cum', saat:'10:30', durum:'onay-bekliyor' }
];

const hatalar = [];
const satir = [];
function yaz(k, v){ satir.push([k, v]); }

/* ---- kontrast (WCAG 1.4.3) ---- */
function kanal(c){ c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
function lum([r,g,b]){ return 0.2126*kanal(r)+0.7152*kanal(g)+0.0722*kanal(b); }
function rgb(s){ const m=String(s).match(/[\d.]+/g); return m ? m.slice(0,3).map(Number) : [0,0,0]; }
function oran(a,b){ const L1=lum(rgb(a)), L2=lum(rgb(b)); const [h,l]=L1>L2?[L1,L2]:[L2,L1]; return (h+0.05)/(l+0.05); }

function kesisiyor(a, b){
  if(!a || !b || !a.gorunur || !b.gorunur) return false;
  return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
}

const tarayici = await chromium.launch();

async function yeniSayfa(w, h){
  const ctx = await tarayici.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  p.on('console', m => { if(m.type()==='error') hatalar.push(`${w}px · ${m.text()}`); });
  p.on('pageerror', e => hatalar.push(`${w}px · pageerror · ${e.message}`));
  return { ctx, p };
}

async function girisVeRandevu(p, url, randevular, cerezKapat = true){
  await p.goto(`${KOK}/${url}?auth=1`, { waitUntil:'networkidle' });
  if(cerezKapat) await p.evaluate(() => localStorage.setItem('dm-cookie-consent','accepted'));
  await p.evaluate((r) => {
    localStorage.removeItem('dm_fit_mesaj_v1');
    const S = window.FIT_SHELL && window.FIT_SHELL.state;
    const s = S.read();
    s.randevular = [];
    localStorage.setItem('dm_fit', JSON.stringify(s));
    r.forEach(x => S.randevuAl(x));
  }, randevular);
  await p.goto(`${KOK}/${url}`, { waitUntil:'networkidle' });
  /* Kabuğa yükleyici satırı LEAD tarafından eklenecek; sonda o satırı
     BURADA taklit ediyor. mesajlarim-v1.html betiği kendi <head>inde
     taşıyor, orada ikinci kez eklenmez. */
  if(!url.startsWith('mesajlarim-v1'))
    await p.addScriptTag({ url: `${KOK}/assets/js/fit-mesaj.js` });
  await p.waitForTimeout(450);
}

const kutu = (p, sel) => p.evaluate((s) => {
  const e = document.querySelector(s);
  if(!e) return null;
  if(e.getClientRects().length === 0) return { gorunur:false };
  const r = e.getBoundingClientRect();
  return { gorunur:true, x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height),
           left:r.left, right:r.right, top:r.top, bottom:r.bottom };
}, sel);

/* =====================================================================
   1 · KONUM VE ÇAKIŞMA · 6 · TAŞMA · 7 · DOKUNMA HEDEFİ
   ===================================================================== */
console.log('\n=== 1 · YÜZEN DÜĞME KONUMU / ÇAKIŞMA / TAŞMA ===');
for(const [w, h] of GEN){
  const { ctx, p } = await yeniSayfa(w, h);
  /* çerez şeridi AÇIK bırakılıyor: ilk ziyaretteki gerçek hâli ölçelim */
  await girisVeRandevu(p, SAYFA, RANDEVULAR, false);
  /* .to-top yalnız kaydırınca görünür — üçünü aynı anda ölçmek için kaydır */
  await p.evaluate(() => window.scrollTo(0, 1200));
  await p.waitForTimeout(900);

  const fab = await kutu(p, '#msjFab');
  const fb  = await kutu(p, '.feedback-tab');
  const top = await kutu(p, '.to-top');
  const nav = await kutu(p, '.bottom-nav');
  const ck  = await kutu(p, '.cookie-banner.show');

  const cakisFb  = fb  && fb.gorunur  && kesisiyor(fab, fb);
  const cakisTop = top && top.gorunur && kesisiyor(fab, top);
  const cakisNav = nav && nav.gorunur && kesisiyor(fab, nav);
  const cakisCk  = ck  && ck.gorunur  && kesisiyor(fab, ck);

  const tasma = await p.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));

  /* Hedef yüksekliği: kutunun kendisi VEYA kabuğun görünmez `::after`
     örtüsü (fit-shell.css `.see-all` kalıbı). İkisinin büyüğü sayılır. */
  const HEDEF = `(() => {
    const out = [];
    document.querySelectorAll(SEC).forEach(e => {
      if(e.getClientRects().length === 0) return;
      const r = e.getBoundingClientRect();
      const a = parseFloat(getComputedStyle(e, '::after').height) || 0;
      const h = Math.max(r.height, a);
      if(r.width < 44 || h < 44) out.push((e.id||e.className)+'='+Math.round(r.width)+'×'+Math.round(h));
    });
    return out;
  })()`;
  const kucuk = await p.evaluate(
    `const SEC='#msjFab, #msjKapat, .msj-btn, .msj-kisi';` + HEDEF);

  console.log(`@${w}  #msjFab ${fab && fab.gorunur ? `${fab.w}×${fab.h} @ x${fab.x} y${fab.y} (sağ boşluk ${w-Math.round(fab.right)}, alt boşluk ${h-Math.round(fab.bottom)})` : 'GÖRÜNMÜYOR'}`);
  console.log(`      .feedback-tab ${fb && fb.gorunur ? `${fb.w}×${fb.h} @ x${fb.x} y${fb.y}` : 'yok/gizli'}   çakışma: ${cakisFb ? '🔴 VAR' : '0'}`);
  console.log(`      .to-top       ${top && top.gorunur ? `${top.w}×${top.h} @ x${top.x} y${top.y}` : 'yok/gizli'}   çakışma: ${cakisTop ? '🔴 VAR' : '0'}`);
  console.log(`      .bottom-nav   ${nav && nav.gorunur ? `${nav.w}×${nav.h} @ x${nav.x} y${nav.y}` : 'yok/gizli'}   çakışma: ${cakisNav ? '🔴 VAR' : '0'}`);
  console.log(`      .cookie-banner ${ck && ck.gorunur ? `${ck.w}×${ck.h} @ x${ck.x} y${ck.y}` : 'yok/gizli'}   çakışma: ${cakisCk ? '🔴 VAR (ilk ziyaret, kabuğun geçici şeridi)' : '0'}`);
  console.log(`      yatay taşma ${tasma}px · 44×44 altı hedef: ${kucuk.length ? '🔴 '+kucuk.join(', ') : '0'}`);

  /* ÇEREZ ONAYI SONRASI — düğmenin asıl yaşayacağı hâl */
  await p.evaluate(() => { const b=document.getElementById('cookieAccept'); if(b) b.click(); });
  await p.waitForTimeout(300);
  const fab2 = await kutu(p, '#msjFab');
  const fb2  = await kutu(p, '.feedback-tab');
  const tt2  = await kutu(p, '.to-top');
  const nav2 = await kutu(p, '.bottom-nav');
  console.log(`      — çerez onayından SONRA —`);
  console.log(`      #msjFab ${fab2 && fab2.gorunur ? `${fab2.w}×${fab2.h} @ x${fab2.x} y${fab2.y} (sağ ${w-Math.round(fab2.right)}, alt ${h-Math.round(fab2.bottom)})` : '🔴 GÖRÜNMÜYOR'}`);
  console.log(`      çakışma → feedback-tab ${kesisiyor(fab2,fb2)?'🔴 VAR':'0'} · to-top ${kesisiyor(fab2,tt2)?'🔴 VAR':'0'} · bottom-nav ${kesisiyor(fab2,nav2)?'🔴 VAR':'0'}` +
              (tt2 && tt2.gorunur && fab2 && fab2.gorunur ? ` · to-top ile dikey boşluk ${Math.round(fab2.top - tt2.bottom)}px` : ''));

  await p.click('#msjFab');
  await p.waitForTimeout(450);
  const panel = await kutu(p, '#msjPanel');
  const tasma2 = await p.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  const kucuk2 = await p.evaluate(
    `const SEC='#msjPanel button, #msjPanel a, #msjPanel textarea';` + HEDEF);
  console.log(`      panel açık: ${panel && panel.gorunur ? `${panel.w}×${panel.h} @ x${panel.x}` : '🔴 AÇILMADI'} · taşma ${tasma2}px · 44 altı: ${kucuk2.length ? kucuk2.join(', ') : '0'}`);
  await p.screenshot({ path:`docs/screenshots/mesaj-panel-${w}.png` });
  await ctx.close();
}

/* =====================================================================
   3 · MESAJ GERÇEKTEN KAYDEDİLİYOR MU (üç ölçüm)
   ===================================================================== */
console.log('\n=== 3 · KAYIT: önce → sonra → YENİLEDİKTEN sonra ===');
{
  const { ctx, p } = await yeniSayfa(1440, 1200);
  await girisVeRandevu(p, SAYFA, RANDEVULAR);

  const depoOku = () => p.evaluate(() => {
    const h = localStorage.getItem('dm_fit_mesaj_v1');
    if(!h) return { ham:null, sayi:0 };
    const d = JSON.parse(h);
    const s = d.sohbetler || {};
    const sec = window.FIT_MESAJ.antrenorler()[0];
    const m = sec && s[sec.slug] ? (s[sec.slug].mesajlar || []) : [];
    return { ham:h.length, sayi:Object.keys(s).reduce((t,k)=>t+(s[k].mesajlar||[]).length,0),
             sohbet: sec ? sec.slug : null,
             sonuncu: m.length ? m[m.length-1].metin : null };
  });

  await p.click('#msjFab');
  await p.waitForTimeout(400);
  const once = await depoOku();
  console.log(`  yazmadan önce      : mesaj ${once.sayi} · depo ${once.ham ?? 'YOK'} bayt`);

  await p.fill('#msjPMetin', 'Salı seansını yarım saat erteleyebilir miyiz?');
  await p.click('#msjPanel .msj-btn.gonder');
  await p.waitForTimeout(350);
  const sonra = await depoOku();
  const balon = await p.evaluate(() => document.querySelectorAll('#msjAkis .msj-balon.uye').length);
  console.log(`  yazdıktan sonra    : mesaj ${sonra.sayi} · depo ${sonra.ham} bayt · son="${sonra.sonuncu}" · ekrandaki üye balonu ${balon}`);

  await p.reload({ waitUntil:'networkidle' });
  await p.addScriptTag({ url: `${KOK}/assets/js/fit-mesaj.js` });   /* yükleyici satırı yerine */
  await p.waitForTimeout(450);
  const yenile = await depoOku();
  await p.click('#msjFab');
  await p.waitForTimeout(400);
  const balon2 = await p.evaluate(() => document.querySelectorAll('#msjAkis .msj-balon.uye').length);
  console.log(`  YENİLEDİKTEN sonra : mesaj ${yenile.sayi} · depo ${yenile.ham} bayt · son="${yenile.sonuncu}" · ekrandaki üye balonu ${balon2}`);

  /* sahte antrenör yanıtı var mı? — yazdıktan 3 sn sonra antrenör balonu SAYISI DEĞİŞMEMELİ */
  const antOnce = await p.evaluate(() => document.querySelectorAll('#msjAkis .msj-balon.antrenor').length);
  await p.waitForTimeout(3000);
  const antSonra = await p.evaluate(() => document.querySelectorAll('#msjAkis .msj-balon.antrenor').length);
  console.log(`  sahte yanıt kontrolü: antrenör balonu ${antOnce} → ${antSonra} (3 sn) ${antOnce===antSonra?'✓ simülasyon yok':'🔴 SAHTE YANIT'}`);

  /* 8 · KONTRAST */
  const renkler = await p.evaluate(() => {
    /* Şeffaf zemin ölçüm körlüğüdür: rgba(...,0) okuyup "3.8:1" demek
       yanlış cevaptır. Gerçekte boyayan ilk ataya kadar yukarı çıkılır. */
    const zemin = (e) => {
      let n = e;
      while(n && n !== document.documentElement){
        const bg = getComputedStyle(n).backgroundColor;
        const m = bg.match(/[\d.]+/g);
        if(m && (m.length < 4 || Number(m[3]) > 0)) return bg;
        n = n.parentElement;
      }
      return 'rgb(255,255,255)';
    };
    const al = (sel, alt) => {
      const e = document.querySelector(sel); if(!e) return null;
      return { ad:sel, on:getComputedStyle(e).color, arka:zemin(document.querySelector(alt) || e) };
    };
    return [
      al('#msjAkis .msj-balon.uye p', '#msjAkis .msj-balon.uye'),
      al('#msjAkis .msj-balon.antrenor p', '#msjAkis .msj-balon.antrenor'),
      al('#msjAkis .msj-balon.uye .msj-kunye', '#msjAkis .msj-balon.uye'),
      al('#msjPanel .hr-note p', '#msjPanel .hr-note'),
      al('#msjPanel .msj-ipucu', '#msjPanel .msj-yaz'),
      al('#msjPanel .msj-kisi[aria-pressed="true"]', '#msjPanel .msj-kisi[aria-pressed="true"]'),
      al('#msjPanel .msj-kisi[aria-pressed="false"]', '#msjPanel .msj-kisi[aria-pressed="false"]'),
      al('#msjPanel .msj-bas a', '#msjPanel .msj-bas'),
      al('#msjFab', '#msjFab'),
      al('.msj-fab-rozet', '.msj-fab-rozet')
    ].filter(Boolean);
  });
  console.log('\n=== 8 · KONTRAST (WCAG 1.4.3 · eşik 4.5:1) ===');
  for(const r of renkler){
    const o = oran(r.on, r.arka);
    console.log(`  ${o.toFixed(2)}:1  ${o>=4.5?'✓':'🔴'}  ${r.ad}   ${r.on} / ${r.arka}`);
  }

  /* 5 · OKUNMAMIŞ ROZETİ — temiz depo, panel açılmadan */
  await ctx.close();
}

console.log('\n=== 5 · OKUNMAMIŞ ROZETİ ===');
{
  const { ctx, p } = await yeniSayfa(1440, 1200);
  await girisVeRandevu(p, SAYFA, RANDEVULAR);
  const r1 = await p.evaluate(() => {
    const e = document.querySelector('.msj-fab-rozet');
    return { var:!!e, gorunur:e ? e.getClientRects().length>0 : false, metin:e?e.textContent:'',
             etiket:(document.getElementById('msjFab')||{}).ariaLabel || '' };
  });
  console.log(`  panel açılmadan : rozet ${r1.gorunur ? `GÖRÜNÜR "${r1.metin}"` : '🔴 görünmüyor'} · aria-label="${r1.etiket}"`);
  await p.click('#msjFab');
  await p.waitForTimeout(400);
  const r2 = await p.evaluate(() => {
    const e = document.querySelector('.msj-fab-rozet');
    return { gorunur:e ? e.getClientRects().length>0 : false, metin:e?e.textContent:'' };
  });
  console.log(`  panel açıldıktan: rozet ${r2.gorunur ? `🔴 hâlâ görünür "${r2.metin}"` : 'gizlendi ✓'}`);
  await ctx.close();
}

/* =====================================================================
   4 · RANDEVUSUZ KULLANICI
   ===================================================================== */
console.log('\n=== 4 · RANDEVUSUZ KULLANICI ===');
for(const [w, h] of GEN){
  const { ctx, p } = await yeniSayfa(w, h);
  await girisVeRandevu(p, SAYFA, []);
  const d = await p.evaluate(() => {
    const e = document.getElementById('msjFab');
    if(!e) return null;
    const r = e.getBoundingClientRect();
    return { etiket:e.tagName, metin:e.textContent.trim(), href:e.getAttribute('href')||'',
             gorunur:e.getClientRects().length>0,
             w:Math.round(r.width), h:Math.round(r.height),
             sag:Math.round(innerWidth-r.right), alt:Math.round(innerHeight-r.bottom) };
  });
  const BEKLENEN = 'Henüz antrenörün yok — antrenörlere göz at';
  console.log(`@${w}  <${d.etiket}> "${d.metin}" ${d.metin === BEKLENEN ? '✓ metin birebir' : '🔴 METİN FARKLI'} → ${d.href} ${d.href === 'antrenorler-v1.html' ? '✓' : '🔴'} · ${d.w}×${d.h} · sağ ${d.sag} alt ${d.alt} · görünür ${d.gorunur}`);
  const tas = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  console.log(`      yatay taşma ${tas}px`);
  if(w===1440) await p.screenshot({ path:'docs/screenshots/mesaj-randevusuz.png' });
  await ctx.close();
}

/* =====================================================================
   10 · TAM EKRAN SAYFA
   ===================================================================== */
console.log('\n=== 10 · mesajlarim-v1.html ===');
for(const [w, h] of GEN){
  const { ctx, p } = await yeniSayfa(w, h);
  await girisVeRandevu(p, 'mesajlarim-v1.html', RANDEVULAR);

  const o = await p.evaluate(() => {
    const g = document.querySelector('.msj-sayfa');
    const gr = g ? g.getBoundingClientRect() : null;
    return {
      h1: (document.querySelector('.fp-kimlik-id h1')||{}).textContent || '',
      serit: document.querySelectorAll('.modul-govde .hr-note').length,
      tabbar: document.querySelectorAll('.pf-tabbar').length,
      kolon: gr ? Math.round(gr.width) : 0,
      merkez: gr ? Math.round(gr.left + gr.width/2) : 0,
      sayfaMerkez: Math.round(innerWidth/2),
      liste: document.querySelectorAll('.msj-liste-oge').length,
      balon: document.querySelectorAll('#msjAkisS .msj-balon').length,
      fab: !!document.getElementById('msjFab'),
      tasma: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
    };
  });
  console.log(`@${w}  h1="${o.h1}" · dürüst şerit ${o.serit} · sekme şeridi ${o.tabbar} · yüzen düğme ${o.fab?'🔴 basıldı':'0 ✓'}`);
  const tepe = await p.evaluate(() => {
    const m = document.querySelector('#msjTepe .msj-mono');
    const h = document.querySelector('#msjTepe h3');
    const b = document.querySelector('#msjTepe .fp-badge');
    if(!m || !h) return null;
    const r = m.getBoundingClientRect();
    return { mono:m.textContent, boyut:Math.round(r.width)+'×'+Math.round(r.height),
             yaricap:getComputedStyle(m).borderRadius, ad:h.textContent,
             rozet:b?b.textContent:'(yok)' };
  });
  console.log(`      sayfa başlığı: avatar ${tepe?`"${tepe.mono}" ${tepe.boyut} r=${tepe.yaricap}`:'🔴 YOK'} · ad="${tepe?tepe.ad:''}" · rozet "${tepe?tepe.rozet:''}"`);
  console.log(`      okuma kolonu ${o.kolon}px · merkez ${o.merkez} (sayfa merkezi ${o.sayfaMerkez}) · liste ${o.liste} · balon ${o.balon} · taşma ${o.tasma}px`);

  if(w === 1440){
    /* arama */
    await p.fill('#msjAra', 'sakat');
    await p.waitForTimeout(250);
    const a = await p.evaluate(() => ({
      gorunur: !document.getElementById('msjSonuc').hidden,
      adet: document.querySelectorAll('#msjSonuc [data-git]').length,
      vurgu: document.querySelectorAll('#msjSonuc .msj-vurgu').length
    }));
    console.log(`      arama "sakat": panel ${a.gorunur?'açık':'🔴 kapalı'} · sonuç ${a.adet} · vurgu ${a.vurgu}`);
    await p.fill('#msjAra', '');
    await p.waitForTimeout(200);

    /* dosya eki — gerçek dosya, gerçek künye */
    await p.setInputFiles('#msjSDosya', { name:'olcum-agustos.pdf', mimeType:'application/pdf', buffer:Buffer.alloc(184320) });
    await p.waitForTimeout(200);
    const ek1 = await p.evaluate(() => {
      const e = document.getElementById('msjSEk');
      return { gorunur:!e.hidden, ad:e.querySelector('b').textContent, boyut:e.querySelector('small').textContent };
    });
    await p.fill('#msjSMetin', 'Ağustos ölçümlerini ekledim.');
    await p.click('.msj-sayfa .msj-btn.gonder');
    await p.waitForTimeout(300);
    const ek2 = await p.evaluate(() => {
      const d = JSON.parse(localStorage.getItem('dm_fit_mesaj_v1'));
      /* Seçili sohbet EN YENİ randevudur (state.randevular unshift'li);
         "ilk anahtar" varsaymak sonda körlüğü olurdu. */
      const k = window.FIT_MESAJ.antrenorler()[0].slug;
      const m = (d.sohbetler[k].mesajlar || []).slice(-1)[0] || null;
      return { sohbet:k, ek:m && m.ek, metin:m && m.metin,
               ekranEk:document.querySelectorAll('#msjAkisS .msj-ek').length };
    });
    console.log(`      dosya eki şeridi: ${ek1.gorunur?'açıldı':'🔴 açılmadı'} "${ek1.ad}" ${ek1.boyut}`);
    console.log(`      depoya yazılan (${ek2.sohbet}): "${ek2.metin}" ek=${JSON.stringify(ek2.ek)} · ekrandaki ek şeridi ${ek2.ekranEk}`);
    await p.screenshot({ path:'docs/screenshots/mesajlarim-1440.png', fullPage:true });
  }
  await ctx.close();
}

/* =====================================================================
   11 · GİZLİ KİP (depolama kapalı) — sessizce "gitti" DEMEMELİ
   ===================================================================== */
console.log('\n=== 11 · DEPOLAMA KAPALI ===');
{
  const { ctx, p } = await yeniSayfa(1440, 1200);
  await girisVeRandevu(p, SAYFA, RANDEVULAR);
  await p.click('#msjFab');
  await p.waitForTimeout(350);
  await p.evaluate(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable:true,
      get(){ return { getItem(){ return null; }, setItem(){ throw new Error('kota'); },
                      removeItem(){ throw new Error('kota'); } }; }
    });
  });
  await p.fill('#msjPMetin', 'gizli kip denemesi');
  await p.click('#msjPanel .msj-btn.gonder');
  await p.waitForTimeout(250);
  const u = await p.evaluate(() => {
    const e = document.getElementById('msjPUyari');
    return { gorunur:e && !e.hidden, metin:e?e.textContent.trim():'',
             balon:document.querySelectorAll('#msjAkis .msj-balon.uye').length,
             kutu:document.getElementById('msjPMetin').value };
  });
  console.log(`  uyarı ${u.gorunur?'GÖRÜNÜR':'🔴 yok'}: "${u.metin}"`);
  console.log(`  akışa sahte balon düştü mü: üye balonu ${u.balon} · yazı kutusu "${u.kutu}" (metin korunmalı)`);
  await ctx.close();
}

/* =====================================================================
   14 · BAŞLIK = KİMLİK  (WhatsApp deseni · Beyar isteği)
   ---------------------------------------------------------------------
   Panel başlığında avatar (monogram) var mı · ad randevudan gelen isimle
   BİREBİR mi · seçim değişince başlık değişiyor mu · randevusuz hâlde ne
   diyor · üç genişlikte taşma / hedef / kontrast.
   ===================================================================== */
console.log('\n=== 14 · PANEL BAŞLIĞI = KONUŞULAN KİŞİ ===');
for(const [w, h] of GEN){
  const { ctx, p } = await yeniSayfa(w, h);
  await girisVeRandevu(p, SAYFA, RANDEVULAR);
  await p.click('#msjFab');
  await p.waitForTimeout(450);

  const oku = () => p.evaluate(() => {
    const av = document.getElementById('msjBasAva');
    const ad = document.getElementById('msjBasAd');
    const al = document.getElementById('msjBasAlt');
    const r  = av.getBoundingClientRect();
    const c  = getComputedStyle(av);
    return { ava:av.getClientRects().length>0, mono:av.textContent,
             boyut:Math.round(r.width)+'×'+Math.round(r.height), yaricap:c.borderRadius,
             ad:ad.textContent, alt:al.textContent,
             adTasti: ad.scrollWidth > ad.clientWidth + 1,
             altTasti: al.scrollWidth > al.clientWidth + 1,
             panelEtiket: document.getElementById('msjPanel').getAttribute('aria-label') };
  });

  const ilk = await oku();
  /* randevular unshift'li → liste[0] = Burak Demir (en yeni).
     ⚠ DURUM DEPODAN OKUNUR, sondanın verdiği değerden DEĞİL: kabuğun
     `randevuAl`ı gelen `durum` alanını yok sayıp her randevuyu
     'onay-bekliyor' yazıyor (fit-shell.js:2742). Sondanın kendi girdisine
     inanması sonda körlüğü olurdu — ekran doğruyu basıyor. */
  const kayit = await p.evaluate(() => window.FIT_MESAJ.antrenorler().map(
    a => ({ slug:a.slug, ad:a.antrenor, hizmet:a.hizmet, durum:a.durum,
            etiket:window.FIT_MESAJ.durumEtiket(a.durum) })));
  const beklenen = RANDEVULAR[1].antrenor;
  const bekAlt = kayit[0].etiket + ' · ' + kayit[0].hizmet;
  console.log(`      depodaki durum: ${kayit.map(k=>k.slug+'='+k.durum).join(' · ')}`);
  console.log(`      alt satırı depoyla uyumlu mu: ${ilk.alt.startsWith(bekAlt) ? '✓ ("'+bekAlt+'" ile başlıyor)' : '🔴 UYUMSUZ'}`);
  console.log(`@${w}  avatar ${ilk.ava?'VAR':'🔴 YOK'} "${ilk.mono}" ${ilk.boyut} r=${ilk.yaricap}`);
  console.log(`      ad="${ilk.ad}" ${ilk.ad===beklenen?'✓ randevudaki isimle birebir':'🔴 FARKLI (beklenen: '+beklenen+')'}`);
  console.log(`      alt="${ilk.alt}" · panel aria-label="${ilk.panelEtiket}"`);
  console.log(`      kolon taşması: ad ${ilk.adTasti?'kırpıldı(ellipsis)':'tam'} · alt ${ilk.altTasti?'kırpıldı(ellipsis)':'tam'}`);

  /* seçim değişince başlık değişiyor mu */
  await p.evaluate(() => document.querySelector('.msj-kisi[data-slug="selin-aksoy"]').click());
  await p.waitForTimeout(250);
  const ikinci = await oku();
  const k2 = kayit.filter(k => k.slug === 'selin-aksoy')[0];
  const bekAlt2 = k2.etiket + ' · ' + k2.hizmet;
  console.log(`      seçim değişti → ad="${ikinci.ad}" ${ikinci.ad===RANDEVULAR[0].antrenor?'✓ başlık değişti':'🔴 DEĞİŞMEDİ'} · mono "${ikinci.mono}" · aria-label="${ikinci.panelEtiket}"`);
  console.log(`      yeni alt="${ikinci.alt}" ${ikinci.alt.startsWith(bekAlt2)?'✓ depoyla uyumlu':'🔴 UYUMSUZ (beklenen başlangıç: '+bekAlt2+')'}`);

  const tas = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  const kucuk = await p.evaluate(
    `const SEC='#msjTumu, #msjKapat';` + `(() => {
      const out = [];
      document.querySelectorAll(SEC).forEach(e => {
        const r = e.getBoundingClientRect();
        if(r.width < 44 || r.height < 44) out.push(e.id+'='+Math.round(r.width)+'×'+Math.round(r.height));
      });
      return out; })()`);
  console.log(`      taşma ${tas}px · başlık düğmeleri 44×44 altı: ${kucuk.length?'🔴 '+kucuk.join(', '):'0'}`);

  if(w === 1440){
    const renk = await p.evaluate(() => {
      const z = (e) => { let n=e; while(n && n!==document.documentElement){ const bg=getComputedStyle(n).backgroundColor;
        const m=bg.match(/[\d.]+/g); if(m && (m.length<4 || Number(m[3])>0)) return bg; n=n.parentElement; } return 'rgb(255,255,255)'; };
      const al = (sel) => { const e=document.querySelector(sel); return {ad:sel, on:getComputedStyle(e).color, arka:z(e)}; };
      return [al('#msjBasAd'), al('#msjBasAlt'), al('#msjBasAva'), al('#msjTumu')];
    });
    console.log('      kontrast:');
    for(const r of renk) console.log(`        ${oran(r.on,r.arka).toFixed(2)}:1  ${oran(r.on,r.arka)>=4.5?'✓':'🔴'}  ${r.ad}`);
    await p.screenshot({ path:'docs/screenshots/mesaj-baslik-1440.png' });
  }
  await ctx.close();
}
/* randevusuz: panel açılmıyor, başlık kişi taklidi yapmıyor */
{
  const { ctx, p } = await yeniSayfa(1440, 1200);
  await girisVeRandevu(p, SAYFA, []);
  const d = await p.evaluate(() => ({
    fab: (document.getElementById('msjFab')||{}).textContent,
    ad:  (document.getElementById('msjBasAd')||{}).textContent,
    alt: (document.getElementById('msjBasAlt')||{}).textContent,
    avaGorunur: (document.getElementById('msjBasAva')||{}).hidden === false,
    panelAcik: document.getElementById('msjPanel').classList.contains('acik') }));
  console.log(`  randevusuz → düğme "${d.fab}" · başlık ad="${d.ad}" alt="${d.alt}" · avatar görünür ${d.avaGorunur} · panel açık ${d.panelAcik}`);
  await ctx.close();
}

/* =====================================================================
   13 · API'DEN GÖNDERİM — AÇIK AKIŞ YENİLEMESİZ BOYANIYOR MU
   ---------------------------------------------------------------------
   `FIT_MESAJ.gonder(...)` form dışından çağrılınca (konsol, başka modül,
   ileride antrenör paneli) açık akış eski kalıyordu; yalnız liste
   önizlemesi değişiyordu. Kusur kapatıldı, sonda kalıcı bekçi.
   ===================================================================== */
console.log('\n=== 13 · API GÖNDERİMİ · YENİLEMESİZ BOYAMA ===');
{ /* a · tam ekran sayfa */
  const { ctx, p } = await yeniSayfa(1440, 1200);
  await girisVeRandevu(p, 'mesajlarim-v1.html', [RANDEVULAR[0]]);
  const once = await p.evaluate(() => ({
    akis: /Ölçüm mesajı/.test(document.getElementById('msjAkisS').innerText),
    govde: /Ölçüm mesajı/.test(document.body.innerText) }));
  await p.evaluate(() => window.FIT_MESAJ.gonder('selin-aksoy', 'Ölçüm mesajı'));
  await p.waitForTimeout(250);
  const sonra = await p.evaluate(() => ({
    akis: /Ölçüm mesajı/.test(document.getElementById('msjAkisS').innerText),
    govde: /Ölçüm mesajı/.test(document.body.innerText),
    balon: document.querySelectorAll('#msjAkisS .msj-balon').length,
    secili: (document.querySelector('.msj-liste-oge[aria-pressed="true"]')||{}).dataset.slug }));
  await p.reload({ waitUntil:'networkidle' });
  await p.waitForTimeout(600);
  const yenile = await p.evaluate(() => ({
    akis: /Ölçüm mesajı/.test(document.getElementById('msjAkisS').innerText),
    govde: /Ölçüm mesajı/.test(document.body.innerText),
    depo: JSON.parse(localStorage.getItem('dm_fit_mesaj_v1')).sohbetler['selin-aksoy'].mesajlar.length }));
  console.log(`  sayfa · gönderimden ÖNCE   : akış ${once.akis} · body ${once.govde}`);
  console.log(`  sayfa · YENİLEMEDEN sonra  : akış ${sonra.akis} · body ${sonra.govde} · balon ${sonra.balon} · seçili ${sonra.secili}`);
  console.log(`  sayfa · YENİLEDİKTEN sonra : akış ${yenile.akis} · body ${yenile.govde} · depoda ${yenile.depo} mesaj`);
  await ctx.close();
}
{ /* b · panel */
  const { ctx, p } = await yeniSayfa(1440, 1200);
  await girisVeRandevu(p, SAYFA, [RANDEVULAR[0]]);
  await p.click('#msjFab'); await p.waitForTimeout(400);
  await p.evaluate(() => window.FIT_MESAJ.gonder('selin-aksoy', 'Panel ölçüm mesajı'));
  await p.waitForTimeout(250);
  const r = await p.evaluate(() => ({
    akis: /Panel ölçüm mesajı/.test(document.getElementById('msjAkis').innerText),
    balon: document.querySelectorAll('#msjAkis .msj-balon.uye').length }));
  console.log(`  panel · YENİLEMEDEN sonra  : akış ${r.akis} · üye balonu ${r.balon}`);
  await ctx.close();
}

/* =====================================================================
   12 · MOBİL (≤640) — CSS başlığındaki iddianın ölçümü
   ---------------------------------------------------------------------
   Bu genişlikte `.feedback-tab` gizli, `.bottom-nav` görünür.
   ===================================================================== */
console.log('\n=== 12 · MOBİL @390 ===');
{
  const { ctx, p } = await yeniSayfa(390, 844);
  await girisVeRandevu(p, SAYFA, RANDEVULAR);
  await p.evaluate(() => window.scrollTo(0, 1200));
  await p.waitForTimeout(600);
  const fab = await kutu(p, '#msjFab');
  const fb  = await kutu(p, '.feedback-tab');
  const tt  = await kutu(p, '.to-top');
  const nav = await kutu(p, '.bottom-nav');
  console.log(`  #msjFab ${fab && fab.gorunur ? `${fab.w}×${fab.h} @ x${fab.x} y${fab.y} (sağ ${390-Math.round(fab.right)}, alt ${844-Math.round(fab.bottom)})` : '🔴 GÖRÜNMÜYOR'}`);
  console.log(`  .feedback-tab ${fb&&fb.gorunur?'🔴 görünür':'gizli ✓'} · .to-top ${tt&&tt.gorunur?`${tt.w}×${tt.h} y${tt.y}`:'gizli'} · .bottom-nav ${nav&&nav.gorunur?`${nav.w}×${nav.h} y${nav.y}`:'gizli'}`);
  console.log(`  çakışma → to-top ${kesisiyor(fab,tt)?'🔴 VAR':'0'} · bottom-nav ${kesisiyor(fab,nav)?'🔴 VAR':'0'}` +
    (fab&&fab.gorunur&&tt&&tt.gorunur?` · to-top boşluk ${Math.round(fab.top-tt.bottom)}px`:'') +
    (fab&&fab.gorunur&&nav&&nav.gorunur?` · bottom-nav boşluk ${Math.round(nav.top-fab.bottom)}px`:''));
  await p.click('#msjFab');
  await p.waitForTimeout(450);
  const panel = await kutu(p, '#msjPanel');
  const tas = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  console.log(`  panel ${panel&&panel.gorunur?`${panel.w}×${panel.h} @ x${panel.x}`:'🔴 açılmadı'} · yatay taşma ${tas}px`);
  await p.screenshot({ path:'docs/screenshots/mesaj-panel-390.png' });
  await ctx.close();
}

/* randevusuz düğme mobilde taşıyor mu */
{
  const { ctx, p } = await yeniSayfa(390, 844);
  await girisVeRandevu(p, SAYFA, []);
  const d = await p.evaluate(() => {
    const e = document.getElementById('msjFab'); const r = e.getBoundingClientRect();
    return { w:Math.round(r.width), h:Math.round(r.height), sol:Math.round(r.left), sag:Math.round(390-r.right) };
  });
  const tas = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  console.log(`  randevusuz pill @390: ${d.w}×${d.h} · sol ${d.sol} sağ ${d.sag} · yatay taşma ${tas}px`);
  await ctx.close();
}

console.log('\n=== 9 · KONSOL ===');
console.log(hatalar.length ? hatalar.map(h => '  🔴 ' + h).join('\n') : '  0 hata');

await tarayici.close();
