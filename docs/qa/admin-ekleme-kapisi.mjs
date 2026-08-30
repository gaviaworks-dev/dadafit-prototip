/* =====================================================================
   "YENİ EKLE" KAPISI                                            (R19)
   ---------------------------------------------------------------------
   NE SORAR: her liste ekranının "Yeni …" düğmesi GERÇEK bir yazma
   yüzeyi açıyor mu?

   NEDEN VAR — ölçülmüş kusur (`docs/gastro-olcum/fit-yonetilmeyenler.md`
   §D, 2026-08-30):
     · "Yeni …" düğmesi olan ekran        6 / 21
     · gerçek form açan                   5 / 21
     · hiç `<form>` etiketi olmayan ekran 4  (rozetler · menü · reklam · raporlar)
     · sıfır düzenlenebilir alan          2  (reklam · raporlar)
     · bir kayıt SİLME yüzeyi olan ekran  0 / 21
     · `admin-reklam`ın iki düğmesi form açmıyor, "bu turda çizilmedi" notu basıyor

   Bu kapı o sayıları KALICI kılar: düğme varsa arkasında yüzey olmalı.
   Düğmesi olmaması GEREKEN ekranlar `MUAF`ta gerekçesiyle listelidir —
   muafiyet sessiz olmaz.

   Koşum: BASE=http://127.0.0.1:8788 PW_HOME=~/.pw node docs/qa/admin-ekleme-kapisi.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';

/* Ekleme düğmesi BEKLENMEYEN ekranlar — her biri gerekçeli. */
const MUAF = {
  'admin':               'Genel Bakış varlık yönetmez; KPI ve kuyruk özeti taşır.',
  'admin-uyeler':       'Üye kendi kaydolur; panelden üye YARATMAK yanlış olurdu.',
  'admin-uye-detay':    'Detay ekranı; ekleme listede.',
  /* R21 · Bu turda doğan üç `show` sayfası. Gastro'nun karşılıkları TEK TEK
     ölçüldü (B3 · B2) ve ikisi ayrı sonuç verdi — muafiyet metinleri o
     ölçümü taşıyor, "detay sayfasıdır" gibi genel bir gerekçe değil.

     ⚠ `admin-abonelik-detay` için ilk şerh YANLIŞTI: dosya "Gastro'nun show
     sayfası da işlem yapmaz, yalnız gösterir" diyordu. Ölçüldü —
     `abonelikler/show.blade.php` 198 satır, **5 form · 4 alan · 5 @can**
     taşıyor. Gerçek eksiklikti, beş yüzey kuruldu. */
  'admin-abonelik-detay': 'Detay ekranı; aboneliği üye başlatır. Yazma yüzeyi VAR — Gastro '
                        + 'abonelikler/show.blade.php:62/66/71/99/125 karşılığı: iptal · devam · '
                        + 'dondur · istisnai iade · anında sonlandır.',
  /* Gastro `faturalar/show.blade.php` 53 satır: 0 form · 0 alan · 0 buton ·
     0 @can. Gövde tek salt-okunur `<dl class="kv">`; iki `<a>`nın biri geri
     bağlantısı, öteki "PDF İndir". Dosyanın kendi başlığı da yazıyor
     (`:3-4`): "salt-okunur; PDF indirme audit'li". Yani Fit'te yazma yüzeyi
     olmaması eksiklik DEĞİL, Gastro'ya uygunluk. PDF düğmesi bilerek yok:
     belge üretimi sunucu işi, çalışmayan düğme konmadı (kit §14/1). */
  'admin-fatura-detay':   'Fatura değişmez belge; salt okunur. Gastro faturalar/show.blade.php '
                        + 'da 0 form · 0 alan taşıyor — uygunluk, eksiklik değil.',
  /* Gastro'da bu ekranın karşılığı YOK: `ChefApplicationStatus` enum'u var
     ama ekranı yok (B2 ölçtü, tek referans raporlar/_moderasyon.blade.php:2).
     En yakın desen `uyeler/show.blade.php:233-256` — başvuru kararı yan
     kolondaki `.detail-acts` içinde verilir, ayrı bir "Yeni" düğmesi yoktur.
     Başvuruyu üye yapar; panel yaratmaz, karar verir. */
  'admin-antrenor-basvuru': 'Başvuruyu üye yapar; panel karar verir. Karar formu yan kolonda '
                          + '(Gastro uyeler/show.blade.php:233-256 deseni).',
  /* Talebi üye açar — `admin-destek` muafiyetinin aynı gerekçesi, bir
     seviye aşağıda. Yanıt ve durum değiştirme yüzeyi ekranda VAR. */
  'admin-destek-talep':  'Talebi üye açar; panel yanıtlar ve durumunu değiştirir.',
  'admin-moderasyon':   'Kuyruk ekranı — bildirimi üye üretir, yönetici karar verir.',
  'admin-destek':       'Kuyruk ekranı — talebi üye açar.',
  'admin-log':          'Log kaydı sistemce yazılır; elle eklenmez.',
  'admin-raporlar':     'Salt okuma; rapor bir varlık değil, bir görünümdür.',
  'admin-odemeler':     'Ödeme dönemi hesaplanır, elle yaratılmaz.',
  'admin-abonelikler':  'Aboneliği üye başlatır; panel yönetir, yaratmaz.',
  'admin-faturalar':    'Fatura satıştan doğar; elle kesilmez.',
  'admin-ayarlar':      'Ayar ekranı; sekmelerin kendi kaydet çubukları var.',
  'admin-medya':        'Ekleme düğmesi "Görsel yükle" ve kütüphane modalını açar.',
  'admin-antrenorler':  'Başvuruyu üye yapar; profil ekleme düğmesi ayrıca VAR.',
  /* Gastro'nun menü ekranında "Yeni kalem" düğmesi YOK ve olmaması bir
     karar: kalem SABİT HAVUZDAN seçilerek eklenir (ölçüldü,
     `para-abonelik-menu-ayarlar.md` §3.3 — serbest form yok). Beyar
     "Gastro'nunki çok daha iyi, birebir al" dedi; desen alındı.
     ÖLÇÜLDÜ: havuz sütunu dolu, satır "Düzenle" düğmesi 8 alanlı bir
     modal açıyor, `pageerror` 0. Yazma yüzeyi gerçek, adı "Yeni" değil. */
  'admin-menu':         'Kalem sabit havuzdan seçilerek eklenir (Gastro deseni); düzenleme satır modalında.',
  /* K4: üye ÜRETİCİDEN hizmet satın alır — hizmet paketi antrenörün kendi
     ürünüdür, yöneticinin değil. Panel onu YARATMAZ, ONAYLAR; Gastro'nun
     "Creator Planları" ekranı da aynısını yapıyor (ölçüldü,
     `para-abonelik-menu-ayarlar.md` §1.4: "admin creator planının içeriğine
     dokunmaz"). ÖLÇÜLDÜ: 1 form · 4 alan · 6 yıkıcı eylem · 4 durum sekmesi
     — yazma yüzeyi var, adı "Yeni" değil çünkü yaratma burada değil. */
  'admin-hizmetler':    'Hizmet paketini antrenör yaratır (K4); panel onaylar, iade eder, askıya alır.',
};

