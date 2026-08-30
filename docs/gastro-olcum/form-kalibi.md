# Gastro Admin — Ekleme/Düzenleme Form Kalıbı (ölçüm)

**Ölçüm tarihi:** 2026-08-30
**Kaynak (salt okuma):** `/Users/gaviaworks/Developer/Backend Projects/dadagastro-profil`
**Amaç:** DadaFit yönetim panelindeki "Yeni ekle / Düzenle" formlarının yeniden
çizilmesi için taban. Aşağıdaki her sayı ve her alan adı kaynak dosya:satır ile
işaretlidir; hiçbiri tahmin değildir.

Yollar bu belgede kaynak deponun köküne görelidir
(`rv/` = `resources/views/`, `pr/` = `public/reference/`,
`ahc/` = `app/Http/Controllers/Admin/`).

---

## 0. Bir bakışta

| Form | Blade | Satır | Sekme | Üst düzey alan | Repeater |
|---|---|---:|---|---:|---:|
| Tarifler | `rv/admin/tarifler/form.blade.php` | 1430 | 2 (İçerik · SEO) | 38 | 2 |
| Blog & İçerik | `rv/admin/icerik/form.blade.php` | 1250 | 2 (İçerik · SEO) | 41 | 6 |
| Mutfağa Giriş (Ders) | `rv/admin/mutfaga-giris/form.blade.php` | 787 (+455 +561 +38 partial) | 3 (İçerik · Ders Akışı · SEO) | 42 | 11 |
| Püf Noktaları | `rv/admin/puf-noktalari/form.blade.php` | 447 (+`_section-card` 66) | 3 (İçerik · Bölüm Listesi · SEO) | 19 | 1 |
| Sayfalar & SEO | `rv/admin/sayfalar/form.blade.php` | 446 | 2 (İçerik · SEO) | 15 | 1 (koşullu) |
| Sözlük | `rv/admin/sozluk/form.blade.php` | 319 (+`_recipe_row` 20, `_relation_row` 25) | 4 (Temel · İlişkiler · SEO · Editoryal) | 27 | 2 |
| Koleksiyonlar | `rv/admin/koleksiyonlar/form.blade.php` | 310 | 2 (İçerik · SEO) | 17 | 1 |
| Videolar | `rv/admin/videolar/form.blade.php` | 229 | 2 (İçerik · SEO) | 17 | 0 |

Sekme sayıları: `tarifler:131-134`, `icerik:133-136`, `mutfaga-giris:327-331`,
`puf-noktalari:106-110`, `sayfalar:94-97`, `sozluk:40-45`,
`koleksiyonlar:88-91`, `videolar:63-66`.

---

## 1. ORTAK KALIP ÖZETİ — "her Gastro içerik formu şu parçalardan oluşur"

Sekiz formun sekizi de aşağıdaki iskeleti kullanıyor. Sıra bağlayıcı.

```
[geri bağlantısı]  ← .back-link / inline <a> + fa-arrow-left
[.pnl-page-head]   ← <h1> {düzenle mi yeni mi} + .ph-sub tek cümlelik açıklama
[@if($errors->any()) .sa-flash]  ← "Formda :count hata var" (kırmızı şerit)

<form method=POST action={isEdit ? update : store}>
  @csrf  +  @method('PUT') yalnız düzenlemede

  <div class="form-layout">              ← 2 KOLON grid, sağ kolon 280–360px

    ┌─ SOL KOLON: <div class="pnl-card">
    │  [.sa-form-tabs]                    ← form-içi sekme şeridi (2–4 sekme)
    │  <x-admin.lang-tabs>                ← TEK global 🇹🇷/🇬🇧 kapsamı, TÜM sekmeleri sarar
    │    [.sa-form-panel data-form-panel="icerik"]
    │       1. Kapak Görseli   ← LİTERAL EN ÜST, künyeden bile önce
    │       2. Künye            ← başlık · slug · tip/kategori · etiket
    │       3. Gövde/repeater'lar
    │    [.sa-form-panel data-form-panel="…"]   (modüle özel ek sekmeler)
    │    [.sa-form-panel data-form-panel="seo" hidden]
    │       <x-admin.seo-tab> (+ modüle özel seo_keywords)
    │  </x-admin.lang-tabs>
    │  [.form-actions]                    ← sağa yaslı: İptal (ghost) + Kaydet (acc)
    └─
    ┌─ SAĞ KOLON: <aside class="side-card">   ← position:sticky
    │  <x-admin.publish-sidebar>
    │     Durum select + .status-dot
    │     Yayınlanma Tarihi (date)
    │     [slot] modüle özel toggle'lar
    │     ──────
    │     SEO Skoru: halka (0-100) + İyi/Orta/Düşük + 5 kriterli liste
    │  (opsiyonel ek kartlar: Kaynak · Etiketler · Sil)
    └─
  </div>
  [gizli JSON input'ları]   ← repeater'lar submit anında serialize edilir
</form>
```

### 1.1 Değişmeyen 7 parça

| # | Parça | Nerede tanımlı | Kanıt |
|---|---|---|---|
| P1 | 2 kolonlu `.form-layout` | `pr/admin-icerik/sa-icerik-form.css:25` | `grid-template-columns:minmax(0,1fr) minmax(280px,360px);gap:24px;align-items:start` |
| P2 | Sticky yan kart | `pr/admin/sa-ui.css:144`, `:153` | `position:sticky;top:calc(var(--pnl-top-h) + 28px)` — `@media(max-width:900px)` altında `position:static` |
| P3 | Form-içi sekme şeridi | `pr/admin/sa-ui.css:176-180`, `:186` | `.sa-form-tabs`/`.sa-form-tab`/`.sa-form-panel[hidden]{display:none}`; hatalı sekmeye `.has-error::after` kırmızı nokta |
| P4 | Dil sekmesi (TR/EN) | `rv/components/admin/lang-tabs.blade.php`, CSS `public/css/admin-lang-tabs.css:30-36` | Tek `.lang-scope`, tek delege dinleyici (`lang-tabs:35-50`); `.lang-pane[hidden]{display:none}` |
| P5 | Çift-dilli alan üretici | `rv/components/admin/tfield.blade.php` | `name[tr]` / `name[en]` bracket'ı; 3 tip: `text` \| `textarea` \| `richtext` (`tfield:48-54`) |
| P6 | Yayın yan kartı | `rv/components/admin/publish-sidebar.blade.php` | Durum + Tarih + SEO Skoru üçlüsü, `:105-174` |
| P7 | SEO sekmesi | `rv/components/admin/seo-tab.blade.php` | `seo_title` (vars. max 180) + `seo_description` (vars. max 320), `seo-tab:30-42` |

### 1.2 Alan primitifleri (form kiti)

`pr/admin-icerik/sa-icerik-form.css` — sekiz formun sekizi de bu ya da onun
klonu `pr/admin-tarifler/sa-tarifler-form.css` / `pr/admin-sayfalar/sa-sayfalar-form.css`
dosyasını yüklüyor.

| Sınıf | Ne | Kaynak |
|---|---|---|
| `.form-grid` | dikey alan yığını, `gap:18px` | `sa-icerik-form.css:12` |
| `.frow` | tek etiket+alan çifti, `flex-direction:column;gap:7px` | `:13` |
| `.frow label` | `12.5px / 700 / var(--slate-2)` | `:14` |
| `.frow.two` | yan yana iki alan, `grid-template-columns:1fr 1fr;gap:14px` | `:19` |
| `.finput,.fselect,.ftext` | `height:44px;padding:0 14px;font-size:13.5px;radius:--radius-md` | `:16` |
| `.ftext` | `height:auto;min-height:96px;padding:12px 14px` | `:17` |
| odak hâli | `border-color:var(--acc);box-shadow:0 0 0 3px rgba(var(--acc-rgb),.12)` | `:18` |
| `.fhint` | `11.5px / 500 / var(--muted)` | `:15` ve `sa-ui.css:115` |
| `.form-sec` | bölüm bloğu, `padding:18px 22px;border-bottom:1px solid var(--line)` | `:20`; son bölümde çizgi yok `:21` |
| `.form-sec-tt` | bölüm başlığı, `13px/700`, ikonu `var(--acc)` | `:22-23` |
| `.form-actions` | `justify-content:flex-end;gap:10px;padding:16px 22px` | `:24` |
| `.slug-wrap` / `.slug-pre` | ön-ekli URL alanı ("dadagastro.com/…") | `:31-34` |
| `.add-row` | kesikli çerçeveli "+ Ekle" düğmesi, `padding:13px 22px` | `:171-172` |
| `.bd-list` / `.bd-row` | basit satır repeater'ı, `gap:10px` | `:215-219` |
| `.st-list` / `.st-card` / `.st-num` | kartlı repeater; numara 38px daire, accent zemin | `:107-111` |
| `.ie-drag` / `.ie-del` | sürükleme tutamacı + 30px sil düğmesi | `:163-167` |
| `.chips` / `.chip` / `.chip.is-on` | pill toggle grubu | `:203-206` |
| `.toggle` / `.toggle-track` / `.toggle-thumb` | 40×22 anahtar | `:87-92` |
| `.ms-field` ailesi | token-input (çoklu seçim) | `sa-ui.css:220-240` |
| `.img-upload-zone` | 240px kesikli görsel bırakma alanı | `sa-ui.css:121-130` |
| `.seo-score` / `.score-ring` / `.seo-checks` | skor halkası + kriter listesi | `sa-ui.css:158-170` |
| `.status-dot` | durum noktası; `draft`/`hidden` gri, `review` amber | `sa-ui.css:150-152` |

### 1.3 Repeater dili — üç tip

Gastro'da üç ayrı repeater ağırlığı var; hangisini kullanacağını **satırın alan
sayısı** belirliyor.

1. **`.bd-row` (hafif, 1-4 alan tek satırda)** — Besin Değeri satırı
   (`icerik/form:380-385`), Kısa Bilgi satırı (`icerik/form:346-353`), ders
   bölümü (`icerik/form:259-264`), öğrenme çıktısı
   (`_tab-icerik:156-160`), ekipman (`_tab-icerik:234`).
   Anatomi: `input`ler + `.ie-drag` + `.ie-del`, altında `.add-row.bd-add`.

2. **`.st-card` (ağır, kart)** — malzeme satırı (`tarifler/form:283-320`),
   hazırlanış adımı (`tarifler/form:372-420`), püf bölümü
   (`puf-noktalari/_section-card:12-...`), gövde bloğu
   (`icerik/partials/body-blocks-list:12-120`), sofra adımı
   (`icerik/form:479-510`).
   Anatomi: `.st-num` (sıra) + `.st-body` (alanlar) + `.st-side` (`.ie-drag` + `.ie-del`).

3. **`.ms-field` token-input (ilişki seçici)** — Kategoriler
   (`tarifler/form:210-219`), Mutfak (`tarifler/form:473-482`), İlişkili Tarifler
   (`tarifler/form:661-670`), ders formunun 5 ilişki alanı
   (`mutfaga-giris/partials/_ms-field.blade.php`).
   Anatomi: `.ms-box` içinde `.ms-chip` + gizli `input[name="x[]"]` çiftleri +
   `.ms-search`; açılır `.ms-menu`. Ders formunda seçenekler sunucu-taraflı
   arama ucundan gelir (`_ms-field:26`, `route('admin.lesson.search')`).

