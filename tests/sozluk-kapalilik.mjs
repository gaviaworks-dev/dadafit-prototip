/* =====================================================================
   DADAFIT — SPOR SÖZLÜĞÜ KAPALILIK SINAMASI            (S1 · 6. oturum)
   ---------------------------------------------------------------------
   NEYİ KANITLAR

   Sözlük KENDİ İÇİNDE KAPALI olmalı: bir tanımın ya da örneğin içinde
   kullanılan spor terimi, sözlükte kendi kaydını da bulmalı. Aksi hâlde
   okuyucu "ölü kaldırış" ifadesini altı ayrı kayıtta görür ama onun ne
   olduğunu hiçbir yerde okuyamaz. Bu sınama o boşluğu KALICI bir kural
   hâline getirir.

     1. KAPALILIK — aşağıdaki KONTROL listesindeki her ifade sözlükte
        tanımlı. Liste betiğe gömülü ve okunabilir; elenen adaylar da
        ELENEN tablosunda gerekçesiyle duruyor ki sonraki oturum neyin
        BİLEREK dışarıda bırakıldığını görsün.
     2. "ölü kaldırış" ve "burpee" AYRICA ve tek tek aranıyor — bu ikisi
        6. oturumun tetikleyici bulgusu (Beyar'ın tespiti).
     3. Her `hareket` alanı egzersiz kütüphanesindeki 12 GERÇEK slug'dan
        biri; uydurma 0.
     4. Her `kas` alanı 27 kanonik slug'dan biri; uydurma 0.
     5. Hareket kataloğuyla ÇAKIŞAN terimlerin tanımı KISA ve `hareket`
        köprüsü taşıyor (Beyar kuralı: çakışan yerde tanım kısa kalsın,
        "nasıl yapılır" anlatımını kütüphaneye bıraksın).
     6. `kasAdlari` tablosu `anatomi-veri.js`'in panel başlıklarıyla
        27/27 birebir — K40 nöbetçisi.
     7. Mevcut kabul ölçütleri bozulmadı: her kategori ≥8 · karşılıksız
        harf 0 · sayaç = DOM · arama 3 harf eşiği.

   VERİ NEREDEN OKUNUYOR: iki JS dosyası da diskten değil BASE üzerinden
   HTTP ile çekiliyor. Böyle olmasının sebebi K27: sınamayı taban commit'in
   sunucusuna karşı koşturunca gerçekten o sürümün verisi ölçülsün, bu
   çalışma kopyasınınki değil.

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/sozluk-kapalilik.mjs http://localhost:8831
     # K27 — taban commit'e karşı KIRMIZI olmalı:
     node tests/sozluk-kapalilik.mjs http://localhost:8834
   ===================================================================== */
import { chromium } from './_pw.mjs';
import vm from 'node:vm';

/* =====================================================================
 ⚠ R15'TE ATLANDI — Beyar kararı, 2026-08-29:
   "Kırmızı testleri devre dışı bırak — silme, sadece atlanacak duruma
    getir. Bir daha test güncellemesiyle uğraşma. Bir şey kırılırsa
    tarayıcıda ölç ve kanıtla, yeterli."
 ---------------------------------------------------------------------
 İDDİALAR SİLİNMEDİ, dosya olduğu gibi duruyor — yalnız koşmuyor.
 Kırmızı olma sebebi (ölçüldü, 2026-08-29):
   eski kararı kodluyor: 1 sorun
 Yeniden açmak için:  FIT_TESTI_ZORLA=1 node tests/sozluk-kapalilik.mjs
 ===================================================================== */
if (!process.env.FIT_TESTI_ZORLA) {
  console.log('ATLANDI (R15) — eski kararı kodluyor: 1 sorun');
  process.exit(0);
}


const BASE = (process.argv.slice(2).find(a => /^https?:/.test(a)) || 'http://localhost:8831').replace(/\/$/, '');
const LISTE = 'sozluk-v1.html';

