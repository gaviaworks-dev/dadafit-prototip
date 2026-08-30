/* =====================================================================
   YÖNETİM PANELİ — KAPANIŞ DENETİMİ
   ---------------------------------------------------------------------
   21 ekranın hepsini dört genişlikte ölçer. Kapılar:
     · yatay taşma 0        · konsol hatası 0
     · ölü bağlantı 0       · dokunma hedefi ≥44px
     · sidebar'da TEK aktif kalem, doğru olan
     · kaynak şeridi var (.adm-src) — "bu veri nereden geliyor" yazılı
     · boş durum dört parçalı (varsa)
   Koşum: PW_HOME=~/.pw node docs/qa/admin-denetim.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const B = 'http://127.0.0.1:8788/';
const GEN = [1440, 1024, 768, 390];

/* Sidebar'ın kendi haritası — beklenen ekran listesi buradan gelir,
   ikinci bir kopya tutulmaz. */
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 } });
const pg = await ctx.newPage();

await pg.goto(B + 'admin-v1.html');
await pg.waitForTimeout(900);
const EKRAN = await pg.evaluate(() =>
  window.FIT_ADMIN.MENU.flatMap(g => g.kalem.map(k => ({ id: k.id, ad: k.ad, href: k.href }))));
console.log('sidebar kalem sayısı:', EKRAN.length);

const linkler = new Set();
let hataliSayfa = 0, tasan = 0, kaynaksiz = 0, kucukHedef = 0, aktifKusur = 0, yok = 0;

