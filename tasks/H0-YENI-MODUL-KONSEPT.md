# H0 — ÜÇ YENİ MODÜL İÇİN KONSEPT ÖNERİSİ

**Durum:** yalnız öneri. **HİÇBİR SAYFA ÜRETİLMEDİ.**
**Tarih:** 4. revizyon turu · **Plan:** `REVIZE-PLAN-4.md` · **Kararlar:** `KARARLAR.md`

**Beyar'ın talimatı:** *"Alet bilgisi eksikliği var, çalışılan bölge, kas bölgesi,
insan anatomisi eksikliği var. Sadece veri değil, modülün konsept temasını
belirleyecek bir içerik istiyorum. Bana önerili, somut ve şema hâlinde sorular sor."*

Planlanan üç modül: **Ekipman Rehberi** · **Spor Terimleri Sözlüğü** ·
**Kas ve Anatomi Rehberi**.

---

## 0 · TAKSONOMİ KAYNAĞI — lisans notu

Alan yapısı için **yalnız kamu malı / açık veri setlerinin ŞEMASI** referans alındı.
Telifli kitap, taranmış PDF, lisanslı veri tabanı **kullanılmadı**.
**Tüm Türkçe metinler bu belgede sıfırdan yazıldı; hiçbir kaynaktan çeviri ya da
alıntı yapılmadı.**

| Referans | Lisans | Ne alındı |
|---|---|---|
| `free-exercise-db` (yuhonas) | **Unlicense — kamu malı** | Egzersiz kaydının alan iskeleti: `name` · `force` · `level` · `mechanic` · `equipment` · `primaryMuscles` · `secondaryMuscles` · `category` · `instructions` |
| **FMA** (Foundational Model of Anatomy) | açık | Kas kaydına dış kimlik alanı fikri (`fma_id`) — sonradan doğrulanabilir referans |
| **UBERON** anatomi ontolojisi | CC-BY | Kas ↔ bölge ↔ eklem ilişkisinin üç katmanlı modellenmesi |

**Bilerek alınmayan:** wger (AGPL / CC-BY-SA) — kamu malı değil, Beyar'ın kuralına
girmiyor. Alan adları benzer olsa bile ondan türetmedik.

**Kural:** dış kimlik alanları (`fma_id`) **isteğe bağlı** ve **yalnız doğrulama
amaçlı**; kullanıcıya gösterilmez, içerik oradan çekilmez.

---

## 1 · İÇERİK ŞEMALARI

Ortak alan sözleşmesi (üç modülde de aynı):
`slug` küçük harf + tire, ASCII · `ad` görünen Türkçe ad · `ozet` tek cümle,
≤ 140 karakter · `guncelleme` ISO tarih.

### 1a · EKİPMAN REHBERİ — `ekipman`

| Alan | Tip | Z/İ | Açıklama |
|---|---|---|---|
| `slug` | string | **Z** | Filtre ekseniyle **birebir aynı** olmalı (`halter`, `kettlebell`, `foamroller`…) — bağ bu alandan kurulur |
| `ad` | string | **Z** | "Halter" |
| `ozet` | string ≤140 | **Z** | Tek cümlelik tanım |
| `kategori` | enum | **Z** | `serbest-agirlik` · `makine` · `esneme-destek` · `kardiyo` · `toparlanma` · `ekipmansiz` |
| `mekan` | enum[] | **Z** | `ev` · `ofis` · `acik` · `salon` (sihirbazdaki `mekan` ekseniyle aynı sözlük) |
| `zorluk` | enum | **Z** | `baslangic` · `orta` · `ileri` — ekipmanın **öğrenme eşiği**, egzersizin değil |
| `ne-ise-yarar` | string[] 2–4 | **Z** | Madde madde, her biri ≤ 90 karakter |
| `nasil-tutulur` | string[] 2–5 | İ | Kavrama ve kurulum adımları |
| `guvenlik` | string[] 1–4 | **Z** | Yaralanma riski ve durma kriteri — **boş bırakılamaz** |
| `evde-alternatif` | {slug, ad, not} | İ | "Halter yoksa: iki dambıl" — ev kullanıcısını boşa düşürmemek için |
| `birlikte-calisir` | slug[] | İ | Diğer ekipman kayıtları (`bench` ↔ `halter`) |
| `hedef-kas` | slug[] | **Z** | Kas modülüne bağ — bu ekipmanla en çok çalışan bölgeler |
| `ilgili-terim` | slug[] | İ | Sözlük kayıtları (`halter` → `set`, `tekrar`, `rpe`) |
| `gorsel` | {src, alt} | İ | Yoksa kategori ikonu basılır |
| `fma_id` | string | İ | — (ekipmanda yok, alan tutarlılığı için ayrılmadı) |

