# DadaFit Arayüz Kiti — ÖLÇÜLMÜŞ DEĞERLER

> 🔴 **Bu dosya kaynak değil, ÖLÇÜM.** Değerler 2026-08-29'da çalışan
> kabuktan (Playwright · 1440×1200 · Chromium) `getComputedStyle` ile
> okundu — CSS'ten göz kararı kopyalanmadı, sekiz sayfa gezilip her
> bileşenin GÖRÜNÜR ilk örneği ölçüldü.
>
> **Kural:** yeni sınıf, yeni renk, yeni ölçü ÜRETİLMEZ. Buradaki bir
> değeri kullan; karşılığı yoksa **DUR ve sor**. Kitte olmayan bir şeyi
> uydurmak, dört ekranın birbirine benzememesi demektir.
>
> Ölçüm betiği: `docs/qa/kit-olcum.mjs` — değiştirdiğinde yeniden koş.

## 1 · Renk ve ölçü tokenleri

Token sistemi `assets/css/fit-shell.css`'in `:root` bloklarıdır — **76 benzersiz değişken** ölçüldü.

⚠ **R16/1'de 70 → 76.** Form kiti üç sayfadan kabuğa taşınırken ölçüldü ki
kabukta **hiç tehlike/uyarı tokeni yoktu** (`danger` geçişi 0); taşınan
kurallar onları okuyordu. Altı token eklendi — **yeni renk üretilmedi**,
değerler `hesabim-v1`in kendi `:root`undan birebir alındı (`odemelerim-v1`
zaten üçünü tekrarlıyordu):
`--hs-danger` `#b3261e` · `--hs-danger-dark` `#8c1d17` · `--hs-danger-tint`
`#fdecea` · `--hs-danger-line` `rgba(179,38,30,.34)` · `--hs-warn` `#8a4b00` ·
`--hs-warn-tint` `#fdf3e4` · `--hs-warn-line` `rgba(138,75,0,.30)`.
Sayma yöntemi CLAUDE.md'deki bağlayıcı yöntemdir; yeniden ölçüldü.

**Marka**

| Token | Değer |
|---|---|
| `--fit-header-h` | `113px` |
| `--fit` | `#009d4f` |
| `--fit-deep` | `#007a3d` |
| `--fit-deeper` | `#00572b` |
| `--fit-ink` | `#006a35` |
| `--fit-tint` | `#eaf6ef` |
| `--fit-wash` | `#e8f6ee` |
| `--fit-line` | `#d8ebe0` |
| `--fit-bright` | `#34c47e` |
| `--fit-dark` | `#211E16` |

**Metin**

| Token | Değer |
|---|---|
| `--slate` | `#211E16` |
| `--slate-2` | `#56514a` |
| `--muted` | `#717171` |
| `--ink` | `#211E16` |

**Zemin**

| Token | Değer |
|---|---|
| `--paper` | `#ffffff` |
| `--bg` | `#f9f9f9` |
| `--bg-white` | `#ffffff` |
| `--bg-cream` | `#f9f9f9` |
| `--cream` | `#EFE5D3` |
| `--cream-2` | `#F7F1E6` |

**Çizgi**

| Token | Değer |
|---|---|
| `--line` | `#ECECEC` |

**Ölçü**

| Token | Değer |
|---|---|
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `24px` |
| `--sh-sm` | `0 1px 2px rgba(33,30,22,.04), 0 2px 6px rgba(33,30,22,.05)` |
| `--sh-lg` | `0 18px 50px rgba(33,30,22,.16)` |
| `--sec-pad` | `74px` |
| `--sec-pad-sm` | `32px` |
| `--wrap` | `1240px` |
| `--ease` | `cubic-bezier(.22,.61,.36,1)` |

## 2 · Kart kiti

