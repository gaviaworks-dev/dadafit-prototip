# AJAN-B · SÖZLÜK — REVİZYON 6 RAPORU (madde 8 · 9 · 10)

**Dosyalar:** `sozluk-v1.html` · `tests/sozluk.mjs` · `tests/sozluk-kapalilik.mjs`
`sozluk-detay-v1.html` ve `assets/js/sozluk-veri.js` **değişmedi** (gerekmedi — gerekçe §"Verilen kararlar").
**Kabuğa tek satır yazılmadı.** `assets/css/fit-shell.css` ve `assets/js/fit-shell.js` dokunulmadı.
**Commit atılmadı.**

**Ölçüm ortamı:** `http://localhost:8811`, Playwright/Chromium, `PW_HOME=~/.pw`.
**Referans:** `https://dadagastro.com/mutfak-sozlugu` — 8. oturumda **canlıdan yeniden ölçüldü**,
ana oturumun iddiaları kullanılmadı.

> **Brief'teki iki sayı düzeltilmeli (ölçüldü, uydurulmadı):** brief "232 terim" diyor,
> `sozluk-veri.js`'te **254 terim** var (K42 22 terim ekledi, 232 → 254). "29 harflik ray"
> doğru — ray **29 düğme**, bunların **28'inde terim var**, **Ğ boş + `disabled`**.
> Banner şeridi de bunu yazıyor: *254 terim · A–Z 28 harflik dizin · 10 kategori*.

---

## REFERANSTAN ÖLÇÜLEN YAPI (üç maddenin de dayanağı)

`dadagastro.com/mutfak-sozlugu` @1440, `.wrap` içerik genişliği 1176:

