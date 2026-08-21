# KARARLAR — belirsiz kalan noktalarda otonom turda verilen kararlar

Bu dosya, kaynak belgenin ya da önceki turların **net cevap vermediği** noktalarda
bu turda ne seçildiğini ve **neden** seçildiğini tutar. Kullanıcı sonradan farklı
karar verirse değiştirilecek yer burada işaretlidir.

Format: karar · seçilen · gerekçe · nerede uygulandı · geri almak için ne değişir.

---

## K1 · Odak tuzağında "gerçek görünürlüğü bekleme" yöntemi

**Belirsizlik:** devir notu iki seçenek bırakmıştı — `transitionend` dinlemek **ya da**
sınırlı kare yoklaması.

**Seçilen:** sınırlı kare yoklaması (en fazla 20 kare ≈ .33s), her karede
`checkVisibility()` (yoksa computed `visibility` + kutu ölçüsü) sınanarak.

**Gerekçe:** `transitionend` üç noktada kırılgan —
(a) `prefers-reduced-motion` ya da geçiş süresi 0 olan katmanda olay **hiç ateşlenmez**,
(b) `.fb-modal` üzerinde iki özellik birden geçiyor (`opacity` ve `visibility`), olay iki kez
ateşlenir ve hangisinin odaklanabilirliği getirdiğini ayırmak için ayrıca `propertyName`
süzmek gerekir, (c) katman başına geçiş tanımı farklı (drawer `transform`, kapı `opacity`),
tek yardımcıda hepsini kapsayamaz. Kare yoklaması geçişin biçiminden bağımsız çalışır ve
üst sınırlı olduğu için sonsuz döngü riski yok.

**Uygulandı:** `assets/js/fit-shell.js` → `trapFocus` / `focusIn`.
**Ölçüm:** `tests/a11y-focus.mjs` arka arkaya **10 koşu → 10/10**, 0 sorun.
(Düzeltmeden önce aynı süit aynı ortamda **1 sorun** veriyordu.)

**Geri almak için:** `MAX_FRAMES` sabitini değiştir ya da `focusIn` gövdesini değiştir.

---

## K2 · `rozetler-v1` rozet aileleri nereden türedi

**Belirsizlik:** kaynak belge rozetlerin **adlarını tek tek saymıyor**; §4 "İlerlemem"
listesinde yalnız "Rozetler" kalemi var.

**Seçilen:** rozet temaları **uydurulmadı**, belgenin ölçülebilir ilerleme boyutlarından
türetildi — §4 İlerlemem (haftalık hareket süresi · aktif olunan gün · kuvvet çalışılan gün ·
program tamamlama oranı · set/tekrar/ağırlık gelişimi · challenge ilerlemesi ·
kişisel kilometre taşları) + §13 (hareket çeşitliliği · dinlenme günü · günlük adım ·
kişisel gelişim).

**Gerekçe:** belge §4 açıkça "kullanıcı başkalarıyla değil, kendi başlangıç noktasıyla
karşılaştırılmalıdır" diyor; rozet bir karşılaştırma yüzeyidir, bu yüzden yalnız belgenin
saydığı kendi-ölçümü boyutlarına dayanabilir. Belge dışı bir rozet ailesi uydurmak
"kaynak spec'e sadık kal" kuralını çiğnerdi.

**Uygulandı:** `rozetler-v1.html`.

---

## K3 · `pro-odeme-v1` henüz üretilmemiş üyelik sayfasına bağlanmadı

**Belirsizlik:** belge §15 "ödeme geçmişi · faturalar · paket değiştirme · abonelik iptali"
alanlarını istiyor; bunların tam yönetim sayfası Faz 5'in `uyelik-faturalandirma-v1.html`'i.

**Seçilen:** `pro-odeme-v1` ödeme **akışı** sayfası olarak kaldı; §15 alanlarına yalnız
akışa düşen ölçüde yer verildi ve **henüz var olmayan** `uyelik-faturalandirma-v1.html`'e
link verilmedi.

**Gerekçe:** nihai kabul kriteri "yerel bağlantılarda kırık hedef bulunmamalı" diyor.
Faz 5 bittikten sonra bu bağ kurulacak — Faz 3'ün menü/footer bağlama sırasıyla aynı gerekçe.

**Geri almak için:** Faz 5 sonrası `pro-odeme-v1` içine üyelik yönetimi bağlantısı eklenir.

---

## K4 · Destek talebi sayfalarının kapsamı belge dışı, bu yüzden DAR tutuldu

**Belirsizlik:** belge §24 `destek-talepleri-v1.html` ve `destek-talebi-detay-v1.html`
dosyalarını istiyor, §5 "Destek Taleplerim" modülünü sayıyor — ama **hiçbir yerde bu
sayfaların alanlarını tanımlamıyor.** Diğer dokuz Faz 5 sayfasının hepsinin ayrıntılı
alan listesi var; bu ikisinin yok.

**Seçilen:** kapsam dar — talep listesi (durum · konu · tarih · numara) + durum süzgeci +
yeni talep formu; detayda mesajlaşma dizisi + talep kapatma. Fazlası yok.

**Gerekçe:** belge §21 eklenmeyecek modülleri sayarken "yapay zekâ sohbet asistanı"nı
açıkça yasaklıyor; destek alanı tam da o yöne kayması kolay bir yüzey. Belge susuyorsa
**en az varsayım** üreten kurgu seçildi. Zengin bir destek merkezi uydurmak, belgenin
ayrıntılı yazdığı diğer dokuz sayfayla orantısız bir modül üretirdi.

**Uygulandı:** `tools/FAZ5-SAYFA-SPEC.md`.

**Geri almak için:** kullanıcı destek akışının kapsamını söylerse spec genişletilir.

---

## K5 · Menü panelleri: BELGE kazandı, "aynı-hedefe-tek-kapı" kuralı değil

**Belirsizlik:** `REVIZE-PLAN-2.md` sonundaki 1 numaralı açık soru. Belge §2, Hareket
panelinde ilk kalem olarak "Hareket Merkezi"ni ve Antrenörler için dört kalemlik bir
panel istiyor. Önceki tur ikisini de **bilinçli olarak** kaldırmıştı: gerekçe
"başlığın kendisi zaten o hedefe gidiyor, aynı hedefe ikinci kapı açılmaz" idi ve
A4'ün referansı DadaDiet'te Diyetisyenler panelsizdi.

**Seçilen: belgeye uyuldu.** Hareket paneline "Hareket Merkezi" geri kondu,
Antrenörler dört kalemlik panel aldı, Programlar paneline "Programlar Merkezi" kondu.

**Gerekçe — üçü de ölçüme ya da belgeye dayanıyor:**

1. **Kaldırma kararı erişilebilirliği bozuyordu.** Masaüstünde başlığın üzerine
   gelince panel açılıyor; başlığa tıklamak için panelin altından geçmek gerekiyor.
   "Hareket Merkezi" paneldeki tek kalem olarak yokken merkez sayfasına menüden
   pratikte gidilemiyordu. Belge kalemi boşuna saymamış.
2. **DadaDiet referansı yanlış yere uygulanmıştı.** O ölçüm A4'te *liste sayfası
   kurgusu* için alınmıştı (banner, sol filtre kolonu, kart anatomisi); §2 menü
   yapısını ayrıca ve açıkça tanımlıyor. Bir alandaki referansı başka bir alanın
   şartını iptal etmek için kullanmak yanlıştı.
3. **Faz 5 önceki turdaki engeli kaldırdı.** Programlar paneline "Fit Testleri" ve
   "Video Seansları" ancak sayfalar üretildikten sonra bağlanabilirdi; artık varlar.

**Uygulandı:** `assets/js/fit-shell.js` → `NAV`.
**Ölçüm:** kabuktaki 107 yerel bağlantı (menü + footer + drawer + alt bar + üst bant),
48 benzersiz hedef → **kırık link 0, kırık çapa 0**.

**Geri almak için:** `NAV` içindeki ilgili `dd:[…]` kalemleri çıkarılır.

---

## K6 · Kalan 13 boş `href="#"` — ikiye ayrılıyor, hepsi kusur değil

**Belirsizlik:** belge §23 "boş bağlantı bırakma" diyor; kabukta 13 tane var.

**Seçilen:** ayrım yapıldı, yalnız gerçekten ölü olanlar kusur sayıldı.

- **Ölü DEĞİL (6):** "Programımı Bul" (menü + drawer) sihirbazı açıyor,
  "Öneri ve Şikâyet" görüş modalını açıyor. Bunlar `href="#"` + `preventDefault`
  ile çalışan gerçek eylemler. Doğru semantik `<button>` olurdu; görünüm riskine
  girmemek için bu turda markup değiştirilmedi, Faz 9'a (§20 erişilebilirlik) yazıldı.
- **Gerçekten ölü (7):** 8 sosyal medya ikonu (üst bant 3 + footer 5) ve TR/EN dil
  seçici (2). Sosyal hesap adresleri **bilinmiyor** — uydurma adres yazmak kırık
  link üretmekten kötü olurdu. Dil seçici Faz 8'in konusu.

**Gerekçe:** §23'ün amacı kullanıcıyı hiçbir yere götürmeyen bağlantıyı önlemek;
modal açan bir tetikleyici bu tanıma girmiyor. Bilinmeyen sosyal adres ise
kullanıcıdan bilgi bekleyen bir boşluk, teknik bir hata değil.

**Kullanıcıdan gereken:** DadaFit'in gerçek sosyal medya adresleri.


---

## K7 · Hareket paneli üç kaleme indi — belge §2'nin 11 kalemi yerine

**Belirsizlik:** belge §2 Hareket panelinde on bir kalem sayıyor ve "iki kolonlu
mega menü" istiyor. Faz 3'te aynen uygulandı. **Kullanıcı bunu gördükten sonra
paneli dikey ve üç kaleme indirmemizi istedi.**

**Seçilen:** kullanıcı kararı uygulandı. Panel: Hareket Merkezi · Egzersiz
Kütüphanesi · Hareket Rehberi. "Rehber konuları" ayracı ve altındaki yedi konu +
Hareket Sözlüğü panelden çıkarıldı.

**Gerekçe:** erişim kaybı olmadığı **ölçüldü** — `hareket-rehberi-v1.html`
sekiz hedefin sekizine de link veriyor, yani o kalemler zaten Hareket Rehberi
sayfasının içeriği ve menüde ikinci kez listeleniyorlardı. Kullanıcı ürünün
sahibi ve menü yoğunluğu bir tasarım tercihi; belgeyi harfiyen uygulamak
kullanıcının gördüğü sonucu beğenmemesini geçersiz kılmaz.

**Yan kazanç:** panel tek kolona indiği için `.dd-wide` kiti ve onun ≤1280px
taşma düzeltmesi tamamen kalktı (o kural yalnız 560px'lik geniş panel içindi).

**Uygulandı:** `fit-shell.js` → `NAV[0].dd` · `fit-shell.css` → `.dd-wide` silindi.
**Ölçüm:** panel 3 kalem · `display:block` · 319px · ayraç 0.

**Geri almak için:** eski 11 kalemli liste ve `wide:true` geri konur.

---

## K8 · Header'ın katı durumu tam opak yapıldı

**Belirsizlik:** header kaydırıldığında `rgba(255,255,255,.94)` + backdrop blur
oluyordu. Kullanıcı banner görselli sayfalarda bunun "ne şeffaf ne katı"
göründüğünü bildirdi.

**Seçilen:** davranış ikiliye çekildi — banner üzerinde **tam şeffaf**,
kaydırınca **tam katı** (`--paper` = `#ffffff`, alfa 1.0). Backdrop blur kaldırıldı.

**Gerekçe:** %94 opaklık arkadan koyu fotoğrafın sızmasına izin veriyor ve menü
yazıları kirli bir zemine oturuyordu. Tam opak zeminde blur'un görsel katkısı
zaten yok (§18 gereksiz iş).

**Ölçüm:** `scroll=0 → rgba(0, 0, 0, 0)` · `scroll=500 → rgb(255, 255, 255)`.

**Not:** A2'de ölçülen kardeş ürün davranışı (`rgba(255,255,255,.94)`) bilinçli
olarak terk edildi; kullanıcı kendi ürünü için net ayrım istedi.

---

## K9 · `fa-shield-check` kullanılmayacak — PRO ikonu

**Bulgu (belirsizlik değil, ölçülmüş kusur):** repo Font Awesome 6.5.2'nin
**ücretsiz** kitini yüklüyor; `fa-shield-check` PRO'ya ait ve hiç çizilmiyor
(`::before{content:none}`, genişlik 0px). 18 yerde kullanılıyordu ve "DadaFit
Onaylı" rozetini bozuk gösteriyordu.

**Seçilen:** `fa-shield-halved` (ücretsiz, ölçüldü: 16px çiziliyor).

**Kural:** yeni ikon eklerken ücretsiz kitte var mı diye ölçülmeli. Ücretsiz
olduğu doğrulananlar: `fa-circle-check` · `fa-user-check` · `fa-calendar-check` ·
`fa-clipboard-check` · `fa-square-check` · `fa-shield-halved`.


---

## K10 · Antrenörler paneli kaldırıldı — K5'in bir parçası geri alındı

**Belirsizlik:** K5'te belgeye uyularak Antrenörler'e dört kalemlik panel verilmişti.
**Kullanıcı canlıda görüp paneli istemedi**, başlığın tıklanınca doğrudan dizine
gitmesini istedi.

**Seçilen:** panelsiz düz bağlantı. (K5'in Hareket ve Programlar kısmı yürürlükte;
yalnız Antrenörler geri alındı.)

**Gerekçe:** erişim kaybı yok — alt kalemlerin dördü de dizin sayfasından
erişilebiliyor: banner'daki "Sana Uygun Antrenörü Bul" ve "Antrenör Ol" düğmeleri,
kartlardan antrenör profili, randevu ise Planım > Antrenörüm. İlginç biçimde bu,
önceki turun DadaDiet referansına dayanan kararıyla aynı yere düşüyor.

---

## K11 · Banner sayfalarında header ŞEFFAF — bütün banner sınıfları kapsandı

**Belirsizlik:** over-mode yalnız `.lib-top` ve `.fp-top`'u tanıyordu. Kullanıcı
antrenör detayı ve antrenör-ol sayfalarında header'ın koyu görselin üstünde katı
kaldığını bildirdi.

**Seçilen:** tek tek kovalamak yerine **tüm koyu banner sınıfları** over-mode'a
alındı: `.cp-top` · `.kp-top` · `.chl-hero` · `.pd-hero` · `.fs-top` · `.ol-top`.

**Gerekçe:** aynı kusurun kalan beş sınıfta da bulunması an meselesiydi; sınıf
listesi kabukta tek yerde duruyor. Her sınıfın yerleşimi ayrı ölçüldü çünkü
padding değerleri farklı (header alt kenarı + özgün padding).

**Tuzak:** bu sınıfların hepsinin **medya sorgusu dışında** duran
`padding:… !important` sıkıştırma kuralı var; over-mode padding'i `!important`
olmadan yazılırsa sessizce eziliyor ve breadcrumb header'ın altında kalıyor.
İlk denemede tam bu oldu (yazılan 146px, computed 20px).

**Ölçüm:** 7 banner × 4 genişlik = 28/28.

---

## K12 · Uyarı ve not blokları yaslanmaz

**Belirsizlik:** `fit-type.css` akan metni iki yana yaslıyor. Kullanıcı iki ayrı
ekranda "yazılar hizalı değil" diye bildirdi.

**Seçilen:** uyarı/not blokları (`.hr-note`, `.dz-vnote`, `.ntf-foot` vb.)
yaslamadan çıkarıldı, sola yaslı.

**Gerekçe (ölçüldü):** `.dz-vnote` 874px genişlikte ve **2 satır**, `.hr-note p`
561px ve **4 satır**. Yaslama son satır hariç her satırda kelime aralarını açar;
iki satırlık bir uyarıda bu, metnin yarısında görünür "nehir" demek. Akan makale
metni değil kısa uyarı metni oldukları için sola yaslı okunurluğu daha iyi.
Makale/kart gövdelerinde yaslama korunuyor.

---

## K13 · Sekme kalıbı DadaGastro'dan birebir alındı, erişilebilirlik ÜSTÜNE eklendi

**Belirsizlik:** Beyar "tab yapısı DadaGastro'yla tutarlı olacak" dedi ama hangi
DadaGastro sekmesi olduğunu söylemedi; DadaGastro'da tek bir "sekme bileşeni" yok.

**Referans DOĞRULANDI** (varsayım değil): `assets/js/fit-shell.js` içindeki
`ECO_BASE` adresinden dört sayfa indirildi ve okundu —
`anasayfa-portal-v3a.html` (HTTP 200) · `kesfet-v1.html` · `saglik-hub-v1.html` ·
`akademi-v1.html`. Üç sekme kullanımı bulundu: `.search-tabs` · `.guide-tabs/.gt` ·
`.disc-tabs/.dt`. Üçü de **aynı iskeleti** paylaşıyor:

| Boyut | DadaGastro değeri |
|---|---|
| konteyner | `display:flex; gap:4px; padding:4px; border-radius:--radius-md; background:--paper; border:1px solid --line` |
| sekme | `font-weight:700; font-size:13.5px; color:--muted; background:transparent; border:none; border-radius:--radius-sm; padding:10px 18px; gap:8px; transition:.2s --ease` |
| hover | `color:<aksan>` |
| **aktif gösterge** | **`background:<aksan>; color:#fff`** — dolu hap, alt çizgi DEĞİL |
| panel | `[hidden]{display:none}` + `animation:fadeUp .35s --ease` |
| ≤mobil | `padding:9px 14px; font-size:12.5px` |

**Seçilen:** bu iskelet DadaFit'e birebir taşındı (`.fit-tabs` / `.fit-tab` /
`.fit-pane`, `assets/css/fit-shell.css` + `assets/js/fit-shell.js`). Aksan rengi
`--fit-deep` (#007a3d) — `--fit` (#009d4f) beyaz metinle **3.54:1** ölçüldü (AA altı),
`--fit-deep` ile **5.45:1**.

**Kaynakta OLMAYIP eklenen — bilinçli sapma:** DadaGastro'nun hiçbir sekmesinde
`role="tab"` yok (dört sayfada **0 eşleşme** ölçüldü) ve klavye gezinmesi yok.
Erişilebilirlik eksiği **kopyalanmadı**: `role=tablist/tab/tabpanel`, `aria-selected`,
`aria-controls`, roving `tabindex` ve ok tuşu / Home / End gezinmesi üstüne eklendi.
Beyar'ın kendi ölçüm sözleşmesi ("ok tuşları ve Tab ile gezinme çalışıyor") zaten
bunu istiyordu. Görsel kalıp birebir, davranış daha iyi.

**Kaldırılan:** eski `.cp-tab` alt çizgi göstergesi ve sekme değişiminde
`window.scrollTo({behavior:'smooth'})` çağrısı — o çağrı sayfayı zıplatıyordu,
ölçüm sözleşmesi "içerik kapsayıcısının boundingBox.top değişmiyor" diyor.

**Uygulandı:** `antrenor-detay-v1.html`. Ölçüm (1440 ve 390): içerik kapsayıcısı
`boundingBox.top` sapması **0 px**, sekme yükseklikleri tek değer (37 / 35 px),
aktif hap etiketi kapsıyor (113.5 ≥ 77.5 px), ok/Home/End gezinmesi çalışıyor,
konsol hatası yok.

**KAPSAM NOTU:** DadaFit'te başka sekme kalıpları da var (`.pf-tabs` ×5,
`.rp-tabs`, `.fs-tabs`, `.flw-tabs`). Bu turun kapsam kilidi onların sayfalarını
kapsamadığı için **dokunulmadı**; `.fit-tabs` onların da hedef kalıbıdır.

