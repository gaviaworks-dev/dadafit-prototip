# DEVİR NOTU — REVİZE TURU 4

**Tarih:** 19.08.2026 · **Taban commit:** `a0c2afc` · **Plan:** `REVIZE-PLAN-4.md`
**Kararlar:** `KARARLAR.md` (bu turda **K21–K28**) · **Konsept:** `tasks/H0-YENI-MODUL-KONSEPT.md`

---

## ÖZET SATIRI

| | Sonuç |
|---|---|
| **Madde** | **R1–R10 + H0 → 11/11 uygulandı**, her biri ayrı commit |
| **Tam site taraması** (@1440 **ve** @390) | **60/60 sayfa HTTP 200** · **6.455** iç bağlantı · kırık bağlantı **0** · kırık çapa **0** · 4xx alt kaynak **0** · konsol hatası **0** · yatay taşma **0** |
| **Test süiti** (`tests/*.mjs`) | **5/5 temiz** — a11y-focus · coach-list · dropdown-position (36 panel) · header-banner (20 sayfa × 4 genişlik) · plan-account |
| **Kalite kapısı** (`tools/page-check.mjs`) | dokunulan sayfalarda 1440 ve 390'da **temiz** |
| **Working tree** | **temiz** |
| **Push** | ❌ **YAPILMADI** — Beyar'ın izni bekleniyor (kalıcı kural) |

> **BEYAR BUNU BİLMELİ:** tur boyunca Beyar canlı adrese bakıp *"banner bozuk hâlâ"*
> dedi. **Haklıydı ve sebebi push'suzluk:** `gaviaworks-dev.github.io/dadafit-prototip`
> hâlâ **3. turun** hâlini gösteriyor. Bu turun 12 commit'i **yalnız lokalde.**
> Sonraki oturumun ilk sorusu: *"push edelim mi?"*

---

## 1 · MADDE MADDE DURUM

| # | Madde | Durum | Tek cümlelik sonuç |
|---|---|---|---|
| **R1** | Banner hizası geri alındı | ✅ | Dikey ortalama kalktı; yatay hiza 51/51 sayfada 132 px'e döndü; **kırpılan içerik 28 → 0** |
| **R2** | Banner aile sınıflandırması | ✅ | **60 sayfanın 60'ı** sınıflandı (47 liste + 4 detay + 6 imza + 3 banner'sız) |
| **R3** | Kırıntı ana sayfa ikonu | ✅ | 58 sayfada yalnız ikon, tek boyut (13 px), tek renk, erişilebilir ad korundu |
| **R4** | Filtre kartı referansa hizalandı | ✅ | 7 sayfada çubuk **62 px**, 23 eksende panel ölçüleri **sapma 0** |
| **R5** | Her eksende arama | ✅ | Arama alanı **3/23 → 23/23**; süzme ve boş durum 23/23 çalışıyor |
| **R6** | Dropdown yönü | ✅ | Sayfanın en altında bile **23/23 eksen AŞAĞI** açılıyor (önce 11'i yukarıydı) |
| **R7** | Çip radius'u | ✅ | Seçili etiket çipi 999 px → **12 px**; ölçek içi literal **29 → 0** |
| **R8** | Dikey tutarsızlık | ✅ | Bölüm dolgusunda tekil değer **26 → 3**; ikiden fazla değeri olan sayfa **29 → 0** |
| **R9** | Açık kalan kontroller | ✅ | a) adlandırma kesinleşti (K25) · b) sihirbaza iki blok eklendi (K26) · c) şerit görsel doğrulandı |
| **R10** | Doğrulama borcu | 🟢🟡 | Altı ajan koştu; **A ve E tam rapor döndürdü → YEŞİL** ve **üç gerçek kırmızı buldurdular** (üçü de düzeltildi). B · D · F · G raporsuz → **SARI** (§2) |
| **H0** | Yeni modül konsepti | ✅ | `tasks/H0-YENI-MODUL-KONSEPT.md` — şema · sayfa yapısı · bağ şeması · 8 soru |

---

## 2 · DOĞRULAMA DURUMU (R10) — **2 YEŞİL · 4 SARI**

