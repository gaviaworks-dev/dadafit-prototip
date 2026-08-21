# AJAN-C · ANATOMİ — REVİZYON 6 RAPORU (maddeler 11 · 12 · 13 · 14 · 15)

**Dosyalar:** `anatomi-v1.html` · `tests/anatomi.mjs`
**`assets/js/anatomi-veri.js` DEĞİŞTİRİLMEDİ** — K38 sözleşmesi gereği `kaynak`
alanı 29/29 kayıtta duruyor, yalnız ekrana basılmıyor.
`fit-shell.css` · `fit-shell.js` · `assets/svg/govde-*.svg` **ellenmedi**.

**Taban görüntüleri:** `tasks/r6-shots/C/taban-1440.png` · `taban-390.png`
**Sunucu:** `http://localhost:8811` · **Ölçüm:** Playwright, vh 900 (@1440/@1024) ve 844 (@390)

---

## Madde 11 — "Anatomik veri kaynağı" satırı kalksın

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET.** Üç satır özet: (1) her seçim briefe
  özgü olmalı, şablon refleksi (krem zemin + serif + terracotta / siyah zemin +
  asit yeşili) reddedilir; (2) cesaret tek yere harcanır, kalan her şey sessiz
  tutulur, "aynadan çıkmadan bir aksesuar çıkar"; (3) yapısal işaretler
  (numara, ayraç, ray) içerikte gerçekten varsa kullanılır, süs olarak değil.
- **Yapılan değişiklik:**
  - `anatomi-v1.html` — `panelBas()` içindeki `<p class="an-kaynak">…</p>`
    üretimi kaldırıldı (eski satır 445).
  - `.an-kaynak` / `.an-kaynak i` CSS kuralları silindi (eski satır 120–121).
  - Yerine JS'e yorum yazıldı: künye ekranda değil, izlenebilirlik **veride**.
- **Ekran görüntüsü:** `tasks/r6-shots/C/m11-15-g1-1440.png` · `m11-15-g1-390.png`

### Geçiş 2 · Kendi işini eleştir
Bu madde tek satırlık bir silme; kusurlar madde 12/14'ün ortak geçiş 2'sinde
listelendi (aşağıda). Bu maddeye düşen tek bulgu: satır kalkınca güvenlik
bölümünün alt boşluğu (`.an-sec:last-child{padding-bottom:4px}`) tek başına
kaldı ve blok panelin alt kenarına yapıştı — panel gövdesinin alt dolgusu
(`.an-panel-body{padding:6px 26px 24px}`) bunu zaten karşılıyor, ölçüldü:
güvenlik bloğu alt kenarı → panel alt kenarı **25 px**; panel içi bölümlerin
kendi dikey nefesi 19 px + 19 px. Kabul edilebilir, değişiklik yapılmadı.
- **Ekran görüntüsü:** `m11-15-g2-1440.png` · `m11-15-g2-390.png`

### Geçiş 3 · Referansla karşılaştır
- Referans: `dadagastro.com/tarif/visneli-islak-kek-turk-usulu-serbetli-parti-keki`
  (`ref-tarif-1440.png`). Referansın yapışkan bilgi panelinde **kaynak künyesi
  yok**; künye satırı sayfanın alt bandına ya da yazar kartına düşüyor.
  DadaFit'te künye zaten veride; ekranda karşılığı olmaması referansla uyumlu.
- **Ekran görüntüsü:** `m11-15-g3-1440.png` · `m11-15-g3-390.png`

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| `.an-kaynak` DOM | 0 | 0 (@1440 · @1024 · @390) | ✅ |
| `.an-kaynak` CSS kuralı | temizlendi | `grep an-kaynak anatomi-v1.html` → 0 satır | ✅ |
| `anatomi-veri.js` `kaynak:` | 29/29 | 29 (`grep -c "kaynak: '"` = 29; test de nöbette) | ✅ |
| `tests/anatomi.mjs` | yeşil | **0 sorun** | ✅ |

---

## Madde 12 — Sarı "Sık yapılan hata / güvenlik notu" kartı değişecek

