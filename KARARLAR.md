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
