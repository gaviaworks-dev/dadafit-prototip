olcum v1 · 2026-08-25 · şerit: FIT · kaynak sözleşme sürümü: `sozlesme v1`

# FIT ŞERİDİ — SÖZLEŞME ÖLÇÜMÜ

**Ne bu:** `docs/hesap-sozlesmesi.md` iskeletinin bölüm sırasıyla birebir aynı
kurulmuş, Fit maketinden **ölçülerek** çıkarılmış veri noktası envanteri.
Ortak metni lead kuracak; bu dosya lead'in girdisidir.

🔴 **`docs/hesap-sozlesmesi.md`ye DOKUNULMADI.** Ölçüm anındaki `md5`:
`fc5d57e23231c7cac97831fe2ec91111`.

**Yöntem:** Modül İnşa Protokolü §3 — *"Sayfada görünen her veri noktası =
bir model alanı."* Fit'te backend yoktur (67 statik HTML); ölçüm kaynağı
markup'ın kendisidir. Her satırın kanıtı `dosya:satır` biçimindedir.

**Ölçüm dili:** `VAR` · `YARIM` · `YOK` · `SADECE ARAYÜZ` · `KAPSAM DIŞI (E2)`.

---

## 0 · ÖLÇÜMÜN KABA HATLARI

| Ölçüm | Sayı |
|---|---|
| `hesabim-v1.html` toplam satır | 1770 |
| Çapa (sekme paneli) sayısı | **10** |
| Çapa içi form denetimi (`input`+`select`+`textarea`) | **51** |
| `#ftModal` (fatura bilgileri açılır penceresi) denetimi | **5** |
| Toplam form denetimi | **56** |
| `#diger` köprü kartı | **6** — altısının da hedef dosyası VAR |
| Sayfa üstü sekme rayı | `hesabim-v1.html:453-464` |

**On çapa** (`hesabim-v1.html:454-463` ray, `:472-1345` paneller):
`#profil` · `#bildirim` · `#uyelik` · `#odeme` · `#fatura` · `#guvenlik` ·
`#dil` · `#diger` · `#dondur` · `#sil`

⚠ Bunlar **gerçek sekmedir**, atlama listesi değil: JS tek panel gösterir
(`hesabim-v1.html:1487` `ac()`), ama paneller işaretlemede AÇIK doğar —
JS düşerse on bölüm alt alta çalışmaya devam eder (aşamalı iyileştirme,
`hesabim-v1.html:444-451` kendi notu).

---

## 1 · Alan adları

### 1.1 · Kimlik ve profil

**Kaynak: `#profil` çapası, iki form kartı (`hesabim-v1.html:472-596`).**

Kart A — "Profil Bilgilerim" (`:473-538`):

| # | Alan (id) | Etiket | Tip | Zorunlu | Varsayılan | Kanıt |
|---|---|---|---|---|---|---|
| 1 | `hsAd` | Ad | text · `autocomplete=given-name` | ✔ | `Elif` | `:493` |
| 2 | `hsSoyad` | Soyad | text · `family-name` | ✔ | `Şahin` | `:497` |
| 3 | `hsHandle` | Kullanıcı adı | text · `username` | ✔ | `elifsahin` | `:502` |
| 4 | `hsEmail` | E-posta | email | ✔ | `elif.sahin@eposta.com` | `:508` |
| 5 | `hsTel` | Telefon | tel | — (opsiyonel) | `0555 555 55 55` | `:513` |
| 6 | `hsDogum` | Doğum tarihi | text · `inputmode=numeric` · `placeholder=gg.aa.yyyy` | — | `14.03.1992` | `:519` |
| 7 | `hsCinsiyet` | Cinsiyet | select · **3 seçenek** | — | `Kadın` | `:524-528` |
| 8 | `hsBio` | Hakkımda | textarea · `maxlength=160` · canlı sayaç | — | 105 karakterlik metin | `:533` |
| 9 | (foto) | Profil + kapak fotoğrafı | `data-photo-edit` düğmeleri | — | — | `:413`, `:417` |

- **Cinsiyet seçenek listesi (kapalı):** `Belirtmek istemiyorum` ·
  `Kadın` (seçili) · `Erkek`.
- **Kullanıcı adının adres karşılığı yazılı:** `/uye/elifsahin` (`:503`).
  Fit'in herkese açık profil kalıbı budur.
- **Fotoğraf kuralı metinde geçiyor, doğrulama yok:** "JPG veya PNG, en az
  200×200 px, kare kırpılır" (`:488`). Yükleme **gerçek değildir** —
  `:1693-1706` JS'i bilerek sahte akış taklit etmez, tek satır durum
  metni basar. → `SADECE ARAYÜZ`.

Kart B — "Profil Görünürlüğü" (`:540-594`) → gizlilik ekseni, bkz. §1.3.

**Sözleşme adayı alan adları:** `ad` · `soyad` · `kullanici_adi` ·
`eposta` · `telefon` · `dogum_tarihi` · `cinsiyet` · `hakkimda` ·
`avatar` · `kapak`.

### 1.2 · Güvenlik ve oturum

**Kaynak: `#guvenlik` çapası, ÜÇ ayrı kart (`hesabim-v1.html:946-1044`).**

Kart A — şifre değiştirme (`:947-983`):

| Alan (id) | Etiket | Tip | Zorunlu | Kanıt |
|---|---|---|---|---|
| `pwCur` | Mevcut şifren | password · `current-password` | ✔ | `:957` |
| `pwNew` | Yeni şifre | password · `new-password` | ✔ | `:965` |
| `pwNew2` | Yeni şifre (tekrar) | password · `new-password` | ✔ | `:972` |

Her üçünün yanında **göz düğmesi** (`.fk-eye`, `data-eye`) — `:1571-1586`
`aria-pressed` ve etiketi de çeviriyor.
Meta alan: "Son şifre değişikliği: 4 ay önce" (`:979`) → `sifre_degistirme_tarihi`.

