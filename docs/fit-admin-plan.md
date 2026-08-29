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
| Kalem | | Ekranın işi | Dosya |
|---|---|---|---|
| Üyeler ve Yetki | O | Üye listesi, rol, durum, kademe; tek üye detayı | `admin-uyeler-v1.html` |
| Antrenörler | F | Başvuru kuyruğu + onaylı antrenörler; belge doğrulama | `admin-antrenorler-v1.html` |
| Hizmetler ve Satışlar | F | Antrenör hizmet paketleri, satın alımlar, iade talepleri | `admin-hizmetler-v1.html` |
| Kazançlar ve Ödemeler | O | Komisyon, ay sonu ödeme listesi, alt sınır altı bakiyeler | `admin-odemeler-v1.html` |
| Destek Talepleri | O | Dört durumlu kuyruk (K8 kanonu), atama, yanıt | `admin-destek-v1.html` |
| Moderasyon | O | Yorum ve içerik bildirimi kuyruğu | `admin-moderasyon-v1.html` |
| Raporlar | O | Genel · içerik · finansal · moderasyon | `admin-raporlar-v1.html` |

### YAPILANDIRMA
| Kalem | | Ekranın işi | Dosya |
|---|---|---|---|
| Rozetler ve Kademeler | O | Rozet kataloğu, puan değerleri, 8 kademe eşiği (puan + aktif gün) | `admin-rozetler-v1.html` |
| Paketler ve Özellikler | F | Kademe⇄özellik matrisi (`fit-paket.js`), fiyat alanları | `admin-paketler-v1.html` |
| Menü ve Navigasyon | O | Header, footer, hesap menüsü kalemleri | `admin-menu-v1.html` |
| Sponsorluk ve Reklam | O | Reklam alanları, kampanya, kreatif | `admin-reklam-v1.html` |
| Bildirim Şablonları | O | E-posta ve uygulama içi bildirim metinleri | `admin-bildirim-v1.html` |
| Ayarlar | O | Marka ayarları, para parametreleri (K13), sağlık uyarı metni | `admin-ayarlar-v1.html` |
| Log Yönetimi | O | Yönetici işlem kaydı | `admin-log-v1.html` |

**Toplam: 1 + 6 + 7 + 7 = 21 ekran.**
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

## 5 · Kabuk

`assets/css/fit-admin.css` + `assets/js/fit-admin.js` — **sayfa kabuğu tek
kaynak**, tıpkı `fit-shell` gibi. Sayfa yalnız `<div id="fitAdminTop">` yazar ve
kendi içeriğini basar.

| Parça | Ölçü | Kaynak |
|---|---|---|
| Sidebar genişliği | `276px` | Gastro 340px ölçüldü; Fit'in `--wrap`ı 1240 ve tablo kolonları daha dar — 340 gövdeyi 900'ün altına düşürüyordu. **Karar ve gerekçe §7'de.** |
| Üst çubuk yüksekliği | `64px` | yeni · kite eklendi |
| Zemin | `--bg` `#f9f9f9` gövde · `--paper` sidebar | kit §1 |
| Kart | `.pnl-card` (16px yarıçap, `--sh-sm`) | kit §2 |
| Tipografi | kit §3 · yeni boyut üretilmez | kit §3 |
| Düğme | `.btn-primary` · `.btn-ghost` · `.btn-line` | kit §4 |
| Durum rozeti | `.fp-badge` `.ok/.wait/.off/.stop` | kit §5 |
| Sekme | `.fit-tabs` panel kipi | kit §6 |
| Form | `.fk-*` (R16'da kabuğa taşındı) | kit §7 |
| Süzgeç | `.ff` bileşeni + `FIT_SHELL.filtreKur()` | kabuk |
| Boş durum | `.fpx-bos` dört parça | kit §9 |

**Yeni kalem (kite eklenecek, §13):** sidebar · üst çubuk · veri tablosu
(`.adm-table`) · sayfalama · toplu eylem çubuğu. Beşi de admin'e özgüdür ve
public yüzeyde karşılığı yoktur.

---

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

1. **Sidebar 276px, Gastro'nun 340'ı değil.** Gastro'nun gövdesi geniş kartlar
   basıyor; Fit'in admin ekranlarının çoğu K1 (tablo). 1440'ta 340px sidebar
   gövdeye 1100 − dolgu ≈ 1040 bırakıyor, ama Fit'in `--wrap`ı zaten 1240 ve
   tablo 7 kolona kadar çıkıyor. 276 seçildi çünkü kalan gövde `--wrap`ın
   içinde kalıyor ve kolonlar sıkışmıyor. **Ölçüm kapısı:** 1440'ta en geniş
   tablo yatay kaydırma üretmemeli.
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

**Planlar · Creator Planları · Abonelikler · Faturalar · Kuponlar** — K6 gereği
Fit'te abonelik yoktur; üye üreticiden hizmet satın alır. Karşılığı
**Hizmetler ve Satışlar**tır. **Medya Kuyruğu** ve **Geri Bildirim** bu turda
kapsam dışı: Fit'te ikisinin de arkasında bir yüzey yok, menüye koymak boş ekran
vaat etmek olurdu.

### Gastro'dan ALINAN iki yetenek

| Yetenek | Gastro'daki karşılığı | Fit'te |
|---|---|---|
| **Yönetimde arama** | *"Kullanıcı, içerik ara…"* | `.t-ara` — **21 ekranın kendisini** arar. Sunucu olmadığı için içerik aranamaz; yer tutucu "Ekran ara…" der ve tam olarak onu yapar. Klavye: ↑↓ gezinir, Enter açar, Esc kapatır |
| **Menüyü daralt** | *"Menüyü daralt/genişlet"* | `.adm-daralt` — 276px → **74px**, tercih `localStorage`da durur. Daraltılmışken ad `title`/`aria-label` olarak kalır, bilgi kaybolmaz. Çekmece kipinde (≤1100px) devre dışı |

