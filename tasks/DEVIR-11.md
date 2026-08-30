# DEVIR-11 — Yönetim paneli görünüm turu (R17)

> Masaüstü kopyası: `~/Desktop/dada-fit-admin-handoff-2.md` (birebir aynı).

**Tarih:** 2026-08-30 · **Tur:** R17 (görünüm turu)
**Depo:** `~/Developer/Projects/dadafit-prototip` (statik HTML prototipi, Laravel yok, buildless)
**Sunucu:** `python3 -m http.server 8788 --bind 127.0.0.1` — **ayakta bırakıldı**
**Giriş adresi:** `http://127.0.0.1:8788/admin-v1.html`
**Commit:** `df04552..174f3d5` · 7 commit · `origin/main` (`gaviaworks-dev` hesabı) · push edildi

> Bir önceki not: `~/Desktop/dada-fit-admin-handoff.md` (R16/2). Orada tarif
> edilen ana iş — **panelin görünümü** — bu turda yapıldı ve kapandı.

---

## 1 · Bu turun tek işi: görünüm

R16/2 panelin 21 ekranını kurmuş ve hepsi ölçüm kapılarını geçmişti; ama
**kabuğun görünümü ölçülmemiş, uydurulmuştu**. Kit içinde kalan, tek bir token
bile icat etmeyen, ama Gastro'ya hiç benzemeyen bir panel çıkmıştı.

Bu turda kaynak okundu ve yapı ona çekildi.

**Kaynak** — salt okuma, kod alınmadı, **yapı alındı**:

| Dosya | Satır | Ne verdi |
|---|---|---|
| `dadagastro-profil/public/reference/admin/sa-shell.css` | 436 | kabuk kanonu · tokenler · KPI · kart |
| `…/admin/sa-rail.css` | 90 | ikon rail |
| `…/admin/sa-ui.css` | 290 | form kiti · yayın yan kartı · SEO ölçütü |
| `…/admin-kullanicilar/sa-kullanicilar.css` | 131 | liste kalıbı: filtre şeridi · tablo · sayfalama |
| `…/admin-dashboard/sa-dashboard.css` | 56 | KPI markup'ı · hızlı aksiyon listesi |
| `dadagastro-profil/resources/views/admin/layout.blade.php` | 508 | kabuk markup'ı ve sırası |

### Değişen tek şey: renk

Ve o bile icat değil. Gastro'nun **kendi** `sa-shell.css:74`'ü zaten şunu
yazıyor:

```css
body[data-sec="dadafit"]{--acc:#009d4f;--acc-deep:#007a3d;--acc-rgb:0,157,79}
```

Üç aksan değeri Gastro'nun kendi dosyasından, **Fit için ayrılmış satırdan**
alındı. Çeviri bile yapılmadı.

### Ölçülen fark — R16/2 ile bugün

| | R16/2 (uydurulmuş) | R17 (ölçülmüş) |
|---|---|---|
| **İkon rail** | YOK | **76px · `#19160F`** · en koyu katman · aktifte sol 3px aksan çubuğu |
| **Sidebar** | tek katman **beyaz** 276px | **iki katman koyu**: rail 76 + menü 264 = **340px** |
| **Menü zemini** | `--paper` | **`#211E16`** (= kitin `--fit-dark`ı, birebir aynı literal) |
| **Menü başlığı** | marka rozeti + DadaFit + YÖNETİM alt satır | küçük yeşil **YÖNETİM** üst etiketi + büyük **DadaFit** |
| **Arama** | üst barda **ortada**, 320px | üst barda **SOLDA**, `flex:1` `max-width:420px` |
| **Sayfa başlığı** | **üst barda** (gövdede hiç yok) | **gövdede**, kartların üstünde — `h1` 24px + `.ph-sub` |
| **Üst bar sağı** | "Siteyi gör" düğmesi + kare avatar | site ikonu + **yuvarlak harf avatarı** + ad/rol + açılır ok + menü |
| **Daralt** | sidebar'ın **altında tam genişlik düğme** | menünün **dış kenarında yüzen tutamak**, dikey ortada (`‹`/`›`) |
| **KPI kartı** | ikon + sayı + not | ikon 44px **solda** → sayı 26px → etiket → **trend satırı** (`.kpi-delta`) |
| **Tablo başlığı** | gri zeminli | **zeminsiz**, 11.5px/700 `.06em`, ilk hücre 22px sol dolgu |
| **Liste araması** | kart **başlığında** | kartın **filtre şeridinde SOLDA** (`max 320px`) |
| **Sayfalama** | kart içinde | kart içinde, ayakta · solda bilgi, sağda numaralar |

