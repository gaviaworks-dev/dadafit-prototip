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
| A1 | Kart bileşenini yeniden ele al: görsel · isim · uzmanlık · meta · eylem sabit dikey ritme otursun, tüm kartlar aynı iskelet | aynı satırdaki kartların `offsetHeight` değerleri eşit | ⬜ |
| A2 | Sabit yükseklikli görsel alanı + sabit iç boşluk → isim satırı sabit | aynı satırdaki tüm kartların isim başlığı `boundingBox.top` sapması ≤ 1 px | ⬜ |
| A3 | Etiketler tek satır; sığmayan gizlenir, sona `+N` rozeti | etiket konteyneri `scrollHeight` = tek satır yüksekliği, `scrollWidth ≤ clientWidth`; ≥3 kartta gizlenen sayı = rozetteki N; rozet tıklanamaz | ⬜ |
| A4 | Meta bilgiler (değerlendirme, online vb.) tek satır, ortak taban çizgisi, ikon+metin dikeyde ortalı | meta satırı `boundingBox.top` eşit; ikon–metin dikey merkez farkı < 1 px | ⬜ |
| A5 | Seans fiyatı ve para birimi kalkar; tek baskın eylem "Profili Gör", alt bantta tam genişlik birincil düğme | sayfada `TL` ve `₺` araması 0 sonuç; düğme genişliği = kart iç genişliği; metin kontrastı > 4.5:1 | ⬜ |
| A6 | "DadaFit Onaylı" düz paragrafı → bilgi şeridi (ikon + kısa başlık + tek satır açıklama), metin kısalır | kontrast > 4.5:1; 390 px'te taşma yok; ekran görüntüsü | ⬜ |

---

# FAZ B — ANTRENÖR DETAY SEKMELERİ (`antrenor-detay-v1.html`)

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| B1 | Sekme bileşeni DadaGastro sekme kalıbıyla aynı olsun: aynı yükseklik, aynı aktif göstergesi, aynı geçiş davranışı, aynı klavye erişimi. Kaynağa erişim yoksa DadaFit içindeki mevcut sekme kullanımları tek kalıba indirilir, tercih + gerekçe `KARARLAR.md`'ye yazılır ve plana "DadaGastro referansı doğrulanmadı" notu düşülür | sekme değişiminde içerik kapsayıcısının `boundingBox.top` değişmiyor; aktif gösterge genişliği aktif sekme metniyle örtüşüyor; ok tuşları ve Tab gezinmesi çalışıyor; her sekme için ayrı ekran görüntüsü | ⬜ |

---

# FAZ C — FİLTRE BİLEŞENİ

### C0 · Tespit — filtre çubuğunun kullanıldığı sayfalar

`[data-ff]` taşıyan ve ortak `.ff` bileşenine bağlanan sayfalar (ölçüldü,
`grep -l "data-ff" *.html`), **7 sayfa**:

1. `egzersiz-kutuphane-v1.html` — 5 eksen
2. `programlar-merkezi-v1.html` — 7 eksen
3. `program-liste-v1.html` — 5 eksen
4. `challenge-merkezi-v1.html` — 5 eksen
5. `hareket-merkezi-v1.html` — 3 eksen
6. `fit-testleri-v1.html` — 4 eksen
7. `aktivite-gunlugu-v1.html` — 3 eksen

**Bu listenin dışına çıkılmaz.**

| # | İş | Ölçüm | Durum |
|---|---|---|---|
| C1 | Filtre çubuğu kabukta tek bileşen; 7 sayfada aynısı. Çoklu seçim · rozetli sayaç · eksen bazlı + toplu "Temizle" · panel viewport dışına taşmaz ve kart ızgarasının üstünde · Esc kapatır · Tab + ok tuşu gezinme · `aria-expanded` / `aria-selected` doğru · tek state nesnesi + URL sorgu parametresi, aynı URL ile seçimler geri yüklenir | panel `boundingBox` sağ kenarı < `innerWidth`, alt kenar görünür alanda; `z-index` kartların üstünde; 3 eksende seçim → URL oku → o URL ile yeniden aç → DOM'dan doğrula; 390 px'te panel görünüyor; her sayfa için ekran görüntüsü | ⬜ |
| C2 | `?sure=5` parametresinin karşılığı bir **süre ekseni** var mı, tespit et. Yoksa beklenmedik bulgu olarak rapora yaz ve süre eksenini yeni bileşene ekle | tespit çıktısı + eksen varlığı DOM'dan | ⬜ |
| C3 | Seçenek sayısı **8'i geçen** her eksende panelin üstünde arama alanı; yazdıkça süzme, eşleşme yoksa boş durum metni, panel açılınca odak arama alanına | 3 harf yazınca görünen seçenek sayısı azalıyor; eşleşmeyen metinde boş durum; klavyeyle arama → liste geçişi | ⬜ |
| C4 | Kas grubu ekseni 10 değere, ekipman ekseni 15 değere çıkar (liste aşağıda). Kart sol üst rozet tasarımı **BEĞENİLDİ, aynen korunur** — yalnız kaynak değer listesi genişler | sayfa üstündeki sayaçlar (hareket · kas grubu · seviye) gerçek veriden sayılır, uyuşmuyorsa güncellenir, iki sayım da rapora yazılır | ⬜ |
| C5 | "Egzersiz Kütüphanesi" → **"DadaFit Egzersizleri"**: `<title>`, `h1`, kabuk nav bağlantı metni, ekmek kırıntısı, diğer sayfalardan verilen bağlantı metinleri. **DOSYA ADI DEĞİŞMEZ** (`egzersiz-kutuphane-v1.html`) | eski ibare kullanıcıya görünen hiçbir yerde yok; dosya adı aynı; sayfaya giden tüm bağlantılar çalışıyor | ⬜ |

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
