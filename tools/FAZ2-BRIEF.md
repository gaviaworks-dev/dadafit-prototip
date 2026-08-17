# FAZ 2 BRIEF — bir legacy sayfayı DadaFit ortak kabuğuna geçir

Bu dosyayı sana atanan sayfa için uygula. **Yalnız kendi HTML dosyana yaz.**

## Dosya sahipliği — ihlal edilirse işler birbirini ezer

| Dosya | Yetkin |
|---|---|
| Sana atanan `<sayfa>.html` | **YAZABİLİRSİN** |
| `assets/js/fit-shell.js`, `assets/css/fit-shell.css`, `assets/css/fit-type.css` | **OKU, YAZMA** |
| `REVIZE-PLAN-2.md`, `HANDOFF.md`, `tools/*`, `tests/*` | **OKU, YAZMA** |
| Başka herhangi bir `.html` | **DOKUNMA** |

Kabukta bir kural gerekiyorsa **kendin ekleme** — raporunda
"kabukta şu kural gerekli: …" diye bildir, ana oturum merkezî olarak uygular.

**Commit atma.** `git add` / `git commit` / `git checkout` çalıştırma.

---

## Önce oku

1. `HANDOFF.md` — mimarî harita, sayfa sözleşmesi, `.ff` filtre bileşeni, kaydırma kilidi
2. `REVIZE-PLAN-2.md` — Faz 1 ve Faz 2 maddeleri
3. Kaynak belge maddeleri: **§1** (bağımsızlaştırma), **§23** (teknik kurallar), **§16** (footer), **§22** (demo)

## Hedef sözleşme

```html
<head>
  … meta / title …
  <link rel="stylesheet" href="…font-awesome…" />
  <link rel="stylesheet" href="assets/css/fit-shell.css" />   <!-- kabuk -->
  <style> … YALNIZ sayfaya özgü CSS … </style>
  <link rel="stylesheet" href="assets/css/fit-type.css" />    <!-- EN SONDA -->
</head>
<body data-brand="fit" data-fit-page="<anahtar>">
  <div id="fitShellTop"></div>
  <main class="page-main" id="pageMain"> … sayfa içeriği … </main>
  <div id="fitShellBottom"></div>
  <script src="assets/js/fit-shell.js"></script>
  <script> … YALNIZ sayfa JS'i … </script>
</body>
```

`fit-type.css` **her zaman `</head>`'ten hemen önce** kalmalı — sayfa `<style>`'ı
yaslamayı geri almasın diye (HANDOFF §5). Sıra bozulursa justify kaybolur.

---

## Adım 1 — mekanik göç (araç yapar, sen doğrularsın)

```bash
python3 tools/legacy-migrate.py <sayfa-adi>            # DRY-RUN, önce bunu oku
python3 tools/legacy-migrate.py <sayfa-adi> --apply    # sonra uygula
```

Araç şunları yapar:
- kabuk markup'ını (topbar · header · drawer · alt bar · görüş modalı · çerez · giriş kapısı · footer) siler,
- kabuk JS'ini siler (parmak izine bakarak), **sayfa JS'ini korur**,
- `<style>` bloklarını **kural kural** süzer: seçicisi `fit-shell.css`'te olan kural düşer,
  olmayan kural kalır → sayfanın kendi görünümü korunur,
- iki mount `<div>`'ini ve `fit-shell.js` script'ini yerleştirir,
- `data-brand="fit"` + `data-fit-page` kurar.

**Raporu oku.** `** KORUNDU (sayfa)` satırları senin ilgilenmen gereken yerler:
araç tanımadığı bir düğümü/script'i silmez, korur. Doğru yerde durup durmadığını
kontrol et. `dikkat: … ELLE BAK` uyarısı varsa o script'i gerçekten incele.

**Araç sihir değil.** Uyguladıktan sonra dosyayı gözden geçir; artık boş kalan
yorum blokları, sarkan `</div>`, iki kez kalan başlık gibi şeyleri temizle.

## Adım 2 — marka dili (belge §1)

- `<title>`: `… — DadaMutfak` → DadaFit dilinde benzersiz başlık (belge §19 benzersiz title istiyor)
- Görünen metinde `DadaMutfak` → `DadaFit`
- `DadaMutfak Pro` → **`DadaFit Pro`** · `DadaMutfak Onaylı` → **`DadaFit Onaylı`**
- Breadcrumb'ın ilk halkası **DadaFit Ana Sayfa** (`dadafit-hub-v1.html`)
- Turuncu DadaMutfak kimliği kalmayacak: sayfa `<style>`'ında `--tomato:#E14827`
  gibi turuncu token tanımı varsa **sil** (kabuk `--tomato`yu DadaFit yeşili `#009d4f` yapıyor).
  Yeşil kimlik, Gilroy tipografi, kart dili, radius ve grid **korunacak** — yeniden tasarım yok.
- **İçerik dili:** sayfa DadaMutfak/tarif/diyetisyen dünyasından metin taşıyorsa
  (ör. "tarif eklemekten diyetisyen randevusuna") DadaFit karşılığına çevir:
  hareket, egzersiz, program, antrenör, Enerji Defteri, challenge.
  Ekosistem bağlantısı gerekiyorsa DadaDiet/DadaGastro'ya **kontrollü** atıf kalabilir (§14),
  ama sayfanın kendi dili DadaFit olmalı.
- Boş `href="#"` bırakma (§23). Her düğmenin gerçek hedefi olsun.
- Demo veri gerçek gibi sunulmasın (§22) — gerekiyorsa küçük "Demo veri" ibaresi.

## Adım 3 — ÖLÇ (bunu yapmadan "bitti" deme)

Sunucu zaten ayakta olabilir; değilse repo kökünde:
```bash
python3 -m http.server 8811 &
```

Playwright kurulumu hazır, `PW_HOME` ile çözülür:
```bash
export PW_HOME=/private/tmp/claude-501/-Users-gaviaworks-Developer-Projects-dadafit-prototip/8e804619-336a-4048-8bf6-c70cbb02bc7c/scratchpad/pw
node tools/page-check.mjs <sayfa>.html 1440
node tools/page-check.mjs <sayfa>.html 1024
node tools/page-check.mjs <sayfa>.html 768
node tools/page-check.mjs <sayfa>.html 390
```

`tools/page-check.mjs` şunları ölçer ve **sorun varsa çıkış kodu 1 verir**:
kabuk mount'u (header/nav/footer/drawer/alt bar) · konsol ve JS hatası · 4xx istek ·
yatay taşma · `main` içeriğinin sabit header'ın altında kalmaması · kırık iç bağlantı ·
sayfada kalan "DadaMutfak" geçişi · turuncu `#E14827` kalıntısı.

Dördü de temiz çıkana kadar iş bitmiş sayılmaz. Ölçemediğin bir şey varsa
raporunda **"doğrulanmadı"** diye yaz — "muhtemelen çalışıyor" yazma.

---

## Raporunda dön

1. **Dosya:** hangi dosyayı değiştirdin, kaç karakterden kaça indi
2. **Ölçüm sonuçları:** 4 genişlik için `page-check` çıktısı (geçti/kaldı + sayılar)
3. **Kabukta gereken kural** (varsa): tam CSS/JS ve **neden** gerektiği + hangi ölçüm bunu gösterdi
4. **Korunan sayfa düğümleri:** aracın `KORUNDU` dediği şeyleri ne yaptın
5. **İçerik kararları:** DadaMutfak dilinden çevirdiğin yerler
6. **Doğrulanmayanlar:** ölçemediğin, emin olmadığın her şey