### Gastro'dan bilerek sapılan tek eksen: dokunma hedefi

Gastro `.ia-btn` **32px** · `.pg-btn` **34px** · `.btn-sm` **~40px** basıyor.
Bu deponun kendi kapısı (`docs/qa/admin-denetim.mjs:82`) bu ailelerden
`height >= 44` istiyor (WCAG 2.5.8) ve kit §5/§6/§10 aynı kararı üç kez verdi.

**Çözüm Gastro'yu bozmadan: görsel Gastro'nunki, hedef 44px.** Kutu `::before`
ile 32/34px çizilir, tıklanabilir alan 44px kalır — kitin `.kyt-btn` deseninin
aynısı (§10: "hedef 44, göz 26"). Ölçüldü: görüntü Gastro ile aynı, kapı yeşil.

Daralt tutamağında da aynı: şerit 26 → **44px**, `translateX` yarısı kadar
(−22px) geri alındı; **görünen tutamak x=330'da**, yani tam Gastro'daki yerinde.

---

## 2 · Nasıl çalışıldı — kabuk önce, sonra altı ajan

1. **Lead kabuğu tek başına yazdı** (`fit-admin.css` + `fit-admin.js`).
   Ajanlar bu iki dosyaya hiç dokunmadı; kusur görünce **durup bildirdiler**.
2. **Beş ajan paralel**, 21 ekranı bölüştü.
3. **Altıncı ajan** çapraz denetim sonrası tek işe çıktı (toplu eylem sökümü).
4. **Çapraz denetim** — yeni bir ölçüm betiğiyle (§4).

Ajanların bildirdiği ve **lead'in kabukta düzelttiği** kusurlar §3'te.

---

## 3 · Değişen dosyalar

### Kabuk — 🔴 yalnız lead yazar

| Dosya | Satır | Ne oldu |
|---|---|---|
| `assets/css/fit-admin.css` | 343 → **859** | **Baştan yazıldı.** Rail · menü · tutamak · üst bar · hesap menüsü · sayfa başlığı · kart · ayak satırı · filtre şeridi · tablo · sayfalama · KPI + trend · boş durum · durum rozeti · kimlik hücresi · rol rozeti · çip · form kiti · SEO skoru · form içi sekme · hızlı aksiyon |
| `assets/js/fit-admin.js` | 437 → **530** | **Kabuk basma kısmı baştan yazıldı.** `railHtml` · `menuHtml` · `topHtml` yeni; rail bölüm seçici, daralt tutamağı, hesap menüsü eklendi. `MENU` dizisi, `SAYAC`, `FIT_ADMIN` yardımcıları **değişmedi** |

**Sayfa sözleşmesi değişmedi:**
```html
<body class="adm-body" data-adm="challenge">
  <div id="fitAdminTop"></div>
  <main class="adm-main"><div class="adm-page"> … </div></main>
```

**Sınıf adı sözleşmesi — iki ad, tek kural.** 21 ekran `.adm-*` adlarıyla
yazılmış ve işlevleri doğru; adları değiştirmek 21 dosyada gövde markup'ı
elemek olurdu. Bunun yerine her kural **iki seçiciye birden** yazıldı:
`.adm-card, .pnl-card{…}` · `.adm-table, .ptable{…}`. Gastro'nun adı kanon,
`.adm-*` onun eş anlamlısı; ikisi de aynı pikseli basar.

