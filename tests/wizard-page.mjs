/* =====================================================================
   DADAFIT — "PROGRAMINI BUL" TAM SAYFA SİHİRBAZI TESTİ  (R13 · 5. tur)
   ---------------------------------------------------------------------
   Neyi kanıtlar (brief'in kabul ölçütleri, tek tek):
     1. `programini-bul-v1.html` HTTP 200
     2. Sihirbaz pop-up düğümü SİTE GENELİNDE 0 — `.wz-overlay`, `.wz-modal`,
        `#wzModal`, `[data-fit-wizard]`, `[data-fit-wizard-host]` hiçbir
        sayfada yok; sihirbaz içeriği taşıyan `role="dialog"` / `aria-modal`
        düğümü de yok. (Kabuğun kendi katmanları — çerez, giriş kapısı, pro
        kapısı, geri bildirim — sihirbaz değildir, sayılmaz.)
     3. Üç adım ileri-geri çalışıyor; geri dönünce yanıtlar duruyor
     4. Yanıtsız adımda "İleri" ilerletmiyor, uyarı gösteriyor
     5. Sonuç TAM 3 program kartı veriyor; üçü de diskte var olan gerçek
        slug'a gidiyor (HTTP 200 + program-detay/challenge VERI tablosu)
     6. "Baştan başla" adım 1'e döndürüyor ve yanıtları siliyor
     7. Risk yanıtında kişisel program önerilmiyor, uzmana yönlendiriliyor
     8. Karşılıksız kombinasyon 0 — 15 amaç×seviye bileşiminin hepsi 3 kart

   Çalıştırma:
     python3 -m http.server 8811 &
     node tests/wizard-page.mjs
     node tests/wizard-page.mjs http://localhost:8811 1440,390
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE   = process.argv[2] || 'http://localhost:8811';
const WIDTHS = (process.argv[3] || '1440,390').split(',').map(Number);
const SAYFA  = 'programini-bul-v1.html';
const PAGES  = readdirSync(new URL('..', import.meta.url))
  .filter(f => f.endsWith('.html') && f !== 'index.html').sort();

/* program-detay-v1.html ve challenge-v1.html'in VERI tablolarındaki slug'lar */
const GERCEK = new Set([
  'program-detay-v1.html?slug=4-hafta-ev-antrenmani',
  'program-detay-v1.html?slug=8-hafta-mobilite',
  'program-detay-v1.html?slug=12-hafta-guc-temeli',
  'program-detay-v1.html?slug=8-hafta-salon-kondisyon',
  'challenge-v1.html?slug=hareket-aliskanligi',
  'challenge-v1.html?slug=sabah-esneme',
  'challenge-v1.html?slug=adim-adim-yuruyus'
]);

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

const browser = await chromium.launch();

/* ---------- 1 · sayfa var mı ---------- */
{
  const r = await fetch(`${BASE}/${SAYFA}`);
  if (r.status === 200) ok(`${SAYFA} → HTTP 200`);
  else rec('sayfa yok', `${SAYFA} → HTTP ${r.status}`);
}

/* ---------- 2 · pop-up kalıntısı SİTE GENELİ ---------- */
{
  const ctx = await browser.newContext({ viewport:{ width:1440, height:900 } });
  const kirli = [];
  for (const f of PAGES) {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil:'networkidle', timeout:30000 });
      const r = await page.evaluate(() => {
        const q = s => document.querySelectorAll(s).length;
        const kalinti = q('.wz-overlay') + q('.wz-modal') + q('#wzModal') + q('#wzOverlay') +
                        q('[data-fit-wizard]') + q('[data-fit-wizard-host]');
        /* sihirbaz içeriği taşıyan katman var mı? */
        const katman = [...document.querySelectorAll('[role="dialog"],[aria-modal]')]
          .filter(el => el.querySelector('.pb-opt,.pb-card,.wz-opt,.wz-panel')).length;
        return { kalinti, katman, wizardApi: typeof (window.FIT_SHELL||{}).wizard };
      });
      if (r.kalinti || r.katman || r.wizardApi !== 'undefined')
        kirli.push(`${f} — kalıntı ${r.kalinti} · katman ${r.katman} · FIT_SHELL.wizard ${r.wizardApi}`);
    } catch (e) { rec('gezinme', `${f} — ${e.message}`); }
    await page.close();
  }
  if (!kirli.length) ok(`pop-up düğümü ${PAGES.length}/${PAGES.length} sayfada 0`);
  else rec('pop-up kalıntısı', kirli.join('\n      '));
  await ctx.close();
}

