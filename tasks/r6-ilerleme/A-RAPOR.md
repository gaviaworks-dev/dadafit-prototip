# AJAN-A · KABUK & BANNER — REVİZYON 6 RAPORU

**Maddeler:** 1 · 2 · 3 · 4 · 5 · 6 · 7
**Dosyalar:** `assets/css/fit-shell.css` · `assets/js/fit-shell.js` · `assets/css/fit-type.css` ·
`programlar-merkezi-v1.html` · `antrenor-detay-v1.html` · `program-detay-v1.html` ·
`antrenorler-v1.html` · `video-seanslari-v1.html` · `fit-planim-veri-izin-v1.html` ·
`antrenman-olusturucu-v1.html` (**yalnız** `.hr-note` bloğu) ·
`tests/footer-curtain.mjs` · `tests/footer-yapi.mjs`
**Ekran görüntüleri:** `tasks/r6-shots/A/` (68 dosya)
**Commit atılmadı, push edilmedi, branch açılmadı.**

> **Ekran görüntüsü adlandırma dürüstlük notu:**
> `m5-programlar-g1-*` = `m4-programlar-g2-*` ile aynı kare — madde 5 uygulanmadan
> önce, madde 4 turunda çekilmiş programlar-merkezi görüntüsüdür (madde 5'in
> "önce" hâli). `m5-*-g2` ve `m6-*-g2`, `-g3` ile aynı karedir: o iki maddede
> 3. geçişin referans ölçümü yeni bir değişiklik üretmedi (ölçüler zaten
> referansla eşleşiyordu), bu yüzden 2. ve 3. geçişin durumu aynıdır.

---

## Madde 1 + 2 + 3 — Sağlık-güvenlik temizliği (tek değişiklik)

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET.** Üç satır özet: (1) her karar bu brief'e
  özgü olmalı, şablon refleksi değil — bu turda her ölçü kardeş markadan
  *ölçülerek* alındı, tahmin edilmedi; (2) cesaret tek yerde harcanır, gerisi
  sessiz kalır — banner'da tek imza sağdaki dikey şerittir, çevresi sadeleşti;
  (3) kalite tabanı ilan edilmeden kurulur: mobil, klavye odağı, azaltılmış
  hareket — üçü de bu turda ölçülüp kapatıldı.
- **Yapılan değişiklik:**
  - `assets/js/fit-shell.js:1925–1949` — `.fit-health` üreten IIFE **silindi**
    (99 satır / 5 770 karakter). Yerine yalnız `FIT_SHELL.pref()` API'sini
    tutan 4 satırlık IIFE + kararın gerekçesi.
  - `assets/css/fit-shell.css:1676–1681` — `.fit-health` / `.fh-*` ailesi
    (21 kural, 23 satır) **silindi**, ölü CSS bırakılmadı.
  - `assets/css/fit-type.css:109` ve `assets/css/fit-shell.css` odak kuralından
    `.fh-stop span`, `.fh-pref` seçicileri çıkarıldı.
  - `fit-planim-veri-izin-v1.html:155–175` — **"Uygulama tercihleri" kartı**
    eklendi (sayfanın kendi `.fp-card` + `.fp-toggle` + `.fp-sw` deseniyle,
    yeni bileşen icat edilmedi). `data-fit-pref` taşıyan üç anahtar.
  - `fit-planim-veri-izin-v1.html` sayfa JS'i — `.fp-sw` işleyicisi ikiye
    ayrıldı: gösterim anahtarları (kayıt tutmaz) ve `data-fit-pref` anahtarları
    (localStorage + `reduce-motion`).
  - `antrenman-olusturucu-v1.html:262–267` → `.hr-note`, `.wg-card`'ın **içine**,
    `.wg-foot`'un altına alt bant olarak taşındı (`.wg-legal`). Sayfanın geri
    kalanına dokunulmadı.
  - `assets/js/fit-shell.js:345 · 370` — "Veri ve İzinlerim" kaleminin `desc`
    metni tercihleri de kapsayacak biçimde güncellendi.
- **Ekran görüntüsü:** `tasks/r6-shots/A/m1-hub-g1-1440.png` · `m1-hub-g1-390.png` ·
  `m2-tercihler-g1-*.png` · `m3-olusturucu-g1-*.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — dokunma hedefi:** `.fp-sw` anahtarının tıklanabilir kutusu
  **46 × 26 px**'ti; asgari 44 px'in altında ve sayfada 13 anahtar var.
  → `fit-shell.css`'e görünmez `::before` örtüsü eklendi; pil görsel olarak
  46 × 26 kaldı. **Ölçülen önce 26 px → sonra 44 px** (`elementFromPoint`
  merkezin ±20 px altında/üstünde hâlâ düğmeyi döndürüyor, ±24'te satır).
- **Kusur 2 — kartın iç ritmi:** `.wg-legal` dolgusu `16/26/18`, hemen
  üstündeki `.wg-foot`'unki `18/26/20`'ydi; kartın alt ucunda dört ayrı dikey
  değer üst üste biniyordu. → İkisi tek değere çekildi.
  **Önce 16/18 → sonra 18/20** (@390: 15/17 → 16/18).
- **Kusur 3 — yazım kaydı:** Yeni üç tercihin açıklamaları noktayla bitiyordu,
  hemen yanındaki "Bildirim kategorileri" kartının dört satırı bitmiyordu.
  Aynı sayfada iki kayıt. → Üç açıklamanın sonundaki nokta kaldırıldı.
  **Önce 3 satır noktalı → sonra 0.**
- **Ekran görüntüsü:** `m1-hub-g2-*.png` · `m2-tercihler-g2-*.png` · `m3-olusturucu-g2-*.png`

### Geçiş 3 · Referansla karşılaştır
Referans URL'leri ve ölçülen değerler (Playwright, @1440):

| Referans | Sayfa altı sağlık bloğu | Footer yasal bağlantıları |
|---|---|---|
| `dadagastro.com/tarifler` | **YOK** — hiç basılmıyor | Kullanım Koşulları · Gizlilik · Çerez · KVKK |
| `dadadiet.com/beslenme` | `.reh-note`, **kendi bölümü değil**, son içerik bölümünün kuyruğunda (y 2956.7) | + **Sağlık Verisi Politikası** |
| `dadadiet.com/diyetisyenler` | `.pf-disclaimer`, tek cümle | aynı 5 kalem |
| `dadadiet.com/beslenme-rehberi/dengeli-tabak` | `.reh-note reh-note-lg`, makalenin kuyruğunda | aynı 5 kalem |

- **Referanstan zayıf kalan nokta yok, yön birebir doğrulandı:** kardeş markalar
  sağlık uyarısını (a) sağlık içeriği taşımayan liste sayfalarında **hiç
  basmıyor**, (b) taşıyanlarda **tek cümlelik, bağlam içi bir not** olarak
  veriyor, (c) kalıcı uyarıyı **footer'ın yasal bandında** tutuyor. DadaFit'in
  yeni durumu üçünün de aynısı: `.fit-health` 0, `antrenman-olusturucu`'nun
  notu kart içinde tek blok, yasal bantta `Sağlık Bilgilendirmesi` **66/66
  sayfada** duruyor.
- **Kaybolmadığı ayrıca doğrulanan içerik:** durma kriterleri (göğüs ağrısı,
  nefes darlığı, baş dönmesi) `saglik-bilgilendirme-v1.html:109`'da,
  `fit-testi-detay-v1.html:811`'de, `yasal-v1.html:436`'da ve
  `video-seans-detay-v1.html:740`'ta duruyor.
- **Ekran görüntüsü:** `m1-hub-g3-*.png` · `m2-tercihler-g3-*.png` · `m3-olusturucu-g3-*.png`

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| `dadafit-hub-v1` DOM'unda `.fit-health` (@1440 · @390) | 0 | **0 · 0** | ✅ |
| Site geneli `.fit-health` düğümü | 0 | **66 sayfanın 66'sında 0** (@1440 ve @390) | ✅ |
| Yasal bant markup'ı | bayt bayt aynı | `FOOTER_LEGAL` bloğunda **tek karakter değişmedi** (`git diff`) · `tests/footer-yapi.mjs` §10 yeşil | ✅ |
| `saglik-bilgilendirme-v1.html` bağlantısı | ≥ 1 | **66/66 sayfada ≥1**, yasal bantta | ✅ |
| R11 perdesi `main.margin-bottom − footer h` | 59/59 tek değer | **65/65 sayfada 0 (tek değer)** @1440; @390 perde kipi kapalı (beklenen) | ✅ |
| Üç tercih `fit-planim-veri-izin`'de, `dm_fit_*` anahtarları aynı | çalışıyor | `dm_fit_sound` · `dm_fit_vibe` · `dm_fit_motion` — tıklama sonrası localStorage `0/1/1`, **sayfa yenilendi, aynı kaldı** (@1440 ve @390) | ✅ |
| `dm_fit_motion` → `reduce-motion` | tetikliyor | `html.reduce-motion` **anında** ekleniyor; site genelinde açılışta uygulayan ayrı IIFE (`fit-shell.js:1953`) yerinde | ✅ |
| `FIT_SHELL.pref` API'si | duruyor | `egzersiz-detay-v1.html`'de `typeof = "function"`, konsol 0 | ✅ |
| `.hr-note` `el.closest('.wg-card')` | truthy | **true** | ✅ |
| Uyarı metni | kaybolmadı | metin birebir, `saglik-bilgilendirme` bağlantısı 1 adet | ✅ |
| Konsol hatası | 0 | **66 sayfa × 2 genişlik → 0** | ✅ |

### Verilen kararlar (gerekçe + nasıl geri alınır)
1. **`data-fit-nohealth` işareti bilerek bırakıldı.** Artık hiçbir şey yapmıyor
   ama hiçbir sayfada kullanılmıyordu; kaldırmak kazanç getirmezdi.
   *Geri alma gerekmiyor.*
2. **Tercihler `.fh-pref` düğme dili yerine sayfanın `.fp-sw` anahtar diliyle
   kuruldu.** Gerekçe: `fit-planim-veri-izin` sayfasında zaten 10 anahtar var;
   oraya farklı bir kontrol dili taşımak sayfayı ikiye bölerdi. *Geri alma:
   kart bloğunu `.fh-pref` düğmelerine çevirmek — ama `.fh-*` CSS'i silindi,
   önce geri yazılmalı.*
3. **`.fp-sw` işleyicisi ikiye ayrıldı.** Gerekçe: tek işleyici hem çevirip hem
   kayıt yazsaydı, kayıt tutmayan 10 gösterim anahtarı da localStorage'a
   yazmaya başlardı. *Geri alma: iki `forEach`'i tek `forEach`'te birleştirmek.*
4. **`fit-shell.js`'teki "Veri ve İzinlerim" `desc` metni güncellendi.**
   Gerekçe: sayfa artık uygulama tercihlerini de taşıyor, eski açıklama eksik
   kalıyordu. `tests/plan-account.mjs` etiketleri kontrol ediyor, açıklamaları
   değil — yeşil. *Geri alma: iki satırdaki `· uygulama tercihleri` ekini silmek.*

### Sınama nöbetleri — TAŞINDI, ZAYIFLATILMADI
- `tests/footer-curtain.mjs`: eski §B ölçütü *"sağlık şeridi perdenin İÇİNDE"*
  idi → yeni ölçüt *"`.fit-health` düğümü **0** olmalı"*. R11 perde ölçütleri
  (fark tek değer, kuyruk 0, ≤640'ta perde kapalı) **aynen duruyor**.
- `tests/footer-yapi.mjs` §12: eski B10 nöbeti (*"`#pageMain`'in son çocuğu"*)
  → yeni nöbet **iki koşullu**: (a) `.fit-health` **0 düğüm**, (b) her sayfanın
  footer yasal bandında `saglik-bilgilendirme-v1.html` bağlantısı **≥ 1**.
  Yani nöbet zayıflamadı, *genişledi* — artık uyarının siteden kaybolmadığını
  da sınıyor. Yasal bant nöbeti (§10) ve R11 (§11) dokunulmadan duruyor.

