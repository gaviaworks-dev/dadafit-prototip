# DEVİR NOTU — REVİZYON-11 (Beyar turu)

**Yazıldı:** 2026-08-24
**Bu notu okuyan sıfır bağlamlı oturum işe kaldığı yerden devam edebilir.**

---

## 1 · Proje kimliği

| | |
|---|---|
| Repo | `github.com/gaviaworks-dev/dadafit-prototip` |
| Branch | `main` |
| Yayın | https://gaviaworks-dev.github.io/dadafit-prototip/ (GitHub Pages, `main`'den) |
| Yapı | Statik prototip — build yok, `node_modules` yok, 66 adet `*-v1.html` |
| Ortak kabuk | `assets/css/fit-shell.css` · `assets/js/fit-shell.js` (header/footer/drawer/banner/bileşenler) |
| Kütük | `tasks/REVIZYON-11.md` — her maddede Beyar'ın cümlesi birebir + kanıt satırı |
| Karar kütüğü | `KARARLAR.md` (K1…K44) · denetim protokolü `DENETIM.md` |

### Yerel sunucu

Nöbetlerin ve QA sondalarının **hepsi** hazır bir HTTP sunucusu bekler
(kendi sunucularını AÇMAZLAR — bu daha önce yanlış teşhis edildi, bkz. §7).

```bash
cd /Users/gaviaworks/Developer/Projects/dadafit-prototip
python3 -m http.server 8788 --bind 127.0.0.1 &
# → http://127.0.0.1:8788/
```

**Port 8899 KULLANILMAZ** — Beyar'ın kendi DadaGastro sunucusu orada.

### Playwright

Depoda `node_modules` yok. Çözücü `tests/_pw.mjs` sırayla arar; bu makinede
kurulum `~/.pw` altında:

```bash
export PW_HOME=~/.pw        # her komutta gerekli
PW_HOME=~/.pw node tests/<nöbet>.mjs http://127.0.0.1:8788
```

### Push

```
gh hesabı: gaviaworks-dev  (aktif olmalı)
```
`By4r` hesabı aktifken push **403** verir. `gh auth status` ile doğrula.

---

## 2 · Bitmiş iş — REVİZYON-11

**22 madde kapandı, açık madde yok.** Ayrıntı + kanıt satırları
`tasks/REVIZYON-11.md` içinde; aşağısı özet.

### Commit'ler (hepsi `main`'de ve yayında)

| Hash | Kapsam |
|---|---|
| `0d4e852` | M1–M20 · dikiş, parallax, sayfalama, profil, denetçi (23 dosya, +1227/−246) |
| `56f01f2` | M21 · Görüş Bildir Gastro ölçüsüne çekildi + sağ şerit eklendi |
| `b5d1ac5` | M22 · sıfır alanlı blok dikiş komşuluğunu kesmesin (hero düzeltmesi) |

Taban: `24a8dd9` (docs(DEVIR-10): sonraki oturum bölümü)

### Maddeler

