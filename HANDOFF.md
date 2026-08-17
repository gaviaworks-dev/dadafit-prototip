# DadaFit prototip — devir notu

Bu dosya, yeni bir oturumun repoyu sıfırdan okumadan bağlam kurabilmesi için yazıldı.
Son çalışma turu: **REVIZE-PLAN.md**'deki 11 maddelik arayüz revizyonu (tamamlandı, canlıda doğrulandı).

**Ne bu repo:** arka ucu olmayan, statik HTML/CSS/JS bir arayüz prototipi.
**Canlı:** <https://gaviaworks-dev.github.io/dadafit-prototip/> (GitHub Pages, `main` → legacy build)
**Kardeş ürün / tasarım referansı:** <https://dadadiet.com> — DadaFit onun kardeş ürünü; header davranışı
ve liste sayfası kurgusu bilinçli olarak aynı mantıkta. Bir karar tartışmalıysa önce oraya bak;
o site aynı kabuk ailesinden (`.header`, `.nav-item`, `.dropdown`, `.head-actions`, `.lst-*`) türüyor.

---

## 1 · Mimarî harita

Üç dosya sitenin tamamını yönetir. Sayfa dosyalarına kabuk markup'ı **kopyalanmaz**.

| Dosya | Satır | Ne yapar |
|---|---|---|
| `assets/js/fit-shell.js` | ~2110 | Menü veri yapıları + tüm kabuk markup'ının üretimi + tüm kabuk davranışı |
| `assets/css/fit-shell.css` | ~2053 | Token'lar, kabuk, kanonik kart/çip/banner kitleri, `.ff` filtre bileşeni, responsive |
| `assets/css/fit-type.css` | ~178 | Metin yaslama katmanı (justify + tireleme). **47 sayfanın tamamına** link'li |

### Sayfa sözleşmesi

Bir DadaFit sayfası yalnızca şunu yazar:

```html
<body data-brand="fit" data-fit-page="<anahtar>">
  <div id="fitShellTop"></div>        <!-- üst bant + header + drawer + alt bar + görüş + çerez -->
  <main class="page-main" id="pageMain"> … sayfa içeriği … </main>
  <div id="fitShellBottom"></div>     <!-- giriş kapısı + footer + DadaMentor + başa dön -->
  <script src="assets/js/fit-shell.js"></script>
</body>
```

`fit-shell.js` bu iki `<div>`'i `outerHTML` ile değiştirir (`fit-shell.js:596` ve `:602`).
`data-fit-page` verilmezse dosya adından çözülür (`FILE` / `PAGE` değişkenleri).

Üçüncü bir mount noktası var: **`<div id="fitPlanTop" data-plan-page="…" data-plan-title="…" data-plan-sub="…">`**
(`fit-shell.js:609`). Bunu yazan sayfa, `PLAN_NAV`'dan üretilen banner + breadcrumb + sekme rayını alır.
10 sayfa kullanır (aşağıda "Planım modülü").

### Menü veri yapıları — hepsi `fit-shell.js` başında

| Dizi | Satır | Besler |
|---|---|---|
| `NAV` | 37 | Masaüstü ana menü (`navHtml()`), mobil drawer (`drawerNavHtml()`) |
| `BOTTOM` | 89 | Mobil alt bar (`bottomNavHtml()`) — **beşten fazla sabit öğe olamaz** |
| `FOOTER_COLS` | 98 | Footer link kolonları (`footerColsHtml()`) |
| `PLAN_NAV` | 130 | Planım sekme rayı + drawer'daki Planım bölümü + `ACCOUNT` |
| `ACCOUNT` | 153 | Hesap dropdown'ı — **`PLAN_NAV`'dan türetilir**, elle yazılmaz |

Markup üreticileri: `navHtml()` 188 · `drawerNavHtml()` 205 · `accountHtml()` 279 ·
`headerHtml()` 287 · `drawerHtml()` 322 · `footerHtml()` 589.

