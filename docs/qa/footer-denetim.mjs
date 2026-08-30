/* =====================================================================
   FOOTER DENETİMİ — R18 · madde 6  (Beyar, 2026-08-30)
   ---------------------------------------------------------------------
   Beyar: "Footer'daki tüm kalemleri ölç: hangisi yaşayan sayfa, hangisi
   kopuk, hangisi artık gereksiz."

   Bu betik footer'ın TAMAMINI (beş alan + kurumsal bant + yasal bant +
   mağaza kutuları + alt satır) çalışan kabuktan okur ve her kalemin
   hedefini DİSKTE doğrular. "Ekledim/duruyor" demez, SAYI basar.

   Ölçütler:
     1. Her <a href> hedefi diskte var mı        → kırık: 0 olmalı
     2. Hedefi olmayan/boş (#) bağlantı           → 0 olmalı
     3. Aynı hedefe giden iki kalem (tekrar)      → raporlanır
     4. Çapa (#…) hedefi sayfada gerçekten var mı → kırık çapa: 0
     5. Mağaza kutuları <a> DEĞİL <span>          → doküman şartı
     6. Dokunma hedefi: WCAG 2.5.8 AA tabanı 24px → 0 olmalı.
        Kitin kendi 44px hedefi (§5/§6/§10) DENETLENİR AMA KAPI DEĞİL:
        o hedef düğme/çip/sekme içindir, footer'ın metin bağlantı
        listeleri için değil. Sayı yine de basılır ki gözden kaçmasın.
     7. Konsol hatası                             → 0

   Koş:  PW_HOME=$HOME/.pw node docs/qa/footer-denetim.mjs
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.env.BASE || 'http://127.0.0.1:8099';
const SAYFA = process.env.SAYFA || 'dadafit-hub-v1.html';
const EN    = +(process.env.EN || 1440);   /* ölçüm genişliği */

const b = await chromium.launch();
const p = await b.newPage({ viewport:{ width:EN, height:1200 } });
const konsol = [];
p.on('console', m => { if(m.type()==='error') konsol.push(m.text()); });
p.on('pageerror', e => konsol.push('pageerror: '+e.message));

await p.goto(`${BASE}/${SAYFA}`, { waitUntil:'networkidle' });
await p.waitForSelector('footer.footer', { timeout:10000 });
/* ⚠ Footer bu kabukta PERDE ile açılıyor (fit-shell.js "FOOTER REVEAL"):
   içerik footer'ın ÜSTÜNDE durur ve sayfa dibe inince footer görünür.
   `elementFromPoint` görünen katmanı okuduğu için hit test dibe inmeden
   içeriği yakalar ve 29 kalemin 29'unu yanlışlıkla "düşük hedef" sayar
   (ölçüldü). Bu yüzden ölçümden önce sayfa dibine iniyoruz. */
/* ⚠ ÇEREZ BANDI da footer'ın üstünü kapatıyor (`#cookieBanner`, fixed).
   Ölçüldü: yasal bandın ve alt satırın hit test'i onun altında kalıyor,
   yani 7 kalem YANLIŞLIKLA "düşük hedef" görünüyordu. Gerçek kullanıcı
   da bandı kapatır — ölçümden önce kapatıyoruz. */
const cerez = await p.$('#cookieAccept');
if(cerez){ await cerez.click(); await p.waitForTimeout(400); }
await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await p.waitForTimeout(700);

const kalemler = await p.$$eval('footer.footer a[href]', els => els.map(a => {
  const r = a.getBoundingClientRect();
  const kol = a.closest('.foot-col')?.querySelector('h5,h4,.fc-title')?.textContent?.trim()
           || (a.closest('.foot-corp') ? 'Kurumsal bant'
           :  a.closest('.foot-lawband') ? 'Yasal bant'
           :  a.closest('.foot-brand') ? 'Marka alanı'
           :  a.closest('.foot-bottom') ? 'Alt satır' : '—');
  return { alan:kol, metin:(a.textContent||'').trim().replace(/\s+/g,' '),
           href:a.getAttribute('href'), h:+r.height.toFixed(1), w:+r.width.toFixed(1) };
}));

/* ---- GERÇEK dokunma hedefi: elementFromPoint ile HIT TEST ----------
   `getBoundingClientRect()` yalnız kutunun kendisini ölçer; deponun
   deseni tıklama alanını görünmez bir `::before` ile büyütüyor (kit §10).
   Bu yüzden hedef, kutu değil, TIKLAMANIN GERÇEKTEN İNDİĞİ YER üzerinden
   ölçülür: kalemin merkezinden ±(N/2 − 1)px yukarı ve aşağıda
   `elementFromPoint` hâlâ o kalemi mi veriyor? */
const hedefOlc = async (esik) => p.$$eval('footer.footer a[href]', (els, e) => els.map(a => {
  const r = a.getBoundingClientRect();
  if(r.height === 0) return null;
  const cx = r.left + r.width/2, cy = r.top + r.height/2, d = e/2 - 1;
  const ust = document.elementFromPoint(cx, cy - d);
  const alt = document.elementFromPoint(cx, cy + d);
  const bende = n => !!n && (n === a || a.contains(n) || n.contains(a));
  return (bende(ust) && bende(alt)) ? null
       : { metin:(a.textContent||'').trim().replace(/\s+/g,' '), href:a.getAttribute('href'),
           h:+r.height.toFixed(1) };
}).filter(Boolean), esik);

