# AJAN-C · ANATOMİ + MODAL (R8 · kalem 11–14)

Taban commit: `654f353` · sunucu `http://localhost:8811` · Playwright `PW_HOME=~/.pw`

## Durum

| Kalem | Durum | Ölçüm | Değişen dosya |
|---|---|---|---|
| 11 · randevu popup kapanmıyor | ✅ | 3/3 kapatma yolu · odak dönüşü 3/3 · overflow `hidden`→`clip visible` | `profil-v1.html` · `assets/js/fit-modal.js` (yeni) |
| 12 · odak panelden kaçıyor | ⚠️ önerme düzeltildi | 20/20 Tab · 10/10 Shift+Tab · Esc ✅ · odak bölgeye döndü | `anatomi-v1.html` · `fit-modal.js` |
| 13 · orta başlıklar seçilmiyor | ✅ | başlık 800/16px · gövde 500/14.5px · 5 accordion | `anatomi-v1.html` |
| 14 · çip aralıkları dar | ✅ | gap 8px → 12px · tek değer · @390 taşma 0 | `anatomi-v1.html` |

## Ortak modal iskeleti

`assets/js/fit-modal.js` — YENİ dosya. `fit-shell.js`'e (AJAN-A) **dokunulmadı**.
Verdiği altı şey: Esc (yalnız yığının tepesi) · dışarı tıklama (kaba bağlı) ·
kapat düğmesi (delege `[data-fm-close]`) · odak tuzağı · odak dönüşü · scroll kilidi.

Kod tekrarı: **önce 7 ayrı elle yazılmış aç/kapa mantığı** (profil-v1'de 6 + anatomi'de 0),
**sonra 1 iskelet + 7 çağrı**. Kaldırılan elle dinleyici: 6 overlay click · 6 kapat click ·
3 `document.keydown` Escape.

## Kalem 12 — önerme düzeltmesi

Ölçtüm: `anatomi-v1.html`'de **modal yok**. `#anPanel` grid'in içinde hep görünür
inline bir kart (@1440 ve @390 aynı). Inline karta odak tuzağı kurmak klavye
kullanıcısını footer'a ulaşamaz hâle getirirdi — düzeltme değil, yeni kusur.

Asıl sorun ölçümde çıktı: **@390'da panelTop 1219px, viewport 844px** — dokunuyorsun,
cevap katlamanın 375px altında, ekranda hiçbir şey kıpırdamıyor.
Çözüm: **dar ekran + dokunmatik**te panel gerçek diyalog olarak açılıyor (aynı iskelet).
Fareli dar pencerede ve @1440'ta inline kalıyor → `tests/anatomi.mjs` geometrisi korundu.

## Sınamalar

- `tests/modal-anatomi.mjs` — YENİ · 15 ölçüm · ana ağaçta **yeşil**, taban `654f353`'te **8 sorunla kırmızı**
- `tests/anatomi.mjs` → 0 sorun
- `tests/a11y-focus.mjs` → 0 sorun
- konsol hatası: 4 senaryonun hepsinde 0

## Kapsam dışı bulgular

