# DadaFit prototip — devir notu

Bu dosya ile `REVIZE-PLAN-2.md` birlikte okunduğunda yeni bir oturum işe kaldığı
yerden devam edebilir. Başka dosya okumaya gerek yok.

- **Ne bu repo:** arka ucu olmayan, statik HTML/CSS/JS arayüz prototipi. 47 sayfa.
- **Canlı:** <https://gaviaworks-dev.github.io/dadafit-prototip/> (GitHub Pages, `main`)
- **Kaynak belge:** `~/Desktop/DadaFit - Source/17 Ağustos /dada-fit.docx`
  (26 bölüm + nihai kabul kriterleri). Fazlar bu belgeden türedi; `REVIZE-PLAN-2.md`
  madde madde işaretli.
- **Tasarım referansı:** <https://dadadiet.com> ve <https://dadadiet.com/diyetisyenler> —
  kardeş ürün, aynı kabuk ailesinden. Header davranışı ve liste sayfası kurgusu
  oradan **ölçülerek** alındı. Tartışmalı bir karar varsa önce oraya bak.
- **Durum:** 20 commit yerelde, **push edilmedi**. Faz 2 → 9/12.

---

## 1 · Kabuk sözleşmesi

Üç dosya sitenin tamamını yönetir. Sayfa dosyalarına kabuk markup'ı **kopyalanmaz**.

| Dosya | Satır | Ne yapar |
|---|---|---|
| `assets/js/fit-shell.js` | 2310 | Menü dizileri + tüm kabuk markup'ının üretimi + tüm kabuk davranışı |
| `assets/css/fit-shell.css` | 2192 | Token'lar, kabuk, kanonik kart/çip/banner kitleri, `.ff` filtre bileşeni, dizin kurgusu, responsive |
| `assets/css/fit-type.css` | 178 | Metin yaslama katmanı (justify + tireleme) |

### Sayfa iskeleti — her sayfa yalnızca bunu yazar

```html
<head>
  … meta · benzersiz <title> · benzersiz meta description …
  <link rel="stylesheet" href="…font-awesome…" />
  <link rel="stylesheet" href="assets/css/fit-shell.css" />   <!-- kabuk -->
  <style> … YALNIZ sayfaya özgü CSS … </style>
  <link rel="stylesheet" href="assets/css/fit-type.css" />    <!-- EN SONDA -->
</head>
<body data-brand="fit" data-fit-page="<anahtar>">
  <div id="fitShellTop"></div>     <!-- üst bant + header + drawer + alt bar + görüş + çerez -->
  <main class="page-main" id="pageMain"> … sayfa içeriği … </main>
  <div id="fitShellBottom"></div>  <!-- giriş kapısı + footer + başa dön -->
  <script src="assets/js/fit-shell.js"></script>
  <script> … yalnız sayfa JS'i … </script>
</body>
```

**Kritik ayrıntılar:**

- `fit-shell.js` iki `<div>`'i `outerHTML` ile **değiştirir**
  (`fit-shell.js:668` ve `:678`). Mount div'i DOM'da kalıyorsa kabuk çalışmamıştır.
- `data-brand="fit"` **zorunlu**; `data-fit-page` verilmezse dosya adından çözülür.
- `fit-type.css` **her zaman `</head>`'ten hemen önce** — sayfa `<style>`'ından
  SONRA. Sıra bozulursa sayfa içi `text-align` kuralları yaslamayı geri alır.
- **DadaMentor kaldırıldı** (belge §1/§21). Yerine başka bir yapay zekâ asistanı
  eklenmeyecek. Kodu, CSS'i, 2.4MB videosu ve yalnız onun kullandığı ölü token
  bloğu silindi.

### Üçüncü mount noktası — Planım kabuğu

```html
<div id="fitPlanTop" data-plan-page="…" data-plan-title="…" data-plan-sub="…"></div>
```

Banner + breadcrumb + sekme rayını üretir (`fit-shell.js:683`). **10 sayfa** kullanır.

### `fit-shell.js` içindeki veri yapıları

