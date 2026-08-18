# REVİZE PLAN 4 — DadaFit prototip, dördüncü revizyon turu

**Taban commit:** `a0c2afc` · **Plan:** bu dosya · **Kararlar:** `KARARLAR.md` (K21–)
**Önceki tur:** `REVIZE-PLAN-3.md` · **Devir notu:** `HANDOFF.md`

---

## Kalıcı kurallar (açılış mesajından, her maddede geçerli)

| Kural | İçerik |
|---|---|
| **ÖLÇÜM** | "Düzeldi" demeden önce ölç: `boundingBox` · `scrollWidth`/`clientWidth` · `getComputedStyle` · kontrast · HTTP durumu. İki kez ölçmeden rapor yok. **Kaydırılmış durumda da** ölç. |
| **GÖRÜNÜRLÜK** | `offsetHeight > 0` **ve** viewport içinde mi — ekran görüntüsü al. |
| **ÇAPA** | Her çapa için temiz context. |
| **TARAMA** | Kalıntı ararken ≥3 varyant; seçiciyi fazla geniş tutma, eşleşmeleri gözle doğrula. |
| **KABUK** | `assets/js/fit-shell.js` · `assets/css/fit-shell.css` · `assets/css/fit-type.css` → **yalnız ana oturum yazar.** |
| **REFERANS** | Referans = ölçü + iskelet. Başka markanın renk token'ı / tema değişkeni / tipografi paleti **kopyalanmaz.** |
| **DOĞRULAMA** | Kimse kendi işini onaylamaz. Ajan rapor **metni** döndürmezse faz **SARI** kalır. |
| **COMMIT** | Her madde ayrı commit, **push yok.** |
| **BELİRSİZLİK** | En iyi seçeneği seç → `KARARLAR.md` → devam. |
| **CONTEXT** | %80'i geçerse `HANDOFF.md` güncelle, commit et, dur. |

## Ölçüm ortamı

```
http://localhost:8811   → çalışma ağacı (HEAD)
http://localhost:8812   → 0e664b8 worktree (D2 ÖNCESİ referans)
PW_HOME=~/.pw           → playwright-core 1.62.1
scratchpad/m/*.mjs      → ölçüm script'leri (hero.mjs · kids.mjs · shot.mjs · …)
```

---

# R1 — BANNER HİZASI GERİ ALINACAK

**Beyar:** *"Banner maddesi bitti diyor ama banner'lar istediğim şekilde değil,
yapıyı bozmuş, saçma bir şekilde ortalanmış, böyle bir şey istemedim. Önce bu
banner'ları eski haline getir."*
**Kapsam:** hiza + boş alan verimliliği. **Sabit yükseklikler (344 / 384) DEĞİŞMEZ.**

## R1.0 · Tespit — ölçüm ne gösterdi

D3, banner ailesine şu bloğu eklemişti (`fit-shell.css`):

```css
body[data-fit-hero-kind] .lib-top, … {
  display:flex; flex-direction:column;
  justify-content:flex-start;
  justify-content:safe center;   /* ← dikey ortalama */
}
```

Bu tek blok **iki ayrı kırılma** üretti — ikisi de ölçüldü:

### Kırılma 1 — YATAY (Beyar'ın "saçma bir şekilde ortalanmış" dediği şey)

`.lib-top > .wrap` üzerinde `margin:0 auto` + `max-width` var. Blok akışında bu
kutuyu **1180 px'e açıp ortalar** (sol kenar sabit **132 px**). Ama kutu bir
**flex item** olunca çapraz eksende `margin:auto` `stretch`'i iptal eder →
kutu **shrink-to-fit** olur ve genişliği **sayfanın en uzun satırına** göre değişir.

| Sayfa | `.wrap` sol kenarı — ŞİMDİ | D2 ÖNCESİ |
|---|---|---|
| `reklam-ver-v1` | **234.2 px** | 132 px |
| `fit-testi-sonuc-v1` | **296.3 px** | 132 px |
| `program-liste-v1` | **348 px** | 132 px |
| `antrenorler-v1` | **408 px** | 132 px |
| `enerji-defteri-haftalik-v1` | **466 px** | 132 px |

Yani banner metni sayfa sayfa **farklı yerden** başlıyor ve altındaki içerik
ızgarasıyla (sol kenar 132) **hizasız**. 51 sayfanın 51'inde yatay hiza bozuk.