**Geri almak için:** `assets/css/fit-shell.css` `.fit-tabs` bloğu ve
`assets/js/fit-shell.js` `[data-fit-tabs]` IIFE'si.

---

## K14 · "Örnek görünüm / Demo veri" rozeti kalktı, bilgi ŞERİTLERİ kaldı

**Belirsizlik:** Beyar "Demo veri tag'i hiçbir yerde olmasın" dedi ama aynı cümlede
"Enerji Defteri sayfasındaki *Bu sayfadaki veriler örnektir* bilgi şeridi KALSIN"
dedi. İkisi arasındaki sınırın nerede olduğu yazılı değildi.

**Seçilen sınır — ROZET gider, ŞERİT kalır:**

| Aile | Ne yapıldı | Gerekçe |
|---|---|---|
| `.demo-tag` rozeti (48 örnek, 23 dosya) | **silindi** — işaretleme, 18 CSS kuralı, kabuk JS üreticisi (`.demo-tag.fp-demo`) ve `.fp-demo` senkronu dahil | Beyar'ın doğrudan istediği şey. Rozet bilgi vermiyor, kartın üstünde gürültü yapıyordu. |
| `.fc-step` "Demo veri" çipi (4 örnek) | **silindi** | aynı aile, başka sınıf adıyla |
| `.lg-demo` "DEMO METİN — PROTOTİP" hapı (yasal-v1) | **`.fit-note` bilgi şeridine dönüştürüldü** | rozet ailesi ama içeriği §22 gereği zorunlu bir açıklama; silmek hukuki metni gerçek gibi gösterirdi |
| "Demo veri — …" ile başlayan açıklama şeritleri (12 örnek) | **ibare düştü, cümle kaldı** ("Bu prototipte gerçek bir tahsilat yapılmaz…") | şerit kullanıcıya ne olduğunu anlatıyor; Beyar'ın koruduğu şey tam olarak bu işlev |
| Kabuktaki `.fp-gate` "Bu sayfadaki veriler **örnektir**" şeridi | **KALDI** | Beyar'ın açıkça koruduğu şerit budur |

**ÖNEMLİ TESPİT — Beyar'ın tarifiyle koddaki durum uyuşmuyor:** o şerit
`enerji-defteri-v1.html`'de **yok**. Şerit kabuk JS'inde üretiliyor
(`fit-shell.js` → Fit Planım kabuğu, `.fp-gate[data-lg-only]`) ve yalnız
**Fit Planım** sayfalarında basılıyor. Enerji Defteri şu an bağımsız bir üst
menü kalemi olduğu için şeridi almıyor. Faz G1'de Enerji Defteri Fit Planım /
profil bağlamına taşınınca şeridi **kendiliğinden** alacak — yani Beyar'ın
koruduğu davranış G'den sonra gerçekten Enerji Defteri'nde olacak.

**Ölçüm:** 57 sayfa tarayıcıda açılıp DOM'dan tarandı —
`.demo-tag,.fp-demo` düğüm sayısı **0**, görünen metinde
`demo veri` / `örnek görünüm` / `demo-tag` / `örnek metrik` eşleşmesi **0**.
Kaynakta kalan tek geçiş HTML/JS **yorumu**.

**Geri almak için:** `assets/css/fit-shell.css` içindeki `.demo-tag` bloğu ve
`fit-shell.js`'teki üretici satır geri konur.

---

## K15 · Ana sayfanın tam-ekran perdesi 100dvh → 74dvh

**Çatışma:** `assets/css/fit-shell.css` içinde bir uyarı vardı —
"⚠ Sonraki oturum: bu blok bilerek konuldu, banner ölçümünde ana sayfayı ihlal
sanıp geri alma" — `body[data-fit-hero="1"] .df-top{min-height:100dvh}`.
Bu turda Beyar'ın talimatı doğrudan tersini istiyor: *"Sitenin genel perde
yapısında yukarı scroll çok fazla oluyor, bunu engelleyelim."*

**Ölçüm:** 1440×900'de perde **900px**, içindeki içerik yalnız **585px**
(hero ızgarası 446 + header payı 112 + alt nefes 28). Yani **315px boş perde**.

**İlk seçim (74dvh) GERİ ALINDI.** Perde `--hero-full:74dvh`'ye indirilmişti
(ölçüm: 900 → 666px @1440, 900 → 764px @390). **Beyar aynı turda "ana sayfa
herosunu bozmuşsun, düzelt" dedi** → değer `100dvh`'ye geri döndü.
Ölçüm: `.df-top` yüksekliği yeniden **900px** (1440×900), yani turdan önceki
hâli. Tam-ekran perde ana sayfanın imzası; "yukarı scroll çok fazla"
talimatı ana sayfa herosunu **kapsamıyormuş** — Beyar netleştirdi.

**Yürürlükteki karar:** ana sayfa herosu **100dvh**, dokunulmuyor.
D2'nin geri kalanı (37 `.lib-top` sayfası ve diğer banner sınıfları)
**yürürlükte kaldı** — orada ortalama **−53px @1440** kısalma duruyor ve
ana sayfa dışında hiçbir sayfa büyümedi.

**Yan karar — TEK ÖLÇEK:** banner yükseklikleri artık sayfa sayfa sabit sayı
değil, kabuktaki dört token: `--fit-header-h` · `--hero-pt` · `--hero-pb` ·
`--hero-gap` (+ `--hero-min`, `--hero-full`, `--sec-pad`). Over-mode
padding'leri `calc(var(--fit-header-h) + var(--hero-pt))` formülünden
türüyor — önceki 12 sabit sayı (152·142·133·131·147·153·125·129·139·73·83·93)
tek formüle indi.

**Bilinen bedel:** iki sayfanın banner'ı ölçek yüzünden **büyüdü** —
`antrenor-ol-v1` 600→602 (+2) ve `program-detay-v1` 564→570 (+6); ikisinin de
eski dolgusu ortak ölçekten daha sıkıydı. Tutarlılık uğruna kabul edildi.

**Geri almak için:** `:root` içindeki hero token'ları. Perdeyi yeniden
kısaltmak istenirse tek satır: `--hero-full`.

---

## K16 · "Programlar" ile "Tüm Programlar": tekrar silindi, ayrım korundu

**Belirsizlik:** Beyar "Programlar, tüm programlar şeklinde bunlar aynı bağlamda
gözüküyor" dedi ama hangisinin kalacağını söylemedi. Talimat iki yol bırakıyordu:
aynı hedefe gidiyorlarsa tek bağlantıya indir, farklı hedeflere gidiyorlarsa
etiketleri ayrıştır.

**ÖNCE ÖLÇÜLDÜ** (kabuk `NAV`/`BOTTOM`/`FOOTER_COLS` dizileri + tarayıcıda DOM):

| Etiket | Yer | Hedef |
|---|---|---|
| Programlar | menü başlığı | `programlar-merkezi-v1.html` |
| **Programlar Merkezi** | panel 1. kalem | **`programlar-merkezi-v1.html`** ← başlıkla AYNI |
| Tüm Programlar | panel 2. kalem | `program-liste-v1.html` ← farklı |
| Programlar | mobil alt bar | `programlar-merkezi-v1.html` |
| Programlar | footer | `programlar-merkezi-v1.html` |

Yani **iki durum birden** vardı: bir tekrar (başlık ↔ panel 1) ve bir gerçek ayrım
(panel 2). Talimatın iki şıkkı da uygulandı.

**Seçilen:**
1. Panelin "Programlar Merkezi" kalemi **silindi** — başlığın kendisi zaten oraya
   gidiyor. Bu, dosyadaki menü sözleşmesinin ("bir hedefe YALNIZ BİR kalem gider,
   paneli olan başlık da gerçek bağlantıdır") zaten yazılı olan kuralı.
2. "Tüm Programlar" **kaldı**, açıklaması netleşti: *"4 · 8 · 12 haftalık planların
   filtrelenebilir tam listesi"*.
3. Üçüncü bir çakışma **üretilmeden önce yakalandı**: E3'te banner'a eklediğim
   ikincil düğme önce sayfa içi `#tumu` çapasına gidiyordu ve etiketi yine
   "Tüm Programlar"dı — aynı etiket üçüncü bir hedefe. Düğme
   `program-liste-v1.html`'e çevrildi; sayfa içi ızgaranın başlığı da
   "Tüm programlar" → **"Programlar ve challenge'lar"** oldu.

**Ölçüm (sonrası, tarayıcıda kabuk bağlantıları):**
`programlar-merkezi-v1.html` → 4 kalem, hepsinin etiketi **"Programlar"**;
`program-liste-v1.html` → 2 kalem, hepsinin etiketi **"Tüm Programlar"**.
Aynı etiket iki hedefe, aynı hedef iki farklı etikete gitmiyor.
Site genelinde "Tüm Programlar" yazan **9 bağlantının 9'u** da
`program-liste-v1.html`'e gidiyor.

**Geri almak için:** `assets/js/fit-shell.js` → `NAV[programlar].dd`.

---

## K17 · Challenge paneli kaldırıldı, durum yalnız rozet ve filtre ekseni oldu

**Belirsizlik yoktu, talimat netti** — ama iki talimat birbirine bağlıydı ve
sırayla uygulanması gerekti: *"header'daki challenge'da dropdown'lar var, hepsi
aynı yere, tek bir buton olsun"* (F1) ve *"aktif challenge, yaklaşan challenge,
tamamlanan challenge olarak sunmana gerek yok, hepsi tek bir yerde"* (F2).

**Ölçüm (öncesi):** panelde beş kalem vardı — Challenge Merkezi (başlıkla aynı
hedef) + üç DURUM kalemi (`?durum=aktif` · `?durum=yaklasan` · `?durum=gecmis`)
+ örnek detay sayfası. Yani "aynı yere giden dropdown" iddiası **doğruydu**:
beş kalemin dördü `challenge-merkezi-v1.html`'e, biri örnek bir detaya gidiyordu.

**Seçilen:** panel tamamen kaldırıldı, başlık düz bağlantı oldu.
Durum bilgisi **iki yerde kaldı, ikisi de merkez sayfasının içinde**:
kart üzerindeki rozet (`.cm-state` → Aktif / Yaklaşan / Tamamlandı) ve
filtre çubuğunun **Durum ekseni**. Ayrı sayfa ya da ayrı menü kalemi yok.

**Ölçüm (sonrası):**
· 4 sayfada kabuk kontrolü → Challenge kalemi **panelsiz**, chevron yok,
  tek bağlantı `challenge-merkezi-v1.html`, drawer'da da tek kalem ✅
· Nav başlıklarının `tabIndex` değerleri **hepsi 0** — klavye gezinmesi bozulmadı ✅
· Eski durum adresleri **kırık bağlantı üretmiyor**: `?durum=aktif`,
  `?durum=yaklasan`, `?durum=gecmis` üçü de **HTTP 200**, aynı sayfaya düşüyor
  ve ilgili çipi işaretliyor ✅
· Parametresiz açılışta **üç durumun üçü de aynı ızgarada** (`#cmGrid`):
  aktif **1** · yaklaşan **1** · tamamlanan **1** — toplam 3 kart ✅

**Yan düzeltme (F3):** challenge detayının ekmek kırıntısında
`DadaFit › Programlar › Challenge Merkezi` yazıyordu. Challenge artık
Programlar'ın altında olmadığı için ara basamak kaldırıldı:
`DadaFit › Challenge Merkezi › <challenge adı>`.

**Geri almak için:** `assets/js/fit-shell.js` → `NAV[challenge]`.

---

## K18 · Enerji Defteri profile taşındı ve dört sayfaya bölündü

**Talimat iki parçaydı:** G1 *"Enerji defterini profile koyabilirsin"* ve
G2 *"1 page olmayacak burası, ayrı ayrı sayfalandırma olacak: Bugün, Plan ve
Takvim, Aktivite Kayıtlarım, İlerlemem, Kaydettiklerim, Antrenörüm."*

**Belirsizlik — ölçümle ortaya çıktı:** G2'de sayılan **altı ad, Enerji
Defteri'nin bölümleri DEĞİL**; birebir Fit Planım sekme rayının altı kalemi ve
o altı sayfa **zaten ayrı HTML dosyası olarak vardı** (`fit-planim-v1` ·
`fit-planim-programim-v1` · `fit-planim-gecmis-v1` · `fit-planim-ilerleme-v1` ·
`fit-planim-kaydettiklerim-v1` · `fit-planim-randevular-v1` — altısı da diskte).
Yani "ayrı sayfa yap" isteğinin o altısı için karşılığı yoktu; Enerji Defteri
ise gerçekten **tek uzun sayfaydı** (911 satır, yedi modül).

**Seçilen — iki okumayı da karşıla:**

1. **G1:** `defter` kalemi üst menüden çıktı. Erişim üç kapıya taşındı ve
   hiçbiri kırılmadı: Fit Planım sekme rayı · hesap (profil) menüsü · footer.
   Alt kalemleri de sahiplerine gitti (Aktivite Günlüğü ve Bağlı Uygulamalar
   Planım kabuğuna). **Ölçüm:** üst nav artık `Hareket · Programlar · Challenge ·
   Antrenörler`; `enerji-defteri-v1.html` **HTTP 200**, ekmek kırıntısı
   `DadaFit › Fit Planım › Enerji Defteri`.
2. **G2-a:** Fit Planım rayı B1'in ortak bileşenine geçti (`.pf-tabs/.dt` →
   `.fit-tabs/.fit-tab`, sayfa geçişi kipi). Altı sekme + Enerji Defteri = yedi.
