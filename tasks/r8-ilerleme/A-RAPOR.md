# AJAN-A · KABUK — REVİZYON 8 RAPORU

**Kalemler:** K-A · 1 · 2 · 3 · 4 · 5 · 6 · 36 (lead devretti)
**Taban commit:** `654f353` · **Sayfa:** 66 → **65** (hub silindi)
**Nöbet:** `tests/kabuk-r8.mjs` (YENİ) — K-A + 1·2·3·4·5·6 + 36 · **0 sorun**
**Commit atılmadı, push edilmedi.**

> **Bağlam uyarısı:** bu oturumun bendeki bağlamı iki kez kısaldı. Bu yüzden
> her kalemin durumunu **kaynak yorumundan değil, computed ölçümden ve
> `git diff`'ten** doğruladım. Aşağıdaki her sayı bu turda yeniden ölçüldü.

---

## DOKUNDUĞUM DOSYALAR (lead'in istediği liste)

| Dosya | Ne |
|---|---|
| `assets/js/fit-shell.js` | K-A yok · kalem 1·2·3·4·6·36 |
| `assets/css/fit-shell.css` | K-A · kalem 1·5·36 |
| `dadafit-kopru-v1.html` | kalem 4 — tek etiket düzeltmesi (aşağıda) |
| `tests/kabuk-r8.mjs` | **YENİ** nöbet |
| `tests/footer-yapi.mjs` | kurumsal bant beklentisi (Çözüm Merkezi hedefi) |
| `tests/plan-account.mjs` | iki ölçüt R8 kararlarına taşındı |

Kalem 4'ün 32 dosyalık bağlantı çevrimi bu turdan önce yapılmıştı; bu turda
**yalnız `dadafit-kopru-v1.html`'e dokundum**. Diğer ajanların dosyalarına
girmedim.

---

## K-A · `--sec-pad` rampası

### Ölçüm
| Ölçüt | Beklenen | Ölçülen | ✅ |
|---|---|---|---|
| 1 · `.sec` computed `padding-top` | 74 · 74 · 74 · 44 | **74 · 74 · 74 · 44** (@1440·1024·768·390, 19 bölüm) | ✅ |
| 2 · `dadafit-hub-v1` sayfa boyu | 8 737 | **8 735** (%−0.02) | ✅ |
| 2 · `hakkimizda-v1` | 5 924 | **5 922** (%−0.03) | ✅ |
| 2 · `hareket-merkezi-v1` | 4 763 | **ölçülemedi — sayfa silindi** | ⚠ |
| 3 · tam site taraması ×3 genişlik | 0 | yatay taşma **0** · konsol **0** | ✅ |
| 4 · banner ailesi | liste 544/607/587 ×54 · detay 560/617/726 ×8 | **birebir** | ✅ |

**Ölçüt 2'nin üçüncü örneği hakkında (sıra tuzağı):** uyarını aldım ve K-A'yı
hub dururken ölçmeye başladım — ilk taramamda sayfa diskteydi (33 geçiş).
Ölçüm sürerken sayfa silindi; ikinci ölçümde HTTP 404 döndü. İlk iki örnek
öngörüyü **%0.03 içinde** tuttuğu için rampa doğrulanmış sayılıyor; üçüncü
örneğin sayısı artık üretilemez, silindiği not düşüldü.

---

## Kalem 1 · "Planım" oturuma bağlı

### Referans ölçümü (lead'in K numarası için istediği kayıt)
`dadadiet.com` ana sayfa, **misafir** durumu, `header .head-actions` içeriği:

```
icon-btn (arama)
a.btn-login  "Planım"     → https://dadadiet.com/planim      ← MİSAFİRDE GÖRÜNÜR
a.btn-login  "Giriş Yap"  → https://dadadiet.com/giris?return=%2F
acct-btn (avatar)
  ↳ dropdown: "Planım · Bugünün özeti" → /planim             ← DROPDOWN'DA VAR
     Günlük Takip · Programını Bul · İlerlemem · Alışveriş Listem ·
     Uzman Desteğim · Kaydettiklerim · Sağlık Profilim ·
     Hesap ve Ayarlar · Çıkış
```

**Yani referans, Beyar'ın yasakladığı iki şeyi de yapıyor:** misafirde
"Planım" düğmesini gösteriyor **ve** hesap dropdown'ında "Planım" kalemi
tutuyor. Kalem 1'in "referansı birebir al" cümlesiyle "misafirde gizle,
dropdown'a koyma" talimatı **gerçekten çelişiyor**; lead onayıyla
**Beyar'ın talimatı uygulandı**. Bilinçli ayrışma.