| Dizi | Satır | Besler |
|---|---|---|
| `ECO_BASE` / `ECO` | 52 / 53 | Kardeş ürün adresleri — **tek kaynak** (belge §14) |
| `FIT_LOGOUT` | 61 | DadaFit'in kendi çıkış hedefi |
| `NAV` | 63 | Masaüstü ana menü + mobil drawer |
| `BOTTOM` | 115 | Mobil alt bar — **beşten fazla öğe olamaz** (belge §3) |
| `FOOTER_COLS` | 124 | Footer link kolonları |
| `PLAN_TABS` | 185 | Planım sekme rayı — **tam altı kalem** (belge §4) |
| `PLAN_PAGES` | 207 | `#fitPlanTop` kullanan TÜM sayfalar (ray dışı olanlar dahil) |
| `ACCOUNT_ITEMS` | 227 | Hesabım menüsü — belge §5'in 14 modülü |

**`PLAN_TABS` / `PLAN_PAGES` ayrımına dokunma.** Ray altı sekmeden, başlık ve
breadcrumb tüm plan sayfalarından çözülür. Ayrım kaldırılırsa ray dışı dört sayfa
(`enerji-defteri`, `fit-planim-rozetler`, `fit-planim-saglik-profil`,
`fit-planim-veri-izin`) **boş başlıkla** açılır.

**`ACCOUNT_ITEMS` içindeki "AŞAMA NOTU"**: üç kalem (Bağlı Uygulamalar ·
Üyelik/Ödeme/Fatura · Destek Talepleri) henüz üretilmemiş Faz 5 sayfalarına ait;
şimdilik var olan en yakın sahibe bağlı. Sayfalar gelince **yalnız href'ler** değişir.

### Kabuk davranış kuralları

- **Kaydırma kilidi:** `body.style.overflow`'a **asla** yazma.
  `FIT_SHELL.lockScroll()` / `unlockScroll()` çağır (sayaçlı).
- **Aç/kapa durum korumalı olmalı:** `if(el.classList.contains('open')) return;`
- **Şeffaf header:** `OVER_MODE` (`fit-shell.js:750`) sayfada `.lib-top` veya
  `.fp-top` görürse `body[data-fit-over="1"]` yazar; header banner üzerinde
  şeffaf başlar, scroll'da katıya geçer. Sayfa bir şey yapmaz. `?hdr=solid` katıyı zorlar.
- **Odak tuzağı:** `trapFocus(el)` (`fit-shell.js:846`) — odağı içeri alır, Tab'ı
  döngüye sokar, döndürdüğü fonksiyon odağı açan öğeye geri verir. **Bilinen kusuru
  var, bkz. §4.**

### Demo/durum parametreleri

`?auth=1|0` · `?role=antrenor|diyetisyen|isletme` · `?dd=1` · `?drawer=1` · `?cc=1` ·
`?fb=1` · `?lg=1` · `?wizard=1` · `?hdr=solid` · `?pg=1`
Saklama: `localStorage` — `dm_user`, `dm_fit`, `dm_fit_ex`, `dm-cookie-consent`.

---

## 2 · Envanter — 47 sayfa

### Legacy göçü (belge §1, §23) — **9/12 bitti**

12 sayfa kendi satır içi turuncu DadaMutfak kabuğunu taşıyordu. Ortak kabuğa geçenler:

```
✅ sss-v1 · iletisim-v1 · yasal-v1 · bildirimler-v1 · hakkimizda-v1
✅ pro-v1 · giris-v1 · hesabim-v1 · reklam-ver-v1
```

**KALAN 3 — hiç başlanmadı:**

| Sayfa | Boyut | Yapılacak |
|---|---|---|
| `pro-odeme-v1.html` | 119KB · 1871 satır | Pro ödeme akışı. `pro-v1`'deki üç kademeyle (Ücretsiz/Pro/Pro Max) tutarlı olmalı; belge §15'in ödeme geçmişi ve fatura alanları |
| `rozetler-v1.html` | 149KB · 2061 satır | **İçerik çevrilecek:** "şef kademesi" / mutfak rozetleri → **DadaFit hareket rozetleri** (aktif gün, kuvvet günü, program tamamlama, challenge). Planım > İlerlemem ile tutarlı olmalı |
| `profil-v1.html` | 356KB · 4967 satır | **Tek ajan almalı** — en büyük dosya. Göç aracının eski `</main>` sınır sapması burada 16661 karakterdi; düzeltildi ama bu dosyada ayrıca dikkatli ol |