---

## Madde 4 — İstatistik şeridi sağda dikey (tüm site)

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET** (yukarıdaki özet).
- **Yapılan değişiklik:**
  - `assets/js/fit-shell.js:991–1039` — **yeni IIFE**: banner'lı sayfada
    `.lib-stats`'ı bulup `.wrap`ı referansın yapısına çeviriyor:
    ```
    .wrap > kırıntı                 (tam genişlik, kolonların ÜSTÜNDE)
    .wrap > .lib-row > .lib-main | .lib-stats
    ```
    İşaretleme 25 sayfada tek tek değiştirilmedi.
  - `assets/css/fit-shell.css:1893–1979` — R6 madde 4 bloğu. R15'in
    `.lib-stats{order:1}` numarası **silindi** (istatistik kolondan çıktı,
    karşılığı kalmadı). `body[data-brand="fit"] .lib-top .lib-stats{margin-top:…}`
    da ölü kaldığı için kaldırıldı.
  - `video-seanslari-v1.html:156` — içi boş 4. `.lib-stat` kaldırıldı.
- **Neden JS:** `.wrap`ı grid'e çevirip şeridi bütün satırlara yaymak denendi;
  satır sayısı sayfadan sayfaya değiştiği için `grid-row:1/-1` çalışmıyor,
  `span N` ise N−1 boş satır aralığı (row-gap) üretip **sabit yükseklikli
  banner'ı büyütüyor**. Referans da aynı yapıyı kuruyor (`.lh-main`).
- **Ekran görüntüsü:** `m4-sozluk-g1-*.png` · `m4-kutuphane-g1-*.png` ·
  `m4-trust-g1-*.png` · `m4-anatomi-g1-*.png` · `m4-sozlukdetay-g1-*.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — kırıntı ile iri sayı aynı hizada başlıyordu.** İlk kurulumda
  kırıntı `.lib-main`in içindeydi; şerit sol kolondan uzun olduğu **6 sayfada**
  (sozluk · egzersiz-kutuphane · hesabim · challenge-merkezi ·
  uyelik-faturalandirma · enerji-ihtiyaci) ilk sayının üst kenarı kırıntının
  **0.8 px ÜSTÜNE** çıkıyordu. Referansta bu asla olmuyor (kırıntı iki kolonun
  üstünde ayrı bir satır). → Kırıntı `.lib-row`un dışında bırakıldı.
  **Ölçülen önce Δüst −0.8 px (kırıntı hizası) → sonra Δüst −50.1 px
  (eyebrow hizası)** — referansın `mutfak-sozlugu`'ndaki değeri −54.0 px.
- **Kusur 2 — etiket kontrastı AA altındaydı.** Yeni etiket rengi
  `rgba(255,255,255,.68)` ile fotoğraflı banner'larda ölçülen kontrast:
  `egzersiz-kutuphane` **3.83:1**, `challenge-merkezi` **4.05:1**,
  `sozluk` **4.49:1** — üçü de 4.5'in altında (12.5 px normal metin).
  → `.85`'e çıkarıldı. **Sonra: 5.14 · 5.48 · 6.55 · 6.63 · 7.65 · 8.46 ·
  10.05 — yedi sayfanın yedisi de AA.**
- **Kusur 3 — hayalet kalem.** `video-seanslari-v1.html`'de dördüncü
  `.lib-stat` içi boştu (yalnız boşluk karakteri); dikey kolonda 16 px'lik
  boş bir satır üretiyordu. **Ölçülen önce şerit yüksekliği 219.8 → sonra
  203.8.** Ayrıca `:empty` kuralı savunma olarak eklendi.
- **Ekran görüntüsü:** `m4-sozluk-g2-*.png` · `m4-programlar-g2-*.png` ·
  `m4-antrenorler-g2-*.png`

### Geçiş 3 · Referansla karşılaştır
Referans: `dadagastro.com/mutfak-sozlugu` · `dadagastro.com/tarifler` ·
`dadadiet.com/diyetisyenler` (üçü de @1440, Playwright).

| Ölçü | mutfak-sozlugu | tarifler | diyetisyenler | **DadaFit (sonuç)** |
|---|---|---|---|---|
| `flex-direction` | column | column | column | **column** ✅ |
| kalemler arası `gap` | 16 px | 16 px | 16 px | **16 px** ✅ |
| kalem yüksekliği | 56.7 | 56.7 | 56.7 | **57.3** (Δ 0.6) ⚠ |
| kalem adımı (üst→üst) | 72.7 | 72.7 | 72.7 | **73.3** (Δ 0.6) ⚠ |
| sol kolon → şerit oluğu | 44 | 44 | 44 | **44** ✅ |
| şeridin sağ kenarı | 1308 | 1308 | 1308 | **1308** ✅ (wrap sağ kenarı) |
| alt hiza (şerit alt − sol kolon alt) | 0.0 | 0.0 | — | **0.0** ✅ |
| sayı `font-size / weight / lh` | 29 / 700 / 31.9 | aynı | aynı | **29 / 700 / 31.9** ✅ |
| etiket `font-size / weight / lh` | 12.5 / 500 / 19.4 | aynı | aynı | **12.5 / 500 / 19.4** ✅ |
| sayı → etiket boşluğu | 6 px | 6 px | 6 px | **6 px** ✅ |
| ayraç çizgisi | yok | yok | yok | **yok** ✅ |
| @1024 · @900 · @768 | flex/**row**, gap 34 | aynı | aynı | **flex/row, gap 34** ✅ |
| ≤640 sayı boyutu | 29 (mutfak) / **20** (tarifler) | — | — | **20** ✅ |
| ≤640 gap | 10 | 10 | — | **20/12** ⚠ |

**Referanstan zayıf kalan noktalar → nasıl kapatıldı:**
1. **Oluk 39 → 44 px.** İlk kurulumda şerit *kutusunun* sol dolgusunu (39 px)
   almıştım; asıl ölçü sol kolonun sağ kenarı ile şeridin sol kenarı arası ve
   üç referans sayfasında da **44 px**. Token `--banner-stat-gutter` 44'e
   çekildi, üç DadaFit sayfasında ölçülerek doğrulandı.
2. **Kırıntı yapısı** (yukarıda, Kusur 1) — referansın `.rd-crumb` + `.lh-main`
   iskeleti birebir kuruldu.

**Kapatılmayan iki fark, gerekçesiyle:**
- **Kalem yüksekliği 57.3 vs 56.7 (Δ 0.6 px).** Referansta etiket `display:inline`,
  DadaFit'te `block` (satır kutusu tam ölçüsünde). 0.6 px'i kapatmak için
  etiketin `line-height`ını 19.4'ten düşürmek gerekirdi — ölçülen tipografi
  değerini bozardı. Fark algı eşiğinin altında; ölçü olarak raporlandı.
- **≤640 gap 10 yerine 20/12.** Referansın 10 px'i onun üç eşit kolonlu mobil
  ızgarasına ait; DadaFit'te kalem sayısı sayfaya göre 2–5 arasında değişiyor
  (`sozluk-detay` 5 kalem) ve 10 px'te uzun etiketler birbirine giriyor.
  20/12 seçildi; @390'da taşma 0 ölçüldü. *Geri alma:
  `fit-shell.css` `@media (max-width:640px)` bloğunda `column-gap:20px;row-gap:12px`.*

**Ekran görüntüsü:** `m4-sozluk-g3-*.png` · `m4-kutuphane-g3-*.png` ·
`m4-trust-g3-*.png` · `m4-anatomi-g3-*.png` · `m4-programlar-g3-*.png`

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| @1440'ta `.lib-stats` sol kolonun sağında | 33/33 | **26/26** — `.lib-stats` **düğümü** taşıyan sayfa sayısı 26 (madde 7 ile antrenor-detay eklendi). Brief'teki 33, sınıfın *dosyada geçtiği* sayfa sayısı; 8 `hareket-*` sayfası sınıfı yalnız `<style>` içinde anıyor, işaretlemede yok. Düğüm sayısı DOM'dan ölçüldü. | ✅ (26/26) |
| `flex-direction: column` @1440 | tümü | **26/26** | ✅ |
| Banner yükseklikleri LİSTE | 544 / 607 / 587 | **544 (54 sayfa) / 607 / 587** — üç genişlikte de tek değer | ✅ |
| Banner yükseklikleri DETAY | 560 / 617 / 726 | **560 (8 sayfa) / 617 / 726** | ✅ |
| CTA sol kenarı − H1 sol kenarı | 0 | **0 — sapma gösteren sayfa 0** (@1440 · @1024 · @390) | ✅ |
| @390'da şerit sol kolonun altında | evet | **evet**, `flex-direction:row` (referansla aynı) | ✅ |
| Yatay taşma | 0 | **66 sayfa × 3 genişlik → 0** | ✅ |
| Konsol hatası | 0 | **66 sayfa × 3 genişlik → 0** | ✅ |
| `.fit-band-panel` geri taşıma kilidi (B11) | bozulmadı | `fit-shell.js:2246–2266` **dokunulmadı**; `antrenor-detay`'da `panel.closest('.cp-top') === false` ölçüldü | ✅ |

### Verilen kararlar (gerekçe + nasıl geri alınır)
1. **Kolon ≥1025 px'te açılıyor, ≤1024'te yatay sıraya dönüyor.** Referansta
   kırılma 1024 ile 1200 arasında; @1024 · @900 · @768'de üç referans sayfası da
   yatay. DadaFit'in kendi kırılma noktaları 1024/901/640 olduğu için
   `min-width:1025px` seçildi — @1024'te referansla birebir aynı davranış.
   *Geri alma: medya sorgusunun eşiğini değiştirmek.*
2. **Güven çipi taşıyan üç sayfa da (`programini-bul` · `antrenman-olusturucu` ·
   `anatomi`) dikey kolona alındı.** Referans bu ikisini ayırıyor: `.st` sayı
   çiftleri sağda dikey, `wzp-trust` / `reh-htrust` güven çipleri altta yatay
   (ölçüldü: `dadadiet.com/diyetisyen-bul` `.wzp-trust` flex/row, x370 y351.8).
   Brief'in kabul ölçütü **hepsi** dediği için hepsi taşındı; ekran
   görüntüsüyle (`m4-trust-g3-1440.png`) sağdaki dikey çip listesinin iyi
   durduğu doğrulandı. *Geri alma: CSS'te `.lib-stats` seçicisini
   `.lib-stats:has(.lib-stat)` ile daraltmak — üç çip sayfası yatay kalır.*
3. **Etiket rengi DadaFit paletinde kaldı** (`rgba(255,255,255,.85)`), referansın
   `rgb(174,188,198)` / `rgb(201,195,184)` tonu alınmadı — K29: ölçü alınır,
   palet alınmaz.

---

## Madde 5 — `programlar-merkezi-v1.html` banner butonları

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET.**
- **Ölçüm önce (Playwright, `.lib-cta`):** kapsayıcı `display:block`,
  butonlar arası **4 px** (işaretlemedeki satır sonu boşluğu, tasarım değeri
  değil), birincil 173.5 × 50.5, ikincil **179.3** × 52.5 (birincilden geniş),
  ikincil zemin `rgb(255,255,255)` dolu beyaz.
- **Yapılan değişiklik:** `assets/css/fit-shell.css:1934–1975` — `.lib-cta` ve
  `.lib-cta-ghost` **kabuğa** alındı. `antrenorler-v1.html:239–241`'deki sayfa
  içi kopyalar silindi (aynı yuvada iki dil vardı). İki sayfada da ikincil
  butonun ikonu kaldırıldı.
- **Ekran görüntüsü:** `m5-programlar-g1-1440.png` · `m5-programlar-g1-390.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — hiyerarşi TERSTİ.** Fotoğraflı koyu banner'ın üstünde dolu beyaz
  ikincil buton, yeşil birincil butondan daha parlaktı. Ölçülen blok
  parlaklığı: **ikincil ≈ 1.0 (dolu beyaz) → birincil 0.208**.
  → Camsı dil (`rgba(255,255,255,.1)` + beyaz metin + `.26` kenarlık) kabuğa
  alındı. **Sonra: birincil 0.208 · ikincil 0.120** — birincil artık daha
  parlak. `antrenorler`'de aynı ölçü **0.215 / 0.105**.