/* ---------- sihirbaz sürücüsü ---------- */
async function sec(page, k, v){
  await page.click(`.pb-step.on .pb-opt[data-k="${k}"][data-v="${v}"]`);
}
async function durum(page){
  return page.evaluate(() => ({
    adim: document.querySelector('.pb-step.on')?.getAttribute('data-ix'),
    no: document.getElementById('pbNo').textContent.trim(),
    rayOn: [...document.querySelectorAll('#pbRail li')].map(li => li.classList.contains('on')),
    uyari: document.getElementById('pbWarn').classList.contains('on'),
    footGizli: document.getElementById('pbFoot').style.display === 'none',
    hits: [...document.querySelectorAll('#pbHits .pb-hit')].map(a => a.getAttribute('href')),
    risk: document.querySelectorAll('.pb-risk').length,
    secili: [...document.querySelectorAll('.pb-opt[aria-pressed="true"]')]
              .map(b => b.getAttribute('data-k')+':'+b.getAttribute('data-v'))
  }));
}
async function ileri(page){ await page.click('#pbNext'); await page.waitForTimeout(60); }
async function geri(page){ await page.click('#pbBack'); await page.waitForTimeout(60); }

/* tek tur: üç adımı yanıtla, sonuca çık */
async function tur(page, {amac='aliskanlik', seviye='yeni', mekan=['ev'], ekipman=['yok'], sure='10', risk=['yok']}={}){
  await sec(page,'amac',amac); await sec(page,'seviye',seviye); await ileri(page);
  for (const m of mekan) await sec(page,'mekan',m);
  for (const e of ekipman) await sec(page,'ekipman',e);
  await ileri(page);
  await sec(page,'sure',sure);
  for (const r of risk) await sec(page,'risk',r);
  await ileri(page);
  return durum(page);
}