Kart B — "İki Adımlı Doğrulama ve Giriş Yöntemleri" (`:985-1013`):

| Kalem | Tip | Durum | Kanıt |
|---|---|---|---|
| `gv2fa` — İki adımlı doğrulama | toggle | açık | `:996` |
| E-posta ile giriş | salt durum · "Aktif" | birincil yöntem | `:1000` |
| Google hesabı | eylem düğmesi "Bağla" | Bağlı değil | `:1005` |
| Apple hesabı | eylem düğmesi "Bağla" | Bağlı değil | `:1010` |

→ Sözleşme alanları: `iki_adimli_dogrulama` (bool) · `giris_yontemleri[]`
(`eposta` · `google` · `apple`, her biri `bagli` + `birincil`).
2FA yöntemi metinde **SMS**'tir: "girişte telefonuna gelen 6 haneli kod"
(`:995`) — TOTP/authenticator seçeneği makette YOK.

Kart C — "Açık Oturumlarım" (`:1015-1044`) — üç satır:

| Alan | Örnek | Kanıt |
|---|---|---|
| Cihaz adı + istemci | `iPhone 14 — DadaFit uygulaması` · `MacBook Pro — Chrome` · `iPad — Safari` | `:1026,1031,1036` |
| Konum | `İstanbul` · `İstanbul` · `Ankara` | aynı |
| Son görülme | `şu anda aktif — bu cihaz` · `3 saat önce` · `12 gün önce` | aynı |
| Bu cihaz mı | rozet "Bu cihaz" | `:1027` |
| Eylem | "Oturumu Kapat" (satır) · "Diğer Tüm Oturumları Kapat" (toplu) | `:1032,1041` |

→ `oturumlar[]`: `cihaz` · `istemci` · `konum` · `son_gorulme` ·
`bu_cihaz` (bool). İki eylem: tekil kapat, toplu kapat.

### 1.3 · Gizlilik

**Kaynak: `#profil` çapasının İKİNCİ kartı — "Profil Görünürlüğü"
(`hesabim-v1.html:540-594`).**

⚠ **Fit'te gizlilik ayrı sekme DEĞİLDİR**, profilin altındaki ikinci karttır.

| # | Alan (id) | Etiket | Tip | Varsayılan | Kanıt |
|---|---|---|---|---|---|
| 1 | `vsProfil` | Profilim herkese açık | toggle | açık | `:554` |
| 2 | `vsGecmis` | Aktivite geçmişimi kimler görebilir? | select · 3 | `Takipçilerim` | `:560-564` |
| 3 | `vsRozet` | Rozetlerim ve ilerleme özetim profilimde görünsün | toggle | açık | `:569` |
| 4 | `vsSeo` | Arama motorlarında görün | toggle | **kapalı** | `:584` |

