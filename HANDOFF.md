# DEVİR NOTU — REVİZE TURU 5 (yarıda)

**Tarih:** 20.08.2026 · **Taban commit:** `44633fb` · **Son commit:** `a1c61e9`
**Plan:** `REVIZE-PLAN-5.md` · **Brief:** Beyar'ın `REVIZYON-5-2.md` dosyası
**Kararlar:** `KARARLAR.md` (bu turda **K29–K31**)
**Önceki tur:** `REVIZE-PLAN-4.md` (4. tur devir notu git geçmişinde, `44633fb`)

---

## ÖZET SATIRI

| | Sonuç |
|---|---|
| **Revizyon maddeleri** | **R11 · R12 · R14 · R15 → 4/5 tamam.** R13 başlamadı |
| **Yeni modüller** | **H1 · H2 · H3 → 0/3 başlamadı** |
| **Tam site taraması** | **60/60 sayfa HTTP 200** · 6.455 bağlantı · kırık **0** · kırık çapa **0** · 4xx **0** · konsol hatası **0** · yatay taşma **0** |
| **Test süiti** | **8/8 temiz** — bu turda **üç yeni sınama** yazıldı, üçü de taban commit'te kırmızıya döndüğü görüldü |
| **Working tree** | temiz |
| **Push** | ❌ **YAPILMADI** — 4 commit lokalde |

---

## 1 · MADDE DURUMU

| # | Konu | Durum | Kanıt |
|---|---|---|---|
| **R14** | Fit testi cevap kilidi | ✅ | 7 slug × 2 genişlik · kilitli şık **0/14 → 14/14** · riskli yanıt geri alınamıyor · "kapı hâlâ açılıyor mu" karşı-kontrolü geçiyor |
| **R11** | Footer perdesi | ✅ | `margin-bottom − footer` **11 farklı değer → 0** (59/59) · **sağlık şeridi 0/59 → 59/59 görünür** |
| **R12** | Kırıntı ev ikonu | ✅ | 13 px → **9 px** · kutu 10.1×9 · ayraçla eşit · boşluk 9 px — 58/58, referansla birebir |
| **R15** | Banner standardı | ✅ | @1440 LİSTE **49×544** · DETAY **6×560** · @390 **49×587** / **6×726** · kırpma **0/59** |
| **R13** | "Programını Bul" tam sayfa | ⛔ **başlamadı** | — |
| **H1** | Spor Sözlüğü (~180 terim) | ⛔ **başlamadı** | — |
| **H2** | Anatomi / kas haritası | ⛔ **başlamadı** | — |
| **H3** | Antrenman Oluşturucu | ⛔ **başlamadı** | — |

---

## 2 · BU TURDA ÖLÇÜLEN REFERANS DEĞERLERİ — tekrar ölçmeye gerek yok

`dadadiet.com`, Playwright, üç genişlik. **İki bağımsız liste sayfası her
genişlikte birebir aynı çıktı** — değerler tesadüf değil tasarım sabiti.

### Banner yüksekliği
| Genişlik | `/beslenme` | `/diyetisyenler` | `/beslenme-rehberi/dengeli-tabak` |
|---|---|---|---|
| 1440 | **544** | **544** | **560** |
| 1024 | **607** | **607** | **617** |
| 390 | **587** | **587** | **726** |

### Banner iç ölçüleri (@1440 `/beslenme`)
`padding-top` **128 px** · `padding-bottom` 46 px ·
h1 **42px / 47.04 lh / 700 / −1.26 ls** · alt metin 16px/24.8 ·
istatistik şeridi 16px/24.8 · CTA yüksekliği 50.5 · **CTA sol = h1 sol (fark 0)** ·
blok sırası **kırıntı → eyebrow → H1 → alt metin → istatistik → CTA**

