# DEVİR 6 — YENİ OTURUMUN TEK BİLGİ KAYNAĞI

**Depo:** `~/Developer/Projects/dadafit-prototip` · **Canlı:** `gaviaworks-dev.github.io/dadafit-prototip`
**Taban commit:** `8bf5c66` · **Branch:** `main`
**Brief:** `tasks/REVIZYON-6.md` *(21 madde, kapandı)* · **Kararlar:** `KARARLAR.md` (K1–K51)
**Önceki devir:** `tasks/DEVIR-5.md` — banner/footer/kabuk ölçüleri **hâlâ orada**, yeniden ölçülmeyecek

> 8. oturum. Altı ajan paralel çalıştı, madde 21'i lead yürüttü.
> Ajan raporları `tasks/r6-ilerleme/*-RAPOR.md` (A 1103 · B 377 · C 445 ·
> D 360 · E 578 · F 338 satır). **Ekran görüntüleri depoya girmedi (K51).**

## Açılış komutları

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -5 && git status --short
python3 -m http.server 8811 &          # sınamalar açık base ile koşturulur
export PW_HOME=~/.pw
gh auth status                         # aktif hesap gaviaworks-dev olmalı (K36)
```

> ⚠️ **Sınamaları AÇIK BASE ile koştur:** `node tests/<ad>.mjs http://localhost:8811`
> Yedi sınamanın varsayılanı `:8822`; o port kapalıysa "Node.js v24" hatası
> verip düşüyorlar — kod kusuru değil, ortam. 8. oturumda bu yüzden yedi
> sınama yanlışlıkla kırmızı göründü.

---

# 1 · BİTENLER — REVİZYON 6'nın 21 MADDESİ

## A · Sağlık-güvenlik temizliği (AJAN-A) — madde 1 · 2 · 3

**Kök bulgu:** blok sayfa markup'ında değildi, `fit-shell.js`'teki bir IIFE
onu 60 sayfaya basıyordu → **üç madde tek değişiklik.** IIFE (99 satır) ve
`.fh-*` CSS ailesi (21 kural) silindi. Karar kaydı **K50**.

| Ölçüt | Sonuç |
|---|---|
| `.fit-health` düğümü | **66/66 sayfada 0** |
| Yasal banttaki sağlık bağlantısı | **66/66 duruyor** |
| `FOOTER_LEGAL` bloğu | **tek karakter değişmedi** |
| Üç tercih (`dm_fit_sound`/`vibe`/`motion`) | `fit-planim-veri-izin`e taşındı, anahtarlar aynı |
| `antrenman-olusturucu` `.hr-note` | `.wg-card` **içinde** |

## B · Banner ailesi (AJAN-A) — madde 4 · 5 · 6 · 7

- **M4** — istatistik şeridi **sağda dikey**. Kabuk JS'i banner `.wrap`ını
  referansın yapısına çeviriyor: kırıntı tam genişlik üstte, altında
  `.lib-row > .lib-main | .lib-stats`. **26/26 sayfa** @1440'ta sağda dikey,
  ≤1024'te yatay (referans da öyle). Referansla birebir: gap 16 · oluk 44 ·
  sayı 29/700 · etiket 12.5/500 · alt hiza Δ0.0 · ayraç yok.
  R15'in `order:1` kuralı silindi.
- **M5** — `.lib-cta` kabuğa alındı, butonlar arası 4→**9 px** (referans),
  ikincil buton camsı dile geçti. Blok parlaklığı önce ikincil 1.0 > birincil
  0.208 idi, **sonra 0.208 > 0.120** — hiyerarşi ölçülerek düzeldi.
- **M6** — tek `.hr-note` taşıyan 209 px'lik yetim bölüm `#tumu`'nun
  kuyruğuna alındı. 3 bölüm → 2. Banner alt → ilk section boşluğu **0**.
- **M7 + S-G** — `antrenor-detay` tek kolon, portre 128 px yuvarlak.
  **h1 sol kenarı @1440: 63/64 sayfa 132 px** (önce 61). Kalan tek sayfa
  `giris-v1.html` (827) — banner ailesinde değil, S-G kapsamıyor.