Altı bağımsız ajan açıldı, brief'te talimat açıkça yazıldı
(*"raporunu MESAJLA gönder, dosyaya YAZMA"*), üç ayrı çağrı yapıldı.
**İki ajan tam rapor döndürdü — ama 30 dakikalık beklemeden ve fazın sarı
kapatılmasından SONRA.** Diğer dördünün üçünde **API bağlantı hatası**
raporlandı ("Connection lost mid-response").

| Faz | Ajan | Çalıştı | Ölçüm | **Rapor metni** | Renk |
|---|---|---|---|---|---|
| **A** | `dogrula-A4` | ✅ | 29 dosya | ✅ **tam rapor** | 🟢 **YEŞİL** — 8/8 madde, **1 kırmızı buldurdu** |
| B | `dogrula-B4` | ✅ | — | ❌ (API hatası) | 🟡 **SARI** |
| D | `dogrula-D4` | ✅ | 27 dosya | ❌ (API hatası) | 🟡 **SARI** |
| **E** | `dogrula-E4` | ✅ | 35 dosya | ✅ **tam rapor** | 🟢 **YEŞİL** — E1–E8, **2 kırmızı buldurdu** |
| F | `dogrula-F4` | ✅ | 20 dosya | ❌ | 🟡 **SARI** |
| G | `dogrula-G4` | ✅ | 24 dosya | ❌ (API hatası) | 🟡 **SARI** |

**Yeşil: 3 faz (C — 3. turdan · A · E). Sarı: 4 faz (B · D · F · G).**
B · D · F · G'nin ham çıktıları **OKUNMADI** — kural bunu açıkça yasaklıyor (K19).

### Gelen raporların buldurduğu ÜÇ KIRMIZI — üçü de bu turda düzeltildi

| # | Bulgu | Düzeltme + ölçüm |
|---|---|---|
| **K-A1** | **Antrenör kartlarının 5'i YANLIŞ profile gidiyordu.** Merve Tan → `?slug=burak-demir`, Zeynep Arı → Ece Yalçın, Burak Demir → Mert Özkan, Elif Şahin → Deniz Kaya, Naz Erdem → Can Aydın. Detay sayfası slug'ı gerçekten çözüyor: kullanıcı **başka birinin profiline düşüyordu.** Bağlantılar **kırık değildi** (HTTP 200) — bu yüzden hiçbir tarama yakalamamıştı. | Dizindeki sekiz antrenörün **dördü** detay haritasında hiç yoktu; eklendiler, beş `href` kendi slug'ına döndü. **8 kartın 8'i kendi profiline gidiyor, ad eşleşmesi 8/8.** |
| **K-A2** | **`unvan` ve `fiyat` verisi ölüydü.** Haritada slug başına fiyat (₺380–₺520) vardı ama `.cta-price` markup'ta sabit **₺450**, `.cp-spec` sabit tek satır. Her antrenör aynı fiyatı gösteriyordu. | İkisi de slug'dan geliyor. **8 antrenör → 8 farklı fiyat, 8 farklı uzmanlık satırı.** |
| **K-E1** | **Yaslanmış metinde "nehir" boşlukları — R9'un ÜRETTİĞİ içerikte.** K12 uyarı bloklarını istisna tutuyor ama R9'da eklenen `.wz-risk p` / `.wz-how-note` listede yoktu. @390 Range ölçümü: `.lib-sub` 5.6 → **20.1 px** (3.6×), `.wz-risk p` 3.4 → **15.8 px** (4.6×). Risk uyarısının kalın cümlesi tek satırda üç kelimeye düşüyordu — **en net kalması gereken güvenlik mesajı.** | İstisna listesine `.wz-risk` · `.wz-how` · `.wz-how-note` · `.wz-why` · `.lib-sub` · `.fs-lead` · `.ft-lead` · `.cp-spec` eklendi. **Beşinde de `text-align:left`.** |

### Raporların açtığı, KARAR BEKLEYEN yedi not
`REVIZE-PLAN-4.md` R10.2 → N1–N7. Özet: gizlenen etiketler ekran okuyucudan da
kayboluyor ama koddaki yorum aksini söylüyor (N1) · video kartlarında Pro rozeti
duruyor ama filtre ekseni yok (N2) · sihirbazda yanıt zorunluluğu yok (N3) ·
üç tetikleyiciden yalnız birinde `aria-expanded` (N4) · kütüphane iki farklı
etiketle anılıyor (N5) · CTA 42.92 px, 44 px eşiğinin altında (N6) · etiket
rayında 87 px'e varan boş kuyruk (N7).

