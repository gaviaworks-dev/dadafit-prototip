/* =====================================================================
   DADAFIT — KABUK KALİTE TESTİ  (S1 · S2 · S4 + antrenör eşleştirme kapısı)
   ---------------------------------------------------------------------
   Beyar'ın 8. oturumda cevapladığı üç açık soruyu ve antrenör dizinine
   geri konan eşleştirme kapısını nöbette tutar.

   S1 — KART PRO ROZETLERİ KALKTI
     Beyar: "Kart PRO rozetleri kalksın. Süzemediğin bir farkı göstermek
     kullanıcıyı sadece rahatsız ediyor. Filtre ekseni geri gelmesin."
     · site genelinde `.hub-card` (ve kart muadilleri) içinde `.hub-pro` = 0
     · "Erişim" adında bir filtre ekseni HİÇBİR sayfada yok
     · Pro'nun KENDİ tanıtımı sağlam: pro-v1 · pro-odeme-v1 ·
       uyelik-faturalandirma-v1 → 200, ve bu sayfalara giden bağlantılar
       hâlâ duruyor (footer/menü/gövde)
     NOT (tarihsel): `video-seans-detay-v1`'in oynatıcı posterindeki `#vsdProBadge`
     — sayfa 2026-08-29'da modülüyle birlikte kalktı.
     KASTEN sayılmaz — o bir KART rozeti değil, seansın kendi sayfasındaki
     erişim işareti. Test onun kart bağlamında olmadığını doğrular.

   S2 — "140+ HAREKET" GERÇEĞE ÇEKİLDİ
     Beyar: "Gerçeğe çek. H3 bu havuzla plan ürettiği için artık dürüstlük
     meselesi." Gerçek sayı 25 (kanonik katalog).
     · site genelinde "140+" dizesi = 0 (HTML + JS + CSS, DOM metninde de)
     · sayıyı taşıyan yerler 25 yazıyor ve "+" ile şişirilmemiş

   S4 — .btn-fit KONTRASTI AA'YA ÇIKTI
     Beyar: "Evet, site geneli .btn-fit --fit-deep olsun. AA altında kalmasın."
     · test kontrast oranını KENDİ HESAPLAR (WCAG 2.1 göreli parlaklık,
       (L1+0.05)/(L2+0.05)) — sabit bir sayıya güvenmez
     · hesaplanmış background-color ↔ color oranı ≥ 4.5:1
     · hover normal durumdan AYIRT EDİLEBİLİR (iki zemin farklı ve
       aralarındaki oran eski normal↔hover ayrımından (1.54:1) düşük değil)
     · :focus-visible halkası görünür ve zeminiyle ≥ 3:1 (WCAG 1.4.11)

   ANTRENÖR EŞLEŞTİRME KAPISI
     Beyar: "antrenorler-v1 banner'ı: oraya antrenör eşleştirmeye giden bir
     kapı geri gelsin. Program CTA'sı dizin sayfasında yanlış duruyor."
     · banner'ın birincil CTA'sı PROGRAM sayfasına GİTMİYOR
     · tıklanınca dizinin KENDİ filtre paneli (#libFilters) erişilebilir
       hâle geliyor (dar ekranda çekmece açılıyor, geniş ekranda panel
       görünür alana geliyor) ve odak ilk facet'e taşınıyor
     · İKİNCİ MOTOR YOK: tıklamadan önce ve sonra görünür kart sayısı ile
       sayfalama durumu DEĞİŞMİYOR (A4'ün ölçülmüş çakışması buydu)
     · "Antrenör Ol" ghost düğmesi duruyor
     · banner LİSTE ailesi 544/607/587 · kırpılan öğe 0
     · B11: CTA'nın DOM'daki ebeveyni doğrulanıyor (dosyada değil) —
       kabuktaki `.fit-band-panel` geri taşıyıcısı banner'ı bozmuş olamaz

   K43 — ESKİ HAREKET ADI KALINTISI (8. oturum, katalog 25'e çıkınca)
     Katalogda `goblet-squat` artık "Goblet Squat" (ekipmanlı); ekipmansız
     olanın adı "Hava Squat (Bodyweight Squat)" (slug `hava-squat`).
     Eski birleşik ad "Squat (Çömelme)" ad birliğini bozuyor.
     · BU AJANIN dosyalarında "Squat (Çömelme)" dizesi = 0
     Kapsam bilinçli olarak dar: kalan kopyalar (`program-detay-v1` ·
     `arama-fit-v1` · `egzersiz-kutuphane-v1` · `antrenman-olusturucu-v1` ·
     `anatomi-veri.js`) paralel ajanların alanı — burada nöbet tutulmaz,
     yoksa başkasının branch'i bu sınamayı haksız yere kırmızıya çevirir.

   5 — konsol hatası 0 · yatay taşma 0, dokunulan her sayfada @1440 ve @390

   Çalıştırma:
     python3 -m http.server 8843 &
     export PW_HOME=~/.pw
     node tests/kabuk-kalite.mjs                        # varsayılan 8843
     node tests/kabuk-kalite.mjs http://localhost:8846  # K27 taban koşusu
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:8843';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SAYFALAR = readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const DOKUNULAN = [
  'programlar-merkezi-v1.html', 'dadafit-hub-v1.html',
  'giris-v1.html', 'antrenorler-v1.html',   /* R8/4: hareket-merkezi-v1 kaldırıldı */
  'hakkimizda-v1.html', 'pro-v1.html'
].filter(f => SAYFALAR.includes(f));

