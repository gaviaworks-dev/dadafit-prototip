/* =====================================================================
   DADAFIT — R8 · AJAN-A KABUK NÖBETİ
   ---------------------------------------------------------------------
   Beyar'ın 10. oturumda açtığı altı kabuk kalemini + K-A rampasını
   nöbette tutar. Her ölçüt SAYI üretir; hiçbiri "göze öyle geliyor"
   değildir. Taban commit 654f353'te ölçütlerin HEPSİ kırmızıdır.

   K-A  --sec-pad rampası: .sec computed padding-top = 74·74·74·44
        (@1440 · @1024 · @768 · @390). --sec-pad-sm DEĞİŞMEDİ (32/26/26/22).
   1    "Planım" oturuma bağlı: misafirde header düğmesi 0, alt bar kalemi 0,
        drawer bölümü 0; giriş durumunda üçü de var (mobilde header düğmesi
        alt bara devreder → @390 girişte header düğmesi 0, alt bar 1).
        Hesap dropdown'ında "Planım" kalemi 0.
   2    Footer yasal bandında görünür başlık (h5.fl-head) 0; altı bağlantı
        metin+hedef olarak AYNEN duruyor.
   3    Hareket dropdown'ında .dd-group (divider) 0; panel kalem sayısı 5.
   4    hareket-merkezi-v1.html'e giden bağlantı 0 (DOM'da, tüm sayfalarda)
        ve sayfa HTTP 404.
   36   `.fp-gate` prototip uyarısı 0, misafir giriş CTA'sı 14/14 duruyor
        (R9 · K66 — `fit-test-sonuclarim-v1` eklendi, bkz. §36 bloğu),
        data-lg-only iki durumda da doğru.
   5    Sayfa altı dipnot kutusu (.hr-note) kendi içerik kolonunu dolduruyor:
        |kutu − kolon| ≤ 2px, her dipnotta.
   6    Avatar dropdown'ında destek için TEK giriş var ("Destek Merkezi");
        destek-talepleri-v1 dropdown'da 0, footer'da 0 ama destek-v1'den
        ERİŞİLEBİLİR. Hedefler HTTP 200 ve h1'leri beklenen kayıtla eşleşiyor
        (yer tutucu kalemler hariç — onların docs/icerik-bekleyen.md kaydı
        ayrıca aranır).
        R9 · K66'DA GÜNCELLENDİ — bkz. §6 bloğundaki gerekçe.

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/kabuk-r8.mjs [base]
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:8811';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAYFALAR = readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const ORNEK = 'hakkimizda-v1.html';

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = m => console.log('  ✓ ' + m);

const browser = await chromium.launch();
const ac = async w => {
  const ctx = await browser.newContext({ viewport:{ width:w, height: w<600?844:900 } });
  return { ctx, page: await ctx.newPage() };
};

/* ===================== K-A · --sec-pad rampası ===================== */
console.log('\n--- K-A · --sec-pad rampası ---');
{
  const BEKLENEN = { 1440:74, 1024:74, 768:74, 390:44 };
  const BEKLENEN_SM = { 1440:32, 1024:26, 768:26, 390:22 };
  for (const w of [1440,1024,768,390]) {
    const { ctx, page } = await ac(w);
    await page.goto(`${BASE}/${ORNEK}`, { waitUntil:'networkidle' });
    const m = await page.evaluate(() => {
      const el = document.querySelector('.sec');
      const kok = getComputedStyle(document.documentElement);
      return { pt: el ? getComputedStyle(el).paddingTop : null,
               tok: kok.getPropertyValue('--sec-pad').trim(),
               sm:  kok.getPropertyValue('--sec-pad-sm').trim() };
    });
    if (m.pt !== BEKLENEN[w]+'px') rec(`K-A @${w}`, `.sec padding-top = ${m.pt}, beklenen ${BEKLENEN[w]}px`);
    else ok(`@${w} .sec padding-top ${m.pt} (token ${m.tok})`);
    if (m.sm !== BEKLENEN_SM[w]+'px') rec(`K-A @${w}`, `--sec-pad-sm = ${m.sm}, DEĞİŞMEMELİYDİ (${BEKLENEN_SM[w]}px)`);
    await ctx.close();
  }
}

