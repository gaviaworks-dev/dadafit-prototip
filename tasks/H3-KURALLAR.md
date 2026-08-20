# H3 · Antrenman Oluşturucu — KURAL TABLOSU

> **Bu dosya kaynaktır, kod ondan okur.** `antrenman-olusturucu-v1.html`
> içindeki motor, aşağıdaki §9'da duran `KURALLAR` nesnesini **birebir**
> taşır ve tüm kararlarını ondan üretir; dağınık `if` bloğu yoktur.
> `tests/workout-generator.mjs` §14 sınaması, bu dosyadaki blok ile
> sayfadaki blok **karakter karakter** aynı mı diye bakar — ayrışırlarsa
> süit kırmızıya döner.
>
> Sayfa ayrıca nesneyi `window.AO_KURALLAR` olarak dışa verir; sınama
> anlamsal karşılaştırmayı da bunun üzerinden yapar.

---

## 1 · Kuralların üç kaynağı — hangisi nereden geldi

Bu tabloyu okurken en önemli ayrım budur. Uydurulmuş değer yoktur;
her eksenin kaynağı yazılıdır.

| Eksen | Kaynak | Not |
|---|---|---|
| **Hareket havuzu** — slug, ad, zorluk, ekipman gereği | ✅ **Ölçüldü** — `egzersiz-kutuphane-v1.html` kart öznitelikleri (`data-name`, `data-seviye`, `data-ekipman`) | 12 kalem, kütüphanenin tamamı |
| **Kas grubu / kalıp ataması** | ✍️ **DadaFit editoryal** — `egzersiz-detay-v1.html`'in `bolge` alanı ve kütüphanenin `data-kas`'ı temel alındı, ikincil gruplar hareket kalıbından türetildi | Kaynağı §3'te kalem kalem yazılı |
| **Gün sayısı → bölünme** | ✍️ **Brief'in şartı** (REVIZYON-5 §2 · H3) | MuscleWiki'nin gün eksenli kolu **hiç keşfedilmedi** (KARARLAR K41 · AS-1), kopyalanacak bir şey zaten yoktu |
| **Set / tekrar / dinlenme** | ✍️ **DadaFit editoryal** — yaygın kuvvet antrenmanı pratiğinin genel aralıkları | 🔴 **MuscleWiki'den ALINMADI.** Keşif §5 ve AS-3: sonuç ekranına hiç erişilemedi, bu değerler **elde yok**. MuscleWiki'den alınmış gibi gösterilmiyor |
| **Puan ağırlıkları** | ✍️ **DadaFit editoryal** — R13'ün puanlama deseninin ölçeğine hizalandı | Mutlak değil, **göreli** anlam taşırlar |

---

## 2 · Adım tasarımı — 5 adım, 6 soru

