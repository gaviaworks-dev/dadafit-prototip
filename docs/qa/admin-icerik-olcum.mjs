/* =====================================================================
   ADMIN · ANA İÇERİK — beş ekranın ölçüm kapısı
   ---------------------------------------------------------------------
   Ekranlar: Hareket Kütüphanesi · Programlar · Fit Testleri · Taksonomi ·
   Sayfalar ve SEO. Referans kalıp `admin-challenge-v1.html`; o da listede
   ki kalıp bozulursa aynı sondadan görünsün.

   ÖLÇÜLEN (plan §8 kapısı):
     · satır sayısı            → tablo gerçekten doldu mu
     · yatay taşma             → 1440 · 1024 · 768 · 390'da 0 olmalı
     · konsol hatası           → 0
     · ölü bağlantı            → sayfadaki her href HEAD ile denenir
     · dokunma hedefi          → GÖRÜNÜR her etkileşimli öğe ≥44px
     · boş durum dört parça    → ikon · h4 · p · (eylem)
     · sidebar aktif kalem     → tam 1 tane, doğru olan

   ⚠ SONDA KÖRLÜĞÜ. Bu depoda 0/boş dönen sonda defalarca kör çıktı; bu
   yüzden her ekran için "beklenen en az satır" verilir ve sonda satırı
   bulamazsa AÇIKÇA kırılır, sessizce 0 yazmaz.

   KOŞ: PW_HOME=~/.pw node docs/qa/admin-icerik-olcum.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const B = 'http://127.0.0.1:8788/';
const GENISLIK = [1440, 1024, 768, 390];

/* KABUĞUN KENDİ ÖĞELERİ. `fit-shell.css` · `fit-shell.js` · `fit-admin.css` ·
   `fit-admin.js` bu turda yalnız lead'e açık; buradan çıkan kusur sayfanın
   değil kabuğun kusurudur, ayrı raporlanır ve kapıyı kapatmaz. */
const KABUK_SECICI = ['.adm-top .t-crumb a', '.adm-burger', '.adm-item',
                      '.ff-open', '.ff-sheet-close', '.ff-btn', '.ff-reset', '.fit-tab'];
/* Sidebar bugün var olmayan ekranlara da bağlanıyor (menü 21 kalem, ekranlar
   sırayla doğuyor). Bunlar sayfanın ölü bağlantısı değil, kabuğun kuyruğudur. */
const KABUK_BAGLANTI = /^admin-/;

/* dosya → [data-adm beklenen, tablo gövdesi seçici, en az satır] */
const EKRAN = [
  ['admin-hareketler-v1.html', 'hareketler', '#hkGovde tr[data-slug]',  25],
  ['admin-programlar-v1.html', 'programlar', '#pgGovde tr[data-slug]',   9],
  ['admin-testler-v1.html',    'testler',    '#tsGovde tr[data-slug]',   7],
  ['admin-taksonomi-v1.html',  'taksonomi',  '.tx-govde tr[data-kod]',  33],
  ['admin-sayfalar-v1.html',   'sayfalar',   '#syGovde tr[data-dosya]', 60],
  ['admin-challenge-v1.html',  'challenge',  '#chGovde tr[data-slug]',   3]
];

const b = await chromium.launch();
let kirik = 0;

