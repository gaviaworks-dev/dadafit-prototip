/* =====================================================================
   assets/js/fit-admin-veri.js ÜRETECİ — depo durumunun mekanik anlık görüntüsü
   ---------------------------------------------------------------------
   NEDEN BU ARAÇ VAR

   Yönetim panelinin ANA İÇERİK ekranları (Hareket Kütüphanesi · Programlar ·
   Fit Testleri · Taksonomi · Sayfalar ve SEO) depoda ZATEN VAR OLAN veriyi
   göstermek zorunda; örnek veri uydurmak `docs/fit-admin-plan.md` §6'ya
   aykırı. Ama o veri bugün sözleşme modüllerinde değil, SAYFALARIN İÇİNDE
   duruyor:

     · 25 hareket   → egzersiz-detay-v1.html  `VERI` (window.ED_VERI)
     · taksonomi    → egzersiz-kutuphane-v1.html süzgeç çipleri + kart nitelikleri
     · 7 fit testi  → fit-testi-detay-v1.html `VERI`
     · 9 program    → program-liste-v1.html kartları + program-detay-v1.html `VERI`
     · 60 sayfa     → dosya adları, <title>, <meta description>, <meta robots>

   Bir admin sayfası bunları tarayıcıda okuyamaz: hepsi ayrı bir HTML
   belgesinin içinde çalışan IIFE'ler, buildless bir prototipte fetch+eval
   ile okumak da `file://` altında çöker.

   İKİ MAKUL YOL VARDI (lead'in sorduğu karar):
     (a) hareket kataloğunu ortak bir veri modülüne TAŞI, iki sayfa da ondan
         okusun → tek kaynak, ama `egzersiz-detay-v1.html`i değiştirmek demek.
     (b) admin tarafında ÖLÇÜLMÜŞ bir özet tut ve bunun bir kopya olduğunu
         kaynak şeridinde dürüstçe söyle → ikinci kopya.

   SEÇİLEN: (b) — ama "elle yazılmış kopya" değil, ÜRETİLMİŞ kopya.
   Gerekçe: (a) doğru yol ama bu turda `egzersiz-detay-v1.html` üzerinde
   başka bir ajanın açık işi var; 400 satırlık bir bloğu oradan çıkarmak iki
   ajanın aynı dosyada çakışması demekti. Kopyanın asıl tehlikesi ise
   "kopya olması" değil, SESSİZCE AYRIŞMASI. Bu üreteç kopyayı elle
   yazılmaktan çıkarıyor, `docs/qa/hareket-katalog-esitlik.mjs` de ayrışmayı
   ölçüyor — yani ayrışma artık sessiz değil.

   KULLANIM
     node tools/admin-veri-uret.mjs          # üretir + rapor basar
     node tools/admin-veri-uret.mjs --kontrol # üretmez, yalnız farkı söyler

   Kaynak sayfalardan biri değiştiğinde bu betik yeniden koşulur.
   ===================================================================== */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (f) => readFileSync(join(KOK, f), 'utf8');
const de = (s) => String(s == null ? '' : s).replace(/&amp;/g, '&');

/* Sayfa içindeki `var X = { … };` bloğunu keser ve değerlendirir.
   Bitiş imi ZORUNLU: naif bir regex ilk `};`e kilitlenip yanlış bloktan
   okuyor (fit-testi-detay-v1.html:876 bu tuzağı bir kez yaşamış). */
function blok(dosya, bas, son) {
  const s = oku(dosya);
  const i = s.indexOf(bas);
  const j = s.indexOf(son, i);
  if (i < 0 || j < 0) throw new Error(dosya + ': blok bulunamadı → ' + bas);
  const b = s.slice(i, j);
  const k = b.lastIndexOf('};');
  return eval('(' + b.slice(0, k + 1).replace(/^var [A-Z_]+ = /, '') + ')');
}

