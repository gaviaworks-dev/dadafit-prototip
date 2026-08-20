# DEVİR 5 — YENİ OTURUMUN TEK BİLGİ KAYNAĞI

**Depo:** `~/Developer/Projects/dadafit-prototip` · **Canlı:** `gaviaworks-dev.github.io/dadafit-prototip`
**Taban commit:** `44633fb` · **Son commit:** 7. oturum (aşağıda) · **Branch:** `main`
**Brief:** `tasks/REVIZYON-5.md` · **Plan:** `REVIZE-PLAN-5.md` · **Kararlar:** `KARARLAR.md`

> Bu dosya bağlam temizlendikten sonra tek referanstır. Ölçümler yeniden
> yapılmayacak; §2'deki sayılar canlı referanstan alınmış ve token'lara yazılmıştır.

## Açılış komutları

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -3 && git status --short
python3 -m http.server 8811 &          # zaten çalışıyorsa atla
export PW_HOME=~/.pw                   # playwright-core 1.62.1
gh auth status                         # aktif hesap gaviaworks-dev olmalı (K36)
```

---

# 1 · BİTENLER

> **7. OTURUM (bu tur) — H1 · H2 · H3 ve R15.4 kapandı.** Ayrıntılar hemen
> aşağıda; karar kayıtları `KARARLAR.md` **K37–K45**. Beşinci turun R11·R12·
> R14·R15 kayıtları daha aşağıda olduğu gibi duruyor.


Beşi de ayrı commit, hepsi **push edildi**. R11 · R12 · R14 · R15 beşinci turda,
**R13 altıncı oturumda** kapandı.

## H1 — Spor Sözlüğü · `fb4a289` (7. oturum)

**İstek (brief §H1):** yapı `dadagastro.com/mutfak-sozlugu`'ndan, içerik sıfırdan,
fit ağırlıklı ~180 terim. Karar kayıtları **K37** (desen) · **K39** (slug sözleşmesi).

| Dosya | Ne |
|---|---|
| **`sozluk-v1.html`** | **YENİ.** Liste sayfası, `sz-*` öneki. Harf rayı (Tümü + 29 harf) + kategori seçici + arama + sayaç + boş durum. Banner **LİSTE** ailesi (544/607/587) |
| **`sozluk-detay-v1.html`** | **YENİ.** `?slug=` ile terim sayfası. Dosya adında `-detay-` geçtiği için kabuk otomatik **DETAY** ailesine yazıyor (560/617/726) — §3b, karşı koyulmadı |
| **`assets/js/sozluk-veri.js`** | **YENİ.** Tek kaynak; iki sayfa da bunu okuyor. Slug elle yazılmıyor, `slugla()` türetiyor |
| **`tests/sozluk.mjs`** | **YENİ** sınama |

**Referanstan ÖLÇÜLEREK alınan üç sabit** (canlı Playwright, K37):
terim bir **açılır satır** (kart değil) · arama **3 harf** eşiği · harf rayı
**29 harf, Q/W/X yok**. Sayfalama ve "Kaynaklar" bloğu **gerekçeli alınmadı**.

**Ölçüm:** 232 terim · 10 kategori (en küçüğü 20, eşik 8) · 28/29 harf dolu
(yalnız Ğ boş, `is-empty`+`disabled`) · **232/232 detay sayfası dolu** ·
karşılıksız harf **0** · sayaç = DOM · hareket köprüsü 12 gerçek slug, **200** ·
kas köprüsü 26 slug, hepsi kanondan · banner **6/6 birebir** · konsol **0**.

## H2 — İnteraktif Anatomi · `c55a256` (7. oturum)

**Kaynak:** `Muscle.pdf` (Delavier). Karar kayıtları **K38** (PDF) · **K34** (menü).

| Dosya | Ne |
|---|---|
| **`anatomi-v1.html`** | **YENİ.** Sol harita / sağ panel, `an-*` öneki. ÖN-ARKA + Erkek-Kadın geçişi, `?kas=` derin bağlantı, klavye gezinme. Banner **LİSTE** (544/607/587) |
| **`assets/svg/` × 4** | **YENİ.** Sıfırdan çizim. `viewBox 0 0 400 900`, `fill=currentColor`, her bölge ayrı `<path>` + `data-kas` |
| **`assets/js/anatomi-veri.js`** | **YENİ.** 29 kas × 9 alan; her kayıt `kaynak: 'PDF s. …'` taşıyor |
| **`assets/js/fit-shell.js`** | **+37 / −4.** Menü grubu "Hareketi Anlamak" + NAV/BOTTOM `match` dizileri + `drawerNavHtml()` grup başlığı. **`fit-shell.css`'e TEK KARAKTER yazılmadı** |
| **`tests/anatomi.mjs`** | **YENİ** sınama |

> **PDF'in metin katmanı YOK** — `pdftotext` 0 satır döndürdü. 20 sayfa rasteri
> **gözle** okundu. PDF'in vermediği **beş yapışma alanı** panelde *"plate bu
> bilgiyi vermiyor"* diye yazılı — uydurulmadı (K38).

**Ölçüm:** kanonik 27 slug'ın **27'si** karşılandı (+2 ekstra) · **58/58 bölge**
gerçek fare tıklamasıyla seçildi · panel **29/29 dolu** · `?kas=` **29/29** doğru
kas + doğru görünüm · @390 harita panelin üstünde · banner **544/607/587** ·
mevcut 9 sınama **9/9** — gerileme yok.

## R15.4 — Bölüm başlığı çakışması · `b7a95cf` (7. oturum)

**S-C ÖLÇÜMLE CEVAPLANDI.** Brief *"tam olarak ne rahatsız ediyor"* diyordu;
64 sayfa tarandı, cevap **çakışma**: `video-seanslari-v1.html`'de banner eyebrow'u
"Seans Kütüphanesi", sayfa içi h2 de "Seans kütüphanesi" — aynı ifade iki kez.
**Site genelinde eyebrow ↔ h2 birebir çakışması yalnız bu sayfada (1/64).**

**Tipografi kuralı zaten vardı:** `.sec-head` deseni (eyebrow + h2 + lead),
**65 tam örnek**, yalnız 3'ünde opsiyonel `lead` yok. Yeni kural yazılmadı;
kuralı ihlal eden tek örnek düzeltildi → h2 **"Tüm seansları süz"**.

## R13 — "Programını Bul" tam sayfa · `7703804` (6. oturum)

**İstek (brief R13):** *"Pop-up tamamen kalksın; sihirbaz kendi tam sayfası
olsun."* Referans `dadadiet.com/diyetisyen-bul`. Karar kaydı `KARARLAR.md` **K33**.

### Ne değişti — dosya dosya

| Dosya | Değişiklik |
|---|---|
| **`programini-bul-v1.html`** | **YENİ.** Sihirbazın tamamı burada: sayfa CSS'i (`pb-*` ailesi) + sayfa JS'i (sorular, katalog, puanlama, sonuç). Banner `.lib-top` → dosya adında `-detay-` geçmediği için kabuk otomatik **liste** ailesine yazıyor (§3b) |
| **`assets/js/fit-shell.js`** | Sihirbaz IIFE'si **silindi** (−344 satır). Menü kalemi `href:'#' + wizard:true` → `href:'programini-bul-v1.html'`. `navHtml()` ve `drawerNavHtml()`'deki `data-fit-wizard` üretimi kaldırıldı. `programini-bul-v1` iki `match` listesine eklendi (üst menü + alt bar → "Programlar" aktif kalıyor) |
| **`assets/css/fit-shell.css`** | `.wz-*` ailesi **silindi** (−112 satır). Odak kuralındaki `.wz-opt:focus-visible` → `.pb-opt:focus-visible` |
| **`programlar-merkezi-v1.html`** | E3'ün satır içi barındırıcısı (`[data-fit-wizard-host]` + `.wz-host-sec` CSS'i) kaldırıldı; banner düğmesi yeni sayfaya bağlandı |
| `dadafit-hub-v1` · `fit-testleri-v1` · `antrenorler-v1` · `hareket-merkezi-v1` | `data-fit-wizard` düğmeleri düz bağlantıya çevrildi |
| `sss-v1` · `destek-talepleri-v1` · `destek-talebi-detay-v1` | Metinlerde ad birleştirildi |
| **`tests/wizard-page.mjs`** | **YENİ** sınama (§4) |

### Kabuktan SİLİNEN sihirbaz IIFE'si — ne taşıyordu

Eski blok `fit-shell.js`'te **1725–2047** satırları arasındaydı ve 60 sayfanın
hepsine yükleniyordu. İçinde şunlar vardı, **hepsi gitti**:

| Silinen | Neydi |
|---|---|
| `.wz-overlay` üretimi | `position:fixed; inset:0` örtü katmanı + `lockScroll()` |
| `.wz-modal` üretimi | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` taşıyan katman |
| `data-fit-wizard` dinleyicisi | Belge düzeyinde `click` yakalayıcı; tetikleyicilerin `aria-expanded` senkronu |
| `[data-fit-wizard-host]` satır içi kipi (E3) | Aynı paneli `programlar-merkezi`'nin içine basan ikinci kip |
| `wizard=1` derin bağlantısı | `location.search` okuyup 120 ms sonra katmanı açan otomatik tetik |
| `FIT_SHELL.wizard` API'si | Dışarıdan sihirbazı açan genel giriş noktası |
| Esc kapatma + odak yönetimi | Yalnız modal kipte anlamlıydı, kipsiz kaldı |

