/* =====================================================================
   YÖNETİM PANELİ — KALIP ÇAPRAZ DENETİMİ   (R17)
   ---------------------------------------------------------------------
   `admin-denetim.mjs` bir ekranın KENDİ içinde sağlam olup olmadığını
   sorar (taşma · konsol · ölü bağlantı · dokunma hedefi). Bu betik başka
   bir şey sorar: **21 ekran birbirine benziyor mu.**

   Görünüm turunun asıl kusuru "bir ekran bozuk" değil, "yirmi bir ekran
   yirmi bir farklı kalıp" olurdu; onu ancak ekranlar YAN YANA ölçülünce
   görürsün. Aşağıdaki her kalem tek tek ekranda değil, DAĞILIMDA
   okunur — sapan ekran listelenir.

   Koşum: PW_HOME=~/.pw node docs/qa/admin-kalip-denetim.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const B = 'http://127.0.0.1:8788/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 } });
const p = await ctx.newPage();

const konsol = [];
p.on('console', m => { if (m.type() === 'error') konsol.push([sayfa, m.text()]); });
p.on('pageerror', e => konsol.push([sayfa, String(e)]));

/* Ekran listesi kabuğun kendi MENU dizisinden okunur — ikinci bir kopya
   tutulmaz, yani yeni ekran eklendiğinde bu betik onu kendiliğinden ölçer. */
await p.goto(B + 'admin-v1.html', { waitUntil: 'networkidle' });
const EKRAN = await p.evaluate(() =>
  window.FIT_ADMIN.MENU.flatMap(g => g.kalem.map(k => ({ id: k.id, ad: k.ad, href: k.href }))));

let sayfa = '';
const satir = [];

for (const e of EKRAN) {
  sayfa = e.href;
  await p.goto(B + e.href, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(() => {
    const q = s => document.querySelectorAll(s);
    const one = s => document.querySelector(s);
    const px = (el, k) => el ? Math.round(parseFloat(getComputedStyle(el)[k])) : null;
    const kart = one('.adm-card,.pnl-card');
    const cbas = one('.adm-card .c-head,.pnl-card .pc-head');
    const th = one('.adm-table th,.ptable th');
    const h1 = one('.adm-head h1,.pnl-page-head h1');
    const h2eski = q('.adm-head h2').length;
    const fbar = one('.filter-bar,.adm-filter');
    const fsearch = one('.filter-bar .fb-search input,.adm-filter .fb-search input');
    /* Arama kart BAŞLIĞINDA mı kaldı — Gastro'da filtre şeridinde SOLDA.
       Başlıktaki arama, taşınmamış ekranın imzasıdır. */
    const basliktaAra = q('.c-head input[type=search],.pc-head input[type=search]').length;
    return {
      // kabuk — 21'inde de aynı olmalı
      rail:   px(one('.sa-rail'), 'width'),
      menu:   px(one('.sa-menu'), 'width'),
      top:    px(one('.pnl-top'), 'height'),
      main:   px(one('.adm-main,.pnl-main'), 'marginLeft'),
      aktif:  q('.sa-mlink.is-active,.adm-item.is-on').length,
      grip:   q('.sa-grip').length,
      // sayfa kalıbı
      h1:     h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize) * 10) / 10 : null,
      h2eski,
      sub:    q('.adm-head .ph-sub,.pnl-page-head .ph-sub').length,
      src:    q('.adm-src').length,
      kartR:  px(kart, 'borderTopLeftRadius'),
      kartP:  cbas ? getComputedStyle(cbas).padding : null,
      thF:    th ? getComputedStyle(th).fontSize : null,
      thBg:   th ? getComputedStyle(th).backgroundColor : null,
      tablo:  q('.adm-table,.ptable').length,
      kap:    [...q('.adm-tw,.ptable-wrap')].filter(x => getComputedStyle(x).contain.includes('paint')).length,
      kapTop: q('.adm-tw,.ptable-wrap').length,
      fbar:   fbar ? 1 : 0,
      fbarP:  fbar ? getComputedStyle(fbar).padding : null,
      fsW:    fsearch ? Math.round(fsearch.getBoundingClientRect().width) : null,
      basliktaAra,
      kpi:    q('.adm-kpi .k,.kpi-card').length,
      kpiTrend: q('.kpi-delta').length,
      pager:  q('.adm-pager,.pager').length,
      bulk:   q('.adm-bulk').length,
      bos:    [...q('.fpx-bos,.pnl-empty')].map(c => ({
                ico: c.querySelectorAll('.pe-ico').length,
                h4:  c.querySelectorAll('h4').length,
                p:   c.querySelectorAll('p').length })),
      // uydurulmuş inline ölçü/renk
      inline: [...q('[style]')].filter(x => /(?:^|;)\s*(?:color|background|border|padding|margin|font-size|width|height)\s*:/i
                .test(x.getAttribute('style') || '')).length,
      tasma:  document.documentElement.scrollWidth > window.innerWidth
                ? document.documentElement.scrollWidth : 0,
      kucuk:  [...q('.sa-mlink,.adm-item,.adm-ico-btn,.ia-btn,.adm-pg,.pg-btn,.chip,.adm-burger,.btn,a.btn')]
                .filter(x => x.getClientRects().length && x.offsetParent !== null &&
                             x.getBoundingClientRect().height < 44).length
    };
  });
  satir.push({ ...e, ...m });
}