Keşif §9'un önerdiği eksen sırası (`Cinsiyet → Hedef → Seviye → Ekipman →
Gün sayısı → (ops.) odak`) korundu; MuscleWiki'nin **yaş** adımı alınmadı
(§9: "brief'in istemediği bir zorunlu adım kullanıcıyı yorar"). Üstüne
R13'ün **durum/risk** sorusu eklendi — o soru olmadan sağlık koruması
kurulamaz.

| Adım | Başlık | Soru(lar) | Tür |
|---|---|---|---|
| 1 | Vücut modeli | `cinsiyet` | tek seçim · H2'nin SVG gövde modeli kartın içinde |
| 2 | Hedefin | `hedef` | tek seçim (3) |
| 3 | Seviyen | `seviye` | tek seçim (3) |
| 4 | Ekipman ve odak | `ekipman` (zorunlu, çoklu) + `odak` (**opsiyonel**, çoklu) | çoklu |
| 5 | Haftan | `gun` (zorunlu) + `durum` (zorunlu, çoklu) | tek + çoklu |

**Neden 5 adım, 6 değil.** Keşfin önerdiği 6 eksenin hepsi burada; ama
6 ayrı adım rayı @390'da okunmaz hale geliyordu (keşif §9 bu riski
kendisi işaret ediyor: *"6 kalemde bu çok uzar"*). R13'ün çözümü —
**akraba soruları tek adımda toplamak** — burada da uygulandı: ekipman
ile odak aynı cümlenin iki yarısı ("neyin var / neye ağırlık ver"),
gün sayısı ile durum da öyle ("haftan nasıl / dikkat etmemiz gereken var mı").
Adım sayısı 5'te kalınca ray hem masaüstünde hem @390'da tek satırda
okunuyor.

---

## 3 · A · Hareket havuzu — 12 kalem

Kütüphanede **12 gerçek hareket** var; havuz bunların tamamıdır.
Uydurma slug yoktur; her satır `egzersiz-detay-v1.html?slug=` ile
gerçek bir karta gider.

| slug | ad | kalıp | birincil | ikincil | gerek | zorluk | ölçüm |
|---|---|---|---|---|---|---|---|
| `goblet-squat` | Squat (Çömelme) | bacak | bacak | kalca | — | 1 | tekrar |
| `plank` | Plank (Şınav Duruşu) | core | core | — | — | 2 | **süre** |
| `dambil-kurek` | Dambıl Kürek Çekme | cekis | sirt | kol | dambil | 2 | tekrar |
| `sinav` | Şınav (Push-up) | itis | gogus | omuz · core | — | 2 | tekrar |
| `hamle` | Hamle (Lunge) | bacak | bacak | kalca | — | 1 | tekrar |
| `dambil-omuz-press` | Dambıl Omuz Press | itis | omuz | kol | dambil | 2 | tekrar |
| `dambil-biceps` | Dambıl Biceps Curl | cekis | kol | — | dambil | 1 | tekrar |
| `dead-bug` | Dead Bug (Ölü Böcek) | core | core | — | — | 1 | tekrar |
| `kettlebell-swing` | Kettlebell Swing | bacak | kalca | sirt · core | kettlebell | 3 | tekrar |
| `bant-cekme` | Bant Çekme (Band Row) | cekis | sirt | kol | bant | 1 | tekrar |
| `kopru` | Köprü (Glute Bridge) | bacak | kalca | core | — | 2 | tekrar |
| `bant-yana-acma` | Bant Yana Açma | itis | omuz | — | bant | 2 | tekrar |

**`zorluk` ölçüldü:** kütüphane kartlarının `data-seviye` değeri (1 · 2 · 3).
**`gerek` ölçüldü:** kütüphane kartlarının `data-ekipman` değeri
(`ekipmansiz` → `[]`, `dambil` → `['dambil']`, `kettlebell` →
`['kettlebell']`, `direncbandi` → `['bant']`).

### 🔴 Kütüphane ile detay sayfası `goblet-squat`'ta çelişiyor — çözüm ve gerekçe

| Kaynak | Ad | Ekipman |
|---|---|---|
| `egzersiz-kutuphane-v1.html` (kart) | **Squat (Çömelme)** | **Ekipmansız** (`data-ekipman="ekipmansiz"`, kartın görünen etiketi de "Ekipmansız") |
| `egzersiz-detay-v1.html` (`VERI` tablosu) | Goblet Squat | Dambıl / Kettlebell |

**Karar: kütüphane kanoniktir**, `goblet-squat` havuzda `gerek:[]` ile duruyor.
Üç gerekçe: ① kütüphane sitenin **süzme kaynağıdır** — "Ekipmansız" filtresini
seçen kullanıcı bu kartı zaten görür, plan onunla çelişemez; ② kartın
**görünen** ekipman etiketi "Ekipmansız"; ③ H3 brief'inin kendi hareket
tablosundaki **ad sütunu da** kütüphanenin adını ("Squat (Çömelme)")
kullanıyor, yani vücut ağırlığı varyantını.

> ⚠️ **Koordinatöre:** bu bir veri tutarsızlığıdır ve H3'ün dışında.
> `egzersiz-detay-v1.html`'in `VERI` tablosundaki `goblet-squat` satırı
> ya kütüphaneye hizalanmalı ya da kütüphane kartı düzeltilmeli.
> H3 hiçbir sayfayı değiştirmedi, yalnız kanonik kaynağını seçip yazdı.

### Ekipmansız havuzda çekiş kalıbı yok — bilinen sınır

`gerek:[]` olan 6 hareket: `goblet-squat` · `hamle` · `kopru` · `sinav` ·
`plank` · `dead-bug`. Bunların **hiçbiri çekiş (pull) hareketi değil** —
kütüphanedeki dört çekiş hareketinin dördü de dambıl ya da bant istiyor.
Bu bir motor kusuru değil, **kütüphanenin kapsam eksiğidir**.

Motor bunu gizlemiyor, **iki yerde birden söylüyor**:
① sonucun en üstünde bir bildirim şeridi — *"… havuzda Çekiş kalıbında hiç
hareket yok; o günler tamamlayıcı hareketlerle kuruldu. Direnç bandı ya da
dambıl eklersen bu kalıp açılır"*; ② o günün gerekçesinde
*"⚠ elindeki havuzda Çekiş kalıbında hiç hareket yok"* satırı.
Gün yine **dolu** dönüyor — karşılıksız kombinasyon 0 bozulmuyor.
Kütüphaneye ekipmansız bir çekiş hareketi (ör. ters şınav / masa altı
row, süperman) eklendiğinde bu satır kendiliğinden kaybolur.

---

## 4 · B · Gün sayısı → bölünme

Brief'in şartı birebir:

| Gün | Bölünme anahtarı | Günler |
|---|---|---|
| **3** | `full-body` — Tüm vücut | Tüm Vücut A · Tüm Vücut B · Tüm Vücut C |
| **4** | `ust-alt` — Üst / Alt | Üst Vücut A · Alt Vücut A · Üst Vücut B · Alt Vücut B |
| **5** | `ppl` — İtiş / Çekiş / Bacak (+ üst-alt tamamlayıcı) | İtiş · Çekiş · Bacak · Üst Vücut · Alt Vücut ve Core |
| **6** | `ppl` — İtiş / Çekiş / Bacak (iki tur) | İtiş A · Çekiş A · Bacak A · İtiş B · Çekiş B · Bacak B |

Her gün üç alan taşır: `kalip` (günün asıl hareket kalıpları), `vurgu`
(o gün öne çıkan kalıp — aynı bölünmenin günlerini birbirinden ayıran
şey budur) ve `gruplar` (günün hedeflediği kas grupları).
**Hiçbiri eleyici değildir**; hepsi puan ekler.

**3 günde neden A/B/C var:** üç gün de "tüm vücut" olduğu için gün
şablonları aynı; onları ayıran `vurgu` (A → bacak+itiş, B → çekiş+core,
C → bacak+çekiş) ve §6'daki tekrar cezasıdır.

---

## 5 · C · Seviye → set · dinlenme · gün başına hareket

| seviye | set tabanı | dinlenme tabanı | gün başına hareket | süre (izometrik) |
|---|---|---|---|---|
| `baslangic` — Başlangıç | 2 | 60 sn | 4 | 20-30 sn |
| `orta` — Orta | 3 | 75 sn | 5 | 30-45 sn |
| `ileri` — İleri | 4 | 90 sn | 6 | 45-60 sn |

Seviye ayrıca **hareket karmaşıklığını** da etkiliyor: seviyenin üstündeki
her zorluk basamağı için `puan.zorlukCeza` (8 puan) düşüyor — eleme değil.
Yani `kettlebell-swing` (zorluk 3) başlangıç seviyesinde havuzda kalıyor,
sadece sıralamada 16 puan geriye düşüyor.

---

## 6 · D · Hedef → hacim / yoğunluk

| hedef | tekrar | set eki | dinlenme çarpanı | kalıp ağırlığı (bacak · itiş · çekiş · core) |
|---|---|---|---|---|
| `kilo` — Kilo verme | **12-15** | +0 | **×0,70** | 8 · 4 · 4 · **8** |
| `kas` — Kas kazanma | **8-12** | +0 | ×1,00 | 6 · **8** · **8** · 2 |
| `guc` — Güç | **4-6** | **+1** | **×1,55** | **10** · 8 · 8 · 0 |

**Türetilen set × tekrar × dinlenme tablosu** (motorun ürettiği değerler,
dinlenme 5'in katına yuvarlanır):

| | kilo verme | kas kazanma | güç |
|---|---|---|---|
| **başlangıç** | 2 × 12-15 · 40 sn | 2 × 8-12 · 60 sn | 3 × 4-6 · 95 sn |
| **orta** | 3 × 12-15 · 55 sn | 3 × 8-12 · 75 sn | 4 × 4-6 · 115 sn |
| **ileri** | 4 × 12-15 · 65 sn | 4 × 8-12 · 90 sn | 5 × 4-6 · 140 sn |

Dokuz hücrenin dokuzu farklı — seviye ve hedefin ikisi de çıktıyı
gerçekten değiştiriyor.

`olcum:'sure'` taşıyan hareket (`plank`) tekrar yerine seviyenin `sure`
değerini alır: 20-30 sn / 30-45 sn / 45-60 sn.

---

## 7 · E · Ekipman → havuz süzme + F · kas dengesi

### Ekipman — motorun **tek** sert süzgeci, ve boş plan üretemez

Brief "eleme değil puan düşüşü" diyor; ekipman **bunun tek istisnası**,
çünkü kabul ölçütü açıkça *"ekipmansız seçildiğinde planda dambıl /
kettlebell / bant hareketi yok"* diyor — bunu puan düşüşüyle **garanti
etmek imkânsız**.

**Karşılıksız kombinasyon 0 mimariden geliyor:** `gerek:[]` olan **6**
hareket hiçbir seçimde havuzdan düşmez, yani havuz asla 6'nın altına
inmez. Sonradan eklenmiş bir yedek liste yok; taban havuzun kendisi
garantidir.

| Seçim | Havuz büyüklüğü |
|---|---|
| Yok (vücut ağırlığı) | **6** |
| Yok + dambıl | 6 + 3 = 9 |
| Yok + bant | 6 + 2 = 8 |
| Yok + kettlebell | 6 + 1 = 7 |
| Hepsi | **12** |

*(Kural: `gerek` boşsa hareket her zaman havuzda; değilse seçilen
ekipmanlardan en az biri `gerek`te olmalı. "Yok" seçimi diğerlerini temizler.)*

**Gün başına hareket sayısı üç tavanın en küçüğüdür:**

```
N = min( seviye.hareket,
         max(3, havuz − 2),                       ← havuz küçüldükçe gün incelir
         max(3, günün kalıbındaki hareket sayısı) ← itiş gününe bacak doldurulmaz )
