/* =====================================================================
   DADAFIT — ANTRENÖR DİZİNİ KURGU TESTİ (A4)
   ---------------------------------------------------------------------
   Kurgu kaynağı: dadadiet.com/diyetisyenler (ölçülerek alındı).
   Neyi kanıtlar:
   1. Masaüstünde iki kolon: solda 272px filtre paneli, sağda sonuç kolonu.
   2. Sol panel sticky — sayfa kaydırılınca ekranda kalır.
   3. Kart ızgarası 3 kolon (≤1024: 2, ≤640: 1).
   4. Sayfalama kart ızgarasının ALTINDA ve çalışıyor (sayfa 2'ye geçiş).
   5. FİLTRE MOTORU HÂLÂ ÇALIŞIYOR — bu en kritik madde: facet'ler akordeona
      taşındı, .fgroup düğümleri silinmedi/klonlanmadı. Bir çip seçilince
      sonuç sayısı düşer, ilgili facet sayacı (.fct-dot) artar, sıfırla geri alır.
   6. Banner'da arama input'u YOK.
   7. ≤1024px'te panel alttan çekmeceye dönüyor, "Filtrele" düğmesiyle açılıp
      kapanıyor ve açıkken sayfa yatay kaymıyor.
   8. Hiçbir genişlikte yatay taşma ve konsol hatası yok.

   Çalıştırma:
     python3 -m http.server 8811 &
     node tests/coach-list.mjs
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE = process.argv[2] || 'http://localhost:8811';
const URL  = `${BASE}/antrenorler-v1.html`;

let fail = 0; const bad = [];
const rec = m => { fail++; bad.push(m); };
const ok  = m => console.log('  ✓ ' + m);

const browser = await chromium.launch();

/* ---------------- MASAÜSTÜ (1440px) ---------------- */
{
  const ctx = await browser.newContext({ viewport:{ width:1440, height:1000 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if(m.type() === 'error') errs.push('console.error: ' + m.text()); });

  await page.goto(URL, { waitUntil:'load' });
  await page.waitForTimeout(700);
  console.log('\n— masaüstü 1440px —');

  /* 1 · iki kolon */
  const geo = await page.evaluate(() => {
    const r = s => { const e = document.querySelector(s); if(!e) return null;
                     const b = e.getBoundingClientRect();
                     return { x:Math.round(b.x), w:Math.round(b.width), y:Math.round(b.y) }; };
    const lay = document.querySelector('.lst-layout');
    return { layout: lay ? getComputedStyle(lay).gridTemplateColumns : null,
             side: r('.lst-side'), main: r('.lst-main'),
             sidePos: document.querySelector('.lst-side') ? getComputedStyle(document.querySelector('.lst-side')).position : null,
             grid: document.querySelector('#libGrid') ? getComputedStyle(document.querySelector('#libGrid')).gridTemplateColumns : null,
             gridBox: r('#libGrid'), pagerBox: r('.lib-page'),
             searchInBanner: !!document.querySelector('.lib-top .lib-search, .lib-top input[type=search]') };
  });
  if(!geo.side) rec('sol filtre kolonu (.lst-side) yok');
  else {
    if(Math.abs(geo.side.w - 272) > 2) rec(`sol kolon genişliği 272px değil: ${geo.side.w}px`);
    else ok(`sol filtre kolonu 272px (referansla aynı)`);
    if(geo.sidePos !== 'sticky') rec(`sol kolon sticky değil: position=${geo.sidePos}`);
    else ok('sol kolon sticky');
  }
  if(geo.main && geo.side && geo.main.x <= geo.side.x) rec('sonuç kolonu solda kalmış — sağda olmalı');
  else ok('sonuç kolonu sağda');

  const cols = (geo.grid || '').split(' ').filter(Boolean).length;
  if(cols !== 3) rec(`kart ızgarası 3 kolon değil: ${cols} (${geo.grid})`);
  else ok('kart ızgarası 3 kolon');

  if(geo.pagerBox && geo.gridBox && geo.pagerBox.y < geo.gridBox.y) rec('sayfalama ızgaranın üstünde');
  else ok('sayfalama ızgaranın altında');

  if(geo.searchInBanner) rec('banner içinde hâlâ arama input\'u var (A4 gereği kalkmalı)');
  else ok('banner\'da arama input\'u yok');

  /* 2 · sticky gerçekten yapışıyor mu */
  const before = await page.locator('.lst-side').boundingBox();
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(500);
  const after = await page.locator('.lst-side').boundingBox();
  if(after && before && after.y < 0) rec(`sol kolon ekrandan çıktı (sticky çalışmıyor): y=${after.y.toFixed(0)}`);
  else ok(`sol kolon kaydırma sonrası ekranda (y=${after ? after.y.toFixed(0) : '?'})`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  /* 3 · FİLTRE MOTORU — en kritik kontrol */
  const readCount = () => page.evaluate(() => +document.getElementById('libCount').textContent.trim());
  const visibleCards = () => page.evaluate(() =>
    [...document.querySelectorAll('#libGrid .coach-card')].filter(c => c.style.display !== 'none').length);

  const total0 = await readCount();
  const vis0   = await visibleCards();
  ok(`başlangıç: ${total0} sonuç, ${vis0} kart görünür (PER_PAGE=6)`);

  /* "Mobilite & Pilates" çipini seç */
  const chip = page.locator('.lst-side .fgroup[data-group="uzmanlik"] .df-fchip[data-val="mobilite"]');
  await chip.click();
  await page.waitForTimeout(350);
  const total1 = await readCount();
  const dot1 = await page.evaluate(() => {
    const f = document.querySelector('.lst-side .fgroup[data-group="uzmanlik"]').closest('.fct');
    return { txt: f.querySelector('.fct-dot').textContent.trim(), active: f.classList.contains('has-active') };
  });
  const pressed = await chip.getAttribute('aria-pressed');

  if(!(total1 > 0 && total1 < total0)) rec(`FİLTRE ÇALIŞMIYOR: seçim sonrası sonuç ${total0} → ${total1} (azalmalıydı)`);
  else ok(`filtre çalışıyor: ${total0} → ${total1} sonuç`);
  if(dot1.txt !== '1' || !dot1.active) rec(`facet sayacı yanlış: dot="${dot1.txt}" has-active=${dot1.active}`);
  else ok('facet sayacı 1 ve .has-active kuruldu');
  if(pressed !== 'true') rec(`çipte aria-pressed="true" yok (§20): ${pressed}`);
  else ok('çipte aria-pressed doğru');

  /* sıfırla geri alıyor mu */
  await page.locator('#fClear').click();
  await page.waitForTimeout(350);
  const total2 = await readCount();
  const dot2 = await page.evaluate(() =>
    document.querySelector('.lst-side .fct .fct-dot').textContent.trim());
  if(total2 !== total0) rec(`sıfırla eski hâle dönmedi: ${total0} → ${total2}`);
  else ok(`sıfırla çalışıyor: ${total2} sonuç`);
  if(dot2 !== '0') rec(`sıfırla sonrası sayaç 0 değil: ${dot2}`);
  else ok('sıfırla sonrası sayaç 0');

  /* 4 · sayfalama */
  const pgCount = await page.locator('.pager button').count();
  if(pgCount === 0) rec('sayfalama düğmesi üretilmedi');
  else {
    const p2 = page.locator('.pager button', { hasText:/^2$/ }).first();
    if(await p2.count()){
      await p2.click();
      await page.waitForTimeout(600);
      const note = await page.evaluate(() => document.getElementById('pageNote').textContent);
      if(!/sayfa\s*2/.test(note)) rec(`2. sayfaya geçilmedi — not: "${note}"`);
      else ok(`2. sayfaya geçildi ("${note.trim()}")`);
    } else ok('tek sayfa — sayfalama düğmesi gerekmiyor');
  }

  /* 4b · kart üst rozetleri çakışmıyor
     Bu kontrol sonradan eklendi: sol filtre kolonu kart genişliğini
     ~397px'ten ~275px'e indirdi ve "DadaFit Onaylı" rozeti ile uygunluk
     rozeti üst üste bindi. İkisi artık tek flex satırında; kesişim ölçülüyor. */
  const overlap = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('#libGrid .coach-card').forEach((card, i) => {
      if(card.style.display === 'none') return;
      const v = card.querySelector('.coach-verify'), s = card.querySelector('.coach-status');
      if(!v || !s) return;
      const a = v.getBoundingClientRect(), b = s.getBoundingClientRect();
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if(ix > 0.5 && iy > 0.5) out.push(`kart ${i+1}: ${ix.toFixed(0)}×${iy.toFixed(0)}px kesişim`);
      /* rozetler kart sınırını da aşmasın */
      const c = card.getBoundingClientRect();
      if(a.right > c.right + 0.5 || b.right > c.right + 0.5) out.push(`kart ${i+1}: rozet kart sınırını aşıyor`);
    });
    return out;
  });
  if(overlap.length) rec('kart rozetleri çakışıyor:\n      ' + overlap.join('\n      '));
  else ok('kart üst rozetleri çakışmıyor ve kart sınırını aşmıyor');

  /* 4c · marka dili — DadaMutfak izi kalmadı (belge §1) */
  const mutfak = await page.evaluate(() => {
    const hits = [];
    if(/dadamutfak/i.test(document.title)) hits.push('<title>');
    document.querySelectorAll('#pageMain *').forEach(e => {
      if(e.children.length) return;
      if(/dadamutfak/i.test(e.textContent||'')) hits.push((e.className||e.tagName) + ': ' + e.textContent.trim().slice(0,40));
    });
    return [...new Set(hits)];
  });
  if(mutfak.length) rec('sayfada DadaMutfak ifadesi kaldı (§1):\n      ' + mutfak.join('\n      '));
  else ok('sayfada DadaMutfak ifadesi kalmadı');

  /* 5 · yatay taşma */
  const of = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if(of > 1) rec(`yatay taşma: scrollWidth farkı ${of}px`);
  else ok('yatay taşma yok');

  if(errs.length) rec('konsol/JS hatası:\n      ' + errs.join('\n      '));
  else ok('konsol hatası yok');

  await ctx.close();
}