### 21 ekran

Hepsi değişti. Ekran başına yapılan iş:

1. Sayfa başlığı gövdeye: `<h2>` → `<h1>` + `<p>` → `<div class="ph-sub">`.
2. Liste araması kart başlığından **filtre şeridine, sola**; süzgeç sağa.
3. KPI üçüncü satırı `.note` → `.kpi-delta up|down|flat` + ikon.
   **Metin değişmedi** — sınıf ve ikon ekranın zaten hesapladığı sayıdan türedi.
4. Kaydet çubuğu tek ada: `.form-actions` içinde `.c-foot`.
5. Uydurulmuş satır içi ölçü/renk kabuk sınıflarına devredildi.
6. Kaynak şeridi (`.adm-src`) korundu — 21/21.

| Ekran | satır farkı | Ekran | satır farkı |
|---|---|---|---|
| `admin-v1` | 70 | `admin-odemeler-v1` | 37 |
| `admin-hareketler-v1` | 45 | `admin-rozetler-v1` | 93 |
| `admin-programlar-v1` | 41 | `admin-log-v1` | 49 |
| `admin-challenge-v1` | 75 | `admin-menu-v1` | 61 |
| `admin-testler-v1` | 42 | `admin-reklam-v1` | 77 |
| `admin-taksonomi-v1` | 83 | `admin-paketler-v1` | 73 |
| `admin-sayfalar-v1` | 205 | `admin-bildirim-v1` | 29 |
| `admin-uyeler-v1` | 76 | `admin-ayarlar-v1` | 157 |
| `admin-antrenorler-v1` | 34 | `admin-raporlar-v1` | 78 |
| `admin-moderasyon-v1` | 17 | `admin-destek-v1` | 17 |
| `admin-hizmetler-v1` | 230 | | |

### Ölçüm betikleri

| Dosya | Ne |
|---|---|
| `docs/qa/admin-kalip-denetim.mjs` | **YENİ, 172 satır.** 21 ekranı **yan yana** ölçer: kabuk değerleri tek değere iniyor mu, kalıp değerleri iniyor mu; sapan ekranı adıyla söyler. Ekran listesini kabuğun kendi `MENU` dizisinden okur — yeni ekran eklendiğinde kendiliğinden ölçülür |
| `docs/qa/admin-icerik-olcum.mjs` | Eskimiş seçiciler kanona çekildi: arama `.c-head`te değil `.filter-bar`da, breadcrumb yok, kaydet çubuğu `.form-actions`. Beklenen çubuk mesafesi 21 → **23px** (ayak dolgusu Gastro'nun 22'si + 1px kenarlık) |

⚠ `admin-icerik-olcum.mjs`in **arama seçicisi kırıktı** ve bu sessiz bir
kusurdu: boş durum sondası hiç koşmuyordu, kapı her ekranda "boş durum yok"
diyordu. Ölçüm betiğinin kendisi de eskiyebilir.

### Belgeler

