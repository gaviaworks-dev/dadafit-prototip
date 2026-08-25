sozlesme v2.5 · 2026-08-26

# Hesap Sözleşmesi — dört marka

🔴 **BU DOSYA DÖRT DEPODA BİREBİR AYNIDIR.** (K10)
`dadagastro` · `dadadiet` · `dadagourmet` · `dadafit-prototip`

Ortak depo, symlink ve dış yol bağımlılığı **yoktur** — her şerit kendi
ağacındaki bu dosyayı okur. Değiştiren, **dördünü birden** değiştirir ve
yukarıdaki sürüm damgasını yükseltir. Sapma her dalga sonunda `md5` ile
ölçülür.

**v2.4 → v2.5:** §7.4'ün denetim kuralı iki yöne ayrıldı —
defterde olup kodda niteliği olmayan kalem ihlal değildir (yokluk kaydı).

**v2.3 → v2.4:** §7.4 eklendi — yer tutucu içerik kuralı
(`data-yer-tutucu` + `docs/icerik-bekleyen.md`, tek defter).

**v2.2 → v2.3:** §7 eklendi — hesap arayüz yapısı (P12, kanon Diet)
ve kanonun iki esnetilmiş kalemi (başlık öğesi · açıklama satırı).
⚠ §6 renumber EDİLMEDİ; birden çok belge ona atıf yapıyor.

**v2.1 → v2.2:** §3.1'in Gourmet satırı, `ayarlar`ın ikinci adres
gramerini de alacak biçimde tamamlandı (B8).

**v2 → v2.1:** §2.4'teki yanlış bir ölçüm şerhi düzeltildi (Gourmet ·
`VenueApplicationStatus`); başka değişiklik yok.

**v1 → v2:** iskelet dolduruldu. Kaynak: Dalga 1'in dört şerit ölçümü
(`docs/sozlesme-olcum-<marka>.md`), birleşimi
`dadagastro/docs/hesap-mimarisi/10-dalga1-sonuc.md`, önerisi
`…/11-sozlesme-v2-onerisi.md`. Beyar onayı: 2026-08-25 (Dalga 2 açılışı).

Kararların gerekçesi: `dadagastro/docs/hesap-mimarisi/08-kararlar.md`
(K1–K16 · P1–P10). Uygulama sırası: `…/09-uygulama-plani.md`.

---

## 🔴 BU BELGE NASIL UYGULANIR — üç kural

**U1 · Hüküm varsa tartışılmaz.** "ORTAK HÜKÜM" yazan her satır dört depoda
uygulanır. Uymayan depo uyar; sözleşme depoya göre esnetilmez.

**U2 · 🔴 AÇIK yazan yerde YAKINSAMA YAPILMAZ.** Bir bölüm `AÇIK` ya da
`ÇATIŞMA` işaretliyse o konuda **karar verilmemiştir**. Şerit orada kendi
markasının **bugünkü şeklini korur**, diğer markaya benzetmeye çalışmaz,
yeni bir şekil uydurmaz. Kapanmamış bir başlığa dayanarak migration
yazılmaz.

**U3 · Ölçüm kanıtlıdır.** Bu belgedeki her "bugün şöyle" cümlesi Dalga 1'de
`dosya:satır` kanıtıyla ölçülmüştür. Bir şerit ölçümün yanlış olduğunu
görürse **DURUR ve raporlar** — belgeyi tek başına düzeltmez (K10: değiştiren
dördünü birden değiştirir).

---

## 0 · SÖZLEŞMENİN NE OLDUĞU — üç ilke

Ölçüm bunu dört depoda doğruladı: **dört depo ayrı DB, ayrı `User`, ayrı
şema** (K1). Bu yüzden sözleşme **veri paylaşmaz**; şunları bağlar:

