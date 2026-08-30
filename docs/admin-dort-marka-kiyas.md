# Dört marka — yönetim paneli kıyası

**Ölçüm tarihi:** 2026-08-30 · **Ölçen:** A10 (ölçüm ajanı)

## Kaynaklar ve git HEAD'leri

| Marka | Yol | HEAD | Not |
|---|---|---|---|
| DadaGastro | `~/Developer/Backend Projects/dadagastro-profil` | `c5f6143b` | salt okuma |
| DadaDiet | `~/Developer/Backend Projects/dadadiet` | `192ec5d` | salt okuma |
| DadaGourmet | `~/Developer/Backend Projects/dadagastro-gourmet-admin` | `c7219426` | salt okuma — **seçim gerekçesi aşağıda** |
| DadaFit | `~/Developer/Projects/dadafit-prototip` | `87c9bf3` | canlı sunucu `http://127.0.0.1:8788/`, Playwright 1440×1100 |

**Gourmet yol seçimi:** `~/Developer/Backend Projects/` altında Gourmet için İKİ dizin var —
`dadagastro-gourmet` ve `dadagastro-gourmet-admin`. İkisi de aynı `git@github.com:By4r/dadagastro.git`
remote'una bağlı ama farklı commit'lerde duruyorlar: `dadagastro-gourmet-admin` HEAD'i
`c7219426` ("feat(gourmet): wire the new gourmet admin routes and sidebar entries"),
`dadagastro-gourmet` HEAD'i `0355aa91` ("feat(gourmet): add the DadaGourmet search page") —
üç commit geride ve admin rotalarının bağlandığı son değişikliği içermiyor. Bu yüzden
**`dadagastro-gourmet-admin`** ölçüldü.

**Ölçüm anı notu (Fit):** Aynı oturumda A7/A8 `admin-*.html` dosyalarını, lead ise
`fit-admin.css`/`fit-admin.js`'i düzenliyordu. Aşağıdaki Fit sayıları 2026-08-30 23:27
itibarıyla canlı sunucudan `getComputedStyle` ile okundu; dosyalar bu andan sonra
değişmiş olabilir.

**Yöntem:** Laravel tarafında (Gastro/Diet/Gourmet) her sayı bir dosya:satır kaynağından
okundu — grep yalnız konum bulmak için kullanıldı, sayı grep çıktısından değil dosyanın
kendisinden alındı. Fit tarafında sayılar `PW_HOME=~/.pw node <script>.mjs` ile canlı
`getComputedStyle` çağrısından okundu (script'ler
`/private/tmp/.../scratchpad/a10-*.mjs`).

---

## 1 · Sidebar yapısı