### Kırıntı (@1440 ve @390 aynı)
ev ikonu **9 px** · kutu **10.1 × 9** · chevron ayracı da **9 px (eşit)** ·
ikon→ayraç **9 px** · kırıntı 13px/20.15 lh · gap 9 px
*(referansın kendi tutarsızlığı: bir rehber detayında 13 px — iki sayfa 9 px olduğu için 9 alındı)*

### Footer perdesi
footer `fixed` z1 · `main` `relative` z2 · `main.margin-bottom` = footer yüksekliği ·
sayfa sonunda perde boşluğu **−0.3 px (yapışık)** · @390 perde kipi **kapalı**

### Sihirbaz sayfası — R13 için hazır
`/diyetisyen-bul`: banner `.wzp-top` **434 px** (@1024 427 · @390 455) ·
`padding-top` 128 · h1 40px/44.8/−1.2 · istatistik şeridi 3 kalem

---

## 3 · SONRAKİ OTURUMUN İLK ADIMLARI

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -3 && git status --short
python3 -m http.server 8811 &
export PW_HOME=~/.pw
for t in a11y-focus coach-list dropdown-position header-banner plan-account \
         fit-test-lock footer-curtain crumb-home; do node tests/$t.mjs; done   # 8/8 bekleniyor
```

**Sıra (brief §4):** R13 → H1 → H2 → H3.

- **R13** en hazır olanı: referans iskeleti §2'de ölçülü duruyor, banner token'ı
  (R15) oturdu. Yeni sayfa `programini-bul-v1.html`, overlay JS'i silinecek.
  Sihirbaz motoru `fit-shell.js` içinde hazır (altı soru + sonuç + "Seçimlerin"
  + "Bu öneri nasıl kuruldu" blokları 4. turda eklendi) — tam sayfaya taşınacak.
- **H2 erken başlamalı** (en uzun kalem): `/Users/gaviaworks/Desktop/Dada Fit
  Sources/Muscle.pdf` (23 MB) yerelde duruyor; `pdftotext` · `pdfinfo` ·
  `pdfimages` · `pdftoppm` kurulu ve çalışıyor. SVG **sıfırdan** çizilecek.
- **H3** Playwright keşfi H2'ye paralel yürüyebilir; `tasks/H3-MUSCLEWIKI-AKIS.md`
  yazılmadan koda başlanmayacak (brief'in şartı).

---

## 4 · BU TURUN BEKLENMEDİK BULGULARI

| # | Bulgu |
|---|---|
| **B10** | **Sağlık ve güvenlik şeridi masaüstünde HİÇ GÖRÜNMÜYORDU.** `.fit-health` perdenin (`#pageMain`) dışında, `position:static` basılıyordu; `z-index:1` taşıyan sabit footer'ın altına boyanıyordu. Her sayfada basılan sağlık uyarısı, durma kriterleri ve kontrol eden uzman bilgisi 60 sayfada görünmezdi. Ekran görüntüsüyle doğrulandı. |
| **B11** | **Kabukta paneli banner'a GERİ TAŞIYAN bir mekanizma varmış.** `.fit-band-panel` içeriği ≥641 px'te hero ızgarasına geri taşınıyordu. Markup'tan paneli çıkarmak **yetmiyordu** — JS geri alıyordu. Sabit banner kutusuyla taşma üretiyordu. |
| **B12** | `.pd-hero`'daki `align-items:flex-end`, sabit kutuda içeriği **şeffaf header'ın altına** kaydırıyordu (kırıntı top=96 < header 113). Kalite kapısı yakaladı. |
| **B13** | Referansın **kendi içinde tutarsızlığı** var: kırıntı ev ikonu iki sayfada 9 px, bir sayfada 13 px. Körlemesine değil, çoğunluk + Beyar'ın tarifiyle karar verildi. |

---

## 5 · BEYAR'A AÇIK SORULAR