/* Bu ajanın yazma yetkisi olan dosyalar — K43 nöbeti yalnız bunları tarar. */
const BENIM_DOSYALARIM = [
  'assets/css/fit-shell.css', 'assets/js/fit-shell.js',
  'programlar-merkezi-v1.html', 'dadafit-hub-v1.html',
  'giris-v1.html', 'antrenorler-v1.html',   /* R8/4: hareket-merkezi-v1 kaldırıldı */
  'hakkimizda-v1.html'
];
const ESKI_AD = 'Squat (Çömelme)';

const DIZIN   = 'antrenorler-v1.html';
const GERCEK  = 25;                       /* kanonik hareket sayısı */
const BANNER  = { 1440: 544, 1024: 607, 390: 587 };   /* LİSTE ailesi — DEVIR-5 §2a */
const AYRIM_ESIGI = 1.5;   /* eski normal↔hover ayrımı 1.54:1 idi; altına düşmesin */

let fail = 0; const bad = []; const notlar = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);
const not = (m) => { notlar.push(m); console.log('  · ' + m); };

/* ---------------------------------------------------------------------
   WCAG 2.1 kontrast — test SAYIYI KENDİ HESAPLAR, sabite güvenmez.
   Göreli parlaklık:  L = 0.2126R + 0.7152G + 0.0722B  (lineerleştirilmiş)
   Oran:              (L_açık + 0.05) / (L_koyu + 0.05)
   --------------------------------------------------------------------- */
const kanal = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
function rgb(s) {
  const m = String(s).match(/-?[\d.]+/g);
  if (!m || m.length < 3) return null;
  return [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1];
}
const parlaklik = ([r, g, b]) => 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
function kontrast(a, b) {
  const A = rgb(a), B = rgb(b);
  if (!A || !B) return null;
  const l1 = parlaklik(A), l2 = parlaklik(B);
  return +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
}

const browser = await chromium.launch();
async function ac(width) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 } });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console', m => { if (m.type() === 'error') konsol.push(m.text().slice(0, 120)); });
  page.on('pageerror', e => konsol.push('pageerror: ' + String(e).slice(0, 120)));
  return { ctx, page, konsol };
}

console.log(`\n=== KABUK KALİTE · ${BASE} ===\n`);

/* =====================================================================
   1 · S1 — KART PRO ROZETLERİ
   ===================================================================== */