## C · Sözlük (AJAN-B) — madde 8 · 9 · 10

**Brief'teki sayı düzeltildi:** "232 terim" değil, **254** (K42 232→254 yapmış).

- **M8** — `.sz-intro` markup + CSS ailesi silindi. "Satıra dokun" **0 kez**.
  `egzersiz-kutuphane` bağlantısı sayfa sonu CTA'sına taşındı.
  Boşluk `--sec-pad-sm`'e çekildi: @1440 32/32/32 (önce 32/34/34).
  Referans kanıtı: gastro sözlüğünde kullanım talimatı şeridi **yok**.
- **M9** — sağ ok kalktı: satırda `fa-chevron-right` **0/254**, satır içinde
  herhangi bir bağlantı **0/254**. Detay yolu açılan kaydın içinde:
  **254/254** doğru `?slug=`. `.sr-caret` expand göstergesi 254/254 duruyor.
  Klavye: Enter açıyor, Space kapatıyor, Tab `.sd-more`'a ulaşıyor.
- **M10** (3 tur) — blok sırası referanstan birebir: arama (t570) → harf rayı
  (t675) → kategori (t735) → liste (t901). Akışta `position:sticky` **0**.
  Kategori seçici `egzersiz-kutuphane`'nin **aynı** bileşeni
  (`.lib-filters.ff[data-ff]` → dropdown + içinde arama + mobilde çekmece).

> **BİRLEŞTİRMEDE DİKKAT:** `sozluk-v1.html`'de `sozluk-veri.js` artık
> `fit-shell.js`'ten **ÖNCE** yükleniyor. Zorunlu: kabuğun `.ff` bileşeni
> senkron kuruluyor ve `[data-ff]` çiplerini o an okuyor.

## D · Anatomi (AJAN-C) — madde 11 · 12 · 13 · 14 · 15

- **M11** — `.an-kaynak` satırı ve CSS'i kalktı. `kaynak` alanı veride
  **31/31 kayıtta duruyor** (K38 sözleşmesi bozulmadı).
- **M12** — sarı info kartı kalktı, sayfanın kendi diline geçti.
- **M13** — alt çiftlerin yarıçapı site token'ıyla hizalandı.
- **M14** — hareket bandı **sağ panelin içine** alındı. Kas seçilince
  değişim aynı ekranda. Aynı liste sayfada iki kez basılmıyor.
- **M15** — sağlık notu dikeyde simetrik: @390 üst 34 · alt 34 (fark **0**).

