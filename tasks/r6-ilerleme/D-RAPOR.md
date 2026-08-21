# AJAN-D RAPORU — REVİZYON 6 · madde 16 (§E) + madde 18 (§F)

**Dosyalar:** `antrenman-olusturucu-v1.html` · `fit-planim-programim-v1.html` ·
`tasks/H3-KURALLAR.md` · `tests/plan-kayit.mjs` (yeni) · `tests/workout-generator.mjs` (ölçüt 21 eklendi)
**Dokunulmayanlar:** `assets/css/fit-shell.css` · `assets/js/fit-shell.js` ·
`assets/js/fit-plan-kayit.js` (sözleşme, değiştirilmedi) · `antrenman-olusturucu-v1.html`
satır 262–267 `.hr-note` (AJAN-A'nın) · `fit-planim-*` diğer sayfalar (AJAN-E'nin) ·
`assets/svg/govde-*` (madde 21) · **madde 17'ye dokunulmadı**

---

## Madde 16 — Ekipman adımına seçenek eklenmesi

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET.** Üç satır özet: (1) şablon görünümden kaçın,
  cesareti tek yerde harca — burada o yer seçeneğin havuza etkisini gösteren sayı oldu;
  (2) yapısal işaretler ancak gerçekten bilgi taşıyorsa konur — "+6 hareket" taşıyor,
  dekoratif numara taşımaz; (3) kopya tasarım malzemesidir: seçenek açıklamaları
  tek satıra indirildi, kartlar eşit yükseklik aldı.
