# DadaFit Yönetim Paneli — PLAN

> **Durum:** R16 · 2026-08-30 · statik HTML maket, backend yok.
> **Kaynak ölçümler:** `~/Desktop/dada-hesap-onizleme.html` §10 (Ekran E — Admin
> panel sidebar, tabanı Gastro) · bu deponun modül envanteri · Gastro admin
> panelinin işlev çıkarımı.
> **Kural:** `docs/fit-kit.md` dışına çıkılmaz. Admin için yeni bir kalem
> gerekiyorsa kite eklenir ve belgelenir (§13).

---

## 0 · Başlangıç noktası — ölçülen gerçek

**Fit'te yönetim paneli YOK.** Depoda `antrenor-panelim-v1.html` var (771 satır)
ama o antrenörün kendi paneli, yönetim paneli değil. Devir belgesinin §10'u da
bunu böyle ölçmüş: *"Fit — ADMİN PANELİ YOK … Sidebar'ı hizalamak demek paneli
sıfırdan kurmak demektir; bu diğer üçüyle aynı ölçekte bir iş değildir."*

Yani bu, diğer üç markadaki gibi bir **hizalama** işi değil, bir **kuruluş** işi.
Ama kurulurken diğer üçüyle aynı iskelete oturur; ayrışma buradan başlamasın.

---

## 1 · Bölüm ekseni — KANON

Devir belgesi §10'un ölçtüğü kök neden aynen alınıyor:

> *Gastro ve Diet içerik → operasyon → yapılandırma eksenini kullanıyor; Gourmet
> bambaşka bir eksen kurmuş (modül → sözlük → işletme → sistem). Bu yüzden aynı
> kalem farklı bölümlere düşüyor. **Hedef: Gastro'nun üç bölümü kanon, markaya
> özel modüller ANA İÇERİK'in altında toplanır.***

**Fit'in bölümleri:**

```
Genel Bakış            ← tek kalem, bölümlerin üstünde
ANA İÇERİK             ← markanın kendi ürünü (Fit'te en kalabalık bölüm)
OPERASYON              ← günlük iş: kim, ne satın aldı, kim şikâyet etti
YAPILANDIRMA           ← sistemin kendi ayarları
```

**Bölüm ayracı yoktur.** Ölçüldü (§10): *"Gastro bölümleri başlık ile ayırıyor,
ayrı bir çizgi öğesi yok."* Fit de öyle yapar.

---

## 2 · Tek ad kuralı

Devir belgesi dört kalemde ad ayrışması ölçtü (kullanıcı yönetimi üç ad, destek
iki ad, kazanç iki ad, sayfa iki ad). Fit **Gastro'nun adını** alır; yeni dizgi
üretilmez:

| İşlev | Fit'te kullanılacak ad | Neden |
|---|---|---|
| Kullanıcı yönetimi | **Üyeler ve Yetki** | Gastro taban |
| Destek | **Destek Talepleri** | Gastro taban (Diet tek başına ayrışıyordu) |
| Kazanç | **Kazançlar ve Ödemeler** | Gastro taban |
| Sayfa tanımları | **Sayfalar ve SEO** | Gastro taban |

🔴 **"Diller" kalemi YOK.** Devir belgesi §10'da Beyar kararı: *"Diller sekmesi
dört markadan da KALKAR"* — ekran veri yönetmiyor, teşhis yapıyor; Fit zaten tek
dilli (`<html lang="tr">`). Panelde açılmaz.

⚠ Gourmet'te "Yorum Moderasyonu" menüde **iki kez** geçiyor (ölçüldü). Bu bir
kusurdur, kopyalanmaz.

---

## 3 · Sidebar — Fit'in tam haritası

`O` = dört markada ortak · `F` = Fit'e özel

### Genel Bakış
| Kalem | | Ekranın işi | Dosya |
|---|---|---|---|
| Genel Bakış | O | Sayaç kartları, son hareketler, dikkat isteyen kuyruklar | `admin-v1.html` |

### ANA İÇERİK — Fit'in kendi ürünü
| Kalem | | Ekranın işi | Dosya |
|---|---|---|---|
| Hareket Kütüphanesi | F | 25 hareketin listesi; ad, bölge, ekipman, seviye, form videosu, alternatif | `admin-hareketler-v1.html` |
| Programlar | F | Program kataloğu; hafta/gün/hareket kurgusu, erişim kademesi | `admin-programlar-v1.html` |
| Challenge'lar | F | Katalog: üç tip, hedef alanları tipe göre değişir, ödül ve durum | `admin-challenge-v1.html` |
| Fit Testleri | F | Test tanımları, ölçüt aralıkları, sonuç yorumları | `admin-testler-v1.html` |
| Taksonomi | O | Kas bölgesi · ekipman · seviye · hedef sözlükleri (tek ekran, sekmeli) | `admin-taksonomi-v1.html` |
| Sayfalar ve SEO | O | Statik sayfalar, başlık/açıklama, yayın durumu | `admin-sayfalar-v1.html` |

