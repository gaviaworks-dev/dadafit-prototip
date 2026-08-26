olcum v1 · 2026-08-26 · şerit: FIT · iş kalemi: Fit maket kapanış turu (P14)

# DEPLOY ÖNCESİ KONTROL LİSTESİ — DadaFit prototipi

**Ne bu:** P14 gereği Fit maketi diğer üç markanın backend'li dalgalarını
beklemeden bitirilip yayına alınacak. Bu belge, **yayına almadan önce
koşulacak denetimleri ve son koşumun ölçülmüş sonucunu** taşır.

🔴 **DEPLOY BU BELGEYLE YAPILMAZ.** GitHub Pages yayını ayrı bir iştir ve
izni Beyar'dadır. Burada yazan tek şey: **hazır mı, neresi açık.**

**Son tam koşum:** 2026-08-26 · 70 HTML · yerel sunucu `python3 -m http.server`.

---

## 0 · ÖZET TABLO

| # | Denetim | Ölçüm | Durum |
|---|---|---|---|
| 1 | Kırık dosya hedefi (yerel `<a href>`) | **0** / 70 sayfa | ✅ |
| 2 | Kırık çapa (`#parça` hedefte yok) | **0** (1 bulundu, düzeltildi) | ✅ |
| 3 | Konsol / sayfa hatası | **0** / 70 sayfa | ✅ |
| 4 | Kök-mutlak yol (`href="/…"` · `src="/…"` · `url(/…)`) | **0** | ✅ |
| 5 | Protokolsüz yol (`//host/…`) | **0** | ✅ |
| 6 | `<title>` eksik | **0** / 70 | ✅ |
| 7 | `<meta name=description>` eksik | **44** / 70 | 🟡 açık |
| 8 | 75 karakterden uzun `<title>` | **2** | 🟡 açık |
| 9 | Sayfa gövdesinde birden çok `<h1>` (DOM) | **1 sayfa** (`giris-v1`, 5 adet; görünür olan **1**) | 🟡 açık |
| 10 | Yer tutucu denetimi (kod→defter, KATI) | **16 anahtar / 16'sı defterde** | ✅ |
| 11 | Yer tutucu denetimi (defter→kod, ESNEK) | **3 yokluk kaydı** — ihlal değil | ✅ |
| 12 | `data-placeholder` (yasak ikinci nitelik) | **0** | ✅ |
| 13 | `todo.md` (yasak ikinci defter) | **yok** | ✅ |
| 14 | Hesap ailesi QA (**19 adres** × 4 genişlik) | taşma **0** · konsol **0** · h1 tek · h2 korundu | ✅ |
| 15 | Nöbet süiti (**11 dosya**) | **11/11 yeşil** | ✅ |
| 16 | Başlık hiyerarşisi — kayıtlı taban | **5 sayfa** (dördü bu turda hiç açılmadı; `sss-v1` yalnız ADI değişti, yapısı değil) | 🟡 açık |
| 17 | Dokunma hedefi < 44px | **47–52 kontrol** (kayıtlı not) | 🟡 açık |

---

## 1 · GÖRELİ YOL DENETİMİ — 🔴 GitHub Pages alt dizinde sunulur

**Neden kritik:** Pages projesi `https://<kullanıcı>.github.io/<depo>/` gibi
bir **alt dizinde** yayınlanır. Kök-mutlak bir yol (`/assets/css/x.css`)
alt dizini atlar ve `https://<kullanıcı>.github.io/assets/…` ister — **404**.
Yerelde `http://localhost:8811/` kökten sunulduğu için bu hata **yerelde
hiç görünmez**; ancak yayında ortaya çıkar.

**Ölçüm (2026-08-26):**

```
grep -oE '(href|src)="/[^/"][^"]*"' *.html assets/js/*.js   → 0
grep -oE 'url\(["'\'']?/[^/)][^)]*\)'  assets/css/*.css      → 0
grep -oE '(href|src)="//[^"]*"'        *.html assets/js/*.js → 0
```

→ **Depodaki her iç yol görelidir** (`assets/…`, `sayfa-v1.html`).
Alt dizinde sunum güvenli.

⚠ **Yeni sayfa eklendiğinde bu üç grep tekrar koşulur.** Tek bir
`href="/hesabim"` bütün kabuğu düşürmez ama o bağlantıyı sessizce 404 yapar.

---

## 2 · KIRIK BAĞLANTI VE ÇAPA TARAMASI

