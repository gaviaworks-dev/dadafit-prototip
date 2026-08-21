/* =====================================================================
   DADAFIT — YAPIŞIKLIK TARAMASI  (R8 kalem 27)
   ---------------------------------------------------------------------
   NEYİ YAPIŞIK SAYAR
   Sayfa akışında `<section>` OLMAYAN üst düzey blok — yani **çıplak
   `.wrap`**, bölüm ritmi hiç uygulanmayan kart kutusu. Onun DIŞ kenarı ile
   komşu bloğun DIŞ kenarı arasındaki boş piksel:
       ustBosluk = blokUst      − oncekiBlokAlt
       altBosluk = sonrakiUst   − blokAlt
   Biri `--sec-pad-sm` ALTINDAYSA (32 px @1440 · 22 px @390) o kenar YAPIŞIK.

   EŞİK UYDURMA DEĞİL: `assets/css/fit-shell.css` `--sec-pad-sm` — sitenin
   kendi kabul ettiği EN DAR meşru bölüm nefesi. Bir kenar bundan da darsa
   o blok hiç nefes almıyor demektir.

   ---------------------------------------------------------------------
   DÖRT TUZAK — hepsi bu turda YAŞANDI, dördü de aşağıda kapatıldı.
   Aynı taramayı yeniden yazacak olan dördüne de düşer.

   1 · `body.children` TARAMA — 66 sayfanın hepsinde `a.skip-link` sahte
       bulgusu verir. İçerik `main.page-main` altında; tarama oraya çekildi,
       skip-link / sr-only / fixed / sticky dışlandı.

   2 · `.reveal` ANİMASYONU — `.reveal` blokları `.in` sınıfı gelene kadar
       `translateY(22px)` taşır. Animasyon oturmadan ölçüm alınırsa SAHTE
       NEGATİF boşluk çıkar; R8'de bir blok "−14 px binişme" diye
       raporlandı, gerçek değer üst 22 px'ti. Ölçümden önce `.in` elle
       eklenir ve 350 ms beklenir.

   3 · GİZLİ MİKRO DÜĞÜMLER — `p.an-live` gibi 1×1 px `aria-live`
       bölgeleri `height>0` filtresini geçer ve bulgu sayılır. Eşik
       `height>8`.

   4 · SARMALAYICININ DIŞI ≠ İÇİNDEKİ KARTIN KENARI — `#pgWrap` gibi
       kutular nefesi `padding` ile verir; dış kenarları komşuya yapışık
       görünür ama içindeki kart rahat oturur. Bu yüzden sarmalayıcı kendi
       dikey `padding`'ini taşıyorsa yapışık SAYILMAZ.

   ---------------------------------------------------------------------
   KAPSAM NOTU: `main.page-main` taşımayan sayfa sessizce atlanır
   (`if (!m) return []`). Bugün bu yalnız `index.html` — tek `div.px`
   çocuğu olan site haritası, taranacak kart bandı yok. Yani 66 dosyanın
   65'i gerçekten ölçülüyor. Yeni bir sayfa `main.page-main` olmadan
   eklenirse SESSİZCE kapsam dışı kalır; iskelet değişirse burası
   güncellenmeli.

   BİLİNEN SINIR (4. tuzağın seçilmiş çözümü): dikey `padding` taşıyan
   sarmalayıcı yapışık SAYILMAZ, içindeki kartın kenarı ölçülmez. Bu,
   `#pgWrap` gibi nefesini `padding` ile veren kutuları sahte bulgudan
   korur; karşılığında, dolgulu bir sarmalayıcının İÇİNDE sıkışmış bir
   kart yakalanmaz. R8'de böyle bir vaka çıkmadı.

   Kullanım: node tools/yapisiklik-tarama.mjs [base] [genişlikler]
   Örnek:    node tools/yapisiklik-tarama.mjs http://localhost:8811 1440,390
   ===================================================================== */
import { chromium } from '../tests/_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8811';
const GEN  = (process.argv[3] || '1440,390').split(',').map(Number);
const KOK  = new URL('..', import.meta.url);
const SAYFALAR = readdirSync(KOK).filter(f => f.endsWith('.html')).sort();

const b = await chromium.launch();
const bulgu = [];

for (const w of GEN) {
  /* eşik `--sec-pad-sm`'in o genişlikteki computed değeri — sayfadan okunur,
     betiğe gömülmez; token değişirse tarama birlikte hareket eder. */
  const ctx = await b.newContext({ viewport: { width: w, height: w > 900 ? 900 : 844 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/' + SAYFALAR[0], { waitUntil: 'load' }).catch(() => {});
  const esik = await p.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sec-pad-sm')) || 32);

  for (const s of SAYFALAR) {
    await p.goto(BASE + '/' + s, { waitUntil: 'load' }).catch(() => {});
    /* TUZAK 2 · animasyonu oturt */
    await p.evaluate(() => {
      document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
      document.documentElement.classList.remove('reveal-ready');
    });
    await p.waitForTimeout(350);

    const r = await p.evaluate((e) => {
      const m = document.querySelector('main.page-main');   /* TUZAK 1 */
      if (!m) return [];
      const ok = [...m.children].filter(x => {
        const c = getComputedStyle(x);
        return c.display !== 'none' && c.position !== 'fixed' && c.position !== 'sticky'
            && !x.classList.contains('sr-only')
            && x.getBoundingClientRect().height > 8;      /* TUZAK 3 */
      });
      const out = [];
      ok.forEach((x, i) => {
        if (x.tagName === 'SECTION') return;              /* section kendi dolgusuyla nefes alır */
        const c = getComputedStyle(x);
        const kendiDolgu = parseFloat(c.paddingTop) + parseFloat(c.paddingBottom);
        if (kendiDolgu >= e) return;                      /* TUZAK 4 */
        const ic = [...x.children].filter(k => {
          const kc = getComputedStyle(k);
          return kc.display !== 'none' && k.getBoundingClientRect().height > 4;
        });
        const rc = x.getBoundingClientRect();
        const pr = i > 0 ? ok[i - 1].getBoundingClientRect() : null;
        const nx = i < ok.length - 1 ? ok[i + 1].getBoundingClientRect() : null;
        const ust = pr ? Math.round(rc.top - pr.bottom) : 999;
        const alt = nx ? Math.round(nx.top - rc.bottom) : 999;
        if (ust < e || alt < e) {
          /* ETİKET: TAM sınıf zinciri + içindeki ilk kart. Yalnız ilk sınıf
             basılırsa 42 bulgunun 42'si de "div.wrap" der ve hangi bandın
             kastedildiği okunmaz — bu betiğin varlık sebebi tam olarak
             sonraki turun bunu açmadan görebilmesi. */
          const ad = n => n.tagName.toLowerCase()
            + (String(n.className||'').trim() ? '.' + String(n.className).trim().split(/\s+/).join('.') : '')
            + (n.id ? '#' + n.id : '');
          const kart = ic.length ? ' > ' + ad(ic[0]).slice(0, 34) : '';
          out.push(`${ad(x).slice(0, 52)}${kart} üst:${ust} alt:${alt}`);
        }
      });
      return out;
    }, esik);

    r.forEach(x => bulgu.push(`@${w} (eşik ${esik}) ${s} · ${x}`));
  }
  await ctx.close();
}
await b.close();

console.log(`\n# YAPIŞIKLIK TARAMASI — ${BASE}`);
bulgu.forEach(x => console.log('  ' + x));
console.log(`\nBULGU: ${bulgu.length}`);
process.exit(bulgu.length ? 1 : 0);