| Blok | Sınıf | Konum · ölçü |
|---|---|---|
| süzgeç bandı | `section.sz-controls` | zemin `#fff`, dolgu `24 / 10`, h 256 (sayfa zemini `#f9f9f9`) |
| **1 · arama** | `.sz-searchbar` | t 539 · **560 × 55** (tam genişlik DEĞİL) |
| **2 · harf rayı** | `.az-bar` | t 602 · 1176 × 66 · `sticky` · `nowrap` + `overflow-x:auto` · gap 6 · 30 düğme (Tümü + 29 harf), harf **38 × 38**, yarıçap 8, 13.5px/700 |
| **3 · kategori** | `.ke-filter` | t 692 · 1176 × 68 · yatay kaydırmalı çip rayı, çip **38** px, yarıçap 8 |
| 4 · sayaç | `p.sz-count` | t 809 · "765 terim" (kısa, tek satır) · 13px/500 muted |
| 5 · liste | `.term-card` | t 845 · **TEK kart**, yarıçap 16, satırlar hairline ile ayrılıyor |
| satır | `.term-row` | **80 px** · dolgu **16 / 20** · ad 15.5/700 (lh 24) · İngilizce 12.5/500 (lh 19), **alt alta** · kategori rozeti sağda tint, **11px/700, dolgu 6/11, yarıçap 8, h 29** |
| açılan kayıt | `.term-detail p` | **`text-align:start` — YASLI DEĞİL** · 14.5px / lh 25.375 (1.75) |
| köprü düğmesi | `.td-recipe` | h **38** · yarıçap 8 · dolgu 8/14 · 13px · tint zemin |
| sayfa sonu | `.sz-suggest` | h 88 (kompakt) |
| **kullanım talimatı** | — | **YOK** (madde 8'in doğrudan referans kanıtı) |

Ekran görüntüleri: `tasks/r6-shots/B/ref-gastro-1440-top.png` · `ref-gastro-liste-1440.png` ·
`ref-gastro-acik-1440.png` · `ref-gastro-alt-1440.png`

---

## Madde 8 — "Satıra dokun" uyarısı kalksın

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET.** Üç satır özet: (1) tasarım kararları bu brief'e
  özgü olmalı, şablon refleksi değil — bu sayfada "kart ızgarası" refleksi reddedildi,
  desen referanstan ölçüldü; (2) cesaret tek yerde harcanır — burada açılan kaydın içindeki
  **dolu yeşil "terim sayfası" eylemi** imza öğe, çevresi sessiz tutuldu; (3) yazı tasarım
  malzemesidir — kaldırılan talimat metninin yerine açıklama değil, **kendini anlatan
  etkileşim** kondu (tek hedefli satır + açılan kayıtta tek eylem).
- **Yapılan değişiklik**
  - `sozluk-v1.html` — `.sz-intro` bloğu **markup'tan** silindi (eski satır 263) **ve
    CSS ailesi** (`.sz-intro`, `.sz-intro>i`, `.sz-intro p`, `.sz-intro p a` + `@640` kuralı)
    silindi — ölü CSS bırakılmadı.
  - İçindeki `egzersiz-kutuphane-v1.html` bağlantısı sayfa sonu CTA'sına **ikinci eylem**
    olarak taşındı (`.sz-cta-acts` içinde `.btn-ghost.sz-cta-alt` "Egzersiz kütüphanesi").
- **Ekran görüntüsü:** `tasks/r6-shots/B/m8-g1-1440.png` · `m8-g1-390.png`
  (taban: `m0-taban-1440.png` · `m0-taban-390.png`)

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — dikey ritim üç ayrı değerdeydi.** Uyarının bıraktığı boşluğu `.sz-body`
  padding-top kapatıyor: **@1440 32 px**, ama `.sz-cta` margin-top **34**, `.hr-note`
  margin-top **34**. @390'da padding-top **22**, aradakiler yine **34**.
  → Üçü de `var(--sec-pad-sm)`'e çekildi. **Ölçülen sonra: @1440 32/32/32 · @390 22/22/22.**
- **Kusur 2 — iki eylem 2 px kaçıktı.** `.btn-fit` kenarlıksız **50 px**, `.btn-ghost`
  1 px kenarlıklı **52 px**. @390'da ayrıca 145 px ve 220 px genişlikte sola yaslı merdiven.
  → `.sz-cta-acts .btn{box-sizing:border-box;min-height:52px}`; @390'da ikisi de tam genişlik.
  **Ölçülen sonra: 52/52 · @390 289/289.**
- **Kusur 3 — ghost kenarlık kontrastı AA altı.** `rgba(255,255,255,.30)` `--slate` (#211E16)
  üzerinde harmanlanınca ≈ `#646259` → **2.70:1** (UI bileşeni için ≥3:1 gerekir).
  → `.40` → `#7A7873` → **3.78:1**. (Metin kontrastı zaten beyaz/slate, etkilenmedi.)
- **Ekran görüntüsü:** `m8-g2-1440.png` · `m8-g2-390.png`

### Geçiş 3 · Referansla karşılaştır
- **Referans URL:** `https://dadagastro.com/mutfak-sozlugu`
- **Doğrudan kanıt:** referansın `section.sz-controls`'u **arama kutusuyla başlıyor**;
  kullanım talimatı şeridi **yok**. Kaldırma kararı referansla birebir.
- **Referanstan zayıf kalan nokta 1 — sayfa sonu bloğu ağır.** Referans `.sz-suggest` **88 px**,
  bizimki **242 px** ve paragraf 4 satırdı. → metin iki satıra indirildi.
- **Referanstan zayıf kalan nokta 2 — paragraf iki yana yaslıydı.** Kabuğun `fit-type.css`
  yaslama katmanı `.sz-cta p`'yi de yaslıyordu; 476 px'de 3, @390'da 289 px'de 6 satır ve
  her satırda görünür "nehir". K12'nin gerekçesiyle aynı durum → **sola yaslı**.
- **Ekran görüntüsü:** `m8-g3-1440.png` · `m8-g3-390.png` · `m8-g3-cta-1440.png`

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| "Satıra dokun" metni | 0 kez | **0** (`tests/sozluk.mjs` madde-8 nöbeti) | ✅ |
| `.sz-intro` düğümü | 0 | **0** | ✅ |
| `egzersiz-kutuphane-v1.html` bağlantısı | ≥ 1 | **1** (sayfa içeriğinde; kabuk menüsündekiler hariç) | ✅ |
| Boşluk tek değerde | evet | @1440 **32/32/32** · @390 **22/22/22** (`--sec-pad-sm`) | ✅ |

---

## Madde 9 — Kartlardaki sağ ok butonu kalksın

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET** (özet madde 8'de).
- **Yapılan değişiklik** — `sozluk-v1.html`, `satir()` üreteci:
  - `<a class="sz-go">` + `fa-chevron-right` **kaldırıldı**; artık gereksiz olan
    `.sz-rowline` sarmalayıcısı da kalktı, `.sz-row` doğrudan `.sz-item`'in çocuğu.
  - `.sz-go` CSS ailesi silindi (ölü CSS yok).
  - Detay sayfasına giden yol **açılan kaydın içine** taşındı: `.sd-more` artık
    *"&lt;Terim&gt; terim sayfası →"* yazan **dolu yeşil** bir eylem (h 40, `--fit-deep`
    zemin — beyazla **5.45:1**, S4 ölçümü; `--fit` 3.52:1'de kalıyordu, seçilmedi).
  - `.sr-caret` (`fa-chevron-down`) **kaldı** — o expand göstergesi, brief'in dediği gibi.
- **Ekran görüntüsü:** `m9-g1-1440.png` · `m9-g1-390.png` · `m9m10-g1-acik-1440.png`

### Geçiş 2 · Kendi işini eleştir
- **Kusur 1 — satır başındaki harf çipi grup başlığını tekrar ediyordu.** "A" grubunda
  26 satırın 26'sında da tint "A" çipi vardı; başlık zaten *"A · 26 terim"* diyor.
  Referansta grup başlığı **yok**, o yüzden orada çip bilgi taşıyor; bizde taşımıyordu.
  → `.sr-ltr` kaldırıldı. Açık satırın işareti artık **sol kenarda 3 px aksan**
  (`inset 3px 0 0 var(--fit-deep)`) + tint zemin + yeşilleşen başlık.
  **Ölçülen önce/sonra:** satırda 4 öğe → **3 öğe**; ad sütunu sol kenarı 151 → **153**
  (kartın 20 px dolgusuyla hizalı), açılan kaydın sol dolgusu 70 → **20** (satırla aynı hiza).
- **Kusur 2 — açılan kayıttaki köprü düğmeleri referanstan küçüktü.** `.sd-foot a`
  dolgu 5/11, h ≈ 28. Referans `.td-recipe` **h 38 · dolgu 8/14 · yarıçap 8 · 13px**.
  → birebir eşitlendi. **Ölçülen sonra: h 38.**
- **Kusur 3 — `.sd-more` "Terimin tam kaydı" belirsizdi.** Sağ ok kalkınca detaya giden
  **tek** yol bu bağlantı oldu; çerçevesiz, tint bir rozet olarak duruyordu.
  → dolu yeşil eylem + terimin adı etikete girdi (*"Jab terim sayfası"*), @390'da tam genişlik.
- **Ekran görüntüsü:** `m9-g2-1440.png` · `m9-g2-390.png` · `m9m10-g2-acik-1440.png`

### Geçiş 3 · Referansla karşılaştır
- **Referans URL:** `https://dadagastro.com/mutfak-sozlugu` (açık satır ölçümü)

| Ölçü | Referans | Biz (önce) | Biz (sonra) |
|---|---|---|---|
| satır yüksekliği | **80** | 66 | **80** ✅ |
| satır dolgusu | **16 / 20** | 12 / 18 | **16 / 20** ✅ |
| ad | 15.5/700, lh 24 | 15.5/700, lh 20 | **15.5/700, lh 24** ✅ |
| İngilizce | 12.5/500, lh 19 | 12.5/500, lh 17 | **12.5/500, lh 19** ✅ |
| ad ↔ İngilizce ara | 4 | 2 | **4** ✅ |
| kategori rozeti | 11px/700, 6/11, r8, h 29 | 10.5/800, 5/10, r6, h 24 | **11px/700, 6/11, r8, h 29** ✅ |
| kart yarıçapı | 16 | 16 | 16 ✅ |
| tanım metni | **`text-align:start`**, 14.5 / lh 1.75 | **yaslı**, 14 / lh 1.68 | **sola yaslı, 14.5 / 1.75** ✅ |
| sağ ok | var (`.tr-go-link`) | var | **YOK** — bilinçli sapma, aşağıda |

- **Referanstan bilinçli SAPMA (tek):** referansta sağ ok hâlâ duruyor. R6 madde 9 onu
  açıkça kaldırıyor (Beyar'ın tespiti: *iki hedefli tek satır = belirsiz*). Brief referansı
  yeniyor; detay yolu açılan kaydın içine taşındı ve orada **daha görünür** hâle getirildi.
- **Ekran görüntüsü:** `m9-g3-1440.png` · `m9-g3-390.png` (= `m9-g3-kayit-*.png`)

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| `.sz-*` satırında `fa-chevron-right` taşıyan bağlantı | 0 | **0 / 254** | ✅ |
| Satır içinde herhangi bir bağlantı | 0 | **0 / 254** | ✅ |
| Eski `a.sz-go` düğümü | 0 | **0** | ✅ |
| Açılan kayıtta `sozluk-detay-v1.html?slug=…` | 232/232 (gerçek: 254) | **254 / 254**, href'ler slug'la birebir | ✅ |
| Expand göstergesi (`.sr-caret.fa-chevron-down`) | duruyor | **254 / 254** | ✅ |
| `tests/sozluk.mjs` | yeşil | **0 sorun** | ✅ |
| `tests/sozluk-kapalilik.mjs` | yeşil | **0 sorun** | ✅ |
| Klavye ile açma/kapama | çalışıyor | Enter → `aria-expanded="true"`, gövde 210 px görünür; Space → `false` | ✅ |
| Klavye ile detaya gitme | çalışıyor | Tab sırası: `İlgili kas` → **`.sd-more → sozluk-detay-v1.html?slug=jab`** → sonraki satır | ✅ |
| `aria-expanded` | doğru | kapalı `false` · açık `true` · `aria-controls` gövdeyi gösteriyor | ✅ |

---

## Madde 10 — Harf / kategori / arama yapısı yeniden kurulacak  (3 TUR)

### Geçiş 1 · Kur (tur 1)
- **frontend-design skill okundu: EVET** (özet madde 8'de).
- **Yapılan değişiklik** — `sozluk-v1.html` baştan kuruldu:
  1. Gövde **iki bölüme** ayrıldı, referansın `sz-controls` / `sz-sec` kurgusu birebir:
     `section.sz-controls` (zemin `--paper`, alt hairline) + `section.sz-body`
     (zemin `--bg` = `#f9f9f9`). Referansta da sayfa grisi + beyaz band + beyaz kart var.
  2. **Blok sırası referanstan:** `.sz-find` (arama) → `#szLetters` (harf rayı) →
     `#szCatFilter` (kategori) → sayaç → liste. Eskiden **harf → kategori → arama**'ydı.
  3. **Yapışkan panel kalktı.** Eski `.sz-panel` `position:sticky;top:112px` taşıyordu.
     Yeni bandda yapışkan **yok**. Kabuğun `.ff-bar`'ı da `sticky` geliyor —
     `#szCatFilter .ff-bar{position:static;top:auto;z-index:auto}` ile **yalnız bu sayfada**
     iptal edildi; `fit-shell.css`'e tek satır yazılmadı.
  4. **Kategori sunumu = sitenin ortak "Filtrele" bileşeni.** Yeni desen icat edilmedi:
     `egzersiz-kutuphane-v1.html`'in kullandığı sözleşme birebir çağrıldı —
     `<div class="lib-filters ff" data-ff data-ff-count=".sz-count" data-ff-clear="#szReset">`
     içinde `.fgroup[data-group="kategori"]` + `.df-fchip`'ler. Kabuk bunu
     **dropdown + içinde arama + seçim rozeti + kaldırılabilir çip satırı + mobil çekmece**
     hâline getiriyor.
     **Kritik ayrıntı:** kabuk bileşeni `fit-shell.js` yüklenirken **senkron** kuruluyor ve
     çipleri o an okuyor. Bu yüzden `sozluk-veri.js` + küçük bir **ön-script**
     `fit-shell.js`'ten **ÖNCE**ye alındı; çipler kabuktan önce basılıyor. Sonra basılsaydı
     bileşen boş bir eksen kurar ve **açılır menünün içindeki arama alanı hiç oluşmazdı**
     (`realChips.length > 0` koşulu). Sayılar yine diziden hesaplanıyor.
  5. Harf rayı **cetvel** oldu: "Tümü" ızgaranın dışında, 29 harf
     `grid-template-columns:repeat(29,minmax(0,1fr))` ile eşit sütunlara yayılıyor.
  6. Liste referansın `.term-card` desenine geçti: harf grubunun satırları **tek kartın**
     içinde hairline ile ayrılıyor (eskiden her satır ayrı kutu + 8 px aralıktı).
  7. Sayaç kısaldı ve `data-ff-count` ile **`.ff-bar`'ın sağ ucuna** taşındı
     (egzersiz-kutuphane'deki bileşim). Gereksizleşen `.sz-active` / `.sz-pill`
     rozet satırı kaldırıldı — aktif kategori artık bileşenin kendi çipinde,
     aktif harf rayda işaretli, arama metni kutunun içinde.
- **Ekran görüntüsü:** `m10-g1-1440.png` · `m10-g1-390.png` · `m9m10-g1-acik-1440.png`

### Geçiş 2 · Kendi işini eleştir (tur 2)
- **Kusur 1 — çubuğun ortasında ~920 px ölü alan.** Kabuğun `.ff-spacer`'ı ekseni sola,
  sayacı sağa itiyor; 4 eksenli sayfalarda doğru, **tek eksende** çubuk "yarım kalmış kart"
  gibi duruyordu. → `#szCatFilter .ff-spacer{display:none}` + `.ff-bar{width:max-content}`.
  **Ölçülen önce/sonra: çubuk 1176 px (içerik ~250) → 258 px, içeriğine sarılıyor.**
- **Kusur 2 — "Ğ" düğmesi odaklanmış giriş alanı gibi okunuyordu.** Kesikli kenarlık +
  saydam zemin, "devre dışı" değil "aktif alan" izlenimi veriyordu.
  → düz kenarlık (`--line`), `--bg` zemin, opacity .42. `disabled` + `aria-disabled` duruyor.
- **Kusur 3 — @390 dokunma hedefi 40 px.** Kabuğun mobil "Filtrele" düğmesi (`.ff-open`)
  ölçüldü: **40 px**. → `#szCatFilter .ff-open{min-height:44px}`.
  **Ölçülen önce/sonra: 40 → 44.** (Harf düğmeleri @390'da zaten 44 × 44.)
- **Kusur 4 — bandın alt nefesi fazlaydı.** `#szCatFilter` `margin-bottom:22px` taşıyordu,
  bandın 20 px dolgusuyla toplanıp 42 px oluyordu. → `margin-bottom:0`.
- **Ekran görüntüsü:** `m10-g2-1440.png` · `m10-g2-390.png` · `m10-g2-cekmece-390.png`
  (mobil çekmece) · `m9m10-g2-acik-1440.png` (açılır menü)

### Geçiş 3 · Referansla karşılaştır (tur 3)
- **Referans URL:** `https://dadagastro.com/mutfak-sozlugu`

| Ölçü | Referans | Biz (tur 1) | Biz (tur 3) |
|---|---|---|---|
| blok sırası | arama → harf → kategori → sayaç → liste | aynı | **aynı** ✅ |
| arama kutusu | 560 × 55, sola yaslı | 560 × 55 | **560 × 55** ✅ |
| harf rayı genişliği | 1176 | 1176 | **1176** ✅ |
| harf düğmesi | 38 × 38, r8, 13.5/700 | 32 × 38, r8, 13.5/700 | **32 × 38** (bilinçli, aşağıda) |
| harf sayısı | 30 (Tümü + 29) | 30 | **30** ✅ |
| boş harf | Ğ, Ü `disabled` | Ğ `disabled` | **Ğ `disabled`** ✅ (verimiz Ü dolu) |
| kategori seçici | çip rayı (yatay kaydırma) | Filtrele dropdown | **Filtrele dropdown** (brief şartı) |
| band zemini | `#fff`, sayfa `#f9f9f9` | aynı | **aynı** ✅ |
| band dolgusu | 24 / 10 | 26 / 24 | **26 / 20** |
| sayaç | kısa, tek satır | kısa | **kısa** ✅ |
| liste kartı | tek kart, r16 | tek kart, r16 | **tek kart, r16** ✅ |
| satır | 80 px | 66 | **80** ✅ |
| yapışkan | `.az-bar` sticky | yok | **yok** (brief şartı) |

- **Referanstan zayıf kalan nokta 1 — satır ferahlığı** (66 vs 80) → kapatıldı (madde 9'da tablo).
- **Referanstan zayıf kalan nokta 2 — tanım metni yaslıydı**, referansınki `text-align:start`
  → kapatıldı, tipografi de eşitlendi (14.5 / 1.75).
- **Referanstan zayıf kalan nokta 3 — kategori rozeti küçüktü** → referans ölçüsüne çekildi.
- **ÜÇ BİLİNÇLİ SAPMA** (hepsi gerekçeli, hepsi geri alınabilir — §"Verilen kararlar"):
  yapışkan yok · harf rayı kaydırılmıyor (cetvel) · kategori çip rayı değil dropdown.
- **Ekran görüntüsü:** `m10-g3-1440.png` · `m10-g3-390.png` · `m10-tur3-1440.png`
  (çubuk sarma sonrası) · `m10-g3-bos-1440.png` (boş durum)

### Kabul ölçütleri
| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| Blok sırası referansla aynı | evet | arama (t 570) → harf (t 675) → kategori (t 735) → liste (t 901) — ekran görüntüsüyle kanıtlı | ✅ |
| `position:sticky` taşıyan süzgeç öğesi | 0 | **sayfa akışında 0.** Tek `sticky`: `.ff-search`, **açılır menünün kendi kaydırma kabının içinde** (kabuk bileşeninin parçası) — sayfaya yapışmıyor, viewport'a sabitlenmiyor | ✅ (not aşağıda) |
| Kategori seçici = `egzersiz-kutuphane` "Filtrele" bileşeni | aynı sınıf/desen | `#szCatFilter[data-ff].ff-ready` · `.ff-bar .ff-btn` · `.ff-pop .ff-search input` — **birebir aynı sınıflar** | ✅ |
| dropdown + içinde arama | var | açılır menüde "Kategori ara" alanı çalışıyor; mobilde `.ff-sheet` çekmecesi | ✅ |
| Harf rayı 29 harf | 29 | **29** (+ "Tümü") | ✅ |
| Ğ `disabled` | evet | **`disabled` + `aria-disabled="true"`** | ✅ |
| Aktif harf işaretli | evet | `.sz-ltr.on` = `--fit-deep` zemin / beyaz metin | ✅ |
| Üç süzgeç aynı anda süzüyor | evet | `?harf=K&kategori=anatomi` → 5 · `kategori=kosu` + `q=koş` → 14 · üçü birlikte → 0 + boş durum | ✅ |
| Sayaç = DOM | evet | filtresiz 254 = 254 · 10 kategorinin 10'unda DOM = sayaç = veri · 28 harfin 28'inde eşit | ✅ |
| Boş durum çıkıyor | evet | `zzzqqqxxx` → 0 kart, blok görünür, "filtreleri temizle" listeyi geri getiriyor | ✅ |
| @390 harf rayı taşmıyor | taşma 0 | **belge taşması 0**; ray kendi içinde kayıyor (`scrollWidth 1519 > clientWidth 358`) | ✅ |
| @390 dokunma hedefi | ≥ 44 px | harf **44 × 44** · Filtrele **44** · satır **67** · arama **50** | ✅ |
| `tests/sozluk.mjs` | yeşil | **0 sorun** | ✅ |

---

## Verilen kararlar (gerekçe + nasıl geri alınır)

1. **Süzgeç bandı iki bölüme ayrıldı, gövde zemini beyazdan `--bg`'ye (#f9f9f9) döndü.**
   *Gerekçe:* referansta sayfa zemini `#f9f9f9`, süzgeç bandı ve terim kartı `#fff`.
   Beyaz üstüne beyaz kartta satırlar kendi kenarlığına muhtaç kalıyordu; grinin üstünde
   liste **tek kart** gibi okunuyor. *Geri alma:* `.sz-body{background:var(--bg-white)}`
   yap ve `.sz-controls` bölümünü `.sz-body`'nin içine geri al.

2. **Kategori ekseni kabuğun `.ff` bileşenine verildi; `sozluk-veri.js` + ön-script
   `fit-shell.js`'ten ÖNCEYE alındı.**
   *Gerekçe:* bileşen `[data-ff]` panelini kurulum anında okuyor; çipler sonra basılsaydı
   açılır menünün arama alanı hiç oluşmazdı (brief'in şartı). Kabuk dosyasına dokunmadan
   çözmenin tek yolu script sırası. *Geri alma:* iki `<script>`'i eski sırasına al ve
   çip üretecini ana script'e geri taşı (bileşen o zaman **çalışmaz**, uyarı: madde 10 bozulur).

3. **`position:sticky` iptali sayfa içinde yapıldı, kabukta değil.**
   *Gerekçe:* 0b sahiplik kuralı — `fit-shell.css` AJAN-A'nın. *Geri alma:*
   `#szCatFilter .ff-bar{position:static;top:auto;z-index:auto}` üç bildirimini sil.

4. **Harf rayı kaydırılmıyor, cetvel oldu.**
   *Gerekçe:* referans 30 düğmeyi yatay kaydırıyor ve M'den sonrası ekran dışında kalıyor;
   29 harf 1176 px'e sığıyor, hiçbirini gizlemeye gerek yok. @1100'de 15, @860'ta 10 sütuna
   iniyor; @640 altında **referansın kaydırma davranışına** dönüyor ve düğme 44 px'e çıkıyor.
   *Geri alma:* `.sz-ruler{grid-template-columns:...}` kurallarını silip `@640` altındaki
   `display:flex` + `overflow-x:auto` kurgusunu tüm genişliklere uygula.

5. **Satır başındaki harf çipi (`.sr-ltr`) kaldırıldı.**
   *Gerekçe:* referansta harf grubu başlığı **yok**, o yüzden satır çipi bilgi taşıyor;
   bizde grup başlığı var ve aynı harf grup boyunca 26 kez tekrar ediyordu.
   K37'nin kilitlediği üç sabit (arama eşiği · harf rayı · istatistik şeridi) arasında
   **değil**, dolayısıyla sözleşme bozulmadı. *Geri alma:* `satir()` içine
   `'<span class="sr-ltr" aria-hidden="true">' + t.harf + '</span>'` satırını geri koy,
   `.sz-detail` sol dolgusunu 70 px'e çevir.

6. **`.sz-active` / `.sz-pill` aktif süzgeç rozetleri kaldırıldı.**
   *Gerekçe:* aynı bilgi üç yerde birden görünüyordu — bileşenin kendi kaldırılabilir
   çipi, raydaki işaretli harf, arama kutusundaki metin. Referansta da böyle bir satır yok.
   *Geri alma:* `#szAktif` düğümünü ve `ciz()` içindeki rozet bloğunu geri koy.

7. **Sayaç `.ff-bar`'ın içine taşındı ve kısaldı** ("254 terim" / "55 / 254 terim").
   *Gerekçe:* `data-ff-count` bileşenin kendi sözleşmesi; egzersiz-kutuphane'deki bileşim
   birebir bu. Uzun metin çubuğa sığmıyordu. *Geri alma:* `data-ff-count` özniteliğini
   sil, `ciz()` içindeki sayaç metnini uzun biçime döndür (**sınamalardaki `OKU`
   yardımcıları da geri alınmalı**).

8. **Tanım metni ve CTA paragrafı yaslamadan çıkarıldı.**
   *Gerekçe:* referansın `.term-detail p`'si **ölçüldü** — @1440 ve @390'da `text-align:start`.
   Kabuğun `fit-type.css` yaslama katmanı bizimkini yaslıyordu ve @390'da 322/289 px'lik
   kutuda K12'nin tarif ettiği "nehirler" oluşuyordu. *Geri alma:* `.sz-detail>p`, `.sd-ex`
   ve `.sz-cta p` bloklarındaki `text-align:left;text-align-last:auto` çiftlerini sil.

9. **`sozluk-detay-v1.html` ve `assets/js/sozluk-veri.js` değiştirilmedi.**
   *Gerekçe:* madde 8/9/10 liste sayfasının yerleşimiyle ilgili. Detay sayfasının liste
   sayfasına dönen derin bağlantıları (`?harf=`, `?kategori=`) **yeni kurguda da ölçüldü ve
   çalışıyor** (aşağıda). Veriye dokunmak K37/K42 sözleşmelerini riske atardı.

10. **Sınamalar yeni gerçeğe göre güncellendi — zayıflatılmadı, güçlendirildi.**
    - `okDisarida` / `okHref` (sağ ok nöbeti) → **`satirdaLink` + `satirdaSagOk` + `detayHref`**
      ve tüm listede **254/254** ölçen yeni bir nöbet (`11b`).
    - Yeni nöbet `11c`: blok sırası · sayfa akışında sticky 0 · bileşen kimliği
      (`[data-ff].ff-ready` + `.ff-pop .ff-search input`) · harf rayı 29 · boş harf `disabled`.
    - Yeni nöbet `11d`: "Satıra dokun" 0 · `.sz-intro` 0 · kütüphane bağlantısı ≥1.
    - Kategori nöbetleri artık **gerçek kullanıcı yolunu** koşturuyor (menüyü aç → çipi tıkla)
      — eskiden görünür çipe doğrudan tıklıyordu.

---

## Kabukta gördüğüm ama DOKUNMADIĞIM eksikler (AJAN-A'ya)

1. **`.ff-bar` `position:sticky;top:112px`** (`assets/css/fit-shell.css:2199`).
   R6 madde 10 sözlükte yapışkan istemiyor; sayfa içinde `position:static`e çektim.
   Aynı ihtiyacı başka sayfa da duyarsa **kabukta bir değiştirici** (ör. `.ff--flat`)
   sayfa sayfa geçersiz kılmaktan temiz olur.
2. **`.ff-open` @390'da 40 px** — dokunma hedefi 44'ün altında. Sayfa içinde
   `min-height:44px` ile kapattım; **bileşeni kullanan bütün sayfalarda aynı sorun var.**
3. **`.ff-bar` tek eksenli kullanımda yarım duruyor.** `.ff-spacer` ekseni sola, sayacı
   sağa itiyor; tek facet'te ~920 px ölü alan kalıyor (ölçüldü). Sayfa içinde
   `display:none` + `width:max-content` ile çözdüm; bileşende **tek eksen** hâli için bir
   davranış tanımlanabilir.
4. **`.hr-note{margin-top:34px}`** (`fit-shell.css:1426`) sabit; sitenin bölüm ritmi
   `--sec-pad-sm` (32 / @640 22). Sözlükte ritmi tek değere çekmek için sayfa içinde
   `.sz-body .hr-note{margin-top:var(--sec-pad-sm)}` yazdım.
5. **`href="#"` 8 adet** — `page-check` her iki sözlük sayfasında da uyarıyor.
   Kaynağı ölçüldü: **`assets/js/fit-shell.js` (8 geçiş)**; sayfa dosyalarında **0**.
   Yani kabuk markup'ından geliyor, sayfadan değil.
6. **`fit-type.css` yaslama katmanı** kısa kart metinlerini de yaslıyor. §4'teki
   container-query kaçış yolu (`@container (max-width:20rem)`) 320 px eşiğinde;
   @390'da kart kutuları 322 px olduğu için **eşiğin bir kıl payı üstünde kalıyor** ve
   devreye girmiyor (sözlükte ölçtüm). Eşik 22–24rem olsaydı kendiliğinden çözülürdü.

---

## Bozulmadığını kanıtladıklarım

- **Banner ailesi 544 / 607 / 587 (LİSTE) · 560 / 617 / 726 (DETAY):**
  `tests/sozluk.mjs` → *"banner ailesi birebir"* ✅. Ayrı ölçüm: `.lib-top` @1440 = **544**.
  (AJAN-A'nın madde 4'ü ekran görüntülerinde görünüyor — istatistik şeridi sağda dikey —
  ve banner yüksekliği **değişmemiş**.)
- **R11 footer perdesi:** `main.margin-bottom` = **579.531px** · footer yüksekliği = **580**
  (kesirli değer korunuyor, kuyruk yok).
- **Yatay taşma:** @1440 **0** · @390 **0** (`page-check` + `tests/sozluk.mjs`, iki sayfa).
- **Konsol hatası:** @1440 **0** · @390 **0** · detay taramasında **254 sayfa yüklemesinde 0**.
- **`tests/sozluk.mjs`:** ✓ **0 sorun** (yeni üç nöbetle birlikte).
- **`tests/sozluk-kapalilik.mjs`:** ✓ **0 sorun** — K42 kapalılığı (22 ifade), K40 (27/27 kas adı),
  hareket köprüsü 16/25 uydurmasız, kas köprüsü 26/27 uydurmasız, katalog çakışması 11 terim ≤250 krk.
- **`tools/page-check.mjs sozluk-v1.html 1440`:** → **temiz** (tek uyarı: kabuktan gelen `href="#"` 8).
- **`tools/page-check.mjs sozluk-detay-v1.html 1440`:** → **temiz** (dokunulmadı, kontrol amaçlı).
- **Derin bağlantılar** (detay sayfasının liste sayfasına dönüş yolları) — hepsi sayfa motoru
  **ve** kabuk bileşeniyle senkron:

| URL | kart | sayaç | bileşen rozeti | bileşen çipi | aktif harf | q |
|---|---|---|---|---|---|---|
| `?kategori=dovus` | 24 | 24 / 254 terim | 1 | "Kategori: Dövüş sanatları 24" | Tümü | — |
| `?harf=K&kategori=anatomi` | 5 | 5 / 254 terim | 1 | "Kategori: Kas grupları ve anatomi 30" | K | — |
| `?q=squat` | 4 | 4 / 254 terim | 0 | — | Tümü | squat |
| *(boş)* | 254 | 254 terim | 0 | — | Tümü | — |

- **Çubuktaki "Temizle" üç ekseni birden sıfırlıyor:** `?harf=K&kategori=ekipman&q=koş`
  (0 kart) → tıklama → URL boş · 254 kart · q boş · harf "Tümü" · rozet 0.
