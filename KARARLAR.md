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
