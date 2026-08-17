# DadaFit prototip — arayüz revizyonu (11 madde)

Referans: <https://dadadiet.com/> ve <https://dadadiet.com/diyetisyenler>
(DadaFit, DadaDiet'in kardeş ürünü — header davranışı ve liste sayfası kurgusu aynı mantıkta.)

Bu dosya oturum kopması hâlinde kaldığı yerden devam edebilmek için tutulur.
Her madde bitince kutusu işaretlenir.

---

## Mimarî tespit (uygulamadan önce yapılan okuma)

| Katman | Dosya | Kapsam |
|---|---|---|
| Ortak kabuk JS | `assets/js/fit-shell.js` | `NAV`, `BOTTOM`, `FOOTER_COLS`, `PLAN_NAV`, `ACCOUNT` dizileri + topbar/header/drawer/footer markup üretimi + tüm kabuk davranışı |
| Ortak kabuk CSS | `assets/css/fit-shell.css` | token'lar, header/dropdown, kart kabukları, filtre çipi, responsive |
| Tipografi (YENİ) | `assets/css/fit-type.css` | justify + hyphens — 46 sayfanın tamamına link'lenir |

- **34 sayfa** `fit-shell.css`/`fit-shell.js` kullanır → kabuk değişikliği tek yerden.
- **12 eski sayfa** kendi satır içi DadaMutfak (turuncu) kabuğunu taşır:
  `bildirimler, giris, hakkimizda, hesabim, iletisim, pro-odeme, pro, profil,
  reklam-ver, rozetler, sss, yasal`. Bunlara yalnız `fit-type.css` eklenir.
- Filtre paneli **6 sayfada** kullanılıyor:
  `program-liste` (`.lib-filters`), `egzersiz-kutuphane` (`.lib-filters`),
  `antrenorler` (`.lib-filters`), `programlar-merkezi` (`.pm-panel`),
  `challenge-merkezi` (`.cm-panel`), `hareket-merkezi` (`.hm-panel`).

---

## 1 · Antrenörler — dropdown kalkar, liste sayfası olur

- [x] **Kök neden:** `fit-shell.js` içindeki `NAV[antrenorler]` kaleminde `dd:[…]` dizisi var;
  `navHtml()` `dd` gören her kaleme chevron + panel basıyor ve tıklamayı `preventDefault` ediyor.
  DadaDiet'te aynı başlık (`Diyetisyenler`) bilinçli olarak **panelsiz düz bağlantı**.
- [x] `fit-shell.js` — `NAV[antrenorler].dd` kaldırıldı → düz link.
- [x] `antrenorler-v1.html` — banner'a `Antrenör Ol` CTA'sı (DadaDiet `.chips` + `btn-primary`/`btn-ghost` deseni).
- [x] `antrenorler-v1.html` — "daha fazla yükle" yerine numaralı sayfalama.

## 2 · Header dropdown kayma bug'ı

- [x] **Kök neden (üç katmanlı):**
  1. `html,body{overflow-x:hidden}` (fit-shell.css:460) — `overflow-x:hidden` kökü **yatay kaydırma
     konteynerine** çevirir. Taşan bir öğe (dropdown, çip rayı) içindeki bağlantı odak alınca
     tarayıcı kökü sağa kaydırır; sayfa kayar.
  2. Drawer / görüş modalı / lg-gate / pro-gate / sihirbaz — hepsi ayrı ayrı
     `document.body.style.overflow='hidden'` yazıyor. Dikey kaydırma çubuğu kaybolunca
     `clientWidth` ~15px büyür, `.wrap` yeniden ortalanır → **layout sağa sıçrar**.
  3. Nav tetikleyicisi `e.preventDefault()` ile yalnız panel açıp kapatıyor; başlığın kendi
     hedefine gitmiyor. DadaDiet kuralı: *"panel yalnız hover ile açılır, başlık tıklanınca
     merkeze gidilir."*
- [x] `fit-shell.css` — `html{overflow-x:clip; scrollbar-gutter:stable}` (clip kaydırma konteyneri
  yaratmaz; gutter her zaman rezerve → hiçbir modal sıçrama üretemez).
- [x] `fit-shell.js` — tek `lockScroll()/unlockScroll()` helper'ı; tüm modal/drawer yolları buna bağlandı.
- [x] `fit-shell.js` — nav: hover'da açılır, başlık tıklanınca merkeze gider; dokunmatikte ilk dokunuş açar.

## 3 · "Fit Planım" dropdown'ı → "Planım" butonu

- [x] **Kök neden:** `NAV[fit-planim]` bir dropdown kalemi. DadaDiet'te Planım ana menüde değil,
  `.head-actions` içinde kişisel buton (`<a class="btn-login"><i class="fa-solid fa-list-check"></i> Planım</a>`).
- [x] `fit-shell.js` — `NAV`'dan `fit-planim` kalemi kaldırıldı.
- [x] `fit-shell.js` — `.head-actions` içine `Planım` butonu (arama ile Giriş Yap arasında, iki oturum durumunda da görünür).
- [x] `fit-shell.js` — `ACCOUNT` menüsü DadaDiet deseninde tüm Planım kalemlerini listeler.
- [x] `fit-shell.js` — `PLAN_NAV`'a `Enerji Köprüsü` eklendi (kullanıcı listesinde vardı, rayda yoktu).
- [x] `fit-planim-v1.html` sekmeli yapısı korunur — yalnız giriş noktası tekilleşir.

## 4 · Program liste filtreleri — UX yenileme (ortak bileşen)

- [x] **Kök neden:** `.fgroup` satırları alt alta diziliyor (`program-liste` 4, `programlar-merkezi` 5,
  `antrenorler` 3+3, `hareket-merkezi` 3, `challenge-merkezi` 3, `egzersiz-kutuphane` 3).
  ≤640px'te `overflow-x:auto` ile yatay kaydırma rayına dönüşüyor.
- [x] `fit-shell.css` + `fit-shell.js` — yeni `.ff` bileşeni:
  kompakt tek satır bar · grup başına popover (çoklu seçim) · aktif filtre çipleri (tek tek kaldırılabilir) ·
  aktif sayaç + "Filtreyi sıfırla" · sonuç sayısı + sıralama aynı satırda · sticky bar ·
  ≤900px "Filtrele" drawer'ı.
- [x] **Yöntem:** bileşen mevcut `.df-fchip` düğümlerini *taşır* (klonlamaz) → her sayfanın kendi
  filtre motoru değişmeden çalışmaya devam eder.
- [x] 6 sayfaya `data-ff` bağlanışı.

## 5 · Yeni Başlayanlar sayfasındaki boşluk

- [x] **Kök neden:** `fit-shell.css:1082` `.hr-note{margin-top:34px}`; disclaimer section'ı
  `style="padding-top:0"` taşıdığı için çocuk margin'i section'ın **dışına taşıyor**
  (margin collapse) ve gövde grisini gösteren 34px'lik boşluk açılıyor.
  Ölçüm: "Sırada" section 1704→2214, disclaimer 2248'de başlıyor.
- [x] `fit-shell.css` — `.wrap>.hr-note:first-child{margin-top:0}`; 7 rehber sayfasını birden düzeltir.

## 6 · Tüm içerikler justify

- [x] **Kök neden:** `fit-shell.css:1396` `.wrap p,.fp-card p,.hr-note p{text-align:left}`
  ("dar kolonda iki yana yaslama yok" kuralı) — yeni istekle çelişiyor, kaldırılacak.
- [x] `assets/css/fit-type.css` (YENİ) — paragraf/açıklama/kart metni `text-align:justify`,
  `hyphens:auto`, `-webkit-hyphens`, `overflow-wrap:break-word`, `text-wrap:pretty`;
  başlık · buton · etiket · tablo · sayısal alanlar hariç.
- [x] 46 sayfanın tamamına `<link>`.

## 7 · Egzersiz detay — set takibi paneli zenginleştirme

- [x] **Kapsam:** `egzersiz-detay-v1.html` sağ kolon (`.ed-track`).
- [x] Set arası dinlenme geri sayımı (uyarı + ses/titreşim tercihine saygı)
- [x] Kronometre (antrenman süresi)
- [x] Set başına tekrar + ağırlık + RPE, toplam hacim
- [x] Tamamlanan set işareti, önceki antrenmanla karşılaştırma
- [x] Hızlı not
- [x] "Antrenmanı bitir → özet" akışı (localStorage örnek durum)

## 8 · "Videoyu izleyemiyor musun?" uyarısı

- [x] **Kök neden:** blok `main` sonunda başıboş bir `.wrap` içinde, sola yaslı, section dışı.
- [x] `egzersiz-detay-v1.html` + `fit-shell.css` — ortalanmış `.hr-note.is-center` varyantı,
  üst/alt nefes, yumuşak zemin, ikon + tek satır metin.

## 9 · Menü linklerinde duplike temizliği

- [x] **Kök neden — Hareket:** 8 kalemin 5'i iki hedefe gidiyor
  (`hareket-merkezi` ×2, `egzersiz-kutuphane` ×4 `?bolge=` varyantıyla).
  Ayrıca **7 gerçek rehber sayfası menüde hiç yok**:
  `yeni-baslayanlar, dogru-form, sureye-gore, hedefe-gore, bolgeye-gore, masa-basi, isinma-soguma`.
- [x] **Kök neden — Programlar:** `Tüm Programlar` → `program-liste-v1.html`,
  `Ücretsiz ve Pro` → `program-liste-v1.html#pro` (aynı sayfa, üstelik **`#pro` çapası orada yok** —
  gerçek `id="pro"` `programlar-merkezi-v1.html:294`'te).
  `Tek günlük rutin` → `hareket-merkezi#sure` = Hareket menüsündeki kalemin kopyası.
- [x] Hareket dropdown'ı yeniden kuruldu — 11 benzersiz hedef, iki kolon.
- [x] Programlar dropdown'ı sadeleşti — Ücretsiz/Pro tek girişte birleşti.
- [x] Challenge → header'da kendi butonu.
- [x] Footer / drawer / bottom-nav / hesap menüsü aynı kuralla gezildi, duplike hedef bırakılmadı.

## 10 · Pro slider'ları

- [x] **Tespit:** `program-liste-v1.html#pro` çapası **hiç yok**; menü oraya gönderiyordu.
  Sayfada carousel de yok — "slider" görünen şey ≤640px'te yatay kaydırma rayına dönüşen
  `.fgroup` filtre satırları. Ayrıca kabukta `.row-track/.row-nav` slider altyapısı
  ok devre-dışı durumu, klavye erişimi ve snap olmadan duruyor.
- [x] Filtre rayları madde 4'teki `.ff` bileşeniyle tamamen kalktı.
- [x] `#pro` hedefi düzeltildi (`programlar-merkezi-v1.html#pro`), `program-liste`'den de erişim verildi.
- [x] `.row-track` slider altyapısı: ok devre-dışı durumları, snap, mobil swipe, klavye erişimi.

## 11 · Challenge kartları okunmuyor

- [x] **Kök neden:** `fit-shell.css:953` `.cc-card,.ed-altcard` — **hiçbir overlay gradient'i yok**;
  başlık ve açıklama doğrudan fotoğrafın üstünde.
- [x] `fit-shell.css` — koyu gradient overlay + metin gölgesi + AA kontrast.

---

## Çalışma kuralları

- Ortak header/nav ve filtre bileşeni **tek yerden** düzeltilir; sayfa sayfa kopyala-yapıştır yok.
- Değişiklik sonrası tüm sayfalar gezilir: kırık link ve bozulan layout kalmaz (1440 / 1024 / 768 / 390).
- Mevcut tasarım dili, renk paleti ve tipografi korunur.
- Her ana adımda ayrı commit (İngilizce mesaj). **Push onaya tabi.**

## Commit sırası

- [x] `shell:` overflow/scroll-lock + NAV yeniden kurgusu (madde 1·2·3·9)
- [x] `type:` fit-type.css + justify (madde 6)
- [x] `filters:` ortak `.ff` bileşeni (madde 4·10)
- [x] `pages:` antrenörler listesi, egzersiz detay, hr-note, challenge kart (madde 1·5·7·8·11)
- [ ] `qa:` çapraz sayfa doğrulama düzeltmeleri