1. `antrenor-detay-v1.html` (**AJAN-G'nin**) aynı hatayı taşıyor, üstelik daha ağır:
   Esc ⛔ · dışarı ⛔ · düğme ✅. Lead'e bildirildi, karar bekleniyor.
2. `profil-v1.html?role=antrenor` → `antrenor-detay-v1.html`'e yönleniyor
   (`profil-v1.html:4205`). Dolayısıyla `#atAptModal` + `#atMsgModal` + C2-1b IIFE'si
   **hiçbir rolde erişilemez ölü kod**. Yine de iskelete bağlandı.
3. **Kardeş marka `dadadiet.com` aynı hatayı taşıyor** — kod birebir aynı
   (`#openApt` · `#aptModal.apt-modal` · `#aptConfirm`). Ölçüm:
   Esc ✅ · dışarı ⛔ (`overflow: hidden`da kalıyor) · düğme ✅ ama odak `BODY`'ye düşüyor,
   modal açılınca odak diyaloğa hiç taşınmıyor. DadaFit bu konuda artık kardeşin ÖNÜNDE.
>> ÖLÇÜM (kendim, iddiaya güvenmeden). İlk harness iki kez YANLIŞ kırmızı üretti, ikisi de bende: (1) anatomi diyaloğu `(max-width:900px) AND (pointer:coarse)` kapısında — masaüstü işaretçili bağlamda hiç açılmaz, `hasTouch:true` gerekti; (2) `.apt-panel` belgede birden çok geçiyor, belge kökünden arayınca #msgModal için "0/20 odak tuzağı" çıktı — `kap.querySelector()` ile kapsayınca 20/20. Kırmızıyı rapora taşımadan önce ölçümü sorguladım.
>> SONUÇ: dört senaryo × altı davranış = 24 hücrenin 24'ü yeşil. profil-v1 #aptModal · profil-v1 #msgModal · anatomi-v1 @390 dokunmatik · antrenor-detay (G'nin bağlaması, salt okuma).
>> tests/modal-anatomi.mjs 15/15 · tests/anatomi.mjs 0 sorun · tests/a11y-focus.mjs 0 sorun.
>> Sözleşme AJAN-G'ye DOĞRUDAN gönderildi (SendMessage): element-kabul eden API, üç satırlık bağlama örneği, odak dönüşü/scroll kilidi sahipliği, dışarı-tıklama kök nedeni, G'nin bağlamasının bağımsız ölçümü.
>> KÜTÜK · ölü kod: profil-v1.html #atAptModal + #atMsgModal + C2-1b IIFE (~45 satır) `role=antrenor`ta erişilemez. DOKUNULMADI, DEVIR-8'e açık kalem.
>> Rapor yazıldı: tasks/r8-ilerleme/ajan-c-RAPOR.md. İki sayı düzeltildi (kur() çağrısı 7 değil 6; çip gap tabanı git diff'ten 8px olarak doğrulandı).

---

## KAPANIŞ (düzeltme sonrası, hepsi computed ölçüm)

### İskelet kusuru — açılış odağı (AJAN-G buldu, C düzeltti)
`ac()` tek `requestAnimationFrame` bekliyordu; kap `visibility .25s` geçişi taşıdığında
rAF-1'de computed `visibility` hâlâ `hidden` → `.focus()` sessizce düşüyor.
**Lead'in "profil-v1'de iskelet geçiyor" varsayımı YANLIŞ çıktı** — `#aptModal`'ın computed
`transition`ı da `visibility .25s` taşıyor; benim sayfamda da düşüyordu ve orada yerel
onarım olmadığı için 400 ms'te bile odak `BODY`'de kalıyordu.
Düzeltme: "odak içeri düşene kadar dene" (≤20 rAF) + odak zaten içerideyse dokunma.
`transitionend` seçilmedi: reduced-motion'da ve geçişsiz modalda (anatomi diyaloğu) ateşlenmiyor.

### Dört modal × üç kapatma yolu × beş davranış = 60 hücre, 60'ı yeşil
| modal | kapandı | açılış odağı | tuzak | odak dönüşü | kilit |
|---|---|---|---|---|---|
| `profil-v1 #aptModal` | ✅✅✅ | ✅✅✅ | 20/20 ×3 | ✅✅✅ | ✅✅✅ |
| `profil-v1 #msgModal` | ✅✅✅ | ✅✅✅ | 20/20 ×3 | ✅✅✅ | ✅✅✅ |
| `anatomi-v1 #anSheet` | ✅✅✅ | ✅✅✅ | 20/20 ×3 | ✅✅✅ | ✅✅✅ |
| `antrenor-detay #aptModal` (G) | ✅✅✅ | ✅✅✅ | 20/20 ×3 | ✅✅✅ | ✅✅✅ |

kilit her satırda `clip visible → hidden → clip visible`.
**Uyarı:** `antrenor-detay` satırında G'nin yerel onarımı hâlâ duruyor. İskeletin kendi
başına yeterli olduğunun kanıtı zamanlama: odak **rAF 2'de (~16–32 ms)** oturuyor, G'nin
onarımı **60 ms'te** ateşleniyor. Yalın doğrulamayı G kendi bloğunu silince yapacak.

### Scroll kilidi — G ile ölçüm farkı ÇÖZÜLDÜ
İkimiz de computed ölçmüşüz. Benim `hidden → hidden` satırım **Esc/dışarı** yollarıydı:
o iki yol tabanda modalı hiç kapatmıyordu, kilit de doğal olarak duruyordu.
**Kapat düğmesi** satırında bende de tabanda `clip visible → hidden → clip visible` çıkmıştı.
Ölçüm noktası kayması yok — farklı senaryo. Kilit mantığı tabanda da sağlamdı.

### K27 — taban commit `654f353`
`tests/modal-anatomi.mjs` tabanda **9 sorun** sayarak kırmızı (çökmeden, hepsi adıyla):
açılış odağı · dışarı tıklama · düğmede odak dönüşü · `#anSheet` yok · `.an-acc` 0 ·
tipografi seçicisi yok · accordion yapısı yok · gap 8px (@1440) · gap 8px (@390).
Ana ağaçta **16/16 yeşil**. worktree + geçici :8822 sunucu kuruldu ve **temizlendi**.

### Süit durumu
`modal-anatomi.mjs` 16/16 · `anatomi.mjs` 0 · `a11y-focus.mjs` 0 · `antrenor-profil.mjs` (G) 0
· `header-banner.mjs` 0 · `plan-account.mjs` 0 · konsol hatası 4 senaryoda 0.

### K51
`ara1/` (2 PNG, 1002 KB) depo kökünden scratchpad'e **taşındı**, dizin silindi. Görüntüler duruyor.

### G'ye teslim
API sözleşmesi + düzeltme haberi `SendMessage → AJAN-G` ile gönderildi: element kabul eden
API, üç satırlık bağlama örneği, odak dönüşü/scroll kilidi sahipliği, dışarı-tıklama kök nedeni.
>> Son süpürme: tests/modal-anatomi.mjs 16/16 (iki koşu) · tests/anatomi.mjs 0 sorun · tests/a11y-focus.mjs 0 sorun · tests/footer-yapi.mjs 0 sorun. Raporda üç sayı düzeltildi: taban ⛔ sayısı 6 değil 5 (kendi kaydımda 5), modal sınaması 15 değil 16, antrenor-detay'daki M işareti G'nin.

---

## KALEM 11 KAPANDI — yalın iskelet doğrulandı (AJAN-G + AJAN-C, bağımsız)

G yerel onarım bloğunu sildi. Kalıntı olmadığını kendim doğruladım:
`acilinca` tek satır (`__bnUpdate`), `setTimeout`lu odak yaması yok, grep 0 eşleşme.

Yalın iskelet, `antrenor-detay-v1.html` @1440, kare kare:
```
rAF 1  → odak=BODY      vis=hidden
rAF 2  → odak=aptClose  vis=visible   ← İSKELET oturttu (~16-32 ms)
50 ms  → odak=aptClose                ← eski onarımın anından ÖNCE
```

**Dört modal × üç kapatma yolu × beş davranış = 60/60**, hepsi yalın iskeletle:
`profil-v1 #aptModal` · `profil-v1 #msgModal` · `anatomi-v1 #anSheet` · `antrenor-detay #aptModal`.
Kilit her satırda `clip visible → hidden → clip visible`.

### Kilit "uyuşmazlığı" — kapandı, kimsede ölçüm hatası yok
G kendi tahminini geri çekti; benim açıklamam doğrulandı. İki satır farklı senaryoydu:
`ESC → KAPATMADI, overflow=hidden` (benim satırım) vs `KAPAT DÜĞMESİ → KAPATTI,
overflow=clip visible` (G'nin satırı). Kilit mantığı taban commit'te de sağlamdı;
kilidi tutan şey kapanmayan modaldı. Ölçüm noktası kayması yok.

### G'nin kattığı, bende olmayan ölçüm
İki modal el değiştirmesi (`#aptConfirm` → kabuğun `lg-gate` katmanı): iki ayrı modal
sistemi tek kilit sayacını paylaşıyor. Ara adımda `overflow` hâlâ `hidden`, yığın
sızdırmıyor, sonunda odak `ctaBook`'a dönüyor — düzeltme öncesiyle birebir aynı.
Benim süitimde iki-modal zinciri yok; bu satır G'nin ölçümü.

### Süit (son)
`modal-anatomi.mjs` 16/16 · `anatomi.mjs` 0 · `a11y-focus.mjs` 0 · `antrenor-profil.mjs` 0.
>> AJAN-G açılış odağı kusuru bildirdi. DOĞRULADIM: HTMLElement.prototype.focus sarmalandı, çağrı anındaki computed visibility ölçüldü. profil-v1 #aptModal 3 no-op + 1 başarı · #msgModal 2 no-op + 1 · antrenor-detay 3 no-op + 1 — hepsinde no-op'ların visibility=hidden, başarının visibility=visible. G'nin teşhisi birebir doğru.
>> ANCAK düzeltme fit-modal.js'te ZATEN VARDI (dosya 19:35, ben 18:57 sürümünü okumuştum): "odak içeri düşene kadar dene" döngüsü, 20 kare üst sınır, yorumda G'ye atıf. tests/modal-anatomi.mjs de (19:36) ayrı "11 · açılış odağı" nöbetini almış. İkisini de BEN yazmadım — aynı dosyalarda ikinci bir ajan çalışıyor (G, lead'in kendisine "iskeleti yazan AJAN-C-2" dediğini aktardı). ÇAKIŞMA RİSKİ: dosyaları düzenlemedim, lead'e bildiriyorum.
>> Ölçüm tabloma YEDİNCİ kolon eklendi: "açılış odağı", hiç Tab'a basmadan. G'nin asıl dersi bu — odak tuzağı ilk Tab'da odağı içeri çekiyor, yani tuzağı ölçen sınama açılış odağı kusurunu MASKELİYOR. Dört senaryonun dördü de ✅.
>> G'nin scroll kilidi itirazı: benim gönderdiğim tabloda o hücre "clip visible→hidden→clip visible ✅" yazıyordu. G üç farklı aktarım aldığını söyledi (biri lead'den, kilit kolonlu ve ⛔'lü) — kimin hangi tabloyu ilettiğini ben doğrulayamam, o yüzden "G yanlış anımsadı" demiyorum; ölçümlerimizin aynı olduğu tek doğrulanabilir kısım.
>> G'ye ve lead'e mesaj gitti. Rapordaki tablo yedi kolona çıkarıldı, açılış odağı kusuru ve bağımsız doğrulaması eklendi, düzeltmenin sahipliği ("ben yazmadım") açıkça yazıldı.
>> KÜTÜĞE ÖNERİ: bir davranışı ONARAN mekanizma, aynı davranışı ÖLÇEN sınamayı kör edebilir. Odak tuzağı, açılış odağı kusurunu onarıp ölçümü yeşile boyuyordu. İkisi ayrı ölçülmeli.
>> G yerel yamayı SİLDİ, doğruladım (grep -c setTimeout antrenor-detay-v1.html = 0, acilinca tek satır) ve yeniden ölçtüm: açılış odağı hâlâ ✅ aptClose → dört satır da iskeleti yalın kanıtlıyor.
>> G'nin "kilit tabanda da sağlamdı" iddiasını TABAN KAYNAĞINDAN doğruladım (git show 654f353, ağaç bozulmadan): closeApt() overflow'u geri veriyor ve kapat düğmesine bağlı; ölü olan overlay dinleyicisi, Escape dinleyicisi ise hiç yok. Kilidi takılı bırakan kapanmayan modaldı. Rapora DEVIR-8 uyarısı olarak eklendi: "kilit çözülmüyordu, düzeltildi" YANLIŞ ifade olur.
