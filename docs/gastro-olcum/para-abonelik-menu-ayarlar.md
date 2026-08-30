# Gastro Ölçümü — Paket/Abonelik · Kazanç/Ödeme · Menü · Ayarlar/SEO

**Kaynak (salt okuma):** `/Users/gaviaworks/Developer/Backend Projects/dadagastro-profil`
**Ölçüm tarihi:** 2026-08-30 · **Yöntem:** her sayı/alan `dosya:satır` ile gösterildi;
alan listeleri doğrulama kurallarıyla birlikte eksiksiz yazıldı ("vb." kullanılmadı).
Etiket metinleri Blade'den **birebir** alındı.

Kaynak yol kısaltmaları:
- `V/` = `resources/views/`
- `C/` = `app/Http/Controllers/Admin/`
- `R/` = `public/reference/`

---

## 1 · PAKET VE ABONELİK

### 1.0 Ekran envanteri ve satır sayıları

| Ekran | Dosya | Satır |
|---|---|---|
| Fiyatlandırma (plan grid) | `V/admin/planlar/index.blade.php` | 118 |
| Plan Düzenle | `V/admin/planlar/duzenle.blade.php` | 200 |
| Creator Planları | `V/admin/creator-planlari/index.blade.php` | 116 |
| Abonelikler listesi | `V/admin/abonelikler/index.blade.php` | 132 |
| Abonelik detayı | `V/admin/abonelikler/show.blade.php` | 198 |
| Faturalar listesi | `V/admin/faturalar/index.blade.php` | 144 |
| Fatura detayı | `V/admin/faturalar/show.blade.php` | 53 |
| Kuponlar listesi | `V/admin/kuponlar/index.blade.php` | 119 |
| Kupon formu | `V/admin/kuponlar/form.blade.php` | 130 |

(ölçüm: `wc -l`)

---

### 1.1 Fiyatlandırma — `V/admin/planlar/index.blade.php`

**Yerleşim:** tablo DEĞİL, **kart grid** (`.plan-grid`, `:49`). Sayfa CSS'i
`R/admin-fiyatlandirma/sa-fiyatlandirma.css`.

**Başlık:** `Fiyatlandırma` · alt metin `Pro abonelik planları ve özellik tanımları · <N> plan` (`:33`)

**Bilgi bandı (`.intro-band`, `:45`) — birebir metin:**
> "Planlardaki fiyat ve özellik değişiklikleri yeni aboneliklerde geçerli olur; mevcut aboneler dönem sonuna kadar eski planlarında kalır (B16). "Öne çıkan" plan üyelik sayfasında vurgulanır."

**Kart içeriği (her plan için):**

| Kart parçası | Kaynak | Satır |
|---|---|---|
| İkon + plan adı | `$plan->icon` + `name` (translatable) | `:83` |
| Rozet (`.plan-tag`) | `badge_label` (çevrilebilir); boşsa `is_featured` → "Öne çıkan"; **pasifse rozetin ÜSTÜNDE "Pasif"** | `:76-89` |
| Açıklama | `description` (translatable, richtext) | `:90` |
| Aylık fiyat | `₺{monthly_price/100} /ay` | `:92` |
| Yıllık fiyat | `Yıllık ₺{yearly_price/100} (2 ay bedava)` — **"2 ay bedava" metni SABİT, hesaplanmıyor** | `:92` |
| Özellik tikleri | `$coreFeatureLabels` 4 anahtar × tik/çarpı | `:94-99` |
| Abone sayısı | `active_subscribers_count` (erişim veren durumlar) | `:102` |
| Aksiyon | Düzenle (`admin.plans.edit`) + Aktif/Pasif toggle (`admin.plans.toggle`) | `:104-110` |

**Liste kartındaki 4 özellik etiketi (`:19-24`) — birebir:**
`ads_free` → "Reklamsız deneyim" · `pro_content` → "Pro içerik ve tarifler" ·
`weekly_menu` → "Haftalık menü planlayıcı" · `video_premium` → "Video mutfağı — sınırsız erişim"

**🔴 Ücretsiz kart STATİKTİR** (`:51-69`): plan satırı değil (B11), Blade'e **gömülü**.
İki tik ve iki çarpı metni koda yazılı; düzenleme yolu YOK. Üye sayısı
`User::count()` (`C/PlanController.php:44`).

**🔴 CREATE / DELETE YOK.** `C/PlanController.php` yalnız `index/edit/update/toggleStatus`
taşır; "Yeni Plan" butonu ve kart-üstü Sil aksiyonu **kasıtlı olarak yoktur**
(`index.blade.php:12-15` — kanonik set sabit, admin YALNIZ EDIT + `is_active` toggle).
Sayfalama `paginate(30)` sırf standart uyum için (`C/PlanController.php:36-38`).

**Süzgeç YOK, arama YOK, durum chip'i YOK.** Bu ekranda hiçbir filtre yüzeyi yok.

---

### 1.2 Plan Düzenle — `V/admin/planlar/duzenle.blade.php`

İki sütunlu `.form-layout`: solda form kartı, sağda **canlı plan kartı önizlemesi**
(`.plan-prev`, `:181-193`; JS `R/admin-fiyatlandirma/sa-fiyatlandirma-form.js`).
Tüm form TEK `<x-admin.lang-tabs>` (global TR/EN sekmesi) kapsamındadır (`:80`).

**Bölüm 1 — "Plan Bilgileri"** (`:84`)

| Alan | name | Tip | Doğrulama (`C/PlanController.php:71-98`) |
|---|---|---|---|
| Kod (salt-okunur) | — | text, `disabled` | yazılamaz, `code` payload'da KABUL EDİLMEZ |
| Plan adı | `name[tr]` / `name[en]` | text, maxlength 60 | `name.tr` required·string·max:60 · `name.en` nullable·string·max:60 |
| Rozet etiketi | `badge_label[tr]/[en]` | text, maxlength 40, placeholder "ör. Öne çıkan, Premium" | nullable·string·max:40 (her iki dil) |
| Kısa açıklama | `description[tr]/[en]` | **richtext (TinyMCE)**, height 160 | `description.tr` required·string·**max:200** · `.en` nullable·max:200 |

Rozet ipucu birebir: *"Boş bırakılırsa «Öne çıkan» planı otomatik gösterir."*

**Bölüm 2 — "Görsel İkon"** (`:100-108`)
Hidden `icon` + `.ico-pick` ızgarası; **8 sabit seçenek** (`:41`):
`fa-seedling · fa-star · fa-medal · fa-award · fa-trophy · fa-ranking-star · fa-crown · fa-gem`.
Doğrulama: `icon` required·string·max:60.

**Bölüm 3 — "Fiyatlandırma"** (`:111-147`)

| Alan | name | Tip | Doğrulama |
|---|---|---|---|
| Aylık ücret | `monthly_price` (hidden, kuruş) + görünür `#f-aylik` ₺ tamsayı | number, min 0, required | required·integer·min:0 |
| Yıllık ücret | `yearly_price` (hidden, kuruş) + görünür `#f-yillik` | number, min 0, required | required·integer·min:0 |
| Sıra | `position` | number, min 0, required | required·integer·min:0 |
| Öne çıkar | `is_featured` | checkbox | boolean |
| Satın alınabilir | `is_purchasable` | checkbox | boolean |

- **Para birimi seçici YOK.** `plans.currency` kolonu modelde `fillable` (`app/Domain/Billing/Models/Plan.php:52`) ama **formda alanı yok** — ₺ önekiyle sabit basılır (`.cur-pre`, `:121`).
- **İndirim alanı YOK.** Yıllık indirim ayrı bir alan değil; kart metni "(2 ay bedava)" sabit.
- `is_purchasable` etiketi birebir: *"Satın alınabilir (işaretsizse vitrinde görünür ama satılmaz)"* (`:145`). `is_active`'ten ayrı sorudur; toggle liste ekranındadır.

**Bölüm 4 — "Özellikler"** (`:150-168`) → bkz. §1.3.

Kaydetme: `PATCH admin.plans.update`, ardından `redirect → plans.index` + flash
`plan-updated` (`C/PlanController.php:129`). Yazma yalnız `super`
(`PlanPolicy@update`); görüntüleme super + gastro-admin.

---

### 1.3 🔴 PLAN ⇄ ÖZELLİK MATRİSİ: **VAR AMA ÇOK DAR — "matris" değil, sabit anahtarlı onay kutusu listesi**

**Ne VAR:**
Plan düzenleme formunda "Özellikler" bölümü (`duzenle.blade.php:150-168`):
`$coreFeatureLabels` dizisinde **7 sabit boolean anahtar**, her biri
`name="entitlements[<key>]"` checkbox'ı olarak basılır (`:153-158`), artı bölüm
sonunda **1 sayısal kota** (`entitlements[creator_quota]`, number, min 0,
"boş = sınırsız", `:164-165`).

**7 anahtar + Türkçe etiket (birebir, `duzenle.blade.php:42-50`):**

| Anahtar | Ekrandaki etiket |
|---|---|
| `ads_free` | Reklamsız deneyim |
| `pro_content` | Pro içerik ve tarifler |
| `weekly_menu` | Haftalık menü planlayıcı |
| `video_premium` | Video mutfağı — sınırsız erişim |
| `lesson_all_access` | Mutfağa Giriş — orta/ileri seviye dersler |
| `lesson_personal_path` | Mutfağa Giriş — kişisel öğrenme rotası |
| `ai_assistant` | Yapay zekâ destekli kişiselleştirme |

+ `creator_quota` → "İçerik üretici kotası (boş = sınırsız)"

**Tek kaynak:** `app/Domain/Billing/Services/EntitlementService.php:47-64`
(`DEFAULTS` dizisi, 8 anahtar). `keys()` (`:67-70`) admin doğrulamasının tek
kaynağıdır: `C/PlanController.php:90-96` bilinmeyen anahtarı
*"Bilinmeyen entitlement anahtarı: {key}."* diyerek reddeder; okuma tarafında da
`array_intersect_key` ile düşürülür (`EntitlementService.php:105`).
Yorum kaydı: anahtar seti bu turda **29'dan 8'e indi** (17 `gourmet_*` + 5 çapraz-marka
"yakında" anahtarı silindi — `EntitlementService.php:20-45`).

