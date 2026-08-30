/* =====================================================================
   HAREKET KATALOĞU — KOPYA İLE KAYNAK EŞİT Mİ?
   ---------------------------------------------------------------------
   NEDEN BU SONDA VAR

   Yönetim panelinin ANA İÇERİK ekranları `assets/js/fit-admin-veri.js`ten
   okuyor; o dosya ise sayfaların içindeki tabloların MEKANİK KOPYASI
   (üreteci: `tools/admin-veri-uret.mjs`). Kararın gerekçesi üretecin
   başlığında. Kopyanın tehlikesi kopya olması değil, SESSİZCE AYRIŞMASI:
   `egzersiz-detay-v1.html` içindeki bir hareket değişir, admin ekranı eski
   değeri göstermeye devam eder ve kimse fark etmez.

   Bu sonda ayrışmayı sessiz olmaktan çıkarır. Üç kaynağı TARAYICIDA açıp
   karşılaştırır — dosyayı okumaz, çalışan sayfayı okur:

     1. egzersiz-detay-v1.html    → window.ED_VERI          (anlatım · alternatif)
     2. egzersiz-kutuphane-v1.html→ .ex-card nitelikleri     (taksonomi kodu)
     3. admin-hareketler-v1.html  → FIT_ADMIN_VERI.HAREKET   (panelin kopyası)

   AYRIŞMA VARSA ÇIKIŞ KODU 1 — düzeltmesi tek satır:
     node tools/admin-veri-uret.mjs

   KOŞ: PW_HOME=~/.pw node docs/qa/hareket-katalog-esitlik.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const B = 'http://127.0.0.1:8788/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const pg = await ctx.newPage();

/* ---- 1 · kaynak: detay sayfasının VERI tablosu ---- */
await pg.goto(B + 'egzersiz-detay-v1.html', { waitUntil: 'networkidle' });
const KAYNAK = await pg.evaluate(() => {
  const V = window.ED_VERI || {};
  const de = (s) => String(s == null ? '' : s).replace(/&amp;/g, '&');
  const o = {};
  Object.keys(V).forEach((k) => {
    o[k] = { ad: de(V[k].ad), bolge: de(V[k].bolge), ekipman: de(V[k].ekipman),
             seviye: de(V[k].seviye), sure: de(V[k].sure), kategori: de(V[k].kategori),
             alternatif: V[k].benzer.join(',') };
  });
  return o;
});

/* ---- 2 · kaynak: kütüphane kartlarının taksonomi kodları ---- */
await pg.goto(B + 'egzersiz-kutuphane-v1.html', { waitUntil: 'networkidle' });
const KART = await pg.evaluate(() => {
  const o = {};
  document.querySelectorAll('.ex-card').forEach((c) => {
    const btn = c.querySelector('[data-slug]');
    if (!btn) return;
    o[btn.getAttribute('data-slug')] = {
      ad: c.getAttribute('data-name'),
      kas: c.getAttribute('data-kas'),
      ekipmanKod: c.getAttribute('data-ekipman'),
      lv: Number(c.getAttribute('data-seviye'))
    };
  });
  return o;
});

/* ---- 3 · kopya: panelin okuduğu tablo ---- */
await pg.goto(B + 'admin-hareketler-v1.html', { waitUntil: 'networkidle' });
const KOPYA = await pg.evaluate(() => {
  const V = window.FIT_ADMIN_VERI;
  if (!V) return null;
  const o = {};
  V.HAREKET.forEach((h) => {
    o[h.slug] = { ad: h.ad, bolge: h.bolge, ekipman: h.ekipman, seviye: h.seviye,
                  sure: h.sure, kategori: h.kategori, alternatif: h.alternatif.join(','),
                  kas: h.kas, ekipmanKod: h.ekipmanKod, lv: h.lv };
  });
  return { tarih: V.OLCUM_TARIHI, kayit: o };
});

await b.close();

if (!KOPYA) {
  console.error('🔴 FIT_ADMIN_VERI yüklenmedi — admin-hareketler-v1.html sondayı besleyemiyor.');
  process.exit(2);
}

/* ---- karşılaştırma ---- */
const kaynakSlug = Object.keys(KAYNAK).sort();
const kopyaSlug = Object.keys(KOPYA.kayit).sort();
const eksik = kaynakSlug.filter((s) => kopyaSlug.indexOf(s) < 0);
const fazla = kopyaSlug.filter((s) => kaynakSlug.indexOf(s) < 0);
const fark = [];

kaynakSlug.forEach((s) => {
  const a = KAYNAK[s], c = KOPYA.kayit[s], k = KART[s];
  if (!c) return;
  ['ad', 'bolge', 'ekipman', 'seviye', 'sure', 'kategori', 'alternatif'].forEach((alan) => {
    if (a[alan] !== c[alan]) fark.push(s + '.' + alan + ': detay «' + a[alan] + '» ≠ panel «' + c[alan] + '»');
  });
  if (!k) { fark.push(s + ': kütüphanede kart yok'); return; }
  ['kas', 'ekipmanKod', 'lv'].forEach((alan) => {
    if (k[alan] !== c[alan]) fark.push(s + '.' + alan + ': kart «' + k[alan] + '» ≠ panel «' + c[alan] + '»');
  });
  /* K43 kuralı: ad iki kaynakta birebir aynı olmalı. */
  if (k.ad !== a.ad) fark.push(s + '.ad: kart «' + k.ad + '» ≠ detay «' + a.ad + '»');
});

console.log('detay VERI kaydı     : ' + kaynakSlug.length);
console.log('kütüphane kartı      : ' + Object.keys(KART).length);
console.log('panel kopyası        : ' + kopyaSlug.length + '   (ölçüm ' + KOPYA.tarih + ')');
console.log('kopyada eksik slug   : ' + eksik.length + (eksik.length ? ' → ' + eksik.join(', ') : ''));
console.log('kopyada fazla slug   : ' + fazla.length + (fazla.length ? ' → ' + fazla.join(', ') : ''));
console.log('alan farkı           : ' + fark.length);
fark.slice(0, 20).forEach((f) => console.log('   🔴 ' + f));

const kirik = eksik.length + fazla.length + fark.length;
console.log('\n' + (kirik
  ? '🔴 AYRIŞMA — düzeltmek için: node tools/admin-veri-uret.mjs'
  : 'EŞİT — panelin kopyası kaynakla birebir aynı.'));
process.exit(kirik ? 1 : 0);
