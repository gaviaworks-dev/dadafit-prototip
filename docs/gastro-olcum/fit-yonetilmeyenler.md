# DadaFit · Public yüzeyde YÖNETİLMEYENLER — Aşama B ölçümü

**Ölçüm tarihi:** 2026-08-30 · **Yöntem:** depo taraması (grep + node ile veri
modüllerinin gerçekten yüklenip sayılması). Hiçbir sayı tahmin değildir; her
biri aşağıdaki komutlarla yeniden üretilebilir.

**Depo:** 75 HTML = **21 admin** + **54 public**.
**JS:** 16 modül, 11.725 satır. **CSS:** 5 dosya, 7.778 satır.

---

## 0 · Önce iki bağlayıcı gerçek

**0.1 · Hiçbir admin ekranı hiçbir şey KAYDETMİYOR — bu bilinen ve ilan edilmiş.**
21 ekranın tamamındaki her "Kaydet" düğmesi `FIT_ADMIN.maketKaydet()`e bağlı
(`assets/js/fit-admin.js:480`). Yaptığı tek şey `form.reportValidity()` çağırıp
yanına *"Form doğrulandı — … KAYDEDİLMEDİ. Bu prototipte sunucu yok."* notunu
basmaktır. Bu bir kusur değil, prototipin dürüst sözleşmesi.
**Bu belgenin konusu o değil; konusu bir varlığı düzenleyecek YÜZEYİN hiç
olmayışı.** Sunucu yarın gelse bile, aşağıdaki kalemler için tıklanacak bir alan
yok.

**0.2 · Panelin okuduğu veri, verinin kendisi değil KOPYASI.**
`assets/js/fit-admin-veri.js` (216 satır) `tools/admin-veri-uret.mjs` ile
sayfalardan mekanik olarak üretiliyor. Kaynak hâlâ HTML'in içinde:

| Panel tablosu | Gerçek kaynak |
|---|---|
| `HAREKET` (25) | `egzersiz-detay-v1.html` VERI + `egzersiz-kutuphane-v1.html` kart |
| `SOZLUK` (4 grup) | `egzersiz-kutuphane-v1.html` süzgeç şeridi |
| `TEST` (7) | `fit-testi-detay-v1.html` VERI |
| `PROGRAM` (9 kart) | `program-liste-v1.html` |
| `PROGRAM_DETAY` (4) | `program-detay-v1.html` VERI |
| `HEDEF` (8) | `program-liste` + `programlar-merkezi` çipleri (İKİ ayrı ilan) |
| `SAYFA` (54) | depodaki `*.html` `<title>`/`<meta>` |

---

---

## 🔴 DÜZELTME — 2026-08-30, B3 ajanı buldu, lead doğruladı

Bu belgedeki **üç sayı yanlıştı** ve üçü de aynı sebepten: **HTML'den
grep'lenmişlerdi.** Belge içinde aşağıda düzeltildi; kayıt burada duruyor,
sessizce üzerine yazılmadı.

| # | Belgede yazan | Gerçek | Neden yanlıştı |
|---|---|---|---|
| 1 | *"`ORDER` 11 kalem ilan ediyor ama `L` 10 tanımlıyor — `veri-izin` `L` içinde yok"* | **`ORDER` 11 · `L` 11 · kesişim TAM.** `veri-izin` `yasal-v1.html:398`'de tanımlı. **Kusur YOK.** | `L` nesnesinin anahtarları eksik sayılmış |
| 2 | S.S.S. **30** kayıt | **24 soru / 6 kategori** | `grep -o 'data-kat="…"'` kategori şeridinin **6 sekme düğmesini** de saydı. Sayfanın kendi sekme sayaçları da 4+5+4+4+3+4 = 24 diyor |
| 3 | Rehber **177** `<li>` | **153** `<li>` · 171 `<p>` · 49 bölüm | `grep -oE '<li[ >]'   # ⚠ '<li' deseni <link> etiketini de yakalar` **`<link>`** etiketlerini yakaladı (sayfa başına 4). Sınır karakterli desen (`<li[ >]`) doğru sayıyor |

⚠ **Olmayan bir kusuru ekrana basmak, olan bir kusuru kaçırmaktan daha
kötüdür** — B3 doğru davrandı ve 1 numaralı uyarıyı çizmedi. Yerine gerçek
eksiği bastı: **11 belgenin 11'inde de sürüm ve yürürlük tarihi alanı yok.**

### Denetimin geri kalanı — bu belgenin öteki başlık sayıları TEMİZ

Lead aynı yöntemle yeniden ölçtü. Yanlış çıkan üçünün **üçü de HTML'den
grep'lenmişti**; **veri modülünden okunan hiçbir sayı yanlış çıkmadı**:

