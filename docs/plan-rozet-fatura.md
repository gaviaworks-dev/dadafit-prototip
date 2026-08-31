# Plan · Fatura adresi yüzeyi + rozet kartı köşe çakışması

**Tur:** keşif + plan (2026-08-31) · **Durum:** onay bekliyor, hiçbir dosya değiştirilmedi
**Ölçüm ortamı:** `python3 -m http.server 8788` + Playwright 1.62.1 (`PW_HOME=~/.pw`)
**Kanıt betikleri:** scratchpad'de (`kesif-rozet-kose.mjs`, `kesif-rozet-durum.mjs`)
**Ekran görüntüleri:** `docs/screenshots/kesif-rozet-{kilitli-kart,izgara}-{1440,768,390}.png` (gitignored — `.gitignore:10 *.png`)

---

## 0 · Yayın yolu eşlemesi (ölçüldü)

`.github/workflows/pages.yml` tek iş akışı; `_site`i iki checkout'tan kuruyor:
`V1_SHA=d4839be…` → `/` (dondurulmuş v1), `main` → `/v2/`. Yani **yereldeki kök
dosya adı canlıda birebir `/dadafit-prototip/v2/<dosya>` olur** — `rozetlerim-v1.html`
→ `…/v2/rozetlerim-v1.html`; kökteki `/` adresi eski commit'i gösterdiği için bu turun
değişiklikleri orada **görünmez**.

---

# KALEM 1 — Pro ödeme akışında fatura adresi

## 1.1 · `pro-odeme-v1.html` içinde fatura/adres yüzeyi

| Soru | Ölçüm |
|---|---|
| "adres" kelimesi geçiyor mu? | **SIFIR eşleşme** (`grep -i adres pro-odeme-v1.html`) |
| Fatura alanı / adımı / modalı var mı? | **YOK.** "fatura" yalnız *metin* olarak geçiyor: meta açıklama (`:8`), yönlendirme kartı (`:479-483`), akış sonu listesi (`:520`, `:530`) |
| Gizli mi, hiç yok mu? | **Hiç yok.** Sayfadaki tek `hidden` blok `#kartFormu` (`:323`) — o da kart bilgileri, koşullu görünür (`pmYeni` radyosu seçilince). Fatura adımı gizli değil, **mevcut değil** |

## 1.2 · Adım yapısı — dört adım, hiçbiri fatura değil

Adım rozetleri `.fc-step` sınıfıyla, kart başlıklarında sabit metin olarak duruyor
(dinamik sihirbaz yok; dördü de aynı anda ekranda):

| Adım | Başlık | `form-card` satırı | Rozet satırı |
|---|---|---|---|
| 1 / 4 | Abonelik Dönemin | `:371` | `:377` |
| 2 / 4 | Ödeme Yöntemi | `:290` | `:296` |
| 3 / 4 | Kart Bilgileri (`#kartFormu`, `hidden`) | `:323` | `:329` |
| 4 / 4 | Onay (`#agreeCard`) | `:409` | `:415` |

