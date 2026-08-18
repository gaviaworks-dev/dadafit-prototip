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
| D1 | `demo-tag` rozeti ve aynı aileden "ÖRNEK GÖRÜNÜM" rozeti tüm depodan kalkar — işaretleme, stil, üreten kod dahil. **İSTİSNA:** Enerji Defteri'ndeki "Bu sayfadaki veriler örnektir" bilgi şeridi KALIR (giriş yapmamış kullanıcıya bağlam veriyor); tercih `KARARLAR.md`'ye yazılır | tüm HTML/CSS/JS'te `demo`, `veri`, `örnek görünüm` ifadeleri büyük/küçük harf duyarsız, ≥3 varyantla taranır; rozet sonuçları 0; her taramanın çıktısı rapora | ⬜ |
| D2 | Hero ve perde bloklarının dikey yüksekliği kısalır; ilk anlamlı içerik daha erken görünür. Kabukta **tek hero yükseklik ölçeği** tanımlanır, tüm sayfalar onu kullanır; sayfa bazında rastgele değer kalmaz | her sayfa için hero `boundingBox` yüksekliği 1440 px ve 390 px'te ölçülür, önce/sonra tabloya; ilk içerik kartının `boundingBox.top` masaüstünde < 900 px; ekran görüntüsü | ⬜ |

---

# FAZ E — PROGRAMLAR MERKEZİ VE VİDEO SEANSLARI

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| E1 | `programlar-merkezi-v1.html` içindeki erişim/paket (ücretsiz–PRO) bölümü tamamen kalkar | bölüm DOM'da yok; iç çapa bağlantıları kırılmadı; "ücretsiz" ve "pro" ibareleri sayfada kalmadı | ⬜ |
| E2 | İlerleme / "kaldığın yerden devam" bölümü kalkar | E1 ile aynı | ⬜ |
| E3 | "Programımı Bul" sihirbazı **modal olmaktan çıkar**; programlar merkezindeki banner içinde bir düğmeyle açılan sayfa içi bölüm olur | açılıştan 3 sn sonra modal katmanı DOM'da yok ya da `display:none`; düğmeye basınca bölüm görünür ve `boundingBox` viewport içinde; gereksizse Esc davranışı kaldırıldı | ⬜ |
| E4 | Video seansları programlar merkezinde kendi başlıklı bölümüne çıkar, kart ızgarasıyla görünür, `video-seans-detay-v1.html`'e bağlanır | bölümün `boundingBox.top` önceki konumuna göre yukarı taşındı (önce/sonra değerleri); 390 px'te de görünür | ⬜ |
| E5 | "Programlar" ile "Tüm Programlar" ayrımı netleşir: aynı hedefe gidiyorlarsa tek bağlantı, farklı hedeflere gidiyorlarsa etiketler ayrışır. Önce ölçüm plana, sonra karar `KARARLAR.md`'ye | bağlantı hedef tablosu + uygulanan karar | ⬜ |
| E6 | FIT testi detay arayüzü **≥3 iterasyonda** geliştirilir: her iterasyonda ekran görüntüsü + kendi değerlendirmen (okunabilirlik · hiyerarşi · boşluk ritmi · mobil davranış) + zayıf noktanın düzeltilmesi | 3 iterasyonun ekran görüntüleri ve değerlendirme notları plana; hangi iterasyon neden seçildi | ⬜ |

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
| F1 | Kabuk navigasyonundaki Challenge açılır menüsü kalkar, tek bağlantıya iner | dropdown DOM'da yok; bağlantı challenge merkezine gidiyor; klavye gezinmesi bozulmadı; tüm sayfalarda aynı | ⬜ |
| F2 | Durum bazlı ayrı sayfa/ayrı bağlantı yapısı kalkar; challenge merkezinde hepsi tek listede, durum yalnızca kart rozeti (istenirse filtre ekseni) | `?durum=` eski adresler kırık bağlantı üretmiyor (aynı sayfaya düşüyor); üç durumun kartları aynı ızgarada; sayılar rapora | ⬜ |
| F3 | `challenge-v1.html` zaman çizelgesi ve aşama göstergesi düzelir: başlangıç · süre · bitiş tek okunur bileşende; katılım ve geri dönüş bağlantıları görünür ve erişilebilir | zaman bileşeni 390 px ve 1440 px'te `scrollWidth` ile taşmıyor; tüm bağlantıların HTTP durumu; ekran görüntüsü. Tarif belirsiz kaldıysa yorum tek cümleyle plana | ⬜ |

---

# FAZ G — ENERJİ DEFTERİ

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| G1 | Enerji Defteri üst navigasyondan çıkar, Fit Planım / profil bağlamının altına taşınır | kabuk nav'ında üst düzey öğe değil; profil bağlamından erişiliyor; eski adres kırık bağlantı üretmiyor | ⬜ |
| G2 | Tek sayfadaki sekmeler ayrı sayfalara bölünür: Bugün · Plan ve Takvim · Aktivite Kayıtlarım · İlerlemem · Kaydettiklerim · Antrenörüm. Her biri kendi HTML dosyası; aralarında B1'de sabitlenen sekme bileşeniyle gezinilir | her yeni sayfa HTTP 200; sekme bileşeni her sayfada aktif durumu doğru gösteriyor; eski tek sayfa adresi ve içindeki çapalar kırık bağlantı üretmiyor; her sayfa için ekran görüntüsü | ⬜ |

---

# FAZ H — İÇERİK VE VERİ (HENÜZ BAŞLAMA)

| # | İş | Durum |
|---|---|---|
| H1 | Egzersiz verisindeki eksikler — ekipman bilgisi · hareket terim açıklamaları · gym dışı hareket çeşitliliği (bisiklet, CrossFit, yoga türü) — **ayrı bir turda** ele alınacak. Veri kaynağı henüz belirlenmedi | ⛔ BAŞLANMADI (bilinçli) |

---

# DOĞRULAMA TABLOSU

Her faz bittiğinde bağımsız doğrulama ajanının ölçümleri buraya yazılır.

| Faz | Madde | Ölçüm | Beklenen | Ölçülen | Sonuç |
|---|---|---|---|---|---|
| — | — | — | — | henüz çalıştırılmadı | — |

# BEKLENMEDİK BULGULAR

| # | Bulgu | Nerede | Ne yapıldı |
|---|---|---|---|

# BEYAR'A SORU DÖNEN MADDELER

| # | Madde | Soru |
|---|---|---|
