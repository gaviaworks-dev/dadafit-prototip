/* =====================================================================
   DADAFIT — DESTEK AKIŞI TESTİ  (R8 · AJAN-F · madde 34-35-36)
   ---------------------------------------------------------------------
   Nöbette tuttuğu davranışlar:

   1  İKİ AKIŞ VAR ve HEDEFİ DOĞRU.  HTTP değil HEDEF ölçülür:
        destek-v1.html            → h1 "Çözüm Merkezi"
        destek-talepleri-v1.html  → h1 "Destek Taleplerim"
        destek-talebi-detay-v1.html → h1 boş değil

      ⚠ AD KAYDI İKİ KEZ DEĞİŞTİ (2026-08-26). Sıralama:
        1) R8 kaydı: destek-v1 → "Destek"
        2) C3 uygulaması: destek-v1 → "Çözüm Merkezi"
        3) 🔴 BEYAR (bağlayıcı, son): "Ad kanonu 'Destek Merkezi'. Fit'teki
           sayfanın adı da öyle olsun. Çözüm Merkezi ayrı sayfa (SSS
           tarafı), o adla kalabilir."
      Sonuç: destek-v1 = **Destek Merkezi** · sss-v1 = **Çözüm Merkezi**.
      İki ad iki AYRI sayfaya dağıldı; hesap menüsünün "Destek Merkezi"
      kalemi artık aynı adı taşıyan sayfaya iniyor. Kayıt güncellendi,
      testin kendisi zayıflatılmadı.
   2  SEKME RAYI iki sayfada da var. 🔴 ŞARTNAMEYE ÇEKİLDİ — §Ö3 (v1.10.0):
      ray ÜÇ kalemdir (Destek Taleplerim · Yeni Destek Talebi · Çözüm
      Merkezi), iki değil. Üçüncü kalem Fit'te `sss-v1.html`e iner — ad
      kanonu 2026-08-26'da "Çözüm Merkezi"ni oraya bağlamıştı, yeni ekran
      üretilmedi. Aktiflik ölçütü DEĞİŞMEDİ: tam 1 aktif + aria-current.
   3  İSKELET EŞİTLİĞİ — destek-v1'in konu kartı, kardeş markadan
      taşınmış sss-v1.html'in kartıyla BİREBİR aynı computed değerleri
      taşır: .qa dolgu/yuvarlaklık/kenarlık/zemin, .qa-head dolgu +
      font-size + line-height, .qa-body p dolgusu + tipografisi,
      .coll-cta dolgu/yuvarlaklık, bölüm dolguları.
      (Gastro ölçümü: dadagastro.com/sss — band 128/0/48 · tab 12/0 ·
       kart r16 1px --line, başlık 18px 22px, gövde 0 24 20 70,
       CTA kartı 38px 30px. Fark yalnız renk token'ı.)
   4  KREM "PROTOTİP" KUTUSU 0 — sayfa markup'ında (main#pageMain içinde)
      zemini #F7F1E6 olup metninde "prototip" geçen kutu kalmadı.
      Kabuğun ürettiği .fp-gate-in misafir kapısı bu nöbetin DIŞINDA:
      markup'ı assets/js/fit-shell.js'te, sahibi AJAN-A (R8 · madde 36
      Beyar'a soruldu). Sayılır ama SORUN yazılmaz, NOT olarak raporlanır.
   5  KIRIK BAĞLANTI 0 — destek-v1'in gövdesindeki yerel hedefler 200
      döner, "#parça" hedefleri hedef sayfada id olarak vardır.
   6  Konsol hatası 0 · yatay taşma 0 (@1440 · @390).

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/destek-akisi.mjs                        # varsayılan 8811
     node tests/destek-akisi.mjs http://localhost:8833  # K27 taban koşusu
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE = process.argv[2] || 'http://localhost:8811';

const HUB   = 'destek-v1.html';
const LISTE = 'destek-talepleri-v1.html';
const DETAY = 'destek-talebi-detay-v1.html';
const SSS   = 'sss-v1.html';

/* HTTP değil HEDEF: beklenen h1 kaydı */
const H1 = { [HUB]:'Destek Merkezi', [LISTE]:'Destek Taleplerim' };

