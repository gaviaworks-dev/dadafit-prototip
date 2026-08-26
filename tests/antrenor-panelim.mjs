/* =====================================================================
   DADAFIT — ANTRENÖR PANELİ NÖBETİ  (Dalga 5'in Fit payı · 2026-08-26)
   ---------------------------------------------------------------------
   Kararlar: K4 (üye üreticiden HİZMET SATIN ALIR) · K6 (Fit'te abonelik
   YOK) · P7 · K5 (komisyon kuralları) · K13 (para parametreleri PANELDEN
   okunur, koda GÖMÜLMEZ) · sözleşme §7 (kart kiti · P12 · D-1 · D-2) ·
   sözleşme §7.4 (yer tutucu).

   Nöbette tuttuğu davranışlar:

   1  DÖRT BÖLÜM ve ray: `#paketler` · `#danisanlar` · `#randevular` ·
      `#kazanc`. Her an TEK panel açık, rayda TEK durak, `aria-selected`
      ve gezici `tabindex` doğru. Derin bağlantı (`#kazanc`) ve eş anlamlı
      adres (`#hakedis`) doğru paneli açar.
   2  KART KİTİ KANONU (sözleşme §7 · P12): her `.pc-title` GERÇEK `<h2>`
      (D-1) ve her kart başlığı bir açıklama `<p>`si taşır (D-2).
      🔴 Nötrleyici YOK ve olmamalı: başlık bu sayfada doğduğu andan beri
      `<h2>`, yani `h1..h4{line-height}` zaten yürürlükteydi.
   3  🔴 ABONELİK DİLİ YASAK (K6 · P7): sayfa "yenilenir" / "otomatik
      tahsilat" demez. Tek "abonelik" geçişi olumsuzlamadır
      ("Bunlar abonelik değildir").
   4  🔴 K13 KAPISI — PARA RAKAMI 0. Sayfada hiçbir ₺ tutarı ve hiçbir
      yüzde oranı yazılı DEĞİLDİR; tutar hücrelerinin hepsi
      `data-yer-tutucu` taşır ve üç anahtarın üçü de defterde kayıtlıdır.
      K5'in dört kuralı METİN olarak görünür (sayı olarak değil).
   5  Ölü bağlantı (`href="#"`) sayfa markup'ında 0 · "Yakında" 0 ·
      yerel hedeflerin hepsi 200.
   6  Dört genişlikte (1440/1024/768/390) yatay taşma 0 · konsol hatası 0 ·
      `<h1>` tek.

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/antrenor-panelim.mjs                       # varsayılan 8811
     node tests/antrenor-panelim.mjs http://localhost:8833
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://localhost:8811';
const S = 'antrenor-panelim-v1.html';

let fail = 0;
const bad = m => { fail++; console.log('  ✗ ' + m); };
const ok  = m => console.log('  ✓ ' + m);
const b   = await chromium.launch();

async function sayfa(w){
  const ctx = await b.newContext({ viewport:{ width:w, height: w<600?844:1000 } });
  const p = await ctx.newPage(); const hata = [];
  p.on('console', m => { if(m.type()==='error') hata.push(m.text().slice(0,160)); });
  p.on('pageerror', e => hata.push('PAGEERROR ' + e.message.slice(0,160)));
  return { ctx, p, hata };
}
const git = async (p,u) => { const r = await p.goto(BASE+'/'+u,{waitUntil:'networkidle'}); await p.waitForTimeout(400); return r; };

/* ---- 1 · DÖRT BÖLÜM ve RAY ---- */
console.log('\n1 · Dört bölüm · ray · derin bağlantı');
{
  const { ctx, p, hata } = await sayfa(1440);
  const BEK = ['paketler','danisanlar','randevular','kazanc'];
  const r0 = await git(p, S);
  if(!r0 || r0.status()!==200){ bad(`${S} → HTTP ${r0 && r0.status()}`); }
  const yapi = await p.evaluate(() => ({
    ray:[...document.querySelectorAll('#apRail .dt[role="tab"]')].map(t=>t.getAttribute('aria-controls')),
    panel:[...document.querySelectorAll('.ap-sec[role="tabpanel"]')].map(x=>x.id)
  }));
  if(yapi.ray.join(',') !== BEK.join(',')) bad('ray kalemleri: '+yapi.ray.join(','));
  if(yapi.panel.join(',') !== BEK.join(',')) bad('paneller: '+yapi.panel.join(','));

  for(const [adres, beklenen] of [['', 'paketler'], ['#kazanc','kazanc'], ['#hakedis','kazanc'],
                                  ['#danisanlar','danisanlar'], ['#yok-boyle-bir-sey','paketler']]){
    await git(p, S + adres);
    const d = await p.evaluate(() => ({
      acik:[...document.querySelectorAll('.ap-sec')].filter(x=>!x.hasAttribute('hidden')).map(x=>x.id),
      aktif:[...document.querySelectorAll('#apRail .dt.active')].map(x=>x.getAttribute('aria-controls')),
      secili:[...document.querySelectorAll('#apRail .dt[aria-selected="true"]')].length,
      durak:[...document.querySelectorAll('#apRail .dt[tabindex="0"]')].length
    }));
    if(d.acik.length !== 1 || d.acik[0] !== beklenen) bad(`${adres||'(kök)'} → açık panel ${JSON.stringify(d.acik)}, beklenen ${beklenen}`);
    else if(d.aktif[0] !== beklenen) bad(`${adres||'(kök)'} → rayın aktif kalemi ${d.aktif[0]}`);
    else if(d.secili !== 1 || d.durak !== 1) bad(`${adres||'(kök)'} → aria-selected ${d.secili} · tabindex=0 ${d.durak}, ikisi de 1 olmalı`);
  }
  if(!fail) ok('4 bölüm · 4 ray kalemi · derin bağlantı, eş anlamlı adres ve geçersiz çapa doğru panele düşüyor');
  if(hata.length) bad('konsol: '+hata.join(' | '));
  await ctx.close();
}

