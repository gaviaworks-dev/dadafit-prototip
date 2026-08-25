# DadaFit Prototipi — Proje Beyni

## Bu depo nedir

**Statik HTML prototipi.** DadaFit'in public yüzeyinin 67 sayfalık maketi.
Kardeş markaların (DadaGastro · DadaDiet · DadaGourmet) aksine burada
**Laravel yoktur**: `app/`, `routes/`, `database/`, `composer.json` yok ve
olmayacak. Bu depo tasarımın kaynağıdır; backend ayrı bir depoda, sonra doğar.

**Buildless.** `package.json` yok, `vite.config.js` yok, derleme adımı yok.
Sayfalar tarayıcıda doğrudan açılır. Bir araç eklemek istiyorsan **DUR ve sor** —
buildless olmak bu deponun kararıdır, eksiği değil.

### Ağaç

```
*.html            67 sayfa, hepsi kökte, düz dosya adı (ör. hesabim-v1.html)
assets/css/       fit-shell.css · fit-type.css · fit-planim.css
assets/js/        fit-shell.js · fit-modal.js · fit-takvim.js · fit-plan-kayit.js
                  anatomi-veri.js · sozluk-veri.js
assets/           fonts · img · svg · video
docs/qa/          Playwright ölçüm betikleri (.mjs)
docs/screenshots/ QA çıktıları (gitignored)
docs/lessons.md   kalıcı dersler — versiyonlu
tasks/            local oturum dosyaları (DEVIR-*, REVIZYON-*)
tools/ · tests/
DENETIM.md        🔴 kanıt protokolü — okumadan iş kapatma
KARARLAR.md       ürün kararları
```

## Stil sistemi — ölçülmüş gerçek

- **Token dosyası `tokens.css` DEĞİLDİR.** Bu depoda öyle bir dosya yok
  (ölçüldü). Token sistemi **`assets/css/fit-shell.css`**'in `:root` bloğudur:
  **95 CSS değişkeni** (`--fit-header-h`, `--hero-pt`, `--sec-pad`,
  `--banner-h-liste` …). Tipografi `fit-type.css`'te (12 değişken),
  Fit Planım yüzeyi `fit-planim.css`'te (6 değişken).
- **Yeni renk/radius/gölge icat edilmez** — değişken varsa o kullanılır, yoksa
  önce `fit-shell.css`e eklenir.
- Kabuk (header/footer/çekmece/modal) `fit-shell.js` + `fit-shell.css`
  ikilisidir; sayfa scriptleri kabuğun ID'lerine (`#fbModal` ailesi) çakışacak
  ad kullanmaz.
- Font Awesome **CDN'den** gelir (`cdnjs`, 6.5.2).
- Kare/oranlı görsel: `<img>` değil → `div` + `background-image` +
  `cover/center`.

## Çalışma döngüsü

1. **Keşif** — ilgili referans sayfa + mevcut markup okunur.
2. **Plan** — yapılacak iş kısaca yazılır.
3. **DUR** — Beyar onayı beklenir.
4. **Onay → uygula.**

- Beklenmedik bulguda (kaynak çelişkisi, açık karar, tahmin edilmeyen
  bağımlılık): **DUR ve raporla**, kendi başına yorumlayıp devam etme.
- **`DENETIM.md` bağlayıcıdır.** Kanıt = sayı. "Ekledim", "çalışıyor",
  "düzeldi" kanıt değildir. Oradaki maddeleri geçmeyen iş **kapanmadı** sayılır.
- Kalıcı dersler `docs/lessons.md`'ye yazılır; `tasks/` yalnız local oturum
  dosyaları içindir.

## Git disiplini

- `git add -A` / `git add .` **YASAK** — dosyalar TEK TEK stage edilir.
- Ayrı concern ayrı commit; mesajlar İngilizce ve isimsiz
  (Co-Authored-By / imza / isim eklenmez).
- **İzinsiz commit ve push YOK** — her commit Beyar onayıyla.
- `git commit --no-verify` **YASAKTIR** (aşağıya bak).

---

## Dört Marka Hesap Mimarisi — Bağlayıcı Kararlar (2026-08-25)

