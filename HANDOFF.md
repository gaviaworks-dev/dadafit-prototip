# DEVİR NOTU — REVİZE TURU 3

**Tarih:** 18.08.2026 · **Taban commit:** `9f9c8b7` · **Son commit:** `0c70bf8`
**Plan dosyası:** `REVIZE-PLAN-3.md` · **Kararlar:** `KARARLAR.md` (K13–K20)

## ÖZET SATIRI — kapanış durumu

| | Sonuç |
|---|---|
| **Canlı doğrulama** (`https://gaviaworks-dev.github.io/dadafit-prototip`) | **60/60 sayfa HTTP 200** · **0 kırık bağlantı** · **0 kırık çapa** · 3.575 bağlantı tarandı · 4xx alt kaynak **0** · konsol hatası **0** |
| **Yerel kalite kapısı** (`tools/page-check.mjs`) | dokunulan sayfalarda 1440 ve 390'da **temiz** |
| **Working tree** | **temiz** (`git status --short` boş) |
| **Push** | ✅ **tamam** — `9f9c8b7..0c70bf8`, `main...origin/main` ahead **0** |
| **Kabul listesi** | Beyar'ın 3. tur kabul listesi baştan sona ölçüldü → **kırmızı yok** (ayrıntı §1b) |

## EKİP DURUMU

Bu oturumda **beş doğrulama alt ajanı** açıldı; hepsi işini bitirdi ve **boşta**:

| Ajan | Faz | Rapor metni | Not |
|---|---|---|---|
| `dogrula-A` | A | ❌ gelmedi | ham çıktı `scratchpad/verify-A/` |
| `dogrula-B` | B | ❌ gelmedi | ham çıktı `scratchpad/verify-B/` — kaydırılmış sekme senaryosunu araştırmış, ana oturumda koşturuldu |
| `dogrula-C` | C | ✅ **geldi** | tek bağımsız doğrulama; bir kırmızı buldurdu (düzeltildi) |
| `dogrula-D` | D | ❌ gelmedi | ham çıktı `scratchpad/verify-D/` |
| `dogrula-E` | E | ❌ gelmedi | ham çıktı `scratchpad/verify-E/` |

> **Sonraki oturum için:** bu ajanlar bu oturuma aitti, **yeniden açma**.
> Faz A · B · D · E · F · G için doğrulamayı **sıfırdan** koştur ve brief'e
> mutlaka *"raporu MESAJLA gönder, dosyaya yazma"* yaz (bkz. §1c).
> Ham çıktıları scratchpad'de; scratchpad **oturuma özel**, kalıcı değil —
> gerekiyorsa ölçüm script'lerini yeniden yaz.

---


## 1 · Fazların durumu