| Sayı | Kaynak | Doğrulandı |
|---|---|---|
| 254 terim × 9 alan · 10 kategori · 29 harf | `sozluk-veri.js` | ✅ |
| 31 kas · 12 hareket · 4 harita | `anatomi-veri.js` | ✅ |
| 50 rozet · 9 aile · 8 kademe | `fit-rozet.js` | ✅ |
| 10 fatura | `fit-fatura.js` | ✅ |
| 25 hareket × 4 adım + 4 ipucu = **100 + 100** | `egzersiz-detay-v1.html` `VERI` (ayrıştırıldı, grep'lenmedi) | ✅ |
| 54 sayfa · 38 açıklaması boş · 54 canonical boş | `fit-admin-veri.js` `SAYFA` | ✅ |

**Ders (`docs/lessons.md` §33):** bir sayıyı HTML'den grep'lemek ölçüm değil
tahmindir. Veri bir modülde duruyorsa modül okunur; durmuyorsa desen **sınır
karakteriyle** yazılır ve **bir örnek elle sayılarak** doğrulanır.

---

## A · Public sayfa → yöneten admin ekranı

Durum kodları: **✅ yönetiliyor** · **🟡 kısmen** (varlık listeleniyor ama sayfanın
içeriğinin çoğu ekranda yok) · **🔴 YÖNETİLMİYOR** · **⬜ üye verisi**
(localStorage; tasarım gereği admin'de yeri yok).

| # | Public sayfa | Ne gösteriyor | İçerik kaynağı | Yöneten admin ekranı | Durum |
|---|---|---|---|---|---|
| 1 | `anatomi-v1.html` | Anatomi haritası | `anatomi-veri.js`: **31 kas · 12 hareket · 4 harita** | — | 🔴 |
| 2 | `antrenman-olusturucu-v1.html` | Kural tabanlı antrenman üretici | gömülü `KURALLAR` (13 anahtar) + `HAREKET_EK` (25 kayıt × uyarı/alternatif) + `KALIP_SIRA` | — | 🔴 |
| 3 | `antrenor-detay-v1.html` | Antrenör profili | gömülü `VERI` = **12 antrenör × 3 alan** (ad/unvan/fiyat) + 14 sabit başlık bloğu | `admin-antrenorler` (yalnız başvuru kararı) | 🟡 |
| 4 | `antrenor-ol-v1.html` | Başvuru formu + 17 anlatım bloğu | gömülü HTML | `admin-antrenorler` (kararı verir, metni yönetmez) | 🟡 |
| 5 | `antrenor-panelim-v1.html` | Antrenörün kendi paneli | localStorage + gömülü | — | 🔴 |
| 6 | `antrenorler-v1.html` | Antrenör listesi | gömülü **8 `.coach-card`** | — | 🔴 |
| 7 | `arama-fit-v1.html` | Site içi arama | gömülü `POOL` + `TABS` + `TYPE` | — | 🔴 |
| 8 | `bagli-uygulamalar-v1.html` | Cihaz/uygulama bağlama | gömülü **4 sağlayıcı** (`akilli-saat`,`apple-health`,`health-connect`,`manuel`), 12 kart | — | 🔴 |
| 9 | `bildirimler-v1.html` | Üye bildirim akışı | localStorage + `TUR_AD` | `admin-bildirim` (şablon) | 🟡 |
| 10 | `challenge-merkezi-v1.html` | Challenge vitrini | `fit-challenge.js` `KATALOG` = **3** | `admin-challenge` | ✅ |
| 11 | `challenge-v1.html` | Challenge detayı | aynı katalog + `fit-su` + `fit-rozet` | `admin-challenge` | 🟡 |
| 12 | `challengelarim-v1.html` | Üyenin katılımları | localStorage | — | ⬜ |
| 13 | `dadafit-hub-v1.html` | **ANA SAYFA** | tamamı gömülü: 6 `<section>`, 12 `<h2>`, 1.639 satır | — | 🔴 |
| 14 | `destek-talebi-detay-v1.html` | Talep detayı | gömülü `STATUS`/`AKTOR`/`GECIS` | `admin-destek` | 🟡 |
| 15 | `destek-v1.html` | Çözüm Merkezi (S.S.S.) + talep | gömülü **24 S.S.S. kaydı** (`data-kat` ham sayım 30; 6'sı kategori SEKME düğmesi — uyelik 4 · hareket 5 · program 4 · antrenor 4 · pro 3 · diger 4), 6 kategori | `admin-destek` yalnız TALEP; **S.S.S. hiçbir ekranda yok** | 🔴 (S.S.S.) |
| 16 | `egzersiz-detay-v1.html` | Hareket detayı | gömülü `VERI` = **25 hareket × 14 alan**, içinde **100 adım metni + 100 ipucu metni** | `admin-hareketler` (11 alan) | 🟡 |
| 17 | `egzersiz-kutuphane-v1.html` | Hareket kütüphanesi | kart + süzgeç | `admin-hareketler` + `admin-taksonomi` | ✅ |
| 18 | `egzersizlerim-v1.html` | Enerji Defteri (3.629 satır) | localStorage + gömülü `KCAL_DK`, `ADIM_DK`, `TUR`, `KAYNAK`, `MESAJ` katsayı tabloları | — | 🔴 (katsayılar) |
| 19 | `fit-planim-veri-izin-v1.html` | Veri izin metinleri | gömülü | — | 🔴 |
| 20 | `fit-testi-detay-v1.html` | Fit testi | gömülü `VERI` = **7 test × 16 alan** (5 adım · 1 ölçüm sorusu · 3 bant) | `admin-testler` (6 alan tipi) | 🟡 |
| 21 | `fit-testi-sonuc-v1.html` | Test sonucu | gömülü `SEVIYE` + `TESTS` | — | 🔴 |
| 22 | `fit-testleri-v1.html` | Test listesi | gömülü kart | `admin-testler` | ✅ |
| 23 | `giris-v1.html` | Giriş/kayıt | gömülü `LABELS`/`TITLES`/`ROLE_DEST`/`KURAL` + `fit-ulke.js` (199 ülke) | — | 🔴 |
| 24 | `hakkimizda-v1.html` | Kurumsal sayfa | **tamamı sabit HTML**, 43 blok, 0 satır JS | `admin-sayfalar` yalnız `<title>`/`<meta>` | 🔴 |
| 25 | `hareket-rehberi-v1.html` | Rehber merkezi | sabit HTML (1 h2 · 11 p) | `admin-sayfalar` (yalnız SEO) | 🔴 |
| 26 | `hareket-yeni-baslayanlar-v1.html` | Rehber | sabit (2 h2 · 24 li · 17 p) | SEO | 🔴 |
| 27 | `hareket-dogru-form-v1.html` | Rehber | sabit (25 li · 17 p) | SEO | 🔴 |
| 28 | `hareket-sureye-gore-v1.html` | Rehber | sabit (23 li · 18 p) | SEO | 🔴 |
| 29 | `hareket-hedefe-gore-v1.html` | Rehber | sabit (22 li · 21 p) | SEO | 🔴 |
| 30 | `hareket-bolgeye-gore-v1.html` | Rehber | sabit (10 li · 22 p) | SEO | 🔴 |
| 31 | `hareket-masa-basi-v1.html` | Rehber | sabit (22 li · 21 p) | SEO | 🔴 |
| 32 | `hareket-isinma-soguma-v1.html` | Rehber | sabit (22 li · 21 p) | SEO | 🔴 |
| 33 | `hareket-sozluk-v1.html` | Rehber | sabit (25 li · 23 p) | SEO | 🔴 |
| 34 | `hesabim-v1.html` | Hesap ayarları | localStorage | — | ⬜ |
| 35 | `iletisim-v1.html` | İletişim formu (6 alan) + adres | gömülü | `admin-ayarlar` (e-posta/telefon/adres alanları var) | 🟡 |
| 36 | `index.html` | Prototip dizini (63 bağ) | sabit HTML | — | 🔴 |
| 37 | `mesajlarim-v1.html` | Üye⇄antrenör mesajlaşma | `fit-mesaj.js` `DEMO` (3 mesaj) + localStorage | — | 🔴 |
| 38 | `odemelerim-v1.html` | Üyelik ve faturalandırma | gömülü `SEANSLAR`(3)/`PAKETLER`(2)/`GECMIS`/`IADELER` + `fit-fatura.js` defter (**10 fatura × 13 alan**) | `admin-odemeler` · `admin-hizmetler` (okuma) | 🟡 |
| 39 | `paketlerim-v1.html` | Üyenin paketleri | `fit-paket.js` | `admin-paketler` | 🟡 |
| 40 | `pro-odeme-v1.html` | Abonelik ödemesi | `fit-paket.js` | `admin-paketler` (yalnız fiyat) | 🟡 |
| 41 | `pro-v1.html` | Pro satış sayfası | `fit-paket.js` + 12 anlatım bloğu | `admin-paketler` | 🟡 |
| 42 | `profil-v1.html` | Üye profili (4.300 satır) | gömülü `COURSEDEF`(6)/`POOL`(6)/`MENUS`/`COVERS` | — | 🔴 |
| 43 | `program-detay-v1.html` | Program detayı | gömülü `VERI` = **4 program × 3 alan** (ad/başlık/tür) + **hafta planı TAMAMEN SABİT HTML**: 3 hafta sekmesi · 4 gün kartı · **32 hareket satırı**, dört programda da AYNI | `admin-programlar` (üst künye) | 🟡 |
| 44 | `program-liste-v1.html` | Program listesi | 9 kart (4 benzersiz slug) | `admin-programlar` | ✅ |
| 45 | `programini-bul-v1.html` | Program bulucu sihirbazı | gömülü `ADIMLAR` + `KATALOG`(7 × 11 alan) + `REHBER` | — | 🔴 |
| 46 | `programlar-merkezi-v1.html` | Program vitrini | gömülü hedef çipleri | `admin-taksonomi` (hedef sözlüğü) | 🟡 |
| 47 | `programlarim-v1.html` | Fit Planım (4.432 satır) | localStorage + gömülü `EFOR`/`KIYAS`/`KANIT`/`DONEM` tabloları | — | 🔴 (tablolar) |
| 48 | `reklam-ver-v1.html` | Reklam satış sayfası | gömülü `P` = **8 reklam formatı × 7 alan** | `admin-reklam` var ama **envanteri EŞLEŞMİYOR** (aşağıda C-7) | 🔴 |
| 49 | `rozetlerim-v1.html` | Rozet ve kademe | `fit-rozet.js`: **50 rozet · 9 aile · 8 kademe** | `admin-rozetler` (2 alan) | 🟡 |
| 50 | `saglik-bilgilendirme-v1.html` | Sağlık uyarısı sayfası | sabit HTML (41 blok) | `admin-ayarlar` (2 uyarı metni + sayfa seçimi) | 🟡 |
| 51 | `sozluk-v1.html` | Spor Sözlüğü | `sozluk-veri.js`: **254 terim · 10 kategori · 29 harf** | — | 🔴 |
| 52 | `sozluk-detay-v1.html` | Terim detayı | aynı modül (terim başına 9 alan) | — | 🔴 |
| 53 | `veri-islem-kaydi-v1.html` | Veri işlem kaydı | gömülü `KAYIT` = 15 satır × 6 alan | — | 🔴 |
| 54 | `yasal-v1.html` | Yasal metinler | gömülü `L` = **10 belge** + `ORDER` 11 kalem + 5 kez tekrarlanan sağlık uyarısı, 31 KB metin | — | 🔴 |

### A tablosu özeti

| Durum | Sayfa |
|---|---|
| ✅ tam yönetiliyor | **4** (10, 17, 22, 44) |
| 🟡 kısmen | **18** |
| 🔴 YÖNETİLMİYOR | **30** |
| ⬜ üye verisi (admin'de yeri yok) | **2** (12, 34) |

---

## B · Veri modülü → admin ekranı, alan farkıyla

| Veri kaynağı | Kayıt | Kayıt başına alan | Okuyan public sayfa | Yöneten admin | Admin'de düzenlenebilen alan | **ALAN FARKI** |
|---|---|---|---|---|---|---|
| `sozluk-veri.js` | **254 terim** + 10 kategori | 9 (`terim,ingilizce,kategori,tanim,ornek,harf,kunye,slug,_ara`) | `sozluk-v1`, `sozluk-detay-v1` | **YOK** | 0 | **9 / 9 eksik** |
| `anatomi-veri.js` | **31 kas + 12 hareket + 4 harita** | kas başına ad/açıklama/harita eşlemesi | `anatomi-v1` | **YOK** | 0 | **tamamı eksik** |
| `egzersiz-detay-v1.html` `VERI` | **25 hareket** (100 adım + 100 ipucu metni) | 14 | `egzersiz-detay-v1` | `admin-hareketler` | 11 alan (ad, slug, kas, ekipman, seviye, bölge, süre, kategori, alternatif, birincil, ikincil) | **10 eksik**: `ozet`, `gorsel`, `ekipmanIkon`, **`adimlar`**, **`ipuclari`**, `benzer`, `sureBant`, `pop`, `uyari`, `HAREKET_EK.alternatif` |
| `fit-testi-detay-v1.html` `VERI` | **7 test** | 16 | `fit-testi-detay-v1` | `admin-testler` | 5 künye + 3 bant × (ölçüt/seviye/program) | **11 eksik**: `img`,`ozet`,`amac`,`amacList`,`uygun`,`uygunDegil`,`sureKisa`,`sureNot`,`ekipman`,`guvenlikEk`,**`adimlar`(5)**, bant `ozet` |
| `program-detay-v1.html` `VERI` + sabit HTML | **4 program**, hafta planı sabit | 3 alan + 3 hafta/4 gün/**32 hareket satırı** | `program-detay-v1` | `admin-programlar` | 9 künye alanı | **hafta/gün/hareket kurgusunun TAMAMI eksik (0 alan)** |
| `program-liste` kartları | 9 kart / 4 benzersiz slug | 12 | `program-liste-v1` | `admin-programlar` | 9 | **3 eksik**: `ekipmanKod`, `pop`, `baslik` |
| `fit-challenge.js` `KATALOG` | **3 challenge** | 14 | `challenge-merkezi`, `challenge`, `challengelarim` | `admin-challenge` | 10 | **4 eksik**: `kategoriAd`, `donem`, `uzunOzet`, `gorsel` |
| `fit-rozet.js` `KATALOG` | **50 rozet** | 9 | `rozetlerim`, `challenge`, `egzersizlerim` | `admin-rozetler` | **2** (kademe seçimi + puan) | **7 eksik**: `slug`,`ad`,`aile`,`ico`,`olcut`,`hedef`,`nasil` |
| `fit-rozet.js` `AILELER` | **9 aile** | 4 | aynı | `admin-rozetler` (yalnız dağılım matrisi, salt okuma) | 0 | **4 / 4 eksik** |
| `fit-rozet.js` `KADEMELER` | **8 kademe** | 5 | aynı | `admin-rozetler` | 2 (`minPuan`, `minGun`) | **3 eksik**: `key`,`ad`,`ico` |
| `fit-paket.js` `KADEMELER` | **3 kademe** | 12 | `pro`, `pro-odeme`, `paketlerim`, `odemelerim` | `admin-paketler` | **1** (`fiyat`) | **11 eksik**: `key`,`ad`,`ikon`,`kart`,`one`,`yonelme`,`belirtme`,`tamlayan`,`ozet`,`fiyatMetin`,`birim` |
| `fit-paket.js` `GRUPLAR` | **7 grup · 30 modül · 90 hücre** | grup: ad+ikon; modül: ad + 3 kademe değeri | aynı | `admin-paketler` matris | **yalnız 90 hücre değeri** | grup ve modül **adı/ikonu/sırası düzenlenemez; ekleme-silme yok** |
| `fit-fatura.js` `DEFTER` | **10 fatura** | 13 | `odemelerim`, `destek` | `admin-odemeler` (okuma), `admin-hizmetler` | 0 (salt okuma) | **13 / 13 eksik** |
| `fit-ulke.js` | **199 ülke** | 3 | `giris`, `hesabim`, `odemelerim` | **YOK** | 0 | **3 / 3 eksik** |
| `fit-mesaj.js` `DEMO` | 3 mesaj + `EK_IKON` | 4 | `mesajlarim` | **YOK** | 0 | **tamamı eksik** |
| `fit-su.js` sabitleri | `DK_BASINA_ML=10`, `KCAL_BASINA_ML=1.5`, `EK_TAVAN_ML=1500`, `EK_ADIM_ML=50` | 4 parametre | `challenge`, `egzersizlerim`, `programlarim` | **YOK** | 0 | **4 / 4 eksik** — K13'e göre panelden okunmalıydı |
| `fit-shell.js` menü dizileri | `NAV`(4+9 alt) · `BOTTOM`(5) · `FOOTER_COLS`(3+14) · `FOOTER_CORP`(8) · `FOOTER_LEGAL`(6) · `PLAN_TABS`(4) · `PLAN_EXTRA`(3) · `DESTEK_TABS`(3) · `ACCOUNT`(8) · `RAIL`(6) = **73 kalem / 10 dizi** | 4–5 | tüm sayfalar | `admin-menu` | **kendi 46 satırlık KOPYASI** (header 4 · alt 5 · footer 23 · hesap 14), yalnız `sira` + `görünürlük` | **NAV alt menüsü (9) · PLAN_TABS(4) · PLAN_EXTRA(3) · DESTEK_TABS(3) · RAIL(6) = 25 kalemin satırı bile YOK** |
| `fit-admin-veri.js` `SOZLUK` | kas 10 · ekipman 15 · seviye 3 · **süre 5** | 3 | `egzersiz-kutuphane` süzgeci | `admin-taksonomi` | kas · ekipman · seviye · hedef | **`süre` sözlüğü (5 terim) taksonomi ekranında YOK** |
| `fit-admin-veri.js` `SAYFA` | **54 sayfa** | 5 | — | `admin-sayfalar` | 5 (dosya, başlık, açıklama, robots, canonical) | 0 alan farkı — ama **38/54 sayfanın açıklaması boş, 54/54 canonical boş** |
| `yasal-v1.html` `L` | **10 yasal belge** (31 KB) | başlık + gövde | `yasal-v1` | **YOK** | 0 | **tamamı eksik** |
| `destek-v1.html` S.S.S. | **30 soru / 6 kategori** | soru + cevap + kategori | `destek-v1` | **YOK** | 0 | **tamamı eksik** |
| `reklam-ver-v1.html` `P` | **8 reklam formatı** | 7 (`loc,url,title,fmt,desc,metrics,schema`) | `reklam-ver` | `admin-reklam` — **farklı 10 alan kodu** | 0 | **eşleşme yok** |
| `antrenor-detay-v1.html` `VERI` | **12 antrenör** | 3 (+14 sabit blok) | `antrenor-detay` | `admin-antrenorler` (başvuru kararı) | 3 (inceleyen, karar, gerekçe) | **profil içeriğinin tamamı eksik** |
| `antrenorler-v1.html` kartlar | **8 antrenör kartı** | gömülü HTML | `antrenorler` | **YOK** | 0 | **tamamı eksik** |
| `programini-bul-v1.html` `KATALOG` | **7 kayıt** | 11 | `programini-bul` | **YOK** | 0 | **11 / 11 eksik** |
| `antrenman-olusturucu` `KURALLAR` | 13 kural anahtarı + `HAREKET_EK` 25 | — | `antrenman-olusturucu` | **YOK** | 0 | **tamamı eksik** |

---

## C · Yönetilmeyenler — ağırlık sırasına göre

Ağırlık = (etkilenen kayıt/metin sayısı) × (kaç public sayfayı vurduğu).

### 🥇 C-1 · Hareket anlatımı: 200 metin, 25 hareket, hiçbiri düzenlenemiyor
`admin-hareketler-v1.html` künyeyi (ad, slug, taksonomi, alternatif) yönetiyor
ama **hareketin kendisini anlatan metni yönetmiyor**: 25 hareket × 4 adım = **100
adım metni**, 25 × 4 ipucu = **100 ipucu metni**, ayrıca `ozet`, `gorsel`,
`benzer`, `sureBant`, `pop` ve `antrenman-olusturucu`daki `uyari`.
→ **`admin-hareketler` formuna 10 alan eklenmeli**; `adimlar` ve `ipuclari` için
sıralanabilir tekrarlı alan (repeater) gerekiyor, tek `<textarea>` yetmez.

### 🥈 C-2 · Program kurgusu: hafta/gün/hareket TAMAMEN sabit
`program-detay-v1.html`de hafta planı sabit HTML: **3 hafta sekmesi · 4 gün
kartı · 32 hareket satırı**, ve dört programın dördü de aynı markup'ı görüyor —
slug yalnız ad/başlık/tür üçlüsünü değiştiriyor (`program-detay-v1.html`,
`var VERI` bloğu). `admin-programlar` 9 künye alanı yönetiyor, **kurgudan 0 alan**.
→ **Yeni ekran gerekli: "Program kurgusu" (hafta → gün → hareket).** En az
`hafta`, `gün`, `hareket slug`, `set`, `tekrar`, `dinlenme`, `not` alanları.

### 🥉 C-3 · Spor Sözlüğü: 254 terim, sıfır yönetim
`sozluk-veri.js` 1.540 satır, **254 terim × 9 alan**, 10 kategori, 29 harf
indeksi; iki public sayfayı besliyor (`sozluk-v1`, `sozluk-detay-v1`) ve
`hareket-sozluk-v1` rehberi ona bağlanıyor. **Hiçbir admin ekranı okumuyor bile.**
`admin-taksonomi` bu değil — o `egzersiz-kutuphane` süzgecinin 4 sözlüğünü
(36 terim) yönetiyor.
→ **Yeni ekran gerekli: "Spor Sözlüğü"** — liste + terim formu (9 alan) + kategori
yönetimi (10 kayıt).

### C-4 · Yasal metinler + S.S.S.: 40 metin bloğu, sıfır yönetim
`yasal-v1.html` içinde **10 yasal belge**, 31 KB gömülü metin, 5 kez tekrarlanan
sağlık uyarısı; ~~`ORDER` 11 ilan ediyor ama `L` 10 tanımlıyor~~ **⚠ YANLIŞ ÖLÇÜM, düzeltildi: `ORDER` 11 · `L` 11, kesişim tam, kusur YOK**. `destek-v1.html` içinde **24 S.S.S. kaydı /
6 kategori** (⚠ düzeltildi, yukarı bak). `admin-destek` yalnız talepleri yönetiyor.
→ **İki ekran gerekli: "Yasal Belgeler"** (sürüm + yürürlük tarihi + gövde) ve
**"S.S.S."** (kategori + soru + cevap + sıra).

### C-5 · Paket yönetimi — Beyar'ın 1. maddesi: DOĞRULANDI, eksik sanılandan büyük
`admin-paketler-v1.html` (429 satır) üç kart taşıyor. Tek tek ölçüldü:

| Beklenen yetenek | Var mı | Ölçüm |
|---|---|---|
| Paket **oluşturma** | ❌ | Sayfada "Yeni paket" düğmesi yok (`h-acts` yalnız "Üye yüzünü gör" bağlantısı) |
| Paket **silme** | ❌ | Hiçbir satırda sil düğmesi yok |
| **Fiyat belirleme** | ✅ | `pk-fiyat` number input × 3 kademe |
| Kademe **diğer alanları** | ❌ | 12 alanın 11'i (ad, ikon, kart, one, yönelme/belirtme/tamlayan, özet, fiyatMetin, birim, key) düzenlenemez |
| **Modül⇄kademe seçimi** | ✅ | `pk-sec` select × **90 hücre** (30 modül × 3 kademe), Kapalı/Açık/kapsam metni |
| Pakete **özellik ekleme-çıkarma** | ❌ | 30 modül ve 7 grup sabit; ekleme/silme/sıralama yok |
| Yeni **kapsam metni** tanımlama | ❌ | Seçenekler yalnız o satırın bugün kullandığı değerlerden üretiliyor (ekranın kendi notu bunu söylüyor) |
| **Karşılaştırma tablosu** yönetimi | 🟡 | Tablo matristen basılıyor; ama grup adı/ikonu/sırası ve modül adı yönetilemiyor |
| Abonelik dışı ücret metni | ✅ | `pkAyriF` textarea |

→ **`admin-paketler`e eklenmeli:** kademe CRUD (12 alan), grup CRUD (2 alan),
modül CRUD (1 alan + sıra), kapsam metni sözlüğü.
**Not (K6):** abonelik VARDIR kararı geri geldiği için Gastro'nun *Planlar ·
Abonelikler · Faturalar · Kuponlar* dörtlüsünün Fit karşılığı hâlâ yok —
`admin-hizmetler` yalnız hizmet satışını, `admin-odemeler` yalnız antrenör
ödemesini görüyor. **Abonelik listesi ekranı YOK, kupon ekranı YOK, fatura
ekranı YOK** (`fit-fatura.js` 10 faturayı tutuyor, hiçbir ekran yönetmiyor).

### C-6 · Modül kapsamları — Beyar'ın 2. maddesi: DOĞRULANDI
`admin-hareketler-v1.html` yalnız **25 egzersizi** yönetiyor. Alt içerikler:

| Alt içerik | Public sayfa | Kayıt | Dosya | Yöneten |
|---|---|---|---|---|
| **Hareket rehberi** | `hareket-rehberi-v1` + 8 alt sayfa = **9 sayfa** | 153 `<li>` + 171 `<p>` sabit blok (⚠ 177 yanlıştı, `<link>` sayılmış) | HTML gömülü | **YOK** (yalnız SEO) |
| **Spor sözlüğü** | `sozluk-v1`, `sozluk-detay-v1` | **254 terim / 10 kategori** | `sozluk-veri.js` | **YOK** |
| **Anatomi haritası** | `anatomi-v1` | **31 kas · 12 hareket · 4 harita** | `anatomi-veri.js` | **YOK** |
| **Antrenman oluşturucu** | `antrenman-olusturucu-v1` | 13 kural + 25 hareket eki | HTML gömülü | **YOK** |

→ **`admin-hareketler` bir "Hareket Kütüphanesi" bölümüne dönüşmeli**, altında
dört kalem: Egzersizler · Rehber sayfaları · Spor sözlüğü · Anatomi.

### C-7 · Reklam envanteri iki farklı dil konuşuyor
`admin-reklam-v1.html` **10 alan kodu** tutuyor: `hub-ust · hub-orta ·
kutuphane-yan · program-liste · egzersiz-alt · challenge-ust · antrenor-yan ·
sozluk-alt · defter-video · hub-sponsor`.
`reklam-ver-v1.html` **8 format** satıyor: `masthead · leaderboard ·
native-liste · mpu · niyet-native · mobil-sticky · challenge-native · half-page`.
**Kesişim: 0.** Yönetim panelindeki alanla satılan reklam aynı şey değil.
Üstelik `admin-reklam`da **tek bir düzenlenebilir alan yok** (3 arama kutusu
hariç `<input>`/`<select>` sayısı 0); "Yeni alan" ve "Yeni kampanya" düğmeleri
form açmıyor, yanına "bu turda çizilmedi" notu basıyor (`yakinNot`, 437. satır).
→ Önce **envanter sözleşmesi** birleştirilmeli, sonra alan/kampanya/kreatif
formları çizilmeli.

### C-8 · Rozet ekleme — Beyar'ın 5. maddesi: DOĞRULANDI, yok
`admin-rozetler-v1.html`de **hiç `<form>` yok**; "Yeni rozet" düğmesi yok.
Düzenlenebilen tek şey satır içi input'lar: kademe eşikleri (`minPuan`,
`minGun` × 8) ve rozet başına (`kademe` select + `puan` input). **50 rozetin
9 alanından 2'si.** Aile (9 kayıt × 4 alan) salt okunur matris.
→ Rozet formu (9 alan) + aile formu (4 alan) + "Yeni rozet"/"Yeni aile"/sil.

### C-9 · Fit testleri — Beyar'ın 4. maddesi: kısmen var, soru seti yok
`admin-testler-v1.html`de **"Yeni test" düğmesi VAR** ve gerçek form açıyor:
Ad · Slug · Kategori · Süre · **Ölçüm sorusu** · 3 bant × (ölçüt, seviye,
önerilen program) = 14 girdi.
Ama her test **tek soruludur** (`olcumSoru` bir string, `olcum` 3 banttan
oluşuyor) — çoklu soru seti yapısı ne veride ne ekranda var.
**Yönetilemeyen 11 alan:** `img`, `ozet`, `amac`, `amacList`(3), `uygun`(3),
`uygunDegil`(3), `sureKisa`, `sureNot`, `ekipman`(4), `guvenlikEk`, **`adimlar`(5
adım × 7 test = 35 metin)**, bant `ozet` metinleri.
**"Test doldurulabiliyor mu?"** — public tarafta evet (`fit-testi-detay-v1.html`
644 satır JS, sonucu `fit-testi-sonuc-v1.html`e taşıyor); **admin tarafta
doldurulan testlerin sonucunu gören ekran yok** (`admin-raporlar`da test kalemi
yok).

### C-10 · Menü yönetimi — Beyar'ın 7. maddesi: %63 kapsam, üstelik kopya üzerinden
Gerçek menü `fit-shell.js`te **10 ayrı dizide, 73 kalem**.
`admin-menu-v1.html` bunları okumuyor; **kendi 46 satırlık kopyasını** tutuyor
(`var KALEMLER`, 162. satır) — dosyanın kendi notu da bunu söylüyor
("bu dosyadaki `KALEMLER` silinir ve yerine tek satır okuma gelir").
Kapsanan: header 4 · alt 5 · footer 23 · hesap 14.
**Kapsanmayan 25 kalem:** NAV açılır menüleri (9), `PLAN_TABS` (4),
`PLAN_EXTRA` (3), `DESTEK_TABS` (3), `RAIL` (6).
Düzenlenebilen alan: **yalnız `sira` (number) ve `görünürlük` (select)** — ad,
href, ikon, sütun düzenlenemiyor; ekleme/silme yok.

### C-11 · Kazançlar ve ödemeler — Beyar'ın 6. maddesi: düzenlenebilir alan YOK
`admin-odemeler-v1.html`de dört para parametresi **`readonly`** basılıyor
(`paramAlan()`, 246. satır: `readonly aria-readonly="true"`), yanlarında kilit
ikonu ve "Ayarlar'da düzenle" bağlantısı. Ekrandaki tek etkileşim:
dönem `<select>` + onay `<input type="checkbox">` + "Ödemeyi başlat"
(maketKaydet).
**Bu doğru bir tasarım kararı** — K13 parametrelerin tek yerde durmasını
istiyor ve `admin-ayarlar`da dördü de gerçekten düzenlenebilir (Hizmet
komisyonu %, Ödeme günü, Ödeme alt sınırı ₺, Fatura eşiği ₺, İade politikası).
**Eksik olan:** ödeme satırı başına eylem (beklet, düzelt, dekont ekle), iade
kararı, ve **fatura defterinin (10 kayıt × 13 alan) hiçbir ekranda yönetilmemesi**.

### C-12 · Ana sayfa ve kurumsal metinler
`dadafit-hub-v1.html` (1.639 satır, 6 bölüm, 12 `<h2>`), `hakkimizda-v1.html`
(43 blok, sıfır JS), `saglik-bilgilendirme-v1.html` (41 blok),
`fit-planim-veri-izin-v1.html`, `veri-islem-kaydi-v1.html` (15 satır kayıt),
`giris-v1.html` metinleri, `index.html`.
`admin-sayfalar-v1.html` bu 54 sayfanın **yalnız `<title>` · `<meta
description>` · `robots` · `canonical`** alanlarını yönetiyor — gövde metnine
dokunmuyor. Üstelik ölçüldü: **38/54 sayfanın açıklaması boş, 54/54 canonical
boş**; ekranın kendi metni "60 satır" diyor ama tablo **54** satır (metin bayat).
→ Sayfa gövdesi için ya bir blok editörü ya da "İçerik blokları" ekranı gerekli.

### C-13 · Antrenör kataloğu
`antrenorler-v1.html`de **8 antrenör kartı sabit HTML**;
`antrenor-detay-v1.html`de **12 antrenör × 3 alan** (ad/unvan/fiyat) + tek bir
profilin 14 sabit bölümü. `admin-antrenorler` yalnız **başvuru kararını**
yönetiyor (3 alan: inceleyen, karar, gerekçe).
→ Antrenör profili varlığı (foto, uzmanlık, sertifika, fiyat, takvim, konum)
hiçbir ekranda yok. Liste ile detayın kayıt sayısı da tutmuyor (**8 ≠ 12**).

### C-14 · Bağlantı ve ölçüm sabitleri
`bagli-uygulamalar-v1.html` **4 sağlayıcı** (akıllı saat, Apple Health, Health
Connect, manuel), `fit-su.js` **4 hesap sabiti** (10 ml/dk · 1,5 ml/kcal ·
1500 ml tavan · 50 ml adım), `egzersizlerim-v1.html` `KCAL_DK`/`ADIM_DK`
katsayı tabloları, `fit-ulke.js` **199 ülke**.
K13 "hiçbiri koda gömülmez, panelden okunur" diyor — bu dört küme gömülü.

### C-15 · Mesajlaşma
`fit-mesaj.js` (796 satır) üye⇄antrenör sohbetini tutuyor; `mesajlarim-v1.html`
onu basıyor. **Hiçbir admin ekranı mesajı görmüyor** — `admin-moderasyon`
bildirimleri (13 örnek kayıt) yönetiyor, mesajları değil. K8 destek pilotu
Diet'te; mesaj moderasyonu ayrı bir konu ve yüzeyi yok.

---

## D · "Yeni ekle" denetimi — 21 ekran, tek tek

| # | Admin ekranı | "Yeni …" düğmesi | Gerçek form açıyor mu | Form alanı | Kaydet | Not |
|---|---|---|---|---|---|---|
| 1 | `admin-v1` (Genel Bakış) | ❌ yok | — | 0 | yok | Yalnız KPI + iki bağlantı; varlık yönetmiyor |
| 2 | `admin-hareketler` | ✅ `#hkYeni` "Yeni hareket" | ✅ gizli kart açılıyor (`#hkForm`) | **11** | `maketKaydet('hareket')` | Satır başına düzenle düğmesi de var |
| 3 | `admin-programlar` | ✅ `#pgYeni` "Yeni program" | ✅ | **9** | `maketKaydet` | Hafta/gün kurgusu formda yok |
| 4 | `admin-challenge` | ✅ `#chYeni` "Yeni challenge" | ✅ | **10** | `maketKaydet` | `gorsel`, `donem`, `uzunOzet` yok |
| 5 | `admin-testler` | ✅ `#tsYeni` "Yeni test" | ✅ | **14 girdi** (5 künye + 3 bant × 3) | `maketKaydet` | `adimlar`, `ekipman`, `uygun` yok |
| 6 | `admin-taksonomi` | ✅ `#txYeni` "Yeni terim" | ✅ (4 sekmeli, 4 gizli kart) | **4** | `maketKaydet` | `süre` sözlüğü sekmesi yok |
| 7 | `admin-sayfalar` | ⚠️ `#syEksik` — "Yeni" DEĞİL | Süzgeç kısayolu (açıklaması boşları filtreler) | 5 (satır düzenleyince) | `maketKaydet` | Sayfa **oluşturulamaz**, yalnız SEO düzenlenir |
| 8 | `admin-uyeler` | ❌ yok | Satıra tıklayınca `#uyDetay` açılıyor | **2** (Rol, Hesap durumu) | `maketKaydet('yetki değişikliği')` | Üye eklenemez (doğru — üye kendi kaydolur) |
| 9 | `admin-antrenorler` | ❌ yok | ✅ `#adKararF` (başvuru kararı) | **3** | `maketKaydet` ×3 | Antrenör profili eklenemez/düzenlenemez |
| 10 | `admin-moderasyon` | ❌ yok | ✅ `#mdF` (uyarı) | **3** | `maketKaydet` ×2 | Kuyruk ekranı; ekleme doğal değil |
| 11 | `admin-destek` | ❌ yok | ✅ `#dkF` (yanıt) | **3** | `maketKaydet` ×2 | S.S.S. yönetimi yok |
| 12 | `admin-hizmetler` | ❌ yok | ✅ `#hzIaForm` (iade kararı) | **7** (4'ü readonly parametre) | `maketKaydet` | Hizmet/paket **oluşturulamaz** |
| 13 | `admin-odemeler` | ❌ yok | ✅ `#pyForm` | **1** (onay kutusu) + 4 **readonly** parametre + 1 dönem select | `maketKaydet('ödeme dönemi')` | Beyar'ın 6. maddesi doğrulandı: düzenlenebilir alan yok |
| 14 | `admin-rozetler` | ❌ yok | ❌ **hiç `<form>` yok** | satır içi: 16 eşik input + 50 kademe select + 50 puan input | `maketKaydet` ×2 | Beyar'ın 5. maddesi doğrulandı: rozet eklenemez |
| 15 | `admin-paketler` | ❌ yok | 🟡 `#pkAyriF` (yalnız ücret metni) | **1** textarea + 3 fiyat input + **90 matris select** | `maketKaydet` ×3 | Paket/grup/modül eklenemez-silinemez |
| 16 | `admin-menu` | ❌ yok | ❌ **hiç `<form>` yok** | satır içi: 46 sıra input + 46 görünürlük select | `maketKaydet('menü düzeni')` | Kalem eklenemez; ad/href/ikon düzenlenemez |
| 17 | `admin-reklam` | ⚠️ `#rkAlanYeni`, `#rkKamYeni` | ❌ **form açmıyor** — `yakinNot()` "bu turda çizilmedi" notu basıyor | **0** | `maketKaydet('reklam düzeni')` (doğrulanacak form yok → konsol uyarısı) | Tek düzenlenebilir alan yok |
| 18 | `admin-bildirim` | ❌ yok | ✅ `#bdF` (satır seçince) | **9** | `maketKaydet` | Şablon **eklenemez**, yalnız düzenlenir |
| 19 | `admin-ayarlar` | ❌ yok (gerekmez) | ✅ 3 form: `#ayMarkaF`, `#ayParaF`, `#ayHealthF` | **15** | `maketKaydet` ×4 | Panelin en dolu yazma yüzeyi; K13 parametreleri burada |
| 20 | `admin-log` | ⚠️ `#lgDisaAktar` (dışa aktar) | ✅ `#lgSaklaF` (saklama politikası) | **2** | `maketKaydet` | Log ekleme doğal değil |
| 21 | `admin-raporlar` | ❌ yok | ❌ form yok | **0** (1 dönem select) | `maketKaydet` **0** | Salt okuma; dışa aktarma düğmesi de yok |

### D özeti

- **"Yeni …" düğmesi olan ekran: 6/21** — hareketler, programlar, challenge,
  testler, taksonomi, reklam(×2).
- **Gerçek form açan: 5/21** (reklam'ın iki düğmesi form açmıyor).
- **Hiç `<form>` etiketi olmayan ekran: 4** — rozetler, menü, reklam, raporlar.
- **Sıfır düzenlenebilir alan: 2** — reklam, raporlar.
- **Bir kayıt SİLME yüzeyi olan ekran: 0/21.**
- **Toplam form alanı (21 ekran): 99 `fk-field`** + satır içi kontroller.
- **Kaydeden ekran: 0/21** (tasarım gereği — §0.1).

---

## Yönetilmeyen kalem sayısı

| Kategori | Sayı |
|---|---|
| Hiçbir admin ekranı olmayan public sayfa | **30 / 54** |
| Hiçbir admin ekranı okumayan veri modülü | **7** (`sozluk-veri`, `anatomi-veri`, `fit-ulke`, `fit-mesaj`, `fit-su` sabitleri, `yasal` L, `destek` S.S.S.) |
| Admin'de karşılığı olmayan **alan** (B tablosu toplamı) | **≥ 96** |
| Admin'de karşılığı olmayan **metin bloğu** | **≥ 460** (100 adım + 100 ipucu + 35 test adımı + **24** S.S.S. + **11** yasal belge + **153** rehber `<li>` + 32 program hareket satırı) — ⚠ üç sayı düzeltildi, yukarı bak |
| Yönetilmeyen **kayıt** | **≥ 610** (254 sözlük + 199 ülke + 50 rozet + 31 kas + 30 modül + 15 veri kaydı + 12 hareket haritası + 10 fatura + 8 antrenör + 8 reklam formatı + …) |

---

## Ölçüm komutları (yeniden üretim)

```bash
cd /Users/gaviaworks/Developer/Projects/dadafit-prototip
ls -1 *.html | wc -l                       # 75
ls -1 admin-*.html | wc -l                 # 21
grep -c 'class="fk-field"' admin-*.html    # ekran başına form alanı
grep -c 'maketKaydet' admin-*.html         # ekran başına maket kaydet
# ⚠ AŞAĞIDAKİ DESEN YANLIŞ SAYIYOR — kategori SEKME düğmeleri de `data-kat` taşıyor.
# grep -oE 'data-kat="[^"]*"' destek-v1.html | sort | uniq -c   # 30 → 6'sı sekme
# Doğrusu: soru kaydını taşıyan öğeyle sınırla ya da sayfanın kendi sekme
# sayaçlarını oku (4+5+4+4+3+4 = 24).
grep -c 'class="pd-ex"' program-detay-v1.html                 # 32 hareket satırı
grep -c 'class="coach-card"' antrenorler-v1.html              # 8 antrenör
node -e 'global.window=global;require("./assets/js/fit-paket.js");
  var P=window.FIT_PAKET,m=0;P.gruplar.forEach(g=>m+=g.moduller.length);
  console.log(P.kademeler.length,P.gruplar.length,m,m*P.kademeler.length)'  # 3 7 30 90
```