| Dosya | Ne oldu |
|---|---|
| `docs/fit-kit.md` §13 | **Yeniden yazıldı.** R16/2'nin 276px beyaz sidebar ölçüleri geçersizdi; her sayı artık hangi dosyanın hangi satırından geldiğini yazıyor |
| `docs/fit-admin-plan.md` §5 | **Yeniden yazıldı** — kabuk ölçüleri + yapı şeması |
| `docs/fit-admin-plan.md` §7/1 | **Geri alındı** — "sidebar 276px" kararı ve post-mortem'i |
| `docs/fit-admin-plan.md` §9, §10 | K6 döndüğü için abonelik kalemleri "gelmeyen" değil **sıradaki** oldu |
| `docs/lessons.md` §29 | **YENİ** — turun dersi (§7'de) |
| `tasks/kuyruk.md` | İki yeni açık kalem (§5) |

---

## 4 · Çapraz denetim — tur öncesi / tur sonrası

`PW_HOME=~/.pw node docs/qa/admin-kalip-denetim.mjs`

| Ölçüm | Tur öncesi | Tur sonrası |
|---|---|---|
| **Kabuk sapması** (rail · menü · üst bar · gövde girintisi · aktif kalem · tutamak) | ölçülmüyordu | **0** — 21 ekranda tek değer |
| **Kalıp sapması** (h1 · kart yarıçapı · kart başlığı dolgusu · tablo başlığı · filtre şeridi dolgusu) | ölçülmüyordu | **0** |
| Gövdede `h1` | 0/21 | **21/21** (24px) |
| Başlık alt satırı `.ph-sub` | 0/21 | **21/21** |
| Filtre şeridinde arama (320px) | 0/18 | **18/18** |
| Kart başlığında kalan arama | 22 | **0** |
| KPI trend satırı | 0/64 | **64/64** |
| Toplu eylem taşıyan ekran | 8 | **1** (yalnız moderasyon) |
| Satır içi ölçü/renk stili | 186 | **19** (kalanı çubuk genişliği = **veri**) |
| Kusurlu ekran | 21 | **0** |

**Öteki üç kapı:**

| Betik | Sonuç |
|---|---|
| `admin-denetim.mjs` (21 ekran × 4 genişlik) | ✅ taşan **0** · konsol **0** · ölü bağlantı **0**/136 · 44px altı **0** · kaynak şeridi **21/21** · aktif kalem kusuru **0** |
| `admin-yazma-kapisi.mjs` | ✅ yazma yüzeyi yalanı **0** (21 ekran sürüldü) |
| `admin-icerik-olcum.mjs` | ✅ **altı ekranın altısı geçti** |
| `hareket-katalog-esitlik.mjs` | ✅ **EŞİT** — 25/25, alan farkı 0 |

**Yapı bütünlüğü:** 21 ekranın 21'inde başıboş `<div>` **0**; gövde kökü her
sayfada `skip-link + #fitAdminTop + main.adm-main + scriptler`.

---

## 5 · Ajanların bulduğu, lead'in kabukta düzelttiği altı kusur

Hiçbiri tahmin değil, altısı da ölçüldü. Sayfa başına yamamak 21 yama olurdu.

| # | Kusur | Ölçüm |
|---|---|---|
| 1 | **KPI trend rengi hiç görünmüyordu.** `.adm-kpi .k span` (özgüllük 0-2-1) `.kpi-delta.up`ı (0-2-0) eziyordu | `getComputedStyle` → `rgb(113,113,113)` (muted). Yalnız `flat` doğru görünüyordu, o yüzden fark edilmiyordu |
| 2 | **Süzgeç bileşeni public değerlerini şeride taşıyordu**: kendi alt boşluğu + public header'a (113px) göre ayarlı sticky | Kart kaydırılınca kutu kartın ortasında asılı kalıyordu |
| 3 | **Süzgeç açılır kutusu ekran dışına taşıyordu.** Şerit sağa yaslı, panel `left:0` | `body.scrollWidth` 1531 (91px dışarı), **13 ekranda**. Bileşen açılışta çeviriyor ama **kapalı panel de yerini tutuyor** |
| 4 | **İmza bağlantısı 38px'ti, 44 değil.** `fit-shell.css:1531`in `.sa-rail-foot a` kuralı (0-2-1) çıplak `.sa-sig`i (0-1-0) eziyor | Kök neden §6'da — kuyruğa yazıldı |
| 5 | **Daralt şeridi 26px'ti** (Gastro'nun ölçüsü), kapı 44 istiyor | Şerit 44'e açıldı, görünen tutamak x=330'da kaldı |
| 6 | **Altı form ekranı aynı satır içi kenarlığı yazıyordu** kart ayağı taklidi için | Kabuğa `.c-foot` eklendi, altısı da ona geçti |

**Ajanların iki doğru DUR'u:**

