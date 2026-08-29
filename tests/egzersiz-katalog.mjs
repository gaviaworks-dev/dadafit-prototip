/* =====================================================================
   DADAFIT — EGZERSİZ KATALOĞU SINAMASI  (8. oturum · katalog 12 → 25)
   ---------------------------------------------------------------------
   Bu süitin var oluş nedeni tek bir cümle:

       "Sınama HTTP değil HEDEF kontrol etsin."

   7. oturumda `egzersiz-detay-v1.html`in VERI tablosunda 12 slugın yalnız
   8i vardı. `bant-cekme` · `bant-yana-acma` · `dambil-biceps` ·
   `dambil-omuz-press` sessizce `goblet-squat`a düşüyordu. Sayfa HTTP 200
   döndüğü için o günün sınamaları yeşil kaldı; kullanıcı "Bant Çekme"
   kartına tıklayıp "Goblet Squat" detayına düştü — ölçüt geçiyor, deneyim
   geçmiyordu. Buradaki 2. madde bunun kalıcı nöbetçisidir: 25 slugın her
   biri açılır ve **h1 metni beklenen hareketle karşılaştırılır**.

   Neyi kanıtlar (9 kabul ölçütü, tek tek):
      1. Kütüphanede tam 25 kart; sluglar kanonik listeyle birebir
      2. HEDEF KONTROLÜ — 25 slugın her birinde detay h1 = kütüphane
         data-name (eksik/yanlış hedef 0)
      3. K43 nöbeti — detay VERI.ad = kütüphane data-name, 25/25
      4. data-ekipman / data-seviye / data-kas kanonik tabloyla birebir
         (+ detay VERI.seviye kartın seviye rozetiyle tutarlı)
      5. Ekipmansız havuzda ≥3 çekiş hareketi (ters-sinav · superman ·
         yuzucu) — "ekipmansız planda sırt çalışmıyor" bulgusunun nöbetçisi
      6. Filtre motoru — her data-ekipman ve data-kas değeri süzüldüğünde
         sayaç = veri sayısı; görünen kart R11/M6'dan beri ilk sayfayla (≤12) sınırlı
      7. Bilinmeyen slug → HTTP 200 + görünür (anlamlı) düşüş, 404 yok
      8. Konsol hatası 0 · yatay taşma 0 — @1440 ve @390, iki sayfa
      9. Banner aileleri — kütüphane LİSTE 544/607/587 ·
         detay DETAY 560/617/726

   KANONİK LİSTE BURADA GÖMÜLÜDÜR. Sayfalardan okunmaz; ikisini de bu
   tabloya karşı ölçer. Katalog değişecekse önce bu tablo değişir.

   Çalıştırma:
     export PW_HOME=~/.pw
     python3 -m http.server 8841 &
     node tests/egzersiz-katalog.mjs http://localhost:8841
   ===================================================================== */
import { chromium } from './_pw.mjs';

/* =====================================================================
 ⚠ R15'TE ATLANDI — Beyar kararı, 2026-08-29:
   "Kırmızı testleri devre dışı bırak — silme, sadece atlanacak duruma
    getir. Bir daha test güncellemesiyle uğraşma. Bir şey kırılırsa
    tarayıcıda ölç ve kanıtla, yeterli."
 ---------------------------------------------------------------------
 İDDİALAR SİLİNMEDİ, dosya olduğu gibi duruyor — yalnız koşmuyor.
 Kırmızı olma sebebi (ölçüldü, 2026-08-29):
   R15'te sayfa yapısı değişti (dokuz sayfa modül paneline taşındı, üçü destek modülüne indi); iddia eski yapıyı bekliyor
 Yeniden açmak için:  FIT_TESTI_ZORLA=1 node tests/egzersiz-katalog.mjs
 ===================================================================== */
if (!process.env.FIT_TESTI_ZORLA) {
  console.log('ATLANDI (R15) — R15\'te sayfa yapısı değişti (dokuz sayfa modül paneline taşındı, üçü d');
  process.exit(0);
}


