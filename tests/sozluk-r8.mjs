/* =====================================================================
   DADAFIT — SPOR SÖZLÜĞÜ · REVİZYON 8 NÖBETİ  (AJAN-B · madde 7 · 8 · 9 · 10)
   ---------------------------------------------------------------------
   Bu betik R8'in DÖRT maddesini ölçüyor. Her ölçüt SAYI üretiyor; hiçbiri
   "HTTP 200 döndü" gibi dolaylı kanıt değil.

   Referans sabitleri `dadagastro.com/mutfak-sozlugu` CANLIDAN Playwright ile
   @1440 ve @390'da ölçüldü (10. oturum). Betiğe GÖMÜLÜ, çünkü sınama canlı
   siteye bağlı kalmamalı — ama sayının nereden geldiği aşağıda yazılı ki
   sonraki oturum referansı yeniden ölçüp bu tabloyu tazeleyebilsin.

   MADDE 7 · yapı gastro ile hizalı
     7a  her terim satırında sol harf avatarı  → `.sr-ltr` = terim sayısı
     7b  açık kaydın sol dikey şeridi YOK      → inset box-shadow 0
     7c  sayaç kendi satırında                  → `.sz-count` liste bölümünde,
                                                  genişliği kolon genişliği
     7d  kategori çipleri açıkta                → açılır menü kalıntısı 0
     7-ölçü  kart iskeleti · dolgu · tipografi referansla BİREBİR
     7-parite (Beyar) harf grubu başlığı 0 · TEK kart · ray 29/29 çalışıyor
   MADDE 8 · arama çip satırında
     üst kenar farkı 0 px · çip rayının sol kenarı harf rayıyla aynı ·
     @390 yatay taşma 0
   MADDE 9 · akordiyon tek-açık
     üç ardışık tıklamanın ÜÇÜNDE de açık kart sayısı 1
     (referans da tek-açık ölçüldü: 1 · 1 · 1)
   MADDE 10 · detay sayfasından iki bölüm kalktı
     "Sık aranan sorular" 0 · "Etiketler" 0 · konsol hatası 0

   SABİT KONTROLÜ (DEVIR-7 §2c): 254 terim · 29 harf · eski sağ ok 0 ·
   `.sr-caret` 254 · banner 544 / 607 / 587.

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/sozluk-r8.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from './_pw.mjs';

/* =====================================================================
 ⚠ R15'TE ATLANDI — Beyar kararı, 2026-08-29:
   "Kırmızı testleri devre dışı bırak — silme, sadece atlanacak duruma
    getir. Bir daha test güncellemesiyle uğraşma. Bir şey kırılırsa
    tarayıcıda ölç ve kanıtla, yeterli."
 ---------------------------------------------------------------------
 İDDİALAR SİLİNMEDİ, dosya olduğu gibi duruyor — yalnız koşmuyor.
 Kırmızı olma sebebi (ölçüldü, 2026-08-29):
   R15'te sayfa yapısı değişti (dokuz sayfa modül paneline taşındı, üçü destek modülüne indi); iddia eski yapıyı bekliyor
 Yeniden açmak için:  FIT_TESTI_ZORLA=1 node tests/sozluk-r8.mjs
 ===================================================================== */
if (!process.env.FIT_TESTI_ZORLA) {
  console.log('ATLANDI (R15) — R15\'te sayfa yapısı değişti (dokuz sayfa modül paneline taşındı, üçü d');
  process.exit(0);
}


const BASE  = (process.argv.slice(2).find(a => /^https?:/.test(a)) || 'http://localhost:8821').replace(/\/$/, '');
const LISTE = 'sozluk-v1.html';
const DETAY = 'sozluk-detay-v1.html';

/* ---- REFERANS ÖLÇÜMÜ (dadagastro.com/mutfak-sozlugu, canlı, @1440) ----
   Her satır: [ne, beklenen]. Ondalıklar tarayıcının hesapladığı gerçek
   değerler — 15.5px * 1.55 = 24.025 gibi. 0.1 px tolerans var, çünkü
   yuvarlama farkı iki tarayıcı sürümü arasında oynayabiliyor. */