**Sürükle-sırala:** SortableJS 1.15.2 CDN, `defer` ile — `icerik/form:105`,
`koleksiyonlar/form:71`, `puf-noktalari/form:61`, `sayfalar/form:72` (yalnız
`slug=hakkimizda` iken).

**Minimum/maksimum:** Repeater'ların çoğunda sınır YOK. Ölçülen sınırlar:
galeri `max:8` (`tarifler/form:170`, kural `RecipeController:352`), adım görseli
`max:3` (`tarifler/form:400` `data-max="3"`, kural `RecipeController:413`),
ilişkili tarif `max:3` (`tarifler/form:671`, kural `RecipeController:387`),
ikincil etiket 3 / püf sorgusu 8 (`GlossaryController:271`, `:274`),
ders bölümü 50 (`LessonController:520`).

### 1.4 Yayın yan kartı — bağlayıcı sözleşme

`rv/components/admin/publish-sidebar.blade.php`

**Üç blok, sırası sabit:**
1. **Durum** — `select`, varsayılan seçenek üçlüsü `draft / published / hidden`
   (`publish-sidebar:72-76`). Yanında `.status-dot`, select değişince renk
   güncellenir (`:178-182`).
2. **Yayınlanma Tarihi** — `<input type="date">`, ipucu: "Boş bırakılırsa ilk
   yayınlandığı an otomatik atanır." (`:135-141`). `showPublishedAt=false` ile
   tamamen gizlenebilir (`:37-47`).
3. **SEO Skoru** — yalnız en az bir `seo*` prop verilirse render edilir (`:84`).

**Slot:** modüle özel `.toggle-row`'lar tarih alanından SONRA gelir (`:143`).

**SEO skoru formülü (ölçülmüş, `publish-sidebar:86-100`):**

| Kriter | Geçme koşulu | Puan | Canlı mı |
|---|---|---:|---|
| Meta başlık uygun uzunlukta | 40 ≤ uzunluk ≤ 60 | 20 (dolu ama ideal değilse 10) | canlı |
| Meta açıklama dolu | 120 ≤ uzunluk ≤ 158 | 20 (dolu ama ideal değilse 10) | canlı |
| URL temiz ve okunabilir | `/^[a-z0-9-]+$/` | 20 | statik (sunucu render anı) |
| Anahtar kelime tanımlı | boş değil | 20 | canlı |
| Kapak görseli eklendi | bool true | 20 | statik |

