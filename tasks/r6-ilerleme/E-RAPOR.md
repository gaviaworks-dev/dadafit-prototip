# AJAN-E · MADDE 19 RAPORU — `fit-planim-v1.html` + alt sayfaları

**Şema:** `tasks/REVIZYON-6.md` §9 · **Taban commit:** `8bf5c66` ·
**Sunucu:** `http://localhost:8811` · **Playwright:** `PW_HOME=~/.pw`
**Commit atılmadı, push edilmedi.**

## Madde 19 — `fit-planim-v1.html` kardeş marka profilleriyle hizalanacak

### Geçiş 1 · Kur

**`frontend-design` skill okundu: EVET.** Üç satır özet:
1. Kalıp cevaptan kaçın; her karar bu brief'e özgü ve gerekçeli olsun —
   "cesareti tek yere harca", gerisi disiplinli ve sessiz kalsın.
2. Yapı bilgidir: numaralandırma/ayraç/etiket ancak içerikte gerçek bir
   karşılığı varsa konur, süs olarak konmaz.
3. Metin tasarım malzemesidir: boş durum bir davettir, hata özür dilemez,
   düğme adı akış boyunca değişmez.

**Uygulamadaki karşılığı:** Bu sayfa ailesinin konusu *plan defteri*. Bu yüzden
tek imza öğesi **üst özet kartı**: solda planın kimliği + ilerleme çubuğu,
sağda kardeş markadan **ölçülerek** alınmış dikey istatistik kolonu. Gün
şeridi ve hareket işaretleme gerçek sıralı veri olduğu için var; dekoratif
numaralandırma / rozet / animasyon eklenmedi. Yeni renk uydurulmadı, her
değer kabuk token'ı.

#### Kök bulgu (ölçülen, iddia değil)

| Bulgu | Ölçüm |
|---|---|
| Sayfalar iskeletti | `fit-planim-v1` 11 440 B, alt sayfalar 7 028–8 931 B |
| **Bölüm yapısı hiç yoktu** | 7 sayfanın **7'sinde** `.sec-head` sayısı **0** (taban `8bf5c66`) — sitenin ve referansın omurgası olan eyebrow + h2 + lead bloğu kullanılmıyordu; sayfa düz bir kart yığınıydı. Kopukluğun kökü bu. Şimdi: 3 · 2 · 3 · 1 · 2 · 2 · 3 bölüm. |
| Üst özet kartı yoktu | `FIT_PLAN` hiç çağrılmıyordu; `fit-plan-kayit.js` sayfalara **link'li bile değildi** |
| Veri uydurmaydı | "Sıradaki antrenman" kartı sabit `4 Hafta Ev Antrenmanı — 2. hafta, 3. gün` basıyordu |
| Satır içi stil enflasyonu | 7 sayfada toplam **101** `style="…"` |
| Banner sağ yarısı boş | `.fp-top` içinde `.lib-stats` yok, sağ ~%45 boş piksel |

#### Yapılan değişiklik (dosya : ne)

