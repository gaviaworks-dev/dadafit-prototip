# DadaFit · 5. Revizyon Turu

**Depo:** `dadafit-prototip` · **Canlı:** `gaviaworks-dev.github.io/dadafit-prototip`
**Referans marka:** `dadadiet.com` (banner, breadcrumb, wizard yapısı bu siteden alınacak)

> Bu dosya 4. turun kapanış raporundan sonra sözlü olarak verilen revizyonların yazıya dökülmüş hâlidir.
> Numaralandırma 4. turdan devam ediyor (R1–R10 kullanıldı → bu tur **R11–R15**, yeni modüller **H1–H3**).

---

## 0 · Girdi durumu — başlamadan önce oku

| Girdi | Durum |
|---|---|
| **Anatomi PDF'i** | ✅ **Yol verildi:** `/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf` — Claude Code bu dosyayı yerelden okuyacak |
| `musclewiki.com/tr-tr` | ✅ Etkileşim deseni referansı — **Playwright ile taranacak** (bkz. H2/H3 keşif protokolü) |
| `dadagastro.com/mutfak-sozlugu` | ✅ Sözlük yapısı referansı |
| `dadadiet.com/beslenme` + `/diyetisyen-bul` | ✅ Banner + sihirbaz referansı |

**PDF'ten çıkarılacaklar:**
```bash
# içerik envanteri
pdfinfo "/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf"
pdftotext -layout "…/Muscle.pdf" muscle.txt      # kas adları, Latince karşılıklar, fonksiyon metinleri
pdfimages -list "…/Muscle.pdf"                    # gömülü görsel envanteri
pdftoppm -jpeg -r 150 "…/Muscle.pdf" sayfa        # görsel inceleme için sayfa rasterleri
```
Sayfa rasterleri **gözle incelenecek** — anatomi çizimlerinin bölge sınırlarını, katman ayrımını (yüzeysel/derin) ve ön/arka görünüm düzenini oradan çıkar. Bu, sıfırdan çizilecek SVG'nin şablonu olacak.

**Telif sınırı — tek kural:** PDF'in **verisi** (kas adları, Latince karşılıklar, köken/yapışma, fonksiyon bilgisi) kullanılacak. MuscleWiki'nin görselleri, videoları ve açıklama metinleri **kopyalanmayacak**; oradan alınan yalnızca etkileşim ve adım deseni. SVG DadaFit'in kendi çizimi olacak.

---

## 1 · Revizyon maddeleri

### R11 · Footer üstündeki "perde" footer'dan kopuyor
**Sayfa:** site geneli (kabuk)
**Sorun:** Footer'ın hemen üstündeki perde/geçiş katmanı DadaFit'te fazla yukarı çıkıyor ve footer'dan kopuk duruyor. Diğer markalarda (DadaDiet / Gastro / Gurme) perde footer'a yapışık.
**Yapılacak:** Perdenin offset/`margin-bottom`/`translate` değeri diğer markalardaki değerle eşitlensin. Kabuk seviyesinde tek yerden çözülsün, sayfa sayfa yamalanmasın.
**Kabul ölçütü:** Perde alt kenarı ile footer üst kenarı arasındaki boşluk **60 sayfada tek değer** ve bu değer referans markadakiyle aynı. @1440 ve @390 ayrı ölçülecek.

---

### R12 · Breadcrumb'daki ana sayfa ikonu çok büyük
**Sayfa:** site geneli — örnek: `hareket-merkezi-v1.html`
**Referans:** `dadadiet.com` breadcrumb'ı (daha minimal ve compact)
**Sorun:** DadaFit'in `crumb-home` ikonu referansa göre iri; kırıntı satırının ritmini bozuyor.
**Yapılacak:** İkon boyutu, optik ağırlığı ve ikon–ayraç boşluğu DadaDiet ile eşitlensin. `.sr-only` erişilebilir ad korunacak.
**Kabul ölçütü:** Kırıntısı olan **59 sayfada** ikon kutusu tek değer; ikon yüksekliği ≤ satır yüksekliği; metin düğümü 0 (4. turdaki R3 garantisi bozulmayacak).
**Not:** `dadafit-hub`'ın ilk kalemi "Dada Gastro" — 4. turda bilerek bırakılmıştı, dokunulmayacak.

