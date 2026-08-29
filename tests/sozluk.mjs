/* =====================================================================
   DADAFIT — SPOR SÖZLÜĞÜ SINAMASI  (H1 · 5. tur)
   ---------------------------------------------------------------------
   Neyi kanıtlar (brief'in on kabul ölçütü, tek tek):
      1. `sozluk-v1.html` ve `sozluk-detay-v1.html` HTTP 200
      2. Arama 3 HARFTEN İTİBAREN süzüyor — 1 ve 2 harfte liste değişmiyor,
         3. harfte değişiyor
      3. Boş durum var — hiçbir sonuç döndürmeyen sorguda blok görünüyor
      4. HER KATEGORİ ≥8 terim döndürüyor — seçicideki her kalem tek tek
      5. KARŞILIKSIZ HARF 0 — harf rayındaki tıklanabilir her harf ≥1 terim
         (karşılığı olmayan harf `.is-empty` + disabled basılıyor)
      6. Sayaç gerçek sayıyı yazıyor — DOM'daki kart sayısı = sayaçtaki sayı,
         üç ayrı filtre durumunda
      7. Tüm dahili köprüler 200 — sözlük içi + egzersiz-detay köprüleri.
         `anatomi-v1.html` köprüleri AYRI SAYILIR ve kırmızıya döndürmez:
         o sayfa H2 oturumunun branch'inde, birleştirmeden sonra karşılık
         bulacak. Sayısı raporlanır.
      8. Banner ailesi birebir — sozluk-v1 @1440/1024/390 = 544/607/587
         (LİSTE), sozluk-detay-v1 = 560/617/726 (DETAY)
      9. Konsol hatası 0 · yatay taşma 0 — @1440 ve @390
     10. Detay sayfası HER terim slug'ında dolu — bütün terimler tek tek
         geziliyor (h1, tanım, örnek, künye, aile listesi, önceki/sonraki).
         R8 madde 10: "sık aranan sorular" ve "etiketler" bölümleri KALKTI —
         nöbet artık ikisinin de 0 olduğunu doğruluyor.
         Bilinmeyen slug'da sayfa 200 dönüp "bulunamadı" durumu basıyor.
     11. AÇILIR SATIR deseni çalışıyor (referans ölçümünden geldi): satır
         kapalı başlıyor, tıklayınca aria-expanded="true" olup gövde
         görünüyor, yeniden tıklayınca kapanıyor; satırın sağında detay
         sayfasına giden ok YOK (R6 madde 9).
     12. R8 madde 7d + 8 — kategori çipleri açıkta, arama çip rayıyla aynı
         satırda (üst kenar farkı 0), çip rayının solu boş değil.

   Çalıştırma:
     python3 -m http.server 8821 &
     export PW_HOME=~/.pw
     node tests/sozluk.mjs                       # varsayılan taban 8821
     node tests/sozluk.mjs http://localhost:8811
     node tests/sozluk.mjs http://localhost:8811 --hizli   # detay taraması örneklemli
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync } from 'node:fs';

/* =====================================================================
 ⚠ R15'TE ATLANDI — Beyar kararı, 2026-08-29:
   "Kırmızı testleri devre dışı bırak — silme, sadece atlanacak duruma
    getir. Bir daha test güncellemesiyle uğraşma. Bir şey kırılırsa
    tarayıcıda ölç ve kanıtla, yeterli."
 ---------------------------------------------------------------------
 İDDİALAR SİLİNMEDİ, dosya olduğu gibi duruyor — yalnız koşmuyor.
 Kırmızı olma sebebi (ölçüldü, 2026-08-29):
   eski kararı kodluyor: 3 sorun — sözlük sayfaları bu sürümde yok, kalan ölçütler koşturulamadı
 Yeniden açmak için:  FIT_TESTI_ZORLA=1 node tests/sozluk.mjs
 ===================================================================== */
if (!process.env.FIT_TESTI_ZORLA) {
  console.log('ATLANDI (R15) — eski kararı kodluyor: 3 sorun');
  process.exit(0);
}


const ARGS  = process.argv.slice(2);
const BASE  = (ARGS.find(a => /^https?:/.test(a)) || 'http://localhost:8821').replace(/\/$/, '');
const HIZLI = ARGS.includes('--hizli');

const LISTE = 'sozluk-v1.html';
const DETAY = 'sozluk-detay-v1.html';
const VERI  = 'assets/js/sozluk-veri.js';

const ONDISK = new Set(readdirSync(new URL('..', import.meta.url)).filter(f => f.endsWith('.html')));

/* egzersiz kütüphanesinde GERÇEKTEN var olan hareket slug'ları */
const HAREKET_SLUG = new Set([
  'goblet-squat','plank','dambil-kurek','sinav',
  'hamle','dambil-omuz-press','dambil-biceps','dead-bug',
  'kettlebell-swing','bant-cekme','kopru','bant-yana-acma',
  'hava-squat','ters-sinav','superman','yuzucu',
  'barfiks','sehpa-dips','bulgar-split-squat','tek-bacak-kopru',
  'yan-plank','dag-tirmanisi','burpee','dambil-gogus-press',
  'dambil-romanya'
]);
/* H2 oturumunun sabitlediği kas slug sözlüğü */
const KAS_SLUG = new Set(('boyun trapez-ust trapez-orta-alt deltoid-on deltoid-yan deltoid-arka ' +
  'gogus serratus latissimus romboid rotator-manset biceps triceps on-kol-fleksor on-kol-ekstansor ' +
  'karin-duz karin-yan erector-spinae kalca-fleksor gluteus-maximus gluteus-medius adduktor ' +
  'quadriceps hamstring gastrocnemius soleus tibialis-on').split(' '));

