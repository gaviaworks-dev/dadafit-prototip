# AJAN-F · REVİZYON 6 · Madde 20 — Arama öneri paneli

**Dosya:** `arama-fit-v1.html` (+62 satır) · **yeni sınama:** `tests/arama-oneri.mjs`
**Kabuk dosyalarına dokunulmadı** — `git diff` teyidi: değişen tek sayfa dosyam `arama-fit-v1.html`.

---

## KÖK NEDEN — DOM'da ölçüldü, tahmin edilmedi

Sorun **tek** değil, **iki katmanlı**ydı. Panelin kendi `z-index:60`'ı zaten
doğruydu; hata onda değildi.

### Neden 1 — `overflow:hidden` paneli hem boyamadan hem isabet testinden siliyordu

| | |
|---|---|
| **Dosya:satır** | `arama-fit-v1.html:449` — `.fs-top{…;overflow:hidden}` |
| **Ata zinciri ölçümü** | `form#fsForm.fs-box` (visible) → `div.wrap` (visible, z-index **2**) → **`section.fs-top` (overflow: hidden)** → `main#pageMain` → `body` |
| **Ölçülen ÖNCE** | Panel `getBoundingClientRect()` = `top 436.6 · bottom 876.6` · hero `.fs-top` alt kenarı = **544**. Panelin **332 px**'i kesiliyordu. |
| **Kanıt** | `document.elementFromPoint()` @1440 üç noktada: `div.ac-grp` ✓ · **`button.chip`** ✗ · **`p`** ✗ → panelin ortası ve altı arkadaki `#fsPop` bölümünü döndürüyordu. @390: 2/3 ✓, alt nokta `section#fsPop.fs-pop`. |

`overflow:hidden` yalnız boyamayı değil **hit-test'i de** kesiyor; bu yüzden
panel hem görünmüyor hem tıklanamıyordu.

### Neden 2 — `.fs-top .wrap{z-index:2}` panel için stacking context açıyor

| | |
|---|---|
| **Dosya:satır** | `arama-fit-v1.html:452` — `.fs-top .wrap{position:relative;z-index:2}` |
| **Mekanizma** | `position:relative` + `z-index:2` → yeni stacking context. Panelin `z-index:60`'ı bu bağlamın **içinde** kalıyor; dışarıya **2** olarak görünüyor. |
| **Çakışan katman** | `.fs-tabbar` (`arama-fit-v1.html:497`) — `position:sticky; z-index:40`, `#pageMain`'in **kardeş** çocuğu. 40 > 2 olduğu için sorgulu sayfada sekme barı panelin üstüne boyanıyordu. |
| **Ölçülen ÖNCE** | `?q=squat` @1440, panelin alt noktası → **`div.fs-tabs`** |

`.fs-top` kendisi `z-index:auto` olduğu için stacking context açmıyordu;
`overflow:hidden` düzeltilse bile Neden 2 tek başına hatayı sürdürüyordu.
Bunu **taban commit'e karşı koşan sınama** kanıtladı (aşağıda K27).

### Referans karşılaştırması — hata kardeş şablondan geliyor

* `dadagastro.com/ara` → panel `.sr-ac`, hero `section.below-header.srch-top`
  **`overflow: visible`**. Panel doğru çalışıyor (3/3 `elementFromPoint` içeride).
* `dadadiet.com/arama` → **DadaFit ile birebir aynı sayfa ve aynı hata.**
  Panel "ÖNERİLER" grubunun ortasında kesiliyor
  (`tasks/r6-shots/F/ref-diet-arama-1440.png`).

Yani `overflow:hidden` gastro'nun **düzeltilmiş** şablonundan değil,
diet'in **hatalı** şablonundan miras alınmış.

### Düzeltme

`arama-fit-v1.html:449-460` ve `:600`, `:1010`

1. Süslemeler (`::before` radyal parlaklık + `::after` sağ-alt daire, `right:-120px;
   bottom:-140px`) kendi kırpma katmanına taşındı:
   `<div class="fs-top-deco" aria-hidden="true">` · `position:absolute;inset:0;
   overflow:hidden;z-index:1;pointer-events:none`. `.fs-top` **`overflow:visible`**.
   *Gerekçe:* `overflow:hidden` orada yalnız o iki süslemenin yatay/dikey taşmasını
   kırpmak için vardı — kırpma ihtiyacı korundu, panel serbest kaldı.