### Ölçüm — 4 kırılım × 3 ölçüt
| Kırılım | Header düğmesi | Alt bar kalemi | Dropdown'da "Planım" |
|---|---|---|---|
| @1440 misafir (66) | 0 | 0 | **0** |
| @1440 giriş (65) | var | var | **0** |
| @390 misafir (66) | 0 | 0 | **0** |
| @390 giriş (65) | 0 (header düğmesi alt bara devreder) | 1 | **0** |

Mobilde giriş durumunda header düğmesinin kapanması ayrı bir kusurdu
(`.btn-login{display:none}` (0,1,0), `body.is-auth .btn-login.btn-plan`
(0,3,0) kuralını yenemiyordu → 65/66 sayfada düğme kalıyordu); ≤640 bloğunda
kapatıldı.

---

## Kalem 2 · Footer "Yasal ve Sağlık" başlığı

Görünür `<h5 class="fl-head">` kaldırıldı; bandın adı `aria-label`'da kaldı
(ekran okuyucu bandı hâlâ adıyla duyurur).

| Ölçüt | Ölçülen | ✅ |
|---|---|---|
| Görünür başlık | **0/65** | ✅ |
| Yasal bağlantı sayısı öncesi = sonrası | **6 = 6**, metin·sıra·hedef aynen | ✅ |
| Kırık bağlantı | **0** | ✅ |

Bağlantılar **taşınmadı** — aynı bantta, aynı sırada, aynı biçimde duruyor;
kalkan yalnız başlık öğesi.

---

## Kalem 3 · "Hareketi Anlamak" divider'ı

`{group:'Hareketi Anlamak'}` kalemi diziden çıkarıldı.

| Ölçüt | Ölçülen | ✅ |
|---|---|---|
| `.dd-group` düğümü | **0/65** | ✅ |
| Panel kalem sayısı ve sırası | **5**, sıra doğru | ✅ |

**K34 uyarın karşılandı:** uyardığın `fit-shell.js:68`'deki `match` dizisine
**dokunulmadı** — "Hareketi Anlamak" grubunun dört sayfası (`sozluk-v1` ·
`sozluk-detay-v1` · `anatomi-v1` · `antrenman-olusturucu-v1`) hâlâ `hareket`
kaleminde toplanıyor, aktif durum mantığı kırılmadı. `.dd-group` /
`.d-sub-group` CSS biçimleri de **silinmedi** (başka kalem kullanabilir).

---

## Kalem 4 · "Hareket merkezi" kaldırıldı

### Silmeden ÖNCE aldığım harita (lead Beyar'a bunun üstüne sordu)
25 dosya · 33 geçiş:

| Sınıf | Geçiş | Ne |
|---|---|---|
| Kırıntı "Hareket" | **16** | üst bölüm kırıntısı |
| İçerik bağlantısı | **11** | 8 sayfa (`fit-planim-kaydettiklerim` 4 · `programlar-merkezi` derin çapa `#sure` · index · sss · bildirimler · profil · hakkimizda) |
| Kabuk | **5** | nav · dropdown · alt bar · footer |
| Sayfanın kendi kırıntısı | 1 | — |

**Kritik bulgu:** 9 kardeş sayfanın kırıntı zinciri
`Ana Sayfa → Hareket [hub] → Hareket Rehberi → <sayfa>` — yani **doğrudan
ebeveynleri `hareket-rehberi-v1`, hub değil.** Hub kalkınca yetim
kalmıyorlar. Beyar'ın kararı (9 sayfa duruyor) bu ölçümle uyumlu çıktı.

### Kapanış ölçümü
| Ölçüt | Ölçülen | ✅ |
|---|---|---|
| Tam site taraması kırık iç bağlantı | **0** (65 benzersiz hedef tarandı) | ✅ |
| nav "Hareket" href | `egzersiz-kutuphane-v1.html` | ✅ |
| Hedefin h1'i | **"DadaFit Egzersizleri"** — beklenen kayıtla eşleşiyor (HTTP değil HEDEF) | ✅ |
| Dropdown kalem sayısı | 6 → **5** | ✅ |
| Footer "Hareket ve Öğren" | 6 → **5** | ✅ |
| Görünen "Hareket Merkezi" metni | **0** (site geneli, innerText) | ✅ |
| Kaynakta `hareket-merkezi-v1` | **2 — ikisi de yorum satırı**, kod yok | ✅ |