/* ---- dağılım: bir alanın kaç farklı değeri var ---- */
const dagilim = (alan) => {
  const g = new Map();
  satir.forEach(s => {
    const v = JSON.stringify(s[alan]);
    if (!g.has(v)) g.set(v, []);
    g.get(v).push(s.id);
  });
  return g;
};

const KABUK = ['rail', 'menu', 'top', 'main', 'aktif', 'grip'];
const KALIP = ['h1', 'kartR', 'kartP', 'thF', 'thBg', 'fbarP'];

console.log('\n════ KABUK — 21 ekranda AYNI olmalı ════');
let kabukKusur = 0;
for (const a of KABUK) {
  const g = dagilim(a);
  if (g.size === 1) console.log(`  ✓ ${a.padEnd(7)} ${[...g.keys()][0]}`);
  else { kabukKusur++; console.log(`  ✗ ${a.padEnd(7)} ${g.size} FARKLI DEĞER`);
         for (const [v, ids] of g) console.log(`      ${v}  ← ${ids.join(' ')}`); }
}

console.log('\n════ SAYFA KALIBI — kullanan ekranlarda AYNI olmalı ════');
let kalipKusur = 0;
for (const a of KALIP) {
  const g = dagilim(a);
  const dolu = [...g].filter(([v]) => v !== 'null');
  if (dolu.length <= 1) console.log(`  ✓ ${a.padEnd(7)} ${dolu.length ? dolu[0][0] : '—'}`);
  else { kalipKusur++; console.log(`  ✗ ${a.padEnd(7)} ${dolu.length} FARKLI DEĞER`);
         for (const [v, ids] of dolu) console.log(`      ${v}  ← ${ids.join(' ')}`); }
}

console.log('\n════ EKRAN EKRAN ════');
console.log('ekran'.padEnd(13), 'h1  alt src tab kap fbar araW bşAra kpi trnd pgr blk inline taşma <44');
const kirmizi = [];
for (const s of satir) {
  const kapEksik = s.kapTop - s.kap;
  const bosKusur = s.bos.filter(x => !(x.ico && x.h4 && x.p)).length;
  const sorun = [];
  if (!s.h1) sorun.push('h1 yok');
  if (s.h2eski) sorun.push('h2 kaldı');
  if (!s.src) sorun.push('kaynak şeridi yok');
  if (kapEksik) sorun.push(`contain:paint eksik ×${kapEksik}`);
  if (s.basliktaAra) sorun.push(`arama başlıkta ×${s.basliktaAra}`);
  if (s.tablo && !s.fbar && !s.basliktaAra) { /* süzgeçsiz tablo — kusur değil */ }
  if (s.kpi && s.kpi !== s.kpiTrend) sorun.push(`kpi trend ${s.kpiTrend}/${s.kpi}`);
  if (bosKusur) sorun.push(`boş durum eksik ×${bosKusur}`);
  if (s.tasma) sorun.push(`taşma ${s.tasma}`);
  if (s.kucuk) sorun.push(`44px altı ×${s.kucuk}`);
  console.log(
    s.id.padEnd(13),
    String(s.h1 ?? '—').padEnd(4), String(s.sub).padEnd(3), String(s.src).padEnd(3),
    String(s.tablo).padEnd(3), String(s.kap + '/' + s.kapTop).padEnd(3),
    String(s.fbar).padEnd(4), String(s.fsW ?? '—').padEnd(4),
    String(s.basliktaAra).padEnd(5), String(s.kpi).padEnd(3), String(s.kpiTrend).padEnd(4),
    String(s.pager).padEnd(3), String(s.bulk).padEnd(3),
    String(s.inline).padEnd(6), String(s.tasma).padEnd(5), String(s.kucuk),
    sorun.length ? '  🔴 ' + sorun.join(' · ') : '');
  if (sorun.length) kirmizi.push(s.id);
}

console.log('\n════ SONUÇ ════');
console.log('ekran', satir.length, '· kabuk sapması', kabukKusur, '· kalıp sapması', kalipKusur);
console.log('kusurlu ekran', kirmizi.length, kirmizi.length ? '→ ' + kirmizi.join(' ') : '');
console.log('konsol hatası', konsol.length, konsol.length ? konsol : '');
console.log('toplam inline ölçü/renk', satir.reduce((a, s) => a + s.inline, 0));

await b.close();
