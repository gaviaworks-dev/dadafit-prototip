/* =====================================================================
   ROZETLERİM · KART SAĞ ÜST KÖŞESİ — ÇAKIŞMA VE KONTRAST SONDASI
   ---------------------------------------------------------------------
   NEDEN VAR: `.badge-lock` ve `.b-puan` aynı `position:relative` kabında
   BİREBİR aynı koordinata (top:12px right:14px) sabitlenmişti; kilitli
   kartta kilit ikonunun %100'ü puan etiketinin içine düşüyor, "+10"
   etiketi "+1" olarak okunuyordu (ölçüldü: kesişim 8.75 × 10 px = 87.5 px²,
   üç kırılımda da aynı). Ayrıca iki elemanın da kart zeminine karşı
   kontrastı 4.5:1'in üçte biri kadardı (1.78:1 ve 1.69:1).

   ÜÇ DURUMU DA GERÇEKTEN ÜRETİR — kod okumasıyla yetinmez:
     · kazanildi → `dm_fit_rozet_v1.kazanildi` mührü tohumlanır
     · kazanildi + yeni → mühür var, `gorulen` YOK (`.b-yeni` basılır)
     · olcusuz  → `FIT_ROZET.KATALOG` içinde bir rozetin `olcut`u null
                  yapılır (motorun kendi kuralı: `!r.olcut` → 'olcusuz')
     · yolda    → varsayılan hâl, tohum gerekmez
   Tohumlama SONDA TARAFINDADIR; kaynak dosyalara hiçbir şey eklenmez.

   GEÇME ÖLÇÜTLERİ (üç genişlik × dört durum)
     1. `.b-puan` ∩ `.badge-lock`  = 0 px²   (kilit ayrı eleman kaldıysa)
     2. `.b-puan` ∩ `.b-yeni`      = 0 px²
     3. `.b-puan` metin kontrastı  ≥ 4.5:1   (WCAG 2.1 · 1.4.3, 10px = normal metin)
     4. yatay taşma yok

   KULLANIM
     python3 -m http.server 8788 &
     PW_HOME=~/.pw node docs/qa/rozet-kose-cakisma.mjs
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const SAYFA = '/rozetlerim-v1.html';
const ESIK = 4.5;

/* Tohum: iki rozet mühürlenir. `ilk-hareket` görülmemiş kalır (→ .b-yeni),
   `aktif-7` görülmüş sayılır (→ yalnız .b-puan). Puanları 10 ve 25;
   tek ve çift haneli etiket birlikte ölçülsün diye seçildi. */
const YENI_SLUG = 'ilk-hareket';
const KAZANILMIS_SLUG = 'aktif-7';
const OLCUSUZ_SLUG = 'aktif-20';