**Yöntem:** 70 sayfa gezilir; her sayfadaki yerel `<a href>` (http/mailto/
tel/salt-`#` hariç) toplanır. İki ayrı ölçüt:
1. **Dosya hedefi** — hedef dosya diskte var mı.
2. **Çapa** — `dosya#parça` biçimindeki hedefin `parça`sı o sayfada
   gerçekten `id` olarak var mı.

**Sonuç:** kırık dosya hedefi **0** · kırık çapa **0**.

⚠ **Bu turda 1 kırık çapa bulundu ve düzeltildi:**
`antrenor-panelim-v1.html` → `uyelik-faturalandirma-v1.html#fatura`.
Hedef sayfadaki gerçek `id` **`#faturalar`**tı (`:872`). Dosya hedefi 200
döndüğü için yalnız dosya taraması bunu **yakalamazdı** — çapa taraması
ayrı bir ölçüttür ve öyle kalmalıdır.

---

## 3 · KONSOL HATASI TARAMASI

70 sayfa `networkidle` beklenerek gezildi; `console.error` ve `pageerror`
dinlendi. **Sonuç: 0.**

⚠ Kapsam şerhi: tarama **1440px**te ve **etkileşimsiz** koşar. Etkileşime
bağlı hatalar (sekme değiştirme, form gönderme, modal açma) nöbet
dosyalarının işidir; onlar dört genişlikte koşar (bkz. §6).

---

## 4 · `<title>` / META BÜTÜNLÜĞÜ

| Ölçüt | Sonuç |
|---|---|
| `<title>` eksik | **0** |
| `<meta name="viewport">` eksik | **0** |
| `<html lang>` eksik | **0** |
| `<meta name="description">` eksik | 🟡 **44 / 70** |
| `<title>` 75 karakterden uzun | 🟡 **2** |

🟡 **AÇIK KALEM — 44 sayfada açıklama etiketi yok.** Deploy'u engellemez
(sayfalar `noindex, nofollow` taşıyor, yani arama motoruna zaten
açılmıyor), ama paylaşım önizlemesi ve iç tutarlılık için eksiktir.
Bu turda dokunulan altı sayfanın **altısında da** açıklama var.

⚠ **`noindex` şerhi:** prototipin her sayfası
`<meta name="robots" content="noindex, nofollow">` taşıyor. Yayın gerçek
kullanıma açılacaksa **bu etiket bilinçli olarak kaldırılmalıdır** —
unutulursa site canlıdır ama aranamaz. Karar Beyar'ındır.

---

## 5 · DIŞ KAYNAK BAĞIMLILIKLARI

| Host | Sayı | Ne | Risk |
|---|---|---|---|
| `images.unsplash.com` | **346** | Banner ve kart görselleri (sorgu parametreli) | 🟡 Üçüncü taraf; kesinti/oran sınırı görselleri düşürür. Sayfa **çöker mi: hayır** — `.lib-top` gradient'i altta durur |
| `cdnjs.cloudflare.com` | **69** | FontAwesome **6.5.2**, SRI hash'li (`integrity` + `crossorigin`) | 🟢 Sürüm ve hash kilitli. Düşerse ikonlar kaybolur, metin kalır |
| `by4r.github.io` | **47** | Kardeş marka (DadaGastro portalı) bağlantıları | 🟢 Gezinme bağlantısı, kaynak değil |
| `www.w3.org` | 30 | SVG ad alanı (`xmlns`) | 🟢 **İstek değil**, yalnız ad alanı dizgisi |
| `policies.google.com` · `openstreetmap.org` · `calendar.google.com` · `gaviaworks.com` | 8 | Metin içi bağlantılar | 🟢 |

🔴 **Yerel yedek yok.** FontAwesome ve görseller CDN'den gelir; depoda
kopyası yoktur. Çevrimdışı ya da CDN kesintili bir gösterimde ikonlar ve
görseller düşer. **Bu bir ürün kararıdır** (depo boyutu ↔ bağımsızlık) ve
bu turda değiştirilmedi.

---

## 6 · NÖBET SÜİTİ — deploy öncesi koşulacak yedi dosya

