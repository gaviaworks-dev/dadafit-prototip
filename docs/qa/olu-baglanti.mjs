/* =====================================================================
   DADAFIT — ÖLÜ BAĞLANTI NÖBETİ                        (kalıcı · R16/2)
   ---------------------------------------------------------------------
   NE ÖLÇER: repo kökündeki HER `*.html` sayfasının bağlantı hedefleri
   diskte gerçekten var mı.

   NEDEN İKİ TARAMA VAR — ve neden biri yetmez:
     A · KAYNAK taraması. Dosyayı satır satır okur, `href="…"` yakalar.
         Tek yol budur ki rapor `sayfa:satır → hedef` diye bassın; DOM'da
         satır numarası yoktur. Ama kabuğun ÇALIŞMA ANINDA ürettiği
         footer/menü/dropdown bağlantılarını göremez — onlar kaynakta yok.
     B · DOM taraması (Playwright). Sayfa açılır, kabuk kurulduktan sonra
         `a[href]`lerin TAMAMI okunur. Kabuk kalemlerini yakalayan tek yol
         budur; karşılığında satır numarası veremez.
   Bir sayfa silindiğinde iki taraf ayrı ayrı kırılır: kaynakta yazılı
   bağlantılar A'da, footer kalemi B'de. Yalnız birini koşmak "temiz"
   yanılsaması üretir — bu nöbet yazılırken tam bu tuzağa düşüldü.

   NE SAYILMAZ:
     · dış adresler (http/https/mailto/tel/javascript)
     · yalnız çıpa (`#…`) — sayfa içi
     · yorum satırındaki tarihsel atıflar (A yalnız gerçek `href=` okur)

   ÇIKTI: kırık hedef sayısı. `exit 1` yetmez, SAYI basar (DENETIM §1).
   Ayrıca ikinci bir sayı daha basar: hedefi VAR ama çıpası (`#…`) o
   sayfada BULUNMAYAN bağlantılar. O uyarıdır, kırık sayılmaz — sekmeler
   çalışma anında doğabilir.

   🔴 SONDANIN KUSURU (yazılırken yakalandı): çıpa yalnız `id=`/`name=`
   arandığında nöbet 250+ YANLIŞ uyarı bastı. Kitin sekme sözleşmesi
   (docs/fit-kit.md §6) hash'i `id`ye değil `[data-fit-tabs]` panelinin
   `data-pane` / `data-tab` niteliğine çözer — `destek-v1.html#cozum` gibi
   aylardır çalışan çıpalar bile "yok" görünüyordu. Dördü de aranıyor.

   Çalıştırma:
     PW_HOME=$HOME/.pw node docs/qa/olu-baglanti.mjs http://127.0.0.1:8099
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SAYFALAR = readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();

/* Dış / sayfa-içi hedef mi — bunlar diskte aranmaz. */
const disHedef = h =>
  !h || h.startsWith('#') || /^(https?:|mailto:|tel:|javascript:|data:)/i.test(h);

/* `program-detay-v1.html?x=1#hafta` → { dosya:'program-detay-v1.html', cipa:'hafta' } */
function coz(href, kaynakDosya){
  const [yolQ, ...cipaP] = href.split('#');
  const cipa = cipaP.join('#') || null;
  const yol  = yolQ.split('?')[0];
  if (!yol) return { dosya: kaynakDosya, cipa };            /* yalnız ?query veya #hash */
  const mutlak = path.resolve(path.dirname(path.join(ROOT, kaynakDosya)), yol);
  return { dosya: path.relative(ROOT, mutlak), cipa, disk: mutlak };
}

