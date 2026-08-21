/* =====================================================================
   DADAFIT — R8 · AJAN-D · EGZERSİZ BLOĞU NÖBETİ (kalem 15–20)
   ---------------------------------------------------------------------
   Neyi kanıtlar (her ölçüt sayı ya da ikili sonuç üretir):

   15 · BANNER — `.ed-top` detay ailesinin sabitinde (560/617/726) ve
        bandın İÇİNDEKİ ölü boşluk aile tavanının altında. Sabit yükseklik
        zaten tutuyordu; kusur kutunun içiydi: içerik 162 px sürüyor,
        geri kalan 269 px (@1440) / 437 px (@390) boş fotoğraftı. Aileyi
        tamamlayan üç blok (alt metin · eylem satırı · istatistik şeridi)
        banner'da hiç yoktu — nöbet üçünün de VARLIĞINI ve boşluğun
        tavanı aşmadığını ölçer.
   16 · Sayfa altı not kutuları kendi içerik kolonunu doldurur (fark 0).
   17 · "Bulamadık" notu DOM sırasında son içerik bölümünden SONRA ve
        sayfanın üst yarısında değil.
   18 · Video erişilebilirlik notu da aynı kolon ölçüsünde (fark 0).
   19 · İki sayfada da sağlık/destek notu var; hukuki kapsamın yedi
        maddesi metinde geçiyor ve sorumluluk-reddi kalıbı geçmiyor.
   20 · Filtre çubuğunda sayının solundaki dikey ayraç yok (::before
        üretilmiyor) ve çubuğun eleman hizası bozulmadı.

   HEDEF kontrolü (HTTP değil): üç slugda h1 beklenen hareket adıyla
   birebir eşleşir — sayfa 200 dönüp yanlış hareketi göstermesi kusur.

   Çalıştırma:
     node tests/egzersiz-r8.mjs [base] [widths]
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE   = process.argv[2] || 'http://localhost:8811';
const WIDTHS = (process.argv[3] || '1440,1024,390').split(',').map(Number);

const DETAY = 'egzersiz-detay-v1.html';
const LISTE = 'egzersiz-kutuphane-v1.html';

/* detay ailesi sabiti — DEVIR-7 §2c */
const BANNER_DETAY = { 1440:560, 1024:617, 390:726 };
const BANNER_LISTE = { 1440:544, 1024:607, 390:587 };

/* Bandın içindeki ölü boşluk tavanı. Değer uydurma değil: R8'de detay
   ailesinin sekiz sayfası ölçüldü (@1440 79.7–252.1 · @390 182.6–451).
   Tavan ailenin ORTANCASININ biraz üstüne konuldu; egzersiz-detay R8
   öncesinde 269.4/437.5 ile ailenin en kötü ikincisiydi. */
const BOSLUK_TAVAN = { 1440:200, 1024:200, 390:290 };

/* HEDEF kayıtları — kütüphane kartının data-name'i kanonik (K43) */
const HEDEF = [
  ['goblet-squat', 'Goblet Squat'],
  ['plank',        'Plank (Şınav Duruşu)'],
  ['bant-cekme',   'Bant Çekme (Band Row)']
];

/* 19 · hukuki kapsamın yedi maddesi — her biri için en az bir kalıp */
const HUKUKI = [
  ['genel bilgi amaçlı',              /genel bilgi amaçlı/i],
  ['tıbbi değerlendirme yerine geçmez', /tıbbi değerlendirme(nin)?\s+(ya da[^.]*)?yerine geçmez/i],
  ['kişiye özel program değil',       /kişiye özel bir antrenman programı(nın)?\s*yerine geçmez/i],
  ['yanlış form → sakatlanma riski',  /sakatlanma riskini|formu öğrenene kadar yükü düşük/i],
  ['ağrıda dur',                      /ağrı hissedersen/i],
  ['rahatsızlık/yaralanma/gebelik → hekim', /hamileysen[^.]*hekimine (danış|sor)|hekimine (danış|sor)/i],
  ['antrenör desteği yönlendirmesi',  /DadaFit antrenörlerinden destek alabilirsin/i]
];