for (const [dosya, admId, satirSec, enAz] of EKRAN) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const pg = await ctx.newPage();
  const hata = [];
  pg.on('console', (m) => { if (m.type() === 'error') hata.push(m.text()); });
  pg.on('pageerror', (e) => hata.push('pageerror: ' + e.message));

  await pg.goto(B + dosya, { waitUntil: 'networkidle' });

  /* --- yapı --- */
  const y = await pg.evaluate((sec) => {
    const q = (s) => document.querySelectorAll(s);
    const bos = Array.from(q('.fpx-bos')).map((e) => ({
      ikon: !!e.querySelector('.pe-ico i'), h4: !!e.querySelector('h4'),
      p: !!e.querySelector('p'), eylem: !!e.querySelector('a,button'),
      gorunur: e.offsetParent !== null
    }));
    return {
      admAttr: document.body.getAttribute('data-adm'),
      aktif: Array.from(q('.adm-item.is-on')).map((a) => a.textContent.trim()),
      ariaCurrent: q('.adm-item[aria-current="page"]').length,
      kaynak: q('.adm-src').length,
      kaynakTip: Array.from(q('.adm-src')).map((e) => e.className.replace('adm-src ', '')),
      satir: q(sec).length,
      tablo: q('.adm-table').length,
      bos,
      yakinda: (document.body.innerText.match(/yakında/gi) || []).length,
      h1: q('h1').length,
      ustCubuk: q('.adm-top').length
    };
  }, satirSec);

  /* --- taşma + dokunma hedefi, dört genişlikte --- */
  const olcu = [];
  for (const w of GENISLIK) {
    await pg.setViewportSize({ width: w, height: 900 });
    await pg.waitForTimeout(140);
    const r = await pg.evaluate((kabukSec) => {
      const d = document.documentElement;
      const kucuk = [], kabuk = [];
      document.querySelectorAll('a,button,input,select,textarea,[role="tab"]').forEach((e) => {
        /* GÖRÜNMEYEN ÖĞE ÖLÇÜLMEZ. `offsetParent` yetmiyor: kapalı `.ff-pop`
           içindeki arama kutusu `visibility:hidden` ile gizli ama offsetParent'ı
           dolu — ilk koşuda üç sayfada birden yanlış alarm verdi. */
        if (!e.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return;
        if (e.type === 'checkbox' || e.type === 'radio') return;   /* kit: 18px kutu */
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.height >= 44 && r.width >= 44) return;
        const ad = e.tagName + (e.className ? '.' + String(e.className).trim().split(/\s+/)[0] : '') +
                   ' ' + Math.round(r.width) + '×' + Math.round(r.height) +
                   (e.textContent.trim() ? ' “' + e.textContent.trim().slice(0, 18) + '”' : '');
        /* KABUK MU SAYFA MI? Kabuğun (fit-shell / fit-admin) kendi öğeleri
           bu ölçümün kapısını kapatmaz — onlara sayfa yazamıyoruz; ayrı
           listelenir ve lead'e bildirilir. */
        (kabukSec.some((sel) => e.matches(sel)) ? kabuk : kucuk).push(ad);
      });
      return { tasma: d.scrollWidth - d.clientWidth, sw: d.scrollWidth, kucuk, kabuk };
    }, KABUK_SECICI);
    olcu.push([w, r]);
  }
  await pg.setViewportSize({ width: 1440, height: 1000 });

  /* --- ölü bağlantı --- */
  const hrefler = await pg.evaluate(() => Array.from(new Set(
    Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href'))
      .filter((h) => h && !/^(#|https?:|mailto:|tel:)/.test(h)))));
  const olu = [], oluKabuk = [];
  for (const h of hrefler) {
    const u = B + h.split('#')[0];
    const res = await pg.request.get(u).catch(() => null);
    if (!res || res.status() >= 400) {
      (KABUK_BAGLANTI.test(h) ? oluKabuk : olu).push(h + ' → ' + (res ? res.status() : 'HATA'));
    }
  }

  /* --- boş durum: TETİKLENEREK ölçülür ---
     Boş durum tembeldir (yalnız sonuç 0 olunca basılır), bu yüzden sayfa
     açılışında saymak her ekranda 0 verir — ilk koşuda tam bunu yaptı ve
     yanlış alarm çıktı. Arama kutusuna hiçbir satırın taşımadığı bir dizi
     ⚠ SEÇİCİ DAR TUTULUYOR: üst çubukta kabuğun kendi genel araması
     (`#admAra`) da bir `input[type=search]` ve DOM'da önce geliyor — geniş
     seçici onu doldurup listenin aramasına hiç dokunmuyordu (ilk koşuda
     altı ekranda birden yanlış alarm). */
  const aramaKutusu = await pg.$('.adm-card .c-head input[type="search"]');
  let bosOlcum = { blok: 0, tam: 0 };
  if (aramaKutusu) {
    await aramaKutusu.fill('zzzqqqxx-boş-durum-sondası');
    await pg.waitForTimeout(160);
    bosOlcum = await pg.evaluate(() => {
      const g = Array.from(document.querySelectorAll('.fpx-bos'))
        .filter((e) => e.checkVisibility({ visibilityProperty: true, opacityProperty: true }));
      return { blok: g.length,
               tam: g.filter((e) => e.querySelector('.pe-ico i') && e.querySelector('h4') && e.querySelector('p')).length };
    });
    await aramaKutusu.fill('');
    await pg.waitForTimeout(120);
  }

  /* --- rapor --- */
  const bosTam = bosOlcum.tam;
  const satirOk = y.satir >= enAz;
  const tasmaOk = olcu.every(([, r]) => r.tasma <= 0);
  const dokunOk = olcu.every(([, r]) => r.kucuk.length === 0);
  const aktifOk = y.aktif.length === 1 && y.ariaCurrent === 1;
  const bosOk = bosOlcum.blok > 0 && bosOlcum.tam === bosOlcum.blok;
  const gecti = satirOk && tasmaOk && dokunOk && aktifOk && bosOk &&
                hata.length === 0 && olu.length === 0 && y.kaynak === 1 && y.yakinda === 0;
  if (!gecti) kirik++;

  console.log('\n=== ' + dosya + ' === ' + (gecti ? 'GEÇTİ' : '🔴 KIRIK'));
  console.log('  data-adm         : ' + y.admAttr + (y.admAttr === admId ? '' : ' 🔴 beklenen ' + admId));
  console.log('  sidebar aktif    : ' + y.aktif.length + ' → ' + JSON.stringify(y.aktif) +
              ' · aria-current ' + y.ariaCurrent + (aktifOk ? '' : ' 🔴'));
  console.log('  üst çubuk / h1   : ' + y.ustCubuk + ' / ' + y.h1);
  console.log('  kaynak şeridi    : ' + y.kaynak + ' ' + JSON.stringify(y.kaynakTip) + (y.kaynak === 1 ? '' : ' 🔴'));
  console.log('  tablo / satır    : ' + y.tablo + ' / ' + y.satir + ' (en az ' + enAz + ')' + (satirOk ? '' : ' 🔴'));
  console.log('  boş durum        : ' + bosOlcum.blok + ' blok görünür · dört parça tam: ' + bosTam +
              (bosOk ? '' : ' 🔴'));
  console.log('  "yakında"        : ' + y.yakinda + (y.yakinda ? ' 🔴' : ''));
  console.log('  konsol hatası    : ' + hata.length + (hata.length ? ' 🔴 ' + hata.slice(0, 3).join(' | ') : ''));
  console.log('  ölü bağlantı     : ' + olu.length + '/' + hrefler.length + (olu.length ? ' 🔴 ' + olu.join(', ') : ''));
  if (oluKabuk.length) console.log('  ⚠ kabuk menüsü   : ' + oluKabuk.join(', ') + ' (sidebar kalemi, sayfa değil)');
  olcu.forEach(([w, r]) => console.log('  ' + String(w).padStart(4) + 'px · taşma ' +
    (r.tasma > 0 ? '🔴 ' + r.tasma : '0') + ' (sw ' + r.sw + ') · <44px ' +
    (r.kucuk.length ? '🔴 ' + r.kucuk.length + ' → ' + r.kucuk.slice(0, 4).join(', ') : '0') +
    (r.kabuk.length ? ' · ⚠ kabuk ' + r.kabuk.join(', ') : '')));

  await ctx.close();
}

await b.close();
console.log('\n' + (kirik ? '🔴 ' + kirik + ' ekran kırık' : 'altı ekranın altısı geçti'));
process.exit(kirik ? 1 : 0);
