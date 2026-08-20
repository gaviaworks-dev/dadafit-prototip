/* =====================================================================
   DADAFIT — KIRINTI ANA SAYFA İKONU REGRESYON TESTİ  (R3 · R12)
   ---------------------------------------------------------------------
   İki turun garantisini birlikte korur:

   R3 (4. tur) — kırıntının ilk kalemi YALNIZ İKON:
     · ilk kalemde metin düğümü yok
     · erişilebilir ad var (`.sr-only`) ve kutusu 1×1 px (gerçekten görünmez)
     · ikon yüksekliği ≤ kırıntı satır yüksekliği

   R12 (5. tur) — ikon ÖLÇÜSÜ referansla eşit:
     Ölçüm (dadadiet.com/beslenme ve /diyetisyen-bul, @1440 ve @390):
       ev ikonu font-size 9px · kutu 10.1 × 9 px
       ev ikonu ile chevron ayracı AYNI boyutta
       ikon → ayraç boşluğu 9 px
     Önce DadaFit'te ikon 13 px, ayraç 9 px idi — ev ikonu kendi ayracından
     %44 daha iriydi ve kırıntı satırının ritmini bozuyordu.

   RENK kasten test edilmez: referans `rgba(255,255,255,.4)` kullanıyor,
   DadaFit kendi yeşilinde kalıyor (KARARLAR K29) — ölçü alınır, palet alınmaz.

   İSTİSNA: `dadafit-hub-v1.html`. Kırıntısının ilk kalemi "Dada Gastro",
   yani kardeş marka portalı — DadaFit ana sayfası değil (sayfanın kendisi
   ana sayfa). 4. turda bilerek bırakıldı, 5. tur brief'i de dokunulmamasını
   söylüyor.

   Çalıştırma:
     node tests/crumb-home.mjs [base] [genişlikler]
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE   = process.argv[2] || 'http://localhost:8811';
const WIDTHS = (process.argv[3] || '1440,390').split(',').map(Number);
const PAGES  = readdirSync(new URL('..', import.meta.url)).filter(f => f.endsWith('.html')).sort();
const ISTISNA = new Set(['dadafit-hub-v1.html']);

/* referanstan ölçülen değerler */
const REF = { fs: 9, w: 10.1, h: 9, ayracBosluk: 9 };

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 } });
  let n = 0, temiz = 0;

  for (const f of PAGES) {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(200);
      const r = await page.evaluate(() => {
        const px = v => +parseFloat(v || 0).toFixed(1);
        const cr = document.querySelector('.lib-crumb,.rd-crumb,.cp-crumb,.ed-crumb,.pf-crumb,.kp-crumb,.pd-crumb,.df-crumb');
        if (!cr || !cr.firstElementChild) return { yok: true };
        const first = cr.firstElementChild, c = getComputedStyle(cr);
        const ic = first.querySelector('i'), sr = first.querySelector('.sr-only');
        const sep = [...cr.children].find(e => e !== first && e.tagName === 'I');
        return {
          evIkonu: !!(ic && /fa-house/.test(ic.className)),
          txt: [...first.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent.trim()).filter(Boolean),
          fs: ic ? parseFloat(getComputedStyle(ic).fontSize) : null,
          w:  ic ? px(ic.getBoundingClientRect().width)  : null,
          h:  ic ? px(ic.getBoundingClientRect().height) : null,
          lh: px(c.lineHeight),
          acc: sr ? sr.textContent.trim() : '',
          srW: sr ? px(sr.getBoundingClientRect().width) : null,
          ayracBosluk: (ic && sep) ? px(sep.getBoundingClientRect().left - ic.getBoundingClientRect().right) : null,
          ayracFs: sep ? parseFloat(getComputedStyle(sep).fontSize) : null
        };
      });

      if (r.yok) { await page.close(); continue; }          /* kırıntısı olmayan sayfa (index) */
      if (ISTISNA.has(f)) { await page.close(); continue; }
      n++;
      const tag = `${f} @${width}`;

      if (!r.evIkonu) { rec(tag, 'kırıntının ilk kaleminde ev ikonu yok'); await page.close(); continue; }
      /* R3 */
      if (r.txt.length)      rec(tag, `ilk kalemde metin düğümü kaldı: ${JSON.stringify(r.txt)}`);
      if (!r.acc)            rec(tag, 'erişilebilir ad yok (.sr-only boş)');
      if (r.srW > 1.5)       rec(tag, `.sr-only gerçekten gizli değil: genişlik ${r.srW} px`);
      if (r.h > r.lh + 0.5)  rec(tag, `ikon satır yüksekliğini aşıyor: ${r.h} > ${r.lh}`);
      /* R12 */
      if (Math.abs(r.fs - REF.fs) > 0.1)   rec(tag, `ikon font-size ${r.fs} px — referans ${REF.fs} px`);
      if (Math.abs(r.w - REF.w) > 0.6)     rec(tag, `ikon genişliği ${r.w} px — referans ${REF.w} px`);
      if (Math.abs(r.h - REF.h) > 0.6)     rec(tag, `ikon yüksekliği ${r.h} px — referans ${REF.h} px`);
      if (r.ayracBosluk !== null && Math.abs(r.ayracBosluk - REF.ayracBosluk) > 0.6)
        rec(tag, `ikon→ayraç boşluğu ${r.ayracBosluk} px — referans ${REF.ayracBosluk} px`);
      if (r.ayracFs !== null && Math.abs(r.fs - r.ayracFs) > 0.1)
        rec(tag, `ev ikonu (${r.fs}) ile ayraç (${r.ayracFs}) aynı boyutta değil — referansta eşitler`);

      if (!bad.some(x => x.startsWith(tag))) temiz++;
    } catch (e) {
      rec(`${f} @${width}`, 'HATA: ' + String(e).slice(0, 90));
    }
    await page.close();
  }
  ok(`@${width}: ${temiz}/${n} sayfada ikon 9px · kutu 10.1×9 · ayraçla eşit · boşluk 9px · R3 garantisi yerinde`);
  await ctx.close();
}

await browser.close();
console.log(`\n${fail} sorun`);
if (fail) { console.log('\nSORUNLAR:'); bad.slice(0, 20).forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ Kırıntının ana sayfa kalemi yalnız ikon, ölçüsü referansla birebir,');
console.log('✓ ayraçla aynı optik ağırlıkta ve erişilebilir adı yerinde.');