### Bu turdan yeni
| # | Soru |
|---|---|
| **S-G** | `antrenor-detay` (h1 sol kenarı 348) ve `program-detay` (165) — başlığın yanında portre/medya var, bu yüzden h1 132'de değil. Bu iki banner da tam tek kolona çekilsin mi? |
| **S-H** | Ana sayfa perdesi (`dadafit-hub`, 900 px) aileye **alınmadı** — 3. turda Beyar *"ana sayfa herosunu bozmuşsun, düzelt"* demişti (K15). Brief R15.3 onu da listeliyor. Girsin mi? "Evet" ise tek satır yeter. |

### Brief'te zaten açık olanlar
| # | Soru |
|---|---|
| **S-C** | `video-seanslari`'ndaki "Seans Kütüphanesi" başlığında ne rahatsız ediyor — kelime mi, tipografi/konum mu, banner başlığıyla çakışma mı? *(R15.4'ü bekletiyor)* |
| **S-F** | Sözlük · anatomi · antrenman oluşturucu menüye nasıl girsin? Öneri: tek kalem ("Hareketi Anlamak"), menü 3 kalemde kalır. |

### 4. turdan devreden
| # | Konu | Durum |
|---|---|---|
| **S1** | Kart PRO rozetleri — rozet mi kalksın, filtre ekseni mi geri gelsin? | 🔴 açık |
| **S2** | "140+ hareket" — gerçek 12 | 🔴 açık |
| **S4** | `.btn-fit` kontrastı **3.54:1** (AA altı), `--fit-deep` 5.45:1 | 🔴 açık |
| ~~S5~~ | İmza banner'ları | ✅ **R15 ile kapandı** (biri hariç → S-H) |

---

## 6 · KALICI KURALLAR

1. Ortak bileşen sayfa sayfa kopyalanmaz — kabuktan yönetilir.
2. **Ölçmeden "düzeldi" denmez.** İki kez ölç.
3. Bir test, **kırmızıya döndüğü görülmeden** yeşil sayılmaz.
4. **Push her seferinde ayrı izin ister.**
5. Mevcut tasarım dili korunur.
6. Alt ajan commit atmaz.
7. Font Awesome PRO ikonu kullanılmaz.
8. Durum özniteliğini **etkileşimden sonra** ölç.
9. Metin değişiminde hedefin JS dizesi içinde olup olmadığına bak.
10. **Taşma dört kenardan** ölçülür.
11. Bir sınama kırmızı verdiğinde **önce taban commit'e karşı koştur** — bayat test mi, gerçek gerileme mi?
12. Flex satır yüksekliği öğenin **marjlı dış ölçüsünden** hesaplanır.
13. **"Kırık bağlantı yok" ≠ "doğru yere gidiyor"** (K28).
14. **YENİ:** Referanstan **ölçü ve iskelet** alınır, **palet alınmaz** (K29).
15. **YENİ:** Markup'tan bir şeyi çıkarmak yetmez — **kabuk JS'i geri taşıyor olabilir** (B11).
16. **YENİ (K27 uygulandı):** her kabul ölçütü `tests/*.mjs` süitine yazılır ve
    **taban commit'e karşı kırmızıya döndüğü kanıtlanır.**

---

## 7 · BU TURUN COMMİT'LERİ

| # | Hash | Özet |
|---|---|---|
| 1 | `8b5921a` | **R14** — fit testi yanıtı ilk tıklamada kilitleniyor |
| 2 | `a847f40` | **R11** — perde footer'a oturdu, sağlık şeridi ilk kez görünüyor |
| 3 | `7fdc7e3` | **R12** — kırıntı ev ikonu 13 px iken 9 px |
| 4 | `a1c61e9` | **R15** — banner standardı, referanstan 544/560 |

**Taban:** `44633fb`. **Hiçbiri push edilmedi.**

**Yeni sınamalar:** `tests/fit-test-lock.mjs` · `tests/footer-curtain.mjs` ·
`tests/crumb-home.mjs` — üçü de taban commit'te kırmızıya dönüyor, HEAD'de yeşil.