**İ1 · Aynı kavram, aynı ad.** Dört depoda aynı işi yapan alan aynı adı
taşır. Bugünkü sapma ölçüldü: Gastro `users.status` (4 hâl DB enum'u) ·
Diet iki nullable damga (`frozen_at`, `deletion_requested_at`) · Gourmet
`status` kolonu **hiç yok** (bilinçli) · Fit maket, kolon yok.

**İ2 · Liste değil, listenin ŞEKLİ bağlanır.** Bildirim konuları, destek
kategorileri, silinebilir kayıt grupları — bunlar **markanın kendi
modüllerinden doğar**. Sözleşme "hangi konular" demez; *"konu × kanal ×
`enabled`, unique üçlü"* der. Diet'in ölçümü bu ayrımı on üç kalemde kendi
kurdu (`sozlesme-olcum-diet.md §5`, Ö1–Ö13).

**İ3 · Sayı değil, sayının TÜRETİMİ bağlanır.** Görsel en küçük kenarı
markanın kabuk genişliğinden gelir; başka markanın `--wrap`ı farklıysa sayı
da farklıdır. Sözleşme türetme kuralını yazar (CSS render genişliği esas,
**2x retina çarpımı yapılmaz** — `component-token.md §6`), sayıyı değil.

---

## 1 · Alan adları

### 1.1 · Kimlik ve profil

**ORTAK HÜKÜM.** Üye kimliği `users` tablosunda yaşar. Zorunlu ortak alanlar
(dördünde de ölçüldü ya da eksiği ölçüldü):

| Alan | Kural | Bugünkü sapma |
|---|---|---|
| `name` · `surname` | **AYRI kolonlar**, tek `name` değil | Gastro ✅ · Diet ✅ · Gourmet ✅ · Fit maket |
| `username` | `unique` | Diet'te var ama **hesap ekranından düzenlenemez** |
| `email` | `unique` | dördünde de |
| `email_verified_at` | nullable timestamp | dördünde de |
| `phone` | nullable | Gastro `string` · Diet `string(30)` |
| `avatar_path` · `banner_path` | nullable | dördünde de |

**MARKAYA BIRAKILAN.** Sağlık/beslenme/mutfak profili alanları markanın kendi
tablosundadır, `users`ta değil (Diet emsali: `diet_health_profiles`).
Doğum tarihi · cinsiyet · biyografi: Gastro'da `users`ta, Diet'te **yok**.

🔴 **AÇIK — sözleşmeye girecek mi:** `username` **değişim sınırı ve eski
slug'ın tutulması**. Bugün dört markanın hiçbirinde yok; Gourmet ölçümü bunu
boşluk olarak kaydetti (B7): sınırsız değiştirilebiliyor, eski slug
tutulmuyor, yönlendirme yok.

### 1.2 · Güvenlik ve oturum

**ORTAK HÜKÜM — üç kalem, dördünde de bulunacak:**

1. **2FA üç kolon:** `two_factor_secret` · `two_factor_recovery_codes` ·
   `two_factor_confirmed_at` (nullable). **Üyeye açık olacak.**
   Bugün: Gastro ✅ · Diet ✅ (üye yüzeyinde açık) · **Gourmet 🔴
   `can:access-admin` kapısının arkasında** · Fit maket.
2. **Oturum içi şifre değiştirme ucu.** Bugün: Gastro ✅ · Diet ✅
   (`PUT /hesabim/sifre`) · **Gourmet 🔴 YOK** · Fit maket.
3. **Açık oturumlar listesi + "diğerlerini kapat".** Bugün: Gastro ✅ ·
   Diet ✅ · **Gourmet 🔴 YOK** · Fit maket.

**ORTAK ŞERH (Gastro emsali, bağlayıcı):** açık oturum listesi yalnız
`session.driver = database` iken üretilebilir; aksi hâlde **sahte satır
basılmaz**, ekran "tutulmuyor" der.

**MARKAYA BIRAKILAN.** Giriş/cihaz geçmişi tablosunun adı ve alanları
(Gastro `login_logs` · Diet `diet_login_events`). Ortak olan: **satırlar
silinmez**, ekranda basılan satır sayısı sınırlıdır ve bu bir arşiv ekranı
değildir (Diet: 20 satır, sayfalama bilerek yok).

### 1.3 · Gizlilik

🔴 **ÇATIŞMA — Beyar kararı gerekiyor.** İki eksen ölçüldü ve **birbirinden
ayrı**:

| Eksen | Gastro | Diet | Gourmet | Fit |
|---|---|---|---|---|
| **KVKK ekseni** (veri indir · izin · hesap sil) | ✅ `user_consents` · `consent_logs` | ✅ `diet_data_requests` · `diet_data_consents` | ✅ (yalnız bu) | maket |
| **Görünürlük ekseni** ("profilim kime görünsün") | ✅ `user_preferences.privacy` — **6 anahtar** | 🔴 **YOK** (grep 0 eşleşme) | 🔴 **YOK** (B1) | maket |

Gastro'nun altı anahtarı: `profile_visibility` (`public`·`private`·
`followers`) · `show_email` · `show_phone` · `show_tried` · `followers_public`
· `search_indexable`.

**Ölçümün şerhi:** Gastro'nun kendi kodu son üçü için *"gerçek depolanır,
tüketimleri ayrı dilim adayı"* diyor — yani yazılıyor, henüz her yerde
uygulanmıyor.

⚠ **Görünürlük ekseni sözleşmeye girerse Diet ve Gourmet'e YENİ İŞ doğar.**
Ve Diet'te `show_tried` gibi alanların karşılığı bir **ürün kararıdır**,
uydurulamaz (`01 §O4` şerhi hâlâ geçerli).

**ORTAK HÜKÜM (çatışmadan bağımsız, dördü için önerilir):** izin kaydı
**silinmez, damgalanır** — Diet'in `revoked_at` deseni
(*"geri alma eyleminin kendisi de kayıttır"*). Bu, §1.8'deki `earned_at`
refleksiyle aynı ilkedir ve üç depoda bağımsız doğmuştur.

### 1.4 · Bildirim tercihleri

🔴 **İKİ FARKLI ŞEKİL ÖLÇÜLDÜ — sözleşme birini seçmeli.**

| | Gastro | Diet |
|---|---|---|
| Şekil | `user_preferences.notification_prefs` **tek JSON kolon** | `diet_notification_prefs` **ayrı tablo**, `unique(user_id, topic, channel)` |
| Konu sayısı | 6 | 9 (+1 liste dışı) |
| Kanal | 2 (`email` · `push`) | şemada 3, ekranda 2 |
| Varsayılan | — | **kodda durur, tabloya yazılmaz** |

Gourmet'te tercih yalnız **e-postayı** süzüyor, uygulama içi bildirim
süzülmüyor (B6). Fit'te maket.

**ÖNERİLEN ŞEKİL — 🔴 KARAR VERİLMEDİ (§6 · açık nokta 2). U2 geçerli:
kimse bugünkü şeklini bu yüzden değiştirmez.** (şekil, liste değil — İ2):
`topic × channel × enabled`, `unique(user_id, topic, channel)`, tanınmayan
konu/kanal **atlanır, satır silinmez**, yazma **tam durum kaydıdır**
(gönderilmeyen kutu açıkça `false` yazılır).

⚠ **Gastro'nun ölçülmüş üretim kusuru sözleşmeye şerh olarak girmeli:**
`(bool)` cast'i zorunludur — `'1'` string'i `=== true` kıyasını yalanlamıştı
(2026-07-26).

🔴 **ORTAK HÜKÜM ADAYI — güvenlik bildirimi matrisin DIŞINDADIR.** Diet
emsali (`GUVENLIK_KONUSU = 'supheli-giris'`): *"yoksa kullanıcı güvenlik
uyarısını kampanya e-postasıyla aynı ızgarada görürdü."* Bu bir ürün
ilkesidir ve dördüne uygulanabilir.

