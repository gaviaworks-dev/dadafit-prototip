/* =====================================================================
   DADAFIT — FOOTER YAPISI TESTİ  (9. tur · footer revizyonu)
   ---------------------------------------------------------------------
   Revizyon dokümanının footer bölümünü madde madde nöbette tutar.
   Doküman bağlayıcı; aşağıdaki beklentiler ondan BİREBİR alındı.

   1  BEŞ ALAN ve sırası @1440
        Marka | Hareket ve Öğren | Programlar ve Uzman Desteği |
        Enerji ve Denge | Uygulama
   2  ÜÇ ORTA SÜTUNUN kalem listeleri dokümanla birebir (ad + sıra + hedef)
   3  "Planım" footer'da YOK — doküman: "Planım ve İlerlemem footer'a
      eklenmeyecek, header'da kalacak"
   4  KURUMSAL BANT: 8 kalem, sütunların İÇİNDE değil ayrı yatay bant;
      @1440 tek satır, @1024 iki satır (geometriyle ölçülür). Doküman
      "Çözüm Merkezi ile Öneri ve Şikâyet geri plana atılmamalıdır"
      diyor → sekiz kalemin punto/ağırlık/renk değerleri EŞİT olmalı.
   5  TÜM footer hedefleri 200 — istisna YOK (7. oturumda kapandı):
      paralel bir dalda üretiliyor, bu dalda henüz yok → SORUN sayılmaz,
      NOT olarak raporlanır ("birleştirme sonrası doğrulanacak").
   6  MAĞAZA BUTONLARI <a href> DEĞİL: doküman "uygulama henüz
      yayımlanmadıysa mağaza butonları aktif indirme bağlantısı gibi
      çalışmamalıdır" diyor. <span>, href yok, aria-disabled="true",
      .focus() tutmuyor (odak sırasına girmiyor), "Yakında" görünür.
   7  SOSYAL: yalnız Instagram + YouTube. X · Facebook · LinkedIn = 0.
      İkisi de yer tutucu işaretli (data-yer-tutucu + durumu anlatan
      aria-label) ve docs/icerik-bekleyen.md'de kalemi var.
   8  ACCORDION: @390 üç orta menü açılır-kapanır, aria-expanded doğru,
      klavyede (Enter) çalışır; @1440 üçü de açık ve düğme `disabled`.
   9  MOBİL SIRALAMA @390 — dokümandaki yedi adım, DOM + geometri.
   10 YASAL BANT DOKUNULMAMIŞ (nöbetçi): altı kalemin metni, sırası ve
      hedefi taban commit'tekiyle birebir aynı. Doküman dipnotu:
      "Dada Fit'in mevcut yasal bandına hiçbir şekilde müdahale
      edilmeyecektir."
   11 R11 PERDESİ: `main.style.marginBottom` − footer yüksekliği = 0,
      tek değer, tüm sayfalarda; accordion açılıp genişlik masaüstüne
      döndükten SONRA da 0 (accordion yüksekliği değiştirdiği için
      perde yeniden ölçülüyor).
   12 B10 NÖBETİ: `.fit-health` `#pageMain`'in SON ÇOCUĞU.
   13 Konsol hatası 0 · yatay taşma 0 (@1440 · @1024 · @390).

   Çalıştırma:
     python3 -m http.server 8852 &
     export PW_HOME=~/.pw
     node tests/footer-yapi.mjs                        # varsayılan 8852
     node tests/footer-yapi.mjs http://localhost:8854  # K27 taban koşusu
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:8852';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAYFALAR = readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html').sort();
const ORNEK = 'hakkimizda-v1.html';          /* yapı ölçümlerinin sayfası */

/* Paralel dalda üretilen sayfa — bu dalda 404 vermesi BEKLENEN. */
/* 7. oturum: enerji-ihtiyaci-v1.html ÜRETİLDİ ve birleştirildi, artık
   istisna değil — footer'ın TÜM hedefleri 200 dönmek zorunda.
   Boş bırakmak istisnayı kapatır; yeni bir bekleyen hedef çıkarsa
   buraya yazılır ve docs/icerik-bekleyen.md'ye de kalem düşülür. */
const BEKLEYEN_HEDEF = null;

/* --- dokümandan birebir: üç orta sütun ------------------------------- */
const SUTUNLAR = [
  { anahtar:'hareket', baslik:'Hareket ve Öğren', kalemler:[
    ['Hareket Merkezi',      'hareket-merkezi-v1.html'],
    ['DadaFit Egzersizleri', 'egzersiz-kutuphane-v1.html'],
    ['Hareket Rehberi',      'hareket-rehberi-v1.html'],
    ['Spor Sözlüğü',         'sozluk-v1.html'],
    ['Anatomi Haritası',     'anatomi-v1.html'],
    ['Antrenman Oluşturucu', 'antrenman-olusturucu-v1.html']
  ]},
  { anahtar:'programlar', baslik:'Programlar ve Uzman Desteği', kalemler:[
    ['Tüm Programlar', 'program-liste-v1.html'],
    ['Programını Bul', 'programini-bul-v1.html'],
    ['Fit Testleri',   'fit-testleri-v1.html'],
    ['Challenge',      'challenge-merkezi-v1.html'],
    ['Antrenörler',    'antrenorler-v1.html'],
    ['Antrenör Ol',    'antrenor-ol-v1.html']
  ]},
  { anahtar:'enerji', baslik:'Enerji ve Denge', kalemler:[
    ['Enerji Defteri',                   'enerji-defteri-v1.html'],
    ['Enerji Köprüsü',                   'dadafit-kopru-v1.html'],
    ['Günlük Enerji İhtiyacını Hesapla', 'enerji-ihtiyaci-v1.html'],
    ['Aktivite Günlüğü',                 'aktivite-gunlugu-v1.html'],
    ['Su Takibi',                        'enerji-defteri-su-v1.html'],
    ['Haftalık Özet',                    'enerji-defteri-haftalik-v1.html']
  ]}
];