### `NAV` şeması

```js
{
  key:   'hareket',                      // benzersiz anahtar
  label: 'Hareket',                      // menüde görünen ad
  href:  'hareket-merkezi-v1.html',      // BAŞLIĞIN KENDİ HEDEFİ (gerçek bağlantı)
  icon:  'fa-solid fa-person-running',   // drawer + alt bar ikonu
  wide:  true,                           // opsiyonel → panel iki kolona akar (.dd-wide)
  match: ['hareket-merkezi-v1', …],      // aktif-sayfa eşleşmesi (data-fit-page değerleri)
  dd: [                                  // opsiyonel. YOKSA chevron'suz DÜZ LİNK olur.
    {label:'…', desc:'…', href:'…', icon:'…'},
    {group:'Rehber konuları'},           // panel içi grup başlığı (tam satır)
    {label:'…', href:'#', icon:'…', wizard:true}   // data-fit-wizard basar, sihirbazı açar
  ]
}
```

Bugünkü menü: **Hareket ▾ · Programlar ▾ · Challenge · Antrenörler** + `.head-actions` içinde **Planım** butonu.
Challenge ve Antrenörler `dd` taşımaz → düz link, chevron yok.

### Menü kuralları (bunlara uyulmazsa geri adım atılmış olur)

1. **Bir hedefe yalnız bir kalem gider.** Aynı sayfaya farklı adla ikinci kapı açılmaz.
   Bu yüzden panellerde "Hareket Merkezi" / "Programlar Merkezi" kalemi **yok** — başlığın kendisi oraya gidiyor.
   Aynı nedenle drawer'ın Planım alt listesi `PLAN_NAV.slice(1)` ile üretilir (kök "Bugün" atlanır).
2. **Panel hover ile açılır, başlık tıklanınca kendi merkezine gider.** Dokunmatikte ilk dokunuş açar,
   ikinci dokunuş bağlantıyı izler (`hover:hover and pointer:fine` sorgusu ile ayrılır).
3. **Drawer satırı gerçek bağlantıdır**, chevron ayrı bir `.d-toggle` düğmesidir
   (`<div class="d-row"><a class="d-link">…</a><button class="d-toggle">▾</button></div>`).
4. `ACCOUNT`'a kalem eklemek = `PLAN_NAV`'a tek satır. İki listeyi ayrı ayrı düzenleme.

---

## 2 · Legacy sayfalar (kendi satır içi DadaMutfak kabuğunu taşır)

Bu **12 sayfa** `fit-shell.css`/`fit-shell.js` yüklemez. Kendi `<style>` ve `<script>` blokları içinde
eski DadaMutfak (turuncu, `--tomato:#E14827`) kabuğunun tam kopyasını taşırlar:

```
bildirimler-v1 · giris-v1 · hakkimizda-v1 · hesabim-v1 · iletisim-v1 · pro-odeme-v1
pro-v1 · profil-v1 · reklam-ver-v1 · rozetler-v1 · sss-v1 · yasal-v1
```

Nasıl ayrışırlar:

- **Marka**: turuncu DadaMutfak kimliği, DadaFit yeşili (`#009d4f`) değil. Bunlar DadaFit'e ait değil;
  DadaFit'in *bağlandığı* ortak sayfalar.
- **Kabuk**: header/nav/footer markup'ı dosyanın içine gömülü. `NAV` dizisini değiştirmek bunları etkilemez —
  menüleri elle güncellenmelidir.
- **Ölü kod taşırlar**: `.row-track`/`.row-nav` slider CSS'i ve JS'i bu dosyalarda tanımlı ama
  hiçbirinde gerçek slider markup'ı yok (eski kabuktan miras).
- **Tek ortak nokta**: `fit-type.css` bunlara da link'li (justify site geneli).

**Bu sayfalara kabuk değişikliği uygularken:** `fit-shell.js`'i düzenlemek yetmez.
Ya dosyaları tek tek düzenle, ya da önce `fit-shell` kabuğuna taşı (büyük iş, ayrı karar).