---

### R13 · "Programını Bul" sihirbazı kendi sayfası olsun (pop-up kalksın)
**Şu an:** Programlar dropdown'ının altındaki "Programını Bul" tıklanınca **pop-up / overlay** açılıyor.
**İstenen:** Pop-up tamamen kalksın; sihirbaz **kendi tam sayfası** olsun.
**Referans:** `https://dadadiet.com/diyetisyen-bul` — birebir bu kurgu DadaFit'e uyarlanacak.

Referansın iskeleti (canlıdan alındı):

```
breadcrumb:  Ana Sayfa › Programlar › Programını Bul
eyebrow:     "Sana Uygun Programı Bul"
h1:          "Birkaç soruyla sana uygun programa ulaş"
alt metin:   1 cümle
güven şeridi: 3 kalem (örn. "Uzman onaylı" · "Evde veya salonda" · "30 saniyeden kısa")
adım rayı:   1 Hedefin · 2 Ortam · 3 Tercih   (numaralı, aktif adım işaretli)
soru bloğu:  başlık + alt açıklama + seçenek kartları (her kart: kalın etiket + tek satır açıklama)
alt bar:     "Adım 1 / 3"  +  Geri / İleri
sonuç:       "Sana uygun 3 program" + kart listesi
alt aksiyon: "Tüm programları gör"  ·  "Baştan başla"
yasal şerit: sorumluluk reddi (fit sürümü: sağlık/egzersiz uyarısı)
```

**Yapılacak:**
- Yeni sayfa: `programini-bul-v1.html` (adlandırma S7 sorusuna bağlı — aşağıya bak)
- Menüdeki ve tüm dahili bağlantılar bu sayfaya gitsin; overlay tetikleyicileri ve JS'i silinsin
- Sonuçlar gerçek program kartlarına bağlansın (kırık slug bırakılmayacak)
- Sayfa banner'ı **liste ailesi** ölçüsünde olacak (R15)

**Kabul ölçütü:** Sayfa HTTP 200 · pop-up düğümü 0 · `role="dialog"`/`aria-modal` yok · 3 adım ileri-geri çalışıyor · sonuç kartları 3/3 doğru programa gidiyor · "Baştan başla" adımı 1'e döndürüyor.

---