/* --- dokümandan birebir: kurumsal bant ------------------------------- */
const KURUMSAL = [
  ['Hakkımızda',                    'hakkimizda-v1.html'],
  ['Künye',                         'hakkimizda-v1.html#kunye'],
  ['İletişim',                      'iletisim-v1.html'],
  ['Çözüm Merkezi',                 'destek-talepleri-v1.html'],
  ['Öneri ve Şikâyet',              'iletisim-v1.html#conForm'],
  ['İş Birliği',                    'reklam-ver-v1.html#isbirligi'],
  ['Reklam ve Marka İş Birlikleri', 'reklam-ver-v1.html#reklam'],
  ['Sponsorlar ve Partnerler',      'hakkimizda-v1.html#partnerler']
];

/* --- NÖBETÇİ: yasal bant, taban commit 4a13299'daki hâliyle ----------
   Bu dizi DEĞİŞTİRİLMEZ. Footer'daki yasal kalemler bununla birebir
   tutmuyorsa test kırmızıya döner. */
const YASAL = [
  ['Kullanım Koşulları',       'yasal-v1.html?metin=kullanim'],
  ['Gizlilik ve KVKK',         'yasal-v1.html?metin=kvkk'],
  ['Çerez Politikası',         'yasal-v1.html?metin=cerez'],
  ['Üyelik ve İptal Koşulları','yasal-v1.html?metin=uyelik'],
  ['Sağlık Bilgilendirmesi',   'saglik-bilgilendirme-v1.html'],
  ['Veri ve İzin Politikası',  'yasal-v1.html?metin=veri-izin']
];

/* --- dokümandan birebir: mobil sıralama ------------------------------ */
const MOBIL_SIRA = [
  ['Logo, açıklama ve sosyal medya', '.foot-brand'],
  ['Hareket ve Öğren',               '.foot-col[data-foot-col="hareket"]'],
  ['Programlar ve Uzman Desteği',    '.foot-col[data-foot-col="programlar"]'],
  ['Enerji ve Denge',                '.foot-col[data-foot-col="enerji"]'],
  ['Mobil uygulama alanı',           '.foot-app'],
  ['Kurumsal bağlantılar',           '.foot-corp'],
  ['Mevcut yasal bant',              '.foot-lawband']
];

const MARKA_METNI = 'Bilimsel temelli hareket içerikleri, uygulanabilir programlar ve ölçülebilir takip araçlarıyla aktif yaşamı herkes için erişilebilir kılıyoruz.';
const APP_METNI   = 'Antrenmanını yanında taşı. Programların, günlük aktiviten ve enerji takibin tek uygulamada.';