/* ---------------------------------------------------------------------
   1 · TAKSONOMİ SÖZLÜĞÜ — egzersiz kütüphanesinin süzgeç şeridi
   Kanon burasıdır: kullanıcının seçebildiği terim kümesi. Kaç harekette
   kullanıldığı aşağıda kartlardan sayılır.
   --------------------------------------------------------------------- */
const KUTUP = oku('egzersiz-kutuphane-v1.html');

/* Bir sayfanın `.fgroup[data-group=…]` çip şeridini terim listesine çevirir.
   İLAN EDİLEN sözlük budur — kullanıcının seçebildiği terim kümesi. */
function cipler(metin, grup) {
  const i = metin.indexOf('data-group="' + grup + '"');
  if (i < 0) return [];
  const j = metin.indexOf('</div>', i);
  const out = [];
  metin.slice(i, j).replace(
    /data-val="([^"]*)"[^>]*>(?:<i class="([^"]*)"><\/i>)?\s*([^<]*)</g,
    (m, kod, ikon, ad) => {
      if (kod !== 'all') out.push({ kod, ad: de(ad.trim()), ikon: ikon || '' });
      return m;
    });
  return out;
}
const sozluk = (grup) => cipler(KUTUP, grup);

const SOZLUK = { kas: sozluk('kas'), ekipman: sozluk('ekipman'),
                 seviye: sozluk('seviye'), sure: sozluk('sure') };

/* kütüphane kartları — slug ve taksonomi KODLARI buradan */
const KART = {};
KUTUP.replace(/<div class="ex-card"([^>]*)>([\s\S]*?)data-slug="([a-z0-9-]+)"/g,
  (m, a, _mid, slug) => {
    const at = (n) => (a.match(new RegExp('data-' + n + '="([^"]*)"')) || [])[1] || '';
    KART[slug] = { ad: de(at('name')), kas: at('kas'), ekipmanKod: at('ekipman'),
                   lv: Number(at('seviye')), sureBant: at('sure').split(' ').filter(Boolean),
                   pop: Number(at('pop')) };
    return m;
  });

/* ---------------------------------------------------------------------
   2 · HAREKET KATALOĞU — detay tablosu + kütüphane kartı, slug üstünde JOIN
   Kütüphane kanoniktir (K43): `ad` iki kaynakta birebir aynı olmalı.
   --------------------------------------------------------------------- */
const ED = blok('egzersiz-detay-v1.html', 'var VERI = {', 'window.ED_VERI = VERI;');
const HAREKET = Object.keys(ED).sort().map((slug) => {
  const e = ED[slug], k = KART[slug] || {};
  return {
    slug, ad: de(e.ad), kategori: de(e.kategori), bolge: de(e.bolge),
    seviye: de(e.seviye), ekipman: de(e.ekipman), sure: de(e.sure),
    kas: k.kas || '', ekipmanKod: k.ekipmanKod || '', lv: k.lv || 0,
    sureBant: k.sureBant || [], pop: k.pop || 0,
    birincil: e.birincil.map(de), ikincil: e.ikincil.map(de),
    alternatif: e.benzer.slice()
  };
});

/* ---------------------------------------------------------------------
   3 · FİT TESTLERİ — tanım + ölçüt bantları
   --------------------------------------------------------------------- */
const TV = blok('fit-testi-detay-v1.html', 'var VERI = {', 'var RAIL_ICON');
const TEST = Object.keys(TV).map((slug) => {
  const t = TV[slug];
  return { slug, ad: de(t.ad), kategori: de(t.kategori), sure: de(t.sure),
           sureKisa: de(t.sureKisa), soru: de(t.olcumSoru),
           ekipmanSay: t.ekipman.length, adimSay: t.adimlar.length,
           uygunSay: t.uygun.length, uygunDegilSay: t.uygunDegil.length,
           bant: t.olcum.map((o) => ({ olcut: de(o.t), lv: o.lv, prog: o.prog })) };
});