⚠ **Ölçülen ortak borç:** Diet'te **gönderen taraf yok** — üye anahtarı
açıyor, hiçbir şey gönderilmiyor. Aynı boşluk Fit'te maket düzeyinde.

### 1.5 · Ödeme yöntemi ve fatura

**ORTAK HÜKÜM.** **Kart verisi uygulamada tutulmaz** — yalnız `gateway` ·
`token` · `last4` · `brand` · `exp_month` · `exp_year` · `is_default`.
Tutarlar **kuruş** cinsinden tamsayıdır (Gastro emsali).
Webhook kaydı `unique(gateway, event_id)` ile idempotenttir.

**MARKAYA BIRAKILAN.** Fatura numarası kalıbı ve vergi alanları.

⚠ **Ölçülen boşluk:** Gastro'da **kart ekleme ucu yok** — blade'de
`disabled title="Yakında"`, sunucu tarafında kapı yok çünkü uç da yok.
Diet'te aynı boşluk **politika olarak** ifade edilmiş
(`DietPaymentMethodPolicy::create() → false`). **Sözleşme bu iki dili
tekleştirmeli:** yok olan yetenek Policy'de `false` döner, blade'de
"Yakında" yazmaz.

🔴 Gourmet'te ödeme kavramı **hiç yok** (K15 gereği bu turda da kurulmaz).

### 1.6 · Üyelik ve paket

**ORTAK HÜKÜM (P1 · P8):** paket adları dört markada birebir aynıdır —
**Ücretsiz · Pro · Pro Max AI.** Marka adı yalnız önektir.

**ORTAK HÜKÜM (Gastro emsali):** **Ücretsiz paket bir satır değildir** —
plansızlık t0'dır.

**ORTAK HÜKÜM (P6):** kullanım kotaları **koda gömülmez**, ayardan okunur.
Emsal ölçüldü: Gourmet'in `max_waypoints = 5` değeri `settings` tablosundan,
yoksa `config`ten okunuyor — **desen hazır.**

✅ **KAPANDI — P8 (Beyar kararı, 2026-08-25).** Ad alanı **tektir ve
istisnasızdır**. Gastro'nun `pro-plus` ve `pro-max` basamakları, Diet'in
`PRO_MAX` sabiti ve Fit'in `pro_max` maketi bu üçlüye **yeniden oturtulur**.
Gerçek abone ve gerçek ödeme yok → **göç akışı yazılmaz.**

🔴 **Antrenör/diyetisyen hizmet paketi bir PLATFORM paketi DEĞİLDİR.** Adı bu
üçlüyle çakışıyorsa **değiştirilir** (P5 · P7/2). Platform paketi ile hizmet
paketi iki ayrı kutudur ve aynı ad alanını paylaşmaz.

✅ **KAPANDI — P7 (Beyar kararı, 2026-08-25).** Para ilişkileri **kapalı
listedir**:

| # | İlişki | Nerede |
|---|---|---|
| 1 | **Platform paketi** (Ücretsiz · Pro · Pro Max AI) | **dört markada** |
| 2 | **Hizmet alımı** — antrenör (Fit) · diyetisyen (Diet); komisyonlu (K13) | Diet · Fit |
| 3 | **Üyeden üyeye abonelik** | 🔴 **YALNIZ GASTRO** |

**Fit'te platform paketi VAR, hizmet alımı VAR, üyeden üyeye abonelik YOK** —
maketteki ₺49 Patreon yapısı sökülür. Diet'te de kurulmaz.
Bu, §1.6'nın "MARKAYA BIRAKILAN" maddesini de bağlar: **polymorphic
`subscribable` şekli yalnız Gastro'nun gereğidir**, diğer üçünde düz FK
yeterlidir.

**MARKAYA BIRAKILAN.** Abonelik tablosunun şekli. Ölçülen iki şekil:
Gastro **tek tablo + polymorphic `subscribable`** (platform planı VEYA
creator planı) · Diet **düz FK `plan_id`**. Gastro'nun şekli K4'ün "üye üyeye
abone olur" modelinin gereğidir; Diet'te o model yok.

### 1.7 · Destek

**ORTAK HÜKÜM: KANON DIET'TEDİR** (K8). Tam metin dört depoda
`docs/destek-kanonu.md` olarak **kopyalanacaktır** (Dalga 3).

Sözleşmeye giren çekirdek:

| Kalem | Hüküm |
|---|---|
| Tablo sayısı | **İki** — talep + mesaj. Tek tablo yeterli değildir (Gastro bugün tek tablo, yazışma tutmuyor) |
| Durum | `SupportStatus` enum'u, **geçişler enum'da** (`canTransitionTo()`), controller'da değil |
| Yanıt kabulü | `acceptsReply()` durumdan türetilir |
| Talep numarası | `reference`, `unique`, kalıp `<marka>-<yıl>-<6 karakter>`; alfabeden karışan karakterler çıkarılır |
| Silme | `delete()` **iki Policy'de de `false`** |
| Ek dosya | **mesaj başına**, talep başına değil |
| Kategori | **markanın modüllerinden türetilir** (İ2) — liste bağlanmaz |

✅ **KAPANDI — P9 (Beyar kararı, 2026-08-25).** **Kanon dörttür:**
`açık` · `yanıt bekleyen` · `çözülen` · `kapatılan`. Diet'te bugün iki durumu
hiçbir kod yolunun yazmıyor olması dondurmayı **engellemez**; eksik iki geçiş
**Dalga 3'te** kurulur.
🔴 **AÇIK — Y8.5:** Fit'in "Taleplerin" ve "Beklerken" kalemleri girecek mi.
🔴 **AÇIK — D4:** "yeniden aç" girecek mi (çıkarılırsa `Kapatilan` terminal
olur). **D6:** `priority` girecek mi (Gastro'da var, Diet'te yok).
🔴 **AÇIK — ÇAT-8:** `brand` kolonu. Ayrı DB'de karşılığı ölçülemedi.