```
export PW_HOME=~/.pw
python3 -m http.server 8811 &          # depo kökünden

node tests/destek-akisi.mjs            # destek akışı (2 sayfa · sekme · kart iskeleti)
node tests/plan-account.mjs            # hesap menüsü üçlüsü · ayraç · üyelik kalemi
node tests/destek-kanon.mjs            # destek KANONU (4 durum · aktör ayrımı · sayfalama)
node tests/antrenor-panelim.mjs        # antrenör paneli (K4·K6·K13 · kart kiti)
node tests/hesap-ailesi-qa.mjs         # 18 adres × 4 genişlik
node tests/kabuk-r8.mjs                # kabuk / hesap menüsü / yer tutucu kaydı
node tests/hizalama-nobeti.mjs         # metin yaslama ve dolgu
node tests/footer-yapi.mjs             # footer sözleşmesi   (port 8852 bekler)
node tests/header-banner.mjs           # header şeffaflığı · 22 sayfa × 4 genişlik
node tests/a11y-focus.mjs              # kabuk katmanlarında odak tuzağı
node tests/kabuk-kalite.mjs            # (port 8843 bekler)
```

**Son koşum: hepsi yeşil.**

⚠ `footer-yapi.mjs` **8852** portunu bekler, ötekiler **8811**. İkisini de
ayağa kaldırmadan süit kırmızı görünür — bu bir kusur değil, kayda geçer.

---

## 7 · YER TUTUCU DENETİMİ (sözleşme §7.4 · v2.5)

**Tek nitelik `data-yer-tutucu` · tek defter `docs/icerik-bekleyen.md`.**

```
# kod → defter (KATI)
grep -rho 'data-yer-tutucu="[^"]*"' *.html assets/js/*.js assets/css/*.css | sort -u
# defter → kod (ESNEK)
grep -o '^| `[a-z0-9-]*`' docs/icerik-bekleyen.md
# yasaklı ikinci nitelik / ikinci defter
grep -rl "data-placeholder" *.html assets/ ; ls todo.md
```

**Ölçüm (2026-08-26):**

- **Kod → defter (KATI): 16 anahtar, 16'sı da defterde.** İhlal **0**.
- **Defter → kod (ESNEK): 3 kalem** defterde var, kodda niteliği yok —
  `magaza-adresleri` · `uygulama-qr` · `ustbant-sosyal`. Üçü de **yokluk
  kaydı**: üretilmemiş bir QR, konmamış bir mağaza adresi, basılmamış bir
  satır. Sözleşme §7.4 bunu **ihlal saymaz** — nitelik takılacak öğe yoksa
  nitelik de olmaz; üçünün de defter satırı "içerik gelince nereye
  gireceğini" yazıyor.
- `data-placeholder` → **0** · `todo.md` → **yok**.

⚠ **ÖLÇÜM TUZAĞI, kayda geçer:** ham `grep`, `assets/js/fit-shell.js:583`
ve `:698`teki **şablon dizgisini** (`data-yer-tutucu="'+a.yerTutucu+'`)
17. bir "anahtar" gibi sayar. Bu bir anahtar değil, kabuğun yer tutucu
kalemi ÜRETEN mekanizmasıdır — gerçek anahtarı çağıran veriden alır.
Denetim koşulurken bu satır elenir; elenmezse her turda sahte bir ihlal
raporlanır ve bir sonraki tur onu "düzeltmeye" çalışır.

**Bu turda defterle eklenen üç kalem:**
`antrenor-aylik-paket-ucreti` (konumu genişledi) ·
`antrenor-kazanc-tutarlari` (yeni) · `antrenor-komisyon-parametreleri` (yeni).

---

## 8 · 🔴 BİLİNÇLİ OLARAK EKSİK BIRAKILANLAR — ve gerekçeleri

Bu bölüm **deploy'u engellemez**; yayına çıkan maketin neyi kasten
taşımadığını kayda geçirir. Hiçbiri "unutuldu" değildir.