const REF = {
  '.sz-row':        { padding:'16px 20px', gap:'16px', h:79.4 },
  '.sr-ltr':        { w:46, h:46, borderRadius:'12px', fontSize:'19px', fontWeight:'700' },
  '.sr-name':       { h:47.4 },
  '.sr-name b':     { fontSize:'15.5px', fontWeight:'700', lineHeight:'24.025px',
                      letterSpacing:'normal', marginBottom:'4px' },
  '.sr-name span':  { fontSize:'12.5px', fontWeight:'500', lineHeight:'19.375px' },
  '.sr-cat':        { fontSize:'11px', fontWeight:'700', lineHeight:'17.05px',
                      letterSpacing:'0.66px', padding:'6px 11px', borderRadius:'8px', h:29 },
  '.sz-card':       { borderRadius:'16px', overflow:'hidden' },
  /* referansta ayraç HER kaydın altında, İLK kayıt dahil → KAPALI kayıt 80.4.
     `:not(.open)` şart: ölçü bloğu, açık kayıt bırakan 7b'den sonra koşuyor. */
  '#szList .sz-item:not(.open)': { h:80.4 },
  '.sz-detail':     { padding:'16px 24px 24px 82px' },
  '.sz-detail>p':   { fontSize:'14.5px', lineHeight:'25.375px', fontWeight:'500' },
  '.sd-ex':         { fontSize:'13.5px', lineHeight:'20.925px', fontStyle:'italic' },
  '.sd-foot a':     { padding:'8px 14px', gap:'8px', fontSize:'13px', fontWeight:'700',
                      borderRadius:'8px' },
  '.sz-count':      { fontSize:'13px', fontWeight:'500', lineHeight:'20.15px',
                      margin:'0px 0px 14px' }
};
/* aynı ölçümün @390 sürümü — referans dar ekranda satırı KÜÇÜLTMÜYOR */
const REF390 = {
  '.sz-row':    { padding:'16px 20px', gap:'16px', h:79.4 },
  '.sr-ltr':    { w:46, h:46 },
  '.sr-name b': { fontSize:'15.5px' },
  '.sz-detail': { padding:'16px 24px 24px 20px' }
};

const SABIT = { terim:254, harfRayi:29, caret:254, sagOk:0,
                banner:{ 1440:544, 1024:607, 390:587 } };

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

console.log(`\n=== SPOR SÖZLÜĞÜ · R8 NÖBETİ · ${BASE} ===\n`);

const browser = await chromium.launch();
const konsol = [];