### R14 · Fit testi cevap mantığı bozuk
**Sayfa:** `fit-testi-detay-v1.html?test=baslangic-seviyesi` (ve diğer tüm test slug'ları)
**Sorun:** Bir seçenek tıklandığında yanlış olduğu gösteriliyor, ama **diğer seçenekler hâlâ tıklanabiliyor**. Yani kullanıcı yanlışı gördükten sonra doğruyu da tıklayıp puanını değiştirebiliyor.
**Yapılacak (beklenen davranış):**
1. İlk tıklama cevabı **kilitler** — sonraki tıklamalar puanı değiştirmez
2. Seçilen şık işaretlenir; yanlışsa doğru şık da ayrıca gösterilir
3. Cevap sonrası tüm şıklar `disabled` + `aria-disabled="true"`, odak sırasından çıkar
4. Sonraki soruya geçiş tek yönlü; geri dönüp cevap değiştirilemez
5. "Testi baştan çöz" ile tüm durum sıfırlanır

**Kabul ölçütü:** Her test slug'ında — bir şıkka tıklandıktan sonra ikinci tıklamada puan değişimi **0**; kilitli şık sayısı = toplam şık sayısı; final puan = ilk seçimlerin toplamı.
**Ayrıca:** Tüm test slug'ları taranacak, bu tek sayfaya özel değil.

---

### R15 · Banner standardı — site genelinde tek kural
Bu turun **en kapsamlı maddesi**. 4. turdaki açık soru **S5 bu maddeyle kapanıyor**: imza banner'ları kalkıyor, her banner iki aileden birine giriyor.

**Sorunlu örnekler:** `fit-testleri-v1.html` ↔ `video-seanslari-v1.html` (birbiriyle tutarsız) · `antrenorler-v1.html`
**Referans:** `https://dadadiet.com/beslenme` (liste) + ekli ekran görüntüsü (detay)

#### 15.1 · İki aile, iki sabit yükseklik — **değer DadaDiet'ten ölçülecek**
**Karar:** Sayı uydurulmayacak. Referans canlıdan ölçülüp birebir alınacak.

**Ölçüm protokolü:**
1. `https://dadadiet.com/beslenme` → **liste ailesi** referansı
2. `https://dadadiet.com/beslenme-rehberi/dengeli-tabak` → **detay ailesi** referansı
3. Her ikisi **@1440 ve @390**'da ayrı ölçülecek. Ölçülecekler:
   - banner kabuğunun toplam yüksekliği (`getBoundingClientRect().height`)
   - üst/alt iç dolgu
   - breadcrumb → eyebrow → H1 → alt metin → stat şeridi → CTA arası dikey boşluklar
   - H1 `font-size` / `line-height`, eyebrow `font-size` / `letter-spacing`
4. Çıkan değerler token'a yazılacak: `--banner-h-liste`, `--banner-h-detay` (@1440 ve @390 için ayrı)
5. DadaFit'teki 60 sayfa bu iki token'a bağlanacak

İçerik uzunluğu banner yüksekliğini değiştirmeyecek — uzun başlıklar taşarsa **tipografi küçülür**, kutu büyümez.

> Mevcut DadaFit değerleri (liste 344 · detay 384) referanstan dar olduğu için **atılacak**, korunmayacak.

#### 15.2 · İç düzen — referanstan çıkarılan kural
```
breadcrumb
eyebrow        (küçük, harf aralıklı, ikonlu etiket)
H1             (2 satırı geçmeyecek)
alt metin      (1–2 satır)
istatistik şeridi   ("311 besin değeri · 8 rehber kategorisi · Diyetisyen desteği" muadili)
CTA butonları  ← H1 ile AYNI SOL HİZADA, istatistik şeridinin ALTINDA
```

**Yasaklar (şu an ihlal edilenler):**
- ❌ Butonlar sağ üstte / H1 hizasından kopuk
- ❌ Dikeyde ezik, dar banner
- ❌ Aile içinde sayfadan sayfaya değişen yükseklik
- ❌ Banner içinde kırpılan öğe (4. turdaki 75.2 px kırpılma tekrar etmeyecek)

#### 15.3 · Kalkacak imza banner'ları (6 sayfa)
`dadafit-hub` 900 · `challenge-v1` 697.1 · `dadafit-kopru` 613.6 · `antrenor-ol` 602.2 · `program-detay` 570.4 · `antrenor-detay` 477.2
→ Hepsi ilgili aileye çekilecek. `antrenor-detay`'daki randevu kartı, sabit yüksekliğe sığacak şekilde **yeniden düzenlenecek** (kart banner'dan çıkarılıp altına alınabilir).