| Bileşen · özellik | Gastro | Diet | Gourmet | Fit | Sapma |
|---|---|---|---|---|---|
| İkon rail genişliği | `76px` (`sa-shell.css:50`) | `76px` (`sa-shell.css:50`, aynı dosya) | `76px` (`sa-shell.css:50`) | `76px` (canlı ölç.) | yok — dördü de aynı |
| Bölüm menüsü genişliği | `264px` (`sa-shell.css:51`) | `264px` | `264px` | `264px` (canlı ölç.) | yok |
| Rail'in taşıdığı şey | **Marka/dünya seçici** — Gastro aktif, DadaStore/DadaAkademi "Yakında" iki ikon (`layout.blade.php:96-113`) | **Kardeş marka panel girişleri** — iki SABİT DIŞ URL (`dadagastro.com/admin/giris`, `dadagourmet.com/admin/giris`), "Yakında" rozeti YOK (bilinçli, `AdminMenu.php:44-82`) | Marka/dünya seçici + **`isletmeler` bölümü için AYRI rail-ikon** (`$isIsletmeSection` route flag, `layout.blade.php:104-141`) | **Bölüm seçici** — dört bölüm, uydurulmuş "yakında" dünyası yok (`fit-kit.md` §13) | Diet rail'i **dış link**, ötekiler **iç bölüm/dünya** seçici — farklı ürün kararı, aynı görsel kalıp |
| sa-msec bölüm başlığı sayısı | **3**: Ana İçerik · Operasyon · Yapılandırma (`layout.blade.php:142,254,354`) | **4 (+1 başlıksız)**: (başlıksız Genel Bakış grubu) · Ana İçerik · Operasyon · **Sponsorluk** · Yapılandırma (`AdminMenu.php:267,356,571,617,760`) | **3**: Ana İçerik · Operasyon · Yapılandırma (`layout.blade.php:187,299,378`) | **3**: Ana içerik · Operasyon · Yapılandırma (canlı ölç.) | **Diet'in ayrı "SPONSORLUK" bölümü var**, öteki üçünde sponsorluk Operasyon/Yapılandırma içine gömülü |
| Üst-düzey kalem sayısı | 26 `.sa-mlink` (`layout.blade.php`, grep+oku) | 28 `'icon' =>` girdisi (`AdminMenu.php`, grep+oku) | 25 `.sa-mlink` (`layout.blade.php`) | 24 (23 modül + "Siteyi gör", canlı ölç.) | ölçek benzer (24-28), modül sayısı markaya göre doğal farklılık |
| Açılır grup (accordion) sayısı | **4**: Dolapta Ne Var?, Mutfak Sırları, Video Mutfağı, Sponsorluk/Reklam (`sa-submenu-dark` × 4) | veri-model üstünden `children` dizisiyle kuruluyor (en az 2 aile: Yazılar alt-tipleri, +1) | **4**: aynı Gastro deseni (`sa-submenu-dark` × 4) | **3** (canlı ölç., `groupCount:3`) | ölçek benzer |
| **Sidebar veri kaynağı** — mimari eksen | **Hardcoded blade markup**: her kalem `layout.blade.php` içine `@if(routeIs())` ile elle yazılı, 508 satır | **PHP dizi + `View::composer`**: `app/Support/AdminMenu.php` (765 satır) TEK yerde kurar, `AdminShellServiceProvider` `admin.layout` composer'ıyla enjekte eder — kabuk **sıfır sorgu** atar | Gastro ile **aynı hardcoded blade deseni** (`layout.blade.php`, 486 satır) | Statik prototip — sabit HTML, JS ile aktif kalem hesaplanır | 🔴 **Diet mimari olarak farklı**: tek kaynak (DRY, "bir modül eksik menü kalemi unutulur" riski sıfıra iner — kendi docblock'unun kaydettiği ders); Gastro/Gourmet her ekranda elle tekrar yazıyor, T6.1/T6.2/T6.4 gibi "kalem unutuldu" hataları Diet'in KENDİ tarihinde zaten yaşanmış ve bu yüzden merkezîleştirilmiş |
| Rail dış/iç link ayrımı | route() çözülür (iç) | **sabit string URL**, route() ÇÖZÜLMEZ (Beyar kararı, `AdminMenu.php:44-58`) | route() çözülür (iç) | dahili (statik sayfa linki) | Diet'in kararı ürün gerekçeli (kardeş markanın paneli henüz bu depoda değil), diğerleri kendi dünyasında kaldığı için route() kullanabiliyor |
| Daralt/genişlet | `.sa-divider`/`.sa-grip`, 22×54 tutamak (`sa-shell.css:199+`) | aynı bileşen (paylaşılan `sa-shell.css`) | aynı bileşen | `.sa-divider`/`.sa-grip` aynı isim, `fit-kit.md` §13 | yok |

---

## 2 · Liste ekranı