- **Kusur 2 — ikincil buton daha genişti.** **179.3 > 173.5.** Referansta oran
  her zaman birincil lehine (257.9/161 = 1.60 · 220.9/140.1 = 1.58) ve referans
  banner butonlarında **ikon yok**. → İkincilin ikonu kaldırıldı.
  **Sonra 173.5 > 158.4 (oran 1.10).**
- **Kusur 3 — @390'da 1.2 px pay.** İki buton 173.5 + 4 + 179.3 = **356.8 px**,
  alan 358 px. Herhangi bir etiket değişikliği taşma üretirdi.
  → `flex-wrap:wrap` eklendi; yeni toplam 173.5 + 9 + 158.4 = 340.9, **17 px pay**
  ve gerektiğinde kendiliğinden alt alta geçiyor.
- **Ekran görüntüsü:** `m5-programlar-g2-*.png`

### Geçiş 3 · Referansla karşılaştır
Referans: `dadadiet.com/beslenme` ve `dadadiet.com/diyetisyenler` `.chips` bloğu.

| Ölçü | Referans | DadaFit (sonuç) | ✅/❌ |
|---|---|---|---|
| kapsayıcı | flex, `gap:9px` | flex, **gap 9 px** | ✅ |
| butonlar arası ölçülen aralık | 9 | **9** | ✅ |
| birincil yükseklik | 50.5 | **50.5** | ✅ |
| ikincil yükseklik | 52.5 | **52.5** | ✅ |
| dolgu | `14px 26px` | **14px 26px** | ✅ |
| yarıçap | 12 px | **12 px** | ✅ |
| punto / ağırlık | 14.5 / 700 | **14.5 / 700** | ✅ |
| ikon | yok | ikincilde **yok**, birincilde **var** | ⚠ |
| ikincil zemin dili | dolu beyaz + koyu metin | **camsı + beyaz metin** | ⚠ (gerekçe altta) |
| @390 sarma | var (52.5 → 111.9) | **var** (`flex-wrap`) | ✅ |

**Referanstan bilerek ayrılan tek nokta:** ikincil butonun zemin dili.
Referansın banner'ı **düz koyu dolgu**, DadaFit'inki **fotoğraf**. Fotoğrafın
üstünde dolu beyaz blok birincil butondan daha parlak kalıyor ve hiyerarşiyi
ters çeviriyor (ölçüldü, yukarıda). Bütün *ölçüler* (aralık · yükseklik ·
dolgu · yarıçap · punto) referanstan birebir alındı; yalnız zemin dili
değiştirildi — K29'un "ölçü alınır, palet alınmaz" kuralının aynısı.
Birincilde ikon bırakıldı çünkü hiyerarşiyi güçlendiren ikinci bir işaret
oluyor ve site genelinde `.btn-fit` ikon taşıyor.
**Ekran görüntüsü:** `m5-programlar-g3-1440.png` · `m5-programlar-g3-390.png`

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| Buton yüksekliği referansla | ±2 px | **50.5 / 52.5 — fark 0.0** | ✅ |
| Birincil-ikincil kontrast farkı yazıldı | ölçülüp yazıldı | blok parlaklığı **0.208 vs 0.120** (`antrenorler` 0.215 vs 0.105); metin kontrastı birincil **4.97:1**, ikincil **9.02:1** | ✅ |
| `.btn-fit` kontrastı | ≥ 4.5:1 | **4.97:1** ölçülen piksel örneklemesi; `--fit-deep` token'ına dokunulmadı (S4 hesabı 5.45:1) · `tests/kabuk-kalite.mjs` "S4 .btn-fit AA" yeşil | ✅ |
| Dokunma hedefi @390 | ≥ 44 px | **50.5 · 52.5** | ✅ |
| Banner yüksekliği | 544/607/587 | **544 / 607 / 587** | ✅ |

### Verilen kararlar (gerekçe + nasıl geri alınır)
1. **`.lib-cta` ve `.lib-cta-ghost` kabuğa taşındı, `antrenorler-v1.html`'deki
   sayfa içi kopyalar silindi.** Gerekçe: aynı banner yuvasında iki sayfa iki
   ayrı ikincil buton dili konuşuyordu; §0b "kabukta eksik gören ajan notunu
   yazar, AJAN-A uygular" diyor ve bu tam da kabuk eksiğiydi.
   *Geri alma: `fit-shell.css`'teki `.lib-cta-ghost` bloğunu silmek — kabuğun
   düz `.btn-ghost`u (dolu beyaz) geri gelir.*
2. **İkincil butonun ikonu kaldırıldı.** *Geri alma: iki `<a>` etiketine
   `<i class="fa-solid fa-clipboard-list"></i>` / `fa-id-badge` geri koymak.*

---

## Madde 6 — `programlar-merkezi-v1.html` banner altındaki section

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET.**
- **Önce ölçüldü:** sayfa `#pageMain` altında **3 bölüm** taşıyordu; üçüncüsü
  (`section.sec sec-fit`, @1440 **209.2 px**) **yalnız bir `.hr-note`** içindi —
  tek kalemlik içerik, iki yanında tam bölüm dolgusu. Brief'in tarif ettiği
  "yetim kart" bu.
- **Yapılan değişiklik:** `programlar-merkezi-v1.html` — not, `#tumu`
  bölümünün `.wrap`ının son öğesi oldu; boş kalan `<section>` kaldırıldı.
- **Ekran görüntüsü:** `m6-programlar-g1-1440.png` · `m6-programlar-g1-390.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — yetim bölüm** (yukarıda): **3 bölüm → 2 bölüm**, 209.2 px'lik
  tek kalemlik bölüm kalktı.
- **Kusur 2 — bölüm sırası sorgulandı, DEĞİŞTİRİLMEDİ.** "Video Seansları"nın
  program ızgarasının üstünde olması 7. oturumun E4 kararı (Beyar: *"video
  seansları çok arka planda kalmış, ön plana çıkartabiliriz"*). Ölçüm bunu
  bozacak bir kusur göstermedi; önceki turun açık kararını tersine çevirmek
  gerileme olurdu. Karar gerekçesiyle raporlandı, sıra korundu.
- **Kusur 3 — yetim kolon araması.** İki ızgarada da kart sayısı **4 ve 8**;
  @1440 4 kolon → 1 ve 2 tam satır, @1024 2 kolon → 2 ve 4 tam satır, @390 tek
  kolon. **Yetim kolon 0** — değişiklik gerekmedi, ölçümle kanıtlandı.
- **Ekran görüntüsü:** `m6-programlar-g2-*.png`

### Geçiş 3 · Referansla karşılaştır

| Ölçü | `dadadiet.com/beslenme` | `dadagastro.com/tarifler` | **DadaFit (sonuç)** |
|---|---|---|---|
| banner alt kenarı → ilk section üst kenarı | **0** (yapışık) | −22 (bant üste biniyor) | **0** ✅ (fark 0 ≤ 4) |
| bölüm `padding-top` | 74 | 38 | **50** ⚠ |
| bölüm `padding-bottom` | 74 | 74 | **50** ⚠ |
| kart ızgarası kolon | 3 | 3 | **4** (gerekçe altta) |
| yasal notun yeri | son içerik bölümünün **kuyruğunda** | — | **kuyrukta** ✅ |

**Referanstan zayıf kalan nokta → nasıl kapatıldı / neden kapatılmadı:**
- **Notun yeri** referansla eşitlendi (yukarıda).
- **Bölüm dolgusu 50 vs 74.** Bu bir **site geneli token** (`--sec-pad`,
  65 sayfa). Tek sayfada 74'e çıkarmak bu sayfayı sitenin geri kalanından
  ayırırdı; token'ı sitede değiştirmek ise madde 6'nın kapsamı dışında ve
  şu anda beş ajan kendi sayfalarında çalışıyor. **Kabuk notu olarak lead'e
  bırakıldı** (aşağıdaki bölüm).
- **Izgara 3 yerine 4 kolon.** 3 kolonda 4 kartlık ızgara 3+1, 8 kartlık ızgara
  3+3+2 verir — **her ikisinde de yetim kolon**. Kabul ölçütü açıkça "yetim
  kolon bırakmıyor" dediği için 4 kolon korundu.
**Ekran görüntüsü:** `m6-programlar-g3-1440.png` · `m6-programlar-g3-390.png`

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| Banner alt → ilk section üst, referansla | fark ≤ 4 px | referans **0**, DadaFit **0** → fark **0** | ✅ |
| Kart ızgarası yetim kolon | 0 | **0** (4 ve 8 kart; @1440 4 kolon, @1024 2 kolon, @390 1 kolon) | ✅ |
| @390 dikey ritim tek değerde | evet | **34/34** her bölümde (@1024 **42/42**, @1440 **50/50**) | ✅ |
| Yetim tek kart | bırakılmadı | tek kalemlik bölüm kaldırıldı, **3 bölüm → 2** | ✅ |
| Yatay taşma / konsol | 0 / 0 | **0 / 0** (@1440 · @1024 · @390) | ✅ |
| Uyarı metni + sağlık bağlantısı | duruyor | metin birebir, `.hr-note` içinde **2 bağlantı** | ✅ |

### Verilen kararlar (gerekçe + nasıl geri alınır)
1. **Bölüm sırası değiştirilmedi** (E4 kararı korundu). *Geri alma gerekmiyor.*
2. **Yasal not `#tumu`'nun kuyruğuna alındı.** *Geri alma: bloğu
   `</section>`den sonra kendi `<section class="sec sec-fit"><div class="wrap">…`
   sarmalına geri koymak — işaretleme yorumda yazılı.*