- **Ölçülen başlangıç durumu (brief'in "4 seçenek"i eskimişti):** adım 4'te
  **5 seçenek** vardı (`yok · dambil · kettlebell · bant · barfiksbari`), ızgara
  2 sütun → son satırda **1 boş kutu**.
- **Yapılan değişiklik:**
  - `antrenman-olusturucu-v1.html:341` (KURALLAR.ekipman) → 6. seçenek `salon:'Tam ekipman (salon)'`
  - `antrenman-olusturucu-v1.html:452–464` (KURALLAR.ekipmanSuzme) → `kume` + `tekKip` alanları
  - `antrenman-olusturucu-v1.html` motor: `ekipmanAc()` (küme açıcı) · `havuzSuz()` ondan okuyor ·
    `opsEkipman()` havuz sayısını **sayıyor** · tıklama işleyicisi `s.tek` listesinden okuyor
  - `ADIMLAR` ekipman sorusu: `kol:2` → `kol:3`, `kolM:1` (mobilde tek kolon),
    `tek:KURALLAR.ekipmanSuzme.tekKip`
  - `tasks/H3-KURALLAR.md` §9 bloğu **betikle** sayfadan kopyalandı (14181 karakter,
    karakter karakter aynı) · §2 · §3 · §7 metinleri güncellendi
- **Ekran görüntüsü:** `tasks/r6-shots/D/m16-g1-1440.png` · `tasks/r6-shots/D/m16-g1-390.png`

### Geçiş 2 · Kendi işini eleştir
Görüntülere bakıldı, üç somut kusur bulundu ve düzeltildi:

- **Kusur 1 — asimetrik bilgi:** havuz sayısı yalnız iki seçenekte yazıyordu
  (küme olanlarda), dört gerçek ekipmanda hiç yoktu; kullanıcı "bant ne kadar
  açıyor" sorusunu ekranda göremiyordu.
  → Altı seçeneğin altısına da **sayılmış** meta çipi kondu (`havuzSuz()` ile,
  elle yazılmadan). **Önce 2/6 seçenekte sayı, sonra 6/6.**
- **Kusur 2 — ızgara boş kutu:** aynı adımdaki "odak" sorusu 7 kalemi 4 sütuna
  dağıtıyordu → @1440 **4+3 (1 boş kutu)**, @390 **2+2+2+1 (1 boş kutu)**.
  → Akan **çip dizisi**ne (`.wg-opts.cip`) geçildi; isteğe bağlı sorunun görsel
  ağırlığı da zorunlu ekipman kartlarının altına indi.
  **Adım yüksekliği @1440 2223 px → 2056 px · boş kutu 1 → 0.**
- **Kusur 3 — eşit olmayan kart yüksekliği:** açıklamalar 1–3 satır arasında
  değişiyordu, iki satır arasında ~30 px fark oluşuyordu.
  → Dört açıklama tek satıra indirildi. **Ölçülen: 6 kartın 6'sı da 101 px.**
- **Ekran görüntüsü:** `tasks/r6-shots/D/m16-g2-1440.png` · `m16-g2-390.png`

### Geçiş 3 · Referansla karşılaştır
**Referans:** `https://dadagastro.com/bugun-ne-pisirsem` — Playwright ile açıldı,
sihirbazın 1. adımı ölçüldü.

| Ölçüt | dadagastro (ölçüldü) | DadaFit önce | DadaFit sonra |
|---|---|---|---|
| Seçenek ızgarası | grid **3 kolon**, gap **12 px** | 2 kolon, gap 10 px | **3 kolon**, gap **12 px** |
| Satır dolulukları | **3 + 3** (boş kutu yok) | 2+2+1 (1 boş) | **3 + 3** |
| Kart yüksekliği | 144 px (dikey kip) | 101 px (satır kipi) | 101 px — *bilerek farklı, aşağıda* |
| Kart yarıçapı | 16 px | `--radius-lg` = **16 px** | 16 px |
| Kart başlığı | **14.5 px / 700** | 14.5 px / 700 | 14.5 px / 700 |
| Sorunun başlığı | **20 px / 700** | 16.5 px | **18 px** |
| Uyarı satırı | ikonlu ("!" dairesi) | ikonsuz düz metin | **ikonlu** |
| Adım rayı | numara + etiket + alt etiket | numara + etiket | değişmedi (aile ölçüsü) |

**Referanstan zayıf kalan üç nokta → nasıl kapatıldı:**
1. Soru başlığı referansta sayfadaki en güçlü tipografik kalem; bizde kart
   başlığının (20 px) gölgesinde kalıyordu → `.wg-q h3` **16.5 → 18 px**.
2. Izgara boşluğu 10 px'ti, referans 12 px → `.wg-opts{gap:12px}`.
3. Zorunlu soru uyarısı referansta ikon taşıyor, bizde düz metindi →
   `.wg-warn`'a `fa-circle-exclamation` kondu, `display:flex` ile hizalandı.

**Bilerek alınmayan:** referansın dikey/ortalanmış kart kipi. Bizim seçeneklerimiz
açıklama + havuz sayısı taşıyor; ortalanmış kip bu iki satırı 144 px'e şişirir ve
altı seçenek ekranı doldururdu. Kartın **iç düzeni** DadaFit'in kendi
`wg-opt` deseni kaldı; alınan şey **ızgara, boşluk ve tipografik ölçek**.
- **Ekran görüntüsü:** `tasks/r6-shots/D/m16-g3-1440.png` · `m16-g3-390.png` ·
  referans: `tasks/r6-shots/D/ref-gastro-1440.png` · `ref-gastro-yemekmodu.png`

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| Izgara 6 seçenekte boş kutu bırakmıyor | @1440 3×2 · @390 tek kolon | ekipman satırları: **@1440 3+3 · @1024 3+3 · @768 3+3 · @640 ve @390 1×6** — hiçbir genişlikte boş kutu yok. Odak çipleri (7 kalem): 7 / 6+1 / 5+2 / 3+3+1 — çip dizisi olduğu için son satır **boş hücre değil**, kısa satır | ✅ |
| Her seçenek havuzu gerçekten süzüyor | işaretliyken ≠ işaretsizken | `yok:15 · dambil:21 (+6) · bant:17 (+2) · kettlebell:16 (+1) · barfiksbari:16 (+1) · salon:25 (+10)` | ✅ |
| Eklenen kategori kataloğun `ekipman` alanıyla eşleşiyor | uydurma kategori yok | `salon` = kataloğun dört gerçek `data-ekipman` değerinin birleşimi; yeni `data-ekipman` değeri **uydurulmadı** | ✅ |
| "Tam ekipman" diğerlerini temizliyor | R13'ün "Yok" aynası | ölçüldü: `[dambil,bant] → salon → [salon]`, sonra `dambil → [dambil]` | ✅ |
| `H3-KURALLAR.md` §9 ↔ sayfa bloğu | karakter karakter aynı | **14181 karakter, birebir** (sınama 14) | ✅ |
| Hiçbir bileşim boş plan döndürmüyor | 0 boş | 44 bileşim (4 gün × 11 ekipman), hepsi dolu | ✅ |
| `tests/workout-generator.mjs` | yeşil | **0 sorun** (aşağıda) | ✅ |
| Dokunma hedefi @390 | ≥ 44 px | ekipman kartı **101 px** · odak çipi **48 px** | ✅ |
| Konsol · yatay taşma | 0 · 0 | @1440 0/0 · @390 0/0 | ✅ |

---

## Madde 18 — Plan kaydedilsin, görüntülensin, ilerleme işaretlensin

### Geçiş 1 · Kur
- **frontend-design skill okundu: EVET** (aynı okuma; madde 18'de kullanılan üç ilke:
  eylemi tek ve net tut · boşluğu ritimle yönet · durum rengi bilgi taşımalı).
- **Yapılan değişiklik:**
  - `antrenman-olusturucu-v1.html`: `<script src="assets/js/fit-plan-kayit.js">` ·
    sonuç ekranına `kaydetHtml()` bandı · `planNesnesi()` (sözleşme şemasına çeviri) ·
    `ayniPlan()` (kopya kayıt açmaz) · `#wgKaydet` tıklama işleyicisi · `.wg-kaydet` CSS
  - `fit-planim-programim-v1.html`: `#ppPlan` bloğu (üst özet kartı + gün kartları +
    üç seviyeli işaretleme) · `#ppLive` (aria-live) · `pp-*` CSS · sözleşme scripti
  - `tests/plan-kayit.mjs`: **yeni sınama** (11 ölçüt, iki genişlik)
- **Ekran görüntüsü:** `tasks/r6-shots/D/m18-g1-sonuc-1440.png` · `m18-g1-sonuc-390.png` ·
  `m18-g1-programim-1440.png` · `m18-g1-programim-390.png` · `m18-g1-kaydet-*.png`

### Geçiş 2 · Kendi işini eleştir
Görüntülere bakıldı, **dört** somut kusur bulundu ve düzeltildi:

- **Kusur 1 — kaydet bandında metin kırılıyordu:** `.wg-kaydet b{display:block}`
  kuralı paragrafın içindeki `<b>`leri de blok yapıyordu; açıklama "Plan /
  Planım › Plan ve Takvim / sayfasına düşer" diye üç parçaya bölünüyordu.
  → Kural `.wg-kaydet .kt>b` ile kapsandı, kopya kısaltıldı.
  **Bant yüksekliği 121 px → 81 px @1440.**
- **Kusur 2 — dikey ritim / mobil kırılma:** dört gün × beş hareket hep açıktı;
  Programım sayfası @390 **7546 px**, @1440 **4547 px** oluyordu ve "sırada hangi
  gün var" bilgisi kayboluyordu.
  → Gün kartları `details/summary` oldu; `FIT_PLAN.ozet().aktifGun` açık geliyor,
  "Sırada" rozeti taşıyor, ötekiler kapalı; üstte "Tüm günleri aç" düğmesi.
  **@1440 4547 px → 3523 px.** Plan DOM'da eksiksiz duruyor (sınama sayıyor).
- **Kusur 3 — görsel gürültü:** satır başına üç ayrı düğme = 20 satırda **60 kutu**.
  → Tek **segment kontrol** (paylaşılan kenarlık, iç ayraç). Dokunma hedefi
  44 px korundu (min-height).
- **Kusur 4 — renk semantiği yanlıştı:** "yarım" işaretlenen satır da yeşile
  (`is-done`) dönüyordu; renk "tamamlandı" diyordu, işaret "yarım".
  → `is-done` (yeşil `--fit-tint`) · `is-half` (`#fff6e6` — `.fp-badge.wait`'in
  kendi değeri) · `is-skip` (`#f4f4f3` — `.fp-badge.off`'un değeri).
  **Yeni renk uydurulmadı**, üçü de sitede zaten kullanılan değerler.
- **Kusur 5 (klavye) — odak kayboluyordu:** her işaretten sonra satır yeniden
  basıldığı için `document.activeElement` `<body>`ye düşüyordu; klavye kullanıcısı
  her işaretten sonra sayfanın başına dönüyordu.
  → İşaretten sonra aynı düğmeye odak geri veriliyor.
  **Ölçülen sonra:** `activeElement` = `BUTTON[data-pp-g=1][data-pp-i=0][data-pp-s=tam]`,
  `aria-pressed="true"`.
- **Ekran görüntüsü:** `tasks/r6-shots/D/m18-g2-kaydet-1440.png` ·
  `m18-g2-kaydet-390.png` · `m18-g2-programim-isaretli-1440.png` · `m18-g2-programim-390.png`

### Geçiş 3 · Referansla karşılaştır
**Referans:** `https://dadagastro.com/bugun-ne-pisirsem` → *Yemek Modu* →
*Sıfırdan Kur* → *Menüye Ekle*. Playwright ile tıklanarak ölçüldü.

| Ölçüt | dadagastro (ölçüldü) | DadaFit'te karşılığı |
|---|---|---|
| Eylem düğmesi | kartın altında **tam genişlik**, birincil renk, h **37 px**, radius **8 px**, 12.5 px / 700 | sonuç bandında birincil `.btn-fit`; @390 **tam genişlik** |
| Girişsiz kullanıcı | **dürüst kapı** — kilit ikonu, "Menüye eklemek için giriş yap", tek cümle gerekçe, **Giriş Yap** + **Üye Ol** | kabuğun kendi kapısı `data-lg-gate` → `#lgGate` (aynı desen, ikinci kapı icat edilmedi) |
| Kapıda sessiz kayıt | **yok** — hiçbir şey kaydedilmiyor | yok (sınama ölçüyor: `dm_fit_planlar_v1` yazılmıyor) |
| Bölüm başlığı sayacı | başlığın sağında "**720 tarif**" | "Günler · 4 gün · 20 hareket" |
| Kalem sayacı | menü tepsisinde kaç kalem | gün başlığında **"2/5"** · üstte **%oran** |
| Sağdaki panel (menü tepsisi) | girişe kapalı, ölçülemedi | **birebir kopyalanmadı** — bağlam farkı aşağıda |

**Referanstan zayıf kalan noktalar → nasıl kapatıldı:**
1. Girişsiz kullanıcıda bizde hiçbir şey yoktu (plan uçuyordu) → **kapı** kondu,
   üstelik referansın kendi cümle yapısıyla: ne olduğunu ve neden gerektiğini söylüyor.
2. Girişsizken ikon "yer imi"ydi, referans **kilit** kullanıyor → girişsizde
   `fa-lock`, girişlide `fa-bookmark`.
3. Referansın bölüm başlığı sayaç taşıyor, bizimki taşımıyordu → "Günler · N gün ·
   M hareket".

**Bilerek uyarlanan (kopyalanmayan):** referansın sağ paneli bir **sepet** —
kullanıcı gezerken tarif topluyor. DadaFit'te plan **tek nesne**; toplanacak bir şey
yok, izlenecek bir **ilerleme** var. Bu yüzden panel yerine (a) üst özet kartı,
(b) gün başlıklarında canlı `x/y`, (c) satır zemininde seviye rengi kuruldu.
- **Ekran görüntüsü:** `tasks/r6-shots/D/m18-g3-kaydet-1440.png` ·
  `m18-g3-kaydet-1440-girissiz.png` · `m18-g3-kaydet-390.png` ·
  `m18-g3-programim-1440.png` · `m18-g3-programim-isaretli-1440.png` ·
  `m18-g3-programim-390.png` · referans: `ref-gastro-sifirdan.png` · `ref-gastro-panel.png`

### Kabul ölçütleri

| Ölçüt | Beklenen | Ölçülen | ✅/❌ |
|---|---|---|---|
| "Planı Kaydet" → yenilemeden sonra plan duruyor | duruyor | @1440 ve @390: 1 kayıt, yenileme sonrası **duruyor** | ✅ |
| Görüntüleme sayfası planı tam basıyor | gün · hareket · set/tekrar | DOM'da **4 gün / 20 satır** = plandaki sayı; her satırda set + tekrar/süre + dinlenme + kütüphane köprüsü | ✅ |
| Bir hareket işaretlenip yenilenince işaret duruyor | duruyor | `g1-h0 = tam` yenileme sonrası duruyor; 3 işaret `aria-pressed="true"` | ✅ |
| `FIT_PLAN.ozet()` oranı = DOM göstergesi | birebir | `ozet().oran = 10` · DOM metni **"%10"** · çubuk **"10%"** | ✅ |
| Girişsiz kullanıcıda akış kırılmıyor | dürüst kapı ya da yerel kayıt | plan görünüyor (4 gün) · kaydet **kapıyı açıyor** · sessiz kayıt **yok** · `?plan=` bağlantısı yerinde | ✅ |
| Yeni sınama taban commit'te kırmızı (K27) | kırmızı | `8bf5c66`'ya karşı **9 sorun**; HEAD'de **0 sorun** | ✅ |
| Konsol hatası · @1440 ve @390 | 0 | 0 / 0 (oluşturucu + Programım) | ✅ |
| Yatay taşma | 0 | 0 / 0 | ✅ |
| Boş durum dürüst | uydurma veri yok | kayıt yokken 0 gün kartı + Oluşturucu'ya kapı | ✅ |

---

## Plan şeması — GERÇEK bir kayıt (AJAN-E ve lead için)

`localStorage['dm_fit_planlar_v1']` içinden **birebir alınmış** kayıt
(seçim: `kadin-kas-orta-yok-3-0-yok`, bir hareket "tam" işaretli):

```json
{
  "planlar": [
    {
      "id": "plan_mt275gpg_xzmlj4",
      "ad": "Vücut ağırlığı · 3 gün · Orta",
      "kaynak": "antrenman-olusturucu",
      "olusturma": "2026-08-21T00:14:02.452Z",
      "guncelleme": "2026-08-21T00:14:03.532Z",
      "secimler": {
        "cinsiyet": "kadin",
        "hedef": "kas",
        "seviye": "orta",
        "ekipman": ["yok"],
        "odak": [],
        "gunSayisi": 3,
        "durum": ["yok"],
        "bolunme": "full-body",
        "havuz": 15,
        "kod": "kadin-kas-orta-yok-3-0-yok"
      },
      "gunler": [
        {
          "no": 1,
          "ad": "Tüm Vücut A",
          "odak": "Bacak / İtiş / Çekiş / Core",
          "hareketler": [
            { "slug": "hamle", "ad": "Hamle (Lunge)", "set": 3,
              "tekrar": "8-12", "sure": null, "dinlenme": 75,
              "kalip": "Bacak", "grup": "Bacak" },
            { "slug": "yan-plank", "ad": "Yan Plank", "set": 3,
              "tekrar": null, "sure": "30-45 sn", "dinlenme": 75,
              "kalip": "Core", "grup": "Core" }
          ]
        }
      ],
      "ilerleme": {
        "g1-h0": { "yapildi": true, "seviye": "tam",
                   "tarih": "2026-08-21T00:14:03.532Z" }
      }
    }
  ],
  "aktifId": "plan_mt275gpg_xzmlj4"
}
```

**AJAN-E'nin bilmesi gerekenler:**
1. `secimler` sözleşme yorumundaki örnekten **farklı**: H3'ün soruları
   `mekan`/`sure` sormuyor. Gerçek alanlar: `cinsiyet · hedef · seviye ·
   ekipman[] · odak[] · gunSayisi · durum[] · bolunme · havuz · kod`.
   `gunSayisi` **sayı**, `ekipman`/`odak`/`durum` **dizi**.
   Sözleşme dosyasının başlık bloğu güncellenmedi (**lead'in dosyası**) —
   lead isterse yorumu bu gerçeğe çekebilir; koda etkisi yok.
2. Hareket kaydı sözleşmedeki `{slug, ad, set, tekrar, sure}` alanlarını taşıyor,
   üstüne `dinlenme · kalip · grup` ekliyor. **Tekrar ölçümlü** harekette
   `tekrar` dolu / `sure` null; **süre ölçümlü** harekette (plank · yan-plank)
   tersi. İkisini de basacak arayüz `h.tekrar ? h.tekrar+' tekrar' : h.sure`
   demeli — Programım sayfasında böyle yapılıyor.
3. `secimler.kod` **deterministik kimliktir**: aynı seçim ikinci kez
   kaydedilirse yeni kayıt açılmıyor, var olan güncelleniyor. `?plan=<kod>` ile
   oluşturucuya geri gidilir (Programım'daki "Seçimleri değiştir" düğmesi bunu yapıyor).
4. `ad` alanı `"<ekipman> · <n> gün · <seviye>"` biçiminde; üst özet kartında
   olduğu gibi basılabilir.
5. `FIT_PLAN.ozet()` **'atlandi'yı yapılan saymıyor** — Programım'daki
   `%oran` bu yüzden "işaretli" değil "tamamlanan" oranıdır. `fit-planim-v1`de
   aynı cümle kurulmalı ki iki sayfa aynı şeyi söylesin.

---

## Sınamada bulunan gerçek boşluk — `tests/workout-generator.mjs` 20. ölçütü

Madde 16'nın "salon" seçeneği, **sınamanın kendi havuz kurgusundaki** bir
boşluğu ortaya çıkardı ve süit kırmızıya döndü (ölçüldü, gizlenmedi):

- 20. ölçüt ("günün kalıbı korunuyor") havuzu **kendi** yeniden kuruyordu:
  `ek.filter(x => x !== 'yok')`. `salon` gerçek bir `gerek` değeri olmadığı için
  bu kurguda hiçbir dambıl/bant hareketi havuzda görünmüyor, dolayısıyla
  `kalipOf[slug]` **undefined** oluyor ve motorun doğru seçtiği her ekipmanlı
  hareket "kalıp dışı" sayılıyordu. **7 sahte hata** yazdı.
- **Motorda hata yok**: aynı bileşimlerde 5. ve 17. ölçütler yeşildi, plan
  doğru kuruluyordu.
- **Düzeltme ölçütü zayıflatmadı:** sınama artık küme açılımını **kural
  tablosundan** okuyor (`AO_KURALLAR.ekipmanSuzme.kume`) ve motorun
  `ekipmanAc()`'i ile aynı şeyi yapıyor — teste ikinci bir liste yazılmadı.
  Kontrolün sertliği aynı; yalnız havuz artık doğru kuruluyor.

## Verilen kararlar (gerekçe + nasıl geri alınır)

1. **6. seçenek "Tam ekipman (salon)" seçildi; yeni bir ekipman kategorisi
   uydurulmadı.** Katalogda beş `data-ekipman` değeri var; altıncı bir kategori
   (makine · halter · halka) hiçbir kartla eşleşmez, yani **dekoratif** olurdu.
   Değerlendirilen tek gerçek alternatif "Sehpa / bench"ti: `sehpa-dips` ve
   `bulgar-split-squat`u ekipmansız havuzdan çıkarırdı → taban havuz **15 → 13**,
   ekipmansız **itiş** hareketi **2 → 1**. "Karşılıksız kombinasyon 0"un dayandığı
   taban zayıflardı, kazanç yoktu. *Geri alma:* `KURALLAR.ekipman.salon` ve
   `ekipmanSuzme.kume/tekKip` silinir, soru `kol:2`ye döner (iki dosyada birden).
2. **"salon" ötekileri temizliyor (tekKip).** "Yok" ile dambıl çelişir, "salon"
   dördünü zaten kapsar. Davranış tek yerden okunuyor: soru `tek:` alanı.
   *Geri alma:* `tekKip`ten `'salon'` çıkarılır.
3. **Odak sorusu ızgaradan çıkıp çip dizisine geçti.** 7 kalem hiçbir sütun
   sayısına bölünmüyor; ızgarada her koşulda boş kutu kalıyordu. *Geri alma:*
   sorudan `cip:true` kaldırılır.
4. **İşaretleme seviyesi = sözleşmenin sabit üçlüsü (tam · yarim · atlandi),
   set-tekrar girişi değil.** Sözleşme `SEVIYELER`i sabitlemiş; ayrıca motorun
   reçetesi zaten set/tekrar yazıyor, kullanıcıdan ikinci kez sayı istemek plan
   görüntülemeyi forma çevirir ve `ozet().oran` ↔ DOM birebirliğini bulandırırdı.
   *Geri alma:* satırdaki `.pp-isaret` bloğu sayı girdisiyle değiştirilir; ama
   önce sözleşme değişmeli (lead'in dosyası).
5. **Girişsiz kullanıcı: dürüst kapı + `?plan=` kalıcılığı.** Karar ölçümle
   verildi: kardeş markada aynı eylem (Menüye Ekle) girişsizken kapı açıyor.
   Yerel kayıt seçilseydi "kaydedildi" derken hiçbir hesaba bağlanmayan bir
   söz verilmiş olurdu. Akış kırılmıyor: plan üretiliyor, görünüyor ve
   deterministik bağlantısı kopyalanabiliyor — kapı metni bunu **söylüyor**.
   *Geri alma:* `kaydetHtml()`teki `kapi` değişkeni boşaltılır; işleyici zaten
   girişten bağımsız çalışıyor.
6. **Gün kartları açılır (details) oldu, sıradaki gün açık geliyor.** Sayfa
   @390'da 7546 px'ti. Plan **DOM'da eksiksiz** duruyor; kapalı olan yalnız
   görünürlük. *Geri alma:* `gunHtml()`teki `(simdi ? ' open' : '')` yerine her
   zaman `open` yazılır.
7. **Plan bloğu sayfanın en üstünde, "Aktif program" kartının üstünde.**
   Kaydetten sonra gelen derin bağlantı (`?plan=<id>`) kullanıcıyı buraya
   düşürüyor; altta kalsaydı ekranın dışında olurdu. Kayıt yokken blok tek bir
   kompakt kart (boş durum + Oluşturucu'ya kapı), ölü alan bırakmıyor.
   *Geri alma:* `#ppPlan` div'i `.fp-card.is-dark`ın altına taşınır.
8. **Yeni sayfa üretilmedi.** Madde 18.3'ün istediği gibi var olan
   `fit-planim-programim-v1.html` kullanıldı; sayfanın kendi "Aktif program /
   haftalık takvim / geçmiş programlar" içeriğine dokunulmadı.

---

## Kabukta gördüğüm ama DOKUNMADIĞIM eksikler (AJAN-A'ya)

1. **Madde 3 senin tarafından uygulanmış — dokunmadım, ölçtüm:** ortak ağaçta
   `.hr-note` artık `.wg-legal` sınıfıyla **kartın içinde**
   (`el.closest('.wg-card')` → truthy), `.fit-health` **0 düğüm**,
   `saglik-bilgilendirme-v1.html` bağlantısı sayfada **2 kez** (kart bandı +
   yasal bant). Benim eklediğim kaydet bandı bu bandın **üstünde**, kartın
   dışında; ikisi çakışmıyor.
2. **R11 perdesi @390'da kapalı:** `main.margin-bottom` @1440 ve @1024'te
   footer yüksekliğine **birebir** eşit (fark **0.00**), @390'da `margin-bottom:0`
   iken footer 1281.83 px. Benim iki sayfamda da aynı; **kabuğun kendi davranışı**,
   bu turda ben değiştirmedim. Kasıtlıysa DEVIR notuna geçmeli, değilse maddesi yok.
3. **`fit-planim-programim` banner'ı LİSTE ailesinde ölçülüyor** (544/607/587) —
   `.fp-top` kullanıyor ama `data-fit-hero-kind` LİSTE veriyor. Madde 4'ün dikey
   şerit düzeni buraya gelirse `.fp-top`un kendi `.fp-who` bloğuyla çakışabilir;
   ölçmeni öneririm.
4. **Girişsiz kapının metni `data-lg-desc` ile geliyor ve uzun metinlerde
   kırpılmıyor** — benim kapı metnim iki cümle; `#lgGate` içinde sığdı, ama
   bileşende maksimum uzunluk sınırı yok. Bilgi olarak yazıyorum.

---

## Bozulmadığını kanıtladıklarım

| Ne | Ölçüm |
|---|---|
| Banner ailesi (LİSTE) | `antrenman-olusturucu-v1.html`: **@1440 544 · @1024 607 · @390 587** — `tests/workout-generator.mjs` 12. ölçütü de yeşil |
| Banner ailesi (Programım) | **544 / 607 / 587** — değişmedi |
| R11 footer perdesi | `main.margin-bottom − footer` = **0.00** (@1440 579.53/579.53 · @1024 1100.69/1100.69), iki sayfada da aynı |
| `.fit-health` | iki sayfada da **0 düğüm** (AJAN-A'nın madde 2'si; ben bir şey eklemedim) |
| `tests/workout-generator.mjs` | **0 sorun** (son koşu, iki genişlik) — 44 bileşim × 2, kural tablosu birebir (14181 karakter), 25 hareket adı kanonik, 20. ölçüt yeşil (kalıp dışı hareket 39 günde girdi, hepsinde günün kalıbı tükenmişti), yeni **21. ölçüt** @1440 `3+3` ve @390 `1×6` ile yeşil |
| `tests/plan-kayit.mjs` (yeni) | HEAD: **0 sorun** (son koşu, 31 ölçüm) · taban `8bf5c66`: **9 sorun** (K27 kırmızı kanıtı alındı, worktree kaldırıldı) |
| `tests/plan-account.mjs` | **0 sorun** — Planım rayı 7 kalem, Hesabım rayı tekrarlamıyor, ray dışı 4 sayfa yetim değil |
| `tools/page-check.mjs antrenman-olusturucu-v1.html 1440` | **temiz** — kabuk mount ✓ · konsol 0 · 4xx 0 · yatay taşma 0 · 126 iç bağlantı sağlam. Tek not: `href="#" sayısı: 8` — **kabuktan geliyor**, sayfa kaynağında `href="#"` **0** (taban commit'te de 0), benim eklediğim hiçbir bağlantı boş değil |
| Risk dalı | ağrı/sağlık/gebelik/hareketsizlik yanıtında kişisel plan üretilmiyor — sınamanın risk ölçütü yeşil; kaydet bandı **risk dalında hiç basılmıyor** (`sonucHtml()` risk kolunda `kaydetHtml()` çağrılmıyor) |
| Determinizm (K41/AS-2) | `Math.random` yok; aynı seçim 3 kez → birebir aynı plan (sınama 6) |
| K44 sözleşmesi | belge ↔ kod **14181 karakter birebir**; belge betikle sayfadan üretildi, elle kopyalanmadı |