3. **G2-b:** Enerji Defteri **dörde bölündü** — `enerji-defteri-v1` (Bugün) ·
   `-dengele-` · `-su-` · `-haftalik-`. Aralarında yine `.fit-tabs`.

**Eski adres politikası:** `#dengele` / `#su` / `#haftalik` çapaları artık bu
sayfada yok. Kırık bağlantı üretmemesi için `enerji-defteri-v1` içinde bir
köprü var: çapa sayfada yoksa yeni sayfaya `location.replace` ile geçilir.
`#yediklerim` bu sayfada DURDUĞU için yönlendirilmez.
**Ölçüm:** `#dengele → enerji-defteri-dengele-v1.html` ·
`#su → enerji-defteri-su-v1.html` · `#haftalik → enerji-defteri-haftalik-v1.html` ·
`#yediklerim → enerji-defteri-v1.html#yediklerim` (yerinde kaldı).

**Ölçüm (dört sayfa):** hepsi **HTTP 200**; alt sekme şeridi 4 kalem, aktif
kalem doğru + `aria-current="page"`; üst rayda **"Enerji Defteri"** aktif
(alt sayfalar üst kalemi işaretliyor — ilk ölçümde rayda hiçbir kalem aktif
değildi, düzeltildi); `page-check` 1440 ve 390'da **sekiz koşunun sekizi temiz**;
konsol hatası **0**; yatay taşma yok.

**Beyar'a soru (S3):** G2'nin saydığı altı ad Fit Planım rayının kalemleri;
onlar zaten ayrı sayfaydı. Enerji Defteri'ni kendi içeriğine göre dörde böldüm.
Kastettiğin bu değilse — örneğin Enerji Defteri'nin de tam o altı adı taşımasını
istiyorsan — sayfa adlarını ona göre değiştiririm.

**Geri almak için:** üç yeni dosya silinir, `fit-shell.js` → `PLAN_TABS` /
`PLAN_EXTRA` / `ACCOUNT_ITEMS` eski hâline döner.

---

## K19 · Faz A · B · D · E doğrulaması BAĞIMSIZ DEĞİL — sarı bırakıldı

**Durum:** Her fazın sonunda bir doğrulama ajanı çalıştırıldı (`dogrula-A` …
`dogrula-E`). Beşi de ölçüm script'lerini yazdı ve koştu; ham çıktılar
`scratchpad/verify-*/` altında duruyor. **Ama yalnız `dogrula-C` rapor metni
döndürdü.** Diğer dördü iki ayrı istek sonrasında da yalnız "boşta" bildirimi
gönderdi.

**Ne yapıldı:** ham çıktılarını **ana oturumda ben okudum ve yorumladım.**

**Neden bu bir sorun:** ölçen ile yorumlayan aynı taraf olunca doğrulamanın
işlevi kaybolur. Bağımsız gözün değeri tam olarak *benim göremediğimi*
görmesidir. Nitekim rapor gönderen tek ajan (`dogrula-C`) benim **temiz**
raporladığım bir noktada gerçek bir kusur buldu: 24 çipte `role="option"` ile
`aria-pressed` çakışması. Benim ölçümüm temiz çıkmıştı çünkü kabuk özniteliği
kuruluşta siliyordu ve sayfa motoru onu ancak **kullanıcı bir çipe tıkladıktan
sonra** geri koyuyordu — yani yanlış anda ölçmüştüm.

**Karar (Beyar'ın talimatı):** A · B · D · E fazları **yeşil işaretlenmedi,
sarı bırakıldı**. `REVIZE-PLAN-3.md` içindeki madde tablolarında duran ✅
işaretleri "ben ölçtüm ve geçti" anlamına gelir; "bağımsız doğrulandı"
anlamına **gelmez**. F ve G fazlarında doğrulama ajanı **hiç çalıştırılmadı**.

**Sonraki oturumun borcu:** A · B · D · E · F · G için doğrulamayı gerçekten
bağımsız koştur ve raporu **metin olarak** al. Ajan metin döndürmüyorsa, ham
çıktısını ana oturumda okuyup yeşile çevirme — sarı bırak ve bunu raporla.

**Geri almak için:** bağımsız raporlar geldiğinde plandaki ⚠ bölümü ve bu
karar güncellenir.

---

## K20 · Enerji Defteri sayfa adları kalıyor — iki küme karıştırılmayacak

**Beyar'ın kararı (18.08.2026, tur sonu).** Turun en çok karışan noktası buydu;
soru **S3** olarak açık bırakılmıştı, artık **kapandı**.

**Karar:**

1. **Enerji Defteri sayfa adları mevcut hâliyle KALIYOR** —
   **Bugün · Dengele · Su Takibi · Haftalık Özet.**
   Dosyalar: `enerji-defteri-v1.html` · `enerji-defteri-dengele-v1.html` ·
   `enerji-defteri-su-v1.html` · `enerji-defteri-haftalik-v1.html`.
2. **Fit Planım rayının altı sayfası AYRI kalmaya devam ediyor** —
   Bugün · Plan ve Takvim · Aktivite Kayıtlarım · İlerlemem · Kaydettiklerim ·
   Antrenörüm. Dosyalar: `fit-planim-v1.html` · `fit-planim-programim-v1.html` ·
   `fit-planim-gecmis-v1.html` · `fit-planim-ilerleme-v1.html` ·
   `fit-planim-kaydettiklerim-v1.html` · `fit-planim-randevular-v1.html`.
3. **İki küme birbirine KARIŞTIRILMAYACAK.**

**Neden karışıyordu:** G2 talimatı altı ad sayıyordu (*Bugün · Plan ve Takvim ·
Aktivite Kayıtlarım · İlerlemem · Kaydettiklerim · Antrenörüm*) ve bunlar
Enerji Defteri'nin bölümleri sanılabilirdi. Ölçüm aksini gösterdi: bu altı ad
**birebir Fit Planım rayının kalemleri** ve o altı sayfa **bu turdan önce zaten
ayrı dosya olarak vardı** (ölçüldü: altısı da HTTP 200). Tek uzun sayfa
**Enerji Defteri**'ydi — 911 satır, yedi modül — ve bölünen o oldu.

**Dikkat edilecek tuzak:** iki kümede de **"Bugün"** adlı bir sayfa var ama
farklı şeyler — biri **defterin** bugünü (`enerji-defteri-v1`), diğeri **planın**
bugünü (`fit-planim-v1`). Adları birleştirme, kümeleri tek rayda toplama.

**Uygulamadaki karşılığı:**
- Enerji Defteri alt şeridi: `.ed-subtabs .fit-tabs` → **4 kalem**
- Fit Planım rayı: `.pf-tabbar .fit-tabs` → **7 kalem** (altı plan sayfası +
  Enerji Defteri'nin girişi)
- Alt sayfalar rayda **üst kalemi** işaretler: `fit-shell.js` → `RAY_UST`
  eşlemesi (`defter-dengele` / `defter-su` / `defter-haftalik` → `defter`)

**Geri almak için:** bu karar değişirse `fit-shell.js` → `PLAN_TABS` /
`PLAN_EXTRA` / `RAY_UST` ve dört Enerji Defteri dosyasının adı birlikte
değişmeli; ayrıca `enerji-defteri-v1.html` içindeki eski çapa köprüsü
(`#dengele` / `#su` / `#haftalik`) güncellenmeli.

---

## K21 · Banner içeriği sabit kutuya SÜTUN-SARMALI ile sığdırıldı

**Beyar'ın talimatı (4. tur, R1):** *"Banner'lar istediğim şekilde değil, yapıyı
bozmuş, saçma bir şekilde ortalanmış… Aile içi sabit yüksekliklere (liste 344 px,
detay 384 px) DOKUNMA, onlar doğru… Ayrıca banner başlık ve açıklama alanında
boş alan verimli kullanılsın, gereksiz boşluk kalmasın."*

**Ölçülen çatışma:** liste banner'ı 344 px, üst 113 px'i şeffaf header'ın altında
→ gerçek içerik alanı **231 px**. Zengin banner'ın altı bloğu (kırıntı · eyebrow ·
başlık · açıklama · eylem satırı · istatistik) **tek kolonda en sıkı makul ölçekle
bile ~330 px** sürüyor. Yani sabit yüksekliğe dokunmadan tek kolonda sığmıyor.
3. tur bunu `overflow:hidden` ile **kırparak** "çözmüştü": 51 banner sayfasının
**28'inde** içerik kesiliyordu (`program-liste-v1` −112 px; CTA satırı ve
istatistikler tamamen görünmezdi).

**Seçilen:** banner `.wrap` sabit yükseklikte bir **sütun-sarmalı flex kutusu**
(`height:100%; flex-flow:column wrap`). Bloklar yukarıdan aşağı dizilir; sığmayan
ilk blok **kendiliğinden ikinci kolona** geçer. Kolon genişlikleri kelepçeli:
ana bloklar 660 px, açıklamadan sonrakiler 380 px (660 + 52 + 380 = 1092 ≤ 1116).

**Gerekçe — üç şartı birden karşılayan tek düzen:**
1. Sabit yükseklik **değişmedi** (liste 47/47 = 344 px · detay 3/3 = 384 px,
   yayılım 0 px) — Beyar'ın "dokunma" talimatı.
2. **Hiçbir içerik kırpılmıyor** (28 → 0). Ölçüm iki kez koşuldu, 59/59 birebir.
3. Banner 1180 px geniş ama metin ölçüsü 680 px'te kapalıydı; sağda ~440 px boş
   duruyordu. İkinci kolon tam oraya oturuyor — Beyar'ın "boş alan verimli
   kullanılsın" talimatı.

**Denenen ve BIRAKILAN yol — CSS grid.** İki sorunu var: (a) seyrek yerleşimde
imleç geri gitmediği için sağ kolon boş satırlarla başlıyordu (`dense` ile
çözüldü), (b) asıl kırılma: **satır yüksekliği iki kolonun büyüğü kadar oluyor**;
eylem satırı sarınca sol kolondaki eyebrow da 18.6 → 85.3 px'e geriliyordu
(ölçüldü: `hakkimizda-v1`). Grid'de satır paylaşımı kaçınılmaz, flex sütun
sarmalında yok.

**Eşlik eden ölçek değişiklikleri (hepsi kabukta, sayfa işaretlemesi değişmedi):**
banner `h1` **39 → 34 px** (39 px başlık 231 px'lik alanda tek başına iki-üç
satır sürüyordu) · banner içi düğme 44 → 38 px · `.lib-stats` satır aralığı
26 → 9 px · banner `row-gap` 10 → 8 px.