const BASE     = process.argv[2] || 'http://localhost:8841';
const KUTUPHANE = 'egzersiz-kutuphane-v1.html';
const DETAY     = 'egzersiz-detay-v1.html';

/* ---------- KANONİK KATALOG — slug · ad · kas · ekipman · seviye ---------- */
const KANONIK = [
  ['goblet-squat','Goblet Squat','bacak','dambil',2],
  ['hava-squat','Hava Squat (Bodyweight Squat)','bacak','ekipmansiz',1],
  ['plank','Plank (Şınav Duruşu)','karin','ekipmansiz',2],
  ['burpee','Burpee','tumvucut','ekipmansiz',3],
  ['dambil-kurek','Dambıl Kürek Çekme','sirt','dambil',2],
  ['dag-tirmanisi','Dağ Tırmanışı (Mountain Climber)','karin','ekipmansiz',2],
  ['barfiks','Barfiks (Pull-up)','sirt','barfiksbari',3],
  ['sinav','Şınav (Push-up)','gogus','ekipmansiz',2],
  ['hamle','Hamle (Lunge)','bacak','ekipmansiz',1],
  ['dambil-gogus-press','Dambıl Göğüs Press','gogus','dambil',2],
  ['dambil-omuz-press','Dambıl Omuz Press','omuz','dambil',2],
  ['yan-plank','Yan Plank','karin','ekipmansiz',2],
  ['sehpa-dips','Sehpa Dips (Bench Dips)','triceps','ekipmansiz',2],
  ['dambil-biceps','Dambıl Biceps Curl','biceps','dambil',1],
  ['dead-bug','Dead Bug (Ölü Böcek)','karin','ekipmansiz',1],
  ['bulgar-split-squat','Bulgar Split Squat','bacak','ekipmansiz',3],
  ['kettlebell-swing','Kettlebell Swing','tumvucut','kettlebell',3],
  ['dambil-romanya','Dambıl Romanya Deadlift','bacak','dambil',2],
  ['ters-sinav','Ters Şınav (Inverted Row)','sirt','ekipmansiz',2],
  ['bant-cekme','Bant Çekme (Band Row)','sirt','direncbandi',1],
  ['superman','Superman (Yüzüstü Uzanma)','sirt','ekipmansiz',1],
  ['kopru','Köprü (Glute Bridge)','kalca','ekipmansiz',2],
  ['tek-bacak-kopru','Tek Bacak Köprü','kalca','ekipmansiz',2],
  ['bant-yana-acma','Bant Yana Açma','omuz','direncbandi',2],
  ['yuzucu','Yüzücü (Y-T-W Kaldırış)','sirt','ekipmansiz',1]
].map(([slug,ad,kas,ekipman,seviye]) => ({ slug, ad, kas, ekipman, seviye }));

const K = new Map(KANONIK.map(x => [x.slug, x]));
const SEVIYE_AD = { 1:'Başlangıç', 2:'Orta', 3:'İleri' };

/* Ekipmansız havuzun çekiş hareketleri — 7. oturumda kütüphanedeki dört
   çekiş hareketinin dördü de dambıl/bant istiyordu, ekipmansız planda sırt
   hiç çalışmıyordu. Bu üçü o boşluğu kapatıyor; nöbeti burada. */
const EKIPMANSIZ_CEKIS = ['ters-sinav','superman','yuzucu'];

/* R15 banner aile ölçüleri */
const BANNER_LISTE = { 1440:544, 1024:607, 390:587 };
const BANNER_DETAY = { 1440:560, 1024:617, 390:726 };

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