async function ac(width){
  const ctx = await browser.newContext({ viewport:{ width, height:900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent','accepted'); } catch(e){} });
  const page = await ctx.newPage();
  page.on('pageerror', e => konsol.push(`@${width} pageerror: ` + e.message.split('\n')[0]));
  page.on('console', m => { if (m.type()==='error') konsol.push(`@${width} console.error: ` + m.text().slice(0,140)); });
  return { ctx, page };
}

/* computed stil + kutu ölçüsü okuyan tek yardımcı */
const OLC = (sel) => {
  const e = document.querySelector(sel);
  if (!e) return null;
  const c = getComputedStyle(e), r = e.getBoundingClientRect();
  return {
    w:Math.round(r.width*10)/10, h:Math.round(r.height*10)/10,
    padding:c.padding, margin:c.margin, gap:c.gap, fontSize:c.fontSize,
    fontWeight:c.fontWeight, lineHeight:c.lineHeight, letterSpacing:c.letterSpacing,
    fontStyle:c.fontStyle, borderRadius:c.borderRadius, overflow:c.overflow,
    marginBottom:c.marginBottom, n:document.querySelectorAll(sel).length
  };
};

/* referans tablosunu bir sayfaya uygulayan karşılaştırıcı */
async function karsilastir(page, tablo, etiket){
  const olculen = await page.evaluate((sel) => {
    const OLC = (s) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const c = getComputedStyle(e), r = e.getBoundingClientRect();
      return { w:Math.round(r.width*10)/10, h:Math.round(r.height*10)/10,
        padding:c.padding, margin:c.margin, gap:c.gap, fontSize:c.fontSize,
        fontWeight:c.fontWeight, lineHeight:c.lineHeight, letterSpacing:c.letterSpacing,
        fontStyle:c.fontStyle, borderRadius:c.borderRadius, overflow:c.overflow,
        marginBottom:c.marginBottom };
    };
    const o = {}; sel.forEach(s => o[s] = OLC(s)); return o;
  }, Object.keys(tablo));

  const sapan = [], tutan = [];
  for (const [sel, bek] of Object.entries(tablo)) {
    const g = olculen[sel];
    if (!g) { sapan.push(`${sel} → DOM'da yok`); continue; }
    for (const [k, v] of Object.entries(bek)) {
      const bulunan = g[k];
      const esit = (typeof v === 'number')
        ? Math.abs(bulunan - v) <= 0.1
        : String(bulunan) === String(v);
      if (esit) tutan.push(`${sel}.${k}=${bulunan}`);
      else sapan.push(`${sel} ${k}: ${bulunan} (referans ${v})`);
    }
  }
  if (!sapan.length) ok(`${etiket}: ${tutan.length} ölçünün ${tutan.length}'i referansla birebir`);
  else rec(`${etiket} — referanstan sapan ölçü`, sapan.join('\n      '));
  return { sapan:sapan.length, tutan:tutan.length };
}

/* ================= LİSTE SAYFASI @1440 ================= */
{
  const { ctx, page } = await ac(1440);
  await page.goto(`${BASE}/${LISTE}`, { waitUntil:'load' });
  await page.waitForSelector('#szList .sz-item', { timeout:10000 });

  /* --- SABİT KONTROLÜ (DEVIR-7 §2c) --- */
  {
    const r = await page.evaluate(() => ({
      terim: document.querySelectorAll('#szList .sz-item').length,
      harfRayi: document.querySelectorAll('#szLetters .sz-ltr:not(.all)').length,
      caret: document.querySelectorAll('#szList .sr-caret').length,
      /* "eski sağ ok": satırın İÇİNDE detay sayfasına giden bağlantı/ok */
      sagOk: document.querySelectorAll('#szList .sz-row a, #szList .sz-row .fa-chevron-right, #szList .sz-go').length,
      eyebrow: (document.querySelector('.lib-top .eyebrow')||{textContent:''}).textContent.replace(/\s+/g,' ').trim(),
      h1: (document.querySelector('.lib-top h1')||{textContent:''}).textContent.trim()
    }));
    const s = [];
    if (r.terim !== SABIT.terim)       s.push(`terim ${r.terim} (${SABIT.terim} bekleniyor)`);
    if (r.harfRayi !== SABIT.harfRayi) s.push(`harf rayı ${r.harfRayi} (${SABIT.harfRayi} bekleniyor)`);
    if (r.caret !== SABIT.caret)       s.push(`.sr-caret ${r.caret} (${SABIT.caret} bekleniyor)`);
    if (r.sagOk !== SABIT.sagOk)       s.push(`satır içi sağ ok ${r.sagOk} (0 bekleniyor)`);
    /* K56 — eyebrow üst bağlamı yazar, sloganı değil */
    if (!/Hareketi Anlamak/.test(r.eyebrow)) s.push(`eyebrow "${r.eyebrow}" (K56: "Hareketi Anlamak")`);
    /* HEDEF kontrolü: h1 beklenen kayıtla eşleşmeli */
    if (r.h1 !== 'Spor Sözlüğü')       s.push(`h1 "${r.h1}" (beklenen "Spor Sözlüğü")`);
    if (!s.length) ok(`sabitler: ${r.terim} terim · ${r.harfRayi} harf · caret ${r.caret} · sağ ok 0 · eyebrow "${r.eyebrow}" · h1 "${r.h1}"`);
    else rec('DEVIR-7 sabitleri', s.join('\n      '));
  }

  /* --- MADDE 7a · her satırda harf avatarı --- */
  {
    const r = await page.evaluate(() => {
      const it = [...document.querySelectorAll('#szList .sz-item')];
      const avatar = it.filter(x => x.querySelector('.sz-row > .sr-ltr')).length;
      /* avatarın harfi satırın terimiyle uyuşmalı — boş kare basılmasın */
      const yanlis = it.filter(x => {
        const a = x.querySelector('.sr-ltr'), b = x.querySelector('.sr-name b');
        return !a || !b || !a.textContent.trim();
      }).length;
      const gizli = it.filter(x => {
        const a = x.querySelector('.sr-ltr');
        return a && a.getBoundingClientRect().width === 0;
      }).length;
      return { toplam:it.length, avatar, yanlis, gizli };
    });
    const s = [];
    if (r.avatar !== r.toplam) s.push(`avatar ${r.avatar}/${r.toplam} satırda`);
    if (r.yanlis)              s.push(`harfi boş avatar: ${r.yanlis}`);
    if (r.gizli)               s.push(`genişliği 0 avatar: ${r.gizli}`);
    if (!s.length) ok(`madde 7a: sol harf avatarı ${r.avatar}/${r.toplam} satırda, hepsi dolu ve görünür`);
    else rec('madde 7a (harf avatarı)', s.join('\n      '));
  }

  /* --- MADDE 7d · kategori çipleri AÇIKTA --- */
  {
    const r = await page.evaluate(() => ({
      cip: document.querySelectorAll('#szCats .df-fchip').length,
      gorunur: [...document.querySelectorAll('#szCats .df-fchip')]
                 .filter(c => c.getBoundingClientRect().height > 0).length,
      dropdown: document.querySelectorAll(
        '#szCatFilter, .sz-controls [data-ff], .sz-controls .ff-bar, .sz-controls .ff-pop, .sz-controls .ff-btn').length
    }));
    const s = [];
    if (r.dropdown !== 0)        s.push(`açılır menü kalıntısı ${r.dropdown} düğüm`);
    if (r.cip !== 11)            s.push(`çip ${r.cip} (11 bekleniyor: Tümü + 10 kategori)`);
    if (r.gorunur !== r.cip)     s.push(`çiplerin ${r.cip - r.gorunur} tanesi gizli (yükseklik 0)`);
    if (!s.length) ok(`madde 7d: ${r.cip} çip açık rayda, gizli 0, açılır menü kalıntısı 0`);
    else rec('madde 7d (çip rayı)', s.join('\n      '));
  }

  /* --- MADDE 7 · TAM PARİTE (Beyar) — grup başlığı yok, TEK kart, ray sağlam
     Beyar "tam parite" dedi: referansta 765 terim TEK `.term-card` içinde ve
     harf grubu başlığı YOK (canlıdan ölçüldü). DadaFit 254 terimi 28 karta
     bölüyordu; başlıklar kalktı, tek karta indi.

     RAYIN ÇAPASI SORUSU ÖLÇÜMLE KAPANDI: harf rayı iki markada da ÇAPA DEĞİL
     SÜZGEÇ. Referansta `id`li harf çapası 0 tane; "B"ye basınca `?harf=B`
     yazılıyor, `scrollY` 0'da kalıyor, yalnız `data-ltr="B"` kayıtlar
     görünüyor. Yani başlığın kalkması gezinmeyi bozmuyor — ve bu nöbet
     bunu 29 harfin 29'unda tek tek doğruluyor. --- */
  {
    const yapi = await page.evaluate(() => ({
      grupBaslik: document.querySelectorAll('#szList .sz-gh, #szList .sz-group').length,
      kart: document.querySelectorAll('#szList .sz-card').length,
      item: document.querySelectorAll('#szList .sz-item').length,
      /* kartın DOĞRUDAN çocuğu yalnız kayıtlar olmalı — araya başlık girmesin */
      yabanciCocuk: [...(document.querySelector('#szList .sz-card')?.children || [])]
                      .filter(e => !e.classList.contains('sz-item')).length
    }));
    const s = [];
    if (yapi.grupBaslik !== 0) s.push(`harf grubu başlığı ${yapi.grupBaslik} (0 bekleniyor · Beyar tam parite kararı)`);
    if (yapi.kart !== 1)       s.push(`.sz-card ${yapi.kart} (1 bekleniyor — referansta tek kart)`);
    if (yapi.item !== 254)     s.push(`kart içinde ${yapi.item} kayıt (254 bekleniyor)`);
    if (yapi.yabanciCocuk !== 0) s.push(`kartın içinde kayıt olmayan ${yapi.yabanciCocuk} düğüm`);

    /* 29 harfin 29'u: tıkla → dönen her kaydın baş harfi o harf olsun ve
       sayaç DOM'la uyuşsun. Karşılığı olmayan harf (Ğ) disabled, o yüzden
       tıklanabilir olanlar sayılıyor ve sayısı raporlanıyor. */
    const harfler = await page.$$eval('#szLetters .sz-ltr:not(.all)', bs =>
      bs.map(b => ({ h:b.textContent.trim(), bos:b.disabled })));
    const tiklanabilir = harfler.filter(h => !h.bos);
    const bozuk = [];
    for (const { h } of tiklanabilir) {
      await page.click(`#szLetters .sz-ltr[data-harf="${h}"]`);
      await page.waitForTimeout(60);
      const r = await page.evaluate(() => {
        const it = [...document.querySelectorAll('#szList .sz-item')];
        const t = (document.getElementById('szSayac') || {}).textContent || '';
        const m = t.match(/(\d+)\s*\/\s*(\d+)\s*terim/) || t.match(/(\d+)\s*terim/);
        return {
          adet: it.length,
          harfler: [...new Set(it.map(e => (e.querySelector('.sr-ltr') || {}).textContent))],
          sayac: m ? +m[1] : -1,
          kaydirildi: Math.round(scrollY),
          url: location.search
        };
      });
      if (r.adet === 0)                       bozuk.push(`${h}: 0 kayıt döndü`);
      else if (r.harfler.join('') !== h)      bozuk.push(`${h}: dönen kayıtların baş harfi "${r.harfler.join(',')}"`);
      if (r.sayac !== r.adet)                 bozuk.push(`${h}: sayaç ${r.sayac} ≠ DOM ${r.adet}`);
      if (!new RegExp(`harf=${encodeURIComponent(h)}`).test(r.url)) bozuk.push(`${h}: adrese yazılmadı (${r.url})`);
    }
    await page.click('#szLetters .sz-ltr[data-harf=""]');
    await page.waitForTimeout(80);
    const geri = await page.evaluate(() => document.querySelectorAll('#szList .sz-item').length);
    if (geri !== 254) bozuk.push(`"Tümü"ye dönüşte ${geri} kayıt (254 bekleniyor)`);
    if (bozuk.length) s.push(bozuk.join('\n      '));

    if (!s.length) ok(`madde 7 tam parite: grup başlığı 0 · .sz-card 1 · kayıt 254 · harf rayı ${tiklanabilir.length}/${harfler.length} tıklanabilir harfin hepsinde doğru kayıt + sayaç + adres (ray ÇAPA değil SÜZGEÇ, başlık kalkınca bozulmadı)`);
    else rec('madde 7 tam parite (grup başlığı / tek kart / ray)', s.join('\n      '));
  }

  /* --- MADDE 7c · sayaç kendi satırında --- */
  {
    const r = await page.evaluate(() => {
      const c = document.querySelector('.sz-count');
      const liste = document.querySelector('#szList');
      const kart = document.querySelector('.sz-card');
      if (!c || !liste || !kart) return null;
      const cr = c.getBoundingClientRect(), kr = kart.getBoundingClientRect();
      return {
        bantIcinde: !!c.closest('.sz-controls'),
        ffIcinde: !!c.closest('.ff-bar, .ff-count, [data-ff]'),
        listedenOnce: cr.top < liste.getBoundingClientRect().top,
        genislikFark: Math.round((cr.width - kr.width) * 10) / 10,
        solFark: Math.round((cr.left - kr.left) * 10) / 10,
        metin: c.textContent.replace(/\s+/g,' ').trim()
      };
    });
    const s = [];
    if (!r)                    s.push('sayaç ya da liste bulunamadı');
    else {
      if (r.bantIcinde)        s.push('sayaç hâlâ süzgeç bandının içinde');
      if (r.ffIcinde)          s.push('sayaç hâlâ "Filtrele" bileşeninin içinde');
      if (!r.listedenOnce)     s.push('sayaç listenin üstünde değil');
      if (r.genislikFark !== 0)s.push(`sayaç satırı kolon genişliğinde değil (fark ${r.genislikFark} px)`);
      if (r.solFark !== 0)     s.push(`sayaç sol kenarı kartla hizalı değil (fark ${r.solFark} px)`);
    }
    if (!s.length) ok(`madde 7c: sayaç kendi satırında, listenin üstünde, kolon genişliğinde — "${r.metin}"`);
    else rec('madde 7c (sayaç satırı)', s.join('\n      '));
  }

  /* --- MADDE 8 · arama çip satırında --- */
  {
    const r = await page.evaluate(() => {
      const chips = document.querySelector('#szCats'),
            find  = document.querySelector('.sz-find'),
            harf  = document.querySelector('#szLetters');
      if (!chips || !find || !harf) return null;
      const c = chips.getBoundingClientRect(), f = find.getBoundingClientRect(),
            h = harf.getBoundingClientRect();
      return {
        ustFark: Math.round(Math.abs(c.top - f.top) * 10) / 10,
        solFark: Math.round((c.left - h.left) * 10) / 10,
        ayniSatir: Math.abs(c.top - f.top) < 1 && f.left > c.left,
        gorunurCip: [...document.querySelectorAll('#szCats .df-fchip')].filter(x => {
          const r2 = x.getBoundingClientRect();
          return r2.left >= c.left - 1 && r2.right <= c.right + 1;
        }).length
      };
    });
    const s = [];
    if (!r)                 s.push('çip rayı ya da arama kutusu bulunamadı');
    else {
      if (r.ustFark !== 0)  s.push(`arama ile çip rayının üst kenarı ${r.ustFark} px kaçık (0 bekleniyor)`);
      if (r.solFark !== 0)  s.push(`çip rayının sol boşluğu ${r.solFark} px (0 bekleniyor)`);
      if (!r.ayniSatir)     s.push('arama kutusu çip rayının sağında, aynı satırda değil');
      if (r.gorunurCip < 2) s.push(`o satırda görünür çip ${r.gorunurCip} (en az 2 bekleniyor)`);
    }
    if (!s.length) ok(`madde 8: üst kenar farkı ${r.ustFark} px · sol boşluk ${r.solFark} px · aynı satırda görünür çip ${r.gorunurCip}`);
    else rec('madde 8 (arama satırı)', s.join('\n      '));
  }

  /* --- MADDE 9 · akordiyon TEK-AÇIK, üç ardışık tıklama --- */
  {
    const satirlar = await page.$$('#szList .sz-row');
    const adim = [];
    for (const i of [0, 4, 9]) {
      await satirlar[i].click();
      await page.waitForTimeout(220);
      adim.push(await page.evaluate(() => ({
        acikKart: document.querySelectorAll('#szList .sz-item.open').length,
        acikAria: document.querySelectorAll('#szList .sz-row[aria-expanded="true"]').length,
        acikGovde: [...document.querySelectorAll('#szList .sz-detail')].filter(d => !d.hidden).length
      })));
    }
    const s = [];
    adim.forEach((a, i) => {
      if (a.acikKart !== 1)  s.push(`${i+1}. tıklamada açık kart ${a.acikKart} (1 bekleniyor)`);
      if (a.acikAria !== 1)  s.push(`${i+1}. tıklamada aria-expanded="true" ${a.acikAria} (1 bekleniyor)`);
      if (a.acikGovde !== 1) s.push(`${i+1}. tıklamada görünür gövde ${a.acikGovde} (1 bekleniyor)`);
    });
    /* aynı satıra ikinci kez basınca kapanmalı (toggle bozulmasın) */
    await satirlar[9].click(); await page.waitForTimeout(220);
    const kapali = await page.evaluate(() => document.querySelectorAll('#szList .sz-item.open').length);
    if (kapali !== 0) s.push(`aynı satıra ikinci tıklamada açık kart ${kapali} (0 bekleniyor)`);
    if (!s.length) ok(`madde 9: üç ardışık tıklamada açık kart 1 · 1 · 1 (aria ve gövde de 1) · aynı satıra ikinci tıklama kapatıyor`);
    else rec('madde 9 (tek-açık akordiyon)', s.join('\n      '));
  }

  /* --- MADDE 7b · açık kaydın sol dikey şeridi YOK --- */
  {
    await page.click('#szList .sz-row');
    await page.waitForTimeout(220);
    const r = await page.evaluate(() => {
      const it = document.querySelector('#szList .sz-item.open');
      if (!it) return null;
      const c = getComputedStyle(it), row = getComputedStyle(it.querySelector('.sz-row'));
      const seritVar = (s) => /inset/.test(s) && s !== 'none';
      return {
        itemShadow:c.boxShadow, rowShadow:row.boxShadow,
        itemBorderLeft:c.borderLeftWidth, rowBorderLeft:row.borderLeftWidth,
        seritSayisi: [...document.querySelectorAll('#szList .sz-item.open, #szList .sz-item.open .sz-row')]
          .filter(e => { const b = getComputedStyle(e);
            return seritVar(b.boxShadow) || parseFloat(b.borderLeftWidth) > 0; }).length,
        rowBg: row.backgroundColor
      };
    });
    const s = [];
    if (!r) s.push('açık kayıt bulunamadı');
    else if (r.seritSayisi !== 0)
      s.push(`açık kayıtta sol şerit taşıyan düğüm: ${r.seritSayisi} ` +
             `(item box-shadow "${r.itemShadow}" · border-left ${r.itemBorderLeft})`);
    if (!s.length) ok(`madde 7b: açık kayıtta sol dikey şerit 0 — işaret zeminde (satır zemini ${r.rowBg})`);
    else rec('madde 7b (sol şerit)', s.join('\n      '));
  }

  /* --- MADDE 7 ÖLÇÜ · kart iskeleti · dolgu · tipografi @1440 --- */
  await karsilastir(page, REF, 'madde 7 ölçü @1440');

  /* --- KENDİ ELEŞTİRİM · R8'de yakalanıp düzeltilen dört kusur ---
     Bunlar brief'in maddesi değil; uygulama sırasında ölçümle bulundu ve
     düzeltildi. Nöbete giriyorlar ki geri gelmesinler. */
  {
    const s = [];

    /* 1 · karşılığı olmayan harf SEÇİLİ basılıyordu (`data-harf` taşımadığı
       için '' === '' eşleşmesi tutuyordu) → soluk ama DOLU yeşil düğme */
    const bosHarf = await page.evaluate(() =>
      [...document.querySelectorAll('#szLetters .sz-ltr.is-empty')]
        .map(b => ({ h:b.textContent.trim(), on:b.classList.contains('on'),
                     bg:getComputedStyle(b).backgroundColor })));
    const yanlisSecili = bosHarf.filter(b => b.on);
    if (yanlisSecili.length)
      s.push(`karşılığı olmayan harf seçili basılıyor: ${yanlisSecili.map(b => b.h).join(', ')}`);

    /* 2 · "HARF KARESİ TEK YERDE" — ÇEVRİLMİŞ ÖLÇÜT (K62 kuralı).
       Özgün kusur: grup başlığındaki koyu harf karesi, madde 7a'nın eklediği
       satır avatarıyla aynı motifin ikinci sürümüydü. Beyar tam parite deyip
       başlığı komple kaldırınca kusurun KÖKÜ gitti; ölçüt silinmedi, aynı
       niyeti yeni yapıda nöbetliyor: sayfada harf taşıyan renkli kare
       YALNIZCA `.sr-ltr` olmalı ve sayısı kayıt sayısına eşit olmalı. */
    const kare = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('#szList .sz-row')];
      /* satır içinde zemini olan + yarıçapı olan + metni tek harf olan kutular */
      const kareler = rows.flatMap(r => [...r.children].filter(e => {
        const c = getComputedStyle(e), t = (e.textContent || '').trim();
        return t.length === 1 && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(c.borderRadius) > 0;
      }));
      return {
        avatar: document.querySelectorAll('#szList .sr-ltr').length,
        harfKaresi: kareler.length,
        avatarDisi: kareler.filter(e => !e.classList.contains('sr-ltr')).length,
        eskiBaslik: document.querySelectorAll('.sz-gh, .sz-group, .sz-gh .g').length
      };
    });
    if (kare.eskiBaslik !== 0)
      s.push(`harf grubu başlığı geri gelmiş: ${kare.eskiBaslik} düğüm (Beyar tam parite kararı: 0)`);
    if (kare.avatarDisi !== 0)
      s.push(`satırda .sr-ltr olmayan ${kare.avatarDisi} harf karesi — motif ikinci kez çizilmiş`);
    if (kare.harfKaresi !== kare.avatar)
      s.push(`harf karesi ${kare.harfKaresi} ≠ avatar ${kare.avatar}`);

    /* 3 · çip rayının kenar maskesi SABİTTİ: sonuna kadar kaydırılınca bile
       sağ kenarı soluklaştırıp "devamı var" diyordu */
    const maske = await page.evaluate(async () => {
      const el = document.querySelector('.sz-chips');
      if (!el) return { yok:true };
      const oku = () => ({ cls:el.className, m:(getComputedStyle(el).maskImage || 'none') });
      el.scrollLeft = 0;      await new Promise(r => setTimeout(r, 260));
      const bas = oku();
      el.scrollLeft = el.scrollWidth; await new Promise(r => setTimeout(r, 260));
      const son = oku();
      return { bas, son, tasiyor: el.scrollWidth - el.clientWidth > 1 };
    });
    if (maske.yok)       s.push('.sz-chips (açık çip rayı) DOM\'da yok — kenar maskesi ölçülemedi');
    else if (!maske.tasiyor) s.push('çip rayı taşmıyor — kenar maskesi ölçülemedi');
    else {
      if (!/on-sag/.test(maske.bas.cls) || /on-sol/.test(maske.bas.cls))
        s.push(`çip rayı BAŞTA yanlış kenar durumu: "${maske.bas.cls}"`);
      if (!/on-sol/.test(maske.son.cls) || /on-sag/.test(maske.son.cls))
        s.push(`çip rayı SONDA yanlış kenar durumu: "${maske.son.cls}" — sona gelindiği hâlde sağ kenar hâlâ soluklaşıyor`);
    }

    /* 4 · "Filtreleri temizle" — R6'da kabuk bileşeni onu GİZLİYORDU (kanonik
       düğme kullanıcıya hiç görünmüyordu). R8'de süzgeç varken görünüyor. */
    const reset = await page.evaluate(async () => {
      const b = document.getElementById('szReset');
      const tum = document.querySelector('#szCats .df-fchip[data-kat=""]');
      const kat = document.querySelector('#szCats .df-fchip[data-kat="ekipman"]');
      if (!b || !tum || !kat) return { yok:true };
      const gor = () => ({ hidden:b.hidden, h:Math.round(b.getBoundingClientRect().height) });
      /* önce her şeyi temizle */
      tum.click();
      await new Promise(r => setTimeout(r, 160));
      const bos = gor();
      kat.click();
      await new Promise(r => setTimeout(r, 160));
      const dolu = gor();
      document.getElementById('szReset').click();
      await new Promise(r => setTimeout(r, 200));
      return { bos, dolu, sonrasi:gor() };
    });
    if (reset.yok) s.push('#szReset ya da çipler bulunamadı — temizle düğmesi ölçülemedi');
    else {
    if (!reset.bos.hidden || reset.bos.h !== 0)
      s.push(`süzgeç yokken "Filtreleri temizle" görünür (yükseklik ${reset.bos.h})`);
    if (reset.dolu.hidden || reset.dolu.h < 24)
      s.push(`süzgeç varken "Filtreleri temizle" görünmüyor (hidden ${reset.dolu.hidden}, yükseklik ${reset.dolu.h})`);
    if (!reset.sonrasi.hidden)
      s.push('temizledikten sonra düğme hâlâ görünür');
    }

    if (!s.length) ok(`kendi eleştirim: boş harf seçili değil (${bosHarf.map(b=>b.h).join(',')||'-'}) · harf karesi tek yerde (${kare.avatar} avatar, avatar dışı 0, eski başlık 0) · çip maskesi kenara göre değişiyor (baş "${maske.bas.cls}" → son "${maske.son.cls}") · temizle düğmesi ${reset.bos.h}→${reset.dolu.h}→${reset.sonrasi.h} px`);
    else rec('kendi eleştirim (R8 kusurları)', s.join('\n      '));
  }

  await ctx.close();
}