2. Panel açıkken `.fs-top` `fs-ac-live` sınıfıyla **`z-index:45`** alıyor
   (sekme barının 40'ının üstünde, header'ın 60'ının altında). Sınıf `open()`/`close()`
   içinde açılıp kapanıyor — **kapalıyken `.fs-top` yeniden `z-index:auto`**,
   footer perdesiyle hiç yarışmıyor.

### Ölçülen SONRA

| | ÖNCE (taban `8bf5c66`) | SONRA |
|---|---|---|
| `.fs-top` overflow | `hidden` | `visible` |
| Paneli kesen ata | `section.fs-top` (altKenar 544) | **yok** |
| `elementFromPoint` @1440 (3 nokta) | 1/3 ✓ | **3/3 ✓** |
| `elementFromPoint` @390 (3 nokta) | 2/3 ✓ | **3/3 ✓** |
| `?q=squat` sekme barı örtüşmesi | `div.fs-tabs` üstte | **panel üstte** (y=567) |
| 9 genişlikte (1440→390) 3 nokta | — | **9/9 genişlikte 3/3 ✓** |

---

## Geçiş 1 · Kur

- **`frontend-design` skill okundu: EVET.** Üç satır özet: (1) her karar bu
  brief'e özgü olmalı, şablon refleksi değil — mevcut bir tasarım dili varsa
  onun *ölçülmüş* değerleri kazanır; (2) cesaret tek yerde harcanır, gerisi
  sessiz ve disiplinli kalır; (3) kalite tabanı ilan edilmeden kurulur —
  mobil, görünür odak halkası, azaltılmış hareket.
- **Yapılan değişiklik:** `arama-fit-v1.html:449` (`overflow:hidden`→`visible`
  + `.fs-top-deco` katmanı) · `:600` (markup, deco div) · `:1010` (`open()`/`close()`
  `fs-ac-live` sınıfı).
- **Ekran görüntüsü:** `tasks/r6-shots/F/m20-g1-1440.png` · `m20-g1-390.png`
  (+ sorgusuz hâl: `m20-g1-bos-1440.png` · `m20-g1-bos-390.png`)

## Geçiş 2 · Kendi işini eleştir

Görüntülere `Read` ile bakıldı. Altı kusur bulundu, altısı da düzeltildi.

- **Kusur 1 — Panel beyaz kutudan dar, iki yanda 7 px'lik beyaz basamak.**
  `.fs-ac{left:6px;right:6px}` ile kutunun `padding:10px`'i çakışıyordu; panelin
  üst kenarında kutunun kendi kenarı basamak gibi görünüyordu — iki farklı
  genişlikte üst üste iki kart izlenimi.
  → `left:-1px;right:-1px` (kutunun **dış** kenarıyla, kenarlık dahil hizalı) +
  `top:calc(100% + 4px)` ile net bir ayrım.
  **Ölçülen:** panel `l=139 w=666` (kutu `l=132 w=680`, iki yanda 7 px basamak)
  → panel `l=132 w=680` (basamak **0**).

- **Kusur 2 — "Temizle" dokunma hedefi 45×17 px.**
  `padding:2px 4px`, hiçbir asgari yükseklik yok; @390'da 44 px kuralının
  çok altında. Odak halkası da yoktu.
  → `min-height:38px` (@≤640: `44px`), negatif margin ile satır büyümeden;
  `:focus-visible{outline:2px solid var(--fit-deep)}`.
  **Ölçülen:** `45.1×17px` → **@1440 54.8×38px · @390 54.8×44px**.

- **Kusur 3 — Klavye imleci yalnız açık yeşil zeminle belliydi.**
  `.ac-opt.is-active{background:var(--fit-tint)}` — `#eaf6ef` beyazla
  **1.13:1**; ekranda imlecin nerede olduğu güçlükle seçiliyordu.
  → Satırın soluna `3px` aksan çubuğu (`--fit-deep`, `::before`). Zeminden
  bağımsız okunan bir işaret.
  **Ölçülen:** tek işaret 1.13:1 → çubuk `#007a3d` beyazla **5.45:1**.

- **Kusur 4 — Panel yarıçapı kutuyla aynı aileden değildi**
  (`--radius-md` 12px panel · `--radius-lg` 16px kutu, elle uyumsuz seçilmiş).
  → Geçiş 3'te referans ölçümüyle **12 px**'te sabitlendi (aşağıya bakınız).

- **Kusur 5 — İki grup arasında dikey ritim yoktu.**
  "Son aramalar" son satırı ile "Popüler öneriler" başlığı arasında
  6+11 = **17 px**, panel üstündeki ilk başlık boşluğu **19 px** — iki farklı
  değer, grup sınırı okunmuyordu.
  → İlk başlık `padding-top:6px`; sonraki başlıklar
  `margin-top:8px; padding-top:15px; border-top:1px solid var(--line)`.
  **Ölçülen:** gruplar arası 17 px (ayraçsız) → **23 px + hairline ayraç**,
  panel üstü 14 px — sınır artık tek bakışta görünüyor.

- **Kusur 6 — Panel ve kutu aynı gölgeyi taşıyordu** (`--sh-lg` ikisinde de);
  yüzen katman ile duran kart aynı yükseklikte duruyordu.
  → Panele temas gölgesi eklendi: `0 2px 6px rgba(33,30,22,.06), var(--sh-lg)`.
  (Token korundu — Geçiş 3'te referansın da `--sh-lg` kullandığı ölçüldü.)

- **Ekran görüntüsü:** `tasks/r6-shots/F/m20-g2-1440.png` · `m20-g2-390.png`
  (+ `m20-g2-bos-1440.png` · `m20-g2-bos-390.png`)

## Geçiş 3 · Referansla karşılaştır

**Referans URL:** `https://dadagastro.com/ara` (panel `.sr-ac`) — Playwright ile
@1440 ve @390 açılıp ölçüldü. `https://dadadiet.com/arama` da açıldı;
**aynı hatayı taşıdığı için ölçüt değil, kanıt olarak** kullanıldı.
Görüntüler: `ref-gastro-ara-1440.png` · `ref-gastro-ara-390.png` ·
`ref-diet-arama-1440.png` · `ref-diet-arama-390.png`.

| Ölçüt | `dadagastro.com/ara` | DadaFit (G2 sonu) | Karar |
|---|---|---|---|
| hero `overflow` | **`visible`** | `visible` (düzeltildi) | ✓ eşit |
| panel `z-index` / `position` | `60` / `absolute` | `60` / `absolute` | ✓ eşit |
| panel `border-radius` | **`12px`** | `16px` | **12 px'e çekildi** |
| panel `box-shadow` | `0 18px 50px rgba(33,30,22,.16)` (`--sh-lg`) | özel, daha ağır | **`--sh-lg` + temas katmanı** |
| panel `padding` | `8px` | `8px` | ✓ eşit |
| panel `border` | `1px #ECECEC` (`--line`) | `1px var(--line)` | ✓ eşit |
| `max-height` @1440 | `440px` | `440px` | ✓ eşit |
| `max-height` @390 | **`360px`** | `min(440px,72vh)` = 440 | **`min(360px,56vh)`** |
| `.ac-opt` yükseklik / `padding` / `radius` / `gap` | `58` / `10px 12px` / `12px` / `13px` | aynı | ✓ eşit |
| `.ac-ttl` `font-size` | **`15px`** | `14.5px` | **15 px'e çekildi** |
| `.ac-grp` `padding` / `font` | `11px 12px 6px` / `11.5px 700 uppercase` | `6px 12px 7px` / aynı | ayraç düzeni gereği sapma (aşağıda) |
| `.ac-grp` rengi | `#7E7E7E` (`--muted`) — beyazla **4.06:1** | `--slate-2` — **7.86:1** | **referanstan güçlü, korundu** |
| Öneri satırı öğesi | **`<a href>`** — orta tık / yeni sekme çalışıyor | `<div role=option>` | **`<a href tabindex="-1">`** |
| kutunun altındaki boşluk | `-5px` (panel kutuya biniyor) | `+4px` | **sapma, gerekçesi aşağıda** |

**Referanstan zayıf kalan noktalar → nasıl kapatıldı**

1. **Yarıçap ailesi:** panel 16 px'ti, referansın bu bileşendeki değeri 12 px ve
   panelin içindeki `.ac-opt` de 12 px. → `--radius-md` (12 px). İç ve dış
   yarıçap artık tek değerde.
2. **Gölge token'ı:** kendi uydurduğum gölge yerine ev token'ı `--sh-lg`.
   Panel artık kutudan ayrık durduğu için önüne bir `0 2px 6px` temas katmanı
   eklendi — token değişmedi, üstüne bir kademe bindi.
3. **Mobil panel yüksekliği:** referans @390'da paneli **360 px**'te kesiyor;
   bizimki 440 px'ti ve 844 px'lik ekranda sayfadan geriye ~100 px bırakıp
   alt gezinme çubuğuna dayanıyordu. → `@media(max-width:640px){max-height:min(360px,56vh)}`.
   **Ölçülen** (@390, varsayılan panel, `scrollHeight`=678 yani içerik taşıyor):
   yükseklik `440` → **`360`**, alt kenar `789.6` → **`709.6`**; alt gezinme
   çubuğunun üst kenarı `766` — çakışma **vardı, bitti**.
4. **Satır başlığı ölçüsü:** `14.5px` → **`15px`** (referansın ev ölçüsü).
   Ağırlık `600` korundu — bizde referansta olmayan bir `.ac-sub` alt satırı
   var, iki kademeli hiyerarşi ona dayanıyor.
5. **Öneri satırı gerçek bağ değildi.** Referansta `.ac-opt` bir `<a href>`;
   orta tıkla yeni sekmede açılıyor, tarayıcı durum çubuğunda adres görünüyor.
   Bizde `<div>`'di, bu yetenekler yoktu. → `r.href` taşıyan satırlar artık
   `<a href … tabindex="-1">`. `tabindex="-1"`, referansta olmayan bir ek:
   combobox'un `aria-activedescendant` modeli bozulmasın, Tab sırası 8 öneriyle
   şişmesin diye. Sorgu satırının (`type=q`) hedef adresi olmadığı için `div` kaldı.
   **Ölçülen** (`?q=plank`, 2 satırın 1'inin hedefi var): `a.ac-opt` sayısı
   `0` → **`1`**, `href="egzersiz-kutuphane-v1.html"` · `tabindex="-1"` ·
   `text-decoration:none`.

**Referanstan bilerek sapılan iki nokta (ikisi de referanstan güçlü)**

- **Panel kutuya binmiyor, 4 px altında duruyor.** Referansta panel kutunun
  içine 5 px giriyor ve `left/right:6px` yüzünden iki yanda 7 px'lik beyaz
  basamak bırakıyor — bu, Geçiş 2'de kendi çıktımda kusur olarak bulduğum
  şeyin ta kendisi (`ref-gastro-ara-1440.png`'de görülebilir). Kutunun dış
  kenarıyla hizalı + 4 px ayrık düzen basamağı sıfırlıyor ve "bu bir açılır
  panel" okumasını netleştiriyor.
  **Geri alma:** `.fs-ac`'de `left/right:-1px` → `6px`, `top:calc(100% + 4px)`
  → `calc(100% - 5px)`.
- **Grup başlığı rengi ve ayraç.** Referansın `#7E7E7E`'si 11.5 px metinde
  **4.06:1** — AA altında. `--slate-2` **7.86:1**. Ayrıca referansta tek grup
  var, bizde iki ("Son aramalar" + "Popüler öneriler"); sınırı okutmak için
  hairline ayraç eklendi. Referansta olmayan bir ihtiyaç.
  **Geri alma:** `.ac-grp` rengini `var(--muted)`'a döndür, `:not(:first-child)`
  kuralını sil.

- **Ekran görüntüsü:** `tasks/r6-shots/F/m20-g3-1440.png` · `m20-g3-390.png`
  (+ `m20-g3-bos-1440.png` · `m20-g3-bos-390.png`)

---

## Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| `elementFromPoint()` panelin kendi öğesi — @1440, 3 nokta | 3/3 | **3/3** (y=389·482·575) | ✅ |
| `elementFromPoint()` panelin kendi öğesi — @390, 3 nokta | 3/3 | **3/3** (y=305·398·491) | ✅ |
| Aynısı, sorgusuz (varsayılan) panel @1440 / @390 | 3/3 | **3/3 · 3/3** | ✅ |
| Aynısı, 9 genişlikte (1440·1280·1100·1024·900·768·640·500·390) | hepsi | **9/9** | ✅ |
| Panel beyaz kutunun sınırından taşabiliyor | taşıyor | @1440 panel alt `589.3` > kutu alt `372` · @390 `505.3` > `288` | ✅ |
| Paneli kesen `overflow`'lu ata | 0 | **0** (taban: `section.fs-top`) | ✅ |
| Panel sekme barının üstünde (`?q=`) | üstte | @1440 örtüşme y=567 → **panel** (`.fs-tabbar` z-index 40) | ✅ |
| Header etkilenmedi | `fixed` / `z-index:60` | **`fixed` / `60`** (9/9 genişlik) | ✅ |
| `.fs-top` header'ın altında kalıyor | < 60 | **45** (açıkken) · **auto** (kapalıyken) | ✅ |
| R11 footer perdesi | `main.margin-bottom` = footer yüksekliği | 1440 `579.531`=`579.531` · 1280 `601.922`=`601.922` · 1100 `663.953`=`663.953` · 1024 `1100.690`≈`1100.688` · 900 `1132.380`≈`1132.375` · 768 `1139.700`≈`1139.703` (≤640 footer `static`) | ✅ |
| Klavye gezinme | ArrowDown imleci ilerletiyor | `aria-activedescendant`: `""` → `fs-opt-0` → `fs-opt-1` (@1440 ve @390) | ✅ |
| Esc kapatıyor | kapanıyor | `ac-open` kalktı, `aria-expanded="false"`, `fs-ac-live` geri alındı | ✅ |
| Dokunma hedefi @390 ("Temizle") | ≥ 44 px | **54.8×44 px** | ✅ |
| Yatay taşma | 0 | `scrollWidth == innerWidth` (9/9 genişlik) | ✅ |
| Konsol hatası | 0 | **0** | ✅ |
| `tests/a11y-focus.mjs` | yeşil | **0 sorun** | ✅ |
| `tests/dropdown-position.mjs` | yeşil | **36 panel · 0 sorun** | ✅ |
| `tools/page-check.mjs arama-fit-v1.html 1440` | temiz | **→ temiz** | ✅ |
| **K27** — `tests/arama-oneri.mjs` tabanda kırmızı | kırmızı | **`8bf5c66`'da exit 1 · 7 sorun** (aşağıda) · `main`'de yeşil | ✅ |

### K27 kanıtı — taban `8bf5c66`

```
git worktree add /tmp/r6-taban-f 8bf5c66
cd /tmp/r6-taban-f && python3 -m http.server 8815
node tests/arama-oneri.mjs http://localhost:8815      → exit 1
```

Tabanda düşen 7 ölçüt:

```
✗ @1440 elementFromPoint(alt, y=557) → "div.fs-tabs" — panel ÜSTTE DEĞİL
✗ @1440 panelin taşan kısmını KESEN ata var: section.fs-top (overflow-y:hidden, altKenar=544.0)
✗ @1440 sekme barı (z-index:40) panelin üstünde — y=557'de "div.fs-tabs" bulundu
✗ @1440 sorgusuz panelde 2/3 nokta panelin dışını döndürdü (y=657, 863)
✗ @1440 "Temizle" dokunma hedefi 45.1×17px — 32px altında
✗ @390  sorgusuz panelde 1/3 nokta panelin dışını döndürdü (y=768)
✗ @390  "Temizle" dokunma hedefi 45.1×17px — 44px altında
```

Sınama kök nedenin **iki katmanını da** ayrı ayrı adlandırıyor
(`overflow-y:hidden` taşıyan ata **ve** `z-index:40` sekme barı), yani ileride
biri geri gelirse hangisi olduğu rapordan okunuyor.
`git worktree remove /tmp/r6-taban-f` yapıldı.

---

## Verilen kararlar (gerekçe + nasıl geri alınır)

1. **`overflow:hidden` kaldırılıp süslemeler `.fs-top-deco`'ya taşındı**
   — `overflow-x:clip; overflow-y:visible` da denenebilirdi ama `::after`
   dairesi `bottom:-140px` ile dikeyde de taşıyor; o yol daireyi hero'nun
   altına sızdırırdı. Ayrı kırpma katmanı ikisini de çözüyor.
   **Geri alma:** `.fs-top-deco` kuralını ve markup'taki div'i sil,
   `::before`/`::after`'ı `.fs-top`'a geri koy, `overflow:hidden` yap.
2. **Yükseltme kalıcı değil, `fs-ac-live` sınıfıyla geçici.**
   `.fs-top{z-index:45}` kalıcı olsaydı, `#pageMain`'in stacking context
   açmadığı ≤640 px'te hero, `z-index:1` taşıyan sabit footer'la yarışabilirdi.
   Sınıf yalnız panel açıkken duruyor. (Ölçüm: ≤640'ta footer zaten `static`,
   yani bugün risk yok — ama kilit ileride footer sabitlenirse de tutar.)
   **Geri alma:** `.fs-top.fs-ac-live{z-index:45}` kuralını sil ve
   `open()`/`close()`'daki `hero.classList` satırlarını çıkar.
3. **`45` seçildi** çünkü `.fs-tabbar` 40, header 60. Aradaki tek anlamlı
   aralık. Kabuk katmanlarının hiçbiri değişmedi.
4. **`.ac-opt` yalnız `href` taşıyorsa `<a>`** — sorgu satırının hedef adresi
   yok, `role="option"` taşıyan boş `<a>` üretmek yanlış olurdu.
   **Geri alma:** `render()` içindeki `var tg=r.href?'a':'div'` satırını
   `var tg='div'` yap.

---

## Kabukta gördüğüm ama DOKUNMADIĞIM eksikler (AJAN-A'ya)

**Kabukta düzeltilmesi gereken bir şey bulunmadı.** Ölçülen katman merdiveni
tutarlı ve bu maddede yeterliydi:

| Katman | `position` | `z-index` | Not |
|---|---|---|---|
| `.header` | `fixed` | `60` | dokunulmadı |
| `#pageMain` | `relative` >640px · `static` ≤640px | `2` / `auto` | dokunulmadı |
| `footer` | `fixed` >640px · `static` ≤640px | `1` / `auto` | dokunulmadı |

Tek gözlem, kabuk hatası değil ama kayda değer:
**`#pageMain`'in stacking context olmaktan çıktığı kırılma noktası 640 px.**
≤640'ta bir sayfa öğesine `z-index` verilirse doğrudan sabit footer'la
(`z-index:1`) yarışır. Bugün ≤640'ta footer `static` olduğu için sonucu yok;
AJAN-A footer'ı mobilde sabitlemeye karar verirse bu maddedeki `45` de dahil
tüm sayfa-içi yükseltmeler yeniden ölçülmeli.

**Depo dışı bulgu (lead'e):** `dadadiet.com/arama` üretimde **bu maddenin
düzelttiği hatanın aynısını** taşıyor — öneri paneli hero bandında kesiliyor
(`tasks/r6-shots/F/ref-diet-arama-1440.png`). `dadagastro.com/ara`'da düzeltilmiş.

---

## Bozulmadığını kanıtladıklarım

- **Banner ailesi — `arama-fit-v1` LİSTE:** `.fs-top` dış yüksekliği
  @1440 **544** · @1024 **607** · @390 **587** — üçü de beklenen değerde.
  `body[data-fit-hero-kind]="liste"` korundu.
- **R11 footer perdesi:** footer'ın sabit olduğu 6 genişlikte
  `main.margin-bottom − footer yüksekliği` farkı **≤ 0.003 px** (yukarıdaki tablo).
- **Header:** `position:fixed` · `z-index:60` — 9 genişlikte değişmedi.
- **`tests/a11y-focus.mjs`** → `0 sorun` ✓
- **`tests/dropdown-position.mjs`** → `36 panel ölçüldü · 0 sorun` ✓
- **`tests/arama-oneri.mjs`** (yeni) → `main`'de yeşil, tabanda kırmızı ✓
- **`tools/page-check.mjs arama-fit-v1.html 1440`** → `→ temiz` ✓
  (`href="#" sayısı: 8` uyarısı **taban ile aynı** — kabuğun ürettiği
  bağlantılar, markup'ta 0, benim eklediğim yok.)
- **Kabuk dosyaları:** `assets/css/fit-shell.css` ve `assets/js/fit-shell.js`
  benim tarafımdan **değiştirilmedi**.

---

## Not — paylaşılan scratchpad çakışması

`…/scratchpad/` dizini ajanlar arasında **ortak**; `shot.mjs` / `ref.mjs` gibi
genel adlar başka bir ajan tarafından üzerine yazıldı ve bir turluk ölçümüm
sessizce kayboldu (exit 0, dosya yok). Kendi dosyalarımı
`scratchpad/ajanF/` altına aldım. `tasks/r6-shots/F/` içindeki
`m20-m11-15-*.png` ve `m20-http:` **bana ait değil** — başka bir ajanın
benim adlandırmamla çalıştırdığı betikten kalmış; silmedim.
Benim görüntülerim yalnız `m20-g1/-g2/-g3-*` ve `ref-gastro-*` / `ref-diet-*`.