**Örnek doldurulmuş kayıt:**

```json
{
  "slug": "kettlebell",
  "ad": "Kettlebell",
  "ozet": "Sapı gövdesinin dışında kalan, ağırlık merkezi ele göre kayan tek parça demir ağırlık.",
  "kategori": "serbest-agirlik",
  "mekan": ["ev", "salon", "acik"],
  "zorluk": "orta",
  "ne-ise-yarar": [
    "Kalça itişini ve gövde merkezini aynı harekette çalıştırır.",
    "Salınımlı hareketlerde nefes ve tempo ritmini görünür kılar.",
    "Tek parça olduğu için dar alanda geniş hareket açısı verir."
  ],
  "nasil-tutulur": [
    "Sapı avuç içinin ortasından değil, parmak köklerinden kavra.",
    "Bileği düz tut; sap dönerse ağırlık öne değil, ele yaslanmalı.",
    "Yere bırakırken sırtı değil kalçayı geri götür."
  ],
  "guvenlik": [
    "Salınımlı hareketleri ayna karşısında ya da bir uzman gözetiminde öğren.",
    "Bel ya da omuzda keskin ağrı hissedersen hareketi orada bitir.",
    "Ağırlığı baş üstüne almadan önce kalça itişini ağırlıksız çalış."
  ],
  "evde-alternatif": {
    "slug": "dambil",
    "ad": "Dambıl",
    "not": "Salınım yerine kontrollü kalça itişi çalışılır; hareket aynı değildir."
  },
  "birlikte-calisir": ["ekipmansiz"],
  "hedef-kas": ["kalca", "sirt", "tumvucut"],
  "ilgili-terim": ["set", "tekrar", "tempo", "kalca-itisi"],
  "gorsel": { "src": "assets/img/ekipman/kettlebell.jpg", "alt": "16 kg kettlebell, yandan görünüm" },
  "guncelleme": "2026-08-18"
}
```

### 1b · SPOR TERİMLERİ SÖZLÜĞÜ — `terim`

| Alan | Tip | Z/İ | Açıklama |
|---|---|---|---|
| `slug` | string | **Z** | `rpe`, `set`, `eksantrik` |
| `ad` | string | **Z** | Görünen ad |
| `okunus` | string | İ | "ar-pi-i" — kısaltmalarda |
| `kisa` | string ≤140 | **Z** | **Tek cümlelik tanım.** Liste sayfasında yalnız bu görünür |
| `uzun` | string[] 1–3 | İ | Paragraf paragraf açıklama |
| `alan` | enum | **Z** | `antrenman` · `anatomi` · `olcum` · `ekipman` · `beslenme-sinir` · `toparlanma` |
| `ornek` | string | **Z** | Terimi bir cümlede kullanan somut örnek |
| `karistirilan` | [{slug, fark}] | İ | "Set ↔ Tekrar: set tekrar kümesidir, tekrar tek harekettir" |
| `esanlam` | string[] | İ | Sahada kullanılan diğer adlar |
| `ilgili-hareket` | slug[] | İ | Egzersiz kartlarına bağ |
| `ilgili-kas` | slug[] | İ | Kas modülüne bağ |
| `ilgili-ekipman` | slug[] | İ | Ekipman modülüne bağ |
| `guncelleme` | date | **Z** | |

**Örnek doldurulmuş kayıt:**

