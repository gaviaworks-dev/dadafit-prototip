> **KÜNYE:** bu kütüğü bu turun `AJAN-A-2`'si yazdı. R8'de ad çakışması yüzünden
> **iki** kabuk ajanı aynı ağaçta çalıştı (DEVIR-8 §3 · B25).
> Diğer kütük: `tasks/r8-ilerleme/a.md`

# AJAN-A · KABUK — R8 ilerleme kütüğü

- K-A `--sec-pad` rampası uygulandı (74/74/74/44). Sayfa boyları R7 öngörüsüyle **birebir**: 8737 / 5924 / 4763 @1440. Tam site taraması **0 sorun**, banner aileleri değişmedi.
- Madde 1 — misafirde "Planım" gizlendi (CSS `.btn-plan{display:none}` + `body.is-auth` açıcı), alt bar ve drawer kalemi de oturuma bağlandı, hesap dropdown'ından "Planım" kalemi kaldırıldı.
  - **Referans çelişkisi:** `dadadiet.com` misafirde de "Planım" gösteriyor (ölçüldü). Beyar'ın açık talimatı uygulandı.
  - **Kusur bulundu:** @390 giriş durumunda düğme header'da sızıyordu (özgüllük 0,3,0 vs 0,1,0) — kapatıldı.
- Madde 2 — footer yasal bandındaki `h5.fl-head` kaldırıldı; altı bağlantı aynen duruyor, `nav`'ın `aria-label`'ı korundu.
- Madde 3 — `{group:'Hareketi Anlamak'}` ayracı kaldırıldı; altındaki üç kalem yerinde.
- Madde 4 — `hareket-merkezi-v1.html` silindi. 24 sayfadaki 27 bağlantı kapatıldı, 6 sınama güncellendi. Bölüm kökü `egzersiz-kutuphane-v1.html` oldu; 16 breadcrumb'daki "Hareket" kalemi kaldırıldı (dürüst hedefi kalmadı).
- Madde 5 — `.hr-note.is-center` `max-width:760px` → `none`; kutu içerik kolonuna yayıldı.
- Madde 6 — footer kurumsal bandından "Çözüm Merkezi" kaldırıldı (8→7). Avatar dropdown'ında "Destek" (yer tutucu, F bekleniyor) + "Taleplerim".

## Kendi eleştirim — bulduğum ve düzelttiğim kusurlar

