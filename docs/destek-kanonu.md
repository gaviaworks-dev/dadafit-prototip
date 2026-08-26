# DESTEK KANONU — DadaDiet (K8 pilot)

**Sürüm:** v1.1 · 2026-08-25
**Şerit:** DIET · Dalga 1 · iş kalemi **Y8.1**
**v1 → v1.1 (Dalga 2):** yalnız **§1.2** ve **§9/B5** değişti — `.pstat warm`
kusuru düzeltildi ve dört depoya kopyalanırken uyulacak kural yazıldı.
Durum listesi, geçiş matrisi, tablo ve alan setleri **dokunulmadı**.
**Karar dayanağı:** K8 — *"DadaDiet pilottur; dört durumu, iki tablosu ve
geçişleri enum'da tutma kararı kanondur."*

🔴 **BU BELGE DONDURULMUŞ ÖLÇÜMDÜR.** Diğer üç depo (Gastro · Gourmet · Fit)
Dalga 3'te buna uyarlanacak. Belgedeki her satırın karşısında **dosya:satır**
kanıtı vardır; hiçbir kalem "olması gereken"den değil, **bugün Diet'te
koşan koddan** çıkarılmıştır.

⚠ Bu belge **karar vermez**. Kanonda olmayan / çelişen kalemler §9'da
Beyar'a soru olarak durur.

---

## 0 · MODÜLÜN DOSYA HARİTASI

| Katman | Dosya |
|---|---|
| Şema | `database/migrations/2026_08_22_120000_create_diet_support_tables.php` |
| Durum enum'u | `app/Domain/Diet/Enums/SupportStatus.php` |
| Kategori enum'u | `app/Domain/Diet/Enums/SupportCategory.php` |
| Model — talep | `app/Domain/Diet/Models/DietSupportTicket.php` |
| Model — mesaj | `app/Domain/Diet/Models/DietSupportMessage.php` |
| Policy — talep | `app/Domain/Diet/Policies/DietSupportTicketPolicy.php` |
| Policy — mesaj | `app/Domain/Diet/Policies/DietSupportMessagePolicy.php` |
| Policy tabanı | `app/Domain/Diet/Policies/UserOwnedPolicy.php` |
| Action — açma | `app/Domain/Diet/Actions/OpenSupportTicket.php` |
| Action — yanıt | `app/Domain/Diet/Actions/ReplyToSupportTicket.php` |
| Action — durum | `app/Domain/Diet/Actions/ChangeSupportTicketStatus.php` |
| Controller | `app/Http/Controllers/Diet/DestekController.php` (364 satır) |
| Rotalar | `routes/diet.php:738-766` |
| Görünümler | `resources/views/diet/destek/{_shell,index,create,show,cozum-merkezi}.blade.php` |
| Policy kaydı | `app/Providers/AuthServiceProvider.php:174-175` |
| Testler | `tests/Feature/Destek/` — 6 dosya |

---

## 1 · DÖRT DURUMUN TAM TANIMI

