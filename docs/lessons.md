# DERSLER

Bu depoda **pahalıya mal olmuş** hatalar. Her madde: ne oldu · nasıl yakalandı ·
kural. `DENETIM.md` protokolü, bu dosya onun somut örnekleri.

---

## 1 · `getClientRects()` sıfır alanlı elemanda 1 döner — "görünür" sanılır

**Ne oldu (R11/M22).** Dikiş işaretleyicisi banner'dan sonraki ilk opak bloğu
buluyor; araya giren blok varsa "komşu değil" deyip binmeyi (`is-onbanner`)
düşürüyordu. Görünürlük ölçütü olarak `el.getClientRects().length === 0`
kullanılıyordu — `DENETIM.md` §2'nin önerdiği ölçüt.

Ana sayfada hero ile beyaz gövde arasında `.wrap.fit-band-panel` var ama
**boş**; kabuk `.fit-band-panel:empty{display:none}` diyor. Eleman **0×0**.
`getClientRects()` yine de **1 rect döndürdü**, işaretleyici onu "araya giren
görünür blok" saydı ve binme düşürüldü.

**Sonuç:** ana sayfada radius DOM'da vardı (22px, tam hero'nun bittiği yerde)
ama `margin-top:0` olduğu için köşe kesiği koyu hero'yu değil sayfa zeminini
açıyordu — beyaz üstünde beyaz. Gözle "radius yok" görünüyordu, ölçümle vardı.

**Nasıl yakalandı.** Beyar "hero'daki beyaz panelde niye radius koyman
gerekiyor" diye sordu. Ölçüm `radius: 22px` ama `margin-top: 0px` dedi —
yani sorun radius değil **binme**. Oradan DOM'daki 0×0 bloğa inildi.

**Kural.** Görünürlük ölçütü tek başına `getClientRects().length` DEĞİL:

```js
var kutu = el.getBoundingClientRect();
if (el.getClientRects().length === 0 || kutu.width < 1 || kutu.height < 1) {
  /* görünmez — akışta yok say */
}
```

`display:none` için `getClientRects()` doğru çalışır (0 döner), ama
**0 boyutlu ama render edilen** elemanlar (boş flex/grid çocuğu, `width:0`
sarmalayıcı, `:empty` kuralıyla kapatılmamış boş `.wrap`) 1 rect döndürür.
Alan kontrolü şart.

**Nerede uygulandı:** `assets/js/fit-shell.js` → `BANNER → GÖVDE DİKİŞİ`.

---

## 2 · Sonda önce şüphelidir — kendi körlüğü, ölçülenin kusuru sanılır

`DENETIM.md`: *"Sondanın kendi kusuru, ölçülenin kusuru sanıldı. Bu tek turda
en az on bir kez oldu."* R11'de **üç kez daha** oldu; üçü de rapora girmeden
yakalandı.