| Bileşen · özellik | Gastro | Diet | Gourmet | Fit | Sapma |
|---|---|---|---|---|---|
| Tablo sınıfı | `.ptable` (`admin.css:88-93`) — **legacy**: `body:not([data-screen]) .ptable` guard'ı altında; `data-screen` işaretli yeni ekranlar farklı bir referans CSS zincirinden besleniyor (`admin.css:62-66` yorumu) | `.ptable` — aynı dosya, aynı kural (`resources/css/admin.css` paylaşılan kopya) | `.ptable` — aynı | `.adm-table` (`.ptable` eş adı, `fit-kit.md` §13) | Gastro'nun KENDİ İÇİNDE iki katman var (eski `.ptable` / yeni `data-screen`); üç Laravel markası da örneklenen ekranlarda eski katmanı kullanıyor |
| th dolgu / yazı | `padding: var(--sp-3) var(--sp-4)` = **12px 16px**, `.7rem`(11.2px)/800, uppercase, zeminsiz (`admin.css:90`) | aynı (paylaşılan CSS) | aynı | `12px 16px 12px 22px` (ilk hücre +6px sol), **11.5px/700**, uppercase, zeminsiz (canlı ölç.) | Fit th biraz daha ince ağırlıklı (700 vs 800) ve ilk hücrede ekstra sol dolgu taşıyor — kit'in kendi "ilk hücre padding-left:22px" kararı |
| td dolgu / yazı | `12px 16px`, `.9rem`(14.4px) (`admin.css:91`) | aynı | aynı | `13px 16px 13px 22px`, **13.5px** (canlı ölç.) | Fit'in td'si biraz daha küçük punto (13.5 vs 14.4) ama satır dolgusu benzer |
| Satır yüksekliği | CSS'te **sabit değil** (auto, dolgu+içerikten türer) — ölçülmedi (Laravel canlı değil, DOM render yok) | ölçülmedi (aynı gerekçe) | ölçülmedi (aynı gerekçe) | **71px** (canlı ölç., `admin-uyeler-v1.html`/`admin-hareketler-v1.html` — avatar/thumbnail taşıyan satırlar) | doğrudan kıyaslanamaz: üç Laravel markası canlı sunucu olmadığı için DOM'dan ölçülemedi, **"ölçülmedi"** — CSS satır yüksekliği sabitlemiyor |
| Zebra | **Yok** — yalnız `tbody tr:hover{background:var(--bg)}` (`admin.css:93`), `nth-child` hiç yok | aynı (paylaşılan CSS, doğrulandı: `nth-child` sıfır sonuç) | aynı | **Yok** (canlı ölç., `zebra:false`, satır arkaplanı `rgba(0,0,0,0)`) | yok — dördü de zebra kullanmıyor, hover-only |
| Başlık satırı arkaplanı | zeminsiz (transparent) | aynı | aynı | zeminsiz (canlı ölç.) | yok |
| **Aramanın yeri** | `.filter-bar` içinde **ilk çocuk** `.fb-search` formu, solda (`uyeler/index.blade.php:74`) | aynı desen: `.filter-bar > .fb-search` ilk çocuk (`besinler/index.blade.php:113-114`) | aynı desen: `.filter-bar > .fb-search` ilk çocuk (`mekanlar/index.blade.php:101-102`) | `.filter-bar` ilk çocuğu `fb-search` (canlı ölç., `filterBarChildren:["fb-search","fb-sel"]`) | yok — dördü de "arama solda, filtre-bar'ın ilk elemanı" |
| Süzgeç | `.chip.is-on` rozet-çipleri (durum/rol) `.fb-search`'ten sonra (`uyeler/index.blade.php:89-113`) | aynı chip deseni | aynı chip deseni | `.chips`/`.chip` (canlı doğrulanmadı bu turda, `fit-kit.md` §13'te tarif edilen bileşen) | yok |
| Sıralama (kolon başlığına tıkla) | **Yok** — `tarifler/index.blade.php` th'lerinde link/sort parametresi bulunamadı | ölçülmedi (aynı kalıptan varsayım, doğrulanmadı) | ölçülmedi | **Yok** (kit dokümante etmiyor, sayfalarda gözlenmedi) | Gastro'da doğrulanan tek veri noktası: kolon-tıkla-sırala YOK; süzgeç/chip var, kolon sıralama yok |
| Sayfalama | **Server-side, numaralı sayfa** — `vendor/pagination/admin.blade.php`: `.pager` → sol `.pager-info` ("X sonuçtan Y-Z gösteriliyor") + sağ `.pager-btns` (‹ sayfa# ›), kart **İÇİNDE**, tablo altında (`uyeler/index.blade.php:71-195` gövde analizi) | **byte-birebir aynı** `admin.blade.php` (diff sıfır fark) | **byte-birebir aynı** (diff sıfır fark) | `.adm-pager`/`.pager` — sol `.p-info`/`.pager-info`, sağ `.p-btns`/`.pager-btns`, `margin-left:auto` (`fit-admin.css:576-595`) | yok — Fit'in kiti Gastro'nun paginator'ını isim isim taşımış; üçü zaten aynı dosya |
| Toplu işlem (bulk) | **1/47 ekran** — yalnız `moderasyon/yorumlar/index.blade.php` (`selectAll`/`_bulkjs` deseni depo genelinde tek yerde) | **0 ekran** — `bulkbar`/`_bulkjs`/`selectAll` deposunda sıfır sonuç | **5+ ekran** — `mekanlar`, `etkinlikler`, `gurme-lezzetler`, `basvurular`, `moderasyon/yorumlar` (paylaşılan `_bulkbar.blade.php`/`_bulkjs.blade.php` partial'ı) | **1/~24 ekran** — yalnız `admin-moderasyon-v1.html` (canlı ölç., `bulkExists:true` yalnız o sayfada; `bulkHidden:true` seçim yokken) | 🔴 **En büyük sapma bu satırda**: Gourmet toplu işlemi kendi üç modülünde (mekân/etkinlik/gurme) standart bir ihtiyaç olarak görmüş ve ortak partial'a çıkarmış; Diet'te hiç yok; Gastro ve Fit ikisi de "yalnız moderasyonda" ile aynı dar kapsamda — Fit burada Gastro'yu birebir taklit etmiş |
| Boş durum | `.pnl-empty`: `.pe-ico` (ikon) + `<h4>` + `<p>` — **3 parça**, CTA linki YOK (örneklenen `uyeler/index.blade.php:188-192`) | ölçülmedi (`.pnl-empty` var, iç yapı ayrı doğrulanmadı) | ölçülmedi (`.pnl-empty` var, iç yapı ayrı doğrulanmadı) | `.pnl-empty`/`.fpx-bos` — **4 parça, 4.sü opsiyonel CTA `<a class="btn">`** (`fit-kit.md` §9, CSS `fit-admin.css:640-649`) | Fit'in kit dokümanı "Gastro ile aynı dört parça" diyor ama **örneklenen Gastro ekranında (uyeler) CTA yok, 3 parça** — CSS 4. parçayı engellemiyor ama bu örnekte kullanılmamış; genel iddia doğrulanmadı, tek örnek çelişiyor |

---

## 3 · Ekleme akışı

| Varlık tipi | Gastro | Diet | Gourmet | Fit | Kural |
|---|---|---|---|---|---|
| Ana içerik (Tarif / Besin / Mekân) | **Ayrı sayfa**: `GET .../create` → `RecipeController@create` (`RecipeController.php:128-132`) | **Ayrı sayfa**: `FoodAdminController@create` (`:84-88`) | **Ayrı sayfa**: `MekanUiController@create` (`admin-gourmet-ui.php:47`) | **Ayrı sayfa** (URL üzerinden, `?<anahtar>` parametresiz) | Dördü de aynı: içerik-ağırlıklı varlıklar ayrı sayfa |
| Taksonomi / basit değer (kategori, malzeme, terim) | **Modal** — `.tx-modal`, POST/PUT aynı modal formundan, ayrı GET create/edit rotası **yok** (`TaxonomyController.php`: yalnız `store`/`update`, `index`) | Modal (`taksonomiler/index.blade.php`, aynı `tx-modal` deseni gözlendi) | Modal (`taksonomi/index.blade.php`, aynı desen) | **Modal** — `.sa-modal.tx-modal`, `width:min(460px,100%)` (`admin-taksonomi-v1.html:63-66`, Gastro'dan birebir port belirtilmiş) | Sapma yok — dördü de "içerik ayrı sayfa, taksonomi modal" kuralını uyguluyor |
| Kural gerekçesi | Varlık karmaşıklığına göre: çok alanlı → sayfa, tek alanlı (ad+ikon+slug) → modal | aynı | aynı | aynı (kit §13 "Gastro kanonu" diyor) | tutarlı |

---

## 4 · Düzenleme akışı

| Bileşen · özellik | Gastro | Diet | Gourmet | Fit | Sapma |
|---|---|---|---|---|---|
| `create()`/`edit()` aynı view mi? | **Evet** — ikisi de `view('admin.tarifler.form', ...)` döner (`RecipeController.php:132,157`) | **Evet** — ikisi de `admin.diet.besinler.form` (`FoodAdminController.php:88,106`) | **Evet** — ikisi de `admin.gourmet.mekanlar.form` (`MekanUiController.php:671` tek `return view` noktası) | **Evet** — tek HTML dosyası, `?<anahtar>=<slug>` varsa düzenleme yoksa yeni (`fit-kit.md` §17, kanon: `form.blade.php` deseni) | Sapma yok — dördü de "create/edit tek şablon" kuralında birleşiyor |
| Modeli ayırt eden mekanizma | Route-model binding (`Recipe $recipe` parametresi var/yok) | aynı | aynı | Query-string anahtarı (`?slug=`) — statik prototip için server-side binding yok | Fit'in mekanizması statik olmak zorunda (backend yok); mantık aynı, uygulama farklı |
| Taksonomi modalında | Aynı `.tx-modal` hem ekle hem düzenle, `duzenlenen` değişkeniyle mod ayrımı (`admin-taksonomi-v1.html:492` `duzenlenen` state) | aynı desen | aynı desen | aynı desen | Sapma yok |

---

## 5 · Form yapısı

| Bileşen · özellik | Gastro | Diet | Gourmet | Fit | Sapma |
|---|---|---|---|---|---|
| Alan tipleri | `.finput`/`.fselect`/`.ftext`, `type="date"` native (JS date-picker yok) — `publish-sidebar.blade.php:138` | aynı sınıf ailesi, `type="date"` native | aynı | `.finput`/`.fselect`/`.ftext`, `type="date"` native (`admin-hareket-form-v1.html:267`, `admin-kupon-form-v1.html:92,96`) | Sapma yok — hiçbiri JS date-picker kütüphanesi yüklemiyor |
| Doğrulama — nerede | **İkisi de**: HTML5 (`required` — ör. `tarifler/form.blade.php` 2 alanda) + **sunucu** (`$request->validate([...])`, controller içi private metot, `RecipeController.php:311-341`) — **FormRequest sınıfı DEĞİL** | **İkisi de**: aynı desen, `FoodAdminController.php:198` `$request->validate([...])` inline | **Farklı**: `StoreVenueRequest`/`UpdateVenueRequest` gibi **ayrı FormRequest sınıfları** (`MekanUiController.php:156,174`; aynı desen `EtkinlikUiController`/`GurmeLezzetUiController`'da da: `StoreEventRequest`/`StoreGurmeLezzetRequest` vb., `app/Http/Requests/Admin/Gourmet/`) | HTML5 (`required` özniteliği) — sunucu yok (statik maket, backend sonra doğacak) | 🔴 **Gourmet mimari olarak farklı**: tek marka FormRequest sınıfı kullanıyor, Gastro ve Diet inline `$request->validate()` yazıyor — üç modülün (mekân/etkinlik/gurme) hepsinde tutarlı, bilinçli bir seçim |
| Kaydet düğmesinin konumu | `.form-actions{justify-content:flex-end}` — **sağda** (`sa-icerik-form.css:13-18` aralığı, kit §17 tablosu Gastro kaynağıyla teyitli) | aynı sınıf, aynı kural (paylaşılan reference CSS) | aynı | `.form-actions{justify-content:flex-end}` — **sağda** (`fit-kit.md` §13/§17, kod: `fit-admin.css`) | Sapma yok. Not: Fit'in KENDİ public-yüzey kuralı ("hesap ekranlarında kaydet solda") burada bilinçli olarak İHLAL EDİLİYOR — admin panelinde Gastro'nun sağ-kaydet kuralı geçerli (`fit-kit.md` §13 dipnotu, "ders §27") |
| Taslak/yayınla durumu | `<x-admin.publish-sidebar>` — durum select + yayın tarihi + opsiyonel SEO skoru, **9 çağrı yeri** (tarif/içerik/püf/koleksiyon/sezon/videolar/video-serileri/kısa-videolar/sayfalar) (`publish-sidebar.blade.php` docblock) | aynı bileşen (paylaşılan `resources/views/components/admin/publish-sidebar.blade.php` — dosya kopyası, doğrulanmadı bu turda ama Diet'in form.blade.php'leri aynı `status`/`published_at` prop adlarını kullanıyor) | aynı bileşen kullanımı gözlendi (`mekanlar/form.blade.php` `statusFormId` prop'u — kit belgesinde "FAZ 9" olarak not edilen Venue-özel varyant) | `.side-card`/`.toggle-row`/`.status-dot` sağ sticky yayın kartı, `.seo-score`/`.score-ring`/6 ölçüt (`fit-kit.md` §13, §17) | Sapma yok, isimler dahil birebir taşınmış |
| SEO skoru | Ring + meta + **5 kriterlik** liste (başlık/açıklama/URL/anahtar kelime/kapak), 100 tavan, İyi≥75/Orta≥50/Düşük altı (`publish-sidebar.blade.php` docblock, "revizyon 3") | aynı bileşen | aynı bileşen | `.seo-score` + **6 ölçüt** (`fit-kit.md` §13 satırı: "SEO skoru + geçen/kalan ölçüt listesi") | 🔴 Fit'in kiti **6** ölçüt diyor, Gastro'nun kaynağı **5** kriter listeliyor (docblock'ta "5 kriterlik" açıkça yazılı) — sayı uyuşmuyor, Fit tarafında canlı doğrulanmadı (SEO formu bu turda ölçülmedi) |
| Silme yüzeyi — örnek: kupon | **1 yer**: liste satırının ikon-only `.ia-btn.danger` submit butonu (`kuponlar/index.blade.php:83`); form/edit ekranında silme YOK | ölçülmedi (kuponlar Diet'te yok — karşılaştırılabilir eşdeğer modül bulunamadı) | **3 yer**: liste satır ikonu + liste toplu-işlem "Sil" + **form(edit) ekranının kendi Sil butonu** (`mekanlar/index.blade.php:169,185`; `mekanlar/form.blade.php:181-185`) | **2 yer**: liste satırı (`data-yikici`, `admin-kuponlar-v1.html:227-228`) + form/edit ekranının "Kuponu sil" butonu (`admin-kupon-form-v1.html:214-216`) | 🔴 Dört farklı sayı: Gastro 1 · Gourmet 3 · Fit 2 · Diet ölçülmedi (eşdeğer modül yok) — silme yüzeyinin form ekranına da konup konmayacağı markadan markaya tutarsız bir karar |

---

## 6 · Bileşenler

| Bileşen | Gastro | Diet | Gourmet | Fit | Sapma |
|---|---|---|---|---|---|
| Medya seçici | `<x-admin.image-upload>` bileşeni, `MediaService::MAX_SIZE_BYTES` merkezî sabitten okunan üst sınır (`layout.blade.php:19-24` meta etiketi) | aynı bileşen | aynı bileşen | `.mk-*` modal, `FIT_ADMIN.medya({tekli,sec})` — **Gastro'da doğrudan karşılığı yok, "üstüne inşa edildi"** (`fit-kit.md` §16 tablosu) | Fit'in medya seçicisi Gastro'nun sade `<img>` yükleme bileşenini bir **seç/kütüphaneden-seç modaline** genişletmiş — kabul edilen, dokümante bilinçli fark |
| Zengin metin editörü | **TinyMCE 7.9.3**, self-host (`public/vendor/tinymce/tinymce.min.js`), `package.json:19` | **TinyMCE 7.9.3** — vendored dosyanın kendi sürüm dizgisi (`majorVersion:"7",minorVersion:"9.3"`) doğrulandı; `package.json`da npm bağımlılığı olarak **listelenmiyor** (yalnız bookkeeping farkı, işlevsel fark yok) | **TinyMCE 7.9.3**, `package.json:19` | `.adm-ed` — 3 profil (`varsayilan`/`satir`/`govde`), `FIT_ADMIN.editor()` (`fit-kit.md` §16) | Sürüm parite — üçü de aynı self-host TinyMCE; Diet'in `package.json` kaydı eksik ama vendored dosya aynı |
| Tarih seçici | Native `<input type="date">`, JS kütüphanesi yok (`publish-sidebar.blade.php:138`) | aynı | aynı | Native `<input type="date">` (`admin-hareket-form-v1.html:267`) | Sapma yok |
| Etiket girişi (tag input) | `.ms-box`/`.ms-search`/`.ms-chip` — **6 ekranda** kullanılıyor (`reklam-paketleri`, `mutfaga-giris` ×3, `_token-field.blade.php`, `tarifler/form.blade.php`) | **2 ekranda** | **4 ekranda** | `.etiket()` / `FIT_ADMIN.etiket(sel,{katalog,ad,ico,serbest,tekli,secili})`, `.ms-search` **28px** (44 değil — bilinçli, hedef `.ms-box` `min-height:44px`) (`fit-kit.md` §16) | Kullanım genişliği modül sayısına bağlı, doğrudan kıyaslanamaz; **isim ailesi (`.ms-*`) dördünde de aynı** |
| Sıralama (drag&drop) | **SortableJS 1.15.2**, CDN'den `defer` ile **her form kendi `<script>` etiketini basıyor** — **16 `Sortable.create` çağrısı**, 7 dosyada (`mutfaga-giris/form`, `_body-blocks-list`, `_tab-ders-akisi`, `koleksiyonlar/form`, `puf-noktalari/form`, `sayfalar/form`, `icerik/form`) | **SortableJS 1.15.2**, aynı CDN deseni, en az 3 dosyada (`yazilar/form`, `programlar/form`, `programlar/days`) | **SortableJS 1.15.2**, aynı CDN deseni, en az 2 dosyada (`mutfaga-giris/form`, `gurme-lezzetler/form`) | **Tek sürücü**: `FIT_ADMIN.sirala(sel,{oge,tutamak,degisti})` — merkezî, `.st-card` DnD **+ klavye (↑/↓)** desteği; SortableJS'e bağımlı değil (`fit-kit.md` §16) | 🔴 **Belirgin mimari fark**: üç Laravel markası da sıralamayı SAYFA BAŞINA kendi `Sortable.create()`'i + kendi CDN `<script defer>` etiketiyle kuruyor (merkezî değil, klavye desteği yok); Fit tek merkezî sürücüye çıkarmış ve klavye erişilebilirliğini eklemiş — kit dokümanının kendi tespiti ("Gastro'nun sıralaması yalnız fare") doğrulandı |
| Onay diyaloğu — tetikleme mekanizması | 🔴 **Örtük/metin-sniffing**: `sa-ui.js:60-118` `data-*` özniteliği YOK — buton **ikonuna** (`.fa-trash`) veya **metnine** ("Sil", "İptal Et", "Reddet", "Arşivle", "Kaldır"/"Çıkar") regex ile bakıp 5 aksiyon tipinden birine eşliyor (`DESTR` sözlüğü) | aynı `sa-ui.js` (md5 farklı ama yalnız yorum satırı farkı, davranış birebir aynı — `diff` doğrulandı) | aynı `sa-ui.js` (md5 birebir Gastro ile aynı) | 🔴 **Açık sözleşme**: `data-yikici="Ad" data-fiil="sil\|arsiv\|yayin\|reddet\|iade"` — özniteliğe dayalı, metin/ikon sniffing yok (`fit-kit.md` §16, kod: `admin-kuponlar-v1.html:227`) | **Bu satırda Fit Gastro'dan daha olgun**: Gastro'nun mekanizması buton metni değişirse (i18n, yeniden adlandırma) sessizce kırılabilir; Fit'in `data-*` sözleşmesi metinden bağımsız. Aksiyon kelime dağarcığı da farklı: Gastro 5 tip (sil/iptal/reddet/kaldir/arsiv), Fit 5 tip ama farklı küme (sil/arsiv/yayin/reddet/iade) — "iptal"/"kaldir" Fit'te yok, "yayin"/"iade" Gastro'da yok |
| Onay modalı ölçüleri | `420px` genişlik, ikon `46×46/13px`, dolgu `26px 26px 22px`, kapanış `220ms` (`sa-confirm.css:22-26`) | aynı (`sa-confirm.css` dosyası mevcut, aynı dizin yapısı) | **byte-birebir aynı** dosya (md5 doğrulandı) | Aynı sayılar — `420px`/`46×46/13px`/`26px 26px 22px`/`220ms` (`fit-kit.md` §16, "Gastro'dan birebir taşınan sabitler") | Sapma yok — Fit sayıları harfiyen kopyalamış |
| Toast | `.sa-toast-wrap`, sağ-alt `24px`, gövde **her tipte koyu** (`--slate`) + ikon rengi tipe göre değişir, görünme `2600ms`/çıkış `260ms` (`sa-ui.css:79-96`, `sa-ui.js:28`) | aynı (paylaşılan CSS/JS) | aynı | `FIT_ADMIN.toast(metin,{tip,ms})`, aynı `2600ms`/`260ms` (`fit-kit.md` §16) | Sapma yok |

---

## 7 · Bildirim ve durum mesajları

| Bileşen · özellik | Gastro | Diet | Gourmet | Fit | Sapma |
|---|---|---|---|---|---|
| Flash tipleri — CSS'te tanımlı | **2**: varsayılan (yeşil, "başarılı") + `.is-note` (nötr) (`admin.css:146,151`) | **byte-birebir aynı** dosya (`admin.css:146` aynı satır) | **byte-birebir aynı** | **4**: `.is-ok`/`.is-error`/`.is-warn`/`.is-note` — hepsi CSS'te (`fit-admin.css:993-1007`) | 🔴 Gastro/Diet/Gourmet'te `.sa-flash.danger`/`.is-error` için **CSS kuralı yok**; hata mesajı **6 blade dosyasında** (`sponsorluk-raporu`, `reklam-paketleri/form`, `kreatifler/form`, `kampanyalar/form`, `sponsorlar/form`, `reklam-alanlari/form`) satır-içi/tekrar sınıfla elle çözülmüş — Fit bu üç tipi (`error`/`warn`/`note`) CSS'e taşıyarak kopyalamayı reddetmiş |
| Flash konumu | Sayfa gövdesinin üstü, `.pnl-card`'ın öncesinde — **statik banner**, `margin-bottom` ile içeriği aşağı iter (server-render, sayfa yenilenince gelir) | aynı | aynı | `.flash(tip,metin,kap)` çağrısı — konum kit dokümanında ayrıca belirtilmemiş, ölçülmedi bu turda | Gastro/Diet/Gourmet'te flash **kalıcı** (auto-dismiss yok, JS aranmadı — `setTimeout` flash için bulunamadı); Fit tarafı ölçülmedi |
| Flash süresi | **Kalıcı** — sayfa yenilenene/kapatılana kadar durur (auto-dismiss JS yok) | aynı | aynı | ölçülmedi | — |
| Toast tetikleyici | Client-side JS aksiyonları (silme onayı sonrası vb.) — **8 blade dosyasında** `saToast(` çağrısı | ölçülmedi (aynı `sa-ui.js` yüklü, çağrı sayısı ayrıca sayılmadı) | ölçülmedi | `FIT_ADMIN.toast()` (kit §16) | Gastro'da toast ve flash **iki ayrı kanal**: flash = server-redirect sonucu, toast = client-side JS aksiyonu. Fit'in kiti ikisini de taşımış (`.toast()` + `.flash()`) |
| Hata gösterimi (form validasyonu) | Alan-altı hata metni (Laravel `$errors` bag'i, blade'de `@error()`) — ayrı ölçülmedi (spesifik CSS sınıfı taranmadı) | ölçülmedi | ölçülmedi | ölçülmedi | Bu satır dört markada da **ölçülmedi** — kapsam dışı kaldı, tahmin yazılmadı |

---

## En olgun kim

Bu bir **öneridir**, karar değil — Beyar kanonu buradan seçecek.

- **Sidebar veri mimarisi (§1):** **Diet.** Menü/rail bir PHP dizisinde (`AdminMenu.php`) tek yerde kurulup `View::composer` ile enjekte ediliyor; kabuk sıfır sorgu atıyor ve yeni modül eklerken "bir ekran unutulur, menüsüz kalır" riski yapısal olarak kapanmış. Gastro ve Gourmet aynı riski hâlâ taşıyor — her ikisi de menüyü `layout.blade.php` içine elle, ekran ekran yazıyor (26-28 kalem, tek dosyada 486-508 satır blade+PHP karışımı). Diet'in kendi docblock'u bu riski zaten üç kez yaşadığını kayıtlı tutuyor (T6.1/T6.2/T6.4).
- **Liste ekranı — tablo/filtre/sayfalama (§2):** **Gastro** (Diet ve Gourmet zaten birebir kopyası). Üçü de aynı `.ptable`/`.filter-bar`/paginator zincirini paylaşıyor; kod tekrarı yok, tek kaynak. Fit bunu aynen taşımış, bu eksende fark yaratmıyor.
- **Toplu işlem (bulk) kapsamı (§2):** **Gourmet.** Tek marka toplu işlemi 5 farklı ekranda, paylaşılan `_bulkbar`/`_bulkjs` partial'ıyla standart bir desen hâline getirmiş. Gastro ve Fit "yalnız moderasyonda" ile dar kalmış, Diet'te hiç yok.
- **Form doğrulama mimarisi (§5):** **Gourmet.** `StoreXRequest`/`UpdateXRequest` FormRequest sınıfları, doğrulama kuralını controller'dan ayırıyor, test edilebilirliği ve okunabilirliği artırıyor. Gastro ve Diet'in inline `$request->validate([...])` deseni işlevsel olarak aynı sonucu veriyor ama controller'ı şişiriyor (Gastro `RecipeController` private `validated()` metodu 30+ satır).
- **Sıralama (drag&drop) mimarisi (§6):** **Fit.** Tek merkezî sürücü (`FIT_ADMIN.sirala`) + klavye desteği. Üç Laravel markası da sayfa başına kendi `Sortable.create()` + CDN `<script defer>` kopyasını basıyor — kod tekrarı ve `defer` tuzağı (Gastro'nun kendi dokümante ettiği borç) hâlâ üçünde de duruyor.
- **Onay diyaloğu tetikleme sözleşmesi (§6):** **Fit.** `data-yikici`/`data-fiil` açık özniteliği, buton metnine/ikonuna bakan Gastro'nun (ve onu birebir kopyalayan Diet/Gourmet'in) örtük regex-eşlemesinden daha sağlam — i18n veya metin değişikliğinde kırılmaz.
- **Bildirim tipi kapsamı (§7):** **Fit.** Dört flash tipinin dördü de CSS'te tanımlı; Gastro/Diet/Gourmet üçü de yalnız 2 tipi CSS'e yazmış, hata durumunu 6 ayrı blade dosyasında elle tekrarlıyor.
- **Sidebar/liste GÖRSEL dili (rail-menü-kart-tablo geometrisi, §1-§2 ölçüleri):** **Gastro** — kaynak, üçü de (Diet/Gourmet/Fit) piksel piksel ondan türüyor.

---

## Rapor özeti

- **7 başlığın 7'si** ölçüldü (Sidebar, Liste, Ekleme, Düzenleme, Form, Bileşenler, Bildirim).
- Toplam **~62 satır** karşılaştırma tablolarında.
- **"yok" yazılan hücre:** yaklaşık 6 (Diet'te kuponlar eşdeğeri yok, Gastro'da rail'de dış link yok, sıralama kolon-tıkla dördünde de yok vb. — her biri tablonun kendi hücresinde gerekçeli).
- **"ölçülmedi" yazılan hücre:** yaklaşık 14 — çoğunlukla (a) Diet/Gourmet'te satır yüksekliği gibi DOM-bağımlı ölçüler (üç Laravel deposu da canlı sunucu değil, statik dosya okuması), (b) form hata gösterimi (kapsam dışı bırakıldı, tahmin yazılmadı), (c) Fit'in flash konumu/süresi (bu turda canlı ölçülmedi, yalnız kit dokümanından okundu).
- **En çarpıcı üç sapma:**
  1. **Toplu işlem kapsamı** — Diet 0 ekran, Gastro/Fit 1 ekran, Gourmet 5+ ekran; aynı "kanon"dan türeyen dört marka toplu-işlemi tamamen farklı yaygınlıkta kullanmış.
  2. **Sidebar veri mimarisi** — Diet menüyü tek PHP dizisinde merkezîleştirmiş (`AdminMenu.php` + `View::composer`), Gastro/Gourmet hâlâ 486-508 satırlık blade'e elle yazıyor; Diet'in kendi geçmişinde bu yüzden üç kez kalem-unutma hatası yaşanmış.
  3. **Form doğrulama mimarisi** — Gourmet üç modülünde de ayrı FormRequest sınıfı kullanıyor, Gastro ve Diet inline `$request->validate()` yazıyor; aynı üründe (Gourmet) bile eski davranıştan (K13 kararı sonrası konsolide edilen `admin-gourmet.php`) yeni davranışa (`admin-gourmet-ui.php`) geçiş bu turda net görülüyor.
- **Gourmet için seçilen depo:** `dadagastro-gourmet-admin` (HEAD `c7219426`) — `dadagastro-gourmet` (HEAD `0355aa91`) üç commit geride ve admin panelinin son bağlanan rota/sidebar değişikliğini içermiyor; ikisi de aynı GitHub remote'una bağlı, muhtemelen aynı çalışma kopyasının iki ayrı checkout'u.

Kullanılan komutlar: `git -C <yol> rev-parse --short HEAD`, `grep -n` (yalnız konum bulmak için, sayı hep dosyadan okundu), `diff`/`md5 -q` (dosya pariteleri için), `PW_HOME=~/.pw node <script>.mjs` (Fit canlı ölçümü, `tests/_pw.mjs` sarmalayıcısı üzerinden).