/* ===================== 1 · "Planım" oturuma bağlı ===================== */
console.log('\n--- 1 · "Planım" oturuma bağlı ---');
{
  const gorSel = `el => { const r = el.getBoundingClientRect(), c = getComputedStyle(el);
    return r.width>0 && r.height>0 && c.display!=='none' && c.visibility!=='hidden'; }`;
  const olc = () => {
    const gor = el => { const r = el.getBoundingClientRect(), c = getComputedStyle(el);
      return r.width>0 && r.height>0 && c.display!=='none' && c.visibility!=='hidden'; };
    const say = sel => [...document.querySelectorAll(sel)].filter(gor).length;
    return {
      auth:   document.body.classList.contains('is-auth'),
      dugme:  say('header .head-actions .btn-plan'),
      altbar: say('.bottom-nav .bn-item.bn-plan'),
      drawer: [...document.querySelectorAll('.drawer .d-item.d-plan')].length,   // drawer kapalı → DOM sayımı
      drawerGizli: [...document.querySelectorAll('.drawer .d-item.d-plan')]
                     .filter(el => getComputedStyle(el).display === 'none').length,
      ddPlan: [...document.querySelectorAll('header .acct-menu a')]
                .filter(a => /^Planım/.test(a.textContent.trim())).length
    };
  };
  for (const w of [1440, 390]) {
    for (const durum of ['misafir','giris']) {
      const { ctx, page } = await ac(w);
      let hataliDugme = 0, hataliAlt = 0, hataliDd = 0, hataliDrawer = 0, n = 0;
      for (const s of SAYFALAR) {
        await page.goto(`${BASE}/${s}?auth=${durum==='giris'?1:0}`, { waitUntil:'domcontentloaded' });
        await page.waitForTimeout(60);
        const m = await page.evaluate(olc);
        if (!m.auth && durum === 'giris') continue;      // kabuğu yüklemeyen sayfa (index)
        n++;
        /* Beklenti: misafirde HİÇBİRİ yok. Girişte @1440 header düğmesi,
           @390 alt bar kalemi. Drawer bölümü girişte DOM'da ve display açık. */
        const dugmeBek = durum==='giris' && w===1440 ? 1 : 0;
        const altBek   = durum==='giris' && w===390  ? 1 : 0;
        if (m.dugme  !== dugmeBek) hataliDugme++;
        if (m.altbar !== altBek)   hataliAlt++;
        if (m.ddPlan !== 0)        hataliDd++;
        if (durum==='misafir' && m.drawer && m.drawerGizli !== m.drawer) hataliDrawer++;
        if (durum==='giris'   && m.drawer && m.drawerGizli !== 0)        hataliDrawer++;
      }
      const et = `@${w}·${durum} (${n} sayfa)`;
      if (hataliDugme) rec(`1 ${et}`, `header Planım düğmesi beklenenden farklı: ${hataliDugme} sayfa`);
      else ok(`${et} header düğmesi doğru`);
      if (hataliAlt) rec(`1 ${et}`, `alt bar Planım kalemi beklenenden farklı: ${hataliAlt} sayfa`);
      else ok(`${et} alt bar kalemi doğru`);
      if (hataliDd) rec(`1 ${et}`, `hesap dropdown'ında "Planım" kalemi var: ${hataliDd} sayfa (0 olmalı)`);
      else ok(`${et} dropdown'da Planım 0`);
      if (hataliDrawer) rec(`1 ${et}`, `drawer Planım bölümü oturumla uyumsuz: ${hataliDrawer} sayfa`);
      await ctx.close();
    }
  }
}

