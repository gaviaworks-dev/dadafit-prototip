sartname v1.8.1 · 2026-08-29

# Dada Arayüz Şartnamesi — dört marka

🔴 **BU DOSYA DÖRT DEPODA BİREBİR AYNI OLACAKTIR.**
`dadagastro-profil` · `dadadiet` · `dadagourmet` · `dadafit-prototip`

Ortak depo, symlink ve dış yol bağımlılığı **yoktur** — her şerit kendi
ağacındaki bu dosyayı okur. Değiştiren **dördünü birden** değiştirir ve
yukarıdaki sürüm damgasını yükseltir. Sapma her dalga sonunda `md5` ile
ölçülür (§Z2).

Bu belge `dadadiet/docs/hesap-sozlesmesi.md` (v2.6, md5
`558208c924ed04655759990e6ff3b7ee`) desenini izler ve **onun yerine geçmez,
yanına gelir**. Sözleşme *veriyi* bağlar; bu şartname *arayüzü* bağlar.

**Kaynak:** `~/Desktop/dada-hesap-onizleme.html` (3.170 satır, md5
`abe8fb6e03d95bfd4029b80472e91d55`) ve `~/Desktop/dada-onizleme-handoff.md`
(317 satır, md5 `33cedbd7785ee21451288415f1570caf`). Bu turda **hiçbir depoya
yazılmadı**; `dadadiet/docs/hesap-sozlesmesi.md` yalnız biçim emsali olarak
okundu.

**v1.8.0 → v1.8.1:** Eylem alanı düzeltildi (Beyar, 2026-08-29).
`.btn--ghost` satırda krem/beyaz kutular üretiyordu (`background:var(--paper)`)
ve `14px 26px` dolgusu düğmeyi sütundan taşırıyordu. İki kalem de satırın
**kendi** eylem kitine (`.ntr-mark`) bağlandı: zeminsiz, kenarlıksız, yalnız
hover'da renk. Ayrıca **ızgara şablonu ile hücre genişliği ayrışmıştı**
(92px ↔ 132px) ve on satırın onu da satırdan 20px taşıyordu — Ç18'e
"ikisi aynı olmak zorunda" hükmü yazıldı. Ölçüm: zemin şeffaf, kenarlık 0,
yükseklik [28], taşan öğe **0**. PATCH.

**v1.7.1 → v1.8.0:** Üç kusur kapandı (Beyar, 2026-08-29).
① **Ç2a — banner kendi grubuna geçti: "Akış" · 280px.** Liste grubu (515)
ölçümle fazla çıktı: liste banner'ları istatistik satırı taşır (§R9), bu
yüzey taşımaz. Sayı §R1'in Profil/Hesap değeridir, ayrı grup olması §R5'in
deseni. Ölçüldü: 280 · crumb 128 · blok merkezi **204 = 204**.
② **Ç20 — takip kalemi gerçek düğme oldu.** Uç zaten canlıydı
(`follow.toggle`); kalem bir `<span>` rozetti, yani **sahte düğme**.
Projenin takip formu birebir alındı, tıklanarak doğrulandı.
③ **Ç19 — tik etiketlendi, okunmadı beneği kalktı.** İkonun anlamı yalnız
görünmeyen `title`daydı; benek ise aynı durumu söyleyen üçüncü işaretti.
MINOR.

**v1.7.0 → v1.7.1:** §Ç23'e düğme çifti işlendi (Beyar, 2026-08-29):
*"Tarihe Göre Süz"* → **"Filtrele"** (birincil) ve yanına her zaman basılan
**"Temizle"** (ikincil). Kit projenin kendisi; enjeksiyon karşılaştırmasında
iki düğmede de fark `[]`. Üye tarafındaki `.btn` çakışması (`portal.css:151`
`min-height:auto`) ve ghost düğmenin kenarlıksızlığı ölçümle kayda geçti.
PATCH.

**v1.6.1 → v1.7.0:** Süzgeç bölümü düzeltildi (Beyar, 2026-08-29).
① **Ç23 eklendi** — tarih süzgeci tek satır; üç kontrolün yüksekliği ve üst
kenarı ölçümle **tek değer** (48 / 681). Eski `.fk-grid` alanları sütuna
yayıyordu.
② **Ç14 ters çevrildi** — tür kapat/aç bildirim merkezinde **basılmaz**;
kontrol yalnız hesap ekranının matrisinde kalır, merkez oraya tek bağlantı
taşır. Aynı kolonu yazan ikinci yüzey karışıklık üretiyordu. Sunucu ucu
duruyor.
③ **Ç15 daraltıldı** — kuralı ekranda anlatan uzun etiket, anlattığı
kontrolle birlikte kalktı. Hüküm aynı.
④ **Ç21 ters çevrildi** — tip şeridi artık panelin **yatay merkezinde**
(ölçüm: sol 174 = sağ 174), "aynı sol çizgide" değil.
⚠ MAJOR değil MINOR: Ç14 ve Ç21 bu turda yazılmış `Ö` satırlardı ve aynı
gün, aynı yüzeyin ilk kurulumu sırasında yeniden kararlaştırıldılar.

**v1.6.0 → v1.6.1:** **§C14 ölçümle düzeltildi, §Ç22 eklendi** (2026-08-29).
Tip şeridine önceki turda **uydurulmuş bir çip varyantı** yazılmıştı (12.5px ·
dolgu `7px 14px` · sürekli fısıltı zemin). Projenin gerçek kiti ölçüldü —
`portal.css:459-466` ile `dd-shell.css:280-286` **birebir aynı**: 13px/500 ·
kâğıt zemin · `--slate` metin · dolgu `8px 15px` · `radius-sm` · gap 9px.
Varyant kaldırıldı, kit birebir uygulandı ve **enjeksiyon karşılaştırmasıyla**
kanıtlandı (dokuz özellikte fark `[]`). Aynı ölçüm **§C14'ün tarifini de
yanlışladı**: fısıltı zemin + derin ton metin taban değil, `:hover`/`.active`
hâlidir — satır düzeltildi. PATCH+MINOR → MINOR.