Tavan 100 (`:99`). Etiket: **İyi ≥75 · Orta ≥50 · Düşük** altı (`:100`).
Prop verilmeyen kriter listede HİÇ görünmez ve puana katılmaz — yani 4 kriterli
bir modül 80 üzerinden değil, verilen kriterlerin toplamı üzerinden puanlanır
(bu yüzden 4 kriterli formlar 80'i tavan görür; not `:16-24`).

**Hangi form kaç kriter kullanıyor:**

| Form | başlık | açıklama | URL | anahtar kelime | kapak | Toplam |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Tarifler (`tarifler/form:724-732`) | ✔ | ✔ | ✔ | — | ✔ | 4 |
| İçerik (`icerik/form:635-649`) | ✔ | ✔ | ✔ | ✔ | ✔ | 5 |
| Ders (`mutfaga-giris/form:363-376`) | ✔ | ✔ | ✔ | ✔ | ✔ | 5 |
| Püf (`puf-noktalari/form:261-273`) | ✔ | ✔ | ✔ | — | ✔ | 4 |
| Sayfalar (`sayfalar/form:328-339`) | ✔ | ✔ | ✔ | ✔ | — | 4 |
| Sözlük (`sozluk/form:241-260`) | ✔ | ✔ | ✔ | ✔ | — | 4 |
| Koleksiyon (`koleksiyonlar/form:186-197`) | ✔ | ✔ | ✔ | ✔ | ✔ | 5 |
| Videolar (`videolar/form:185-195`) | ✔ | ✔ | — | — | ✔ | 3 |

### 1.5 SEO sekmesi — ortak sözleşme

`rv/components/admin/seo-tab.blade.php`

- İki alan: **SEO Başlığı** (`text`) + **SEO Açıklaması** (`textarea`, `rows=2`).
- Varsayılan sınırlar: başlık `maxlength=180`, açıklama `maxlength=320`
  (`seo-tab:32,36`).
- Yardım metinleri sabit: "Boş bırakılırsa sayfa başlığı kullanılır. İdeal: 40–60
  karakter." / "İdeal: 120–158 karakter." (`seo-tab:64,74`).
- **Karakter sayacı YOK.** Sınır `maxlength` ile donanımdan uygulanır; görünür
  sayaç hiçbir formda yok (SERP önizleme + char-meter widget'ı bilinçli olarak
  kaldırılmış — `sayfalar/form:33-36` "STICKY TUTARLILIK SWEEP" notu). Tek
  istisna: `icerik/form:606-610` SERP önizleme kutusu (kozmetik, korunmuş).
- `canonical` alanı **hiçbir formda yok** (ölçüldü).
- `og:image` ayrı alan olarak **yok**; kapak görseli bu rolü üstleniyor.
- `slug` SEO sekmesinde değil, **künyede** (istisna: Sözlük — `sozluk/form:183-187`).
- `seo_keywords` bileşende yok, ihtiyacı olan modül SEO panelinde **ekstra alan**
  olarak ekliyor (`icerik/form:596-603`, `koleksiyonlar/form:169`,
  `sayfalar/form:305-312`, `_tab-seo:19-28`, `sozluk/form:192`).

Modüle göre sapan sınırlar:

| Form | seo_title max | seo_description max | Kaynak |
|---|---:|---:|---|
| Tarifler / İçerik / Püf / Ders | 180 | 320 | `RecipeController:363-366`, `ContentController:335-338`, `TipController:218-221`, `LessonController:582-585` |
| Koleksiyonlar | 70 | 170 | `koleksiyonlar/form:162-163`, `CuratedSetController:229-232` |
| Sayfalar | 70 | 170 | `sayfalar/form:287,297`, `PageController:198-201` |
| Sözlük | 255 | 400 | `GlossaryController:223-226` |
| Videolar | 180 | 320 | `VideoController:210-211` |

### 1.6 Akış — create/edit ve kaydet sonrası

**Tek blade, iki mod.** Sekiz formun sekizi de create ve edit için AYNI
`form.blade.php` dosyasını kullanır; ayrım tek bir `$isEdit` değişkeni:

| Form | Ayrım ifadesi | Satır |
|---|---|---|
| Tarifler | `$isEdit = $recipe !== null` | `tarifler/form:63` |
| İçerik | `$isEdit = $content->exists` | `icerik/form:51` |
| Püf | `$isEdit = $tip->exists` | `puf-noktalari/form:38` |
| Koleksiyon | `$isEdit = $curatedSet->exists` | `koleksiyonlar/form:44` |
| Videolar | `$isEdit = $video !== null` | `videolar/form:20` |
| Sözlük | `$term->exists` (doğrudan) | `sozluk/form:9` |
| Sayfalar | `$page->exists` (doğrudan) | `sayfalar/form:65`, `:78` |

`$isEdit`in değiştirdiği şeyler: `<h1>` metni, form `action`ı,
`@method('PUT')`, kaydet düğmesinin etiketi ("Püf Noktasını Oluştur" ↔
"Değişiklikleri Kaydet", `puf-noktalari/form:254`), ve düzenlemede beliren
ek kartlar (Tarifi Kaldır — `tarifler/form:784-802`).

Tek yapısal fark: **Sayfalar formunda `slug` yalnız yeni kayıtta düzenlenebilir**,
düzenlemede `readonly` (`sayfalar/form:129`) — route bağı kırılmasın diye.

**Kaydet sonrası yönlendirme (controller `redirect()`):**

| Form | store sonrası | update sonrası |
|---|---|---|
| Tarifler | `admin.tarifler.show` (`RecipeController:146`) | `admin.tarifler.show` (`:172`) |
| İçerik | `admin.content.edit` (`ContentController:168`) | — |
| Ders | `admin.lesson.edit` (`LessonController:322`) | — |
| Püf | `admin.puf.edit` (`TipController:86`) | — |
| Koleksiyon | `admin.koleksiyonlar.edit` (`CuratedSetController:110`) | — |
| Sayfalar | `admin.sayfalar.edit` (`PageController:122`) | — |
| Sözlük | `admin.sozluk.index` (`GlossaryController:123`) | `admin.sozluk.index` (`:147`) |
| Videolar | `admin.videolar.index` (`VideoController:69`) | `admin.videolar.index` (`:87`) |

**Kural:** Ağır formlar (İçerik/Ders/Püf/Koleksiyon/Sayfa) oluşturduktan sonra
**düzenleme ekranında kalır**; hafif formlar (Sözlük/Video) listeye döner.

**Kaydet çubuğu — düğmeler ve sıra:**

| Form | Düğmeler (soldan sağa) | Satır |
|---|---|---|
| Tarifler | İptal (ghost) · **Taslak Kaydet** (ghost) · **Yayınla** (acc) | `tarifler/form:696-700` |
| İçerik | İptal (ghost) · Değişiklikleri Kaydet (acc) | `icerik/form:618-621` |
| Ders | İptal (ghost) · Değişiklikleri Kaydet (acc) | `mutfaga-giris/form:349-352` |
| Püf | İptal (ghost) · {Değişiklikleri Kaydet \| Püf Noktasını Oluştur} (acc) | `puf-noktalari/form:252-255` |
| Sayfalar | İptal (ghost) · Değişiklikleri Kaydet (acc) | `sayfalar/form:320-323` |
| Sözlük | İptal (ghost) · Terimi Kaydet (acc) | `sozluk/form:230-233` |
| Koleksiyon | İptal (ghost) · Kaydet (acc) | `koleksiyonlar/form:176-179` |
| Videolar | Vazgeç (ghost) · Kaydet (acc) | `videolar/form:177-180` |

Çubuk **her zaman sol kolonun altında**, `.form-actions` içinde, sağa yaslı.
Tarifler formunda çubuk AYRI bir `.pnl-card` içinde (`tarifler/form:695`);
diğer yedisinde ana kartın son bloğu.

### 1.7 Hata gösterimi

İki katman, ikisi de her formda:

1. **Üstte toplu şerit** — `@if ($errors->any())` → `.sa-flash` (kırmızı,
   `--tomato-tint` zemin, `fa-circle-exclamation`), metin:
   `"Formda :count hata var, lütfen kontrol edin."`
   Kaynak: `tarifler/form:107-112`, `videolar/form:48-53`,
   `puf-noktalari/form:91-96`, `mutfaga-giris/form:306-318`.
   **Ders formu istisnası:** sayıya EK olarak `$errors->all()` madde madde
   listelenir (`mutfaga-giris/form:311-315`) — çünkü repeater'lar gizli JSON
   input'a yazıldığından alan-altı `@error` basılamıyor (gerekçe `:293-305`).

2. **Alan altında tekil** — `@error(name)` → `<span class="fhint"
   style="color:var(--tomato)">{{ $message }}</span>`.
   Kaynak: `tfield.blade.php:56` ve `:67` (her tfield otomatik basar),
   `seo-tab:104` ve `:110`, `sayfalar/form:132`, `_tab-icerik:52,66,97`.

`.sa-form-tab.has-error::after` ile hatalı sekmenin başlığına kırmızı nokta
konabiliyor (`sa-ui.css:186`) — mekanizma hazır.

Gastro'da **hiçbir formda** alan-üstü kırmızı çerçeve (`is-invalid` benzeri)
yok; hata rengi yalnız yardım metnine uygulanıyor.

---

## 2. FORM FORM ALAN ENVANTERİ

Aşağıdaki tablolarda `[tr/en]` işareti alanın `<x-admin.tfield>` ile
çift-dilli basıldığını ve POST adının `ad[tr]` / `ad[en]` olduğunu gösterir.
"Zorunlu" sütunu blade'deki `required` VE controller kuralını birlikte yansıtır.

---

### 2.1 Videolar — `rv/admin/videolar/form.blade.php` (229 satır)

**İskelet:** 2 kolon · sol kolonda 2 sekme (İçerik · SEO, `:63-66`) · tek global
`lang-tabs` ikisini birden sarar (`:74`, `:175`) · sağda sticky publish-sidebar
(`:184-205`) · kaydet çubuğu sol kolonun altında (`:177-180`).

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım / Varsayılan | Satır |
|---:|---|---|---|:-:|---|---|---|
| 1 | Kapak Görseli | `thumbnail[media_id]`, `thumbnail[removed]` | image-upload (`field="video.thumbnail"`) | – | `nullable/exists:media,id` | – | `:80-84` |
| 2 | Video Başlığı | `title[tr/en]` | text, max 190 | ✔ (tr) | `required,max:190` | ph: "ör. 10 Dakikada Menemen — Tek Tavada" | `:92` |
| 3 | Açıklama | `description[tr/en]` | richtext (TinyMCE, h=220) | – | `nullable,string` | – | `:93` |
| 4 | Şef | `chef_profile_id` | select | ✔ | `required,exists:chef_profiles,id` | "— Şef seçin —" | `:96-102` |
| 5 | Kategori | `category` | select (VideoCategory enum) | ✔ | `required,in:…` | varsayılan `tarif` | `:105-110` |
| 6 | Seri (opsiyonel) | `video_series_id` | select | – | `nullable,exists:video_series,id` | "— Serisiz —" | `:115-121` |
| 7 | Bölüm No | `episode_number` | number, min 1 | – | `nullable,min:1` | seri seçilmezse JS ile `disabled` (`:212-215`) | `:124-125` |
| 8 | İlişkili Tarif | `recipe_id` | select | – | `nullable,exists:recipes,id` | "Tarife Git" linki üretir | `:129-135` |
| 9 | Video Dosyası | `video_file[media_id]`, `[removed]`, `[poster_media_id]` | video-upload | – | `nullable,exists:media,id` | "Dosya yüklersen, bu bölümdeki Video URL alanı yok sayılır." | `:145-150` |
| 10 | Video URL (harici) | `video_url` | url | – | `nullable,url,max:2048` | ph `https://…` | `:154-155` |
| 11 | Süre (saniye) | `duration_sec` | number, min 0 | – | `nullable,min:0` | video yüklenince otomatik doldurulur (`duration-target="#f-sure"`) | `:158-159` |
| 12 | SEO Başlığı | `seo_title` | text (tek dilli) | – | `nullable,max:180` | "Boş bırakılırsa video başlığı kullanılır" | `:168-172` |
| 13 | SEO Açıklaması | `seo_description` | textarea (tek dilli) | – | `nullable,max:320` | "İdeal: 120–158 karakter." | `:168-172` |
| 14 | Durum | `publish_status` | select — **Taslak · Yayında** (2 seçenek) | – | `nullable,in:draft,published` | `published_at !== null ? published : draft` | `:186-188` |
| 15 | Yayınlanma Tarihi | `published_at` | date | – | `nullable,date` | – | `:189` |
| 16 | Haftanın videosu (hub hero) | `is_featured` | checkbox/toggle | – | `nullable,boolean` | – | `:196-199` |
| 17 | Pro kilitli | `is_pro` | checkbox/toggle | – | `nullable,boolean` | "yalnız video_premium abonesi erişir" | `:200-203` |

**Repeater:** yok.
**SEO skoru:** 3 kriter (başlık · açıklama · kapak) — slug ve anahtar kelime
prop'u verilmemiş (`:190-194`).
**Bu formun tek dilli SEO'su:** `seo-tab` `translatable` prop'u geçilmediği için
düz `seo_title` basılır (`:168`) — diğer yedisi çift dilli.

---

### 2.2 Koleksiyonlar — `rv/admin/koleksiyonlar/form.blade.php` (310 satır)

**İskelet:** 2 kolon · 2 sekme (İçerik · SEO, `:88-91`) · tek `lang-tabs` (`:93`,
`:174`) · sticky publish-sidebar (`:183-214`) · kaydet çubuğu `:176-179`.

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım / Varsayılan | Satır |
|---:|---|---|---|:-:|---|---|---|
| 1 | Kapak Görseli | `cover[media_id]`, `cover[removed]` | image-upload (`collection.cover`) | – | `nullable,exists:media,id` | – | `:99-103` |
| 2 | Tür | `kind` | select — Koleksiyon · Hazır Menü (NP) | ✔ | `required,in:koleksiyon,hazir_menu` | "Koleksiyon: /koleksiyon/{slug} sayfası. Hazır Menü: bugün-ne-pisirsem Tab B'de mod etiketiyle görünür." | `:111-116` |
| 3 | NP Modu | `bnp_mode` | select — yalnız `kind=hazir_menu` iken görünür (JS `:225-227`) | – | `nullable,in:config('bnp.modes')` | – | `:118-125` |
| 4 | Başlık | `title[tr/en]` | text, max 180 | ✔ (tr) | `required,max:180` | – | `:127` |
| 5 | URL adresi | `slug` | text + `.slug-wrap` ön-ek `dadagastro.com/koleksiyon/` | – | `nullable,max:200,regex:/^[a-z0-9-]+$/,unique` | "Boş bırakılırsa başlıktan türetilir" | `:129-133` |
| 6 | Kart teaser'ı | `teaser[tr/en]` | text, max 200 | – | `nullable,max:200` | – | `:135` |
| 7 | Detay altbaşlığı | `lead[tr/en]` | text, max 280 | – | `nullable,max:280` | – | `:136` |
| 8 | Açılış paragrafı | `description[tr/en]` | richtext | – | `nullable,max:1600` | – | `:137` |
| 9 | Duraklar (Tarifler) | `stops` (gizli JSON) | **repeater** | – | `nullable,string` | "Sıralı tarif listesi — 'N tarif' rozeti buradan canlı türetilir." | `:146-153` |
| 10 | Gövde blokları | `body_blocks` | gizli — düzenlenemez, mevcut değer korunur | – | `nullable,string` | FB64: koleksiyon public'te render edilmiyor | `:217` |
| 11 | SEO Başlığı | `seo_title[tr/en]` | text, max **70** | – | `nullable,max:70` | "Boş bırakılırsa başlık kullanılır" | `:158-165` |
| 12 | SEO Açıklaması | `seo_description[tr/en]` | textarea, max **170** | – | `nullable,max:170` | – | `:158-165` |
| 13 | Anahtar Kelimeler | `seo_keywords[tr/en]` | text, max 255 | – | `nullable,max:255` | "virgülle ayırın" | `:169` |
| 14 | Durum | `status` | select — Taslak · Yayında · Gizli (bileşen varsayılanı) | ✔ | `required,in:CuratedSetStatus` | `:184-186` notu | `:186` |
| 15 | Yayınlanma Tarihi | `published_at` | date | – | `nullable,date` | – | `:188` |
| 16 | Okuma süresi (dk) | `reading_minutes` | number, min 1 max 60 | ✔ | `required,min:1,max:60` | varsayılan **5** | `:198-201` |
| 17 | Sıra | `sort_order` | number, min 0 max 999 | – | `nullable,min:0,max:999` | varsayılan **0** | `:202-205` |
| 18 | Bağlı Sezon | — | salt okunur rozet, yalnız sezon bağlıysa | – | – | "Sezon bağı admin/sezonlar ekranından yönetilir." | `:206-212` |

**Repeater — Durak satırı** (`:244-274`):
- Görünür alan: **Tarif** (`select.stop-target`, Recipe-only).
- Gizli korunan: `label`, `title[tr]`, `title[en]`, `description[tr]`,
  `description[en]` (5 hidden input, `:259-263`).
- Ekle: `#stopAdd` "Tarif Ekle" (`:152`) · Sil: `.stop-del` çarpı (`:264`)
  · Sırala: SortableJS `handle:'.ie-drag'` (`:279-281`).
- Min/maks: yok. Submit'te tarif seçilmemiş satırlar filtrelenir (`:296`).

---

### 2.3 Sözlük — `rv/admin/sozluk/form.blade.php` (319 satır)

**İskelet:** 2 kolon · **4 sekme** (Temel · İlişkiler · SEO · Editoryal, `:40-45`)
· tek `lang-tabs` dördünü birden sarar (`:52`, `:227`) · sticky publish-sidebar
(`:240-261`, yalnız o kart — Önizleme kutusu kaldırılmış) · kaydet çubuğu `:230-233`.

Bu formun sekme şeridi ortak `.sa-form-tabs` DEĞİL, kendi `.sz-tabs`/`.sz-tab`/
`.sz-panel` idiomu (`:40-45`, JS `:273-280`) — görsel olarak aynı, sınıf adı farklı.

#### Sekme 1 — Temel

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım | Satır |
|---:|---|---|---|:-:|---|---|---|
| 1 | Terim | `term[tr/en]` | text, max 120 | ✔ (tr) | `required,max:120` | ph "Örn. Benmari" | `:61` |
| 2 | Yabancı ad / İngilizce karşılık | `yabanci_ad` | text | – | `nullable,max:180` | (opsiyonel), ph "Örn. bain-marie" | `:64-65` |
| 3 | Kısa karşılık | `short_gloss` | text | – | `nullable,max:160` | "(2–5 kelime)", ph "Örn. temel beyaz sos" | `:68-69` |
| 4 | Kategori | `category_id` | select (glossary_categories, alt kategori `— ` ile girintili) | – | `nullable,exists:glossary_categories,id` | "— Kategori seç —" | `:74-80` |
| 5 | Harf (A-Z) | `harf` | text, maxlength 2 | – | `nullable,max:2` | "Terimden otomatik gelir; istersen düzelt." — JS autofill (`:306-312`) | `:83-85` |
| 6 | Okunuş | `pronunciation` | text | – | `nullable,max:160` | ph "Örn. be-şa-mel" | `:90-91` |
| 7 | Kaynak dil | `source_lang` | text | – | `nullable,max:60` | ph "Örn. Fransızca" | `:94-95` |
| 8 | Köken (ülke/bölge) | `origin_region` | text | – | `nullable,max:120` | ph "Örn. Fransa" | `:100-101` |
| 9 | Özgün yazım (Latin-dışı) | `original_script` | text | – | `nullable,max:180` | ph "Örn. béchamel" | `:104-105` |
| 10 | İkincil etiketler | `secondary_tags` | textarea rows=2, satır-başına-madde | – | `nullable,max:400`; ilk **3** alınır (`GlossaryController:271`) | "en fazla 3, her satır bir etiket" | `:109-110` |
| 11 | Tanım | `definition[tr/en]` | textarea | ✔ (tr) | `required,max:2000` | ph "Terimi tek bir net paragrafla anlat…" | `:120` |
| 12 | Kullanım önerisi / örnek cümle | `example_sentence[tr/en]` | text | – | `nullable,max:400` | "Tekil sayfada «Nerede Kullanılır» bölümünde görünür." | `:124` |

#### Sekme 2 — İlişkiler

| # | Etiket | name | Tip | Kural | Satır |
|---:|---|---|---|---|---|
| 13 | İlgili Tarifler | `recipe_links[i][recipe_id]` + `recipe_links[i][suggested_title]` | **repeater** (2 alan/satır) | `nullable,exists:recipes,id` / `nullable,max:180` | `_recipe_row.blade.php` |
| 14 | İlişkili Terimler | `relations[i][related_term_id]` + `relations[i][relation_type]` | **repeater** (2 select/satır) | `exists:glossary_terms,id` / `in:benzer,turev,malzeme,teknik,karsilastirma` | `_relation_row.blade.php` |
| 15 | Alternatif yazımlar | `alt_spellings` | textarea rows=3, satır-başına | `nullable,max:600` | `:162-163` |
| 16 | Yanlış yazımlar | `misspellings` | textarea rows=3 | `nullable,max:600` — "yalnız arama eşleşmesi" | `:166-167` |
| 17 | Püf noktası sorguları | `tip_queries` | textarea rows=3 | `nullable,max:1000`; ilk **8** alınır (`GlossaryController:274`) | `:171-172` |

Repeater davranışı (`:283-300`): `<template>` klonlama, `__I__` indeks
yer tutucusu; **son satır silinmez, temizlenir** (`:295-296`) — yani her
repeater'da minimum 1 satır garantidir. Ekle düğmeleri `.btn.btn-ghost.btn-sm`
("Tarif satırı ekle" `:141`, "İlişkili terim ekle" `:154`) — bu iki repeater
`.add-row` DEĞİL, ghost buton kullanıyor (formlar arası tek sapma).

#### Sekme 3 — SEO

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 18 | URL slug | `slug` | text | `nullable,max:160` | "boşsa terimden üretilir"; canlı önizleme `/mutfak-sozlugu/<slug>` (`:186`, JS `:309-313`) | `:184-186` |
| 19 | SEO başlığı | `seo_title[tr/en]` | text, max **255** | `nullable,max:255` | "~50–60 karakter" | `:190` |
| 20 | Meta açıklaması | `seo_description[tr/en]` | textarea rows=2, max **400** | `nullable,max:400` | "~140–160 karakter" | `:191` |
| 21 | Anahtar kelimeler | `seo_keywords[tr/en]` | text, max 255 | `nullable,max:255` | ph "beşamel, beyaz sos, meyane" | `:192` |
| 22 | Arama niyeti | `search_intent` | select — Bilgilendirici · Tarif · Karşılaştırma · Sorun Çözme | `nullable,in:SEARCH_INTENTS` | "— Seç —" | `:194-200` |

#### Sekme 4 — Editoryal

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 23 | Kaynaklar | `sources` | textarea rows=3, satır formatı `Etiket \| https://url` | `nullable,max:2000` | ph "Larousse Gastronomique \| https://…" | `:212-213` |
| 24 | Editör notu | `editor_note` | textarea rows=2 | `nullable,max:2000` | "yalnız yönetim" | `:216-217` |
| 25 | Son kontrol tarihi | `last_checked_at` | date | `nullable,date` | – | `:220-221` |

#### Yan kart

| # | Etiket | name | Tip | Seçenekler | Satır |
|---:|---|---|---|---|---|
| 26 | Durum | `durum` | select — **4 seçenek** | Yayında (sözlükte görünür) · İnceleme (kaynak/editör bekliyor) · Güncelleme gerek · Taslak (yalnızca yöneticiler görür) | `:242-249` |
| 27 | Yayınlanma Tarihi | `published_at` | date | – | `:250` |

Varsayılan durum: **`yayinda`** (`GlossaryController:109`) — diğer yedi formda
varsayılan `draft`. Bu formun bilinçli sapması.

---

### 2.4 Sayfalar & SEO — `rv/admin/sayfalar/form.blade.php` (446 satır)

**İskelet:** 2 kolon · 2 sekme (İçerik · SEO) · tek `lang-tabs` · sticky
publish-sidebar · kaydet çubuğu "Değişiklikleri Kaydet".
**Bu formda kapak görseli YOK** (modülde görsel kavramı yok — `:29-30` notu).
Bunun sonucu: SEO skoru 4 kriter (kapak kriteri hiç verilmez).

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım / Not | Satır |
|---:|---|---|---|:-:|---|---|---|
| 0 | (gizli) sayfa tipi | `type` | hidden | – | `sometimes,in:PageType` | – | `:88` |
| 1 | Sayfa başlığı | `baslik[tr/en]` → model `title` | text, max 180 | ✔ (tr) | `required,max:180` | tfield'a `tr-value`/`en-value` elle geçilir (model alanı farklı) | `:116-124` |
| 2 | URL adresi | `slug` | text + `.slug-wrap` ön-ek `{app.url host}/` | ✔ | `required` + benzersizlik | **düzenlemede `readonly`** ("Sabit sayfa — URL değiştirilemez"); "Yalnızca küçük harf, rakam ve tire kullanın." | `:126-133` |
| 3 | İçerik metni | `icerik[tr/en]` → model `body` | richtext (TinyMCE, h=360) | – | `nullable,string` | "Zengin metin editörü — başlık, liste, bağlantı ve tablo desteklenir." | `:135-143` |
| 4 | Hikâye (blok blok) | `body_blocks` (gizli JSON) | **repeater** — yalnız `slug=hakkimizda` | – | `nullable,string` | "Paragraf, alt başlık, alıntı ve ipucu bloklarıyla yaz." | `:147-231` |

**Yalnız `type=seo_landing` sayfalarda** (`:233`; diğer tiplerde kural
`prohibited` — `PageController:208-214`):

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 5 | Giriş cümlesi (lead) | `lead[tr/en]` | textarea, max 300 | `nullable,max:300` | – | `:241` |
| 6 | Hedef anahtar kelime | `target_keyword` | text, max 120 | `nullable,max:120` | – | `:243-244` |
| 7 | Popüler etiketler | `popular_chips_text` | text, max 500 | `nullable,max:500` | "virgülle ayır" | `:247-248` |
| 8 | Facet ön-seçimi (JSON) | `facet_preset_json` | textarea monospace, min-h 100 | `nullable,string` | "RecipeFacetService grup anahtarları — ör. {"cuisine": ["Türk Mutfağı"]}" | `:251-254` |
| 9 | Hızlı bilgiler (JSON) | `quick_facts_json` | textarea monospace, min-h 80 | `nullable,string` | ph `[{"icon":"fa-clock","stat":"15","label":"dk altı tarif"}]` | `:256-259` |
| 10 | Sık Sorulan Sorular (JSON) | `faq_items_json` | textarea monospace, min-h 100 | `nullable,string` | ph `[{"question":"...","answer":"..."}]` | `:261-264` |

**SEO sekmesi** — `x-admin.seo-tab` KULLANILMAZ, alanlar elle basılır (form adı
model alanından farklı, gerekçe `:272-281`):

| # | Etiket | name | Tip | Kural | Satır |
|---:|---|---|---|---|---|
| 11 | SEO Başlığı | `meta_baslik[tr/en]` → `seo_title` | text, max **70** | `nullable,max:70` | `:283-292` |
| 12 | SEO Açıklaması | `meta_aciklama[tr/en]` → `seo_description` | textarea rows=2, max **170** | `nullable,max:170` | `:293-302` |
| 13 | Anahtar kelimeler | `anahtar_kelimeler[tr/en]` → `seo_keywords` | text | `nullable,max:255` | "virgülle ayırın" | `:305-313` |

**Yan kart:**

| # | Etiket | name | Seçenekler | Satır |
|---:|---|---|---|---|
| 14 | Durum | `durum` | **Taslak · Yayında** (2 seçenek) | `:329-331` |
| 15 | Yayınlanma Tarihi | `published_at` | date | `:332` |

Varsayılan durum `published` (`:62`).

**Repeater — Hikâye blokları** (`:147-231`), 4 kind:

| kind | Alanlar | Satır |
|---|---|---|
| `para` | `text` (textarea) + 3 opsiyonel bağlantı slotu (`link-route` + `link-text`), metne `{{link0..2}}` işaretçisi | `:159-180` |
| `heading` | `text` (input) | `:181-192` |
| `quote` | `text` (textarea) + `caption` (Kaynak, opsiyonel) | `:193-205` |
| `tip` | `caption` (Kutu başlığı) + `text` (textarea) | `:206-218` |

Ekle düğmeleri (4 adet, `.add-row`): Paragraf Ekle · Alt Başlık Ekle · Alıntı
Ekle · İpucu Kutusu Ekle (`:223-228`). Sil: `.st-del` çöp kutusu. Sırala:
`.ie-drag` + SortableJS. Varsayılan: 1 boş `para` bloğu (`:55`).

---

### 2.5 Püf Noktaları — `rv/admin/puf-noktalari/form.blade.php` (447) + `_section-card.blade.php` (66)

**İskelet:** 2 kolon · **3 sekme** (İçerik · Bölüm Listesi · SEO, `:106-110`) ·
tek `lang-tabs` üçünü birden sarar (`:119`, `:250`) · sticky publish-sidebar
(`:259-273`) · kaydet çubuğu `:252-255`.

#### Sekme 1 — İçerik

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım | Satır |
|---:|---|---|---|:-:|---|---|---|
| 1 | Kapak Görseli | `cover[media_id]`, `cover[removed]` | image-upload (`tip.cover`) | – | `nullable,exists:media,id` | "Kapak, püf detayının başında görünür." | `:124-131` |
| 2 | Başlık | `title[tr/en]` | text, max **80** | ✔ (tr) | `required,max:80` | – | `:141` |
| 3 | Kategori | `category_taxonomy_id` | select (TipCategory taksonomisi, 9'lu set) | ✔ | `required,exists:taxonomies` | "Public listede kategori chip'ini ve varsayılan kart ikonunu belirler." | `:144-150` |
| 4 | Kart ikonu | `icon` | select — **12 sabit FA ikonu** + "Varsayılan (kategori)" | – | `nullable,max:60` | "Boş bırakılırsa kategori ikonuna döner" | `:153-160`; havuz `TipController:199` |
| 5 | Etiketler | `tags` | text, virgülle ayrılmış | – | `nullable,max:500` | "(virgülle ayırın)" | `:163-165` |
| 6 | Giriş metni | `intro_html[tr/en]` | richtext (TinyMCE, h=**380**) | – | `nullable,max:20000` | "Püfün üst açıklaması — … Kalın, alt başlık, liste ve site içi bağlantı kullanabilirsin." | `:181-188` |

İkon havuzu (`TipController:199`): `fa-bowl-rice`, `fa-cow`, `fa-bread-slice`,
`fa-flask-vial`, `fa-snowflake`, `fa-layer-group`, `fa-cake-candles`, `fa-leaf`,
`fa-drumstick-bite`, `fa-mortar-pestle`, `fa-jar`, `fa-calendar-days`.

#### Sekme 2 — Bölüm Listesi (repeater)

TR ve EN **bağımsız bölüm kümeleri** — iki ayrı liste, iki ayrı ekle düğmesi,
iki ayrı gizli input (`sections[tr]` / `sections[en]`, `:280-281`).
Kart partial'ı: `_section-card.blade.php`.

| # | Etiket | Sınıf/alan | Tip | Yardım | Satır (_section-card) |
|---:|---|---|---|---|---|
| 7 | Bölüm kapağı | `section_cover[i]` (EN'de `section_cover_en[i]`) | image-upload (`tip.section_cover`) | "Bölüm kapağı (opsiyonel)" | `:16-23` |
| 8 | Görsel açıklaması | `.sec-cap` → JSON `caption` | text | "(opsiyonel)" | `:32` |
| 9 | Başlık | `.sec-title` → `title` | text | ph "Bölüm başlığı — örn. Pilavın Tane Tane Olması İçin Ne Yapılmalı?" | `:36-37` |
| 10 | İçerik | `.sec-html` → `html` | richtext (TinyMCE, h=240) | – | `:40-41` |
| 11 | Video URL | `.sec-video` → `video` | url | "(opsiyonel)", ph YouTube | `:44-45` |
| 12 | Alıntı | `.sec-quote` → `quote_text` | textarea rows=2 | "(opsiyonel, imzalı)" | `:48-49` |
| 13 | Alıntı imzası | `.sec-quote-cite` → `quote_cite` | text | ph "— Şef Aylin Demir, DadaGastro Video Mutfağı" | `:51` |
| 14 | Okuyucunun Dikkatine | `.sec-tip` → `tip_text` | textarea rows=2 | "(opsiyonel, uyarı kutusu)" | `:55-56` |
| 15 | Yayında | `.sec-active-input` → `active` | checkbox | kart altında, ayraç üstünde | `:62` |

Kart yerleşimi: `.sec-grid` = `grid-template-columns:210px 1fr` — solda kapak
sütunu, sağda alanlar (`puf-noktalari/form:67`). 720px altında tek kolona düşer
(`:76`). Ekle: `#addSection` (`:218`) / `#addSectionEn` (`:228`).
Sil: `.sec-del`. Sırala: `.ie-drag` + SortableJS. Min/maks: yok.

#### Sekme 3 — SEO

| # | Etiket | name | Tip | Kural | Satır |
|---:|---|---|---|---|---|
| 16 | SEO Başlığı | `seo_title[tr/en]` | text, max 180 | `nullable,max:180` | `:241-247` |
| 17 | SEO Açıklaması | `seo_description[tr/en]` | textarea rows=2, max 320 | `nullable,max:320` | `:241-247` |

#### Yan kart

| # | Etiket | name | Seçenekler | Satır |
|---:|---|---|---|---|
| 18 | Durum | `status` | **Taslak · Yayında · Gizli** (`TipController:197`) | `:262-263` |
| 19 | Yayınlanma Tarihi | `published_at` | date | `:264` |

---

### 2.6 Blog & İçerik — `rv/admin/icerik/form.blade.php` (1250 satır)

**İskelet:** 2 kolon · 2 sekme (İçerik · SEO, `:133-136`) · tek `lang-tabs`
(`:145`, `:616`) · sticky publish-sidebar (`:634-660`) · kaydet çubuğu `:618-621`.

**Bu formun ayırt edici mekaniği: içerik tipine göre koşullu alan grupları.**
`content_type` select'i değişince JS `[data-tip-group]` bloklarını
gösterir/gizler; `[data-tip-body]` varsa serbest gövde editörü tamamen gizlenir
(`:727-742`). Beş tip: `mutfaga-giris`, `puf-noktalari`, `ansiklopedi`,
`sofra-duzeni`, `gurme` (`:683-686`).

#### A. Ortak alanlar (her tipte)

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım | Satır |
|---:|---|---|---|:-:|---|---|---|
| 1 | Kapak Görseli | `cover[media_id]`, `cover[removed]` | image-upload (`content.cover`) | – | `nullable,exists:media,id` | "Kapak, içerik listesinde ve makale başında görünür." | `:153-158` |
| 2 | Başlık | `title[tr/en]` | text, max 180 | ✔ (tr) | `required,max:180` | – | `:165` |
| 3 | URL adresi | `slug` | text + `.slug-wrap` (ön-ek tipe göre canlı değişir) | – | `nullable,max:200,regex,unique` | "Yalnızca küçük harf, rakam ve tire kullanın." | `:167-173` |
| 4 | İçerik tipi | `content_type` | select (ContentType enum) | ✔ | `required,in:routeSegment` | "Tip, makalenin yayınlanacağı bölümü ve URL ön-ekini belirler." | `:176-182` |
| 5 | Kategori | `category_taxonomy_id` | select | – | `nullable,exists:taxonomies,id` | "— Seçilmedi —" | `:185-191` |
| 6 | Etiketler | `tags[tr/en]` | text, virgülle | – | `nullable,max:500` | "Virgülle ayırın — ilgili tariflerde teaser olarak çıkar." | `:194-201` |
| 7 | İçerik Gövdesi | `body_blocks[tr]` / `body_blocks[en]` | **repeater**, 7 kind | – | `nullable,string` | "Makaleyi paragraf, görsel ve videolarla blok blok yaz." | `:439-454` |

#### B. `content_type = mutfaga-giris` → "Ders Künyesi" (`:206-271`)

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 8 | Seviye | `lesson_level` | select — Başlangıç · Orta · İleri | `nullable,max:40` | – | `:211-216` |
| 9 | Süre | `lesson_duration[tr/en]` | text, max 60 | `nullable,max:60` | ph "örn. 12 dk video" | `:218` |
| 10 | İçerik | `lesson_content_summary[tr/en]` | text, max 120 | `nullable,max:120` | ph "örn. 5 bölüm + sınav" | `:221` |
| 11 | Eğitmen (serbest metin) | `lesson_instructor` | text | `nullable,max:120` | "Aşağıda gerçek bir DadaGastro kullanıcısı seçmezsen bu metin görünür." | `:223-225` |
| 12 | Eğitmen (gerçek kullanıcı) | `lesson_instructor_id` | select | `nullable,exists:users,id` | "(opsiyonel — foto + Takip Et için)" | `:230-236` |
| 13 | Video URL | `lesson_video_url` | url | `nullable,url,max:255` | "(opsiyonel)" | `:239-240` |
| 14 | Video süresi (saniye) | `lesson_video_duration_sec` | number, 1–86400 | `nullable,min:1,max:86400` | ph "örn. 760 (=12:40)" | `:245-246` |
| 15 | Önerilen Rota sırası | `rota_position` | number, 1–99 | `nullable,min:1,max:99` | "Boş bırakılırsa rotada yer almaz." | `:249-251` |
| 16 | Ders Bölümleri | `lesson_chapters` (gizli JSON) | **repeater** (`.bd-row`): `dgc-title` + `dgc-dk` (1–600) | `nullable,string` | "Detay sayfasındaki 'Ders İçeriği' kutusu ve 'N bölüm' rozeti bu listeden beslenir." | `:255-269` |

#### C. `content_type = puf-noktalari` → "Püf Kategorisi" (`:276-290`)

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 17 | Kategori | `tip_category_taxonomy_id` | select (TipCategory) | `nullable,exists:taxonomies` | "Püf Noktaları public listesindeki kategori chip filtresi için." | `:280-287` |

#### D. `content_type = ansiklopedi` → "Madde Künyesi + Besin Değeri" (`:293-405`)

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 18 | Latin ad | `latin_name` | text | `nullable,max:120` | ph "örn. Phaseolus vulgaris" | `:298-299` |
| 19 | Kategori | `ingredient_category_taxonomy_id` | select (IngredientCategory) | `nullable,exists` | – | `:302-308` |
| 20 | Mevsim | `season` | text | `nullable,max:80` | ph "örn. Yaz–Sonbahar" | `:313-314` |
| 21 | Kalori | `calories` | text | `nullable,max:60` | ph "örn. 127 kcal / 100g" | `:317-318` |
| 22 | Saklama | `storage_info[tr/en]` | text, max 180 | `nullable,max:180` | ph "örn. 12 ay, serin kuru yer" | `:321` |
| 23 | Kalori etiket notu | `calories_note[tr/en]` | text, max 80 | `nullable,max:80` | "Künyede «Kalori (…)» parantezinde görünür." | `:323` |
| 24 | Saklama etiket notu | `storage_note[tr/en]` | text, max 80 | `nullable,max:80` | "Künyede «Saklama (…)» parantezinde görünür." | `:324` |
| 25 | Özet (giriş paragrafı) | `summary[tr/en]` | richtext (h=220) | `nullable,max:600` | "Detay sayfasında başlığın altında ve «İlgili maddeler» kartlarında görünür." | `:328-335` |
| 26 | Tarifler bölüm başlığı | `related_recipes_title[tr/en]` | text, max 160 | `nullable,max:160` | "Boş bırakılırsa «Madde adı» tarifleri kullanılır." | `:336` |
| 27 | Kısa Bilgi | `quick_facts[tr]`/`[en]` (gizli JSON) | **repeater**: `kb-ico` (canlı ikon önizleme) + `kb-ttl` + `kb-txt` | `nullable,string` | "İkon bir Font Awesome sınıfıdır (örn. fa-clock, fa-fire-burner, fa-rotate)." | `:337-373` |
| 28 | Besin Değeri temeli | `nutrition_basis[tr/en]` | text, max 80 | `nullable,max:80` | "Kutu başlığında parantez içinde görünür; boşsa «100 g»." | `:374` |
| 29 | Besin Değeri | `nutrition_facts[tr]`/`[en]` (gizli JSON) | **repeater**: `bd-lbl` (%42 genişlik) + `bd-val` | `nullable,string` | "(100 g — etiket + değer)" | `:375-403` |

#### E. `content_type = sofra-duzeni` → "Sofra Künyesi" + "Sofra İçeriği" (`:408-575`)

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 30 | Sofra türü | `table_setting_type` | select — 2 optgroup: **Ana Kategoriler (10)** + **Dönemsel Kategoriler (5)** | `nullable,max:80` | kaynak `App\Support\SofraCategories` | `:413-427` |
| 31 | İpucu sayısı | `tip_count` | number, min 0 | `nullable,min:0,max:99` | "Sofra Düzeni indeks kartında 'N ipucu' rozetini … besler." | `:430-434` |
| 32 | Giriş | `table_setting_intro[tr/en]` | richtext (h=220) | `nullable,string` | "Sayfanın başındaki kısa açıklama." | `:462-469` |
| 33 | Kurulum Sihirbazı Adımları | `table_setting_steps[tr]`/`[en]` (gizli JSON) | **repeater** (kartlı) | `nullable,string` | "SVG yerleşim şeması sabit sunum kodudur — adım sayısı/sırası referanstaki (Günlük 6, Misafir 7, Kahvaltı 6, Resmî 7, Ramazan 6, Bayram 6, Çocuklu 5, Açık Büfe 6) ile uyumlu tutulmalı" | `:471-543` |
| 34 | İpucu Listesi | `table_setting_tips[tr]`/`[en]` (gizli JSON) | **repeater** (tek satır, ✓ ikonlu) | `nullable,string` | "(tek cümlelik pratik notlar)" | `:545-573` |

Sofra adımı kartının alt alanları (`:479-510`): `sd-num` (otomatik sıra) ·
`sd-stag` (Etiket, ph "örn. Zemin") · `sd-stitle` (Adım başlığı) ·
adım görseli (`js-pick-shot`, yalnız TR panelinde — EN'e submit'te kopyalanır,
`:496`) · `sd-spara` (TinyMCE h=160) · **iç repeater** `sd-check-item`
(Kontrol maddesi, kendi "Kontrol Maddesi Ekle" düğmesiyle `:508`) ·
`sd-stip` (İpucu kutusu metni, opsiyonel).

#### F. Gövde blok editörü — 7 kind (`rv/admin/icerik/partials/body-blocks-list.blade.php`, 134 satır)

| kind | Etiket | Alanlar | Satır |
|---|---|---|---|
| `para` | Paragraf | `text` (TinyMCE h=220) + disabled "AI ile İyileştir" düğmesi | `:12-22` |
| `img` | Görsel | görsel seçici (`js-pick-shot`) + `caption` ("Görsel açıklaması (opsiyonel)") | `:24-44` |
| `video` | Video | `url` (ph YouTube) — "YouTube veya Vimeo bağlantısı — sayfada oynatıcı olarak gömülür." | `:46-57` |
| `heading` | Alt Başlık | `level` select (**Ana Başlık (H2)** / **Alt Başlık (H3)**) + `text` | `:59-79` |
| `list` | Liste | `items` (textarea, **satır-başına-madde**; bilinçli olarak TinyMCE DEĞİL — `icerik/form:27-31`) | `:84-95` |
| `quote` | Alıntı | `text` (TinyMCE h=180) + `caption` ("Kaynak (opsiyonel — örn. Şef Adı, Unvan)") | `:97-108` |
| `tip` | İpucu Kutusu | `caption` ("Kutu başlığı (örn. Sık yapılan hata)") + `text` (TinyMCE h=180) | `:110-121` |

7 ekle düğmesi (`.add-row`, `:127-133`): Paragraf · Alt Başlık · Liste · Alıntı ·
İpucu Kutusu · Görsel · Video. Sunucu tarafı kind→alan sözleşmesi:
`ContentController:521-527`. TR varsayılanı 1 boş `para` bloğu, **EN varsayılanı
boş dizi** (bilinçli — `icerik/form:59-61`).

#### G. SEO sekmesi

| # | Etiket | name | Tip | Kural | Satır |
|---:|---|---|---|---|---|
| 35 | SEO Başlığı | `seo_title[tr/en]` | text, max 180 | `nullable,max:180` | `:586-592` |
| 36 | SEO Açıklaması | `seo_description[tr/en]` | textarea rows=2, max 320 | `nullable,max:320` | `:586-592` |
| 37 | Anahtar kelimeler | `seo_keywords[tr/en]` | text, max 255 | `nullable,max:255` | `:596-603` |
| — | Arama sonucu önizlemesi | — | salt görsel SERP kutusu (url · başlık · açıklama), canlı JS (`:711-725`) | – | `:604-611` |

#### H. Yan kart

| # | Etiket | name | Tip | Satır |
|---:|---|---|---|---|
| 38 | Durum | `status` | select (`ContentStatus` enum'unun tamamı) | `:636-638` |
| 39 | Yayınlanma Tarihi | `published_at` | date | `:639` |
| 40 | Öne çıkar (vitrin) | `featured` | toggle | `:651-654` |
| 41 | Yorumlara aç | `comments_enabled` | toggle — **yeni kayıtta varsayılan açık** | `:655-658` |

Gizli JSON taşıyıcıları (11 adet, `:668-678`): `body_blocks[tr/en]`,
`nutrition_facts[tr/en]`, `lesson_chapters` (tek — çevrilebilir değil),
`quick_facts[tr/en]`, `table_setting_steps[tr/en]`, `table_setting_tips[tr/en]`.

---

### 2.7 Tarifler — `rv/admin/tarifler/form.blade.php` (1430 satır)

**İskelet:** 2 kolon · 2 sekme (İçerik · SEO, `:131-134`) · tek `lang-tabs`
ikisini birden sarar (`:144`, `:690`) · sağda **4 kart** (publish-sidebar ·
Kaynak · Etiketler · Kaldır) · kaydet çubuğu AYRI bir `.pnl-card` içinde
(`:695-701`) · silme için ayrı `<form id="deleteRecipeForm">` (`:808-814`).

#### İçerik sekmesi

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım / Varsayılan | Satır |
|---:|---|---|---|:-:|---|---|---|
| 1 | Kapak Görseli | `cover[media_id]`, `cover[keep_image_id]` | image-upload (`recipe.cover`) | – | `nullable,exists:media,id` | – | `:157-161` |
| 2 | Galeri | `gallery[*][media_id]`, `[keep_image_id]` | image-upload **multiple, max 8** | – | `nullable,array,max:8` | "Kapak dışındaki tarif görselleri." | `:166-173` |
| 3 | Tarif Başlığı | `title[tr/en]` | text, max 255 | ✔ (tr) | `required,max:255` | ph TR "ör. Fırında Sebzeli Tavuk" / EN "e.g. Baked Chicken with Vegetables" | `:191-200` |
| 4 | Kategoriler | `categories[]` | **ms-field token-input, SIRA ANLAMLI** | ✔ (en az 1) | `nullable,array` + `exists:taxonomies` | "İlk seçtiğiniz kategori birincil kategori olur; sonraki seçimler ikincil kategori olarak eklenir. En az bir kategori seçilmeli." | `:208-221` |
| 5 | Zorluk | `difficulty` | select (Difficulty enum) | ✔ | `required,in:…` | varsayılan `orta`; ipucu: "Seviyeyi işlem sayısı, kullanılan teknik, hazırlık süreci ve ekipman ihtiyacına göre belirle." | `:224-231` |
| 6 | Porsiyon | `servings` | number, min 1 | ✔ | `required,min:1` | **varsayılan 4** | `:234-235` |
| 7 | Hazırlık Süresi (dk) | `prep_time_min` | number **readonly** (`tabindex=-1`) | – | `nullable,min:0` | "Adım sürelerinin toplamından otomatik hesaplanır — elle girilmez." | `:243-246` |
| 8 | Açıklama | `description[tr/en]` | textarea | – | `nullable,string` | ph "Tarif hakkında kısa bir tanıtım…" | `:248-255` |
| 9 | Malzemeler | `ingredients[i][…]` | **repeater** (10 alt alan) | – | bkz. aşağıda | – | `:260-361` |
| 10 | Hazırlanış Adımları | `steps[i][…]` | **repeater** (5 alt alan) | – | bkz. aşağıda | "Her adım tek bir işlemi anlatsın; görsel ve süre eklersen pişirme modunda zamanlayıcıya dönüşür." | `:364-467` |
| 11 | Mutfak | `cuisines[]` | ms-field token-input | – | `nullable,array,exists:taxonomies` | "Birden fazla seçebilirsin; ara ve ekle. Filtre/keşif taksonomisi." | `:471-484` |
| 12 | Beslenme & Tip Etiketleri | `diet_tags[]` | **chip-toggle** (gizli checkbox + `.chip` düğme) | – | `nullable,array,exists:taxonomies` | "Yapısal taksonomi — filtre/keşif için. Serbest etiketler sağ panelde." | `:487-497` |
| 13 | Bütçe | `cost_tier` | select (1/2/3) | ✔ | `required,in:1,2,3` | – | `:507-513` |
| 14 | Porsiyon Birimi | `serving_unit` | select (ServingUnit enum) | ✔ | `required,in:…` | – | `:515-521` |
| 15 | Pişirme Süresi (dk) | `cook_time_min` | number, min 0 | – | `nullable,min:0` | – | `:525-526` |
| 16 | Fırın Derecesi (°C) | `oven_temp_c` | number, min 0 | – | `nullable,min:0` | – | `:529-530` |
| 17 | Yemek Modu | `meal_modes[]` | chip-toggle | – | `nullable,array` | – | `:537-546` |
| 18 | Öğün | `meals[]` | chip-toggle | – | `nullable,array` | – | `:549-558` |
| 19 | Editör Onaylı | `editor_approved` | chip-toggle (checkbox) | – | `nullable,boolean` | – | `:564-566` |
| 20 | Diyetisyen Onaylı | `dietitian_reviewed` | chip-toggle | – | `nullable,boolean` | – | `:568-570` |
| 21 | Şefin Seçimi | `chefs_choice` | chip-toggle | – | `nullable,boolean` | – | `:572-574` |
| 22 | Besin Değerleri (1 porsiyon) | `nutrition[…]` | 8 sayı alanı | – | bkz. aşağıda | – | `:579-597` |
| 23 | Video URL | `video_url` | text | – | `nullable,url,max:2048` | ph `https://…` | `:609` |
| 24 | Video Süresi (sn) | `video_duration_sec` | number, min 0 | – | `nullable,min:0` | – | `:610` |
| 25 | Ses (Audio) URL | `audio_url` | text | – | `nullable,url,max:2048` | ph `https://…` | `:615` |
| 26 | Ses Süresi (sn) | `audio_duration_sec` | number, min 0 | – | `nullable,min:0` | – | `:616` |
| 27 | Not Başlığı | `editor_note_label` | text | – | `nullable,max:120` | ph "ör. En Sık Yapılan Hata" | `:625-626` |
| 28 | Not Metni | `editor_note[tr/en]` | textarea | – | `nullable,string` | ph "Public tarif sayfasında imzalı editör kutusunda gösterilir…" | `:628-635` |
| 29 | Hatırlatma Notu | `remind_text[tr/en]` | textarea (etiketsiz) | – | `nullable,string` | ph "ör. Fırını önceden ısıtmayı unutmayın…" | `:641-647` |
| 30 | İlişkili Tarifler (Alternatif) | `related_recipe_ids[]` | ms-field, **max 3** | – | `nullable,array,max:3` | "En fazla 3 tarif seçin." | `:654-672` |

**Besin Değerleri alt alanları** (`:583-594`) — hepsi `nullable`:
`nutrition[calories]` (integer) · `nutrition[protein_g]` · `nutrition[carbs_g]` ·
`nutrition[fat_g]` · `nutrition[fiber_g]` · `nutrition[sugar_g]` ·
`nutrition[sodium_mg]` · `nutrition[saturated_fat_g]`
(son 7'si `numeric`, `step="0.1"`, `min="0"`).

**Repeater — Malzeme satırı** (`:283-320`, JS klonu `:910-925`):

| Alt alan | name | Tip | Kural |
|---|---|---|---|
| Grup adı | `ingredients[i][group_name][tr/en]` | text (yalnız grup satırında) | `nullable,max:120` |
| Miktar | `ingredients[i][amount]` | text | `nullable,numeric,min:0` |
| Birim | `ingredients[i][unit]` | select (MeasurementUnit enum) | `nullable,in:…` |
| Malzeme adı | `ingredients[i][name]` | text | `nullable,max:190` |
| Not | `ingredients[i][note][tr/en]` | text, ph "Not (ör. elenmiş)" | `nullable,max:190` |
| İkame önerileri | `ingredients[i][substitutes][tr/en]` | text, "virgülle ayır" | `nullable,string` |
| Sponsorlu | `ingredients[i][is_sponsored]` | toggle | `nullable,boolean` |
| Sponsor markası | `ingredients[i][sponsor_name]` | text | `nullable,max:120` |
| Fiyat | `ingredients[i][sponsor_price]` | text, ph "Fiyat (ör. 149 ₺)" | `nullable,max:60` |
| Sipariş bağlantısı | `ingredients[i][sponsor_url]` | url | `nullable,url,max:2048` |

İki ekle düğmesi: **"Satır Ekle"** (`#addRow`) ve **"Grup Ekle"**
(`#addGroup`, `.add-row.alt`) — `:359-360`.

**Repeater — Hazırlanış adımı** (`:372-420`):

| Alt alan | name | Tip | Kural |
|---|---|---|---|
| Adım başlığı | `steps[i][title][tr/en]` | text, "(opsiyonel)" | `nullable,max:190` |
| Adım metni | `steps[i][body][tr/en]` | richtext (TinyMCE h=200) | `nullable,string` |
| Adım görselleri | `steps[i][images][…][media_id]` / `[keep_image_id]` | çoklu görsel, **max 3** (`data-max="3"`, sayaç `n/3`) | `nullable,array,max:3` |
| Süre | `steps[i][duration_min]` | number + "dk" sonek | `nullable,min:0` |
| Pasif adım | `steps[i][is_passive]` | toggle — "fırın/kaynama/dinlenme; kendi kendine ilerler" | `nullable,boolean` |

Ekle: `#addStep` "Adım Ekle" (`:466`). Kartta ayrıca **disabled** "AI önerisi"
şeridi var (`:398`) — referans mock kalıntısı, işlevsiz.

#### SEO sekmesi

| # | Etiket | name | Tip | Kural | Satır |
|---:|---|---|---|---|---|
| 31 | SEO Başlığı | `seo_title[tr/en]` | text, max 180 | `nullable,max:180` | `:682-687` |
| 32 | SEO Açıklaması | `seo_description[tr/en]` | textarea rows=2, max 320 | `nullable,max:320` | `:682-687` |

#### Yan kart (4 kart)

| # | Etiket | name | Tip | Satır |
|---:|---|---|---|---|
| 33 | Durum | `status` | select — Taslak · Yayında · Gizli | `:724-725` |
| 34 | Yayınlanma Tarihi | `published_at` | date | `:726` |
| 35 | Öne Çıkar (vitrin) | `is_featured` | toggle | `:734-741` |
| 36 | Yorumlara Aç | `comments_enabled` | toggle — yeni kayıtta varsayılan açık | `:742-749` |
| 37 | Sadece Abonelere Özel | `subscribers_only` | toggle | `:750-757` |
| — | **Kaynak** kartı | — | salt okunur: "Admin · Editöryel" rozeti + açıklama | `:761-771` |
| 38 | Etiketler | `tags_text` | text, virgülle ayrılmış | `:774-782` |
| — | **Tarifi Kaldır** kartı | — | yalnız düzenlemede; ayrı `deleteRecipeForm`'a bağlı | `:797-801` |

**Not:** Kaydet çubuğunda "Kaydet" düğmesi YOK — **Taslak Kaydet** ve
**Yayınla** iki ayrı düğme (`:698-699`), ikisi de `type="button"`; JS `status`
alanını ayarlayıp formu gönderiyor.

---

### 2.8 Mutfağa Giriş (Ders) — `rv/admin/mutfaga-giris/form.blade.php` (787) + 3 sekme partial'ı

Gastro'daki **en zengin** form. İskelet: 2 kolon · **3 sekme** (İçerik ·
Ders Akışı · SEO, `:327-331`) · tek `lang-tabs` üçünü sarar (`:333`, `:347`) ·
sağda publish-sidebar + **Yayın Eşiği** kartı · kaydet çubuğu `:349-352`.

Partial'lar: `partials/_tab-icerik.blade.php` (455) ·
`partials/_tab-ders-akisi.blade.php` (561) · `partials/_tab-seo.blade.php` (38) ·
`_ms-field` (40) · `_step-card` (54) · `_quiz-question` (52) ·
`_body-blocks-list` (176).

#### Sekme 1 — İçerik (`_tab-icerik.blade.php`)

| # | Etiket | name | Tip | Zorunlu | Kural | Yardım | Satır |
|---:|---|---|---|:-:|---|---|---|
| 1 | Kapak Görseli | `cover[media_id]`, `[removed]` | image-upload | – | `nullable,exists:media,id` | – | `:28-33` |
| 2 | Ders Adı | `title[tr/en]` | text, max 180 | ✔ (tr) | `required,max:180` | – | `:40` |
| 3 | URL Kısa Adı | `slug` | text + slug-wrap | – | `nullable,max:200,regex,unique` | "boş bırakılırsa ders adından türetilir" | `:46-52` |
| 4 | Kısa Açıklama | `summary[tr/en]` | textarea rows=2, max 600 | – | `nullable,max:600` | "Ders kartında ve detay sayfası girişinde görünür." | `:55` |
| 5 | Ana Konu | `primary_topic_id` | select | ✔ (kırmızı `*`) | `required,exists:taxonomies,id` | "Her ders tam olarak bir ana konuya bağlanmalıdır." | `:58-66` |
| 6 | İkincil Konular | `topic_ids[]` | ms-field (`tur=konu`) | – | `nullable,array` | "(en fazla birkaç — ana konu burada seçilemez)" | `:73-81` |
| 7 | Seviye | `lesson_level` | select | – | `nullable,max:40` | "Seç…" | `:85-90` |
| 8 | Tahmini Süre (dk) | `lesson_duration_min` | number, 1–600 | – | `nullable,min:1,max:600` | – | `:95-97` |
| 9 | Eğitmen (serbest metin) | `lesson_instructor` | text, max 120 | – | `nullable,max:120` | "Aşağıda gerçek bir DadaGastro kullanıcısı seçmezsen bu metin görünür." | `:104-106` |
| 10 | Eğitmen (gerçek kullanıcı) | `lesson_instructor_id` | select | – | `nullable,exists:users,id` | "(opsiyonel — foto + Takip Et için)" | `:110-115` |
| 11 | Editör | `lesson_editor_id` | select | – | `nullable,exists:users,id` | "Yok" | `:120-125` |
| 12 | Etiketler | `tags[tr/en]` | text, virgülle | – | `nullable,max:500` | "Virgülle ayırın — ders aramasında da eşleşir." | `:132-139` |
| — | **Dersin Amacı** | — | ⚠ **BOŞ BÖLÜM** — yalnız `form-sec-tt` başlığı var, içinde hiç alan yok | – | – | – | `:145-147` |
| 13 | Öğrenme Çıktıları | `lesson_outcomes[tr]`/`[en]` (gizli JSON) | **repeater** (`.bd-row`, tek metin) | – | `nullable,string` | "Ölçülebilir fiillerle yaz — «... öğrenecek» değil, «... ayırt edebilecek». Yayın eşiği için **en az 3 çıktı** gerekir." | `:149-177` |
| 14 | Ön Koşullar | `prerequisite_ids[]` | ms-field (`tur=ders`, `haric=$content->id`) | – | `nullable,array,exists:contents,id` | "Bu dersten önce tamamlanması önerilen dersler." | `:179-191` |
| 15 | Kazandırılan Beceriler | `skill_ids[]` | ms-field (`tur=beceri`) | – | `nullable,array,exists:skills,id` | – | `:194-203` |
| 16 | Sonraki Önerilen Ders | `next_lesson_id` | select | – | `nullable,exists:contents,id` | "Yok" | `:209-215` |
| 17 | Başlangıç Rotasındaki Sırası | `rota_position` | number, 1–99 | – | `nullable,min:1,max:99` | "Her adım numarası derslerde BENZERSİZ olmalı"; ph "1-12 arası — boşsa serbest keşif dersidir" | `:219-222` |
| 18 | Gerekli Ekipmanlar | `lesson_equipment` (gizli JSON, `required` dizisi) | **repeater** (`.bd-row`) | – | `equipmentRule()` | – | `:230-238` |
| 19 | İsteğe Bağlı Ekipmanlar | `lesson_equipment` (`optional`) | **repeater** | – | " | – | `:240-248` |
| 20 | Alternatif Ekipmanlar | `lesson_equipment` (`alternatives`) | **repeater** | – | " | "örn. «Termometre yoksa: kesitten renk kontrolü»" | `:250-259` |
| 21 | İlgili Tarifler | `recipe_ids[]` | ms-field (`tur=tarif`) | – | `nullable,array,exists:recipes,id` | "Kullanıcının öğrendiği tekniği uygulayabileceği tarifler." | `:264-274` |
| 22 | İlgili Püf Noktaları | `tip_ids[]` | ms-field (`tur=puf`) | – | `nullable,array,exists:tips,id` | – | `:277-286` |
| 23 | Bilgi Kaynağı Notu | `lesson_mentor_source` | richtext (TinyMCE h=180, tek dilli) | – | `nullable,max:2000` | "Dada Mentor bu dersle ilgili sorularda hangi kaynağa/notlara referans versin." | `:292-294` |
| 24 | Ders Erişimi | `lesson_access` | select (LessonAccess enum) | ✔ | `required,in:…` | varsayılan `free`; üstünde koşullu güvenlik-tabanı uyarısı (`:310-313`) | `:317-323` |
| 25 | Ücretsiz ön izleme | `lesson_free_preview` | toggle | – | `nullable,boolean` | – | `:326-329` |
| 26 | Şef kontrolü | `lesson_qa[chef]` | toggle | – | `nullable,boolean` | – | `:339-342` |
| 27 | Editör kontrolü | `lesson_qa[editor]` | toggle | – | `nullable,boolean` | – | `:343-346` |
| 28 | Gıda güvenliği kontrolü | `lesson_qa[food_safety]` | toggle | – | `nullable,boolean` | – | `:347-350` |
| 29 | Video kontrolü | `lesson_qa[video]` | toggle | – | `nullable,boolean` | – | `:351-354` |
| 30 | Teknik kontrol | `lesson_qa[technical]` | toggle | – | `nullable,boolean` | – | `:355-358` |
| 31 | Son Test Tarihi | `lesson_qa[last_tested_at]` | date | – | `nullable,date` | yanında "Son güncelleme: …" bilgisi | `:363-367` |

#### Sekme 2 — Ders Akışı (`_tab-ders-akisi.blade.php`)

| # | Etiket | name | Tip | Kural | Yardım | Satır |
|---:|---|---|---|---|---|---|
| 32 | Video Bağlantısı | `lesson_video_url` | url | `nullable,url,max:255` | ph `https://...` | `:25-27` |
| 33 | Video Dosyası | `lesson_video_media_id` | özel yükleme alanı (ilerleme çubuğu + format uyarısı + hata satırı) | `nullable,exists:media,id` | – | `:67-124` |
| 34 | Video Süresi | `lesson_video_duration_sec` | **hidden** + salt okunur etiket | `nullable,min:1,max:86400` | "Video yüklenince otomatik okunur" | `:39-43` |
| 35 | Video Bölümleri | `lesson_chapters` (gizli JSON) | **repeater** (`.bd-row`, yalnız `dgc-title`) | `jsonListRule(title max 200, duration_min 1-600)`, **max 50 satır** (`LessonController:520`) | "Yalnız başlık yaz — başlangıç dakikaları video süresinden otomatik hesaplanır. Bölüm başlıkları, gövdedeki alt başlıklarla AYNI sırada olmalı (çapa eşleşmesi)." | `:130-141` |
| 36 | Yazılı Anlatım | `body_blocks[tr]`/`[en]` | **repeater** (`_body-blocks-list`, 176 satır — ders formunun kendi kopyası) | `nullable,string` | "Alt başlık/paragraf/alıntı/ipucu/görsel bloklarıyla yaz." | `:147-155` |
| 37 | Adım Adım Teknik | `lesson_steps` (gizli JSON) | **repeater** (`_step-card`) | `jsonListRule(...)` | "Her adım: başlık, açıklama, süre, ısı seviyesi, zaman kodu, görsel, doğru sonuç, hata uyarısı, güvenlik uyarısı. **Yayın eşiği için en az 3 adım** gerekir." | `:159-166` |
| 38 | Doğru Sonuç Nasıl Görünür? | `lesson_success_criteria[…]` | **6 sabit metin alanı** | her biri `nullable,max:200` | "En az 3 dolu alan yayın eşiğini besler. Gıda güvenliği gerektiren derslerde sıcaklık ZORUNLU ve gerçek olmalı." | `:170-179` |
| 39 | Sık Yapılan Hatalar | `lesson_mistakes` (gizli JSON) | **repeater** (4 alan/kart) | `what max200 · why/prevent/fix max1000` | "**Yayın eşiği için en az 3 hata** gerekir." | `:183-200` |
| 40 | Güvenlik Uyarıları | `lesson_safety_notes[tr]`/`[en]` (gizli JSON) | **repeater** (`.bd-row`) | `nullable,string` | – | `:204-228` |
| 41 | Uygulama Görevi | `lesson_task[title/body/duration_min/ingredients]` | 3 alan + 1 iç repeater | `title max200 · body max2000 · duration_min 1-600` | ph "örn. Bir kabak sotele" | `:234-257` |
| 42 | Mini Test | `lesson_quiz` (gizli JSON) | **repeater** (`_quiz-question`) + `Geçme Puanı (%)` | `quizRule()` | "3-5 soru önerilir. Her sorunun cevap açıklaması zorunludur." | `:261-273` |
| 43 | Kapanış Özeti | `lesson_recap[tr/en]` | textarea rows=2 | `nullable,string` | "2-3 cümlelik kapanış özeti." | `:278` |

**`lesson_success_criteria` alt alanları** (`:172-177`): `color` (Renk) ·
`texture` (Doku) · `consistency` (Kıvam) · `sound` (Ses) · `smell` (Koku) ·
`temperature` (Güvenli İç Sıcaklık, ph "örn. Tavuk iç sıcaklığı 74°C").

**`_step-card` alt alanları** (9 adet, `_step-card:30-47`): Başlık (`s-title`,
ph "örn. Tavayı Isıt") · Süre (dk) (`s-duration`, 0–600) · Isı Seviyesi
(`s-heat`, ph "örn. Orta-yüksek") · Zaman Kodu (`s-timecode`, ph "örn. 01:20",
"Yalnız ders videosu varsa bağlantıya dönüşür.") · Adım Görseli (image-upload) ·
Uygulama Açıklaması (`s-body`, textarea rows=2) · Doğru Sonuç Kriteri
(`s-success`) · Hata Uyarısı (`s-mistake`) · Güvenlik Uyarısı (`s-safety`).

**`_quiz-question` alt alanları** (`_quiz-question:16-46`): Soru Tipi
(`q-type` select — **Tek seçimli** / **Doğru/Yanlış**) · Soru Metni (`q-text`
textarea) · Seçenekler (`q-opt` iç repeater + "Seçenek Ekle") · Doğru Seçenek No
(1-tabanlı) (`q-answer-idx`, yalnız `single`) · Doğru Cevap (`q-tf-answer`
select Doğru/Yanlış, yalnız `truefalse`) · Cevap Açıklaması (`q-explanation`
textarea).

**`lesson_mistakes` alt alanları** (`:190-193`): Hata (`m-what`) · Neden Oluşur
(`m-why`) · Nasıl Önlenir (`m-prevent`) · Nasıl Düzeltilir (`m-fix`).

#### Sekme 3 — SEO (`_tab-seo.blade.php`, 38 satır)

| # | Etiket | name | Tip | Kural | Satır |
|---:|---|---|---|---|---|
| 44 | SEO Başlığı | `seo_title[tr/en]` | text, max 180 | `nullable,max:180` | `:9-15` |
| 45 | SEO Açıklaması | `seo_description[tr/en]` | textarea rows=2, max 320 | `nullable,max:320` | `:9-15` |
| 46 | Ana + Yardımcı Anahtar Kelimeler | `seo_keywords[tr/en]` | text, max 255 | `nullable,max:255` | "İlk terim ana anahtar kelime sayılır; virgülle ayırarak yardımcı kelimeleri ekle." | `:19-28` |

Ayrıca kuralda tanımlı ama formda **input'u olmayan** alanlar:
`seo_social_title` / `seo_social_description` (`LessonController:588-589`).
`seo_ai_summary` bilinçli olarak kaldırılmış (`_tab-seo:30-37` gerekçesi).

#### Yan kart

| # | Etiket | name | Tip | Satır |
|---:|---|---|---|---|
| 47 | Durum | `status` | select (ContentStatus enum) | `:364-366` |
| 48 | Yayınlanma Tarihi | `published_at` | date | `:367` |
| — | **Yayın Eşiği** kartı | — | salt okunur: "Yayına hazır / Eksik" + 4 kriter (Gövde/Adım · Öğrenme Çıktıları · Doğru Sonuç Kriteri · Uygulama Görevi) | `:381-391` |

Gizli JSON taşıyıcıları (12 adet, `:397-408`).

---

## 3. FIT'E TAŞIMA — modül eşlemesi

Fit'in altı modülü aşağıdaki Gastro şablonlarına oturur. Sütunlar: hangi
Gastro formunun **iskeletini** alacağı, kaç sekme, hangi repeater tipi.

| Fit modülü | Gastro şablonu | Sekmeler | Ana repeater | Yan kart kriteri |
|---|---|---|---|---|
| **Hareket** (tekil egzersiz) | Tarifler (adım/malzeme repeater'lı) | İçerik · SEO | `.st-card` (adım/varyasyon) + chip-toggle (kas grubu, ekipman) | 5 kriter (kapak var) |
| **Program** (çok haftalı) | Mutfağa Giriş (Ders) | İçerik · Program Akışı · SEO | `.st-card` (hafta → gün → set) + ms-field (hareket seçici) | 5 kriter + **Yayın Eşiği** kartı |
| **Challenge** | Koleksiyonlar | İçerik · SEO | Durak repeater'ının aynısı (sıralı gün/görev listesi) | 5 kriter |
| **Test** (fitness ölçüm) | Mutfağa Giriş'in Mini Test bloğu + Sözlük iskeleti | Temel · Sorular · SEO | `_quiz-question` deseni | 4 kriter (kapak yoksa) |
| **Hareket Rehberi** (editöryel yazı) | Püf Noktaları | İçerik · Bölüm Listesi · SEO | `_section-card` deseni | 4 kriter |
| **Spor Sözlüğü** | Sözlük | Temel · İlişkiler · SEO · Editoryal | `_recipe_row` / `_relation_row` deseni | 4 kriter |

### 3.1 Fit'te mutlaka olması gerekenler (Gastro'da sekiz formda da var)

1. `form-layout` 2 kolon + sticky sağ kart (mobilde `position:static`).
2. Kapak görseli **en üstte**, künyeden önce.
3. Künye sırası: Başlık → URL adresi (slug-wrap ön-ekli) → Tip/Kategori → Etiketler.
4. Yayın yan kartı: Durum → Yayınlanma Tarihi → modüle özel toggle'lar → SEO Skoru.
5. Ayrı SEO sekmesi (inline SEO bölümü YOK).
6. Üstte toplu hata şeridi + alan altında `@error` metni.
7. Kaydet çubuğu sol kolonun altında, sağa yaslı, İptal (ghost) solda.
8. Repeater'da her satırda `.ie-drag` (sürükle) + `.ie-del` (sil), altında `.add-row`.

### 3.2 Fit'te ölçülen eksikler (Gastro'da olup Fit maketinde olmayan)

Bunlar bu ölçümün doğrudan çıktısı değil, karşılaştırma için not:
Fit formlarının yeniden çizimi sırasında **her modül için** yukarıdaki 8
maddenin tamamının bulunması aranmalı; bir madde yoksa gerekçesi
`KARARLAR.md`'ye yazılmalı (Gastro'da her sapmanın blade başında gerekçesi var —
ör. Sayfalar'da kapak yokluğu `sayfalar/form:29-30`).

### 3.3 Fit'e taşınırken dikkat

- **Dil sekmesi (TR/EN):** Gastro'nun `lang-tabs` + `tfield` ikilisi
  `name[tr]`/`name[en]` bracket'ına dayanır. Fit maketinde backend yok; maket
  düzeyinde sekme şeridi çizilebilir ama alan adlandırması backend doğduğunda
  aynı sözleşmeyi taşımalı.
- **Repeater'lar gizli JSON'a serialize ediliyor** — bu yüzden alan-altı `@error`
  basılamıyor. Ders formu bunu üstte tam hata listesi basarak çözmüş
  (`mutfaga-giris/form:311-315`). Fit'te repeater kullanılacaksa aynı çözüm
  alınmalı.
- **Karakter sayacı yok**, `maxlength` var. Fit'te sayaç eklenecekse bu bilinçli
  bir sapma olur — Gastro'da "sticky tutarlılık sweep" ile kaldırılmış
  (`sayfalar/form:33-36`).
- **SEO skoru statik/canlı ayrımı:** başlık/açıklama/anahtar kelime canlı,
  slug ve kapak statik (sunucu render anı). Fit'te kapak canlı istenirse bu
  bileşenin sınırı aşılmalı (`publish-sidebar:20-24`).

---

## 4. Ölçüm dışı kalanlar (dürüstlük notu)

- `public/reference/admin-tarifler/sa-tarifler-form.css` (15506 B) ve
  `sa-sayfalar-form.css` (7636 B) dosyalarının **tamamı okunmadı**; form kiti
  selektörleri `sa-icerik-form.css`ten alındı çünkü üçü de aynı primitifleri
  (`.form-layout/.form-sec/.frow/.finput/.st-card/.chip/.toggle`) tanımlıyor —
  `sa-ui.css:209-211` bu 34 ortak selektörü açıkça sayıyor. Üç dosya arasında
  değer farkı olup olmadığı ölçülmedi.
- Controller `rules()` çıktıları grep ile alındı; koşullu kural üreten
  yardımcılar (`LessonController::jsonListRule()`, `quizRule()`,
  `equipmentRule()`) çağrı satırıyla belirtildi, gövdeleri açılmadı.
- `image-upload.blade.php` (27494 B) ve `video-upload.blade.php` (14014 B)
  bileşenlerinin yalnız `@props` sözleşmesi ölçüldü, JS akışı değil.