/* ---- 2 · KART KİTİ KANONU (P12 · D-1 · D-2) ---- */
console.log('\n2 · Kart kiti — .pc-title gerçek <h2> · her başlıkta açıklama <p>si');
{
  const { ctx, p } = await sayfa(1440);
  await git(p, S);
  const k = await p.evaluate(() => ({
    kart:document.querySelectorAll('.pnl-card').length,
    baslik:[...document.querySelectorAll('.pc-title')].map(x=>x.tagName),
    aciklama:document.querySelectorAll('.pc-head p').length,
    h1:document.querySelectorAll('h1').length,
    lh:[...new Set([...document.querySelectorAll('.pc-title')].map(x=>getComputedStyle(x).lineHeight))],
    fs:[...new Set([...document.querySelectorAll('.pc-title')].map(x=>getComputedStyle(x).fontSize))]
  }));
  const digerEtiket = k.baslik.filter(t => t !== 'H2');
  if(digerEtiket.length) bad(`D-1 ihlali — .pc-title <h2> değil: ${digerEtiket.join(',')}`);
  if(k.aciklama !== k.kart) bad(`D-2 ihlali — ${k.kart} kartın ${k.aciklama}'ünde açıklama <p>si var`);
  if(k.h1 !== 1) bad('h1 sayısı '+k.h1);
  /* Nötrleyici kontrolü: başlık 16px ve line-height 16×1.12 = 17.92px olmalı.
     1.55'e çekilmiş olsaydı 24.80px görünürdü — kopyalanmış nötrleyicinin izi. */
  if(k.fs.length===1 && k.fs[0]==='16px' && k.lh.length===1 && k.lh[0]!=='17.92px')
    bad(`nötrleyici izi — .pc-title line-height ${k.lh[0]}, 17.92px (16×1.12) bekleniyordu`);
  if(!fail) ok(`${k.kart} kartın ${k.kart}'ünde .pc-title <h2> + açıklama <p>si · ${k.fs[0]}/${k.lh[0]} (nötrleyici yok)`);
  await ctx.close();
}

/* ---- 3 · ABONELİK DİLİ ---- */
console.log('\n3 · K6 · P7 — Fit\'te abonelik YOK, hizmet paketi VAR');
{
  const { ctx, p } = await sayfa(1440);
  await git(p, S);
  const d = await p.evaluate(() => {
    const t = document.getElementById('pageMain').textContent;
    return {
      abonelik:(t.match(/abonelik\w*/gi)||[]),
      yenileme:(t.match(/otomatik tahsilat|otomatik yenile\w*|yenileme tarihi/gi)||[]),
      paket:(t.match(/hizmet paketi|paket/gi)||[]).length,
      olumsuz:/abonelik değildir/i.test(t)
    };
  });
  if(d.yenileme.length) bad('abonelik dili sızmış: '+d.yenileme.join(', '));
  if(d.abonelik.length && !d.olumsuz) bad('"abonelik" geçiyor ama olumsuzlanmıyor: '+d.abonelik.join(', '));
  if(!fail) ok(`"abonelik" yalnız olumsuzlamada geçiyor · "paket" ${d.paket} kez · otomatik yenileme dili 0`);
  await ctx.close();
}