### 1.8 · Rozet ve kademe

**ORTAK HÜKÜM (K2):** her marka **kendi rozetlerini ve kademe merdivenini
kendi deposunda** kurar. **`brand` kolonu yoktur.** Gastro'nun motoru
**desendir**, kopyalanacak veri değil.

**ORTAK HÜKÜM — BAĞ-2'nin birinci kararı, üç depoda zaten doğrulanmış:**
`user_badges.earned_at` **NULLABLE**. Satır ilerleme başladığında doğar,
kazanıldığında damgalanır, **silinmez.** Emsaller: Gastro `earned_at` ·
Gourmet `earned_at` · Diet `diet_user_goals.achieved_at` (birebir aynı şekil).

⚠ **BAĞ-2'nin ikinci kararı** (tek satırda ilerleme:
`progress_current`/`progress_target`) yalnız Gastro'da kurulu; Gourmet'te
**bilerek alınmamış**. Sözleşmeye girecekse Gourmet'e yeni iş doğar.

**MARKAYA BIRAKILAN — ve bu bir ürün kararıdır:** kademe merdiveninin
**ölçüsü**. Gastro **puan**, Fit **aktif gün** (8 basamak), Gourmet
`tier_id` yazılmıyor, Diet'te kavram yok.

🔴 **SÖZLEŞME DIŞI — Fit bilerek dışarıda.** *"Sıralama / liderlik tablosu"*
ekseni açılırsa Fit **kapsam dışıdır**: `vsSira` anahtarı bilerek sökülmüş,
gerekçesi markup'ta yazılı (*"Kimseyle sıralanmazsın"*). Bu, Gastro'nun
topluluk puanı mantığıyla çelişir ve **çelişki bilinçlidir.**

### 1.9 · Üretici ve kazanç

**ORTAK HÜKÜM (K11):** `ChefProfile` / üretici doğrulama kaydı **üyelik
basamağı değildir** — kimlik düzeyinde kapı yoktur, **para kazanacak üretici
için kapı kalır.**

**ORTAK HÜKÜM (K13):** altı para parametresi (**hizmet komisyonu · abonelik
komisyonu · ödeme dönemi · alt sınır · fatura eşiği · iade kuralı**)
**yönetim panelinden okunur, koda gömülmez.**

🔴 **BUGÜN DÖRT DEPODA DA KARŞILIKSIZ** (ÇAT-7):
- Gastro: `platform_fee_percent = 15` (K13 %10 diyor) · `creator_payout_min =
  50000` → 500 ₺ (K13 1000 ₺ diyor) · **fatura eşiği kavramı yok** ·
  hizmet/abonelik ayrımı yok · **kazanç defteri hiç yok** · **IBAN alanı yok**
- Diet: altısının **hiçbirinin** karşılığı yok. Ayrıca `diet_payments`
  **`dietitian_id` NOT NULL, `user_id` YOK**
- Gourmet: K15 gereği yok
- Fit: maket, kavram yok

**ORTAK HÜKÜM ADAYI — Diet'in kendi kaydettiği borçtan (Ö12):**
**üye ödemesi ve üretici hakedişi AYRI tablolardır**, ve üye tablosu
`user_id` taşır. Diğer üç depo Diet'in bu hatasını miras almamalıdır.

---

## 2 · Durum makinesi

**ORTAK HÜKÜM.** Her durum listesi **KAPALI listedir**; geçişler **enum'da**
tanımlanır, controller'da değil (K8, Diet emsali). Geçersiz geçişin karşılığı
tanımlıdır.

### 2.1 · Hesap durumu

🔴 **DÖRT FARKLI ŞEKİL ÖLÇÜLDÜ — sözleşme birini seçmeli.**

| Marka | Şekil | Hâl sayısı |
|---|---|---|
| **Gastro** | `users.status` **DB enum** — PHP enum sınıfı **YOK** | **4**: `active` · `frozen` · `pending_deletion` · `passive` |
| **Diet** | **iki nullable damga**, enum yok | türetilmiş 3 hâl |
| **Gourmet** | **kolon yok, bilinçli** | 2: var / silinmiş (hard delete) |
| **Fit** | maket, kolon yok | örtük 4 |

**Gastro'nun anlam ayrımı ölçüldü ve bağlayıcı olmaya aday:**
`passive` = admin pasifleştirmesi → **login BLOKLU** · `frozen` = kullanıcının
kendi dondurması → login serbest · `pending_deletion` = 30 gün sayaç, login
serbest.

**ORTAK HÜKÜM ADAYI:** hesap durumu için de **`canTransitionTo()`** bulunur.
Bugün hiçbir depoda yok — Diet'te destek ve abonelikte var, hesapta yok (S5).

🔴 **Dondurma akışının beş adımı** (Fit kanonu, `01 §O9`): uyarı kutusu →
maddeler → süre seçimi → onay kutusu → **kapalı başlayan düğme**.
Sunucu kapıları Gastro emsali: `onay` accepted + `sure` **beyaz listede**.

⚠ **Dondurma süreleri dört markada farklı ölçüldü** ve Diet'inki **tam
ölçülemedi** (referans oturum arkasında). Gastro: `1-hafta` · `2-hafta` ·
`1-ay` · `3-ay` · `sinirsiz`. Diet: `2-hafta` · `1-ay` · `3-ay` · `suresiz`.
**Liste birleştirilmeli.**

**ORTAK HÜKÜM (Gastro emsali):** ayrılma nedeni **anket verisidir, hiçbir
akışı dallandırmaz**; "belirtmek istemiyorum" NULL yazılır.

### 2.2 · Destek talebi durumu