**Ne YOK — grep kanıtlı:**

1. **Özellik EKLEME/ÇIKARMA yüzeyi YOK.** Liste PHP dizisinde sabit; yeni özellik
   ancak koda satır yazarak doğar. Admin'in "yeni özellik tanımla" ekranı yoktur.
   Bir `features` **tablosu/modeli yoktur** — `app/Domain/Billing/Models/` altında
   yalnız Plan/Subscription/Coupon/Invoice ailesi var; `entitlements` bir **JSON
   kolonudur** (`Plan::casts()`, `Plan.php:64`).
2. **Karşılaştırma tablosu yönetimi YOK.** Plan kartındaki tik/çarpı listesi liste
   ekranında **4 anahtara sabitlenmiştir** (`index.blade.php:19-24`) — formdaki 7
   anahtarın 3'ü (`lesson_all_access`, `lesson_personal_path`, `ai_assistant`)
   admin liste kartında **hiç görünmez**. Kolon/satır sırası, gösterilecek özellik
   seçimi, gruplama: hiçbiri yönetilemiyor.
3. **`plans.features` kolonunun admin yüzeyi YOK.** Model bunu taşıyor
   (`Plan.php:26-27` docblock, `:47` fillable, `:69` cast `array`) ve public'te
   basılıyor — `V/hesabim/abonelik/_pro.blade.php:43-45`,
   `V/sefler/show.blade.php:400-402`, `V/uretici/plan.blade.php:35-37`.
   Ama grep `features` üzerinde `V/admin/planlar/` ve `V/admin/creator-planlari/`
   dizinlerinde **0 satır** döndü. **Yani platform planının tanıtım maddeleri
   admin'den düzenlenemiyor** — ölçülmüş bir üç-bacak boşluğu.
4. **"Hangi modül hangi kademede açık" seçici YOK** — sadece 7 boolean. Modül
   listesi, kademe merdiveni matrisi, kademe başına farklı limit gibi bir yüzey yok.
5. **Para birimi / indirim / deneme süresi / vergi alanı YOK** (§1.2).
6. **Plan CREATE / DELETE YOK** (§1.1).

**DadaFit için sonuç:** Gastro'dan **desen olarak alınabilecek olan** şey
"sabit anahtar seti + plan başına checkbox + validation'ın tek kaynağı bir servis
sınıfı"dır. **İcat edilmesi gereken** şey: özellik kayıt defteri (admin'den
özellik tanımlama), plan × özellik matris ekranı, karşılaştırma tablosu yönetimi,
plan oluşturma/silme, tanıtım maddeleri (`features`) editörü, para birimi ve
indirim alanları.

**Kıyas — creator planında durum FARKLI:** üretici kendi planının tanıtım
maddelerini **kendisi** yazıyor: `V/uretici/plan.blade.php:69-71` 5 satırlık
`features[]` tekrarlayıcısı; doğrulama `Web/CreatorPlanController.php:52-53`
(`features` nullable·array·**max:8**, `features.*` nullable·string·max:120).
Yani "serbest metin özellik listesi" deseni depoda VAR, ama **yalnız creator
tarafında** — platform planında yok.

---

### 1.4 Creator Planları — `V/admin/creator-planlari/index.blade.php`

**Bu bir gözetim/onay kuyruğudur, bir düzenleme ekranı değildir.**

- Başlık alt metni birebir: *"Üretici üyelik planlarını gözet; ilk yayın onayını ver ya da reddet."* (`:34`)
- **Kolonlar (5):** Üretici (`chefProfile->title`) · Plan (`name`, translatable) · Aylık (`monthly_price/100 ₺`) · Durum · İşlem (`:48-54`)
- **Durumlar (5, `:21-24`):** `draft`→"Taslak" · `pending_approval`→"Onay Bekliyor" · `active`→"Yayında" · `rejected`→"Reddedildi" · `archived`→"Arşiv"
- **Eylemler:** yalnız `pending_approval` satırında **Onayla** (`admin.creator-plans.approve`) ve **Reddet** (`admin.creator-plans.reject`); diğer durumlarda `—`. Reddet, `saConfirm` modalı açar: başlık *"Bu creator planı reddedilsin mi?"*, mesaj *"Üretici yeniden gönderebilir."* (`:113-121`)
- **Süzgeç YOK, arama YOK, KPI YOK.** `paginate(30)`, `latest()` (`C/CreatorPlanController.php:26`).
- Yetki: liste super + gastro-admin; onay/ret yalnız super (`@can('approve', $plan)`, `:64`).
- **Fiyat/özellik düzenleme yolu YOK** — admin creator planının içeriğine dokunmaz.

---

### 1.5 Abonelikler — liste + detay

#### 1.5.1 Liste — `V/admin/abonelikler/index.blade.php`
CSS: `R/admin-abonelikler/sa-abonelikler.css`.

**KPI şeridi (4 kart, `:50-55`)** — hepsi gerçek sorgu (`C/SubscriptionController.php:63-67`):

| Kart | Etiket (birebir) | Sorgu |
|---|---|---|
| 1 | Toplam aktif üye | `status=active` → `distinct('user_id')->count('user_id')` |
| 2 | Aktif platform aboneleri | `status=active` + `subscribable_type = Plan` |
| 3 | Askıda | `statusCounts[paused]` |
| 4 | Ödeme Sorunlu | `statusCounts[past_due]` |

Şerh (`:19-25`): referansın "İade Bekliyor" kartının sistemde karşılığı yok
(B17 — iade admin-başlatımlı istisnai aksiyon, kuyruk değil); yerine gerçek
`past_due` sayısı kondu.

**Süzgeçler — iki chip rayı:**
- **Tip (`:59-69`):** Tüm Tipler (`totalSubscriptions`) · Platform · Creator — her chip'te `.ch-cnt` sayacı; sayaçlar tek `groupBy` sorgusundan gelir ve **mevcut filtreyle küçülmez** (`C/SubscriptionController.php:41-42`).
- **Durum (`:70-79`):** Tüm Durumlar + `SubscriptionStatus::cases()`.

**Durum etiketleri (5, `:33`):** `active`→Aktif · `past_due`→Ödeme Sorunlu ·
`paused`→Askıda · `canceled`→İptal · `pending`→Bekliyor.
Chip renkleri (`:32`): ok · warm · wait · off · wait.

**Kolonlar (5, `:88-94`):** Üye (ad + e-posta, `.bz-name`) · Plan / Tier ·
Durum · Dönem Sonu (`current_period_end`, `d F Y`) · aksiyon (`.act`).
**Satır aksiyonu tek: Detay göz ikonu** (`:118`) — askıya al/iade/aktifleştir
butonları listede **bilerek yok** (`:26-32`).

`paginate(30)` + `withQueryString()` (`C/SubscriptionController.php:186`).

#### 1.5.2 Detay + operasyonlar — `V/admin/abonelikler/show.blade.php`

Dört kart. Her kart yetki kapılı.

**Kart 1 — "Operasyonlar"** (`:57-92`, `@can('operate')` = super + gastro-admin)
Alt metin birebir: *"İptal dönem sonunda devreye girer; devam duraklatmayı geri alır."*
- **İptal (dönem sonu)** — POST `admin.subscriptions.cancel`, alan yok, `saConfirm`: *"Bu abonelik iptal edilsin mi?"*
- **Devam** — POST `admin.subscriptions.resume`, alan yok, **onay modalı yok**
- **Dondur** — POST `admin.subscriptions.pause`; alan `months` (`<select>`, required). **Seçenekler ve etiketteki tavan koda gömülü DEĞİL**: `PauseSubscription::maxMonths()`'tan üretilir (`:76-83`), ki o da `billing.pause_max_months` ayarını okur. Etiket: *"Dondur — süre (ay, maks. :max)"*. Doğrulama: required·integer·min:1·max:`maxMonths()` (`C/SubscriptionController.php:88-90`).

**Kart 2 — "İstisnai İade (super)"** (`:95-119`, `@can('refund')` = super-only)
Alt metin birebir: *"İade gateway üzerinden yapılır; kart verisi platformda tutulmaz."*
| Alan | name | Tip | Doğrulama |
|---|---|---|---|
| Tutar (kuruş)* | `amount_minor` | number, min 1, required | required·integer·min:1 |
| Gerekçe (zorunlu)* | `reason` | text, maxlength 500, required | required·string·max:500 |
Buton "İade Et"; `saConfirm`: *"Bu tutar iade edilsin mi?"*.
Hata yolu: `PaymentFailedException|DomainException|InvalidArgumentException`
yakalanır → flash `subscription-refund-failed` + `op_message` (`C/SubscriptionController.php:128-132`).

**Kart 3 — "Anında Sonlandır (super)"** (`:121-137`, `@can('terminate')`)
Alt metin birebir: *"Erişim hemen kesilir; dönem sonu beklenmez. Geri alınamaz."*
Tek alan: `reason` (text, maxlength 500, required → required·string·max:500).
Buton "Erişimi Hemen Kes"; `saConfirm`: *"Erişim HEMEN kesilsin mi?"* / *"Bu işlem geri alınamaz."*

**Kart 4 — "İade Geçmişi"** (`:139-165`, yalnız kayıt varsa)
Kolonlar (3): Tutar (kuruş→₺, 2 hane) · Gerekçe · Tarih (`d F Y`).

**Her yazma audit'li** — `LogAdminActivity`: `subscription.paused` (+`months`) ·
`subscription.resumed` · `subscription.canceled` · `subscription.terminated`
(`C/SubscriptionController.php:91,103,115,152`).

---

### 1.6 Faturalar — liste + detay

#### 1.6.1 Liste — `V/admin/faturalar/index.blade.php` — **SALT OKUNUR**
Alt metin birebir: *"Platform ve üretici abonelik faturaları — salt-okunur."* (`:57`)