/* ---------------------------------------------------------------------
   KONTROL — SÖZLÜKTE KAYDI OLMASI GEREKEN İFADELER
   ---------------------------------------------------------------------
   Liste ölçümle çıktı: `tanim` + `ornek` + `karistirilanlar.not` metinleri
   tarandı, içlerinde geçen spor ifadeleri sayıldı, her biri için "kendi
   kaydı var mı" sorusu soruldu. `gecis` sütunu 6. oturumda ölçülen ham
   sayıdır — metin değişince değişebilir, o yüzden sınama sayıyı DEĞİL
   kaydın varlığını zorunlu tutar; sayı yalnız listenin neden burada
   olduğunu gösteren kanıttır.

   `min` alanı: ifadenin metinlerde en az kaç kez geçmesi beklendiği.
   0 yazan kalemler metinde geçmiyor ama alanın temel kalemi oldukları
   için sözlükte bulunmaları gerekiyor (Beyar'ın editoryal boşluk tespiti).
   ------------------------------------------------------------------- */
const KONTROL = [
  /* --- hareket adları: metinlerde geçiyordu, kaydı yoktu --- */
  { ifade:'ölü kaldırış',  gecis:6,  min:1, not:'6 kayıtta geçiyordu, tanımı yoktu — 6. oturumun tetikleyicisi' },
  { ifade:'çömelme',       gecis:13, min:1, not:'13 ayrı kayıtta geçiyordu; yalnız "çömelme kalıbı" tanımlıydı' },
  { ifade:'barfiks',       gecis:5,  min:1, not:'yalnız "barfiks barı" (ekipman) tanımlıydı, hareketin kendisi değil' },
  { ifade:'hamle',         gecis:4,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'köprü',         gecis:4,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'plank',         gecis:3,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'omuz press',    gecis:3,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'yana açma',     gecis:3,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'biceps curl',   gecis:3,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'kürek çekme',   gecis:2,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'dead bug',      gecis:2,  min:1, not:'kütüphanede kartı var, sözlükte kaydı yoktu' },
  { ifade:'bench press',   gecis:2,  min:1, not:'iki kayıtta geçiyordu; "sehpa" ekipmanı tanımlıydı, hareket değil' },
  { ifade:'kettlebell swing', gecis:1, min:1, not:'kütüphanede kartı var; "kettlebell" ekipmanı tanımlıydı, hareket değil' },

  /* --- kavramlar: metinlerde çok geçiyordu, kaydı yoktu --- */
  { ifade:'kuvvet',        gecis:31, min:5, not:'24 kayıtta geçiyordu; "dayanıklılık" tanımlıyken kuvvet tanımsızdı' },
  { ifade:'güç',           gecis:26, min:5, not:'kuvvetle en sık karıştırılan kavram, ikisi de tanımsızdı' },
  { ifade:'omurga',        gecis:10, min:3, not:'10 geçiş; "nötr omurga" tanımlıydı ama omurganın kendisi değil' },
  { ifade:'kürek kemiği',  gecis:7,  min:2, not:'5 kayıtta geçiyordu, anatomi ailesinde karşılığı yoktu' },
  { ifade:'bağ dokusu',    gecis:7,  min:2, not:'burkulma/zorlanma/fasya anlatımlarının dayandığı doku tanımsızdı' },
  { ifade:'karma dövüş sanatları', gecis:3, min:1, not:'dövüş ailesinin çatı sporu (MMA) tanımsızdı — kayıt adı "Karma dövüş sanatları"' },

  /* --- metinde GEÇMİYOR, alanın temel kalemi olduğu için zorunlu --- */
  { ifade:'burpee',        gecis:0,  min:0, not:'WOD·AMRAP·EMOM·Metcon varken CrossFit\'in en temel kalemi eksikti' },
  { ifade:'mekik',         gecis:0,  min:0, not:'Türkçe spor dilinin en bilinen karın hareketi eksikti' },
  { ifade:'aktivasyon',    gecis:0,  min:0, not:'ısınma ailesinin eksik halkası; kütüphanedeki Köprü kartı bunu "aktivasyon" diye etiketliyor' }
];

/* ---------------------------------------------------------------------
   ELENEN ADAYLAR — bilerek dışarıda. Sınama bunları ZORUNLU TUTMAZ.
   Buradalar ki sonraki oturum "bu da eksik" diye yeniden tartışmasın.
   ------------------------------------------------------------------- */