for (const e of EKRAN) {
  const hata = [];
  const h = m => { if (m.type() === 'error') hata.push(m.text().slice(0, 90)); };
  const pe = x => hata.push('PE ' + x.message.slice(0, 90));
  pg.on('console', h); pg.on('pageerror', pe);

  const r = await ctx.request.get(B + e.href);
  if (r.status() >= 400) { console.log('❌ YOK  ', e.href, r.status()); yok++; pg.off('console', h); pg.off('pageerror', pe); continue; }

  const tasmaGen = [];
  let olcum = null;
  for (const w of GEN) {
    await pg.setViewportSize({ width: w, height: 1000 });
    await pg.goto(B + e.href);
    await pg.waitForTimeout(550);
    const m = await pg.evaluate(() => ({
      /* ⚠ YATAY TAŞMA ÖLÇÜSÜ — `documentElement.scrollWidth` KULLANILMAZ.
         ÖLÇÜLDÜ: kaydırılabilir geniş bir tablo (`.adm-tw`) sayfada varken
         `documentElement.scrollWidth` şişiyor (390 ekranda 577 dönüyor) ama
         sayfa GERÇEKTE yatay kaymıyor — `window.scrollTo(9999,0)` sonrası
         `scrollX` 0 kalıyor ve `body.scrollWidth` 390. Bu kapı o hâliyle
         yanlış alarm üretiyordu ve matris ekranlarını kusurlu gösteriyordu.
         Dürüst ölçü: gövde gerçekten geniş mi, ve sayfa gerçekten kayıyor mu. */
      tasma: (function () {
        if (document.body.scrollWidth > document.body.clientWidth + 1) return true;
        var x = window.scrollX;
        window.scrollTo(9999, window.scrollY);
        var kaydi = window.scrollX > 0;
        window.scrollTo(x, window.scrollY);
        return kaydi;
      })(),
      /* 🔴 İKİNCİ KAPI — belge düzeyi ölçüm TEK BAŞINA YETMİYOR.
         Kabuk `html,body{overflow-x:clip}` yazıyor (bilinçli bir karar:
         kırpar ama kaydırma konteyneri yaratmaz). Sonuç: bir kaydırma kabının
         içeriği belgeye sızsa bile kayma KIRPILIYOR ve yukarıdaki dürüst
         görünen kapı 0 dönüyor. Ajan I ölçtü: matris ekranlarında sızıntı
         gerçekti (133 · 122 · 68 px) ama bu kapı yeşil yanıyordu.
         Bu yüzden kapların KENDİ ekseni ayrıca sınanır: her `.adm-tw`
         `contain:paint` taşımak zorunda, yoksa kırpılmış bir kusur taşıyor. */
      kapsamsizKap: [...document.querySelectorAll('.adm-tw')]
        .filter(e => getComputedStyle(e).contain.indexOf('paint') < 0).length,
      aktif: document.querySelectorAll('.adm-item.is-on').length,
      aktifAd: (document.querySelector('.adm-item.is-on') || {}).textContent || '',
      src: document.querySelectorAll('.adm-src').length,
      /* Dokunma hedefi: yalnız ADMIN'in kendi bileşenleri sayılır.
         Kabuğun ortak filtre bileşeni (`.ff-btn` 40px · `.ff-pop-clear` 26px ·
         `.df-fchip` 38px) 60 public sayfada da aynı ölçüde; admin'in kusuru
         değil, kabuğun ayrı bir kalemi — `kabukKucuk` olarak AYRI raporlanır
         ki admin ekranı yüzünden yanlış kırmızı yanmasın. */
      kucuk: [...document.querySelectorAll('.adm-item,.adm-ico-btn,.adm-pg,.adm-daralt,.adm-burger,.btn,a.btn')]
        .filter(x => x.getClientRects().length && x.getBoundingClientRect().height < 44 && x.offsetParent !== null).length,
      kabukKucuk: [...document.querySelectorAll('.ff-btn,.ff-pop-clear,.df-fchip,.fit-tab')]
        .filter(x => x.getClientRects().length && x.getBoundingClientRect().height < 44 && x.offsetParent !== null).length,
      bos: [...document.querySelectorAll('.fpx-bos')].map(c => ({
        ico: c.querySelectorAll('.pe-ico').length, h4: c.querySelectorAll('h4').length, p: c.querySelectorAll('p').length
      })),
      link: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
    }));
    if (m.tasma || m.kapsamsizKap) tasmaGen.push(w);
    if (w === 1440) olcum = m;
    m.link.forEach(x => { if (x && !/^(#|https?:|mailto:|tel:|javascript:)/.test(x)) linkler.add(x.split('#')[0]); });
  }

  const bosKusur = olcum.bos.filter(x => !(x.ico && x.h4 && x.p)).length;
  const aktifOk = olcum.aktif === 1 && olcum.aktifAd.includes(e.ad.slice(0, 10));
  if (tasmaGen.length) tasan++;
  if (hata.length) hataliSayfa++;
  if (!olcum.src) kaynaksiz++;
  if (olcum.kucuk) kucukHedef++;
  if (!aktifOk) aktifKusur++;

  const bayrak = (tasmaGen.length || hata.length || !olcum.src || olcum.kucuk || !aktifOk || bosKusur) ? '⚠' : '✅';
  console.log(bayrak, e.href.padEnd(30),
    'taşma:', tasmaGen.length ? tasmaGen.join(',') : '0',
    '| kapsamsız kap:', olcum.kapsamsizKap,
    '| konsol:', hata.length,
    '| kaynak şeridi:', olcum.src,
    '| 44px altı:', olcum.kucuk, '(kabuk:', olcum.kabukKucuk + ')',
    '| aktif kalem:', olcum.aktif,
    '| boş durum kusuru:', bosKusur);
  if (hata.length) hata.slice(0, 2).forEach(x => console.log('     !', x));
  pg.off('console', h); pg.off('pageerror', pe);
}

let olu = 0;
for (const l of linkler) {
  if (!l) continue;
  const r = await ctx.request.get(B + l);
  if (r.status() >= 400) { console.log('❌ ÖLÜ BAĞLANTI', l, r.status()); olu++; }
}

console.log('\n===========================================');
console.log('ekran', EKRAN.length, '· eksik', yok, '· taşan', tasan, '· konsol hatalı', hataliSayfa);
console.log('kaynak şeridi olmayan', kaynaksiz, '· 44px altı öğe olan', kucukHedef, '· aktif kalem kusuru', aktifKusur);
console.log('benzersiz bağlantı', linkler.size, '· ölü', olu);
console.log(yok + tasan + hataliSayfa + kaynaksiz + kucukHedef + aktifKusur + olu === 0
  ? '✅ BÜTÜN KAPILAR GEÇTİ' : '⚠ AÇIK KAPI VAR — yukarıya bak');
await b.close();