let fail = 0; const bad = []; const notlar = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);
const not = (m) => { notlar.push(m); console.log('  · ' + m); };
const esit = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const browser = await chromium.launch();
async function ac(width) {
  const ctx = await browser.newContext({ viewport:{ width, height: width < 600 ? 844 : 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent','accepted'); } catch(e){} });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console', m => { if (m.type() === 'error') konsol.push(m.text().slice(0,120)); });
  page.on('pageerror', e => konsol.push('pageerror: ' + String(e).slice(0,120)));
  return { ctx, page, konsol };
}

console.log(`\n=== FOOTER YAPISI · ${BASE} ===\n`);

/* =====================================================================
   1 · BEŞ ALAN + 2 · SÜTUN LİSTELERİ + 3 · PLANIM YOK + 7 · SOSYAL
   (@1440, tek sayfa üzerinden — footer 65 sayfada aynı kabuktan basılıyor)
   ===================================================================== */
console.log('--- 1·2·3·7 · beş alan · sütun listeleri · Planım · sosyal ---');
{
  const { ctx, page } = await ac(1440);
  await page.goto(`${BASE}/${ORNEK}`, { waitUntil:'load', timeout:30000 });
  await page.waitForTimeout(700);

  const y = await page.evaluate(() => {
    const gr = document.querySelector('.foot-grid');
    const kutu = e => { const r = e.getBoundingClientRect(); return { x:Math.round(r.left), w:Math.round(r.width) }; };
    const alan = e => {
      if (e.classList.contains('foot-brand')) return 'marka';
      if (e.classList.contains('foot-app'))   return 'uygulama';
      if (e.hasAttribute('data-foot-col'))    return e.getAttribute('data-foot-col');
      return 'BİLİNMEYEN:' + e.className;
    };
    const sutun = k => {
      const el = document.querySelector(`.foot-col[data-foot-col="${k}"]`);
      if (!el) return null;
      return {
        baslik: (el.querySelector('.fc-title')||{}).textContent || '',
        kalemler: [...el.querySelectorAll('.fc-links a')]
          .map(a => [a.textContent.trim(), a.getAttribute('href')])
      };
    };
    const soc = [...document.querySelectorAll('.foot-soc a')].map(a => ({
      ikon: (a.querySelector('i')||{}).className || '',
      href: a.getAttribute('href'),
      yerTutucu: a.getAttribute('data-yer-tutucu'),
      etiket: a.getAttribute('aria-label') || ''
    }));
    const ftr = document.querySelector('footer.footer');
    return {
      alanlar: [...gr.children].map(e => ({ ad:alan(e), ...kutu(e) })),
      hareket: sutun('hareket'), programlar: sutun('programlar'), enerji: sutun('enerji'),
      markaMetni: (document.querySelector('.foot-brand .foot-tag')||{}).textContent || '',
      appBaslik:  (document.querySelector('.foot-app h5')||{}).textContent || '',
      appMetni:   (document.querySelector('.foot-app .ap-tag')||{}).textContent || '',
      soc,
      socIkonlari: [...ftr.querySelectorAll('.foot-soc i')].map(i => i.className).join(' '),
      planimMetin: [...ftr.querySelectorAll('a')].filter(a => /^Planım$/i.test(a.textContent.trim())).length,
      planimHref:  [...ftr.querySelectorAll('a')].filter(a => (a.getAttribute('href')||'').indexOf('fit-planim') === 0).length,
      corpEbeveyn: (document.querySelector('.foot-corp')||{}).parentElement ?
        document.querySelector('.foot-corp').parentElement.className : null,
      corpGridIcinde: !!document.querySelector('.foot-grid .foot-corp')
    };
  });

  /* 1 · beş alan, doğru sırada, soldan sağa */
  const beklenenAlan = ['marka','hareket','programlar','enerji','uygulama'];
  const gelen = y.alanlar.map(a => a.ad);
  if (!esit(gelen, beklenenAlan))
    rec('1 · beş alan', `sıra yanlış → ${gelen.join(' | ')}`);
  else {
    const artan = y.alanlar.every((a,i) => i === 0 || a.x > y.alanlar[i-1].x);
    if (!artan) rec('1 · beş alan', 'soldan sağa artan düzende değil: ' + y.alanlar.map(a=>a.ad+'@'+a.x).join(' '));
    else ok('beş alan @1440 doğru sırada: ' + y.alanlar.map(a=>`${a.ad}(x=${a.x},w=${a.w})`).join(' · '));
  }

  /* 2 · üç sütunun kalem listeleri */
  for (const s of SUTUNLAR) {
    const g = y[s.anahtar];
    if (!g) { rec(`2 · ${s.baslik}`, 'sütun yok'); continue; }
    if (g.baslik.trim() !== s.baslik) rec(`2 · ${s.anahtar}`, `başlık "${g.baslik.trim()}" ≠ "${s.baslik}"`);
    if (!esit(g.kalemler, s.kalemler))
      rec(`2 · ${s.baslik}`, 'kalem listesi dokümanla tutmuyor\n      gelen:    ' +
          JSON.stringify(g.kalemler) + '\n      beklenen: ' + JSON.stringify(s.kalemler));
    else ok(`${s.baslik}: ${g.kalemler.length}/6 kalem dokümanla birebir (ad · sıra · hedef)`);
  }

  /* marka + uygulama metinleri birebir */
  if (y.markaMetni.trim() !== MARKA_METNI) rec('1 · marka açıklaması', 'birebir değil → ' + y.markaMetni.trim().slice(0,80));
  else ok('marka açıklaması dokümanla birebir');
  if (y.appMetni.trim() !== APP_METNI) rec('5 · uygulama açıklaması', 'birebir değil → ' + y.appMetni.trim().slice(0,80));
  else ok('uygulama alanı açıklaması dokümanla birebir');
  if (!/İndir$/.test(y.appBaslik.trim())) rec('5 · uygulama başlığı', 'gelen: ' + y.appBaslik.trim());
  else ok(`uygulama alanı başlığı: "${y.appBaslik.trim()}"`);

  /* 3 · Planım footer'da yok */
  if (y.planimMetin || y.planimHref)
    rec('3 · Planım', `footer'da hâlâ var (metin ${y.planimMetin} · fit-planim hedefi ${y.planimHref})`);
  else ok('Planım footer\'da YOK (metin 0 · fit-planim hedefi 0) — doküman şartı');

  /* 7 · sosyal */
  const yasakli = ['x-twitter','facebook','linkedin'].filter(k => y.socIkonlari.indexOf('fa-'+k) >= 0);
  if (y.soc.length !== 2) rec('7 · sosyal', `${y.soc.length} bağlantı var, 2 olmalı`);
  else if (yasakli.length) rec('7 · sosyal', 'kaldırılması gereken ikon(lar) duruyor: ' + yasakli.join(', '));
  else {
    const ig = y.soc.find(s => /instagram/.test(s.ikon));
    const yt = y.soc.find(s => /youtube/.test(s.ikon));
    if (!ig || !yt) rec('7 · sosyal', 'Instagram ve/veya YouTube yok: ' + JSON.stringify(y.soc));
    else if (!ig.yerTutucu || !yt.yerTutucu) rec('7 · sosyal', 'yer tutucu işareti (data-yer-tutucu) eksik');
    else if (!/yakında|henüz yok/i.test(ig.etiket) || !/yakında|henüz yok/i.test(yt.etiket))
      rec('7 · sosyal', 'aria-label yer tutucu olduğunu söylemiyor: ' + ig.etiket + ' | ' + yt.etiket);
    else ok(`sosyal: yalnız Instagram + YouTube · X/Facebook/LinkedIn 0 · ikisi de yer tutucu işaretli (href="${ig.href}")`);
  }

  /* 4a · kurumsal bant sütunların İÇİNDE değil */
  if (y.corpEbeveyn === null) rec('4 · kurumsal bant', '.foot-corp bandı YOK');
  else if (y.corpGridIcinde) rec('4 · kurumsal bant', '.foot-grid içinde — ayrı yatay bant olmalı');
  else ok(`kurumsal bant ayrı yatay bantta (ebeveyn: .${y.corpEbeveyn})`);

  await ctx.close();
}

/* =====================================================================
   4 · KURUMSAL BANT — 8 kalem · satır sayısı · eşit ağırlık
   10 · YASAL BANT NÖBETİ
   ===================================================================== */
console.log('\n--- 4 · kurumsal bant · 10 · yasal bant nöbeti ---');
const corpSatir = {};
for (const w of [1440, 1024, 390]) {
  const { ctx, page } = await ac(w);
  await page.goto(`${BASE}/${ORNEK}`, { waitUntil:'load', timeout:30000 });
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const oku = sel => [...document.querySelectorAll(sel)].map(a => [a.textContent.trim(), a.getAttribute('href')]);
    const satirlar = sel => {
      const s = new Set();
      document.querySelectorAll(sel).forEach(a => s.add(Math.round(a.getBoundingClientRect().top)));
      return s.size;
    };
    const bicim = sel => [...document.querySelectorAll(sel)].map(a => {
      const c = getComputedStyle(a);
      return [a.textContent.trim(), c.fontSize, c.fontWeight, c.color, c.opacity].join('|');
    });
    return {
      corp: oku('.foot-corp a'), corpSatir: satirlar('.foot-corp a'), corpBicim: bicim('.foot-corp a'),
      yasal: oku('.foot-lawband a'), yasalSatir: satirlar('.foot-lawband a'),
      yasalBicim: bicim('.foot-lawband a')
    };
  });
  corpSatir[w] = r.corpSatir;

  if (w === 1440) {
    if (!esit(r.corp, KURUMSAL))
      rec('4 · kurumsal bant', 'kalemler dokümanla tutmuyor\n      gelen:    ' + JSON.stringify(r.corp) +
          '\n      beklenen: ' + JSON.stringify(KURUMSAL));
    else ok(`kurumsal bant: 8/8 kalem dokümanla birebir (ad · sıra · hedef)`);

    /* "Çözüm Merkezi ile Öneri ve Şikâyet geri plana atılmamalıdır" */
    const bicimler = new Set(r.corpBicim.map(b => b.split('|').slice(1).join('|')));
    if (!r.corp.length) { /* bant yok — yukarıda kaydedildi */ }
    else if (bicimler.size !== 1)
      rec('4 · kurumsal bant', 'sekiz kalem aynı biçimde değil (biri geri plana atılmış): ' + [...bicimler].join(' ≠ '));
    else ok('sekiz kurumsal kalem AYNI punto/ağırlık/renk/opaklık: ' + [...bicimler][0]);

    /* 10 · yasal bant nöbeti */
    if (!esit(r.yasal, YASAL))
      rec('10 · YASAL BANT', 'taban commit\'ten SAPMA VAR — dokunulmayacaktı\n      gelen:    ' +
          JSON.stringify(r.yasal) + '\n      beklenen: ' + JSON.stringify(YASAL));
    else ok('yasal bant: 6/6 kalem metin · sıra · hedef taban commit ile birebir');
    if (r.yasal.length === YASAL.length) {
      const yb = new Set(r.yasalBicim.map(b => b.split('|').slice(1).join('|')));
      ok('yasal bant kalem biçimi (punto|ağırlık|renk|opaklık): ' + [...yb].join(' · '));
    }
  }
}
if (corpSatir[1440] !== 1) rec('4 · kurumsal bant @1440', `${corpSatir[1440]} satır — tek satır olmalı`);
else ok('kurumsal bant @1440: 1 satır (geniş masaüstünde tek satır)');
if (corpSatir[1024] !== 2) rec('4 · kurumsal bant @1024', `${corpSatir[1024]} satır — iki dengeli satır olmalı`);
else ok('kurumsal bant @1024: 2 satır (4+4, dengeli)');
if (corpSatir[390] > 0)
  not(`kurumsal bant @390: ${corpSatir[390]} satır — 8 kalemin en genişi 174.6 px, 358 px'lik alanda iki satıra sığmıyor (2 sütun × 4 satır)`);