const ELENEN = [
  { ifade:'eklem',        gecis:29, neden:'genel Türkçe; okuyucu "eklem" için sözlüğe bakmaz. "Eklem stabilitesi" ve "Eklem sesi" zaten tanımlı.' },
  { ifade:'germe',        gecis:10, neden:'çatı sözcük; dinamik germe · statik germe · PNF germe üçü de ayrı ayrı tanımlı, her biri "germe"nin ne olduğunu söylüyor.' },
  { ifade:'lif',          gecis:10, neden:'"Kas lifi tipleri" kaydı karşılıyor.' },
  { ifade:'sprint',       gecis:8,  neden:'"Sürat çalışması" (Sprint training) kaydı karşılıyor.' },
  { ifade:'bağ doku',     gecis:7,  neden:'"Bağ dokusu" olarak eklendi; bu yazım biçimi ayrı kayıt değil.' },
  { ifade:'nabız',        gecis:6,  neden:'dinlenme nabzı · hedef nabız aralığı · maksimum kalp atım hızı üçlüsü kavramı karşılıyor.' },
  { ifade:'sıçra',        gecis:6,  neden:'fiil, terim değil.' },
  { ifade:'bisiklet',     gecis:5,  neden:'genel bilinen etkinlik adı; sözlük terimi değil.' },
  { ifade:'boks',         gecis:4,  neden:'sporun kendi adı, herkesin bildiği; sözlük o sporun TERİMLERİNİ tanımlar (jab · kroşe · ring).' },
  { ifade:'kemik',        gecis:4,  neden:'genel anatomi sözcüğü; "kürek kemiği" gibi belirli kemikler ayrı kayıt.' },
  { ifade:'sinir sistemi',gecis:4,  neden:'"Nöral uyum" kaydı antrenman bağlamını karşılıyor.' },
  { ifade:'güreş',        gecis:3,  neden:'sporun kendi adı; teknikleri (takedown · çift dalma) tanımlı.' },
  { ifade:'judo',         gecis:3,  neden:'sporun kendi adı; teknikleri (kimura · tatami) tanımlı.' },
  { ifade:'yüzme',        gecis:3,  neden:'genel bilinen etkinlik adı.' },
  { ifade:'atlama',       gecis:3,  neden:'fiil kökü; "atlama ipi" ekipman olarak tanımlı.' },
  { ifade:'goblet',       gecis:2,  neden:'goblet squat ayrı bir hareket ve kendi kartı var; "Çömelme" kaydı ekipmansız hava-squat kartına bağlanıyor. Goblet için ayrı sözlük kaydı gerekmiyor.' },
  { ifade:'stabilite',    gecis:2,  neden:'"Eklem stabilitesi" kaydı karşılıyor.' },
  { ifade:'sakatlık',     gecis:2,  neden:'genel Türkçe; akut yaralanma · aşırı kullanım yaralanması ayrı ayrı tanımlı.' },
  { ifade:'merdiven',     gecis:2,  neden:'günlük yaşam örneği, terim değil.' },
  { ifade:'bant çekme',   gecis:0,  neden:'kütüphanede kartı var ama sözlük metinlerinde HİÇ geçmiyor — kapalılık için gerekmiyor. Geçmeye başlarsa KONTROL listesine alınmalı.' },
  { ifade:'tendon',       gecis:0,  neden:'metinlerde hiç geçmiyor; "tendinopati" ayrı kelime. "Bağ dokusu" kaydı kavramı kapsıyor.' }
];

/* egzersiz kütüphanesindeki 25 GERÇEK hareket slug'ı
   (7. oturum: katalog 12 → 25; goblet-squat artık dambıllı, ekipmansız
   squat'ın slug'ı hava-squat) */
const HAREKET_SLUG = new Set([
  'goblet-squat','plank','dambil-kurek','sinav',
  'hamle','dambil-omuz-press','dambil-biceps','dead-bug',
  'kettlebell-swing','bant-cekme','kopru','bant-yana-acma',
  'hava-squat','ters-sinav','superman','yuzucu',
  'barfiks','sehpa-dips','bulgar-split-squat','tek-bacak-kopru',
  'yan-plank','dag-tirmanisi','burpee','dambil-gogus-press',
  'dambil-romanya'
]);
/* 27 kanonik kas slug'ı */
const KAS_SLUG = ('boyun trapez-ust trapez-orta-alt deltoid-on deltoid-yan deltoid-arka ' +
  'gogus serratus latissimus romboid rotator-manset biceps triceps on-kol-fleksor on-kol-ekstansor ' +
  'karin-duz karin-yan erector-spinae kalca-fleksor gluteus-maximus gluteus-medius adduktor ' +
  'quadriceps hamstring gastrocnemius soleus tibialis-on').split(' ');

