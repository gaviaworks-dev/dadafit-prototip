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

## A2 · Banner'lı sayfalarda header şeffaf + Planım solid

- [ ] **Ölçülen referans (dadadiet.com, 1440px):**
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
- [ ] `fit-shell.js` — banner taşıyan sayfalar için şeffaf-header modu
  (`data-fit-hero="1"` yanına banner sayfalarını da alan tek bayrak; sayfa sayfa kopya yok).
- [ ] `fit-shell.css` — `.lib-top`/`.fp-top` banner'ları header'ın altından başlayacak şekilde
  üst boşluk düzeltmesi (şeffaf header artık banner'ın üzerinde duruyor).
- [ ] `fit-shell.css` — `.btn-plan` solid primary (`--fit` zemin, beyaz metin);
  `at-top` durumunda beyaz-şeffaf varyantı korunur (DadaDiet'te de öyle).
- [ ] **Ölçüm:** her banner sayfasında scroll=0 ve scroll=400'de header `backgroundColor`
  + `.btn-plan` `backgroundColor`; banner metninin header altında kalmadığı (üst üste binme yok)
  boundingBox ile doğrulanacak. Test: `tests/header-banner.mjs`.

## A3 · Egzersiz kütüphanesi banner'ındaki arama input'u kalkacak

- [ ] `egzersiz-kutuphane-v1.html` — banner içindeki `.lib-search` formu kaldırılacak.
- [ ] Aramanın kaybolmaması için: header'daki arama ikonu + sayfa içi filtre bileşeni yeterli;
  kaldırılan input'un beslediği JS varsa (`libSearchInput`) filtre motorundan güvenle sökülecek.
- [ ] **Referans doğrulaması:** DadaDiet `/diyetisyenler` banner'ında arama input'u **yok** —
  banner'da yalnız `.chips` içinde `btn-primary` + `btn-ghost` var (ölçülen DOM: `div.chips.drag-scroll`).

## A4 · Antrenörler sayfası — dadadiet.com/diyetisyenler kurgusu

- [ ] Banner içindeki arama input'u kaldırılacak (A3 ile aynı kural).
- [ ] **Ölçülen referans kurgu** (1440px, `/diyetisyenler` DOM + CSS):

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

- [ ] `fit-shell.css` — bu kurgu **merkezi** olarak eklenecek (`.lst-layout`, `.lst-side`,
  `.fct*`, `.dz-*` DadaFit yeşiline ve mevcut token'lara uyarlanmış hâlde). Sayfaya kopyalanmaz.
- [ ] `antrenorler-v1.html` — sol filtre kolonu + sağ kart grid'i + altta sayfalama kurgusuna geçiş.
- [ ] **Kritik kısıt:** sayfanın kendi filtre motoru `.fgroup[data-group]` kutularını sorguluyor
  (bkz. HANDOFF §3). Facet'ler akordeona taşınırken `.fgroup` düğümleri **silinmeyecek, taşınacak**;
  `.df-fchip` düğümleri klonlanmayacak — yoksa filtreleme sessizce ölür.
- [ ] Mevcut `.pager` (`.pg`, 1…3[4]5…9 deseni) korunur — DadaDiet ile aynı sınıf dili zaten.
- [ ] ≤1024px'te sol kolon alttan çekmeceye döner (DadaDiet davranışı).
- [ ] **Ölçüm:** 1440/1280/1024/768/390'da grid kolon sayısı, sticky kolonun yapışması,
  yatay taşma yok, filtre seçince kart sayısının düşmesi. Test: `tests/coach-list.mjs`.

---

# FAZ 1 — BAĞIMSIZLAŞTIRMA (belge §1)

Ölçülen kapsam: **1416** "DadaMutfak" geçişi, **70** "Mentor" geçişi.
Bunun ~1150'si 12 legacy sayfanın kendi satır içi turuncu kabuğunda (Faz 2'de kalkacak).

- [ ] **DadaMentor tamamen kaldırılacak** (belge §1 ve §21 — yerine başka AI asistanı da eklenmeyecek):
  - [ ] `fit-shell.js` — `MENTOR_HTML` sabiti (satır ~527) ve mount'taki kullanımı (satır ~604)
  - [ ] `fit-shell.js` — DadaMentor davranış bloğu (satır ~1208–…)
  - [ ] `fit-shell.css` — `.mentor-*` kuralları (21 geçiş)
  - [ ] `assets/video/mentor-panel.mp4` dosyası silinecek (belge §18: "ilgili video ve kodları temizle")
  - [ ] Sayfalardaki artık `mentor` geçişleri (çoğu tek satır yorum/överlay) taranacak
  - [ ] Footer içinde/üstünde Mentor kalmayacak (belge §16)
- [ ] **Marka dili** (fit-shell + 35 DadaFit sayfası):
  - [ ] "DadaMutfak Onaylı Antrenör" → "**DadaFit Onaylı Antrenör**"
  - [ ] "DadaMutfak Pro" → "**DadaFit Pro**"
  - [ ] Sayfa `<title>`'larındaki DadaMutfak ifadeleri
  - [ ] Breadcrumb başlangıcı "DadaFit Ana Sayfa"
- [ ] **Ekosistem bağlantıları** yalnız kontrollü kalacak: üst bant marka barı + hesap menüsündeki
  "DadaMutfak'a dön" ve "Çıkış" hedefleri gözden geçirilecek (belge §14: başka prototipin HTML
  sayfasına doğrudan bağımlılık kurulmayacak → yapılandırılabilir servis adresi).
- [ ] Çıkış bağlantısı DadaFit'in kendi çıkış hedefine bağlanacak (bugün DadaMutfak portalına gidiyor).

---

# FAZ 2 — 12 LEGACY SAYFANIN ORTAK KABUĞA TAŞINMASI (belge §1, §23)

`bildirimler · giris · hakkimizda · hesabim · iletisim · pro-odeme · pro · profil · reklam-ver ·
rozetler · sss · yasal` — her biri kendi satır içi turuncu DadaMutfak kabuğunu taşıyor
(`--tomato:#E14827`), `fit-shell.css/js` yüklemiyor. Belge bunları DadaFit arayüzüne geçirmeyi
açıkça istiyor; ayrıca §23 "sayfa bazında tekrarlanan header ve footer kodlarını temizle" diyor.

- [ ] Sayfa sözleşmesine geçiş: `<div id="fitShellTop">` / `<div id="fitShellBottom">` + `fit-shell` yükleme
- [ ] Gömülü header/nav/footer/drawer/topbar markup'ı ve onların `<style>`/`<script>` blokları sökülecek
- [ ] Ölü kod: `.row-track`/`.row-nav` slider CSS+JS (bu 12 dosyada tanımlı, markup'ı yok) — silinecek
- [ ] Sayfaya özgü içerik stilleri korunacak, marka token'ları DadaFit yeşiline çevrilecek
- [ ] Sıra (küçükten büyüğe, her biri ayrı doğrulama): `sss` → `iletisim` → `yasal` → `bildirimler`
      → `hakkimizda` → `pro` → `pro-odeme` → `giris` → `rozetler` → `hesabim` → `reklam-ver` → `profil`
- [ ] **Ölçüm:** her sayfa taşındıktan sonra 4 genişlikte konsol hatası / yatay taşma / kırık link taraması

---

# FAZ 3 — NAVİGASYON (belge §2, §3, §16)

- [ ] **Masaüstü mega menü** — Hareket paneli belgedeki 11 kalemle iki kolon (bugünkü yapı büyük ölçüde uygun;
      belge "Hareket Merkezi"ni de panelde istiyor → *aynı-hedefe-tek-kapı* kuralıyla çelişiyor, **doğrulanacak**)
- [ ] **Programlar** paneli: Programlar Merkezi · Tüm Programlar · Programımı Bul · **Fit Testleri** · **Video Seansları**
- [ ] **Enerji Defteri ana menüye** (Planım'dan çıkacak): Bugünkü Denge · Aktivite Günlüğü · Su Takibi ·
      Haftalık Denge Özeti · Bağlı Uygulamalar ve Cihazlar
- [ ] **Challenge** paneli: Merkez · Aktif · Yaklaşan · Tamamlanan · Detay
- [ ] **Antrenörler** paneli: Antrenör Bul · Antrenör Profili · Randevu Al · Antrenör Ol
      (bugün panelsiz düz link — belge panel istiyor; A4 referansı DadaDiet'te panelsiz. **Doğrulanacak**)
- [ ] Sağ üst: Arama · Planım · Giriş Yap · Bildirimler · Hesabım (Planım ana menüye girmez ✔ zaten öyle)
- [ ] **Mobil alt bar 5 öğe** ✔ (bugün 5) — korunacak
- [ ] Enerji Defteri'ne mobil erişim: ana sayfa hızlı erişim kartı + drawer + Planım günlük özeti
- [ ] Drawer masaüstündeki tüm ana modülleri taşıyacak
- [ ] **Footer** belgedeki 4 kolona göre yeniden kurulacak (DadaFit · Kurumsal · İletişim · Yasal ve Sağlık),
      logo altı metni: "Günlük hareketini, enerjini ve ilerlemeni kendi ritminde yönet."
      Eksik hedefler: Sponsorlar ve Partnerler · Destek Merkezi · Üyelik ve İptal Koşulları ·
      Çerez Politikası · Veri ve İzin Politikası

---

# FAZ 4 — PLANIM (6 sekme) ve HESABIM (belge §4, §5)

Bugün `PLAN_NAV` 11 kalem. Belge 6 istiyor.

- [ ] Yeni `PLAN_NAV`: **Bugün · Plan ve Takvim · Aktivite Kayıtlarım · İlerlemem · Kaydettiklerim · Antrenörüm**
- [ ] Eşleme: `programim`→Plan ve Takvim · `gecmis`→Aktivite Kayıtlarım · `ilerleme`+`rozetler`→İlerlemem ·
      `kaydettiklerim`→aynı · `randevular`→Antrenörüm
- [ ] Planım'dan **çıkacaklar**: `defter` (→ ana menü, Faz 3) · `kopru` (→ Enerji Defteri içi açıklayıcı sistem) ·
      `saglik` ve `veri` (→ Hesabım)
- [ ] Her sekmenin belgedeki alt içerik listesi karşılanacak (Bugün'e §9 günlük durum kartı dahil)
- [ ] **Hesabım** 14 modül: Profil · Sağlık ve Hareket Profilim · Veri ve İzinlerim · Bildirim Tercihlerim ·
      Bağlı Uygulamalar · Üyelik ve Paketim · Ödeme Geçmişim · Faturalarım · Güvenlik · Dil ve Bölge ·
      Destek Taleplerim · Hesabı Dondurma · Verilerimi İndir · Hesabımı Sil
- [ ] `ACCOUNT` menüsü `PLAN_NAV`'dan türediği için (HANDOFF §1) Hesabım listesi ayrı bir diziye ayrılacak

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