/* ---------------------------------------------------------------------
   4 · PROGRAMLAR — katalog kartı (9) + detay sayfasının tanıdığı slug (4)
   --------------------------------------------------------------------- */
const PL = oku('program-liste-v1.html');
const PROGRAM = [];
PL.replace(/<div class="pr-card"([^>]*)>([\s\S]*?)\n      <\/div>\n/g, (m, a, g) => {
  const at = (n) => (a.match(new RegExp('data-' + n + '="([^"]*)"')) || [])[1] || '';
  const bul = (re) => { const x = g.match(re); return x ? de(x[1].trim()) : ''; };
  PROGRAM.push({
    ad: de(at('name')),
    slug: bul(/class="kyt-link" href="program-detay-v1\.html\?slug=([a-z0-9-]+)"/),
    hedef: bul(/<span class="pr-goal">([^<]*)</),
    hedefKod: at('hedef'),
    hafta: Number(at('sure')),
    lv: Number(at('seviye')),
    seviye: bul(/<span class="pr-level lv\d"><span class="pr-pips">(?:<i><\/i>)+<\/span>([^<]*)</),
    ekipmanKod: at('ekipman'),
    plan: bul(/<div class="pr-plan"><i[^>]*><\/i>([^<]*)</),
    ozet: bul(/<div class="pr-body">\s*<h3>[\s\S]*?<\/h3>\s*<p>([^<]*)</),
    pro: /class="pr-pro"/.test(g),
    pop: Number(at('pop'))
  });
  return m;
});
const PD = blok('program-detay-v1.html', 'var VERI = {', 'var slug = new URLSearchParams');
const PROGRAM_DETAY = Object.keys(PD).map((s) => ({ slug: s, ad: de(PD[s].ad), tur: de(PD[s].tur) }));

/* ---------------------------------------------------------------------
   4b · HEDEF SÖZLÜĞÜ — İKİ SAYFA, İKİ AYRI İLAN
   `program-liste-v1.html` ile `programlar-merkezi-v1.html` aynı ada
   ("Hedef") sahip iki farklı terim kümesi ilan ediyor. Taksonomi ekranının
   göstermesi gereken şey tam olarak budur; bu yüzden kaynağıyla birlikte
   toplanır, birleştirilmez.
   --------------------------------------------------------------------- */
const MERKEZ = oku('programlar-merkezi-v1.html');
function sayHedef(metin, kod) {
  return (metin.match(new RegExp('data-hedef="' + kod + '"', 'g')) || []).length;
}
const HEDEF = [];
[['program-liste-v1.html', PL], ['programlar-merkezi-v1.html', MERKEZ]].forEach(([dosya, metin]) => {
  cipler(metin, 'hedef').forEach((t) => {
    HEDEF.push({ kod: t.kod, ad: t.ad, ikon: t.ikon, kaynak: dosya, kullanim: sayHedef(metin, t.kod) });
  });
});

/* ---------------------------------------------------------------------
   5 · SAYFA ENVANTERİ — public yüzey
   Kapsam TANIMI: `admin-` ön ekli olmayan her `*.html`. Panelin kendi
   ekranları sayılmaz; yoksa panel büyüdükçe sayı kayardı.
   --------------------------------------------------------------------- */
const SAYFA = readdirSync(KOK)
  .filter((f) => /\.html$/.test(f) && !/^admin-/.test(f)).sort()
  .map((f) => {
    const s = oku(f).slice(0, 6000);
    const al = (re) => { const x = s.match(re); return x ? de(x[1].trim()) : ''; };
    return {
      dosya: f,
      baslik: al(/<title>([\s\S]*?)<\/title>/),
      aciklama: al(/<meta name="description" content="([^"]*)"/i),
      robots: al(/<meta name="robots" content="([^"]*)"/i),
      canonical: /<link rel="canonical"/i.test(s)
    };
  });