/* ---------------------------------------------------------------------
   KATALOG TERİMLERİ — sözlükteki adı, kütüphanedeki kartın ADIYLA aynı
   hareketi gösteren kayıtlar. Beyar kuralı bunlara uygulanır:
   tanım KISA kalır, "nasıl yapılır" anlatılmaz, `hareket` köprüsü kartı
   gösterir. Anahtar sözlük slug'ı, değer kütüphane slug'ı.

   NOT: `hareket` köprüsü taşıyan HER kayıt bu listede DEĞİL. "Tekrar"
   kaydı da goblet-squat'a köprü kuruyor ama bir hareketi adlandırmıyor,
   bir kavramı anlatıyor — uzunluk sınırı ona uygulanmaz. Liste bu yüzden
   otomatik türetilmiyor, elle ve gerekçeli tutuluyor.
   ------------------------------------------------------------------- */
const KATALOG_TERIM = {
  'comelme':          'hava-squat',
  'hamle':            'hamle',
  'kopru':            'kopru',
  'plank':            'plank',
  'sinav':            'sinav',
  'kurek-cekme':      'dambil-kurek',
  'omuz-press':       'dambil-omuz-press',
  'biceps-curl':      'dambil-biceps',
  'yana-acma':        'bant-yana-acma',
  'dead-bug':         'dead-bug',
  'kettlebell-swing': 'kettlebell-swing'
};

/* TANIM ÜST SINIRI — 6. oturumda ölçüldü: katalog DIŞI tanımların
   ortalaması 218, en uzunu 306 karakter; katalog kayıtlarının en uzunu
   222. Sınır 250 seçildi: bugünkü en uzun katalog kaydının bir cümle
   üstünde, en uzun normal tanımın belirgin altında. Bir katalog tanımı
   250'yi aşıyorsa büyük ihtimalle "nasıl yapılır" anlatmaya başlamıştır
   — o iş kütüphanenin, sözlüğün değil. */
const KATALOG_TANIM_SINIRI = 250;

/* ---------- ortak yardımcılar ---------- */
const CEVIR = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u' };
const sad = s => String(s).toLocaleLowerCase('tr').split('')
  .map(c => (CEVIR[c] !== undefined ? CEVIR[c] : c)).join('');

let fail = 0; const bad = []; const notlar = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);
const not = (m) => { notlar.push(m); console.log('  · ' + m); };

console.log(`\n=== SPOR SÖZLÜĞÜ · KAPALILIK · ${BASE} ===\n`);

/* ---------- veri dosyalarını BASE üzerinden çek ve çalıştır ---------- */
async function veriYukle(yol, global) {
  let r;
  try { r = await fetch(`${BASE}/${yol}`); } catch (e) { return { hata: 'bağlanılamadı' }; }
  if (r.status !== 200) return { hata: 'HTTP ' + r.status };
  const kod = await r.text();
  const sb = { window: {} };
  vm.createContext(sb);
  try { vm.runInContext(kod, sb); } catch (e) { return { hata: 'çalıştırılamadı: ' + e.message }; }
  return { veri: sb.window[global] };
}

const sz = await veriYukle('assets/js/sozluk-veri.js', 'SOZLUK');
if (sz.hata || !sz.veri) {
  console.log(`\n✗ 1 sorun\n\n  · sözlük verisi okunamadı: ${sz.hata || 'SOZLUK global yok'}\n`);
  process.exit(1);
}
const S = sz.veri;
ok(`sozluk-veri.js okundu — ${S.TERIMLER.length} terim · ${S.KATEGORILER.length} kategori`);

const an = await veriYukle('assets/js/anatomi-veri.js', 'ANATOMI_VERI');
if (an.hata || !an.veri) not(`anatomi-veri.js okunamadı (${an.hata || 'global yok'}) — K40 nöbetçisi bu koşuda ATLANDI`);
else ok(`anatomi-veri.js okundu — ${Object.keys(an.veri.kaslar).length} kas paneli`);

