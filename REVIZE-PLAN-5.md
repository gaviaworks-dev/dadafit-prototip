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
| **R11** | Footer üstündeki perde footer'dan kopuk | ⏳ |
| **R12** | Breadcrumb ana sayfa ikonu referansa göre iri | ⏳ |
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
# R12 — BREADCRUMB ANA SAYFA İKONU
# R15 — BANNER STANDARDI
# R13 — "PROGRAMINI BUL" TAM SAYFA
# H1 — SPOR SÖZLÜĞÜ
# H2 — ANATOMİ / KAS HARİTASI
# H3 — ANTRENMAN OLUŞTURUCU

---

# BEKLENMEDİK BULGULAR

_(tur boyunca doldurulur)_