console.log('--- S1 · kart PRO rozetleri ---');
{
  const { ctx, page } = await ac(1440);
  const rozetli = [], eksenli = [], detaySayfaRozeti = [];

  for (const f of SAYFALAR) {
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(180);
      const r = await page.evaluate(() => {
        const KART = '.hub-card,.ex-card,.coach-card,.pr-card,.fs-card,.prog-card,.vs-card,.cc-card,.sz-row';
        const rozetler = [...document.querySelectorAll('.hub-pro')];
        const kartUstu = rozetler.filter(e => e.closest(KART));
        const kartDisi = rozetler.filter(e => !e.closest(KART))
          .map(e => (e.id || e.className) + ' → ' + (e.parentElement ? e.parentElement.className : '?'));
        /* "Erişim" filtre ekseni: data-group ya da facet başlığı */
        const eksen = [];
        document.querySelectorAll('.fgroup[data-group]').forEach(g => {
          if (/erisim|erişim|access/i.test(g.getAttribute('data-group'))) eksen.push('data-group=' + g.getAttribute('data-group'));
        });
        document.querySelectorAll('.fct-head,.fgroup .lbl').forEach(h => {
          if (/^\s*eri[sş]im\b/i.test(h.textContent || '')) eksen.push('facet başlığı: ' + h.textContent.trim().slice(0, 30));
        });
        return { kartUstu: kartUstu.length, kartDisi, eksen };
      });
      if (r.kartUstu) rozetli.push(`${f}: ${r.kartUstu}`);
      if (r.eksen.length) eksenli.push(`${f}: ${r.eksen.join(' · ')}`);
      if (r.kartDisi.length) detaySayfaRozeti.push(`${f}: ${r.kartDisi.join(' · ')}`);
    } catch (e) { rec(`S1 ${f}`, 'HATA: ' + String(e).slice(0, 90)); }
  }
  await ctx.close();

  if (rozetli.length) rec('S1 · kart PRO rozeti', `${rozetli.length} sayfada rozet duruyor → ${rozetli.join(' | ')}`);
  else ok(`site genelinde kart üzerinde PRO rozeti 0 (${SAYFALAR.length} sayfa tarandı)`);

  if (eksenli.length) rec('S1 · "Erişim" filtre ekseni', eksenli.join(' | '));
  else ok('"Erişim" filtre ekseni hiçbir sayfada yok');

  if (detaySayfaRozeti.length) not(`kart DIŞI .hub-pro (kasten bırakılan, detay sayfası işareti): ${detaySayfaRozeti.join(' | ')}`);
  else not('kart dışı .hub-pro da yok');
}

/* Pro'nun kendi sayfası ve tanıtımı sağlam mı */
{
  const proSayfalar = ['pro-v1.html', 'pro-odeme-v1.html', 'uyelik-faturalandirma-v1.html'];
  const kirik = [];
  for (const f of proSayfalar) {
    let st = 0;
    try { st = (await fetch(`${BASE}/${f}`)).status; } catch { st = 0; }
    if (st !== 200) kirik.push(`${f} → HTTP ${st || 'bağlanılamadı'}`);
  }
  if (kirik.length) rec('S1 · Pro sayfaları', kirik.join(' | '));
  else ok('pro-v1 · pro-odeme-v1 · uyelik-faturalandirma-v1 → 200');

  const { ctx, page } = await ac(1440);
  await page.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const bag = await page.evaluate(() => ({
    pro: document.querySelectorAll('a[href*="pro-v1.html"]').length,
    uyelik: document.querySelectorAll('a[href*="uyelik-faturalandirma"]').length
  }));
  await ctx.close();
  if (bag.pro < 1) rec('S1 · Pro bağlantısı', 'ana sayfada pro-v1.html bağlantısı kalmamış');
  else ok(`Pro tanıtımına giden bağlantılar duruyor (ana sayfada pro-v1 × ${bag.pro}, üyelik × ${bag.uyelik})`);
}

/* =====================================================================
   2 · S2 — "140+" GERÇEĞE ÇEKİLDİ
   ===================================================================== */
console.log('\n--- S2 · hareket sayısı ---');
{
  /* 2a — kaynak dosyalarda dize taraması */
  const kaynak = [];
  const gez = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { gez(p); continue; }
      if (!/\.(html|js|css|mjs)$/.test(e.name)) continue;
      if (p.includes(path.join('tests', 'kabuk-kalite.mjs'))) continue;   /* testin kendisi */
      const s = readFileSync(p, 'utf8');
      if (s.includes('140+')) {
        const satir = s.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => l.includes('140+'));
        kaynak.push(`${path.relative(ROOT, p)}:${satir.map(([n]) => n).join(',')}`);
      }
    }
  };
  gez(ROOT);
  if (kaynak.length) rec('S2 · "140+" kaynakta', `${kaynak.length} dosyada → ${kaynak.join(' | ')}`);
  else ok('kaynak dosyalarda "140+" dizesi 0 (html · js · css · mjs)');

  /* 2b — DOM'da render edilen metinde (kabuk JS'i üst bandı sonradan basıyor) */
  const { ctx, page } = await ac(1440);
  const domda = [];
  for (const f of SAYFALAR) {
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(160);
      const v = await page.evaluate(() => (document.body.innerText || '').includes('140+'));
      if (v) domda.push(f);
    } catch { /* 5. ölçütte ayrıca yakalanır */ }
  }
  if (domda.length) rec('S2 · "140+" DOM metninde', domda.join(' | '));
  else ok(`render edilen metinde "140+" 0 (${SAYFALAR.length} sayfa)`);

  /* 2c — gerçek sayı doğru yazılmış mı: kabuk üst bandı */
  await page.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const bant = await page.evaluate(() => {
    const a = document.querySelector('.topbar .tb-left a[href*="egzersiz-kutuphane"]');
    return a ? a.textContent.replace(/\s+/g, ' ').trim() : null;
  });
  await ctx.close();
  if (!bant) rec('S2 · kabuk üst bandı', 'kütüphane bağlantısı bulunamadı');
  else if (!new RegExp(`(^|\\D)${GERCEK}(\\D|$)`).test(bant) || /\d\s*\+/.test(bant))
    rec('S2 · kabuk üst bandı', `"${bant}" — beklenen ${GERCEK}, "+" ile şişirilmemiş`);
  else ok(`kabuk üst bandı: "${bant}" — gerçek sayı, "+" yok`);
}