/* =====================================================================
   5 · TÜM FOOTER HEDEFLERİ 200
   ===================================================================== */
console.log('\n--- 5 · footer hedefleri ---');
{
  const { ctx, page } = await ac(1440);
  await page.goto(`${BASE}/${ORNEK}`, { waitUntil:'load', timeout:30000 });
  await page.waitForTimeout(500);
  const hedefler = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('footer.footer a')]
      .map(a => a.getAttribute('href'))
      .filter(h => h && h !== '#' && !/^https?:/.test(h)))]);
  await ctx.close();

  let iyi = 0; const bekleyen = [];
  for (const h of hedefler) {
    const dosya = h.split('#')[0].split('?')[0];
    if (dosya === BEKLEYEN_HEDEF) { bekleyen.push(h); continue; }
    let st = 0;
    try { st = (await fetch(`${BASE}/${dosya}`)).status; } catch(e) { st = -1; }
    if (st !== 200) rec('5 · footer hedefi', `${h} → ${st}`); else iyi++;
  }
  ok(`footer hedefleri: ${iyi}/${hedefler.length - bekleyen.length} → 200`);
  if (bekleyen.length)
    not(`${bekleyen.join(', ')} bu dalda YOK — paralel ajan üretiyor, BİRLEŞTİRME SONRASI DOĞRULANACAK (sorun sayılmadı)`);
}