Dört markanın (DadaGastro · DadaDiet · DadaGourmet · DadaFit) hesap ve profil
mimarisi için Beyar'ın bağladığı kararlar. Gerekçeler ve ölçümler bu depoda
**değil**, Gastro'nun `docs/hesap-mimarisi/08-kararlar.md` dosyasındadır;
uygulama sırası `09-uygulama-plani.md`.
**Bir ekranı çizmeden ÖNCE ilgili maddeyi oku; madde varsa tartışmadan uygula,
yoksa DUR ve sor.**

- **K1 · Topoloji.** Composer paketi YOK; dört depo kendi kodunu kendi yazar ve tek paylaşılan sözleşmeye uyar.
- **K2 · Rozet.** Gastro'nun motoru DESEN olarak alınır; her marka kendi rozetlerini ve kademe merdivenini kendi deposunda kurar, `brand` kolonu yoktur.
- **K3 · Puan.** Puan havuzu ortak değildir; her marka kendi puanını ve merdivenini tutar.
- **K4 · Para modeli.** Gastro'da üye üyeye abone olur, **Diet ve Fit'te üye üreticiden hizmet satın alır**, Gourmet'te bu turda para ilişkisi yoktur.
- **K5 · Komisyon kuralları.** Oran tüm kullanıcılar için aynıdır, ödeme ay sonudur, alt sınır altındaki bakiye birikir, iade olursa komisyon geri gitmez.
- **K6 · Fit aboneliği.** 🔴 **Fit'te abonelik YOKTUR**; maketteki abonelik blokları sökülür ve yerine **antrenör hizmet paketi** gelir.
- **K7 · Şef statüsü.** Tarif veya püf noktası yazan her üye şeftir; ayrı bir başvuru basamağı yoktur (Gastro kavramı).
- **K8 · Destek.** DadaDiet pilottur; dört durumu (`açık · yanıt bekleyen · çözülen · kapatılan`), iki tablosu ve geçişleri enum'da tutma kararı kanondur — **Fit için ayrı destek tasarımı yapılmaz**.
- **K9 · Alışveriş.** Sipariş domain'i bu turda kurulmaz (Gastro kalemi).
- **K10 · Sözleşme kopyalanır.** `docs/hesap-sozlesmesi.md` dört depoda ayrı kopya olarak yaşar (symlink ve dış yol bağımlılığı yoktur); ilk satırda sürüm damgası durur, sapma dalga sonunda diff ile ölçülür.
- **K11 · `ChefProfile` kalır.** Üyelik basamağı değil doğrulama kaydıdır (Gastro kalemi); Fit'te karşılığı antrenör doğrulamasıdır.
- **K12 · İçerik üretimi eşiği.** Üye 50 tarif · 25 püf noktası · 10 takip · 10 takipçi eşiklerini geçince içerik üreticiliğine geçebilir; dördü de panelden ayarlanır (Gastro kalemi).
- **K13 · Para parametreleri.** Hizmet komisyonu %10 · ödeme ay sonu toplu · alt sınır 1000 TL · fatura eşiği 10.000 TL — **hiçbiri koda gömülmez, panelden okunur**; maket çizilirken bu sayılar **sabit metin olarak yazılmaz**, alan olarak gösterilir.
- **K14 · Fit hesap yüzeyi.** 🔴 **Fit'in hesap ekranlarının TAMAMI doğru kurguyla yeniden çizilir** — yalnız abonelik kartlarının sökülmesi değil. Maket düzeyinde kalır, backend sonradır.
- **K15 · Gourmet parasız.** Bu turda Gourmet'te para akışı kurulmaz.
- **K16 · Alışveriş sağlayıcıları.** Mod 1 için zincir marketler A101 · Carrefour · BİM · ŞOK hedeflenir (Gastro kalemi).

### Bu kararların getirdiği çalışma kuralları

- `git commit --no-verify` **YASAKTIR** — `.pre-commit-config.yaml`
  (gitleaks + detect-private-key) bu depoda kuruludur.
- `.env` ve türevleri ajana kapalıdır (`.claude/settings.local.json` deny
  kuralları). ⚠ Bu depoda `.env` yoktur ve olmamalıdır — statik prototipin
  sırrı olmaz.
- `docs/hesap-sozlesmesi.md` dört depoda **birebir aynı** olmalıdır;
  değiştiren, dördünü birden değiştirir ve sürüm damgasını yükseltir.