/* banner aile ölçüleri — DEVIR-5 §2a, referanstan ölçülmüş sabitler */
const BANNER = {
  [LISTE]: { 1440:544, 1024:607, 390:587, aile:'liste' },
  [DETAY]: { 1440:560, 1024:617, 390:726, aile:'detay' }
};

let fail = 0; const bad = []; const notlar = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);
const not = (m) => { notlar.push(m); console.log('  · ' + m); };

console.log(`\n=== SPOR SÖZLÜĞÜ · ${BASE} ===\n`);

/* ---------- 1 · sayfalar ve veri dosyası var mı ---------- */
let sayfalarVar = true;
for (const f of [LISTE, DETAY, VERI]) {
  let st = 0;
  try { st = (await fetch(`${BASE}/${f}`)).status; } catch (e) { st = 0; }
  if (st === 200) ok(`${f} → HTTP 200`);
  else { rec('sayfa yok', `${f} → HTTP ${st || 'bağlanılamadı'}`); sayfalarVar = false; }
}

if (!sayfalarVar) {
  console.log('\n✗ ' + fail + ' sorun — sözlük sayfaları bu sürümde yok, kalan ölçütler koşturulamadı\n');
  bad.forEach(b => console.log('  · ' + b));
  process.exit(1);
}

const browser = await chromium.launch();

/* ortak sayfa açıcı — çerez onayı önceden verilir, dış kaynaklar bloklanır */
async function ac(width = 1440, { hizlandir = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent', 'accepted'); } catch (e) {} });
  if (hizlandir) {
    /* 230 sayfa yüklemesini makul sürede bitirmek için dış kaynaklar
       (ikon CDN'i, banner görseli) kesiliyor. Kesilen istek tarayıcıda
       "Failed to load resource" konsol hatası üretir — bu SAYFANIN hatası
       değil, testin kendi kısıtı. Konsol denetimi bu yüzden yalnız o
       gürültüyü eleyerek yapılır; JS istisnaları (pageerror) elenmez. */
    await ctx.route('**/*', r => {
      const u = r.request().url();
      if (/cdnjs\.cloudflare\.com|images\.unsplash\.com|fonts\./.test(u)) return r.abort();
      return r.continue();
    });
  }
  const page = await ctx.newPage();
  const konsol = [];
  const gurultu = /Failed to load resource|ERR_FAILED|ERR_BLOCKED/i;
  page.on('pageerror', e => konsol.push('pageerror: ' + e.message.split('\n')[0]));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (hizlandir && gurultu.test(t)) return;      /* kesilen dış kaynak — bkz. yukarıdaki not */
    konsol.push('console.error: ' + t.slice(0, 140));
  });
  return { ctx, page, konsol };
}

/* liste sayfasının süzgeç durumunu okuyan tek yardımcı.
   R6 madde 10 — sayaç kabuğun .ff-bar'ının sağ ucuna taşındı (data-ff-count)
   ve kısaldı: süzgeçsizken "254 terim", süzgeçliyken "55 / 254 terim". */
const OKU = () => {
  const kart = document.querySelectorAll('#szList .sz-item').length;
  const t = (document.getElementById('szSayac') || {}).textContent || '';
  const bol = t.match(/(\d+)\s*\/\s*(\d+)\s*terim/);
  const tek = t.match(/^\s*(\d+)\s*terim/);
  const sayac  = bol ? +bol[1] : (tek ? +tek[1] : -1);
  const toplam = bol ? +bol[2] : (tek ? +tek[1] : -1);
  const bosDurum = !!document.querySelector('#szEmpty.show');
  return { kart, sayac, toplam, bosDurum, metin: t.trim() };
};


/* R8 madde 7d — kategori ekseni AÇILIR MENÜDEN ÇIKTI. R6'da çipler kabuğun
   `.lib-filters.ff[data-ff]` bileşeninin kapalı panelindeydi ve bu yardımcı
   önce menüyü açıyordu; R8 kardeş markayla hizalanıp çipleri açık bir raya
   çıkardı (referans: dadagastro.com/mutfak-sozlugu `.ke-filter`).
   Çip artık doğrudan tıklanıyor — kullanıcının gerçek yolu bu. */
async function katSec(page, kat){
  await page.click(`#szCats .df-fchip[data-kat="${kat}"]`);
  await page.waitForTimeout(70);
}
/* R8: kapatılacak menü kalmadı. Çağrı yerleri korunuyor ki blokların
   akışı ve numaralandırması aynı kalsın. */
async function menuKapat(){ /* R8'de menü yok */ }
/* "Filtreleri temizle" (#szReset) — R8'de çip rayının yanında, YALNIZ
   temizlenecek bir süzgeç varken görünür. Nöbet gerçek düğmeyi tetikliyor. */
async function hepsiniTemizle(page){
  await page.evaluate(() => document.getElementById('szReset').click());
  await page.waitForTimeout(140);
}