**KANON DIET'TEDİR ve DONDURULDU (P9).** Dört hâl: `acik` ·
`yanit-bekleyen` · `cozulen` · `kapatilan`. Geçiş matrisi dörde dört, on altı
hücrenin her biri gerekçeli. Tam metin: `docs/destek-kanonu.md §2`.

⚠ Diet'te bugün yalnız `acik` ve `kapatilan` işliyor — kalan iki geçiş
**Dalga 3'ün** işidir. Dört hâl **şimdi** kurulur, ulaşılabilirlik sonra.

🔴 Açık uçlar §1.7'de sayıldı.

### 2.3 · Abonelik / paket durumu

**ORTAK HÜKÜM ADAYI — Gastro emsali (`SubscriptionStatus`, 5 hâl):**
`pending` · `active` · `past_due` · `paused` · `canceled`.

**Erişim kümesi TÜRETİLİR, kopyalanmaz** — `grantsAccess()` /
`accessGranting()`; sorgu süzgeçleri o kümeden okur. `past_due` erişim verir
(grace penceresi).

**Fatura durumu 3 hâl:** `draft` · `issued` · `failed`; üye yüzüne **yalnız
`issued`** çıkar.

⚠ Diet'te durum `string(20)`, default `'aktif'` — enum değil.
🔴 Gourmet'te abonelik kavramı **hiç yok**.
✅ Fit'te platform paketi **kurulur** (P7); abonelik durumu bu enum'a uyar.

### 2.4 · Üretici planı durumu

**ORTAK HÜKÜM ADAYI — Gastro emsali (`CreatorPlanStatus`, 5 hâl):**
`draft` · `pending_approval` · `active` · `rejected` · `archived`.
Akış: `draft → pending_approval → active | rejected`. İlk yayın **SUPER admin
onaylıdır**. Fiyat değişiminde eski satır `archived` olur, versiyon zinciri
`superseded_by_id` ile yürür; **`archived` plan yeni abonelik almaz.**

🔴 **Diet'te karşılıksız:** diyetisyen tarafının **altı `status` kolonunun
hiçbirinde enum yok** (S6).
🔴 **Gourmet'te farklı eksen:** ücretli plan yok, ama mekân sahipliği yolunda
üç ayrı durum makinesi var.

✅ **DÜZELTME (v2.1, 2026-08-25) — bu satır YANLIŞTI.** v2'de burada
*"`VenueApplicationStatus`ta `suspended` case'i eksik, action ve controller
ucu var (B9 — kusur)"* yazıyordu. **Kusur yoktur; ölçüm hatalıydı.**

Gourmet şeridinin yeniden ölçümü (`SuspendVenueApplication.php:31`):
`$venue->status = VenueStatus::Suspended` — action **başvuruyu değil,
başvurunun doğurduğu MEKÂNI** askıya alır. Tüm ağaçta
`VenueApplicationStatus::Suspended` yazan **tek satır yok** (grep: 0).

🔴 **Dördüncü case eklemek kusur ÜRETİRDİ:** yönetim süzgeç sekmeleri
`cases()`'ten üretiliyor (`BasvuruUiController.php:66,113` ·
`admin/basvurular/index.blade.php:61`) — ekrana **hiçbir zaman
eşleşmeyecek** bir "Askıya Alındı" sekmesi eklenirdi.

⚠ Bu düzeltme **U3'ün işleyişidir**: şerit ölçümün yanlış olduğunu gördü,
belgeyi tek başına değiştirmedi, **durdu ve raporladı**; dört kopyayı birden
değiştirmek lead'in işidir (K10).

### 2.5 · Kazanç ve ödeme durumu

🔴 **DÖRT MARKADA DA YOK.** Ne enum, ne tablo, ne kolon, ne geçiş.
Gastro'da hesaplayıcı sınıflar var ama biriktirdikleri kayıt yeri yok.
Diet'te `PaymentStatus` var (`beklemede` · `basarili` · `basarisiz` ·
`iade-edildi`) ama **üretici hakedişi ekseninde**, üye ekseninde değil.

**Bu bölüm Dalga 6'nın (Para) işidir; sözleşme şimdilik boşluğu kayda geçirir.**

---

## 3 · Adres kalıbı

### 3.1 · Hesap kökü

🔴 **ÜÇ FARKLI KALIP ÖLÇÜLDÜ.**

| Marka | Kalıp | Sekme/panel |
|---|---|---|
| **Gastro** | `GET /hesabim?tab=<sekme>` — **tek adres, tek sayfa**, tüm pane'ler DOM'da | 7 sekme + 6 alias |
| **Diet** | `GET /hesabim?sekme=<sekme>` — **kapalı beyaz liste** | 5 sekme |
| **Gourmet** | 🔴 **İKİ GRAMER YAN YANA** — (1) `/hesabim/<panel>`, yedi panelin yedi gerçek adresi; (2) `/hesabim/ayarlar?tab=<sekme>`, ayrı bir sayfa ve **sorgu parametresi**. ⚠ `GET /hesabim` kökü **tanımlı değil** (canlı **404**) | 7 panel **+** `ayarlar`ın kendi 6 sekmesi (`profil`·`ilgi`·`konum`·`bildirim`·`paket`·`guvenlik`) |

🔴 **§3.1 DÜZELTMESİ (v2.2, 2026-08-25).** Gourmet satırı v2.1'e kadar
`ayarlar`ın **ikinci gramerini** (`?tab=`, kendi sekmeleriyle ayrı bir sayfa)
almıyordu; o bilgi yalnız `sozlesme-olcum-gourmet.md §3.2`'de duruyordu.
Eksik, arayüz tutarlılık ölçümünde bulundu (B8) ve şerit **belgeyi tek başına
değiştirmedi** — K10 gereği dört kopya birlikte düzeltildi.

