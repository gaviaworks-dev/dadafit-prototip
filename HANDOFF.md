# DEVİR NOTU — REVİZE TURU 3

**Tarih:** 18.08.2026 · **Taban commit:** `9f9c8b7` · **Son commit:** `74ee4ec`
**Plan dosyası:** `REVIZE-PLAN-3.md` · **Kararlar:** `KARARLAR.md` (K13–K19)
**Bu turda 13 commit atıldı, HİÇBİRİ PUSH EDİLMEDİ.**

---

## 1 · Fazların durumu

| Faz | İş | Uygulama | Doğrulama |
|---|---|---|---|
| **A** — Antrenör kartları (A1–A6) | ✅ bitti | ölçüldü, geçti | 🟡 **bağımsız değil** |
| **B** — Sekme bileşeni (B1) | ✅ bitti | ölçüldü, geçti | 🟡 **bağımsız değil** |
| **C** — Filtre bileşeni (C0–C5) | ✅ bitti | ölçüldü, geçti | 🟢 **bağımsız** — bir kırmızı buldurdu, düzeltildi |
| **D** — Global temizlik (D1, D2, D3) | ✅ bitti | ölçüldü, geçti | 🟡 **bağımsız değil** |
| **E** — Programlar + video (E1–E6) | ✅ bitti | ölçüldü, geçti | 🟡 **bağımsız değil** |
| **F** — Challenge (F1–F3) | ✅ bitti | ölçüldü, geçti | ⚪ **ajan hiç çalışmadı** |
| **G** — Enerji Defteri (G1, G2) | ✅ **bitti** | ölçüldü, geçti | ⚪ **ajan hiç çalışmadı** |
| **H** — İçerik ve veri (H1) | ⛔ **başlanmadı** (Beyar'ın talimatı) | — | — |

> **ÖNEMLİ — Beyar'ın devir talimatındaki varsayım düzeltmesi:**
> Talimat "Faz G'ye başlama, altı yeni HTML üretecek" diyordu. **Faz G bu turda
> zaten tamamlandı ve `10370f4` ile commit'lendi.** Altı değil **üç** yeni dosya
> üretildi (aşağıda §4). Yani G önümüzde değil, arkamızda; önümüzdeki tek
> uygulama işi **Faz H**, artı **doğrulama borcu** (§2).

### Neden sarı — doğrulama zinciri kırık

Her fazın sonunda bir doğrulama ajanı çalıştırıldı (`dogrula-A` … `dogrula-E`).
Beşi de ölçüm script'i yazıp koştu; ham çıktılar `scratchpad/verify-*/` altında.
**Ama yalnız `dogrula-C` rapor metni döndürdü.** Diğer dördü iki ayrı istekten
sonra da yalnız "boşta" bildirimi gönderdi; ham çıktılarını **ana oturumda ben
okudum**. Ölçen ile yorumlayan aynı taraf olduğunda bu bağımsız doğrulama
sayılmaz — bkz. `KARARLAR.md` **K19**.

**Farkın kanıtı:** rapor gönderen tek ajan, benim **temiz** raporladığım bir
noktada gerçek bir kusur buldu (aşağıda §3).

---

## 2 · Sonraki oturumun İLK ÜÇ ADIMI

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -3 && git status --short
python3 -m http.server 8811 &          # zaten çalışıyorsa atla
export PW_HOME=~/.pw                   # playwright-core 1.62.1 orada
```

**Adım 1 — Zemini doğrula (5 dk).**
Tam site taramasını tekrarla; bu turun sonunda **60 sayfa / 3.575 bağlantı /
0 kırık / 0 konsol hatası** ile kapandı, aynı sonucu almalısın:
`scratchpad/final-scan.mjs` hazır, `PW_HOME=~/.pw node final-scan.mjs`.
Sayı tutmuyorsa önce onu çöz, yeni işe girme.

**Adım 2 — Doğrulama borcunu kapat (§1'deki sarılar).**
A · B · D · E · F · G için doğrulama ajanlarını yeniden çalıştır. **Kritik
kural:** ajan rapor METNİ döndürmüyorsa ham çıktısını ana oturumda okuyup
yeşile çevirme — sarı bırak ve öyle raporla. Ajan brief'lerinde "raporu
mesajla gönder, dosyaya yazma" talimatı açıkça olsun.

**Adım 3 — Faz H'yi aç (asıl kalan iş).**
Aşağıdaki §3'teki **B8 bulgusu** H'nin ilk maddesidir. Önce veri kaynağını
Beyar'a sor (H1 "veri kaynağı henüz belirlenmedi" diyor), sonra kartları üret.

---

## 3 · B8 bulgusu ve Faz H'nin onu nasıl kapatacağı

**Bulgu (dogrula-C ölçtü):** `egzersiz-kutuphane-v1.html` filtre çubuğu,
12 kartlık prototip verisinin **karşılayamadığı 13 seçenek vaat ediyor.**

| Eksen | Seçenek | Kartta karşılığı olan | Karşılıksız |
|---|---|---|---|
| Ekipman | 15 | 4 (ekipmansız · dambıl · kettlebell · direnç bandı) | **11** — halter · kablo · sabit makine · askı bandı · sağlık topu · pilates topu · step · bench · barfiks barı · atlama ipi · foam roller |
| Kas grubu | 10 | 8 | **2** — triceps · ön kol |

**Bu bir kırılma DEĞİL.** Davranış temiz: `?ekipman=halter` → 0 kart,
"0 hareket bulundu", `.lib-empty` boş durumu görünüyor. Sorun **vaat ile arz
arasındaki boşluk**: kullanıcı 15 ekipman görüyor, 11'i hiçbir zaman sonuç
vermiyor.

**Eksen listesi kısaltılmadı — bilerek.** Liste Beyar'ın C4'te birebir
verdiği listedir; kısaltmak talimatı geri almak olurdu.

**Faz H bunu şöyle kapatır:**
1. Her karşılıksız değer için **en az bir hareket kartı** üret
   (11 ekipman + 2 kas grubu = en az 13 yeni kart).
2. H1'in kendi maddeleri de aynı veri turunda: **ekipman bilgisi** (zaten
   `data-ekipman` var, içerik lazım), **terim açıklamaları** (hareketin ne
   demek olduğu), **gym dışı çeşitlilik** (bisiklet · CrossFit · yoga türü).
3. Kartlar geldikçe **iki sayacı birlikte güncelle**:
   `.lib-stat` (hareket · kas grubu · seviye — şu an **12 · 8 · 3**, gerçek
   veriden sayılıyor) ve alt satırdaki "N / N hareket gösteriliyor".
4. **Beyar'a soru S2 hâlâ açık:** kabuğun üst bandındaki site geneli
   **"140+ hareket"** iddiası duruyor ve `dadafit-hub` · `giris` ·
   `hareket-merkezi` de aynı sayıyı söylüyor. Gerçek veriye çekilecekse
   dört yerde daha değişir.

**dogrula-C'nin buldurduğu ve DÜZELTİLEN kırmızı (tekrar etmesin):**
`.df-fchip` çiplerinde `role="option"` ile `aria-pressed` aynı anda duruyordu
(24 çip). Kabuk özniteliği **kuruluşta bir kez** siliyordu; iki sayfanın kendi
boyama fonksiyonu kabuktan **sonra** çalışıp geri koyuyordu. Üç yerde çözüldü:
kabuk `sync()` her turda siliyor · `fit-testleri-v1` ve `aktivite-gunlugu-v1`
markup'ından statik öznitelik kalktı (15 + 9) · boyama fonksiyonları
`aria-selected` yazıyor. Sıralama düğmelerindeki `aria-pressed` **korundu**
(onlar gerçek toggle). Ölçüm: 7 sayfa · 125 çip · `aria-pressed` kalan **0**.
**Ders:** durum özniteliğini yalnız kuruluşta düzeltmek yetmez; sayfa motoru
sonradan geri koyabilir — her senkronda düzelt ve **etkileşimden sonra** ölç.

---

## 4 · Faz G'nin tam kapsamı (ne yapıldı, ne kırılmamalı)

### G1 — Enerji Defteri profile taşındı
`assets/js/fit-shell.js` → `NAV` dizisinden `{key:'defter'}` kalemi
**kaldırıldı** (beş alt kalemiyle birlikte). Üst menü artık dört başlık:
**Hareket · Programlar · Challenge · Antrenörler.**
Erişim üç kapıya taşındı, üçü de canlı:
- `PLAN_TABS` → Fit Planım sekme rayının **7. kalemi**
- `ACCOUNT_ITEMS` → hesap (profil) menüsü
- `FOOTER_COLS[0]` → footer "DadaFit" kolonu

Eski alt kalemlerin hedefleri `PLAN_EXTRA`'ya taşındı: `aktivite-gunlugu-v1`,
`bagli-uygulamalar-v1`.

### G2 — tek uzun sayfa dörde bölündü

**Üretilen üç yeni dosya** (altı değil — gerekçe §5'te):

| Dosya | `data-plan-page` | Başlık | İçerik |
|---|---|---|---|
| `enerji-defteri-v1.html` *(mevcut, adres korundu)* | `defter` | Enerji Defteri | Bugünkü denge paneli + Yediklerim + Hareketlerim |
| `enerji-defteri-dengele-v1.html` **YENİ** | `defter-dengele` | Dengele | Yediğini hareketle dengele + Gastro önerisi |
| `enerji-defteri-su-v1.html` **YENİ** | `defter-su` | Su Takibi | Su modülü |
| `enerji-defteri-haftalik-v1.html` **YENİ** | `defter-haftalik` | Haftalık Özet | Haftalık denge tablosu |

**Sekme bileşeni:** ikisi de **B1'de sabitlenen ortak bileşen** —
`.fit-tabs` / `.fit-tab` / `.fit-pane` (`assets/css/fit-shell.css` +
`assets/js/fit-shell.js` → `[data-fit-tabs]`), **sayfa geçişi kipi**
(kalemler `<a>`, aktif olan `aria-selected="true"` + `aria-current="page"`;
JS bu kipte panel yönetmez, yalnız rolleri kurar).
- Fit Planım rayı: `.pf-tabs/.dt` → `.fit-tabs/.fit-tab` (7 kalem)
- Enerji Defteri alt şeridi: `.ed-subtabs .fit-tabs` (4 kalem)

**Alt sayfalar üst kalemi işaretler:** `fit-shell.js` → `RAY_UST` eşlemesi
`defter-dengele` / `defter-su` / `defter-haftalik` → `defter`. Bu olmadan
alt sayfalarda rayda hiçbir kalem aktif görünmüyordu (ölçülüp düzeltildi).

### KIRILMAMASI GEREKEN ESKİ ADRESLER

| Adres | Beklenen davranış | Nerede korunuyor |
|---|---|---|
| `enerji-defteri-v1.html` | HTTP 200, ray aktif, kırıntı `DadaFit › Fit Planım › Enerji Defteri` | dosya adı değişmedi |
| `enerji-defteri-v1.html#dengele` | → `enerji-defteri-dengele-v1.html` | `enerji-defteri-v1.html` sonundaki **çapa köprüsü** |
| `enerji-defteri-v1.html#su` | → `enerji-defteri-su-v1.html` | aynı köprü |
| `enerji-defteri-v1.html#haftalik` | → `enerji-defteri-haftalik-v1.html` | aynı köprü |
| `enerji-defteri-v1.html#yediklerim` | **yerinde kalır**, yönlenmez | köprü çapa sayfada varsa dokunmaz |

> Köprü mantığı: `if(hash && MAP[hash] && !document.querySelector(hash))
> location.replace(MAP[hash])`. Yani **çapa bu sayfada duruyorsa yönlendirme
> yapılmaz** — ileride bir modül geri taşınırsa köprü kendiliğinden susar.

**Ölçüldü:** 4 sayfa HTTP 200 · alt sekme aktif durumu + `aria-current` doğru ·
üst rayda "Enerji Defteri" aktif · `page-check` 1440 ve 390'da **8/8 temiz** ·
konsol hatası 0 · yatay taşma yok · `index.html` site haritası güncellendi.

---

## 5 · G2'de verilen yorum — Beyar'a açık soru (S3)

Beyar G2'de altı ad saymıştı: *Bugün · Plan ve Takvim · Aktivite Kayıtlarım ·
İlerlemem · Kaydettiklerim · Antrenörüm.* **Ölçüm bunların Enerji Defteri'nin
bölümleri olmadığını gösterdi** — birebir **Fit Planım rayının** kalemleri ve
o altı sayfa **zaten ayrı dosya olarak vardı** (`fit-planim-*.html`, altısı da
diskte). Tek uzun sayfa **Enerji Defteri**'ydi (911 satır, yedi modül); bölünen
o oldu ve **kendi içeriğine göre** dörde ayrıldı.

**Soru duruyor:** kastedilen bu değilse — örneğin Enerji Defteri'nin de tam o
altı adı taşıması isteniyorsa — sayfa adları değişir. Cevap gelene kadar mevcut
kurgu yerinde. (Tam liste: `REVIZE-PLAN-3.md` → "Beyar'a soru dönen maddeler".)

---

## 6 · Beyar'a açık beş soru (cevap bekliyor)

| # | Konu | Soru |
|---|---|---|
| **S1** | E1 | Erişim bölümü ve filtre ekseni kalktı; kartlardaki altın **PRO rozeti** ve "Başlangıç · Ücretsiz" etiketi **duruyor** (site geneli kural). Kart rozetleri de gitsin mi? |
| **S2** | C4 / H | Kütüphane sayaçları gerçeğe çekildi (140+ → 12). Kabuk üst bandındaki site geneli **"140+ hareket"** duruyor. Hedef sayı mı, gerçek mi? |
| **S3** | G2 | §5'teki yorum doğru mu? |
| **S4** | B4 | `--fit` (#009d4f) + beyaz metin **3.54:1** — AA altı. Bu turda dokunulan düğmeler `--fit-deep`'e (5.45:1) geçti. Site geneli `.btn-fit` de koyulaşsın mı? |
| **S5** | D3 | Banner yükseklikleri aile içinde sabit (liste 344 · detay 384, yayılım 0). İçinde ikinci kart taşıyan **beş imza banner'ı** kural dışı: `dadafit-kopru` 614 · `antrenor-ol` 602 · `challenge-v1` 697 · `program-detay` 570 · ana sayfa 900. Sadeleşip katılsınlar mı? |

---

## 7 · Bu turda kabuğa eklenen ORTAK birincil bileşenler

Sayfa sayfa kopyalanmaz — hepsi `assets/css/fit-shell.css` + `assets/js/fit-shell.js`:

| Bileşen | Ne yapar |
|---|---|
| `[data-tagrow]` | Tek satır etiket rayı; sığmayanı gizler, sona `+N` rozeti (rozet tıklanamaz) |
| `.fit-note` | İkon çipi + kalın başlık + tek satır açıklama bilgi şeridi |
| `.fit-tabs` / `.fit-tab` / `.fit-pane` | Sekme bileşeni (DadaGastro segment hapı kalıbı + ARIA + klavye). İki kip: `<button>` panel değişimi, `<a>` sayfa geçişi |
| `.ff` (yükseltildi) | Filtre çubuğu: tek durum nesnesi → URL, viewport kelepçesi, arama alanı (>5 seçenek), `role=listbox/option` |
| `.vs-card` ailesi | Video seans kartı (iki sayfada kullanılıyor) |
| Hero token'ları | `--fit-header-h` · `--hero-pt` · `--hero-pb` · `--hero-gap` · `--hero-min` · `--hero-full` · `--sec-pad` · `--measure` · `--hero-h-list` · `--hero-h-detail` |

---

## 8 · Değişmeyen kalıcı kurallar

1. Ortak bileşen sayfa sayfa kopyalanmaz — kabuktan yönetilir.
2. **Ölçmeden "düzeldi" denmez.** Ölçülemeyen şey "doğrulanmadı" diye raporlanır.
3. Bir test, kırmızıya döndüğü görülmeden yeşil sayılmaz.
4. **Push her seferinde ayrı izin ister.** Commit serbest, push değil.
5. Mevcut tasarım dili korunur (DadaFit yeşili, Gilroy, kart dili, radius, grid).
6. Alt ajan commit atmaz.
7. Font Awesome **PRO** ikonu kullanılmaz.
8. **YENİ (bu turdan ders):** Durum özniteliğini yalnız kuruluşta düzeltmek
   yetmez — sayfa motoru sonradan geri koyabilir. Her senkronda düzelt ve
   **etkileşimden sonra** ölç.
9. **YENİ (bu turdan ders):** Metin değişimi yaparken hedefin bir **JS dizesi**
   içinde olup olmadığına bak. D1'de bir ön ek değişimi tırnak kaçırıp
   `uyelik-faturalandirma-v1`'in script'ini komple çökertti; tek tek
   `page-check` koşularında görünmedi, ancak **tam site taraması** yakaladı.

---

## 9 · Bu turun 13 commit'i

| # | Hash | Özet |
|---|---|---|
| 1 | `1f21c22` | FAZ A — antrenör kartı tek iskelete oturdu |
| 2 | `37c5b36` | FAZ B — sekme bileşeni ortak kaynağa çıktı |
| 3 | `0e664b8` | FAZ C — filtre bileşeni URL durumu, arama, kelepçe, klavye |
| 4 | `c0bca50` | FAZ D — demo rozet ailesi kalktı, hero tek ölçeğe indi |
| 5 | `12a4c8b` | FAZ E1–E5 — programlar merkezi sadeleşti, sihirbaz sayfa içine indi |
| 6 | `968a1cb` | FAZ E6 — fit testi detayı üç iterasyonda |
| 7 | `4aa9050` | fix — ana sayfa herosu 100dvh'ye geri alındı (Beyar) |
| 8 | `7e9a951` | FAZ F — challenge paneli kalktı, zaman çizelgesi tek bileşende |
| 9 | `470e440` | FAZ C1 — filtre bileşeni yeniden tasarlandı (1. tur) |
| 10 | `b720e05` | filtre kartı keskin radius'la geri + banner yükseklikleri sabit |
| 11 | `10370f4` | **FAZ G** — Enerji Defteri profile taşındı ve dörde bölündü |
| 12 | `a5dbbc1` | teslim taraması iki kusur yakaladı, plan bölümleri yazıldı |
| 13 | `74ee4ec` | FAZ C — çakışan `aria-pressed` kaldırıldı (ajanın bulduğu kırmızı) |

**Taban:** `9f9c8b7`. **Hiçbiri push edilmedi.**

---

## 10 · Turun kapanış ölçümü

| Ölçüm | Sonuç |
|---|---|
| Sayfa sayısı | **60** (3'ü bu turda üretildi) |
| HTTP 200 | **60 / 60** |
| Taranan iç bağlantı | **3.575** |
| Kırık bağlantı | **0** |
| Kırık çapa | **0** |
| 4xx alt kaynak | **0** |
| Konsol hatası / JS istisnası | **0** |
| Beklenmedik bulgu | **8** (B1–B8, planda) |
| Beyar'a dönen soru | **5** (S1–S5) |
| Kırmızı ölçüm | **1 bulundu → düzeltildi → 0** |
