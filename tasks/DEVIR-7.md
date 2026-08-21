# DEVİR 7 — YENİ OTURUMUN TEK BİLGİ KAYNAĞI

**Depo:** `~/Developer/Projects/dadafit-prototip` · **Canlı:** `gaviaworks-dev.github.io/dadafit-prototip`
**R7 taban commit:** `1561739` · **K27 kırmızı ölçümünün tabanı:** `8bf5c66`
**Branch:** `main` · **Brief:** `tasks/REVIZYON-7.md` · **Kararlar:** `KARARLAR.md` (K1–K58)
**Önceki devir:** `tasks/DEVIR-6.md` — banner/footer/kabuk/anatomi ölçüleri **hâlâ orada**, yeniden ölçülmeyecek

> 9. oturum. Ajan çalıştırılmadı, kalemleri lead tek başına yürüttü.
> Yedi kalem kapandı; **madde 1 (`--sec-pad`) onay bekliyor, siteye yayılmadı.**

## Açılış komutları

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -5 && git status --short
python3 -m http.server 8811 &          # sınamalar AÇIK BASE ile koşturulur
export PW_HOME=~/.pw
gh auth status                         # aktif hesap gaviaworks-dev olmalı (K36)
```

> ⚠️ DEVIR-6'nın uyarısı geçerli: sınamaların bir kısmının varsayılanı `:8822`;
> base'i **elle ver** (`node tests/<ad>.mjs http://localhost:8811`).

---

# 1 · BİTENLER — R7'nin YEDİ KALEMİ

## A · Nöbetçi sınama (madde 7) — **K58**

`tests/hizalama-nobeti.mjs` yazıldı. B20'nin kör noktası kapandı: süitte
`text-align` ve `padding` ölçen nöbet yoktu.

| # | Ölçüt | Neyi tutar |
|---|---|---|
| 1 | **eşik aynası** (statik) | `--jt-min` ile `@container` sayısı ayrışamaz (B21'in nöbeti) |
| 2 | **opt-in sözleşmesi** | `.jt`/`.jt-flow` olmadan hiçbir eleman `justify` hesaplayamaz |
| 3 | **hesapsız dolgu** | bir `<p>`'nin dolgusunu **eşleşen** bir kural vermiş olmalı |
| 4 | **"sözünü tutuyor mu"** | `fit-type.css` vaadi, eşit/üstün özgüllükte olduğu her yerde computed'da tutmalı |

**Taban commit `8bf5c66`'da 4 SORUN** — eşik 30rem↔20rem ayrışık · opt-in
kancaları yok · **6 989 eleman** izinsiz justify · **4 606 eşleşmede** vaat
tutmuyor. Bugünkü ağaçta **0 sorun** (130 288 eleman · 3 946 paragraf ·
23 123 vaat eşleşmesi).

> **Ölçüt 4'ün ilk yazımı yanlıştı** ve 2385 sahte bulgu verdi: "vaat =
> computed" diyordu, ama `button{text-align:center}` (0,0,1) vaadinin
> `.wg-opt{text-align:left}` (0,1,0) gibi **daha özgül ve kasıtlı** sayfa
> kurallarınca devralınması normal basamaklanma. Ölçüt özgüllük
> karşılaştırmalı hâle getirildi; kırmızı olan yalnız **eşit ya da düşük**
> özgüllükte kaybetmek — R6'nın üç tuzağının üçü de o hâldi.

## B · `--tomato` → `--fit-*` (madde 3) — **K54**

Token #009d4f yani **yeşil** taşıyordu; ad gastro paletinden kalmıştı.
**Kritik bulgu: ikizi zaten vardı** — `--fit:#009d4f` ve `--fit-deep:#007a3d`
aynı dosyada ayrı bir `:root`ta duruyordu.

    --tomato       #009d4f  →  --fit       (ikizi vardı, birleşti)
    --tomato-dark  #007a3d  →  --fit-deep  (ikizi vardı, birleşti)
    --tomato-deep  #006a35  →  --fit-ink   (yeni adım · beyazla 6.75:1)
    --tomato-tint  #e8f6ee  →  --fit-wash  (yeni adım)

672 geçiş · 47 dosya. **66/66 sayfada çözülmüş renk imzası birebir aynı**
(color · background · background-image · border · outline · fill · stroke ·
box-shadow). `--fit-wash` ile `--fit-tint` bilerek birleştirilmedi (ΔE≈0.5,
birleştirmek 127 kullanımın değerini değiştirirdi) — **R8'e açık kalem**.

## C · Sözlük eyebrow'u (madde 4) — **K56**

"Terim Terim" → **"Hareketi Anlamak"**. Uydurulmadı: 29 banner'ın 29'unda
eyebrow üst bağlamı yazıyor, ve kardeş sayfa `anatomi-v1` (aynı K34 grubu,
aynı yapı) birebir bunu diyor. Eski metin ayrıca kabuğun o sayfa için
yazdığı **açıklamanın** kopyasıydı (`fit-shell.js` NAV).

## D · Fit Planım CSS'i tek kaynağa (madde 10) — **K55**

226 satırlık `fpx-` bloğu yedi sayfada **birebir** duruyordu (md5 7/7 aynı).
`assets/css/fit-planim.css` oldu; `<style>` tam durduğu yerde `<link>`'e
döndü. **Yükleme sırası zorunlu:** `fit-shell.css → fit-planim.css →
fit-type.css`.

**Kanıt:** 7 sayfa × 2 genişlik = 14 imza, her `body *` elemanının kutusu ·
`text-align` · `text-align-last` · padding · margin · tipografi · renk →
**14/14 birebir aynı**. 7 sayfa toplam **~86 KB** küçüldü.

> **DEVIR-6'nın ifadesi düzeltildi:** açık kalem "`fpx-` CSS/**JS** bloğu"
> diyordu; yedi `<script>` bloğunun md5'i **yedisi de farklı** (175–291
> satır). Çoğaltılan yalnız CSS'ti, çıkarılacak ortak JS yok.