/* --------------------------------------------------------------------- */
/* Yerel tarih — toISOString() UTC'ye kayar ve gece yarısından sonra bir
   önceki günü damgalar (ilk üretimde 30 Ağustos, 29 damgalandı). */
const _d = new Date();
const TARIH = _d.getFullYear() + '-' + String(_d.getMonth() + 1).padStart(2, '0') +
              '-' + String(_d.getDate()).padStart(2, '0');
const j = (x) => JSON.stringify(x);
const dizi = (ad, arr) => '  var ' + ad + ' = [\n' +
  arr.map((r) => '    ' + j(r)).join(',\n') + '\n  ];\n';

const cikti =
`/* =====================================================================
   FIT_ADMIN_VERI — YÖNETİM PANELİNİN OKUDUĞU ÖLÇÜLMÜŞ ANLIK GÖRÜNTÜ
   ---------------------------------------------------------------------
   🔴 BU DOSYA ELLE DÜZENLENMEZ. Üreteci: tools/admin-veri-uret.mjs
   Ölçüm tarihi: ${TARIH}

   NE OLDUĞU — ve ne OLMADIĞI
   Buradaki her satır depodan MEKANİK OLARAK okundu; hiçbiri uydurulmadı.
   Ama bu tablolar verinin KAYNAĞI DEĞİL, KOPYASIDIR. Kaynak hâlâ sayfaların
   içinde:

     HAREKET  ← egzersiz-detay-v1.html  (VERI)  + egzersiz-kutuphane-v1.html (kart)
     SOZLUK   ← egzersiz-kutuphane-v1.html süzgeç şeridi
     TEST     ← fit-testi-detay-v1.html (VERI)
     PROGRAM  ← program-liste-v1.html kartları
     PROGRAM_DETAY ← program-detay-v1.html (VERI)
     HEDEF    ← program-liste + programlar-merkezi hedef çipleri (iki ayrı ilan)
     SAYFA    ← depodaki *.html dosyalarının <title> ve <meta> etiketleri

   Kopyanın tehlikesi sessizce ayrışmaktır; bu yüzden
   \`docs/qa/hareket-katalog-esitlik.mjs\` tarayıcıda \`window.ED_VERI\` ile bu
   tabloyu karşılaştırır. Ayrışırlarsa ölçüm kırmızıya döner.

   Panel gerçek yazmayı getirdiğinde bu dosya silinir ve iki taraf da tek
   sözleşme modülünden okur. Kararın tam gerekçesi üreteç başlığındadır.
   ===================================================================== */
window.FIT_ADMIN_VERI = (function () {
  'use strict';

${dizi('HAREKET', HAREKET)}
  /* Taksonomi sözlüğü — kütüphane süzgecinde İLAN EDİLEN terimler.
     Kaç harekette kullanıldığı ilan edilmez, sayılır (admin-taksonomi). */
  var SOZLUK = {
    kas:     [\n${SOZLUK.kas.map((r) => '      ' + j(r)).join(',\n')}\n    ],
    ekipman: [\n${SOZLUK.ekipman.map((r) => '      ' + j(r)).join(',\n')}\n    ],
    seviye:  [\n${SOZLUK.seviye.map((r) => '      ' + j(r)).join(',\n')}\n    ],
    sure:    [\n${SOZLUK.sure.map((r) => '      ' + j(r)).join(',\n')}\n    ]
  };

${dizi('TEST', TEST)}
${dizi('PROGRAM', PROGRAM)}
${dizi('PROGRAM_DETAY', PROGRAM_DETAY)}
${dizi('HEDEF', HEDEF)}
${dizi('SAYFA', SAYFA)}
  return {
    OLCUM_TARIHI: '${TARIH}',
    HAREKET: HAREKET, SOZLUK: SOZLUK, TEST: TEST,
    PROGRAM: PROGRAM, PROGRAM_DETAY: PROGRAM_DETAY, HEDEF: HEDEF, SAYFA: SAYFA,
    /* slug → hareket; alternatif bağlantıları çözmek için */
    hareket: function (slug) {
      for (var i = 0; i < HAREKET.length; i++) if (HAREKET[i].slug === slug) return HAREKET[i];
      return null;
    },
    /* slug → program detayı; katalog kartının açtığı sayfa gerçekten o mu */
    programDetay: function (slug) {
      for (var i = 0; i < PROGRAM_DETAY.length; i++) if (PROGRAM_DETAY[i].slug === slug) return PROGRAM_DETAY[i];
      return null;
    }
  };
})();
`;

