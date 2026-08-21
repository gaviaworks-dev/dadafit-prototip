# AJAN-E · R8 ilerleme (hub · program · testler · hakkımızda)

- K-A doğrulandı (kendi ölçümüm): --sec-pad 74/74/74/44 · --sec-pad-sm 32/26/26/22.
  dadafit-hub 8735 px @1440 · hakkimizda 5922 px @1440.
- 21 ✅ arama SAĞA alındı, filtre satırıyla tek satır. @1440 üst kenar farkı **0** (ikisi de 2326).
  @390 alt alta (arama 2968 · filtre 3030), yatay taşma 0.
- 22 ✅ DadaGastro marka kilidi eklendi (fa-utensils + #E14827 + Dada/Gastro).
  4xx **0** · aria-label var · data-yer-tutucu="dadagastro-amblemi" · taşma 0.
  Eyebrow hizası bozulmadı: section içi üst 74/44, sol 132/16, h2 arası 14 — kardeşlerle aynı.
- 25 ÖLÇÜLDÜ: "Tüm Programlar" ZATEN `program-liste-v1.html` (yerel + canlı).
- 27 ölçüt + bulgu listesi lead'e gönderildi (44 bulgu / 17 sayfa; 43'ü kabuk kaynaklı).
- 32 ölçüm tablosu lead'e gönderildi (fp-card maks−min 23 px, cc-card 0).
- 23 ✅ kırmızı vurgu #A32B10 (6.73:1) + #8C2409 başlık (8.26:1 AAA) + "Dikkat" rozeti (7.22:1).
  İkinci işaretler: rozet metni + uyarı ikonu + 4px sol şerit. workout-generator YEŞİL.
- 24 ✅ hub'a #olusturucu önizlemesi (5 adım + 4 günlük örnek çıktı, motorun kendi verisi).
  Hedef h1 "Birkaç seçimle gün gün antrenman planı" eşleşiyor.