| # | İş | Nerede |
|---|---|---|
| M1 | Banner → beyaz panel dikişi (üst köşeler yuvarlak) | kabuk CSS+JS |
| M2 | Ana sayfa "Antrenmanına uygun tarif" → parallax band | kabuk + hub |
| M3 | Hub'da 4 görselli antrenör kartı | kabuk + hub |
| M4 | Footer "Yakında" → "İndir" | kabuk JS |
| M5 | Bilgi kutularında metin kutuyu doldurur (38 sayfa) | kabuk CSS |
| M6 | Sayfalama `« ‹ 1 2 3 … N › »` + özet satırı | kabuk + egzersiz-kutuphane |
| M7 | Marka etiketi: Dada kalın + marka ince + kendi rengi (24 etiket / 8 sayfa) | kabuk + 8 sayfa |
| M8 | Banner sayaçlarına ayraç (26 sayfa) | kabuk CSS |
| M9 | Sözlükte "terim sayfası" sağ altta minimal metin bağlantısı | sozluk-v1 |
| M10 | Sözlük detayda iki gezinme butonu kaldırıldı | sozluk-detay-v1 |
| M11 | Oluşturucu sonucu: bağlantı kutusu kalktı, butonlar ortalandı | antrenman-olusturucu-v1 |
| M12 | Fit Testleri etiketleri tek satır + kaydırmalı | fit-testleri-v1 |
| M13 | Fit Testi Detay: ızgara hatası + `<legend>` tuzağı + dikey ritim | fit-testi-detay-v1 |
| M14 | **UI/UX denetçisi** (Playwright'la ölçen) | `tests/uiux-denetim.mjs` + skill |
| M15 | Hesap dropdown'ı başlıksız (DadaDiet kalıbı) | kabuk JS |
| M16 | Tarif bandı: gerçek tarif kartları + düz etiket + Gastro rengi | hub |
| M17 | Plan sayfaları → DadaGastro şef profili kalıbı (14 sayfa) | kabuk CSS+JS |
| M18 | Antrenör profilinde sekmeler ortalandı | antrenor-detay-v1 |
| M19 | Görüş Bildir banner merkezine hizalı | kabuk CSS+JS |
| M20 | Görüş Bildir dikey şerit biçimi | kabuk CSS |
| M21 | Görüş Bildir **Gastro ölçüsüne çekildi** + `.fb-rail` eklendi | kabuk CSS+JS |
| M22 | Sıfır alanlı blok dikiş komşuluğunu kesmesin | kabuk JS |

### Kabuğa eklenen 9 ortak bileşen

`assets/css/fit-shell.css` içinde başlıklarıyla aranabilir:

1. `BANNER → GÖVDE DİKİŞİ` — `.fit-seam` · `.fit-seam.is-onbanner` · `--seam-r:22px`
2. `PARALLAX BAND` — `.px-band` · `.px-clip` · `.px-media` · `.px-veil` (opt-in: `data-fit-px`)
3. `MARKA ETİKETİ` — `.brand-tag` · `.bt-gastro/diet/fit/gourmet/campus`
4. `SAYFALAMA` — `.pagi` · `.pg` · `.pg-dots` · `.pagi-note`
5. `ANTRENÖR KARTI` — `.coach-card` ailesi (antrenorler-v1'den taşındı)
6. `PLAN PROFİL BAŞLIĞI` — `.fp-profil` · `.fp-kapak` · `.fp-kimlik` · `.fp-sayac`
7. `BİLGİ KUTULARINDA METİN KUTUYU DOLDURUR` — `.hr-note p`
8. `BANNER SAYAÇLARINDA AYRAÇ`
9. `GÖRÜŞ BİLDİR — ŞERİT + DÜĞME` — `.fb-rail` · `.feedback-tab`

`assets/js/fit-shell.js` karşılıkları (aynı başlıklar):
`BANNER → GÖVDE DİKİŞİ` · `PARALLAX BAND` · `SAYFALAMA MOTORU` (`FIT_PAGI`) ·
`PLAN PROFİL BAŞLIĞI` · `GÖRÜŞ BİLDİR ŞERİDİNİ BANNER MERKEZİNE HİZALA` ·
`PLAN KABUĞU · dikişi rayın dibine çek`

---

## 3 · Son durum ölçümleri (somut sayılar)

Hepsi yerel sunucuya karşı ölçüldü; scriptleri `docs/qa/` altında (§6).

| Ölçüm | Değer | Script |
|---|---|---|
| Dikiş taşıyan sayfa | **50/66** (@1440 ve @390 aynı) | `docs/qa/dikis-olcum.mjs` |
| Bunun binen (`is-onbanner`) kısmı | **42** | aynı |
| Ray/yüzen panel altında kalan | **8** | aynı |
| Dikişsiz | **16** (§5'te neden doğru olduğu) | aynı |
| Hub gövdesi (M22 sonrası) | `y 1000 → 978` · `margin-top -22px` · `radius 22px` | `docs/qa/dikis-olcum.mjs` |
| Banner→dikiş mesafesi, plan sayfaları | `~340px → 75px` (75 = yapışkan rayın yüksekliği) | `docs/qa/dikis-mesafe.mjs` |
| Parallax görsel sabitliği | scroll'da **0px** kaydı, band **500px** aktı | `docs/qa/parallax-olcum.mjs` |
| Görüş Bildir düğmesi | **52×144** · 13px/700 · `text-transform none` · ls .52px · radius sol 16px · z 72 | `docs/qa/gorus-serit-olcum.mjs` |
| `.fb-rail` şerit | **8×1000** · right 0 · top 0 · z 71 | aynı |
| Şerit ↔ banner merkezi sapması | **0px** (3 farklı banner tipinde) | aynı |
| Marka etiketi | **24** (8 sayfa × 3) · adı görünmeyen **0** · Dada 800 / marka 400 | `docs/qa/marka-etiketi-olcum.mjs` |
| Sayfalama | 25 hareket · 12/sayfa · **3 sayfa** · düğmeler **44×44** | `docs/qa/sayfalama-olcum.mjs` |
| Fit testi etiket şeridi | çok satırlı **0** · kart yükseklikleri tek değer (359 @1440) | `docs/qa/etiket-seridi-olcum.mjs` |
| Tarif bandı | tarif kartı **3** · yemek görseli 3/3 · **Fit yeşili 0** | `docs/qa/tarif-bandi-olcum.mjs` |
| Plan profili | kapak **1176×280 · 24px · parallax var** · avatar **128×128** · binme **−78px** | `docs/qa/plan-profili-olcum.mjs` |
| Hub antrenör kartı | **4** kart · kolon 4/2/1 · yükseklik tek değer 435 | `docs/qa/hub-antrenor-olcum.mjs` |
| Bilgi kutusu metin/kutu | **%58 → %93** (anatomi `.hr-note`) | `docs/qa/info-kutusu-olcum.mjs` |
| Banner ayracı | **26** sayfa (390/1024/1440) | `docs/qa/banner-ayrac-olcum.mjs` |
| Footer mağaza | görünen "Yakında" **0** · "İndir" **132** (2×66) | `docs/qa/footer-magaza-olcum.mjs` |
| Dropdown | grup başlığı **3 → 0** · ayraç 4 · bağlantı **11** (değişmedi) | `docs/qa/dropdown-olcum.mjs` |

### Referansla birebirlik (kardeş markalardan ölçülen)

| Ne | Referans | DadaFit |
|---|---|---|
| Dikiş | `dadagastro.com` `.lst-sec` → `22px 22px 0 0` · `margin-top:-22px` · `0 -12px 32px rgba(20,16,10,.18)` | birebir |
| Banner ayracı | `.lst-stats` → `padding-left:38px` + `border-left:1px solid rgba(255,255,255,.18)` (gap 44px) | birebir |
| Sayfalama | `.pagi/.pg` → 44×44 · 14px/700 · `radius-md` · `.pagi-note` 12.5px | birebir (renk Fit'e çevrildi) |
| Sözlük bağlantısı | `mutfak-ansiklopedisi` `.ans-dgo` → 13px/700, zeminsiz, sağa dayalı (sapma 0) | birebir |
| Görüş Bildir | `dadagastro.com` `.feedback-tab` 52×144 + `.fb-rail` 8px | birebir (renk Fit) |
| Plan profili | `sefler/admin` `.pf-top` → kapak 280/24px · avatar 128 · stats 16px | birebir |
| Parallax | `parallax-S2t5vFDm.css` → `clip-path` + `position:fixed` görsel | birebir |

---

## 4 · Nöbetçi kontroller

**Çalıştırma:** `PW_HOME=~/.pw node tests/<ad>.mjs http://127.0.0.1:8788`
Sunucu ayakta olmalı. Çoğu 1–3 dk sürer; `workout-generator` **10 dk+**
sürebiliyor (zaman aşımına dikkat).

| Nöbet | Ne kontrol ediyor | Son durum |
|---|---|---|
| `header-banner.mjs` | Koyu banner sayfalarında header şeffaf başlıyor mu, scroll'da katıya geçiyor mu; banner taşımayanlarda katı kalıyor mu. **19 sayfa × 4 genişlik** | **0 sorun** |
| `hizalama-nobeti.mjs` | `.jt` / `.jt-flow` yaslama ve dolgu tutarlılığı (134 örnek) | **0 sorun** |
| `crumb-home.mjs` | Kırıntının ana sayfa ikonu 9px, ayraçla eşit optik ağırlık (65 sayfa × 2 genişlik) | **0 sorun** |
| `footer-yapi.mjs` | Footer beş alan · üç sütun · kurumsal bant 8 kalem · mağaza kutuları bağlantı DEĞİL · yasal bant dokunulmamış | **0 sorun** |
| `plan-account.mjs` | Hesap menüsü **11 kalem**, adlar ve sıra belgeyle birebir; Bildirimler menüde 0; raydan inen 4 sayfa yetim değil; kırık hedef yok | **0 sorun** |
| `plan-kayit.mjs` | Girişsiz kullanıcı akışı: plan üretiliyor, kaydet dürüst kapıyı açıyor, sessiz kayıt yok, `?plan=` kalıcılığı duruyor | **0 sorun** |
| `kabuk-kalite.mjs` | Kart üstünde PRO rozeti 0, "140+" 0, `.btn-fit` kontrast AA | **0 sorun** |
| `egzersiz-katalog.mjs` | Filtre motoru: sayaç = veri sayısı; görünen kart ilk sayfayla (≤12) sınırlı | **0 sorun** |
| `sozluk-kapalilik.mjs` | Sözlük verisi kapalılığı, arama eşiği, 22 terimin detayı dolu | **0 sorun** |
| `fit-test-lock.mjs` | Fit test kilit akışı | **0 sorun** |
| `enerji-hesap.mjs` | Enerji denklemi, `?parametre` geri kurulumu, 9 iç bağlantı 200 | **0 sorun** |
| `uiux-denetim.mjs` | **YENİ** — 8 başlıkta ölçen UI/UX denetçisi (§8) | araç, nöbet değil |

**Bu turda beklentisi güncellenen 5 nöbet.** Hepsinde ASIL garanti korundu,
yalnız ölçüm noktası taşındı — yani bir şey sessizce kaybolursa yine kırmızı
yanar:

| Nöbet | Eski beklenti | Yeni beklenti | Neden |
|---|---|---|---|
| `footer-yapi` | görünür "Yakında" yazısı | `title="Yakında"` + grup `aria-label` | M4 |
| `plan-account` | TAM 3 grup başlığı | grup başlığı 0 + ayraç ≥3 + açıklama 0 | M15 |
| `plan-kayit` | `#wgUrl` kutusunda `?plan=` | adres çubuğunda `?plan=` + kutu YOK | M11 |
| `egzersiz-katalog` | görünen kart = veri sayısı | sayaç = veri, görünen ≤ 12 | M6 |
| `header-banner` | `fit-planim` + `enerji-defteri` BANNER listesinde | PLAIN listesinde | M17 |

---

## 5 · Dikişsiz kalan 16 sayfa — neden doğru

Dikiş (`.fit-seam`) **koyu banner ile beyaz gövde arasındaki kenarı**
yumuşatmak için var. Koyu kenar yoksa dikilecek bir şey de yoktur.

**14 plan sayfası** — `fit-planim-*` (9) · `enerji-defteri-*` (4) ·
`fit-test-sonuclarim` (1):
M17'de bu sayfaların koyu `.lib-top.fp-top` banner'ı **beyaz profil
başlığına** (`.fp-profil` — yuvarlak kapak + üstüne binen kimlik kartı)
çevrildi. Artık koyu banner yok → dikiş yok. Kapak zaten kendi `24px`
yarıçapını taşıyor.

**`giris-v1.html`** — `.au-top` banner'ının ALTINDA gövde bandı yok; giriş
formu banner'ın İÇİNDE. Dikilecek kenar yok.

**`profil-v1.html`** — koyu banner hiç yok; `.pf-top` beyaz profil kapağı
(KARARLAR K23: *"beyaz profil kapağı, koyu banner ailesiyle aynı dil değil,
sosyal profil deseni"*).

**Doğrulama:** `PW_HOME=~/.pw node docs/qa/dikis-olcum.mjs`
→ `dikiş 50/66 · binen 42 · ray-altı 8` ve "yok" listesi tam bu 16 sayfa
olmalı. Liste değişirse bir şey bozulmuş demektir.

---

## 6 · QA sondaları — `docs/qa/`

Scratchpad'den taşınan, **yeniden koşulabilir** ölçüm scriptleri.
Hepsi `tests/_pw.mjs` çözücüsünü kullanır ve `BASE` ortam değişkeni alır:

```bash
PW_HOME=~/.pw node docs/qa/<script>.mjs
PW_HOME=~/.pw BASE=https://gaviaworks-dev.github.io/dadafit-prototip node docs/qa/<script>.mjs
```

| Script | Ölçtüğü |
|---|---|
| `dikis-olcum.mjs` | 66 sayfada dikiş var mı, binen kaç, dikişsiz hangileri (2 genişlik) |
| `dikis-mesafe.mjs` | Banner alt kenarı → dikiş üst kenarı mesafesi (px) |
| `parallax-olcum.mjs` | Parallax gerçek mi: görsel scroll'da 0px kayıyor mu |
| `gorus-serit-olcum.mjs` | Görüş Bildir düğme ölçüsü + `.fb-rail` + banner merkezine sapma |
| `marka-etiketi-olcum.mjs` | 66 sayfada marka etiketi sayısı, **adın görünürlüğü**, ağırlık/renk |
| `sayfalama-olcum.mjs` | Sayfa 1/2/son gezinmesi, `«`/`»`, özet satırı, dokunma hedefi |
| `etiket-seridi-olcum.mjs` | Fit testi etiketleri tek satır mı, kaydırılabilir mi, kart yüksekliği |
| `tarif-bandi-olcum.mjs` | Tarif kartı sayısı, yemek görseli, bölümde Fit yeşili kaldı mı |
| `plan-profili-olcum.mjs` | Plan profil başlığı ölçüleri + over-mode + marka yazısı rengi |
| `hub-antrenor-olcum.mjs` | Hub'daki 4 antrenör kartı, kolon, hedefler, taşma |
| `antrenor-kart-geometri.mjs` | `antrenorler-v1` kart geometrisi (CSS taşımadan önce/sonra kıyas için) |
| `profil-geometri.mjs` | `profil-v1` `.pf-*` geometrisi |
| `info-kutusu-olcum.mjs` | `.hr-note` metin/kutu oranı ve karakter/satır |
| `banner-ayrac-olcum.mjs` | Ayraçlı sayaç kolonu kaç sayfada (3 genişlik) |
| `footer-magaza-olcum.mjs` | 66 sayfada "Yakında"/"İndir" sayısı, `.ap-soon` |
| `dropdown-olcum.mjs` | Hesap menüsü: başlık/ayraç/bağlantı/açıklama sayısı |
| `yayin-dogrula.mjs` | **Yayındaki** sürüm güncel mi (push sonrası döngüyle bekler) |
| `ref-profil-kiyas.mjs` | Gastro şef profili ↔ DadaFit profil-v1 yan yana ölçüm |
| `ref-gastro-serit.mjs` | Gastro'nun Görüş Bildir düğmesi + şeridi (canlıdan) |

> **Not:** `antrenor-kart-geometri.mjs` ve `profil-geometri.mjs` "önce/sonra"
> kıyası içindi; CSS taşınırken geometri bozulmadığını kanıtladılar. Benzer
> bir taşıma yapılacaksa aynı kalıp kullanılmalı: **taşımadan önce ölç,
> taşıdıktan sonra ölç, birebir aynı olmalı.**

---

## 7 · Açık işler ve bilinen riskler

### Açık iş yok — ama karara bağlanmamış üç konu var

1. **Gastro bağlantıları prototipe gidiyor.** Depo genelinde **38 bağlantı**
   `by4r.github.io/dadamutfak-view/v7-6cu356/…` prototipine gidiyor, canlı
   `dadagastro.com`'a değil. İkisi de HTTP 200. M2'de "Tümünü Gör" depo
   kalıbına uyduruldu. Beyar'a soruldu, **cevap gelmedi**. Tümü canlıya
   çevrilecekse ayrı madde açılmalı.

2. **"Planın bağlantısı paylaşılabilir" çipi.** M11'de kopyalama kutusu
   kaldırıldı ama `antrenman-olusturucu-v1` banner'ındaki bu çip ve motor
   açıklamasındaki aynı cümle **duruyor**. İddia teknik olarak doğru (adres
   çubuğu `?plan=` taşıyor) ama artık kopyalama düğmesi yok. Beyar'a
   bildirildi, "istersen o da kalkar" denildi, **cevap gelmedi**.

3. **`.fp-sayac` kullanılmıyor.** M17'de plan profili için sayaç şeridi CSS'i
   yazıldı (Gastro'da 5 kutu var) ama **işaretlemede kullanılmadı** — DadaFit
   plan sayfalarında uydurmadan gösterilecek sayı yok. Gerçek veri
   (`FIT_PLAN.ozet()`) bağlanacaksa CSS hazır.

### Riskler

- **Kabuk 66 sayfayı etkiliyor.** `fit-shell.css`/`fit-shell.js`'e yazılan her
  kural geneldir. Bu turda kabuğa **9 bileşen** eklendi; hepsinin gerekçesi
  dosyada yorumda yazılı. Yeni kural eklerken mevcut kuralları değiştirme,
  dosya sonuna ekle (kaynak sırası kazanır) ve gerekçeyi yaz.
- **Ölü kurallar bilerek bırakıldı.** `.sz-back` · `.ap-soon` · `.df-combo-*`
  · `.lib-more` artık işaretlemede yok ama CSS'leri duruyor, "ÖLÜ KURAL"
  yorumuyla işaretli. Silme; kütüğe yaz (kabuk sözleşmesi).
- **`workout-generator.mjs` nöbeti 10 dk+ sürüyor** — zaman aşımına takılıyor.
  Koşulacaksa ayrı ve uzun timeout ile.
- **`--measure` token'ı bilerek devrildi.** M5'te `.hr-note p{max-width}`
  kaldırıldı; satır uzunluğu 99 → 148 karaktere çıktı. Bu Beyar'ın üç kez
  tekrarladığı karar. Kardeş marka bunu YAPMIYOR (%59'da tutuyor). Geri
  alınmak istenirse kabuktaki "BİLGİ KUTULARINDA METİN KUTUYU DOLDURUR"
  bloğunu silmek yeter.
- **Ekran görüntüleri scratchpad'de kaldı** (oturum dizini, kalıcı değil).
  Gerekirse `docs/qa` sondaları yeniden üretir.

---

## 8 · Yeni araç: UI/UX denetçisi

```bash
PW_HOME=~/.pw node tests/uiux-denetim.mjs <sayfa.html> [kapsam-seçicisi]
```
Skill: `.claude/skills/uiux-denetim/SKILL.md` (`/uiux-denetim` ile çağrılır)

**Sekiz başlık, her eşiğin kaynağı yazılı:** yatay taşma · dokunma hedefi
(WCAG 2.5.8 / 2.5.5) · kontrast (WCAG 1.4.3) · satır uzunluğu
(Bringhurst/Butterick) · metin/kap genişliği · başlık hiyerarşisi · dikey
ritim (4px ızgara + `<legend>` tuzağı) · görünürlük.

Varsayılan kapsam `main.page-main` (kabuk hariç). Kabuğu denetlemek için
kapsamı `"body"` ver.

**SKILL.md'de yazılı bilinen körlükler — önce onları oku.**

---

## 9 · Öğrenilen dersler

Ayrıntısı `docs/lessons.md` içinde. Bu turun en pahalı üçü:

1. **`getClientRects()` sıfır alanlı elemanda 1 döner** — "görünür" sanılır.
   (`docs/lessons.md` §1 · M22'nin kök nedeni)
2. **Sonda önce şüphelidir.** Bu turda sondanın kendi körlüğü **üç kez**
   yakalandı: sahte kontrast hataları (16'nın 11'i), sahte dokunma hedefi
   bulguları (45 tane), ve "etiket görünüyor" derken ekranda yalnız ikon olması.
3. **Yayına bakıp yerelde ölçme.** Beyar defalarca yayındaki eski sürüme baktı,
   ben yerelde ölçüyordum. Ölçüm hangi adrese karşı koşuluyor, **söyle**.

---

## 10 · Aktif agent'lar

**Yok.** Bu turda hiç subagent/workflow çalıştırılmadı; bütün iş tek oturumda
yapıldı. Devralan oturumun bekleyeceği arka plan işi yok.

Çalışır durumda bırakılan tek şey: **yerel HTTP sunucusu** (`python3 -m
http.server 8788`). Oturum kapanınca düşebilir; §1'deki komutla tekrar kalkar.

---

## 11 · Çalışma ağacı durumu

Son commit `b5d1ac5` **push edildi**. Ondan sonra eklenenler
(**commit EDİLMEDİ**, Beyar öyle istedi):

- `tasks/handoff.md` (bu dosya)
- `docs/lessons.md`
- `docs/qa/*.mjs` (19 sonda)

`git status` ile doğrula; commit kararı Beyar'ın.


---
---

# DEVİR NOTU — REVİZYON-12 (Beyar turu, 2026-08-24)

**Özet:** 35 revizyon maddesi toplandı, **34'ü kapandı ve canlıda doğrulandı**.
44 commit, hepsi `main`'de ve yayında. Working tree temiz (yalnız dokümantasyon).
Nöbetçi kontroller **11/11 · 0 sorun**. Yerel ve canlı ölçümler birebir örtüşüyor.

---

## 1 · Ekip durumu

**Hepsi kapatıldı — yeniden açma.** Bu turda 16 ajan çalıştı; devir bilgileri
commit mesajlarında ve `tasks/REVIZYON-12.md` madde kayıtlarında.

| Ajan | İş | Durum |
|---|---|---|
| `kabuk-12` · `kabuk-12b` | kabuk CSS/JS (R1·R3a·R11·R32·R34) | kapandı |
| `sozluk-12` · `program-detay-12` · `fit-testleri-12` · `fit-testleri-12b` | R2·R3b·R4·R5·R16·R17 | kapandı |
| `test-detay-12` · `akordeon-12b` | R6·R7·R8·R9·R28·R29 | kapandı |
| `antrenorler-12` · `antrenorler-12b` | R10·R18 | kapandı |
| `enerji-defteri-12` · `enerji-zemin-12` | R12·R23·R24·R25 | kapandı |
| `hesabim-12` · `profil-kalibi-12` | R13·R19·R20·R21·R22 | kapandı |
| `gecmis-12` · `hub-12` · `video-12` · `seans-detay-12` · `justify-12` | R15·R26·R27·R30·R31·R33·R35 | kapandı |
| `ref-diet` | DadaDiet referans ölçümü (giriş yapıp ölçtü, çıkış yaptı) | kapandı |
| `olcum-1…olcum-6` | bağımsız ölçüm (builder'lardan ayrı) | kapandı |

**İki ajan API hatasıyla düştü** (`olcum-3`, `akordeon-12`); ikisi de yeniden açıldı,
`akordeon-12`'nin yarım işi doğrulanıp tamamlandı — veri kaybı yok.

---

## 2 · Kapananlar (35 madde)

| # | İş | Commit |
|---|---|---|
| R1·R3a | `.fit-seam` gölgesi tümüyle kalktı (50 sayfa) | `9851efe` |
| R11 | Dropdown'a "Aboneliğim ve Ödemelerim" (11→12 kalem) | `7d830de` |
| — | `.fit-tabs.is-center` opt-in hazırlığı | `f9ac8d7` |
| R2 | Sözlük: alıntı↔terim bağlantısı 32→16px | `51bb5af` |
| R3b | Sözlük: gövde zemini panelle birleşti | `20edf5c` |
| R4 | Program Detay: durum paneli tek panele girdi | `b856766` |
| R5 | Fit Testleri: çip rayı hizalandı (sapma 21→0px) | `b95864c` |
| R6 | Test Detay: sağ panel kendi sütununa oturdu | `c631510` |
| R7 | Test Detay: `<small>` içi vurgular inline oldu | `cfef58a` |
| R8 | Test Detay: 1. soru nefesi 6→22px | `fe8c3d9` |
| R9 | (R6'nın sonucu olarak kendiliğinden kapandı) | — |
| R10 | Antrenörler: bilgi şeridi üstü 0→46px | `9268700` |
| R13 | Hesabım: düz banner → profil başlığı | `29a9b72` |
| R15 | Aktivite Kayıtlarım: sekme ortalama + ritim | `68aebd1` `0658a3d` |
| — | `header-banner` nöbeti 3 sayfa daha kapsıyor | `a6ecc1a` |
| R12 | Enerji Defteri: iki sekme rayı teke indi | `4abd837` `9ef5625` |
| R16 | Fit Testleri: metin iki sütuna bölünmüyor | `6e2cda5` |
| R17 | Fit Testleri: çip↔ayraç 0→16px | `ba84f81` |
| R18 | Antrenörler: sayfalama kabuk `.pagi`'ye | `8797ec2` |
| R19·R20·R21 | Profil kalıbı: kapak 280→240, zemin gri, meta görünür | `7dc9042` |
| R22 | Hesabım: fotoğraf kontrolleri karta taşındı (opt-in) | `a0a1503` `9814062` |
| R23·R24·R25 | Enerji Defteri: zemin/boşluk/bölüm araları | `114371c` `4249b4b` |
| R26 | Ana sayfa: hero tam ekran | `33da546` |
| R27 | Ana sayfa: tarif kartları opak beyaz | `71f2ba6` `dadac5f` |
| R28 | Yeni Başlayanlar: akordeon soft ayracı | `69ea772` |
| R29 | Test Detay: tek bölüm açık kalıyor | `1339368` |
| R30·R31 | Video Seansları: çip boşluğu, "+N", kart yüksekliği | `20eb785` `0ac40d5` `3753ddb` |
| R32 | Topbar: dil ayracı 18/4 → 16/16 | `b80422d` |
| R33 | Seans Detay: sayaç hizası (kırık HTML yorumu) | `4f7e5bc` |
| R34 | Plan sekme rayı 14 sayfada ortalandı | `24e18f7` |
| R35 | Yeni Başlayanlar: giriş metni `.jt-flow` ile yaslı | `174db5a` |

**Kararlar:** `KARARLAR.md` **K67** (dikiş gölgesi kalktı, Gastro'dan sapma) ·
**K68** (kapak 240px, DadaDiet paritesi) · **K69** (plan sekme rayı ortalandı,
DadaDiet sola dayalı olduğu hâlde bilinçli sapma).

---

## 3 · AÇIK / SONRAKİ ADIM

1. **R14 — `destek-v1` + `pro-v1` profil kalıbı** · **Beyar kararı bekliyor.**
   Uygulanmadı: iki sayfada da kapak görseli yok (`--lib-img:none`) ve gösterilecek
   kişisel kimlik verisi yok; `.fp-profil` bir kimlik kartı olduğu için uydurma
   avatar/kapak gerekirdi. **Alternatif:** kapak görseli verip düz bannerı kırmak.
2. **R35 · justify satır uzunluğu** · @1024'te bir satırda kelime arası **1.68×**
   (eşik 1.5×). Kök neden justify değil, **82–86 karakterlik satır** — R11/M5'te
   `--measure` bilinçli devrilmişti. Üç seçenek: böyle bırak / @1024'te justify'ı
   kapat / metni daralt (M5 kararını geri alır).
3. **`?sayfa=N` derin bağlantısı** · R18'de sayfalama kabuk `.pagi`'ye taşınırken
   kalktı; `FIT_PAGI` desteklemiyor, Egzersiz Kütüphanesi'nde de yok. İstenirse
   tüm `.pagi` kullanıcılarına birden eklenir.
4. **Zebra deseni** · Beyar `fit-planim-gecmis`'te "zebra var" dedi, ölçüm bulamadı
   (hiç `nth-child`/alternatif zemin kuralı yok, satırlar şeffaf). Hangi ekran
   kastedildiği netleşmeli.
5. **`#uyelik`/`#odeme` çapa gecikmesi** · `#hsRail` aktif sekme vurgusu ilk
   yüklemede geç güncelleniyor (scrollspy zamanlaması, bu turun regresyonu değil).

---

## 4 · Bu turda değişen taban değerler

| Ölçüm | Eski | **Yeni** |
|---|---|---|
| Dikiş envanteri | 50/66 · binen 42 · ray-altı 8 · dikişsiz 16 | **49/66 · binen 42 · ray-altı 7 · dikişsiz 17** |
| Dikişsiz listeye yeni giren | — | **`hesabim-v1`** (R13'te koyu bannerını kaybetti) |
| Hesap menüsü | 11 kalem | **12 kalem** |
| `header-banner` kapsamı | 19 sayfa | **22 sayfa** (`hesabim` PLAIN · `destek`/`pro` BANNER) |
| Plan profili kapağı | 280px (Gastro) | **240px** (DadaDiet) |
| Plan sekme rayı | 1 sayfa ortalı, 13 sola dayalı | **14/14 ortalı** |

`docs/qa/` sondaları bu değerlere göre güncel; `tests/` nöbetleri yeşil.

---

## 5 · Dersler (bu turun kısa listesi)

1. **Paralel builder'lar tek git index'i paylaşır.** İki kez commit'ler karıştı;
   çözüm `git commit -- <dosya>` pathspec'i + `git show --stat HEAD` doğrulaması.
   `git add -A` bu ortamda felaket. (Ayrıntı `docs/lessons.md`, memory'ye de yazıldı.)
2. **Joker seçici = kör ölçüm.** `[class*="pag"]` → `page-main`,
   `[class*="banner"]` → cookie-banner, `[class*="ava"]` → 0×0 `acct-ava`.
   Bu turda **en az beş kez** yaşandı. Kesin seçici kullan.
3. **Kullanıcının gördüğü şey her zaman gerçektir, ama nedeni tahmin edilemez.**
   R22'de "bozuk konum" tarayıcı önbelleğiydi (deneyle kanıtlandı: konumlama
   kuralı kaldırılınca 3140px² çakışma). R33'te "patlamış" dediği sayfada gerçekten
   kırık HTML yorumu ekranda hayalet metin olarak duruyordu — benim ilk taramam
   (JS hatası + taşma) bunu yakalayamadı.
4. **Referans doğrulanmadan uygulanmaz.** R15'te "diet'teki gibi merkezi olsun"
   dendi; ölçüm DadaDiet'in de sola dayalı olduğunu gösterdi. R12'de "referans tek
   zeminde akıyor" denip beyaza çevrildi, oysa referansın tek zemini **gri**ydi —
   R23'te geri alındı.
5. **Kapsamı dar tutmak tutarsızlık üretir.** R15'te ortalama tek sayfaya
   uygulandı; sonuç 1 ortalı + 13 sola dayalı oldu ve R34 olarak geri döndü.
   Ortak bileşende karar verilirken kapsam baştan konuşulmalı.
6. **Depoda zaten test edilmiş mekanizma olabilir.** R35'te ham `text-align:justify`
   `hizalama-nobeti`'ni kırmızıya çeviriyordu; repoda `.jt-flow` opt-in kancası
   hazırdı ve 480px altında otomatik sola dönüyordu (@390'daki 43px nehri sıfırladı).
7. **Kuyruk dosyası işe yarıyor.** `tasks/kuyruk.md` — gelen her istek tek tek
   yazılır, BEKLIYOR/ISLENIYOR/BITTI ile izlenir. Beyar hızlı ve paralel istek
   gönderdiğinde madde kaybını bu önledi.


---
---

# DEVİR NOTU — REVİZYON-13 (Beyar turu, 2026-08-25)

**Özet:** 14 kuyruk maddesi geldi, **12'si kapandı ve canlıda doğrulandı**;
2'si Beyar kararında. **10 commit**, hepsi `main`'de ve yayında
(`37c44df..e96123a`). Working tree **temiz**, `ahead=0`. Nöbetler koşuldu:
`hizalama-nobeti` · `kabuk-kalite` · `header-banner` · `footer-yapi` ·
`plan-account` · `crumb-home` · `a11y-focus` · `anatomi` → **hepsi 0 sorun**.

---

## 1 · Ekip durumu

| Ajan | İş | Durum |
|---|---|---|
| `anatomi-denetim` | `anatomi-v1` 4 görünüm × 18 bölge tıklama denetimi + R8 ön bulgusu | **KAPANDI — yeniden açma** |

Devir bilgisi: ajanın raporu bu oturumda değerlendirildi, bulguları
doğrulandı, düzeltmeler `bd7a4d8` ve `5b607e2` commit'lerinde. Ajanın
ölçüm scriptleri oturum scratchpad'inde kaldı (kalıcı değil); yeniden
gerekirse `docs/qa/` kalıbıyla yazılır.

**Ajanın yakaladığı, benim kaçırdığım kusur — ders:** ben "bölgenin
herhangi bir noktası tıklanıyor mu" diye ölçmüştüm, ajan "dolgusunun NE
KADARI tıklanıyor" diye baktı. `latissimus`'un %34'ü komşusunun altındaydı
ve ilk denetimim bunu "ÇALIŞIYOR" diye raporlamıştı.

---

## 2 · Kapananlar

| # | İş | Commit |
|---|---|---|
| K15 | Hub tarif kartları DadaGastro `.r-card` yapısına (kalp + künye + yazar satırı) | `0988ddc` |
| K16 | Marka lockup'ı: ayraç `#E14827`, marka 11.5→16px, kuyruk 12→10.5px | `0988ddc` |
| K17 | 8 makale sayfasında köprü kartları + bilgilendirme kutusu kanon 1176'ya | `20dd7a8` |
| K18 | `hesabim-v1` fatura bilgileri formu popup'a (kabuk `.fb-*` modalı) | `afae254` |
| K19 | `hesabim-v1` Diğer Modüller: iç içe `<a>` yüzünden ızgaraya düşen cümle | `cf0bdc1` |
| K20 | `hareket-hedefe-gore` giriş metni `.jt-flow` ile yaslandı | `0ed307a` |
| K21 | `anatomi-v1` 72 hücrelik tıklama denetimi — kusur yok, düzeltme gerekmedi | — |
| K22 | Anatomi seçim şekli: 9 bölge düz çizgiyle kesiliyordu → lif yönünde kesim | `bd7a4d8` `5b607e2` |
| K23 | Anatomi banner sayaçları kanon `.lib-stat`e | `bd7a4d8` |
| K27 | `hesabim-v1` bölüm rayı → gerçek sekme (WAI-ARIA tabs) | `4d4d10b` |
| K28 | `aktivite-gunlugu` üst üste binen paragraflar + denetim bulguları | `e96123a` |

**Kabuğa eklenen/değişen kurallar** (`assets/css/fit-shell.css`, dosya sonu):
1. `K28 · ÜST ÜSTE BİNEN .lead PARAGRAFLARI` — `.sec-head .lead+.lead{grid-row:auto}`
2. `K28 · .ff-pop-clear` — dokunma hedefi 26px + `--fit-deep` kontrast

**Üreteç değişti:** `tasks/anatomi-uretim/bolgeler.py` — trapez iç kesimleri
ve kadın omurga şeridi. SVG'ler ELLE düzenlenmedi; üreteç yeniden
koşturuldu. Ara dosyalar **hâlâ duruyor**:
`ANATOMI_SP=/private/tmp/claude-501/-Users-gaviaworks-Developer-Projects-dadafit-prototip/ce69d8d5-864c-420f-9bb0-96a0f9364f91/scratchpad`
(kalıcı değil — kaybolursa normalizasyon adımı yeniden koşulmalı, bkz. `tasks/anatomi-uretim/BENIOKU.md`).

---

## 3 · AÇIK / SONRAKİ ADIM — hepsi Beyar kararında

Öncelik sırası:

1. **K24 · Çerez banner'ı anatomi haritasını yiyor.** İlk ziyarette @1440
   harita alanının %12'si kapalı, `adduktor` **%97 erişilemez**. Kabuk
   düzeyinde (`.cookie-banner` `position:fixed; z-index:95`, 66 sayfa) —
   düzeltme kapsamı baştan konuşulmalı.
2. **K13 · `destek-v1` + `pro-v1` profil kalıbı (R14).** İki sayfada da
   kapak görseli (`--lib-img:none`) ve gösterilecek kimlik verisi yok;
   `.fp-profil` bir kimlik kartı olduğu için uydurma avatar/kapak
   gerekirdi. **Alternatif:** kapak görseli verip düz bannerı kırmak.
3. **K26 · Görünüm takla atması.** Ön gövdedeki `gastrocnemius`/`trapez-ust`
   ve arka gövdedeki `tensor-fasya-lata`/`brachioradialis`/`adduktor`
   tıklanınca model karşı tarafa dönüyor. Teknik olarak doğru
   (`veri.gorunum` neyse oraya gidiyor) — kusur mu tasarım mı?
4. **K25 · Anatomi @390 dokunma hedefi.** 10 bölge WCAG 2.5.8 (24px)
   altında, dokuzu kadın gövdesinde (kadın render'ı daha ince).
   **Ajan ölçümü, benim tarafımdan DOĞRULANMADI.**

### Önceki turlardan devam eden açık borçlar
- **`?sayfa=N` derin bağlantısı** — R18'de kalktı, `FIT_PAGI` desteklemiyor.
- **Zebra deseni** — `fit-planim-gecmis`'te Beyar "zebra var" dedi, ölçüm bulamadı.
- **justify satır uzunluğu** — `hareket-hedefe-gore` @640'ta kelime arası
  **2.62×** (kardeş sayfada 2.01×). Kök neden satır uzunluğu; `--measure`
  M5'te bilinçli devrilmişti. Üç seçenek: böyle bırak / `.jt-flow` eşiğini
  yükselt (kabuk) / metni daralt.

---

## 4 · Bu turda değişen taban değerler

| Ölçüm | Eski | **Yeni** |
|---|---|---|
| Hub tarif kartı | protein/kcal künyesi, "Tarifi Gör" alt satırı | **referans yapısı · yükseklik tek değer 363px** |
| `hesabim-v1` sayfa yüksekliği | 10454px (tek akış) | **2226px (tek panel)** |
| `hesabim-v1` ray | atlama listesi + scrollspy | **WAI-ARIA tabs · scrollspy SİLİNDİ** |
| Anatomi bölge örtüşmesi | 1/72 (`latissimus` %34 örtülü) | **0/72** |
| Anatomi banner kalemi | 3 (ikisi sayısal değil) | **4, hepsi veriden sayısal** |
| `.hr-note` kanon dışı sayfa | 15 | **7** (8'i düzeltildi) |

---

## 5 · Dersler (bu turun kısa listesi)

1. **"Herhangi bir noktası tıklanıyor mu" ≠ "çalışıyor".** Örtüşme
   ölçümünde doğru ölçüt, bölgenin dolgusunun YÜZDE KAÇININ üstte
   olduğudur. Bu turda 72 hücreyi "temiz" raporladım, bir bölge
   alanının %34'ünü komşusuna kaptırıyordu.
2. **Ağırlık merkezi ölçütü iki loblu şekillerde geçersizdir.** Sol+sağ
   kas çiftinin merkezi iki lobun ARASINA düşer; orada şekil yoktur.
   Bu ölçütle koşan sonda 15/18 sahte kusur üretti.
3. **Kullanıcının tarif ettiği kusurun öncülü yanlış olabilir, kusur
   yine gerçektir.** R3'te "kutu üstündeki ızgaradan dar" öncülü
   ölçümle yalanlandı (ikisi piksel piksel hizalıydı) ama Beyar'ın
   gördüğü sorun gerçekti: dar olan makale kolonunun tamamıydı.
4. **Üreteci olan çıktıyı elle düzenleme; önce KONTROL KOŞUSU yap.**
   Anatomi SVG'lerini değiştirmeden önce üreteci olduğu gibi koşturup
   dört dosyanın birebir aynı çıktığını doğruladım — ancak ondan sonra
   değişikliğin etkisini izole edebildim.
5. **Ekran görüntüsüne bakmadan tasarım kararı verme.** K28'de birincil
   döşemeyi iki kolona yaymak ölçümde doğruydu ama render'da ızgarayı
   ragged bıraktı; geri alındı.

---

## 6 · Yeni QA sondaları (oturum scratchpad'inde, kalıcı DEĞİL)

Kalıcılaştırılmak istenirse `docs/qa/` altına taşınmalı:
`an-denetim.mjs` (72 hücre tıklama) · `an-ortusme.mjs` (bölge örtüşmesi) ·
`k28-cakisma.mjs` (66 sayfada üst üste binen `.lead`) ·
`k27-dogrula.mjs` (sekme davranışı) · `dogrula-r3.mjs` (kanon genişlik).