⚠ Bu eksik, P12'nin ilk metnindeki hatanın da kaynağıydı: *"her panel ayrı
sayfa"* tarifi, yüzeyin **iki sayfaya bölünmüş** olduğunu ve ikinci sayfanın
zaten sekme grameri kullandığını görmüyordu.
| **Fit** | `hesabim-v1.html#<çapa>` — statik dosya + çapa | **10 çapa · 56 form denetimi** |

**KALIP — aşağıdaki 5 maddenin 2·3·4·5'i ORTAK HÜKÜMDÜR; **1. madde
(parametre adı) 🔴 AÇIKTIR** (§6 · açık nokta 4) ve U2 gereği hiçbir depo
kendi parametresini bu turda değiştirmez.**

1. Hesap kökü **tek adrestir** ve alt yüzey bir **sorgu parametresiyle**
   seçilir. Parametre adı tekleştirilmelidir — bugün `?tab=` ve `?sekme=`
   yan yana duruyor. 🔴 **Beyar kararı gerekiyor: `?sekme=` (TR) mi,
   `?tab=` (EN) mi.**
2. Değer kümesi **kapalı beyaz listedir**; tanınmayan değer **sessizce ilk
   sekmeye** düşer (üçünde de aynı davranış ölçüldü).
3. **Hata, doğduğu sekmede basılır.** İki depo bunu bağımsız kurmuş:
   Gastro `HATA_ALAN_SEKME` (7 alan) + `HATA_TORBA_SEKME` (4 torba) ·
   Diet `ALAN_SEKMESI` (18 alan). **Bu ortak hükümdür.**
4. 🔴 **`back()` KULLANILMAZ** (Diet emsali, gerekçesi ölçülü): REFERER
   okunursa kullanıcı `guvenlik` sekmesinden gönderdiği formun hatasını
   `profil` sekmesinde görür. Dönüş, formun **gizli sekme alanından** ve
   **beyaz listeye karşı doğrulanarak** yapılır.
5. **Locale:** TR öneksiz, EN `/en` önekli. Dil **tercihi** adres önekini
   **ezmez**.
   ⚠ Diet'te `/hesabim` kökü **çok dilli değil** (`/en/my-account` yok,
   `/en/my-account/support` var) — açık kaydı `KULLANICI-ALANI-FARK.md §4.6-Ç3`.

### 3.2 · Alt yüzeyler