**@390 kritik bulgu (AJAN-C):** sabit alt gezinme çubuğu top=766, band 730'daydı
— yani çubuğun ALTINDA kalıyordu. Harita 48vh→40vh, panel künyesi mobilde
gizlendi → band.top **617**, çubuğun 149 px üstünde.
*(Bu değer madde 21'de yeniden ölçüldü — aşağıya bak.)*

## E · Antrenman oluşturucu (AJAN-D) — madde 16

Brief "4 seçenek" diyordu, **gerçek 5**'ti (barfiksbari önceden eklenmiş).
6. seçenek **"Tam ekipman (salon)"**. Yeni `data-ekipman` kategorisi
**uydurulmadı**: `salon` kural tablosunda bir **küme** adı
(`ekipmanSuzme.kume`), dört gerçek ekipmanı birden açıyor; `yok` ile birlikte
`tekKip` listesinde (biri ötekileri temizliyor, davranış **tablodan** okunuyor).

**Ölçülen havuzlar:** yok 15 · dambil 21 · bant 17 · kettlebell 16 ·
barfiksbari 16 · **salon 25**. Altı seçeneğin altısında da havuz etkisi
ekranda sayılarak yazıyor — **dekoratif seçenek yok**.
Izgara @1440/1024/768 **3+3**, @640/390 **1×6** — boş kutu yok.
`tasks/H3-KURALLAR.md` §9 ↔ sayfa `KURALLAR` bloğu **14181 karakter birebir**.

> **Alınmayan alternatif (gerekçeli):** "Sehpa/bench" kategorisi
> `sehpa-dips` + `bulgar-split-squat`u ekipmansız havuzdan çıkarır, taban
> havuz 15→13, ekipmansız itiş 2→1 olurdu; "karşılıksız kombinasyon 0"un
> dayandığı taban zayıflardı.

## F · Plan kaydetme (AJAN-D · AJAN-E) — madde 18 · 19

**Sözleşme `assets/js/fit-plan-kayit.js` — LEAD yazdı, iki ajan da okudu.**
`localStorage['dm_fit_planlar_v1']`. Yüzey: `kaydet · listele · getir · sil ·
aktifYap · aktif · isaretle · isaret · ozet · temizle`.
İlerleme seviyeleri sabit: `tam · yarim · atlandi`.
**AJAN-E modülü hiç açıp yazmadı** (md5 doğrulandı); AJAN-D de dokunmadı.

**M18 (AJAN-D):**
- Sonuç ekranına "Planı Kaydet" bandı. Aynı seçim ikinci kez kaydedilirse
  **kopya açılmıyor** (kimlik `secimler.kod`, deterministik).
- `fit-planim-programim-v1.html` kullanıldı, **yeni sayfa üretilmedi**.
  Gün kartları açılır, sıradaki gün açık ve "Sırada" rozetli.
- Satır satır **üç seviyeli** işaretleme.
- **Girişsiz kullanıcı kararı ölçümle verildi:** dadagastro "Menüye Ekle"
  girişsizken **dürüst kapı** açıyor. Aynı desen kabuğun `data-lg-gate`iyle
  kuruldu, ikinci kapı icat edilmedi. Uydurma "cihazına kaydedildi" vaadi yok.

**M19 (AJAN-E):** 7 sayfa yeniden kuruldu. **Kök bulgu: kopukluk boyut değil
YAPIydı** — 7 sayfanın 7'sinde `.sec-head` sayısı **0**'dı. Üst özet kartı
`.fpx-sum` sağ kolonu gastro `.bnp-stats`'tan **ölçülerek** alındı:
**9 ölçütün 9'u eşit**.

> **Referans erişimi — dürüst not:** `dadadiet.com/planim` ve
> `dadagastro.com/mutfak-defterim` sunucu tarafında `/giris`'e yönlendiriyor.
> Sekiz kişisel-alan adresinin sekizi kapalı; hesap açılmadı. Tasarım dili
> halka açık muadillerden ölçüldü.

## G · Arama (AJAN-F) — madde 20

**Kök neden iki katmanlı, DOM'da ölçüldü:**
1. `arama-fit-v1.html:449` `.fs-top{overflow:hidden}` — paneli hem boyamadan
   hem hit-test'ten kesiyordu. Panel rect 436.6→876.6, hero alt kenarı 544:
   **332 px kesiliyordu.**
2. `:452` `.fs-top .wrap{position:relative;z-index:2}` stacking context
   açıyor → panelin `z-index:60`'ı içeride kalıyor, dışarıya **2** görünüyor.

**Çözüm:** süslemeler kendi kırpma katmanına (`.fs-top-deco`), `.fs-top`
`overflow:visible`. Panel açıkken `.fs-top` `z-index:45` (tabbar 40 üstü,
header 60 altı); kapanınca geri alınıyor.
**Sonuç:** `elementFromPoint` **9 genişlikte 3/3** panelin kendi öğesi.

> **Depo dışı bulgu:** `dadadiet.com/arama` ÜRETİMDE aynı hatayı taşıyor —
> panel hero bandında kesiliyor. `dadagastro.com/ara` düzeltilmiş; referans
> olarak o alındı.

## H · Anatomi görseli (LEAD) — madde 21 · 17

Karar kayıtları **K46 · K47 · K48 · K49**.

**Beyar'ın yön değişikliği:** ilk onay "Yön 3" (render yalnız çizim şablonu)
idi; ilk trace onaylandıktan sonra **render görünen katman** oldu.
Referans `musclewiki.com/tr-tr`.

| Ölçüt | Önce | Sonra |
|---|---|---|
| Görünen gövde | soyut SVG siluet + oval bölgeler | **Higgsfield render'ı** (`assets/img/anatomi/govde-*.png`) |
| Bölge sayısı / görünüm | 14–16 | **18 slug**, 45–48 plakadan birleşik |
| Benzersiz slug | 29 | **31** (+`gogus-ust` +`brachioradialis`) |
| Seçili kas | yarı saydam oval | **solid, gerçek kas konturunda** |
| Seçilmemiş kas | %30 yeşil dolgu | **boya yok** |
| Ortak viewBox | 400×900, dört farklı oran | **758×1380, dördü aynı** |

**Kredi:** 42.5 → **30.5**. 6 görsel × 2 kredi = 12 kredi.
2'si ilk iki-figürlü plate (kullanılmadı), 4'ü son tek-figür render.
Erkek plate'inde duplicate vardı; **yeniden üretim gerekmedi** çünkü
tek-figür set zaten temizdi. Ölçümle kanıtlandı: dört render da **tek sütun
aralığı, tek bağlantılı bileşen, alanın %100'ü tek parçada**.

**Madde 17 otomatik bağlandı:** `antrenman-olusturucu` zaten
`assets/svg/govde-erkek-on.svg` / `govde-kadin-on.svg` okuyor. CSS'i yeni
yapıya çevrildi (eski `.an-siluet` kuralları `.an-bolge`'yi kuralsız bırakıp
**siyaha** boyayacaktı). Seçili gövde yeşil yanıyor.

**Görsel ağırlığı:** 4 render 1.2 MB'dan **283 KB**'a indi (PNG8 + alpha,
64 renk, zemin saydam).

---
# 2 · MADDE 21 — ÖLÇÜLER (yeniden ölçülmeyecek)

## 2a · Ortak tuval ve normalizasyon

| | Değer |
|---|---|
| viewBox (dört dosyada aynı) | **0 0 758 1380** |
| Gövde yüksekliği (baş tepesi → topuk) | **1300 px** |
| Üst/alt pay | 40 px |
| Ölçek referansı | **yükseklik** — genişlik zorlanmadı |

**Ham render oranları (normalize ÖNCESİ):** erkek-ön 2.011 · erkek-arka 1.916 ·
kadın-ön 2.279 · kadın-arka 2.163 → geçişte gövde zıplıyordu.

**Normalize SONRASI nirengi kayması:** omuz **16** · kalça **21** ·
kasık **11** · diz **3** px. (Koltuk altı 138 px — poz farkı, kusur değil.)

**Ölçek katsayıları:** erkek-ön 0.5625 · erkek-arka 0.5467 ·
kadın-ön 0.5687 · kadın-arka 0.5361.

## 2b · Segmentasyon ve eşleştirme

| Görünüm | Anlamlı plaka | Slug |
|---|---|---|
| erkek-ön | 48 | 18 |
| erkek-arka | 45 | 18 |
| kadın-ön | 46 | 18 |
| kadın-arka | 39 | 18 |

**Benzersiz slug 31** — 16 birincil ön · 15 birincil arka.
`approxPolyDP` toleransı **1.1 px**. Boyama sırası **alandan büyükten küçüğe**.

## 2c · Kabul ölçütleri (ölçüldü)

| Ölçüt | Sonuç |
|---|---|
| Karşılıksız kayıt (veride var, SVG'de yok) | **0** |
| Karşılıksız bölge (SVG'de var, veride yok) | **0** |
| Her bölge gerçek fare tıklamasıyla seçilebiliyor | **@1440 ✓ · @390 ✓** |
| Yanlış kas seçilen tıklama | **0 · 0** |
| Konsol hatası | **0** |
| `assets/img/anatomi/` toplam ağırlık | **283 KB** (4 dosya) |

## 2d · Bilinen sınır — DOKUNMA HEDEFİ

**@390'da 61, @1440'ta 54 bölgenin serbest çapı 24 px'in altında** (en küçüğü
0–4 px: `adduktor` · `boyun` · `tensor-fasya-lata` · `brachioradialis`).

**Bu geometrik bir sınır, kusur değil:** adduktor gerçek anatomide ince bir
şerit; 44 px'e çıkarmak komşu kasın üstüne taşmak demek — o zaman "yanlış kas
seçilen 0" garantisi düşer. İkisi aynı anda tutulamaz.

**Nasıl telafi edildi:**
- @390 harita `min(40vh,360px)` → **`min(52vh,470px)`** büyütüldü
  (185 px genişlikten çıktı). M14 garantisi yeniden ölçüldü, bozulmadı.
- **Her kasın ≥44 px erişilebilir yolu var:** haritanın üstündeki kas grubu
  çipleri (@390 44 px) ve klavye gezinmesi. Harita ikincil, hassas giriş.
- Sınama "her bölge tıklanabilir + yanlış kas 0" nöbetini iki genişlikte
  tutuyor; çap ölçümü rapora yazılıyor ama kırmızıya döndürmüyor.

**Sonraki tur isterse:** kalıcı çözüm, ince kaslar için haritanın yanında
bir liste/çip rayı değil, **kasa yakınlaştırma** (bölge seçilince o bölgeye
zoom) olurdu. Ölçülmedi, önerilmiyor — not olarak duruyor.

---

# 3 · TUZAKLAR — 8. oturumda yaşananlar

## B14 · XML yorumunda ÇİFT TİRE SVG'yi çökertir

Üretilen SVG'lerin yorumuna `--fit-deep` yazıldı. `--` XML yorumlarında
**yasak**; `DOMParser` sessizce başarısız oldu, sayfa `SVG kökü yok` attı ve
dört harita da mount edilmedi. `xml.dom.minidom.parse` ile doğrulanınca çıktı.

**Ders:** üretilen SVG her yazımdan sonra **XML olarak doğrulanacak**.
`svg-yaz.py` bunu kendisi yapıyor.

## B15 · Cinsiyet ve görünüm düğmesine AYNI ANDA tıklamak yarış üretir

`haritaYukle()` fetch tabanlı. İki düğmeye aynı `evaluate` içinde tıklanınca
iki fetch yarışıyor ve **yavaş olan kazanıyor** — kadın-ön isteyip erkek-arka
mount ediliyordu. Sınama bu yüzden "kadın-ön'de latissimus var" diye kırmızı
veriyordu; kusur sayfada değil, ölçümdeydi.

**Ders:** görünüm geçişi **ayrı ayrı** tıklanıp her biri
`svg[data-cinsiyet][data-gorunum]` ile doğrulanacak.

## B16 · `elementFromPoint` görünür alanın DIŞINDA null döner

Alt bacak bölgeleri (gastrocnemius · soleus · tibialis) sayfanın altında
kaldığı için "tıklanabilir nokta bulunamadı" veriyordu. Bölge **anlık**
kaydırılmadan ölçüm yapılamaz.

**Ders:** `scrollIntoView({behavior:'instant'})` + bekleme.
Yumuşak kaydırma açıkken ölçüm ile tıklama arasında düzen oynuyor ve
tıklama **komşu kasa** düşüyor — sınamada geçişler CSS ile kapatıldı.

## B17 · İnce bölge için 12×12 ızgara yetmez

Eski sonda `isPointInFill` kullanıyordu ama 12×12 örnekliyordu; ince
şeritlerde hiçbir örnek dolgunun içine düşmüyordu. **40×40**'a çıkarıldı.

## B18 · Kadın render'ında plakalar BİRLEŞİK gelebilir

`kadin-arka` bileşen **22** (alan 38545, bbox y390..922) sağ lat ile sağ
kalçayı tek parça yapmıştı. Erkek maskesine göre otomatik eşleştirme hepsini
`gluteus-maximus`'a atadı ve **yeşil sırtın yarısını kapladı**.

**Ders:** geometrik aktarım kolaylık, doğruluk değil. Dört görünümün dördü de
etiketli haritadan **elle** eşlendi; birleşik plakalar x/y aralığıyla kesildi.
Kusur ancak **ekran görüntüsüne bakılınca** görüldü — ölçüm sayıları
(karşılıksız 0, konsol 0) hepsi yeşildi.

## B19 · Ajanlar arası paylaşılan scratchpad ÜZERİNE YAZILIR

AJAN-F `shot.mjs` gibi genel adlı betikler yazdı, başka bir ajan üzerine
yazdı, bir turluk ölçüm **sessizce kayboldu** (exit 0, dosya yok).

**Ders:** her ajan `scratchpad/<ajan>/` alt dizini kullanacak.

## B20 · Regex ile CSS kuralı silmek SARKAN SEÇİCİ bırakır

AJAN-A, AJAN-E'nin yerel ezmesini regex'le silerken `.fpx-sum-sub,` seçicisini
gövdesiz bıraktı; CSS onu bir sonraki kurala bağladı. **7 sayfada** iki hasar:
`text-align` justify oldu (@390 kelime arası 3.8 → **40.4 px, 10.6×** —
turun en şiddetli nehri) ve boş durum kuralından **yabancı padding** bulaştı
(blok 48 → 104 px).

**Hiçbir sınama yakalamadı** çünkü süitte `text-align`/`padding` ölçen nöbet
yok. AJAN-A iki tarama koşturdu (68 dosyada sarkan seçici · 105 seçicilik
"left sözünü tutuyor mu" sondası) — başka artık çıkmadı.

**AÇIK KALEM:** o 105 seçicilik sonda `tests/` altına alınmaya değer.

## B21 · `fit-type.css`'in yaslama eşiği YAZILDIĞI GÜNDEN BERİ ÇALIŞMIYORMUŞ

`--jt-min: 30rem` tanımlı ama **hiçbir yerde okunmuyordu**; var olan
container sorgusu (`@container (max-width:20rem){p,li{...}}` = 0,0,1)
özgüllükte `.hub-body p`'ye (0,1,1) **kaybediyordu** — kaynakta doğru
görünen, computed'da hiç çalışmayan kural. Eşik de yanlıştı (320 vs 480).

**Ölçülen nehirler:** `.brg-card p` 199 px kutuda **64.8 px kelime arası
(19.2×)** · `.hub-body p` **43.3 px (12.8×)**. Beşi de eşiğin **%100 altında**.

**Aynı özgüllük tuzağına bu turda ÜÇ KEZ düşüldü** (biri yıllardır orada,
ikisi bu turda). Kural dosyaya yorumla işlendi.

---

# 4 · TEST SÜİTİ — 20 sınama

**Yeni üç sınama (hepsi K27 ile taban commit `8bf5c66`'da kırmızıya döndürüldü):**

| Sınama | Ne kanıtlar | Taban commit |
|---|---|---|
| `plan-kayit` | M18 — plan kaydediliyor, işaret duruyor, oran DOM ile birebir | **9 sorun** |
| `plan-ozet` | M19 — `FIT_PLAN.ozet()` ekrana birebir düşüyor | **3 kırmızı** |
| `arama-oneri` | M20 — panel beyaz kutunun üstünde ve tıklanabilir | **7 sorun (exit 1)** |

**`tests/anatomi.mjs` bölüm 2 YENİDEN YAZILDI** (M21). Ölçüt zayıflatılmadı,
sertleşti: ızgara 12×12 → **40×40** · `isPointInFill` · `closest()` ile
üstünü kapatan katman denetimi · anlık kaydırma · geçişler kapalı ·
görünüm geçişi **düğmelerden ve ayrı ayrı**. Taban commit'te **kırmızı**.

**Nöbet TAŞINAN sınamalar (zayıflatılmadı):**
- `footer-curtain` · `footer-yapi` → `.fit-health` artık **0 olmalı**;
  `footer-yapi`'ye "yasal bantta sağlık bağlantısı ≥1" ölçütü **eklendi**
- `footer-yapi` **12b** (AJAN-A, AJAN-E'nin bulgusundan): banner `.wrap`
  çocukları yan yana diziliyorsa `.wrap > .lib-row` **olmak zorunda**.
  K27 ile kırmızıya döndürüldüğünde **12 sorun** çıktı — AJAN-E'nin
  raporladığı 9 sayfaya ek olarak `enerji-defteri-dengele` ve `-su` da.
- `sozluk` → sağ ok 0 + detay bağlantısı **254/254** nöbeti
- `workout-generator` → 20. ölçüt küme açılımını **kural tablosundan** okuyor

**Tam koşma:**
```bash
python3 -m http.server 8811 &
export PW_HOME=~/.pw
for t in a11y-focus coach-list dropdown-position header-banner plan-account \
         fit-test-lock footer-curtain crumb-home wizard-page sozluk \
         sozluk-kapalilik anatomi workout-generator egzersiz-katalog \
         kabuk-kalite enerji-hesap footer-yapi plan-kayit plan-ozet arama-oneri; do
  echo "=== $t ==="; node tests/$t.mjs http://localhost:8811
done
```

**Yeni araç:** `tools/site-tarama.mjs` — depodaki HER sayfayı iki genişlikte
açar; HTTP · konsol · yatay taşma · 4xx alt kaynak · kırık iç bağlantı ·
banner ailesi · R11 perde farkı ölçer.
```bash
node tools/site-tarama.mjs http://localhost:8811 1440,390
```

---
# 5 · DOKUNULMAYACAKLAR

DEVIR-5 §7'deki liste **aynen geçerli** (banner ailesi token'ları · R11
perdesi · yasal bant · kanonik slug sözleşmeleri · ana sayfa herosu ·
kırıntı ev ikonu · `.fit-band-panel` geri taşıma kilidi · R13 sihirbaz
sayfası). Buna R6'nın eklediği kalemler:

| Ne | Neden |
|---|---|
| **`assets/img/anatomi/govde-*.png`** | Higgsfield ile üretildi, kredi karşılığı. Normalize edilmiş ortak tuvale oturuyorlar; biri değişirse **dördü birden** yeniden normalize edilmeli ve `tasks/anatomi-uretim/` yeniden koşturulmalı |
| **`assets/svg/govde-*.svg`** | Elle düzenlenmez — üreteçten çıkar. Elle dokunulursa render ile hizası bozulur ve bir daha üretilemez |
| **Ortak viewBox 758×1380** | Dört dosyanın hizası buna bağlı; tek dosyada değiştirilirse geçişte gövde zıplar (K47) |
| **`.an-bolge` varsayılan dolgusu saydam** | Kuralsız kalırsa SVG varsayılanı **siyah** — gövdeyi kaplar. `antrenman-olusturucu` bu yüzden kendi kuralını taşıyor |
| **`fit-plan-kayit.js` çağrı yüzeyi** | İki sayfa ailesi (oluşturucu + Fit Planım) bu sözleşmeye bağlı; tek taraflı değişmez |
| **`dm_fit_sound`/`vibe`/`motion` anahtarları** | `.fit-health` kalktı ama tercihler taşındı; anahtar adı değişirse kayıtlı tercih kaybolur (K50) |
| **`sozluk-v1.html` script sırası** | `sozluk-veri.js` `fit-shell.js`'ten ÖNCE olmak zorunda, yoksa `.ff` bileşeni çipsiz kurulur |

---

# 6 · AÇIK KALEMLER — bir sonraki turun malzemesi

## Lead'in karar bekleyen bulguları

| # | Konu | Durum |
|---|---|---|
| **1** | `--sec-pad` **50 px**, referans (`dadadiet.com/beslenme`) **74 px** | Site geneli tek token; beş ajan çalışırken değiştirilmedi. Tek satırlık değişiklik, 66 sayfayı etkiler |
| **2** | `enerji-defteri-dengele-v1.html` `.sec-food .eyebrow{color:var(--food)}` → **4.07:1**, AA altı | Hem kontrast kusuru hem marka dili sorusu: DadaFit sayfasında gastro kırmızısı bilerek mi? |
| **3** | `--tomato` token'ı **`#009d4f` (yeşil)** taşıyor | Gastro paletinden kalma **yanıltıcı ad**; değer doğru, ad yanlış |
| **4** | `sozluk-v1` banner eyebrow'u **"TERİM TERİM"** | AJAN-A dokunmadı (AJAN-B'nin dosyası), AJAN-B de değiştirmedi |
| **5** | Yaslama · **genişlik tarafı**: çıplak `p`, 561 blok, **%42'si eşik altında** | `container-type` taşımayan sarmalayıcılarda. Çözüm `contain: layout inline-size` demek — sticky/overflow davranışını etkileyebilir |
| **6** | Yaslama · **satır sayısı tarafı**: mekanik çözümü **yok** | CSS satır sayısını sorgulayamaz. Ya kısa bloklar ortak işaret sınıfı taşır, ya yaslama **opt-in** olur (66 sayfalık tercih) |
| **7** | `text-align`/`padding` ölçen **nöbet yok** | B20'nin 7 sayfalık hasarını hiçbir sınama yakalamadı. AJAN-A'nın 105 seçicilik sondası `tests/` altına alınabilir |
| **8** | `giris-v1.html` h1 sol kenarı **827 px** | Banner ailesinde değil, S-G kapsamıyor. İstenirse ayrı madde |
| **9** | `antrenor-detay` portre fotoğrafı **portre değil** | Geniş salon karesi; yuvarlak kırpmada yüz yok. İçerik konusu |
| **10** | R11 perdesi **@390'da kapalı** | `margin-bottom:0`, footer 1281.83 px. Kabuğun kendi davranışı, AJAN-D ölçtü. Kasıtlıysa kayda geçmeli |
| **11** | Anatomi dokunma hedefi (§2d) | Geometrik sınır; çipler ve klavye telafi ediyor. Kalıcı çözüm "kasa yakınlaştırma" olurdu |
| **12** | `fpx-` CSS/JS bloğu **7 sayfada birebir çoğaltıldı** (~7 KB × 7) | §0b "sayfa içi style" dediği için böyle yapıldı; `assets/css/fit-planim.css`'e çıkarmak tek adım, hiçbir seçici değişmez |
| **13** | Site genelinde `.btn-primary` **hâlâ duruyor** | Fit Planım ailesinde 0'a indi (S4'ün düğmesi `.btn-fit`). Site geneli taşıma ayrı madde |

## MuscleWiki — K45 hâlâ geçerli

`musclewiki.com/tr-tr` **HTTP 403**. 8. oturumda bir kez yoklandı,
zorlanmadı. Parçalanma mantığı `Muscle.pdf`'ten alındı.

## Higgsfield

**Kalan bakiye: 30.5 kredi.** Hesap `beyarguness@gmail.com`, plan Ultra.
Görsel başına **2 kredi** (Nano Banana Pro). Yeni gövde gerekirse **dördü
birden** üretilmeli (normalizasyon dörtlüye bağlı) → 8 kredi.

---

# 7 · YOLLAR

| Ne | Yol |
|---|---|
| Bu turun brief'i | `tasks/REVIZYON-6.md` |
| **Ajan raporları** | `tasks/r6-ilerleme/{A,B,C,D,E,F}-RAPOR.md` |
| **Anatomi üreteci** | `tasks/anatomi-uretim/bolgeler.py` + `svg-yaz.py` |
| **Anatomi render'ları** | `assets/img/anatomi/govde-*.png` (283 KB) |
| Anatomi kaynağı | `/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf` |
| Kararlar | `KARARLAR.md` (K1–K51) |
| Plan kaydı sözleşmesi | `assets/js/fit-plan-kayit.js` |
| Test süiti | `tests/*.mjs` (20 sınama) |
| Kalite kapıları | `tools/page-check.mjs` · **`tools/site-tarama.mjs`** |
| Kabuk | `assets/js/fit-shell.js` · `assets/css/fit-shell.css` · `assets/css/fit-type.css` |
| Playwright | `PW_HOME=~/.pw` |
| Canlı | `https://gaviaworks-dev.github.io/dadafit-prototip` |
| **Anatomi (canlı)** | `https://gaviaworks-dev.github.io/dadafit-prototip/anatomi-v1.html` |