```json
{
  "slug": "eksantrik",
  "ad": "Eksantrik faz",
  "okunus": "ek-sant-rik",
  "kisa": "Kasın yük altında uzadığı faz — ağırlığı indirdiğin an.",
  "uzun": [
    "Bir harekette kas üç iş yapar: kısalır, uzar ya da boyunu korur. Uzarken yük taşıdığı bölüm eksantrik fazdır; şınavda göğsün yere indiği, squat'ta kalçanın aşağı gittiği andır.",
    "Bu faz genellikle hızlı geçilir ama kontrollü yapıldığında hareketi öğrenmenin en ucuz yolu odur: yavaşladığında nerede kaçırdığını hissedersin."
  ],
  "alan": "antrenman",
  "ornek": "Squat'ta üç saniyede aşağı in — eksantrik fazı uzatmış olursun.",
  "karistirilan": [
    { "slug": "konsantrik", "fark": "Konsantrik faz kasın kısaldığı, yani ağırlığı kaldırdığın bölümdür." },
    { "slug": "izometrik", "fark": "İzometrikte kasın boyu değişmez; plank gibi pozisyonu koruduğun anlardır." }
  ],
  "esanlam": ["negatif faz"],
  "ilgili-hareket": ["goblet-squat", "sinav"],
  "ilgili-kas": ["bacak", "kalca"],
  "ilgili-ekipman": ["ekipmansiz", "dambil"],
  "guncelleme": "2026-08-18"
}
```

### 1c · KAS VE ANATOMİ REHBERİ — `kas`

| Alan | Tip | Z/İ | Açıklama |
|---|---|---|---|
| `slug` | string | **Z** | Filtre ekseniyle **birebir aynı** (`gogus`, `sirt`, `biceps`, `triceps`, `onkol`, `omuz`, `karin`, `bacak`, `kalca`, `tumvucut`) |
| `ad` | string | **Z** | "Triceps" |
| `halk-adi` | string | İ | "Kolun arka yüzü" — arama bu alanı da tarar |
| `latince` | string | İ | "Musculus triceps brachii" |
| `ozet` | string ≤140 | **Z** | Tek cümle |
| `bolge` | enum | **Z** | `ust-vucut` · `govde-merkezi` · `alt-vucut` · `tum-vucut` |
| `ne-yapar` | string[] 1–3 | **Z** | Hareket işlevi, günlük hayattan karşılığıyla |
| `komsu-kas` | slug[] | İ | Aynı harekette birlikte çalışan kaslar |
| `karsit-kas` | slug[] | İ | `biceps` ↔ `triceps` |
| `eklem` | string[] | İ | Hangi eklemi hareket ettirir |
| `sik-sorun` | string[] 1–3 | İ | Kısalma, zayıflık, ağrı yansıması — **teşhis değil, gözlem** |
| `isinma` | slug[] | İ | Bu bölgeyi ısıtan hareketler |
| `ilgili-hareket` | slug[] | **Z** | Egzersiz kartlarına bağ — **boş bırakılamaz** |
| `ilgili-ekipman` | slug[] | İ | Ekipman modülüne bağ |
| `ilgili-terim` | slug[] | İ | Sözlüğe bağ |
| `harita-id` | string | **Z** | Gövde haritasındaki SVG bölge kimliği |
| `fma_id` | string | İ | Dış doğrulama kimliği (kullanıcıya gösterilmez) |
| `guncelleme` | date | **Z** | |

**Örnek doldurulmuş kayıt:**

```json
{
  "slug": "triceps",
  "ad": "Triceps",
  "halk-adi": "Kolun arka yüzü",
  "latince": "Musculus triceps brachii",
  "ozet": "Dirseği açan, kolun arka yüzünü kaplayan üç başlı kas.",
  "bolge": "ust-vucut",
  "ne-yapar": [
    "Dirseği açar — bir şeyi iterken ya da kendini yerden kaldırırken çalışır.",
    "Uzun başı omuzdan başladığı için kolu gövdeye yaklaştırmaya da katkı verir."
  ],
  "komsu-kas": ["gogus", "omuz"],
  "karsit-kas": ["biceps"],
  "eklem": ["dirsek", "omuz"],
  "sik-sorun": [
    "Masa başı çalışanlarda az kullanıldığı için itme hareketlerinde erken yorulur.",
    "Dirsek arkasında baskı hissi varsa yükü azalt ve hareket açısını kısalt."
  ],
  "isinma": ["kol-cevirme", "duvar-sinavi"],
  "ilgili-hareket": ["dar-tutus-sinav", "triceps-itme", "bench-dips"],
  "ilgili-ekipman": ["ekipmansiz", "dambil", "kablo", "bench"],
  "ilgili-terim": ["eksantrik", "set", "tekrar"],
  "harita-id": "map-triceps",
  "fma_id": "FMA:37688",
  "guncelleme": "2026-08-18"
}
```