/* ---------------- DAR EKRAN: çekmece davranışı ---------------- */
for(const width of [1024, 768, 390]){
  const ctx = await browser.newContext({ viewport:{ width, height:900 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if(m.type() === 'error') errs.push('console.error: ' + m.text()); });

  await page.goto(URL, { waitUntil:'load' });
  await page.waitForTimeout(600);
  console.log(`\n— dar ekran ${width}px —`);

  const expectCols = width <= 640 ? 1 : 2;
  const cols = await page.evaluate(() =>
    getComputedStyle(document.getElementById('libGrid')).gridTemplateColumns.split(' ').filter(Boolean).length);
  if(cols !== expectCols) rec(`@${width}: ızgara ${expectCols} kolon olmalı, ${cols} çıktı`);
  else ok(`ızgara ${cols} kolon`);

  /* panel gizli, tetik görünür */
  const st = await page.evaluate(() => {
    const s = document.querySelector('.lst-side'), t = document.getElementById('filTrigger');
    return { sideOpen: s.classList.contains('open'),
             triggerVisible: t ? getComputedStyle(t).display !== 'none' : false,
             sideY: Math.round(s.getBoundingClientRect().y) };
  });
  if(!st.triggerVisible) rec(`@${width}: "Filtrele" tetiği görünmüyor`);
  else ok('"Filtrele" tetiği görünür');

  const swBefore = await page.evaluate(() => document.documentElement.scrollWidth);
  await page.locator('#filTrigger').click();
  await page.waitForTimeout(600);
  const opened = await page.evaluate(() => {
    const s = document.querySelector('.lst-side');
    const b = s.getBoundingClientRect();
    return { open:s.classList.contains('open'), y:Math.round(b.y), h:Math.round(b.height),
             overlay:document.getElementById('sheetOverlay').classList.contains('open'),
             sw:document.documentElement.scrollWidth };
  });
  if(!opened.open)          rec(`@${width}: çekmece açılmadı`);
  else if(opened.y > 900)   rec(`@${width}: çekmece hâlâ ekran dışında (y=${opened.y})`);
  else ok(`çekmece açıldı (y=${opened.y}, h=${opened.h})`);
  if(!opened.overlay)       rec(`@${width}: çekmece örtüsü açılmadı`);
  else ok('örtü açıldı');
  if(opened.sw !== swBefore) rec(`@${width}: çekmece açılınca scrollWidth değişti ${swBefore} → ${opened.sw}`);
  else ok('çekmece açıkken yatay kayma yok');

  /* Çekmece GERÇEKTEN GÖRÜNÜR mü? Bu kontrol sonradan eklendi: Playwright
     kaydırılabilir bir kapsayıcının içindeki düğmeye kendi kendine kaydırıp
     tıklayabiliyor, bu yüzden "filtre çalıştı" demek panelin görünür olduğunu
     KANITLAMIYOR. Nitekim .sheet-body{flex:1 1 0} ile gövde 10px'e çökmüştü
     (scrollHeight 732px) ve facet'ler ekranda yoktu, testler yine geçiyordu.
     Artık gövdenin gerçek yüksekliği ve ilk facet'in ekran içinde olması
     ölçülüyor. */
  const vis = await page.evaluate(() => {
    const body = document.querySelector('.sheet-body');
    const bb = body.getBoundingClientRect();
    const first = document.querySelector('.sheet-body .fct .df-fchip');
    const fb = first ? first.getBoundingClientRect() : null;
    return { bodyH:Math.round(bb.height), bodyScroll:body.scrollHeight,
             chipH: fb ? Math.round(fb.height) : 0,
             chipInView: fb ? (fb.top >= 0 && fb.bottom <= window.innerHeight && fb.height > 0) : false,
             vh: window.innerHeight };
  });
  if(vis.bodyH < 120)
    rec(`@${width}: çekmece gövdesi çökmüş — height=${vis.bodyH}px ama scrollHeight=${vis.bodyScroll}px (facet'ler görünmüyor)`);
  else ok(`çekmece gövdesi ${vis.bodyH}px yüksek (içerik ${vis.bodyScroll}px, kendi içinde kayıyor)`);
  if(!vis.chipInView)
    rec(`@${width}: ilk filtre çipi ekranda görünmüyor (yüksekliği ${vis.chipH}px)`);
  else ok('ilk filtre çipi ekranda görünür');

  /* çip seçimi çekmece içinde de çalışıyor mu */
  await page.locator('.lst-side .fgroup[data-group="format"] .df-fchip[data-val="online"]').click();
  await page.waitForTimeout(300);
  const cnt = await page.evaluate(() => +document.getElementById('libCount').textContent.trim());
  if(!(cnt > 0 && cnt < 8)) rec(`@${width}: çekmece içinden filtre çalışmadı (sonuç ${cnt})`);
  else ok(`çekmece içinden filtre çalıştı (${cnt} sonuç)`);

  await page.locator('#sheetApply').click();
  await page.waitForTimeout(600);
  const closed = await page.evaluate(() => ({
    open: document.querySelector('.lst-side').classList.contains('open'),
    locked: document.body.classList.contains('scroll-locked')
  }));
  if(closed.open)   rec(`@${width}: "Sonuçları gör" çekmeceyi kapatmadı`);
  else ok('"Sonuçları gör" çekmeceyi kapattı');
  if(closed.locked) rec(`@${width}: çekmece kapandı ama kaydırma kilidi kaldı`);
  else ok('kaydırma kilidi çözüldü');

  const of = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if(of > 1) rec(`@${width}: yatay taşma ${of}px`);
  else ok('yatay taşma yok');

  if(errs.length) rec(`@${width} konsol/JS hatası:\n      ` + errs.join('\n      '));
  await ctx.close();
}

await browser.close();
console.log(`\n${fail} sorun`);
if(bad.length){ console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ Antrenör dizini referans kurguda ve filtre motoru bozulmadı.');