---

## 3 · `.ff` — ortak filtre bileşeni

`fit-shell.css:1796` (stiller) + `fit-shell.js:1806` (motor).

Altı sayfa filtreyi "her facet bir satır" olarak diziyordu (4–5 sıra alt alta) ve ≤640px'te satırlar
yatay kaydırma rayına dönüşüp seçenekleri gizliyordu. `.ff` bunu kompakt tek satır bara çevirir:
facet başına popover + seçim sayacı, kaldırılabilir aktif çipler, toplam sayaç + sıfırla,
sonuç sayısı ve sıralama aynı satırda, sticky bar, ≤900px'te alttan "Filtrele" çekmecesi.

### Sayfa sözleşmesi — tek satır

```html
<div class="lib-filters ff" id="libFilters"
     data-ff
     data-ff-count=".lib-count"      <!-- var olan sayaç bloğu → sonuç satırına TAŞINIR -->
     data-ff-sort=".lib-sort"        <!-- var olan sıralama bloğu → sonuç satırına TAŞINIR -->
     data-ff-clear="#fClear">        <!-- var olan sıfırla düğmesi → programatik .click() -->
  <div class="fgroup" data-group="hedef" aria-label="Hedef filtresi">
    <span class="lbl">Hedef</span>
    <button class="df-fchip on" data-val="all">Tümü</button>
    <button class="df-fchip" data-val="guc">Güç</button>
  </div>
  …
</div>
```

### En kritik kural — `.fgroup` silinmez, TAŞINIR

Bileşen filtrelemeyi **yeniden yazmaz**; her sayfanın kendi filtre motoru olduğu gibi çalışır.
Bu, DOM'u göründüğünden fazla kısıtlar, çünkü sayfa motorları çipleri değil **önce grup kutusunu** çözer:

```js
filters.querySelectorAll('.fgroup')                          // dinleyicileri bağlamak için
filters.querySelector('.fgroup[data-group="hedef"]')          // "Tümü" çipini açıp kapatmak için
```

Bu yüzden:

- `.fgroup` **komple popover gövdesine taşınır** (`pop.appendChild(g)`), içi boşaltılmaz, silinmez.
- `.df-fchip` düğümleri **klonlanmaz** — aynı düğümler taşınır, listener'ları düşmez.
- Mobil çekmece `document.body`'ye değil **panelin içine** basılır; böylece çekmece açıkken bile
  `.fgroup` panelin torunu kalır ve kapsam sorguları çalışır.
- Bileşen çip tıklamalarını *dinler ama müdahale etmez*; `setTimeout(sync,0)` ile sayfa motoru
  işini bitirdikten **sonra** durumu okur.

`.lbl` popover başlığına taşındığı için gruptan kaldırılır. Grup içinde sıkışmış `.fclear` düğmesi
önce panele çıkarılır (sayfa onu hâlâ `id` ile bulur), sonra gizlenir.

### Kullanan 6 sayfa

`program-liste-v1` (4 facet) · `programlar-merkezi-v1` (5) · `egzersiz-kutuphane-v1` (3) ·
`antrenorler-v1` (3) · `challenge-merkezi-v1` (3) · `hareket-merkezi-v1` (3)

`hareket-merkezi-v1`'de **iki** `.hm-panel` var; yalnız `data-group` taşıyan ilki `data-ff` alır.
`antrenorler-v1`'de banner altındaki "Sana uygun antrenörü bul" `.fp-card` bloğunun da `.fgroup`'ları
vardır — o bilinçli olarak bileşene bağlanmaz.

### Tuzak: `backdrop-filter` popover'ı kırpar

