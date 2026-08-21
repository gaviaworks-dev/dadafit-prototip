# AJAN-D · EGZERSİZ — ilerleme kütüğü

- 18:5x · başladım. Bağlam okundu (REVIZYON-8 §5, DEVIR-7 §2c, header-banner.mjs). Ölçüme geçiyorum.
- 15 ✔ banner: yükseklik zaten 560/617/726'ydı; asıl kusur BANDIN İÇİNDEKİ ölü boşluktu.
  269.4→161.9 @1440 · 328.4→147.7 @1024 · 437.5→267.3 @390. Eklenen: alt metin (kütüphane
  kartının özeti, K43), .lib-cta (iki sayfa-içi hedef), .lib-stats (3 sayı, tablodan sayılıyor).
- 16/18 ✔ sayfa altı üç not tek `.note-band` içinde; kutu = içerik kolonu, fark 0 (1176/976/358).
  Not: taban commit'te a11y notu 760/1176'ydı — A'nın madde 5'i şeridi genişletmiş, ben yığın
  içindeki `margin:auto` tuzağını kapattım (flex kolonda auto marj stretch'i eziyordu, 786/1176).
- 17 ✔ "bulamadık" notu banner altından sayfa sonuna taşındı; y/docH %80 @1440, %77 @390.
- 19 ✔ İki sayfada da sağlık/destek notu YOKTU (dokuz kardeş hareket-* sayfasında var). Eklendi,
  kardeş marka yapısıyla (dadadiet.com/beslenme .reh-note: kapsam → koşul → yönlendirme).
- 20 ✔ `.ff-count::before` ayracı sayfa kapsamında kapatıldı (kural KABUKTA, 7 sayfa etkiliyor).
- Sınama `tests/egzersiz-r8.mjs` — 654f353'te 55 sorun, çalışma ağacında 0.
- Süit: egzersiz-katalog 0 · header-banner 0 · hizalama-nobeti 0.
- Kendi eleştirim: 3 kusur bulundu ve düzeltildi (not gövdesi kademe düşüyordu · üç kutu aynı
  ağırlıktaydı · video notu OLMAYAN "Sağlık ve güvenlik şeridi"ne yönlendiriyordu).
- 19:1x · BİTTİ. Altı kalem de kapandı. Taban 654f353'te tests/egzersiz-r8.mjs = 55 SORUN
  (worktree + ayrı port ile ölçüldü, worktree kaldırıldı), çalışma ağacında 0 sorun / 3 genişlik.
  Rapor lead'e SendMessage ile gönderildi.