### Kırılma 2 — DİKEY: içerik sabit kutudan taşıyor ve KIRPILIYOR

`.lib-top{overflow:hidden}`. Sabit 344 px + `safe center` + taşan içerik =
**alt bloklar kesiliyor.** Ölçüm (`heroBottom − son görünür çocuğun alt kenarı`,
negatif = taşma):

| Sayfa | Taşma | Görsel sonuç |
|---|---|---|
| `program-liste-v1` | **−112.0 px** | CTA satırı **ve** `40+ program · 3–12 hafta · 4 hedef` istatistikleri **tamamen yok** |
| `arama-fit-v1` | **−103.2 px** | arama kutusu alt yarısı kesik |
| `destek-talebi-detay-v1` | **−100.2 px** | çip satırı + istatistik yok |
| `hakkimizda-v1` | **−99.7 px** | istatistik satırı yok |
| `antrenor-detay-v1` | **−75.2 px** | — |
| `antrenorler-v1` | **−70.3 px** | CTA düğmeleri **yarıdan kesik**, istatistikler yok |
| `fit-testi-sonuc-v1` | **−66.3 px** | — |
| … toplam | **28 / 51 sayfa** | |

> **BEKLENMEDİK BULGU B1 — 3. turun ölçümü yanlıştı.**
> `REVIZE-PLAN-3.md` D3 satırı *"taşan/kırpılan içerik **0**"* diyor.
> Bu tur 51 banner sayfasının **28'inde** kırpma ölçtü ve ekran görüntüsüyle
> doğruladı. `safe center` taşmayı **kutunun altına** itiyor; `overflow:hidden`
> onu kesiyor. 3. turda taşma ölçümü yalnız **üst** kenardan yapılmış
> (header'ın altına kayma), **alt** kenar hiç ölçülmemiş.

### Karşılaştırma tablosu — D2 öncesi (`0e664b8`) ↔ şimdi, @1440

`gapÜst` = banner üst kenarı → ilk içerik · `gapAlt` = son içerik → banner alt kenarı
(negatif = **taşma**) · `h1.top` = başlığın viewport'taki üst kenarı.

| Sayfa | H şimdi | H önce | gapÜst ş/ö | gapAlt ş/ö | h1.top ş/ö |
|---|---|---|---|---|---|
| aktivite-gunlugu-v1 | 344 | 523.4 | 129 / 152 | **−48.3** / 38 | 193.2 / 228.2 |
| antrenor-detay-v1 | 384 | 487.2 | 129 / 133 | **−75.2** / 24 | 253.7 / 257.7 |
| antrenorler-v1 | 344 | 497.3 | 129 / 152 | **−70.3** / 38 | 193.2 / 228.2 |
| arama-fit-v1 | 344 | 489.2 | 129 / 139 | **−103.2** / 32 | 195.2 / 205.2 |
| bagli-uygulamalar-v1 | 344 | 499.4 | 129 / 152 | **−48.3** / 38 | 193.2 / 228.2 |
| bildirimler-v1 | 344 | 389.5 | 129 / 152 | 10.5 / 38 | 216.2 / 237.2 |
| challenge-merkezi-v1 | 344 | 466.5 | 129 / 152 | **−39.5** / 38 | 193.2 / 228.2 |
| destek-talebi-detay-v1 | 384 | 567.2 | 129 / 152 | **−100.2** / 38 | 193.2 / 228.2 |
| destek-talepleri-v1 | 344 | 499.4 | 129 / 152 | **−48.3** / 38 | 193.2 / 228.2 |
| egzersiz-kutuphane-v1 | 344 | 422.9 | 129 / 152 | 4.1 / 38 | 193.2 / 228.2 |
| enerji-defteri-v1 | 344 | 431.9 | 129 / 152 | **−12.9** / 38 | 193.2 / 228.2 |
| fit-planim-v1 | 344 | 431.9 | 129 / 152 | **−12.9** / 38 | 193.2 / 228.2 |
| fit-testi-detay-v1 | 384 | 475.3 | 129 / 152 | **−8.3** / 38 | 193.2 / 228.2 |
| fit-testi-sonuc-v1 | 344 | 557.6 | 129 / 152 | **−66.3** / 38 | 193.2 / 228.2 |
| fit-testleri-v1 | 344 | 499.4 | 129 / 152 | **−48.3** / 38 | 193.2 / 228.2 |
| hakkimizda-v1 | 344 | 574.7 | 129 / 152 | **−99.7** / 38 | 193.2 / 228.2 |
| hareket-merkezi-v1 | 344 | 498.9 | 129 / 152 | 4.1 / 38 | 193.2 / 228.2 |
| hareket-rehberi-v1 | 344 | 466.5 | 129 / 152 | **−39.5** / 38 | 193.2 / 228.2 |
| hareket-sozluk-v1 | 344 | 367.9 | 145.6 / 152 | 34.6 / 38 | 209.7 / 228.2 |
| hesabim-v1 | 344 | 446.9 | 129 / 152 | 4.1 / 38 | 193.2 / 228.2 |
| pro-v1 | 344 | 436.3 | 129 / 152 | **−9.6** / 38 | 187 / 229.6 |
| program-liste-v1 | 344 | 615.0 | 129 / 152 | **−112.0** / 38 | 193.2 / 228.2 |
| programlar-merkezi-v1 | 344 | 498.9 | 129 / 152 | **−48.3** / 38 | 193.2 / 228.2 |
| reklam-ver-v1 | 344 | 475.5 | 129 / 152 | **−16.4** / 38 | 202.6 / 229.6 |
| sss-v1 | 344 | 442.3 | 129 / 152 | **−15.7** / 38 | 187 / 229.6 |
| uyelik-faturalandirma-v1 | 344 | 424.3 | 129 / 152 | 10.3 / 38 | 187 / 229.6 |
| video-seanslari-v1 | 344 | 499.4 | 129 / 152 | **−48.3** / 38 | 193.2 / 228.2 |
| yasal-v1 | 344 | 406.7 | 129 / 152 | 12.3 / 38 | 193.2 / 228.2 |

*(tam 56 satırlık çıktı: `scratchpad/m/cur-1440.json` ↔ `pre-1440.json`)*

## R1.1 · İş — ne yapıldı

Hepsi **tek yerde**, `assets/css/fit-shell.css` banner bloğunda. Sayfa
işaretlemesi **değişmedi** (tek istisna yok — 0 HTML dosyası düzenlendi).

| # | Değişiklik | Neyi çözer |
|---|---|---|
| 1 | `display:flex` + `justify-content:safe center` bloğu **silindi** | Yatay kırılma: `.wrap` yeniden blok akışında, `margin:0 auto` çalışıyor → sol kenar **51/51 sayfada 132 px** |
| 2 | Banner `.wrap` → `height:100%` + `flex-flow:column wrap` | Dikey kırılma: içerik sabit kutuya sığmayınca **kırpılmak yerine** sağdaki boş ~440 px'e ikinci kolon olarak geçiyor |
| 3 | Kolon genişliği kelepçesi: ana bloklar **660 px**, açıklamadan sonrakiler **380 px** (660 + 52 + 380 = 1092 ≤ 1116) | Kelepçesiz ikinci kolon `.wrap`ı taşıyordu (bildirimler çipleri, fit-testi-sonuc istatistikleri sağdan kırpılmıştı) |
| 4 | `row-gap` 10 → **8 px** | `destek-talebi-detay`'da açıklama satırı kutuya **2 px** farkla sığmayıp ikinci kolona düşüyor, oradaki 660 px genişliğiyle taşırıyordu (sağ kenar 1504 > 1308) |
| 5 | Banner `h1` **39 → 34 px**, `line-height` 1.16, `max-width` kelepçesi kalktı | 39 px başlık 231 px'lik gerçek içerik alanında tek başına iki-üç satır sürüyordu |
| 6 | Banner içi düğmeler kompakt (44 → 38 px), `.lib-stats` satır aralığı 26 → 9 px | İstatistik şeridi üç satıra sarıp **üçüncü** kolona itiliyordu |
| 7 | Tek bloklu iki istisna (`reklam-ver` `.mk-hero`, `bildirimler` `.nt-*`) sütun-sarmalının **dışında** (`:has()` kelepçesi), kendi dikey ritimleri sıkıldı | İkinci kolona geçince banner metni sağa kayıyor ve R1'in düzelttiği hiza bozukluğu geri geliyordu (ölçüldü: `.mk-hero` sola 508 px'e kaymıştı) |
| 8 | `.cp-top` (antrenör detayı) **sabit kutudan çıkarıldı**, taban 384 px kaldı | İçinde randevu kartı var; en sıkı makul ölçekle 226 px sürüyor, kutunun verdiği 207.6 px'i aşıyor. 3. turun kendi kuralı ("ikinci kart taşıyan imza banner'ı kutunun dışındadır") zaten bunu söylüyordu — `.cp-top` yanlışlıkla içerideydi. **KARARLAR K22** |