Sayfaların eski `.lib-filters`/`.pm-panel` kuralları `backdrop-filter` taşıyordu. Chromium'da
`backdrop-filter` bir "backdrop root" kurar ve **alt öğeleri kendi border-box'ına kırpar** — popover'ın
alt kısmı z-index 999'da bile boyanmıyordu. `.ff` override'ı bu yüzden `backdrop-filter:none` yazar
(`fit-shell.css`, "ESKİ PANEL KABUKLARI BİLEŞENE DEVREDİLDİ" bloğu). Yeni `.ff-bar` da bilerek opak;
cam efekti tekrarlanmadı.

---

## 4 · Kaydırma kilidi ve overflow kararı

### Sorun neydi

"Dropdown açıp bir sekmeye tıklayınca sayfa sağa kayıyor." İki ayrı kök neden:

1. `html,body{overflow-x:hidden}` — `overflow-x:hidden` kökü **yatay kaydırma konteynerine** çevirir.
   Kırpılmış bir öğe içindeki bağlantı odak alınca tarayıcı onu görünür kılmak için sayfayı yana kaydırır.
   Ayrıca içindeki `position:sticky` öğelerin yapışmasını bozar.
2. Altı ayrı yer doğrudan `document.body.style.overflow='hidden'` yazıyordu (drawer, görüş modalı,
   giriş kapısı, pro kapısı, sihirbaz, sayfa scriptleri). Dikey kaydırma çubuğu kaybolunca
   `clientWidth` ~15px büyüyor, ortalanmış `.wrap` yeniden konumlanıyor → tüm sayfa sıçrıyor.

### Çözüm

`fit-shell.css:543`:

```css
html{overflow-x:clip;scrollbar-gutter:stable}
body{overflow-x:clip}
body.scroll-locked{overflow:hidden}
@supports not (overflow-x:clip){ html,body{overflow-x:hidden} }   /* eski tarayıcı */
```

- `overflow-x:clip` kırpar ama **kaydırma konteyneri yaratmaz** → hiçbir odak/anchor sayfayı yana kaydıramaz.
  (`clip` ↔ `visible` eşleşmesi spesifikasyonda serbesttir; dikey kaydırma normal kalır.)
- `scrollbar-gutter:stable` oluğu **her zaman** rezerve eder → gövde kilitlense de genişlik değişmez.

`fit-shell.js:675`:

```js
var _lockCount = 0, _lockPad = '';
function lockScroll(){ … }     // SAYAÇLI: N kez kilitlenip N kez açılmadan serbest kalmaz
function unlockScroll(){ … }   // 0'da no-op
window.FIT_SHELL.lockScroll / .unlockScroll
```

`scrollbar-gutter` desteklemeyen tarayıcı için `padding-right` telafisi de var (yalnız gerekirse).

**Kural:** yeni bir modal/çekmece yazarken `body.style.overflow`'a **asla** dokunma; `FIT_SHELL.lockScroll()`
/ `unlockScroll()` çağır. Ve `open()`/`close()` fonksiyonlarını **durum korumalı** yaz
(`if(el.classList.contains('show'))return;`) — kapalıyken çağrılan bir `close()` başka bir katmanın
kilidini düşürmemeli. Tüm mevcut katmanlar böyle yazıldı.

---

## 5 · `fit-type.css` — yaslama katmanı

### Yükleme sırası kuralı (bozulursa yaslama kaybolur)

`fit-type.css` **her sayfada `</head>`'ten hemen önce**, yani sayfanın kendi `<style>` bloklarından
**SONRA** link'lenir. Sebep: sayfa içi `text-align` kuralları (ve eski
`.wrap p,.fp-card p,.hr-note p{text-align:left}` mirası) yaslamayı geri almasın diye.
`fit-shell.css`'in hemen ardına koymak **yetmez** — sayfa `<style>`'ları ondan sonra gelir ve kazanır.

Yeni sayfa eklerken bu satırı `</head>` öncesine koy:

```html
<link rel="stylesheet" href="assets/css/fit-type.css" />
```

### Kapsam