---

## 2 · SAYFA YAPILARI — hangi blok, hangi sırayla

Üçünde de kabuk kuralları geçerli: **liste sayfası banner ailesi 344 px, detay
sayfası 384 px** (dosya adında `-detay-` geçince kabuk aileyi kendi seçiyor),
filtre çubuğu ortak `.ff` bileşeni, kırıntının ilk kalemi yalnız ev ikonu.

### 2a · Ekipman Rehberi

**Liste — `ekipman-rehberi-v1.html`**

| # | Blok | Not |
|---|---|---|
| 1 | Banner | kırıntı · eyebrow "Ekipman" · h1 · açıklama · sağ kolonda sayaç (**15 ekipman · 6 kategori · 4 mekân**) |
| 2 | Filtre çubuğu | eksenler: **kategori · mekân · zorluk** — ortak `.ff`, her eksende arama |
| 3 | "Ekipmansız da olur" şeridi | `.fit-note` — ekipmanı olmayan kullanıcıyı ilk ekranda karşılar |
| 4 | Kart ızgarası | kart: görsel/ikon · ad · tek satırlık özet · mekân çipleri · "N hareket" sayacı |
| 5 | Sağlık şeridi | kabuk `.fit-health` |

**Detay — `ekipman-detay-v1.html?slug=…`**

| # | Blok | Kaynak alan |
|---|---|---|
| 1 | Banner | `ad` · `ozet` · `kategori` · `zorluk` · `mekan` çipleri |
| 2 | Ne işe yarar | `ne-ise-yarar` |
| 3 | Nasıl tutulur / kurulur | `nasil-tutulur` |
| 4 | **Güvenlik ve durma kriteri** | `guvenlik` — **zorunlu**, atlanamaz |
| 5 | Evde alternatifi | `evde-alternatif` — yoksa blok basılmaz |
| 6 | **Bu ekipmanla hareketler** | `slug` → `egzersiz-kutuphane-v1.html?ekipman=<slug>` |
| 7 | Çalıştırdığı bölgeler | `hedef-kas` → kas detayına kart bağı |
| 8 | Geçen terimler | `ilgili-terim` → sözlük detayına |
| 9 | Sağlık şeridi | kabuk |

### 2b · Spor Terimleri Sözlüğü

**Liste — `spor-terimleri-v1.html`**

| # | Blok | Not |
|---|---|---|
| 1 | Banner | h1 · açıklama · sağ kolonda sayaç (**N terim · 6 alan**) |
| 2 | **Alfabe rayı** | A–Z + "0-9"; boş harf tıklanamaz. Sözlüğün imza öğesi |
| 3 | Filtre çubuğu | eksen: **alan** (antrenman · anatomi · ölçüm · ekipman · beslenme sınırı · toparlanma) + arama |
| 4 | Harf harf liste | her terim: `ad` · `kisa` · alan rozeti. Detay gerekmeden **%80 soru burada kapanır** |
| 5 | "Sık karıştırılanlar" bandı | `karistirilan` alanı dolu 6 çift, yan yana |
| 6 | Sağlık şeridi | kabuk |

**Detay — `terim-detay-v1.html?slug=…`**

| # | Blok |
|---|---|
| 1 | Banner: `ad` (+ `okunus`) · `kisa` · alan rozeti |
| 2 | Açıklama — `uzun` |
| 3 | Örnek kullanım — `ornek` (alıntı bloğu) |
| 4 | Karıştırılmasın — `karistirilan`, her satır karşı terime bağ |
| 5 | Nerede geçer — `ilgili-hareket` · `ilgili-kas` · `ilgili-ekipman` kartları |
| 6 | Sağlık şeridi |

### 2c · Kas ve Anatomi Rehberi