/* ===================== 2 · Footer yasal bant başlığı ===================== */
console.log('\n--- 2 · Footer yasal bant başlığı ---');
{
  const YASAL = [
    ['Kullanım Koşulları',       'yasal-v1.html?metin=kullanim'],
    ['Gizlilik ve KVKK',         'yasal-v1.html?metin=kvkk'],
    ['Çerez Politikası',         'yasal-v1.html?metin=cerez'],
    ['Üyelik ve İptal Koşulları','yasal-v1.html?metin=uyelik'],
    ['Sağlık Bilgilendirmesi',   'saglik-bilgilendirme-v1.html'],
    ['Veri ve İzin Politikası',  'yasal-v1.html?metin=veri-izin']
  ];
  const { ctx, page } = await ac(1440);
  let basliklı = 0, bozuk = 0, n = 0;
  for (const s of SAYFALAR) {
    await page.goto(`${BASE}/${s}`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(50);
    const m = await page.evaluate(() => {
      const band = document.querySelector('.foot-lawband');
      if (!band) return null;
      return { baslik: band.querySelectorAll('.fl-head').length,
               link: [...band.querySelectorAll('a')].map(a => [a.textContent.trim(), a.getAttribute('href')]) };
    });
    if (!m) continue;
    n++;
    if (m.baslik !== 0) basliklı++;
    if (JSON.stringify(m.link) !== JSON.stringify(YASAL)) bozuk++;
  }
  if (basliklı) rec('2', `.fl-head hâlâ var: ${basliklı}/${n} sayfa (0 olmalı)`);
  else ok(`${n}/${n} sayfada görünür başlık 0`);
  if (bozuk) rec('2', `yasal bant bağlantıları değişmiş: ${bozuk}/${n} sayfa`);
  else ok(`${n}/${n} sayfada altı yasal bağlantı aynen duruyor`);
  await ctx.close();
}

/* ===================== 3 · Hareket dropdown divider'ı ===================== */
console.log('\n--- 3 · Hareket dropdown divider ---');
{
  const KALEMLER = ['DadaFit Egzersizleri','Hareket Rehberi','Spor Sözlüğü',
                    'Anatomi Haritası','Antrenman Oluşturucu'];
  const { ctx, page } = await ac(1440);
  let grupVar = 0, kalemBozuk = 0, n = 0;
  for (const s of SAYFALAR) {
    await page.goto(`${BASE}/${s}`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(50);
    const m = await page.evaluate(() => {
      const it = [...document.querySelectorAll('.nav > .nav-item')]
        .find(n => n.querySelector('a')?.textContent.trim().startsWith('Hareket'));
      const dd = it ? it.querySelector('.dropdown') : null;
      if (!dd) return null;
      return { grup: dd.querySelectorAll('.dd-group').length,
               /* SEÇİCİ DOĞRULANDI: <a><i/> <span>Etiket<small>açıklama</small></span></a>
                  → etiket, span'in İLK metin düğümü (small'ü kapsamaz). */
               kalem: [...dd.querySelectorAll('a')].map(a =>
                 (a.querySelector('span')||a).childNodes[0].textContent.trim()),
               /* R9 · K66 — SEÇİCİ DARALTILDI, ÖLÇÜT DEĞİŞMEDİ. Bu ölçüt
                  "Hareketi Anlamak" ayracını kovalıyor; masaüstü tarafı
                  (`grup`) zaten YALNIZ Hareket panelini sayıyor, drawer tarafı
                  ise `.drawer` içindeki HER `.d-sub-group`'u sayıyordu.
                  K66'da drawer'a açılır menünün mobil karşılığı eklenince
                  (`.d-acct-block` — belge §2'nin üç meşru grup başlığı) sahte
                  kırmızı verdi. Hesap bölümü dışlandı; Hareket panelinde
                  ayraç geri gelirse ölçüt aynen kırmızı olur.
                  Aynı düzeltme `tests/anatomi.mjs`'te de yapıldı. */
               dGrup: document.querySelectorAll('.drawer .d-item:not(.d-acct-block) .d-sub-group').length };
    });
    if (!m) continue;
    n++;
    if (m.grup !== 0 || m.dGrup !== 0) grupVar++;
    if (JSON.stringify(m.kalem) !== JSON.stringify(KALEMLER)) kalemBozuk++;
  }
  if (grupVar) rec('3', `"Hareketi Anlamak" ayracı hâlâ var: ${grupVar}/${n} sayfa`);
  else ok(`${n}/${n} sayfada divider 0`);
  if (kalemBozuk) rec('3', `dropdown kalemleri beklenenden farklı: ${kalemBozuk}/${n} sayfa`);
  else ok(`${n}/${n} sayfada panel kalemleri ${KALEMLER.length} ve sırası doğru`);
  await ctx.close();
}

/* ===================== 4 · hareket-merkezi kaldırıldı ===================== */
console.log('\n--- 4 · hareket-merkezi-v1 kaldırıldı ---');
{
  if (existsSync(path.join(ROOT, 'hareket-merkezi-v1.html')))
    rec('4', 'hareket-merkezi-v1.html hâlâ diskte');
  else ok('sayfa diskte yok');
  const r = await fetch(`${BASE}/hareket-merkezi-v1.html`).catch(() => ({ status:0 }));
  if (r.status === 200) rec('4', `sayfa hâlâ 200 dönüyor`);
  else ok(`HTTP ${r.status}`);

  const { ctx, page } = await ac(1440);
  let kalinti = 0, ornek = [];
  for (const s of SAYFALAR) {
    await page.goto(`${BASE}/${s}`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(50);
    const k = await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')]
        .filter(a => a.getAttribute('href').includes('hareket-merkezi-v1')).length);
    if (k) { kalinti += k; ornek.push(`${s}:${k}`); }
  }
  if (kalinti) rec('4', `DOM'da kalıntı bağlantı ${kalinti} — ${ornek.slice(0,6).join(' · ')}`);
  else ok(`${SAYFALAR.length} sayfada kalıntı bağlantı 0`);
  await ctx.close();
}

/* ===================== 5 · Dipnot kutusu genişliği ===================== */
console.log('\n--- 5 · Dipnot kutusu içerik kolonunda ---');
for (const w of [1440, 390]) {
  const { ctx, page } = await ac(w);
  let dar = [], notlu = 0, tasma = 0;
  for (const s of SAYFALAR) {
    await page.goto(`${BASE}/${s}`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(60);
    const m = await page.evaluate(() => {
      const kolon = el => {
        const w = el.parentElement; if (!w) return null;
        const c = getComputedStyle(w), r = w.getBoundingClientRect();
        return Math.round(r.width - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight));
      };
      return [...document.querySelectorAll('.hr-note')].map(n => {
        const r = n.getBoundingClientRect();
        if (r.width === 0) return null;
        return { w: Math.round(r.width), k: kolon(n) };
      }).filter(Boolean);
    });
    if (m.length) notlu++;
    for (const n of m) if (n.k !== null && Math.abs(n.w - n.k) > 2) dar.push(`${s} ${n.w}/${n.k}`);
    const ov = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ov > 1) tasma++;
  }
  if (dar.length) rec(`5 @${w}`, `kolonundan dar/geniş dipnot: ${dar.length} — ${dar.slice(0,5).join(' · ')}`);
  else ok(`@${w} ${notlu} sayfadaki dipnotların hepsi kendi kolonunda (±2px)`);
  if (tasma) rec(`5 @${w}`, `yatay taşan sayfa: ${tasma}`);
  else ok(`@${w} yatay taşma 0`);
  await ctx.close();
}

/* ===================== 6 · Destek: TEK giriş ===================== */
/* R9 · K66 — ÖLÇÜT DEĞİŞTİ, GEVŞEMEDİ.
   Eski hâli R8 madde 6'nın sözleşmesiydi: dropdown'da HEM "Destek" HEM
   "Taleplerim" bulunsun, destek-talepleri hedefi dropdown'da TAM 1 olsun.
   Yeni ürün belgesi §2 on dokuz hesap kalemini on bire katlıyor ve destek
   için TEK kalem bırakıyor ("Destek Merkezi"). Yani eski ölçüt artık
   devrilen kararı arıyordu.
   Nöbet zayıflamadı, YER DEĞİŞTİRDİ ve bir ölçüm KAZANDI:
     · eskiden "iki giriş olsun" → şimdi "tam bir giriş olsun" (fazlalık da
       eksiklik kadar kırmızı; iki kapı açılırsa yakalanır)
     · eskiden hiç ölçülmeyen ERİŞİM ZİNCİRİ eklendi: destek-talepleri
       menüden düştüğü için artık destek-v1 üzerinden ulaşılabilir olduğu
       KANITLANIYOR (ölçüldü: destek-v1'de 4 bağlantı). Erişim kaybı
       iddiası artık nöbetle bağlı, yorumla değil. */
console.log('\n--- 6 · Avatar dropdown: destek için tek giriş ---');
{
  const { ctx, page } = await ac(1440);
  let eksik = 0, ddFazla = 0, footerVar = 0, n = 0;
  for (const s of SAYFALAR) {
    await page.goto(`${BASE}/${s}?auth=1`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(50);
    const m = await page.evaluate(() => {
      const menu = document.querySelector('header .acct-menu');
      if (!menu) return null;
      /* SEÇİCİ: gerçek kalemler <a>, yer tutucu kalem <span.acct-soon>
         (ölü href bırakılmıyor) — ikisi de menü kalemi sayılır. */
      const ad = [...menu.querySelectorAll(':scope > a, :scope > .acct-soon')]
        .map(a => (a.querySelector('span')||a).childNodes[0]?.textContent.trim());
      const dd = [...menu.querySelectorAll('a[href]')]
        .filter(a => a.getAttribute('href').startsWith('destek-talepleri-v1')).length;
      const ft = [...document.querySelectorAll('.footer a[href], footer a[href]')]
        .filter(a => a.getAttribute('href').startsWith('destek-talepleri-v1')).length;
      /* belge §2 · destek için TEK kalem: "Destek Merkezi" */
      const destek = ad.filter(t => t === 'Destek Merkezi').length;
      /* eski adlarla ikinci kapı açılmasın */
      const eski = ad.filter(t => t === 'Destek' || t === 'Taleplerim' ||
                                  t === 'Destek Taleplerim').length;
      return { destek, eski, dd, ft };
    });
    if (!m) continue;
    n++;
    if (m.destek !== 1 || m.eski !== 0) eksik++;
    if (m.dd !== 0) ddFazla++;
    if (m.ft !== 0) footerVar++;
  }
  if (eksik) rec('6', `dropdown'da destek girişi tam 1 "Destek Merkezi" değil: ${eksik}/${n} sayfa`);
  else ok(`${n}/${n} sayfada dropdown'da tek destek girişi: "Destek Merkezi"`);
  if (ddFazla) rec('6', `dropdown'da destek-talepleri hedefi 0 değil: ${ddFazla}/${n} sayfa (belge §2 katladı)`);
  else ok(`${n}/${n} sayfada dropdown'da destek-talepleri hedefi 0`);
  if (footerVar) rec('6', `footer'da destek-talepleri bağlantısı var: ${footerVar}/${n} sayfa (0 olmalı)`);
  else ok(`${n}/${n} sayfada footer'da 0`);

  /* ERİŞİM ZİNCİRİ — menüden düşen sayfa yetim kalmasın.
     Destek Merkezi → Taleplerim yolu GÖRÜNÜR bir bağlantıyla kurulu mu? */
  await page.goto(`${BASE}/destek-v1.html?auth=1`, { waitUntil:'load' });
  await page.waitForTimeout(300);
  const zincir = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="destek-talepleri-v1"]')]
      .filter(a => {
        const cs = getComputedStyle(a);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' &&
               a.getBoundingClientRect().width > 0;
      }).length);
  if (!zincir) rec('6', 'destek-v1\'de destek-talepleri\'ne GÖRÜNÜR bağlantı yok — menüden düştü, hiçbir kapı kalmadı');
  else ok(`destek-v1 → destek-talepleri: ${zincir} görünür bağlantı (erişim kaybı yok)`);

  /* HEDEF kontrolü — HTTP değil, h1 metni. */
  /* 🔴 AD KAYDI — BEYAR, 2026-08-26 (bağlayıcı, son hâl):
     "Ad kanonu 'Destek Merkezi'. Fit'teki sayfanın adı da öyle olsun.
      Çözüm Merkezi ayrı sayfa (SSS tarafı), o adla kalabilir."
       destek-v1.html  → "Destek Merkezi"   (destek yüzeyi · menü hedefi)
       sss-v1.html     → "Çözüm Merkezi"    (SSS tarafı · ayrı sayfa)
     Hesap menüsünün "Destek Merkezi" kalemi artık AYNI ADI taşıyan sayfaya
     iniyor; ad ile hedef arasındaki çelişki (S1) kapandı. */
  const HEDEF = [['destek-v1.html', 'Destek Merkezi'],
                 ['destek-talepleri-v1.html', 'Destek Taleplerim']];
  for (const [h, h1bek] of HEDEF) {
    await page.goto(`${BASE}/${h}`, { waitUntil:'domcontentloaded' });
    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent.trim() || null);
    if (h1 !== h1bek) rec('6', `${h} h1 = ${JSON.stringify(h1)}, beklenen ${JSON.stringify(h1bek)}`);
    else ok(`${h} → h1 "${h1}"`);
  }
  /* Yer tutucu kalemin kaydı var mı? */
  const yt = await page.evaluate(() =>
    [...document.querySelectorAll('header .acct-menu [data-yer-tutucu]')]
      .map(a => a.getAttribute('data-yer-tutucu')));
  /* Yer tutucu kalem ölü bağlantı OLMAMALI: <a href="#"> yasak. */
  const oluBag = await page.evaluate(() =>
    document.querySelectorAll('header .acct-menu a[href="#"]').length);
  if (oluBag) rec('6', `dropdown'da ölü bağlantı (href="#") var: ${oluBag}`);
  else ok('dropdown\'da ölü bağlantı 0');
  const bekleyen = readFileSync(path.join(ROOT,'docs/icerik-bekleyen.md'),'utf8');
  for (const k of yt) {
    if (!bekleyen.includes(k)) rec('6', `yer tutucu "${k}" docs/icerik-bekleyen.md'de kayıtlı değil`);
    else ok(`yer tutucu "${k}" kütükte kayıtlı`);
  }
  if (!yt.length) ok('dropdown\'da yer tutucu kalem kalmadı (hepsi gerçek hedefe bağlı)');
  await ctx.close();
}

