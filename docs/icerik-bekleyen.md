# İçerik Bekleyen Kalemler

Prototipte **yer tutucu** olarak duran, gerçek içeriği/adresi henüz
belirlenmemiş kalemlerin tek listesi. Amaç: `href="#"` ve "yakında"
etiketlerinin unutulup canlıya çıkmasını engellemek.

## Kurallar

1. Yer tutucu bırakan **kodda yorum satırı** düşer
   (`YER TUTUCU — … gelince değişecek`) **ve** bu tabloya bir satır ekler.
2. Yer tutucu bağlantı ekran okuyucuda kayıp görünmemeli:
   durumu anlatan bir `aria-label` taşır.
3. Gerçek içerik gelince: tablodaki "Ne yapılmalı" adımları uygulanır,
   satır tablodan **silinir** ve koddaki yorum satırı da kaldırılır.
4. Sahte veri üretilmez. Adresi olmayan bir şey için QR kod, sahte mağaza
   bağlantısı, örnek hesap adı üretilmez — yer tutucu yer tutucu kalır.

## Bekleyenler

| # | Ne bekleniyor | Nerede | Şu anki hâli | Geldiğinde ne yapılmalı |
|---|---|---|---|---|
| 1 | **Instagram hesap adresi** | `assets/js/fit-shell.js` → `FOOTER_RAW`, footer marka alanı, `.foot-soc` bloğu | `<a href="#" data-yer-tutucu="instagram" aria-label="Instagram — hesap adresi henüz yok, yakında">` | `href`'i gerçek profil adresine çevir; `target="_blank" rel="noopener"` ekle; `aria-label`'ı `"Instagram"` yap; `data-yer-tutucu` niteliğini ve üstündeki YER TUTUCU yorumunu sil; `tests/footer-yapi.mjs` §7'deki yer-tutucu beklentisini güncelle |
| 2 | **YouTube hesap adresi** | `assets/js/fit-shell.js` → `FOOTER_RAW`, footer marka alanı, `.foot-soc` bloğu | `<a href="#" data-yer-tutucu="youtube" aria-label="YouTube — hesap adresi henüz yok, yakında">` | 1. kalemle aynı adımlar |
| 3 | **Mobil uygulama mağaza adresleri** (App Store · Google Play) | `assets/js/fit-shell.js` → `FOOTER_RAW`, footer uygulama alanı, `.ap-stores` bloğu | `<span class="ap-store" aria-disabled="true">` — bağlantı **değil**, tıklanamaz, odak sırasına girmez; "Yakında" etiketi görünür | Uygulama **yayımlandıktan sonra** `<span>`'ları `<a href="…" target="_blank" rel="noopener">` yap; `aria-disabled`'ı kaldır; "YAKINDA" üst satırını mağaza diline çevir; `.ap-soon` satırını sil; `tests/footer-yapi.mjs` §6'yı güncelle |
| 4 | **Uygulama indirme QR kodu** (isteğe bağlı) | Aynı blok | **Yok** — gerçek bir indirme adresi olmadığı için sahte QR üretilmedi | 3. kalem kapandıktan sonra, istenirse gerçek adresten üretilmiş QR eklenir |
| 5 | **`enerji-ihtiyaci-v1.html`** — Günlük Enerji İhtiyacı hesaplayıcısı | `assets/js/fit-shell.js` → `FOOTER_COLS`, "Enerji ve Denge" kolonu | Bağlantı yazılı, hedef sayfa **paralel bir dalda üretiliyor**; bu dalda 404 | Dallar birleşince bağlantının 200 döndüğü doğrulanır ve `tests/footer-yapi.mjs` §5'teki "birleştirme sonrası doğrulanacak" istisnası kaldırılır |

## Sosyal medya — kapsam kararı

Footer'da **yalnız Instagram ve YouTube** var. X · Facebook · LinkedIn
Beyar'ın kararıyla kaldırıldı; hesap açılsa bile geri eklenmeden önce
karar yenilenir. (Üst banttaki `.tb-soc` ayrı bir bloktur, bu revizyonun
kapsamı dışında.)
