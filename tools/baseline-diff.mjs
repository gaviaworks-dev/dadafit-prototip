/* =====================================================================
   GÖÇ ÖNCESİ / SONRASI GÖRSEL KIYAS — computed style + boundingBox
   ---------------------------------------------------------------------
   NEDEN BU ARAÇ VAR
   Faz 2'de legacy sayfalar ortak kabuğa taşınırken sayfanın kendi <style>
   bloğu KURAL KURAL süzüldü (tools/legacy-migrate.py). "Kaç kural düştü"
   bir defekt göstergesi DEĞİL — kabuk aynı işi başka bir seçiciyle
   yapıyor olabilir (commit 2b92a45'te bu yanlış alarm ölçüldü). Tek
   güvenilir ölçüm, aynı içeriğin göç ÖNCESİ ve SONRASI hâlini aynı
   viewport'ta açıp GERÇEKTEN HESAPLANMIŞ stilini karşılaştırmaktır.

   KURULUM (iki sunucu)
     # şimdiki hâl
     cd <repo> && python3 -m http.server 8811 &
     # göç öncesi hâl
     mkdir -p /tmp/baseline
     for f in sss-v1 iletisim-v1 yasal-v1 bildirimler-v1 hakkimizda-v1; do
       git show 981df3b:$f.html > /tmp/baseline/$f.html
     done
     ln -sfn <repo>/assets /tmp/baseline/assets
     (cd /tmp/baseline && python3 -m http.server 8812 &)

     export PW_HOME=~/.pw
     node tools/baseline-diff.mjs

   NE KIYASLANIR
   Yalnız `main#pageMain` İÇİ. Kabuk farkları (turuncu→yeşil header, farklı
   footer/drawer) bilinçli değişiklik; ölçüme girmez.

   Öğeler döküman sırasına göre `tag|class|metin-öneki` parmak iziyle
   eşleştirilir. Eşleşen her çift için bakılan:
     · KAYIP İÇERİK   — baseline'da olup şimdi olmayan öğe (en ağır bulgu)
     · font-size      — 1px'ten büyük fark
     · font-weight    — herhangi bir fark
     · display        — blok/flex/grid/none değişimi
     · ızgara kolonu  — grid-template-columns'tan çözülen kolon sayısı
     · genişlik oranı — öğe genişliği / main genişliği, %8'den büyük sapma
   Ayrıca sayfa düzeyinde: main içindeki görünür metin karakter sayısı
   (içerik kaybı) ve yatay taşma.

   Marka kaynaklı beklenen farklar (turuncu #E14827 → yeşil #009d4f) renk
   karşılaştırmasına girmez; renk zaten kıyaslanmıyor.
   ===================================================================== */
import { chromium } from './../tests/_pw.mjs';

const NOW  = process.env.NOW_BASE  || 'http://localhost:8811';
const WAS  = process.env.WAS_BASE  || 'http://localhost:8812';
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['sss-v1', 'iletisim-v1', 'yasal-v1', 'bildirimler-v1', 'hakkimizda-v1'];
const WIDTHS = [1440, 768];

/* eşiğin altındaki fark gürültüdür: yazı boyutu tarayıcı yuvarlamasıyla
   0.x px oynayabilir, genişlik oranı kaydırma çubuğu yüzünden birkaç
   promil kayar. Eşikler bu gürültünün üstüne konuldu. */
const FONT_TOL   = 1.0;   /* px */
const RATIO_TOL  = 0.08;  /* main genişliğinin %8'i */
const TEXT_TOL   = 0.10;  /* metin uzunluğunda %10 kayıp */