/* ---- WCAG rölatif parlaklık ---- */
const kanal = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const parlaklik = ([r, g, b]) => 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
const kontrast = (a, b) => {
  const l1 = parlaklik(a), l2 = parlaklik(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
/* Yarı saydam metin rengini zeminiyle harmanla (alfa < 1 gerçek rengi değiştirir) */
const harmanla = (on, alt) => on[3] >= 1 ? on.slice(0, 3)
  : [0, 1, 2].map(i => on[i] * on[3] + alt[i] * (1 - on[3]));

const browser = await chromium.launch();
const hatalar = [];

for (const W of [1440, 768, 390]) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 1400 } });

  /* Sayfanın kendi scriptlerinden ÖNCE çalışır — mühür ilk boyamada yerinde olur. */
  await ctx.addInitScript(([yeniSlug, kazSlug]) => {
    try {
      localStorage.setItem('dm_fit_rozet_v1', JSON.stringify({
        surum: 1,
        kazanildi: { [yeniSlug]: '2026-08-14T09:00:00.000Z', [kazSlug]: '2026-08-20T09:00:00.000Z' },
        gorulen: { [kazSlug]: 1 }
      }));
    } catch (e) { /* özel pencere — sonda zaten kart bulamayınca patlar */ }
  }, [YENI_SLUG, KAZANILMIS_SLUG]);

  const pg = await ctx.newPage();
  pg.on('pageerror', e => hatalar.push(`@${W}px pageerror: ${e.message}`));
  await pg.goto(BASE + SAYFA, { waitUntil: 'load' });
  await pg.waitForTimeout(500);

  /* `olcusuz` durumu katalogda artık YOK (R20/K3 ile son ölçüsüz rozet de
     kapandı). Motorun kuralını kullanarak sonda tarafında bir tane üretiyoruz:
     `olcut` null olan rozet 'olcusuz' döner. Kaynak dosya değişmez. */
  const olcusuzKuruldu = await pg.evaluate((slug) => {
    const R = window.FIT_ROZET;
    if (!R) return false;
    const r = R.KATALOG.filter(x => x.slug === slug)[0];
    if (!r) return false;
    r.olcut = null;
    window.dispatchEvent(new Event('fit-rozet-degisti'));
    return true;
  }, OLCUSUZ_SLUG);
  if (!olcusuzKuruldu) hatalar.push(`@${W}px · olcusuz durumu kurulamadı (FIT_ROZET veya slug yok)`);
  await pg.waitForTimeout(300);

  const sonuc = await pg.evaluate(() => {
    /* Elemanın gerçekte üstüne bindiği rengi bul: kendi zemini saydamsa
       ataya çık. Kart zemini `transparent` olduğu için bu şart. */
    const oku = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
      const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
    const efektifZemin = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = oku(getComputedStyle(n).backgroundColor);
        if (c && c[3] > 0) return c;
        n = n.parentElement;
      }
      const c = oku(getComputedStyle(document.documentElement).backgroundColor);
      return (c && c[3] > 0) ? c : [255, 255, 255, 1];
    };
    const kesisim = (a, b) => {
      if (!a || !b) return 0;
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      const w = Math.min(ar.right, br.right) - Math.max(ar.left, br.left);
      const h = Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top);
      return (w > 0 && h > 0) ? +(w * h).toFixed(2) : 0;
    };

    const kartlar = [...document.querySelectorAll('.badge-card')];
    const sinifla = (c) => {
      if (c.classList.contains('locked')) return 'yolda';
      if (c.classList.contains('olcusuz')) return 'olcusuz';
      return c.querySelector('.b-yeni') ? 'kazanildi-yeni' : 'kazanildi';
    };
    const olc = (c) => {
      const puan = c.querySelector('.b-puan');
      if (!puan) return { hata: 'b-puan yok', rozet: c.dataset.rozet };
      const kilit = c.querySelector('.badge-lock');
      const yeni = c.querySelector('.b-yeni');
      const cs = getComputedStyle(puan);
      const zem = efektifZemin(puan);
      const pr = puan.getBoundingClientRect(), cr = c.getBoundingClientRect();
      return {
        rozet: c.dataset.rozet,
        metin: puan.textContent.trim().replace(/\s+/g, ' '),
        kutu: { x: +(pr.left - cr.left).toFixed(1), y: +(pr.top - cr.top).toFixed(1),
                w: +pr.width.toFixed(2), h: +pr.height.toFixed(2) },
        ayriKilitVar: !!kilit,
        kesisimKilit: kesisim(puan, kilit),
        kesisimYeni: kesisim(puan, yeni),
        renk: oku(cs.color),
        zemin: zem,
        kartIcinde: pr.left >= cr.left - 0.5 && pr.right <= cr.right + 0.5 && pr.top >= cr.top - 0.5
      };
    };

    const gruplar = {};
    kartlar.forEach(c => { const d = sinifla(c); (gruplar[d] = gruplar[d] || []).push(c); });
    const ornek = {};
    Object.keys(gruplar).forEach(d => { ornek[d] = { sayi: gruplar[d].length, ...olc(gruplar[d][0]) }; });

    /* Aynı durumdaki TÜM kartlarda kesişim var mı — tek örnekle yetinme. */
    const toplu = {};
    Object.keys(gruplar).forEach(d => {
      toplu[d] = {
        kilitKesisenKart: gruplar[d].filter(c => kesisim(c.querySelector('.b-puan'), c.querySelector('.badge-lock')) > 0).length,
        yeniKesisenKart: gruplar[d].filter(c => kesisim(c.querySelector('.b-puan'), c.querySelector('.b-yeni')) > 0).length,
        puanEksikKart: gruplar[d].filter(c => !c.querySelector('.b-puan')).length
      };
    });

    return {
      toplamKart: kartlar.length,
      ornek, toplu,
      yatayTasma: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  });

  console.log(`\n══════ @${W}px ══════  (${sonuc.toplamKart} kart)`);
  if (sonuc.yatayTasma) hatalar.push(`@${W}px · yatay taşma var`);

  const beklenen = ['kazanildi', 'kazanildi-yeni', 'yolda', 'olcusuz'];
  for (const durum of beklenen) {
    const o = sonuc.ornek[durum];
    if (!o) { hatalar.push(`@${W}px · '${durum}' durumunda kart ÜRETİLEMEDİ — ölçülemedi`);
              console.log(`  ${durum.padEnd(15)} · ÜRETİLEMEDİ`); continue; }
    if (o.hata) { hatalar.push(`@${W}px · ${durum}: ${o.hata}`); continue; }

    const t = sonuc.toplu[durum];
    const metinRenk = harmanla(o.renk, o.zemin);
    const or = +kontrast(metinRenk, o.zemin.slice(0, 3)).toFixed(2);

    const bayrak = [];
    if (t.kilitKesisenKart > 0) bayrak.push(`🔴 kilit kesişimi ${t.kilitKesisenKart}/${o.sayi} kartta`);
    if (t.yeniKesisenKart > 0) bayrak.push(`🔴 .b-yeni kesişimi ${t.yeniKesisenKart}/${o.sayi} kartta`);
    if (t.puanEksikKart > 0) bayrak.push(`🔴 .b-puan yok: ${t.puanEksikKart} kart`);
    if (or < ESIK) bayrak.push(`🔴 kontrast ${or}:1 < ${ESIK}:1`);
    if (!o.kartIcinde) bayrak.push('🔴 etiket kart kutusunun dışına taşıyor');

    console.log(
      `  ${durum.padEnd(15)} ${String(o.sayi).padStart(2)} kart · ${o.rozet}` +
      ` · etiket "${o.metin}" ${o.kutu.w}×${o.kutu.h} @(${o.kutu.x},${o.kutu.y})` +
      ` · ayrı kilit elemanı: ${o.ayriKilitVar ? 'VAR' : 'yok'}` +
      ` · kesişim kilit ${o.kesisimKilit} px² / yeni ${o.kesisimYeni} px²` +
      ` · kontrast ${or}:1` +
      (bayrak.length ? '\n      ' + bayrak.join('\n      ') : '  ✅')
    );
    if (bayrak.length) hatalar.push(`@${W}px · ${durum}: ` + bayrak.join(' · '));
  }

  await ctx.close();
}

await browser.close();

console.log('\n' + '─'.repeat(60));
if (hatalar.length) {
  console.log(`🔴 ${hatalar.length} BULGU:`);
  hatalar.forEach(h => console.log('   · ' + h));
  process.exit(1);
}
console.log('✅ GEÇTİ — üç genişlik × dört durum: kesişim 0 px², kontrast ≥ ' + ESIK + ':1, taşma yok.');