const magaza = await p.$$eval('footer.footer .ap-store', els => els.map(e => ({
  tag:e.tagName.toLowerCase(), disabled:e.getAttribute('aria-disabled'),
  metin:(e.textContent||'').trim().replace(/\s+/g,' ')
})));

/* ---- hedef çözümü ---- */
const dis = [], ic = [], kirik = [], kirikCapa = [];
for(const k of kalemler){
  const h = k.href;
  if(/^https?:/i.test(h)) { dis.push(k); continue; }
  if(h === '#' || h === '') { kirik.push({...k, neden:'boş hedef (#)'}); continue; }
  const [yol, hash] = h.split('#');
  const dosya = (yol.split('?')[0]) || SAYFA;
  if(!existsSync(path.join(ROOT, dosya))) { kirik.push({...k, neden:'dosya yok: '+dosya}); continue; }
  ic.push({...k, dosya, hash: hash||null});
}

/* ---- çapa doğrulaması: hedef sayfayı açıp id var mı bak ---- */
const capaGrup = new Map();
for(const k of ic){ if(k.hash) capaGrup.set(k.dosya, (capaGrup.get(k.dosya)||[]).concat(k)); }
for(const [dosya, list] of capaGrup){
  const q = await b.newPage({ viewport:{ width:EN, height:1200 } });
  try{
    await q.goto(`${BASE}/${dosya}`, { waitUntil:'networkidle' });
    for(const k of list){
      const var_ = await q.evaluate(id =>
        !!document.getElementById(id) ||
        !!document.querySelector(`[data-pane="${id}"]`) ||
        !!document.querySelector(`[data-tab="${id}"]`) ||
        !!document.querySelector(`a[name="${id}"]`), k.hash);
      if(!var_) kirikCapa.push({...k, neden:`#${k.hash} hedef sayfada yok`});
    }
  } finally { await q.close(); }
}

/* ---- tekrar eden hedef ---- */
const say = new Map();
for(const k of ic) say.set(k.href, (say.get(k.href)||[]).concat(k.metin));
const tekrar = [...say.entries()].filter(([,v]) => v.length > 1);

/* ---- dokunma hedefi ---- */
const kucuk24 = await hedefOlc(24);   /* WCAG 2.5.8 AA — KAPI */
const kucuk44 = await hedefOlc(44);   /* kit hedefi — bilgi */

/* ---- RAPOR ---- */
const L = (...a) => console.log(...a);
L('\n═══ FOOTER DENETİMİ · ' + SAYFA + ' @' + EN + ' ═══\n');
L(`Toplam bağlantı kalemi : ${kalemler.length}`);
L(`  · iç sayfa           : ${ic.length}`);
L(`  · dış bağlantı       : ${dis.length}`);
L(`Kırık hedef            : ${kirik.length}`);
L(`Kırık çapa             : ${kirikCapa.length}`);
L(`Tekrar eden hedef      : ${tekrar.length}`);
L(`Dokunma hedefi < 24px  : ${kucuk24.length}   (WCAG 2.5.8 AA — kapı)`);
L(`Dokunma hedefi < 44px  : ${kucuk44.length}   (kit hedefi — bilgi)`);
L(`Konsol hatası          : ${konsol.length}`);
L(`Mağaza kutusu          : ${magaza.length} — ${magaza.every(m=>m.tag==='span'&&m.disabled==='true') ? 'hepsi <span aria-disabled> ✔' : '🔴 <a> olmuş'}`);

L('\n── Kalem dökümü ───────────────────────────────────────────');
let alan = null;
for(const k of kalemler){
  if(k.alan !== alan){ alan = k.alan; L(`\n▸ ${alan}`); }
  const kb = kirik.find(x=>x.metin===k.metin&&x.href===k.href);
  const kc = kirikCapa.find(x=>x.metin===k.metin&&x.href===k.href);
  const durum = kb ? '🔴 ' + kb.neden : kc ? '🟠 ' + kc.neden : '✔';
  L(`   ${durum.padEnd(34)} ${k.metin.padEnd(38)} → ${k.href}   [${k.h}px]`);
}
if(tekrar.length){
  L('\n── Tekrar eden hedefler ───────────────────────────────────');
  for(const [h,v] of tekrar) L(`   ${h}  ←  ${v.join(' · ')}`);
}
if(kucuk24.length){
  L('\n── 🔴 24px altı dokunma hedefi (WCAG 2.5.8 AA) ────────────');
  for(const k of kucuk24) L(`   ${k.metin} — kutu ${k.h}px, hit test 24px'te düşüyor`);
}
if(konsol.length){ L('\n── Konsol ─────────────────────────────────────────────────'); konsol.forEach(c=>L('   '+c)); }

const gecti = kirik.length===0 && kirikCapa.length===0 && konsol.length===0 && kucuk24.length===0;
L('\n' + (gecti
  ? '✅ KAPI YEŞİL — kırık hedef 0 · kırık çapa 0 · konsol 0 · 24px altı 0'
  : '🔴 KAPI KIRMIZI'));
await b.close();
process.exit(gecti ? 0 : 1);