/* ---------- A · KAYNAK TARAMASI (satır numaralı) --------------------- */
console.log('=== A · KAYNAK TARAMASI — sayfa:satır → hedef ===');
const kirikA = [];
let toplamA = 0;
for (const sayfa of SAYFALAR) {
  const satirlar = readFileSync(path.join(ROOT, sayfa), 'utf8').split('\n');
  satirlar.forEach((satir, i) => {
    for (const m of satir.matchAll(/\bhref\s*=\s*["']([^"']*)["']/g)) {
      const href = m[1].trim();
      if (disHedef(href)) continue;
      toplamA++;
      const { disk } = coz(href, sayfa);
      if (disk && !existsSync(disk)) kirikA.push(`${sayfa}:${i + 1} → ${href}`);
    }
  });
}
console.log(`  taranan sayfa: ${SAYFALAR.length} · çözülen bağlantı: ${toplamA}`);
console.log(`  KIRIK: ${kirikA.length}`);
kirikA.forEach(x => console.log('    ✗ ' + x));

/* ---------- B · DOM TARAMASI (kabuk kurulduktan sonra) --------------- */
console.log('\n=== B · DOM TARAMASI — kabuk kalemleri dâhil ===');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
/* Çerez bandı kapalı, oturum AÇIK: üyeye özel menü/footer kalemleri de
   basılsın. Kapalı oturumda footer'ın "uye" kalemleri hiç doğmaz ve
   tarama kendi körlüğünü "temiz" diye raporlar. */
await ctx.addInitScript(() => { try {
  localStorage.setItem('dm-cookie-consent', 'accepted');
  localStorage.setItem('dm_user', JSON.stringify({ auth:true, roles:['kullanici'], verified:false, level:0 }));
} catch (e) {} });
const page = await ctx.newPage();

const kirikB = new Set();
const cipaYok = new Set();
const konsol = [];
page.on('console', m => { if (m.type() === 'error') konsol.push(`${m.text()}`); });

let toplamB = 0;
const cipaOnbellek = new Map();   /* dosya → Set(id/name) */

for (const sayfa of SAYFALAR) {
  await page.goto(`${BASE}/${sayfa}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(120);
  const hrefler = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
  for (const href of hrefler) {
    if (disHedef(href)) continue;
    toplamB++;
    const { dosya, cipa, disk } = coz(href, sayfa);
    if (disk && !existsSync(disk)) { kirikB.add(`${sayfa} → ${href}`); continue; }
    if (cipa) {
      if (!cipaOnbellek.has(dosya)) {
        const kaynak = readFileSync(path.join(ROOT, dosya), 'utf8');
        const set = new Set();
        /* Dört yol da çıpadır: `id` · `name` · kitin sekme sözleşmesindeki
           `data-pane` ve `data-tab` (fit-kit §6). */
        for (const nit of ['id', 'name', 'data-pane', 'data-tab']) {
          const re = new RegExp('\\b' + nit + '\\s*=\\s*["\']([^"\']+)["\']', 'g');
          for (const m of kaynak.matchAll(re)) set.add(m[1]);
        }
        cipaOnbellek.set(dosya, set);
      }
      if (!cipaOnbellek.get(dosya).has(cipa)) cipaYok.add(`${sayfa} → ${href}`);
    }
  }
}
await browser.close();

console.log(`  taranan sayfa: ${SAYFALAR.length} · çözülen bağlantı: ${toplamB}`);
console.log(`  KIRIK: ${kirikB.size}`);
[...kirikB].sort().forEach(x => console.log('    ✗ ' + x));
console.log(`  ÇIPASI BULUNAMAYAN (uyarı, kırık değil): ${cipaYok.size}`);
[...cipaYok].sort().forEach(x => console.log('    ⚠ ' + x));

/* ---------- SONUÇ ----------------------------------------------------- */
const kirik = kirikA.length + kirikB.size;
console.log('\n=== SONUÇ ===');
console.log(`  kaynak kırık: ${kirikA.length} · DOM kırık: ${kirikB.size} · TOPLAM: ${kirik}`);
console.log(`  konsol hatası olan sayfa kaydı: ${konsol.length}`);
process.exit(kirik === 0 ? 0 : 1);