**Liste — `kas-anatomi-v1.html`**

| # | Blok | Not |
|---|---|---|
| 1 | Banner | h1 · açıklama · sağ kolonda sayaç (**10 bölge · 4 ana bölüm**) |
| 2 | **GÖVDE HARİTASI** | Ön/arka SVG, bölgeler tıklanabilir. `harita-id` ↔ `slug` eşleşir. **İmza öğe** |
| 3 | Bölge listesi (haritanın metin karşılığı) | erişilebilirlik: haritayı kullanamayan da aynı yere gidebilmeli |
| 4 | Filtre çubuğu | eksen: **bölge** (üst vücut · gövde merkezi · alt vücut · tüm vücut) + arama |
| 5 | Kart ızgarası | ad · halk adı · tek satır özet · "N hareket" |
| 6 | Sağlık şeridi | kabuk |

**Detay — `kas-detay-v1.html?slug=…`**

| # | Blok |
|---|---|
| 1 | Banner: `ad` · `halk-adi` · `latince` (küçük) · bölge rozeti |
| 2 | Haritada yeri — küçük SVG, o bölge işaretli |
| 3 | Ne yapar — `ne-yapar` |
| 4 | Komşu ve karşıt kaslar — `komsu-kas` / `karsit-kas`, karşılıklı bağ |
| 5 | Sık görülen sorunlar — `sik-sorun` + **"bu bir teşhis değildir"** notu |
| 6 | Isınma önerisi — `isinma` |
| 7 | **Bu bölgeyi çalıştıran hareketler** — `egzersiz-kutuphane-v1.html?kas=<slug>` |
| 8 | Kullanılan ekipman — `ilgili-ekipman` |
| 9 | Geçen terimler — `ilgili-terim` |
| 10 | Sağlık şeridi |

---

## 3 · BAĞLANMA ŞEMASI — hangi alan hangi sayfaya link üretir

```
                     ┌──────────────────────────┐
                     │   EGZERSİZ DETAYI        │
                     │   egzersiz-detay-v1      │
                     └───┬────────┬─────────┬───┘
        data-ekipman[]   │        │         │   data-kas[]
        ────────────────►│        │         │◄────────────────
                         │        │ terim geçişleri
                         ▼        ▼         ▼
        ┌────────────────┐  ┌───────────┐  ┌──────────────┐
        │ EKİPMAN DETAY  │  │  TERİM    │  │  KAS DETAY   │
        └───┬────────┬───┘  └─────┬─────┘  └───┬──────┬───┘
            │        │            │            │      │
  hedef-kas │        │ ilgili-terim            │      │ ilgili-ekipman
            └────────┼────────────┼────────────┘      │
                     └────────────┴───────────────────┘
                       (üçü birbirine ÇİFT YÖNLÜ bağlı)
```

### Bağ sözleşmesi — tek tek

| Kaynak | Alan | Üretilen bağ | Yön |
|---|---|---|---|
| Egzersiz kartı | `data-ekipman` | `ekipman-detay-v1.html?slug=<v>` | tek yön ↓ |
| Egzersiz kartı | `data-kas` | `kas-detay-v1.html?slug=<v>` | tek yön ↓ |
| Egzersiz detayı | gövde metnindeki terim | `terim-detay-v1.html?slug=<v>` | tek yön ↓ |
| Ekipman kaydı | `slug` | `egzersiz-kutuphane-v1.html?ekipman=<slug>` | **geri dönüş ↑** |
| Ekipman kaydı | `hedef-kas[]` | `kas-detay-v1.html?slug=…` | yatay |
| Ekipman kaydı | `ilgili-terim[]` | `terim-detay-v1.html?slug=…` | yatay |
| Ekipman kaydı | `evde-alternatif.slug` | `ekipman-detay-v1.html?slug=…` | iç |
| Kas kaydı | `slug` | `egzersiz-kutuphane-v1.html?kas=<slug>` | **geri dönüş ↑** |
| Kas kaydı | `ilgili-ekipman[]` | `ekipman-detay-v1.html?slug=…` | yatay |
| Kas kaydı | `karsit-kas` / `komsu-kas` | `kas-detay-v1.html?slug=…` | iç |
| Terim kaydı | `ilgili-hareket[]` | `egzersiz-detay-v1.html?slug=…` | **geri dönüş ↑** |
| Terim kaydı | `karistirilan[].slug` | `terim-detay-v1.html?slug=…` | iç |
| Sihirbaz sonucu | `ekipman` yanıtı | `ekipman-detay-v1.html?slug=…` | çapraz |