const HARVEST = () => {
  const main = document.querySelector('main#pageMain');
  if (!main) return null;
  const mw = main.getBoundingClientRect().width || 1;
  const seen = Object.create(null);
  const rows = [];
  const nodes = main.querySelectorAll('*');
  for (const n of nodes) {
    const tag = n.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'br') continue;
    const cs = getComputedStyle(n);
    /* görünmeyeni ölçme — açılır panel/sekme içeriği iki sürümde farklı
       sekmede açık olabilir, bu gerçek bir fark değil */
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = n.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;

    /* PARMAK İZİ — sınıf adı BİLEREK dışarıda.
       İlk sürümde anahtar `tag|class|text` idi ve 79 öğenin 28'i "kayıp"
       çıktı; hepsi yanlış alarmdı: göç `section.below-header.lst-top`
       sınıfını `section.lst-top` yaptığı için parmak izi tutmuyordu, oysa
       öğe ve metni yerinde duruyordu (ölçüm: main metni 1553→1886 kr,
       yani kısalmamış, UZAMIŞ). Sınıf değişimi göçün ta kendisi; onu
       eşleşme anahtarı yapmak aracı işe yaramaz hâle getiriyor.
       Bu yüzden anahtar: metin taşıyan öğede `tag|metin`, metinsiz
       öğede (ikon, ayraç, sarmalayıcı) `tag|class` — metinsizi ayırt
       edecek başka bir şey yok.

       İKİNCİ İNCELİK — metin `textContent` DEĞİL, öğenin KENDİ metin
       düğümleri. `textContent` alt ağacın tamamını toplar; göç marka
       metnini bilerek değiştirdiği için (DadaMutfak→DadaFit) tek bir
       yapraktaki değişiklik bütün ATALARIN parmak izini bozuyor ve
       kayıp gibi görünüyordu. Kendi metnine bakınca yaprak yaprak
       eşleşiyor, sarmalayıcılar da metinsiz kovaya düşüyor. */
    const cls  = (n.className && typeof n.className === 'string')
      ? n.className.trim().split(/\s+/).sort().join('.')
      : '';
    const txt  = Array.prototype.filter.call(n.childNodes, c => c.nodeType === 3)
      .map(c => c.nodeValue).join(' ').replace(/\s+/g, ' ').trim().slice(0, 48);
    const base = txt ? (tag + '|' + txt) : (tag + '|~' + cls);
    const i = (seen[base] = (seen[base] || 0) + 1);
    const key = base + '#' + i;

    let cols = 0;
    if (cs.display.includes('grid')) {
      const t = cs.gridTemplateColumns;
      if (t && t !== 'none') cols = t.trim().split(/\s+/).length;
    }
    rows.push({
      key, tag,
      fs:   parseFloat(cs.fontSize) || 0,
      fw:   String(cs.fontWeight),
      disp: cs.display,
      cols,
      ratio: r.width / mw
    });
  }
  return {
    rows,
    mainWidth: mw,
    textLen: (main.innerText || '').replace(/\s+/g, ' ').trim().length,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
};

const browser = await chromium.launch();
let problems = 0;
const summary = [];

async function grab(base, page, width) {
  /* HER ölçüm için temiz context — HANDOFF §5: aynı context'te ikinci bir
     goto same-document navigasyon olabiliyor ve önceki durumun yumuşak
     kaydırması ölçüme karışıyor. */
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent', 'accepted'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto(`${base}/${page}.html`, { waitUntil: 'load' });
  await p.waitForTimeout(1400);
  const out = await p.evaluate(HARVEST);
  await ctx.close();
  return out;
}

