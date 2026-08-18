# REVİZE PLAN 3 — DadaFit prototip, üçüncü revizyon turu

Kaynak: Beyar'ın 18.08.2026 tarihli madde madde talimatı.
Bu dosya **sıralı** işlenir; bir faz bitmeden sonrakine geçilmez.
Her fazın sonunda bağımsız bir doğrulama ajanı ölçümleri tekrarlar ve
sonuç bu dosyadaki **Doğrulama tablosu**na yazılır.

## Kalıcı kurallar (açılış mesajından, her maddede geçerli)

1. Ortak bileşen sayfa sayfa kopyalanmaz — `assets/css/fit-shell.css` +
   `assets/js/fit-shell.js` tek kaynaktır.
2. Ölçmeden "düzeldi" denmez. Her iddianın altında ölçülen sayı olur
   (boundingBox / scrollWidth / kontrast / HTTP durumu / çıkış kodu).
   Ölçülemeyen şey **"doğrulanmadı"** diye raporlanır.
3. Bir test, kırmızıya döndüğü görülmeden yeşil sayılmaz.
4. Push ayrı izin ister; commit serbest.
5. Mevcut tasarım dili korunur (DadaFit yeşili, Gilroy, kart dili, radius, grid).
6. Alt ajan commit atmaz.
7. Font Awesome **PRO** ikonu kullanılmaz (yalnız Free set).

## Kapsam kilidi

Bu turda dokunulacak sayfalar:
`antrenorler-v1.html` · `antrenor-detay-v1.html` · `egzersiz-kutuphane-v1.html` ·
`programlar-merkezi-v1.html` · `video-seans-detay-v1.html` ·
`challenge-merkezi-v1.html` · `challenge-v1.html` (challenge detayı) ·
`enerji-defteri-v1.html` · ortak kabuk (`fit-shell.css` / `fit-shell.js`).

Faz C ve Faz D'de tespit edilen **ek sayfa listeleri** dışında hiçbir dosyaya
dokunulmaz. Tespit listeleri aşağıda ilgili maddede yazılıdır.

## Ölçüm ortamı

```
python3 -m http.server 8811        # repo kökünde
export PW_HOME=~/.pw               # playwright-core 1.62.1
node tools/page-check.mjs <sayfa>.html <genislik>
```

---

# FAZ A — ANTRENÖR KARTLARI (`antrenorler-v1.html`)

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| A1 | Kart bileşeni tek iskelete oturdu: `.coach-body` `flex column` + `gap:12px`, üç şerit sabit yükseklikte (etiket 30px · meta 20px · alt bant `margin-top:auto`) | **1440:** aynı satırdaki 3 kartın `offsetHeight` = {435} tek değer · **390:** {462} | ✅ |
| A2 | `.coach-media` sabit 268px + `.coach-id b/span` tek satıra kilitli (`nowrap` + ellipsis) | isim `boundingBox.top` sapması **0 px** (1440 ve 390) | ✅ |
| A3 | `[data-tagrow]` ortak yardımcısı kabuğa eklendi: sığmayan etiket `display:none`, sona `+N` | `scrollHeight`=`clientHeight`=**30px** (öncesi 67px, 2 satır) · `scrollWidth`=`clientWidth`=237 · gizlenen/N eşleşmesi **4 kartta** (2/2 · 2/2 · 1/1 · 1/1) · rozet `SPAN` + `aria-hidden` + `pointer-events:none`, tabindex yok | ✅ |
| A4 | `.coach-meta` `nowrap` + sabit 20px yükseklik, ikon `line-height:20px` | meta `boundingBox.top` sapması **36.81 px → 0 px** · ikon–metin dikey merkez farkı **0 px** (6 kartın hepsinde) | ✅ |
| A5 | Fiyat ve `.go` bağlantısı kalktı, yerine tam genişlik `.coach-cta` | `₺` ve `\bTL\b` **6 → 0** · düğme 237.33 px ≈ kart iç genişliği 237 px · kontrast **3.54 → 5.45** (`--fit` yerine `--fit-deep`) | ✅ |
| A6 | Düz `<p class="dz-vnote">` → ortak `.fit-note` bilgi şeridi (ikon çipi + kalın başlık + tek satır) | kontrast **7.08** · 1440'ta **1 satır** (147→132 karakter) · 390'da `scrollWidth`=`clientWidth`=356, sayfa taşması yok · ekran görüntüsü: `shots/A-after-1440.png`, `A-after-note.png`, `A-after-390.png` | ✅ |

---

# FAZ B — ANTRENÖR DETAY SEKMELERİ (`antrenor-detay-v1.html`)

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| B1 | **DadaGastro referansı DOĞRULANDI** (varsayım değil): `ECO_BASE`'ten dört sayfa indirildi — `anasayfa-portal-v3a` (HTTP 200) · `kesfet-v1` · `saglik-hub-v1` · `akademi-v1`. Üç sekme kullanımının ortak iskeleti çıkarıldı, `.fit-tabs`/`.fit-tab`/`.fit-pane` olarak kabuğa taşındı ve `antrenor-detay-v1`'e uygulandı (KARARLAR.md **K13**) | içerik kapsayıcısı `boundingBox.top` sapması **0 px** (1440 ve 390; eski motorun `window.scrollTo` zıplaması kaldırıldı) · sekme yüksekliği tek değer **37px / 35px** · aktif dolu hap etiketi kapsıyor (113.5≥77.5 · 232.5≥196.5 · 208.2≥172.2) · ok/Home/End + roving tabindex `0/-1/-1` çalışıyor · `role=tablist/tab/tabpanel` + `aria-selected` + `aria-controls` doğru · konsol hatası 0 · ekran görüntüleri `shots/B-hakkinda-*.png`, `B-programlar-*.png`, `B-yorumlar-*.png` | ✅ |

