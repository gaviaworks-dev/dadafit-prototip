/* =====================================================================
   DADAFIT — FİT TESTİ YANIT KİLİDİ REGRESYON TESTİ  (R14 · 5. tur)
   ---------------------------------------------------------------------
   Neyi kanıtlar: uygunluk taramasında bir soruya verilen İLK yanıt
   kilitlenir ve sonradan değiştirilemez.

   Kök neden (2026-08-20'de ölçüldü): şıklar radyo düğmesiydi ve
   yanıt verildikten sonra da etkin kalıyordu. Kullanıcı riskli yanıtı
   ("Evet") verip testin durduğunu görüyor, sonra "Hayır"a basıp
   taramayı yeniden gönderiyor ve test AÇILIYORDU. Yedi test slug'ının
   hepsinde ölçüldü: 14 şıktan kilitli **0**. Yani güvenlik kapısı
   kapı değildi.

   Kilit üç katmanlıdır — biri eksikse test kırmızıya döner:
     1. `disabled`        → tıklama ve klavye seçimi biter
     2. `aria-disabled`   → ekran okuyucu durumu duyurur
     3. `tabindex="-1"`   → odak sırasından çıkar

   Ayrıca kontrol edilir:
   · riskli yanıt verildiğinde GÜVENLİ şık ayrıca işaretleniyor
     (`.ft-opt.is-safe`) — kullanıcı neyin temiz sayıldığını görsün
   · ikinci tıklama seçimi değiştirmiyor
   · riskli yanıt geri alınamıyor: yeniden gönderimde test yine kapalı
   · "Taramayı sıfırla" kilidi ÜÇ katmanıyla birlikte kaldırıyor
   · kapı hâlâ çalışıyor: yedi yanıt da temizse test AÇILIYOR
     (kilit, testi büsbütün kapatan bir regresyona dönüşmemeli)

   Çalıştırma:
     python3 -m http.server 8811 &          # repo kökünde
     node tests/fit-test-lock.mjs           # varsayılan http://localhost:8811
     node tests/fit-test-lock.mjs http://localhost:8811 1440,390
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE   = process.argv[2] || 'http://localhost:8811';
const WIDTHS = (process.argv[3] || '1440,390').split(',').map(Number);

/* Yedi testin hepsi AYNI sayfayı kullanır (?test=<slug>), ama slug içeriği
   değiştirdiği için hepsi tek tek koşulur — R14 "bu tek sayfaya özel değil"
   diyor ve tek slug'a bakmak yanıltıcı olurdu. */
