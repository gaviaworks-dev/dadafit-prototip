/* =====================================================================
   DADAFIT — TAM SİTE TARAMASI  (R6 · birleştirme kapısı)
   ---------------------------------------------------------------------
   Depodaki HER *.html sayfasını verilen genişliklerde açar ve ölçer:
     · HTTP durumu 200 mü
     · konsol hatası / JS istisnası
     · yatay taşma (scrollWidth > clientWidth + 1)
     · 4xx/5xx dönen alt kaynak (img/script/css/svg)
     · kırık iç bağlantı (diskte karşılığı olmayan .html hedefi)
     · banner ailesi yüksekliği (liste 544/607/587 · detay 560/617/726)
     · R11 perde farkı: main.marginBottom − footer yüksekliği
   Kullanım: node tools/site-tarama.mjs [base] [genişlikler]
   ===================================================================== */
import { chromium } from '../tests/_pw.mjs';
import { readdirSync, existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8811';
const GEN  = (process.argv[3] || '1440,390').split(',').map(Number);
const KOK  = new URL('..', import.meta.url);
const SAYFALAR = readdirSync(KOK).filter(f => f.endsWith('.html')).sort();
const DISK = new Set(SAYFALAR);
const AILE = { liste:{1440:544,1024:607,390:587}, detay:{1440:560,1024:617,390:726} };

const b = await chromium.launch();
let sorun = [], toplam = 0;
const bannerSay = {}, perdeSap = [];

for (const w of GEN) {
  const ctx = await b.newContext({ viewport:{ width:w, height: w>900?900:844 } });
  for (const s of SAYFALAR) {
    const page = await ctx.newPage();
    const hata = [], kaynak = [];
    page.on('console', m => { if (m.type()==='error') hata.push(m.text().slice(0,120)); });
    page.on('pageerror', e => hata.push('PAGEERROR ' + e.message.slice(0,120)));
    page.on('response', r => { if (r.status()>=400) kaynak.push(`${r.status()} ${r.url().replace(BASE,'')}`); });
    let resp;
    try { resp = await page.goto(`${BASE}/${s}`, { waitUntil:'networkidle', timeout:30000 }); }
    catch(e){ sorun.push(`@${w} ${s} — açılmadı: ${e.message.split('\n')[0]}`); await page.close(); continue; }
    toplam++;
    if (resp.status() !== 200) sorun.push(`@${w} ${s} — HTTP ${resp.status()}`);
    await page.waitForTimeout(250);

    const r = await page.evaluate(() => {
      const d = document.documentElement;
      const kind = document.body.getAttribute('data-fit-hero-kind');
      const ban = document.querySelector('.lib-top,.fs-top,.kp-top,.ol-top,.ed-top,.cp-top,.chl-hero,.pd-hero,.fp-top');
      const main = document.getElementById('pageMain');
      const foot = document.querySelector('footer.footer');
      return {
        tasma: d.scrollWidth - d.clientWidth,
        kind, banH: ban ? Math.round(ban.getBoundingClientRect().height) : null,
        mb: main ? parseFloat(getComputedStyle(main).marginBottom) : null,
        fh: foot ? foot.getBoundingClientRect().height : null,
        ic: [...document.querySelectorAll('a[href$=".html"]')]
              .map(a => a.getAttribute('href').split('#')[0].split('?')[0])
              .filter(h => h && !h.startsWith('http'))
      };
    });

    if (r.tasma > 1) sorun.push(`@${w} ${s} — yatay taşma ${r.tasma}px`);
    if (hata.length)   sorun.push(`@${w} ${s} — konsol: ${[...new Set(hata)].slice(0,2).join(' | ')}`);
    if (kaynak.length) sorun.push(`@${w} ${s} — 4xx kaynak: ${[...new Set(kaynak)].slice(0,3).join(' | ')}`);
    const kirik = [...new Set(r.ic)].filter(h => !DISK.has(h));
    if (kirik.length) sorun.push(`@${w} ${s} — kırık iç bağlantı: ${kirik.join(', ')}`);

    if (r.kind && r.banH != null && AILE[r.kind] && AILE[r.kind][w] != null) {
      const bek = AILE[r.kind][w];
      const k = `${r.kind}@${w}`;
      (bannerSay[k] = bannerSay[k] || {}) [r.banH] = (bannerSay[k][r.banH]||0)+1;
      if (Math.abs(r.banH - bek) > 1) sorun.push(`@${w} ${s} — banner ${r.kind} ${r.banH} ≠ ${bek}`);
    }
    if (w === 1440 && r.mb != null && r.fh != null) {
      const fark = Math.abs(r.mb - r.fh);
      if (fark > 0.5) perdeSap.push(`${s} ${fark.toFixed(2)}px`);
    }
    await page.close();
  }
  await ctx.close();
}
await b.close();

console.log(`\n=== TAM SİTE TARAMASI · ${SAYFALAR.length} sayfa × ${GEN.join(',')} = ${toplam} yükleme ===`);
for (const [k,v] of Object.entries(bannerSay))
  console.log(`  banner ${k}: ${Object.entries(v).map(([h,n])=>`${h}px ×${n}`).join(' · ')}`);
console.log(`  R11 perde sapması (>0.5px): ${perdeSap.length ? perdeSap.join(', ') : '0 sayfa'}`);
if (!sorun.length) { console.log('\n✓ 0 sorun — HTTP · konsol · taşma · 4xx kaynak · kırık bağlantı temiz\n'); process.exit(0); }
console.log(`\n✗ ${sorun.length} sorun\n`); sorun.forEach(x => console.log('  · ' + x)); process.exit(1);