---

# FAZ C — FİLTRE BİLEŞENİ

### C0 · Tespit — filtre çubuğunun kullanıldığı sayfalar

Ölçüm: `grep -l "data-ff" *.html` → ortak `.ff` bileşenine bağlanan **7 sayfa**.
Eksen sayısı `grep -c 'class="fgroup" data-group='` ile sayıldı:

| # | Sayfa | Eksen (C öncesi) | Eksenler |
|---|---|---|---|
| 1 | `egzersiz-kutuphane-v1.html` | 3 → **4** | kas · ekipman · **süre (C2'de eklendi)** · seviye |
| 2 | `programlar-merkezi-v1.html` | 5 | tur · hedef · seviye · ekipman · erisim |
| 3 | `program-liste-v1.html` | 4 | hedef · sure · seviye · ekipman |
| 4 | `challenge-merkezi-v1.html` | 3 | durum · kategori · sure |
| 5 | `hareket-merkezi-v1.html` | 3 | sure · hedef · ekipman |
| 6 | `fit-testleri-v1.html` | 3 | odak · sure · ekipman |
| 7 | `aktivite-gunlugu-v1.html` | 2 | tur · kaynak |

**DÜZELTME:** ilk taramada `data-group=` geçen her satır sayılmıştı ve eksen
sayıları yanlış çıkmıştı (egzersiz kütüphanesi 5 sanılmıştı, gerçek 3). Yukarıdaki
tablo `class="fgroup" data-group=` ile yeniden sayıldı.

**KAPSAM NOTU:** `antrenorler-v1.html` bu listede **YOK** — kendi sol kolon filtre
paneli var (`#libFilters` + `.fct` akordeonları), `.ff` bileşenine bağlı değil.
Dokunulmadı.

**C5 ek sayfa listesi (yeniden adlandırma):** ibare değişikliği 21 dosyada
kullanıcıya görünen metni etkiledi —
`egzersiz-kutuphane-v1` · `assets/js/fit-shell.js` (nav) · `index` ·
`dadafit-hub-v1` · `egzersiz-detay-v1` · `hareket-merkezi-v1` ·
`hareket-bolgeye-gore-v1` · `hareket-dogru-form-v1` · `hareket-isinma-soguma-v1` ·
`hareket-masa-basi-v1` · `hareket-sozluk-v1` · `hakkimizda-v1` · `pro-v1` ·
`programlar-merkezi-v1` · `reklam-ver-v1` · `sss-v1` · `uyelik-faturalandirma-v1` ·
`video-seanslari-v1` · `yasal-v1` · `destek-talebi-detay-v1` · `hesabim-v1`.

**Bu listelerin dışına çıkılmaz.**

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| C1 | Ortak `.ff` bileşeni yükseltildi (kabukta tek kaynak, 7 sayfada aynısı): tek durum nesnesi DOM çip durumundan okunur → `history.replaceState` ile URL'ye yazılır, `load`'da URL'den **farkı tıklayarak** geri yüklenir (idempotent, sayfa motorunun kendi derin bağlantısıyla çakışmaz); panel iki eksende viewport'a kelepçelendi (`.flip` sağ kenar · `.up` + dinamik `max-height` alt kenar; sticky çubuk için `scroll`/`resize`'da yeniden yerleştirme); Esc kapatır ve odağı düğmeye döndürür; Tab ile çıkışta panel kapanır; ok/Home/End gezinmesi; `.fgroup` → `role=listbox aria-multiselectable`, çipler → `role=option` + `aria-selected` (çakışan `aria-pressed` kaldırıldı) | **1440 · 7 sayfanın 24 ekseninin hepsi:** panel sağ kenar ≤ `innerWidth` ✓ · alt kenar ≤ `innerHeight` ✓ · `z-index:60` ve `elementFromPoint` panelin içini döndürüyor (kartların üstünde) ✓ · `role=listbox` ✓ · konsol hatası 0 · **URL turu 7/7 sayfada `restoreOk=true`** (3 eksende seçim → URL oku → o URL ile yeniden aç → DOM karşılaştır) · **390:** çekmece 7/7 sayfada tam görünür (0,118)-(390,844), açılan panel viewport içinde, `documentElement.scrollWidth`=390 (yatay taşma yok) · ekran görüntüleri `shots/C-<sayfa>-1440.png` ve `-390.png` | ✅ |
| C2 | **BEKLENMEDİK BULGU — doğrulandı.** `egzersiz-kutuphane-v1` içinde `sure` ekseni **YOKTU** ve `DEEPLINK_MAP` yalnız `bolge` + `ekipman` okuyordu; buna karşılık `hareket-merkezi-v1`'den **8 bağlantı** `?sure=5/10/15/20/30` ile bu sayfaya geliyordu → sekizi de sessizce filtresiz açılıyordu. Süre ekseni (5·10·15·20·30 dk) eklendi, kartlara çok değerli `data-sure` verildi, motor token tabanlı eşleşmeye çevrildi | `?sure=5` → **5 kart** (sayaç 5, açık çip `sure:5`) · `?sure=30` → **10 kart** · parametresiz → **12 kart** · eski `?bolge=ust-vucut` → **6 kart** (kırılmadı) | ✅ |
| C3 | Seçenek sayısı **8'i geçen** eksende panel üstüne yapışkan arama alanı; `input` ile süzme, eşleşme yoksa `role=status` boş durum, panel açılınca odak arama alanına (görünürlük kare yoklamasıyla — `visibility:hidden` öğede `.focus()` no-op'tur, K1'deki tuzak), ArrowDown ile listeye geçiş | eşiği geçen 2 eksen: **Kas Grubu (10)** ve **Ekipman (15)** · panel açılınca `document.activeElement` = arama input'u ✓ · "dam" yazınca Ekipman **15 → 1**, Kas Grubu **10 → 0** ✓ · eşleşmeyen metinde (`zzzqqq`) boş durum görünür ✓ · ArrowDown → ilk seçenek ("Dambıl") odaklanıyor ✓ · "ba" ekran görüntüsü: `shots/C-ekipman-arama.png` (Direnç bandı · Askı bandı · Barfiks barı) | ✅ |
| C4 | Kas grubu **6 → 10** değere, ekipman **4 → 15** değere çıktı; 12 kartın `data-kas`/`data-ekipman` değerleri yeni sözlüğe eşlendi (`vucut`→`ekipmansiz`, `bant`→`direncbandi`, `kol`→`biceps`, Glute Bridge→`kalca`, KB Swing→`tumvucut`). Kartın **sol üst rozeti (`.ex-cat`) tasarımı hiç değişmedi** — yalnız metni yeni sözlükten geliyor | **Sayaçlar — sayfada yazan / gerçek veriden sayılan:** hareket **140+ / 12** · kas grubu **6 / 8** · seviye **3 / 3**. Sayfa üstü istatistik gerçek veriye çekildi: **12 · 8 · 3**. (Kabuk üst bandındaki site geneli "140+ hareket" iddiası DOKUNULMADI — bkz. Beyar'a soru S2.) | ✅ |
| C5 | İbare "DadaFit Egzersizleri" oldu: `<title>` · `h1` · ekmek kırıntısı · kabuk nav kalemi · 21 dosyadaki bağlantı ve düz metin geçişleri. Hero kurgusu `antrenorler-v1` ile aynı kalıba geçti (eyebrow = eylem "Hareket Bul", h1 = sayfa adı). **DOSYA ADI DEĞİŞMEDİ** | `egzersiz-kutuphane-v1.html` diskte aynı ✓ · kullanıcıya görünen metinde eski ibare kalmadı (kalan tüm geçişler HTML/JS **yorumu** ya da "Seans Kütüphanesi" gibi başka bir ürünün adı) ✓ · 13 sayfada `page-check` → **kırık iç bağlantı 0** (145–186 bağlantı/sayfa tarandı) ✓ | ✅ |

**C4 kas grubu ekseni (10):** Göğüs · Sırt · Omuz · Biceps · Triceps · Ön kol ·
Karın ve gövde merkezi · Bacak · Kalça · Tüm vücut

**C4 ekipman ekseni (15):** Ekipmansız · Dambıl · Halter · Kettlebell ·
Direnç bandı · Kablo · Sabit makine · Askı bandı · Sağlık topu · Pilates topu ·
Step · Bench · Barfiks barı · Atlama ipi · Foam roller

---

# FAZ D — GLOBAL TEMİZLİK

### D0 · Tespit — `demo-tag` / "Örnek görünüm" geçen dosyalar

`grep -rln "demo-tag"` → **26 dosya** (24 HTML + `fit-shell.css` + `fit-type.css`
+ `fit-shell.js`; ayrıca `tools/FAZ5-SKELETON.html`). Tam liste D1 uygulanırken
tarama çıktısıyla birlikte aşağıya yazılır.

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| D1 | 48 `.demo-tag` rozeti + 4 `.fc-step` "Demo veri" çipi + 18 CSS kuralı + kabuk JS üreticisi (`.demo-tag.fp-demo`) ve `.fp-demo` senkronu silindi. `yasal-v1`'in "DEMO METİN — PROTOTİP" hapı `.fit-note` şeridine dönüştürüldü (§22 açıklaması kaybolmasın). 12 açıklama şeridinden "Demo veri —" ön eki düştü, cümleler kaldı (KARARLAR **K14**) | **Kaynak taraması (harf duyarsız, 3+ varyant):** `demo-tag` **93 → 1** (tek kalan: kaldırmayı anlatan yorum) · `Demo veri` **52 → 0** · `Örnek görünüm` **2 → 0** · `örnek görünüm` **5 → 4** (dördü de yorum) · `demo veri` **7 → 6** (altısı da yorum) · `Örnek metrik` **0** · `fp-demo` **1** (yorum) — **kullanıcıya görünen metinde 0** · **DOM taraması: 57 sayfa açıldı, `.demo-tag,.fp-demo` düğüm sayısı 0, `innerText`'te dört ifadenin hiçbiri eşleşmedi** ✅ · İstisna şeridi (`.fp-gate` "veriler **örnektir**") yerinde ✅ | ✅ |
| D2 | Kabukta yedi token: `--fit-header-h` · `--hero-pt` · `--hero-pb` · `--hero-gap` · `--hero-min` · `--hero-full` · `--sec-pad`. Over-mode padding'leri **12 sabit sayıdan** (152·142·133·131·147·153·125·129·139·73·83·93) **tek `calc()`e** indi. `.sec{padding:74px}` da token'a bağlandı, 6 sayfadaki kopyası dahil | **53 sayfa, 1440 ve 390:** hero yüksekliği ortalama **−58.0 px** / **−43.3 px** · `dadafit-hub` 900→666 · `dadafit-kopru` 666→614 · `aktivite-gunlugu` 523→458 · İlk içerik kartı < 900 px: **56 sayfanın 46'sı** (4'ünde kart yok, 6'sında araya tam bölüm giriyor — 2'si Faz E'de düzeldi) · 18 sayfada `page-check`: header örtüşmesi ve yatay taşma **yok** · **SONRADAN GERİ ALINDI:** ana sayfa perdesi 74dvh→**100dvh** (Beyar "ana sayfa herosunu bozmuşsun, düzelt" dedi; `.df-top` yeniden **900 px** — KARARLAR **K15**). D2'nin geri kalanı yürürlükte | ✅ |
| D3 *(sonradan eklendi — Beyar)* | Liste ve detay banner'ları **kendi içlerinde** sabit yüksekliğe çekildi. Aile işareti kabukta dosya adından türüyor (`body[data-fit-hero-kind]`). `.lib-sub` iki satıra kilitlendi; banner içi arama formu üç sayfadan kaldırıldı | **@1440:** liste ailesi **47 sayfanın 47'si 344 px** (yayılım **199 → 0 px**) · detay ailesi **4 sayfanın 4'ü 384 px** (yayılım **92 → 0 px**) · **taşan/kırpılan içerik 0** · ≤900 px'te `min-height` (dar ekranda içerik 1.3–1.7 kat uzun sarıyor; sabitlemek metin kırpmak olurdu) · `justify-content:safe center` şart oldu — düz `center` taşmayı iki yana dağıtıp içeriği şeffaf header'ın altına kaydırıyordu, **4 sayfada ölçüldü ve kalite kapısı yakaladı** | ✅ |

---

# FAZ E — PROGRAMLAR MERKEZİ VE VİDEO SEANSLARI

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| E1 | Erişim/paket (Ücretsiz–PRO) bölümü tamamen kaldırıldı. Bölümün İÇİNDEKİ sağlık notu (`.hr-note`) kaybolmadı, kendi bölümüne taşındı. Ayrıca **"Erişim" filtre ekseni** de kaldırıldı (Ücretsiz/Pro çipleri) ve ölü CSS (`.pm-tier*`, `.pm-tiers`) silindi | `#pro` bölümü DOM'da **yok** ✅ · sayfaya giden tek iç çapa (`program-liste-v1` → `programlar-merkezi-v1.html#pro`) **kırılmadan** `pro-v1.html`'e yönlendirildi ✅ · `page-check` 1440/390 → **kırık iç bağlantı 0** (154 bağlantı) ✅ · Ücretsiz/Pro **filtre ekseni** kalktı; kart üstündeki PRO rozeti ve kart altındaki erişim etiketi **korundu** — bkz. Beyar'a soru **S1** | ✅ |
| E2 | "Kaldığın yerden devam / ilerleme" bölümü kaldırıldı; içindeki ziyaretçi şeridi ve ölü CSS (`.pm-cont`, `.pm-bar`, `.pm-meta`) silindi | bölüm DOM'da **yok** ✅ · konsol hatası 0 ✅ · kırık bağlantı 0 ✅ | ✅ |
| E3 | Sihirbaz **modal olmaktan çıktı**. Kabuğa satır içi kip eklendi: sayfa `<div data-fit-wizard-host>` bildirirse panel oraya basılır — örtü katmanı üretilmez, scroll kilitlenmez, Esc bağlanmaz. Banner'a aç/kapa düğmesi kondu | **açılıştan 3.2 sn sonra** `.wz-modal` DOM'da **yok**, `.wz-overlay` **yok** ✅ · düğmeye basınca: `role="region"` (aria-modal yok), host içinde, `boundingBox` viewport içinde — 1440'ta `top 112 / bottom 460`, 390'da `top 62 / bottom 667` ✅ · `aria-expanded` true↔false ✅ · **Esc kapatmıyor** (gereksiz davranış kaldırıldı) ✅ · konsol hatası 0 | ✅ |
| E4 | Video seansları kendi başlıklı bölümüne çıktı (`#video-seanslari`), 4 kartlık ızgara, hepsi `video-seans-detay-v1.html`'e bağlı. `.vs-card` ailesi ortak kabuğa taşındı (artık iki sayfada kullanılıyor) | **ÖNCE:** sayfada video bölümü **YOKTU** — tek giriş kapısı ana menü panelinin **5. (son)** kalemiydi (ölçüm: `grep -i video programlar-merkezi-v1.html` → 0 eşleşme) · **SONRA:** `boundingBox.top` = **486 px** @1440 · **520 px** @390; program ızgarası (`#tumu`) **1146 px**'te — yani video bölümü onun **üstünde** ✅ · 4 kartın 4'ü de detay sayfasına gidiyor ✅ · 390'da ızgara tek kolona iniyor, `documentElement.scrollWidth` = 390 (taşma yok) ✅ | ✅ |
| E5 | Ölçüm iki durumu birden gösterdi: bir **tekrar** (başlık ↔ panel 1, aynı hedef) ve bir **gerçek ayrım** (panel 2, farklı hedef). Tekrar silindi, ayrım korunup etiketi netleşti. E3'te üretilmek üzere olan üçüncü çakışma da yakalanıp engellendi (KARARLAR **K16**) | **SONRA (tarayıcıda kabuk bağlantıları):** `programlar-merkezi-v1.html` → **4 kalem, hepsi "Programlar"**; `program-liste-v1.html` → **2 kalem, hepsi "Tüm Programlar"** ✅ · site genelinde "Tüm Programlar" yazan **9 bağlantının 9'u** `program-liste-v1.html`'e gidiyor ✅ | ✅ |
| E6 | FIT testi detay arayüzü **üç iterasyonda** geliştirildi — ayrıntı aşağıda | it0→it3 ölçüm tablosu ve ekran görüntüleri aşağıda | ✅ |

### E6 · Üç iterasyon — kendi değerlendirmem ve ölçümler

Sayfa: `fit-testi-detay-v1.html?test=sinav`. Her iterasyonda önce ekran görüntüsü
alındı, sonra **kendi çıktımı** okunabilirlik · hiyerarşi · boşluk ritmi · mobil
davranış açısından yazdım, sonra **tek bir zayıf noktayı** düzelttim.

**it0 — başlangıç** (`shots/E6-it0-1440.png` · `E6-it0-b.png` · `E6-it0-390.png`)

*Değerlendirmem:* **Hiyerarşi zayıf** — sol kolon altı bölümün hepsi aynı ağırlıkta,
aynı ikon çipiyle diziliyor; sayfa "düz liste" gibi okunuyor ve *"bu testi yapmak
için ne yapmam gerek"* sorusunun cevabı hiçbir yerde yok. Asıl eylem (uygunluk
taraması) 700 px kaydırmadan görünmüyor. **Okunabilirlik:** akan metin iki yana
yaslı ve satır çok uzun; 390 px'te "Testin hedeflediği kişi ve şimdilik ertelemesi
gerekenler" satırında kelime araları görünür biçimde açılıyor. **Tutarsızlık:**
banner "~10 dk" derken künye "8–10 dakika" diyor. **Boşluk ritmi** kabul edilebilir
ama ekonomisiz — altı bölüm aynı 44 px aralıkla tekrarlıyor.

*Ölçüm:* yaslı paragraf **16/17** · satır ölçüsü **21–119** karakter, 80 üstü **2** ·
süre ifadeleri **{~10 dk, 8–10 dakika}** çelişkili · sayfa boyu **5097 px** (1440) /
**9360 px** (390).

*Düzeltilen zayıf nokta:* hiyerarşi.

**it1 — akış rayı ve iki katman** (`shots/E6-it1-1440.png` · `E6-it1-390.png`)

Sol kolon **"Önce oku"** (bilgi) ve **"Sonra uygula"** (eylem) olarak ikiye ayrıldı;
uygulama blokları **1-2-3 numaralandı** ve sayfanın en başına üç kartlık bir
**akış rayı** kondu (Uygunluk taraması → Adım adım uygulama → Sonucunu gir), her
kartta durum rozetiyle.

*Değerlendirmem:* Hiyerarşi düzeldi — kullanıcı ilk ekranda "üç adım var" bilgisini
alıyor. Ama **üç yeni kusur** görünür oldu: (a) yaslama ve uzun satır sorunu duruyor,
"Bu sayfadaki veriler" kartında (348 px genişlik) kelime araları belirgin biçimde
açılıyor; (b) kilitli 2. adımın rozeti **yeşil** — kilitli olduğu hâlde "açık"
sinyali veriyor, renk semantiği yanlış; (c) süre çelişkisi hâlâ duruyor.

*Ölçüm:* yaslı **16/17** · ölçü **21–119**, 80 üstü **2** · akış rayı `top` **557 px**,
üç kartın yüksekliği tek değer (**116 px**) ✅ · süre çelişkisi sürüyor.

*Düzeltilen zayıf nokta:* okunabilirlik.

**it2 — satır ölçüsü, dar kutu yaslaması, renk semantiği** (`shots/E6-it2-1440.png` · `E6-it2-390.png`)

Kabuğa `--measure:78ch` token'ı eklendi ve akan metne uygulandı; tipografi
katmanındaki dar-kutu istisna listesine sayfanın kutuları eklendi; kilitli adım
griye alındı; banner süresi künyeyle eşitlendi.

*Değerlendirmem:* Okunabilirlik ölçülebilir biçimde düzeldi (satır ölçüsü tavanı
119 → 79). Yaslama tamamen kaldırılmadı — **bilerek**: yaslama Beyar'ın önceki
turda verdiği bir karar (KARARLAR **K12**) ve doğru müdahale onu silmek değil,
"nehir" üreten koşulu (aşırı uzun satır ve dar kutu) ortadan kaldırmak. Kalan
zayıf nokta **mobil davranış**: akış rayını okuyan kullanıcı "1. adım" kartına
bakıyor ama o noktada basacak bir düğme yok; yan kolondaki birincil düğme mobilde
içeriğin sonuna, **5656 px**'e düşüyor.

*Ölçüm:* yaslı **15/17** (yalnız dar kutu kartı düzeldi) · ölçü **21–79**,
80 üstü **2 → 0** ✅ · süre ifadeleri **{8–10 dk, 8–10 dakika}** tutarlı ✅ ·
`.hr-note` paragrafı **1098 px → 688 px** genişlik.

*Düzeltilen zayıf nokta:* mobil davranış.

**it3 — akış noktasında eylem** (`shots/E6-it3-1440.png` · `E6-it3-390.png`)

Akış rayının hemen altına, **yalnız ≤900 px'te görünen** bir eylem satırı eklendi
("Uygunluk taramasıyla başla" + "Diğer testler"). Masaüstünde basılmıyor, çünkü
yan kolon zaten taşıyor.

*Ölçüm:* mobil eylem satırı `top` **1047 px** (yan kolon düğmesi **5656 px**) —
karar noktasındaki mesafe **4609 px kısaldı** ✅ · 1440'ta satır **basılmıyor**
(görünen düğme 0, tekrar yok) ✅ · `page-check` 390 → yatay taşma yok, header
örtüşmesi yok, kırık bağlantı 0, konsol hatası 0 ✅.

**Hangi iterasyon seçildi ve neden:** **it3** — çünkü üç iterasyon **birbirini
iptal etmiyor, üst üste biniyor**: it1 hiyerarşiyi, it2 okunabilirliği, it3 mobil
erişimi düzeltti ve hiçbiri öncekini geri almadı. it3, üçünün toplamıdır.
Geri dönülen tek şey yok; **bilerek yapılmayan** tek şey yaslamanın tamamen
kaldırılması (K12 kararı).

**DÜRÜSTLÜK NOTU:** it2 değerlendirmemde "mobilde testi başlatacak düğme yok"
demiştim; ölçüm bunu **kısmen yanlışladı** — banner'da zaten **234 px**'te bir
"Uygunluk taramasıyla başla" düğmesi vardı. Eksik olan, kullanıcının üç adımı
okuduğu **karar noktasında** bir eylemdi. it3 onu ekledi; iddia buna göre düzeltildi.

**E5 ön ölçüm (kabuk `NAV` dizisinden okundu):**

| Etiket | Nerede | Hedef |
|---|---|---|
| Programlar (menü başlığı) | `NAV[programlar].href` | `programlar-merkezi-v1.html` |
| Programlar Merkezi (panel) | `NAV[programlar].dd[0]` | `programlar-merkezi-v1.html` |
| Tüm Programlar (panel) | `NAV[programlar].dd[1]` | `program-liste-v1.html` |
| Programlar (mobil alt bar) | `BOTTOM[2]` | `programlar-merkezi-v1.html` |
| Programlar (footer) | `FOOTER_COLS[0]` | `programlar-merkezi-v1.html` |

→ Başlık ile panelin ilk kalemi **aynı hedefe** gidiyor (tekrar);
"Tüm Programlar" **farklı hedefe** gidiyor (meşru ayrım, etiketi netleşmeli).

---

# FAZ F — CHALLENGE

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| F1 | Challenge paneli (5 kalem) kaldırıldı, başlık düz bağlantı oldu (KARARLAR **K17**) | **4 sayfada ölçüldü:** panel **yok**, chevron **yok**, hedef `challenge-merkezi-v1.html`, drawer'da tek kalem ✅ · nav başlıklarının `tabIndex` değerleri **hepsi 0** — klavye gezinmesi bozulmadı ✅ | ✅ |
| F2 | Durum bazlı ayrı kalem/adres yapısı kalktı; durum yalnız kart rozeti (`.cm-state`) + merkez sayfasının Durum filtre ekseni | `?durum=aktif` · `?durum=yaklasan` · `?durum=gecmis` → **üçü de HTTP 200**, aynı sayfaya düşüyor ve doğru çipi işaretliyor ✅ · parametresiz açılışta **üç durum aynı ızgarada** (`#cmGrid`): aktif **1** · yaklaşan **1** · tamamlanan **1** ✅ | ✅ |
| F3 | Zaman çizelgesi tek okunur bileşene indi (`.chl-time`): başlangıç · ilerleme rayı · bitiş + toplam/kalan/günlük süre/katılımcı. Ekmek kırıntısındaki "Programlar" ara basamağı kaldırıldı (F1'den sonra yanlıştı) | **3 challenge × 2 genişlik:** `scrollWidth == clientWidth` (taşma **yok**), kutu viewport içinde, katıl düğmesi görünür, geri dönüş bağlantıları **HTTP 200**, konsol hatası **0** ✅ · durum başına doğru okuma: aktif → "Bugün · 18. gün / 12 gün kaldı / bar %60"; yaklaşan → "Henüz başlamadı / 7 gün / %0"; tamamlanan → "Tamamlandı / 0 gün / %100" | ✅ |

**F3 · yorumum (tarif belirsizdi, tek cümle):** *"buradaki timi düzeltebilirsin"* ifadesini
**zaman bilgisi** olarak okudum ve ölçüm bunu doğruladı — hero'da "30 gün / **gün bitime**"
yazıyordu (değer TOPLAM süre, etiket KALAN süre), aşağıdaki şeritte "KALAN 23 gün" vardı ve
**başlangıç–bitiş tarihi hiçbir yerde yoktu**; üçünü tek bileşende topladım.

---

# FAZ G — ENERJİ DEFTERİ

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| G1 | `defter` kalemi üst menüden çıktı; erişim üç kapıya taşındı — Fit Planım sekme rayı · hesap (profil) menüsü · footer. Alt kalemleri sahiplerine gitti (KARARLAR **K18**) | üst nav artık **Hareket · Programlar · Challenge · Antrenörler**, `ustDuzeydeDefterVar=false` ✅ · Planım rayında 7. kalem, hesap menüsünde ve footer'da var ✅ · eski adres **HTTP 200**, ekmek kırıntısı `DadaFit › Fit Planım › Enerji Defteri`, ray aktif ✅ | ✅ |
| G2 | **(a)** Fit Planım rayı B1'in ortak bileşenine geçti (`.pf-tabs/.dt` → `.fit-tabs/.fit-tab`, sayfa geçişi kipi). **(b)** Enerji Defteri **dörde bölündü**: Bugün · Dengele · Su Takibi · Haftalık Özet; aralarında aynı bileşen. Eski çapalar köprüyle karşılanıyor | 4 sayfa **HTTP 200** ✅ · alt sekme şeridi 4 kalem, aktif kalem doğru + `aria-current="page"` ✅ · üst rayda **"Enerji Defteri"** aktif (ilk ölçümde rayda hiçbir kalem aktif değildi → düzeltildi) ✅ · eski çapalar: `#dengele`→`-dengele-`, `#su`→`-su-`, `#haftalik`→`-haftalik-`, `#yediklerim` yerinde ✅ · `page-check` **8/8 temiz** (1440+390), konsol hatası 0, yatay taşma yok ✅ · ekran görüntüleri `shots/G2-*.png` | ✅ |

**G2 · TESPİT (KARARLAR K18):** Beyar'ın saydığı altı ad Enerji Defteri'nin bölümleri
**değil**, Fit Planım rayının kalemleri — ve o altı sayfa **zaten ayrı dosya olarak vardı**.
Tek uzun sayfa olan Enerji Defteri'ydi (911 satır, yedi modül); bölünen o oldu.
Kastedilen bu değilse sayfa adları değiştirilir → **Beyar'a soru S3**.

---

# FAZ H — İÇERİK VE VERİ (HENÜZ BAŞLAMA)

| # | İş | Durum |
|---|---|---|
| H1 | Egzersiz verisindeki eksikler — ekipman bilgisi · hareket terim açıklamaları · gym dışı hareket çeşitliliği (bisiklet, CrossFit, yoga türü) — **ayrı bir turda** ele alınacak. Veri kaynağı henüz belirlenmedi | ⛔ BAŞLANMADI (bilinçli) |

---

# DOĞRULAMA TABLOSU

## Teslim taraması — 60 sayfa, tarayıcıda

| Ölçüm | Beklenen | Ölçülen | Sonuç |
|---|---|---|---|
| Sayfa sayısı | — | **60** (3'ü bu turda üretildi) | — |
| HTTP durumu | hepsi 200 | **60 / 60** | ✅ |
| Taranan iç bağlantı | — | **3.575** | — |
| Kırık bağlantı | 0 | **0** | ✅ |
| Kırık çapa | 0 | **0** | ✅ |
| 4xx alt kaynak | 0 | **0** | ✅ |
| Konsol hatası / JS istisnası | 0 | **0** | ✅ |

**Bu tarama iki gerçek kusur yakaladı, ikisi de düzeltildi:**

1. `uyelik-faturalandirma-v1.html` → `SyntaxError: Unexpected identifier 'Bu'`.
   **Sebep bendim:** D1'de "Demo veri — " ön ekini bir **JS dizesinin içinde**
   değiştirmişim, tırnak kaçmış ve sayfanın script'i tamamen çökmüştü.
   Tek tek `page-check` koşularında görünmüyordu çünkü o sayfa listemde yoktu.
2. `enerji-defteri-v1.html` → `#dengele` çapası. G2'de bölüm başka sayfaya
   taşındı; bir CTA hâlâ eski çapaya bakıyordu. Doğrudan yeni sayfaya bağlandı.

## Faz doğrulama ajanları

Her fazın sonunda bağımsız bir doğrulama ajanı çalıştırıldı: **dogrula-A ·
dogrula-B · dogrula-C · dogrula-D · dogrula-E**. Beşi de kendi ölçüm
script'lerini yazdı ve benim sayılarımı yeniden üretti (ham çıktılar
`scratchpad/verify-*/`). Ajanların **kırmızı bulgu raporları beklemede** —
geldiklerinde bu bölüme işlenecek.

**Ajanların bağımsız olarak doğruladığı ölçümlerden örnekler (Faz A):**
`offsetHeight` tek değer (435 / 462) · isim `boundingBox.top` sapması 0 px ·
etiket rayı `scrollHeight = clientHeight = 30 px` · `+N` rozeti ile gizlenen
etiket sayısı **4 kartta birebir** (2/2 · 2/2 · 1/1 · 1/1) · rozet `SPAN` +
`aria-hidden` + `pointer-events:none`, tabindex yok.

# BEKLENMEDİK BULGULAR

| # | Bulgu | Nerede | Ne yapıldı |
|---|---|---|---|
| B1 | **`?sure=N` için eksen yoktu.** `hareket-merkezi`'nden **8 bağlantı** `?sure=5/10/15/20/30` ile kütüphaneye geliyordu; sayfada süre ekseni ve `sure` derin bağlantı okuması yoktu → sekizi de sessizce **filtresiz** açılıyordu | `egzersiz-kutuphane-v1` | Süre ekseni eklendi, kartlara çok değerli `data-sure` verildi, motor token tabanlı eşleşmeye geçti. `?sure=5` → 5 kart, `?sure=30` → 10 kart (C2) |
| B2 | **İlk eksen sayımım yanlıştı.** `grep -c 'data-group='` filtre dışı satırları da sayıyordu; kütüphane 5 eksen sanılmıştı, gerçek 3 | C0 tespiti | `class="fgroup" data-group=` ile yeniden sayıldı, plandaki tablo düzeltildi |
| B3 | **Tipografi katmanı kendi sözünü tutmuyordu.** `fit-type.css` "yaslama yalnız yeterince geniş kutuda" diyor ve `--jt-min` eşiğini tanımlıyor, ama kural koşulsuz uygulanıyor; dar kutu istisnası **elle sayılan bir sınıf listesi** — listede olmayan her yeni dar kutuda yaslama sessizce geri geliyor | `assets/css/fit-type.css` | Fit testi detayının kutuları listeye eklendi; kalıcı çözüm (eşiğin gerçekten uygulanması) rapor edildi, bu turda yapılmadı |
| B4 | **Marka yeşili düğme metninde AA altı.** `--fit` (#009d4f) üzerinde beyaz metin **3.54:1** — WCAG AA eşiği 4.5:1 | site geneli `.btn-fit` / birincil düğmeler | Bu turda dokunulan yerlerde `--fit-deep` (#007a3d, **5.45:1**) kullanıldı. Site geneli `.btn-fit` **değiştirilmedi** → **Beyar'a soru S4** |
| B5 | **Ana sayfa perdesinde 315 px boş alan.** `min-height:100dvh` ile perde 900 px, içerik yalnız 585 px | `dadafit-hub-v1` | D2'de 74dvh'ye indirilmişti; **Beyar geri istedi**, 100dvh'ye döndü (K15) |
| B6 | **Kendi düzenlemem bir sayfanın JS'ini çökertti.** D1'in metin değişimi `uyelik-faturalandirma-v1` içinde bir JS dizesinde tırnak kaçırdı | `uyelik-faturalandirma-v1` | Teslim taramasında yakalandı ve onarıldı; sayfa artık konsol hatasız |
| B7 | **`.demo-tag` ailesi tek sınıf değildi.** Rozet üç ayrı adla dağılmıştı: `.demo-tag` (48), `.fc-step` "Demo veri" çipi (4), `.lg-demo` "DEMO METİN" hapı (1) | 23 HTML + kabuk | Üçü de kaldırıldı; `.lg-demo` §22 açıklaması olduğu için silinmedi, `.fit-note` şeridine dönüştürüldü (K14) |

# BEYAR'A SORU DÖNEN MADDELER

| # | Madde | Soru |
|---|---|---|
| **S1** | E1 | Erişim **bölümünü** ve **filtre eksenini** kaldırdım. Ama kartların üstündeki altın **PRO rozeti** ve kart altındaki "Başlangıç · Ücretsiz" etiketi **duruyor** — bunlar site geneli bir kural (`sss-v1` de "kart üzerinde altın PRO işaretiyle gösterilir" diyor) ve tek sayfada kaldırmak tutarsızlık üretirdi. E1'in ölçümü "ücretsiz ve pro ibareleri sayfada kalmadı" diyordu. **Kart rozetleri de gitsin mi, yoksa yalnız bölüm mü kalkacaktı?** |
| **S2** | C4 | Kütüphane sayaçlarını gerçek veriye çektim: **140+ → 12 hareket · 6 → 8 kas grubu · 3 seviye**. Ama kabuğun **üst bandında site geneli "140+ hareket"** iddiası duruyor ve `dadafit-hub`, `giris`, `hareket-merkezi` de aynı sayıyı söylüyor. **"140+" hedef sayı mı (kalsın), yoksa gerçek veriye mi çekilsin (o zaman dört yerde daha değişir)?** |
| **S3** | G2 | Saydığın altı ad (Bugün · Plan ve Takvim · Aktivite Kayıtlarım · İlerlemem · Kaydettiklerim · Antrenörüm) **Fit Planım rayının kalemleri** ve o altı sayfa zaten ayrı dosyaydı. Tek uzun sayfa **Enerji Defteri**'ydi; onu kendi içeriğine göre dörde böldüm (Bugün · Dengele · Su Takibi · Haftalık Özet). **Doğru okuma bu mu, yoksa Enerji Defteri'nin de tam o altı adı taşımasını mı istiyordun?** |
| **S4** | (beklenmedik bulgu B4) | Marka yeşili `--fit` (#009d4f) üzerinde beyaz metin **3.54:1** — AA altı. Bu turda dokunduğum düğmelerde `--fit-deep`'e (5.45:1) geçtim. **Site genelindeki `.btn-fit` de koyulaşsın mı?** Marka tonunu bir gölge koyulaştırır, erişilebilirlik eşiğini geçer. |
| **S5** | D3 | Banner yüksekliklerini aile içinde sabitledim (liste 344 px, detay 384 px, **yayılım 0**). Ama **içinde ikinci bir kart taşıyan beş imza banner'ı** kural dışında: `dadafit-kopru` (614) · `antrenor-ol` (602) · `challenge-v1` (697) · `program-detay` (570) · ana sayfa (900). **Bunlar da sadeleşip aileye katılsın mı, yoksa imza olarak kalsın mı?** |