- `.role-pill` varyantlarını lead **yanlış yazmıştı** (`admin`/`askida`/`kapali`).
  Ajan 3 ölçüp durdurdu: Fit'te dört rol var (`uye` · `aday` · `antrenor` ·
  `yonetici`) ve `askida`/`kapali` **rol değil DURUM** — durumun kendi bileşeni
  var. Kabuk düzeltildi.
- `admin-destek-v1`de tablo yok, kuyruk kartı var; `.u-cell` oraya zorlanmadı.

**Bir yanlış alarm:** `admin-bildirim`in "Kanal" kolonundaki ikon bozuk sanıldı;
ölçüldü — `fa-tower-broadcast` gerçek glif, `Font Awesome 6 Free`, 15.2px.
İnce çiziliyor, kusur değil.

---

## 6 · `tasks/kuyruk.md` — açık kalemler

Kuyrukta **on kalem** var. Bu turda **iki yenisi eklendi (9 · 10)**; ötekiler
önceki turlardan taşınıyor ve bu turda kapsam dışıydı.

### Bu turda eklenenler

**9 · 🔴 Rail İKİ KEZ tanımlı.**
`assets/css/fit-shell.css` §N (satır 1473+) rail'i **zaten kurmuş** —
2026-08-29 dalgası, public operasyon paneli için (`body[data-fit-rail="1"]`),
o zaman yönetim paneli yoktu. `assets/css/fit-admin.css` §1 aynı bileşeni
yönetim kabuğu için yeniden kuruyor.

**Değerler çakışmıyor, ÖRTÜŞÜYOR** — iki bağımsız ölçüm de Gastro'dan
`--sa-rail-w:76px` ve `--rail-bg:#19160F` okumuş. Bu, ölçümün doğruluğunun
kanıtı; ama iki tanım tek bileşen için fazladır.

**Somut zarar ölçüldü:** `fit-shell.css:1531`in
`.sa-rail-foot a,.sa-rail-foot span{width:38px;height:38px}` kuralı (0-2-1)
admin'in `.sa-sig`ini (0-1-0) eziyordu → dokunma hedefi 44'ün altına
düşüyordu. `admin-icerik-olcum.mjs` yakaladı; `fit-admin.css`te özgüllük
yükseltilerek geçildi, **kök neden duruyor**.

**Yapılacak:** tek tanıma indir. Hangisinin kalacağı bir karar — rail public
operasyon panelinde de kullanılıyorsa `fit-shell.css` kalır ve admin yalnız
kendi farkını yazar. **60 public sayfayı ilgilendirdiği için R17'de
yapılmadı.**

**10 · `admin-destek-v1`de kimlik hücresi yok.**
Öteki üç operasyon ekranı `.u-cell` (38px avatar + ad/e-posta) kullanıyor;
destek kuyruk kartı (`.set-row`) tablo değil, üye adı satır açıklamasında düz
metin. Kalıbı zorlamak bileşeni yeniden kurgulamak olurdu. Kuyruk kartına
kimlik hücresi gerekiyor mu — **ürün kararı**.

### Önceki turlardan taşınanlar (1–8, bu turda dokunulmadı)

| # | Kalem | Ne bekliyor |
|---|---|---|
| 1 | **Pro Max fiyatı** — `fit-paket.js`te `fiyat:null` | Rakam. Tek satır; kart, tablo ve ödeme özeti aynı diziden bastığı için üç ekran birden güncellenir |
| 2 | **İlçe listesi** — 81 il tam, 973 ilçe serbest metin | Gerçek liste. Hafızadan üretmek yanlış veri riskiydi |
| 3 | **Hatırlatma** — su takibinde ayar gerçek, bildirim maket | Backend |
| 4 | **Kademe alanı** — `dm_user` şemasında `paket` yok | Onaylandı, savunmacı okuma kalıyor |
| 5 | **Üyelik tarihi** — hiçbir şemada kayıt tarihi yok | Veri |
| 6 | **Ölü CSS** — `fit-planim.css`teki `.fpx-kol-*` | Regex denemesi dosyayı kırdı; düzgün CSS ayrıştırıcısı gerek |
| 7 | **`.fk-*` form kiti kabukta değil** — üç sayfada tekrarlanıyor (36 · 32 · 30 geçiş) | `fit-shell.css`e taşınmalı; taşırken `docs/fit-kit.md` §7 de güncellenir |
| 8 | **`h1` semantiği** — modül sayfalarında `<h1>` sayfa adı değil kullanıcı adı | Kasıtlı; not olarak duruyor |