```

| Tavan | Ne zaman bağlayıcı | Örnek |
|---|---|---|
| `seviye.hareket` | havuz bol, gün geniş kalıplı | 12 havuz · tüm vücut · ileri → **6** |
| `max(3, havuz − 2)` | ekipmansız havuz | 6 havuz · tüm vücut · ileri → **4** |
| `max(3, kalıptaki)` | push/pull/legs bölünmesi | 12 havuz · itiş günü · ileri → **3** |

Üçüncü tavan **12 hareketlik havuzun doğrudan sonucudur** ve önemlidir:
havuzda yalnız **3 itiş**, **3 çekiş**, **4 bacak**, **2 core** hareketi var.
Bu tavan olmasa motor "İtiş Günü"ne çekiş ve bacak hareketi doldururdu —
ölçüldü, düzeltilmeden önce tam olarak bu oluyordu. Günler artık farklı
uzunlukta olabiliyor; bu bir kusur değil, **havuzun dürüst yansıması**,
ve gün gerekçesinde açıkça yazıyor
(*"gün 3 harekete ölçeklendi: seviye 6 isterdi, havuzda bu kalıpta 3 hareket var"*).

### Kas dengesi

Aynı gün içinde aynı **birincil kas grubundan en fazla 2** hareket
(`puan.gunIciGrupTavan`). Tavan dolduğunda sıradaki aday atlanır;
gün doldurulamayacak hale gelirse tavan gevşetilir — plan asla eksik dönmez.

---

## 8 · 🔴 12 hareket ↔ "aynı hareket iki güne düşmesin" çelişkisi

Brief *"aynı hareket iki güne düşmeyecek"* diyor. **Havuz 12 kalem.**
6 günlük bölünmede bu ancak gün başına 2 hareketle mümkün olurdu —
seans o kadar ince olur ki plan işe yaramaz. Ekipmansız havuzda (6 kalem)
kural zaten **3 günde bile** ihlal edilmek zorunda.

### Karar — kural iki parçaya bölündü

1. **Aynı hareket aynı GÜN içinde tekrarlanmaz.** Bu **mutlak**tır ve
   mimariden gelir: gün seçimi ayrık kalemlerden yapılır.
2. **Günler arası tekrar kaçınılmazdır** ve **cezalandırılır, yasaklanmaz.**
   Bir hareket önceki günlerde kaç kez kullanıldıysa, o gün
   `puan.tekrarCeza` (9) × kullanım sayısı kadar puan kaybeder. Yani
   motor önce hiç kullanılmamış hareketleri dağıtır; havuz tükendiğinde
   en az kullanılana döner.

### Neden bu çözüm

- **Sessizce görmezden gelmek yok.** Kural burada yazılı, kodda da bu
  şekilde uygulanıyor, arayüzde de görünüyor: bir hareket haftada birden
  fazla geçiyorsa gün gerekçesinde *"havuz {n} kalem olduğu için bazı
  hareketler haftada birden fazla geçiyor — aynı hareket aynı GÜN içinde
  tekrarlanmaz"* satırı çıkıyor ({n} = seçilen ekipmanla süzülmüş havuz).
- **Alternatif — gün başına hareketi 2'ye indirmek** — kabul ölçütlerini
  teknik olarak sağlardı ama ürünü bozardı: 6 günlük "plan" 12 harekete
  bölünmüş 2'şerlik seanslar olurdu.
- Ölçekleme kuralı (§7) zaten havuza saygı duyuyor: küçük havuzda gün
  başına hareket sayısı düşüyor, yani tekrar en aza indiriliyor.

### Kütüphane büyüdüğünde kural nasıl sıkılır

| Havuz | Kural | Nasıl uygulanır |
|---|---|---|
| **≥ 24 hareket** | Aynı hareket **haftada en fazla 1** gün | `puan.tekrarCeza` 9 → 999 yapılır; ceza fiilen yasak olur, mimari değişmez |
| **≥ 18 hareket** | Ekipmansız havuza çekiş hareketi girdiğinde §3'teki "çekiş yok" sınırı kalkar | Ek kod gerekmez, havuz verisi yeter |
| **≥ 40 hareket** | Gün başına hareket seviyeye göre 5/6/8'e çıkarılabilir | `seviye.*.hareket` değerleri |

Tek satır değişikliğiyle sıkılabilmesi, kuralın **veri** olmasının
doğrudan kazancıdır.

---

## 9 · KURALLAR nesnesi — kodun okuduğu tablo

> Aşağıdaki blok, `antrenman-olusturucu-v1.html` içinde
> `/* ==KURALLAR-BASLANGIC== */` ve `/* ==KURALLAR-BITIS== */`
> işaretleri arasında **birebir** durur. Sınama §14 bunu denetler.

```js
var KURALLAR = {

  /* ---- A · HAREKET HAVUZU (12 kalem — kütüphanenin tamamı) ----
     slug/ad/zorluk/gerek alanları egzersiz-kutuphane-v1.html'in kart
     özniteliklerinden (data-name · data-seviye · data-ekipman) ÖLÇÜLEREK
     alındı. birincil/ikincil grup ve kalıp DadaFit'in editoryal ataması. */
  havuz: [
    {slug:'goblet-squat',      ad:'Squat (Çömelme)',        kalip:'bacak', birincil:'bacak', ikincil:['kalca'],        gerek:[],             zorluk:1, olcum:'tekrar'},
    {slug:'plank',             ad:'Plank (Şınav Duruşu)',   kalip:'core',  birincil:'core',  ikincil:[],               gerek:[],             zorluk:2, olcum:'sure'},
    {slug:'dambil-kurek',      ad:'Dambıl Kürek Çekme',     kalip:'cekis', birincil:'sirt',  ikincil:['kol'],          gerek:['dambil'],     zorluk:2, olcum:'tekrar'},
    {slug:'sinav',             ad:'Şınav (Push-up)',        kalip:'itis',  birincil:'gogus', ikincil:['omuz','core'],  gerek:[],             zorluk:2, olcum:'tekrar'},
    {slug:'hamle',             ad:'Hamle (Lunge)',          kalip:'bacak', birincil:'bacak', ikincil:['kalca'],        gerek:[],             zorluk:1, olcum:'tekrar'},
    {slug:'dambil-omuz-press', ad:'Dambıl Omuz Press',      kalip:'itis',  birincil:'omuz',  ikincil:['kol'],          gerek:['dambil'],     zorluk:2, olcum:'tekrar'},
    {slug:'dambil-biceps',     ad:'Dambıl Biceps Curl',     kalip:'cekis', birincil:'kol',   ikincil:[],               gerek:['dambil'],     zorluk:1, olcum:'tekrar'},
    {slug:'dead-bug',          ad:'Dead Bug (Ölü Böcek)',   kalip:'core',  birincil:'core',  ikincil:[],               gerek:[],             zorluk:1, olcum:'tekrar'},
    {slug:'kettlebell-swing',  ad:'Kettlebell Swing',       kalip:'bacak', birincil:'kalca', ikincil:['sirt','core'],  gerek:['kettlebell'], zorluk:3, olcum:'tekrar'},
    {slug:'bant-cekme',        ad:'Bant Çekme (Band Row)',  kalip:'cekis', birincil:'sirt',  ikincil:['kol'],          gerek:['bant'],       zorluk:1, olcum:'tekrar'},
    {slug:'kopru',             ad:'Köprü (Glute Bridge)',   kalip:'bacak', birincil:'kalca', ikincil:['core'],         gerek:[],             zorluk:2, olcum:'tekrar'},
    {slug:'bant-yana-acma',    ad:'Bant Yana Açma',         kalip:'itis',  birincil:'omuz',  ikincil:[],               gerek:['bant'],       zorluk:2, olcum:'tekrar'}
  ],

  gruplar:  {bacak:'Bacak', kalca:'Kalça', sirt:'Sırt', gogus:'Göğüs', omuz:'Omuz', kol:'Kol', core:'Core'},
  kaliplar: {bacak:'Bacak', itis:'İtiş', cekis:'Çekiş', core:'Core'},
  ekipman:  {yok:'Vücut ağırlığı', dambil:'Dambıl', kettlebell:'Kettlebell', bant:'Direnç bandı'},

  /* ---- B · GÜN SAYISI → BÖLÜNME ----
     Brief'in şartı: 3 → full body · 4 → üst/alt · 5–6 → push/pull/legs.
     `kalip` günün asıl kalıpları, `vurgu` o gün öne çıkan kalıp,
     `gruplar` günün hedeflediği kas grupları. Hiçbiri eleyici değil. */
  bolunme: {
    '3': {anahtar:'full-body', ad:'Tüm vücut (full body)', gunler:[
      {ad:'Tüm Vücut A', kalip:['bacak','itis','cekis','core'], vurgu:['bacak','itis'],  gruplar:['bacak','kalca','gogus','omuz','sirt','kol','core']},
      {ad:'Tüm Vücut B', kalip:['bacak','itis','cekis','core'], vurgu:['cekis','core'],  gruplar:['sirt','kol','core','bacak','kalca','gogus','omuz']},
      {ad:'Tüm Vücut C', kalip:['bacak','itis','cekis','core'], vurgu:['bacak','cekis'], gruplar:['bacak','kalca','sirt','kol','gogus','omuz','core']}
    ]},
    '4': {anahtar:'ust-alt', ad:'Üst / Alt', gunler:[
      {ad:'Üst Vücut A', kalip:['itis','cekis'], vurgu:['itis'],  gruplar:['gogus','omuz','sirt','kol']},
      {ad:'Alt Vücut A', kalip:['bacak','core'], vurgu:['bacak'], gruplar:['bacak','kalca','core']},
      {ad:'Üst Vücut B', kalip:['itis','cekis'], vurgu:['cekis'], gruplar:['sirt','kol','gogus','omuz']},
      {ad:'Alt Vücut B', kalip:['bacak','core'], vurgu:['core'],  gruplar:['kalca','bacak','core']}
    ]},
    '5': {anahtar:'ppl', ad:'İtiş / Çekiş / Bacak (+ üst-alt tamamlayıcı)', gunler:[
      {ad:'İtiş Günü',          kalip:['itis'],          vurgu:['itis'],  gruplar:['gogus','omuz','kol']},
      {ad:'Çekiş Günü',         kalip:['cekis'],         vurgu:['cekis'], gruplar:['sirt','kol']},
      {ad:'Bacak Günü',         kalip:['bacak'],         vurgu:['bacak'], gruplar:['bacak','kalca']},
      {ad:'Üst Vücut',          kalip:['itis','cekis'],  vurgu:['cekis'], gruplar:['gogus','omuz','sirt','kol']},
      {ad:'Alt Vücut ve Core',  kalip:['bacak','core'],  vurgu:['core'],  gruplar:['bacak','kalca','core']}
    ]},
    '6': {anahtar:'ppl', ad:'İtiş / Çekiş / Bacak (iki tur)', gunler:[
      {ad:'İtiş Günü A',  kalip:['itis'],  vurgu:['itis'],          gruplar:['gogus','omuz','kol']},
      {ad:'Çekiş Günü A', kalip:['cekis'], vurgu:['cekis'],         gruplar:['sirt','kol']},
      {ad:'Bacak Günü A', kalip:['bacak'], vurgu:['bacak'],         gruplar:['bacak','kalca']},
      {ad:'İtiş Günü B',  kalip:['itis'],  vurgu:['itis','core'],   gruplar:['omuz','gogus','kol','core']},
      {ad:'Çekiş Günü B', kalip:['cekis'], vurgu:['cekis','core'],  gruplar:['sirt','kol','core']},
      {ad:'Bacak Günü B', kalip:['bacak'], vurgu:['bacak','core'],  gruplar:['kalca','bacak','core']}
    ]}
  },

  /* ---- C · SEVİYE → SET / DİNLENME / GÜN BAŞINA HAREKET ----
     Değerler MuscleWiki'den ALINMADI (keşif §5 · AS-3: sonuç ekranı
     görülemedi, set/tekrar/dinlenme değerleri elde yok). Aşağıdakiler
     yaygın kuvvet antrenmanı pratiğinin genel aralıklarıdır; DadaFit'in
     editoryal seçimidir. `sure` yalnız olcum:'sure' hareketler için. */
  seviye: {
    baslangic: {ad:'Başlangıç', no:1, set:2, dinlenme:60, hareket:4, sure:'20-30 sn'},
    orta:      {ad:'Orta',      no:2, set:3, dinlenme:75, hareket:5, sure:'30-45 sn'},
    ileri:     {ad:'İleri',     no:3, set:4, dinlenme:90, hareket:6, sure:'45-60 sn'}
  },

  /* ---- D · HEDEF → HACİM / YOĞUNLUK ----
     tekrar aralığı + set eki + dinlenme çarpanı; ayrıca hedefin kalıp
     ağırlığı (hangi kalıba ne kadar yer verilsin). */
  hedef: {
    kilo: {ad:'Kilo verme',  tekrar:'12-15', setEk:0, dinlenmeKat:0.70, kalipAgirlik:{bacak:8,  itis:4, cekis:4, core:8}},
    kas:  {ad:'Kas kazanma', tekrar:'8-12',  setEk:0, dinlenmeKat:1.00, kalipAgirlik:{bacak:6,  itis:8, cekis:8, core:2}},
    guc:  {ad:'Güç',         tekrar:'4-6',   setEk:1, dinlenmeKat:1.55, kalipAgirlik:{bacak:10, itis:8, cekis:8, core:0}}
  },

  /* ---- E · PUAN EKSENLERİ ----
     Hiçbiri eleyici değil (ekipman hariç, bkz. F). Puan düşüşü sıralamayı
     değiştirir, havuzdan kalem çıkarmaz. */
  puan: {
    kalipUyum:50,      /* hareketin kalıbı günün kalıbındaysa */
    vurgu:14,          /* kalıp ayrıca günün vurgusundaysa */
    birincilGrup:22,   /* birincil kas grubu günün gruplarındaysa */
    ikincilGrup:10,    /* ikincil kas grubu günün gruplarındaysa */
    odakUyum:12,       /* kullanıcı odak seçtiyse ve hareket odakla kesişiyorsa */
    zorlukCeza:8,      /* seviyenin üstündeki her zorluk basamağı için */
    tekrarCeza:9,      /* hareketin önceki günlerde kaç kez kullanıldığı × bu */
    gunIciGrupTavan:2  /* aynı gün içinde aynı birincil gruptan en fazla */
  },

  /* ---- F · EKİPMAN → HAVUZ SÜZME ----
     TEK SERT SÜZGEÇ BUDUR ve karşılıksız kombinasyon üretemez: gerek:[]
     olan 6 hareket her zaman havuzdadır, yani havuz hiçbir seçimde
     6'nın altına düşmez. "Yok" seçimi diğerlerini temizler. */
  ekipmanSuzme: {tabanHavuz:6, kural:'gerek boşsa her zaman; değilse seçilen ekipmanlardan en az biri gerekte olmalı'},

  /* ---- G · HAVUZA GÖRE ÖLÇEKLEME + YUVARLAMA ----
     Gün başına hareket sayısı ÜÇ tavanın en küçüğüdür:
       (1) seviye.hareket
       (2) max(enAz, havuz - tabanEksi)          havuz küçüldükçe gün incelir
       (3) max(enAz, günün kalıbındaki hareket)  itiş gününe bacak hareketi
                                                 doldurulmaz
     12 kalemlik kütüphanede (2) bağlayıcı değil; (3) push/pull/legs
     bölünmesinde bağlayıcıdır — havuzda 3 itiş, 3 çekiş, 4 bacak, 2 core
     hareketi var. Dinlenme `yuvarla`nın katına yuvarlanır. */
  olcek: {tabanEksi:2, enAz:3},
  yuvarla: 5,

  /* ---- H · RİSK DALI ----
     Bu yanıtlardan biri işaretliyse kişiye özel plan ÜRETİLMEZ. */
  riskli: ['agri','saglik','gebelik','hareketsiz']
};
```

---

## 10 · Motorun kuralları nasıl uyguladığı — 5 adım

```
1. HAVUZ SÜZ        ekipman → gerek karşılanmayan hareketler düşer
                    (taban 6 hareket hep kalır → boş plan imkânsız)