/* NOT — BURADA İKİNCİ BİR 36 BLOĞU VARDI (paralel ajan ekledi), KALDIRILDI.
   Aynı şeyi ölçüyordu ve aşağıdaki blok onun ÜST KÜMESİ:
     · o blok yalnız 13 sayfayı geziyordu → aşağıdaki 65 sayfayı gezip
       görünür `.fp-gate` sayısının TAM 13 olduğunu doğruluyor (banda
       başka sayfaya sızma da yakalanıyor)
     · o blok yatay taşmayı yalnız @390'da ölçüyordu → aşağıdaki iki
       genişlikte de ölçüyor
   Ölçüt gevşemedi, genişledi. */

/* ===================== 36 · Misafir giriş CTA bandı ===================== */
console.log('\n--- 36 · .fp-gate — prototip uyarısı çıktı, CTA kaldı ---');
for (const w of [1440, 390]) {
  for (const auth of [0, 1]) {
    const { ctx, page } = await ac(w);
    await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
    let kutu = 0, ornek = 0, ikon = 0, giris = 0, kayit = 0, tasma = 0;
    for (const s of SAYFALAR) {
      await page.goto(`${BASE}/${s}?auth=${auth}`, { waitUntil:'domcontentloaded' });
      await page.waitForTimeout(60);
      const m = await page.evaluate(() => {
        const g = document.querySelector('.fp-gate');
        const gor = el => { const r = el.getBoundingClientRect(), c = getComputedStyle(el);
          return r.width>0 && r.height>0 && c.display!=='none' && c.visibility!=='hidden'; };
        const v = g && gor(g);
        const btn = t => v ? [...g.querySelectorAll('a,button')].filter(x => t.test(x.textContent)).length : 0;
        return { v: !!v,
          ornek: v ? /veriler\s+örnektir/i.test(g.textContent) : false,
          ikon:  v ? g.querySelectorAll('.fa-circle-info').length : 0,
          giris: btn(/Giriş Yap/), kayit: btn(/Ücretsiz hesap/),
          ov: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      if (m.v) kutu++;
      if (m.ornek) ornek++;
      ikon += m.ikon;
      if (m.giris) giris++;
      if (m.kayit) kayit++;
      if (m.ov > 1) tasma++;
    }
    const et = `@${w}·auth=${auth}`;
    /* data-lg-only: misafirde ON DÖRT sayfada görünür, girişte HİÇBİRİNDE.
       R9 · K66 — sayı 13 → 14. Sebep gerileme değil, YENİ SAYFA:
       `fit-test-sonuclarim-v1.html` üretildi ve açılır menüye bağlandı
       (belge §2 "Fit Test Sonuçlarım"). Planım ailesinin bir üyesi olarak
       kardeşleriyle aynı misafir kapısını taşıyor. Ölçüldü — 67 sayfa
       gezildi, `.fp-gate` taşıyan tam 14 sayfanın hepsi Planım/Enerji
       Defteri ailesinden; aile dışı hiçbir sayfaya gate sızmadı. */
    const bek = auth === 0 ? 14 : 0;
    if (kutu !== bek) rec(`36 ${et}`, `.fp-gate görünür ${kutu}, beklenen ${bek}`);
    else ok(`${et} .fp-gate görünür ${kutu}`);
    if (ornek) rec(`36 ${et}`, `"veriler örnektir" cümlesi hâlâ var: ${ornek} sayfa`);
    if (ikon)  rec(`36 ${et}`, `info ikonu hâlâ var: ${ikon} adet`);
    if (giris !== bek) rec(`36 ${et}`, `"Giriş Yap" ${giris}, beklenen ${bek}`);
    if (kayit !== bek) rec(`36 ${et}`, `"Ücretsiz hesap oluştur" ${kayit}, beklenen ${bek}`);
    if (!ornek && !ikon && giris === bek && kayit === bek)
      ok(`${et} uyarı 0 · ikon 0 · Giriş Yap ${giris} · Ücretsiz hesap ${kayit}`);
    if (tasma) rec(`36 ${et}`, `yatay taşan sayfa: ${tasma}`);
    else ok(`${et} yatay taşma 0`);
    await ctx.close();
  }
}

/* ===================== E · Yapışıklık nöbeti ===================== */
console.log('\n--- E · blok alt boşluğu --sec-pad-sm altına düşmüyor ---');
for (const [w, esik] of [[1440, 32], [390, 22]]) {
  const { ctx, page } = await ac(w);
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const bulgu = [];
  for (const s of SAYFALAR) {
    await page.goto(`${BASE}/${s}?auth=0`, { waitUntil:'networkidle' });
    /* .reveal blokları animasyon bitene kadar transform taşıyor — mid-animation
       ölçüm SAHTE binişme üretiyor (E'nin "−14px" bulgusu buydu; oturunca 0px). */
    await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
      window.scrollTo(0, document.body.scrollHeight); });
    await page.waitForTimeout(500);
    const r = await page.evaluate((esik) => {
      const out = [];
      const gor = el => { const r = el.getBoundingClientRect(); return r.width>0 && r.height>0; };
      for (const sel of ['.fit-band-panel', '.fp-gate']) {
        for (const el of document.querySelectorAll(sel)) {
          if (!gor(el)) continue;
          let n = el.nextElementSibling;
          while (n && !gor(n)) n = n.nextElementSibling;
          if (!n) continue;
          const bos = Math.round((n.getBoundingClientRect().top - el.getBoundingClientRect().bottom) * 10) / 10;
          if (bos < esik) out.push(`${sel} → ${n.tagName} : ${bos}px`);
        }
      }
      return out;
    }, esik);
    for (const x of r) bulgu.push(`${s} ${x}`);
  }
  if (bulgu.length) rec(`E @${w}`, `eşik ${esik}px altında ${bulgu.length} blok — ${bulgu.slice(0,5).join(' · ')}`);
  else ok(`@${w} eşik ${esik}px · yapışık blok 0`);
  await ctx.close();
}

/* ===================== G · Sekme paneli odak sırası ===================== */
console.log('\n--- G · seçili tabpanel Tab sırasına giriyor ---');
{
  const { ctx, page } = await ac(1440);
  let barli = 0, panelKip = 0, sorunlu = 0;
  for (const s of SAYFALAR) {
    await page.goto(`${BASE}/${s}?auth=0`, { waitUntil:'networkidle' });
    const m = await page.evaluate(() => {
      const bar = document.querySelector('[data-fit-tabs]');
      if (!bar) return null;
      const panes = [...document.querySelectorAll('.fit-pane[data-pane]')];
      if (!panes.length) return { kip:'link' };
      const sec = panes.filter(x => !x.hidden);
      return { kip:'panel', secili: sec.length,
        seciliTi: sec.map(x => x.getAttribute('tabindex')),
        gizliKotu: panes.filter(x => x.hidden && x.getAttribute('tabindex') === '0').length,
        ariaSel: [...bar.querySelectorAll('[role=tab][aria-selected=true]')].length };
    });
    if (!m) continue;
    barli++;
    if (m.kip === 'link') continue;
    panelKip++;
    if (m.secili !== 1 || m.ariaSel !== 1 || m.seciliTi.some(t => t !== '0') || m.gizliKotu) {
      sorunlu++;
      rec('G', `${s} — seçili ${m.secili} · aria-selected ${m.ariaSel} · seçili tabindex ${JSON.stringify(m.seciliTi)} · gizli ama tabindex=0 olan ${m.gizliKotu}`);
    }
  }
  ok(`[data-fit-tabs] taşıyan sayfa ${barli} (panel kipi ${panelKip} · bağlantı kipi ${barli - panelKip})`);
  if (!sorunlu && panelKip) ok(`${panelKip}/${panelKip} panel kipli sayfada seçili panel tabindex="0" · aria-selected tam 1`);

  /* Gerçek klavye ölçümü: sekme şeridinden Tab → panel */
  for (const s of ['antrenor-detay-v1.html']) {
    await page.goto(`${BASE}/${s}?auth=0`, { waitUntil:'networkidle' });
    await page.evaluate(() => document.querySelector('[role=tab][aria-selected=true]').focus());
    await page.keyboard.press('Tab');
    const hedef = await page.evaluate(() => {
      const a = document.activeElement;
      return { pane: a.classList.contains('fit-pane'), et: a.tagName + '.' + String(a.className).split(' ')[0] };
    });
    if (!hedef.pane) rec('G', `${s} — sekmeden Tab paneli atladı, odak: ${hedef.et}`);
    else ok(`${s} — sekmeden Tab ×1 → seçili panel (${hedef.et})`);
  }
  await ctx.close();
}

/* ============== 20+28 · Sayaç ayracı yedi sayfadan birden kalktı ============== */
console.log('\n--- 20+28 · .ff-count::before dikey ayracı ---');
{
  /* Beyar: "7 sayfada da kalksın" — kural kabuktaydı, brief ayracı yalnız iki
     kalemde istiyordu. Yedincisi (sozluk-v1) B'nin yeniden kurduğu filtre
     satırını taşıyor: `.ff-bar` yok, sayaç `.sz-count`. İkisi de nöbette. */
  const YEDI = ['aktivite-gunlugu-v1.html','challenge-merkezi-v1.html','egzersiz-kutuphane-v1.html',
                'fit-testleri-v1.html','program-liste-v1.html','programlar-merkezi-v1.html','sozluk-v1.html'];
  for (const w of [1440, 390]) {
    const { ctx, page } = await ac(w);
    await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
    let temiz = 0, ayrac = [], tasma = 0;
    for (const s of YEDI) {
      await page.goto(`${BASE}/${s}`, { waitUntil:'networkidle' });
      await page.waitForTimeout(150);
      const m = await page.evaluate(() => {
        /* SEÇİCİ DOĞRULANDI: sayaç ya `.ff-bar .ff-count` (bileşen) ya da
           `.sz-count` (sözlüğün kendi satırı). İkisini de topla, boş dönme. */
        const say = [...document.querySelectorAll('.ff-bar .ff-count, .sz-count')]
          .filter(e => e.getBoundingClientRect().height > 0);
        return { bulunan: say.length,
          before: say.map(e => getComputedStyle(e, '::before').content),
          ov: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      if (!m.bulunan) { rec(`20+28 @${w}`, `${s} — sayaç seçicisi HİÇBİR şey bulmadı (seçici bozulmuş olabilir)`); continue; }
      const kotu = m.before.filter(c => c !== 'none');
      if (kotu.length) ayrac.push(`${s}:${JSON.stringify(kotu)}`);
      else temiz++;
      if (m.ov > 1) tasma++;
    }
    if (ayrac.length) rec(`20+28 @${w}`, `ayraç hâlâ var: ${ayrac.join(' · ')}`);
    else ok(`@${w} ${temiz}/${YEDI.length} sayfada .ff-count::before content = none`);
    if (tasma) rec(`20+28 @${w}`, `yatay taşan sayfa: ${tasma}`);
    else ok(`@${w} yatay taşma 0`);
    await ctx.close();
  }
}

await browser.close();
console.log('\n' + '='.repeat(60));
if (fail) { console.log(`✗ ${fail} SORUN\n`); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ R8 kabuk nöbeti — 0 sorun'); process.exit(0);