**v1.5.0 → v1.6.0:** Bildirim ekranı **banner ailesine oturtuldu ve ölçüldü**
(Beyar, 2026-08-29). Banner artık **liste grubunun sabit değerini** taşıyor
(515px; sayı ikinci kez yazılmadı — `.nt-top` grubun kendi seçicisine
katıldı, §R17 hepsini birlikte 544'e taşıyacak). §R6 üç değeri de ölçümle
tuttu: **128 / 132 / 12.5px**. §R8'in merkezi **tam tuttu: 322 = 322**.
Dört yeni kural: **Ç18** (satır ızgarası, sabit eylem sütunu — kit Diet'in
`.ntf-row`undan), **Ç19** (boş yuva görünmez ama yeri durur, §B9 deseni),
**Ç20** (takip kalemi düğme gibi), **Ç21** (şerit/kart/sütun aynı sol
çizgide). Üçü de **ölçülmüş kusurdan** doğdu: satır flex olduğu için sağ
kenar her satırda kayıyordu ve `.ntr-act`/`.ntr-av`/`.ntr-th` için CSS hiç
yoktu. MINOR.

**v1.4.1 → v1.5.0:** Üç iş (Beyar, 2026-08-29).
① **§Ç2 TERS ÇEVRİLDİ ve yeniden yazıldı** — bildirim merkezi **modül sayfası
değil, BANNER ailesindendir (§R)**; **kimlik bandı YOK**. Gerekçe ölçülen
kusur: kapak görseli olmayan yüzeyde bant üstte boş koyu alan bırakıyor,
şerit havada kalıyordu. Yeni alt kurallar **Ç2a–Ç2e**: banner (§R6 128/132
ölçüldü), dikişli panel (−22px · 22px · gölge, deponun kanon token'ından),
şerit **panelin içinde**, kit `.chip-filter`, süzme sunucuda.
② **Yeni kural B14** — bölme ritmi 16px, sarmalayıcıyı da aşar. Ölçülen
kusur: `veri` sekmesinde dört boşluk 0px'ti; `<form>` ve `.dash-cols`
kart komşuluğunu kırıyordu (§B7 ailesi). Düzeltildi, altı sekmede yeniden
ölçüldü.
③ **G16 uygulandı, G18 `T` → `Ö`** — menü kabı `max-height` taşımıyordu ve
uzun menünün alt kalemleri görünmüyordu. Gerçek yükseklik **702px** ölçüldü
(hesaplanan 719 değil).
⚠ **MAJOR değil MINOR**: Ç2 bir `T` satırıydı (hedef), ters çevrilen bir
`Ö` hükmü değil.

**v1.4.0 → v1.4.1:** Kabuk **kaynak markada uygulandı** (§Y‑18 md.1-2) ve
uygulanırken ölçülen iki kit eksiği ile bir davranış düzeltmesi kayda geçti:
**§Ç15a** (üye boş durumu `.pnl-empty` ve durum rozeti `.pstat` kaynakta yok —
mevcut kit korundu, karar Beyar'a) ve **§Ç15b** (istemci süzgeci sayfalamayla
çakışıyordu; sunucu süzgeci bunu kapattı). Hüküm değişmedi, ölçüm eklendi.
PATCH.

**v1.3.0 → v1.4.0:** **§Ç2 netleştirildi, §Ç2a ve §Ç2b eklendi** (Beyar,
2026-08-29). v1.2.0'ın Ç2'si kabuğu *"§F'nin modül sayfası kalıbı"* diye
yazıyordu ve bir boşluk bırakıyordu: **şeritte ne olacağı**. §F3 modül
şeridinin kalem sayısını marka başına kilitliyor, §F2 tam bir `aria-current`
istiyor; bildirim merkezi bir modül olmadığı için o şeride ne konabiliyor ne
de konmadan bırakılabiliyordu. Karar: şerit **§I7'nin desenini** izler —
yüzey kendi bölümlerini şerit yapar — ve **ekseni tiptir** (Ç2a), **süzme
sunucu taraflıdır** (Ç2b). **§Y‑18 kapandı**: kabuk önce kaynak markada
düzeltilir, sonra taşınır. Ç2 `T` → `Ö` oldu. MINOR.

**v1.2.0 → v1.3.0:** **H29'un KAPSAMI daraltıldı** (Beyar, 2026-08-29).
Kural *"kullanıcıya görünen her yerde Şifre"* diyordu ama **ölçütü** ham
dosyada `[Pp]arola` arıyordu ve ekranda hiç basılmayan iki şeyi de kırmızı
sayıyordu: **form alan adları** ve **yorum satırları**. İkisi de muaf oldu;
gerekçe **§H29a**'da, uygulaması ölçütün kendisinde. **H30'un sayıları
yeniden ölçüldü** — Diet'te ham 98 geçişin **56'sı görünen**, 42'si muaf.
Hüküm değişmedi, ölçüt kuralın söylediği şeye hizalandı. MINOR: bir sayı
değişti ve yeni bir alt bölüm (§H29a) eklendi.

**v1.1.3 → v1.2.0:** Beyar'ın dört kararı işlendi (2026-08-29).
① **§Y‑3 KAPANDI** — Diet'e bildirim merkezi **kurulacak**; kalem eksik
bırakılmıyor. G13 artık ölçülür, G4'ün Diet sayısı **14**'te kalır.
② **Yeni bölüm: Ç — BİLDİRİM MERKEZİ** (15 kural). Dört markada aynı kabuk,
aynı sekme yapısı, aynı boş durum; içerik markaya özel. Taban ölçümü
Gastro'nun bugün yayında olan `/bildirimler` yüzeyidir.
③ **Üç yeni uygulama kuralı: U6 · U7 · U8.** U6 §G20'nin okunuşunu
düzeltir (*"sahte link konmaz, ama eksik yetenek kurulur"*), U7 marka arası
taşımayı **birebir** yapar, U8 iyileştirmenin **kaynakta** yapılıp dörde
birden ineceğini bağlar. "Beş kural" başlığı **sekiz kural** oldu.
④ **Ç bölümünün kabuğu için kayıtlı sapma:** Gastro'nun bugünkü ekranı bu
şartnamenin modül sayfası kalıbını KULLANMIYOR (kendi `.nt-*`/`.ntr-*` kiti,
kendi CSS'i, kimlik bandı ve `.pf-tabbar` yok). Karar (Beyar, 2026-08-29):
**önce kaynak markada şartnameye çekilir, sonra dörde birden taşınır** —
U8'in ta kendisi. Ç2 hedefi yazar, §Y‑18 sırayı takip eder.
**MINOR** (§W4): yeni bölüm ve yeni kurallar eklendi, ters çevrilen hüküm yok.

**v1.1.2 → v1.1.3:** Diet'te koşan tarayıcı turunun iki bulgusu işlendi
(Beyar, 2026-08-29). **B7'nin şerhi düzeltildi** — kural duruyor ama
gerekçesi artık ölçüme uygun: kusur Diet'te bugün ateşlemiyor, ezme
savunma amaçlıdır. **B12'nin şerhine** Diet'in kırılım düzeltmesi işlendi;
şartnamenin ≤900px sınırı değişmedi, uygulanan taraf değişti. PATCH —
iki hüküm de aynı kaldı, yalnız gerekçeleri ölçümle güncellendi.

**v1.1.1 → v1.1.2:** **G2 boşluğu kapandı** (Beyar, 2026-08-28 · §Y‑17).
Boşluğu Diet'in şartname kapısı bulmuştu: G2'nin "3 ayraç" sayısı
önizlemenin render'ından geliyordu ve orada menünün başında kimlik bloğu
yoktu. G2 yeniden yazıldı — **kimlik bloğu + 4 grup, aralarında 4 ayraç**.
Kimlik bloğunun menüde bulunması da kural oldu: yeni **G21**, ölçüsü
Diet'in gerçek kabuğundan. MINOR — bir sayı değişti ve bir kural eklendi.

**v1.1.0 → v1.1.1:** Dört depodaki dosya adı `docs/arayuz-sartnamesi.md`
olarak sabitlendi (Beyar, 2026-08-28); §W3 · §Z1 · §Z2'deki dört yol atıfı
düzeltildi. PATCH — hüküm değişmedi.

**v1.0.0 → v1.1.0:** Beyar'ın altı kararı işlendi (2026-08-28). Kapanan
kalemler: **Y‑2** (Diet rozet kalemi adı) · **Y‑11** (gri metin tonu) ·
**Y‑12** (Sayfalar kaleminin adı) · **Y‑13** (Şifre / Parola) · **Y‑14**
(onay kutusu sayısı) · **Y‑15** (kayıt telefon alanı). Y‑9 ile birlikte
yedisi §Y1'e taşındı. Yeni: **Ş bölümü** — SMS ve telefon doğrulama
altyapısı, 14 kural, Dalga 7 kapsamı. Yeni kurallar H29–H33 · J18 ·
Ş1–Ş14; yeniden yazılanlar G14 · H27 · Ü4. Yeni açık kalem: **Y‑16**
(SMS sağlayıcısı).
⚠ **Sürüm MINOR'dur, MAJOR değil** (§W4): H27 bir `T` satırıydı, ters
çevrilen bir hüküm değil — `T` → `Ö` çevrimi MINOR'dur.

**Bu sürümde:** **327 kural**, **22 kural bölümü** (A–Ü, `Q` kullanılmadı;
**Ç** v1.2.0'da eklendi) artı beş meta bölüm (V · W · Z · Y · X). Önizlemenin 25 bölümünün tamamı ve
handoff'un 35 kararı taranmıştır. Dayanak dağılımı: **295 ölçüm** (7'si
tarayıcıda), **12 türetme**, **9 ölçülemedi**, 1 karma (P5).
Karar durumu: **11 kapandı** (§Y1) · **9 açık** (§Y2).

**v1.2.0'ın 15 yeni kuralı** (§Ç) ölçümden gelir: 14'ü `Ö` — Gastro'nun
bugün yayında olan `/bildirimler` yüzeyi, controller'ı, sunum katmanı ve
stok `notifications` tablosu tek tek okunarak; 1'i (**Ç2**, kabuk) `T` —
hedef yazıldı, kaynakta henüz uygulanmadı (§Y‑18).

**v1.0.0:** ilk sürüm — 282 kural, 20 kural bölümü, 263 ölçüm / 9 türetme /
9 ölçülemedi; 2 kapalı ve 14 açık karar kalemi.

---

## 🔴 BU BELGE NASIL UYGULANIR — sekiz kural

**U1 · Hüküm varsa tartışılmaz.** Kural tablosundaki her satır dört depoda
uygulanır. Uymayan depo uyar; şartname depoya göre esnetilmez.

**U2 · 🔴 KARAR BEKLEYEN'de yakınsama yapılmaz.** §Y'deki bir kalem
kapanmamışsa o konuda **karar verilmemiştir**. Şerit orada kendi markasının
**bugünkü şeklini korur**, başka markaya benzetmeye çalışmaz, yeni bir şekil
uydurmaz.

**U3 · Ölçüm kanıtlıdır.** `Ö` işaretli her satırın kaynağı `dosya:satır`
olarak yazılıdır. Bir şerit ölçümün yanlış olduğunu görürse **DURUR ve
raporlar** — belgeyi tek başına düzeltmez.

**U4 · `T` işaretli satır kural değil, türetmedir.** Uygulanır, ama ölçüm
yerine geçmez. Bir `T` satırı ilk gerçek ölçümde `Ö`ye dönüştürülür ve sürüm
yükseltilir.

**U5 · Şartnamede OLMAYAN bir şeyle karşılaşılırsa DUR ve SOR.** Dalga içinde
tam otonom çalışılır, dalga sonunda tek onay kapısı vardır; ama şartnamede
karşılığı olmayan karar **kendi başına verilmez**
(`dada-onizleme-handoff.md:194-198`).

**U6 · 🔴 "Yeteneği olmayan kalem konmaz" ATLAMA GEREKÇESİ DEĞİLDİR.**
(Beyar kuralı, 2026-08-29 — dört depoda geçerli.)

§G20 bundan sonra şöyle okunur: **sahte link konmaz, ama eksik yetenek
kurulur.** Bir kalemin arkasında sayfa olmaması, o kalemi sessizce
düşürmenin gerekçesi olamaz; yeteneğin kendisi eksiktir ve kurulur.

Karşılaşınca yapılacak, bu sırayla:
1. **DUR ve SOR** — *"şu kalemin arkasında sayfa yok, kurulsun mu?"*
2. **"Kalem basılmasın" kararını şerit kendi başına VERMEZ.**
3. Kurulacaksa **aynı dalga içinde** kurulur; "sonraki dalgaya" diye
   kenara konmaz.

Bu kuralla düşürülmüş her kalem geriye dönük olarak açılır ve tek tek
karara sunulur. Hiçbiri sessizce düşmez. İlk uygulaması **§Y‑3**'tür:
Diet'te bildirim merkezi *"rotası yok"* diye atlanmıştı; karar geldi,
yüzey kuruluyor (§Ç).

**U7 · 🔴 MARKA ARASI TAŞIMA BİREBİRDİR.**
(Beyar kuralı, 2026-08-29.)

Bir markada var olan yüzey ötekine taşınırken **yeniden tasarlanmaz,
iyileştirilmez, sadeleştirilmez.** Kaynağın markup yapısı, sınıf kiti,
boşluk değerleri, sekme düzeni, kart tipleri, boş durum metni kalıbı ve
sayfalama biçimi aynen gelir.

**Değişen tek şey: renk ve içerik.**

Taşıma sonrası **ölçülür ve kanıtlanır**: kaynak ile hedefin markup yapısı
ve ölçüleri birebir mi. Fark varsa **tek tek gerekçelendirilir**.
Kaynakta veri karşılığı olup hedefte olmayan bir kalem varsa (örneğin bir
bildirim tipi) **işaretlenir ve SORULUR** — şerit kendi başına düşürmez.

**U8 · 🔴 İYİLEŞTİRME KAYNAKTA YAPILIR VE DÖRDE BİRDEN İNER.**
(Beyar kuralı, 2026-08-29.)

Kaynakta bir kusur ya da daha iyi bir yol görülürse: **DUR ve SÖYLE.**
Şerit kendi başına iyileştirme yapmaz — ama kusuru **gizlemez** de.

İyileştirme kabul edilirse sıra şudur:
1. **Şartnameye yazılır** — yeni hedef budur.
2. **KAYNAK markada uygulanır.**
3. **Sonra öteki üçe taşınır.**

**Tek markada ayrışan iyileştirme YASAKTIR.** Taşıma turunda kusur
görülürse taşıma **kaynağın bugünkü hâliyle** yapılır ve kusur **ayrı
listede** raporlanır; karar gelince dördüne birden uygulanır. Sapmanın
kaynağı tam olarak budur: bir markanın güzelleşip ötekilerin geride
kalması.

---

## 0 · TABLOLARIN OKUNUŞU

Kural numarası bölüm harfi + sıradır. **`U1`–`U5` kural değildir** —
yukarıdaki *nasıl uygulanır* maddeleridir; renk bölümü `Ü` harfini taşır.

Her satır **bir** kuraldır. Altı sütun taşır:

| Sütun | Ne yazar |
|---|---|
| **#** | Kural numarası. Bölüm harfi + sıra. Numara **asla geri dönüştürülmez**; kalkan kural §Y'ye taşınır, numarası boş kalır. |
| **Kapsam** | Hangi ekran, hangi yüzey. |
| **Kural** | Tek cümle, yoruma kapalı. |
| **Değer · kaynak** | Ölçülen sayı/dizgi/sıra ve `dosya:satır`. Başındaki damga dayanağı verir. |
| **Doğrulama** | Çalıştırılabilir ölçüt. |
| **Marka** | `4×` dördünde aynı · `özel` markaya özel · marka adı yalnız o markayı bağlar. |

**Dayanak damgaları**

| Damga | Anlamı |
|---|---|
| **Ö** | Ölçüldü. Kaynak dosya ve satır yazılıdır. |
| **Ö‑tar** | Tarayıcıda ölçüldü (Playwright + Chrome, `getBoundingClientRect`). |
| **T** | Türetme. Ölçülen değerlerden hesaplandı ya da emsalden alındı; render/kod ölçümü **değildir**. U4 geçerli. |
| **X** | **Ölçülemedi.** Sebebi ve ne gerektiği satırda yazılıdır. Kural olarak uygulanmaz. |

**Kaynak kısaltmaları**

| Kısaltma | Dosya |
|---|---|
| `öni:N` | `~/Desktop/dada-hesap-onizleme.html` satır N |
| `hnd:N` | `~/Desktop/dada-onizleme-handoff.md` satır N |
| başka her şey | deponun kendi dosyası, önizlemede yazıldığı hâliyle |

**Doğrulama dili**

| Önek | Nasıl koşulur |
|---|---|
| `js:` | Tarayıcı konsolu ya da Playwright `page.evaluate` |
| `pw:` | Playwright ölçümü (`getBoundingClientRect`), kırılım belirtilir |
| `sh:` | Kabuk komutu, depo kökünde |
| `css:` | Kaynak CSS dosyasında değer karşılaştırması |

---

## A · FONT VE TİPOGRAFİ — bütün yüzeyler

Önizleme bölüm 7. Kesişen kural kümesi: hesap, modül, giriş, abonelik, admin,
başvuru, panel — hepsinde geçerlidir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **A1** | Tüm yüzeyler | Metin ailesi Gilroy'dur; düşüş zinciri yalnız `system-ui, sans-serif` olur, başka aile karışmaz. | Ö · `tokens.css:14` · `dd-shell.css:34` · `gourmet.css:65` · `fit-shell.css:18` (öni:805-806) | `js: getComputedStyle(document.body).fontFamily` üç ad içerir ve ilki `Gilroy` | 4× |
| **A2** | Tüm yüzeyler | Gövde metni 500 ağırlıktadır. | Ö · `body{font-weight:500}` — `tokens.css:243` · `dd-shell.css:95` · `gourmet.css:118` · `fit-shell.css:142` (öni:809-810) | `js: getComputedStyle(document.body).fontWeight === "500"` | 4× |
| **A3** | Tüm yüzeyler | Gövde satır yüksekliği 1.55'tir. | Ö · dört depoda aynı satır (öni:811) | `js: parseFloat(lh)/parseFloat(fs) === 1.55` | 4× |
| **A4** | Tüm yüzeyler | `h1,h2,h3,h4` ağırlığı 700, `line-height` 1.12, `letter-spacing` −.02em'dir. | Ö · `dd-shell.css:101` ve dört depodaki karşılıkları (öni:812-813) | `js:` dört başlık düzeyinde üç değerin eşitliği | 4× |
| **A5** | Font tanımı | Kayıtlı `@font-face` yüzü **iki**dir: `Gilroy@500` ve `GilroyBd@700`. `GilroyXB@800` ve `GilroyLt@300` kullanımdan kalkar. | Ö · bugün dört yüz kayıtlı; 300 ve 800 yalnız marka lockup'ında (`.bd` / `.sf`) kullanılıyor (öni:814-822) · karar hnd:105 | `sh: grep -c "@font-face" <token dosyası>` → `2` | 4× |
| **A6** | Font tanımı | `GilroyBd@700` dört depoda da tanımlıdır. | Ö · bugün yalnız Gastro ve Gourmet'te var (öni:814-819) · karar hnd:106 | `sh:` dört depoda `grep -l GilroyBd` → 4 dosya | 4× |
| **A7** | Font tanımı | 400 (Regular) yüzü kullanılmaz; en hafif metin yüzü Medium@500'dür. | Ö · dört depoda `Gilroy-Regular` dosyası yok (öni:820-821) · karar hnd:105 | `sh: find . -name "Gilroy-Regular*" \| wc -l` → `0` | 4× |
| **A8** | Font dosyası | Font dosyası kümesi üç dosyadır: `Gilroy-Medium.ttf` · `Gilroy-ExtraBold.otf` · `Gilroy-Light.otf`. | Ö · dört depoda aynı üç dosya (öni:807-808) | `sh:` font dizini listesi karşılaştırması | 4× |
| **A9** | Font dosyası | `GilroyBd@700`'ün kaynağı bugün `Gilroy-ExtraBold.otf`'tur; 700 ile 800 aynı dosyaya çözülür. Bu **kayda geçmiş kusurdur ve v1'de düzeltilmez**. | Ö · `tokens.css:53-61` · `gourmet.css:59-70` (öni:819) · erteleme kararı hnd:107 | `sh: grep -A3 GilroyBd tokens.css \| grep -c ExtraBold` → `1` | 4× |
| **A10** | Tüm yüzeyler | Başlık boyutları: sayfa `h1` 24px · kimlik kartındaki ad 29px · kart başlığı `h2` 16px · boş durum `h4` 15.5px. | Ö · `planim.css:93` · `:294` · `:129` · `:249` (öni:539-540) | `js:` dört seçicide `fontSize` | 4× |
| **A11** | Tüm yüzeyler | Sayfada tek `h1` bulunur. | Ö · `planim.css:93` (öni:540) | `js: document.querySelectorAll("h1").length === 1` | 4× |

---

## B · HİZA, IZGARA VE ZEBRA — bütün yüzeyler

Önizleme bölüm 1 ve 7. Bu bölümün B5–B8'i, iki tur boyunca yazılıp
**doğrulanmadığı için işe yaramamış** kuralların ölçülmüş hâlidir
(`hnd:276-280`); değerleri tarayıcı ölçümünden gelir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **B1** | Hesap · modül · giriş · abonelik · admin | Üst bant, sekme şeridi, sayfa başlığı, geniş kart ve dar kart tek kapta durur ve sol/sağ kenarları **28px**'te birleşir. | Ö · `.sheet{padding:0 28px}` — değer kimlik kartının kendi `margin:-78px 28px 0`'ından, `planim.css:280` (öni:500 · öni:843-844) · karar hnd:68 | `pw:` beş öğenin `getBoundingClientRect().left` değeri eşit ve kap sol kenarı + 28 | 4× |
| **B2** | Yan yana ızgaralar | Izgara boşluğu 16px'tir — `.kpi-grid`, `.dash-cols` ve `.pnl-card + .pnl-card` üçünde de. | Ö · `planim.css:40` · `:41` · `:37` (öni:501-502) | `js: getComputedStyle(el).gap === "16px"` | 4× |
| **B3** | Modül · hesap | Sayaç ızgarası `repeat(4, minmax(0,1fr))`'dir. | Ö · `planim.css:40` (öni:502) | `js: gridTemplateColumns` dört eşit sütun | 4× |
| **B4** | Modül · hesap · admin | Kart ızgarası `minmax(0,1.6fr) minmax(0,1fr)`'dir. | Ö · `planim.css:41` (öni:502 · öni:832) | `js: gridTemplateColumns` oranı 1.6:1 | 4× |
| **B5** | Yan yana duran her kart çifti | Aynı satırdaki kartların **üst** kenarı aynı çizgidedir; fark 0px'tir. | Ö‑tar · 1440px'te 28 çift / 0 bozuk, 1100px'te 24 çift / 0 bozuk (öni:861-868) | `pw:` her çiftte `Math.abs(topA − topB) === 0`, 1440 ve 1100'de | 4× |
| **B6** | Yan yana duran her kart çifti | Aynı satırdaki kartların **alt** kenarı aynı çizgidedir; fark 0px'tir. | Ö‑tar · aynı ölçüm (öni:861-865) | `pw:` her çiftte `Math.abs(bottomA − bottomB) === 0` | 4× |
| **B7** | `.dash-cols` · `.kpi-grid` · `.g-grid` | Yan yana ızgaralarda komşuluk üst boşluğu sıfırlanır: `.dash-cols>*+*, .kpi-grid>*+*, .g-grid>*+*{margin-top:0}`. **Kural savunma amaçlıdır** — kusur her markup'ta doğmaz, ama markup düzleşince sessizce doğar. | Ö‑tar · kök neden `.pnl-card + .pnl-card{margin-top:16px}` (`planim.css:37`); önizlemede ölçülen sapma **tam 16px** (öni:873-882). ⚠ **Diet'te bugün ateşlemiyor** — 2026-08-29'da tarayıcıda ölçüldü: ızgara çocukları `.pnl-card` değil çıplak `<div>` sarmalayıcılar (`planim/index.blade.php:216-218`), komşuluk seçicisi hiç kurulmuyor, ölçülen `margin-top` **0px**. Şartnamenin v1.1.2'ye kadarki şerhi Diet için bunun tersini **öngörüyordu**; öngörü ölçümle yanlışlandı ve düzeltildi. | `js:` ızgaradaki ikinci çocukta `marginTop === "0px"` | 4× |
| **B8** | Admin ekran kalıbı `.g-grid` | `.g-grid`'in `align-items` değeri `stretch`'tir; `start` yazılmaz. | Ö‑tar · `start` iken ölçülen alt kenar farkı 5.1px (öni:884-886) | `js: getComputedStyle(".g-grid").alignItems === "stretch"` | 4× |
| **B9** | Kart başlığı | Açıklaması olmayan kartta başlık satırı silinmez, görünmez basılır (`.ph-hold{visibility:hidden}`); yükseklik için `min-height` **verilmez**. | Ö · yükseklik ölçülen kuraldan doğar: 13px × 1.55 + `margin-top:5px`, `planim.css:145` (öni:833-834) | `js:` `.ph-hold` sayısı > 0 ve `visibility === "hidden"`; hiçbir `.pc-head`'de `min-height` yok | 4× |
| **B10** | Kart başlığı | Açıklaması olan kartta `.pc-head:has(p){align-items:flex-start}` uygulanır. | Ö · `planim.css:143` (öni:834) | `css:` kuralın varlığı | 4× |
| **B11** | Bütün belge sayfaları | Bölüm zeminleri beyaz `#ffffff` ile gri `#f9f9f9` arasında **dönüşümlüdür** (zebra). | Ö · `dd-shell.css:67-69`, Diet'in kendi tanımı (öni:431 · öni:541-542) · karar hnd:69 | `js:` ardışık `section`'ların `backgroundColor` dizisi `rgb(255,255,255)` ve `rgb(249,249,249)` sırasını izler | 4× |
| **B12** | Modül · hesap | ≤900px'te `.kpi-grid` ve `.dash-cols` tek sütuna düşer. | Ö‑tar · 900px'te yan yana çift bulunmadı (öni:868). ⚠ Diet'te 2026-08-29'da ölçülen sapma: `planim.css:717` `.kpi-grid`'i ≤1024'te `1fr 1fr` yapıyordu ve 768'de **iki sütun** kalıyordu (ölçüm: 2 çift yan yana). **Karar (Beyar, 2026-08-29): şartnamenin ≤900px sınırı doğrudur, Diet'in kırılımı düzeltilir.** Diet'e `@media (max-width:900px){.kpi-grid{grid-template-columns:minmax(0,1fr)}}` eklendi; yeniden ölçüldü, 768'de `0` çift. | `pw:` 768px ve 414px'te yan yana çift sayısı `=== 0` | 4× |
| **B13** | Giriş · kayıt | ≤640px'te sosyal düğme ızgarası tek sütuna düşer. | Ö · `kimlik-v1.css:300,316` (öni:496) | `pw:` 640px'te `gridTemplateColumns` tek sütun | 4× |
| **B14** | Hesap bölmeleri | Bölmenin **her üst düzey çocuğu** bir öncekinden **16px** uzaktadır — kart, form ya da ızgara fark etmez: `.pf-pane > * + *{margin-top:16px}`. | Ö‑tar · **ölçülen kusur** (2026-08-29, 1440px, `/hesabim?sekme=veri`): dokuz çocuktan **dördünün** arası 16px değil **0px**'ti. Kök neden §B7'nin ailesi: ritim `.pnl-card + .pnl-card` KARDEŞ seçicisiyle veriliyordu ve araya `<form>` ile `.dash-cols` girince komşuluk hiç kurulmuyordu. Öteki beş sekmede yalnız kart olduğu için kusur görünmüyordu. Düzeltildi ve yeniden ölçüldü: **altı sekmede de tek değer, 16px**. ⚠ Aynı turda ölü bir `.dash-row` aracısı da kalktı — boşluğu görünmez bir düğümün `margin-bottom`'ından alıyordu. | `pw:` her bölmede ardışık çocuk boşlukları kümesi `{16}` | 4× |

---

## C · KART KİTİ — sekiz tip, dört markada aynı kalıp

Önizleme bölüm 12. **Yeni kart tipi uydurulmaz** — sekizi de Diet'te bugün
vardır ve kaynak satırıyla yazılıdır. Değişen tek şey renk ve metindir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **C1** | Bütün üye yüzeyleri | Kart tipi sayısı **sekiz**tir: ① selamlama satırı ② sayaç kartı ③ liste kartı ④ ilerleme kartı ⑤ zaman satırı kartı ⑥ boş durum kartı ⑦ çip ⑧ durum rozeti. Dokuzuncu tip üretilmez. | Ö · katalog ve sınıf listesi (öni:1345-1372) | `sh:` kullanılan kart sınıfı kümesi bu sekizin dışına çıkmaz | 4× |
| **C2** | Kart başlığı | `.pc-title` 16px/700, `gap` 10px, `line-height` 1.55, `letter-spacing` normal; başlık ikonu 15px ve marka rengindedir. | Ö · `planim.css:129` · `:130` (öni:506) | `js:` beş değerin eşitliği | 4× |
| **C3** | Kart başlığı | Başlık kabının dolgusu `18px 22px`'tir ve altında 1px kenarlık bulunur. | Ö · `planim.css:96` (öni:506 · öni:836) | `js: padding === "18px 22px"` | 4× |
| **C4** | Kart başlığı | Kart açıklaması `.pc-head p` 13px/500, rengi `--muted`, `margin-top` 5px'tir. | Ö · `planim.css:145` (öni:508) | `js:` dört değerin eşitliği | 4× |
| **C5** | Kart gövdesi | Gövde dolgusu 22px'tir. | Ö · `planim.css:149` (öni:510) | `js: padding === "22px"` | 4× |
| **C6** | Kart ayağı | Ayak dolgusu `14px 22px`'tir ve üstünde 1px kenarlık bulunur. | Ö · `planim.css:151` (öni:510) | `js: padding === "14px 22px"` | 4× |
| **C7** | Sayaç kartı | `.kpi-card` dolgusu 20px, `gap` 14px; ikon 44×44 `radius:12px`; sayı 26px/700 `line-height:1.05` `letter-spacing:-.02em`; etiket 12.5px `--muted` `margin-top:4px`. | Ö · `planim.css:152` · `:158` · `:165` · `:166` (öni:504) | `js:` sekiz değerin eşitliği | 4× |
| **C8** | Sayaç ızgarası | Sayaç kutusu sayısı **dört**tür. | Ö · dört markada da 4 (öni:504 · öni:1351) | `js: document.querySelectorAll(".kpi-card").length === 4` | 4× |
| **C9** | Sayaç ızgarası | Renk varyantları sabittir: ikinci kutu `.warm`, dördüncü kutu `.sun`. | Ö · Diet'in kendi kuralı (öni:1351) | `js:` 2. kutuda `.warm`, 4. kutuda `.sun` sınıfı | 4× |
| **C10** | Liste kartı | `.set-row` dolgusu `17px 2px`, `gap` 16px; ikon 40×40 `radius:12px`; başlık 14px; alt metin 12.5px `margin-top:2px` `line-height:1.45`. Ayraç yalnız komşuluk seçicisiyle verilir. | Ö · `planim.css:502-507` · ayraç `:503` (öni:520 · öni:838) | `js:` yedi değerin eşitliği; ilk `.set-row`'da üst ayraç yok | 4× |
| **C11** | Durum rozeti | `.pstat` 11.5px/700, dolgu `4px 10px`, `radius` 8px, 6px nokta taşır. | Ö · `planim.css:170-174` (öni:524) | `js:` dört değerin eşitliği | 4× |
| **C12** | İlerleme kartı | `.cl-bar` yüksekliği 6px, `radius` 8px; yüzde etiketi 11.5px ve derin marka tonundadır. | Ö · `planim.css:239-243` (öni:1357-1359) | `js:` üç değerin eşitliği | 4× |
| **C13** | Zaman satırı kartı | `.appt-row` dolgusu `14px 22px`, `gap` 16px, zaman kutusu 64px; kartın gövdesi dolgusuzdur (`.pc-body.flush`). | Ö · `planim.css:202-215` · `:150` (öni:1361-1363) | `js:` dört değerin eşitliği | 4× |
| **C14** | Çip | `.chips` boşluğu **9px**'tir. Çip **kâğıt zeminde** (`--paper`), **`--slate` metinle** ve 1px `--line` kenarlıkla basılır: **13px/500 · dolgu `8px 15px` · `radius-sm`**. Marka fısıltı zemini (`--tomato-tint`) + derin ton metin **yalnız `:hover` ve `.active`** hâlleridir; `.active` ayrıca **700** olur. | Ö · `dd-shell.css:280-286` (Diet) ve `portal.css:459-466` (Gastro) — **iki depoda birebir aynı**; aktif durum `portal.css:1733` · `dd-shell.css:1107`. ⚠ v1.6.0'a kadar bu satır çipi *"marka fısıltı zemininde, derin ton metinle"* diye tarif ediyordu; **2026-08-29 ölçümü bunu yanlışladı** — o, taban değil HOVER/AKTİF hâlidir. Taban kâğıt zemindir. §U3 gereği ölçüm kayda geçti. | `js:` yedi değerin eşitliği; `gap === "9px"` | 4× |
| **C15** | Selamlama satırı | Selamlama satırı sayfanın **ilk** kartıdır ve `margin-bottom` 16px taşır. | Ö · `planim.css:42` (öni:1346-1347) | `js:` `.dash-row` ilk kart ve `marginBottom === "16px"` | 4× |
| **C16** | Form alanı | `.fk-label` 14px/700, `gap` 7px, `margin-bottom` 9px; zorunluluk yıldızı marka rengindedir. | Ö · `planim.css:475` · `:476` (öni:512) | `js:` dört değerin eşitliği | 4× |
| **C17** | Form alanı | Alan kutusu 14px/500, dolgu `13px 15px`, `radius` 12px, zemin `#f9f9f9`'dur. | Ö · `planim.css:479` (öni:514) | `js:` dört değerin eşitliği | 4× |
| **C18** | Form alanı | Alanlar arası boşluk 22px'tir; ızgara içinde 0, ızgara boşluğu `16px 18px`, ızgara ile alan geçişi 22px'tir. | Ö · `planim.css:45` · `:495` · `:494` · `:498` (öni:516) | `js:` dört değerin eşitliği | 4× |
| **C19** | Form alanı | Yardım satırı 12.5px `--muted`, `gap` 7px, `margin-top` 8px, `line-height` 1.5; ikonu derin marka tonundadır. | Ö · `planim.css:492` · `:493` (öni:518) | `js:` beş değerin eşitliği | 4× |
| **C20** | Kart ayağı | Kaydet düğmesi kartın ayağında **SOLDA** durur; `.pc-foot`'a hizalama kuralı yazılmaz. | Ö · `planim.css:151` · `panel.css:237` (öni:534 · öni:1458-1460) · karar hnd:65 | `js: getComputedStyle(".pc-foot").justifyContent` `"flex-end"` **değil** | 4× |
| **C21** | Kart ayağı | Kaydet düğmesi kiti `.btn-green.btn-sm`: dolgu `10px 16px`, 13px, `radius` 8px. | Ö · `planim.css:691` · `:693` (öni:534) | `js:` üç değerin eşitliği | 4× |
| **C22** | Modül sayfası | Sayfa kalıbı sabit sıradadır: ① selamlama satırı → ② dört sayaç → ③ geniş liste kartı + ④ dar ilerleme kartı (aynı satırda) → ⑤ zaman satırı kartı → ⑥ boş durum kartı. | Ö · `diet/planim/index.blade.php` — `.dash-row` → `.kpi-grid` → `.dash-cols` → `.pnl-card` → `.pnl-empty` (öni:1379-1383) | `js:` altı bloğun DOM sırası | 4× |

---

## Ç · BİLDİRİM MERKEZİ — Ekran L

**Yeni bölüm (v1.2.0, karar §Y‑3 · 2026-08-29).** Taban **Gastro**'dur: dört
markanın içinde bugün yalnız orada yayında olan yüzeydir ve bu bölümün her
davranış kuralı oradan **ölçülmüştür**.

> 🔴 **§U7 GEÇERLİ — TAŞIMA BİREBİRDİR.** Rota kümesi, eylem uçları, gün
> gruplaması, sayfalama sayısı, okundu/silme semantiği ve yetki kapısı
> kaynaktan aynen gelir. Değişen tek şey **renk ve içerik**.
>
> 🔴 **KABUKTA KAYITLI SAPMA — §U8'in ilk uygulaması.** Gastro'nun bugünkü
> ekranı bu şartnamenin modül sayfası kalıbını (§F) **kullanmıyor**: kendi
> `.nt-top` / `.ntr-*` kitini ve kendi CSS dosyasını taşıyor, kimlik bandı ve
> `.pf-tabbar` yok, kartlar `.pnl-card` değil. **Karar (Beyar, 2026-08-29):
> önce KAYNAK markada şartnameye çekilir, sonra dörde birden taşınır.** Ç2
> hedefi yazar; sıra §Y‑18'de takip edilir. Taşıyan şerit hedefi kendi
> başına Diet'te uygulayıp Gastro'yu geride bırakamaz (§U8).

**Ölçülen taban (Gastro, 2026-08-29)**

| Ne | Ölçülen değer |
|---|---|
| Rota kümesi | 7 uç — `bildirimler.index` · `.tumunu-okundu` · `.git` · `.tur` · `.okundu` · `.sil` (`routes/web.php:670-684`) |
| Controller | `app/Http/Controllers/Web/NotificationController.php`, 279 satır |
| Sunum katmanı | `app/Support/NotificationPresenter.php`, 320 satır — **marka‑agnostik**, iki marka aynı sınıfı kullanır |
| Ekran | `resources/views/bildirimler/index.blade.php`, 219 satır |
| Tablo | Laravel **stok** `notifications` (uuid · type · notifiable · data · read_at · timestamps) — `deleted_at` YOK |
| Tip sayısı | 9 `kind` → **4 kategori** (takip · yorum · beğeni · sistem) |
| Sayfalama | **20/sayfa**, `withQueryString()` |

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **Ç1** | Bildirim merkezi | Yüzeyin adresi **`/bildirimler`**'dir ve hesap ekranının bildirim TERCİHİ sekmesinden **ayrıdır**. Biri olay akışını, öteki tercihi yönetir; ikisi karıştırılmaz. | Ö · `routes/web.php:670` ve rota bloğunun kendi şerhi (*"hesabim'in bildirim TERCİHİ sekmesinden AYRI"*) | `sh:` dört depoda rota tanımı | 4× |
| **Ç2** | Bildirim merkezi | Kabuk **BANNER ailesindendir (§R)** — modül sayfası kalıbı (§F) **DEĞİL** ve **kimlik bandı YOKTUR**. Sıra: **banner → dikişli panel → panelin içinde tip şeridi → liste**. | Ö‑tar · **karar Beyar, 2026-08-29**. Gerekçe: bildirim merkezi bir modül sayfası değil, **içerik yüzeyi**dir. Kimlik bandı denendi ve **ölçülen kusur**: kapak görseli olmayan yüzeyde bant üstte boş koyu alan bırakıyor, sekme şeridi havada kalıyor. | `js:` `.pf-head` + `.pf-banner` sayısı `=== 0`; banner ve panelin DOM sırası | 4× |
| **Ç2a** | Bildirim merkezi | Banner **kendi grubundadır: "Akış" · 280px**. Breadcrumb üstte sabit (§R6: **128 / 132 / 12.5px**), başlık bloğu banner'ın dikey merkezinde (§R8). | Ö‑tar · kaynakta ölçüldü (1440px): banner **280**, crumb **128**, blok merkezi **204 = hedef 204**. **Sayı icat değil** — §R1'in Profil/Hesap grubunun ölçülmüş değeridir ve bildirim merkezi de bir üye alanı yüzeyidir (menüden ve zilden gelinir). **Ayrı grup** olması §R5'in kendi deseni (*"aynı sayıyı taşır ama ayrı grup kalır"*). ⚠ Liste grubu (515) denendi ve **fazla** çıktı: liste banner'ları başlık + alt satır + istatistik satırı taşır (§R9), bu yüzeyde istatistik satırı **yok** — §R3 grup değerini *"en uzun bloğun sığdığı değer"* diye bağlıyor. ⚠ §R13 Profil/Hesap'ta breadcrumb'ı kimlik kartına koyar; bu yüzeyde kimlik kartı **yok** (§Ç2), breadcrumb banner'da kalır — gruplar sayıyı paylaşır, kuralı değil. | `pw:` banner 280 · crumb 128/132 · blok merkezi = 128+(h−128)/2 | 4× |
| **Ç2b** | Bildirim merkezi | Banner'ın altındaki panel **dikişlidir**: `margin-top:-22px` · `border-radius:22px 22px 0 0` · `box-shadow:0 -12px 32px rgba(20,16,10,.18)` · `z-index:2`. | Ö‑tar · değer **icat edilmedi**, deponun KANON token'ından gelir: `.below-header:not(.pf-top) + section` (`resources/css/tokens.css:191-199`). Dikiş banner'ı izleyen `<section>`e **kendiliğinden** iner; ayrı kural yazılmaz. Kaynakta ölçüldü: `-22px` · `22px` · gölge var · `z-index:2`. | `pw:` dört değerin eşitliği | 4× |
| **Ç2c** | Bildirim merkezi | **Tip şeridi panelin İÇİNDEDİR**, banner'ın içinde değil ve listenin üstündedir. | Ö‑tar · **karar Beyar, 2026-08-29** · kaynakta ölçüldü: şerit `.nt-body` içinde, `.nt-top` içinde **değil**. ⚠ Önceki hâlde şerit banner'ın içindeydi ve koyu zemin için yazılmış çip ezmelerini kullanıyordu. | `js:` şeridin `closest(banner)` sonucu **boş**, `closest(panel)` sonucu dolu | 4× |
| **Ç2d** | Bildirim merkezi | Şerit kiti **`.chip-filter`**'dır — deponun kanon süzgeç şeridi: `<a>` tabanlı, açık zeminli, `.is-active` ve `.cf-count` rozetli. İlk kalem **"Tümü"**dür ve varsayılan aktiftir; sayısı 0 olan tip **basılmaz**. | Ö · `resources/css/tokens.css:858-861` · **karar Beyar, 2026-08-29** | `js:` `.chip-filter a` sayısı = dolu tip sayısı + 1; `[aria-current=page]` sayısı `=== 1` | 4× |
| **Ç2e** | Bildirim merkezi | **Süzme SUNUCU tarafındadır**: her sekme kendi adresine giden bir `<a>`'dır (`?tur=<tip>`). Sekmesiz adres tüm akışı basar. | Ö · kaynakta uygulandı ve ölçüldü. ⚠ Bu, istemci süzgecinin **ölçülmüş kusurunu** kapatır: eski `.chip[data-f]` süzgeci yalnız **o sayfadaki 20 satırı** gizliyordu — *"Takip 3"* derken ikinci sayfadaki takip bildirimleri ne sayılıyor ne süzülüyordu. | `js:` `.chip-filter a` düğümlerinin `tagName === "A"`; `?tur=` ile satır sayısı daralır | 4× |
| **Ç3** | Bildirim merkezi | Bildirim satırı **`<a>` DEĞİL** bir kaptır; içinde gerçek form düğmeleri (okundu · sil) durur ve etkileşimli öğe `<a>` içine konmaz. Hedefe gidiş **mesaj metninin kendisindedir**. | Ö · ekranın kendi şerhi: *"Sebep yapısal, tercih değil… geçersiz HTML; klavye ve ekran okuyucu ikisi de kırılır"* | `js:` satır kökü `A` değil; içindeki `button` sayısı ≥ 1 | 4× |
| **Ç4** | Bildirim merkezi | Gün grupları **üçtür ve sabittir**: **Bugün · Dün · Daha Eski**. Per‑tarih gruplama yapılmaz. | Ö · `day_bucket` `match` bloğu (`NotificationController:95-99`) | `js:` gün başlığı dizisi | 4× |
| **Ç5** | Bildirim merkezi | Gruplama **sayfa İÇİNDE** yapılır; sayfa sınırını aşan gruplama yoktur. | Ö · `$paginator->getCollection()` üzerinde `groupBy` (`:88-102`) | akış testi | 4× |
| **Ç6** | Bildirim merkezi | Sayfalama **20/sayfa**'dır ve süzgeç sorgu dizesini **taşır** (`withQueryString`). | Ö · `paginate(20)->withQueryString()` (`:86`) · karar `kararlar.md` Faz 2 | `js:` sayfa başına satır sayısı; 2. sayfada süzgeç korunur | 4× |
| **Ç7** | Bildirim merkezi | **Okunmamış** satır kendi işaretini taşır ve okunmamış **sayısı** başlıkta basılır. | Ö · `.ntr.unread` + `unreadCount` rozeti (`index.blade.php:65`) | `js:` rozet sayısı = okunmamış satır sayısı | 4× |
| **Ç8** | Bildirim merkezi | Üç okundu yolu vardır ve üçü de bulunur: **tekil okundu** (listede kalır) · **tümünü okundu** · **satıra gidince okundu** (hedefe yönlendirir). | Ö · `markRead` · `readAll` · `open` (`:119-211`); tekilin gerekçesi: *"listede kal, yalnız okundu say"* | akış testi: üç uç da `read_at` yazar | 4× |
| **Ç9** | Bildirim merkezi | Silme **kalıcıdır**; yumuşak silme yoktur. | Ö · stok şemada `deleted_at` yok ve `DatabaseNotification` `SoftDeletes` kullanmıyor; *"bildirim zaten türetilmiş/yeniden üretilebilir bir kayıttır"* (`destroy` docblock) | `sh:` migration'da `deleted_at` araması → `0` | 4× |
| **Ç10** | Bildirim merkezi | Yetki kapısı **ilişkidir**: her sorgu `$user->notifications()` üzerinden kurulur, başkasının bildirimi bu ilişkide yoktur ve `firstOrFail()` **404** verir. Ayrı bir policy yazılmaz. | Ö · `markRead` · `destroy` · `open` üçü de aynı deseni kullanır (`:137` · `:157` · `:205`) | akış testi: başkasının id'siyle istek `404` | 4× |
| **Ç11** | Bildirim merkezi | Tablo Laravel'in **stok** `notifications` şemasıdır; marka başına ikinci bir tablo kurulmaz. | Ö · `2026_07_15_500000_create_notifications_table.php` | `sh:` migration varlığı ve kolon kümesi | 4× |
| **Ç12** | Bildirim merkezi | Tip **çipleri** akışın üstünde durur ve **yalnız o sayfada kaydı olan tip** basılır (sayısı 0 olan çip çizilmez). | Ö · `@continue($counts[$key] === 0)` (`index.blade.php:83`) | `js:` çip sayısı = boş olmayan tip sayısı | 4× |
| **Ç13** | Bildirim merkezi | **Tip ekseni MARKAYA ÖZELDİR.** Gastro **takip · yorum · beğeni · sistem**; **Diet** kendi bildirim tercih konularından doğar: **randevu · mesaj · program‑revizyonu · ödeme · pro‑üyelik · günlük‑takip · su · haftalık‑rapor · kampanya** artı **şüpheli‑giriş**. | Ö · Gastro `NotificationController::TYPE_EVENTS` + presenter `category` dalları; Diet `BildirimTercihi::KONULAR` (9) + `GUVENLIK_KONUSU` · **karar §Y‑3, 2026-08-29** | `js:` marka başına çip ekseni | özel |
| **Ç14** | Bildirim tercihi | Tür kapat/aç **bildirim merkezinde BASILMAZ**; yalnız hesap ekranının bildirim matrisindedir (`/hesabim?tab=bildirim`). Bildirim merkezi oraya **tek bir bağlantı** taşır: *"Bildirim tercihlerini yönet"*. | Ö · **karar Beyar, 2026-08-29**. Gerekçe: kontrol iki yüzeyde de AYNI kolonu yazıyordu (`notification_prefs`) ve akış sayfasında *"akışı mı e-postayı mı kapatıyorum"* sorusunu doğuruyordu. ⚠ **Sunucu ucu kaldırılmadı** (`bildirimler.tur` · `toggleType()`); kalkan yalnız tekrar eden kontroldür. | `js:` bildirim merkezinde tür formu sayısı `=== 0`, tercih bağlantısı `=== 1` | 4× |
| **Ç15** | Bildirim merkezi | Akışın kendisi **hiçbir tercihten etkilenmez**; tercihler yalnız e‑posta ve push gönderimini bağlar. | Ö · `MailAudience` docblock'u. ⚠ Bu kuralı ekranda açıklayan uzun dürüst etiket **kalktı** (2026-08-29): etiket, aynı sayfadaki tür kapatma kontrolünün doğurduğu karışıklığı gidermek için yazılmıştı; kontrol kalkınca (§Ç14) açıklamaya da gerek kalmadı. Hüküm duruyor, yüzeydeki metin kalktı. | `sh:` akış sorgusunda tercih koşulu araması → `0` | 4× |

| **Ç22** | Bildirim merkezi | Tip şeridi **projenin kendi çip kitini** kullanır (§C14) — yeni çip biçimi üretilmez. Sayı gösterimi de kitin parçasıdır: `.cnt` **11px · opacity .65 · margin-left 4px**. | Ö‑tar · kaynakta **enjeksiyon karşılaştırmasıyla** kanıtlandı: sayfaya kanon `.chips>.chip` basıldı ve dokuz özellikte (yükseklik · dolgu · yazı boyutu · ağırlık · yarıçap · zemin · renk · kenarlık genişliği · kenarlık rengi) **fark `[]`** çıktı. `.cnt` ölçüsü projenin kendi çip sayacından (`mutfak-defteri.css:57`). ⚠ Önceki turda buraya **uydurulmuş bir varyant** yazılmıştı (12.5px · dolgu `7px 14px` · sürekli tint zemin); ölçümle yanlışlandı ve kaldırıldı. | `pw:` kanon çiple enjeksiyon karşılaştırması → fark kümesi boş | 4× |
| **Ç23** | Bildirim merkezi | Tarih süzgeci **tek satırdır**: iki tarih alanı (**180px**) + **"Filtrele"** (birincil) + **"Temizle"** (ikincil), yan yana ve aynı yükseklikte. Yükseklik **`--ctl-h` (48px)**. "Temizle" **her zaman** basılır. | Ö‑tar · **karar Beyar, 2026-08-29** · kaynakta ölçüldü: dört kontrolün yüksekliği **[48]** ve üst kenarı **[681]** — ikisi de **tek değer**. Düğme kiti projenin kendisi: `.btn--primary` (`tokens.css:597`) · `.btn--ghost` (`:599`); enjeksiyon karşılaştırmasında **iki düğmede de fark `[]`**. ⚠ `min-height` yetmez, `height` gerekir: tarih alanının içsel yüksekliği 48'i aşar (53) ve üye tarafında `portal.css:151` bare `.btn`e `min-height:auto` yazıp tokens'ın 48px tavanını nötrler (50). ⚠ Üye tarafında ghost düğme **kenarlıksızdır** (`portal.css:142` `border:none`) — kitin kendisi, sapma değil. | `pw:` kontrol yükseklikleri ve üst kenarları **tek değer**; kanon düğmeyle fark kümesi boş | 4× |
| **Ç18** | Bildirim satırı | Satır **ızgaradır**, flex değil: `46px ikon | minmax(0,1fr) metin | auto yan | 132px eylem`, `gap:12px`, `align-items:center`, dolgu `14px 20px`. Sağ eylem sütunu **SABİT genişliktedir**. **Şablondaki son sütun ile `.ntr-actions`ın `width`i AYNI olmak zorundadır.** | Ö‑tar · kit **Diet'in `.ntf-row`undan** (`planim.css:580-587`). Ölçüldü: eylem hücresi **[132]**, sağ kenarı **[1139]**, satır sağ kenarı **[1159]** — aradaki 20px satırın kendi dolgusu. Satırdan taşan öğe **0**. ⚠ İkisi ayrışınca hücre sütununu aşar: şablon 92px kalıp `width` 132px olduğunda **on satırın onu da** satır dikdörtgeninin 20px dışına çıkmıştı. | `pw:` on satırda eylem genişliği ve sağ kenarı tek değer; satır dikdörtgenini aşan öğe `=== 0` | 4× |
| **Ç19** | Bildirim satırı | Eylem hücresi **etiketli** kontroller taşır: okundu işaretleme **"Okundu" metniyle** basılır, ikon tek başına bırakılmaz. Okunmamış durumu için **ayrı bir benek basılmaz**. Karşılığı olmayan yuva `visibility:hidden` ile görünmez olur ama **yeri durur** (§B9 deseni). | Ö‑tar · **karar Beyar, 2026-08-29**. Ölçülen kusur: tik ve kırmızı nokta ikon/benek olarak duruyordu, anlamları yalnız görünmeyen `title`/`aria-label`da yazılıydı. Ayrıca aynı durumu **üç işaret** söylüyordu — satırın `.unread` zemini, başlıktaki "N okunmamış" rozeti ve nokta; üçüncüsü bilgi eklemiyordu. Nokta kalktı, tik etiketlendi. Tarayıcıda tıklanarak doğrulandı: okunmamış satır 2→1, rozet "2 okunmamış"→"1 okunmamış". Silme ikon kaldı — çöp kutusu evrensel ve arkasında onay diyaloğu var. | `js:` `.ntr-dot` sayısı `=== 0`; okundu kontrolünde görünür metin var | 4× |
| **Ç20** | Bildirim satırı | Eylem alanında **zemin ve kenarlık YOKTUR** — satırın kendi zemini görünür; renk yalnız `:hover`'da değişir. Takip ve okundu kalemleri satırın **kendi eylem kitini** (`.ntr-mark`) kullanır, genel düğme kitini değil. Takip gerçek bir düğmedir; kendi kendini takip eden satırda basılmaz. | Ö‑tar · uç CANLI: `POST takip/{user}` → `follow.toggle`; tıklanarak doğrulandı (*Takip Et → Takiptesin → Takip Et*) ve okundu 1→0. Zemin ölçüldü: eylem alanındaki **her düğüm şeffaf**, kenarlık **0px**, düğme yüksekliği **[28]** tek değer. ⚠ `.btn--ghost` DENENDİ VE GERİ ALINDI: `background:var(--paper)` satırda krem/beyaz kutular üretiyordu ve üye tarafındaki `.btn`in `14px 26px` dolgusu (`portal.css:143`) düğmeyi sütundan taşırıyordu. ⚠ Ondan önceki hâl bir `<span>` rozetti — **sahte düğme**. | `pw:` eylem alanındaki her düğümün zemini şeffaf; kenarlık `0px`; düğme yükseklikleri tek değer | 4× |
| **Ç21** | Bildirim merkezi | Tip şeridi panelin **yatay merkezindedir**: sol ve sağ boşluk eşittir. | Ö‑tar · **karar Beyar, 2026-08-29** · kaynakta ölçüldü (1440px): panel 880px, şerit 533px, **sol 174 = sağ 174**. ⚠ v1.6.1'e kadar bu satır şeridin liste kartıyla *"aynı sol çizgide"* başlamasını bağlıyordu; karar üzerine yazıldı. | `pw:` `sol boşluk === sağ boşluk` | 4× |

### Ç15a · Kaynakta uygulanırken ölçülen iki sapma — §U8 kalemi

Kabuk kaynak markada şartnameye çekilirken (2026-08-29) iki kit eksiği
**ölçüldü**. İkisi de **uydurulmadı**; mevcut hâl korundu ve karara sunuldu:

| Ne | Şartnamenin bağladığı | Kaynakta ölçülen | Yapılan |
|---|---|---|---|
| **Üye boş durumu** | §D2 `.pnl-empty` — dolgu `44px 24px`, ikon 58×58, `h4` 15.5px | `.pnl-empty` üye tarafında **YOK** (yalnız admin CSS'inde; §D4 onu üye tarafında yasaklıyor). Ekranın kendi `.pf-empty` bileşeni var. | Mevcut `.pf-empty` **korundu**. Yeni CSS yazmak §U8'e aykırı olurdu. |
| **Durum rozeti** | §C11 `.pstat` — 11.5px/700, dolgu `4px 10px`, `radius` 8px | `.pstat` kaynakta **YOK** — üye stil dosyasında 0 eşleşme | Rozet **hiç basılmadı**; kart başlığı sayısız kaldı. |

**Her ikisi de dört markayı ilgilendirir.** §U8 gereği çözüm tek markada
yapılmaz: kit önce şartnameye yazılır, kaynakta uygulanır, sonra dördüne
birden iner. Bu turda taşıma **kaynağın bugünkü kitiyle** yapıldı.

### Ç15b · Kaynakta düzeltilen davranış — sayfalama ile süzgeç çakışması

Ç2b'ye geçerken **ölçülmüş bir kusur** kapandı: eski istemci süzgeci
(`.chips` + `data-f`) yalnız **o sayfadaki 20 satırı** gizliyordu. Yani
çip *"Takip 3"* derken sayı **yalnız görünen sayfadan** geliyordu; ikinci
sayfadaki takip bildirimleri ne sayılıyor ne de süzülüyordu. Sunucu
süzgeci bütün akışı süzer ve şerit sayıları da bütün akıştan gelir
(`turSayilari()`, süzgeçten bağımsız tek sorgu).

### Ç16 · Kaynakta olup hedefte veri karşılığı olmayan tipler

**§U7 gereği işaretlenir, şerit kendi başına düşürmez.** Gastro'nun dokuz
`kind`ı ve Diet'teki karşılıkları — bu turda ölçüldü:

| Gastro `kind` | Kategori | Diet'te veri karşılığı | Durum |
|---|---|---|---|
| `follow` | takip | ❌ **yok** — Diet'te takip ilişkisi bulunmuyor | **Kurulmaz.** Kayda geçti. |
| `recipe_favorited` | beğeni | ❌ **yok** — tarif ve beğeni yok | **Kurulmaz.** Kayda geçti. |
| `recipe_approved` · `recipe_rejected` | sistem | ❌ **yok** — üye tarif göndermiyor | **Kurulmaz.** Kayda geçti. |
| `tip_approved` · `tip_rejected` | sistem | ❌ **yok** — püf noktası üye üretimi değil | **Kurulmaz.** Kayda geçti. |
| `review_created` · `review_replied` | yorum | ⚠ **kısmi** — `DietitianReview` + `DietitianReviewReply` var, ama yorum diyetisyene yazılır, üyeye değil | **§Y‑19'da açık.** |
| `subscription_ended` | sistem | ✅ **var** — `DietSubscription` + `SubscriptionStatus` | **Kurulur** (`pro-üyelik` / `ödeme` konusu). |

**Diet'in kendi ekseninde karşılığı ölçülmüş konular:** `randevu`
(`DietAppointment`) · `mesaj` (`DietMessageThread` · `DietMessage`) ·
`program-revizyonu` (`DietUserProgram`) · `ödeme` (`DietInvoice`) ·
`şüpheli-giriş` (`DietLoginEvent`). `günlük-takip` · `su` ·
`haftalık-rapor` · `kampanya` **hatırlatma/pazarlama** üreticisi ister ve
bugün hiçbirinin zamanlayıcısı yoktur — `app/Jobs` dizini ve
`routes/console.php` kuyruğu bu depoda **yok** (ölçüldü). Bunlar §Y‑19'da.

### Ç17 · Zil ikonu

**§G19 ile aynı hüküm:** üst çubuktaki zil ile menüdeki "Bildirimlerim"
kalemi **aynı sayfaya** çıkar; ikinci bir ekran üretilmez.

**Ölçülen bugünkü hâl (2026-08-29):**

| Marka | Zil bugün nerede | Nereye gidiyor |
|---|---|---|
| **Gastro** | `partials/header.blade.php:139` — `a.icon-btn.head-bell` | ✅ `route('bildirimler.index')`; okunmamış sayısı `.hb-badge` ile basılıyor |
| **Diet — üye kabuğu** | ❌ **zil YOK.** `dd-shell.js`te `fa-bell` araması **0 eşleşme** | — |
| **Diet — diyetisyen paneli** | `layouts/diet-panel.blade.php:123` — `<button class="pnl-bell">` | 🔴 **HİÇBİR YERE.** `href` yok, JS dinleyicisi yok (`pnl-bell` araması JS'te **0**), yalnız `.pb-dot` noktası basılıyor. **Ölü kontrol.** |

**Hüküm:** Diet'in üye kabuğuna zil **eklenir** ve `/bildirimler`e bağlanır;
diyetisyen panelindeki ölü düğme de aynı adrese bağlanır. Okunmamış sayısı
Gastro'daki gibi rozetle basılır (§U7 — kit birebir).

---

## D · BOŞ DURUM — iki ayrı kit

Önizleme bölüm 1 ve 13. **Üye tarafı ile yönetim tarafı ayrı kitlerdir ve
karıştırılmaz** (öni:1440).

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **D1** | Üye yüzeyleri | Boş durum bağımsız kutu değildir; **kartın içinde** yaşar. | Ö · `planim.css:38` (öni:522 · öni:1365-1367) | `js:` her `.pnl-empty`'nin `closest(".pnl-card")` sonucu boş değil | 4× |
| **D2** | Üye yüzeyleri | Üye boş durumu: dolgu `44px 24px`; ikon 58×58 `radius:12px` `margin:0 auto 14px`; `h4` 15.5px `margin-bottom:5px`; metin 13px `max-width:300px` `margin:0 auto 16px`. | Ö · `planim.css:38` · `:244` · `:249` · `:250` (öni:522) | `js:` sekiz değerin eşitliği | 4× |
| **D3** | Yönetim yüzeyleri | Yönetim boş durumu: dolgu `54px 24px`, `text-align:center`; ikon 60×60 `radius:12px` `margin:0 auto 16px`; `h4` 16px; `p` 13px `max-width:340px`. | Ö · `sa-shell.css:404-408` (öni:1438-1440) | `js:` yedi değerin eşitliği | 4× |
| **D4** | Her iki taraf | D2 ve D3'ün değer kümeleri birbirinin yerine kullanılmaz. | Ö · iki kitin ölçülen değerleri kesişmiyor (öni:1440) | `js:` yönetim ekranında `.pnl-empty` dolgusu `"44px 24px"` **değil** | 4× |
| **D5** | Her iki taraf | Boş durum kartında **tek** eylem düğmesi bulunur. | Ö · dört markada da tek düğme (öni:1367) | `js:` `.pnl-empty` içindeki `button, a` sayısı `=== 1` | 4× |
| **D6** | Her iki taraf | Boş durum kartı iskelet ekran yerine geçmez; veri yokken gösterilir, "yakında" işareti taşımaz. | Ö · Diet ve Gourmet panellerinde iskelet ekran bulunmadı (öni:1627-1630) | `sh:` `.pnl-empty` bloklarında `Yakında` araması → `0` | 4× |

---

## E · HESAP EKRANI — Ekran A

Önizleme bölüm 5 ve 21. Taban **Diet**'tir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **E1** | `/hesabim` | Hesap sekme şeridi **altı** kalem taşır. | Ö · `TABS` dizisi (öni:2275-2278) · karar hnd:63 | `js: document.querySelectorAll(".pf-tabs .dt").length === 6` | 4× |
| **E2** | `/hesabim` | Sekme sırası sabittir: **Profil · Güvenlik · Bildirimler · Tercihler · Dil ve bölge · Veri ve izinler**. | Ö · `TABS` dizisi (öni:2276-2278) · tablo öni:528 | `js:` altı etiketin sırayla dizgi karşılaştırması | 4× |
| **E3** | `/hesabim` | Sekme anahtarları sırayla `profil` · `guvenlik` · `bildirim` · `tercih` · `bolge` · `veri`'dir. | Ö · `TABS` dizisi (öni:2276-2278) | `js:` `data-tab` değerlerinin dizisi | 4× |
| **E4** | `/hesabim` | Şerit kutusu `gap:4px`, `padding:4px`, `radius:12px`, `overflow-x:auto` taşır. | Ö · `planim.css:439` (öni:530) | `js:` dört değerin eşitliği | 4× |
| **E5** | `/hesabim` | Şerit `margin-left/right:auto` ile ortalanır; `justify-content:center` **yazılmaz**. | Ö · `planim.css:452-453`; `:443-451` bilerek boş (öni:530) | `js:` `marginLeft === "auto"` ve `justifyContent !== "center"` | 4× |
| **E6** | `/hesabim` | Sekme şeridi kimlik kartının yan hizasını **aşmaz** — ikisinin sol kenarı 28px'te birleşir. | Ö · `planim.css:280` (öni:500) · karar hnd:67 | `pw:` `rect(".pf-tabbar").left === rect(".pf-head").left` | 4× |
| **E7** | `/hesabim` | Kimlik kartı ile şerit arası **24px**, şeridin altı **22px**'tir. | Ö · `planim.css:436` · `:44` (öni:532 · öni:2106-2107) | `js:` `marginTop === "24px"` ve `marginBottom === "22px"` | 4× |
| **E8** | `/hesabim` | Sekme kalemi 13px/700, dolgu `9px 16px`, `min-height` 44px'tir. | Ö · `planim.css:460` (öni:530) | `js:` üç değerin eşitliği | 4× |
| **E9** | `/hesabim` | Sekme şeridi yapışkan **değildir**. | Ö · Diet yapışkan değil; Gastro bugün yapışkan — `reference/hesabim/hesabim.css:105`, `:52` (öni:2105-2107) | `js: getComputedStyle(".pf-tabbar").position !== "sticky"` | 4× |
| **E10** | `/hesabim` | Kapak yüksekliği **280px**, `radius` 24px'tir. | Ö · hedef R1 (öni:2045); Diet'in bugünkü 240px'i sapmadır — `planim.css:276` (öni:536 · öni:1971) | `pw: rect(".pf-banner").height === 280` | 4× |
| **E11** | `/hesabim` | Kimlik kartı `margin-top:-78px`, dolgu `26px 30px 28px`, `gap` 26px taşır. | Ö · `planim.css:280` (öni:536) | `js:` üç değerin eşitliği | 4× |
| **E12** | `/hesabim` | Avatar 128×128, `border:4px #fff`, `margin-top:-70px`; harf avatarında yazı 51px'tir. | Ö · `planim.css:281` · `:302` (öni:536) | `js:` dört değerin eşitliği | 4× |
| **E13** | `/hesabim` · `/planim` | Kimlik kartının sağ sütunu `.pf-actions` 194px'tir ve **doludur**. | Ö · `planim.css:287` (öni:784) | `js: rect(".pf-actions").width === 194` | 4× |
| **E14** | `/hesabim` · modül | Fotoğraf ve kapak düzenleme düğmeleri **yalnız** ayarlar ekranında basılır; modül sayfalarında sayısı sıfırdır. | Ö · `hesabim.blade.php:147-152`, `:164`; Planım'ın sekiz ekranında `.pf-ava-edit` sayısı 0 (öni:538) | `js:` modül sayfasında `querySelectorAll(".pf-ava-edit").length === 0` | 4× |
| **E15** | `/hesabim` | Hesap dondurma ve hesap silme **"Veri ve izinler"** sekmesinin içindedir; bunlar için ayrı sekme açılmaz. | Ö · Diet `hesabim.blade.php:865-942` (dondurma) ve `:786-855` (silme) (öni:2086) · karar hnd:64 | `js:` sekme etiketleri arasında `Dondurma` ve `Hesap Silme` yok; `veri` panelinde iki kart var | 4× |
| **E16** | `/hesabim` | Dondurma ve silme kartlarının metinleri Fit'in dizgileridir; yerleri Diet'e göredir. | T · kaynak marka Fit, yerleşim Diet (hnd:64 · öni:2515) | `sh:` dizgi karşılaştırması dört depoda | 4× |
| **E17** | `/hesabim` | Yıkıcı eylem onay kutusuyla kilitlenir; kutu işaretlenmeden düğme `disabled` kalır. | Ö · önizleme etkileşimi (öni:3157-3164) · akış testi 4 (öni:2138) | `js:` kutu işaretsizken `button.disabled === true`; JS kapalıyken de sunucu reddeder | 4× |
| **E18** | `/hesabim` | Bugünkü sekme sayıları hedefe iner: Gastro 7→6 · Diet 5→6 · Gourmet 14→6 · Fit 10→6. | Ö · `hesabim/index.blade.php:153-160` · `hesabim.blade.php:176-187` · `AccountController.php:107-125` · `hesabim-v1.html:630-641` (öni:2081-2091) | `js:` dört depoda sekme sayısı `=== 6` | özel (başlangıç değeri) |
| **E19** | Gourmet `/hesabim` | Gourmet'in tek raydaki yedi modül paneli hesap ekranından çıkar ve kendi adresine taşınır; ayar sekmeleri altıya iner. | Ö · `AccountController.php:107-125` (öni:2088) · dalga hnd:185 | `js:` Gourmet `/hesabim` sekme sayısı `=== 6`, modül adları şeritte yok | Gourmet |
| **E20** | Fit `/hesabim` | Fit'in ayrı "Dondurma" ve "Hesap Silme" sekmeleri kalkar; içerikleri "Veri ve izinler"e girer. | Ö · `hesabim-v1.html:630-641` (öni:2091) | `js:` Fit'te sekme etiketlerinde `Dondurma` yok | Fit |
| **E21** | Gastro `/hesabim` | Gastro'nun "Aboneliklerim · Üyeliğim · Kartlarım" sekmeleri hesap ekranından çıkar ve Ekran D'ye (§I) taşınır. | Ö · `hesabim/index.blade.php:153-160` (öni:2082 · öni:1113) | `js:` Gastro `/hesabim` şeridinde bu üç etiket yok; `/hesabim/abonelik-odemeler` var | Gastro |
| **E22** | Gastro `/hesabim` | Dondurma ve silme, Profil sekmesindeki "tehlikeli bölge" kutusundan "Veri ve izinler"e taşınır. | Ö · bugünkü yeri `hesabim/index.blade.php:505-650` (öni:2083) | `js:` Profil panelinde tehlikeli bölge kutusu yok | Gastro |
| **E23** | Gourmet `/hesabim` | Dondurma ve silmenin iki ayrı sekmeye bölünmüş hâli birleşir. | Ö · bugün dondurma "Giriş ve Güvenlik"te, silme "Hesap ve Gizlilik"te (öni:2089) | `js:` ikisi de `veri` panelinde | Gourmet |

---

## F · MODÜL SAYFASI — Ekran B

Önizleme bölüm 6. Taban Diet'in `/planim` yüzeyidir. **Kabuk sabit, içerik
serbest.**

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **F1** | Modül sayfası | Dikey sıra sabittir: kimlik kartı → sekme şeridi → sayfa başlığı → `.dash-row` → `.kpi-grid` → `.dash-cols`. | Ö · `diet/planim/_shell.blade.php` (öni:783-786) | `js:` altı bloğun DOM sırası | 4× |
| **F2** | Modül sayfası | Sekme şeridi `<nav>` içinde `<a class="dt">` bağlantılarıdır, `<button>` değildir; aktif olan `aria-current="page"` taşır. | Ö · `diet/planim/_shell.blade.php` (öni:785) | `js:` `.dt` düğümlerinin `tagName === "A"` ve `[aria-current=page]` sayısı `=== 1` | 4× |
| **F3** | Modül sayfası | Modül sekme sayısı markanın kendi modül sayısından doğar: Gastro 7 · Diet 7 · Gourmet 6 · Fit 7. | Ö · `raylar` dizileri (öni:2294 · 2325 · 2357 · 2388) · şerh öni:791 | `js:` marka başına `.dt` sayımı | özel |
| **F4** | Modül sayfası | Modül sekme adları sabit dizilerdir. **Gastro:** Mutfak Defterim · Tariflerim · Püf Noktalarım · Kaydettiklerim · Menülerim · Alışveriş Listem · Rozetlerim. **Diet:** Planım · Günlük Takip · Programım · İlerlemem · Uzman Desteğim · Kaydettiklerim · Sağlık Profilim. **Gourmet:** Keşiflerim · Kaydettiklerim · Listelerim ve Rotalarım · Ziyaretlerim ve Değerlendirmelerim · Rezervasyonlarım · Etkinlik Takvimim. **Fit:** Enerji Defterim · Aktivite Kayıtlarım · Kaydettiklerim · Challenge'larım · Fit Test Sonuçlarım · Antrenörüm · Sağlık Profilim. | Ö · `raylar` dizileri (öni:2294 · 2325 · 2357 · 2388) | `js:` etiket dizisi karşılaştırması | özel |
| **F5** | Modül sayfası | Dört sayaç etiketi markanın kendi belgesinden gelir ve uydurulmaz. | Ö · dört marka × dört etiket, belge bölümüyle (öni:736-755) | `js:` etiket dizgisi karşılaştırması | özel |
| **F6** | Modül sayfası | Sayaçların **sayısal değerleri** şartname kapsamı dışındadır; canlı veriden gelir. | X · ölçülemedi — belgeler hangi sayacın gösterileceğini yazıyor, kaç olduğunu değil (öni:759-762) | — | özel |
| **F7** | Modül sayfası | Modül sayfası her zaman normal görünümdedir; düzenleme düğmesi basılmaz. | Ö · (öni:773) · E14 ile aynı ölçüm | `js:` `.pf-ava-edit` sayısı `=== 0` | 4× |
| **F8** | Modül sayfası | Selamlama satırındaki hızlı işlem çipleri markanın kendi eylemleridir: Gastro Tarif Ekle · Diet Öğün Ekle · Gourmet Liste Oluştur · Fit Aktivite Ekle. | Ö · (öni:1347 · öni:2293 · 2324 · 2356 · 2387) | `js:` çip dizgisi karşılaştırması | özel |
| **F9** | Modül sayfası | Kabuk dört markada birebirdir; değişen yalnız sekme adları, içerik ve renktir. | Ö · (öni:787) | `js:` sınıf ağacı karşılaştırması dört markada | 4× |

---

## G · AÇILIR MENÜ — hesap dropdown'ı

Önizleme bölüm 3, 3b ve 4. Menü **dört gruptan** oluşur; gruplar yalnız
çizgiyle ayrılır.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **G1** | Açılır menü | Menüde **grup başlığı metni yoktur**; gruplar yalnız `.acct-div` çizgisiyle ayrılır. | Ö · `dd-shell.css:517` (öni:544 · öni:684) · karar hnd:66 | `js:` menüde başlık düğümü (`.acct-title` benzeri) sayısı `=== 0` | 4× |
| **G2** | Açılır menü | Menü **kimlik bloğuyla başlar**; ardından **dört bağlantı grubu** gelir. Ayraç sayısı **4**'tür: biri kimlik bloğunu, üçü grupları ayırır. | Ö · Diet'in gerçek kabuğu — kimlik bloğu ve onu ayıran ilk ayraç `dd-shell.js:741-745`; bugün 3 ayraç ile 3 bağlantı grubu var, dördüncü grup Slot 1/Slot 2 ile doğar (§G7 · §G10) · **karar §Y‑17, 2026-08-28**. ⚠ Önizlemenin render'ında kimlik bloğu **yoktur** (öni:2478-2480); v1.1.1'e kadar sayı oradan alınmıştı ve eksikti. | `js: document.querySelectorAll(".acct-div").length === 4` ve ayraçla bölünen parçalardan ilki bağlantı taşımaz, kalan dördü taşır | 4× |
| **G3** | Açılır menü | Ayraç ölçüsü: `height:1px; background:var(--line); margin:6px 4px`. | Ö · `dd-shell.css:517` (öni:544) | `js:` üç değerin eşitliği | 4× |
| **G4** | Açılır menü | Menü kalem sayıları: **Gastro 12 · Diet 14 · Gourmet 12 · Fit 13**. Diet'in 14'ü **"Bildirimlerim" dâhildir** ve §Y‑3 kapandığı için (2026-08-29) bu sayı **düşmez**. | Ö · marka modülleri (öni:2288-2290 · 2319-2321 · 2351-2353 · 2382-2384) + Slot 1 + Slot 2 + sabit üçlü. ⚠ Önizlemenin 3b tablosu Diet için **15** yazıyor (öni:634) — o başlık "Alışveriş Listem" çıkarılmadan önceki hâldir ve **eskimiştir**; doğru sayı 14'tür (hnd:70). | `js:` menüdeki `a` sayısı marka başına | özel |
| **G5** | Açılır menü | Son üç kalem dördünde de aynıdır, aynı sırada: **Hesap ve Ayarlar · Destek Merkezi · Çıkış**. | Ö · tablo öni:681-682 | `js:` son üç `a` metninin dizisi | 4× |
| **G6** | Açılır menü | Çıkış'ın üstüne ayraç konmaz — üçü aynı grubun içindedir. | Ö · öni:682 | `js:` son `.acct-div`'in indeksi sabit üçlüden önce | 4× |
| **G7** | Açılır menü | Slot 1'in dizgisi dört markada kilitlidir: ücretsiz üyede **"Pro'ya Yükselt"**, Pro üyede **"Pro Üyeliğim"**. Başka ad kullanılmaz. | Ö · `SLOT1` (öni:2281) · tablo öni:675 · karar hnd:76 | `sh:` dört depoda dizgi eşitliği | 4× |
| **G8** | Açılır menü | Slot 1 hesap grubunun (G4) **ilk** kalemidir. | Ö · öni:675; render öni:2479-2480 | `js:` üçüncü `.acct-div`'den hemen sonraki `a` | 4× |
| **G9** | Açılır menü | Slot 2 Slot 1'in **hemen altındadır**. | Ö · öni:679 | `js:` Slot 1'in bir sonraki kardeşi | Gastro · Diet · Fit |
| **G10** | Açılır menü | Slot 2 dizgileri: Gastro **"Aboneliklerim"** · Diet **"Hizmetlerim ve Ödemelerim"** · Fit **"Hizmetlerim ve Ödemelerim"** · Gourmet'te kalem **basılmaz**. | Ö · `slot2` alanları (öni:2291 · 2323 · 2386) ve `slot2:null` (öni:2355) · karar hnd:76 (K15) | `js:` dizgi karşılaştırması; Gourmet'te sayı `=== 0` | özel |
| **G11** | Gourmet menüsü | Gourmet'te Slot 2 yerine boş kalem ya da "Yakında" rozeti konmaz; grup Slot 1 ile başlar. | Ö · öni:626 · öni:679 | `sh:` Gourmet menüsünde `Yakında` araması → `0` | Gourmet |
| **G12** | Açılır menü | Rozet/topluluk kalemi ile "Bildirimlerim" **aynı grupta (G3)** durur ve o grup hesap grubunun hemen üstündedir. | Ö · dört markada doğrulandı; Fit düzeltildi (öni:689-700) · karar hnd:77 | `js:` iki kalem arasında `.acct-div` yok, sonrasında tam 1 var | 4× |
| **G13** | Açılır menü | Bildirim kaleminin adı dört markada da **"Bildirimlerim"**dir ve kalem **basılır**. | Ö · öni:667-668 · **karar §Y‑3, 2026-08-29**: Diet'te bildirim merkezi kurulur, kalem eksik bırakılmaz (§U6). Kalem, yüzeyi doğduğu turda basılır — önce sayfa, sonra kalem. | `sh:` dört depoda dizgi eşitliği; kalemin hedefi `/bildirimler`e çözülür | 4× |
| **G14** | Açılır menü | Rozet kalemi adları: Gastro · Diet · Gourmet **"Rozetlerim ve Topluluğum"**, Fit **"Challenge'larım ve Rozetlerim"**. Diet'te koddaki "Rozetlerim" adı **kullanılmaz**. | Ö · menü dizileri (öni:2290 · 2321 · 2353 · 2384) · **karar §Y‑2, 2026-08-28** | `js:` dizgi karşılaştırması; Diet menüsünde `>Rozetlerim<` tam eşleşmesi `0` | özel |
| **G15** | Açılır menü | **"Alışveriş Listem"** yalnız **Gastro**'da basılır. | Ö · Diet'ten çıkarıldı, menü 15→14 (hnd:70); Gourmet ve Fit belgelerinde "alışveriş" araması 0 eşleşme (öni:669-672); Diet'in güncel menü dizisinde yok (öni:2319-2321). ⚠ Önizlemenin öni:602 ve öni:670 satırları Diet için hâlâ "var" diyor — **eskimiştir**. | `sh:` dört menüde `Alışveriş` araması yalnız Gastro'da `1` | Gastro |
| **G16** | Açılır menü | Menü kabı `max-height: calc(100dvh − 112px − 12px − 10px)` ve `overflow-y:auto` taşır. Çubuk **yalnız taşma olunca** belirir (`auto`, `scroll` değil). | T · üç girdi ölçüldü: 112px kabuk (`dd-shell.css:337` + `:396`), 12px tetikleyici mesafesi, 10px kap dolgusu; toplam **hesaptır** (öni:714-720). ⚠ **Kural v1.5.0'a kadar HİÇBİR DEPODA uygulanmamıştı** — Diet'te ölçüldü: kap `max-height` taşımıyordu ve uzun menünün alt kalemleri **görünmüyordu**. Diet'e uygulandı ve ölçüldü (1080/900 çubuksuz · 700/560 çubuklu). ⚠ Kardeş markada `calc(100vh − 150px)` yazılı — **farklı değer**; tekleştirme §U8 kalemidir. | `css:` değerin birebir yazılışı · `pw:` 1080px'te çubuk yok, 700px'te var | 4× |
| **G17** | Açılır menü | Menü kalem yüksekliği 44px'tir (11+11 dolgu + 14px × 1.55). | Ö · `dd-shell.css:505` (öni:722-723) | `pw:` `a` yüksekliği `=== 44` | 4× |
| **G18** | Açılır menü | En uzun menünün toplam yüksekliği **702px**'tir ve 1080px ekranda kaydırma çubuğu çıkmaz. | Ö‑tar · Diet'te ölçüldü (2026-08-29, 1440×1080): `scrollHeight = 702`, sınır `946px`, çubuk **yok**. ⚠ v1.4.x'e kadar `T` idi ve CSS'ten **≈719px** diye hesaplanmıştı; gerçek ölçüm 702px verdi — §U4 gereği `Ö`ye çevrildi. | `pw:` 1080px'te `scrollHeight <= clientHeight` | 4× |
| **G19** | Üst çubuk + menü | Üst çubuktaki zil ikonu ile menüdeki "Bildirimlerim" kalemi **aynı sayfaya** çıkar; ikinci bir ekran üretilmez. Bu bilinçli bir tekrardır. | Ö · Fit belgesi §13'ün kendi hükmü (öni:704-710) | `js:` iki bağlantının `href` değeri eşit | 4× |
| **G20** | Açılır menü | Yeteneği olmayan kalem menüye konmaz. | Ö · G11 ve G15'in gerekçesi (öni:671-672 · öni:626) | `sh:` her menü kaleminin hedef rotası çözülüyor | 4× |
| **G21** | Açılır menü | Menünün başında **kimlik bloğu** bulunur: avatar + ad, altında (varsa) kullanıcı adı. Blok **bağlantı taşımaz** ve dört markada aynı yerde, aynı ölçüdedir. Ölçü: kap `padding:8px 11px 12px` · `gap:11px`; avatar 42×42 daire (harf avatarında yazı 17px); ad 14.5px/700 `--slate`; kullanıcı adı 12px/500 `--muted`. | Ö · `dd-shell.css:512` · `:513` · `:515` · `:516` · `:488`; markup `dd-shell.js:741-744` · **karar §Y‑17, 2026-08-28**. ⚠ Kaynak **Diet'in gerçek kabuğudur**, önizleme değil — önizlemenin menü render'ında kimlik bloğu hiç yok. | `js:` ilk `.acct-div`'den önceki parçada `a` sayısı `=== 0` ve içinde avatar + `b` var; beş ölçünün eşitliği | 4× |

---

## H · GİRİŞ VE KAYIT — Ekran C

Önizleme bölüm 8. **Taban DIET'tir** (hnd:89 · hnd:118).

> ⚠ **Kaynak çatışması — çözüldü.** Önizlemenin 8. bölümü başlığında hâlâ
> "TABAN: GASTRO" yazıyor (öni:898) ve iki paragrafı ("girişte rol seçimi
> yok" öni:1061 · "telefon segmenti kalkar" öni:1047) bir önceki turun
> kararını taşıyor. Handoff'un **ters çevrilen kararlar** tablosu üçünü de
> geri almıştır (hnd:114-123). Bu şartnamede **handoff geçerlidir**;
> önizlemenin o üç paragrafı eskimiştir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **H1** | Giriş · kayıt | Giriş ve kayıt yüzeyinin tabanı **Diet**'tir. | Ö · karar hnd:89 · ters çevirme hnd:118 | — | 4× |
| **H2** | Giriş · kayıt | Dikey sıra sabittir: **sosyal düğmeler → ayraç → segment → alanlar → buton → alt satır**. | Ö · Diet `giris.blade.php` sırası (hnd:90) · sosyal düğmelerin yeri hnd:119 | `js:` altı bloğun DOM sırası | 4× |
| **H3** | Giriş · kayıt | Sosyal düğmeler **yan yana**, iki sütun: `grid-template-columns:1fr 1fr`, `gap:10px`. | Ö · `kimlik-v1.css:300,316` · `gourmet-kimlik/kimlik-v1.css:328,344` (öni:496 · öni:840) | `js: gridTemplateColumns` iki eşit sütun | 4× |
| **H4** | Gastro girişi | Gastro'nun alt alta sosyal düğme düzeni kalkar. | Ö · bugünkü hâl `giris/giris.css:95` `flex-direction:column` (öni:496) · karar hnd:91 | `css:` `flex-direction:column` kuralı yok | Gastro |
| **H5** | Giriş | Sosyal düğmelerde ve pasif segmentte **"Yakında" rozeti yazılmaz**. | Ö · karar hnd:95 · dayanağı `config/markalar.php`'nin 2026‑07‑28 kararı (öni:1843-1845) | `sh:` giriş blade'lerinde `Yakında` araması → `0` | 4× |
| **H6** | Giriş | Girişte rol seçimi **Diet, Gourmet ve Fit'te bulunur**; Gastro'da bulunmaz. | Ö · `giris.blade.php` → `auth._p.hesap-turu` (öni:955 · öni:967-973) · karar hnd:92 · ters çevirme hnd:120 | `js:` marka başına rol segmenti sayımı | özel |
| **H7** | Giriş | Rol segmentinin başlığı **"Hangi hesaba giriyorsun?"** (`.au-rseg-lead`) olur. | Ö · öni:1050 | `sh:` dizgi eşitliği üç depoda | Diet · Gourmet · Fit |
| **H8** | Giriş | Rol seçenekleri: Diet **Kullanıcı / Diyetisyen** · Gourmet **Kullanıcı / İşletme** · Fit **Kullanıcı / Antrenör**. | Ö · öni:980-982 | `js:` seçenek etiketleri | özel |
| **H9** | Giriş | Rol beyanı **kapı değildir**; kimlik doğrulama hiç değişmez. | Ö · `LoginResponse:103-108`'in kendi şerhi ve partial'ın "BU SEGMENT YETKİ VERMEZ" notu (öni:969-971) · karar hnd:93 | `sh:` kimlik doğrulama dalında `hesap_turu` araması → `0` | 4× |
| **H10** | Giriş sonrası | Giriş **başarılı olduktan sonra** sunucu gerçek sahipliğe bakar; sahipse panele düşer. | Ö · `diet.panel.index` + `Gate::define('access-dietitian-panel')` (`AuthServiceProvider:339`) · `gourmet.panel.root` (`PanelController:41`) (öni:996 · öni:1019-1020) · karar hnd:93 | akış testi 3: sahiplikli kullanıcı panel adresine düşer | Diet · Gourmet |
| **H11** | Giriş sonrası | Sahip değilse üye alanına düşer ve **tek satırlık** bilgi şeridi görür. | Ö · karar hnd:93 · öni:1021-1024 | akış testi: şeridin varlığı ve tek satır olması | Diet · Gourmet · Fit |
| **H12** | Giriş sonrası | Bilgi şeridinin kiti `.sa-flash.is-note`'tur — krem zemin, `--slate-2` metin. **Yeşil kullanılmaz**, çünkü yeşil "başarılı" der. | Ö · `admin.css:151` (öni:1025-1027) | `js:` sınıf ve `backgroundColor` karşılaştırması | 4× |
| **H13** | Giriş sonrası | Şerit metinleri ve hedefleri: Diet "Diyetisyen hesabın yok. Başvuru yapmak ister misin?" → `/diyetisyen-ol` · Gourmet "İşletme hesabın yok" → `/isletme-ekle` · Fit "Antrenör hesabın yok" → `antrenor-ol` · **Gastro'da rol yok, şerit de yok**. | Ö · öni:1030-1034 | `js:` dizgi ve `href` karşılaştırması | özel |
| **H14** | Giriş | Giriş **öncesinde** hesabın varlığına dair hiçbir bilgi verilmez. | Ö · sızıntı gerekçesi öni:1003 · karar hnd:93 · öni:1028-1029 | akış testi: giriş öncesi cevapta rol/hesap bilgisi `0` | 4× |
| **H15** | Gastro girişi | Gastro'nun **E‑posta / Telefon segmenti kalır ve pasif durur**. | Ö · bugünkü hâl `auth/index.blade.php:347-348` (`disabled`, `aria-disabled="true"`) · karar hnd:94 · ters çevirme hnd:121. ⚠ Önizlemenin öni:1046-1048 satırındaki "KALKAR" kararı **ters çevrilmiştir**. | `js:` segment var ve telefon düğmesi `disabled` | Gastro |
| **H16** | Gastro girişi | Pasif telefon düğmesinde `title="Yakında"` yazılmaz. | Ö · karar hnd:95 · hnd:123 | `sh:` `title="Yakında"` araması → `0` | Gastro |
| **H17** | Kayıt | Kayıtta rol seçimi bulunur; **doğrulama gerektiren rol seçildiğinde kayıt formu hiç basılmaz** — yerine tek bilgilendirme kartı ve başvuru düğmesi görünür. | Ö · Diet ve Gourmet'te bugün böyle çalışıyor; rol düğmesi `<label>` değil `<a>` (öni:1083-1087) | `js:` rol=uzman iken form alan sayısı `=== 0`, başvuru bağlantısı `=== 1` | Diet · Gourmet · Fit |
| **H18** | Kayıt | Kayıt butonunun metni **"Hesabımı Oluştur"**dur. | Ö · Gastro ve Diet aynı; Gourmet "Hesap Oluştur" sapması (öni:931-932) | `sh:` dizgi eşitliği | 4× |
| **H19** | Giriş | Giriş butonunun metni **"Giriş Yap"**tır. | Ö · üç depoda aynı, sapma yok (öni:956) | `sh:` dizgi eşitliği | 4× |
| **H20** | Giriş | Alt satır **"Hesabın yok mu? Hemen Kayıt Ol"**dur. | Ö · Gastro ve Diet aynı; Gourmet "Kayıt ol" sapması (öni:958) | `sh:` dizgi eşitliği | 4× |
| **H21** | Giriş | "Beni Hatırla" onay kutusu bulunur ve `name="remember"` taşır. | Ö · üç depoda da var (öni:951) | `js:` `input[name=remember]` sayısı `=== 1` | 4× |
| **H22** | Giriş | Kimlik alanı hem e‑postayı hem kullanıcı adını kabul eder. | Ö · üçü de kabul ediyor (öni:948) | akış testi: iki girdiyle de giriş | 4× |
| **H23** | Kayıt | Kayıt formunda kullanıcı adı alanı bulunur. | Ö · Diet ve Gourmet'te var, Gastro'da basılmıyor (öni:925-926); taban Diet | `js:` `input[name=username]` sayısı `=== 1` | Gastro'ya eklenir |
| **H24** | Kayıt | Ad ve Soyad yan yana basılır (`fk-grid c2`). | Ö · Gastro ve Diet'te `c2` var, Gourmet'te yok (öni:923-924) | `js:` ızgara iki sütun | Gourmet'e eklenir |
| **H25** | Kayıt | Şifre kuralları listesi (`.fk-pwrules`) kayıt formunda basılır. | Ö · Gastro canlı kontrol, Diet `.fk-pwrules`; Gourmet'te 0 eşleşme (öni:921-922) | `js:` `.fk-pwrules` sayısı `>= 1` | Gourmet'e eklenir |
| **H26** | Giriş · kayıt | Giriş ve kayıt **ayrı blade dosyalarıdır**; tek sayfada `?tab=` bölmesi kullanılmaz. | Ö · Diet ve Gourmet ayrı blade, Gastro tek dosya üç bölme (öni:937 · öni:947); taban Diet | `sh:` `?tab=` araması → `0` | Gastro'da değişir |
| **H27** | Kayıt | Kayıt formunda telefon alanı **dört markada da bulunur ve isteğe bağlıdır** — zorunluluk yıldızı taşımaz, boş bırakılınca kayıt tamamlanır. | Ö · bugün yalnız Gastro'da var (`fk-tel` + `fk-tel-cc-select`, öni:927-928); Diet ve Gourmet'te yok · **karar §Y‑15, 2026-08-28** | `js:` `input[name=phone]` sayısı `=== 1`, `required` niteliği yok; boş telefonla kayıt POST'u başarılı döner | 4× |
| **H28** | Giriş | Hız sınırı notu (`.captcha-note`) basılır. | T · yalnız Gastro'da ölçüldü; Diet ve Gourmet'in giriş blade'inde **aranmadı** (öni:957) | `js:` `.captcha-note` sayısı `>= 1` — önce dört depoda ölçülmeli | 4× |
| **H29** | Giriş · kayıt · hesap · şifre sıfırlama | **Kullanıcıya GÖRÜNEN** her yerde **"Şifre"** kullanılır; **"Parola" kullanılmaz**. Kural dizgi ailesinin tamamını bağlar: `Şifre` · `Şifre (tekrar)` · `Mevcut şifre` · `Yeni şifre` · `Şifremi unuttum` · `Şifreyi göster` · `Şifreyi Güncelle` · `Şifreni doğrula`. **İKİ MUAFİYET** vardır ve §H29a'da gerekçelidir: ① **form alan adları** (`oturum_parola` gibi snake_case tanımlayıcılar) ② **yorum satırları**. İkisi de ekranda basılmaz. | Ö · bugün Gastro ve Fit **"Şifre"**, Diet ve Gourmet **"Parola"** (öni:919 · 949 · 950 · 952) · **karar §Y‑13, 2026-08-28** · **kapsam kararı Beyar, 2026-08-29** | `sh:` dört depoda `resources/views` + `lang` içinde, **muaf bölgeler düşürüldükten sonra** `[Pp]arola` araması → `0` | 4× |
| **H30** | Dizgi göçü | Göç **yalnız görünen metni** ilgilendirir. **Diet'te ölçüldü (2026-08-29):** ham tarama **98 geçiş / 14 dosya**; muafiyetten sonra **56 görünen geçiş**, **42'si muaf** (form alan adları + yorumlar). **31 benzersiz görünen dizgi** göç etti. Gastro ve Gourmet'in sayıları kendi dalgalarında yeniden ölçülür — v1.1.x'in "22 dosya · 104 geçiş" rakamı **ham** taramaydı ve muafiyetten önceydi. | Ö · bu turda Diet'te tek tek sayıldı; Fit'te "Parola" zaten **0** | `sh:` göç sonrası muaf bölgeler dışında `0` | Gastro · Diet · Gourmet |
| **H31** | Dizgi göçü | Göç aynı turda **büyük/küçük harf varyantlarını da tekleştirir**: ölçülen üç çift — `Parola (tekrar)` / `Parola (Tekrar)`, `Yeni parola` / `Yeni Parola`, `Parolamı unuttum` / `Parolamı Unuttum`. Hedef biçim cümle düzenidir: yalnız ilk harf büyük. | Ö · 21 benzersiz dizgi içinde üç çift ölçüldü | `sh:` göç sonrası benzersiz şifre dizgisi sayısı `<= 18` | Gastro · Diet · Gourmet |

### H29a · İki muafiyetin gerekçesi — kapsam kararı

**Karar (Beyar, 2026-08-29):** *"Yalnız ekranda görünen metinler değişsin.
Form alan adlarına dokunma — onlar sunucu sözleşmesi, ekranda görünmüyor."*

**① Form alan adları muaf.** Diet'te ölçülen dört ad — `oturum_parola` ·
`kayit_parola` · `silme_parola` · `dondur_parola` — `name`/`id`
niteliklerinde, `@error()` anahtarlarında ve doğrulama kurallarında geçer.
**Yedi dosya** bunları okur: `HesabimController` · `VeriController` ve beş
test. Kullanıcının hiç görmediği bir dizgi için sunucu sözleşmesini kırmak,
kuralın istediği şey değildir.

> ⚠ **Alan adının EKRANDAKİ ETİKETİ muaf DEĞİLDİR.**
> `lang/tr/validation.php`in `attributes` dizisinde **anahtar** alan adıdır
> ve kalır; **değer** kullanıcıya basılır ve göç eder:
> `'oturum_parola' => 'parola'` → `'oturum_parola' => 'şifre'`.

**② Yorum satırları muaf.** Blade `{{-- --}}`, HTML `<!-- -->` ve lang
dosyalarının PHP docblock'ları ekranda basılmaz.

**Ölçütün kendisi bu iki muafiyeti uygular** (`SartnameKaynakKapisiTest::
gorunenMetin()`); muafiyet testin içinde gerekçesiyle yazılıdır. Kuralın
hükmü daralmadı — *ölçüt* kuralın söylediği şeye (**görünen** metin)
hizalandı.

| **H32** | Kayıt | Kayıt formunda **iki** onay kutusu bulunur, dört markada aynı: ① **Kullanım Koşulları** ② **KVKK Aydınlatma Metni**. Üçüncü kutu basılmaz. | Ö · bugün Gastro 3 (Üyelik Sözleşmesi · Aydınlatma+KVKK · Kampanya opsiyonel), Diet 2, Gourmet 2 (`terms` · `kvkk`) (öni:929-930) · **karar §Y‑14, 2026-08-28** | `js: document.querySelectorAll(".ol-consents .fb-kvkk").length === 2` | 4× |
| **H33** | Gastro kaydı | Gastro'nun üçüncü onay kutusu (kampanya izni) kayıt formundan kalkar. | Ö · `.ol-consents` içinde üç `.fb-kvkk` (öni:929-930) · karar §Y‑14 | `js:` Gastro kayıt formunda onay kutusu sayısı `=== 2` | Gastro |

---

## I · ABONELİK VE ÖDEMELER — Ekran D

Önizleme bölüm 9. Taban **Diet**'tir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **I1** | Abonelik | Yüzeyin adresi `/hesabim/abonelik-odemeler`'dir ve hesap ekranından **ayrıdır**. | Ö · `routes/diet.php:918-920` (öni:1109) | `sh:` rota tanımı dört depoda | 4× |
| **I2** | Abonelik | Sekme sayısı **6**'dır; Gourmet'te **5**'tir. | Ö · Diet bugün 6 (öni:1110) · hedef öni:1122-1128 · hnd:29 | `js:` sekme sayımı | özel |
| **I3** | Abonelik | Sekme sırası sabittir: ① Pro Üyeliğim ② markanın hizmet sekmesi ③ Ödeme Yöntemlerim ④ Ödeme Geçmişim ⑤ Faturalarım ⑥ İptal ve İade. | Ö · öni:1122-1124 | `js:` etiketlerin sırayla karşılaştırması | 4× |
| **I4** | Abonelik | İkinci sekmenin adı markaya özeldir: Gastro **Aboneliklerim** · Diet **Diyetisyen Hizmetleri** · Fit **Antrenör Hizmetleri** · Gourmet'te **basılmaz**. | Ö · öni:1125-1128 (K15) | `js:` dizgi karşılaştırması; Gourmet'te sayı `=== 0` | özel |
| **I5** | Gourmet abonelik | Gourmet'te boş sekme ya da "Yakında" rozeti konmaz; yüzey beş sekmeli olur. | Ö · öni:3116-3117 | `sh:` Gourmet abonelik yüzeyinde `Yakında` araması → `0` | Gourmet |
| **I6** | Abonelik | Bölme dosyaları: `_ozet` · `_pro` · `_hizmetler` · `_yontemler` · `_gecmis` · `_faturalar` · `_talepler`, artı `fatura` ve `fatura-yazdir`. | Ö · Diet'in bugünkü dosyaları (öni:1111) | `sh:` dosya listesi karşılaştırması | 4× |
| **I7** | Abonelik | Kabuk kimlik bandı + `.pf-tabbar > nav.pf-tabs`'tır — hesap yüzeyiyle aynı kit. | Ö · `_shell.blade.php:58-63` (öni:1111) | `js:` sınıf ağacı | 4× |
| **I8** | Abonelik | Ödeme altyapısı **sağlayıcı seçilmeden tam kurulur**; sağlayıcıya bağlı olan dört parçadır. | Ö · on parça sağlayıcıdan bağımsız ve Gastro'da yazılı (öni:2187) · karar hnd:108 | `sh:` `FakeGateway` ile uçtan uca satın alma testi geçer | 4× |
| **I9** | Gourmet abonelik | Gourmet'in ayarlar içindeki "Üyelik Paketi" sekmesi ve iki kartı bu yüzeye taşınır. | Ö · `ayarlar.blade.php:369`, `:382`; `abonelik` araması `routes/gourmet.php`'te 0 eşleşme (öni:1115) | `js:` Gourmet ayarlarında "Üyelik Paketi" sekmesi yok | Gourmet |
| **I10** | Diet abonelik | Diet'te yönetim tarafı abonelik ekranı **§Y‑7 kapanmadan** açılmaz. | Ö · `CLAUDE.md`'nin 2026‑08‑17 kapalı kararı (öni:1523-1526) | U2 geçerli | Diet |

---

## J · ADMİN PANEL SIDEBAR — Ekran E

Önizleme bölüm 10 ve 14. Taban **Gastro**'dur.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **J1** | Admin sidebar | Sidebar genişliği **340px**'tir (`--sa-side-w`) ve gövde aynı değerle içeri itilir. | Ö · `reference/admin/sa-shell.css:52` ve `:332` (öni:1135) | `pw:` `rect(".sa-side").width === 340` ve gövde `margin-left === 340` | 4× |
| **J2** | Admin sidebar | Bölüm sayısı **üç**tür: **ANA İÇERİK · OPERASYON · YAPILANDIRMA**. Gourmet'in dört bölümlü kendi ekseni (MODÜLLER · SÖZLÜKLER · İŞLETME YÖNETİMİ · SİSTEM) kalkar. | Ö · Gastro kanon (öni:1168 · öni:1179) · hedef diziler öni:3126-3140 | `js: document.querySelectorAll(".sa-nav-title").length === 3` ve metinleri | 4× |
| **J3** | Admin sidebar | "Genel Bakış" bölümlerin **üstünde**, tek kalem olarak durur ve bölüm başlığı taşımaz. | Ö · öni:1144; render öni:3144 | `js:` ilk `.sa-nav-link`'in metni ve ilk `.sa-nav-title`'dan önce olması | 4× |
| **J4** | Admin sidebar | Markaya özel modüller **ANA İÇERİK**'in altında toplanır. | Ö · kök neden çözümü öni:1175-1179 | `js:` marka modülleri ilk bölümde | 4× |
| **J5** | Admin sidebar | Taksonomi **ANA İÇERİK** bölümünün altındadır. | Ö · hedef dizilerde dördünde de ANA İÇERİK'te (öni:3127 · 3130 · 3133 · 3137); bugün Gastro içerik, Diet yapılandırma, Gourmet sözlük (öni:1146) | `js:` Taksonomi kaleminin bölümü | 4× |
| **J6** | Admin sidebar | Kullanıcı yönetimi kaleminin adı dört markada **"Kullanıcılar"**dır. | Ö · bugün üç ad: Üyeler & Yetki / Profiller / Kullanıcılar (öni:1145); hedef dizi öni:3128 | `sh:` dört depoda dizgi eşitliği | 4× |
| **J7** | Admin sidebar | Destek kaleminin adı dört markada **"Destek"**tir. | Ö · bugün iki ad: Destek Talepleri / Destek Masası (öni:1148); hedef dizi öni:3128 | `sh:` dizgi eşitliği | 4× |
| **J8** | Admin sidebar | Kazanç kaleminin adı **"Kazanç ve Ödemeler"**dir. | Ö · bugün iki ad: "Kazançlar & Ödemeler" / "Kazanç ve Ödeme" (öni:1157); hedef dizi öni:3128 | `sh:` dizgi eşitliği | Gastro · Diet · Fit |
| **J9** | Admin sidebar | Aynı kalem menüde **bir kez** geçer. | Ö · Gourmet'in menüsünde Yorum Moderasyonu iki kez geçiyor (öni:1149 · öni:1509) | `js:` kalem adları kümesinde tekrar yok | 4× |
| **J10** | Admin sidebar | **"Diller" kalemi dört markanın da sidebar'ından kalkar** ve ekran kaldırılır. | Ö · karar hnd:104 · gerekçe öni:1216-1221. ⚠ Önizlemenin hedef `SIDE` dizilerinde "Diller" hâlâ duruyor (öni:3128 · 3131 · 3135 · 3139) — **karar sonradan verilmiştir, diziler eskimiştir**. | `sh:` `AdminMenu.php`'de `Diller` araması → `0` | 4× |
| **J11** | Admin sidebar | Hedef kalem sayıları (Genel Bakış dahil, "Diller" düşürülmüş): **Gastro 23 · Diet 24 · Gourmet 19 · Fit 21**. | T · ölçülen hedef dizilerden (öni:3126-3140) J10 uygulanarak hesaplandı | `js:` `.sa-nav-link` sayımı marka başına | özel |
| **J12** | Gourmet admin | Gourmet'in Sponsorluk & Reklam ekranları **yazılmıştır**; yalnız menü kaydı gerekir, kod yazılmaz. | Ö · `SponsorAdminController` (`routes/admin.php:350-353`), `AdSlotAdminController` (`:357-360`), `AdCampaignAdminController` (`:364-367`), `AdCreativeAdminController`; `AdminMenu.php`'de 0 eşleşme (öni:1244-1245 · öni:1504-1508) | `sh:` menüde dört kalem görünür | Gourmet |
| **J13** | Gourmet admin | Gourmet'e **9 yeni ekran** yazılır: Ayarlar · Sayfalar & SSS · Menü/Navigasyon · Geri Bildirim · Log Yönetimi · Raporlar · Kademeler · Abonelikler · Kazanç ve Ödemeler. | Ö · sekizinin rotası yok (`routes/admin.php` araması 0), Ayarlar için bulunan tek rota `/dada-route/ayarlar` marka ayarı değil (öni:1244-1250 · öni:1492-1500) | `sh:` dokuz rotanın varlığı | Gourmet |
| **J14** | Diet admin | Diet'e **4 yeni ekran** yazılır: Raporlar · Log Yönetimi · Abonelikler · Medya Kuyruğu. | Ö · üçünün rotası yok (`raporlar` 0 · `loglar` 0 · `abonelik` 0); medya için 2 rota var ama moderasyon kuyruğu karşılığı değil (öni:1254-1257 · öni:1516-1519) | `sh:` dört rotanın varlığı | Diet |
| **J15** | Yeni admin ekranları | Yeni ekranların dosya sayısı emsalden alınır: basit liste ekranı **2 dosya** (Gastro Loglar: controller 191 satır + blade 236 satır), çok kırılımlı rapor ekranı **8 dosya** (Gastro Raporlar: controller 74 satır + 7 blade). | Ö · iki emsal ölçüldü (öni:1250 · öni:1531-1532) | `sh:` dosya sayımı | Gourmet · Diet |
| **J16** | Yeni admin ekranları | Toplam satır sayısı şartname kapsamı dışındadır. | X · ölçülemedi — her ekranın büyüklüğü kapsamına bağlı, bu turda yalnız iki emsal ölçüldü (öni:1265-1269 · öni:2215) | — | — |
| **J17** | Fit admin | Fit'in admin sidebar sütunu **hedeftir, ölçüm değildir** — Fit'te yönetim paneli yoktur. | X · depoda yalnız `antrenor-panelim-v1.html` var, o da antrenörün kendi paneli (öni:1171 · öni:1260-1261 · öni:2211) | U2 geçerli; Fit sidebar'ı Dalga P'de ölçülür | Fit |
| **J18** | Admin sidebar | Sayfa yönetimi kaleminin adı dört markada **"Sayfalar"**dır — tek sözcük, `&` yok. `Sayfalar & SEO` ve `Sayfalar & SSS` adları kalkar. | Ö · ekranın gerçekte yönettiği üç şey ölçüldü (§J18a) · **karar §Y‑12, 2026-08-28** | `sh:` dört depoda `AdminMenu`'de `Sayfalar &` araması → `0`; kalem metni tam `Sayfalar` | 4× |

### J18a · "Sayfalar" adının gerekçesi — ölçüm

Karar Beyar tarafından bu şartnameye bırakıldı. **Ekranın adına değil, ne
yönettiğine bakıldı**; dört depo tek tek ölçüldü.

| Ne yönetiyor | Gastro (`Page`) | Diet (`DietPage`) |
|---|---|---|
| **① Sayfa içeriği** | `slug` · `type` · `title` · `lead` · `body` · `body_blocks` · `status` · `published_at` | `key` · `slug` · `title` · `excerpt` · `body` · `cover_media_id` · `cover_url` · `status` · `published_at` · `position` |
| **② SEO meta** | `seo_title` · `seo_description` · `seo_keywords` | `seo_title` · `seo_description` · `seo_noindex` |
| **③ SSS kayıtları** | `faq_items` (JSON kolon, yalnız `seo_landing` satırlarında) | `DietFaq` modeli — yazma uçları **aynı controller'da**: `PageAdminController@storeFaq/updateFaq/destroyFaq` |

**Ölçülen üç bulgu:**

**① İki ad da eksik.** Gastro'nun `Sayfalar & SEO`'su ①+②'yi adlandırıyor,
③'ü atlıyor. Diet'in `Sayfalar & SSS`'i ①+③'ü adlandırıyor, ②'yi atlıyor.
İkisi de yönettiği üç şeyden ikisini sayıyor — ad eksik, ekran değil.

**② SEO ve SSS'in kendi ekranı yok.** Diet'in kendi rota şerhi bağlayıcı:
*"SSS'in EKRANI YOK — soru listesi ve ekleme formu SAYFA DÜZENLEME
ekranının içindedir. Yani üç yazma ucu var, dördüncü bir GET yok"*
(`routes/admin.php:300-308`). Gastro'da SSS bir kolon
(`Page.faq_items`), SEO üç kolon. **Kendi ekranı olmayan şey ekran adına
girmez** — ikisi de sayfanın alanı/çocuğu, kardeş varlık değil.

**③ Depo, varlığı adlandırırken zaten "Sayfalar" diyor.** Menü kalemi
dışında iki yerde ölçüldü, ikisi de bare ad kullanıyor:
`ActivityLogCatalog.php:64` → `'sayfalar' => ['label' => 'Sayfalar & SEO',
'subjects' => [Page::class]]` — tek özne; ve Diet'in
`CeviriIlerlemesi.php:63` → `['etiket' => __('Sayfalar'), 'model' =>
DietPage::class]`. Kod, işlevi değil varlığı adlandırdığında **"Sayfalar"**
diyor.

**Seçim: `Sayfalar`.** Bir ekran yönettiği **varlığı** adlandırır, alanlarını
saymaz — "Kullanıcılar" ekranına "Kullanıcılar & Şifreler" denmediği gibi.
Bu ayrıca §J6 · §J7 · §J8'in uyguladığı kuralın aynısıdır: `&` ile ad
birleştirme deseni bu şartnamede zaten üç kalemde kaldırıldı
(`Üyeler & Yetki` → `Kullanıcılar`, `Kazançlar & Ödemeler` → `Kazanç ve
Ödemeler`, `Destek Talepleri` → `Destek`) ve "aynı işlevin farklı adla
geçmesi" ölçülmüş kusur olarak kayıtlıdır (öni:1194).

**Kaybolan bir şey var mı — ölçüldü, yok.** SEO alanları ve SSS listesi
sayfa düzenleme ekranının içinde durmaya devam eder; ikisi de bugün de
oradadır. Adın kısalması yüzeyden hiçbir yetenek kaldırmaz.

> ⚠ **Ölçülen çatışma — §Y‑10.** Önizlemenin hedef `SIDE` dizisinde Gourmet'in
> OPERASYON bölümünde **Kazanç ve Ödemeler · Kademeler · Abonelikler** yoktur
> (öni:3134); oysa J13 bu üçünü yazılacak ekran listesine koyuyor (öni:1498-1500).
> Fit'in hedef dizisinde de **Sponsorluk** ve **Kademeler** yoktur (öni:3139),
> ama Dalga 6 sponsorluğu dört markaya yazıyor (hnd:188). J11'in sayıları
> bugünkü dizilerden hesaplanmıştır; çatışma kapanınca güncellenir.

---

## K · ADMİN EKRAN KALIBI — Ekran G

Önizleme bölüm 13. Taban **Gastro**'dur. **Yeni yazılacak her admin ekranı bu
kalıptan çıkar** — Gourmet'e 9, Diet'e 4 ekran gelecektir ve onüçünün de tek
kalemden çıkmış görünmesi bu kalıba uymakla olur.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **K1** | Admin ekranı | Sayfa başlığı bloğu: `display:flex` · `align-items:flex-end` · `justify-content:space-between` · `gap:18px` · `margin-bottom:24px` · `flex-wrap:wrap`. `h1` 24px, alt satır 13.5px `--muted` `margin-top:5px`. | Ö · `sa-shell.css:333-335` (öni:1402-1405) | `js:` sekiz değerin eşitliği | 4× |
| **K2** | Admin ekranı | Sağdaki eylem düğmeleri: `.ph-actions{display:flex;gap:10px;flex:none;flex-wrap:wrap;max-width:100%}`. `flex-wrap` **zorunludur**. | Ö · `sa-shell.css:340`; kuralın kendi şerhi: 981–1062px'te 4+ düğme sayfayı taşırıyor, sarmasız `max-width` düğmeyi 66px'e küçültüp 48px yüksekliği bozuyor (`:336-339`) (öni:1406-1409) | `pw:` 981px ve 1062px'te yatay taşma `0`, düğme yüksekliği `48` | 4× |
| **K3** | Admin ekranı | Bilgi bandı: dolgu `16px 24px` · `gap:16px` · `radius:16px` · `margin-bottom:24px`; zemin marka fısıltısı, kenarlık marka rengiyle karışım. Zorunlu değildir; varsa başlık bloğunun hemen altındadır. | Ö · `admin.css:461` (öni:1410-1413) | `js:` dört değerin eşitliği ve DOM konumu | 4× |
| **K4** | Admin ekranı | Bildirim satırı: `display:flex` · `gap:8px` · dolgu `12px 16px` · `radius:12px` · 14.4px/700 · `margin-bottom:16px`. Başarı bildirimi yeşil; **kalıcı nötr durum için `.sa-flash.is-note`** (krem zemin) kullanılır. | Ö · `admin.css:146` ve `:147-151` (öni:1414-1417) | `js:` altı değerin eşitliği | 4× |
| **K5** | Admin liste ekranı | Filtre ve arama şeridi kartın **içinde**, tablonun **üstünde**, kendi alt kenarlığıyla durur: `.filter-bar{display:flex;gap:12px;flex-wrap:wrap;padding:14px 22px;border-bottom:1px solid}`. Arama `flex:1` · `min-width:200px` · `max-width:340px`; girdi `height:38px` · dolgu `0 12px 0 34px` · 13px; ikon `left:12px` mutlak. | Ö · `admin.css:408-413` (öni:1418-1421) | `js:` dokuz değerin eşitliği ve DOM konumu | 4× |
| **K6** | Admin liste ekranı | Tablo başlık satırı: `text-align:left` · 11.2px/800 · `uppercase` · `letter-spacing:.03em` · `--muted` · dolgu `12px 16px` · `white-space:nowrap`. Sütun genişliği içerikten gelir; sabit genişlik verilmez. | Ö · `admin.css:90` (öni:1422-1425) | `js:` yedi değerin eşitliği; `th`'lerde `width` yok | 4× |
| **K7** | Admin liste ekranı | Tablo satırı: dolgu `12px 16px` · alt kenarlık 1px · renk `--slate-2` · `vertical-align:middle` · `white-space:nowrap`; son satırda kenarlık yok, `:hover` zemini `--bg`. | Ö · `admin.css:91-93` (öni:1426-1428) | `js:` yedi değerin eşitliği | 4× |
| **K8** | Admin liste ekranı | Sayı hücresi `.ptable__num`'dur: `tabular-nums` + 700. | Ö · `admin.css:94` (öni:1429) | `js: fontVariantNumeric` ve `fontWeight` | 4× |
| **K9** | Admin liste ekranı | Geniş tablo kartın içinde kayar: `.pc-body{overflow-x:auto}`. Sayfa yatay taşmaz. | Ö · `sa-list.css` (öni:1430-1432) | `pw:` `document.body.scrollWidth === clientWidth` | 4× |
| **K10** | Admin liste ekranı | Sayfalama kartın ayağındadır ve üst kenarlıkla ayrılır: `.pager{justify-content:space-between;padding:14px 22px;border-top:1px solid;flex-wrap:wrap}`. Düğme `min-width:34px` · `height:34px` · `radius:8px` · 13px/800. Solda `.pager-info`, sağda düğmeler; aktif düğme marka rengiyle dolu, pasif `.is-off` %40 opaklık. | Ö · `admin.css:448-457` (öni:1433-1436) | `js:` sekiz değerin eşitliği | 4× |
| **K11** | Admin ekranı | Boş durum §D3'ün kitini kullanır — üye tarafının kiti kullanılmaz. | Ö · `sa-shell.css:404-408` (öni:1437-1440) | D3 · D4 doğrulaması | 4× |
| **K12** | Admin form ekranı | Form kartı bölümlere ayrılır: `.form-sec{padding:18px 22px;border-bottom:1px solid}`, son bölümde kenarlık yoktur. Bölüm başlığı `.form-sec-tt` 13px/700 · `margin-bottom:14px` · `gap:8px`. | Ö · `admin-sefler/sa-sefler-form.css:20-23` (öni:1441-1444) | `js:` altı değerin eşitliği | 4× |
| **K13** | Admin form ekranı | Bölümlü form kartı **dolgusuzdur**: `.pnl-card:has(>.form-sec){padding:0}`. | Ö · `admin.css:349` (öni:1444) | `js: padding === "0px"` | 4× |
| **K14** | Admin form ekranı | Form sekmesi **alt çizgilidir**: `.sa-form-tabs{gap:6px;border-bottom:1px solid;margin-bottom:18px}`, sekme dolgusu `9px 14px` · 13px/700 · `border-bottom:2px`. Hesap yüzeyinin dolgulu `.pf-tabs`'ından **ayrıdır ve karıştırılmaz**. Hatalı sekmede `::after` kırmızı nokta basılır. | Ö · `sa-ui.css:176-179` ve `:186` (öni:1445-1448) | `js:` altı değerin eşitliği; `.pf-tabs` sınıfı admin formunda yok | 4× |
| **K15** | Admin form ekranı | Dil sekmesi kabının dolgusu **`12px 22px 0`**'dır; yan değer `.form-sec`'in kendi 22px'idir. | Ö · kök neden ölçüldü: `admin-lang-tabs.css:30` `.lang-scope`'a yalnız `padding-top` veriyor, `admin.css:349` kartın dolgusunu sıfırlıyor, `sa-sefler-form.css:20` alanları 22px içeriden başlatıyor → **tam 22px sola kayma** (öni:1465-1475) | `pw:` `rect(".lang-tabs").left === rect(".form-sec > *").left` | 4× |
| **K16** | Admin form ekranı | Dil sekmesi kiti: `.lang-tabs{display:inline-flex;gap:4px;padding:4px;margin-bottom:24px;radius:12px}`, sekme dolgusu `7px 14px` · 12.5px/700. CSS dosyası üç depoda bayt aynıdır (`md5 e63f0d2a…`). | Ö · `admin-lang-tabs.css:30-34` (öni:1449-1451 · öni:1188) | `sh:` üç depoda `md5` eşitliği | 4× |
| **K17** | Admin ekranı | Yıkıcı her eylem onay diyaloğundan geçer: `width:min(420px,100%)` · dolgu `26px 26px 22px` · `radius:16px`; ikon 46×46 `radius:13px`; eylemler `gap:10px`, **sağa dayalı**, düğme dolgusu `11px 20px`. | Ö · `sa-confirm.css` (öni:1453-1456) | `js:` yedi değerin eşitliği | 4× |
| **K18** | Admin ekranı | Diyaloğun eylemleri **sağa** dayalıdır; form ayağındaki kaydet düğmesi **sola** dayalıdır. İkisi farklıdır ve öyle kalır. | Ö · öni:1456 · C20 | `js:` diyalogda `justifyContent === "flex-end"`, `.pc-foot`'ta değil | 4× |
| **K19** | Admin ekranı | Kaydet düğmesi kartın ayağında **solda**dır — hesap yüzeyiyle aynı kural. | Ö · `sa-shell.css` · `planim.css:151` (öni:1457-1460) | C20 doğrulaması | 4× |

---

## L · BAŞVURU EKRANLARI — Ekran F

Önizleme bölüm 11. Üçü de bugün vardır ve üçü de aynı kalıbı kullanır.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **L1** | Başvuru ekranı | Kabukta **kimlik bandı yoktur**; sayfa başlığı ve tanıtım bloğuyla başlar. | Ö · hedef kabuk öni:1327-1328 | `js:` `.pf-head` sayısı `=== 0` | Diet · Gourmet · Fit |
| **L2** | Başvuru ekranı | Form **dört bölümlüdür** (`.form-card > .fc-step`). | Ö · üçünde de 4 (öni:1286) | `js: document.querySelectorAll(".fc-step").length === 4` | Diet · Gourmet · Fit |
| **L3** | Başvuru ekranı | Süreç göstergesi **dört adımlıdır** (`.proc-steps > .proc-step`). | Ö · Diet 4, Fit 4, Gourmet bugün 3 (öni:1291-1294); Gourmet'in göstergesi "Formu doldur" ilk adımıyla dörde tamamlanır (öni:1332-1333) | `js: document.querySelectorAll(".proc-step").length === 4` | Diet · Gourmet · Fit |
| **L4** | Başvuru ekranı | Bölüm adları markaya özeldir. **Diet:** Kişisel Bilgiler · Mesleki Bilgiler · Belgeler & Görseller · Profil & Hizmet. **Gourmet:** İşletme Bilgileri · İletişim & Yetkili · Hizmetler & Saatler · Görseller & Belgeler. | Ö · Diet dördü, Gourmet ilk üçü (öni:1288-1289). ⚠ Gourmet'in **4. bölüm başlığı türetmedir** — `<h2>` boş döndü (öni:2213) | `js:` başlık dizgisi karşılaştırması | özel |
| **L5** | Başvuru ekranı | Adım adları markaya özeldir. **Diet:** Formu doldur → Diploma doğrulama → Ön görüşme → Profilin yayında. **Fit:** Sertifikanı yükle → İnceleme → Onaylı rozet → Yayında. | Ö · öni:1292-1294 | `js:` adım dizgisi karşılaştırması | özel |
| **L6** | Başvuru ekranı | Boşluk ve tipografi Diet'in kart kitinden gelir: başlık `18px 22px` · gövde `22px` · alan altı `22px`. | Ö · öni:1330-1331 · C3 · C5 · C18 | C3/C5/C18 doğrulaması | 4× |
| **L7** | Başvuru ekranı | Durum kartının metni **"Başvurun alındı 🎉"**dır. | Ö · üçünde de aynı (öni:1306) | `sh:` dizgi eşitliği | Diet · Gourmet · Fit |
| **L8** | Başvuru ekranı | Belge yükleme kartı bulunur. | Ö · Diet diploma zorunlu + sertifikalar çoklu (`.pdf,.jpg,.jpeg,.png`); Gourmet 5 dosya alanı (öni:1301-1303) | `js:` `input[type=file]` sayısı `>= 1` | Diet · Gourmet · Fit |
| **L9** | Başvuru ekranı | Değişen tek şey istenen bilgiler ve renktir; kabuk dört markada aynıdır. | Ö · öni:1327-1332 | `js:` sınıf ağacı karşılaştırması | Diet · Gourmet · Fit |
| **L10** | Gastro | Gastro'da üye tarafında başvuru ekranı **yoktur**; şef/üretici yetkisi yöneticinin kullanıcı kaydından verilir. | Ö · `routes/web.php`'te `basvuru`/`application` araması kayıt formu döndürmüyor; bulunan üçü başvuru değil — `/uretici/plan`, `AdminUserChefProfileController::setCreatorApproval`, `/admin/creator-planlari/{plan}/onayla` (öni:1312-1323) | `sh:` rota araması | Gastro |
| **L11** | Gastro | Gastro'da başvuru ekranı kurulup kurulmayacağı **§Y‑4'te açıktır**. | Ö · öni:1322-1323 · hnd:134 | U2 geçerli | Gastro |
| **L12** | Fit başvurusu | Fit başvurusunun **alan adları türetmedir**; bölüm ve adım sayısı ölçülmüştür. | X · maket, form olarak yazılmamış (öni:2212 · öni:1297) | Dalga P'de ölçülür | Fit |

---

## M · OPERASYON PANELLERİ — Ekran H

Önizleme bölüm 15 ve 16. Ne üye tarafı ne yönetim tarafı — **arada duran
üçüncü katman**. Taban **Diet**'tir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **M1** | Operasyon paneli | Kabuk tabanı **Diet**'tir. | Ö · en çok ekran (13), en çok nav kalemi (11), tek gerçek gruplama; Gourmet'in de kullandığı kit (öni:1575-1576) | — | 4× |
| **M2** | Operasyon paneli | Sidebar `.pnl-side` + `.pnl-nav`'dır ve gruplanır. | Ö · Diet ve Gourmet zaten aynı kiti kullanıyor (öni:1569-1572 · öni:1635-1637) | `js:` sınıf varlığı | Diet · Gourmet · Fit |
| **M3** | Operasyon paneli | Sayfa başlığı bloğu `.pnl-page-head`'dir. | Ö · öni:1636-1637 | `js:` sınıf varlığı | Diet · Gourmet · Fit |
| **M4** | Gourmet paneli | Gourmet'in fazladan taşıdığı `.sa-rail` ikon rayı **korunur** — çok mekânlı sahip için mekân değiştirme yolu odur. | Ö · öni:1573 · öni:1638-1639 | `js:` `.sa-rail` sayısı `=== 1` | Gourmet |
| **M5** | Fit paneli | Fit'in tek sayfa çapa sekmesi deseni (`.pf-tabs`) kalkar; sidebar kabuğuna döner. | Ö · bugünkü hâl `antrenor-panelim-v1.html`, beş bölüm tek dosyada (öni:1559 · öni:1574) | `js:` `.pnl-side` var, çapa sekmesi yok | Fit |
| **M6** | Operasyon paneli | Eksik panel ekranlarının öncelik sırası sabittir: ① Gourmet Yorum Yanıtlama ② Gastro Üretici paneli (Genel Bakış · Aboneler · Kazanç) ③ Gourmet İstatistik ④ Fit panelin arkası ⑤ Gourmet Etkinlik Yönetimi ⑥ Diet Paylaşılan Dosyalar. | Ö · sıra ve gerekçesi öni:1651-1668 | sıra karşılaştırması | özel |
| **M7** | Operasyon paneli | Panelde **iskelet ekran basılmaz**; veri yokken §D'nin boş durum kartı gösterilir. | Ö · Diet'in en küçük paneli 122 satır, Gourmet'in en küçük gerçek ekranı 230 satır; "yakında" işaretli ölü ekran bulunmadı (öni:1627-1630) | `sh:` panel blade'lerinde `Yakında` araması → `0` | 4× |
| **M8** | Fit paneli | Fit'in paneli bu şartnamenin **Dalga 1–9 kapsamı dışındadır**; Dalga P'de ayrı projede kurulur. | Ö · beş bölüm de statik maket, arkasında rota/controller/tablo yok (öni:1615 · öni:1658) · dalga hnd:192 | U2 geçerli | Fit |
| **M9** | Gastro paneli | Gastro'da operasyon paneli **yoktur**; `/sefler` vitrini ve `/uretici/plan` akışı panel değildir. | Ö · öni:1561-1564 | `sh:` rota araması | Gastro |

---

## N · SOL DAR RAIL — Ekran I

Önizleme bölüm 17. Marka geçiş şeridi. Taban **Gastro**'dur.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **N1** | Sol rail | Rail **altı** ikon taşır. | Ö · hedef öni:1725-1728 · karar hnd:80 | `js:` `.sa-rail` içindeki marka düğümü sayısı `=== 6` | 4× |
| **N2** | Sol rail | Rail'de **ayraç yoktur**; tek dizidir. | Ö · bugün Gastro 0, Diet 1, Gourmet 1 ayraç (öni:1698-1708) · karar hnd:80 · ters çevirme hnd:122 | `js: document.querySelectorAll(".sa-rail-div").length === 0` | 4× |
| **N3** | Sol rail | Sıra sabittir: ① Gastro `fa-utensils` ② Diet `fa-heart-pulse` ③ Gourmet `fa-map-location-dot` ④ Fit `fa-dumbbell` ⑤ DadaAkademi ⑥ DadaStore. | Ö · öni:1725-1728 | `js:` ikon sınıflarının sırayla karşılaştırması | 4× |
| **N4** | Sol rail | İlk dört kalem aktif/tıklanabilir, son iki kalem **kilitli ve sonda**dır. | Ö · öni:1725-1728 | `js:` `.is-locked` indeksleri `[4,5]` | 4× |
| **N5** | Sol rail | Diet'in rail adı **"Diet"**, ikonu **`fa-heart-pulse`**'tır. | Ö · bugün iki farklı: kendi rayında "Sağlık & Diyet" + `fa-heart-pulse`, Gourmet'in rayında "Diet" + `fa-leaf` (öni:1719-1720); seçim öni:1729-1731 · karar hnd:80 | `sh:` dört depoda dizgi ve ikon eşitliği | 4× |
| **N6** | Sol rail | Fit'in ikonu `fa-dumbbell`'dir. | T · Fit'te ray yok, öteki raylarda Fit kalemi yok; ikon genel kabuktan alındı (öni:2203 · hnd:149) | ilk gerçek rail ölçümünde `Ö`ye çevrilir | 4× |
| **N7** | Sol rail | Rail dizisi **`AdminMenu::rail()`**'dan okunur; elle yazım kalkar. | Ö · Gastro elle yazılmış (`admin/layout.blade.php:96-112`), Diet `:119-145` ve Gourmet `:65-92` diziden okuyor (öni:1701-1708) · karar hnd:81 | `sh:` `admin/layout.blade.php`'de elle yazılmış marka kalemi `0` | Gastro'da değişir |
| **N8** | Sol rail | Genişlik **76px**'tir (`--sa-rail-w`); konum `position:fixed; top:0; left:0; bottom:0; z-index:85`. | Ö · üç depoda birebir aynı — `sa-rail.css:29` (öni:1680) | `pw: rect(".sa-rail").width === 76` | 4× |
| **N9** | Sol rail | Dolgu `18px 0 18px`, `gap` 7px, sağ kenarlık `1px solid rgba(0,0,0,.32)`. | Ö · `sa-rail.css:31` (öni:1681) | `js:` üç değerin eşitliği | 4× |
| **N10** | Sol rail | Zemin `--rail-bg:#19160F`, saç teli `--hair:rgba(233,226,214,.1)`. | Ö · `sa-shell.css` (öni:1682) | `js:` iki token değeri | 4× |
| **N11** | Sol rail | Logo 46×46 `radius:13px` `margin-bottom:8px`; görsel 30×30 ve `brightness(0) invert(1)` ile beyazlatılır. | Ö · `sa-rail.css:35-37` (öni:1683) | `js:` beş değerin eşitliği | 4× |
| **N12** | Sol rail | Marka ikonu 48×48 `radius:14px`'tir. | Ö · `sa-rail.css:39-40` (öni:1684) | `js:` üç değerin eşitliği | 4× |
| **N13** | Sol rail | Aktif marka `.is-active`: zemin `rgba(--acc-rgb,.2)`, renk `--acc`, solda 3px dikey işaret `::before{left:-14px;top:9px;bottom:9px;width:3px}`. | Ö · `sa-rail.css:45-49` (öni:1685) | `js:` `::before` ölçüleri | 4× |
| **N14** | Sol rail | Kilitli marka `.is-locked`: renk `rgba(233,226,214,.26)`, `cursor:not-allowed`, hover'da hiçbir şey değişmez, köşede `.sr-lock` kilit rozeti bulunur. | Ö · `sa-rail.css:50-55` (öni:1686) | `js:` dört değerin eşitliği ve rozetin varlığı | 4× |
| **N15** | Sol rail | Kilitli markada **"Yakında" metni yazılmaz** — yalnız kilit rozeti basılır. | Ö · `config/markalar.php`'nin kendi notu: "'Yakında' etiketi YASAK — 2026‑07‑28 kararı"; aynı kural `admin/layout.blade.php`'de yazılı (öni:1841-1846) · karar hnd:83 · hnd:139 | `sh:` rail markup'ında `Yakında` araması → `0` | 4× |
| **N16** | Sol rail | Ayak `.sa-rail-foot{margin-top:auto;gap:8px}` — Gaviaworks imzası ve "Siteyi Görüntüle" taşır. | Ö · `sa-rail.css:61` (öni:1688) | `js:` iki değer ve iki kalem | 4× |
| **N17** | Sol rail | Sayaç rozeti `.pl-cnt`: `min-width:16px` · `height:16px` · `radius:999px`, zemin `--acc`. | Ö · `sa-rail.css:56-59` (öni:1689) | `js:` dört değerin eşitliği | 4× |
| **N18** | Fit rail | Fit'e de rail gelir. | Ö · bugün `sa-rail` araması depoda 0 eşleşme (öni:1710) · hedef hnd:80 | `js:` Fit'te `.sa-rail` sayısı `=== 1` | Fit |

---

## O · ÜST SİYAH BANT — Ekran K

Önizleme bölüm 18. Sağ üst köşedeki kardeş marka şeridi
(`partials/topbar.blade.php`). CSS dört depoda **bayt aynıdır**; ayrışan
markup'tır.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **O1** | Üst bant | Bant **yedi** kalem taşır. | Ö · hedef öni:1829-1832 · karar hnd:82. ⚠ Yedi sayısı §Y‑1'in "farklıysa" dalıdır; Campus ile Akademi aynı çıkarsa **altıya** iner. | `js: document.querySelectorAll(".bs-item").length === 7` | 4× |
| **O2** | Üst bant | Sıra sabittir: ① Gastro ② Diet ③ Gourmet ④ Fit **aktif** → ⑤ DadaAkademi ⑥ DadaStore ⑦ DadaCampus **kilitli, sonda**. | Ö · öni:1830-1832 | `js:` yedi kalemin sırası ve `.is-soon` indeksleri `[4,5,6]` | 4× |
| **O3** | Üst bant | Kalem ölçüsü: `height:27px` · dolgu `0 11px` · `radius:8px` · `gap:7px` · 12px/800. | Ö · `.brand-switch > .bs-item`, dört depoda bayt aynı (öni:1750) | `js:` beş değerin eşitliği | 4× |
| **O4** | Üst bant | Hover/focus'ta ad açılır: `.bs-name` `max-width` 0→140px, `opacity` 0→1, geçiş `.26s`. Normalde yalnız ikon görünür. | Ö · öni:1751 | `js:` hover öncesi/sonrası `max-width` | 4× |
| **O5** | Üst bant | Aktif marka `.bs-item.is-active`: dolgu, kenarlık, alttan `inset 0 -2px 0` çizgi, adı **sürekli açık**, `cursor:default`. | Ö · öni:1752 | `js:` dört değerin eşitliği | 4× |
| **O6** | Üst bant | Pasiflik **iki mekanizmayı birlikte** kullanır: `.is-soon` sınıfı görünümü, `aria-disabled="true"` niteliği erişilebilirliği verir. | Ö · bugün ayrı ayrı — Gastro sınıf, Gourmet nitelik; Gourmet'te `is-soon` hiç tanımlı değil (0 eşleşme) (öni:1753 · öni:1781-1786) · karar öni:1838-1840 | `js:` her kilitli kalemde ikisi de var | 4× |
| **O7** | Üst bant | Kilitli kalemde **kilit rozeti** basılır — rail'in `.sr-lock` deseni üst banda taşınır. | Ö · rail'de var (`sa-rail.css:52-55`), üst bantta bugün yalnız soluk renk (öni:1833-1836) | `js:` kilitli kalemin içinde rozet düğümü var | 4× |
| **O8** | Üst bant | Kilitli kalemde **"Yakında" metni ya da `title`'ı yazılmaz**. Bugünkü topbar bu karara uymuyor. | Ö · `config/markalar.php` 2026‑07‑28 kararı (öni:1841-1846) · karar hnd:83 · hnd:139 | `sh:` `title="Yakında"` araması → `0` | 4× |
| **O9** | Diet üst bandı | Diet'in bandına yedi kalem de gelir. | Ö · bugün tek kalem, `bs-item` araması `dd-shell.js`'te 1 eşleşme (öni:1766) | `js:` Diet'te `.bs-item` sayısı `=== 7` | Diet |
| **O10** | Fit üst bandı | Fit'in bandında dört kardeş marka tıklanabilir, üç kilitli kalem kilitlidir. | Ö · bugün beşi de tıklanabilir, hiçbiri pasif değil (öni:1772) | `js:` Fit'te `.is-soon` sayısı `=== 3` | Fit |
| **O11** | Üst bant | Marka sınıfları `.bs-gastro` · `.bs-diet` · `.bs-fit` · `.bs-gourmet` · `.bs-campus`'tür; DadaAkademi ve DadaStore için iki sınıf eklenir. | T · beş sınıf ölçüldü (öni:1750); iki yeni sınıf hedeften türetildi | `css:` yedi sınıfın tanımı | 4× |
| **O12** | Üst bant + rail | Üst bandın ve sol rail'in sıra ve kilit deseni **aynıdır**. | Ö · öni:1833 · N3 · N4 | `js:` iki yüzeydeki kilitli kalem deseni aynı | 4× |
| **O13** | Üst bant | DadaCampus yedinci kalem olarak kilitli kalır; DadaAkademi ile aynı marka olup olmadığı **§Y‑1'de açıktır**. | Ö · ikisini bağlayan hiçbir kayıt yok; `config/markalar.php` yalnız `diet` ve `gourmet`'i tanıyor (öni:1806-1825 · öni:2202) | U2 geçerli | 4× |

---

## P · HERKESE AÇIK PROFİL — Ekran J

Önizleme bölüm 19. Taban **Gastro**'dur: tek sayfa, iki hâl.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **P1** | Herkese açık profil | Profil **tek sayfadır, iki hâli vardır**. Mod query param ile değil, `$isOwn = $viewer !== null && $viewer->is($user)` karşılaştırmasıyla belirlenir. | Ö · `SeflerController:123`; blade'in kendi notu "own↔public mod query param DEĞİL" (öni:1863-1866) · karar hnd:101 | `sh:` profil blade'inde `?mode=` / `request('tab')`'a bağlı mod araması → `0` | 4× |
| **P2** | Herkese açık profil | Kabuk `@extends('layouts.app')`'tir ve `.pf-banner` · `.pf-head` · `.pf-ava` · `.pf-actions` · `.pf-tabs` kitini kullanır — hesap yüzeyiyle aynıdır. | Ö · öni:1874 | `js:` beş sınıfın varlığı | 4× |
| **P3** | Herkese açık profil | İki hâl arasında **kabuk farkı yoktur**; değişen üç şey vardır: sekme sayısı, düzenleme düğmeleri, sayfa başlığı. | Ö · öni:1875 | `js:` iki hâlde sınıf ağacı karşılaştırması | 4× |
| **P4** | Herkese açık profil | Başkasının gözünde gövde sınıfı `pf-public` alır. | Ö · öni:1866-1867 | `js: document.body.classList.contains("pf-public")` | 4× |
| **P5** | Herkese açık profil | Sekme sayıları — kendi hâli / başkasının gördüğü: **Gastro 9/5** · Diet 6/3 · Gourmet 6/4 · Fit 6/3. | Gastro **Ö** (`OWN_TABS` / `PUBLIC_TABS`, öni:1876-1877); Diet · Gourmet · Fit **T** — kendi hâli hiçbirinde yok, panellerin ekranlarından ve tablolarından türetildi (öni:2209-2210 · hnd:150-151) | `js:` iki hâlde sekme sayımı | özel |
| **P6** | Herkese açık profil | Düşen sekmeler **üç gruptur**: ① para ② müşteri/hasta bilgisi ③ kişisel geçmiş. Kalanlar kullanıcının ürettiği ve paylaşmayı seçtiği içeriktir. | Ö · Gastro'nun ölçülen dört düşen sekmesi (öni:1908) · kural öni:1924-1926 | `js:` public hâlde bu üç gruba giren sekme sayısı `=== 0` | 4× |
| **P7** | Herkese açık profil | Düzenleme düğmeleri yalnız `$isOwn` iken basılır. | Ö · `:editable` (öni:1878) · E14 ile aynı desen | `js:` public hâlde `.pf-ava-edit` sayısı `=== 0` | 4× |
| **P8** | Herkese açık profil | Takip durumu kendi profilinde **hiç hesaplanmaz**: `$isFollowing = $viewer !== null && ! $isOwn && $viewer->isFollowing($user)`. | Ö · `SeflerController:138` (öni:1879) | akış testi 10 | 4× |
| **P9** | Herkese açık profil | Donmuş hesap başkasına görünmez, sahibine görünür: `if (! $isOwn && $user->status !== 'active')`. | Ö · `SeflerController:134` (öni:1880) | akış testi: donmuş hesabın public adresi 404 | 4× |
| **P10** | Herkese açık profil | Kendi profilinde düğmeler: **Profili Düzenle** + **Hesap ve Ayarlar**. | Ö · öni:1927-1928 | `js:` dizgi karşılaştırması | 4× |
| **P11** | Herkese açık profil | Başkasının profilinde düğmeler: **Takip Et** + markanın eylemi — Gastro Abone Ol · Diet Randevu Al · Gourmet Takip Et · Fit Paket Al. | Ö · öni:1928-1929 | `js:` dizgi karşılaştırması | özel |
| **P12** | Gourmet profili | Gourmet'e üye profil sayfası yazılır. | Ö · bugün hiç yok; oysa `follows` · `user_badges` · `community_tiers` · `venue_lists` · `route_plans` · `venue_reviews` tabloları var (öni:1893-1894) | `sh:` rota varlığı | Gourmet |
| **P13** | Gourmet profili | Gourmet'te yalnız `venue_lists.visibility` herkese açık olan listeler basılır. | Ö · kolon var (öni:1916) | akış testi 10: özel liste public hâlde görünmüyor | Gourmet |
| **P14** | Fit profili | Fit'in iki ayrı dosyası (`profil-v1` + `antrenor-detay-v1`) tek sayfaya iner. | Ö · bugün iki dosya, Gastro'nun tek-sayfa deseninden sapma (öni:1895-1896) | `sh:` tek blade | Fit |
| **P15** | Diet profili | Diet'e kendi hâli eklenir; bugün yalnız public vitrin vardır ve düzenleme `/panel/profil`'dedir. | Ö · öni:1891-1892 | `js:` kendi profilinde düzenleme düğmeleri basılıyor | Diet |

---

## R · BANNER

Önizleme bölüm 20. **Grup içinde tek yükseklik, dört markada da aynı.**
Gruplar arasında farklı olabilir.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **R1** | Banner | Yükseklik grupları **beş**tir: **Liste 544px · Detay 560px · Kurumsal 544px · Profil/Hesap 280px · Ana sayfa 100dvh**. | Ö‑tar · Fit'te Chrome 1440×900, 18 sayfa: liste 6 sayfa ×544, detay 3 sayfa ×560, kurumsal 5 sayfa ×544, profil 280, `--hero-full:100dvh` (öni:1958 · 1962 · 1965 · 1968 · 1973) · karar hnd:109 | `pw: rect(banner).height` grup başına | 4× |
| **R2** | Banner | Bir grubun içindeki her sayfa **aynı yüksekliktedir**. | Ö · öni:1943 | `pw:` gruptaki tüm sayfalarda yükseklik farkı `0` | 4× |
| **R3** | Banner | Değerler ölçülen **en uzun** olandan alınır; kırpma yapılmaz. | Ö · Liste 515→544, Detay 504→560, Profil 240→280 (öni:2046-2048) | değer karşılaştırması | 4× |
| **R4** | Banner | Token adları: `--banner-h-liste` · `--banner-h-detay` · `--banner-h-kurumsal` · `--banner-h-profil` · `--hero-full`. İlk ikisi Fit'te zaten vardır, üçü yenidir. | Ö · öni:2057-2059 | `css:` beş token'ın tanımı dört depoda | 4× |
| **R5** | Banner | Liste ve Kurumsal aynı sayıyı taşır ama **ayrı grup kalır** — ileride biri değişince öteki etkilenmesin diye. | Ö · Fit'te bugün aynı sınıfı paylaşıyorlar (öni:2054-2056) | `css:` iki ayrı token tanımlı | 4× |
| **R6** | Banner | Breadcrumb banner'ın **üst kenarından 128px, sol kenarından 132px**; yazı boyutu **12.5px**. | Ö‑tar · Fit'te altı sayfada birebir aynı (öni:1984) · karar hnd:110. ⚠ Fit'in `antrenor-detay` sayfasında yazı 13px — ölçülen sapma, 12.5'e iner. | `pw:` üç değerin eşitliği | 4× |
| **R7** | Banner | Banner yüksekliği değişse de R6'nın üç sayısı değişmez; breadcrumb banner'ın üstüne sabitlenir, **ortalanmaz**. | Ö · öni:1986 | `pw:` iki farklı yükseklikte aynı üç sayı | 4× |
| **R8** | Banner | Başlık bloğunun dikey merkezi formülle bulunur: **128px + (banner yüksekliği − 128px) ÷ 2**. Liste/Kurumsal 544 → **336px**, Detay 560 → **344px**. | T · formül; girdileri Ö‑tar. Bugünkü hâl merkezde **değil**: Fit'te `h1` uzaklığı Liste 216 ve 266.1, Detay 186.2 ve 279.1, Kurumsal 216 ve 216 (öni:1989-1994) · karar hnd:111 | `pw:` blok merkezinin banner üstünden uzaklığı | 4× |
| **R9** | Banner | Blok içeriği sırası sabittir: başlık → (varsa) alt satır → ayraçlı istatistik satırı. | Ö · öni:1995 | `js:` DOM sırası | 4× |
| **R10** | Banner | Yer yetmezse **banner yüksekliği artar**; blok kırpılmaz, sıkışmaz, yazı küçültülmez. Grup yüksekliği o gruptaki en uzun bloğun sığdığı değerdir. | Ö · öni:1996 · öni:2008 | `pw:` blokta `overflow` gizli değil, `font-size` sabit | 4× |
| **R11** | Banner | Banner'ın içinde **arama kutusu bulunmaz**. | Ö · bugün yalnız Gourmet'te: `.ke-hero-search` ve `.mkl-hero-search`, üç ekranda (`mekan-liste/_hero` · `gurme-lezzetler/index` · `etkinlikler/index`); öteki üçünde 0 eşleşme (öni:1998-1999) · karar hnd:112 | `sh:` dört depoda banner içi arama araması → `0` | 4× |
| **R12** | Gourmet | Arama kutusu kalktıktan sonra kullanıcı aramaya üç yoldan ulaşır: üst bar araması (`gourmet.arama`) · arama sayfası `/gourmet-ara` (+ `/gourmet-ara/oneriler`) · mekân bulucu `/mekan-bul`. Üçü de bugün çalışır. | Ö · öni:2001-2005 | `sh:` üç rotanın varlığı | Gourmet |
| **R13** | Profil/Hesap banner'ı | Profil/Hesap grubunda breadcrumb banner'ın üstünde değil, **kapağa binen kimlik kartının içinde** taşınır (`kimlik-bandi.blade.php` `:crumb` prop'u). Başlık da banner'ın değil kartın içindedir. Bu ayrım **bilinçlidir ve bozulmaz**. | Ö · öni:2025-2028 | `js:` breadcrumb'ın `closest(".pf-head")` sonucu boş değil | 4× |
| **R14** | Kurumsal banner | Kurumsal sayfada istatistik satırı bulunmaz. | Ö · öni:2020 | `js:` istatistik satırı sayısı `=== 0` | 4× |
| **R15** | Banner | İstatistik satırının **kaç kalem taşıyacağı** şartname kapsamı dışındadır; yeri ve sırası sabittir, sayı markaya bırakılmıştır. | X · ölçülemedi — sayfa sayfa değişen içerik; saymak için dört uygulamanın da ayakta olması gerekiyor (öni:2032-2036 · öni:2221) | — | özel |
| **R16** | Diet profil kapağı | Diet'in bugünkü 240px profil kapağı 280px'e çıkar (≤900px'te 160px olan değer de gözden geçirilir). | Ö · `planim.css:276` (öni:1971) | `pw: height === 280` | Diet |
| **R17** | Gastro · Gourmet banner'ı | Gastro ve Gourmet'in 515px liste (`.ke-top`) ve 504px detay (`.art-hero`) banner'ları 544 ve 560'a çıkar. | Ö · CSS ölçümü, üç kırılım: liste 340/430/515, detay 360/430/504 (öni:1959 · öni:1963) | `pw: height === 544` / `=== 560` | Gastro · Gourmet |
| **R18** | Diet liste banner'ı | Diet'te liste banner'ının sabit yüksekliği yoktur; banner içerikten doğuyor (`.sec.below-header{padding-top:136px}`). R1 uygulanınca sabit değere geçer. | Ö · öni:1960 | `pw: height === 544` | Diet |
| **R19** | Banner | Üç markanın (Gastro · Diet · Gourmet) breadcrumb ve başlık konumu **ölçülemedi**. | X · ölçülemedi, sebebi şu: üçü de Laravel uygulaması ve bu turda hiçbiri ayağa kaldırılmadı. CSS'ten okunanlar dört ayrı yaklaşım gösteriyor: Gastro `.86rem` (≈13.8px) + `margin-bottom:12px` · Diet ve Gourmet 13px + `padding:18px 0 14px` · Fit `margin-top:16px` + bir `!important` ezmesi (öni:1987 · öni:2204). **Gereken:** üç uygulamanın ayağa kaldırılıp Playwright ile ölçülmesi. | Dalga 0'ın akış testleriyle birlikte | Gastro · Diet · Gourmet |
| **R20** | Ana sayfa | Üç markanın ana sayfa hero yüksekliği **ölçülemedi**. | X · ölçülemedi, sebebi şu: uygulamalar ayağa kaldırılmadı. Yalnız Fit'te `--hero-full:100dvh` ölçüldü (öni:1973 · öni:2205). **Gereken:** aynı ölçüm turu. | aynı | Gastro · Diet · Gourmet |
| **R21** | Gourmet liste banner'ı | Arama kutusu kalktıktan sonraki yeni yükseklik **ölçülemedi**. | X · ölçülemedi, sebebi şu: kutu duruyorken ölçülen değer onunla birliktedir (öni:2037-2040 · öni:2206). **Gereken:** R11 uygulandıktan sonra yeniden ölçüm — Dalga 9 ile birlikte. | Dalga 9 | Gourmet |
| **R22** | Banner | Beyar'ın örneklediği fark (tarifler listesi ↔ mekân listesi, hakkımızda ↔ KVKK) **doğrulanamadı**. | X · ölçülemedi, sebebi şu: o dört sayfa Gastro ve Gourmet'te ve ikisi de ayakta değil. CSS'te ölçülen değerler aynı çıkıyor — `.ke-top` ve `.art-hero` iki depoda birebir. Fark CSS'ten değil içerikten doğuyor olabilir (öni:2063-2070). **Gereken:** üç uygulamanın ayağa kaldırılıp ölçülmesi. | Dalga 0'ın ikinci yarısı | Gastro · Gourmet |

---

## S · ŞERİT RİTMİ

Önizleme bölüm 22. Bugün **dört ayrı sayı** vardır; tek değere iner.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **S1** | Hesap · modül · abonelik · profil | Sekme şeridinin üstü **24px**, altı **22px**'tir. | Ö · Diet: `.pf-head+.pf-tabbar{margin-top:24px}` (`planim.css:436`) + `{margin-bottom:22px}` (`:44`) (öni:2106-2107 · öni:2114) | `js:` iki değerin eşitliği | 4× |
| **S2** | Şerit ritmi | Bugünkü dört ritim — Gastro 24/24 · Diet 24/22 · Gourmet 12/42 · Fit 12/12 — tek değere (**24/22**) iner. | Ö · `reference/hesabim/hesabim.css:105`, `:52` · `planim.css:436`, `:44` · `gourmet-hesap/hesap.css:99` · `fit-shell.css:1692` (öni:2104-2114) | `pw:` dört markada iki değerin ölçümü | 4× |
| **S3** | Gourmet şeridi | Gourmet'te `padding:12px 0` ile `margin-bottom:30px`'in toplanmasından doğan 42px'lik alt boşluk kalkar. En büyük sapma buradadır — altı üstünün 3,5 katıdır. | Ö · `gourmet-hesap/hesap.css:99` (öni:2109 · öni:2114) | `pw:` alt boşluk `=== 22` | Gourmet |
| **S4** | Gastro şeridi | Gastro'nun ≤640px'teki 16px değeri **Dalga 9'da** ele alınır; v1 masaüstü değerini bağlar. | Ö · `hesabim.css:105` (öni:2105) | Dalga 9 | Gastro |

---

## Ş · SMS VE TELEFON DOĞRULAMA ALTYAPISI

**Kapsam: Dalga 7.** Bu bölüm bugün yazılmaz; yeri ve kapsamı burada
sabitlenir. Karar §Y‑15 (2026-08-28): kayıt formunda telefon alanı dört
markada bulunur (H27) ve SMS altyapısı **sağlayıcı seçilmeden** kurulur —
tıpkı ödemede olduğu gibi (I8).

**Taban: Gastro'nun ödeme altyapısı.** Desen bu turda ölçüldü ve birebir
aynası çıkarılır:

| Ödeme (ölçülen, Gastro) | SMS (kurulacak) |
|---|---|
| `app/Domain/Billing/Contracts/PaymentGateway.php` — arayüz | `Contracts/SmsGateway.php` |
| `app/Domain/Billing/Services/GatewayRegistry.php` — kayıt defteri | `Services/SmsGatewayRegistry.php` |
| `app/Domain/Billing/Gateways/FakeGateway.php` — deterministik sahte | `Gateways/FakeSmsGateway.php` |
| `Gateways/IyzicoGateway.php` · `PayTRGateway.php` — gerçek adaptör | iki gerçek adaptör iskeleti |
| `config('billing.gateway')`, varsayılan `'fake'`, binding `AppServiceProvider`'da | `config('sms.gateway')`, varsayılan `'fake'` |
| `PaymentResult` · `PaymentFailedException` | `SmsResult` · `SmsFailedException` |

**Ölçülen başlangıç noktası — bugün hiçbir depoda yok:**

| Kalem | Gastro | Diet | Gourmet | Fit |
|---|---|---|---|---|
| `users.phone` kolonu | ✅ var, nullable *("profilde gizli")* | ✅ var, `string(30)` nullable, `after('email')` | ❌ users'ta **yok** (telefon yalnız mekân/rezervasyon/başvuru tablolarında) | maket |
| `phone_verified_at` | ❌ **0 eşleşme** | ❌ **0** | ❌ **0** | — |
| SMS sınıfı/servisi | ❌ **0** | ❌ **0** | ❌ **0** | — |
| Doğrulama kodu tablosu | ❌ **0** | ❌ **0** | ❌ **0** | — |
| `MustVerifyEmail` *(emsal desen)* | ✅ | ✅ | ✅ | — |
| Mevcut `throttle:` kullanımı *(hız sınırı emsali)* | **96** | **52** | **43** | — |

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **Ş1** | SMS altyapısı | Gönderim tek bir arayüzün arkasındadır: `SmsGateway`. Uygulamanın hiçbir yeri sağlayıcıyı doğrudan çağırmaz. | Ö · ödeme emsali `PaymentGateway` — `app/Domain/Billing/Contracts/PaymentGateway.php` | `sh:` sağlayıcı sınıf adının `Gateways/` ve registry dışında araması → `0` | 4× |
| **Ş2** | SMS altyapısı | Arayüz **üç** fiil taşır: `name()` · `send(string $phone, string $message): SmsResult` · `verifyWebhookSignature(string $payload, string $signature): bool`. | Ö · `PaymentGateway`'in `name()` + fiiller + `verifyWebhookSignature` deseni | `sh:` arayüzde tanımlı metot sayısı `=== 3` | 4× |
| **Ş3** | SMS altyapısı | Sağlayıcı adı → adaptör eşlemesi **tek dosyada** tutulur: `SmsGatewayRegistry`. | Ö · `GatewayRegistry`'nin kendi şerhi: *"SAĞLAYICI ADI KODUN HİÇBİR YERİNDE DOĞRUDAN ÇAĞRILMAZ. Sağlayıcı değişimi TEK config satırıdır"* | `sh:` registry'de `map()` · `names()` · `has()` · `resolve()` dördü de var | 4× |
| **Ş4** | SMS altyapısı | Varsayılan sağlayıcı **`fake`**'tir; `FakeSmsGateway` deterministiktir ve gerçek SMS göndermez. | Ö · `config('billing.gateway')` varsayılanı `'fake'` (`PaymentGateway` docblock) | `sh:` `config('sms.gateway')` varsayılanı `fake`; test ortamında gönderilen SMS sayısı `0` | 4× |
| **Ş5** | SMS altyapısı | En az **bir gerçek adaptör iskeleti** yazılır; içi boş kalır, imzası tamdır. | Ö · `IyzicoGateway` · `PayTRGateway` emsali — ikisi de yazılı ve pasif (öni:2187) | `sh:` registry'de `fake` dışında en az 1 kayıt | 4× |
| **Ş6** | Doğrulama kodu | Kod **altı hanelidir** ve kriptografik olarak güvenli üreteçle üretilir. | Ö · dört markada bugün kullanılan 2FA metninin kendi dizgisi: *"altı haneli kod"* (Diet `hesabim.blade.php:343`, `:377`) | `sh:` üretim `random_int` ya da eşdeğeriyle; `rand()`/`mt_rand()` araması → `0` | 4× |
| **Ş7** | Doğrulama kodu | Kod veritabanında **düz metin saklanmaz** — `hash`'i saklanır, karşılaştırma `hash_equals` ile yapılır. | Ö · webhook imza deseni: *"HMAC-SHA256 + `hash_equals`"* (`PaymentGateway::verifyWebhookSignature` docblock) | `sh:` kod kolonunda düz metin karşılaştırması (`===`, `==`) araması → `0` | 4× |
| **Ş8** | Doğrulama kodu | Kodun **süresi 5 dakikadır**; süresi dolan kod doğrulamaz ve silinmez, **damgalanır** (`expired_at`). | T · süre değeri bu turda ölçülemedi — dört depoda SMS kodu yok. Damgalama deseni Ö: sözleşmenin *"izin kaydı silinmez, damgalanır"* hükmü (`hesap-sozlesmesi.md §1.3`) | `sh:` süresi geçmiş kodla doğrulama `422` döner; satır tabloda durur | 4× |
| **Ş9** | Doğrulama kodu | **Tekrar gönderim sınırı** vardır: aynı telefona **60 saniyede 1**, **saatte 5** kod gönderilir. | T · sayılar bu turda ölçülemedi. Mekanizma Ö: `throttle:` deseni dört depoda zaten standart — Gastro 96, Diet 52, Gourmet 43 kullanım | `sh:` 60 sn içinde ikinci istek `429` döner | 4× |
| **Ş10** | Doğrulama kodu | **Deneme sayacı** vardır: bir kod en çok **5 kez** denenir; beşinci yanlış denemede kod geçersizleşir. | T · sayı bu turda ölçülemedi; mekanizma ödeme tarafındaki idempotency/limit deseninin muadili | `sh:` altıncı deneme `429`/`422` döner ve kod artık doğrulamaz | 4× |
| **Ş11** | Kullanıcı durumu | Telefon doğrulanma durumu **`users.phone_verified_at`** kolonunda tutulur — `MustVerifyEmail`'in `email_verified_at`'i ile aynı desen. | Ö · bugün üç depoda da **0 eşleşme**; `MustVerifyEmail` üçünde de var | `sh:` kolon migration'da var; doğrulanmış kullanıcıda `NOT NULL` | 4× |
| **Ş12** | Kullanıcı durumu | Telefon doğrulanmamış olmak **hiçbir kapıyı kapatmaz**; telefon isteğe bağlıdır (H27) ve doğrulama bir yetenek değil bir rozettir. | Ö · karar §Y‑15: alan isteğe bağlı | `sh:` `phone_verified_at IS NULL` olan kullanıcı bütün üye yüzeylerine girer | 4× |
| **Ş13** | Gourmet | Gourmet'in `users` tablosuna `phone` kolonu eklenir — bugün yalnız mekân, rezervasyon ve başvuru tablolarında telefon vardır. | Ö · `users` migration'ında `phone` araması → 0; telefon `create_venue_core_tables` · `create_reservation_tables` · `create_venue_application_tables`'da | `sh:` `users.phone` kolonu var | Gourmet |
| **Ş14** | SMS altyapısı | Sağlayıcıya bağlı olan **tek şey adaptörün içidir**. Sağlayıcı seçildiği gün değişen dört şey: adaptör gövdesi · imza fonksiyonu · `env` anahtarları · `config('sms.gateway')` satırı. Başka hiçbir dosya değişmez. | Ö · ödeme tarafının ölçülen ayrımı: *"Sağlayıcıya bağlı dört parça ve üçü gövde doldurma"* (öni:2187) | `sh:` sağlayıcı değişimi commit'inde `Gateways/` ve `config/` dışında değişen dosya `0` | 4× |

> **Neden şimdi yazılmıyor:** Bu bölüm Dalga 7'nin (Abonelik ve ödeme)
> kapsamındadır ve §Y‑16 (SMS sağlayıcısı) açıktır. Ama altyapının
> **sağlayıcıdan bağımsız olan on bir parçası** — Ş1–Ş13 — seçim
> beklemeden kurulabilir; ödeme tarafında on parçanın sağlayıcıdan bağımsız
> çıkması bunun ölçülmüş emsalidir (öni:2187). Ş8 · Ş9 · Ş10'un **sayıları**
> `T` damgalıdır: dört depoda SMS kodu bulunmadığı için emsalden alınamadı,
> uydurulmadı; Dalga 7'de kararlaştırılıp `Ö`ye çevrilecektir.

---

## T · DİL VE YERELLEŞTİRME

Önizleme bölüm 10 sonu.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **T1** | Dil yönetimi | Dil yönetimi bir **config commit'idir**, panel ekranı değildir. | Ö · `DilAdminController`'ın kendi gerekçesi: dil açıp kapamak `config/locales.php`'te tek satır ve commit olarak denetleniyor (öni:1204-1206) · karar öni:1227-1228 · hnd:104 | `sh:` admin rotalarında dil yönetim ekranı `0` | 4× |
| **T2** | Dil yönetimi | `enabled:true` ilan edilen her dilin `lang/` karşılığı **bulunmak zorundadır**. | Ö · karar öni:1228-1229 | `sh:` config dil listesi ile `lang/` dizin listesi eşit | 4× |
| **T3** | Diet | Diet'te `ru` ve `es` kapatılır (`'enabled' => false`); Diet iki dilli kalır: **tr + en**. | Ö · `config/locales.php` dört dili açık ilan ediyor, `lang/` dizininde yalnız `tr` ve `en` var (öni:1209-1211) · karar hnd:104 | `sh:` `locales.php`'te açık dil sayısı `=== 2` | Diet |
| **T4** | Gastro | Gastro iki dillidir: `tr` + `en`; ikisinin de `lang/` karşılığı doludur. | Ö · `config/app.php:99` (öni:1213) | `sh:` T2 doğrulaması | Gastro |
| **T5** | Gourmet · Fit | Gourmet ve Fit tek dillidir (`tr`). | Ö · Gourmet'te `locales.php` yok, `supported_locales` yok, `lang/`'da yalnız `tr`; Fit `<html lang="tr">` (öni:1214-1215) | `sh:` T2 doğrulaması | Gourmet · Fit |
| **T6** | Admin | "Diller" ekranı dört depodan da kaldırılır (§J10 ile aynı hüküm). | Ö · öni:1218-1221 · hnd:104 | J10 doğrulaması | 4× |
| **T7** | Admin form ekranı | Dil sekmesi kabının yan dolgusu §K15'e uyar. | Ö · öni:1465-1475 | K15 doğrulaması | 4× |

---

## Ü · RENK

Önizleme bölüm 2. Her değer o markanın kendi token dosyasından okunmuştur.

| # | Kapsam | Kural | Değer · kaynak | Doğrulama | Marka |
|---|---|---|---|---|---|
| **Ü1** | Tüm yüzeyler | Metin rengi `#211E16`, kenarlık `#ECECEC`, sayfa zemini `#f9f9f9`, kart zemini `#ffffff` — dört markada aynıdır. | Ö · `tokens.css` · `dd-shell.css :root` · `gourmet.css` · `fit-shell.css` (öni:563-584) | `js:` dört token değerinin eşitliği | 4× |
| **Ü2** | Tüm yüzeyler | Ana marka rengi, derin ton ve fısıltı zemin **markaya özeldir**. Gastro `#E14827` / `#A8331A` / `#FBE9E3` · Diet `#3BB77E` / `#1c7a4e` / `#E6F5EE` · Gourmet `#b14fc5` / `#8e3aa8` / `#F4E7F7` · Fit `#009d4f` / `#007a3d` / `#eaf6ef` (`fit-shell.css:1184` · `:1185` · `:1189`). | Ö · öni:563-584 · serbest bırakma öni:551 | `js:` token değerleri | özel |
| **Ü3** | Tüm yüzeyler | Renk rollerinin **yeri** dört markada aynıdır: kart başlığı ikonu marka rengi · yardım satırı ikonu derin ton · çip ve rozet zemini fısıltı, metni derin ton. | Ö · `planim.css:130` · `:493` · `dd-shell.css:270` · `planim.css:170-174` (öni:506 · 518 · 1369-1370 · 1372) | `js:` dört rolün token eşleşmesi | 4× |
| **Ü4** | Tüm yüzeyler | İkincil metin (`--muted`) dört markada **tek değerdir: `#717171`**. | Ö · bugünkü dört ayrı değer: Gastro `#6F6F6F` · Diet `#717171` · Gourmet `#7E7E7E` · Fit `#717171` (öni:563-584) · **karar §Y‑11, 2026-08-28**. Değişen iki depo Gastro ve Gourmet; Diet ve Fit zaten `#717171`. | `js:` dört depoda `--muted` token değeri `#717171` | 4× |

---

## V · ŞARTNAME NASIL KULLANILIR — hangi dalgada hangi bölüm

Dalga planı `dada-onizleme-handoff.md:178-198`'dedir. Her dalga **yalnız
kendi satırındaki bölümleri** açar; açılmamış bölüm o dalgada ölçüt değildir.

| Dalga | Kapsam | Açılan bölümler | Dalga sonunda ölçülen |
|---|---|---|---|
| **0** | Şartname + test | **tümü yazılır**; hiçbiri uygulanmaz | Belgenin dört depoda `md5` eşitliği (§Z2) + akış testi 1–4'ün yazılması |
| **1** | **Diet** | A · B · C · **Ç** · D · E · F · G · H *(H27 hariç — telefon alanı Ş ile gelir)* · I · S · T3 · Ü + R16 | `/hesabim` ve `/planim` önizlemedeki hâliyle aynı mı · `/bildirimler` doğdu mu, menü 14 kaleme çıktı mı |
| **2** | **Gastro** | Dalga 1'in tümü + **E21 · E22 · G15 · H4 · H15 · H16 · H23 · H26 · H33 · N7 · O · Ü4** | Hesap 7→6 sekme, dondurma/silme taşınır, üst bant ve rail diziye döner |
| **3** | **Gourmet** | Dalga 1'in tümü + **E19 · E23 · G11 · H24 · H25 · I4 · I5 · I9 · J9 · P12 · P13 · R17 · S3 · T5 · Ü4** *(Ş13 Dalga 7'de)* | 14 sekme → 6 ayar + modüller kendi adresine |
| **4** | **Fit kabuk** | A6 · B · C · D · E20 · **M5 · N18 · O10 · P14** | Maket düzeyinde hizalama |
| **5** | **Admin eksik ekranlar** | **J · K** (K kalıbı zorunlu) · D3 · D4 | Onüç yeni ekran yan yana — tek kalemden çıkmış gibi mi |
| **6** | Sponsorluk | J (menü kaydı) + K kalıbı; **§Y‑10 kapanmadan başlamaz** | Bir kampanya kurulup sitede basıldığı görülür |
| **7** | Abonelik ve ödeme **+ SMS altyapısı** | **I** · **Ş** (Ş13 Gourmet'e) · **§Y‑7 ve §Y‑8 kapandıktan sonra**; Ş1–Ş13 **§Y‑16'yı beklemez**, yalnız Ş5'in gerçek adaptörü bekler | FakeGateway ile uçtan uca satın alma · FakeSmsGateway ile uçtan uca telefon doğrulama |
| **8** | Uçtan uca akış testleri | Bütün bölümlerin **Doğrulama** sütunu teste dönüşür | Dört markanın akış raporu + kanıt görüntüleri |
| **9** | Mobil | **B12 · B13 · S4 · R21** + bütün bölümlerin kırılım ölçümü | Dört kırılımda hizalama, dokunma hedefi, taşma |
| **P** | Fit full-stack *(paralel)* | **tümü** — yalnız Dalga 0'ı bekler | Doğarken hizalı doğar; ayrıca L12 · J17 · M8 ölçüme çevrilir |

### V1 · Onay kapısı kuralı

- **Dalga içinde tam otonom** — mid-task soru sorulmaz.
- **Dalga sonunda TEK onay kapısı.**
- **Şartnamede OLMAYAN bir şeyle karşılaşılırsa DUR ve SOR** (U5).
  Geçen turda öngörülemeyen dört kalem — `pattern` niteliği · `robots`'ın
  shared'den gelmesi · sunucunun yalnız `main` dalını çekmesi · font 700'ün
  ExtraBold'a bağlı olması — şartnamede yoktu; dördü de bu tür kalemin
  örneğidir (hnd:194-198).

### V2 · Dalga 0'ın ikinci yarısı

Şartname onaylandıktan sonra **Doğrulama** sütunları teste dönüşür ve akış
testlerinin 1–4'ü yazılır: ① kayıt → doğrula → giriş → hesabım ② şifremi
unuttum → sıfırla → giriş ③ uzman başvurusu → onay → panel ④ dondurma ve
silme. Bunlar revizyondan etkilenmez; bugün yazılırsa boşa gitmez
(öni:2135-2138 · öni:2150-2152).

**Kurulum sırası** (öni:2158-2159): ① Diet'in `scripts/e2e/lib.mjs`'i olduğu
gibi ötekilere taşınır ② akış 1–4 dört markada yazılır ve bugünkü hâl
ölçülür ③ revizyon uygulanır ④ kalanlar yazılır.

**Boşa gitmeyi önleyen tek kural:** testler CSS sınıfına değil **kalıcı
kancalara** bağlanır — `data-*`, `role`, erişilebilir ad. Sınıf adına
bağlanan test ilk yeniden tasarımda ölür (öni:2154-2157). Bu şartnamenin
`js:` doğrulamaları sınıf adı kullandığı yerde teste çevrilirken kalıcı
kancaya taşınır.

**Ölçülen taban:** Gastro 397 Feature + **0** tarayıcı akış testi · Gourmet
187 + **0** · Diet 216 + **24**. Kit zaten var ve yalnız Diet'te
kullanılıyor (öni:2124-2130).

---

## W · DEĞİŞİKLİK YORDAMI

**W1 · Değişiklik kural numarasıyla açılır.** "Kart hizası bozuk" değil,
"B7 tutmuyor" denir. Numarasız değişiklik önerisi işleme alınmaz.

**W2 · Eski karar silinmez, üzerine yazılır.** Deponun usulü budur
(öni:979). Ters çevrilen kural tabloda kalır, gerekçesi ve ne zaman
değiştiği §W7'nin günlüğüne yazılır.

**W3 · Kanon kopya `dadadiet`tedir.** Değişiklik önce
`dadadiet/docs/arayuz-sartnamesi.md` üzerinde yapılır — ölçü tabanı
orasıdır (hnd:205). Masaüstündeki dosya Dalga 0'ın çalışma kopyasıdır ve
dört depoya kopyalandıktan sonra **kaynak sayılmaz**.

**W4 · Sürüm numarası yükseltilir.** Damga `sartname vX.Y.Z · tarih`
biçimindedir ve dosyanın **ilk satırıdır**.

| Değişim | Yükselen |
|---|---|
| Bir kural **kalkar** ya da **ters çevrilir** | MAJOR — `X` |
| Yeni kural eklenir, bir sayı/dizgi/sıra değişir, `T` → `Ö` çevrilir | MINOR — `Y` |
| Kaynak satırı, yazım, biçim düzeltmesi — hüküm değişmez | PATCH — `Z` |

**W5 · Kural numarası geri dönüştürülmez.** Kalkan kuralın numarası boş
kalır; §Y'ye taşınır. Yeni kural bölümün sonuna eklenir.

**W6 · Dört depoya kopyalanır ve `md5` ile doğrulanır.** Değiştiren
**dördünü birden** değiştirir; tek depoda düzeltme yapılmaz (§Z2).

**W7 · Değişiklik günlüğü belgenin başına yazılır** — emsalin (`v2.5 → v2.6`)
biçiminde, en yenisi üstte, tek paragrafta ne değiştiği.

**W8 · Etkilenen test aynı turda güncellenir.** Bir kuralın **Doğrulama**
sütunu değişmişse, o kuralın testi de değişir; ikisi ayrı tura bırakılmaz.

**W9 · Ölçüm yanlışsa şerit DURUR ve raporlar** (U3). Ölçümü tek başına
düzeltmez, çünkü W6 gereği düzeltme dört depoyu birden ilgilendirir.

**W10 · Dosya düzenlenirken dilim sınırı kullanılmaz.** Geçen turda iki kez
tekrarlanan ve ~56 KB silen hata budur (hnd:247-274). Yerine:
`s.replace(eski, yeni, 1)` kullanılır; zorunluysa çapa önce
`assert s.count(ANCHOR) == 1` ile doğrulanır; her düzenlemeden sonra dosya
boyutu karşılaştırılır ve **beklenmedik küçülme alarm sayılır**.

---

## Z · SÜRÜM VE `md5` DOĞRULAMASI

### Z1 · Sürüm

- **Bu sürüm:** `v1.8.1` · 2026-08-29
- **Damga:** dosyanın ilk satırı — `sartname v1.8.1 · 2026-08-29`
- **Dört depodaki yol:** `docs/arayuz-sartnamesi.md`
- **Emsal:** `dadadiet/docs/hesap-sozlesmesi.md` (v2.6, md5
  `558208c924ed04655759990e6ff3b7ee`) — bu belge onun yerine geçmez,
  yanına gelir.

### Z2 · `md5` doğrulaması

Dört depodaki kopya **bayt aynı** olmalıdır. Doğrulama tek komuttur:

```bash
for d in \
  "$HOME/Developer/Backend Projects/dadagastro-profil" \
  "$HOME/Developer/Backend Projects/dadadiet" \
  "$HOME/Developer/Backend Projects/dadagourmet" \
  "$HOME/Developer/Projects/dadafit-prototip" ; do
  md5 -q "$d/docs/arayuz-sartnamesi.md"
done | sort -u | wc -l
```

**Beklenen çıktı: `1`.** `2` ya da daha büyük bir sayı **sapma** demektir;
o dalga kapanmaz.

Hangi deponun ayrıştığını görmek için:

```bash
for d in ... ; do printf '%s  %s\n' "$(md5 -q "$d/docs/arayuz-sartnamesi.md")" "$d"; done
```

**Ne zaman koşulur:** her dalganın sonunda, onay kapısından **önce**.

### Z3 · Kaynakların `md5`'i

Bu belgenin türetildiği iki dosya değişmez kaynaklardır. Şartname
güncellenirken kaynağın da değiştiği fark edilirse §W9 uygulanır.

| Dosya | `md5` | Satır |
|---|---|---|
| `~/Desktop/dada-hesap-onizleme.html` | `abe8fb6e03d95bfd4029b80472e91d55` | 3.170 |
| `~/Desktop/dada-onizleme-handoff.md` | `33cedbd7785ee21451288415f1570caf` | 317 |
| `dadadiet/docs/hesap-sozlesmesi.md` *(emsal)* | `558208c924ed04655759990e6ff3b7ee` | 834 |

---

## Y · KARARLAR

Kalem numarası **asla geri dönüştürülmez** (§W5). Kapanan kalem §Y1'e taşınır
ve numarasını korur; §Y2'deki her atıf çözülmeye devam eder.

### Y1 · ✅ KAPANAN KARARLAR

Bunlar **kapanmıştır**; §U2 burada geçerli değildir. Her biri şartnameye
hüküm olarak inmiştir ve indiği kural yazılıdır.

| # | Kalem | Verilen karar | Tarih | İndiği kural |
|---|---|---|---|---|
| **Y‑2** | Diet'in rozet kaleminin adı | **"Rozetlerim ve Topluluğum"**. Fit kendi belgesindeki adını korur: "Challenge'larım ve Rozetlerim". Diet'in kodundaki "Rozetlerim" adı kullanılmaz. | 2026-08-28 | **G14** |
| **Y‑3** | Diet'te bildirim merkezi | **① Kurulacak.** Kalem eksik bırakılmaz. Diet'e bildirim merkezi kurulur, sonra menüye eklenir; G4'ün Diet sayısı **14**'te kalır. Karar aynı turda **genel kurala** yükseltildi: *"yeteneği olmayan kalem konmaz"* bundan sonra **"sahte link konmaz, ama eksik yetenek kurulur"** diye okunur (§U6). | 2026-08-29 | **§Ç** · G13 · G4 · **U6** |
| **Y‑18** | Bildirim merkezinin kabuğu | **BANNER ailesi (§R), modül sayfası (§F) değil; kimlik bandı YOK.** İlk deneme kimlik bandıyla yapıldı ve ölçülen kusur verdi: kapak görseli olmayan yüzeyde bant üstte boş koyu alan bırakıyor, şerit havada kalıyor. Karar üzerine yazıldı — bildirim merkezi bir **içerik yüzeyi**dir. Kaynaktaki banner **zaten doğruydu ve korundu**; dikiş deponun kanon token'ından geliyor. Tip şeridi panelin içine indi. | 2026-08-29 | **Ç2 · Ç2a–Ç2e** · §R · §U8 |
| **Y‑9** | 2026‑07‑28 "Yakında yasak" kararı | **Geçerli** — kilitli kalemde "Yakında" metni yazılmaz, yalnız kilit rozeti basılır. | (önceki tur) | H5 · H16 · N15 · O8 · G11 · I5 |
| **Y‑11** | Gri metin tonu (`--muted`) | **`#717171`**, dört markada tek değer. Değişen iki depo: Gastro (`#6F6F6F`) ve Gourmet (`#7E7E7E`); Diet ve Fit zaten bu değerde. | 2026-08-28 | **Ü4** |
| **Y‑12** | "Sayfalar" kaleminin adı | **"Sayfalar"** — tek sözcük, `&` yok. Karar şartnameye bırakılmış, dört depoda ekranın ne yönettiği ölçülerek verilmiştir; gerekçe §J18a'dadır. | 2026-08-28 | **J18** · J18a |
| **Y‑13** | "Şifre" mi "Parola" mı | **"Şifre"**. Dizgi ailesinin tamamı bağlanır; "Parola" hiçbir kullanıcı yüzeyinde geçmez. Göç 22 dosya / 104 geçiş / 21 benzersiz dizgidir. | 2026-08-28 | **H29 · H30 · H31** |
| **Y‑14** | Kayıt onay kutusu sayısı | **İki kutu**, dört markada aynı: Kullanım Koşulları · KVKK Aydınlatma Metni. Gastro'nun üçüncü kutusu (kampanya izni) kalkar. | 2026-08-28 | **H32 · H33** |
| **Y‑15** | Kayıt formunda telefon alanı | **Dördünde de bulunur, isteğe bağlıdır.** SMS altyapısı sağlayıcı seçilmeden kurulur — ödeme desenindeki gibi. | 2026-08-28 | **H27** · **Ş1–Ş14** |
| **Y‑17** | Menüde ayraç ve grup sayısı — kimlik bloğu sayılıyor mu? | **Sayılıyor: 4 ayraç.** Kimlik bloğu menünün başında durur ve kendi ayracını yer; dört bağlantı grubu + kimlik bloğu = 4 ayraç. Bloğun menüde bulunması da kural oldu. | 2026-08-28 | **G2 · G21** |

### Y2 · 🔴 KARAR BEKLEYEN KALEMLER — U2 buralarda geçerlidir

**Bunlar kural değildir.** Hiçbiri şartnameye hüküm olarak girmemiştir. Şerit
bu başlıklarda kendi markasının bugünkü şeklini korur, başka markaya
benzetmeye çalışmaz, yeni bir şekil uydurmaz.

**Açık kalem sayısı: 9.** *(Y‑3 ve Y‑18 kapandı; Y‑19 açık.)*

#### Handoff'tan gelen altı açık kalem

| # | Kalem | Şıklar | Etkilediği kural |
|---|---|---|---|
| **Y‑1** | **Campus ile DadaAkademi aynı marka mı?** | ① Aynı → tek isim seçilir, üst bant **6 kaleme** iner ② Farklı → bugünkü hâl kalır (**7 kalem**). *Bugün 7 kalemle kuruldu; kanıt yok, yalnız aynı ikon* (`fa-graduation-cap`). `config/markalar.php` yalnız `diet` ve `gourmet`'i tanıyor. | **O1 · O2 · O13** · N3 |
| **Y‑4** | **Gastro'da başvuru ekranı kurulacak mı?** | ① Kurulsun — üye kendi başvurusunu yapsın ② Bugünkü hâl kalsın — yetki yöneticiden verilsin | **L10 · L11** |
| **Y‑5** | **Gourmet'te Slot 2 (para kalemi)** | Bir gün para ilişkisi kurulursa adı ne olacak? **Bugün hiç basılmıyor** ve şartname bunu bağlıyor (G10 · G11). | G10 · I4 |
| **Y‑6** | **Gourmet profil sekmelerinin son hâli** | Önerilen 6 sekmenin tablosu var ama **ekran hiç yok** — sekme listesi öneri, ölçüm değil. | **P5** (Gourmet sütunu) · P12 |
| **Y‑7** | **Diet'te Billing kararı** | Yönetim tarafında abonelik ekranı açmak, `CLAUDE.md`'nin kapalı kararını (Beyar, 2026‑08‑17) değiştirmek demektir. | **I10 · J14** (3. ekran) |
| **Y‑8** | **Ödeme sağlayıcısı** | iyzico / PayTR adaptörleri yazılı ama pasif. Seçim Dalga 7'yi tamamlar. | I8 · Dalga 7 |

#### v1.0 ölçüm turunda doğan üç açık kalem

| # | Kalem | Şıklar | Etkilediği kural |
|---|---|---|---|
| **Y‑10** | **Gourmet ve Fit'in hedef sidebar'ı §14'ün ekran listesiyle çelişiyor.** Önizlemenin hedef dizisinde Gourmet'in OPERASYON'unda **Kazanç ve Ödemeler · Kademeler · Abonelikler** yok (öni:3134); oysa J13 bu üçünü yazılacak ekran sayıyor (öni:1498-1500). Fit'in dizisinde de **Sponsorluk** ve **Kademeler** yok (öni:3139), ama Dalga 6 sponsorluğu dört markaya yazıyor. | ① Hedef dizi doğru → §14'ün listesi üç kalem küçülür, Gourmet 6 ekran olur ② §14 doğru → hedef dizi üç kalem büyür, J11 sayıları Gourmet 22 olur ③ Kalem kalem ayrılır | **J11 · J13** · Dalga 6 |
| **Y‑19** | **Diet'in bildirim üreticileri hangileri olacak?** Ç13'ün ekseni kapandı (Diet'in kendi 10 konusu) ama **hangi konunun bugün üreticisi kurulacağı** açık. Ölçüldü: `randevu` · `mesaj` · `program-revizyonu` · `ödeme` · `şüpheli-giriş` için veri kaynağı **var**; `günlük-takip` · `su` · `haftalık-rapor` · `kampanya` **zamanlayıcı ister** ve bu depoda `app/Jobs` dizini ile `routes/console.php` kuyruğu **yok** (0 eşleşme). Ayrıca `review_created`/`review_replied` Diet'te diyetisyene yazılıyor, üyeye değil. | ① Yalnız veri kaynağı hazır beş konu ② Beşi + kuyruk altyapısı da kurulsun ③ Konu konu seçim | **Ç13 · Ç16** · §U6 |
| **Y‑16** | **SMS sağlayıcısı.** Altyapı sağlayıcıdan bağımsız kurulur (Ş1–Ş14) ama gönderim yapacak sağlayıcı seçilmemiştir. Ölçüm: dört depoda bugün **hiçbir SMS sınıfı yok** (0 eşleşme). | ① Seçim Dalga 7'de ödeme sağlayıcısıyla (§Y‑8) birlikte yapılsın ② Ayrı ele alınsın — SMS kimlik yüzeyi, ödeme para yüzeyi | **Ş4 · Ş5 · Ş14** · Dalga 7 |

---

## X · ŞARTNAMENİN UYGULANAMAYACAĞI YERLER

Aşağıdaki dokuz başlıkta bu belge **ölçüt üretemez**. Her satırda sebebi ve
ne gerektiği yazılıdır. Hiçbiri uydurulmamıştır.

| # | Yer | Neden uygulanamaz | Ne gerekiyor |
|---|---|---|---|
| **X1** | **Fit'in yönetim paneli** — §J tamamı | Fit'te admin paneli **hiç yok**; depoda yalnız `antrenor-panelim-v1.html` var, o da antrenörün kendi paneli. §J'nin Fit sütunu hedeftir, ölçüm değildir (öni:1260-1261 · öni:2211). | Panelin sıfırdan kurulması — Dalga P, ayrı proje. Öteki üçüyle aynı ölçekte iş değildir. |
| **X2** | **Gastro'nun operasyon paneli** — §M | Gastro'da operasyon paneli **yok** (öni:1561-1564). Şef abonesini, kazancını ve içerik istatistiğini yönetemiyor. | Panelin yazılması — M6'nın 2. önceliği: 1 layout / 1 controller / 3 blade. |
| **X3** | **Gastro'nun başvuru ekranı** — §L | Üye tarafında başvuru yüzeyi **yok**; onay var, başvuru yok (öni:1312-1323). | §Y‑4'ün kapanması. |
| **X4** | **Gourmet'in üye profili** — §P | Sayfa **hiç yok**; sekme listesi tablolardan türetildi, ölçüm değil (öni:1893-1894 · öni:2209). | Sayfanın yazılması (P12) + §Y‑6'nın kapanması. |
| **X5** | **Üç Laravel uygulamasının tarayıcı ölçümleri** — R19 · R20 · R21 · R22 · G18 | Gastro, Diet ve Gourmet bu turda **ayağa kaldırılmadı** — sunucu ve veritabanı gerekiyordu, "canlı sunucuya dokunma" kuralı da var. Yalnız Fit statik HTML olduğu için tarayıcıda ölçülebildi (öni:1946-1951 · öni:2204). | Üç uygulamanın yerelde ayağa kaldırılıp Playwright + Chrome ile ölçülmesi. Dalga 0'ın akış testleriyle aynı turda yapılmalı. |
| **X6** | **Diet'in yönetim abonelik ekranı** — I10 · J14/3 | `CLAUDE.md`'nin 2026‑08‑17 kapalı kararı Billing'i bu projeye almıyor (öni:1523-1526). | §Y‑7'nin kapanması. Karar güncellenmeden ekran yazılmaz. |
| **X7** | **Sayaç ve istatistik satırının sayıları** — F6 · R15 | Belgeler hangi sayacın gösterileceğini yazıyor, **kaç olduğunu değil**; sayı canlı veriden gelir. İstatistik satırının kalem sayısı sayfa sayfa değişiyor (öni:759-762 · öni:2032-2036). | Uygulanamaz ve uygulanmamalı — etiketler ve yer bağlanmıştır, sayı markaya bırakılmıştır. |
| **X8** | **Fit başvurusunun alan adları** — L12 | Maket; form olarak yazılmamış. Bölüm sayısı (4) ve adım sayısı (4) ölçüldü, alan listesi türetme (öni:2212). | Dalga P — form yazıldığında ölçülür ve L12 `Ö`ye çevrilir. |
| **X9** | **Yeni admin ekranlarının satır sayısı** — J16 | Her ekranın büyüklüğü kapsamına bağlı; bu turda yalnız iki emsal ölçüldü (Gastro Loglar 2 dosya / 427 satır · Raporlar 8 dosya) (öni:1265-1269). | Ekran ekran kapsam kararı. J15'in emsal sayıları tavan değil, ölçek göstergesidir. |

### X10 · Ayrıca: önizlemenin eskimiş dört yeri

Önizleme dosyası ardışık turların ürünüdür ve **dört yerinde bir önceki
turun kararını taşır**. Bu şartname handoff'un ters çevirme tablosunu
(hnd:114-123) esas almıştır. Uygulayan şerit önizlemedeki bu dört
paragrafa **bakmaz**:

| Önizlemedeki eski hâl | Geçerli hâl | Kaynak |
|---|---|---|
| "Ekran C — TABAN: GASTRO" (öni:898) | **Taban DIET** | hnd:89 · hnd:118 · H1 |
| "Girişte rol seçimi yok / hedefte kalkar" (öni:955 · öni:1061) | **Rol seçimi kalıyor, A+B ile çalıştırılıyor** | hnd:92-93 · hnd:120 · H6–H13 |
| "Telefon segmenti KALKAR" (öni:1046-1048) | **Gastro'da kalır, pasif** | hnd:94 · hnd:121 · H15 |
| Hedef `SIDE` dizilerinde "Diller" (öni:3128 · 3131 · 3135 · 3139) | **Dördünden de kalkar** | hnd:104 · J10 · T6 |

Ayrıca iki **sayı** eskimiştir ve düzeltilmiştir:

| Önizlemedeki sayı | Doğrusu | Kaynak |
|---|---|---|
| 3b tablosunun başlığı "Diet (15 kalem)" (öni:634) ve Diet sütunundaki çift "Rozetlerim ve Topluluğum" satırı (öni:645-646) | **Diet 14 kalem** — "Alışveriş Listem" çıkarıldı | hnd:70 · güncel menü dizisi öni:2319-2321 · G4 |
| §3 ve 3b tablolarında Diet'in modülleri arasında "Alışveriş Listem" (öni:602 · öni:670) | **Diet'te basılmaz** — yalnız Gastro'da | hnd:70 · hnd:78 · G15 |

---

## Belgenin sonu

Bu şartname `dada-hesap-onizleme.html`'in **25 bölümünün tamamı** ve
`dada-onizleme-handoff.md`'nin **35 kararı** taranarak yazılmıştır. Ölçülemeyen
hiçbir yere sayı uydurulmamış, her biri `X` damgasıyla ve sebebiyle
işaretlenmiştir.

**Sonraki adım:** Beyar onayı → dört depoya kopyalama (ilk depo `dadadiet`)
→ `md5` doğrulaması (§Z2) → Doğrulama sütunlarının teste çevrilmesi (§V2).
