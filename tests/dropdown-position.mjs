/* =====================================================================
   DADAFIT — DROPDOWN KONUM REGRESYON TESTİ
   ---------------------------------------------------------------------
   Neyi kanıtlar: header ana menüsündeki bir kaleme HOVER edip paneli
   açmak ile AYNI kaleme TIKLAMAK (basmak) panelin ekrandaki yerini
   DEĞİŞTİRMEZ. Ölçüm gözle değil boundingBox ile yapılır.

   Kök neden (2026-08-17'de bulundu): fit-shell.css içindeki
     .nav-item:focus-within>.dropdown{ … transform:none … }
   kuralı, panelin temel konumlandırmasını (left:50% + translateX(-50%))
   iptal ediyordu. Hover'da panel ortalanıyor, tıklamada odak zinciri
   devreye girip transform siliniyor ve panel kendi genişliğinin YARISI
   kadar sağa zıplıyordu (dd-wide panelde 280px).

   Ayrıca kontrol edilir:
   · panel açıkken document.documentElement.scrollWidth değişmez
     (yani panel yatay kaydırma üretmez),
   · header'ın kendi boundingBox'ı değişmez,
   · panel viewport'un sağ/sol kenarından taşmaz.

   Çalıştırma:
     python3 -m http.server 8811 &          # repo kökünde
     node tests/dropdown-position.mjs       # varsayılan http://localhost:8811
     node tests/dropdown-position.mjs http://localhost:8811 1440,1280,1024
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE   = process.argv[2] || 'http://localhost:8811';
/* Masaüstü ana menü ≤1024px'te gizlenir (fit-shell.css: ".h-top .nav{display:none}"
   @media max-width:1024px) — panel testi yalnız menünün göründüğü genişliklerde
   anlamlı. Daha küçük bir genişlik verilirse o tur atlanır ve raporlanır. */
const WIDTHS = (process.argv[3] || '1440,1280,1100').split(',').map(Number);

/* Kabuğu yükleyen, farklı header durumlarını temsil eden sayfalar:
   · dadafit-hub-v1  → hero'lu sayfa (header şeffaf başlar)
   · programlar-merkezi-v1 / egzersiz-kutuphane-v1 → banner'lı liste sayfaları
     (hareket-merkezi-v1 R8 madde 4'te kaldırıldı)
   · fit-planim-v1  → Planım kabuğu (aktif buton durumu)               */
const PAGES = [
  'dadafit-hub-v1.html',
  'programlar-merkezi-v1.html',
  'egzersiz-kutuphane-v1.html',
  'antrenorler-v1.html',
  'programlarim-v1.html#programlarim'
];

const TOL = 0.5;            // px — subpixel yuvarlama toleransı
let fail = 0, checks = 0;
const bad = [], skipped = [];

function box(b){ return b ? `x=${b.x.toFixed(1)} y=${b.y.toFixed(1)} w=${b.width.toFixed(1)}` : 'null'; }

const browser = await chromium.launch();