**Bu turda bulduğum kalıntı — `index`/`sss` değildi:** ikisi de temizdi. Ama
`dadafit-kopru-v1.html:977`'de **"Hareket Merkezi'ne Dön"** düğmesi vardı.
Bağlantı kırık değildi (`dadafit-hub-v1.html`'e, yani ANA SAYFAYA gidiyordu)
— yani **etiket hedefiyle de zaten uyumsuzdu**. Hedef korundu, etiket hedefe
uyduruldu: **"DadaFit'e Dön"**. Sitede o ad artık hiç geçmiyor.

Derin çapa (`programlar-merkezi` `#sure`) senin ölçtüğün gibi zaten
`hareket-sureye-gore-v1.html`'e çevrilmiş — dokunmadım.

---

## Kalem 5 · Sayfa altı dipnotları

| Ölçüt | Ölçülen | ✅ |
|---|---|---|
| Dipnot kutusu = içerik kolonu | **34 sayfada ±2 px içinde** (@1440 ve @390) | ✅ |
| @390 taşma | **0** | ✅ |

---

## Kalem 6 (+35) · Avatar dropdown ve footer

F'nin dosya adları geldi, yer tutucu kalktı.

| Ölçüt | Ölçülen | ✅ |
|---|---|---|
| Dropdown'da iki giriş | **65/65** — "Destek" + "Taleplerim" | ✅ |
| `destek-v1.html` h1 | **"Destek"** | ✅ |
| `destek-talepleri-v1.html` h1 | **"Destek Taleplerim"** | ✅ |
| Dropdown'da `destek-talepleri-v1` | tam **1** (ikinci kopya açılmadı, mevcut kalem yeniden adlandırıldı) | ✅ |
| Footer'da `destek-talepleri-v1` | **0** (kalem 35) | ✅ |
| Dropdown'da ölü bağlantı (`href="#"`) | **0** | ✅ |

### Footer "Çözüm Merkezi" — ara turdaki kaldırmayı GERİ ALDIM
Ara bir turda kalem **banttan tamamen çıkarılmıştı** (kurumsal bant 8 → 7).
Senin kararın farklıydı: kalem kalsın, hedefi `destek-v1.html` olsun.
Uyguladım — hem kabukta hem `tests/footer-yapi.mjs`'in `KURUMSAL` dizisinde.

| Ölçüt | Ölçülen | ✅ |
|---|---|---|
| Kurumsal bant | **8/8 kalem dokümanla birebir** (ad · sıra · hedef) | ✅ |
| Footer'da `destek-v1` | **1** | ✅ |
| `tests/footer-yapi.mjs` | **0 sorun** | ✅ |

Böylece üç şart birden kapandı: kalem 35 · 9. tur dokümanının "Çözüm Merkezi
geri plana atılmamalıdır" şartı · bant 8 kalem nöbeti.

---

## Kalem 36 · Prototip uyarısı → misafir giriş bandı

### Geçiş 1 · Kur
- `fit-shell.js` — `<i class="fa-circle-info">` **ve** "Bu sayfadaki veriler
  örnektir…" paragrafı çıkarıldı. `.fp-gate-acts` · `data-lg-only` ·
  `.fp-gate` sarmalayıcısı **korundu**.
- **Sayfa listesi ölçüldü: 13** — F'nin sayısıyla aynı.
  `enerji-defteri-v1` · `-dengele-` · `-haftalik-` · `-su-` (4) ·
  `fit-planim-v1` · `-gecmis-` · `-ilerleme-` · `-kaydettiklerim-` ·
  `-programim-` · `-randevular-` · `-rozetler-` · `-saglik-profil-` ·
  `-veri-izin-` (9).
- Ekran görüntüsü: `tasks/r8-shots/A/m36-gate-g1-1440.png` · `-g1-390.png`

### Geçiş 2 · Kendi işimi eleştir
- **Kusur 1 — 417'şer px ölü krem alan.** Metin kalkınca kutu `.wrap`
  genişliğini (1176 px) koruyordu, içindeki eylem 342 px'ti. Ortalamak
  çözmedi, boşluğu ikiye böldü — senin uyardığın "ortada asılı kalma" tam
  buydu. → Kutu içeriği kadar: `width:max-content`, kendisi ortalanıyor.
  **Ölçülen önce 1176×82.5 (yan boşluk 417/417) → sonra 384.1×82.5 (21/21).**
- **Kusur 2 — @390'da tırtıklı kenar.** İki düğme alt alta ama farklı
  genişlikte (133.2 / 198.9) ve ortalı → kenarları düzensiz.
  → Mobilde ikisi de tam genişlik. **Önce 133.2/198.9 → sonra 328/328.**
- **Kusur 3 — @390'da 2 px basamak.** Tam genişlik yapınca ortaya çıktı: aynı
  genişlikteki iki düğme farklı yükseklikte (birincil 50.5, ikincil 52.5 —
  ghost'un kenarlığı). Yan yanayken bu site geneli desen ve referansla uyumlu
  (dadadiet 50.5/52.5), ama alt alta ve aynı genişlikteyken görünür basamak.
  → Yalnız bu bağlamda eşitlendi. **Önce 50.5/52.5 → sonra 52.5/52.5.**
- Ekran görüntüsü: `m36-gate-g2-*.png` · `m36-gate-g3-*.png`

### Kabul ölçütleri — 13 sayfa × 2 genişlik × 2 oturum durumu
| Ölçüt | Beklenen | Ölçülen | ✅ |
|---|---|---|---|
| "veriler örnektir" | 0 | **0** (dört kırılımın hepsinde) | ✅ |
| info ikonu | 0 | **0** | ✅ |
| "Giriş Yap" | 13/13 | **13/13** | ✅ |
| "Ücretsiz hesap oluştur" | 13/13 | **13/13** | ✅ |
| `data-lg-only` misafir | görünür | **13/13 görünür** | ✅ |
| `data-lg-only` giriş | gizli | **0/13 görünür** | ✅ |
| @390 taşma | 0 | **0** | ✅ |

---

## Sınamalar

**Yeni:** `tests/kabuk-r8.mjs` — K-A + kalem 1·2·3·4·5·6 + **36** · **0 sorun**

**K27 · taban commit `654f353`'te kırmızıya döndüğü kanıtlandı** (worktree
kurup 8814'te koşturuldu, sonra temizlendi):
- İlk koşu: **yedi kalemin yedisi de kırmızı** (K-A ×4 · 1 ×7 · 2 · 3 ×2 ·
  4 ×2 · 5 · 6 ×3)
- §36 eklendikten sonra: **28 sorun**, bunların **8'i §36** ölçütü.

**Mevcut süit — 11/11 · 0 sorun:**
`kabuk-r8` · `footer-yapi` · `footer-curtain` · `header-banner` ·
`kabuk-kalite` · `crumb-home` · `a11y-focus` · `plan-account` · `coach-list` ·
`dropdown-position` · `wizard-page`

### `tests/plan-account.mjs` — iki ölçüt TAŞINDI, zayıflatılmadı
İki sorun veriyordu, ikisi de R8 kararlarıyla çelişiyordu:
1. *"Hesabım'da Planım girişi TEK olmalı"* ← kalem 1 "dropdown'da **0**" diyor.
   → `!==1` **`!==0`** oldu. Eskiden 1 kabul ediliyordu; artık tek kabul edilen
   değer 0. **Ölçüt gevşemedi, sıkılaştı.**
2. *"Destek Taleplerim kalemi yok"* ← kalem 6'da "Taleplerim"e adlandırıldı,
   yanına "Destek" eklendi. → Modül listesinde **bir kalem aranıyordu, artık
   iki** aranıyor.

---

## Bozulmadığını kanıtladıklarım
- **Banner ailesi:** liste **544/607/587** ×54 · detay **560/617/726** ×8 —
  66 sayfa × 3 genişlik, üçüncü değer yok.
- **R11 footer perdesi:** `footer-curtain` **0 sorun** (K-A her bölümün
  yüksekliğini değiştirdiği için perde yeniden ölçüldü).
- **Yasal bant:** `footer-yapi` §10 nöbeti yeşil — altı kalem bayt bayt aynı.
- **Kırıntı ev ikonu (R12):** `crumb-home` **0 sorun**.
- **K34 aktif durum mantığı:** `match` dizisine dokunulmadı, dört modül
  sayfası hâlâ `hareket` kaleminde toplanıyor.
- **Kırık iç bağlantı:** site genelinde **0**.

---

## Lead'e notlar
1. **K-A ölçüt 2'nin üçüncü örneği** (`hareket-merkezi-v1` 4 763 px) artık
   üretilemez — sayfa silindi. İlk iki örnek %0.03 içinde tuttu.
2. **Kalem 1'in referans ölçümü** yukarıda birebir duruyor; K numarasını
   onun üstüne yazabilirsin. Beyar "referansa uy" derse geri alma tek CSS
   kuralı (`.btn-plan{display:none}`) + `ACCOUNT`'a bir satır.
3. `dadafit-kopru-v1.html` benim kalem listemde yoktu; tek satırlık etiket
   düzeltmesi kalem 4'ün "o ad artık yok" şartından geldi. Birleştirmede
   çakışma görürsen haber ver.
