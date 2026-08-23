# REVİZYON-11 — Beyar'ın maddeleri

**Taban:** `24a8dd9` (docs(DEVIR-10): sonraki oturum bölümü)
**Açılış:** 2026-08-23

Bu dosya, Beyar'ın bu oturumda **tek tek** verdiği maddelerin kütüğü.
Kural: madde eksiksiz kapanmadan bir sonrakine geçilmez; her madde
kendi **kanıt satırını** (sayı) taşımak zorunda (bkz. `DENETIM.md` §1).

Durum kodları: `AÇIK` · `SÜRÜYOR` · `KAPANDI` · `ONAY BEKLİYOR`

---

## M1 · Banner → gövde dikişi (bütün sayfalar) — `KAPANDI`

**İstek (Beyar, birebir):**
> "Bütün, bütün sayfalarda banner'lık, kısımlar, beyaz panel, sol ve sağ,
> üst sıralı üstü yuvarlak olması lazım hepsinde. Claude Gastro'daki
> liste kartları sayfası gibi — https://dadagastro.com/tarifler
> Bu DataFit'teki bütün sayfalandırmalar için geçerli."

**Referans reçetesi** (`dadagastro.com/reference/tarif-liste/tarif-liste.css` → `.lst-sec`):

```css
border-radius:22px 22px 0 0; margin-top:-22px;
position:relative; z-index:2;
box-shadow:0 -12px 32px rgba(20,16,10,.18);
```

**Beyar kararları:**
1. Kural `assets/css/fit-shell.css`'e yazılsın (66 sayfa tek kaynaktan).
2. Sekme raylı sayfalarda ray DÜZ kalsın, yuvarlaklık alttaki panelde olsun.
3. Ölçüler referansla **birebir**: 22px · −22px · gölge.
4. (Ek karar) Ray ile panel arasına giren "Giriş Yap" CTA bandı panelin
   İÇİNE alınsın ki köşe banner'ın dibine otursun.

**Yapılan:**
- `assets/css/fit-shell.css` sonu → `BANNER → GÖVDE DİKİŞİ` bloğu.
  `--seam-r:22px` · `.fit-seam` · `.fit-seam.is-onbanner`.
- `assets/js/fit-shell.js` sonu → dikiş işaretleyicisi. Banner'dan sonraki
  ilk **opak · tam-en · yapışkan-olmayan · görünür** bandı bulur.
  Sabit kardeş listesi tutulmadı: 66 sayfada gövde sınıfı 30'dan fazla
  çeşit, üstelik `#fitPlanTop` banner'ı çalışma anında üretiyor.
- `assets/js/fit-shell.js` plan kabuğu bloğundan sonra → 14 plan sayfasında
  rayla gövde arasındaki saydam `.wrap`ları (`.fp-gate` · `.ed-subtabs` ·
  `.fp-actions`) gövdenin içine taşıyan blok.

