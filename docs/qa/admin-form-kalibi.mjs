/* =====================================================================
   ADMIN FORM KALIBI DENETİMİ                                    (R19)
   ---------------------------------------------------------------------
   NE SORAR — `admin-kalip-denetim.mjs`in soramadığı soru:
   "Panelin FORM sayfaları birbirine ve Gastro'nun ölçülen kalıbına
   benziyor mu?"

   Kalıp kaynağı: `docs/gastro-olcum/form-kalibi.md` §1 — Gastro'nun
   SEKİZ içerik formunun sekizinde de aynı yedi parça, aynı sırayla.
   Referans uygulama: `admin-hareket-form-v1.html`.

   ⚠ Bu betik ekran listesini DİSKTEN okur (`admin-*.html`), MENU'den
   değil: form sayfaları sidebar'da görünmez, bir liste ekranından
   açılır. Yeni bir form dosyası eklendiğinde kendiliğinden ölçülür.

   Koşum: BASE=http://127.0.0.1:8788 PW_HOME=~/.pw node docs/qa/admin-form-kalibi.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const GENISLIK = [1440, 1024, 768, 390];

/* Form sayfası = adı `-form-` ya da `-kurgu-` taşıyan admin ekranı. */
const FORMLAR = readdirSync('.')
  .filter((f) => /^admin-.*(-form|-kurgu)-v1\.html$/.test(f))
  .sort();

/* Kalıbın yedi parçası + dürüstlük ve erişilebilirlik kalemleri. */
const b = await chromium.launch();
const sayfa = await b.newPage({ viewport: { width: 1440, height: 1100 } });

const satirlar = [];
const kusurlar = [];