/* metin havuzu — kapalılık taramasının kaynağı */
const METIN = S.TERIMLER.flatMap(t => [
  { terim: t.terim, m: t.tanim },
  { terim: t.terim, m: t.ornek },
  ...(t.karistirilanlar ? [{ terim: t.terim, m: t.karistirilanlar.not }] : [])
]);
const TERIM_ADI = new Set(S.TERIMLER.map(t => sad(t.terim)));

function gecisSay(ifade) {
  const k = sad(ifade);
  let adet = 0; const kayitlar = new Set();
  for (const { terim, m } of METIN) {
    const h = sad(m); let i = 0;
    while ((i = h.indexOf(k, i)) > -1) { adet++; kayitlar.add(terim); i += k.length; }
  }
  return { adet, kayit: kayitlar.size };
}

/* ================= 1 · KAPALILIK ================= */
{
  const eksik = [], azalan = [];
  for (const c of KONTROL) {
    const g = gecisSay(c.ifade);
    if (!TERIM_ADI.has(sad(c.ifade))) eksik.push(`"${c.ifade}" tanımsız — ${g.adet} geçiş / ${g.kayit} kayıt · ${c.not}`);
    else if (g.adet < c.min) azalan.push(`"${c.ifade}" artık ${g.adet} kez geçiyor (en az ${c.min} bekleniyordu)`);
  }
  if (!eksik.length)
    ok(`kapalılık: KONTROL listesindeki ${KONTROL.length} ifadenin hepsi sözlükte tanımlı`);
  else rec('kapalılık — tanımsız terim', eksik.join('\n      '));

  if (azalan.length)
    not(`kapalılık — geçiş sayısı düştü (kırmızı değil): ${azalan.join(' · ')}`);

  /* elenen adaylar: kırmızıya döndürmez, kayda geçer */
  const elenenTanimli = ELENEN.filter(e => TERIM_ADI.has(sad(e.ifade)));
  not(`elenen aday: ${ELENEN.length} kalem bilerek dışarıda` +
      (elenenTanimli.length ? ` · bunlardan ${elenenTanimli.length} tanesi sonradan tanımlanmış (${elenenTanimli.map(e => e.ifade).join(', ')}) — liste güncellenebilir` : ''));
}

/* ================= 2 · İKİ TETİKLEYİCİ TERİM ================= */
for (const ad of ['ölü kaldırış', 'burpee']) {
  const t = S.TERIMLER.find(x => sad(x.terim) === sad(ad));
  const g = gecisSay(ad);
  if (!t) rec('tetikleyici terim eksik', `"${ad}" sözlükte YOK (metinlerde ${g.adet} geçiş)`);
  else if (t.tanim.length < 60 || !t.ornek || t.ornek.length < 15)
    rec('tetikleyici terim yarım', `"${ad}" var ama tanım ${t.tanim.length} / örnek ${(t.ornek || '').length} karakter`);
  else ok(`"${ad}" tanımlı — ${t.kategori} · slug ${t.slug} · tanım ${t.tanim.length} krk · metinlerde ${g.adet} geçiş`);
}

/* ================= 3 · HAREKET KÖPRÜLERİ ================= */
{
  const kopru = S.TERIMLER.filter(t => t.hareket);
  const uydurma = kopru.filter(t => !HAREKET_SLUG.has(t.hareket)).map(t => `${t.terim} → ${t.hareket}`);
  const farkli = new Set(kopru.map(t => t.hareket));
  if (!uydurma.length)
    ok(`hareket köprüsü: ${kopru.length} kayıtta ${farkli.size}/${HAREKET_SLUG.size} farklı slug, uydurma 0`);
  else rec('uydurma hareket slug\'ı', uydurma.join(' · '));

  const kullanilmayan = [...HAREKET_SLUG].filter(s => !farkli.has(s));
  if (kullanilmayan.length) not(`hiç köprü almayan kütüphane hareketi: ${kullanilmayan.join(', ')}`);
}

/* ================= 4 · KAS KÖPRÜLERİ ================= */
{
  const kopru = S.TERIMLER.filter(t => t.kas);
  const kume = new Set(KAS_SLUG);
  const uydurma = kopru.filter(t => !kume.has(t.kas)).map(t => `${t.terim} → ${t.kas}`);
  const farkli = new Set(kopru.map(t => t.kas));
  if (!uydurma.length)
    ok(`kas köprüsü: ${kopru.length} kayıtta ${farkli.size}/${KAS_SLUG.length} kanonik slug, uydurma 0`);
  else rec('uydurma kas slug\'ı', uydurma.join(' · '));
}

