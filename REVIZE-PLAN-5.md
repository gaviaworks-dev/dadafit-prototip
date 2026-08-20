# REVİZE PLAN 5 — DadaFit prototip, beşinci revizyon turu

**Taban commit:** `44633fb` · **Kaynak brief:** `REVIZYON-5-2.md` (Beyar)
**Önceki tur:** `REVIZE-PLAN-4.md` · **Devir notu:** `HANDOFF.md` · **Kararlar:** `KARARLAR.md` (K29–)

**Referans marka:** `dadadiet.com` (banner · breadcrumb · sihirbaz) ·
`dadagastro.com/mutfak-sozlugu` (sözlük) · `musclewiki.com/tr-tr` (etkileşim deseni)
**Yerel kaynak:** `/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf` (23 MB)

---

## Kalıcı kurallar (4. turdan devam)

| Kural | İçerik |
|---|---|
| **ÖLÇÜM** | "Düzeldi" demeden önce ölç, iki kez ölçmeden rapor verme. Kaydırılmış durumda da ölç. **Taşma dört kenardan ölçülür.** |
| **GÖRÜNÜRLÜK** | `offsetHeight > 0` **ve** viewport içinde mi — ekran görüntüsü al. |
| **ÇAPA** | Her çapa için temiz context. |
| **TARAMA** | ≥3 varyant; yanlış alarmları gözle ayıkla ve raporda belirt. |
| **KABUK** | `assets/js/fit-shell.js` · `assets/css/fit-shell.css` · `assets/css/fit-type.css` → yalnız ana oturum yazar. |
| **REFERANS** | Referans = **ölçü + iskelet**. Renk token'ı, tema değişkeni, global tipografi paleti kopyalanmaz. *(R15.1 bu kuralın kapsamını daraltıyor — bkz. K29.)* |
| **DOĞRULAMA** | Kimse kendi işini onaylamaz. **K27 uygulanıyor:** kabul ölçütleri `tests/*.mjs` süitine çevriliyor. |
| **COMMIT** | Her madde ayrı commit. Push ayrı izin ister. |
| **BELİRSİZLİK** | En iyi seçeneği seç → `KARARLAR.md` → devam. |
| **SLUG** | "Kırık bağlantı yok" ≠ "doğru yere gidiyor". Slug taşıyan listelerde ad eşleşmesi ayrıca ölçülür (K28). |

## Ölçüm ortamı

```
http://localhost:8811                                  → çalışma ağacı
https://gaviaworks-dev.github.io/dadafit-prototip      → canlı
PW_HOME=~/.pw · NODE_PATH=~/.pw/node_modules           → playwright-core 1.62.1
scratchpad/m/*.mjs                                     → ölçüm script'leri
```

---

## Madde durumu

| # | Konu | Durum |
|---|---|---|
| **R14** | Fit testi cevap mantığı kilitlenmiyor | ✅ **tamam** |
| **R11** | Footer üstündeki perde footer'dan kopuk | ✅ **tamam** |
| **R12** | Breadcrumb ana sayfa ikonu referansa göre iri | ✅ **tamam** |
| **R15** | Banner standardı — tek kural, imza banner'ları kalkıyor | ⏳ |
| **R13** | "Programını Bul" sihirbazı kendi sayfası olsun | ⏳ |
| **H1** | Spor Sözlüğü (~180 terim) | ⏳ |
| **H2** | İnteraktif anatomi / kas haritası | ⏳ |
| **H3** | Antrenman Oluşturucu | ⏳ |

---

# R14 — FİT TESTİ CEVAP MANTIĞI

**Beyar:** *"Bir seçenek tıklandığında yanlış olduğu gösteriliyor, ama diğer
seçenekler hâlâ tıklanabiliyor. Yani kullanıcı yanlışı gördükten sonra doğruyu
da tıklayıp puanını değiştirebiliyor."*

## R14.0 · Tespit — sorun nerede

Yedi fit testinin hepsi **tek sayfayı** kullanıyor
(`fit-testi-detay-v1.html?test=<slug>`), yani hata tek yerde. "Yanlış gösterilen
şık" **uygunluk taramasının** riskli yanıtı: `data-risk="1"` taşıyan "Evet"
seçeneği kehribar renge dönüyor ve test durduruluyor.

**Ölçüldü — 7 slug'ın 7'sinde aynı:**

| Ölçüm | Değer |
|---|---|
| Toplam şık | **14** (7 soru × 2) |
| Yanıt sonrası **kilitli** şık | **0** |
| Riskli yanıt geri alınabiliyor mu | **evet** |
| Geri alındıktan sonra test açılıyor mu | **evet** |

Yani **güvenlik kapısı kapı değildi.** Kullanıcı "kalp rahatsızlığım var" deyip
testin durduğunu görüyor, sonra "Hayır"a basıp taramayı yeniden gönderiyor ve
test açılıyordu.