> **B9 — doğrulama kanalı gecikmeli ve güvenilmez, AMA değerini kanıtladı.**
> 3. turda 5 ajandan 1'i, 4. turda 6 ajandan 2'si rapor döndürdü; ikisi de
> faz sarı kapatıldıktan sonra. Dört kayıptan üçü **API bağlantı hatası**.
> Buna karşılık gelen iki rapor **üç gerçek kırmızı** buldurdu — biri
> kullanıcıyı yanlış antrenörün profiline götürüyordu ve ana oturumun
> hiçbir ölçümü onu görmemişti. `KARARLAR.md` **K27**: kabul ölçütlerini
> `tests/*.mjs` süitine çevir + ajandan yapılandırılmış çıktı zorunlu kıl.
> **Beyar seçmeli.**

---

## 3 · BU TURUN BEKLENMEDİK BULGULARI

| # | Bulgu | Nerede |
|---|---|---|
| **B1** | 3. turun *"taşan/kırpılan içerik 0"* ölçümü **yanlıştı**. 51 banner sayfasının **28'inde** içerik sabit kutudan taşıp `overflow:hidden` ile kırpılıyordu; en kötüsü `program-liste-v1` **−112 px** (CTA satırı ve istatistikler tamamen görünmez). 3. tur taşmayı yalnız **üst** kenardan ölçmüş. | R1 |
| **B2** | `justify-content:safe center` yalnız dikeyi değil **yatayı da** bozmuş: `.wrap` flex item olunca `margin:0 auto` `stretch`'i iptal ediyor, kutu shrink-to-fit oluyor ve sol kenar sayfa sayfa **234–466 px** arasında değişiyordu. | R1 |
| **B3** | `egzersiz-detay-v1` **iki kuralın da dışında** kalmış: `.ed-top` over-mode listesinde yoktu (header koyu görselin üstünde **katı** kalıyordu — K11'in düzelttiği kusurun altıncısı) ve sabit yükseklik kuralı onu okumuyordu (**216.3 px**, aileden 167.7 px sapma). | R2 |
| **B4** | Kırıntı ev ikonu **beş farklı boyut ve beş farklı renkteymiş** (9 · 12 · 12.5 · 13 px · `rgba(255,255,255,.34)` … ). En kötüsü `antrenor-ol`: **%34 alfa beyaz**, koyu banner üzerinde ve metin kalkınca sayfadaki **tek** ana sayfa bağı. | R3 |
| **B5** | Mobil filtre çekmecesinde odak **bilerek** arama alanına gitmiyor (ilk çipe gidiyor) — metin alanına otomatik odak ekran klavyesini açıp çekmecenin yarısını kapatır. Değiştirilmedi, belgelendi. | R6 |
| **B6** | Depodaki gerçek radius ölçeği Beyar'ın saydığından **farklı**: kart **16 px** (dediği 12), TİP B kart **24 px**, `.btn` **12 px** (dediği 10). Çip 12'ye çekildi, gerekçe K24'te. | R7 |
| **B7** | Filtre çubuğunun üç sayfada **85.9 px**, dördünde **62 px** olmasının sebebi sayfaya ait sayaç düğümünün **kendi dikey marjı** (`margin:22px 0 18px`) — flex satırı **marjlı dış ölçüden** hesaplanıyor. Kabuğun eski sıfırlaması yalnız kabuğu sıfırlıyordu. | R4 |
| **B8** | **Test süiti sessizce kırmızıydı.** `plan-account` eski `.pf-tabs .dt` seçicisiyle **0 kalem** buluyordu ve taban commit'te de kırmızıydı — yani gerçek bir gerilemeyi artık yakalayamazdı. `coach-list`'in sticky sınaması da yanlıştı (sticky öğe kapsayıcı bloğunu terk edemez). Üçü de düzeltildi, süit **5/5 temiz**. | test |

---

## 4 · BEYAR'A AÇIK SORULAR

### Bu turdan yeni

| # | Konu | Soru |
|---|---|---|
| **S6** | R4 | Referans filtre çubuğunda sağ uçta **sıralama şeridi** var (Popüler · Yeni · A–Z); `challenge-merkezi` · `programlar-merkezi` · `hareket-merkezi` çubuklarında **yok** (o sayfalarda sıralama motoru yazılmamış). Ölçüler artık birebir aynı; kalan tek görsel fark bu. Sıralama o üç sayfaya da eklensin mi? |
| **S7** | R7 | Çip yarıçapı **12 px** yapıldı. Ölçülen kart değeri **16 px** ama 32 px'lik çipte 16 = tam hap, yani şikâyeti çözmezdi. 16 istenirse tek token (`--radius-chip`). Onaylıyor musun? |
| **S8** | R1 | `.cp-top` (antrenör detayı) sabit kutudan çıkarıldı — içinde randevu kartı var, kutuda kartın **75.2 px**'i kırpılıyordu. Taban 384 korundu, ölçülen 477.2. Onaylıyor musun? |

### H0'ın sekiz sorusu
`tasks/H0-YENI-MODUL-KONSEPT.md` §6 — hepsi somut seçenekli, her birinde öneri var:
konsept teması · yeni hareket kartı sayısı · "140+ hareket" iddiası · anatomi görseli ·
sözlük derinliği · terim sayısı · dosya/adres yapısı · "evde alternatif" alanı.

### Önceki turdan devreden

| # | Konu | Soru |
|---|---|---|
| **S1** | E1 | Kart üzerindeki altın **PRO rozeti** ve "Başlangıç · Ücretsiz" etiketi duruyor. Kart rozetleri de gitsin mi? |
| **S2/S3** | H | Kabuk üst bandındaki **"140+ hareket"** iddiası duruyor; gerçek 12, H0 planı sonrası 38. (H0 §6 S3'te seçenekli soruldu.) |
| **S4** | B4 | `--fit` (#009d4f) + beyaz metin **3.54:1** — AA altı. Site geneli `.btn-fit` de koyulaşsın mı? |
| **S5** | D3 | İmza banner'ları (şimdi **altı** tane) sadeleşip aileye katılsın mı? |
| ~~S3 (eski)~~ | G2 | ✅ **KALICI KAPANDI** — K25. Bir daha soru olarak açılmayacak. |

---

## 5 · BU TURDA KABUĞA GİREN / DEĞİŞEN ŞEYLER

Hepsi `assets/css/fit-shell.css` + `assets/js/fit-shell.js` — sayfa sayfa kopyalanmaz.

| Ne | Nerede | Not |
|---|---|---|
| **Banner sütun-sarmalı** | `.lib-top`/`.fs-top` `> .wrap` `flex-flow:column wrap` + `height:100%` | Sığmayan blok kırpılmak yerine sağdaki boş alana ikinci kolon olur. `:has()` ile yalnız `.lib-sub`/`.fs-lead` taşıyan banner'lara uygulanır |
| **`.crumb-home`** | kırıntının ilk kalemi | Yalnız ikon + `.sr-only` etiket · 13 px · `--fit-bright` (koyu zemin) / `--fit-deep` (açık zemin) |
| **`.ff-count{margin:0}`** | filtre çubuğu | Sayfaya ait sayaç marjının çubuğu şişirmesini keser |
| **Arama eşiği kalktı** | `realChips.length > 0` | Her eksende arama alanı |
| **Üç kademeli panel yerleşimi** | `placePop()` | aşağı → sayfayı kaydırıp yer aç → son çare yukarı (`MIN_DOWN=200`) |
| **`--radius-chip` · `--radius-ctl` · `--radius-badge`** | `:root` | 12 · 10 · 6 px — Beyar'ın saydığı ölçeğin üç basamağı |
| **`--sec-pad-sm`** | `:root` | 32 px (≤1024: 26 · ≤640: 22) — dikey ölçeğin ikinci basamağı |
| **`secimlerinHtml()` · `nasilHtml()`** | sihirbaz | "Seçimlerin" ve "Bu öneri nasıl kuruldu?" blokları |
| **`.ed-top` over-mode + detay ailesi** | JS `OVER_MODE` listesi + CSS | `egzersiz-detay` artık diğer koyu banner'larla aynı davranıyor |

---

## 6 · DEĞİŞMEYEN KALICI KURALLAR

1. Ortak bileşen sayfa sayfa kopyalanmaz — kabuktan yönetilir.
2. **Ölçmeden "düzeldi" denmez.** Ölçülemeyen şey "doğrulanmadı" diye raporlanır.
3. Bir test, kırmızıya döndüğü görülmeden yeşil sayılmaz.
4. **Push her seferinde ayrı izin ister.** Commit serbest, push değil.
5. Mevcut tasarım dili korunur (DadaFit yeşili, Gilroy, kart dili, radius, grid).
6. Alt ajan commit atmaz.
7. Font Awesome **PRO** ikonu kullanılmaz.
8. Durum özniteliğini yalnız kuruluşta düzeltmek yetmez — **etkileşimden sonra** ölç.
9. Metin değişimi yaparken hedefin bir **JS dizesi** içinde olup olmadığına bak.
10. **YENİ (bu turdan):** taşma ölçümü **dört kenardan** yapılır. 3. tur yalnız üst
    kenarı ölçtüğü için 28 sayfada kırpılan içeriği kaçırdı (B1).
11. **YENİ (bu turdan):** bir sınama kırmızı verdiğinde **önce taban commit'e karşı
    koştur.** Bu turda üç kırmızının ikisi bayat testti, biri gerçek gerilemeydi —
    ayrımı ancak taban ölçümü gösterdi (B8).
12. **YENİ (bu turdan):** flex satır yüksekliği öğenin **marjlı dış ölçüsünden**
    hesaplanır. Bileşen kabuğunu sıfırlamak yetmez, içine giren sayfa düğümünün
    marjını da sıfırla (B7).

---

## 7 · SONRAKİ OTURUMUN İLK ÜÇ ADIMI

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -3 && git status --short
python3 -m http.server 8811 &          # zaten çalışıyorsa atla
export PW_HOME=~/.pw
```

**Adım 1 — Beyar'a push'u sor.** Bu turun 12 commit'i lokalde; canlı adres hâlâ
3. turun hâlini gösteriyor ve Beyar bunu fark etti.

**Adım 2 — Zemini doğrula (5 dk).**
Test süiti: `for t in a11y-focus coach-list dropdown-position header-banner plan-account; do node tests/$t.mjs; done`
→ **5/5 temiz** olmalı. Tam site taraması → **60/60 · 6.455 bağlantı · 0 kırık**.

**Adım 3 — Beyar'ın cevaplarını bekleyen işler.**
H0'ın sekiz sorusu + S1 · S4 · S5 · S6 · S7 · S8. Cevap gelmeden H0'ın üretim
sırasına (§7) başlanmaz — kapsam sayıları oradan çıkıyor.

---

## 8 · BU TURUN COMMİT'LERİ

| # | Hash | Özet |
|---|---|---|
| 1 | `538d0cc` | **R1** — banner hizası geri alındı, içerik artık kırpılmıyor |
| 2 | `62bc79f` | **R2** — aile sınıflandırması kapandı, 60/60 sayfa |
| 3 | `353492d` | **R3** — kırıntının ana sayfa kalemi yalnız ikon |
| 4 | `231ed16` | **R4** — filtre çubuğu referansa hizalandı (62 px) |
| 5 | `34a1d0d` | **R5** — arama her eksende (3/23 → 23/23) |
| 6 | `c9c98ae` | **R6** — panel aşağı açılıyor, yukarı son çare |
| 7 | `dfaa9af` | **R7** — çip 12 px, yarıçap ölçeği token'landı |
| 8 | `01d535b` | **R8** — dikey ölçek: 26 değer → 3 |
| 9 | `e9f318d` | **R9** — sihirbaza iki blok, adlandırma kesinleşti, şerit doğrulandı |
| 10 | `1a9941e` | **H0** — üç yeni modül konsept önerisi |
| 11 | `bdd5163` | test — üç bayat sınama düzeltildi, süit 5/5 |

**Taban:** `a0c2afc`. **Hiçbiri push edilmedi.**
