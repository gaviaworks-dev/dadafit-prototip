# AJAN-G ilerleme
- 18:22 başladı: brief + REVIZYON-8 §8 okundu, referans ölçümüne geçiliyor
- 18:35 referans (dyt-elif-sahin) @1440+@390 ölçüldü: pf-top 626/726, sec 40/74-40/44, tab bileşeni ZATEN var (role=tablist ama tab/aria-selected/roving YOK)
- 18:38 mevcut sayfa ölçüldü: docH 3509 @1440, .cp-top 560, sekmeler ZATEN ortak bileşende (fit-shell.js [data-fit-tabs]) — role/tab/aria-selected/roving/ok tuşları KURULU
- 18:40 kalem 39 yeniden kapsamlandı: eksik olan "Challenge'lar" sekmesi; a11y motoru hazır
- 18:34 37/38/39 markup+CSS uygulandı; ölçüme geçiliyor
- 18:41 K27 doğrulandı: sınama taban 654f353'te 63 sorunla KIRMIZI, çalışma ağacında YEŞİL; worktree kaldırıldı
- 19:20 kusur avı: 5 kusur bulundu+düzeltildi (wrap merkezleme · boş durum sola yaslanma · @390 etiket sarması · @390 ayırıcı yok · uyarı bandı bağlantıları düz metin)
- 19:25 DEVIR-7 §5e/4 portre doğrulandı (portre DEĞİL, grup karesi) → data-yer-tutucu + docs 9. kalem
- 19:30 tests/antrenor-profil.mjs YEŞİL (1440/1024/390); taban 654f353'te 63 sorunla KIRMIZI
- 19:32 komşu süit yeşil: header-banner 0 · a11y-focus 0 · hizalama-nobeti 0 · coach-list 0 · kabuk-kalite 0
- 19:50 LEAD eklemesi: #aptModal. C'nin bulgusu kendi ölçümümle doğrulandı (Esc ⛔ · dışarı ⛔ · odak dönüşü ⛔) + 2 kusur daha bulundu (odak modala hiç girmiyor · odak tuzağı yok, 30 Tab'ın 16'sı dışarı)
- 19:55 assets/js/fit-modal.js bağlandı (FIT_MODAL.kur); altı borç da ödendi
- 20:00 iskelette kusur: ac() tek rAF bekliyor, visibility hâlâ hidden → açılış odağı düşmüyor. Yerel onarım + AJAN-C'ye bildirildi
- 20:05 referans #aptModal ölçüldü: dışarı ⛔ · odak içeri ⛔ · odak dönüşü ⛔ · tuzak ⛔ — kardeş marka bu konuda GERİDE, birebir taşınmadı
- 20:10 sınama §9 eklendi; taban 654f353'te 84 sorunla KIRMIZI (63→84), çalışma ağacı YEŞİL; komşu süit 0 sorun
- 20:25 ad çakışması: bulgu yanlış adrese (AJAN-C) gitmişti, AJAN-C-2'ye yeniden gönderildi
- 20:30 final rapor SendMessage ile team-lead'e gönderildi (düz metin çıktısı ajanlara görünmüyormuş)
- 20:32 K51 doğrulandı: depoda png/jpg 0 (izlenen 17 dosya assets/img/** muafiyetinde), 29 görüntü scratchpad'de
- BEKLEYEN: AJAN-C-2 fit-modal.js açılış odağını düzeltince yerel onarım bloğu silinecek + iskelet yalın ölçülecek

---

## DURUM DÜZELTMESİ — kalem 37 · tipografi ölçüsü ⚠️ AÇIK

Lead kararı (R8): `.fit-tab` / `.cnt` sapması **bu turda kapatılmıyor** — ortak
bileşen `[data-fit-tabs]` kullanan her sayfayı oynatır, K-B (yaslama) daha
uygulanmamışken 0.5 px için 66 sayfa riske atılmıyor. **DEVIR-8 açık kalemi.**

Kalem 37'nin dört ölçüsünden **üçü kapandı** (bölüm sırası ✅ · kart iskeleti ✅ ·
dolgu ✅), **tipografi ⚠️ tek sapma açık**. Kapandı diye işaretlenmiyor.

### Sapmanın tamamı — ölçülmüş, bilerek bırakılmış

Sahibi `assets/css/fit-shell.css` (AJAN-A-2). Ölçüm @1440, referans
`dadadiet.com/diyetisyen/dyt-elif-sahin` `.pf-tabs .dt`, karşılığı
`antrenor-detay-v1.html` `.cp-tabbar .fit-tab`.

| Seçici | Özellik | Referans | DadaFit | Sapma |
|---|---|---|---|---|
| `.dt` → `.fit-tab` | font-size | **13px** | **13.5px** | +0.5px |
| `.dt` → `.fit-tab` | gap | **7px** | **8px** | +1px |
| `.dt` → `.fit-tab` | padding | 10px 18px | 10px 18px | — ✅ |
| `.dt` → `.fit-tab` | font-weight | 700 | 700 | — ✅ |
| `.dt` → `.fit-tab` | border-radius | 8px | 8px | — ✅ |
| `.cnt` | font-size | 11px | 11px | — ✅ |
| `.cnt` | padding | **0px** | **2px 8px** | hap dolgusu |
| `.cnt` | border-radius | **0px** | **999px** | hap biçimi |
| `.cnt` | background | **şeffaf** | **#f9f9f9** | zemin eklenmiş |
| `.cnt` | color | #717171 | #717171 | — ✅ |

**Toplam: 2 seçicide 5 değer sapıyor.** Beşi de ölçüldü, hiçbiri kaçmadı;
kapatılmama gerekçesi kapsam (ortak bileşen), ölçüm eksikliği değil.

Sayfa içi tipografinin geri kalanı referansla birebir: `.info-card h4`
14/15.68/700/−0.28 · `.ic-row b` 13.5/17.55/700 · `.ic-row span` 13/20.15/500 ·
`.cps b` 16.5/25.575/700 · `.cps span` 11/17.05/500/0.22 ·
`.cp-disclaimer p` 13.5/22.275/500 · `.ab-main h2` 22/24.64/700/−0.44 ·
`.chip` 13/700/pad 8·15/r8.

### Lead'in diğer iki kararı — bende karşılığı yok, ağaç olduğu gibi

- `.fit-pane[tabindex="0"]` niteliği **SİLİNMEDİ** (lead: şimdilik kalsın,
  A-2 bileşende çözerse birleştirmede bakılacak). `fit-shell.js`'e dokunulmadı.
- `fit-modal.js` açılış odağı için **yerel onarım KALDI** (lead: kusuru açık
  bırakmak yerine yerelde kapat). C-2 düzeltince blok silinecek ve iskelet
  yalın hâlde yeniden ölçülecek — teyit tek satır gönderilecek.
- `docs/icerik-bekleyen.md` numaraları (7·8·9) **olduğu gibi bırakıldı**,
  birleştirmede lead baştan sıralayacak.

### C'nin sözleşmesi geldi — bir düzeltme, bir yeni ölçüm

- C bağımsız ölçtü, altı davranış yeşil. AMA tablosunda "odak modala giriyor"
  kolonu YOK ve ölçtüğü sayfa BENİM yerel onarımımı taşıyor — yani yeşil tablo
  iskeletin açılış odağını KANITLAMIYOR. C'ye yazıldı, iskelet yalın ölçümü
  (odak=ctaBook, modala girmiyor) tekrar gönderildi.
- Tuzak: odak tuzağı ilk Tab'da odağı içeri çektiği için açılış odağı kusurunu
  MASKELİYOR. Tuzağı ölçen sınama bu kusuru göremez, ayrı ölçüt gerekir.

### YENİ ÖLÇÜM · iki modal el değiştirmesi (C'nin tablosunda yok)

`#aptConfirm` çıkış yapmışken FIT_MODAL modalını kapatıp kabuğun lg-gate
katmanını açıyor — iki modal sistemi tek scroll-kilit sayacını paylaşıyor.

| Adım | apt | lg-gate | body overflow | odak | FIT_MODAL.yigin |
|---|---|---|---|---|---|
| 0 başlangıç | — | — | clip visible | BODY | 0 |
| 1 modal açık | ✅ | — | hidden | aptClose | 1 |
| 2 aptConfirm | — | ✅ | hidden | lgClose | 0 |
| 3 Escape | — | — | clip visible | **ctaBook** | 0 |

Çift kilit yok · takılı kilit yok · yığın sızdırmıyor · konsol 0 · odak iki
modal boyunca dolaşıp orijinal tetikleyiciye dönüyor.

### Kütüğe: ölü CSS (kapsam dışı, dokunulmadı)

`antrenor-detay-v1.html` içinde `.apt-success` · `.apt-success .ok` ·
`.apt-success h4` · `.apt-success p` kuralları var ama `#aptSuccess` markup'ı
YOK — form→success geçişi bu sayfada hiç kurulmamış, `aptConfirm` çıkış
yapmışken doğrudan giriş kapısına gidiyor. Lead "yeni iş yok" dediği için
silinmedi. C'nin "hidden vs display:none" tuzağı da bu yüzden bende geçersiz.

### KAPANIŞ · yerel onarım silindi, yalın iskelet doğrulandı

C-2 `fit-modal.js`'i düzeltti (193→212 satır, tek rAF yerine "odak içeri
düşene kadar dene" döngüsü, üst sınır 20 kare). Sayfadaki YER TUTUCU
açılış-odağı bloğu (22 satır, `acilinca` içindeki setTimeout'lu onarım)
SİLİNDİ; `acilinca` tekrar tek satır. Kalıntı yorum yok.

Yalın iskeletle ölçüm — üç genişlikte de geçti:

| Ölçüt | Sonuç |
|---|---|
| odak modalın İÇİNE taşındı | ✅ `aptClose` (1440 · 1024 · 390) |
| Esc | ✅ · overflow `clip visible` · odak `ctaBook` |
| dışarı tıklama | ✅ |
| kapat düğmesi | ✅ · odak `ctaBook` |
| odak tuzağı | ✅ 30 Tab'ın 0'ı dışarı |
| scroll kilidi | ✅ `clip visible`→`hidden`→`clip visible` |
| konsol | 0 |

İki modal el değiştirmesi de yalın iskeletle yeniden ölçüldü, dört adım
önceki ölçümle BİREBİR aynı (yığın 0→1→0→0, odak sonda `ctaBook`).
Komşu süit: a11y-focus 0 · header-banner 0 · hizalama-nobeti 0.
`tests/antrenor-profil.mjs` tamamı yeşil. `fit-modal.js`'e dokunulmadı.

### scroll kilidi · SETTLED — ama C'nin tablosunun sözü SETTLED DEĞİL

**Kesin olan, çünkü kendim ölçtüm (taban commit 654f353, computed
`getComputedStyle(document.body).overflow`):**
```
ESC          → KAPATMADI · overflow = hidden
DIŞARI TIKLA → KAPATMADI · overflow = hidden
KAPAT DÜĞMESİ→ KAPATTI   · overflow = clip visible
```
**Sonuç: kilit mantığı taban commit'te de sağlamdı.** Kilidi tutan şey kilit
kodu değil, kapanmayan modaldı. `html,body{overflow-x:clip}` olduğu için taban
değer boş dize değil `clip visible`. Bu üç satır tekrar üretilebilir ve
`#aptModal`ın "altı borcundan" birinin aslında hiç borç olmadığını söylüyor —
DEVIR-8'e "kilit çözülmüyordu, düzeltildi" diye geçmemeli.

**Kesin OLMAYAN: C'nin ilk tablosunun ne dediği.** Üç farklı aktarım aldım:
1. Lead'in aktardığı hâli: scroll kilidi kolonu **var** ve `⛔ hidden → hidden,
   kilit kalıyor` diyor.
2. C, birinci mesajında: o satır **Esc ve dışarı-tıklama** yollarıydı, kapat
   düğmesi satırı benimkiyle aynıydı.
3. C, ikinci mesajında: tabloda `antrenor-detay` satırı zaten
   `clip visible → hidden → clip visible` ✅ yazıyordu, taban tablosunda
   scroll kilidi kolonu **hiç yoktu**.

Üçü birbirini tutmuyor. Daha önce bu kayda 2. aktarımı "settled" diye
yazmıştım — **geri alıyorum**; her yeni mesajda kaydı son söylenene göre
yeniden yazmak kaydı değersizleştirir. Kimin tablosunda ne yazdığı benim
ölçümümü değiştirmiyor ve bu kalemi kapatmak için gerekli de değil.
Yukarıdaki üç satır ne olduğunu söylüyor; tablo sözü C ile lead arasında.

**Kendi hatam, ayrıca duruyor:** ilk raporumda bu farkı "ölçüm noktası
(inline ↔ computed)" diye tahmin etmiştim. O tahmin yanlıştı — C de computed
ölçmüş. Tahmini ölçüm gibi aktarmamalıydım.

**BAĞIMSIZ TEYİT (C, farklı yöntem).** C aynı sonuca çalışma-zamanı ölçümüyle
değil, taban commit'in KAYNAĞINI okuyarak vardı (`git show 654f353`, ağaca
dokunmadan):
```js
// 654f353:antrenor-detay-v1.html
function closeApt(){ … document.body.style.overflow=''; … }              // unlock DOĞRU
document.getElementById('aptClose').addEventListener('click', closeApt);  // çalışıyor
aptOv.addEventListener('click', closeApt);   // ÖLÜ — kap örtüyü kapatıyor
// Escape dinleyicisi HİÇ YOK
```
`654f353:profil-v1.html` aynı desen (`FIT_SHELL.unlockScroll()`, overlay
dinleyicisi yine ölü). İki bağımsız yöntem — benim computed ölçümüm, C'nin
kaynak okuması — aynı yere çıkıyor.

**DEVIR-8 için doğru ifade** (C de raporuna böyle yazdı):
> "scroll kilidi çözülmüyordu, düzeltildi" DEĞİL —
> **"iki kapatma yolu (Esc · dışarı tıklama) kırıktı; kilit yalnız bu yüzden
> takılı kalıyordu."**

C ayrıca önceki mesajındaki "yanlış anımsama" atfını geri aldı; üç farklı
aktarım olduğunu bilmiyormuş. Doğrulanabilen tek şey ölçümlerimizin aynı olduğu.