### OPERASYON — günlük iş
> ⚠ Bölümleme §9'da Gastro'nun ölçülen sidebar'ına çekildi; aşağıdaki tablo o
> düzeltmeyi taşır (Rozetler ve Log buraya geldi, Raporlar YAPILANDIRMA'ya gitti).

| Kalem | | Ekranın işi | Dosya |
|---|---|---|---|
| Üyeler ve Yetki | O | Üye listesi, rol, durum, kademe; tek üye detayı | `admin-uyeler-v1.html` |
| Antrenörler | F | Başvuru kuyruğu + onaylı antrenörler; belge doğrulama | `admin-antrenorler-v1.html` |
| Moderasyon | O | Yorum ve içerik bildirimi kuyruğu | `admin-moderasyon-v1.html` |
| Destek Talepleri | O | Dört durumlu kuyruk (K8 kanonu), atama, yanıt | `admin-destek-v1.html` |
| Hizmetler ve Satışlar | F | Antrenör hizmet paketleri, satın alımlar, iade talepleri | `admin-hizmetler-v1.html` |
| Kazançlar ve Ödemeler | O | Komisyon, ay sonu ödeme listesi, alt sınır altı bakiyeler | `admin-odemeler-v1.html` |
| Rozetler ve Kademeler | O | Rozet kataloğu, puan değerleri, 8 kademe eşiği (puan + aktif gün) | `admin-rozetler-v1.html` |
| Log Yönetimi | O | Yönetici işlem kaydı | `admin-log-v1.html` |

### YAPILANDIRMA
| Kalem | | Ekranın işi | Dosya |
|---|---|---|---|
| Menü ve Navigasyon | O | Header, footer, hesap menüsü kalemleri | `admin-menu-v1.html` |
| Sponsorluk ve Reklam | O | Reklam alanları, kampanya, kreatif (üç sekme) | `admin-reklam-v1.html` |
| Paketler ve Özellikler | F | Kademe⇄özellik matrisi (`fit-paket.js`), fiyat alanları | `admin-paketler-v1.html` |
| Bildirim Şablonları | O | E-posta ve uygulama içi bildirim metinleri | `admin-bildirim-v1.html` |
| Ayarlar | O | Marka ayarları, para parametreleri (K13), sağlık uyarı metni | `admin-ayarlar-v1.html` |
| Raporlar | O | Genel · içerik · finansal · moderasyon (bölümün sonu — Gastro deseni) | `admin-raporlar-v1.html` |

**Toplam: 1 + 6 + 8 + 6 = 21 ekran.**
Ortak **13**, Fit'e özel **8**. Diet ve Gourmet'e taşınırken 13'ü aynen gider,
8'i markanın kendi modülleriyle değişir.

---

## 4 · Ekran kalıpları — altı tip

Yirmi bir ekran altı kalıba iner. Yeni ekran eklemek yeni bir kalıp icat etmek
değil, var olan kalıba bir satır yazmaktır.

| # | Kalıp | Parçaları | Kullanan ekranlar |
|---|---|---|---|
| **K1** | **Liste + süzgeç** | başlık · arama · süzgeç şeridi (`.ff`) · tablo · toplu eylem · sayfalama · boş durum | Hareketler · Programlar · Challenge · Testler · Üyeler · Hizmetler · Sayfalar · Log |
| **K2** | **Kuyruk** | durum sekmeleri · satır kartları · satır içi eylem (onayla/reddet) · atama | Antrenörler · Destek · Moderasyon |
| **K3** | **Detay** | kimlik başlığı · sekmeli paneller · yan bilgi kolonu · eylem çubuğu | Üye detayı · Antrenör detayı · Talep detayı |
| **K4** | **Form** | `.form-card` bölümleri · alan ızgarası · yardım satırı · kaydet çubuğu | Challenge oluştur · Hareket düzenle · Ayarlar · Bildirim şablonu |
| **K5** | **Matris** | satır = modül/özellik · kolon = kademe · hücre = seçim | Paketler ve Özellikler · Rozetler (rozet⇄basamak) |
| **K6** | **Rapor** | sayaç kartları · grafik · kırılım tablosu · dönem seçici | Genel Bakış · Raporlar · Kazançlar |

**Boş durum her kalıpta zorunludur** (kit §9, dört parçası da yazılır). Bir
listede sonuç yoksa "veri yok" yazıp bırakmak kusurdur.

---

## 5 · Kabuk — 🔴 R17'DE ÖLÇÜLEREK YENİDEN YAZILDI

`assets/css/fit-admin.css` + `assets/js/fit-admin.js` — **sayfa kabuğu tek
kaynak**. Sayfa yalnız `<div id="fitAdminTop"></div>` yazar ve kendi içeriğini
`<main class="adm-main"><div class="adm-page">` içine basar.

⚠ **Bu bölümün R16/2 hâli geçersizdi.** Orada yazan ölçüler (276px beyaz
sidebar, üst barda sayfa başlığı, sidebar altında tam genişlik daralt düğmesi)
Gastro'dan **ölçülmemiş**, kitin tokenleriyle **uydurulmuştu**. Sonuç: tek bir
token bile icat etmeyen, ama Gastro'ya hiç benzemeyen bir panel. R17'de kaynak
okundu ve kabuk onun yapısına çekildi.

**Kaynak** (salt okuma; kod alınmadı, yapı alındı):
`dadagastro-profil/public/reference/admin/sa-shell.css` (436 satır) ·
`sa-rail.css` (90) · `sa-ui.css` (290) ·
`public/reference/admin-kullanicilar/sa-kullanicilar.css` (liste kalıbı) ·
`public/reference/admin-dashboard/sa-dashboard.css` (KPI + hızlı aksiyon) ·
`resources/views/admin/layout.blade.php` (508 satır, kabuk markup'ı).

### Basılan yapı — Gastro'nun iki-katman koyu kabuğu

```
┌────┬──────────────┬──────────────────────────────────────┐
│rail│ bölüm menüsü │ üst ince bar (64px, AÇIK)            │
│76px│    264px     ├──────────────────────────────────────┤
│#19 │   #211E16    │ sayfa başlığı (h1 + alt satır + eylem)│
│160F│              │ kaynak şeridi                         │
│    │  YÖNETİM     │ sayaç kartları (KPI ×4, trend satırlı)│
│    │  DadaFit     │ kartlar · tablolar · sayfalama        │
└────┴──────────────┴──────────────────────────────────────┘
      ╰ sa-divider tutamağı (dikey ortada, dış kenarda)
```

| Parça | Ölçü | Kaynak |
|---|---|---|
| İkon rail | `76px` · `#19160F` (en koyu katman) | sa-shell.css:50, :70 |
| Bölüm menüsü | `264px` · `#211E16` (= kitin `--fit-dark`ı) | :51, :71 |
| Sidebar toplam | `340px` — gövde aynı değerle içeri itilir | :52, :332 |
| Üst çubuk | `64px` · `position:fixed` · açık zemin | :53 |
| Arama | üst barda **SOLDA**, `flex:1` `max-width:420px` | :390 |
| Sayfa başlığı | **gövdede**, kartların üstünde (`.pnl-page-head`) | dashboard.blade.php:279 |
| Daralt | menünün **dış kenarında yüzen tutamak**, dikey ortada | sa-shell.css "DIVIDER TAB" |
| KPI | ikon solda 44px → sayı 26px → etiket → **trend satırı** | :377-390 |
| Kart | `.pnl-card` 16px yarıçap · başlık `18px 22px` · gövde `22px` | :360-370 |
| Tablo | `.ptable` th `11.5px/700` `.06em` zeminsiz · ilk hücre 22px | sa-kullanicilar.css:48 |
| Filtre şeridi | kartın **ilk satırı**, arama solda `max 320px` | sa-kullanicilar.css:6 |
| Sayfalama | kartın **içinde**, en ayağında | sa-kullanicilar.css:110 |
| Aksan | `--acc:#009d4f` · `--acc-deep:#007a3d` · `--acc-rgb:0,157,79` | **Gastro'nun kendi sa-shell.css:74'ü**, `body[data-sec="dadafit"]` satırı |

**Değişen tek şey renk.** Gastro'nun aksanı domates; Fit'inki yeşil ve o üç
değer Gastro'nun kendi dosyasından, Fit için ayrılmış satırdan alındı — yani
yeni renk üretilmedi, çeviri bile yapılmadı.

**Gastro'dan sapılan tek eksen: dokunma hedefi 44px.** Gerekçe ve yöntem
`docs/fit-kit.md` §13'te.

## 6 · Dürüstlük

⚠ **Statik prototip — gerçek veri yok, gerçek yazma yok.**

- Ekranlar **örnek veriyle dolu** görünür; tablolar boş bırakılmaz.
- **Yazma yüzeyi maket**tir ve her ekran bunu **tek dürüst şeritle** söyler
  (kit §11 kalıbı). "Kaydet" düğmesi vardır, formu doğrular, ama sunucu yoktur.
- Var olan sözleşme modüllerinden (`fit-challenge` · `fit-rozet` · `fit-paket` ·
  `fit-su`) **okunabilen veri gerçekten okunur** — o ekranlarda örnek veri
  uydurulmaz. Challenge kataloğu, rozet kataloğu, kademe eşikleri ve
  kademe⇄özellik matrisi bugün tarayıcıda gerçek.
- Kaynağı olmayan alan **"—"** kalır (üyelik tarihi deseni).
- **"Yakında" yazılmaz.** Depoda bugün 0 tane var, öyle kalır.

---

## 7 · Kararlar (bu turda lead'in verdiği, gerekçesiyle)

1. ~~**Sidebar 276px, Gastro'nun 340'ı değil.**~~ 🔴 **R17'DE GERİ ALINDI.**
   Gerekçe şuydu: "Fit'in admin ekranlarının çoğu tablo ve 340 kolonları
   sıkıştırıyor." Ölçüldüğünde yanlış çıktı — Gastro'nun kendi ekranlarının
   ~30'u da tablo ve orada 340px ile çalışıyorlar; dar kolonun cevabı sidebar'ı
   kısmak değil, tablo kabının kendi ekseninde kaymasıdır (`.adm-tw` +
   `contain:paint`, zaten kurulu). 276 sayısı bir ölçüm değil, ölçmemenin
   kılıfıydı. **Sidebar 340px (76 rail + 264 menü).** Ölçüldü: 21 ekranın
   21'inde 1440 · 1024 · 390'da yatay taşma 0.

2. **Antrenör paneli birleştirilmiyor.** `antrenor-panelim-v1.html` antrenörün
   kendi paneli; admin paneli ayrı bir yüzeydir ve ayrı kalır. İkisi aynı
   yazma ucunu paylaşmaz. (Devir notunun açık sorusuydu; ayrı olmaları K1
   topolojisiyle de tutarlı.)
3. **Taksonomi tek ekran, sekmeli.** Gastro'da ayrı kalemler; Fit'in sözlükleri
   (kas bölgesi · ekipman · seviye · hedef) küçük ve aynı kalıbı paylaşıyor.
   Dört ayrı sidebar kalemi menüyü şişirirdi.
4. **Challenge oluşturma ekranında tip seçimi hedef alanlarını değiştirir.**
   Motorun `TIP` tablosu zaten bunu söylüyor: `sureli` → metrik + değer,
   `seri` → adım listesi, `aliskanlik` → gün. Form bunu izler, üç ayrı form
   yazılmaz.
5. **Para sayıları koda gömülmez (K13).** Komisyon · ödeme günü · alt sınır ·
   fatura eşiği panelde **alan** olarak durur, ekranda sabit metin yazılmaz.

---

## 8 · Sıra

| Dalga | İş | Neden önce |
|---|---|---|
| **1** | Kabuk (`fit-admin.css` · `fit-admin.js`) + `admin-v1.html` (Genel Bakış) | Diğer 20 ekran bu iskelete oturur; iskelet sonra değişirse hepsi değişir |
| **2** | K1 liste kalıbı: Hareketler · Challenge · Üyeler | En kalabalık kalıp; üçü doğrulanınca kalan beş liste kopyadır |
| **3** | K2 kuyruk: Antrenörler · Destek · Moderasyon | Onay akışı ortak |
| **4** | K4 form + K5 matris: Challenge oluştur · Rozetler · Paketler · Ayarlar | Var olan sözleşme verisini gerçekten okuyan ekranlar |
| **5** | Kalanlar: Programlar · Testler · Taksonomi · Sayfalar · Hizmetler · Kazançlar · Raporlar · Menü · Reklam · Bildirim · Log | Kalıplar kanıtlandıktan sonra |

**Her ekran bitince ölçüm kapısı:** yatay taşma 0 (1440 · 1024 · 768 · 390) ·
konsol hatası 0 · ölü bağlantı 0 · dokunma hedefi ≥44px · boş durum dört parça.

---

## 9 · 🔴 GASTRO'YA HİZALAMA — ölçüldükten sonraki revizyon

Plan ilk yazıldığında Gastro'nun sidebar'ı henüz **ölçülmemişti**; bölümleme
devir belgesinin §10 özetinden türetilmişti. Sonra kaynak okundu
(`dadagastro-profil/resources/views/admin/layout.blade.php`, salt okuma — kod
alınmadı, yalnız bölümleme ve sıra) ve **dört sapma** çıktı. Dördü de düzeltildi.

### Gastro'nun ölçülen sidebar'ı

```
Genel Bakış
ANA İÇERİK    Tarifler · Dolapta Ne Var? (Malzemeler · Hariç Tutma Nedenleri) ·
              Püf Noktaları · Mutfak Sırları (Mutfağa Giriş · Mutfak
              Ansiklopedisi · Sofra Düzeni) · Sözlük · Video Mutfağı (Videolar ·
              Video Serileri · Kısa Videolar) · Koleksiyonlar · Sezonlar ·
              NP Modları · Taksonomi · Sayfalar & SEO
OPERASYON     Üyeler & Yetki · Yorum Moderasyonu · Medya Kuyruğu · Geri Bildirim ·
              Kazançlar & Ödemeler · Destek Talepleri · Log Yönetimi · Rozetler ·
              Kademeler · Sezonlar · Planlar · Creator Planları · Abonelikler ·
              Faturalar · Kuponlar
YAPILANDIRMA  Menü / Navigasyon · Sponsorlar · Reklam Alanları · Reklam Paketleri ·
              Kampanyalar · Kreatifler · Sponsorluk · Sponsorluk Raporu ·
              Ayarlar · Raporlar
```

### Düzeltilen dört sapma

| # | Taslakta | Gastro'da | Yapıldı |
|---|---|---|---|
| 1 | Rozetler ve Kademeler → YAPILANDIRMA | **OPERASYON** | OPERASYON'a taşındı |
| 2 | Log Yönetimi → YAPILANDIRMA | **OPERASYON** | OPERASYON'a taşındı |
| 3 | Raporlar → OPERASYON | **YAPILANDIRMA** (bölümün sonu) | YAPILANDIRMA'ya taşındı, sona kondu |
| 4 | Düz liste | Alt gruplu kalemler var | `alt` alanı eklendi; Fit'te bugün gerek yok, şema hazır |

### Bilerek ayrılan iki nokta

1. **Rozetler ve Kademeler tek kalem** (Gastro'da iki). İkisi de `fit-rozet.js`in
   aynı motorundan geliyor ve kademe eşiği rozet puanından hesaplanıyor. İki
   ekrana bölmek tek veri kaynağını iki yüzeye dağıtmak olurdu — bu depoda üç kez
   temizlenen "aynı soruya iki cevap" kusuru.
2. **Sponsorluk ve Reklam tek kalem + sekme** (Gastro'da yedi kalem). Fit'te
   bugün reklam yüzeyi tek sayfa; yedi kalemlik menü arkasında altı boş ekran
   demek olurdu. Fit'in reklam ürünü büyüyünce Gastro'nun kırılımına açılır.

### Gastro'da olup Fit'e GELMEYENLER

~~**Planlar · Creator Planları · Abonelikler · Faturalar · Kuponlar**~~
🔴 **R16/2'de K6 DEĞİŞTİ (2026-08-30): Fit'te abonelik VARDIR.** Bu beş kalem
artık "gelmeyen" değil, **sıradaki** iş: Fit'te en az **Planlar · Abonelikler ·
Faturalar** açılır; `Creator Planları`nın Fit karşılığı antrenör hizmet paketi
onayıdır. `Hizmetler ve Satışlar` **kalır** — abonelik platformun kendi ürünü,
hizmet ise K4 gereği üyenin üreticiden satın aldığı şey; ikisi ayrı akış.
Sidebar 21 kalemden ~24'e çıkar. **Medya Kuyruğu** ve **Geri Bildirim** bu turda
kapsam dışı: Fit'te ikisinin de arkasında bir yüzey yok, menüye koymak boş ekran
vaat etmek olurdu.

### Gastro'dan ALINAN iki yetenek

| Yetenek | Gastro'daki karşılığı | Fit'te |
|---|---|---|
| **Yönetimde arama** | *"Kullanıcı, içerik ara…"* | `.t-ara` — **21 ekranın kendisini** arar. Sunucu olmadığı için içerik aranamaz; yer tutucu "Ekran ara…" der ve tam olarak onu yapar. Klavye: ↑↓ gezinir, Enter açar, Esc kapatır |
| **Menüyü daralt** | *"Menüyü daralt/genişlet"* | `.adm-daralt` — 276px → **74px**, tercih `localStorage`da durur. Daraltılmışken ad `title`/`aria-label` olarak kalır, bilgi kaybolmaz. Çekmece kipinde (≤1100px) devre dışı |

---

## 10 · Gastro admin paneli — TAM ÖLÇÜM (kaynak referansı)

Kaynak: `dadagastro-profil` · Laravel + **elle yazılmış Blade** (Filament YOK) ·
salt okuma, kod alınmadı. Diğer üç markaya taşınırken bu tablo referanstır.

| Ölçüm | Sayı | Nereden |
|---|---|---|
| Admin rotası | **247** | `routes/web.php:1058–1669` (114 GET · 84 POST · 27 PUT · 19 DELETE · 3 PATCH) |
| Görünen ekran | **100** | 114 GET − 9 export − 3 AJAX − 2 redirect |
| Admin blade | 103 (22 partial · **80 ekran**) | 100 > 80 çünkü `form.blade` create+edit'i, `ayarlar/index` 8 sekmeyi besliyor |
| Controller | 50 | `app/Http/Controllers/Admin/` |
| Sidebar | **3 bölüm · 26 üst kalem · 21 alt kalem = 47 giriş** | `resources/views/admin/layout.blade.php` (508 satır) |

### Liste kalıbı — ~30 ekranda aynı

1. `.sa-flash` işlem bildirimi (kartın DIŞINDA, en üstte)
2. `.pnl-page-head`: solda `<h1>` + sayaç taşıyan alt satır, sağda buton şeridi
   (ghost ikincil → Dışa Aktar → birincil "+ Yeni X"). **Sayfa üstünde arama YOK.**
3. `.pnl-card` açılır — geri kalan her şey kartın içinde
4. `.filter-bar` kartın ilk satırı: **solda arama** (max 340px, kendi GET formu),
   **sağında çipler** — süzgeç **çip**, açılır menü değil; her çip sayaç rozetli
   `<a>`, hepsi gerçek query-string, client-side filtre yok
5. `.ptable-wrap` > `<table class="ptable">`, son sütun "Aksiyon"
6. Satır eylemi **en sağ hücrede**, 32×32 metinsiz ikon düğme, durum-koşullu;
   yıkıcı eylemde kendi modalı — **native `confirm()` yasak**
7. Boş durumda tablo yerine `.pnl-empty` (ikon + `<h4>` + açıklama + tek çıkış)
8. **Sayfalama kartın İÇİNDE, en ayağında** (33 ekran): solda "X sonuçtan a–b
   gösteriliyor", sağda ◂ · numaralar · ▸
9. **Toplu işlem 47 kalemden yalnız BİRİNDE** (Yorum Moderasyonu) — blade'in
   kendi yorumu "bu ekrana özel, admin genelinde yok" diyor

### Form kalıbı

- İki kolon. **Sol geniş kolon** sekmeli (`İçerik` / `SEO`, 10 ekran); dil
  sekmesi ikisini birden sarar (24 ekran).
- **Sağ kolon `position:sticky`** yayın kartı (14 ekran): durum · yayın tarihi ·
  SEO skoru · toggle'lar.
- 🔴 **Kaydet çubuğu SAĞDA** — `.form-actions{justify-content:flex-end}`, dokuz
  ayrı sayfa CSS'inde birebir. Sıra: `İptal` · `Taslak Kaydet` · **birincil CTA
  en sağda**. Sabit/yapışkan çubuk değil, sol kolonun dibinde ayrı bir kart.
- Detay ekranları (7 tane) **sekmeli değil**: üst başlık + sağda eylemler +
  altında salt-okunur kart yığını.

### 🔴 Fit'te düzeltilen sapmalar

| # | İskelette | Gastro'da | Yapıldı |
|---|---|---|---|
| M1 | Arama kartın başlığında sağda | Filtre şeridinde **solda** | Yeni ekranlarda sola; var olanlar bozulmasın diye zorlanmadı |
| M2 | Süzgeç **açılır menü** | Süzgeç **sayaç rozetli çip** | 🔴 **Bilerek ayrıldık** — Beyar açıkça "egzersiz kütüphanesindeki dropdown'ı örnek al" dedi ve public yüzeyin süzgeci o. Panelin public'e benzemesi, Gastro'ya benzemesinden önce gelir |
| M3 | Toplu seçim genel kalıpta | 47 kalemden 1'inde | Genel kalıptan çıkarıldı; yalnız anlamlı olduğu ekranda |
| M4 | Raporlar OPERASYON | **YAPILANDIRMA** (son kalem) | Taşındı |
| M5 | Rozet · Kademe · Log YAPILANDIRMA | **OPERASYON** | Taşındı |
| M6 | "Moderasyon" tek kalem | Yorum · Medya Kuyruğu · **Geri Bildirim** ayrı | Fit'te tek kalem + sekme kaldı: medya kuyruğunun arkasında Fit'te yüzey yok, geri bildirim kabuğun "Görüş Bildir"inden besleniyor. Üç kalem yapmak arkasında iki boş ekran vaat etmek olurdu |
| — | Kaydet **solda** | Kaydet **SAĞDA** | 🔴 8 dosyada 11 yerde düzeltildi |

⚠ "Kaydet solda" kuralı devir belgesinden geliyordu ama o, dört markanın **hesap
ekranlarının** kuralı; admin formunun değil. İki ayrı yüzey, iki ayrı kural —
karıştırıldı ve ölçümle düzeltildi.

### Gastro'da olup Fit'te karar bekleyenler

1. ~~**K6 çelişkisi.**~~ ✅ **KARARA BAĞLANDI (2026-08-30):** Fit'te abonelik
   VARDIR. Çelişki üç yerde ölçülmüştü (`fit-fatura.js` `tur:"uyelik"` faturaları ·
   public'te duran `pro-v1.html` + `pro-odeme-v1.html` · `fit-paket.js`in Pro/Pro Max
   fiyat alanları) ve karar geri alındı. Yerine geçen iş: panele abonelik ekranları.
2. **Antrenör konumu:** Gastro'da şef ayrı kalem değil, **üye detayının sekmesi**.
   Fit'te ayrı kalem yapıldı — public tarafta antrenör kendi dünyası
   (`antrenorler-v1.html`), başvuru kuyruğu üye listesine sıkışmazdı.
3. **K12 üretici eşikleri** Fit'te tanımsız (Gastro: 50 tarif · 25 püf · 10 takip ·
   10 takipçi, dördü de panelden). Ayarlar'da o sekme **açılmadı** — arkasında
   veri yok.
4. **Çok dillilik:** Gastro'da dil sekmesi 24 ekranda. Fit tek dilli
   (`<html lang="tr">`), üstelik devir belgesi §10'da "Diller kalemi dört
   markadan da kalkar" kararı var. Panelde dil sekmesi **yok**.


---

## 11 · R19 KARARLARI — teknik ve görsel, gerekçesiyle

> Bu turda Beyar'ın verdiği çerçeve: *"Gastro taban, tavan değil. Gastro'da bir
> şey eksikse orada durma — üstüne inşa et."* Aşağıdaki her karar bir ölçümün
> ardından verildi; ölçümler `docs/gastro-olcum/` altında (5 belge).

### D1 · TinyMCE'nin KENDİSİ gelmedi, SÖZLEŞMESİ geldi

**Ölçüm:** Gastro TinyMCE **7.9.3** self-hosted, merkezî config
(`public/vendor/tinymce-config.js`, 158 satır), **3 profil**, 36 kullanım /
14 ekran.

**Karar:** Fit'e `.adm-ed` — `contenteditable` tabanlı kendi editörü.
Araç çubuğu düğme listesi, **sırası**, ayraç yerleri, üç profil ve
`block_formats` Gastro'nun config'inden **birebir**.

**Gerekçe:**
1. Bu depo **buildless** ve tek dış bağımlılığı Font Awesome CDN'idir. TinyMCE 7
   community ~700 KB + yüzlerce skin dosyası; vendorlamak deponun kendi kararını
   bozar, "araç eklemek için DUR ve sor" kuralına girer.
2. Maketin editörü **gerçek olmalı, TinyMCE olmak zorunda değil**. `.adm-ed`
   gerçekten biçimlendiriyor — yalan söylemiyor.
3. **Sözleşme taşındığı için backend turu bedavaya devralır:** aynı düğme
   listesi, aynı profiller, aynı `block_formats`. `<textarea>` yerinde duruyor
   ve değeri her `input`ta yazılıyor (Gastro'nun `triggerSave` borcu yok).

**Gastro'nun iki kararı da taşındı:** gövde-blok profilinde `underline`
**bilerek yok** (purifier `span`a izin vermediği için altı çizgi sessizce
kayboluyordu — "editör kullanıcıya yalan söylerdi"); yapıştırma **düz metin**.

**Üstüne inşa:** Gastro'da editörden görsel yükleme yolu **yok**
(`images_upload_url` tanımsız, yalnız URL yapıştırma). Fit'te editörün `image`
düğmesi **medya kütüphanesine** bağlı.

### D2 · SortableJS gelmedi, merkezî `FIT_ADMIN.sirala` kuruldu

**Ölçüm:** Gastro SortableJS 1.15.2'yi CDN'den alıyor ama **merkezî değil** —
altı ekran kendi satırını basıyor (**15 `Sortable.create` çağrısı**) ve `defer`
tuzağı **beş formda ayrı ayrı** çözülmüş (`whenSortableReady`).

**Karar:** kütüphanesiz, HTML5 sürükle-bırak + **klavye**, tek sürücü.
**Gerekçe:** iki kusur birden kalkıyor (dağınıklık + `defer` tuzağı), CDN
bağımlılığı eklenmiyor, ve **klavyeyle sıralama** doğuyor — Gastro'nunkinde yok,
faresiz kullanıcı sırayı hiç değiştiremiyordu.

### D3 · Medya kütüphanesi — Gastro'da YOK, kuruldu

**Ölçüm:** `media-library|MediaLibrary|media.index` → **0 isabet** ·
`alt_text` → **0** · klasörleme **yok**. Gastro'da görsel yalnız formun içindeki
yükleme kutusundan gelir; bir daha bulunamaz.

**Karar:** `admin-medya-v1.html` (ekran) + `FIT_ADMIN.medya()` (form
alanlarından çağrılan modal). Klasör · arama · alt metin · yeniden kullanım ·
tekli/çoklu seçim · **nerede kullanıldığı**.

**Katalog uydurulmadı, sayıldı:** `tools/medya-veri-uret.mjs` 75 HTML +
`assets/js`i tarıyor → `assets/js/fit-medya-veri.js`, **85 görsel, 9 klasör**,
her kaydın `kullanim` sayısı ve `sayfa` listesi gerçek. `paylasik:true` olan
**79** görsel birden çok modülde geçiyor; ekran "bunu değiştirirsen başka yer de
değişir" diye uyarıyor.

⚠ **Klasör bir dosya yolu değil, kullanım bağlamıdır** — uzak görselin (Unsplash)
klasörü olmaz; onu en çok kullanan modül klasör sayılır.

### D4 · Onay modalı tek kaynak, native `confirm()` yasak

Gastro'da `.sa-modal` CSS'i **üç kopya**; Fit'te tek. Yıkıcı-eylem delegesi
(capture fazlı, belge geneli) taşındı: `data-yikici="Ad" data-fiil="…"` yazan
her düğme kendiliğinden onay ister; ekran başına `onclick` yazılmaz.
Native `confirm()` yasağı Gastro'da doğrulandı (admin blade'lerinde **0** çağrı).

### D5 · Flash'ın dört tipi de CSS'te

Gastro'da `.sa-flash.danger` için **kural yok**; hata şeridi altı satırlık inline
stil olarak **en az beş blade'de** kopyalanmış. Fit'te dördü de CSS'te:
`.is-ok` · `.is-error` · `.is-warn` · `.is-note`.

### D6 · Form sayfası ayrı dosyadır, gömülü kart değil

**Ölçüm** (`fit-yonetilmeyenler.md` D bölümü): 21 ekranın 6'sında "Yeni …"
düğmesi vardı, 5'i gerçek form açıyordu; formlar **9–14 alan** taşıyordu.
Gastro'nun aynı formu (tarif) **1430 satır**.

**Karar:** Gastro'nun kanonu — create ve edit **aynı dosya**
(`form.blade.php` deseni), liste ekranından ayrı. Gömülü kartlar söküldü;
iki yazma yüzeyi bırakmak bu depoda üç kez temizlenen "aynı soruya iki cevap"
kusurudur.

### D7 · İl listesi modüle çıkarıldı

**Ölçüm:** Türkiye'nin 81 ili hiçbir veri modülünde değildi —
`odemelerim-v1.html`in fatura adresi alanına `<option>` olarak gömülüydü.
Panelin il alanı için ikinci bir elle-yazılmış kopya üretmek yerine üreteçle
**çıkarıldı**: `tools/il-veri-uret.mjs` → `assets/js/fit-il-veri.js`.
**Public sayfa değişmedi.** İlçe listesi (973 kayıt) hâlâ yok; alan serbest
metin kalıyor ve ekran bunu söylüyor (kuyruk kalemi 2).

### D8 · Paket yönetimi Gastro'nun ÜSTÜNE inşa

**Ölçüm** (`para-abonelik-menu-ayarlar.md` §1.3): Gastro'nun plan⇄özellik
yüzeyi **7 sabit boolean**; özellik ekleme/çıkarma yüzeyi, `features` tablosu,
karşılaştırma tablosu yönetimi ve plan **CREATE/DELETE** yok. Yani Beyar'ın
1. maddesi Gastro'da da eksik.

**Karar:** Gastro'nun form ve liste **dilini** kullan, yüzeyi **genişlet** —
kademe CRUD · grup CRUD · modül CRUD · kapsam metni sözlüğü · karşılaştırma
tablosu yönetimi. K14 "Fit'in hesap yüzeyinin TAMAMI doğru kurguyla" diyor;
"Gastro'da da yok" bir gerekçe değil, bir ölçümdür.

### D9 · Kabuğun menü verisi salt-okuma ucuyla açıldı

**Ölçüm (B5 ajanı, doğrulandı):** `fit-shell.js` tek IIFE; `NAV` · `BOTTOM` ·
`ACCOUNT` · `FOOTER_COLS` · `FOOTER_CORP` · `FOOTER_LEGAL` · `PLAN_TABS` ·
`PLAN_EXTRA` · `DESTEK_TABS` · `RAIL` hepsi içeride `var` ile tanımlı. Dışa açık
**on ucun hiçbiri** menü verisi vermiyordu. Bu yüzden `admin-menu-v1.html`
**kendi 46 satırlık kopyasını** tutuyordu ve dosyanın kendi notu bunu borç
olarak işaretliyordu (C-10); gerçek menü on dizide **73 kalem**.

**Karar:** `FIT_SHELL.menu()` — dizilerin kendisi değil, **derin kopya döndüren
bir fonksiyon**.

**Gerekçe:** dizileri `window`a asmak 60 public sayfada kabuğun **canlı**
verisini yazılabilir kılardı; bir sayfa scripti kalemi değiştirse header'ı
sessizce bozardı. Fonksiyon çağrılmadıkça maliyet sıfır, çağrıldığında panel
okur ve kabuk korunur.

**⚠ Ters tırnak yasağı uygulandı** (`docs/lessons.md` §30): blokta hiç backtick
yok, yorumda bile. `node --check` **yeterli değil** — kırık bir template literal
rastlantıyla geçerli JS üretebiliyor; tarayıcıda `pageerror` sayıldı:
`kabuk-r18-nobet.mjs` → **98/98 sayfa · konsol 0 · taşma 0 · footer basıldı**.