> Depoda başka bir doğru/yanlış sınavı **yok** — `data-dogru` / `is-correct`
> benzeri işaret taraması **0** döndü. Diğer sayfalardaki radyo düğmeleri
> (`antrenor-detay` 3 · `video-seans-detay` 4 · `profil` 6) ayar ve randevu
> formları, sınav değil. R14 tek sayfada kapanıyor ama **yedi slug'ı birden**
> etkiliyor.

## R14.1 · Uygulanan davranış — Beyar'ın beş maddesi

| # | İstenen | Uygulanan |
|---|---|---|
| 1 | İlk tıklama cevabı **kilitler** | `change` olayında o sorunun iki şıkkı da kilitlenir |
| 2 | Seçilen işaretlenir; yanlışsa **doğru şık da gösterilir** | Riskli yanıtta güvenli şık `.ft-opt.is-safe` alır: kesikli yeşil çerçeve + **"Temiz yanıt"** etiketi |
| 3 | Şıklar `disabled` + `aria-disabled` + odak dışı | **Üç katman birden** — biri eksikse test kırmızıya döner |
| 4 | Geri dönüp cevap değiştirilemez | Kilit kalıcı; ikinci tıklama seçimi değiştirmiyor |
| 5 | "Baştan çöz" sıfırlar | "Taramayı sıfırla" kilidi **üç katmanıyla** kaldırır, kilit mesajını ve "Temiz yanıt" işaretini siler |

**Kilit neden üç katmanlı:** yalnız görsel kilit kilit değildir. `disabled`
tıklamayı ve klavye seçimini bitirir · `aria-disabled` ekran okuyucuya durumu
duyurur · `tabindex="-1"` odak sırasından çıkarır. Ayrıca `disabled` bir radyoyu
`:checked` olmaktan **çıkarmaz**, bu yüzden gönderim mantığı (`input:checked` +
`data-risk`) hiç değişmeden çalışıyor.

**Metin de değişti:** tarama başlığına *"Her soruyu bir kez yanıtlarsın — yanıt
kilitlenir. Değiştirmen gerekirse 'Taramayı sıfırla' ile baştan başla."* eklendi.
Kilit sürpriz olmamalı.

## R14.2 · ÖLÇÜM — 7 slug × 2 genişlik

| Ölçüm | ÖNCE | SONRA |
|---|---|---|
| Kilitli şık | **0 / 14** | **14 / 14** ✅ |
| Odak sırasından çıkan şık | 0 / 14 | **14 / 14** ✅ |
| İkinci tıklama seçimi değiştiriyor mu | **evet** | **hayır** — `"evet"` → `"evet"` ✅ |
| Riskli yanıtta güvenli şık işaretli | yok | **var** (`.ft-opt.is-safe`) ✅ |
| Riskli yanıtla test açılıyor mu | — | **hayır** ✅ |
| Riskli yanıt geri alınabiliyor mu | **evet → test açılıyordu** | **hayır — test kapalı kalıyor** ✅ |
| Sıfırlama sonrası kilitli / seçili / kilit mesajı | — | **0 / 0 / 0** ✅ |
| **Kapı hâlâ çalışıyor mu** (7 yanıt temizse test açılıyor mu) | — | **evet** ✅ |
| JS istisnası | — | **0** |
| Sonuç | — | **@1440 7/7 · @390 7/7** |

`page-check`: 1440 ve 390'da **temiz**.
**Ekran görüntüsü:** `scratchpad/shots/r14-1440.png` · `r14-390.png`

## R14.3 · K27 uygulandı — kabul ölçütü artık bir SINAMA

`tests/fit-test-lock.mjs` yazıldı. Beyar'ın beş maddesinin hepsini ve "kapı hâlâ
açılıyor mu" karşı-kontrolünü koşturuyor.

> **Sınama kırmızıya döndüğü GÖRÜLDÜ.** Taban commit (`44633fb`) sunulup aynı
> sınama koşuldu: *"şıkların hepsi odak sırasından çıkmadı: 0/14"* ·
> *"riskli yanıta rağmen test adımları açıldı"* · *"riskli yanıt GERİ ALINDI ve
> test açıldı — R14 kapısı delik"*. HEAD'de **0 sorun**. 4. turun B8 dersi
> (sessizce kırmızı süit) tekrar etmiyor.

# R11 — FOOTER PERDESİ

**Beyar:** *"Footer'ın hemen üstündeki perde/geçiş katmanı DadaFit'te fazla yukarı
çıkıyor ve footer'dan kopuk duruyor. Diğer markalarda perde footer'a yapışık."*

## R11.0 · Referans ölçümü — dadadiet.com