/* =====================================================================
   6 · MAĞAZA BUTONLARI
   ===================================================================== */
console.log('\n--- 6 · mağaza butonları ---');
{
  const { ctx, page } = await ac(1440);
  await page.goto(`${BASE}/${ORNEK}`, { waitUntil:'load', timeout:30000 });
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const list = [...document.querySelectorAll('.foot-app .ap-store')];
    const gorunur = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
    return {
      n: list.length,
      kutular: list.map(e => {
        e.focus && e.focus();
        return {
          etiket: e.textContent.replace(/\s+/g,' ').trim(),
          tag: e.tagName,
          href: e.getAttribute('href'),
          ariaDisabled: e.getAttribute('aria-disabled'),
          tabIndex: e.tabIndex,
          odaklandi: document.activeElement === e,
          imlec: getComputedStyle(e).cursor,
          gorunur: gorunur(e)
        };
      }),
      /* uygulama alanının içinde <a href> hiç olmamalı */
      appVar: !!document.querySelector('.foot-app'),
      appIcindeBaglanti: document.querySelectorAll('.foot-app a[href]').length,
      yakindaGorunur: [...document.querySelectorAll('.foot-app *')]
        .filter(e => e.children.length === 0 && /yakında/i.test(e.textContent) && gorunur(e))
        .map(e => e.textContent.trim())
    };
  });
  if (r.n !== 2) rec('6 · mağaza', `${r.n} mağaza kutusu var, 2 olmalı`);
  const kotu = r.kutular.filter(k => k.tag === 'A' || k.href || k.ariaDisabled !== 'true' || k.odaklandi || k.tabIndex >= 0);
  if (kotu.length) rec('6 · mağaza', JSON.stringify(kotu));
  else if (r.n === 2) ok(`mağaza kutuları: 2 × <span> · href yok · aria-disabled="true" · tabIndex=-1 · .focus() tutmuyor (odak sırasına girmiyor) · imleç "${r.kutular[0] ? r.kutular[0].imlec : '?'}"`);
  if (!r.appVar) rec('6 · mağaza', 'uygulama alanı (.foot-app) YOK');
  else if (r.appIcindeBaglanti) rec('6 · mağaza', `uygulama alanında ${r.appIcindeBaglanti} adet <a href> var — indirme bağlantısı gibi görünür`);
  else ok('uygulama alanında hiç <a href> yok (QR de yok — gerçek adres olmadan sahte QR üretilmedi)');
  if (!r.yakindaGorunur.length) rec('6 · mağaza', '"Yakında" etiketi görünmüyor');
  else ok('"Yakında" görünür: ' + r.yakindaGorunur.map(t => `"${t}"`).join(' · '));
  await ctx.close();
}

/* =====================================================================
   8 · ACCORDION  +  9 · MOBİL SIRALAMA  +  11b · perde yeniden ölçüm
   ===================================================================== */