let fail = 0; const bad = []; const notlar = [];
const rec = (t,m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = m => console.log('  ✓ ' + m);
const not = m => { notlar.push(m); console.log('  · ' + m); };

const browser = await chromium.launch();
const hatalar = new Map();

async function ac(width){
  const ctx = await browser.newContext({ viewport:{ width, height: width<600?844:1000 } });
  const p = await ctx.newPage();
  p.on('console', m => { if(m.type()==='error') (hatalar.get(p.__s)||[]).push(m.text().slice(0,140)); });
  p.on('pageerror', e => (hatalar.get(p.__s)||[]).push('PAGEERROR '+e.message.slice(0,140)));
  return { ctx, p };
}
async function git(p, s){
  p.__s = s; if(!hatalar.has(s)) hatalar.set(s, []);
  const r = await p.goto(`${BASE}/${s}`, { waitUntil:'networkidle' });
  await p.evaluate(()=>new Promise(r=>setTimeout(r,350)));
  return r;
}

/* ---------- 1 · İKİ AKIŞ, HEDEF KONTROLÜ -------------------------- */
console.log('\n1 · İki akış — h1 beklenen kayıtla eşleşiyor mu');
{
  const { ctx, p } = await ac(1440);
  for(const [s, beklenen] of Object.entries(H1)){
    const r = await git(p, s);
    const kod = r ? r.status() : 0;
    if(kod !== 200){ rec(`1 · ${s}`, `HTTP ${kod} döndü, 200 bekleniyordu`); continue; }
    const h1 = await p.evaluate(()=>document.querySelector('h1')?.textContent.trim() || '');
    if(h1 !== beklenen) rec(`1 · ${s}`, `h1 "${h1}" — beklenen "${beklenen}"`);
    else ok(`${s} → HTTP 200 · h1 "${h1}"`);
  }
  const r = await git(p, DETAY);
  const h1 = await p.evaluate(()=>document.querySelector('h1')?.textContent.trim() || '');
  if(!r || r.status()!==200 || !h1) rec(`1 · ${DETAY}`, `HTTP ${r&&r.status()} · h1 "${h1}"`);
  else ok(`${DETAY} → HTTP 200 · h1 dolu ("${h1.slice(0,40)}…")`);
  await ctx.close();
}

/* ---------- 2 · SEKME RAYI ---------------------------------------- */
console.log('\n2 · Sekme rayı — iki akış arasında geçiş');
{
  const { ctx, p } = await ac(1440);
  for(const s of [HUB, LISTE]){
    await git(p, s);
    const t = await p.evaluate(()=>{
      /* §Ö3 · bölüm şeridi kabuktan gelir ve kalemleri `.fit-tab`tır;
         durum süzgeci (§Ö4) İKİNCİ bir .pf-tabbar'dır ve o sayılmaz. */
      const bar = document.querySelector('.pf-tabbar');
      if(!bar) return null;
      return [...bar.querySelectorAll('.fit-tab, .dt')].map(a=>({
        href:a.getAttribute('href'),
        /* §F2/§Ö3 · aktiflik `aria-current="page"` ile verilir; kabuğun
           ürettiği şeritte `.active` sınıfı yok, `aria-selected` var. */
        aktif:a.getAttribute('aria-current')==='page',
        cur:a.getAttribute('aria-current'),
        metin:a.textContent.replace(/\s+/g,' ').trim()
      }));
    });
    if(!t){ rec(`2 · ${s}`, '.pf-tabbar YOK'); continue; }
    if(t.length !== 3){ rec(`2 · ${s}`, `${t.length} sekme var, §Ö3 gereği 3 bekleniyordu`); continue; }
    const hedefler = t.map(x=>x.href).sort().join(' ');
    const beklenen = [HUB, LISTE, SSS].sort().join(' ');
    if(hedefler !== beklenen)
      rec(`2 · ${s}`, `sekme hedefleri "${hedefler}" — beklenen "${beklenen}"`);
    const aktifler = t.filter(x=>x.aktif);
    if(aktifler.length !== 1) rec(`2 · ${s}`, `aktif sekme sayısı ${aktifler.length}, 1 bekleniyordu`);
    else if(aktifler[0].href !== s) rec(`2 · ${s}`, `aktif sekme "${aktifler[0].href}" — bulunduğun sayfa değil`);
    else if(aktifler[0].cur !== 'page') rec(`2 · ${s}`, 'aktif sekmede aria-current="page" yok');
    else ok(`${s} · 3 sekme (§Ö3) · aktif "${aktifler[0].metin}" · aria-current=page`);
  }
  await ctx.close();
}

/* ---------- 3 · İSKELET EŞİTLİĞİ (kardeş marka portu sss-v1 ile) --- */
console.log('\n3 · Kart iskeleti · dolgu · tipografi — sss-v1 ile birebir');
{
  const { ctx, p } = await ac(1440);
  const olc = async (s, bodySel, ctaSel) => {
    await git(p, s);
    return p.evaluate(([bodySel, ctaSel])=>{
      const g = q => document.querySelector(q);
      const c = q => { const el=g(q); return el ? getComputedStyle(el) : null; };
      const kutu = q => { const x=c(q); return x ? `${x.padding}|${x.borderTopLeftRadius}|${x.borderTopWidth}|${x.backgroundColor}` : 'YOK'; };
      const tip  = q => { const x=c(q); return x ? `${x.fontSize}|${x.lineHeight}|${x.fontWeight}` : 'YOK'; };
      const pad  = q => { const x=c(q); return x ? x.padding : 'YOK'; };
      const agac = q => { const el=g(q); return el ? [...el.children].map(y=>y.tagName.toLowerCase()+'.'+String(y.className||'').trim().split(/\s+/)[0]).join('>') : 'YOK'; };
      return {
        bandPad: pad('.lib-top'), tabPad: pad('.pf-tabbar'),
        bodyPad: pad(bodySel), ctaPad: pad(ctaSel),
        wrap: (()=>{const x=c('.wrap'); return x?`${x.maxWidth}|${x.padding}`:'YOK';})(),
        kart: kutu('.qa'), kartAgac: agac('.qa'),
        basPad: pad('.qa-head'), basTip: tip('.qa-head'),
        govPad: pad('.qa-body p'), govTip: tip('.qa-body p'),
        cta: kutu('.coll-cta'), ctaH3: tip('.coll-cta h3'), ctaP: tip('.coll-cta p'),
        ico: (()=>{const x=c('.cc-ico'); return x?`${x.width}|${x.height}|${x.borderTopLeftRadius}`:'YOK';})()
      };
    }, [bodySel, ctaSel]);
  };
  const a = await olc(HUB, '.ds-body',  '.ds-cta');
  const b = await olc(SSS, '.faq-sec',  '.faq-cta-sec');

  /* İSKELET (kutu geometrisi) → kardeş markadan taşınmış sss-v1 ile birebir. */
  /* 🔴 ŞARTNAMEYE ÇEKİLDİ — §Ö2 (v1.10.0). `bandPad` listeden ÇIKTI:
     destek-v1 artık MODÜL SAYFASIDIR ve banner ailesi taşımaz, sss-v1 ise
     herkese açık BELGE sayfası olarak banner'ını korur (§Ö3 onu yalnız
     şeritten bağlar, kabuğunu değiştirmez). İki farklı kabuğun banner
     dolgusunu kıyaslamak artık anlamsız. Kalan on ölçüt — kart kiti,
     tipografi, gövde ve CTA dolguları — DEĞİŞMEDİ. */
  const ISKELET = ['tabPad','bodyPad','ctaPad','wrap','kart','kartAgac','basPad','govPad','cta','ico'];
  for(const k of ISKELET){
    if(a[k] === 'YOK') { rec(`3 · ${HUB}`, `${k}: seçici bulunamadı`); continue; }
    if(a[k] !== b[k]) rec('3 · iskelet', `${k}: destek-v1 "${a[k]}" ≠ sss-v1 "${b[k]}"`);
  }

  /* TİPOGRAFİ → doğrudan GASTRO KAYDINA karşı ölçülür, sss-v1'e değil.
     Kayıt bu turda dadagastro.com/sss'ten Playwright ile alındı (@1440):
       .qa-head    15.5px / 24.025px / 700
       .qa-body p  14.5px / 24.65px  / 500
       .coll-cta h3 21px  / 23.52px  / 700
       .coll-cta p  14px  / 22.4px   / 500
     sss-v1 SAPIYOR: .qa-head line-height'ı `normal` (<button> miras almaz).
     O sayfa bu turda benim kapsamımda değil; sapma NOT olarak raporlanıyor. */
  const GASTRO = {
    basTip:'15.5px|24.025px|700', govTip:'14.5px|24.65px|500',
    ctaH3:'21px|23.52px|700',     ctaP:'14px|22.4px|500'
  };
  for(const [k, beklenen] of Object.entries(GASTRO)){
    if(a[k] !== beklenen) rec('3 · tipografi', `${k}: destek-v1 "${a[k]}" ≠ gastro kaydı "${beklenen}"`);
    if(b[k] !== beklenen) not(`sss-v1 ${k}: "${b[k]}" ≠ gastro kaydı "${beklenen}" — kapsam dışı, tek satırlık düzeltme raporda`);
  }

  if(!bad.some(x=>x.startsWith('3 ·')))
    ok(`iskeletin ${ISKELET.length} ölçüsü sss-v1 ile aynı · tipografinin 4 ölçüsü gastro kaydıyla aynı (kart ${a.kart} · ağaç ${a.kartAgac})`);
  await ctx.close();
}

/* ---------- 4 · KREM "PROTOTİP" KUTUSU ---------------------------- */
console.log('\n4 · Krem (#F7F1E6) "prototip" info kutusu — sayfa markup\'ında 0');
{
  const { ctx, p } = await ac(1440);
  const SAYFALAR = await (async()=>{
    /* sayfa listesi index.html haritasından değil, testin kendi
       gezindiği sabit listeden gelir — harita bozulursa test kör kalmasın */
    return [HUB, LISTE, DETAY, 'hesabim-v1.html', 'uyelik-faturalandirma-v1.html',
            'fit-planim-v1.html', 'enerji-defteri-v1.html', 'challenge-merkezi-v1.html',
            'pro-odeme-v1.html', 'iletisim-v1.html', 'bildirimler-v1.html', SSS];
  })();
  let sayfaKutu = 0, kabukKutu = 0;
  for(const s of SAYFALAR){
    const r = await git(p, s);
    if(!r || r.status()!==200){ not(`${s} bu dalda yok (HTTP ${r&&r.status()}) — atlandı`); continue; }
    const bul = await p.evaluate(()=>{
      const kok = document.getElementById('pageMain');
      if(!kok) return { sayfa:[], kabuk:[] };
      const sayfa=[], kabuk=[];
      kok.querySelectorAll('*').forEach(el=>{
        if(getComputedStyle(el).backgroundColor !== 'rgb(247, 241, 230)') return;
        const t = (el.textContent||'').replace(/\s+/g,' ').trim();
        if(!/prototip|örnektir|örnek bir görünüm/i.test(t)) return;
        const ad = el.tagName.toLowerCase()+'.'+String(el.className||'').trim().split(/\s+/).join('.');
        /* kabuk JS'inin ürettiği misafir kapısı — bu nöbetin dışında */
        if(/fp-gate|hm-gate/.test(ad)) kabuk.push(ad); else sayfa.push(ad+' :: '+t.slice(0,60));
      });
      return { sayfa, kabuk };
    });
    sayfaKutu += bul.sayfa.length; kabukKutu += bul.kabuk.length;
    bul.sayfa.forEach(x => rec('4 · krem kutu', `${s} → ${x}`));
  }
  if(sayfaKutu === 0) ok(`sayfa markup'ında krem "prototip" kutusu 0 (${SAYFALAR.length} sayfa tarandı)`);
  if(kabukKutu)  not(`kabuğun ürettiği misafir kapısı (.fp-gate-in) ${kabukKutu} yerde — AJAN-A'nın dosyası, nöbet dışı`);
  await ctx.close();
}

/* ---------- 5 · KIRIK BAĞLANTI ------------------------------------ */
console.log('\n5 · destek-v1 gövdesindeki yerel hedefler');
{
  const { ctx, p } = await ac(1440);
  const rHub = await git(p, HUB);
  if(!rHub || rHub.status() !== 200){
    rec('5 · kırık bağlantı', `${HUB} yok (HTTP ${rHub && rHub.status()}) — hedefleri ölçülemedi`);
    await ctx.close();
  } else {
  const hedefler = await p.evaluate(()=>{
    const kok = document.getElementById('pageMain');
    if(!kok) return [];
    return [...new Set([...kok.querySelectorAll('a[href]')]
      .map(a=>a.getAttribute('href'))
      .filter(h=>h && !/^(https?:|mailto:|tel:|#)/.test(h)))];
  });
  for(const h of hedefler){
    const [yol, parca] = h.split('#');
    const [dosya] = yol.split('?');
    const r = await p.goto(`${BASE}/${dosya}`, { waitUntil:'domcontentloaded' });
    if(!r || r.status()!==200){ rec('5 · kırık bağlantı', `${h} → HTTP ${r&&r.status()}`); continue; }
    if(parca){
      const var_ = await p.evaluate(id=>!!document.getElementById(id), parca);
      if(!var_) rec('5 · kırık çapa', `${h} → #${parca} hedef sayfada yok`);
    }
  }
  if(!bad.some(x=>x.startsWith('5 ·'))) ok(`${hedefler.length} yerel hedefin hepsi 200, kırık çapa 0`);
  await ctx.close();
  }
}

/* ---------- 6 · KONSOL + TAŞMA ------------------------------------ */
console.log('\n6 · Konsol hatası ve yatay taşma (@1440 · @390)');
for(const w of [1440, 390]){
  const { ctx, p } = await ac(w);
  for(const s of [HUB, LISTE, DETAY]){
    const r = await git(p, s);
    if(!r || r.status()!==200) continue;
    const t = await p.evaluate(()=>({ doc:document.documentElement.scrollWidth, win:window.innerWidth }));
    if(t.doc > t.win) rec(`6 · taşma @${w}`, `${s} → scrollWidth ${t.doc} > ${t.win}`);
  }
  await ctx.close();
}
for(const [s, h] of hatalar) if(h.length) rec('6 · konsol hatası', `${s} → ${h.join(' | ')}`);
if(!bad.some(x=>x.startsWith('6 ·'))) ok('konsol hatası 0 · yatay taşma 0');

/* ---------- SONUÇ -------------------------------------------------- */
await browser.close();
console.log('\n' + '='.repeat(60));
if(notlar.length){ console.log('NOTLAR (sorun değil):'); notlar.forEach(n=>console.log('  · '+n)); }
if(fail){
  console.log(`\n✗ ${fail} SORUN:\n`);
  bad.forEach(b=>console.log('  ✗ '+b));
  process.exit(1);
}
console.log('\n✓ DESTEK AKIŞI — 6 ölçütün altısı da temiz.');