**Süzgeçler (3, hepsi backend'te zaten vardı):**
- Arama (`.fb-search`, `:63-65`): `q` — placeholder *"Fatura no veya kullanıcı ara…"*; sunucuda `number LIKE` **veya** kullanıcı `name`/`email` LIKE (`C/InvoiceController.php:76-84`)
- Tarih aralığı (`:76-78`): `from` / `to` (`type="date"`, `onchange="this.form.submit()"`) → `whereDate('issued_at', >= / <=)`
- Durum chip'leri (`:86-95`): Tümü + 3 durum, `.ch-cnt` sayaçlı (sayaçlar arama/tarih **uygulanmadan** hesaplanır — `C/InvoiceController.php:38`)

**Durumlar (3, `:29-33`):** `issued`→"Kesildi" (ok) · `draft`→"Taslak" (wait) · `failed`→"Başarısız" (off)

**Kolonlar (7, `:102-110`):** Fatura No · Kullanıcı · Plan · Tarih (`d F Y`) ·
Durum · Tutar (kuruş→₺, 2 hane) · İşlem.
**İşlem: 2 ikon-buton** (`:121-124`) — Görüntüle (`admin.invoices.show`) ve
PDF indir (`admin.invoices.pdf`). Toplu işlem YOK, dışa aktarma YOK.

`paginate(25)`, sıralama `issued_at DESC, id DESC` (`C/InvoiceController.php:87-89`).
**Owner-scope YOK** — admin herkesin faturasını görür; ama **her PDF indirme
audit'lenir** (`admin.invoice.pdf.download`, `C/InvoiceController.php:57`, KVKK gerekçesi).

#### 1.6.2 Detay — `V/admin/faturalar/show.blade.php`
Başlık `Fatura {number}` + durum rozeti; sağda **PDF İndir** butonu (`:34`).
`<dl class="kv">` 6 satır (`:39-50`):
Kullanıcı (ad + e-posta) · Tarih · Açıklama (plan adı, yoksa "Abonelik") ·
**Ara Toplam (net)** · **KDV (%{tax_rate×100})** · **Genel Toplam** (kalın).
**Kart verisi YOK (B5).** Düzenleme, iptal, yeniden kesme yolu YOK.

---

### 1.7 Kuponlar — liste + form

#### 1.7.1 Liste — `V/admin/kuponlar/index.blade.php`
Alt metin birebir: *"İndirim kodları — checkout'ta doğrulanır, kullanım limiti ve
geçerlilik burada yönetilir · <N> kupon"* (`:26-29`).
Sağda **"Yeni Kupon"** butonu (`:33`) — CRUD **tam** (planların aksine).

**Kolonlar (7, `:42-50`):**
1. **Kod** (kalın)
2. **İndirim** — `%{value}` veya `₺{value/100}`
3. **Plan Kısıtı** — "Tüm planlar" ya da bağlı planların `code` listesi (virgüllü)
4. **Geçerlilik** — "Süresiz" ya da `d.m.Y → d.m.Y`
5. **Kullanım** — `{redemptions_count}` (+ ` / {usage_limit_total}` varsa)
6. **Durum** — Aktif / Pasif
7. **Aksiyon** — Düzenle + Sil (ikon)

**Silme kuralı:** kullanılmış kupon **silinemez** — `CouponRedemption` varsa flash
`coupon-in-use` (`C/CouponController.php:96-100`), ekrandaki uyarı birebir:
*"Bu kupon en az bir kez kullanılmış — kullanım geçmişi için silinemez, bunun
yerine pasifleştirin."* (`:20`). Sil, `saConfirm` modalıyla korunur (`:105-117`).
Süzgeç/arama YOK; `latest('id')->paginate(30)` (`C/CouponController.php:32-37`).

#### 1.7.2 Form — `V/admin/kuponlar/form.blade.php` (create + edit ortak)
Alt metin birebir: *"İndirim türü, tutarı, geçerlilik ve kullanım limitini tanımla"* (`:25`)

**Bölüm "Kupon Künyesi" (`:36`):**

| Alan | name | Tip | Doğrulama (`C/CouponController.php:117-127`) |
|---|---|---|---|
| Kupon Kodu | `code` | text, maxlength 40, `text-transform:uppercase`, required, placeholder "Örn. YAZ2026" | required·string·max:40·**alpha_dash**·unique(coupons,code) |
| İndirim Türü | `type` | select: "Yüzde (%)" = `percent` / "Sabit Tutar (₺)" = `fixed` | required·in(percent,fixed) |
| Değer | `value` | number, min 1, required, placeholder "Yüzde için 1-100, sabit tutar için kuruş" | required·integer·min:1; **percent'te >100 ise sessizce 100'e kırpılır** (`:131-133`) |

İpuçları birebir: *"Yalnız harf/rakam/tire — checkout'ta kullanıcı bu kodu girer,
büyük/küçük harf duyarsız."* · *"Sabit tutarda kuruş girilir — örn. 5000 = ₺50."*

**Bölüm "Geçerlilik ve Limit" (`:63`):**

| Alan | name | Tip | Doğrulama |
|---|---|---|---|
| Başlangıç Tarihi | `valid_from` | date, ipucu "Boş = hemen geçerli." | nullable·date |
| Bitiş Tarihi | `valid_until` | date, ipucu "Boş = süresiz." | nullable·date·**after_or_equal:valid_from** |
| Toplam Kullanım Limiti | `usage_limit_total` | number, min 1, placeholder "Boş = sınırsız" | nullable·integer·min:1 |
| Kullanıcı Başına Limit | `usage_limit_per_user` | number, min 1, varsayılan **1**, placeholder "Boş = sınırsız" | nullable·integer·min:1 |

**Bölüm "Plan Kısıtı" (`:92-102`):**
`Plan::orderBy('position')` üzerinden **checkbox listesi** — `plan_ids[]`
(`plan_ids` array; `plan_ids.*` integer·exists:plans,id). Etiket: plan adı + `(code)`.
Not birebir: *"Hiçbiri seçilmezse kupon TÜM planlara uygulanabilir."*
İlişki `coupon_plans` pivot'una `sync()` edilir (`C/CouponController.php:57,88`).

**Yan ray** — `<x-admin.publish-sidebar>` (`:111-124`): Durum select
(`is_active`: "Aktif" = published / "Pasif" = draft), yayın tarihi kapalı;
edit modunda ek "Kullanım" rozeti (`{sayı} / {limit}` ya da `(sınırsız)`).

Yetki: görüntüleme super + gastro-admin, **yazma super-only** (para akışı).
Audit: `coupon.created` / `coupon.updated` / `coupon.deleted`.

**Kupon tabloları (migration):** `coupons` · `coupon_plans` · `coupon_redemptions`
+ `subscriptions`'a kupon kolonları (`database/migrations/2026_07_31_130010…130040`).

---

### 1.8 Referans CSS envanteri (kaynak-transfer sınıf dili)

`R/admin-fiyatlandirma/sa-fiyatlandirma.css` (kart grid):
`.plan-grid .plan-card .plan-top .plan-name .plan-tag .plan-desc .plan-price
.plan-amount .plan-per .plan-yearly .plan-feats .plan-feat .plan-foot .plan-subs
.plan-acts .intro-band .ia-btn`

`R/admin-fiyatlandirma/sa-fiyatlandirma-form.css` (form + önizleme):
`.form-layout .form-sec .form-sec-tt .form-grid .frow .frow-check .finput .ftext
.cur-wrap .cur-pre .ico-pick .ico-opt .feat-edit .feat-line .side-card .plan-prev
.pp-top .pp-name .pp-tag .pp-price .pp-amount .pp-per .pp-feats .pp-feat .form-actions`
+ JS: `sa-fiyatlandirma-form.js` (₺↔kuruş senkronu, canlı önizleme).

`R/admin-abonelikler/sa-abonelikler.css` (Abonelikler **ve** Faturalar birlikte kullanır):
`.filter-bar .chips .chip .ptable .pstat .bz-name .bz-ico .bz-cat .bz-edit
.pc-grid .pager .pager-info .pager-btns .pg-btn .adm-section .rk-step .stub-note .btn .ia-btn`

---

## 2 · KAZANÇLAR VE ÖDEMELER

**Ekran:** `V/admin/kazanclar/index.blade.php` (231 satır) ·
**Controller:** `C/AdminCreatorEarningController.php` ·
**CSS:** yeni dosya YOK — `R/admin-ayarlar/sa-ayarlar.css` + `R/admin-tarifler/sa-tarifler.css` ödünç alınır (`:23-24`). Emsal ekran: `admin/geri-bildirim`.

### 2.1 🔴 Ekranın temel kuralı
Dosya başı şerhi birebir (`:5-7`):
> "BU EKRAN PARA GÖNDERMEZ. Banka entegrasyonu yok: liste çıkar, transferi Beyar elle yapar, sonra "ödedim" işaretlenir. Hiçbir düğme bankaya bağlanmaz."

Sayfa alt metni birebir (`:31-32`): *"Üretici hakedişlerinin defteri ve ödeme listesi."* + kalın *"Transfer elle yapılır — sistem para göndermez."*

### 2.2 "Yürürlükteki Kurallar" kartı (`:59-91`) — parametreler ekranda GÖSTERİLİR, burada DÜZENLENMEZ
Kart başlığı "Yürürlükteki Kurallar"; sağ üstte **"Ayarla"** butonu →
`route('admin.settings.index', ['tab' => 'finans'])` (`:63`). Yani
**düzenleme yeri Ayarlar'ın Para & Komisyon sekmesidir**, bu ekran değil.

6 satır (`.meta-row`):
1. **Abonelik komisyonu** — `%{billing.subscription_commission_percent}`
2. **Stopaj oranı** — `%{billing.withholding_percent}` (0 ise ` — kesinti yapılmıyor` eklenir)
3. **Ödeme alt sınırı** — `billing.payout_min_minor` (kuruş→₺)
4. **Fatura eşiği** — `billing.invoice_threshold_minor` (kuruş→₺)
5. **İadede üretici payı** — "geri alınır"/"korunur" + sabit kuyruk *"komisyon her hâlde geri gitmez"*
6. **Ödeme bekleyen toplam** — `CreatorPayout` `status=hazir` toplamı (`C/AdminCreatorEarningController.php:85-87`)

Değerler `MoneySettings::all()` üzerinden gelir (`:78`); Blade'de **hiçbir sayı yazılı değil** (`:14-15`).

### 2.3 Dönem seçici ve dönem kapanışı
- Sayfa başında **"Dönemi Kapat"** formu (`:38-44`): `period` metin alanı,
  `pattern="\d{4}-\d{2}"`, required, placeholder `YYYY-MM`, varsayılan **geçen ay**
  (`Carbon::now()->subMonthNoOverflow()`). Doğrulama: required·string·regex `/^\d{4}-\d{2}$/`.
- Sonuç mesajı birebir: *":payouts ödeme satırı hazırlandı, :carried üreticinin bakiyesi devretti."*
- Kural: alt sınırı geçmeyen bakiye **sıfırlanmaz, devreder** (K5).
- Audit: `creator.period_closed` (+`period` + sonuç sayıları).
- **Dönem chip rayı** (`:111-121`): "Tüm dönemler" + defterde **gerçekten var olan**
  dönemler (`donemler()` → `DISTINCT period`, liste uydurulmaz — `C/…Controller.php:167-175`).

### 2.4 İki sekme (`pf-tabs`, `:94-107`)
`?tab=defter` (varsayılan) ve `?tab=odemeler`; her sekmede `.ch-cnt` toplam sayacı.

**Sekme A — Kazanç Defteri, kolonlar (6, `:141-148`):**
| # | Kolon | İçerik |
|---|---|---|
| 1 | Üretici | ad soyad + alt satırda `kind->label()` (kayıt türü) |
| 2 | Kimden | ödeyen üye ("Silinmiş üye" fallback'i var) |
| 3 | Brüt / Komisyon | brüt ₺ + alt satır komisyon ₺ (`· stopaj X` varsa) |
| 4 | Durum | `pstat` rozeti + iade edildiyse `reversed_at` tarihi |
| 5 | Dönem | `YYYY-MM` |
| 6 | Net | kalın `net_minor` |

**Defter durum süzgeci** — yalnız `defter` sekmesinde, `CreatorEarningStatus::cases()`
üzerinden chip + sayaç (`:117-120`). **5 hâl** (`app/Domain/Mentorship/Enums/CreatorEarningStatus.php:34-38`, etiketler `:127-135`):
`beklemede`→"Dönem içinde" · `devredildi`→"Devretti" · `odenebilir`→"Ödenebilir" ·
`odendi`→"Ödendi" · `iptal`→"İade ile geri alındı".
Geçişler enum'da kapalı liste hâlinde (`:75-83`): beklemede→{devredildi,odenebilir,iptal} ·
devredildi→{odenebilir,iptal} · odenebilir→{odendi,iptal} · odendi/iptal **terminal**.
Bakiyeye sayılanlar: beklemede·devredildi·odenebilir (`countsTowardBalance()`, `:105-111`).
Kazanç türü: `CreatorEarningKind` **2 hâl** — `subscription` · `service`.

**Sekme B — Ödeme Listesi, kolonlar (6, `:132-139`):**
| # | Kolon | İçerik |
|---|---|---|
| 1 | Üretici | ad soyad + `{n} kayıt` (`earning_count`) |
| 2 | Dönem | `YYYY-MM` |
| 3 | Net | kalın `total_minor` |
| 4 | Durum | `pstat` + `invoice_required` ise "fatura alındı"/"fatura bekleniyor" |
| 5 | IBAN | **maskeli** — `App\Support\Iban::mask()` |
| 6 | İşlem | aşağıya bkz. |

**Ödeme durumu — 2 hâl, üçüncüsü kasten yok** (`CreatorPayoutStatus.php:31-32`):
`hazir`→"Ödemeye hazır" · `odendi`→"Ödendi" (terminal).
Şerh birebir (`:20-23`): *""GÖNDERİLDİ"/"İŞLEMDE" GİBİ BİR ARA HÂL EKLENMEDİ: o
hâllerin anlamı bir BANKA ENTEGRASYONU varsayar … bu turda banka entegrasyonu
YOKTUR."* `odendi → hazir` geçişi YOK.

### 2.5 Ödeme işaretleme akışı — **tek tek, toplu DEĞİL**
`status = hazir` satırında `.sa-actionbar` (`:170-186`):
1. `invoice_required && invoice_received_at === null` ise → **"Fatura Alındı"** butonu
   (POST `admin.kazanclar.fatura`, alan yok). Audit: `creator.payout_invoice_received`.
2. **"Ödedim"** formu: `note` metin alanı (placeholder *"Ödeme notu (opsiyonel)"*,
   nullable·string·max:500) + buton; `$item->isPayable()` false ise buton `disabled`.
   POST `admin.kazanclar.odendi`. Yorum birebir: *""Ödendi" bir KAYITTIR, bir transfer değil."*
   Audit: `creator.payout_paid` (+`period`, `total_minor`, `note`).
   Hata karşılığı **403 değil 422** (`ValidationException`) — yetki tam, engel kaydın hâli.
`hazir` değilse hücrede yalnız `paid_at` tarihi ya da `—`.

- **Onay modalı YOK** (ne "Ödedim"de ne "Dönemi Kapat"ta) — plan/abonelik ekranlarının
  aksine `saConfirm` bu ekranda hiç çağrılmıyor.
- **Toplu seçim / checkbox YOK. Dışa aktarma (CSV/PDF) YOK.** ("Ödeme listesini çıkarır"
  ifadesi ekranda `hazir` satırları açmak anlamındadır, dosya üretmek değil.)
- `paginate(25)` + `withQueryString()`.

### 2.6 Düzenlenebilir para alanları nerede? → **Ayarlar > "Para & Komisyon"**
Hiçbiri kazanç ekranında düzenlenmez. Tek okuma noktası
`app/Domain/Mentorship/Services/MoneySettings.php` (7 anahtar sabiti, `:29-53`):

| Sabit | Anahtar | Başlangıç (K13) |
|---|---|---|
| `KEY_SUBSCRIPTION_COMMISSION` | `billing.subscription_commission_percent` | %10 |
| `KEY_SERVICE_COMMISSION` | `billing.service_commission_percent` | %10 (Gastro'da bugün kullanılmıyor — K4) |
| `KEY_WITHHOLDING` | `billing.withholding_percent` | **0** (bilinçli; vergi oranı uydurulmadı, `:87-98`) |
| `KEY_PAYOUT_MIN` | `billing.payout_min_minor` | 1000 TL = 100000 kuruş |
| `KEY_INVOICE_THRESHOLD` | `billing.invoice_threshold_minor` | 10.000 TL = 1000000 kuruş |
| `KEY_REFUND_CLAWS_BACK_CREATOR` | `billing.refund_claws_back_creator_share` | varsayılan `true` |
| `KEY_PAYOUT_PERIOD` | `billing.payout_period` | `month_end` (tek geçerli değer, beyaz liste) |

Okuma deseni: `Settings::get(anahtar, config(...))` — `config/billing.php` **yalnız
fallback**. Yüzdeler `float` ama 0–100 arasına kelepçelenir (`:180-185`); tutarlar
kuruş tamsayı, negatif olamaz (`:188-191`). **Hesap ayrı sınıfta**
(`CreatorPayoutCalculator`) — bu sınıf parametre okur, hesap yapmaz.

### 2.7 Bakiye / birikim gösterimi
- Ekranda tek toplam: **"Ödeme bekleyen toplam"** (`hazir` payout toplamı).
- Üretici başına biriken bakiye için **ayrı bir kolon/kart YOK**; birikim
  `devredildi` durumlu defter satırlarıyla temsil edilir ve chip sayacından okunur.
- `creator_payouts` şeması (`database/migrations/2026_08_26_125000_create_creator_payouts_table.php:30-65`):
  `chef_profile_id · period(7) · currency(3, TRY) · total_minor · gross_minor ·
  commission_minor · withholding_minor · earning_count · status · iban_snapshot(34) ·
  invoice_required · invoice_received_at · paid_at · paid_by_id · note · timestamps`;
  **unique(chef_profile_id, period)**.
- Üretici ödeme bilgileri `chef_profiles`'a eklenmiş (`…2026_08_26_140000…:42-44`):
  `iban(34) · iban_holder_name · can_issue_invoice(bool, default false)`.

---

## 3 · MENÜ VE NAVİGASYON

**Ekran:** `V/admin/menu/index.blade.php` (171 satır) · **Controller:** `C/MenuController.php`
**Varlıklar:** `R/admin-menu/sa-menu.css` (6890 B) + `R/admin-menu/sa-menu.js` (16408 B)
+ `R/admin-taksonomi/sa-taksonomi.css` (mini-modal primitifleri için).

### 3.1 Kaç menü yönetiliyor → **2**
`.mb-switch` iki buton (`:81-84`): **"Üst Menü"** (`data-menu="header"`) ve
**"Alt Menü (Footer)"** (`data-menu="footer"`). Sunucu tarafı da bu ikiliyle
sınırlı: `abort_unless(in_array($location, ['header','footer']), 404)`
(`C/MenuController.php:89`). **Hesap menüsü ya da üçüncü bir konum YOK.**
Seçim istemci-taraflı sekme; iki menünün verisi tek JSON'da birden gelir
(`data-menus`, `:158`).

### 3.2 Yerleşim
`.mb-layout` iki sütun: solda **ağaç** (`.tree-head` başlığı + `<b id="nodeCount">` öğe
sayacı + `#treeList`), sağda `.side-stack` içinde iki kart:
**"Öğe Ekle"** havuzu (`#poolList`) ve **"Canlı Önizleme"** (`.nav-prev > #navPrev`).
Boş hâl: *"Bu menü boş / Sağdaki havuzdan öğe ekleyerek menüyü oluşturun."* (`:99-103`)

### 3.3 🔴 Kalem ekleme: **serbest form YOK — sabit havuzdan seçim var**
Bu Gastro'nun en belirgin sapması. Ekranda "yeni menü kalemi" formu (etiket + URL +
tip alanları) **yoktur**. Bunun yerine `sa-menu.js:25-47` içinde **17 elemanlı sabit
`POOL` dizisi** var; her eleman `{ic, lbl, tgt}` üçlüsü ve tıklanınca menüye eklenir.

POOL (17): Ana Sayfa `/` · Tarifler `/tarifler` · Bugün Ne Pişirsem? `/bugun-ne-pisirsem` ·
Dolapta Ne Var? `/tarif-bulucu` · Mutfak Sırları `/mutfak-sirlari` ·
Püf Noktaları `/puf-noktalari` · Sözlük `/sozluk` · Video Mutfağı `/video-mutfagi` ·
Şefler `/sefler` · Dada Seçkisi `/dada-seckisi` · Haftalık Menü `/haftalik-menu` ·
Pro `/pro` · SSS `/sss` · Hakkımızda `/hakkimizda` · İletişim `/iletisim` ·
Gizlilik Politikası `/yasal/kvkk` · Kullanım Koşulları `/yasal/kullanim`.

**Sonuç: "Özel URL" kalemi eklenemez, hedef adres elle yazılamaz, ikon seçilemez.**
Sunucu `tgt`/`ic` alanlarını kabul eder ve doğrular (aşağıda) — kısıt tamamen UI'dadır.

### 3.4 Bir kalemin düzenlenebilir alanları

| Alan | Nerede | Tip / sınır | Sunucu doğrulaması (`C/MenuController.php:93-105`) |
|---|---|---|---|
| Etiket TR | "Düzenle" mini-modalı, `#miLabel` | text, maxlength 60, **required** | `items.*.lbl.tr` required·string·max:60 |
| Etiket EN | modal, `#miLabelEn` | text, maxlength 60, opsiyonel | `items.*.lbl.en` nullable·string·max:60 |
| Açıklama TR | hem satır içi `.node-desc` input hem modal `#miDesc` | text, maxlength 160, placeholder *"Açıklama (dropdown alt metni)"* | `items.*.desc.tr` nullable·string·max:160 |
| Açıklama EN | modal, `#miDescEn` | text, maxlength 160 | `items.*.desc.en` nullable·string·max:160 |
| Hedef (`tgt`) | **düzenlenemez** — havuzdan gelir, satırda `.node-target` olarak salt gösterilir | — | `items.*.tgt` **required**·string·max:255 |
| İkon (`ic`) | **düzenlenemez** — havuzdan gelir | — | `items.*.ic` nullable·string·max:60 |
| Mega menü | satır butonu `data-act="mega"`, yalnız top-level | boolean toggle | `items.*.mega` sometimes·boolean; sunucu child'da bayrağı **düşürür** (`:130`) |
| Görünürlük | satır butonu `data-act="vis"` — "Görünür — gizle" / "Gizli — göster" | boolean | `items.*.hidden` required·boolean |
| Alt menü mü | `indent`/`outdent` butonları + sürükle | boolean | `items.*.child` required·boolean |
| id | JS state'te taşınır (EN koruması için) | — | `items.*.id` nullable·integer |

**Rol/izin bazlı görünürlük alanı YOK. "Yeni sekmede aç" alanı YOK.**
Sıra ayrı bir alan değil; dizideki konumdan türer (`order = $order++`, `:135`).

### 3.5 Sıralama ve iç içe seviye
- **Sürükle-bırak VAR** — vanilla HTML5 D&D, CDN'siz; `.node-grip` tutamacı gerçek
  tutamaç (`sa-menu.js` `makeRowDraggable`/`makeContainerDropZone`; blade `:20-25`).
  Referansta bu tutamaç yalnız görsel ikondu, burada işlevsel hâle getirildi.
- **Buton yolları da korunur:** `up · down · indent · outdent` (`sa-menu.js:147-151`,
  eylemler `:180-184`). `indent` yalnız bir önceki kalem top-level ise etkin;
  `outdent` yalnız child'da etkin.
- **🔴 İç içe seviye: TAM 2 (üst + alt).** Model düz bir listedir; `child` bir
  **boolean**tır, derinlik sayısı değil. Sunucu tarafında parent daima "son görülen
  top-level" olur (`$lastTopLevelId`, `C/MenuController.php:126-142`) → **üçüncü
  seviye kurulamaz**. İlk satır child olarak gelirse sessizce top-level'a düşer.
- Satırda `child` ise `.node-tag` "Alt menü" rozeti basılır (`sa-menu.js:144`).

### 3.6 Kaydetme: **toplu, REPLACE-ALL**
Tek **"Menüyü Kaydet"** butonu (`#saveMenu`, `:78`). Satır satır CRUD ucu **YOK**.
`POST admin.menu.save/{location}` → `DB::transaction`: o konumun tüm satırları
`delete()`, gönderilen sıralı liste yeniden `create()` edilir
(`C/MenuController.php:107-145`). JSON `{status:'ok'}` döner; başarı/başarısızlık
`saToast` ile bildirilir (*"{Menü adı} kaydedildi"* / *"Kaydetme başarısız — tekrar deneyin"*).
Silme de `saConfirm` ile korunur: *"Menü öğesini kaldır"* / *""{etiket}" öğesi bu menüden kaldırılacak."*
Audit: `admin.menu.save` (+`location`, `count`).

**REPLACE-ALL'ın bedeli:** satır silindiği için EN çevirisi kaybolabilirdi; controller
silmeden **önce** mevcut satırları `id`'ye göre yakalar ve blank EN geldiğinde geri
yazar (`localized()` / `localizedOptional()`, `:147-193`).

**Mini-modal sunucuya AYRI istek atmaz** — yalnız JS state'i günceller (`:127-131`);
gerçek kaydetme hâlâ tek butondadır.

### 3.7 Ek: ölçülmüş kırılım yaması
Blade `:58-77` — 981–1165 px arasında `.node-ctrl` (6 buton, 268 px) rail açıkken
taşıp `#poolList`'in üstüne biniyordu; ekrana kapsanmış 5 bildirimlik bir
`@media` bloğu eklenmiş. Ölçüm 1 px adımla yapılmış: 981 px'te 14/75 çakışma →
**1136 px'te 0/75**, üst sınır 1165 px'e güvenlik payıyla çekilmiş.

### 3.8 Menü CSS sınıf dili
`.mb-switch .ms .mb-layout .tree .tree-head .th-tt .tree-count .tree-list
.node .node-grip .node-ico .node-id .node-label .node-target .node-tag .node-ctrl
.nc-btn .pool-list .pool-item .pool-ico .pool-id .pool-add
.side-stack .nav-prev .np-bar .np-link .np-logo .np-empty`

---

## 4 · AYARLAR VE SAYFALAR / SEO

### 4.1 Ayarlar sekmeleri — **8 gerçek sekme + 1 ayrı rota**

`C/SettingsController.php:78` (bağlayıcı liste):
```php
private const TABS = ['genel','marka','sosyal-medya','kunye','entegrasyon','bildirim','uretici','finans'];
```
Sekme çubuğu `V/admin/ayarlar/_tabbar.blade.php:11-29` — **9 nav kalemi**, çünkü
sonuncusu `?tab=` değil ayrı bir rotadır:

| # | key | Ekrandaki ad (birebir) | İkon | Hedef |
|---|---|---|---|---|
| 1 | `genel` | Genel | `fa-sliders` | `?tab=genel` |
| 2 | `marka` | Marka | `fa-palette` | `?tab=marka` |
| 3 | `sosyal-medya` | Sosyal Medya | `fa-share-nodes` | `?tab=sosyal-medya` |
| 4 | `kunye` | Künye & Kurumsal | `fa-stamp` | `?tab=kunye` |
| 5 | `entegrasyon` | Entegrasyon | `fa-plug` | `?tab=entegrasyon` |
| 6 | `bildirim` | Bildirim | `fa-regular fa-bell` | `?tab=bildirim` |
| 7 | `finans` | **Para & Komisyon** | `fa-sack-dollar` | `?tab=finans` |
| 8 | `uretici` | **Üretici Eşikleri** | `fa-user-graduate` | `?tab=uretici` |
| (9) | `sayfa-tanimlari` | Sayfa Tanımları | `fa-table-columns` | `route('admin.page-defs.index')` — **ayrı rota** |

Yalnız aktif panel render edilir (sekme = gerçek sunucu rotası).

### 4.2 Sekme sekme alan listeleri (tip + doğrulama)

Doğrulama kaynağı `C/SettingsController.php::editable()` (`:196-360`) — bu dizi aynı
zamanda **secret-guard allowlist'idir**: listede olmayan anahtar sessizce yoksayılır
(`:129-131`). Yazma yalnız `super` (`manage-settings` gate, `:122`);
görüntüleme super + gastro-admin. Her kaydetme audit'li: `admin.settings.update`
(+`tab`, değişen anahtarlar).

#### Sekme 1 — Genel
Bölümler: **"Site Bilgileri"** (`index.blade.php:151`) · **"Site Durumu"** (`:196`) ·
**"Abonelik Kotaları"** (`:223`)

| Alan (etiket birebir) | Anahtar | Tip | Doğrulama |
|---|---|---|---|
| Site adı | `general.site_name` | text | nullable·string·max:255 |
| Slogan | `general.slogan` | text | nullable·string·max:255 |
| İletişim e-postası | `general.contact_email` | email | nullable·email·max:255 |
| Telefon | `general.contact_phone` | tel | nullable·string·max:32 |
| Varsayılan dil | `general.default_locale` | select (`config('app.supported_locales')`) | nullable·in(supported_locales) |
| Saat dilimi | `general.timezone` | select | nullable·string·max:64 |
| Bakım modu | `general.maintenance_mode` | switch (checkbox) | nullable·boolean |
| Kayıt açık | `general.registration_open` | switch | nullable·boolean |
| Duraklatma tavanı (ay) | `billing.pause_max_months` | number, min 1 max 12 step 1 | **required**·integer·min:1·max:12 |

Şerh (`:207-215`): `billing.creator_pool_percent` **KALDIRILDI** (Y13.2) — K13'te
havuz kavramı yok, tek okuyucusu ölü bir sınıftı.

#### Sekme 2 — Marka
Bölümler: **"Logo"** (`:236`) · **"Kurumsal Renkler"** (`:263`) · **"Tipografi"** (`:277`)

| Alan | Anahtar | Tip | Doğrulama |
|---|---|---|---|
| Logo | `brand.logo_media_id` | dosya yükleme (`admin.media.store` → hidden media_id), kabul `image/jpeg,png,webp` | nullable·integer·exists:media,id |
| Aktif palet | — | **salt gösterim** (`.brand-swatches`), kaydedilen alan YOK | — |
| Ana yazı tipi | — | `<select disabled>` — **kaydedilmiyor** | — |

Yani Marka sekmesinde **yazılabilir tek alan logo**dur.

#### Sekme 3 — Sosyal Medya
Bölüm: **"Sosyal Medya Hesapları"** (`:297`)
- `brand.social_links` — **repeater**: her satır `platform` (`<select>`, seçenekler
  `config/social_platforms.php`) + `url` (`type=url`, placeholder `https://…`) +
  satır sil butonu; **"Platform Ekle"** butonuyla satır eklenir (`:303-314`).
  Doğrulama: `nullable·array` + satır bazlı ayrı doğrulama (`validateSocialLinks()`,
  generic motordan **çıkarılmış**, `:132-144`).
- Kaydedince **fan-out**: eski tekil `brand.social.{instagram,x,youtube,tiktok,pinterest,facebook,linkedin}`
  anahtarlarına da yazılır (`syncLegacySocialKeys`, `:178-180`) — footer/iletişim
  hâlâ o anahtarları okuyor.
- Sekmede ayrıca **DadaGourmet sosyal hesapları** ayrı aile olarak tanımlı
  (`:232-249` yorum bloğu) — liste `gourmet.social.platforms`'tan türer, elle yazılmaz.

#### Sekme 4 — Künye & Kurumsal
Bölümler: **"Tüzel Kimlik (5651 Künyesi)"** (`:331`) · **"İletişim & İş Birliği"** (`:362`) ·
**"Konum"** (`:384`) · **"DadaGourmet İletişim Bilgileri"** (`:421`)

| Alan (etiket birebir) | Anahtar | Tip | Doğrulama |
|---|---|---|---|
| Ticari Ünvan | `company.legal_name` | text | nullable·string·max:255 |
| Tüzel Kişi Temsilcisi | `company.legal_rep` | text | nullable·string·max:255 |
| Yayın Yönetmeni | `company.editor` | text | nullable·string·max:255 |
| UETS Adresi | `company.uets` | text | nullable·string·max:64 |
| Yer Sağlayıcı | `company.host_provider` | text | nullable·string·max:255 |
| Kurumsal E-posta | `company.email` | email | nullable·email·max:255 |
| İletişim Telefonu | `company.phone` | tel | nullable·string·max:32 |
| Reklam & İş Birliği E-postası | `company.partnership_email` | email | nullable·email·max:255 |
| Yönetim Yeri / Adres | `company.address` | text | nullable·string·max:500 |
| Harita Embed Adresi | `company.map_embed_url` | url | nullable·url·max:500 + **`MapEmbedUrl::isValid()`** closure'ı |
| (Gourmet) E-posta | `gourmet.company.email` | email | nullable·email·max:255 |
| (Gourmet) Telefon | `gourmet.company.phone` | tel | nullable·string·max:32 |
| (Gourmet) Reklam ve İş Birliği E-postası | `gourmet.company.partnership_email` | email | nullable·email·max:255 |
| (Gourmet) Adres | `gourmet.company.address` | text | nullable·string·max:500 |
| (Gourmet) Harita Embed Adresi | `gourmet.company.map_embed_url` | url | nullable·url·max:500 + `MapEmbedUrl::isValid()` |

Harita hatası birebir: *"Yalnızca OpenStreetMap veya Google Haritalar embed adresi
kabul edilir (https)."* Ekranda `.map-embed-preview` canlı önizleme var.

#### Sekme 5 — Entegrasyon
Bölümler: **"E-posta (SMTP)"** (`:457`) · **"Bağlı Servisler"** (`:485`) · **"Aktif Özellikler"** (`:533`)

| Alan | Anahtar | Tip | Doğrulama |
|---|---|---|---|
| SMTP sunucu / Port / Kullanıcı adı | — | **`disabled`, salt-okunur** (`config('mail…')`) | — (yazılamaz) |
| Measurement ID (GA) | `integrations.google_analytics_id` | text, placeholder `G-XXXXXXXXXX` | nullable·string·max:64 |
| Pixel ID (Meta) | `integrations.meta_pixel_id` | text, placeholder `123456789012345` | nullable·string·max:64 |
| Meilisearch | `integrations.meilisearch` | switch | nullable·boolean |
| NSFW tarama | `integrations.nsfw_scan` | switch | nullable·boolean |
| Video | `integrations.video` | switch | nullable·boolean |

**"Bağlı Servisler" rozetleri (5, `integrationStatus()`, `:365-375`):**
`google_analytics · iyzico · meta_pixel · paytr · nilvera`.
Server-secret servislerde form YOK; **"Bağla"** yalnız salt-okunur `.env` anahtar
rehberi açar (`integrationGuides()`, `:385-393`):
iyzico → `IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL, IYZICO_WEBHOOK_SECRET` ·
paytr → `PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT` ·
nilvera → `INVOICE_PROVIDER=nilvera`.

#### Sekme 6 — Bildirim
Bölümler: **"Yönetici Bildirimleri"** (`:559`) · **"Üye Bildirimleri (Varsayılan)"** (`:573`)

| Alan | Anahtar | Tip | Doğrulama |
|---|---|---|---|
| Yeni üye | `notifications.admin.new_member` | switch | nullable·boolean |
| İçerik şikâyeti | `notifications.admin.content_flag` | switch | nullable·boolean |
| Yeni Pro abone | `notifications.admin.new_pro_subscriber` | switch | nullable·boolean |
| Haftalık özet | `notifications.admin.weekly_summary` | switch | nullable·boolean |
| Tarif beğenisi | `notifications.member_default.recipe_like` | switch | nullable·boolean |
| Pazarlama e-postası | `notifications.member_default.marketing_email` | switch | nullable·boolean |

Şerh (AY4, `:31-39`): eski olay×kanal bildirim **matrisi** bu sekmeden kaldırıldı —
o, üyenin kişisel tercihi (hesabim ekranı), admin'in global ayarı değil.

#### Sekme 7 — Para & Komisyon (`finans`)
Bölümler: **"Komisyon Oranları"** (`:593`) · **"Ödeme Kuralları"** (`:619`) ·
**"Para Kazanma Kapısı"** (`:646`) · **"İade"** (`:667`)

| Alan (etiket birebir) | Anahtar | Tip | Doğrulama (`:341-357`) |
|---|---|---|---|
| Abonelik komisyonu (%) | `billing.subscription_commission_percent` | number min 0 max 100 step 0.01 | **required**·numeric·min:0·max:100 |
| Hizmet komisyonu (%) | `billing.service_commission_percent` | number min 0 max 100 step 0.01 | required·numeric·min:0·max:100 |
| Stopaj oranı (%) | `billing.withholding_percent` | number min 0 max 100 step 0.01 | required·numeric·min:0·max:100 |
| Ödeme alt sınırı (kuruş) | `billing.payout_min_minor` | number min 0 step 1 | required·**integer**·min:0 |
| Fatura eşiği (kuruş) | `billing.invoice_threshold_minor` | number min 0 step 1 | required·integer·min:0 |
| Ödeme dönemi | `billing.payout_period` | select | required·in(`month_end`) — **tek seçenek** |
| Para kazanma kapısı | `billing.require_creator_approval_to_earn` | switch | nullable·boolean |
| İadede üretici payı geri alınır | `billing.refund_claws_back_creator_share` | switch | nullable·boolean |

🔴 Anahtar adları Blade'e elle yazılmıyor; `MoneySettings::KEY_*` sabitlerinden
geliyor (`:341-347`) — "form yazar, motor okumaz" hatasına karşı.
Para kazanma kapısı sabiti: `CreatorEarningGate::KEY_REQUIRE_APPROVAL` (`:356`),
varsayılan **kapalı**.

#### Sekme 8 — Üretici Eşikleri (`uretici`)
Bölüm: **"İçerik Üreticisi Eşikleri"** (`:691`)

| Alan (etiket birebir) | Anahtar | Tip | Doğrulama (`:359-364`) |
|---|---|---|---|
| Yayınlanmış tarif | `creator.threshold.recipe_count` | number min 0 step 1 | **required**·integer·min:0·max:100000 |
| Yayınlanmış püf noktası | `creator.threshold.tip_count` | number min 0 step 1 | required·integer·min:0·max:100000 |
| Takip ettiği kişi | `creator.threshold.following_count` | number min 0 step 1 | required·integer·min:0·max:100000 |
| Takipçi | `creator.threshold.follower_count` | number min 0 step 1 | required·integer·min:0·max:100000 |

Başlangıç değerleri (50 · 25 · 10 · 10) **Blade'e kopyalanmaz**;
`EvaluateCreatorEligibility::defaults()`'tan `fallback()` yoluyla gelir (`:319-328`).
`min:0` kasıtlı — bir ölçütü 0'a çekmek "bu ölçütü arama" demenin tek yolu;
`required` kasıtlı — boş bırakmak "sınır yok" ile "sınır 0"ı okunamaz kılardı.

**Boş-değer davranışı (`cast()`, `:396-410`):** nullable kural + boş değer → **null**
(tip-cast'e hiç girmez). Bu bir QA bulgusunun düzeltmesi: `(int)''===0` nullable
alanları sessizce 0'a düşürüyordu.

#### Ayarlar CSS sınıf dili (`R/admin-ayarlar/sa-ayarlar.css`)
`.pf-tabbar .pf-tabs .tabpane .form-sec .form-sec-tt .form-grid .frow .finput .ftext
.set-row .set-txt .switch .int-row .int-item .int-ico .int-id .int-toggle .int-detail
.int-guide .int-env-keys .soc-list .soc-row .soc-ico .soc-add .ie-del
.upload-box .upload-prev .upload-info .brand-swatches .swatch .map-embed-preview .form-actions`

---

### 4.3 Sayfa Tanımları — ne yönetiyor?

**Cevap: statik sayfa META'sı DEĞİL — public sayfaların BÖLÜM İÇERİĞİ
(başlık/eyebrow/açıklama metinleri) + o bölümlerin GÖRSELLERİ.**

Controller docblock birebir (`C/PageDefinitionController.php:20-23`):
> "Hero modülünün yerini alan içerik yönetim yüzeyi: public sayfaların section
> başlık/eyebrow/açıklama alanları + hero medyası admin'den yönetilir, public'te
> birebir render'a bağlanır (üç bacak)."

**Depolama:** ayrı tablo YOK — `Settings` anahtarları
(`PageDefs::key($page,$section)`). Registry `app/Support/PageDefs.php` (1028 satır)
**secret-guard allowlist'idir**: kayıtlı olmayan alan sessizce yoksayılır
(`C/PageDefinitionController.php:82-97`).

#### Liste ekranı — `V/admin/sayfa-tanimlari/index.blade.php` (53 satır)
Ayarlar kabuğunun içinde (`@include('admin.ayarlar._tabbar', ['activeTab' => 'sayfa-tanimlari'])`, `:23`).
Bölüm başlığı "Sayfalar", ipucu birebir:
> "Her sayfanın bölüm başlıkları, açıklamaları ve görsellerini buradan yönetin.
> Kart/tarif sayaçları sistemden gelir, form alanı yoktur."

Her satır (`.int-row`): ikon · ad · alt bilgi (`{n} bölüm` ya da grup çocukları
ya da *"Yönetilebilir alanlar sonraki dilimde açılacak."*) · sağda **Düzenle**
butonu (`ready` ise) veya `pstat off` **"Sonraki dilim"** rozeti.

**Registry'de `'ready' => true` işaretli sayfa sayısı: 16** (grep `'ready' =>`
üzerinde 16 eşleşme, `app/Support/PageDefs.php`). Ölçülen anahtarlar (satır no):
`anasayfa`:143 · `tarifler`:153 · `bnp`:160 · `tarif-bulucu`:167 · `puf`:174 ·
`mutfak-sirlari`:182 · `video`:195 · `mutfaga-giris`:207 · `kesfet`:220 ·
`mekanlar`:226 · `sefler`:232 · `kategori`:248 · `arama`:263 ·
`olcu-birimleri`:280 · `auth`:308 (+1 daha).

#### Düzenleme ekranı — `V/admin/sayfa-tanimlari/edit.blade.php` (372 satır)
`enctype="multipart/form-data"`; her `section` bir `.form-sec` bloğu
(`form-sec-tt` = section adı), fk-* form dili.

**Metin alanı tipleri (registry `PageDefs.php:994-1009`):**
| Tip | Üretici | Render | Kural |
|---|---|---|---|
| `text` | `self::text($label,$default,$max,$hint)` | `<input class="finput" type="text">` | nullable·string·max:N |
| `text` (accent) | `self::accent(...)` | aynı + ipucu: *"\*yıldız\* içine aldığın kısım vurgulu (accent) görünür — ör. Ne \*pişirsem?\*"* | nullable·string·max:N |
| `textarea` | `self::textarea(...)` | `<textarea class="ftext tinymce-editor tinymce-inline">` (**inline-only TinyMCE**) | nullable·string·max:N |

Alan adı deseni: `sections[{sectionKey}][{fieldKey}]` (`:233,235`).
Yazma yetkisi yoksa alan `disabled`.

**Tipik bölüm şablonu** (`heroLike()`, `PageDefs.php:740-766`): 3 alan —
`eyebrow` ("Üst başlık (eyebrow)", max 80) · `title` ("Başlık", accent, max 120) ·
`lead` ("Açıklama", textarea, max 400). `triple()` (`:980-991`) aynı üçlü, accent'siz.

**Medya modları — 4 ayrı yol:**
| Mod | `'media' =>` | Girdi adları | Kural |
|---|---|---|---|
| Hero (F5, iki-mod) | `true` | `hero_media_type` (select: image/video) · `hero_video_url` · `hero_media` (dosya) · `hero_poster` (dosya) · `hero_remove_media` (checkbox) | `hero_media_type` required·in(image,video) · `hero_video_url` nullable·url·max:2048 · dosyalar nullable·image·mimes:jpeg,png,webp·max:`MediaService::maxKilobytes()` |
| Route-strip | `'image'` | `route_bg` · `route_remove_bg` | nullable·image·mimes:jpeg,png,webp·max:… |
| Banner | `'banner'` | **section-scoped**: `banner_bg[{section}]` · `banner_remove_bg[{section}]` | aynı |
| Scoped görseller | `'images' => [...]` | `images[{section}][{field}]` · `images_remove[{section}][{field}]` | aynı |

🔴 Banner'ın section-scoped olması bir **kusur düzeltmesidir** (2026-08-05):
önceden sabit `banner_bg` idi ve `mutfaga-giris` sayfasındaki 3 banner bölümü aynı
adı paylaşıyordu — bir bandı yüklemek diğerini eziyordu
(`C/PageDefinitionController.php:104-124`, test: `LessonPageDefsTest::test_uploading_one_banner_does_not_overwrite_a_sibling_banner_section`).

Kırpma: her yükleme alanı `data-crop-aspect` / `data-crop-enabled` taşır
(`config('…pagedef.*')`). Yükleme `WebpConverter::store($file, 'pagedef/{page}/{section}')`.
Kaydetme flash'ı birebir: *"Sayfa tanımları kaydedildi."*; audit `page_definition.update`
(+`page`, `sections`).
Yazma yetkisi `manage-page-defs` — **gastro-admin DAHİL** (Ayarlar'ın super-only
kuralından farklı; içerik-editöryel iş sayılır).

**Şerh (`C/PageDefinitionController.php:29-31`):** `sa-admin` referans dizininde
"Sayfa Tanımları" sayfası **YOKTUR** — bu Beyar direktifli yeni yüzeydir; desen
dili mevcut Ayarlar ekranından türetilmiştir.

---

### 4.4 Sayfalar & SEO — `V/admin/sayfalar/index.blade.php` (229) + `form.blade.php` (446)

#### 4.4.1 Liste
Başlık **"Sayfalar & SEO"**, alt metin birebir:
*"Statik içerik sayfaları ve arama motoru meta yönetimi · <N> sayfa"* (`:47`)

**Üst aksiyonlar (3, `:52-57`):** **Dışa Aktar** (`admin.sayfalar.export` — gerçek CSV,
BOM'lu UTF-8, `;` ayraçlı) · **Yeni SEO Sayfası** (`create?type=seo_landing`) ·
**Yeni Sayfa** (`create`).

**Süzgeç — tamamen istemci-taraflı** (`:135-229`; sunucu TÜM sayfaları döner,
`C/PageController.php:54`):
- Arama `#pgSearch` — placeholder *"Sayfa adı, URL ara…"*; başlık + URL üzerinde `tr` locale'li eşleşme
- Durum chip'leri `#stChips`: **Tümü / Yayında / Taslak**, `.ch-cnt` sayaçlı
  (sayaçlar sunucudan ayrı `count()` sorgularıyla — `C/PageController.php:44-48`)
- İstemci-taraflı sayfalama `PER_PAGE = 30` (`:141`), pencere mantığı 7 sayfa eşiğiyle

**Kolonlar (5, `:78-84`):** Sayfa (ikon + başlık + `SEO Landing` rozeti + `/slug`) ·
**SEO Durumu** · Durum · Güncellenme (`d M` + `H:i`) · Aksiyon (Düzenle + Sil ikonları).

Kapsam şerhi (`:8-13`): referansın 9 mock satırı yerine yalnız gerçek+wired
3 sayfa (Hakkımızda/SSS/İletişim) + SEO-landing satırları; sorgu
`Page::brand('gastro')`.

#### 4.4.2 🔴 SEO ölçütü ve skoru — iki ayrı uygulama

**(a) Liste rozeti — sunucu tarafı.** `App\Domain\Gastro\Models\Page::seoScore()`
accessor (`Page.php:96-116`). **4 ölçüt × 20 puan:**

| Ölçüt | Geçme koşulu | Puan |
|---|---|---|
| Başlık | `seo_title` (boşsa `title`) uzunluğu **40–60** karakter | 20; dolu ama aralık dışıysa **10**; boşsa 0 |
| Açıklama | `seo_description` uzunluğu **120–158** karakter | 20; dolu ama aralık dışıysa **10**; boşsa 0 |
| URL | `slug` `/^[a-z0-9-]+$/` | 20 / 0 |
| Anahtar kelime | `seo_keywords` boş değil | 20 / 0 |

🔴 **Ölçülen tutarsızlık:** docblock "5-kriterli formül" diyor (`Page.php:91`) ama
görsel kriteri **modelde hiç yok** — accessor'da 5. terim yazılmamış, tavan
fiilen **80**. Etiket eşiği ise 100'lük ölçeğe göre (`index.blade.php:87-89`):
`≥75` → "İyi" (`.good`), `≥50` → "Orta" (`.mid`), altı → "Düşük" (`.low`).
Yani **bu modelde alınabilecek en yüksek skor 80** ve "İyi" yalnız dört ölçütün
dördü de tam geçtiğinde mümkün. Rozet metni: `{etiket} · {skor}` (`.seo-pill`).

**(b) Form yan rayı — canlı skor.** `V/components/admin/publish-sidebar.blade.php`.
**5 ölçüt × 20 puan, tavan 100** (`:99-100`):
başlık (40–60) · açıklama (120–158) · URL (`[a-z0-9-]+`) · anahtar kelime (dolu) ·
**kapak görseli** (`seoHasCoverImage`, statik bool). Her ölçüt **opsiyoneldir** —
prop verilmezse o satır `.seo-checks`te hiç render edilmez (`:15-18`), bu yüzden
Sayfalar formu 4/5 ölçüt üzerinden puanlanır.

**Ekrandaki ölçüt metinleri (birebir, `:157-169`):**
- "Meta başlık uygun uzunlukta"
- "Meta açıklama dolu"
- "URL temiz ve okunabilir"
- "Anahtar kelime tanımlı"
- "Kapak görseli eklendi"

Görsel: `.score-ring` (CSS `--p` değişkeniyle sürülen halka) + `.score-num` +
`.seo-checks > .seo-chk.pass/.fail`. Canlı güncelleme: `seoTitleField` /
`seoDescriptionField` / `seoKeywordField` prop'larıyla verilen input'lara JS
dinleyici bağlanır (`:186-200`). Sayfalar formundaki bağlama (`form.blade.php:333-339`):
`meta_baslik[tr]` · `meta_aciklama[tr]` · slug değeri · `anahtar_kelimeler[tr]`.

**SEO CSS'i:** `R/admin-sayfalar/sa-sayfalar-form.css` —
`.seo-score .score-ring .score-num .score-meta .seo-checks .seo-chk
.serp .serp-fav .serp-title .serp-url .serp-desc .serp-empty .char-meter
.slug-wrap .slug-pre .st-card .st-list .st-body .st-side .st-num
.cb-kind .cb-cap .cb-links .cb-link-row .bloks-head .add-row .ie-drag .ie-del .ie-actions`
(`.serp-*` = Google sonuç önizlemesi, `.char-meter` = karakter sayacı).
Liste CSS'i `R/admin-sayfalar/sa-sayfalar.css`:
`.filter-bar .chips .chip .ptable .pg-cell .pg-ico .pg-info .pg-title .pg-url
.seo-pill .upd .row-acts .ia-btn`.

#### 4.4.3 Sayfa formu — alan listesi
İki sekme: **İçerik** / **SEO** (`.sa-form-tab`, `:95-96`) + hidden `type` (`:88`).

**Sekme "İçerik" — bölüm "Sayfa İçeriği" (`:111`)**
| Alan | name | Tip | Doğrulama (`C/PageController.php:168-217`) |
|---|---|---|---|
| Başlık | `baslik[tr]/[en]` | text, maxlength 180 | `.tr` required·string·max:180 · `.en` nullable·max:180 |
| URL adresi | `slug` | text; **var olan sayfada `readonly`** ("Sabit sayfa — URL değiştirilemez") | required·string·max:200·regex `/^[a-z0-9-]+$/`·unique(pages,slug); SEO-landing'de ayrıca **rota çakışma kontrolü** |
| İçerik | `icerik[tr]/[en]` | **richtext** | nullable·string |

Slug çakışma hatası birebir: *"Bu URL zaten sitede başka bir sayfa tarafından
kullanılıyor — SEO-landing satırı bu adreste hiç görünmez."* (kontrol
`slugCollidesWithExistingRoute()` — rota listesini tarar, elle bakımlı rezerve
kelime listesi yoktur).

**Bölüm "Hikâye (blok blok)" (`:151`)** — `body_blocks` (hidden JSON, nullable·string;
`decodeJson` geçersizse hata). 4 blok tipi, hepsi ekle-butonlu ve sürüklenebilir:
- **Paragraf** (`textarea`, placeholder *"Bir fikir, net cümlelerle anlat..."*) + opsiyonel bağlantı satırları (`link-route` — placeholder *"route adı, ör. tarifler.index"* — ve `link-text` — *"görünen metin"*)
- **Alt Başlık** (`text`, placeholder *"Bölüm başlığı"*)
- **Alıntı** (`textarea` *"Alıntı metni..."* + `caption` *"Kaynak (opsiyonel)"*)
- **İpucu Kutusu** (`caption` *"Kutu başlığı"* + `textarea` *"İpucu metni..."*)

**Bölüm "SEO Landing İçeriği" (`:239`)** — yalnız `type=seo_landing`; diğer tipte
tüm bu alanlar **`prohibited`** kuralıyla reddedilir:
| Alan | name | Tip | Doğrulama |
|---|---|---|---|
| Giriş cümlesi (lead) | `lead[tr]/[en]` | textarea, maxlength 300 | nullable(seo)/prohibited·string·max:300 |
| Hedef anahtar kelime | `target_keyword` | text, maxlength 120 | nullable/prohibited·string·max:120 |
| Popüler etiketler (virgülle ayır) | `popular_chips_text` | text, maxlength 500 | nullable/prohibited·string·max:500 → virgülle bölünüp diziye çevrilir |
| Facet ön-seçimi (JSON) | `facet_preset_json` | textarea monospace, placeholder `{"yemek_modu": ["airfryer-tarifleri"]}` | nullable/prohibited·string + **geçerli JSON** |
| Hızlı bilgiler (JSON) | `quick_facts_json` | textarea, placeholder `[{"icon": "fa-clock", "stat": "15", "label": "dk altı tarif"}]` | aynı |
| Sık Sorulan Sorular (JSON) | `faq_items_json` | textarea, placeholder `[{"question": "...", "answer": "..."}]` | aynı |

JSON hatası birebir: *"Geçersiz JSON — biçimi kontrol et."*
Şerh (`C/PageController.php:28-31`): görsel facet seçici / repeater **İCAT EDİLMEDİ** —
düz JSON metin alanı olarak sunuldu.

**Sekme "SEO" (`:282`)**
| Alan | name | Tip | Doğrulama |
|---|---|---|---|
| Meta başlık | `meta_baslik[tr]/[en]` | text, **maxlength 70** | nullable·string·max:70 |
| Meta açıklama | `meta_aciklama[tr]/[en]` | textarea, **maxlength 170** | nullable·string·max:170 |
| Anahtar kelimeler | `anahtar_kelimeler[tr]/[en]` | text | nullable·string·max:255 |

**Yan ray** (`:328-339`): durum select (`durum` — `PageStatus::cases()`, required·in) ·
`published_at` (nullable·date; yalnız `published` durumunda yazılır, aksi hâlde `null`) ·
canlı SEO skor paneli.

**🔴 Ölçülen sınır uyumsuzluğu:** form meta başlığı **70** karaktere kadar izin
veriyor ama skor "iyi" saymak için **40–60** arası istiyor; meta açıklama **170**'e
kadar izinli ama ideal aralık **120–158**. Uçlarda yazan admin form kuralına uyup
skoru düşürebilir.

**Alan adı ↔ model alanı eşlemesi elle yapılır** (`C/PageController.php:245-258`):
`baslik→title` · `icerik→body` · `meta_baslik→seo_title` ·
`meta_aciklama→seo_description` · `anahtar_kelimeler→seo_keywords` ·
`popular_chips_text→popular_chips` · `*_json→facet_preset/quick_facts/faq_items`.
EN güvenlik ağı: `LocalizedInput::text()` — blank EN mevcut çeviriyi **ezmez**.

Audit: `page.created` / `page.updated` / `page.deleted` (+`title`).
Yetki: `PagePolicy` (super + gastro-admin).

---

## 5 · DadaFit için özet çıkarım

**Doğrudan desen olarak alınabilir (Gastro'da VAR):**
- Abonelik operasyon seti: iptal (dönem sonu) · devam · dondur (tavanı ayardan) · istisnai iade (tutar+gerekçe, super-only) · anında sonlandırma (gerekçe, super-only) + iade geçmişi tablosu
- Fatura listesi/detayı — salt okunur, PDF indirme audit'li, kart verisi yok
- Kupon CRUD'u — tam ve olgun (kod/tür/değer/tarih/limit/plan kısıtı; kullanılmış kupon silinemez)
- Kazanç defteri + ödeme listesi — "sistem para göndermez, kayıt tutar" doktrini, 5+2 durumlu kapalı enum, dönem kapanışı, devreden bakiye
- Para parametrelerinin tek okuma noktası (`MoneySettings`) + "Para & Komisyon" ayar sekmesi + kazanç ekranında "Yürürlükteki Kurallar" özeti
- Ayarlar'ın allowlist mimarisi (secret-guard), sekme = gerçek rota
- Sayfa Tanımları deseni (public bölüm metinleri + görselleri Settings'te, registry allowlist)
- SEO skoru bileşeni (`publish-sidebar`), 5 ölçüt × 20 puan + SERP önizleme

**DadaFit'te İCAT EDİLMESİ gereken (Gastro'da YOK):**
1. Plan **oluşturma/silme** (Gastro'da yalnız edit + aktif/pasif)
2. **Özellik kayıt defteri** ve plan × özellik **matris** ekranı (Gastro'da 7 sabit boolean anahtar + 1 kota)
3. **Karşılaştırma tablosu** yönetimi (hangi özellik hangi kademede, hangi sırada gösterilecek)
4. Plan **tanıtım maddeleri** (`features`) editörü — kolon var, admin yüzeyi yok
5. **Para birimi**, **indirim**, **deneme süresi**, **vergi** alanları
6. Menüde **özel URL / serbest kalem** ekleme, **ikon seçici**, **rol bazlı görünürlük**, **"yeni sekmede aç"**, **3+ seviye** iç içe (Gastro: sabit 17'lik havuz, 2 seviye, boolean `child`)
7. **Toplu ödeme işaretleme** ve ödeme listesi **dışa aktarma** (Gastro: tek tek + onay modalsız)
8. Fatura **toplu indirme / dışa aktarma**

**DadaFit'te dikkat edilecek ölçülmüş kusurlar (tekrarlanmasın):**
- `Page::seoScore()` 4 ölçüt = tavan 80, ama etiket eşiği 100'lük ölçekte → "İyi" ancak dört ölçüt tamken (`Page.php:96-116` vs `index.blade.php:87-89`)
- Meta alan `maxlength`ları (70 / 170) ile skor ideal aralıkları (40–60 / 120–158) uyuşmuyor
- Liste kartı 4 özellik gösterirken form 7 özellik yönetiyor (`planlar/index.blade.php:19-24` vs `duzenle.blade.php:42-50`)
- Ücretsiz plan kartı Blade'e gömülü, düzenlenemez (`planlar/index.blade.php:51-69`)
- Section-scoped olmayan dosya girdisi kardeş bölümü ezer (banner kusuru, `C/PageDefinitionController.php:104-124`)