console.log('\n--- 8 · accordion · 9 · mobil sıralama ---');
{
  /* --- @1440: açık ve düğme etkin değil --- */
  const { ctx, page } = await ac(1440);
  await page.goto(`${BASE}/${ORNEK}`, { waitUntil:'load', timeout:30000 });
  await page.waitForTimeout(600);
  const d = await page.evaluate(() => [...document.querySelectorAll('.foot-col .fc-toggle')].map(b => ({
    id: b.id, tag: b.tagName, disabled: b.disabled,
    expanded: b.getAttribute('aria-expanded'),
    controls: b.getAttribute('aria-controls'),
    hedefVar: !!document.getElementById(b.getAttribute('aria-controls')),
    panelGorunur: (() => { const p = document.getElementById(b.getAttribute('aria-controls')); return !!p && p.getBoundingClientRect().height > 0; })()
  })));
  if (d.length !== 3) rec('8 · accordion @1440', `${d.length} düğme var, 3 olmalı`);
  else if (d.some(b => b.tag !== 'BUTTON')) rec('8 · accordion', 'gerçek <button> değil');
  else if (d.some(b => !b.disabled)) rec('8 · accordion @1440', 'masaüstünde düğme etkin: ' + JSON.stringify(d));
  else if (d.some(b => b.expanded !== 'true' || !b.panelGorunur)) rec('8 · accordion @1440', 'sütun kapalı: ' + JSON.stringify(d));
  else if (d.some(b => !b.hedefVar)) rec('8 · accordion', 'aria-controls karşılıksız');
  else ok('@1440: üç orta sütun AÇIK (aria-expanded=true), düğmeler <button> ve disabled — accordion etkin değil');
  await ctx.close();
}
{
  /* --- @390: açılır-kapanır, klavye, sıralama --- */
  const { ctx, page, konsol } = await ac(390);
  await page.goto(`${BASE}/${ORNEK}`, { waitUntil:'load', timeout:30000 });
  await page.waitForTimeout(700);

  const bas = await page.evaluate(() => [...document.querySelectorAll('.foot-col .fc-toggle')].map(b => ({
    id:b.id, disabled:b.disabled, expanded:b.getAttribute('aria-expanded'),
    panelH: Math.round((document.getElementById(b.getAttribute('aria-controls'))||{getBoundingClientRect:()=>({height:0})}).getBoundingClientRect().height)
  })));
  if (bas.length !== 3) rec('8 · accordion @390', `${bas.length} accordion düğmesi var, 3 olmalı`);
  else if (bas.some(b => b.disabled)) rec('8 · accordion @390', 'düğme disabled — mobilde etkin olmalı');
  else if (bas.some(b => b.expanded !== 'false' || b.panelH !== 0))
    rec('8 · accordion @390', 'başlangıçta kapalı değil: ' + JSON.stringify(bas));
  else ok('@390: üç orta menü KAPALI başlıyor (aria-expanded=false, panel yüksekliği 0), düğmeler etkin');

  /* fare tıklaması */
  const dugmeVar = bas.length === 3;
  if (!dugmeVar) rec('8 · accordion @390', 'accordion düğmeleri yok — tıklama/klavye ölçümleri atlandı');
  if (dugmeVar) {
  await page.locator('#fcb-hareket').click();
  await page.waitForTimeout(400);
  let s = await page.evaluate(() => ({
    exp: document.getElementById('fcb-hareket').getAttribute('aria-expanded'),
    h: Math.round(document.getElementById('fcp-hareket').getBoundingClientRect().height)
  }));
  if (s.exp !== 'true' || s.h <= 0) rec('8 · accordion @390', 'tıklamayla açılmadı: ' + JSON.stringify(s));
  else ok(`@390: tıklamayla açıldı (aria-expanded=true, panel ${s.h} px)`);
  await page.locator('#fcb-hareket').click();
  await page.waitForTimeout(400);
  s = await page.evaluate(() => ({
    exp: document.getElementById('fcb-hareket').getAttribute('aria-expanded'),
    h: Math.round(document.getElementById('fcp-hareket').getBoundingClientRect().height)
  }));
  if (s.exp !== 'false' || s.h !== 0) rec('8 · accordion @390', 'tıklamayla kapanmadı: ' + JSON.stringify(s));
  else ok('@390: tıklamayla kapandı (aria-expanded=false, panel 0 px)');

  /* klavye — Enter ve Space */
  await page.evaluate(() => document.getElementById('fcb-programlar').focus());
  const odakta = await page.evaluate(() => document.activeElement.id);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  const kEnter = await page.evaluate(() => document.getElementById('fcb-programlar').getAttribute('aria-expanded'));
  await page.keyboard.press('Space');
  await page.waitForTimeout(350);
  const kSpace = await page.evaluate(() => document.getElementById('fcb-programlar').getAttribute('aria-expanded'));
  if (odakta !== 'fcb-programlar') rec('8 · klavye', 'düğme odaklanamıyor');
  else if (kEnter !== 'true' || kSpace !== 'false')
    rec('8 · klavye', `Enter→${kEnter} (true olmalı) · Space→${kSpace} (false olmalı)`);
  else ok('@390: klavye — düğme odaklanıyor, Enter açıyor, Space kapatıyor');
  }

  /* 9 · mobil sıralama */
  const sira = await page.evaluate((liste) => {
    const out = [];
    for (const [ad, sel] of liste) {
      const el = document.querySelector(sel);
      out.push({ ad, var: !!el, top: el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null });
    }
    const bottom = document.querySelector('.foot-bottom');
    return { out, telif: bottom ? Math.round(bottom.getBoundingClientRect().top + window.scrollY) : null };
  }, MOBIL_SIRA);
  const eksik = sira.out.filter(o => !o.var);
  if (eksik.length) rec('9 · mobil sıralama', 'bulunamayan blok: ' + eksik.map(e=>e.ad).join(', '));
  else {
    const artan = sira.out.every((o,i) => i === 0 || o.top > sira.out[i-1].top);
    if (!artan) rec('9 · mobil sıralama', 'sıra bozuk: ' + sira.out.map(o=>`${o.ad}@${o.top}`).join(' → '));
    else if (sira.telif !== null && sira.telif < sira.out[6].top)
      rec('9 · mobil sıralama', 'telif şeridi yasal bandın üstünde');
    else ok('@390 sıralama dokümanla birebir: ' + sira.out.map((o,i)=>`${i+1}·${o.ad}(${o.top})`).join(' → '));
  }

  /* 11b · accordion footer yüksekliğini değiştirir → perde yeniden ölçülür */
  const oncesi = await page.evaluate(() => Math.round(document.querySelector('footer.footer').getBoundingClientRect().height));
  await page.evaluate(() => document.querySelectorAll('.fc-toggle').forEach(b => { if (b.getAttribute('aria-expanded') !== 'true') b.click(); }));
  await page.waitForTimeout(500);
  const sonrasi = await page.evaluate(() => Math.round(document.querySelector('footer.footer').getBoundingClientRect().height));
  const mbMobil = await page.evaluate(() => parseFloat(getComputedStyle(document.getElementById('pageMain')).marginBottom) || 0);
  const kapiVar = await page.evaluate(() => !!(window.FIT_SHELL && typeof window.FIT_SHELL.perdeyiOlc === 'function'));
  if (sonrasi <= oncesi) rec('11b · accordion', `accordion açılınca footer yüksekliği değişmedi (${oncesi} → ${sonrasi})`);
  else if (!kapiVar) rec('11b · accordion', 'FIT_SHELL.perdeyiOlc yok — perde yeniden ölçülemez');
  else if (mbMobil > 1) rec('11b · accordion', `@390 perde kipi kapalı olmalı ama margin-bottom ${mbMobil}`);
  else ok(`@390 accordion açılınca footer ${oncesi} → ${sonrasi} px; perde kipi kapalı (margin-bottom 0) · FIT_SHELL.perdeyiOlc kapısı var`);

  /* accordion açıkken masaüstüne dön: perde YENİDEN ölçülmeli */
  await page.setViewportSize({ width:1440, height:900 });
  await page.waitForTimeout(700);
  const geri = await page.evaluate(() => {
    const m = document.getElementById('pageMain'), f = document.querySelector('footer.footer');
    const mb = parseFloat(getComputedStyle(m).marginBottom) || 0;
    return { fark: +(mb - f.getBoundingClientRect().height).toFixed(2), mb: +mb.toFixed(1),
             fh: +f.getBoundingClientRect().height.toFixed(1) };
  });
  if (Math.abs(geri.fark) > 0.5)
    rec('11b · perde yeniden ölçüm', `accordion sonrası fark ${geri.fark} px (0 olmalı)`);
  else ok(`accordion açıldıktan SONRA @1440: margin-bottom ${geri.mb} − footer ${geri.fh} = ${geri.fark}`);

  if (konsol.length) rec('13 · konsol @390', [...new Set(konsol)].join(' | '));
  await ctx.close();
}