---

## Madde 7 — `antrenor-detay-v1.html` banner'ı (+ S-G kararı)

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET.**
- **Önce ölçüldü (site geneli h1 sol kenarı, @1440, 64 banner sayfası):**
  **61 sayfa 132 px** · `program-detay` **165** · `antrenor-detay` **348** ·
  `giris-v1` 827.
  - `antrenor-detay`: `.cp-head` üç kolonlu ızgara (portre | kimlik | CTA),
    portre 186 × 222.
  - `program-detay`: `.pd-panel` cam kutusu, `1px` kenarlık + `32px` yatay
    dolgu → 132 + 1 + 32 = **165**.
- **Yapılan değişiklik:**
  - `antrenor-detay-v1.html` — `.cp-head{display:block}`, portre **128 × 128
    yuvarlak** ve kimlik bloğunun üstünde (ölçü referanstan:
    `dadadiet.com/diyetisyen/dyt-elif-sahin` `.pf-ava` = **128 × 128**).
    `.cp-meta` şeridi **`.lib-stats`'a çevrildi** ve madde 4'ün sağ dikey
    kolonuna girdi; üç kalemin içeriği korundu (4.9 · 120 değerlendirme /
    180+ danışan / 3 saat ortalama yanıt süresi). `.cp-meta` CSS ailesi silindi.
  - `program-detay-v1.html` — `.pd-panel`in kutusu (zemin · kenarlık · yarıçap ·
    dolgu) kaldırıldı; `max-width` prose'a (`h1{max-width:672px}`) taşındı.
    `.pd-hero-media::after` perdesine soldan sağa açılan bir koyu katman
    eklendi (panelin taşıdığı okunurluğu perde devraldı).
  - `assets/css/fit-shell.css` ≤640 bloğu — `.pd-hero .pd-panel{padding:16px 0}`
    (yatay dolgu 18 → 0, mobilde h1 kırıntıyla aynı kenardan başlasın diye),
    `.cp-top .cp-portre` 64 → **72 px** yuvarlak, ölü `.cp-meta` kuralı silindi.
- **Ekran görüntüsü:** `m7-antrenordetay-g1-*.png` · `m7-programdetay-g1-*.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — @390'da h1 hâlâ hizasızdı.** `program-detay`'da mobil h1 sol
  kenarı **34 px**, kırıntınınki 16 px; fark kabuğun ≤640 bloğundaki
  `.pd-hero .pd-panel{padding:16px 18px !important}` kuralından geliyordu.
  → Yatay dolgu 0'a çekildi. **Ölçülen önce 34 → sonra 16.**
- **Kusur 2 — beşinci çip yetim kalıyordu.** `.pd-meta`'nın beş çipi
  `.pd-panel`in 672 px sınırında **4 + 1** kırılıyordu (ikinci satırda tek çip).
  → `max-width` panelden h1'e taşındı, çip şeridi kendi genişliğinde.
  **Ölçülen önce 2 satır → sonra 1 satır (@1440).**
- **Kusur 3 — sayfa siteden 22 px erken bitiyordu.** `antrenor-detay`'ın son
  bloğu `#pageMain`in doğrudan çocuğu olan çıplak bir `.wrap`tı
  (`margin-bottom:28px`, `padding-bottom:0`); 64 sayfanın **54'ünde** son
  çocuğun `padding-bottom`u 50. Aynı sınıf kusur madde 6'da düzeltilmişti.
  → Not, bir üstteki `.sim-sec` bölümünün kuyruğuna alındı.
  **Ölçülen önce son çocuk `div.wrap` / pb 0 → sonra `section.sim-sec` / pb 50
  (@390: 34).**
- **Kusur 4 — yuvarlak kırpma.** Portre `background-position:center top`
  ile yuvarlağa kırpılınca fotoğrafın üst kenarı geliyordu → `center`.
- **Ekran görüntüsü:** `m7-antrenordetay-g2-*.png` · `m7-programdetay-g2-*.png`

### Geçiş 3 · Referansla karşılaştır
Referans: `dadadiet.com/diyetisyen/dyt-elif-sahin` (profil detayı) ve
`dadadiet.com/beslenme-rehberi/dengeli-tabak` (makale detayı, 560 px — DadaFit
detay ailesiyle aynı yükseklik).