1. **@390 giriş durumunda "Planım" düğmesi header'da sızıyordu.** `body.is-auth .btn-login.btn-plan` (özgüllük 0,3,0) ≤640 medya bloğundaki `.btn-login{display:none}` (0,1,0) kuralını yeniyordu → 65/66 sayfada mobil header'da duruyordu. Medya bloğuna açık kapatma eklendi.
2. **Misafirde alt bardaki FAB 42px sağa kaydı.** Planım kalemi `display:none` olunca bar beş yuvadan dörde indi, `space-around` ortadaki kabarık düğmeyi merkezden kaydırdı. `visibility:hidden` ile yuva ayrıldı → sapma 0 (kardeş marka dadadiet.com'da da 0 ölçüldü).
3. **Yer tutucu "Destek" kalemi ölü `<a href="#">` idi** — menüde tıklanınca sayfa başına zıplıyordu. `<span class="acct-soon" aria-disabled>` + görünür "Yakında" rozetine çevrildi (odak sırasına girmez). AJAN-F `destek-v1.html`'i teslim edince gerçek bağlantıya bağlandı, yer tutucu kalktı.
4. **Destek ikilisi ayar kuyruğuna iliştirilmişti** — "Güvenlik / Dil ve Bölge" grubunun devamı gibi duruyordu. Önüne ayraç konup kendi grubu oldu.

## Kapsam dışı bulgular (dokunmadım)

- **Yasal bantta satır sonu ayracı @390.** `.foot-lawband .sep` kalemler sarınca satır sonunda asılı `|` bırakıyor ("Çerez Politikası |"). Taban commit'te de vardı; bandın görsel yapısı "dokunulmaz" ilan edildiği için ve benim kalemim yalnız başlık olduğu için değiştirmedim.
- **"Hareketi Anlamak" eyebrow'u sayfalarda duruyor.** Ayraç üst menüden kalktı ama `sozluk-v1` / `anatomi-v1` sayfa banner'larında eyebrow olarak hâlâ yazıyor. Sayfa içi — AJAN-B/C'nin alanı.
- **`.dd-group` / `.d-sub-group` / `.fl-head` CSS kuralları artık kullanılmıyor** (kaldırılan markup'ın biçimiydi). Silmedim: `{group:…}` alanı NAV üreticisinde duruyor, başka kalem kullanabilir.
- **Kurumsal bant @390'da 7 kalemle 2 kolona sığıyor, son satır tek kalem kalıyor.** 8 iken çift satır tamdı. Görsel kusur sayılacak kadar belirgin değil; kalem eklenirse kendiliğinden kapanır.

## Sınama durumu (son koşu, localhost:8811)

| Sınama | Sonuç |
|---|---|
| `tests/kabuk-r8.mjs` (YENİ) | ✅ 0 sorun |
| `tools/site-tarama.mjs` 1440/1024/390 | ✅ 0 sorun · banner 544/607/587 ×54 · 560/617/726 ×8 · perde sapması 0 |
| footer-yapi · kabuk-kalite · dropdown-position · header-banner · crumb-home · a11y-focus · hizalama-nobeti · plan-account · anatomi · workout-generator | ✅ hepsi yeşil |

K27: `tests/kabuk-r8.mjs` taban commit `654f353`'te ayrı worktree + geçici sunucuda koşturuldu → **20 sorun (kırmızı)**. Yedi kalemin yedisi de tabanda düşüyor. Worktree kaldırıldı, ana ağaç bozulmadı.

## Çakışma notu

Başka ajanlar benim dosyalarımı düzenlemiş — geri almadım, ikisi de tutarlı:
- `assets/css/fit-shell.css` → `.fp-gate` bloğu (R8 madde 36, AJAN-E)
- `tests/plan-account.mjs` → madde 1 ve 6'ya uyarlanmış nöbet

---

# İKİNCİ TUR — lead'in devrettiği üç kalem

- **Kalem 36 · `.fp-gate`** — paralel ajan JS+CSS'i zaten yapmıştı; bağımsız ölçtüm ve **hizayı düzelttim**: bant sayfanın TEK ortalanmış bloğuydu (diğer blokların sol kenarı 132px, bandınki 548px). Sol eksene alındı → 132px. @390'da zaten tam genişlikti.
- **E'nin üç kuralı** — üçü de `var(--sec-pad-sm)`'e bağlandı; sabit sayı yerine token, bir daha eşiğin altına düşmez.
- **G'nin `tabindex`i** — `[data-fit-tabs]` bileşeninde seçili `role="tabpanel"`e `tabindex="0"`, gizli panellere `-1`; hem açılışta hem sekme değişiminde.
- **Footer "Çözüm Merkezi"** — lead'in kararıyla geri alındı: kalem silinmedi, hedefi `destek-v1.html` (destek hub'ı) oldu. Kurumsal bant 8 kalemde kaldı, `tests/footer-yapi.mjs` §4 başlığı da 8'e döndürüldü.

## Ölçüm — önce/sonra px

| Kural | Önce | Sonra | Etkilenen |
|---|---|---|---|
| `.fit-band-panel` margin-bottom | `26px` sabit | `var(--sec-pad-sm)` = 32/26/26/22 | 5 blok @1440 |
| `.fp-gate` margin-bottom | **yok (0px)** | `var(--sec-pad-sm)` = 32/26/26/22 | 13 sayfa |
| `.fit-band-panel.fp-inflow` margin-bottom | `0` | `var(--sec-pad-sm)` | `enerji-defteri-v1` |
| `.fp-gate` justify-content | `center` (kutu sol kenarı 548px) | `flex-start` (132px) | 13 sayfa |

Yapışıklık taraması: **@1440 19 bulgu → 0** · **@390 10 bulgu → 0**.

## E'nin "−14px binişme" bulgusuna düzeltme
`.fp-inflow`'da binişme YOK. E'nin negatif değeri **reveal animasyonu sırasında** alınmış: `.reveal` blokları `.in` gelene kadar `transform` taşıyor, mid-animation ölçüm sahte binişme üretiyor. Animasyon oturunca gerçek değer **0px** (yapışık, ama binişik değil). Kendi nöbetim animasyonu zorla oturtup ölçüyor.

## Kalem 36 ölçümü (dört kırılım, 65 sayfa gezilerek)
misafir: `.fp-gate` görünür **13** · "veriler örnektir" **0** · info ikonu **0** · Giriş Yap **13/13** · Ücretsiz hesap **13/13** · @390 taşma **0**
giriş: dördü de **0** (`data-lg-only` doğru çalışıyor)
Görünen "Hareket Merkezi" metni: 65 sayfa × 4 kırılım → **0**

## G ölçümü
`[data-fit-tabs]` taşıyan sayfa **14** — panel kipi **1** (`antrenor-detay-v1`), bağlantı kipi **13** (fit-planim rayı, `role="navigation"`, panel yok).
Klavye: sekme şeridinden **Tab ×1 → `div.fit-pane`** (önce `button.btn-fit "Danışan Ol"`e düşüyordu). Sekme değiştirince de aynı. `aria-selected` tam **1**, gizli paneller `tabindex="-1"`.

---

# ÜÇÜNCÜ TUR — ayraç + lead'in cevapsız soruları

## Kalem 20+28 · `.ff-count::before` dikey ayracı
Kabuk kuralı ve @640 karşılığı kaldırılmış (paralel ajan). Kabul ölçütünü taban commit'le karşılaştırarak ölçtüm:

| Ölçüt | Sonuç |
|---|---|
| `::before` computed content | önce `""` → sonra **`none`**, 7/7 sayfa, @1440 ve @390 |
| filtre satırı **içi göreli** y | **12/12 ölçüm AYNI** (`+4/+0/+0/+8/+0` deseni birebir) |
| yatay taşma | 0 → 0 |

**Uyarı:** mutlak y değerleri 5 sayfada kaydı — ayraçtan değil, K-A'nın `--sec-pad` 50→74 rampasından ve üstteki bölümlerin diğer ajanlarca değişmesinden. Mutlak y'ye bakan sahte kusur bulur.

Yedinci sayfa `sozluk-v1`'de `.ff-bar` yok — B filtre satırını yeniden kurmuş, sayaç `.sz-count` (`content:none`). Nöbet ikisini birden arıyor ve seçici boş dönerse kırmızıya dönüyor.

## Lead'in "yapılmadı" iddiasına düzeltme
Dört düzenlemenin dördü de dosyadaydı; lead düzenleme ÖNCESİ satır numaralarına bakmış (1576/1632/1783/2930 → gerçekte 1582/1647/1802/2958+2972). Ölçümle gösterildi.

`32px` yerine `var(--sec-pad-sm)`: computed 32/26/26/22. E'nin eşiği zaten bu token; sabit 32 yazmak @390'da eşiğin 10px üstüne çıkıp mobil ritmi bozardı.

## Kalem 5 · lead'in sorduğu seçici
`document.querySelectorAll('.hr-note')` — 35 sayfa, 38 görünür kutu, 2 gizli (kapalı sekme içinde).
Kolon **`n.parentElement`'in içerik kutusu** (genişlik − yatay dolgu). `closest('.wrap')` YANLIŞ: iki kolonlu düzenlerde 5 sahte kusur veriyor.
Ölçüt `|kutu − kolon| ≤ 2px` → **@1440 ve @390'da 35/35 temiz**.

## Nöbet
`tests/kabuk-r8.mjs` on bir kalem tutuyor (K-A · 1 · 2 · 3 · 4 · 5 · 6 · 20+28 · 36 · E · G).

---

# KAPANIŞ

Lead bloğu kapattı. On bir kalem yeşil, süit ve tam site taraması temiz.

**Taban `654f353` koşusu (K27):** `tests/kabuk-r8.mjs` → **31 sorun**. On bir kalemin on biri de tabanda düşüyor (`20+28` ×2 · `36` ×4 · `E` ×2 · `G` ×2 dahil). Worktree kaldırıldı, ana ağaç temiz.

**Düzeltme:** ayracı lead kaldırmış (benim "paralel ajan" varsayımım yanlıştı). Ölçüm sonucu değişmiyor.

**Lead'in K'ya yazacağı iki kural bu bloktan çıktı:**
1. Eşiğe göre düzeltme yapılırken eşiğin kendisi token'sa, sabit sayı değil **token bağlanır**.
2. Ölçüm aracının kusuru ölçülenin kusuru sanılmasın — bu turda beş örneği çıktı; `.reveal` animasyonu ve K-A rampasının kaydırdığı mutlak y değerleri iki tuzak.

Sırada bende iş yok. Commit/push/birleştirme lead'de.