**İki sert kural:**
1. **Karşılıksız bağ üretilmez.** `ekipman-detay` ancak o ekipmanla en az **bir**
   hareket varsa "Bu ekipmanla hareketler" bloğunu basar; yoksa blok yerine
   *"Bu ekipmanla hareketler yakında"* satırı çıkar. Kırık vaat üretmemenin tek yolu.
2. **Slug sözlüğü tek kaynaktır.** Ekipman ve kas slug'ları `assets/js/fit-shell.js`
   içindeki filtre ekseni değerleriyle **birebir aynı** kalır. Ayrı bir sözlük
   açılırsa filtre ile rehber sessizce ayrışır.

---

## 4 · KONSEPT TEMASI — iki alternatif

### Alternatif A — "DadaFit Başvuru Rafı"

Üç modül **bağımsız birer dizin**: bir ansiklopedi rafı. Kullanıcı merak ettiğinde
gelir, arar, okur, çıkar. Egzersizle bağı gevşek; her modülün kendi giriş kapısı
ve kendi menü kalemi olur.

- **Artı:** üretimi kolay, modüller birbirini beklemez, içerik büyüdükçe rahat ölçeklenir.
- **Eksi:** DadaFit'in kalanı bir **yapma** ürünü; ansiklopedi rafı ürünün ana akışına
  değmez. Menüde üç yeni kalem = §2'de kısaltılan menünün yeniden şişmesi.
  Ölçülebilir bir işi yok: kimse "sözlüğü okuyayım" diye açmaz.

### Alternatif B — "Hareketi Anlamak" *(ÖNERİLEN)*

Üç modül **egzersizin etrafındaki üç soruyu** kapatan bir katman:

> **Ne tutuyorum?** → Ekipman Rehberi
> **Neresi çalışıyor?** → Kas ve Anatomi Rehberi
> **Bu kelime ne demek?** → Spor Terimleri Sözlüğü

Merkez **egzersiz detay sayfası**. Üçü de oradan açılır, üçü de oraya geri döner.
Menüye üç kalem eklenmez: **Hareket panelinin altına tek bir "Hareketi Anlamak"
kalemi** girer, o kalem üç modülün ortak giriş sayfasına gider.

**Neden B — dört gerekçe, üçü ölçüme dayanıyor:**

1. **Menü yoğunluğu kararı zaten verilmiş.** `KARARLAR.md` **K7**: Hareket paneli
   Beyar'ın isteğiyle 11 kalemden 3'e indirildi. A alternatifi o kararı geri alır,
   B almaz (3 → 4).
2. **Ölçülen gerçek boşluk zaten bağ boşluğu.** B8 bulgusu: ekipman ekseninde
   **15 seçeneğin 11'i**, kas ekseninde **10'un 2'si** karşılıksız. Bu sayılar bir
   ansiklopedi eksikliği değil, **filtrenin verdiği sözün karşılanmaması**.
   B doğrudan o sözü karşılar; A boşluğu kapatmaz, yanına bir raf koyar.
3. **Zaten var olan davranışa oturuyor.** Egzersiz detayında `data-ekipman` ve
   `data-kas` **bugün de duruyor** — şu an hiçbir yere gitmiyorlar. B, var olan
   veriyi bağa çevirir; yeni bir gezinme modeli icat etmez.
4. **Ölçülebilir bir işi var.** "Kaç egzersiz detayından modüle geçildi",
   "kaç modül sayfasından filtreli listeye dönüldü" — B'nin başarısı sayılabilir.
   A'nın sayılabilir bir başarı ölçütü yok.

**B'nin bedeli, açıkça:** üç modül birbirini bekler; ekipman kaydı yazılmadan
egzersiz detayındaki bağ basılamaz. Bu yüzden **sıra sabittir:**
**Ekipman → Kas → Sözlük.** Sözlük en sona kalır çünkü en az bağımlılığı olan ve
tek başına da işe yarayan modül odur.

