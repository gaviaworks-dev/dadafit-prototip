# Yönetim Paneli — YAPICI BRİFİNGİ (R19)

> Bu belge ekran kuran her ajanın **önce** okuduğu sözleşmedir.
> Ölçüm belgeleri: `docs/gastro-olcum/` (5 dosya) — Gastro salt okuma ile ölçüldü.
> Referans ekran: **`admin-hareket-form-v1.html`** — çalışıyor, ölçüldü, çoğaltılacak.

---

## 0 · Değişmez kurallar

1. 🔴 **`assets/css/fit-admin.css` ve `assets/js/fit-admin.js`e YALNIZ lead yazar.**
   Kabukta eksik bir şey görürsen **DUR ve bildir** — sayfaya yamama.
   Aynısı `fit-shell.css` / `fit-shell.js` için de geçerli.
2. 🔴 **Commit atma.** Ajanlar tek git index paylaşır; lead tek elden commit'ler.
3. 🔴 **Kit dışına çıkma.** `docs/fit-kit.md` bir kısıttır. Yeni renk, yeni yarıçap,
   yeni gölge, yeni ölçü üretilmez. Karşılığı yoksa **DUR ve sor**.
4. 🔴 **Yeni form dili üretme.** Alan kalıbı Gastro'nunki (aşağıda), bileşen kabuğunki.
5. **Satır içi stil yazma.** Tek istisna: veri taşıyan değer (çubuk genişliği gibi).
6. **Ölü bağlantı yok, konsol hatası yok.** `href="#"` yasak; hedefi olmayan şey
   `<span aria-disabled="true">` olur (kit §14/1).
7. **"Yakında" yazma.** Depoda bugün 0 tane var, öyle kalsın.
8. **Test bakımıyla uğraşma.**

---

## 1 · Sayfa sözleşmesi — değişmedi

```html
<body class="adm-body" data-adm="<menu-id>">
  <div id="fitAdminTop"></div>
  <main class="adm-main"><div class="adm-page"> … </div></main>
```

`<head>` sırası (referans ekrandan birebir): FA CDN → `fit-shell.css` →
`fit-planim.css` → `fit-admin.css`.
Script sırası: `fit-shell.js` (`data-adm-yalniz-filtre="1"`) → veri modülleri →
`fit-admin.js` → sayfa scripti.

Her ekran **gövdede tek `<h1>`** (`.adm-head` içinde) + `.ph-sub` alt satır taşır.
Her ekran **tek `.adm-src` kaynak şeridi** taşır (`FIT_ADMIN.kaynak('canli'|'ornek', …)`).

---

## 2 · İki kalıp

### K-LİSTE — Gastro'nun ~30 ekranda aynı olan liste kalıbı
Ölçüm: `docs/gastro-olcum/liste-taksonomi-rozet.md` §1.

```
.adm-head        h1 + .ph-sub + sağda .h-acts  (ghost ikincil → Dışa Aktar → birincil "+ Yeni X")
.adm-src         kaynak şeridi
.adm-card
  .filter-bar    kartın İLK satırı: arama SOLDA (max 320px) + sağında süzgeç
  .adm-tw > table.adm-table    son kolon "Aksiyon", satır eylemi .adm-ico-btn
  .adm-pager     kartın İÇİNDE, en ayağında
  boş durumda tablo yerine dört parçalı boş durum (FIT_ADMIN.bos)
```

- **Toplu seçim KOYMA.** Gastro'da 47 kalemden 1'inde var; Fit'te yalnız
  `admin-moderasyon`da. Yeni ekrana eklenmez.
- **Sayfa üstünde arama YOK** — arama filtre şeridinde.
- Satır eylemi metinsiz ikon düğme; yıkıcı eylem `data-yikici="<ad>" data-fiil="sil"`
  taşır ve kabuk onay modalını **kendiliğinden** açar. Native `confirm()` **YASAK**.

### K-FORM — Gastro'nun sekiz içerik formunun ortak iskeleti
Ölçüm: `docs/gastro-olcum/form-kalibi.md` §1. **Referans: `admin-hareket-form-v1.html`.**

```
.back-link                    ← listeye dönüş
.adm-head                     ← h1 (düzenlemede kaydın adı) + .ph-sub
.adm-src
<form>
 .form-layout                 ← grid: minmax(0,1fr) minmax(280px,360px), gap 24
   .adm-card                  ← SOL
     .sa-form-tabs            ← form İÇİ sekme (Künye · … · SEO)
     .sa-form-panel[data-form-panel]
       .form-sec              ← bölüm; başlık .form-sec-tt
         .form-grid > .frow > label + .finput/.fselect/.ftext + .fhint
     .form-actions.c-foot     ← SAĞA yaslı: İptal(ghost) · Taslak(ghost) · Kaydet(primary)
   <aside class="side-card">  ← SAĞ, position:sticky
     Yayın kartı: Durum select + Yayın tarihi + toggle'lar
     SEO skoru kartı
     Tehlikeli bölge kartı (sil)
```

🔴 **Kaydet SAĞDA.** (Hesap ekranlarının "kaydet solda" kuralı burada geçmez.)
🔴 **Dil sekmesi YOK** — Fit tek dilli.
**Create ve edit AYNI dosyadır**; `?<anahtar>=<slug>` varsa düzenleme, yoksa yeni.