#### 15.4 · Sayfa içi bölüm başlıkları
`video-seanslari-v1.html`'deki **"Seans Kütüphanesi"** başlığı mevcut hâliyle kalmayacak.
→ Sayfa içi bölüm başlıkları için tek bir tipografi kuralı tanımlanacak (eyebrow + H2 + alt metin), banner başlığıyla karışmayacak.
*(Tam olarak neyin rahatsız ettiği netleşmeli — **S-C**'ye bak.)*

**Kabul ölçütü:** Liste ailesi **tek değer**, detay ailesi **tek değer**, üçüncü değer **0**. Banner içi kırpılan öğe 0. CTA sol kenarı = H1 sol kenarı, tüm banner'larda. @1440 ve @390 ayrı ölçülecek.

---

## 2 · Yeni modüller

### H1 · Spor Sözlüğü
**Referans:** `https://dadagastro.com/mutfak-sozlugu` — yapı birebir oradan alınacak, içerik sıfırdan.

#### Referanstan çıkarılan iskelet (canlıdan okundu)
```
banner        eyebrow "Mutfak Sırları" → H1 → alt metin
              stat şeridi: 765 Terim · A–Z Harf dizini · 20 Kategori
filtre çubuğu Tümü | A B C Ç D E … (harf rayı)  +  kategori seçici (20 kalem)
sayaç         "765 terim gösteriliyor · toplam 765 terim"
terim kartı   [harf rozeti] Terim · orijinal/yabancı karşılık · [kategori etiketi]
              tanım (2-3 cümle, düz anlatım)
              örnek kullanım cümlesi (tırnak içinde, emir kipi)
              çapraz köprü: "İlgili tarif: …"  ·  "Püfü: …"
detay         her terim kendi adresinde: /mutfak-sozlugu/{slug}
```

#### DadaFit karşılığı
| Gastro | DadaFit |
|---|---|
| `/mutfak-sozlugu` | `/spor-sozlugu-v1.html` |
| `/mutfak-sozlugu/{slug}` | `/spor-sozlugu-detay-v1.html?slug=` |
| "İlgili tarif: …" | **"İlgili hareket: …"** → egzersiz kütüphanesi |
| "Püfü: …" | **"İlgili kas: …"** → H2 anatomi modülü |
| orijinal/yabancı karşılık | İngilizce karşılık (`rep` / `tekrar`) |

**Kapsam kararı:** Ağırlık **fit alanında** — CrossFit, koşu, kuvvet, kondisyon. Egzersiz kütüphanesindeki teknik terimler de bu sözlüğe köprülenecek (ilk geçtiği yerde terim linki).

**Terim sayısı — v1 hedefi ~180.** Gastro 765'te; fit alanı daha dar olduğu için 180 gerçekçi bir ilk sürüm ve her kategoriye ≥8 terim düşürüyor. Az gelirse ikinci turda genişletilir.

**Kapsam — terim aileleri:**
| Aile | Örnek |
|---|---|
| Hareket ve teknik | rep, set, tempo, ROM, eksantrik, konsantrik, izometrik, süperset, drop set, RPE, 1RM |
| Ekipman | barbell, dumbbell, kettlebell, TRX, halka, kutu, direnç bandı, smith |
| Kas grupları ve anatomi | kısa tanımlar — H2 modülüne köprü kuracak |
| Antrenman kültürü / metodoloji | CrossFit (WOD, AMRAP, EMOM, Metcon), HIIT, periyodizasyon, deload, PR, taper |
| Kondisyon ve fizyoloji | VO2max, laktik eşik, aerobik/anaerobik, DOMS, toparlanma, süperkompanzasyon |
| Dövüş sanatları | guard, clinch, takedown, sweep, submission, kimura, jab/cross/hook, kata, kumite, tatami |
| Koşu / dayanıklılık | split, negatif split, kadans, fartlek, taper, cadence |

**Not:** Bu modül aynı zamanda **SEO hedefli** — her terim aranabilir bir giriş.

**Her terim kaydında:**
`terim` · `ingilizce` · `kategori` · `harf` · `tanım (2-3 cümle)` · `örnek kullanım (1 cümle)` · `ilgili hareket slug` · `ilgili kas slug` · `karıştırılanlar (opsiyonel)`

**Kabul ölçütü:** Arama 3 harfte süzüyor · boş durum var · her kategori ≥8 terim döndürüyor · karşılıksız harf/kategori 0 · sayaç gerçek sayıyı yazıyor · tüm dahili köprüler 200 · banner **liste ailesi** ölçüsünde (R15).

---

### H2 · İnteraktif Anatomi / Kas Haritası
**Kaynak:** `/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf`
**Etkileşim referansı:** `musclewiki.com/tr-tr` (Playwright ile taranacak — bkz. H3 keşif protokolü)

#### Görseller sıfırdan üretilecek
- Ön ve arka gövde SVG'si **elle çizilecek** — hazır anatomi görseli, stok illüstrasyon veya MuscleWiki varlığı kullanılmayacak
- PDF sayfa rasterleri **şablon** olarak kullanılacak: bölge sınırları, kas grubu ayrımı, yüzeysel/derin katman düzeni oradan okunacak
- Her kas bölgesi ayrı `<path>` olacak, `id` = kas slug'ı → hover/tıklama doğrudan path üzerinden
- Erkek ve kadın gövde varyantı (H3 cinsiyet adımı bunu kullanacak)
- Tek renk paleti, DadaFit token'larına bağlı — seçili bölge `--fit`, hover `--fit-deep`

**Kurgu:**
```
Sol: etkileşimli SVG gövde haritası — ÖN / ARKA geçişi
     bölgeler hover'da vurgulanıyor, tıklanınca seçiliyor
Sağ: seçilen kas için panel
     · kasın adı (TR + Latince)
     · ne yapar (fonksiyon, tek paragraf)
     · komşu / birlikte çalışan kaslar
     · bu kası çalıştıran hareketler  → hareket kartlarına bağlanır
     · kullanılabilecek ekipman       → H1 sözlüğüne bağlanır
     · sık yapılan hata / güvenlik notu
Alt: seçili kasla ilgili hareket kartları ızgarası
```

**Kurallar:**
- Panel içeriği (kas adları, Latince karşılık, fonksiyon, köken/yapışma) **PDF'ten** çıkarılacak — uydurulmayacak
- Hareket eşleştirmeleri egzersiz kütüphanesinin gerçek slug'larına bağlanacak
- Mobilde harita üstte / panel altta; klavye ile bölge gezinebilir olacak (`role="button"`, ok tuşları)
- Derin bağlantı: `?kas=biceps-brachii` doğrudan o kası seçili açacak

**Konumlandırma — karar verildi: modern kabuk + ansiklopedik içerik.**
- **Kabuk modern:** temiz SVG, hover/tıklama, akıcı geçişler, mobil uyumlu, araç gibi çalışıyor
- **İçerik ansiklopedik:** Latince adlar, anatomik köken/yapışma bilgisi, fonksiyon tanımı, komşu kaslar — kısa vaat cümleleri değil, kalıcı başvuru metni
- Ton: "şunu yaparsan şu olur" değil, "bu kas şudur, şunu yapar, şurada çalışır"

**Kabul ölçütü:** Her bölge tıklanabilir · panel her kasta dolu · karşılıksız bölge 0 · hareket köprüleri 200 · @390'da yatay taşma 0.

---

### H3 · Antrenman Oluşturucu
**Referans:** `https://musclewiki.com/tr-tr/workout-generator` — UI/UX birebir uyarlanacak.

Sayfa istemci tarafında render ediliyor; sunucudan yalnızca **ilk adım** okunabiliyor:
```
üst etiket   "Antrenman Oluşturucu"
H1           "HAYDİ BAŞLAYALIM"
alt metin    "Başlamak için vücut tipinizi seçin"
adım 1       Cinsiyet Seç → Erkek (vücut modeli görseli) · Kadın (vücut modeli görseli)
```

#### Playwright keşif protokolü — **kod yazmadan önce zorunlu**
Kalan adımlar tıklanarak çıkarılacak. Varsayımla ilerlenmeyecek.

**En az 8–9 tam tur atılacak**, her turda farklı bir yol izlenecek:

| Tur | İzlenecek yol |
|---|---|
| 1 | Erkek · başlangıç · kilo verme · ev / ekipmansız · 3 gün |
| 2 | Kadın · başlangıç · kilo verme · ev / ekipmansız · 3 gün |
| 3 | Erkek · ileri · kas kazanma · salon / tam ekipman · 5–6 gün |
| 4 | Kadın · orta · güç · salon · 4 gün |
| 5 | En az gün / en az ekipman — alt sınır davranışı |
| 6 | En çok gün / tüm ekipman — üst sınır davranışı |
| 7 | Her adımda **geri dön**, seçim değiştir, ileri git — durum korunuyor mu? |
| 8 | @390 mobil viewport'ta baştan sona tam tur |
| 9 | Aynı seçimlerle ikinci kez üret — çıktı deterministik mi, rastgele mi? |

**Her turda kaydedilecek:**
- Adım sayısı, adım sırası, her adımın soru metni ve seçenek listesi
- Seçenek kartının yapısı: ikon/görsel var mı, açıklama satırı var mı, kaç sütun
- İlerleme göstergesi biçimi (rakam mı, çubuk mı, nokta mı)
- Geri/İleri düğmelerinin konumu ve ne zaman etkinleştiği
- Bir adım atlanabiliyor mu, zorunlu alan hangileri
- **Sonuç ekranının tam yapısı:** gün başlıkları, hareket kartı alanları (set/tekrar/dinlenme var mı), hareket kaç tane, sıralama mantığı
- Aynı girdiye aynı çıktı mı geliyor → algoritmanın deterministik olup olmadığı
- URL değişiyor mu (adım adım route var mı, plan paylaşılabilir mi)
- Her adımda **ekran görüntüsü** — düzen kararları için

**Çıktı:** `tasks/H3-MUSCLEWIKI-AKIS.md` — adım grafiği + seçenek matrisi + sonuç şeması + ekran görüntüleri.
Bu dosya yazılmadan `antrenman-olusturucu-v1.html`'e başlanmayacak.

**Aynı yöntem H2 için de:** `musclewiki.com/tr-tr` ana sayfasındaki gövde haritası Playwright ile taranacak — hover davranışı, tıklama sonrası panel açılışı, ön/arka geçişi, kas bölgesi sayısı ve adları, mobil düzen. En az 6 farklı kas bölgesi tek tek tıklanıp panel yapısı kaydedilecek.

#### DadaFit uyarlaması
- Dosya: `antrenman-olusturucu-v1.html`
- **Kart tabanlı adım seçimi** — her adımda büyük tıklanabilir kartlar, dropdown değil (MuscleWiki'nin ayırt edici yanı bu)
- Vücut modeli görselleri **H2'de çizilecek SVG'den** gelecek — MuscleWiki görseli kullanılmayacak
- Üretilen plan: gün gün hareket listesi, her hareket **egzersiz kütüphanesindeki karta** bağlanacak
- Plan çıktısı `?plan=` ile paylaşılabilir/derin bağlanabilir olacak
- Banner **liste ailesi** ölçüsünde (R15)

#### Mantık gerçekten çalışacak — kabuk değil
Bu bir tasarım maketi değil. Seçimler çıktıyı **gerçekten** belirleyecek:
- Ekipman seçimi hareket havuzunu süzecek (ev/ekipmansız seçildiyse barbell hareketi çıkmayacak)
- Gün sayısı bölünmeyi belirleyecek (3 gün → full body · 4 gün → üst/alt · 5–6 gün → push/pull/legs)
- Deneyim seviyesi set/tekrar aralığını ve hareket karmaşıklığını değiştirecek
- Hedef hacim/yoğunluk dengesini değiştirecek (kilo verme ↔ kas kazanma ↔ güç)
- Her günde kas grupları dengeli dağılacak, aynı hareket iki güne düşmeyecek
- **Karşılıksız kombinasyon 0** — hiçbir seçim bileşimi boş plan döndürmeyecek

Kural tablosu `tasks/H3-KURALLAR.md`'ye yazılacak; kod bu tablodan okuyacak, dağınık `if` bloklarına gömülmeyecek.

#### R13 ile ilişkisi — karışmasın
İki ayrı sihirbaz var, ikisi de tam sayfa, ikisi de pop-up değil:

| | **R13 · Programını Bul** | **H3 · Antrenman Oluşturucu** |
|---|---|---|
| Çıktısı | mevcut **programlara** yönlendirir | **yeni bir antrenman planı** üretir |
| Referansı | `dadadiet.com/diyetisyen-bul` | `musclewiki.com/workout-generator` |
| Deseni | numaralı adım rayı + soru bloğu | büyük kart seçimi + vücut modeli |
| Sonucu | 3 program kartı | gün gün hareket listesi |

**Kabul ölçütü:** HTTP 200 · pop-up/`aria-modal` yok · her adım ileri-geri çalışıyor · üretilen plandaki her hareket köprüsü 200 · "Baştan başla" adım 1'e döner · @390'da yatay taşma 0.

**Not:** MuscleWiki'nin hareket videoları, kas açıklamaları ve görselleri telifli. Alınan şey **etkileşim ve adım deseni**; içerik ve görsel DadaFit'in kendi verisinden gelecek.

| # | Soru | Durum |
|---|---|---|
| **S-A** | Banner yüksekliği | ✅ **Cevaplandı:** ölç ve DadaDiet ile birebir eşitle → protokol R15.1'de |
| **S-B** | Sözlük kapsamı | ✅ **Cevaplandı:** fit ağırlıklı (CrossFit, koşu), gastro sözlüğü referans, egzersiz terimleri köprülenecek → v1 ~180 terim |
| **S-D** | H2'nin dili | ✅ **Cevaplandı:** modern kabuk + ansiklopedik içerik |
| **S-E** | Anatomi PDF'i | ✅ **Cevaplandı:** `/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf` — yerelden okunacak |
| **S-C** | `video-seanslari`'ndaki "Seans Kütüphanesi" başlığında tam olarak ne rahatsız ediyor — kelimenin kendisi mi, tipografi/konum mu, yoksa banner başlığıyla çakışması mı? | 🔴 **açık** |
| **S-F** | Sözlük, anatomi ve antrenman oluşturucu menüye nasıl girsin? 4. turda menü 11 kalemden 3'e indirilmişti (K7). Öneri: tek kalem altında ("Hareketi Anlamak"), menü 3 kalemde kalır. | 🔴 **açık** |

### 4. turdan devreden, hâlâ cevaplanmamış sorular
| # | Konu | Durum |
|---|---|---|
| S1 | Kart PRO rozetleri — rozetler mi kalksın, filtre ekseni mi geri gelsin? | 🔴 açık |
| S2 | "140+ hareket" ifadesi — gerçek 12. Gerçeğe mi çekilsin, hedef olarak mı kalsın? | 🔴 açık |
| S4 | `.btn-fit` kontrastı 3.54:1 (AA altı). Site geneli `--fit-deep` (5.45:1) yapılsın mı? | 🔴 açık |
| S5 | İmza banner'ları | ✅ **R15 ile kapandı** — hepsi aileye giriyor |

---

## 4 · Önerilen sıra

1. **R14** (fonksiyonel hata — en yüksek öncelik)
2. **R11 + R12** (kabuk düzeyi, tek dokunuş, düşük risk)
3. **R15** (önce DadaDiet ölçümü, sonra token, sonra 60 sayfa — S-C yalnızca 15.4'ü bekletir)
4. **R13** (yeni sayfa, R15 banner token'ı oturduktan sonra)
5. **H1** (başlayabilir; S-F yalnızca menü kalemini bekletir)
6. **H2** (PDF okuma + SVG çizimi — en uzun kalem, erken başlasın)
7. **H3** (H2'nin SVG gövde modeli hazır olduktan sonra; ama Playwright keşfi paralel yürütülebilir)

**Doğrulama notu:** 4. turda dört doğrulama ajanı rapor iletemedi (API kopması). Bu turda K27 önerisi uygulansın: kabul ölçütleri `tests/*.mjs` süitine çevrilsin, her turda kendiliğinden koşsun — serbest metin rapor yerine yapılandırılmış çıktı.