Kaynak: `SupportStatus.php:35-47` (case'ler) + `:5-33` (docblock ölçütü).

🔴 **Kanonun en kritik cümlesi** (`SupportStatus.php:13-18`):
> *"Bu ekran ÜYENİNDİR; üyenin listesinde 'yanıt bekleyen' demek **topun
> üyede olduğu** talep demektir: destek ekibi yazdı, sıra üyede. Ters okuma
> `Acik` ile aynı şeyi anlatırdı ve iki sekme aynı kümeyi gösterirdi."*
>
> **`Acik` = sıra DESTEKTE · `YanitBekleyen` = sıra ÜYEDE.**

Bu, `06-destek-merkezi.md §5 · C2` sorusunun **Diet'teki cevabıdır** ve
koda yazılıdır.

| Case | Değer | Anlamı (kimde sıra) | Kim/ne girer | Kullanıcıya gösterilen etiket | Rozet | İkon |
|---|---|---|---|---|---|---|
| `Acik` | `acik` | Sıra **destek ekibinde** — talep açıldı ya da üye son sözü söyledi | `OpenSupportTicket:80` (varsayılan) · `ReplyToSupportTicket:75` (üye yazınca) · `ChangeSupportTicketStatus` (yeniden açma) · DB default `'acik'` (migration:93) | **"Açık talep"** | `wait` | `fa-inbox` |
| `YanitBekleyen` | `yanit-bekleyen` | Sıra **üyede** — destek ekibi yazdı, cevap/onay bekleniyor | **BUGÜN HİÇBİR KOD YOLU YAZMIYOR** — bkz. §9/D1 | **"Yanıt bekleyen"** | `wait` | `fa-reply` |
| `Cozulen` | `cozulen` | Destek ekibi çözdüğünü bildirdi; üye kapatabilir ya da yeniden açabilir | **BUGÜN HİÇBİR KOD YOLU YAZMIYOR** — bkz. §9/D1 | **"Çözülen"** | `ok` | `fa-circle-check` |
| `Kapatilan` | `kapatilan` | Kapatıldı — yazışma durdu. Üye yeniden açabilir | `ChangeSupportTicketStatus` ← `DestekController::close():246` | **"Kapatılan"** | `off` | `fa-lock` |

### 1.1 · Etiket kararının kanona giren şerhi

`Acik`ın etiketi **"Açık" değil "Açık talep"tir** ve bu ölçülerek seçildi
(`SupportStatus.php:52-63`): Diet'te `__('Açık')` anahtarı
`lang/en.json`de **"Enabled"** karşılığını taşıyor ve iki ekran onu
"etkin/kapalı" ekseninde kullanıyor. Paylaşılsaydı İngilizce destek
listesinde talebin durumu **"Enabled"** yazardı.

⚠ **Bu şerh markaya özgüdür, kanona körlemesine kopyalanamaz.** Diğer üç
depo kendi `lang/en.json`ini **taramadan** etiketi kopyalamamalıdır; kanon
olan **kural**dır ("çeviri anahtarını paylaşmadan önce tara"), dizginin
kendisi değil.

### 1.2 · Dört durum, üç rozet

`SupportStatus::badge()` dört durumu üç CSS varyantına indirir
(`ok · wait · off`). Ayrım rozetin **renginde değil, etiketinde** taşınır.

✅ **KUSUR KAPANDI — Dalga 2, 2026-08-25.** v1'in kaydı şöyleydi:
*"`support.blade.php:53` `.pstat warm` basıyor ama `planim.css`te
`.pstat.warm` kuralı yok — rozet stilsiz çıkıyor."* Ölçüm doğruydu ve
**eksikti**: düzeltme sırasında aynı kusurun **dört** render noktasına
dokunduğu ölçüldü, biri değil:

| Render noktası | Hangi durum `warm` basıyor |
|---|---|
| `diet/planim/support.blade.php:53` | iptal edilen randevu (`$apptBadge`) |
| `diet/planim/paketlerim.blade.php:66` | `UserPackageStatus::Iade` (`UserPackageStatus.php:64`) |
| `diet/planim/paketlerim.blade.php:95` | `PackageCreditType::SureDoldu` · `PaketIptali` (`PackageCreditType.php:102`) |
| `diet/planim/paketlerim.blade.php:145` | `UserPackageStatus::Iade` (geçmiş listesi) |

**Yapılan:** `public/reference/diet/css/planim.css`e dördüncü varyant
eklendi (`.pstat.warm`). Kaynak yine diyetisyen panelidir — dosyanın kendi
kuralı (*"her kural repoda hâlihazırda var olan bir sayfadan BİREBİR
kopyalanmıştır… kaynak diyetisyen panelidir"*).

🔴 **DÖRT DEPOYA KOPYALANIRKEN DİKKAT — TOKEN ADI DEĞİL, ÇÖZÜLMÜŞ DEĞER
KOPYALANIR.** `panel.css:270` kuralı `var(--tomato-tint)`/`var(--tomato)`
yazar; **panel kendi `--tomato`sunu tanımlar** (`panel.css:30` = `#E14827`,
gerçek kırmızı-turuncu) ve panel kabuğu `dd-shell.css`i **hiç yüklemez**
(`layouts/diet-panel.blade.php:41-42`). Planım sayfaları ise `dd-shell.css`
yükler ve **orada `--tomato` NANE'dir** (`dd-shell.css:47` = `#3BB77E`,
Beyar kararı A5). Token adı kopyalansaydı *"İptal edildi"* rozeti **yeşil**
çıkardı — yani kusur giderilmez, işareti **tersine çevrilmiş** olurdu.
Eklenen kural bu yüzden literaldir: `background:#FBE9E3;color:#E14827`.
Yeni renk **icat edilmedi**; ikisi de panelin kendi çözülmüş değerleridir.
Emsal: `planim.css`in `.pstat.wait` kuralı da aynı sebeple literaldir.

⚠ **Her marka bu kıyası kendi kabuğunda yeniden yapar.** Kanon olan
**kural**dır (*"varyantı eklemeden önce hedef kabuğun token'ının ne
DEĞERE çözüldüğünü ölç"*), dizginin kendisi değil — `§1.1`in çeviri
anahtarı şerhiyle aynı aile.

⚠ **`SupportStatus::badge()` DEĞİŞMEDİ.** Dördüncü varyant artık mevcut ama
destek durumları onu kullanmaz: `warm` panelin sözlüğünde *"iptal /
gecikmiş"* demektir (`panel.css:270`) ve dört destek durumunun hiçbiri o
anlamda değildir. Enum docblock'undaki gerekçe güncellendi — **kısıt
kalktı, tercih kaldı.**

---

## 2 · GEÇİŞ MATRİSİ — `canTransitionTo()`

Kaynak: `SupportStatus.php:126-139`.

🔴 **GEÇİŞLER ENUM'DA, CONTROLLER'DA DEĞİL.** `ChangeSupportTicketStatus:31`
enum'a **sorar**, kendi kopyasını taşımaz (`ChangeSupportTicketStatus.php:12-16`).
K8'in "geçişleri enum'da tutma kararı"nın tam karşılığı budur.

⚠ **BU MATRİS ÜYE İÇİNDİR, DESTEK EKİBİ İÇİN DEĞİL** (`SupportStatus.php:109-113`).
Yönetim yüzeyi bu turda kurulmadı; oraya "destek de kullanır" diye geniş bir
tablo yazmak ölçülmemiş bir yüzeyin kurallarını uydurmak olurdu.

### 2.1 · Dörde dört matris

`✅` = geçilebilir · `❌` = geçilemez

| **Bu durumdan** ↓ / **Buna** → | `acik` | `yanit-bekleyen` | `cozulen` | `kapatilan` |
|---|:--:|:--:|:--:|:--:|
| **`acik`** | ❌ | ❌ | ❌ | ✅ |
| **`yanit-bekleyen`** | ❌ | ❌ | ❌ | ✅ |
| **`cozulen`** | ✅ | ❌ | ❌ | ✅ |
| **`kapatilan`** | ✅ | ❌ | ❌ | ❌ |

**Ham hâli** (`allowedTransitions()`, `:132-139`):

```php
self::Acik, self::YanitBekleyen => [self::Kapatilan],
self::Cozulen                   => [self::Kapatilan, self::Acik],
self::Kapatilan                 => [self::Acik],
```

### 2.2 · Matrisin okunuşu — 16 hücrenin gerekçesi

| Geçiş | Karar | Gerekçe (koddan) |
|---|---|---|
| `acik → kapatilan` | ✅ | Üye vazgeçti / kendi çözdü (`:117`) |
| `yanit-bekleyen → kapatilan` | ✅ | Aynı (`:118`) |
| `cozulen → kapatilan` | ✅ | Üye çözümü kabul etti (`:119`) |
| `cozulen → acik` | ✅ | Üye çözümü **kabul etmedi** (`:119`) |
| `kapatilan → acik` | ✅ | "Talebi yeniden aç" (`:120`) |
| `acik → acik` | ❌ | *"Yeniden açma zaten açık bir talepte anlamsızdır ve izin verilseydi `reopened_at` benzeri bir damgayı sessizce tazelerdi"* (`:122-124`) |
| **`* → yanit-bekleyen`** | ❌ | **Üye bu duruma hiçbir talebi sokamaz** — topu kendine atmak anlamsızdır. Bu geçiş **destek ekibinin** fiilidir ve o yüzey kurulmadı |
| **`* → cozulen`** | ❌ | Aynı — "çözüldü" beyanı **destek ekibinindir** |
| `kapatilan → kapatilan` | ❌ | Kapalıyı kapatmak |
| diğer köşegen/geri geçişler | ❌ | Listede yok |

### 2.3 · Geçersiz geçişin karşılığı

🔴 **SESSİZCE YUTULMAZ** (`ChangeSupportTicketStatus.php:17-21`): ilk yazımda
`return` vardı ve çürütüldü — *"kullanıcı 'Yeniden Aç' düğmesine basar, sayfa
döner, hiçbir şey değişmez ve kimse haber almaz."*

- Action `RuntimeException` fırlatır (`:32-35`)
- `DestekController::durumKurali()` (`:288-295`) onu **422**'ye çevirir
  (`ValidationException::withMessages(['durum' => …])`)
- 🔴 **403 DEĞİL 422** (`:281-283`): *"yetki tamam (policy geçti), sorun
  TALEBİN HÂLİDİR. 403 dönmek 'senin değil' demek olurdu ve kullanıcı yanlış
  şeyi düzeltmeye çalışırdı."*

### 2.4 · Damgaların türetilmesi

`ChangeSupportTicketStatus:37-46` — damgalar **kuralın kendisinden** türetilir,
çağırandan gelmez:

| Hedef | `closed_at` | `resolved_at` |
|---|---|---|
| `kapatilan` | `now()` | **dokunulmaz** (çözülüp kapanan talebin çözüm tarihi tarihsel kayıttır) |
| `acik` | `null` | `null` (yeniden açılan talep artık çözülmüş değildir) |

⚠ Şu an `acik` ve `kapatilan` dışında hedef yok; matris genişlerse bu blok
da genişler.

---

## 3 · `acceptsReply()` — hangi durumlarda yanıt kabul edilir

Kaynak: `SupportStatus.php:142-145`.

```php
public function acceptsReply(): bool
{
    return $this !== self::Kapatilan;
}
```

| Durum | Yanıt yazılabilir mi |
|---|---|
| `acik` | ✅ |
| `yanit-bekleyen` | ✅ |
| `cozulen` | ✅ |
| `kapatilan` | ❌ |

🔴 **BU BİR DURUM KURALIDIR, YETKİ KURALI DEĞİL**
(`ReplyToSupportTicket.php:28-32` + `DietSupportTicketPolicy.php:51-54`):
*"sahibi bile kapattığı talebe yazamaz, önce yeniden açar."* Karşılığı
**403 değil 422**'dir. Policy yalnız sahiplik sorar (`reply()` → `owns()`).

### 3.1 · Yanıt yazmanın durum yan etkisi

`ReplyToSupportTicket.php:18-26` — bir mesaj eklemek **topu karşı tarafa
atmaktır**:

| Yazmadan önce | Yazdıktan sonra |
|---|---|
| `yanit-bekleyen` | `acik` (sıra üyedeydi, üye yazdı, sıra desteğe geçti) |
| `cozulen` | `acik` (üye çözümü kabul etmedi — yeniden açılır) |
| `acik` | `acik` (zaten sıra destekte; damga tazelenir) |
| `kapatilan` | **yazılamaz** (422) |

Ek olarak (`:69-80`):
- Destek ekibinin okunmamış mesajları **okundu** damgalanır
  (`read_at = now()`, `sender_role != 'user'` olanlar)
- `last_message_at = now()`
- `resolved_at = null` — *"aksi hâlde 'çözülmüş ama açık' gibi okunamaz bir
  satır kalırdı"*

---

## 4 · İKİ TABLONUN TAM KOLON LİSTESİ

Kaynak: `2026_08_22_120000_create_diet_support_tables.php`.
⚠ Migration'da **guard YOKTUR** (`:71-72` — kayıtlı ders: *"guard'lı migration
KOŞMUŞ SAYILIR ve kalıcı boşluk bırakır"*).

### 4.1 · `diet_support_tickets`

| # | Kolon | Tip | Null | Default | Not / kanıt |
|---|---|---|:--:|---|---|
| 1 | `id` | `bigIncrements` | ❌ | — | `:79` |
| 2 | `user_id` | `foreignId` → `users.id` | ❌ | — | `cascadeOnDelete`. 🔴 **NOT NULL — misafir destek talebi YOK** (`:81-82`, docblock md.1) |
| 3 | `reference` | `string(24)` **unique** | ❌ | — | `:85` · kullanıcıya basılan tek kimlik · üretimi §5 |
| 4 | `category` | `string(40)` | ❌ | — | `:88` · değer kümesi `SupportCategory` (13 kalem) |
| 5 | `subject` | `string(160)` | ❌ | — | `:90` |
| 6 | `status` | `string(20)` | ❌ | **`'acik'`** | `:93` · değer kümesi `SupportStatus` (4 kalem) |
| 7 | `related_appointment_id` | `foreignId` → `diet_appointments.id` | ✅ | `null` | `:103-104` · **`nullOnDelete`** — *"randevu silinse bile talep DÜŞMEZ"* |
| 8 | `related_payment_reference` | `string(64)` | ✅ | `null` | `:105` · **FK DEĞİL, METİN** — gerekçe §4.3 |
| 9 | `last_message_at` | `timestamp` | ✅ | `null` | `:107` |
| 10 | `resolved_at` | `timestamp` | ✅ | `null` | `:108` |
| 11 | `closed_at` | `timestamp` | ✅ | `null` | `:109` |
| 12 | `created_at` | `timestamp` | ✅ | `null` | `:111` (`timestamps()`) |
| 13 | `updated_at` | `timestamp` | ✅ | `null` | `:111` |

**Index'ler:**

| Index | Kolonlar | Gerekçe |
|---|---|---|
| unique | `reference` | `:85` · benzersizliğin **asıl kapısı DB'dir**, uygulama değil |
| bileşik | `(user_id, status, last_message_at)` | `:118` — *"bu üyenin, bu durumdaki talepleri, en yeni önce"* — `DestekController::index()`in tam sırası |
| bileşik | `(user_id, last_message_at)` | `:119` — durum süzgeci yokken ("Tümü" sekmesi) |
| FK index | `user_id` · `related_appointment_id` | Laravel `foreignId` otomatik |

**Kolon toplamı: 13.**

### 4.2 · `diet_support_messages`

| # | Kolon | Tip | Null | Default | Not / kanıt |
|---|---|---|:--:|---|---|
| 1 | `id` | `bigIncrements` | ❌ | — | `:123` |
| 2 | `ticket_id` | `foreignId` → `diet_support_tickets.id` | ❌ | — | `:124` · `cascadeOnDelete` |
| 3 | `sender_id` | `foreignId` → `users.id` | ✅ | `null` | `:131` · **`nullOnDelete`** |
| 4 | `sender_role` | `string(20)` | ❌ | **`'user'`** | `:132` · değerler **sınıf sabiti**: `ROLE_USER='user'` · `ROLE_SUPPORT='support'` (`DietSupportMessage.php:39,42`) |
| 5 | `body` | `text` | ❌ | — | `:134` |
| 6 | `attachment_media_id` | `foreignId` → `media.id` | ✅ | `null` | `:142` · `nullOnDelete` · **tek dosya** |
| 7 | `read_at` | `timestamp` | ✅ | `null` | `:144` |
| 8 | `created_at` | `timestamp` | ✅ | `null` | `:145` |
| 9 | `updated_at` | `timestamp` | ✅ | `null` | `:145` |

**Index'ler:**

| Index | Kolonlar | Gerekçe |
|---|---|---|
| bileşik | `(ticket_id, created_at)` | `:147` — yazışma her zaman kronolojik okunur |
| FK index | `ticket_id` · `sender_id` · `attachment_media_id` | Laravel otomatik |

**Kolon toplamı: 9.**

### 4.3 · Şeklin gerekçesi ve üç ölçülmüş fark

Şema `diet_message_threads` / `diet_messages` ikilisinin **ikizidir**
(`:17-23`): *"Bir destek talebi de bir yazışmadır… ikinci bir desen icat
etmek, aynı işi iki farklı biçimde tutmak olurdu."* Kolon adları
(`sender_role · body · attachment_media_id · read_at · last_message_at`)
o dosyadan **birebir** alındı.

**Üç fark, üçü de ölçümden doğdu:**

1. **`user_id` NOT NULL** — `diet_message_threads`te NULL olabilir (misafir
   diyetisyene yazabiliyor); destek talebinde öyle bir uç yok, modül `auth`
   altında ve misafirin kanalı `/iletisim` (`diet_feedback`).
2. **`reference` var, `id` basılmaz** — sıralı numara kaç talep açıldığını
   sızdırır ve komşu numarayı denemeye davet eder.
3. **İlgili işlem iki farklı tipte** — asimetri ölçüldü:
   - `related_appointment_id` → **FK**, çünkü `diet_appointments` üye
     eksenlidir (`user_id` var) ve sahiplik doğrulanabilir (IDOR yüzeyi
     doğmaz).
   - `related_payment_reference` → **string**, çünkü `diet_payments`
     **üye eksenli DEĞİL** (diyetisyen hakediş defteri, `dietitian_id`
     NOT NULL, `user_id` yok). Üyenin ödemesini tutan tablo o gün yoktu.
     *"Olmayan bir tabloya FK kurulamaz; var olan YANLIŞ tabloya kurmak ise
     sessiz bir hata olurdu."*

⚠ **KANONA ALINACAK OLAN İLKEDİR, KOLON TİPİ DEĞİL:** ilgili işlem
kolonu, **hedef tablo üye eksenliyse FK, değilse metin** olur. Diğer üç
depo kendi tablosunu ölçer.

### 4.4 · Neden DB `enum()` değil `string`

`:60-64`: kayıtlı ders — *"Enum'a case eklemek uzaktaki bir admin ekranını
500'e düşürebilir"*; DB enum'u ayrıca `ALTER` gerektirir ve **iki sözlük**
doğurur. Depo bu deseni zaten kullanıyor (`diet_appointments.status`).

### 4.5 · KVKK şerhi

`:66-69` — bir destek talebi ödeme numarası, ekran görüntüsü ve
`saglik-icerigi` kategorisi üzerinden **sağlık verisi** taşıyabilir.
Erişim policy'dedir ve **yönetici bypass'ı yoktur**.

---

## 5 · `reference` ÜRETİM KURALI

Kaynak: `OpenSupportTicket.php:42-145`.

### 5.1 · Biçim

```
DD-<yıl>-<6 karakter>          örnek:  DD-2026-K7WQ9M
```

- Önek `'DD-'.now()->format('Y').'-'` (`:120`)
- Rastgele bölüm **6 karakter** (`UZUNLUK = 6`, `:49`)
- Alfabe **30 karakter** (`ALFABE`, `:46`):
  `ABCDEFGHJKLMNPQRTUVWXYZ2346789`
- Toplam uzunluk: `3 + 4 + 1 + 6 = 14` karakter (kolon `string(24)`)

### 5.2 · Alfabeden çıkarılan karakterler ve sebebi

`I` · `O` · `S` · `0` · `1` · `5` **yoktur** (`:41-45`):
*"`I`/`1`, `O`/`0`, `S`/`5` telefonda ve destek yazışmasında karışır;
numarayı okuyup yazan insan olduğu için kümeden çıkarıldılar."*

⚠ Ölçüm: alfabede `I`, `O`, `S`, `0`, `1`, `5` **yok**; ayrıca `2346789`
sırasında `5` de atlanmış. Harf kümesi 23, rakam kümesi 7 → toplam 30.

### 5.3 · Benzersizlik ve çakışma yönetimi

| Kapı | Nerede | Rolü |
|---|---|---|
| **Asıl kapı** | DB `unique` index (`migration:85`) | Eşzamanlı iki istek aynı numarayı seçerse **ikincisi DB'de durur** |
| Yardımcı kapı | `exists()` yoklaması (`:125`) | Yalnız kullanıcıya 500 göstermemek için |

- Deneme sayısı **8** (`DENEME = 8`, `:59`)
- 8 denemenin hepsi çakışırsa **`RuntimeException`** fırlatılır (`:130-132`):
  *"Destek talebi numarası 8 denemede üretilemedi; numara üreteci bozuk olabilir."*
- 🔴 **SESSİZ DÖNGÜ YOK** (`:54-58`): 30⁶ ≈ 729 milyon kombinasyon içinde
  8 denemenin hepsinin çakışması pratikte imkânsızdır; *"buraya düşmek
  'numara üreteci bozuk' demektir ve o, sessizce geçilecek değil GÖRÜLECEK
  bir arızadır."*
- Rastgelelik kaynağı **`random_int()`** (`:141`) — kriptografik.

⚠ **Uygulama kapısını tek kanıt saymak yasaktır** (`:113-116`): *"ölçüt
yanlış şeyi ölçerse temiz çıkar."*

### 5.4 · Marka öneki — kanonun açık ucu

Diet'in öneki `DD-`. `06-destek-merkezi.md §5 · C8` dört markanın önekini
(`DG-`/`DD-`/`DU-`/`DF-`) soruyor ve **cevaplanmadı**. Kanon olan **kalıptır**
(`<marka öneki>-<yıl>-<6 karakter, karışan harf yok>`), önek harfi değil.

---

## 6 · ADRES KALIBI

Kaynak: `routes/diet.php:738-766`.

### 6.1 · Yedi uç

| # | Metot | Adres | Rota adı | Controller | Hız sınırı |
|---|---|---|---|---|---|
| 1 | `GET` | `/hesabim/destek` | **`hesabim.destek`** | `index` | — |
| 2 | `GET` | `/hesabim/destek/cozum-merkezi` | `hesabim.destek.cozum-merkezi` | `help` | — |
| 3 | `GET` | `/hesabim/destek/olustur` | `hesabim.destek.olustur` | `create` | — |
| 4 | `POST` | `/hesabim/destek/olustur` | `hesabim.destek.kaydet` | `store` | **`throttle:30,1`** |
| 5 | `GET` | `/hesabim/destek/talep/{ticket}` | `hesabim.destek.talep` | `show` | — |
| 6 | `POST` | `/hesabim/destek/talep/{ticket}/yanitla` | `hesabim.destek.yanitla` | `reply` | **`throttle:30,1`** |
| 7 | `POST` | `/hesabim/destek/talep/{ticket}/kapat` | `hesabim.destek.kapat` | `close` | **`throttle:30,1`** |
| 8 | `POST` | `/hesabim/destek/talep/{ticket}/yeniden-ac` | `hesabim.destek.yeniden-ac` | `reopen` | **`throttle:30,1`** |

⚠ Sayım düzeltmesi: rota bloğunun başlığı *"3 ekran + 4 yazma"* diyor; ölçüm
**4 GET + 4 POST = 8 rota** veriyor (Çözüm Merkezi ekran sayılmamış olabilir).

**Grup middleware:** `auth` — grup düzeyinde (`:738`). Hiçbir metot kendi
giriş kontrolünü yazmaz; `$request->user()` hiçbir metotta `null` olamaz
(`DestekController.php:64-65`).

### 6.2 · Süzgeç adresi

`GET /hesabim/destek?durum={acik|yanit-bekleyen|cozulen|kapatilan|tumu}`

- Sekme **sunucudan** basılır (`DestekController.php:81-83`)
- Ölçüt **beyaz listedir**; geçersiz `?durum=` sessizce "Tümü"ye düşer
  (`durum()`, `:303-310`)
- `?durum[]=x` biçiminde **dizi** de gelebilir — tip bu yüzden daraltılır
  (`is_string()` yoklaması, `:300-305`)
- `'tumu'` **enum'a EKLENMEDİ** (`:70-76`): *"bir DURUM değil, bir GÖRÜNÜM
  seçimidir. Enum'a case olarak girseydi `status` kolonuna yazılabilir hâle
  gelirdi."* Sınıf sabiti: `DestekController::HEPSI = 'tumu'`.

`GET /hesabim/destek/olustur?kategori={…}` — form açılışında ön seçili
kategori; geçersizse seçim yok (`kategori()`, `:313-316`).

### 6.3 · Hız sınırı gerekçesi

`routes/diet.php:77-82`: dört POST'un üçü **diske yazabiliyor** (ek dosyası)
ve sınırsız bırakılırsa tek üye depoyu doldurur. Değer **medya uçlarının
aynısı** (`throttle:30,1` — `routes/auth.php` fotoğraf/kapak uçları); ikinci
bir tavan uydurulmadı. Durum değiştiren iki uç diske yazmaz ama aynı sınırın
altında durur — *"ayrı bir sayı seçmek için ölçülmüş bir sebep yoktu."*

### 6.4 · Rota dosyası seçimi — çok dillilik kapısı

`routes/diet.php:669-692` — modül `routes/auth.php`e **konmadı**, çünkü:

| Yüzey | Dosya | Çok dilli mi |
|---|---|---|
| `/hesabim` (kimlik) | `routes/auth.php` · 7 rota | ❌ önekli dilde karşılığı yok |
| `/planim` (kullanıcı alanı) | `routes/diet.php` · 23 rota | ✅ `/en/my-plan` · `/ru/…` · `/es/…` |

Destek Merkezi bir **kullanıcı alanı modülüdür**; `auth.php`e konsaydı
İngilizce gezen üye Türkçeye düşerdi ve kapı bunu ihlal olarak **sayamazdı**.

⚠ **Açıkça yazılan bedel:** `/en/my-account/support` var ama
`/en/my-account` **YOK**. `/hesabim` kökü hâlâ çok dilli değil; açık karar
(`docs/KULLANICI-ALANI-FARK.md §4.6-Ç3`).

**Beş yeni adres segmenti** (`hesabim · destek · talep · kapat · yeniden-ac`)
`config/locales.php`e (en·ru·es) yazıldı; biri eksik kalsaydı o dilin 107
rotasının hepsi düşerdi. Kapı: `tests/Feature/Dil/SegmentHaritasiTest.php`.

### 6.5 · Rota adı bir sözleşmedir

`routes/diet.php:695-713` — kabuk şeridi adı **önceden** yazmıştı:
`DietShell::KOSULLU_HEDEFLER` sabitinde `'destekMerkezi' => 'hesabim.destek'`.
Ad doğduğu an kabuğun hesap menüsündeki "Destek Merkezi" kalemi
**kendiliğinden** belirir (`dd-shell.js:828`). Kapı:
`DestekAdresiTest::test_index_adi_kabugun_bekledigi_addir` — sabiti
**okuyarak** ölçer, kopyasını taşımaz.

🔴 **KANON KALEMİ:** rota adı bir sözleşmedir; karşı şerit başka bir ad
seçerse hedef sessizce `null` kalır ve menü kalemi hiç doğmaz.

---

## 7 · YETKİ KAPILARI

### 7.1 · `DietSupportTicketPolicy` (extends `UserOwnedPolicy`)

| Yetenek | Kural | Kaynak |
|---|---|---|
| `viewAny` | `true` — giriş yeter, satır süzmesi sorgunun işi | `UserOwnedPolicy:51-54` |
| `view` | `owns()` | `UserOwnedPolicy:56-59` |
| `create` | `true` | `UserOwnedPolicy:61-64` |
| `update` | `owns()` | `UserOwnedPolicy:66-69` |
| `reply` | `owns()` | `DietSupportTicketPolicy:56-59` |
| `close` | `owns()` | `:62-65` |
| `reopen` | `owns()` | `:68-71` |
| **`delete`** | 🔴 **`false` — HER ZAMAN** | `:79-82` |

🔴 **TALEP SİLİNMEZ** (`:73-78`): *"Taban sınıf sahibine `true` verirdi;
burada kapatılıyor. Destek yazışması bir kayıttır: üye 'sil'ebilseydi bir
şikâyetin ya da iade talebinin izi kaybolurdu. Üyenin karşılığı olan fiil
`close()`tur ve o kaydı SAKLAR."*

🔴 **YÖNETİCİ BYPASS'I YOKTUR** (`:17-33`) — iki ölçüme dayanır:
1. Emsal `DietMessageThreadPolicy` aynı duruşta.
2. `PolicyKapsamiTest::test_hicbir_policyde_before_kancasi_yok` zaten
   `before()` ile açılan sessiz bypass'ı yasaklıyor.

⚠ **AMA:** *"bu modülün karşı tarafı bir KİŞİ değil, DESTEK EKİBİDİR — bir
gün birinin okuması GEREKECEKTİR. O yüzey kurulurken burada AÇIK ve
GEREKÇELİ bir metot açılacaktır — `view()`e sessizce `|| $this->isAdmin($user)`
eklenerek DEĞİL."*

### 7.2 · `DietSupportMessagePolicy`

Erişim **talepten gelir**, mesajdan değil (`:16-18`): soru *"bu mesajı sen mi
yazdın"* değil, *"bu talep senin mi"*dir. Aksi hâlde üye kendi yazdığını
okuyup destek ekibinin cevabını okuyamazdı.

| Yetenek | Kural |
|---|---|
| `view` | `Gate::forUser($user)->allows('view', $ticket)` — **devredilir, kopyalanmaz** (`:35-40`) |
| `markRead` | `view()`e devreder (`:43-46`) |
| `delete` | 🔴 **`false`** (`:53-56`) — *"bir iade ya da şikâyet talebinde bu kayıt kanıttır"* |

### 7.3 · Controller'daki `Gate::authorize()` çağrıları

| Metot | Çağrı | Satır |
|---|---|---|
| `store` | `Gate::authorize('create', DietSupportTicket::class)` | `:151` |
| `show` | `Gate::authorize('view', $ticket)` | `:193` |
| `reply` | `Gate::authorize('reply', $ticket)` | `:229` |
| `close` | `Gate::authorize('close', $ticket)` | `:244` |
| `reopen` | `Gate::authorize('reopen', $ticket)` | `:254` |

⚠ `index` ve `help`te `authorize` **yok**: `index` `forUser()` kapsamıyla
kendi satırlarını çeker, `help` statik konu listesi basar.

⚠ **MODEL SORGU SÜZMEZ** (`DietSupportTicket.php:25-28`): `forUser()` bir
**kolaylıktır, KAPI DEĞİLDİR**; kapı policy'dedir.

### 7.4 · IDOR kapısı — `related_appointment_id`

`DestekController.php:159-169` — 🔴 *"IDOR YÜZEYİ TAM BURADA DOĞARDI."*
Randevu kimliği formdan gelir; süzgeç olmasaydı üye başkasının randevu
id'sini yazıp talep detayında o randevunun **tarihini ve DİYETİSYENİNİ**
okurdu.

```php
Rule::exists('diet_appointments', 'id')->where('user_id', $user->id)
```

**422 döner, 403 değil** — girdi geçersizdir, yetki sorunu değil: o kayıt
bu üye için "yok"tur.

### 7.5 · Policy kaydı

`app/Providers/AuthServiceProvider.php:174-175` — `$policies` dizisinde
açıkça eşlenmiş.

---

## 8 · EKLER

### 8.1 · Dosya eki VAR — talep başına değil, **mesaj başına tek dosya**

| Kalem | Ölçüm |
|---|---|
| Kolon | `diet_support_messages.attachment_media_id` (nullable FK → `media`) |
| Adet | **Mesaj başına 1** — kolon tekil |
| Nerede kabul edilir | `store` (ilk mesaj) ve `reply` — form alanı adı **`ek`** |
| Boyut tavanı | `config/media.php` → `max_size_bytes` = **5 MB** (`env('MEDIA_MAX_SIZE_BYTES', 5*1024*1024)`) |
| İzinli mime (genel) | `image/jpeg` · `image/png` · `image/webp` (`config/media.php`) |
| **Bu uca özel ek** | 🔴 **`application/pdf`** — yalnız burada (`DestekController:336-340`) |
| Doğrulama kuralı | `['nullable','file','mimetypes:…','max:<KB>']` (`:323-331`) |
| Depolama | **private disk** + `MediaService::store()` |
| Erişim | `media.show` **imzalı URL**, TTL **900 sn** (`config/media.php` → `signed_url_ttl`) |
| "Ne kabul ediliyor" metni | Kuralın kendisinden türetilir (`ekIpucu()`, `:349-362`) — Blade metin **yazmaz, taşır** |

🔴 **PDF FARKININ GEREKÇESİ** (`DestekController:57-62`): genel mime
listesine PDF **eklenmedi**, yalnız bu ucun kendi listesine eklendi. Dört
kategori (`odeme · fatura · iptal-iade · pro-abonelik`) doğası gereği PDF
belge taşır ve *"Dosya veya ekran görüntüsü"* yalnız görsel demiyor.
Başka hiçbir yükleme yüzeyi etkilenmez.

🔴 **MEDYA SAHİPLİĞİ İKİ ADIMLIDIR** (`OpenSupportTicket:31-36`): dosya,
mesaj satırı doğmadan önce yüklenmek zorunda. Kaynak sistemin çözümü
`mediable_*`i boş bırakmaktı ve ölçülen sonucu **9.447 satırın 9.439'unda
NULL**'dı. Burada o yol kapalı: satır önce **talebe** ait doğar, sonra
`reassignTo()` ile **mesaja** geçer. **Hiçbir an sahipsiz satır yoktur.**

⚠ **KANONA GEÇMESİ GEREKEN KISIT** (`DietSupportMessagePolicy:22-29`):
`media.show` rotası `signed` middleware'i taşır ama **sahiplik SORMAZ** —
imza süresi dolana kadar URL'i ele geçiren dosyayı okuyabilir. Bu deponun
tüm medya yüzeyleri için geçerli, modüle özgü olmayan bir kısıttır.

### 8.2 · Bildirim — 🔴 **YOK**

Ölçüm: `OpenSupportTicket` · `ReplyToSupportTicket` · `DestekController`
dosyalarında `Notification` · `notify` · `Mail::` **hiç geçmiyor** (grep, 0
eşleşme). Talep açıldığında ya da yanıt yazıldığında **hiçbir bildirim
tetiklenmiyor** — ne e-posta, ne uygulama içi.

Tek kullanıcıya dönüş kanalı **flash mesajlarıdır**:
- `store` → `"Destek talebin oluşturuldu. Talep numaran :no."` (`:187`)
- `reply` → `"Mesajın iletildi."` (`:238`)
- `close` → `"Talep kapatıldı."` (`:248`)
- `reopen` → `"Talep yeniden açıldı."` (`:258`)

### 8.3 · Okundu damgası

| Ne zaman düşer | Kaynak |
|---|---|
| Üye **talep detayını açtığında** — yalnız **karşı tarafın** mesajlarında | `DestekController::show():201-204` |
| Üye **yanıt yazdığında** — okunmamış destek mesajları | `ReplyToSupportTicket:69-72` |

⚠ *"Kendi yazdığını 'okumuş' saymak sayacı bozardı"* (`:198-199`).

Sayaç: `DietSupportTicket::unreadForUser()` (`:125-131`) — ama listede
**çağrılmaz**: `index()` `withCount(['messages as unread_count' => …])` ile
**tek sorguya** indirir (N+1 kapısı, `DestekController:93-104`).

### 8.4 · Admin tarafı — 🔴 **YOK**

**ÖLÇÜM (beklenmedik bulgu, §10'da da yazılı):**
`grep -rln "DietSupportTicket|diet_support" app/ resources/ routes/ database/ tests/`
→ **hiçbir `app/Http/Controllers/Admin/` dosyası, hiçbir admin blade'i,
`routes/admin.php`te hiçbir satır** eşleşmiyor.

- `app/Http/Controllers/Admin/Diet/` altında **21 controller** var,
  hiçbiri destek değil (en yakını `FeedbackAdminController` — o
  `diet_feedback` tablosunun, yani "Görüş Bildir"in kuyruğudur, **ayrı
  eksendir**: `SupportCategory.php:19-24`)
- `DietSupportMessage::ROLE_SUPPORT = 'support'` sabiti **tanımlı ama
  hiçbir kod onu yazmıyor** (`DietSupportMessage.php:41-42`: *"destek
  ekibinin yazdığı mesaj (yönetim yüzeyi ayrı şerittir)"*)
- `DietSupportTicketPolicy` docblock'u bunu açıkça söylüyor: *"O yüzey
  (yönetim destek masası) bu turda KURULMADI… Kalem lead'e raporlandı."*

**Sonuç:** Diet'in destek modülü bugün **tek yönlüdür** — üye yazar, kimse
cevap veremez. Kanon **şema ve durum makinesi** düzeyinde tamdır; **yönetim
yüzeyi düzeyinde boştur.**

### 8.5 · §14.6 Acil durum bilgilendirmesi — kanona giren ürün kuralı

`resources/views/diet/destek/_shell.blade.php:38-45` + kapı
`tests/Feature/Destek/AcilDurumBildirimiTest.php`.

Belge kuralı: *"Destek merkezi ve diyetisyen mesajlaşması tıbbi acil durum
kanalı gibi sunulmamalıdır."*

🔴 **Bu bir uyarı metni değil ÜRÜN KURALIDIR**; metnin **yokluğu kadar
görünmezliği de ihlaldir.** Blok **kabukta** durur, yani üç ekranın üçünde
de basılır ve hiçbirinde dipnota düşmez — sayfa başlığının hemen altında,
**ilk kart** olarak.

Test ölçütü *"sayfada geçiyor mu"* **değil**, *"NEREDE geçiyor"*dur da:
bloğun sayfa başlığından **sonra** ve asıl içerikten **önce** durduğu ayrıca
ölçülür. *"Aksi hâlde biri bloğu sayfanın en altına taşır ve kapı yine
yeşil kalırdı."*

⚠ **Bu kalem markaya özgüdür** (sağlık verisi). Gastro/Gourmet/Fit'te
karşılığı **ürün kararıdır**, kanon değil.

### 8.6 · Ekranlar (3 + 1)

| Ekran | Adres | Blade |
|---|---|---|
| Destek Taleplerim | `/hesabim/destek` | `index.blade.php` (129 satır) |
| Yeni Destek Talebi | `…/olustur` | `create.blade.php` (173) |
| Çözüm Merkezi | `…/cozum-merkezi` | `cozum-merkezi.blade.php` (80) |
| *(sekmesiz)* Talep Detayı | `…/talep/{ticket}` | `show.blade.php` (176) |
| Ortak kabuk | — | `_shell.blade.php` (152) |

Sekme şeridi **üç kalemdir** (`_shell.blade.php`); talep detayı sekme
değildir. Üçü de **ayrı adrestir** ve bu yüzden `<button data-tab>` değil
`<a href>` kalıbı seçildi (`_shell.blade.php:29-36`).

**Talep detayının bölümleri** (`show.blade.php`):
`pnl-card` "Talep Bilgileri" (numara · oluşturulma tarihi · kategori ·
ilgili randevu · ödeme numarası · durum rozeti · "Talebi kapat" /
"Talebi yeniden aç" düğmeleri) → `pnl-card` "Yazışma" (mesajlar · gönderen
"Sen" / "Destek ekibi" · ek dosya bağlantısı) → yanıt kutusu ("Cevabın" +
"Dosya ekle") veya kapalı uyarısı.

### 8.7 · Doğrulama kuralları — tam liste

| Uç | Alan | Kural | Satır |
|---|---|---|---|
| `store` | `category` | `required · string · Rule::in(SupportCategory::values())` (13 değer) | `:154` |
| `store` | `subject` | `required · string · min:3 · max:160` | `:155` |
| `store` | `body` | `required · string · min:10 · max:5000` | `:156` |
| `store` | `related_appointment_id` | `nullable · integer · Rule::exists(diet_appointments,id)->where(user_id,…)` | `:166-169` |
| `store` | `related_payment_reference` | `nullable · string · max:64` | `:178` |
| `store` | `ek` | `nullable · file · mimetypes:… · max:5120 KB` | `:180` |
| `reply` | `body` | `required · string · **min:2** · max:5000` | `:232` |
| `reply` | `ek` | aynı | `:233` |

⚠ Asimetri ölçüldü: ilk mesajda `min:10`, cevapta `min:2`.

### 8.8 · Testler — 6 dosya

| Dosya | Neyi kilitliyor |
|---|---|
| `TalepOlusturmaTest.php` | Talep açma akışı |
| `TalepDurumGecisleriTest.php` | `canTransitionTo()` matrisi |
| `TalepSahipligiTest.php` | Policy / IDOR kapısı |
| `DestekAdresiTest.php` | Rota adı sözleşmesi (`DietShell::KOSULLU_HEDEFLER`) |
| `CozumMerkeziTest.php` | Çözüm Merkezi eşlemesi |
| `AcilDurumBildirimiTest.php` | §14.6 — üç ekranda, dipnota düşmeden |

Ayrıca dolaylı kapılar: `PolicyKapsamiTest` (before kancası yasağı) ·
`ModelSemaUyumuTest` · `CeviriYuzeyKapisiTest` · `SegmentHaritasiTest`.

---

## 9 · KANONDA **OLMAYAN**, TARTIŞMAYA AÇIK KALEMLER

🔴 Bunlar **karar değil, sorudur.** Karar Beyar'ındır.

### Y8.5 SORUSU — Fit'in iki kalemi kanona giriyor mu?

`06-destek-merkezi.md §1.5` Fit maketinde **dört markada eşsiz** iki kalem
ölçmüştü. **Diet'te ikisi de YOK.**

| Kalem | Fit'teki hâli | **Diet ölçümü** |
|---|---|---|
| **"Taleplerin"** — talep detayının yan sütunundan **diğer taleplere çapraz geçiş** (`tk-others` / `tk-other`) | var | 🔴 **YOK.** `grep -rn "Taleplerin"` → `resources/` ve `app/` altında **0 eşleşme**. `show.blade.php`de yan sütun **hiç yok**: sayfa iki `pnl-card`tan ibaret ("Talep Bilgileri" + "Yazışma"). Detaydan başka bir talebe geçmenin **tek yolu** sekme şeridindeki "Destek Taleplerim"e (`/hesabim/destek`) dönüp listeden seçmektir |
| **"Beklerken"** — yanıt beklerken üyenin **kendi çözebileceği adımlar** bloğu (`tk-sec`) | var | 🔴 **YOK.** `grep -rn "Beklerken\|beklerken"` → tek eşleşme `ExpirePackageCredits.php:70`, o da *"Kilidi beklerken"* diye **alakasız bir yorum satırı**. En yakın kavram **Çözüm Merkezi**'dir (`…/cozum-merkezi`, `CozumMerkezi::konular()` — 11 başlık) ama o **ayrı bir adrestir**, talep detayında basılmaz; yani bekleyen üye onu **kendi bulmak zorundadır** |

> **Y8.5 sorusu:** Fit maketinde iki kalem var, Diet'te **ikisi de yok**:
> (1) **"Taleplerin"** — çapraz geçiş; (2) **"Beklerken"** bloğu.
> Bunlar kanona giriyor mu? **Karar Beyar'ındır.**

**Ölçümün eklediği not (karar değil):** ikisi de Diet'in **şemasını
değiştirmez** — "Taleplerin" var olan `forUser()` sorgusunun bir varyantı,
"Beklerken" ise var olan `CozumMerkezi::konular()` listesinin talep detayına
taşınmış hâlidir. Yani ikisi de **görünüm kalemidir**, tablo/enum işi değil.

---

### D1 · İki durumu bugün hiçbir kod yazmıyor

`yanit-bekleyen` ve `cozulen` enum'da tanımlı, etiketli, rozetli,
ikonlu — ama **hiçbir kod yolu o değeri kolona yazmıyor.** Sebep ölçülü:
o geçişler **destek ekibinin** fiilleridir ve yönetim yüzeyi kurulmadı
(§8.4). Bugün canlıda bir talebin alabileceği durumlar: **`acik`** ve
**`kapatilan`** — ikisi.

**Soru:** kanon dört durumu **şimdi** dondurur ve üç depo da dördünü birden
kurar mı; yoksa yönetim yüzeyi doğana kadar iki durum "tanımlı ama
ulaşılmaz" mı kalır?

### D2 · Beyar'ın "inceleniyor"u

`06-destek-merkezi.md §3.2` dört kaynağın dört farklı durum listesi
taşıdığını ölçmüş ve **ölçülmüş öneri** (karar değil) sunmuştu: Diet'in
enum'u + "inceleniyor" → **5 hâl**.

⚠ **Diet ölçümü bu öneriyi zorlaştırıyor:** Diet'in `Acik`ı zaten
*"sıra DESTEKTE"* demektir. "İnceleniyor" ondan **ayrı bir küme değil, onun
alt kümesidir** (destek ekibi talebi gördü ama henüz yazmadı). Eklenirse
`Acik`ın tanımı daralır ve **bu belgenin §1'i yeniden yazılır.**
K8 "dört durum kanondur" diyor. **Karar Beyar'ındır.**

### D3 · Yönetim yüzeyi ve policy bypass'ı

`DietSupportTicketPolicy` docblock'unun kendi şerhi: yönetim destek masası
kurulurken **açık ve gerekçeli bir metot** açılacak, `view()`e sessizce
`isAdmin()` eklenmeyecek. **O metodun adı ve kuralı kanona girmeli mi?**

### D4 · "Yeniden aç" — Diet'te var, Fit kanonunda yok

`06 §5 · C7`. Diet'te hem policy metodu, hem rota, hem enum geçişi var.
**Kanona giriyor mu?** (Diet ölçümü: `kapatilan → acik` geçişi matrisin
temel taşlarından biri; çıkarılırsa `Kapatilan` **terminal** duruma döner.)

### D5 · Sayfalandırma — 🔴 ÖLÇÜM ÇELİŞKİSİ

`06-destek-merkezi.md §2` Diet için *"Sayfalandırma ✅"* yazıyor.
**Ölçüm bunu doğrulamıyor:** `DestekController::index()` `->get()` çağırıyor
(`:123`), `paginate` **yok**; `index.blade.php`de `links()` **yok**
(grep, 0 eşleşme). Yani Diet'te **sayfalandırma YOKTUR** — liste, üyenin
tüm talepleri, tek seferde basılıyor.

`06 §1.6` Fit için de *"sayfalandırma YOK"* diyor ve *"Diet'ten (`paginate`)
veya Gastro'dan alınmalı"* öneriyor. **Diet'te alınacak bir `paginate`
yoktur.** Kanona sayfalandırma girecekse kaynağı **Gastro**'dur
(`paginate(10)->withQueryString()`).

### D6 · Öncelik (`priority`) yok

`06 §3.3` *"Gastro'ya ek olarak taşınacak iki kolon: `priority` … ve talep
numarası kalıbı"* diyor. Diet'te `priority` **kolonu yok** (§4.1'in 13
kolonu). Kanona **eklenecek mi**, yoksa Gastro'nun kalemi olarak mı kalacak?

### D7 · `brand` kolonu

`06 §3.3` ortak şemaya `brand` kolonu koymuş. ⚠ Bu **K2 ile gergindir**:
K2 rozet için *"`brand` kolonu yoktur"* diyor ve K1 dört ayrı depo/ayrı DB
topolojisi kuruyor. **Ayrı DB'de `brand` kolonu ne işe yarar?**
Diet'te böyle bir kolon **yok**. Soru Beyar'a.

### D8 · Ek dosya adedi

`06 §5 · C6`. Diet: **mesaj başına 1** (kolon tekil, dizi değil).
Çoklu ek istenirse şema değişir (`attachment_media_id` → ara tablo).
**Kanon 1 mi?**

### D9 · Bildirim

§8.2 ölçümü: **hiçbir bildirim yok.** Kanon bildirim **istiyor mu**?
İstiyorsa hangi olayda (talep açıldı · destek yazdı · çözüldü · kapandı)
ve hangi kanalda (e-posta · uygulama içi)?

---

## 10 · BEKLENMEDİK BULGULAR (DUR ve raporla)

| # | Bulgu |
|---|---|
| **B1** | `06-destek-merkezi.md §2` Diet için **"Sayfalandırma ✅"** ve **"Admin kuyruğu ✅ VAR"** diyor. **İkisi de ölçümde doğrulanmadı** — sayfalandırma yok (`->get()`), admin destek ekranı hiç yok (§8.4, §9/D5). Envanterin bu iki satırı **düzeltilmelidir**; aksi hâlde Dalga 3'te üç şerit **var olmayan bir şeyi** kanon sanıp kopyalamaya çalışır |
| **B2** | `yanit-bekleyen` ve `cozulen` durumları **ulaşılamaz** — hiçbir kod yolu yazmıyor (§9/D1). Kanon "dört durum" diyor ama canlıda **iki durum** işliyor |
| **B3** | `DietSupportMessage::ROLE_SUPPORT` sabiti **tanımlı ama hiç kullanılmıyor**. Destek ekibi mesajı yazan hiçbir kod yok |
| **B4** | Rota bloğunun başlığı *"3 ekran + 4 yazma"* diyor; ölçüm **4 GET + 4 POST** veriyor (§6.1) |
| **B5** | ✅ **KAPANDI (Dalga 2, 2026-08-25).** `.pstat warm` kusuru düzeltildi; ölçüm bir değil **dört** render noktası buldu ve dört depoya kopyalanırken uyulacak kural §1.2'ye yazıldı (*token adı değil, çözülmüş değer kopyalanır*) |
| **B6** | `media.show` imzalı URL sahiplik sormaz (§8.1 sonu) — imza ömrü boyunca (900 sn) URL'i ele geçiren dosyayı okur. Modüle özgü değil, **deponun geneli**; ama destek eki **sağlık verisi** taşıyabildiği için kanonda ayrıca anılmalı |
