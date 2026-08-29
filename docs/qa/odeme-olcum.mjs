/* =====================================================================
 ÖDEME DALGASI ÖLÇÜMÜ — Paketlerim · Ödemelerim · Pro · Pro Ödeme
 ---------------------------------------------------------------------
 Ölçtükleri:
   1. konsol hatası (0 olmalı)
   2. yatay taşma  (scrollWidth > clientWidth) · 390 · 768 · 1024 · 1440
   3. dokunma hedefi < 44×44 (WCAG 2.5.8) — YALNIZ GÖRÜNÜR öğeler
      (görünürlük `getClientRects().length > 0` ile ölçülür)
   4. sekme geçişi: her sekme açılıyor mu, kimlik kartı yerinde kalıyor mu
   5. ölü bağlantı: sayfa içi tüm href'lerin dosyası var mı

 Koşum:  PW_HOME=~/.pw node docs/qa/odeme-olcum.mjs
 ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
import { existsSync } from 'node:fs';
import path from 'node:path';

const KOK  = '/Users/gaviaworks/Developer/Projects/dadafit-prototip';
const BASE = 'http://127.0.0.1:8788';
const EN   = [390, 768, 1024, 1440];

const SAYFALAR = [
  { ad: 'paketlerim-v1.html',  sekmeler: ['paketim', 'kademeler', 'karsilastir'] },
  { ad: 'odemelerim-v1.html',  sekmeler: ['abonelik', 'antrenor', 'faturalar', 'kartlar', 'iade'] },
  { ad: 'pro-v1.html',         sekmeler: [] },
  { ad: 'pro-odeme-v1.html',   sekmeler: [] },
  { ad: 'hesabim-v1.html',     sekmeler: [] }
];

const tarayici = await chromium.launch();
const rapor = [];

for (const s of SAYFALAR) {
  const satir = { sayfa: s.ad, konsol: [], tasma: {}, kucukHedef: {}, sekme: [], oluBaglanti: [] };

  for (const w of EN) {
    const ctx = await tarayici.newContext({ viewport: { width: w, height: 900 } });
    const sf  = await ctx.newPage();
    sf.on('console', m => { if (m.type() === 'error') satir.konsol.push(`${w}px · ${m.text()}`); });
    sf.on('pageerror', e => satir.konsol.push(`${w}px · pageerror · ${e.message}`));

    await sf.goto(`${BASE}/${s.ad}`, { waitUntil: 'networkidle' });
    await sf.evaluate(() => localStorage.setItem('dm_fit_login', '1'));
    await sf.reload({ waitUntil: 'networkidle' });

    /* --- yatay taşma --- */
    satir.tasma[w] = await sf.evaluate(() => {
      const d = document.documentElement;
      const fazla = d.scrollWidth - d.clientWidth;
      if (fazla <= 1) return 0;
      /* hangi öğe taşırıyor? */
      const sucluler = [];
      document.querySelectorAll('*').forEach(el => {
        if (!el.getClientRects().length) return;
        const r = el.getBoundingClientRect();
        if (r.right > d.clientWidth + 1 && r.width > 0) {
          sucluler.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} → ${Math.round(r.right)}`);
        }
      });
      return { fazla, sucluler: sucluler.slice(0, 6) };
    });

    /* --- dokunma hedefi (yalnız GÖRÜNÜR) --- */
    satir.kucukHedef[w] = await sf.evaluate(() => {
      const sec = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], label.tgl';
      const kucuk = [];
      document.querySelectorAll(sec).forEach(el => {
        if (!el.getClientRects().length) return;                 /* görünmez → sayma */
        const r = el.getBoundingClientRect();
        if (r.width < 44 || r.height < 44) {
          kucuk.push(`${el.tagName.toLowerCase()}.${(el.className||'').toString().split(' ')[0]} ${Math.round(r.width)}×${Math.round(r.height)} "${(el.textContent||'').trim().slice(0,22)}"`);
        }
      });
      return kucuk;
    });

    /* --- sekme geçişi + kimlik kartı (yalnız 1440'ta bir kez) --- */
    if (w === 1440 && s.sekmeler.length) {
      for (const k of s.sekmeler) {
        const btn = await sf.$(`.fit-tab[data-tab="${k}"]`);
        if (!btn) { satir.sekme.push(`${k}: SEKME YOK`); continue; }
        await btn.click();
        await sf.waitForTimeout(120);
        const sonuc = await sf.evaluate((key) => {
          const pane = document.querySelector(`.fit-pane[data-pane="${key}"]`);
          const kimlik = document.querySelector('.fp-kimlik');
          return {
            gorunur: pane ? pane.getClientRects().length > 0 : false,
            icerik : pane ? pane.innerText.trim().length : 0,
            kimlikDuruyor: kimlik ? kimlik.getClientRects().length > 0 : false,
            digerlerKapali: Array.from(document.querySelectorAll('.fit-pane'))
              .filter(p => p.getAttribute('data-pane') !== key)
              .every(p => p.getClientRects().length === 0)
          };
        }, k);
        satir.sekme.push(`${k}: görünür=${sonuc.gorunur} metin=${sonuc.icerik} kimlik=${sonuc.kimlikDuruyor} tekPanel=${sonuc.digerlerKapali}`);
      }
    }

    /* --- ölü bağlantı (yalnız 1440'ta bir kez) --- */
    if (w === 1440) {
      const hrefler = await sf.evaluate(() =>
        Array.from(new Set(Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.getAttribute('href'))
          .filter(h => h && !/^(#|https?:|mailto:|tel:|javascript:)/.test(h)))));
      for (const h of hrefler) {
        const dosya = h.split('#')[0].split('?')[0];
        if (!dosya) continue;
        if (!existsSync(path.join(KOK, dosya))) satir.oluBaglanti.push(h);
      }
    }

    await ctx.close();
  }
  rapor.push(satir);
}

await tarayici.close();

/* ------------------------------ ÇIKTI ------------------------------ */
for (const r of rapor) {
  console.log('\n═══ ' + r.sayfa + ' ═══');
  console.log('konsol hatası : ' + (r.konsol.length ? r.konsol.length + '\n  ' + r.konsol.join('\n  ') : '0'));
  for (const w of EN) {
    const t = r.tasma[w];
    console.log(`taşma @${w}   : ` + (t === 0 ? '0px' : `${t.fazla}px  ← ${t.sucluler.join(' | ')}`));
  }
  for (const w of EN) {
    const k = r.kucukHedef[w];
    console.log(`<44px @${w}   : ` + (k.length ? k.length + '\n    ' + k.join('\n    ') : '0'));
  }
  if (r.sekme.length) console.log('sekmeler      :\n  ' + r.sekme.join('\n  '));
  console.log('ölü bağlantı  : ' + (r.oluBaglanti.length ? r.oluBaglanti.join(', ') : '0'));
}
