# Gastro ölçümü — LİSTE kalıbı · TAKSONOMİ · ROZET/KADEME

**Kaynak (salt okuma):** `/Users/gaviaworks/Developer/Backend Projects/dadagastro-profil`
Bu belgedeki her yol o kökten görecelidir. Her sayı ve her metin dosya:satır ile
işaretlidir; metinler `__()` çağrısının içindeki TR karşılığıyla birebir alınmıştır.
**Ölçüm tarihi:** 2026-08-30.

---

## 1 · LİSTE KALIBI

### 1.0 Kalıbın yayılımı (ölçüm)

`resources/views/admin/` altında `grep -rl` sayımı:

| Parça | Kaç blade |
|---|---|
| `class="ptable` | 42 |
| `pnl-page-head` | 76 |
| `class="filter-bar` | 25 |
| `pnl-empty` | 40 |
| `$x->links('vendor.pagination.admin')` | 32 |
| toplu seçim (`data-bulk`) | **1** (`moderasyon/yorumlar/index.blade.php`) |
| `.fb-sort` / `.gr-sortbar` seçici şeridi | **1** (`mutfaga-giris/index.blade.php`) |

### 1.1 Sayfa başlığı şeridi — `.pnl-page-head`

CSS: `public/reference/admin/sa-shell.css:333-340`

```
.pnl-page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:24px;flex-wrap:wrap}
.pnl-page-head h1{font-size:24px}
.pnl-page-head .ph-sub{margin-top:5px;font-size:13.5px;color:var(--muted)}
.pnl-page-head .ph-actions{display:flex;gap:10px;flex:none;flex-wrap:wrap;max-width:100%}
```

Mobil (`sa-shell.css:434-435`): `≤640px` → `h1{font-size:20px}` ve
**`.ph-actions{display:none}`** (düğme şeridi küçük ekranda tamamen kalkar).

İskelet her ekranda aynı:

```html
<div class="pnl-page-head">
  <div><h1>…</h1><div class="ph-sub">… · <strong>{sayı}</strong> {isim}</div></div>
  <div class="ph-actions">… düğmeler …</div>
</div>
```

Alt satır (`.ph-sub`) sabit gramer: *açıklama · **sayı** birim*.

| Ekran | h1 | `.ph-sub` (birebir) | Kaynak |
|---|---|---|---|
| Tarifler | `Tarifler` | `Kullanıcı gönderimleri + editöryel içerik — hibrit yönetim` · **{toplam}** `tarif` | `tarifler/index.blade.php:50-51` |
| Üyeler | `Üyeler & Yetki` (yönetici görünümünde `Yöneticiler`) | `Tüm üye hesapları` / `Yönetici hesapları (süper + gastro)` · **{toplam}** `kayıt` | `uyeler/index.blade.php:57-58` |
| Sayfalar | `Sayfalar & SEO` | `Statik içerik sayfaları ve arama motoru meta yönetimi` · **{all}** `sayfa` | `sayfalar/index.blade.php:46-47` |
| Malzemeler | `Malzemeler` | `Kanonik malzeme havuzu — tarif formunun repeater'ı burayı besler.` · **{toplam}** `malzeme` | `malzemeler/index.blade.php:56-57` |
| Püf Noktaları | `Püf Noktaları` | `Kullanıcı gönderimleri + editöryel içerik — hibrit yönetim` · **{toplam}** `püf noktası` | `puf-noktalari/index.blade.php:43-44` |
| Loglar | `Log Yönetimi` | `Son yapılan işlemler ve giriş denemeleri — kayıtlar görüntülemede salt-okunur; eski kayıtları kalıcı silme yalnız süper adminlere açıktır.` (sayaç YOK) | `loglar/index.blade.php:31-37` |
| Sözlük | `Sözlük` | `Mutfak terimleri sözlüğü` · **{count}** `terim` | `sozluk/index.blade.php:44-45` |
| Taksonomi | `{pageTitle}` (değişken) | `Kategori ve etiket sözlükleri` · **{grup}** `grup` · **{değer}** `değer` | `taksonomi/index.blade.php:126-127` |
| Rozetler | `Rozet Yönetimi` | `Topluluk rozetleri ve şef kademe eşikleri —` {n} `kategori,` {n} `rozet.` | `rozetler/index.blade.php:24-25` |
| Kademeler | `Kademeler` | `Topluluk rütbe sistemi · katkı puanına göre üye seviyeleri ·` **{toplam}** `kademe` | `kademeler/index.blade.php:21-22` |

#### Düğme şeridi — sıra, sınıf, ikon

Kural (`tarifler/index.blade.php:56-67` yorumu): **ikincil `btn-ghost` düğmeler SOLDA,
birincil `btn-acc` CTA en SAĞDA**; yeni ikincil düğme referans düğmelerin
ARASINA değil SONUNA eklenir.

| Ekran | Sıra (soldan sağa) | Kaynak |
|---|---|---|
| Tarifler | `btn btn-ghost btn-sm` `fa-tags` **Kategorileri Yönet** → `btn-ghost` `fa-carrot` **Malzemeleri Yönet** → `btn-ghost` `fa-download` **Dışa Aktar** → `btn btn-acc btn-sm` `fa-plus` **Yeni Tarif** | `tarifler/index.blade.php:55-67` |
| Üyeler | `btn-ghost` `fa-download` **Dışa Aktar** → `btn-acc` `fa-plus` **Yeni Kullanıcı** (`@can('assign-roles')` ile koşullu) | `uyeler/index.blade.php:63-68` |
| Sayfalar | `btn-ghost` `fa-download` **Dışa Aktar** → `btn-ghost` `fa-bullseye` **Yeni SEO Sayfası** → `btn-acc` `fa-plus` **Yeni Sayfa** | `sayfalar/index.blade.php:49-55` |
| Malzemeler | `btn-acc` `fa-plus` **Yeni Malzeme** (`<button>`, modal açar) | `malzemeler/index.blade.php:59-61` |
| Püf | `btn-acc` `fa-plus` **Yeni Püf Noktası** | `puf-noktalari/index.blade.php:46-48` |
| Loglar | `btn-ghost` `fa-file-arrow-down` **CSV İndir** → `@can('delete-audit-logs')` içinde `<select class="fselect" name="period">` + `btn-ghost` `fa-trash-can` **Toplu Sil** | `loglar/index.blade.php:39-67` |
| Sözlük | `btn-ghost` `fa-download` **Dışa Aktar** → `btn-ghost` `fa-tags` **Kategorileri Yönet** → `btn-acc` `fa-plus` **Yeni Terim** | `sozluk/index.blade.php:47-52` |
| Taksonomi | `btn-acc` `fa-plus` **Yeni Değer** (`<button>`, modal açar) | `taksonomi/index.blade.php:129-131` |
| Rozetler | `btn-ghost` `fa-download` **Dışa Aktar** (`disabled`, `title="Bu dilimde henüz aktif değil"`) → `btn-acc` `fa-plus` **Yeni Rozet** | `rozetler/index.blade.php:27-30` |
| Kademeler | `btn-acc` `fa-plus` **Yeni Kademe** | `kademeler/index.blade.php:24-26` |

Düğme CSS: `sa-shell.css:88-97` — `.btn` 14px/26px dolgu, `.btn-sm{padding:10px 16px;font-size:13px}`.

Bazı ekranlarda başlığın ÜSTÜNDE geri linki var: `.back-link`
(`mutfaga-giris/index.blade.php:92`, tanım `sa-ui.css:252-254`).

### 1.2 Filtre şeridi — `.filter-bar`

Kanonik tanım `public/reference/admin-kullanicilar/sa-kullanicilar.css:6-43`
(tarifler kopyası `admin-tarifler/sa-tarifler.css:42-55` — yalnız dolgu 16px→14px
ve `.chip.is-on` kenar rengi farkı):

```
.filter-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:16px 22px;border-bottom:1px solid var(--line)}
.filter-bar .fb-search{flex:1;min-width:200px;max-width:320px;position:relative}   /* tarifler: max-width:340px */
.filter-bar .fb-search input{width:100%;height:38px;padding:0 12px 0 34px;font-size:13px;…}
.chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.chip{font-size:12.5px;font-weight:500;padding:7px 14px;border-radius:var(--radius-sm);…}
.chip .ch-cnt{font-size:10.5px;font-weight:700;background:rgba(var(--acc-rgb),.15);color:var(--acc-deep);min-width:18px;height:17px;padding:0 5px;…}
.chip.is-on{border-color:var(--acc);color:var(--acc-deep);background:rgba(var(--acc-rgb),.10);font-weight:700}
.chip.is-on .ch-cnt{background:rgba(var(--acc-rgb),.22)}
```

Arama kutusunun içinde solda `<i class="fa-solid fa-magnifying-glass">` mutlak
konumlu (`left:12px`), `pointer-events:none`.

#### Arama kutusu — GET adı ve yer tutucu (birebir)

