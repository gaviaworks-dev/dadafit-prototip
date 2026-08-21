/* =====================================================================
   DADAFIT — ARAMA ÖNERİ PANELİ TESTİ (REVİZYON 6 · madde 20 · K27)
   ---------------------------------------------------------------------
   Neyi kanıtlar: `arama-fit-v1.html` açılır öneri paneli (`#fsAc`) beyaz
   arama kutusunun ALTINA girmiyor — hem boyanıyor hem TIKLANABİLİYOR.

   Kök neden (2026-08-21'de DOM'da ölçüldü, tahmin edilmedi):
     1. `.fs-top{overflow:hidden}` — panel hero bandının kutusunu aşan
        kısmını hem boyamadan hem isabet testinden (hit-test) siliyordu.
        Ölçüm: panel rect 436→876 iken `elementFromPoint` panelin orta ve
        alt noktasında `button.chip` / `p` (arkadaki bölüm) döndürüyordu.
     2. `.fs-top .wrap{position:relative;z-index:2}` panel için bir
        stacking context açıyor; panelin kendi `z-index:60`'ı bu bağlamın
        İÇİNDE kalıyor. Kardeş `.fs-tabbar` `z-index:40` taşıdığı için
        sorgulu sayfada sekme barı panelin üstüne boyanıyordu.
   Çözüm: süslemeler kendi kırpma katmanına (`.fs-top-deco`) alındı,
   `.fs-top` `overflow:visible` oldu; panel açıkken `.fs-top` `fs-ac-live`
   sınıfıyla `z-index:45`'e çıkıyor — sekme barının (40) üstünde,
   header'ın (60) altında.

   REFERANS: `dadagastro.com/ara` panelinde (`.sr-ac`) hero bandı
   `overflow:visible`; `dadadiet.com/arama` ise AYNI hatayı taşıyor.

   Ölçülenler:
   · panel açıkken `document.elementFromPoint()` panelin KENDİ öğesini
     döndürüyor — @1440 ve @390, panelin 3 farklı noktasında
   · panel beyaz kutunun sınırından taşabiliyor (hiçbir ata `overflow`
     ile kesmiyor)
   · sorgulu sayfada panel sekme barının ÜSTÜNDE
   · header z-index'i 60 ve footer perdesi (R11) etkilenmedi
   · klavye: ArrowDown imleci ilerletiyor, Esc kapatıyor
   · panel açılmak yatay kaydırma üretmiyor · konsol hatası yok

   Çalıştırma:
     python3 -m http.server 8811 &          # repo kökünde
     node tests/arama-oneri.mjs             # varsayılan http://localhost:8811
     node tests/arama-oneri.mjs http://localhost:8815
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE = process.argv[2] || 'http://localhost:8811';
const PAGE = 'arama-fit-v1.html';

let fail = 0; const bad = [];
const rec = m => { fail++; bad.push(m); console.log('  ✗ ' + m); };
const ok  = m => console.log('  ✓ ' + m);

const browser = await chromium.launch();

for(const W of [1440, 390]){
  const H = W === 1440 ? 900 : 844;
  const ctx = await browser.newContext({ viewport:{ width:W, height:H } });
  await ctx.addInitScript(() => {
    try{
      localStorage.setItem('dm-cookie-consent','accepted');
      /* "Son aramalar" grubu dolsun — panelin iki gruplu hâli sınansın */
      localStorage.setItem('dm_fit_recent', JSON.stringify(
        [{q:'plank',t:Date.now()},{q:'kettlebell swing',t:Date.now()}]));
    }catch(e){}
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if(m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push(String(e)));

  /* Sorgulu hâl: `.fs-tabbar` (z-index:40) GÖRÜNÜR olur; panelin onun da
     üstünde kalması gerekir. Asıl gerileme burada yakalanıyor. */
  await page.goto(`${BASE}/${PAGE}?q=squat`, { waitUntil:'load' });
  await page.waitForSelector('#fsInput', { state:'visible', timeout:8000 });
  await page.waitForTimeout(500);

  console.log(`\n@${W} · ${PAGE}?q=squat`);

  await page.click('#fsInput');
  await page.waitForTimeout(400);

  /* --- panel gerçekten açıldı mı --- */
  const opened = await page.evaluate(() =>
    document.querySelector('.fs-box').classList.contains('ac-open') &&
    document.getElementById('fsInput').getAttribute('aria-expanded') === 'true' &&
    document.querySelectorAll('#fsAcList .ac-opt').length > 0);
  if(!opened){ rec(`@${W} panel açılmadı (ac-open / aria-expanded / satır yok)`); }
  else ok(`@${W} panel açıldı, aria-expanded="true"`);

  /* --- ASIL ÖLÇÜM: 3 noktada elementFromPoint --- */
  const hit = await page.evaluate(() => {
    const ac = document.getElementById('fsAc');
    const r  = ac.getBoundingClientRect();
    const x  = r.left + r.width / 2;
    const pts = [
      ['üst',  r.top + 14],
      ['orta', r.top + r.height / 2],
      ['alt',  r.bottom - 14]
    ];
    return {
      rect: { t:+r.top.toFixed(1), b:+r.bottom.toFixed(1), h:+r.height.toFixed(1) },
      pts: pts.map(([ad, y]) => {
        const el = document.elementFromPoint(x, y);
        return {
          ad, y: Math.round(y),
          icinde: el ? ac.contains(el) : false,
          bulunan: el ? (el.tagName.toLowerCase() +
            (el.id ? '#' + el.id : '') +
            (typeof el.className === 'string' && el.className
              ? '.' + el.className.trim().split(/\s+/).slice(0,2).join('.') : '')) : 'null'
        };
      })
    };
  });
  for(const p of hit.pts){
    if(p.icinde) ok(`@${W} elementFromPoint(${p.ad}, y=${p.y}) → panelin kendi öğesi`);
    else rec(`@${W} elementFromPoint(${p.ad}, y=${p.y}) → "${p.bulunan}" — panel ÜSTTE DEĞİL`);
  }

  /* --- panel beyaz kutunun sınırını aşabiliyor mu (overflow kesmiyor) --- */
  const tasma = await page.evaluate(() => {
    const ac  = document.getElementById('fsAc');
    const box = document.querySelector('.fs-box');
    const ar  = ac.getBoundingClientRect(), br = box.getBoundingClientRect();
    /* panelin bir atası paint'i kesiyor mu */
    const kesen = [];
    let e = ac.parentElement;
    while(e && e.tagName !== 'HTML'){
      const cs = getComputedStyle(e);
      const er = e.getBoundingClientRect();
      const kirpar = /hidden|clip|scroll|auto/.test(cs.overflowY);
      if(kirpar && ar.bottom > er.bottom + 1){
        kesen.push(e.tagName.toLowerCase() +
          (typeof e.className === 'string' && e.className
            ? '.' + e.className.trim().split(/\s+/)[0] : '') +
          ` (overflow-y:${cs.overflowY}, altKenar=${er.bottom.toFixed(1)})`);
      }
      e = e.parentElement;
    }
    return { asiyor: ar.bottom > br.bottom + 1, kesen,
             acAlt:+ar.bottom.toFixed(1), boxAlt:+br.bottom.toFixed(1) };
  });
  if(!tasma.asiyor) rec(`@${W} panel beyaz kutunun sınırını aşmıyor (panel alt=${tasma.acAlt} ≤ kutu alt=${tasma.boxAlt})`);
  else ok(`@${W} panel kutunun sınırını aşıyor (panel alt=${tasma.acAlt} > kutu alt=${tasma.boxAlt})`);
  if(tasma.kesen.length) rec(`@${W} panelin taşan kısmını KESEN ata var: ${tasma.kesen.join(' · ')}`);
  else ok(`@${W} panelin taşan kısmını kesen ata yok`);

  /* --- sekme barı ile katman sırası --- */
  const kat = await page.evaluate(() => {
    const ac = document.getElementById('fsAc').getBoundingClientRect();
    const tb = document.querySelector('.fs-tabbar');
    if(!tb) return { yok:true };
    const tr = tb.getBoundingClientRect();
    if(tr.height === 0 || ac.bottom <= tr.top) return { ortusme:false };
    /* örtüşen bölgenin ortasında kim var */
    const y = (Math.max(ac.top, tr.top) + Math.min(ac.bottom, tr.bottom)) / 2;
    const el = document.elementFromPoint(ac.left + ac.width / 2, y);
    return { ortusme:true, y:Math.round(y),
             panelUstte: el ? document.getElementById('fsAc').contains(el) : false,
             bulunan: el ? el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '') : 'null',
             tbZ: getComputedStyle(tb).zIndex };
  });
  if(kat.yok) rec(`@${W} .fs-tabbar bulunamadı`);
  else if(!kat.ortusme) ok(`@${W} panel sekme barıyla örtüşmüyor — katman sırası konu dışı`);
  else if(kat.panelUstte) ok(`@${W} örtüşme bölgesinde (y=${kat.y}) panel sekme barının (z-index:${kat.tbZ}) ÜSTÜNDE`);
  else rec(`@${W} sekme barı (z-index:${kat.tbZ}) panelin üstünde — y=${kat.y}'de "${kat.bulunan}" bulundu`);

  /* --- kabuk katmanları bozulmadı mı --- */
  const kabuk = await page.evaluate(() => {
    const hdr = document.querySelector('.header');
    const mn  = document.getElementById('pageMain');
    const ftr = document.querySelector('footer, .footer');
    const hero = document.querySelector('.fs-top');
    return {
      hdrZ: hdr ? getComputedStyle(hdr).zIndex : null,
      hdrPos: hdr ? getComputedStyle(hdr).position : null,
      heroZ: hero ? getComputedStyle(hero).zIndex : null,
      mainMB: mn ? parseFloat(getComputedStyle(mn).marginBottom) : null,
      ftrH: ftr ? +ftr.getBoundingClientRect().height.toFixed(3) : null,
      ftrPos: ftr ? getComputedStyle(ftr).position : null
    };
  });
  if(kabuk.hdrZ === '60' && kabuk.hdrPos === 'fixed')
    ok(`@${W} header dokunulmadı (position:fixed · z-index:60)`);
  else rec(`@${W} header değişmiş: position=${kabuk.hdrPos} z-index=${kabuk.hdrZ} (beklenen fixed/60)`);

  /* panel açıkken hero z-index'i header'ın ALTINDA kalmalı */
  const hz = parseInt(kabuk.heroZ, 10);
  if(!isNaN(hz) && hz >= 60) rec(`@${W} .fs-top z-index=${hz} — header'ın (60) altında kalmalı`);
  else ok(`@${W} .fs-top z-index=${kabuk.heroZ} — header'ın altında`);

  /* R11 perdesi: footer sabitken main.margin-bottom = footer yüksekliği */
  if(kabuk.ftrPos === 'fixed'){
    const d = Math.abs(kabuk.mainMB - kabuk.ftrH);
    if(d <= 1) ok(`@${W} R11 perdesi sağlam (main.margin-bottom=${kabuk.mainMB} ≈ footer=${kabuk.ftrH})`);
    else rec(`@${W} R11 perdesi bozuk: main.margin-bottom=${kabuk.mainMB} · footer=${kabuk.ftrH} (fark ${d.toFixed(2)})`);
  } else ok(`@${W} footer bu genişlikte sabit değil (position:${kabuk.ftrPos}) — R11 perdesi konu dışı`);

  /* --- panel yatay kaydırma üretmiyor --- */
  const sw = await page.evaluate(() => ({ s:document.documentElement.scrollWidth, i:window.innerWidth }));
  if(sw.s > sw.i + 1) rec(`@${W} panel açıkken yatay taşma: scrollWidth=${sw.s} > innerWidth=${sw.i}`);
  else ok(`@${W} yatay taşma yok (scrollWidth=${sw.s})`);

  /* --- klavye: ArrowDown imleci ilerletiyor --- */
  await page.focus('#fsInput');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(180);
  const k1 = await page.evaluate(() => {
    const inp = document.getElementById('fsInput');
    const ad  = inp.getAttribute('aria-activedescendant');
    const el  = ad ? document.getElementById(ad) : null;
    return { ad, secili: el ? el.getAttribute('aria-selected') : null };
  });
  if(k1.ad && k1.secili === 'true') ok(`@${W} ArrowDown → aria-activedescendant="${k1.ad}"`);
  else rec(`@${W} ArrowDown imleci taşımadı (aria-activedescendant="${k1.ad}", aria-selected=${k1.secili})`);

  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(150);
  const k2 = await page.evaluate(() => document.getElementById('fsInput').getAttribute('aria-activedescendant'));
  if(k2 && k2 !== k1.ad) ok(`@${W} ikinci ArrowDown imleci ilerletti (${k1.ad} → ${k2})`);
  else rec(`@${W} ikinci ArrowDown imleci ilerletmedi (hâlâ "${k2}")`);

  /* --- klavye: Esc kapatıyor --- */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const kapandi = await page.evaluate(() => ({
    ac: document.querySelector('.fs-box').classList.contains('ac-open'),
    exp: document.getElementById('fsInput').getAttribute('aria-expanded'),
    live: document.querySelector('.fs-top').classList.contains('fs-ac-live'),
    vis: getComputedStyle(document.getElementById('fsAc')).visibility
  }));
  if(!kapandi.ac && kapandi.exp === 'false') ok(`@${W} Esc paneli kapattı (aria-expanded="false")`);
  else rec(`@${W} Esc paneli kapatmadı (ac-open=${kapandi.ac}, aria-expanded=${kapandi.exp})`);
  /* kapanınca hero yükseltmesi de geri alınmalı — footer/perde ile yarışmasın */
  if(kapandi.live) rec(`@${W} panel kapandı ama .fs-top hâlâ "fs-ac-live" — z-index yükseltmesi geri alınmadı`);
  else ok(`@${W} panel kapanınca .fs-top yükseltmesi geri alındı`);

  /* --- sorgusuz sayfa: varsayılan panel (son aramalar + popüler) --- */
  await page.goto(`${BASE}/${PAGE}`, { waitUntil:'load' });
  await page.waitForSelector('#fsInput', { state:'visible', timeout:8000 });
  await page.waitForTimeout(450);
  await page.click('#fsInput');
  await page.waitForTimeout(400);

  console.log(`@${W} · ${PAGE} (sorgusuz)`);

  const bosHit = await page.evaluate(() => {
    const ac = document.getElementById('fsAc');
    const r  = ac.getBoundingClientRect();
    const x  = r.left + r.width / 2;
    return [r.top + 14, r.top + r.height / 2, r.bottom - 14].map(y => {
      const el = document.elementFromPoint(x, y);
      return { y:Math.round(y), icinde: el ? ac.contains(el) : false };
    });
  });
  const bosKotu = bosHit.filter(p => !p.icinde);
  if(bosKotu.length) rec(`@${W} sorgusuz panelde ${bosKotu.length}/3 nokta panelin dışını döndürdü (y=${bosKotu.map(p=>p.y).join(', ')})`);
  else ok(`@${W} sorgusuz panelde 3/3 nokta panelin kendi öğesini döndürdü`);

  /* "Temizle" dokunma hedefi — @390'da 44px kuralı */
  const clr = await page.evaluate(() => {
    const c = document.querySelector('#fsAcList .ac-clear');
    if(!c) return null;
    const r = c.getBoundingClientRect();
    return { w:+r.width.toFixed(1), h:+r.height.toFixed(1) };
  });
  if(!clr) rec(`@${W} "Temizle" düğmesi yok — son aramalar grubu basılmadı`);
  else {
    const min = W <= 640 ? 44 : 32;
    if(clr.h + 0.5 >= min) ok(`@${W} "Temizle" dokunma hedefi ${clr.w}×${clr.h}px (≥ ${min})`);
    else rec(`@${W} "Temizle" dokunma hedefi ${clr.w}×${clr.h}px — ${min}px altında`);
  }

  if(errs.length) rec(`@${W} konsol hatası (${errs.length}): ${errs.slice(0,3).join(' | ')}`);
  else ok(`@${W} konsol hatası yok`);

  await ctx.close();
}

await browser.close();

console.log('');
if(bad.length){
  console.log(`SORUNLAR (${bad.length}):`);
  bad.forEach(b => console.log('  ✗ ' + b));
  process.exit(1);
}
console.log('✓ Öneri paneli beyaz kutunun üstünde ve tıklanabilir; kabuk katmanları ve R11 perdesi bozulmadı.');
