# KUYRUK — R15 kapanış · 2026-08-30

Sunucu: `python3 -m http.server 8788 --bind 127.0.0.1`
Ölçüm: `PW_HOME=~/.pw node <betik>.mjs` · oturum kipi **`?auth=1`**
(⚠ `dm_fit_login` bu depoda YOK; kabuk `dm_user` okuyup `body.is-auth` basıyor)
Kit: `docs/fit-kit.md` · ölçüm betiği `docs/qa/kit-olcum.mjs`
Devir notu: `~/Desktop/dada-fit-handoff-2.md`

## YAYIN
| Adres | Ne |
|---|---|
| `gaviaworks-dev.github.io/dadafit-prototip/` | **v1** — `d4839be`e sabit |
| `…/dadafit-prototip/v2/` | **v2** — `main`, her push'ta tazelenir |
Workflow `.github/workflows/pages.yml`; yeni dondurulmuş sürüm için `V1_SHA`.

## R15'TE KAPANANLAR
Menü 13→9 kalem · 7 yeni sayfa · 8 sözleşme modülü · 15 sayfa silindi ·
170+ bağlantı yeniden yazıldı · kaydetme · challenge (3 tip) · rozet · puan ·
liderlik · su takibi · kademe (8) · antrenör sohbeti · ödeme ve paketler ·
destek tek adreste · zebra · 44px dokunma hedefi.
**60 sayfa · ölü bağlantı 0 · konsol hatası 0 · "Yakında" 0 · yer tutucu 0.**

---

## SIRADAKİ

### 🔴 1 · ADMİN PANELİNİN GÖRÜNÜMÜ — Gastro'ya birebir çekilecek

**İşlev doğru, arayüz yanlış.** 21 ekran çalışıyor ve bütün ölçüm kapılarını
geçiyor, ama panelin kabuğu ölçülerek değil **uydurularak** kuruldu ve
Gastro'nun admin paneline benzemiyor. Beyar kararı: **yalnız görünüm
değişecek, işlev değişmeyecek.**

**Devir notu: `~/Desktop/dada-fit-admin-handoff.md`** — ölçülen fark tablosu,
21 ekranın listesi, ne değişecek/ne değişmeyecek orada.

