# REVİZYON 8 — BRIEF (Beyar, 10. oturum)

**Kaynak:** oturum açılış mesajı · **Devir:** `tasks/DEVIR-7.md` · **Kararlar:** `KARARLAR.md` (K1–K58)
**Taban commit:** `654f353` · **Branch:** `main` · **Sayfa sayısı:** 66 → **65** (K-C)
**Yerel sunucu:** `http://localhost:8811` (açık, ajanlar kendi sunucusunu KURMAZ) · `PW_HOME=~/.pw`

> **ŞEMA:** her kalem üç satır — **sorun** (bugün ne yanlış) · **yapılacak**
> (ne değişecek) · **kabul** (hangi ölçüm kapatır). Kabul ölçütü sayı ya da
> ikili sonuç üretmiyorsa kalem kapanmış sayılmaz.

**Çalışma kipi:** 7 ajan · A kabuk · B sözlük · C anatomi+modal · D egzersiz ·
E hub/program/testler · F destek · G antrenör profili.
Ajanlar commit atmaz, birleştirmez, push etmez — lead yapar.

---

# 0 · BEYAR'IN KARARLARI — ÜÇÜ DE CEVAPLANDI

| Karar | Soruldu | Cevap |
|---|---|---|
| **K-A** · `--sec-pad` rampası | oturum açılışında | **B — rampanın tamamı** (74·74·74·44) |
| **K-B** · yaslama | oturum açılışında | **A — `p.jt` kancası kalır** |
| **K-C** · "Hareket merkezi" hedefi | lead ölçümü sonrası (25 dosya·33 geçiş) | **`egzersiz-kutuphane-v1`**, 9 kardeş durur |

## K-A · `--sec-pad` rampası → **B seçildi (rampanın tamamı)**

**Sorun.** R7'den devreden madde 1. Bugünkü rampa referanstan aşağıda ve
@1440'tan @1024'e keskin düşüyor.

**Yapılacak.** `assets/css/fit-shell.css` — üç sayı, tek dosya:

| Konum | Bugün | Olacak |
|---|---|---|
| satır 53 · `:root` | `--sec-pad:50px` | **`74px`** |
| satır 1326 · `@media (max-width:1024px)` | `--sec-pad:42px` | **`74px`** |
| satır 1327 · `@media (max-width:640px)` | `--sec-pad:34px` | **`44px`** |