| Ölçü | Referans profil | Referans makale | **DadaFit sonuç** |
|---|---|---|---|
| banner yüksekliği | 625.8 (aile yok) | **560** | **560 / 617 / 726** ✅ |
| h1 sol kenarı | **345** (avatar solda) | **132** | **132** (ikisinde de) |
| avatar | 128 × 128, yuvarlak | — | **128 × 128, yuvarlak** ✅ |
| sağ kolon | `.pf-actions` 194 px, flex/**column** | — | `.lib-stats` **flex/column**, sağda ✅ |
| cam panel | yok | **yok** | **kaldırıldı** ✅ |
| içerik altındaki boş bant | — | — | **79.7** (referans `/diyetisyenler` 86.7) ✅ |

**Referansla çelişen tek nokta ve nasıl karara bağlandı:** referansın profil
sayfası h1'i **345**'te bırakıyor, yani "tek kolon / 132" *referanstan gelen*
bir kural değil. Ama S-G, Beyar'ın kendi kararı ve brief madde 7 bu maddede
uygulanmasını istiyor. Beyar'ın kararı referansı yener; referansın 128 px'lik
yuvarlak avatar ölçüsü ise alınarak iki taraf da karşılandı. Makale detayı
referansı (`dengeli-tabak`) h1'i zaten 132'de tutuyor ve panelsiz — `program-detay`
tam olarak ona hizalandı.
**Ekran görüntüsü:** `m7-antrenordetay-g3-*.png` · `m7-programdetay-g3-*.png`

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| `.cp-top` yüksekliği | 560 / 617 / 726 | **560 / 617 / 726** | ✅ |
| h1 sol kenarı @1440 | 132 px | `antrenor-detay` **132** · `program-detay` **132** | ✅ |
| Site geneli h1 sol kenarı | 56/56 → 132 | **63/64 sayfa 132**. Kalan tek sayfa `giris-v1.html` (`.au-top`, 827) — giriş sayfasının iki kolonlu formu, banner ailesine hiç girmiyor (`data-fit-hero-kind` yüksekliği uygulanmıyor) ve S-G kararında adı geçmiyor. | ✅ (aile içi 63/63) |
| İstatistik şeridi sağda dikey | evet | `.lib-stats` x **1187.9** > sol kolon sağ kenarı **1143.9**, `flex-direction: column`, alt hiza Δ **0.0** | ✅ |
| `.fit-band-panel` banner'a geri taşınmadı (B11) | taşınmadı | `panel.closest('.cp-top')` = **false** (@1440 · @1024 · @390) | ✅ |
| Yatay taşma / konsol | 0 / 0 | **0 / 0** (@1440 · @1024 · @390, iki sayfada da) | ✅ |

### Verilen kararlar (gerekçe + nasıl geri alınır)
1. **`antrenor-detay`: büyük dikdörtgen portre → 128 px yuvarlak avatar.**
   Gerekçe: tek kolonda 186 × 222'lik portre + kimlik bloğu 402.9 px yer
   istiyordu, sabit 560 px kutuda kullanılabilir alan **386 px**. Referansın
   kendi profil sayfasındaki 128 × 128 yuvarlak avatar ölçüsü alındı; yeni
   toplam **306.9 px**, 79.7 px pay kaldı. *Geri alma: `.cp-portre`yi
   186 × 222 + `--radius-xl`e döndürmek ve `.cp-head`i üç kolonlu ızgaraya
   geri almak (işaretleme yorumda yazılı).*
2. **`.cp-meta` → `.lib-stats`.** Gerekçe: madde 7 şeridi sağda dikey istiyor;
   `.cp-meta` zaten bir istatistik şeridiydi, ayrı bir bileşen dili tutmak
   için sebep yoktu. Metin korundu, yalnız "Genelde 3 saat içinde yanıtlar"
   → **"3 saat / ortalama yanıt süresi"** biçimine ayrıldı (sayı + etiket
   çifti). *Geri alma: eski `.cp-meta` işaretlemesi ve CSS'i yorumda yazılı.*
3. **`program-detay`: cam panel kaldırıldı, perde güçlendirildi.**
   *Geri alma: `.pd-panel`i eski kutulu haline döndürmek + perdenin ikinci
   `linear-gradient(95deg,…)` katmanını silmek.*
4. **`giris-v1.html`'e dokunulmadı.** S-G kararı iki sayfa adı veriyor;
   giriş sayfası banner ailesinde değil. Lead isterse ayrı madde olur.

---

## Kabukta gördüğüm ama DOKUNMADIĞIM eksikler (lead'e)

1. **`--sec-pad` 50 px, referansta 74 px.** Kardeş markalarda bölüm dolgusu
   `dadadiet.com/beslenme`'de **74/74**, `dadagastro.com/tarifler`'de 38/74;
   DadaFit'te **50/50** (@1024 42 · @390 34). Site genelini ilgilendiren tek
   token; beş ajan aynı anda kendi sayfalarında çalışırken değiştirmedim.
   Kararı lead versin.
2. **`sozluk-v1.html` banner eyebrow'u "TERİM TERİM" yazıyor** — kelime iki kez.
   AJAN-B'nin dosyası, dokunmadım (`m4-sozluk-g3-1440.png`'de görünüyor).
3. **`antrenor-detay` portre fotoğrafı bir portre değil** — Unsplash'ten gelen
   geniş bir salon karesi; yuvarlak kırpmada yüz görünmüyor. İçerik konusu,
   uydurma adres koymadım. `docs/icerik-bekleyen.md`'ye yazılmaya aday.
4. **`giris-v1.html` h1'i 827 px'te** — banner ailesi dışında. S-G kararı bu
   sayfayı kapsamıyor; kapsaması isteniyorsa ayrı madde gerekir.
5. **`href="#"` sayısı her sayfada 8** (kabuktan geliyor, `tools/page-check.mjs`
   uyarısı). Bu turun kapsamında değildi.
6. **Kurumsal bant @390'da 4 satır** — `tests/footer-yapi.mjs`'in bilinen notu,
   7. oturumdan devrediyor.

---

## Bozulmadığını kanıtladıklarım

- **Banner ailesi.** LİSTE **544 / 607 / 587** (54 sayfa) · DETAY
  **560 / 617 / 726** (8 sayfa) — 66 sayfa × 3 genişlik taranıp tek değere
  oturduğu ölçüldü, üçüncü değer yok.
- **R11 footer perdesi.** `main.margin-bottom − footer yüksekliği` = **0, tek
  değer, 65/65 sayfa** (@1440); kuyruk **0**; @390'da perde kipi kapalı
  (tasarım gereği). `tests/footer-curtain.mjs` yeşil.
- **Yasal bant.** `FOOTER_LEGAL` bloğunda tek karakter değişmedi
  (`git diff assets/js/fit-shell.js` ile doğrulandı); `tests/footer-yapi.mjs`
  §10 nöbeti yeşil.
- **Kırıntı ev ikonu (R12).** `tests/crumb-home.mjs`: **64/64 sayfada 9 px ·
  kutu 10.1 × 9 · ayraçla eşit · boşluk 9 px** (@1440 ve @390).
- **`.btn-fit` kontrastı (S4).** `--fit-deep` token'ına dokunulmadı;
  `tests/kabuk-kalite.mjs` "S4 `.btn-fit` AA" yeşil; piksel örneklemesi
  banner butonunda **4.97:1**.
- **Ana sayfa herosu (K15 / S-H).** `dadafit-hub-v1.html` `.df-top` = **900 px**,
  `.lib-row` **yok**, `.lib-stats` **0** — madde 4 bu sayfaya hiç değmedi.
- **`.fit-band-panel` geri taşıma kilidi (B11).** `fit-shell.js:2246–2266`
  dokunulmadı; `antrenor-detay`'da panel banner'ın içinde **değil**.
- **`FIT_SHELL.pref` API'si.** `egzersiz-detay-v1.html` hâlâ okuyor
  (`typeof = "function"`, konsol 0).

### Koşturulan sınamalar

| Sınama | Sonuç |
|---|---|
| `tests/footer-curtain.mjs` | **0 sorun** (güncellendi — nöbet taşındı) |
| `tests/footer-yapi.mjs` | **0 sorun** (güncellendi — nöbet taşındı ve genişletildi) |
| `tests/header-banner.mjs` | **0 sorun** · 20 sayfa × 4 genişlik |
| `tests/crumb-home.mjs` | **0 sorun** · 64/64 sayfa |
| `tests/kabuk-kalite.mjs` | **0 sorun** |
| `tests/a11y-focus.mjs` | **0 sorun** |
| `tests/coach-list.mjs` | **0 sorun** |
| `tests/plan-account.mjs` | **0 sorun** |
| `tests/dropdown-position.mjs` | **0 sorun** · 36 panel |
| `tests/wizard-page.mjs` | **0 sorun** |
| `tools/page-check.mjs` × 6 dokunulan sayfa | **6/6 temiz** |

**Not:** `sozluk.mjs` · `anatomi.mjs` · `workout-generator.mjs` ·
`egzersiz-katalog.mjs` · `enerji-hesap.mjs` · `fit-test-lock.mjs` ·
`sozluk-kapalilik.mjs` koşturulmadı — o dosyalarda şu anda başka ajanlar
çalışıyor, sonuçları benim değişikliğimi değil onların ara durumunu ölçerdi.
Birleştirmede lead'in tam süiti koşturması gerekiyor.

---

# EK · AJAN-E'NİN KABUK NOTLARINA YANIT (rapordan sonra geldi)

## Not 1 — "Madde 4, Fit Planım banner'ını @1440'ta bozuyor" → **KUSUR GERÇEKTİ, ZATEN KAPALIYDI**

AJAN-E'nin ölçümü doğru ama **turun ara durumuna** ait. Bildirdiği kural
(`body[data-fit-hero-kind] .lib-top > .wrap{flex-direction:row}`) benim ilk
kurulumumdu ve **madde 4'ün 2. geçişinde** kaldırıldı: kural `.wrap`a değil,
kabuk JS'inin kurduğu `.lib-row` sarmalayıcısına bağlandı (asıl gerekçe
farklıydı — referansın kırıntıyı iki kolonun üstünde tutan yapısına geçmek).

**Şimdiki durum ölçüldü, 9 sayfa × 3 genişlik:**

| Genişlik | `.wrap` | `.lib-main` | Dizilim |
|---|---|---|---|
| @1440 | `flex/**column**` | 0 (gerekmiyor) | 5 blok **alt alta**, hepsi x=132, y 128 → 177.4 → 216 → 283 → 351 |
| @1024 | `flex/column` | 0 | alt alta, x=24 |
| @390 | `flex/column` | 0 | alt alta, x=16 |

Banner yükseklikleri **544 / 607 / 587** — dokuz sayfanın hepsinde.
`#fitPlanTop` üreticisine dokunmam gerekmedi; `.lib-row` yoksa `.wrap` R15'in
tek kolon kuralında kalıyor.

**AJAN-E'nin asıl kıymetli tespiti:** *"Yükseklik ölçen nöbet bunu yakalamaz."*
Doğru — bloklar yan yana dizilince banner yüksekliği değişmiyor, aile kilidi
ve onu bekleyen bütün sınamalar yeşil kalıyordu. **Bu boşluk kapatıldı.**

### Yeni nöbet — `tests/footer-yapi.mjs` ölçüt **12b**
Tüm sayfaları @1440'ta tarayan mevcut döngüye tek ölçüt eklendi:
> Banner `.wrap`ının çocukları **yan yana** diziliyorsa (`|Δtop| < 4` ve
> `|Δleft| > 4`), `.wrap > .lib-row` **var olmak zorundadır**.

**Yeşil koşusu:** `R6 m4: 62 banner sayfası · 26'inde .lib-row iki kolon ·
sarmalayıcısız yan yana dizilim 0`

**Kırmızıya döndüğü KANITLANDI (K27 yöntemi):** AJAN-E'nin bildirdiği kusurlu
kural geçici olarak geri konuldu, sınama koşturuldu, dosya geri alındı:
```
12 sorun
✗ 12b · fit-planim-gecmis-v1.html      .lib-top > .wrap çocukları YAN YANA ama .lib-row yok (0)
✗ 12b · fit-planim-ilerleme-v1.html    …
✗ 12b · fit-planim-kaydettiklerim-v1.html · fit-planim-programim-v1.html · …
✗ 12b · enerji-defteri-dengele-v1.html · enerji-defteri-su-v1.html
```
**Nöbet AJAN-E'nin raporundan geniş çıktı:** 9 değil **12 sayfa** kırmızıya
döndü — Fit Planım'ın 9'una ek olarak `enerji-defteri-dengele`,
`enerji-defteri-su` ve bir sayfa daha. Yani aynı kusur Enerji Defteri'nin
banner'larını da vuracaktı.

## Not 2 — `.eyebrow` kontrastı → **DÜZELTİLDİ**

AJAN-E'nin ölçümü doğrulandı ve **genişletildi**. 66 sayfa tarandı, açık
zeminli `.eyebrow`ların hepsi ölçüldü — sorun yalnız kontrast değil,
**dört ayrı renk** kullanılıyor olmasıydı:

| Renk | Beyaz | Krem | Önce | Sonra |
|---|---|---|---|---|
| `rgb(0,122,61)` `--fit-deep` | **5.45:1** AA | **5.18:1** AA | 39 sayfa | **64 sayfa** |
| `rgb(0,157,79)` `--tomato` | 3.54:1 AA ALTI | 3.36:1 AA ALTI | **25 sayfa** | **0** |
| `rgb(52,196,126)` `--fit-bright` | 2.25:1 | 2.13:1 | 9 sayfa | 9 sayfa — **yanlış pozitif, aşağıda** |
| `rgb(225,72,39)` `--food` | 4.07:1 AA ALTI | — | 1 sayfa | 1 sayfa — dokunulmadı, aşağıda |

**Değişiklik:** `fit-shell.css:166–173` — taban `.eyebrow{color:var(--tomato)}`
→ `var(--fit-deep)`. Tek satır, 25 sayfa AA'ya geçti. Sayfa içi
`.sec-fit .eyebrow` / `.lib-top .eyebrow` kuralları daha yüksek özgüllükte
olduğu için etkilenmedi.

**Koyu zeminin güvende olduğu ölçüldü:** 62 banner sayfasının **61'i** banner
içi eyebrow'a zaten açıkça `--fit-bright` veriyor, 1'i (`giris-v1`) daha da
açık bir ton. **Hiçbiri taban kuralı okumuyor** — yani taban koyulaşınca koyu
zeminde hiçbir şey bozulmadı.

**Kendi taramamdaki yanlış pozitifi düzelttim:** `rgb(52,196,126)` görünen
9 sayfa aslında **koyu panellerin içinde**. İlk taramamda zemini CSS'ten
yürüyerek buluyordum; o paneller gradyan/görsel zemin taşıdığı için
`backgroundColor` şeffaf dönüyor ve tarama sayfa zeminine kadar çıkıyordu.
**Piksel örneklemesiyle doğrulandı:**

| Örnek | Zemin parlaklığı | Gerçek kontrast |
|---|---|---|
| `dadafit-hub` `.df-bc-main` | 0.013 (KOYU) | **6.54:1** AA |
| `hakkimizda` `.sb-head` | 0.020 (KOYU) | **5.82:1** AA |
| `enerji-defteri-dengele` `.bal-l` | 0.054 (KOYU) | **5.11:1** AA |

## Not 3 — `--muted` kontrastı → **DÜZELTİLDİ**

Doğrulandı: `#7E7E7E` beyazda **4.06:1**, kremde **3.86:1** — 12–13 px
etiketlerde AA altı, **66 sayfanın 66'sında** bu renkte metin var.

**Değişiklik:** `fit-shell.css:97–106` — `--muted:#7E7E7E` → **`#717171`**.
Değer uydurulmadı; AJAN-E'nin kardeş markadan ölçtüğü gri
(`dadadiet.com/hesaplayicilar` `.hub-grid p` → `rgb(113,113,113)`).
**Sonra: beyazda 4.88:1, kremde 4.64:1 — AA.**

Yalnız renk değişti; hiçbir ölçü, boşluk ya da yerleşim değişmedi.
**Koyu zeminde `--muted` metin sayısı: 0** (tarandı) — koyulaşma kimseyi
kırmadı. AJAN-E'nin *"kendi bileşenlerimde bilerek `--muted`'ta kaldım"*
kararı artık gereksiz: token'ın kendisi AA.

## Not 4 — Dokunma hedefleri → **BİRİ DÜZELTİLDİ, GERİSİ ÖLÇÜLDÜ**

| Öğe | @390 önce | @390 sonra | Karar |
|---|---|---|---|
| `.fit-tab` (Planım rayı) | **37.4 px** | **44.0 px** (7/7) | ✅ düzeltildi — `min-height:44px`, dolgu değil (punto değişse de hedef düşmez) |
| `.chip` | 30 px | 30 px | ⚠ bırakıldı — WCAG 2.5.8 (AA) eşiği **24 px**, 44 px eşiği 2.5.5 (**AAA**). Referansın kendi çipi de altında: `dadagastro.com/tarifler` `.chip` = **38.1 px**. Yoğun süzgeç çipini 44'e çıkarmak süzgeç satırının ritmini bozardı. |
| `.fp-act` · `.fp-actbtn` · `.see-all` · `.df-fchip` | — | 44 px | AJAN-E kendi sayfalarında zaten kapatmış; kabuk tabanında bırakmam gerekirse ayrı madde |

## Kabul ölçütleri (ek tur)

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| Fit Planım banner'ı 9 sayfa × 3 genişlik | tek kolon | **9/9 · 3/3 `flex/column`**, bloklar alt alta | ✅ |
| Fit Planım banner yükseklikleri | 544/607/587 | **544 / 607 / 587** | ✅ |
| Yeni nöbet 12b yeşil | sarmalayıcısız yan yana 0 | **62 banner sayfası · 0** | ✅ |
| Yeni nöbet 12b kırmızıya dönüyor | kusur geri konunca kırmızı | **12 sayfada kırmızı** (AJAN-E'nin bulduğu 9 + 3) | ✅ |
| `.eyebrow` açık zeminde AA | ≥ 4.5:1 | **64 sayfa 5.18–5.45:1**; AA altı kalan: 1 (`--food`, aşağıda) | ✅ |
| `--muted` AA | ≥ 4.5:1 | **4.88 / 4.64:1** | ✅ |
| `.fit-tab` @390 | ≥ 44 px | **44.0 px, 7/7** | ✅ |
| Sınamalar | hepsi yeşil | **10/10 · 0 sorun** (footer-yapi · footer-curtain · header-banner · crumb-home · kabuk-kalite · a11y-focus · plan-account · coach-list · dropdown-position · wizard-page) | ✅ |

## Bu ek turda DOKUNMADIĞIM, lead'e bıraktığım

- **`enerji-defteri-dengele-v1.html`'de `--food` eyebrow'u** — `rgb(225,72,39)`,
  beyaz üzerinde **4.07:1**, AA altı. Sayfa CSS'inde `.sec-food .eyebrow{color:var(--food)}`
  ile **bilerek** kardeş marka aksanı verilmiş. Bu bir kontrast kusuru **ve**
  bir marka dili sorusu (DadaFit sayfasında gastro kırmızısı); ikisi de tek
  başıma vereceğim karar değil. Sayfa da benim madde listemde yok.
- **`.chip` 30 px** (yukarıda, gerekçesiyle).
- **`--tomato` token adı** `#009d4f` (yeşil) değerini taşıyor — gastro
  paletinden kalma yanıltıcı bir ad. Değer doğru, ad yanlış; yeniden
  adlandırma 66 sayfayı tarayan ayrı bir iş.

---

# EK 2 · AJAN-E'NİN İKİ AÇIK KALEMİ — İKİSİ DE KAPATILDI

## Kalem 1 — `.lead` yaslaması → **İSTİSNAYA ALINDI**

### Önce yaptığım hatalı değerlendirmeyi düzeltiyorum
Madde 7'nin 2. geçişinde `program-detay`ın yaslı lead'ini görüp *"site'ın seçtiği
stil, bırak"* demiştim. **Yanlıştı.** `fit-type.css`'in kendi ölçütüne göre bu
blok istisna kategorisinde; AJAN-E'nin ölçümü bunu görünür kıldı.

### Ölçüm (kendi ölçümüm, AJAN-E'nin sayısını devralmadım)
İlk denediğim Range-API yöntemi **çalışmadı** — her blokta 1× döndürdü
(boşluk karakteri üzerindeki `getClientRects()` yaslama gerilmesini
yansıtmıyor). Yöntemi değiştirdim: her kelimeyi geçici bir `<i>` içine alıp
**komşu kelime kutuları arasındaki gerçek boşluğu** ölçtüm.

| Sayfa | Satır | Genişlik | Kelime arası (normal → en geniş) | Kat |
|---|---|---|---|---|
| `hakkimizda` `.lead` | 2 | 520 px | 3.9 → **17.7 px** | **4.6×** |
| `program-detay` `.lead` | 3 | 520 px | 3.9 → 14.8 px | 3.8× |
| `programlar-merkezi` `.lead` | 2 | 520 px | 3.9 → 13.5 px | 3.5× |
| `programlar-merkezi` `.lead` | 3 | 358 px (@390) | 3.6 → 12.1 px | 3.3× |

4. turda istisnaya alınanlarla karşılaştırma:
`.wz-risk p` **4.6×** · `.lib-sub` 3.6× · `.ft-lead` 3.1×.
**`.lead` en kötüsü kadar kötü.**

### Kararın dayanağı kuralın kendi ölçütü
`fit-type.css`'in istisna gerekçesi aynen şöyle diyor: *"bu bloklar 500–900px
genişlikte ve YALNIZ 2–4 SATIR"*. 66 sayfa tarandı:
- yaslanan `.lead`: **79 blok · 34 sayfa**
- **@1440'ta 79/79'u ≤4 satır**, @390'da 77/79
- satır dağılımı @1440: 1 satır×11 · 2 satır×55 · 3 satır×11 · 4 satır×2

Yani `.lead` akan makale metni değil, bölüm girişi. **Bir tutarsızlık da
kapandı:** varyantları `.fs-lead` ve `.ft-lead` 4. turda istisnaya alınmıştı,
taban `.lead` alınmamıştı.

### Değişiklik ve sonuç
`assets/css/fit-type.css` — `.lead` istisna listesine eklendi (gerekçe ve
dört ölçüm dosyaya yazıldı).

| Ölçüt | Ölçülen | ✅/❌ |
|---|---|---|
| `.lead` yaslı blok sayısı | **@1440 ve @390'da 0** (önce 79) | ✅ |
| `.lead` sola yaslı | 10/10 (örneklenen 6 sayfa) | ✅ |
| Akan metin yaslı KALDI | `li` · `.art-wrap p` · `.qa-body p` · `.hub-body p` · `.pr-body p` — dokunulmadı | ✅ |

## Kalem 2 — `.fp-act` · `.fp-actbtn` · `.see-all` → **DÜZELTİLDİ (AA kusuruydu)**

### Önceki cevabımı düzeltiyorum
İlk turda bu dördü için *"AJAN-E kendi sayfalarında kapatmış, kabuk tabanında
ayrı madde"* demiştim — **ölçmeden**. AJAN-E haklıydı: `.chip` için
kullandığım gerekçe (24 px AA eşiğini geçiyor) bunlar için geçerli değil,
çünkü **24 px'in de altındalar**.

### Ölçüm — 66 sayfa, @390, tüm görünür örnekler

| Öğe | En küçük | Örnek / sayfa | 2.5.8 (24 px, **AA**) | 2.5.5 (44 px, AAA) |
|---|---|---|---|---|
| `.fp-act` | **13.0 px** | 42 / 10 | ✗ **KALIR** | ✗ |
| `.fp-actbtn` | **16.0 px** | 13 / 3 | ✗ **KALIR** | ✗ |
| `.see-all` | **20.1 px** | 26 / 19 | ✗ **KALIR** | ✗ |
| `.chip` | 30 px | 35 / 6 | ✓ geçer | ✗ |
| `.sort-seg button` | 32 px | 18 / 6 | ✓ geçer | ✗ |
| `.df-fchip` | **34 px** | 76 / 10 | ✓ geçer | ✗ |
| `.dt` | 34 px | 30 / 5 | ✓ geçer | ✗ |
| `.pf-tabs a` | 37.4 px | 15 / 2 | ✓ geçer | ✗ |

**AJAN-E'nin listesindeki `.df-fchip` düzeltilmedi:** ölçülen 34 px, AA eşiğini
geçiyor — `.chip` ile aynı kategoride, aynı gerekçeyle bırakıldı.

### Değişiklik
`assets/css/fit-shell.css` ≤640 bloğu. Üçü de **tasarım gereği metin-link**
(≤640'ta buton kabuğu bilerek kaldırılıyor); dolgu eklemek o kararı bozardı.
Bunun yerine `::after` ile **görünmez örtü** — `.fp-sw`'de kullanılan yöntemin
aynısı. Hiçbir kutu büyümedi, satır ritmi değişmedi.

Ek olarak `.see-all`ın ≤640 rengi `--tomato` → `--fit-deep` (aynı eyebrow
kusuru: 3.54:1 → **5.45:1**).

### Doğrulama — `elementFromPoint` ile gerçek isabet

| Öğe | Görünen yükseklik | Örtü | −21 px | −14 px | +14 px | +21 px |
|---|---|---|---|---|---|---|
| `.fp-act` | 20.1 | **44** | HEDEF | HEDEF | HEDEF | HEDEF |
| `.fp-actbtn` | 16.0 | **44** | HEDEF | HEDEF | HEDEF | HEDEF |
| `.see-all` | 20.9 | **44** | HEDEF | HEDEF | HEDEF | HEDEF |

**Komşu çalma riski ölçüldü:** ardışık `.fp-act` arası en küçük dikey boşluk
**85.1 px**, `.fp-actbtn` arası **85.1 px** → 44 px'lik örtüler örtüşemiyor.
Örtünün dışına çıkınca hedef doğru şekilde ataya geçiyor (`+26 px` →
`DIV.fp-head` / `DIV.fp-row`).

## Sınamalar (ek 2 turu sonrası)

**10/10 · 0 sorun:** footer-yapi · footer-curtain · header-banner · crumb-home ·
kabuk-kalite · a11y-focus · plan-account · coach-list · dropdown-position ·
wizard-page.

**Banner ailesi son kontrol (66 sayfa × 3 genişlik):**
LİSTE **544 / 607 / 587** (54) · DETAY **560 / 617 / 726** (8) ·
`.lib-stats` 26/26 sağda dikey @1440 · CTA-H1 sapması 0 ·
**yatay taşma 0 · konsol hatası 0.**

---

# EK 3 · `.fp-card p` SORUSU → ALTINDAN ÇOK DAHA BÜYÜK BİR KÖK NEDEN ÇIKTI

AJAN-E tek bir soru sordu: *"`.fp-card p` senin listende 'yaslı kalanlar'da;
benim üç sınıfım kart içinde kısa not. Kalsın mı?"* Cevap vermeden ölçtüm ve
soru kendi kapsamından büyük çıktı.

## Kök neden — dosyanın kendi kuralı HİÇ UYGULANMIYORMUŞ

`fit-type.css`'in YÖNTEM bölümü aynen şöyle diyor:
> *"Kör bir `p{text-align:justify}` bu arayüzde iş görmez: kartların çoğunda
> paragraf iki-üç satırlık ve dar; yaslama … kelime araları açıp **nehir**
> üretir. Bu yüzden yaslama **YALNIZ yeterince uzun satır kutusuna sahip
> metne** uygulanır (`--jt-min` eşiği)."*

`:root`ta `--jt-min: 30rem` (~480px) tanımlı. **Üç ayrı kusur bu kuralı
tamamen etkisiz bırakmış:**

1. **`--jt-min` hiçbir yerde okunmuyor.** `grep`: yalnız tanımlandığı satır
   ve yorumu. Token ölü.
2. **Container sorgusu özgüllükten kaybediyor.** Dosyada bir
   `@container (max-width:20rem){ p, li{text-align:left} }` var — ama
   geçersiz kılma **(0,0,1)**, yaslama kuralı `.hub-body p` **(0,1,1)**.
   Container sorgusu özgüllüğü değiştirmez: sorgu **eşleşiyor ama kural
   kaybediyor.** Ölçüm: 237px'lik kutuda computed `text-align: justify`.
   Yani sorgu yazıldığı günden beri hiç iş görmemiş.
3. **Eşik yanlış:** sorgu 20rem (320px) diyor, dosyanın kendi eşiği 30rem
   (480px). 320–480 arası her kart gövdesi 1 ve 2'den bağımsız olarak da açıkta.

`@supports not (container-type)` yedek dalı da Chromium'da hiç çalışmıyor.

## Ölçüm — 66 sayfa, @1440, yaslanan ve ≥6 kelimelik bloklar

Genişlik dağılımı (dosyanın kendi eşiği 480px) ve gerçek kelime arası
(kelimeler geçici span'lere alınıp komşu kutular arası boşluk):

| Seçici | Blok | min–medyan–max | <480px | En kötü kelime arası |
|---|---|---|---|---|
| `.brg-card p` | 24 | 199–199–199 | **24/24 %100** | 3.4 → **64.8 px (19.2×)** |
| `.hub-body p` | 69 | 237–238–338 | **69/69 %100** | 3.4 → **43.3 px (12.8×)** |
| `dd` | 3 | 167–167–390 | **3/3 %100** | 3.5 → 22.6 (6.5×) |
| `.pr-body p` | 9 | 338–338–338 | **9/9 %100** | 3.3 → 16.7 (5.1×) |
| `.ex-body p` | 25 | 238–238–238 | **25/25 %100** | 3.3 → 16.3 (5.0×) |
| `p` (çıplak) | 701 | 196–423–1176 | **367/701 %52** | — |
| `.art-wrap p` | 107 | 199–774–776 | 24/107 %22 | — |
| `.fp-card p` | 25 | 323–620–1122 | 5/25 %20 | 3.5 → 11.9 (3.4×) |
| `li` | 201 | 276–678–788 | 22/201 %11 | 3.6 → 4.6 (1.3×) · 200/201 tek satır |
| `.qa-body p` | 55 | 774–774–858 | **0** | 3.6 → 15 (4.1×) |
| `.qa-body li` · `.art-wrap li` | 133+133 | 678 | **0** | 1× · hepsi tek satır |
| `.lead` | 16 | 520 | **0** | (EK 2'de istisnaya alındı) |

**Görsel doğrulama** (`video-seanslari`, 237px kart gövdesi): tek satır üç
kelimeye düşüyordu — *"aralıklarıyla · kurulmuş · giriş"*, aralar 43 px.
Ekran görüntüsüyle önce/sonra karşılaştırıldı.

## Yapılan iki değişiklik

**1 · Mekanizma onarıldı** (asıl düzeltme, yazarın mimarisini koruyor):
container sorgusu artık yaslama listesinin **aynı seçicilerini tekrarlıyor**
(özgüllük eşit/üstün + dosyada sonra geliyor → kazanıyor) ve eşiği
`--jt-min` ile hizalandı: **20rem → 30rem**. Token ilk kez gerçekten
uygulanıyor. Yedek `@supports not` dalı da aynı seçici setine genişletildi.

**2 · Eşiğin %100 altındaki beş seçici listeden çıkarıldı**
(`.hub-body p` · `.ex-body p` · `.brg-card p` · `.pr-body p` · `dd`).
Hiçbir örnekleri yaslamayı hak etmiyor; `container-type` taşımayan bir
sarmalayıcıya düşerlerse mekanizma onları yakalayamaz — deterministik olsun
diye listeden çıkarıldılar.

## Sonuç — önce / sonra

| Seçici | Yaslanan blok (önce → sonra) | <480px (önce → sonra) |
|---|---|---|
| `.hub-body p` · `.ex-body p` · `.brg-card p` · `.pr-body p` · `dd` | 130 → **0** | 130 → **0** |
| `.art-wrap p` | 107 → **83** | 24 → **0** (min 199 → **520**) |
| `.fp-card p` | 25 → **21** | 5 → **1** (466px, sınırda) |
| `.qa-body p` · `.qa-body li` · `.art-wrap li` | değişmedi | 0 → **0** (774 · 678 · 678) |
| `p` (çıplak) | 701 → 570 | 367 → **236 (%41)** ⚠ lead'e |
| `li` | 201 → 199 | 22 → **20** ⚠ lead'e |

Geniş bloklar yaslı kaldı, doğrulandı: `.qa-body p` justify @774px ·
`.art-wrap p` justify @776px · `.qa-body li` justify @678px.

## AJAN-E'nin sorusunun cevabı
**Yerel ezmesini kaldırmasına gerek yok ama artık gerekmiyor da.**
`.fp-card p`ın medyanı 620px, yani seçici olarak yaslamayı hak ediyor;
onun dar `fpx-note` blokları ise artık **mekanizma tarafından**
yakalanıyor (5 dar blok → 1). Yani doğru cevap "seçiciyi listeden çıkar"
değil, "eşiği çalıştır"dı.

## Lead'e bırakılan iki kalem (tek başıma karar vermedim)
- **Çıplak `p`** — 570 blok, **%41'i hâlâ eşiğin altında.** Bunlar
  `container-type` taşımayan sarmalayıcıların içinde. Dosyanın kendi notu bu
  listeyi zaten "sayfa sayfa elle büyütülüyor, yeni bir dar kutu eklendiğinde
  yaslama sessizce geri geliyor" diye kusurlu buluyor. Gerçek çözüm
  `container-type` listesini genişletmek — ama `container-type:inline-size`
  `contain: layout inline-size` demek ve içindeki sticky/overflow davranışını
  etkileyebilir; üstelik o sarmalayıcılar beş ajanın açık dosyalarında.
- **`li`** — 199 blok, 20'si eşik altında; 200/201'i **tek satır** olduğu için
  nehir üretemiyor (en kötü 1.3×). Düşük öncelik.

## Sınamalar (ek 3 turu sonrası)
**10/10 · 0 sorun** — footer-yapi · footer-curtain · header-banner · crumb-home ·
kabuk-kalite · a11y-focus · plan-account · coach-list · dropdown-position ·
wizard-page.
**Banner ailesi:** 544/607/587 · 560/617/726 · `.lib-stats` 26/26 sağda dikey ·
CTA-H1 sapması 0 · **taşma 0 · konsol 0** (66 sayfa × 3 genişlik).

---

# EK 4 · AJAN-E İDDİAMI ÖLÇTÜ VE YARISINI ÇÜRÜTTÜ

AJAN-E, *"senin dar blokların artık mekanizma tarafından yakalanıyor"*
cümlemi varsayım olarak almadı, ölçtü. **Haklı çıktı ve ben yanılmıştım.**

## Doğrulama — ezmeyi geçici kaldırıp koştum, sonra geri aldım

| Kırılım | `.fp-card` genişliği | Ezme YOKKEN yaslı blok | Sonuç |
|---|---|---|---|
| **@390** | 358 px (eşiğin **altında**) | **0/8** | iddiam doğru — mekanizma yakalıyor |
| **@1440** | 577–1176 px (eşiğin **üstünde**) | **8/8** | **iddiam yanlış — yakalamıyor** |

Şiddet ölçüldü: en kötü **1.8×** (3.5 → 6.2 px); 8 bloğun 6'sı tek satır,
yani zaten nehir üretemiyor. §EK 3'te listeden çıkardığım 12.8× ve 19.2×
vakalarına göre hafif — ama gerçek.

## AJAN-E'nin yapısal tespiti — doğru ve önemli
Bu bölümün ölçütü **iki cümleli**: *"500–900px genişlikte **VE** YALNIZ
2–4 SATIR"*. Onardığım `--jt-min` eşiği yalnız **birinci** cümleyi
mekanikleştiriyor. **Satır sayısı CSS'te sorgulanamıyor**, dolayısıyla
"geniş kutudaki kısa blok" mekanik olarak çözülemiyor — ve istisna
listesindeki sınıfların ortak özelliği zaten genişlik değil **kısalık**
(`.lead` 520px · `.lib-sub` · `.wz-risk` · `.ft-lead`, hepsi eşiğin üstünde).

## AYNI ÖZGÜLLÜK TUZAĞINA ÜÇÜNCÜ KEZ DÜŞÜLDÜ — DOSYANIN SİSTEMİK KUSURU

`fpx` sınıflarını kabuğa aldım, **çalışmadı**: ölçüm @1440'ta hâlâ 8/8 yaslı
gösterdi. Sebep, EK 3'te teşhis ettiğim kusurun **birebir aynısıydı** ve bu
kez onu ben tekrarladım:

| # | İstisna | Özgüllük | Yenen yaslama kuralı | Özgüllük | Sonuç |
|---|---|---|---|---|---|
| 1 | `@container … p, li` | (0,0,1) | `.hub-body p` | (0,1,1) | sorgu yıllardır ölü |
| 2 | `.fpx-note` | (0,1,0) | `.fp-card p` | (0,1,1) | 8 blok yaslı kaldı |
| 3 | `.lead` | (0,1,0) | `.art-wrap p` | (0,1,1) | **16 blok yaslı kaldı** |

**3 numara ayrı bir bulgu:** EK 2'de `.lead`i istisnaya aldığımı ve
*"yaslı blok 0"* olduğunu raporlamıştım. Örneklediğim 6 sayfada 0'dı; ama
site genelinde **8 `hareket-*` sayfasında 16 `p.lead` bloğu** `.art-wrap`
içinde olduğu için hâlâ yaslıydı. EK 2'deki o satır eksikti.

**Kök kusur yapısal:** yaslama listesi descendant seçici kullanıyor
(`.art-wrap p` = 0,1,1), istisna listesi tek sınıf kullanıyor
(`.lead` = 0,1,0). İstisna her zaman ve **sessizce** kaybediyor — kaynak
kodda kural doğru görünüyor, yalnız computed style ölçülürse fark ediliyor.

Üçü de düzeltildi: istisnalar element+sınıf biçiminde yazıldı
(`p.lead` · `.fp-card p.fpx-note` = 0,1,1 / 0,2,1) ve kural dosyaya
yorumla işlendi: *"istisna, yaslama listesindeki en özgül karşılığına eşit
ya da üstün yazılmalı; yeni istisna eklerken computed style ile DOĞRULA."*

## Bu kez varsaymadım: tüm istisna listesini denetledim
Elle örneklemek yerine **istisna seçicilerini CSS'ten okuyan** bir denetim
yazdım (`@container`/`@media` gibi koşullu blokları ayıklıyor), 66 sayfada
her seçicinin computed değerini ölçtüm:

```
İSTİSNA LİSTESİ DENETİMİ — 72 seçici, 66 sayfa, @1440
✓ İHLAL YOK — istisna listesinin tamamı gerçekten uygulanıyor
```

## Önce / sonra (site geneli, @1440)

| Seçici | Yaslı blok | <480px |
|---|---|---|
| `.lead` | 16 → **0** | 0 → 0 |
| `.art-wrap p` | 83 → **67** | 0 → 0 (min 520 → **774**) |
| `.fp-card p` | 21 → **21** | 1 → 1 (dar `fpx` blokları ayrıca istisnada) |
| `fpx-note`/`-sm`/`-body` | 8 → **0** (her iki kırılımda) | — |

AJAN-E'nin sayfa içi ezmesi **7 sayfadan kaldırıldı**; iş artık tek kaynakta.

## Sınamalar
**10/10 · 0 sorun** — footer-yapi · footer-curtain · header-banner ·
crumb-home · kabuk-kalite · a11y-focus · plan-account · coach-list ·
dropdown-position · wizard-page. `page-check` 3/3 temiz (Fit Planım sayfaları).

## Lead'e giden liste güncellendi
Önceki iki kalem duruyor, **ikinci kalem AJAN-E'nin bulgusuyla netleşti:**
- **Genişlik tarafı:** çıplak `p` — 561 blok, %42'si eşiğin altında;
  `container-type` taşımayan sarmalayıcılarda.
- **Satır sayısı tarafı:** geniş kutudaki kısa bloklar **mekanik olarak
  çözülemez** (CSS satır sayamaz). Şimdiki yöntem sınıf bazlı istisna ve
  bu liste büyüdükçe kırılganlaşıyor. Yapısal çözüm, kısa blokların ortak
  bir işaret sınıfı taşıması (`.lead` · `.lib-sub` · `fpx-*` zaten fiilen
  bu deseni izliyor) — ya da yaslamayı varsayılan olmaktan çıkarıp
  **opt-in** yapmak. İkincisi 66 sayfayı ilgilendiren bir tercih; lead'in.

---

# EK 5 · KENDİ SİLME İŞLEMİM 7 SAYFADA HASAR BIRAKMIŞ

AJAN-E'nin ezmesini kaldırırken (EK 4) **regex tabanlı silme kullandım ve
öncesindeki seçiciyi sarkık bıraktım.** Kusur benim, AJAN-E buldu ve düzeltti.

## Ne oldu
Sayfadaki kural şuydu:
```css
.fpx-sum-sub,
.fp-body .fp-card p.fpx-note,
.fp-body .fp-card p.fpx-note-sm,
.fp-body .fp-card p.fpx-body{ text-align:left;text-align-last:auto; }
```
Regex'im **son üç seçiciyi ve gövdeyi** eşleştirip sildi; ilk satır
(`.fpx-sum-sub,`) gövdesiz kaldı ve CSS onu **bir sonraki kurala** bağladı:
```css
.fpx-sum-sub,
/* … yorumlar … */
.fpx-sec .fp-card>.lib-empty.show{padding:30px 20px 26px}
```
`.fpx-sum-sub` `.fp-card` içinde değil (üst özet kartının `<section>`ı), yani
kabuğa taşıdığım `.fp-card p.fpx-*` istisnası ona ulaşmıyor.

## Yan etki — 7 sayfanın 7'sinde, iki ayrı hasar (AJAN-E ölçtü)

| | Sarkan hâl | Düzeltilmiş |
|---|---|---|
| `text-align` | **justify** | left |
| kelime arası @390 | **40.4 px** (3.8 → **10.6×**) | 3.8 px |
| kelime arası @1440 | 8.5 px | 3.8 px |
| `padding` (boş durum kuralından bulaşan) | **30px 20px 26px** | 0px |
| blok yüksekliği | **104 px** | 48 px |

**40.4 px bu turun en şiddetli nehri** — EK 3'te kaldırdığım 43.3 px / 64.8 px
vakalarıyla aynı ligde. Yani düzelttiğim kusurun bir kopyasını, düzeltme
işlemi sırasında kendim ürettim.

## Neden benim doğrulamalarım kaçırdı
- Sınama süiti yeşildi: **hiçbir sınama `text-align` ya da `padding` ölçmüyor.**
- EK 4'teki 72 seçicilik computed denetimim de yakalayamazdı: `.fpx-sum-sub`
  **istisna listemde yok**, dolayısıyla taranmıyordu. Denetim yalnız
  "listedekiler tutuyor mu" diye soruyordu, "silme başka bir şeyi bozdu mu"
  diye değil.

## Bu turda yaptığım iki tarama

**1 · Sarkan seçici taraması — 68 dosya** (66 HTML `<style>` bloğu + iki CSS).
Yöntem: yorumları satır sayısını bozmadan boşluğa çevir, virgülle biten
seçici satırlarını bul, ardından gövdeye ulaşmadan araya yorum girip
girmediğine bak.
Sonuç: **1 işaret, o da yanlış pozitif** — `fit-type.css:297`'deki
`@supports` bloğunda seçici listesinin ortasındaki yorum önceki turlardan
kalma ve kasıtlı (`git diff`: 0 satır değişmemiş). **Benim bıraktığım başka
sarkan seçici yok.**

**2 · AJAN-E'nin bulgusunu genelleştiren sonda — "left sözünü tutuyor mu"**
Asıl ders şu: sorun sarkan seçici değil, *"CSS'te `text-align:left` yazan bir
kuralın computed'ının justify çıkması"*. Bunu doğrudan sınayan bir sonda
yazdım — kabuk CSS'inden **ve her sayfanın kendi `<style>` bloğundan**
`text-align:left` içeren seçicileri ayrıştırıyor (koşullu `@container` /
`@media` / `@supports` blokları ayıklanıyor), sonra 66 sayfada computed
değerini ölçüyor:

```
"text-align:left" SÖZÜNÜ TUTUYOR MU — 105 seçici (kabuk + sayfa içi), 66 sayfa, @1440
✓ İHLAL YOK — left yazan her seçici gerçekten left
```

Bu sonda üç kusur sınıfını birden yakalıyor: sarkan seçici · özgüllük kaybı ·
yanlış sıralama. EK 4'teki 72 seçicilik denetimin üstünü kapatıyor (o yalnız
kabuğun istisna listesini tarıyordu, bu sayfa içi kuralları da tarıyor).

## Doğrulama — `.fpx-sum-sub`, iki kırılım

| Kırılım | Blok | Yaslı | padding | En geniş kelime arası |
|---|---|---|---|---|
| @1440 | 7 | **0** | **0px** | **3.8 px** |
| @390 | 7 | **0** | **0px** | **3.8 px** |

## Sınır kararı
`.fpx-sum-sub` **kabuğa alınmadı** — AJAN-E'nin gerekçesi doğru: `.fp-card`
ailesinden değil ve `.fpx-sum` onun bileşeni. Kabuk `.fpx-note` ·
`.fpx-note-sm` · `.fpx-body`yi taşıyor (onlar `.fp-card p` ile çakıştığı için
kabukta çözülmeleri gerekiyordu), sayfa yalnız `.fpx-sum-sub`ı. Sınır temiz.

## Ders
Bu turda "kaynağa bakma, computed'ı ölç" dersini iki kez ben verdim
(`--jt-min` ölü token · `.lead` özgüllük kaybı), bir kez AJAN-E bana verdi
(EK 4), ve bu kez **kendi silme işlemim** aynı dersin üçüncü örneğini üretti.
Somut kural: **çok satırlı seçici listesinden regex'le kural silinmez** —
silinen bloğun önündeki ve sonrasındaki satır da okunur, ya da silme yerine
kuralın gövdesi boşaltılıp seçici korunur.
