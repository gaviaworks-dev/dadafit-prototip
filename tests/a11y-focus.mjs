/* =====================================================================
   DADAFIT — MODAL ODAK YÖNETİMİ TESTİ (belge §20)
   ---------------------------------------------------------------------
   Belge üç şey istiyor, üçü de ölçülüyor:
   1. "Modal açıldığında focus modal içine taşınmalıdır"
   2. "Modal kapandığında focus önceki öğeye dönmelidir"
   3. "Escape tuşuyla modal kapatılabilmelidir"
   Ek olarak Tab döngüsü: modal açıkken Tab ile arkadaki sayfaya KAÇILAMAZ.

   Kapsanan kabuk katmanları: mobil drawer · görüş bildir modalı · giriş kapısı.

   Çalıştırma:
     python3 -m http.server 8811 &
     node tests/a11y-focus.mjs
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE = process.argv[2] || 'http://localhost:8811';
let fail = 0; const bad = [];
const rec = m => { fail++; bad.push(m); };
const ok  = m => console.log('  ✓ ' + m);

const browser = await chromium.launch();

/* katman tanımları: nasıl açılır, kabı hangisi, nasıl kapanır */
const LAYERS = [
  { name:'mobil drawer', width:390, page:'dadafit-hub-v1.html',
    openSel:'#hamburger', box:'#drawer', openClass:'open',
    closeSel:'#drawerClose' },
  { name:'görüş modalı', width:1440, page:'dadafit-hub-v1.html',
    openSel:'#fbTab', box:'#fbModal', openClass:'show',
    closeSel:'#fbClose' },
  { name:'giriş kapısı', width:1440, page:'dadafit-hub-v1.html?lg=1',
    openSel:null, box:'#lgGate', openClass:'show', closeSel:null }
];

for(const L of LAYERS){
  const ctx = await browser.newContext({ viewport:{ width:L.width, height:900 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${L.page}`, { waitUntil:'load' });
  await page.waitForTimeout(800);
  console.log(`\n— ${L.name} (${L.width}px) —`);

  /* ---- aç ---- */
  if(L.openSel){
    const trg = page.locator(L.openSel);
    if(!(await trg.count())){ rec(`${L.name}: açma düğmesi ${L.openSel} yok`); await ctx.close(); continue; }
    await trg.click();
  }
  await page.waitForTimeout(600);

  const opened = await page.evaluate(({box, openClass}) => {
    const el = document.querySelector(box);
    if(!el) return null;
    const a = document.activeElement;
    return { isOpen: el.classList.contains(openClass),
             focusInside: el.contains(a),
             active: a ? (a.id || a.className || a.tagName) : null };
  }, L);

  if(!opened)          { rec(`${L.name}: kap ${L.box} yok`); await ctx.close(); continue; }
  if(!opened.isOpen)   { rec(`${L.name}: açılmadı (.${L.openClass} yok)`); await ctx.close(); continue; }
  ok('açıldı');

  /* 1 · odak içeride mi */
  if(!opened.focusInside) rec(`${L.name}: AÇILDIĞINDA ODAK İÇERİDE DEĞİL (§20) — odak: ${opened.active}`);
  else ok(`odak modalın içine taşındı (${String(opened.active).slice(0,40)})`);

  /* 2 · Tab döngüsü — 25 Tab sonra odak hâlâ içeride olmalı */
  for(let i=0;i<25;i++) await page.keyboard.press('Tab');
  const trapped = await page.evaluate(({box}) => {
    const el = document.querySelector(box), a = document.activeElement;
    return { inside: el.contains(a), active: a ? (a.id || a.className || a.tagName) : null };
  }, L);
  if(!trapped.inside) rec(`${L.name}: 25 Tab sonrası odak DIŞARI KAÇTI (§20) — odak: ${trapped.active}`);
  else ok('Tab döngüsü içeride tutuyor (25 Tab)');

  /* 3 · Escape ile kapanma + odak geri dönüşü */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  const closed = await page.evaluate(({box, openClass, openSel}) => {
    const el = document.querySelector(box), a = document.activeElement;
    return { stillOpen: el.classList.contains(openClass),
             active: a ? (a.id || a.className || a.tagName) : null,
             backOnTrigger: openSel ? (a === document.querySelector(openSel)) : null,
             locked: document.body.classList.contains('scroll-locked') };
  }, L);

  if(closed.stillOpen) rec(`${L.name}: Escape KAPATMADI (§20)`);
  else ok('Escape ile kapandı');
  if(closed.locked)    rec(`${L.name}: kapandı ama kaydırma kilidi kaldı`);
  else ok('kaydırma kilidi çözüldü');

  if(L.openSel){
    if(closed.backOnTrigger === false)
      rec(`${L.name}: KAPANINCA ODAK AÇAN ÖĞEYE DÖNMEDİ (§20) — odak: ${closed.active}`);
    else ok(`odak açan öğeye geri döndü (${L.openSel})`);
  } else {
    ok(`odak dönüşü kontrol edilmedi — bu katman düğmeyle değil URL parametresiyle açıldı (açan öğe yok)`);
  }

  await ctx.close();
}

await browser.close();
console.log(`\n${fail} sorun`);
if(bad.length){ console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ Kabuk katmanlarında odak içeri alınıyor, Tab döngüde kalıyor, Escape kapatıyor, odak geri dönüyor.');