const CIKTI_YOLU = 'assets/js/fit-admin-veri.js';
const kontrol = process.argv.includes('--kontrol');
let onceki = '';
try { onceki = oku(CIKTI_YOLU); } catch { /* ilk üretim */ }

/* Ölçüm raporu — sayı vermeyen üreteç işe yaramaz. */
const kullanilanKas = new Set(HAREKET.map((h) => h.kas));
const kullanilanEki = new Set(HAREKET.map((h) => h.ekipmanKod));
const slugSet = new Set(HAREKET.map((h) => h.slug));
const oluAlt = [];
HAREKET.forEach((h) => h.alternatif.forEach((a) => { if (!slugSet.has(a)) oluAlt.push(h.slug + ' → ' + a); }));
const adAyrik = HAREKET.filter((h) => KART[h.slug] && KART[h.slug].ad !== h.ad).map((h) => h.slug);
const progAyrik = PROGRAM.filter((p) => { const d = PD[p.slug]; return !d || de(d.ad) !== p.ad; });

console.log('hareket            : ' + HAREKET.length);
console.log('  ölü alternatif   : ' + oluAlt.length + (oluAlt.length ? ' → ' + oluAlt.join(', ') : ''));
console.log('  ad ayrışması     : ' + adAyrik.length + (adAyrik.length ? ' → ' + adAyrik.join(', ') : ''));
console.log('sözlük kas         : ' + SOZLUK.kas.length + ' ilan · ' + kullanilanKas.size + ' kullanılıyor');
console.log('sözlük ekipman     : ' + SOZLUK.ekipman.length + ' ilan · ' + kullanilanEki.size + ' kullanılıyor');
console.log('sözlük seviye      : ' + SOZLUK.seviye.length + ' · süre bandı: ' + SOZLUK.sure.length);
console.log('test               : ' + TEST.length + ' · ölçüt bandı: ' + TEST.reduce((a, t) => a + t.bant.length, 0));
console.log('program kartı      : ' + PROGRAM.length + ' · detay slug: ' + PROGRAM_DETAY.length);
console.log('  kart↔detay ayrık : ' + progAyrik.length);
console.log('hedef terimi       : ' + HEDEF.length + ' ilan · benzersiz kod: ' +
            new Set(HEDEF.map((h) => h.kod)).size);
console.log('sayfa (public)     : ' + SAYFA.length);
console.log('  açıklaması yok   : ' + SAYFA.filter((s) => !s.aciklama).length);
console.log('  canonical var    : ' + SAYFA.filter((s) => s.canonical).length);
console.log('  indekslenebilir  : ' + SAYFA.filter((s) => !/noindex/.test(s.robots)).length);

if (kontrol) {
  const ayni = onceki.replace(/Ölçüm tarihi: \d{4}-\d{2}-\d{2}/, '') ===
               cikti.replace(/Ölçüm tarihi: \d{4}-\d{2}-\d{2}/, '');
  console.log('\n' + (ayni ? 'AYNI — modül depo durumuyla uyumlu.'
                           : 'AYRIŞMA — modül eski. `node tools/admin-veri-uret.mjs` koş.'));
  process.exit(ayni ? 0 : 1);
}

writeFileSync(join(KOK, CIKTI_YOLU), cikti, 'utf8');
console.log('\nyazıldı → ' + CIKTI_YOLU + ' (' + cikti.length + ' bayt)');