**Kanıt:**
- Dikiş **64/66** sayfada var; 3 genişlikte (390 · 1024 · 1440) aynı sonuç.
  Ölçülen: `r=22px/22px · z=2`, binenlerde `mt=-22px`.
  - `is-onbanner` (panel koyu banner'a biniyor): **41**
  - ray/yüzen panel altında: **23**
  - dikişsiz: **2** — `giris-v1` (gövde banner'ın içinde, altında bant yok),
    `profil-v1` (koyu banner yok, `.pf-top` zaten beyaz)
- Banner alt kenarı → dikiş üst kenarı mesafesi, 14 plan sayfasında
  **~340px → 75px** (75px = yapışkan rayın kendi yüksekliği; zaten doğru
  çalışan `sss-v1` 68px, `destek-v1` 72px).
- Nöbetler: `header-banner` 19 sayfa × 4 genişlik **0 sorun** ·
  `hizalama-nobeti` **0 sorun** · `crumb-home` 65/65 × 2 genişlik **0 sorun** ·
  `plan-kayit` **0** · `plan-ozet` geçti · `plan-account` **0** ·
  `program-takvim` YEŞİL · `bugunku-antrenman` **0**.
- **Ölçülemeyen 3 nöbet:** `kabuk-kalite` · `footer-yapi` · `enerji-hesap`
  kendi localhost sunucularını açamıyor (`ERR_CONNECTION_REFUSED` / 
  `ECONNREFUSED`). Değişiklik geri alınıp tekrar koşuldu — **aynı hatayı
  veriyorlar**, yani ortam kaynaklı, bu turun regresyonu değil.
  Bu üçü YEŞİL SAYILMADI.

---

## M2 · Anasayfa · "Antrenmanına uygun tarif" → görselli/parallax — `KAPANDI`

**İstek (Beyar, birebir):**
> "DadaFit anasayfada — Antrenmanına uygun tarif sectionuna — tarif kartları
> koyarız — Section'u görselli olsun, tıklanıldığında Gastro'da belirlenmiş
> sağlıklı tariflere giden bir bölüm olur 'tümünü gör' dediğimizde.
> Buradaki section görselli olacak, https://dadagastro.com/ ana sayfadaki
> **Mutfak Sırları** section'u gibi görselli olacak — arkası sabit,
> scroll edildikçe kaydırılabilir bir şekilde olacak."

**Hedef:** `dadafit-hub-v1.html` → "Antrenmanına uygun tarif" bölümü.
**Referans:** `dadagastro.com` anasayfa → "Mutfak Sırları" (parallax/sabit zemin).

**Yapılan:**
- Reçete kardeş markadan ölçüldü: `parallax-S2t5vFDm.css` + `parallax-CD51ce0g.js`.
  `background-attachment:fixed` DEĞİL — `clip-path` ile banda kırpılmış kutu
  içinde `position:fixed` görsel. Kabuğa **opt-in** olarak taşındı
  (`data-fit-px`): kardeş markadaki sürüm sayfadaki tüm tam-en bölümleri
  otomatik tarıyor, DadaFit'te öyle yapılsa 66 sayfanın `.lib-top` banner'ı da
  parallax'a dönerdi.
- `assets/css/fit-shell.css` → `PARALLAX BAND` bloğu
  (`.px-band` · `.px-clip` · `.px-media` · `.px-veil` + reduced-motion).
- `assets/js/fit-shell.js` → `PARALLAX BAND` kurucusu. Band yalnız
  `--px-img` / `--px-veil` / `--px-x` / `--px-y` bildirir.
- `dadafit-hub-v1.html` → bölüm `.df-recipe-band` + `data-fit-px`,
  metinler beyaza döndü, `sec-tools` içine **Tümünü Gör** eklendi.

**Kanıt (@1440):**
- Düzenek kuruldu: `px-band` ✓ · `.px-clip` bandın ilk çocuğu ✓ ·
  `.px-media` `position:fixed` ✓ · `.px-veil` ✓
- **Sabitlik ölçümü:** iki farklı scroll konumunda `.px-media` ekran üstü
  konumu **0px** değişti (sabit), aynı aralıkta band **500px** aktı.
  Yani parallax gerçek, sahte değil.
- Tarif kartı **3** · "Tümünü Gör" hedefi
  `…/tarif-liste-v1.html?filtre=hafif` · **JS hatası 0**

**AÇIK KALAN — Beyar'a soru:** depo genelinde Gastro tarafı `by4r.github.io/
dadamutfak-view/v7-6cu356/…` prototipine bağlanıyor (**38 bağlantı**), canlı
`dadagastro.com`'a değil. İkisi de HTTP 200. "Tümünü Gör" depo kalıbına
uyduruldu. Tüm depo canlı Gastro'ya çevrilsin mi — ayrı madde olur.

---

## M3 · Anasayfa · "DadaFit Onaylı antrenörler" → gerçek antrenör kartları — `KAPANDI`

**İstek (Beyar, birebir):**
> "DadaFit Onaylı antrenörler section'undaki kartlarıyla değiştir, antrenör
> kartları olsun yani. Buraya antrenör kartı koyulacak, **4'lü** yani.
> Buradan alacaksın: `antrenorler-v1.html` — buradaki kartları istiyorum."

**Hedef:** `dadafit-hub-v1.html` → "DadaFit Onaylı antrenörler" bölümü.
**Kaynak kart:** `antrenorler-v1.html` → görselli antrenör kartı
(üstte fotoğraf + "DadaFit Onaylı" rozeti + "Danışan alıyor" durumu,
altta etiketler, puan · değerlendirme sayısı · çalışma şekli, "Profili Gör").

**Şu anki hâli (değişecek):** 2 adet sade kart — yuvarlak küçük portre,
isim, uzmanlık, rozet, etiketler, "Profili Gör".

**Yapılacaklar:**
- [ ] `antrenorler-v1.html`'deki kart bileşenini ölç (sınıflar, yapı, veri)
- [ ] Hub'daki 2 sade kartı → 4 görselli antrenör kartı
- [ ] Kartların verisi antrenörler sayfasıyla tutarlı olsun (uydurma yok)
- [ ] "Tümünü Gör" bağlantısı yerinde kalsın
- [ ] Kanıt: kart sayısı 2 → 4, 3 genişlikte taşma 0, ekran görüntüsü

**Yapılan:**
- Kart biçimi `antrenorler-v1.html`'den **KABUĞA taşındı** (kopyalanmadı):
  `fit-shell.css` → "ANTRENÖR KARTI". Kart artık iki sayfada ortak, tek kaynak.
- Hub'daki 2 sade kart → dizinin **ilk 4 kartı birebir**
  (Selin Aksoy · Derya Yıldız · Ayşe Kaplan · Merve Tan). Veri uydurulmadı;
  isim, uzmanlık, etiket, puan, değerlendirme sayısı ve görsel dizindekiyle aynı.
  Dizine özel filtre nitelikleri (`data-uzmanlik` · `data-format` · `data-durum`
  · `data-pop`) ve etiket taşırma kancası (`data-tagrow`) çıkarıldı — hub'da
  filtre yok.
- Izgara 3 → **4 kolon** (@1024 2 · @390 1).
- Etiket şeridi M12'nin deyimiyle tek satır + kaydırmalı (dizindeki "+2"
  motoru hub'da yok, çift satırlık çip sıkışıyordu). Kabuk kuralı
  değiştirilmedi, özgüllük sayfa tarafında yükseltildi.

**Kanıt:**
- Hub: kart **4** · eski `.df-coach` **0** · kolon 4/2/1 (1440/1024/390) ·
  hepsinde görsel **4/4** · "DadaFit Onaylı" rozeti **4/4** ·
  kart yükseklikleri tek değer (435px) · yatay taşma **0** ·
  hedefler `antrenor-detay-v1.html?slug=…` (kırık yok) ·
  "Tümünü Gör" → `antrenorler-v1.html` yerinde.
- **Taşıma güvenliği:** `antrenorler-v1` kart geometrisi taşımadan önce ve
  sonra üç genişlikte ölçüldü — kart · medya · gövde · etiket · meta · cta
  kutularının hepsi **BİREBİR AYNI**.
---

## M4 · Footer · "Yakında" kalkacak — `KAPANDI`

**İstek (Beyar, birebir):**
> "Footer'da sağ altta 'yakında' diye bir şey kalmayacak. Gourmet'teki gibi
> yapabilirsin."

**Şu anki hâli** (`assets/js/fit-shell.js` → `.foot-app`, satır ~919-926):
- `<span class="ap-store" aria-disabled="true">` × 2 → üst satırda **YAKINDA**,
  alt satırda App Store / Google Play
- Altında `<p class="ap-soon"><span class="ap-soon-tag">Yakında</span>
  Uygulama henüz yayımlanmadı.</p>`
- `role="group" aria-label="Mobil uygulama mağazaları — yakında"`

**Hedef (Dada Gourmet footer'ı):**
- Kutuların üst satırı **"İndir"**, alt satır App Store / Google Play
- `ap-soon` paragrafı **yok**

**Not — bilerek yazılmış bir kuralı deviriyoruz:** koddaki yorum
"Uygulama henüz yayımlanmadıysa mağaza butonları aktif indirme bağlantısı
gibi çalışmamalıdır" diyor ve `docs/icerik-bekleyen.md`'ye bağlı.
Beyar kardeş markayı (Gourmet) referans gösterdi; orada da aynı biçim var.
Buton **tıklanabilir bağlantıya çevrilmeyecek** (sahte `href` üretilmez),
yalnız etiket ve uyarı satırı Gourmet'e eşitlenecek.

**Yapılacaklar:**
- [ ] Gourmet footer'ının gerçek biçimini ölç
- [ ] `Yakında` → `İndir` (2 kutu)
- [ ] `.ap-soon` paragrafını kaldır
- [ ] `aria-label`'daki "yakında" ibaresini düzelt
- [ ] `.ap-soon` / `.ap-soon-tag` CSS'i artık hiçbir sayfada kullanılmıyorsa
      SİLME — kütüğe yaz (kabuk sözleşmesi)
- [ ] Kanıt: 66 sayfada "Yakında" geçen footer kalemi **0**, ekran görüntüsü

**Yapılan (kardeş markalar canlıdan ölçüldü, aynı gün):**
- `dadadiet.com` → `<span>İndir<b>App Store</b></span>`
- `dadagourmet.com` → üstte "İndir", altta mağaza adı
- `dadagastro.com` → `<a class="store-badge" aria-disabled="true" title="Yakında">`
Üçünde de görünen yazı **"İndir"**, üçünde de ayrı "yayımlanmadı" paragrafı **yok**.

`assets/js/fit-shell.js` → `Yakında` → `İndir`, `.ap-soon` paragrafı çıkarıldı,
`aria-label` düzeltildi. Doküman şartı KORUNDU: kutular hâlâ `<a href>` değil
`<span aria-disabled="true">`, üstelik Gastro'nun kalıbıyla `title="Yakında"`
eklendi — durum bilgisi kaybolmadı, yalnız görsel gürültü kalktı.
`.ap-soon` CSS'i silinmedi, ölü olduğu yorumla işaretlendi.

**Kanıt (66 sayfa, @1440):** görünen "Yakında" **0** · "İndir" **132** (2×66) ·
`.ap-soon` **0** · kutular `SPAN` + `aria-disabled="true"` + `title="Yakında"`.
---

## M5 · Bilgi/uyarı kartlarında metin kartı doldursun — `KAPANDI`

**İstek (Beyar, birebir):**
> "Fit tarafındaki bütün bu info kartları var ya, buna benzer bütün infolar —
> bunlar kart boyunca soldan ve sağdan yaysın kendilerini, hepsi için böyle.
> Yarım kalmış yatayda. Hepsi için güncelle, bütün sayfalandırmada."

**Görülen kusur** (ekran: `anatomi-v1` sağlık bilgilendirme kutusu, @1810px):
Kutu kart genişliğini kaplıyor ama İÇİNDEKİ metin ~1220px'de kesiliyor,
sağda geniş boşluk kalıyor — metne `max-width` konmuş, kutuya değil.

**Kapsam:** yalnız bu kutu değil, **benzeri bütün bilgi/uyarı kartları**
(sağlık notu · sorumluluk reddi · disclaimer · not bandı) ve **bütün sayfalar**.

**Yapılacaklar:**
- [ ] Bu kart ailesinin sınıflarını TARA ve say (`.cp-disclaimer` ·
      `.note-band` · sağlık notu · vb. — liste ölçümle çıkarılacak)
- [ ] Metni daraltan `max-width` / `ch` sınırını kaldır ya da kutuya eşitle
- [ ] Tek örneği Beyar'a onaylat, sonra hepsine uygula
      (`gorsel-isde-once-tek-ornek-onayi` kuralı)
- [ ] Kanıt: etkilenen kart sayısı, metin genişliği / kutu genişliği oranı
      önce–sonra, 3 genişlikte taşma 0

**Yapılan:** kusurun kaynağı bulundu — `--measure:78ch` token'ı.
`.hr-note p{max-width:var(--measure)}` (kabuk, **38 sayfa**) ve
`.cp-disclaimer p` (antrenor-detay) metni kutunun %58'ine sıkıştırıyordu.

**ÇELİŞKİ, BİLEREK DEVRİLDİ — Beyar bilsin:** `--measure` önceki bir turda
(E6/it2) BİLEREK eklenmişti; kabuktaki gerekçe: *"ölçümde .hr-note paragrafı
1098px genişlikte 119 karakter/satır veriyordu; okunur aralık 45–75 karakter."*
Dahası **kardeş marka da aynısını yapıyor**: `dadagastro.com` bilgi metnini
1180px kutuda **700px**'e sınırlıyor = **%59** (DadaFit'teki %58 ile aynı).
Beyar üç kez tekrarladı, karar onun. Uygulandı; uzayan ölçünün yerleşik
karşılığı olarak **satır arası 1.6 → 1.72** açıldı.

**Kanıt (anatomi-v1 `.hr-note`, @1440/1810/2000 — üçünde de aynı):**
metin/kutu **%58 → %93** · satır **3 → 2** · karakter/satır 99 → 148.
Geri alma: kabuktaki "BİLGİ KUTULARINDA METİN KUTUYU DOLDURUR" bloğu silinir.
---

## M6 · Sayfalama (pagination) — `KAPANDI`

**İstek (Beyar, birebir):**
> "Egzersiz kütüphanesinde pagination kısmı var ya, oraya koy — sonsuz kısım
> var şimdi. Şöyle: burada pagination numaraları koyacaksın. **Önce sen burayı
> güncelle.** Gastro'daki gibi olacak tamam mı.
> Bir de liste sayfalarında **ilk sayfaya / son sayfaya atla** olması lazım,
> DadaHaber'deki gibi — yani buradan en başa git, en sona git.
> Bir de Gastro'ya gidince göreceksin, bu pagination'un altında bir ufak
> boşluk ve yazı olacak, haberin olsun."

**Referans 1 — Gastro (numaralar):** `‹ [1] 2 3 … 170 ›`
altında ufak boşluk + özet satırı: `5099 tarif · sayfa 1 / 170`

**Referans 2 — DadaHaber (ilk/son atlama):** `« ‹ [1] 2 › »`
üstünde özet satırı: `6 haberden 1–3 gösteriliyor · sayfa 1/2`

**Birleşik hedef:** `« ‹ [1] 2 3 … N › »` + altında ufak boşluk + özet satırı.

**Sıra (Beyar'ın verdiği):**
1. Önce `egzersiz-kutuphane-v1.html` — şu an sonsuz akış/"daha fazla" var,
   numaralı sayfalamaya çevrilecek.
2. Sonra diğer liste sayfaları.

**Not:** Beyar "bunu DadaGastro'ya da yapacağız" dedi — o **ayrı depo**,
bu turun işi değil; buraya yalnız referans olarak yazıldı.

**Yapılacaklar:**
- [ ] Gastro'nun pagination biçimini ÖLÇ (sınıf · ölçü · özet satırı metni)
- [ ] Ortak bileşen: `« ‹ 1 2 3 … N › »` + özet satırı (kabukta tek yer)
- [ ] `egzersiz-kutuphane-v1.html`'deki sonsuz akışı numaralı sayfalamaya çevir
- [ ] Beyar'a tek örnek onayı, sonra diğer liste sayfaları
- [ ] Kanıt: sayfa düğmesi sayısı, ilk/son atlama çalışıyor mu (tıklama önce/sonra
      state), özet satırı metni, 3 genişlikte taşma 0

**Yapılan — iki referans birleştirildi:**
- `fit-shell.css` → "SAYFALAMA". Değerler Gastro'dan **birebir**:
  `.pagi{gap:8px;margin-top:40px}` · `.pg{min-width:44px;height:44px;padding:0 13px;
  font-size:14px;font-weight:700;border-radius:var(--radius-md)}` ·
  `.pg[disabled]{opacity:.4}` · `.pg-dots` ·
  `.pagi-note{width:100%;text-align:center;font-size:12.5px;margin-top:6px}`
  ← Beyar'ın istediği "altındaki ufak boşluk ve yazı". Yalnız marka rengi
  DadaFit'e çevrildi (K29: ölçü alınır, palet alınmaz).
  44×44 tesadüf değil — WCAG 2.5.5 dokunma hedefi eşiği.
- `fit-shell.js` → "SAYFALAMA MOTORU" (`FIT_PAGI`). Kabukta, çünkü Beyar
  "liste sayfalarında" dedi; tek kaynak olmazsa ilk/son atlama bir yerde unutulur.
  Kalemler: **« ‹ 1 2 3 … N › »** (ilk/son = DadaHaber · önceki/sonraki = Gastro).
- `egzersiz-kutuphane-v1.html`: "Daha fazla hareket yükle" **kaldırıldı**.
  O kod gerçek sayfa çekmiyor, **mevcut kartların ilk 8'ini KLONLUYORDU** —
  aynı hareket listede iki kez görünüyordu. Filtre, arama ve sıralama
  sayfalayıcıya bağlandı; liste DOM sırasından okunuyor (sıralama
  `appendChild` ile diziyor, dizi sırası DOM'la uyuşmuyordu).

**Kanıt (@1440):**
25 hareket · 12/sayfa · **3 sayfa**. Sayfa 1: görünen **12**, aktif **1**,
`« ‹` **kapalı**, not "25 hareket · 1–12 gösteriliyor · sayfa 1 / 3".
Sayfa 2: 13–24. Son sayfa: görünen **1**, `› »` **kapalı**, "25–25 · sayfa 3 / 3".
`«` ile 1. sayfaya dönüş çalışıyor. Tüm düğmeler **44×44**. **JS hatası 0**.
`.lib-more` CSS'i silinmedi, ölü olduğu yorumla işaretlendi.
---

## M7 · Marka etiketleri: kilit biçimi (Dada kalın + marka ince + kendi rengi) — `KAPANDI`

**İstek (Beyar, birebir):**
> "hareket-yeni-baslayanlar linkinde 'Sırada' kısmına bak — buradaki
> DadaGastro, DadaFit, DadaGourmet. **Dada kalın, hepsi ortak** — yani Gastro
> kendi renginde. Buradaki sıradaki kartların üst etiketleri: marka ikonları,
> yazıları, renkleri kullan. **Dada kalın, Gastro ince olacak**, DadaFit ayrı
> olacak vs gibi."

**Örnek sayfa:** `hareket-yeni-baslayanlar-v1.html` → "Sırada · Hazırsan, bir
sonraki adım" bölümündeki kart üst etiketleri.

**Şu anki hâli:** `DADA GASTRO` / `DADAFİT` — tek ağırlık, büyük harf,
yalnız renk marka rengi.

**Hedef:** deponun zaten taşıdığı marka kilidi biçimi
(`dadafit-hub-v1.html` → `.dg-mark` / `.dg-wm` → `<b>Dada</b><em>Gastro</em>`):
`Dada` **kalın** + marka adı **ince**, marka ikonu ve marka rengiyle.
Her marka kendi rengini taşır (Gastro turuncu · Fit yeşil · Gourmet mor · Diet …).

**Kapsam sorusu (Beyar'a sorulacak):** yalnız bu bölüm mü, yoksa markalar
arası geçiş veren TÜM kart etiketleri mi.

**Yapılacaklar:**
- [ ] Marka kilidi bileşenini kabukta tek yere topla (renk · ikon · ağırlık)
- [ ] "Sırada" kartlarının üst etiketlerini bu bileşene çevir
- [ ] Aynı kalıbı taşıyan diğer sayfaları TARA ve say
- [ ] Kanıt: dönüştürülen etiket sayısı, marka başına renk/ikon eşleşmesi

**Yapılan:** Kabuğa `.brand-tag` bileşeni. **Yeni dil uydurulmadı** —
kabuk zaten aynı kilidi taşıyor: üst banttaki `.brand-switch` →
`<span class="bd">Dada</span>` (kalın) + `<span class="sf">Gastro</span>` (ince),
ve marka renkleri `--bs-c` değişkeninde. Bileşen o kilidi kart etiketi ölçeğine
taşıyor; renkler ORADAN, ikinci palet açılmadı.
`.bs-name` sarmalayıcısı KULLANILAMADI — kabukta bilerek gizli
(`max-width:0;opacity:0`, üst bantta hover'da açılıyor); etiket için ayrı
`.bt-name` yazıldı.
Sayfa CSS'indeki eski `.brg-brand` rengi ve BÜYÜK HARF'i bileşeni eziyordu
(sayfa CSS'i kabuktan sonra yükleniyor) — ikisi de kaldırıldı, yerleşim kaldı.

**Kanıt (66 sayfa taranarak):** marka etiketi **24** (8 sayfa × 3) ·
adı görünmeyen **0** · `Dada` ağırlık **800**, marka adı **400** ·
`text-transform` **none** · renkler: DadaFit `rgb(0,122,61)` ·
DadaGastro `rgb(225,72,39)` — kabuğun `.bs-*` kilidiyle birebir.

**Sondanın körlüğü yakalandı:** ilk ölçümde "24 etiket, görünmeyen 0" dedi
ama ekran görüntüsünde **yalnız ikonlar** vardı — sonda etiketin (ikon dâhil)
görünürlüğünü ölçüyordu, ADIN görünürlüğünü değil. Metin DOM'daydı ama
`.bs-name` yüzünden 0 genişlikteydi. Sonda düzeltildi: artık adın kendi
kutusunu ölçüyor.
---

## M8 · Banner sayaçlarına ayraç (divider) — `KAPANDI`

**İstek (Beyar, birebir):**
> "Fit'in banner'larındaki bu sayaç kısımlarına divider eklenecek — buradaki gibi."

**Referans ölçüldü** (`dadagastro.com/reference/tarif-liste/tarif-liste.css`):
```css
.lst-hero{grid-template-columns:minmax(0,1fr) auto;gap:44px;align-items:end}
.lst-stats{flex-direction:column;gap:16px;
           padding-left:38px;border-left:1px solid rgba(255,255,255,.18)}
@≤1024 .lst-stats{flex-direction:row;gap:34px;padding-left:0;border-left:none;
                  padding-top:18px;border-top:1px solid rgba(255,255,255,.18)}
```

**DadaFit'teki durum:** iki kolonlu banner zaten var
(`--banner-stat-gutter:44px` = referansın `gap:44px`'i ile **aynı**),
`≥1025`'te sayaçlar dikey kolona geçiyor — ama **ayraç yok**.
Yani eksik olan tek şey `border-left` + `padding-left:38px`
(ve ≤1024'te `border-top` + `padding-top:18px`).

**Yapılacaklar:**
- [ ] Kabuk sonuna ayraç bloğu (mevcut kural değiştirilmeden, kaynak sırasıyla)
- [ ] ≤1024 yatay kipte `border-top` karşılığı
- [ ] Hangi sayfalarda dikey kolon oluşuyor ÖLÇ (`data-fit-hero-kind` JS'ten de
      basılıyor — `fit-shell.js:1126`)
- [ ] Kanıt: ayraç görünen sayfa sayısı, ölçülen `border-left-width` ve
      `padding-left`, 3 genişlikte ekran görüntüsü

**Yapılan:** kabuk sonuna ayraç bloğu. Mevcut kurallara dokunulmadı;
aynı seçici, kaynak sırasıyla kazanıyor. ≥1025 dikey kipte
`border-left:1px solid rgba(255,255,255,.18)` + `padding-left:38px`
(referansla **birebir**), ≤1024 yatay kipte `border-top` + `padding-top:18px`.
Gutter zaten `--banner-stat-gutter:44px` = referansın `gap:44px`'i.

**Kanıt:** ayraçlı sayaç kolonu **26 sayfa**, **390 · 1024 · 1440**'ta aynı.
Ekran görüntüsüyle doğrulandı (antrenorler-v1 @1440).
---

## M9 · Sözlük · açılan maddede "terim sayfası" bağlantısı — `KAPANDI`

**İstek (Beyar, birebir):**
> "Fit'teki sözlükteki açılmış tile'da ilgili terim sayfası kısmı **sağ altta**
> olacak, **en sağda** olacak. Yazılar genişlikte yaysın.
> Gastro'da sağ altta biraz minimal bir yazı butonu var, tıkladığımızda detaya
> gidiyor — `dadagastro.com/mutfak-ansiklopedisi`'nden alacağız aslında.
> Sağ altta 'Maddenin tamamını oku' yazısı/butonu var.
> `sozluk-v1.html` — işte burayı değiştireceksin."

**Şu anki hâli:** açılan maddede sol altta **dolu yeşil buton**
("Aerobik terim sayfası →"), metin dar kalıyor.

**Hedef (Gastro · mutfak-ansiklopedisi):** sağ altta **minimal metin bağlantısı**
("Maddenin tamamını oku →"), dolu buton değil; gövde metni kartın
genişliğine yayılıyor.

**Yapılacaklar:**
- [ ] `dadagastro.com/mutfak-ansiklopedisi` biçimini ÖLÇ (sınıf · punto · renk ·
      hizalama · ok ikonu)
- [ ] `sozluk-v1.html` açılır madde gövdesini o biçime çevir
- [ ] Gövde metnini kart genişliğine yay (M5 ile aynı kusur olabilir — bak)
- [ ] `sozluk-detay-v1.html` bağlantısı korunsun
- [ ] Kanıt: bağlantının kart içindeki sağ kenara uzaklığı, metin genişliği /
      kart genişliği oranı, `sozluk-kapalilik` nöbeti yeşil

**Yapılan:** Referans canlıdan ölçüldü
(`dadagastro.com/mutfak-ansiklopedisi` → `.ans-dgo` / `.ans-dgo-row`):
**13px · font-weight 700 · marka rengi · zemin yok · kenarlık yok · dolgu 0 ·
yarıçap 0 · kapsayıcının sağ kenarına dayalı (sapma 0px)** — dolu düğme değil,
düz metin bağlantısı.
`sozluk-v1.html`: `.sd-more` dolu yeşil 40px düğmeden bu biçime çevrildi,
`align-self:flex-end` ile sağ alta alındı. Gövde metni ve örnek cümlesindeki
`--measure` sınırı kaldırıldı (Beyar: "yazılar genişlikte yay").

**Kanıt (@1440 ve @390, ikisinde de aynı):**
punto **13px** · ağırlık **700** · zemin `rgba(0,0,0,0)` · kenarlık **0px none** ·
dolgu **0px** · sağ kenara sapma **0px** · gövde metni kutuyu **%100** dolduruyor ·
yatay taşma **0** · `sozluk-kapalilik` nöbeti **0 sorun**.
---

## M10 · Sözlük detay · iki gezinme butonu kalksın — `KAPANDI`

**İstek (Beyar, birebir):**
> "Sözlük detaydaki 'Tüm sözlüğe dön' ve 'B harfindeki terimler' butonlarını
> kaldır. `sozluk-detay-v1.html?slug=aerobik` — şu iki butonu kaldır tamam mı."

**Yapılan:** `sozluk-detay-v1.html` → `.sz-back` bloğu işaretlemeden çıkarıldı.
`.sz-back` CSS kuralı **silinmedi**, ölü olduğu yorumla işaretlendi (blok geri
istenirse biçimi hazır dursun). 404 kipindeki ("Terim bulunamadı") çıkış
düğmelerine **dokunulmadı** — orada sayfanın başka çıkışı yok.

**Kanıt** (`?slug=aerobik`, @1440):
`.sz-back` **0** · "Tüm sözlüğe dön" metni **0** · "harfindeki terimler" **0** ·
önceki/sonraki terim gezinmesi **2 bağlantı** duruyor ·
sağlık notu görünür **true** · **JS hatası 0**

---

## M11 · Antrenman Oluşturucu · sonuç ekranı — `KAPANDI`

**İstek (Beyar, birebir):**
> "Antrenman oluşturucudaki infoyu yay — yine dediğim gibi bu yeşil infoları
> yayman lazım, kart içerisindeki genişliğe göre.
> Antrenman oluşturucudaki sonucundaki **planın bağlantısını kaldır**.
> Bir de alttaki **3'lü butonları merkezi yap** ve altındaki **infoyla mesafeyi
> koy**. Burayı diyorum: infonun yazısını yatayda yay; bu butonları
> görüyor musun — işte info ile arasına mesafe koy, ayrıca bu butonları
> merkezi hale getir ve planın bağlantısını kaldır."

**Hedef:** `antrenman-olusturucu-v1.html` → sonuç ekranı.

**Dört iş:**
1. [ ] Yeşil bilgilendirme kutusundaki metin kart genişliğine yayılsın (M5 ile
       aynı kusur — ortak çözümle kapanabilir)
2. [ ] "Planın bağlantısı" bloğu (başlık + açıklama + URL kutusu +
       "Bağlantıyı kopyala") **kaldırılsın**
3. [ ] Alttaki 3 buton (Tüm hareketlere git · Hazır programa da bak ·
       Baştan başla) **ortalansın**
4. [ ] Butonlarla alttaki bilgi kutusu arasına **boşluk** konsun

**Dikkat:** bağlantı kutusu kalkınca "planı paylaş" yolu kapanır — bu
kabuktaki `?plan=` çözümüne bağlı. `plan-kayit` nöbeti `?plan=` bağlantısını
ölçüyor; blok kalkınca nöbetin hâlâ yeşil kaldığı DOĞRULANMALI.

**Yapılacaklar sonu — kanıt:** buton kutusunun `justify-content` değeri,
buton grubu ile info arası ölçülen px, info metin genişliği / kart genişliği
oranı, `workout-generator` + `plan-kayit` nöbetleri.

**Yapılan:**
- `baglantiHtml()` çağrısı sonuç ekranından çıkarıldı. Fonksiyon ve
  `planUrl()` **duruyor** — plan hâlâ `?plan=` ile paylaşılıyor
  (`tests/plan-kayit.mjs` bunu ölçüyor), yalnız kopyalama kutusu ekrandan kalktı.
- `.wg-done{justify-content:center}` — üç buton ortalandı.
- `.wg-done{margin-bottom:40px}` — bilgi kutusuyla arası açıldı.
- Bilgi kutusu zaten M5'te düzelmişti (`.hr-note`).

**Kanıt (@1440, sihirbaz sonuna kadar sürüldü):**
`.wg-link` **0** · `#wgCopy` **0** · `#wgUrl` **0** ·
buton **3** (Tüm hareketlere git · Hazır program da bak · Baştan başla) ·
`justify-content: center` · buton↔info **46px** · info metin/kutu **%97** ·
JS hatası **0**.

**Not:** banner'daki "Planın bağlantısı paylaşılabilir" çipi ve motor
açıklamasındaki aynı cümle DOKUNULMADI — iddia hâlâ doğru (adres çubuğundaki
`?plan=` planı taşıyor), yalnız kopyalama düğmesi yok. İstersen o da kalkar.
---

## M12 · Fit Testleri kartlarında etiketler tek satır + kaydırmalı — `KAPANDI`

**İstek (Beyar, birebir):**
> "Programların altındaki fit testlerinde açıklamanın altındaki tag'leri
> sliderlı yap, tek satır yap. `fit-testleri-v1.html` — buradaki kartlardan
> bahsediyorum. Buradaki taglı yapılar var ya — '~10 dk', 'Mat + sandalye',
> 'Yeniden başlayanlar' vs — bunlar **tek satır** olması gerekiyor,
> **sliderlı** olsun."

**Şu anki hâli:** etiketler `flex-wrap:wrap` ile iki satıra taşıyor,
kart yüksekliği kartlar arası tutarsızlaşıyor.

**Hedef:** tek satır, yatayda kaydırılabilir şerit.
Depoda zaten bir şerit kalıbı var: kabukta `.row-track`
(`overflow-x:auto` · `scroll-snap`) — önce o kullanılabilir mi bakılacak,
yeni bileşen uydurulmayacak.

**Yapılacaklar:**
- [ ] `.row-track` kalıbı bu ölçekte (küçük çip şeridi) iş görüyor mu ÖLÇ
- [ ] Etiket şeridini tek satır + yatay kaydırma yap
- [ ] Kaydırma çubuğu gizli ama erişilebilir kalsın (klavye + dokunma)
- [ ] Kartlar arası yükseklik tutarlılığı bozulmasın
- [ ] Kanıt: kart başına etiket satırı **2 → 1**, `scrollWidth > clientWidth`
      olan kart sayısı, 3 genişlikte taşma 0, `fit-test-lock` nöbeti

**Yapılan:** `.ft-meta` tek satıra alındı ve yatay kaydırma verildi.
Kaydırma deyimi **uydurulmadı** — kabuktaki `.row-track` ile aynı:
gizli çubuk · x-snap · `overscroll-behavior-x:contain` · dokunma momentumu.
`.row-track`ın kendisi kullanılmadı: o kart rayı (`>*{width:274px}`), burada çip var.
Ayrıca sağ uca **22px soluklaşma** eklendi — çubuk gizli olduğu için şeridin
devam ettiği başka türlü anlaşılmıyordu.

**Kanıt (390 · 1024 · 1440):**
7 kartta çok satırlı etiket şeridi **2 satır → 0** · `flex-wrap` hepsinde `nowrap` ·
kaydırılabilir şerit 5 (@1440) · 0 (@1024, sığıyor) · 7 (@390) ·
**kart yükseklikleri tekleşti** (@1440 hepsi 359px, @1024 hepsi 338px — önce
etikete göre değişiyordu) · yatay taşma **0** (üç genişlikte de).
---

## M13 · Fit Testi Detay · boşluk hiyerarşisi ve kutu tasarımı — `KAPANDI`

**İstek (Beyar, birebir):**
> "Test sorularındaki bu boşluk hiyerarşisini tekrardan revize et.
> `fit-testi-detay-v1.html?test=baslangic-seviyesi` buralarda.
> Mesela 'Kimler için uygun olduğu' yazıyor ya — 'Bu test sana uygun olabilir',
> 'Şimdilik erteleyip uzmana danış' — **buralar saçma olmuş**.
> Burası için bir **frontend skill çıkart, Playwright ile kontrol etsin**,
> best practice bir UI/UX standardına göre buradakileri düzelt.
> Daha iyi bir tasarım yapabilirsin. Burası **düz yazı olabilir**,
> **justify'a dikkat et**. Daha düzgün, daha standart bir yapı yapsan iyi olur.
> Bir de buradaki **info yazılarını genişlikte yay**.
> Bir de buradaki test soruları vs kötü olmuş — mesela **divider'a üstten çok
> yakın**, böyle olmaması gerekiyor, düzeltmen gerekiyor."

**Üç ayrı kusur:**
1. [ ] "Kimler için uygun olduğu" — yeşil kutu + sarı kutu ikilisi; boşluk
       hiyerarşisi bozuk, kutular kartın genişliğini doldurmuyor, iki kutu
       arası ritim yok. Düz yazı kurgusu değerlendirilecek; `text-align:justify`
       kullanılacaksa kelime aralığı kontrol edilecek (Türkçe'de justify
       kolayca "nehir" yapar — ölçülmeden açılmayacak).
2. [ ] Üstteki yeşil bilgilendirme kutusunun metni kart genişliğine yayılsın
       (**M5 ile aynı kusur**)
3. [ ] Uygunluk taraması soru listesinde soru metni ile üstteki ayraç arası
       boşluk çok az — dikey ritim düzeltilecek

**Kanıt:** kutu genişliği / kart genişliği oranı, soru–ayraç arası ölçülen px
(önce/sonra), `fit-test-lock` nöbeti, 3 genişlikte ekran görüntüsü.

**Yapılan — üç kusurun üçü de:**
1. **İŞARETLEME HATASI.** `.ft-two` ızgarası erken kapanıyordu: "is-ok"
   kutusundan sonra fazladan bir `</div>` vardı, "is-no" ızgaranın DIŞINDA
   kalıyordu. Beyar'ın "saçma olmuş" dediği görüntü buydu — yeşil kutu yarım
   kolon, sarı kutu tam genişlik. Düzeltildi.
2. **`<legend>` TUZAĞI.** `.ft-q{padding:13px 0}` yazıyordu ama `<legend>`
   fieldset'in `padding-top`'unu ATLAR (kenarlık bandına yerleşir).
   Ölçüm: ayraç → soru metni **0px**. Nefes legend'in kendi dolgusuna taşındı.
3. **YAKINLIK TERSTİ (Gestalt).** soru↔seçenek 21px (gevşek),
   seçenek↔ayraç 14px (sıkı) — seçenekler kendi sorusundan çok bir sonrakine
   yapışık okunuyordu. Oran ters çevrildi.
4. `.ft-lock p` 420px → 560px (%45 · 47 kar/satır → %61 · ~63 kar/satır).
   560 uydurma değil, deponun kendi ölçüsü (`.lib-sub`).

**Kanıt:**
- İki kutu aynı ızgarada, eşit: @1440 **386/386px**, @1024 **480/480px**,
  aynı satır ✓, eşit yükseklik 143px. @390 tek kolona iniyor ✓.
- Soru ritmi: ayraç→metin **0 → 23px** · metin→seçenek **14px** ·
  seçenek→ayraç **23px** (4px ızgarasına oturuyor).
- Sayfadaki tüm kutulu notlar eşiğin üstünde: `.hr-note p` %97 ·
  `.ft-safe li` %89 · `.ft-who li` %99.
- Denetçi: **3 hata · 19 uyarı** · JS hatası 0.

**Sondaya kural eklendi:** `<legend>` tuzağı artık `tests/uiux-denetim.mjs`
başlık 7d olarak ölçülüyor — metnin gerçek yeri Range ile alınıyor, kutuyla değil.
Aynı hata başka fieldset'te tekrarlarsa nöbet yakalar.
---

## M14 · Frontend/UI-UX denetim skill'i (Playwright'lı) — `KAPANDI`

**İstek (Beyar, birebir):**
> "Burası için bir frontend skill çıkart, Playwright ile kontrol etsin,
> best practice bir UI/UX standardına göre."

**Ne olacak:** bir sayfayı açıp **ölçerek** kusur raporlayan, tekrar
çalıştırılabilir bir denetçi. İzlenim değil sayı üretecek (`DENETIM.md` §1).

**Ölçeceği asgari başlıklar (taslak — Beyar onaylayacak):**
- Dikey ritim: kardeş bloklar arası boşluklar bir ölçekten mi geliyor
- Metin genişliği: gövde metni kabının kaç %'sini kaplıyor (M5/M13'ün kusuru)
- Tipografi hiyerarşisi: h1→h2→h3 punto/ağırlık sıralaması bozuk mu
- Dokunma hedefi: interaktif öğeler ≥44×44 mü
- Kontrast: metin/zemin oranı WCAG AA'yı geçiyor mu
- Yatay taşma: 390 / 1024 / 1440'ta `scrollWidth > clientWidth` var mı
- Hizalama: aynı sütundaki öğelerin sol kenarları ortak ızgarada mı
- Görünürlük: `getClientRects().length > 0` (`DENETIM.md` §2)

**Not:** depoda zaten `design-review` ve `uiux-review` skill'leri var ama
Playwright'la ÖLÇMÜYORLAR. Bu skill onların ölçen karşılığı olacak;
`tests/_pw.mjs` çözücüsünü kullanacak.

**Yapılacaklar:**
- [ ] Başlık listesini ve eşikleri Beyar'a onaylat
- [ ] Skill'i yaz (`.claude/skills/` altında) + `tests/` içine sonda
- [ ] Önce M13'ün sayfasında koştur, bulduklarını rapor et

**Yapılan:**
- `tests/uiux-denetim.mjs` — sekiz başlıkta ölçen sonda. Her bulgu
  "ölçülen + eşik + eşiğin kaynağı" üçlüsüyle basılır.
- `.claude/skills/uiux-denetim/SKILL.md` — skill tanımı, körlük uyarıları dâhil.

**SONDANIN KENDİ KÖRLÜĞÜ İKİ KEZ YAKALANDI** (`DENETIM.md` uyarısı birebir
tuttu — sonda önce şüphelidir):
1. Kontrast: görsel/gradyan zeminli ve şeffaf sabit kaptaki metinler
   `1.00–1.05:1` diye **sahte hata** üretiyordu (16 bulgunun 11'i).
   Düzeltildi: zemin bilinemiyorsa **ölçülmez**, rapor kaç tanesini
   atladığını yazar.
2. Dokunma hedefi: gizlenmiş `<input>`ler **45 sahte** "13×13 / 1×1" bulgusu
   üretiyordu. Düzeltildi: ölçüm saran `<label>`'a kaydırılır.

**Kanıt (fit-testi-detay-v1, 390·1024·1440):** 336 öğe ölçüldü ·
**3 hata · 19 uyarı** · JS hatası **0** · kontrastı ölçülemeyen 19 (raporlanıyor).
Sonda M5'in kusurunu bağımsız olarak buldu: `%45 · %54 · %57 · %61 · %63`.
---

## M15 · Hesap dropdown'ı: başlıksız, DadaDiet kalıbı — `KAPANDI`

**İstek (Beyar, birebir):**
> "Dropdown kısmı **section'lı başlıksız** olacak — yani aynı Diet'in
> dropdown'ındaki tab menü yapısını alabilirsin."

**Şu anki hâli (DadaFit):** grup başlıkları var (`GÜNLÜK TAKİBİM` ·
`GELİŞİMİM` · `PROFİL VE ÜYELİK`) ve her kalemin altında **açıklama satırı**
("Günlük denge · su · haftalık özet", "Tamamlanan antrenman ve aktiviteler"…).
Menü uzuyor, iki satıra taşan kalemler var, kaydırma çubuğu çıkıyor.

**Hedef (DadaDiet):** başlık **yok**, açıklama **yok**.
İkon + tek satır etiket; gruplar arası **ince ayraç** çizgisiyle ayrılıyor;
aktif kalem yumuşak yeşil hap ile işaretli; en altta "Çıkış".

**Yapılacaklar:**
- [ ] Kabuktaki hesap menüsü üreticisini bul (`fit-shell.js` → `acct-*`)
- [ ] Grup başlıklarını ve kalem açıklamalarını kaldır, ayraca çevir
- [ ] Kalem sırası ve hedefleri KORUNSUN (menü kalemi kaybolmayacak)
- [ ] Aktif kalem işaretlemesi DadaDiet'teki gibi
- [ ] Kanıt: menü kalemi sayısı önce/sonra **eşit**, kırık hedef **0**,
      menü yüksekliği önce/sonra, `plan-account` nöbeti yeşil
      (o nöbet "menü 11 bağlantı · 3 grup başlığı" diye ÖLÇÜYOR —
      başlık 3 → 0 olunca **nöbetin beklentisi de güncellenmeli**)

**Yapılan:** `accountHtml()` içinde `{grup:'…'}` kalemi artık başlık değil
**ayraç** basıyor; kalemlerin `desc` alt satırı basılmıyor. Kalemler ve sıraları
değişmedi. `desc` verisi DURUYOR — mobil çekmece (`drawerAccountHtml()`) onu
kullanmaya devam ediyor, orada dikey alan bol.
İlk grup profil başlığının hemen altında olduğu için ayraç basmıyor (çift çizgi
olurdu).

**Kanıt (@1440, üye kipi):** grup başlığı **3 → 0** · ayraç **4** ·
bağlantı **11** (değişmedi) · kalem açıklaması **0** · iki satıra taşan kalem **0** ·
kırık hedef **0**.

**Nöbet beklentisi güncellendi:** `plan-account` "TAM 3 grup başlığı" diye
ölçüyordu — M4'teki gibi, ASIL şart (11 kalem, adlar, sıra) korunarak
gruplamanın NASIL gösterildiği kısmı değiştirildi: artık "grup başlığı 0 +
ayraç ≥3 + kalem açıklaması 0" şart koşuluyor. Gruplama sessizce kaybolursa
yine kırmızı yanar. Nöbet **0 sorun**.
---

## M16 · Tarif bandı: gerçek tarif kartları + düz etiket + Gastro rengi — `KAPANDI`

**İstek (Beyar, birebir):**
> "Buraya tarif kartları gelecek — **bunlar tarif kartı değil**.
> Etikette tamam DadaGastro zaten ama **filled tagchip** ile yapılmış,
> taglı olmasın **düz olsun**.
> Bir de burada **DadaGastro'nun rengi** olması lazım, burada Fit rengi var."

**Yapılan — üç iş:**
1. Kartlar: `.df-combo-card` ANA GÖRSELİ ANTRENMAN fotoğrafıydı, yemek altta
   küçük cam panelde duruyordu — yani antrenman kartıydı. Kardeş markanın
   tarif kartı yapısına geçildi (`dadagastro.com` `.r-card` ölçüldü:
   görsel 200px · sol üstte kategori çipi 6/12 dolgu · gövde 17/18/19 ·
   başlık 18px · alt satır `border-top`). Ana görsel artık **yemek**.
2. Etiket: `.dg-mark` zemin + kenarlık + dolgu kaldırıldı, düz metne çevrildi;
   marka kilidi (Dada kalın + Gastro ince) korundu.
3. Renk: perde koyu-yeşilden **sıcak koyu**ya, vurgular `#E14827` ailesine.

**VERİ UYDURULMADI:** tarif adları, yemek görselleri ve protein/kcal değerleri
bu bölümde zaten vardı; kategori çipi sayfanın kendi eşleştirmesinden
("HIIT/Yoga/Güç" → "… sonrası"). Gastro kartındaki süre/zorluk/porsiyon ve
yazar/puan alanları **EKLENMEDİ** — o veri bu depoda yok.

**Kanıt (390 · 1024 · 1440):** tarif kartı **3** · eski combo kart **0** ·
kolon 3/2/1 · yemek görseli **3/3** · etiket zemini `rgba(0,0,0,0)`,
kenarlık **0px none**, dolgu **0px** · bölümde **Fit yeşili 0** ·
kart yükseklikleri tek değer (336px) · yatay taşma **0**.

---

## M17 · Enerji Defteri profili → DadaGastro şef profili kalıbı — `KAPANDI`

**İstek (Beyar, birebir):**
> "enerji-defteri'nin profilini DadaGastro'nun aynısı yap dedim, burası düz
> bannerlı — `dadagastro.com/sefler/admin`, burasının aynısını yapacaksın."

**ÖLÇÜM — üç kaynak yan yana:** kalıp DadaFit'te **zaten vardı**
(`profil-v1.html` → `.pf-top`, Gastro'yla **aynı sınıf adları ve aynı
ölçüler**: kapak 280/24px · avatar 128 · stats 16px). Plan sayfaları onu
kullanmıyordu; 544px düz koyu banner + altta küçük avatar satırı vardı.

**Yapılan:** kabuğa "PLAN PROFİL BAŞLIĞI" bloğu; `#fitPlanTop` enjeksiyonu
koyu banner yerine profil başlığı basıyor (**14 sayfa**). `profil-v1`'e
DOKUNULMADI — onun 69 rol-koşullu kuralını (diyetisyen/antrenör/işletme ·
fiyat · randevu) taşımak yerine ölçülen değerlerle sade sürüm yazıldı.
Kapak görseli **parallax** (kardeş markada da `.pf-banner px-band`).

**TUZAK KAPATILDI:** banner beyaza dönünce şeffaf header marka yazısını da
beyaz boyuyordu → logo görünmez olacaktı. Plan sayfaları `over-mode`
listesinden çıkarıldı. Aynı gerekçeyle kırıntı renkleri de beyaz zemine
göre düzeltildi (ölçüldü: bağlantılar `rgba(255,255,255,.6)` ile görünmüyordu).

**Kanıt:** @1440 kapak **1176×280 · 24px · görselli · parallax var** ·
avatar **128×128 · %50** · kimlik binmesi **−78px** · @390 kapak 170/16px ·
avatar 104 · binme −52px · eski koyu banner **0** ·
`data-fit-over` **null** · header zemini **beyaz** · marka yazısı
**rgb(33,30,22)** (okunur) · yatay taşma **0** · JS hatası **0**.

---

## M18 · Antrenör profilinde sekmeler ortalansın — `KAPANDI`

**İstek:** "Profilde tablar var ya, onlar merkezi olsun."
**Yapılan:** `.cp-tabbar .fit-tabs{justify-content:center}`. Ray tam
genişlikte kaldı (tıklama alanı ve kaydırma bozulmasın), kalemler ortalandı.
**Kanıt:** `justify-content: center` ölçüldü.

---

## M19+M20 · Görüş Bildir şeridi: banner merkezine hizalı + DadaHaber kalıbı — `KAPANDI`

**İstek (Beyar, birebir):**
> "Görüş Bildir butonu her tarafta yukarı çekilecek, **banner'ın merkezinin
> hizasında** olacak."
> "DadaHaber ana sayfadaki **sağ dikey şerit** gibi olsun, **Fit'in brand
> renginde**."

**Yapılan:**
- Konum: CSS'te `top:50%` idi — VIEWPORT ortası. Banner yüksekliği sayfaya
  göre değişiyor (544 · 560 · 607 · 726) ve pencere boyu da değişken; ikisi
  hiçbir zaman denk gelmiyordu. Kabuk JS'i banner merkezini ölçüp `--fb-top`
  yazıyor; banner yoksa eski `50%` yedeği kalıyor.
- Biçim: ince `rotate(90deg)` hapı yerine kalın dikey blok — sol köşeler
  yuvarlak, BÜYÜK HARF 800 ağırlık, ikon üstte, belirgin gölge.
  Renk DadaFit yeşili (K29: ölçü alınır, palet alınmaz).
  `writing-mode` kullanıldı, `rotate` değil: kutu gerçekten dikey olduğu için
  yükseklik/dolgu öngörülebilir ve dokunma hedefi doğru ölçülür.

**SONDANIN YAKALADIĞI:** `writing-mode:vertical-rl` eksenleri çeviriyor —
`flex-direction:column` ikonu metnin ÜSTÜNE değil YANINA koydu. Satır içi
eksen gerektiği için `row`'a alındı; ikon ölçümle üstte doğrulandı.

**Kanıt (4 farklı banner tipinde):** şerit merkezi ↔ banner merkezi
**sapma 0px** (272/272 · 272/272 · 280/280 · 323/323) ·
51×169 · `rgb(0,157,79)` · `border-radius 12px 0 0 12px` ·
`writing-mode vertical-rl` · `uppercase` · ağırlık **800** · ikon üstte ·
JS hatası **0**.

---

## Kurallar (bu tur için)

- Madde sırası Beyar'ın verdiği sıra: M1 … M15 (ilk tur) → M16 → M17 → M18 → M19+M20 (ikinci tur).
- Her madde kapanışında **sayı** üret; "yaptım" kanıt değil (`DENETIM.md` §1).
- Görünürlük `getClientRects().length > 0` ile ölçülür (`DENETIM.md` §2).
- Kabuk (`fit-shell.css` / `fit-shell.js`) ortak kaynak; oraya yazılan her
  kural 60+ sayfayı etkiler — gerekçesi yorumda durmak zorunda.
- Sonda 0/boş dönerse önce **sondadan** şüphelen, görüntüye bak.