- 26 ✅ "Genel Bakış" etiket→başlık 1 px → 14 px (kardeş değeri; challenge-v1'de 7 etiket 14 kullanıyor).
- 27 ✅ program-detay #pgWrap: üst 22→32, alt 0→32 @1440 · 22/22 @390. Yeniden tarama: bu sayfada 0 bulgu.
  Kalan 19 bulgu kabuk/başka ajan alanı — lead'e devredildi.
- 28 ✅ sağlık notu DOM'da sona alındı (indeks 0→4), paragraf 688→1098 px (kutu 1176 = ızgara 1176),
  divider kapatıldı (kabuk kuralı ezilmedi, sayfa-yerel).
- 29 ✅ kolon içi ara @1440 2→1 (44) · @768 3→1 (44) · @390 3→1 (34).
  İçerik section araları @1440 2→1 (148) · @390 2→1 (88). fit-test-lock YEŞİL.
- 32 ✅ fp-card 207/184/184 → 207/207/207 @1440 · 199/176/176 → 199/199/199 @390 (maks−min 0).
- 33 ✅ künye ↔ yasal metinler 6 px → 74 px @1440·1024 · 44 px @390. Sayfa boyu 5922 → 5990.
- 30 · 31 SORU kalemleri ölçüldü, kod değişikliği 0.
- Sınama: tests/hub-program-r8.mjs — 78 ölçüt. Taban 654f353'te 26 kırmızı (worktree ile doğrulandı).
- Tam site taraması: 0 sorun. Banner aileleri değişmedi (544/560 @1440 · 587/726 @390).
- Mevcut süit: workout-generator ✅ · fit-test-lock ✅ · wizard-page ✅ · plan-ozet ✅ (dördü de EXIT 0, 0 kırmızı).
- Kalem 27 son tarama: benim altı sayfamın hiçbirinde bulgu yok. Kalan 19 bulgu kabuk/başka ajan.
- K51: depoya hiçbir görsel girmedi (41 ekran görüntüsü scratchpad'de).

## Beyar kararları uygulandı (lead üzerinden geldi)
- 30 ✅ "Yedi soru" → **"7 soru"** (satır 393 ve 470) · kardeş satır "Beş adım" → **"5 adım"**.
  DÖRT testte de doğrulandı (temel-kuvvet · dayaniklilik · esneklik · denge, hepsi HTTP 200):
  "Yedi" **0** · "Beş adım" **0** · "7 soru · yaklaşık 1 dakika" **2 geçiş** · üç ifade de **tek satır**
  (@1440 132×17 · 176×17 · 672×25 · @390 aynı, B 271×25) · taşma **0**. Süre metni değişmedi.
- 31 ✅ görünür `<span class="lbl">Sırala</span>` kaldırıldı · `#vsSort` `aria-label="Sırala"`.
  Görünür "Sırala" **0** · sayfa metninde "Sırala" **0** · durum niteliği **aria-pressed**
  (üç düğmeden biri true) · üç segment de listeyi değiştiriyor (önce/sonra ilk 3 kayıtlı) · taşma 0.
  Etiket kalkınca hiza bozulmadı: @1440 çubuk 40 px, sayaç↔segment dikey ortası fark **0**;
  @390 "Filtrele" solda (16), segment sağda (175–374), taşma 0.
- Kabuk divider'ı (`.ff-bar .ff-count::before`) LEAD tarafından kaldırıldı → benim sayfa-yerel
  ezmem gereksizleşti, **silindi**. Dört sayfamda ölçüm: divider yok, çubuk 62 px @1440,
  sayaç↔sıralama dikey fark 0, taşma 0 — hiza bozulmadı.
- Sınama 78 → **135 ölçüt**, hepsi yeşil. Taban 654f353: **çıkış kodu 1 · 61 kırmızı · 49 yeşil**.
- Tam site taraması yeniden: **0 sorun**, banner aileleri 544/560/587/726 değişmedi.

## Beyar'ın GÜNCELLENMİŞ 30 kararı + kalan üç iş
- 30 ✅ (v2) "7 soru · yaklaşık 1 dakika" → **"7 soru · 1 dakikadan kısa"**. "yaklaşık" **0**.
  SEKİZ slug'ın hepsinde ölçüldü, iki genişlikte: yeni ifade **2 geçiş** · "5 adım…" **1 geçiş**
  (dokunulmadı) · üç ifade de **tek satır** · taşma **0**.
- 31 ✅ lead doğruladı. `aria-labelledby` yerine `aria-label` seçtim çünkü span siliniyor —
  `labelledby` kırık referansa dönerdi.
- 27 · `.ed-subtabs` ✅ dört enerji-defteri sayfasında `margin:22px auto var(--sec-pad-sm)`.
  Sabit px yok. Tarama: **19 → 11 bulgu**. Dört `ed-subtabs` bulgusu da kapandı.
- 32 ✅ eşit yükseklik kuralı `@media (min-width:641px)` içine alındı.
  @1440 207/207/207 (maks−min 0) · @390 **199/176/176 doğal**, dolgu altı ölü boşluk **1/1/1 px**.
  Sınama K62'ye göre ÇEVRİLDİ: @390'da ölçüt "maks−min ≤2" değil "ölü boşluk 0".
- ÖLÇÜM TUZAĞI DÜZELTİLDİ: taramam `.reveal` blokları `.in` gelmeden ölçüyordu ve
  translateY(22px) yüzünden **negatif** ("−14 px binişme") değer üretiyordu. Lead haklıydı.
  Tarama artık `.reveal`'ları yerine oturtup ölçüyor; `fp-inflow`'un gerçek değeri **üst 22 px**.
- Sınama 135 → **206 ölçüt**, hepsi yeşil. Taban 654f353: **çıkış 1 · 120 kırmızı · 61 yeşil**.
- Tam site taraması: **0 sorun**. Banner aileleri 544/560/587/726 değişmedi.
- Süit: fit-test-lock · enerji-hesap · plan-ozet · plan-account · header-banner · footer-yapi
  hepsi EXIT 0.

## SON TARAMA (lead kabuğun üç üst marjını token'a bağladıktan sonra)
- Kalem 27 taraması: **44 → 19 → 11 → 2 bulgu.**
  Kalan iki bulgu **tek kusurun iki genişlikteki hâli**: `antrenor-detay-v1` `.wrap.cp-exp > .cp-exp-lbl`
  alt **0 px** (@1440 ve @390) — AJAN-G'nin sayfası, DEVIR-8'e yazıldı, dokunulmadı.
- `tests/hub-program-r8.mjs` kabuk değişikliğinden sonra yeniden: **206 ölçüt · 0 kırmızı.**
- Tam site taraması (dördüncü kez): **0 sorun.** Banner aileleri 544/560/587/726 sabit, R11 sapma 0.
- Sayfa boyu @1440: dadafit-hub **9280** · hakkimizda **5990** · enerji-defteri **3835**.
- Kalem 32 @390 dalına "regresyon nöbeti — tabanda da yeşil, kasıtlı" yorumu eklendi (lead isteği).

## tools/yapisiklik-tarama.mjs depoya alındı
- Lead betiği paralel yazıp benimkinin üstüne koydu; **onunkini esas aldım**, geri almadım.
  Aynı sonucu üretiyor: temiz ağaçta **2 bulgu**, taban 654f353'te **42 bulgu**
  (kalem 27'nin asıl kusuru `program-detay · üst:22 alt:0` tabanda yakalanıyor — asit testi geçti).
- **Yalnız etiketi düzelttim** (ölçüm değişmedi): sadece ilk sınıf basılıyordu, 42 bulgunun
  42'si de "div.wrap" diyordu. Artık tam sınıf zinciri + içindeki kart:
  `div.wrap.cp-exp > span.cp-exp-lbl üst:32 alt:0`.
- Künyeye iki not eklendi: (a) `main.page-main` olmayan sayfa SESSİZCE atlanıyor —
  bugün yalnız `index.html` (tek `div.px` çocuğu, taranacak bant yok), yani 66'nın 65'i
  ölçülüyor; (b) 4. tuzağın seçilmiş çözümünün bilinen sınırı: dolgulu sarmalayıcı
  yapışık sayılmıyor, dolayısıyla dolgulu kutu İÇİNDE sıkışmış kart yakalanmaz.