Ölçülen yapısal farklar: ikon rail YOK · sidebar BEYAZ (Gastro'da koyu) ·
arama dar ve ortada (Gastro'da geniş ve solda) · sayfa başlığı üst barda
(Gastro'da gövdenin içinde) · KPI kartı yatay (Gastro'da dikey: ikon → sayı →
etiket → trend) · sağ kolonda tablo (Gastro'da "Hızlı Aksiyonlar" listesi) ·
daralt düğmesi altta tam genişlik (Gastro'da kenarda yüzen tutamak).

**Marka rengi yeşil kalır** — alınan yapıdır, renk değil.
İş iki dosyada: `assets/css/fit-admin.css` · `assets/js/fit-admin.js`.
Kaynak: `~/Developer/Backend Projects/dadagastro-profil` 🔴 salt okuma ·
`resources/views/admin/layout.blade.php` · `public/reference/…/sa-shell.css`.
⚠ **KOD ALMA, YAPI AL.**

### 🔴 2 · K6 GERİ ALINDI — Fit'te abonelik VAR

`CLAUDE.md` K6 maddesi güncellendi. Panele abonelik ekranları gelecek
(Gastro karşılığı: Planlar · Abonelikler · Faturalar · Kuponlar; "Creator
Planları"nın Fit karşılığı antrenör hizmet paketi onayıdır).
`admin-hizmetler-v1.html` **kalır** — hizmet satışı abonelikten ayrı akış.
`fit-fatura.js`teki `tur:"uyelik"` satırları artık çelişki değil, doğru veri;
raporlardaki uyarı şeridi kalkmalı. Sidebar 21 → ~24–25 ekran.

---

### 🟢 YÖNETİM PANELİ — R16/2, bu oturumda kuruldu

**Giriş adresi: `http://127.0.0.1:8788/admin-v1.html`**

Fit'te yönetim paneli yoktu (depoda yalnız `antrenor-panelim-v1.html` vardı, o
antrenörün kendi paneli). Sıfırdan kuruldu; iskelet **Gastro'nun ölçülen
sidebar'ı**, dört markada aynı olacak şekilde.

| Parça | Dosya |
|---|---|
| Plan | `docs/fit-admin-plan.md` (§9 Gastro hizalaması + düzeltilen dört sapma) |
| Kabuk | `assets/css/fit-admin.css` · `assets/js/fit-admin.js` |
| Kit | `docs/fit-kit.md` §13 (`.adm-*` ailesi) |
| Denetim | `docs/qa/admin-denetim.mjs` — 21 ekran × 4 genişlik, bütün kapılar |

**21 ekran · 3 bölüm** (Genel Bakış + Ana içerik · Operasyon · Yapılandırma).
Ortak 13, Fit'e özel 8 — Diet ve Gourmet'e taşınırken 13'ü aynen gider.

**Gerçek veri okuyan ekranlar** (ikinci kopya tutulmuyor): Genel Bakış ·
Challenge · Rozetler ve Kademeler · Paketler ve Özellikler. Kalanı örnek veri ve
**her ekran bunu kendi kaynak şeridinde yazıyor** (`.adm-src`, `is-canli` /
`is-ornek`) — "maket olanı gerçekmiş gibi gösterme" kuralı tek bileşene indi.

**Gastro'dan alınan iki yetenek:** yönetimde arama (21 ekranı arar; içerik
araması yapmıyor ve bunu söylüyor) · menüyü daralt (276→74px, tercih saklanır).

**Bilerek ayrılan iki nokta:** Rozetler ve Kademeler tek kalem (Gastro'da iki —
ikisi de aynı motordan geliyor) · Sponsorluk ve Reklam tek kalem + sekme
(Gastro'da yedi — Fit'te arkasında altı boş ekran olurdu).

**Kapanış ölçümü:** 21 ekran × 4 genişlik — yatay taşma **0** · konsol hatası
**0** · ölü bağlantı **0** (136 bağlantı) · 44px altı dokunma hedefi **0** ·
kaynak şeridi 21/21 · sidebar'da tek doğru aktif kalem 21/21 · boş durum kusuru
**0**. Betik: `docs/qa/admin-denetim.mjs` (`PW_HOME=~/.pw node …`).
Tüm site: **81 sayfa · konsol 0 · taşma 0 · 460 bağlantı · ölü 0**.

### Panelin AÇIK KALEMLERİ (sonraki tur)

1. 🔴 **K6 · `fit-fatura.js` defterinde `tur:"uyelik"` satırları duruyor**
   ("DadaFit Pro — Aylık · Platform paketi", 99,00 ₺ × 3). K6 "Fit'te abonelik
   YOKTUR" diyor. Silinmedi ve hizmet cirosuna karıştırılmadı: raporların
   finansal sekmesinde **ayrı kalem** olarak, uyarı şeridiyle duruyor.
   Kalem kalkacaksa **defterin kendisi** düzeltilmeli. Aynı çelişki public
   tarafta da var: `pro-v1.html` ve `pro-odeme-v1.html` yerinde duruyor.
2. **K12 üretici eşikleri Fit'te tanımsız.** Gastro'da panelden ayarlanan dört
   eşik var (50 tarif · 25 püf · 10 takip · 10 takipçi). Fit'te karşılığı
   yok, Ayarlar'da o sekme **açılmadı** — arkasında veri olmayan sekme boş
   ekran vaat etmek olurdu.
3. **Toplu seçim 11 ekranda**, Gastro'da 47 kalemden 1'inde. Ödemelerden
   kaldırıldı (K5'i çiğniyordu: ödeme listesi kuralla doğuyor, elle seçimle
   değil). Kalanlar dürüst ("uygulanmadı, sunucu yok") ama parity için
   gözden geçirilmeli.
4. **Moderasyon rakamı iki dosyada** (`admin-moderasyon` + `admin-raporlar`
   özeti). Gerçek kaynak doğunca ikisi de ondan okumalı; ortak bir
   `fit-moderasyon-veri.js` gerekebilir.
5. **Programlar: 9 kartın 9'u yanlış sayfayı açıyor.** `program-liste-v1.html`
   9 kart taşıyor, `program-detay-v1.html` yalnız 4 slug tanıyor; kartlar o
   dördünü döngüyle kullanıyor, eşleşen **0/9**. Hareket tarafında bir kez
   temizlenen kusurun program eşi. `admin-programlar-v1.html`de "Açtığı sayfa"
   kolonu olarak görünür durumda.
6. **Hedef sözlüğü iki kez, farklı terimlerle ilan edilmiş** (`program-liste`
   vs `programlar-merkezi`): 8 ilan, 6 benzersiz kod, ortak iki kodun etiketi
   bile ayrışıyor. Hangisinin kanon olacağı ürün kararı, birleştirilmedi.
7. **Taksonomi boşluğu:** ekipman **15 ilan / 5 kullanımda** (10 çip süzgeçte
   0 sonuç veriyor), kas **10 / 9** (`onkol` boş).
8. **SEO:** 60 public sayfanın 43'ünde meta description yok, 0'ında canonical,
   16 başlık 60 karakteri aşıyor. (60/60 `noindex` kasıtlı, kusur değil.)
9. **Liste aramasının yeri — 21 ekranlık tek elden süpürme.** Gastro'da arama
   sayfa üstünde değil, kartın **filtre şeridinde solda**; bizde kart
   başlığının sağında. Ajan F kendi beş ekranında taşımayı **bilerek
   yapmadı**: yalnız 5'ini taşımak 21 ekranın 5'ini ötekilerden ayırırdı —
   kuralın önlemek istediği şeyin ta kendisi. Ya hepsi ya hiçbiri; aynı
   `<input>` düğümü `.c-head`den filtre şeridine taşınacak.
10. **`hesabim-v1`de 10 ölü seçici** (`.sub-inv-*` · `.sub-free*` · `.hs-save`) —
   form kiti taşımasından önce de ölüydü, dokunulmadı.

🔴 **Panel yazma yüzeyi MAKET.** Formlar doğrulanır, kayıt gitmez; her ekran
bunu yazıyor. Panel gerçek yazmayı getirdiğinde o şeritler kalkmalı — şerit
kalırsa yalan tersine döner.

---

### ✅ 1 · Challenge sistemi — KAPANDI (R16, 2026-08-30)

**Devir notunun tablosu iki yerde eskimişti** (ölçüldü): `challenge-v1.html`
zaten motora taşınmıştı (`state.challenge` geçişi 0, katıl/bırak/işaretle
motorda) ve 0 değil **2** katıl düğmesi vardı.

**Asıl kusur başkaydı: HUNİ KOPUKTU.** Motor `slug` · `metrik` · `tarihISO`
alanlarından hesaplıyor, ama depoda o alanları yazan **hiçbir üretici yoktu**
(grep: 0). Yani üç tipten ikisi — egzersiz serisi ve süreli hedef — arayüzden
**hiç ilerlemiyordu**. Ölçen sonda kaydı kendi yazdığı için boşluk görünmüyordu.

Yapılanlar:
1. **Huni bağlandı** — `egzersiz-detay-v1.html` artık `slug` + `metrik:{tekrar,
   set, kg, dk}` + `tarihISO` yazıyor. Üçü de sayfanın kendi ölçümü (kapatılan
   setler, kronometre), uydurma değil; `kaynak:'olculdu'` dürüst kalıyor.
   Kanonik slug tek yerde çözülüyor (`data-ex-slug`) — bilinmeyen slug ekranda
   `goblet-squat`a düşerken kayıt ham parametreyi taşımıyor.
2. **İkinci kayıt yeri söküldü** — `fit-shell.js`teki dört elle-artıran uç
   (`challengeKatil` · `challengeGunTamamla` · `challengeGunKacir` ·
   `challengeBirak`) kaldırıldı. Çağıranı 0'dı; `s.challenge` alanı DURUYOR ve
   okunuyor, ona yalnız motorun `_yansit()`i yazıyor.
3. **Katalog gerçeğe çekildi** (Beyar kararı):
   · `sabah-esneme` → **`ekipmansiz-temel`** · 7 Gün Ekipmansız Temel Seri.
     Yedi adım artık GERÇEK egzersiz slug'ları (kopru · superman · hava-squat ·
     hamle · sinav · dead-bug · plank). Eskiden 25 gerçek slug'a karşı
     **0 eşleşme** vardı — adımı kapatacak sayfa yoktu.
   · `adim-adim-yuruyus` → **`bin-tekrar`** · 21 Günde 1.000 Tekrar.
     "100 km" ölçülemiyordu (GPS yok, `metrik.km` yazan 0 üretici) ve kanıt
     kuralı beyanı elediği için hiçbir yoldan dolamıyordu. Ölçü, uygulamanın
     GERÇEKTEN saydığı şeye çevrildi.
   · Sıra kuralı: **sıralı kaldı** (Beyar kararı).
   · Slug değişimi üç yerde daha yazıldı: `programini-bul-v1` ·
     `programlar-merkezi-v1` · `tests/wizard-page.mjs`.
4. **Challenge Merkezi katalogdan basılıyor** — üç sabit kart, dört sabit çip
   grubu ve üç sabit hero sayısı kaldırıldı. Hepsi kataloğun ikinci kopyasıydı
   ve çelişiyordu: hero "1 aktif · 2 yaklaşan" diyordu (katalog 2 aktif ·
   1 yaklaşan), yürüyüş kartı "Tamamlandı" rozeti taşıyordu (katalog `aktif`),
   süzgeçte katalogda olmayan bir "Tamamlanan" durumu vardı.
   **Katıl düğmesi geldi** (3/3) + "Benim" süzgeç ekseni (katıldıklarım ·
   tamamladıklarım · katılmadıklarım) + katıldıysan kartta ilerleme çubuğu.
5. **Üç tipin izleği ayrıştı** — `seri` artık gün takvimi değil **adım listesi**
   (`.fp-list`/`.fp-row`, yeni sınıf yok): kapandı · sırada (tek eylem düğmesi,
   doğrudan o hareketin sayfasına) · kilitli. Kilitli satırın ikonu nötre
   alındı (`--line`/`--muted`) — yedi yeşil kutu hiyerarşiyi düzlüyordu.
   Başlık ve alt metin de tipe göre kuruluyor.
6. **Yansıtma kusuru** — `challenge.seri` alanı alışkanlıkta "gün", diğer iki
   tipte `biriken`di; `programlarim-v1` onu tipe bakmadan **"güncel seri ·
   N gün"** diye basıyordu (süreli hedefte "132 gün" yazıyordu). Yansıtılan
   nesneye `tip` eklendi, okuyan taraf alışkanlık değilse "—" basıyor.

**KAPANIŞ ÖLÇÜMÜ** (Playwright · `?auth=1` · gerçek arayüzden, sonda veri
yazmadan):
| | |
|---|---|
| Katıl → 1. adım | düğmeye bas · `kopru` sayfasında 4 set kapat · "Antrenmanı bitir" → **seri 0/7 → 1/7**, süreli **0 → 44/1000** |
| İkinci antrenman | **2/7** · **88/1000** · puan **0→55→65** · rozet **0→4→5** · kademe **Kademesiz→Yeni Başlayan** |
| Sıra kuralı | 4. adım sırasız yapıldı → **adım 2/7'de KALDI**, ama süreli hedef **132/1000**'e çıktı (aynı kayıt, iki tip, iki doğru cevap) |
| Merkez | kart 3 · katıl düğmesi 3 · çip grubu 4 · çip 15 · hero **2 aktif · 1 yaklaşan** |
| Süzgeç | "katıldıklarım" → 1 · "+katılmadıklarım" → 3 |
| Adım listesi | 7 satır · 1 açık (44px üstü: **90×50**) · kilitli 6 · satır yüksekliği 76px (kit §8) |
| Yatay taşma | **0** (1440 · 1024 · 768 · 390, 8 sayfa) |
| Ölü bağlantı | **0** (57 benzersiz bağlantı) |
| Konsol hatası | **0** |

Dersler `docs/lessons.md` §23 · §24 · §25.

---

### ✅ 2 · Destek formu koşullu alanlar — KAPANDI (R16)
`destek-v1.html#yeni` formunda alanlar artık talep türüne göre açılıyor.
**Ölçüldü:** 8 konu · randevu alanı **1/8**'de (Antrenör ve randevu) · ödeme
referansı **2/8**'de (DadaFit Pro ve ödeme · Üyelik ve fatura) · kalan 5'te ikisi
de gizli. Gizli alan `required` almıyor (8/8), konu değişince değer temizleniyor.
İki alan da **gerçek kaynaktan** besleniyor: randevu `FIT_SHELL.state.randevular`,
ödeme referansı `fit-fatura.js` defterinden (10 fatura). Kayıt yoksa seçici
dürüstçe "Kayıtlı randevun yok" deyip `disabled` kalıyor — uydurma `RND-…`
satırları silindi.
Yakalanan kusur: `[hidden]` çalışmıyordu, `.fk-grid{display:grid}` onu eziyordu.
Kategori yüksekliği 42 → **45px** (44 hedefinin altındaydı).

### ✅ Hesap ayarları telefon ülke kodu — KAPANDI (bu oturum)
`hesabim-v1.html` profil sekmesindeki telefon alanı düz metin; ülke kodu
seçicisi yok.
`giris-v1.html`dekinin aynısı gelecek: bayrak · ülke adı · alan kodu ·
aranabilir liste.
🔴 **`assets/js/fit-ulke.js` zaten var, oradan beslenecek — ikinci kopya
üretilmeyecek.** (Aynı hata bir kez yapıldı: liste `giris-v1`de satır içiydi,
ikinci gerçek kaynak olmasın diye modüle taşındı.)
**Ölçüldü:** 199 ülke · varsayılan 🇹🇷 · "alman" → 1 sonuç (Almanya +49) ·
seçim gizli alana `DE` yazıyor · Esc kapatıyor · taşma 0 · konsol 0.
Ayrıca üç sayfada düğme 96×43 → **96×45** (1px dokunma hedefi eksiğiydi).

### ✅ 5 · Egzersiz ekleme — KAPANDI (R16)
**Ölçüldü:** "Programa ekle" düğmesinin JS dinleyicisi bile yoktu; giriş
yapılmışken tıklayınca **0 localStorage anahtarı** değişiyordu ve sayfa
`fit-plan-kayit.js`i hiç yüklemiyordu. Sahte değil, sessizdi.
İki ayrı düğme kuruldu: **Bugünkü antrenmana ekle** (aktif planın sıradaki günü,
tek dokunuş) ve **Programa ekle** (gün seçici).
**Kanıt:** `1:sinav` → `1:sinav+goblet-squat` · yenilemeden sonra duruyor ·
ikinci tık çiftlemiyor · Planım'da `#fpxHareketler` **2 öğe** · konsol 0.
Yazılan künye uydurma taşımıyor: set = paneldeki satır sayısı, tekrar = girilen
değer, alternatif adı `ED_VERI`den.

---

## AÇIK KALEMLER (veri ya da karar bekliyor)

1. **Pro Max fiyatı** — `fit-paket.js`te `fiyat:null`, ekranda "Fiyat onay
   bekliyor". Rakam gelince tek satır; kart, tablo ve ödeme özeti aynı diziden
   basıldığı için üç ekran birden güncellenir.
2. **İlçe listesi** — 81 il tam; 973 ilçe serbest metin. Hafızadan üretmek
   yanlış veri riskiydi. Gerçek liste verilirse tek dosyaya girer.
3. **Hatırlatma** — su takibinde ayar ekranı gerçek, bildirim maket ve bunu
   ekranda söylüyor. Backend gelince bağlanır.
4. **Kademe alanı** — `dm_user` şemasında `paket` YOK; profil kartı savunmacı
   okuyup "Ücretsiz" basıyor (onaylandı).
5. **Üyelik tarihi** — hiçbir şemada kayıt tarihi yok, kartta "—".
6. **Ölü CSS** — `fit-planim.css`teki `.fpx-kol-*` kuralları koleksiyon
   kalkınca ölü kaldı. Regex denemesi dosyayı kırdı, geri alındı; düzgün bir
   CSS ayrıştırıcısıyla alınmalı.
7. **Kit boşluğu — `.fk-*` form kiti kabukta değil.** Ölçüldü: `.fk-cc*`
   kuralları üç sayfada tekrarlanıyor (`giris-v1` 36 · `hesabim-v1` 32 ·
   `odemelerim-v1` 30 geçiş). VERİ tek kaynakta (`fit-ulke.js`) ama GÖRÜNÜM
   değil — bir ölçü düzeltilince üç dosya birden değişmesi gerekiyor.
   Ajan 2 kabuğa yazamadığı için kopyalamak zorunda kaldı. `.fk-*` ·
   `.form-card` · `.cc-*` · `.sub-tier-*` ailesiyle birlikte
   `assets/css/fit-shell.css`e taşınmalı.
   ⚠ Taşırken `docs/fit-kit.md` §7'yi de güncelle.
8. **`h1` semantiği** — modül sayfalarında `<h1>` sayfa adı değil kullanıcı adı
   (kasıtlı). Sayfa adı breadcrumb, `<title>` ve sekme şeridinde.

9. 🔴 **Rail İKİ KEZ tanımlı.** R17'de ölçüldü: `assets/css/fit-shell.css` §N
   (satır 1473+) rail'i zaten kurmuş — 2026-08-29 dalgası, public operasyon
   paneli için (`body[data-fit-rail="1"]`), o zaman yönetim paneli yoktu.
   `assets/css/fit-admin.css` §1 aynı bileşeni yönetim kabuğu için yeniden
   kuruyor. **Değerler çakışmıyor, ÖRTÜŞÜYOR** — iki bağımsız ölçüm de
   Gastro'dan `--sa-rail-w:76px` ve `--rail-bg:#19160F` okumuş; bu, ölçümün
   doğruluğunun kanıtı ama iki tanım tek bileşen için fazladır.
   **Somut zarar ölçüldü:** `fit-shell.css:1531`in `.sa-rail-foot a,
   .sa-rail-foot span{width:38px;height:38px}` kuralı (özgüllük 0-2-1)
   admin'in `.sa-sig`ini (0-1-0) eziyordu ve dokunma hedefini 44'ün altına
   düşürüyordu; `admin-icerik-olcum.mjs` yakaladı, `fit-admin.css`te
   özgüllük yükseltilerek geçildi — kök neden duruyor.
   **Yapılacak:** tek tanıma indir. Hangisinin kalacağı bir karar: rail
   public operasyon panelinde de kullanılıyorsa `fit-shell.css` kalır ve
   admin yalnız kendi farkını yazar. 60 public sayfayı ilgilendirdiği için
   R17'de yapılmadı.
10. **`admin-destek-v1`de kimlik hücresi yok.** Öteki üç operasyon ekranı
   `.u-cell` (38px avatar + ad/e-posta) kullanıyor; destek kuyruk kartı
   (`.set-row`) tablo değil, üye adı satır açıklamasında düz metin.
   Kalıbı zorlamak bileşeni yeniden kurgulamak olurdu (Ajan 3 ölçüp durdu).
   Kuyruk kartına kimlik hücresi gerekiyor mu — ürün kararı.

---

## R19'DA KAPANANLAR (2026-08-30)

| # | Kalem | Nasıl kapandı |
|---|---|---|
| 2 | İlçe listesi — 81 il tam, 973 ilçe serbest metin | **Yarı kapandı.** 81 il artık bir modülde: `assets/js/fit-il-veri.js`, üreteci `tools/il-veri-uret.mjs` — `odemelerim-v1.html`e gömülü `<option>` yığınından ÇIKARILDI, elle kopyalanmadı, public sayfa değişmedi. **973 ilçe hâlâ yok**; alan serbest metin ve ekran bunu söylüyor. |
| 4 | Kademe alanı — `dm_user` şemasında `paket` yok | Üye detayında **"—" + gerekçesiyle** görünür oldu. |
| 5 | Üyelik tarihi — hiçbir şemada kayıt tarihi yok | Aynı desen. Ayrıca üye listesinden **"Kayıt" kolonu kaldırıldı**: uydurulmuş tarih basıyordu (7 → 6 kolon). |
| 10 | `admin-destek-v1`de kimlik hücresi yok | Kuyruk kartına kimlik hücresi eklendi; kart tabloya çevrilmedi. |

## R19'DA AÇILAN YENİ KALEMLER

11. 🔴 **`.cmp-table` iki public sayfada İKİ KOPYA ve ölçüldü ki ZATEN AYRIŞMIŞLAR.**
   `pro-v1.html` (31 `.cmp-*` kuralı) ile `paketlerim-v1.html` (25 kural)
   aynı bileşeni ayrı ayrı tanımlıyor ve değerleri **artık aynı değil**:

   | Ölçü | `pro-v1` | `paketlerim-v1` |
   |---|---|---|
   | `.cmp-table` `min-width` | `660px` | `640px` |
   | hücre dolgusu | `13px 18px` | `12px 16px` |
   | `thead th` rengi | `--muted` + `uppercase` + `sticky` | `--slate-2`, ikisi de yok |
   | `.cmp-hint` | `display:none` | `display:flex` |

   Yani kullanıcı iki sayfada **farklı bir tablo** görüyor. Yönetim paneli
   karşılaştırma tablosunun önizlemesini gösterecekse **üçüncü kopyayı
   yazmak** gerekirdi; B1 ajanı doğru davrandı ve yazmadı.
   **Yapılacak:** `.cmp-*` kabuğa (`fit-shell.css`) taşınır, iki sayfa da
   oradan okur. Hangi değerlerin kanon olacağı bir karar — iki sayfa iki
   farklı şey ölçmüş. **İki public sayfayı ilgilendirdiği için R19'da
   yapılmadı.**

12. **Reklam envanteri: 8 satılan format ↔ 10 yönetilen alan, eski kesişim 0.**
   R19'da envanter tek kaynağa alındı (`assets/js/fit-reklam-veri.js`, iki
   taraf da depodan okundu) ve eşleşme ekranda **görünür** kılındı: birebir
   oturan **1**, kısmi **3**, karşılıksız kalanlar satırda yazılı.
   **Yapılacak:** eşleşmeyenler bir ÜRÜN kararı — hangi format hangi alana
   düşecek, ya da hangisi kalkacak.

13. **`FIT_SU`nun `EK_ADIM_ML` sabiti dışa verilmiyor.** Ayarlar'ın
   "Sağlık ve ölçüm sabitleri" sekmesi üç sabiti modülden okuyor (10 ml/dk ·
   1,5 ml/kcal · 1500 ml tavan); dördüncüsü `fit-su.js` içinde var ama
   `FIT_SU`dan verilmiyor, ekranda **"—"** kalıyor. Sayı uydurulmadı.
   Aynısı `KCAL_DK`/`ADIM_DK` katsayıları için: paylaşılan modülde değil,
   `egzersizlerim-v1.html`in içinde. K13 "koda gömülmez" diyor.

14. **8 destek konusunun 3'ünün hızlı çözüm yönergesi yok** —
   *Üyelik ve fatura · Antrenör ve randevu · Uygulama hatası*. Bu üçünü
   seçen üye, öncesinde okuyacağı bir şey bulamıyor. Ters yön temiz (5
   yönergenin 5'i de formda karşılık buluyor). İçerik kararı.

15. **`docs/fit-spec-kopukluklari.md` — public yüzeyde 22 mantık kopukluğu.**
   Bu tur yalnız ÖLÇÜLDÜ, hiçbiri düzeltilmedi (kapsam yönetim paneliydi).
   En ağırı: `dm_fit.bugun`da tarih alanı yok ve gün dönümünde sıfırlayan
   kod yok — 9 gün önceki 40 dk ekranda **"90 dk bugün"** olarak görünüyor.
   `fit-su.js` bunu doğru yapıyor (`gunler:{'YYYY-MM-DD'}`); geride kalan
   tek yer kabuk.

16. **Ajanların ortak scratchpad'i çakışıyor.** B5, sondasının başka bir
   ajan tarafından ezildiğini bildirdi (`olc.mjs`). Ajan brifingine
   "geçici dosya adına kendi ön ekini koy" kuralı eklenmeli.

---

## SONRAKİ OTURUM: ADMİN PANEL
`fit-paket.js` (kademe⇄özellik matrisi) ve `fit-challenge.js` (challenge
kataloğu) bugün okunabilir veri; panel yazma ucunu ekleyecek. Ayrıntı devir
notunun 6. bölümünde.