Perde mekanizması **iki markada da aynı**: footer `position:fixed; z-index:1`,
`main` `position:relative; z-index:2` ve `main`e footer yüksekliği kadar
`margin-bottom` verilir; kaydırma sonunda içerik kalkar, footer alttan çıkar.

| Ölçüm @1440, sayfa sonunda | DadaDiet | DadaFit (önce) |
|---|---|---|
| footer konumu / z-index | `fixed` / 1 | `fixed` / 1 |
| `main` konumu / z-index | `relative` / 2 | `relative` / 2 |
| `main` `margin-bottom` | 612 px | 440 px |
| footer yüksekliği | 612.2 px | 439.5 px |
| **perde boşluğu** (`main.bottom − footer.top`) | **−0.3 px** *(yapışık)* | **−310.3 px** *(kopuk)* |

@390'da iki markada da perde kipi **kapalı** (footer normal akışta) — o yüzden
mobil için ayrı bir hedef yok.

## R11.1 · Kök neden — ölçümle bulundu

Fark `margin-bottom` değerinde değil (ikisi de footer yüksekliğine eşit),
**perdenin neyi içerdiğinde.**

`body`nin çocukları sıralandığında görüldü: **`<section class="fit-health">`
(310 px) `#pageMain`'in DIŞINDA**, footer'dan hemen önce basılıyordu
(`ftr.parentNode.insertBefore(sec, ftr)`).

Bunun **iki** sonucu vardı:

1. **Beyar'ın gördüğü kopukluk.** Perde `main`de bitiyor, `margin-bottom`
   boşluğu açılıyor, sonra 310 px'lik şerit o boşluğun **altına** düşüyor.
   Perdenin alt kenarı footer'ın üstünden **310 px** yukarıda kalıyor →
   ölü gri şerit.
2. **BEKLENMEDİK BULGU B10 — sağlık ve güvenlik şeridi masaüstünde HİÇ
   GÖRÜNMÜYORDU.** Şerit `position:static` (z-index `auto`); `z-index:1`
   taşıyan **sabit** footer'ın altına boyanıyor. Ölçüldü: şerit belge
   konumu 2325–2635, sayfa sonunda viewport'ta 590–900, footer 460.5–900 →
   **tamamen footer'ın arkasında.** Yani her sayfada basılan sağlık uyarısı,
   durma kriterleri, hazırlayan/kontrol eden uzman ve son kontrol tarihi
   masaüstünde kimseye görünmüyordu. Ekran görüntüsüyle doğrulandı.

## R11.2 · Düzeltme

| # | Değişiklik | Neyi çözer |
|---|---|---|
| 1 | Sağlık şeridi `#pageMain`'in **son çocuğu** olur (`perde.appendChild(sec)`); `#pageMain` yoksa eski davranış korunur | Şerit perdenin içine girer → hem görünür olur hem `margin-bottom` doğrudan footer'a dayanır |
| 2 | `main.style.marginBottom` artık `foot.offsetHeight` yerine `foot.getBoundingClientRect().height` | `offsetHeight` tam sayıya yuvarlıyor (439.5 → 440) ve boşluk 0.1–1 px sapıyordu; 59 sayfada **11 farklı değer** üretiyordu |

İkisi de **kabukta**, sayfa sayfa yama yok.

## R11.3 · ÖLÇÜM

Kaydırma konumu tarayıcıda tam sayıya yuvarlandığı için ölçüm **kaydırmadan
bağımsız** iki değişmezden okundu.

| Ölçüm | ÖNCE | SONRA |
|---|---|---|
| `margin-bottom` − footer yüksekliği @1440 | 11 farklı değer | **0 — 59 sayfanın 59'unda tek değer** ✅ |
| Perdeden sonra kalan kuyruk @1440 | **310.3–310.5 px** | **0** (\|kuyruk\| ≤ 1 px) ✅ |
| Sağlık şeridi perdenin içinde @1440 | **0 / 59** | **59 / 59** ✅ |
| Sağlık şeridi **görünür** @1440 | **0 / 59** | **59 / 59** ✅ |
| @390 perde kipi | kapalı | kapalı (değişmedi) · şerit perdenin içinde **59/59** ✅ |
| Referansla fark | −310.3 vs −0.3 | **aynı davranış** |
| `page-check` | — | 6 sayfa × 2 genişlik = **12/12 temiz** |

