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
