# REVİZYON-12 — DALGA PLANI

**Durum:** ONAY BEKLİYOR · agent açılmadı · koda dokunulmadı
**Kütük:** `tasks/REVIZYON-12.md` (15 madde, hepsi canlı DOM'da ölçüldü)
**Kural:** Lead koordine eder, kod yazmaz. Teammate'ler Sonnet, her agent **tek pass**.
Ortak dosyada full-file overwrite yasak — yalnız hedefli edit.

---

## 0 · Neden bu bölünme

Tek gerçek çakışma noktası **kabuk**: `assets/css/fit-shell.css` (66 sayfa) ve
`assets/js/fit-shell.js`. 15 maddenin **7'si** kabuğa dokunmak zorunda
(R1 · R3 · R4 · R10? · R11 · R12 · R13 · R15). Bu yüzden kabuk **tek agent'ın**
mülkü; diğerleri kabuğa hiç dokunmaz, ihtiyaçlarını **Dalga 1'de** ondan alır.
Geri kalan 14 madde birbirinden bağımsız `*-v1.html` dosyalarında yaşıyor —
sayfa başına bir agent, çakışma sıfır.

---

## 1 · Grup tablosu (9 grup · dosya çakışması sıfır)

| Grup | Agent adı | SAHİP dosyalar (yalnız bu agent yazar) | Maddeler |
|---|---|---|---|
| **G1** | `kabuk-12` | `assets/css/fit-shell.css` · `assets/js/fit-shell.js` · `tests/plan-account.mjs` · `tests/header-banner.mjs` | R1 · R3a · R4a · R11 · (R12/R13/R15'in kabuk hazırlığı) |
| **G2** | `sozluk-12` | `sozluk-v1.html` | R2 · R3b |
| **G3** | `program-detay-12` | `program-detay-v1.html` | R4b |
| **G4** | `fit-testleri-12` | `fit-testleri-v1.html` | R5 |
| **G5** | `test-detay-12` | `fit-testi-detay-v1.html` | R6 · R7 · R8 · R9 |
| **G6** | `antrenorler-12` | `antrenorler-v1.html` | R10 |
| **G7** | `enerji-defteri-12` | `enerji-defteri-v1.html` | R12 |
| **G8** | `hesabim-12` | `hesabim-v1.html` · `destek-v1.html` · `pro-v1.html` | R13 · R14 |
| **G9** | `gecmis-12` | `fit-planim-gecmis-v1.html` | R15 |

**Çakışma denetimi:** Her `*-v1.html` tek grupta. Kabuk CSS/JS ve iki nöbet dosyası
yalnız G1'de. G8'in ek dosyaları (destek/pro) başka hiçbir grupta yok.

---

## 2 · Dalga sırası (aynı anda en fazla 4 agent)

### DALGA 1 — kabuk (1 agent)

| Agent | Maddeler | Çıktı |
|---|---|---|
| `kabuk-12` | R1 · R3a · R4a · R11 | Gölge kararı uygulanır · dikiş işaretleyicisi şeffaf blok davranışı · dropdown kalemi · nöbet beklentileri taşınır |

**Neden yalnız:** Dalga 2 ve 3'ün **altısı** bu dosyalardan çıkan sonuca bakıyor
(gölge kalkacak mı, `.fit-tabs` ortalanacak mı, `.fp-profil` hazır mı, `OVER_MODE`
listesi değişecek mi). Kabuk yarım kalırsa alt dalgalar yanlış zemine yazar.

Bu dalgada ayrıca **hazırlık** yapılır (uygulama değil, yalnız kabukta kural/kanca):
`.fit-tabs` ortalama seçeneği (R15/R12 için), `OVER_MODE` ve `header-banner` listelerinin
R13 sonrası hâli, `.fit-note` üst boşluğu kararı (S5 "kabuğa" derse burada).

### DALGA 2 — bağımsız sayfa düzeltmeleri (4 agent)

| Agent | Maddeler | Neden bu dalgada |
|---|---|---|
| `sozluk-12` | R2 · R3b | R3b, Dalga 1'deki gölge kararını görmüş olacak |
| `program-detay-12` | R4b | Dikişin `#pgWrap`'e inmesi Dalga 1'de çözülmüş olacak |
| `fit-testleri-12` | R5 | Bağımsız |
| `test-detay-12` | R6 → R9 → R7 → R8 (bu sırayla, tek pass içinde) | R9, R6 düzeldikten sonra **yeniden ölçülür**; R8, R7 ile aynı blok |

### DALGA 3 — profil kalıbı ve boşluk işleri (4 agent)

| Agent | Maddeler | Neden bu dalgada |
|---|---|---|
| `antrenorler-12` | R10 | S5 kararı: yalnız sayfa kuralı → kabuk agent'ına iş düşmedi |
| `enerji-defteri-12` | R12 | Kabuktaki `.fit-tabs` kararına bağlı |
| `hesabim-12` | R13 → R14 | `.fp-profil` kalıbı ve `OVER_MODE`/`header-banner` Dalga 1'de hazır |
| `gecmis-12` | R15 | Kabuktaki `.fit-tabs` kararına bağlı |

**Bağımlılık kontrolü:** Bağımlı madde çifti aynı dalgada **yok** —
R3b/R4b/R12/R13/R15 ← Dalga 1 · R9 ← R6 (aynı agent, sıralı) · R14 ← R13 (aynı agent, sıralı).

---

## 3 · Dalga sonu protokolü (değişmez)

1. Tasarım dokunuşu **EVET** olan her madde (R1–R10, R12–R15 · yani R11 hariç hepsi)
   **lead denetiminden** geçer: agent bitirir, lead **canlı/yerel DOM'da ölçer**.
   RED ise yama yapılmaz, bölüm iskeletten yeniden kurulur.
2. Ölçüm **iki bağımsız yöntemle** doğrulanır (ör. `getBoundingClientRect` + `Range`,
   ya da geometri + ekran görüntüsü). Agent'ın "yaptım" beyanı kanıt değildir.
3. Handoff §4'teki **6 nöbetçi kontrol** her dalga sonunda koşar, hepsi yeşil
   olmadan dalga kapanmaz:
   `header-banner` · `hizalama-nobeti` · `crumb-home` · `footer-yapi` ·
   `plan-account` · `plan-kayit` (+ değişen alanlara göre `kabuk-kalite` ·
   `egzersiz-katalog` · `sozluk-kapalilik` · `fit-test-lock` · `enerji-hesap`).
4. Dalga bitince **DUR**. Kısa yazılı rapor: bulgu + sonuç. Ekran görüntüsü sunulmaz.
   Onay alınmadan sonraki dalgaya geçilmez.
5. Tüm dalgalar bitince yerel sunucu kaldırılır, tek yerel link verilir.

---

## 4 · Risk notları

| # | Risk | Önlem |
|---|---|---|
| 1 | **Kabuk 66 sayfayı etkiliyor.** `.fit-seam` gölgesi 50 sayfada, `.fit-note` 66 sayfada, dropdown her sayfada. | Kural değiştirmeden **dosya sonuna ekle**, gerekçeyi yorumda yaz (`docs/lessons.md` §9). Önce/sonra ölçüm zorunlu. |
| 2 | **Nöbet beklentisi değişecek** (R11 → `plan-account` 11→12 kalem; R13 → `header-banner` BANNER→PLAIN). | Asıl garanti korunur, yalnız ölçüm noktası taşınır; gerekçe nöbet dosyasına yazılır (`docs/lessons.md` §5). Nöbeti "geçsin diye" gevşetmek yasak. |
| 3 | **DadaDiet referansları giriş duvarında.** `/planim` ve `/hesabim` → `/giris`. Yapı ölçülemedi. | R12/R13/R15 referanssız ilerlerse "DadaDiet'in aynısı" iddiası doğrulanamaz. S8'e bakılacak. Uydurma referans yazılmayacak. |
| 4 | **R13 beyaz zemin + şeffaf header = görünmez logo** (`docs/lessons.md` §10). | Sayfa `OVER_MODE` listesinden çıkarılacak, `.lib-crumb` yerine `.pf-crumb` renkleri kullanılacak. |
| 5 | **R11 hedef sayfası yok.** "Aboneliğim ve Ödemelerim" DadaFit'te ayrı sayfa değil; `hesabim-v1` içinde Üyelik/Ödeme/Faturalar sekmelerinde yaşıyor. | S10 cevaplanmadan kalem eklenmez. "Yakında"/placeholder sayfa üretmek yasak. |
| 6 | **R3 gri zemin bilinçli sapmaydı** (R8 kararı, gerekçe `sozluk-v1.html:80-90`). Beyaza dönünce beyaz üstünde beyaz kart. | S3 ile kart kenarının neyle okunacağı karara bağlanacak; karar `KARARLAR.md`'ye işlenecek. |
| 7 | **R15'te "2 tab" doğrulanamadı** — o sayfada tek ray var, iki katman Enerji Defteri'nde. | S9 ile netleşecek; yanlış sayfada iş yapılmayacak. |
| 8 | **R14 kapsamı belirsiz.** | S7 onaylanmadan G8 ikinci maddeye geçmez. |
| 9 | **R5'te "divider" iki şeye işaret edebilir**; ölçüm alt çizginin zaten hizalı olduğunu söylüyor. | S4 cevaplanmadan G4 başlamaz. |
| 10 | **`--measure` devrik** (R11/M5 kararı): `.hr-note p{max-width}` yok, satır 148 karakter. | R7/R8'de metin işine girilirken bu karar **geri alınmayacak**; yalnız ilgili blok düzeltilecek. |

---

## 5 · Cevaplanan sorular (Beyar · 2026-08-24)

| # | Madde | Karar | Sonucu |
|---|---|---|---|
| S1 | R1·R3·R4 | **`.fit-seam` gölgesi tümüyle kalksın** | Dikiş yalnız 22px yuvarlak köşe + `is-onbanner` binmesiyle okunacak. 50 sayfayı etkiler; Gastro paritesinden bilinçli sapma → `KARARLAR.md`'ye yeni madde |
| S2 | R2 | **16px** | `.sd-ex` alt + `.sd-more` üst margin toplamı 32 → 16 |
| S3 | R3 | **1px `--line` kenarlık** | `.sz-body` beyazlaşınca terim kartı hairline kenarlıkla okunacak; gölge eklenmeyecek |
| S4 | R5 | **Çip rayı hizalansın** | `.ft-meta` üst kenarı tüm kartlarda tek değer olacak; alt çizgi zaten hizalı, çip taşması bu turda kapsam dışı |
| S5 | R10 | **Yalnız `antrenorler-v1.html`** | Kabuk `.fit-note` kuralına dokunulmayacak → **R10 grubu G6'da kalır, Dalga 3** |
| S6 | R13 | **Plan sayfalarının `.fp-profil` kalıbı** | Koyu `.lib-top` kalkar, beyaz profil başlığı gelir, `#hsRail` altına iner; sayfa `OVER_MODE`'dan çıkar, `header-banner` BANNER→PLAIN |
| S7 | R14 | **`destek-v1` + `pro-v1`** | G8'in sahip dosyaları kesinleşti: `hesabim-v1.html` · `destek-v1.html` · `pro-v1.html` |
| S8 | R12·R13·R15 | **Beyar tam sayfa ekran görüntüsü verecek** | DadaDiet `/planim` ve `/hesabim` giriş duvarında; görüntüler gelmeden **Dalga 3 başlamaz** (G7 · G8 · G9) |
| S9 | R15 | **İki katman Enerji Defteri'ndeydi** | R15'te yalnız sekme ortalama + bölüm içeriklerinin dikey merkezlenmesi yapılacak; ikinci ray işi R12'de |
| S10 | R11 | **`hesabim-v1.html#uyelik`** | Yeni sayfa üretilmeyecek; mevcut "Üyelik" sekmesine çapa. `hesabim-v1.html`'de `#uyelik` çapasının varlığı G1 tarafından doğrulanacak, yoksa G8'den talep edilecek |

### Kararların plana etkisi

1. **G6 (`antrenorler-12`) Dalga 3'te kalır** — S5 "yalnız sayfa" dediği için kabuk agent'ına iş düşmedi.
2. **G8'in dosya listesi kesin:** `hesabim-v1.html` · `destek-v1.html` · `pro-v1.html`.
   Bu üç dosya başka hiçbir grupta yok → çakışma hâlâ sıfır.
3. **Dalga 3 bir ön koşula bağlandı:** DadaDiet `/planim` ve `/hesabim` tam sayfa
   ekran görüntüleri. Gelmezse G7/G8/G9 başlamaz; G6 tek başına koşabilir.
4. **S10 bir çapraz bağımlılık doğurdu:** R11 (G1, Dalga 1) `hesabim-v1.html#uyelik`
   hedefine bağlanıyor ama o dosyanın sahibi G8 (Dalga 3). G1 **yalnız okur**,
   çapa yoksa yazmaz — eksikse G8'in görevine eklenir.
5. **S1 kararı `KARARLAR.md`'ye işlenecek** (Gastro paritesinden bilinçli sapma),
   `docs/lessons.md` §8 gereği gerekçesiyle birlikte.

---

## 6 · Onay bekleyen tek şey

**Bu plan.** Onay gelirse Dalga 1 (`kabuk-12`) tek agent olarak açılır.
DadaDiet ekran görüntüleri Dalga 3'ten önce gerekli, Dalga 1–2'yi bloklamaz.

---

## 7 · Dalga sonuçları

- **DALGA 1 · `kabuk-12` — YEŞİL** (2026-08-24) · R1·R3a·R11 kapandı, R4 kabuk işi çıkmadı · `.fit-tabs.is-center` opt-in hazır (0 sayfada kullanımda) · bağımsız ölçüm `olcum-1`: 9/9 GEÇTİ, 6 nöbet 0 sorun, dikiş 50/42/8 korundu · commit `9851efe` `7d830de` `f9ac8d7` → push `b5d1ac5..f9ac8d7`
  - Açık borç (bu turun regresyonu değil): `hesabim-v1.html#uyelik` ve `#odeme` çapalarında `#hsRail` aktif-sekme vurgusu ilk yüklemede geç güncelleniyor (scrollspy zamanlaması). Kütüğe not, ayrı madde.
- **DALGA 2 — YEŞİL** (2026-08-24) · R2·R3b·R4·R5·R6·R7·R8·R9 kapandı · bağımsız ölçüm `olcum-2`: 16/16 GEÇTİ, 8 nöbet 0 sorun · dikiş 50/43/7 (program-detay ray-altından binene geçti, beklenen) · commit `51bb5af` `20edf5c` `b856766` `b95864c` `c631510` `cfef58a` `fe8c3d9`
  - R6'nın kök nedeni kütükteki tahminden farklı çıktı: `div#kimler.ft-blk` hiç kapanmıyordu; tek eksik `</div>` sonraki tüm kapanışları kaydırıp aside'ı sol kolona düşürüyordu. R9 bunun sonucu olarak kendiliğinden kapandı.
  - Süreç dersi: paralel builder'lar aynı git index'ini paylaşıyor, `git add` sırasında başkasının dosyası commit'e sızabiliyor. İki ajan da yakaladı ve `git commit -- <dosya>` pathspec'iyle temizledi. Dalga 3'te pathspec'li commit şart koşuldu.
- **DALGA 3 — YEŞİL** (2026-08-24) · R10·R13·R15 kapandı · R14 gerekçeyle uygulanmadı (açık borç) · bağımsız ölçüm `olcum-3b`: 14/14 GEÇTİ, 10 nöbet 0 sorun, `header-banner` 22 sayfa × 4 genişlik 0 sorun · commit `9268700` `29a9b72` `68aebd1` `0658a3d` `a6ecc1a`
  - **Dikiş envanteri değişti: 50/66 → 49/66 · binen 42 · ray-altı 7 · dikişsiz 17.** Sebep: R13'te `hesabim-v1` koyu `.lib-top` bannerını kaybetti, dikilecek koyu kenar kalmadı. Handoff §5'teki "dikişsiz 16 sayfa" listesi **17'ye** çıktı, yeni üye `hesabim-v1`. Regresyon değil, aynı turun kendi etkisi — devir notunda güncellenmeli.
  - **R14 kapatılmadı (lead kararı, gerekçeli):** `destek-v1` ve `pro-v1` ölçüldü — ikisi de `.lib-img:none` (kapak görseli yok) ve sayfalarda gösterilecek kişisel kimlik verisi yok. `.fp-profil` özünde kimlik kartı (kapak + avatar + ad + üyelik). Bu iki sayfaya uygulamak uydurma kapak/avatar gerektirir → "sahte görsel koyma" yasağı. Beyar'ın şikâyet görseli Hesap ve Ayarlar sayfasındandı, o kapandı. Alternatif (kapak görseli vererek düz bannerı kırmak) ayrı bir tasarım kararı.
  - **Zebra bulgusu (R15):** Beyar "zebra deseni var" demişti; ölçüm zebra bulamadı — CSS'te hiç `nth-child`/alternatif zemin kuralı yok, 6 satır `localStorage` ile doldurulup ölçüldü, hepsi şeffaf. Açık borç: Beyar hangi ekranı kastettiğini göstermeli.

### DadaDiet referans ölçümü (`ref-diet`, canlı, 2026-08-24)

Giriş yapıldı, dört tam boy ekran görüntüsü alındı (`docs/screenshots/REF-diet-*.png`,
`.gitignore` `*.png` kapsamında — commit edilmedi), yapı DOM'dan ölçüldü, çıkış yapıldı.
Parola hiçbir dosyaya yazılmadı (repo grep ile doğrulandı: 0 eşleşme).

**İki bulgu Beyar'ın gerekçesini çürüttü — istek yine de karşılandı/karşılanacak:**

1. **R15 · "sekmeler dietteki gibi merkezi değil" — referans da merkezi DEĞİL.**
   `dadadiet.com/planim` ve `/hesabim` sekme raylarının ikisi de `justify-content:normal`,
   sola dayalı; DadaFit'le **aynı desen**. Beyar büyük olasılıkla DadaDiet'in üst site
   menüsünü (o gerçekten `center`) plan sayfası sekmeleriyle karıştırdı.
   **Lead kararı: ortalama GERİ ALINMIYOR.** Beyar'ın istediği görsel sonuç netti
   ("merkezi olsun"), gerekçesi yanlış çıktı ama istek zararsız: kural
   `body[data-fit-page=...]` önekiyle yalnız o sayfaya kilitli, sapma 0px, dört plan
   sayfası ölçüldü ve etkilenmedi. Beyar isterse tek satırla geri alınır.

2. **R13 · kapak yüksekliği DadaDiet'ten 40px fazla — ama sapma değil, farklı referans.**
   DadaFit `.fp-kapak` = **280px**, DadaDiet `.pf-banner` = **240px**.
   Sebep: R11/M17'de plan profili **DadaGastro'nun** `sefler/admin` `.pf-top`
   kalıbından ölçülmüştü (handoff §3: "kapak 280/24px · avatar 128 · birebir"),
   DadaDiet'ten değil. İki kardeş marka farklı ölçü kullanıyor.
   Kart geometrisinin geri kalanı (binme −78px, avatar 128×128/−70px, radius 24px)
   **üç markada da aynı**. **Lead kararı: dokunulmuyor** — 280px 14 plan sayfasında
   ortak, değiştirmek R13'ün kapsamı dışında ve hepsini etkiler. Açık borç olarak kayıtlı.

**R12 için referanstan çıkan net iş listesi** (builder'a verildi):
ikinci sekme rayı kalkacak · kalemleri kaybolmadan taşınacak · sondaki fazladan gri bölüm
birleşecek · birinci rayın `sticky` davranışına dokunulmayacak (referansta sticky yok ama
`.pf-tabbar` 14 plan sayfasında ortak) · ray **ortalanmayacak** (referans sola dayalı).
- **R12 (ek tur) — YEŞİL** · DadaDiet referansı ölçüldükten sonra `enerji-defteri-12` kapattı: ikinci sekme rayı kalktı (2→1), üç kalem `.df-hcta` şeridine taşındı, self-link "Bugün" düşürüldü, sondaki gri bölüm aynı zemine alındı · bağımsız ölçüm `olcum-4`: 7/7 GEÇTİ, kırık çapa 0/10, 11 nöbet 0 sorun, **14/14 madde regresyonu korundu** · commit `4abd837` `9ef5625`
- **CANLI YAYIN DOĞRULANDI** (2026-08-24) · `olcum-4` canlıda ölçtü: Y0–Y6 hepsi GEÇTİ · R1 gölge none (2 sayfa) · R6 aside x=960 w=348, @390 tek kolon · R13 `.fp-profil` + logo kontrastı 16.7:1 + `#hsRail` 10 sekme + `#uyelik` çapası · dropdown 12 kalem, hedef 200 · R12 `nav.fit-tabs`=1 · dikiş envanteri canlıda da 49/42/7/17
  - Not: canlı dikiş sondası ilk denemede CDN gecikmesiyle flaky çıktı (48/41/7/18), ikinci koşuda yerelle birebir aynı. Sonda bekleme süresi tek sayfada yetmiyor — canlıya karşı koşulurken tekrar edilmeli.

## 8 · Turun kapanışı

**13/15 madde kapandı ve canlıda doğrulandı.** Açık kalan iki madde:
- **R14** — `destek-v1` + `pro-v1`: `.fp-profil` uygulanmadı (kimlik verisi ve kapak görseli yok, uydurma içerik yasak). Alternatif: kapak görseli vererek düz bannerı kırmak — ayrı tasarım kararı.
- **Zebra (R15 eki)** — Beyar "zebra deseni var" dedi, ölçüm bulamadı. Hangi ekran kastedildiği netleşmeli.

**Devir notunda güncellenecek (`tasks/handoff.md`):**
§3 dikiş ölçümü 50/66 · binen 42 · ray-altı 8 → **49/66 · binen 42 · ray-altı 7**
§5 "dikişsiz kalan 16 sayfa" → **17 sayfa**, yeni üye `hesabim-v1` (R13'te koyu bannerını kaybetti)
§4 nöbet tablosu: `header-banner` artık `hesabim-v1` (PLAIN) + `destek-v1`/`pro-v1` (BANNER) kapsıyor; `plan-account` 11 → **12 kalem**