| Dosya | Ne yapıldı |
|---|---|
| 7 sayfanın `<head><style>` bloğu | Boş olan blok, `fpx-` önekli sayfa CSS'iyle dolduruldu (üst özet kartı · dikey istatistik kolonu · gün şeridi · işaretleme düğmesi · veri tablosu · rozet kartı · gün ilerleme satırı). **Kabuk CSS'ine dokunulmadı.** |
| 7 sayfanın `<body>` gövdesi | Kart yığını, `.sec-head` (eyebrow + h2 + lead + sec-tools) taşıyan **bölümlere** ayrıldı; en üste **üst özet kartı** kondu; satır içi stiller sınıfa çevrildi |
| 7 sayfa `<script src>` | `assets/js/fit-plan-kayit.js` eklendi — **sözleşme modülü yalnız çağrılıyor, değiştirilmedi** |
| 7 sayfa `<script>` | Ortak `FPX` yardımcısı (FIT_PLAN'ı okur, özet kartını basar) + sayfaya özel bağlama |
| `tests/plan-ozet.mjs` | **YENİ** — madde 19'un kabul ölçütlerini koşan sınama |

`fpx-` önekli CSS/JS **her sayfada birebir aynı blok**. Ortak dosyaya
çıkarılmadı çünkü §0b sayfa içi `<style>` + kendi öneki istiyor
(gerekçe ve geri alma yolu aşağıda "Verilen kararlar" bölümünde).

**Sözleşmeye uyum:** kendi depolama kodu yazılmadı. Çağrılan yüzey:
`FIT_PLAN.aktif()` · `ozet(id)` · `listele()` · `getir(id)` · `isaret(...)` ·
`isaretle(...)`. **`assets/js/fit-plan-kayit.js` değiştirilmedi.**

**Ekran görüntüsü (Geçiş 1):**
`tasks/r6-shots/E/m19-v1-g1-1440.png` · `…-g1-390.png`
kayıtlı planla: `…-g1dolu-1440.png` · `…-g1dolu-390.png`
diğer altı sayfa: `m19-{gecmis,ilerleme,kaydettiklerim,randevular,rozetler,saglik-profil}-v1-g1-{1440,390}.png`
Taban hâli karşılaştırma için: `m19-v1-g0-{1440,390}.png`

---

### Geçiş 2 · Kendi işimi eleştirdim

Görüntülere `Read` ile **bakıldı**, sonra sayısal olarak ölçüldü
(Range API ile kelime aralığı, `getBoundingClientRect` ile kutu, WCAG formülüyle kontrast).

#### Kusur 1 — Yaslama nehirleri (tipografik hiyerarşi / okunurluk)

`assets/css/fit-type.css` akan metni iki yana yaslıyor ve sayfa
stillerinden **sonra** yükleniyor. Yeni blokların hepsi kısa (2–4 satır),
yani tam olarak o dosyanın kendi yorumunda "nehir üretir" diye anlatılan
durumdaydı — ama yeni sınıflar istisna listesinde yoktu.

**Ölçüm (Range API, en geniş kelime arası; normal aralık ≈ 4 px):**

| Sınıf · sayfa | Önce | Sonra |
|---|---|---|
| `.lead` · kaydettiklerim @390 | **26.1 px** (6.5×) | 4.1 px (yaslama kapalı) |
| `.lead` · bugün @390 | **22.8 px** | 4.0 px |
| `.lead` · sağlık profili @1440 | **15.3 px** | 4.2 px |
| `.fpx-sum-sub` · rozetler @390 | **18.2 px** | 3.8 px |
| `.fpx-note` · bugün @390 | **18.0 px** | 3.7 px |
| `.fpx-body` · bugün @390 | **18.1 px** | 3.6 px |

**Nasıl düzeltildi:** sayfa içi kuralla, yalnız bu ailede, `text-align:left`.
İlk denemede `.fpx-note` / `.fpx-body` **düzelmedi** — çünkü `fit-type.css`
onlara `.fp-card p` (0,2,0) ile ulaşıyor ve sonra yükleniyor; seçici
`.fp-body .fp-card p.fpx-note` (0,3,1) yapılınca kapandı. **Kabuğun ortak
`.lead` yaslaması site genelinde aynı sorunu yaşıyor — o AJAN-A'da (aşağıda).**

**Sonuç:** 14 koşunun (7 sayfa × 2 kırılım) **14'ünde** 8 px üstü kelime
aralığı **0**.

**SONRAKİ GELİŞME — `.lead` yamam kalktı, ölçüm yöntemim de düzeldi.**
AJAN-A `.lead`i `fit-type.css` istisna listesine aldı (kendi ölçümüyle:
`hakkimizda` 3.9 → **17.7 px**, 4.6×; 66 sayfada yaslanan `.lead` 79 blok /
34 sayfa ve @1440'ta 79/79'u ≤4 satır — kuralın kendi ölçütü). Yerel
`.fpx-sec .sec-head .lead` ezmem gereksizleşti, **kaldırıldı**.

Ayrıca **benim Range-API yöntemim kusurluydu**: boşluk karakterinin
`getClientRects()` genişliği yaslama gerilmesini tam yansıtmıyor. AJAN-A'nın
yöntemini aldım — kelimeleri geçici `<i>` içine alıp **komşu kelime kutuları
arasındaki gerçek boşluğu** ölçmek. Yeni yöntemle son durum:

| Kırılım | Yaslı blok | En geniş kelime arası |
|---|---|---|
| @1440 | **0** | **3.9 px** (= normal) |
| @390 | **0** | **3.8 px** (= normal) |

**EŞİK MEKANİZMASI ONARILDI — ezmemi ölçerek sınadım, YARISINDA gerekli.**
AJAN-A `fit-type.css`'in kendi `--jt-min` eşiğinin **hiç çalışmadığını** buldu
(ölü token · container sorgusu özgüllükten kaybediyor · eşik 20rem vs 30rem)
ve onardı. "Senin dar blokların artık mekanizma tarafından yakalanıyor" dedi.
**Varsayım olarak almadım — ezmeyi geçici kaldırıp ölçtüm.** Sonuç ikiye
bölünüyor:

| Kırılım | Kart genişliği | Ezme YOKKEN yaslı blok | En geniş kelime arası |
|---|---|---|---|
| **@390** | 358 px (eşiğin **altında**) | **0** | 3.4 px |
| **@1440** | 577–1176 px (eşiğin **üstünde**) | **8** (`fpx-note` 3 · `fpx-body` 4 · `fpx-note-sm` 1) | 3.5 → **6.2 px** |

@390'da AJAN-A haklı: mekanizma yakalıyor, ezmeye gerek yok.
@1440'ta yakalamıyor, çünkü kart eşiğin üstünde. Ve o bloklar orada
**1–2 satır** — `fit-type.css`'in kendi ölçütünün ikinci yarısı
(*"500–900px genişlikte ve YALNIZ 2–4 SATIR"*) tam bu durumu tarif ediyor.

**Kök tespit:** onarılan eşik **kutu genişliğini** görüyor, **satır sayısını**
görmüyor. Kuralın iki ölçütünden yalnız biri mekanikleşti.

**AJAN-A bulguyu doğruladı ve üç sınıfı kabuğa aldı** (`fit-type.css` §3,
`.fp-card p.fpx-note` = 0,2,1). Kendi kusurunu da yakaladı: `.lead`i (0,1,0)
istisnaya alırken `.art-wrap p` (0,1,1) onu yeniyormuş — 8 `hareket-*`
sayfasında **16 `p.lead`** hâlâ yaslıymış. Yerel ezmemi 7 sayfamdan sildi.

#### Kusur 6 — kabuğa taşıma sırasında sarkan seçici (ölçerek yakaladım)

Silme işlemi kuralın **gövdesini** kaldırdı ama ilk seçicisini bıraktı:

```css
.fpx-sum-sub,          /* ← gövdesiz kaldı */
/* … yorumlar … */
.fpx-sec .fp-card>.lib-empty.show{padding:30px 20px 26px}
```

CSS'te bu iki seçiciyi **birleştirir**. `.fpx-sum-sub` `.fp-card` içinde
değil (üst özet kartının `<section>`ı), yani kabuğun yeni `.fp-card p…`
istisnası ona ulaşmıyor. İki yan etki, **7 sayfanın 7'sinde**:

| | Sarkan hâl | Düzeltildikten sonra |
|---|---|---|
| `text-align` | **justify** | left |
| en geniş kelime arası @390 | **40.4 px** (normal 3.8 → **10.6×**) | **3.8 px** |
| en geniş kelime arası @1440 | 8.5 px | 3.8 px |
| `padding` (boş durum kuralından bulaşan) | **30px 20px 26px** | **0px** |
| blok yüksekliği | **104 px** | **48 px** |

Bu turda ölçülen **en şiddetli nehir** buydu (10.6×; kıyas: bu ailede ilk
bulduğum en kötü değer 26.1 px / 6.5×). `.fpx-sum-sub` kendi kural gövdesini
aldı, gerekçesi CSS'te yazılı. Ayrıca 7 sayfada gövdesiz seçici taraması
yaptım: **0**.

**Son durum:** her iki kırılımda da yaslı blok **0**, en geniş kelime arası
**3.3–3.8 px** (= normal). Kabuk `.fpx-note`/`.fpx-note-sm`/`.fpx-body`'yi
taşıyor, sayfa yalnız `.fpx-sum-sub`'ı.

#### Kusur 2 — Dokunma hedefi @390'da 44 px altında

**Ölçüm (@390, `main` içindeki her `a`/`button`):**

| Bileşen | Önce | Sonra |
|---|---|---|
| `.fp-act` ("Deftere git", "Tümü", "Aç", "Tarife git") | 13–21 px | **44 px** |
| `.fp-actbtn` ("Değiştir", "Ekle", "Oku") | 16 px | **44 px** |
| `.see-all` ("Planın tamamı") | 21 px | **44 px** |
| `.df-fchip` (tür süzgeci) | 35 px | **44 px** |

**Nasıl düzeltildi:** yalnız `@media (max-width:640px)` içinde `min-height:44px`
+ `inline-flex`; masaüstünde görünüm dili hiç değişmiyor.

**SONRAKİ GELİŞME — yamam kalktı, kabuk daha iyisini yaptı.**
AJAN-A ölçtü ve üçünün AA kusuru olduğunu doğruladı (`.fp-act` 13.0 px /
42 örnek · `.fp-actbtn` 16.0 px · `.see-all` 20.1 px — hepsi WCAG 2.5.8'in
24 px eşiğinin **altında**). Çözümü benimkinden iyi: `min-height` kutuyu
büyütüyordu, o **görünmez `::after` örtüsü** kullandı
(`.see-all,.fp-act,.fp-actbtn{position:relative}` + 44 px örtü) — kutu
büyümüyor, satır ritmi bozulmuyor. Benim yamam hem gereksizleşti hem sitenin
geri kalanından ayrışıyordu; **kaldırıldı**. `.df-fchip` ezmemi de kaldırdım:
ölçülen **35 px**, 2.5.8'in 24 px eşiğini geçiyor (44 px 2.5.5, yani AAA) ve
tek sayfa ailesinde büyütmek süzgeç şeridini siteden ayırırdı.

**Örtünün kendi sayfalarımda çalıştığını ayrıca ölçtüm** — kutu değil
**etkin hedef**, `elementFromPoint` ile, her öğe görünür alana kaydırılarak
(@390, 7 sayfa):

| Sonda | Ölçüt | Kontrol | İhlal |
|---|---|---|---|
| merkez ±21 px (44 px hedef) | `.fp-act` · `.fp-actbtn` · `.see-all` · `.fpx-mark` | 46 kontrolün örtülü olanları | **0** |
| merkez ±12 px (24 px, 2.5.8 AA) | `.df-fchip` | örtüsüz olanlar | **0** |
| **komşu çalma** | örtü başka bir kontrolün merkezini kapıyor mu | 46 kontrol × tüm komşular | **0** |

Komşu çalma benim özel endişemdi: `.fp-act` örtüsü `.fp-row .end` içinde
benim `.fpx-mark` düğmelerimin yanında duruyor. **Hiçbirini kapmıyor.**

**Ölçüm notu:** kutu yüksekliğini sayan eski tabloda `.fp-act` hâlâ 13–21 px
görünür — bu **gerileme değil**. Kutu bilerek küçük; hedefi örtü taşıyor.
Kutu ölçen bir sonda bu çözümü doğrulayamaz, `elementFromPoint` gerekir.

Paragraf **içindeki** metin bağlantıları (`.hr-note p > a`, `.fpx-note-sm > a`,
14–36 px) bilerek bırakıldı: cümle içi bağlantı, WCAG 2.5.8 kapsam dışı.

#### Kusur 3 — Aynı boş durum iki kez, dev bir boşlukla

Kayıt yokken üst özet kartı *"Kayıtlı planın yok" + "Plan oluştur"* diyordu;
hemen altındaki kart **aynı mesajı ve aynı düğmeyi** tekrar basıyordu.

**Ölçüm:**

| | Önce | Sonra |
|---|---|---|
| Boş durum kartının yüksekliği (`fit-planim-v1`) | **438 px** | **299 px** |
| İçindeki `.lib-empty` | **323 px** (dolgu 54 px) | **184 px** (dolgu 30/26 px) |
| `fit-planim-gecmis-v1` kartı | 438 px | **278 px** |
| Aynı ekranda "Plan oluştur" düğmesi | **2 adet** | **1 adet** (yalnız özet kartında) |

**Nasıl düzeltildi:** kart içi boş durum kompaktlaştı, ikinci CTA kalktı ve
metin *yokluğu tekrar etmek* yerine *ne göreceğini* anlatır oldu:
"Günün burada açılır" / "İlerlemen burada çıkar" / "Kayıtların burada birikir".

#### Kusur 4 — Sessiz değişim (sınama yazarken yakalandı)

Günün **son** hareketi işaretlenince `ozet().aktifGun` bir sonraki güne
kayıyor, kart kullanıcı bakarken **başka bir günün** hareketlerine
dönüşüyordu — yaptığı işin onayını göremiyordu. (Madde 14'ün anatomi
sayfasında bulduğu kusurun aynısı.)

**Nasıl düzeltildi:** kart açılışta seçilen günü **tutuyor** (`gosterilenGun`);
gün bitince rozet "Gün tamamlandı"ya dönüyor ve altında sıradaki gün açıkça
yazılıyor. İlerleyen gün bilgisini üst özet kartındaki "sıradaki" istatistiği
taşıyor. Plan değişirse kilit açılıyor.

**Ölçülen sonuç:** son hareket işaretlendikten sonra kart hâlâ `Gün 1 · İtiş`,
rozet `Gün tamamlandı`, not `Bu gün tamam. Sıradaki: Gün 2 · Çekiş …`,
üst kart `%40 plan tamam · 2/3 gün · 2/5 hareket işaretli`.
`tests/plan-ozet.mjs` §7 bunu nöbette tutuyor.

#### Kusur 5 — Satır içi stil enflasyonu

| Sayfa | Önce | Sonra |
|---|---|---|
| `fit-planim-v1` | 23 | **2** |
| `fit-planim-gecmis-v1` | 30 | **1** |
| `fit-planim-ilerleme-v1` | 11 | **8** |
| `fit-planim-kaydettiklerim-v1` | 3 | **2** |
| `fit-planim-randevular-v1` | 2 | **1** |
| `fit-planim-rozetler-v1` | 26 | **2** |
| `fit-planim-saglik-profil-v1` | 6 | **1** |
| **toplam** | **101** | **17** |

Kalan 17'nin tamamı **dinamik yüzde** (`width:38%`, `height:76%` — grafik ve
ilerleme çubuğu değerleri) ve su takibinin 8 sütunlu ızgarası. Bunlar veri,
stil değil.

