# DENETİM PROTOKOLÜ

Bu dosya, ajanlarla çalışırken **neyin kanıt sayıldığını** tanımlar.
Kural metni değil, geçiş şartı: aşağıdaki maddeleri geçmeyen iş KAPANMADI sayılır.

Neden var: R8 ve R9 turlarında ajan raporları defalarca "yaptım" dedi ve
bağımsız ölçümde tutmadı. En pahalı ikisi:

- **Sessiz atlama.** Bir ajan gönderilen dört maddeyi hiç yapmadan bir sonraki
  faza geçti ve raporunda bundan söz etmedi. Rapor "bitti" diyordu.
- **Sondanın kendi kusuru.** Ölçüm aracının körlüğü, ölçülenin kusuru sanıldı.
  Bu tek turda **en az on bir kez** oldu (ajanlarda ve lead'de). Hepsi rapora
  girmeden yakalandı, ama yakalanmasaydı hepsi yanlış karara yol açacaktı.

---

## 1 · Kanıt nedir

**Kanıt = sayı.** "Ekledim", "çalışıyor", "düzeldi" kanıt değildir.

| Geçersiz | Geçerli |
|---|---|
| "sekmeler eklendi" | "tür çipi 6 → **9**: Video seansı · Challenge · Fit Test sonucu" |
| "fiyat düzeltildi" | "₺149 kalan **0** · ₺99 sayısı **8**" |
| "nöbet yeşil" | "**28/28** yeşil · kırmızı **0**" |
| "menü güncellendi" | "menü **11** bağlantı · **3** grup başlığı · Bildirimler **0**" |
| "buton çalışıyor" | "tıklamadan önce `state.program = null` · sonra `{hafta:1,gun:1}`" |

Bir iddia sayı üretmiyorsa, iddia değil izlenimdir.

## 2 · Görünürlük — DOM'da olmak yeterli değil

Bu depoda dört ayrı tuzak yakalandı; hepsi "var" derken görünmüyordu:

- `display:none` — DOM'da, ekranda yok
- `visibility:hidden; opacity:0` ama `display:grid` — `offsetParent` **doğru** döner, eleman görünmez
- kapalı akordiyon içindeki eleman — yüksekliği **0px** ölçülür
- 1×1 `aria-live` bölgesi — teknik olarak görünür, kullanıcı için yok

**Kural:** görünürlük `el.getClientRects().length > 0` ile ölçülür.
`offsetParent`, `querySelector` varlığı ve `innerText` içinde kelime aramak
görünürlük kanıtı **değildir**.

## 2b · Metin araması — nerede aradığın da ölçümün parçası

Bir metnin ekranda olup olmadığını ararken üç ayrı yerde arayabilirsin ve
üçü farklı cevap verir. Bu turda üçü de yanlış cevaba yol açtı:

| Nerede aradın | Ne yakalar | Tuzağı |
|---|---|---|
| kaynak dosyada `grep` | **yorumları da** | Kaldırılan metni açıklayan yorum eşleşir → "iş yapılmamış" sanılır |
| `querySelectorAll('body *')` | **`<script>` ve `<style>` içeriğini de** | `textContent` kaynak kodudur; ekranda basılmayan metin eşleşir |
| `document.body.innerText` | yalnız **basılan** metni | `text-transform:uppercase` gördüğünü değiştirir ("Gün 1" → "GÜN 1") |

**Kural:** "ekranda var mı" sorusunun cevabı `innerText`tedir, kaynakta değil.
`innerText` ararken de büyük/küçük harfe duyarsız ara. Kaynakta arama yalnız
"bu kod var mı" sorusu içindir, "kullanıcı bunu görüyor mu" sorusu için değil.

**Karşı kural — yazan taraf için:** kaldırdığın metni açıklayıcı yorumunda
**birebir alıntılama**. Alıntılarsan, kaynakta arayan her denetimi yanıltırsın.

## 3 · Sonda önce şüphelidir

Bir ölçüm kırmızı döndüğünde sıra şudur:

1. **Önce sondayı sorgula.** Seçici doğru mu? Beklenen şey tetikleyicinin
   arkasında mı? `async` bir işlemin sonucunu beklemeden mi okudun?
2. Sondanın gördüğünü **ekran görüntüsüyle** doğrula.
3. Ancak ikisi de sondayı akladıysa kodu suçla.

Sonda yeni yazıldıysa ve ölçülen taraf yeşil diyorsa, **öncelik sondadadır**.

Bu turda sondanın kusuru çıkanlardan bazıları: görünmeyen düğmeye tıklamak ·
çerez bandının "Kabul Et"ine tıklamak · sihirbazın "İleri"si sanılan bir şık ·
`ArrowRight` sonrası `async` sonucu beklememek · kapalı akordiyondaki çipi
ölçmek · `<section>` elemanlarını yapışıklık sanmak · `padding` ile nefes alan
kutuyu `margin` yok diye kusurlu saymak.

## 4 · Kapsam dürüstlüğü

- Kapsam daraltıldıysa **AÇIK** yaz. **KAPANDI sayma.**
- Yapılmayan iş raporda **adıyla** geçer. Sessiz atlama en ağır ihlaldir.
- "Öncesinde de böyleydi" bir kusuru kapatmaz; **bildir**, sonra karar lead'in.
- Belgeden/briften sapıldıysa sapma **gerekçesiyle** yazılır.

## 5 · Nöbet disiplini (K27)

Yeni bir nöbet eklendiğinde:

- Nöbet **taban commit'te kırmızı** olmalı ve **kaç sorunla** kırmızı olduğu
  raporda yazmalı. `exit 1` yetmez — **sayı** gerekir.
- Var olan nöbet kırmızıya düştüğünde: nöbet mi eski sözleşmeyi arıyor, kod mu
  kırıldı — ayır ve **hangisi olduğunu yaz**. Nöbeti sessizce gevşetme.
- Nöbet silinmez. Sözleşme değiştiyse **nöbet yeniden yazılır** ve neyi
  kodladığı başında açıklanır.

## 6 · Dosya sahipliği

- `assets/css/fit-shell.css` · `assets/js/fit-shell.js` · menü/footer/dropdown
  markup'ı → **tek sahibi vardır**, o turda kim atandıysa. Başkası dokunmaz.
- Kabuk sözleşmesi: banner yüksekliği · `h1` · dolgu kabuktan `!important`
  geliyor. Sayfa tarafında gerekiyorsa **özgüllük yükseltilir**, kabuk ezilmez.
- Ajanlar **commit atmaz, birleştirmez, push etmez.** Lead yapar.

## 7 · Rapor biçimi — zorunlu

Her ajan raporu şu üç bölümü taşır:

1. **Kalem tablosu** — her kalem için: ne yapıldı · **kapatan ölçüm (sayı)**
2. **AÇIK bıraktıklarım** — yapılmayan/daraltılan her şey, gerekçesiyle
3. **Sondanın kusuru çıkanlar** — ölçüm sırasında kendi aracın kaç kez
   yanılttı, nasıl ayırdın

Üçüncü bölüm boşsa şüphelidir: bu depoda hiçbir ciddi ölçüm turu sonda kusuru
üretmeden geçmedi.

---

## 8 · Lead'in denetimi — rapora güvenilmez

Lead her ajan çıktısını **bağımsız ölçer**. Rapordaki sayıyı tekrar üretemiyorsa
o kalem KAPANDI değildir.

Zorunlu adımlar:

```
node tools/denetim.mjs                 # mekanik denetim (aşağıda)
node tools/site-tarama.mjs             # 3 genişlik
<nöbet süiti>                          # tamamı
```

Ayrıca **ekran görüntüsüne bakılır** — açılıp gözle görülür. "Ölçüm yeşil"
demek "doğru görünüyor" demek değildir; bu turda buğulu banner kontrastı,
yer tutucu kırpılması ve form boşluğu yalnız görüntüye bakınca yakalandı.

`tools/denetim.mjs` şunları mekanik olarak arar:

- **Ölü etkileşim** — düğme gibi görünüp hiçbir şey yapmayan öğe. En pahalı
  kusur sınıfı bu; araç ilk gerçek koşusunda **15 örnek** kapattırdı, dördü
  aylardır oradaydı ve hiçbir nöbet yakalamamıştı. Yakaladıkları: challenge'ın
  takvim altı CTA'sı · takvimin 30 gün kutusu · randevu sayfasındaki dokuz
  düğme · "Yeni koleksiyon" · "Bir bardak ekle".

  DÜZELTME: bu listede bir zamanlar "katalogda Programa Başla" da yazıyordu.
  **Yanlıştı** — düğme çalışıyordu, ekip arkadaşı ölçümle itiraz etti ve haklı
  çıktı. Lead'in ölçümü hatalıydı. Yanlış bulgu silinmiyor, kayıtta kalıyor:
  bu protokolün kendisi de aynı kurala tabidir.
- **Sahte durum** — sayfaya sabit yazılmış, depodan gelmesi gereken sayı
  (ör. ana sayfada sabit `7 / 30`, Fit Planım'da sabit `Gün 7`).
- **JS hatası** — konsolda hata olan sayfa.
- **Commit ihlali** — ajanların commit/push atıp atmadığı.

Bu denetim **kusur bulmazsa yeşil değildir** — yalnız "mekanik olarak
yakalanabilecek bir şey görünmedi" demektir. Karar hâlâ ölçüme ve göze aittir.