## E · R11 perdesi @390 (madde 9) — **K52**

Kasıtlı, kayda geçti. Perde yalnız **≥641 px**'te açılıyor; 641↔640 sınırı
temiz (641: margin-bottom 1158.45 = footer yüksekliği · 640: 0, footer
static). @390'da footer 1281.83 px — ekranın (844) bir buçuk katı; sabitlense
sığmazdı. `tools/site-tarama.mjs` perde sapmasını zaten yalnız `w===1440`'ta
ölçüyor, yani araç doğru yazılmış.

## F · Anatomi dokunma hedefi (madde 8) — **K53**

**Beyar kapattı:** adduktor geometrik olarak 44 px'e çıkamaz, çip + klavye
telafisi yeterli. Açık kalem **değil**, kabul edilmiş sınır. R6 §2d'deki
ölçüler yeniden ölçülmedi, olduğu gibi geçerli.

## G · Yaslama OPT-IN (madde 5 + 6) — **K57**

R6'nın iki yarım kalemi aynı kökten çıkıyordu: **varsayılanın yönü.**

**Ölçüm** (66 sayfa × 2 genişlik, yaslanan ve ≥6 kelimelik her blok):

| | @1440 | @390 |
|---|---|---|
| yaslanan blok | **803** | **746** |
| ≤4 satır | 793 (**%99**) | 558 (%75) |
| **yaslamayı hak eden** (≥480px **ve** ≥5 satır) | **9 (%1.1)** | **0** |
| görünür nehir (kelime arası ≥2×) | 146 | 488 |

O 9 bloğun 8'i `destek-talebi-detay`taki **yazışma balonları**. Makale
sayfaları ayrıca tarandı: `yasal-v1` · `hakkimizda-v1` ·
`saglik-bilgilendirme-v1` · `sss-v1` → ≥5 satırlık yaslanan paragraf **0**.
Sitenin nesri 1–4 satırlık kısa paragraflarla yazılmış — bu bir **içerik**
gerçeği.