const SLUGS = [
  'baslangic-seviyesi', 'dayaniklilik', 'denge', 'hareket-aliskanligi',
  'masa-basi-yasam', 'mobilite', 'temel-kuvvet'
];

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 } });
  let temiz = 0;

  for (const slug of SLUGS) {
    const tag = `${slug} @${width}`;
    const page = await ctx.newPage();
    const jsErr = [];
    page.on('pageerror', e => jsErr.push(String(e).slice(0, 120)));

    try {
      await page.goto(`${BASE}/fit-testi-detay-v1.html?test=${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(350);

      const r = await page.evaluate(async () => {
        const form = document.getElementById('ftScr');
        if (!form) return { yok: true };
        const inp = (n, v) => form.querySelector(`input[name="${n}"][value="${v}"]`);
        const bekle = ms => new Promise(r => setTimeout(r, ms));
        const out = {};

        /* 1 · ilk tıklama kilitler (üç katman birden) */
        inp('q1', 'evet').click(); await bekle(120);
        const q1 = [...form.querySelectorAll('input[name="q1"]')];
        out.katman1 = q1.every(i => i.disabled);
        out.katman2 = q1.every(i => i.getAttribute('aria-disabled') === 'true');
        out.katman3 = q1.every(i => i.tabIndex === -1);
        out.ilkSecim = (form.querySelector('input[name="q1"]:checked') || {}).value;

        /* 2 · riskli yanıtta güvenli şık işaretli */
        out.temizYanitIsareti = !!form.querySelector('.ft-q[data-q="1"] .ft-opt.is-safe');

        /* 3 · ikinci tıklama seçimi DEĞİŞTİRMİYOR */
        inp('q1', 'hayir').click(); await bekle(120);
        out.ikinciSecim = (form.querySelector('input[name="q1"]:checked') || {}).value;

        /* 4 · kalan altı soru da kilitleniyor */
        for (let i = 2; i <= 7; i++) { inp('q' + i, 'hayir').click(); await bekle(50); }
        const all = [...form.querySelectorAll('input[type=radio]')];
        out.toplam   = all.length;
        out.kilitli  = all.filter(i => i.disabled && i.getAttribute('aria-disabled') === 'true').length;
        out.odakDisi = all.filter(i => i.tabIndex === -1).length;

        /* 5 · riskli yanıt varken test AÇILMIYOR */
        form.querySelector('button[type=submit]').click(); await bekle(320);
        out.testKapali = document.getElementById('ftSteps').hidden === true
                      && document.getElementById('ftStop').hidden === false;

        /* 6 · riskli yanıt GERİ ALINAMIYOR */
        inp('q1', 'hayir').click(); await bekle(120);
        form.querySelector('button[type=submit]').click(); await bekle(320);
        out.halaKapali = document.getElementById('ftSteps').hidden === true;

        /* 7 · sıfırlama kilidi üç katmanıyla kaldırıyor */
        document.getElementById('ftScrReset').click(); await bekle(320);
        const all2 = [...form.querySelectorAll('input[type=radio]')];
        out.sifirKilit = all2.filter(i => i.disabled || i.hasAttribute('aria-disabled') || i.tabIndex === -1).length;
        out.sifirSecim = all2.filter(i => i.checked).length;
        out.sifirMesaj = form.querySelectorAll('.ft-lockmsg').length;
        out.sifirSafe  = form.querySelectorAll('.ft-opt.is-safe').length;

        /* 8 · kapı hâlâ çalışıyor: temiz turda test AÇILIYOR */
        for (let i = 1; i <= 7; i++) { inp('q' + i, 'hayir').click(); await bekle(50); }
        form.querySelector('button[type=submit]').click(); await bekle(380);
        out.temizTurAcildi = document.getElementById('ftSteps').hidden === false;

        return out;
      });

      if (r.yok) { rec(tag, 'tarama formu (#ftScr) bulunamadı'); }
      else {
        if (!r.katman1) rec(tag, 'kilit katmanı 1 yok: input.disabled kurulmadı');
        if (!r.katman2) rec(tag, 'kilit katmanı 2 yok: aria-disabled kurulmadı');
        if (!r.katman3) rec(tag, 'kilit katmanı 3 yok: tabindex=-1 kurulmadı');
        if (!r.temizYanitIsareti) rec(tag, 'riskli yanıtta güvenli şık işaretlenmedi (.ft-opt.is-safe yok)');
        if (r.ikinciSecim !== r.ilkSecim)
          rec(tag, `ikinci tıklama seçimi DEĞİŞTİRDİ: "${r.ilkSecim}" → "${r.ikinciSecim}"`);
        if (r.kilitli !== r.toplam)
          rec(tag, `şıkların hepsi kilitlenmedi: ${r.kilitli}/${r.toplam}`);
        if (r.odakDisi !== r.toplam)
          rec(tag, `şıkların hepsi odak sırasından çıkmadı: ${r.odakDisi}/${r.toplam}`);
        if (!r.testKapali)  rec(tag, 'riskli yanıta rağmen test adımları açıldı');
        if (!r.halaKapali)  rec(tag, 'riskli yanıt GERİ ALINDI ve test açıldı — R14 kapısı delik');
        if (r.sifirKilit)   rec(tag, `sıfırlama sonrası hâlâ kilitli ${r.sifirKilit} şık`);
        if (r.sifirSecim)   rec(tag, `sıfırlama sonrası hâlâ seçili ${r.sifirSecim} şık`);
        if (r.sifirMesaj)   rec(tag, `sıfırlama sonrası kilit mesajı silinmedi (${r.sifirMesaj})`);
        if (r.sifirSafe)    rec(tag, `sıfırlama sonrası "temiz yanıt" işareti silinmedi (${r.sifirSafe})`);
        if (!r.temizTurAcildi) rec(tag, 'yedi yanıt da temizken test AÇILMADI — kilit kapıyı kilitledi');
        if (!bad.some(x => x.startsWith(tag))) temiz++;
      }
      if (jsErr.length) rec(tag, 'JS istisnası: ' + jsErr[0]);
    } catch (e) {
      rec(tag, 'HATA: ' + String(e).slice(0, 100));
    }
    await page.close();
  }

  ok(`@${width}: ${temiz}/${SLUGS.length} test slug'ında yanıt kilidi tam`);
  await ctx.close();
}

await browser.close();

console.log(`\n${fail} sorun`);
if (fail) { console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ İlk yanıt kilitleniyor (disabled + aria-disabled + tabindex), ikinci tıklama');
console.log('✓ seçimi değiştirmiyor, riskli yanıt geri alınamıyor, sıfırlama kilidi kaldırıyor,');
console.log('✓ ve temiz turda kapı hâlâ açılıyor.');