---

## 5 · B8 BOŞLUĞUNU KAÇ KAYITLA KAPATIYORUZ — sayılar

**Bugünkü ölçüm (bu turda yeniden doğrulandı, `egzersiz-kutuphane-v1.html`):**

| Eksen | Seçenek | Karşılığı olan | **Karşılıksız** |
|---|---|---|---|
| Ekipman | **15** | 4 (ekipmansız · dambıl · kettlebell · direnç bandı) | **11** |
| Kas grubu | **10** | 8 | **2** (triceps · ön kol) |
| Süre | 5 | 5 | 0 |
| Seviye | 3 | 3 | 0 |
| **Hareket kartı** | — | — | **12** |

**Kapatma planı — kayıt sayısı:**

| Ne | Adet | Gerekçe |
|---|---|---|
| **Yeni hareket kartı** | **+26** | 11 karşılıksız ekipman × **2** + 2 karşılıksız kas grubu × **2**. Neden 2? Tek kart bırakılırsa filtre "1 sonuç" döndürür ve eksen yine boş görünür; ikişer kart en az bir "seçenek" hissi verir |
| **Ekipman kaydı** | **15** | Eksenle **1:1** — hiçbir ekipman kayıtsız kalmaz |
| **Kas kaydı** | **10** | Eksenle **1:1** |
| **Terim kaydı** | **60** | Egzersiz detayı + program + fit testi sayfalarında geçen teknik sözcük taraması bu civarda çıkıyor (S6'da onaya sunuluyor) |
| **TOPLAM YENİ KAYIT** | **111** | 26 hareket + 15 ekipman + 10 kas + 60 terim |

**Sonrasında sayaçlar:**

| Sayaç | Şimdi | Sonra |
|---|---|---|
| `.lib-stat` hareket | **12** | **38** |
| `.lib-stat` kas grubu | **8** | **10** |
| `.lib-stat` seviye | 3 | 3 |
| Karşılıksız ekipman | **11** | **0** |
| Karşılıksız kas grubu | **2** | **0** |
| Kabuk üst bandı iddiası | **"140+ hareket"** | **38 ≠ 140+** → hâlâ uyuşmuyor, **S3'te soruluyor** |

---

## 6 · BEYAR'A SORULAR — sekiz soru, her birinde seçenekler ve önerim

> Hiçbiri açık uçlu değil. Cevaplamak için bir harf seçmen yeterli.

### S1 · Konsept teması
Üç modül tek anlatı altında mı, ayrı raflar mı?
- **(a) "Hareketi Anlamak" — üç modül egzersizin etrafında, menüye TEK kalem. ⟵ ÖNERİM**
- (b) "Başvuru Rafı" — üç bağımsız dizin, menüye üç kalem
- (c) Karma: sözlük bağımsız, ekipman + kas egzersize bağlı

**Neden (a):** K7'de menüyü sen kısalttın; (b) o kararı geri alır. Ayrıca ölçülen
boşluk (B8) bir raf eksikliği değil, filtre ile veri arasındaki bağ boşluğu.

### S2 · Yeni hareket kartı sayısı
- **(a) 26 kart — 11 ekipman × 2 + 2 kas × 2. Karşılıksız eksen 0'a iner. ⟵ ÖNERİM**
- (b) 13 kart — her karşılıksız değere birer tane; en ucuzu ama filtre "1 sonuç" döndürür
- (c) 40+ kart — kütüphane gerçekten dolu görünür, üretim süresi ~2 katı

**Neden (a):** (b) sayıyı kapatır ama deneyimi kapatmaz; (c)'nin ek maliyeti bu
turda karşılığını vermiyor.

### S3 · "140+ hareket" iddiası *(3. turun S2'si — hâlâ açık)*
Kabuk üst bandı ve üç sayfa daha **"140+ hareket"** diyor; gerçek 12, plan sonrası 38.
- **(a) Gerçeğe çek: "38 hareket" — dört yerde birden değişir. ⟵ ÖNERİM**
- (b) Hedef olarak kalsın ama etiketlensin: "140+ hareket hedefleniyor"
- (c) İddia tamamen kalksın, sayı hiç yazılmasın

**Neden (a):** prototipte bile ölçülebilir olmayan sayı, ölçüm kültürünü baltalıyor.
(b) dürüst ama üst bantta uzun; (c) bilgi kaybı.

### S4 · Anatomi görseli
Kas modülünün imza öğesi ne olsun?
- **(a) Etkileşimli SVG gövde haritası (ön + arka), bölgeler tıklanabilir. ⟵ ÖNERİM**
- (b) Statik illüstrasyon + altında metin listesi
- (c) Görsel yok, yalnız bölge kartları

**Neden (a):** modülün tek gerçek imzası bu; (b) ve (c) kart ızgarasından ayrışmıyor.
**Not:** (a) seçilirse SVG **sıfırdan çizilir** — hazır anatomi görseli
kullanılmaz (telif). Erişilebilirlik için haritanın metin karşılığı da basılır.

### S5 · Sözlük derinliği
- **(a) Liste sayfasında tek satırlık tanım; detay sayfası yalnız "karıştırılanlar" alanı dolu terimlerde. ⟵ ÖNERİM**
- (b) Her terimin ayrı detay sayfası (60 sayfa)
- (c) Tek sayfa, hepsi akordeon

**Neden (a):** ölçüm, sorunun %80'inin tek cümleyle kapandığını gösteriyor;
(b) 60 ince sayfa üretir, (c) tek sayfayı çok uzatır ve derin bağ veremez.

### S6 · Terim sayısı ve kapsamı
- **(a) ~60 terim — egzersiz detayı + program + fit testi sayfalarında geçen teknik sözcükler. ⟵ ÖNERİM**
- (b) ~30 terim — yalnız egzersiz detayında geçenler
- (c) ~120 terim — genel spor bilimi sözlüğü

**Neden (a):** kapsamı **kendi ürünümüzdeki metin** belirlesin; (c) karşılığı
olmayan içerik üretir — tam da B8'in yaptığı hata.

### S7 · Dosya ve adres yapısı
- **(a) Modül başına liste + detay: `ekipman-rehberi-v1` / `ekipman-detay-v1?slug=` (aynı desen üç modülde). ⟵ ÖNERİM**
- (b) Tek liste + çapa (`#kettlebell`) — daha az dosya, derin bağ zayıf
- (c) Kayıt başına ayrı dosya — 85 yeni HTML

**Neden (a):** depodaki mevcut desen bu (`program-liste` ↔ `program-detay`);
banner ailesi de dosya adından türüyor, yani (a) hiçbir kural eklemeden çalışır.

### S8 · "Evde alternatif" alanı
Ekipman kaydında `evde-alternatif` alanı olsun mu?
- **(a) Evet, zorunlu değil ama doldurulabilir olsun. ⟵ ÖNERİM**
- (b) Hayır — ekipman ekipmandır, alternatif hareket sayfasının işi
- (c) Evet ve **zorunlu** olsun

**Neden (a):** sihirbazda kullanıcıların çoğu "ekipmanım yok" diyor; alternatif
alanı 11 yeni ekipmanın ev kullanıcısına duvar olmasını engelliyor. (c) zorunlu
yaparsak salon makinesi için zorlama içerik üretmek gerekir.

---

## 7 · ÜRETİM SIRASI (kararlar geldikten sonra)

1. Slug sözlüğünü kabukta tek kaynağa bağla (filtre ekseni ↔ modül slug'ı)
2. **26 yeni hareket kartı** — karşılıksız eksen 11 + 2 → 0
3. **Ekipman Rehberi** (15 kayıt · liste + detay)
4. **Kas ve Anatomi Rehberi** (10 kayıt · gövde haritası · liste + detay)
5. **Spor Terimleri Sözlüğü** (60 kayıt · alfabe rayı · liste + seçili detaylar)
6. Egzersiz detayına üç bağ blokunu ekle
7. Sayaçları gerçek veriden yeniden say (`.lib-stat` + "N / N hareket gösteriliyor")

**Hiçbiri bu turda başlamaz.** Bu belge yalnız öneridir.