### Geçiş 1 · Kur
- **Ölçülen ÖNCE:** `.an-uyari` zemin `rgb(255,246,236)` (#fff6ec) · kenar
  `#f0d9bd` · ikon `#c97a19` · metin `#6b4a1c` 13.5 px. **Dördü de token dışı
  literal**; sayfanın yeşil-nötr paletinde karşılığı yok.
- **Yapılan değişiklik (`anatomi-v1.html`, sayfa içi `<style>`):**
  kutu tamamen kaldırıldı. Metin panelin kendi tipografik ritmine sokuldu
  (`14.5px / 1.72 / var(--slate-2)` — "Ne yapar" paragrafıyla **aynı** ölçek),
  tek ayırt edici işaret **sol kenardaki 2 px `var(--fit)` rayı**.
  `.an-uyari{border-left:2px solid var(--fit);padding-left:16px}`.
  İkon da kaldırıldı: bölüm başlığı (`h3`) zaten
  `fa-triangle-exclamation` taşıyordu, ikinci ikon yineleme oluyordu.
- **Neden bu sunum:** panelde başka sol ray yok. Ray, "bu bölüm bilgi değil,
  öğüt" ayrımını tek bir çizgiyle kodluyor — süs değil, yapısal işaret
  (frontend-design: "structure is information"). K12 gereği blok **yaslanmadı**
  (`text-align` ölçüldü: `left`).
- **Ekran görüntüsü:** `m11-15-g1-1440.png` · `m11-15-g1-390.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — panelde üç yumuşak zemin üst üste bindi.** Künye zemini
  `linear-gradient(--fit-tint→transparent)`, hemen altındaki hareket bandı
  `--bg`, sonra beyaz gövde. İki yumuşak alan yan yana düşünce sınır bulandı.
  → **Künyenin gradyanı kaldırıldı**; panelde tek renkli alan hareket bandı
  kaldı. Önce/sonra kanıtı: `panel-tintli.png` ↔ `panel-tintsiz.png` (2× ölçek).
- **Kusur 2 — kontrast.** Yeni metin rengi ölçüldü: `rgb(86,81,74)` (#56514a)
  beyaz üstünde **7.75:1** (önce #6b4a1c/#fff6ec ≈ 8.0:1 idi; kayıp yok, AA
  fazlasıyla karşılanıyor).
- **Kusur 3 — metin ölçeği.** Eski kutu 13.5 px'ti, panelin geri kalanı
  14.5 px. Kutu kalkınca 13.5 px "yabancı" kalıyordu → **14.5 px / 1.72**,
  panelin akan metniyle birebir.
- **Ekran görüntüsü:** `m11-15-g2-1440.png` · `m11-15-g2b-1440.png`

### Geçiş 3 · Referansla karşılaştır
| Ölçüt | dadagastro.com (tarif detay) | anatomi-v1 (sonra) |
|---|---|---|
| Uyarı bloğu dili | **sarı/kehribar kutu** (`Hatırlatma`) + kırmızı kutu (`Editör Notu`) | sol ray + panel tipografisi |
| Kutu yarıçapı | 12 px | — (kutu yok) |
| Metin hizası | sola yaslı | sola yaslı ✅ |

**Ayrışma bilinçli ve raporlanıyor:** kardeş marka bu blokta **sarı kutu
kullanıyor**. Madde 12 açıkça sarıyı kaldırmayı istiyor ve DadaFit paletinde
sarının tek meşru kullanımı `--yellow` (yalnız puan). Referansın rengi değil
**yapısı** alındı: referans uyarıyı akan metinden ayırıyor, biz de ayırıyoruz —
kutu yerine rayla. Geri almak istenirse: `.an-uyari` kuralına
`background:var(--fit-tint);border:1px solid var(--fit-line);border-radius:var(--radius-md);padding:15px 17px`
yazmak yeterli (site token'larıyla, sarısız).
- **Ekran görüntüsü:** `m11-15-g3-1440.png` · `m11-15-g3-390.png`

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| Sarı zemin bu blokta | 0 | `background-color: rgba(0,0,0,0)` (@1440/@1024/@390) | ✅ |
| Sarı/kehribar literal | 0 | `grep -niE "fff6ec\|f0d9bd\|c97a19\|6b4a1c\|--warn\|--yellow"` → yalnız yorum satırları | ✅ |
| Site token'ı kullanıldı | evet | `border-left:2px solid var(--fit)` → `rgb(0,157,79)`; metin `var(--slate-2)` | ✅ |
| Yeni renk uydurulmadı | evet | sayfada token dışı renk literali kalmadı (bkz. Madde 13 tablosu) | ✅ |
| Metin kaybolmadı | evet | `k.guvenlik` 29/29 basılıyor; `tests/anatomi.mjs` "güvenlik alanı dolu" nöbeti yeşil | ✅ |
| Kontrast | ≥ 4.5:1 | **7.75:1** (#56514a / #fff) | ✅ |
| Yaslanmadı (K12) | left | `text-align: left` | ✅ |

---

## Madde 13 — Sağ karttaki alt çiftlerin radius'u sertleşecek

### Geçiş 1 · Kur
- **Ölçülen ÖNCE:** `.an-chip` → `border-radius: 999px` (tam hap), yükseklik
  36 px. K24'ün tarif ettiği durumun aynısı: 36 px'lik kutuda hap görünümü.
- **Yapılan değişiklik:** `border-radius:999px` → `border-radius:var(--radius-chip)`.
  **Elle sayı yazılmadı.** `--radius-chip` = `--radius-md` = **12 px** (K24).
  Ayrıca `.an-hint kbd` içindeki ölçek dışı `border-radius:5px` literali
  `var(--radius-badge)` (6 px) yapıldı.

### Geçiş 2 · Kendi işini eleştir
- **Kusur — sayfada kaç farklı yarıçap var, hepsi token mu?** Sayıldı:

| Değer | Kaç kural | Kaynak |
|---|---|---|
| `var(--radius-lg)` (16) | 3 | `.an-map` · `.an-panel` · `.an-card` |
| `var(--radius-md)` (12) | 3 | `.an-seg` · `.an-stage` · `.an-card-ico` |
| `var(--radius-chip)` (12) | 1 | `.an-chip` |
| `var(--radius-badge)` (6) | 1 | `.an-hint kbd` |
| `calc(var(--radius-md) - 3px)` | 1 | `.an-seg button` (ray içi düğme, token türevi) |

  **Sayfada ham piksel yarıçap literali 0.** (Taban: 2 literal — 999 px ve 5 px.)
- Kartlar `--radius-lg` (16) bırakıldı: K24 kart ailesini 16 px olarak
  kayda geçirdi, çip 12'ye çekildi. İç içe geçme sorunu yok — panelin iç
  dolgusu 26 px, iç kartın 16 px yarıçapını yutuyor.

### Geçiş 3 · Referansla karşılaştır
Referans sayfada (tarif detay) 40 px'ten geniş öğelerin yarıçap dağılımı
**ölçüldü**: `12px` → 87 kural · `8px` → 34 · `16px` → 22 · `999px` → 6 ·
`24px` → 1. Yani baskın değer **12 px**, hap yalnız 6 mikro rozette.
Anatomi sayfası şimdi tam bu dağılıma oturuyor: çip 12, kart 16, hap 0.

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen ÖNCE | Ölçülen SONRA | ✅/❌ |
|---|---|---|---|---|
| Çip yarıçapı | site token'ı | `999px` | `12px` (`var(--radius-chip)`) | ✅ |
| Sayfada tek değer (çip ailesi) | evet | 999px tek ama ölçek dışı | 12 px, üç kolun (komşu · ekipman) hepsi aynı | ✅ |
| Ham piksel literali | 0 | 2 (999px · 5px) | **0** | ✅ |

---

## Madde 14 — Kas seçilince "Kütüphaneden" değişimi GÖRÜNMÜYOR

### Geçiş 1 · Kur
- **Ölçülen ÖNCE (@1440, vh 900):** `#anCardsSec` sayfa tepesinden **1619 px**
  aşağıda başlıyordu; panel 594–1624 arasındaydı. Seçimden sonra kullanıcının
  gördüğü hiçbir yerde liste yoktu. **@390'da 3027 px.**
  Üstelik **aynı liste sayfada iki kez** basılıyordu: panelde
  `data-alan="hareketler"` çip listesi + altta `#anCards` kart ızgarası.
- **Yapılan değişiklik (`anatomi-v1.html`):**
  1. `#anCardsSec` section'ı **tamamen kaldırıldı** (eski satır 205–214).
     `kartBas()` fonksiyonu, `anCards` / `anCardsTitle` / `anCardsLead`
     kimlikleri ve `.an-sec-head` CSS ailesi silindi.
  2. Panele **hareket bandı** eklendi — künyenin (`.an-panel-head`) hemen
     altında, panel gövdesinden **önce**:
     `.an-hrk.an-sec[data-alan="hareketler"]` → başlık + sayfa içi
     "Tüm hareketler →" bağlantısı + `.an-cards` kart ızgarası.
     Panel gövdesindeki eski çip listesi kaldırıldı → **liste tek yerde**.
  3. `#anPanel`'den `aria-live="polite"` **kaldırıldı**: panelin tamamı canlı
     bölge olduğunda kas değişiminde ekran okuyucu bütün künyeyi baştan
     okuyordu. Bildirim tek yerden, `#anLive` (`role="status"`) üzerinden
     veriliyor ve artık **hareket sayısını da** söylüyor:
     *"Üst Trapez (Kukuleta kası, üst lif) seçildi. Ön görünüm. 3 hareket listelendi."*
  4. Dürüst boş durum yazıldı (`.an-bos`): veride hareket olmayan kas çıkarsa
     uydurma kart basılmaz. (Bugün 29/29 kasın hepsinde ≥2 hareket var.)
- **DOM sırası neden değişmedi:** hareket bandı hem masaüstünde hem mobilde
  aynı yerde. `order` numarasıyla görsel sıra oynanmadı → ekran okuyucu sırası
  = görsel sıra.
- **Ekran görüntüsü:** `m11-15-g1-1440.png` · `m11-15-g1-390.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — @390 band, seçimden sonra yalnız 52 px görünüyordu** (hrkTop 792,
  vh 844): kullanıcı yalnızca bölüm başlığının üst kenarını görüyordu, tek bir
  kart görünmüyordu. Kök neden: harita kartı @390'da **907 px** — viewport'tan
  (844) daha uzun.
  → Harita çizimi mobilde sınırlandı, künye sıkıştırıldı, ipucu tek satıra
  indirildi. **hrkTop 792 → 730 → 625 px.**
- **Kusur 2 — @1440 kart ızgarasında yetim boş kolon.** `auto-fill,minmax(212px,1fr)`
  692 px'lik bantta **3 track** açıyordu; verideki dağılım 2 hareket (11 kas) ·
  3 (16 kas) · 4 (2 kas). İki kartta üçüncü track boş kalıyordu.
  → Kolon sayısı **kart sayısından türetildi** (`.an-cards[data-n]`):
  n=2 → 2 kolon (339 px) · n=3 → 3 kolon (222 px) · n=4 → 2×2. **Yetim track 0.**
  Kanıt: `m14-3kart-band-1440.png` · `m14-4kart-1440.png`.
- **Kusur 3 — sol kolonda eksen kayması.** Kontrol rayı kartın tam genişliğinde,
  altındaki plaka 268 px ortalanmış → iki farklı eksen.
  → `.an-switches{justify-content:center}`; kolonun tek merkez ekseni oldu.
- **Kusur 4 — dokunma hedefi.** "Tüm hareketler" bağlantısı **24 px**
  yüksekliğindeydi. → @390'da **44 px**. Ayrıca çipler ve Ön/Arka·Erkek/Kadın
  düğmeleri **36 px** ölçüldü → @390'da **44 px** (harita bölgeleri mobilde
  küçüldüğü için komşu-kas çipleri gezinmenin asıl yolu).
- **Kusur 5 — mobilde anlamsız talimat.** İpucu metni dokunmatikte
  `Tab`/`Enter`/ok tuşlarını anlatıyordu → @390'da *"Gövdede bir bölgeye dokun."*
- **Kusur 6 — plaka letterbox.** Çizim `viewBox 0 0 400 900`; 420 px'lik kolonda
  sahne 374 px genişti ama yükseklik sınırı çizimi 248 px'te tutuyordu →
  **her iki yanda ~63 px boş gradyan**. Ayrıca gradyan (`#f7f8f7→#eef1ef`)
  token dışı iki literaldi. → Sahne `width:fit-content` ile çizime çekildi,
  zemin `var(--bg)` oldu.
- **Ekran görüntüsü:** `m11-15-g2-1440.png` / `-390.png` · `m11-15-g2b-1440.png` / `-390.png`

### Geçiş 3 · Referansla karşılaştır
**Referans:** `dadagastro.com/tarif/visneli-islak-kek-turk-usulu-serbetli-parti-keki`
(`ref-tarif-1440.png` · `ref-tarif-1440-scroll.png`) — brief'in tarif ettiği
"bir yanda görsel, öbür yanda yapışkan bilgi paneli" deseninin kardeş
markadaki karşılığı.

| Ölçüt | Referans (`.rd-cols`) | anatomi-v1 ÖNCE | anatomi-v1 SONRA |
|---|---|---|---|
| Izgara | `744px 384px` | `420px 1fr` | `384px 1fr` → **384 / 744** |
| Kolon arası boşluk | **48 px** | 30 px | **48 px** |
| Toplam genişlik | 1176 px | 1176 px | **1176 px** |
| `align-items` | `start` | `start` | `start` ✅ |
| Yapışkan öğe | `.ing-panel`, `top:132px`, 384 px | `.an-map`, `top:104px`, 420 px | `.an-map`, **`top:133px`**, 384 px |
| Bölüm dikey nefesi | 74 px (`--sec-pad` karşılığı) | 50 px | 50 px (site token'ı, değiştirilmedi) |
| Kart yarıçapı dağılımı | 12 baskın · 16 · 8 | 999 (çip) · 16 | 12 (çip) · 16 (kart) |

**Referanstan zayıf kalan noktalar → nasıl kapatıldı:**
1. **Kolon arası boşluk 30 px'ti (referans 48).** İki kart birbirine yapışık
   duruyordu → **48 px**, ızgara referansla birebir 384/48/744 = 1176.
2. **Yapışma payı yanlıştı.** Sabit başlığın alt kenarı **113 px** ölçüldü;
   `top:104px` yapışan kartın üst **9 px'ini başlığın altına sokuyordu**
   (referansta pay 132 px). → **`top:133px`**. Kanıt: `m14-sticky-1440-viewport.png`.
3. **Kart başlık ölçeği referansın altındaydı** (14.5 px; referansta değer
   satırları 17 px kalın). → **15.5 px**, kart dolgusu 15/16 → **16/18**.
4. **Band başlığında çift boşluk.** `h3` flex kapsayıcıydı; `<i>` ile metin
   arasındaki 9 px `gap`, metin ile `<span>` arasında **ikinci kez** uygulanıyordu.
   → etiket tek `<span>` içine alındı.
5. **İpucu satırı ortalanmıyordu.** `fit-type.css`'teki
   `p{text-align-last:start}` iki satırlık ortalanmış ipucunun **son satırını
   sola kaçırıyordu**. → `.an-hint{text-align-last:center}`.
- **Ekran görüntüsü:** `m11-15-g3-1440.png` · `m11-15-g3-390.png` ·
  `m14-secim-1440-viewport.png` · `m14-secim-390-viewport.png`

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| @1440 seçim sonrası liste viewport içinde | `top < innerHeight` | ızgara ekrana getirilir, bölgeye **gerçek fare tıklaması**, ek kaydırma **yok** → `band.top = 240` < `innerHeight 900` | ✅ |
| @390 seçim sonrası liste viewport içinde | `top < innerHeight` | `band.top = 625` < `innerHeight 844` | ✅ |
| @390 sabit alt gezinme çubuğunun ÜSTÜNDE | ek nöbet (kendi eklediğim, briefte yok) | `.bottom-nav` `top = 766`; `band.top = 625` → **141 px üstünde** | ✅ |
| Sayfa kendiliğinden kaymadı | `scrollY` sabit | @1440 ve @390'da `scrollY` değişmedi | ✅ |
| İçerik gerçekten değişti | evet | band metni seçimden önce/sonra farklı (testte karşılaştırılıyor) | ✅ |
| 29/29 kasta liste dolu | evet | `tests/anatomi.mjs` → "panel 29/29 kasta dolu — sekiz alanın hepsi + panel içi hareket bandı" | ✅ |
| Boş kas varsa dürüst boş durum | var | `.an-bos` yazıldı; bugün 29/29 kasta ≥2 hareket olduğu için ekranda görünmüyor | ✅ (kod var, veri tetiklemiyor) |
| `aria-live` bildirimi | çalışıyor | `#anLive` `role="status"`; metin *"… seçildi. Ön görünüm. 3 hareket listelendi."*; test regex ile nöbette | ✅ |
| Aynı liste iki kez basılmıyor | evet | `.an-card` toplam = bant içi (`4 = 4`, `3 = 3`, `2 = 2`); test her 29 kasta karşılaştırıyor | ✅ |
| `tests/anatomi.mjs` | yeşil | **0 sorun** | ✅ |
| 58/58 bölge tıklaması | çalışıyor | "58 bölgenin 58'i gerçek fare tıklamasıyla seçildi (4 SVG)" | ✅ |
| @390 harita panelin üstünde | evet | harita alt kenarı 1104 ≤ panel üst kenarı 1122 | ✅ |

---

## Madde 15 — "Kütüphaneden" sonrası sağlık notu dikeyde simetrik değil

### Geçiş 1 · Kur
- **Ölçülen ÖNCE (@1440):** not kendi section'ındaydı
  (`<section class="sec sec-fit" style="padding-top:0">`). `.hr-note` o
  section'ın `:first-child`'ı olduğu için kabuğun
  `.sec>.wrap>.hr-note:first-child{margin-top:0}` kuralı devreye giriyordu.
  Sonuç: **üstünde 1 px** (bir önceki section'ın alt kenarı 2028, notun üst
  kenarı 2029), **altında 50 px** (section'ın kendi `padding-bottom`'ı).
  **Fark 49 px** — brief'in "dikeyde dengesiz" dediği şey tam bu.
- **Seçilen çözüm: (a) yukarı yaslanır ve section dolgusu düzeltilir** —
  ama section'ı düzeltmek yerine **section tamamen kaldırıldı**, not
  haritanın section'ının içine, `.an-grid`'in hemen ardına alındı.
  Üst boşluk `margin-top:var(--sec-pad)` ile section'ın **kendi alt
  dolgusuna** bağlandı → değer kırılım noktalarında birlikte değişiyor
  (50 / 42 / 34), elle sayı yok.
- **(b) kart içine taşıma neden seçilmedi:** not **sayfa düzeyinde** bir
  yasal/sağlık uyarısı, seçili kasa ait değil. Kas panelinin içine konsaydı
  her kas değişiminde yeniden okunan, kasla ilgiliymiş gibi duran bir metin
  olurdu. Gerekçe koda yorum olarak da yazıldı.
- **Not:** Bu madde **sayfanın kendi `.hr-note`'u** içindir. Kabuğun ürettiği
  `.fit-health` bloğu AJAN-A tarafından kaldırıldı; ölçüldü: `.fit-health` DOM'da
  **0 düğüm** (@1440/@1024/@390). İkisi karıştırılmadı.
- **Ekran görüntüsü:** `m11-15-g1-1440.png` · `m11-15-g1-390.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — notu sol kolona (harita kartının altına) koymayı denedim, vazgeçtim.**
  @1440'ta sol kolonun boşluğunu doldururdu ama @390'da tek kolonda **harita ile
  panel arasına** girip hareket bandını ~200 px aşağı iter, madde 14'ün kabul
  ölçütünü kırardı. Ölçülüp elendi; not `.an-grid`'in **kardeşi** yapıldı.
- **Kusur 2 — bir section eksildi, dikey ritim boşaldı mı?** Ölçüldü: taban
  `docH` @1440 = 3077 px, sonra = 2421 px. Kısalma iki section'ın (`#anCardsSec`
  409 px + not section'ının fazla dolgusu) kalkmasından; kalan ritim tek değerde
  (`--sec-pad` 50/42/34), ara boşluk kalmadı.
- **Kusur 3 — @390'da notun genişliği.** `.wrap` içinde olduğu için 358 px,
  taşma 0. Metin yaslanmıyor (`text-align:left`, K12) — ölçüldü.
- **Ekran görüntüsü:** `m11-15-g2-1440.png` · `m11-15-g2b-390.png`

### Geçiş 3 · Referansla karşılaştır
Referansta (tarif detay) sayfa altı uyarı/not blokları da **kendi section'ları
değil**, içerik kolonunun son öğeleri (`Hatırlatma` · `Editör Notu` kartları,
adım listesinin hemen ardından). Yani not içeriğe bağlı, yalnız başına bir
bölüm değil. Anatomi sayfasında da not artık haritanın/panelin bulunduğu
section'ın son öğesi — desen aynı.
- **Ekran görüntüsü:** `m11-15-g3-1440.png` · `m11-15-g3-390.png`

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen ÖNCE | Ölçülen SONRA | ✅/❌ |
|---|---|---|---|---|
| Üst/alt boşluk farkı @1440 | ≤ 2 px | üst 1 · alt 50 → **49** | üst **50** · alt **50** → **0** | ✅ |
| Üst/alt boşluk farkı @1024 | ≤ 2 px | — | 42 / 42 → **0** | ✅ |
| Üst/alt boşluk farkı @390 | ≤ 2 px | — | 34 / 34 → **0** | ✅ |
| Uyarı metni duruyor | evet | 296 karakter | 296 karakter (test ≥100 karakter nöbeti koyuyor) | ✅ |
| `saglik-bilgilendirme-v1.html` bağlantısı | ≥ 1 | 1 | 1 (test `a[href="saglik-bilgilendirme-v1.html"]` arıyor) | ✅ |
| @390 taşma | 0 | 0 | 0 | ✅ |

---

## Verilen kararlar (gerekçe + nasıl geri alınır)

1. **Hareket listesi panelin künyesinin hemen altına kondu, alt section silindi.**
   *Gerekçe:* brief'in tercih ettiği çözüm; ayrıca liste zaten sayfada iki kez
   basılıyordu (panelde çip, altta kart) — tekilleştirmek şarttı. Künyenin
   **altına** kondu çünkü sayfanın H1 alt metni "hangi hareketlerin onu
   çalıştırdığını oku" diyor: kullanıcının aradığı cevap bu. Ayrıca ansiklopedik
   metinden önce gelmesi, @390'da bandın alt gezinme çubuğunun üstünde
   kalmasının **tek yolu**.
   *Geri alma:* `panelBas()` içindeki `.an-hrk` bloğunu kaldır, eski
   `data-alan="hareketler"` çip bölümünü panel gövdesine geri koy, `#anCardsSec`
   section'ını ve `kartBas()` fonksiyonunu geri yaz (git geçmişi: `8bf5c66`).

2. **`.an-cards` kolon sayısı kart sayısından türetiliyor (`data-n`).**
   *Gerekçe:* veride kas başına en fazla 4 hareket var; `auto-fill` boş track
   bırakıyordu. *Geri alma:* `.an-cards` kuralını
   `grid-template-columns:repeat(auto-fill,minmax(212px,1fr))` yap, `data-n`
   kurallarını sil, JS'teki `data-n` özniteliğini kaldır.

3. **`#anPanel`'den `aria-live` kaldırıldı, bildirim `#anLive`'a bırakıldı.**
   *Gerekçe:* panelin tamamı canlı bölgeyken her kas değişiminde ~1500 karakterlik
   künye baştan okunuyordu. *Geri alma:* `<article class="an-panel" id="anPanel">`
   etiketine `aria-live="polite"` geri eklenir.

4. **`.hr-note` kendi section'ından çıkarılıp ızgaranın section'ına alındı.**
   *Gerekçe:* §Madde 15. *Geri alma:* `.an-note` div'ini `</section>`'dan sonra
   ayrı bir `<section class="sec sec-fit" style="background:var(--bg-white);padding-top:0">`
   içine geri taşı, `.an-note{margin-top:var(--sec-pad)}` kuralını sil.

5. **Izgara 384/48/744'e, yapışma payı 133 px'e çekildi.**
   *Gerekçe:* referanstan **ölçüldü** (`.rd-cols` 744+48+384, `top:132px`);
   eski 104 px yapışan kartı sabit başlığın (alt kenar 113 px) altına sokuyordu.
   *Geri alma:* `.an-grid` kolon/gap değerlerini ve `.an-map{top:}` değerini
   eski haline döndür.

6. **@390'da harita çizimi 40vh'e indirildi, panel künyesindeki bölge etiketi
   (`.an-eyebrow`) gizlendi.**
   *Gerekçe:* madde 14'ün kabul ölçütü. Ölçülen bedel: en küçük bölge
   (`boyun`) @390'da 43×34 px'ten **~22×17 px**'e indi. Bunu telafi etmek için
   çipler ve geçiş düğmeleri 36 → 44 px yapıldı; komşu-kas çipleri mobilde
   gezinmenin asıl yolu. *Geri alma:* `@media (max-width:900px)` bloğundaki
   `.an-harita{height:min(40vh,360px)}` ve `.an-eyebrow{display:none}`
   satırlarını kaldır — ama o zaman @390'da band `hrkTop ≈ 792` olur ve
   kabul ölçütü kırılır.

7. **Panel künyesinin `--fit-tint` gradyanı kaldırıldı.**
   *Gerekçe:* hareket bandının `--bg` zemini künyenin hemen altına gelince iki
   yumuşak alan bulanıyordu; panelde tek renkli alan bırakıldı.
   *Geri alma:* `.an-panel-head` kuralına
   `background:linear-gradient(180deg,var(--fit-tint),transparent)` ekle
   (yorum olarak koda da yazıldı).

8. **`tests/anatomi.mjs` güncellendi — zayıflatılmadı, güçlendirildi.**
   Değişen: kart sayacı `#anCards .an-card` → `.an-sec[data-alan="hareketler"] .an-card`.
   **Eklenen dört nöbet:**
   - `.an-card` toplam sayısı = bant içi sayı → **liste sayfada iki kez basılamaz**
   - `.an-kaynak` DOM'da 0 (29 kasın hepsinde ölçülüyor)
   - `anatomi-veri.js` `kaynak` alanı 29/29 (K38 sözleşmesi)
   - **M14 görünürlük nöbeti** (@1440 ve @390): ızgara ekrana getirilir, seçili
     olmayan bir bölgeye `isPointInFill` + `elementFromPoint` ile doğrulanmış
     noktadan gerçek fare tıklaması yapılır, sonra `scrollY` değişmemiş olmalı,
     band metni değişmiş olmalı, `band.top < innerHeight` **ve** sabit alt
     çubuğun üstünde olmalı, `#anLive` metni doğru biçimde olmalı
   - **M15 nöbeti:** `.hr-note` var, `saglik-bilgilendirme-v1.html` bağlantısı
     var, metin ≥100 karakter, üst/alt boşluk farkı ≤2 px
   *Taban commit'te (`8bf5c66`) kırmızı mı:* Evet — o sürümde
   `.an-sec[data-alan="hareketler"]` içinde `.an-card` yok (çip vardı) ve
   `.an-kaynak` her kasta 1 düğümdü; iki nöbet de kırmızıya döner. Bunu
   **kod okuyarak** doğruladım, taban commit'i checkout etmedim — aynı worktree'de
   başka ajanlar çalışıyor, ağacı oynatmadım.

---

## Kabukta gördüğüm ama DOKUNMADIĞIM eksikler (AJAN-A'ya)

1. **`--muted` (#7E7E7E) beyaz üstünde 4.07:1 — AA altında.** Normal metin için
   4.5:1 gerekiyor. Bu sayfada `.an-card-meta` (12 px), `.an-hint` (12 px),
   `.an-sec > h3` (11.5 px) bu token'ı kullanıyor; site genelinde `.lib-sub`,
   `.sec-head .lead` ve onlarca yerde. Token düzeyinde bir karar; sayfa
   içinde çözersem 60 sayfayla ayrışırım, o yüzden **dokunmadım**.
   Öneri: `--muted`'ı ~#6E6E6E'ye (4.83:1) çekmek 12 px metinleri AA'ya taşır.

2. **Yapışma payı için kabukta token yok.** Sabit başlığın alt kenarı ölçüldü:
   **113 px @1440 · 63 px @390**. Her sayfa `position:sticky; top:<sayı>` elle
   yazıyor; bu sayfada 104 px yazılıydı ve kartın üst 9 px'i başlığın altına
   giriyordu. Bir `--fit-sticky-top` token'ı (başlık yüksekliği + nefes) bu
   hatayı sistemik olarak kapatır.

3. **`.bottom-nav` @390'da `top:766` — viewport'un son 78 px'ini kapatıyor,
   `main`'de karşılığı yok.** "Kaydırmadan görünür" türü her ölçütte
   `innerHeight` yanıltıcı; gerçek sınır 766. Kabukta `main{padding-bottom}`
   ya da `scroll-padding-bottom` yok. Kendi sınamama ikinci eşiği ben ekledim
   ama bu sayfaya özel bir yama.

4. **`.hr-note` kural çifti madde 15'in kusurunu üretiyor.**
   `.hr-note{margin-top:34px}` + `.sec>.wrap>.hr-note:first-child{margin-top:0}`
   birleşince, `padding-top:0` taşıyan bir section'ın tek çocuğu olan not
   **üstünde 0 px** boşlukla kalıyor. Aynı deseni kullanan başka sayfalar varsa
   aynı dengesizlik oradadır.

5. **`href="#"` sayısı bu sayfada 8** (`tools/page-check.mjs` uyarısı).
   Sayfa markup'ında `href="#"` **0** — sekizinin tamamı kabuğun ürettiği
   markup'tan geliyor.

---

## Bozulmadığını kanıtladıklarım

| Ne | Ölçüm |
|---|---|
| **Banner ailesi (LİSTE)** | @1440 **544** · @1024 **607** · @390 **587** — taban değerleriyle birebir; `tests/anatomi.mjs` üç kırılımda da nöbette |
| **`data-fit-hero-kind`** | `liste` (değişmedi) |
| **R11 footer perdesi** | `tests/footer-yapi.mjs` → **0 sorun**, "R11 perdesi 0 · .fit-health 0 düğüm"; `main.margin-bottom` @1440 = **579.531px** = footer yüksekliği |
| **`tests/anatomi.mjs`** | **✓ 0 sorun** (32 kontrol) — 27 kanonik slug, 58/58 bölge tıklaması, panel 29/29, `?kas=` 29/29, klavye (Tab/Enter/ok tuşları), @390 harita panelin üstünde, konsol 0, menü kalemi |
| **`tools/page-check.mjs anatomi-v1.html 1440` ve `390`** | → **temiz** (konsol 0, 4xx 0, yatay taşma 0, 132 iç bağlantı sağlam, marka dili temiz) |
| **`assets/js/anatomi-veri.js`** | **hiç değiştirilmedi** — `git diff --stat` bu dosyayı listelemiyor; `kaynak:` 29/29 |
| **`assets/svg/govde-*.svg`** | **hiç değiştirilmedi** (madde 21'in konusu) |
| **`fit-shell.css` · `fit-shell.js`** | **hiç değiştirilmedi** (AJAN-A'nın alanı) |
| **Konsol hatası** | @1440 · @1024 · @390 → **0** |
| **Yatay taşma** | @1440 · @1024 · @390 → **0** |
| **Dokunma hedefi @390** | çip **44 px** · Ön/Arka·Erkek/Kadın **44 px** · "Tüm hareketler" **44 px** (hepsi taban 36/36/24 idi) |
