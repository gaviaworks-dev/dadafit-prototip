# DEVİR 7 — YENİ OTURUMUN TEK BİLGİ KAYNAĞI

**Depo:** `~/Developer/Projects/dadafit-prototip` · **Canlı:** `gaviaworks-dev.github.io/dadafit-prototip`
**R7 taban commit:** `1561739` · **K27 kırmızı ölçümünün tabanı:** `8bf5c66`
**Branch:** `main` · **Brief:** `tasks/REVIZYON-7.md` · **Kararlar:** `KARARLAR.md` (K1–K58)
**Önceki devir:** `tasks/DEVIR-6.md`

> **BU NOTUN KURALI: iddia yok, ölçüm var.** Her sayının yanında onu üreten
> ölçüm yazılı. Bu turda ölçülmeyen her şey **"R7'de ölçülmedi"** diye
> işaretli; doğrulanamayan her şey **"doğrulanamadı"** diye yazılı.
> Ölçüm koşulları: yerel `http://localhost:8811`, Playwright/Chromium,
> genişlikler 1440 · 1024 · 390. Tarih 21 Ağustos 2026.

---

# 1 · R7'DE KAPANANLAR

Kalem başına tek satır: ne değişti, **hangi ölçüm kapattı**.

| # | Ne değişti | Kapatan ölçüm |
|---|---|---|
| **3** | `--tomato` ailesi silindi, `--fit-*` ailesiyle **birleşti** (672 geçiş · 47 dosya); `--tomato`→`--fit` ve `--tomato-dark`→`--fit-deep` **ikizleri zaten aynı değerdeydi**, `#006a35`→`--fit-ink` ve `#e8f6ee`→`--fit-wash` yeni ad aldı | 66 sayfa @1440, her elemanın çözülmüş `color · background-color · background-image · border · outline · fill · stroke · box-shadow` imzası önce/sonra: **66/66 birebir aynı** (tek fark `challenge-v1`'de `livePulse` animasyonunun 1.9 sn döngüsünden farklı kare) |
| **4** | `sozluk-v1` banner eyebrow'u `"Terim Terim"` → `"Hareketi Anlamak"` | 29 banner'ın eyebrow/h1 çifti tarandı: **29/29'unda eyebrow üst bağlam** (menü grubu ya da üst sayfa), slogan değil. Kardeş sayfa `anatomi-v1` aynı yapıda birebir `"Hareketi Anlamak"`. Canlıda okundu: **"Hareketi Anlamak"**, sözlük **254 satır**, tıklayınca açılıyor |
| **10** | 226 satırlık `fpx-` bloğu 7 sayfadan çıkıp `assets/css/fit-planim.css` oldu; `<style>` tam durduğu yerde `<link>`'e döndü | Yedi bloğun **md5'i 7/7 aynı** (yani zaten tek kaynaktı). Çıkarma sonrası 7 sayfa × 2 genişlik = 14 imza, her `body *` elemanının kutusu · `text-align` · `text-align-last` · padding · margin · tipografi · renk: **14/14 birebir aynı**; tek fark `<head>`teki 9. düğümün `STYLE` yerine `LINK` olması. 7 sayfa toplam **~86 KB** küçüldü |
| **9** | R11 perdesinin @390'da kapalı olması **kasıtlı** diye kayda geçti (K52) — kod değişmedi | Beş genişlikte `#pageMain` margin-bottom / footer position ölçüldü: **641 px'te 1158.45 px + fixed · 640 px'te 0 + static**. Eşik temiz kesiyor. @390'da footer **1281.83 px**, ekranın (844) bir buçuk katı. `tools/site-tarama.mjs` perde sapmasını zaten yalnız `w===1440`'ta ölçüyor |
| **8** | Anatomi dokunma hedefi **olduğu gibi** kalıyor diye kayda geçti (K53) — kod değişmedi | Beyar'ın kararı. **R6 §2d ölçüleri R7'de yeniden ölçülmedi**, olduğu gibi geçerli sayıldı. R7'de yalnız haritanın çalıştığı doğrulandı: canlıda **18 bölge**, gerçek fare tıklaması `quadriceps`'i seçti, üstünü kapatan katman yok |
| **5+6** | Yaslama **opt-in** oldu: yaslama seçici listesi kalktı, yerine `.jt` / `.jt-flow` kancaları geldi; `container-type` 12 kart sarmalayıcısından kalkıp yalnız `.jt-flow`'a bağlandı | 66 sayfa × 2 genişlik, yaslanan ve ≥6 kelimelik her blok: @1440 **803 blok, 793'ü (%99) ≤4 satır, yaslamayı hak eden 9 (%1.1)**; @390 **746 blok, hak eden 0**. Bedeli 130 288 elemanda alan alan: `text-align` 5 364 · `text-align-last` 417 · **satır içi kutu 299 · blok kutu 0** |
| **7** | `tests/hizalama-nobeti.mjs` yazıldı — beş ölçüt, süit 20→**21** sınama | K27 kapısı: taban commit `8bf5c66`'da **4 sorun** (eşik 30rem↔20rem ayrışık · opt-in kancası yok · **6 989 eleman** izinsiz justify · **4 606 eşleşmede** vaat tutmuyor). Bugünkü ağaçta **0 sorun**: 130 288 eleman · 3 946 paragraf · 23 123 vaat eşleşmesi · kanca 132/132 |

**R7 commit'leri:**

| Commit | Kalem |
|---|---|
| `6f2ba66` | madde 3 — `--tomato` → `--fit-*` |
| `b5ddf5f` | madde 10 — fpx tek kaynağa |
| `3353799` | madde 4 — sözlük eyebrow |
| `9512525` | madde 5+6 — yaslama opt-in |
| `3ef59b0` | madde 7 — hizalama nöbeti |
| `b763218` · `68e0c45` | brief · K52–K58 · devir notu |

---

# 2 · SABİTLER

DEVIR-6'nın tablosu güncellendi. **Ölçüm sütunu, sayının R7'de mi yoksa
önceki turda mı ölçüldüğünü söyler.**

## 2a · Yeşil ailesi — R7'de değişen tek blok

| Token | Değer | Beyazla kontrast | Ölçüm |
|---|---|---|---|
| `--fit` | `#009d4f` | **3.54:1** — yalnız büyük metin/zemin | R7 · WCAG 2.1 formülüyle hesaplandı |
| `--fit-deep` | `#007a3d` | **5.45:1** — AA | R7 · hesaplandı; `.btn-fit` zemini, canlıda beyaz metinle doğrulandı |
| **`--fit-ink`** | **`#006a35`** | **6.75:1** — AA | **R7'de yeni ad.** Zorunlu-alan yıldızı (`.fk-label .req`) + gradient koyu ucu. `var()` ile **6** kullanım |
| `--fit-deeper` | `#00572b` | **8.76:1** — AA | R7 · hesaplandı |
| **`--fit-wash`** | **`#e8f6ee`** | zemin token'ı; üstünde `--fit-deep` **4.89:1** (AA), `--fit` 3.18:1 | **R7'de yeni ad.** `var()` ile **126** kullanım |
| `--fit-tint` | `#eaf6ef` | zemin token'ı; üstünde `--fit` 3.19:1 | R7 · hesaplandı |
| `--fit-line` · `--fit-bright` · `--fit-dark` | `#d8ebe0` · `#34c47e` · `#211E16` | — | değişmedi |

**`--tomato` ARTIK YOK.** İkizi `--fit` idi: `--tomato:#009d4f` ile
`--fit:#009d4f` **aynı dosyada, iki ayrı `:root` bloğunda, aynı değerle**
duruyordu; `--tomato-dark:#007a3d` ile `--fit-deep:#007a3d` de öyle. Yani
`--tomato` ayrı bir renk değil, var olan yeşilin ikinci adıymış.
Canlıda doğrulandı: `getComputedStyle(:root).getPropertyValue('--tomato')`
→ **boş**.

> **Açık kalem:** `--fit-wash` (#e8f6ee) ile `--fit-tint` (#eaf6ef) kanal
> farkı **ΔR=2 · ΔG=0 · ΔB=1**. Bilerek birleştirilmedi — birleştirmek **126
> `var(--fit-wash)` kullanımının** çözülmüş değerini değiştirirdi ve bu tur ad temizliğiydi.

## 2b · Dosya ölçüleri

| Dosya | Satır / boyut | Ölçüm |
|---|---|---|
| `assets/css/fit-type.css` | **390 satır** (taban `8bf5c66`'da 211 · R6 sonunda 357) | R7 · `wc -l`, üç commit'te ayrı ayrı |
| `assets/css/fit-planim.css` | **13 441 bayt** · yeni dosya | R7 |
| `fit-planim-v1.html` | 37.7 KB → **25.5 KB** | R7 |
| `assets/img/anatomi/` | **289 627 bayt = 282.8 KB** (4 PNG) | R7 · `ls -l` bayt (DEVIR-6'nın "283 KB"ı doğrulandı; `du` blok sayar, 344K der — yanıltıcı) |
| `assets/svg/govde-*.svg` | **39.5 KB** (4 dosya) | R7 |

## 2c · Değişmeyenler — R7'de yeniden ölçülüp doğrulandı

| Sabit | Değer | Ölçüm |
|---|---|---|
| Banner **liste** | @1440 **544** ×54 · @1024 **607** ×54 · @390 **587** ×54 | R7 · tam site taraması, üç genişlik ayrı koşu |
| Banner **detay** | @1440 **560** ×8 · @1024 **617** ×8 · @390 **726** ×8 | R7 · aynı |
| Kırıntı ev ikonu | **9 px** (kutu 10.1 px) | R7 · `sozluk-v1` `.crumb-home i` computed |
| `.btn-fit` | beyaz üstü `rgb(0,122,61)` = `#007a3d` → **5.45:1 AA** | R7 · `egzersiz-kutuphane` computed + kontrast hesabı |
| Sözlük | **254 terim** · **29 harf** · eski sağ ok **0** · `.sr-caret` **254** | R7 · yerel + canlı |
| Egzersiz kataloğu | **25 hareket** | R7 · `egzersiz-kutuphane` DOM sayımı |
| Anatomi tuvali | viewBox **`0 0 758 1380`**, dört dosyada aynı | R7 |
| Anatomi bölge | görünüm başına **18** · benzersiz slug **31** | R7 · DOM + dört SVG'nin `data-kas` birleşimi |
| Anatomi verisi | **31 kas kaydı** · `kaynak` alanı **31/31 dolu** (K38) · birincil **16 ön / 15 arka** (K49) · **12 hareket** · 4 harita | R7 · `window.ANATOMI_VERI` |
| R11 perdesi | @1440 açık (margin-bottom = footer yüksekliği, sapma **0 sayfa**) · @390 kapalı | R7 · site taraması + beş genişlikte tekil ölçüm |

**R7'de ölçülmeyen, DEVIR-6'dan taşınan tek sabit:** anatomi dokunma hedefi
çapları (§2d: @390'da 61, @1440'ta 54 bölge 24 px altında). Beyar kalemi
kapattığı için (K53) yeniden ölçülmedi.

## 2d · Higgsfield kredisi — **DOĞRULANAMADI**

DEVIR-6'nın kaydı **30.5 kredi**. R7'de bu sayı **doğrulanamadı**:
`mcp__claude_ai_Higgsfield__balance` çağrıldı, sunucu **"not connected"**
döndü.

**Doğrulanabilen:** R7'de görsel üretilmedi. `git diff --stat 1561739..HEAD
-- assets/img/ assets/svg/` **boş**; `assets/img/anatomi/`'ye son dokunan
commit R6'nın `fe026b9`'u. R7'nin değiştirdiği 54 dosyanın türü: 46 html ·
3 md · 3 css · 1 mjs · 1 js — **görsel yok**.

Yani bu depodan kredi harcanmadı; bakiyenin kendisi bir sonraki oturumda
MCP bağlıyken teyit edilmeli.

---

# 3 · YASLAMANIN BUGÜNKÜ FİİLİ DURUMU

**Site genelinde iki yana yaslama KAPALI.**

| Ölçüt | Sayı | Ölçüm |
|---|---|---|
| `class="jt"` taşıyan blok | **0** | 66 sayfa + `fit-shell.js` grep |
| `class="jt-flow"` taşıyan sarmalayıcı | **0** | aynı |
| İzinsiz `justify` hesaplayan eleman | **0 / 130 288** | `tests/hizalama-nobeti.mjs` ölçüt 2, 66 sayfa × 2 genişlik |

Yani mekanizma yerinde ama **hiçbir yerde kullanılmıyor** — sitede yaslanan
tek bir metin bloğu yok.

## Bu kararı kim verdi

**LEAD verdi, ölçümle. Beyar onayı ALINMADI.**

Beyar iki seçeneği de sordu ("opt-in mi olacak, işaret sınıfı mı? … öner,
sonra uygula") — **hangisinin seçileceğini lead belirledi ve uyguladı.**
Beyar sonucu görüp onaylamadı. Sonuç görünür bir tasarım değişikliğidir:
R6'da 803 blok yaslıyken bugün 0.

Kararın dayandığı ölçüm (K57'de tam hâliyle): @1440'ta yaslanan 803 bloğun
**793'ü ≤4 satır**, yaslamayı hak eden **9** — ve o 9'un **8'i
`destek-talebi-detay` sayfasındaki yazışma balonları**. Makale sayfaları
ayrıca tarandı (`yasal-v1` · `hakkimizda-v1` · `saglik-bilgilendirme-v1` ·
`sss-v1`): **≥5 satırlık yaslanan paragraf 0**.

## Geri açma yolu

`.jt` kuralı `assets/css/fit-type.css` **satır 384–390**, yani dosyanın
**sonunda**, ve **`(0,1,0)` değil**:

```css
.jt,
p.jt, li.jt, dd.jt, blockquote.jt,
.art-wrap p.jt, .qa-body p.jt, .hub-body p.jt{
  text-align:justify; text-justify:inter-word; text-align-last:start;
}
```

Neden böyle: `.jt` tek başına `(0,1,0)` olsaydı §3'teki `p.lead` `(0,1,1)`
gibi istisnalara **sessizce kaybederdi** — yani açıkça istenen yaslama
çalışmazdı. Eleman+sınıf biçimi `(0,1,1)` yapıyor, dosyanın sonunda olması
eşit özgüllükte sırayı bunun lehine çeviriyor.
**Ölçüldü:** `.lead.jt` **132/132 örnekte yaslanıyor**.

| İstenen | Yapılacak |
|---|---|
| Tek blok yaslansın | bloğa `class="jt"` |
| Bir bölümün akan metni yaslansın | sarmalayıcıya `class="jt-flow"` — kutu `--jt-min` (30rem ≈ 480px) üstündeyse açılır |
| R6'daki hâle tam dönüş | §2'deki opt-in bloğunun yerine eski seçici listesi. **O zaman ölçüt 2 kırmızıya döner ve dönmesi doğrudur** |

## Nöbetin beşinci ölçütü

Kanca hiçbir yerde kullanılmadığı için sınama onu **her koşuda canlı
sayfada kurup söküyor**: sayfaya geçici bir düğüm eklenir, dört hâl
ölçülür, düğüm `remove()` edilir. Sayfaya kalıcı hiçbir şey yazılmaz.

| Denenen | Beklenen | Ölçülen |
|---|---|---|
| geniş `.jt-flow` (900 px) içindeki `p` | `justify` | **132/132** |
| dar `.jt-flow` (240 px) içindeki `p` | yaslanmasın | **132/132** yaslanmıyor — eşik iş görüyor |
| `p.jt` | `justify` | **132/132** |
| `p.lead.jt` (istisna sınıfı + kanca) | `justify` | **132/132** — kanca istisnayı yeniyor |

---

# 4 · YENİ ÖĞRENİLEN TUZAKLAR

DEVIR-6 §3'ün devamı. B22–B24 R7'de yaşandı.

## B22 · "Sonra yüklenen kazanır" YANLIŞ — yükleme sırası yalnız EŞİT özgüllükte hakem

Yeni nöbetin 4. ölçütü ilk yazımda şunu varsayıyordu: *"`fit-type.css` en
son yükleniyor, öyleyse `text-align` vaadi computed'da tutmalı."*

**Ölçülen sonuç: 2 385 sahte bulgu.** Hepsinin şekli aynıydı —
`button{text-align:center}` `(0,0,1)` vaadini `.wg-opt{text-align:left}`
`(0,1,0)` gibi **daha özgül ve kasıtlı** sayfa kuralları devralıyordu.
Bu normal basamaklanma, kusur değil.

Düzeltilmiş hâlde ölçüt, vaadin özgüllüğünü **aynı elemana `text-align`
veren bütün kuralların** özgüllüğüyle karşılaştırıyor; daha özgül rakip
varsa sayıyor ama kırmızıya döndürmüyor. Bugünkü ağaçta **23 123 vaat
tutuyor, 3 227 eşleşme normal basamaklanmayla devredilmiş.**

**Kural:** basamaklanma sırası bir kuralın kazanacağını **kanıtlamaz**.
Bir nöbet "şu dosya sonda, öyleyse kazanır" diyorsa, önce özgüllüğü
karşılaştırsın; yoksa ürettiği gürültü gerçek bulguyu gömer.

## B23 · Kullanılmayan kanca çürür — nöbet KULLANIMI da sınamalı

`.jt` ve `.jt-flow` yazıldı ama sitede **0 yerde** kullanılıyor. Böyle bir
kanca, gerektiği gün bozuk bulunur ve kimse ne zaman bozulduğunu bilemez.
Nöbetin ilk dört ölçütü kancanın **tanımlı** olduğunu görüyordu; **çalıştığını**
görmüyordu.

Beşinci ölçüt eklendi: kanca her koşuda canlı sayfada kurulup ölçülüyor
(§3). Eklendiği ilk koşuda **dördü de geçti**, yani kanca gerçekten
çalışıyor — bu bilgi ölçüt eklenene kadar **elde yoktu**.

**Kural:** kod tabanına giren ama hiçbir çağıranı olmayan mekanizma,
sınamada **sentetik bir çağıran** ister. "Tanımlı mı" yetmez, "iş görüyor mu"
ölçülecek.

## B24 · Yanlış seçiciyle ölçüm 0 döndürür ve KUSUR gibi görünür

Canlı doğrulamada sözlük satırları `.sr-row,.term-row` diye arandı ve **0**
döndü. Sonda "sözlük satırları basılmıyor" diye kırmızı verdi. Sayfada
kusur yoktu: doğru sınıf **`#szList .sz-item`** (yerel `tests/sozluk.mjs`
zaten onu kullanıyor). Doğru seçiciyle ölçüm **254 satır · eski sağ ok 0 ·
`.sr-caret` 254 · tıklayınca açılıyor** verdi.

Bu, DEVIR-6'daki B23'ün (diff aracının alan etiketlerinin bir kayması)
canlı taraftaki eşi: **ölçüm aracının kendi kusuru, ölçülen şeyin kusuru
gibi rapor edildi.**

**Kural:** yeni yazılan bir sonda 0 / boş döndürüyorsa, **önce seçici
doğrulanır** — aynı şeyi ölçen mevcut bir sınama varsa onun seçicisi
alınır. Seçici doğrulanmadan sayı rapor edilmez.

> DEVIR-6 §3'te B14–B21, R7'nin ilk yazımında B22–B26 diye numaralanan
> tuzaklar bu bölümde **B22–B24** olarak birleştirildi (zsh word-splitting
> ve `networkidle` oynaması araç kullanımına dair, kalıcı depo tuzağı
> değil — buradan çıkarıldılar).

---

# 5 · AÇIK KARARLAR — BEYAR'A AİT

## 5a · Madde 1 · `--sec-pad` rampası — A mı B mi?

**Depoya YAZILMADI.** Beyar: *"onaylatmadan siteye yayma."*

Referans **R7'de canlıdan yeniden ölçüldü** (`dadadiet.com/beslenme`, dört
genişlik, üst/alt dolgusu eşit olan geniş bölüm kutuları):

| Kaynak | @1440 | @1024 | @768 | @390 |
|---|---|---|---|---|
| **referans** | **74** | **74** | **74** | **44** |
| DadaFit bugün | 50 | 42 | 42 | 34 |
| Öneri **A** — yalnız masaüstü | 74 | 42 | 42 | 34 |
| Öneri **B** — rampanın tamamı | **74** | **74** | **74** | **44** |

> **DEVIR-6'nın kaydı eksikti:** açık kalem yalnız "50 → 74" diyordu.
> Referans mobile kadar 74'te duruyor ve yalnız ≤640'ta 44'e iniyor — yani
> mesele tek sayı değil, **rampanın tamamı**.

**Lead'in önerisi: B.** Gerekçe K29 ("referanstan ölçü alınır, palet
alınmaz") — ve ölçü tek bir sayı değil, rampanın kendisi. **A** seçilirse
74'ten 42'ye tek adımlık bir sıçrama kalır; referansta öyle bir sıçrama yok.

**Üç örnek sayfada denendi** (`dadafit-hub-v1` 11 bölüm · `hakkimizda-v1` 6 ·
`hareket-merkezi-v1` 5), iki genişlikte, aynı kaydırma çapasına kilitli:

| Sayfa | @1440 mevcut → öneri | @390 mevcut → B |
|---|---|---|
| `dadafit-hub-v1` | 8 209 → **8 737** px (+%6.4) | 14 685 → **14 905** px (+%1.5) |
| `hakkimizda-v1` | 5 588 → **5 924** px | 10 449 → **10 589** px |
| `hareket-merkezi-v1` | 4 523 → **4 763** px | 9 736 → **9 836** px |

**Onaylanırsa değişecek tek yer:** `assets/css/fit-shell.css` — `--sec-pad`
tanımı ve iki medya sorgusu. **Üç sayı, tek dosya.** `var(--sec-pad)` **115
kullanım**, hepsi bu tanımdan besleniyor. Etkilenmeyenler: banner aile
yükseklikleri (ayrı token), R11 perdesi, yasal bant, `--sec-pad-sm` (32 px ·
**61 kullanım**), bilerek yapışık duran 0 dolgulu bölümler.

## 5b · Madde 2 · `enerji-defteri-dengele` eyebrow'unda gastro kırmızısı — HÂLÂ CEVAPSIZ

R6'da soruldu, **cevap gelmedi.** `.sec-food .eyebrow{color:var(--food)}`
→ **4.07:1**, AA eşiğinin (4.5) altında.

İki ayrı soru, ikisi de açık:
1. **Kontrast:** 4.07:1 küçük metinde AA altı.
2. **Marka dili:** `--food` (#E14827) gastro kırmızısı. DadaFit sayfasında
   bilerek mi duruyor, yoksa köprü bağlamı dışına mı taşmış?

İkincisi cevaplanmadan birincisi düzeltilemez — rengi koyulaştırmak marka
sorusunu sessizce "evet, kalsın" diye cevaplamak olur.

> **R7'de yeniden ölçülmedi**, DEVIR-6'nın kaydından taşındı.

## 5c · Sosyal medya adresleri — kayıt DURUYOR, doğrulandı

`docs/icerik-bekleyen.md` **var** (3 776 bayt) ve içeriği **kodla
uyuşuyor** — R7'de tek tek doğrulandı:

| Kayıt | İddia | R7 ölçümü |
|---|---|---|
| 1 · Instagram | footer'da `href="#"` + `data-yer-tutucu` + `aria-label` | ✓ `fit-shell.js:823` |
| 2 · YouTube | aynı desen | ✓ `fit-shell.js:825` |
| 3 · Mağaza adresleri | `<span class="ap-store" aria-disabled="true">` — bağlantı **değil** | ✓ 2 adet span, `<a>` değil |
| 4 · QR kodu | yok, sahte üretilmedi | ✓ yok |
| 5 · Üst bant `.tb-soc` | Instagram · YouTube · **Pinterest**, üçü de çıplak `href="#"`, yer tutucu işareti **yok** | ✓ `fit-shell.js:535–537` |

**5. kalem hâlâ iki karar bekliyor:** (a) footer yalnız Instagram + YouTube
gösteriyor, üst bantta ayrıca **Pinterest** var — hangisi doğru?
(b) adresler gelince footer'daki desen (`data-yer-tutucu` + `aria-label`)
üst banda da uygulanacak mı?

**Bağlam — `fit-shell.js`'teki 8 `href="#"`'in dökümü:**
3'ü `.tb-soc` (5. kalem) · 2'si footer sosyal (1–2. kalem) · 2'si dil
menüsü (`data-lang="tr"/"en"`, JS'in tuttuğu kontrol) · 1'i görüş bildir
sekmesi (`#fbTab`). **Son üçü yer tutucu değil**, JS ile sürülen kontroller.

## 5d · `docs/icerik-bekleyen.md`'de bekleyen başka kalem

Yukarıdaki **beş kalemin tamamı** dosyadaki bekleyenler listesi. Başka
bekleyen yok. "Çözülenler" bölümünde tek kayıt var: `enerji-ihtiyaci-v1`
(7. oturumda kapandı, footer bağlantısı HTTP 200 doğrulanmış).

## 5e · Lead'in taşıdığı, Beyar kararı GEREKMEYEN açık kalemler

| # | Konu | Durum |
|---|---|---|
| 1 | `--fit-wash` #e8f6ee ile `--fit-tint` #eaf6ef neredeyse aynı (ΔR2·ΔG0·ΔB1) | Palet birleştirmesi; R7'de bilerek yapılmadı |
| 2 | `fit-type.css` §3'te ölü istisna seçicileri | Yaslama kalkınca "geri alma" görevleri boşa çıktı. Ayıklama artık **güvenli** — ölçüt 4 nöbette |
| 3 | `giris-v1.html` h1 sol kenarı **827 px** (63/64 sayfa 132 px) | R6'dan devrediyor, **R7'de yeniden ölçülmedi** |
| 4 | `antrenor-detay` portre fotoğrafı portre değil | R6'dan devrediyor, içerik konusu |
| 5 | Site genelinde `.btn-primary` duruyor | R6'dan devrediyor, **R7'de sayılmadı** |

---

# 6 · KAPANIŞ ÖLÇÜMLERİ

## 6a · Test süiti — 21 sınama

`node tests/<ad>.mjs http://localhost:8811` · **21/21 exit=0 · kırmızı 0**

```
a11y-focus ✓  coach-list ✓  dropdown-position ✓  header-banner ✓
plan-account ✓  fit-test-lock ✓  footer-curtain ✓  crumb-home ✓
wizard-page ✓  sozluk ✓  sozluk-kapalilik ✓  anatomi ✓
workout-generator ✓  egzersiz-katalog ✓  kabuk-kalite ✓  enerji-hesap ✓
footer-yapi ✓  plan-kayit ✓  plan-ozet ✓  arama-oneri ✓
hizalama-nobeti ✓   ← YENİ
```

> Süit uçtan uca **~35 dk** sürdü; `wizard-page` (44 sihirbaz turu) ve
> `workout-generator` (40 bileşim) tek başına dakikalar alıyor. Ön planda
> koşturma, arka plana al.

**`hizalama-nobeti` beş ölçüt:**

| Ölçüt | Bugün | Taban `8bf5c66` |
|---|---|---|
| 1 · eşik aynası | `--jt-min` 30rem ↔ `@container` 30rem ✓ | ✗ 30rem ↔ **20rem** · kanca yok |
| 2 · opt-in sözleşmesi | **0 / 130 288** izinsiz justify | ✗ **6 989** (1 389 tekil) |
| 3 · hesapsız dolgu | **0 / 3 946** paragraf | ✓ (B20 hasarı tabanda henüz yoktu) |
| 4 · vaat tutuyor mu | **23 123 / 23 123** | ✗ **4 606** tutmuyor (903 tekil) |
| 5 · kanca canlı | **132/132 × 4 hâl** | ✗ kanca yok |
| **Toplam** | **0 sorun** | **4 SORUN** |

## 6b · Tam site taraması

| Genişlik | Yükleme | Sonuç |
|---|---|---|
| 1440 + 390 | 132 | **0 sorun** |
| 1024 | 66 | **0 sorun** |

Ölçülen: HTTP durumu · konsol hatası · yatay taşma · 4xx alt kaynak · kırık
iç bağlantı · banner aile yüksekliği · R11 perde sapması. **Hepsi 0.**
Banner değerleri §2c'de.

> **Aracın bir sınırı, çıktıyı yanlış okumamak için:** `site-tarama.mjs`
> perde sapmasını `if (w === 1440)` koşuluyla ölçüyor. 1024 koşusunun
> raporladığı *"R11 perde sapması: 0 sayfa"* bu yüzden **boş bir sonuçtur** —
> o genişlikte hiç ölçüm yapılmadı, sapma bulunmadığı anlamına gelmez.
> Perde @1024'te ayrıca tekil olarak ölçüldü (§2c): margin-bottom
> **1100.69 px** = footer yüksekliği, yani açık ve tam oturmuş.

## 6c · Canlı doğrulama

`https://gaviaworks-dev.github.io/dadafit-prototip` · **konsol hatası 0**

15 ölçütün **14'ü ilk koşuda geçti**; 1'i kırmızı verdi ve sebebi sondanın
yanlış seçicisiydi (B24). Doğru seçiciyle yeniden ölçüldü ve geçti →
**15/15**.

| Kalem | Ölçülen |
|---|---|
| m3 | `--tomato` **tanımsız** · `--fit` #009d4f · `--fit-ink` #006a35 · `--fit-wash` #e8f6ee · "Giriş Yap" zemini **rgb(0,157,79)** |
| m4 | eyebrow **"Hareketi Anlamak"** · **254 satır** · eski sağ ok **0** · `.sr-caret` **254** · tıklayınca açılıyor, detay bağlantısı var |
| m10 | `fit-planim.css` `<link>` ile · sıra **shell(1) < fit-planim(2) < fit-type(3)** · sayfa içi `<style>` **0** · kart radius **24px** / column-gap **44px** |
| m5+6 | `hakkimizda`'da izinsiz yaslanan blok **0** · geniş `.jt-flow` → **justify** · dar `.jt-flow` → **start** |
| m9 | @1440 footer **fixed** + margin-bottom **579.53 px** · @390 footer **static** + **0** |
| m8 | harita yüklü · **18 bölge** · gerçek tıklama `quadriceps`'i seçti |

## 6d · Depo durumu

```
$ git status --short
(boş)
$ git status -sb
## main...origin/main
```

Çalışma ağacı **temiz**, `main` **origin ile eşit**.

---

# 7 · SONRAKİ OTURUMUN İLK ÜÇ İŞİ

**1 · Madde 1'i kapat (`--sec-pad`).** Beyar'dan A/B kararını al, uygula,
üç sayı tek dosyada. Uygulandıktan sonra **tam site taraması üç genişlikte**
koşturulmalı — banner aile yükseklikleri `--sec-pad` okumuyor ama sayfa
yükseklikleri değişeceği için R11 perde ölçümü tazelenmeli.

**2 · Madde 2'yi Beyar'a tekrar sor (gastro kırmızısı).** İki tur üst üste
cevapsız kaldı. Soru **marka sorusu**, kontrast sorusu ondan sonra geliyor:
DadaFit sayfasında `--food` bilerek mi duruyor? Cevap gelmeden rengi
koyulaştırmak soruyu sessizce cevaplamak olur.

**3 · Yaslama kararını Beyar'a göster.** §3'teki durum lead kararıdır ve
onaylanmadı. Sitede yaslanan blok bugün **0**; Beyar bunu görüp "böyle
kalsın" ya da "şu bölümler yaslansın" demeli. İkincisi olursa iş `.jt-flow`
sınıfını ilgili sarmalayıcıya eklemekten ibaret — kural yazılmayacak.

> **Açılışta koşturulacak:** `python3 -m http.server 8811 &` ·
> `export PW_HOME=~/.pw` · `gh auth status` (aktif hesap **gaviaworks-dev**
> olmalı — K36) · sınamalara base'i **elle ver**, varsayılan `:8822` kapalı.
