# FAZ 5 BRIEF — yeni bir DadaFit sayfası üret

Sana atanan sayfayı üret. **Yalnız kendi HTML dosyana yaz.**

## Dosya sahipliği — ihlal edilirse işler birbirini ezer

| Dosya | Yetkin |
|---|---|
| Sana atanan `<sayfa>.html` | **YAZABİLİRSİN** (yeni oluşturacaksın) |
| `assets/js/fit-shell.js`, `assets/css/fit-shell.css`, `assets/css/fit-type.css` | **OKU, YAZMA** |
| `REVIZE-PLAN-2.md`, `HANDOFF.md`, `tools/*`, `tests/*`, `index.html` | **OKU, YAZMA** |
| Başka herhangi bir `.html` | **DOKUNMA** |

Ortak bir kit (kart/çip/ızgara/panel) gerekiyorsa **kabuğa kendin ekleme**.
Raporunda "kabukta şu kural gerekli: `<tam CSS>` — gerekçe: `<hangi ölçüm gösterdi>`"
diye bildir; ana oturum merkezî olarak uygular. Sayfa `<style>`'ında geçici
çözüm yazacaksan bunu raporunda **açıkça** söyle.

**Commit atma.** `git add` / `git commit` / `git checkout` / `git restore` çalıştırma.

---

## Önce oku

1. `tools/FAZ5-SKELETON.html` — **iskeletin bu. Kopyala, doldur.** Tasarım dili sapmasın.
2. `HANDOFF.md` — mimarî, sayfa sözleşmesi, `.ff` filtre bileşeni, kaydırma kilidi
3. `REVIZE-PLAN-2.md` — Faz 5 maddesi ve ilgili belge bölümleri
4. Benzer bir mevcut sayfayı **örnek al**: liste sayfası için `egzersiz-kutuphane-v1.html`
   veya `antrenorler-v1.html` (dizin kurgusu), Planım sayfası için
   `fit-planim-kaydettiklerim-v1.html`, detay sayfası için `egzersiz-detay-v1.html`.

## Tasarım kuralları (belge "Ana Uygulama Kuralı")

Şunlar **değişmez**: DadaFit yeşil kimliği · mevcut kart tasarım dili · Gilroy
tipografi · yuvarlatılmış köşeler (`--radius-*`) · boşluk ve grid sistemi ·
mobil uyumluluk yaklaşımı · ortak CSS/JS mimarisi.
**Sıfırdan farklı bir tasarım dili üretme.** Yeni sınıf adı uydurmadan önce
kabukta karşılığı var mı diye bak: `grep -n "\.sinif" assets/css/fit-shell.css`.

Kabuğun hazır kitleri: `.lib-top` banner + `.lib-crumb`, `.lib-grid`/`.hub-grid`,
`.df-fchip` + `.fgroup`, `.lib-empty`, `.hr-note`, `.demo-tag`, `.pf-tabbar`,
`.lst-layout` + `.lst-side` + `.fct*` (solda filtre kolonu olan dizin kurgusu),
`.sheet-*` (mobil alttan çekmece), `.pager`/`.pg` yok — sayfalama gerekiyorsa
`antrenorler-v1.html`'deki `.pager` desenine bak ve raporunda kabuğa taşınmasını öner.

## Zorunlu içerik kuralları

- **Tek `<h1>`**, sonra h2/h3 hiyerarşisi (§19). Benzersiz `<title>` + `meta description` (§19).
- **Banner'a arama input'u koyma** (A3/A4 kuralı).
- **Boş `href="#"` bırakma**; her düğmenin gerçek hedefi/işlevi olsun (§23).
- **Filtreleri URL parametresine yansıt**, geri/ileri çalışsın, yenilemede seçim korunsun (§23).
- Filtre düğmelerinde **`aria-pressed`** (§20). Form alanlarında **gerçek `<label>`** (§20).
  Modal açılınca odak içine, kapanınca geri; **Escape** ile kapanma (§20).
  Hata mesajı yalnız renkle anlatılmasın (§20). Görsellerde anlamlı `alt` (§20).
- **Demo veri gerçek gibi sunulmasın** (§22) — `.demo-tag` ile işaretle.
- **Enerji dili** (§13): "yediğini yak", "telafi et", "kalori açığını kapat",
  "yemek hakkı kazandın", "kaçamak" gibi ifadeleri **KULLANMA**. Yerine:
  günlük hareket dengesi · bugünkü aktiviten · yaklaşık enerji kullanımı ·
  haftalık hareket hedefi · bedeninin bugünkü durumu · dengene uygun öneriler.
  Enerji değerlerinin **yaklaşık** olduğunu belirt.
- **Sağlık sınırı** (§8, §9): testler ve durum kartları tıbbi teşhis, hastalık
  tanısı ya da tedavi önerisi üretmez. Riskli yanıtta akış durur ve uzman
  desteğine yönlendirir. `.hr-note` kitiyle açıkça yaz.
- **Modül eklemeyeceklerin** (§21): blog, sosyal akış, topluluk duvarı,
  rekabetçi liderlik tablosu, e-ticaret, ayrı kalori hesaplama merkezi,
  yapay zekâ sohbet asistanı. **DadaMentor kaldırıldı, geri getirme.**
- Görsel kullanacaksan `loading="lazy"` ve ölçü tanımı (`width`/`height` ya da
  CSS aspect-ratio) ver (§18, CLS).

## ÖLÇ — bunu yapmadan "bitti" deme

Sunucu ayakta değilse repo kökünde: `python3 -m http.server 8811 &`

```bash
export PW_HOME=~/.pw
node tools/page-check.mjs <sayfa>.html 1440
node tools/page-check.mjs <sayfa>.html 1024
node tools/page-check.mjs <sayfa>.html 768
node tools/page-check.mjs <sayfa>.html 390
```

Kontrol ettiği şeyler: kabuk mount'u · konsol/JS hatası · 4xx istek · yatay taşma ·
içeriğin sabit header altında kalmaması · kırık iç bağlantı · DadaMutfak/turuncu kalıntısı.
**Dördü de temiz çıkana kadar iş bitmedi.**

Ayrıca sayfanın **kendi etkileşimini** tarayıcıda ölç: filtre süzüyor mu, sekme
değişiyor mu, modal açılıp Escape ile kapanıyor mu, form doğrulaması çalışıyor mu.
"Kod duruyor" demek yeterli değil. Ölçemediğin şeyi **"doğrulanmadı"** diye bildir.

---

## Raporunda dön

1. **Dosya:** oluşturduğun dosya + boyut
2. **Belge karşılığı:** hangi maddeleri hangi bölümle karşıladın (madde madde)
3. **Ölçüm:** 4 genişliğin `page-check` çıktısı + kendi etkileşim ölçümlerin
4. **Kabukta gereken kurallar:** varsa tam CSS/JS + gerekçe + hangi ölçüm gösterdi
5. **Sayfa `<style>`'ında yazdığın geçici çözümler** (varsa) ve neden
6. **Bağlantı ihtiyacı:** bu sayfaya nereden girilmeli (menü/footer/hangi sayfa) —
   ana oturum menüyü ve `index.html` haritasını buna göre bağlayacak
7. **Doğrulanmayanlar:** ölçemediğin, emin olmadığın her şey