for (const page of PAGES) {
  console.log(`\n════ ${page} ════`);
  for (const width of WIDTHS) {
    const [now, was] = await Promise.all([grab(NOW, page, width), grab(WAS, page, width)]);
    if (!now || !was) {
      console.log(`  ${width}px · ✗ main#pageMain bulunamadı (now=${!!now} was=${!!was})`);
      problems++; continue;
    }

    const nowMap = new Map(now.rows.map(r => [r.key, r]));
    const findings = [];

    /* 1 · kayıp içerik — baseline'da olup şimdi olmayan öğe */
    const missing = was.rows.filter(r => !nowMap.has(r.key));
    /* metinsiz sarmalayıcı/ikonun kaybı düzen değişikliği olabilir ve göç
       zaten sarmalayıcı söküyor (anahtarları '|~' ile işaretli);
       METİN TAŞIYAN kayıp asıl bulgudur */
    const missingWithText = missing.filter(r => !r.key.includes('|~'));
    if (missingWithText.length) {
      findings.push(`metin taşıyan ${missingWithText.length} öğe baseline'da var, şimdi YOK`);
      for (const m of missingWithText.slice(0, 6)) findings.push(`    · ${m.key.slice(0, 110)}`);
    }

    /* 2 · eşleşen çiftlerde stil sapması */
    let dFont = 0, dWeight = 0, dDisp = 0, dCols = 0, dRatio = 0;
    const ex = [];
    for (const w of was.rows) {
      const n = nowMap.get(w.key);
      if (!n) continue;
      if (Math.abs(n.fs - w.fs) > FONT_TOL) {
        dFont++; if (ex.length < 8) ex.push(`font-size ${w.fs}→${n.fs}px · ${w.key.slice(0, 70)}`);
      }
      if (n.fw !== w.fw) {
        dWeight++; if (ex.length < 8) ex.push(`font-weight ${w.fw}→${n.fw} · ${w.key.slice(0, 70)}`);
      }
      if (n.disp !== w.disp) {
        dDisp++; if (ex.length < 8) ex.push(`display ${w.disp}→${n.disp} · ${w.key.slice(0, 70)}`);
      }
      if (n.cols !== w.cols) {
        dCols++; if (ex.length < 8) ex.push(`ızgara kolonu ${w.cols}→${n.cols} · ${w.key.slice(0, 70)}`);
      }
      if (Math.abs(n.ratio - w.ratio) > RATIO_TOL) {
        dRatio++; if (ex.length < 8) ex.push(`genişlik oranı ${w.ratio.toFixed(2)}→${n.ratio.toFixed(2)} · ${w.key.slice(0, 70)}`);
      }
    }
    if (dFont)   findings.push(`yazı boyutu farkı: ${dFont}`);
    if (dWeight) findings.push(`yazı kalınlığı farkı: ${dWeight}`);
    if (dDisp)   findings.push(`display farkı: ${dDisp}`);
    if (dCols)   findings.push(`ızgara kolonu farkı: ${dCols}`);
    if (dRatio)  findings.push(`genişlik oranı farkı: ${dRatio}`);

    /* 3 · metin kaybı */
    const lost = (was.textLen - now.textLen) / (was.textLen || 1);
    if (lost > TEXT_TOL) findings.push(`main metni %${(lost * 100).toFixed(1)} kısaldı (${was.textLen}→${now.textLen})`);

    /* 4 · yatay taşma (yalnız şimdiki hâl için — baseline'ınki bizim sorunumuz değil) */
    if (now.overflowX > 1) findings.push(`yatay taşma ${now.overflowX}px`);

    const matched = was.rows.length - missing.length;
    console.log(`  ${width}px · eşleşen ${matched}/${was.rows.length} öğe · metin ${was.textLen}→${now.textLen} kr`);
    if (findings.length) {
      problems += findings.length;
      for (const f of findings) console.log(`    ✗ ${f}`);
      for (const e of ex) console.log(`      ↳ ${e}`);
      summary.push(`${page} @${width}: ${findings.filter(f => !f.startsWith('    ')).join(' · ')}`);
    } else {
      console.log(`    ✓ göç öncesiyle uyumlu`);
    }
  }
}

await browser.close();
console.log(`\n${problems} sapma`);
if (problems) {
  console.log('\nSAPMALAR:');
  for (const s of summary) console.log('  ✗ ' + s);
  process.exit(1);
}
console.log('✓ Göç edilen sayfaların içerik düzeni göç öncesiyle uyumlu.');