- **Girer:** paragraflar, açıklama blokları, kart açıklamaları, madde metinleri, akordeon gövdeleri, notlar.
- **Girmez:** başlıklar, buton/etiket/çip/rozet/sekme metinleri, tablolar, sayısal alanlar, breadcrumb,
  form kontrolleri, ortalanmış kompozisyonlar (boş durum, modal, footer alt bandı).

Yaslama daima `hyphens:auto` ile birlikte gelir; tireleme olmadan ~340px'lik kart gövdesinde
kelime araları açılıp "nehir" üretir. `hyphenate-limit-chars:6 3 3` Türkçede bir-iki harften bölmeyi engeller.
Başlıklar `text-wrap:balance` alır ve tirelenmez.

### Dar kutu istisnası — container query

Kart gövdeleri (`.hub-body`, `.pr-body`, `.ex-body`, `.coach-body`, `.fs-card`, `.brg-card`, `.fp-card`)
`container-type:inline-size` bildirir; kutu **20rem'in altına** inerse o kutudaki `p`/`li` sola yaslıya döner:

```css
@supports (container-type:inline-size){
  @container (max-width: 20rem){ p, li{ text-align:left; } }
}
@supports not (container-type:inline-size){        /* fallback */
  @media (max-width:640px){ .hub-body p, … { text-align:left; } }
}
```

Ölçü notu: 1240px `.wrap`'te 3 kolonlu kart gövdesi ≈ 340px = 21.25rem → eşiğin **üstünde** kalır,
yani kartlar yaslı. Eşiği 22rem'e çekersen kart açıklamaları sola döner — bu bilinçli bir denge,
istek "kart açıklamaları da justify olsun" yönündeydi.

Erişilebilirlik çıkışı: `html.reduce-motion` (kabuktaki "Hareketi azalt" tercihi) yaslamayı da kapatır.

---

## 6 · Sayfa envanteri — 47 dosya

### DadaFit modülleri (35 sayfa, ortak kabuk)