**Seçilen: opt-in.** İşaret sınıfı (opt-out) 793 blok işaretlemek ve her
işaretin yaslama listesini **yenmek zorunda** olması demekti — R6'da o
tuzağa üç kez düşüldü. Opt-in özgüllük yarışını bitiriyor ve yeni sayfa
sola yaslı doğuyor.

    .jt        tek blok — eşik aranmaz
    .jt-flow   sarmalayıcı — içindeki akan metin, kutu --jt-min üstündeyse

**BUGÜN HİÇBİR BLOK İŞARETLİ DEĞİL** → site genelinde yaslama fiilen kapalı.
Geri açmak tek sınıf.

**Bedeli ölçüldü** (130 288 eleman): `text-align` 5 364 · `text-align-last`
417 (görsel etkisi yok) · **satır içi kutu 299** (A 139 · STRONG 81 · B 72 ·
EM 2 · SPAN 2 · CODE 2 · I 1) · **BLOK kutu 0**. Yani hiçbir blok, hiçbir
sayfa yüksekliği, hiçbir kart yer değiştirmedi.

`container-type` 12 kart sarmalayıcısından kalktı (artık yalnız `.jt-flow`
kendi kutusuna koyuyor) — **ölçülen layout etkisi sıfır**, kapsama orada
taşıyıcı değilmiş.

---

# 2 · AÇIK KALAN — MADDE 1 · `--sec-pad` ONAY BEKLİYOR

**Beyar:** *"66 sayfayı etkiliyor. Önce üç örnek sayfada dene, ekran
görüntüsü göster, onaylatmadan siteye yayma."* → **Depoya YAZILMADI.**

**Referans bugün canlıdan yeniden ölçüldü** (`dadadiet.com/beslenme`,
dört genişlik, üst/alt dolgusu eşit geniş bölüm kutuları):

| Kaynak | @1440 | @1024 | @768 | @390 |
|---|---|---|---|---|
| **referans** | **74** | **74** | **74** | **44** |
| DadaFit bugün | 50 | 42 | 42 | 34 |
| Öneri A — yalnız masaüstü | 74 | 42 | 42 | 34 |
| **Öneri B — rampanın tamamı** | **74** | **74** | **74** | **44** |

> **DEVIR-6'nın kaydı eksikti:** açık kalem yalnız "50 → 74" diyordu.
> Referans mobile kadar 74'te duruyor ve yalnız ≤640'ta 44'e iniyor —
> yani mesele tek sayı değil, **rampanın tamamı**. Önerilen: **B**
> (K29: referanstan ölçü alınır, ve ölçü rampanın kendisidir).

**Üç örnek sayfada denendi** (`dadafit-hub-v1` 11 bölüm · `hakkimizda-v1` 6 ·
`hareket-merkezi-v1` 5), iki genişlikte, aynı kaydırma çapasına kilitli
ekran görüntüleriyle. Sayfa yüksekliği etkisi: Hub @1440 8209 → 8737 px
(+%6.4), Hub @390 (B ile) 14685 → 14905 px (+%1.5).

**Etkilenmeyenler:** banner aile yükseklikleri (ayrı token), R11 perdesi,
yasal bant, `--sec-pad-sm` (32 px · 61 kullanım), bilerek yapışık duran
0 dolgulu bölümler.

**Onaylanırsa değişecek tek yer:** `assets/css/fit-shell.css`
— `--sec-pad:50px` (satır ~53) ve iki medya sorgusu (`max-width:1024` → 42,
`max-width:640` → 34). Üç sayı, tek dosya. `var(--sec-pad)` 115 kullanım,
hepsi bu tanımdan besleniyor.

---

# 3 · TUZAKLAR — 9. oturumda yaşananlar

## B22 · zsh UNQUOTED DEĞİŞKENİ KELİMELERE BÖLMEZ — toplu düzenleme sessizce hiç koşmaz

`FILES=$(ls *.html ...)` sonra `perl -pi -e '...' $FILES` yazıldı. bash
bunu IFS'e göre böler; **zsh bölmez** ve 47 dosya adını TEK argüman yapar.
perl "File name too long" dedi, kabuk 0 döndü, **hiçbir dosya değişmedi.**