---

## 3 · Kabuk bileşenleri — `FIT_ADMIN.*`

Hepsi `assets/js/fit-admin.js` §"ORTAK BİLEŞEN KATMANI"de. Ölçüm ve gerekçe:
`docs/gastro-olcum/ortak-bilesenler.md`. **Kendin yeniden yazma, bunları çağır.**

| Çağrı | Ne yapar |
|---|---|
| `FIT_ADMIN.kaynak(tip, metin)` | kaynak şeridi (`'canli'` \| `'ornek'`) |
| `FIT_ADMIN.bos(ico, baslik, metin, eylem)` | dört parçalı boş durum |
| `FIT_ADMIN.rozet(durum, metin, ico)` | `.fp-badge` — `ok`·`wait`·`off`·`stop` |
| `FIT_ADMIN.toast(metin, {tip,ms})` | köşe bildirimi (`ok`·`danger`·`info`, 2600 ms) |
| `FIT_ADMIN.flash(tip, metin, kap)` | sayfa şeridi (`ok`·`error`·`warn`·`note`) |
| `FIT_ADMIN.onay({yikici,baslik,metin,onayla,onay})` | onay modalı |
| `data-yikici="Ad" data-fiil="sil\|arsiv\|yayin\|reddet\|iade"` | düğmeye yazarsan onay **kendiliğinden** açılır |
| `FIT_ADMIN.etiket(sel, {katalog,ad,ico,serbest,tekli,secili,ipucu})` | çoklu seçim / etiket |
| `FIT_ADMIN.sirala(sel, {oge,tutamak,degisti})` | sürükle-bırak + klavye (↑/↓) sıralama |
| `FIT_ADMIN.tekrar({liste,ekle,sablon,oge,enAz,enCok,degisti})` | tekrarlayan satır (repeater) |
| `FIT_ADMIN.editor(textarea, 'varsayilan'\|'satir'\|'govde')` | zengin metin editörü |
| `FIT_ADMIN.medya({tekli, sec:fn})` | medya kütüphanesi modalı |
| `FIT_ADMIN.yukle(sel, {cok,enCok,not,degisti})` | görsel yükleme alanı (+ kütüphane) |
| `FIT_ADMIN.seo(form, kutu)` | SEO skoru halkası + 6 ölçüt listesi |
| `FIT_ADMIN.aramaKur(girdi, tablo, sayac)` | tabloda yerinde arama + boş durum |
| `FIT_ADMIN.maketKaydet(dugme, ne, form)` | **formu üçüncü argüman olarak VER** |
| `FIT_ADMIN.n(x)` · `.tl(kurus)` · `.tarih(iso)` · `.esc(s)` | biçimleyiciler |

### Repeater şablonu (referans ekrandan)
`<template>` içine `.st-card` yaz; `.st-num` · `.st-body` · `.st-side` (`.ie-drag` + `.ie-del`).
Gizli `<input data-field="position">` sırayı taşır, sürücü 0'dan yeniden yazar.

---

## 4 · Dürüstlük — bu bir maket

- **Sunucu yok.** Kaydet formu **doğrular**, kaydetmez. `maketKaydet` bunu yazıyla söyler.
- **Örnek veri uydurma.** Tarayıcıda okunabilen gerçek veri varsa **o okunur**:
  `FIT_ADMIN_VERI` (hareket · sözlük · test · program · sayfa) ·
  `FIT_MEDYA_VERI` (85 görsel, depodan sayıldı) · `SOZLUK_VERI` (254 terim) ·
  `ANATOMI_VERI` · `FIT_CHALLENGE` · `FIT_ROZET` · `FIT_PAKET` · `FIT_FATURA` · `FIT_SU`.
  Ekran hangisini okuduysa `.adm-src` şeridi **onu** söyler.
- Kaynağı olmayan alan **"—"** kalır.
- Bir ekranın verisi kısmen gerçek kısmen örnekse **ikisi de söylenir**.
- 🔴 **HUKUKİ · TIBBİ · TİCARİ karar gerekiyorsa DUR ve lead'e bildir.**
  (Yasal metnin kendisini yazmak, sağlık uyarısı üretmek, fiyat/komisyon rakamı
  koymak bu sınıfa girer. K13: para sayıları koda gömülmez, alan olarak durur.)

---

## 5 · Bitirme ölçüsü — ekran başına

Her ekranı bitirince kendi ölçümünü koş ve **sayıyla** bildir:

```
BASE=http://127.0.0.1:8788 PW_HOME=~/.pw node docs/qa/admin-denetim.mjs
BASE=http://127.0.0.1:8788 PW_HOME=~/.pw node docs/qa/admin-kalip-denetim.mjs
```

Geçmesi gerekenler: yatay taşma **0** (1440·1024·768·390) · konsol hatası **0** ·
ölü bağlantı **0** · `.adm-*`/`.btn` ailesinde 44px altı **0** · kaynak şeridi **1** ·
gövdede `h1` **1** · boş durum dört parça.

Yeni ekranlar `MENU` dizisine **lead tarafından** eklenir — sen ekleme.
Dosyanı bitirdiğinde lead'e: dosya adı · `data-adm` değeri · menü bölümü önerisi ·
ölçüm sayıları · varsa DUR gerekçesi.