**Ekran görüntüsü (Geçiş 2):**
`m19-*-g2-{1440,390}.png` · kayıtlı planla `m19-*-g2dolu-{1440,390}.png`

---

### Geçiş 3 · Referansla karşılaştırma

#### Referansa erişim — ölçülemeyen kısım açıkça yazılıyor

`dadadiet.com/planim` ve `dadagastro.com/mutfak-defterim` bu maddenin
birebir muadilleri, **ama ikisi de sunucu tarafında `/giris`'e yönlendiriyor.**

```
curl -sIL https://dadadiet.com/planim              → 200, url_effective = /giris
curl -sIL https://dadagastro.com/mutfak-defterim   → 200, url_effective = /giris
```
Aynı sonuç: `/planim/gunluk-takip` · `/planim/ilerlemem` · `/planim/kaydettiklerim` ·
`/planim/saglik-profilim` · `/hesabim` (iki markada da) · `/rozetlerim` ·
`/alisveris-listesi` · `/haftalik-menu`. **Sekizinin sekizi kapalı.**
Ekran görüntüleri kanıt olarak duruyor: `ref-diet-planim-1440.png` ·
`ref-gastro-defter-1440.png` (ikisi de giriş ekranını gösteriyor).

**Hesap açmadım** (dışa dönük işlem, izin yok). Bunun yerine aynı tasarım
sistemini taşıyan **halka açık** sayfalar ölçüldü:
`dadagastro.com/bugun-ne-pisirsem` (madde 18'in de referansı) ·
`dadadiet.com/hesaplayicilar` · `dadadiet.com/giris` (kişisel alanın `.au-card`'ı) ·
`dadagastro.com/mutfaga-giris`.

#### Ölçüm tablosu — REFERANS ↔ BİZ (Playwright, @1440)

| Ölçüt | Referans | Biz (öncesi) | Biz (şimdi) | Durum |
|---|---|---|---|---|
| `.wrap` max-width | 1240px | 1240px | 1240px | eşit |
| `.wrap` dolgu / iç genişlik | 0 32px / 1176px | 0 32px / 1176px | 0 32px / 1176px | eşit |
| İçerik sol kenarı | 132px | 132px | 132px | eşit |
| **Bölüm başlığı `h2`** | **34px** | *bölüm başlığı yok* → 26px | **34px** | **kapatıldı** |
| **`h2` letter-spacing** | **-0.68px** | -0.52px | **-0.68px** | **kapatıldı** |
| `h2` font-weight | 700 | 700 | 700 | eşit |
| **`.sec-head` margin-bottom** | **34px** | 22px | **34px** | **kapatıldı** |
| **`.lead` font-size** | **15.5px** | 14.5px | **15.5px** | **kapatıldı** |
| Eyebrow ölçüsü | 12px / 700 / ls 1.92px / uppercase | aynı | aynı | eşit |
| Kart radius | 16px | 16px | 16px | eşit |
| Sayfa zemini | `rgb(249,249,249)` | aynı | aynı | eşit |
| Izgara gap | 24px | 22px | 22px | **kabukta** (`.fp-grid`) |
| Bölüm dikey nefesi | 74/74px | 32/50px | 32/50px | **bilinçli** (`--sec-pad` 74→50, kabuk yorumu satır 52) |
| Kart dolgusu | 16px (küçük döşeme) / 34-38-36px (kişisel kart) | 24px 26px | 24px 26px | **kabukta** (`.fp-card`) |
| Küçük etiket rengi | `rgb(113,113,113)` · **4.88:1** | `rgb(126,126,126)` · **4.06:1** | değişmedi | **kabukta** (`--muted`, AJAN-A'ya) |

#### Banner istatistik şeridi — `dadagastro.com/bugun-ne-pisirsem` `.bnp-stats`

Bu şerit üst özet kartının sağ kolonuna **birebir** taşındı:

| Ölçüt | Referans | Bizim `.fpx-stats` | Durum |
|---|---|---|---|
| `flex-direction` | column | column | eşit |
| kalemler arası `gap` | 16px | 16px | eşit |
| `border-left` | 1px | 1px | eşit |
| `padding-left` | 38px | 38px | eşit |
| sol kolonla arası (`column-gap`) | 44px | 44px | eşit |
| sayı font-size | 29px | 29px | eşit |
| sayı font-weight | 700 | **800 → 700** | kapatıldı |
| etiket font-size | 12.5px | 12.5px | eşit |
| etiket font-weight | 500 | 500 | eşit |

**9 ölçütün 9'u eşit.** Ayraç çizgisi bizde `--line` (referansta koyu zeminde
`rgba(255,255,255,.18)`) — K29 gereği ölçü alındı, palet alınmadı.

#### Kişisel alan kartı — `dadadiet.com/giris` `.au-card`

| Ölçüt | Referans | Bizim `.fpx-sum` |
|---|---|---|
| border-radius | 24px | 24px (`--radius-xl`) |
| padding | 34px 38px 36px | 34px 38px 36px |
| kenarlık | 1px `#ececec` | 1px `--line` = **#ECECEC** (aynı değer) |
| gölge | `rgba(33,30,22,.04) 0 1px 2px` | `--sh-sm` = aynı ilk katman |
| başlık | h1 25px | h2 25px |

#### Referanstan zayıf kalan noktalar → nasıl kapatıldı

1. **Bölüm başlığı ölçeği.** En büyük fark buydu ve **kendi kurulumum
   üretmişti**: `.fpx-sec` içinde `h2`yi 26px'e, `sec-head` boşluğunu 22px'e,
   `lead`i 14.5px'e ezmiştim. Referansı ölçünce görüldü ki **kabuğun kendi
   `.sec-head` değerleri referansla zaten birebir** (34px / -0.68px / 34px /
   15.5px) — üç ezme de sayfaları hem referanstan hem sitenin geri kalanından
   uzaklaştırıyordu. **Üçü de kaldırıldı.**
2. **Eyebrow kontrastı.** Kabuğun `.eyebrow` rengi `--tomato` (#009d4f):
   krem zeminde **3.36:1**, beyazda 3.54:1. 12px/700 metin WCAG'de "large"
   sayılmaz, eşik 4.5:1 → AA altı. Önce bu ailede `--fit-deep`e çekildi
   (**5.18:1**), sonra **AJAN-A tabanı düzeltti** (`fit-shell.css` `.eyebrow`
   → `var(--fit-deep)`, 25 sayfa AA'ya geçti). Yerel yamam gereksizleşti ve
   **kaldırıldı** — kabukla aynı işi iki yerde yapmıyoruz. Yeniden ölçüldü:
   yama yokken `.fpx-sec .eyebrow` = `rgb(0,122,61)` (7/7 sayfa).
3. **Birincil düğme kontrastı.** `.btn-primary` (`--tomato`) beyaz metinle
   **3.54:1** — AA altı. Eklediğim bütün birincil eylemler `.btn-fit`
   (`--fit-deep`, **5.45:1**, S4 kararının düğmesi). Bu ailedeki eski
   `.btn-primary`'ler de aynı sınıfa çevrildi ki tek sayfada iki farklı
   yeşil birincil düğme durmasın.
4. **Banner sağ yarısı boş.** Referansın banner'ında sağda dikey istatistik
   kolonu var; `.fp-top` markup'ı kabukta üretiliyor ve `.lib-stats` taşımıyor,
   **dokunamam**. Karşılığı sayfa düzeyinde kuruldu: üst özet kartı aynı
   şeridi aynı ölçülerle taşıyor. Kabuk notu AJAN-A'ya yazıldı.

**Ekran görüntüsü (Geçiş 3):**
`m19-*-g3-{1440,390}.png` · kayıtlı planla `m19-*-g3dolu-{1440,390}.png`
Referans kanıtları: `ref-gastro-nepisirsem-1440.png` ·
`ref-diet-hesaplayicilar-1440.png` · `ref-diet-giris-1440.png` ·
`ref-gastro-mutfaga-giris-1440.png` · `ref-diet-planim-1440.png` (giriş duvarı) ·
`ref-gastro-defter-1440.png` (giriş duvarı)

---

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| Sol ray / üst özet / kart dili referansla ölçülüp eşitlendi | rapor tablosu | yukarıda iki tablo; şerit 9/9 eşit, sayfa dili 8 ölçütte eşit, 4 ezme kapatıldı | ✅ |
| Aktif plan yoksa dürüst boş durum, uydurma veri yok | boş durum | `.fpx-sum.is-empty`, sağ kolon **0 kalem**, çubuk gizli, ekranda sayı **yok** — 3 sayfada doğrulandı | ✅ |
| Aktif plan varsa `FIT_PLAN.ozet()` değerleri ekranda birebir | oran = DOM | `ozet().oran = %20` → istatistik `%20`, çubuk `20%`, meta `%20`; `yapilan/toplam = 1/5` ekranda. 2 sayfada 8 iddia | ✅ |
| `tests/plan-account.mjs` yeşil | 0 sorun | **0 sorun** — "Planım rayı 7 kalem", "Hesabım Planım rayını tekrarlamıyor" | ✅ |
| Banner ailesi bozulmadı | 544 / 607 / 587 | 7 sayfanın 7'sinde **544 / 607 / 587** | ✅ |
| 9 sayfanın hepsinde konsol 0 | 0 | 7 sayfa × 3 kırılım = **21 koşu, konsol hatası 0** (diğer 2 sayfa AJAN-D ve AJAN-A'nın) | ✅ |
| @390 taşma 0 | 0 | 7/7 **0 px** (@1440 ve @1024'te de 0) | ✅ |
| `tools/page-check.mjs <sayfa> 1440` | temiz | 7/7 **temiz** (kırık bağlantı 0, 4xx 0, marka dili temiz) | ✅ |
| Sözleşme modülü değiştirilmedi | değişmemiş | `assets/js/fit-plan-kayit.js` hiç açılıp yazılmadı; sayfalara yalnız `<script src>` ile eklendi. (Dosya git'te `??` untracked olduğu için diff'le kanıtlanamıyor — md5 `fae8f53430c254cb3a3d3bd2bc2ae29e`, lead kendi kopyasıyla karşılaştırabilir.) | ✅ |
| İşaret sayfa yenilenince duruyor | duruyor | işaretle → reload → `{"g1-h0":{"yapildi":true,"seviye":"tam",…}}` | ✅ |
| Klavye ile işaretleme | çalışıyor | odak + Enter ile işaretlendi, `aria-pressed` doğru | ✅ |
| İçerik sol kenarı tek değer | tek değer | @1440 **[132]** · @1024 **[24]** · @390 **[16]** — 7/7 | ✅ |
| Bölümler arası dikey ritim tek değer | tek değer | @1440 **44 px** · @390 **34 px**; `sec-head` → ilk kart **34 px** — 7/7 | ✅ |

**AJAN-A'nın kabuk değişikliğinden SONRA yeniden koşuldu (hepsi yeşil):**
`plan-ozet.mjs` 7/7 · `plan-account.mjs` 0 sorun · `page-check` 7/7 temiz ·
banner 21/21 ölçüm 544/607/587 · konsol 0 · taşma 0 · sol kenar tek değer ·
`.fit-tab` @390 44.0 px · `.eyebrow` `rgb(0,122,61)` · `--muted` `rgb(113,113,113)`.
Nihai ekran görüntüleri (`-g3-`, `-g3dolu-`) bu durumla alındı.

**Ek olarak koşuldu (bozmadığımı kanıtlamak için):**
`tests/footer-curtain.mjs` → **0 sorun** (65 sayfa, perde farkı 0, kuyruk 0)
`tests/footer-yapi.mjs` → **0 sorun** (yasal bant dokunulmamış)

---

### Verilen kararlar (gerekçe + nasıl geri alınır)

**1 · `fpx-` CSS/JS bloğu 7 sayfada birebir çoğaltıldı, ortak dosyaya çıkarılmadı.**
*Gerekçe:* §0b açıkça "sayfa içi `<style>` + kendi öneki" diyor ve yedi sayfanın
`<head>`inde bunun için ayrılmış boş bir `<style>` bloğu zaten duruyordu.
Ortak dosya (`assets/css/fit-planim.css`) mühendislik olarak daha temiz olurdu
ama kural açık, birleştirmede lead'i sürpriz bir dosyayla karşılaştırmak
istemedim. *Geri alma:* blok tek kaynaktan üretildiği için birebir aynı —
`assets/css/fit-planim.css` + `assets/js/fit-planim.js` olarak çıkarılıp
7 sayfada `<link>`/`<script>` ile değiştirilebilir, hiçbir seçici değişmez.

**2 · Bu ailede `.btn-primary` → `.btn-fit`.**
*Gerekçe:* ölçüldü — `--tomato` (#009d4f) beyaz metinle **3.54:1**, AA altı;
`--fit-deep` **5.45:1** ve S4 kararı zaten "site geneli `.btn-fit` olsun"
diyor. Tek sayfada iki farklı yeşil birincil düğme durmasın diye ailenin
tamamı çevrildi. *Geri alma:* sınıf adını geri `btn-primary` yap. *Doğrulama:* yedi sayfada kalan `btn-primary` sayısı **0**.

**3 · İşaretleme Bugün ekranında iki durumlu (yapıldı / geri al), üç seviyeli değil.**
*Gerekçe:* sözleşmedeki üç seviye (`tam` · `yarim` · `atlandi`) planın **tam
görünümüne** ait ve orası madde 18 ile AJAN-D'nin sayfası. Bugün ekranı
"bugün ne yapacaksın" ekranı; üç seviyeli bir seçiciyi buraya koymak hem
AJAN-D'nin çözümüyle çakışır hem günlük akışı ağırlaştırır. Bugün yazdığı
değer `{yapildi:true, seviye:'tam'}`, geri alması `{yapildi:false}` — ikisi de
sözleşmenin kendi yüzeyi. **Başka yerde `yarim`/`atlandi` işaretlenmişse Bugün
ekranı onu doğru etiketle gösteriyor** (`FPX.SEVIYE_ETIKET`), üzerine yazmıyor.
*Geri alma:* `.fpx-mark` düğmesini üç düğmeli bir gruba çevir.

**4 · Kayıtlı planlar "Kaydettiklerim" listesine `plan` türü olarak eklendi.**
*Gerekçe:* kullanıcının kurduğu plan da kaydettiği bir şey; ayrı bir sayfa
uydurmaktansa var olan listeye altıncı çip olarak girdi. Satırlar
`FIT_PLAN.listele()`'den geliyor, sahte kayıt yok. *Geri alma:* `Plan` çipini
ve `planSatirlari()` çağrısını kaldır.

**5 · Sayfaların kalan gösterim verisi (enerji, su, challenge, randevu, rozet)
olduğu gibi bırakıldı.**
*Gerekçe:* bunlar `FIT_SHELL.state`'ten gelen ve **60 sayfanın tamamında**
geçerli olan prototip örnek verisi; kabuk zaten giriş yapmamış kullanıcıya
`.fp-gate` ile "bu sayfadaki veriler örnektir" diyor. Madde 19'un dürüstlük
şartı **plan** için yazılmış ("aktif plan yoksa dürüst boş durum") ve o
karşılandı. Prototip verisini tek sayfa ailesinde temizlemek siteyi tutarsız
yapardı. *Geri alma:* ilgili kartlar kaldırılır.

**6 · [GEÇERSİZ KALDI] `--muted`'ta kalma kararı.**
Kendi bileşenlerimde bilerek `--muted`'ta kalmıştım (4.06:1, AA altı) çünkü
tek sayfa ailesinde koyulaştırmak kabuğun geri kalanıyla tutarsızlık
üretirdi. **AJAN-A token'ın kendisini düzeltti** (#7E7E7E → #717171 — benim
kardeş markadan ölçtüğüm gri). Yeniden ölçüldü: beyaz **4.88:1**, krem
**4.64:1**, sayfalarda `rgb(113,113,113)` (7/7). Bu ailedeki bütün ikincil
etiketler bedava AA'ya geçti; kararın konusu kalmadı.

**7 · Randevu / rozet / sağlık profili üst özet sayıları DOM'dan sayılıyor.**
*Gerekçe:* bu üç sayfada plan verisi yok. Sabit sayı yazmak yerine ekranda
gerçekten kaç satır varsa o sayılıyor (`.fp-row[data-okunmadi]`,
`[data-rozet="kazanildi"]`, `.fp-row[data-dolu]`). Böylece özet kartı ekranla
**hiçbir zaman** çelişemez. *Geri alma:* `boya()` içindeki sayımı sabit
değerlerle değiştir.

---

### Kabukta gördüğüm ama DOKUNMADIĞIM eksikler (AJAN-A'ya)

Altısı da mesajla ölçümleriyle gönderildi. **AJAN-A dördünü kapattı;
aşağıdaki durumlar onun düzeltmesinden sonra yeniden ölçüldü.**

**1 · [KAPANDI] Madde 4, Fit Planım banner'ını @1440'ta bozuyordu (9+ sayfa).**
Ölçtüğüm hâl: `body[data-fit-hero-kind] .lib-top > .wrap{flex-direction:row}`
kuralı sarmalayıcı bekliyor, `#fitPlanTop` üreticisi basmıyor →
`lib-crumb x=132 · eyebrow x=264 · h1 x=465 · lib-sub x=621 · fp-who x=1186`,
beş blok yan yana. AJAN-A'nın yanıtı: o kural onun **ara durumuydu**; madde
4'ün 2. geçişinde kaldırılmış, kural artık `.wrap`a değil kabuk JS'inin
kurduğu **`.lib-row`**a bağlı — yani benim önerdiğim `.lib-main` sarmalayıcısı
gerekmiyor, `.lib-row` yokken `.wrap` tek kolon kuralında kalıyor.
**Ben yeniden ölçtüm (7 sayfa × 3 genişlik):** `.wrap` = `flex/column`,
tek sol kenar **132 / 24 / 16**, `.lib-row` yok, banner **544 / 607 / 587**. Doğru.

**Asıl kıymetli tarafı:** "yükseklik ölçen nöbet bunu yakalamaz" tespiti.
AJAN-A o boşluğu kapattı — `tests/footer-yapi.mjs`'e **ölçüt 12b** eklendi
("banner `.wrap` çocukları yan yana diziliyorsa `.wrap > .lib-row` zorunlu")
ve K27 yöntemiyle kırmızıya döndürüldü: kusurlu kural geri konunca **12 sorun**.
Benim raporladığım 9 Fit Planım sayfasına ek olarak `enerji-defteri-dengele`
ve `enerji-defteri-su` de kırmızıya dönmüş — **kusur benim raporumdan genişmiş**.

**2 · [KAPANDI] `.eyebrow` kontrastı.** Ölçümüm: `--tomato` #009d4f →
beyaz **3.54:1**, krem **3.36:1**; 12px/700 "large" değil, eşik 4.5:1.
AJAN-A tabanı `--fit-deep`e çevirdi (25 sayfa AA'ya geçti, açık zeminli
eyebrow artık 64 sayfada tek renk). **Yerel yamamı kaldırdım.**
Yeniden ölçüm: 7/7 sayfada `rgb(0,122,61)`, yama yok.

**3 · [KAPANDI] `--muted` kontrastı.** Ölçümüm: #7E7E7E → beyaz **4.06:1**,
krem **3.86:1**; kardeş markanın aynı işi yapan grisi `rgb(113,113,113)` ve
**4.88:1** (`dadadiet.com/hesaplayicilar` `.hub-grid p`). AJAN-A token'ı
**#717171** yaptı — benim ölçtüğüm değeri aldı, uydurmadı.
Yeniden ölçüm: sayfalarda `rgb(113,113,113)`, beyaz **4.88:1**, krem **4.64:1**.

**4 · [KISMEN KAPANDI] Dokunma hedefleri.**
`.fit-tab` (Planım rayı, AJAN-A'nın): **37.4 → 44.0 px**. Ben doğruladım:
@390'da 7/7 sayfada **44.0 px**. (@1440/@1024'te 40.9 px — orada işaretçi var,
44 px şartı dokunmatik kırılım için.)
`.chip`i 30 px'te bilerek bırakmış: WCAG 2.5.8 (AA) eşiği 24 px, 44 px eşiği
2.5.5 yani AAA; referansın kendi çipi de 38.1 px. Gerekçeli, katılıyorum.
`.fp-act` / `.fp-actbtn` / `.see-all` / `.df-fchip` kabuk tabanında hâlâ
44 px altında — ben kendi sayfalarımda ≤640px'te kapattım, taban düzeltmesi
lead'e ayrı madde olarak bırakıldı.
**Yeniden ölçüm (@390, ray ve paragraf içi bağlantılar hariç):** 7 sayfanın
**6'sında 0 ihlal**; `fit-planim-gecmis-v1`'de tek kalem "Veri ve İzinlerim"
33 px — o da `.fpx-note-sm` **paragrafının içindeki** cümle bağlantısı, yani
`.hr-note` bağlantılarıyla aynı WCAG 2.5.8 istisnası. Bilerek bırakıldı.

**5 · [AÇIK] `.lead` yaslaması site genelinde nehir üretiyor.**
`fit-type.css` `.lead`i istisnaya almamış. Ölçtüm: @390'da en geniş kelime
arası **26.1 px** (normal ~4 px). `fit-type.css`'in kendi yorumu bu tuzağı
`.lib-sub` / `.wz-risk` için zaten anlatıyor; `.lead` de o listeye girmeli
(30+ sayfayı ilgilendiriyor). Ben yalnız `.fpx-sec .sec-head .lead`i çevirdim.

**6 · [AÇIK] `.fp-grid` gap 22px, referans 24px.** İki piksel; `.fp-grid`
AJAN-D'nin sayfasında da kullanıldığı için tek taraflı değiştirmedim.

---

### Bozulmadığını kanıtladıklarım

| Kilit | Ölçüm |
|---|---|
| **Banner ailesi 544/607/587** | 7 sayfa × 3 kırılım = 21 ölçüm, **21'i de 544 / 607 / 587** |
| **R11 footer perdesi** | `tests/footer-curtain.mjs` → **0 sorun**: @1440 65 sayfa `margin-bottom − footer yüksekliği = 0` **tek değer**, perdeden sonra kuyruk yok; @390 perde kipi kapalı |
| **Yasal bant** | `tests/footer-yapi.mjs http://localhost:8811` → **0 sorun**, "Yasal bant dokunulmamış" |
| **`tests/plan-account.mjs`** | **0 sorun** — ray 7 kalem (Bugün · Plan ve Takvim · Aktivite Kayıtlarım · İlerlemem · Kaydettiklerim · Antrenörüm · Enerji Defteri), Hesabım rayı tekrarlamıyor, ray dışı 4 sayfa yetim değil |
| **K18 / K20 / K25** | Ray 7 kalem, Enerji Defteri girişi yerinde; Fit Planım kümesiyle Enerji Defteri kümesi **karıştırılmadı** — Enerji Defteri sayfalarına hiç dokunulmadı |
| **K5 / K7 menü kuralı** | `NAV` / `ACCOUNT_ITEMS` / `PLAN_TABS` **değiştirilmedi** (hepsi `fit-shell.js`, AJAN-A'nın) |
| **Sözleşme modülü** | `assets/js/fit-plan-kayit.js` **değiştirilmedi** — yalnız `<script src>` ile çağrıldı |
| **`tools/page-check.mjs` @1440** | 7/7 **temiz** — konsol 0, 4xx 0, yatay taşma 0, kırık iç bağlantı 0 (140–147 bağlantı/sayfa), marka dili temiz |
| **`.fit-health`** | 7/7 sayfada **0 düğüm** — AJAN-A'nın madde 2 kaldırması, beklenen davranış |
| **Uydurma sayfa/bağlantı** | **Yok.** Eklenen her `href` diskte var olan bir dosyaya gidiyor (page-check doğruladı). `docs/icerik-bekleyen.md`'ye yazılacak yer tutucu **çıkmadı**. |

---

### Yeni sınama — `tests/plan-ozet.mjs`

Yedi adım: (0) bileşen kurulu mu · (1) dürüst boş durum · (2) işaretleme +
kalıcılık · (3) `ozet()` ↔ DOM birebir · (4) Kaydettiklerim plan satırı ·
(5) Aktivite Kayıtlarım işareti · (6) klavye · (7) sessiz değişim yok.

**K27 — taban commit'te kırmızı:** `8bf5c66`'daki yedi sayfa geri konup
koşuldu → **3 kırmızı** ("üst özet kartı sayfada", "FIT_PLAN modülü yüklü",
"istatistik kolonu ve ilerleme çubuğu kurulu"), çıkış kodu 1.
Şimdiki hâlde **hepsi yeşil**, konsol hatası 0.

```
python3 -m http.server 8811 &
PW_HOME=~/.pw node tests/plan-ozet.mjs
```

---

### Dokunduğum dosyalar

```
fit-planim-v1.html                    11 440 →  36 559 B
fit-planim-gecmis-v1.html              7 810 →  30 287 B
fit-planim-ilerleme-v1.html            7 874 →  31 365 B
fit-planim-kaydettiklerim-v1.html      7 028 →  28 325 B
fit-planim-randevular-v1.html          8 505 →  29 763 B
fit-planim-rozetler-v1.html            8 451 →  28 363 B
fit-planim-saglik-profil-v1.html       8 931 →  30 406 B
tests/plan-ozet.mjs                    YENİ
tasks/r6-ilerleme/E.md                 ilerleme notları
tasks/r6-shots/E/                      64 ekran görüntüsü + 6 referans kanıtı
```

**Dokunmadıklarım:** `fit-planim-programim-v1.html` (AJAN-D) ·
`fit-planim-veri-izin-v1.html` (AJAN-A) · `assets/css/fit-shell.css` ·
`assets/js/fit-shell.js` · `assets/js/fit-plan-kayit.js` · `assets/css/fit-type.css`.

**Commit atılmadı, push edilmedi.**