/* ---- 4 · K13 KAPISI: PARA RAKAMI 0 · YER TUTUCU DEFTERDE ---- */
console.log('\n4 · K13 — para rakamı 0, tutar hücreleri yer tutucu, defter güncel');
{
  const { ctx, p } = await sayfa(1440);
  await git(p, S);
  const d = await p.evaluate(() => {
    const t = document.getElementById('pageMain').textContent;
    return {
      tutar:(t.match(/₺\s?[\d.,]+/g)||[]),
      oran:(t.match(/[%﹪]\s?\d+|\d+\s?%/g)||[]),
      yt:[...document.querySelectorAll('#pageMain [data-yer-tutucu]')].map(x=>x.getAttribute('data-yer-tutucu')),
      ytEtiketsiz:[...document.querySelectorAll('#pageMain [data-yer-tutucu]')].filter(x=>!x.getAttribute('aria-label')).length,
      kural:{
        ayniOran:/herkes için aynı/i.test(t),
        ayS: /ay sonunda toplu/i.test(t),
        birikir:/birikir|bir sonraki döneme/i.test(t),
        iade:/iade olursa komisyon geri gitmez|komisyonu iade edilmez/i.test(t)
      },
      durum:{
        bekleyen:/Bekleyen/.test(t), odenen:/Ödenen/.test(t), altSinir:/Alt sınır altında birikti/.test(t)
      }
    };
  });
  if(d.tutar.length) bad(`🔴 K13 ihlali — sayfada para tutarı yazılı: ${d.tutar.join(', ')}`);
  if(d.oran.length)  bad(`🔴 K13 ihlali — sayfada oran yazılı: ${d.oran.join(', ')}`);
  if(!d.yt.length)   bad('tutar hücrelerinde data-yer-tutucu yok');
  if(d.ytEtiketsiz)  bad(`${d.ytEtiketsiz} yer tutucuda aria-label yok`);
  for(const [k,v] of Object.entries(d.kural)) if(!v) bad(`K5 kuralı metinde yok: ${k}`);
  for(const [k,v] of Object.entries(d.durum)) if(!v) bad(`hakediş durumu ekranda yok: ${k}`);

  /* kod → defter (KATI): koddaki her anahtar defterde bulunmalı */
  const defter = readFileSync(path.join(ROOT,'docs/icerik-bekleyen.md'),'utf8');
  const eksik = [...new Set(d.yt)].filter(k => !defter.includes('`'+k+'`'));
  if(eksik.length) bad('defterde olmayan yer tutucu anahtarı: '+eksik.join(', '));
  else ok(`para rakamı 0 · oran 0 · ${d.yt.length} yer tutucu hücre (${[...new Set(d.yt)].length} anahtar), hepsi defterde · K5'in 4 kuralı ve 3 hakediş durumu ekranda`);
  await ctx.close();
}

/* ---- 5 · ÖLÜ BAĞLANTI · "YAKINDA" · YEREL HEDEFLER ---- */
console.log('\n5 · Ölü bağlantı 0 · "Yakında" 0 · yerel hedefler 200');
{
  const { ctx, p } = await sayfa(1440);
  await git(p, S);
  const d = await p.evaluate(() => ({
    olu:document.querySelectorAll('#pageMain a[href="#"]').length,
    yakinda:(document.getElementById('pageMain').textContent.match(/yakında/gi)||[]).length,
    hedef:[...new Set([...document.querySelectorAll('#pageMain a[href]')]
      .map(a=>a.getAttribute('href')).filter(h=>h && !/^(https?:|mailto:|tel:|#)/.test(h)))]
  }));
  if(d.olu)     bad(`sayfa markup'ında ölü bağlantı (href="#"): ${d.olu}`);
  if(d.yakinda) bad(`"Yakında" ${d.yakinda} kez geçiyor — yasak`);
  let kirik = 0;
  for(const h of d.hedef){
    const [yol] = h.split('#'); const [f] = yol.split('?');
    const r = await p.goto(BASE+'/'+f, { waitUntil:'domcontentloaded' });
    if(!r || r.status() !== 200){ bad(`kırık hedef ${h} → HTTP ${r && r.status()}`); kirik++; }
  }
  if(!d.olu && !d.yakinda && !kirik) ok(`ölü bağlantı 0 · "Yakında" 0 · ${d.hedef.length} yerel hedefin hepsi 200`);
  await ctx.close();
}

/* ---- 6 · DÖRT GENİŞLİK ---- */
console.log('\n6 · Yatay taşma ve konsol — 1440/1024/768/390');
for(const w of [1440,1024,768,390]){
  const { ctx, p, hata } = await sayfa(w);
  for(const h of ['','#danisanlar','#randevular','#kazanc']){
    const r = await git(p, S + h);
    if(!r || r.status()!==200) continue;
    const t = await p.evaluate(() => ({ d:document.documentElement.scrollWidth, w:window.innerWidth, h1:document.querySelectorAll('h1').length }));
    if(t.d > t.w) bad(`taşma @${w}${h} → ${t.d} > ${t.w}`);
    if(t.h1 !== 1) bad(`h1 @${w}${h} → ${t.h1}`);
  }
  if(hata.length) bad(`konsol @${w}: ${hata.join(' | ')}`); else ok(`@${w} taşma 0 · konsol 0 · h1 tek`);
  await ctx.close();
}

await b.close();
console.log('\n' + '='.repeat(58));
console.log(fail ? `✗ ${fail} SORUN` : '✓ ANTRENÖR PANELİ — altı ölçütün altısı da temiz.');
process.exit(fail ? 1 : 0);