- `vsGecmis` kapalı listesi: `Herkes` · `Takipçilerim` (seçili) · `Sadece ben`.
- **Sökülmüş beşinci anahtar — kayda geçer:** `vsSira` ("Challenge
  sıralamalarında adım görünsün") `:571-583`te **geri alma yönergesiyle**
  birlikte kaldırılmıştır. Sebep markup'ta yazılı: `fit-planim-rozetler-v1.html`
  "Kimseyle sıralanmazsın" diyor, bu anahtar sıralama varmış gibi konuşuyordu.
  → **Fit'in ürün duruşu: sıralama YOK.** Sözleşmede "liderlik tablosu
  görünürlüğü" ekseni açılacaksa Fit bu ekseni bilerek kapatmıştır.
- **KVKK ekseni bu çapada DEĞİL:** "verilerimi indir" ve sağlık verisi
  izinleri `fit-planim-veri-izin-v1.html`e köprülenir (`:545`, `:588`).
  Bu ayrım Fit'e özgüdür, bkz. §5.

### 1.4 · Bildirim tercihleri

**Kaynak: `#bildirim` çapası (`hesabim-v1.html:598-681`).**

**Kalıp: 7 satır × 2 kanal matrisi** (`.ntf-matrix`, `:606-651`).
Kanallar: **E-posta** · **Push**. (SMS kanalı YOK.)

| # | Bildirim türü | E-posta | Push | Kanıt |
|---|---|---|---|---|
| 1 | Antrenman hatırlatması (seanstan 30 dk önce) | kapalı | açık | `:611` |
| 2 | Program günü ve haftalık plan | açık | açık | `:616` |
| 3 | Challenge durumu (kalan gün · seri · telafi) | kapalı | açık | `:622` |
| 4 | Antrenör mesajı ve randevu | açık | açık | `:627` |
| 5 | Haftalık ilerleme özeti (Pazar akşamı) | açık | kapalı | `:632` |
| 6 | Yeni hareket, program ve video seansı | kapalı | açık | `:637` |
| 7 | **Kampanya ve DadaFit Pro fırsatları** | kapalı | kapalı | `:642` |

İki ek alan (`:648-666`):

| Alan (id) | Etiket | Tip | Varsayılan | Kanıt |
|---|---|---|---|---|
| `ntfSaat` | Hatırlatma saati | `type=time` | `18:30` | `:653` |
| `ntfSessiz` | Sessiz saatler | select · 4 | `22:00 – 07:00` | `:659-664` |

- `ntfSessiz` kapalı listesi: `22:00 – 07:00` (seçili) · `23:00 – 08:00` ·
  `00:00 – 06:00` · `Kapalı`.
- Kural metinde yazılı: **sessiz saat yalnız push'u susturur, e-postayı
  etkilemez** (`:657`).
- ⚠ **7. satır K6'nın yüzeyidir** — "Kampanya ve DadaFit Pro fırsatları"
  abonelik varsayar.

### 1.5 · Ödeme yöntemi ve fatura

**Kaynak: `#odeme` (`:794-880`) + `#fatura` (`:882-944`) + `#ftModal` (`:1363-1435`).**

**Ödeme geçmişi tablosu** (`.sub-inv-list`, `:803-857`) — 6 satır, 4 kolon:
`Tarih` · `İşlem` (+ alt satırda kart) · `Tutar` · `Durum`.
Ölçülen durum hâlleri **iki**: `Başarılı` · `Tekrar denendi`.
İşlem türleri **iki**: `DadaFit Pro — Aylık` (₺99) · `Antrenör paketi —
Selin Aksoy` (₺1.400).

**Kayıtlı ödeme yöntemleri** (`.card-list`, `:859-878`) — 2 kart:

| Alan | Örnek | Kanıt |
|---|---|---|
| Marka | Visa · Mastercard | `:861,869` |
| Son dört hane | `4242` · `8821` | `:864,872` |
| Son kullanma | `08 / 2027` · `03 / 2027` | `:865,873` |
| Varsayılan mı | rozet "Varsayılan" | `:867` |
| Eylemler | `Kaldır` · `Varsayılan Yap` · `Ödeme Yöntemi Ekle` | `:869,875,878` |

Kural metinde yazılı: **tam kart numarası uygulamada tutulmaz** (`:880`).

**Fatura listesi** (`:903-933`) — 4 satır, 4 kolon:
`Tarih` · `Fatura no + açıklama` · `Tutar` · `Belge (PDF)`.
Fatura numarası kalıbı ölçüldü: **`DFT-YYYY-NNNNNN`**
(`DFT-2026-004128`, `-004095`, `-003844`, `-003512`) — `:912,918,924,930`.

**Fatura bilgileri formu** — `#ftModal` açılır penceresinde (`:1373-1420`):

| Alan (id) | Etiket | Tip | Zorunlu | Kanıt |
|---|---|---|---|---|
| `ftTip` | Fatura tipi | select · `bireysel`/`kurumsal` | — | `:1377` |
| `ftUnvan` | Ad soyad ↔ **Şirket unvanı** | text | ✔ | `:1384` |
| `ftKimlik` | TCKN ↔ **Vergi kimlik no** | text · numeric · maskeli | ✔ | `:1390` |
| `ftDaire` | Vergi dairesi | text | **kurumsalda ✔** | `:1395` |
| `ftAdres` | Fatura adresi | textarea (3 satır) | ✔ | `:1400` |

🔴 **Fit'in koşullu doğrulama kanonu burada:** `ftTip` değişince
`ftUnvan`/`ftKimlik` **etiketleri** değişir ve `ftDaire.required`
**gerçekten** açılıp kapanır (`:1629-1642` `syncTip()`), zorunluluk
görsel olarak da belirir (`.opt` ipucu → `.req` yıldızı). Bu, makette
ölçülen **tek gerçek koşullu doğrulama**dır.
Kimlik alanı **maskeli** gelir: `••••••••••1` — "güvenlik için yalnız son
hane gösterilir" (`:1391`).

### 1.6 · Üyelik ve paket

**Kaynak: `#uyelik` çapası, İKİ kart (`hesabim-v1.html:685-790`).**

Kart A — "Üyelik ve Paketim" (`:686-761`):

| Alan | Değer (makette) | Kanıt |
|---|---|---|
| Kademe rozeti | `Pro` | `:696` |
| Paket adı | `DadaFit Pro — Aylık` | `:698` |
| Durum rozeti | `Aktif` | `:698` |
| Fiyat | `₺99 / ay` | `:701` |
| Aktif paket | `DadaFit Pro (Aylık)` | `:706` |
| Başlangıç | `15 Mart 2026` | `:707` |
| Dönem bitişi | `14 Eylül 2026` | `:708` |
| Yenileme tarihi | `15 Eylül 2026` | `:709` |
| Paket avantajları | **6 madde** | `:711-718` |
| `uyYenile` | Otomatik yenileme — toggle, açık | `:731` |
| `uyKart` | Yenilemede kullanılacak kart — select, 2 | `:737-740` |
| `iptalOnay` | İptal onay kutusu + kilitli düğme | `:749-758` |

Kart B — "Antrenör Paketlerim" (`:763-789`) — **`uys-list` satırı**:

| Alan | Değer | Kanıt |
|---|---|---|
| Antrenör adı + avatar | `Selin Aksoy` | `:773-777` |
| Durum | `Aktif` | `:777` |
| Paket adı | `Kuvvet Temeli — ayda 4 online seans` | `:778` |
| Sonraki yenileme | `2 Eylül 2026` | `:779` |
| Bedel | `₺1.400 / ay` | `:781` |
| Eylem | Antrenör Profili → `antrenor-detay-v1.html?slug=` | `:783` |

🔴 **P5 ÖLÇÜMÜ — MAKET P5'İ ZATEN SÖYLÜYOR.** `:787`:
> *"Antrenör paketleri DadaFit Pro üyeliğinden ayrı tahsil edilir;
> iptali antrenörünle anlaştığın koşullara bağlıdır."*

Ödeme geçmişinde de iki kalem **ayrı satır** olarak durur (₺99 ve ₺1.400,
`:812,818`). Antrenör bedelleri antrenör başına değişir: `₺450/seans` ·
`₺1.600/ay` · paket `₺2.400`/`₺3.200`/`₺4.800`
(`antrenor-detay-v1.html:819,833,859,872,885`), sekiz antrenörün seans
ücreti `₺380`–`₺520` arası (`antrenor-detay-v1.html:1117-1124`).
→ **P5 makette KARŞILANMIŞ durumda.**

### 1.7 · Destek

**Fit bu turda desteğe DOKUNMUYOR (K8 · Diet pilot).** Yalnız bugünkü
yüzey ölçüldü:

| Ölçüm | Değer | Kanıt |
|---|---|---|
| Destek sayfaları | 3 | `destek-v1.html` · `destek-talepleri-v1.html` · `destek-talebi-detay-v1.html` |
| `#diger`den köprü | "Destek Taleplerim" | `hesabim-v1.html:1204` |
| Durum sayısı | **3** — `acik` · `yanitlandi` · `kapandi` | `destek-talepleri-v1.html` `data-durum` sayımı: 3+2+3 |
| Konu listesi | **9 kalem** (kapalı select) | `destek-talepleri-v1.html:485-493` |
| Talep numarası kalıbı | `DF-YYYY-NNNN` (`DF-2026-0412`) | `destek-talebi-detay-v1.html:642` |
| Kanal alanı | `Web · Destek Taleplerim` | `destek-talebi-detay-v1.html:647` |
| Talep künyesi | numara · durum · konu · açılış · son hareket · mesaj sayısı · kanal | `destek-talebi-detay-v1.html:641-648` |
| "Yeniden aç" | **YOK** | aranmış, bulunamadı |
| Sayfalandırma | **YOK** | aranmış, bulunamadı |

**Konu listesi (9, Fit'e özgü):** DadaFit Pro ve ödeme · Üyelik ve fatura ·
Aktivite ve cihaz bağlantıları · Video seansları · Programlar ve planım ·
Antrenör ve randevu · Hesap ve giriş · Uygulama hatası · Diğer.

🔴 **Kanona taşınmaması gereken bir kusur ölçüldü:** talep kapatma durumu
**kalıcı değildir** — `destek-talebi-detay-v1.html:755-760` kendi notunda
söylüyor: kapatma yalnız açık sayfada yaşar, yenilenince demo verisi geri
gelir.

**Y8.5 ölçümü ayrı başlıkta: bkz. §6.**

### 1.8 · Rozet ve kademe

**Kaynak: `rozetler-v1.html` (608 satır) + `fit-planim-rozetler-v1.html`.**
Tam ölçüm ayrı belgede: `docs/rozet-eksenleri-fit.md`. Sözleşmeye giren
alan başlıkları:

| Alan | Fit'teki karşılığı | Kanıt |
|---|---|---|
| Kademe merdiveni | **8 basamak**, tek ölçü = *aktif olunan gün sayısı* | `rozetler-v1.html:363-371` |
| Mevcut kademe | `İlk Ay · 3 / 8 · 26 aktif gün` | `:352-354` |
| Sonraki kademeye kalan | `Üç Ay'a 19 aktif gün` + yüzde çubuğu | `:355-357` |
| Rozet ailesi | **8 aile** | `:400,413,429,442,455,468,481,493` |
| Rozet sayısı | **42** (21 kazanılmış · 21 yolda) | `:387-389` |
| Rozet alanları | ad · ikon · kazanım tarihi VEYA ilerleme · açıklama · nasıl kazanılır · bağlı kademe | `:403` (tek kart örneği) |
| İlerleme gösterimi | kilitli rozette **tek satırda** `x / y · z kaldı` + yüzde çubuğu | `:420-427` |

🔴 **Gastro'nun "nullable `earned_at` + tek satırda ilerleme" deseni Fit
maketinde ZATEN görsel olarak kuruludur** — kazanılan rozette
`Kazanıldı · 8 Tem 2026`, kilitlide `26 / 50 gün · 24 kaldı`. Desen
transferinde çevrilecek bir kavram yok.

**Puan (`contribution_points`) karşılığı Fit'te YOKTUR** — merdivenin
ölçüsü puan değil, **aktif gün sayısıdır**. K3 gereği göç zaten yok;
ölçüm bunu doğruluyor.

### 1.9 · Üretici ve kazanç

Fit'te **iki ayrı üretici yüzeyi** ölçüldü — bu, dört markanın en karışık
kalemidir ve §7'de beklenmedik bulgu olarak ayrıca bildirilmiştir.

**(a) Antrenör (K4'ün öngördüğü model — hizmet satışı):**

| Alan | Değer | Kanıt |
|---|---|---|
| Başvuru sayfası | `antrenor-ol-v1.html` — dört adım | `:439-464` |
| Adımlar | Sertifikanı yükle → Ekibimiz inceler → Onaylı rozetini al → Yayında, danışan al | aynı |
| Doğrulama kaydı | "DadaFit **Onaylı** Antrenör" rozeti | `:412,458` |
| Hizmet kalemleri | Birebir Seans (60 dk, görüntülü) · Aylık Paket (4 seans/ay) · program paketleri | `antrenor-detay-v1.html:1065-1066,859-885` |
| Randevu akışı | VAR (`fit-planim-randevular-v1.html`) | — |

→ **K11'in Fit karşılığı `antrenor_dogrulama` kaydıdır** ve makette kuruludur.

**(b) Üyeden üyeye ücretli abonelik — `profil-v1.html` "Üyelik" sekmesi:**

| Alan | Değer | Kanıt |
|---|---|---|
| Plan başlığı | `Elif'in Antrenman Üyeliği` | `profil-v1.html:2271` |
| Aylık ücret | `₺49 / ay` | `:2273` |
| Avantaj listesi | 5 madde, **düzenlenebilir** (ekle/sil) | `:2274-2280`, `:2385` |
| Public görüm | plan kartı + "Abonelere Özel" kilitli içerik (`.pf-mgate`) | `:2264-2295` |
| Own görüm KPI | `184 Aktif üye` · `₺9.016 Aylık gelir (tahminî)` · `+23 Bu ay yeni üye` | `:2370-2372` |
| Abone listesi | üye · başlangıç tarihi · durum (`Aktif`/`İptal etti`) · mesaj | `:2397+` |
| Plan durumu | "Üyelik aktif — yeni üyeler kabul ediliyor" (anahtar) | own görüm |

🔴 **Komisyon, hakediş, ödeme eşiği, fatura eşiği: makette HİÇ YOK.**
`komisyon` · `kazanç` · `hakediş` · `%10` sözcükleri `antrenor-ol-v1.html`,
`antrenor-detay-v1.html` ve `profil-v1.html`de **aranmış, bulunamamıştır.**
K5 ve K13'ün altı parametresinin makette karşılığı **YOK** — Dalga 6'da
sıfırdan çizilecektir.

---

## 2 · Durum makinesi

⚠ **Fit'te backend yoktur; enum yoktur.** Aşağıdaki hâller markup'ta
**metin/rozet/CSS sınıfı** olarak görünen durumlardır. Hiçbiri kapalı liste
olarak tanımlanmamıştır.

### 2.1 · Hesap durumu

**`YOK` (durum makinesi olarak).** Ölçülen: makette **üç yıkıcı geçiş
formu** var, ama hesap durumu diye bir alan yok.

| Geçiş | Nereden | Kilit | Kanıt |
|---|---|---|---|
| Dondurma | `#dondur` | onay kutusu | `hesabim-v1.html:1268-1287` |
| Silme | `#sil` | onay kutusu **+ ifade yazımı** | `:1319-1343` |
| Silmeden dönüş | metin: "İlk 30 gün içinde giriş yaparsan silme iptal edilir" | — | `:1312` |
| Dondurmadan dönüş | metin: "Giriş yaptığın anda hesabın kendiliğinden aktifleşir" | — | `:1266` |

→ Metinden çıkan **örtük** hâller: `aktif` · `donduruldu` ·
`silme_beklemede (30 gün)` · `silindi`. Makette **hiçbiri kod olarak
tanımlı değildir**.

### 2.2 · Destek talebi durumu

**`YARIM` — üç hâl, kanon dört ister.**

| Hâl | CSS sınıfı | Sayım | Kanıt |
|---|---|---|---|
| Açık | `st-acik` / `data-durum="acik"` | 3 talep | `destek-talepleri-v1.html` |
| Yanıtlandı | `st-yanit` / `data-durum="yanitlandi"` | 2 talep | aynı |
| Kapandı | `st-kapali` / `data-durum="kapandi"` | 3 talep | aynı |

Geçişler: yalnız **bir tanesi** makette gerçekten çalışır — "Talebi Kapat"
onay penceresinden geçer ve rozetleri gerçekten değiştirir
(`destek-talebi-detay-v1.html:653-656`, `:762-766`). "Yeniden aç" YOK.

### 2.3 · Abonelik / paket durumu

**`SADECE ARAYÜZ`.** Ölçülen hâller, ikisi farklı sayfada:

| Hâl | Nerede | Kanıt |
|---|---|---|
| `Aktif` | hesabım + üyelik sayfası | `hesabim-v1.html:699`, `uyelik-faturalandirma-v1.html:513` |
| `İptal edildi (dönem sonuna kadar açık)` | `.uf-cancelled` | `uyelik-faturalandirma-v1.html:996-1000` |
| `Donduruldu` | `.uf-frozen` | `:1009-1013` |
| `Planlı değişiklik var` | `.uf-planned` | `:552-556` |
| `Ödeme sorunu` | kabuk menüsünde "Aboneliğim — İşlem Gerekli" | `assets/js/fit-shell.js:437` |

Kademe anahtarı ölçüldü — **`localStorage.dm_user.paket`**, üç değer:
`ucretsiz` · `pro` · `pro_max` (`assets/js/fit-shell.js:432-443`).
Bu, makette **çalışan tek paket kapısıdır**.

### 2.4 · Üretici planı durumu

**`SADECE ARAYÜZ`, iki ayrı yerde:**

- **Antrenör başvurusu:** dört adım metin olarak var
  (`antrenor-ol-v1.html:446-464`), form gönderilince "Başvurun alındı"
  ekranı gelir (`:610`). Durum alanı YOK.
- **Üyelik planı (profil):** tek anahtar — "Üyelik aktif — yeni üyeler
  kabul ediliyor" (`profil-v1.html` own görüm). İki hâl örtük.
- **Abone durumu:** `Aktif` · `İptal etti` (`profil-v1.html` abone listesi).

### 2.5 · Kazanç ve ödeme durumu

**`YOK`.** Makette hakediş, bakiye, ödeme dönemi, alt sınır, fatura eşiği
kavramlarının **hiçbiri** yoktur. Tek sayı `₺9.016 Aylık gelir (tahminî)`
bir KPI kutusudur (`profil-v1.html:2371`), bir durum değil.

---

## 3 · Adres kalıbı

⚠ **Fit statik dosya kalıbı kullanır** — route yoktur, dosya adı adrestir.

### 3.1 · Hesap kökü

`hesabim-v1.html` — tek dosya, on çapa. Kabuk menüsünden iki giriş var:
`hesabim-v1.html` (kök) ve `hesabim-v1.html#uyelik`
(`assets/js/fit-shell.js:473-474`).

Dosya adı kalıbı bütün depoda aynıdır: **`<konu>-v1.html`**, hepsi kökte,
alt dizin yok (`CLAUDE.md` ağaç bölümü).

### 3.2 · Alt yüzeyler

**On çapa (`#`):** `#profil` `#bildirim` `#uyelik` `#odeme` `#fatura`
`#guvenlik` `#dil` `#diger` `#dondur` `#sil`.

🔴 **Eski adlar için ALIAS tablosu KURULU** (`hesabim-v1.html:1470-1478`) —
`?tab=` sorgusundan çözülür:

| Eski ad | Gittiği çapa |
|---|---|
| `gizlilik` | `profil` |
| `sifre` | `guvenlik` |
| `abonelik` · `abonelikler` · `uyelikler` | `uyelik` |
| `kartlarim` | `odeme` |
| `adreslerim` | `fatura` |

Bu tablo sözleşmenin "eski adres kırılmaz" hükmü için Fit'in emsalidir.
Ayrıca gezinme `pushState` ile adres çubuğuna yazılır → geri tuşu sekmeler
arasında gezer (`:1531`).

**Hesap ailesinin diğer yüzeyleri (`#diger`in 6 köprüsü, §4'te tablo):**
`fit-planim-saglik-profil-v1.html` · `fit-planim-veri-izin-v1.html`
(+ `#indir` çapası) · `bagli-uygulamalar-v1.html` ·
`destek-talepleri-v1.html` · `bildirimler-v1.html`.

**Üyelik yüzeyi ayrı sayfadadır:** `uyelik-faturalandirma-v1.html`,
altı çapa: `#paket` `#paket-degistir` `#odeme-gecmisi` `#faturalar`
`#promosyon` `#iptal` (`:487-496`).

**Herkese açık profil:** `/uye/<kullanici_adi>` metinde yazılı
(`hesabim-v1.html:504`); maket dosyası `profil-v1.html`.

**Antrenör detayı:** `antrenor-detay-v1.html?slug=<slug>`
(`hesabim-v1.html:784`).
**Destek detayı:** `destek-talebi-detay-v1.html?talep=<no>`
(`destek-talebi-detay-v1.html:666`).
**Ödeme:** `pro-odeme-v1.html?plan=<t2|t3>` (`pro-v1.html:306,324,447`).

### 3.3 · Yazma uçları ve hız sınırları

**`YOK`.** Statik depoda sunucu ucu yoktur; hız sınırı kavramının
karşılığı da yoktur. Formların hepsi `e.preventDefault()` ile durur
(`hesabim-v1.html:1597`, `:1745`).

### 3.4 · Yönetim yüzeyi

**`YOK`.** Fit deposunda admin sayfası yoktur (67 HTML'in tamamı public
yüzeydir; `sa-admin*` kalıbı bu depoda **aranmış, bulunamamıştır**).
🔴 K13 ve P6'nın "panelden okunur" hükmünün Fit'te bugün karşılığı yok.

---

## 4 · Doğrulama kuralları

### 4.1 · Alan bazlı kurallar

**Ölçülen: HTML doğrulaması VAR, JS doğrulaması YALNIZ ÜÇ YERDE.**

| Kural | Nerede | Tip | Kanıt |
|---|---|---|---|
| `required` — ad, soyad, kullanıcı adı, e-posta | `#profil` | HTML | `:493,497,502,508` |
| `type=email` | `hsEmail` | HTML | `:508` |
| `maxlength=160` — Hakkımda | `hsBio` | HTML + canlı sayaç | `:533`, `:1590-1594` |
| `required` — üç şifre alanı | `#guvenlik` | HTML | `:957,965,972` |
| Şifre kuralı **metin olarak** | "En az 8 karakter; büyük harf, küçük harf, rakam ve özel karakter" | **doğrulanmıyor** | `:977` |
| Fatura tipi → vergi dairesi zorunluluğu | `#ftModal` | **GERÇEK JS** | `:1629-1642` |
| Silme ifadesi eşleşmesi | `#sil` | **GERÇEK JS** | `:1732-1741` |
| Onay kutusu → düğme kilidi | `#uyelik` `#dondur` `#sil` | **GERÇEK JS** | `:1742-1755` |

🔴 **Türkçe i/İ/ı/I katlaması — Fit'in ölçülmüş dersi.**
`hesabim-v1.html:1727-1731`:
> *"`"hesabimi sil".toLocaleUpperCase('tr')` `"HESABİMİ SİL"` veriyor
> (noktalı İ), ifade ise `"HESABIMI SİL"` (noktasız I) — ölçüldü, doğru
> yazan kullanıcının düğmesi açılmıyordu."*

Çözüm: `fold()` fonksiyonu i ailesinin dördünü de tek harfe indirir.
**Bu kural sözleşmeye girmelidir** — dört markada da Türkçe onay ifadesi
kullanılacaksa aynı tuzak vardır.

**Şifre, e-posta biçimi, telefon biçimi, TCKN/VKN uzunluğu için gerçek
doğrulama YOKTUR** → `SADECE ARAYÜZ`.

### 4.2 · Görsel yükleme (boyut · tip · en küçük kenar)

**`SADECE ARAYÜZ`.** Kural **metin olarak** yazılı ve iki yerde yaşıyor
(düğme `title` ipucu + yardım satırı):

> "JPG veya PNG, en az 200×200 px, kare kırpılır." — `hesabim-v1.html:413`, `:488`

Gerçek `<input type=file>` **YOKTUR**. `:1693-1706` JS'i bilerek sahte bir
yükleme akışı taklit etmez, "gerçek bir dosya yüklenmez" der ve 4 saniye
sonra varsayılana döner.

→ **Sözleşme adayı sayılar:** `jpg|png` · en küçük kenar `200px` ·
kare kırpma. Üst sınır (MB) makette **yok**.

### 4.3 · Hız sınırı tavanları

**`YOK`** — §3.3 ile aynı sebep.

### 4.4 · Yetki kapıları

**Ölçülen üç kapı, üçü de istemci tarafında:**

| Kapı | Mekanizma | Gerçekten kapı mı? | Kanıt |
|---|---|---|---|
| **Giriş kapısı** | `authed` bayrağı — kabuk header/menü değiştirir | `SADECE ARAYÜZ` | `assets/js/fit-shell.js:1549` |
| **Pro kapısı** | `data-pro-gate` → `#proGate` açılır penceresi | **çalışıyor** ama içeriği gizlemiyor: teaser satırı zaten kilitli çizilmiş | `assets/js/fit-shell.js:925-943` |
| **Kademe kapısı** | `localStorage.dm_user.paket` ∈ {`ucretsiz`,`pro`,`pro_max`} | **çalışıyor** — yalnız menü kalemi adını/hedefini değiştirir | `assets/js/fit-shell.js:432-443` |

`data-pro-gate` kullanan **11 dosya**, toplam **26 tetikleyici**:
`arama-fit`(2) · `dadafit-hub`(5) · `dadafit-kopru`(2) · `egzersiz-detay`(2) ·
`enerji-defteri`(2) · `enerji-defteri-dengele`(2) · `enerji-defteri-haftalik`(2) ·
`enerji-defteri-su`(2) · `pro-v1`(2) · `profil-v1`(3) · `program-detay`(2).

🔴 **Kapı üçlüsü ayrımı (04 §B.2 dili):** Fit'te *"daima `false` döndüren"*
kapı yoktur, *"tüketicisi olmayan"* kapı da yoktur; **üçü de tüketicili ama
üçü de yalnız görsel** — sunucu tarafı olmadığı için hiçbiri gerçek yetki
kapısı değildir.

**Profil görünürlük kapısı** ayrıca CSS ile kurulmuştur:
`body.pf-public:not(.is-following)` ve `body.pf-public:not(.is-member)`
(`profil-v1.html:230-245`) — takip kapısı (`.pf-fgate`) ve üyelik kapısı
(`.pf-mgate`) **ayrı iki durum**dur.

---

## 5 · Sözleşme dışı bırakılanlar (Fit'e özel)

Aşağıdakiler Fit'e özgüdür; diğer üç markada karşılığı ya yoktur ya da
kavram olarak farklıdır. Gerekçeleriyle yazıldı.

| # | Kalem | Neden Fit'e özel |
|---|---|---|
| F-Ö1 | **Ölçü birimi beşlisi** — ağırlık (kg/lb) · mesafe (km/mi) · boy (cm/ft-in) · sıcaklık (°C/°F) · enerji (kcal/kJ) | Hareket ve enerji ölçüsü. Gastro'nun karşılığı porsiyon/ölçü birimi, Gourmet'te karşılığı yok. Sıcaklığın gerekçesi markup'ta yazılı: *"Açık hava antrenmanı ve ısınma önerileri sıcaklığa göre değişir"* (`hesabim-v1.html:1118-1119`) |
| F-Ö2 | **`dlGizle` — "Enerji değerlerini gizle"** | Yeme bozukluğu duyarlılığı için kurulmuş bir anahtar: açıkken sayısal enerji yerine yalnız süre/aktif gün/çeşitlilik gösterilir (`:1140`). Fit ve Diet'te anlamlı, Gastro/Gourmet'te değil |
| F-Ö3 | **Haftanın ilk günü** (`dlHafta`) | Haftalık antrenman planı ve seri hesabı buna bağlı. Diğer üçünde takvim ekseni yok |
| F-Ö4 | **Sağlık ve kısıt profili** — ağrı/hareket kısıtı, gebelik/doğum sonrası, uzun süreli hareketsizlik | `fit-planim-saglik-profil-v1.html`. Gizlilik derecesi ayrı: *"Yalnız sen ve izin verdiğin antrenör"*. Diet'in beslenme profiline benzer ama aynı değil; Gastro/Gourmet'te yok |
| F-Ö5 | **Bağlı Uygulamalar** — Apple Health · Android Health Connect · Akıllı saatler · Manuel giriş | `bagli-uygulamalar-v1.html`, 4 bağlantı. Üç yönlü veri sözleşmesi (gelen / giden / hiçbir koşulda gitmeyen, `:236-262`). **Dördün en büyük eşsiz kalemi**; diğer üçünde karşılığı yok |
| F-Ö6 | **Sessiz saatler** (`ntfSessiz`) | Antrenman hatırlatması saatli olduğu için gerekli. Diğer üçünde saatli bildirim ekseni ölçülmedi |
| F-Ö7 | **"Sıralama YOK" duruşu** | `vsSira` anahtarı bilerek sökülmüş (`:574-586`), gerekçesi yazılı: *"Kimseyle sıralanmazsın"*. Bu bir ürün duruşudur; Gastro'nun topluluk puanı/kademe mantığıyla **çelişir**. Sözleşme "liderlik tablosu görünürlüğü" ekseni açarsa Fit bilerek dışarıdadır |
| F-Ö8 | **Antrenör paketi ≠ abonelik ayrımı** | `#uyelik`in ikinci kartı. Bu, K4'ün Fit tarafının maketteki adıdır ve P5'in kanıtıdır. Gastro'da karşılığı "üye üyeye abonelik", ikisi aynı kutu değildir |
| F-Ö9 | **Telafi hakkı** (challenge) | *"Bir gün kaçırmak seriyi sıfırlamaz — ay içinde iki telafi hakkın var"* (`rozetler-v1.html:421`). Seri/telafi kavramı Fit'e özgü |

---

## 6 · 🔴 Y8.5 ÖLÇÜMÜ — "Taleplerin" ve "Beklerken"

**Beyar'ın kararı için girdi. Ölçüm yapıldı, karar verilmedi.**

Her ikisi de **aynı dosyada**, destek talebi detayının **sağ yan rayında**
(`aside`), yan yana iki kart:

### 6.1 · "Taleplerin" — çapraz geçiş kartı

**Yer:** `destek-talebi-detay-v1.html:659-701` (kart başlığı `:660`).

**Ne yapıyor:** Açık talebin detay sayfasındayken, kullanıcının **diğer
sekiz talebini** aynı sayfada listeler ve her biri tek tıkla açılır.
Her satır üç veri taşır: **başlık** · **talep numarası** · **durum**
(`DF-2026-0398 · Açık`). Durum ikonu satır başında (`fa-reply` yanıtlandı,
`fa-circle-dot` açık, `fa-circle-check` kapandı).

Seçili olan talep JS ile `aria-current` alır (`:823`).

**Ölçülen liste:** 8 talep — 3 açık, 2 yanıtlandı, 3 kapandı.
Kardeş sayfadaki (`destek-talepleri-v1.html:274-393`) listenin **aynısı ve
aynı sırada**; markup'ın kendi notu kısaltılmadığını söylüyor (`:661-663`).

**Alt satır:** *"Talebin tamamını, durum süzgecini ve yeni talep formunu
Destek Taleplerim sayfasında bulursun."* (`:699`)

**Ürün değeri (ölçüm, öneri değil):** detay sayfası çıkmaz sokak değildir —
kullanıcı listeye geri dönmeden talepler arasında geziyor.

### 6.2 · "Beklerken" — bekleme süresini dolduran kart

**Yer:** `destek-talebi-detay-v1.html:702-710` (kart başlığı `:703`).

**Ne yapıyor:** Yanıt beklerken kullanıcıyı hazır cevaplara yönlendirir.
Açıklama satırı (`:704`):
> *"Üyelik, ödeme, veri ve izinlerle ilgili soruların çoğunun cevabı hazır —
> beklemeden okuyabilirsin."*

**İki köprü** (`:706-707`):
| Hedef | Etiket | Alt metin |
|---|---|---|
| `sss-v1.html` | Sık Sorulan Sorular | Hazır cevaplar |
| `iletisim-v1.html` | İletişim | Başka bir konu için |

Kart, "Taleplerin" ile **aynı `.tk-others` kalıbını** kullanır — yeni
bileşen yazılmamış.

### 6.3 · Ölçümün bildirdiği

- İkisi de **aynı yan rayda**, aynı `.tk-card` kabuğunda, aynı `.tk-others`
  satır kalıbıyla kurulmuş — kanona alınırlarsa **tek bir desen** olarak
  taşınırlar, iki ayrı iş değil.
- İkisi de **yalnız detay sayfasında** vardır; liste sayfasında
  (`destek-talepleri-v1.html`) karşılıkları yoktur.
- İkisi de **salt okuma**dır: durum değiştirmez, yazma ucu istemez.
  → Kanona alınmaları Diet'in `SupportStatus` enum'una **dokunmaz**.
- Yan rayda üçüncü bir kart daha var, ölçüm bütünlüğü için kayda geçer:
  **"Talebi Kapat"** (`:652-657`) — bu, kanonun `kapatilan` geçişidir,
  Y8.5'in konusu değildir.

🔴 **Karar Beyar'ındır. Bu belge yalnız ölçer.**

---

## 7 · 🔴 BEKLENMEDİK BULGULAR

Üçü de DUR-ve-raporla kapsamındadır; hiçbirine dokunulmadı.

### B1 · Fit maketinde ÜÇ paket zaten var ve adları P1'e çok yakın

`pro-v1.html:7` başlık: **"DadaFit Pro — Ücretsiz, Pro ve Pro Max paketleri"**.
`:235` `<h1>`: **"Ücretsiz, Pro ve Pro Max"**.
Üç kademe kartı: `.pro-card t0` (Ücretsiz, ₺0, `:266`) · `.pro-card t2 featured`
(Pro, ₺99, "En popüler", `:287`) · `.pro-card t3` (Pro Max, ₺199, `:309`).
Kabuk JS'i de üç değerli: `ucretsiz` · `pro` · `pro_max`
(`assets/js/fit-shell.js:432-443`).

→ P1'in istediği isim üçlüsü Fit'te **neredeyse birebir kurulu**; tek fark
üçüncünün adı **"Pro Max"**, P1'de **"Pro Max AI"**.

### B2 · Fit'in "Pro Max"i AI paketi DEĞİL, antrenör/ekosistem paketi

Pro Max'in makette sayılan içeriği (`pro-v1.html:311-322`):
antrenör görüşmesi avantajları · kişisel program değerlendirmesi ·
öncelikli destek · Dada Diet entegrasyonu · Dada Gastro tarif önerileri.
**AI yok.**

Dahası: son iki kalem **E2 kapsamındadır** (çapraz marka). Yani Pro Max'in
altı özelliğinden ikisi bu turda listeden düşer.

Ayrıca AI Fit'te **açıkça yasaklıdır**: `KARARLAR.md:81` ve
`assets/js/fit-shell.js:1027-1028` — belge §21 *"yapay zekâ sohbet
asistanı"* eklenmeyecekler arasında sayıyor; `DadaMentor` bu yüzden
**sökülmüştür**. `destek-talebi-detay-v1.html:83` aynı yasağı tekrarlar.

→ P1/P3'ün "Pro Max AI" adı Fit'te **hem içerik hem karar düzeyinde**
karşılıksızdır. Ölçüm bildirir; karar Beyar'ındır.

### B3 · `profil-v1.html`de üyeden-üyeye ücretli abonelik modülü VAR

K4 Fit'i *"üye üreticiden hizmet satın alır"* diye tanımlıyor. Ama
`profil-v1.html:237` kendi notunda şunu yazıyor:
> *"ÜYELİK MODÜLÜ (madde 30) — üyeden üyeye ücretli abonelik (Patreon)."*

Modül tam kurulu: ₺49/ay plan kartı · 5 avantaj · abonelere özel içerik
kilidi (`.pf-mgate`, blur+watermark) · own görümde plan editörü ·
184 aktif üye / ₺9.016 aylık gelir KPI'ı · abone listesi.

→ **Bu, K4'ün Gastro tarafındaki modeldir ve Fit'te de duruyor.**
`profil-v1.html:313` kavram ayrımını kendisi yapıyor:
*"abonelik ≠ Pro"*. Yani Fit'te bugün **üç** para ilişkisi var:
(1) platform aboneliği (Pro/Pro Max), (2) antrenör hizmeti,
(3) üyeden üyeye abonelik.

K6 "Fit'te abonelik yoktur" derken hangisini kastediyor — (1) mi, (1)+(3)
mü? **Ölçüm bunu ayırt edemez; karar gerekir.**

---

*Ölçüm sonu. Bu belge karar vermez, ölçer.*
