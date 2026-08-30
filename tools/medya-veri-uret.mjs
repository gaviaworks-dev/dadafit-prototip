/* =====================================================================
   MEDYA KATALOĞU ÜRETECİ  —  assets/js/fit-medya-veri.js
   ---------------------------------------------------------------------
   🔴 KATALOG UYDURULMAZ, SAYILIR. Yönetim panelinin medya kütüphanesi
   deponun GERÇEKTEN kullandığı görselleri gösterir; örnek görsel
   üretilmez. Bu betik 75 HTML + assets/js taranarak her benzersiz görsel
   adresini, hangi sayfalarda kaç kez geçtiğini ve hangi klasöre düştüğünü
   çıkarır.

   KLASÖR = kullanım bağlamı, dosya yolu değil. Uzak görselin (Unsplash)
   klasörü yok; onu kullanan sayfanın modülü klasör sayılır. Bir görsel
   birden çok modülde geçiyorsa EN ÇOK geçtiği modüle düşer ve `paylasik`
   işaretlenir — kütüphanede "bunu değiştirirsen üç yer değişir" bilgisi
   ancak böyle doğru olur.

   Koşum:  node tools/medya-veri-uret.mjs
   ===================================================================== */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const MODUL = [
  [/^egzersiz|^hareket|^anatomi/, 'Hareketler'],
  [/^program/,                    'Programlar'],
  [/^challenge/,                  'Challenge'],
  [/^antrenor/,                   'Antrenörler'],
  [/^fit-test|^sozluk/,           'Testler ve Sözlük'],
  [/^dadafit-hub|^index/,         'Ana sayfa'],
  [/^hakkimizda|^iletisim|^yasal|^saglik|^veri-|^bagli-/, 'Kurumsal'],
  /* ⚠ SIRA ÖNEMLİ: `^pro` yazmak `program*` ve `profil*`i de yutuyordu
     (ölçüldü: Abonelik klasörü 27 görselle şişti, 22'si profil sayfasınındı).
     Kalıplar tam ada bağlandı. */
  [/^pro-v1|^pro-odeme|^paketler|^odemelerim/, 'Abonelik'],
  [/^profil|^hesabim|^rozetlerim|^egzersizlerim|^challengelarim|^mesajlarim|^bildirimler|^destek|^giris|^arama/, 'Profil ve hesap'],
  [/^reklam/,                     'Reklam'],
];
const modulAdi = (dosya) => {
  for (const [re, ad] of MODUL) if (re.test(dosya)) return ad;
  return 'Diğer';
};

const kokDosyalar = readdirSync('.').filter((f) => f.endsWith('.html'));
const jsDosyalar  = readdirSync('assets/js').filter((f) => f.endsWith('.js')).map((f) => 'assets/js/' + f);
const hepsi = [...kokDosyalar, ...jsDosyalar];

/* url -> { sayac, modulSayac } */
const harita = new Map();
const RE = /https:\/\/images\.unsplash\.com\/photo-[A-Za-z0-9-]+/g;

for (const dosya of hepsi) {
  const metin = readFileSync(dosya, 'utf8');
  const mod = modulAdi(dosya.replace(/^assets\/js\//, ''));
  for (const url of metin.match(RE) || []) {
    if (!harita.has(url)) harita.set(url, { sayac: 0, mod: new Map(), sayfa: new Set() });
    const k = harita.get(url);
    k.sayac++;
    k.mod.set(mod, (k.mod.get(mod) || 0) + 1);
    k.sayfa.add(dosya);
  }
}

/* Yerel dosyalar — gerçek yol, gerçek klasör. */
const yerel = [
  ['assets/img/logo-official.png',       'Marka', 'DadaFit logosu'],
  ['assets/img/logo-official-white.png', 'Marka', 'DadaFit logosu (beyaz)'],
  ['assets/img/anatomi/govde-erkek-on.png',   'Hareketler', 'Anatomi · erkek gövde önden'],
  ['assets/img/anatomi/govde-erkek-arka.png', 'Hareketler', 'Anatomi · erkek gövde arkadan'],
  ['assets/img/anatomi/govde-kadin-on.png',   'Hareketler', 'Anatomi · kadın gövde önden'],
  ['assets/img/anatomi/govde-kadin-arka.png', 'Hareketler', 'Anatomi · kadın gövde arkadan'],
];

const kayitlar = [];
for (const [url, k] of harita) {
  const enCok = [...k.mod.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const kod = url.split('photo-')[1];
  kayitlar.push({
    id: kod,
    ad: kod.slice(0, 13) + '.jpg',
    url: url + '?auto=format&fit=crop&w=400&q=60',
    klasor: enCok,
    alt: '',
    olcu: '—',
    kullanim: k.sayac,
    paylasik: k.mod.size > 1,
    sayfa: [...k.sayfa].sort(),
  });
}
kayitlar.sort((a, b) => (a.klasor.localeCompare(b.klasor, 'tr') || b.kullanim - a.kullanim));

for (const [yol, klasor, ad] of yerel) {
  kayitlar.unshift({
    id: yol, ad, url: yol, klasor, alt: ad, olcu: '—',
    kullanim: hepsi.filter((f) => readFileSync(f, 'utf8').includes(yol)).length,
    paylasik: false, sayfa: [],
  });
}

const cikti = `/* =====================================================================
   FIT_MEDYA_VERI — MEDYA KÜTÜPHANESİNİN KATALOĞU
   ---------------------------------------------------------------------
   🔴 BU DOSYA ELLE DÜZENLENMEZ. Üreteci: tools/medya-veri-uret.mjs
   Ölçüm: ${new Date().toISOString().slice(0, 10)} · ${hepsi.length} dosya tarandı

   Katalog UYDURULMADI, SAYILDI: deponun 75 HTML sayfası ve assets/js
   modülleri tarandı, her benzersiz görsel adresi ve kaç yerde geçtiği
   çıkarıldı. \`klasor\` bir dosya yolu değil KULLANIM BAĞLAMIDIR — uzak
   görselin klasörü olmaz; onu en çok kullanan modül klasör sayılır.
   \`paylasik:true\` olan görsel birden çok modülde geçiyor; kütüphanede
   "bunu değiştirirsen başka yer de değişir" uyarısı buradan gelir.

   ÖLÇÜLEN: ${kayitlar.length} görsel · ${kayitlar.filter((k) => k.paylasik).length} tanesi birden çok modülde
   ===================================================================== */
window.FIT_MEDYA_VERI = ${JSON.stringify(kayitlar, null, 1)};
`;
writeFileSync('assets/js/fit-medya-veri.js', cikti);
console.log('yazıldı: assets/js/fit-medya-veri.js ·', kayitlar.length, 'görsel ·',
  [...new Set(kayitlar.map((k) => k.klasor))].length, 'klasör');