for (const width of WIDTHS) {
  console.log(`\n=== @${width} ===`);
  const ctx = await browser.newContext({ viewport:{ width, height: width<600?844:900 } });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console', m => { if (m.type()==='error') konsol.push(m.text()); });
  page.on('pageerror', e => konsol.push('PAGEERROR ' + e.message));
  await page.goto(`${BASE}/${SAYFA}`, { waitUntil:'networkidle', timeout:30000 });
  await page.waitForTimeout(300);

  /* Motor yoksa (sayfa hiç yok ya da sihirbaz hâlâ pop-up) buradan ötesi
     ölçülemez: temiz bir kırmızı ver, yığın izi ile patlama. */
  const kuruldu = await page.evaluate(() =>
    !!document.getElementById('pbNo') && document.querySelectorAll('.pb-step').length >= 4);
  if (!kuruldu) {
    rec('sihirbaz sayfası kurulmadı', `@${width} — ${SAYFA} içinde adım rayı/alt bar yok (tam sayfa sihirbaz bulunamadı)`);
    await ctx.close();
    continue;
  }

  /* --- 3 · açılış --- */
  {
    const d = await durum(page);
    if (d.adim==='0' && d.no==='Adım 1 / 3' && d.rayOn.join()==='true,false,false') ok('açılış: adım 1 / 3, ray ilk kalemde');
    else rec('açılış', JSON.stringify(d));
  }

  /* --- 4 · yanıtsız "İleri" ilerletmiyor --- */
  {
    await ileri(page);
    const d = await durum(page);
    if (d.adim==='0' && d.uyari) ok('yanıtsız adımda İleri ilerletmiyor, uyarı çıkıyor');
    else rec('boş adım kapısı', JSON.stringify(d));
  }

  /* --- 5 · üç adım ileri --- */
  {
    await sec(page,'amac','guc'); await sec(page,'seviye','orta'); await ileri(page);
    let d = await durum(page);
    if (d.adim!=='1' || d.no!=='Adım 2 / 3') rec('adım 2', JSON.stringify(d));
    await sec(page,'mekan','salon'); await sec(page,'ekipman','salon'); await ileri(page);
    d = await durum(page);
    if (d.adim!=='2' || d.no!=='Adım 3 / 3') rec('adım 3', JSON.stringify(d));
    else ok('adım 1 → 2 → 3 ileri çalışıyor');

    /* --- 6 · geri, yanıtlar duruyor --- */
    await geri(page); await geri(page);
    d = await durum(page);
    const korundu = d.secili.includes('amac:guc') && d.secili.includes('seviye:orta');
    if (d.adim==='0' && d.no==='Adım 1 / 3' && korundu) ok('geri çalışıyor, yanıtlar korunuyor');
    else rec('geri', JSON.stringify(d));

    /* --- 7 · sonuç: tam 3 gerçek program --- */
    await ileri(page); await ileri(page);
    await sec(page,'sure','30'); await sec(page,'risk','yok'); await ileri(page);
    d = await durum(page);
    if (d.hits.length===3) ok('sonuç: 3 program kartı');
    else rec('sonuç kart sayısı', `${d.hits.length} kart — ${JSON.stringify(d.hits)}`);
    const sahte = d.hits.filter(h => !GERCEK.has(h));
    if (!sahte.length) ok('3/3 kart gerçek program slug\'ına gidiyor');
    else rec('kırık slug', sahte.join(' · '));
    if (d.footGizli) ok('sonuçta adım barı kapanıyor');
    else rec('adım barı', 'sonuç ekranında hâlâ görünüyor');

    /* --- 8 · baştan başla --- */
    await page.click('#pbRestart'); await page.waitForTimeout(80);
    d = await durum(page);
    if (d.adim==='0' && d.no==='Adım 1 / 3' && d.secili.length===0) ok('"Baştan başla" adım 1\'e dönüyor, yanıtlar siliniyor');
    else rec('baştan başla', JSON.stringify(d));
  }

  /* --- 9 · risk dalı --- */
  {
    const d = await tur(page, {amac:'esneklik', seviye:'yeni', risk:['agri']});
    if (d.risk===1 && d.hits.length===0) ok('risk yanıtında kişisel program önerilmiyor, uzmana yönlendiriyor');
    else rec('risk dalı', JSON.stringify({risk:d.risk, hits:d.hits}));
    await page.click('#pbRestart'); await page.waitForTimeout(80);
  }

  /* --- 10 · karşılıksız kombinasyon 0 --- */
  {
    const AMAC = ['guc','esneklik','dayaniklilik','aliskanlik','kilo'];
    const SEV  = ['yeni','orta','ileri'];
    const bos = []; const hedefler = new Set();
    for (const a of AMAC) for (const s of SEV) {
      const d = await tur(page, {amac:a, seviye:s, mekan:['ev'], ekipman:['yok'], sure:'15', risk:['yok']});
      if (d.hits.length !== 3 || d.hits.some(h => !GERCEK.has(h))) bos.push(`${a}/${s} → ${JSON.stringify(d.hits)}`);
      d.hits.forEach(h => hedefler.add(h));
      await page.click('#pbRestart'); await page.waitForTimeout(60);
    }
    if (!bos.length) ok(`15/15 amaç×seviye bileşimi 3 gerçek program döndürdü (${hedefler.size} farklı hedef)`);
    else rec('karşılıksız kombinasyon', bos.join('\n      '));
  }

  /* --- 11 · konsol + yatay taşma --- */
  {
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (tasma <= 0) ok('yatay taşma 0'); else rec('yatay taşma', tasma + ' px');
    if (!konsol.length) ok('konsol hatası 0'); else rec('konsol', konsol.join(' | '));
  }

  await ctx.close();
}

/* ---------- 12 · sonuç hedeflerinin hepsi 200 ---------- */
{
  const kirik = [];
  for (const h of GERCEK) {
    const r = await fetch(`${BASE}/${h}`);
    if (r.status !== 200) kirik.push(`${h} → ${r.status}`);
  }
  if (!kirik.length) ok(`katalogdaki ${GERCEK.size} hedefin hepsi HTTP 200`);
  else rec('kırık hedef', kirik.join(' · '));
}

await browser.close();

console.log('');
if (fail) { console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