/* =====================================================================
   2b · K43 — ESKİ HAREKET ADI KALINTISI (yalnız bu ajanın dosyaları)
   ===================================================================== */
console.log('\n--- K43 · eski hareket adı kalıntısı ---');
{
  const kalinti = [];
  for (const rel of BENIM_DOSYALARIM) {
    const abs = path.join(ROOT, rel);
    let src; try { src = readFileSync(abs, 'utf8'); } catch { continue; }
    if (!src.includes(ESKI_AD)) continue;
    const n = src.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => l.includes(ESKI_AD)).map(([i]) => i);
    kalinti.push(`${rel}:${n.join(',')}`);
  }
  if (kalinti.length) rec('K43 · eski hareket adı', `"${ESKI_AD}" bu ajanın dosyalarında duruyor → ${kalinti.join(' | ')}`);
  else ok(`"${ESKI_AD}" bu ajanın ${BENIM_DOSYALARIM.length} dosyasında 0 — ad birliği K43 ile uyumlu`);

  /* kapsam dışı kopyalar sayılıp NOT olarak raporlanır, kırmızıya döndürmez */
  const disarida = [];
  for (const f of readdirSync(ROOT)) {
    if (!/\.(html|js)$/.test(f) || BENIM_DOSYALARIM.includes(f)) continue;
    try { if (readFileSync(path.join(ROOT, f), 'utf8').includes(ESKI_AD)) disarida.push(f); } catch { /* atla */ }
  }
  not(disarida.length
    ? `kapsam dışı (paralel ajanların dosyaları, kırmızıya döndürmez): ${disarida.join(' · ')}`
    : 'kapsam dışında da eski ad kalmamış');
}

/* =====================================================================
   3 · S4 — .btn-fit KONTRASTI
   ===================================================================== */
