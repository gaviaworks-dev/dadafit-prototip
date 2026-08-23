---
name: uiux-denetim
description: DadaFit sayfalarını Playwright ile ÖLÇEREK denetler — yatay taşma, dokunma hedefi (WCAG 2.5.8/2.5.5), metin/zemin kontrastı (WCAG 1.4.3), satır uzunluğu, metnin kabını doldurma oranı, başlık hiyerarşisi, dikey ritim. Kullan — kullanıcı "burayı best practice'e göre düzelt", "UI/UX denetimi yap", "bu bölüm kötü olmuş düzelt", "boşluk hiyerarşisi bozuk", "info yazısı yarım kalmış", "kontrast/erişilebilirlik kontrol et" dediğinde ya da bir sayfayı elle düzeltmeden önce.
---

# UI/UX Denetimi (ölçen)

Bu skill **izlenim üretmez, sayı üretir**. Depodaki `DENETIM.md` §1'in
kuralı burada da geçerli: *"Bir iddia sayı üretmiyorsa, iddia değil
izlenimdir."*

`design-review` ve `uiux-review` skill'leri gözle bakar; **bu skill ölçer.**
Bir sayfayı düzeltmeden önce bunu koş, sonra düzelt, sonra tekrar koş.

## Çalıştırma

```bash
PW_HOME=~/.pw node tests/uiux-denetim.mjs <sayfa.html> [kapsam-seçicisi]
```

| Komut | Ne yapar |
|---|---|
| `… fit-testi-detay-v1.html` | Sayfa gövdesini denetler (**kabuk hariç**) |
| `… sozluk-v1.html ".sz-body"` | Yalnız verilen bölümü denetler |
| `… dadafit-hub-v1.html "body"` | Kabuk dâhil her şeyi denetler |

Üç genişlikte koşar: **390 · 1024 · 1440**.
Çıkış kodu: bulgu varsa `1`, temizse `0`.

Playwright kurulu değilse `tests/_pw.mjs` nereye bakacağını söyler
(`PW_HOME=~/.pw` bu depoda çalışan yol).

## Ölçtüğü sekiz başlık ve eşiklerin kaynağı

| # | Başlık | Eşik | Kaynak |
|---|---|---|---|
| 1 | Yatay taşma | `scrollWidth > clientWidth + 1` | taşma her zaman kusur |
| 2 | Dokunma hedefi | **hata** < 24×24 · **uyarı** < 44×44 | WCAG 2.2 §2.5.8 (AA) · WCAG 2.1 §2.5.5 (AAA) |
| 3 | Metin/zemin kontrastı | normal ≥ 4.5:1 · iri ≥ 3:1 | WCAG 2.1 §1.4.3 (AA) |
| 4 | Satır uzunluğu | ≤ 95 karakter/satır | Bringhurst 45–75 · Butterick 45–90 |
| 5 | Metin genişliği / kap | ≥ %72 | Beyar'ın "yarım kalmış yatayda" kusurunun ölçülebilir hâli |
| 6 | Başlık hiyerarşisi | tek `h1`, atlanan seviye yok | WCAG §1.3.1 |
| 7 | Dikey ritim | ayraç altı ≥ 16px ve ≥ üst/2 · 4px ızgarası | Material · Carbon · Polaris |
| 8 | Görünürlük | `getClientRects().length > 0` | `DENETIM.md` §2 |

## Sondanın bilinen körlükleri — ÖNCE BUNLARA BAK

`DENETIM.md`: *"Sondanın kendi kusuru, ölçülenin kusuru sanıldı — bu tek
turda en az on bir kez oldu."* Bu sonda geliştirilirken de iki kez oldu,
ikisi de kapatıldı ama sınırları bilerek durmalısın:

1. **Kontrastı ölçülemeyen metin.** Metnin arkasında bir **görsel/gradyan**
   varsa ya da metin **şeffaf sabit/yapışkan** bir kabın içindeyse
   (ör. banner üstündeki şeffaf header), gerçek zemin DOM'dan bilinemez.
   Sonda o metni **ölçmez** ve rapor başında kaç tanesini atladığını yazar.
   İlk sürümde bu metinler `1.00:1` diye **sahte hata** üretiyordu.
   → Rapordaki "kontrastı ölçülemeyen" sayısı yüksekse, o bölgeye **gözle** bak.

2. **Gizlenmiş form girdisi.** `.cbx`/`.tgl` gibi özel kontrollerde gerçek
   `<input>` 1×1'e indirilir; dokunma hedefi input değil onu saran
   `<label>`'dır. Sonda ölçümü label'a kaydırır. Label yoksa **atlar** —
   yani "hedef yok" demek "hedef doğru" demek değildir.

3. **Kapsam varsayılanı `main.page-main`.** Kabuk 66 sayfada ortak; her
   sayfada aynı kabuk bulgusunu basmak raporu boğar. Kabuğu denetlemek
   istiyorsan kapsamı `"body"` ver.

4. **Bilinçli kararlar da bulgu olarak çıkar.** Ör. `a.crumb-home` 10×9 —
   kardeş markadan ölçülerek alınmış, `tests/crumb-home.mjs` bunu kilitliyor.
   Sonda WCAG'a göre haklı; ama **düzeltmeden önce sor**, kararı devirme.

## İş akışı

1. **Ölç** — düzeltmeden önce koş, çıktıyı sakla (bu "önce" sayın).
2. **Ayıkla** — her bulgu için: gerçek mi, sondanın körlüğü mü, bilinçli
   karar mı? Üçünü ayır. Sondadan şüphelenmek ilk adımdır.
3. **Düzelt** — kusuru kaynağında düzelt. Sayfa CSS'i mi kabuk mu olduğuna
   dikkat et: kabuk 60+ sayfayı etkiler.
4. **Tekrar ölç** — "önce N → sonra M" diye yaz. Sayı vermeyen rapor kapanmaz.
5. **Görüntüye bak** — sonda yeşil olup arayüz bozuk olabilir
   (`tests/header-banner.mjs` bunu geometriyle ölçüyor, renkle değil).

## Rapor biçimi

Her bulgu üç satır: `[HATA|uyarı] öğe` · `ölçülen X · eşik Y · @genişlik` ·
kısa gerekçe. Aynı bulgu üç genişlikte de çıkarsa `@hepsi` diye toplanır,
tekrar eden örnekler `×N` ile sayılır.
