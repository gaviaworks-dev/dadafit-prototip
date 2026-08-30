# Gastro Yönetim Paneli — Ortak Bileşen Ölçümü

**Ölçüm tarihi:** 2026-08-30
**Kaynak depo (SALT OKUMA):** `/Users/gaviaworks/Developer/Backend Projects/dadagastro-profil`
**Amaç:** DadaFit yönetim paneli maketini kuracak ajanların bileşen sözleşmesi.
Bu belge yalnız **ölçülmüş** değer içerir; her sayı `dosya:satır` ile işaretlidir.

Aşağıdaki tüm yollar Gastro deposuna görelidir.

---

## 0. Kabuk ve yükleme zinciri (bağlam)

`resources/views/admin/layout.blade.php` — 508 satır. Bileşen katmanı bu dosyadan
yüklenir; Fit tarafında karşılığı kurulurken **sıra korunmalıdır**.

**CSS (head, sırayla)** — `layout.blade.php:32-47`:

| # | Dosya | Satır | Not |
|---|---|---|---|
| 1 | `fontawesome/css/all.min.css` | :32 | ikon ailesi (self-host, Fit'te CDN 6.5.2) |
| 2 | `reference/admin/sa-shell.css` | :33 | kabuk (26.166 B) |
| 3 | `reference/admin/sa-rail.css` | :36 | ikon rayı (5.100 B) |
| 4 | `reference/admin/sa-ui.css` | :37 | **ortak UI primitifleri (20.871 B)** |
| 5 | `reference/admin/sa-list.css` | :38 | liste kiti (505 B) |
| 6 | `vendor/cropperjs/cropper.min.css` | :42 | Cropper.js v1.6.2 |
| 7 | `css/admin-lang-tabs.css` | :46 | dil sekmesi kiti (2.558 B) |
| 8 | `@vite([tokens.css, admin.css, app.js, sa.js])` | :47 | geçiş katmanı, reference'ın ÜZERİNE biner |
| 9 | `@stack('styles')` | :69 | ekran-özel CSS |

**JS (body sonu, sırayla)** — `layout.blade.php:490-506`:

| # | Dosya | Satır | İçerik |
|---|---|---|---|
| 1 | `reference/admin/sa-shell-ui.js` | :490 | mobil drawer + divider grip (4.339 B) |
| 2 | `reference/admin/sa-ui.js` | :491 | **saToast · saConfirm · yıkıcı-aksiyon delegesi · hesap menüsü** (10.043 B) |
| 3 | `reference/admin/sa-chcnt.js` | :492 | filtre çip sayaç formatlayıcı (1.919 B) |
| 4 | `vendor/cropperjs/cropper.min.js` | :496 | kırpma motoru |
| 5 | `js/admin-crop.js` | :497 | kırpma modalı sürücüsü (11.679 B) |
| 6 | `vendor/tinymce/tinymce.min.js` | :502 | TinyMCE 7.9.3 |
| 7 | `vendor/tinymce-config.js` | :503 | merkezi editör config (158 satır) |
| 8 | `@stack('scripts')` | :506 | ekran-özel JS |

**Merkezi meta değerleri** (hardcode yasağı burada uygulanıyor):

- `<meta name="csrf-token">` — `layout.blade.php:21`
- `<meta name="media-max-size">` — `layout.blade.php:24`, değeri
  `MediaService::MAX_SIZE_BYTES` = `15 * 1024 * 1024` (**15 MB**),
  kaynak `app/Domain/Media/Services/MediaService.php:35`
- `<meta name="crop-oversize-msg">` — `layout.blade.php:29`, kırpma çıktısı
  limiti aşınca gösterilen şablon metin (`:size` JS'te doldurulur)

> **Fit için:** buildless prototipte `@vite`/`asset()` yok; bu üç meta'nın
> karşılığı sabit `<meta>` olarak yazılır ve JS oradan okur. Değeri koda gömme
> deseni Gastro'da bilinçli olarak yasaklı (K13 ile aynı ruh).

---

## 1. Görsel kütüphanesi / medya yöneticisi

### 1.1 Merkezi medya kütüphanesi — **YOK**

- grep `media-library|MediaLibrary|media\.index` → **0 isabet** (`resources/views/admin`, `routes/web.php`)
- grep "mevcut medyadan seç" / medya tarayıcı modalı → **0 isabet**
- `resources/views/components/` altında medya seçici bileşen **yok**
  (37 bileşen listelendi; medya ile ilgili olanlar yalnız `admin/image-upload`,
  `admin/image-upload-lock`, `admin/video-upload`)

**Gastro'da medya "kütüphane" olarak yönetilmez.** Her görsel, ait olduğu
formun içinden yüklenir; yüklenen dosya doğrudan o kayda bağlanır. Yeniden
kullanım, klasörleme, arama, alt metin arayüzü **yoktur**.

- **Alt metin:** grep `alt_text|alt-text|'alt'` (`app/Domain/Media`,
  `resources/views/components/admin`, media migration'ları) → **0 isabet**.
  Medya kaydında alt metin alanı yok.
- **Klasörleme:** yok. Medya `mediable_type` / `mediable_id` polimorfik
  bağıyla sahibine iliştirilir (`admin/moderasyon/medya/index.blade.php:37`).

**Var olan tek medya *ekranı*:** `admin/moderasyon/medya/index.blade.php`
(60 satır) — bir yönetim aracı değil, **NSFW kuyruğu**: işaretli görselleri
grid'de gösterir, iki eylem sunar (Güvenli / Sil).
Markup iskeleti (`:34-48`):

```html
<div class="mod-grid">
  <div class="mod-media">
    <div class="mod-thumb" style="background-image:url('…')" role="img" aria-label="İşaretli medya"></div>
    <div class="mod-media__ctx">Bağlam: Recipe #128</div>
    <div class="mod-media__acts">
      <form method="POST" action="…/guvenli"><button class="btn btn-ghost btn-sm"><i class="fa-solid fa-shield-halved"></i> Güvenli</button></form>
      <form method="POST" action="…/sil"><button class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i> Sil</button></form>
    </div>
  </div>
</div>
```

> **Fit'e not:** Fit'te bir medya kütüphanesi gerekiyorsa **Gastro'da yok,
> üstüne inşa edilecek.** Gastro'nun devrettiği şey yükleme *alanı*dır,
> kütüphane değil.

### 1.2 Yükleme alanı — `<x-admin.image-upload>` (kanon bileşen)

**Dosya:** `resources/views/components/admin/image-upload.blade.php`
**Kullanım:** 33 çağrı / 18 blade (`grep -rn "x-admin.image-upload" resources/views` → 33;
`grep -rl` → 19 dosya, biri bileşenin kendi lock partial'ı).

Çağıran ekranlar: `ayarlar/index`, `bnp-modlari/form`, `icerik/form`,
`kisa-videolar/form`, `koleksiyonlar/form`, `kreatifler/form`,
`mutfaga-giris/partials/_step-card`, `_tab-ders-akisi`, `_tab-icerik`,
`puf-noktalari/_section-card`, `puf-noktalari/form`, `sayfa-tanimlari/edit`,
`sezonlar/form`, `sponsorlar/form`, `taksonomi/index`, `tarifler/form`,
`video-serileri/form`, `videolar/form`.

**Modal değil, sayfa değil — form içine gömülü bir alan.**

#### Prop'lar (`:57-68`)

| Prop | Varsayılan | Anlam |
|---|---|---|
| `name` | — | hidden alan adı öneki |
| `current` | null | tekli: `['id','url']` · çoklu: bunların listesi |
| `multiple` | false | galeri modu |
| `max` | 8 | çoklu modda azami görsel |
| `label` | null | `.form-sec-tt` başlığı |
| `icon` | `fa-image` | boş durum ikonu |
| `hint` | null | alan altı `.fhint` |
| `field` | null | `config/admin_images.php` anahtarı → aspect/suggest/crop |
| `endpoint` | null | yükleme ucu (boşsa `route('admin.media.store')`) |
| `sortable` | false | çoklu modda sürükle-sırala |
| `acceptPdf` | false | `application/pdf` kabul |

#### Gizli alan sözleşmesi (tekli mod, `:130-132`)

```html
<input type="hidden" name="{name}[media_id]"      class="iu-media-id"  value="">
<input type="hidden" name="{name}[keep_image_id]" class="iu-keep-id"   value="{mevcut id}">
<input type="hidden" name="{name}[removed]"       class="iu-removed"   value="0">
```

Üçlü mantık (`:13-24` yorumu): `media_id` doluysa yeni değer · `removed=1` ise
null · ikisi de yoksa mevcut korunur.

#### Markup iskeleti — TEKLİ

```html
<div class="admin-upload" id="iu-XXXXXXXX" data-upload-root data-mode="single"
     data-name="cover" data-max="1" data-icon="fa-image"
     data-media-url="/admin/medya" data-crop-aspect="16:10" data-crop-enabled="1"
     data-sortable="0">
  <div class="form-sec-tt"><i class="fa-solid fa-image"></i> Kapak Görseli</div>

  <div class="img-upload-zone" data-drop-zone role="button" tabindex="0" aria-label="Kapak Görseli">
    <!-- doluysa -->
    <div class="img-preview" style="background-image:url('…')"></div>
    <div class="img-preview-overlay"><i class="fa-solid fa-arrows-rotate"></i><span>Görseli Değiştir</span></div>
    <button type="button" class="iu-remove-overlay" data-no-confirm aria-label="Görseli kaldır"><i class="fa-solid fa-xmark"></i></button>
    <!-- boşsa -->
    <i class="fa-solid fa-image iuz-ico"></i>
    <span class="iuz-lbl">Görsel yok — tıkla ya da sürükle-bırak</span>
  </div>

  <input type="file" class="iu-file" accept="image/jpeg,image/png,image/webp" hidden>
  <!-- 3 hidden alan (yukarıda) -->
  <span class="fhint">Önerilen: 1600×1000px · JPG/PNG/WEBP · maks. 15 MB</span>
</div>
```

#### Markup iskeleti — ÇOKLU (galeri) `:140-154`

```html
<div class="st-figs iu-figs" data-max="8">
  <div class="st-shot" style="background-image:url('…')">
    <input type="hidden" name="gallery[12][keep_image_id]" value="12">
    <input type="hidden" name="gallery[12][position]" class="iu-pos" value="0"><!-- yalnız sortable -->
    <button type="button" data-no-confirm title="Görseli sil"><i class="fa-solid fa-trash-can"></i></button>
  </div>
  <button class="st-up" type="button"><i class="fa-regular fa-image"></i> Görsel ekle <small>1/8</small></button>
  <input type="file" class="iu-file" accept="image/jpeg,image/png,image/webp" hidden>
</div>
```

#### CSS ölçüleri

| Seçici | Değer | Kaynak |
|---|---|---|
| `.admin-upload` | `flex column; gap:10px` | `sa-ui.css:120` |
| `.img-upload-zone` | `w:100%; **h:240px**; radius:--radius-md; border:2px dashed --line; bg:--bg` | `sa-ui.css:121` |
| `.img-upload-zone:hover/.is-drag` | `border-color:--acc; bg:rgba(--acc-rgb,.04)` | `sa-ui.css:122` |
| `.iuz-ico` | `font-size:28px; color:--muted` | `sa-ui.css:123` |
| `.iuz-lbl` | `12.5px; --muted; padding:0 16px` | `sa-ui.css:124` |
| `.img-preview` | `inset:0; background cover/center` | `sa-ui.css:126` |
| `.img-preview-overlay` | `rgba(33,30,22,.45); opacity 0→1 hover; gap:8px` | `sa-ui.css:127-128` |
| `.iu-remove-overlay` | `top/right:10px; **28×28**; radius:--radius-sm; bg:rgba(255,255,255,.92)` | `sa-ui.css:136` |
| `.iu-remove-overlay:hover` | `bg:--tomato; color:#fff` | `sa-ui.css:137` |
| `.st-figs` | `flex; gap:8px; wrap` | `admin-icerik/sa-icerik-form.css:123` |
| `.st-shot` | **148×92** (içerik) / **122×78** (tarifler) | `sa-icerik-form.css:124` / `sa-tarifler-form.css:121` |
| `.st-shot button` | `right/top:5px; 26×26; opacity 0, hover'da 1` | `sa-icerik-form.css:125-126` |
| `.st-up` | **148×92** dashed 1.5px; 12.5px/700 | `sa-icerik-form.css:128` |
| mobil (≤ kırılım) | `.st-shot,.st-up{width:104px;height:70px}` | `sa-icerik-form.css:180` |
| `.fhint` | `11.5px; --muted; 500` | `sa-ui.css:115` |

#### Davranış

Bileşen her instance için kendi `<script>` bloğunu basar (`:172` sonrası),
kök id rastgele (`iu-` + `Str::random(8)`, `:71`).

1. **Tıkla / Enter / Space** → gizli `.iu-file` açılır (`:309-324`).
2. **Sürükle-bırak** → `dragover`'da `.is-drag`, `drop`'ta ilk dosya alınır (`:326-331`).
3. Dosya seçilince → `withCrop()` (`:202-208`): `data-crop-enabled="1"` ve
   `window.AdminCrop` varsa kırpma modalı; yoksa ham dosya geçer.
4. `uploadMedia()` (`:211-236`):
   - istemci ön-kontrol: MIME allowlist (`image/jpeg|png|webp` [+`application/pdf`]),
     boyut > `media-max-size` → hata, ağa çıkılmaz
   - `fetch(mediaUrl, {method:'POST', headers:{X-CSRF-TOKEN, Accept:application/json}, body:FormData('file')})`
   - sunucu hatası ile ağ hatası **ayrı mesaj** alır (`err.iuServerError` bayrağı)
5. Başarıda `media_id ← data.id`, `keep_image_id ← ''`, `removed ← '0'`, önizleme çizilir.
6. **Çarpı** → üç alan sıfırlanır, `removed=1`, boş görünüm (`:309-322`).
7. Dışa açılan API: `window.AdminImageUpload.initSingle(root, opts)` — JS'le
   klonlanan kartlar için (`:249`, çağrı `:346`); `root.iuReset(current)` — modalı N satır
   için yeniden dolduran ekranlar için (`:336-344`).

#### Yükleme kilidi — `image-upload-lock.blade.php`

Ayrı partial, `<script>` sarmalı **yok**, mevcut script bloğuna `@include` edilir.
Prod olayının çözümü: "ateşle-unut" yükleme uçuştayken submit basılırsa fetch
iptal olup kayıt görselsiz gidiyordu.

- `window.AdminImageUpload.uploads.begin(scopeEl, onWatchdog)` → sayaç++,
  ilk yüklemede formun **tüm submit kontrolleri disable** + `aria-busy="true"`,
  form içine `.iu-status.iu-status--form` satırı ("Görsel yükleniyor…")
- `…uploads.end(handle)` → sayaç--, sıfırlanınca eski `disabled` durumları geri yüklenir
- `WATCHDOG_MS = 90000` (**90 sn**) — sonuçlanmayan yükleme kilidi kendiliğinden açar
- `bindSubmitGuard`: sayaç > 0 iken submit `preventDefault` + info toast
- `…register(scopeEl, elements)`: selector'a girmeyen (`type="button"` olup
  `requestSubmit()` çağıran) düğmeleri kilit listesine katar
- `window.AdminImageUpload.fieldStatus(anchorEl)` → `{loading, error, clear}`;
  `<span class="iu-status">` **anchor'ın kardeşi** olarak lazy yaratılır

CSS: `.iu-status` `admin.css:600` (`11.5px/500/--muted`),
`.iu-status--loading::before` FA `\f110` spinner `admin.css:601`,
`.iu-status--error` `--danger` `admin.css:602`,
hata çerçevesi `admin.css:604-607`.

### 1.3 Kırpma — `admin-crop.js` + Cropper.js 1.6.2

**Sürüm kanıtı:** `public/vendor/cropperjs/SOURCE.md` — v1.6.2, MIT,
`cropper.min.js` 37.369 B `sha256-YpCj+lgbF8z0aSzz7GF6dK5l3ojZFAxy1JKum0dwfvs=`.

**API:** `window.AdminCrop.open(file, aspectStr, onCropped, onCancel)` —
`admin-crop.js:193`. `window.Cropper` yoksa modal hiç açılmaz, dosya ham
geçer (güvenli düşüş, `:195`).

**Modal markup** (`admin-crop.js:52-70`, JS ile üretilir):

```html
<div class="sa-crop-modal-ov">
  <div class="sa-crop-modal" role="dialog" aria-modal="true" aria-label="Görseli kırp">
    <div class="sa-crop-modal-head">
      <h3><i class="fa-solid fa-crop-simple"></i> Görseli Kırp</h3>
      <button class="sa-crop-close" aria-label="Vazgeç"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="sa-crop-modal-body"><div class="sa-crop-img-wrap"><img class="sa-crop-img" alt=""></div></div>
    <div class="sa-crop-size-warn" role="alert" hidden></div>
    <div class="sa-crop-modal-foot">
      <button class="btn btn-ghost btn-sm sa-crop-cancel">Vazgeç</button>
      <button class="btn btn-ghost btn-sm sa-crop-raw">Kırpmadan Kullan</button>
      <button class="btn btn-acc btn-sm sa-crop-apply"><i class="fa-solid fa-check"></i> Kırp ve Kullan</button>
    </div>
  </div>
</div>
```

**CSS** (`resources/css/admin.css`):

| Seçici | Değer | Satır |
|---|---|---|
| `.sa-crop-modal-ov` | `fixed inset:0; **z-index:205**; padding:18px; bg rgba(26,26,26,.6); blur(2px)` | :530 |
| `.sa-crop-modal` | `width:min(**640px**,100%); max-height:90vh; flex column` | :536 |
| `.sa-crop-modal-head` | `padding:16px 18px; border-bottom 1px --line` | :542 |
| `.sa-crop-close` | `32×32` | :545 |
| `.sa-crop-modal-body` | `height:min(58vh,460px); padding:16px; bg --bg` | :547 |
| `.sa-crop-img-wrap` | padding'siz sarmalayıcı (Cropper offsetWidth uyumu, N5 fix) | :561 |
| `.sa-crop-size-warn` | `13px; --danger; bg --tomato-tint` | :566 |
| `.sa-crop-modal-foot` | `padding:14px 18px; justify-content:flex-end; wrap` | :567 |
| Cropper tema | `.cropper-view-box{outline rgba(--acc-rgb,.85)}`, `.cropper-line/.cropper-point{--acc}` | :570-572 |
| mobil | overlay padding 0, modal tam ekran, foot `column-reverse` + tam genişlik düğme | :578-582 |

**Cropper ayarları** (`admin-crop.js:208-216`):
`viewMode:1 · autoCropArea:1 · dragMode:'move' · responsive:true · background:false · checkOrientation:true`,
`aspectRatio` = `"16:10"` gibi metnin parse'ı, boşsa `NaN` (serbest).

**İki boyut kapısı:**
- `MAX_OUT_DIM = 2000` (`:169`) — `getCroppedCanvas({maxWidth,maxHeight})`;
  ölçülmüş gerekçe: 10,3 MB PNG girdi → kırpmasız 15,6 MB çıktı üretiyordu.
- çıktı blob'u `media-max-size`'ı aşarsa **modal açık kalır**, ağa çıkılmaz,
  `.sa-crop-size-warn` gösterilir (`:147-153`, uygulama `:172-192`).

**Çıktı MIME:** jpeg → q **0.92**, png → quality yok (lossless), webp → 0.92
(`admin-crop.js:175-176`). WebP dönüşümü sunucuda.

**Aspect kataloğu:** `config/admin_images.php` — `<model>.<alan>` → `aspect / suggest / crop`.
Ölçülen örnekler: `recipe.cover 16:10 / 1600×1000px`, `tip.cover 16:9`,
`recipe.step_image 1:1 / 800×800px`, `short_video.thumbnail 9:16 / 720×1280px`,
`video_series.cover 3:2`, `pagedef.banner_bg 16:7`, `settings.logo` → `crop:false`
(tek `crop:false` kaydı — contain görünüm, kırpma anlamsız).

---

## 2. Zengin metin editörü — TinyMCE

### Sürüm ve dağıtım

- **TinyMCE 7.9.3**, releaseDate `2026-05-19` — kanıt:
  `grep -o 'majorVersion:"7"|minorVersion:"7.9.3"' public/vendor/tinymce/tinymce.min.js`
- **Self-hosted**, `public/vendor/tinymce/` — CDN yok, Vite bundle dışı
  (`layout.blade.php:503-505` yorumu). `public/admin/` **değil**:
  üst dizin adı `/admin` route prefix'ini gölgeliyordu.
- `license_key: 'gpl'`, `promotion:false`, `branding:false`
- Türkçe dil paketi: `langs/tr.js`, `language:'tr'`
- Yüklü eklenti dizinleri (32 klasör): accordion, advlist, anchor, autolink,
  autoresize, autosave, charmap, code, codesample, directionality, emoticons,
  fullscreen, help, image, importcss, insertdatetime, link, lists, media,
  nonbreaking, pagebreak, preview, quickbars, save, searchreplace, table,
  visualblocks, visualchars, wordcount

### Merkezi config — `public/vendor/tinymce-config.js` (158 satır)

Per-blade `tinymce.init` **yazılmaz** (direktif, `:14`). Tek boot,
`DOMContentLoaded`'da `.tinymce-editor` textarea'larını tarar.

#### Varsayılan profil (`:23-49`)

- `menubar: false`
- `height: **420**` (`:30`; `data-height` attribute'u ile override edilir, `:121-124`)
- `convert_urls:false`, `relative_urls:false`
- `entity_encoding: 'raw'` (`:41`) — TinyMCE varsayılanı `named`; â→`&acirc;` gibi
  entity'ler düz-metin yüzeylerde (kart özeti, meta description) görünür
  metin olarak basılıyordu

**plugins (tam liste, sırasıyla):**
`advlist autolink lists link image charmap searchreplace visualblocks code
fullscreen table wordcount nonbreaking directionality codesample quickbars`

**toolbar (tam liste, sırasıyla — `|` ayraçlar dahil):**
```
undo redo | blocks | bold italic underline strikethrough | forecolor |
alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |
blockquote link image table | removeformat code fullscreen
```

**block_formats:** `Paragraf=p; Başlık 2=h2; Başlık 3=h3; Başlık 4=h4; Alıntı=blockquote`

**quickbars:** `insert_toolbar:false`, `selection_toolbar:'bold italic | link blockquote'`

**content_style:** `body{font-family:-apple-system,…;font-size:15px;line-height:1.7;color:#1f2430}`

#### Variant 2 — inline (`.tinymce-inline`, `:59-68`)

Tek satırlık lead/açıklama alanları için. `forced_root_block:''` (TinyMCE 7'de
`false` yoksayılıyor), `height:**140**`, `plugins:'autolink link'`,
`toolbar:'bold italic underline | link | removeformat'`,
`invalid_elements` blok etiketlerini söker.

#### Variant 3 — gövde bloğu (`.tinymce-body-block`, `:86-92`)

`plugins:'advlist autolink lists link charmap searchreplace visualblocks code fullscreen wordcount quickbars'`
`toolbar:'undo redo | blocks | bold italic | bullist numlist | blockquote link | removeformat code fullscreen'`
`block_formats:'Paragraf=p; Başlık 2=h2; Alıntı=blockquote'`
`invalid_elements:'table,thead,tbody,tfoot,tr,td,th,caption,img,pre,hr'`

`underline` **bilerek yok**: purifier profili `span`a izin vermediği için altı
çizgi sessizce kayboluyordu — "editör kullanıcıya yalan söylerdi" (`:80-84`).

### Görsel gömme yolu

Toolbar'da `image` düğmesi **var** (varsayılan profilde), ancak `images_upload_url`
/ `file_picker_callback` **tanımlı DEĞİL** — grep `images_upload|file_picker` →
`tinymce-config.js` içinde 0 isabet. Yani editörden görsel eklemek yalnız
**URL yapıştırma** yoluyla çalışır; dosya yükleme yolu image-upload bileşenidir.
`body_blocks` variantında `img` zaten `invalid_elements` içinde.

### Bağlantı diyaloğu / tablo

`link` eklentisi yüklü → TinyMCE'nin **stok** bağlantı diyaloğu (URL, metin,
başlık, hedef). Özel diyalog yazılmamış. `table` eklentisi varsayılan profilde
yüklü, `body_blocks` ve `inline` variantlarında sökülü.

### Kaç ekranda kullanılıyor

`grep -rn "tinymce-editor" resources/views` → **36 isabet / 14 dosya**:
`icerik/form`, `icerik/partials/body-blocks-list`, `kademeler/form`,
`mutfaga-giris/partials/_body-blocks-list`, `_tab-ders-akisi`, `_tab-icerik`,
`puf-noktalari/_section-card`, `puf-noktalari/form`, `sayfa-tanimlari/edit`,
`taksonomi/index`, `tarifler/form`, `uyeler/sef-profili`,
`components/admin/lang-tabs`, `components/admin/tfield`.

### Submit senkronu (kritik)

`DOMContentLoaded`'da editör içeren **her form**a `submit` dinleyicisi bağlanır,
`tinymce.triggerSave()` çağrılır (`:142-156`). Per-blade `handleFormSubmit`
yazılmaz — unutulursa gizli içerik kaybolur (R8 dersi).

### FOUC

Ham `textarea.tinymce-editor` CSS ile gizli (admin.css); init olunca TinyMCE
kendi `.tox-tinymce` iframe'iyle değiştirir (`:15-17`).

> **Fit'e not:** buildless prototipte TinyMCE'nin kendisi gerekmeyebilir —
> maket düzeyinde `.tox-tinymce` görünümünü taklit eden statik bir araç çubuğu
> yeterli olabilir. Ama **araç çubuğu düğme listesi ve sırası yukarıdaki gibi
> korunmalı**; sonraki backend turu aynı config'i devralacak.

---

## 3. Dosya yükleme bileşenleri

### 3.1 Görsel — bkz. §1.2

### 3.2 Video / ses — `<x-admin.video-upload>`

**Dosya:** `resources/views/components/admin/video-upload.blade.php`
**Kullanım:** 3 ekran — `kisa-videolar/form`, `video-serileri/form`, `videolar/form`.

image-upload'un kardeşi; aynı `.admin-upload` / `.img-upload-zone` / `.iu-status`
kabini, **aynı upload-lock**. Farklar:

- **crop YOK** (video kırpılmaz)
- yalnız tekli dosya
- `fetch` değil **XHR** — `upload.progress` olayı ile gerçek yüzde göstermek için
- ilerleme çubuğu + dosya-bilgi paneli eklenir

**Gizli alan sözleşmesi (4 alan, `:76-79`):**

```html
<input type="hidden" name="{name}[media_id]"        class="iu-media-id">
<input type="hidden" name="{name}[keep_media_id]"   class="iu-keep-id">
<input type="hidden" name="{name}[removed]"         class="iu-removed" value="0">
<input type="hidden" name="{name}[poster_media_id]" class="iu-poster-id"><!-- otomatik çıkarılan kare -->
```

**Markup iskeleti (`:42-89`):**

```html
<div class="admin-upload vid-upload" id="vu-XXXXXXXX" data-upload-root
     data-name="video_file" data-media-url="…"
     data-video-mimes="…" data-warn-mimes="…" data-audio-mimes="…"
     data-video-max="…" data-audio-max="…" data-duration-target="#f-duration">
  <div class="form-sec-tt"><i class="fa-solid fa-file-video"></i> Video Dosyası</div>
  <div class="img-upload-zone vid-zone" data-drop-zone role="button" tabindex="0">
    <div class="vid-empty">
      <i class="fa-solid fa-file-video iuz-ico"></i>
      <span class="iuz-lbl">Dosya yok — tıkla ya da sürükle-bırak</span>
    </div>
    <div class="vid-file">
      <div class="vid-file-icn"><i class="fa-solid fa-file-video"></i></div>
      <div class="vid-file-meta"><span class="vid-file-name">…</span><span class="vid-file-sub">3:42</span></div>
      <a class="vid-file-play" target="_blank" rel="noopener" title="Önizle"><i class="fa-solid fa-play"></i></a>
      <button class="iu-remove-overlay" data-no-confirm aria-label="Dosyayı kaldır"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="vid-progress" hidden>
      <div class="vid-progress-track"><div class="vid-progress-bar" style="width:0%"></div></div>
      <span class="vid-progress-pct">0%</span>
    </div>
  </div>
  <input type="file" class="iu-file" accept="{video+audio mimes}" hidden>
  <!-- 4 hidden alan -->
  <span class="fhint">Video: MP4/WEBM/OGG/MOV, en fazla :vmax MB. Ses: MP3/WAV/OGG/M4A, en fazla :amax MB.</span>
  <span class="fhint iu-format-warn" hidden>… (.mov) bazı tarayıcılarda oynatılamayabilir …</span>
</div>
```

**CSS** (`admin.css:614-626`):

| Seçici | Değer |
|---|---|
| `.vid-zone` | `height:auto; min-height:96px; padding:18px` (görselin 240px'ini ezer) |
| `.vid-file-icn` | `40×40; radius --radius-sm; color --acc` |
| `.vid-file-name` | `12.5px/700 --slate` |
| `.vid-file-sub` | `11px --muted` |
| `.vid-file-play` | `30×30; radius --radius-circle`, hover'da dolu `--acc` |
| `.vid-zone .iu-remove-overlay` | `top/right:8px` (görselde 10px) |
| `.vid-progress-track` | `height:6px; radius --radius-pill; bg rgba(--acc-rgb,.16)` |
| `.vid-progress-bar` | `bg --acc; transition width .15s linear` |
| `.vid-progress-pct` | `11px/700 --muted; min-width:32px; text-align:right` |

**Kabul edilen tipler ve sınırlar:** kod içinde **sabit yok** —
`config/media.php` `media.video.mimes` / `media.audio.mimes` /
`media.video.max_size` / `media.audio.max_size` / `media.video.warn_mimes`
data-attribute olarak basılır. `.mov` kabul edilir ama uyarı gösterilir
(sunucuda transcode yok, ffmpeg kurulu değil).

Diğer görsel ölçümler: `config/media.php` — `max_dimension:1600`,
`thumb_dimension:480`, `quality:82`, `signed_url_ttl:900`,
`video_signed_url_ttl: 4 saat`.

### 3.3 Ortak yükleme davranışı özeti

| Özellik | Görsel | Video/Ses |
|---|---|---|
| Tekli | ✅ | ✅ |
| Çoklu | ✅ (`multiple`, max 8) | ❌ |
| Önizleme | background-image | dosya adı + süre + oynat düğmesi |
| Sürükle-bırak | ✅ (iki modda da) | ✅ |
| İlerleme yüzdesi | ❌ (fetch) | ✅ (XHR progress) |
| Kırpma | ✅ (opsiyonel) | ❌ |
| Hata gösterimi | `.iu-status--error` + `.is-error` çerçeve + `saToast danger` | aynı |
| Submit kilidi | ✅ (90 sn watchdog) | ✅ (aynı çekirdek) |

---

## 4. Tarih ve saat seçiciler

**Kütüphane YOK.** grep `flatpickr|litepicker|daterangepicker|air-datepicker`
(`resources/views`, `public/js`, `public/css`, `resources/js`, `public/reference`)
→ **0 isabet**.

Kullanılan tek şey **native `<input type="date">`** — 14 kullanım / 8 ekran:
`faturalar/index`, `kampanyalar/form`, `kuponlar/form`,
`mutfaga-giris/partials/_tab-icerik`, `raporlar/index`, `sozluk/form`,
`sponsorlar/form`, `sponsorluk-raporu/index`.

- `type="datetime-local"` → **0 isabet**
- `type="time"` → **0 isabet**
- **Aralık seçici bileşeni YOK** — aralık, iki ayrı `date` input'u ile kurulur.

**Biçim:** değerler `Y-m-d` (`->format('Y-m-d')`), üst sınır `max="{{ now()->format('Y-m-d') }}"`.

**Form içi kullanım** (`kuponlar/form.blade.php:66-75`):

```html
<div class="frow">
  <label for="f-from">Başlangıç Tarihi</label>
  <input class="finput" id="f-from" name="valid_from" type="date" value="2026-08-01">
  <span class="fhint">Boş = hemen geçerli.</span>
</div>
```

**Aralık kalıbı** (`raporlar/index.blade.php:53-58`):

```html
<form method="GET" class="dp-row" id="dpForm">
  <input type="hidden" name="range" value="ozel">
  <div class="dp-field"><label for="dpStart">Başlangıç</label><input type="date" id="dpStart" name="from" max="2026-08-30"></div>
  <div class="dp-field"><label for="dpEnd">Bitiş</label><input type="date" id="dpEnd" name="to" max="2026-08-30"></div>
  <div class="dp-foot" style="grid-column:1/-1"><span class="dp-note">Gerçek dönem filtresi</span>…</div>
</form>
```

**CSS** (`public/reference/admin-raporlar/sa-raporlar.css`):

| Seçici | Değer | Satır |
|---|---|---|
| `.dp-row` | `flex; gap:10px; margin-bottom:13px` | :88 |
| `.dp-field` | `flex column; gap:5px; flex:1; min-width:0` | :89 |
| `.dp-field label` | `11px/700; letter-spacing:.02em; uppercase; --muted` | :90 |
| `.dp-field input[type=date]` | özel kutu | :91-96 |
| `.dp-field input[type=date]:focus` | `border --acc; box-shadow 0 0 0 3px rgba(--acc-rgb,.12)` | :97 |
| `.dp-foot` | `flex; space-between; gap:12px` | :98 |
| `.dp-note` | `10.5px/600 --muted` | :99 |

Form içindeki tarih alanı ayrı bir sınıf almaz — genel `.finput` kullanır.

---

## 5. Etiket ve çoklu seçim (token-input)

**Kütüphane YOK.** grep `select2|choices.js|tom-select|tagify` → **0 isabet**.
Tamamı **el yapımı** `.ms-*` kiti.

Kanon: `admin/tarifler/form.blade.php:661-670`. Kit CSS'i `sa-ui.css:219-240`
(her admin ekranında hazır). İki sarmalayıcı partial ile yeniden kullanılıyor:

| Partial | Katalog kaynağı | Kullanan ekranlar |
|---|---|---|
| `admin/reklam/partials/_token-field.blade.php` | gömülü `options` **veya** uzak `endpoint` | `reklam-paketleri/form`, `kampanyalar/form` |
| `admin/mutfaga-giris/partials/_ms-field.blade.php` | yalnız uzak `endpoint` | `mutfaga-giris/_tab-icerik` |

`.ms-field` toplam **15 isabet / 7 dosya** (`tarif-ekle/index` public tarafta).

### Markup iskeleti

```html
<div class="ms-field" id="msSlots" data-icon="fa-link" data-name="slot_ids[]"
     data-endpoint="…"><!-- endpoint yoksa katalog gömülü -->
  <div class="ms-box" id="msSlotsBox">
    <span class="ms-chip" data-id="12">
      <i class="fa-solid fa-link ms-ico"></i>Ana Sayfa Üst Bant
      <button type="button" class="ms-x" data-id="12" title="Kaldır" aria-label="Ana Sayfa Üst Bant kaldır"><i class="fa-solid fa-xmark"></i></button>
    </span>
    <input type="hidden" name="slot_ids[]" value="12" data-ms-hidden="12">
    <input class="ms-search" id="msSlotsSearch" type="text" placeholder="Alan ara…"
           aria-label="Alan ara…" autocomplete="off"
           role="combobox" aria-expanded="false" aria-controls="msSlotsMenu">
  </div>
  <div class="ms-menu" id="msSlotsMenu" role="listbox" aria-multiselectable="true"></div>
</div>
```

Menü satırları JS ile basılır:

```html
<button type="button" class="ms-opt is-sel" role="option" aria-selected="true" data-id="12" data-name="…">
  <i class="fa-solid fa-link"></i>Ana Sayfa Üst Bant<i class="fa-solid fa-check ms-check"></i>
</button>
<!-- boş -->
<div class="ms-empty">Eşleşen seçenek yok</div>
```

**Gizli input HER ZAMAN basılır** — POST'u o taşır, çip yalnız görünümdür
(`chips=false` kipinde çip basılmaz, gizli input kalır).

### CSS ölçüleri — `public/reference/admin/sa-ui.css`

| Seçici | Değer | Satır |
|---|---|---|
| `.ms-field` | `position:relative` | :220 |
| `.ms-box` | `flex wrap; gap:8px; padding:**9px 11px**; border 1px --line; radius --radius-md; cursor:text` | :221 |
| `.ms-box:hover` | `border-color:#dcdcdc` | :222 |
| `.ms-box.is-open` | `border --acc; box-shadow 0 0 0 3px rgba(--acc-rgb,.10)` | :223 |
| `.ms-chip` | `13px/700 --acc; bg rgba(--acc-rgb,.10); border 1px --acc; padding:**6px 8px 6px 12px**; radius --radius-sm; nowrap; animation msPop .2s` | :224 |
| `.ms-chip .ms-ico` | `11px; opacity .85` | :225 |
| `.ms-chip .ms-x` | `**18×18**; bg rgba(--acc-rgb,.14); font-size:10px` | :226 |
| `.ms-chip .ms-x:hover` | `bg --acc; color #fff` | :227 |
| `@keyframes msPop` | `scale(.86)→1` | :228 |
| `.ms-search` | `flex:1; min-width:**120px**; 13.5px/500; border:none; padding:6px 2px` | :229 |
| `.ms-menu` | `absolute; top:calc(100%+6px); **z-index:60**; max-height:**248px**; overflow-y:auto; padding:6px; display:none` | :231 |
| `.ms-menu.show` | `display:block; animation aiFade .18s` | :232 |
| `.ms-opt` | `flex; gap:10px; 13.5px/500; padding:**9px 11px**; radius --radius-sm` | :233 |
| `.ms-opt:hover / .kbd-active` | `bg rgba(--acc-rgb,.08); color --acc` | :235 |
| `.ms-opt .ms-check` | `margin-left:auto; --acc; 12px; display:none` | :237 |
| `.ms-opt.is-sel` | `--acc; 700` + check görünür | :238-239 |
| `.ms-empty` | `padding:12px; center; 12.5px --muted` | :240 |

### Davranış — `_token-field.blade.php` `@once` sürücüsü

Fabrika biçiminde: `window.__adTokenField(rootId)`, katalog
`window.__adTokenCatalog[rootId]`.

- **Gömülü katalog:** yerel filtre, `toLocaleLowerCase('tr')` (düz `toLowerCase()`
  'İ'yi katlamıyor, "İzmir" araması eşleşmiyordu), menüde ilk **40** satır
- **Uzak katalog:** `250 ms` debounce, `?q=` ile GET,
  `seq` ile **yarış kilidi** (eski cevap yeniyi ezmez)
- **Klavye:** ArrowDown/ArrowUp gezinme, Enter seç, Backspace (boş input) son
  çipi siler, Escape kapatır
- **Fare:** menüde `mousedown` (click değil — blur'dan önce yakalamak için),
  seçili satıra ikinci tık kaldırır
- Dışarı tıklayınca kapanır
- Seçim değişince `ms:change` CustomEvent (`{ids:[…]}`, bubbles) tetiklenir

### Yeni değer ekleme (serbest metin)

`.ms-*` kitinde **YOK** — yalnız katalogdan seçilir.
Serbest metin çipi **public tarafta** var: `components/account/chip-picker.blade.php`
(`free` prop'u, Enter/virgül ile), `.fk-chip.fk-chip--tag` + `.fk-chip__rm`
sınıflarıyla, çekirdeği `public/reference/shared/dada-autocomplete.js`.
Admin panelinde kullanılmıyor.

---

## 6. Sıralama (drag-drop)

**Kütüphane: SortableJS 1.15.2**, CDN'den, **her ekranın kendi satırıyla**:

```html
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js" defer></script>
```

Merkezi yükleme **yok** — `layout.blade.php`de bu satır geçmez.
Her ekran `@push('scripts')` bloğunda kendisi basar.

**Yükleme satırları (6 yer):** `mutfaga-giris/form:95`, `koleksiyonlar/form:71`,
`puf-noktalari/form:61`, `sayfalar/form:72`, `icerik/form:105`,
`components/admin/image-upload.blade.php:102` (`@once`, yalnız `sortable` prop'u
verilirse basılır).

**`Sortable.create()` çağrıları (15 yer):**

| Dosya:satır | Liste | Tutamak | onEnd |
|---|---|---|---|
| `mutfaga-giris/form:145` | blok listesi | `.ie-drag` | — |
| `mutfaga-giris/_tab-ders-akisi:298` | bölümler | `.ie-drag` | — |
| `mutfaga-giris/_tab-ders-akisi:369` | adımlar | `.ie-drag` | `renumberSteps` |
| `mutfaga-giris/_tab-ders-akisi:439` | hatalar | `.ie-drag` | — |
| `mutfaga-giris/_tab-ders-akisi:533` | quiz | `.ie-drag` | — |
| `mutfaga-giris/_body-blocks-list:135` | gövde blokları | `.ie-drag` | `renumber(list)` |
| `koleksiyonlar/form:280` | duraklar | `.ie-drag` | — |
| `puf-noktalari/form:376` | bölümler | `.ie-drag` | `renumber` |
| `sayfalar/form:413` | içerik blokları | `.ie-drag` | `renumberBlocks` |
| `icerik/form:812` | liste | `.ie-drag` | — |
| `icerik/form:844` | bölümler | `.ie-drag` | — |
| `icerik/form:971` | sofra adımları | `.sd-step-head .ie-drag` | `sdRenumber` |
| `icerik/form:995` | ipuçları | `.ie-drag` | — |
| `icerik/form:1142` | içerik blokları | `.ie-drag` | `renumberBlocks` |
| `image-upload.blade.php:457` | galeri `.st-shot` | **tutamak yok** (`filter:'.st-up'`) | `renumberPositions` |

**Sabit ayar:** `animation: 150` — on beş çağrının hepsinde.

### Tutamak nerede

Tekrar eden kart (`.st-card`) desenindeki tutamak **sağ kenar sütununda**
(`.st-side`), silme düğmesinin üstünde:

```html
<div class="st-card" data-kind="heading">
  <span class="st-num">2</span>
  <div class="st-body">
    <span class="cb-kind"><i class="fa-solid fa-heading"></i> Alt Başlık</span>
    <input class="finput" data-field="text" type="text" placeholder="Bölüm başlığı">
  </div>
  <div class="st-side">
    <span class="ie-drag" draggable="true" title="Sürükleyerek sırala"><i class="fa-solid fa-grip-vertical"></i></span>
    <button class="ie-del st-del" type="button" title="Bloğu sil" aria-label="Bloğu sil"><i class="fa-solid fa-trash-can"></i></button>
  </div>
</div>
```
(`admin/sayfalar/form.blade.php:177-192` — ölçülmüş gerçek markup)

Galeri döşemesinde **tutamak yok**: 148×92 kutuda ayrı tutamağa yer olmadığı
için döşemenin kendisi sürüklenir (`image-upload.blade.php:451-455` yorumu).

### CSS

| Seçici | Değer | Kaynak |
|---|---|---|
| `.st-card` | `flex; gap:14px; bg --bg; border 1px --line; radius --radius-lg; padding:16px` | `admin-sayfalar/sa-sayfalar-form.css:73` |
| `.st-card.is-dragging` | `opacity:.45` | :74 |
| `.st-card.is-over` | `box-shadow:0 0 0 2px var(--acc) inset` | :75 |
| `.st-num` | `38×38; radius circle; bg --acc; #fff; 14px/700` | :76 |
| `.st-body` | `flex:1; min-width:0` | :77 |
| `.cb-kind` | `11px/700; uppercase; letter-spacing .06em; --acc; bg rgba(--acc-rgb,.10); padding:5px 10px` | :81 |
| `.st-side` | `flex column; align-items:center; gap:7px` | :84 |
| `.ie-drag` | `color:#c9c9c9; cursor:grab; 13px; padding:6px 4px` | :85 |
| `.ie-drag:hover` | `--acc` | :86 |
| `.ie-drag:active` | `cursor:grabbing` | :87 |
| `.ie-del` | `30×30; border 1px --line; radius --radius-sm` | :88 |
| `.ie-del:hover` | `border/color --tomato; bg --tomato-tint` | :89 |
| `.add-row` | `13px/700; dashed 1.5px --line; padding:13px 22px` | :92 |
| `.add-row:hover` | `border/color --acc` | :93 |
| `.ie-row` (tarif malzeme satırı) | `grid: auto 92px 148px minmax(0,1fr) auto` | `admin-tarifler/sa-tarifler-form.css:61` |
| `.ie-row` mobil | `grid: auto 1fr` + iki satır areas | `sa-tarifler-form.css:170` |

### Kaydetme

Sıra **DOM sırasından türetilir**; sunucuya gizli `position` alanıyla gider.
`onEnd` (ve ekleme/silme sonrası) `renumber*()` çağrılır ve tüm
`.iu-pos` / `[data-field="position"]` değerleri 0'dan yeniden yazılır.
Ayrı bir "sırayı kaydet" AJAX ucu **yok** — form submit'iyle gider.

**Ölçülmüş tuzak (2026-08-01):** `if (window.Sortable) Sortable.create(…)`
deseni **her zaman false** dönüyordu, çünkü `defer`li script bu satırdan
SONRA çalışır. Doğru desen (`image-upload.blade.php:365-371`):

```js
function whenSortableReady(cb) {
  if (window.Sortable) { cb(); return; }
  document.addEventListener('DOMContentLoaded', function () { if (window.Sortable) cb(); });
}
```
Beş formdaki 14 çağrı bu desene çevrildi.

---

## 7. Onay ve uyarı diyalogları

### 7.1 `saConfirm` — kanon onay modalı

**Tanım:** `public/reference/admin/sa-ui.js:30-53`
**CSS:** `sa-ui.css:50-76` · aynı blok `sa-shell.css:112-132` · üçüncü minimal
kopya `sa-confirm.css:16-43` (panel/public sayfalar için).
⚠ **Üç kopya var** — dosyanın kendi yorumu bunu borç olarak işaretliyor
(`sa-confirm.css:9-15`). Fit'te **tek kopya** kurulmalı.

**API:**
```js
saConfirm({
  danger:  true,              // .sa-modal.danger + btn-danger
  icon:    'fa-trash',        // varsayılan: danger ? fa-trash : fa-circle-question
  title:   'Silinsin mi?',    // varsayılan 'Emin misiniz?'
  message: '"X" kalıcı olarak silinecek. Bu işlem geri alınamaz.',
  ok:      'Sil',             // varsayılan 'Onayla'
  cancel:  'Vazgeç',          // varsayılan 'İptal'
  onConfirm: function () { … }
});
```

**Üretilen markup (`sa-ui.js:34-41`):**

```html
<div class="sa-modal-ov open">
  <div class="sa-modal danger" role="dialog" aria-modal="true">
    <div class="sa-modal-ico"><i class="fa-solid fa-trash"></i></div>
    <h3>Silinsin mi?</h3>
    <p>“Menemen” kalıcı olarak silinecek. Bu işlem geri alınamaz.</p>
    <div class="sa-modal-acts">
      <button type="button" class="btn btn-ghost btn-sm sa-m-cancel">Vazgeç</button>
      <button type="button" class="btn btn-sm btn-danger sa-m-ok">Sil</button>
    </div>
  </div>
</div>
```
Başlık/metin/düğme yazıları `textContent` ile basılır (XSS yüzeyi yok).

**Yapı: ikon · başlık · metin · iki düğme (sağa hizalı, İPTAL solda, ONAY sağda).**

**CSS ölçüleri** (`sa-ui.css`, `sa-confirm.css` ile aynı):

| Seçici | Değer | Satır |
|---|---|---|
| `.sa-modal-ov` | `fixed inset:0; **z-index:200**; flex center; padding:22px; bg rgba(25,22,15,.55); blur(2px); opacity 0 → 1` | :50-55 |
| `.sa-modal` | `width:min(**420px**,100%); bg --paper; border 1px --line; radius --radius-lg; shadow --sh-lg; padding:**26px 26px 22px**; transform translateY(10px) scale(.985)` | :56-61 |
| `.sa-modal-ico` | `**46×46**; radius **13px**; 19px; margin-bottom:15px; bg rgba(--acc-rgb,.12); color --acc-deep` | :62-65 |
| `.sa-modal.danger .sa-modal-ico` | `bg --tomato-tint; color --tomato` | :66 |
| `.sa-modal h3` | `18px; margin-bottom:7px; letter-spacing:-.01em; --slate` | :67 |
| `.sa-modal p` | `13.5px; --muted; line-height:1.55; margin-bottom:22px` | :68 |
| `.sa-modal-acts` | `flex; gap:10px; justify-content:flex-end` | :69 |
| `.sa-modal-acts .btn` | `padding:11px 20px` | :70 |
| `.btn-acc` | `bg --acc; #fff` · hover `--acc-deep` + `translateY(-2px)` | :73-74 |
| `.btn-danger` | `bg --tomato; #fff` · hover `--tomato-dark` + `translateY(-2px)` | :75-76 |
| reduced-motion | `transition:none` | :91-93 |

**Kapanma:** Escape · backdrop tıklaması · Vazgeç. Açılışta OK düğmesi
`focus()` alır. Kapanış animasyonu 220 ms, sonra DOM'dan silinir.

### 7.2 Yıkıcı-aksiyon delegesi (Gastro'nun ayırt edici deseni)

`sa-ui.js:76-118` — **capture fazında** belge geneli `click` dinleyicisi.
Her ekranda ayrı ayrı `onclick` yazmaya gerek yok.

Tanınan beş fiil (`DESTR` tablosu, `sa-ui.js:60-66`):

| Anahtar | İkon | OK düğmesi | Başlık | Gelecek zaman metni |
|---|---|---|---|---|
| `sil` | `fa-trash` | Sil | Silinsin mi? | "kalıcı olarak silinecek. Bu işlem geri alınamaz." |
| `iptal` | `fa-xmark` | İptal Et | İptal edilsin mi? | "iptal edilecek." |
| `reddet` | `fa-xmark` | Reddet | Reddedilsin mi? | "reddedilecek." |
| `kaldir` | `fa-circle-minus` | Kaldır | Kaldırılsın mı? | "kaldırılacak." |
| `arsiv` | `fa-box-archive` | Arşivle | Arşivlensin mi? | "arşivlenecek." |

**Tanıma sırası** (`destrKind`, `sa-ui.js:67-75`):
1. içinde `.fa-trash` / `.fa-trash-can` ikonu → `sil`
2. metin `"İptal Et"` (yalın "İptal" **değil**) → `iptal`
3. `"Reddet"` → `reddet` · 4. `"Arşivle"` → `arsiv`
5. `"Kaldır"|"Çıkar"` → `kaldir` · 6. `"Sil"` → `sil`

**Kayıt adı:** en yakın `tr,li,.pnl-card,.apt-row,.rz-row` içinden
`strong,b,.u-name,.prod-name,.isl-id strong,h4,.apt-name,td` metni alınır;
48 karakterden uzun, 2'den kısa ya da salt sayı/₺/% ise **elenir** ve mesaj
"Bu kayıt …" olur (`sa-ui.js:82-84`).

**Onay sonrası gerçek eylem** (`sa-ui.js:90-116`):
- inline `onclick` varsa **o** çalıştırılır
- submit düğmesiyse: `form.removeAttribute('onsubmit')` (çift onay önleme) +
  `form.requestSubmit(el)`
- gerçek `href`li `<a>` ise `location.href`
- hiçbiri değilse **hiçbir şey yapılmaz** ("sahte silindi mesajı YASAK")

`e.preventDefault(); e.stopImmediatePropagation();` capture'da çağrılır ki
inline `onclick` ve gezinme onaydan **önce** tetiklenmesin.

**Kapatma anahtarı:** `data-no-confirm` — **64 kullanım** ölçüldü
(`grep -rn "data-no-confirm" resources/views` → 64). Yükleme bileşenlerinin
çarpı/çöp düğmeleri bunu taşır (yoksa görsel silerken onay modalı açılırdı).

**Ek olarak** 20 yerde `saConfirm(` doğrudan çağrılıyor (özel metin gereken
durumlar): `abonelikler/show:185`, `creator-planlari/index:103`,
`mutfaga-giris/form:118`, `mutfaga-giris/index:345`, `kuponlar/index:110`,
`uyeler/show:487`, `tarifler/index:250`, `tarifler/show:374`,
`koleksiyonlar/index:106`, `puf-noktalari/index:283` ve devamı.

### 7.3 Native `confirm()` — **YASAK, doğrulandı**

Blade yorumundaki iddia **ölçüldü ve doğru**:

- `onsubmit="return confirm(` **admin panelinde 0 isabet**.
  Toplam 2 isabet var, ikisi de admin **dışında**:
  `resources/views/bildirimler/index.blade.php:219` ve
  `resources/views/puf/create.blade.php:274` (üye tarafı ekranları).
- Bir de `components/profile/identity-band.blade.php:315` — `window.confirm`,
  yine üye tarafı.
- `resources/views/admin/**` altında native confirm çağrısı **yoktur**;
  bulunan tüm isabetler, kaldırıldığını anlatan **yorum satırlarıdır**
  (`abonelikler/show:15`, `creator-planlari/index:12`, `uyeler/show:27`,
  `malzemeler/index:28`, `tarifler/form:787-794`, `tarifler/index:24`,
  `tarifler/show:42,216,315`, `moderasyon/medya/index:9`).

Gerekçe (kanon, `sa-ui.js` başlık yorumu + "AW0 doktrini"): native confirm
sa-ui.js'in global delegesiyle **çift modal** üretiyordu.

---

## 8. Bildirim ve durum mesajları

İki ayrı katman var: **kalıcı sayfa şeridi** (`.sa-flash`) ve
**geçici köşe bildirimi** (`.sa-toast`).

### 8.1 `.sa-flash` — sayfa şeridi (server-render)

**CSS:** `resources/css/admin.css:146` (tek satır) + `:151` (`is-note`).
**Konum:** sayfa içeriğinin **en üstünde**, `pnl-page-head`den hemen sonra.
**Kaybolma davranışı: YOK** — sayfa yenilenene kadar durur. Kapatma düğmesi yok.

**Kullanım: 97 isabet** (`grep -rn "sa-flash" resources/views` → 97).

**Temel markup:**
```html
<div class="sa-flash" role="status">
  <i class="fa-solid fa-circle-check" aria-hidden="true"></i> Kupon oluşturuldu.
</div>
```

**CSS (`admin.css:146`):**
```
display:flex; align-items:center; gap:8px;
padding: var(--sp-3) var(--sp-4);
border-radius: var(--radius-md);
background: color-mix(in srgb, var(--green) 12%, var(--paper));
border: 1px solid color-mix(in srgb, var(--green) 30%, var(--line));
color: var(--green-deep);
font-weight:700; font-size:.9rem; margin-bottom: var(--sp-4);
```

**Ölçülen dört tip:**

| Tip | Sınıf / stil | İkon | `role` | Kaynak |
|---|---|---|---|---|
| **Başarı** (varsayılan) | `.sa-flash` — yeşil | `fa-circle-check` | `status` | `admin.css:146` |
| **Hata** | `.sa-flash danger` — **CSS kuralı YOK**, inline stil ile | `fa-triangle-exclamation` | `alert` | `kreatifler/form:35`, `sponsorluk-raporu/index:75` |
| **Uyarı** | inline `background:var(--warn-bg,#fff4e5); color:var(--warn,#8a5a00)` | — | `alert` | `mutfaga-giris/_tab-icerik:310` |
| **Nötr bilgi** | `.sa-flash.is-note` — `bg --cream-2; border --line; color --slate-2` | — | `note` | `admin.css:151` |

> ⚠ **Ölçülmüş tutarsızlık (Fit'te düzeltilmeli):** `.sa-flash.danger` için
> `admin.css`te **kural yok**. Hata şeritleri her ekranda **inline style ile
> tekrar yazılıyor** — birebir aynı 6 satırlık blok en az 5 dosyada kopyalanmış:
> ```
> style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding:12px 16px;
>        border-radius:var(--radius-md);background:var(--tomato-tint);
>        border:1px solid rgba(225,72,39,.3);color:var(--tomato);
>        font-size:13px;font-weight:600"
> ```
> (`videolar/form:49`, `video-serileri/form:43`, `mutfaga-giris/form:307`,
> `uyeler/sef-profili:38`, `kuponlar/index:20`)
> Fit'te `.sa-flash.is-error` / `.is-warn` / `.is-note` üçlüsü **CSS'te**
> tanımlanmalı; inline stil kopyalanmamalı.

### 8.2 `.sa-toast` — köşe bildirimi (JS)

**Tanım:** `sa-ui.js:19-28` · **CSS:** `sa-ui.css:79-89` (+ `sa-shell.css:136-146`,
`sa-confirm.css:45-55` — yine üç kopya).

**API:** `saToast(msg, { type, icon, ms })`

| Parametre | Değer |
|---|---|
| `type` | `'ok'` (varsayılan) · `'danger'` · `'info'` |
| `icon` | verilmezse: danger→`fa-trash`, info→`fa-circle-info`, diğer→`fa-circle-check` |
| `ms` | **2600** (varsayılan görünme süresi) |

**Markup (JS ile üretilir, `createElement` — XSS yüzeyi yok):**
```html
<div class="sa-toast-wrap">
  <div class="sa-toast danger show" role="status">
    <i class="fa-solid fa-circle-exclamation"></i><span>Yükleme başarısız oldu.</span>
  </div>
</div>
```
`.sa-toast-wrap` ilk çağrıda `document.body`ye eklenir, sonra yeniden kullanılır.

**Kaybolma:** `ms` sonunda `.show` kalkar, **260 ms** sonra DOM'dan silinir
(`sa-ui.js:27`).

**CSS ölçüleri:**

| Seçici | Değer | Satır |
|---|---|---|
| `.sa-toast-wrap` | `fixed; right:**24px**; bottom:**24px**; **z-index:210**; flex column; gap:10px; align-items:flex-end` | `sa-ui.css:79` |
| `.sa-toast` | `flex; gap:11px; bg **--slate**; color #fff; padding:**13px 16px**; radius --radius-md; shadow --sh-lg; 13.5px/600; min-width:**220px**; max-width:**360px**` | :80-85 |
| `.sa-toast.show` | `transform:none; opacity:1` | :86 |
| `.sa-toast i` | `15px; color --green` | :87 |
| `.sa-toast.danger i` | `#ff8a6e` | :88 |
| `.sa-toast.info i` | `#ffd479` | :89 |
| mobil ≤640px | `wrap{left:16px;right:16px;align-items:stretch}` · `toast{max-width:none}` | :94-97 |

Toast gövdesi **her tipte koyu** (`--slate`); tip yalnız **ikon rengini** değiştirir.

**Kullanım:** 12 doğrudan `saToast(` çağrısı blade'lerde; ayrıca yükleme
bileşenlerinin tüm hata dallarında (`notifyError`, `image-upload.blade.php:182`,
`video-upload.blade.php`) ve upload-lock submit guard'ında.

**z-index merdiveni (ölçülmüş, bozmadan taşınmalı):**
`saConfirm 200` < `crop modal 205` < `toast 210`.

---

## 9. Ölçülmeyen / kapsam dışı ama komşu bileşenler

Bu turda kapsam dışıydı; Fit'te gerekirse ayrı ölçüm ister:

- `components/admin/publish-sidebar.blade.php` — yayın/durum yan kartı
  (`.side-card` `sa-ui.css:144-153`, `.status-dot` :150-152)
- `components/admin/seo-tab.blade.php` — SEO skoru
  (`.seo-score/.score-ring/.seo-chk` `sa-ui.css:158-170`)
- `components/admin/lang-tabs.blade.php` + `tfield.blade.php` — çift dil
  (aşağıda özet)
- `sa-form-tabs` / `sa-form-tab` form içi sekmeler (`sa-ui.css:176-186`)

### 9.1 Dil sekmesi kiti (kısa özet — TinyMCE ile bağlantılı olduğu için)

`<x-admin.lang-tabs>` **82 kullanım / 27 dosya**;
`<x-admin.tfield>` **90 kullanım**. En yaygın ortak bileşen çifti.

```html
<div class="lang-scope" id="ls-XXXXXXXX" data-lang="tr">
  <div class="lang-tabs" role="tablist" aria-label="Dil">
    <button class="lang-tab is-on" data-lang-btn="tr" role="tab" aria-selected="true">🇹🇷 Türkçe</button>
    <button class="lang-tab"       data-lang-btn="en" role="tab" aria-selected="false">🇬🇧 English</button>
  </div>
  <div class="frow lang-pane" data-lang-pane="tr">…</div>
  <div class="frow lang-pane" data-lang-pane="en" hidden>…</div>
</div>
```

CSS (`public/css/admin-lang-tabs.css`):
`.lang-scope{padding-top:var(--sp-3)}` :30 ·
`.lang-tabs{inline-flex; gap:4px; padding:4px; margin-bottom:var(--sp-5); bg --bg; border 1px --line; radius --radius-md}` :31 ·
`.lang-tab{padding:7px 14px; 12.5px/700; --muted; radius --radius-sm}` :32 ·
`.lang-tab.is-on{bg --paper; color --acc-deep; shadow --sh-sm}` :34 ·
`.lang-pane[hidden]{display:none}` :36 — bileşik seçici bilinçli
(native `[hidden]` tek başına `.frow{display:flex}`e kaybediyor).

Davranış: **tek delege dinleyici** (`@once`), sayfadaki tüm `.lang-scope`ları
paylaşır. `tfield` tipleri: `text` · `textarea` · `richtext`
(→ `class="ftext tinymce-editor"`, `data-height` ile yükseklik).
TinyMCE gizli pane'i de init eder (`visibleOnly=false`) — ayrı lazy-init yok.

---

## 10. Fit için çıkarım — bileşen bileşen

| # | Bileşen | Gastro'da | Fit'te ne yapılmalı |
|---|---|---|---|
| 1 | Medya kütüphanesi | **YOK** | Gerekirse üstüne inşa edilecek; Gastro deseni yok |
| 1b | Görsel yükleme alanı | **VAR** (33 kullanım) | Birebir taşınabilir; buildless'ta `<script>` inline kalır |
| 1c | Kırpma modalı | **VAR** (Cropper 1.6.2) | Maket düzeyinde statik modal yeter; yapı korunmalı |
| 2 | TinyMCE | **VAR** (7.9.3, 3 profil, 36 kullanım) | Maket için statik araç çubuğu; düğme listesi/sırası korunsun |
| 3 | Video/ses yükleme | **VAR** (3 ekran, XHR progress) | Aynı kabin, ilerleme çubuğu |
| 4 | Tarih seçici | **native `input[type=date]`** | Kütüphane ekleme; aralık = iki input |
| 5 | Çoklu seçim | **VAR** — el yapımı `.ms-*` | Kit `fit-shell.css`e taşınır; kütüphane yok |
| 5b | Serbest etiket | admin'de **YOK** (public'te var) | Gerekirse `.ms-*` üstüne `free` kipi eklenir |
| 6 | Drag-drop | **VAR** — SortableJS 1.15.2 CDN | Aynı sürüm, `defer` tuzağına dikkat (`whenSortableReady`) |
| 7 | Onay modalı | **VAR** — `saConfirm` + capture delegesi | Delegeli desen taşınmalı; native confirm yasağı korunsun |
| 7b | Kod tekrarı | `.sa-modal` CSS **3 kopya** | Fit'te tek kaynak |
| 8 | Flash şeridi | **VAR** (97 kullanım) ama `danger` CSS'siz | `.sa-flash` tip modifier'ları CSS'te tanımlansın |
| 8b | Toast | **VAR** — `saToast`, 2600 ms | Birebir; z-index merdiveni 200/205/210 korunsun |

**Fit'e taşınırken sabit kalması gerekenler (ölçülmüş değerler):**
- yükleme kutusu yüksekliği **240px**, galeri döşemesi **148×92** (mobil 104×70)
- onay modalı genişliği **420px**, kırpma modalı **640px**
- toast **2600 ms**, çıkış animasyonu **260 ms**
- upload watchdog **90.000 ms**
- token menüsü max-height **248px**, uzak arama debounce **250 ms**, yerel limit **40**
- Sortable `animation: 150`
- z-index: modal **200** · crop **205** · toast **210** · token menüsü **60**
