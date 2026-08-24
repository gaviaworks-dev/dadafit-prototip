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
