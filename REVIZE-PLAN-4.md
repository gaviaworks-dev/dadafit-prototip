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

# R2 — BANNER AİLE SINIFLANDIRMASI DOĞRULANDI

**Beyar:** *"Mevcut sınıflandırma 47 liste artı 4 detay = 51 sayfa. Depoda bundan
fazla sayfa var. Tüm sayfaları tek tek gez ve liste mi detay mı olduğunu yeniden
sınıflandır."*

**Ölçüm yöntemi:** 60 HTML dosyasının **60'ı** tarayıcıda açıldı; her sayfada
banner sınıfı, `body[data-fit-hero-kind]`, ölçülen yükseklik ve `h1` okundu
(`scratchpad/m/classify.mjs` → `classify.json`).

## R2.0 · Sayım kapanıyor

| | Sayfa |
|---|---|
| **LİSTE ailesi** (sabit **344 px**) | **47** |
| **DETAY ailesi** (sabit **384 px**) | **4** |
| **İMZA banner'ları** (sabit kutunun dışında — içinde ikinci kart var) | **6** |
| **Koyu banner'ı olmayan** sayfalar | **3** |
| **TOPLAM** | **60** = depodaki sayfa sayısı ✅ |

**Önceki sayım 51 idi (47 + 4) ve 9 sayfayı hiç saymıyordu.** Bu turda 9'unun
da nereye ait olduğu karara bağlandı.

## R2.1 · LİSTE ailesi — 47 sayfa, yayılım **0 px**

Ölçülen tekil yükseklik değeri: **344 px** (47/47).

| # | Sayfa | Banner sınıfı | H |
|---|---|---|---|
| 1 | `aktivite-gunlugu-v1` | `.lib-top` | 344 |
| 2 | `antrenorler-v1` | `.lib-top` | 344 |
| 3 | `arama-fit-v1` | `.fs-top` | 344 |
| 4 | `bagli-uygulamalar-v1` | `.lib-top` | 344 |
| 5 | `bildirimler-v1` | `.lib-top.nt-top` | 344 |
| 6 | `challenge-merkezi-v1` | `.lib-top` | 344 |
| 7 | `destek-talepleri-v1` | `.lib-top` | 344 |
| 8 | `egzersiz-kutuphane-v1` | `.lib-top` | 344 |
| 9–12 | `enerji-defteri-v1` · `-dengele-` · `-su-` · `-haftalik-` | `.lib-top.fp-top` | 344 |
| 13–21 | `fit-planim-v1` · `-programim-` · `-gecmis-` · `-ilerleme-` · `-kaydettiklerim-` · `-randevular-` · `-rozetler-` · `-saglik-profil-` · `-veri-izin-` | `.lib-top.fp-top` | 344 |
| 22 | `fit-testi-sonuc-v1` | `.lib-top` | 344 |
| 23 | `fit-testleri-v1` | `.lib-top` | 344 |
| 24 | `hakkimizda-v1` | `.lib-top` | 344 |
| 25–33 | `hareket-bolgeye-gore-v1` · `-dogru-form-` · `-hedefe-gore-` · `-isinma-soguma-` · `-masa-basi-` · `-merkezi-` · `-rehberi-` · `-sozluk-` · `-sureye-gore-` | `.lib-top` | 344 |
| 34 | `hareket-yeni-baslayanlar-v1` | `.lib-top` | 344 |
| 35 | `hesabim-v1` | `.lib-top` | 344 |
| 36 | `iletisim-v1` | `.lib-top` | 344 |
| 37 | `pro-odeme-v1` | `.lib-top` | 344 |
| 38 | `pro-v1` | `.lib-top` | 344 |
| 39 | `program-liste-v1` | `.lib-top` | 344 |
| 40 | `programlar-merkezi-v1` | `.lib-top` | 344 |
| 41 | `reklam-ver-v1` | `.lib-top` | 344 |
| 42 | `rozetler-v1` | `.lib-top` | 344 |
| 43 | `saglik-bilgilendirme-v1` | `.lib-top` | 344 |
| 44 | `sss-v1` | `.lib-top` | 344 |
| 45 | `uyelik-faturalandirma-v1` | `.lib-top` | 344 |
| 46 | `video-seanslari-v1` | `.lib-top` | 344 |
| 47 | `yasal-v1` | `.lib-top` | 344 |

## R2.2 · DETAY ailesi — 4 sayfa, yayılım **0 px**

Ölçülen tekil yükseklik değeri: **384 px** (4/4).