**ORTAK HÜKÜM.** Şu yüzeyler dört markada bulunur (bugünkü eksikler
Dalga 2'nin iş listesidir):
destek merkezi · verilerimi indir · şifre değiştirme · 2FA kurulumu ·
açık oturumlar · hesap dondurma · hesap silme.

⚠ **Gastro şerhi:** `/hesabim` öneki yalnız **yeni doğan** sayfalarda
kullanıldı; bugün çalışan dokuz adres taşınmadı. Sözleşme geçmişe dönük
taşıma dayatmaz.

### 3.3 · Yazma uçları ve hız sınırları

**ORTAK HÜKÜM.** Hesap yazma uçları `auth` + doğrulanmış eylem kapısı
arkasındadır ve **adlandırılmış hız sınırı kovası** taşır.

🔴 **Gastro'nun ölçtüğü kusur sözleşmeye şerh olarak girmeli (ÇAT/Ç-3):**
`throttle:N,1` biçimi **ortak bir kovadan** paylaşılır. Sayıyı yazmak yetmez;
**adlı kova** kuralı da yazılmalıdır — aksi hâlde iki farklı uç birbirinin
kotasını yer.

⚠ **Ölçülen asimetriler, gerekçesi bulunamadı:** Gastro'da
`POST /hesabim/gizlilik` hız sınırı **taşımıyor**; Diet'te
`PUT /hesabim/sifre` taşımıyor ama `2fa.onayla` ve `oturumlar.kapat`
`throttle:30,1` taşıyor.

### 3.4 · Yönetim yüzeyi

**ORTAK HÜKÜM.** Yönetim erişimi **Policy tabanlıdır** (`can:access-admin` +
modül Policy'leri); `is_admin` boolean'ı gibi kestirmeler yoktur.

🔴 **ORTAK HÜKÜM ADAYI — Diet'in kendi şerhinden (D3):** yönetim destek masası
kurulurken **açık ve gerekçeli bir Policy metodu** açılır; `view()`e sessizce
`isAdmin()` **eklenmez**.

⚠ Bugün **Diet'te ve Gourmet'te admin destek yüzeyi yok**; Fit'te yönetim
paneli hiç yok.

---

## 4 · Doğrulama kuralları

### 4.1 · Alan bazlı kurallar

**ORTAK HÜKÜM.** Aynı alan dört depoda **aynı kuralla** doğrulanır ve sayı
**tek yerde** durur. Marka başına ölçülen sayılar dört
`sozlesme-olcum-<marka>.md §4.1`'dedir; **birleştirme Beyar onayından sonra
tek tabloya indirilecektir.**

### 4.2 · Görsel yükleme

**ORTAK HÜKÜM (İ3 · `component-token.md §6`):**
- **En küçük kenar CSS render genişliğinden türetilir; 2x retina çarpımı
  YAPILMAZ.**
- Kare/oranlı görsel `<img>` değil, `div` + `background-image` +
  `cover/center`.
- Yükleme **private disk + signed URL + mime/size doğrulaması**; public
  disk'e kullanıcı dosyası yazılmaz.

Ölçülen sayılar örnek olarak: Diet `KAPAK_MIN_GENISLIK = 1176`
(`--wrap:1240px` − 2×32) · `KAPAK_MIN_YUKSEKLIK = 240` · `FOTO_MIN_KENAR = 200`.
Fit maketinde profil fotoğrafı `200×200`.
🔴 **Gourmet'te en küçük kenar kuralı hiç yok** (B8) — yalnız MIME ve boyut
tavanı.

🔴 **ORTAK HÜKÜM ADAYI — Diet'in B6 bulgusundan:** imzalı medya URL'i
**sahiplik sormalıdır.** Bugün Diet'te sormuyor; imza ömrü boyunca (900 sn)
URL'i ele geçiren dosyayı okuyabiliyor ve destek eki **sağlık verisi**
taşıyabiliyor.

### 4.3 · Hız sınırı tavanları

§3.3'e bakınız. **Sözleşme sayıyı değil, kova kuralını bağlar.**

### 4.4 · Yetki kapıları

**ORTAK HÜKÜM.** Sahiplik kapısı Policy'dedir; **`delete()` varsayılan olarak
`false`** (destek kaydı, izin kaydı). IDOR kapısı: bir FK üzerinden gelen
ilişkili kayıt **her zaman üye eksenli doğrulanır** (Diet emsali:
`related_appointment_id`).

**ORTAK HÜKÜM (`CLAUDE.md` · Test stratejisi):** para ve yetki akışları
**%100 feature test** altındadır. İstisna yok.

---

## 5 · Sözleşme dışı bırakılanlar

🔴 **Boş bırakılmaz — "bu markaya özel" demek de bir sözleşme hükmüdür.**
Dört şerit kendi listesini gerekçeli çıkardı; birleştirilmiş hâli:

| Marka | Kalem sayısı | Örnek (gerekçesiyle) |
|---|---:|---|
| **Diet** | 13 (Ö1–Ö13) | §14.6 **acil durum bilgilendirmesi** — sağlık verisi sorumluluğudur; Gastro/Gourmet/Fit aynı hukuki yüzeyde değil · `paylasim-*` izin ekseni (7 anahtar) · `diet_payments`in üye eksenli **olmaması** (bu bir **borçtur**, tasarım değil — miras alınmamalı) |
| **Fit** | 9 (F-Ö1–F-Ö9) | Ölçü birimi beşlisi (sıcaklık dâhil: *"açık hava antrenmanı ısınma önerisi sıcaklığa göre değişir"*) · **`dlGizle`** — enerji değerlerini gizle, **yeme bozukluğu duyarlılığı** için · **Bağlı Uygulamalar** (üç yönlü veri sözleşmesi) · **"Sıralama YOK" duruşu** |
| **Gastro** | 4 alt başlık | Mutfak mesleğine bağlı olanlar · ürün modeline bağlı olanlar (üye üyeye abonelik) |
| **Gourmet** | §5 + 9 boşluk | Mekân sahipliği ekseni · `VenueOwnershipTransferPolicy` |

**ORTAK İLKE:** Fit'in `dlGizle`si ve Diet'in acil durum uyarısı **aynı
türden** kalemlerdir — markanın **kullanıcı zararı** yüzeyi farklıdır ve
kopyalanmaz. Sözleşme bunu şöyle bağlar: *"her marka kendi zarar yüzeyini
kendi tanımlar; sözleşme tanımlama yükümlülüğünü bağlar, tanımın kendisini
değil."*

---

## 6 · HÂLÂ AÇIK OLAN DÖRT NOKTA — U2 buralarda geçerlidir

Dalga 1'in altı onay noktasından **ikisi kapandı** (P8 · P9). Kalan dördünde
**karar verilmemiştir**; şerit kendi markasının bugünkü şeklini korur,
yakınsama yapmaz, migration yazmaz.

| # | Açık karar | § | Bu turda ne yapılır |
|---|---|---|---|
| 1 | Gizlilik **görünürlük ekseni** sözleşmeye giriyor mu (Diet ve Gourmet'e yeni iş doğar) | 1.3 | Kimse yeni gizlilik ekseni **kurmaz**. Gastro'nun altı anahtarı yerinde kalır |
| 2 | Bildirim tercihi **tek JSON kolon** mu, **ayrı tablo** mu | 1.4 | Şekil değiştirilmez. Yeni marka kurarsa Diet'in şeklini (`topic × channel`) alır |
| 3 | Hesap durumu şekli: DB enum + PHP enum mu, nullable damgalar mı | 2.1 | Var olan şekil korunur. **Yeni kurulan** hesap durumu Gastro'nun dört hâlini alır |
| 4 | Adres parametresi **`?sekme=`** mi **`?tab=`** mı | 3.1 | Hiçbir depo kendi parametresini değiştirmez |

**Destek tarafında kapanmayan üç kalem** (P9 yalnız durum sayısını kapattı):
`Y8.5` Fit'in "Taleplerin" ve "Beklerken" kalemleri kanona giriyor mu ·
`D4` "yeniden aç" (çıkarılırsa `Kapatilan` terminal olur) ·
`D6` `priority` kolonu · `ÇAT-8` `brand` kolonu.
**Dördü de Dalga 3'ün konusudur**, Dalga 2'yi engellemez.

---

*Sözleşme v2 sonu. Değiştiren dördünü birden değiştirir ve damgayı yükseltir.*

---

## 7 · Hesap arayüzü — yapı (P12)

🔴 **ORTAK HÜKÜM. KANON = DIET.** Dört markada da hesap arayüzü Diet'in
yapısına uyar: **sayfa düzeni · sekme yapısı · kart kompozisyonu · başlık
hiyerarşisi · boşluk ritmi.** Kart kiti Diet'inkidir.

⚠ **Bu bölüm YAPIYI bağlar, ADRES PARAMETRESİNİ değil.** `?sekme=` ↔ `?tab=`
sorusu **§6'da hâlâ 🔴 AÇIK** ve P12 onu kapatmaz.

### 7.1 · Kanonun iki esnetilmiş kalemi

Kanon Diet'tir, **ama şu ikisinde Diet'in bugünkü hâli değil, aşağıdaki hâl
kanondur** (Beyar kararı, 2026-08-26):

**D-1 · Kart başlığı GERÇEK BAŞLIK ÖĞESİ basar.**
`.pc-title` bir `<h2>`dir (bölüm içi alt başlık `<h3>`). Diet'in bugünkü
`<span class="pc-title">` biçimi **kanon değildir ve Diet de buna uyar.**

🔴 **Gerekçe ölçülmüştür:** span biçimi üç markaya uygulansaydı
**33 `<h2>` + 9 `<h3>`** belge ana hattından çıkacak (Gastro 6 · Gourmet 13 ·
Fit 14), **ekran okuyucuda başlıkla gezinme üç markada birden kalkacaktı.**
**Sözleşme bir erişilebilirlik gerilemesi taşımaz.**

**D-2 · Kart başlığı bloğu AÇIKLAMA SATIRI taşır.**
Başlığın altında isteğe bağlı bir `<p>` durur. Diet'in bugünkü yalnız-başlık
`.pc-head`'i **kanon değildir ve Diet de buna uyar.**

🔴 **Gerekçe ölçülmüştür:** açıklama yuvası olmasaydı **52 metin** düşecekti
(Gastro 23 · Gourmet 15 · Fit 14). O metinler kullanıcıya kartın ne yaptığını
anlatır — kayıpları **biçim değil İÇERİK kaybı** olurdu.

### 7.2 · Uyacak taraflar

| Marka | Bugünkü yapı | Durum |
|---|---|---|
| **Diet** | tek sayfa + `?sekme=` · `.pnl-card` kiti | **kanon** — ama **D-1 ve D-2 için Diet de değişir** |
| **Gastro** | tek sayfa + `?tab=` · `.form-card` kiti | yapı yakın; **kart kiti · başlık · ritim** kapsamda |
| **Gourmet** | 🔴 **iki sayfa, iki gramer**, `GET /hesabim` **yok** | **en ağır taşıma** |
| **Fit** | statik maket, `#çapa` · `.form-card` kiti | kart kiti kapsamda · **P13 gereği ayrı şeritte** |

### 7.3 · Bu bölümün bağlamadığı

- **Adres parametresi** (§6, açık).
- **Sekme davranışı** (`pushState`/`popstate`/ok tuşu/`aria-controls`) —
  kapsama girip girmediği **ayrı karardır**. ⚠ Ölçüm: **Gastro bugün
  `replaceState` kullanıyor** ve üç kardeşinden de geride.
- **Fit'in şerit sırası** — P13 gereği Fit dalga sırasını beklemez; **kanon
  yine de Fit'i bağlar.**

⚠ **İş hacmi (`dadagastro/docs/hesap-mimarisi/14-arayuz-tutarlilik.md §9`)
kanon esnetilmeden ÖNCE ölçüldü ve Diet'i 0 saydı.** D-1 ve D-2 Diet'i de
değiştirdiği için o toplam **eksiktir** — YP12.2 başlamadan Diet'in maliyeti
ölçülmelidir.

### 7.4 · Yer tutucu içerik — tek nitelik, tek defter

🔴 **ORTAK HÜKÜM** (Beyar kararı, 2026-08-26).

Gerçek içeriği henüz belli olmayan her metin **yer tutucudur** ve üç kuralı
birden taşır:

1. **Metin TÜRKÇE olur.** 🔴 **Lorem ipsum yasaktır.** Yer tutucu, gerçek
   içeriğin yerini tutar; okunduğunda ne geleceği anlaşılmalıdır.
2. **`data-yer-tutucu="<slug>"` niteliği taşır.** Nitelik adı **budur** —
   `data-placeholder` **değil.**
3. **`docs/icerik-bekleyen.md`ye kaydedilir.** Kayıt: dosya·satır · bugün ne
   yazıyor · gerçek içerik ne olacak. **Anahtar, koddaki `data-yer-tutucu`
   değeriyle BİREBİR aynıdır.**

🔴 **TEK DEFTER, TEK NİTELİK.** İkinci bir liste (`todo.md` vb.) ve ikinci
bir nitelik açılmaz. İki defter, birinin unutulması demektir.

⚠ **Bu hüküm ölçümle doğdu.** Fit'te bir tur boyunca **iki paralel defter**
oluştu: depoda kurulu olan `data-yer-tutucu`/`icerik-bekleyen.md` ile yeni
açılan `data-placeholder`/`todo.md`. Şerit çakışmayı **fark edip bildirdi**;
karar **depoda zaten kurulu olan sözleşmenin kazanması** yönünde verildi.

**Denetim — iki yön, iki farklı ölçüt:**

- **Kod → defter (KATI):** kodda `data-yer-tutucu` taşıyan **her** anahtar
  defterde bulunmalıdır. İstisnası yoktur.
- **Defter → kod (ESNEK):** defterde olup kodda niteliği **olmayan** kalem
  **ihlal değildir** — yer tutucu bir **YOKLUĞU** kaydediyor olabilir
  (üretilmemiş bir QR, konmamış bir bağlantı, basılmamış bir satır).
  Niteliği takacak öğe yoksa nitelik de olmaz. **Ama defter satırı, içerik
  gelince NEREYE gireceğini yazmak zorundadır.**

⚠ **Bu ayrım ölçümle doğdu:** Fit'in defterinde dört anahtarın kodda
karşılığı yok ve **dördü de bilinçli** (*"sahte QR üretilmedi"* gibi).
Tek yönlü katı bir denetim onları ihlal sayardı ve düzeltmeye çalışan bir tur
ya sahte nitelik ekler ya meşru kaydı silerdi.

⚠ **`data-placeholder` yasağının denetimi de dar okunur:** yasak **kod** için
geçerlidir (`*.html` · `*.js` · `*.css` → **0**). Bu bölümün kendisi yasağı
koyabilmek için adı anmak zorundadır; sözleşme metnindeki geçişler sayılmaz.
