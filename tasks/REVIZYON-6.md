# REVİZYON 6 — 8. OTURUMUN BRIEF'İ

**Depo:** `~/Developer/Projects/dadafit-prototip` · **Branch:** `main`
**Taban commit (K27 kırmızı kanıtı bu commit'e karşı alınır):** `8bf5c66`
**Önceki devir:** `tasks/DEVIR-5.md` — **ölçümler orada, yeniden ölçülmeyecek**
**Kararlar:** `KARARLAR.md` (K1–K45)

> Bu dosya turun tek görev kaynağıdır. 21 madde var. Her madde
> **sorun · yapılacak · ölçülebilir kabul ölçütü** üçlüsüyle yazılıdır.

---

## 0 · TURUN ANA KURALI — ÜÇ GEÇİŞ (her arayüz maddesi için ZORUNLU)

| Geçiş | Ne yapılır |
|---|---|
| **1 · Kur** | `frontend-design` skill'i **okunur**, sonra uygulanır. Playwright ile **@1440 ve @390** ekran görüntüsü alınır, diske yazılır |
| **2 · Kendi işini eleştir** | Ekran görüntüsüne **bakılır**. Hizalama · dikey ritim · boşluk tutarlılığı · tipografik hiyerarşi · kontrast · dokunma hedefi · mobil kırılma eksenlerinde **en az 3 somut kusur** bulunur ve düzeltilir. *"Kusur yok" kabul değil.* Yeniden görüntü alınır |
| **3 · Referansla karşılaştır** | Çıktı kardeş marka muadiliyle (`dadadiet.com` / `dadagastro.com`) yan yana konur; referanstan zayıf kalan her yer tek tek yazılır ve kapatılır. Üçüncü kez görüntü alınır |

**Rapor ancak 3. geçişten sonra verilir.** Üç geçişin de ekran görüntüleri ve
her geçişte neyin değiştiği raporda olacak.

## 0b · KABUK SAHİPLİĞİ

| Dosya | Kim dokunabilir |
|---|---|
| `assets/css/fit-shell.css` | **YALNIZ AJAN-A (Kabuk & Banner)** |
| `assets/js/fit-shell.js` | **YALNIZ AJAN-A** |
| Menü / footer markup'ı (`NAV` · `BOTTOM` · drawer dizileri · footer üreteci) | **YALNIZ AJAN-A** |
| `assets/js/fit-plan-kayit.js` | **LEAD yazar** (sözleşme), D ve E okur |
| Kendi sayfa dosyaları | Her ajan kendininkine |

Kabukta eksik gören ajan **kendisi düzeltmez**, notu raporuna yazar; AJAN-A uygular.
Sayfa içi ihtiyaç varsa **sayfa içi `<style>` + kendi sınıf öneki** kullanılır (R13'ün `pb-*` deseni gibi).

## 0c · BOZULMAYACAKLAR (DEVIR-5 §7)

- **Banner ailesi:** LİSTE `544 / 607 / 587` · DETAY `560 / 617 / 726` (@1440 / @1024 / @390)
- **R11 footer perdesi:** `main.margin-bottom` = footer yüksekliği (kesirli), kuyruk 0
- **Yasal bant:** bayt bayt aynı — `tests/footer-yapi.mjs` nöbet tutuyor
- **Kanonik slug sözleşmeleri:** K39 (27 kas) · K40 · K43 (hareket adları kütüphaneden)
- **`assets/svg/` gövde modelleri:** yalnız madde 21 kapsamında değişir
- **Ana sayfa herosu** (`dadafit-hub`, 900 px, K15/S-H): aileye girmez, dokunulmaz
- **Kırıntı ev ikonu 9 px** (R12) · **`.btn-fit` kontrastı 5.45:1** (S4)

## 0d · AJAN BRIEF KURALLARI (7. oturumda üç ajan sessizce takıldı)

- `frontend-design` skill'ini **okumadan koda başlama**
- **Üç geçiş zorunlu**, tek geçişte "bitti" deme
- **Her 10 dakikada bir tek satır ilerleme notu** yaz — sessiz kalma
- Ekran görüntülerini **ilerledikçe** diske yaz, sonda toplu yazma
- Rapor serbest metin değil, **§9'daki şemayı doldur**
- **Commit atma** — commit'leri lead atar
- **Ana oturumun iddialarına güvenme, kendin ölç**
- Karşılığı olmayan sayfa/bağlantı **uydurma**; yer tutucu gerekiyorsa
  `docs/icerik-bekleyen.md`'ye kaydet

---

# A · SAĞLIK-GÜVENLİK TEMİZLİĞİ — AJAN-A

> **Kök bulgu (lead ölçtü):** Sayfa altındaki "Sağlık ve güvenlik" section'ı
> sayfa markup'ında **değil** — `assets/js/fit-shell.js` **satır 1933–2020**
> arasındaki IIFE onu **60 sayfanın hepsine** basıyor (`section.fit-health`,
> `#pageMain`'in son çocuğu, B10). Yani **1 · 2 · 3 maddeleri tek değişikliktir.**

## Madde 1 — Ana sayfadaki "Sağlık ve güvenlik" section'ı kalksın
- **Sorun:** `dadafit-hub-v1.html`'in altında `.fit-health` basılıyor.
- **Yapılacak:** Madde 2 ile aynı değişiklik kapsar.
- **Kabul:** `dadafit-hub-v1.html` DOM'unda `.fit-health` **0 düğüm** (@1440 ve @390).

## Madde 2 — Site genelinde sayfa altı sağlık-güvenlik section'ı kalksın
- **Sorun:** 60 sayfada tekrar eden, kimsenin okumadığı ağır bir blok.
- **Yapılacak:** `fit-shell.js`'teki `.fit-health` üretici IIFE'si **kaldırılır**.
  `fit-shell.css`'teki `.fit-health` / `.fh-*` kural ailesi (satır ~1677–1697) de
  temizlenir — ölü CSS bırakılmaz.
- **DİKKAT — kaybolmaması gerekenler:**
  1. **Yasal banda DOKUNULMAZ.** Yasal banttaki
     `saglik-bilgilendirme-v1.html` bağlantısı **kalacak** — uyarı siteden
     tamamen kaybolmuyor, yalnız section olarak basılmıyor.
  2. `.fit-health` içindeki **tercih düğmeleri** (`#fhSound` · `#fhVibe` ·
     `#fhMotion`) `fit-shell.js:2015–2017`'de `pref()` ile localStorage'a
     bağlı. `fhMotion` ayrıca **`prefers-reduced-motion` davranışını**
     tetikliyor. Bu üç tercih **yok olmayacak**: `fit-planim-veri-izin-v1.html`
     zaten "Tüm tercihler" hedefi — üç tercih **oraya taşınır**, aynı
     localStorage anahtarlarıyla (`dm_fit_sound` · `dm_fit_vibe` ·
     `dm_fit_motion`). Anahtar adı değişmez, kayıtlı tercih kaybolmaz.
- **Kabul:**
  - 60 sayfanın **60'ında** `document.querySelectorAll('.fit-health').length === 0`
  - Yasal bant markup'ı **bayt bayt aynı** (`tests/footer-yapi.mjs` yeşil)
  - `saglik-bilgilendirme-v1.html`'e giden bağlantı sayısı **≥ 1** (yasal bant)
  - R11 perdesi bozulmadı: `main.margin-bottom − footer yüksekliği` **59/59 tek değer**
  - Üç tercih `fit-planim-veri-izin-v1.html`'de çalışıyor, `dm_fit_*` anahtarları aynı
  - Konsol hatası **0**

## Madde 3 — `antrenman-olusturucu-v1.html` divider altındaki sağlık section'ı
- **Sorun:** Bu sayfada **iki** uyarı var: kabuğun `.fit-health`'i **ve**
  sayfanın kendi `.hr-note`'u (satır 262–267).
- **Yapılacak:** Kabuğunki madde 2 ile gidiyor. Sayfanın kendi `.hr-note`'u
  **kart içine gömülür** (sihirbaz kartının alt bandına), kendi başına
  section/divider bloğu olarak durmaz.
- **Kabul:** `.fit-health` 0 · `.hr-note` sihirbaz kartının **içinde**
  (`el.closest('.wg-card')` truthy) · uyarı metni **kaybolmadı**.

**Not — AJAN-C'ye bağımlılık:** `anatomi-v1.html`'in kendi `.hr-note`'u
(satır 217–225) **madde 15**'in konusu; AJAN-A ona dokunmaz.

---

# B · BANNER AİLESİ — AJAN-A

## Madde 4 — İstatistik şeridi SAĞDA DİKEY olacak (TÜM SİTE)
- **Sorun:** `.lib-stats` şu an açıklamanın **altında yatay** duruyor
  (`fit-shell.css:1361` `display:flex; gap:26px`). Örnek:
  *"254 terim · A–Z 28 harflik dizin · 10 kategori"*. Kardeş markalarda bu şerit
  **sağda dikey** bir kolon.
- **Yapılacak:**
  1. Playwright ile `dadagastro.com` ve `dadadiet.com` banner'ları **ölçülür**:
     kolon genişliği · sol kolonla arasındaki boşluk · kalemler arası dikey
     boşluk · sayı/etiket tipografisi · ayraç var mı · hizalama (üst/orta/alt) ·
     @1024 ve @390'da nereye düşüyor. **Sayı uydurulmaz, ölçülür.**
  2. `.lib-top > .wrap` iki kolonlu ızgaraya çevrilir: sol = kırıntı/eyebrow/
     H1/alt metin/CTA, sağ = `.lib-stats` dikey kolon.
  3. **R15 kilidiyle çakışma:** `fit-shell.css:1908`
     `body[data-fit-hero-kind] .lib-top > .wrap > .lib-stats{order:1}` kuralı
     4. turun sütun-sarmalı düzeninden kalma; yeni ızgarayla birlikte
     yeniden yazılır. `.lib-cta`'nın **sola** hizası (H1 sol kenarıyla
     **0 px fark**, DEVIR-5 §2b) korunur.
  4. `.fit-band-panel` geri taşıma kilidi (B11, `fit-shell.js:2246–2266`)
     **bozulmaz**.
- **Kapsam:** `.lib-stats` **33 sayfada** kullanılıyor — hepsi.
- **Kabul:**
  - @1440'ta 33 sayfanın 33'ünde `.lib-stats` sol kolonun **sağında**
    (`stats.left > sol.right`) ve `flex-direction: column`
  - **Banner yükseklikleri değişmedi:** LİSTE 544/607/587 · DETAY 560/617/726
  - CTA sol kenarı − H1 sol kenarı = **0** (33/33)
  - @390'da şerit sol kolonun **altına** düşüyor, taşma 0
  - Yatay taşma **0** · konsol hatası **0**

## Madde 5 — `programlar-merkezi-v1.html` banner butonları
- **Sorun:** İki buton (`Programını Bul` = `.btn-fit`, `Tüm Programlar` =
  `.btn-ghost.lib-cta-ghost`) yanlış hiyerarşide ve kötü duruyor.
- **Yapılacak:** Kardeş markalarda banner CTA hiyerarşisi Playwright ile
  incelenir (birincil/ikincil ayrımı · yükseklik · dolgu · aradaki boşluk ·
  ikincil butonun kenarlık/zemin dili · konum) ve uygulanır.
- **Kabul:** Buton yüksekliği referansla ±2 px · birincil-ikincil kontrast
  farkı ölçülüp yazıldı · `.btn-fit` kontrastı **≥ 4.5:1** korundu ·
  dokunma hedefi @390'da **≥ 44 px** · banner yüksekliği 544/607/587 sabit.

## Madde 6 — `programlar-merkezi-v1.html` banner ALTINDAKİ section
- **Sorun:** Banner'ın hemen altındaki section yanlış yerde: **tek kart sola
  yaslı**, çevresindeki white space kardeş markaların ritmine aykırı.
- **Yapılacak:** Section'ın sayfadaki sırası ve boşluk ritmi referansa
  hizalanır. Tek kart ya ızgaraya tamamlanır ya da tam genişliğe çıkarılır —
  **sola yaslı yetim kart bırakılmaz**.
- **Kabul:** Banner alt kenarı → ilk section üst kenarı boşluğu referansla
  ölçülüp eşitlendi (fark ≤ 4 px) · bölüm içi kart ızgarası **yetim kolon
  bırakmıyor** · @390'da dikey ritim tek değerde.

## Madde 7 — `antrenor-detay-v1.html?slug=selin-aksoy` banner'ı
- **Sorun:** DETAY ailesi imza banner'ı (`.cp-top`, K22); madde 4'ün dikey
  şerit düzeni buraya da gelecek.
- **Yapılacak:** Aynı revizyon. **S-G kararı hatırlatması:** `antrenor-detay`
  ve `program-detay` **tek kolona** çekilecekti, h1 sol kenarı 56/56 sayfada
  **132 px** olacaktı. Bu maddede o karar da uygulanır.
- **Kabul:** `.cp-top` yüksekliği **560/617/726** · h1 sol kenarı **132 px** ·
  istatistik şeridi sağda dikey · `.fit-band-panel` banner'a geri taşınmadı (B11).

---

# C · SÖZLÜK — AJAN-B (`sozluk-v1.html` · `sozluk-detay-v1.html`)

> **K37 hatırlatması:** desen referanstan ölçülerek alındı — terim bir
> **açılır satır** (kart değil) · arama **3 harf** eşiği · harf rayı **29 harf**
> (Q/W/X yok, Ğ boş+`disabled`). **232 terim · 10 kategori.**
> `tests/sozluk.mjs` ve `tests/sozluk-kapalilik.mjs` nöbette — **K42**
> (sözlük kapalı olmalı: kendi metninde geçen terim tanımlı) bozulamaz.

## Madde 8 — "Satıra dokun" uyarısı kalksın
- **Sorun:** `sozluk-v1.html:263` — gereksiz üç satırlık kullanım talimatı.
- **Yapılacak:** Uyarı **tamamen kaldırılır**. İçindeki
  `egzersiz-kutuphane-v1.html` bağlantısı kaybolacaksa sayfada başka bir
  karşılığı olup olmadığı kontrol edilir; yoksa uygun bir yere taşınır.
- **Kabul:** "Satıra dokun" metni **0 kez** · `egzersiz-kutuphane-v1.html`
  bağlantısı sayfada **≥ 1** · uyarının bıraktığı boşluk kapandı
  (üstündeki/altındaki öğe arası boşluk sayfanın diğer bölümleriyle **tek değer**).

## Madde 9 — Kartlardaki sağ ok butonu kalksın
- **Sorun:** `sozluk-v1.html:448` — satırın sağındaki
  `<a><i class="fa-chevron-right"></i></a>` detaya gidiyor; satırın kendisi
  expand ediyor. **İki hedefli tek satır** = belirsiz.
- **Yapılacak:** Gastro sözlük modülüyle tutarlı hâle getirilir: **sağ ok
  kaldırılır**; satıra tıklayınca terimin tam kaydı **yerinde açılır**, açılan
  kaydın içindeki bir bağlantı (ör. "Terimin sayfası") detaya götürür.
  Referans Playwright ile `dadagastro.com/mutfak-sozlugu`'ndan **ölçülür**.
- **Kabul:** `.sz-*` satırında `fa-chevron-right` taşıyan bağlantı **0** ·
  açılan kaydın içinde `sozluk-detay-v1.html?slug=…` bağlantısı **232/232** ·
  `tests/sozluk.mjs` + `tests/sozluk-kapalilik.mjs` **yeşil** ·
  klavye ile açma/kapama ve detaya gitme çalışıyor · `aria-expanded` doğru.

## Madde 10 — Harf / kategori / arama yapısı yeniden kurulacak  ⚠️ **2–3 TUR**
- **Sorun:** Üç süzgecin yerleşimi ve sırası referansla uyumsuz.
- **Yapılacak:**
  1. **Referans:** `dadagastro.com/mutfak-sozlugu` Playwright ile
     **kaydırılarak** incelenir — arama input'u → harf rayı → kategoriler
     **sırası**, aralarındaki boşluklar, harf rayının kaydırma davranışı,
     aktif harf işareti, sayaç konumu. Ölçülür, uydurulmaz.
  2. **Sticky/yapışkan başlık İSTENMİYOR** — süzgeç bloğu `position:sticky`
     **almayacak**.
  3. **Kategori sunumu:** `egzersiz-kutuphane-v1.html?sure=15` sayfasındaki
     **"Filtrele" deseni** kullanılacak — **dropdown + arama**. Yeni desen
     icat edilmeyecek; sitede var olan bileşen uygulanacak.
  4. Bu madde için **2–3 tur** yapılacak: her turda ekran görüntüsü alınıp
     referansla karşılaştırılacak.
- **Kabul:**
  - Blok sırası referansla **birebir aynı** (ekran görüntüsüyle kanıtlı)
  - `position:sticky` taşıyan süzgeç öğesi **0**
  - Kategori seçici `egzersiz-kutuphane`'deki "Filtrele" bileşeniyle **aynı
    sınıf/desen** — dropdown + içinde arama
  - Harf rayı **29 harf**, Ğ `disabled`, aktif harf işaretli
  - Üç süzgeç **aynı anda** süzüyor · sayaç = DOM · boş durum çıkıyor
  - @390'da harf rayı taşmıyor · dokunma hedefi ≥ 44 px
  - `tests/sozluk.mjs` **yeşil**

---

# D · ANATOMİ — AJAN-C (`anatomi-v1.html`)

> **K38 · K39 · K40 hatırlatması:** veri `Muscle.pdf`'ten gözle okundu, her
> kayıt `kaynak: 'PDF s. …'` taşıyor · **27 kanonik kas slug'ı** sözleşme ·
> kas adlandırmasında **anatomi verisi kanonik**. `tests/anatomi.mjs` nöbette.

## Madde 11 — "Anatomik veri kaynağı" satırı kalksın
- **Sorun:** `anatomi-v1.html:445` — panelin altındaki `.an-kaynak` satırı
  her kasta uzun bir kaynak künyesi basıyor.
- **Yapılacak:** Satır **kaldırılır**. Verinin `kaynak` alanı **silinmez**
  (K38 sözleşmesi), yalnız ekrana basılmaz.
- **Kabul:** `.an-kaynak` DOM'da **0** · `anatomi-veri.js`'te `kaynak:` alanı
  **29/29 kayıtta duruyor** · `tests/anatomi.mjs` yeşil ·
  `.an-kaynak` CSS kuralı (satır 120–121) da temizlendi.

## Madde 12 — Sarı "Sık yapılan hata / güvenlik notu" kartı değişecek
- **Sorun:** Sarı info kartı sayfanın diline yabancı.
- **Yapılacak:** Sayfaya yakışan **farklı bir sunum** bulunur. Sarı uyarı
  kutusu yerine ör. panelin içinde ayrı bir alan başlığı, ikonlu iki kolonlu
  liste, ya da `.an-panel`'in kendi tipografik ritmine giren bir blok.
  **K12 hatırlatması:** uyarı ve not blokları **yaslanmaz**.
- **Kabul:** Sarı zemin (`#fff*` sarı ailesi / `--warn*`) bu blokta **0** ·
  yeni sunum site token'larını kullanıyor (yeni renk **uydurulmadı**) ·
  metin kaybolmadı · kontrast **≥ 4.5:1** · üç geçiş görüntüsü var.

## Madde 13 — Sağ sticky karttaki alt çiftlerin radius'u sertleşecek
- **Sorun:** "komşu kaslar · çalıştıran hareketler · ekipman" çiftleri **çok
  yuvarlak** — sitenin geri kalanıyla uyumsuz.
- **Yapılacak:** Radius site token'ıyla hizalanır. **K24 kaydı:** çip yarıçapı
  **12 px** seçilmişti, kart 16 px. Bu çiftlerin hangi aileye girdiği
  ölçülüp uygun token uygulanır — **elle sayı yazılmaz, token kullanılır**.
- **Kabul:** Blokların `border-radius` değeri site token'larından biri
  (`--radius-sm/md/lg` ya da çip 12 px) · sayfada **tek değer** ·
  ölçülen önce/sonra değerleri raporda.

## Madde 14 — Kas seçilince "Kütüpheden" değişimi GÖRÜNMÜYOR (UX hatası)
- **Sorun:** Bir kasa tıklanınca `#anCardsSec` içeriği değişiyor ama o bölüm
  **ekranın altında** kalıyor; kullanıcı değişimi görmüyor. Sessiz güncelleme.
- **Yapılacak:** **Tercih edilen çözüm: sağ panelin (`.an-panel`) içine
  gömülür** — seçili kası çalıştıran hareketler panelin bir alanı olur, kas
  değişince aynı ekranda değişir. Alt bölüm ya kalkar ya da "tüm hareketler"
  bağlamına dönüşür (ikisi **aynı listeyi iki kez** göstermeyecek).
  Değişimin görünür olması şart: seçim sonrası panelde bir **durum
  değişikliği** (başlık + kart listesi) aynı ekranda.
- **Kabul:**
  - Kas seçildikten sonra, **kaydırmadan**, viewport içinde değişen hareket
    listesi görünüyor — @1440 ve @390'da ölçülüp kanıtlandı
    (`el.getBoundingClientRect().top < innerHeight`)
  - 29/29 kasta liste doğru dolu · boş kas varsa dürüst boş durum
  - `aria-live` bildirimi çalışıyor (`#anLive`)
  - Aynı hareket listesi sayfada **iki kez** basılmıyor
  - `tests/anatomi.mjs` yeşil · 58/58 bölge tıklaması hâlâ çalışıyor

## Madde 15 — "Kütüphaneden" sonrası sağlık notu dikeyde simetrik değil
- **Sorun:** `anatomi-v1.html:217–225` — `.hr-note` kendi section'ında
  (`padding-top:0`) duruyor, dikey olarak ortalanmamış/dengesiz.
- **Yapılacak:** İki seçenekten biri: (a) yukarı yaslanır ve section dolgusu
  düzeltilir, (b) **kart içine uyarı olarak taşınır** (madde 14'ün panel
  çözümüyle birlikte daha tutarlı olur). Ajan ölçüp seçer, gerekçeyi yazar.
- **DİKKAT:** Kabuğun `.fit-health`'i madde 2 ile **zaten kalkıyor** —
  bu madde **sayfanın kendi** `.hr-note`'u içindir, ikisi karıştırılmayacak.
- **Kabul:** Notun üst/alt boşluğu **eşit** (fark ≤ 2 px) ya da not kart
  içinde · uyarı metni ve `saglik-bilgilendirme-v1.html` bağlantısı **duruyor** ·
  @390'da taşma 0.

---

# E · ANTRENMAN OLUŞTURUCU — AJAN-D (`antrenman-olusturucu-v1.html`)

> **K44 hatırlatması:** kural **VERİ**dir — `tasks/H3-KURALLAR.md` §9 ile
> sayfadaki `KURALLAR` bloğu **karakter karakter aynı** olmak zorunda; biri
> değişirse öteki de değişir. `tests/workout-generator.mjs` 14. maddesi
> ayrışmayı yakalar. **Havuz 25 hareket**, ekipmansız havuz **15**.

## Madde 16 — Ekipman adımına iki seçenek eklenecek
- **Sorun:** "Neye erişimin var?" 4 seçenek; ızgara **2 sütun** olduğu için
  5. seçenek boş kutu bırakır.
- **Yapılacak:**
  1. **"Tam ekipman / Salon"** seçeneği eklenir — tüm ekipmana sahip salon
     kullanıcısı.
  2. **6. seçenek** eklenir, ama **zorlama değil**: gerçekten anlamlı bir
     ekipman kategorisi olacak (barfiks/halka · sehpa/bench · makine gibi).
     **Havuzu gerçekten süzecek** — dekoratif olmayacak.
  3. Seçim mantığı: "Tam ekipman" seçilince diğerleri **anlamsızlaşıyorsa**
     R13'teki "Yok" davranışının aynası uygulanır (biri diğerlerini temizler).
     Ajan ölçüp karar verir, gerekçeyi yazar.
- **Kabul:**
  - Izgara 6 seçenekte **boş kutu bırakmıyor** (@1440 3×2 ya da 2×3, @390 tek kolon)
  - Her yeni seçenek havuzu **gerçekten süzüyor**: seçenek işaretliyken
    havuz kalemi sayısı, işaretli değilkenden **farklı** — ölçülüp raporlandı
  - Eklenen ekipman kategorisi kataloğun `ekipman` alanlarıyla **eşleşiyor**
    (uydurma kategori yok; eşleşmiyorsa katalog alanı da güncellenir)
  - `tasks/H3-KURALLAR.md` §9 ↔ sayfa `KURALLAR` bloğu **karakter karakter aynı**
  - **Hiçbir yanıt bileşimi boş plan döndürmüyor** (eleme değil, puan düşüşü)
  - `tests/workout-generator.mjs` **yeşil** · dokunma hedefi @390 ≥ 44 px

## Madde 17 — Bu sayfadaki anatomi görselleri  ⏸ **MADDE 21'E BAĞLI**
- **Durum:** `assets/svg/govde-*.svg` (4 dosya, 14–16 bölge) H3'ün cinsiyet
  adımında da kullanılıyor. Madde 21 onaylanıp yeni set üretilene kadar
  **BEKLEMEDE**. Ajan bu maddeye dokunmaz.

---

# F · PLAN KAYDETME — AJAN-D (madde 18) · AJAN-E (madde 19)

> **SÖZLEŞME — `assets/js/fit-plan-kayit.js` (lead yazar, ikisi de okur):**
> ```
> localStorage anahtarı: 'dm_fit_planlar_v1'
> FIT_PLAN.kaydet(plan)   → id döner
> FIT_PLAN.listele()      → [plan]
> FIT_PLAN.getir(id)      → plan | null
> FIT_PLAN.sil(id)
> FIT_PLAN.aktifYap(id) / FIT_PLAN.aktif()
> FIT_PLAN.isaretle(id, gunNo, hareketIdx, {yapildi, seviye})
> FIT_PLAN.ozet(id)       → {toplam, yapilan, oran, sonTarih, aktifGun}
> ```
> Plan şeması ve alan adları modülün başındaki blokta yazılı. **İki ajan da
> bu modülü çağırır, kendi depolama kodunu yazmaz.**

## Madde 18 — Plan kaydedilebilsin, görüntülenebilsin, ilerleme işaretlensin
- **Sorun:** Oluşturulan plan **uçuyor** — kullanıcı giriş yapmış olsa bile
  kaydedemiyor, sonra göremiyor.
- **Yapılacak:**
  1. **Referans:** `dadagastro.com/bugun-ne-pisirsem` Playwright ile
     incelenir — *"Sıfırdan kur"* / *"Menüye ekle"* akışı ve **sağdaki panel**.
     **Pop-up birebir kopyalanmayacak**; DadaFit'te *plan görüntüleme +
     ilerleme kaydı* bağlamına uyarlanacak.
  2. Sonuç ekranına **"Planı Kaydet"** eylemi gelir → `FIT_PLAN.kaydet()`.
  3. **Kayıtlı plan görüntüleme sayfası**: `fit-planim-programim-v1.html`
     zaten var (8.4 KB, iskelet) — **oraya kurulur**, yeni sayfa uydurulmaz.
     Gerçekten yetmiyorsa yeni sayfa üretilir ve gerekçesi yazılır.
  4. **İlerleme işaretleme:** hangi gün / hangi hareket yapıldı, **hangi
     seviyede** (ör. tamamlandı / yarım / atlandı ya da set-tekrar girişi —
     ajan ölçüp seçer, gerekçesini yazar).
  5. İlerleme `fit-planim-v1.html`'e **yansır** (madde 19 ile birlikte).
- **Kabul:**
  - Sonuç ekranında "Planı Kaydet" → sayfa yenilendikten sonra plan **duruyor**
  - Kayıtlı plan görüntüleme sayfası planı **tam** basıyor (gün · hareket · set/tekrar)
  - Bir hareket işaretlenip sayfa yenilendiğinde işaret **duruyor**
  - `FIT_PLAN.ozet()` oranı DOM'daki ilerleme göstergesiyle **birebir aynı**
  - Giriş yapılmamış kullanıcıda akış **kırılmıyor** (dürüst bir kapı ya da
    yerel kayıt — ajan karar verir, gerekçe yazılır)
  - **Yeni sınama** `tests/plan-kayit.mjs` yazıldı ve taban commit `8bf5c66`'da
    **kırmızıya döndü** (K27)
  - Konsol hatası 0 · @1440 ve @390

## Madde 19 — `fit-planim-v1.html` kardeş marka profilleriyle hizalanacak
- **Sorun:** Sayfa gastro/gurme/diyet profillerinden **kopuk ve tutarsız**
  (11.4 KB iskelet; 8 alt sayfası var: `fit-planim-*`).
- **Yapılacak:**
  1. Kardeş markaların profil/hesap sayfaları Playwright ile **incelenir**:
     kolon düzeni · sol ray kalemleri · üst özet kartı · kart dili · boşluk
     ritmi · başlık ölçeği. Ölçülür.
  2. `fit-planim-v1.html` ve 8 alt sayfası bu dile hizalanır.
  3. **Madde 18'in ilerleme verisi buraya düşer** — `FIT_PLAN.ozet()`
     okunur, aktif plan ve ilerleme oranı üst özet kartında görünür.
  4. **`tests/plan-account.mjs` nöbette:** "Planım rayı 7 kalem, Hesabım rayı
     tekrarlamıyor" — bozulmayacak.
- **Kabul:**
  - Sol ray / üst özet / kart dili referansla **ölçülüp** eşitlendi (rapor tablosu)
  - Aktif plan yoksa **dürüst boş durum**, uydurma veri yok
  - Aktif plan varsa `FIT_PLAN.ozet()` değerleri ekranda **birebir**
  - `tests/plan-account.mjs` **yeşil** · banner ailesi bozulmadı
  - 9 sayfanın hepsinde konsol 0 · @390 taşma 0

---

# G · ARAMA — AJAN-F

## Madde 20 — `arama-fit-v1.html` öneri paneli beyaz kutunun ALTINA giriyor
- **Sorun:** Önerilen arama anahtarları paneli beyaz kutunun altında kalıyor —
  z-index / stacking context hatası.
- **Yapılacak:** Kök neden bulunur (`z-index` mi, `overflow:hidden` mi, yeni
  bir stacking context mi — **tahmin edilmez, DOM'da ölçülür**), düzeltilir.
  Kabuk katmanlarının z-index düzeni (header/drawer/footer perdesi) **bozulmaz**.
- **Kabul:**
  - Panel açıkken `document.elementFromPoint()` panelin **kendi** öğesini
    döndürüyor (@1440 ve @390, panelin 3 farklı noktasında)
  - Panel beyaz kutunun sınırından **taşabiliyor** (`overflow` kesmiyor)
  - Header (`z-index`) ve footer perdesi (R11) **etkilenmedi**
  - Klavye ile gezinme ve Esc çalışıyor · `tests/a11y-focus.mjs` yeşil
  - **Yeni sınama** `tests/arama-oneri.mjs` taban commit'te **kırmızı** (K27)

---

# H · ANATOMİ GÖRSELİ — LEAD (Beyar onayı bekliyor)

## Madde 21 — Detaylı, cinsiyete ayrı, etkileşimli anatomi görseli
- **Sorun:** Soldaki anatomi görseli sınırlı: `assets/svg/govde-*.svg`
  dört dosya, **14–16 tıklanabilir bölge** (toplam 28 farklı slug).
- **İstenen:** Kadın ve erkek **ayrı gövde** · çok daha **detaylı kas
  parçaları** · üstteki kas gruplarıyla **etkileşimli**.
- **Kaynaklar:** `/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf` ·
  `musclewiki.com/tr-tr` (yalnız **parçalanma mantığı**, görsel kopyalanmaz).
- **Üretim:** Higgsfield MCP (`beyarguness@gmail.com`).
- **DURUM: BEYAR'IN ONAYI BEKLENİYOR.** Onaydan önce üretim yapılmaz.
- **Bağımlı madde:** 17 (`antrenman-olusturucu` gövde görselleri aynı setten).

---

# 9 · AJAN RAPOR ŞEMASI (serbest metin kabul edilmez)

```
## Madde <n> — <başlık>
### Geçiş 1 · Kur
- frontend-design skill okundu: EVET/HAYIR + üç satır özet
- Yapılan değişiklik (dosya:satır):
- Ekran görüntüsü: <yol@1440> · <yol@390>
### Geçiş 2 · Kendi işini eleştir
- Kusur 1: <ne> → <nasıl düzeltildi> → <ölçülen önce/sonra>
- Kusur 2: ...
- Kusur 3: ...
- Ekran görüntüsü: <yol@1440> · <yol@390>
### Geçiş 3 · Referansla karşılaştır
- Referans URL + ölçülen değerler tablosu
- Referanstan zayıf kalan noktalar → nasıl kapatıldı
- Ekran görüntüsü: <yol@1440> · <yol@390>
### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
### Verilen kararlar (gerekçe + nasıl geri alınır)
### Kabukta gördüğüm ama DOKUNMADIĞIM eksikler (AJAN-A'ya)
### Bozulmadığını kanıtladıklarım
- banner ailesi 544/607/587: <ölçüm>
- R11 perdesi: <ölçüm>
- ilgili tests/*.mjs: <sonuç>
```

---

# 10 · AJAN DAĞILIMI

| Ajan | Maddeler | Dosyalar |
|---|---|---|
| **AJAN-A · Kabuk & Banner** | 1 · 2 · 3 · 4 · 5 · 6 · 7 | `fit-shell.css` · `fit-shell.js` · `programlar-merkezi` · `antrenor-detay` · `antrenman-olusturucu` (yalnız `.hr-note`) · `fit-planim-veri-izin` (tercihler) |
| **AJAN-B · Sözlük** | 8 · 9 · 10 | `sozluk-v1.html` · `sozluk-detay-v1.html` · `assets/js/sozluk-veri.js` |
| **AJAN-C · Anatomi** | 11 · 12 · 13 · 14 · 15 | `anatomi-v1.html` · `assets/js/anatomi-veri.js` |
| **AJAN-D · Oluşturucu + Plan kaydı** | 16 · 18 | `antrenman-olusturucu-v1.html` · `fit-planim-programim-v1.html` · `tasks/H3-KURALLAR.md` · `tests/plan-kayit.mjs` |
| **AJAN-E · Fit Planım** | 19 | `fit-planim-v1.html` + 8 alt sayfa |
| **AJAN-F · Arama** | 20 | `arama-fit-v1.html` · `tests/arama-oneri.mjs` |
| **LEAD** | 17 · 21 · birleştirme · commit · push · doğrulama | `assets/js/fit-plan-kayit.js` · `assets/svg/` |

**Çakışma notu:** AJAN-A ve AJAN-D ikisi de `antrenman-olusturucu-v1.html`'e
dokunuyor. AJAN-A **yalnız satır 262–267'deki `.hr-note`**'a; AJAN-D sayfanın
geri kalanına. Lead birleştirmede bu iki dokunuşu ayrı ayrı denetler.