**Ekran görüntüsü:** `scratchpad/shots/r11-fit-alt.png` (önce — 310 px ölü gri
şerit, sağlık şeridi yok) · `r11-fit-sonra-alt.png` (sonra — şerit görünür,
footer'a yapışık) · `r11-diet-alt.png` (referans)

## R11.4 · K27 — kabul ölçütü sınamaya çevrildi

`tests/footer-curtain.mjs`. **Kırmızıya döndüğü görüldü:** taban commit
`44633fb`'de her sayfa için *"sağlık şeridi perdenin DIŞINDA — footer altında
kaybolur"* ve *"perdeden sonra 310.3 px kuyruk kaldı"* bildiriyor; HEAD'de
**0 sorun**.
# R12 — BREADCRUMB ANA SAYFA İKONU

**Beyar:** *"DadaFit'in `crumb-home` ikonu referansa göre iri; kırıntı satırının
ritmini bozuyor. İkon boyutu, optik ağırlığı ve ikon–ayraç boşluğu DadaDiet ile
eşitlensin. `.sr-only` erişilebilir ad korunacak."*

## R12.0 · Referans ölçümü — dadadiet.com

| Ölçüm @1440 **ve** @390 | `/beslenme` | `/diyetisyen-bul` | *(detay sayfası)* |
|---|---|---|---|
| Ev ikonu `font-size` | **9 px** | **9 px** | 13 px |
| Ev ikonu kutusu | **10.1 × 9** | **10.1 × 9** | 14.6 × 13 |
| Chevron ayracı `font-size` | **9 px** | **9 px** | 13 px |
| İkon → ayraç boşluğu | **9 px** | **9 px** | 3.3 px |
| İkon / satır yüksekliği oranı | **0.45** | **0.45** | 0.65 |

> **Referansın kendi içinde tutarsızlığı var:** liste ve sihirbaz sayfalarında
> 9 px, bir rehber detayında 13 px. Beyar "daha minimal ve compact" olanı
> gösterdiği ve üç sayfanın ikisi 9 px olduğu için **9 px alındı.**

**DadaFit'in önceki hâli:** ikon **13 px** (kutu 14.6 × 13), ayraç **9 px** —
yani ev ikonu **kendi ayracından %44 daha iri**. Referansta ikisi **eşit**.
Beyar'ın gördüğü ritim bozukluğu tam olarak bu.

## R12.1 · Uygulama

`assets/css/fit-shell.css` → `.crumb-home i{font-size:9px}` — **tek satır**,
58 sayfayı birden etkiliyor.

**RENK çekilmedi.** Referans `rgba(255,255,255,.4)` kullanıyor; DadaFit kendi
yeşilinde kaldı. Gerekçe: (a) kalıcı REFERANS kuralı ölçüyü alır, paleti almaz;
(b) bu, metni olmayan **tek** kırıntı kalemi — renk onu ayırt edilebilir kılan
şey; (c) 13 → 9 px küçülme optik ağırlığı zaten referans seviyesine indiriyor
(oran 0.67 → **0.46**, referans 0.45). Karar: `KARARLAR.md` **K29**.

## R12.2 · ÖLÇÜM — 58 sayfa × 2 genişlik

| Ölçüm | ÖNCE | SONRA | Referans |
|---|---|---|---|
| İkon `font-size` | 13 px | **9 px — 58/58 tek değer** ✅ | 9 px |
| İkon kutusu | 14.6 × 13 | **10.1 × 9 — 58/58 tek değer** ✅ | 10.1 × 9 |
| İkon ↔ ayraç boyut eşitliği | 13 ≠ 9 (**%44 iri**) | **eşit (9 = 9)** ✅ | eşit |
| İkon → ayraç boşluğu | 9 px | **9 px — 58/58** ✅ | 9 px |
| İkon / satır yüksekliği | 0.67 | **0.46** ✅ | 0.45 |
| **R3 garantisi** (metin düğümü 0 · erişilebilir ad · `.sr-only` 1 px · ikon ≤ satır) | — | **58/58 bozulmadı** ✅ | — |
| `page-check` | — | 4 sayfa × 2 genişlik = **8/8 temiz** | — |

**İstisna (brief'in söylediği gibi dokunulmadı):** `dadafit-hub-v1` kırıntısının
ilk kalemi **"Dada Gastro"** — kardeş marka portalı, DadaFit ana sayfası değil.

**Ekran görüntüsü:** `scratchpad/shots/r12-fit.png` ↔ `r12-diet.png`

## R12.3 · K27 — sınama

`tests/crumb-home.mjs` R3 **ve** R12 garantilerini birlikte koruyor.
**Kırmızıya döndüğü görüldü:** taban `44633fb`'de *"ikon yüksekliği 13 px —
referans 9 px"* ve *"ev ikonu (13) ile ayraç (9) aynı boyutta değil"*.
HEAD'de **0 sorun**.
# R15 — BANNER STANDARDI
# R13 — "PROGRAMINI BUL" TAM SAYFA
# H1 — SPOR SÖZLÜĞÜ
# H2 — ANATOMİ / KAS HARİTASI
# H3 — ANTRENMAN OLUŞTURUCU

---

# BEKLENMEDİK BULGULAR

_(tur boyunca doldurulur)_