Göç tarifi: `tools/FAZ2-BRIEF.md` (ajana verilecek brief) + `tools/legacy-migrate.py`.

### Diğer sayfalar

| Modül | Sayfalar |
|---|---|
| Giriş | `index.html` (prototip haritası), `dadafit-hub-v1` |
| Hareket | `hareket-merkezi-v1`, `egzersiz-kutuphane-v1`, `egzersiz-detay-v1`, `hareket-rehberi-v1` + 7 rehber alt sayfası, `hareket-sozluk-v1` |
| Programlar | `programlar-merkezi-v1`, `program-liste-v1`, `program-detay-v1` |
| Challenge | `challenge-merkezi-v1`, `challenge-v1` |
| Planım (`#fitPlanTop`, 10 sayfa) | `fit-planim-v1` · `enerji-defteri-v1` · `fit-planim-programim-v1` · `fit-planim-gecmis-v1` · `fit-planim-ilerleme-v1` · `fit-planim-rozetler-v1` · `fit-planim-kaydettiklerim-v1` · `fit-planim-randevular-v1` · `fit-planim-saglik-profil-v1` · `fit-planim-veri-izin-v1` |
| Antrenörler | `antrenorler-v1`, `antrenor-detay-v1`, `antrenor-ol-v1` |
| Diğer | `arama-fit-v1`, `saglik-bilgilendirme-v1`, `dadafit-kopru-v1` |

24 sayfa `.lib-top` banner taşır → hepsinde şeffaf header modu otomatik açık.

---

## 3 · Faz durumu