### R16/2 devir notunun on kalemi — bu turda ne oldu

| Eski # | Kalem | Durum |
|---|---|---|
| 1 | K6 (Fit'te abonelik) | ✅ Karara bağlanmıştı; bu turda **kalan iki yanlış metin de temizlendi** (raporların uyarı şeridi, hizmetlerin "abonelik yoktur" cümlesi) |
| 3 | **Toplu seçim 9 ekranda** | ✅ **KAPANDI** — 8 ekrandan söküldü, yalnız moderasyon kaldı (Gastro'da 47 kalemden 1'i) |
| 9 | **Liste aramasının yeri** — hepsi ya hiçbiri | ✅ **KAPANDI** — 18 ekranın 18'inde filtre şeridine, sola |
| 2 | K12 üretici eşikleri Fit'te tanımsız | ⏳ Açık — arkasında veri yok |
| 4 | Moderasyon rakamı iki dosyada | ⏳ Açık |
| 5 | **Programlar: 9 kartın 9'u yanlış sayfayı açıyor** | ⏳ Açık — ekranda `.stop` rozetiyle **görünür**, ayrıca KPI trend satırına da yansıdı |
| 6 | Hedef sözlüğü iki kez ilan edilmiş | ⏳ Açık — ürün kararı |
| 7 | Taksonomi boşluğu (ekipman 15/5, kas 10/9) | ⏳ Açık — ekranda görünür |
| 8 | SEO: 43 sayfada meta yok, 0 canonical, 16 başlık uzun | ⏳ Açık — **artık `admin-sayfalar`da canlı SEO skoru ve geçen/kalan ölçüt listesiyle okunur** |
| 10 | `hesabim-v1`de 10 ölü seçici | ⏳ Açık — admin dışı |

---

## 7 · Bu turun dersi (`docs/lessons.md` §29)

🔴 **Kit uyumu marka tutarlılığı demek değildir.**

R16/2'de her kapı yeşildi ve panel yine başka bir ürün gibi görünüyordu.
Sebep: bölümleme, ad kuralı, kaydet düğmesinin yeri ve liste kalıbı Gastro'dan
**ölçülerek** alındı ve dördü de doğru çıktı — ama **kabuğun görünümü
ölçülmedi**, "kit zaten var, tokenleri kullanırım" diye düşünüldü.

Kit kullanmak bir **kısıttır**, bir tasarım kararı değil: aynı tokenlerle
birbirine hiç benzemeyen iki kabuk yazılabilir ve yazıldı.

**Kural:** bir yüzeyi bir başkasına benzetecekseniz, benzetilecek şeyin
**ölçüsünü** alın — sözlüğünü değil. Kit "hangi değerleri kullanabilirim"i
söyler; **yapı ayrı bir sorudur ve ayrıca ölçülür.**

**Kapı olarak da eksikti.** `admin-denetim.mjs` her ekrana tek tek "kendi
içinde sağlam mı" diye soruyordu; hiçbir kapı **"yirmi bir ekran birbirine
benziyor mu"** diye sormuyordu. O soruyu artık `admin-kalip-denetim.mjs`
soruyor.

---

## 8 · Sonraki iş: panel revizeleri

**Beyar verecek.** Panel bugün 21 ekranla ayakta, görünüm Gastro'nun; revizyon
kalemleri gelince aşağıdaki iki yerden çalışılır:

- **Kabuk işi** (bütün ekranları birden ilgilendiren) → `assets/css/fit-admin.css`
  + `assets/js/fit-admin.js`. 🔴 **Yalnız lead yazar.**
- **Ekran işi** → ilgili `admin-*.html`.

Revizyondan **önce** temel ölçümü al, **sonra** karşılaştır:

```
PW_HOME=~/.pw node docs/qa/admin-kalip-denetim.mjs    # 21 ekran yan yana
PW_HOME=~/.pw node docs/qa/admin-denetim.mjs          # ekran başına 4 genişlik
PW_HOME=~/.pw node docs/qa/admin-yazma-kapisi.mjs     # yazma yüzeyi yalanı
PW_HOME=~/.pw node docs/qa/admin-icerik-olcum.mjs     # ana içerik + form sürüşü
```

### Sırada duran, kararı verilmiş tek iş: abonelik ekranları

K6 döndü (Fit'te abonelik **VAR**). Gastro'nun karşılığı beş kalem:
`Planlar` · `Creator Planları` · `Abonelikler` · `Faturalar` · `Kuponlar`.
Fit'te en az **Planlar · Abonelikler · Faturalar** gerekir; `Creator
Planları`nın karşılığı **antrenör hizmet paketi onayı**. `Hizmetler ve
Satışlar` **kalır** — abonelik platformun kendi ürünü, hizmet ise K4 gereği
üyenin üreticiden aldığı şey; ikisi ayrı akış.

Sidebar 21 → **~24 kalem**. Yeni ekran eklemek `fit-admin.js`in `MENU`
dizisine **bir satır** yazmaktır; kalıp denetimi ekranı kendiliğinden ölçmeye
başlar.

---

## 9 · Bilinmesi gerekenler

- `git add -A` / `git add .` **YASAK** — dosyalar tek tek stage edilir.
- `git commit --no-verify` **YASAK** — gitleaks + detect-private-key kurulu.
- Push `gaviaworks-dev` hesabıyla; `By4r` aktifken 403.
- **Yayın:** `.github/workflows/pages.yml`de `V1_SHA` **`d4839be`e sabit** —
  kök adres v1'de donmuş, **`/v2/` her push'ta tazeleniyor**. Bu turun push'u
  yalnız `/v2/`yi etkiler.
- Ölçüm reçetesi: `PW_HOME=~/.pw node <betik>.mjs`, oturum kipi `?auth=1`.
- Admin sayfaları `fit-shell.js`i **yüklemez** (public header/footer basmasın
  diye); yalnız `fit-shell.css`in tokenlerini ve bileşenlerini alır.
- Kabuk dosyalarına (`fit-shell.*` · `fit-admin.*`) **yalnız lead yazar**.
- **Paralel ajan uyarısı:** ajanlar tek git index paylaşır. Bu turda iki ajan
  aynı iki dosyada çakıştı (`admin-hizmetler` · `admin-log`); metinsel olarak
  temiz birleşti ama **ölçümle doğrulandığı için** güvenli oldu. Ajanlara
  commit yaptırma; lead tek elden commit'ler ve **ajanlar çalışırken commit
  atma** (pre-commit çalışan ağacı stash'liyor).

---

## 10 · Kapanış ölçümü

| | |
|---|---|
| Admin ekranı | **21** |
| Kabuk sapması (21 ekran yan yana) | **0** |
| Kalıp sapması | **0** |
| Kusurlu ekran | **0** |
| Yatay taşma | **0** (21 ekran × 4 genişlik) |
| Konsol hatası | **0** |
| Ölü bağlantı | **0** / 136 benzersiz |
| 44px altı dokunma hedefi | **0** |
| Kaynak şeridi | **21/21** |
| Yazma yüzeyi yalanı | **0** |
| Satır içi ölçü/renk stili | **19** (186'dan; kalanı veri) |
| Hareket kataloğu eşitliği | **EŞİT** (25/25, alan farkı 0) |