/* Form sayfaları ve detay ekranları bu kapının konusu değil. */
const ATLA = /(-form|-kurgu)-v1\.html$/;

const EKRANLAR = readdirSync('.')
  .filter((f) => /^admin-.*-v1\.html$|^admin-v1\.html$/.test(f) && !ATLA.test(f))
  .sort();

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });

const satir = [];
const kusur = [];

for (const dosya of EKRANLAR) {
  const ad = dosya.replace(/-v1\.html$/, '');
  await p.goto(`${BASE}/${dosya}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(350);

  const m = await p.evaluate(() => {
    /* "Yeni …" düğmesi: metni "Yeni" ile başlayan ya da fa-plus taşıyan
       başlık/filtre eylemi. Süzgeç kısayolları sayılmaz. */
    const aday = [...document.querySelectorAll('.h-acts .btn, .c-acts .btn, .filter-bar .btn')]
      .filter((e) => /^\s*(Yeni|Ekle|\+)/i.test(e.textContent.trim()) ||
                     e.querySelector('.fa-plus'));
    return {
      ekle: aday.map((e) => ({
        metin: e.textContent.trim().replace(/\s+/g, ' '),
        href: e.tagName === 'A' ? e.getAttribute('href') : null,
        etiket: e.tagName,
      })),
      /* Silme yüzeyi: `data-yikici` taşıyan her düğme. */
      sil: document.querySelectorAll('[data-yikici]').length,
      /* Düzenlenebilir alan: readonly olmayan girdi. */
      alan: [...document.querySelectorAll('input,select,textarea')]
        .filter((e) => !e.readOnly && e.type !== 'search' && e.type !== 'hidden').length,
      form: document.querySelectorAll('form').length,
      /* "bu turda çizilmedi" tipi kaçamak notlar — ölçülmüş kusur. */
      /* ⚠ `document.body.textContent` KULLANILMAZ: `<script>` gövdesini de
         içeriyor ve üç ekranın kaynak yorumu tam da bu kuralı ANLATTIĞI için
         ("bu depoda 'yakında' yazılmaz") kapı kendi belgesini kusur sanıyordu.
         Yalnız GÖRÜNEN metin okunur — sonda körlüğünün bu depodaki dördüncü örneği. */
      kacamak: (function () {
        const y = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) => n.parentElement && /^(SCRIPT|STYLE|TEMPLATE)$/.test(n.parentElement.tagName)
            ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
        });
        let t = '';
        for (let n = y.nextNode(); n; n = y.nextNode()) t += n.nodeValue + ' ';
        return /bu turda çizilmedi|yakında|çizilecek/i.test(t) ? 1 : 0;
      })(),
      /* Satır eylemi bir form/detay sayfasına gidiyor mu — liste ekranının
         yazma yüzeyi orada olabilir. `innerHTML` de taranır, çünkü tablo
         satırları JS ile basılıyor ve ölçüm anında henüz basılmamış olabilir. */
      satirFormu: /(admin-[a-z-]*(?:-form|-kurgu|-detay)-v1\.html)/.test(document.body.innerHTML) ? 1 : 0,
    };
  });

  /* 🔴 R19 · KAPI ARTIK TIKLIYOR.
     ÖNCEKİ HÂL yalnız sayfada `<form>` var mı diye bakıyordu ve MODAL
     tabanlı yazma yüzeylerini göremiyordu: `admin-taksonomi`nin terim
     modalı ve `admin-menu`nün mini düzenleme modalı JS ile AÇILINCA
     doğuyor, sayfa yüklenirken DOM'da yok. İkisi de doğru kurulmuş
     ekranlardı ve kapı ikisini de kırmızı yakıyordu.
     Yanlış kırmızı, kırmızıyı değersizleştirir (lessons §3).
     Doğrusu: düğmeye BAS, sonra yazma yüzeyi doğdu mu ÖLÇ. */
  let modalYuzey = 0;
  if (m.ekle.length && !m.ekle[0].href) {
    const oncesi = await p.evaluate(() =>
      [...document.querySelectorAll('input,select,textarea')]
        .filter((e) => e.offsetParent !== null && e.type !== 'search' && e.type !== 'hidden').length);
    try {
      await p.locator('.h-acts button, .c-acts button, .filter-bar button')
        .filter({ hasText: /^\s*(Yeni|Ekle)/i }).first().click({ timeout: 2500 });
      await p.waitForTimeout(450);
      const sonrasi = await p.evaluate(() =>
        [...document.querySelectorAll('input,select,textarea')]
          .filter((e) => e.offsetParent !== null && e.type !== 'search' && e.type !== 'hidden').length);
      modalYuzey = Math.max(0, sonrasi - oncesi);
    } catch (e) { modalYuzey = 0; }
  }

  const d = [];
  const muaf = MUAF[ad];

  if (!m.ekle.length && !muaf) {
    d.push('"Yeni …" düğmesi yok ve muafiyet gerekçesi de yok');
  }
  /* Düğme varsa arkasında yüzey olmalı: ya ayrı form sayfasına gider,
     ya bir formu açar. Hiçbiri değilse düğme yalan söylüyor. */
  for (const e of m.ekle) {
    if (e.href) {
      if (e.href === '#' || !e.href) d.push(`"${e.metin}" ölü bağlantı`);
      else {
        const varMi = readdirSync('.').includes(e.href.split(/[?#]/)[0]);
        if (!varMi && !/^https?:/.test(e.href)) d.push(`"${e.metin}" → ${e.href} dosyası yok`);
      }
    } else if (!m.form && !modalYuzey) {
      d.push(`"${e.metin}" bir <button> ama tıklayınca yazma yüzeyi doğmuyor ` +
             `(ne sayfada <form> var, ne modal açılıyor)`);
    }
  }
  if (m.kacamak) d.push('sayfada "bu turda çizilmedi / yakında" kaçamak notu var');
  /* ⚠ "Düzenlenebilir alan" kuralı YALNIZ kendi içinde yazan ekranlar için.
     Bir LİSTE ekranının alanı olmak zorunda değildir — düzenleme ayrı form
     sayfasındadır (Gastro kanonu, karar D6). Kural bir ekranı ancak
     ne alanı ne de bir form sayfasına çıkışı varsa kırmızıya çevirir;
     yoksa doğru kurulmuş her liste ekranını yanlış yere suçlardı. */
  const formaCikis = m.ekle.some((e) => e.href && /(-form|-kurgu|-detay)-v1\.html/.test(e.href)) ||
                     m.satirFormu || modalYuzey > 0;
  if (!m.alan && !formaCikis && !muaf) {
    d.push('ne düzenlenebilir alan var ne de bir form sayfasına çıkış');
  }

  satir.push({
    ekran: ad.replace(/^admin-?/, '') || 'genel',
    ekle: m.ekle.length,
    hedef: m.ekle.map((e) => e.href ? 'sayfa' : (modalYuzey ? 'modal' : 'form')).join('+') || (muaf ? 'muaf' : '—'),
    form: m.form, alan: m.alan, modal: modalYuzey, sil: m.sil,
    kusur: d.length,
  });
  if (d.length) kusur.push({ dosya, d });
}

await b.close();

const bas = ['ekran', 'yeni', 'hedef', 'form', 'alan', 'modal', 'sil', 'kusur'];
const gen = bas.map((h, i) => Math.max(h.length, ...satir.map((s) => String(Object.values(s)[i]).length)));
console.log(bas.map((h, i) => h.padEnd(gen[i])).join('  '));
console.log(gen.map((g) => '─'.repeat(g)).join('  '));
for (const s of satir) console.log(Object.values(s).map((v, i) => String(v).padEnd(gen[i])).join('  '));

const ekleyen = satir.filter((s) => s.ekle > 0).length;
const silen = satir.filter((s) => s.sil > 0).length;
console.log('\n════ SONUÇ ════');
console.log(`ekran ${satir.length} · "Yeni …" düğmesi olan ${ekleyen} · muaf ${Object.keys(MUAF).length}`);
console.log(`silme yüzeyi olan ${silen} · toplam düzenlenebilir alan ${satir.reduce((t, s) => t + s.alan, 0)}`);
console.log(`kusurlu ekran ${kusur.length}`);
if (kusur.length) {
  console.log('');
  for (const k of kusur) console.log(`🔴 ${k.dosya}\n   - ${k.d.join('\n   - ')}`);
  process.exitCode = 1;
} else {
  console.log('✅ her ekleme düğmesinin arkasında gerçek bir yazma yüzeyi var');
}