/* ================= LİSTE SAYFASI ================= */
{
  const { ctx, page, konsol } = await ac(1440);
  await page.goto(`${BASE}/${LISTE}`, { waitUntil: 'load' });
  await page.waitForSelector('#szList .sz-item', { timeout: 10000 });

  /* veri özeti — sayılar diziden okunuyor, testte sabit yazılmıyor */
  const D = await page.evaluate(() => {
    const S = window.SOZLUK;
    return {
      toplam: S.TERIMLER.length,
      kategoriler: S.KATEGORILER.map(k => ({ id: k.id, ad: k.ad, adet: k.adet })),
      alfabe: S.ALFABE,
      harfSayi: S.harfSayi,
      sluglar: S.TERIMLER.map(t => t.slug),
      kategoriSlug: S.TERIMLER.map(t => ({ slug: t.slug, kategori: t.kategori })),
      hareketKop: S.TERIMLER.filter(t => t.hareket).map(t => t.hareket),
      kasKop: S.TERIMLER.filter(t => t.kas).map(t => t.kas)
    };
  });
  ok(`veri: ${D.toplam} terim · ${D.kategoriler.length} kategori · ` +
     `${D.alfabe.filter(h => D.harfSayi[h]).length}/${D.alfabe.length} harf dolu`);

  /* --- 6a · sayaç = kart sayısı (filtresiz) --- */
  const bas = await page.evaluate(OKU);
  if (bas.kart === bas.sayac && bas.sayac === D.toplam && bas.toplam === D.toplam)
    ok(`sayaç doğru (filtresiz): DOM ${bas.kart} kart = sayaç ${bas.sayac} = veri ${D.toplam}`);
  else rec('sayaç (filtresiz)', JSON.stringify({ ...bas, veri: D.toplam }));

  /* --- 2 · arama 3 harfte süzüyor --- */
  {
    const kelime = 'tempo';
    const olcum = [];
    for (let n = 0; n <= 4; n++) {
      await page.fill('#szQ', kelime.slice(0, n));
      await page.waitForTimeout(60);
      olcum.push({ n, ...(await page.evaluate(OKU)) });
    }
    const [h0, h1, h2, h3] = olcum;
    const sabit = h0.kart === h1.kart && h1.kart === h2.kart && h2.kart === D.toplam;
    const suzdu = h3.kart < h2.kart && h3.kart > 0;
    if (sabit && suzdu)
      ok(`arama eşiği 3: 0/1/2 harfte ${h2.kart} kart (değişmedi), 3. harfte ${h3.kart} kart`);
    else rec('arama eşiği', `0h=${h0.kart} 1h=${h1.kart} 2h=${h2.kart} 3h=${h3.kart} (veri toplam ${D.toplam})`);
    await page.fill('#szQ', '');
    await page.waitForTimeout(60);
  }

  /* --- 3 · boş durum --- */
  {
    await page.fill('#szQ', 'zzzqqqxxx');
    await page.waitForTimeout(80);
    const r = await page.evaluate(OKU);
    const gorunur = await page.evaluate(() => {
      const e = document.querySelector('#szEmpty');
      if (!e) return false;
      const s = getComputedStyle(e);
      return s.display !== 'none' && e.getBoundingClientRect().height > 0;
    });
    if (r.kart === 0 && r.sayac === 0 && r.bosDurum && gorunur)
      ok('boş durum: sonuçsuz sorguda blok görünüyor, sayaç 0 yazıyor');
    else rec('boş durum', JSON.stringify({ ...r, gorunur }));

    /* "filtreleri temizle" gerçekten geri getiriyor mu */
    await page.click('#szEmptyReset');
    await page.waitForTimeout(120);
    const g = await page.evaluate(OKU);
    if (g.kart === D.toplam) ok('boş durumdaki "filtreleri temizle" listeyi geri getiriyor');
    else rec('boş durum temizle', `temizlemeden sonra ${g.kart} kart, beklenen ${D.toplam}`);
  }

  /* --- 4 · her kategori ≥8 terim (seçicideki HER kalem) --- */
  {
    const kalemler = await page.$$eval('#szCats .df-fchip', bs =>
      bs.map(b => ({ kat: b.getAttribute('data-kat') || '', ad: b.textContent.trim() })));
    const kucuk = [], dagilim = [];
    for (const k of kalemler) {
      await katSec(page, k.kat);
      const r = await page.evaluate(OKU);
      if (k.kat === '') { if (r.kart !== D.toplam) kucuk.push(`Tümü → ${r.kart} (beklenen ${D.toplam})`); continue; }
      dagilim.push(`${k.kat}:${r.kart}`);
      if (r.kart < 8) kucuk.push(`${k.kat} → ${r.kart} terim`);
      if (r.kart !== r.sayac) kucuk.push(`${k.kat} sayaç uyuşmadı: DOM ${r.kart} ≠ sayaç ${r.sayac}`);
    }
    if (!kucuk.length) ok(`${kalemler.length - 1} kategorinin hepsi ≥8 terim döndürdü (${dagilim.join(' · ')})`);
    else rec('kategori ≥8', kucuk.join('\n      '));
    await katSec(page, '');
    await menuKapat(page);
  }

  /* --- 5 · karşılıksız harf 0 --- */
  {
    const harfler = await page.$$eval('#szLetters .sz-ltr', bs => bs.map(b => ({
      harf: b.getAttribute('data-harf') || '',
      bos: b.disabled || b.classList.contains('is-empty'),
      metin: b.textContent.trim()
    })));
    const tiklanabilir = harfler.filter(h => !h.bos && h.harf);
    const bosDonen = [];
    for (const h of tiklanabilir) {
      await page.click(`#szLetters .sz-ltr[data-harf="${h.harf}"]`);
      await page.waitForTimeout(40);
      const r = await page.evaluate(OKU);
      if (r.kart < 1) bosDonen.push(`${h.harf} → 0 terim`);
      if (r.kart !== r.sayac) bosDonen.push(`${h.harf} sayaç uyuşmadı: ${r.kart} ≠ ${r.sayac}`);
    }
    const devreDisi = harfler.filter(h => h.bos).map(h => h.metin);
    if (!bosDonen.length)
      ok(`karşılıksız harf 0 — tıklanabilir ${tiklanabilir.length} harfin hepsi ≥1 terim` +
         (devreDisi.length ? ` · devre dışı harf: ${devreDisi.join(',')}` : ''));
    else rec('karşılıksız harf', bosDonen.join('\n      '));

    /* devre dışı harfin gerçekten karşılığı yok mu (veriyle çapraz) */
    const yanlisKapali = devreDisi.filter(h => (D.harfSayi[h] || 0) > 0);
    if (yanlisKapali.length) rec('yanlış devre dışı harf', yanlisKapali.join(', '));

    await page.click('#szLetters .sz-ltr[data-harf=""]');
    await page.waitForTimeout(50);
  }

  /* --- 6b/6c · sayaç, iki bileşik filtre durumunda daha --- */
  {
    /* durum 2: harf + kategori */
    await page.click('#szLetters .sz-ltr[data-harf="K"]');
    await katSec(page, 'anatomi');
    await menuKapat(page);
    const r2 = await page.evaluate(OKU);
    const bek2 = D.kategoriSlug.length && await page.evaluate(() =>
      window.SOZLUK.TERIMLER.filter(t => t.harf === 'K' && t.kategori === 'anatomi').length);
    if (r2.kart === r2.sayac && r2.kart === bek2)
      ok(`sayaç doğru (harf K + kategori anatomi): DOM ${r2.kart} = sayaç ${r2.sayac} = veri ${bek2}`);
    else rec('sayaç (harf+kategori)', JSON.stringify({ ...r2, veri: bek2 }));

    /* durum 3: kategori + arama */
    await page.click('#szLetters .sz-ltr[data-harf=""]');
    await katSec(page, 'kosu');
    await menuKapat(page);
    await page.fill('#szQ', 'koş');
    await page.waitForTimeout(90);
    const r3 = await page.evaluate(OKU);
    const bek3 = await page.evaluate(() => {
      const S = window.SOZLUK, q = S.sadele('koş');
      return S.TERIMLER.filter(t => t.kategori === 'kosu' && t._ara.indexOf(q) > -1).length;
    });
    if (r3.kart === r3.sayac && r3.kart === bek3)
      ok(`sayaç doğru (kategori koşu + arama "koş"): DOM ${r3.kart} = sayaç ${r3.sayac} = veri ${bek3}`);
    else rec('sayaç (kategori+arama)', JSON.stringify({ ...r3, veri: bek3 }));

    await hepsiniTemizle(page);
  }

  /* --- 11 · açılır satır deseni --- */
  {
    await page.goto(`${BASE}/${LISTE}?harf=J`, { waitUntil: 'load' });
    await page.waitForSelector('#szList .sz-item');
    const ilk = '#szList .sz-item:first-of-type';
    const d0 = await page.evaluate(sel => {
      const it = document.querySelector(sel), b = it.querySelector('.sz-row');
      const g = it.querySelector('.sz-detail');
      return {
        expanded: b.getAttribute('aria-expanded'),
        gizli: g.hidden,
        gorunur: g.getBoundingClientRect().height > 0,
        controls: b.getAttribute('aria-controls') === g.id,
        /* R6 MADDE 9 — satırın TEK işi var: açmak.
           Eskiden satırın sağında `fa-chevron-right` taşıyan ayrı bir <a>
           vardı ve terim sayfasına gidiyordu (iki hedefli tek satır).
           Nöbet o oktan, "açılan kaydın içindeki detay bağlantısı"na TAŞINDI. */
        satirdaLink: !!it.querySelector('.sz-row a, .sz-row [href]'),
        satirdaSagOk: !!it.querySelector('.sz-row .fa-chevron-right'),
        detayHref: (it.querySelector('.sz-detail a.sd-more') || {}).getAttribute
                 ? it.querySelector('.sz-detail a.sd-more').getAttribute('href') : '',
        slug: it.getAttribute('data-slug'),
        dugme: b.tagName
      };
    }, ilk);
    await page.click(`${ilk} .sz-row`);
    await page.waitForTimeout(80);
    const d1 = await page.evaluate(sel => {
      const it = document.querySelector(sel), b = it.querySelector('.sz-row'), g = it.querySelector('.sz-detail');
      return {
        expanded: b.getAttribute('aria-expanded'),
        gizli: g.hidden,
        gorunur: g.getBoundingClientRect().height > 0,
        tanim: (g.querySelector('p') || {}).textContent || '',
        ornek: (g.querySelector('.sd-ex') || {}).textContent || '',
        tamKayit: !!g.querySelector('a.sd-more[href]')
      };
    }, ilk);
    await page.click(`${ilk} .sz-row`);
    await page.waitForTimeout(80);
    const d2 = await page.evaluate(sel => {
      const it = document.querySelector(sel), b = it.querySelector('.sz-row');
      return { expanded: b.getAttribute('aria-expanded'), gizli: it.querySelector('.sz-detail').hidden };
    }, ilk);

    const sorun = [];
    if (d0.dugme !== 'BUTTON')                sorun.push('açma öğesi <button> değil: ' + d0.dugme);
    if (d0.expanded !== 'false' || !d0.gizli) sorun.push('satır kapalı başlamıyor');
    if (d0.gorunur)                           sorun.push('kapalıyken gövde görünüyor');
    if (!d0.controls)                         sorun.push('aria-controls gövdeyi göstermiyor');
    if (d0.satirdaLink)                       sorun.push('satırın içinde bağlantı var — satır yine iki hedefli (R6 madde 9)');
    if (d0.satirdaSagOk)                      sorun.push('satırda hâlâ sağ ok (fa-chevron-right) var (R6 madde 9)');
    if (d0.detayHref !== `${DETAY}?slug=${d0.slug}`) sorun.push(`açılan kayıttaki detay bağlantısı yanlış adreste: ${d0.detayHref}`);
    if (d1.expanded !== 'true' || d1.gizli || !d1.gorunur) sorun.push('tıklayınca açılmıyor');
    if (d1.tanim.length < 60)                 sorun.push('açılan gövdede tanım yok/kısa');
    if (d1.ornek.length < 15)                 sorun.push('açılan gövdede örnek yok/kısa');
    if (!d1.tamKayit)                         sorun.push('açılan kayıtta terim sayfası bağlantısı yok');
    if (d2.expanded !== 'false' || !d2.gizli) sorun.push('ikinci tıklamada kapanmıyor');
    if (!sorun.length) ok('açılır satır: kapalı başlıyor, tıklayınca tanım+örnek açılıyor, tekrar tıklayınca kapanıyor; satır TEK hedefli, terim sayfası bağlantısı açılan kaydın içinde');
    else rec('açılır satır', sorun.join('\n      '));

    await page.goto(`${BASE}/${LISTE}`, { waitUntil: 'load' });
    await page.waitForSelector('#szList .sz-item');
  }

  /* --- 11b · R6 MADDE 9 — TÜM LİSTEDE: sağ ok 0, detay bağlantısı N/N --- */
  {
    const r = await page.evaluate(() => {
      const items = [...document.querySelectorAll('#szList .sz-item')];
      const bek = s => 'sozluk-detay-v1.html?slug=' + s;
      return {
        toplam: items.length,
        sagOk:  items.filter(it => it.querySelector('.sz-row .fa-chevron-right, .sz-row a')).length,
        eskiOk: document.querySelectorAll('#szList a.sz-go').length,
        dogruDetay: items.filter(it => {
          const a = it.querySelector('.sz-detail a.sd-more[href]');
          return a && a.getAttribute('href') === bek(it.getAttribute('data-slug'));
        }).length,
        /* açma göstergesi (chevron-down) kalıyor — expand işareti */
        caret: items.filter(it => it.querySelector('.sr-caret.fa-chevron-down')).length
      };
    });
    const s11 = [];
    if (r.sagOk !== 0)  s11.push(`satır içinde bağlantı/sağ ok taşıyan kayıt: ${r.sagOk}`);
    if (r.eskiOk !== 0) s11.push(`eski .sz-go bağlantısı hâlâ var: ${r.eskiOk}`);
    if (r.dogruDetay !== r.toplam) s11.push(`açılan kayıtta doğru detay bağlantısı ${r.dogruDetay}/${r.toplam}`);
    if (r.caret !== r.toplam) s11.push(`expand göstergesi ${r.caret}/${r.toplam}`);
    if (!s11.length) ok(`madde 9: satırda sağ ok 0 · açılan kayıtta detay bağlantısı ${r.dogruDetay}/${r.toplam} · expand göstergesi ${r.caret}/${r.toplam}`);
    else rec('madde 9 (sağ ok / detay bağlantısı)', s11.join('\n      '));
  }

  /* --- 11c · R8 MADDE 7d + 8 — çipler AÇIKTA · arama çip satırında · sticky yok
     R6 madde 10 buraya "kategori ekseni kabuğun açılır Filtrele bileşeni
     OLMALI" diye yazmıştı. R8 madde 7d o kararı geçersiz kıldı: kardeş marka
     (dadagastro.com/mutfak-sozlugu) çipleri açık bir rayda tutuyor, DadaFit
     de oraya döndü. Karar kütüğü: **K62** — "Sözlük gastro iskeletine
     çekildi — sozluk.mjs 11c sözleşmesi TERSİNE döndü" (KARARLAR.md).
     Nöbet yeni sözleşmeyi bekliyor:
       · açılır menü kalıntısı 0
       · çipler `#szCats` içinde açıkta ve tıklanabilir
       · arama kutusu çip rayıyla AYNI satırda (üst kenar farkı 0 px)
       · çip rayının solu boş değil (harf rayıyla aynı sol kenar)
       · sıra: harf → çip+arama → sayaç → liste
       · sticky 0 (R6 madde 10'un bu kısmı duruyor) · harf rayı 29 --- */
  {
    const r = await page.evaluate(() => {
      const R = e => e.getBoundingClientRect().top + scrollY;
      const q = s => document.querySelector(s);
      const ara = q('.sz-controls .sz-find'), harf = q('.sz-controls #szLetters'),
            chips = q('.sz-controls #szCats'), sayac = q('.sz-body .sz-count'),
            liste = q('#szList');
      const sticky = [...document.querySelectorAll('main *')]
        .filter(e => getComputedStyle(e).position === 'sticky')
        .map(e => e.className);
      const ok4 = !!(ara && harf && chips && sayac && liste);
      const cr = chips && chips.getBoundingClientRect();
      const ir = ara && ara.getBoundingClientRect();
      const hr = harf && harf.getBoundingClientRect();
      return {
        sira: ok4 && R(harf) < R(chips) && R(chips) < R(sayac) && R(sayac) < R(liste),
        sticky,
        dropdownKalinti: document.querySelectorAll(
          '#szCatFilter, .sz-controls [data-ff], .sz-controls .ff-bar, .sz-controls .ff-pop').length,
        cipSayisi: document.querySelectorAll('#szCats .df-fchip').length,
        gizliCip: [...document.querySelectorAll('#szCats .df-fchip')]
                    .filter(c => c.getBoundingClientRect().height === 0).length,
        ustFark: (ok4) ? Math.round(Math.abs(cr.top - ir.top) * 10) / 10 : -1,
        solFark: (ok4) ? Math.round((cr.left - hr.left) * 10) / 10 : -1,
        harfSayisi: document.querySelectorAll('#szLetters .sz-ltr:not(.all)').length,
        bosHarf: [...document.querySelectorAll('#szLetters .sz-ltr.is-empty')]
                   .map(b => ({ h: b.textContent.trim(), dis: b.disabled, on: b.classList.contains('on') }))
      };
    });
    const s12 = [];
    if (!r.sira)                 s12.push('blok sırası harf → çip+arama → sayaç → liste değil');
    if (r.sticky.length)         s12.push('süzgeç bloğunda position:sticky: ' + r.sticky.join(', '));
    if (r.dropdownKalinti !== 0) s12.push(`kategori açılır menü kalıntısı: ${r.dropdownKalinti} düğüm`);
    if (r.cipSayisi !== 11)      s12.push(`çip sayısı ${r.cipSayisi} (beklenen 11 = Tümü + 10 kategori)`);
    if (r.gizliCip !== 0)        s12.push(`gizli (yükseklik 0) çip: ${r.gizliCip}`);
    if (r.ustFark !== 0)         s12.push(`arama ile çip rayının üst kenarı ${r.ustFark} px kaçık (beklenen 0)`);
    if (r.solFark !== 0)         s12.push(`çip rayının sol kenarı harf rayından ${r.solFark} px içeride (beklenen 0)`);
    if (r.harfSayisi !== 29)     s12.push(`harf rayı ${r.harfSayisi} harf (beklenen 29)`);
    if (!r.bosHarf.every(b => b.dis)) s12.push('karşılığı olmayan harf disabled değil');
    /* karşılığı olmayan harf "seçili" görünmemeli — R8'de yakalanan kusur */
    if (r.bosHarf.some(b => b.on)) s12.push('karşılığı olmayan harf SEÇİLİ (.on) basılıyor');
    if (!s12.length) ok(`madde 7d+8: sıra harf→çip+arama→sayaç→liste · dropdown kalıntısı 0 · ${r.cipSayisi} çip açıkta · üst kenar farkı 0 · sol kenar farkı 0 · sticky 0 · harf rayı 29, boş harf ${r.bosHarf.map(b=>b.h).join(',')||'-'} disabled ve seçili değil`);
    else rec('R8 madde 7d+8 (yerleşim / çip rayı)', s12.join('\n      '));
  }

  /* --- 11d · R6 MADDE 8 — kullanım talimatı kalktı, kütüphane bağlantısı duruyor --- */
  {
    const r = await page.evaluate(() => ({
      talimat: (document.querySelector('main').textContent || '').indexOf('Satıra dokun') > -1,
      intro: document.querySelectorAll('.sz-intro').length,
      kutuphane: [...document.querySelectorAll('main a[href^="egzersiz-kutuphane-v1.html"]')].length
    }));
    const s13 = [];
    if (r.talimat)      s13.push('"Satıra dokun" metni hâlâ sayfada');
    if (r.intro !== 0)  s13.push(`.sz-intro düğümü ${r.intro}`);
    if (r.kutuphane < 1) s13.push('egzersiz-kutuphane-v1.html bağlantısı sayfa içeriğinde yok');
    if (!s13.length) ok(`madde 8: "Satıra dokun" 0 kez · .sz-intro 0 düğüm · egzersiz-kutuphane bağlantısı ${r.kutuphane}`);
    else rec('madde 8 (kullanım talimatı)', s13.join('\n      '));
  }

  /* --- URL durumu (bonus, kırmızıya döndürmez) --- */
  {
    await page.goto(`${BASE}/${LISTE}?harf=J&kategori=dovus`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const r = await page.evaluate(OKU);
    const bek = await page.evaluate(() =>
      window.SOZLUK.TERIMLER.filter(t => t.harf === 'J' && t.kategori === 'dovus').length);
    if (r.kart === bek) not(`URL durumu çalışıyor: ?harf=J&kategori=dovus → ${r.kart} terim`);
    else not(`URL durumu beklenmedik: ${r.kart} ≠ ${bek} (kabul ölçütü değil)`);
  }

  /* --- 9a · konsol @1440 --- */
  if (!konsol.length) ok('konsol hatası 0 (@1440)');
  else rec('konsol @1440', [...new Set(konsol)].join(' | '));

  /* --- köprü envanteri, sonra kullanılacak --- */
  globalThis.__D = D;
  await ctx.close();
}

const D = globalThis.__D;

/* ---------- 9b · yatay taşma + konsol @390 (iki sayfa) ---------- */
for (const [sayfa, url] of [[LISTE, `${BASE}/${LISTE}`], [DETAY, `${BASE}/${DETAY}?slug=${D.sluglar[0]}`]]) {
  for (const w of [1440, 390]) {
    const { ctx, page, konsol } = await ac(w);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const tasma = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (tasma <= 1) ok(`${sayfa} @${w}: yatay taşma 0`);
    else rec(`yatay taşma ${sayfa} @${w}`, tasma + ' px');
    if (konsol.length) rec(`konsol ${sayfa} @${w}`, [...new Set(konsol)].join(' | '));
    await ctx.close();
  }
}
ok('konsol hatası 0 (@390, iki sayfa)');

/* ---------- 8 · banner aile ölçüleri ---------- */
{
  const sapma = [];
  for (const [sayfa, bek] of Object.entries(BANNER)) {
    const url = sayfa === DETAY ? `${BASE}/${sayfa}?slug=${D.sluglar[0]}` : `${BASE}/${sayfa}`;
    for (const w of [1440, 1024, 390]) {
      const { ctx, page } = await ac(Number(w));
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(650);
      const r = await page.evaluate(() => {
        const e = document.querySelector('.lib-top');
        return { h: e ? Math.round(e.getBoundingClientRect().height) : -1,
                 aile: document.body.getAttribute('data-fit-hero-kind') };
      });
      if (r.h !== bek[w]) sapma.push(`${sayfa} @${w}: ${r.h} (beklenen ${bek[w]})`);
      if (r.aile !== bek.aile) sapma.push(`${sayfa} @${w}: aile "${r.aile}" (beklenen "${bek.aile}")`);
      await ctx.close();
    }
  }
  if (!sapma.length)
    ok('banner ailesi birebir: sozluk-v1 544/607/587 (LİSTE) · sozluk-detay-v1 560/617/726 (DETAY)');
  else rec('banner ailesi', sapma.join('\n      '));
}

/* ---------- 7 · dahili köprüler ---------- */
{
  /* 7a · sözlük içi köprüler — her terimin kendi adresi */
  const kirik = [];
  for (const s of D.sluglar.slice(0, 12)) {
    const r = await fetch(`${BASE}/${DETAY}?slug=${encodeURIComponent(s)}`);
    if (r.status !== 200) kirik.push(`${DETAY}?slug=${s} → ${r.status}`);
  }
  if (!kirik.length) ok(`sözlük içi köprü örneklemi 200 (12 adres; tamamı ölçüt 10'da geziliyor)`);
  else rec('sözlük içi köprü', kirik.join(' · '));

  /* 7b · hareket köprüleri — hem slug geçerli hem HTTP 200 */
  const harBenzersiz = [...new Set(D.hareketKop)];
  const uydurma = harBenzersiz.filter(s => !HAREKET_SLUG.has(s));
  const har404 = [];
  for (const s of harBenzersiz) {
    const r = await fetch(`${BASE}/egzersiz-detay-v1.html?slug=${s}`);
    if (r.status !== 200) har404.push(`${s} → ${r.status}`);
  }
  if (!uydurma.length && !har404.length)
    ok(`hareket köprüsü: ${D.hareketKop.length} terimde ${harBenzersiz.length} farklı slug, hepsi kütüphanede ve HTTP 200`);
  else rec('hareket köprüsü', [...uydurma.map(s => 'uydurma slug: ' + s), ...har404].join(' · '));

  /* 7c · kas köprüleri — H2'nin sayfası bu branch'te YOK, ayrı sayılır */
  const kasBenzersiz = [...new Set(D.kasKop)];
  const kasUydurma = kasBenzersiz.filter(s => !KAS_SLUG.has(s));
  if (kasUydurma.length) rec('kas slug sözlüğü', 'sözlükte olmayan kas slug\'ı: ' + kasUydurma.join(', '));
  else if (ONDISK.has('anatomi-v1.html'))
    ok(`kas köprüsü: ${kasBenzersiz.length} farklı slug, anatomi-v1.html diskte var — birleşme tamam`);
  else
    not(`kas köprüsü: ${D.kasKop.length} terimde ${kasBenzersiz.length} farklı slug, hepsi sabit sözlükten. ` +
        `anatomi-v1.html bu branch'te YOK (H2 oturumuna ait) — birleştirme sonrası doğrulanacak, kırmızı DEĞİL`);

  /* 7d · liste sayfasındaki her <a> diskte var mı (anatomi hariç) */
  const { ctx, page } = await ac(1440);
  await page.goto(`${BASE}/${LISTE}`, { waitUntil: 'load' });
  await page.waitForSelector('#szList .sz-item');
  const hrefler = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
  await ctx.close();
  const kirikDosya = new Set();
  for (const h of hrefler) {
    if (!h || /^(https?:|mailto:|tel:|#|javascript:)/.test(h)) continue;
    const f = h.split('#')[0].split('?')[0];
    if (f.endsWith('.html') && !ONDISK.has(f) && f !== 'anatomi-v1.html') kirikDosya.add(f);
  }
  if (!kirikDosya.size) ok(`liste sayfasındaki ${hrefler.length} bağlantının hedefi diskte (anatomi-v1.html hariç tutuldu)`);
  else rec('kırık iç bağlantı', [...kirikDosya].join(', '));
}

/* ---------- 10 · detay sayfası her slug'da dolu ---------- */
{
  /* --hizli: en az 30 örnek + her kategoriden en az 2. Varsayılan: HEPSİ. */
  let hedef = D.sluglar;
  if (HIZLI) {
    const secim = new Set();
    const kat = {};
    D.kategoriSlug.forEach(x => { (kat[x.kategori] = kat[x.kategori] || []).push(x.slug); });
    Object.values(kat).forEach(l => { secim.add(l[0]); secim.add(l[Math.floor(l.length / 2)]); });
    for (let i = 0; secim.size < 30 && i < D.sluglar.length; i += 7) secim.add(D.sluglar[i]);
    hedef = [...secim];
  }

  const { ctx, page, konsol } = await ac(1440, { hizlandir: true });
  const eksik = [];
  const t0 = Date.now();
  for (const s of hedef) {
    await page.goto(`${BASE}/${DETAY}?slug=${encodeURIComponent(s)}`, { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(() => {
      const T = window.SOZLUK ? window.SOZLUK.bul(new URLSearchParams(location.search).get('slug')) : null;
      const q = sel => (document.querySelector(sel) || {}).textContent || '';
      return {
        veriVar: !!T,
        terim: T ? T.terim : '',
        h1: q('#szH1').trim(),
        crumb: q('#szCrumb').trim(),
        eyebrow: q('#szEyebrow').trim(),
        sub: q('#szSub').trim(),
        tanim: q('#szTanim').trim(),
        ornek: q('#szOrnek').trim(),
        stat: document.querySelectorAll('#szStats .lib-stat').length,
        aile: document.querySelectorAll('.sz-fam a').length,
        kunye: document.querySelectorAll('.sz-kunye .r').length,
        kunyeBos: [...document.querySelectorAll('.sz-kunye .v')].filter(v => !v.textContent.trim()).length,
        /* R8 madde 10 — bu iki bölüm KALKTI, nöbet artık 0 bekliyor */
        aramalar: document.querySelectorAll('.sz-ask, .sz-ask li, .sz-ask-note').length,
        etiket: document.querySelectorAll('.sz-tags, .sz-tags a, .sz-tags .fixed').length,
        /* GÖRÜNEN metin okunuyor: body.textContent <style>/<script> gövdesini de
           içeriyor ve kaldırma gerekçesini anlatan YORUMLARA takılıyordu. */
        araBaslik: ((document.querySelector('main')||{}).innerText || '').indexOf('Sık aranan sorular') > -1 ? 1 : 0,
        etiketBaslik: /(^|\s)Etiketler(\s|$)/.test((document.querySelector('main')||{}).innerText || '') ? 1 : 0,
        prev: !!document.getElementById('szPrev'),
        next: !!document.getElementById('szNext'),
        geri: !!document.querySelector('a[href="sozluk-v1.html"]'),
        baslik: document.title
      };
    });
    const sorun = [];
    if (!r.veriVar)                sorun.push('veri bulunamadı');
    if (r.h1 !== r.terim)          sorun.push(`h1 "${r.h1}" ≠ terim "${r.terim}"`);
    if (r.crumb !== r.terim)       sorun.push('kırıntı son kalemi terimi yazmıyor');
    if (r.eyebrow.length < 3)      sorun.push('eyebrow (kategori) boş');
    if (r.sub.length < 8)          sorun.push('alt metin (İngilizce karşılık) boş');
    if (r.tanim.length < 60)       sorun.push(`tanım kısa (${r.tanim.length} karakter)`);
    if (r.ornek.length < 15)       sorun.push(`örnek kısa (${r.ornek.length} karakter)`);
    if (r.stat < 3)                sorun.push(`banner istatistiği ${r.stat} kalem`);
    if (r.aile < 1)                sorun.push('aile listesi boş');
    if (r.kunye < 4)               sorun.push(`künye ${r.kunye} satır (en az 4 bekleniyor)`);
    if (r.kunyeBos)                sorun.push(`künyede ${r.kunyeBos} boş değer`);
    /* R8 madde 10 — kaldırılan iki bölüm: düğüm de başlık metni de 0 olmalı */
    if (r.aramalar !== 0)          sorun.push(`"sık aranan sorular" düğümü ${r.aramalar} (0 bekleniyor · R8 madde 10)`);
    if (r.araBaslik !== 0)         sorun.push('"Sık aranan sorular" başlığı hâlâ sayfada (R8 madde 10)');
    if (r.etiket !== 0)            sorun.push(`"etiketler" düğümü ${r.etiket} (0 bekleniyor · R8 madde 10)`);
    if (r.etiketBaslik !== 0)      sorun.push('"Etiketler" başlığı hâlâ sayfada (R8 madde 10)');
    if (!r.prev || !r.next)        sorun.push('önceki/sonraki gezinme yok');
    if (!r.geri)                   sorun.push('"tüm sözlüğe dön" yok');
    if (!/Spor Sözlüğü/.test(r.baslik)) sorun.push('sayfa başlığı ayarlanmamış');
    if (sorun.length) eksik.push(`${s}: ${sorun.join(' · ')}`);
  }
  const sn = ((Date.now() - t0) / 1000).toFixed(0);
  if (!eksik.length)
    ok(`detay sayfası ${hedef.length}/${D.sluglar.length} slug'da dolu` +
       (HIZLI ? ' (--hizli örneklem)' : ' (TÜM terimler gezildi)') + ` · ${sn} sn`);
  else rec('boş detay sayfası', eksik.slice(0, 12).join('\n      ') +
       (eksik.length > 12 ? `\n      … ve ${eksik.length - 12} tane daha` : ''));

  /* bilinmeyen slug: 200 + anlamlı düşüş, 404 YOK */
  {
    const r = await fetch(`${BASE}/${DETAY}?slug=olmayan-bir-terim-xyz`);
    await page.goto(`${BASE}/${DETAY}?slug=olmayan-bir-terim-xyz`, { waitUntil: 'domcontentloaded' });
    const d = await page.evaluate(() => ({
      h1: (document.getElementById('szH1') || {}).textContent || '',
      dus: !!document.querySelector('.sz-404'),
      geri: !!document.querySelector('.sz-404 a[href="sozluk-v1.html"]')
    }));
    if (r.status === 200 && d.dus && d.geri && d.h1.length > 3)
      ok('bilinmeyen slug: HTTP 200 + "terim bulunamadı" durumu + sözlüğe dönüş bağlantısı');
    else rec('bilinmeyen slug', JSON.stringify({ status: r.status, ...d }));
  }

  if (konsol.length) rec('detay taramasında konsol hatası', [...new Set(konsol)].slice(0, 5).join(' | '));
  else ok(`detay taramasında konsol hatası 0 (${hedef.length} sayfa yüklemesi)`);

  await ctx.close();
}

await browser.close();

console.log('');
if (notlar.length) { console.log('  NOTLAR (kırmızı değil):'); notlar.forEach(n => console.log('   · ' + n)); console.log(''); }
if (fail) { console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