**`.wz-*` CSS ailesi** de aynı gerekçeyle `fit-shell.css`'ten çıkarıldı: örtü
katmanı, sabit konumlu modal kutusu, `wz-inline` kipi, `wz-head/wz-close/wz-foot`,
adım ve sonuç blokları. Karşılıkları yeni sayfanın `pb-*` ailesinde — ama
**akış öğesi olarak**, `position:fixed` olan tek bir kural bile taşımadan.

> **Neden E3 (satır içi kip) de kaldırıldı:** E3, "pop-up olmasın" isteğinin
> 4. turdaki ara çözümüydü — panel modal yerine programlar merkezinin içine
> basılıyordu. R13 aynı isteğin nihai biçimi. İkisini birlikte tutmak **aynı
> motorun iki kopyası** demekti; tek kaynak yeni sayfadır. Kapı kaybolmadı,
> merkezin banner düğmesi oraya gidiyor.

### Altı soru → üç adım

Motorun altı sorusu **atılmadı**, referansın üç kalemli adım rayına gruplandı:

| Adım | Sorular |
|---|---|
| **1 · Hedefin** | amaç · seviye |
| **2 · Ortam** | mekân (çoklu) · ekipman (çoklu) |
| **3 · Tercih** | seans süresi · dikkate alınacak durum (çoklu) |

Alt bar "Adım n / 3" yazıyor. Çoklu sorularda **"Yok" seçeneği diğerlerini
temizliyor**, diğerleri "Yok"u temizliyor. Bir adımdaki her soru yanıtlanmadan
"İleri" ilerletmiyor; uyarı satırı çıkıyor. Geri dönünce **yanıtlar duruyor**.

### Yeni puanlama motoru — sonuç artık hesap, sabit eşleme değil

**Eskiden:** çıktı iki sabit eşlemeden geliyordu — `süre → hızlı rutin` ve
`amaç → uzun program` + `amaç → rehber`. Seviye, mekân ve ekipman yanıtları
sonucu **hiç değiştirmiyordu**; sihirbazın kendi metni bile bunu itiraf
ediyordu ("şu an sıralamayı değil, önerinin tonunu belirler").

**Şimdi:** yedi kalemlik katalog beş eksende puanlanıp **ilk üçü** gösteriliyor.

**Katalog (7 kalem, hepsi diskte var olan gerçek slug):**

| Kalem | Hedef | Slug kaynağı |
|---|---|---|
| 4 Hafta Ev Antrenmanı · 8 Hafta Mobilite Planı · 12 Hafta Güç Temeli · 8 Hafta Salon Kondisyon | `program-detay-v1.html?slug=…` | `program-detay-v1.html` içindeki `VERI` tablosu |
| 30 Günde Hareket Alışkanlığı · 7 Gün Sabah Esneme Ritüeli · 21 Gün Adım Adım Yürüyüş | `challenge-v1.html?slug=…` | `challenge-v1.html` içindeki `VERI` tablosu |

**Beş eksen:**

| Eksen | Puan |
|---|---|
| **Hedef ağırlığı** | Her kalem `hedef:{amaç:ağırlık}` haritası taşır — birincil **40**, ikincil **26**, dolaylı **14** |
| **Seviye yakınlığı** | Birebir **+16** · bir basamak fark **+8** · iki basamak **0** |
| **Mekân kesişimi** | Kullanıcının seçtiği mekânlardan biri kalemin mekânlarındaysa **+14** |
| **Ekipman uyumu** | Kalem ekipman istemiyorsa **+10** · istediğini kullanıcı taşıyorsa **+18** · **taşımıyorsa −25** |
| **Seans süresi** | Fark ≤5 dk **+12** · ≤10 dk **+6** · üstü **0** |

**Kritik kural — eksik ekipman ELEME değil, PUAN DÜŞÜŞÜ.** Hiçbir eksen
katalogdan kalem çıkarmıyor; en kötü ihtimalle sıralamada geriye düşürüyor.
Bu yüzden **hiçbir yanıt bileşimi boş sonuç döndüremiyor** — kabul
ölçütündeki "karşılıksız kombinasyon 0" şartı mimarinin kendisinden geliyor,
sonradan eklenen bir yedek listeden değil. Eşitlik bozucu **sabit**: katalog
sırası (`KATALOG.indexOf`), yani aynı yanıtlar her zaman aynı sıralamayı verir.