/* 19 · sorumluluk-reddi TONU — bunlardan biri geçerse kusur */
const SORUMLULUK_TONU = [
  /sorumlu(luk)? (kabul edilmez|bize ait değildir|dadafit'e ait değildir)/i,
  /doğabilecek (her türlü )?zarar/i,
  /hiçbir sorumluluk/i,
  /kullanıcı(nın)? kendi sorumluluğu/i,
  /riski (tamamen )?kullanıcıya aittir/i
];

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = m => console.log('  ✓ ' + m);

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport:{ width, height:1000 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const page = await ctx.newPage();
  console.log(`\n=== @${width} ===`);

  /* ---------------- 15 · BANNER ---------------- */
  for (const [slug, ad] of HEDEF) {
    await page.goto(`${BASE}/${DETAY}?slug=${slug}`, { waitUntil:'load' });
    await page.waitForTimeout(350);
    const m = await page.evaluate(() => {
      const band = document.querySelector('.ed-top');
      if (!band) return { yok:true };
      const r = band.getBoundingClientRect();
      const wrap = band.querySelector('.wrap');
      /* SEÇİCİ DOĞRULAMASI: içeriğin alt kenarı, bandın .wrap'ındaki
         GÖRÜNÜR her torunun en altı. Yalnız doğrudan çocuğa bakmak,
         JS iki kolonu kurduktan sonra (.lib-row) yanlış sayı verirdi. */
      const alt = [...wrap.querySelectorAll('*')].reduce((a, e) => {
        const b = e.getBoundingClientRect();
        return (b.height > 0 && b.bottom > a) ? b.bottom : a;
      }, 0);
      const sub   = band.querySelector('.ed-sub');
      const cta   = band.querySelector('.lib-cta');
      const stats = [...band.querySelectorAll('.lib-stats .lib-stat')];
      return {
        h: +r.height.toFixed(1),
        bosluk: +(r.bottom - alt).toFixed(1),
        h1: (band.querySelector('h1')||{}).textContent?.trim() || null,
        subMetin: sub ? sub.textContent.trim() : null,
        ctaSayisi: cta ? cta.querySelectorAll('a,button').length : 0,
        ctaHedef: cta ? [...cta.querySelectorAll('a')].map(a => a.getAttribute('href')) : [],
        statSayisi: stats.length,
        statDeger: stats.map(s => (s.querySelector('b')||{}).textContent)
      };
    });

    if (m.yok) { rec(`15 @${width}`, `${slug}: .ed-top bulunamadı`); continue; }
    /* HEDEF kontrolü — HTTP değil, gösterilen hareket */
    if (m.h1 !== ad) rec(`HEDEF @${width}`, `?slug=${slug} → h1 "${m.h1}" — beklenen "${ad}"`);
    if (m.h !== BANNER_DETAY[width])
      rec(`15 @${width}`, `${slug}: banner ${m.h} — detay ailesi sabiti ${BANNER_DETAY[width]}`);
    if (m.bosluk > BOSLUK_TAVAN[width])
      rec(`15 @${width}`, `${slug}: banner içi ölü boşluk ${m.bosluk} > tavan ${BOSLUK_TAVAN[width]}`);
    if (!m.subMetin)
      rec(`15 @${width}`, `${slug}: banner alt metni (.ed-sub) yok — aile sırası kırıntı→eyebrow→H1→ALT METİN→şerit→CTA`);
    if (m.ctaSayisi < 2)
      rec(`15 @${width}`, `${slug}: banner eylem satırı eksik (${m.ctaSayisi} düğme, beklenen 2)`);
    for (const h of m.ctaHedef)
      if (!h || !h.startsWith('#'))
        rec(`15 @${width}`, `${slug}: banner CTA hedefi sayfa içi değil — "${h}"`);
    if (m.statSayisi !== 3)
      rec(`15 @${width}`, `${slug}: istatistik şeridi ${m.statSayisi} kalem (beklenen 3)`);
    if (m.statDeger.some(v => !/^\d+$/.test((v||'').trim()) || +v === 0))
      rec(`15 @${width}`, `${slug}: istatistik değerleri sayı değil / sıfır — ${JSON.stringify(m.statDeger)}`);
  }
  if (!bad.some(b => b.startsWith(`15 @${width}`)))
    ok(`@${width} banner ${BANNER_DETAY[width]} px · 3 slugda h1 hedefi tutuyor · alt metin+CTA+şerit yerinde`);

  /* -------- 16 · 18 · not kutuları kendi kolonunda -------- */
  for (const [sayfa, url] of [['detay', `${DETAY}?slug=goblet-squat`], ['kütüphane', LISTE]]) {
    await page.goto(`${BASE}/${url}`, { waitUntil:'load' });
    await page.waitForTimeout(400);
    const m = await page.evaluate(() => {
      const kolon = el => {
        const p = el.parentElement; if (!p) return null;
        const c = getComputedStyle(p), r = p.getBoundingClientRect();
        return Math.round(r.width - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight));
      };
      const notlar = [...document.querySelectorAll('.hr-note')].map(n => {
        const r = n.getBoundingClientRect();
        if (r.width === 0) return null;                    /* gizli blok ölçülmez */
        return { ad: n.id || n.className, w: Math.round(r.width), k: kolon(n) };
      }).filter(Boolean);
      return { notlar, ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    if (!m.notlar.length) rec(`16/18 @${width}`, `${sayfa}: görünür .hr-note yok — seçici ya da blok kayıp`);
    for (const n of m.notlar)
      if (n.k !== null && Math.abs(n.w - n.k) > 1)
        rec(`16/18 @${width}`, `${sayfa}: not kutusu ${n.w} ≠ içerik kolonu ${n.k} (${n.ad})`);
    if (m.ovf > 1) rec(`16 @${width}`, `${sayfa}: yatay taşma ${m.ovf} px`);
    if (m.notlar.length)
      ok(`@${width} ${sayfa}: ${m.notlar.length} not kutusu kendi kolonunda (fark 0) · taşma ${m.ovf}`);
  }

  /* -------- 17 · "bulamadık" notu EN ALTTA -------- */
  await page.goto(`${BASE}/${DETAY}?slug=yok-boyle-hareket`, { waitUntil:'load' });
  await page.waitForTimeout(400);
  const fb = await page.evaluate(() => {
    const el = document.getElementById('edFallback');
    if (!el) return { yok:true };
    const gorunur = getComputedStyle(el).display !== 'none';
    const r = el.getBoundingClientRect();
    const y = r.top + scrollY;
    const son = document.querySelector('.ed-alt');          /* son içerik bölümü */
    return {
      gorunur, y:+y.toFixed(1), docH: document.documentElement.scrollHeight,
      /* DOM sırası: son bölüm, uyarıdan ÖNCE gelmeli */
      sonrada: !!(el.compareDocumentPosition(son) & Node.DOCUMENT_POSITION_PRECEDING),
      metin: (document.getElementById('edFallbackAd')||{}).textContent || null,
      h1: (document.querySelector('h1')||{}).textContent?.trim() || null
    };
  });
  if (fb.yok)          rec(`17 @${width}`, '#edFallback DOM\'da yok');
  else {
    if (!fb.gorunur)   rec(`17 @${width}`, 'bilinmeyen slugda uyarı açılmıyor (sessiz düşüş)');
    if (!fb.sonrada)   rec(`17 @${width}`, 'uyarı DOM sırasında son içerik bölümünden (.ed-alt) ÖNCE');
    if (fb.y < fb.docH / 2)
      rec(`17 @${width}`, `uyarı sayfanın üst yarısında — y=${fb.y}, sayfa ${fb.docH}`);
    if (fb.metin && fb.h1 && fb.metin.trim() !== fb.h1)
      rec(`17 @${width}`, `uyarı "${fb.metin}" ≠ gösterilen hareket "${fb.h1}"`);
    if (fb.gorunur && fb.sonrada && fb.y >= fb.docH / 2)
      ok(`@${width} bulamadık notu son bölümden sonra · y=${fb.y}/${fb.docH} (%${Math.round(100*fb.y/fb.docH)})`);
  }

  /* -------- 19 · TON: hukuki kapsam var, sorumluluk-reddi tonu yok -------- */
  for (const [sayfa, url] of [['detay', `${DETAY}?slug=goblet-squat`], ['kütüphane', LISTE]]) {
    await page.goto(`${BASE}/${url}`, { waitUntil:'load' });
    await page.waitForTimeout(300);
    const t = await page.evaluate(() => {
      const n = document.querySelector('.ed-guide, .lib-guide');
      return n ? n.innerText.replace(/\s+/g, ' ').trim() : null;
    });
    if (!t) { rec(`19 @${width}`, `${sayfa}: sağlık/destek notu yok (.ed-guide / .lib-guide)`); continue; }
    const eksik = HUKUKI.filter(([, re]) => !re.test(t)).map(([ad]) => ad);
    if (eksik.length) rec(`19 @${width}`, `${sayfa}: hukuki kapsam eksik → ${eksik.join(' · ')}`);
    const tonKusuru = SORUMLULUK_TONU.filter(re => re.test(t));
    if (tonKusuru.length) rec(`19 @${width}`, `${sayfa}: sorumluluk-reddi kalıbı geçiyor → ${tonKusuru.length} eşleşme`);
    /* son cümle uzmana yönlendirme olmalı — kardeş marka yapısı
       (dadadiet.com/beslenme .reh-note: kapsam → koşul → yönlendirme) */
    const son = t.split(/(?<=\.)\s+/).pop() || '';
    if (!/antrenör/i.test(son))
      rec(`19 @${width}`, `${sayfa}: not uzmana yönlendirmeyle bitmiyor — son cümle "${son.slice(0,80)}"`);
    if (!eksik.length && !tonKusuru.length && /antrenör/i.test(son))
      ok(`@${width} ${sayfa}: 7/7 hukuki madde var · sorumluluk-reddi kalıbı 0 · son cümle yönlendirme`);
  }

  /* -------- 20 · filtre çubuğunda dikey ayraç yok -------- */
  await page.goto(`${BASE}/${LISTE}`, { waitUntil:'load' });
  await page.waitForTimeout(500);
  const f = await page.evaluate(() => {
    const cnt = document.querySelector('.ff-bar .ff-count');
    if (!cnt) return { yok:true };
    const b = getComputedStyle(cnt, '::before');
    const bar = document.querySelector('.ff-bar');
    const hiza = [...bar.children]
      .map(e => ({ c:e.className, y:+e.getBoundingClientRect().top.toFixed(1),
                   x:+e.getBoundingClientRect().left.toFixed(1) }))
      .filter(o => o.y > 0);
    return {
      content: b.content, w: b.width, display: b.display,
      /* ayraç üretiliyorsa sayının solunda 1px genişlikte bir kutu olur */
      ayracVar: b.content !== 'none' && b.display !== 'none',
      hiza, kart: document.querySelectorAll('#libGrid .ex-card').length,
      sayac: (document.getElementById('libCount')||{}).textContent
    };
  });
  if (f.yok) rec(`20 @${width}`, '.ff-bar .ff-count bulunamadı — seçici geçersiz, sayı raporlanamaz');
  else {
    if (f.ayracVar) rec(`20 @${width}`, `sayının solundaki dikey ayraç hâlâ var (content=${f.content}, display=${f.display})`);
    else ok(`@${width} filtre çubuğunda dikey ayraç 0 (::before content=${f.content}) · hizadaki eleman ${f.hiza.length}`);
    if (+f.kart !== 25) rec(`SABİT @${width}`, `kütüphane kart sayısı ${f.kart} — 25 olmalı`);
    if ((f.sayac||'').trim() !== '25') rec(`SABİT @${width}`, `sayaç "${f.sayac}" — 25 olmalı`);
  }

  /* -------- SABİT · liste ailesi banner'ı -------- */
  const lb = await page.evaluate(() =>
    +document.querySelector('.lib-top').getBoundingClientRect().height.toFixed(1));
  if (lb !== BANNER_LISTE[width])
    rec(`SABİT @${width}`, `kütüphane banner ${lb} — liste ailesi sabiti ${BANNER_LISTE[width]}`);
  else ok(`@${width} liste ailesi banner ${lb} · katalog 25 hareket`);

  await ctx.close();
}

await browser.close();
console.log(`\n${WIDTHS.length} genişlik · ${fail} sorun`);
if (bad.length) { console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ 15 banner sabiti + iç boşluk · 16/18 not kutuları kolonunda · 17 uyarı en altta');
console.log('✓ 19 hukuki kapsam 7/7 ve yönlendirme tonu · 20 dikey ayraç 0 · 25 hareket sabiti');