| | `.fp-card` | `.pnl-card` | `.ex-card` / `.pr-card` | `.cc-card` |
|---|---|---|---|---|
| **Zemin** | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgba(0, 0, 0, 0)` |
| **Kenarlık** | `1px solid rgb(236, 236, 236)` | `1px solid rgb(236, 236, 236)` | `1px solid rgb(236, 236, 236)` | `0px none rgb(255, 255, 255)` |
| **Köşe yarıçapı** | `16px` | `16px` | `16px` | `24px` |
| **Gölge** | `rgba(33, 30, 22, 0.04) 0px 1px 2px 0px, rgba(33, 30, 22, 0.05) 0px 2px 6px 0px` | `rgba(33, 30, 22, 0.04) 0px 1px 2px 0px, rgba(33, 30, 22, 0.05) 0px 2px 6px 0px` | `rgba(33, 30, 22, 0.04) 0px 1px 2px 0px, rgba(33, 30, 22, 0.05) 0px 2px 6px 0px` | `rgba(33, 30, 22, 0.09) 0px 6px 22px 0px` |
| **İç dolgu** | `38px 24px` | `0px` | `0px` | `0px` |

`.pr-card` `.ex-card` ile **birebir aynı kabuktur** (fit-shell.css: tek kural, beş sınıf).

## 3 · Tipografi

| Rol | Seçici | Boyut / Ağırlık / Satır | Harf aralığı | Renk |
|---|---|---|---|---|
| Sayfa başlığı | `h1` | `29px/700/32.48px` | `-0.58px` | `rgb(33, 30, 22)` |
| Bölüm başlığı | `h2` | `34px/700/38.08px` | `-0.68px` | `rgb(33, 30, 22)` |
| Kart başlığı | `kart başlığı` | `17.5px/700/19.6px` | `-0.35px` | `rgb(33, 30, 22)` |
| Alt metin | `lead` | `15.5px/500/24.025px` | `normal` | `rgb(113, 113, 113)` |
| Üst etiket | `eyebrow` | `12px/700/18.6px` | `1.92px` | `rgb(0, 122, 61)` |

## 4 · Düğme kiti

| | Birincil `.btn-primary` | Fit `.btn-fit` | Çizgi `.btn-line` | Hayalet `.btn-ghost` |
|---|---|---|---|---|
| **Yükseklik (px)** | `45` | `52` | `50` | `52` |
| **İç dolgu** | `14px 26px` | `14px 26px` | `14px 26px` | `14px 26px` |
| **Yarıçap** | `12px` | `12px` | `12px` | `12px` |
| **Yazı** | `14.5px/700/normal` | `14.5px/700/22.475px` | `14.5px/700/22.475px` | `14.5px/700/22.475px` |
| **Zemin** | `rgb(0, 157, 79)` | `rgb(0, 122, 61)` | `rgba(0, 0, 0, 0)` | `rgb(255, 255, 255)` |
| **Kenarlık** | `0px none rgb(255, 255, 255)` | `0px none rgb(255, 255, 255)` | `0px none rgb(33, 30, 22)` | `1px solid rgb(236, 236, 236)` |
| **Metin rengi** | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgb(33, 30, 22)` | `rgb(33, 30, 22)` |

## 5 · Rozet ve çip kiti

| | `.fp-badge` | `.df-fchip` | `.pstat` |
|---|---|---|---|
| **Yükseklik (px)** | `30` | `35` | `26` |
| **İç dolgu** | `5px 11px` | `9px 16px` | `4px 10px` |
| **Yarıçap** | `8px` | `8px` | `8px` |
| **Yazı** | `11.5px/800/17.825px` | `13px/600/normal` | `11.5px/700/17.825px` |
| **Zemin** | `rgb(244, 244, 243)` | `rgb(0, 157, 79)` | `rgb(230, 241, 244)` |
| **İkon aralığı** | `6px` | `7px` | `6px` |

Durum sınıfları: `.ok` (yeşil) · `.wait` (sarı) · `.off` (nötr) · `.stop` (kırmızı). **Yeni durum rengi üretilmez.**

## 6 · Sekme şeridi

| | `.fit-tabs` (kap) | `.fit-tab` (kalem) |
|---|---|---|
| **Yükseklik (px)** | `46` | `44` |
| **İç dolgu** | `4px` | `10px 18px` |
| **Yarıçap** | `12px` | `8px` |
| **Yazı** | `16px/500/24.8px` | `13.5px/700/normal` |
| **Zemin** | `rgb(255, 255, 255)` | `rgb(0, 122, 61)` |
| **Kalemler arası** | `4px` | `8px` |

İki kip var, ikisi de aynı bileşendir (`[data-fit-tabs]`):
- **Sayfa geçişi:** kalemler `<a>`, aktif olan `aria-selected="true"` + `aria-current="page"`.
- **Panel kipi:** kalemler `<button data-tab="…">`, panelleri `.fit-pane[data-pane="…"]`.
  Rol/aria/klavye/roving-tabindex kabukta kurulur, sayfada tekrarlanmaz.

🔴 **R15 · dokunma hedefi 44px.** Kalem yüksekliği 36px'ti (13.5px yazı + 10px
dolgu) ve kitin kendi 44px hedefinin altında kalıyordu — beş modül sayfasında
birden. Beyar kararıyla `.fit-tab`e `min-height:44px` verildi; **dolgu
değiştirilmedi** (dolgu büyüseydi kalemler arası yatay ritim de kayardı, oysa
kusur yalnız dikeydi). Ölçüldü: yedi sayfa × üç genişlikte **44px**, kap 54px,
taşma 0.

Modül sayfalarında şerit **ortalıdır** (ölçüldü: sol 344 / sağ 344, grup merkezi 720 = sayfa merkezi 720).

## 7 · Form alanları

| | `input` | `textarea` | `label` |
|---|---|---|---|
| **Yükseklik (px)** | `44` | `108` | `19` |
| **İç dolgu** | `0px 14px` | `13px 15px` | `0px` |
| **Yarıçap** | `8px` | `12px` | `0px` |
| **Yazı** | `14px/500/21.7px` | `14px/500/normal` | `12.5px/500/18.75px` |
| **Kenarlık** | `1px solid rgb(236, 236, 236)` | `1px solid rgb(236, 236, 236)` | `0px none rgb(113, 113, 113)` |
| **Alt boşluk** | `0px` | `0px` | `16px` |

## 8 · Boşluk ritmi ve kolon