Her kart **"Neden bu:"** satırıyla geliyor; gerekçeler puanı üreten eksenlerin
kendisinden türüyor (uydurulmuş metin değil), ilk ikisi gösteriliyor. Eksik
ekipman durumu da dürüstçe yazılıyor: *"ekipman uyumu sınırlı"*.

**Risk dalı korundu:** ağrı / özel sağlık durumu / gebelik / uzun süreli
hareketsizlik yanıtında **kişisel egzersiz reçetesi üretilmiyor**; antrenör
dizinine, sağlık bilgilendirmesine ve *okunacak* rehbere yönlendiriliyor.

### Etiket birleştirildi

**"Programımı Bul" → "Programını Bul".** Brief'in kırıntısı ve dosya adı
"Programını" diyordu, menü "Programımı" — ikisi bir arada duramazdı. Menü
kalemi, beş sayfadaki düğme, SSS metni ve iki destek talebi metni aynı ada
çekildi. `antrenorler-v1`'deki düğme 4. turda da **bu program sihirbazını**
açıyordu ama etiketi "Sana Uygun Antrenörü Bul"du; hedef ile etiket bu
oturumda doğrulandı.

### Ölçüm — `tests/wizard-page.mjs`, @1440 ve @390, **canlıda koşturuldu**

| Kabul ölçütü | Sonuç |
|---|---|
| Sayfa HTTP 200 | ✅ |
| Pop-up düğümü (`.wz-overlay`/`.wz-modal`/`#wzModal`/`[data-fit-wizard]`/`[data-fit-wizard-host]`) | **60/60 sayfada 0** |
| Sihirbaz içeriği taşıyan `role="dialog"`/`aria-modal` | **0** · `FIT_SHELL.wizard` API'si de yok |
| 3 adım ileri-geri | ✅ · geri dönüşte yanıtlar korunuyor |
| Yanıtsız adımda "İleri" | **ilerletmiyor**, uyarı çıkıyor |
| Sonuç kartları | **3/3 gerçek program slug'ına** gidiyor |
| Karşılıksız kombinasyon | **0** — 15/15 amaç×seviye bileşimi 3 kart döndürdü |
| "Baştan başla" | adım 1'e dönüyor, yanıtları siliyor |
| Risk dalı | kişisel program önerilmiyor, uzmana yönlendiriyor |
| Banner ailesi | **liste** · **544 / 607 / 587** — üç genişlikte de birebir |
| Konsol hatası · yatay taşma | **0 · 0** |
| Katalogdaki 7 hedef | hepsi **HTTP 200** |

**Tam site taraması (61 sayfa × @1440 ve @390):** HTTP dışı 200 **0** ·
kırık bağlantı **0** · konsol hatası **0** · yatay taşma **0**.
**Test süiti: 9/9 temiz.** `tools/page-check.mjs` dokunulan sekiz sayfada temiz.

**K27:** `tests/wizard-page.mjs` taban commit `44633fb`'ye karşı koşturuldu ve
**kırmızıya döndü** — üç ayrı kırmızı: sayfa 404 · 60 sayfada pop-up kalıntısı ·
sihirbaz sayfası kurulmadı.

## R14 — Fit testi cevap kilidi · `8b5921a`

**Sorun:** uygunluk taramasında riskli yanıt ("Evet") verilip test durdurulduktan
sonra kullanıcı "Hayır"a basıp taramayı yeniden gönderebiliyor ve test açılıyordu.
Güvenlik kapısı kapı değildi.

