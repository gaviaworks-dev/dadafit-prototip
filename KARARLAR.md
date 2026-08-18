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