**2a · Sahte kontrast hataları (16 bulgunun 11'i).**
`tests/uiux-denetim.mjs` ilk sürümü zemini yalnız `backgroundColor` zincirini
yukarı takip ederek buluyordu. Metin bir **görselin** ya da **gradyanın**
üstündeyse zincir şeffaf geçip beyaz `body`'ye düşüyor, beyaz metin
**`1.00:1`** gibi imkânsız bir oran veriyordu.
→ Kural: yolda boyalı görsel/gradyan varsa, ya da eleman **şeffaf
sabit/yapışkan** bir kabın içindeyse (banner üstündeki şeffaf header), zemin
**bilinemez** sayılır ve o metin **ölçülmez**. Rapor kaç tanesini atladığını
yazar.

**2b · Sahte dokunma hedefi bulguları (45 tane).**
`.cbx`/`.tgl` gibi özel kontrollerde gerçek `<input>` 1×1'e indirilir; sonda
onu "13×13, WCAG altında" diye raporluyordu. Dokunma hedefi input değil, onu
saran `<label>`.
→ Kural: gizlenmiş girdide ölçüm `<label>`'a kaydırılır; label yoksa atlanır.
"Hedef yok" demek "hedef doğru" demek değildir.

**2c · "24 etiket görünüyor" ama ekranda yalnız ikon var (R11/M7).**
Marka etiketi sondası `.brand-tag`'in görünürlüğünü ölçüyordu — etiket ikonu
taşıdığı için görünür çıkıyordu. Ama metin sarmalayıcısı yanlışlıkla
kabuğun `.bs-name` sınıfını taşıyordu ve o sınıf üst bantta **bilerek gizli**
(`max-width:0; opacity:0`, hover'da açılıyor). Metin DOM'daydı, ekranda yoktu.
Ekran görüntüsüne bakılmasa fark edilmezdi.
→ Kural: bir **parçanın** görünürlüğü ölçülecekse **o parçayı** ölç, kabını
değil. Ve sonda yeşilken **görüntüye bak** — `tests/header-banner.mjs` de
geometriyle ölçüyor, renkle değil; yeşil kalıp arayüz bozulabilir.

---

## 3 · `<legend>` fieldset'in `padding-top`'unu atlar

**Ne oldu (R11/M13).** `.ft-q{padding:13px 0}` yazıyordu; CSS'e bakan "13px
nefes var" sanıyordu. Ölçüm: ayraç çizgisi → soru metni **0px**.

`<legend>` kutusu fieldset'in **kenarlık bandına** yerleşir, dolgu kutusunun
ÜSTÜNDE kalır — yani `padding-top` ona işlemez.

**Kural.** Fieldset'te üst nefes legend'in **kendi dolgusundan** verilir.
Ve metnin gerçek yeri `getBoundingClientRect()` ile değil **`Range`** ile
ölçülür (kutu ≠ metin):

```js
const rng = document.createRange();
rng.selectNodeContents(legend);
const nefes = rng.getBoundingClientRect().top - onceki.getBoundingClientRect().bottom;
```

Bu kural `tests/uiux-denetim.mjs` başlık **7d**'ye eklendi — aynı hata başka
fieldset'te tekrarlarsa nöbet yakalar.

---

## 4 · Yakınlık tersse hiyerarşi bozulur (Gestalt)

**Ne oldu (R11/M13).** Uygunluk taraması sorularında: soru metni ↔ seçenekler
**21px**, seçenekler ↔ alttaki ayraç **14px**. Yani seçenekler kendi
sorusundan çok **bir sonraki soruya** yapışık okunuyordu.

**Kural.** Birbirine ait olan yakın, ayrı olan uzak olmalı. Grup içi boşluk,
gruplar arası boşluktan **küçük** olmalı. Düzeltilen oran: ayraç↔soru 22 ·
soru↔seçenek 14 · seçenek↔ayraç 22 (hepsi 4px ızgarasında).

---

## 5 · Nöbet beklentisi değişecekse ASIL garantiyi koru

R11'de **5 nöbetin** beklentisi değişti (`footer-yapi` · `plan-account` ·
`plan-kayit` · `egzersiz-katalog` · `header-banner`). Hepsinde aynı kalıp
uygulandı:

> Asıl garanti DEĞİŞMEZ, yalnız **ölçüm noktası** taşınır.

Örnek: `plan-kayit` "girişsiz kullanıcının kalıcılığı" garantisini ölçüyordu
ama bunu `#wgUrl` kopyalama kutusundan okuyordu. Kutu kaldırılınca nöbet
kırmızı yandı — **doğru yaptı**. Kalıcılık mekanizması (`?plan=` adres
çubuğuna yazılıyor) hâlâ çalıştığı için ölçüm oraya taşındı; kutunun geri
gelmediği de ayrıca şart koşuldu.

**Kural.** Nöbeti "geçsin diye" gevşetme. Garantinin hâlâ sağlandığını **ölç**,
sonra ölçümü doğru yere taşı, gerekçesini nöbet dosyasına yaz. Böylece bir şey
sessizce kaybolursa yine kırmızı yanar.

---

## 6 · Nöbetler kendi sunucusunu AÇMAZ

**Ne oldu (R11).** `kabuk-kalite` · `footer-yapi` · `enerji-hesap` ·
`sozluk-kapalilik` `ERR_CONNECTION_REFUSED` verdi. "Ortam kısıtı, sandbox
bağlamayı engelliyor" diye rapor edildi — **yanlış teşhis**.

Nöbetler hazır bir sunucu bekler ve adresi argümandan alır; verilmezse
varsayılan porta gider. Sunucu kurulunca dördü de koştu.

**Kural.** Bağlantı hatası görünce önce **sunucu ayakta mı** diye bak:

```bash
python3 -m http.server 8788 --bind 127.0.0.1 &
PW_HOME=~/.pw node tests/<nöbet>.mjs http://127.0.0.1:8788
```

Port **8899 kullanılmaz** (Beyar'ın DadaGastro sunucusu orada).

---

## 7 · Yerelde ölçüp yayına bakma

**Ne oldu (R11).** Beyar defalarca `gaviaworks-dev.github.io`'daki **eski**
sürüme bakıp "niye yapmadın" dedi; iş yereldeydi ve push edilmemişti.
Bir tur boşa gitti.

**Kural.** Ölçümün hangi adrese karşı koştuğunu **söyle**. Kullanıcı yayına
bakıyorsa ya push et ya da yerel adresi ver. `docs/qa/yayin-dogrula.mjs`
push sonrası yayının güncellendiğini döngüyle bekleyip doğrular.

---

## 8 · Kardeş markadan ölçü alınır, palet alınmaz (K29)

R11'de yedi bileşen kardeş markalardan **ölçülerek** alındı (dikiş · banner
ayracı · sayfalama · sözlük bağlantısı · Görüş Bildir · plan profili ·
parallax). Hepsinde ölçüler birebir, **renk DadaFit paletine** çevrildi.

**Ek ders:** referansa bakarken **hangi** referansa baktığını doğrula.
M20'de "DadaHaber'deki gibi" denildi, ben onun kalın sarı bloğunu taklit ettim;
Beyar DadaGastro'nunkini istiyordu (52×144, ince, normal yazı). Bir tur geri
alındı. Referans belirsizse **ölç ve göster**, sonra uygula.

---

## 9 · Kabuk sözleşmesi — ölü kural silinmez

`assets/css/fit-shell.css` ve `fit-shell.js` **66 sayfayı** etkiler.

- Mevcut kuralı değiştirme; **dosya sonuna ekle** (kaynak sırası kazanır) ve
  gerekçeyi yorumda yaz.
- İşaretlemeden çıkan sınıfın CSS'ini **silme** — "ÖLÜ KURAL" yorumuyla
  işaretle ve kütüğe yaz. R11'de bırakılanlar: `.sz-back` · `.ap-soon` ·
  `.df-combo-*` · `.lib-more`.
- Bir bileşen iki sayfada yaşamaya başladıysa **kabuğa taşı, kopyalama**.
  Taşırken: **önce ölç, taşı, sonra ölç — geometri birebir aynı olmalı.**
  (R11'de antrenör kartı ve plan profili böyle taşındı; `docs/qa/
  antrenor-kart-geometri.mjs` bu kıyasın scripti.)

---

## 10 · Beyaz zemin + şeffaf header = görünmez logo

**Ne oldu (R11/M17).** Plan sayfalarının koyu banner'ı beyaz profil başlığına
çevrildi. Kabuk `data-fit-over="1"` ile header'ı şeffaflaştırıp marka yazısını
**beyaza** boyuyor. Beyaz zeminde logo görünmez olacaktı.

**Kural.** Bir sayfanın banner'ı koyudan açığa dönüyorsa, sayfayı
**over-mode listesinden çıkar** (`fit-shell.js` → `OVER_MODE`) ve
`tests/header-banner.mjs`'te BANNER → PLAIN listesine taşı.
`profil-v1` tam bu gerekçeyle hep PLAIN'di (KARARLAR K23).

Aynı tuzağın kardeşi: `.lib-crumb` koyu banner için yazılmış
(`rgba(255,255,255,.6)`); beyaz zeminde kırıntı bağlantıları görünmez olur.
Beyaz zeminde `profil-v1`'in `.pf-crumb` renkleri kullanılır.

---

## 11 · Paralel ajanlar tek git index'ini paylaşır

**Ne oldu (R12).** Dört builder aynı anda çalışırken `program-detay-12` ile
`fit-testleri-12`'nin commit'leri **iki kez** birbirine karıştı: biri `git add`
yaparken diğerinin staged dosyası aynı commit'e girdi. İkisi de fark edip
`git reset --soft` / `git reset -- <dosya>` ile ayıkladı.

**Kural.** Paralel çalışan ajanlara commit'i **pathspec ile** attır:
```bash
git commit -- <dosya1> <dosya2> -m "..."
git show --stat HEAD      # yalnız kendi dosyaları mı girdi?
```
Yanlış dosya girdiyse `git reset --soft HEAD~1`, pathspec'le tekrar.
`git add -A` bu ortamda **yasak**. Push'u tek elde (lead) tut.

**Not:** `git commit -- <path>` staged hunk'ı değil **working tree'nin tamamını**
alır. Bir dosyada iki ayrı concern varsa hunk'ları sırayla açıp kapatarak
commit'lemek gerekir (R12'de `fit-testleri-12b` böyle yaptı).

---

## 12 · Joker seçici = kör ölçüm

**Ne oldu (R12).** Ölçüm sondalarında `[class*="..."]` kalıbı **en az beş kez**
yanlış elemanı yakaladı:
- `[class*="pag"]` → `main.page-main` (sayfalama sanıldı)
- `[class*="banner"]` → `div#cookieBanner` (hero kapağı sanıldı)
- `[class*="ava"]` → `span.acct-ava` (0×0, dropdown avatarı)

Her seferinde ölçüm anlamsız sayı verdi (`rightGap=1008px` gibi) ve sonda
"kusur var" ya da "kusur yok" diye **yanlış** rapor edecekti.

**Kural.** Ölçümde **kesin seçici** kullan (`nav.pagi`, `.fp-kapak`, `.fp-ava2`).
Joker arama yalnız **envanter çıkarmak** için, ölçüm için değil.
Sıfır/boş/absürt dönen her sonuçta önce sondadan şüphelen (§2).

**Aynı ailenin bir başka tuzağı:** CSS değişkeni `:root`'ta olmayabilir.
R27'de `--gs` `.df-recipe-band` elemanında scoplu olduğu için
`getComputedStyle(document.documentElement)` boş döndü — palet sızıntısı
kontrolü yanlışlıkla "temiz" çıkacaktı.

---

## 13 · Kullanıcının gördüğü gerçektir, nedeni tahmin edilemez

**Ne oldu (R12).** Beyar iki kez ekran görüntüsüyle kusur bildirdi; ikisinde de
ilk teşhisim yanlıştı:

**(a) R22 · "düğmeler sol üstte, biçimsiz".** Kod doğruydu. Ekran görüntüsü
14:08'de, kontrollerin commit'i 14:11'de — üç dakika önce bakılmıştı. Ölçüm ajanı
**kontrollü deneyle** kanıtladı: konumlama kuralı canlı DOM'da kaldırılınca düğme
akışa düşüp etiketle **3140px²** çakıştı, Beyar'ın tarifiyle birebir eşleşti.
Sunucu `Cache-Control` göndermiyor (yalnız `Last-Modified` + 304) → heuristik
önbellek mümkün.

**(b) R33 · "detay patlamış".** Ben "patlamış değil" dedim — JS hatası 0, yatay
taşma yok, içerik tam. **Yanılmışım.** Kırık bir HTML yorumu `.lib-stats` içinde
düz metin olarak kalmış, ekranda hayalet satır olarak görünüyor ve flex kolonunu
641px'e şişiriyormuş. Benim taramam (hata + taşma) bunu göremezdi.

**Kural.** "Bende görünmüyor" bir teşhis değildir. Kullanıcının tarifini
**üretmeye çalış** (deneyle), ya da o bölgedeki **metin düğümlerini** tara —
geometri ölçümü artık metni yakalamaz.

---

## 14 · Referans doğrulanmadan uygulanmaz

**Ne oldu (R12).** İki kez "kardeş markada böyle" denip yanlış yöne gidildi:
- **R15:** "sekmeler diet'teki gibi merkezi olsun" → ölçüm DadaDiet'in de
  **sola dayalı** olduğunu gösterdi (üst site menüsüyle karıştırılmış).
- **R12:** "referans tek zeminde akıyor" diye gövde bölümü **beyaza** çevrildi;
  referansın tek zemini **gri**ydi. R23'te geri alındı.

**Kural.** `docs/lessons.md` §8'in devamı: referans **ölçülmeden** uygulanmaz.
Ölçülemiyorsa (giriş duvarı vb.) maddeye **"ÖLÇÜLEMEDİ"** yazılır ve yapı
uydurulmaz. R12'de `dadadiet.com/planim` ve `/hesabim` giriş duvarındaydı;
Beyar kimlik verince ölçüldü, o zamana kadar üç madde beklemede tutuldu.

---

## 15 · Ortak bileşende dar kapsam tutarsızlık üretir

**Ne oldu (R12).** R15'te sekme rayı ortalaması **tek sayfaya** uygulandı
(kabuğa dokunmamak için). Sonuç: 1 sayfa ortalı, 13 sayfa sola dayalı.
Beyar bunu "tıklayınca sola yaslı oluyor" diye geri bildirdi ve **R34** olarak
yeniden açıldı — bu kez kabuğa yazıldı, sayfaya özel kural kaldırıldı.

**Kural.** Ortak bileşende (kabuk sınıfı) bir karar verilirken kapsam **baştan**
konuşulur: "yalnız bu sayfa mı, hepsi mi?" Dar kapsam güvenli görünür ama
tutarsızlık bir sonraki turda geri döner. Opt-in sınıf (`.fit-tabs.is-center`
kalıbı) iki dünyayı da verir: kabukta tanımlı, yalnız işaretli sayfada etkili.

---

## 16 · "Herhangi bir noktası tıklanıyor mu" ≠ "çalışıyor"

**Ne oldu (R13).** `anatomi-v1` haritasının 72 bölgesini tek tek tıklayıp
"72/72 ÇALIŞIYOR" raporladım. Denetim ajanı aynı sayfada gerçek bir kusur
buldu: kadın/arka `latissimus` dolgusunun **%34'ü** `erector-spinae`
altında kalıyordu ve kullanıcı sırtın ortasına tıklayınca yanlış panel
açılıyordu. Benim sondam bölgenin İÇİNDE elementFromPoint'in o elemanı
döndürdüğü **bir** nokta buluyor ve "tıklanıyor" diyordu.

**Kural.** Örtüşen/katmanlı hedeflerde ölçüt "bir nokta tutuyor mu" değil,
**"kendi dolgusunun yüzde kaçı üstte"** olmalı. Eşik: %95'in altı bulgudur,
ve örtenin ADI raporlanır. Ölçüm:
```js
// bölgenin dolgusunu tara; her noktada elementFromPoint === el mi
if(!el.isPointInFill(nokta)) continue;
ic++; if(document.elementFromPoint(x,y)===el) ust++;
// ustOran = 100*ust/ic
```

**Aynı ailenin tuzağı — ağırlık merkezi ölçütü iki loblu şekillerde
GEÇERSİZDİR.** Sol+sağ kas çiftinin ağırlık merkezi iki lobun ARASINA,
gövde orta hattına düşer; orada şekil yoktur, tıklama zemine gider ve
"önceki seçim duruyor" diye okunur. Bu ölçütle koşan sonda 18 bölgenin
15'inde sahte kusur üretti. Merkez ölçütü yalnız TEK parçalı şekillerde
kullanılabilir.

---

## 17 · Üreteci olan çıktıyı elle düzenleme — önce KONTROL KOŞUSU

**Ne oldu (R13).** Anatomi SVG'leri `tasks/anatomi-uretim/` betikleriyle
render'dan üretiliyor; BENIOKU açıkça "elle düzenlenen bir SVG bir daha
üretilemez ve render ile hizası bozulur" diyor. Kusuru düzeltmek için
üreteci güncelledim — ama ÖNCE hiçbir şey değiştirmeden koşturdum ve
dört SVG'nin de **birebir aynı** çıktığını doğruladım.

**Kural.** Üretilen çıktıyı değiştirmeden önce üreteci olduğu gibi koştur
ve çıktının bit bit aynı olduğunu kanıtla. Bu iki şeyi birden verir:
üretecin hâlâ çalıştığını, ve sonraki farkın YALNIZ senin değişikliğinden
geldiğini. Kontrol koşusu olmadan "üreteç mi bozuldu, ben mi bozdum"
ayrımı yapılamaz.

**Ara dosyalar oturum scratchpad'inde yaşıyorsa yolunu devir notuna yaz** —
bu turda `*-nlab.npy` dosyaları hâlâ duruyordu ve üreteç koşabildi;
kaybolsalardı normalizasyon adımı baştan koşmak gerekecekti.

---

## 18 · Kusurun ÖNCÜLÜ yanlış olabilir, kusur yine gerçektir

**Ne oldu (R13).** Beyar "bilgilendirme kutusu üstündeki ızgaradan dar"
dedi. Ölçüm öncülü yalanladı: kutu (776px) ve üstündeki üç kart
**piksel piksel hizalıydı** (ikisi de 332→1108). Ama gördüğü sorun
gerçekti — dar olan tek kutu değil, **makale kolonunun tamamıydı**
(`.art-wrap` 840px), ve sayfa header'ı 1176px'ti.

**Kural.** §13'ün devamı: öncülü ölçüp yanlışlamak işi bitirmez. "Öncül
yanlış" demek "kusur yok" demek DEĞİLDİR. Ölçümü raporla, gerçek kök
nedeni göster ve kullanıcının hangi kanonu istediğini SOR — bu turda
"header ile aynı genişlik" cümlesi "en üstteki header menü genişliği"
diye netleşti ve kapsam (yalnız kutu mu, ızgara da mı) ona göre kuruldu.

---

## 19 · Ekran görüntüsüne bakmadan tasarım kararı verme

**Ne oldu (R13).** `aktivite-gunlugu`'nda altı özet döşemesi düz bir
ızgaraydı; yalnız biri hedefi olan ölçümdü. Birincil döşemeyi iki kolona
yaydım — ölçüm doğruydu (779 vs 381px). Ekran görüntüsüne bakınca ızgara
6 hücreden 7'ye çıkmış, son satırda tek başına bir döşeme kalmıştı;
düzen öncekinden KÖTÜ oldu. Geri alındı, hiyerarşi ızgaraya dokunmadan
tipografiyle kuruldu.

**Kural.** Geometri ölçümü "düzen iyi mi" sorusunu cevaplamaz. Tasarım
dokunuşundan sonra RENDER'a bak. Tertip (ızgaranın kapanması) vurgudan
önce gelir; 6 hücrelik ızgarada bir hücreyi 2'ye çıkarmak aritmetik
olarak ragged satır üretir.

---

## 20 · Aynı sözcük iki markada TERS anlama gelir — durum sözlüğü kopyalanmaz, EŞLENİR

**Ne oldu (Dalga 3 · destek kanonu uyarlaması).** Fit'in üç durumu şöyleydi:
`acik` rozetinde **"Yanıt bekleniyor"** yazıyordu, `yanitlandi` rozetinde
**"Yanıtlandı"**. Kanonun dördü ise `acik` = *sıra destek ekibinde* ·
`yanit-bekleyen` = *sıra ÜYEDE*.

Yani Fit'in **"Yanıt bekleniyor"u kanonun `acik`ıdır**, `yanit-bekleyen`i
DEĞİL — iki dizgi bir harf farkla neredeyse aynı, anlattıkları taraf ise
**birbirinin tersi**. Dizgiye bakıp eşleme yapan bir tur `acik`i
`yanit-bekleyen`e taşırdı ve iki sekme aynı kümeyi gösterirdi; hiçbir test
yakalamazdı, çünkü ikisi de geçerli bir durum adı.

**Nasıl yakalandı.** Kanonun §1'i "kimde sıra" sütununu ayrıca yazıyor.
Eşleme dizgiden değil o sütundan yapıldı:
`Yanıt bekleniyor → acik` · `Yanıtlandı → yanit-bekleyen` · `Kapatıldı → kapatilan`.

**Kural.** Durum sözlüğü paylaşılırken **etiket değil TANIM** eşlenir.
"Bu sözcük bizde de var" bir eşleme kanıtı değildir; ölçüt *"bu durumda sıra
kimdedir / bu satırı kim yazar"*dır. Kanonun `Acik` için "Açık" değil
**"Açık talep"** demesinin sebebi de budur — tek başına "Açık" bu ekranda
"Yanıt bekleyen"le karışıyor.

---

## 21 · Aynı token adı, başka değer: renk kanondan gelmez

**Ne oldu (Dalga 3).** Kanon dört durumu üç rozet varyantına indiriyor
(`ok · wait · off`) ve Diet'in kendi renklerini yazıyor. Fit'e **token adıyla**
kopyalansaydı: Diet'in `--green`i marka yeşilidir, Fit'te `--green` **#3BB77E**
ve kendi tanımının yorumu *"yalnız sağlık bloğu"* der — markanın yeşili `--fit`.
Rozet, sağlık bloğunun rengiyle boyanırdı ve hiçbir kapı bunu görmezdi.

**Kural.** Kanondan **ölçü · boşluk · yarıçap · gölge** gelir; **renk GELMEZ.**
Varyantı eklemeden önce hedef kabuğun token'ının hangi **DEĞERE** çözüldüğü
ölçülür ve kural **literal** yazılır. Bu turda üç varyantın da değerleri
sayfanın zaten ölçülmüş üç çiftinden alındı; yeni renk icat edilmedi, yalnız
hangi durumun hangi çifte düştüğü kanona göre yeniden dağıtıldı.

---

## 22 · Liste ile detay ayrı numara kümesi taşırsa bağlantılar sessizce ölür

**Ne oldu (Dalga 3, R8'den devralınan kusur).** `destek-talepleri-v1` sekiz
talebi `DF-2418` kalıbıyla listeliyordu; `destek-talebi-detay-v1` ise sekiz
yazışmayı `DF-2026-0412` kalıbıyla tutuyordu. İki küme **hiç kesişmiyordu**:
listedeki her satır detayda "talep bulunamadı"ya iniyordu. Sayfaların ikisi de
tek başına "çalışıyor" görünüyordu; kırık olan **aradaki sözleşmeydi**.

**Kural.** İki sayfa aynı kaydı gösteriyorsa kimlik **tek defterden** üretilir
ve iki tarafa oradan basılır. Maket veride bile bu geçerlidir — "nasılsa örnek"
diye ayrışan iki küme, bağlantıların hepsini sessizce koparır. Kapı da kimliğin
kendisidir: numara kalıbını ve alfabeyi ölçen bir test, iki tarafı birden tutar.

---

## 23 · Motor gerçek, üretici yok: tüketiciyi ölçmek yetmez

**Ne oldu (R16, challenge).** `fit-challenge.js` üç challenge tipini de doğru
hesaplıyordu ve konsolda uçtan uca çalıştığı ölçülebiliyordu: katıl, kayıt yaz,
`süreli 100/100 tamam`, `seri 7/7 tamam`, beyan elendi, puan `0→580→715`.
Motor kusursuzdu. Ama ilerlemeyi besleyen üç alanı — `slug` · `metrik` ·
`tarihISO` — **arayüzde yazan hiçbir yüzey yoktu** (grep: 0 üretici).
Antrenman kaydını üreten tek ekran (`egzersiz-detay-v1`) yalnız
`ad · dk · kcal · kaynak` yazıyordu. Yani üç tipten ikisi — egzersiz serisi ve
süreli hedef — **kullanıcı ne yaparsa yapsın ilerlemiyordu**. Sözleşme
yazılmıştı, imzanın bir tarafı boştu.

**Neden görünmedi.** Motoru ölçen sonda kaydı KENDİ yazıyordu
(`antrenmanTamamla({metrik:{km:20}, …})`). Sonda, üreticinin yerine geçince
üreticinin yokluğu ölçülemez hâle geldi. Devir notu da bu yüzden "motor hazır,
bağla" diyordu — bağın hangi ucunun kopuk olduğunu kimse ölçmemişti.

**Kural.** Bir sözleşme modülü "çalışıyor" denmeden önce **üretici tarafı**
ölçülür: bu alanı yazan gerçek bir ekran var mı? Kanıt sondası veriyi kendi
üretmez, **kullanıcının bastığı düğmelere basar**. R16'da kapanış kanıtı böyle
alındı: egzersiz sayfasında setler kapatıldı, "Antrenmanı bitir"e basıldı ve
challenge ilerlemesinin kendiliğinden `0/7 → 1/7` olduğu, aynı kaydın süreli
hedefe de `44/1000` yazdığı ölçüldü.

---

## 24 · Yorumdaki iddia da ölçülür

**Ne oldu (R16).** `fit-challenge.js`in katalog başlığında şu yazıyordu:
*"Slug'lar diskteki gerçek sayfalarla eşleşir; uydurma yok."* Ölçüldü:
`sabah-esneme` challenge'ının yedi adım slug'ının **hiçbiri** egzersiz
kataloğunda yoktu (25 gerçek slug'a karşı **0 eşleşme**). Adımı kapatacak bir
sayfa olmadığı için o challenge hiçbir yoldan bitirilemiyordu — ve bunu söyleyen
tek şey, aksini iddia eden bir yorumdu.

**Kural.** Kod yorumundaki "uydurma yok · tek kaynak · gerçek sayfa" gibi
iddialar **denetimin kendisi değil, denetlenecek şeydir**. Böyle bir cümle
yazılıyorsa yanına onu üretecek ölçüm de yazılır; yoksa cümle, kusuru gizleyen
bir güvence hâline gelir.

---

## 25 · Sonda yerel günü, kayıt UTC'yi konuşursa motor bozuk görünür

**Ne oldu (R16).** Seri challenge'ı 7/7 kayıt yazılmasına rağmen `0/7`
gösteriyordu. Motor doğruydu: sonda kayıtları `d.setMinutes(-100)` ile yazıyor,
ISO dizgisi **UTC** oluyordu (`2026-08-29T20:35Z`); katılım penceresi ise
**yerel** gün anahtarıyla açılıyordu (`2026-08-30`). Kayıtlar pencerenin bir gün
dışına düşüyordu — motor onları haklı olarak saymıyordu.

**Kural.** Gün penceresi hesaplayan bir motoru sınarken kayıt tarihleri
**yerel güne** göre yazılır; birkaç saatlik geriye kaydırma, saat dilimi
farkı kadar bir sonraki/önceki güne taşır. Bu, deponun "ölçüm sondası 0/boş
dönerse önce sondadan şüphelen" kuralının bir örneğidir — bu turda da sonda
kördü, ölçülen kusurlu değildi.

---

## 26 · Ölçüm sondası fontu beklemezse "gerileme" uydurur

**Ne oldu (R16, form kiti taşıması).** Ajan, taşımadan önce/sonra ekranı
`getComputedStyle` ile karşılaştırdı ve **24 sahte fark** buldu: `.fk-cc i`
7.78px, `.hs-warn i` 11.67px, `.fk-help i` 9.34px. Kimse o değerleri yazmamıştı.
Sebep: sonda `document.fonts.ready` beklemiyordu; ikon genişlikleri Font Awesome
yüklenmeden, **yedek fontla** okunmuştu. Font yüklü hâlde üç kez ölçünce
değerlerin her birinin kendi `font-size`'ı olduğu çıktı (10/15/12).

**Kural.** Yazı tipine bağlı bir ölçü (genişlik, satır yüksekliği, ikon kutusu)
`document.fonts.ready` beklenmeden okunmaz. Ayrıca **taban doğru kurulmalıdır**:
bu turda ajan tabanı `git show HEAD:` ile eski sayfaları ve kabuğun taşıma
öncesi hâlini ayrı bir portta servis ederek kurdu — "önceki hâli hatırlıyorum"
diye ölçmek gerileme ölçümü değildir.

---

## 27 · Aynı adlı kural iki ayrı yüzeyin kuralı olabilir

**Ne oldu (R16, admin paneli).** Devir belgesi *"Kaydet düğmesi dörtte aynı:
**SOLDA**"* diyordu ve panelin form kalıbı buna göre kuruldu — 8 dosyada 11 yer.
Sonra Gastro'nun **admin** form CSS'i ölçüldü: `.form-actions{justify-content:
flex-end}`, dokuz ayrı sayfada birebir. **Kaydet sağda.**

Çelişki değildi: belgedeki kural dört markanın **hesap ekranlarının** kuralıydı
(Diet tabanlı, `.pc-foot`), admin formunun değil. İki ayrı yüzey, iki ayrı kural;
ben ikisini tek kural sandım.

**Kural.** Bir belgeden kural alırken **hangi yüzeyin** kuralı olduğu da alınır.
"Dörtte aynı" ifadesi neyin dördünde aynı olduğunu söylemiyorsa, uygulamadan
önce hedef yüzeyde ölçülür. Ölçmeden taşınan bir kural, doğru olduğu yerden
alınıp yanlış olduğu yere konur.

---

## 28 · Kırpılmış taşma, ölçülmeyen taşmadır

**Ne oldu (R16/2, yönetim paneli).** Denetim kapısı yatay taşmayı **dürüst**
yoldan ölçüyordu — `body.scrollWidth` değil, sayfanın gerçekten kayıp
kaymadığı (`scrollTo(9999,0)` sonrası `scrollX`). 21 ekranda **0** döndü.
Ama bir ajan aynı ekranlarda **133 · 122 · 68 px gerçek kayma** ölçmüştü.

İkisi de doğruydu. Kabuk `html,body{overflow-x:clip}` yazıyor — bilinçli ve
gerekçeli bir karar (kırpar ama kaydırma konteyneri yaratmaz, böylece odak
alan bir öğe sayfayı yana kaydıramaz). O kural, geniş bir tablo kabının
(`overflow-x:auto`) içeriğinin belgeye sızmasını **kırpıyor**; kayma gerçekten
oluyor, kapı onu göremiyor. Kusur giderilmemişti, görünmez olmuştu.

Çözen tek şey `contain:paint` oldu; `min-width:0` · `max-width:100%` ·
`contain:inline-size` ve `overflow-x:clip` denendi, dördü de kesmedi.

**Kural.** Sayfada taşmayı **kırpan** bir kural varsa (`overflow-x` `clip` ya
da `hidden`), belge düzeyinde ölçen hiçbir kapı yeterli değildir; kırpma o
kapıyı kalıcı olarak yeşile boyar. Kaydırma kaplarının **kendi ekseni** ayrıca
sınanır. Daha genel hâli: bir kapının yeşil yanması, kusurun yokluğunu değil,
**o kapının kusuru görebildiğini** varsayar — ve bu varsayım da ölçülmelidir.

---

## 29 · Kit uyumu, marka tutarlılığı demek değildir

**Ne oldu (R16/2, yönetim paneli).** Panel sıfırdan kuruldu ve pek çok şey
**ölçülerek** alındı: bölümleme (Genel Bakış + Ana içerik · Operasyon ·
Yapılandırma), tek ad kuralı, liste kalıbı, sayfalamanın kartın içinde oluşu,
kaydet düğmesinin sağda olması. Dördü de Gastro'nun kaynağından okundu ve
dördü de doğru çıktı.

Ama **kabuğun görünümü ölçülmedi.** Gerekçe makul görünüyordu: *"kit zaten
var, `docs/fit-kit.md`in tokenlerini kullanırım, yeni renk üretmem."* Öyle de
oldu — tek bir token bile uydurulmadı, bütün ölçüm kapıları yeşil yandı.
Beyar iki ekranı yan yana koyunca çıktı: panel **Gastro'ya hiç benzemiyordu**.
İkon rail yok, sidebar beyaz (Gastro'da koyu), arama dar ve ortada (orada
geniş ve solda), sayfa başlığı üst barda (orada gövdenin içinde), KPI kartı
yatay (orada dikey).

**Kural.** Bir tasarım sistemine uymak, o sistemin **değerlerini** kullanmak
demek değildir; **yapısını** da almaktır. Token listesi "hangi yeşil" sorusunu
cevaplar, "sidebar koyu mu açık mı", "arama nerede durur", "kart dikey mi
yatay mı" sorularını cevaplamaz — ve bir paneli tanıdık kılan ikinciler.
Kardeş bir ürünün karşılığı varsa **kabuğu da ölçülür**, yoksa kit içinde
kalan ama yabancı duran bir yüzey çıkar.

⚠ Bunun bir alt kuralı da şu: **hiçbir ölçüm kapısı "bu bize benziyor mu"
sorusunu sormaz.** Taşma, kontrast, dokunma hedefi, ölü bağlantı — hepsi
geçebilir ve yüzey yine yanlış olabilir. O soruyu soran tek şey, iki ekranı
yan yana koyup bakmaktır.


---

## §29 · Kit uyumu marka tutarlılığı demek değildir

**R17 · 2026-08-30 · admin paneli görünüm turu**

R16/2'de panelin 21 ekranı kuruldu ve bütün ölçüm kapılarını geçti: yatay taşma
0, konsol hatası 0, ölü bağlantı 0 (460 bağlantı), 44px altı dokunma hedefi 0,
kaynak şeridi 21/21, yazma yüzeyi yalanı 0. **Tek bir token bile uydurulmadı.**
Ve panel Gastro'ya hiç benzemiyordu.

Sebep, turun kendi kaydında yazılı: bölümleme, ad kuralı, kaydet düğmesinin yeri
ve liste kalıbı Gastro'dan **ölçülerek** alındı ve dördü de doğru çıktı. Ama
**kabuğun görünümü ölçülmedi** — çünkü "kit zaten var, tokenleri kullanırım"
diye düşünüldü. Kit kullanmak bir kısıttır, bir tasarım kararı değil: aynı
tokenlerle birbirine hiç benzemeyen iki kabuk yazılabilir ve yazıldı.

R17'de kaynak okundu ve sekiz sapma ölçüldü — hepsi de "kit içinde" duran,
hiçbir kuralı çiğnemeyen kararlardı:

| | R16/2 (uydurulmuş) | Gastro (ölçülen) |
|---|---|---|
| Sidebar | tek katman, **beyaz** 276px | **iki katman koyu**: 76px rail + 264px menü = 340 |
| Arama | üst barda **ortada**, 320px | üst barda **solda**, 420px |
| Sayfa başlığı | **üst barda** (gövdede hiç yok) | **gövdede**, kartların üstünde |
| Daralt | sidebar'ın altında tam genişlik düğme | menünün **dış kenarında yüzen tutamak** |
| KPI | ikon + sayı + not | ikon + sayı + etiket + **trend satırı** |
| Tablo başlığı | gri zeminli | **zeminsiz** |
| Liste araması | kart **başlığında** | kartın **filtre şeridinde solda** |
| İkon rail | **yok** | var, 76px, aktif işaretli |

**Kural:** bir yüzeyi bir başkasına benzetecekseniz, benzetilecek şeyin
**ölçüsünü** alın — sözlüğünü değil. Kit "hangi değerleri kullanabilirim"i
söyler; **yapı** ayrı bir sorudur ve ayrıca ölçülür.

**Ölçüm kapısı olarak da eksikti:** `admin-denetim.mjs` her ekrana tek tek
"kendi içinde sağlam mı" diye soruyordu, hiçbir kapı "yirmi bir ekran birbirine
benziyor mu" diye sormuyordu. R17'de `admin-kalip-denetim.mjs` yazıldı — kabuk
değerlerini 21 ekranda yan yana koyar ve tek değere inmiyorsa sapan ekranı
adıyla söyler.

---

## §30 · Template literal'in içindeki ters tırnak kabuğu sessizce kırar — `node --check` yakalamaz

**R18'de iki kez oldu, ikisi de aynı kök.** `fit-shell.js`in `FEEDBACK_HTML` ve
`FOOTER_RAW` sabitleri **template literal**'dir (backtick ile açılır). Bu
depoda yorumlar Markdown alışkanlığıyla yazılıyor — `` `.fb-chiprow` `` ,
`` `<a href>` `` gibi. O yorum bir template literal'in **içine** düştüğünde
ters tırnak dizgiyi erken kapatır ve gerisi JavaScript sanılır.

```
ÖLÇÜLEN SONUÇ (birinci sefer):  Uncaught ReferenceError: chiprow is not defined
                                → footer HİÇ basılmadı, 78 sayfada birden
İKİNCİ SEFER:                   SyntaxError: Unexpected identifier 'href'
```

🔴 **Birincisi `node --check`ten GEÇTİ.** Kırılan dizgi rastlantıyla geçerli
JavaScript ürettiği için sözdizimi denetimi yeşil döndü; kusur ancak sayfa
tarayıcıda açılınca ve `pageerror` dinlenince görüldü. İkincisi geçmedi —
yani `node --check` bu sınıfın **bir kısmını** yakalar, güvenilmez.

**Kural (bağlayıcı):**

1. Template literal'in içine yorum yazarken **ters tırnak kullanma** — düz
   tırnak (`"`) ya da tırnaksız yaz. Hangi sabitlerin literal olduğunu bil:
   `FEEDBACK_HTML` · `FOOTER_RAW` · `COOKIE_HTML` · `LGGATE_HTML`.
2. Kabuk dosyasına yazan her tur, `node --check`e ek olarak **tarayıcıda bir
   sayfa açıp `pageerror` sayar**. Kapı: `docs/qa/kabuk-r18-nobet.mjs` — 78
   sayfayı gezer, konsol hatası · yatay taşma · footer basıldı mı ölçer.
   Kabuk TEK KAYNAK'tır: buradaki bir kusur tek sayfada değil hepsinde patlar.
3. Denetim tek satır: `awk '/^var FOOTER_RAW = `/,/^function footerHtml/' \
   assets/js/fit-shell.js | grep -n '`'` → açılış ve kapanış dışında **0**
   eşleşme olmalı.

---

## §31 · Perde arkasında ölçüm yapma — `elementFromPoint` görünen katmanı okur

**R18 · footer denetimi.** Dokunma hedefini "kutu kaç piksel" diye ölçmek bu
depoda yanlıştır: kit §10/§13'ün deseni **görünmez `::before`** ile hedefi
büyütür, `getBoundingClientRect()` onu görmez. Doğrusu **hit test**:
kalemin merkezinden ±(N/2−1) px'te `elementFromPoint` hâlâ o kalemi mi veriyor?

Ama hit test de körleşir — üstünde bir katman varsa. İki perde ölçüldü ve
ikisi de **29 kalemin 29'unu** yanlışlıkla "düşük hedef" gösterdi:

| Perde | Neden | Çözüm |
|---|---|---|
| **Footer reveal** | Footer perdeyle açılır; içerik onun ÜSTÜNDE durur | ölçümden önce sayfa dibine in |
| **Çerez bandı** | `#cookieBanner` yasal bandın üstünü kapatır | ölçümden önce kapat |

Ayrıca yatay kaydırılan bir şeritte (`.fb-chiprow`) görünür pencerenin
dışındaki çipler de null döndürür → her kalem önce `scrollIntoView` ile
pencereye alınır.

**Kural:** bir sonda "hepsi düştü" diyorsa önce **sondadan** şüphelen. Gerçek
bir kusur genelde bir kısmında görünür; **hepsi** düşüyorsa ölçüm körlüğüdür.
Ekrana bak, katmanı bul, kaldır, yeniden ölç. (docs/lessons.md §2'nin footer
tarafındaki tekrarı — sonda körlüğü bu depoda üçüncü kez çıktı.)

---

## §32 · Belgeye yazılan ders, kapıya yazılmadıkça bir sonraki dosyada geri gelir

**Tur:** R19 · **Bulan:** B5 ajanı, yol üstünde · **Etkilenen:** 6 yeni dosya

### Kusur

```html
<input pattern="[a-z0-9-]+">
```

Chromium `pattern` özniteliğini **`v` bayrağıyla** derliyor ve orada karakter
sınıfının **sonundaki çıplak `-`** geçersiz. Ölçüldü:

```
[a-z0-9-]+              u: geçerli    v: GEÇERSİZ  (Invalid regular expression)
[a-z0-9\-]+             u: geçerli    v: geçerli
[a-z0-9]+(-[a-z0-9]+)*  u: geçerli    v: geçerli
```

### Neden sinsi

Kusur **yükleme anında görünmez** — pattern ancak doğrulama sırasında derlenir.
Yani ekran açılır, ölçüm "konsol 0" der, kapı yeşil yanar. Kırmızı ancak
kullanıcı **Kaydet'e bastığında** düşer ve tam o anda:

`reportValidity()` istisna atar → **form doğrulanmaz** → ama `maketKaydet`
yine de **"Form doğrulandı"** notunu basar. Boş zorunlu alanla da basar.

Bu, bu depoda en çok kovalanan şeyin ta kendisidir: **maket olanı gerçekmiş
gibi göstermek** — ve bunu yapan, dürüstlük yardımcısının kendisi.

### 🔴 Asıl ders bu değil

**Bu ders zaten yazılıydı.** `admin-challenge-v1.html`in kendi yorum bloğu,
önceki bir turda, tam olarak bu kusuru ve çözümünü anlatıyordu:

> *"🔴 TİRE KAÇIŞLI OLMAK ZORUNDA: `[a-z0-9-]` Chromium'un `pattern`
> derleyicisinde İSTİSNA ATIYOR… Sonucu sessiz ve tam da bu turda
> kovaladığımız yalandı."*

Yorum doğruydu, yerindeydi, ayrıntılıydı — ve **altı yeni dosyanın altısında
da tekrarlandı.** Çünkü bir yorum yalnız o dosyayı okuyanı korur; yeni dosya
yazan onu okumaz.

**Kural: bir ders bir dosyanın yorumunda yaşıyorsa henüz öğrenilmemiştir.**
Tekrar edebilen her kusur bir **ölçüm kapısına** yazılır; kapı yoksa ders
sonraki turda geri gelir. Bu depoda üçüncü kez oldu (kaydet düğmesinin yeri,
liste aramasının yeri, şimdi bu).

### Ne yapıldı

`docs/qa/admin-form-kalibi.mjs` artık her `pattern` özniteliğini tarayıcıda
**`v` bayrağıyla derliyor** ve derlenmeyeni kırmızıya çeviriyor.
Ölçüldü: **19 pattern · v-kipinde geçersiz 0.**

Doğru kalıplar (baştaki/sondaki tireyi de yasaklar — slug için zaten doğru):

| Kullanım | Kalıp |
|---|---|
| slug | `[a-z0-9]+(-[a-z0-9]+)*` |
| isteğe bağlı slug | `([a-z0-9]+(-[a-z0-9]+)*)?` |
| büyük harfli kod | `[A-Z0-9]+(-[A-Z0-9]+)*` |

---

## §33 · HTML'den grep'lenen sayı ölçüm değil tahmindir

**Tur:** R19 · **Bulan:** B3 ajanı, kendi brifingini denetlerken · **Doğrulayan:** lead

### Ne oldu

Bir ölçüm ajanı `docs/gastro-olcum/fit-yonetilmeyenler.md`i yazdı; belge altı
yapıcı ajanın brifingi oldu. B3, kendi maddesinin üç sayısını **yeniden ölçtü**
ve üçü de yanlış çıktı:

| Belgede | Gerçek | Neden |
|---|---|---|
| *"`ORDER` 11 ilan ediyor, `L` 10 tanımlıyor — `veri-izin` eksik"* | **11 / 11, kesişim tam. Kusur YOK.** | `L`'nin anahtarları eksik sayılmış |
| S.S.S. **30** kayıt | **24** | `data-kat` özniteliğini kategori **sekme düğmeleri** de taşıyor (6 tane) |
| Rehber **177** `<li>` | **153** | `grep -o '<li'` deseni **`<link>`** etiketlerini yakalıyor (sayfa başına 4) |

### Denetimin ortaya çıkardığı desen

Lead belgenin **öteki bütün başlık sayılarını** yeniden ölçtü. Sonuç keskin:

> **Yanlış çıkan üç sayının üçü de HTML'den grep'lenmişti.
> Veri modülünden okunan hiçbir sayı yanlış çıkmadı.**

Doğru çıkanlar: 254 terim × 9 alan (`sozluk-veri.js`) · 31 kas · 12 hareket ·
4 harita (`anatomi-veri.js`) · 50 rozet · 9 aile · 8 kademe (`fit-rozet.js`) ·
10 fatura (`fit-fatura.js`) · 100 adım + 100 ipucu (`VERI` bloğu **ayrıştırıldı**,
grep'lenmedi) · 54 sayfa · 38 boş açıklama · 54 boş canonical (`fit-admin-veri.js`).

### Kural

1. **Veri bir modülde duruyorsa modül okunur.** `node -e` ile `eval` edip
   `.length` saymak, düzine satırlık bir grep'ten hem kısa hem doğrudur.
2. Modül yoksa desen **sınır karakteriyle** yazılır (`<li[ >]`, `'<li'` değil)
   **ve bir örnek elle sayılarak doğrulanır.**
3. Bir sayı bir ajanın brifingine girecekse **iki bağımsız yolla** ölçülür.

### 🔴 Ve asıl kural

**Olmayan bir kusuru ekrana basmak, olan bir kusuru kaçırmaktan daha kötüdür.**
Brief B3'e "yasal listedeki tutarsızlığı uyarı rozetiyle görünür kıl" diyordu.
B3 ölçtü, tutarsızlık **yoktu**, ve **çizmedi** — talimatı körlemesine
uygulamak yerine ölçümü söyledi. Doğru davranış budur: bu depoda kanıt sayıdır,
ve talimat da kanıtın önüne geçmez.

Yerine gerçek eksiği bastı: 11 belgenin 11'inde de **sürüm ve yürürlük tarihi
alanı yok.**

---

## §34 · Yarım uygulanan eş-ad sözleşmesi, hiç olmamasından kötüdür

**Tur:** R19 · **Bulan:** B2 ajanı · **Etkilenen:** kabuk, 4 kart bileşeni

### Sözleşme

R17'de kabuk şu kuralı koydu (`fit-admin.css` §0): *"Gastro'nun adı kanon,
`.adm-*` onun eş anlamlısı; ikisi de aynı pikseli basar."* 21 ekranın markup'ını
elemek yerine her kural iki seçiciye birden yazıldı.

### Kusur

Yazılış şöyleydi:

```css
.adm-card .c-body, .pnl-card .pc-body { padding:22px }
```

Yani her **iç** ad yalnız **bir** dış adla eşleşiyordu. Dört birleşimden
**ikisi** hiçbir kurala düşmüyordu: `.adm-card .pc-body` ve `.pnl-card .c-body`.

**Somut zarar ölçüldü:** referans form ekranı `.adm-card` içinde dört yerde
`.pc-body` kullanıyordu → `getComputedStyle` **`0px`** okudu. Yan kartların ve
sekme şeridinin dolgusu yoktu.

### Niye kimse görmedi

Çünkü kart **yine de duruyor** görünüyordu. Kenarlık, yarıçap ve gölge
`.adm-card`tan geliyordu; eksik olan yalnız iç dolguydu ve ekran "sıkışık ama
bozuk değil" duruyordu. Kapılar da göremezdi: `admin-kalip-denetim.mjs`
`.adm-card .c-head` dolgusunu ölçüyordu — **var olan** birleşimi.

**Bir eş-ad sözleşmesi kurulduğunda çapraz birleşimlerin hepsi kurulur.**
Yarısı kurulursa, yazan kişi "iki addan biri" seçme özgürlüğü olduğunu sanır ve
yanlış yarıyı seçtiğinde kural sessizce düşer.

### Ne yapıldı

`:is()` ile tam çapraz:

```css
:is(.adm-card,.pnl-card) :is(.c-body,.pc-body){padding:22px}
```

Özgüllük değişmiyor — `:is()` argümanlarının en yükseğini alır, hepsi sınıf
(0-2-0), eskisiyle aynı. Aynı düzeltme `c-head`/`pc-head`, `c-foot`/`pc-foot`,
başlık ve eylem şeridi ile `@media(max-width:640px)` bloğuna da uygulandı.

Ölçüldü: 21 ekran · kabuk sapması **0** · kalıp sapması **0** ·
16 form sayfası · kusur **0**.

### Yan ders — yedek yol sessiz olmaz

Aynı ajan aynı turda ikinci bir kusur buldu ve sınıfı aynıydı:
referans formun `kasKatalog()`u `ANATOMI_VERI.kaslar.length`e bakıyordu; o bir
**dizi değil nesne**, `.length` `undefined`, koşul sessizce düşüyor ve katalog
hareket kayıtlarından türetiliyordu. Menüde 31 yerine **38** ad çıkıyordu ve
alanın altındaki *"Anatomi haritasındaki 31 kas kaydından seçilir"* ipucu
**ekranda yalan söylüyordu**.

Bu, bu depoda üçüncü kez aynı sınıf (`maketKaydet`in form bulamama hâli ·
`.fit-tabs.is-center`in ölü kalması · şimdi bu):
**çalışan bir yedek yol, kusuru görünmez kılar.**
Kural: yedek yola düşen kod **konsola yazar**, ve ekranda sayı ilan
edilmez — **sayılır** (ipucu artık `kaslar.length` basıyor).