**Ders:** toplu düzenlemeden sonra ilk iş `git status --short | wc -l`.
Sayı beklenenle uyuşmuyorsa düzenleme koşmamıştır. (Bu turda 0 çıktı ve
yakalandı; yakalanmasaydı sonraki bütün ölçümler "değişiklik etkisiz"
diye yorumlanacaktı.) Glob'u doğrudan komuta ver: `perl ... *.html`.

## B23 · KENDİ DIFF ARACININ ALAN ETİKETLERİ BİR KAYABİLİR

İmza `[i, x, y, w, h, ...]` diye kuruluyordu ama etiket dizisi `i`'yi
saymıyordu (`['x','y','w','h',...]`). Sonuç: "h 242 elemanda değişti"
raporu aslında **w** idi ve "y" aslında **x**. Bir tur boyunca yanlış
alan kovalandı.

**Ders:** diff aracı, **bilinen bir değişiklikle** bir kez doğrulanmadan
sonucuna güvenilmez. Etiket dizisi imzayla aynı satırda kurulmalı.

## B24 · `networkidle` TEK SEFERLİK 6 px OYNATABİLİR

66 sayfalık ilk karşılaştırmada `reklam-ver-v1` @390'da bir bölüm 6 px
uzun çıktı. Aynı base kendine karşı koşulunca **fark 0**; HEAD'e karşı
tekrar koşulunca da **0**. Geç yüklenen bir görselin oturma anıydı.

**Ders:** tek sayfada çıkan tek fark, **kendine karşı** bir kez daha
koşulmadan bulgu sayılmaz.

## B25 · "EN SON YÜKLENEN KAZANIR" YANLIŞTIR — ÖNCE ÖZGÜLLÜK KAZANIR

Yeni nöbetin 4. ölçütü ilk yazımda *"fit-type.css en son yükleniyor,
öyleyse vaadi computed'da tutmalı"* varsayıyordu. **2385 sahte bulgu**
verdi: `button{text-align:center}` (0,0,1) vaadini `.wg-opt{...left}`
(0,1,0) gibi **kasıtlı ve daha özgül** sayfa kuralları devralıyordu.

**Ders:** yükleme sırası yalnız **eşit özgüllükte** hakem. Nöbet, vaadin
özgüllüğünü rakiplerinkiyle karşılaştırmadan kırmızıya dönmemeli — yoksa
gürültü, gerçek bulguyu gömer. (Bu, R6'nın ÖZGÜLLÜK NOTU'nun sınama
tarafındaki karşılığı.)

## B26 · İKİ TOKEN ADI AYNI RENGİ GÖSTERİYORDU VE KİMSE FARK ETMEMİŞTİ