## R1.2 · ÖLÇÜM — sonuç

Ölçüm iki kez koşuldu, **59 sayfanın 59'unda birebir aynı çıktı** (`cur9.json` ↔ `cur9b.json`, fark 0).

| Ölçüm | Önce | Sonra |
|---|---|---|
| Banner içeriği **alt kenardan taşan/kırpılan** sayfa | **28 / 51** | **0 / 51** ✅ |
| Banner içeriği **sağ kenardan** kırpılan sayfa (@1440) | 2 | **0** ✅ |
| `.wrap` sol kenarı (yatay hiza) | 234.2 … 466 px arası **değişken** | **132 px — 51/51 sayfa** ✅ |
| `h1` sol kenarı, tüm banner'lı sayfalar | değişken | **132 px** (2 istisna: `antrenor-detay` 348 · `program-detay` 165 — ikisi de portre/medya yanına oturan imza banner'ı, kendi iç ızgaraları var) |
| **Liste ailesi** yüksekliği | 344 (kırparak) | **47 sayfanın 47'si 344 px** — yayılım **0 px** ✅ |
| **Detay ailesi** yüksekliği | 384 (kırparak) | **3 sayfanın 3'ü 384 px** — yayılım **0 px** ✅ |
| `antrenor-detay` (`.cp-top`) | 384 (75.2 px kart kırpılmış) | **477.2 px**, kart tam görünür — imza banner'ı |
| Kalite kapısı (`tools/page-check.mjs`) | — | dokunulan **10 sayfa × 2 genişlik = 20/20 TEMİZ** |
| Kaydırılmış durum (`scrollY=420`, @1440) | — | **51 banner**, header örtüşmesi **0**, yatay taşma **0** |
| @390 banner kırpması | — | **0** (tek eşleşme `bildirimler` çip rayı — `overflow-x:auto` **drag-scroll**, D2 öncesiyle **birebir aynı** `scrollWidth 585 / clientWidth 358`; yanlış alarm) |