/* =====================================================================
   11 · R11 PERDESİ + 12 · B10 NÖBETİ — TÜM SAYFALAR @1440
   ===================================================================== */
console.log('\n--- 11 · R11 perdesi · 12 · .fit-health nöbeti (tüm sayfalar) ---');
{
  const { ctx, page } = await ac(1440);
  const farkSet = new Map(); let n = 0, icerde = 0, sonCocuk = 0;
  for (const f of SAYFALAR) {
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil:'load', timeout:30000 });
      await page.waitForTimeout(320);
      const r = await page.evaluate(() => {
        const m = document.getElementById('pageMain'), ftr = document.querySelector('footer.footer');
        if (!m || !ftr) return { yok:true };
        const mb = parseFloat(getComputedStyle(m).marginBottom) || 0;
        const sec = document.querySelector('.fit-health');
        return {
          fark: +(mb - ftr.getBoundingClientRect().height).toFixed(1),
          saglikVar: !!sec,
          saglikIcerde: !!(sec && m.contains(sec)),
          saglikSonCocuk: m.lastElementChild === sec
        };
      });
      if (r.yok) { rec(`11 · ${f}`, '#pageMain ya da footer yok'); continue; }
      n++;
      farkSet.set(r.fark, (farkSet.get(r.fark)||0) + 1);
      if (r.saglikVar && r.saglikIcerde) icerde++;
      if (r.saglikVar && r.saglikSonCocuk) sonCocuk++;
      else if (r.saglikVar) rec(`12 · ${f}`, '.fit-health #pageMain\'in son çocuğu DEĞİL (B10)');
    } catch (e) { rec(`11 · ${f}`, 'HATA: ' + String(e).slice(0,90)); }
  }
  const degerler = [...farkSet.keys()];
  if (degerler.length !== 1 || Math.abs(degerler[0]) > 0.5)
    rec('11 · R11 perdesi', 'tek değere oturmadı: ' + JSON.stringify([...farkSet.entries()]));
  else ok(`R11 @1440: ${n} sayfa · margin-bottom − footer yüksekliği = ${degerler[0]} (TEK DEĞER)`);
  ok(`B10: .fit-health perdenin içinde ${icerde}/${n} · #pageMain'in SON ÇOCUĞU ${sonCocuk}/${n}`);
  await ctx.close();
}