2. GÜN ŞABLONU AL   gun → bolunme[gun].gunler
3. HER GÜN İÇİN     her havuz kalemini puanla:
                      + kalipUyum      kalıbı günün kalıbındaysa
                      + vurgu          kalıbı ayrıca günün vurgusundaysa
                      + hedef.kalipAgirlik[kalıp]
                      + birincilGrup   birincil grubu günün gruplarındaysa
                      + ikincilGrup    ikincil grubu günün gruplarındaysa
                      + odakUyum       kullanıcı odak seçtiyse ve kesişiyorsa
                      − zorlukCeza × max(0, zorluk − seviye.no)
                      − tekrarCeza × (önceki günlerdeki kullanım sayısı)
                    eşitlikte havuz sırası bozar  →  DETERMİNİSTİK
4. SEÇ              puanı yüksekten N kalem; aynı gün içinde aynı birincil
                    gruptan en fazla gunIciGrupTavan
                    N = min( seviye.hareket,
                             max(olcek.enAz, havuz − olcek.tabanEksi),
                             max(olcek.enAz, günün kalıbındaki hareket) )
5. REÇETE YAZ       set = seviye.set + hedef.setEk
                    tekrar = hedef.tekrar   (olcum:'sure' ise seviye.sure)
                    dinlenme = yuvarla(seviye.dinlenme × hedef.dinlenmeKat)