for (const dosya of FORMLAR) {
  const konsol = [];
  const dinle = (m) => { if (m.type() === 'error') konsol.push(m.text()); };
  const patla = (e) => konsol.push('PAGEERROR ' + e.message);
  sayfa.on('console', dinle);
  sayfa.on('pageerror', patla);

  await sayfa.setViewportSize({ width: 1440, height: 1100 });
  await sayfa.goto(`${BASE}/${dosya}`, { waitUntil: 'networkidle' });
  await sayfa.waitForTimeout(450);

  const m = await sayfa.evaluate(() => {
    const q = (s) => document.querySelectorAll(s).length;
    const st = (s, p) => {
      const e = document.querySelector(s);
      return e ? getComputedStyle(e)[p] : null;
    };
    /* Dokunma hedefi: admin'in KENDİ bileşenleri. Ham `input`/`select`
       ölçülmez — hedef kutunun kendisidir (kit §16, `.ms-search` notu). */
    const kucuk = [...document.querySelectorAll(
      '.btn,a.btn,.adm-ico-btn,.adm-pg,.sa-form-tab,.chip-sec,.ie-drag,.ie-del,.add-row,.adm-ed-b,.mk-kl,.toggle')]
      .filter((x) => x.getClientRects().length && x.offsetParent !== null)
      .filter((x) => {
        const k = x.getBoundingClientRect();
        const on = getComputedStyle(x, '::before');
        const h = Math.max(k.height, parseFloat(on.height) || 0);
        return h < 44;
      }).length;
    /* Boş durumun dört parçası (kit §9). */
    const bosKusur = [...document.querySelectorAll('.fpx-bos')]
      .filter((c) => !(c.querySelector('.pe-ico') && c.querySelector('h4') && c.querySelector('p'))).length;
    /* Kaydet çubuğu SAĞDA (Gastro kanonu, 9 sayfa CSS'inde birebir). */
    const fa = document.querySelector('.form-actions');
    return {
      h1: q('h1'),
      geri: q('.back-link'),
      src: q('.adm-src'),
      layout: q('.form-layout'),
      yan: q('.side-card'),
      yanSticky: st('.side-card', 'position'),
      sekme: q('.sa-form-tab'),
      panel: q('.sa-form-panel'),
      sec: q('.form-sec'),
      alan: q('.finput,.fselect,.ftext,.fk-input,.fk-select,.fk-textarea'),
      frow: q('.frow,.fk-field'),
      kaydet: fa ? getComputedStyle(fa).justifyContent : null,
      kaydetBtn: q('.form-actions .btn'),
      seo: q('.seo-score'),
      yikici: q('[data-yikici]'),
      toplu: q('.adm-bulk'),
      dil: q('.lang-tabs,.lang-pane'),
      inlineStil: [...document.querySelectorAll('[style]')]
        .filter((e) => /(?:^|;)\s*(color|font-size|padding|margin|border)\s*:/.test(e.getAttribute('style') || '')).length,
      olu: [...document.querySelectorAll('a[href="#"]')].length,
      /* 🔴 `pattern` ÖZNİTELİĞİ TARAYICIDA DERLENİYOR MU?
         Ölçülmüş kusur (B5 ajanı buldu, 6 dosyada): Chromium `pattern`ı
         `v` bayrağıyla derliyor ve orada karakter sınıfının SONUNDAKİ
         çıplak `-` GEÇERSİZ. `[a-z0-9-]+` `u` kipinde geçerli, `v` kipinde
         değil — yani kusur ancak doğrulama ANINDA, konsolda görünüyor.
         Sonucu bu depoda en çok kovaladığımız yalan: `reportValidity()`
         patlıyor, form DOĞRULANMIYOR, ama maket notu yine de "Form
         doğrulandı" diye basılıyor.
         Ders `admin-challenge-v1.html`in kendi yorumunda ZATEN yazılıydı;
         yeni dosyalara uygulanmadı. Belgeye yazılan ders kapıya yazılmadıkça
         bir sonraki dosyada geri gelir — bu yüzden burada. */
      kotuPattern: [...document.querySelectorAll('[pattern]')]
        .map((e) => e.getAttribute('pattern'))
        .filter((v) => { try { new RegExp('^(?:' + v + ')$', 'v'); return false; } catch (x) { return true; } }),
      kucuk, bosKusur,
      link: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
    };
  });

  /* Yatay taşma — dört genişlik. */
  const tasan = [];
  for (const w of GENISLIK) {
    await sayfa.setViewportSize({ width: w, height: 900 });
    await sayfa.waitForTimeout(160);
    const t = await sayfa.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (t > 0) tasan.push(`${w}:${t}px`);
  }

  sayfa.off('console', dinle);
  sayfa.off('pageerror', patla);

  const d = [];
  if (m.h1 !== 1) d.push(`gövdede h1 ${m.h1} (1 olmalı)`);
  if (!m.geri) d.push('geri bağlantısı yok');
  if (m.src !== 1) d.push(`kaynak şeridi ${m.src} (1 olmalı)`);
  if (!m.layout) d.push('.form-layout yok — iki kolon kurulmamış');
  if (!m.yan) d.push('.side-card yok — yayın kolonu kurulmamış');
  if (m.yan && m.yanSticky !== 'sticky') d.push(`yan kart sticky değil (${m.yanSticky})`);
  if (m.sekme && m.sekme !== m.panel) d.push(`sekme ${m.sekme} ≠ panel ${m.panel}`);
  if (!m.sec) d.push('.form-sec yok — bölümleme kurulmamış');
  if (!m.alan) d.push('hiç form alanı yok');
  if (m.kaydet && m.kaydet !== 'flex-end') d.push(`kaydet çubuğu sağda değil (${m.kaydet})`);
  if (!m.kaydetBtn) d.push('kaydet çubuğunda düğme yok');
  if (m.toplu) d.push(`toplu eylem çubuğu var (${m.toplu}) — form sayfasında olmaz`);
  if (m.dil) d.push(`dil sekmesi var (${m.dil}) — Fit tek dilli`);
  if (m.olu) d.push(`ölü bağlantı href="#" × ${m.olu}`);
  if (m.kotuPattern.length) d.push(`v-kipinde derlenmeyen pattern: ${m.kotuPattern.join(' · ')}`);
  if (m.kucuk) d.push(`44px altı dokunma hedefi × ${m.kucuk}`);
  if (m.bosKusur) d.push(`eksik parçalı boş durum × ${m.bosKusur}`);
  if (tasan.length) d.push(`yatay taşma ${tasan.join(' ')}`);
  if (konsol.length) d.push(`konsol hatası × ${konsol.length}: ${konsol[0].slice(0, 90)}`);

  satirlar.push({
    dosya: dosya.replace(/^admin-|-v1\.html$/g, ''),
    sekme: m.sekme, sec: m.sec, alan: m.alan, frow: m.frow,
    seo: m.seo ? '✓' : '—', yikici: m.yikici, inline: m.inlineStil,
    kusur: d.length,
  });
  if (d.length) kusurlar.push({ dosya, d });
}

await b.close();

/* ---- rapor ---- */
const bas = ['ekran', 'sekme', 'bölüm', 'alan', 'satır', 'seo', 'yıkıcı', 'inline', 'kusur'];
const gen = bas.map((h, i) => Math.max(h.length,
  ...satirlar.map((s) => String(Object.values(s)[i]).length)));
console.log(bas.map((h, i) => h.padEnd(gen[i])).join('  '));
console.log(gen.map((g) => '─'.repeat(g)).join('  '));
for (const s of satirlar) {
  console.log(Object.values(s).map((v, i) => String(v).padEnd(gen[i])).join('  '));
}

console.log('\n════ SONUÇ ════');
console.log(`form sayfası ${satirlar.length} · kusurlu ${kusurlar.length}`);
console.log(`toplam alan ${satirlar.reduce((t, s) => t + s.alan, 0)} · ` +
            `toplam bölüm ${satirlar.reduce((t, s) => t + s.sec, 0)} · ` +
            `inline ölçü/renk ${satirlar.reduce((t, s) => t + s.inline, 0)}`);
if (kusurlar.length) {
  console.log('');
  for (const k of kusurlar) console.log(`🔴 ${k.dosya}\n   - ${k.d.join('\n   - ')}`);
  process.exitCode = 1;
} else {
  console.log('✅ yedi parçanın yedisi de her form sayfasında');
}