DOM sırası ile numara sırası uyuşmuyor (Adım 1 kartı DOM'da üçüncü sırada), ama
görsel sıra CSS ile değil DOM ile belirlendiği için **kullanıcı 2 → 3 → 1 → 4
sırasında görüyor**. Bu ayrı bir bulgu; Kalem 1'in konusu değil ama fatura adımı
eklenirken numaralandırma zaten elden geçmek zorunda.

Sayfa girişindeki vaat (`:268`): *"Dört adım: planı onayla, ödeme yöntemini seç,
kart bilgilerini gir, koşulları onayla."* → **fatura kimliği vaadin içinde yok.**

## 1.3 · Hesap tarafında fatura adresi tutan ekran

| Dosya | Fatura adresi yüzeyi | Kanıt |
|---|---|---|
| `hesabim-v1.html` | **YOK** (bilerek söküldü) | `:1662-1666` yorumu: *"FATURA BİLGİLERİ AÇILIR PENCERESİ (#ftModal) BU SAYFADAN KALKTI… `odemelerim-v1.html`e taşındı"*. Kalan tek şey `#fatura` çapası ve Ödemelerim'e giden bağlantı (`:1323`) |
| `odemelerim-v1.html` | **VAR — tek gerçek yüzey.** "Fatura Bilgilerim" modalı `#ftModal` | Tetikleyici düğme `:525` (`#odFtBilgi`, Faturalar sekmesi içinde) · modal `:844` · form `:859` · sürücü `:1550` |
| `paketlerim-v1.html` | **YOK** | Tek geçiş `:270`, sadece Ödemelerim'e bağlantı metni |
| `profil-v1.html` | **YOK** | `adres` eşleşmelerinin hepsi destek formlarındaki "E-posta adresin" (`:3423`, `:3510`, `:3538`) |

`#ftModal`'ın alanları (`odemelerim-v1.html:859-1005`): Fatura tipi segmenti
(Bireysel / Kurumsal) · bireysel: Ad soyad + TCKN · kurumsal: Unvan + Vergi dairesi +
VKN + e-Fatura mükellefi · ortak: Telefon (ülke kodlu) + E-posta · **adres: İl (81
seçenek) + İlçe + Adres (240 krk) + Posta kodu** · "varsayılan fatura adresim yap".
Kayıt yeri: `localStorage['dm_fit_fatura_v1']` (`:1551`).

**Bu formun tek girişi var:** Ödemelerim › Faturalar sekmesindeki gri düğme, artı
fatura belgesi modalındaki `#fdAliciBag` bağlantısı (`:1523-1528`). **URL çapası yok**
(`#faturalar` sekmeyi açar, modalı açmaz) ve **ödeme akışından hiçbir bağlantı yok.**

## 1.4 · Yönetim tarafı — ölçülmüş çelişki

`admin-fatura-detay-v1.html:189-190` künye tablosunda **alıcının adresini basıyor**:

```
satir('Alıcı', alici.ad + ' — ' + alici.kimlikEtiket + ': ' + alici.kimlik
               + ' · ' + alici.adres + ' · ' + alici.eposta)
```

`admin-faturalar-v1.html:205` de üye kolonunda `alici.ad` / `alici.eposta` basıyor
(`:124` şerhi: *"fatura başına üye alanı YOKTUR, alıcı tek bir `alici()` çağrısından"*).

`alici()` (`assets/js/fit-fatura.js:200-216`) **yalnız `dm_fit_fatura_v1`den okuyor**;
o anahtar boşsa `ALICI_VARSAYILAN`e düşüyor (`:37-40`):

```
ad: 'Elif Şahin', kimlik: '—', adres: 'Adres bilgisi girilmedi', eposta: 'elif@ornek.com'
```

### 🔴 Çelişki, net hâliyle

**Evet — admin bir fatura adresi alanı bekliyor ve ödeme akışında o alanı dolduracak
yüzey yok.** Üstelik akış sessizce fatura kaydı da üretiyor:

`pro-odeme-v1.html:771-782` → `FIT_FATURA.ekle({tur:'uyelik', …})` →
`fit-fatura.js:157-176` kaydı `durum:'ok', durumAd:'Ödendi'` ile
`localStorage['dm_fit_fatura_kayit_v1']`e **kalıcı yazıyor**. Sonuç zinciri:

1. Kullanıcı Pro ödeme akışını sonuna kadar götürür — adres hiç sorulmaz.
2. Defterde "Ödendi" damgalı bir fatura kaydı doğar.
3. `admin-fatura-detay-v1.html` o faturayı açar ve alıcı satırında
   **"Adres bilgisi girilmedi"** yazar — çünkü kullanıcının o adresi girebileceği
   tek form, akışın hiç uğramadığı başka bir sayfanın içindeki modalda.

**İkincil çelişki (aynı ölçümden çıktı, aynı dosya):** akış sonu paneli
`pro-odeme-v1.html:520` *"Fatura kesilMEDİ"* ve `:519` *"Abonelik başlaMADI —
kademen değişmedi"* diyor; oysa aynı sayfanın JS'i `:764-769` `dm_user.paket`i
`pro`/`pro_max` yapıyor **ve** `:777` fatura kaydını defterine yazıyor. Ekranın
dürüstlük metni kendi davranışını yanlış anlatıyor.

**Üçüncül (küçük):** yasal metin `admin-yasal-form-v1.html:311` faturanın
*"Hesabım → Faturalarım ekranından indirilebilir"* olduğunu söylüyor; o ekran
Ödemelerim'e taşındı ve `odemelerim-v1.html:1517-1521` indirmenin **üretilmediğini**
yazıyor.

## 1.5 · Ödeme akışı ekran/pop-up envanteri

| # | Ekran / pop-up | Durum | Dosya · satır |
|---|---|---|---|
| 1 | Plan seçimi (giriş) | **VAR** | `pro-v1.html` → `pro-odeme-v1.html?plan=` |
| 2 | Abonelik dönemi özeti (Adım 1) | **VAR** | `pro-odeme-v1.html:371` |
| 3 | Ödeme yöntemi seçimi (Adım 2) | **VAR** — 2 kayıtlı kart + yeni kart | `pro-odeme-v1.html:290` |
| 4 | Kart bilgileri formu (Adım 3) | **VAR** — Luhn + SKT doğrulaması gerçek | `pro-odeme-v1.html:323` |
| 5 | Koşul onayı (Adım 4) | **VAR** | `pro-odeme-v1.html:409` |
| 6 | **Fatura adresi formu (akış içinde)** | **YOK** | — |
| 7 | **Bireysel / Kurumsal fatura seçimi (akış içinde)** | **YOK** | — (yalnız `odemelerim-v1.html:864-869` modalında) |
| 8 | **Adres kayıt onayı (akış içinde)** | **YOK** | — (modalda var: `odemelerim-v1.html:996` "varsayılan fatura adresim yap") |
| 9 | Fatura adresi formu (akış DIŞINDA) | **VAR ama bağlantısız** | `odemelerim-v1.html:844` `#ftModal` |
| 10 | Ödeme başarılı ekranı | **BİLEREK YOK** — nötr "ödeme alınmadı" durumu var | `pro-odeme-v1.html:501-540` (`:496` şerhi) |
| 11 | Ödeme başarısız ekranı | **YOK** — akışta hiçbir başarısızlık dalı yok | — (kavram yalnız `odemelerim-v1.html:589`/`:1717` ve `fit-admin-abonelik-veri.js:21` metinlerinde) |
| 12 | 3D doğrulama adımı | **YOK** — yalnız gelecek zaman cümlesi | `pro-odeme-v1.html:529` |
| 13 | Fatura görüntüleme | **VAR (akış dışı)** — `#fdModal` belge penceresi | `odemelerim-v1.html:775` |
| 14 | Fatura indirme | **BİLEREK YOK** — düğme dürüst reddediyor, "Yazdır" gerçek | `odemelerim-v1.html:1515-1521` |
| 15 | Akış → fatura bilgilerine bağlantı | **YOK** — `pro-odeme` yalnız `#abonelik`, `#kartlar`, `#faturalar` çapalarına gidiyor | `pro-odeme-v1.html:270,319,473,479,485,530` |

## 1.6 · Kök sebep (Kalem 1)

Fatura kimliği/adresi **hesap ayarı** olarak modellenmiş (Ödemelerim içinde bir
modal), **satın alma akışının parçası** olarak değil. Akış ise K6 gereği gerçek bir
fatura kaydı üretiyor ve admin o kaydın alıcı adresini basıyor. Modelin iki ucu
birbirine hiç bağlanmamış: yazan yüzey ile okuyan yüzey arasında ne bağlantı, ne
zorunluluk, ne de akış içi giriş noktası var.

## 1.7 · Önerilen çözüm (Kalem 1)

**Yeni form yazma — var olanı akışa bağla.** `#ftModal` zaten tam: 81 il, TCKN
sağlaması, VKN, e-Fatura mükellefiyeti, ülke kodlu telefon, kalıcı kayıt. İkinci bir
kopya çıkarmak K10 ruhuna (tek kaynak) aykırı ve iki formun sapması kesin.

Yapılacak, sırayla:

1. **`pro-odeme-v1.html`'e "Fatura Bilgileri" adımı ekle** — beş adıma çık
   (1 Dönem · 2 Fatura bilgileri · 3 Ödeme yöntemi · 4 Kart · 5 Onay) ve `.fc-step`
   rozetlerini yeniden numarala. Adım **özet kartı** olsun: `dm_fit_fatura_v1`
   doluysa kayıtlı kimliği + adresi okur ve "Düzenle" düğmesi gösterir; boşsa
   "Fatura bilgilerin eksik" uyarısı + "Fatura Bilgilerini Gir" düğmesi gösterir.
2. **Formu ortak parçaya taşı** — `#ftModal`ın markup+JS'i `odemelerim-v1.html`
   içinde gömülü. İki sayfanın aynı formu kullanabilmesi için `assets/js/fit-fatura-form.js`
   (form üretimi + doğrulama + kayıt) ayrılır; iki sayfa da onu çağırır. Buildless
   kalır, yeni araç yok.
3. **Onay adımını fatura bilgisine bağla** — `dm_fit_fatura_v1` boşken
   "Aboneliği Başlat" düğmesi `agree-err` kalıbıyla aynı biçimde reddetsin
   (`pro-odeme-v1.html:154` `.agree-err` deseni hazır).
4. **Akış sonu metnini davranışla uyumla** (`:518-520`) — kademe gerçekten
   değişiyor ve defterde kayıt gerçekten doğuyor; iki maddeyi doğru yaz.
5. **Ödeme başarısız dalı** — yeni ekran değil, akış sonu panelinin ikinci hâli:
   "reddedildi" senaryosu. `admin-abonelikler-v1.html:191` ve
   `fit-admin-abonelik-veri.js:21` zaten `basarisiz` durumunu bekliyor; public
   tarafta karşılığı yok. **(Beyar kararı gerekiyor: bu turda mı, ayrı tur mu?)**
6. **URL çapası** — `odemelerim-v1.html#fatura-bilgilerim` modalı doğrudan açsın,
   böylece akıştan gelen bağlantı derin gidebilir.

### Dokunulacak dosyalar (Kalem 1)

| Dosya | Ne olacak |
|---|---|
| `pro-odeme-v1.html` | Fatura bilgileri adımı (özet kartı + düzenle), adım numaraları 4→5, onay kilidi, akış sonu metin düzeltmesi |
| `odemelerim-v1.html` | Gömülü `#ftModal` markup/JS'i ortak parçaya devret, `#fatura-bilgilerim` çapası |
| `assets/js/fit-fatura-form.js` | **YENİ** — fatura kimliği formunun tek kaynağı |
| `assets/js/fit-fatura.js` | `alici()` dokunulmaz; yalnız `ekle()` çağrısında alıcı anlık görüntüsü faturaya gömülecekse burası (kesilmiş fatura geriye dönük değişmemeli — `odemelerim-v1.html:820` bunu zaten yazıyor) |
| `admin-yasal-form-v1.html` · `yasal-v1.html` | "Hesabım → Faturalarım" → "Ödemelerim → Faturalar"; indirme cümlesi |
| `docs/qa/pro-odeme-fatura-adimi.mjs` | **YENİ** — adım sayısı, boş kayıtta düğme kilidi, kayıt sonrası özet kartının dolması |

**DUR maddesi:** madde 5 (ödeme başarısız dalı) ve `#ftModal`ın ortak parçaya
taşınması, Kalem 1'in tarif ettiği kapsamın dışına taşıyor. Beyar onayı olmadan
girilmez.

---

# KALEM 2 — Rozet kartında kilit ve puan çakışması

## 2.1 · Yapı ve konum

Hepsi **kök dosyanın kendi `<style>` bloğunda**, `assets/` altında değil:

| Eleman | Üretim | Stil |
|---|---|---|
| `.b-puan` (`+5` / `+10` / `+25`) | `rozetlerim-v1.html:549` — **her karta**, koşulsuz | `rozetlerim-v1.html:153` |
| `.badge-lock` (`fa-lock`) | `rozetlerim-v1.html:550` — **yalnız** `durum === 'yolda'` | `rozetlerim-v1.html:142` |
| Kap | `.badge-card` `position:relative` | `rozetlerim-v1.html:131` |
| `.badge-card.locked .b-puan` rengi | — | `rozetlerim-v1.html:154` |

## 2.2 · Kök sebep — ölçüldü, tahmin değil

İki kural **birebir aynı koordinatı** veriyor:

```
:142  .badge-lock { position:absolute; top:12px; right:14px; font-size:10px; color:#c2c2c2 }
:153  .b-puan     { position:absolute; top:12px; right:14px; font-size:10px; ... }
```

Negatif boşluk değil, paylaşılan kutu değil: **aynı `position:relative` kabında,
aynı `top`/`right` değerine sabitlenmiş iki ayrı mutlak eleman.** Kilitli kartta her
ikisi de basıldığı için üst üste biniyorlar; kazanılmış kartta `.badge-lock` hiç
üretilmediği için sorun görünmüyor — yani hata **CSS'te**, koşul ise **JS'te**.

Not: `.b-yeni` (`:150`) `top:-8px; left:20px` — farklı köşe, bu çakışmaya karışmıyor.

## 2.3 · Playwright ölçümü — üç genişlik, aynı sonuç

Kart: `data-rozet="ilk-hareket"`, etiket `+10`. Değerler kart sol-üstüne göre.

| Genişlik | `.b-puan` kutusu | `.badge-lock` kutusu | Kesişim | Kesişen alan |
|---|---|---|---|---|
| 1440 px | x 194.7 · y 13 · **15.92 × 12** | x 201.8 · y 13 · **8.75 × 10** | **8.75 × 10 px** | **87.5 px²** |
| 768 px | x 201.1 · y 13 · 15.92 × 12 | x 208.3 · y 13 · 8.75 × 10 | 8.75 × 10 px | 87.5 px² |
| 390 px | x 327.1 · y 13 · 15.92 × 12 | x 334.3 · y 13 · 8.75 × 10 | 8.75 × 10 px | 87.5 px² |

- Kesişim **kilit ikonunun %100'ünü**, puan etiketinin **%45.8'ini** kaplıyor
  (87.5 / 191.1 px²). Kilit tamamen puanın içinde.
- `tumKilitliKesisiyor: true` — sayfadaki **50 kilitli kartın 50'sinde** de kesişiyor.
- Üç kırılımda **ölçüler birebir aynı**; duyarlı bir fark yok, tek bir düzeltme
  üçünü de kapatır.
- Görsel doğrulama (`docs/screenshots/kesif-rozet-kilitli-kart-1440.png`): etiket
  `+10` yerine **`+1` + üstüne binmiş kilit** olarak okunuyor — son hane tamamen
  kayıp. Beyar'ın "ikisi de net okunmuyor" tarifi ölçümle birebir örtüşüyor.

**Ek bulgu:** varsayılan durumda sayfadaki **50 kartın 50'si de `locked`**;
kazanılmış (`kazanildi`) ve ölçüsüz (`olcusuz`) kart sayısı **0**. Yani çakışma
istisna değil, ekranın **tamamı**. Kazanılmış kartın temiz görünümü kod okumasıyla
doğrulandı (`:550` kilidi yalnız `yolda`da basıyor), canlı olarak ölçülemedi —
o durumu üretecek veri varsayılan hâlde yok.

## 2.4 · Kontrast (WCAG 2.1 · 1.4.3)

Kilitli kart zemini `transparent` (`:138`) → efektif zemin gövdeden `--bg #f9f9f9`.

| Eleman | Renk | Zemin | Oran | Eşik | Sonuç |
|---|---|---|---|---|---|
| `.b-puan` (kilitli) | `#bdbdbd` (`:154`) | `#f9f9f9` | **1.78 : 1** | 4.5 : 1 | 🔴 **KALIYOR** |
| `.badge-lock` | `#c2c2c2` (`:142`) | `#f9f9f9` | **1.69 : 1** | 4.5 : 1 (ikon: 3 : 1) | 🔴 **KALIYOR** |
| `.b-puan` (kazanılmış) | `#007a3d` (`--fit-deep`) | `#ffffff` (`--paper`) | 5.45 : 1 | 4.5 : 1 | ✅ geçiyor |

10 px yazı "büyük metin" sayılmaz; 4.5:1 eşiği geçerli. İkisi de eşiğin **üçte biri**
kadar. Yani çakışma çözülse bile bu köşe okunmaz kalır — **iki ayrı kusur, ikisi de
düzeltilmeli.**

## 2.5 · Alternatif düzenler

### A · Ayrı köşeler — kilit sol üste, puan sağ üstte kalır
```
.badge-lock { right:auto; left:14px; }
```
- ➕ Tek satır CSS; JS'e dokunulmaz; kazanılmış kart hiç etkilenmez.
- ➖ Sol üst boş değil: `.b-yeni` rozeti `left:20px` (`:150`) — "yeni" + "kilitli"
  aynı anda olan kartta yeni bir çakışma doğar. (Bugün böyle kart yok, ama kural
  ikisini birden mümkün kılıyor.)
- ➖ Kilit ile puan **aynı bilgi ailesinden** ("bu rozet henüz senin değil, değeri
  şu kadar"); iki karşıt köşeye dağıtmak göz için iki ayrı tarama demek.

### B · Tek etiket — kilitli kartta puan, kilidin yanına gömülür ✅ **ÖNERİLEN**
Kilitli kartta iki mutlak eleman yerine **tek bir satır içi rozet**:
`🔒 +10` — ikon ve sayı tek kutuda, `display:inline-flex; gap:5px`, kendi
zemini (`--bg-white` / ince kenarlık) ile kart zemininden ayrılır.
- Uygulama: `:550`'deki ayrı `<i class="badge-lock">` kaldırılır; `:549`'daki
  `.b-puan` kilitli kartta ikonu **içine** alır (`x.durum === 'yolda'` ise
  `<i class="fa-solid fa-lock"></i>` etiketin ilk çocuğu olur).
- ➕ Çakışma **yapısal olarak imkânsız** hâle gelir — üst üste binebilecek iki
  eleman kalmaz, sonraki bir dolgu/font değişikliği hatayı geri getiremez.
- ➕ Kazanılmış kartın görünümü **hiç değişmez** (orada zaten tek etiket var).
- ➕ Etikete zemin gelince kontrast sorunu da aynı hamlede kapanır: `#f9f9f9`
  yerine beyaz zemin + koyu gri metin (`--slate-2` sınıfı) 4.5:1'i geçer.
- ➕ Anlamsal olarak doğru: "kilitli · değeri +10" tek bilgi, tek kutu.
- ➖ JS şablonuna dokunuyor (`:549-550`) — A'dan bir kademe daha fazla iş.
- ➖ Etiket genişliği ~16 px'ten ~34 px'e çıkar; `.badge-tip` ve `.b-yeni` ile
  çakışmadığı **ölçülmeli** (390 px'te kart genişliği yeterli, ölçülecek).

### C · Kilidi ikonun üstüne al (`.badge-ico` rozeti)
Kilit sağ üstten çıkar, `.badge-ico` kutusunun sağ alt köşesine küçük bir rozet olur.
- ➕ Sağ üst köşe tamamen puana kalır.
- ➖ `.badge-ico` 42×42 px (`:135`); üstüne binen rozet ikonun kendisini yer.
- ➖ Kart zaten `locked` sınıfıyla kesikli kenarlık + soluk ikon gösteriyor;
  üçüncü bir kilitlilik sinyali fazlalık.

## 2.6 · Öneri ve gerekçe

**B seçilir.** A tek satırla çakışmayı kaldırır ama iki gerçek sorunun yalnız birini
çözer (kontrast 1.78/1.69'da kalır), üstelik `.b-yeni` ile yeni bir çakışma riski
açar — aynı hatayı başka bir köşeye taşımış oluruz. B, iki elemanı tek kutuda
birleştirerek çakışmayı **geri gelemez** biçimde kapatır, kontrast düzeltmesini aynı
hamleye sığdırır ve kazanılmış kartı hiç bozmaz. Maliyeti tek bir JS şablon satırı.

### Dokunulacak dosyalar (Kalem 2)

| Dosya | Ne olacak |
|---|---|
| `rozetlerim-v1.html` | `:142` `.badge-lock` kuralı sökülür · `:153-154` `.b-puan` tek etiket olarak yeniden yazılır (zemin, dolgu, `inline-flex`, kontrast geçen renk) · `:549-550` şablonda kilit ikonu etiketin içine alınır |
| `docs/qa/rozet-kose-cakisma.mjs` | **YENİ** — üç genişlikte kesişim = 0 px², `.b-puan`/`.b-yeni` kesişimi = 0, kontrast ≥ 4.5:1 |

**Başka dosyaya dokunulmaz.** `.badge-lock` ve `.b-puan` yalnız bu dosyada tanımlı
ve yalnız bu dosyada üretiliyor (ölçüldü). `.rank-step .rs-lock` (`:72`) ayrı bir
bileşen, ayrı köşe — kapsam dışı.

---

## Ölçülemeyenler (dürüstlük kaydı)

- **Kazanılmış rozet kartının canlı görünümü** — varsayılan veri hâlinde 50/50 kart
  `locked`; `kazanildi` durumunu üretecek kayıt yok. Kilidin orada basılmadığı
  **kod okumasıyla** doğrulandı (`rozetlerim-v1.html:550`), tarayıcıda ölçülemedi.
- **`olcusuz` durumundaki kart** — varsayılan hâlde sayısı 0; ölçülemedi.
- **Ödeme akışının başarısızlık dalı** — kodda hiç yok, dolayısıyla ölçülecek bir
  şey de yok.