```

**`Math.random()` yok.** Aynı seçim her zaman aynı planı verir
(KARARLAR K41 · AS-2). Eşitlik bozucu, R13'ün `KATALOG.indexOf`
desenidir: `KURALLAR.havuz` dizisindeki sıra.

---

## 11 · Gün gerekçesi — "Neden bu gün böyle"

Gerekçe **uydurma metin değil**; puanı üreten eksenlerden türetiliyor.
Her gün için sırayla şunlar yazılıyor, yalnız gerçekten geçerli olanlar:

| Cümle | Ne zaman çıkar | Neden türetilebilir |
|---|---|---|
| "**{Kalıp}** kalıbı bu günün omurgası" | her zaman | `gun.kalip` |
| "vurgu **{kalıp}**" | `gun.vurgu` `gun.kalip`ten farklıysa | `gun.vurgu` |
| "çalışan gruplar: **{gruplar}**" | her zaman | seçilen hareketlerin gerçek birincil grupları |
| "**{hedef}** hedefi {kalıp} kalıbına ağırlık verdiriyor" | hedefin en yüksek `kalipAgirlik`ı bu günün kalıbıysa | `hedef.kalipAgirlik` |
| "**{seviye}** seviyesi: {set} × {tekrar}, {dinlenme} sn dinlenme" | her zaman | §6 tablosu |
| "⚠ elindeki havuzda **{kalıp}** kalıbında hiç hareket yok" | günün hiçbir hareketi günün kalıbında değilse | ölçülüyor, sayılıyor |
| "havuz bu kalıpta sınırlı olduğu için gün tamamlayıcı hareketlerle dolduruldu ({n}/{N})" | günün hareketlerinin yarısından azı günün kalıbındaysa | ölçülüyor, sayılıyor |
| "gün {N} harekete ölçeklendi: seviye {x} isterdi, havuzda bu kalıpta {k} hareket var" | gün sayısı seviye tabanının altına ölçeklendiyse | §7'deki üç tavan |
| "havuz **{n}** kalem olduğu için bazı hareketler haftada birden fazla geçiyor — aynı hareket aynı GÜN içinde tekrarlanmaz" | planda tekrar eden hareket varsa (`{n}` = süzülmüş havuz) | ölçülüyor, sayılıyor |
| "**{ekipman}** havuzuyla kuruldu" | her zaman | `cevap.ekipman` |

---

## 12 · Risk dalı — R13'ten devralınan koruma

`durum` sorusunda `agri` · `saglik` · `gebelik` · `hareketsiz`
yanıtlarından biri işaretliyse **kişiye özel plan üretilmez**.
Yerine uzman ve sağlık bilgilendirmesi köprüleri, bir de "okunacak"
rehber bağlantısı verilir. Bu bir teşhis değil, bir **sınır**;
R13'ün `pb-risk` dalının birebir karşılığıdır.

---

## 13 · `?plan=` — paylaşılabilirlik

Plan deterministik olduğu için **planın kendisi değil, seçimler**
kodlanıyor:

```
?plan=<cinsiyet>-<hedef>-<seviye>-<ekipman(_ ile)>-<gun>-<odak(_ ile ya da 0)>-<durum(_ ile)>
```

Örnek: `?plan=erkek-kas-orta-yok_dambil-4-sirt_omuz-yok`

- Yedi parça; hiçbir değer `-` ya da `_` içermez.
- **Bozuk / bilinmeyen değerde 404 verilmez** — sayfa 200 kalır, sihirbaz
  adım 1'e düşer, sessizce başlar. Sayfa statik HTML olduğu için sunucu
  yanıtı zaten 200'dür; motor yalnızca çöker gibi davranmaz.
- Sonuç ekranına ulaşıldığında URL `history.replaceState` ile güncellenir
  (geçmişi kirletmemek için `push` değil `replace`).

---

## 14 · Kapsam dışı bırakılanlar — gerekçeli

| Kalem | Neden alınmadı |
|---|---|
| **Yaş adımı** | Keşif §9'un kendi önerisi: brief istemiyor, zorunlu adım kullanıcıyı yorar |
| **Artan yüklenme (progressive overload)** | Keşif §9: *"Brief bunu istemiyor; v1 kapsamı dışı bırakılabilir."* Haftalık Rutin kolunun mekaniği de görülmedi |
| **Her adıma ayrı URL (`?adim=`)** | Keşif §9 öneriyordu. `?plan=` ile birlikte iki ayrı geçmiş mekanizması demekti; v1'de yalnız plan paylaşımı var |
| **"Karıştır" / tek hareketi değiştir** | Determinizm kararıyla (AS-2) doğrudan çelişiyor: aynı bağlantı farklı plan gösterirdi |
| **Aşamalı yükleme animasyonu** | Motor senkron ve anlık; sahte bekleme koymak kullanıcıyı yanıltmak olurdu |
| **Gövde haritasından kas seçimi** | Adım 4'ün `odak` sorusu grup listesiyle karşılanıyor. Haritalı çoklu seçim H2'nin sayfasının işi; H3'te tekrarı iki ayrı harita davranışı demekti |