`--tomato` (#009d4f) ile `--fit` (#009d4f) aynı dosyada, iki ayrı `:root`
bloğunda, **aynı değerle** duruyordu. Ad temizliği yapılmasa bu kopya
görünmeyecekti; ilerideki bir palet değişikliği ikisinden yalnız birini
güncelleyip sessiz bir ayrışma üretirdi.

**Ders:** token yeniden adlandırmadan önce **değer bazında** ara —
yeni ad icat etmeden önce ikizi var mı diye bak.

---

# 4 · TEST SÜİTİ — 21 sınama

**Yeni sınama:** `hizalama-nobeti` (K58) — taban commit `8bf5c66`'da
**4 sorun** (6 989 izinsiz justify · 4 606 tutmayan vaat · eşik ayrışması ·
opt-in kancası yok).

DEVIR-6'nın 20 sınaması **zayıflatılmadı**; hiçbirinin ölçütüne dokunulmadı.

```bash
python3 -m http.server 8811 &
export PW_HOME=~/.pw
for t in a11y-focus coach-list dropdown-position header-banner plan-account \
         fit-test-lock footer-curtain crumb-home wizard-page sozluk \
         sozluk-kapalilik anatomi workout-generator egzersiz-katalog \
         kabuk-kalite enerji-hesap footer-yapi plan-kayit plan-ozet arama-oneri \
         hizalama-nobeti; do
  echo "=== $t ==="; node tests/$t.mjs http://localhost:8811
done
```

> Süit uçtan uca **~12–15 dk** sürüyor (`wizard-page` ve `hizalama-nobeti`
> tek başına birkaç dakika). Ön planda koşturma, arka plana al.

**Tam site taraması:**
```bash
node tools/site-tarama.mjs http://localhost:8811 1440,390
```

---

# 5 · DOKUNULMAYACAKLAR

DEVIR-5 §7 ve DEVIR-6 §5'teki listeler **aynen geçerli**. R7'nin eklediği:

| Ne | Neden |
|---|---|
| **`assets/css/fit-planim.css` yükleme sırası** | `fit-shell.css → fit-planim.css → fit-type.css`. Sıra bozulursa `.fp-card p.fpx-note` ailesinin özgüllük dengesi bozulur (K55) |
| **`--fit-*` yeşil ailesinin TEK tanım bloğu** | `fit-shell.css` sonundaki ramp. Üstteki `:root`a ikinci bir yeşil tanımı geri konursa K54'ün kopyası geri gelir |
| **`.jt` / `.jt-flow` adları** | Yaslamanın tek kancası. Adı değişirse yaslama isteyen her yer sessizce sola yaslıya düşer (K57) |
| **`--jt-min` ↔ `@container` sayısının aynı olması** | `@container` `var()` alamıyor; elle aynalı. `tests/hizalama-nobeti.mjs` ölçüt 1 nöbette |
| **`tests/hizalama-nobeti.mjs` ölçüt 4'ün özgüllük karşılaştırması** | Kaldırılırsa 2385 sahte bulgu geri gelir ve nöbet işe yaramaz (B25) |
| **R11 perdesinin 641 px eşiği** | Kasıtlı. `fit-shell.js` IIFE'si ve `fit-shell.css` `@media (min-width:641px)` birlikte (K52) |

---

# 6 · AÇIK KALEMLER — bir sonraki turun malzemesi

| # | Konu | Durum |
|---|---|---|
| **1** | **`--sec-pad` 50 → 74 · ONAY BEKLİYOR** | §2'de tam dosya. Referans rampası ölçüldü (74/74/74/44), üç sayfada denendi, **depoya yazılmadı** |
| **2** | `enerji-defteri-dengele` `.sec-food .eyebrow{color:var(--food)}` → **4.07:1**, AA altı | R6'dan devrediyor. Hem kontrast kusuru hem marka dili sorusu: DadaFit sayfasında gastro kırmızısı bilerek mi? |
| **3** | `--fit-wash` (#e8f6ee) ile `--fit-tint` (#eaf6ef) **neredeyse aynı renk** | ΔE00 ≈ 0.5. R7'de bilerek birleştirilmedi (127 kullanımın değeri değişirdi). Tek adıma indirmek palet kararı |
| **4** | `fit-type.css` §3'te **ölü istisna seçicileri** | Yaslama kalkınca "geri alma" görevleri boşa çıktı; `text-align:center`/form/tablo/`hyphens` kuralları hâlâ iş görüyor. Ayıklama artık **güvenli** — ölçüt 4 nöbette |
| **5** | `giris-v1.html` h1 sol kenarı **827 px** (63/64 sayfa 132 px) | R6'dan devrediyor. Banner ailesinde değil, S-G kapsamıyor |
| **6** | `antrenor-detay` portre fotoğrafı **portre değil** | R6'dan devrediyor. İçerik konusu |
| **7** | Site genelinde `.btn-primary` **hâlâ duruyor** | R6'dan devrediyor. Fit Planım ailesinde 0'a indi; site geneli taşıma ayrı madde |
| **8** | Yaslama isteyen bir sayfa çıkarsa | `.jt-flow` mekanizması hazır ama **hiçbir yerde kullanılmıyor**. Uzun soluklu makale sayfası yazılırsa ilk müşterisi o olur |

**Kapanan açık kalemler:** R6 §6'nın 1·3·4·5·6·7·10·11·12 numaralı kalemleri
(sırasıyla §2 onay bekliyor · K54 · K56 · K57 · K57 · K58 · K52 · K53 · K55).

## MuscleWiki — K45 hâlâ geçerli · Higgsfield — 30.5 kredi (dokunulmadı)

---

# 7 · YOLLAR

| Ne | Yol |
|---|---|
| Bu turun brief'i | `tasks/REVIZYON-7.md` |
| Kararlar | `KARARLAR.md` (K1–K58) |
| **Yeni nöbet** | `tests/hizalama-nobeti.mjs` |
| **Yeni ortak CSS** | `assets/css/fit-planim.css` |
| Yaslama katmanı | `assets/css/fit-type.css` (opt-in) |
| Kabuk | `assets/js/fit-shell.js` · `assets/css/fit-shell.css` |
| Test süiti | `tests/*.mjs` (21 sınama) |
| Kalite kapıları | `tools/page-check.mjs` · `tools/site-tarama.mjs` |
| Önceki devirler | `tasks/DEVIR-6.md` · `tasks/DEVIR-5.md` |
| Playwright | `PW_HOME=~/.pw` |
| Canlı | `https://gaviaworks-dev.github.io/dadafit-prototip` |

---

# 8 · TURUN KAPANIŞ ÖLÇÜMLERİ

## Tam süit — 21 sınama

`node tests/<ad>.mjs http://localhost:8811` · **21/21 exit=0 · kırmızı 0**

```
a11y-focus ✓  coach-list ✓  dropdown-position ✓  header-banner ✓
plan-account ✓  fit-test-lock ✓  footer-curtain ✓  crumb-home ✓
wizard-page ✓  sozluk ✓  sozluk-kapalilik ✓  anatomi ✓
workout-generator ✓  egzersiz-katalog ✓  kabuk-kalite ✓  enerji-hesap ✓
footer-yapi ✓  plan-kayit ✓  plan-ozet ✓  arama-oneri ✓
hizalama-nobeti ✓   ← YENİ
```

**`hizalama-nobeti` kapanış çıktısı:**

| Ölçüt | Sonuç |
|---|---|
| 1 · eşik aynası | `--jt-min` 30rem ↔ `@container` 30rem · opt-in kancaları tanımlı |
| 2 · opt-in sözleşmesi | **130 288 elemanın 0'ı** izinsiz justify |
| 3 · hesapsız dolgu | **3 946 paragrafın** dolgusu eşleşen kuraldan |
| 4 · "sözünü tutuyor mu" | **23 123/23 123** vaat tutuyor (3 227 devir normal basamaklanma) |
| 5 · kanca canlı denendi | geniş `.jt-flow` 132/132 yaslıyor · **dar** 132/132 yaslamıyor · `.jt` 132/132 · **`.lead.jt` 132/132** (kanca istisnayı yeniyor) |

## Tam site taraması

`node tools/site-tarama.mjs http://localhost:8811 1440,390`
**66 sayfa × 2 genişlik = 132 yükleme · 0 sorun**

| Ölçüt | Sonuç |
|---|---|
| HTTP dışı 200 · konsol hatası · yatay taşma · 4xx alt kaynak · kırık iç bağlantı | **hepsi 0** |
| Banner **liste** @1440 / @390 | **544 px ×54** / **587 px ×54** — tek değer |
| Banner **detay** @1440 / @390 | **560 px ×8** / **726 px ×8** — tek değer |
| **R11 perde sapması** (>0.5 px) | **0 sayfa** |

## Değişikliklerin bedeli — önce/sonra karşılaştırma

Üç bağımsız karşılaştırma koşturuldu (HEAD `1561739` :8812 ↔ çalışma ağacı :8811):

| Karşılaştırma | Kapsam | Sonuç |
|---|---|---|
| **Renk imzası** (token yeniden adlandırma) | 66 sayfa @1440 · color · background · background-image · border · outline · fill · stroke · box-shadow | **66/66 birebir aynı** |
| **Fit Planım düzeni** (CSS çıkarma) | 7 sayfa × 2 genişlik · kutu · text-align · text-align-last · padding · margin · tipografi · renk | **14/14 birebir aynı** |
| **Yaslama** (opt-in) | 66 sayfa × 2 genişlik · 130 288 eleman, alan alan | `text-align` 5 364 · `text-align-last` 417 · **satır içi kutu 299** · **BLOK kutu 0** |