| Modül | Sayfalar |
|---|---|
| Giriş | `index.html` (link dizini — gerçek sayfa değil, prototip haritası), `dadafit-hub-v1` |
| Hareket | `hareket-merkezi-v1`, `egzersiz-kutuphane-v1`, `egzersiz-detay-v1`, `hareket-rehberi-v1`, `hareket-yeni-baslayanlar-v1`, `hareket-dogru-form-v1`, `hareket-sureye-gore-v1`, `hareket-hedefe-gore-v1`, `hareket-bolgeye-gore-v1`, `hareket-masa-basi-v1`, `hareket-isinma-soguma-v1`, `hareket-sozluk-v1` |
| Programlar | `programlar-merkezi-v1`, `program-liste-v1`, `program-detay-v1` |
| Challenge | `challenge-merkezi-v1`, `challenge-v1` |
| Planım (`#fitPlanTop` kullanan 10 sayfa) | `fit-planim-v1`, `enerji-defteri-v1`, `fit-planim-programim-v1`, `fit-planim-gecmis-v1`, `fit-planim-ilerleme-v1`, `fit-planim-rozetler-v1`, `fit-planim-kaydettiklerim-v1`, `fit-planim-randevular-v1`, `fit-planim-saglik-profil-v1`, `fit-planim-veri-izin-v1` |
| Planım (rayın 11. kalemi, kendi hero'su var) | `dadafit-kopru-v1` (Enerji Köprüsü) |
| Antrenörler | `antrenorler-v1`, `antrenor-detay-v1`, `antrenor-ol-v1` |
| Diğer | `arama-fit-v1`, `saglik-bilgilendirme-v1` |

### Legacy / ortak (12 sayfa) — §2'deki liste

### Menüde görünmeyen sayfalar (kasıtlı)

Bunlar `NAV`/`ACCOUNT`/`BOTTOM`/`FOOTER_COLS`'ta yok; içerikten ya da akıştan girilir:

```
egzersiz-detay-v1     → kütüphane kartından (?slug=…)
program-detay-v1      → program kartından (?slug=…)
challenge-v1          → challenge kartından (?slug=…)
antrenor-detay-v1     → antrenör kartından (?slug=…)
antrenor-ol-v1        → antrenorler-v1 banner CTA'sı ve sayfa sonu paneli
arama-fit-v1          → header'daki arama ikonu (onclick)
pro-odeme-v1          → pro-v1'den
profil-v1, rozetler-v1→ legacy taraftan
index.html            → prototip link dizini
```

### Demo/durum parametreleri (her sayfada çalışır)

`?auth=1` üye görünümü · `?auth=0` çıkış · `?role=antrenor|diyetisyen|isletme` ·
`?dd=1` menü açık · `?drawer=1` · `?cc=1` çerez · `?fb=1` görüş modalı · `?lg=1` giriş kapısı ·
`?wizard=1` sihirbaz · `?hdr=solid` header'ı katı zorla · `?pg=1` pro kapısı (egzersiz-detay).

Durum saklama: `localStorage` — `dm_user` (auth/rol), `dm_fit` (program/challenge/bugün),
`dm_fit_ex` (egzersiz detayında set geçmişi), `dm-cookie-consent`, `dm_fit_sound|vibe|motion`.

---

## 7 · Playwright doğrulama script'leri

**Repoda tutulmuyorlar** (oturuma özel scratchpad'deydiler). Mantıkları burada; yeniden kurmak 2 dakika.

### Kurulum

```bash
mkdir -p /tmp/dfqa && cd /tmp/dfqa
npm init -y && npm i playwright-core && npx playwright install chromium
# repo kökünde:
python3 -m http.server 8811 &        # http://localhost:8811/
```

Not: `file://` ile test etme — `localStorage` ve göreli yollar farklı davranır.
Her context'te `addInitScript` ile `localStorage.setItem('dm-cookie-consent','accepted')` yaz,
yoksa çerez bandı ekranın ortasını kaplayıp ekran görüntülerini bozar.

### `qa.mjs` — taşma + hata taraması (ana kalite kapısı)

Tüm `*.html`'i sırayla açar, her genişlik için:

- `pageerror` ve `console.error` dinler,
- `document.documentElement.scrollWidth > clientWidth` kontrolü,
- `main *, footer *` içindeki her öğenin `getBoundingClientRect().right > clientWidth+2` olup olmadığı.

**Kritik incelik:** `position:fixed`, `display:none`, `visibility:hidden` ve **yatay kaydırma konteyneri
içindeki** öğeler taşma sayılmaz. Sonuncusu olmadan `.pf-tabs`, `.row-track`, `.ff-pop` gibi tasarım gereği
kayan raylar yanlış alarm üretir. Ata zinciri şöyle yürünür:

```js
let sc=el.parentElement, inScroller=false;
while(sc && sc!==document.body){
  const s=getComputedStyle(sc);
  if((s.overflowX==='auto'||s.overflowX==='scroll') && sc.scrollWidth>sc.clientWidth+1){ inScroller=true; break; }
  sc=sc.parentElement;
}
```

Çalıştırma: `node qa.mjs 1440` … `1280 · 1024 · 768 · 390`. Beklenen çıktı: `47 sayfa, 0 sorunlu`.
(47 sayfa × 5 genişlik ~2 dakikayı aşar; genişlikleri ayrı komutlarda çalıştır.)

### `links.mjs` — bağlantı denetimi

1. Kabuktan tüm nav bölgelerini toplar: `.nav .nav-item > a`, `.dropdown a`, `.head-actions a`,
   `.acct-menu > a`, `.drawer-nav .d-link[href]`, `.d-sub a`, `.drawer-foot a`, `.bottom-nav a`, `.foot-col a`.
2. Hedef dosya diskte var mı → **kırık link**.
3. Hedefleri sayfa bazında gruplar (hash/query atılır) → **aynı sayfaya giden farklı isimli link**.
4. Sonra 47 sayfayı tek tek gezip tüm `a[href]`'leri aynı şekilde doğrular.

**Yorumlama:** aynı etiketin iki bölgede çıkması (masaüstü paneli + mobil drawer) yanlış alarmdır;
panel sürümü `desc` metnini de içerdiği için metin farklı görünür. Gerçek ihlal, **farklı adların**
aynı sayfaya gitmesidir. Bilerek bırakılan iki istisna: `hakkimizda-v1` vs `hakkimizda-v1#kunye`,
ve `yasal-v1?metin=kullanim` vs `?metin=kvkk` (ayrı belgeler).

### `live.mjs` — canlı (GitHub Pages) doğrulama

Aynı kontroller + `response` dinleyicisiyle **400+ dönen her alt kaynak** yakalanır (404 avı).
Push sonrası önce build'i bekle:

```bash
gh run list --limit 1        # "pages build and deployment" completed/success olana kadar
curl -s https://gaviaworks-dev.github.io/dadafit-prototip/assets/js/fit-shell.js | grep -c btn-plan
```

İkinci komut 0 dönüyorsa CDN hâlâ eski derlemeyi veriyordur; bekle.

### Görsel/etkileşim script'leri

`shot3.mjs` (tam sayfa ya da `clip` ile kırpılmış ekran görüntüsü; `reveal` animasyonlarını tetiklemek
için önce sayfayı adım adım kaydırır), `fftest.mjs` (filtre: seç → sayaç düştü mü, çip çıktı mı,
çip kaldırma, sıfırla), `ed.mjs` (set takibi: set işaretle → dinlenme açıldı mı, bitir → özet),
`links.mjs`, `drawer2.mjs` (drawer: chevron gezinmemeli, satır gezinmeli).

**Kontrast ölçümü** (challenge kartları gibi): tahminle karar verme. Metni `visibility:hidden` yap,
ekran görüntüsü al, metin kutusunun altındaki **en açık** zemin pikselini bul (beyaz metin için en kötü durum),
WCAG formülüyle oranı hesapla. Bu turda ilk deneme 4.07:1 çıkıp AA'da kaldı; gradient koyulaştırılıp
8.5:1 (başlık) / 7.6:1 (açıklama) değerlerine çıkıldı.

---

## 8 · Bilinen açık konular

### Türkçe tireleme sözlüğü yok

`fit-type.css` `hyphens:auto` yazar ama **Chromium Türkçe tireleme sözlüğü taşımıyor** — pratikte no-op.
Sonuç: dar kolonlarda yaslama kelime aralarını açıyor, özellikle 2 satırlık banner alt başlıklarında
(`.lib-sub`, 15.5px / ~560px) göze çarpıyor. Kart gövdeleri container query istisnasıyla korunuyor.

Seçenekler: (a) böyle bırak — istenen buydu; (b) `.lib-top .lib-sub`'ı istisnaya ekle;
(c) `Hyphenopoly.js` gibi bir JS tireleyici ekle (prototip için ağır). Karar kullanıcının.

### `#pro` çapası

Menüdeki eski "Ücretsiz ve Pro" kalemi `program-liste-v1.html#pro`'ya gidiyordu; **o çapa o sayfada hiç yoktu**.
Gerçek bölüm `programlar-merkezi-v1.html`'de (`<section id="pro">`). Şimdi:

- Menüde ayrı kalem **yok** (kullanıcı "ya ayrı hedeflere ayır ya tek girişte birleştir" dedi → birleştirildi).
- `program-liste-v1` banner'ında "Ücretsiz ve Pro" düğmesi `programlar-merkezi-v1.html#pro`'ya gider.
- Menüye geri eklenirse **aynı-hedef kuralını** ihlal eder (başlık zaten o sayfaya gidiyor).

### Canlı carousel kullanan sayfa yok

Revizyon isteğindeki "Pro slider'ları" maddesi belirsizdi. Ölçüm sonucu:
`program-liste-v1.html#pro` adresinde carousel yok, çapa da yoktu. "Slider" görünen şey ≤640px'te
yatay raya dönüşen `.fgroup` filtre satırlarıydı — `.ff` bileşeniyle tamamen kalktı.

Kabuktaki `.row-track`/`.row-nav` slider altyapısı ayrıca düzeltildi (ölçülen kaydırma adımı,
uçlarda `disabled` oklar, taşma yoksa okların gizlenmesi, `tabindex` + ok/Home/End klavye desteği,
≤640px'te `min(274px,78vw)` kart genişliği) — **ama bu altyapıyı kullanan gerçek markup hiçbir sayfada yok.**
`.row-track` yalnız 12 legacy sayfanın ölü CSS/JS'inde geçiyor. Yani düzeltme ileriye dönük;
kullanıcı başka bir yeri kastediyorsa netleştirilmeli.

### Küçük notlar

- Özet modalindeki "ortalama RPE" kutusu yalnız en az bir sette RPE seçilmişse basılır (4 ya da 5 kutu).
- `antrenorler-v1` sayfalaması `PER_PAGE=6`, 8 kart → 2 sayfa. Kart sayısı artarsa otomatik uyar.
- `.ff` bileşeni JS kapalıyken bar/çip/sonuç satırını gizler (`.ff:not(.ff-ready)`), sayfa eski
  satır düzeniyle kullanılabilir kalır.

---

## 9 · Son 5 commit

| Hash | Kapsam |
|---|---|
| `1d48557` | **shell** — `NAV` yeniden kurgusu (Antrenörler düz link, Planım butonu, Challenge kendi butonu, duplike hedeflerin temizliği, 7 orphan rehber sayfasının menüye alınması); `overflow-x:clip` + `scrollbar-gutter:stable` + sayaçlı `lockScroll`; nav hover-açar/tık-gider; `.cc-card` overlay'i; `.hr-note` margin-collapse düzeltmesi |
| `8e7b59c` | **type** — `assets/css/fit-type.css` eklendi, 47 sayfaya `</head>` öncesi link, eski `text-align:left` kuralı kaldırıldı |
| `1a4a222` | **filters** — `.ff` bileşeni (CSS+JS), 6 sayfaya `data-ff` bağlanışı, `backdrop-filter` kırpma tuzağının çözümü, `.row-track` slider altyapısının düzeltilmesi, `program-liste` → `#pro` bağlantısı |
| `d6f188c` | **pages** — antrenör dizini banner CTA + numaralı sayfalama; egzersiz detayında dinlenme sayacı/kronometre/RPE/not/özet akışı ve önceki antrenman kıyası; video uyarısının ortalanması; challenge kart kontrastının ölçülerek AA'ya çıkarılması |
| `29c82de` | **qa** — kalan 4 duplike nav hedefi, Planım sekme rayının 11 kalemde sarması, drawer satırının gerçek bağlantıya çevrilmesi (chevron ayrı `.d-toggle`) |

Taban: `bbd2bdc` (Ana sayfa hero'su tam ekran). Toplam: 51 dosya, +2122 / −232.

**Doğrulama durumu:** yerelde 47 sayfa × 5 genişlik ve canlıda 8 anahtar adres × 2 genişlik —
404 yok, konsol hatası yok, yatay taşma yok, kırık iç link yok.

---

## 10 · Yeni oturum için hızlı başlangıç

```bash
cd /Users/gaviaworks/Developer/Projects/dadafit-prototip
git log --oneline -6
cat REVIZE-PLAN.md          # biten 11 maddenin kök neden analizi ve dosya haritası
python3 -m http.server 8811 &
```

Bir şeyi değiştirmeden önce sor: **bu kabukta mı, sayfada mı?**
Header/nav/drawer/footer/filtre/kart kabuğu → `fit-shell.js` + `fit-shell.css`, tek yerden.
Sayfa sayfa kopyala-yapıştır bu repoda bilinçli olarak reddedilmiş bir desendir.