| Faz | Durum |
|---|---|
| **0 · Acil (A1–A4)** | ✅ **bitti** — dropdown tıklama kayması · banner'da şeffaf header + solid Planım · iki banner aramasının kaldırılması · antrenör dizini referans kurguda |
| **1 · Bağımsızlaştırma (§1)** | ✅ **bitti** — DadaMentor tamamen kalktı · 35 sayfada görünen DadaMutfak metni 0 · ekosistem adresleri tek `ECO_BASE` · çift `#toTop` id hatası kapandı |
| **2 · Legacy göçü (§1, §23)** | 🔄 **9/12** — kalan 3 sayfa yukarıda |
| **3 · Menü + Footer (§2, §3, §16)** | ⏸ **Faz 5'i BEKLİYOR** — aşağıdaki uyarı |
| **4 · Planım + Hesabım (§4, §5)** | ✅ **bitti** — ray altı sekmeye indi, Hesabım §5'in 14 modülüyle ayrıldı |
| **5 · 10 yeni sayfa (§24)** | ⏸ **başlamadı** — iskelet + brief hazır |
| **6 · Ana sayfa/yönlendirme (§6, §11, §12)** | 🔄 kısmi — tek içerik sayısı (140+ hareket) · demo listeler `.demo-tag` ile işaretli |
| **7 · Enerji dili/Pro/entegrasyon** | ⏸ kısmi (Pro üç kademe `pro-v1`'de var) |
| **8 · Dil (§17)** | ⏸ başlamadı |
| **9 · Performans/SEO/Erişilebilirlik** | 🔄 kısmi — §20 odak tuzağı eklendi (kusuru var) |
| **10 · Test/teslimat** | 🔄 beş süit kurulu |

### ⚠ Faz 3, Faz 5'ten ÖNCE yapılamaz

Belge §2 ana menüye **Fit Testleri** ve **Video Seansları**, §16 footer'a **Destek
Merkezi · Çerez Politikası · Üyelik ve İptal Koşulları · Veri ve İzin Politikası ·
Sponsorlar ve Partnerler** koyuyor. Bu hedeflerin bir kısmı henüz **üretilmedi**.

Kabuk menüsü ve footer **47 sayfanın tamamında** basılıyor. Var olmayan bir sayfaya
bağlamak **tek hamlede site geneli kırık link** üretir ve nihai kabul kriteri
"yerel bağlantılarda kırık hedef bulunmamalı" diyor. Bu yüzden önce Faz 5, sonra Faz 3.

### Faz 5 — 10 yeni sayfa

`fit-testleri-v1` · `fit-testi-detay-v1` · `fit-testi-sonuc-v1` · `aktivite-gunlugu-v1` ·
`bagli-uygulamalar-v1` · `video-seanslari-v1` · `video-seans-detay-v1` ·
`uyelik-faturalandirma-v1` · `destek-talepleri-v1` · `destek-talebi-detay-v1`

Hazır: `tools/FAZ5-SKELETON.html` (kopyalanacak iskelet) + `tools/FAZ5-BRIEF.md`
(ajan brief'i: tasarım dili, §13 enerji dili yasak listesi, §8/§9 sağlık sınırı,
§21 eklenmeyecek modüller, §22 demo etiketi). Sayfa başına bir ajan, en fazla 6 paralel.
Bitince `index.html` prototip haritası da güncellenecek.

---

## 4 · AÇIK KUSURLAR

### 4.1 · `tests/a11y-focus.mjs` kararsız (öncelik: YÜKSEK)

**Belirti:** görüş bildir modalı açıldığında odağı içine almıyor — **6 koşuda 3 başarısız.**

**Ölçüm:** başarısız koşularda `focusin` olayı yalnız `fbTab` için ateşleniyor,
`fbClose` **hiç** odak almıyor. Yani `trapFocus` içindeki `focusIn()` sessizce boşa düşüyor.

```
kosu 1: [fbTab]            son=fbTab      ✗
kosu 2: [fbTab]            son=fbTab      ✗
kosu 3: [fbTab > fbClose]  son=fbClose    ✓
kosu 4: [fbTab]            son=fbTab      ✗
kosu 5: [fbTab > fbClose]  son=fbClose    ✓
kosu 6: [fbTab > fbClose]  son=fbClose    ✓
```

**Kök neden:** modal `visibility:hidden`'dan CSS geçişiyle açılıyor.
`requestAnimationFrame` tick'inde öğe hâlâ görünmez olduğu için `.focus()` **no-op**
oluyor; mevcut tek ek rAF denemesi yetmiyor.

**Çözüm (yapılmadı):** `assets/js/fit-shell.js` → `trapFocus` (satır 846).
rAF yerine gerçek görünürlüğü bekle: `transitionend` dinle **ya da** birkaç frame
boyunca `offsetWidth>0` olana kadar yokla (üst sınırla, ör. 20 frame).
Bu oturumda kabuk dosyalarına dokunmama talimatı olduğu için bilinçli devredildi.

### 4.2 · Dalga 1'in görsel doğrulaması yapılmadı

`sss · iletisim · yasal · bildirimler · hakkimizda` **`page-check`'ten geçti**, ama
göç öncesi hâliyle **computed-style / boundingBox kıyası yapılmadı** (doğrulama ajanı
bitiremeden kapandı). Sayfa CSS'inin bir kısmı bilinçli ölü kod temizliği mi yoksa
kayıp mı, bu yolla anlaşılır.

**Baseline sunucu tarifi:**

```bash
mkdir -p /tmp/baseline
cd ~/Developer/Projects/dadafit-prototip
for f in sss-v1 iletisim-v1 yasal-v1 bildirimler-v1 hakkimizda-v1 \
         pro-v1 giris-v1 hesabim-v1 reklam-ver-v1 \
         pro-odeme-v1 rozetler-v1 profil-v1; do
  git show 981df3b:$f.html > /tmp/baseline/$f.html
done
ln -s ~/Developer/Projects/dadafit-prototip/assets /tmp/baseline/assets
(cd /tmp/baseline && python3 -m http.server 8812 &)
```

8811 (şimdiki) ile 8812 (göç öncesi) aynı viewport'ta açılıp `main#pageMain` içindeki
kolon sayısı, yazı boyutu, taşma ve çakışma karşılaştırılır. Kabuk farkları
(turuncu→yeşil, farklı header/footer) **yok sayılır**.

---

## 5 · Ölçüm tarifi

### Kurulum

```bash
export PW_HOME=/private/tmp/claude-501/-Users-gaviaworks-Developer-Projects-dadafit-prototip/8e804619-336a-4048-8bf6-c70cbb02bc7c/scratchpad/pw
# yoksa: mkdir -p ~/.pw && cd ~/.pw && npm init -y && npm i playwright-core
#        npx playwright install chromium && export PW_HOME=~/.pw
cd ~/Developer/Projects/dadafit-prototip && python3 -m http.server 8811 &
```

### Sayfa başına kalite kapısı

```bash
node tools/page-check.mjs <sayfa>.html 360
node tools/page-check.mjs <sayfa>.html 768
node tools/page-check.mjs <sayfa>.html 1024
node tools/page-check.mjs <sayfa>.html 1440
```

Ölçtüğü: kabuk mount'u (nav/footer/drawer/alt bar) · konsol ve JS hatası ·
4xx alt kaynak · yatay taşma · içeriğin sabit header altında kalmaması ·
kırık iç bağlantı · DadaMutfak metni · turuncu `#E14827` kalıntısı.
**Sorun varsa çıkış kodu 1.** Dördü de temiz değilse iş bitmemiştir.

### Beş süit (kabuk değişince hepsi koşacak)

```bash
node tests/dropdown-position.mjs   # hover ≡ tıklama panel konumu · scrollWidth · header sabitliği
node tests/header-banner.mjs       # banner'da şeffaf→katı header · Planım solid · üst üste binme
node tests/coach-list.mjs          # dizin kurgusu · filtre motoru · çekmece · rozet çakışması
node tests/plan-account.mjs        # Planım altı sekme · ray dışı sayfalar yetim değil · Hesabım §5
node tests/a11y-focus.mjs          # modal odak tuzağı — ŞU AN KARARSIZ, bkz. §4.1
```

Son durum: ilk dördü **0 sorun**, beşincisi kararsız.

### ⚠ Çapa ölçerken TEMİZ context şart

Aynı URL'nin iki hash'i arasında gezinmek **same-document navigasyon**dur — sayfa
yeniden yüklenmez ve **önceki çapanın yumuşak kaydırma animasyonu ölçüme karışır**.
Bu yüzden bu oturumda `#reklam` yanlışlıkla "header altında kaldı" (top −7643) çıktı;
her çapa için temiz context açılınca 20/20 ölçüm geçti.

**Her çapa için yeni `browser.newContext()` aç, `goto(...#capa)` yap, ~1.4s bekle.**

### Ölçümün kendisine güvenmeden önce

**Kural sayısı / seçici farkı defekt göstergesi DEĞİL** (commit `2b92a45`).
Bir sayfa kuralının yokluğu stilin yokluğu demek değildir — kabuk aynı işi başka
seçiciyle yapıyor olabilir. Ölçülen örnek: `.nt-filter .chip.active` "eksik" görünüyordu
ama çip doğru render ediliyordu (kabuğun `.chip.active` kuralı karşılıyor).
Doğru ölçüm: **computed style / boundingBox** karşılaştırması.

---

## 6 · Çalışma kuralları

1. **Kabuk dosyalarına yalnız ana oturum yazar.**
   `assets/js/fit-shell.js` · `assets/css/fit-shell.css` · `assets/css/fit-type.css` ·
   `REVIZE-PLAN-2.md` · `tools/*` · `tests/*`.
   Alt ajan bir HTML dosyasına yazar, **iki ajan aynı dosyaya atanmaz**. Kabukta kural
   gerekirse ajan raporunda bildirir, ana oturum merkezî olarak uygular.
2. **Ölçmeden "düzeldi" denmez.** Her iddianın altında ölçülen sayı olur
   (boundingBox / scrollWidth / kontrast / HTTP durumu / çıkış kodu).
   Ölçülemeyen şey **"doğrulanmadı"** diye raporlanır, "muhtemelen çalışıyor" diye değil.
3. **Bir test, kırmızıya döndüğü görülmeden yeşil sayılmaz.** Yeni test önce
   hatalı kodda çalıştırılıp hatayı yakaladığı görülür.
4. **Push her seferinde ayrı izin ister.** Commit serbest, push değil.
5. **Ortak bileşen sayfa sayfa kopyalanmaz** — merkezî CSS/JS'ten yönetilir.
6. **Mevcut tasarım dili korunur:** DadaFit yeşili, Gilroy tipografi, kart dili,
   radius, grid, mobil yaklaşım. Sıfırdan yeniden tasarım yok.
7. Alt ajan **commit atmaz**; `git add`/`commit`/`checkout`/`restore` çalıştırmaz.

---

## 7 · Bu turun 20 commit'i

| # | Hash | Özet |
|---|---|---|
| 1 | `8fd3fa2` | fix: dropdown tıklamada sağa kayıyordu — `:focus-within{transform:none}` ortalamayı siliyordu (Δx 280px ölçüldü) |
| 2 | `6710d27` | feat: banner'lı sayfalarda şeffaf header + Planım solid primary |
| 3 | `a3dbaff` | feat: antrenör dizini referans kurguya geçti, DadaMentor tamamen kaldırıldı |
| 4 | `3f18be9` | tools: legacy göç aracı + sayfa başına kalite kapısı (Faz 2 fan-out için) |
| 5 | `ff3f84a` | fix: göç aracında iki kusur — yorumlu `@media` silinmesi ve `</main>` sınır sapması |
| 6 | `945c7a7` | feat: Planım altı sekmeye indi, Hesabım ayrıldı, kabuk marka dili temizlendi |
| 7 | `2cb79e6` | feat: 35 sayfa markadan arındırıldı, ekosistem adresleri tek noktaya alındı |
| 8 | `5ce1aa7` | docs: Faz 1 marka ve Faz 4 maddeleri planda işaretlendi |
| 9 | `0708a25` | tools: Faz 5 iskeleti ve brief'i (10 sayfa tek tasarım dili) |
| 10 | `ea915cf` | fix: at-rule düzeltmesi tamamlandı, seçici listeleri parça başına eşleşiyor |
| 11 | `586ed83` | feat: site geneli tek içerik sayısı, demo listeler `.demo-tag` ile işaretli |
| 12 | `a852ac2` | feat: Faz 2 dalga 1 — beş legacy sayfa kabuğa geçti |
| 13 | `2b92a45` | fix: kabuk seçici listeleri parça başına kaydediliyor; kural sayısına güvenilmeyecek |
| 14 | `2322992` | feat: kabuk modal katmanlarında odak tuzağı ve odak geri dönüşü (§20) |
| 15 | `3cf2cc1` | docs: oturum devri — durum, uyarılar, nereden devam edileceği |
| 16 | `7c6876a` | feat: Faz 2 — `pro` ve `giris` kabuğa geçti |
| 17 | `14bcfff` | docs: devir güncellendi — pro/giris indi, iki dosya commit'siz kaldı |
| 18 | `931a3d5` | feat: Faz 2 — `hesabim` kabuğa geçti (8 çapa 16/16 ölçüldü) |
| 19 | `61d9368` | feat: Faz 2 — `reklam-ver` kabuğa geçti (`#isbirligi` + `#reklam`) |
| 20 | `65315f4` | docs: devir — Faz 2 9/12, kararsız odak testi ve gereken düzeltme |

Taban: `981df3b`. **Hiçbiri push edilmedi.**

---

## 8 · Yeni oturum için ilk adımlar

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -5 && git status --short
cat REVIZE-PLAN-2.md          # madde madde durum ve kalan iş
python3 -m http.server 8811 &
export PW_HOME=…              # §5'teki yol
node tests/plan-account.mjs   # kabuk sağlam mı, hızlı kontrol
```

Bir şeyi değiştirmeden önce sor: **bu kabukta mı, sayfada mı?**
Header/nav/drawer/footer/filtre/kart kabuğu → `fit-shell.js` + `fit-shell.css`, tek yerden.
Sayfa sayfa kopyala-yapıştır bu repoda bilinçli olarak reddedilmiş bir desendir.

**Sıradaki en mantıklı iş:** Faz 2'nin kalan 3 sayfası (`pro-odeme` · `rozetler` ·
`profil`) — Faz 5 ve Faz 3'ün önünü açar ve `tools/FAZ2-BRIEF.md` ile hazır tarifi var.