const browser = await chromium.launch();
const yeniCtx = async (width) => {
  const ctx = await browser.newContext({ viewport:{ width, height: width < 600 ? 844 : 900 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  return ctx;
};

/* =====================================================================
   1 · KÜTÜPHANE — tam 25 kart, sluglar kanonik listeyle birebir
   ===================================================================== */
console.log('\n=== 1 · kütüphane kart kadrosu ===');
let kartlar = [];
{
  const ctx = await yeniCtx(1440); const page = await ctx.newPage();
  const r = await page.goto(`${BASE}/${KUTUPHANE}`, { waitUntil:'domcontentloaded', timeout:30000 })
                      .catch(() => null);
  if (!r || r.status() !== 200) rec('kütüphane açılmadı', `HTTP ${r ? r.status() : 'yok'}`);
  await page.waitForTimeout(500);

  kartlar = await page.evaluate(() => [...document.querySelectorAll('#libGrid .ex-card')].map(a => ({
    slug: (a.getAttribute('href') || '').split('slug=')[1] || '',
    ad:   a.getAttribute('data-name'),
    h3:   a.querySelector('h3') ? a.querySelector('h3').textContent.trim() : null,
    kas:  a.getAttribute('data-kas'),
    ekipman: a.getAttribute('data-ekipman'),
    seviye:  a.getAttribute('data-seviye'),
    pop:     a.getAttribute('data-pop')
  })));

  if (kartlar.length === 25) ok(`kütüphanede tam ${kartlar.length} kart`);
  else rec('kart sayısı', `${kartlar.length} kart — 25 bekleniyordu`);

  const varOlan = new Set(kartlar.map(c => c.slug));
  const eksik = KANONIK.filter(x => !varOlan.has(x.slug)).map(x => x.slug);
  const fazla = [...varOlan].filter(s => !K.has(s));
  if (!eksik.length && !fazla.length) ok('25 slug kanonik listeyle birebir (eksik 0 · fazla 0)');
  else rec('slug kadrosu', `eksik: ${eksik.join(', ') || '—'} · fazla: ${fazla.join(', ') || '—'}`);

  const tekrar = kartlar.map(c => c.slug).filter((s,i,a) => a.indexOf(s) !== i);
  if (!tekrar.length) ok('yinelenen slug 0');
  else rec('yinelenen slug', tekrar.join(', '));

  const popTekrar = kartlar.map(c => c.pop).filter((p,i,a) => a.indexOf(p) !== i);
  if (!popTekrar.length) ok(`data-pop değerleri benzersiz (${kartlar.length}/${kartlar.length})`);
  else rec('data-pop yinelemesi', popTekrar.join(', '));

  const h3Fark = kartlar.filter(c => c.h3 !== c.ad).map(c => `${c.slug}: h3 "${c.h3}" ≠ data-name "${c.ad}"`);
  if (!h3Fark.length) ok(`kart başlığı (h3) = data-name, ${kartlar.length}/${kartlar.length}`);
  else rec('kart h3 ↔ data-name', h3Fark.join('\n      '));

  await ctx.close();
}

/* =====================================================================
   4 · FACET DEĞERLERİ — data-ekipman / data-seviye / data-kas kanonikle birebir
   ===================================================================== */
console.log('\n=== 4 · kanonik facet değerleri ===');
{
  const sapma = [];
  for (const c of kartlar) {
    const k = K.get(c.slug); if (!k) continue;
    if (c.ad !== k.ad)                 sapma.push(`${c.slug} · ad "${c.ad}" ≠ "${k.ad}"`);
    if (c.kas !== k.kas)               sapma.push(`${c.slug} · data-kas "${c.kas}" ≠ "${k.kas}"`);
    if (c.ekipman !== k.ekipman)       sapma.push(`${c.slug} · data-ekipman "${c.ekipman}" ≠ "${k.ekipman}"`);
    if (+c.seviye !== k.seviye)        sapma.push(`${c.slug} · data-seviye "${c.seviye}" ≠ "${k.seviye}"`);
  }
  if (!sapma.length) ok('ad · data-kas · data-ekipman · data-seviye kanonik tabloyla birebir (25/25)');
  else rec('kanonik sapma', sapma.join('\n      '));
}

/* =====================================================================
   5 · EKİPMANSIZ HAVUZ — ≥3 çekiş hareketi
   ===================================================================== */
console.log('\n=== 5 · ekipmansız havuzda çekiş ===');
{
  const ekipmansiz = kartlar.filter(c => c.ekipman === 'ekipmansiz').map(c => c.slug);
  const cekis = EKIPMANSIZ_CEKIS.filter(s => ekipmansiz.includes(s));
  if (cekis.length >= 3) ok(`ekipmansız havuz ${ekipmansiz.length} hareket · çekiş ${cekis.length}: ${cekis.join(' · ')}`);
  else rec('ekipmansız çekiş', `yalnız ${cekis.length} çekiş hareketi (${cekis.join(', ') || '—'}) — ≥3 bekleniyordu`);

  const sirt = kartlar.filter(c => c.ekipman === 'ekipmansiz' && c.kas === 'sirt').map(c => c.slug);
  if (sirt.length >= 3) ok(`ekipmansız + data-kas="sirt" ${sirt.length} hareket: ${sirt.join(' · ')}`);
  else rec('ekipmansız sırt', `${sirt.length} hareket — ekipmansız planda sırt yine çalışmıyor`);
}

/* =====================================================================
   2 + 3 + 7 · HEDEF KONTROLÜ — 25 slug açılır, h1 karşılaştırılır
   Bu süitin asıl maddesi. HTTP 200 yetmez; VARILAN SAYFA doğru olmalı.
   ===================================================================== */
console.log('\n=== 2·3 · hedef kontrolü (h1 metni) + K43 nöbeti ===');
{
  const ctx = await yeniCtx(1440); const page = await ctx.newPage();
  const hedefHata = [], k43Hata = [], seviyeHata = [];
  let httpHata = [];

  for (const k of KANONIK) {
    const url = `${BASE}/${DETAY}?slug=${k.slug}`;
    const resp = await page.goto(url, { waitUntil:'domcontentloaded', timeout:30000 }).catch(() => null);
    if (!resp || resp.status() !== 200) { httpHata.push(`${k.slug} → HTTP ${resp ? resp.status() : 'yok'}`); continue; }
    await page.waitForTimeout(60);
    const g = await page.evaluate(() => ({
      h1:    document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
      crumb: document.querySelector('.ed-crumb b[data-ex="ad"]')
               ? document.querySelector('.ed-crumb b[data-ex="ad"]').textContent.trim() : null,
      baslik: document.title,
      seviye: document.querySelector('[data-ex="seviye"]')
               ? document.querySelector('[data-ex="seviye"]').textContent.trim() : null,
      adimSayisi: document.querySelectorAll('#edSteps li').length,
      ipucuSayisi: document.querySelectorAll('#edTips .ed-tip').length,
      kasSayisi: document.querySelectorAll('#edMuscP span').length,
      altSayisi: document.querySelectorAll('#edAltGrid .ed-altcard').length,
      fbGorunur: (function(){ var e=document.getElementById('edFallback');
                              return !!e && getComputedStyle(e).display !== 'none'; })(),
      veriAd: (window.ED_VERI && window.ED_VERI[new URLSearchParams(location.search).get('slug')])
                ? window.ED_VERI[new URLSearchParams(location.search).get('slug')].ad : null
    }));

    if (g.h1 !== k.ad) hedefHata.push(`?slug=${k.slug} → h1 "${g.h1}" — beklenen "${k.ad}"`);
    if (g.veriAd !== k.ad) k43Hata.push(`${k.slug} · VERI.ad "${g.veriAd}" ≠ data-name "${k.ad}"`);
    if (g.seviye !== SEVIYE_AD[k.seviye]) seviyeHata.push(`${k.slug} · detay seviye "${g.seviye}" ≠ kart seviyesi "${SEVIYE_AD[k.seviye]}"`);
    if (g.crumb !== k.ad) hedefHata.push(`?slug=${k.slug} → breadcrumb "${g.crumb}" — beklenen "${k.ad}"`);
    if (g.fbGorunur) hedefHata.push(`?slug=${k.slug} → gerçek slug olduğu hâlde "bulunamadı" bandı açık`);
    if (g.adimSayisi < 3)  hedefHata.push(`?slug=${k.slug} → gövde anlatımı boş (${g.adimSayisi} adım)`);
    if (g.ipucuSayisi < 3) hedefHata.push(`?slug=${k.slug} → form ipuçları boş (${g.ipucuSayisi} kalem)`);
    if (g.kasSayisi < 1)   hedefHata.push(`?slug=${k.slug} → hedef kaslar boş`);
    if (g.altSayisi < 1)   hedefHata.push(`?slug=${k.slug} → benzer hareketler şeridi boş`);
    if (!g.baslik.startsWith(k.ad)) hedefHata.push(`?slug=${k.slug} → document.title "${g.baslik}"`);
  }

  if (httpHata.length) rec('detay HTTP', httpHata.join(' · '));
  else ok(`25 slugın 25i HTTP 200`);

  if (!hedefHata.length) ok('HEDEF KONTROLÜ — 25/25 slugda h1 · breadcrumb · başlık beklenen hareketle birebir; gövde dolu');
  else rec('YANLIŞ HEDEF', hedefHata.join('\n      '));

  if (!k43Hata.length) ok('K43 — detay VERI.ad = kütüphane data-name, 25/25');
  else rec('K43 ihlali', k43Hata.join('\n      '));

  if (!seviyeHata.length) ok('detay seviye rozeti kartın data-seviye değeriyle tutarlı, 25/25');
  else rec('seviye tutarsızlığı', seviyeHata.join('\n      '));

  /* --- 7 · bilinmeyen slug → 200 + görünür düşüş, 404 yok --- */
  console.log('\n=== 7 · bilinmeyen slug ===');
  const BOZUK = ['yok-boyle-hareket','goblet','', '../etc/passwd','<script>','squat%20', 'plaNk'];
  const kotu = [];
  for (const q of BOZUK) {
    const url = `${BASE}/${DETAY}?slug=${encodeURIComponent(q)}`;
    const resp = await page.goto(url, { waitUntil:'domcontentloaded', timeout:30000 }).catch(() => null);
    if (!resp || resp.status() !== 200) { kotu.push(`"${q}" → HTTP ${resp ? resp.status() : 'yok'}`); continue; }
    await page.waitForTimeout(60);
    const g = await page.evaluate(() => ({
      h1: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
      fb: (function(){ var e=document.getElementById('edFallback');
                       return !!e && getComputedStyle(e).display !== 'none'; })(),
      fbMetin: document.getElementById('edFallbackAd')
                 ? document.getElementById('edFallbackAd').textContent.trim() : null,
      adim: document.querySelectorAll('#edSteps li').length
    }));
    const bosSlug = q === '';
    if (!g.h1) kotu.push(`"${q}" → h1 boş`);
    if (g.adim < 3) kotu.push(`"${q}" → düşülen sayfanın gövdesi boş`);
    /* boş slug = "slug verilmemiş" sayılır, kanonik ilk harekete sessiz düşer;
       DOLU ama tanınmayan slugda düşüş GÖRÜNÜR olmalı */
    if (!bosSlug && !g.fb) kotu.push(`"${q}" → sessiz düşüş (uyarı bandı kapalı)`);
    if (!bosSlug && g.fb && g.fbMetin !== g.h1) kotu.push(`"${q}" → uyarı "${g.fbMetin}", sayfa "${g.h1}"`);
  }
  if (!kotu.length) ok(`${BOZUK.length} bozuk slugın hepsi HTTP 200 · dolu gövde · dolu slugda görünür uyarı`);
  else rec('bilinmeyen slug', kotu.join('\n      '));

  await ctx.close();
}

/* =====================================================================
   6 · FİLTRE MOTORU — her ekipman ve kas değeri için kart sayısı = veri sayısı
   ===================================================================== */
console.log('\n=== 6 · filtre + sıralama ===');
{
  const ctx = await yeniCtx(1440); const page = await ctx.newPage();
  await page.goto(`${BASE}/${KUTUPHANE}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(500);

  /* Ortak filtre bileşeni (fit-shell.js) chip'leri facet popover'ına taşıyor:
     .fgroup artık .ff-facet > .ff-pop içinde ve kapalıyken görünmez. Chip'e
     ulaşmak için önce o facet'in .ff-btn'ine basılır. */
  const acFacet = async grup => {
    await page.evaluate(g => {
      const fg = document.querySelector(`.fgroup[data-group="${g}"]`);
      const facet = fg && fg.closest('.ff-facet');
      const btn = facet && facet.querySelector('.ff-btn');
      if (btn && btn.getAttribute('aria-expanded') !== 'true') btn.click();
    }, grup);
    await page.waitForTimeout(80);
  };
  const kapat = async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(60); };
  const durum = () => page.evaluate(() => ({
    gorunen: [...document.querySelectorAll('#libGrid .ex-card')]
               .filter(c => getComputedStyle(c).display !== 'none').length,
    sayac: +document.getElementById('libCount').textContent.trim()
  }));
  const sec = async (grup, val) => {
    await acFacet(grup);
    await page.click(`.fgroup[data-group="${grup}"] .df-fchip[data-val="all"]`);
    await page.waitForTimeout(40);
    await page.click(`.fgroup[data-group="${grup}"] .df-fchip[data-val="${val}"]`);
    await page.waitForTimeout(60);
    const r = await durum();
    await kapat();
    return r;
  };
  const sifirla = async grup => {
    await acFacet(grup);
    await page.click(`.fgroup[data-group="${grup}"] .df-fchip[data-val="all"]`);
    await page.waitForTimeout(50);
    await kapat();
  };

  const eksenler = [
    ['ekipman', [...new Set(KANONIK.map(x => x.ekipman))]],
    ['kas',     [...new Set(KANONIK.map(x => x.kas))]],
    ['seviye',  ['1','2','3']]
  ];
  const kotu = [];
  for (const [grup, degerler] of eksenler) {
    for (const v of degerler) {
      const beklenen = grup === 'seviye'
        ? KANONIK.filter(x => String(x.seviye) === v).length
        : KANONIK.filter(x => x[grup] === v).length;
      const r = await sec(grup, v);
      /* R11/M6 · SAYFALAMA GELDİ — ölçüm noktası değişti.
         Önce "görünen kart = veri sayısı" varsayılıyordu; artık liste
         sayfalanıyor (12/sayfa), yani görünen kart en fazla SAYFA BOYU.
         Filtrenin doğruluğu SAYAÇtan ölçülür — sayaç süzülen TOPLAMı yazar
         ve `apply()` içinde her seferinde yeniden hesaplanır.
         Görünen kart için yeni ve doğru şart: 0 < görünen ≤ min(beklenen, 12).
         Böylece "filtre çalışıyor mu" da "sayfalama çalışıyor mu" da ölçülür. */
      const SAYFA_BOY = 12;
      if (r.sayac !== beklenen)
        kotu.push(`${grup}=${v} → sayaç ${r.sayac}, veride ${beklenen} var`);
      const beklenenGorunen = Math.min(beklenen, SAYFA_BOY);
      if (r.gorunen !== beklenenGorunen)
        kotu.push(`${grup}=${v} → ${r.gorunen} kart görünüyor, ilk sayfada ${beklenenGorunen} olmalı (toplam ${beklenen})`);
    }
    await sifirla(grup);
  }
  if (!kotu.length) {
    const toplam = eksenler.reduce((n,[,d]) => n + d.length, 0);
    ok(`filtre motoru ${toplam} facet değerinde de sayaç = veri sayısı; görünen kart ilk sayfayla (≤12) sınırlı`);
  } else rec('filtre motoru', kotu.join('\n      '));

  /* filtre sıfırlanınca 25'e dönüyor mu — sayaç HESAPLANAN bir değer,
     sabit değil: apply() her seferinde süzülen kartı sayıp yazıyor.
     R11/M6 · görünen kart artık ilk sayfa (12); toplam sayaçtan okunur. */
  const sifir = await durum();
  if (sifir.sayac === 25 && sifir.gorunen === 12)
    ok('filtre sıfırlanınca sayaç 25 · ilk sayfada 12 kart (sayaç hesaplanıyor, liste sayfalanıyor)');
  else rec('sıfırlama', `görünen ${sifir.gorunen} (12 olmalı) · sayaç ${sifir.sayac} (25 olmalı)`);

  /* --- sıralama: Popüler / Yeni / A-Z, 25 kartta --- */
  const sirala = async mode => {
    await page.click(`.sort-seg button[data-sort="${mode}"]`);
    await page.waitForTimeout(60);
    return page.evaluate(() => [...document.querySelectorAll('#libGrid .ex-card')]
      .map(c => ({ ad: c.getAttribute('data-name'), pop: +c.getAttribute('data-pop') })));
  };
  const sKotu = [];
  const pop = await sirala('pop');
  if (pop.length !== 25) sKotu.push(`Popüler: ${pop.length} kart`);
  if (pop.some((c,i) => i && c.pop > pop[i-1].pop)) sKotu.push('Popüler: data-pop azalan sırada değil');
  const yeni = await sirala('yeni');
  if (yeni.length !== 25) sKotu.push(`Yeni: ${yeni.length} kart`);
  if (yeni[0].ad === pop[0].ad) sKotu.push('Yeni: sıralama değişmedi');
  const az = await sirala('az');
  if (az.length !== 25) sKotu.push(`A-Z: ${az.length} kart`);
  const azBeklenen = az.map(c => c.ad).slice().sort((a,b) => a.localeCompare(b,'tr'));
  if (JSON.stringify(az.map(c => c.ad)) !== JSON.stringify(azBeklenen)) sKotu.push('A-Z: alfabetik değil');
  if (!sKotu.length) ok('sıralama Popüler · Yeni · A-Z — 25 kartta da çalışıyor');
  else rec('sıralama', sKotu.join('\n      '));

  await ctx.close();
}

/* =====================================================================
   9 · BANNER AİLELERİ
   ===================================================================== */
console.log('\n=== 9 · banner aileleri ===');
for (const [sayfa, secici, aile, olcu] of [
  [KUTUPHANE, '.lib-top', 'liste', BANNER_LISTE],
  [DETAY,     '.ed-top',  'detay', BANNER_DETAY]
]) {
  for (const [w, beklenen] of Object.entries(olcu)) {
    const width = +w;
    const ctx = await yeniCtx(width); const page = await ctx.newPage();
    await page.goto(`${BASE}/${sayfa}`, { waitUntil:'networkidle', timeout:30000 }).catch(() => null);
    await page.waitForTimeout(400);
    const r = await page.evaluate(sel => {
      const el = document.querySelector(sel);
      return { h: el ? Math.round(el.getBoundingClientRect().height * 10) / 10 : null,
               aile: document.body.getAttribute('data-fit-hero-kind') };
    }, secici);
    if (r.aile !== aile) rec('banner ailesi', `${sayfa} @${width} data-fit-hero-kind="${r.aile}" — "${aile}" bekleniyordu`);
    else if (r.h === beklenen) ok(`${sayfa} banner @${width} = ${r.h} px (${aile} ailesi)`);
    else rec('banner yüksekliği', `${sayfa} @${width} ölçülen ${r.h} px — beklenen ${beklenen} px`);
    await ctx.close();
  }
}

/* =====================================================================
   8 · KONSOL HATASI 0 · YATAY TAŞMA 0 — iki sayfa, iki genişlik
   ===================================================================== */
console.log('\n=== 8 · konsol + yatay taşma ===');
for (const width of [1440, 390]) {
  for (const yol of [KUTUPHANE, `${DETAY}?slug=barfiks`, `${DETAY}?slug=yok-boyle-hareket`]) {
    const ctx = await yeniCtx(width); const page = await ctx.newPage();
    const konsol = [];
    page.on('pageerror', e => konsol.push('pageerror: ' + e.message.split('\n')[0]));
    page.on('console',  m => { if (m.type() === 'error') konsol.push('console.error: ' + m.text().slice(0,140)); });
    await page.goto(`${BASE}/${yol}`, { waitUntil:'networkidle', timeout:30000 }).catch(() => null);
    await page.waitForTimeout(500);
    const tasma = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (tasma <= 0) ok(`${yol} @${width} — yatay taşma 0`);
    else rec('yatay taşma', `${yol} @${width} → ${tasma} px`);
    if (!konsol.length) ok(`${yol} @${width} — konsol hatası 0`);
    else rec('konsol', `${yol} @${width} → ` + konsol.join(' | '));
    await ctx.close();
  }
}

await browser.close();

console.log('');
if (fail) { console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