/* ================= 5 · KATALOGLA ÇAKIŞAN TERİMLER ================= */
{
  const sorun = [], ozet = [];
  for (const [slug, hareket] of Object.entries(KATALOG_TERIM)) {
    const t = S.bul(slug);
    if (!t) { sorun.push(`"${slug}" kaydı YOK — kütüphanede kartı olan hareket sözlükte tanımsız`); continue; }
    if (t.tanim.length > KATALOG_TANIM_SINIRI)
      sorun.push(`${t.terim}: tanım ${t.tanim.length} karakter (üst sınır ${KATALOG_TANIM_SINIRI}) — kütüphanenin işini anlatıyor olabilir`);
    if (t.hareket !== hareket)
      sorun.push(`${t.terim}: köprü "${t.hareket || 'yok'}" (beklenen "${hareket}")`);
    ozet.push(`${t.terim}:${t.tanim.length}`);
  }
  if (!sorun.length)
    ok(`katalogla çakışan ${Object.keys(KATALOG_TERIM).length} terim: tanım ≤${KATALOG_TANIM_SINIRI} krk ve köprü doğru (${ozet.join(' · ')})`);
  else rec('katalog çakışması', sorun.join('\n      '));
}

/* ================= 6 · K40 NÖBETÇİSİ — kasAdlari = anatomi ================= */
if (an.veri) {
  const A = an.veri.kaslar;
  const sapma = [], eksik = [];
  for (const slug of KAS_SLUG) {
    const kop = S.kasAdi(slug);
    const panel = A[slug] && A[slug].ad;
    if (!panel) { eksik.push(`${slug} → anatomi-veri.js'te panel yok`); continue; }
    const anaAd = panel.split('(')[0].trim();
    if (kop !== anaAd) sapma.push(`${slug}: sözlük "${kop}" ≠ anatomi "${anaAd}"`);
  }
  if (!sapma.length && !eksik.length)
    ok(`K40: kasAdlari ${KAS_SLUG.length}/${KAS_SLUG.length} birebir — köprü etiketi vardığı panelin başlığıyla aynı`);
  else rec('K40 — kas adı hizası bozuk', [...eksik, ...sapma].join('\n      '));
}

