envanter v1.1 · 2026-08-25 · şerit: FIT · kaynak sözleşme sürümü: `sozlesme v2.1`
(`md5 ca7704278e31cfc72e92e820f9638ec3` — ölçüm anında doğrulandı)

# FIT ŞERİDİ — EKRAN ENVANTERİ

**Ne bu:** Fit deposunun **67 statik HTML**'inden hangilerinin hesap ailesine
ait olduğu, her hesap ekranının bugünkü hâli, diğer üç markada olup Fit'te
karşılığı olmayan hesap yüzeyleri ve maketi bitirmek için kalan iş.

🔴 **v1 SALT ÖLÇÜMDÜ.** v1.1'de iki satır **düzeltildikten sonra** güncellendi:
`F-A1` (paket editörü çok pakete açıldı) ve `F-A2` ("Randevu Al" artık randevu
alıyor). Değişen satırlar aşağıda **v1.1** damgasıyla işaretli; ölçümün geri
kalanına dokunulmadı.

**Ölçüm dili (yalnız bu üçü):** `TAMAM` · `EKSİK` · `HİÇ YOK`.
`EKSİK` yazan her satırda **neyin** eksik olduğu yazılıdır.
**Kanıt:** `dosya:satır`. Ölçemediğime *"ölçemedim, sebebi şu"* yazıldı.

⚠ **Fit'te backend yoktur ve bu turda yazılmayacaktır.** Bu belgede hiçbir yerde
*"şu backend gerekir"* denmez; ölçüm **maket düzeyindedir** — eksik olan şey bir
**ekran, bölüm veya alan**dır.

⚠ **U2 · Sözleşmede `🔴 AÇIK` olan dört nokta** (gizlilik görünürlük ekseni ·
bildirim tercihi şekli · hesap durumu şekli · adres parametresi) bu belgede
**eksik sayılmamıştır**; açık oldukları yerinde belirtilmiştir.

---

## 0 · KABA HATLAR

