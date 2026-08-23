/* =====================================================================
   UI/UX DENETİM SONDASI  (Beyar · Revize 11 · M14)
   ---------------------------------------------------------------------
   Beyar: "burası için bir frontend skill çıkart, Playwright ile kontrol
   etsin, best practice bir UI/UX standardına göre."

   Bu sonda İZLENİM üretmez, SAYI üretir (DENETIM.md §1). Her bulgu
   "ölçülen değer + eşik + eşiğin kaynağı" üçlüsüyle basılır; kaynağı
   olmayan eşik konmadı.

   Kullanım:
     PW_HOME=~/.pw node tests/uiux-denetim.mjs <sayfa.html> [#kapsam]
     PW_HOME=~/.pw node tests/uiux-denetim.mjs fit-testi-detay-v1.html
     PW_HOME=~/.pw node tests/uiux-denetim.mjs sozluk-v1.html ".sz-body"

   Çıkış kodu: bulgu varsa 1, temizse 0.

   ---------------------------------------------------------------------
   ÖLÇÜLEN SEKİZ BAŞLIK ve EŞİKLERİN KAYNAĞI
   ---------------------------------------------------------------------
   1 · YATAY TAŞMA        scrollWidth > clientWidth + 1
       Kaynak: taşma her zaman kusurdur; 1px tolerans yuvarlama payı.

   2 · DOKUNMA HEDEFİ     interaktif öğe ≥ 24×24 (hata) · < 44×44 (uyarı)
       Kaynak: WCAG 2.2 · 2.5.8 Target Size (Minimum) = 24×24 AA
               WCAG 2.1 · 2.5.5 Target Size (Enhanced) = 44×44 AAA

   3 · METİN/ZEMİN KONTRASTI  normal metin ≥ 4.5 · iri metin ≥ 3.0
       Kaynak: WCAG 2.1 · 1.4.3 Contrast (Minimum) AA.
               "İri" = ≥24px, ya da ≥18.66px + font-weight ≥700.

   4 · SATIR UZUNLUĞU     gövde metni 45–95 karakter
       Kaynak: tipografi yerleşiği (Bringhurst 45–75; Butterick 45–90).
               Üst sınır 95 alındı — altı Türkçe uzun kelimeleri kesmesin.

   5 · METİN GENİŞLİĞİ / KAP GENİŞLİĞİ   < %72 ise "yarım kalmış"
       Kaynak: Beyar'ın M5/M11/M13'te işaret ettiği kusurun ölçülebilir
               hâli. Eşik keyfî DEĞİL: bu depoda kusursuz sayılan
               bloklar ölçüldü, hepsi %72'nin üstünde çıktı.
               (4 numaralı satır uzunluğu şartıyla birlikte okunur —
               metin kabı doldurmalı AMA satır 95 karakteri geçmemeli.)

   6 · BAŞLIK HİYERARŞİSİ  tek h1 · atlanan seviye yok
       Kaynak: WCAG 1.3.1 Info and Relationships + HTML outline yerleşiği.

   7 · DİKEY RİTİM        kardeş bloklar arası boşluklar 4px ızgarasına
                          oturmalı; ayraç–içerik arası ≥ 16px
       Kaynak: 4px/8px ızgara yerleşiği (Material · Carbon · Polaris).
               Ayraç eşiği: ayraçtan sonraki nefes, ayraçtan önceki
               nefesin en az yarısı kadar olmalı — "üstten çok yakın"
               kusurunun (Beyar M13) ölçülebilir hâli.

   8 · GÖRÜNÜRLÜK         getClientRects().length > 0
       Kaynak: DENETIM.md §2 — offsetParent'a güvenilmez.
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SAYFA = process.argv[2];
const KAPSAM = process.argv[3] || null;
const GENISLIKLER = [390, 1024, 1440];

if(!SAYFA){
  console.error('Kullanım: node tests/uiux-denetim.mjs <sayfa.html> [#kapsam]');
  process.exit(2);
}
if(!existsSync(path.join(ROOT, SAYFA))){
  console.error('Sayfa bulunamadı: ' + SAYFA);
  process.exit(2);
}

/* ---- sayfa bağlamında koşacak ölçüm ---- */
function OLC(kapsam){
  const B = [];                       /* bulgular */
  /* Varsayılan kapsam SAYFA GÖVDESİ. Kabuk (topbar · header · drawer ·
     footer · alt bar) 66 sayfada ORTAK ve ayrı yönetiliyor; her sayfa
     denetiminde aynı kabuk bulgularını tekrar basmak raporu boğar ve
     sayfanın kendi kusurunu gizler. Kabuğu denetlemek için kapsamı
     açıkça ver: `node tests/uiux-denetim.mjs <sayfa> "body"`. */
  const kok = kapsam ? document.querySelector(kapsam)
                     : (document.querySelector('main.page-main') || document.body);
  if(!kok) return { hata: 'kapsam bulunamadı: ' + kapsam, bulgular: [] };

  const gorunur = el => el.getClientRects().length > 0;
  const ad = el => {
    const c = (el.className || '').toString().trim().split(/\s+/).filter(Boolean).slice(0,2);
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (c.length ? '.' + c.join('.') : '');
  };
  const kirp = (t, n) => { t = (t||'').replace(/\s+/g,' ').trim(); return t.length > n ? t.slice(0,n) + '…' : t; };

  /* ---------- renk yardımcıları (WCAG 1.4.3) ---------- */
  function ayristir(c){
    const m = (c||'').match(/rgba?\(([^)]+)\)/);
    if(!m) return null;
    const p = m[1].split(',').map(x => parseFloat(x));
    return { r:p[0], g:p[1], b:p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function uzerineKoy(ust, alt){        /* alfa harmanı */
    const a = ust.a;
    return { r: ust.r*a + alt.r*(1-a), g: ust.g*a + alt.g*(1-a), b: ust.b*a + alt.b*(1-a), a:1 };
  }
  /* Zemin çözücü — SONDANIN KÖRLÜĞÜ BURADA KAPATILDI.
     İlk sürüm yalnız `backgroundColor` zincirini takip ediyordu; metin bir
     GÖRSEL ya da GRADYAN üstündeyse zincir şeffaf geçip beyaz body'ye
     düşüyor ve beyaz metin "1.00:1" gibi sahte bir bulgu üretiyordu
     (ilk koşuda 16 kontrast bulgusunun 11'i böyle çıktı).
     Kural: yolda boyalı bir görsel/gradyan varsa zemin BİLİNMİYOR sayılır
     ve o metin ölçülmez. Ölçemediğimize "kusurlu" demeyiz.
     (DENETIM.md — sondanın kendi kusuru, ölçülenin kusuru sanılmaz.) */
  function gercekZemin(el){
    let n = el, yigin = [];
    while(n && n !== document.documentElement){
      const cs = getComputedStyle(n);
      if(cs.backgroundImage && cs.backgroundImage !== 'none') return null;   /* BELİRSİZ */
      /* Sabit/yapışkan kabın ARKASINDAKİ şey DOM'da ata değil: şeffaf
         header koyu banner'ın üstünde duruyor ama zincir body'ye (beyaz)
         çıkıyor ve beyaz logo "1.05:1" gibi sahte bulgu üretiyordu.
         Arkasında ne olduğu bilinemez → ölçme. */
      if((cs.position === 'fixed' || cs.position === 'sticky') &&
         (!ayristir(cs.backgroundColor) || ayristir(cs.backgroundColor).a < 1)) return null;
      const bg = ayristir(cs.backgroundColor);
      if(bg && bg.a > 0){ yigin.push(bg); if(bg.a === 1) break; }
      n = n.parentElement;
    }
    let sonuc = { r:255, g:255, b:255, a:1 };
    for(let i = yigin.length - 1; i >= 0; i--) sonuc = uzerineKoy(yigin[i], sonuc);
    return sonuc;
  }
  function isik(c){
    const f = v => { v /= 255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); };
    return .2126*f(c.r) + .7152*f(c.g) + .0722*f(c.b);
  }
  function oran(a, b){
    const l1 = isik(a), l2 = isik(b);
    return (Math.max(l1,l2) + .05) / (Math.min(l1,l2) + .05);
  }

  const hepsi = [...kok.querySelectorAll('*')].filter(gorunur);

  /* ================= 1 · YATAY TAŞMA ================= */
  {
    const d = document.documentElement;
    if(d.scrollWidth > d.clientWidth + 1){
      B.push({ tur:'tasma', ciddiyet:'hata', el:'html',
        olculen: d.scrollWidth + 'px', esik: d.clientWidth + 'px',
        not: 'sayfa yatayda ' + (d.scrollWidth - d.clientWidth) + 'px taşıyor' });
    }
    for(const el of hepsi){
      if(el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX === 'visible'){
        const r = el.getBoundingClientRect();
        if(r.width < 40) continue;                       /* ikon kutusu değil */
        B.push({ tur:'tasma', ciddiyet:'uyari', el: ad(el),
          olculen: el.scrollWidth + 'px', esik: el.clientWidth + 'px',
          not: 'içerik kabı ' + (el.scrollWidth - el.clientWidth) + 'px aşıyor, overflow-x:visible' });
      }
    }
  }

  /* ================= 2 · DOKUNMA HEDEFİ ================= */
  {
    const SEC = 'a[href],button,input,select,textarea,[role="button"],[role="tab"],[tabindex]:not([tabindex="-1"])';
    const olculen = new Set();
    for(let el of kok.querySelectorAll(SEC)){
      if(!gorunur(el)) continue;
      if(el.closest('p, li, .lead, .hr-note, .fct-row')) continue;   /* satır içi bağlantı muaf */

      /* ÖZEL KONTROL KALIBI: gerçek input görsel olarak gizlenip yerine
         .cbx/.tgl gibi bir kardeş çiziliyor. Dokunma hedefi input değil,
         onu saran <label>'dır — ölçüm oraya kaydırılır. İlk koşuda bu
         yüzden 45 sahte "13×13 / 1×1" bulgusu çıkmıştı. */
      if(el.tagName === 'INPUT' || el.tagName === 'SELECT'){
        const ics = getComputedStyle(el);
        const et  = el.closest('label');
        const gizli = ics.opacity === '0' || ics.appearance === 'none' ||
                      el.getBoundingClientRect().width < 2;
        if(et && (gizli || el.type === 'checkbox' || el.type === 'radio')) el = et;
        else if(gizli) continue;                 /* etiketi yok, ölçülemez */
      }
      const anahtar = ad(el) + '|' + el.getBoundingClientRect().top;
      if(olculen.has(anahtar)) continue;
      olculen.add(anahtar);

      const r = el.getBoundingClientRect();
      const k = Math.min(r.width, r.height);
      if(k < 24){
        B.push({ tur:'dokunma', ciddiyet:'hata', el: ad(el),
          olculen: Math.round(r.width) + '×' + Math.round(r.height),
          esik: '24×24', not: 'WCAG 2.5.8 (AA) altında · "' + kirp(el.textContent, 24) + '"' });
      } else if(k < 44){
        B.push({ tur:'dokunma', ciddiyet:'uyari', el: ad(el),
          olculen: Math.round(r.width) + '×' + Math.round(r.height),
          esik: '44×44', not: 'WCAG 2.5.5 (AAA) altında · "' + kirp(el.textContent, 24) + '"' });
      }
    }
  }

  /* ================= 3 · KONTRAST ================= */
  let belirsiz = 0;
  {
    const gorulen = new Set();
    for(const el of hepsi){
      const dogrudanMetin = [...el.childNodes]
        .some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      if(!dogrudanMetin) continue;

      const cs = getComputedStyle(el);
      const on = ayristir(cs.color);
      if(!on || on.a === 0) continue;
      const arka = gercekZemin(el);
      if(!arka){ belirsiz++; continue; }        /* görsel/gradyan zemin — ölçülemez */
      const renk = on.a < 1 ? uzerineKoy(on, arka) : on;

      const px = parseFloat(cs.fontSize);
      const kalin = (parseInt(cs.fontWeight,10) || 400) >= 700;
      const iri = px >= 24 || (px >= 18.66 && kalin);
      const gerek = iri ? 3.0 : 4.5;
      const o = oran(renk, arka);

      if(o < gerek){
        const anahtar = ad(el) + '|' + Math.round(o*10);
        if(gorulen.has(anahtar)) continue;
        gorulen.add(anahtar);
        B.push({ tur:'kontrast', ciddiyet: o < gerek - 1 ? 'hata' : 'uyari', el: ad(el),
          olculen: o.toFixed(2) + ':1', esik: gerek.toFixed(1) + ':1',
          not: px.toFixed(1) + 'px' + (kalin ? ' kalın' : '') + ' · "' + kirp(el.textContent, 34) + '"' });
      }
    }
  }

  /* ============ 4·5 · SATIR UZUNLUĞU + METİN/KAP ORANI ============ */
  {
    for(const el of kok.querySelectorAll('p, li, .lead, blockquote')){
      if(!gorunur(el)) continue;
      const t = (el.textContent || '').replace(/\s+/g,' ').trim();
      if(t.length < 60) continue;                    /* kısa metnin ölçüsü olmaz */

      const cs = getComputedStyle(el);
      const r  = el.getBoundingClientRect();
      const satirY = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      const satir  = Math.max(1, Math.round(r.height / satirY));
      const karSatir = Math.round(t.length / satir);

      /* 4 · satır uzunluğu */
      if(karSatir > 95){
        B.push({ tur:'satir-uzunlugu', ciddiyet:'uyari', el: ad(el),
          olculen: karSatir + ' karakter/satır', esik: '95',
          not: 'satır uzun, göz satır başını kaybeder · "' + kirp(t, 30) + '"' });
      }

      /* 5 · metin kabını dolduruyor mu (Beyar'ın "yarım kalmış" kusuru) */
      const kap = el.parentElement;
      if(kap && satir >= 2){
        const kr = kap.getBoundingClientRect();
        const kcs = getComputedStyle(kap);
        const icKap = kr.width - parseFloat(kcs.paddingLeft) - parseFloat(kcs.paddingRight);
        if(icKap > 320){
          const yuzde = (r.width / icKap) * 100;
          /* KURAL 5 ile KURAL 4 ÇELİŞEBİLİR — ayrım burada.
             Dar metin her zaman kusur değildir: 560px'e sınırlanmış bir
             banner alt metni ~75 karakter/satır verir, bu İDEALDİR.
             Kusur, metnin hem kabı doldurmaması HEM DE ideal ölçünün
             ALTINDA kalmasıdır — yani daralttığımız hâlde okuma ölçüsü
             kazanmıyorsak. Bu yüzden ikinci şart: karakter/satır < 75
             (Bringhurst'ün ideal bandının alt-orta değeri). */
          if(yuzde < 72 && karSatir < 75){
            B.push({ tur:'metin-genisligi', ciddiyet:'uyari', el: ad(el),
              olculen: '%' + yuzde.toFixed(0) + ' (' + Math.round(r.width) + '/' + Math.round(icKap) + 'px) · ' + karSatir + ' kar/satır',
              esik: '%72 · ideal 45–75 kar/satır',
              not: 'metin kabı doldurmuyor AMA okuma ölçüsü de kazanmıyor · max-width: ' + cs.maxWidth });
          }
        }
      }
    }
  }

  /* ================= 6 · BAŞLIK HİYERARŞİSİ ================= */
  {
    const bas = [...kok.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(gorunur);
    const h1 = bas.filter(h => h.tagName === 'H1');
    if(h1.length === 0) B.push({ tur:'baslik', ciddiyet:'uyari', el:'(yok)', olculen:'0 adet h1', esik:'1', not:'sayfanın tek bir h1\'i olmalı' });
    if(h1.length > 1)   B.push({ tur:'baslik', ciddiyet:'uyari', el:'h1', olculen: h1.length + ' adet h1', esik:'1', not: h1.map(h => '"' + kirp(h.textContent,18) + '"').join(' · ') });
    let onceki = 0;
    for(const h of bas){
      const n = +h.tagName[1];
      if(onceki && n > onceki + 1){
        B.push({ tur:'baslik', ciddiyet:'uyari', el: ad(h),
          olculen: 'h' + onceki + ' → h' + n, esik: 'en fazla +1',
          not: 'seviye atlandı · "' + kirp(h.textContent, 30) + '"' });
      }
      onceki = n;
    }
  }

  /* ================= 7 · DİKEY RİTİM ================= */
  {
    /* 7a · ayraçtan sonraki nefes, öncekinin yarısından az olmasın */
    const AYRAC = 'hr, [class*="divider"], [class*="ayrac"], [class*="sep"]';
    for(const a of kok.querySelectorAll(AYRAC)){
      if(!gorunur(a)) continue;
      const ar = a.getBoundingClientRect();
      const on = a.previousElementSibling, so = a.nextElementSibling;
      if(!on || !so || !gorunur(on) || !gorunur(so)) continue;
      const ust = ar.top - on.getBoundingClientRect().bottom;
      const alt = so.getBoundingClientRect().top - ar.bottom;
      if(alt < 16 || (ust > 0 && alt < ust / 2)){
        B.push({ tur:'ritim', ciddiyet:'uyari', el: ad(a),
          olculen: 'üst ' + Math.round(ust) + 'px / alt ' + Math.round(alt) + 'px',
          esik: 'alt ≥ 16px ve ≥ üst/2',
          not: 'ayracın iki yanı dengesiz — içerik ayraca yapışmış' });
      }
    }
    /* 7b · border-top ile ayraç yapan bloklar: üst dolgu yeterli mi */
    for(const el of hepsi){
      const cs = getComputedStyle(el);
      if(parseFloat(cs.borderTopWidth) < 1 || cs.borderTopStyle === 'none') continue;
      if(el.getBoundingClientRect().width < 200) continue;
      const pt = parseFloat(cs.paddingTop) || 0;
      if(pt > 0 && pt < 12){
        B.push({ tur:'ritim', ciddiyet:'uyari', el: ad(el),
          olculen: 'padding-top ' + pt + 'px', esik: '≥ 12px',
          not: 'üst ayraç çizgisine içerik çok yakın' });
      }
    }
    /* 7d · <legend> TUZAĞI — fieldset'in padding-top'u legend'e İŞLEMEZ.
       legend kutusu kenarlık bandına yerleşir, dolgu kutusunun üstünde
       kalır; "padding:13px 0" yazan bir soru satırında metin ayraca
       0px mesafede durur. Gözle bakınca "biraz sıkışık" görünür, CSS'e
       bakınca "13px var" sanılır — bu yüzden ölçülüyor.
       Metnin GERÇEK yeri Range ile alınır, kutuyla değil. */
    for(const fs of kok.querySelectorAll('fieldset')){
      if(!gorunur(fs)) continue;
      const lg = fs.querySelector(':scope > legend');
      const onceki = fs.previousElementSibling;
      if(!lg || !gorunur(lg) || !onceki || !gorunur(onceki)) continue;
      const ocs = getComputedStyle(onceki);
      const ayracVar = parseFloat(ocs.borderBottomWidth) >= 1 ||
                       parseFloat(getComputedStyle(fs).borderTopWidth) >= 1;
      if(!ayracVar) continue;
      const rng = document.createRange(); rng.selectNodeContents(lg);
      const nefes = rng.getBoundingClientRect().top - onceki.getBoundingClientRect().bottom;
      if(nefes < 12){
        B.push({ tur:'ritim', ciddiyet:'uyari', el: ad(fs) + ' > legend',
          olculen: Math.round(nefes) + 'px', esik: '≥ 12px',
          not: 'ayraç → soru metni · fieldset padding-top legend\'e işlemez, nefesi legend\'e ver' });
      }
    }

    /* 7c · kardeş bloklar arası boşluk 4px ızgarasına oturuyor mu */
    const disi = new Map();
    for(const kap of kok.querySelectorAll('section, .wrap, .fp-card, .card')){
      const cocuk = [...kap.children].filter(gorunur);
      for(let i = 1; i < cocuk.length; i++){
        const g = cocuk[i].getBoundingClientRect().top - cocuk[i-1].getBoundingClientRect().bottom;
        if(g <= 0 || g > 200) continue;
        const yv = Math.round(g);
        if(yv % 4 !== 0 && Math.abs(g - Math.round(g)) < .5){
          disi.set(ad(cocuk[i]), yv);
        }
      }
    }
    if(disi.size > 3){
      B.push({ tur:'ritim', ciddiyet:'uyari', el:'(çoklu)',
        olculen: disi.size + ' blok', esik: '4px ızgarası',
        not: [...disi.entries()].slice(0,5).map(([k,v]) => k + '=' + v + 'px').join(' · ') });
    }
  }

  return { hata:null, bulgular:B, sayac:{ ogeler: hepsi.length, kontrastBelirsiz: belirsiz } };
}

/* ---------------------------------------------------------------- */
const tarayici = await chromium.launch();
const tumBulgu = [];
const jsHata = [];
let belirsizToplam = 0, ogeToplam = 0;

for(const G of GENISLIKLER){
  const ctx = await tarayici.newContext({ viewport:{ width:G, height:1000 } });
  const pg  = await ctx.newPage();
  pg.on('pageerror', e => jsHata.push(G + 'px · ' + e.message));
  await pg.goto('file://' + path.join(ROOT, SAYFA), { waitUntil:'load' });
  await pg.waitForTimeout(500);

  const r = await pg.evaluate(OLC, KAPSAM);
  if(r.hata){ console.error(r.hata); process.exit(2); }
  belirsizToplam = Math.max(belirsizToplam, r.sayac.kontrastBelirsiz || 0);
  ogeToplam = Math.max(ogeToplam, r.sayac.ogeler || 0);
  for(const b of r.bulgular) tumBulgu.push({ ...b, genislik:G });
  await ctx.close();
}
await tarayici.close();

/* ---- aynı bulgu üç genişlikte de çıktıysa tek satırda topla ---- */
const toplu = new Map();
for(const b of tumBulgu){
  const k = [b.tur, b.el, b.esik, b.not].join('§');
  if(!toplu.has(k)) toplu.set(k, { ...b, genislikler:[], olculenler:[] });
  toplu.get(k).genislikler.push(b.genislik);
  toplu.get(k).olculenler.push(b.olculen);
}

const BASLIK = {
  tasma:'YATAY TAŞMA', dokunma:'DOKUNMA HEDEFİ', kontrast:'KONTRAST',
  'satir-uzunlugu':'SATIR UZUNLUĞU', 'metin-genisligi':'METİN/KAP GENİŞLİĞİ',
  baslik:'BAŞLIK HİYERARŞİSİ', ritim:'DİKEY RİTİM'
};

console.log('=== UI/UX DENETİM · ' + SAYFA + (KAPSAM ? ' · kapsam ' + KAPSAM : '') + ' ===');
console.log('kapsam     : ' + (KAPSAM || 'main.page-main (kabuk hariç)'));
console.log('genişlikler: ' + GENISLIKLER.join(' · ') + 'px');
console.log('ölçülen öğe: ' + ogeToplam + ' · kontrastı ölçülemeyen (görsel/şeffaf zemin): ' + belirsizToplam + '\n');

const liste = [...toplu.values()];
const siraTur = ['tasma','kontrast','dokunma','ritim','metin-genisligi','satir-uzunlugu','baslik'];
liste.sort((a,b) =>
  (a.ciddiyet === b.ciddiyet ? 0 : a.ciddiyet === 'hata' ? -1 : 1) ||
  siraTur.indexOf(a.tur) - siraTur.indexOf(b.tur));

let hataSay = 0, uyariSay = 0;
let sonTur = null;
for(const b of liste){
  if(b.tur !== sonTur){ console.log('\n--- ' + (BASLIK[b.tur] || b.tur) + ' ---'); sonTur = b.tur; }
  b.ciddiyet === 'hata' ? hataSay++ : uyariSay++;
  const gset = [...new Set(b.genislikler)];
  const g = gset.length === GENISLIKLER.length ? 'hepsi' : gset.join('/');
  const adet = b.genislikler.length > gset.length ? ' ×' + Math.round(b.genislikler.length/gset.length) : '';
  const o = [...new Set(b.olculenler)].join(' | ');
  console.log(`  [${b.ciddiyet === 'hata' ? 'HATA ' : 'uyarı'}] ${b.el}`);
  console.log(`      ölçülen ${o}  ·  eşik ${b.esik}  ·  @${g}${adet}`);
  console.log(`      ${b.not}`);
}

console.log('\n' + '─'.repeat(58));
console.log(`BULGU: ${hataSay} hata · ${uyariSay} uyarı · JS hatası ${jsHata.length}`);
if(jsHata.length) console.log(jsHata.join('\n'));
if(!liste.length) console.log('✓ Sekiz başlıkta da bulgu yok.');
process.exit(liste.length ? 1 : 0);