for(const width of WIDTHS){
  const ctx = await browser.newContext({ viewport:{ width, height:900 } });
  /* çerez bandı ekranı kapatmasın */
  await ctx.addInitScript(() => {
    try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){}
  });
  const page = await ctx.newPage();

  for(const file of PAGES){
    await page.goto(`${BASE}/${file}`, { waitUntil:'domcontentloaded' });
    await page.waitForSelector('.header .nav .nav-item', { state:'attached', timeout:8000 });

    /* Layout oturana kadar bekle. Gerekçe: hero'lu sayfalarda header şeffaf
       başlar ve beyaz logoya geçer; logo görseli geç yüklenirse marka bloğunun
       genişliği değişir, ortalanmış .nav birkaç px kayar. Bu, tıklamayla ilgisi
       olmayan bir yükleme yarışıdır — ölçüme karışmasın diye .nav'ın
       boundingBox'ı iki ardışık okumada aynı çıkana kadar beklenir. */
    await page.waitForLoadState('load').catch(() => {});
    {
      const navLoc = page.locator('.header .nav');
      let prev = null;
      for(let t=0; t<25; t++){
        const b = await navLoc.boundingBox();
        const sig = b ? `${b.x.toFixed(2)}|${b.width.toFixed(2)}` : 'null';
        if(sig === prev) break;
        prev = sig;
        await page.waitForTimeout(120);
      }
    }

    /* masaüstü menüsü bu genişlikte gizliyse (≤1024px) ölçüm yapılmaz */
    if(!(await page.locator('.header .nav').first().isVisible())){
      skipped.push(`${file} @${width} — masaüstü menü gizli (drawer görünümü)`);
      continue;
    }

    /* Tıklamanın gerçek gezinmeyi tetiklemesini engelle — ölçmek istediğimiz
       şey odak/aktif durumun panele yaptığı etki, sayfa geçişi değil.
       preventDefault YALNIZ navigasyonu iptal eder; odak yine oluşur,
       yani hatanın kaynağı olan :focus-within aynen tetiklenir. */
    await page.evaluate(() => {
      document.addEventListener('click', e => {
        const a = e.target.closest && e.target.closest('.nav-item > a');
        if(a) e.preventDefault();
      }, true);
    });

    const n = await page.locator('.header .nav .nav-item').count();

    for(let i=0;i<n;i++){
      const item = page.locator('.header .nav .nav-item').nth(i);
      const dd   = item.locator('.dropdown, .mega');
      if(await dd.count() === 0) continue;      // panelsiz düz link — konu dışı

      const trigger = item.locator(':scope > a');
      const label   = (await trigger.innerText()).trim().split('\n')[0];
      const tag     = `${file} @${width} · "${label}"`;

      /* --- referans: panel kapalıyken sayfa genişliği ve header --- */
      await page.mouse.move(5, 400);            // hover'ı bırak
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
      await page.waitForTimeout(200);
      const swBefore  = await page.evaluate(() => document.documentElement.scrollWidth);
      const hdrBefore = await page.locator('.header').boundingBox();

      /* --- (a) HOVER ile aç --- */
      await trigger.hover();
      await page.waitForTimeout(260);           // 120ms geçiş + pay
      const hoverBox = await dd.boundingBox();
      const swHover  = await page.evaluate(() => document.documentElement.scrollWidth);
      const hdrHover = await page.locator('.header').boundingBox();

      /* --- (b) AYNI kaleme TIKLA (bas) --- */
      await trigger.click();
      await page.waitForTimeout(260);
      const clickBox = await dd.boundingBox();
      const swClick  = await page.evaluate(() => document.documentElement.scrollWidth);
      const hdrClick = await page.locator('.header').boundingBox();

      checks++;

      const rec = (msg) => { fail++; bad.push(`${tag}\n      ${msg}`); };

      if(!hoverBox) rec('panel HOVER ile açılmadı (boundingBox yok)');
      else if(!clickBox) rec('panel TIKLAMADAN sonra kayboldu (boundingBox yok)');
      else {
        /* ASIL KONTROL: x farkı sıfır olmalı */
        const dx = Math.abs(clickBox.x - hoverBox.x);
        const dy = Math.abs(clickBox.y - hoverBox.y);
        const dw = Math.abs(clickBox.width - hoverBox.width);
        if(dx > TOL) rec(`PANEL YANA KAYDI: Δx=${dx.toFixed(1)}px  hover(${box(hoverBox)}) → click(${box(clickBox)})`);
        if(dy > TOL) rec(`panel dikeyde kaydı: Δy=${dy.toFixed(1)}px`);
        if(dw > TOL) rec(`panel genişliği değişti: Δw=${dw.toFixed(1)}px`);

        /* panel viewport dışına taşmasın */
        if(clickBox.x < -TOL)                       rec(`panel sol kenardan taştı: x=${clickBox.x.toFixed(1)}`);
        if(clickBox.x + clickBox.width > width+TOL) rec(`panel sağ kenardan taştı: sağ=${(clickBox.x+clickBox.width).toFixed(1)} > ${width}`);
      }

      /* panel açılmak sayfayı genişletmemeli */
      if(swHover !== swBefore) rec(`hover scrollWidth değişti: ${swBefore} → ${swHover}`);
      if(swClick !== swBefore) rec(`click scrollWidth değişti: ${swBefore} → ${swClick}`);

      /* header yerinden oynamamalı */
      for(const [name, b] of [['hover', hdrHover], ['click', hdrClick]]){
        if(!b || !hdrBefore) continue;
        if(Math.abs(b.x - hdrBefore.x) > TOL || Math.abs(b.width - hdrBefore.width) > TOL)
          rec(`header ${name}'da yerinden oynadı: ${box(hdrBefore)} → ${box(b)}`);
      }
    }
  }
  await ctx.close();
}

await browser.close();

console.log(`\n${checks} panel ölçüldü · ${fail} sorun`);
if(skipped.length){
  console.log(`\nAtlanan (${skipped.length}) — menü o genişlikte gizli:`);
  skipped.forEach(s => console.log('  · ' + s));
}
if(checks === 0){
  console.error('\nHiç panel ölçülmedi — masaüstü menüsünün göründüğü bir genişlik ver (>1024px).');
  process.exit(2);
}
if(bad.length){
  console.log('\nSORUNLAR:');
  bad.forEach(b => console.log('  ✗ ' + b));
  process.exit(1);
}
console.log('✓ Hover ve tıklama panel konumunu değiştirmiyor; taşma ve header kayması yok.');