/* ================= LİSTE SAYFASI @390 ================= */
{
  const { ctx, page } = await ac(390);
  await page.goto(`${BASE}/${LISTE}`, { waitUntil:'load' });
  await page.waitForSelector('#szList .sz-item', { timeout:10000 });
  await page.click('#szList .sz-row');
  await page.waitForTimeout(220);
  await karsilastir(page, REF390, 'madde 7 ölçü @390');

  const tasma = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
  if (tasma === 0) ok('madde 8 @390: yatay taşma 0');
  else rec('madde 8 @390', `yatay taşma ${tasma} px`);

  await ctx.close();
}

/* ================= BANNER AİLESİ (üç genişlik) ================= */
{
  const olculen = {};
  for (const w of [1440, 1024, 390]) {
    const { ctx, page } = await ac(w);
    await page.goto(`${BASE}/${LISTE}`, { waitUntil:'load' });
    await page.waitForTimeout(250);
    olculen[w] = await page.evaluate(() =>
      Math.round(document.querySelector('.lib-top').getBoundingClientRect().height));
    await ctx.close();
  }
  const s = [];
  for (const w of [1440, 1024, 390])
    if (olculen[w] !== SABIT.banner[w])
      s.push(`@${w} banner ${olculen[w]} (${SABIT.banner[w]} bekleniyor)`);
  if (!s.length) ok(`banner ailesi (liste): ${olculen[1440]} / ${olculen[1024]} / ${olculen[390]} — sabit korundu`);
  else rec('banner ailesi', s.join('\n      '));
}

