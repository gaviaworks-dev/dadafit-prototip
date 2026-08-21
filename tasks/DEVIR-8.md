# DEVİR 8 — YENİ OTURUMUN TEK BİLGİ KAYNAĞI

**Depo:** `~/Developer/Projects/dadafit-prototip` · **Canlı:** `gaviaworks-dev.github.io/dadafit-prototip`
**R8 taban commit:** `654f353` · **Branch:** `main`
**Brief:** `tasks/REVIZYON-8.md` · **Kararlar:** `KARARLAR.md` (K1–K65)
**Önceki devir:** `tasks/DEVIR-7.md`

> **DEVIR-7'nin kuralı sürüyor: iddia yok, ölçüm var.** Her sayının yanında
> onu üreten ölçüm yazılı. Bu turda ölçülmeyen şey **"R8'de ölçülmedi"**
> diye işaretli.
> Ölçüm koşulları: yerel `http://localhost:8811`, Playwright/Chromium,
> genişlikler 1440 · 1024 · 768 · 390. Tarih 21 Ağustos 2026.

---

# 0 · BU TUR NASIL KOŞTU

**Yedi ajan paralel:** A (kabuk) · B (sözlük) · C (anatomi+modal) · D (egzersiz) ·
E (hub/program/testler) · F (destek) · G (antrenör profili).
Ajanlar commit atmadı, birleştirmedi, push etmedi — lead yaptı.

**39 kalem + 5 karar.** Kalemlerin **hepsi kapandı**; kapanışların tamamı
lead tarafından **bağımsız ölçümle** doğrulandı (ajan sınamaları ayrıca
koşturuldu, ama kapanış kararı ajanın raporuna değil kendi ölçümüne dayandı).

---

# 1 · BEYAR'IN KARARLARI — beşi de ölçümle geldi

| # | Konu | Karar | Kütük |
|---|---|---|---|
| **K-A** | `--sec-pad` rampası | **B** — rampanın tamamı (74·74·74·44) | **K59** |
| **K-B** | Yaslama | **A** — `.jt` kancası kalır; kapsam ölçümle 18 bloğa indi | **K65** |
| **K-C** | "Hareket merkezi" hedefi | `egzersiz-kutuphane-v1`; 9 kardeş durur | **K60** |
| **K-D** | `.fp-gate-in` | cümle gider, giriş düğmeleri kalır | **K59–65 arası** |
| **K-E** | "Planım" misafirde | gizli — referanstan **bilinçli ayrışma** | **K61** |

**Tur içinde ölçüm karara müdahale etti — üç kez:**
1. **K-C** brief'te "komple kaldır"dı; ölçüm menü kalemi olduğunu gösterdi (25 dosya · 33 geçiş · `fit-shell.js:67` nav href'i) → hedef sorusu doğdu.
2. **Kalem 30** kararı bir kez verildi, ajan daha derin ölçünce **güncellendi** ("7 soru" → "7 soru · 1 dakikadan kısa").
3. **K-B** kapsamı, brief'in kendi dışlama kuralıyla çeliştiği ölçülünce **18 bloğa indirildi**.

---

# 2 · SABİTLER — R8'de yeniden ölçüldü