| # | Sayfa | Banner sınıfı | H | Not |
|---|---|---|---|---|
| 1 | `destek-talebi-detay-v1` | `.lib-top` | 384 | — |
| 2 | **`egzersiz-detay-v1`** | **`.ed-top`** | **384** | **BU TURDA AİLEYE ALINDI** — önce 216.3 px'ti ve hiçbir ailede sayılmıyordu |
| 3 | `fit-testi-detay-v1` | `.lib-top` | 384 | — |
| 4 | `video-seans-detay-v1` | `.lib-top` | 384 | — |

> **BEKLENMEDİK BULGU B3 — `egzersiz-detay-v1` iki ayrı kuralın dışında kalmış.**
> `.ed-top` diğer koyu banner'larla **birebir aynı dili** kullanıyor (aynı radial
> yeşil + üç katman + fotoğraf + `#1b1913` taban) ama:
> (a) `fit-shell.js`'in **over-mode listesinde yoktu** → header koyu görselin
> üstünde **KATI** kalıyordu; bu, `KARARLAR.md` **K11**'in beş sınıf için
> düzelttiği kusurun aynısı, altıncı sınıfta kalmış.
> (b) Sabit yükseklik kuralının dışındaydı → **216.3 px**, detay ailesinin
> 384 px'inden **167.7 px** sapma.
> Sayfa `DETAY_PAGES` dizisinde **vardı**, yani "detay" işaretini alıyordu —
> ama CSS o işareti yalnız `.lib-top` ve `.cp-top` için okuyordu.
> **Düzeltildi:** `.ed-top` over-mode listesine ve detay ailesine alındı.
> Ölçüm: **384 px** · over-mode **1** · kırıntı `top=135` > header alt kenarı
> `112` (örtüşme yok) · taşma **0** · `page-check` 1440 ve 390'da **temiz**.

## R2.3 · Hiçbir aileye girmeyen 9 sayfa — karar verildi

### (a) İMZA banner'ları — 6 sayfa, **sabit kutunun DIŞINDA kalıyor**

Ortak özellik: **banner'ın içinde ikinci bir kart var** (randevu kartı, arama
kartı, kayıt formu, program medyası, challenge sayacı). Sabit kutuya sığmıyorlar
ve kırpmak içerik kaybı olur. 3. tur bu kuralı zaten koymuştu; bu turda `.cp-top`
da eklendi (K22).

| Sayfa | Banner | Ölçülen H | İçindeki ikinci kart |
|---|---|---|---|
| `dadafit-hub-v1` | `.df-top` | **900** | tam-ekran perde (100dvh) — K15 |
| `challenge-v1` | `.chl-hero` | **697.1** | challenge zaman/sayaç bileşeni |
| `dadafit-kopru-v1` | `.kp-top` | **613.6** | kardeş ürün geçiş kartı |
| `antrenor-ol-v1` | `.ol-top` | **602.2** | başvuru fayda paneli |
| `program-detay-v1` | `.pd-hero` | **570.4** | program medya kartı |
| **`antrenor-detay-v1`** | `.cp-top` | **477.2** | **randevu kartı** — bu turda çıkarıldı (K22) |

### (b) Koyu banner'ı OLMAYAN 3 sayfa — aile dışı kalıyor

| Sayfa | Üst bölüm | Neden aile dışı |
|---|---|---|
| `index.html` | `.px` (1483.7) | Prototip **site haritası** — ürün sayfası değil, araç sayfası. Kabuk banner'ı taşımıyor, taşımamalı. |
| `giris-v1.html` | `.au-top` (1317) | **Kimlik kapısı** — iki kolonlu tam sayfa giriş/kayıt düzeni. Banner değil, form perdesi. |
| `profil-v1.html` | `.pf-top` (689.7) | **Beyaz profil kapağı** — kapak görseli + avatar + istatistik. Koyu banner ailesiyle aynı dil değil; sosyal profil deseni. |

**Karar:** üçü de hiçbir banner ailesine alınmıyor; gerekçe `KARARLAR.md` **K23**.

## R2.4 · ÖLÇÜM — kapanış

