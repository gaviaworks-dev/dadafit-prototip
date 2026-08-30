# DadaFit · Public ↔ Admin senkron ölçümü

**Ölçüm anı:** 2026-08-30 23:27 (+03) · **git HEAD:** `87c9bf3` (çalışma
kopyası HEAD'in ÜZERİNDE — bkz. §0.2, ölçüm anında commit edilmemiş çok
sayıda değişiklik vardı).
**Yöntem:** canlı sunucudan (`http://127.0.0.1:8788/`) Playwright ile sayfa
açıp veri modüllerini `window` üzerinden okumak; grep yalnız *keşif* için
kullanıldı, hiçbir kayıt sayısı grep'ten basılmadı (`docs/lessons.md` §33).
Gömülü (`var VERI` gibi page-scoped) diziler için en az bir örnek elle
sayıldı.

---

## 0 · Ölçümden önce iki uyarı

### 0.1 · Bu belge R19'un (`docs/gastro-olcum/fit-yonetilmeyenler.md`,
2026-08-30 daha erken saat) **yeniden ölçümüdür, güncellemesi değil.**
O belgedeki hiçbir sayı buraya kopyalanmadı; her sayı bu oturumda yeniden
üretildi. Farklar §7'de.

### 0.2 · 🔴 Ölçüm ANLIK bir fotoğraftır — depo o an değişiyordu
Ölçüm başladığında admin ekranı sayısı **50**, bitene doğru **54**'tü —
başka ajanlar (A7 · A8 admin'de, lead kabukta) benimle **aynı anda**
`admin-*.html` ve bir dizi public sayfa üzerinde çalışıyordu. `git status`
ölçüm anında şunları gösterdi:

- **Admin tarafında değişen/yeni 15 dosya:** `admin-abonelikler-v1` ·
  `admin-anatomi-v1` · `admin-antrenor-form-v1` · `admin-antrenorler-v1` ·
  `admin-bildirim-form-v1` · `admin-challenge-form-v1` · `admin-destek-v1` ·
  `admin-faturalar-v1` · `admin-hareket-form-v1` · `admin-kupon-form-v1` ·
  `admin-paketler-v1` · `admin-plan-form-v1` · `admin-program-form-v1` ·
  `admin-rehber-form-v1` · `admin-reklam-*-form-v1` · `admin-rozet-form-v1` ·
  `admin-sayfa-form-v1` · `admin-sozluk-form-v1` (+ `admin-medya-v1.html`
  **silinmiş**, staged).
- **Admin tarafında henüz izlenmeyen (yeni) 11 dosya:**
  `admin-abonelik-detay-v1` · `admin-anatomi-form-v1` ·
  `admin-destek-talep-v1` · `admin-fatura-detay-v1` ·
  `admin-paketler-form-v1` · `admin-sss-form-v1` · `admin-sss-konu-form-v1` ·
  `assets/js/fit-admin-abonelik-veri.js` ·
  `assets/js/fit-admin-antrenor-veri.js` ·
  `assets/js/fit-admin-destek-veri.js` · `assets/js/fit-sss-veri.js`.
- **Public tarafında da 20+ dosya değişiyordu**: `antrenor-detay-v1` ·
  `antrenor-ol-v1` · `antrenor-panelim-v1` · `challenge-v1` ·
  `destek-talebi-detay-v1` · `destek-v1` · `egzersizlerim-v1` ·
  `fit-planim-veri-izin-v1` · `fit-testi-detay-v1` · `fit-testleri-v1` ·
  `giris-v1` · sekiz `hareket-*` rehber sayfası · `hesabim-v1` ·
  `odemelerim-v1` · `pro-odeme-v1` · `profil-v1` · `programlarim-v1` ·
  `reklam-ver-v1` — ve kabuk dosyaları `fit-admin.css` · `fit-admin.js` ·
  `fit-fatura.js` · `fit-rozet.js` · `fit-shell.js`.

**Sonuç:** aşağıdaki sayılar §2 (veri modülleri) ve §4 (sidebar) için sağlam —
tarayıcıda gerçekten çalıştırılıp okundu. §5'teki bazı gömülü-içerik
sayıları (rehber `<li>`, S.S.S. gömülü blok, program hafta/gün satırı gibi)
**R19'dan taşındı** çünkü onlar aynı anda düzenlenen dosyaların içindeydi;
her biri işaretlendi. Beyar bu belgeyi okurken not: bir sayı "değişmiş"
görünüyorsa depo bu ölçümden sonra da hareket etmiş olabilir — kanıt her
zaman `dosya:satır` ya da bir tarayıcı komutuyla yeniden üretilebilir.

---

## 1 · Kaba hatlar

| Ölçüm | R19 (daha erken, 2026-08-30) | Bu ölçüm (2026-08-30 23:27) |
|---|---:|---:|
| Public HTML | 54 | **54** (değişmedi) |
| Admin HTML | 21 | **54** (+33, aynı gün içinde) |
| Toplam HTML | 75 | **108** |
| Veri modülü (`assets/js/fit-*-veri.js` + `anatomi-veri` + `sozluk-veri`) | ~9 | **16** (+7: `fit-admin-abonelik-veri` · `fit-admin-antrenor-veri` · `fit-admin-bildirim-veri` · `fit-admin-destek-veri` · `fit-admin-uye-veri` · `fit-il-veri` · `fit-medya-veri` · `fit-reklam-veri` · `fit-sss-veri` — bir kısmı bu oturumda hâlâ `git status`ta `??`) |
| `admin-medya-v1.html` | yok (plan aşamasında) | **BEYAR KARARIYLA SÖKÜLDÜ** — gerileme değil (bkz. §3.9) |

---

## 2 · Veri modülleri — canlı sayım (tarayıcıda `window.*` okundu)

| Modül | Kayıt | Alan/kayıt | Okuyan public sayfa | Yöneten admin ekranı | Panel GERÇEKTEN mi okuyor |
|---|---:|---:|---|---|---|
| `sozluk-veri.js` | **254 terim · 10 kategori · 29 harf** | 9 | `sozluk-v1`, `sozluk-detay-v1`, `hareket-sozluk-v1` | `admin-sozluk-v1` + `admin-sozluk-form-v1` | ✅ **EVET** — ikisi de `sozluk-veri.js`i yükler |
| `anatomi-veri.js` | **31 kas · 12 hareket · 4 harita** | — | `anatomi-v1` | `admin-anatomi-v1` + `admin-anatomi-form-v1` | ✅ EVET (ekranda 1 konsol hatası: `kapat is not defined` — R19'dan sonra doğan, muhtemelen şu an düzeltiliyor) |
| `fit-rozet.js` | KATALOG **50** · AILELER **9** · KADEMELER **8** | 9/2/5 | `rozetlerim`, `challenge*`, `egzersizlerim`, `hesabim` | `admin-rozetler-v1` + `admin-rozet-form-v1` | ✅ EVET |
| `fit-challenge.js` | KATALOG **3** | 14 | `challenge-merkezi`, `challenge`, `challengelarim`, `egzersiz-detay`, `programini-bul` | `admin-challenge-v1` + `admin-challenge-form-v1` | ✅ EVET |
| `fit-paket.js` | KADEMELER **3** · GRUPLAR **7** (30 modül × 3 = 90 hücre) | 12/hücre | `pro`, `pro-odeme`, `paketlerim`, `odemelerim` | `admin-paketler-v1` (267 alan!) + `admin-paketler-form-v1` | ✅ EVET |
| `fit-fatura.js` | DEFTER **10 fatura** | 13 | `odemelerim`, `destek`, `antrenor-detay` | `admin-faturalar-v1` + `admin-fatura-detay-v1` + `admin-odemeler` + `admin-abonelikler` + `admin-hizmetler` (okuma) | ✅ EVET (6 ekran aynı deftere bakıyor) |
| `fit-ulke.js` | **199 ülke** | 3 | `giris`, `hesabim`, `odemelerim` | — | 🔴 YOK (ama bu bir "içerik" değil, alan-seçici referans verisi; Gastro'da da eşi yok) |
| `fit-il-veri.js` | **81 il** | 3 | (yalnız admin formunda kullanılıyor) | `admin-antrenor-form-v1` (adres alanı) | n/a — zaten admin'in kendi altyapı verisi |
| `fit-medya-veri.js` | **85 görsel · 9 klasör** | kullanım + sayfa listesi gerçek | (public'te doğrudan görünmüyor, admin form resim seçicisi) | 10 form ekranında `FIT_ADMIN.medya()` modalı okuyor; **bağımsız kütüphane ekranı (`admin-medya-v1.html`) YOK — silinmiş** | 🟡 YARI — veri canlı okunuyor ama "gözat/düzenle" yüzeyi yok (§3.9) |
| `fit-reklam-veri.js` | FORMAT **8** · ALAN **10** · **ESLEME 8** (köprü) | 7/10/3 | `reklam-ver` (FORMAT ile satıyor) | `admin-reklam-v1` + `admin-reklam-alan-form-v1` + `admin-reklam-kampanya-form-v1` | ✅ EVET — R19'da "kesişim 0" denen iki sözlük artık `ESLEME` ile köprülü |
| `fit-sss-veri.js` | SSS **24** · KAT **6** · KONU **5** | soru+cevap+kategori | — (public `destek-v1.html` **kendi gömülü** `.qa` bloklarını kullanıyor, bu modülü YÜKLEMİYOR) | `admin-sss-v1` + `admin-sss-form-v1` + `admin-sss-konu-form-v1` | 🟡 **YARI — KOPYA.** Sayılar (24/6) public'in gömülü S.S.S.'iyle bugün aynı ama **aynı kaynaktan gelmiyor**; biri değişirse öteki sessizce ayrışır (bu deponun üç kez temizlediği "aynı soruya iki cevap" deseni) |
| `fit-admin-uye-veri.js` | **14 üye** | çok alan (detay ekranı 11 kart) | — (admin'e özel) | `admin-uyeler-v1` (liste) + `admin-uye-detay-v1` (künye·abonelik·içerik·rozet·destek·işlem geçmişi·yetki) | n/a — zaten admin verisi; ama detay ekranı `dm_user`/`dm_fit` şemasında OLMAYAN alanları dürüstçe "—" bırakıyor |
| `fit-admin-bildirim-veri.js` | **11 şablon** | — | — | `admin-bildirim-v1` + `admin-bildirim-form-v1` | n/a |
| `fit-admin-abonelik-veri.js` | **10 abonelik kaydı** | — | — | `admin-abonelikler-v1` | n/a |
| `fit-admin-antrenor-veri.js` *(bu oturumda hâlâ `??`, mid-edit)* | 152 satır, henüz hangi ekrana bağlandığı doğrulanamadı | — | — | `admin-antrenorler-v1` (grep ile tespit edildi) | ⚠️ **doğrulanamadı — dosya ölçüm sırasında yazılıyordu** |
| `fit-admin-destek-veri.js` *(bu oturumda hâlâ `??`, mid-edit)* | 72 satır | — | — | `admin-destek-v1`, `admin-destek-talep-v1` | ⚠️ **doğrulanamadı — mid-edit**; `admin-destek-v1.html` ölçüm anında `TEMSILCI is not defined` konsol hatası veriyordu |
| `fit-admin-veri.js` | HAREKET 25 · SOZLUK(taksonomi) · TEST 7 · PROGRAM 9 · PROGRAM_DETAY 4 · HEDEF 8 · SAYFA 54 | — | — | `admin-hareketler`, `admin-programlar`, `admin-testler`, `admin-taksonomi`, `admin-sayfalar`, `admin-program-kurgu` | n/a — bu R19'da da vardı, değişmedi |

**fit-su.js sabitleri** (`DK_BASINA_ML`, `KCAL_BASINA_ML`, `EK_TAVAN_ML`,
`EK_ADIM_ML`) — R19'da "4/4 eksik, K13 ihlali" idi. Şimdi **3/4 panelden
okunuyor**: `admin-ayarlar-v1.html` üç sabiti gerçek alan olarak gösteriyor;
dördüncüsü (`EK_ADIM_ML`) modülde var ama dışa verilmediği için ekran
dürüstçe "—" basıyor, uydurmuyor (`admin-ayarlar-v1.html:1206`). **→ YARI
YÖNETİLİYOR, kapanmaya en yakın kalemlerden biri.**

**fit-mesaj.js** (üye⇄antrenör mesajlaşması, `DEMO` 3 kayıt + localStorage)
— hâlâ hiçbir admin ekranı bu modülü okumuyor. `admin-moderasyon-v1.html`
artık `tur:'mesaj'` bildirimleri **taşıyor** (moderasyon kuyruğunda mesaj
şikâyeti kategorisi var) ama bu, `fit-mesaj.js`in kendi kaydını görmek
değil — moderasyonun **kendi örnek** kuyruğu. **→ hâlâ 🔴 YÖNETİLMİYOR**,
kapsamı yalnız kısmen örtüşüyor (bkz. §5).

---

## 3 · Panel gerçek mi okuyor — `.adm-src` şeridi denetimi

Brifin istediği gibi şeride güvenilmedi, her satır kaynağıyla karşılaştırıldı.

| # | Ekran | Şerit diyor ki | Ölçülen gerçek | Şerit doğru mu |
|---|---|---|---|---|
| 3.1 | `admin-sozluk-v1` | is-canli | `sozluk-veri.js`i gerçekten yüklüyor, 254/10/29 tutuyor | ✅ doğru |
| 3.2 | `admin-anatomi-v1` | is-canli | `anatomi-veri.js` gerçek, ama sayfa konsola hata veriyor | ✅ veri doğru, ekran kırık (ayrı sorun) |
| 3.3 | `admin-sss-v1` | is-ornek | `fit-sss-veri.js`den okuyor AMA bu modül public'in gerçek S.S.S. bloğunun **kopyası** | ✅ doğru — "örnek" demesi dürüst, "canlı" deseydi yalan olurdu |
| 3.4 | `admin-yasal-v1` | is-ornek | Kendi `var L` dizisi (11 belge, her biri için h3/p/li/karakter sayımı — mekanik üretilmiş görünüyor) taşıyor, `yasal-v1.html`i yüklemiyor | ✅ doğru — kopya olduğunu saklamıyor |
| 3.5 | `admin-menu-v1` | (kaynak notu var) | `FIT_SHELL.menu()` ucundan **gerçekten** okuyor; R19'daki 46 satırlık özel kopya **silinmiş** | ✅ **düzeldi** — C-10 kapandı |
| 3.6 | `admin-reklam-v1` | is-canli | `fit-reklam-veri.js`; `ESLEME` public'in 8 formatını admin'in 10 alanına bağlıyor | ✅ doğru, C-7 kapandı |
| 3.7 | `admin-hareket-form-v1` | is-ornek | `adimlar`/`ipuclari` için gerçek repeater var (`repeater()` fonksiyonu, satır 458+) | ✅ doğru — "yeni kayıt" formu olduğu için örnek/boş başlıyor, ama alan artık VAR (C-1 kapandı) |
| 3.8 | `admin-test-form-v1` | is-ornek | `adimlar`, `uygun`, `uygunDegil`, `ekipman` alanları forma eklenmiş | ✅ doğru, C-9'un 11 eksik alanı forma girdi |
| 3.9 | **`admin-medya-v1.html`** | — | **Bilerek söküldü (Beyar kararı, 2026-08-30).** `fit-medya-veri.js` (85 görsel · 9 klasör, `paylasik` bayrağı gerçek) hâlâ var ve form ekranlarında resim seçici modal olarak çalışıyor | ✅ **KARAR** — gerileme DEĞİL. Beyar'ın kuralı: *"Gastro'da olmayan bir şeyi kendin ekleme."* Gastro'da medya kütüphanesi ölçülerek arandı ve yok: `media-library\|MediaLibrary\|media.index` → 1 isabet, o da `<meta name="media-max-size">` (yükleme sınırı); sidebar'daki tek "medya" satırı `admin.moderation.media.index` = moderasyon kuyruğu, kütüphane değil; formlarda görsel `<x-admin.image-upload>` ile doğrudan yükleniyor, "kütüphaneden seç/yeniden kullan/klasörle" kavramı yok. Beyar'ın talimatı birebir: *"sidebar'dan kalksın, form içinde açılan bileşen olarak kalsın."* Sidebar kaydı + Genel Bakış hızlı-erişim kartı kaldırıldı, ekran silindi (iki girişi de kalkınca erişilemez sayfa olurdu), modal ve veri modülü duruyor. ⚠ `fit-admin-plan.md` §11/D3 bu kararla **geçersizleşti**, belge güncellenmeli |
| 3.10 | `admin-antrenor-form-v1` | is-ornek, 48 alan | `antrenor-detay-v1.html`'in 12 kayıtlık `VERI` haritası hâlâ ayrı; bu form üye başına künyeyi genişletmiş ama **antrenör listesi (8 kart) ile detay haritası (12 kayıt) arasındaki R19'dan beri süregelen 8≠12 uyuşmazlığı hâlâ duruyor** | — |

---

## 4 · Sidebar — canlı sayım (`admin-v1.html` → `#saMnav`, tarayıcıdan)

**24 benzersiz hedef ekran** (bazı üst kalemler aynı dosyaya iki adla
bağlanıyor — ör. "Hareket Kütüphanesi" ve "Egzersizler" ikisi de
`admin-hareketler-v1.html`; "Abonelikler" bir yerde `admin-planlar-v1.html`e
bir yerde `admin-abonelikler-v1.html`e gidiyor, bu **iki farklı hedefe aynı
ad** verilmiş küçük bir kusur, ayrı not edildi):

```
Genel Bakış
ANA İÇERİK     Hareket Kütüphanesi · Rehber Sayfaları · Spor Sözlüğü ·
               Anatomi Haritası · Programlar · Fit Testleri · Challenge'lar ·
               Taksonomi · Sayfalar ve SEO
OPERASYON      Üyeler ve Yetki · Antrenörler · Moderasyon ·
               Destek Talepleri · S.S.S. · Hizmetler ve Satışlar ·
               Planlar · Abonelikler · Faturalar · Kuponlar ·
               Kazançlar ve Ödemeler · Rozetler ve Kademeler · Log Yönetimi
YAPILANDIRMA   Menü ve Navigasyon · Sponsorluk ve Reklam ·
               Paketler ve Özellikler · Bildirim Şablonları · Ayarlar ·
               Yasal Belgeler · Raporlar
```

K6'nın geri gelen abonelik kararı (`Planlar · Abonelikler · Faturalar ·
Kuponlar`) **fiilen kurulmuş** — plan belgesinin öngördüğü "~24" sayısı
tuttu.

**Sidebar'da hâlâ karşılığı olmayan** (24 kalemin hiçbirine düşmeyen)
public alanlar: Ana Sayfa (Hub) içeriği · Kurumsal metinler (Hakkımızda ·
Sağlık Bilgilendirme) gövdesi · Giriş/Kayıt ekranı metinleri · KVKK/Veri
İzin metinleri · Bağlı Uygulamalar sağlayıcı listesi · Site içi Arama
havuzu · Antrenman Oluşturucu kuralları · Programını Bul kataloğu ·
Enerji/Kalori katsayı tabloları · Mesajlaşma (ayrı yüzey olarak).

---

## 5 · Gömülü (page-scoped) içerik — R19'dan taşınan, işaretli sayılar

⚠️ Bu satırların dosyaları ölçüm anında **başka ajanlarca düzenleniyordu**
(§0.2). Sayılar R19'da doğrulanmıştı (grep hatası düzeltilmiş hâliyle);
burada **tekrar ölçülmedi**, o yüzden "R19'dan taşındı" etiketi taşıyor —
Beyar bu kalemleri kapatmadan önce tek tek yeniden ölçtürmeli.

| Kaynak | Kayıt (R19'dan taşındı) | Admin karşılığı bugün | Durum |
|---|---|---|---|
| `destek-v1.html` gömülü `.qa` | 24 S.S.S. / 6 kategori | `admin-sss-v1` var ama **kopya** modülden okuyor (§2, §3.3) | 🟡 yarı |
| `hareket-rehberi-v1` + 8 alt sayfa | 153 `<li>` · 171 `<p>` sabit blok | `admin-rehber-v1.html` **yeni** — liste ekranı var, is-ornek | 🟡 yarı — ekran doğdu, gövde metninin kendisi editöre bağlı mı doğrulanmadı |
| `program-detay-v1.html` sabit hafta/gün | 3 hafta · 4 gün · 32 hareket satırı | `admin-program-kurgu-v1.html` **yeni** — hafta→gün→hareket üç seviyeli editör, repeater doğrulandı (§3.7 benzeri desen) | ✅ **C-2 kapandı** (ekran gerçek, public'e yazmıyor ama maket-kaydet sınırı zaten tüm panelin sözleşmesi) |
| `antrenor-detay-v1.html` `VERI` | **12 antrenör** × 3 alan (bu oturumda elle sayıldı, satır 1174-1192) | `admin-antrenor-form-v1` (48 alan) var ama künye haritasıyla aynı kaynağı paylaştığı doğrulanamadı | 🟡 yarı |
| `antrenorler-v1.html` kartlar | **8 kart** (bu oturumda `grep -c` ile sayıldı, sınır karakterli desen) | aynı ekran | 🔴 **8 ≠ 12 uyuşmazlığı R19'dan beri kapanmadı** |
| `yasal-v1.html` `L` | 11 belge, 31 KB | `admin-yasal-v1` kendi 11 kayıtlık kopyasını tutuyor (§3.4) | 🟡 yarı — kopya ama dürüst |
| `dadafit-hub-v1.html` (ana sayfa) | 6 bölüm, 1.639 satır tamamı gömülü | — | 🔴 YÖNETİLMİYOR |
| `hakkimizda-v1.html` | 43 blok, 0 JS | `admin-sayfa-form-v1` "Gövde blokları" sekmesi eklemiş AMA kendi yorumu şunu söylüyor: *"sayfaların gövdesi dosyalara yazılı ve buradan yazılan hiçbir blok oraya gitmez"* (`admin-sayfa-form-v1.html:338`) | 🟡 yarı — **dürüst maket**: form var, gerçek dosyaya yazmıyor, bunu ekranın kendisi itiraf ediyor |
| `saglik-bilgilendirme-v1.html` | 41 blok | aynı (`admin-sayfa-form`) | 🟡 yarı, aynı sınırla |
| `giris-v1.html` | `LABELS`/`TITLES`/`ROLE_DEST`/`KURAL` gömülü | — | 🔴 YÖNETİLMİYOR |
| `veri-islem-kaydi-v1.html` `KAYIT` | 15 satır × 6 alan | — | 🔴 YÖNETİLMİYOR |
| `fit-planim-veri-izin-v1.html` | KVKK metinleri gömülü | — | 🔴 YÖNETİLMİYOR |
| `arama-fit-v1.html` `POOL`/`TABS`/`TYPE` | gömülü | — | 🔴 YÖNETİLMİYOR |
| `bagli-uygulamalar-v1.html` | 4 sağlayıcı, 12 kart | — | 🔴 YÖNETİLMİYOR |
| `egzersizlerim-v1.html` katsayı tabloları | `KCAL_DK`/`ADIM_DK`/`TUR`/`KAYNAK`/`MESAJ` | — | 🔴 YÖNETİLMİYOR |
| `programini-bul-v1.html` `KATALOG` | 7 × 11 alan | — | 🔴 YÖNETİLMİYOR |
| `antrenman-olusturucu-v1.html` `KURALLAR`+`HAREKET_EK` | 13 kural + 25 kayıt | — | 🔴 YÖNETİLMİYOR |
| `profil-v1.html` `COURSEDEF`/`POOL`/`MENUS`/`COVERS` | gömülü, 4.300 satır | — | 🔴 YÖNETİLMİYOR |
| `fit-testi-sonuc-v1.html` `SEVIYE`+`TESTS` | gömülü | — | 🔴 YÖNETİLMİYOR |
| `index.html` | sabit dizin | — | 🔴 (kapsam dışı — bu bir ürün sayfası değil) |

---

## 6 · localStorage — üye verisi, panelde karşılığı

Depo tarandı (literal + değişkenle atanan anahtarlar tek tek çözüldü,
grep'ten değil kaynak koddan): **26 benzersiz anahtar** bulundu — brifte
verilen 11'lik liste bir **alt kümeydi**; bu oturumda doğan/eklenen anahtar
sayısı net ölçülemedi (R19 bu tabloyu tutmuyordu, karşılaştırma yok).

| Anahtar | Ne tutuyor | Panelde kavramsal karşılığı var mı |
|---|---|---|
| `dm_fit_destek_v1` | Destek talepleri (üye tarafı) | ✅ `admin-destek-v1` — aynı kavram, ayrı örnek veri (gerçek backend gelince aynı tabloya yazarlar) |
| `dm_fit_fatura_v1`, `dm_fit_fatura_kayit_v1` | Fatura/ödeme kaydı | ✅ `admin-faturalar-v1`, `admin-odemeler-v1` |
| `dm_fit_paket_hakki_v1` | Antrenörden alınan paket hakkı | ✅ `admin-hizmetler-v1` (satın alımlar) |
| `dm_fit_rozet_v1` | Kazanılan rozetler | ✅ `admin-uye-detay-v1` "Rozet ve kademe" sekmesi | 
| `dm_fit_su_v1` | Su takibi | 🔴 yok |
| `dm_fit_test_v1` | Fit testi SONUÇLARI (üyenin girdiği) | 🔴 yok — `admin-testler` yalnız test KATALOĞUNU yönetiyor, kimin hangi sonucu aldığını gösteren ekran yok (C-9 hâlâ açık) |
| `dm_fit_kayit_v1` | Fit Planım — loglanan antrenmanlar | 🔴 yok |
| `dm_fit_mesaj_v1` | Üye⇄antrenör mesajları | 🔴 yok (bkz. §2 mesaj notu) |
| `dm_fit_hesap_v1` | Hesap ayarları (kart vb.) | n/a — özel/gizli veri, panelde olmaması doğru |
| `dm_fit_izin_v1` | KVKK rıza kaydı | 🔴 yok |
| `dm_fit_faydali_v1`, `dm_fit_kcal_hidden`, `dm_fit_aktivite_sil_v1`, `dm_fit_recent`, `dm_fit_challenge_v1`, `dm_fit_ex` | küçük UI tercihleri/etkileşim izleri | n/a — panel düzeyinde anlamlı değil |
| `dm_user`, `dm_fit`, `dm_auth`, `dm_business`, `dm-cookie-consent` | oturum/profil/rıza | ✅ `admin-uyeler` + `admin-uye-detay` künye sekmesi kavramsal karşılığı |

---

## 7 · R19'a göre fark — ne kapandı, ne hâlâ açık

### Kapanan (R19'da 🔴/eksik idi, bugün ekranı var ve gerçek veri okuyor)
1. **Spor Sözlüğü** (254 terim) — `admin-sozluk-v1`+form, canlı.
2. **Anatomi haritası** (31/12/4) — `admin-anatomi-v1`+form, canlı (küçük konsol hatası hariç).
3. **Menü kopyası sorunu** — `FIT_SHELL.menu()` ucu açıldı, 46 satırlık özel kopya silindi.
4. **Reklam envanteri iki dil konuşuyordu** — `ESLEME` köprüsüyle birleşti.
5. **Rozet ekleme formu yoktu** — `admin-rozet-form-v1` (14 alan) doğdu.
6. **Hareket anlatımı (200 metin) düzenlenemiyordu** — `admin-hareket-form-v1`de gerçek adım/ipucu repeater'ı var.
7. **Test detay alanları (11 eksik)** — `admin-test-form-v1`e `adimlar`/`uygun`/`ekipman` eklendi.
8. **Program kurgusu (hafta/gün/hareket) hiç yönetilmiyordu** — `admin-program-kurgu-v1` üç seviyeli editör.
9. **K6 abonelik dörtlüsü (Planlar·Abonelikler·Faturalar·Kuponlar) yoktu** — dördü de kuruldu.
10. **fit-su.js sabitleri koda gömülüydü (K13 ihlali)** — 3/4'ü artık `admin-ayarlar`dan okunuyor.
11. **Üye detayında yalnız 2 alan düzenlenebiliyordu** — `admin-uye-detay-v1` 11 karta çıktı (abonelik, içerik, rozet, destek, işlem geçmişi dahil).

### Kaçırılan / gerileyen
- **`admin-medya-v1.html` bilerek söküldü — Beyar kararı, gerileme değil.**
  Gerekçe ve ölçüm §3.9'da. Veri modülü (`fit-medya-veri.js`, 85 görsel) hâlâ var ve form
  seçicilerinde çalışıyor ama bağımsız kütüphane ekranı yok — plan belgesi
  bunu hâlâ "kuruldu" diye anlatıyor, gerçek depo öyle demiyor.
- **Antrenör listesi (8) ile antrenör haritası (12) arasındaki uyuşmazlık**
  R19'dan beri kapanmadı; yeni antrenör formu (48 alan) bu iki kaynağı
  birleştirmedi.
- **S.S.S. artık bir ekrana sahip ama gerçek kaynağı değil kopyasını
  okuyor** — "yönetiliyor" görünümü var, altında hâlâ "aynı soruya iki
  cevap" riski duruyor.
- **Yasal belgeler** de aynı desende: ekran var, ama public'in gerçek
  gövdesini değil kendi künye kopyasını yönetiyor.

### Hâlâ tamamen açık (R19'dan beri hiç dokunulmamış)
Ana sayfa (Hub) · Kurumsal sayfa gövdeleri (kısmi, dürüst-maket) · Giriş
ekranı metinleri · KVKK/Veri İzin metinleri · Bağlı Uygulamalar · Arama
havuzu · Antrenman Oluşturucu kuralları · Programını Bul kataloğu · Enerji
katsayı tabloları · Mesajlaşma · Fit testi SONUÇLARI (kimin ne aldığı) ·
`fit-ulke.js` (199 kayıt, ama bu bir içerik değil).

---

## 8 · YÖNETİLMEYENLER — net liste

| # | Ne | Kaç kayıt | Hangi ekran gerekir | Neden bugüne kadar yok |
|---|---|---:|---|---|
| 1 | Ana sayfa (Hub) içeriği | 6 bölüm / 1.639 satır | "Ana Sayfa İçeriği" bloklu editör | Sidebar planı hiç bu kalemi içermedi (§4) |
| 2 | Kurumsal sayfa gövdeleri (Hakkımızda·Sağlık) | 84 blok | `admin-sayfa-form`daki "Gövde blokları" sekmesi gerçek dosyaya yazmıyor, kendi de söylüyor | Statik dosyaya geri yazan bir mekanizma (build adımı) bu depoda YOK — buildless karar (`CLAUDE.md`) |
| 3 | Giriş/Kayıt ekranı metinleri | `LABELS`/`TITLES`/`ROLE_DEST`/`KURAL` | Ayrı bir "Kimlik ekranı metinleri" ekranı | Hiç planlanmadı |
| 4 | KVKK / Veri İzin metinleri | `fit-planim-veri-izin-v1` gömülü | "Yasal Belgeler"e üçüncü tür olarak eklenebilir | `admin-yasal` yalnız 11 "belge" tipini biliyor, bu bir form-ekranı metni |
| 5 | Fit testi SONUÇLARI (kim, ne aldı) | `dm_fit_test_v1` (üye başına) | Raporlar'a ya da üye detayına "Test sonuçları" kartı | `admin-raporlar`ın İçerik sekmesi yalnız test KATALOĞUNU sayıyor, sonuçları değil |
| 6 | Bağlı Uygulamalar sağlayıcı listesi | 4 sağlayıcı, 12 kart | "Entegrasyonlar" ekranı | Hiç planlanmadı |
| 7 | Site içi Arama havuzu | `POOL`/`TABS`/`TYPE` | Arama sonuçlarının kaynağı zaten diğer modüller — ayrı ekran değil, arama motorunun kendisinin o modüllerden **derlenmesi** gerekiyor | Şu an kendi `POOL`unu elle tutuyor, otomatik türetilmiyor |
| 8 | Antrenman Oluşturucu kuralları | 13 kural + 25 kayıt eki | "Kural Motoru" ekranı | Hiç planlanmadı, karmaşık iş |
| 9 | Programını Bul kataloğu | 7 × 11 alan | "Program Bulucu" ekranı ya da `admin-programlar`a sekme | Hiç planlanmadı |
| 10 | Enerji/Kalori katsayı tabloları | `KCAL_DK`/`ADIM_DK`/vb. | `admin-ayarlar`a "Enerji hesaplama" sekmesi (fit-su örneği izlenebilir) | fit-su ile aynı turda ele alınmamış |
| 11 | Mesajlaşma (`fit-mesaj.js`) | DEMO 3 + üye verisi | "Mesaj Denetimi" ekranı ya da moderasyonun mesaj kuyruğunun gerçek veriye bağlanması | K8 destek pilotu Diet'te; mesaj ayrı konu, hiç ele alınmadı |
| 12 | Antrenör listesi↔haritası uyuşmazlığı | 8 ≠ 12 | Tek kaynak (muhtemelen `fit-admin-antrenor-veri.js`, şu an mid-edit) | R19'dan beri açık, bu turda da kapanmadı |
| 13 | `fit-ulke.js` (199 kayıt) | 199 | Muhtemelen gerekmez (Gastro'da da yok) | Düşük öncelik, altyapı verisi |

**Toplam ölçülen public varlık:** 16 veri modülü + ~20 gömülü-içerik sayfası
+ 26 localStorage anahtarı ≈ **60+ kalem**. Bunların **11'i** bu turda
tamamen kapandı (§7), **6-7'si** yarı-yönetiliyor (kopya veri ya da yazma
yüzeyi gerçek dosyaya gitmiyor), **13 kalem** listede yukarıda hâlâ tam
YÖNETİLMİYOR.

---

## 9 · Ölçüm komutları (yeniden üretim)

```bash
cd /Users/gaviaworks/Developer/Projects/dadafit-prototip
ls -1 *.html | grep -v '^admin-' | wc -l     # 54 public
ls -1 admin-*.html | wc -l                    # admin sayısı — HAREKETLİ, tekrar ölç
git status --short                            # kimin ne düzenlediğini gör

# Bir veri modülünü canlı say (örnek: sözlük):
PW_HOME=~/.pw node -e "
import('/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs').then(async ({chromium})=>{
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8788/sozluk-v1.html',{waitUntil:'load'});
  console.log(await p.evaluate('window.SOZLUK.TERIMLER.length'));
  await b.close();
});"

# Sidebar'ı canlı oku:
# admin-v1.html'i aç, #saMnav a elemanlarını topla (bkz. bu oturumun a11-sidebar.mjs betiği)
```