Referans (`dadadiet.com/beslenme`, R7'de dört genişlikte ölçüldü):
**74 @1440 · 74 @1024 · 74 @768 · 44 @390.** Sonuç birebir bu olacak.
`--sec-pad-sm` (32 px · 61 kullanım) **değişmiyor**. `var(--sec-pad)` 115 kullanım.

**Kabul.**
1. Dört genişlikte `.sec` computed `padding-top` = **74 · 74 · 74 · 44**.
2. Üç örnek sayfada sayfa boyu R7'nin öngörüsüyle ±%1 içinde:
   `dadafit-hub-v1` 8 209→**8 737** · `hakkimizda-v1` 5 588→**5 924** ·
   `hareket-merkezi-v1` 4 523→**4 763** px @1440.
3. Uygulandıktan sonra **üç genişlikte tam site taraması** (banner aile
   yükseklikleri + R11 perde sapması tazelenir) → sorun **0**.
4. Banner aile yükseklikleri değişmeyecek: liste **544/607/587** ×54 ·
   detay **560/617/726** ×8.

**Sahibi: AJAN-A.** Kalem 27 (AJAN-E) bu uygulandıktan SONRA ölçülür.

## K-B · Yaslama → **A seçildi (`p.jt` kancası kalır)**

**Sorun.** K57 ile yaslama opt-in oldu; bugün sitede yaslanan blok **0**.
Beyar bunu görüp geri açılmasına karar verdi — ama **global değil, işaretli**.

**Yapılacak.**
- `assets/css/fit-type.css` satır 384–390'daki `.jt` / `.jt-flow` bloğu
  **KALIR**, silinmez, genişletilmez.
- Aynı bloğa **zorunlu iki özellik** eklenir: `hyphens:auto` +
  `text-wrap:pretty` (yaslamayla beraber, ayrı değil).
- İçerik paragrafları toplu işaretlenir: akan metin sarmalayıcısına
  `class="jt-flow"`, tekil paragrafa `class="jt"`.
- **Dışarıda kalacak** (işaretlenmeyecek): eyebrow · etiket · rozet ·
  kart alt metni · ≤2 satırlık her blok.
- `KARARLAR.md`'ye **K59** yazılır: *"K59, K57'yi geçersiz kılar."*

**Kabul.**
1. 66 sayfa × 2 genişlik diff — **blok kutusu 0 oynayacak.**
   Oynayan varsa **DUR ve raporla**, düzeltmeye kalkma.
2. `tests/hizalama-nobeti.mjs` 5 ölçüt · **0 sorun** (ölçüt 2 hâlâ
   "izinsiz justify = 0" diyor; işaretli bloklar izinli).
3. İşaretlenen blok sayısı raporlanacak — bugün 0, sonra kaç.
4. Dışarıda kalması gerekenlerden yaslanan **0**.

**Sıra: EN SON.** Bütün ajanlar birleşip süit yeşile dönmeden BAŞLAMA.
66 sayfayı birden oynatıyor. **Sahibi: LEAD.**

---

# 1 · ÇAKIŞMA KURALI

`assets/css/fit-shell.css` · `assets/js/fit-shell.js` · menü / footer /
dropdown markup'ı → **YALNIZ AJAN-A**. Diğer ajanlar kendi sayfa içi
stilini yazar. A ile F kalem 6 ve 35'te aynı dropdown'a bakıyor:
**markup A'nın, hedef sayfa F'nin.**

**Birleştirme sırası:** A → B/C/D/E paralel → F → G → süit → site taraması
→ K-B (yaslama, en son) → push → canlı doğrulama.

---

# 2 · AJAN-A · KABUK

### 1 · "Planım" butonu misafirde görünüyor
- **Sorun.** Misafir kullanıcıya "Planım" butonu gösteriliyor; giriş
  durumu ayrımı yok. Ayrıca kullanıcı dropdown'ına konması önerildi — konmayacak.
- **Yapılacak.** Referans `dadadiet.com`'u Playwright ile ölç, davranışı
  birebir al. Misafirde gizle, girişte göster. Dropdown içeriğine **ekleme**.
- **Kabul.** Misafir durumunda **66/66** sayfada "Planım" yok · giriş
  durumunda var · dropdown içeriğinde **0**.

### 2 · Footer "Yasal ve Sağlık" başlığı
- **Sorun.** Başlık gereksiz; altındaki bağlantılar başlığa bağlı duruyor.
- **Yapılacak.** Başlığı kaldır, bağlantıları koru. Nereye taşındıklarını **ölç ve raporla**.
- **Kabul.** **66/66** sayfada başlık yok · footer bağlantı sayısı
  öncesi = sonrası (sayıyı yaz) · kırık bağlantı **0**.

### 3 · Hareket dropdown'ında "Hareketi Anlamak" divider'ı
- **Sorun.** Gereksiz ayraç.
- **Yapılacak.** Divider'ı kaldır. Altındaki maddeler kaybolmayacak.
- **Kabul.** **66/66** sayfada divider **0** · dropdown madde sayısı değişmedi.

### 4 · "Hareket merkezi" komple kaldırılacak — **K-C kararı alındı**
- **Sorun.** Sayfa gereksiz görülüyor. Lead ölçümü: `hareket-merkezi-v1`
  **25 dosyada, 33 geçişte**. Ana menü "Hareket" sekmesinin hedefi de bu
  sayfa (`fit-shell.js:67`); 9 kardeş sayfa onu **kırıntı ebeveyni** olarak
  kullanıyor. Yani hub kalkınca menü sekmesi hedefsiz kalıyor.
- **K-C · Beyar'ın kararı:** yalnız `hareket-merkezi-v1.html` kalkar
  (**66 → 65 sayfa**). **9 kardeş sayfa DURUR.** Yeni hedef her yerde
  **`egzersiz-kutuphane-v1.html`**.

  | Konum | Bugün | Olacak |
  |---|---|---|
  | `fit-shell.js:67` | nav `Hareket` href | `egzersiz-kutuphane-v1.html` |
  | `fit-shell.js:67–68` | `match:[…]` dizisi | `'hareket-merkezi-v1'` çıkar |
  | `fit-shell.js:83` | dropdown "Hareket Merkezi" | **satır silinir** |
  | `fit-shell.js:174` | mobil nav href + match | aynı |
  | `fit-shell.js:201` | footer "Hareket Merkezi" | **satır silinir** |
  | 9 kardeş sayfa | kırıntı `<a href="hareket-merkezi-v1.html">Hareket</a>` | yeni hedef |
  | `index.html:38` | site haritası girişi | yeni hedef + etiket düzeltmesi |
  | kalan 14 sayfa | sayfa içi bağlantı | yeni hedef |

  **Duran 9 kardeş:** `hareket-bolgeye-gore` · `hareket-dogru-form` ·
  `hareket-hedefe-gore` · `hareket-isinma-soguma` · `hareket-masa-basi` ·
  `hareket-rehberi` · `hareket-sozluk` · `hareket-sureye-gore` ·
  `hareket-yeni-baslayanlar`
- **Kabul.** Kalıntı `hareket-merkezi-v1` geçişi **0** (bugün 33) · tam site
  taraması kırık iç bağlantı **0** · nav "Hareket" tıklanınca
  `egzersiz-kutuphane-v1` açılıyor ve **h1'i beklenen kayıtla eşleşiyor** ·
  9/9 kardeş kırıntısı yeni hedefte · dropdown ve footer madde sayısı
  1'er azaldı (öncesi/sonrası yaz).
- **SIRA:** K-A kabul ölçütü `hareket-merkezi-v1`'i örnek sayfa olarak
  kullanıyor → **önce K-A ölç ve uygula, sonra sayfayı sil.**

### 5 · Sayfa altı dipnotları dar kalıyor
- **Sorun.** Dipnot kutusu ana içerik kolonundan dar.
- **Yapılacak.** İçerik genişliğine yay.
- **Kabul.** Dipnot kutusu genişliği = ana içerik kolonu genişliği ·
  **66/66** sayfada tek değer (sayıyı yaz) · @390'da taşma **0**.

### 6 · Avatar dropdown'ına "Destek" + "Taleplerim"
- **Sorun.** Destek girişi footer'da; avatar dropdown'ında yok.
- **Yapılacak.** Dropdown'a iki giriş ekle. **Markup A'nın**, hedef
  sayfalar F'nin — F'nin ürettiği dosya adlarını al.
- **Kabul.** **66/66** sayfada dropdown'da iki giriş · ikisi de HTTP 200 ·
  kırık bağlantı **0**.
- **Ek (F'nin 35. kalemiyle çift):** `destek-talepleri-v1.html`
  bağlantısı **footer'dan kalkacak** — footer markup'ı A'nın.
  **Kabul:** footer'da o bağlantı **0**, dropdown'da **1**.

---

# 3 · AJAN-B · SÖZLÜK

### 7 · `sozluk-v1.html` yapısı gastro ile hizalanacak
- **Sorun.** Sözlük, kardeş marka `dadagastro.com/mutfak-sozlugu`'nden
  dört noktada ayrışmış; DadaFit kendi deseni icat etmiş.
- **Yapılacak.** Canlıdan Playwright ile ölç, iskeleti birebir al,
  **yalnız rengi DadaFit yeşiline çevir**. Yeni desen icat etme.
  Kapatılacak dört fark:

  | # | Gastro | DadaFit bugün |
  |---|---|---|
  | a | her terim kartında sol harf avatarı (renkli kare) | yalnız grup başlığında |
  | b | açık kartın solunda dikey şerit **yok** | **var** |
  | c | terim sayacı ayrı satırda | filtre kutusunun içinde |
  | d | kategori chip'leri açıkta satır hâlinde | "Kategori" dropdown'ında gizli |

- **Kabul.** Kart iskeleti · dolgu · tipografi ölçüsü gastro ile birebir
  (her biri için önce/sonra sayı) · **tek fark renk token'ı** · dört
  farkın dördü de kapalı.

### 8 · Arama inputu 3. satıra
- **Sorun.** Arama kutusu kategorilerden ayrı satırda; o satırın solu boş duruyor.
- **Yapılacak.** Input'u 3. satıra, kategorilerin yanına al. Chip'lerden
  birkaçı o satırda görünür kalacak.
- **Kabul.** @1440'ta input ile chip satırının **üst kenarı aynı y'de** ·
  sol boşluk **0 px** · @390'da yatay taşma **0**.

### 9 · Accordion tek-açık olacak
- **Sorun.** Birden çok kart aynı anda açık kalabiliyor.
- **Yapılacak.** Biri açılınca diğeri kapansın.
- **Kabul.** Playwright ile üç ardışık tıklama · her adımda açık kart
  sayısı = **1** · `tests/sozluk-kapalilik.mjs` yeşil kalacak.

### 10 · `sozluk-detay-v1.html` iki bölüm kalkacak
- **Sorun.** "etiketli" bölümü ve "Sık aranan sorular" bölümü gereksiz.
- **Yapılacak.** İkisini de kaldır.
- **Kabul.** Sayfada iki bölüm **0** · kırık iç çapa **0** · konsol hatası **0**.

---

# 4 · AJAN-C · ANATOMİ + MODAL

### 11 · **BUGFIX ÖNCELİKLİ** — "Randevu al" popup'ı kapatılamıyor
- **Sorun.** Diyetisyen kartlarındaki randevu popup'ı açılınca kapanmıyor —
  kullanıcı sayfada kilitli kalıyor.
- **Yapılacak.** Kapatma yollarının üçünü de kur: Esc · dışarı tıklama ·
  kapat düğmesi. Odak yönetimi ve scroll kilidi dahil.
- **Kabul.** Üç yolun **üçü de** kapatıyor · odak tetikleyen elemana
  dönüyor · `body` scroll kilidi çözülüyor (computed `overflow` önce/sonra).

### 12 · `anatomi-v1.html` — Tab odağı panelden kaçıyor
- **Sorun.** Panel açıkken Tab odağı pencerenin dışına çıkıyor (focus trap yok).
- **Yapılacak.** Odak tuzağı kur.
- **Kabul.** Panel açıkken **20 ardışık Tab** · odak her adımda panel
  içinde (20/20) · Esc kapatıyor · odak tetikleyene dönüyor.

> **11 ve 12 aynı desen — TEK modal iskeleti çıkar, ikisine de uygula.**
> Kabul: iki sayfada da aynı iskelet kullanılıyor (kod tekrarı sayısını yaz).

### 13 · Sağ panelde orta başlıklar seçilmiyor
- **Sorun.** Anatomi parçası tıklanınca açılan kartta orta başlıklar
  gövde metninden ayrışmıyor.
- **Yapılacak.** Bölümü accordion'a çevir; başlığı görsel olarak ayrıştır.
- **Kabul.** Başlık `font-weight` ve `font-size` gövdeden **ölçülebilir
  şekilde** ayrışıyor — **dört sayıyı raporla** (başlık/gövde × weight/size).

### 14 · Chip aralıkları dar
- **Sorun.** Chip'ler birbirine yapışık.
- **Yapılacak.** Aralığı aç, tek değere çek.
- **Kabul.** Tek `gap` değeri · **öncesi/sonrası sayıyla** · @390'da taşma **0**.

---

# 5 · AJAN-D · EGZERSİZ

### 15 · `egzersiz-detay-v1.html` banner'ında aşırı boşluk
- **Sorun.** `?slug=goblet-squat` banner'ı DEVIR sabitinden şişmiş.
- **Yapılacak.** Banner'ı detay ailesi sabitine çek.
- **Kabul.** **560 @1440 · 726 @390** (DEVIR-7 §2c sabiti) · `tests/header-banner.mjs` yeşil.

### 16 · Sayfa altındaki uyarı kutusu dar
- **Sorun.** Uyarı kutusu ana içerik kolonundan dar.
- **Yapılacak.** İçerik genişliğine yay.
- **Kabul.** Kutu genişliği = içerik kolonu (sayıyı yaz) · @390 taşma **0**.

### 17 · "Aradığın hareketi kataloğumuzda bulamadık" info'su yanlış yerde
- **Sorun.** En üstte duruyor; kullanıcı henüz aramadan uyarı görüyor.
- **Yapılacak.** **EN ALTA** taşı.
- **Kabul.** DOM sırasında info bloğu son bölümden sonra · üstte **0**.

### 18 · "Videoyu izleyemiyor musun?" info'su dar
- **Yapılacak.** Liste genişliğine yay.
- **Kabul.** Kutu genişliği = liste genişliği (sayıyı yaz).

### 19 · **İÇERİK TONU** — sorumluluk reddi dili
- **Sorun.** Metinler "sakatlanırsan sorumlusu ben değilim" hissi veriyor.
- **Yapılacak.** Sorumluluk reddi yerine **yönlendirme dili**: antrenör
  desteği var, oradan yardım alınabilir. **Hukuki içeriği kaybetme, tonu değiştir.**
- **Kabul.** Hangi sayfada kaç metin değişti — **sayfa adı + sayı listesi** ·
  her değişen metnin öncesi/sonrası · hukuki kapsam kaybı **0** (madde madde eşle).

### 20 · `egzersiz-kutuphane` filtre satırında dikey divider
- **Sorun.** Sayının solundaki dikey ayraç gereksiz.
- **Yapılacak.** Kaldır.
- **Kabul.** Sayfada o ayraç **0** · filtre satırı hizası bozulmadı (y sayısı önce/sonra).

---

# 6 · AJAN-E · HUB · PROGRAM · TESTLER · HAKKIMIZDA

### 21 · `dadafit-hub-v1.html` egzersizler bölümü — arama inputu hizasız
- **Yapılacak.** Arama inputunu **SAĞA**, "Seviye:" filtre satırıyla aynı hizaya al.
- **Kabul.** @1440'ta iki elemanın **üst kenarı aynı y'de** (fark 0 px) ·
  @390'da alt alta, taşma **0**.

### 22 · "Köprü iş başında" bölümünde amblem yok
- **Yapılacak.** Bölümün üst etiketine **DadaGastro amblemi** ekle.
- **Kabul.** Amblem yükleniyor (4xx **0**) · `alt` metni var · @390'da taşma **0**.

### 23 · `antrenman-olusturucu-v1.html` — dikkat durumu vurgusuz
- **Yapılacak.** Dikkat edilmesi gereken durumu kırmızıyla vurgula.
- **Kabul.** Kırmızı **AA geçiyor** — kontrast oranını **ölç ve yaz**
  (≥4.5:1 küçük metin). Vurgu tek renkle değil, ikinci bir işaretle de
  ayrışıyor (renk körlüğü).

### 24 · Antrenman oluşturucu ana sayfada yok
- **Yapılacak.** Ana sayfaya **ÖNİZLEME** olarak ekle; tıklanınca sayfaya gitsin.
- **Kabul.** Önizleme bloğu var · bağlantı HTTP 200 · hedef sayfanın h1'i
  beklenen kayıtla eşleşiyor (HTTP değil **HEDEF** kontrol).

### 25 · "Tüm Programlar" nereye gidiyor?
- **Sorun.** Programlar bölümündeki "Tüm Programlar" bağlantısının hedefi belirsiz.
- **Yapılacak.** **ÖNCE ÖLÇ VE RAPORLA** şu an nereye gidiyor, sonra
  `program-liste-v1.html`'e çevir.
- **Kabul.** Öncesi hedef raporlandı · sonrası `program-liste-v1.html` ·
  hedef sayfanın h1'i eşleşiyor.

### 26 · `program-detay-v1.html` "GENEL BAKIŞ" etiketi başlığa yapışık
- **Yapılacak.** Üst etiketi başlıktan biraz uzaklaştır.
- **Kabul.** Etiket–başlık arası **öncesi/sonrası px** · kardeş sayfalarla
  aynı değer.

### 27 · **SECTION ARALARI** — kart kenara yapışmış
- **Sorun.** `program-detay`'da kart kenara yapışık. Tek sayfa değil.
- **Yapılacak.** **66 sayfayı tara**, kartın kenara yapıştığı / section'ın
  sıkıştığı her yeri bul → **LİSTEYİ ÖNCE RAPORLA** → sonra düzelt.
- **Kabul.** Bulgu listesi (sayfa + seçici + ölçü) raporlandı · düzeltme
  sonrası aynı tarama **0 bulgu** · yatay taşma **0**.
- **BAĞIMLILIK:** K-A (`--sec-pad` → B) **AJAN-A tarafından uygulandıktan
  SONRA** ölçülür. Öncesinde ölçme — sayılar geçersiz olur.

### 28 · `fit-testleri-v1.html` — info yanlış yerde, divider fazla
- **Yapılacak.** En üstteki info'yu **ALTA** taşı ve içerik genişliğine yay ·
  filtre satırındaki dikey divider'ı kaldır.
- **Kabul.** Info DOM sırasında sonda · genişliği = içerik kolonu · divider **0**.

### 29 · `fit-testi-detay-v1.html?test=temel-kuvvet` boşlukları dağınık
- **Yapılacak.** Section aralarını tek değere çek.
- **Kabul.** Section arası **tek değer** · **öncesi/sonrası ölçüyle** ·
  K-A rampasıyla tutarlı.

### 30 · "yeni soru · yaklaşık ... dakika" ifadesi bozuk → **SORU**
- **Sorun.** İfade eksik/bozuk okunuyor.
- **Yapılacak.** Canlıdan **METNİ OKU**, düzeltilmiş hâlini **ÖNER**,
  **UYGULAMA** — Beyar onaylayacak. Uydurma.
- **Kabul.** Mevcut metin birebir alıntılandı · en az 2 öneri sunuldu ·
  kod değişikliği **0**.

### 31 · `video-seanslari-v1.html` "Sırala" yazısı → **SORU**
- **Yapılacak.** "Sırala" etiketini kaldır. Sıralama **işlevi** de gidiyor
  mu yalnız etiket mi — **ÖLÇ VE RAPORLA, UYGULAMA.**
- **Kabul.** Sıralama kontrolünün bugün ne yaptığı ölçüldü (kaç seçenek,
  hangi alanı sıralıyor, çalışıyor mu) · rapor sunuldu · kod değişikliği **0**.

### 32 · `challenge-merkezi-v1.html` — section içi kartlar tutarsız
- **Sorun.** Aynı section'daki kartlar farklı yükseklik/dolgu/oranda.
- **Yapılacak.** **ÖNCE ÖLÇ:** kart yüksekliği · dolgu · görsel oranı ·
  başlık satır sayısı, @1440 ve @390. **Tutarsızlığı SAYIYLA göster**,
  sonra tek ölçüye çek.
- **Kabul.** Ölçüm tablosu (kart × 4 ölçü × 2 genişlik) raporlandı ·
  düzeltme sonrası aynı section içindeki **tüm kartlar tek yükseklik ailesinde**
  (maks–min fark ≤ 2 px) · @390 taşma **0**.

### 33 · Hakkımızda — yasal metinler ile künye arası sıkışık
- **Yapılacak.** İki section arasını aç.
- **Kabul.** Ara **öncesi/sonrası px** · K-A rampasıyla tutarlı.

---

# 7 · AJAN-F · DESTEK (tek başına, başka kalem almaz)

### 34 · Destek sistemi DadaFit'e getirilecek
- **Sorun.** DadaFit'te destek akışı yok; kardeş markada var.
- **Yapılacak.** `dadagastro.com/hesabim/destek` sistemini Playwright ile
  **ölç** ve DadaFit'e getir: **destek** + **taleplerim**. İskeleti birebir
  taşı, yalnız rengi DadaFit yeşiline çevir. Yeni desen icat etme.
- **Kabul.** Bölüm sırası · kart iskeleti · dolgu · tipografi ölçüsü
  gastro ile birebir (önce/sonra tablo) · iki sayfa da HTTP 200 ·
  h1'leri beklenen kayıtla eşleşiyor · konsol hatası **0** · @390 taşma **0**.

### 35 · `destek-talepleri-v1.html` erişim yolu değişiyor
- **Sorun.** Footer'dan erişiliyor; avatar dropdown'ında olması gerekiyor.
- **Yapılacak.** Footer bağlantısı kalkacak (**markup A'nın** — A'ya bildir),
  avatar dropdown'ından erişilecek (**markup A'nın**). F hedef sayfayı hazır eder.
- **Kabul.** Footer'da o bağlantı **0** · dropdown'dan tıklayınca açılıyor ·
  kırık bağlantı **0** · hedef sayfanın h1'i eşleşiyor.

### 36 · Prototip uyarısı sarı info kutusu → **SORU (bulgu kısmı)**
- **Sorun.** Sarı "prototip" info kutusu birden çok sayfada duruyor.
- **Yapılacak.** **Hangi sayfalarda olduğunu ölç**, hepsinden kaldır.
  "Senin iznin" başlıklı bölümde de var — **bul, kaldır, raporla.**
- **Kabul.** Sayfa listesi (öncesi kaç sayfa) raporlandı · sonrası **0** ·
  kutunun taşıdığı bilgi kaybolduysa nereye taşındığı yazılı ·
  "Senin iznin" bulgusu ayrı satırda raporlandı.

---

# 8 · AJAN-G · ANTRENÖR PROFİLİ

### 37 · Profil sayfası yapısı diyetisyen profilinden alınacak
- **Sorun.** Antrenör profili kardeş markadan ayrışmış, kendi deseni var.
- **Yapılacak.** `dadadiet.com/diyetisyen/dyt-elif-sahin`'i Playwright ile
  **ölç**, iskeleti birebir taşı, **yalnız rengi DadaFit yeşiline çevir**.
  Yeni desen icat etme — kardeş marka ne yapıyorsa o.
- **Kabul.** **Bölüm sırası · kart iskeleti · dolgu · tipografi ölçüsü**
  diyetisyen profiliyle birebir — dördü için de önce/sonra tablo ·
  tek fark renk token'ı.

### 38 · "Danışan deneyimi" satırı yok
- **Yapılacak.** Profile "danışan deneyimi" satırı ekle.
- **Kabul.** Satır var · referanstaki karşılığıyla aynı konumda ·
  içerik uydurulmadıysa `data-yer-tutucu` + `docs/icerik-bekleyen.md` satırı.

### 39 · Sekmeli (tab) bölüm yok
- **Yapılacak.** Profile sekmeli bölüm ekle — challenge'lar ve benzeri
  içerik buraya girecek. Sekme davranışı: klavyeyle gezilebilir · odak
  sekme grubunda kalır · seçili sekme ekran okuyucuya bildirilir
  (`role="tablist"` / `aria-selected` / `tabindex` yönetimi).
- **Kabul.** Playwright ile **ok tuşları + Tab** denendi · odak sekme
  grubundan **kaçmıyor** (adım adım sonuç) · `aria-selected` tek sekmede
  `true` · içerik uydurulmadı: karşılığı olmayan sekme `data-yer-tutucu`
  taşıyor **ve** `docs/icerik-bekleyen.md`'de satırı var.

---

# 9 · HERKESE — ORTAK KURALLAR

- `frontend-design` skill'ini **OKUMADAN** koda başlama.
- **Üç geçiş zorunlu:** kur (@1440 + @390 ekran görüntüsü) → kendi işini
  eleştir (**en az 3 somut kusur bul ve düzelt**; "kusur yok" kabul edilmez)
  → kardeş markayla karşılaştır.
- Her yeni davranış için **sınama yaz** VE **taban commit'te kırmızıya
  döndüğünü doğrula** (K27).
- Sınama **HTTP değil HEDEF** kontrol etsin — h1 metni beklenen kayıtla eşleşecek.
- **Seçiciyi doğrulamadan sayı rapor etme** (B24 dersi: yanlış seçici 0 döndürdü
  ve kusur gibi göründü).
- Karşılığı olmayan sayfa/bağlantı **UYDURMA** → `data-yer-tutucu` +
  `docs/icerik-bekleyen.md`.
- Kapsam dışına dokunma, ama bulguyu kütüğe yaz.
- Her 10 dk **tek satır** ilerleme notu; çıktıyı ilerledikçe diske yaz,
  sonda toplu yazma.
- Rapor **ŞEMA**, serbest metin değil.
- **Commit atma** — lead atar.
- Ana oturumun iddialarına güvenme, **kendin ölç**.

---

# 10 · SORU SORULACAK ÜÇ YER

Gerisi otonom, sonuna kadar.

| Kalem | Ajan | Soru |
|---|---|---|
| **30** | E | "yeni soru · yaklaşık … dakika" — düzeltilmiş metin önerisi |
| **31** | E | "Sırala" — işlev de gidiyor mu, yalnız etiket mi |
| **36** | F | "Senin iznin" bölümündeki prototip uyarısı bulgusu |

---

# 11 · KAPANIŞ

Süit (21 sınama + yeni yazılanlar) → tam site taraması üç genişlikte →
**K-B (yaslama, en son)** → commit → push (`gh auth switch --user
gaviaworks-dev` gerekirse) → canlı doğrulama → `tasks/DEVIR-8.md`.
