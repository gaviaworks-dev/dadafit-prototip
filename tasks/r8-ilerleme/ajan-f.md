# AJAN-F · DESTEK — ilerleme kütüğü (R8)

- [t+00] Brief + R8 §7 okundu, frontend-design skill yüklendi. Sunucu :8811 → 200.
- [t+08] **36 · seçici doğrulandı.** "Sarı prototip kutusu" = `background:var(--cream-2)`
  (#F7F1E6) + `border:1px solid #e7ddcb` deseni. Ham `grep prototip` 19 sayfa döndürüyor
  ama bunların çoğu düz metin. Playwright ile *computed* `background-color ==
  rgb(247,241,230)` taraması: **21 sayfa · 24 kutu** (bunların hepsi prototip uyarısı DEĞİL,
  ayıklanacak).
- [t+10] **36 · "Senin iznin" bulundu:** `hareket-merkezi-v1.html:356`
  `<span class="eyebrow">… Senin izin</span>` (iznin değil, **izin** = iz/geçmiş).
  Altındaki kutu `.hm-gate-strip` (satır 362), aynı krem desen.
- [t+14] **34 · Gastro GİRİŞ DUVARI.** `https://dadagastro.com/hesabim/destek` →
  302/redirect → `https://dadagastro.com/giris` (HTTP 200, h1 "Tekrar hoş geldin").
  Footer'daki "Çözüm Merkezi" de aynı URL'ye gidiyor. Destek sisteminin İÇİ görülemiyor.
- [t+22] **34 · destek-v1.html üretildi.** İskelet gastro'nun görülebilen destek
  yüzeyinden (`dadagastro.com/sss` — footer "Çözüm Merkezi" oraya gidiyor) birebir
  alındı: banner → sekme rayı → gövde (akordeon) → CTA bandı. Renk yeşile çevrildi.
- [t+26] **34 · sekme rayı** iki sayfaya da kondu (Destek | Taleplerim), aria-current
  doğru, @1440 ve @390 ölçüldü.
- [t+30] **36 · üç krem kutu kaldırıldı** (destek-talepleri `.tk-demo` ·
  hesabim `.hs-demo` · uyelik-faturalandirma `.hs-demo`). Bilgi `.lib-sub` ve
  form altı `.sub-note`/liste açıklamasına taşındı. `.fp-gate-in` (13 sayfa,
  fit-shell.js'te) DOKUNULMADI — A'nın dosyası, lead'e bildirildi.
- [t+34] **Kendi eleştirim · 5 kusur bulundu ve düzeltildi** — bkz. final rapor.
- [t+38] `tests/destek-akisi.mjs` yazıldı. Güncel ağaçta **yeşil** (6/6),
  taban commit `654f353`'te **kırmızı: 23 sorun** (git worktree + :8833, worktree
  kaldırıldı). `tests/hizalama-nobeti.mjs` 0 sorun · `tests/a11y-focus.mjs` 0 sorun.
- [t+40] index.html prototip haritasına `destek-v1.html` eklendi.

## KENDİ ELEŞTİRİM — bulunan 5 kusur ve düzeltmesi (hepsi ölçüldü)

1. **`.lib-sub` metni kırpılıyordu.** Kabuk banner alt metnini 2 satıra kliple
   ediyor; yazdığım 3 satırlık cümle "…destek talebi…" diye kesiliyor, cümle
   yarım kalıyordu. Metin 2 satıra sığacak şekilde kısaltıldı.
2. **`.lib-stats` yanlış kullanılmıştı.** Üçüncü sayaç "09:00–18:00" idi; kit
   sayaç için yazılmış (28px `b`), saat aralığı h1 ile boy ölçüşüyordu.
   "8 toplam talebin" ile değiştirildi; destek saati zaten CTA metninde yazılı.
3. **Açık talep satırları kardeş sayfayla UYUŞMUYORDU.** Hub'a DF-2402 ve
   DF-2377 yazmıştım; `destek-talepleri-v1`'de DF-2402 YOK, DF-2377 ise
   "yanıtlandı" durumunda ve başka bir başlık taşıyor. Üç satır da
   `data-durum="acik"` olan gerçek üçlüyle (DF-2418 · DF-2412 · DF-2404)
   değiştirildi; başlık, konu, tarih, `<time datetime>` ve markup birebir.
4. **`.qa-head` tipografisi gastro'dan sapıyordu.** `<button>` line-height'ı
   miras almaz, `normal`a düşüyordu; gastro `/sss`'te ölçüm 15.5px/**24.025px**.
   `line-height:var(--lh-body)` eklendi → 24.025px. (Aynı sapma `sss-v1.html`'de
   DURUYOR, kapsam dışı — aşağıda bildirildi.)
5. **Yeni sekme bağlantılarında görünür odak halkası yoktu.** Kabuğun `.dt`
   kuralı `<button>` için yazılmış, `a:focus-visible` diye genel bir kural da
   yok. `a.dt` ve `.ds-all` için odak halkası eklendi; ayrıca konu akordeonuna
   erişilebilir ad bağlandı (`aria-labelledby` → ekranda zaten yazan
   "Hızlı çözümler"; görsel değişiklik yok).
