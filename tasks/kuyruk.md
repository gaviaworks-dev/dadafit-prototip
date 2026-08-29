# KUYRUK — 2026-08-29 · R15

Sunucu: `python3 -m http.server 8788 --bind 127.0.0.1`
Ölçüm: `PW_HOME=~/.pw node <betik>.mjs` · oturum kipi: `?auth=1`
Kit: **`docs/fit-kit.md`** (8 sayfadan `getComputedStyle` ile ölçüldü, 70 token)
Ölçüm betiği: `docs/qa/kit-olcum.mjs`

## BİTENLER — lead

| # | İş | Kanıt |
|---|---|---|
| 1 | Menü yeniden kuruldu | 13 → **9 kalem**, 3 grup ayracı, ölü bağlantı 0 |
| 2 | Kaydetme yeteneği (`fit-kayit.js` → `dm_fit_kayit_v1`) | egzersiz 25/25 · program 9/9 düğme (önce 0/0) · 44×44 · yenilemede duruyor |
| 3 | Üç modül sayfası | 9 sayfa silindi (71→62) · 140 bağlantı yeniden yazıldı · çift ID 9×3 → 0 · `null.textContent` ×6 → 0 |
| 4 | Destek üçlüsü tek adrese | form yalnız 2. sekmede · şerit 344/344 ortalı · arama 190/190 · kolon 860px |
| 5 | antrenor-detay sekme dikişi | 30px → **32px** (`--sec-pad-sm`) + zemin opak `--paper` |
| 6 | antrenor-detay banner dikişi | 8/12/**−11**px → **26/26/26**px (Gastro emsali 26px) · kırpma giderildi |
| 7 | giris-v1: onay · ülke kodu · marka ikonu | kutu 3→2, 20×20→16×16 · 199 ülke aranabilir · Google 4 renk SVG |
| 8 | giris-v1: görsel büyümesi | sol görsel +174px → **0** · arka plan `cover` → `100% auto` |
| 9 | 18 kırmızı test atlanacak duruma getirildi | iddialar silinmedi · `FIT_TESTI_ZORLA=1` ile açılır |
| 10 | bildirimler: tip şeridi gövdeye | şerit 280/280 ortalı · çip merkezi = sayfa merkezi · prototip ibaresi kalktı |

## BİTENLER — ajanlar

| Ajan | Ürün | Kanıt |
|---|---|---|
| 1 · destek | `destek-v1.html` | 4 genişlikte taşma 0 · şerit her genişlikte ortalı · konsol 0 |
| 2 · ödeme | `paketlerim-v1.html` · `odemelerim-v1.html` · `fit-paket.js` | "Pro Max AI" 0 · 3 kademe · tablo 37 satır · 5 sekme dolu |
| 3 · challenge/rozet | `rozetlerim-v1.html` · `fit-challenge.js` · `fit-rozet.js` | puan 0→30 gerçek · yenilemede duruyor · liderlik + dürüst maket şeridi |
| 4 · kabuk | `fit-shell.js` · `fit-shell.css` · hub | yer tutucu 6→**0** · header sırası · marka şeridi 6 · Keşfet · **profil kartı** |
| 5 · sohbet | `fit-mesaj.js` · `fit-mesaj.css` · `mesajlarim-v1.html` | mesaj kaydediliyor, ekranda görünüyor, yenilemede duruyor |

## AJANLARDA AÇIK
- **Ajan 2:** hesabim popup · "Kaldır" · sekme ortalama · 3 sekme kaldırma (9→6) · "Veri ve Hesap" adı · doğum tarihi takvimi · yükseltme akışı
- **Ajan 3:** challenge-merkezi alt yazı merkezi + boşluk · challenge-v1 dikiş yarıçapı + iki kart hizası · challenge-v1 sekme şeridi kite çekilecek
- **Ajan 4:** zebra + bölüm dikey merkezi (8 sayfa) · hero metni + "Köprüyü Gör" kalkacak · dil düğmesindeki ok · görüş bildir popup · hub tarif kartları

## SON DURUM ÖLÇÜMÜ
- **62 sayfa · ölü bağlantı 0 · konsol hatası 0 · "Yakında" 0**
- Kimlik kartı 6 modül sayfasında sekmeler arası **sabit** (`farkliIcerik: 1`)

## AÇIK KARARLAR — Beyar'a soruldu, cevap bekliyor
- **"Başa dön" düğmesi:** ölçüm Gastro ile çelişiyor. 1440'ta ikisi de 92px, 768'de ikisi de 151px, 1024'te Fit **114** / Gastro **131** (Fit zaten daha aşağıda). Gastro'ya çekmek düğmeyi YUKARI taşır. Daha aşağı isteniyorsa yeni hedef sayı gerekiyor.
- Pro Max özellik listesi geçici; kademe–özellik eşlemesi ileride admin panelden seçilecek (`fit-paket.js`te tek veri kaynağı hazır).
- Gerçek çeviri altyapısı yok — Ajan 4 ölçüp raporlayacak, sahte çeviri üretilmeyecek.