| # | Eksik | Gerekçe |
|---|---|---|
| **E1** | **Kart ekleme yüzeyi** (`hesabim` → ödeme) | 🔴 Beyar kararı: *"dört markada ortak karar bekliyordu, Fit öne alındığı için burada da bekleyecek. DOKUNMA."* Sözleşme §1.5: dört marka **yok olan yetenek için AYNI dili** konuşmalı; Gastro'da uç yok, Diet'te Policy `false`. Fit'e modal çizmek **yeteneğin var olduğunu varsaymak** ve üçüncü bir dil üretmek olurdu |
| **E2** | **Destek yönetim masası** (destek ekibinin ekranı) | Fit'te yönetim paneli **hiç yok**; Beyar bu turda ayrı şerit açmayı reddetti. Durum makinesi **kuruldu** (aktör ayrımı · destek kolu · yanıt yan etkisi) ve `tests/destek-kanon.mjs §7` ile kilitlendi; eksik olan yalnız **yüzey**. Kanon §8.4'ün Diet'te ölçtüğü durumun aynısı |
| **E3** | **Destek talebi durumunun kalıcılığı** | K14: Fit **maket düzeyinde** kalır, backend sonradır. Kapatma/yeniden açma sayfa yenilenince maket verisine döner. Sayfanın kendi JS şerhi bunu yazıyor |
| **E4** | **Rozet motoru** | K2: her marka kendi rozetini kendi kurar; bu turun kuralı *"maket düzeyinde çiz, MOTOR YAZMA"*. Galeri 8 aile / 42 rozet / 8 basamak ile **tam**; kazanma koşulu hesaplayan JS yok. Tetikleneceği depolama sözleşmesi (`FIT_PLAN`) hazır (`docs/rozet-eksenleri-fit.md §6`) |
| **E5** | **Antrenör paketi ekleme/düzenleme formu** | Bir paketin ücreti komisyon oranı, ödeme alt sınırı ve fatura eşiğiyle birlikte anlam kazanır; K13 bunları **panelden okur** ve o panel yok. Form çizmek, parametrelerin kararlaşmış olduğunu varsaymaktır. Sayfada gerekçe + gerçek çıkış yolu yazılı |
| **E6** | **Randevu onay/erteleme düğmesi** | Randevu durumu iki tarafın **aynı anda** gördüğü tek kayıttır; üye tarafı (`fit-planim-randevular-v1.html`) da bugün sadece arayüz. Tek taraflı çalışan düğme, danışanın ekranında karşılığı olmayan bir hâl bırakırdı |
| **E7** | **Kazanç rakamları** | 🔴 K13: komisyon oranı · ödeme günü · alt sınır · fatura eşiği · iade kuralı **panelden okunur, koda gömülmez**. Yapı tam çizildi; **hiçbir para rakamı yazılmadı** ve tutar hücreleri `data-yer-tutucu` taşıyor. Sahte tutar, oranın onaylanmış olduğu izlenimini verirdi |

---

## 8.1 · AD KARARI — hangi sayfa hangi adı taşıyor

🔴 **Beyar, 2026-08-26 (bağlayıcı):** *"Ad kanonu 'Destek Merkezi'. Fit'teki
sayfanın adı da öyle olsun. Çözüm Merkezi ayrı sayfa (SSS tarafı), o adla
kalabilir. Menü kalemi Destek Merkezi'ne gitsin."*

| Dosya | `<h1>` | Rolü |
|---|---|---|
| `destek-v1.html` | **Destek Merkezi** | Destek yüzeyi: çözüm konuları + açık taleplerin + talep açma çıkışı. **Hesap menüsünün hedefi** |
| `destek-talepleri-v1.html` | **Destek Taleplerim** | Talep listesi + durum süzgeci + yeni talep formu |
| `destek-talebi-detay-v1.html` | *(talebin başlığı)* | Yazışma + durum geçişleri |
| `sss-v1.html` | **Çözüm Merkezi** | SSS tarafı, halka açık. Ayrı sayfa |

**Sonuç:** hesap menüsünün "Destek Merkezi" kalemi artık **aynı adı taşıyan**
sayfaya iniyor — ad ↔ hedef çelişkisi (S1) kapandı.

✅ **KAPANDI — Beyar kararı, 2026-08-26 (`KARARLAR.md` K70).** Kurumsal
footer bandındaki **"Çözüm Merkezi"** kalemi `destek-v1.html`e iniyordu; yani
artık **"Destek Merkezi"** adını taşıyan sayfaya. Etiket ile hedef ayrışmıştı.
Beyar *"kurumsal banttaki 'Çözüm Merkezi' etiketi sss sayfasına insin"* dedi;
hedef **`sss-v1.html`** oldu. Değişen üç yer: `assets/js/fit-shell.js`
(`FOOTER_CORP` — footer'ın tek kaynağı) · `tests/footer-yapi.mjs` (beklenen
hedef; nöbet zayıflatılmadı, bant yine 8 kalem ve hedef yine birebir aranıyor)
· bu satır. Eski karar (R8/6+35) **silinmedi**, K70 ile geçersiz kılındığı
yazıldı.

⚠ Destek hub'ının girişi kaybolmadı: hesap menüsündeki **"Destek Merkezi"**
kalemi `destek-v1.html`e inmeye devam ediyor (§8.2).

---

## 8.2 · HESAP MENÜSÜ ALT ÜÇLÜSÜ — son hâl