console.log('\n--- S4 · .btn-fit kontrastı (oranlar bu testte hesaplanıyor) ---');
{
  /* .btn-fit üç ayrı bağlamda ölçülüyor: koyu banner üstü · beyaz kart içi ·
     koyu CTA bloğu. Kaybolduğu yer var mı, zeminle farkı da ölçülüyor. */
  const baglamlar = [
    ['koyu banner üstü',      `${BASE}/${DIZIN}`, '.lib-top .btn-fit'],
    ['beyaz kart içi',        `${BASE}/dadafit-hub-v1.html`, '.df-chal-main .btn-fit'],
    ['yeşil yıkama kart içi', `${BASE}/dadafit-hub-v1.html`, '.df-coach-join .btn-fit'],
    ['koyu CTA bloğu',        `${BASE}/${DIZIN}`, '.coach-join .btn-fit'],
    ['Pro kapısı (kabuğun kendi bastığı .btn-fit)', `${BASE}/pro-v1.html`, '.pg-acts .btn-fit']
  ];
  const { ctx, page } = await ac(1440);
  let olculen = 0;

  for (const [ad, url, sec] of baglamlar) {
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const r = await page.evaluate(s => {
      const el = document.querySelector(s);
      if (!el) return null;
      const c = getComputedStyle(el);
      /* Düğmenin arkasındaki ilk saydam-olmayan zemin.
         DİKKAT: gradyan/görsel zeminlerde backgroundColor saydam kalır —
         onları "beyaz" saymak yanlış ölçüm üretir, null döndürüp atlıyoruz. */
      let p = el.parentElement, zemin = 'rgb(255, 255, 255)';
      while (p) {
        const cs = getComputedStyle(p);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') { zemin = null; break; }
        const m = cs.backgroundColor.match(/-?[\d.]+/g);
        if (m && (m.length < 4 || +m[3] > 0.9)) { zemin = cs.backgroundColor; break; }
        p = p.parentElement;
      }
      return { bg: c.backgroundColor, fg: c.color, zemin, gorunur: el.getBoundingClientRect().height > 0 };
    }, sec);

    if (!r) { not(`${ad}: "${sec}" bu sayfada yok — atlandı`); continue; }
    olculen++;
    const o = kontrast(r.bg, r.fg);
    const oz = r.zemin ? kontrast(r.bg, r.zemin) : null;
    if (o === null) { rec('S4 · ' + ad, `renk okunamadı (${r.bg} / ${r.fg})`); continue; }
    if (o < 4.5) rec('S4 · ' + ad, `metin kontrastı ${o}:1 — AA eşiği 4.5:1 (zemin ${r.bg}, metin ${r.fg})`);
    else ok(`${ad}: ${r.bg} + ${r.fg} → ${o}:1 (AA ✓) · düğme↔sayfa zemini ` +
            (oz === null ? 'ölçülmedi (gradyan/görsel zemin)' : oz + ':1'));
    if (!r.gorunur) not(`${ad}: düğme şu anda gizli (Pro kapısı gibi durum bazlı katmanlar) — renk yine de ölçüldü`);
    if (oz !== null && oz < 1.3) rec('S4 · ' + ad, `düğme zemine karışıyor: düğme↔zemin ${oz}:1`);
  }
  if (!olculen) rec('S4', 'hiçbir bağlamda .btn-fit ölçülemedi');
  {
    const { ctx: fc, page: fp } = await ac(1440);
    await fp.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil: 'load' });
    await fp.waitForTimeout(600);
    const n = await fp.evaluate(() => document.querySelectorAll('.footer .btn-fit').length);
    await fc.close();
    not(`footer bağlamı: footer içinde .btn-fit sayısı ${n}` + (n ? '' : ' — ölçülecek örnek yok'));
  }

  /* hover ayrımı */
  await page.goto(`${BASE}/${DIZIN}`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const btn = page.locator('.lib-top .btn-fit').first();
  const normal = await btn.evaluate(e => getComputedStyle(e).backgroundColor);
  await btn.hover();
  await page.waitForTimeout(350);
  const hover = await btn.evaluate(e => getComputedStyle(e).backgroundColor);
  const hoverMetin = await btn.evaluate(e => getComputedStyle(e).color);
  const ayrim = kontrast(normal, hover);
  if (normal === hover) rec('S4 · hover', `hover normal ile AYNI zemin (${normal}) — ayrım kayboldu`);
  else if (ayrim !== null && ayrim < AYRIM_ESIGI)
    rec('S4 · hover', `hover ayrımı ${ayrim}:1 — eşik ${AYRIM_ESIGI}:1 (normal ${normal}, hover ${hover})`);
  else ok(`hover ayırt edilebilir: ${normal} → ${hover}, aralarındaki oran ${ayrim}:1`);

  const hoverK = kontrast(hover, hoverMetin);
  if (hoverK !== null && hoverK < 4.5) rec('S4 · hover kontrastı', `${hoverK}:1 — AA eşiği 4.5:1`);
  else ok(`hover durumu da AA: ${hover} + ${hoverMetin} → ${hoverK}:1`);

  /* :focus-visible halkası — görünür ve zeminiyle ≥3:1 (WCAG 1.4.11).
     İKİ zeminde ölçülür: koyu banner üstünde halka beyaza dönüyor
     (.lib-top a:focus-visible kuralı), beyaz zeminde --fit yeşili kalıyor. */
  for (const [ad, url, sec] of [
    ['koyu banner üstü', `${BASE}/${DIZIN}`, '.lib-top .btn-fit'],
    ['açık zemin',       `${BASE}/dadafit-hub-v1.html`, '.df-coach-join .btn-fit']
  ]) {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  /* ÖNCE odakla, SONRA oku: düğmede geçiş var, aynı evaluate içinde okunursa
     ara kare yakalanıyor (outline-color henüz currentColor'da kalıyor). */
  const varMi = await page.evaluate(sl => { const el = document.querySelector(sl); if (!el) return false; el.scrollIntoView({ block: 'center' }); el.focus(); return true; }, sec);
  await page.waitForTimeout(400);
  const odak = !varMi ? null : await page.evaluate(sl => {
    const el = document.querySelector(sl);
    if (!el) return null;
    const c = getComputedStyle(el);
    let p = el.parentElement, zemin = 'rgb(255, 255, 255)';
    while (p) {
      const cs = getComputedStyle(p);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') { zemin = null; break; }
      const m = cs.backgroundColor.match(/-?[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > 0.9)) { zemin = cs.backgroundColor; break; }
      p = p.parentElement;
    }
    return { fv: el.matches(':focus-visible'), w: parseFloat(c.outlineWidth), stil: c.outlineStyle, renk: c.outlineColor, ofs: c.outlineOffset, zemin, dugme: c.backgroundColor };
  }, sec);
  if (!odak) rec('S4 · odak halkası', `${ad}: "${sec}" bulunamadı`);
  else {
    const hz = odak.zemin ? kontrast(odak.renk, odak.zemin) : null;
    if (!odak.fv) rec('S4 · odak halkası', `${ad}: öğe :focus-visible almıyor — halka hiç çizilmiyor`);
    else if (!(odak.w >= 2) || odak.stil === 'none') rec('S4 · odak halkası', `${ad}: görünür değil: ${odak.w}px ${odak.stil}`);
    else if (hz !== null && hz < 3) rec('S4 · odak halkası', `${ad}: halka ↔ zemin ${hz}:1 — WCAG 1.4.11 eşiği 3:1 (halka ${odak.renk}, zemin ${odak.zemin})`);
    else ok(`odak halkası (${ad}): ${odak.w}px ${odak.stil} ${odak.renk}, ofset ${odak.ofs} · halka↔zemin ` +
            (hz === null ? 'ölçülmedi (gradyan/görsel zemin)' : hz + ':1 (≥3:1 ✓)'));
  }
  }
  await ctx.close();
}