| Ekran | GET adı | Yer tutucu | Mekanizma | Kaynak |
|---|---|---|---|---|
| Tarifler | `q` | `Tarif adı veya gönderen ara…` | sunucu GET (`<form class="fb-search">`) | `tarifler/index.blade.php:76-82` |
| Üyeler | `q` | `Ad, e-posta ara…` | sunucu GET | `uyeler/index.blade.php:74-83` |
| Sayfalar | — (`id="pgSearch"`) | `Sayfa adı, URL ara…` | **istemci JS** | `sayfalar/index.blade.php:61-64` |
| Malzemeler | `q` | `Malzeme ara…` | sunucu GET | `malzemeler/index.blade.php:66-69` |
| Püf | `q` | `Püf noktası veya gönderen ara…` | sunucu GET | `puf-noktalari/index.blade.php:56-62` |
| Loglar (işlemler) | `q` (`type="search"`) | `Kullanıcı veya işlem ara…` | sunucu GET | `loglar/index.blade.php:89-95` |
| Loglar (girişler) | `q` | `Kullanıcı, e-posta veya IP ara…` | sunucu GET | `loglar/index.blade.php:153-158` |
| Sözlük | — (`id="cSearch"`) | `Terim ara — örn. benmari, jülyen…` | **istemci JS** | `sozluk/index.blade.php:58` |
| Taksonomi | — (`id="catSearch"`) | `Değer ara…` | **istemci JS**, `.tx-search` kabında (filter-bar değil) | `taksonomi/index.blade.php:178-181` |
| Mutfağa Giriş | `q` | `Ders ara…` (uzun hâli `aria-label`/`title`'da) | sunucu GET | `mutfaga-giris/index.blade.php:171-172` |

**Kural (ölçülmüş):** sunucu-taraflı GET aramada form, o an aktif diğer filtreleri
`<input type="hidden">` ile taşır — böylece arama gönderimi diğer filtreyi düşürmez
(`tarifler:79-81`, `uyeler:77-82`, `puf:59-61`, `loglar:93-94`).

**Kural 2 (`sozluk/index.blade.php:10-15` + `taksonomi` madde 2):** istemci-taraflı
arama olan ekranda sunucu sayfalaması YOKTUR (tüm satırlar tek seferde DOM'a basılır),
onun yerine istemci-taraflı sayfalama vardır. Sunucu GET araması olan ekranda Laravel
paginator kullanılır.

#### Süzgeç çipleri

Çip iki biçimde var: **`<a>` (sunucu GET, tam sayfa yenilenir)** ve
**`<button data-*>` (istemci JS)**. Dönüşüm kararı `tarifler/index.blade.php:11-15`de
yazılı: "referansta client-JS filtre; burada gerçek GET query-string + `<a>` linkleri".

**Tarifler** (`tarifler/index.blade.php:83-92`), qs parametresi `status`:

| Çip metni | `data-status` / query | Sayaç |
|---|---|---|
| `Tümü` | `status` yok | `{{ $totalRecipes }}` |
| `Onay Bekliyor` | `status=review` | `$statusCounts['review']` |
| `Yayında` | `status=published` | … |
| `Gizli` | `status=hidden` | … |
| `Şikayetli` | `status=flagged` | … |

Etiketler `$statusLabels` haritasından (`tarifler/index.blade.php:30-35`).
**Püf Noktaları aynı beş çipi, aynı `status` parametresiyle taşır**
(`puf-noktalari/index.blade.php:20-25, 63-72`).

**Üyeler** (`uyeler/index.blade.php:88-118`) — **tek `.chips` kabında İKİ eksen**
(durum + rol), aralarında ayırıcı yok, dar ekranda doğal `flex-wrap`:

- Durum ekseni, parametre `status`: `Tüm Durumlar` · `Aktif` (`active`) ·
  `Askıda` (`frozen`) · `Pasif` (`passive`) · `Silme Bekliyor` (`pending_deletion`)
  — `uyeler/index.blade.php:36`.
- Rol ekseni, parametre `role`: `Tüm Roller` + `$roles` döngüsü.
  Yönetici görünümünde (`$adminView`) ray daralır: `Tüm Yöneticiler` (`role=admin`)
  + `gastro-admin` + `super`.

**Sayfalar** (`sayfalar/index.blade.php:65-69`) — `<button class="chip" data-st="…">`,
istemci JS: `Tümü` (`all`) · `Yayında` (`published`) · `Taslak` (`draft`).

**Sözlük** (`sozluk/index.blade.php:57-73`) — filtre şeridinde **üç** kontrol:
1. arama (`#cSearch`)
2. **A-Z barı (BİRİNCİL)** — `.az-bar#azBar`, ilk düğme `.az.az-all.active`
   `data-ltr="*"` metni `Tümü`; harfler JS ile enjekte edilir
   (`'A B C Ç D E F G Ğ H I İ J K L M N O Ö P R S Ş T U Ü V Y Z'`,
   `sozluk/index.blade.php:149`), o harfte terim yoksa `disabled`.
3. **kategori (İKİNCİL)** — `.fb-cats` içinde `<span class="fb-cats-lbl">Kategori</span>`
   + `.chips#catChips`, çipler `data-cat="{slug}"`, ilki `Tümü`.

**Moderasyon/Yorumlar** (`moderasyon/yorumlar/index.blade.php:60-71`) — çip
kümesi: `Kuyruk` + durum enum döngüsü + `Tümü` (`status=all`).

#### Açılır menü (select) kullanan yerler

Evet, iki ekranda var; **sayaçlı çip kiti yatayda sığmadığında select'e dönülür**
(karar ve ölçüm `mutfaga-giris/index.blade.php:33-63, 183-190`: dört sayaçlı çip
tek başına 428px, 998px'lik sütuna asla sığmıyordu → çipler bırakıldı, sayaçlar
seçenek metnine girdi).

- **Loglar** (`loglar/index.blade.php:99-110, 162-167`) — `<select class="fselect"
  onchange="this.form.submit()">`, ayrı GET formu. İşlemler sekmesi:
  `Tüm Modüller` (`module`) + `Tüm İşlemler` (`kind`). Girişler sekmesi:
  `Tüm Olaylar` (`event`) → `Giriş` (`login`) · `Çıkış` (`logout`) ·
  `Başarısız` (`failed`).
- **Mutfağa Giriş** (`mutfaga-giris/index.blade.php:178-215`) — `.fb-sort`
  şeridinde altı select: `status` (metni `Durum (:count)` + her seçenekte sayaç),
  `topic`, `level`, `access`, `route`, `completeness`. Görünür `<label>` YOK;
  alan adı boş seçeneğin metnindedir, erişilebilirlik `aria-label` ile.
  `.fb-sort` tanımı `sa-ui.css:271-274` (`margin-left:auto`, select `height:34px`).

`.fselect` yalnız 2 liste ekranında (loglar, kreatifler); kalan 26 kullanım form
ekranlarındadır.

### 1.3 Sıralama

**Ölçüm: kolon başlığına tıklanarak sıralama HİÇBİR admin listesinde yok.**
`data-sort` / `sortable` / `name="sort"` taraması yalnız şunları buluyor:

- `sortablejs@1.15.2` CDN'i — **satır sürükleme**, ve yalnız FORM ekranlarında
  (`tarifler/form`, `icerik/form`, `puf-noktalari/form`, `sayfalar/form`,
  `koleksiyonlar/form`, `mutfaga-giris/form`) — liste ekranlarında değil.
- `name="sort"` sayı kutusu — `sozluk/kategoriler/_row.blade.php:24` ve
  `sozluk/kategoriler/index.blade.php:79` (`width:80px`, `title="Sıra"`).

Liste sırası controller'da sabittir; ör. `CommunityTierController.php:39`
`orderBy('level')`, `BadgeController.php:47` `orderBy('category')->orderBy('name')`,
`TaxonomyController` (renderConsole) `orderBy('position')->orderBy('id')`.

### 1.4 Tablo — `.ptable`

CSS `sa-kullanicilar.css:46-61`:

```
.ptable{width:100%;border-collapse:collapse}
.ptable th{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:12px 16px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
.ptable th:first-child{padding-left:22px}
.ptable th:last-child{padding-right:22px;text-align:right}
.ptable td{padding:14px 16px;border-bottom:1px solid var(--line);font-size:13.5px;vertical-align:middle}
.ptable tr:last-child td{border-bottom:none}
.ptable tr:hover td{background:var(--bg)}
```

Tablo `<div class="ptable-wrap">` içine sarılır — `resources/css/admin.css:88`
`overflow-x:auto` + kenarlık + `--radius-lg`; gerekçe blade'lerde yazılı:
"390px yatay taşma fix'i, QA bulgusu 2026-07-14" (`tarifler:106`, `uyeler:123`).
Tablo `.pnl-card > .pc-body.flush` (dolgu 0, `sa-shell.css:351`) içindedir.

**Kolon adları (sırayla) ve hücre içeriği:**

| Ekran | Kolonlar | Kaynak |
|---|---|---|
| Tarifler | `Tarif` · `Sahip` · `Kaynak` · `Kategori` · `Durum` · `Aksiyon` | `tarifler/index.blade.php:110-117` |
| Üyeler | `Kullanıcı` · `Rol / Grup` · `Durum` · `Son Giriş` · `Aksiyon` | `uyeler/index.blade.php:127-133` |
| Sayfalar | `Sayfa` · `SEO Durumu` · `Durum` · `Güncellenme` · `Aksiyon` | `sayfalar/index.blade.php:75-81` |
| Malzemeler | `Ad` · `Anahtar (slug)` · `Kategori` · `Kullanım` · `Durum` · `Aksiyon` | `malzemeler/index.blade.php:82-89` |
| Püf | `Püf Noktası` · `Sahip` · `Kaynak` · `Kategori` · `Durum` · `Aksiyon` | `puf-noktalari/index.blade.php:89-96` |
| Loglar/işlemler | `Zaman` · `Kullanıcı` · `Modül` · `Kayıt` · `İşlem` (Aksiyon kolonu YOK) | `loglar/index.blade.php:119-125` |
| Loglar/girişler | `Zaman` · `Kullanıcı` · `Olay` · `IP` | `loglar/index.blade.php:177-181` |
| Sözlük | `Terim` · `Kategori` · `Harf` · `Durum` · `Aksiyon` | `sozluk/index.blade.php:78-84` |
| Rozetler | `Rozet` · `Kategori` · `Tetik` · `Durum` · (boş `.act`) | `rozetler/index.blade.php:49` |
| Yorumlar | ☐ seç · `Yazar` · `Yorum` · `İçerik` · `Durum` · `Tarih` · … | `moderasyon/yorumlar/index.blade.php:95-101` |

**Kimlik hücresi** — üç lehçe, hepsi ikon/görsel + iki satır metin:

- `.rcp-cell` (tarifler/püf, `sa-tarifler.css:70-75`): `.rcp-thumb` 52×52
  `background-image` + `.rcp-name` (13.5px/700, `max-width:230px` ellipsis) +
  `.rcp-by` (12px muted, ikon+ad). Editöryel satırda `fa-shield-halved` + `Editöryel`,
  kullanıcı satırında `fa-regular fa-user` + yazar adı.
- `.u-cell` (üyeler, `sa-kullanicilar.css:64-76`): `x-profile.avatar` 38px yuvarlak
  (`.u-ava`, `--radius-circle`, `border:2px solid var(--line)`, baş harf varyantı
  `.u-ava.initials`) + `.u-name` + `.u-email`.
- `.pg-cell` (sayfalar/sözlük): `.pg-ico` kare + `.pg-title` + `.pg-url` (sayfalar,
  `/{slug}`) ya da `.tg-gloss` (sözlük, `foreign_form`). Sözlükte `.pg-ico`nun
  içeriği **harfin kendisidir** (`sozluk/index.blade.php:91`).

**Durum rozeti** — `.pstat`, semantik ve accent'ten bağımsız (`sa-shell.css:367-373`):

```
.pstat{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:var(--radius-sm);white-space:nowrap}
.pstat::before{content:"";width:6px;height:6px;border-radius:var(--radius-circle);background:currentColor}
.pstat.ok  {background:var(--green-tint);color:var(--green-deep)}
.pstat.wait{background:#FCF3DD;color:#B8860B}
.pstat.off {background:var(--bg);color:var(--muted);border:1px solid var(--line)}
.pstat.warm{background:var(--tomato-tint);color:var(--tomato)}
```

Ek varyant: `.pstat.rare{background:#FCF3DD;color:#B8860B}` (`sa-rozetler.css:34`).

Durum→sınıf haritaları blade'in `@php` başında sabittir:

- İçerik (`tarifler:36`, `puf:26`): `review→wait · published→ok · hidden→off ·
  flagged→warm · draft→off · rejected→off · removed→off`
- Üye (`uyeler:37`): `active→ok · frozen→warm · passive→off · pending_deletion→off`
- Log işlem türü (`loglar:16`): `created→ok · updated→warm · deleted→off · other→wait`
- Log olay (`loglar:17`): `login→ok · logout→wait · failed→off`

`flagged` durumunda `.pstat` yerine `.flag-badge` basılır:
`<i class="fa-solid fa-flag"></i> {count} şikayet` (`tarifler/index.blade.php:161-162`;
CSS `sa-tarifler.css:89`).

**Diğer hücre pilleri:**

- `.src-pill.admin` / `.src-pill.user` — kaynak (`Editöryel`/kullanıcı),
  `sa-tarifler.css:83-86`.
- `.cat-tag` + iç `.cat-tag-txt` — kategori; metin AYRI span'de olduğu için ellipsis
  yalnız metni kırpar, ikonu sıkıştırmaz (`max-width:112px`, `sa-tarifler.css:78-80`;
  gerekçe `tarifler/index.blade.php:152-154`).
- `.role-pill` + varyant (`super`/`isletme`/`uye`/…) — `sa-kullanicilar.css:79-89`.
- `.seo-pill` `good`/`mid`/`low` — skor eşiği 75/50, etiket `İyi`/`Orta`/`Düşük`
  + ` · {skor}` (`sayfalar/index.blade.php:86-88, 100`).
- `.tg-cat` / `.tg-harf` — sözlük kategori ve harf hücresi.

**Tarih biçimleri (ölçüldü):**

| Yer | Biçim | Kaynak |
|---|---|---|
| Sayfalar "Güncellenme" | `<div class="upd"><b>{d M}</b> {H:i}</div>` | `sayfalar/index.blade.php:102` |
| Üyeler "Son Giriş" | `<div class="last-login" title="{d F Y H:i}"><b>{Bugün\|Dün\|d M}</b> {H:i}</div>`; kayıt yoksa `Henüz giriş yok` | `uyeler/index.blade.php:44-49, 155-161` |
| Loglar "Zaman" | `d.m.Y H:i` | `loglar/index.blade.php:131, 186` |
| Rozet kazanma tarihi | `d M Y`, null ise `—` | `rozetler/form.blade.php:197` |

**Responsif kolon gizleme** — iki farklı yöntem:

- Sınıf tabanlı (üyeler, `sa-kullanicilar.css:125-131`): `≤800px` → `.col-lastlogin`,
  `≤640px` → `.col-role` gizlenir + `.filter-bar{padding:12px 16px}`.
- `nth-child` tabanlı (tarifler, `sa-tarifler.css:107-119`): `≤1100px` → 2. (Sahip)
  ve 4. (Kategori) kolon; `≤780px` → 3. (Kaynak) kolon gizlenir.
  ⚠ Bu kural kapsamsızdır ve başka ekranı bozar — Loglar bunu ayrı bir dosyayla
  geri alıyor (`loglar/index.blade.php:25-27` → `public/css/admin-loglar.css`).

### 1.5 Satır eylemleri — `.row-acts` / `.ia-btn`

CSS `sa-kullanicilar.css:92-100` (tarifler kopyası `sa-tarifler.css:93-96`):

```
.row-acts{display:flex;align-items:center;justify-content:flex-end;gap:6px}
.ia-btn{width:32px;height:32px;border-radius:var(--radius-sm);border:1px solid var(--line);background:var(--paper);color:var(--muted);font-size:13px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.ia-btn:hover{border-color:var(--acc);color:var(--acc-deep);background:rgba(var(--acc-rgb),.07)}
.ia-btn.ok:hover{border-color:var(--green-deep);color:var(--green-deep);background:var(--green-tint)}
.ia-btn.danger:hover{border-color:var(--tomato);color:var(--tomato);background:var(--tomato-tint)}
```

**32×32 metinsiz ikon karesi.** Sağa yaslı (`.ptable td:last-child{text-align:right}`).

**Durum-koşullu matris (HİBRİT)** — `tarifler/index.blade.php:167-189`:

| Satır durumu | Görünen düğmeler |
|---|---|
| her satır | `fa-eye` **Detay** (link) |
| `source=editorial` | + `fa-pen` **Düzenle** |
| `user` + `review` | + `ia-btn ok` `fa-check` **Onayla** (POST form) + `ia-btn danger` `fa-xmark` **Reddet** |
| `user` + `published` | + `fa-star` **Öne Çıkar** (POST) + `ia-btn danger` `fa-eye-slash` **Gizle** |
| `user` + `hidden` | + `ia-btn ok` `fa-eye` **Yayına Al** (POST) |
| `user` + `flagged` | + `ia-btn danger` `fa-eye-slash` **Gizle** |

Püf Noktaları aynı matrisi taşır, iki farkla (`puf-noktalari/index.blade.php:144-170`):
editöryel satırda `fa-pen` + `ia-btn danger` `fa-trash-can` **Sil**; `flagged`da
Onayla+Gizle birlikte; ve kaldırılmamış HER kullanıcı satırında ayrıca
`ia-btn danger` `fa-circle-minus` **Kaldır**. Ayrıca kategori hücresinde satır-içi
`fa-wand-magic-sparkles` **İkonu değiştir** düğmesi modal açar
(`puf-noktalari/index.blade.php:132-138`).

Diğer ekranlar:

- Üyeler: `fa-eye` Detay + koşullu `fa-pen` Düzenle — guard aynası
  (`$user->id !== auth()->id() && (!$targetIsAdmin || $actorIsSuper)`),
  **403'e link üretilmez** (`uyeler/index.blade.php:163-176`).
- Sayfalar: `fa-pen` Düzenle + `<form DELETE>` içinde `ia-btn danger` `fa-trash` Sil
  (`sayfalar/index.blade.php:104-113`).
- Sözlük: aynı ikili (`sozluk/index.blade.php:99-112`).
- Malzemeler: `fa-pen` Düzenle (modal açar, satır verisi `data-*`'ta) + **silme
  kilidi**: `recipe_ingredients_count > 0` ise `<span class="ia-btn"
  aria-disabled="true" title="Kullanımda olan malzeme silinemez">` `fa-lock`,
  değilse DELETE formu + `fa-trash` (`malzemeler/index.blade.php:111-136`).
- Rozetler/Kademeler listesi: `.bz-edit` **metinli** düğme (`fa-pen` + `Düzenle`),
  32px ikon karesi değil (`rozetler/index.blade.php:70, 88`; CSS `sa-rozetler.css:28-30`).

**Yıkıcı eylemde onay — iki yol, ikisi de `saConfirm` modalına çıkar:**

1. **Global delege (tercih edilen)** — `type="submit"` + `fa-trash` ikonlu buton,
   gerçek `<form method=POST>@method('DELETE')` içinde. `sa-ui.js`in capture-fazlı
   delegesi otomatik yakalar, onaydan sonra `form.requestSubmit()` eder. Sayfa
   kendi `saConfirm`ini YAZMAZ (`sozluk/index.blade.php:104-110`,
   `sayfalar/index.blade.php:106-111`).
2. **Sayfa-özel `saConfirm` + dinamik POST** — metinsiz ikon-butonlar
   (`fa-eye-slash`, `fa-xmark`) hiçbir yıkıcı türe girmediğinden delege onları
   yakalamaz. `postTo(url)` CSRF'li gizli form üretir
   (`tarifler/index.blade.php:209-261`; `_method` spoof'lu sürümü
   `puf-noktalari/index.blade.php:222-246`).
   İkisi çakışırsa `data-no-confirm` ile delege pas geçilir
   (`taksonomi/index.blade.php:234-241`, `loglar/index.blade.php:57-63`).

Onay modalı metinleri birebir (`tarifler/index.blade.php:227-242`):

| Tür | `title` | mesaj (ad varken) | `ok` | `cancel` |
|---|---|---|---|---|
| `gizle` | `Tarif gizlensin mi?` | `“{ad}” yayından kaldırılacak; kullanıcılar tarafından görüntülenemeyecek.` | `Gizle` | `Vazgeç` |
| `reddet` | `Gönderim reddedilsin mi?` | `“{ad}” reddedilecek; gönderen kullanıcı bilgilendirilir ve tarif yayınlanmaz.` | `Reddet` | `Vazgeç` |

Adsız yedek metinler: `Bu tarif yayından kaldırılacak.` / `Bu gönderim reddedilecek.`
Püf sürümünde aynı kalıp, "tarif"→"püf noktası"/"içerik"
(`puf-noktalari/index.blade.php:248-261`).

Modal CSS `sa-ui.css:49-70`: `.sa-modal-ov` (rgba(25,22,15,.55) + blur(2px)),
`.sa-modal` (`width:min(420px,100%)`, `--radius-lg`), `.sa-modal.danger .sa-modal-ico`
tomato tonunda.

### 1.6 Toplu işlem

**Ölçüm: 42 tablolu ekranın 1'inde satır-seçimli toplu işlem var.**

`moderasyon/yorumlar/index.blade.php:75-90` — blade'in kendi yorumu bunu
"bu ekrana özel" diye işaretliyor (`:16`).

- Kap: `<form method="POST" action="admin.moderation.reviews.bulk" id="rvwBulkForm">`
  + `<input type="hidden" name="action" id="rvwBulkAction">`
- Seçim çubuğu `.rvw-selbar` başlangıçta `hidden`; ≥1 satır seçilince JS gösterir.
  Metni: `<span id="rvwSelCount">0</span> yorum seçili`
- Eylemler (`data-bulk`): `ia-btn ok` `fa-check` **Onayla** (`onayla`) ·
  `ia-btn danger` `fa-eye-slash` **Gizle** (`gizle`) · `ia-btn danger` `fa-xmark`
  **Reddet** (`reddet`) · `ia-btn` `fa-circle-minus` **Kaldır** (`kaldir`) ·
  `.rvw-selbar-clear` **Seçimi Temizle**
- Tabloda ilk kolon `<th class="rvw-check-col"><input type="checkbox" id="rvwSelectAll"
  aria-label="Tümünü seç"></th>`
- Onay: `saConfirm` → `bulkForm.submit()` (`:353-375`)

İkinci bir "toplu" var ama satır seçimi değil, **dönem bazlı retention silme**:
Loglar sayfa başlığındaki `<select name="period">` (`:n aydan eski`) +
`Toplu Sil` düğmesi, `@can('delete-audit-logs')` (yalnız super) arkasında;
onay mesajı `"{dönem etiketi}" kapsamındaki tüm log kayıtları kalıcı olarak
silinecek. Bu işlem geri alınamaz.` (`loglar/index.blade.php:46-66, 222-233`).

### 1.7 Sayfalama

**Yeri:** `.pnl-card`ın en altı — sunucu tarafında `{{ $items->links('vendor.pagination.admin') }}`
`.pc-body`ın DIŞINDA, `.pnl-card`ın içinde (`tarifler/index.blade.php:201`);
istemci tarafında `<div class="pager" id="…Pager" style="display:none">`
`.pc-body` içinde, tablo ile boş durum arasında (`sozluk/index.blade.php:127`).

**Markup** — `resources/views/vendor/pagination/admin.blade.php`:

```html
<div class="pager">
  <div class="pager-info">{{ ':total sonuçtan :first–:last gösteriliyor' }}</div>
  <div class="pager-btns">
    <span class="pg-btn is-off" aria-disabled="true"><i class="fa-solid fa-chevron-left"></i></span>   <!-- ilk sayfada -->
    <a class="pg-btn" href="…" rel="prev" aria-label="Önceki"><i class="fa-solid fa-chevron-left"></i></a>
    <span class="pg-dots">…</span>
    <span class="pg-btn is-on" aria-current="page">3</span>
    <a class="pg-btn" href="…">4</a>
    <a class="pg-btn" href="…" rel="next" aria-label="Sonraki"><i class="fa-solid fa-chevron-right"></i></a>
  </div>
</div>
```

**"X sonuçtan a–b" metninin tam biçimi:**
`:total sonuçtan :first–:last gösteriliyor` — ayırıcı **en-dash (–)**, sayılar
`number_format()` ile (istemci sürümünde `toLocaleString('tr')`).
`vendor/pagination/admin.blade.php:7`, istemci eşi `sozluk/index.blade.php:158`.

CSS `sa-kullanicilar.css:107-122`: `.pager` üst kenarlıklı, `padding:14px 22px`,
`justify-content:space-between`; `.pg-btn` `min-width:34px;height:34px`;
`.pg-btn.is-on{border-color:var(--acc);background:var(--acc);color:#fff}`.

**Sayfa penceresi:** sunucuda Laravel `elements()`; istemcide birebir eşi
`pageWindow(total,current)` — ≤7 sayfa hepsi, üstünde `[1,2,son-1,son,aktif±1]`
+ aralara `…` (`sozluk/index.blade.php:178-192`, `sayfalar/index.blade.php:156-163`).

**Sayfa boyutu (ölçüldü):** sözlük istemci `PER_PAGE=40` (`sozluk:150`),
sayfalar istemci `PER_PAGE=30` (`sayfalar:148`), rozetler sunucu `paginate(30)`
(`BadgeController.php:47`), kademeler `paginate(50)` (`CommunityTierController.php:39`).

### 1.8 Boş durum — `.pnl-empty`

CSS `sa-shell.css:404-408`:

```
.pnl-empty{padding:54px 24px;text-align:center}
.pnl-empty .pe-ico{width:60px;height:60px;margin:0 auto 16px;border-radius:var(--radius-md);background:rgba(var(--acc-rgb),.12);color:var(--acc-deep);display:flex;align-items:center;justify-content:center;font-size:23px}
.pnl-empty h4{font-size:16px;margin-bottom:6px}
.pnl-empty p{font-size:13px;color:var(--muted);max-width:340px;margin:0 auto 8px}
.pnl-empty .pe-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--acc-deep);background:rgba(var(--acc-rgb),.12);padding:5px 12px;border-radius:999px;margin-top:10px}
```

İskelet: `.pe-ico` (ikon) → `<h4>` → `<p>` → `.pe-tag` (çıkış düğmesi, ikonlu,
BÜYÜK HARF).

| Ekran | `.pe-ico` ikonu | h4 | p | `.pe-tag` | Kaynak |
|---|---|---|---|---|---|
| Tarifler | `fa-utensils` | `Tarif bulunamadı` | `Arama veya filtre kriterlerine uyan tarif yok. Filtreyi sıfırlamayı deneyin.` | `fa-filter` `Filtreyi Temizle` | `tarifler/index.blade.php:99-104` |
| Püf | `fa-regular fa-lightbulb` | `Püf noktası bulunamadı` | `Arama veya filtre kriterlerine uyan püf noktası yok. Filtreyi sıfırlamayı deneyin.` | `fa-filter` `Filtreyi Temizle` | `puf-noktalari/index.blade.php:79-84` |
| Üyeler | `fa-users-gear` | `Kullanıcı bulunamadı` | `Arama veya filtre kriterlerine uyan kayıt yok. Filtreyi sıfırlamayı dene.` | **yok** | `uyeler/index.blade.php:188-192` |
| Sayfalar | `fa-file-lines` | `Sayfa bulunamadı` | `Arama veya filtre kriterlerine uyan sayfa yok. Filtreyi sıfırlayın ya da yeni sayfa ekleyin.` | `fa-plus` `Yeni Sayfa Ekle` | `sayfalar/index.blade.php:124-129` |
| Sözlük | `fa-spell-check` | `Terim bulunamadı` | `Arama veya filtre kriterlerine uyan terim yok. Filtreyi sıfırlayın ya da yeni terim ekleyin.` | `fa-plus` `Yeni Terim Ekle` | `sozluk/index.blade.php:129-134` |
| Taksonomi | `fa-tags` | `Kategori bulunamadı` | `Aramaya uyan değer yok. Aramayı temizleyin ya da bu gruba yeni bir değer ekleyin.` | `fa-plus` `Yeni Değer Ekle` (`<button>`) | `taksonomi/index.blade.php:257-262` |
| Loglar/işlemler | `fa-clock-rotate-left` | `İşlem kaydı bulunamadı` | `Seçili filtreye uyan bir kayıt yok. Filtreyi sıfırlamayı deneyin.` | `fa-filter` `Filtreyi Temizle` | `loglar/index.blade.php:144-149` |
| Loglar/girişler | `fa-right-to-bracket` | `Giriş kaydı bulunamadı` | (aynı) | `fa-filter` `Filtreyi Temizle` | `loglar/index.blade.php:205-210` |
| Malzemeler | `fa-carrot` (⚠ `.pe-ico` sarmalayıcısı YOK, `<h3>` kullanıyor — kalıptan sapma) | `Malzeme bulunamadı` | `Arama kriterine uyan malzeme yok ya da havuz henüz boş.` | yok | `malzemeler/index.blade.php:73-77` |
| Kademeler | `<x-empty-state>` bileşeni, `fa-ranking-star` | `Henüz kademe tanımlanmadı` | `İlk kademeyi ekleyerek topluluk rütbe sistemini kur.` | — | `kademeler/index.blade.php:66` |

**Görünürlük mantığı:** sunucu filtreli ekranda `@if ($items->isEmpty())` ile
render edilir; istemci filtreli ekranda DOM'da hep durur, `style="display:none"`
ile başlar, JS `display:block` yapar (`sayfalar:124`, `sozluk:129`).

### 1.9 Flash şeridi

Tablonun/başlığın üstünde: `<div class="sa-flash" role="status">
<i class="fa-solid fa-circle-check"></i> İşlem tamamlandı.</div>`
(`tarifler/index.blade.php:43-45`). Sayfalar ekranı üç ayrı metin taşır:
`Sayfa oluşturuldu.` / `Sayfa güncellendi.` / `Sayfa silindi.`
(`sayfalar/index.blade.php:36-42`).
CSS `resources/css/admin.css:146` (yeşil) + `.sa-flash.is-note` nötr varyantı (`:151`).
Hata varyantı inline yazılıyor: `malzemeler/index.blade.php:48-52`
(`role="alert"`, tomato tonları, `fa-circle-exclamation`).

### 1.10 Yayınlama / taslak / sıralama durum sözlüğü

| Alan | Değerler | Rozet sınıfı |
|---|---|---|
| Tarif/Püf (`RecipeStatus`/`TipStatus`) | `review` `Onay Bekliyor` · `published` `Yayında` · `hidden` `Gizli` · `flagged` `Şikayetli` (+`draft`/`rejected`/`removed`) | `wait`/`ok`/`off`/`warm` (+`off`) |
| Sayfa (`PageStatus`) | `published` `Yayında` · `draft` `Taslak` | `ok` / `wait` |
| Üye | `active` `Aktif` · `frozen` `Askıda` · `passive` `Pasif` · `pending_deletion` `Silme Bekliyor` | `ok`/`warm`/`off`/`off` |
| Malzeme | `approved` `Onaylı` · `suggested` `Öneri` | `ok` / `wait` |
| Sözlük terimi | `yayinda` → `ok`, diğeri `wait` | `sozluk/index.blade.php:97` |
| Rozet | `draft` `Taslak` → `off`; `is_rare` → `Nadir` `rare`; aksi `Yayında` `ok` | `rozetler/index.blade.php:62-68` |

**Sıralama durumu diye ayrı bir rozet YOK.** Sıra bir alan olarak yalnız sözlük
kategorilerinde (`name="sort"` sayı kutusu) ve taksonomide (`position`, formda
görünmez, controller `orderBy`ında) yaşar.

---

## 2 · TAKSONOMİ

Ekran: `resources/views/admin/taksonomi/index.blade.php` (829 satır)
CSS: `public/reference/admin-taksonomi/sa-taksonomi.css` (186 satır)
Controller: `app/Http/Controllers/Admin/TaxonomyController.php`

### 2.1 Kaç sözlük yönetiliyor, adları

`app/Domain/Gastro/Enums/TaxonomyType.php` — **10 case**, hepsi tek `taxonomies`
tablosunun `type` kolonunda (tarif-plan.md §1 KARAR 4):

| `value` | Etiket (`label()`) | İkon (`taksonomi/index.blade.php:73-83`) | Bağlı modül (`:96-101`) |
|---|---|---|---|
| `category` | `Kategori` | `fa-utensils` | Tarifler |
| `cuisine` | `Mutfak` | `fa-earth-europe` | Tarifler |
| `diet_tag` | `Beslenme / Tip` | `fa-leaf` | Tarifler |
| `meal_mode` | `Yemek Modu` | `fa-clock` | Tarifler |
| `meal` | `Öğün` | `fa-bowl-food` | Tarifler |
| `tag` | `Etiket` | `fa-hashtag` | Tarifler |
| `content_category` | `İçerik Kategorisi` | `fa-feather` | Blog & İçerik |
| `tip_category` | `Püf Kategorisi` | `fa-lightbulb` | Blog & İçerik |
| `ingredient_category` | `Ansiklopedi Kategorisi` | `fa-carrot` | Ansiklopedi |
| `gurme_category` | `Gurme Lezzet Kategorisi` | `fa-champagne-glasses` | DadaGourmet |

`TaxonomyType.php:8-24`: marka sökümünde Gourmet (mekân/etkinlik) ve Diet
(besin/program/diyetisyen) case'leri kaldırıldı; `DietTag` Gastro'nun kendi
beslenme ekseni olduğu için KALDI (21 satır, 7.296 tarif bağı);
`GurmeCategory` içerik kararı beklediği için geçici duruyor.

**Aynı view iki konsola hizmet eder** (`taksonomi/index.blade.php:62-71`):
`admin.taxonomies.index` ve `admin.gourmet.taksonomiler` →
`TaxonomyController::renderConsole()`; `$indexRoute`, `$pageTitle`, `$screenSlug`
değişken, CRUD rotaları (`admin.taxonomies.*`) ORTAK — kopya CRUD açılmamış.

### 2.2 Ekran yapısı

**Sekmeli değil, ağaç değil — İKİ KOLONLU (`.tx-split`).**
`sa-taksonomi.css:16` → `grid-template-columns:256px 1fr`.

Üstte `.intro-band` bilgi şeridi (`sa-taksonomi.css:10-13`, accent tintli kutu),
metni (`taksonomi/index.blade.php:140-142`):
`Bu ekran tarif taksonomisinin **tek kaynağıdır**. Buradaki her grup, tarif liste
facet filtresinde ve tarif formunda seçenek olarak kullanılır — **bir grubu burada
düzenlemek, sistemin her yerinde geçerli olur.**`

**Sol kolon — `.tx-groups` (`role="tablist"`)**, `sa-taksonomi.css:19-28`:
`background:var(--bg)`, sağ kenarlık. **Modüle göre başlıklı bölümlere ayrılır**
(`Tarifler · Blog & İçerik · Ansiklopedi · DadaGourmet`, `:106`); bölüm başlığı
`.tx-groups-lbl` (11px, uppercase, muted). Her kalem:

```html
<a class="tx-group is-on" href="?tip={value}" role="tab" aria-selected="true">
  <span class="tg-chip"><i class="fa-solid {ikon}"></i></span>
  <span class="tg-meta"><span class="tg-name">{etiket}</span>
                        <span class="tg-sub">{n} değer</span></span>
</a>
```

Aktif kalemde `.tg-chip` accent zemin + beyaz ikon (`sa-taksonomi.css:25`).
**Çip DEĞİL `<a>`** — sunucu-taraflı `?tip=` query, tam sayfa yenilenir
(karar gerekçesi `taksonomi/index.blade.php:16-25`); dolayısıyla bir anda yalnız
BİR grubun paneli render edilir.

**Sağ kolon — `.tx-panel`:**
- `.tx-phead`: solda `.tx-eyebrow` (`Bağlı modül · **{modül}**`), `.tx-ptitle`
  (grup adı), `.tx-pnote` (o grubun ne beslediğini anlatan uzun cümle,
  `max-width:56ch` — 10 tipin tümü için `$typeNotes` haritasında yazılı,
  `:84-95`); sağda `.tx-search` 240px arama kutusu (`Değer ara…`).
- `.tx-list` → `.tx-row` (tablo DEĞİL, flex satırlar), `sa-taksonomi.css:46-59`.
- `.pager#txPager` istemci-taraflı sayfalama
- `.pnl-empty#emptyState`

**Satır anatomisi** (`taksonomi/index.blade.php:185-248`):
`.tx-ico` (38px kare; `category`/`cuisine`/`ingredient_category` tipinde kapak
görseli varsa `.tx-ico.has-cover` background-image) → `.tx-rid` (`.tx-rname` +
`.tx-slug` monospace + koşullu `.tx-extra` rozetleri) → `.tx-use` kullanım sayacı
→ `.row-acts`.

`.tx-extra` satırları (koşullu, ikonlu, 11.5px):
- `cuisine` + `flag_code` → `fa-flag` + BÜYÜK HARF kod
- `cuisine` + kod yok → `fa-earth-americas` + `Bölge`
- `in_theme_strip` → `fa-star` + `Tema rayında`
- `category` + `parent_id` → `fa-turn-up` + `Alt kategori: {üst ad}`

### 2.3 Terim ekleme formu (modal `.tx-modal`)

`max-width:460px` (`sa-taksonomi.css:68`). Başlık `.txm-head`: `<h3>Yeni Değer</h3>`
+ `.txm-grp` (aktif grup adı, uppercase accent); sağda `.txm-x` kapat.
Gövde `.txm-body` (`padding:20px 22px`, `gap:16px`). Alt `.txm-foot`:
`btn btn-ghost btn-sm` **Vazgeç** + `btn btn-acc btn-sm` **Kaydet**.

**Alanlar (yukarıdan aşağı, gerçek sıra):**

| # | Alan | Tip | Görünürlük | Kaynak |
|---|---|---|---|---|
| 1 | `Kapak Görseli` (`cover`) | `<x-admin.image-upload>` | yalnız `category`/`cuisine`/`ingredient_category` (`#txCoverField`, JS) | `:291-295` |
| 2 | `Tema Rayında Göster` (`in_theme_strip`) checkbox + `strip` görseli | checkbox + image-upload | yalnız `diet_tag`/`meal_mode` (`#txStripField`) | `:298-302` |
| 3 | `Ad` (`name[tr]` / `name[en]`) **zorunlu** | text, dil sekmeli | her tip | `:313-321` |
| 4 | `Anahtar (slug)` | text `.txf-mono` | her tip | `:322-327` |
| 5 | `Açıklama` (`description[tr]/[en]`) | TinyMCE, `maxlength=400` | her tip | `:331-346` |
| 6 | `Tekil Ad` (`singular_name[tr]/[en]`) | text | yalnız `ingredient_category` (`#txSingularField`) | `:353-362` |
| 7 | `İkon` | aranabilir açılır ızgara | her tip | `:369-390` |
| 8 | `Üst Kategori` (`parent_id`) | `<select>` | yalnız `category` (`#txParentField`) | `:395-404` |
| 9 | `Bayrak Kodu (yedek kaynak)` (`flag_code`, `maxlength=10`) | text `.txf-mono` + canlı SVG önizleme | yalnız `cuisine` (`#txFlagField`) | `:413-425` |

**Alan yok:** renk, sıra/`position` (formda görünmez), aktiflik/durum bayrağı.

İpucu metinleri birebir:
- slug: `Addan otomatik üretilir; boş bırakılırsa addan türetilir.`
- açıklama: `Yalnız kategori sayfası hero metninde kullanılır (opsiyonel).`
- tekil ad: `Yalnız Ansiklopedi Kategorisi tipinde kullanılır — malzeme detay
  sayfasının kategori rozeti/künyesinde tekil biçimde gösterilir (ör. "Baharatlar"
  → "Baharat").`
- üst kategori: `Yalnız Kategori tipinde kullanılır — public kategori sayfasında
  "Alt kategoriler" rayında ve "Alt Kategori" filtresinde görünür.`
- bayrak: `Yalnız yukarıdaki görsel alanı boşsa kullanılır — public tarafta kendi
  bayrak setimizin kod önizlemesine düşer. Görsel yüklersen bu kod artık görünmez
  olur (öncelik görselde).`

**İkon seçici** (`:369-389`): kompakt tetikleyici `.tx-ico-trigger` (önizleme
ikonu + ad + chevron) → `.tx-ico-pop` içinde `.tx-ico-search` (`İkon ara…`) +
`.tx-ico-grid` → `<button class="tx-ico-opt">`. Havuz `$iconPool`, **36 ikon**
(`taksonomi/index.blade.php:111`). Seçim gizli `<input name="icon">`e yazılır.
Gerekçe (`:365-368`): açık 24'lük ızgara ~190px dikey yer kaplayıp modalı
taşırıyordu → aranabilir panele çevrildi.
Doğrulama: `icon` alanı `ForbiddenIconMeaning` kontrolünden geçer, yasak anlam
taşıyan ikon reddedilir (`TaxonomyController.php:395-406`).

**Slug otomasyonu:** ad yazıldıkça TR harf çevirisiyle slug üretilir; kullanıcı
slug'a dokunursa (`slugTouched`) üretim durur — malzemeler modalındaki eşi
`malzemeler/index.blade.php:361-367`. Sunucu tarafında `uniqueSlug()` tip
içinde benzersizleştirir (`-2`, `-3`… `TaxonomyController.php:113-123`).

### 2.4 Hiyerarşi ve sıralama

**Hiyerarşi VAR ama yalnız `category` tipinde ve KATI 2 SEVİYE.**
`TaxonomyController::guardParent()` (`:428-467`) üç kuralı zorlar:
1. `Bir kategori kendi kendisinin üst kategorisi olamaz.`
2. `Yalnız kök kategoriler üst kategori olarak seçilebilir (3. seviye desteklenmiyor).`
3. `Bu kategorinin zaten alt kategorileri var; bir üste bağlanamaz.`

Üst-kategori select'i yalnız `whereNull('parent_id')` kökleri listeler
(`TaxonomyController.php:131-141`).

**Drag-drop sıralama YOK.** `sortablejs` bu ekranda yüklenmiyor (grep: 6 form
ekranında var, taksonomide yok); `position` kolonu var ve liste
`orderBy('position')->orderBy('id')` ile sıralanıyor
(`TaxonomyController.php:123`) ama **formda `position` alanı yok** — arayüzden
sıra değiştirilemiyor.

### 2.5 Kullanım sayacı

Var: satır sağında `.tx-use` → `<b>{sayı}</b> {isim}`
(`sa-taksonomi.css:58-59`, `font-variant-numeric:tabular-nums`).

**Sayaç tipe göre AYRI yoldan sayılır** (2026-08-03 düzeltmesi,
`TaxonomyController::withUsageCount()` `:152-212`):

| Tip | Sayım kaynağı | Sayaç ismi (`usageNoun()`, `:214-221`) |
|---|---|---|
| tarif eksenleri | `recipe_taxonomy` | `tarif` |
| `tip_category` | `tips.category_taxonomy_id` | `püf noktası` |
| `ingredient_category` | `contents.ingredient_category_taxonomy_id` | `içerik` |
| `content_category` | `contents.category_taxonomy_id` | `içerik` |
| `gurme_category` | `contents` | `içerik` |
| kalanlar | `0 as usage_count` | — |

Düzeltme öncesi sayaç tipten bağımsız `recipe_taxonomy`yi sayıyordu ve altı tip
sürekli "0 tarif" gösteriyordu (`:119-125` yorumu).

**Birleştirme / taşıma eylemi YOK.** Satırda yalnız Düzenle + Sil var; merge/move
rotası veya düğmesi bulunamadı.

### 2.6 Silme kuralı

**Kullanımdaysa ENGELLENMİYOR** — `TaxonomyController::destroy()` (`:329-337`)
yalnız `authorize('delete')` yapıp siliyor; sayım kontrolü yok.
Uyarı onay metnindedir (`taksonomi/index.blade.php:243`):

> `“:name” değeri silinecek. Buna bağlı :count :noun bağlantısız kalır. İşlem geri alınamaz.`

(`:count` = o değerin kullanım sayacı, `:noun` = tipe göre `tarif`/`püf noktası`/`içerik`.)

Sil düğmesi `data-no-confirm` taşır (`:236-241`): global `sa-ui.js` delegesi
`fa-trash`ı yakalayıp sayfanın kendi `saConfirm`ini öldürüyordu; attribute
delegeyi pas geçirir, sayfanın tarif-sayılı özel mesajı çalışır.

**Karşılaştırma — Malzemeler ekranı TERSİ kuralı uyguluyor:** kullanımdaki malzeme
silinemez; sil düğmesi yerine `fa-lock` gösterilir ve kural uygulama katmanında
(`IngredientController@destroy`) zorlanır, çünkü `IngredientPolicy` silmeyi
sınırlamıyor (`malzemeler/index.blade.php:21-23, 125-135`).

---

## 3 · ROZET ve KADEME

### 3.1 Rozet listesi — `admin/rozetler/index.blade.php` (96 satır)

Ekran **iki kartlı** (`.pc-grid`, `sa-rozetler.css:33` →
`grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)`): solda **Rozet Listesi**,
sağda **Şef Kademeleri** özeti.

**Filtre şeridi YOK, arama YOK.** Liste `BadgeController.php:47`
`orderBy('category')->orderBy('name')->paginate(30)`.

Üstte 4'lü `.kpi-grid` (`sa-shell.css:354`):

| KPI | Değer | Etiket |
|---|---|---|
| `fa-award` | `$kpi['total']` | `Tanımlı rozet` |
| `fa-layer-group` (yeşil) | `$kpi['categories']->count()` | `Rozet kategorisi` |
| `fa-star` (`.kpi-card.sun`) | `$kpi['rare']` | `Nadir rozet` |
| `fa-ranking-star` | `$kpi['tierCount']` | `Şef kademesi` |

**Rozet Listesi tablosu** (`:48-76`) — kart başlığı `.pc-head` içinde
`fa-list Rozet Listesi` + sağda `.pc-link` `Public sayfada gör →`:

| Kolon | İçerik |
|---|---|
| `Rozet` | `.bz-name`: `.bz-ico` 34px kare (tomato tint) + `<b>{ad}</b>` + altında `<span>{icon slug}</span>` |
| `Kategori` (`.col-cat`) | `.bz-cat` düz pil (`sa-rozetler.css:27`) |
| `Tetik` | `$badge->trigger_text` — düz metin |
| `Durum` (`.col-date`) | `draft`→`pstat off` `Taslak`; `is_rare`→`pstat rare` `Nadir`; aksi `pstat ok` `Yayında` |
| (boş `.act`) | `.bz-edit` metinli düğme: `fa-pen` + `Düzenle` |

**"Kaç kişi kazanmış" sayacı listede YOK.** Kazanan sayısı yalnız rozet
formundaki `Kazananlar (son 20)` bloğunda, ad listesi olarak görünüyor
(`rozetler/form.blade.php:188-208`).

**Şef Kademeleri kartı** (`:78-94`): kolonlar `Kademe` (`.rk-step` pil: ikon+ad) ·
`Eşik` (`.num`, `{n} puan`) · `.bz-edit` Düzenle → `admin.tiers.edit`.
Blade yorumu (`:12-14`): tek CRUD kaynağı `admin.kademeler.*`, kopya CRUD açılmadı.

### 3.2 Rozet formu — `admin/rozetler/form.blade.php` (259 satır)

**Düzen:** `.form-layout` (`sa-kademeler.css:64`) →
`grid-template-columns:minmax(0,1fr) minmax(280px,340px)` — solda `.pnl-card`
form bölümleri, sağda `.side-card`. Tüm form TEK `<x-admin.lang-tabs>` kapsamında
(TR/EN sekmesi).

**Tam alan listesi:**

| # | Etiket (birebir) | `name` | Tip | Not |
|---|---|---|---|---|
| 1 | `Rozet adı` | `name[tr]`/`name[en]` | `<x-admin.tfield>` text, **zorunlu** | `:71` |
| 2 | `Kategori` | `category` | `<select class="fselect">`, enum döngüsü | `:73-78` |
| 3 | `Tetik metni` | `trigger_text[tr]/[en]` | tfield text, `maxlength=255`, **zorunlu** | `:81` |
| 4 | `Eşik (opsiyonel)` | `trigger_threshold` | `<input type=number min=0>` + `.num-suf` `adet/puan` | `:83-88` |
| 5 | `Seri anahtarı (opsiyonel)` | `series_key` | text, `placeholder="tarif-uretici"` | `:95-98` |
| 6 | `Seri kademesi (I–V)` | `tier_rank` | select: `— (seri dışı)` · I · II · III · IV · V | `:101-107` |
| 7 | `Nadirlik` | `rarity_tier` | select, `RarityTier` enum | `:113-118` |
| 8 | `İkon ara` + ızgara | `icon` (gizli input) | aranabilir seçici | `:127-147` |
| 9 | `Durum` | `status` | `<x-admin.publish-sidebar>`, seçenekler `Yayında`/`Taslak`, tarih alanı kapalı | `:160-167` |

**Alan YOK:** slug (sunucu türetir — `BadgeController.php:74`
`Str::slug($data['name']['tr'])`), açıklama/görsel, "gizli mi", "sıra",
ayrı "puan" alanı.

İpuçları birebir:
- tetik metni: `«Nasıl kazanılır» olarak kullanıcıya gösterilir.`
  (TR yer tutucu: `Örn. 20 hamur işi tarifi paylaş`)
- eşik: `Otomatik tetikli rozetlerde sayısal eşik; tamamen editöryal (manuel
  atanan) rozetlerde boş bırak.`
- seri anahtarı: `Aynı seriyi (I–V) gruplayan makine anahtarı; seri dışı rozette
  boş bırak.`
- seri kademesi: `Bonus: I=15 · II=40 · III=100 · IV=250 · V=600 puan.`
- nadirlik: `Prestij tonlaması (K11): Standart · Nadir · Çok Nadir · Efsanevi —
  kart üzerinde işaretlenir.`

**İkon seçici:** `config('badge_icons')` — form metni bunu ekranda gösteriyor:
`:count ikon arasından ada göre arayın.` (`:139`); dosya başı yorumu havuzu
"FA6 Free solid-renderable evren, **1955 ad**" diye tanımlıyor (`:17`).
Yapı: `.ico-preview` (52px önizleme karesi + `<code>` ikon adı) → arama
(`Örn. fire, heart, cake, star…`) → `.ico-pick.ico-scroll`
(`max-height:300px;overflow-y:auto`, `:31`) içinde `.ico-opt` 46px kareler.
Boş sonuç metni: `Eşleşen ikon yok.`
Arama `fa-` önekini kırpar (`:235`). Açılışta seçili ikon **yalnız seçicinin kendi
kutusu içinde** kaydırılır — `scrollIntoView` KULLANILMAZ (ölçüm: sayfayı 533px
kaydırıyordu, `:245-256`).

**Düzenlemede ek blok (`@if ($badge->exists)`, iki sütunun ALTINDA tam genişlik —
iç içe `<form>` yasağı yüzünden, `:172-210`):**
- `Manuel Ata`: `Kullanıcı ID` sayı kutusu + `Ata` düğmesi → `admin.badges.grant`.
  İpucu: `Editöryal rozetler (Dada Şefi, Şefin Tercihi vb.) burada elle atanır —
  admin-business §4.10.`
- `Kazananlar (son 20)`: `.holder-row` listesi (ad + kazanma tarihi `d M Y` ya da
  `—`) + her satırda `ia-btn danger` `fa-xmark` **Geri al** → `admin.badges.revoke`.
  Boşsa: `Bu rozeti henüz kimse kazanmadı.`

### 3.3 Kazanma koşulu nasıl tanımlanıyor

**İki katmanlı; enum DEĞİL, string anahtar — ve admin formunda YOK.**

`Badge` modelinin fillable'ı (`app/Domain/Gastro/Models/Badge.php:33-46`):
`name · slug · icon · category · series_key · tier_rank · trigger_key ·
trigger_text · trigger_threshold · is_rare · rarity_tier · status`

- **`trigger_text`** — insana gösterilen "nasıl kazanılır" cümlesi; formda var.
- **`trigger_threshold`** — sayısal eşik; formda var.
- **`trigger_key`** — motorun okuduğu makine anahtarı; **formda YOK, salt okunur**
  (`BadgeController.php:156` yorumu: "trigger_key salt-okunur (formda YOK)";
  `validated()` `:142-160` içinde alan yok). Seed/veri katmanından gelir.

`Badge.php:17-19`: `trigger_key` dolu = otomatik tetikli; `trigger_key=null` =
tamamen editöryal manuel atama (Dada Şefi vb.).

**Tetik tipleri — ölçüm** (`app/Domain/Gastro/Actions/Community/ResolveBadgeTriggerValue.php`):

Sabit anahtar, `match()` kolu ile **20 tane** (`:106-146`):
`recipe_count · recipe_photo_count · saved_recipe_count · comment_count ·
approved_tip_count · weekly_menu_count · clap_total · single_recipe_clap ·
follower_count · following_count · monthly_recipe_count · membership_years ·
seasons_covered · activity_streak_days · lifetime_points ·
distinct_recipe_categories · active_subscription · subscription_months ·
seasons_participated · kitchen_problem_total_count`

Önek (parametreli) aile, **4 tane** (`:62-104`):
`category_recipe_count.{slug}` · `kitchen_problem_solved.{id}` ·
`kitchen_problem_category_count.{taxonomy_slug}` · `season_award.{award_key}`

Ayrıca **"depolanan kaynak"** listesi — canlı sorgusu olmayan, `user_badges.
progress_current`tan okunan 2 anahtar (`STORED_SOURCE_KEYS`, `:46-49`):
`photo_clap_total` · `category_recipe_count.izgara`.

Yani: **kazanma koşulu tipi 24 (20 sabit + 4 önekli) + 2 depolanan**, hepsi
kodda tanımlı, PHP enum'u değil string sözleşme; admin ekranından
değiştirilemez — admin yalnız eşiği ve açıklama metnini düzenler.

`BadgeController::validated()` kuralları (`:142-160`):
`name.tr` zorunlu · `icon` zorunlu + `Rule::in(config('badge_icons'))` ·
`category` enum içinde · `trigger_text.tr` zorunlu max 255 ·
`trigger_threshold` nullable integer min 0 · `status` `BadgeStatus` içinde.

`rarity_tier` otoriter, `is_rare` ondan türetilen ayna (`Badge.php:60-63`;
`RarityTier::isRare()` → Normal dışı her seviye).

`BadgeCategory` (`app/Domain/Gastro/Enums/BadgeCategory.php`) — **7 kategori**,
her birinin kendi ikonu var:
`baslangic` `Başlangıç` `fa-flag-checkered` · `uretim` `Üretim` `fa-utensils` ·
`topluluk` `Topluluk` `fa-users` · `ustalik` `Ustalık` `fa-star` ·
`sadakat` `Sadakat & Seri` `fa-calendar-check` · `nadir` `Nadir & Özel` `fa-gem` ·
`kesif` `Keşif & Mekan` `fa-route`.

`RarityTier` — 4 seviye: `normal` `Standart` · `nadir` `Nadir` ·
`cok-nadir` `Çok Nadir` · `efsanevi` `Efsanevi`.

### 3.4 Kademe listesi — `admin/kademeler/index.blade.php` (70 satır)

**Tablo değil, KART IZGARASI.** `.tier-grid`
(`sa-kademeler.css:18`) → `repeat(auto-fill,minmax(240px,1fr))`, gap 16px.

Üstte `.intro-band`:
`Üyeler tarif paylaşımı, beğeni ve yorumlarla katkı puanı kazanır. Eşik puana
ulaşan üye otomatik olarak bir üst kademeye yükselir. Kademe sıralaması puana
göre belirlenir.`

Kartlar **`badge_label`e göre segment gruplarına** ayrılır; segment başlığı
mevcut `.ph-sub` sınıfıyla + `fa-layer-group` ikonu + `· {segment adet}`
(`:34-38` — "yeni stil icat YOK, yalnız aralık").

**Kart anatomisi** (`:41-62`):
- `.tier-card.lv{1..5}` — sol 4px renk şeridi (`::before`); 14+ kademede 5 ton
  **döngüsel** uygulanır (`(($tier->level - 1) % 5) + 1`), yeni renk icat edilmedi
  (`:8-11`).
- `.tier-top`: `.tier-medal` 46px ikon karesi + `.tier-name` (yanında gri
  `· {display_en_plain}`) + `.tier-lvl` (`Seviye :n`) + `.tier-acts`
  (`ia-btn` `fa-pen` Düzenle, `ia-btn danger` `fa-trash` Sil — DELETE formu).
- `.tier-req`: `Eşik: <b>{n}</b> puan · {description}`
- `.tier-foot`: `.tier-count` `<b>{n}</b> üye` + `.tier-badge` `{badge_label}` pili.

Üye sayacı gerçek: `CommunityTierController.php:39`
`withCount('members')->orderBy('level')->paginate(50)`.

Sayfalama `{{ $tiers->links('vendor.pagination.admin') }}` ızgaranın altında.

### 3.5 Kademe formu — `admin/kademeler/form.blade.php` (213 satır)

Aynı `.form-layout` iki sütun; sağda **canlı önizleme** kartı.

| # | Etiket | `name` | Tip |
|---|---|---|---|
| 1 | `Kademe adı` | `name[tr]`/`name[en]` | tfield, `maxlength=80`, EN yer tutucu `Saucier` (brigade Fransızca kanonik adı), **zorunlu** |
| 2 | `Seviye sırası` | `level` | select `Seviye 1..{max(nextLevel,14)}` |
| 3 | `Düz İngilizce ad` | `display_en_plain` | text, `placeholder="Sauce Chef"` |
| 4 | `Eşik puanı` | `threshold_points` | number min 0 + `.num-suf` `katkı puanı` |
| 5 | `En az tarif` | `min_recipes` | number min 0 + `.num-suf` `yayınlanmış` |
| 6 | `En az püf` | `min_tips` | number min 0 + `.num-suf` `onaylı` |
| 7 | `Rozet etiketi` | `badge_label` | text |
| 8 | `Açıklama` | `description` | TinyMCE (`data-height=180`) |
| 9 | `Görsel İkon` | `icon` (gizli) | `.ico-pick` — **16 ikonluk sabit havuz** (`:14`) |

İpuçları birebir:
- düz EN ad: `Merdivende alt-yazı/tooltip olarak gösterilen düz İngilizce karşılık.`
- eşik: `Üye bu puana ulaştığında otomatik olarak bu kademeye yükselir.`
- en az tarif: `Bu kademeye çıkmak için gereken en az yayınlanmış tarif
  (ana-eksen barajı).`
- en az püf: `Bu kademeye çıkmak için gereken en az onaylı püf noktası.`
- rozet etiketi: `Kademe kartında gösterilen kısa etiket.`

**Eşik alanları üç tane:** puan (`threshold_points`) + iki ana-eksen barajı
(`min_recipes`, `min_tips`). Yani kademe atlamak için "puan VE en az N tarif VE
en az N püf" birlikte aranıyor.

**Rozetle ilişkisi:** doğrudan bir `badge_id` bağı **YOK**. İlişki iki dolaylı
yoldan kuruluyor:
1. `badge_label` — kademe kartında gösterilen ve listede segment başlığı üreten
   serbest metin etiket.
2. Rozetler ekranı sağ kartta kademeleri özetler ve `admin.tiers.edit`e link verir
   (`rozetler/index.blade.php:78-94`); ayrıca rozetin `lifetime_points` tetiği ile
   kademenin `threshold_points`u aynı `contribution_points` kolonunu okur.

**Canlı önizleme** (`:132-145`): `.tier-prev` kartı — ad, seviye, eşik ve açıklama
yazıldıkça güncellenir; sayı `toLocaleString('tr-TR')`, TinyMCE HTML'i geçici
düğüme yazılıp `textContent` ile düz metne çevrilir (`plainText()`, `:169`).

---

## Kalıbın Fit'e taşınırken dikkat edilecek noktaları (ölçümden çıkanlar)

1. **Filtre mimarisi ikili seçimdir, karışmaz:** sunucu GET araması → Laravel
   paginator; istemci JS araması → tüm satırlar DOM'da + istemci sayfalama.
   Ortası yok (`sozluk/index.blade.php:10-15`).
2. **Sayaçlı çip kiti pahalıdır:** dört sayaçlı çip ~428px yer yiyor; 998px'lik
   içerik sütununda beş kontrolle birlikte tek satıra sığmıyor → select'e dönülür,
   sayaç seçenek metnine girer (`mutfaga-giris/index.blade.php:44-54`).
3. **Yıkıcı onayda tek kural:** `fa-trash` + `type="submit"` → global delege;
   metinsiz başka ikon → sayfa-özel `saConfirm` + `postTo`; ikisi çakışırsa
   `data-no-confirm`.
4. **`nth-child` ile kolon gizleme kapsamsızdır** — `sa-tarifler.css:107-119`
   başka ekranı bozdu ve ayrı bir dosyayla geri alınmak zorunda kalındı
   (`loglar/index.blade.php:25-27`). Sınıf tabanlı (`col-*`) yöntem
   (`sa-kullanicilar.css:125-131`) güvenli olan.
5. **Silme kuralı ekran başına ayrı:** taksonomi siler+uyarır, malzemeler
   kilitler. İkisi de blade yorumunda gerekçeli.