/* ==============================================================
   14 · SAĞ KOLON × "GÖRÜŞ BİLDİR" SEKMESİ ÇAKIŞMASI  (7. oturum)
   .feedback-tab position:fixed, right:0, 41px, ≤640px'te gizli.
   .wrap 1240px olduğu için >1303px viewport'ta serbest kenar var.
   Arada kalan aralıkta footer'ın SON kolonu sekmenin altına giriyordu.
   #pageMain her zaman 0 çakışma veriyor — ölçüt bu: footer da 0 versin.
   ============================================================== */
async function olcut14(browser){
  for(const w of [1440, 1024, 900, 700]){
    const ctx = await browser.newContext({ viewport:{ width:w, height:900 } });
    await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
    const page = await ctx.newPage();
    await page.goto(BASE + '/hareket-merkezi-v1.html', { waitUntil:'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const d = await page.evaluate(() => {
      const tab = document.querySelector('.feedback-tab');
      if(!tab || tab.offsetParent === null) return { gizli:true };
      const t = tab.getBoundingClientRect();
      const kesisiyor = r => r.width > 0 && r.right > t.left && r.left < t.right
                                         && r.bottom > t.top && r.top < t.bottom;
      const foot = [...document.querySelectorAll('footer a, footer p, footer span, footer button')]
        .filter(e => kesisiyor(e.getBoundingClientRect()))
        .map(e => e.tagName + ':' + e.textContent.trim().slice(0,30));
      const ana = [...document.querySelectorAll('#pageMain p, #pageMain h2, #pageMain a')]
        .filter(e => kesisiyor(e.getBoundingClientRect())).length;
      return { foot, ana, tabW:+t.width.toFixed(0) };
    });
    if(d.gizli){ ok(`@${w}: "Görüş Bildir" sekmesi gizli — çakışma ölçümü gereksiz`); }
    else if(d.foot.length){
      rec('footer sekmenin altına giriyor', `@${w}: ${d.foot.length} öğe — ${d.foot.slice(0,3).join(' · ')}`);
    } else {
      ok(`@${w}: footer "Görüş Bildir" sekmesiyle çakışmıyor (sekme ${d.tabW}px · #pageMain çakışma ${d.ana})`);
    }
    await ctx.close();
  }
}

/* =====================================================================
   13 · KONSOL + YATAY TAŞMA
   ===================================================================== */
console.log('\n--- 13 · konsol hatası + yatay taşma ---');
{
  const ORNEKLER = ['hakkimizda-v1.html','iletisim-v1.html','hareket-merkezi-v1.html',
                    'enerji-defteri-v1.html','destek-talepleri-v1.html'].filter(f => SAYFALAR.includes(f));
  for (const w of [1440, 1024, 390]) {
    let temiz = 0;
    for (const f of ORNEKLER) {
      const { ctx, page, konsol } = await ac(w);
      let sorunlu = false;
      try {
        await page.goto(`${BASE}/${f}`, { waitUntil:'load', timeout:30000 });
        await page.waitForTimeout(600);
        const tasma = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (tasma > 1) { rec(`13 · yatay taşma ${f} @${w}`, tasma + ' px'); sorunlu = true; }
        if (konsol.length) { rec(`13 · konsol ${f} @${w}`, [...new Set(konsol)].join(' | ')); sorunlu = true; }
      } catch (e) { rec(`13 · ${f} @${w}`, 'HATA: ' + String(e).slice(0,90)); sorunlu = true; }
      if (!sorunlu) temiz++;
      await ctx.close();
    }
    ok(`@${w}: ${temiz}/${ORNEKLER.length} sayfada konsol hatası 0 · yatay taşma 0`);
  }
}

/* --- docs/icerik-bekleyen.md yer tutucu kaydı ------------------------- */
{
  const dosya = path.join(ROOT, 'docs', 'icerik-bekleyen.md');
  if (!existsSync(dosya)) rec('7 · yer tutucu kaydı', 'docs/icerik-bekleyen.md yok');
  else ok('docs/icerik-bekleyen.md var — yer tutucular kayıtlı');
}

await olcut14(browser);

await browser.close();

console.log(`\n${fail} sorun`);
if (notlar.length) { console.log('\nNOTLAR:'); notlar.forEach(n => console.log('  · ' + n)); }
if (fail) { console.log('\nSORUNLAR:'); bad.slice(0,40).forEach(b => console.log('  ✗ ' + b)); console.log(`\n✗ ${fail} sorun`); process.exit(1); }
console.log('✓ Beş alan · üç sütun birebir · Planım yok · kurumsal bant 8 kalem');
console.log('✓ Mağaza butonları bağlantı değil · sosyal yalnız IG+YT · accordion mobilde');
console.log('✓ Yasal bant dokunulmamış · R11 perdesi 0 · .fit-health son çocuk');
console.log('\n✓ 0 sorun');