| Faz | İş | Uygulama | Kabul listesi | Doğrulama rengi |
|---|---|---|---|---|
| **A** — Antrenör kartları (A1–A6) | ✅ bitti | ölçüldü, geçti | **8/8 geçti** | 🟡 **SARI** — bağımsız değil |
| **B** — Sekme bileşeni (B1) | ✅ bitti | ölçüldü, geçti | **2/2 geçti** | 🟡 **SARI** — bağımsız değil |
| **C** — Filtre bileşeni (C0–C5) | ✅ bitti | ölçüldü, geçti | **5/5 geçti** | 🟢 **YEŞİL** — tek bağımsız doğrulama; bir kırmızı buldurdu, düzeltildi |
| **D** — Global temizlik (D1, D2, D3) | ✅ bitti | ölçüldü, geçti | **2/2 geçti** | 🟡 **SARI** — bağımsız değil |
| **E** — Programlar + video (E1–E6) | ✅ bitti | ölçüldü, geçti | **4/4 + E6 geçti** | 🟡 **SARI** — bağımsız değil |
| **F** — Challenge (F1–F3) | ✅ bitti | ölçüldü, geçti | **5/5 geçti** | ⚪ **BEYAZ** — ajan hiç çalışmadı |
| **G** — Enerji Defteri (G1, G2) | ✅ **bitti** | ölçüldü, geçti | **G1 ✅ · G2 açıklandı** | ⚪ **BEYAZ** — ajan hiç çalışmadı |
| **H** — İçerik ve veri (H1) | ⛔ **başlanmadı** (Beyar'ın talimatı) | — | — | — |

**Renk ne demek:** 🟢 bağımsız ajan rapor METNİ döndürdü · 🟡 ajan koştu ama
raporu ana oturumda okundu → **bağımsız sayılmaz** · ⚪ ajan **hiç çalıştırılmadı**.

> **ÖNEMLİ — Beyar'ın devir talimatındaki varsayım düzeltmesi:**
> Talimat "Faz G'ye başlama, altı yeni HTML üretecek" diyordu. **Faz G bu turda
> zaten tamamlandı ve `10370f4` ile commit'lendi.** Altı değil **üç** yeni dosya
> üretildi (aşağıda §4). Yani G önümüzde değil, arkamızda; önümüzdeki tek
> uygulama işi **Faz H**, artı **doğrulama borcu** (§2).

### Neden sarı — doğrulama zinciri kırık

Her fazın sonunda bir doğrulama ajanı çalıştırıldı (`dogrula-A` … `dogrula-E`).
Beşi de ölçüm script'i yazıp koştu; ham çıktılar `scratchpad/verify-*/` altında.
**Ama yalnız `dogrula-C` rapor metni döndürdü.** Diğer dördü iki ayrı istekten
sonra da yalnız "boşta" bildirimi gönderdi; ham çıktılarını **ana oturumda ben
okudum**. Ölçen ile yorumlayan aynı taraf olduğunda bu bağımsız doğrulama
sayılmaz — bkz. `KARARLAR.md` **K19**.

**Farkın kanıtı:** rapor gönderen tek ajan, benim **temiz** raporladığım bir
noktada gerçek bir kusur buldu (aşağıda §3).

---

## 1b · 3. TURUN KABUL LİSTESİ — ölçüm sonuçları

Beyar'ın kabul listesi baştan sona tarayıcıda ölçüldü (18.08.2026).
**Tüm maddeler geçti; kırmızı yok.**

### Antrenörler — 8/8 ✅
| Madde | Ölçülen |
|---|---|
| A1 eşit yükseklik | aynı satırdaki 3 kart tek değer **435 px** (390'da 462) |
| A2 isimler hizalı | `boundingBox.top` sapması **0 px** (iki satırda da) |
| A3 tek satır + `+N` | `scrollHeight = clientHeight`, `scrollWidth ≤ clientWidth`; gizlenen/rozet **birebir**: +2 · +2 · +1 · +1 |
| A4 meta hizalı | sapma **0 px** |
| A5 fiyat yok | `₺` ve `\bTL\b` araması **0** |
| A5 tek baskın düğme | `.coach-cta` **237.3 px** = kart iç genişliği **237 px**; kartta başka düğme **0**; kontrast **5.45** |
| A6 bilgi şeridi | `.fit-note` var, düz paragraf `.dz-vnote` **yok**, kontrast **7.08** |
| mobil | 390 px'te yatay taşma **yok** |

### Antrenör detay — 2/2 ✅
- Sekme değişiminde **sayfa zıplamıyor** — **kaydırılmış durumda** ölçüldü (kritik senaryo): `scrollY` dört geçişte de **356**'da sabit, panel kapsayıcısı **top=138**'de sabit.
- Sekme stili: aktif **dolu hap** `rgb(0,122,61)` + beyaz metin, şerit 12px radius / 4px padding / 4px gap, sekme yükseklikleri tek değer **37 px**.
- **"DadaGastro referansı doğrulanmadı" notu DÜŞÜLMEDİ — çünkü gerekmedi.** Referansa erişildi ve okundu (dört sayfa, `anasayfa-portal-v3a` HTTP 200). `KARARLAR.md` **K13** bunu "Referans DOĞRULANDI (varsayım değil)" başlığıyla, birebir CSS değer tablosuyla kaydediyor.

### DadaFit Egzersizleri — 5/5 ✅
| Madde | Ölçülen |
|---|---|
| C5 ad | title · h1 · kırıntı hepsi "DadaFit Egzersizleri"; görünen metinde "kütüphane" **0** |
| C1 taşma | panel sağ/alt kenar viewport içinde, `z-index:60`, `elementFromPoint` panelin içini döndürüyor |
| C1 URL turu | `?kas=gogus&ekipman=ekipmansiz&sure=5` → yeni sekmede seçimler **birebir geri geldi** |
| C3 arama | panel açılınca **odak arama alanında**; "dam" → **15 → 1** seçenek |
| C4 rozet | 12 `.ex-cat` rozeti duruyor; zemin `rgb(0,157,79)`, radius 8px, `position:absolute` **değişmemiş** |

### Global — 2/2 ✅
- **D1:** 60 sayfa tarayıcıda açıldı → `.demo-tag / .fp-demo / .lg-demo` düğümü **0**, görünen metinde "demo veri / örnek görünüm / örnek metrik" eşleşmesi **0**.
- **D1 istisna:** "Bu sayfadaki veriler **örnektir**" şeridi Enerji Defteri'nde **duruyor ve görünür**.
- **Yanlış alarm notu:** ilk taramada `.fc-step` seçicisi fazla genişti; `antrenor-ol`'daki "1 / 4" adım çipleri ve `pro-odeme`'deki "Güvenli" rozeti demo rozeti sanıldı. Doğru seçiciyle **0**.

### Programlar merkezi — 4/4 ✅
| Madde | Ölçülen |
|---|---|
| E1 | `#pro` bölümü **yok**, `.pm-tier*` **0**, "Erişim" filtre ekseni **yok** |
| E2 | `.pm-cont / .pm-bar / .pm-meta` **0** |
| E3 | açılıştan **3.2 sn** sonra `.wz-modal` **yok**, `.wz-overlay` **yok**; düğmeye basınca `role="region"`, host içinde, viewport içinde, örtü üretilmiyor |
| E4 | video bölümü **344 px**'te, program ızgarası **1003 px**'te → ızgaranın **üstünde**; 4 kartın 4'ü de `video-seans-detay-v1.html`'e gidiyor |
| **E5** | `programlar-merkezi` → **4 kalem, hepsi "Programlar"**; `program-liste` → **2 kalem, hepsi "Tüm Programlar"**. Aynı etiket iki hedefe, aynı hedef iki etikete gitmiyor. **Karışıklık çözüldü: ikisi ayrı şey.** |

### Fit testleri — ✅
Üç iterasyon `REVIZE-PLAN-3.md`'de tam: **it0** (hiyerarşi zayıf) → **it1** akış rayı →
**it2** satır ölçüsü **119 → 79** karakter → **it3** mobilde eylem **5656 → 1047 px**.
Seçim gerekçesi yazılı (**it3**, üçü üst üste biniyor). Ayrıca bir **dürüstlük notu**:
it2'deki bir iddiam ölçümle kısmen yanlışlandı, düzeltildi.

### Challenge — 5/5 ✅
Dropdown **yok**, chevron **yok**, tek bağlantı → challenge merkezi.
`?durum=yaklasan` → **HTTP 200**, kırık sayfa yok, üç durum tek ızgarada rozetli.
Zaman bileşeni: 1 Ağustos → 30 Ağustos · 30 gün toplam · 12 gün kaldı ·
"Bugün · 18. gün" · taşma **yok**; katıl düğmesi görünür; geri dönüş `challenge-merkezi-v1.html`.

### Enerji Defteri — ✅
Üst nav artık **Hareket · Programlar · Challenge · Antrenörler**.
Eski adres ve çapalar: `enerji-defteri-v1.html` **200** · `#dengele` → Dengele ·
`#su` → Su Takibi · `#haftalik` → Haftalık Özet · `#yediklerim` **yerinde kaldı**.
Hepsi 200, kırık yok.

---

## 1c · DOĞRULAMA BORCUNUN TAM KAPSAMI

| Faz | Ajan koştu mu | Rapor metni geldi mi | Sonuç | Borç |
|---|---|---|---|---|
| A | ✅ evet (`dogrula-A`) | ❌ hayır — yalnız "boşta" bildirimi | ham çıktı ana oturumda okundu | 🟡 **yeniden koş** |
| B | ✅ evet (`dogrula-B`) | ❌ hayır | ham çıktı ana oturumda okundu | 🟡 **yeniden koş** |
| C | ✅ evet (`dogrula-C`) | ✅ **evet** | bir kırmızı buldu → düzeltildi | 🟢 borç yok |
| D | ✅ evet (`dogrula-D`) | ❌ hayır | ham çıktı ana oturumda okundu | 🟡 **yeniden koş** |
| E | ✅ evet (`dogrula-E`) | ❌ hayır | ham çıktı ana oturumda okundu | 🟡 **yeniden koş** |
| F | ❌ **hayır** | — | doğrulanmadı | ⚪ **sıfırdan koş** |
| G | ❌ **hayır** | — | doğrulanmadı | ⚪ **sıfırdan koş** |

**Neden bu bir borç:** ölçen ile yorumlayan aynı taraf olunca doğrulamanın işlevi
kaybolur. Kanıt: rapor gönderen **tek** ajan (`dogrula-C`), benim **temiz**
raporladığım bir noktada gerçek bir kusur buldu — 24 çipte `role="option"` ile
`aria-pressed` çakışması. Benim ölçümüm temiz çıkmıştı çünkü kabuk özniteliği
kuruluşta siliyordu; sayfa motoru onu ancak **kullanıcı bir çipe tıkladıktan
sonra** geri koyuyordu. Yani **yanlış anda ölçmüştüm**.

**Ajan brief'ine mutlaka yaz:** *"Raporu MESAJLA gönder, dosyaya yazma."*
Ajan metin döndürmüyorsa ham çıktısını ana oturumda okuyup **yeşile çevirme** —
sarı bırak ve öyle raporla. Ham çıktılar: `scratchpad/verify-A … verify-E/`.

---

## 2 · Sonraki oturumun İLK ÜÇ ADIMI

```bash
cd ~/Developer/Projects/dadafit-prototip
git log --oneline -3 && git status --short
python3 -m http.server 8811 &          # zaten çalışıyorsa atla
export PW_HOME=~/.pw                   # playwright-core 1.62.1 orada
```

**Adım 1 — Zemini doğrula (5 dk).**
Tam site taramasını tekrarla; bu turun sonunda **60 sayfa / 3.575 bağlantı /
0 kırık / 0 konsol hatası** ile kapandı, aynı sonucu almalısın:
`scratchpad/final-scan.mjs` hazır, `PW_HOME=~/.pw node final-scan.mjs`.
Sayı tutmuyorsa önce onu çöz, yeni işe girme.

**Adım 2 — Doğrulama borcunu kapat (§1'deki sarılar).**
A · B · D · E · F · G için doğrulama ajanlarını yeniden çalıştır. **Kritik
kural:** ajan rapor METNİ döndürmüyorsa ham çıktısını ana oturumda okuyup
yeşile çevirme — sarı bırak ve öyle raporla. Ajan brief'lerinde "raporu
mesajla gönder, dosyaya yazma" talimatı açıkça olsun.

**Adım 3 — Faz H'yi aç (asıl kalan iş).**
Aşağıdaki §3'teki **B8 bulgusu** H'nin ilk maddesidir. Önce veri kaynağını
Beyar'a sor (H1 "veri kaynağı henüz belirlenmedi" diyor), sonra kartları üret.

---

## 3 · B8 bulgusu ve Faz H'nin onu nasıl kapatacağı

**Bulgu (dogrula-C ölçtü):** `egzersiz-kutuphane-v1.html` filtre çubuğu,
12 kartlık prototip verisinin **karşılayamadığı 13 seçenek vaat ediyor.**

| Eksen | Seçenek | Kartta karşılığı olan | Karşılıksız |
|---|---|---|---|
| Ekipman | 15 | 4 (ekipmansız · dambıl · kettlebell · direnç bandı) | **11** — halter · kablo · sabit makine · askı bandı · sağlık topu · pilates topu · step · bench · barfiks barı · atlama ipi · foam roller |
| Kas grubu | 10 | 8 | **2** — triceps · ön kol |

**Bu bir kırılma DEĞİL.** Davranış temiz: `?ekipman=halter` → 0 kart,
"0 hareket bulundu", `.lib-empty` boş durumu görünüyor. Sorun **vaat ile arz
arasındaki boşluk**: kullanıcı 15 ekipman görüyor, 11'i hiçbir zaman sonuç
vermiyor.

**Eksen listesi kısaltılmadı — bilerek.** Liste Beyar'ın C4'te birebir
verdiği listedir; kısaltmak talimatı geri almak olurdu.

**Faz H bunu şöyle kapatır:**
1. Her karşılıksız değer için **en az bir hareket kartı** üret
   (11 ekipman + 2 kas grubu = en az 13 yeni kart).
2. H1'in kendi maddeleri de aynı veri turunda: **ekipman bilgisi** (zaten
   `data-ekipman` var, içerik lazım), **terim açıklamaları** (hareketin ne
   demek olduğu), **gym dışı çeşitlilik** (bisiklet · CrossFit · yoga türü).
3. Kartlar geldikçe **iki sayacı birlikte güncelle**:
   `.lib-stat` (hareket · kas grubu · seviye — şu an **12 · 8 · 3**, gerçek
   veriden sayılıyor) ve alt satırdaki "N / N hareket gösteriliyor".
4. **Beyar'a soru S2 hâlâ açık:** kabuğun üst bandındaki site geneli
   **"140+ hareket"** iddiası duruyor ve `dadafit-hub` · `giris` ·
   `hareket-merkezi` de aynı sayıyı söylüyor. Gerçek veriye çekilecekse
   dört yerde daha değişir.

**dogrula-C'nin buldurduğu ve DÜZELTİLEN kırmızı (tekrar etmesin):**
`.df-fchip` çiplerinde `role="option"` ile `aria-pressed` aynı anda duruyordu
(24 çip). Kabuk özniteliği **kuruluşta bir kez** siliyordu; iki sayfanın kendi
boyama fonksiyonu kabuktan **sonra** çalışıp geri koyuyordu. Üç yerde çözüldü:
kabuk `sync()` her turda siliyor · `fit-testleri-v1` ve `aktivite-gunlugu-v1`
markup'ından statik öznitelik kalktı (15 + 9) · boyama fonksiyonları
`aria-selected` yazıyor. Sıralama düğmelerindeki `aria-pressed` **korundu**
(onlar gerçek toggle). Ölçüm: 7 sayfa · 125 çip · `aria-pressed` kalan **0**.
**Ders:** durum özniteliğini yalnız kuruluşta düzeltmek yetmez; sayfa motoru
sonradan geri koyabilir — her senkronda düzelt ve **etkileşimden sonra** ölç.

---

## 4 · Faz G'nin tam kapsamı (ne yapıldı, ne kırılmamalı)

### G1 — Enerji Defteri profile taşındı
`assets/js/fit-shell.js` → `NAV` dizisinden `{key:'defter'}` kalemi
**kaldırıldı** (beş alt kalemiyle birlikte). Üst menü artık dört başlık:
**Hareket · Programlar · Challenge · Antrenörler.**
Erişim üç kapıya taşındı, üçü de canlı:
- `PLAN_TABS` → Fit Planım sekme rayının **7. kalemi**
- `ACCOUNT_ITEMS` → hesap (profil) menüsü
- `FOOTER_COLS[0]` → footer "DadaFit" kolonu

Eski alt kalemlerin hedefleri `PLAN_EXTRA`'ya taşındı: `aktivite-gunlugu-v1`,
`bagli-uygulamalar-v1`.

### G2 — tek uzun sayfa dörde bölündü

**Üretilen üç yeni dosya** (altı değil — gerekçe §5'te):

| Dosya | `data-plan-page` | Başlık | İçerik |
|---|---|---|---|
| `enerji-defteri-v1.html` *(mevcut, adres korundu)* | `defter` | Enerji Defteri | Bugünkü denge paneli + Yediklerim + Hareketlerim |
| `enerji-defteri-dengele-v1.html` **YENİ** | `defter-dengele` | Dengele | Yediğini hareketle dengele + Gastro önerisi |
| `enerji-defteri-su-v1.html` **YENİ** | `defter-su` | Su Takibi | Su modülü |
| `enerji-defteri-haftalik-v1.html` **YENİ** | `defter-haftalik` | Haftalık Özet | Haftalık denge tablosu |

**Sekme bileşeni:** ikisi de **B1'de sabitlenen ortak bileşen** —
`.fit-tabs` / `.fit-tab` / `.fit-pane` (`assets/css/fit-shell.css` +
`assets/js/fit-shell.js` → `[data-fit-tabs]`), **sayfa geçişi kipi**
(kalemler `<a>`, aktif olan `aria-selected="true"` + `aria-current="page"`;
JS bu kipte panel yönetmez, yalnız rolleri kurar).
- Fit Planım rayı: `.pf-tabs/.dt` → `.fit-tabs/.fit-tab` (7 kalem)
- Enerji Defteri alt şeridi: `.ed-subtabs .fit-tabs` (4 kalem)

**Alt sayfalar üst kalemi işaretler:** `fit-shell.js` → `RAY_UST` eşlemesi
`defter-dengele` / `defter-su` / `defter-haftalik` → `defter`. Bu olmadan
alt sayfalarda rayda hiçbir kalem aktif görünmüyordu (ölçülüp düzeltildi).

### KIRILMAMASI GEREKEN ESKİ ADRESLER

| Adres | Beklenen davranış | Nerede korunuyor |
|---|---|---|
| `enerji-defteri-v1.html` | HTTP 200, ray aktif, kırıntı `DadaFit › Fit Planım › Enerji Defteri` | dosya adı değişmedi |
| `enerji-defteri-v1.html#dengele` | → `enerji-defteri-dengele-v1.html` | `enerji-defteri-v1.html` sonundaki **çapa köprüsü** |
| `enerji-defteri-v1.html#su` | → `enerji-defteri-su-v1.html` | aynı köprü |
| `enerji-defteri-v1.html#haftalik` | → `enerji-defteri-haftalik-v1.html` | aynı köprü |
| `enerji-defteri-v1.html#yediklerim` | **yerinde kalır**, yönlenmez | köprü çapa sayfada varsa dokunmaz |

> Köprü mantığı: `if(hash && MAP[hash] && !document.querySelector(hash))
> location.replace(MAP[hash])`. Yani **çapa bu sayfada duruyorsa yönlendirme
> yapılmaz** — ileride bir modül geri taşınırsa köprü kendiliğinden susar.

**Ölçüldü:** 4 sayfa HTTP 200 · alt sekme aktif durumu + `aria-current` doğru ·
üst rayda "Enerji Defteri" aktif · `page-check` 1440 ve 390'da **8/8 temiz** ·
konsol hatası 0 · yatay taşma yok · `index.html` site haritası güncellendi.

---

### Enerji Defteri ≠ Fit Planım rayı — iki KÜME, karıştırılmayacak

Bu ayrım turun en çok karışan noktasıydı; net hâli (karar: `KARARLAR.md` **K20**):

| | **Enerji Defteri kümesi** (4 sayfa) | **Fit Planım rayı kümesi** (6 sayfa) |
|---|---|---|
| Ne | Günlük enerji/denge defteri | Kişisel plan alanı |
| Sayfalar | `enerji-defteri-v1` (**Bugün**) · `enerji-defteri-dengele-v1` (**Dengele**) · `enerji-defteri-su-v1` (**Su Takibi**) · `enerji-defteri-haftalik-v1` (**Haftalık Özet**) | `fit-planim-v1` (**Bugün**) · `-programim-` (**Plan ve Takvim**) · `-gecmis-` (**Aktivite Kayıtlarım**) · `-ilerleme-` (**İlerlemem**) · `-kaydettiklerim-` (**Kaydettiklerim**) · `-randevular-` (**Antrenörüm**) |
| Ne zaman ayrıldı | **bu turda** (G2) — önce tek 911 satırlık sayfaydı | **bu turdan ÖNCE** zaten ayrı dosyalardı |
| Sekme şeridi | `.ed-subtabs .fit-tabs` (4 kalem) | `.pf-tabbar .fit-tabs` (**7 kalem** — altısı + Enerji Defteri) |
| Ölçüm | 4/4 HTTP 200 | 6/6 HTTP 200 |

**Kritik:** iki kümede de "Bugün" adlı bir sayfa var ama **farklı şeyler** —
biri defterin bugünü, diğeri planın bugünü. Adları birleştirme, kümeleri
karıştırma. Enerji Defteri'nin alt sayfaları rayda **üst kalemini** işaretler
(`fit-shell.js` → `RAY_UST` eşlemesi).

### Banner ailelerinin sabit değerleri (D3)

Aile işareti kabuk JS'inde dosya adından türer: `body[data-fit-hero-kind]`
(`-detay` geçen + dört bilinen detay sayfası → `detay`, geri kalanı → `liste`).

| Aile | ≥901 px | ≤1024 px | ≤640 px | Ölçülen sonuç |
|---|---|---|---|---|
| **liste** (`--hero-h-list`) | **344 px** | 296 px | 262 px | **47 sayfanın 47'si 344 px** — yayılım **199 → 0 px** |
| **detay** (`--hero-h-detail`) | **384 px** | 330 px | 296 px | **4 sayfanın 4'ü 384 px** — yayılım **92 → 0 px** |

- ≥901 px'te `height` (gerçekten sabit), altında `min-height` — dar ekranda aynı
  içerik 1.3–1.7 kat uzun sarıyor, sabitlemek **metin kırpmak** olurdu.
- Taşan/kırpılan içerik **0**.
- `justify-content:safe center` **şart**: düz `center` taşmayı iki yana dağıtıp
  içeriği şeffaf header'ın altına kaydırıyordu (4 sayfada ölçüldü).
- **Kural dışı beş imza banner'ı** (içlerinde ikinci kart var, sabit kutuya
  sığmaz): `dadafit-kopru` 614 · `antrenor-ol` 602 · `challenge-v1` 697 ·
  `program-detay` 570 · ana sayfa `df-top` 900. → **Beyar'a soru S5**.

## 5 · G2'de verilen yorum — Beyar'a açık soru (S3)

Beyar G2'de altı ad saymıştı: *Bugün · Plan ve Takvim · Aktivite Kayıtlarım ·
İlerlemem · Kaydettiklerim · Antrenörüm.* **Ölçüm bunların Enerji Defteri'nin
bölümleri olmadığını gösterdi** — birebir **Fit Planım rayının** kalemleri ve
o altı sayfa **zaten ayrı dosya olarak vardı** (`fit-planim-*.html`, altısı da
diskte). Tek uzun sayfa **Enerji Defteri**'ydi (911 satır, yedi modül); bölünen
o oldu ve **kendi içeriğine göre** dörde ayrıldı.

**KARAR VERİLDİ (Beyar, tur sonu) — soru S3 KAPANDI.** Enerji Defteri sayfa
adları **mevcut hâliyle kalıyor**: Bugün · Dengele · Su Takibi · Haftalık Özet.
Fit Planım rayının altı sayfası **ayrı kalmaya devam ediyor**. İki küme
birbirine **karıştırılmayacak**. Ayrıntı: `KARARLAR.md` **K20**.

---

## 6 · Beyar'a açık sorular — **4 açık, 1 kapandı**

| # | Konu | Soru |
|---|---|---|
| **S1** | E1 | Erişim bölümü ve filtre ekseni kalktı; kartlardaki altın **PRO rozeti** ve "Başlangıç · Ücretsiz" etiketi **duruyor** (site geneli kural). Kart rozetleri de gitsin mi? |
| **S2** | C4 / H | Kütüphane sayaçları gerçeğe çekildi (140+ → 12). Kabuk üst bandındaki site geneli **"140+ hareket"** duruyor. Hedef sayı mı, gerçek mi? |
| ~~S3~~ | G2 | ✅ **KAPANDI** — Beyar karar verdi: adlar mevcut hâliyle kalıyor, iki küme ayrı (K20) |
| **S4** | B4 | `--fit` (#009d4f) + beyaz metin **3.54:1** — AA altı. Bu turda dokunulan düğmeler `--fit-deep`'e (5.45:1) geçti. Site geneli `.btn-fit` de koyulaşsın mı? |
| **S5** | D3 | Banner yükseklikleri aile içinde sabit (liste 344 · detay 384, yayılım 0). İçinde ikinci kart taşıyan **beş imza banner'ı** kural dışı: `dadafit-kopru` 614 · `antrenor-ol` 602 · `challenge-v1` 697 · `program-detay` 570 · ana sayfa 900. Sadeleşip katılsınlar mı? |

---

## 7 · Bu turda kabuğa eklenen ORTAK birincil bileşenler

Sayfa sayfa kopyalanmaz — hepsi `assets/css/fit-shell.css` + `assets/js/fit-shell.js`:

| Bileşen | Ne yapar |
|---|---|
| `[data-tagrow]` | Tek satır etiket rayı; sığmayanı gizler, sona `+N` rozeti (rozet tıklanamaz) |
| `.fit-note` | İkon çipi + kalın başlık + tek satır açıklama bilgi şeridi |
| `.fit-tabs` / `.fit-tab` / `.fit-pane` | Sekme bileşeni (DadaGastro segment hapı kalıbı + ARIA + klavye). İki kip: `<button>` panel değişimi, `<a>` sayfa geçişi |
| `.ff` (yükseltildi) | Filtre çubuğu: tek durum nesnesi → URL, viewport kelepçesi, arama alanı (>5 seçenek), `role=listbox/option` |
| `.vs-card` ailesi | Video seans kartı (iki sayfada kullanılıyor) |
| Hero token'ları | `--fit-header-h` · `--hero-pt` · `--hero-pb` · `--hero-gap` · `--hero-min` · `--hero-full` · `--sec-pad` · `--measure` · `--hero-h-list` · `--hero-h-detail` |

---

## 8 · Değişmeyen kalıcı kurallar

1. Ortak bileşen sayfa sayfa kopyalanmaz — kabuktan yönetilir.
2. **Ölçmeden "düzeldi" denmez.** Ölçülemeyen şey "doğrulanmadı" diye raporlanır.
3. Bir test, kırmızıya döndüğü görülmeden yeşil sayılmaz.
4. **Push her seferinde ayrı izin ister.** Commit serbest, push değil.
5. Mevcut tasarım dili korunur (DadaFit yeşili, Gilroy, kart dili, radius, grid).
6. Alt ajan commit atmaz.
7. Font Awesome **PRO** ikonu kullanılmaz.
8. **YENİ (bu turdan ders):** Durum özniteliğini yalnız kuruluşta düzeltmek
   yetmez — sayfa motoru sonradan geri koyabilir. Her senkronda düzelt ve
   **etkileşimden sonra** ölç.
9. **YENİ (bu turdan ders):** Metin değişimi yaparken hedefin bir **JS dizesi**
   içinde olup olmadığına bak. D1'de bir ön ek değişimi tırnak kaçırıp
   `uyelik-faturalandirma-v1`'in script'ini komple çökertti; tek tek
   `page-check` koşularında görünmedi, ancak **tam site taraması** yakaladı.

---

## 9 · Bu turun 13 commit'i

| # | Hash | Özet |
|---|---|---|
| 1 | `1f21c22` | FAZ A — antrenör kartı tek iskelete oturdu |
| 2 | `37c5b36` | FAZ B — sekme bileşeni ortak kaynağa çıktı |
| 3 | `0e664b8` | FAZ C — filtre bileşeni URL durumu, arama, kelepçe, klavye |
| 4 | `c0bca50` | FAZ D — demo rozet ailesi kalktı, hero tek ölçeğe indi |
| 5 | `12a4c8b` | FAZ E1–E5 — programlar merkezi sadeleşti, sihirbaz sayfa içine indi |
| 6 | `968a1cb` | FAZ E6 — fit testi detayı üç iterasyonda |
| 7 | `4aa9050` | fix — ana sayfa herosu 100dvh'ye geri alındı (Beyar) |
| 8 | `7e9a951` | FAZ F — challenge paneli kalktı, zaman çizelgesi tek bileşende |
| 9 | `470e440` | FAZ C1 — filtre bileşeni yeniden tasarlandı (1. tur) |
| 10 | `b720e05` | filtre kartı keskin radius'la geri + banner yükseklikleri sabit |
| 11 | `10370f4` | **FAZ G** — Enerji Defteri profile taşındı ve dörde bölündü |
| 12 | `a5dbbc1` | teslim taraması iki kusur yakaladı, plan bölümleri yazıldı |
| 13 | `74ee4ec` | FAZ C — çakışan `aria-pressed` kaldırıldı (ajanın bulduğu kırmızı) |

**Taban:** `9f9c8b7`. **Hiçbiri push edilmedi.**

---

## 10 · Turun kapanış ölçümü

| Ölçüm | Sonuç |
|---|---|
| Sayfa sayısı | **60** (3'ü bu turda üretildi) |
| HTTP 200 | **60 / 60** |
| Taranan iç bağlantı | **3.575** |
| Kırık bağlantı | **0** |
| Kırık çapa | **0** |
| 4xx alt kaynak | **0** |
| Konsol hatası / JS istisnası | **0** |
| Beklenmedik bulgu | **8** (B1–B8, planda) |
| Beyar'a dönen soru | **5** (S1–S5) |
| Kırmızı ölçüm | **1 bulundu → düzeltildi → 0** |