Sözleşme **§7.6** (kanon Diet). Masaüstü açılır menü ve mobil çekmece
**aynı üçlüyü aynı sırayla** taşıyor (ikisi de tek kaynaktan, `ACCOUNT`).

| # | Metin | İkon | Hedef |
|---|---|---|---|
| 1 | **Hizmet Paketlerim** | `fa-receipt` | `hesabim-v1.html#uyelik` |
| 2 | **Hesap ve Ayarlar** | `fa-sliders` | `hesabim-v1.html` |
| 3 | **Destek Merkezi** | `fa-headset` | `destek-v1.html` |
| 4 | Çıkış | `fa-right-from-bracket` | — |

- Ayraç sayısı **4 → 3**: Çıkış'ın üstündeki dördüncü çizgi kaldırıldı
  (§7.6: *Çıkış bu grubun içindedir*).
- 1. kalem **ikame**dir (§7.6.2): Fit'te abonelik yoktur (K6), karşılığı
  antrenör hizmet paketidir. Sıra · yer · ikon kanondan, **dizgi markanın
  gerçek yeteneğinden** (§7.6.1).
- İki ikon kanona çevrildi: `fa-gear` → `fa-sliders` · `fa-circle-question`
  → `fa-headset`.

---

## 9 · 🟡 AÇIK KALEMLER — deploy'u engellemez, kayda geçer

| # | Kalem | Ölçüm | Not |
|---|---|---|---|
| **A1** | 44 sayfada `meta description` yok | 44 / 70 | Sayfalar `noindex` taşıyor; yine de eksik |
| **A2** | `noindex, nofollow` etiketi 70 sayfada duruyor | 70 / 70 | Gerçek kullanıma açılacaksa **bilinçli olarak kaldırılmalı** |
| **A3** | 2 sayfada `<title>` 75 karakterden uzun | 2 | Kırpılma riski |
| **A4** | Başlık hiyerarşisi — 5 sayfa | `profil-v1` (h2 yok · h1→h4) · `bildirimler-v1` (h2 yok) · `fit-planim-veri-izin-v1` (h2 yok · h1→h3) · `giris-v1` (DOM'da h2, h1'den önce) · `sss-v1` (h2 yok · h1→h3; bu turda yalnız **adı** değişti, yapısı değil) | 🔴 **Bu turda DOKUNULMADI.** Düzeltmek `.fp-head h3` gibi ETİKETE bağlı kabuk kurallarını ve onlara bağlı JS seçicilerini kırabilir (ders D-3). `tests/hesap-ailesi-qa.mjs` içinde **adıyla kayıtlı taban**; listede olmayan her yeni bulgu kırmızıdır |
| **A5** | Dokunma hedefi 44px altında 47–52 kontrol | `button.ntr-op` 34×34 (bildirimler, 25 adet) · `button.fp-act` 24×16 (Fit Planım ailesi) · `button.pf-ava-edit` 34×34 · onay kutuları 19–20px | 🔴 Bu turda dokunulan **altı sayfanın hiçbiri** listede yok. Kabuğun R6 örtü tekniği (`::before` ile 44px) bu düğmelere uygulanmamış |
| **A6** | Dış kaynakların yerel yedeği yok | FontAwesome + 346 Unsplash görseli | Ürün kararı; CDN kesintisinde ikon ve görsel düşer |
| **A7** | `giris-v1.html` DOM'unda 5 `<h1>` | görünür olan **1** | Panelli yapı; gizli paneller de h1 taşıyor |

---

## 10 · DEPLOY ANINDA YAPILACAKLAR (sıra)

1. `git status` temiz mi · dalın doğru mu.
2. Yerel sunucu **8811** ve **8852**; §6'daki dokuz nöbet **yeşil** mi.
3. §1'in üç grep'i → **0** mı (yeni sayfa eklendiyse şart).
4. §7'nin yer tutucu denetimi iki yönlü → ihlal **0** mı.
5. §4'ün `noindex` kararı verildi mi (Beyar).
6. `docs/screenshots/` ve `tasks/` **gitignore** dışında kalmıyor mu
   (`*.png` desen olarak kapalı).
7. Yayın sonrası **alt dizin duman testi**: yayınlanan adresin kökünden
   `index.html` açılır, oradan üç iç sayfaya girilir; `assets/css` ve
   `assets/js` isteklerinin **200** döndüğü ağ sekmesinden doğrulanır.
   (§1'in kâğıt üstünde geçtiği ama yayında kırıldığı tek yer burasıdır.)

---

*Kontrol listesi sonu. Deploy izni bu belgeyle verilmez.*
