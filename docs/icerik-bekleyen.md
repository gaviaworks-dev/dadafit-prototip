# İçerik Bekleyen Kalemler

Prototipte **yer tutucu** olarak duran, gerçek içeriği/adresi henüz
belirlenmemiş kalemlerin tek listesi. Amaç: `href="#"` ve "yakında"
etiketlerinin unutulup canlıya çıkmasını engellemek.

## Kurallar

1. Yer tutucu bırakan **kodda yorum satırı** düşer
   (`YER TUTUCU — … gelince değişecek`) **ve** bu tabloya bir satır ekler.
   Satırın anahtarı **numara değil `slug`**: koddaki `data-yer-tutucu="…"`
   değeriyle **birebir aynı** olacak. Numara kullanılmaz — R8'de iki ajan
   aynı anda "6"dan başlayıp çakıştı; slug çakışmaz ve `grep` ile koddaki
   karşılığına doğrudan gider.
2. Yer tutucu bağlantı ekran okuyucuda kayıp görünmemeli:
   durumu anlatan bir `aria-label` taşır.
3. Gerçek içerik gelince: tablodaki "Ne yapılmalı" adımları uygulanır,
   satır tablodan **silinir** ve koddaki yorum satırı da kaldırılır.
4. Sahte veri üretilmez. Adresi olmayan bir şey için QR kod, sahte mağaza
   bağlantısı, örnek hesap adı üretilmez — yer tutucu yer tutucu kalır.

## Bekleyenler

| slug | Ne bekleniyor | Nerede | Şu anki hâli | Geldiğinde ne yapılmalı |
|---|---|---|---|---|
| `instagram` | **Instagram hesap adresi** | `assets/js/fit-shell.js` → `FOOTER_RAW`, footer marka alanı, `.foot-soc` bloğu | `<a href="#" data-yer-tutucu="instagram" aria-label="Instagram — hesap adresi henüz yok, yakında">` | `href`'i gerçek profil adresine çevir; `target="_blank" rel="noopener"` ekle; `aria-label`'ı `"Instagram"` yap; `data-yer-tutucu` niteliğini ve üstündeki YER TUTUCU yorumunu sil; `tests/footer-yapi.mjs` §7'deki yer-tutucu beklentisini güncelle |
| `youtube` | **YouTube hesap adresi** | `assets/js/fit-shell.js` → `FOOTER_RAW`, footer marka alanı, `.foot-soc` bloğu | `<a href="#" data-yer-tutucu="youtube" aria-label="YouTube — hesap adresi henüz yok, yakında">` | 1. kalemle aynı adımlar |
| `magaza-adresleri` | **Mobil uygulama mağaza adresleri** (App Store · Google Play) | `assets/js/fit-shell.js` → `FOOTER_RAW`, footer uygulama alanı, `.ap-stores` bloğu | `<span class="ap-store" aria-disabled="true">` — bağlantı **değil**, tıklanamaz, odak sırasına girmez; "Yakında" etiketi görünür | Uygulama **yayımlandıktan sonra** `<span>`'ları `<a href="…" target="_blank" rel="noopener">` yap; `aria-disabled`'ı kaldır; "YAKINDA" üst satırını mağaza diline çevir; `.ap-soon` satırını sil; `tests/footer-yapi.mjs` §6'yı güncelle |
| `uygulama-qr` | **Uygulama indirme QR kodu** (isteğe bağlı) | Aynı blok | **Yok** — gerçek bir indirme adresi olmadığı için sahte QR üretilmedi | 3. kalem kapandıktan sonra, istenirse gerçek adresten üretilmiş QR eklenir |

| `ustbant-sosyal` | **Üst bant (`.tb-soc`) sosyal adresleri** — Instagram · YouTube · **Pinterest** | `assets/js/fit-shell.js` → `TOPBAR`, `.tb-soc` bloğu (~satır 535) | Üçü de `<a href="#">`, **yer tutucu işareti yok**, `aria-label` yok | Footer revizyonundan ÖNCE de böyleydi; footer dokümanının kapsamı dışında olduğu için markup'a dokunulmadı. **İki ayrı karar bekliyor:** (a) footer yalnız Instagram + YouTube gösteriyor, üst bantta **Pinterest** de var — hangisi doğru? (b) adresler gelince footer'daki desenin aynısı uygulanmalı (`data-yer-tutucu` + `aria-label` + gerçek `href`) |