/* =====================================================================
   4 · ANTRENÖR EŞLEŞTİRME KAPISI
   ===================================================================== */
console.log('\n--- Antrenör dizini · eşleştirme kapısı ---');
{
  for (const w of [1440, 390]) {
    const { ctx, page, konsol } = await ac(w);
    await page.goto(`${BASE}/${DIZIN}`, { waitUntil: 'load' });
    await page.waitForTimeout(700);

    /* --- önce: banner içeriği + DOM ebeveyn doğrulaması (B11) --- */
    const once = await page.evaluate(() => {
      const band = document.querySelector('.lib-top');
      const cta = band ? band.querySelector('.btn-fit') : null;
      const ghost = band ? [...band.querySelectorAll('a')].find(a => /antren[oö]r ol/i.test(a.textContent)) : null;
      const progLink = band ? [...band.querySelectorAll('a[href]')]
        .filter(a => /programini-bul|program-liste|programlar-merkezi|program-detay/.test(a.getAttribute('href') || ''))
        .map(a => a.getAttribute('href')) : [];
      /* kırpılan öğe: banner'ın görünür kutusunu taşan torun */
      let kirpik = 0;
      if (band) {
        const b = band.getBoundingClientRect();
        band.querySelectorAll('*').forEach(e => {
          const r = e.getBoundingClientRect();
          if (r.height === 0 && r.width === 0) return;
          if (r.bottom > b.bottom + 1 || r.top < b.top - 1) kirpik++;
        });
      }
      const kart = () => [...document.querySelectorAll('.coach-card')].filter(e => e.offsetParent !== null).length;
      const sayfaNo = (document.querySelector('.pg-num.on,.pager .on,[data-sayfa].on') || {}).textContent || null;
      return {
        bannerH: band ? Math.round(band.getBoundingClientRect().height) : -1,
        aile: document.body.getAttribute('data-fit-hero-kind'),
        ctaId: cta ? cta.id : null,
        ctaHref: cta ? cta.getAttribute('href') : null,
        ctaMetin: cta ? cta.textContent.replace(/\s+/g, ' ').trim() : null,
        ctaEbeveyn: cta ? cta.parentElement.className : null,
        ctaBannerIcinde: !!(cta && band.contains(cta)),
        ghostVar: !!ghost, ghostHref: ghost ? ghost.getAttribute('href') : null,
        progLink, kirpik, kartSayisi: kart(), sayfaNo,
        sayac: (document.getElementById('libCount') || {}).textContent || null
      };
    });

    const tag = `antrenör kapısı @${w}`;

    /* banner ailesi */
    if (once.bannerH !== BANNER[w]) rec(tag, `banner ${once.bannerH} px — LİSTE ailesi ${BANNER[w]} px olmalı`);
    if (once.aile !== 'liste') rec(tag, `aile "${once.aile}" — "liste" olmalı`);
    if (once.kirpik) rec(tag, `banner'da kırpılan öğe ${once.kirpik} (0 olmalı)`);

    /* B11 — DOM ebeveyni */
    if (!once.ctaBannerIcinde) rec(tag, 'birincil CTA DOM\'da banner\'ın içinde DEĞİL (B11: kabuk paneli taşımış olabilir)');
    if (once.ctaEbeveyn && !/chips|lib-cta/.test(once.ctaEbeveyn))
      rec(tag, `CTA'nın DOM ebeveyni beklenmedik: "${once.ctaEbeveyn}"`);

    /* program CTA'sı banner'dan çıktı mı */
    if (once.progLink.length) rec(tag, `banner hâlâ PROGRAM sayfasına bağlanıyor: ${once.progLink.join(', ')}`);
    if (once.ctaHref && /programini-bul|program-/.test(once.ctaHref))
      rec(tag, `birincil CTA program sayfasına gidiyor: ${once.ctaHref} ("${once.ctaMetin}")`);

    /* "Antrenör Ol" duruyor mu */
    if (!once.ghostVar) rec(tag, '"Antrenör Ol" ghost düğmesi banner\'da yok');

    /* --- CTA tıklaması: filtre paneli erişilebilir hâle geliyor mu --- */
    let sonra = null;
    if (once.ctaMetin !== null) {
      await page.locator('.lib-top .btn-fit').first().click();
      await page.waitForTimeout(700);
      sonra = await page.evaluate(() => {
        const side = document.getElementById('libFilters');
        const r = side ? side.getBoundingClientRect() : null;
        const ilk = side ? side.querySelector('.fct') : null;
        const akt = document.activeElement;
        return {
          panelVar: !!side,
          gorunurAlanda: !!(r && r.bottom > 0 && r.top < window.innerHeight && r.width > 0 && r.height > 0),
          cekmeceAcik: !!(side && side.classList.contains('open')),
          ilkFacetAcik: !!(ilk && ilk.classList.contains('open')),
          odakPanelde: !!(side && akt && side.contains(akt)),
          odakEtiketi: akt ? (akt.tagName + '.' + (akt.className || '')).slice(0, 40) : null,
          kartSayisi: [...document.querySelectorAll('.coach-card')].filter(e => e.offsetParent !== null).length,
          sayfaNo: (document.querySelector('.pg-num.on,.pager .on,[data-sayfa].on') || {}).textContent || null,
          sayac: (document.getElementById('libCount') || {}).textContent || null
        };
      });

      if (!sonra.panelVar) rec(tag, 'CTA sonrası #libFilters bulunamadı');
      else {
        const erisilebilir = w <= 1024 ? sonra.cekmeceAcik : sonra.gorunurAlanda;
        if (!erisilebilir) rec(tag, w <= 1024
          ? 'CTA tıklandı ama filtre çekmecesi açılmadı'
          : 'CTA tıklandı ama filtre paneli görünür alana gelmedi');
        else ok(`@${w}: CTA "${once.ctaMetin}" → filtre paneli erişilebilir` + (w <= 1024 ? ' (çekmece açık)' : ' (görünür alanda)'));
        if (!sonra.ilkFacetAcik) rec(tag, 'ilk facet açılmadı — kullanıcı seçebileceği bir şey görmüyor');
        if (!sonra.odakPanelde) rec(tag, `odak panele taşınmadı (aktif öğe: ${sonra.odakEtiketi})`);
      }

      /* İKİNCİ MOTOR YOK — kart sayısı ve sayfalama değişmedi */
      if (sonra.kartSayisi !== once.kartSayisi)
        rec(tag, `CTA görünür kart sayısını değiştirdi: ${once.kartSayisi} → ${sonra.kartSayisi} (ikinci motor belirtisi)`);
      else if (sonra.sayfaNo !== once.sayfaNo || sonra.sayac !== once.sayac)
        rec(tag, `CTA sayfalama durumunu değiştirdi: sayfa ${once.sayfaNo}→${sonra.sayfaNo}, sayaç ${once.sayac}→${sonra.sayac}`);
      else ok(`@${w}: ikinci motor yok — kart sayısı ${once.kartSayisi}, sayaç "${once.sayac}", sayfa "${once.sayfaNo}" değişmedi`);
    } else {
      rec(tag, 'banner\'da birincil .btn-fit CTA yok — eşleştirme kapısı hiç kurulmamış');
    }

    if (konsol.length) rec(`konsol ${DIZIN} @${w}`, [...new Set(konsol)].join(' | '));
    await ctx.close();
  }

  /* @1024 banner ölçüsü */
  {
    const { ctx, page } = await ac(1024);
    await page.goto(`${BASE}/${DIZIN}`, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const h = await page.evaluate(() => {
      const e = document.querySelector('.lib-top');
      return e ? Math.round(e.getBoundingClientRect().height) : -1;
    });
    await ctx.close();
    if (h !== BANNER[1024]) rec('antrenör kapısı @1024', `banner ${h} px — beklenen ${BANNER[1024]}`);
    else ok('banner LİSTE ailesi birebir: 544/607/587 · kırpılan öğe 0');
  }

  /* program kapısı tamamen kaybolmadı mı — sayfanın ALTINDA ikincil bağlantı */
  {
    const { ctx, page } = await ac(1440);
    await page.goto(`${BASE}/${DIZIN}`, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const alt = await page.evaluate(() => {
      const band = document.querySelector('.lib-top');
      const kabuk = e => !!e.closest('.header,.footer,.topbar,.drawer,.bottombar,nav.nav,.fit-health');
      const a = [...document.querySelectorAll('a[href*="programini-bul"]')].filter(x => !kabuk(x));
      return a.map(x => ({ bannerIcinde: !!(band && band.contains(x)), metin: x.textContent.replace(/\s+/g,' ').trim().slice(0, 40) }));
    });
    await ctx.close();
    const bannerda = alt.filter(x => x.bannerIcinde);
    if (bannerda.length) rec('program kapısı', `banner\'da hâlâ program bağlantısı var: ${bannerda.map(x => x.metin).join(', ')}`);
    else if (!alt.length) not('sayfada "Programını Bul" bağlantısı hiç yok — kapı tamamen kapandı (kasıtlıysa sorun değil)');
    else ok(`program kapısı banner\'dan çıktı, sayfanın altında ikincil bağlantı olarak duruyor ("${alt[0].metin}")`);
  }
}

/* =====================================================================
   5 · KONSOL + YATAY TAŞMA — dokunulan her sayfa, @1440 ve @390
   ===================================================================== */
console.log('\n--- 5 · konsol hatası + yatay taşma ---');
for (const w of [1440, 390]) {
  let temiz = 0;
  for (const f of DOKUNULAN) {
    const { ctx, page, konsol } = await ac(w);
    let sorunlu = false;
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(650);
      const tasma = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (tasma > 1) { rec(`yatay taşma ${f} @${w}`, tasma + ' px'); sorunlu = true; }
      if (konsol.length) { rec(`konsol ${f} @${w}`, [...new Set(konsol)].join(' | ')); sorunlu = true; }
    } catch (e) { rec(`${f} @${w}`, 'HATA: ' + String(e).slice(0, 90)); sorunlu = true; }
    if (!sorunlu) temiz++;
    await ctx.close();
  }
  ok(`@${w}: ${temiz}/${DOKUNULAN.length} dokunulan sayfada konsol hatası 0 · yatay taşma 0`);
}

await browser.close();

console.log(`\n${fail} sorun`);
if (notlar.length) { console.log('\nNOTLAR:'); notlar.forEach(n => console.log('  · ' + n)); }
if (fail) { console.log('\nSORUNLAR:'); bad.slice(0, 30).forEach(b => console.log('  ✗ ' + b)); console.log(`\n✗ ${fail} sorun`); process.exit(1); }
console.log('✓ S1 kart PRO rozeti 0 · S2 "140+" 0 · S4 .btn-fit AA');
console.log('✓ Antrenör dizininin banner\'ı eşleştirmeye açılıyor, ikinci motor yok');
console.log('\n✓ 0 sorun');