| Ölçüm | Sonuç |
|---|---|
| Depodaki sayfa | **60** |
| Sınıflandırılan sayfa | **60** — eşit ✅ |
| Liste ailesi yayılımı | **0 px** (47 sayfanın 47'si 344) ✅ |
| Detay ailesi yayılımı | **0 px** (4 sayfanın 4'ü 384) ✅ |
| Banner içi kırpma (@1440, 59 banner) | **0** ✅ |
| `egzersiz-detay-v1` `page-check` | 1440 ve 390 **temiz** ✅ |

# R3 — BREADCRUMB ANA SAYFA İKONU

**Beyar:** *"Banner'ın breadcrumb'ındaki ana sayfa logosu. DadaFit zaten ana
sayfa, ana sayfa logo şeklinde olacak. Kardeş markalarda ana sayfa ikonları daha
kompakt. Büyük yapma ve DadaFit'i ayrıca yazma, sadece ikon olacak orada."*

## R3.1 · Uygulama

Kırıntının ilk kalemi artık **yalnız ikon**; metin ekran okuyucuya bırakıldı:

```html
<a href="dadafit-hub-v1.html" class="crumb-home">
  <i class="fa-solid fa-house" aria-hidden="true"></i>
  <span class="sr-only">DadaFit ana sayfa</span>
</a>
```

| Kaynak | Kalem | Nasıl |
|---|---|---|
| 44 HTML dosyası | 44 kırıntı bağı | dört yazım varyantı tek kalıba çevrildi (`DadaFit` · `DadaFit Ana Sayfa` · ikisinin `aria-hidden`lı hâlleri) |
| `assets/js/fit-shell.js` | Fit Planım kabuğunun **ürettiği** kırıntı | 13 sayfayı birden besliyor (`fit-planim-*` + 4 Enerji Defteri) — HTML taramasında görünmüyordu |
| `profil-v1.html` | `.pf-crumb` | ikonu **hiç yoktu**, düz metindi; ikon eklendi |
| `assets/css/fit-shell.css` | boyut + renk tek kaynağa | aşağıda |

## R3.2 · ÖLÇÜM

| Ölçüm | Sonuç |
|---|---|
| Kırıntısı olan sayfa | **59** (`index.html`'de kırıntı yok) |
| İlk kalemde **metin düğümü** kalan sayfa | **0** — DOM'dan `childNodes` süzülerek sayıldı ✅ |
| Erişilebilir ad var mı | **58/58** sayfada `"DadaFit ana sayfa"` ✅ |
| `.sr-only` gerçekten görünmez mi | kutu ölçüsü **1 × 1 px** (58/58) ✅ |
| Bağın toplam genişliği | **14.6 px** = ikonun kendisi (metin genişlik katmıyor) ✅ |
| İkon yüksekliği ↔ satır yüksekliği | **13 px ≤ 19.4 px** — 58/58 sayfa ✅ |
| İkon boyutu tekil değer | **13 px** (58/58) |
| İkon rengi tekil değer | **2 değer, ikisi de kasıtlı:** koyu banner'da `rgb(52,196,126)` (56 sayfa) · açık zeminde `rgb(0,122,61)` (2 sayfa) |
| Kontrast | koyu banner **7.82:1** · `profil-v1` **5.45:1** · `giris-v1` **5.18:1** — üçü de AA üstü ✅ |
| `page-check` | 7 sayfa × 2 genişlik = **14/14 temiz** ✅ |

> **BEKLENMEDİK BULGU B4 — kırıntı ikonu beş farklı boyut ve beş farklı renkteymiş.**
> Ölçüm öncesi: boyut `.lib-crumb` **13 px** · `.cp-crumb` **12 px** ·
> `.ed-crumb` **12.5 px** · `.rd-crumb`/`.kp-crumb` **9 px`.
> Renk: `rgba(255,255,255,.72)` · `rgb(52,196,126)` · `rgb(199,199,199)` ·
> `rgba(255,255,255,.34)` · `rgb(169,205,185)`.
> En kötüsü `antrenor-ol-v1`: **%34 alfa beyaz**, koyu banner üzerinde ve metin
> kalkınca sayfadaki **tek** ana sayfa bağı. İkisi de kabukta tek kaynağa çekildi.

**İstisna — `dadafit-hub-v1` (1 sayfa):** kırıntısının ilk kalemi
`Dada Gastro › DadaFit`, yani **kardeş marka portalı**, DadaFit ana sayfası değil
(sayfanın kendisi DadaFit ana sayfası). Ev ikonuna çevrilmesi yanlış olurdu;
bilerek dokunulmadı.

**Kalıntı taraması (3 varyant, eşleşmeler gözle doğrulandı):**
`fa-house` + metin → 12 eşleşme, **hepsi filtre çipi** ("Evde Antrenman" ·
"Ekipmansız") · `dadafit-hub-v1.html` bağı + metin → 2 eşleşme, **ikisi de gövde
düğmesi** ("Ana Sayfaya Dön") · kırıntı içinde düz `DadaFit` metni → **0**.

**Ekran görüntüsü:** `scratchpad/shots/r3-*.png` (5 sayfa, kırıntı kırpması)
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