**Ekran görüntüsü (8 sayfa @1440 + 5 sayfa @390):** `scratchpad/shots/r1-*.png`
Görsel doğrulama — daha önce görünmeyen içerik geri geldi:
`antrenorler` CTA düğmeleri + `40+ · 7 · 100%` istatistikleri ·
`program-liste` `40+ program · 3–12 hafta · 4 hedef` ·
`hakkimizda` istatistik şeridi · `antrenor-detay` randevu kartının alt yarısı
(`Mesaj Gönder` + "İlk 15 dk tanışma görüşmesi ücretsiz").

---

# R2 — BANNER AİLE SINIFLANDIRMASI

_(R1 bitmeden başlanmaz)_

# R3 — BREADCRUMB ANA SAYFA İKONU
# R4 — FİLTRE KARTI REFERANSA HİZALANSIN
# R5 — HER EKSENDE ARAMA
# R6 — DROPDOWN YÖNÜ
# R7 — ÇİP RADIUS'U
# R8 — DİKEY TUTARSIZLIK
# R9 — AÇIK KALAN KONTROLLER
# R10 — DOĞRULAMA BORCU
# H0 — YENİ MODÜLLER İÇİN KONSEPT ÖNERİSİ (uygulama yok)

---

# BEKLENMEDİK BULGULAR

| # | Bulgu | Nerede |
|---|---|---|
| **B1** | 3. turun *"taşan/kırpılan içerik 0"* ölçümü **yanlış**. 51 banner sayfasının **28'inde** içerik sabit kutudan taşıp `overflow:hidden` ile kırpılıyordu; en kötüsü `program-liste-v1` **−112 px** (CTA + istatistik satırı tamamen görünmez). | R1.0 |
| **B2** | `justify-content:safe center` yalnız dikeyi değil **yatayı da** bozmuş: `.wrap` flex item olunca `margin:0 auto` `stretch`'i iptal ediyor, kutu shrink-to-fit oluyor ve sol kenar sayfa sayfa **234–466 px** arasında değişiyor (olması gereken: sabit 132 px). | R1.0 |
