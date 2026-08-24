# REVİZYON-12 — Beyar turu · TOPLAMA KÜTÜĞÜ

**Durum:** **LİSTE BİTTİ** · 15 madde toplandı · plan `tasks/REVIZYON-12-plan.md`
**Kural:** bu turda kod yazılmaz, dosya değiştirilmez. Yalnız kayıt + yer tespiti.
**Ölçüm adresi:** canlı yayın `https://gaviaworks-dev.github.io/dadafit-prototip`
(Playwright · 1440×1000 · deviceScaleFactor 2). Yerel sunucu `127.0.0.1:8788` ayakta.

**Playwright ile "göz gerektiren" ölçülen maddeler** (Beyar'ın notu 3):
R1 · R2 · R3 (gölge/zemin, kutu-metin mesafesi) · R5 (çip rayı hizası, 6 kart × 2 genişlik) ·
R6 (grid kolon yerleşimi, ata zinciri) · R7 (`<b>` display/punto, kutu+`Range`) ·
R8 (`Range` ile legend metni, 6px) · R9 (kart arası 0px) · R10 (blok arası 0px) ·
R12 (iki sekme katmanı) · R13 (banner/blok envanteri) · R15 (sekme x konumları,
`align-items`). Her ölçüm canlı yayına karşı koştu.

---

## R1 — Hareket/Yeni Başlayanlar: beyaz gövde ile gri bölüm arasındaki gölge

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/hareket-yeni-baslayanlar-v1.html
Görsel: `docs/screenshots/R12-01-hareket-yeni-baslayanlar-golge.png` (Beyar'ın ekranı)
· `docs/screenshots/R12-01-kanit-dikis-golgesi.png` (canlıdan ölçüm kanıtı)

**Beyar'ın sözü:** "burda gölge olmasın"

**Anlaşılan istek:** Giriş metnini taşıyan beyaz bölümün alt kenarında, gri
"BAŞLARKEN" bölümüne geçerken beliren gölge bandı kalksın.

**Görselden okunan:** Beyaz metin bloğu ("Spora başlamanın 'doğru' bir yaşı…")
bitiyor, hemen altında gri (#f9f9f9) SSS bölümü başlıyor. İki bölümün tam
sınırında yumuşak koyu bir gölge bandı görünüyor — beyazdan griye geçiş temiz
değil, araya gri-koyu bir bulanıklık giriyor.

**Canlı DOM ölçümü (1440px):**
| Eleman | y | h | zemin | box-shadow |
|---|---|---|---|---|
| `section.lib-top` (koyu banner) | 0 | 544 | `rgb(27,25,19)` | none |
| `section.sec.sec-fit.fit-seam.is-onbanner` | 522 | 307 | `#fff` | **`rgba(20,16,10,.18) 0 -12px 32px`** |
| `section.sec.sec-fit` (gri SSS) | 829 | 1029 | `rgb(249,249,249)` | none |

Gölgenin kaynağı beyaz bölümün kendisi: `.fit-seam` kuralı. Ofset `-12px`
(yukarı), blur `32px`. Blur yarıçapı ofseti aştığı için gölge **alt kenardan da
~4px taşıyor** ve gri bölümün üstüne düşüyor. Sayfanın o bölgesinde
`box-shadow` taşıyan başka görünür eleman yok (tüm `body *` tarandı).

**Dosyalar:**
- `assets/css/fit-shell.css:3174-3189` — `BANNER → GÖVDE DİKİŞİ` bloğu
  (`.fit-seam{box-shadow:0 -12px 32px rgba(20,16,10,.18)}` ·
  `.fit-seam:not(.is-onbanner){box-shadow:0 -10px 26px rgba(20,16,10,.07)}`)
- `assets/js/fit-shell.js:3333-3415` — `BANNER → GÖVDE DİKİŞİ` işaretleyicisi
  (`.fit-seam` / `.is-onbanner` sınıflarını çalışma anında basar)
- `hareket-yeni-baslayanlar-v1.html` — sınıfı taşıyan bölüm işaretlemesi

Tasarım dokunuşu: **EVET**
Bağımlılık: **R3** (aynı `.fit-seam` gölgesi, aynı kural)

**Bitti kriteri:** `hareket-yeni-baslayanlar-v1.html` @1440'te beyaz bölümün alt
kenarı (y≈829) ile gri bölümün arasında ölçülebilir gölge yok — o bölgede
`box-shadow` taşıyan eleman **0**, sınırda renk `#fff → #f9f9f9` tek adımda geçiyor.

**SORU:** Bu gölge kabuk kuralı; canlıda **50 sayfada** basılı ve R11/M1'de
DadaGastro'dan birebir ölçülerek alındı (üst kenarda koyu banner'ın üstüne
düşen kısmı dikişin kendisi). Kaldırılması istenen ne?
→ bkz. liste sonu soruları.

---

## R2 — Sözlük: "terim sayfası" bağlantısı ile üstündeki alıntı arası boşluk fazla

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/sozluk-v1.html
Görsel: `docs/screenshots/R12-02-sozluk-terim-sayfasi-bosluk.png` (canlıdan, akordeon açık)

**Beyar'ın sözü:** "burdakai adım uzunluğu terim sayfası butonu ve yukarısındaki
kısımla çok boşluk var düzelt onu"

**Anlaşılan istek:** Açılmış terim kartında sağ alttaki "… terim sayfası"
bağlantısı ile üstündeki alıntı satırı arasındaki dikey boşluk azalsın.

**Görselden okunan:** "Adım uzunluğu" akordeonu açık. Sıra: tanım paragrafı →
yeşil çizgili alıntı «Hızlanmak için adım uzunluğunu zorlama, önce kadansa bak.»
→ **belirgin boşluk** → sağ altta "📄 Adım uzunluğu terim sayfası →". Alıntı ile
bağlantı arasındaki boşluk, tanım ile alıntı arasındakinden gözle daha büyük.

**Canlı DOM ölçümü (1440px, ilk terim açık):**
| Ölçü | Değer |
|---|---|
| `.sd-ex` (alıntı) kutu alt kenarı → `.sd-more` kutu üst kenarı | **32px** |
| Aynı ikilinin **metin** kenarları arası (`Range` ile) | **40px** |
| `.sd-ex` margin | `12px 0 16px` |
| `.sd-more` margin-top | `16px` |
| `.sd-more` alt kenarı → kart alt kenarı | 25px |
| tanım `<p>` metin alt kenarı → alıntı metin üst kenarı | 33px |

`.sz-detail` **flex column** olduğu için alt/üst margin'ler **çökmüyor**:
`16px (sd-ex mb) + 16px (sd-more mt) = 32px` toplanıyor. Boşluğun sayısal kaynağı bu.

**Dosyalar:**
- `sozluk-v1.html:319` — `.sd-ex{margin:12px 0 16px; …}`
- `sozluk-v1.html:352-366` — `.sd-more{margin-top:16px; margin-left:auto; …}` +
  `.sz-detail{display:flex;flex-direction:column}` · `.sz-detail>.sd-more{align-self:flex-end}`
- `sozluk-v1.html:694-703` — akordeon detay işaretlemesini basan JS şablonu

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** Açık terim kartında `.sd-ex` alt kenarı → `.sd-more` üst kenarı
mesafesi 32px'ten küçük ve 4px ızgarasında; grup içi boşluk (alıntı↔bağlantı)
gruplar arası boşluktan (kart↔kart ayracı) **büyük olmayacak** (`docs/lessons.md` §4).

**SORU:** Hedef değer? → bkz. liste sonu soruları.

---

## R3 — Sözlük: kontrol paneli altındaki gölge kalksın, gri bölüm beyaz olsun

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/sozluk-v1.html
Görsel: `docs/screenshots/R12-03-sozluk-kategori-alti-golge-gri.png` (canlıdan)

**Beyar'ın sözü:** "bide burda gölge var renk farklı olmasın beyaz olsun
kategorilerin altındaki section gri beyaz oalcak"

**Anlaşılan istek:** Harf rayı + kategori çipleri + arama kutusunu taşıyan beyaz
kontrol panelinin altındaki gölge kalksın; hemen altındaki terim listesi bölümünün
gri zemini beyaza dönsün — iki bölüm arasında renk farkı kalmasın.

**Görselden okunan:** Koyu banner bitiyor, üst köşeleri yuvarlak beyaz kontrol
paneli (Tümü/A/B/C… harf rayı + "Tümü 254 · Hareket ve teknik 39 · Ekipman 21 …"
çip rayı + arama kutusu) geliyor. Panelin alt kenarında gölge bandı var. Panelin
altında "254 terim" sayacı ve terim kartlarının bulunduğu bölüm **gri**; panel
beyaz. İki zemin arasındaki bu fark görselde net okunuyor.

**Canlı DOM ölçümü (1440px):**
| Eleman | y | h | zemin | box-shadow |
|---|---|---|---|---|
| `section.lib-top` | 0 | 544 | `rgb(27,25,19)` | none |
| `section.sz-controls.fit-seam.is-onbanner` | 522 | 171 | `#fff` | **`rgba(20,16,10,.18) 0 -12px 32px`** |
| `section.sz-body` | 693 | 20941 | **`rgb(249,249,249)`** | none |

İki ayrı iş: (a) gölge = R1 ile **aynı kabuk kuralı** `.fit-seam`;
(b) gri zemin = `sozluk-v1.html:91` `.sz-body{background:var(--bg)}` (`--bg` = #f9f9f9).

**Dosyalar:**
- `sozluk-v1.html:91` — `.sz-body{padding:38px 0 var(--sec-pad);background:var(--bg)}`
- `sozluk-v1.html:80-90` — gri zeminin gerekçe yorumu (R8 ölçümü, aşağıdaki not)
- `sozluk-v1.html:88` — `.sz-controls{background:var(--paper);padding:24px 0 10px}`
- `sozluk-v1.html:412` — `@media` içinde `.sz-body{padding-top:26px}`
- `assets/css/fit-shell.css:3174-3189` — `.fit-seam` gölgesi (R1 ile ORTAK)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R1** (aynı `.fit-seam` gölge kuralı — aynı agent'ta olmalı)

**Bitti kriteri:** `sozluk-v1.html` @1440'te `.sz-controls` ile `.sz-body`
`getComputedStyle().backgroundColor` değerleri **aynı** (`rgb(255,255,255)`) ve
`.sz-controls` üzerinde gölge ölçülmüyor; terim kartlarının kenarı hâlâ okunur
kalıyor (aşağıdaki not).

**NOT (kütüğe geçiyor, karar Beyar'ın):** `.sz-body`'nin gri kalması R8'de
**bilinçli** bir sapmaydı; dosyadaki yorum aynen şöyle: *"referansın
`section.sz-sec`'i BEYAZ (#fff) … Bizde `.sz-body` #f9f9f9 KALIYOR — kalan tek
sapma. Referansta kartın beyaz zeminden ayrılmasını sayfalama ve sticky harf rayı
üstleniyor; bizde ikisi de yok, 254 kayıt tek kartta akıyor. Gri zemin kartın
kenarını görünür kılıyor."* Beyaza dönünce **beyaz üstünde beyaz kart** olur;
kartın kenarı ya kendi gölgesinden ya `--line` kenarlığından okunmalı.
→ bkz. liste sonu soruları.

---

---

## R4 — Program Detay: "Program durumun" ayrı gri bölüm olmasın, dikiş orada olsun

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/program-detay-v1.html?slug=8-hafta-mobilite
Görsel: `docs/screenshots/R12-04-program-detay-durum-bolumu.png` (canlıdan)

**Beyar'ın sözü:** "burayı güncellemen gerekiyor … burdas panel radiuslu olacak ama
prgram durumun niye böyle oldu ki güncellemen gerekiyor orası ayrı bir section
değilki bir bütün genel bakışın üstüne koy burayı program durumun gri olmasın bir olsun"

**Anlaşılan istek:** Banner'ın hemen altındaki "Program durumun" kartı ayrı gri bir
bant gibi durmasın; yuvarlak köşeli (dikişli) beyaz panelin İÇİNE, "Genel bakış"
bölümünün en üstüne girsin — tek beyaz bütün olsun, arkasındaki gri zemin görünmesin.

**Görselden okunan:** Koyu hero bitiyor. Altında gri zeminli bir bant içinde beyaz,
yuvarlak köşeli "Program durumun" kartı (rozet "Başlanmadı", ilerleme çubuğu,
"%0 tamamlandı · 0/12 antrenman · 1. hafta, 1. gün · Kaçırılan gün: 0", "Fit Planım'da
gör" düğmesi). Kartın altında gri boşluk, sonra ayrı bir beyaz panel üst köşeleri
yuvarlak biçimde başlıyor ve "GENEL BAKIŞ" oradan devam ediyor. İki ayrı bölüm gibi
okunuyor; yuvarlak köşe yanlış bölümde.

**Canlı DOM ölçümü (1440px):**
| Eleman | y | h | zemin | radius | box-shadow |
|---|---|---|---|---|---|
| `section.pd-hero` | 0 | 560 | `rgb(27,25,19)` | 0 | none |
| `div#pgWrap.wrap` (Program durumun) | 560 | 323 | **`rgba(0,0,0,0)` şeffaf** | 0 | none |
| `section#genel-bakis.sec.sec-fit.fit-seam` | 883 | 605 | `#fff` | **22px** | `rgba(20,16,10,.07) 0 -10px 26px` |

Kök neden ölçüldü: `#pgWrap` **şeffaf** olduğu için kabuk JS'inin dikiş işaretleyicisi
onu atlıyor (`fit-shell.js` → *"saydam ama tam-en → içine in"*), dikişi bir alttaki
`#genel-bakis`'e basıyor ve banner'a komşu olmadığı için `is-onbanner` de vermiyor
(o yüzden binme yok, gölge zayıf varyant). Şeffaf `#pgWrap`'in arkasından
`main.page-main`'in `rgb(249,249,249)` zemini görünüyor — Beyar'ın gördüğü gri bu.

**Dosyalar:**
- `program-detay-v1.html:243-248` — `#pgWrap{padding-top/bottom:var(--sec-pad-sm)}` + R8/27 gerekçesi
- `program-detay-v1.html` — `#pgWrap` ve `#genel-bakis` bölüm işaretlemesi
- `assets/js/fit-shell.js:3333-3415` — dikiş işaretleyicisi (şeffaf blok atlama kuralı)
- `assets/css/fit-shell.css:3174-3189` — `.fit-seam` / `.is-onbanner`

Tasarım dokunuşu: **EVET**
Bağımlılık: **R1** (aynı `.fit-seam` mekanizması — dikiş kuralına dokunuluyorsa aynı agent)

**Bitti kriteri:** @1440'te banner'ın hemen altındaki ilk blok beyaz (`rgb(255,255,255)`),
üst köşeleri 22px yuvarlak ve `is-onbanner` binmesi var; "Program durumun" ile
"GENEL BAKIŞ" arasında gri zemin şeridi ölçülmüyor (aradaki tüm blokların
`backgroundColor` değeri aynı).

---

## R5 — Fit Testleri: kart içi çip rayları (divider) aynı hizada değil

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/fit-testleri-v1.html
Görsel: `docs/screenshots/R12-05-fit-testleri-divider-hiza.png` ·
`docs/screenshots/R12-05b-fit-testleri-dar-ekran.png` (Beyar'ın ekranları) ·
`docs/screenshots/R12-05c-kanit-fit-testleri-cip-hiza.png` (canlıdan)

**Beyar'ın sözü:** "burdaki kartlar hizalı değil hepsinin dividerı aynı hizada olacak"

**Anlaşılan istek:** Aynı satırdaki test kartlarında çip rayı (~10 dk · Mat + sandalye · …)
ve onu ayıran çizgi hep aynı yükseklikte başlasın; açıklama metni kısa ya da uzun olsun
fark etmesin.

**Görselden okunan:** Üç kart yan yana. "Başlangıç Seviyesi Testi" açıklaması **4 satır**,
"Mobilite Değerlendirmesi" **3 satır**. Bu yüzden Mobilite'nin çip rayı ve altındaki
çizgi diğer ikisinden yukarıda duruyor — üç kartta üç farklı hiza. Kart alt satırı
("Uygunluk taramasıyla başlar · Teste git") hizalı. İkinci görselde dar ekranda çipler
kartın dışına taşıyor, "Yeniden başlayanl…" kesiliyor.

**Canlı DOM ölçümü (1440px, kart yüksekliği hepsinde 359px):**
| Kart | p satır | `.ft-meta` üst kenarı | `.hub-foot` üst kenarı | `.ft-meta` yatay taşma |
|---|---|---|---|---|
| Başlangıç Seviyesi | 4 | **1148** | 1180 | 19px |
| Mobilite | 3 | **1127** | 1180 | 15px |
| Denge | 4 | **1148** | 1180 | 80px |
| Temel Kuvvet | 3 | **1510** | 1563 | 1px |
| Dayanıklılık | 4 | **1531** | 1563 | 70px |
| Masa Başı | 3 | **1510** | 1563 | 24px |

→ `.hub-foot` (alt ayraç) **hizalı**; `.ft-meta` (çip rayı) **21px sapıyor**.
@1024'te tüm açıklamalar 3 satıra düştüğü için sapma 0 — sorun yalnız satır sayısı
farklılaştığında çıkıyor. `.hub-body` `display:flex` ama `<p>` esnemiyor.

**Dosyalar:**
- `fit-testleri-v1.html:264-400` — `.lib-grid.cols-3#ftGrid` içindeki 7 `a.hub-card.ft-card`
  (her kartta `.hub-media` · `.hub-body > h3 + p + .ft-meta + .hub-foot`)
- `fit-testleri-v1.html` — `.ft-meta` kuralı (tek satır + `overflow-x:auto`, R11/M12)
- `assets/css/fit-shell.css:1363-1417` — `.hub-card` / `.hub-body` / `.fs-card` ortak kuralları

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** @1440 ve @1024'te aynı satırdaki kartların `.ft-meta` üst kenarı
**tek değer** (sapma 0px); kart yüksekliği eşit kalıyor ve açıklama metni kırpılmıyor.

**SORU:** "Divider" ile kastedilen çip rayı mı, çiplerin altındaki çizgi mi?
Ölçüm alt çizginin zaten hizalı, çip rayının hizasız olduğunu söylüyor.
→ bkz. liste sonu soruları.

---

## R6 — Fit Testi Detay: sağ panel sağda görünmüyor, sol kolonun dibine düşmüş

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/fit-testi-detay-v1.html?test=baslangic-seviyesi
Görsel: `docs/screenshots/R12-06-kanit-yan-panel-sol-kolonda.png` (canlıdan)

**Beyar'ın sözü:** "burdakaki sağdaki panel gözükmüyor"

**Anlaşılan istek:** Sayfanın sağ sütununda durması gereken yan panel (Test künyesi
+ CTA kartları) gerçekten sağ sütuna otursun.

**Görselden okunan:** Sayfa tek kolon gibi akıyor: tarama kutusu, sorular, sonuç kartı
hepsi tam genişlikte. Sağda hiçbir panel yok, sağ taraf tamamen boş.

**Canlı DOM ölçümü (1440px):**
| Ölçü | Değer |
|---|---|
| `.ft-lay` `display` | `grid` |
| `.ft-lay` `grid-template-columns` | **`788px 348px`** (gap 40px) |
| `.ft-lay` doğrudan çocuk sayısı | **1** (`div.ft-col`) |
| İkinci kolon (348px) | **boş** |
| `aside.ft-side` konumu | `x=132 · w=788 · y=3454` → **sol kolonun içinde, en altta** |
| `aside.ft-side` `position` | `sticky` (ama sol kolonun dibinde yapışıyor) |
| Ata zinciri | `aside.ft-side` → `div.ft-col` → `div.ft-lay` |

Kök neden: `aside.ft-side` grid'in **torunu**; `.ft-col`'un içinde kapanmış. Grid
kolonuna yerleşmesi için `.ft-lay`'in **doğrudan çocuğu** olması gerekiyor.
İşaretlemede `</div><!-- /.ft-col -->` satır **733**, `<aside class="ft-side">` satır
**736** — yani kaynakta aside `.ft-col`'un dışında yazılmış görünüyor; canlı DOM'da
içinde çıkıyor. Kapanmayan/yanlış kapanan bir etiket var (tarayıcı ağacı düzeltiyor).

**Dosyalar:**
- `fit-testi-detay-v1.html:427` — `<div class="ft-lay">`
- `fit-testi-detay-v1.html:430` — `<div class="ft-col">`
- `fit-testi-detay-v1.html:733` — `</div><!-- /.ft-col -->`
- `fit-testi-detay-v1.html:736-790` — `<aside class="ft-side">…</aside>`
- `fit-testi-detay-v1.html:41` — `.ft-lay{grid-template-columns:minmax(0,1fr) 348px;gap:40px}`
- `fit-testi-detay-v1.html:313-334` — `.ft-side*` kuralları
- `fit-testi-detay-v1.html:357` — `@media` tek kolona düşme

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK (ama **R9 buna bağlı**)

**Bitti kriteri:** @1440'te `aside.ft-side` `x ≈ 920` · `width ≈ 348` ve `.ft-lay`'in
doğrudan çocuğu; `.ft-lay.children.length === 2`; @640'ta tek kolona düşüyor.

---

## R7 — Fit Testi Detay: koyu yeşil tarama kutusunda yazılar kopuk

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/fit-testi-detay-v1.html?test=baslangic-seviyesi
Görsel: `docs/screenshots/R12-07-kanit-yesil-kutu-kopuk-yazi.png` (canlıdan)

**Beyar'ın sözü:** "bide burada yeşil ksımdaki yazıların yazısı kötü kopuk olmuş yazılar
böyle olmayacak yazı hizalaması berbaty ne alaka burası için göz gerekiyor playwright ile baksın"

**Anlaşılan istek:** Koyu yeşil tarama kutusundaki açıklama tek akan paragraf olsun;
cümle içindeki vurgular ("Evet", "Her soruyu bir kez yanıtlarsın") satır kırmasın ve
paragrafla aynı puntoda kalsın.

**Görselden okunan:** Kutuda metin beş parçaya bölünmüş: "Bu bir teşhis aracı değildir…
Bir soruya bile" / **"Evet"** (kendi satırında, büyük) / "dersen test başlamaz ve seni
uzman desteğine yönlendiririz." / **"Her soruyu bir kez yanıtlarsın"** (kendi satırında,
büyük) / "— yanıt kilitlenir…". Cümle ortasından kopuyor, iki farklı punto yan yana,
paragraf okunmuyor.

**Canlı DOM ölçümü (1440px, `.ft-scr-h` içi):**
| Eleman | display | font-size | font-weight | renk | kutu genişliği |
|---|---|---|---|---|---|
| `<b>7 soru · 1 dakikadan kısa</b>` | block | 16px | 700 | `#fff` | 672 |
| `<small>` (açıklama) | block | **12.5px** | 500 | `rgba(255,255,255,.7)` | 672 |
| `<b>"Evet"</b>` (small İÇİNDE) | **block** | **16px** | 700 | `rgba(255,255,255,.7)` | 672 |
| `<b>Her soruyu bir kez yanıtlarsın</b>` (small İÇİNDE) | **block** | **16px** | 700 | `rgba(255,255,255,.7)` | 672 |

Kök neden: `fit-testi-detay-v1.html:169` → `.ft-scr-h b{display:block;font-size:16px;font-weight:700}`
Kural kutu **başlığı** için yazılmış ama seçici torun `<b>`'leri de yakalıyor;
`<small>` içindeki iki inline vurgu bloka dönüşüp satırı kırıyor ve 12.5px paragrafın
içinde 16px kalıyor (**3.5px** fark, aynı cümlede iki punto).

**Dosyalar:**
- `fit-testi-detay-v1.html:169` — `.ft-scr-h b{display:block;font-size:16px;font-weight:700}`
- `fit-testi-detay-v1.html:167-170` — `.ft-scr-h` / `.ic` / `small` kuralları
- `fit-testi-detay-v1.html:523-531` — `<div class="ft-scr-h">` işaretlemesi (b + small + iç b'ler)

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** `.ft-scr-h small` içindeki `<b>` elemanlarının `display` değeri
`inline` ve `font-size` değeri `<small>` ile aynı (12.5px); açıklama metni tek blok
hâlinde akıyor, `<small>` içinde satır kıran blok eleman **0**.

---

## R8 — Fit Testi Detay: 1. sorunun üstünde nefes yok

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/fit-testi-detay-v1.html?test=denge
Görsel: Beyar'ın ekranı (sohbette) · ölçüm kanıtı `docs/screenshots/R12-07-kanit-yesil-kutu-kopuk-yazi.png`

**Beyar'ın sözü:** "1. sorunun en üstünde bir [boşluk]"

**Anlaşılan istek:** Koyu yeşil tarama kutusu ile ilk sorunun arasına gerçek bir nefes
girsin; soru kutunun dibine yapışmasın.

**Görselden okunan:** Koyu yeşil kutu bitiyor, hemen bir sonraki pikselde beyaz zemin
ve "1 · Bir hekim sana kalp rahatsızlığın olduğunu…" sorusu başlıyor. Aradaki beyaz
şerit gözle neredeyse yok.

**Canlı DOM ölçümü (1440px, `?test=denge`):**
| Ölçü | Değer |
|---|---|
| `.ft-scr-h` alt kenarı | 1617 |
| `fieldset.ft-q` (1. soru) üst kenarı | 1623 |
| **Aradaki nefes** | **6px** |
| Soru metni (`<legend>`) gerçek üst kenarı (`Range`) | 1623 → yine **6px** |
| `.ft-scr-body` padding-top | 6px |
| `fieldset.ft-q` padding-top | **0px** (legend fieldset dolgusunu atlar — `docs/lessons.md` §3) |

**Dosyalar:**
- `fit-testi-detay-v1.html` — `.ft-scr-body{padding:6px 0 22px}` civarı kural
- `fit-testi-detay-v1.html` — `.ft-q` fieldset kuralı (R11/M13'te dikey ritmi düzeltilen blok)
- `fit-testi-detay-v1.html:522-533` — `<form class="ft-scr">` → `.ft-scr-h` + `.ft-scr-body`

Tasarım dokunuşu: **EVET**
Bağımlılık: **R7** (aynı `.ft-scr-h` bloğu — aynı agent)

**Bitti kriteri:** `.ft-scr-h` alt kenarı ile 1. sorunun **metni** arasındaki mesafe
4px ızgarasında ve 6px'ten büyük; ölçüm `Range` ile (kutuyla değil) doğrulanacak.

---

## R9 — Fit Testi Detay: sonuç kartı ile "Test künyesi" tam yapışık (0px)

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/fit-testi-detay-v1.html?test=denge
Görsel: `docs/screenshots/R12-09-kanit-sonuc-kunye-yapisik.png` (canlıdan)

**Beyar'ın sözü:** "sonuç özeti aldında test künyesi ile çok yapışık bunu düzelt"

**Anlaşılan istek:** "Sonuç girişi kapalı" kartı ile hemen altındaki "Test künyesi"
kartı arasına boşluk girsin; iki kart tek blok gibi görünmesin.

**Görselden okunan:** "3 · Sonuç özeti" başlığı, altında kesik çizgili "Sonuç girişi
kapalı" kartı ("Taramaya git" düğmesiyle). Kartın alt kenarı bitiyor ve bir sonraki
kartın üst kenarı **aynı çizgiden** başlıyor; "Test künyesi" başlığı hemen orada.
İki kart birbirine yapışık, ayrı kart oldukları okunmuyor.

**Canlı DOM ölçümü (1440px, `?test=denge`):**
| Ölçü | Değer |
|---|---|
| `div#ftResLock.ft-lock` alt kenarı | 3429 |
| `div.ft-side-card` ("Test künyesi") üst kenarı | **3429** |
| **Aradaki nefes** | **0px** |
| `.ft-side-card` `margin-top` | 0px |
| `aside.ft-side` konumu | `x=132 · w=788 · y=3429` (sol kolonun dibinde) |

Bulgu: yapışan kart **yan panelin** ilk kartı. Yani bu R6'nın sonucu — yan panel sağ
sütuna gitmediği için sonuç kartının hemen altına akıyor ve `aside.ft-side`'ın
`gap:16px`'i kendi içinde çalışırken dış komşusuyla arası 0 kalıyor.

**Dosyalar:**
- `fit-testi-detay-v1.html:313` — `.ft-side{position:sticky;top:128px;display:flex;flex-direction:column;gap:16px}`
- `fit-testi-detay-v1.html:314` — `.ft-side-card{…}`
- `fit-testi-detay-v1.html:736-790` — `<aside class="ft-side">` işaretlemesi
- `fit-testi-detay-v1.html` — `.ft-lock` kuralı (sonuç kilit kartı)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R6** (R6 düzelince yan panel sağa geçer; bu yapışıklık büyük olasılıkla
kendiliğinden kalkar — R6'dan SONRA yeniden ölçülmeli, aynı agent'ta)

**Bitti kriteri:** `?test=denge` @1440'te `.ft-lock` alt kenarı ile ondan sonraki ilk
kartın üst kenarı arasındaki mesafe **≥ 24px** (ya da yan panel sağa geçtiği için
alt komşu artık `.ft-side-card` değil).

---

## R10 — Antrenörler: "Programını Bul" bilgi şeridi üstündeki bölüme yapışık (0px)

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/antrenorler-v1.html
Görsel: Beyar'ın ekranı (sohbette)

**Beyar'ın sözü:** "burası niye yapışmış analaadım yukarıdaki kısımlar boşluk bıraksana"

**Anlaşılan istek:** Sayfa altındaki yeşil "Antrenör değil program mı arıyorsun?"
şeridinin üstüne boşluk gelsin; filtre paneli ve sayfalama bloğunun dibine yapışmasın.

**Görselden okunan:** Sol filtre paneli (Çalışma Şekli / Uygunluk) beyaz kart olarak
bitiyor; sağda antrenör kartları, altında sayfalama (`‹ Önceki · 1 · 2 · Sonraki ›`)
ve "1–6 / 8 antrenör gösteriliyor · sayfa 1/2". Hemen ardından açık yeşil şerit,
üstündeki bloklara temas edecek kadar yakın — filtre kartının alt kenarıyla neredeyse
aynı çizgide. Şeridin altında ise koyu "Antrenör müsün?" bloğuna kadar rahat boşluk var.

**Canlı DOM ölçümü (1440px):**
| Ölçü | Değer |
|---|---|
| `div.lst-layout` alt kenarı | 1698 |
| `div.fit-note` (2. şerit) üst kenarı | **1698** |
| **Aradaki nefes** | **0px** |
| `.fit-note` `margin` | `0px` üst · `18px` alt |
| `.fit-note` alt kenarı → `.coach-join` üst kenarı | **46px** |
| `nav#libPage.lib-page` (sayfalama) | y 1624–1698 · `margin-top:40px` |

Kök neden: kabuk kuralı `assets/css/fit-shell.css:3004` → `.fit-note{margin:0 0 18px}`
— **üst boşluk yok**. Şerit `.lst-layout` kapandıktan hemen sonra geliyor, dolayısıyla
üstü 0, altı 46px: asimetrik ve yapışık.

**Dosyalar:**
- `antrenorler-v1.html:585-588` — sayfa altındaki ikinci `<div class="fit-note">` (program kapısı)
- `antrenorler-v1.html:433` — sayfa üstündeki birinci `.fit-note` (bu sorunsuz, üstünde komşusu var)
- `antrenorler-v1.html:577-578` — `</div><!-- /.lst-main --> </div><!-- /.lst-layout -->`
- `assets/css/fit-shell.css:2995-3020` — `BİLGİ ŞERİDİ — .fit-note (ORTAK · TEK KAYNAK)`

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** @1440'te `.lst-layout` alt kenarı ile `.fit-note` üst kenarı arası
**≥ 40px** ve `.coach-join` ile arası ile dengeli; sayfadaki diğer `.fit-note`
örneklerinin (66 sayfa) konumu değişmemiş olacak.

**RİSK NOTU:** `.fit-note` **kabuk bileşeni** — `margin-top` kabuğa yazılırsa 66 sayfadaki
tüm örnekleri etkiler (bu sayfadaki birinci şerit dâhil, o şu an doğru duruyor).
Kabuk sözleşmesi gereği düzeltme sayfaya özgü olmalı, ya da kabuğa yazılacaksa
önce/sonra ölçüm yapılmalı (`docs/lessons.md` §9).

---

## R11 — Hesap dropdown'ına DadaDiet'teki "Aboneliğim ve Ödemelerim" kalemi eklensin

Durum: TOPLANDI
URL: (kabuk · her sayfada) örn. https://gaviaworks-dev.github.io/dadafit-prototip/hesabim-v1.html
Görsel: Beyar'ın 3 ekranı (sohbette) — DadaDiet dropdown'ı tam · DadaDiet son üçlü yakın plan · DadaFit dropdown'ı

**Beyar'ın sözü:** "dadadiette … dropdownda varya bu 3 lü fitte de olsun istiyorum … eklenemi istiyorıum"

**Anlaşılan istek:** DadaDiet hesap menüsünün alt üçlüsü (Aboneliğim ve Ödemelerim ·
Hesap ve Ayarlar · Destek Merkezi) DadaFit'te de tam olsun — eksik olan
**"Aboneliğim ve Ödemelerim"** kalemi eklensin.

**Görselden okunan:** DadaDiet dropdown'ında sırasıyla: Planım · Günlük Takip ·
Programını Bul · İlerlemem · Alışveriş Listem — ayraç — Uzman Desteğim · Kaydettiklerim ·
Sağlık Profilim — ayraç — **Aboneliğim ve Ödemelerim** · Hesap ve Ayarlar · Destek Merkezi
— ayraç — Çıkış. Yakın plan görselde bu üçlü tek grup olarak duruyor.
DadaFit görselinde ise: Antrenörüm — ayraç — Sağlık ve Hareket Profilim · Pro'ya Yükselt ·
Hesap ve Ayarlar · Destek Merkezi — ayraç — Çıkış. **"Aboneliğim ve Ödemelerim" yok.**

**Canlı DOM ölçümü (1440px, DadaFit dropdown açık):** 11 kalem, sırasıyla —
Enerji Defterim · Aktivite Kayıtlarım · Kaydettiklerim · Challenge'larım ve Rozetlerim ·
Fit Test Sonuçlarım · Antrenörüm · Sağlık ve Hareket Profilim · Pro'ya Yükselt
(`.acct-pro`) · Hesap ve Ayarlar (`hesabim-v1.html`) · Destek Merkezi (`destek-v1.html`) ·
Çıkış (`.acct-logout`). "Abonelik/Ödeme" içeren kalem **0**.

**Dosyalar:**
- `assets/js/fit-shell.js:414` — `Pro'ya Yükselt` kalemi (`.acct-pro`)
- `assets/js/fit-shell.js:438-439` — `Hesap ve Ayarlar` + `Destek Merkezi` kalemleri
- `assets/js/fit-shell.js:391` civarı — menü gerekçe yorumu ("19 hesap kalemi tek
  'Hesap ve Ayarlar' kalemine KATLANDI")
- `tests/plan-account.mjs` — **nöbet: menüde TAM 11 kalem** bekliyor

Tasarım dokunuşu: **HAYIR** (içerik/yapı)
Bağımlılık: YOK

**Bitti kriteri:** Dropdown'da 12 kalem; "Aboneliğim ve Ödemelerim" kalemi var,
hedefi 200 dönüyor, sırası "Hesap ve Ayarlar"ın hemen ÜSTÜ; `tests/plan-account.mjs`
beklentisi 11 → 12'ye taşınmış ve yeşil (`docs/lessons.md` §5 kalıbı).

**RİSK:** Kalem eklenince bir hedef sayfa gerekiyor. DadaFit'te abonelik/ödeme sayfası
`hesabim-v1.html` içindeki "Üyelik / Ödeme / Faturalar" sekmelerinde yaşıyor
(canlı ölçüm: `#hsRail` sekmeleri = Profil · Bildirimler · **Üyelik · Ödeme · Faturalar** ·
Güvenlik · Dil ve Bölge · Diğer Modüller · Dondurma · Hesap Silme). Ayrı sayfa üretmek
"Yakında/placeholder" yasağına girer.

---

## R12 — Enerji Defteri: iki katmanlı sekme ve fazladan bölümler, DadaDiet/planim kalıbına gelsin

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/enerji-defteri-v1.html
Referans: https://dadadiet.com/planim — **ÖLÇÜLDÜ** (aşağıya bak)
Görsel: `docs/screenshots/R12-12-kanit-enerji-defteri-iki-tab.png` (canlıdan)

**Beyar'ın sözü:** "burda 2 tane tab var … burayı inecel buranın aynısını istiyorum fite
uyarlanmış halini saçma olmuş niye ekstra seciton bilmem nesi vs eklenmiş anlamdım"

**Anlaşılan istek:** Sayfadaki iki ayrı sekme katmanı tek katmana insin ve sayfa
DadaDiet `/planim`'in yapısına (yapı; rengi/markası değil) uyarlansın; sonradan
eklenmiş fazladan bölümler kalksın.

**Görselden okunan:** Üstte beyaz profil başlığı, altında yapışkan sekme rayı
(Bugün · Plan ve Takvim · İlerlemem), onun da altında **ikinci bir sekme rayı**
(Bugün · Dengele · Su Takibi · Haftalık Özet). İki ray üst üste, ikisinde de "Bugün"
var. Altta içerik bölümleri ve en sonda gri zeminli fazladan bir bölüm.

**Canlı DOM ölçümü (1440px) — Playwright ile ölçüldü:**
| Blok | y | h | zemin |
|---|---|---|---|
| `section.fp-profil` | 0 | 568 | `#fff` |
| `div.pf-tabbar.fp-tabbar` → `nav.fit-tabs` **["Bugün","Plan ve Takvim","İlerlemem"]** | 568 | 75 | `rgba(249,249,249,.94)` yapışkan |
| `div.wrap.ed-subtabs` → `nav.fit-tabs` **["Bugün","Dengele","Su Takibi","Haftalık Özet"]** | 851 | 51 | — |
| `section#yediklerim.sec.sec-fit` | 643 | 1934 | `#fff` |
| `section.sec.sec-fit` (gri, en alt) | 2577 | 705 | `rgb(249,249,249)` |

→ **İki sekme katmanı doğrulandı** (y=568 ve y=851). Her iki ray da `nav.fit-tabs`
sınıfını kullanıyor; ikisinde de "Bugün" kalemi var.

**Dosyalar:**
- `enerji-defteri-v1.html` — `.ed-subtabs` ikinci sekme rayı + bölüm işaretlemesi
- `assets/css/fit-shell.css` — `PLAN PROFİL BAŞLIĞI` (`.fp-profil`) · `.pf-tabbar` · `.fit-tabs`
- `assets/js/fit-shell.js` — `PLAN PROFİL BAŞLIĞI` · `PLAN KABUĞU · dikişi rayın dibine çek`

Tasarım dokunuşu: **EVET**
Bağımlılık: **R13/R15 ile ortak kabuk** (`.fp-profil` · `.fit-tabs` · `.pf-tabbar`)

**Bitti kriteri:** Sayfada `nav.fit-tabs` sayısı **1**; kaldırılan katmanın kalemleri
kaybolmadan tek rayda ya da içerik başlıklarında yaşıyor; gereksiz bölüm sayısı
ölçülerek azalmış (önce/sonra blok listesi kütüğe yazılır).

**REFERANS ÖLÇÜMÜ (dadadiet.com, canlı, 2026-08-24):** Beyar'ın kendi hesabıyla
oturum açılıp ölçüldü, iş bitince çıkış yapıldı (`ref-diet` ajanı — bkz. handoff notu).
Görsel: `docs/screenshots/REF-diet-planim-1440.png` · `REF-diet-planim-390.png`
(commit edilmedi — kişisel veri, yalnız diskte).

| Ölçü | DadaDiet `/planim` (referans) | DadaFit Enerji Defteri (canlı) |
|---|---|---|
| Sekme rayı sayısı | **1** — `.pf-tabs` (8 kalem: Planım·Günlük Takip·Programını Bul·İlerlemem·Alışveriş Listem·Uzman Desteğim·Kaydettiklerim·Sağlık Profilim) | **2** — `.pf-tabbar.fp-tabbar` (y=568) + `.wrap.ed-subtabs` (y=851) |
| Bölüm sayısı (`main` altı) | **1** — tüm sayfa (kapak+kart+tab+içerik) tek `<section class="sec below-header">` içinde | Çok bölümlü: `fp-profil` + `pf-tabbar` + `ed-subtabs` + `#yediklerim` + alt gri bölüm (y=2577) |
| Sekme rayı `position` | `static` — **yapışkan değil** | `sticky;top:112px` |
| Sekme rayı hizası | `justify-content:normal` → **sola dayalı** (8 kalemde ilk kalem sol boşluk 5px, son kalem sağ boşluk 117px; 5 kalemli `/hesabim` rayında sağ boşluk 507px) | aynı desen — `.fit-tabs` de `justify-content` varsayılan (sola dayalı) |
| Kapak/başlık kalıbı | Beyaz gövde üstünde yemek fotoğraflı `.pf-banner` (h=240px, radius 24px) + üstüne binen `.pf-head` beyaz kart | `.fp-profil` zaten aynı kalıpta (R11/M17) — ayrıntı R13'te |

→ **R12 net fark listesi (DadaFit Enerji Defteri'nde değişmesi gereken, madde madde):**
1. İkinci sekme rayı (`.wrap.ed-subtabs`, y=851, kalemler: Bugün·Dengele·Su Takibi·Haftalık Özet) **kaldırılsın** — referansta tek ray var.
2. Kaldırılan kalemler kaybolmasın: birinci raya eklenebilir ya da ilgili içerik bölümünün kendi başlığı olarak kalabilir (Beyar'ın "kalemler kaybolmadan" notuyla uyumlu).
3. Sayfa sonundaki fazladan gri bölüm (`section.sec.sec-fit`, y=2577, h=705) — referansta karşılığı yok (tek içerik kartı var); kaldırılsın ya da üstteki beyaz bölümle birleştirilsin.
4. Sekme rayının `sticky` davranışı referansta **yok** (`position:static`); bu R12'nin bitti kriterinde geçmiyor, kapsam dışı — dokunulmasın, ayrı karar gerekir.

---

## R13 — Hesabım: düz koyu banner yerine profil kartlı başlık (DadaDiet/hesabim kalıbı)

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/hesabim-v1.html
Referans: https://dadadiet.com/hesabim — **ÖLÇÜLDÜ** (aşağıya bak)
Görsel: `docs/screenshots/R12-13-kanit-hesabim-duz-banner.png` (canlıdan) ·
Beyar'ın DadaDiet ekranı (sohbette)

**Beyar'ın sözü:** "burası niye değişiyor ki diette ayarlara giridğimizdde yine profil
kartı var yuakrıda anlamadım buranın tasarımda niye böyle israr ediyorsun" ·
"ben burda hesap ve ayarları tıklıyoırum yine bu saçma bir düz bannerlı bir yapı veriyor
bunları da yap **burada kesinlikle teyit için soru sor**"

**Anlaşılan istek:** Hesap ve Ayarlar sayfası koyu düz banner ile açılmasın; DadaDiet'te
olduğu gibi üstte profil kartı (kapak + avatar + ad + kullanıcı adı + üyelik tarihi)
dursun, sekme şeridi onun altına gelsin.

**Görselden okunan (DadaDiet referans ekranı):** Üstte yemek fotoğraflı kapak,
üstüne binen büyük yuvarlak avatar ("Y"), yanında "Yasin Yavuz", altında "@yasinyavuz",
altında "Üyelik: 20 Ağustos 2026". Kartın altında yatay sekme şeridi:
Profil bilgilerim · Güvenlik · Bildirim tercihlerim · Dil ve bölge · Veri ve izinler.
Sonra "Hesap ve Ayarlar" başlığı ve içerik.

**Canlı DOM ölçümü — DadaFit (1440px):**
| Blok | y | h | zemin |
|---|---|---|---|
| `section.lib-top` (koyu banner) | 0 | 544 | `rgb(27,25,19)` |
| `section.hs-body.fit-seam.is-onbanner` | 522 | 10489 | `rgb(249,249,249)` |
| `div.pf-tabbar.hs-rail` → `nav#hsRail.pf-tabs` | 522 | 72 | — |

Sekme kalemleri (10): Profil · Bildirimler · Üyelik · Ödeme · Faturalar · Güvenlik ·
Dil ve Bölge · Diğer Modüller · Dondurma · Hesap Silme.
**Profil kartı (`.fp-profil` / `.pf-top`) sayfada YOK.**

Depoda kalıp zaten var: R11/M17'de 14 plan sayfası `.fp-profil`'e çevrildi
(`enerji-defteri` ve `fit-planim-*` bu kalıbı taşıyor — ölçümle doğrulandı: y=0..568
beyaz `.fp-profil`). `profil-v1.html` ise `.pf-top` beyaz profil kapağını kullanıyor
(KARARLAR K23).

**Dosyalar:**
- `hesabim-v1.html` — `section.lib-top` banner işaretlemesi + `.hs-body` + `#hsRail`
- `assets/css/fit-shell.css` — `PLAN PROFİL BAŞLIĞI` (`.fp-profil` · `.fp-kapak` ·
  `.fp-kimlik` · `.fp-sayac`) · `.pf-tabbar` · `.pf-tabs`
- `assets/js/fit-shell.js` — `PLAN PROFİL BAŞLIĞI` · `OVER_MODE` listesi
  (banner koyudan açığa dönerse sayfa buradan ÇIKARILMALI — `docs/lessons.md` §10)
- `tests/header-banner.mjs` — sayfa BANNER listesinden PLAIN listesine taşınmalı

Tasarım dokunuşu: **EVET**
Bağımlılık: **R12/R15 ile ortak kabuk**

**Bitti kriteri:** `hesabim-v1.html` @1440'te ilk blok beyaz profil başlığı
(kapak + avatar + ad + üyelik satırı), koyu `.lib-top` yok; `#hsRail` sekme şeridi
profil kartının ALTINDA; header marka yazısı okunur (over-mode'dan çıkarılmış);
`tests/header-banner.mjs` yeşil.

**Beyar TEYİT SORUSU İSTEDİ** → bkz. liste sonu soruları (S6).

**REFERANS ÖLÇÜMÜ (dadadiet.com, canlı, 2026-08-24):** Beyar'ın kendi hesabıyla
oturum açılıp ölçüldü, iş bitince çıkış yapıldı. Görsel:
`docs/screenshots/REF-diet-hesabim-1440.png` · `REF-diet-hesabim-390.png`
(commit edilmedi — kişisel veri, yalnız diskte).

| Ölçü | DadaDiet `/hesabim` (referans) | DadaFit `.fp-profil` (mevcut kod, `assets/css/fit-shell.css`) | Durum |
|---|---|---|---|
| Kapak yüksekliği | `.pf-banner` **h=240px**, radius 24px, `box-shadow:0 6px 22px rgba(33,30,22,.09)` | `.fp-kapak` **h=280px**, radius `--radius-xl`(24px) | **SAPMA** — DadaFit 40px daha uzun |
| Kart konumu (kapağa binme) | `.pf-head` `margin-top:-78px`, padding `26px 30px 28px`, radius 16px, aynı gölge | `.fp-kimlik` `margin-top:-78px`, padding `26px 30px 28px`, radius `--radius-lg`(16px) | **TUTUYOR** — birebir |
| Avatar | `.pf-ava` **128×128**, radius 50%, `margin-top:-70px`, aynı gölge | `.fp-ava2` **128×128**, radius 50%, `margin-top:-70px`, 4px beyaz kenarlık | **TUTUYOR** — birebir |
| Ad punto/ağırlık | `<b>` **29px / 700** | `.fp-kimlik-id h1` **30px / 700** | TUTUYOR (1px fark, önemsiz) |
| Kullanıcı adı (`@handle`) üst boşluğu | `.pf-handle` `margin-top:5px` | `.fp-handle2` `margin-top:3px` | TUTUYOR (2px fark, önemsiz) |
| Üyelik satırı üst boşluğu | `.pf-meta` `margin-top:14px` | `.fp-kimlik-meta` `margin-top:13px` | TUTUYOR (1px fark, önemsiz) |
| Header davranışı | `position:fixed`, zemin **her zaman** `rgba(255,255,255,.94)` — kaydırınca yalnız gölge (`0 4px 20px rgba(33,30,22,.05)`) beliriyor, şeffaf→katı geçişi **YOK** | `hesabim-v1` henüz `.fp-profil`'e geçmedi (R13 kapsamı) | uygulanacak |

→ **R13 için sonuç:** `.fp-profil` kalıbının kart/avatar geometrisi (`margin-top`,
`padding`, avatar boyutu, radius'lar) zaten R11/M17'de DadaDiet'ten **birebir**
ölçülerek kurulmuş — TUTUYOR. Tek net sapma **kapak yüksekliği**: DadaFit 280px,
referans 240px. `hesabim-v1.html` `.fp-profil`'e geçirilirken bu 40px fark ya
240px'e çekilerek kapatılsın ya da bilinçli bir büyütme olarak Beyar'a onaylatılsın.
Ayrıca DadaDiet'te header şeffaf-banner-üstü → katı geçişi **yapmıyor** (sabit
yarı-saydam beyaz + yalnız kaydırma gölgesi); `docs/lessons.md` §10 uyarısı
(`OVER_MODE`'dan çıkarma ihtiyacı) bu maddenin metninde zaten var ve referansla tutarlı.

---

## R14 — Hesap menüsünden açılan diğer sayfalar da aynı kalıba gelsin

Durum: TOPLANDI · **KAPSAM BELİRSİZ**
URL: https://gaviaworks-dev.github.io/dadafit-prototip/hesabim-v1.html (giriş noktası)

**Beyar'ın sözü:** "ben burda hesap ve ayarları tıklıyoırum yine bu saçma bir düz
bannerlı bir yapı veriyor **bunları da yap** burada kesinlikle teyit için soru sor"

**Anlaşılan istek:** Yalnız `hesabim-v1` değil, hesap menüsünden açılan diğer düz
bannerlı sayfalar da profil kartlı kalıba geçsin.

**Görselden okunan:** Ayrı görsel verilmedi; "bunları da" ifadesi R13'ün görseline
dayanıyor.

**Canlı DOM ölçümü — hesap menüsündeki 11 hedefin banner durumu:**
`.fp-profil` taşıyan (beyaz profil başlığı, hazır): `enerji-defteri-v1` ·
`fit-planim-gecmis-v1` · diğer `fit-planim-*` sayfaları · `fit-test-sonuclarim-v1`
(R11/M17 · handoff §5'te 14 sayfa olarak sayılı).
Koyu `.lib-top` banner taşıyan: **`hesabim-v1`** · `destek-v1` · `pro-v1`
(hedeflerin tam banner envanteri dalga başlangıcında yeniden ölçülecek).

**Dosyalar:** kapsam onaylanınca netleşir — aday: `destek-v1.html` · `pro-v1.html`
(+ `assets/js/fit-shell.js` `OVER_MODE` · `tests/header-banner.mjs`)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R13** (kalıp önce orada kurulur, sonra çoğaltılır)

**Bitti kriteri:** Onaylanan kapsamdaki her sayfada ilk blok beyaz profil başlığı;
`tests/header-banner.mjs` listeleri güncel ve yeşil.

**SORU:** Kapsam ne? → bkz. liste sonu soruları (S7).

---

## R15 — Aktivite Kayıtlarım: sekmeler ortalı değil, bölüm içerikleri dikeyde merkezde değil

Durum: TOPLANDI
URL: https://gaviaworks-dev.github.io/dadafit-prototip/fit-planim-gecmis-v1.html
Referans: DadaDiet plan ekranı — **ÖLÇÜLDÜ** (aşağıya bak)
Görsel: `docs/screenshots/R12-15-kanit-gecmis-tab-hiza.png` (canlıdan)

**Beyar'ın sözü:** "dediğim gibi meslea yapırosun dietteki gibi merkezi değil tabler
saçma bir şekilde 2 tab var zebra deseni var ama secitonların içerikleri sectionın
dikeyde merkezi değil güncellemeni istiyorum"

**Anlaşılan istek:** Sekme şeridi DadaDiet'teki gibi ortalansın; bölüm içerikleri
kendi kutularında dikeyde ortalansın; zebra deseni tutarlı olsun.

**Görselden okunan:** Beyaz profil başlığı, altında sola dayalı sekme şeridi
(Bugün · Plan ve Takvim · İlerlemem), altında gri gövdede kartlar.

**Canlı DOM ölçümü (1440px) — Playwright ile ölçüldü:**
| Ölçü | Değer |
|---|---|
| `nav.fit-tabs` | `x=132 · w=1176 · justify-content:normal · text-align:start` → **sola dayalı** |
| Sekme kalemleri | **3** — Bugün · Plan ve Takvim · İlerlemem (x = 137 / 237 / 386) |
| Sayfadaki `nav.fit-tabs` sayısı | **1** (Enerji Defteri'ndeki gibi ikinci katman YOK) |
| `section#fpxSum.fpx-sum.is-empty` | `display:grid` · **`align-items:center`** · h=244 |
| `div.fpx-sec` × 2 | `display:block` · **dikey merkezleme yok** |
| `div.fp-gate-in` | `display:flex` · `align-items:center` · zemin `rgb(247,241,230)` |

→ "Merkezi değil" iddiası **doğrulandı**: sekme rayı sola dayalı (`justify-content`
merkez değil).
→ "2 tab var" iddiası bu sayfada **doğrulanamadı**: ölçümde tek ray, 3 kalem var.
İki katmanlı sekme **Enerji Defteri'nde** (R12) ölçüldü. Aynı şikâyet iki sayfa için
yazılmış olabilir. → bkz. liste sonu soruları (S9).
→ "dikeyde merkezi değil": `.fpx-sec` blokları `display:block`, dikey ortalama yok;
yalnız `.fpx-sum` grid + `align-items:center`.

**REFERANS ÖLÇÜMÜ (dadadiet.com, canlı, 2026-08-24):** DadaDiet'te "geçmiş"e birebir
karşılık gelen ayrı bir sayfa yok; en yakın karşılaştırma `/planim` ve `/hesabim`'in
ortak `.pf-tabs` sekme rayı ve içerik bloğu (aynı oturumda, Beyar'ın hesabıyla ölçüldü,
sonra çıkış yapıldı). Görsel: `docs/screenshots/REF-diet-planim-1440.png` (commit
edilmedi).

| Ölçü | DadaDiet `.pf-tabs` (referans) | DadaFit `fit-planim-gecmis` `.fit-tabs` |
|---|---|---|
| `justify-content` | `normal` → **sola dayalı** (8 kalemli rayda ilk kalem sol boşluk 5px, son kalem sağ boşluk 117px; 5 kalemli rayda 507px) | `normal` → **sola dayalı** (x=137/237/386, ölçülü) — **AYNI DESEN** |
| Sekme rayı sayısı | **1** | **1** (bu sayfada zaten tek ray — R12'nin iki-ray sorunu bu sayfada yok) |
| İçerik dikey merkezleme | Ölçülen bloklarda net bir dikey-merkezleme deseni **yok** — boş-durum kartı `display:block`, ikon→başlık→metin üstten alta düz akıyor | `.fpx-sum` `display:grid;align-items:center` (**VAR**) · `.fpx-sec` `display:block` (yok) |
| Zebra | Ölçülebilir zebra deseni **bulunamadı** — form satırları ve kart satırları hepsi şeffaf/aynı zemin | (R12 ölçümünde de zebra ölçülmedi) |

→ **R15 için sonuç:**
- "Sekmeler ortalı değil" şikâyeti: **DadaDiet referansı da ortalı DEĞİL** —
  `.pf-tabs` `justify-content:normal`, sola dayalı; DadaFit'in mevcut `.fit-tabs`
  davranışıyla **aynı desen**. Gerçekten ortalı olan tek eleman DadaDiet'in üst site
  menüsü (`nav.nav`: Sağlık Araçları·Beslenme·Programlar·Diyetisyenler,
  `justify-content:center`, sol/sağ boşluk simetrik 139px) — büyük olasılıkla
  Beyar'ın "merkezi" dediği bu, plan sayfasının sekme rayı değil. Liste sonu
  sorusuna (S9) ek not olarak işlensin.
- "Dikeyde merkezi değil" şikâyeti: referansta da güçlü bir dikey-merkezleme deseni
  yok; ölçülen tek örnek zaten DadaFit'in uyguladığı `.fpx-sum` `align-items:center`.
  **SAPMA yok** — DadaFit bu noktada referanstan geride değil.
- Zebra: referansta da ölçülebilir zebra deseni yok; Beyar'ın "zebra var" notunun
  kaynağı bu ölçümle doğrulanamadı (hesap içeriği az olduğundan kesin değil —
  yoğun bir liste/tablo görülemedi).

**Dosyalar:**
- `fit-planim-gecmis-v1.html` — `.fpx-sum` · `.fpx-sec` · `.fpx-tablo` · `.fp-gate` kuralları ve işaretleme
- `assets/css/fit-shell.css` — `.fit-tabs` / `.fit-tab` · `.pf-tabbar` · `PLAN PROFİL BAŞLIĞI`

Tasarım dokunuşu: **EVET**
Bağımlılık: **R12/R13 ile ortak kabuk** (`.fit-tabs` ortalama kararı üçünü birden etkiler)

**Bitti kriteri:** @1440'te sekme rayının ilk ve son sekmesinin kap kenarlarına uzaklığı
eşit (sapma ≤2px); `.fpx-sec` bölümlerinin içerikleri kendi kutularında dikeyde
ortalanmış (ölçülen `align-items:center` ya da eşit üst/alt boşluk); zebra deseni
ardışık satırlarda iki değer arasında düzenli değişiyor.

## Biriken sorular (liste bitince şıklı sorulacak)

- **S1 (R1+R3+R4):** `.fit-seam` gölgesinin hangi kısmı kalkacak? Kural 50 sayfada basılı.
- **S2 (R2):** Alıntı ↔ "terim sayfası" hedef boşluğu kaç px?
- **S3 (R3):** Zemin beyazlaşınca terim kartının kenarı neyle okunacak?
- **S4 (R5):** "Divider" = çip rayı mı, çiplerin altındaki çizgi mi? (alt çizgi zaten hizalı)
- **S5 (R10):** `.fit-note` üst boşluğu kabuğa mı yazılsın, yalnız bu sayfaya mı?
- **S6 (R13):** Hesabım başlığı hangi kalıba geçsin? (Beyar teyit istedi)
- **S7 (R14):** "Bunları da yap" kapsamı hangi sayfalar?
- **S8 (R12+R13+R15):** DadaDiet referansları giriş duvarında — nasıl ilerleyelim?
- **S9 (R15):** Bu sayfada ölçümde tek sekme rayı var; "2 tab" Enerji Defteri'ne mi aitti?
- **S10 (R11):** "Aboneliğim ve Ödemelerim" kalemi nereye bağlansın?

---
---

# EK TUR — Beyar'ın gözden geçirmesi (2026-08-24, öğlen)

Liste kapandıktan sonra Beyar canlı gezerken bulduğu maddeler. Aynı kayıt biçimi.

---

## R16 — Fit Testleri: bilgi kutusu metni iki sütuna bölünüyor, cümle ortadan kesiliyor

Durum: TOPLANDI
URL: http://127.0.0.1:8788/fit-testleri-v1.html
Görsel: `docs/screenshots/R12-16-hr-note-iki-sutun.png`

**Beyar'ın sözü:** "burdaki yazıyı niye böldün"

**Anlaşılan istek:** Sayfa altındaki sağlık uyarısı tek akan metin olsun; iki sütuna
bölünüp cümlenin ortasından kesilmesin.

**Görselden okunan:** Açık yeşil bilgi kutusu, ortasında dikey ayraç çizgisi. Sol sütun
"Fit Testleri tıbbi teşhis… Ağrı, baş dönmesi, **göğüste**" diye bitiyor, sağ sütun
"**sıkışma** ya da nefes darlığı hissedersen…" diye başlıyor. Tek cümle iki sütuna
bölünmüş; göz sol sütunun dibinden sağ sütunun tepesine dönmek zorunda.

**Canlı DOM ölçümü (1440px):**
| Eleman | Değer |
|---|---|
| `div#ftHrNot.hr-note.ft-hr-son` | `display:flex` · 1176×114 |
| `.hr-note p` | **`column-count:2`** · `column-gap:40px` · `column-rule:1px solid` · genişlik 1098 |

Kaynak: `fit-testleri-v1.html:63` →
`.ft-hr-son p{column-count:2;column-gap:40px;column-rule:1px solid var(--fit-line)}`
Kabuk kuralı değil, **sayfaya özgü**. Kıyas: `egzersiz-kutuphane-v1.html`'in aynı bilgi
kutusu tek akış (Beyar'ın ikinci görselinde görülüyor) — orada sütun kuralı yok.

**Dosyalar:**
- `fit-testleri-v1.html:63` — `.ft-hr-son p{column-count:2 …}`
- `assets/css/fit-shell.css` — `BİLGİ KUTULARINDA METİN KUTUYU DOLDURUR` (`.hr-note p`, R11/M5)

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** `.ft-hr-son p` üzerinde `column-count` = `auto`; metin tek sütunda
akıyor, hiçbir cümle sütun sınırında kesilmiyor. R11/M5 kararı (metin kutuyu doldurur,
`max-width` yok) korunuyor.

---

## R17 — Fit Testleri: çip rayı ile altındaki ayraç çizgisi arasında boşluk yok (0px)

Durum: TOPLANDI
URL: http://127.0.0.1:8788/fit-testleri-v1.html
Görsel: `docs/screenshots/R12-17-cip-divider-yakin.png` · `docs/screenshots/R12-17b-cip-divider-yakin.png`
(Beyar aynı maddeyi ikinci kez işaretledi — kayıt tek, önem vurgusu iki)

**Beyar'ın sözü:** "burdaki kartlar varya slider chiplerin altındaki divider çok yakın
boşluk bıraktır"

**Anlaşılan istek:** Kart içindeki çip rayı ile hemen altındaki ayraç çizgisi arasına
nefes girsin.

**Görselden okunan:** Kartlarda "~10 dk · Mat + duvar · Kuvvete başlayanlar" çip rayı,
hemen altında ince gri çizgi ve "Uygunluk taramasıyla başlar · Teste git" satırı.
Çizgi çiplerin dibine yapışık.

**Canlı DOM ölçümü (1440px, ilk kart):**
| Ölçü | Değer |
|---|---|
| `.ft-meta` (çip rayı) alt kenarı | 1180 |
| `.hub-foot` (ayraç + alt satır) üst kenarı | **1180** |
| **Aradaki nefes** | **0px** |
| `.hub-foot` `margin-top` | **`auto`** (hesaplanan 0) |
| `.hub-foot` `padding-top` | 14px (çizginin ALTINDA, üstünde değil) |
| `.hub-body p` ↔ `.ft-meta` arası (kıyas) | 13px |

Kök neden: kabuk `assets/css/fit-shell.css:1548` → `.hub-foot{margin-top:16px; …}`
16px nefes veriyor, ama sayfa kuralı `fit-testleri-v1.html:129` →
`.ft-card .hub-foot{margin-top:auto}` bunu **eziyor**. `margin-top:auto` flex'te artan
boşluğu yutar; R5'te paragraf `min-height` ile sabitlenince artan boşluk 0'a indi ve
16px'lik nefes tümüyle kayboldu. R5 öncesinde de 0px'ti (aynı satır o zaman da vardı),
ama kartlar hizasız olduğu için göze çarpmıyordu.

**Dosyalar:**
- `fit-testleri-v1.html:129` — `.ft-card .hub-foot{margin-top:auto;padding-top:14px}`
- `fit-testleri-v1.html:84-94` — R5'te eklenen `.ft-card .hub-body p{min-height:6.2em}`
- `assets/css/fit-shell.css:1548` — kabuk `.hub-foot{margin-top:16px;padding-top:14px;border-top:1px solid var(--line)}`

Tasarım dokunuşu: **EVET**
Bağımlılık: **R5** (aynı kartın hiza çözümü — bozulmamalı)

**Bitti kriteri:** `.ft-meta` alt kenarı ↔ `.hub-foot` üst kenarı arası 4px ızgarasında
ve **≥14px**; R5'in kazanımı korunuyor — aynı satırdaki kartlarda `.ft-meta` üst kenarı
hâlâ tek değer (sapma 0px) ve kart yükseklikleri eşit.

---

## R18 — Antrenörler: sayfalama kabuk kalıbına gelsin ("Önceki/Sonraki" → `« ‹ 1 2 3 › »`)

Durum: TOPLANDI
URL: http://127.0.0.1:8788/antrenorler-v1.html
Referans: http://127.0.0.1:8765/besin-kutuphanesi (Beyar netleştirdi) · aynı kalıp: http://127.0.0.1:8788/egzersiz-kutuphane-v1.html

**Beyar'ın sözü:** "burdaki pagination tutarlı değil önceki sonraki diyor ne alaka …
burdaki gibi yap [egzersiz-kutuphane] … düzelmesini istediğim pagination burda [antrenorler]"

**Anlaşılan istek:** Antrenörler sayfasındaki sayfalama, Egzersiz Kütüphanesi'ndeki
kabuk sayfalama bileşeninin aynısı olsun.

**Görselden okunan:** Antrenörler'de "‹ Önceki · **1** · 2 · Sonraki ›" — metin etiketli,
köşeleri düz. Egzersiz Kütüphanesi'nde "« ‹ **1** 2 3 › »" — yalnız ikon ve rakam,
kare yuvarlak düğmeler, ortalı.

**Canlı DOM ölçümü (1440px):**
| | Antrenörler | Egzersiz Kütüphanesi |
|---|---|---|
| Kapsayıcı | `nav#libPage.lib-page` · `justify-content:normal` · gap 13px | `nav#libPagi.pagi` · **`center`** · gap 8px |
| Düğme kabı | `div#pager.pager` (292×42) | doğrudan `button.pg` |
| Düğme | metin: "Önceki 1 2 Sonraki" · 16px/500 · **radius 0** | **44×44** · 14px/**700** · **radius 12px** |
| İlk/son atlama (`«` `»`) | **yok** | var (`button.pg.arrow`) |
| Özet satırı | `span#pageNote.page-note` 12.5px — "1–6 / 8 antrenör gösteriliyor · sayfa 1 / 2" | `.pagi-note` 12.5px — "25 hareket · 1–12 gösteriliyor · sayfa 1 / 3" |

Hedef bileşen kabukta hazır: `assets/css/fit-shell.css` → `SAYFALAMA` (`.pagi` · `.pg` ·
`.pg-dots` · `.pagi-note`) ve `assets/js/fit-shell.js` → `SAYFALAMA MOTORU` (`FIT_PAGI`),
R11/M6'da DadaGastro'dan ölçülerek alınmıştı (44×44 · 14px/700 · `.pagi-note` 12.5px).

**Dosyalar:**
- `antrenorler-v1.html` — `nav#libPage.lib-page` · `div#pager.pager` · `span#pageNote.page-note`
  işaretlemesi ve bunları basan sayfa JS'i
- `assets/css/fit-shell.css` — `SAYFALAMA` bloğu (hedef bileşen, dokunulmayacak)
- `assets/js/fit-shell.js` — `SAYFALAMA MOTORU` / `FIT_PAGI` (hedef motor, dokunulmayacak)

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** `antrenorler-v1.html`'de sayfalama `.pagi` / `.pg` sınıflarını taşıyor;
düğmeler **44×44**, 14px/700, radius 12px, ray ortalı; `«` ve `»` düğmeleri var; özet
satırı `.pagi-note` biçiminde ve antrenör sayısını doğru gösteriyor; filtre değişince
sayfalama doğru güncelleniyor (8 antrenör · 6/sayfa · 2 sayfa).

**REFERANS ÖLÇÜMÜ — DadaDiet besin kütüphanesi (yerel `127.0.0.1:8765`, 2026-08-24)**
Beyar referansı netleştirdi: `http://127.0.0.1:8765/besin-kutuphanesi`
(görsel: `docs/screenshots/R12-18-ref-besin-kutuphanesi-pagi.png`).

| Ölçü | DadaDiet `nav.pagi` | DadaFit kabuk `.pagi` | Durum |
|---|---|---|---|
| Kapsayıcı | `display:flex` · `justify-content:center` · gap **8px** | aynı | **birebir** |
| Düğme | **44×44** · 14px/**700** · radius **12px** · zemin #fff · kenarlık 1px `rgb(236,236,236)` | aynı | **birebir** |
| Aktif düğme | zemin `rgb(28,122,78)` (Diet yeşili) | Fit yeşili | palet farkı, ölçü aynı |
| Ellipsis | `span.pg-dots` "…" · 13×22 · 14px/700 | `.pg-dots` kabukta var | **birebir** |
| Dizilim | `« ‹ 1 2 3 … 17 › »` — ilk/son atlama + kısaltma + **son sayfa numarası** | aynı motor (`FIT_PAGI`) | **birebir** |
| Özet satırı | `span.pagi-note` 12.5px/500 — "399 besin · sayfa 1 / 17" | `.pagi-note` 12.5px | **birebir** |

**Sonuç:** Referans ile DadaFit'in kabuk `.pagi` bileşeni **aynı bileşen** — R11/M6'da
zaten bu kalıptan ölçülerek alınmıştı. Yeni bileşen üretilmeyecek, yeni ölçü
alınmayacak; `antrenorler-v1.html`'deki eski `.pager` işaretlemesi kabuk `.pagi` +
`FIT_PAGI` motoruna **taşınacak**, o kadar.

Tek yapısal fark: DadaDiet'te `.pagi-note` `nav.pagi`'nin **içinde**, DadaFit'te
kardeşi olarak dışında. Görsel sonuç aynı; taşırken DadaFit'in mevcut yapısı korunur
(kabuk 66 sayfada onu kullanıyor).

**Not — sayfa sayısı:** Antrenörler'de 8 kayıt · 6/sayfa = **2 sayfa**, yani `…`
kısaltması ve son-sayfa numarası bu sayfada **görünmeyecek** (görünecek kadar sayfa yok).
Bu kusur değil; aynı motor Egzersiz Kütüphanesi'nde 3 sayfada da göstermiyor.
Kalıbın doğru kurulduğu, düğme ölçüsü ve `«` `»` varlığıyla doğrulanacak.

---

## R19 — Plan profili: kart/avatar kapağa fazla biniyor, referansa göre yukarıda duruyor

Durum: TOPLANDI
URL: http://127.0.0.1:8788/enerji-defteri-v1.html · http://127.0.0.1:8788/hesabim-v1.html
Referans: `dadadiet.com/planim` (Beyar'ın ekranı)
Görsel: `docs/screenshots/R12-19-ref-diet-planim-profil.png` (referans) ·
`R12-19-fit-enerji-defteri-profil.png` · `R12-19b-fit-hesabim-profil.png`

**Beyar'ın sözü:** "profil birazdaha yaklaşmış … biraz fazla fark var güncellemeni
istiyorum tam olmamış bence"

**Anlaşılan istek:** Profil kartı ve avatarın kapağa binme oranı DadaDiet'teki gibi olsun;
avatar kapağın ortasında değil, alt kenarına yakın dursun.

**Görselden okunan:** DadaDiet'te avatar kapağın **alt kenarına** yakın, kartın üst
kenarıyla hizada başlıyor; kapak avatarın arkasında ince bir şerit gibi kalıyor.
DadaFit'te avatar kapağın **içine** daha derin giriyor, kapağın orta-alt bölgesinde duruyor.

**Canlı DOM ölçümü (1440px, `enerji-defteri-v1`):**
| Ölçü | DadaFit | DadaDiet (ölçülmüştü) |
|---|---|---|
| `.fp-kapak` / `.pf-banner` | 1176×**280** · radius 24px | **240** · radius 24px |
| `.fp-kimlik` / `.pf-head` `margin-top` | **−78px** | **−78px** |
| Kartın kapağa binmesi | **78px** | 78px |
| `.fp-ava2` / avatar | 128×128 · `margin-top:−70px` | 128×128 · −70px |
| Avatarın kapağa binmesi | **121px** | (aynı formül, kapak 40px kısa) |

**Kök neden:** Binme değerleri **birebir aynı** (−78 / −70). Tek fark **kapak yüksekliği**:
DadaFit 280px, DadaDiet 240px. Aynı negatif margin, 40px daha uzun kapakta avatarı
oransal olarak daha yukarıda bırakıyor — Beyar'ın gördüğü fark bu.

**Dosyalar:**
- `assets/css/fit-shell.css` — `PLAN PROFİL BAŞLIĞI` bloğu (`.fp-kapak` yüksekliği ·
  `.fp-kimlik{margin-top:-78px}` · `.fp-ava2{margin-top:-70px}`)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R20** (aynı bileşen, aynı agent) · **R13** (hesabim aynı kalıbı kullanıyor)

**Bitti kriteri:** Avatarın kapak alt kenarına uzaklığı DadaDiet oranıyla aynı;
14 plan sayfasında + `hesabim-v1`'de kalıp **tek değer** (sapma 0px).

**LEAD NOTU — 280 nereden geldi:** R11/M17'de plan profili **DadaGastro'nun**
`sefler/admin` `.pf-top` kalıbından ölçülmüştü (handoff §3: "kapak 280/24px"),
DadaDiet'ten değil. İki kardeş marka farklı ölçü kullanıyor. Beyar şimdi açıkça
DadaDiet'e benzemesini istiyor.
**Önerim:** kapak **240px**'e çekilsin (DadaDiet paritesi), binme değerlerine
(−78/−70) dokunulmasın. Bu 14 plan sayfası + `hesabim-v1`'i birden etkiler,
`KARARLAR.md`'ye yazılır.

---

## R20 — Plan profili: profil bölgesi ile sekme rayı iki ayrı zemin katmanı oluşturuyor

Durum: TOPLANDI
URL: http://127.0.0.1:8788/enerji-defteri-v1.html
Görsel: `docs/screenshots/R12-20-fit-iki-katman-zemin.png`

**Beyar'ın sözü:** "bide mesela diette arka plan gri ama burda 2 katman var fitte
bi profil tarafında bide tabin ord"

**Anlaşılan istek:** DadaDiet'te profil bölgesinin arkası tek gri zemin; DadaFit'te
profil bölgesi beyaz, sekme rayı gri — iki katman görünüyor. Tek zemine insin.

**Görselden okunan:** Profil kartının arkasındaki alan beyaz, hemen altındaki sekme
rayının arkası ise gri. İki blok arasında görünür bir zemin sınırı var; kart sanki
beyaz bir tabakanın üstünde, ray başka bir tabakada duruyor.

**Canlı DOM ölçümü (1440px):**
| Katman | y | h | zemin |
|---|---|---|---|
| `section.fp-profil` | 0 | 568 | **`rgb(255,255,255)` beyaz** |
| `div.pf-tabbar.fp-tabbar` | 568 | 75 | **`rgba(249,249,249,.94)` gri** |
| `section#yediklerim.sec.sec-fit` (gövde) | 643 | 1866 | `rgb(255,255,255)` beyaz |
| `body` / `main` | — | — | `rgb(249,249,249)` gri |

Üç farklı zemin arka arkaya: beyaz → gri → beyaz. Kart zaten kendi beyazını taşıyor
(`.fp-kimlik` `#fff`), dolayısıyla `.fp-profil`'in beyaz olması gereksiz bir katman yaratıyor.
DadaDiet'te profil bölgesinin zemini **sayfa zemini** (gri), yalnız kart beyaz.

**Dosyalar:**
- `assets/css/fit-shell.css` — `PLAN PROFİL BAŞLIĞI` (`.fp-profil` zemini · `.pf-tabbar` zemini)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R19** (aynı bileşen, aynı agent)

**Bitti kriteri:** `.fp-profil` ile `.pf-tabbar` `backgroundColor` değerleri **aynı**
(sayfa zemini `rgb(249,249,249)`); kart (`.fp-kimlik`) beyaz kalıyor ve kenarı okunuyor;
14 plan sayfası + `hesabim-v1`'de aynı sonuç.

---

## R21 — Plan profili: "Rozetlerim" satırı kartın içinde yalnız ve zayıf duruyor

Durum: TOPLANDI
URL: http://127.0.0.1:8788/enerji-defteri-v1.html
Görsel: `docs/screenshots/R12-21-rozetlerim.png` (Beyar'ın ekranı)

**Beyar'ın sözü:** "rozetlerim kısmını düzeltmei istiyorum bursı saçma olmuş"

**Anlaşılan istek:** Profil kartındaki "Rozetlerim" bağlantısı şu anki hâliyle
anlamsız/zayıf duruyor; düzgün bir yere ve biçime kavuşsun.

**Görselden okunan:** Profil kartında sıra: başlık "Enerji Defteri" → alt satır
"Elif Şahin" → açıklama paragrafı ("Defter seni yargılamaz…") → altında **tek başına,
ortalanmış**, küçük bir ikon + "Rozetlerim" metni. Ne düğme ne etiket; kartın
ortasında asılı kalmış tek bir bağlantı. Kartın geri kalanı sola dayalıyken bu ortada.

**Dosyalar:**
- `assets/css/fit-shell.css` — `PLAN PROFİL BAŞLIĞI` (`.fp-kimlik` içi)
- `enerji-defteri-v1.html` — "Rozetlerim" bağlantısının işaretlemesi
- (aynı satır başka plan sayfalarında da olabilir — dalga başında envanter çıkarılacak)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R19 · R20** (aynı bileşen, aynı agent)

**Bitti kriteri:** "Rozetlerim" kartın hizalama düzenine uyuyor (sola dayalı ya da
tanımlı bir eylem bölgesinde), tek başına ortada asılı kalmıyor; hedefi
(`fit-planim-rozetler-v1.html`) çalışıyor.

**SORU:** Bu satır ne olmalı — kaldırılsın mı, kartın meta satırına mı katılsın
(DadaDiet'te "Üyelik: 20 Ağustos 2026" satırı gibi), yoksa sağdaki eylem bölgesine
düğme mi olsun (DadaDiet'te "Programa Dön" düğmesi orada)?
**Önerim:** DadaDiet kalıbına uyulsun — meta satırına ikon + metin olarak katılsın,
sağdaki eylem bölgesi düğme için ayrılsın.

---

## R22 — Hesabım: fotoğraf yükleme formdan kalksın, kapak/avatar değiştirme profil kartına gelsin

Durum: TOPLANDI
URL: http://127.0.0.1:8788/hesabim-v1.html
Referans: `dadadiet.com/hesabim` (Beyar'ın ekranları)
Görsel: `docs/screenshots/R12-22-ref-diet-hesabim-kapak-avatar-degistir.png` (referans kart) ·
`R12-22-ref-diet-form-fotograf-yok.png` (referans form) ·
`R12-22-fit-hesabim-kart-kontrol-yok.png` (DadaFit kart) ·
`R12-22-fit-form-fotograf-yukle-var.png` (DadaFit form)

**Beyar'ın sözü:** "normalde böyle ayarları tıkladığımızda … gördün mü bak nasıl oluyor …
ama bak fitte nasıl … yani bak buraya burada foto yüklemesin ayarları tıkladğımda
kapak ve profil değiştir çıkıyor haberin olsun öyle olmasını istiyorum"

**Anlaşılan istek:** Hesap ve Ayarlar sayfasında fotoğraf yükleme işi **formun içinden**
çıksın; onun yerine profil kartının kendisinde — kapakta "Kapağı Değiştir" düğmesi,
avatarda kamera ikonu — belirsin. DadaDiet'teki davranışın aynısı.

**Görselden okunan (referans akışı, DadaDiet):**
1. `/planim` — profil kartı sade: avatar düz, kamera ikonu **yok**; sağda "Programa Dön" düğmesi.
2. `/hesabim` (ayarlar) — **aynı kart**, ama artık kapağın sağ üstünde beyaz
   **"📷 Kapağı Değiştir"** düğmesi, avatarın sağ altında yuvarlak **kamera rozeti** var.
   Yani düzenleme kontrolleri yalnız ayarlar sayfasında beliriyor.
3. `/hesabim` formu — "Profil bilgilerim" kartında **fotoğraf alanı YOK**: yalnız
   Ad · Soyad · Telefon · Kullanıcı adı · E-posta ve "Bilgileri Kaydet".

**Görselden okunan (DadaFit mevcut):**
4. `enerji-defteri-v1` — kart sade, kamera yok (referansla uyumlu, doğru).
5. `hesabim-v1` — kart aynı sade hâlde: kapakta "Kapağı Değiştir" **yok**, avatarda
   kamera rozeti **yok**.
6. `hesabim-v1` "Profil Bilgilerim" formunda **fotoğraf bloğu VAR**: yuvarlak önizleme +
   "📷 Fotoğraf Yükle" + "Kaldır" + "JPG veya PNG, en az 200×200 px. Kare kırpılır."

**Kaynak (ölçüldü):**
| Ne | Nerede |
|---|---|
| Kaldırılacak fotoğraf bloğu | `hesabim-v1.html:445-452` → `div.ava-row` (`.hs-ava` + `.ava-btns` + `Fotoğraf Yükle` + `.ava-del` + `.ava-note`) |
| Kapak (kontrol eklenecek) | `hesabim-v1.html:~387` → `div.fp-kapak[data-fit-px]` + `span.fp-kapak-mark` |
| Avatar (kamera rozeti eklenecek) | `hesabim-v1.html:~391` → `span.fp-ava2` |
| Ortak bileşen | `assets/css/fit-shell.css` → `PLAN PROFİL BAŞLIĞI` (`.fp-kapak` · `.fp-ava2` · `.fp-kimlik`) |

**Dosyalar:**
- `hesabim-v1.html` — fotoğraf bloğunun kaldırılması + kart üstü kontrollerin eklenmesi
- `assets/css/fit-shell.css` — yeni kontroller kabuk bileşenine eklenecekse
  (`.fp-kapak` üstü düğme · `.fp-ava2` kamera rozeti) — **yalnız kabuk sahibi agent yazar**

Tasarım dokunuşu: **EVET**
Bağımlılık: **R13** (kartı bu tur kurdu) · **R19 · R20 · R21** (aynı bileşen, aynı agent)

**Bitti kriteri:** `hesabim-v1.html`'de `div.ava-row` fotoğraf bloğu **yok**;
profil kartının kapağında "Kapağı Değiştir" düğmesi ve avatarda kamera rozeti **var**,
ikisi de dokunma hedefi ≥44×44; aynı kontroller `enerji-defteri-v1` ve diğer plan
sayfalarında **görünmüyor** (yalnız ayarlar sayfasına özgü); kaldırılan alandaki
"JPG veya PNG, en az 200×200 px" bilgisi kaybolmuyor (yeni kontrolün yanında ya da
ipucunda yaşıyor).

**NOT — prototip dürüstlüğü:** Sayfa zaten "Prototipte hesap gerçekten güncellenmez"
diyor. Yeni düğmeler de gerçek yükleme yapmayacak; mevcut kalıba uygun biçimde
davranmalı (tıklanınca dürüst bir geri bildirim), **sahte bir yükleme akışı taklit
edilmemeli**.

---

## R23 · R24 · R25 — Enerji Defteri: zemin tutarsızlığı, gereksiz boşluk, eşit olmayan bölüm araları

Durum: TOPLANDI · **ACİL** (Beyar: "burayi acilen guncelle")
URL: http://127.0.0.1:8788/enerji-defteri-v1.html
Referans: `dadadiet.com/planim` (Beyar'ın tam sayfa ekranı)

**Beyar'ın sözü:** "burda renk farki olmasin ya … buranin tam gri renk farkli degil …
burasinda renk farki var bide yukardian gereksiz bosluk var … sectionlar arasinda
bosluklar esit degil bide griden beyaza gecmis dietei baz al burayi acilen guncel;e"

**Görselden okunan (referans, DadaDiet `/planim` tam sayfa):** Sayfanın **tamamı** gri
zemin; profil kartı, sekme rayı ve içerik kartları **beyaz** kutular olarak o grinin
üstünde duruyor. Hiçbir yerde gri→beyaz bölüm geçişi yok — tek zemin, üstünde kartlar.

**Görselden okunan (DadaFit mevcut):** Profil bölgesi ve sekme rayı gri (R20 ile
düzeldi), ama **gövde bölümleri beyaz**. Sekme rayının altında geniş beyaz bir alan,
sonra CTA şeridi. "YEDİKLERİM" ve "HAREKETLERİM" bölümleri arasında eşit olmayan
boşluklar; bir yerde gri, bir yerde beyaz.

**Canlı DOM ölçümü (1440px):**
| Blok | y | h | zemin |
|---|---|---|---|
| `body` / `main` | — | — | `rgb(249,249,249)` gri |
| `section.fp-profil` | 0 | 528 | `rgb(249,249,249)` gri ✓ |
| `div.pf-tabbar.fp-tabbar` | 528 | 75 | `rgba(249,249,249,.94)` gri ✓ |
| `section#yediklerim.sec.sec-fit` | 603 | 1866 | **`rgb(255,255,255)` BEYAZ ✗** |
| `section.sec.sec-fit` (Hareketlerim) | 2469 | 705 | **`rgb(255,255,255)` BEYAZ ✗** |

- Bölüm dolguları: her ikisi de `padding: 74px 0` → iki bölüm arasında **148px** yığılma.
- Sekme rayı alt kenarı **603** → ilk içerik kartı **811** = **208px** boşluk.

**KÖK NEDEN — R12'de yanlış yöne çevrilmiş:** R12'de "sondaki gri bölüm" beyaza
çevrilmişti (builder: *"zemin `var(--bg-white)`'a çevrildi… referans tek zeminde
akıyordu"*). Referansın tek zemini **gri**, beyaz değil. O düzeltme doğru gerekçeyle
yanlış yöne gitti; R20'de profil bölgesi griye dönünce fark açığa çıktı.

**Maddeler:**
- **R23 — zemin:** gövde bölümleri sayfa zeminine (gri) dönsün; beyaz olan yalnız
  kartlar olsun. Sayfada gri→beyaz bölüm geçişi kalmasın.
- **R24 — üst boşluk:** sekme rayı ile ilk içerik arasındaki 208px gereksiz boşluk insin.
- **R25 — bölüm araları:** bölümler arası boşluklar eşit olsun (şu an 148px yığılma
  + eşitsiz aralıklar).

**Dosyalar:**
- `enerji-defteri-v1.html` — bölüm zeminleri, `.sec.sec-fit` kullanımı, dolgular
- `assets/css/fit-shell.css` — `.sec-fit` ortak sınıfı (**66 sayfada kullanımda**,
  dokunulursa önce/sonra ölçüm zorunlu)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R12** (aynı sayfa, ters yöne düzeltmeyi geri alıyor) · **R20** (aynı zemin kararı)

**Bitti kriteri:** `enerji-defteri-v1.html` @1440'te `<main>` altındaki tüm blokların
`backgroundColor` değeri **aynı** (`rgb(249,249,249)`); beyaz olan yalnız kartlar;
sekme rayı ↔ ilk içerik arası ≤80px; ardışık bölümler arası boşluklar **tek değer**
(sapma ≤4px). Diğer 65 sayfada `.sec-fit` kullanımı **etkilenmemiş** (ölçülerek kanıtlanacak).

---

## R26 — Ana sayfa: hero tam ekran olsun, altındaki beyaz panel ilk bakışta görünmesin

Durum: TOPLANDI
URL: http://127.0.0.1:8788/dadafit-hub-v1.html

**Beyar'ın sözü:** "burdaki hero tam ekran olacak yani alttaki beyaz paneli gormeyecegim ilk basta"

**Görselden okunan:** Hero ekranı dolduruyor ama en altta ince bir beyaz şerit görünüyor —
bir sonraki bölümün üst kenarı ekrana giriyor.

**Canlı DOM ölçümü (dört ekran boyu):**
| Ekran | `section.df-top` | `#kopru` üst kenarı | Ekran altında görünen |
|---|---|---|---|
| 1440×900 | `min-height:900px` · h=900 | **878** | beyaz panelin **22px**'i |
| 1440×1000 | 1000 · h=1000 | **978** | 22px |
| 1512×982 | 982 · h=982 | **960** | 22px |
| 390×844 | 844 · h=844 | **822** | 22px |

**Kök neden:** Hero **zaten `100vh`** — kusur orada değil. `section#kopru` dikiş taşıyor
(`.fit-seam.is-onbanner` → `margin-top:-22px`, R1/M1'de kurulan binme). O binme yüzünden
beyaz panelin **üst 22px'i** hero'nun içine giriyor ve ekranın dibinde şerit olarak
görünüyor. Yani sorun hero yüksekliği değil, **dikiş binmesinin ekran sınırına denk gelmesi**.

**Dosyalar:**
- `dadafit-hub-v1.html` — `section.df-top` yüksekliği
- `assets/css/fit-shell.css` — `BANNER → GÖVDE DİKİŞİ` (`.fit-seam.is-onbanner{margin-top:-22px}`,
  **50 sayfada ortak** — dokunulursa hepsi etkilenir)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R1** (aynı dikiş mekanizması)

**Bitti kriteri:** Dört ekran boyunda da (900 · 982 · 1000 · 844) ilk açılışta hero
ekranın tamamını kaplıyor; bir sonraki bölümün hiçbir pikseli görünmüyor
(ekran altında görünen = **0px**). Dikiş binmesi (yuvarlak köşe + 22px) **korunuyor** —
kaydırınca hâlâ görünüyor. Diğer 49 dikişli sayfa **etkilenmiyor**.

---

## R27 — Ana sayfa: tarif kartları DadaGastro kalıbına gelsin

Durum: TOPLANDI
URL: http://127.0.0.1:8788/dadafit-hub-v1.html
Referans: **https://dadagastro.com/tarifler** (Beyar'ın ekranı)

**Beyar'ın sözü:** "ana satfadaki tarif kartlari soyle olacak … https://dadagastro.com/tarifler gybncelle"

**Görselden okunan (referans, DadaGastro tarifler):** Beyaz **opak** kart, üstte tam
genişlik yemek görseli, görselin sol üstünde kategori çipi (Kahvaltılık · Pilav · Kek ve
Pasta), sağ üstünde yuvarlak beyaz **kalp** düğmesi; altta koyu başlık (2 satıra kadar),
meta satırı ikonlarla (⏱ 47 dk · ● Orta · 🍴 4 kişilik · ₺₺₺), en altta ince ayraç ve
yazar satırı (avatar + ad + ★ 5.0 + 👁 105).

**Görselden okunan (DadaFit mevcut):** Kartlar koyu parallax bandın üstünde **yarı saydam**
duruyor — arkadaki görsel içeriden okunuyor, kart "cam" gibi. Başlık + iki metrik
(38 g protein · 420 kcal) + "Tarifi Gör" bağlantısı var; yazar/puan/görüntülenme yok,
kalp yok, meta ikonları yok.

**Canlı DOM ölçümü (1440px):**
| Ölçü | DadaFit `a.rc-card` |
|---|---|
| Boyut | 380×336 · radius 16px |
| Zemin | **`rgba(255,255,255,0.07)`** — yarı saydam |
| Kenarlık | `1px rgba(255,255,255,0.16)` |
| Gölge | **yok** |
| Yapı | `.rc-media` (kategori çipi) + `.rc-body` (başlık · metrikler · "Tarifi Gör") |
| Kapsayıcı | `div.rc-grid`, koyu parallax bandın üstünde |

**Dosyalar:**
- `dadafit-hub-v1.html` — `.rc-card` · `.rc-media` · `.rc-body` · `.rc-grid` kuralları ve işaretleme
- (referans ölçümü dalga başında canlıdan alınacak: `dadagastro.com/tarifler`)

Tasarım dokunuşu: **EVET**
Bağımlılık: **R26** (aynı sayfa) · R16/M2 (tarif bandı R11'de kurulmuştu)

**Bitti kriteri:** Kart zemini **opak** ve referansla aynı ölçülerde (kart genişliği,
radius, gölge, görsel oranı, çip konumu, meta satırı); referans **canlıdan ölçülüp**
kütüğe yazılmış olacak, uydurma değer olmayacak (`docs/lessons.md` §8: ölçü alınır,
palet alınmaz — renkler DadaFit paletinde kalır).

**SORU:** Kart koyu parallax bandın üstünde duruyor. Referans kartları **beyaz zeminde**.
Bant koyu kalırsa beyaz kart üstünde mi duracak, yoksa bandın kendisi mi açılacak?

---

## R28 — Yeni Başlayanlar: açılan soruda başlık ile cevap arasına ayraç ve nefes

Durum: TOPLANDI
URL: http://127.0.0.1:8788/hareket-yeni-baslayanlar-v1.html

**Beyar'ın sözü:** "accordtionun altina divider koy aciklamanin ustunde gelecek
dividerlar dabbsoluk birak"

**Anlaşılan istek:** Açılan soru kartında, soru başlığı ile cevap metni arasına ayraç
çizgisi girsin; ayracın altında ve üstünde boşluk olsun.

**Görselden okunan:** "Spora başlamak için geç mi kaldım?" başlığı, hemen altında cevap
paragrafı — arada ne çizgi ne nefes var, metin başlığa yapışık başlıyor.

**Canlı DOM ölçümü (1440px, ilk soru açık):**
| Ölçü | Değer |
|---|---|
| `button.qa-head` alt kenarı | 1137 |
| `div.qa-body` üst kenarı | **1137** |
| **Aradaki nefes** | **0px** |
| `.qa-body` `border-top` | **`0px`** (ayraç yok) |
| `.qa-body` `padding-top` | 0px |
| `.qa.open` kart kenarlığı | `1px rgb(216,235,224)` |
| Sayfadaki soru kartı sayısı | (dalga başında sayılacak) |

**Dosyalar:**
- `hareket-yeni-baslayanlar-v1.html` — `.qa` · `.qa-head` · `.qa-body` kuralları
- (`.qa` başka sayfalarda da kullanılıyorsa dalga başında envanter çıkarılacak)

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** Açık soru kartında `.qa-head` ile `.qa-body` arasında `1px` ayraç
(`--line` ya da kartın mevcut kenarlık rengi) var; ayracın üstünde ve altında **eşit**
nefes (4px ızgarasında, ≥14px). Kapalı kartlarda ayraç **görünmüyor**. `.qa` kullanan
diğer sayfalar etkilenmişse hepsinde tutarlı.

---

## R29 — Fit Testi Detay: "ÖNCE OKU" akordeonunda aynı anda tek bölüm açık olsun

Durum: TOPLANDI
URL: http://127.0.0.1:8788/fit-testi-detay-v1.html?test=baslangic-seviyesi

**Beyar'ın sözü:** "buradaki accordotion kisminda tikladigimiz zaman digeri kapansin
tama mmi max 1 tanesi acik olsun anladin mi … once oku accordotion u"

**Canlı DOM ölçümü:** `button.ft-acc` **3 adet** (Test amacı · Kimler için uygun olduğu ·
Güvenlik uyarısı). Başlangıçta yalnız ilki açık. **İkincisine tıklandı** →
`aria-expanded` = `["true","true","false"]` → **aynı anda açık 2**. Yani her bölüm
bağımsız açılıp kapanıyor, biri diğerini kapatmıyor.

**Dosyalar:** `fit-testi-detay-v1.html:457-470` civarı (`.ft-acc` · `.ft-acc-govde` ·
`aria-expanded` mekanizması) ve bunları yöneten sayfa JS'i

Tasarım dokunuşu: **HAYIR** (davranış)
Bağımlılık: YOK

**Bitti kriteri:** Herhangi bir başlığa tıklandığında **aynı anda açık bölüm sayısı 1**;
açık olana tekrar tıklanınca kapanıyor (hepsi kapalı da olabilir); `aria-expanded`
değerleri gerçek duruma uyuyor; klavyeyle de çalışıyor.

---

## R30 — Video Seansları: kart içi ayraç boşluğu + ikiden fazla etiket "+N" olsun

Durum: TOPLANDI
URL: http://127.0.0.1:8788/video-seanslari-v1.html

**Beyar'ın sözü:** "burda alttakı dıvıderla boşluk olacak tag 2 den fazla olunca
+ seklinde gosterilecek"

**Canlı DOM ölçümü (1440px, ilk 3 kart):** `a.hub-card.vs-card` · 18 kart · yükseklik 390.
Etiket satırında **3 öğe** görünüyor (süre · seviye · ekipman/antrenör çipleri).
Etiketlerin altı ile alt ayraç arası ölçüldü: **110px** (kart içi boşluk dengesiz).

**İki iş:**
- Etiket satırı ile altındaki ayraç arasına düzenli boşluk (R17'deki 16px kalıbıyla tutarlı).
- Etiket sayısı **2'yi aşınca** fazlası **"+N"** rozetiyle gösterilsin
  (ör. `Derya Yıldız` · `Mat` · `+1`).

**Dosyalar:** `video-seanslari-v1.html` — `.vs-card` · etiket satırı · alt ayraç kuralları
ve kartları basan JS şablonu

Tasarım dokunuşu: **EVET**
Bağımlılık: **R31** (aynı kart, aynı agent)

**Bitti kriteri:** Etiket satırı ↔ ayraç arası tüm kartlarda **tek değer** ve 4px
ızgarasında; 2'den fazla etiketi olan kartlarda görünen etiket **2 + "+N"**;
"+N" sayısı gizlenen etiket sayısıyla birebir; hiçbir kartta etiket taşması yok.

---

## R31 — Video Seansları: başlık 2 satır + açıklama en uzun hâlde kart bozulmasın

Durum: TOPLANDI
URL: http://127.0.0.1:8788/video-seanslari-v1.html

**Beyar'ın sözü:** "title 2 atir oldugunu dusun max yazi aciklamada oyle aralarindaki
bosluklari koru"

**Canlı DOM ölçümü (1440px):** Kart yüksekliği 390 (tek değer) ama içerik uzunlukları
farklı: başlık **1 satır** (bazılarında 2), açıklama **2–3 satır** arasında değişiyor.
Yani içerik uzadıkça iç boşluklar eziliyor.

**Anlaşılan istek:** Kart, başlık **2 satır** ve açıklama **en uzun** hâldeyken de
bozulmayacak biçimde tasarlansın; bileşenler arası boşluklar bu durumda da korunsun.
(R5'te `fit-testleri` kartlarında aynı sorun `min-height` ile çözülmüştü — aynı kalıp.)

**Dosyalar:** `video-seanslari-v1.html` — `.vs-card` içi başlık/açıklama kuralları

Tasarım dokunuşu: **EVET**
Bağımlılık: **R30** (aynı kart, aynı agent) · R5 (aynı kalıp, oradaki çözüm örnek alınacak)

**Bitti kriteri:** 18 kartın hepsinde yükseklik **tek değer**; başlık 2 satıra çıktığında
ve açıklama en uzun hâlindeyken alt ayraç ve etiket satırı **aynı y'de** kalıyor
(sapma 0px); hiçbir kartta metin kırpılmıyor. @1440 · @1024 · @390.

---

## R32 — Üst çubuk: dil seçicinin solundaki ayraç ile arasına boşluk

Durum: TOPLANDI
URL: (kabuk · her sayfada) örn. http://127.0.0.1:8788/video-seanslari-v1.html

**Beyar'ın sözü:** "ingilizcedeki ikon setine soldaki divider ile bosluk ver"

**Görselden okunan:** Üst koyu çubuğun sağında kardeş marka ikonları, sonra dikey ayraç
çizgisi, hemen ardından `🌐 EN` dil seçici. Ayraç ile dil seçici **birbirine yapışık**;
soldaki ikon grubuyla arasındaki nefes de dengesiz.

**Dosyalar:** `assets/css/fit-shell.css` — `.topbar` dil seçici ve ayraç kuralları
(**66 sayfada ortak** — dokunulursa hepsi etkilenir, önce/sonra ölçüm zorunlu)

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** Ayraç ile dil seçici arası ve ayraç ile soldaki ikon grubu arası
**eşit** (4px ızgarasında); üst çubuğun toplam yüksekliği değişmiyor; 66 sayfada
tutarlı; @1440 · @1024 · @390.

---

## R33 — Video Seans Detay: banner sayaçları diğer sayfalarla aynı hizada değil

Durum: TOPLANDI · **ACİL**
URL: http://127.0.0.1:8788/video-seans-detay-v1.html?seans=ekipmansiz-kondisyon

**Beyar'ın sözü:** "buradaki detay patlamis … burdaki istatistikler sayaclar her yerde
saga yasli ya budrda niye merkeze"

**Canlı DOM ölçümü — `.lib-stats` bloğu, altı sayfada karşılaştırmalı (1440px):**
| Sayfa | `.lib-stats` x | genişlik | sağ boşluk |
|---|---|---|---|
| video-seanslari | 1192 | **116** | 0 |
| egzersiz-kutuphane | 1213 | **96** | 0 |
| antrenorler | 1175 | **133** | 0 |
| fit-testleri | 1173 | **135** | 0 |
| **video-seans-detay** | **667** | **641** | 0 |

**Kök neden:** Blok her sayfada sağ kenara yaslı (sağ boşluk 0), ama video-seans-detay'da
**641px** genişlikte — diğerlerinin ~5 katı. İçindeki üç sayaç (`div.lib-stat`, 68 · 36 ·
59 px) bloğun **soluna** yaslı olduğu için sayaçlar banner'ın ortasında duruyor.
Diğer sayfalarda blok içeriğine göre daralıyor, burada `.lib-row` içinde kalan alanı
dolduruyor (`.lib-main` içeriği kısa olduğu için).

**Sayfa "patlamış" değil:** JS hatası **0**, yatay taşma **yok**, içerik dolu (6967 karakter),
üç ana bölüm yerinde. Kusur yalnız bu hizalama.

**Dosyalar:**
- `video-seans-detay-v1.html` — `section#vsdTop.lib-top` içindeki `.lib-row` / `.lib-stats` yapısı
- `assets/css/fit-shell.css` — `.lib-row` · `.lib-stats` · `.lib-stat` (ortak, dikkat)

Tasarım dokunuşu: **EVET**
Bağımlılık: YOK

**Bitti kriteri:** `video-seans-detay-v1.html`'de `.lib-stats` genişliği ve konumu diğer
liste sayfalarıyla **aynı davranışta** — içeriğine göre daralıyor, sağ kenara yaslı,
sayaçlar sağda toplanıyor. Beş kardeş sayfada ölçüm **değişmemiş** olacak.
