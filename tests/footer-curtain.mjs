/* =====================================================================
   DADAFIT — FOOTER PERDESİ REGRESYON TESTİ  (R11 · 5. tur)
   ---------------------------------------------------------------------
   Neyi kanıtlar: footer "reveal" perdesi footer'a YAPIŞIK; perdeden
   sonra belge dibinde artık içerik kalmıyor ve sağlık şeridi perdenin
   İÇİNDE.

   Kök neden (2026-08-20'de ölçüldü): sağlık şeridi (`.fit-health`)
   `body`nin çocuğu olarak footer'dan hemen önce basılıyordu — yani
   perdenin (`#pageMain`) DIŞINDA. Perde efekti `main`e footer yüksekliği
   kadar `margin-bottom` verip footer'ı alttan ortaya çıkarır; şerit o
   boşluğun ALTINA düştüğü için iki sonuç doğuyordu:
     1. Perdenin alt kenarı footer'ın üstünden **310 px** yukarıda
        kalıyordu → ölü gri şerit.
     2. Şerit `position:static` (z-index auto) olduğu için `z-index:1`
        taşıyan SABİT footer'ın altına boyanıyordu → sağlık ve güvenlik
        şeridi masaüstünde **hiç görünmüyordu**.
   Referans (dadadiet.com/diyetisyen-bul @1440, sayfa sonunda): perde
   boşluğu −0.3 px. DadaFit ölçümü aynı noktada −310.3 px idi.

   ÖLÇÜM KAYDIRMADAN BAĞIMSIZ: kaydırma konumu tarayıcı tarafından tam
   sayıya yuvarlanıyor ve ±0.5 px gürültü üretiyor. Bu yüzden değişmez
   şu iki büyüklükten okunuyor:
     · `margin-bottom` − footer yüksekliği   → 0 olmalı (perde tam oturur)
     · perde sonu ile belge sonu farkı       → 0 olmalı (kuyruk kalmaz)

   ≤640 px'te perde kipi kapalıdır (footer normal akışta). Orada tek
   beklenti: sağlık şeridi yine perdenin içinde ve `margin-bottom` yok.

   Çalıştırma:
     python3 -m http.server 8811 &
     node tests/footer-curtain.mjs
     node tests/footer-curtain.mjs http://localhost:8811 1440,390
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE   = process.argv[2] || 'http://localhost:8811';
const WIDTHS = (process.argv[3] || '1440,390').split(',').map(Number);
const PAGES  = readdirSync(new URL('..', import.meta.url))
  .filter(f => f.endsWith('.html') && f !== 'index.html').sort();

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const perdeKipi = width >= 641;
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 } });
  const farkSet = new Map(); let icerde = 0, n = 0;

  for (const f of PAGES) {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(400);

      const r = await page.evaluate(async () => {
        /* sayfa sonuna inip geri dön: tembel yüklenen içerik yüksekliği
           oturur, sonra ölçüm kaydırmadan bağımsız yapılır */
        for (let i = 0; i < 2; i++) {
          window.scrollTo(0, document.documentElement.scrollHeight);
          await new Promise(r => setTimeout(r, 320));
        }
        window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 220));

        const foot = document.querySelector('footer.footer');
        const main = document.getElementById('pageMain');
        if (!foot || !main) return { yok: true };
        const mc = getComputedStyle(main);
        const mb = parseFloat(mc.marginBottom) || 0;
        const fh = foot.getBoundingClientRect().height;
        const perdeSonu = main.offsetTop + main.getBoundingClientRect().height + mb;
        return {
          fark:   +(mb - fh).toFixed(1),
          kuyruk: +(document.documentElement.scrollHeight - perdeSonu).toFixed(1),
          mb, kip: mc.position === 'relative' ? 'perde' : 'statik',
          saglikIcerde: !!main.querySelector('.fit-health'),
          saglikVar: !!document.querySelector('.fit-health')
        };
      });

      if (r.yok) { rec(`${f} @${width}`, 'main (#pageMain) ya da footer.footer yok'); await page.close(); continue; }
      n++;
      if (r.saglikVar && !r.saglikIcerde)
        rec(`${f} @${width}`, 'sağlık şeridi perdenin DIŞINDA — footer altında kaybolur');
      else if (r.saglikVar) icerde++;

      if (perdeKipi) {
        farkSet.set(r.fark, (farkSet.get(r.fark) || 0) + 1);
        if (Math.abs(r.kuyruk) > 1)
          rec(`${f} @${width}`, `perdeden sonra ${r.kuyruk} px kuyruk kaldı — perde footer'a oturmuyor`);
      } else if (r.mb > 1) {
        rec(`${f} @${width}`, `≤640'ta perde kipi kapalı olmalı ama margin-bottom ${r.mb} px`);
      }
    } catch (e) {
      rec(`${f} @${width}`, 'HATA: ' + String(e).slice(0, 90));
    }
    await page.close();
  }

  if (perdeKipi) {
    const degerler = [...farkSet.keys()];
    if (degerler.length !== 1 || Math.abs(degerler[0]) > 0.5)
      rec(`@${width}`, `perde boşluğu tek değere oturmadı: ${JSON.stringify([...farkSet.entries()])}`);
    else ok(`@${width}: ${n} sayfa · margin-bottom − footer yüksekliği = ${degerler[0]} (tek değer)`);
  } else {
    ok(`@${width}: ${n} sayfa · perde kipi kapalı, footer normal akışta`);
  }
  ok(`@${width}: sağlık şeridi perdenin içinde ${icerde}/${n}`);
  await ctx.close();
}

await browser.close();

console.log(`\n${fail} sorun`);
if (fail) { console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ Perde footer\'a yapışık (fark 0), perdeden sonra kuyruk yok,');
console.log('✓ sağlık şeridi perdenin içinde ve footer altında kaybolmuyor.');