/* ================= MADDE 10 · DETAY SAYFASI ================= */
{
  const { ctx, page } = await ac(1440);
  /* iki farklı terim: biri kütüphane köprüsü olan, biri olmayan.
     Adres sözleşmesi `?slug=` (sozluk-detay-v1.html satır 208).
     BEKLENEN H1 burada YAZILI — sınama HTTP değil HEDEF kontrol ediyor. */
  for (const [slug, bekH1] of [['plank','Plank'], ['amrap','AMRAP']]) {
    await page.goto(`${BASE}/${DETAY}?slug=${slug}`, { waitUntil:'load' });
    await page.waitForTimeout(350);
    const r = await page.evaluate(() => {
      /* GÖRÜNEN metin: textContent <style>/<script> gövdesini de sayıyor ve
         kaldırma gerekçesini anlatan yorumlara takılıyor. innerText görünen
         metni verir. */
      const metin = (document.querySelector('main')||document.body).innerText || '';
      return {
        h1: (document.querySelector('#szH1')||{textContent:''}).textContent.trim(),
        askDugum: document.querySelectorAll('.sz-ask, .sz-ask li, .sz-ask-note').length,
        tagDugum: document.querySelectorAll('.sz-tags, .sz-tags a, .sz-tags .fixed').length,
        askBaslik: /Sık aranan sorular/.test(metin) ? 1 : 0,
        tagBaslik: /(^|\s)Etiketler(\s|$)/.test(metin) ? 1 : 0,
        /* kırık iç çapa: sayfadaki her #hedef gerçekten var mı */
        kirikCapa: [...document.querySelectorAll('a[href^="#"]')]
          .map(a => a.getAttribute('href'))
          .filter(h => h.length > 1 && !document.querySelector(h)).length,
        /* bölüm sayısı — kalanlar duruyor mu */
        blok: document.querySelectorAll('.sz-block').length,
        aile: document.querySelectorAll('.sz-fam a').length,
        kunye: document.querySelectorAll('.sz-kunye .r').length
      };
    });
    const s = [];
    if (r.askDugum !== 0) s.push(`${slug}: "sık aranan sorular" düğümü ${r.askDugum} (0 bekleniyor)`);
    if (r.askBaslik !== 0) s.push(`${slug}: "Sık aranan sorular" başlığı hâlâ metinde`);
    if (r.tagDugum !== 0) s.push(`${slug}: "etiketler" düğümü ${r.tagDugum} (0 bekleniyor)`);
    if (r.tagBaslik !== 0) s.push(`${slug}: "Etiketler" başlığı hâlâ metinde`);
    if (r.kirikCapa !== 0) s.push(`${slug}: kırık iç çapa ${r.kirikCapa}`);
    /* kaldırılan iki bölümün DIŞINDAKİLER duruyor mu — bölüm kaybı olmasın */
    if (r.blok < 2)  s.push(`${slug}: kalan bölüm ${r.blok} (en az 2 bekleniyor)`);
    if (r.aile < 1)  s.push(`${slug}: aile listesi boş`);
    if (r.kunye < 4) s.push(`${slug}: künye ${r.kunye} satır`);
    /* HEDEF kontrolü — h1 beklenen kayıtla BİREBİR eşleşiyor */
    if (r.h1 !== bekH1) s.push(`${slug}: h1 "${r.h1}" ≠ beklenen "${bekH1}"`);
    if (!s.length) ok(`madde 10 (${slug}): iki bölüm 0 · kırık iç çapa 0 · kalan bölüm ${r.blok} · aile ${r.aile} · künye ${r.kunye} · h1 "${r.h1}"`);
    else rec('madde 10 (detay bölümleri)', s.join('\n      '));
  }

  /* kaldırılan bölümlere GİDEN bağlantı var mıydı — sözlük listesinden
     ve detaydan çıkan iç bağlantıların hepsi hâlâ karşılıklı mı */
  await page.goto(`${BASE}/${DETAY}?slug=plank`, { waitUntil:'load' });
  await page.waitForTimeout(300);
  const adresler = await page.evaluate(() => [...document.querySelectorAll('main a[href]')]
    .map(a => a.getAttribute('href'))
    .filter(h => h && !/^(https?:|mailto:|tel:|#)/.test(h)));
  const kirik = [];
  for (const h of [...new Set(adresler)]) {
    const yol = h.split('?')[0].split('#')[0];
    if (!yol) continue;
    let st = 0;
    try { st = (await fetch(`${BASE}/${yol}`)).status; } catch(e){ st = 0; }
    if (st !== 200) kirik.push(`${h} → ${st || 'bağlanılamadı'}`);
  }
  if (!kirik.length) ok(`madde 10: detay sayfasından çıkan ${new Set(adresler).size} iç adresin hepsi HTTP 200`);
  else rec('madde 10 (kırık bağlantı)', kirik.join('\n      '));

  await ctx.close();
}

if (konsol.length) rec('konsol hatası', konsol.slice(0, 8).join('\n      '));
else ok('konsol hatası 0 (liste @1440 · @1024 · @390 · detay 3 yükleme)');

await browser.close();

if (!fail) console.log('\n✓ 0 sorun\n');
else { console.log(`\n✗ ${fail} sorun\n`); bad.forEach(b => console.log('  · ' + b)); process.exit(1); }
