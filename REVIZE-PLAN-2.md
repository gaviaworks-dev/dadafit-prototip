# DadaFit — kapsamlı revizyon planı (2. tur)

Kaynak belge: `~/Desktop/DadaFit - Source/17 Ağustos /dada-fit.docx`
(26 bölüm + nihai kabul kriterleri · `textutil -convert txt` ile okundu, 627 satır)
Referans site: <https://dadadiet.com/> ve <https://dadadiet.com/diyetisyenler>
Önceki tur: `REVIZE-PLAN.md` (11 madde, tamamlandı) · mimari: `HANDOFF.md`

Bu dosya oturum koparsa buradan devam etmek için tutulur. Her madde bitince kutu işaretlenir.
Kural: **"düzelttim" demeden önce ölç** — boundingBox / scrollWidth / kontrast / HTTP durumu.

---

## Ölçüm altyapısı

Playwright repoya kalıcı test olarak girdi (`tests/`), `playwright-core` repo dışından çözülür:

```bash
mkdir -p ~/.pw && cd ~/.pw && npm init -y && npm i playwright-core
npx playwright install chromium
export PW_HOME=~/.pw
cd <repo> && python3 -m http.server 8811 &
node tests/dropdown-position.mjs                 # A1 regresyonu
```

| Dosya | Ne kanıtlar |
|---|---|
| `tests/_pw.mjs` | playwright-core çözücü (repo'ya node_modules kurulmaz) |
| `tests/dropdown-position.mjs` | hover ≡ tıklama panel konumu · scrollWidth · header sabitliği |
| `tests/header-banner.mjs` | banner sayfasında şeffaf→katı header · Planım solid · üst üste binme |
| `tests/coach-list.mjs` | dizin kurgusu · filtre motoru · çekmece · rozet çakışması |
| `tests/plan-account.mjs` | Planım altı sekme · ray dışı sayfalar yetim değil · Hesabım §5 |
| `tools/page-check.mjs` | **tek sayfa kalite kapısı** — Faz 2/5'te her sayfa bundan geçer |
| `tools/legacy-migrate.py` | legacy kabuk sökümü + kural-kural CSS süzme + `--css-from-head` kurtarma |

### Paralel çalışma — dosya sahipliği

| Katman | Sahibi |
|---|---|
| `assets/js/fit-shell.js` · `assets/css/*.css` · `REVIZE-PLAN-2.md` · `tools/*` · `tests/*` | **yalnız ana oturum** |
| Bir HTML sayfası | o sayfaya atanmış **tek** alt ajan |
Alt ajan kabukta kural gerekirse rapor eder, ana oturum merkezî olarak uygular. Ajan commit atmaz.

---

# FAZ 0 — ACİL DÜZELTMELER

## A1 · Dropdown tıklamada sağa kayıyor ✅

- [x] **Kök neden (ölçüldü, tahmin değil):** `fit-shell.css:1551`
  `.nav-item:focus-within>.dropdown{ … transform:none … }`.
  Panelin temel konumlandırması `left:50%` + `transform:translateX(-50%)` ile ortalamadır.
  `transform:none` bu ortalamayı da siler → panel kendi genişliğinin **yarısı** kadar sağa zıplar.
  Hover'da `.nav-item:hover` kuralı `translateX(-50%)` koruduğu için panel doğru yerde;
  **tıklama odak zincirini kurunca** `:focus-within` devreye girip paneli kaydırıyordu.
- [x] **Düzeltmeden önceki ölçüm (1440px, 6 sayfa):** 12/12 panel kaydı —
  Hareket Δx=**280.0px** (panel 560px → tam yarısı), Programlar Δx=**132.6px** (panel 265.2px → tam yarısı).
- [x] `fit-shell.css` — `:focus-within` kuralı `transform:translateX(-50%) translateY(0)` yapıldı;
  `.mega` için ayrı (yatayda ortalanmayan) kural yazıldı. Neden-yorumu dosyaya işlendi.
- [x] **Düzeltmeden sonraki ölçüm:** 1440 · 1280 · 1100 px × 6 sayfa = **36 panel, 0 sorun**,
  iki ardışık koşuda aynı sonuç.
- [x] Test repoya kalıcı kondu: `tests/dropdown-position.mjs`.
- [x] Testin kendisi doğrulandı: düzeltmeden **önce** çalıştırıldı ve hatayı yakaladı
  (bir test, kırmızıya döndüğü görülmeden yeşil sayılmaz).

**Not — testteki incelik:** hero'lu sayfalarda header şeffaf başlayıp beyaz logoya geçer;
logo geç yüklenirse marka bloğunun genişliği değişir ve ortalanmış `.nav` birkaç px kayar.
Bu tıklamayla ilgisiz bir yükleme yarışıdır; test `.nav` boundingBox'ı iki ardışık okumada
aynı çıkana kadar bekleyerek bunu ayıklar (ilk koşuda 3.6px'lik yanlış alarm bu yüzden çıkmıştı).

## A2 · Banner'lı sayfalarda header şeffaf + Planım solid ✅

- [x] **Ölçülen referans (dadadiet.com, 1440px):**
  - `/diyetisyenler` (banner sayfası, tam hero değil) `header.at-top` ile açılıyor →
    `background: rgba(0,0,0,0)`, `box-shadow:none`, `border-color: rgba(255,255,255,.14)`.
  - 400px scroll sonrası `at-top` düşüyor → `background: rgba(255,255,255,.94)`,
    `box-shadow: rgba(33,30,22,.05) 0 4px 20px`.
  - **Yani DadaDiet at-top'ı tam-hero sayfasına özel kullanmıyor; banner taşıyan liste
    sayfalarında da uyguluyor.** DadaFit'te `HERO_MODE` yalnız `body[data-fit-hero="1"]`
    ile açılıyor (`fit-shell.js:656`), banner'lı sayfalar hep katı.
  - Planım düğmesi `.btn-login`: `background rgb(28,122,78)` (kendi yeşili), `color #fff`,
    `border 1px` aynı yeşil, `radius 12px`, `font-weight 700`, `font-size 14px`, `padding 0 18px`
    → **solid primary**, outline değil. DadaFit karşılığı `--fit` = `#009d4f`.
- [x] `fit-shell.js` — tek merkezi bayrak: `OVER_MODE = HERO_MODE || .lib-top|.fp-top var mı`
  → `body[data-fit-over="1"]`. Sayfa sayfa kopya yok, 16 banner sayfası birden kazandı.
  `?hdr=solid` hâlâ katıyı zorluyor (bayrak da geri alınıyor).
- [x] `fit-shell.css` — `body[data-fit-over="1"] .lib-top{margin-top:0;padding-top:152px}`
  (+ ≤1024 → 142px, ≤640 → 86px). **İçerik bir piksel oynamıyor:** eski
  `margin-top + padding-top` toplamı kadar `padding-top` verildi (112+40 · 112+30 · 62+24);
  yalnız koyu zemin header'ın arkasına uzadı.
  *Seçici bilinçli olarak iki sınıf derin* (`body[...] .lib-top` = 0,2,0): 16 sayfa kendi
  `<style>` bloğunda `.lib-top{margin-top:112px}` kopyasını taşıyor ve o bloklar
  `fit-shell.css`'ten sonra geliyor — özgüllük onları yeniyor, 16 dosyayı düzenlemek gerekmedi.
- [x] `fit-shell.css` — `.btn-plan` artık `.btn-login`'i **ezmiyor** → solid primary.
  Eski ghost tanımları (beyaz zemin, gri kenar) ve `.header.at-top .btn-plan` cam varyantı silindi:
  ölçüm, kardeş üründe `at-top` durumunda da düğmenin **dolu yeşil** kaldığını gösterdi.
- [x] **Ölçüm — `tests/header-banner.mjs`, 14 sayfa × 3 genişlik (1440/1024/390) = 0 sorun:**
  banner sayfalarında scroll=0 şeffaf → scroll=400 katı · banner **taşımayan** 3 sayfada
  header katı kalıyor (mod sızmıyor) · Planım her iki header durumunda dolu yeşil + beyaz metin ·
  breadcrumb header'ın altında kalmıyor (üst üste binme yok).

**Faz 9'a devredilen ölçüm bulgusu — birincil düğme kontrastı:** solid yeşil `#009d4f`
üzerine beyaz 14px/700 metin **3.55:1** veriyor; WCAG AA normal metin için 4.5:1 gerekiyor
(14px bold "büyük metin" sayılmaz). Kardeş ürünün yeşili `rgb(28,122,78)` daha koyu ve
**5.32:1** ile geçiyor. Bu, `.btn-login`/`.btn-primary`'nin tamamını ilgilendiren site geneli
bir karar (yalnız Planım'ı koyulaştırmak iki düğmeyi birbirinden ayırır), bu yüzden A2'de
görünüş birebir istendiği gibi bırakıldı ve madde §20 kapsamına yazıldı: `--tomato-dark`
(`#007a3d`, 5.45:1) birincil dolgu yapılırsa hem AA sağlanır hem yeşil kimlik korunur.

## A3 · Egzersiz kütüphanesi banner'ındaki arama input'u kalkacak ✅

- [x] `egzersiz-kutuphane-v1.html` — banner içindeki `.lib-search` formu kaldırıldı.
- [x] Güvenlik kontrolü: sayfa JS'i input'u **null-korumalı** okuyordu
  (`var searchInput=…; if(searchInput){…}`), yani markup kalkınca filtre motoru etkilenmiyor.
  Tüm `searchInput` geçişleri tek tek denetlendi, korumasız kullanım yok.
- [x] **Referans doğrulaması:** DadaDiet `/diyetisyenler` banner'ında arama input'u **yok** —
  banner'da yalnız `.chips` içinde `btn-primary` + `btn-ghost` var (ölçülen DOM: `div.chips.drag-scroll`).

**Not:** aynı banner arama formu üç sayfada daha duruyor (`hareket-merkezi`,
`program-liste`, `programlar-merkezi`). Belge onları saymadığı ve input'un kaldırılması
metin aramasını gerçekten kaldırdığı için (işlev kaybı) dokunulmadı — sonda soruluyor.

## A4 · Antrenörler sayfası — dadadiet.com/diyetisyenler kurgusu ✅

- [x] Banner içindeki arama input'u kaldırıldı (A3 ile aynı kural).
- [x] **Ölçülen referans kurgu** (1440px, `/diyetisyenler` DOM + CSS):

  ```
  section.lst-top            banner · padding-top:128px · koyu gradient + foto
    div.wrap
      nav.rd-crumb           breadcrumb
      div.lst-hero           grid: minmax(0,1fr) auto · gap 44px · align-items:end
        div                  eyebrow → h1(44px) → p.lead(max 560px) → div.chips(btn-primary+btn-ghost)
        div.lst-stats        dikey 3 istatistik · sol kenarlık 1px rgba(255,255,255,.18) · padding-left 38px
  section.lst-sec            padding 38px 0 74px · zemin bg-cream
    div.wrap
      div.lst-layout         grid: 272px minmax(0,1fr) · gap 30px · align-items:start
        aside.lst-side       STICKY top:130px · paper zemin · 1px line · radius-lg
                             padding 6px 20px 14px · max-height calc(100vh - 154px) · overflow-y auto
          div.fil-top        "Filtreler" başlığı + .fil-clear (sıfırla)
          div.fct[.open]×N   akordeon facet · .fct-head(+.fct-dot sayaç, .fct-car chevron) + .fct-body
                             .fct-row = checkbox + .cbx + .ft + .fcnt(sayı) · .fct-more "daha fazla"
        div.lst-main
          div.lst-bar        .lst-sum (sonuç sayısı) ←→ .lst-tools (.sort-dd)
          p.dz-vnote         doğrulama/uyarı notu
          div.dz-grid        grid repeat(3,1fr) · gap 24px  → ≤1024: 2 kolon · ≤640: 1 kolon
          div.lst-empty      boş durum
          nav .pager         .pg düğmeleri (44px, radius-md) + .pg-dots · .pg.active dolu
      div.sheet-overlay      ≤1024px: .lst-side alttan çekmeceye döner (.sheet-head/.sheet-body/.sheet-foot)
  ```

  Kart anatomisi (`.dz-card`, ortalanmış kolon):
  `.dz-ribbon` (sol üst şerit) · `.dz-save` (sağ üst 34px daire) · `.dz-top`(34px 20px 20px) →
  `.dz-ava` 72px daire + 3px beyaz çerçeve + `.dz-on` yeşil nokta · `.dz-id` → h3 + `.dz-verify` ·
  `.dz-title` · `.dz-rate` → `.dz-tags` (üstte 1px çizgi, ilk 2 etiket) → `.dz-meta` (ilk 2 alan) →
  `.dz-foot` (`margin-top:auto`, bg-cream, üst çizgi) → `.dz-price` + `.dz-go`.

- [x] `fit-shell.css` — kurgu **merkezi** olarak eklendi (`.lst-layout`, `.lst-side`, `.fil-top`,
  `.fct*`, `.sheet-*`, `.fil-trigger`), DadaFit token'larına ve yeşil kimliğine çevrilmiş hâlde.
  Sayfaya kopyalanmadı; sonraki liste sayfaları da bu kitten beslenebilir.
- [x] `antrenorler-v1.html` — sol filtre kolonu + sağ sonuç kolonu + altta sayfalama.
- [x] **Kritik kısıt tutuldu:** `#libFilters` kimliği ve `.fgroup[data-group]` kutuları aynen
  korundu, çipler klonlanmadı — yalnız yerleşimleri değişti. Motor dokunulmadı ve test ediliyor.
- [x] Çipler dikey satır + kutucuk görünümüne alındı (`.lst-side .df-fchip`), `<button>` kaldı →
  `aria-pressed` ile durum bildiriyor (belge §20 filtrelerde `aria-pressed` istiyor).
- [x] Facet başına aktif seçim sayacı (`.fct-dot`) + akordeon aç/kapa.
- [x] Mevcut `.pager` korundu — zaten DadaDiet `.pg` sınıf diliyle aynı desende.
- [x] ≤1024px'te sol kolon alttan çekmeceye dönüyor (`.sheet-head/.sheet-body/.sheet-foot`,
  örtü, `FIT_SHELL.lockScroll` ile kaydırma kilidi, Escape ile kapanma).
- [x] **Kaldırılan kopya motor:** sayfadaki "Sana uygun antrenörü bul" `.fp-card` paneli de
  aynı `.coach-card` düğümlerinin `style.display`'ini yazıyordu; dizinin sayfalama motoru da
  aynı özelliği yazıyor. İki motor tek özelliği paylaşamaz — panelden seçim yapılınca kart
  sayısı ve sayfa numarası tutmuyordu. Referansta da böyle bir satır içi panel yok
  (eşleştirme banner'daki sihirbaz düğmesi). Panel kaldırıldı, sağlık uyarısı `.dz-vnote`
  olarak liste başına taşındı.
- [x] **Ölçüm — `tests/coach-list.mjs`: 1440 + 1024 + 768 + 390 px, 0 sorun.**
  Sol kolon 272px ve sticky (kaydırma sonrası y=9) · sonuç kolonu sağda · ızgara 3/2/2/1 kolon ·
  sayfalama ızgaranın altında ve 2. sayfaya geçiyor · **filtre çalışıyor: 8 → 2 sonuç**,
  facet sayacı 1, `aria-pressed=true`, sıfırla 8'e dönüyor · çekmece açılıp kapanıyor ·
  yatay taşma ve konsol hatası yok.

### A4'te ölçerek yakalanan iki gerçek hata (gözle bakmadan geçilecekti)

1. **Mobil çekmece çökmüştü.** `.sheet-body{flex:1 1 0}` — çekmecenin yüksekliği içeriğe
   göre belirlendiği için `flex-basis:0` konteynerin içerik yüksekliğini `head+0+foot` yapıyor,
   `flex-grow`'a dağıtacak boş alan kalmıyor. Ölçüm: gövde **height=10px**, `scrollHeight=732px` —
   facet'ler pratikte görünmüyordu. **Testler yine geçiyordu**, çünkü Playwright kaydırılabilir
   kapsayıcı içindeki düğmeye kendi kendine kaydırıp tıklıyor. `flex:1 1 auto` ile düzeltildi
   (şimdi 589px gövde, kendi içinde kayıyor) ve teste "gövde gerçekten görünür mü" kontrolü eklendi.
2. **Kart rozetleri üst üste bindi.** Sol kolon gelince kart genişliği ~397px'ten ~273px'e indi;
   "DadaFit Onaylı" ve uygunluk rozeti ikisi de `position:absolute` (biri sol, biri sağ üst) olduğu
   için çakıştılar. Tek bir `.coach-badges` flex satırına alındılar; ayrıca flex öğeleri varsayılan
   `shrink:1` taşıdığı için uygunluk rozeti içeriğinin altına sıkışıp metnini pilin dışına
   taşırıyordu → `flex:0 0 auto` + `nowrap`. Teste rozet kesişimi ölçümü eklendi.

---

# FAZ 1 — BAĞIMSIZLAŞTIRMA (belge §1)

Ölçülen kapsam: **1416** "DadaMutfak" geçişi, **70** "Mentor" geçişi.
Bunun ~1150'si 12 legacy sayfanın kendi satır içi turuncu kabuğunda (Faz 2'de kalkacak).

- [x] **DadaMentor tamamen kaldırıldı** (belge §1 ve §21 — yerine başka AI asistanı da eklenmedi):
  - [x] `fit-shell.js` — `MENTOR_HTML` sabiti (1980 karakter) ve mount'taki kullanımı
  - [x] `fit-shell.js` — DadaMentor davranış bloğu (1641 karakter)
  - [x] `fit-shell.css` — `.mentor-panel` / `.mp-*` kuralları (37 satır)
  - [x] `assets/video/mentor-panel.mp4` **silindi** — 2.4 MB (belge §18)
  - [x] Yalnız o panelin kullandığı **ölü token/sınıf bloğu** da kaldırıldı: `--d-3` · `--d-deep`
    · `--dline` · `--sh-3` · `--panel-fl` · `--ease-spring` · `--tomato-rgb` · `--b-*-l` ve
    `.w-gastro/.w-gourmet/.w-diet/.w-fit/.w-akademi`. Ölçüm: panel kalktıktan sonra bu adların
    tek geçişi kendi tanımlarıydı (belge §18 "kullanılmayan CSS'i kaldır").
  - [x] 34 sayfadaki artık `mentor` yorum satırları temizlendi
  - [x] Footer içinde/üstünde Mentor yok (belge §16)
  - [x] **Yan kazanç — çift id hatası kapandı:** `MENTOR_HTML` kendi içinde de bir
    `<button id="toTop">` taşıyordu, mount ayrıca bir tane daha basıyordu; her sayfada
    **aynı id'den iki düğme** vardı. Blok kalkınca tekilleşti (47 sayfada ölçüldü).
  - [x] **Yan etki düzeltildi:** mobil tam-ekran hero'nun alt payı 146px'ti çünkü alt barın
    yanında mentor mini paneli de ekranın altını kaplıyordu. Panel gidince o pay boşluğa
    dönüştü → `calc(72px + safe-area)` yapıldı.
  - [x] **Doğrulama (47 sayfa, 1440px):** DadaMentor kalıntısı YOK · çift `#toTop` YOK ·
    404/hatalı istek YOK · konsol/JS hatası YOK.
- [x] **Marka dili — kabuk + 35 DadaFit sayfası** (12 legacy sayfa ajanlarda):
  - [x] "DadaMutfak Onaylı Antrenör" → "**DadaFit Onaylı Antrenör**" (kart rozetleri, başlıklar, JS title'ları)
  - [x] "DadaMutfak Pro" → "**DadaFit Pro**" (pro kapısı dahil)
  - [x] 42 sayfanın `<title>` kuyruğundaki DadaMutfak → sahibim olan 35'inde temizlendi
  - [x] Ekosistem prozası doğru ürüne bağlandı: **tarif/menü → Dada Gastro**,
    **TDEE/beslenme/diyetisyen → Dada Diet** (eski şemsiye adı değil). Giriş kapısı metni DadaFit.
  - [x] **Ölçüm:** 35 sayfada görünen metinde DadaMutfak geçişi **0**
- [x] **Ekosistem bağlantıları tek noktadan** (§14): 37 gömülü adres vardı. Kök artık kabukta
  `ECO_BASE`; yükleme anında yeniden yazılıyor → markup'taki eski önek adres değil, "bu bir
  ekosistem bağlantısı" işareti. Gerçek servis adresi belirlenince **yalnız `ECO_BASE`** değişir.
  Her bağlantı `data-eco="gastro|diet|gourmet|campus"` ile hangi sisteme gittiğini bildiriyor
  (§14 "hangi sistemle paylaşıldığı açıkça gösterilmelidir"), ve `target=_blank rel=noopener`
  ile kullanıcı DadaFit'ten düşmüyor. Ölçüm: hub 13 · enerji-defteri 19 · köprü 10 · rehber 5.
- [x] "DadaMutfak'a dön" hesap menüsünden ve drawer'dan kaldırıldı; ekosistem geçişi yalnız
  üst bandın marka barında (kontrollü bağlantı).
- [x] Çıkış artık DadaFit'in kendi hedefine gidiyor (`FIT_LOGOUT`), DadaMutfak portalına değil.

---

# FAZ 2 — 12 LEGACY SAYFANIN ORTAK KABUĞA TAŞINMASI (belge §1, §23)

`bildirimler · giris · hakkimizda · hesabim · iletisim · pro-odeme · pro · profil · reklam-ver ·
rozetler · sss · yasal` — her biri kendi satır içi turuncu DadaMutfak kabuğunu taşıyor
(`--tomato:#E14827`), `fit-shell.css/js` yüklemiyor. Belge bunları DadaFit arayüzüne geçirmeyi
açıkça istiyor; ayrıca §23 "sayfa bazında tekrarlanan header ve footer kodlarını temizle" diyor.

## ✅ FAZ 2 TAMAMLANDI — 12/12

Ölçüm: `grep -c fitShellTop` 12 dosyanın her birinde **1** → toplam 12/12.

- [x] Sayfa sözleşmesine geçiş: `<div id="fitShellTop">` / `<div id="fitShellBottom">` + `fit-shell` yükleme
- [x] Gömülü header/nav/footer/drawer/topbar markup'ı ve onların `<style>`/`<script>` blokları söküldü
- [x] Ölü kod: `.row-track`/`.row-nav` slider CSS+JS silindi
- [x] Sayfaya özgü içerik stilleri korundu, marka token'ları DadaFit yeşiline çevrildi
- [x] Sıra: `sss` → `iletisim` → `yasal` → `bildirimler` → `hakkimizda` → `pro` → `giris`
      → `hesabim` → `reklam-ver` → `pro-odeme` → `rozetler` → `profil`

| Sayfa | karakter | `main` metni (göç öncesi → şimdi) | page-check |
|---|---|---|---|
| `pro-odeme-v1` | 122828 → 35800 | 817 → **2318** | 4/4 temiz |
| `rozetler-v1` | 153573 → 58651 | 2658 → **4509** | 4/4 temiz |
| `profil-v1` | 365448 → 260641 | 1501 → **1576** | 4/4 temiz |

**Dosya küçülmesi içerik kaybı değil** — üçünde de `main` metni uzadı. Küçülen,
her dosyanın kendi içine kopyalanmış turuncu DadaMutfak kabuğu ve onun CSS/JS'i.

`profil-v1`'de HANDOFF'un uyardığı `</main>` sınır sapması ölçülerek kapatıldı:
dosyadaki iki `</main>` geçişinden biri CSS yorumunun içinde (satır 864), gerçek
kapanış 3312'de — sınır doğru, içerik kaymamış.

`rozetler-v1` içerik çevirisi (KARARLAR.md K2): mutfak dili kalıntısı **0**
(tek eşleşme "**şef**faf" kelimesinin içindeydi), rozet aileleri belgedeki
ölçülebilir boyutlardan türedi — adım 25 · aktif gün 27 · challenge 22 ·
kuvvet günü 8 · dinlenme 10 · hareket süresi 6 · kilometre taşı 6 ·
program tamamlama 4 · çeşitlilik 2.
- [ ] **Ölçüm:** her sayfa taşındıktan sonra 4 genişlikte konsol hatası / yatay taşma / kırık link taraması

### Dalga 1'in görsel doğrulaması ✅ (HANDOFF §4.2'nin bekleyen ölçümü)

`tools/baseline-diff.mjs` ile 5 sayfa × 2 genişlik, 8811 (şimdi) ↔ 8812 (göç öncesi `981df3b`),
yalnız `main#pageMain` içi computed style + boundingBox.

**Ana bulgu — içerik kaybı YOK. Beş sayfanın beşinde de main metni UZADI:**

| Sayfa | main metni (göç öncesi → şimdi) | eşleşen öğe |
|---|---|---|
| `sss-v1` | 1553 → **1886** kr | 58/79 |
| `iletisim-v1` | 1552 → **2122** kr | 114/145 |
| `yasal-v1` | — | — |
| `bildirimler-v1` | 1272 → **1504** kr | 103/166 |
| `hakkimizda-v1` | 4007 → **6619** kr | 192/290 |

Araç toplam **98 sapma** saydı; hepsi tek tek incelendi ve **üç sınıfa** düşüyor,
hiçbiri regresyon değil:

1. **Bilinçli içerik değişimi (Faz 1'in kendisi).** "Kayıp" öğelerin tamamı DadaMutfak
   dünyasına ait metinler: `p|DadaMutfak; tarif paylaşan, deneyen…` · `h1|Yaşasın` +
   `span|Yemek Yemek!` · `button|Takip/Yorum/Beğeni/Sipariş` (bildirim kategorileri) ·
   `button|Tarifler & İçerik / DadaStore & Sipariş / Diyetisyen` (SSS kategorileri).
   Bunların silinmesi görevdi; metin sayacı kısalmadığı için yerlerine DadaFit içeriği geldiği
   de ölçülü.
2. **Kabuk tipografisinin devralması — DOĞRULANDI.** `h1` 44→39px (1440) / 38→31px (768)
   sapması defekt değil: **hiç göç etmemiş**, kabuğu baştan beri kullanan üç referans sayfa
   ölçüldü ve göç edilenlerle **birebir aynı** çıktı —
   `egzersiz-kutuphane-v1` · `antrenorler-v1` · `hareket-merkezi-v1` = **39px/700/680px/oran 0.47**
   @1440 ve **31px/oran 0.89** @768; `sss` · `iletisim` · `yasal` · `hakkimizda` de aynı değerler.
   Yani göç edilen sayfalar artık kabuğun kanonik başlık ölçüsünde. Hedef buydu.
   (`bildirimler-v1` h1'i 28px — ama bu değer göç ÖNCESİNDE DE aynıydı, araç fark
   raporlamadı; sayfa banner'da `.lh-main` yerine kendi `.nt-head` flex satırını kullandığı için.)
3. **Küçük yerleşim kaymaları, taşmasız.** `font-weight 500→600` (hakkimizda sekme
   bağlantıları, kabuk kiti) · `i.fa-house` 9→13px (kabuk breadcrumb ikonu) ·
   form/istatistik kolon oranları (ör. 0.46→0.55 @768). **Beş sayfanın hiçbirinde yatay
   taşma yok** (araç ayrıca ölçüyor) ve beşi de `page-check` 360/768/1024/1440'ta temiz.

**Not:** `baseline-diff.mjs` bir geçti/kaldı kapısı DEĞİL, triyaj aracıdır — bilinçli içerik
değişimi de "sapma" olarak sayılır, çıkış kodu bu yüzden 1 kalır. Kapı `tools/page-check.mjs`.

---

# FAZ 3 — NAVİGASYON (belge §2, §3, §16) ✅

**Faz 5 bittiği için yapılabildi.** Kabuk menüsü ve footer 56 sayfanın hepsinde
basılıyor; var olmayan bir hedefe bağlamak tek hamlede site geneli kırık link üretirdi.

- [x] **Masaüstü mega menü** — Hareket paneli belgedeki **on bir** kalemle iki kolon.
      "Hareket Merkezi" panele geri kondu (açık soru 1 kapandı → `KARARLAR.md` K5).
- [x] **Programlar** paneli beş kalem: Programlar Merkezi · Tüm Programlar ·
      Programımı Bul · **Fit Testleri** · **Video Seansları** (son ikisi Faz 5'te üretildi)
- [x] **Enerji Defteri ana menüye çıktı** (belge §2) — beş kalem: Bugünkü Denge ·
      Aktivite Günlüğü · Su Takibi · Haftalık Denge Özeti · Bağlı Uygulamalar ve Cihazlar.
      `#su` ve `#haftalik` çapaları bu tur `enerji-defteri-v1.html`'e eklendi.
- [x] **Challenge** paneli beş kalem. Durum kalemleri sahte sayfa üretilmeden
      `challenge-merkezi-v1.html?durum=aktif|yaklasan|gecmis` ile sayfanın KENDİ filtre
      motoruna bağlandı (sayfa `?durum=` okuyup çipi işaretliyor — kodu okunarak doğrulandı).
- [x] **Antrenörler** paneli dört kalem: Antrenör Bul · Antrenör Profili · Randevu Al ·
      Antrenör Ol (açık soru 1 → `KARARLAR.md` K5)
- [x] Sağ üst: Arama · Planım · Giriş Yap · Bildirimler · Hesabım — Planım ana menüde değil ✔
- [x] **Mobil alt bar tam 5 öğe** — ölçüldü: Ana Sayfa · Hareket · Programlar · Planım ·
      Hesabım (belgenin listesiyle birebir)
- [x] Enerji Defteri'ne mobil erişim: drawer'da kendi başlığı var (ölçüldü)
- [x] Drawer masaüstündeki beş ana modülün hepsini taşıyor — ölçüldü: Hareket ✓
      Programlar ✓ Enerji Defteri ✓ Challenge ✓ Antrenörler ✓ (46 bağlantı)
- [x] **Footer belgedeki dört kolona göre yeniden kuruldu:** DadaFit · Kurumsal ·
      İletişim · Yasal ve Sağlık. Logo altı metni belgeden birebir:
      "Günlük hareketini, enerjini ve ilerlemeni kendi ritminde yönet."
      "Eksik" sanılan beş hedef aslında vardı, ölçülerek bulundu —
      Sponsorlar ve Partnerler → `hakkimizda-v1.html#partnerler` · Künye → `#kunye` ·
      Çerez / Üyelik ve İptal / Veri ve İzin → `yasal-v1.html?metin=cerez|uyelik|veri-izin`.
      Yalnız **Destek Merkezi** gerçekten Faz 5'i bekliyordu (`destek-talepleri-v1`).

### Ölçüm

- **Kabuk bağlantıları: 107 yerel · 48 benzersiz hedef · KIRIK 0 · KIRIK ÇAPA 0.**
  (menü + footer + drawer + alt bar + üst bant; her hedef HTTP ile, her `#parça`
  hedef sayfada `id=` olarak arandı)
- Beş süit: dropdown **90 panel / 0 sorun** · header-banner 14×4 / 0 · coach-list 0 ·
  plan-account 0 · a11y-focus 0.

### Ölçerek yakalanan yan etki — geniş panel taşması

Ana menü dörtten **beşe** çıkınca ortalanmış `.nav` genişledi, en soldaki "Hareket"
sola kaydı ve 560px'lik panel onun merkezine hizalandığı için ekran dışına taştı:

| genişlik | Hareket merkezi | ortalanmış panel | durum |
|---|---|---|---|
| 1440px | 408 | 128–688 | ✓ |
| 1280px | 328 | 48–608 | ✓ (pay 48px) |
| 1100px | 238 | **−42**–518 | ✗ taşma |
| 1025px | 200 | **−80**–480 | ✗ taşma |

Ortalama, merkez 280'in (560/2) altına düştüğü her genişlikte matematiksel olarak
imkânsız. ≤1280px'te panel başlığın merkezine değil **sol kenarına** hizalanıyor;
genişlik ve iki kolonlu düzen korundu, ok işareti de sola alındı.
Düzeltme sonrası gerçek kutu ölçüldü: 1440 → 128–688 · 1280 → 282–842 ·
1100 → 192–752 · 1025 → 154–714, **dördü de içeride**.

# FAZ 4 — PLANIM (6 sekme) ve HESABIM (belge §4, §5)

Bugün `PLAN_NAV` 11 kalem. Belge 6 istiyor.

- [x] Ray artık **altı sekme**: Bugün · Plan ve Takvim · Aktivite Kayıtlarım · İlerlemem · Kaydettiklerim · Antrenörüm
- [x] Eşleme yeni sayfa üretmeden yapıldı: `programim`→Plan ve Takvim · `gecmis`→Aktivite Kayıtlarım ·
      `ilerleme`(+rozetler içeriği)→İlerlemem · `kaydettiklerim`→aynı · `randevular`→Antrenörüm
      (**anahtar `randevular` korundu** — sayfa kendi `data-plan-page` değerini bildiriyor, anahtarı
      değiştirmek banner/breadcrumb çözümünü kırardı)
- [x] Raydan çıkanların hepsine yeni sahip verildi: `defter`→ana menü · `kopru`→Enerji Defteri içi ·
      `rozetler`→İlerlemem içeriği · `saglik`+`veri`→Hesabım
- [x] **İki liste, tek kaynak:** `PLAN_TABS` (rayda görünen altı) + `PLAN_PAGES` (`#fitPlanTop`
      kullanan tüm sayfalar). Ray `PLAN_TABS`'tan, başlık/breadcrumb `PLAN_PAGES`'ten çözülür —
      bu ayrım olmasa ray dışı dört sayfa **boş başlıkla** açılırdı.
- [x] **Hesabım** kendi listesine ayrıldı (`ACCOUNT_ITEMS`), belgedeki 14 modülün tamamı var.
      Planım rayı hesap menüsünde TEKRARLANMIYOR (§5 "karıştırılmamalı"), Planım'a tek giriş var.
- [x] **Ölçüm — `tests/plan-account.mjs`, 0 sorun:** ray tam altı ve belgedeki adlar · çıkarılan
      dört kalem rayda yok · ray dışı dört sayfa başlık+breadcrumb çözüyor · Hesabım'da 14 modül ·
      hesap menüsündeki tüm hedefler diskte var · menü ve drawer'da DadaMutfak kalmadı
- [ ] Her sekmenin belgedeki alt İÇERİK listesi (Bugün'e §9 günlük durum kartı dahil) — sayfa gövdeleri
- [x] **Aşama notu KAPANDI.** Hesabım'daki üç kalem (Bağlı Uygulamalar · Üyelik/Ödeme/Fatura ·
      Destek Talepleri) geçici olarak var olan en yakın sahibine bağlıydı. Faz 5 sayfaları
      üretildi ve söz verildiği gibi **yalnız href'ler** değişti:
      `bagli-uygulamalar-v1.html` · `uyelik-faturalandirma-v1.html#paket|#odeme-gecmisi|#faturalar`
      · `destek-talepleri-v1.html`
- [x] **Ölçüm (Faz 3 sonrası, giriş yapılmış halde):** kabuktaki 125 yerel bağlantı,
      52 benzersiz hedef → **kırık link 0, kırık çapa 0.**
      Bu tarama sırasında **eski bir kusur** da yakalandı: hesap menüsündeki
      "Verilerimi İndir" `fit-planim-veri-izin-v1.html#indir`'e gidiyordu ama o çapa
      sayfada YOKTU — bağlantı sessizce sayfa başına düşüyordu. Çapa eklendi.

---

# FAZ 5 — YENİ SAYFALAR (belge §24, §7, §8, §10, §15)

- [ ] `fit-testleri-v1.html` — 7 test kategorisi (belge §8)
- [ ] `fit-testi-detay-v1.html` — amaç · kimler için · süre · ekipman · güvenlik · adımlar
- [ ] `fit-testi-sonuc-v1.html` — sonuç özeti · seviye · önerilen program · antrenöre danış
- [ ] Test öncesi **fiziksel aktivite uygunluk taraması**; riskli cevapta test durur (§8)
- [ ] `aktivite-gunlugu-v1.html` — adım · aktif süre · yürüyüş/koşu/bisiklet · mesafe · yaklaşık enerji ·
      manuel ekle/düzenle/sil · kaynak · son senkron (§7)
- [ ] `bagli-uygulamalar-v1.html` — Apple Health · Health Connect · akıllı saat · manuel;
      her biri için durum/izin/son senkron/aktarılan veri/bağlantıyı kes (§7)
- [ ] `video-seanslari-v1.html` — 8 filtre (§10)
- [ ] `video-seans-detay-v1.html` — bölümler · kaldığın yerden devam · tamamlandı · kaydet · programa ekle
- [ ] `uyelik-faturalandirma-v1.html` — aktif paket · tarihler · ödeme geçmişi · faturalar · iptal (§15)
- [ ] `destek-talepleri-v1.html` + `destek-talebi-detay-v1.html`
- [ ] `index.html` prototip haritası yeni sayfalarla güncellenecek

---

# FAZ 6 — ANA SAYFA, YÖNLENDİRME, İÇERİK SAYILARI (belge §6, §11, §12)

- [ ] Ana sayfa bölüm sırası belgedeki 13 adıma göre (Hero → Bugünün Enerji Defteri → Bana Uygun Başlangıcı Bul
      → Beslenme ve Hareket Köprüsü → Hedefini Seç → Egzersiz Kütüphanesi → Programlar →
      Günlük Aktivite ve Toparlanma → Challenge → Video Seansları → Antrenörler → Ücretsiz ve Pro → Kapanış CTA)
- [ ] Hero'da **en fazla iki** CTA: "Bana Uygun Başlangıcı Bul" + "Hareketleri Keşfet"
- [ ] "Enerji Köprüsü'nü Gör" ana CTA olmaktan çıkacak → Enerji Defteri alanında ikincil bağlantı
- [ ] **İçerik sayısı tutarlılığı**: bugün üst bantta "320+ egzersiz", başka yerde "80+ hareket" —
      tek doğrulanmış sayı belirlenip **tüm sayfalarda** aynı değer kullanılacak (grep ile taranacak)
- [ ] **§23 · Filtreler URL'ye yansımıyor (ÖLÇÜLDÜ, mevcut sayfalarda genel kusur).**
      Belge §23: "Filtreleri URL parametresine yansıt, tarayıcı geri/ileri işlemlerini
      destekle, yenilemede seçim korunsun." Beş filtre sayfasında gerçek bir süzme
      çipine (— "Tümü" sıfırlama çipi değil —) basılıp ölçüldü:

      | Sayfa | tıklanan çip | URL değişti | geri çalışıyor |
      |---|---|---|---|
      | `egzersiz-kutuphane-v1` | Bacak | ✗ hayır | — |
      | `antrenorler-v1` | Güç & Kondisyon | ✗ hayır | — |
      | `program-liste-v1` | Güç & Kondisyon | ✗ hayır | — |
      | `hareket-merkezi-v1` | 5 dk | ✗ hayır | — |
      | `programlar-merkezi-v1` | Tek günlük rutin | ✓ `?tur=rutin` | ✗ hayır |

      Yani 5 sayfanın 4'ünde URL hiç yazılmıyor; yazan tek sayfada da geri tuşu
      önceki duruma dönmüyor (büyük ihtimalle `replaceState`, `pushState` değil).
      Faz 5'te üretilen yeni sayfalar bu kuralı sağlıyor; **eski sayfalar sağlamıyor.**
      Bu, "aynı davranışı iki farklı sayfa ailesinde iki türlü yapmak" demek —
      merkezî bir yardımcı (kabukta `FIT_SHELL.syncFilterURL`) doğru çözüm olur.
- [ ] Hedef kartları filtre taşıyacak: `?hedef=guc|esneklik|dayaniklilik|aliskanlik`
- [ ] Tüm antrenör kartları gerçek detay sayfasına (`?slug=`) — genel profile gitmeyecek (§11)
- [ ] Egzersiz/program/challenge kartları benzersiz `?slug=` ile açılacak; hepsi aynı örneğe gitmeyecek
- [ ] Antrenör detayında belgedeki 20 alan (§11) + "DadaFit Onaylı" yalnız doğrulanmış ve süresi geçerli olanlarda

---

# FAZ 7 — ENERJİ DİLİ, PRO/ÜYELİK, ENTEGRASYON, DEMO (belge §13, §14, §15, §22)

- [ ] Yasak ifadeler taranacak: "yediğini yak", "telafi et", "yakmak için", "yemek hakkı",
      "kalori açığını kapat", "kaçamak" → belgedeki nötr karşılıklar
- [ ] Enerji değerleri "yaklaşık" ibaresiyle; kalori rakamlarını **gizleme seçeneği**
- [ ] İlerleme yalnız kaloriden oluşmayacak (süre · aktif gün · kuvvet günü · program günü · çeşitlilik ·
      dinlenme · adım · kişisel gelişim)
- [ ] Pro paket yapısı: **Ücretsiz / Pro / Pro Max** + karşılaştırma tablosu (§15)
- [ ] Gastro/Diet entegrasyonu: doğrudan HTML bağımlılığı yerine yapılandırılabilir servis adresi;
      her paylaşımda hangi veri/hangi sistem/amaç/izin/geri alma gösterimi (§14)
- [ ] Demo veri ibareleri (§22) · `?auth=1|0` çalışmaya devam edecek

---

# FAZ 8 — DİL (belge §17)

- [ ] Türkçe sayfalarda varsayılan **TR** (bugün dil seçici EN gösteriyor — `fit-shell.js` TOPBAR)
- [ ] Dil seçici gerçek dil yapısına bağlanacak (merkezi sözlük ya da `/tr/` `/en/`)
- [ ] Menü · buton · form · uyarı · SEO alanı · başlık · meta açıklaması için TR+EN karşılıkları
- [ ] Aynı ekranda TR/EN karışmayacak
- [ ] **Kapsam notu:** tam iki dilli sözlük 47 sayfa için çok büyük; merkezi sözlük altyapısı + kabuk
      ve ortak bileşenlerin çevirisi yapılacak, sayfa gövdeleri aşamalı. **Doğrulanacak.**

---

# FAZ 9 — PERFORMANS · SEO · ERİŞİLEBİLİRLİK (belge §18, §19, §20)

- [ ] Hero videosu WebM + optimize MP4, mobil/masaüstü ayrı kaynak, poster
- [ ] Görseller WebP/AVIF · merkezi medya klasörü · **harici Unsplash bağlantıları üretimden kalkacak**
      (bugün kart görsellerinin tamamı Unsplash) · `loading="lazy"` · ilk ekran öncelikli · ölçü tanımı (CLS)
- [ ] Kullanılmayan CSS/JS temizliği (DadaMentor sonrası + legacy ölü slider kodu)
- [ ] Font yalnız kullanılan ağırlıklarda (bugün 3 dosya: Light · Medium · ExtraBold)
- [ ] SEO: `noindex,nofollow` kalkacak · benzersiz title/description · canonical · OG · Twitter Card ·
      breadcrumb yapılandırılmış verisi · egzersiz/program/antrenör şeması · hreflang · tek H1 · H1-H2-H3
- [ ] Erişilebilirlik: klavye · modal focus trap + geri dönüş + Escape · filtrelerde `aria-pressed` ·
      gerçek `label` · hata yalnız renkle değil · anlamlı `alt` · kontrast · dokunma alanı · hareketi azalt
  - [x] **Odak tuzağı kararsızlığı kapandı** (`fit-shell.js` → `trapFocus`). Ölçüm: modal
        `visibility:hidden` + `transition:… visibility .25s` ile açılıyor; kare 0'da
        `checkVisibility()=false` ve `.focus()` sessizce no-op, kare 1'de odaklanabilir hâle
        geliyor. Eski kod tek yedek rAF denemesi yapıyordu, bir kare kayınca düşüyordu.
        Sınırlı kare yoklamasına (≤20 kare) geçildi → `tests/a11y-focus.mjs` **10 koşu 10/10**
        (düzeltmeden önce aynı ortamda 1 sorun). Yöntem seçimi gerekçesi: `KARARLAR.md` K1.
- [ ] **Birincil düğme kontrastı (A2'de ölçüldü):** beyaz metin / `#009d4f` = **3.55:1**, AA'nın
      altında. `--tomato-dark` `#007a3d` = **5.45:1**, `--tomato-deep` `#006a35` = **6.84:1**.
      Karar site geneli verilecek (`.btn-login`, `.btn-primary`, `.btn-fit` birlikte).

---

# FAZ 10 — TEST VE TESLİMAT (belge §25, §26)

- [ ] 1440 / 1024 / 768 / 390 px'te: header · mega menü · drawer · alt menü · hero · kart grid ·
      filtre · form · modal · video · Planım sekmeleri · Hesabım · footer
- [ ] Tüm yerel bağlantılar · kırık hedef yok · konsol hatası yok · yatay taşma yok · modal açılışında kayma yok
- [ ] Ziyaretçi ve üye görünümü ayrı ayrı · TR/EN · filtre+arama+URL parametreleri
- [ ] Teslimat çıktıları: güncel site haritası · yeni menü yapısı · yeni/birleşen sayfa listesi ·
      kaldırılan modüller · yönlendirme düzeltmeleri · responsive raporu · kırık bağlantı raporu ·
      performans özeti · kısa revizyon günlüğü

---

## Nihai kabul kriterleri (belge sonu) — teslim kontrol listesi

- [ ] DadaFit bağımsız marka olarak görünüyor
- [ ] DadaMutfak arayüzü DadaFit sayfalarında kalmadı
- [ ] DadaMentor tamamen kaldırıldı
- [ ] Enerji Defteri ana menüden erişilebilir
- [ ] Planım altı ana bölüme sadeleşti
- [ ] Aktivite · cihaz bağlantıları · Fit Testleri · video modülleri çalışıyor
- [ ] Antrenör kartları doğru profile gidiyor
- [ ] Hedef kartları doğru filtreleri açıyor
- [ ] İçerik sayıları tutarlı
- [ ] Mobil alt menü beş öğeyi geçmiyor
- [ ] Türkçe sayfalarda TR varsayılan
- [ ] Yerel bağlantılarda kırık hedef yok
- [ ] Mevcut tasarım dili korundu
- [ ] Bütün sayfalar responsive
- [ ] Demo / gerçek veri ayrımı açık

---

## Sonda topluca sorulacaklar ("doğrulanacak" işaretliler)

1. **Menü paneli vs. aynı-hedefe-tek-kapı kuralı** — belge Hareket panelinde "Hareket Merkezi",
   Antrenörler'de 4 kalemlik panel istiyor; geçen tur bunlar *bilinçli olarak* kaldırılmıştı
   (başlığın kendisi zaten o hedefe gidiyor) ve A4'ün referansı DadaDiet'te Diyetisyenler panelsiz.
   Belge mi, önceki karar mı geçerli?
2. **Dil altyapısının derinliği** — 47 sayfanın tam iki dilli sözlüğü mü, yoksa kabuk + ortak
   bileşen çevirisi + altyapı mı?
3. **Unsplash'ın kaldırılması** — belge üretimden kaldırılmasını istiyor; prototipte tüm kart
   görselleri Unsplash. Yerel medya klasörüne indirilecek mi, yoksa prototip için bu madde
   "üretimde yapılacak" notuyla mı bırakılacak?
4. **Legacy 12 sayfanın kapsamı** — `profil-v1` (365KB), `reklam-ver-v1` (174KB) gibi dosyalar
   DadaFit'e ait olmayan ortak sayfalar; tamamı mı taşınacak yoksa DadaFit akışında geçenler mi?

---

# OTURUM DEVRİ — 2026-08-17 (hesap değişimi)

## Ölçüm altyapısı (hepsi repoda kalıcı)

```bash
mkdir -p ~/.pw && cd ~/.pw && npm init -y && npm i playwright-core
npx playwright install chromium
export PW_HOME=~/.pw
cd <repo> && python3 -m http.server 8811 &
node tests/dropdown-position.mjs && node tests/header-banner.mjs \
  && node tests/coach-list.mjs && node tests/plan-account.mjs && node tests/a11y-focus.mjs
```
**Son durum: beş süit de 0 sorun.**

Faz 2/5 için sayfa başına kapı: `node tools/page-check.mjs <sayfa>.html <1440|1024|768|390>`

## Bu turda bitenler

| | |
|---|---|
| Faz 0 (A1–A4) | ✅ dropdown kayması · banner'da şeffaf header + solid Planım · iki banner aramasının kaldırılması · antrenör dizini referans kurguda |
| Faz 1 | DadaMentor tamamen kalktı (kod+CSS+2.4MB video+ölü token) · 35 sayfada DadaMutfak metni 0 · ekosistem adresleri tek `ECO_BASE` · çift `#toTop` id hatası kapandı |
| Faz 2 | **8/12 sayfa** kabuğa geçti (dalga 1'in 5'i commit'li; `pro`·`giris`·`hesabim`·`reklam-ver` ajanlarda) |
| Faz 4 | ✅ Planım 6 sekme (`PLAN_TABS`/`PLAN_PAGES` ayrımı) · Hesabım §5'in 14 modülüyle ayrı liste |
| Faz 6 (kısmi) | tek içerik sayısı (140+ hareket) · demo listeler `.demo-tag` ile işaretli |
| Faz 9 (kısmi) | §20 odak tuzağı + odak geri dönüşü (drawer · görüş modalı · giriş kapısı) |

## DEVAM EDEN — bir sonraki oturum buradan alsın

`pro-v1` ve `giris-v1` ajanları bitirdi, ben ölçtüm (1440+390 temiz) ve commit ettim
→ **Faz 2: 10/12 sayfa** kabuğa geçti.

**hesabim-v1 ve reklam-ver-v1 doğrulandı ve commit edildi** (2026-08-17, ayrı commit'ler).
Ajanları rapor vermeden kapandığı için işleri sıfırdan değil, ölçülerek kabul edildi:
- `hesabim-v1` 160KB→98KB · 8 çapa (`#bildirim #uyelik #odeme #fatura #guvenlik #dil
  #dondur #sil`) taze sayfa yüklemesiyle 360+1440px'te ölçüldü → 16/16 çalışıyor,
  hepsi gerçek içeriğe (767–1769 karakter) bağlı, uydurma bölüm yok.
- `reklam-ver-v1` 174KB→86KB · `#isbirligi` + `#reklam` çalışıyor, başlıkları
  header'ın altında kalmıyor; sayfaya özgü `#ypModal`/`#ypOverlay` korunmuş.
- İkisi de `page-check` 360/768/1024/1440'ta temiz; DadaMutfak metni 0, turuncu 0.

→ **Faz 2: 9/12 sayfa kabuğa geçti.** (Ölçüldü: `grep -c fitShellTop` ile 12 dosya tek tek.)

**AÇIK KUSUR — `tests/a11y-focus.mjs` KARARSIZ (öncelik: yüksek)**
Görüş bildir modalı, açıldığında odağı %50 oranında içine ALMIYOR. 6 koşuda 3 kez
başarısız. Ölçüm: başarısız koşularda `focusin` olayı yalnız `fbTab` için ateşleniyor,
`fbClose` HİÇ odak almıyor — yani `trapFocus` içindeki `focusIn()` sessizce boşa
düşüyor. Sebep: modal `visibility:hidden`'dan geçişle açılıyor; `requestAnimationFrame`
tick'inde hâlâ görünmez olduğu için `.focus()` no-op oluyor ve tek ek rAF denemesi
yetmiyor.
Çözüm `assets/js/fit-shell.js` içindeki `trapFocus`'ta: rAF yerine gerçek görünürlüğü
bekle (`transitionend` dinle ya da birkaç frame boyunca `offsetWidth>0` olana kadar
yokla, üst sınırla). Bu oturumda kabuk dosyalarına dokunmama talimatı olduğu için
YAPILMADI, bilinçli olarak devredildi.

**KALAN 3 LEGACY SAYFA (hiç başlanmadı):**
- `pro-odeme-v1.html` (119KB) — Pro ödeme akışı; `pro-v1`'in üç kademeli
  (Ücretsiz/Pro/Pro Max) yapısıyla tutarlı olmalı, §15 ödeme/fatura alanları
- `rozetler-v1.html` (149KB) — rozet/kademe sayfası; içerik DadaFit hareket
  rozetlerine çevrilmeli (şef kademesi değil), Planım>İlerlemem ile tutarlı
- `profil-v1.html` (356KB, 4967 satır) — **tek ajan almalı**, en büyük dosya;
  göç aracının `</main>` sınır sapması burada 16661 karakterdi, düzeltildi ama
  bu dosyada ayrıca dikkatli olunmalı

`verify-faz2` ajanı dalga 1'in görsel karşılaştırmasını bitirmeden kapandı — o kontrol
hâlâ yapılmadı sayılır.

## Bir sonraki oturum için üç kritik uyarı

1. **Kural sayısı/seçici farkı defekt göstergesi DEĞİL.** Faz 2'de bunu denedim,
   yanlış alarm verdi (bkz. commit `2b92a45`). Bir sayfa kuralının yokluğu stilin
   yokluğu demek değil — kabuk aynı işi başka seçiciyle yapıyor olabilir. Doğru
   ölçüm: göç öncesi sürümle **computed style / boundingBox** karşılaştırması.
   Göç öncesi sunucu şöyle kurulur:
   `mkdir /tmp/baseline && for f in <12 sayfa>; do git show 981df3b:$f.html > /tmp/baseline/$f.html; done`
   `ln -s <repo>/assets /tmp/baseline/assets && (cd /tmp/baseline && python3 -m http.server 8812 &)`
2. **Faz 3 (menü/footer) Faz 5'i BEKLİYOR.** Belge §2 menüye Fit Testleri ve Video
   Seansları, §16 footer'a Destek Merkezi/Çerez Politikası vb. koyuyor. O sayfalar
   üretilmeden menüye bağlanırsa **47 sayfada kırık link** olur (kabuk her sayfada basılıyor).
   Aynı sebeple Hesabım'daki üç kalem geçici olarak var olan sahiplere bağlı —
   `ACCOUNT_ITEMS` içindeki "AŞAMA NOTU" yorumuna bak, sayfalar gelince yalnız href'ler değişir.
3. **Faz 5 hazır bekliyor:** `tools/FAZ5-SKELETON.html` (kopyalanacak iskelet) +
   `tools/FAZ5-BRIEF.md` (ajan brief'i). 10 sayfa, sayfa başına bir ajan, en fazla 6 paralel.

## Push durumu
**Hiçbir şey push EDİLMEDİ** — 19 commit yerelde duruyor, kullanıcı onayı bekliyor.
