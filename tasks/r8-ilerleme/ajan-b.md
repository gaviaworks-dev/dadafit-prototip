# AJAN-B · SÖZLÜK — ilerleme kütüğü (R8)

- Bağlam okundu: REVIZYON-8 §3, KARARLAR K42/K56/K27/K51, sozluk-v1.html (696 sat), tests/sozluk.mjs + sozluk-kapalilik.mjs.
- Gastro CANLI ölçüldü (@1440 + @390) — DOM ağacı + computed stil dökümü alındı.
  Gastro iskeleti: .sz-controls[searchbar 560x55 → az-bar 1176x66 → ke-filter 1176x68]
  → .sz-sec[p.sz-count AYRI SATIR → .term-card > .term-item > .term-row(.tr-ltr 46x46 + .tr-name + .tr-cat + a.tr-go-link)]
- Gastro accordion ölçümü: ardışık 3 tık → açık kart 1 · 1 · 1 (TEK-AÇIK). Madde 9 referansla uyumlu.
- DadaFit bugün ölçüldü: 254 terim · 28 grup · caret 254 · sağ ok 0 · avatar 0 · banner 544/587 ·
  açık kart ardışık 3 tık → 1 · 2 · 3 (çoklu açık) · açık kartta inset 3px sol şerit VAR.
- Testte kırılacak sözleşme bulundu: tests/sozluk.mjs 11c "madde 10" bloğu ff dropdown'ı ZORUNLU kılıyor
  (`#szCatFilter[data-ff].ff-ready`). R8 madde 7d bunu geçersiz kılıyor → blok R8 sözleşmesine göre güncellenecek.

## Yapılanlar (ölçümle)

**Madde 7 — yapı gastro ile hizalandı.** `sozluk-v1.html` sayfa CSS'i referansın
canlı ölçümüne çekildi. Dört fark kapandı: (a) `.sr-ltr` 46x46 harf avatarı 254
satırın 254'ünde · (b) `.sz-item.open{box-shadow:inset 3px 0}` silindi, açık kaydın
işareti referanstaki gibi SATIR zemini + dolu avatar + marka renkli ad · (c) sayaç
`data-ff-count` kancasından çıkıp `.sz-body` içinde kendi satırına indi ·
(d) `.lib-filters.ff[data-ff]` açılır süzgeci kaldırıldı, 11 çip açık raya çıktı.
Ölçü karşılaştırması: @1440'ta 42 ölçünün 42'si, @390'da 7'nin 7'si birebir.

**Madde 8 — arama çip satırında.** `.sz-tools` = [`.sz-chips` flex:1] [`#szReset`]
[`.sz-search` 360px]. @1440: üst kenar farkı **0 px**, sol boşluk **0 px**,
o satırda görünür çip **4/11**. @390: alt alta, yatay taşma **0**.

**Madde 9 — tek-açık akordiyon.** Referans da tek-açık ölçüldü (1·1·1).
Üç ardışık tıklamada açık kart / aria / görünür gövde = 1·1·1; aynı satıra
ikinci tıklama kapatıyor (0).

**Madde 10 — detaydan iki bölüm kalktı.** `.sz-ask` ve `.sz-tags` blokları,
üreticileri ve stilleri silindi. plank + amrap: iki bölüm 0, kırık iç çapa 0,
kalan bölüm 3/2, künye 5, aile 6, konsol 0. Detaydan çıkan 16 iç adres 200.

**Sınamalar.** `tests/sozluk-r8.mjs` YENİ (17 ölçüt). Taban `654f353`'te
**11 sorun** (worktree + geçici sunucu 8877, sonra kaldırıldı), HEAD'de 0.
`tests/sozluk.mjs` ve `tests/sozluk-kapalilik.mjs` R8 sözleşmesine güncellendi
(dropdown açma adımları kalktı, madde 10 ölçütü tersine döndü) → ikisi de 0 sorun.
`hizalama-nobeti` · `a11y-focus` · `kabuk-kalite` → 0 sorun.

## Ek tur — TAM PARİTE (Beyar kararı: harf grubu başlıkları kalksın)

**Önce ölçüldü, sonra uygulandı. Kendi önceki iddiamı düzelttim.**

Raporumda *"29 harflik rayın çapası grup başlıklarına bağlı"* demiştim — **YANLIŞTI.**
Canlı ölçüm (gastro) ve yerel ölçüm (DadaFit) aynı şeyi söylüyor: harf rayı iki
markada da **ÇAPA DEĞİL SÜZGEÇ**.

| Ölçüm | Gastro | DadaFit (önce) |
|---|---|---|
| `id`li harf çapası | **0** | **0** (`.sz-group`'ların hiçbirinde id yok) |
| "B" tıklanınca `scrollY` | 0 → **0** | 0 → **0** |
| "B" tıklanınca adres | `?harf=B` | `?harf=B` |
| dönen kayıtların harfi | hepsi `data-ltr="B"` | hepsi B |
| kart sayısı | **1** (765 terim) | 28 |
| grup başlığı | **0** | 28 |
| sayfalama | var (765'in 54'ü görünür) | yok |
| ray kalemleri | 30 (Tümü + 29 harf, aynı alfabe) | 30 |

Yani başlıklar kalkınca **ray hiç etkilenmiyor**. Lead'e "rayı silmeden önce sor"
diye verilen 3. şık devreye girmedi; 4. şık uygulandı ama "çapayı ilk terime taşı"
adımı bile gereksizdi — çapa hiç yoktu.

**Uygulanan:** `.sz-group` / `.sz-gh` komple kalktı, 254 kayıt TEK `.sz-card`
içinde. Ayraç referanstaki yerine döndü (`.sz-item{border-bottom}`, ilk kayıt
dahil) → 254 kaydın 254'ü **80.4 px**, referansla birebir.

**Kaybolan tek bilgi:** grup başına terim sayısı. Rayın `title` özniteliğinde
duruyor ("B — 18 terim").

**Nöbet çevrildi, düşürülmedi (K62 kuralı):** `sozluk-r8.mjs`'e "tam parite"
bloğu eklendi — grup başlığı 0 · `.sz-card` 1 · kayıt 254 · kartın içinde kayıt
olmayan düğüm 0 · **28 tıklanabilir harfin 28'inde** doğru kayıt + sayaç + adres.
"Kendi eleştirim" 2. ölçütü (grup başlığındaki kare motifi) silinmedi, çevrildi:
artık "harf karesi YALNIZ `.sr-ltr`" diye ölçüyor (avatar 254, avatar dışı 0).

**K27:** taban `654f353`'te **12 sorun** (önce 11, tam parite bloğuyla +1):
grup başlığı 56 düğüm, eski başlık kalıntısı 84 düğüm. HEAD'de 0.