| Ölçüm | Sayı |
|---|---:|
| Depodaki toplam HTML | **67** |
| Hesap ailesi — **çekirdek halka** | **15** |
| Hesap ailesi — **bitişik halka** (kabuk hesap menüsünden erişilen kişisel veri ekranları) | **5** |
| **Hesap ailesi toplam** | **20** |
| Hesap ailesi **dışında** kalan | **47** |
| Ölçülen hesap **ekranı** (`hesabim`ın 10 çapası + 19 dosya) | **29** |
| `TAMAM` | **15** (v1'de 14 — F-A1 sonrası `profil-v1` TAMAM'a geçti) |
| `EKSİK` | **14** (v1'de 15) |
| `HİÇ YOK` (var olması beklenip hiç çizilmemiş ekran) | **9** (değişmedi) |

---

## 1 · HESAP AİLESİ — 20 DOSYA

### 1.0 · Ayrımın kanıtı (tahmin değil)

Üç kanıt kaynağı kullanıldı:

1. **`hesabim-v1.html`in `#diger` köprü kartı** — sözleşmenin *"hesap ailesi"*
   tanımının Fit'teki karşılığı (`docs/sozlesme-olcum-fit.md §0`). Altı kalem,
   altısının da hedef dosyası diskte var (`hesabim-v1.html:1288-1338`).
2. **Kabuk hesap menüsü** — `assets/js/fit-shell.js`in `ACCOUNT` dizisi
   (`:466-491`), üç gruplu: *Günlük Takibim · Gelişimim · Profil ve Üyelik*.
   Üçüncü grup doğrudan hesap yönetimidir; ilk iki grup kişisel veri
   ekranlarıdır ve **bitişik halka** olarak ayrı sayıldı.
3. **`hesabim-v1.html`in kendi çıkış bağlantıları** — `#uyelik`ten
   `uyelik-faturalandirma-v1.html` ve `pro-v1.html`e (`:721-722`),
   `#profil`den `profil-v1.html`e (`:585`).

🔴 **Sınır kararı ve gerekçesi:** *hesap ailesi = üyenin kendi hesabını,
verisini, kimliğini ve üyeliğini YÖNETTİĞİ ekranlar.* Bu tanım gereği
`yasal-v1.html` ve `saglik-bilgilendirme-v1.html` **aile dışıdır** —
`hesabim`dan bağlantılıdırlar ama içerik sayfasıdırlar, yönetim yüzeyi değil.

### 1.1 · Çekirdek halka — 15 dosya

| # | Dosya | Satır | Neden hesap ailesi (kanıt) |
|---|---|---:|---|
| 1 | `hesabim-v1.html` | 1889 | Hesap kökü — 10 çapa · 56 form denetimi |
| 2 | `fit-planim-saglik-profil-v1.html` | 344 | `#diger` köprü 1 (`hesabim-v1.html:1289`) + kabuk `ACCOUNT` "Sağlık ve Hareket Profilim" |
| 3 | `fit-planim-veri-izin-v1.html` | 238 | `#diger` köprü 2 ve 4 (`:1296`, `:1310` `#indir`) — KVKK ekseni |
| 4 | `bagli-uygulamalar-v1.html` | 1087 | `#diger` köprü 3 (`:1303`) — F-Ö5 |
| 5 | `destek-talepleri-v1.html` | 794 | `#diger` köprü 5 (`:1317`) |
| 6 | `bildirimler-v1.html` | 735 | `#diger` köprü 6 (`:1324`) |
| 7 | `profil-v1.html` | 4198 | Herkese açık profil — `hesabim-v1.html:585` "profilim başkalarına nasıl görünüyor?"; own görümde "Profili Düzenle" → `hesabim?tab=profil` |
| 8 | `giris-v1.html` | 1068 | Kimlik kapısı — kabuk giriş katmanı + `FIT_LOGOUT` (`fit-shell.js:61`) |
| 9 | `uyelik-faturalandirma-v1.html` | 1915 | Kabuk `uyelikKalemi()` hedefi (`fit-shell.js:451,453`) + `hesabim#uyelik` "Paketi Değiştir" |
| 10 | `pro-v1.html` | 613 | Kabuk `uyelikKalemi()` ücretsiz dalı (`fit-shell.js:455`) + `hesabim#uyelik` "Paketleri Karşılaştır" |
| 11 | `pro-odeme-v1.html` | 597 | `pro-v1.html`in tek ödeme yolu (`?plan=t2`) |
| 12 | `destek-v1.html` | 408 | Kabuk `ACCOUNT` "Destek Merkezi" (`fit-shell.js:478`) |
| 13 | `destek-talebi-detay-v1.html` | 1023 | `destek-talepleri-v1.html`in satır hedefi |
| 14 | `rozetler-v1.html` | 608 | Rozet galerisi — sözleşme §1.8 kademe merdiveni |
| 15 | `fit-planim-rozetler-v1.html` | 377 | Kabuk `ACCOUNT` "Challenge'larım ve Rozetlerim" (`fit-shell.js:464`) |

### 1.2 · Bitişik halka — 5 dosya

Kabuk hesap menüsünün **ilk iki grubundan** gelirler (*Günlük Takibim ·
Gelişimim*). Hesap **menüsündedirler** ama hesap **ayarı** değil, kişisel
veri/ilerleme ekranıdırlar. Ayrı sayılmalarının sebebi budur.

| # | Dosya | Satır | Kabuk menü etiketi |
|---|---|---:|---|
| 16 | `enerji-defteri-v1.html` | 834 | Enerji Defterim |
| 17 | `fit-planim-gecmis-v1.html` | 886 | Aktivite Kayıtlarım |
| 18 | `fit-planim-kaydettiklerim-v1.html` | 598 | Kaydettiklerim |
| 19 | `fit-test-sonuclarim-v1.html` | 525 | Fit Test Sonuçlarım |
| 20 | `fit-planim-randevular-v1.html` | 515 | Antrenörüm |

### 1.2b · 🔴 KIRILIM — 20 mi 15 mi? Farkı yaratan beş kalem

**Beyar'ın sorusu:** *"20'nin içinde ne var, 15'te ne dışarıda kalıyor, farkı
yaratan 5 kalem ne?"* Bu bölüm **karar vermez**, seçimi mümkün kılar.

#### (a) Çekirdek 15 — her biri neden çekirdek

| # | Dosya | Neden çekirdek (tek satır) |
|---|---|---|
| 1 | `hesabim-v1.html` | Hesap kökünün kendisi; on çapanın tamamı burada |
| 2 | `fit-planim-saglik-profil-v1.html` | `#diger` köprü kartının 1. kalemi — sözleşmenin "hesap ailesi" tanımının içinde |
| 3 | `fit-planim-veri-izin-v1.html` | `#diger` köprü 2 ve 4; sözleşme §3.2'nin "verilerimi indir" yüzeyi burada |
| 4 | `bagli-uygulamalar-v1.html` | `#diger` köprü 3; üye verisinin dışarı akışını üye buradan kesiyor |
| 5 | `destek-talepleri-v1.html` | `#diger` köprü 5; sözleşme §3.2'nin "destek merkezi" yüzeyi |
| 6 | `bildirimler-v1.html` | `#diger` köprü 6; `#bildirim` çapasının tercihlerini tükettiği akış |
| 7 | `profil-v1.html` | Üyenin kimliğinin dışarıya görünen yüzü; `#profil` çapası bunu düzenliyor |
| 8 | `giris-v1.html` | Kimlik kapısı — hesap olmadan hesap ailesi başlamıyor |
| 9 | `uyelik-faturalandirma-v1.html` | Platform paketinin tam yüzeyi; `#uyelik`in "Paketi Değiştir" hedefi |
| 10 | `pro-v1.html` | Paket vitrini; `#uyelik`in "Paketleri Karşılaştır" hedefi |
| 11 | `pro-odeme-v1.html` | Platform paketinin tek ödeme yolu |
| 12 | `destek-v1.html` | Kabuk hesap menüsünün "Destek Merkezi" kalemi |
| 13 | `destek-talebi-detay-v1.html` | Talep listesinin satır hedefi; yazışma yüzeyi |
| 14 | `rozetler-v1.html` | Sözleşme §1.8'in kademe merdiveni yüzeyi |
| 15 | `fit-planim-rozetler-v1.html` | Kabuk hesap menüsünün "Challenge'larım ve Rozetlerim" kalemi |

**Çekirdek ölçütü:** dosya ya **hesap kökünün kendisidir**, ya **`#diger`
köprü kartında adı geçer**, ya **hesap kökünden çıkan bir yönetim
bağlantısının hedefidir**, ya da **sözleşmenin bir maddesinin (§1.8 · §3.2)
doğrudan karşılığıdır**.

#### (b) Bitişik 5 — neden dâhil, neden dışarıda

| # | Dosya | Kabuk menü grubu | **Neden aileye dâhil sayılabilir** | **Neden dışarıda kalabilir** |
|---|---|---|---|---|
| 16 | `enerji-defteri-v1.html` | *Günlük Takibim* | Hesap menüsünün ilk kalemi; üyenin kendi verisi, giriş olmadan anlamsız | Bir **modüldür**, hesap ayarı değil; kendi ana gezinme kalemi de var |
| 17 | `fit-planim-gecmis-v1.html` | *Günlük Takibim* | Üyenin kişisel kaydı; `fit-planim-veri-izin`den "Kaydı düzelt" buraya köprülüyor (`:107`) | Hesap kökünden yönetilmiyor; içerik/arşiv ekranı |
| 18 | `fit-planim-kaydettiklerim-v1.html` | *Günlük Takibim* | Gourmet'in "Kaydettiklerim" **hesap paneli**yle birebir aynı kavram | Fit'te hesap paneli değil, Planım rayının sekmesi |
| 19 | `fit-test-sonuclarim-v1.html` | *Gelişimim* | Kişisel ölçüm arşivi; hesap silmede "silinecek veriler" arasında sayılıyor | Bir modülün çıktı ekranı; hesap ayarıyla ilgisi yok |
| 20 | `fit-planim-randevular-v1.html` | *Gelişimim* | 🔴 **K4/P7-2'nin para ilişkisi burada yaşıyor** — `hesabim#uyelik` kutu 2 buraya köprülüyor ve randevu/mesaj yönetimi burada | Randevu **operasyonu**dur; para/paket yönetimi hesapta, burada değil |

#### (c) Beşinin ortak özelliği — "kişisel veri ekranı" yeterli bir ölçüt mü

🔴 **Yeterli DEĞİL. Beşi kendi arasında da ikiye ayrışıyor:**

| Alt küme | Dosyalar | Ayıran nitelik |
|---|---|---|
| **K1 · Saf modül çıktısı** | `enerji-defteri` · `fit-planim-gecmis` · `fit-test-sonuclarim` | Hesap kökünden **hiçbir bağlantı** almıyorlar; yalnız kabuk menüsünde görünüyorlar. Hesap ailesinden çıkarılırsa hesap yüzeyinde **hiçbir boşluk oluşmaz** |
| **K2 · Hesabın işaret ettiği ekranlar** | `fit-planim-kaydettiklerim` · `fit-planim-randevular` | ⚠ İkisi de hesap ailesinin İÇİNDEN bağlantı alıyor: `randevular`a `hesabim#uyelik:819` doğrudan köprülüyor ("Randevu ve mesajlaşma … Planım › Antrenörüm sekmesinde"), `kaydettiklerim` ise diğer üç markanın **hesap panelinde** duran bir kavramın Fit'teki karşılığı (Gourmet `/hesabim/kaydedilen-mekanlar`) |

**Ölçümün bildirdiği:** "kişisel veri ekranı" ölçütü beşini bir arada tutuyor
ama **K2'nin ikisi hesap ailesine K1'in üçünden çok daha yakın**. Üçüncü bir
seçenek matematiksel olarak vardır: **17** (çekirdek 15 + K2'nin ikisi).
🔴 Hangisinin seçileceği Beyar'ın kararıdır; ölçüm üç seçeneği de sayar.

#### (d) 15 seçilirse envanterin hangi sayıları değişir

| Sayı | 20 ile | 15 ile | Düşenler |
|---|---:|---:|---|
| Hesap ailesi dosya | 20 | **15** | 5 dosya |
| Hesap ailesi dışı | 47 | **52** | +5 |
| Ölçülen **ekran** (§2) | 29 | **24** | §2.2'nin 25 · 26 · 27 · 28 · 29 numaralı satırları |
| `TAMAM` | 15 | **11** | 4 düşer (`enerji-defteri` · `fit-planim-gecmis` · `fit-planim-kaydettiklerim` · `fit-test-sonuclarim`) |
| `EKSİK` | 14 | **13** | 1 düşer (`fit-planim-randevular`) |
| §3.2 satır sayısı | 18 | **18** | **değişmez** — hiçbiri bu beş dosyaya dayanmıyor |
| §4 kalan iş kalemi | 10 | **10** | **değişmez** — F-A2 sonrası eski #10 kapandığı için bu beş dosyaya bağlı kalem kalmadı |
| §0'daki `HİÇ YOK` | 9 | **9** | **değişmez** — dokuzunun hiçbiri bu beş dosyada değil |

⚠ **17 seçilirse:** ekran 26 · `TAMAM` 12 · `EKSİK` 14 · §4 kalemi 10 ·
§3.2 ve `HİÇ YOK` yine değişmez.
⚠ Bu tablonun sayıları **v1.1'e göredir** (F-A1/F-A2 düzeltmelerinden sonra).

### 1.3 · Hesap ailesi dışında kalan 47 dosya — kategori özeti

Tek tek sayılmadı (lead'in isteği); kategori ve sayı verildi.

| Kategori | Adet | Örnek |
|---|---:|---|
| Egzersiz ve hareket | **13** | `egzersiz-kutuphane` · `anatomi` · `hareket-rehberi` + 7 hareket alt sayfası · `antrenman-olusturucu` |
| Program | **5** | `programlar-merkezi` · `program-liste` · `program-detay` · `programini-bul` · `fit-planim-programim` |
| Enerji ve ölçüm | **5** | `enerji-defteri-dengele` · `-haftalik` · `-su` · `enerji-ihtiyaci` · `aktivite-gunlugu` |
| Kurumsal · yasal · pazarlama | **6** | `hakkimizda` · `iletisim` · `sss` · `yasal` · `saglik-bilgilendirme` · `reklam-ver` |
| Fit testleri | **3** | `fit-testleri` · `fit-testi-detay` · `fit-testi-sonuc` |
| Antrenör dizini | **3** | `antrenorler` · `antrenor-detay` · `antrenor-ol` |
| Giriş ve keşif | **3** | `index` · `dadafit-hub` · `arama-fit` |
| Challenge | **2** | `challenge-merkezi` · `challenge` |
| Video | **2** | `video-seanslari` · `video-seans-detay` |
| Sözlük | **2** | `sozluk` · `sozluk-detay` |
| Plan ve ilerleme | **2** | `fit-planim` · `fit-planim-ilerleme` |
| Ekosistem köprüsü | **1** | `dadafit-kopru` |
| **Toplam** | **47** | |

---

## 2 · HER HESAP EKRANI — TAMAM · EKSİK · HİÇ YOK

### 2.1 · `hesabim-v1.html`in on çapası

| # | Çapa | Durum | Eksik olan **ne** | Kanıt |
|---|---|---|---|---|
| 1 | `#profil` | **EKSİK** | **Fotoğraf yükleme yüzeyi yok.** Sayfada `<input type="file">` **0 adet**; `[data-photo-edit]` düğmeleri yalnız durum metni basıp 4 saniye sonra varsayılana dönüyor. Kırpma/önizleme ekranı hiç çizilmemiş. | `hesabim-v1.html:1810-1823`; `grep -c 'type="file"' → 0` |
| 2 | `#bildirim` | **TAMAM** | 7×2 matris + hatırlatma saati + sessiz saatler + matris dışı güvenlik satırı. ⚠ Tercihin **saklama şekli** sözleşme §1.4'te 🔴 AÇIK — eksik sayılmadı. | `:606-681` |
| 3 | `#uyelik` | **EKSİK** | **(a)** Ücretsiz kademe görünümü yok — maket tek persona (Pro) çiziyor; plansız üyenin bu çapada ne göreceği hiç çizilmemiş. **(b)** ✅ **v1.1'de DÜZELTİLDİ (F-A2):** "Randevu Al" artık `antrenor-detay-v1.html?slug=…&randevu=1&paket=…` adresine gidiyor, modal açılışta geliyor ve satırın hizmeti önceden seçili oluyor. Ayrıca iki satırın slug'ı gerçek antrenör kayıtlarına çekildi (`mert-ekinci`→`mert-ozkan`, `deniz-arda`→`deniz-kaya`) — eskiden ikisi de sessizce Selin Aksoy'a düşüyordu. **(a) hâlâ eksik.** | `:696-877`; `:838`, `:858` |
| 4 | `#odeme` | **EKSİK** | **Kart ekleme yüzeyi HİÇ YOK.** "Ödeme Yöntemi Ekle" düğmesinin işleyicisi yok, form/modal da yok. Aynı şekilde "Kaldır" ve "Varsayılan Yap" düğmeleri tepkisiz. | `:966`; sayfa JS bloğu `:1686-1827` içinde bu düğmelere bağlanan dinleyici yok |
| 5 | `#fatura` | **EKSİK** | **Fatura detay ekranı HİÇ YOK.** Liste var, PDF düğmesi var ama hedefi yok: *"Bu prototipte indirilebilir bir fatura belgesi üretilmez"*. Gastro'da `/hesabim/faturalar/{invoice}` ve `/pdf`, Diet'te `…/fatura/{invoice}` ve `/yazdir` var. | `:1032`; karş. `sozlesme-olcum-gastro.md §3.2`, `sozlesme-olcum-diet.md §3.2` |
| 6 | `#guvenlik` | **EKSİK** | **2FA kurulum akışı HİÇ YOK** — anahtar var, kurulum ekranı (yöntem seçimi · kod doğrulama · kurtarma kodlarının gösterimi) çizilmemiş. "Kodları Göster" · "Yenile" · Google/Apple "Bağla" · "Oturumu Kapat" · "Diğer Tüm Oturumları Kapat" düğmelerinin **hiçbirinin** işleyicisi yok (8 `uys-manage` düğmesi + 1 `btn-ghost`). | `:1106`, `:1116`, `:1121`, `:1142`, `:1147`, `:1152` |
| 7 | `#dil` | **TAMAM** | Ölçü birimi beşlisi + `dlGizle` + haftanın ilk günü + tarih biçimi + dil/bölge/saat dilimi. | `:1163-1265` |
| 8 | `#diger` | **TAMAM** | 6 köprü, altısının da hedef dosyası diskte var. | `:1288-1338` |
| 9 | `#dondur` | **TAMAM** | Beş adım yerinde: uyarı kutusu → maddeler → süre seçimi (5 seçenek) → onay kutusu → kapalı başlayan düğme. | `:1355-1407` |
| 10 | `#sil` | **TAMAM** | Onay kutusu + Türkçe ifade kapısı (`fold()` i/İ/ı/I katlaması) + ayrılma nedeni anketi. | `:1417-1479` |

**Ara toplam: 5 TAMAM · 5 EKSİK.**

### 2.2 · Diğer 19 hesap ekranı

| # | Dosya | Durum | Eksik olan **ne** | Kanıt |
|---|---|---|---|---|
| 11 | `profil-v1.html` | ✅ **TAMAM** (v1.1) | v1'de **EKSİK**ti: own görümde tek editör, public'te iki paket. **F-A1'de düzeltildi** — her public paketin bir editör kartı var (`data-hz-paket`), tekrarlayıcılar ID yerine `data-hz-feats`/`data-hz-addfeat` ile ve olay delegasyonuyla bağlı, "Yeni Paket Ekle" boş kart üretiyor, bedel birimi (`ay`/`seans`/`paket`) alan oldu. ⚠ "Paketi Kaldır" **bilerek yok** — aktif danışanlı paketin silinmesi ürün kararıdır. | `profil-v1.html:2365-2437` (2 editör) ↔ `:2265-2306` (2 public paket) |
| 12 | `giris-v1.html` | **EKSİK** | Üç ekran hiç çizilmemiş: **(a)** sıfırlama bağlantısından gelinen *"yeni şifreni belirle"* ekranı, **(b)** *"e-postanı doğrula"* ekranı, **(c)** girişte **2FA kod girme** ekranı. Google/Apple düğmeleri var (2 adet) ama tıklandığında hiçbir akış açılmıyor. | `giris-v1.html:731-754` (yalnız istek formu var); repo geneli grep: "yeni şifreni belirle" 0 · "e-postanı doğrula" 0 · 2FA kod ekranı 0 |
| 13 | `uyelik-faturalandirma-v1.html` | **EKSİK** | **Fatura detay ve yazdırma ekranı HİÇ YOK** (`#faturalar` listesi var, tekil belge yüzeyi yok). ⚠ `#yardim` bölümü sekme rayında yok (7 `uf-sec`, 6 ray kalemi) — bu **bilinçli**, sayfa sonu yardım bloğudur, eksik sayılmadı. | `:872-953`; `:1079` |
| 14 | `pro-v1.html` | **TAMAM** | Üç kart (Ücretsiz · Pro · Pro Max AI) + karşılaştırma tablosu + nasıl çalışır + SSS + CTA. | `:277-360`, `:366-406` |
| 15 | `pro-odeme-v1.html` | **TAMAM** | Plan özeti + dönem + canlı kart önizlemesi + onay + başarı ekranı. | `:333-345`, `:506-560` |
| 16 | `bildirimler-v1.html` | **TAMAM** | 5 tip süzgeci + gün grupları + tekil "okundu işaretle" + "tümünü okundu işaretle" + boş durum (`?empty=1`). | `:239-244`, `:674`, `:724` |
| 17 | `bagli-uygulamalar-v1.html` | **TAMAM** | 4 bağlantı + üç yönlü veri sözleşmesi (gelen/giden/hiçbir koşulda gitmeyen) + sıklık + bağlantısız boş durum. | `:239-259`, `:319-635`, `:731` |
| 18 | `fit-planim-veri-izin-v1.html` | **EKSİK** | Üç eylemin hedef ekranı yok: **"Listele"** (tutulan verileri gösteren ekran), **"İndir"** (indirme hazırlanıyor/hazır durumu), **"Görüntüle"** (işlem kaydı ekranı). Üçü de `data-lg-gate` taşıyor; giriş yapılmış hâlde kapı erken dönüyor ve **hiçbir şey açılmıyor** — sayfa JS'inde bu düğmelere bağlı dinleyici yok. | `:101`, `:104`, `:124`; kapı: `fit-shell.js:1753-1760`; sayfa JS `:169-215` yalnız anahtar boyuyor |
| 19 | `fit-planim-saglik-profil-v1.html` | **EKSİK** | **Düzenleme yüzeyi HİÇ YOK.** Sayfada `<input>/<select>/<textarea>` **0 adet**; 9 adet "Değiştir"/"Ekle" düğmesinin tamamı `data-lg-gate` ve giriş yapılmış hâlde hiçbir şey açmıyor. Kart *"Düzenlenebilir"* rozeti basıyor ama düzenleme ekranı çizilmemiş. | `:65` (rozet), `:70-116` (9 düğme); sayfa JS `:166-343` yalnız özet basıyor |
| 20 | `destek-v1.html` | **TAMAM** | ✅ **Dalga 3'te kanona uyarlandı.** 🔴 Adı **Destek Merkezi** (Beyar, 2026-08-26 — C3'ün Fit uygulamasını değiştirdi; "Çözüm Merkezi" adı `sss-v1.html`e geçti); altı konu kartı `#konu-…` çapası taşıyor ve çapayla gelince kart açılıyor; açık talepler paneli kanonun `acik` durumunu basıyor. Fit'te bu sayfa kanonun **E1 + E5** ekranlarını birlikte taşır. | `:161` (h1), `#konu-*` çapaları, `capadanAc()` |
| 21 | `destek-talepleri-v1.html` | **TAMAM** | ✅ **Dalga 3.** Dört durum kuruldu (`acik` 3 · `yanit-bekleyen` 3 · `cozulen` 2 · `kapatilan` 4 = **12 talep**) · **sayfalandırma var** (kabuk `FIT_PAGI`, 10/sayfa, Gastro ölçüsü) · talep numarası `DF-2026-<6 karakter>` · **ek dosya alanı** (`ek`, tek dosya). `tumu` bir görünüm seçimidir, hiçbir kartın durumu değildir. Fit'te **E3 (yeni talep) ayrı adres değil**, bu sayfanın `#yeni-talep` bölümü. | `#tkFilter`, `#tkPagi`, `#tkEk` |
| 22 | `destek-talebi-detay-v1.html` | **TAMAM** | ✅ **Dalga 3.** **"Yeniden aç" kuruldu** (D4 · Beyar onayladı) — geçiş matrisi `GECIS` sabitinde tek yerde, düğme görünürlüğü oradan türer. `acceptsReply()` karşılığı: kapatılan talepte yanıt kutusu yerine **gerekçe + iki çıkış** basılıyor. Yanıt yazmanın durum yan etkisi (kanon §3.1) kurulu. Y8.5'in iki bloğu ("Taleplerin" · "Beklerken") korundu ve dört duruma uyarlandı. ⚠ Durum hâlâ **kalıcı değil** — maket, backend K14 gereği sonradır. | `GECIS`, `#tkReopenBtn`, `#tkClosedNote` |
| 23 | `rozetler-v1.html` | **EKSİK** | Galeri **tamamen statik**; sayfanın kendi notu: *"Bu ekrandaki sayılar örnek bir hesaba aittir; gerçek kullanıcı verisi değildir"*. 8 aile · 42 rozet · 8 basamak çizili, veri kaynağına bağlı değil. 🔵 **Dalga 4'ün konusu — bu turda yapılmaz.** | `rozetler-v1.html:389` |
| 24 | `fit-planim-rozetler-v1.html` | **EKSİK** | **Metin hatası:** galeriye giden bağlantı *"DadaGastro rozetleri"* diyor, hedef Fit'in kendi galerisi. Rozet tarafı markup'a yazılı 3 karttan ibaret; challenge tarafı `FIT_PLAN`den gerçekten okuyor. 🔵 **Dalga 4'ün konusu.** | `fit-planim-rozetler-v1.html:112` |
| 25 | `enerji-defteri-v1.html` | **TAMAM** | Bitişik halka. Gerçekten çalışıyor (11 dinleyici, hesaplıyor). | — |
| 26 | `fit-planim-gecmis-v1.html` | **TAMAM** | Bitişik halka. `FIT_PLAN`den okuyor (12 çağrı), 4 boş durum kolu. | — |
| 27 | `fit-planim-kaydettiklerim-v1.html` | **TAMAM** | Bitişik halka. `FIT_PLAN`den okuyor (6 çağrı), boş durumu var. | — |
| 28 | `fit-test-sonuclarim-v1.html` | **TAMAM** | Bitişik halka. Arşiv + kategori kapsamı + boş durum. | — |
| 29 | `fit-planim-randevular-v1.html` | **EKSİK** (daraldı) | ✅ **v1.1 (F-A2):** randevu alma yolu açıldı — özet şeridi ve "Yaklaşan randevular" kartı artık `antrenor-detay-v1.html?slug=selin-aksoy&randevu=1` adresine gidiyor; modal **kopyalanmadı**, tek kaynağında kaldı. Ayrıca ölçülen bir kusur düzeltildi: `acts` dizesi **koşulsuzdu** ve randevusu olmayan kullanıcıya da aynı düğmeleri basıyordu; artık `y` üçlüsüyle dallanıyor (randevusu varsa modal, yoksa dizin). **Kalan eksik:** 11 `data-lg-gate` düğmesinin (randevu değiştir/iptal, mesaj yaz, dosya gönder, not oku, video izle) hedef ekranı hâlâ yok. | `:48`, `:133`, `:477-483` |

**Ara toplam: 10 TAMAM · 9 EKSİK** (v1: 9 / 10 — `profil-v1` TAMAM'a geçti).

### 2.3 · Toplam

| | Adet |
|---|---:|
| `TAMAM` | **15** (v1: 14) |
| `EKSİK` | **14** (v1: 15) |
| **Ölçülen ekran** | **29** |

⚠ **`EKSİK`lerin 5'i başka dalgaların konusudur** ve bu turda yapılmaz:
`destek-talepleri` · `destek-talebi-detay` (**Dalga 3**) · `rozetler` ·
`fit-planim-rozetler` (**Dalga 4**). Beşincisi `#uyelik`in ücretsiz kademe
görünümüdür ve **Dalga 6**'nın (Para) paket yüzeyine bitişiktir.

---

## 3 · DİĞER ÜÇ MARKADA OLUP FİT'TE KARŞILIĞI OLMAYAN HESAP EKRANLARI

🔴 **Bu bölüm karar vermez.** Her satır: *"şu markada var, Fit'te yok, kavram
olarak şuraya oturur / oturmaz"* der. **"Şu eklensin" cümlesi yoktur.**

**Kaynaklar (yeniden ölçüm yapılmadı, hazır ölçümlerden çıkarıldı):**
`dadagastro-profil/docs/sozlesme-olcum-gastro.md §3.1–§3.2` ·
`dadadiet/docs/sozlesme-olcum-diet.md §3.1–§3.2` ·
`dadagourmet/docs/sozlesme-olcum-gourmet.md §3.2` ·
`docs/hesap-sozlesmesi.md §3.2`.

### 3.1 · Sözleşme §3.2'nin *"dört markada bulunur"* dediği yedi yüzey

| Yüzey | Fit'teki karşılığı | Durum |
|---|---|---|
| Destek merkezi | `destek-v1.html` | ✅ var |
| Verilerimi indir | `fit-planim-veri-izin-v1.html#indir` | ⚠ bölüm var, **indirme ekranı yok** (§2.2/18) |
| Şifre değiştirme | `hesabim-v1.html#guvenlik` kart A | ✅ var |
| **2FA kurulumu** | — | 🔴 **HİÇ YOK** — yalnız açık/kapalı anahtarı var, kurulum ekranı çizilmemiş |
| Açık oturumlar | `hesabim-v1.html#guvenlik` kart C | ⚠ liste var, **kapatma eylemi tepkisiz** |
| Hesap dondurma | `hesabim-v1.html#dondur` | ✅ var (beş adım Fit kanonu) |
| Hesap silme | `hesabim-v1.html#sil` | ✅ var |

**Yedi yüzeyin 4'ü tam · 2'si yarım · 1'i hiç yok.**

### 3.2 · Diğer markalarda olup Fit'te olmayan ekranlar

| # | Ekran | Hangi markalarda var | Fit'te neden yok | Fit'e uyar mı |
|---|---|---|---|---|
| Y1 | **Fatura detay + PDF/yazdır** | Gastro (`/hesabim/faturalar/{invoice}` · `/pdf`) · Diet (`…/fatura/{invoice}` · `/yazdir`) | **Atlanmış.** Fit'te liste var, tekil belge yüzeyi çizilmemiş; PDF düğmesi hedefsiz | **Oturur.** Fit'te fatura kalıbı zaten ölçülü (`DFT-YYYY-NNNNNN`) ve iki kutunun (platform + antrenör paketi) tahsilatı faturalanıyor |
| Y2 | **2FA kurulum akışı** | Gastro ✅ · Diet ✅ (üye yüzeyinde açık) · Gourmet 🔴 admin kapısı arkasında | **Atlanmış.** Fit'te anahtar var, akış yok | **Oturur.** Sözleşme §1.2 ORTAK HÜKÜM: *"Üyeye açık olacak"* |
| Y3 | **Yeni şifre belirleme** (sıfırlama bağlantısından) | Gastro ✅ · Diet ✅ (`PUT /hesabim/sifre` + sıfırlama akışı) | **Atlanmış.** Fit'te yalnız istek formu var | **Oturur.** Sıfırlama isteği zaten çizili, zincirin ikinci halkası eksik |
| Y4 | **Kart ekleme yüzeyi** | 🔴 **Hiçbirinde tam yok** — Gastro'da uç yok (blade'de `disabled title="Yakında"`), Diet'te `DietPaymentMethodPolicy::create() → false` | Fit'te düğme var, hedefi yok — **üç markanın ortak boşluğu** | ⚠ Sözleşme §1.5 bu iki dili **tekleştirmek** istiyor: *"yok olan yetenek Policy'de `false` döner, blade'de 'Yakında' yazmaz"*. Fit'in bugünkü hâli (tepkisiz düğme) üçüncü bir dildir |
| Y5 | **Çözüm merkezi** (üye + halka açık, iki ayrı adres) | Diet (`/hesabim/destek/cozum-merkezi` · `/cozum-merkezi`) | ✅ **KAPANDI.** İki ad iki AYRI sayfaya dağıldı: `destek-v1.html` = **Destek Merkezi** (destek yüzeyi · hesap menüsünün hedefi) · `sss-v1.html` = **Çözüm Merkezi** (SSS tarafı, halka açık). Beyar kararı, 2026-08-26 | **Oturdu.** Kanon E5 "içerik ÜRETMEZ, var olan kayıtlara bağlar" diyor; Fit'in altı konusu da var olan sayfalara bağlanıyor |
| Y6 | **Talep sayfalandırması** | Gastro (`paginate(10)->withQueryString()`) | ✅ **Dalga 3'te KAPANDI.** Kabuğun `FIT_PAGI` motoru, sayfa boyu **10** (Gastro ölçüsü). `withQueryString()`in maket karşılığı: sayfa değişimi adrese dokunmaz, `?durum=` korunur | **Oturdu.** ⚠ Kanon §9/D5: Diet'te `paginate` YOKTUR, kaynak Gastro'dur |
| Y7 | **"Kayıtlı Kartlarım" ayrı sekme** | Gastro (`?tab=kartlarim` + `kartlar` alias) | Fit'te kart listesi **var ama ayrı sekme değil** — `#odeme` içinde bir alt bölüm | **Oturmaz — bilinçli.** Fit'in on çapası zaten dolu; kartı ödeme geçmişiyle aynı çapada tutmak Fit'in kendi IA'sıdır. Sözleşme sekme **sayısını** bağlamıyor |
| Y8 | **"Abonelikler" sekmesi** (üyesi olunan üretici planları) | Gastro (`?tab=abonelikler`) | 🔴 **Bilinçli YOK — P7.** Fit'te üyeden üyeye abonelik yoktur | **Oturmaz.** Kavramın Fit'teki karşılığı *antrenör hizmet paketi*dir ve `hesabim#uyelik` kutu 2'de kuruludur |
| Y9 | **"Üyelik" sekmesi** (kendi üretici planını yönetme) | Gastro (`?tab=uyelik` + `/uretici/plan`) | 🔴 **Bilinçli YOK — P7.** Dalga 2'de söküldü | **Oturmaz** bu hâliyle; Fit'teki karşılığı `profil-v1.html`in antrenör "Hizmetler" sekmesindeki paket editörüdür |
| Y10 | **Üretici ödeme ekranı** (üye → üretici) | Gastro (`/uretici/{plan}/odeme`) | 🔴 **Bilinçli YOK — P7** | **Oturmaz.** Fit'te hizmet bedeli antrenöre ödenir; ödeme yüzeyi Dalga 6'nın konusu |
| Y11 | **İçeriklerimi indir** | Gastro (`/hesabim/iceriklerim`) | Fit'te kavram ölçülmedi | ⚠ **Ölçemedim:** Fit'te "üyenin ürettiği içerik" (paylaşılan hareket/form ipucu) `profil-v1.html`de var ama toplu indirme kavramı hiçbir kararda geçmiyor. Ürün kararı gerektirir |
| Y12 | **Listelerim** (kullanıcı koleksiyonları, ayrı panel) | Gourmet (`/hesabim/listelerim`) | Fit'te koleksiyon **var ama ayrı panel değil** — `profil-v1.html` "Kaydedilenler" sekmesinde çip süzgeci olarak | **Oturmaz — bilinçli.** Fit'in kaydetme ekseni `fit-planim-kaydettiklerim-v1.html`de toplanmış |
| Y13 | **Keşiflerim · Rotalarım · Ziyaret Ettiklerim · Değerlendirmelerim · Rezervasyonlarım** (5 panel) | Gourmet | Fit'te mekân ekseni yok | **Oturmaz.** Gourmet'in mekân/rezervasyon eksenidir; Fit'in ekseni hareket ve seanstır |
| Y14 | **Alışveriş Listem · Haftalık Menü · Malzeme önerileri** | Gastro | Fit'te mutfak ekseni yok | **Oturmaz.** K9 gereği sipariş domain'i zaten bu turda kurulmuyor |
| Y15 | **Hesap durumu şekli** (`users.status` enum / nullable damgalar) | Gastro (DB enum, 4 hâl) · Diet (2 nullable damga) · Gourmet (kolon yok, bilinçli) | Fit'te örtük 4 hâl var, kod yok | 🔴 **U2 — §6 açık nokta 3.** Karar verilmediği için **eksik sayılmadı**; Fit bugünkü hâlini korur |
| Y16 | **Gizlilik görünürlük ekseni** (6 anahtar) | Gastro (`user_preferences.privacy`) | Diet ve Gourmet'te de yok | 🔴 **U2 — §6 açık nokta 1.** Fit'te 4 anahtar var (`vsProfil` · `vsGecmis` · `vsRozet` · `vsSeo`); **eksik sayılmadı** |
| Y17 | **Bildirim tercihi ayrı tablo şekli** | Diet (`diet_notification_prefs`) ↔ Gastro (tek JSON kolon) | — | 🔴 **U2 — §6 açık nokta 2.** Fit maket; **eksik sayılmadı** |
| Y18 | **Adres parametresi** (`?sekme=` / `?tab=`) | Gastro `?tab=` · Diet `?sekme=` · Gourmet ayrı path | Fit `#çapa` + `?tab=` alias tablosu | 🔴 **U2 — §6 açık nokta 4.** Fit statik dosya kalıbı; **eksik sayılmadı** |

**Sayım:** 18 satırın **9'u Fit'te gerçekten yoktur ve kavram olarak oturur ya
da tartışılabilir** (Y1 · Y2 · Y3 · Y4 · Y5 · Y6 · Y11 + §3.1'in 2FA'sı zaten
Y2, + veri indirme ekranı zaten §2.2/18). **7'si bilinçli olarak yoktur ve
oturmaz** (Y7 · Y8 · Y9 · Y10 · Y12 · Y13 · Y14). **4'ü sözleşmede 🔴 AÇIK**
olduğu için eksik sayılmadı (Y15–Y18).

🔴 **Net rakam — diğer markalarda olup Fit'te karşılığı olmayan ve kavram
olarak Fit'e oturan ekran: 7** (Y1 · Y2 · Y3 · Y4 · Y5 · Y6 · Y11).

---

## 4 · MAKETİ BİTİRMEK İÇİN KALAN EKRANLAR

**Toplam 10 kalem** (v1'de 12 idi; ikisi v1.1'de kapandı). Her satırda büyüklük ve bağımlılık var. **Sıralama
önerilmiştir, karar verilmemiştir** — gerekçesi her satırda yazılıdır.

| Sıra | Kalem | Büyüklük | Nerede | Bağımlılık | Sıralamanın gerekçesi |
|---:|---|---|---|---|---|
| 1 | **Fotoğraf yükleme yüzeyi** (seç → kırp → önizle → uygula) | Var olan sayfaya **modal** | `hesabim-v1.html#profil` | Yok. Ölçüler zaten türetilmiş (avatar 200×200, kapak 1176×240, 5 MB) | Bağımlılığı olmayan tek kalem; ölçü kuralı Dalga 2'de yazıldı, ekranı yok |
| 2 | **2FA kurulum akışı** (yöntem seç → kod doğrula → kurtarma kodları) | Var olan sayfaya **modal / 3 adım** | `hesabim-v1.html#guvenlik` | Yok. Sözleşme §1.2 ORTAK HÜKÜM, açık karara bağlı değil | Sözleşmenin §3.2'de *"dört markada bulunur"* dediği yedi yüzeyin **hiç yok olan tekidir** |
| 3 | **Kart ekleme yüzeyi** | Var olan sayfaya **modal** | `hesabim-v1.html#odeme` | ⚠ Sözleşme §1.5 *"yok olan yetenek… blade'de 'Yakında' yazmaz"* diyor — **yeteneğin var mı yok mu olduğu ürün kararıdır** | Üç markanın ortak boşluğu; Fit tek başına çözerse sözleşme dili üçe ayrılır |
| 4 | **Sağlık ve hareket profili düzenleme yüzeyi** | Var olan sayfaya **9 alanlık form / satır bazlı modal** | `fit-planim-saglik-profil-v1.html` | Yok | Kart *"Düzenlenebilir"* rozeti basıyor ama düzenleme yok — ekranın kendi vaadi karşılıksız |
| 5 | **Fatura detay ekranı** | **Yeni sayfa** (`fatura-detay-v1.html?fatura=`) | Yeni | Yok. Kalıp ölçülü (`DFT-YYYY-NNNNNN`), iki markada emsali var | İki markada var, Fit'te liste bunu vadediyor (PDF düğmesi) |
| 6 | **Yeni şifre belirleme ekranı** | Var olan sayfaya **4. pane** | `giris-v1.html` (`?tab=yeni-sifre`) | Yok. Sıfırlama isteği zaten çizili | Zincirin ikinci halkası; ilk halka çalışıyor, ikincisi yok |
| 7 | **E-posta doğrulama ekranı** | Var olan sayfaya **5. pane** veya küçük yeni sayfa | `giris-v1.html` | Yok. Sözleşme §1.1 `email_verified_at` alanını dördünde de sayıyor; `hesabim:568` *"yeni adrese doğrulama bağlantısı gönderilir"* diyor | Hesabım ekranı bu ekranı **metinle vadediyor** |
| 8 | **Veri listeleme / indirme durum ekranı** | Var olan sayfaya **bölüm + durum satırı** | `fit-planim-veri-izin-v1.html` | Yok | KVKK yüzeyi; sözleşme §3.2'nin yedi yüzeyinden biri, yarım |
| 9 | **İşlem kaydı ekranı** (verine kimin ne zaman eriştiği) | **Yeni sayfa** veya var olan sayfaya bölüm | `fit-planim-veri-izin-v1.html:124` | Yok | Aynı sayfada düğmesi var, hedefi yok |
| ✅ | ~~Randevu alma yolunun açılması~~ | — | — | — | **v1.1'de KAPANDI (F-A2).** Modal taşınmadı; `?randevu=1` [`&paket=`] adres kancasıyla tek kaynağından açılıyor. Hesabım (3 bağlantı) ve Planım › Antrenörüm (2 bağlantı) buna çekildi |
| ✅ | ~~Paket editörünün çok pakete açılması~~ | — | — | — | **v1.1'de KAPANDI (F-A1).** İki editör + `data-hz-*` tekrarlayıcı + "Yeni Paket Ekle" |
| 10 | **Ücretsiz kademe görünümü** (`#uyelik`in plansız hâli) | Var olan çapaya **ikinci durum** | `hesabim-v1.html#uyelik` | 🔴 **Bağımlı:** sözleşme §1.6 *"Ücretsiz paket bir satır değildir"* ORTAK HÜKÜM'ü kurgunun temelidir; Dalga 6'nın paket yüzeyiyle birlikte çizilmesi ölçülebilir tekrar riskini düşürür | En sona: tek kalem olarak çizilirse Dalga 6'da yeniden çizilme ihtimali var |

### 4.1 · Bu listede **BİLEREK OLMAYANLAR**

| Kalem | Neden listede yok |
|---|---|
| ~~Destek kanonu uyarlaması (4 durum · yeniden aç · sayfalama)~~ | ✅ **Dalga 3'te YAPILDI** (2026-08-26). Kanon `docs/destek-kanonu.md` olarak depoya birebir kopyalandı (md5 kaynakla aynı). Kalan: destek yüzeyinin **kalıcılığı** ve **yönetim kuyruğu** — ikisi de backend işi, K14 gereği sonra |
| Rozet dünyasının kurulması (galeri veriye bağlanacak · `:112` metin hatası) | 🔵 **Dalga 4.** K2 gereği Fit kendi rozetlerini kendi kurar |
| Komisyon · hakediş · alt sınır · fatura eşiği yüzeyleri | 🔵 **Dalga 6.** K13 gereği panelden okunur; makette sayı olarak yazılmaz |
| Gizlilik görünürlük ekseninin genişletilmesi · bildirim tercihi şeklinin değişmesi · hesap durumu makinesi · adres parametresinin değişmesi | 🔴 **Sözleşme §6'da AÇIK.** U2 gereği hiçbiri "eksik" değildir |
| Yönetim paneli (admin) | Fit'te hiç yok ve bu turda kapsam dışı; K13/P6'nın *"panelden okunur"* hükmünün Fit'te bugün karşılığı yok — **ölçüm bunu kaydeder, iş listesine yazmaz** |

### 4.2 · §0'daki `HİÇ YOK = 9` ile bu listedeki 12 kalem nasıl uyuşuyor

Kalan 10 kalemin **ilk dokuzu** (#1–#9) `HİÇ YOK` sınıfındadır: ekran,
bölüm ya da form olarak **hiç çizilmemiştir**. Onuncusu `HİÇ YOK` değildir:

- **#10** var olan bir çapanın ikinci durumudur (plansız üye görünümü).

v1'in `HİÇ YOK` OLMAYAN diğer iki kalemi (randevu yolu · çok paketli editör)
**v1.1'de kapatıldı**; bu yüzden `HİÇ YOK = 9` sayısı değişmedi ama kalan
kalem 12'den 10'a indi.

### 4.3 · Büyüklük dağılımı

| Tür | Adet | Kalemler |
|---|---:|---|
| **Yeni sayfa** | **2** | #5 fatura detay · #9 işlem kaydı (sayfa ya da bölüm — karar verilmedi) |
| **Var olan sayfaya bölüm / modal / pane** | **8** | #1 · #2 · #3 · #4 · #6 · #7 · #8 · #10 |

---

## 5 · ÖLÇEMEDİKLERİM

| # | Ne | Sebebi |
|---|---|---|
| Ö1 | Y11 — "İçeriklerimi indir"in Fit'e oturup oturmadığı | Fit'te *"üyenin ürettiği içerik"* kavramı `profil-v1.html`de var (paylaşılan hareket · form ipucu) ama **toplu indirme** hiçbir karar metninde geçmiyor. Ürün kararı olmadan ölçülemez |
| Ö2 | Kart ekleme yeteneğinin Fit'te olup olmayacağı | Sözleşme §1.5 iki markanın dilini tekleştirmek istiyor ama **hangi yönde tekleşeceği yazılmamış**. Ölçüm yönü seçemez |
| Ö3 | Bitişik halkanın (5 dosya) hesap ailesine dâhil sayılıp sayılmayacağı | Lead'in tanımı *"kabuk menüsünden hesap alanına giden bağlantılar da sayılır"* iki okumaya açık. **İki halka ayrı sayıldı**, karar lead'in |
| Ö4 | `enerji-defteri-v1.html`in 3 `data-lg-gate` düğmesinin hedefi | Sayfa bitişik halkada ve ölçümün ana ekseni değil; düğmelerin hedef ekranı **açılmadı, tek tek denenmedi** |

---

*Envanter sonu. Bu belge karar vermez, ölçer. Kod yazılmadı, maket değiştirilmedi.*