**Dosya:** `fit-testi-detay-v1.html` (yedi test slug'ının hepsi bu tek sayfayı kullanır)

**Ne değişti:**
- `kilitle(name)` — `change` olayında sorunun iki şıkkı da kilitlenir
- Kilit **üç katmanlı**: `disabled` + `aria-disabled="true"` + `tabindex="-1"`
- Riskli yanıtta güvenli şık `.ft-opt.is-safe` alır (kesikli çerçeve + "Temiz yanıt")
- `kilitleriAc()` — "Taramayı sıfırla" kilidi üç katmanıyla kaldırır
- Tarama başlığına kilit uyarısı metni eklendi
- **Not:** `disabled` bir radyoyu `:checked` olmaktan çıkarmaz → gönderim mantığı
  (`input:checked` + `data-risk`) hiç değişmedi

**Ölçüm (7 slug × 2 genişlik):**

| | ÖNCE | SONRA |
|---|---|---|
| Kilitli şık | **0 / 14** | **14 / 14** |
| Odak sırasından çıkan şık | 0 / 14 | **14 / 14** |
| İkinci tıklama seçimi değiştiriyor mu | evet | **hayır** (`"evet"` → `"evet"`) |
| Riskli yanıt geri alınabiliyor mu | **evet → test açılıyordu** | **hayır → test kapalı kalıyor** |
| Sıfırlama sonrası kilitli / seçili / kilit mesajı | — | **0 / 0 / 0** |
| Karşı-kontrol: 7 yanıt temizse test açılıyor mu | — | **evet** |
| Sonuç | — | **@1440 7/7 · @390 7/7** · JS istisnası 0 |

## R11 — Footer perdesi · `a847f40`

**Sorun:** perde footer'dan **310 px** kopuktu. Kök neden `margin-bottom`
değerinde değil, **perdenin neyi içerdiğindeydi**.

**Dosya:** `assets/js/fit-shell.js`

**Ne değişti:**
- **satır ~2102–2123:** sağlık şeridi (`.fit-health`) artık `#pageMain`'in
  **son çocuğu** (`perde.appendChild(sec)`); `#pageMain` yoksa eski davranış
- **satır 1438:** `main.style.marginBottom` artık
  `foot.getBoundingClientRect().height` (kesirli). `offsetHeight` 439.5'i 440'a
  yuvarlayıp 59 sayfada **11 farklı** perde boşluğu üretiyordu

**Ölçüm (kaydırmadan bağımsız iki değişmez):**

| | ÖNCE | SONRA |
|---|---|---|
| `margin-bottom` − footer yüksekliği @1440 | 11 farklı değer | **0 — 59/59 tek değer** |
| Perdeden sonra kalan kuyruk | **310.3 px** | **0** |
| Sağlık şeridi perdenin içinde | **0 / 59** | **59 / 59** |
| Sağlık şeridi **görünür** | **0 / 59** | **59 / 59** |
| @390 | perde kipi kapalı | değişmedi · şerit içeride 59/59 |

## R12 — Kırıntı ev ikonu · `7fdc7e3`

**Sorun:** ev ikonu 13 px, kendi chevron ayracı 9 px — ikon ayraçtan **%44 iri**.
Referansta ikisi eşit.

**Dosya:** `assets/css/fit-shell.css` **satır 1749** — `.crumb-home i{font-size:9px !important}`
(tek satır, 58 sayfa)

**Ölçüm (58 sayfa × 2 genişlik, hepsi tek değer):**

| | ÖNCE | SONRA | Referans |
|---|---|---|---|
| İkon `font-size` | 13 px | **9 px** | 9 px |
| İkon kutusu | 14.6 × 13 | **10.1 × 9** | 10.1 × 9 |
| İkon ↔ ayraç | 13 ≠ 9 | **9 = 9 eşit** | eşit |
| İkon → ayraç boşluğu | 9 px | **9 px** | 9 px |
| İkon / satır yüksekliği | 0.67 | **0.46** | 0.45 |
| R3 garantisi (metin düğümü 0 · erişilebilir ad · `.sr-only` 1 px) | — | **58/58 bozulmadı** | — |

**Renk çekilmedi** — referans `rgba(255,255,255,.4)`, DadaFit `--fit-bright`
yeşilinde kaldı (satır 1755). Gerekçe `KARARLAR.md` **K29**.

## R15 — Banner standardı · `a1c61e9`

**Dosyalar:** `assets/css/fit-shell.css` (token + aile kuralları) ·
`assets/js/fit-shell.js` (panel geri taşıma kilidi) ·
`antrenor-ol-v1.html` · `challenge-v1.html` · `dadafit-kopru-v1.html` ·
`antrenor-detay-v1.html` (ikincil paneller banner dışına)

**Ne değişti:**
- 4. turun **344/384** değerleri atıldı → referanstan ölçülen **544/560**
- Sabit yükseklik artık **her genişlikte** (4. turda ≥901 px ile sınırlıydı)
- 4. turun **sütun-sarmalı iki kolonu kaldırıldı** (CTA'yı sağa taşıyordu, R15.2 yasaklıyor)
- `.wrap` sütun flex **kutusu** oldu; `.lib-stats{order:1}`, `.chips/.lib-cta{order:2}`
  → blok sırası referansla aynı: kırıntı → eyebrow → H1 → alt metin → **istatistik → CTA**
- Beş imza banner'ı aileye girdi; ikincil panelleri banner'ın altına alındı
- `.pd-hero` · `.chl-hero` · `.kp-top` · `.ol-top` · `.cp-top` → `align-items:flex-start`

**Ölçüm:**

| | @1440 | @390 |
|---|---|---|
| **LİSTE ailesi** | **49 sayfa · tek değer 544** | **49 sayfa · tek değer 587** |
| **DETAY ailesi** | **6 sayfa · tek değer 560** | **6 sayfa · tek değer 726** |
| Üçüncü değer | **1** — `dadafit-hub` 900 (bilinçli, K31) | **1** — aynı |
| Banner içi kırpılan öğe | **0 / 59** | **0 / 59** |
| `h1` sol kenarı | 54/56 sayfada 132 px | 55/56 sayfada 16 px |
| CTA sol = h1 sol | 19 / 21 | 20 / 21 |

**Aileye giren beş imza banner'ı:**

| Sayfa | Önce | Sonra | Nasıl |
|---|---|---|---|
| `dadafit-kopru` | 613.6 | **544** | enerji kartı (391.2 px) banner altına |
| `antrenor-ol` | 602.2 | **544** | `.ol-bene` fayda paneli banner altına |
| `challenge-v1` | 697.1 | **560** | `.chl-time` zaman çizelgesi (187.2 px) banner altına |
| `program-detay` | 570.4 | **560** | üstten hizalama düzeltmesi yetti |
| `antrenor-detay` | 477.2 | **560** | randevu kartı (`.cp-cta`) banner altına |

## Turun kapanış ölçümü

| | |
|---|---|
| Tam site taraması @1440 **ve** @390 | **60/60 HTTP 200** · 6.455 bağlantı · kırık **0** · kırık çapa **0** · 4xx **0** · konsol hatası **0** · yatay taşma **0** |
| Test süiti | **8/8 temiz** |
| `tools/page-check.mjs` | dokunulan sayfalarda 1440 ve 390'da temiz |

---

# 2 · REFERANS ÖLÇÜMLERİ — YENİDEN ÖLÇÜLMEYECEK

Kaynak: **`dadadiet.com`**, Playwright, üç genişlik.
**İki bağımsız liste sayfası her genişlikte birebir aynı çıktı** → değerler
tesadüf değil, tasarım sabiti.

## 2a · Banner dış yükseklikleri

| Genişlik | `/beslenme` (liste) | `/diyetisyenler` (liste) | `/beslenme-rehberi/dengeli-tabak` (detay) |
|---|---|---|---|
| **1440** | **544** | **544** | **560** |
| **1024** | **607** | **607** | **617** |
| **390** | **587** | **587** | **726** |

**Yazıldığı token'lar —** `assets/css/fit-shell.css`:

| Token | @1440 (satır 81/85) | @1024 (satır 1157) | @390 (satır 1158) |
|---|---|---|---|
| `--banner-h-liste` | **544px** | **607px** | **587px** |
| `--banner-h-detay` | **560px** | **617px** | **726px** |

Geriye dönük diğer adlar (4. turdan kalan kurallar okuyor):
`--hero-h-list: var(--banner-h-liste)` · `--hero-h-detail: var(--banner-h-detay)`

> **@390 detay 726 px notu:** liste ailesinin mobil büyümesi ölçülü (544 → 587,
> +43), detayınki büyük (560 → 726, +166). Bu asimetri 726'nın içerik kaynaklı
> olabileceğini düşündürüyor. Birebir alındı çünkü fazla yüksek kutu yalnız boş
> alan riski taşır, **asla kırpma** üretmez. Kısaltmak istenirse tek token.

## 2b · Banner iç ölçüleri (@1440, `/beslenme`)

| Ölçü | Değer | Yazıldığı token |
|---|---|---|
| `padding-top` | **128 px** | `--hero-pt: 15px` (satır 43) → 113 header + 15 = **128** |
| `padding-bottom` | **46 px** | `--hero-pb: 46px` (satır 44) |
| kırıntı üst kenarı (kabuk içinde) | 154.9 | — (dolgudan türer) |
| kırıntı → H1 | **36.8 px** | `--banner-gap` (aşağıda) |
| H1 → alt metin | **12.1 px** | `--banner-gap` |
| alt metin → istatistik şeridi | **22 px** | `--banner-gap` |
| istatistik şeridi → CTA | **23 px** | `--banner-gap` |
| **CTA sol kenarı − H1 sol kenarı** | **0 (birebir hizalı)** | flex sütun + `align-items:stretch` |

`--banner-gap` (dört boşluğun ortalaması, satır 84): **@1440 20px · @1024 18px · @390 9px**
*(@390 değeri 14 → 9'a indirildi: `fit-testi-sonuc` CTA'sı 21.3 px taşıyordu)*

`--hero-pt` / `--hero-pb` breakpoint değerleri: **@1024 15/46 · @390 33/34**
(@390: 63 header + 33 = **96**, referansla aynı)

### Tipografi

| Öğe | @1440 | @1024 | @390 | Yazıldığı yer |
|---|---|---|---|---|
| **H1** (liste) | **42px / 47.04 lh / 700 / −1.26 ls** | 42px / 47.04 | 29px / 32.48 / −0.87 | `fit-shell.css` `@media (min-width:901px)` içinde `banner h1{font-size:42px;line-height:1.12;letter-spacing:-.03em}` |
| H1 (`/diyetisyenler`) | 44px / 49.28 / −1.32 | 44px | 29px | — (varyant, alınmadı) |
| H1 (detay) | 40px / 44.8 / −1.2 | 40px | 28px / 31.36 | — |
| **eyebrow** | **13px / 700 / ls normal / text-transform none** | — | — | DadaFit kendi eyebrow'unu korudu |
| alt metin | 16px / 24.8 lh | — | 16px / 24.8 | — |
| istatistik şeridi | 16px / 24.8 lh | — | 16px / 24.8 | — |
| CTA düğmesi | 14.5px / 700 · yükseklik 50.5 | — | 14.5px · 50.5 | — |

**Blok sırası (referanstan):**
`kırıntı → eyebrow → H1 → alt metin → istatistik şeridi → CTA`
İstatistik şeridi örneği: *"311 besin değeri · 8 rehber kategorisi · Diyetisyen desteği"*

## 2c · Kırıntı

@1440 ve @390'da **aynı** (`/beslenme` ve `/diyetisyen-bul`):

| Ölçü | Değer | Yazıldığı yer |
|---|---|---|
| Ev ikonu `font-size` | **9 px** | `fit-shell.css:1749` `.crumb-home i{font-size:9px !important}` |
| Ev ikonu kutusu | **10.1 × 9** | (font-size'dan türer) |
| Chevron ayracı `font-size` | **9 px — ikonla EŞİT** | DadaFit'te zaten 9 px'ti |
| İkon → ayraç boşluğu | **9 px** | kırıntının `gap:9px` değeri |
| Kırıntı `font-size` / `line-height` | 13px / 20.15px | DadaFit 12.5px / 19.375px (kendi ölçeği) |
| İkon / satır yüksekliği oranı | **0.45** | DadaFit'te 0.46 |
| İkon rengi | `rgba(255,255,255,.4)` | **ALINMADI** — DadaFit `--fit-bright` (satır 1755) |

> **Referansın kendi tutarsızlığı:** `/beslenme-rehberi/dengeli-tabak`'ta ikon
> 13 px. Üç sayfanın ikisi 9 px olduğu ve Beyar "daha minimal ve compact" dediği
> için **9 px** alındı.

## 2d · Footer perdesi

Mekanizma **iki markada da aynı**: footer `position:fixed; z-index:1` ·
`main` `position:relative; z-index:2` · `main`e footer yüksekliği kadar `margin-bottom`.

| Ölçü | DadaDiet | DadaFit (şimdi) |
|---|---|---|
| `main.margin-bottom` | 612 px (= footer yüksekliği) | footer yüksekliği (kesirli) |
| Sayfa sonunda perde boşluğu | **−0.3 px (yapışık)** | **0 — 59/59 tek değer** |
| @390 perde kipi | **kapalı** (footer normal akışta) | kapalı |

**Yazıldığı yer:** `assets/js/fit-shell.js:1438`
`main.style.marginBottom = foot.getBoundingClientRect().height + 'px'`
(token değil, ölçülen değer — footer yüksekliği sayfaya göre değişir)

## 2e · `diyetisyen-bul` sihirbaz sayfası — **R13 için**

| Ölçü | @1440 | @1024 | @390 |
|---|---|---|---|
| Banner kabuğu (`.wzp-top`) yüksekliği | **434** | **427** | **455** |
| `padding-top` | 128 px | 128 px | 82 px |
| `padding-bottom` | 20 px | 20 px | 20 px |
| H1 | **40px / 44.8 lh / 700 / −1.2 ls** | 34px / 38.08 / −1.02 | 27px / 30.24 / −0.81 |
| kırıntı | 13px / 20.15 lh · yükseklik 40.1 | — | — |
| alt metin | 15.5px / 24.025 lh | — | — |
| istatistik şeridi | 16px / 24.8 lh · **3 kalem** | — | — |

**İstatistik şeridi metni (referans):**
*"Diploması doğrulanmış uzmanlar · Online veya yüz yüze · 30 saniyeden kısa"*

**Sayfa iskeleti (brief §R13'ten, canlıdan doğrulandı):**
```
breadcrumb   Ana Sayfa › Programlar › Programını Bul
eyebrow      "Sana Uygun Programı Bul"
h1           "Birkaç soruyla sana uygun programa ulaş"
alt metin    1 cümle
güven şeridi 3 kalem
adım rayı    1 Hedefin · 2 Ortam · 3 Tercih   (numaralı, aktif adım işaretli)
soru bloğu   başlık + alt açıklama + seçenek kartları (kalın etiket + tek satır açıklama)
alt bar      "Adım 1 / 3"  +  Geri / İleri
sonuç        "Sana uygun 3 program" + kart listesi
alt aksiyon  "Tüm programları gör" · "Baştan başla"
yasal şerit  sağlık/egzersiz uyarısı
```

> **R13 banner'ı LİSTE ailesine girecek** → `--banner-h-liste` (544/607/587).
> Referansın 434'ü DadaFit'in aile kuralına tabi değil.

---

# 3 · TUZAKLAR — bunlar okunmazsa aynı hataya düşülür

## B10 · `.fit-health` perdenin DIŞINDA basılıyordu

**Belirti:** footer'ın üstünde 310 px'lik ölü gri şerit; **ve** sağlık/güvenlik
şeridi masaüstünde **hiç görünmüyordu**.

**Kök neden:** `<section class="fit-health">` `body`nin çocuğu olarak footer'dan
hemen önce basılıyordu (`ftr.parentNode.insertBefore(sec, ftr)`) — yani perdenin
(`#pageMain`) dışında. İki sonucu vardı:
1. Perde `main`de bitiyor, `margin-bottom` boşluğu açılıyor, 310 px'lik şerit o
   boşluğun **altına** düşüyor → perde footer'dan kopuk görünüyor.
2. Şerit `position:static` (z-index `auto`); `z-index:1` taşıyan **sabit**
   footer'ın altına boyanıyor → **60 sayfada hiç görünmüyor.**

**Çözüm:** `assets/js/fit-shell.js` **satır ~2102–2123** — şerit `#pageMain`'in
**son çocuğu** oluyor:
```js
var perde = document.getElementById('pageMain');
if(perde) perde.appendChild(sec);
else ftr.parentNode.insertBefore(sec, ftr);
```

**Ders:** perde efektinde "footer'dan önce" ile "perdenin içinde" aynı şey değil.

## B11 · Kabukta ikincil paneli banner'a GERİ TAŞIYAN JS var

**Bu turun en pahalı tuzağı. Markup'tan paneli çıkarmak YETMİYOR.**

**Mekanizma:** `.fit-band-panel` sarmalayıcısının içeriğini ≥641 px'te hero
ızgarasının ikinci kolonuna **geri taşıyan** IIFE.

| | |
|---|---|
| **Dosya** | `assets/js/fit-shell.js` |
| **Başlangıç** | **satır 2219** — `var wrap = document.querySelector('.fit-band-panel');` |
| **Hedef ızgara** | `document.querySelector('.df-hero, .chl-grid, .kp-top')` |
| **Kilit (5. turda eklendi)** | **satır 2246–2266** — `R15 · SABİT AİLE BANNER'INDA PANEL GERİ TAŞINMAZ` |

**Kilidin çalışma şekli (satır 2261):**
```js
if(document.body.hasAttribute('data-fit-hero-kind')){
  if(panel.parentNode !== wrap) wrap.appendChild(panel);
  sarmalayiciyiGuncelle();
  return;                       // aileye bağlı banner'da geri taşıma YOK
}
```
Geri taşıma artık **yalnız** ana sayfanın tam-ekran hero'sunda
(`body[data-fit-hero="1"]`) çalışıyor.

**Belirti (yaşandı):** `dadafit-kopru`'nun enerji kartı dosyadan çıkarıldı, ölçüm
hâlâ kartı banner'ın içinde gösterdi. Dosyada tek kopya vardı — DOM'da parent
`.kp-hero`'ydu.

**Ders:** bir öğeyi markup'tan çıkardıktan sonra **DOM'da** doğrula
(`el.parentElement`), dosyada değil.

## B12 · `align-items:flex-end` sabit kutuda içeriği header'ın altına kaydırır

`.pd-hero` kendi CSS'inde `display:flex; align-items:flex-end` taşıyordu.
Yükseklik serbestken "içeriği bandın altına yasla" demekti; sabit 560 px kutuda
içerik yukarı taşıp **şeffaf header'ın altına** kaydı (kırıntı `top=96` <
header alt kenarı `113`). `tools/page-check.mjs` yakaladı.

**Çözüm:** `fit-shell.css` — beş imza banner'ı `align-items:flex-start !important`.

## B13 · Referansın kendi içinde tutarsızlığı olabilir

Kırıntı ev ikonu iki sayfada 9 px, birinde 13 px. Referans körlemesine
izlenmedi: çoğunluk + Beyar'ın "minimal ve compact" tarifi ile karar verildi.

---

## 3b · R15 AİLE ATAMASI NASIL ÇALIŞIYOR

**Adım 1 — JS aileyi dosya adından türetir.** `assets/js/fit-shell.js` **satır 859–861**:

```js
var DETAY_PAGES = ['challenge-v1','egzersiz-detay-v1','antrenor-detay-v1','program-detay-v1'];
var IS_DETAY = /-detay(-|$)/.test(PAGE) || DETAY_PAGES.indexOf(PAGE) > -1;
document.body.setAttribute('data-fit-hero-kind', IS_DETAY ? 'detay' : 'liste');
```

Yani: dosya adında `-detay-` geçen **veya** yukarıdaki dört sayfadan biri →
`detay`; geri kalan banner'lı sayfalar → `liste`.
**Yeni bir detay sayfası eklenirse bu diziye yazılmalı.**

**Adım 2 — CSS aileyi banner sınıfına bağlar.** `assets/css/fit-shell.css`
**satır 1843–1851**:

```css
body[data-fit-hero-kind="liste"] .lib-top,
body[data-fit-hero-kind="liste"] .fs-top,
body[data-fit-hero-kind="liste"] .kp-top,
body[data-fit-hero-kind="liste"] .ol-top{height:var(--banner-h-liste)}

body[data-fit-hero-kind="detay"] .lib-top,
body[data-fit-hero-kind="detay"] .ed-top,
body[data-fit-hero-kind="detay"] .cp-top,
body[data-fit-hero-kind="detay"] .chl-hero,
body[data-fit-hero-kind="detay"] .pd-hero{height:var(--banner-h-detay)}
```

**Adım 3 — imza banner'larının kendi `min-height`'ları sıfırlanır** (satır 1853–1858),
yoksa sayfa CSS'i aile ölçüsünü eziyor:
```css
body[data-fit-hero-kind] .kp-top, .ol-top, .chl-hero, .pd-hero, .cp-top{min-height:0 !important}
```

**Sonuç:** LİSTE **49 sayfa**, DETAY **6 sayfa**, aile dışı **1** (`dadafit-hub`).

**Yeni sayfa eklerken:** banner sınıfı yukarıdaki iki listeden birine girmeli;
yoksa sayfa hiçbir aileye bağlanmaz ve ölçüm "üçüncü değer" olarak yakalar.

---

# 4 · TEST SÜİTİ — 13 sınama

**Konum:** `tests/*.mjs` · **Ortak yardımcı:** `tests/_pw.mjs`

**Tam koşma komutu:**
```bash
cd ~/Developer/Projects/dadafit-prototip
python3 -m http.server 8811 &
export PW_HOME=~/.pw
for t in a11y-focus coach-list dropdown-position header-banner plan-account \
         fit-test-lock footer-curtain crumb-home wizard-page \
         sozluk sozluk-kapalilik anatomi workout-generator; do
  echo "=== $t ==="; node tests/$t.mjs
done
# beklenen: 13/13 · "0 sorun"
```

Tek tek: `node tests/<ad>.mjs [base] [genişlikler]`
Örnek: `node tests/crumb-home.mjs http://localhost:8811 1440,390`

| Sınama | Ne kanıtlar | Tur |
|---|---|---|
| `a11y-focus` | Kabuk katmanlarında odak tuzağı, Esc, odak dönüşü | eski |
| `coach-list` | Antrenör dizini kurgusu, filtre motoru, sticky sol kolon | eski |
| `dropdown-position` | Hover ↔ tıklama panel konumunu değiştirmiyor | eski |
| `header-banner` | Banner'lı sayfada header şeffaf, kaydırınca katı | eski |
| `plan-account` | Planım rayı 7 kalem, Hesabım rayı tekrarlamıyor | eski |
| **`fit-test-lock`** | **R14** — yanıt kilidi üç katman, geri alınamıyor, kapı hâlâ açılıyor | **5. tur** |
| **`footer-curtain`** | **R11** — perde footer'a yapışık, sağlık şeridi perdenin içinde | **5. tur** |
| **`crumb-home`** | **R3 + R12** — yalnız ikon, ölçü referansla birebir, ayraçla eşit | **5. tur** |
| **`wizard-page`** | **R13** — sihirbaz tam sayfa, pop-up site genelinde 0, 3 adım, 3 gerçek program | **6. oturum** |

> **K27 kuralı:** yeni sınama yazıldığında **taban commit'e karşı koşturulup
> kırmızıya döndüğü kanıtlanır.** Bu turun üçü de kanıtlandı (`44633fb`).
> Yöntem: `git worktree add <yol> 44633fb` → orada `python3 -m http.server 8814`
> → `node tests/<ad>.mjs http://localhost:8814`.

**Diğer araç:** `tools/page-check.mjs` — tek sayfa kalite kapısı
(`node tools/page-check.mjs <sayfa>.html 1440`). Kabuk mount, konsol hatası,
4xx alt kaynak, yatay taşma, header örtüşmesi, kırık iç bağlantı, marka kalıntısı.

---

# 5 · SIRADAKİ İŞ — H1·H2·H3 ve R15.4 KAPANDI

> **Brief'in (`tasks/REVIZYON-5.md`) revizyon maddelerinin tamamı kapandı:**
> R11 · R12 · R13 · R14 · R15 (15.1–15.4) · H1 · H2 · H3.
> **Bu turda açık bırakılan tek şey Beyar'ı bekleyen sorular (§6).**

## Sonraki oturumun ilk işi — AS-1 · "Haftalık Rutin" kolu

`antrenman-olusturucu-v1.html` çalışıyor ve sınamalı (13. sınama), ama
referansın **doğru kolu hiç ekranda görülmedi**. `tasks/H3-MUSCLEWIKI-AKIS.md`
**§11.5** o kolun iskeletini `[KAYNAK]`'tan çıkardı; ekranda doğrulanması ve
DadaFit'e uyarlanması sonraki tura kaldı. **Beş somut öneri belgenin sonunda**
(gün seçimi "hangi günler" olsun · bölünme otomatik önerilsin · ekipman üç
kipli olsun · katalog ikiye ayrılsın · sonuç ekranına üç özet göstergesi).

⚠️ **Site kalıcı WAF bloğunda** (K45). Yeni keşif denenecekse blok durumu
önce yoklanmalı; kalkmadıysa zorlanmayacak.

## Kütüphane darboğazı — H3'ün tavanı buraya bağlı

Egzersiz kütüphanesinde **yalnız 12 hareket** var ve bu H3'ün kalitesini
doğrudan sınırlıyor:

| Sorun | Sonuç |
|---|---|
| Havuz 12 kalem | 6 günlük bölünmede günler arası tekrar **kaçınılmaz** (K44) |
| Ekipmansız havuzda **çekiş hareketi yok** | ekipmansız planlarda İtiş/Çekiş dengesi kurulamıyor |
| `egzersiz-detay-v1` VERI'sinde **8/12 slug** | 4 hareket kartı `goblet-squat`'a düşüyor (K43) |

**Kütüphaneyi büyütmek bu turun en yüksek getirili tek işi.** Havuz ≥24
harekete çıkarsa H3'ün tekrar kuralı tek satırla yasağa döner.

# 6 · AÇIK SORULAR

## Cevaplanmış — KARAR olarak uygulanacak

| # | Karar |
|---|---|
| **S-G** | ✅ **KARAR: `antrenor-detay` ve `program-detay` TEK KOLONA çekilecek, istisna 0'a inecek.** Şu an h1 sol kenarı 348 ve 165 (başlığın yanında portre/medya var); hedef **56/56 sayfada 132 px**. CTA hizası da 21/21 olacak. |
| **S-H** | ✅ **KARAR: ana sayfa perdesi (`dadafit-hub`, 900 px) aileye GİRMEYECEK.** K15 gereği bilinçli istisna — 3. turda perde 74dvh'ye indirilmiş, Beyar *"ana sayfa herosunu bozmuşsun, düzelt"* demiş ve 100dvh'ye geri alınmıştı. `KARARLAR.md`'ye tek satır not düşüldü. Aile ölçümünde "üçüncü değer 1" olarak raporlanmaya devam edecek — bu bir kusur değil. |
| **S-F** | ✅ **KARAR: H1 · H2 · H3 menüye TEK KALEM altında girecek — "Hareketi Anlamak".** Menü **3 kalemde kalır**, K7 korunur. Ayrıntı aşağıda, karar kaydı **K34**. |

### S-F · Menü kalemi: "Hareketi Anlamak" — `KARARLAR.md` **K34**

**KARAR:** Spor Sözlüğü (H1), İnteraktif Anatomi (H2) ve Antrenman Oluşturucu
(H3) **ayrı menü başlığı almayacak**. Üçü de tek bir kalemin — **"Hareketi
Anlamak"** — altına girecek. Üst menü **3 kalemde kalıyor**; 4. turda 11'den
3'e indiren **K7 kuralı korunuyor**.

Menü markup'ına bu kalemi **yalnız H2 oturumu** ekleyecek (aşağıdaki paralel
çalışma kuralı). H1 ve H3, sayfaları hazır olsa bile menüye kendileri
dokunmayacak; kalem H2'nin birleşmesiyle üçünü birden açacak.

### Paralel çalışma kuralı — H1 · H2 · H3 ayrı branch — `KARARLAR.md` **K35**

**KARAR:** Üç modül **ayrı branch'lerde** yürüyecek. Çakışma riski tek bir
yerde toplanıyor: **paylaşılan kabuk**. Kural bu yüzden dosya bazlı.

| Dosya | Kim dokunabilir |
|---|---|
| `assets/css/fit-shell.css` | **YALNIZ H2** |
| `assets/js/fit-shell.js` | **YALNIZ H2** |
| **Menü markup'ı** (`NAV` / `BOTTOM` / drawer dizileri) | **YALNIZ H2** |
| Kendi sayfa dosyaları (`*-v1.html`) | Her oturum kendininkine |
| `tests/*.mjs` · `tasks/*.md` | Her oturum kendi yeni dosyasına |

**H1 ve H3 kabuğa dokunmayacak.** İhtiyaçları varsa **kendi sayfa içi
stillerini** yazacaklar (`<style>` bloğu, kendi sınıf öneki — R13'ün `pb-*`
ailesi gibi). Kabukta bir eksik görürlerse **kendileri düzeltmeyecek**, notu
devir dosyasına yazacak; H2 oturumu uygulayacak.

**Birleştirme sırası: H1 → H2 → H3.**
Gerekçe: H1 kabuğa hiç dokunmadığı için en temiz birleşme; H2 kabuk
değişikliğini ve menü kalemini onun üstüne getirir; H3 en son gelir çünkü
**H2'nin SVG gövde modeline bağımlı** (§5) ve kabuk o noktada zaten
oturmuş olur.

> **Neden bu kural:** 5. tur R15 tek başına `fit-shell.css`'te 1843–1960
> aralığını yeniden yazdı, R13 ise `fit-shell.js`'ten 344 satır sildi. İki
> oturum aynı anda kabukta çalışsaydı çakışma kaçınılmazdı — ve kabuk
> çakışması 60 sayfayı birden bozar.

### gh hesabı — push'tan önce kontrol et — `KARARLAR.md` **K36**

**KARAR / ortam notu:** Makinede **iki gh hesabı** kayıtlı: `By4r` ve
`gaviaworks-dev`. Bu depoya **yalnız `gaviaworks-dev` yazabiliyor**.

`By4r` aktifken `git push` şunu döndürüyor:
```
remote: Permission to gaviaworks-dev/dadafit-prototip.git denied to By4r.
fatal: ... The requested URL returned error: 403
```
Bu bir depo izni ya da remote URL sorunu **değil**, aktif hesap sorunu. Çözüm:

```bash
gh auth status                          # aktif hesabı gör
gh auth switch --user gaviaworks-dev    # gerekiyorsa geç
git push origin main
```

R13 push'u (6. oturum) ilk denemede bu yüzden düştü; hesap değiştirilip
geçildi. **Aktif hesap şu an `gaviaworks-dev`.**

## Hâlâ açık — Beyar'ı bekliyor

| # | Konu | Soru |
|---|---|---|
| ~~**S-C**~~ | R15.4 | ✅ **ÖLÇÜMLE CEVAPLANDI, R15.4 KAPANDI** (7. oturum). 64 sayfa tarandı: rahatsız eden **çakışma**ymış — banner eyebrow'u "Seans Kütüphanesi", sayfa içi h2 de "Seans kütüphanesi". Site genelinde eyebrow↔h2 birebir çakışması **yalnız o sayfada (1/64)**. Tipografi kuralı zaten vardı (`.sec-head` = eyebrow+h2+lead, **65 tam örnek**); yeni kural yazılmadı, kuralı ihlal eden tek örnek düzeltildi → h2 **"Tüm seansları süz"**. |
| **S1** | 4. tur | Kart **PRO rozetleri** — rozetler mi kalksın, filtre ekseni mi geri gelsin? Programlar merkezinde `#pro` bölümü ve "Erişim" ekseni kalktı ama kart rozeti duruyor; video kartlarında da 4'ten 1'i Pro. Kullanıcı farkı **görüyor ama süzemiyor**. |
| **S2** | 4. tur | **"140+ hareket"** ifadesi — gerçek **12**, H0 planı sonrası 38. Kabuk üst bandında ve üç sayfada daha duruyor. Gerçeğe mi çekilsin, hedef olarak mı etiketlensin, kalksın mı? |
| **S4** | 4. tur | `.btn-fit` kontrastı **3.54:1** (AA altı, ölçüldü). `--fit-deep` ile **5.45:1**. Site geneli birincil düğme koyulaşsın mı? |

---

# 7 · DOKUNULMAYACAKLAR

| Ne | Neden |
|---|---|
| **`dadafit-hub` kırıntısındaki "Dada Gastro"** | Kırıntının ilk kalemi kardeş marka portalı, DadaFit ana sayfası **değil** (sayfanın kendisi ana sayfa). Ev ikonuna çevrilmesi yanlış olur. 4. turda bilerek bırakıldı, 5. tur brief'i de dokunulmamasını söylüyor. `tests/crumb-home.mjs` bu sayfayı **istisna** olarak atlıyor. |
| **Ana sayfa herosu — `.df-top` 100dvh / 900 px** | `KARARLAR.md` **K15**. Bir kez kısaltıldı, Beyar açık cümleyle geri aldırdı. **S-H kararı: aileye girmeyecek.** |
| **R13 — sihirbaz tam sayfası** | Motor `programini-bul-v1.html`'e taşındı; kabuktaki modal/örtü katmanı ve `.wz-*` CSS ailesi silindi (K33). Kabuğa sihirbaz geri konmaz; `tests/wizard-page.mjs` kırmızıya dönerse gerileme demektir. |
| **H1 · H2 · H3 — 7. turda kapananlar** | Üçü de ölçüldü, sınamaya bağlandı ve push edildi. `tests/sozluk.mjs` · `tests/sozluk-kapalilik.mjs` · `tests/anatomi.mjs` · `tests/workout-generator.mjs` kırmızıya dönerse **gerileme** demektir. |
| **Kanonik slug sözleşmeleri** (K39·K40·K43) | 27 kas slug'ı · 12 hareket slug'ı · kas adları anatomiden · hareket adları kütüphaneden. Bu dört sözleşme paralel çalışmanın taşıyıcısı; üç sınama nöbet tutuyor. Tek taraflı değiştirilmez. |
| **Kural tablosu ↔ kod eşitliği** (K44) | `tasks/H3-KURALLAR.md` §9 ile sayfadaki `KURALLAR` bloğu **karakter karakter aynı** olmak zorunda. Biri değişirse ötekisi de değişecek; sınamanın 14. maddesi ayrışmayı yakalar. |
| **`assets/svg/` gövde modelleri** | H2 sıfırdan çizdi, H3'ün cinsiyet adımı da bunları kullanıyor. Hazır/stok anatomi görseliyle değiştirilmez. |
| **R11 · R12 · R14 · R15 — 5. turda kapananlar** | Dördü de ölçüldü, sınamaya bağlandı ve push edildi. Yeniden açılmaz; sınamalar kırmızıya dönerse **gerileme** demektir, yeni bir tercih değil. |
| **Banner ailesi token'ları** (`--banner-h-liste` / `--banner-h-detay`) | Referanstan ölçülmüş değerler (§2a). "Sayı uydurulmayacak" kuralı gereği tahminle değiştirilmez; değişecekse yeniden ölçülür. |
| **Kırıntı ev ikonu rengi** (`--fit-bright`) | Referanstan **ölçü** alındı, **palet** alınmadı (K29). Renk DadaFit'in. |
| **Sağlık şeridinin perdedeki yeri** | B10'un çözümü. `#pageMain`'in son çocuğu olmaktan çıkarılırsa 60 sayfada yeniden görünmez olur. |
| **`.fit-band-panel` geri taşıma kilidi** | B11'in çözümü. Kaldırılırsa ikincil paneller banner'a geri döner ve sabit kutu taşar. |

---

# 8 · YOLLAR

| Ne | Yol |
|---|---|
| **Bu turun brief'i** | `tasks/REVIZYON-5.md` *(Beyar'ın `REVIZYON-5-2.md` dosyasının deponun içindeki kopyası)* |
| **Anatomi kaynağı (H2)** | `/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf` — 23 MB |
| Bu turun planı | `REVIZE-PLAN-5.md` |
| Kararlar (K1–K31) | `KARARLAR.md` |
| 4. turun modül konsepti | `tasks/H0-YENI-MODUL-KONSEPT.md` |
| **H3 kural tablosu** | `tasks/H3-KURALLAR.md` — kod bundan okuyor |
| **H3 keşif kaydı** | `tasks/H3-MUSCLEWIKI-AKIS.md` (1763 satır) + `tasks/h3-akis/` (11 görüntü) |
| Test süiti | `tests/*.mjs` |
| Kalite kapısı | `tools/page-check.mjs` |
| Kabuk | `assets/js/fit-shell.js` · `assets/css/fit-shell.css` · `assets/css/fit-type.css` |
| Playwright | `PW_HOME=~/.pw` (playwright-core 1.62.1) |
| Yerel sunucu | `python3 -m http.server 8811` |
| Canlı | `https://gaviaworks-dev.github.io/dadafit-prototip` |

**PDF araçları (kurulu, `/opt/homebrew/bin/`):**
```bash
pdfinfo   "/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf"
pdftotext -layout "/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf" muscle.txt
pdfimages -list   "/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf"
pdftoppm  -jpeg -r 150 "/Users/gaviaworks/Desktop/Dada Fit Sources/Muscle.pdf" sayfa
```