**Sütun-sarmalının DIŞINDA tutulan iki banner:** `reklam-ver` (`.mk-hero`) ve
`bildirimler` (`.nt-*`). İçerikleri tek büyük blok olduğu için ikinci kolona
geçince banner metni sağa kayıyor ve R1'in düzelttiği hiza bozukluğu geri
geliyordu (ölçüldü: `.mk-hero` sola **508 px**'e kaymıştı). CSS `:has()` ile
kelepçelendi; ikisi kendi dikey ritimleri sıkılarak kutuya oturdu.

**Uygulandı:** `assets/css/fit-shell.css` — banner bloğu. **0 HTML dosyası düzenlendi.**

**Geri almak için:** `@media (min-width:901px)` içindeki
`body[data-fit-hero-kind] .lib-top:has(> .wrap > .lib-sub) > .wrap` bloğu.

---

## K22 · `.cp-top` (antrenör detayı) sabit kutudan çıkarıldı — imza banner'ı

**Belirsizlik:** 3. tur kendi kuralını yazmıştı — *"içinde ikinci kart taşıyan
imza banner'ları sabit kutunun DIŞINDADIR"* — ve beş banner'ı dışarıda bırakmıştı
(`.kp-top` 614 · `.ol-top` 602 · `.chl-hero` 697 · `.pd-hero` 570 · ana sayfa
`.df-top` 900). Ama `.cp-top` tam da öyle bir banner olduğu hâlde **detay
ailesine alınmıştı.**

**Ölçüm:** `.cp-top` içinde randevu kartı var — fiyat + üç eylem düğmesi + not
(`₺450 seans başı` · Randevu Al · Danışan Ol · Mesaj Gönder + kaydet · "İlk 15 dk
tanışma görüşmesi ücretsiz"). Kart **en sıkı makul ölçekle 226 px** sürüyor;
384 px'lik kutunun verebildiği **207.6 px**'i aşıyor. Sabit kutuda kartın
**75.2 px**'i `overflow:hidden` ile kesiliyordu — yani "Mesaj Gönder" düğmesi ve
ücretsiz görüşme notu **hiç görünmüyordu**.

**Seçilen:** `.cp-top` imza banner'ı sayıldı. **Taban yükseklik 384 px korunuyor**
(`min-height`), tavan içeriğe bırakıldı → ölçülen 477.2 px, kart tam görünür.

**Gerekçe:** kutuya sığdırmanın tek yolu bir eylem düğmesini ya da ücretsiz
görüşme notunu silmekti — ikisi de içerik kaybı. 3. turun kendi kuralı zaten bu
banner'ı dışarıda tutmayı gerektiriyordu; kural doğru uygulanmamıştı.

**Aileye etkisi:** detay ailesi (sabit 384) artık **3 sayfa** —
`destek-talebi-detay-v1` · `fit-testi-detay-v1` · `video-seans-detay-v1`;
üçünün de yayılımı **0 px**. Liste ailesi **47 sayfa**, yayılım **0 px**.

**Beyar'a bildirilecek:** bu, "sabit yüksekliklere dokunma" talimatının bir
istisnası. Sabit değer (384) değişmedi; bir sayfa aileden çıkarıldı.

**Geri almak için:** `fit-shell.css` → `body[data-fit-hero-kind="detay"] .cp-top`
kuralına `height:var(--hero-h-detail)` geri konur (kart yeniden kırpılır).

---

## K23 · Banner aile sınıflandırması kapandı — 60 sayfanın 60'ı sınıflandı

**Beyar'ın talimatı (4. tur, R2):** *"Mevcut sınıflandırma 47 liste artı 4 detay
= 51 sayfa. Depoda bundan fazla sayfa var… hiçbir aileye girmeyen sayfaları ayrı
listele ve hangi aileye alınacağına karar ver."*

**Ölçüm:** 60 HTML dosyasının 60'ı tarayıcıda açıldı; banner sınıfı,
`body[data-fit-hero-kind]`, yükseklik ve `h1` okundu.

**Sonuç — dört küme, toplam 60:**

| Küme | Sayfa | Yayılım |
|---|---|---|
| LİSTE ailesi — sabit **344 px** | **47** | **0 px** |
| DETAY ailesi — sabit **384 px** | **4** | **0 px** |
| İMZA banner'ları — sabit kutu dışı | **6** | değişken (içerik belirler) |
| Koyu banner'ı olmayan | **3** | — |

**Bu turda verilen üç karar:**

1. **`egzersiz-detay-v1` DETAY ailesine alındı.** `.ed-top` diğer koyu
   banner'larla birebir aynı dili kullanıyor ama iki kuralın da dışında
   kalmıştı: (a) `fit-shell.js` over-mode listesinde yoktu → header koyu
   görselin üstünde KATI kalıyordu (K11'in beş sınıf için düzelttiği kusurun
   altıncısı), (b) sabit yükseklik kuralı yalnız `.lib-top`/`.cp-top` okuyordu
   → banner 216.3 px'te, aileden 167.7 px sapmalıydı. Sayfa `DETAY_PAGES`
   dizisinde zaten vardı; işaret basılıyor ama okunmuyordu.
   **Ölçüm sonrası:** 384 px · over-mode 1 · kırıntı top=135 > header alt kenarı
   112 · taşma 0 · `page-check` 1440 ve 390 temiz.

2. **Altı imza banner'ı sabit kutunun dışında kalıyor.** Ortak özellik: banner'ın
   içinde ikinci bir kart var (`dadafit-hub` 900 tam-ekran perde · `challenge-v1`
   697.1 sayaç · `dadafit-kopru` 613.6 geçiş kartı · `antrenor-ol` 602.2 fayda
   paneli · `program-detay` 570.4 medya kartı · `antrenor-detay` 477.2 randevu
   kartı). Sabit kutuya sığdırmak kırpmak demek — ölçüldü, bkz. K22.

3. **Üç sayfa hiçbir banner ailesine alınmıyor:**
   - `index.html` — prototip **site haritası**, ürün sayfası değil, araç sayfası.
     Kabuk banner'ı taşımıyor ve taşımamalı.
   - `giris-v1.html` — **kimlik kapısı** (`.au-top`, 1317 px). İki kolonlu tam
     sayfa giriş/kayıt düzeni; banner değil, form perdesi.
   - `profil-v1.html` — **beyaz profil kapağı** (`.pf-top`, 689.7 px). Kapak
     görseli + avatar + istatistik; koyu banner ailesiyle aynı dil değil,
     sosyal profil deseni.

**Uygulandı:** `assets/js/fit-shell.js` (over-mode listesi) +
`assets/css/fit-shell.css` (detay ailesi ve `.ed-top` yerleşimi).

**Geri almak için:** `.ed-top` her iki listeden çıkarılır; banner 216.3 px'e,
header katı hâline döner.

---

## K24 · Çip yarıçapı 12 px seçildi — kart 16 px ölçüldüğü hâlde

**Beyar'ın talimatı (4. tur, R7):** *"Seçili tag'lerdeki çiplerdeki radiuslar
fazla yuvarlak. Kartlardaki radius piksellerine kadar o şekilde tutarlı yap.
Şu an kart 12, düğme 10, rozet 6 kullanılıyor; çip bu ölçekten sapıyorsa kart
değerine çek."*

**Belirsizlik — ölçüm talimatla uyuşmadı.** Talimat "kart değerine çek" diyor
ama ölçülen kart değeri **12 değil 16 px** (`--radius-lg`; `ex-card` · `pr-card` ·
`hub-card` · `coach-card` · `ag-tile` · `fp-card` — 8 sayfada doğrulandı).
Ayrıca ikinci bir kart tipi var: tam görsel örtülü kartlar (`cc-card` ·
`ed-altcard`) **24 px** (`--radius-xl`).

**Asıl sorun:** `.ff-chip` **32 px** yüksekliğinde. 32 px'lik bir kutuda
**16 px yarıçap = tam hap** — yani "kart değerine çek" harfiyen uygulansaydı
çip 999 px'ten 16 px'e inerdi ve **görsel olarak hiçbir şey değişmezdi**,
şikâyet çözülmezdi.

**Seçilen: 12 px** (`--radius-chip: var(--radius-md)`).

**Gerekçe:**
1. Beyar'ın kendi saydığı "kart" değeri zaten 12.
2. Çipin geldiği panel seçenek çipi (`.df-fchip`) **12 px**, filtre çubuğu
   (`.ff-bar`) **12 px**, `.btn` **12 px** — çip artık kendi bileşen ailesiyle
   birebir aynı.
3. Görünür biçimde daha az yuvarlak → şikâyet gerçekten çözülüyor.

**Yan karar — ölçeğin üç basamağı token oldu** ("sayfa bazında literal bırakma"
kuralının ölçülebilmesi için): `--radius-chip` (12) · `--radius-ctl` (10, eksen
düğmesi) · `--radius-badge` (6, sayaç ve fiyat rozeti).

**Ölçüm:** depodaki `border-radius:<n>px` literali **50 → 21**; kalan 21'in
tamamı ölçek dışı mikro grafik (kaydırma çubuğu tutamağı, su bardağı ve haftalık
çubuk grafiği, kredi kartı çip çizimi, `reklam-ver`'deki minyatür sayfa maketleri).
**Ölçek içi (8·12·16·24·999 px) literal: 29 → 0.**

**Geri almak için:** tek token — `--radius-chip`. 16 px isteniyorsa
`var(--radius-lg)` yazılır (ama o değer 32 px'lik çipte hap görünür).

---

## K25 · Enerji Defteri adlandırması KESİNLEŞTİ — soru listesinden kalıcı olarak düştü

**Beyar (4. tur, R9-a):** *"Enerji Defteri: mevcut dörtlü bölünme (Bugün ·
Dengele · Su Takibi · Haftalık Özet) DOĞRUDUR ve korunacak. Fit Planım rayının
altı sayfası ayrı kalacak, iki küme birbirine karıştırılmayacak. Bu kararı
KARARLAR.md dosyasına yaz ve bir daha soru olarak açma."*

**Durum:** karar **K20**'de zaten yazılıydı; bu madde onu **kesin** hâle
getiriyor. Bundan sonra hiçbir turda "Enerji Defteri'nin sayfa adları ne
olmalı" diye **soru açılmayacak**.

- **Enerji Defteri kümesi (4 sayfa):** `enerji-defteri-v1` (Bugün) ·
  `enerji-defteri-dengele-v1` (Dengele) · `enerji-defteri-su-v1` (Su Takibi) ·
  `enerji-defteri-haftalik-v1` (Haftalık Özet)
- **Fit Planım rayı kümesi (6 sayfa):** `fit-planim-v1` (Bugün) ·
  `-programim-` (Plan ve Takvim) · `-gecmis-` (Aktivite Kayıtlarım) ·
  `-ilerleme-` (İlerlemem) · `-kaydettiklerim-` (Kaydettiklerim) ·
  `-randevular-` (Antrenörüm)
- İki kümede de "Bugün" adlı bir sayfa var ama **farklı şeyler**; adlar
  birleştirilmeyecek, kümeler tek rayda toplanmayacak.

**Bu turda yeniden ölçüldü:** Enerji Defteri alt şeridi **4 kalem**, Fit Planım
rayı **7 kalem** (altı plan sayfası + Enerji Defteri girişi), dört Enerji
Defteri sayfası da **HTTP 200**.

**Soru listesi etkisi:** eski **S3** kapalı ve bir daha açılmayacak.

---

## K26 · Sihirbaz, kardeş üründeki sihirbaz sayfasının AKIŞINA hizalandı

**Beyar (4. tur, R9-b):** *"'Programımı Bul' sihirbazı popup olmaktan çıktı;
daha önce referans verilen sihirbaz sayfalarına içerik ve akış olarak uyup
uymadığını ayrıca kontrol et, eksikse tamamla."*

**Referans DOĞRULANDI (varsayım değil):** `dadacampus-sihirbaz-v1.html`
**HTTP 200** ile indirildi ve okundu (title *"Bana Uygun Başlangıcı Bul"*,
H1 *"Nereden başlayacağını birlikte bulalım"*). Ayrıca `kesfet-v1.html`
içindeki satır içi "Mekân Bul Sihirbazı" bölümü okundu — E3'te geçtiğimiz
satır içi kip aynı kalıp, yani kip seçimi doğruymuş.

**Referans akışı beş blok. Karşılaştırma:**

| Referans bloğu | Bizde | Sonuç |
|---|---|---|
| "Sana uygun olanı nasıl bulacağız?" | giriş paragrafı | vardı |
| **"Seçimlerin"** | — | **YOKTU → eklendi** |
| "Sana göre sıralandı" | 4 sonuç kartı | vardı |
| **"Bu sıralama nasıl kuruluyor?"** | tek cümlelik `.wz-why` | **zayıftı → blok oldu** |
| "Bu sayfada" | sayfa içi gezinme | satır içi panelde karşılığı yok |

**Eklenen iki blok:**
1. **Seçimlerin** — altı yanıtın tamamı soru ↔ seçim çiftleri hâlinde; çoklu
   seçimler çip çip. Altında "Yanıtları değiştir" düğmesi ilk soruya döndürür
   (yanıtlar silinmez, kullanıcı tek tek değiştirebilir).
2. **Bu öneri nasıl kuruldu?** — hangi yanıtın neyi belirlediğini yazan dört
   maddelik şeffaflık bloğu. Risk dalında iki ayrı madde (reçete üretilmez,
   yalnız okunacak içerik). Altında sabit not: *"Sıralama kişisel veriye değil,
   verdiğin altı yanıta bakar. Hiçbir öneri teşhis ya da reçete değildir."*

**REFERANS KURALINA UYULDU:** alınan şey **akış ve blok sırası**. Renk token'ı,
tema değişkeni ve tipografi paleti **kopyalanmadı** — yeni CSS DadaFit'in kendi
token'larını kullanıyor (`--sec-pad-sm` · `--radius-chip` · `--radius-md` ·
`--fit-deep` · `--line` · `--muted`).

**Ölçüm:** satır içi kip `wz-inline` + `role="region"`, `aria-modal` yok, örtü
yok · 7 adım (6 soru + sonuç) · 4 sonuç kartı · Seçimlerin **6 satır / 6 çip** ·
Nasıl kuruldu **4 madde** · "Yanıtları değiştir" sayacı `Sonuç → 1 / 6` yapıyor ·
risk dalı ayrı sonuç veriyor · `page-check` 12/12 temiz.

**Geri almak için:** `assets/js/fit-shell.js` → `secimlerinHtml()` / `nasilHtml()`
ve `assets/css/fit-shell.css` → `.wz-sum` / `.wz-how` blokları.

---

## K27 · Doğrulama ajanı kanalı iki tur üst üste çalışmadı — yöntem değişmeli

**Beyar'ın kuralı (3. ve 4. tur):** *"Kimse kendi işini onaylamasın. Ajan rapor
metni döndürmezse fazı YEŞİL İŞARETLEME, sarı bırak ve bana bildir."*

**Ölçülen durum:**

| | 3. tur | 4. tur |
|---|---|---|
| Açılan doğrulama ajanı | 5 | **6** |
| Ölçüm üreten | 5 | **6** (135 ölçüm dosyası) |
| **Rapor METNİ döndüren** | **1** (`dogrula-C`) | **0** |

4. turda brief'e talimat **açıkça** yazıldı (*"raporunu MESAJLA gönder, dosyaya
YAZMA; ham çıktı bırakırsan raporun sayılmaz ve faz SARI kalır"*), ajanlara
**üç ayrı çağrı** yapıldı (ilk brief · durum kontrolü · "SON ÇAĞRI, başka ölçüm
yapma, elindekiyle bitir") ve **30 dakika** beklendi. Yine de altıdan sıfırı
rapor döndürdü.

**Karar — ham çıktılar OKUNMADI.** `scratchpad/verify*/` altındaki 135 dosya
yorumlanmadan bırakıldı ve altı faz da **SARI** işaretlendi. Kural harfiyen
uygulandı; "ajan zaten ölçmüş, ben okuyup yeşile çevireyim" yapılmadı — o
yapılırsa doğrulamanın tek işlevi (ölçen ≠ yorumlayan) kaybolur (bkz. K19).

**Neden bu bir yöntem sorunu, ölçüm sorunu değil:** ajanlar işi yaptı
(A 29 · D 27 · E 35 · F 20 · G 24 dosya). Kırılan şey **iletim**.

**Sonraki tur için üç seçenek — Beyar seçmeli:**

1. **Yapılandırılmış çıktı zorunlu kıl.** Ajandan serbest metin değil, önceden
   tanımlı bir şema (madde · ölçülen değer · geçti/kaldı) istenir; şema
   doldurulmadan ajan bitemez. En sağlam yol.
2. **Doğrulamayı ayrı bir OTURUMA taşı.** Ajan yerine ikinci bir Claude Code
   oturumu açılır, ölçümü o koşturur ve raporunu Beyar'a **doğrudan** verir.
   Bağımsızlık en yüksek; koordinasyon maliyeti de en yüksek.
3. **Doğrulamayı sınama süitine çevir.** Her fazın kabul ölçütü `tests/*.mjs`
   altında bir sınama olur; "bağımsız göz" yerine "kırmızıya dönebilen test"
   geçer. Bu turda süitin **sessizce kırmızı** olduğu ve gerçek gerilemeyi
   yakalayamadığı bulundu (B8) — düzeltildi, süit 5/5 temiz. Bu yol, insan
   bağımsızlığını makine tekrarlanabilirliğiyle değiştirir.

**Önerim: (3) + (1).** Kabul ölçütleri teste dönerse doğrulama her turda
kendiliğinden koşar; ajan da yalnız testin göremediği görsel/bağlam sorularına
bakar ve şemayla raporlar.

**Yürürlükteki durum:** Faz **A · B · D · E · F · G** → **SARI**.
Bağımsız raporla yeşil olan tek faz hâlâ **C** (3. turdan).

---

## K28 · Antrenör dizini ile detay haritası ayrışmıştı — beş kart yanlış profile gidiyordu

**Bulan:** `dogrula-A4` (Faz A bağımsız doğrulaması, 4. tur R10). Ana oturumun
hiçbir ölçümü bunu yakalamamıştı.

**Bulgu:** `antrenorler-v1.html` sekiz antrenör kartı gösteriyor; beşinin
`href` slug'ı **başka bir antrenöre** ait:

| Kartta yazan | Gittiği slug | Detayda açılan |
|---|---|---|
| Merve Tan | `burak-demir` | Burak Demir |
| Zeynep Arı | `ece-yalcin` | Ece Yalçın |
| Burak Demir | `mert-ozkan` | Mert Özkan |
| Elif Şahin | `deniz-kaya` | Deniz Kaya |
| Naz Erdem | `can-aydin` | Can Aydın |

**Neden hiçbir tarama görmedi:** bağlantılar **kırık değil**. Hepsi HTTP 200
dönüyor ve `antrenor-detay-v1.html` slug'ı gerçekten çözüp adı değiştiriyor
(`[data-at="ad"]`). Yani hata sessizce yutulmuyor — kullanıcı **başka birinin
profilini** görüyor. Kırık bağlantı taraması, çapa taraması, konsol taraması,
`page-check`: hiçbiri bu sınıf hatayı göremez. Görebilecek tek şey, **kartın
adı ile detayın adını karşılaştıran** bir ölçümdü; onu bağımsız ajan yazdı.

**Kök neden:** iki dosya farklı isim kümeleriyle yazılmış. Dizinde **Merve Tan ·
Zeynep Arı · Elif Şahin · Naz Erdem** var, detay haritasında yok; haritada
**Ece Yalçın · Mert Özkan · Deniz Kaya · Can Aydın** var, dizinde yok. Ortada
kalan tek ad Burak Demir ve onun kartı bile başkasına gidiyordu — yani `href`'ler
sıraya göre elle yazılmış.

**Seçilen:** dizin **kaynak** kabul edildi; eksik dört antrenör detay haritasına
eklendi ve beş `href` kendi slug'ına döndü.

**Gerekçe:** dizin sayfası Beyar'ın üç tur boyunca gördüğü ve kabul ettiği
içerik; kartların adını değiştirmek görünen ürünü değiştirmek olurdu. Ünvanlar
**uydurulmadı** — her kartın kendi görünen uzmanlık satırından alındı
(ör. "Güç & Kondisyon · Kilo Yönetimi" → "Güç, kondisyon ve kilo yönetimi").

**Yan bulgu (aynı ajan) — ölü veri:** haritada slug başına `fiyat` (₺380–₺520)
ve `unvan` vardı ama hiçbirine bağlanmamıştı. `.cta-price` markup'ta sabit
**₺450**, `.cp-spec` sabit "Güç & Kondisyon · Evde Antrenman". Yani sekiz
antrenörün sekizi de aynı fiyatı ve aynı uzmanlığı gösteriyordu. İkisi de
slug'a bağlandı.

**Ölçüm (sonrası):** 8 kart × detay turu → **ad eşleşmesi 8/8** · 8 farklı fiyat ·
8 farklı uzmanlık satırı · hepsi HTTP 200 · tam site taraması **60/60 · 6.455
bağlantı · 0 kırık**.

**DERS (kalıcı kural adayı):** "kırık bağlantı yok" ile "bağlantı doğru yere
gidiyor" aynı şey değil. Slug taşıyan her listede, **listedeki ad ile hedefteki
adın eşleştiği** ayrıca ölçülmeli.

**Geri almak için:** `antrenorler-v1.html` beş `href` + `antrenor-detay-v1.html`
`VERI` haritasındaki dört yeni kayıt ve `.cp-spec` / `.cta-price` bağlamaları.

---

## K29 · Referanstan ÖLÇÜ alınır, PALET alınmaz — 5. turda sınırın çizildiği yer

**Bağlam:** 5. tur brief'i `dadadiet.com`'u banner, kırıntı ve sihirbaz için
referans ilan ediyor ve R15.1'de *"sayı uydurulmayacak, referans canlıdan
ölçülüp birebir alınacak"* diyor — ölçülecekler listesinde `font-size` ve
`line-height` de var. Kalıcı REFERANS kuralı ise (4. tur) *"başka bir markanın
renk token'ını, tema değişkenini veya tipografi paletini KOPYALAMA"* diyor.

**Görünürdeki çelişki, çizilen sınır:**

| Alınır | Alınmaz |
|---|---|
| Bir bileşenin **boyutları**: yükseklik, iç dolgu, bloklar arası dikey boşluk, ikon kutusu, ikon–ayraç mesafesi | **Renk token'ları** ve tema değişkenleri |
| O bileşene ait **tek tek tipografi ölçüleri** (banner `h1` boyu, eyebrow harf aralığı) | **Global tipografi paleti** — gövde metni, bağlantı, buton, kart ölçekleri |
| **İskelet ve blok sırası** | Marka sesi, ikon dili, görsel varlıklar |

**İlk uygulama — R12 (kırıntı ev ikonu):**
- **Alındı:** `font-size` 13 → **9 px**, kutu 10.1 × 9, ikon–ayraç boşluğu 9 px,
  ikonun ayraçla **eşit boyutta** olması. Hepsi `dadadiet.com/beslenme` ve
  `/diyetisyen-bul` üzerinden @1440 ve @390 ölçüldü.
- **Alınmadı:** ikon rengi. Referans `rgba(255,255,255,.4)` kullanıyor; DadaFit
  `--fit-bright` yeşilinde kaldı. Üç gerekçe: (a) bu kuralın tam olarak
  yasakladığı şey, (b) bu, metni olmayan **tek** kırıntı kalemi — renk onu
  ayırt edilebilir kılıyor, (c) 13 → 9 px küçülme optik ağırlığı zaten
  referans seviyesine indiriyor (oran 0.67 → 0.46, referans 0.45).

**Referansın kendi tutarsızlığı da kayda geçti:** ev ikonu liste ve sihirbaz
sayfalarında 9 px, bir rehber detayında 13 px. İki sayfa 9 px olduğu ve Beyar
"daha minimal ve compact" dediği için 9 px alındı — referans körlemesine değil,
**gerekçeyle** izlendi.

**Geri almak için:** `assets/css/fit-shell.css` → `.crumb-home i{font-size:…}`.

---

## K30 · Banner yüksekliği referanstan ölçüldü — 344/384 atıldı, 544/560 alındı

**Beyar (5. tur, R15.1):** *"Sayı uydurulmayacak. Referans canlıdan ölçülüp
birebir alınacak."*

**Ölçüm — `dadadiet.com`, üç genişlik, iki bağımsız liste sayfası:**

| Genişlik | `/beslenme` | `/diyetisyenler` | `/beslenme-rehberi/dengeli-tabak` |
|---|---|---|---|
| 1440 | **544** | **544** | **560** |
| 1024 | **607** | **607** | **617** |
| 390 | **587** | **587** | **726** |

İki liste sayfasının her genişlikte birebir aynı çıkması, değerlerin tesadüf
değil **tasarım sabiti** olduğunu gösteriyor. Detay ölçüsü tek sayfadan
(Beyar'ın gösterdiği URL).

**Not — @390'daki 726 px:** liste ailesinin mobil büyümesi ölçülü (544 → 587,
+43), detayınki büyük (560 → 726, +166). Bu asimetri 726'nın içerik kaynaklı
olabileceğini düşündürüyor. Yine de **birebir alındı**, çünkü (a) talimat açık,
(b) fazla yüksek kutu yalnız boş alan riski taşır, **asla kırpma** üretmez.
Beyar isterse tek token'la (`--banner-h-detay` @640) kısalır.

**4. turun 344/384 değerleri atıldı.** Gerekçe ölçüm: 344'ün gerçek içerik alanı
(üst 113 px şeffaf header'ın altında) yalnız **231 px**'ti; zengin banner
~330 px sürüyordu ve 28 sayfada içerik `overflow:hidden` ile kırpılıyordu (B1).
544'te içerik alanı **370 px** — her şey tek kolonda sığıyor, sütun-sarmalı
çözüme gerek kalmıyor.

**Alınan diğer ölçüler:** `padding-top` 128 px (= 113 header + 15) · h1
42px/1.12/−.03em · blok sırası kırıntı → eyebrow → H1 → alt metin → istatistik
→ CTA · CTA sol kenarı = h1 sol kenarı. **Alınmayan:** renk token'ları
(K29'daki sınır).

---

## K31 · Ana sayfanın tam-ekran perdesi aileye ALINMADI — Beyar'a soru

**Çatışma:** 5. tur brief'i R15.3'te kalkacak imza banner'larını sayarken
`dadafit-hub` 900'ü de listeliyor. Ama `KARARLAR.md` **K15**, Beyar'ın 3. turda
verdiği doğrudan talimatı kaydediyor: perde 74dvh'ye indirilmişti, Beyar
*"ana sayfa herosunu bozmuşsun, düzelt"* dedi ve değer **100dvh**'ye geri
alındı — *"Tam-ekran perde ana sayfanın imzası"*.

**Seçilen:** ana sayfa perdesi (`.df-top`, `body[data-fit-hero="1"]`) aileye
**alınmadı**, 900 px'te kaldı. Diğer **beş** imza banner'ı aileye girdi.

**Gerekçe:**
1. Aynı değişiklik bir kez yapıldı ve Beyar **açık bir cümleyle geri aldırdı**.
   İkinci kez yapmak o talimatı yok saymak olurdu.
2. `.df-top` bir "banner" değil, sitenin **açılış perdesi** — kırıntısı yok,
   iki aileye de girmiyor, kendi tam-ekran kompozisyonu var.
3. Bedeli düşük ve görünür: aile ölçümünde tek bir üçüncü değer olarak
   raporlanıyor, saklanmıyor.

**Beyar'a soru (S-H):** ana sayfa perdesi de aileye girsin mi? "Evet" derse tek
satır: `.df-top`u `body[data-fit-hero-kind="liste"]` kuralına eklemek yeter.
K15 o durumda güncellenir.

**Ölçüm sonrası durum:** LİSTE 49 sayfa tek değer · DETAY 6 sayfa tek değer ·
üçüncü değer **yalnız 1** (`dadafit-hub` 900).

---

## K32 · S-G ve S-H cevaplandı (Beyar, 5. tur devri)

**S-G — KARAR: `antrenor-detay` ve `program-detay` tek kolona çekilecek.**
R15 sonrası bu iki sayfada `h1` sol kenarı 132 px değil (348 ve 165), çünkü
başlığın yanında portre/medya duruyor. İkisi de R15.2'nin tek kolonlu sırasına
(kırıntı → eyebrow → H1 → alt metin → istatistik → CTA) çekilecek; hedef
**56/56 sayfada h1 sol kenarı 132 px** ve **CTA hizası 21/21**. Sonraki oturumda
uygulanacak.

**S-H — KARAR: ana sayfa perdesi aileye GİRMEYECEK.**
`dadafit-hub` (`.df-top`, `body[data-fit-hero="1"]`, 900 px) banner ailelerinin
**dışında kalır** — **K15 gereği bilinçli istisna**. 3. turda perde 74dvh'ye
indirilmiş, Beyar *"ana sayfa herosunu bozmuşsun, düzelt"* demiş ve değer
100dvh'ye geri alınmıştı; tam-ekran perde ana sayfanın imzasıdır. 5. tur
brief'inin R15.3'ü onu da listeliyordu, bu karar o maddeyi **kapatıyor**.
Aile ölçümünde "üçüncü değer: 1" olarak raporlanmaya devam edecek — bu bir
kusur değil, kayda geçmiş istisnadır.

---

## K33 · Sihirbaz pop-up'tan çıkıp kendi tam sayfası oldu (R13)

**Beyar (5. tur, R13):** *"Pop-up tamamen kalksın; sihirbaz kendi tam sayfası
olsun."* Referans: `dadadiet.com/diyetisyen-bul`.

**Yapılan:** motorun tamamı kabuktan çıkarıldı ve `programini-bul-v1.html`
içine, sayfa JS'i olarak taşındı. `assets/js/fit-shell.js`'teki sihirbaz IIFE'si
(örtü katmanı + `role="dialog"` + `aria-modal` + `data-fit-wizard` tetikleyicisi
+ `wizard=1` derin bağlantısı + `FIT_SHELL.wizard` API'si) ve
`assets/css/fit-shell.css`'teki `.wz-*` ailesi **silindi**. 4. turun E3 satır
içi kipi (`programlar-merkezi`'ndeki `[data-fit-wizard-host]`) de kaldırıldı:
sihirbazın iki kopyası olamaz, tek kaynak yeni sayfadır.

**Neden E3 geri alındı:** E3, "pop-up olmasın" isteğinin ara çözümüydü — panel
modal yerine programlar merkezinin içine basılıyordu. R13 aynı isteğin nihai
biçimi: kendi sayfası. İkisini birlikte tutmak aynı motorun iki kopyası
demekti. Kapı kaybolmadı; merkezin banner düğmesi yeni sayfaya gidiyor.

**Altı soru → üç adım.** Referansın adım rayı üç kalemli (1 Hedefin ·
2 Ortam · 3 Tercih) ve alt barı "Adım 1 / 3" yazıyor; motorun altı sorusu
atılmadı, ikişerli gruplandı: Hedefin (amaç + seviye) · Ortam (mekân +
ekipman) · Tercih (süre + durum).

**Sonuç artık gerçekten hesaplanıyor.** Eskiden çıktı sabit eşlemelerdi
(süre → rutin, amaç → program). Şimdi yedi kalemlik katalog (4 program +
3 challenge, hepsi diskte var olan gerçek slug) beş eksende puanlanıp ilk üçü
gösteriliyor: hedef ağırlığı · seviye yakınlığı · mekân kesişimi · ekipman
uyumu · seans süresi yakınlığı. **Eksik ekipman eleme değil puan düşüşüdür** —
bu yüzden hiçbir yanıt bileşimi boş sonuç döndüremiyor (karşılıksız
kombinasyon 0, 15/15 amaç×seviye bileşiminde ölçüldü).

**Risk dalı korundu:** ağrı / özel sağlık durumu / gebelik / uzun süreli
hareketsizlik yanıtında **kişisel egzersiz reçetesi üretilmiyor**; uzman,
sağlık bilgilendirmesi ve okunacak rehbere yönlendiriliyor.

**Etiket birleştirildi:** "Programımı Bul" → **"Programını Bul"**. Menü kalemi,
beş sayfadaki düğme, SSS metni ve iki destek talebi metni aynı ada çekildi.
`antrenorler-v1`'deki düğme 4. turda da bu program sihirbazını açıyordu ama
etiketi "Sana Uygun Antrenörü Bul"du — hedef ile etiket bu turda doğrulandı.

**Sınama:** `tests/wizard-page.mjs` (K27 gereği taban commit `44633fb`'ye karşı
koşturuldu, kırmızıya döndü: sayfa 404 · 60 sayfada pop-up kalıntısı ·
sihirbaz sayfası yok).

---

## K34 · S-F cevaplandı — H1/H2/H3 tek menü kalemi altında: "Hareketi Anlamak"

**Beyar (6. oturum):** Spor Sözlüğü (H1), İnteraktif Anatomi (H2) ve Antrenman
Oluşturucu (H3) **ayrı menü başlığı almayacak**; üçü de tek kalemin —
**"Hareketi Anlamak"** — altına girecek.

**Sonuç:** üst menü **3 kalemde kalıyor**. 4. turda menüyü 11 kalemden 3'e
indiren **K7 korunuyor**; üç yeni modül menüyü yeniden şişirmiyor.

**Kim yazacak:** menü markup'ına (`fit-shell.js` içindeki `NAV` / `BOTTOM` /
drawer dizileri) bu kalemi **yalnız H2 oturumu** ekleyecek — K35'teki paralel
çalışma kuralı gereği. H1 ve H3, sayfaları hazır olsa bile menüye kendileri
dokunmayacak; kalem H2'nin birleşmesiyle üçünü birden açacak.

---

## K35 · H1 · H2 · H3 ayrı branch'te — kabuğa yalnız H2 dokunur

**Beyar (6. oturum):** üç modül paralel yürüyecek, her biri kendi branch'inde.

**Kural dosya bazlı**, çünkü çakışma riski tek yerde toplanıyor: paylaşılan
kabuk.

| Dosya | Kim dokunabilir |
|---|---|
| `assets/css/fit-shell.css` | **YALNIZ H2** |
| `assets/js/fit-shell.js` | **YALNIZ H2** |
| Menü markup'ı (`NAV` / `BOTTOM` / drawer dizileri) | **YALNIZ H2** |
| Kendi sayfa dosyaları (`*-v1.html`) | Her oturum kendininkine |
| `tests/*.mjs` · `tasks/*.md` | Her oturum kendi yeni dosyasına |

**H1 ve H3 kabuğa dokunmayacak.** İhtiyaçları varsa kendi **sayfa içi**
stillerini yazacaklar: `<style>` bloğu + kendi sınıf öneki. Çalışan örnek
R13'ün `pb-*` ailesi — sihirbazın tamamı kabuğa tek satır eklemeden kuruldu
(K33). Kabukta bir eksik görürlerse **kendileri düzeltmeyecek**, notu devir
dosyasına yazacak; H2 oturumu uygulayacak.

**Birleştirme sırası: H1 → H2 → H3.**
H1 kabuğa hiç dokunmadığı için en temiz birleşme; H2 kabuk değişikliğini ve
"Hareketi Anlamak" menü kalemini (K34) onun üstüne getirir; H3 en son gelir
çünkü **H2'nin SVG gövde modeline bağımlı** ve kabuk o noktada oturmuş olur.

> **Neden bu kural gerekti:** 5. turda R15 tek başına `fit-shell.css`'te
> 1843–1960 aralığını yeniden yazdı; R13 ise `fit-shell.js`'ten 344 satır
> sildi. İki oturum aynı anda kabukta çalışsaydı çakışma kaçınılmazdı — ve
> kabuk çakışması 60 sayfayı birden bozar.

---

## K36 · Push'tan önce gh aktif hesabı kontrol edilir

**Ortam kuralı (6. oturumda ölçüldü).** Makinede iki gh hesabı kayıtlı:
`By4r` ve `gaviaworks-dev`. Bu depoya **yalnız `gaviaworks-dev` yazabiliyor**.

`By4r` aktifken `git push`:
```
remote: Permission to gaviaworks-dev/dadafit-prototip.git denied to By4r.
fatal: ... The requested URL returned error: 403
```

Bu bir **depo izni ya da remote URL sorunu değil**, aktif hesap sorunu — hata
metni bunu açıkça söylemediği için yanlış yere bakılmasın. Çözüm:

```bash
gh auth status                          # aktif hesabı gör
gh auth switch --user gaviaworks-dev    # gerekiyorsa geç
git push origin main
```

R13 push'u ilk denemede bu yüzden düştü. **Aktif hesap şu an `gaviaworks-dev`.**

---

## K37 · Sözlük deseni referanstan ÖLÇÜLEREK alındı — kart değil, açılır satır

**H1, 7. oturum.** Brief `dadagastro.com/mutfak-sozlugu`'nu "terim kartı" diye
tarif ediyordu. Referans **canlıdan Playwright ile gezilip tıklanınca** desenin
kart olmadığı görüldü:

```html
<div class="term-row" role="button" tabindex="0" aria-expanded="false">
  <span class="tr-ltr">A</span>
  <span class="tr-name"><b>Adaçayı</b><span>sage</span></span>
  <span class="tr-cat">Baharat</span>
  <a class="tr-go-link" href="/mutfak-sozlugu/adacayi">…</a>
</div>
```

Satır **yerinde açılıyor** (tanım + tırnaklı örnek + iki köprü), chevron ayrı bir
`<a>` olarak tam terim sayfasına gidiyor. **İki katmanlı erişim.** 232 terimde
ızgara taranamaz hâle gelirdi; satır rayı kalır.

**Ölçülen üç sabit, birebir alındı:**

| Ölçüm | Referans | DadaFit |
|---|---|---|
| Arama süzme eşiği | 1 harf 54 · 2 harf 54 · **3 harf 13** | 1 harf 232 · 2 harf 232 · **3 harf 52** |
| Harf rayı | Tümü + **29 harf**, Q/W/X yok | aynı · tek boş harf **Ğ** (`is-empty`+`disabled`) |
| İstatistik şeridi | 3 kalem (765 Terim · A–Z · 20 Kategori) | 3 kalem, sayılar **diziden hesaplanıyor** |

**ALINMAYANLAR — gerekçeli:**

- **Sayfalama (15 sayfa, ~54 satır).** Referans 765 terimi bölüyor, bizde 232 var.
  Harf grupları + harf rayı gezinmeyi zaten karşılıyor; üstüne sayfalama koymak
  iki ayrı gezinme mantığı demekti. Ayrıca kabul ölçütü "DOM'daki satır sayısı =
  sayaç" diyor, sayfalama bu eşitliği bozardı. **Terim 400'ü aşarsa yeniden bakılır.**
- **Banner 254.1 px.** R15 aile kuralı geçerli: liste **544/607/587**.
- **"Kaynaklar" bloğu.** Referansta var (Oxford Companion to Food vb.).
  **Üretilmedi** — bu sözlüğün arkasında atıf verilebilecek bir kitap/veritabanı
  yok. Sahte kaynak yazmak "sayı/veri uydurulmaz" kuralının ihlali olurdu.

**EKLENENLER** (referansın detay sayfasından, brief'te yoktu): **Künye**
(kategori · harf · kaynak dil · İngilizce · okunuş) · **Sık aranan sorular**
(SEO, terim başına 4 ifade) · **Etiketler** (hepsi gerçek hedefe gider).

---

## K38 · Anatomi verisi PDF'ten GÖZLE okundu — kaynak sayfası her kayıtta yazılı

**H2, 7. oturum.** `Muscle.pdf`in **metin katmanı yok** — `pdftotext -layout`
0 satır döndürdü; dosya salt görüntü (sayfa başına tek 200 ppi JPEG).
Bu yüzden veri `pdftoppm` rasterleri **Read tool ile gözle okunarak** çıkarıldı.

**Kitap:** Frédéric Delavier, *Guide des mouvements de musculation*
(Hollandaca baskı, 2001). Sayfa eşlemesi: `pdf = kitap + 8`.
Gözle incelenen 20 sayfa; ana plate'ler **s. 4 (arka)** ve **s. 5 (ön)**.

**Kural:** her kas kaydı hangi plate'ten geldiğini `kaynak` alanında taşır
(ör. `kaynak: 'PDF s. 5 · 31 · 46'`). İzlenebilirlik veriye gömülü.

**PDF'in VERMEDİĞİ alan uydurulmadı.** Beş yapışma alanı (tibialis anterior ·
üç deltoid + rotator manşet · kalça fleksörü · adduktor · latissimus) plate'te
adlandırılmamış; panel metninde *"plate bu bilgiyi vermiyor"* diye **açıkça
yazılı**. Boş bırakmak da uydurmak da değil — eksiği söylemek.

**Telif:** PDF'in *verisi* kullanıldı; çizimleri, düzeni ve metni kopyalanmadı.
Dört SVG sıfırdan DadaFit çizimi (`viewBox 0 0 400 900`, `fill=currentColor`).
Erkek/kadın **ölçüyle** ayrıldı, ölçeklenmiş kopya değil: omuz:kalça oranı
**1,71 ↔ 1,39**, gövde 320 ↔ 306 px, bacak 404 ↔ 424 px.

---

## K39 · Kanonik kas slug sözlüğü — paralel çalışmanın sözleşmesi

**7. oturum, koordinatör kararı.** H1 ve H2 aynı anda, ayrı worktree'lerde
çalışıyordu ve **birbirine köprü yazacaklardı** — H1'in "İlgili kas"ı H2'nin
sayfasına, H2'nin "ekipman"ı H1'in sözlüğüne. Hiçbiri diğerinin dosyasını
göremiyordu.

**Çözüm: slug sözlüğü işe başlamadan koordinatör tarafından sabitlendi** —
27 kalem, ön 14 / arka 13. İkisine de aynı liste verildi. Kural: *H1 yalnız
bunlara köprü yazar; H2 hepsini hem SVG path'i hem panel verisi olarak karşılar,
fazlasını ekleyebilir, eksiği olamaz.*

**Sonuç (birleştirmede ölçüldü):** sözlükten çıkan **26 kas köprüsünün
26'sı** doğru kası açtı — kırık 0, yanlış kas açan 0. H2 iki ekstra ekledi
(`teres-major` · `tensor-fasya-lata`), sözleşme bozulmadı.

**Genel kural:** paralel modüller birbirine bağlanacaksa **paylaşılan anahtar
kümesi önce sabitlenir**. Sonradan hizalamak, 26 köprüyü tek tek düzeltmek demekti.

---

## K40 · Kas adlandırmasında ANATOMİ VERİSİ kanoniktir

**Birleştirmede yakalandı, 7. oturum.** İki modül aynı 27 slug'a **farklı
Türkçe ad** veriyordu — 27'nin **18'i farklı**, bazıları çelişkili:

| slug | sözlük (köprü etiketi) | anatomi (panel başlığı) |
|---|---|---|
| `tibialis-on` | Ön **bacak** kası | Ön **Baldır** Kası |
| `quadriceps` | Uyluk ön kası | Dört Başlı Uyluk Kası |
| `soleus` | Soleus | Nalımsı Kas |

Köprüye tıklayıp **başka başlıklı** bir panele düşmek kabul edilemez.

**KARAR: `assets/js/anatomi-veri.js` kanoniktir.** Gerekçe: o adlar PDF'ten
çıkarılmış anatomiye dayanıyor ve sayfa atfı taşıyor; sözlüğünkiler konum
tarifiydi. `sozluk-veri.js`'teki `kasAdlari` tablosunun 27 kalemi, panel
başlığının **parantez öncesi ana adına** hizalandı — etiket kısa kalır ama
vardığı yerle aynı şeyi söyler. Gerekçe dosyaya yorum olarak yazıldı.

**Anatomi verisi değişirse `kasAdlari` da güncellenir.**

---

## K41 · MuscleWiki bot korumalı — keşif sınırı ve "Haftalık Rutin" bulgusu

**H3, 7. oturum.** `musclewiki.com` Cloudflare korumalı. Ölçülen davranış:

| Yöntem | Sonuç |
|---|---|
| Headless chromium | ilk istek geçer, ardındakiler **403** |
| Gerçek Chrome, headed, kalıcı profil | ilk tur **geçti** |
| Tarayıcıyı kapatıp yeniden fırlatmak | **403** |
| SPA içi tıklamayla adım geçişi | **her seferinde 403** (3 deneme) |
| **Oturum başına tek istek + ~3,5 dk bekleme** | **çalıştı** — 6/6 adım alındı |

Toplam **13 blok**, ~**45 dk** kasıtlı bekleme, ~30 istek.

**SINIR — aşılmadı:** proxy/IP rotasyonu, UA rotasyonu, captcha çözme
**denenmedi**. Site "yeter" dediğinde geri çekilindi. **Kısmi keşif,
uydurulmuş keşiften iyidir** — belge neyin kanıtlandığını `[EKRAN]` /
`[ROUTE]` / `[KAYNAK]` etiketleriyle ayırıyor, erişilemeyeni "ERİŞİLEMEDİ"
diye işaretliyor.

**Dürüst bilanço:** kesintisiz tam tur **0/9**. Elde edilen adım **envanteri**,
tur kaydı değil. Sonuç ekranına hiç erişilemedi → **determinizm ölçülemedi**.

### AS-1 — sonraki oturumun ilk işi

`/tr-tr/generator` **iki kol** sunuyor:

| | Tekli Antrenman | **Haftalık Rutin** |
|---|---|---|
| Etiket | hızlı ve odaklı | tam program · **★ önerilen** |
| İçerik | bugünlük tek antrenman | **haftada 3-6 gün · dengeli kapsam · artan yüklenme** |
| Keşif | ✅ 6 adım çıkarıldı | 🔴 **hiç keşfedilmedi** |

Gezilen sihirbaz **hızlı kol**. Brief'in H3 için istediği her şey — gün gün
liste, 3 gün full body / 5–6 gün push-pull-legs, artan yüklenme — **ikinci
kolda**. **H3 kodu başlamadan o kol keşfedilmeli;** kalan 8 tur değil, öncelik bu.

**AS-2 kapandı:** DadaFit'in oluşturucusu **deterministik** olacak — `?plan=`
paylaşılabilirliği bunu gerektiriyor ve R13'ün puanlama motoru da deterministik.

---

## K42 · Sözlük KAPALI olmalı — kendi metninde geçen terim tanımlı olacak

**7. oturum, Beyar'ın tespiti.** Sözlük kendi içinde kapalı değildi: tanım
metinlerinde kullanılan terimlerin bir kısmının kaydı yoktu.

**Ölçüm (232 kaydın 481 metin parçası, iki geçişli tarama):**

| Terim | Metinde geçiş / kayıt | Durum |
|---|---|---|
| **Kuvvet** | **31 / 24** | tanımsızdı |
| **Güç** | **26 / 24** | tanımsızdı |
| Çömelme | 13 / 13 | tanımsızdı |
| Omurga | 10 / 6 | tanımsızdı |
| Ölü kaldırış | 6 / 5 | tanımsızdı |
| Burpee · Mekik · Aktivasyon | 0 / 0 | alanın temel kalemi, hiç yoktu |

43 aday → **22 eklendi, 21 gerekçeli elendi**. Toplam **232 → 254**.
Yeni kategori açılmadı; hepsi hâlâ ≥8.

**KURAL — katalog çakışması.** Kütüphanede kartı olan bir hareket sözlüğe
girerse: tanım **kısa** kalır (≤250 karakter, sınır ölçümle seçildi), **nasıl
yapılır anlatılmaz**, ve `hareket` alanı o kartın **gerçek slug'ına** köprü
kurar. 11 kalem bu kurala uyuyor; mevcut **"Şınav" kaydı da geriye dönük
çekildi** (287 → 211 karakter). Kütüphanede kartı **olmayanlarda** (ölü
kaldırış · barfiks · bench press · burpee · mekik) `hareket` alanı **boş** —
uydurma slug yazılmadı.

**Eleme ölçütü:** *bir okuyucu bu ifadeyi görüp "bu ne demek?" diye sorabilir
mi?* "eklem" (29 geçiş) elendi — genel Türkçe. "germe" elendi — çatı sözcük,
dinamik/statik/PNF germe zaten ayrı ayrı tanımlı. Spor **adları** (boks,
güreş, judo) elendi: sözlük o sporun **terimlerini** tanımlıyor. İstisna
**"Karma dövüş sanatları"** — Türkçede kısaltmasıyla (MMA) anılıyor, okuyucu
iki adı bağdaştırmayabilir. Asimetri bilinçli, sınamada gerekçesiyle yazılı.

**`tests/sozluk-kapalilik.mjs` nöbetçi oldu.** KONTROL (22) ve ELENEN (21)
tabloları betiğe gömülü; her kalemde geçiş sayısı ve gerekçe yazılı, böylece
sonraki oturum **neyin bilerek dışarıda olduğunu** görüyor. Veriyi diskten
değil **BASE üzerinden HTTP ile** çekiyor — K27'nin taban koşusunda gerçekten
o sürümün verisi ölçülsün diye.

---

## K43 · Hareket adlarında KÜTÜPHANE kanonik — K40'ın ilkesi hareketlere de

**7. oturum, birleştirmede yakalandı.** Aynı slug iki modülde farklı adla
anılıyordu: `bant-cekme` kütüphanede **"Bant Çekme (Band Row)"**, anatomide
**"Bant ile Çekme"**; `bant-yana-acma` benzer.

**KARAR: `egzersiz-kutuphane-v1.html`'in kart `data-name` değerleri
kanoniktir.** Gerekçe: kart kataloğu 12 hareketin **hepsini** kapsar ve
kullanıcının gezdiği yer orasıdır. K40'ın kas adları için kurduğu ilkenin
aynısı — **köprü etiketi vardığı yerle aynı şeyi söylemeli**.

`anatomi-veri.js` kütüphaneye çekildi. H3'ün `KURALLAR.havuz` adları zaten
kütüphaneden alınmıştı; `tests/workout-generator.mjs` **16. sınaması** bunu
kalıcı nöbete bağladı — kütüphanede ad değişirse süit kırmızıya döner.

**BU TURDAN DEĞİL, AÇIK KALAN İKİ ÇELİŞKİ:**
1. `goblet-squat` kütüphane kartında **"Squat (Çömelme)"**, `egzersiz-detay-v1`
   VERI'sinde **"Goblet Squat"**; ekipmanı kütüphanede **"Ekipmansız"**,
   detayda **"Dambıl / Kettlebell"**. H3 kütüphaneyi kanonik aldı — aksi hâlde
   ekipmansız havuz 6'dan 5'e düşer ve tek gerçek squat kalıbı kaybolurdu.
2. `egzersiz-detay-v1`'in VERI tablosunda 12 slug'ın **yalnız 8'i** var;
   `bant-cekme` · `bant-yana-acma` · `dambil-biceps` · `dambil-omuz-press`
   sayfaya gidince **`goblet-squat`'a düşüyor**. HTTP 200 döndüğü için
   sınamalar geçiyor — **ölçüt geçiyor, deneyim geçmiyor.**

---

## K44 · H3 motoru — kural VERİ, kod onu yorumluyor

**7. oturum.** Brief'in şartı: *"Kural tablosu `tasks/H3-KURALLAR.md`'ye
yazılacak; **kod bu tablodan okuyacak**, dağınık `if` bloklarına
gömülmeyecek."*

**Uygulama:** belgedeki `js` bloğu ile sayfadaki `==KURALLAR-BASLANGIC==` …
`==BITIS==` arası **8244 karakter, karakter karakter aynı**. Sınamanın 14.
maddesi bunu karşılaştırıyor — ayrışırlarsa süit kırmızıya döner. Seçenek
listeleri de tablodan türetiliyor; elle yazılmış ikinci liste yok.

**Karşılıksız kombinasyon 0 MİMARİDEN geliyor:** `gerek:[]` olan **6 hareket**
hiçbir seçimde düşmez, havuz asla 6'nın altına inmez. Sonradan eklenen yedek
liste **yok**. Ekipman motorun **tek sert süzgeci** (ölçüt "ekipmansızda dambıl
çıkmasın" bunu gerektiriyor); hedef · seviye · odak · kas dengesi **puan
düşüşü** — R13'ün deseni.

**DETERMİNİSTİK** (K41/AS-2): `Math.random` yok, aynı seçim → aynı plan.

### 12 hareket ↔ "aynı hareket iki güne düşmesin" — çelişki ikiye bölündü

Brief bunu istiyor ama havuz **12 kalem**; 6 günlük bölünmede matematiksel
olarak mümkün değil. **Sessizce geçilmedi:**

1. **Aynı hareket aynı GÜN içinde tekrarlanmaz** — mutlak, mimariden.
2. **Günler arası tekrar kaçınılmaz; cezalandırılır, yasaklanmaz** —
   `tekrarCeza × önceki kullanım`. Motor önce hiç kullanılmamışı dağıtır.

Üç yerde yazılı: kural tablosu · kod · **arayüzdeki gün gerekçesi**.
Kütüphane **≥24 harekete** çıkarsa `tekrarCeza` 9 → 999 ile ceza fiilen
yasağa döner — **tek satır**, mimari değişmez. Kuralın veri olmasının kazancı.

**Gün başına hareket havuza göre ölçekleniyor**; üçüncü tavan **ölçümle**
eklendi: onsuz 12 kalemlik havuzda "İtiş Günü"ne çekiş hareketleri
dolduruluyordu.

**Set/tekrar/dinlenme 9 hücre, dokuzu farklı — DadaFit EDİTORYAL.** Belgede
`🔴 MuscleWiki'den ALINMADI` diye yazılı: keşif sonuç ekranına hiç erişemedi,
o değerler elde yok (AS-3). **Alınmış gibi gösterilmedi.**

**Bilinen sınır — gizlenmedi:** ekipmansız havuzda **çekiş hareketi yok**
(kütüphanedeki dört çekiş hareketinin dördü de dambıl/bant istiyor). Sonuç
ekranında bildirim şeridi ve gün gerekçesinde `⚠` satırı bunu söylüyor.
Ekipmansız bir çekiş hareketi eklenince kendiliğinden düzelir.

---

## K45 · MuscleWiki bloğu KALICI hâle geldi — keşif burada duruyor

**7. oturum, tamamlayıcı tur.** Site **kalıcı Cloudflare WAF bloğuna** geçti.

| # | İstek | Sonuç |
|---|---|---|
| — | ilk fırlatma, ana sayfa | ✅ **200** — tam render, ekran görüntüsü alındı |
| 1–5 | tarayıcı yeniden fırlatıldıktan sonra 5 istek | 🚫 **403** |

**Toplam 49,5 dk kasıtlı bekleme** (10,5 + 15 + 20 + 4) — blok **kalkmadı**.
Blok tipi *"Attention Required! | Cloudflare"* / *"Sorry, you have been
blocked"* — **JS meydan okuması değil, WAF kuralı**; beklemekle geçmiyor.
6. oturumun *"yeniden fırlatma → 403"* ölçümü bağımsız doğrulandı, üstüne
**bu kez hız tabanlı değil, kalıcı** eklendi.

**Denenmeyenler (bilerek):** proxy/IP rotasyonu · UA rotasyonu · istek
hızlandırma · captcha · stealth yükseltmesi. **Koruma aşılmaya çalışılmadı.**

**Tur A ve Tur B ekranda ÖLÇÜLEMEDİ** ve belgeye öyle yazıldı. Ama siteye
**hiç yeni istek atmadan**, önceki oturumun indirdiği dosyalar yeniden
okunarak AS-1'in iskeleti çıkarıldı (§11.5) — route, tam durum şeması,
4 adım etiketi, doğrulama kuralları, `days_of_week` **dizi** bulgusu,
`equipment_mode` ev/vücut ağırlığı ekseni.

> **Ders:** blok keşfi bitirir ama **elde olan kaynağı** bitirmez. Ekranda
> ölçülemeyen şeyin bir kısmı, zaten indirilmiş kaynaktan `[KAYNAK]`
> etiketiyle çıkarılabilir — yeter ki hangi etikete ait olduğu dürüstçe
> ayrılsın.

---

## K46 · Anatomi haritası İKİ KATMANA ayrıldı — render görünür, vektör tıklar

**Bağlam:** R6 madde 21. Beyar'ın ilk onayı "Yön 3" idi (Higgsfield yalnız
çizim şablonu, siteye yalnız SVG girer). İlk trace onaylandıktan sonra yön
değişti: **render görünen katman olacak**, soyut SVG ovalleri görünmeyecek.
Referans `musclewiki.com/tr-tr`: gövde nötr, seçilen kas solid renkle dolar
ve dolgu gerçek kas konturunu izler.

**KARAR — `assets/svg/govde-*.svg` iki katman taşır:**

| Katman | Ne | Davranış |
|---|---|---|
| `<image class="an-govde">` | `assets/img/anatomi/govde-*.png` — Higgsfield render'ı | **Boyanmaz.** Nötr kalır, seçimden etkilenmez |
| `<path class="an-bolge">` | segmentlenmiş kas konturu | Dolgu **varsayılan saydam**. Hover hafif vurgu · seçili solid `fit-deep` |

**Sonuç:** seçilmemiş kasın üstünde hiç boya yok; seçili kas gerçek konturunu
izleyerek doluyor. Eski `.an-siluet` / `.an-cizgi` düğümleri ve CSS'i kalktı.

**Neden raster tek başına yetmiyordu (Beyar'a ölçümle anlatıldı):** raster
PNG'de kas parçası tıklanamaz ve seçili kas boyanamaz. "Üstteki kas
gruplarıyla etkileşimli" şartı hangi yol seçilirse seçilsin bir **vektör
bölge katmanı** gerektiriyor. Fark, o katmanın ALTINDA ne olduğu.

**Geri dönüş:** `an-bolge` dolgusunu `currentColor` yapıp `<image>`'ı
kaldırmak eski davranışa döner; üreteç depoda duruyor.

---

## K47 · Dört render ORTAK TUVALE normalize edildi — ölçek referansı gövde boyu

**Sorun (Beyar ölçtü):** dört render farklı orandaydı — erkek-ön 2.011 ·
erkek-arka 1.916 · kadın-ön 2.279 · kadın-arka 2.163. Bu hâliyle ön/arka ve
kadın/erkek geçişinde gövde **zıplıyordu**.

**KARAR:** dördü tek viewBox'a (`0 0 758 1380`) oturtuldu. Ölçek referansı
**gövde yüksekliği** (baş tepesi → topuk = **1300 px**); genişlik
**zorlanmadı** — omuz genişliği figürler arasında doğal olarak farklıdır.

**Normalize sonrası nirengi kayması (ölçüldü, 1300 px gövdede):**

| Nirengi | Değerler | Yayılım |
|---|---|---|
| omuz | 269 · 263 · 279 · 271 | **16 px** (%1.23) |
| kalça | 737 · 751 · 730 · 743 | **21 px** (%1.62) |
| kasık | 816 · 817 · 812 · 806 | **11 px** (%0.85) |
| diz | 1178 · 1175 · 1175 · 1177 | **3 px** (%0.23) |

> **Koltuk altı yayılımı 138 px ve bu bir kusur DEĞİL:** erkek-ön render'ında
> kollar gövdeden daha açık duruyor. Poz farkı, ölçek hatası değil.

**Nirengi tanımı sağlamlaştırıldı:** ilk ölçümde omuz 350 px sapmış
görünüyordu; sebep tespit yöntemiydi (koltuk altını başın içinde buluyordu).
Omuz artık "silüet genişliğinin ilk kez en geniş hâlin %50'sini aştığı satır".

---

## K48 · Kas path'leri ELLE ÇİZİLMEDİ — render'dan segmentlendi

**KARAR:** kontur elle trace edilmedi. Render düz renkli plakalardan
oluştuğu için görüntü segmentlendi: kontur çizgileri sınır kabul edilip
`connectedComponents` ile plakalar etiketlendi, `findContours` ile sınır
çıkarıldı, `approxPolyDP` ile 1.1 px toleransla sadeleştirildi.

**Neden:** path render'ın **kendisinden** türüyor — hizasızlık matematiksel
olarak mümkün değil. Elle trace'te kaçınılmaz olan kayma riski ortadan kalkıyor.

**Segmentasyonun verdiği çözünürlük:** erkek-ön 48 · erkek-arka 45 ·
kadın-ön 46 · kadın-arka 39 anlamlı plaka. Sol/sağ ayrı bileşen çıkıyor ve
alanları birebir eşleşiyor — segmentasyonun temiz olduğunun kanıtı.

**Plaka → slug eşleştirmesi ELLE yapıldı.** Önce kadın için geometrik aktarım
denendi (erkek maskesiyle en çok örtüşen bileşen); **yetmedi** ve bırakıldı:
kadın render'ında bazı plakalar birleşik geliyor. Ölçülen örnek —
`kadin-arka` bileşen **22**, alan 38545, bbox y390..922: sağ lat ile sağ
kalçayı tek parça yapmış, örtüşme kuralı hepsini `gluteus-maximus`'a atıyor
ve **yeşil sırtın yarısını kaplıyordu**. Dört görünümün dördü de etiketli
haritadan okunarak elle eşlendi; birleşik plakalar x/y aralığıyla kesildi.

**Boyama sırası alandan büyükten küçüğe.** SVG'de sonraki path üste biner;
ince kaslar en sonda kalırsa büyük komşusunun altında kaybolmaz.

**Üreteç depoda:** `tasks/anatomi-uretim/bolgeler.py` + `svg-yaz.py`.
Render değişirse yeniden koşturulur, elle düzeltme gerekmez.

---

## K49 · Bir kas İKİ GÖRÜNÜMDE birden bölge taşıyabilir — kural taşındı

**Eski kural (`tests/anatomi.mjs`):** *"bölgenin `gorunum`'u bulunduğu
görünümle aynı olmalı"*. Bu kural her slug'ın tek görünümde bulunduğu soyut
haritaya göre yazılmıştı.

**Sorun:** render'dan segmentlenen harita **gerçek anatomiyi** izliyor.
Gastrocnemius hem önden hem arkadan görünür; trapez hem arkadan hem omuz
üstünden. Eski kural bunları "yanlış görünümde" diye kırmızıya döndürüyordu.

**KARAR — kural zayıflatılmadı, doğru yere taşındı:**
1. Her bölgenin veri kaydı **olmak zorunda** (karşılıksız bölge 0)
2. Her kas **kendi birincil görünümünde** bulunmak zorunda (karşılıksız kayıt 0)
3. **İkincil görünüm serbest** — ama ikincilde varsa birincilde de olacak

`gorunum` alanı artık "kasın birincil görünümü" demek; `?kas=` derin
bağlantısı ve panel bu alanı okumaya devam ediyor. **16 ön · 15 arka = 31.**

---

## K50 · Sağlık-güvenlik şeridi kalktı, TERCİHLER kaybolmadı

**R6 madde 1·2·3 tek değişikliktir.** Sayfa altındaki "Sağlık ve güvenlik"
bloğu sayfa markup'ında değildi — `fit-shell.js`'teki bir IIFE onu 60 sayfaya
basıyordu. IIFE (99 satır) ve `.fh-*` CSS ailesi (21 kural) silindi.

**Kaybolmayanlar:**
- **Yasal bant dokunulmadı** — `saglik-bilgilendirme-v1.html` bağlantısı 66/66
  sayfada duruyor. Uyarı siteden kaybolmadı, section olarak basılmıyor.
- **Üç tercih** (`#fhSound` · `#fhVibe` · `#fhMotion`) `fit-planim-veri-izin`e
  taşındı. `dm_fit_sound` / `dm_fit_vibe` / `dm_fit_motion` anahtarları
  **aynı** — kayıtlı tercih kaybolmadı. `FIT_SHELL.pref` API'si korundu.

**Sınama nöbeti TAŞINDI, zayıflatılmadı:** `footer-curtain` ve `footer-yapi`
artık `.fit-health` **0 olmalı** diye nöbet tutuyor; `footer-yapi`'ye
"yasal bantta sağlık bağlantısı ≥1" ölçütü **eklendi**.

---

## K51 · Ajan ekran görüntüleri depoya GİRMİYOR

R6'da altı ajan **278 ekran görüntüsü** üretti, toplam **139 MB**. Statik bir
prototip deposu ve GitHub Pages için taşınamaz. `.gitignore`'a `tasks/r6-shots/`
eklendi. **Raporlar (`tasks/r6-ilerleme/*.md`) depoya giriyor** — kalıcı kayıt
onlar; görüntüler turun kendi oturumunda diskte duruyor.

---

## K52 · R11 perdesinin @390'da KAPALI olması kasıtlı — "kaçmış" değil

**Beyar (9. oturum, R7 madde 9):** *"R11 perdesinin @390'da kapalı olması
kasıtlı — tek satır not düş, sonraki turda 'kaçmış' sanılmasın."*

**Kayda geçen davranış:** perde (footer reveal) yalnız **≥641 px**'te açılır.
`fit-shell.js` `matchMedia('(min-width:641px)')` ile ayırıyor, `fit-shell.css`
aynı eşikte `.footer.orange{position:fixed}` veriyor ve CSS yorumu bunu
zaten yazıyor: *"Mobil: statik."*

**Ölçüldü (dadafit-hub, R7):**

| Genişlik | `#pageMain` margin-bottom | footer position | footer yüksekliği |
|---|---|---|---|
| 1440 | 579.53 px | fixed | 579.53 |
| 1024 | 1100.69 px | fixed | 1100.69 |
| **641** | 1158.45 px | fixed | 1158.45 |
| **640** | **0** | **static** | 1229.75 |
| 390 | **0** | **static** | 1281.83 |

641 ↔ 640 sınırı temiz: perde tam eşikte açılıp kapanıyor, ara değer yok.

**Neden mobilde kapalı:** perde, footer'ı sayfanın ARKASINDA sabit tutup
içeriğin altına kendi yüksekliği kadar boşluk açmakla çalışıyor. @390'da
footer 1281.83 px — ekranın (844) bir buçuk katı. Sabitlenirse ekrana
sığmaz, açılan boşluk da bir buçuk ekranlık boş kaydırma olurdu.

**`tools/site-tarama.mjs` bunu neden kırmızıya döndürmüyor:** perde sapması
ölçümü zaten `if (w === 1440)` koşuluyla yalnız masaüstünde koşuyor.
Araç doğru yazılmış; @390'da ölçüm hiç yapılmıyor.

**Geri almak için:** `fit-shell.js` FOOTER REVEAL IIFE'sindeki eşik ve
`fit-shell.css`'teki `@media (min-width:641px)` bloğu — ikisi birlikte.

---

## K53 · Anatomi dokunma hedefi OLDUĞU GİBİ kalıyor — çip + klavye telafisi yeterli

**Beyar (9. oturum, R7 madde 8):** *"Adduktor geometrik olarak 44px'e
çıkamaz, çip + klavye telafisi yeterli. Olduğu gibi kalsın, kayda geç."*

**Kapanan soru:** DEVIR-6 §2d'nin "bilinen sınır" başlığı bir sonraki tura
açık kalem olarak devrediyordu. Beyar kapattı: **madde açık kalem değil,
kabul edilmiş sınır.**

**Kabul edilen tablo (R6'da ölçüldü, R7'de yeniden ölçülmedi):**
@390'da 61, @1440'ta 54 bölgenin serbest çapı 24 px altında; en küçükleri
`adduktor` · `boyun` · `tensor-fasya-lata` · `brachioradialis` (0–4 px).

**Gerekçe — iki garanti aynı anda tutulamaz:** adduktor gerçek anatomide
ince bir şerit. 44 px'e büyütmek komşu kasın üstüne taşmak demek; o zaman
"yanlış kas seçilen tıklama 0" garantisi düşer. Harita **ikincil ve hassas**
giriş olarak konumlandı.

**Telafi, ölçülmüş hâliyle duruyor:** her kasın ≥44 px erişilebilir yolu var
— haritanın üstündeki kas grubu çipleri (@390 44 px) ve klavye gezinmesi.
Harita @390'da `min(52vh,470px)`'e büyütülmüş hâliyle kalıyor.

**Sınama nöbeti aynen:** `tests/anatomi.mjs` "her bölge tıklanabilir +
yanlış kas 0" nöbetini iki genişlikte tutmaya devam ediyor; çap ölçümü
rapora yazılır ama **kırmızıya döndürmez**.

**Bu kararı bozacak tek şey:** haritanın birincil giriş hâline gelmesi
(çiplerin kaldırılması). O gün "kasa yakınlaştırma" seçeneği yeniden
masaya gelir — ölçülmedi, önerilmiyor, not olarak duruyor.

---

## K54 · `--tomato` ailesi gerçek adını aldı — AD değişti, DEĞER değişmedi

**R7 madde 3.** Token `--tomato` **#009d4f** yani kurumsal YEŞİL taşıyordu.
Ad gastro paletinden kalmıştı; `fit-shell.css` başlığı bunu itiraf ediyordu
bile: *"ad tarihseldir; sitenin diğer dosyalarında aynı ad domates
kırmızısını gösterir."* Aynı depoda aynı adın iki farklı rengi göstermesi
sonraki her turda yanlış okuma riski.

**Kritik bulgu — ikizi zaten vardı.** `fit-shell.css`'te `--fit:#009d4f` ve
`--fit-deep:#007a3d` **aynı değerlerle** ayrı bir `:root` bloğunda duruyordu.
Yani `--tomato` yeni bir renk değil, var olan yeşilin ikinci adıydı.

| Eski | Değer | Yeni | Nasıl |
|---|---|---|---|
| `--tomato` | #009d4f | **`--fit`** | ikizi vardı → **birleşti** |
| `--tomato-dark` | #007a3d | **`--fit-deep`** | ikizi vardı → **birleşti** |
| `--tomato-deep` | #006a35 | **`--fit-ink`** | ikizi yoktu → ramp'e adım |
| `--tomato-tint` | #e8f6ee | **`--fit-wash`** | ikizi yoktu → ramp'e adım |

`--fit-ink` adı işine göre verildi: 6 kullanımının 3'ü zorunlu-alan yıldızı
(beyazla **6.75:1**, küçük metinde AA — `iletisim-v1`'de ölçülmüştü), 3'ü
gradient koyu ucu. `--fit-deep` (5.45:1) ile `--fit-deeper` (8.76:1)
arasında gerçek bir basamak.

**Kapsam:** 672 geçiş · 47 dosya (`fit-shell.css` · `fit-shell.js` ·
45 sayfa). Üstteki `:root`ta duran kopya tanımlar silindi; yeşil ailesinin
tanımı artık **tek blokta**.

**KANIT — hiçbir renk değişmedi:** 66 sayfa @1440 açıldı, her elemanın
çözülmüş `color · background-color · background-image · border · outline ·
fill · stroke · box-shadow` imzası önce/sonra karşılaştırıldı.
**66/66 sayfa birebir aynı.** (Tek fark `challenge-v1`'de `livePulse`
animasyonunun 1.9 sn'lik döngüsünden farklı kare yakalanmasıydı — token
değil, zamanlama.)

**BİLEREK BİRLEŞTİRİLMEYEN:** `--fit-wash` #e8f6ee ile `--fit-tint` #eaf6ef
iki ayrı paletten gelen neredeyse aynı renk (ΔR2 · ΔG0 · ΔB1, ΔE00 ≈ 0.5 —
gözle ayırt edilemez). Birleştirmek 127 kullanımın çözülmüş DEĞERİNİ
değiştirirdi; bu tur **ad temizliğiydi, palet birleştirmesi değil**.
Sonraki tur isterse tek adıma indirebilir — açık kalem.

**Geri almak için:** ters yönde aynı yeniden adlandırma. Ama `--fit` ve
`--fit-deep` birleşti; geri dönüş kopyaları da geri getirmek demek.

---

## K55 · Fit Planım CSS'i tek kaynağa çıktı — §0b "sayfa içi style" nasıl okunmalı

**R7 madde 10.** R6'da 226 satırlık `fpx-` bloğu **yedi sayfaya birebir**
kopyalanmıştı (7 × ~12 KB). Gerekçe §0b'nin "sayfa içi style" kuralıydı.

**KARAR:** §0b tek sayfaya özgü ölçüler içindir. **Yedi sayfanın paylaştığı
bir aile, tanım gereği sayfaya özgü değildir** — `assets/css/fit-planim.css`.
Yedi dosyanın md5'i alındı: **7/7 birebir aynıydı**, yani zaten tek kaynaktı,
yalnız yedi kopya hâlinde duruyordu.

**Hiçbir seçici, hiçbir değer değişmedi.** `<style>` bloğu tam durduğu yerde
`<link>` ile değişti — yükleme sırası korunmak ZORUNDA:

    fit-shell.css  →  fit-planim.css  →  fit-type.css

Kabuk önce (fpx kuralları kabuk token'larını okuyor), yaslama katmanı sonra.
Sıra bozulursa `.fp-card p.fpx-note` ailesinin özgüllük dengesi de bozulur.

**KANIT:** 7 sayfa × 2 genişlik (1440 · 390) = 14 imza; her `body *`
elemanının kutusu · `text-align` · `text-align-last` · padding · margin ·
tipografi · renk karşılaştırıldı → **14/14 birebir aynı**. Tek fark
`<head>`teki 9. düğümün `STYLE` yerine `LINK` olması, yani değişikliğin
kendisi.

**Kazanç:** 7 sayfa toplam ~86 KB küçüldü (ör. `fit-planim-v1` 37.7 → 25.5 KB).

**DEVIR-6'nın ifadesi DÜZELTİLDİ:** açık kalem *"`fpx-` CSS/**JS** bloğu"*
diyordu. Yedi sayfanın `<script>` bloklarının md5'i tek tek alındı —
**yedisi de FARKLI** (175–291 satır, her sayfanın kendi mantığı).
Çoğaltılan yalnız CSS'ti; çıkarılacak ortak JS yok.

---

## K56 · `sozluk-v1` eyebrow'u "Terim Terim" değil, ÜST BAĞLAM yazar

**R7 madde 4.** Eyebrow "Terim Terim" idi — hem kendi içinde tekrar, hem de
kabuğun o sayfa için yazdığı **açıklama** metninin kopyası (`fit-shell.js`
NAV: *"Salon dilinin tam karşılığı — terim terim"*).

**Ölçüm — yuvanın sitedeki işi:** 29 banner'ın 29'unda eyebrow ya menü
grubunu ya üst sayfayı yazıyor, sloganı değil. `anatomi-v1` — aynı K34
grubunda, aynı yapıda (h1 = sayfa adı) — birebir **"Hareketi Anlamak"**
diyor. `sozluk-detay-v1` üst sayfasını yazıyor: "Spor Sözlüğü".

**Seçilen:** `Hareketi Anlamak`. Kırıntı zaten DadaFit → Hareket → Spor
Sözlüğü diyor; K34 sayfayı bu grubun altına koymuş. Uydurulmadı, sitenin
kendi menü kaleminden alındı. İkon (`fa-book-open`) değişmedi.

---

## K57 · Yaslama OPT-IN oldu — R6'nın 5. ve 6. maddesi tek kararla kapandı

**Beyar (9. oturum, R7):** *"Madde 5 ve 6 birlikte: yaslama opt-in mi olacak,
işaret sınıfı mı? İkisinin de maliyetini ve riskini çıkar, öner, sonra uygula."*

R6 iki yarım kalem bırakmıştı: **(5) genişlik tarafı** — çıplak `p`'nin
yarısı eşiğin altında ama `container-type` taşımayan sarmalayıcıda olduğu
için sorgu ona hiç ulaşmıyor; **(6) satır sayısı tarafı** — CSS satır
sayısını sorgulayamaz, yani "geniş kutudaki kısa blok" mekanik olarak
yakalanamaz. İkisi de aynı kökten çıkıyordu: **varsayılanın yönü.**

### Ölçüm — 66 sayfa × 2 genişlik, yaslanan ve ≥6 kelimelik her blok

Satır sayısı `Range`'in ürettiği satır kutularından; kelime arası kelimeler
geçici span'lere alınıp komşu kutular arası boşluktan.

| | @1440 | @390 |
|---|---|---|
| yaslanan blok | **803** | **746** |
| ≤4 satır | 793 (**%99**) | 558 (%75) |
| kutu <480 px (eşiğin altı) | 274 (%34) | 734 (%98) |
| **hem ≥480 px hem ≥5 satır — yaslamayı hak eden** | **9 (%1.1)** | **0** |
| görünür nehir (kelime arası ≥2×) | **146** | **488** |

@1440 satır dağılımı: 1×360 · 2×265 · 3×130 · 4×38 · 5×2 · 6×2 · 7×2 · 8+×4.

O 9 bloğun künyesi kararı kendisi veriyor: **8'i `destek-talebi-detay`
sayfasındaki yazışma BALONLARI** (`.tk-msg` / içindeki `.bd`), 1'i
`egzersiz-detay`ta bir kutu. Akan makale metni değil.

**Makale sayfaları ayrıca tarandı** — yaslamanın asıl yeri olması beklenen
dört sayfada ≥5 satırlık yaslanan paragraf **sıfır**:
`yasal-v1` 16 blok/en çok 4 satır · `hakkimizda-v1` 25/4 ·
`saglik-bilgilendirme-v1` 29/3 · `sss-v1` 8/4.

**Bu bir CSS gerçeği değil, İÇERİK gerçeği:** sitenin nesri 1–4 satırlık
kısa paragraflarla yazılmış. Yaslama 803 bloğun 9'una hizmet edip 146'sını
bozuyordu.

### İki seçeneğin maliyeti ve riski

| | **İşaret sınıfı (opt-out)** | **Opt-in** ✅ |
|---|---|---|
| İşaretlenecek blok | **793** (kısa olanlar) | **0** (bugün hak eden yok) |
| Özgüllük yarışı | her işaret, yaslama listesindeki en özgül karşılığını yenmek zorunda | **biter** — yenecek kural kalmadı |
| Yeni sayfa eklenince | **yaslı doğar**, hata sessizce geri gelir | sola yaslı doğar |
| `container-type` yükü | 12 sarmalayıcıda kalır (sticky/overflow riski) | yalnız `.jt-flow` kendi kutusuna koyar |
| Yanlışın bedelini kim öder | fark edilmezse **kullanıcı** | fark edilmezse **kimse** — sola yaslı okunur |

**Belirleyici:** aynı özgüllük tuzağına R6'da **üç kez** düşüldü, biri
yıllardır oradaydı (B21). Üçünün de ortak sebebi istisnanın yaslamayı
yenmek zorunda olmasıydı. Opt-in bu yarışı kaldırıyor.

### Uygulanan mekanizma

    .jt                    tek blok — eşik aranmaz, yazan kişi kutuyu görüyor
    .jt-flow               sarmalayıcı — içindeki p/li/dd/blockquote yaslanır,
                           kendi kutusu --jt-min eşiğinin ÜSTÜNDEyse

`.jt-flow` `container-type`ı **kendi** taşıyor; 12 kart sarmalayıcısına
toptan verilen kapsama kalktı. `@container` koşulu `var()` alamadığı için
30rem elle aynalanıyor — ikisinin ayrışmaması `tests/hizalama-nobeti.mjs`
ölçüt 1'in nöbetinde (R6'da 30rem ↔ 20rem diye ayrışmıştı).

### DÜRÜST NOT — bu GÖRÜNÜR bir değişiklik

Bugün hiçbir blok işaretli olmadığı için **site genelinde iki yana yaslama
fiilen kapandı**. Geri almak ya da seçmece açmak tek satır: sarmalayıcıya
`jt-flow`, tek bloğa `jt` sınıfı. Kural listesine dönmek gerekmiyor.

### KANIT — ne oynadı, ne oynamadı

66 sayfa × 2 genişlik = 130 288 eleman, önce/sonra alan alan:

| Alan | Değişen |
|---|---|
| `text-align` | 5 364 (justify → start/left) |
| `text-align-last` | 417 (auto → start · yaslama yokken görsel etkisi yok) |
| satır içi kutu genişliği/x | **299** — `A` 139 · `STRONG` 81 · `B` 72 · `EM` 2 · `SPAN` 2 · `CODE` 2 · `I` 1 |
| **BLOK kutu (x · y · genişlik · yükseklik)** | **0** |

Yani: yaslama kalkınca genişletilmiş kelime aralarıyla gerilen **satır içi**
kutular doğal enine döndü; **hiçbir blok kutu, hiçbir sayfa yüksekliği,
hiçbir kart yer değiştirmedi.** `container-type` kaldırılmasının da ölçülen
etkisi sıfır — kapsama orada taşıyıcı değilmiş.

**İstisna apparatı SİLİNMEDİ, ikinci savunma hattına düştü.** §3'teki
kurallar (`text-align:center` kompozisyonlar · form kontrolleri · tablo
hizası · `hyphens:manual` · `text-wrap:balance`) bağımsız iş görmeye devam
ediyor; yalnız "yaslamayı geri alma" görevleri boşa çıktı. Ölü seçicilerin
ayıklanması **R8'e açık kalem** — artık `tests/hizalama-nobeti.mjs` ölçüt 4
o temizliği güvenli hâle getiriyor.

---

## K58 · Süite `text-align`/`padding` nöbeti eklendi — B20'nin kör noktası

**R7 madde 7.** B20'de bir regex temizliği `.fpx-sum-sub,` seçicisini
gövdesiz bıraktı; CSS onu sonraki kurala bağladı ve 7 sayfada iki hasar
oluştu: `text-align` justify oldu (@390 kelime arası 3.8 → **40.4 px**,
10.6×) ve boş durum kuralından **yabancı padding** bulaştı (48 → 104 px).
**Yirmi sınamanın hiçbiri yakalamadı** — süitte bu iki özelliği ölçen nöbet
yoktu.

**`tests/hizalama-nobeti.mjs` · dört ölçüt:**

1. **Eşik aynası** (statik) — `--jt-min` ile §2'deki `@container` sayısı
   ayrışamaz. B21'in birebir nöbeti.
2. **Yaslama opt-in sözleşmesi** — hiçbir eleman `.jt` taşımadan ve
   `.jt-flow` içinde olmadan `justify` hesaplayamaz. *(B20 hasarı #1)*
3. **Hesapsız dolgu** — bir `<p>` sıfırdan farklı padding hesaplıyorsa, onu
   **eşleşen** bir CSS kuralı ya da satır içi style açıkça vermiş olmalı.
   Kural eşleşmesi `document.styleSheets` gezilerek, koşullu gruplar
   (`@media`/`@supports`) o an geçerliyse dahil edilerek kuruluyor.
   *(B20 hasarı #2 — dolgu "hiçbir yerden" geldiyse bulaşmıştır.)*
4. **"Sözünü tutuyor mu" sondası** — DEVIR-6 §6/7'nin açık kalemi.
   `fit-type.css` bir elemana `text-align` vaat ediyorsa ve o vaadin
   özgüllüğü, aynı elemana `text-align` veren **diğer bütün kuralların**
   özgüllüğünden düşük değilse, vaat computed'da tutmak zorunda — çünkü
   dosya en son yüklenir, eşit özgüllükte sırayla kazanır.

**Ölçüt 4 neden özgüllük karşılaştırmalı:** ilk yazımda "vaat = computed"
denmişti ve 2385 yanlış bulgu verdi — hepsi `button{text-align:center}`
(0,0,1) vaadinin `.wg-opt{text-align:left}` (0,1,0) gibi **daha özgül ve
kasıtlı** sayfa kurallarınca devralınmasıydı. Bu normal basamaklanma;
sayılıyor ama kırmızıya döndürmüyor. Kırmızı olan **eşit ya da düşük**
özgüllükte kaybetmek — R6'nın üç tuzağının üçü de o hâldi.
Ölçüt aynı zamanda **yükleme sırası nöbeti**: `fit-type.css` sayfa
stillerinden önce yüklenirse eşit özgüllükteki vaatler düşer ve kırmızı olur.

**K27 — TABAN COMMIT'TE KIRMIZI (`8bf5c66`):**

| Ölçüt | Taban commit |
|---|---|
| 1 · eşik aynası | ✗ `--jt-min` 30rem ama sorgu `max-width:20rem` |
| 1 · opt-in kancaları | ✗ `.jt` / `.jt-flow` yok |
| 2 · opt-in sözleşmesi | ✗ **6 989 eleman** izinsiz justify (1 389 tekil) |
| 3 · hesapsız dolgu | ✓ (B20 hasarı R6'da doğdu, tabanda henüz yoktu) |
| 4 · "sözünü tutuyor mu" | ✗ **4 606 eşleşmede** vaat tutmuyor (903 tekil) |

**4 SORUN** · bugünkü ağaçta **0 sorun** (130 288 eleman · 3 946 paragraf ·
23 123 vaat eşleşmesi tarandı).
