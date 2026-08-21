# AJAN-C · R8 RAPORU — kalem 11 · 12 · 13 · 14 + ORTAK MODAL İSKELETİ

**Yeni dosya:** `assets/js/fit-modal.js` (8.1 KB)
**Değiştirilen:** `anatomi-v1.html` · `profil-v1.html` · `tests/modal-anatomi.mjs` (yeni sınama)
**Dokunulmadı:** `antrenor-detay-v1.html` (AJAN-G) · `fit-shell.css` · `fit-shell.js` (AJAN-A)

---

## 1 · ÖLÇÜM TABLOSU — düzeltme sonrası

Sunucu `http://localhost:8811`, Playwright. Her hücre gerçek etkileşimle ölçüldü:
tetikleyiciye tıkla → aç → davranışı uygula → `.show` sınıfı ve `body` computed
`overflow` yeniden oku.

> **DÜZELTME (AJAN-G'nin bulgusundan sonra).** Bu tablo ilk hâlinde **altı**
> kolonluydu ve **açılış odağını hiç ölçmüyordu**. AJAN-G kusuru buldu:
> `ac()` tek `requestAnimationFrame` bekliyordu, kap `visibility .25s` geçişi
> taşıdığında o karede computed `visibility` hâlâ `hidden` ve
> `visibility:hidden` alt ağacındaki `.focus()` **sessizce hiçbir şey
> yapmıyor**. Kusuru **odak tuzağı maskeliyordu**: ilk Tab'da
> `if (!m.panel.contains(akt))` dalı odağı içeri çekiyor, o yüzden tuzak
> ölçümü yeşil geliyordu. Kolon eklendi; tablo yedi kolonlu.

| Sayfa · modal | açılış odağı | Esc | dışarı | kapat | odak dönüşü | scroll kilidi | odak tuzağı (20 Tab) |
|---|---|---|---|---|---|---|---|
| `profil-v1` · `#aptModal` | ✅ `aptClose` | ✅ | ✅ | ✅ | ✅ | ✅ `clip visible`→`hidden`→`clip visible` | 20/20 ✅ |
| `profil-v1` · `#msgModal` | ✅ `msgClose` | ✅ | ✅ | ✅ | ✅ | ✅ `clip visible`→`hidden`→`clip visible` | 20/20 ✅ |
| `anatomi-v1` · panel @390 dokunmatik | ✅ `an-kapat` | ✅ | ✅ | ✅ | ✅ | ✅ `clip visible`→`hidden`→`clip visible` | 20/20 ✅ |
| `antrenor-detay` · `#aptModal` | ✅ `aptClose` | ✅ | ✅ | ✅ | ✅ | ✅ `clip visible`→`hidden`→`clip visible` | 20/20 ✅ |

**Dört satır da iskeleti yalın kanıtlıyor.** AJAN-G yerel odak onarımını
(60 ms'lik `setTimeout`) **sildi**; doğruladım: `grep -c setTimeout
antrenor-detay-v1.html` → **0**, `acilinca` tek satır (`__bnUpdate`), odak
yaması yok. Silme sonrası tabloyu yeniden ölçtüm — açılış odağı hâlâ ✅
(`aptClose`), yani odağı oturtan **iskelet**. `profil-v1.html`'de de hiçbir
yerel yama yok (grep'le doğrulandı); iskelet borcu üç sayfada da kendi ödüyor.

### Açılış odağı kusuru — bağımsız doğrulama
G kare kare ölçmüştü; ben `HTMLElement.prototype.focus`'u sarmalayıp **çağrının
kendisini** ölçtüm — hedefin o andaki computed `visibility`'si ve çağrıdan
hemen sonra `activeElement` gerçekten değişti mi:

```
profil-v1 · #aptModal      → 3 no-op (visibility=hidden) + 1 başarı (visible)
profil-v1 · #msgModal      → 2 no-op (hidden)            + 1 başarı (visible)
antrenor-detay · #aptModal → 3 no-op (hidden)            + 1 başarı (visible)
```

Ek bulgu: kusur **sayfaya göre değişiyordu** — tek rAF `#aptModal`'da
tutturuyor, `#msgModal`'da tutturmuyordu. "Bazen çalışan" zamanlama en kötüsü:
ölçüm sayfasına göre yeşil gelip saklanıyor.

**Düzeltmeyi ben yazmadım.** Ölçümümü bitirdiğimde `fit-modal.js` diskte zaten
güncellenmişti (19:35; benim okuduğum sürüm 18:57) ve yorumda G'ye atıf vardı;
`tests/modal-anatomi.mjs` de 19:36'da ayrı "açılış odağı" nöbetini almıştı.
Aynı iki dosyada **eşzamanlı ikinci bir ajan** çalışıyor (G, lead'in kendisine
"iskeleti yazan `AJAN-C-2`" dediğini aktardı). Üzerine yazmadım — öteki ajanın
işini ezerdi. Çakışma riskini lead'e bildirdim.

**`antrenor-detay` satırı → AJAN-G'ye devredildi.** Bağlamayı G yaptı, dosyaya
dokunmadım; yukarıdaki değerler benim **salt-okuma bağımsız doğrulamam**.
G sayfayı kalem 37 için baştan kurunca satırı **yeniden ölçmeli** — sözleşmede
bunu yazdım.

**Taban (kalem 11 açılışında ölçülen):**

| Sayfa · modal | Esc | dışarı | kapat | odak dönüşü |
|---|---|---|---|---|
| `profil-v1` · `#aptModal` | ✅ | ⛔ | ✅ | ⛔ |
| `antrenor-detay` · `#aptModal` | ⛔ | ⛔ | ✅ | ⛔ |

**Beş ⛔ → 0.** *(Lead'in mesajı "altı ⛔" diyor; `fit-modal.js` başlığındaki
kendi taban kaydımda ⛔ sayısı **beş** — `#aptModal` 2 + `antrenor-detay` 3.
Destekleyebildiğim sayıyı yazıyorum.)* Ayrıca tabana hiç girmemiş iki sütun
(scroll kilidi · odak tuzağı) da artık ölçülüyor ve dört senaryoda da yeşil:
**24 hücrenin 24'ü.**

### ⚠️ DEVIR-8 için düzeltme — scroll kilidi TABANDA DA SAĞLAMDI

AJAN-G bunda ısrar etti ve **haklı**; taban commit'in (`654f353`) kaynağından
doğruladım (`git show`, ağaç bozulmadan):

```js
// 654f353:antrenor-detay-v1.html
function openApt(){  … document.body.style.overflow='hidden'; … }
function closeApt(){ … document.body.style.overflow='';       … }
document.getElementById('aptClose').addEventListener('click', closeApt);  // ✅ çalışıyor
aptOv.addEventListener('click', closeApt);   // ÖLÜ — kap örtüyü kapatıyor
// Escape dinleyicisi HİÇ YOK
```
`654f353:profil-v1.html` aynı desen: `closeApt()` içinde
`FIT_SHELL.unlockScroll()` çağrılıyor, overlay dinleyicisi yine ölü.

**Yani kilidi çözen kod tabanda da doğruydu; kilidi takılı bırakan şey
kapanmayan modaldı.** Kapat düğmesiyle kapatıldığında `overflow` tabanda da
`clip visible`'a dönüyordu. `#aptModal`'ın "altı borcundan" biri aslında hiç
borç değildi — **DEVIR-8'e "scroll kilidi çözülmüyordu, düzeltildi" diye
geçmemeli.** Doğru ifade: *iki kapatma yolu (Esc · dışarı tıklama) kırıktı;
kilit yalnız bu yüzden takılı kalıyordu.*

### Kök neden — "dışarı tıklama" neden hiç çalışmıyordu
`.apt-modal{position:fixed;inset:0}` bütün pencereyi kaplıyor ve `#…Overlay`in
**üstünde** duruyor; overlay'e bağlanan dinleyici hiç tetiklenmiyor. Playwright'ın
kendi çıktısı: `<div id="aptModal"…> intercepts pointer events`. İskelet bu yüzden
dinleyiciyi overlay'e **değil KABA** bağlıyor, olay panelin dışına düştüğünde
kapatıyor; `ortu` verilirse ona da ayrıca bağlanıyor.

### Ölçüm harness'imde bulduğum ve düzelttiğim İKİ yanlış kırmızı
Kırmızıyı rapora taşımadan önce ölçümü sorguladım; ikisi de bendeydi, kodda değil:
1. **anatomi diyaloğu hiç açılmıyor sandım.** Kapı `(max-width:900px) AND
   `(pointer:coarse)`; varsayılan Playwright bağlamı `pointer:fine`. `hasTouch:true`
   ile ölçünce açıldı. Kapı bilinçli — aşağıda gerekçesi var.
2. **`#msgModal` odak tuzağı 0/20 çıktı.** `.apt-panel` belgede birden çok geçiyor;
   belge kökünden arayınca `#aptModal`in panelini ölçüyordum. `kap.querySelector()`
   ile kapsayınca **20/20**. İskelet zaten doğru kapsıyordu.

---

## Kalem 11 — "Randevu al" popup'ı kapatılamıyor  ✅

- **Yapılan:** açma/kapama mantığı `assets/js/fit-modal.js`'e çıkarıldı.
  `profil-v1.html`'de **altı** modal aynı iskelete bağlandı (`grep -c
  FIT_MODAL.kur profil-v1.html` = 6): `#aptModal` · `#msgModal` ·
  `#atAptModal` · `#atMsgModal` · `#islMsgModal` · pro kapısı. Elle yazılan
  üç ayrı dinleyici (kapat düğmesi · overlay · `keydown`) kalktı.
- **Kod tekrarı:** modal başına ~3 dinleyici + Esc bloğu elle yazılıyordu;
  şimdi modal başına **tek `kur()` çağrısı**. `profil-v1.html` bu turda
  **40 satır eklendi / 42 satır silindi** — davranış altı kat arttı, satır sayısı
  düştü.
- **Yan kazanç:** eski `keydown` dinleyicisi `closeApt(); closeMsg();` diyerek
  **iki modalı birden** kapatıyordu. İskelette tek global dinleyici var ve yalnız
  **yığının tepesindeki** modalı kapatıyor.
- **`fit-shell.js`'e KOYMADIM.** Orası AJAN-A'nın ve 2943 satır; ayrı dosya
  hem sahiplik hem yükleme sırası açısından temiz.

## Kalem 12 — `anatomi-v1.html` Tab odağı panelden kaçıyor  ✅

**Şartname çatışması ve çözümü.** Kabul ölçütü "Esc kapatıyor · odak tetikleyene
dönüyor" diyor — yani bir **diyalog** tarif ediyor. Ama anatomi paneli sabit bir
kolon; kapatılacak bir şey yok, tuzak kurulacak bir kip yok. Masaüstünde tuzak
kurmak **zararlı** olurdu: kullanıcıyı hiç açmadığı bir kutuya kilitler.

**Çözüm — kapı:** panel `(max-width:900px)` **VE** `(pointer:coarse)` olduğunda
diyaloğa dönüşüyor (`#anSheet`, `display:contents` → `.show`). Gerekçe:
çözdüğümüz sorun bir **dokunma** sorunu — parmakla bölgeye dokunuyorsun, cevap
aşağıda kalıyor. Fareli dar pencerede (küçültülmüş masaüstü) panel inline kalır;
kullanıcının hem tekerleği hem pencereyi büyütme imkânı var, önüne kapatılacak
katman çıkarmayız.

| Ölçüm | Sonuç |
|---|---|
| @390 dokunmatik, bölgeye dokun | panel **diyalog olarak açıldı** (18 bölge taranabilir) |
| 20 ardışık Tab | odak **20/20** adımda panel içinde |
| 10 Shift+Tab | odak **10/10** adımda panel içinde (geriye de sarmalıyor) |
| Esc | kapatıyor, odak **tetikleyen bölgeye** (`quadriceps`) döndü |
| @1440 inline kip | panelde 14 görünür odaklanabilir; odak 14. Tab'da panelden **serbestçe çıkıyor** — tuzak KURULMUYOR ✅ |
| ekran >900 px'e genişlerse | açık diyalog otomatik kapanıyor (`matchMedia change`) |

Son satır bilerek: masaüstünde tuzağın **kurulmadığını** da nöbete aldım, yoksa
"her yerde tuzak" regresyonu sessizce girebilirdi.

## Kalem 13 — Sağ panelde orta başlıklar seçilmiyor  ✅

Bölüm başlıkları `<button aria-expanded>` accordion oldu (delege dinleyici —
panel her kas seçiminde yeniden basılıyor).

**Brief'in istediği dört sayı:**

| | font-weight | font-size |
|---|---|---|
| **başlık** | **800** | **16 px** |
| **gövde** | **500** | **14.5 px** |
| fark | **Δ 300** | **Δ 1.5 px** |

Taban: başlık `11.5px / 800 / uppercase / --muted` idi — gövdeden **küçük** ve
**soluk**, yani hiyerarşi tersti. Klavye ölçüldü: Enter ile `aria-expanded`
`true→false→true`, gövde gizlenip geri geliyor.

## Kalem 14 — Chip aralıkları dar  ✅

| | önce | sonra |
|---|---|---|
| `.an-chips` gap | **8 px** (git diff'ten: `gap:8px`) | **12 px** (`--an-chip-gap`, `.an-grid`'de tanımlı tek değer) |
| kap sayısı / tek gap mi | 2 kap | 2 kap, **hepsinde tek değer** |
| çip yüksekliği @1440 | 36 px | 36 px (K53 korundu) |
| çip yüksekliği @390 | 36 px | **44 px** (K53 korundu) |
| yatay taşma @390 | 0 | **0** |

---

## 2 · AJAN-G'ye teslim edilen sözleşme

`SendMessage` ile **doğrudan G'ye** gönderildi (lead'e bu rapor kopya). Özet:

- **Seçici varsayılmıyor.** `kur()`'un `kap` · `panel` · `ortu` · `kapat`
  alanlarının dördü de **string seçici ya da DOM element** kabul ediyor:
  `typeof o.kap === 'string' ? document.querySelector(o.kap) : o.kap`.
  `#aptModal` id'sine gömülü hiçbir şey yok — G markup'ı baştan kursa da geçerli.
- **`panel`, `kap` İÇİNDE aranıyor** (`kap.querySelector`), belge kökünden değil.
- **Üç satırla bağlanıyor:** script etiketi → `FIT_MODAL.kur({...})` →
  `btn.addEventListener('click', () => h.ac(btn))`. Kısa yol:
  `FIT_MODAL.tetikle('#ctaBook', h)`.
- **API:** `kur(o)` → handle | `null` · `h.ac(tetikleyici)` · `h.kapat()` ·
  `h.acikMi()` · `h.kap` · `h.panel` · `FIT_MODAL.tetikle(sec, h, once)`.
- **Odak dönüşü otomatik** — `ac()`e verilen tetikleyiciye, verilmezse
  `document.activeElement`e. Kapat düğmesinde kalmaz.
- **Scroll kilidini `kapat()` çözüyor**, çağıran değil. Kilit
  `FIT_SHELL.lockScroll/unlockScroll` sayacına devrediliyor → çift kilit yok.
- **Kapat düğmesi delege** (`[data-fm-close]`) — panel `innerHTML` ile yeniden
  basılsa da yaşıyor.
- **Esc yalnız yığının tepesini** kapatıyor.
- İki tuzak G'ye ayrıca yazıldı: `kur()` null dönebilir (`if (h)` ile koru) ·
  form→success geçişinde `display:none` değil `hidden` kullan (odak listesi
  `[hidden]` alt ağaçlarını eliyor).

---

## 3 · Kütük — `role=antrenor` ölü kod (DOKUNULMADI)

`profil-v1.html:4203` sayfanın en altındaki IIFE:
```js
if (q.get('role') === 'antrenor' && q.get('view') === 'public') {
  location.replace('antrenor-detay-v1.html?slug=' + slug);
}
```
Antrenör rol katmanının randevu/mesaj düğmeleri yalnız
`body.pf-public[data-roles~="antrenor"]` altında görünüyor (`profil-v1.html:1605`)
— yani **tam da yönlendirilen kombinasyonda**.

**Ölçtüm, dört kombinasyon:**

| URL | kalınan sayfa | görünür `.pf-book.pf-rl-at` | `#atAptModal` markup'ta |
|---|---|---|---|
| `?role=antrenor&view=public` | **antrenor-detay-v1.html** (yönlendirildi) | 0 | — |
| `?role=antrenor` | profil-v1 | **0** | var |
| `?role=diyetisyen&view=public` | profil-v1 | 0 | var |
| `?view=public` | profil-v1 | 0 | var |

Yani `#atAptModal` + `#atMsgModal` + C2-1b IIFE'si (~45 satır JS + ~30 satır CSS)
arayüzden **hiçbir rolde** açılamıyor; yalnız `?atrandevu=1` / `?atmsg=1`
ekran-görüntüsü parametreleriyle erişiliyor.

**Kapsam dışı bırakıldı** (lead talimatı). Ölü blokları "modernize etme"ye
çalışmadım. Yalnız iki modal da iskelete bağlandı ki DEVIR-8'de blok
canlandırılırsa davranışı hazır olsun; temizlik kararı lead'de.

---

## 4 · Bozulmadığını kanıtladıklarım

| Ne | Sonuç |
|---|---|
| `tests/modal-anatomi.mjs` (yeni, R8) | **✓ 16 ölçümün hepsi geçti** (iki ardışık koşuda aynı) |
| `tests/anatomi.mjs` | **✓ 0 sorun** — R6'nın nöbetleri (banner 544/607/587 · 58/58 bölge · panel 29/29 · `?kas=` 29/29 · `.an-kaynak` 0 · liste tek kez · M15 simetrisi) hâlâ yeşil |
| `tests/a11y-focus.mjs` | **0 sorun** — kabuk katmanlarının odak davranışı etkilenmedi |
| `antrenor-detay-v1.html` | dosyayı **hiç açmadım/düzenlemedim**; `git status`'ta `M` görünüyor — o değişiklik AJAN-G'nin |
| `fit-shell.css` · `fit-shell.js` | benim değişikliğim yok |
| konsol / pageerror | dört senaryonun hiçbirinde **0** |