| Sabit | Değer | Ölçüm |
|---|---|---|
| `--sec-pad` | **74 · 74 · 74 · 44** (@1440·1024·768·390) | R8 · `.sec` computed padding-top, dört genişlik · **K59'da değişti** |
| `--sec-pad-sm` | 32 · 26 · 26 · 22 | R8 · değişmedi |
| Banner **liste** | **544** @1440 · **607** @1024 · **587** @390 ×54 | R8 · tam site taraması, üç genişlik |
| Banner **detay** | **560** · **617** · **726** ×8 | R8 · aynı; ayrıca 25/25 egzersiz slug'ında sapma 0 |
| Sözlük | **254 terim** · **29 harf** · `.sr-caret` **254** · kart **28 → 1** | R8 · `#szList .sz-item` |
| Egzersiz kataloğu | **25 hareket** | R8 · `.ex-card` |
| Anatomi | **31 kas kaydı** · görünüm başına **18 bölge** · viewBox `0 0 758 1380` | R8 · `Object.keys(ANATOMI_VERI.kaslar)` |
| R11 perdesi | @1440 açık, sapma **0 sayfa** · @390 kapalı | R8 · site taraması |
| Sayfa sayısı | **66** (65 + yeni `destek-v1.html`, silinen `hareket-merkezi-v1.html`) | R8 |
| Süit | **28 sınama** (R7'de 21) | R8 |

---

# 3 · YENİ ÖĞRENİLEN TUZAKLAR

DEVIR-7 §4'ün devamı (B22–B24 orada).

## B25 · Ajan adı çakışırsa YENİ ajan sonek alır, ESKİ ad canlı kalır

R8'de yedi ajan açıldı; altısı **`-2` soneki** aldı (`AJAN-A-2` … `AJAN-F-2`),
yalnız `AJAN-G` temiz ad aldı. Önceki turlardan kalma soneksiz ajanlar
**hâlâ canlıydı**. Lead'in `SendMessage({to:"AJAN-A"})` çağrıları **eski
ajana** gitti: K-C kararı, `.fp-gate-in` kararı, F'nin dosya adları ve C'nin
modal kararı hedefine ulaşmadı.

**Neden fark edilmedi:** `SendMessage` "başarılı" döndü — teslim edildi ama
**yanlış kutuya**. Dahası eski ajanlar işi reddetmeyip **yapmaya başladı**;
biri aynı çalışma ağacında `tests/plan-account.mjs`'i düzenledi, biri
`fit-shell.js`'in iki bölgesini yazdı.

**Nasıl anlaşıldı:** R6'dan kalma bir ajan *"bu mesaj yanlış F'ye geldi, ben
R6'nın arama ajanıyım"* diye **kanıtla** itiraz etti (`git log -S`, kendi kütüğü).

> **Kural:** ajan açtıktan sonra **spawn sonucundaki adı** kullan, brief'te
> yazdığın adı değil. Mesaj gönderdikten sonra **cevabın geldiğini** doğrula
> — "gönderildi" teslim değildir. Aynı adla ikinci ajan açılıyorsa adı turla
> damgala.

## B26 · Rapor KÜTÜĞE yazmak rapor değildir

**Üç ajan** raporunu dosyaya yazdı ama `SendMessage` ile göndermedi. Lead
dosya değişikliklerinin durduğunu görüp "ajan takıldı" sonucuna vardı —
ölçüm doğruydu (dosyalar bit düzeyinde sabitti), **çıkarım yanlıştı**:
sabittiler çünkü **iş bitmişti**.

> **Kural:** ilerleme kütüğü lead'in okuduğu yer değil, ajanın kendi
> hafızası. Faz kapanışı **mesajla** bildirilir. Lead tarafında: "dosya
> sabit" hem *bitti* hem *takıldı* demek olabilir — ayırt etmek için
> **ajana sor**, dosya yaşına bakma.

## B27 · Ölçüm aracının kusuru, ölçülenin kusuru sanılır — bu turda ALTI kez

B24'ün genellemesi. Hepsi yakalandı, hiçbiri rapora kusur olarak girmedi:

| Kim | Sonda ne dedi | Gerçek |
|---|---|---|
| **B** | grup başlığı kalkınca "harf rayının çapası gider" | Ray **çapa değil süzgeç** — `id`'li çapa 0, `scrollY` 0→0. Kayıp hiç yoktu |
| **C** | anatomi diyaloğu "hiç açılmıyor" | Kapı `(pointer:coarse)`; Playwright varsayılanı `fine`. `hasTouch:true` ile açıldı |
| **C** | `#msgModal` odak tuzağı 0/20 | `.apt-panel` belgede birden çok; belge kökünden aranıyordu. `kap.querySelector()` → 20/20 |
| **G** | nöbet tabanda `TimeoutError` ile **çöküyordu** | Kırmızı verirken *çökmek* ile *saymak* ayrı; 83 sorun hiç raporlanmıyordu |
| **E** | `.fp-inflow` **−14 px binişme** | `.reveal` `.in` gelmeden `translateY(22px)` taşıyor; ölçüm **animasyon ortasında** alınmış. Gerçek: üst 22 px, binişme yok |
| **LEAD** | sondası üç kırmızı; ayrıca yanlış `visibility` iddiası; `p.an-live` ve `#pgWrap` sahte bulguları | DOM varlığı ≠ görünürlük · kelime araması ≠ krem kutu · `.kaslar` nesne, dizi değil · 1×1 `aria-live` bölgesi · padding ≠ margin |

> **Kural:** sonda kırmızı verince **önce sondayı şüpheli say** — özellikle
> sonda yeniyse ve ölçülen taraf yeşil diyorsa. İki bağımsız ölçüm
> çelişirse üçüncüsünü kur. **Ölçen kim olursa olsun geçerli — lead dahil.**

## B28 · ÖRNEKLEM ÖLÇÜM DEĞİLDİR

K-B kapsamı belirlenirken **üç sayfa** örneklendi: dört ailenin dördü de
"≤2 satır oranı %0" çıktı. **66 sayfa** taranınca `.hr-note` **%38**,
`.qa-body` **%74** oldu. Örnekleme dayanılsaydı **207 kısa blok** sessizce
yaslanacak ve Beyar'ın kendi dışlama kuralı çiğnenecekti.

> **Kural:** site geneli bir karar, site geneli bir taramayla verilir.
> Üç sayfa "hepsinde böyle" demek için yeterli değildir.

## B29 · Brief'in tarifi ÖLÇÜMLE çürüyebilir — bu turda beş kez

| Kalem | Brief ne diyordu | Ölçüm ne buldu |
|---|---|---|
| **25** | *"'Tüm Programlar' → program-liste-v1'e çevir"* | **Zaten oraya gidiyordu** — 9 geçiş, hepsi doğru. Ölçmeden girilse **çalışan bağlantı kırılacaktı** |
| **15** | *"banner'da aşırı boşluk"* | Yükseklik **zaten sabitti** (560/617/726); kusur bandın **içindeki** ölü boşluktu (269→162 @1440) |
| **19** | *"metinlerin tonu sorumluluk reddi"* | O iki sayfada **sorumluluk reddi metni yoktu**; kusur, ağır kullanılan sayfada **hiç güvenlik bilgisi ve yardım kapısı olmamasıydı** |
| **30** | *"'yeni soru · yaklaşık…' ifadesi bozuk"* | Metin **"Yedi soru"** — sayı doğru (7 görünür soru); bozukluk **"yaklaşık 1"in şablon gibi okunmasıydı** |
| **4** | *"Hareket merkezi komple kaldırılacak"* | Sayfa değil **üst menünün kendi hedefiydi**; 9 kardeşin gerçek ebeveyni başka sayfaydı |

> **Kural:** "önce ölç, sonra düzelt" bürokrasi değil. Beş kalemde tarif
> yanlıştı; biri **çalışan bir bağlantıyı kıracaktı**.

## B30 · Tabanda da geçen ölçüt — iki farklı şey olabilir

| Durum | Örnek | Sonuç |
|---|---|---|
| Ölçüt **kalemi kapattığını iddia ediyor** ama kusuru ölçmüyor | Kalem 15: "banner 560/617/726" tabanda da geçiyordu | **Yanlış yazılmış** — ölçüt değiştirildi ("bant içi ölü boşluk ≤ tavan") |
| Ölçüt **açıkça regresyon nöbeti** | Kalem 32 @390: "ölü boşluk 0" tabanda da yeşil | **Meşru** — bir düzeltmeyi değil gelecekteki bozulmayı tutuyor; betikte öyle etiketlenir |

İkisini de **ajanlar kendileri bildirdi** — kayda değer refleks.

## B31 · Bir davranışı ONARAN mekanizma, aynı davranışı ÖLÇEN sınamayı KÖR EDER

Modal odak tuzağı, **açılış odağı** kusurunu maskeliyordu: ilk Tab'da
"odak panelin içinde değilse içeri çek" dalı çalışıyor, ölçüm "20/20 tuzak ✅"
diyordu. Açılış odağı hiç ölçülmüyordu.
Ayrı bir kolon eklendi — **hiç Tab'a basmadan** ölçülüyor.

> **Kural:** onarım ile ölçüm aynı yolu paylaşamaz. Bir kusuru maskeleyen
> mekanizma varsa, ölçüm o mekanizmayı **atlayarak** yapılır.

## B32 · `.gitignore` dizin adına bağlanırsa her tur GERİDEN gelir

R6'da `tasks/r6-shots/` elle eklenmişti. R8'de iki ajan iki yeni dizin adı
uydurdu (`tasks/r8-shots/`, **`ara1/`**) ve ikisi de kapsam dışında kaldı —
`git add -A` ile commit'e girecekti (K51 ihlali).

Kural **dizine değil türe** bağlandı:
```
*.png  *.jpg  *.jpeg  *.webp  *.gif
!assets/img/**
!tasks/h3-akis/**
```
**Doğrulama yöntemi:** `git ls-files` ile bulunan **22 izlenen görsel
varlığın her biri** `git check-ignore` ile tek tek denendi → yanlışlıkla yok
sayılan **0**; dört kaçak → dördü de yakalandı.

> **Kural:** yok sayma deseni yazınca "çalışıyor mu" değil, **"gerçek varlığı
> yanlışlıkla yutuyor mu"** diye ölç.

---

# 4 · SÜİT — 21 → 28 SINAMA

Yedi yeni nöbet yazıldı ve **yedisinin de taban commit'te kaç sorun saydığı**
ölçüldü (K27). "exit 1 aldım" yeterli sayılmadı — G'nin nöbeti ilk hâlinde
tabanda **çöküp** 83 sorunu hiç raporlamıyordu.

| Yeni sınama | Ne ölçüyor | Taban `654f353` | Bugün |
|---|---|---|---|
| `antrenor-profil.mjs` | profil iskeleti · sekme WAI-ARIA · modal 6 borç | **84 sorun** | 0 |
| `hub-program-r8.mjs` | 21–33 · **206 ölçüt** | **120 sorun** | 0 |
| `egzersiz-r8.mjs` | 15–20 · hukuki kapsam 7/7 | **55 sorun** | 0 |
| `kabuk-r8.mjs` | K-A · 1–6 · 20+28 · 36 · E · G | **31 sorun** | 0 |
| `destek-akisi.mjs` | iki akış · sekme rayı · krem kutu | **23 sorun** | 0 |
| `sozluk-r8.mjs` | dört fark · tam parite · 18 ölçüt | **12 sorun** | 0 |
| `modal-anatomi.mjs` | ortak modal iskeleti · 16 ölçüt | **9 sorun** | 0 |

Hepsi ayrı `git worktree` + geçici sunucuda koşturuldu; worktree'ler
kaldırıldı, ana ağaç bozulmadı.

---

# 5 · AÇIK KALEMLER — ölçüldü, bilerek bırakıldı

> Bunlar **kaçmış** değil. Her birinin sayısı ve sahibi yazılı.

| # | Konu | Sayı | Nerede |
|---|---|---|---|
| 1 | `.fit-tab` / `.cnt` referanstan sapıyor | **5 değer**: font-size 13.5↔13 · gap 8↔7 · `.cnt` padding 2px8px↔0 · radius 999↔0 · bg #f9f9f9↔şeffaf | `fit-shell.*`, `[data-fit-tabs]` kullanan her sayfa |
| 2 | `.lib-top h1` | 39px taban (computed 42 @1440) ↔ gastro **44** | kabuk, 66 sayfa |
| 3 | `sss-v1 .qa-head` line-height | computed `normal` ↔ gastro **24.025px** | tek satırlık düzeltme; `destek-akisi.mjs` NOT olarak yazdırıyor |
| 4 | `profil-v1` ölü modal kodu | **~45 satır** — `role=antrenor`ta erişilemez (`:4205 location.replace`) | temizlik ayrı kalem |
| 5 | `sozluk-veri.js:1515` `S.aramalar()` | çağrılmıyor | paylaşılan modül |
| 6 | `.cp-exp-lbl` alt boşluğu | **0 px**, iki genişlikte | `antrenor-detay-v1` sayfa-yerel |
| 7 | Yasal bantta satır sonu ayracı @390 | asılı `\|` — **tabanda da vardı** | bant "dokunulmaz" |
| 8 | Kurumsal bant @390 son satır tek kalem | 8 iken çift satır tamdı | kalem eklenirse kapanır |
| 9 | `fit-testleri` iki sağlık notu tekrarı | biri liste sonunda, biri `:428` | birleştirme kalem değildi |
| 10 | `challenge-v1` "Geçmiş" eyebrow'u | başlıkla arası **0 px** | kalem 26'nın kardeşi |
| 11 | Bilgi mimarisi | `program-liste-v1` ↔ `programlar-merkezi-v1` **iki ayrı program listesi** | "Tüm Programlar" birine, menü öbürüne gidiyor |
| 12 | `.ft-q` sınıfı iki iş taşıyor | `data-q="1..7"` + `data-q="olcum"` — gevşek seçici **8** sayar | tuzak |
| 13 | Soru sayısı elle yazılı | "7 soru" iki yerde, DOM'dan türetilmiyor | ayrı kalem |
| 14 | Kalan yaslama aileleri | `.hr-note` 42 blok · `.qa-body` 257 blok — ≤2 satır oranı %38/%74 | K65 kapsamı bilerek dar |

**DEVIR-7'den devreden, R8'de ÖLÇÜLMEYENLER:**
`enerji-defteri-dengele` eyebrow'unda gastro kırmızısı (`--food` **4.07:1**,
AA altı — **üç tur üst üste cevapsız**, marka sorusu önce) ·
`giris-v1` h1 sol kenarı **827 px** (63/64 sayfa 132) ·
`.btn-primary` site genelinde sayılmadı ·
`--fit-wash` #e8f6ee ↔ `--fit-tint` #eaf6ef (ΔR2·ΔG0·ΔB1) ·
`fit-type.css` §3'teki ölü istisna seçicileri ·
**Higgsfield kredisi** (R7'de MCP "not connected", yine doğrulanmadı).

---

# 6 · SONRAKİ OTURUMUN İLK ÜÇ İŞİ

**1 · Gastro kırmızısını Beyar'a SOR.** `--food` **4.07:1**, AA eşiğinin
altında ve **üç tur üst üste cevapsız**. Soru marka sorusu: DadaFit
sayfasında bilerek mi duruyor? Cevap gelmeden rengi koyulaştırmak soruyu
sessizce cevaplamak olur.

**2 · `.fit-tab` / `.cnt` beş sapmasını kapat.** Ortak bileşen, tek yerde
düzeltilir, `[data-fit-tabs]` kullanan her sayfayı hizalar. Kalem 37'nin
tipografi ölçüsü **⚠️ açık** olarak devrediyor — ölçüldü, kapsam gereği
bırakıldı.

**3 · Ölü kodu ayıkla.** `profil-v1` ~45 satır erişilemez modal ·
`S.aramalar()` · `fit-type.css` §3'teki ölü istisnalar. Üçü de artık
güvenli: `hizalama-nobeti.mjs` ölçüt 4 sonuncusunu nöbetliyor.

> **Açılışta koşturulacak:** `python3 -m http.server 8811 &` ·
> `export PW_HOME=~/.pw` · `gh auth status` (aktif hesap **gaviaworks-dev**
> olmalı — K36) · sınamalara base'i **elle ver**.