/* ================= 7 · MEVCUT KABUL ÖLÇÜTLERİ BOZULMADI ================= */
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent', 'accepted'); } catch (e) {} });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${LISTE}`, { waitUntil: 'load' });
  await page.waitForSelector('#szList .sz-item', { timeout: 10000 });

  /* R6 madde 10 — sayaç kabuğun .ff-bar'ının sağ ucuna taşındı ve kısaldı:
     süzgeçsizken "254 terim", süzgeçliyken "55 / 254 terim". */
  const OKU = () => {
    const kart = document.querySelectorAll('#szList .sz-item').length;
    const t = (document.getElementById('szSayac') || {}).textContent || '';
    const bol = t.match(/(\d+)\s*\/\s*(\d+)\s*terim/);
    const tek = t.match(/^\s*(\d+)\s*terim/);
    return { kart, sayac: bol ? +bol[1] : (tek ? +tek[1] : -1) };
  };
  const toplam = S.TERIMLER.length;

  /* 7a — sayaç = DOM = veri */
  const bas = await page.evaluate(OKU);
  if (bas.kart === bas.sayac && bas.sayac === toplam)
    ok(`sayaç = DOM = veri: ${toplam} terim`);
  else rec('sayaç ≠ DOM', JSON.stringify({ ...bas, veri: toplam }));

  /* 7b — her kategori ≥8 */
  {
    const kalemler = await page.$$eval('#szCats .df-fchip', bs =>
      bs.map(b => b.getAttribute('data-kat') || ''));
    /* R8 madde 7d — çipler açılır menüden çıkıp açık raya döndü (kardeş
       marka `.ke-filter` deseni). Çip doğrudan tıklanıyor. */
    const katSec = async (kat) => {
      await page.click(`#szCats .df-fchip[data-kat="${kat}"]`);
      await page.waitForTimeout(70);
    };
    const kucuk = [], dagilim = [];
    for (const kat of kalemler) {
      await katSec(kat);
      const r = await page.evaluate(OKU);
      if (kat === '') { if (r.kart !== toplam) kucuk.push(`Tümü → ${r.kart}`); continue; }
      dagilim.push(`${kat}:${r.kart}`);
      if (r.kart < 8) kucuk.push(`${kat} → ${r.kart} terim`);
      if (r.kart !== r.sayac) kucuk.push(`${kat} sayaç ${r.sayac} ≠ DOM ${r.kart}`);
    }
    if (!kucuk.length) ok(`her kategori ≥8 terim (${dagilim.join(' · ')})`);
    else rec('kategori ≥8', kucuk.join('\n      '));
    await katSec('');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(120);
  }

  /* 7c — karşılıksız harf 0 */
  {
    const harfler = await page.$$eval('#szLetters .sz-ltr', bs => bs.map(b => ({
      harf: b.getAttribute('data-harf') || '',
      bos: b.disabled || b.classList.contains('is-empty')
    })));
    const acik = harfler.filter(h => !h.bos && h.harf);
    const bosDonen = [];
    for (const h of acik) {
      await page.click(`#szLetters .sz-ltr[data-harf="${h.harf}"]`);
      await page.waitForTimeout(35);
      const r = await page.evaluate(OKU);
      if (r.kart < 1) bosDonen.push(`${h.harf} → 0 terim`);
      if (r.kart !== r.sayac) bosDonen.push(`${h.harf} sayaç ${r.sayac} ≠ DOM ${r.kart}`);
    }
    if (!bosDonen.length) ok(`karşılıksız harf 0 — açık ${acik.length} harfin hepsi ≥1 terim`);
    else rec('karşılıksız harf', bosDonen.join('\n      '));
    await page.click('#szLetters .sz-ltr[data-harf=""]');
    await page.waitForTimeout(50);
  }

  /* 7d — arama 3 harf eşiği */
  {
    const olcum = [];
    for (let n = 0; n <= 3; n++) {
      await page.fill('#szQ', 'tempo'.slice(0, n));
      await page.waitForTimeout(60);
      olcum.push((await page.evaluate(OKU)).kart);
    }
    const sabit = olcum[0] === olcum[1] && olcum[1] === olcum[2] && olcum[2] === toplam;
    const suzdu = olcum[3] < olcum[2] && olcum[3] > 0;
    if (sabit && suzdu) ok(`arama eşiği 3: 0/1/2 harfte ${olcum[2]} kart, 3. harfte ${olcum[3]} kart`);
    else rec('arama eşiği', `0h=${olcum[0]} 1h=${olcum[1]} 2h=${olcum[2]} 3h=${olcum[3]} (toplam ${toplam})`);
    await page.fill('#szQ', '');
  }

  /* 7e — yeni terimler detay sayfasında gerçekten açılıyor mu */
  {
    const yeni = KONTROL.map(c => S.TERIMLER.find(t => sad(t.terim) === sad(c.ifade))).filter(Boolean);
    const bos = [];
    for (const t of yeni) {
      await page.goto(`${BASE}/sozluk-detay-v1.html?slug=${encodeURIComponent(t.slug)}`, { waitUntil: 'domcontentloaded' });
      const r = await page.evaluate(() => ({
        h1: (document.getElementById('szH1') || {}).textContent || '',
        tanim: (document.getElementById('szTanim') || {}).textContent || '',
        ornek: (document.getElementById('szOrnek') || {}).textContent || '',
        dus: !!document.querySelector('.sz-404')
      }));
      if (r.dus || r.h1.trim() !== t.terim || r.tanim.trim().length < 60 || r.ornek.trim().length < 15)
        bos.push(`${t.slug}: ${r.dus ? 'bulunamadı durumu' : `h1="${r.h1.trim()}" tanım=${r.tanim.trim().length} örnek=${r.ornek.trim().length}`}`);
    }
    if (!bos.length) ok(`KONTROL listesindeki ${yeni.length} terimin detay sayfası dolu`);
    else rec('kapalılık terimi detayda boş', bos.join('\n      '));
  }

  await ctx.close();
  await browser.close();
}

console.log('');
if (notlar.length) { console.log('  NOTLAR (kırmızı değil):'); notlar.forEach(n => console.log('   · ' + n)); console.log(''); }
if (fail) { console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