| Ölçü | Değer | Nereden |
|---|---|---|
| Bölüm dikey dolgusu | `74px` | `--sec-pad` |
| Bölüm dolgusu (küçük) | `32px` | `--sec-pad-sm` |
| Kart iç dolgusu | `38px 24px` | ölçüldü `.fp-card` |
| Kart içi satır aralığı | `10px` | ölçüldü |
| Liste satırı yüksekliği | `76px` / `76px` | `.fp-row` / `.set-row` |
| Liste satırı dolgusu | `14px 0px` / `17px 2px` | ölçüldü |
| Sayfa kabı `.wrap` | `1240px` (1440 ekranda 100/100 kenar boşluğu) | ölçüldü |
| **Modül okuma kolonu** | `860px`, ortalı | R15/3 kararı — arama · çip · akordiyon · talep kartı aynı kolonda |

## 9 · Boş durum kiti

`.fpx-bos` (modül) · `.lib-empty` (liste) — ölçülen: dolgu `38px 24px`, aralık `10px`.

Yapı sabittir ve **dört parçası da yazılır**:
```html
<div class="fp-card fpx-bos">
  <span class="pe-ico"><i class="fa-solid …"></i></span>   <!-- 56px daire, --fit-tint zemin -->
  <h4>Ne yok</h4>                                          <!-- 16.5px/700 -->
  <p>Neden yok ve ne yapılırsa dolar</p>                   <!-- 14px/500, max 56ch -->
  <a class="btn btn-primary" href="…">Tek eylem</a>        <!-- isteğe bağlı -->
</div>
```
Boş ekran bir davettir: "veri yok" yazıp bırakmak kusurdur.

## 10 · Kaydetme düğmesi (`.kyt-btn`)

Dokunma hedefi `44×44px` (WCAG 2.5.8), görsel daire 40px.
Kart `<div>`, bağlantı başlıktadır (`.kyt-link::after` kartı kaplar), düğme z-index 4'te onun üstündedir.
Durum `FIT_KAYIT.kayitli()`den okunur — ikon ayrı bir durum tutmaz.

## 11 · Dokunulmayacaklar

- `assets/js/fit-shell.js` ve `assets/css/fit-shell.css`'e **yalnız Ajan 4** yazar.
- Font Awesome 6.5.2 CDN'den gelir; yeni ikon seti eklenmez.
- Kare/oranlı görsel `<img>` değil, `div` + `background-image` + `cover/center`.
- Sayfa scriptleri kabuğun ID'leriyle (`#fbModal` ailesi) çakışan ad kullanmaz.
- Maket ekranlar (ödeme · fatura · kart · liderlik · randevu · destek yazışması)
  başlarında **tek dürüst şerit** taşır; düğme başına rozet serpilmez.

---

## 12 · Kart üstü öğe yerleşimi — DÖRT KÖŞE SÖZLEŞMESİ

🔴 **Kaydet düğmesi (`.kyt-btn`) sağ ÜST köşeyi tek başına tutar.**
`top:8px · right:8px · 44×44` ve `z-index:4` — kartı kaplayan görünmez
bağlantı yüzeyinin (`.kyt-link::after`, z-index 3) üstünde. O köşeye başka
bir öğe konulmaz; konulursa düğmenin altında kalır ve okunmaz.

| Köşe | Ne durur | Ölçü |
|---|---|---|
| Sol üst | Kategori / hedef rozeti (`.ex-cat` · `.pr-goal` · `.cm-state`) | `top:12px · left:12px` |
| **Sağ üst** | **YALNIZ `.kyt-btn`** — kayıt düğmesi yoksa boş kalır ya da tip rozeti (`.cm-len`) girer | `top:8px · right:8px` |
| Sol alt | Etiket / ekipman şeridi (`.ex-tags` · `.pr-tags`) | `bottom:12px · left:12px` |
| Sağ alt | Zorluk / seviye rozeti (`.ex-level` · `.pr-level`) | `bottom:12px · right:12px` |

**Sol üstte ikinci bir kalem gerekiyorsa** aşağı iner, sağa kaymaz
(`.pr-pro` → `top:46px · left:12px`).

**Dar kolonda alt sıra dikeye döner.** Ölçüldü (768 px, üç kolonlu ızgara):
görsel genişliği **222 px**, en geniş seviye rozeti **103 px**, en geniş
etiket şeridi **134 px** — yan yana sığmıyorlar. Bu bir hizalama ayarı
değil geometrik bir sınırdır; `641–900 px` arasında seviye rozeti alt sola,
etiketlerin bir sıra üstüne geçer (`left:12px · bottom:46px`). 1440 ve
1024'te yan yana sığıyor, orada değişmez.

**Ölçüm kapısı** (bir kart tipine kaydet düğmesi eklerken zorunlu):
kaydet düğmesinin sınır kutusu, aynı kart içindeki `position:absolute`
her öğeyle **0 px² kesişmeli** — üç genişlikte (1440 · 1024 · 390).
R15'te bu ölçüm yapılmadığı için `.ex-level` ve `.pr-level` düğmenin altına
düştü: kesişim **1162 px²**, iki sayfada **21 kartın 21'inde**, üç genişlikte de.