| `danisan-ortalama-calisma-suresi` | **Danışanların ortalama çalışma süresi** (toplu veri) | `antrenor-detay-v1.html` → "Danışan deneyimi" satırı, `.cp-stats` üçüncü hücre | `<div class="cps" data-yer-tutucu="danisan-ortalama-calisma-suresi">` — değer yerine "Veri henüz yok"; `aria-label` durumu anlatıyor. Yorumlarda tekil süreler var ("4 aydır", "6 aydır") ama **ortalama** hesaplanmış bir kayıt yok, sayı uydurulmadı | Toplu veri gelince `<b>`in metnini gerçek ortalamayla değiştir (ör. "5,2 ay"); `data-yer-tutucu` niteliğini, `aria-label`ı ve üstündeki YER TUTUCU yorumunu sil; `tests/antrenor-profil.mjs` §4'teki yer-tutucu beklentisini güncelle |
| `antrenor-challenge-eslesmesi` | **Antrenör ↔ challenge eşleşmesi** | `antrenor-detay-v1.html` → "Challenge'lar" sekmesi paneli (`.fit-pane[data-pane="challenge"]`) | `data-yer-tutucu="antrenor-challenge-eslesmesi"` — panel `.lib-empty` boş durumunda; challenge merkezine (gerçek sayfa) yönlendiriyor. `challenge-merkezi-v1.html`'deki üç challenge kaydının hiçbirinde antrenör alanı yok, bu yüzden "Selin'in challenge'ları" listesi uydurulmadı; sekmede sayaç (`.cnt`) da basılmadı | Challenge kaydına antrenör alanı eklenince paneli challenge kartlarıyla doldur; sekmeye `<span class="cnt">` sayacı ekle; `data-yer-tutucu` niteliğini ve YER TUTUCU yorumunu sil; `tests/antrenor-profil.mjs` §5'teki yer-tutucu beklentisini güncelle |
| `antrenor-aylik-paket-ucreti` | **Antrenör başına aylık paket ücreti** | `antrenor-detay-v1.html` → "Seanslar" sekmesi, üçüncü `.svc-card` (`₺1.600 / ay`) ve randevu modalindeki "Aylık Paket" satırı | Sayfadaki `VERI` haritası her antrenör için **birebir seans** ücreti taşıyor (₺370–₺520, slug'a bağlı) ama **aylık paket** ücreti taşımıyor; iki yerde de her antrenörde aynı `₺1.600` görünüyor. Bu R9'dan ÖNCE de böyleydi (randevu modali), R9 yalnız görünür hâle getirdi. Ücret **uydurulmadı**: seans × 4 gibi bir çarpım "paket indirimi yok" iddiası olurdu | `VERI` haritasına antrenör başına `aylikPaket` alanı ekle; kartı ve modal satırını `[data-at="aylik"]` ile ona bağla; `tests/antrenor-profil.mjs` §13'e "aylık paket ücreti slug'a bağlı" ölçütünü ekle (bugün kasıtlı olarak ölçülmüyor) |
| `antrenor-portre-fotografi` | **Antrenörün portre fotoğrafı** | `antrenor-detay-v1.html` → `.cp-ava` (kimlik kartı, 128×128 daire — R9'da `.cp-portre` idi, referansın `.pf-ava`sına hizalandı) | `data-yer-tutucu="antrenor-portre-fotografi"` + durumu anlatan `role="img"`/`aria-label`. Kutuda duran stok kare **portre değil** — dört kişilik geniş bir salon karesi, 128px daireye sığınca hiçbir yüz seçilmiyor (ölçüldü, R8). DEVIR-7 §5e kalem 4 buydu. Yeni görsel üretilmedi, başka stok kare uydurulmadı | Gerçek portre gelince `background-image`i değiştir; `data-yer-tutucu`, `role="img"` ve `aria-label`ı sil (portre görselse `<img alt>`e çevirmek daha doğru); üstündeki YER TUTUCU yorumunu kaldır |


| `dadagastro-amblemi` | **DadaGastro amblemi** (köprü bölümü üst etiketi) | `dadafit-hub-v1.html` → "Köprü İş Başında" bölümünün eyebrow'u, `.dg-mark` | `data-yer-tutucu="dadagastro-amblemi"` + `role="img"` + durumu anlatan `aria-label`. **Amblem dosyası `assets/` altında YOK** (arandı: `assets/img`, `assets/svg` — yalnız DadaFit'in kendi `logo-official.png`'si var), yeni amblem **üretilmedi**. Yerinde duran şey deponun kendi DadaGastro işareti: `fit-shell.js:568` brand-switch kilidi — `fa-utensils` + marka rengi **#E14827** + "Dada"(ExtraBold)/"Gastro"(Light). Yani sahte görsel değil, mevcut marka dili | Gerçek amblem gelince `assets/img/` altına koy, `.dg-mark` içindeki `<i>` + `.dg-wm` yerine `<img alt="DadaGastro">` yaz, `data-yer-tutucu` / `role="img"` / `aria-label`'ı ve YER TUTUCU yorumunu sil, `tests/hub-program-r8.mjs` §22'deki yer-tutucu beklentisini güncelle |

## Çözülenler

| Ne | Ne zaman | Sonuç |
|---|---|---|
| Destek sayfası — avatar dropdown'ındaki "Destek" kalemi | 10. oturum (R8) | AJAN-F `destek-v1.html`'i üretti; dropdown kalemi gerçek bağlantıya bağlandı, `href="#"` yer tutucusu kalktı. `tests/kabuk-r8.mjs` hedefin h1'ini ("Destek") nöbette tutuyor |
| `enerji-ihtiyaci-v1.html` — Günlük Enerji İhtiyacı hesaplayıcısı | 7. oturum | Sayfa üretildi ve birleştirildi; footer bağlantısı **HTTP 200** doğrulandı, `tests/footer-yapi.mjs`'teki "birleştirme sonrası doğrulanacak" istisnası kalktı |

## Sosyal medya — kapsam kararı

Footer'da **yalnız Instagram ve YouTube** var. X · Facebook · LinkedIn
Beyar'ın kararıyla kaldırıldı; hesap açılsa bile geri eklenmeden önce
karar yenilenir. (Üst banttaki `.tb-soc` ayrı bir bloktur, bu revizyonun kapsamı
dışındaydı — ama yer tutucuları unutulmasın diye yukarıya 5. kalem
olarak kaydedildi. Orada ayrıca **Pinterest** de duruyor.)
