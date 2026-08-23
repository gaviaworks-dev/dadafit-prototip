# DEVIR-10 — Şema turu

**Taban:** `e409fb2` → şema commit `8358446` → bitiş: bu notun commit'i
**Ekip:** lead (şema · kabuk) · R10-TAKVIM · R10-HAREKET · R10-ILERLEME

DEVIR-9'da belgenin 29 eksiğinden 19'u kapanmış, **10'u açık kalmıştı**.
Onunun **sekizi tek sebebe** bağlıydı: sayfa işi değildi, şemada alan yoktu.
Bu tur önce şemayı yazdı, sonra sayfaları ona bağladı.

---

## 1 · Şema v2 — sözleşme

### `dm_fit` (`assets/js/fit-shell.js`)

| Alan | Açtığı kalem |
|---|---|
| `program.baslangic` ISO | §4 aylık görünüm · §5.2 tahmini bitiş |
| `program.gunler[]` 1=Pzt | §4.3 "haftanın hangi günleri" |
| `program.saat` `'HH:MM'` | §4.3 hatırlatma saati |
| `program.tasimalar{}` | §4.3/2 tek seansı başka güne taşı — `gunler[]` haftalık KALIP, istisnayı tutamaz |
| `program.dinlenmeler[]` | §4.3/3 belirli tarihi dinlenmeye çevir — kalıptan gün silmek başka şey |
| `arsiv[]` | "Geçmiş programların" (aşağıda) |
| `bugun.su` | §6 su takibi (D16 kapandı) |
| `bugun.gunSonu{}` | §3.7 gün sonu kaydı (D12 kapandı) |
| `gecmis[].kaynak` | **KANIT KADEMESİ** (aşağıda) |

Yeni API: `programPlanla` · `programArsivle` · `seansTasi` · `dinlenmeEkle`
· `dinlenmeKaldir` · `bitisTahmini` · `suEkle` · `suSifirla` · `gunSonuKaydet`.

**Göç OKUMA anında.** Kullanıcı depoyu hiç açmasa bile eski kayıt yeni koda
güvenli girer. Ölçüldü: v1 kaydı yüklendi → `surum:2`, `biten:5` ve `hafta:2`
korundu, yeni alanlar varsayılan, eski `gecmis` kayıtları `kaynak:'beyan'`.

### `dm_fit_planlar_v1` (`assets/js/fit-plan-kayit.js`)

Eklenenlerin **hepsi isteğe bağlı**, v1 planlar kırılmaz:
`gunler[].isinma` · `hareketler[].dinlenme/ekipman/video/uyari/alternatif/alternatifAd`
· `ilerleme[k].agirlik/tekrarYapilan/efor`.

`isaretle()` artık son üçünü **taşıyor** ve **kısmi güncellemede eskiyi korur** —
yalnız seviye değişince performans verisi silinmesin diye. (Ölçüldü: kg → tekrar
→ efor sırasıyla üç ayrı çağrı birikiyor.)

---

## 2 · Kanıt kademesi — belgede yok, akış denetiminden geldi

Aynı "antrenman tamamlandı" **dört ayrı yerde dört farklı kalitede** kayıt
üretiyordu ve uygulama dördünü aynı sayıyordu:

| Nereden | Turdan önce | Turdan sonra |
|---|---|---|
| `egzersiz-detay:1470` | çalışan kronometreden ölçülmüş, **ama `kaynak` geçmiyor** → `'beyan'` | `kaynak:'olculdu'` |
| `video-seans-detay:1294` | nominal video süresi, kademesiz, kcal **sabit 280** | `kaynak:'video'`, kcal katsayıdan türetilmiş |
| `program-detay:1531` | **sabit `dk:25, kcal:280`** | sayfanın kendi süre verisi + türetilmiş kcal + `'beyan'` |
| `challengeGunTamamla` | hiçbir şey | **hâlâ açık** (D19) |

`kaynak ∈ 'olculdu' · 'video' · 'cihaz' · 'beyan'`. Çağıran söylemezse `'beyan'`
yazılır — söylenmeyen şey ölçülmüş sayılamaz. Geçersiz değer sessizce `'beyan'`a
düşer (ölçüldü: `'sihirli'` → `'beyan'`).

`antrenmanTamamla()` artık **"bilmiyorum" diyebiliyor**: sayı verilirse o sayı
(0 dahil) · açıkça `kcal:null` → BİLİNMİYOR, toplama 0 katar · hiç verilmezse
280 (eski çağrılar kırılmasın). Eskiden `(a&&a.kcal)||280` yüzünden `0` ve
`null` de 280'e düşüyordu: çağıran uydurmak zorundaydı.

Ölçüm — 12 program antrenmanı, tek tek: süreler `25·25·25·28·28·28·30·30·30·30·32·30`
→ **farklı süre 4**, **sabit 280 kaydı 0**, kademe 12/12 `beyan`, toplam 341 dk.

---

## 3 · Sessiz veri kaybı kapandı

`programBasla()` aktif programın **üzerine yazıyordu**: önceki programın `biten`,
`kacan`, `baslangic` verisi yok oluyordu. "Geçmiş programların" kartı bu yüzden
sabit HTML'di — besleyecek veri yoktu.

Artık üzerine yazmadan önce `arsiv[]`'e alıyor. Ölçüldü: eski program
`biten:7 kacan:2` ile arşivlendi, `durum:'birakildi'`. Kart artık gerçek veriden:
`"8 Hafta Mobilite · Bırakıldı · 5/12 antrenman · %42 · 1 Ağustos 2026"`.

**Ama arşivleme sormanın yerini tutmaz** — çakışma paneli yine kuruldu.

---

## 4 · Tuzaklar — B44'ten devam

**B44 · `bitisTahmini()` kusuru: kalan süre BAŞLANGICA eklenmemeli.** Biten
seanslar zaten zaman tüketti; başlangıca eklemek "hiç antrenman yapılmamış gibi"
hesaplar ve `biten` arttıkça tahmini bitiş **geriye** gider. Kalan süre **bugüne**
eklenir; program henüz başlamadıysa referans başlangıçtır.
*Nasıl yakalandı:* iki sayı yan yana kondu — takvim son seansı 18 Eylül'e
çizerken çip 31 Ağustos diyordu. Tek sayıya bakan göremezdi.

**B45 · Yerel gece yarısı + `toISOString()` = gün kayması.** TR (UTC+3) için
bitmiş program "dün bitti" görünüyordu. Tarih referansını **öğlene** sabitle;
±12 saatlik hiçbir dilimde gün sınırını geçmez. Üç dilimde ölçüldü.

**B46 · Metin araması — nerede aradığın ölçümün parçası.** Üç yer, üç farklı
cevap; bu turda üçü de yanlış sonuca yol açtı. Ayrıntı `DENETIM.md` §2b.
Karşı kural: kaldırdığın metni yorumda **birebir alıntılama**.

**B47 · Paralel çalışırken ölçümün ZAMANI da ölçümün parçası.** Bir ajan iki
kusuru "hâlâ açık" diye bildirdi; ikisi de kapalıydı, ölçümü düzeltmeden önceye
aitti. Bu, §3'ün tersi: sonda doğruydu, **ölçülen taraf değişmişti**.

**B48 · `visibility:hidden` öğe denetime "görünür+adsız+etkisiz" görünür.**
`#wgBack` böyleydi. Çözüm `aria-disabled`/`aria-hidden` ile durumu doğru
söyletmek — hem bulguyu kapatır hem ekran okuyucuya doğru şeyi anlatır.

**B50 · `content-visibility:hidden` kapalı modalı ölçümden ÇIKARMAZ.** Chromium
atlanan alt ağaçta bile `getClientRects()` 1 döndürüyor. Bir ajan bunu "doğru
çözüm" sanıp uyguladı, **ölçtü**, tutmadığını gördü ve geri aldı. Ölçmeseydi
denetim yeşil sanılıp kusur kalacaktı. Çözüm `display:none` + geçişi koruyan JS.

**B51 · `opacity:0` öğe `getClientRects()`e GÖRÜNÜR gelir.** Hover arkasına
saklanan düğmeler hem kullanıcı için yok hem ölçüm için var — iki taraflı yalan.

**B52 · `fa-watch` FA 6.5.2 FREE'de YOK** (Pro ikonu). Genişlik 0, `content:none`.
Üç sayfada görünmez ikon basıyordu; `hakkimizda-v1`'deki dördüncüsü de kapatıldı.
İkon eklerken free sette var mı diye ölç — 17 ikon tek tek ölçülerek bulundu.

**B49 · Sayfa verisi düz liste sanılmamalı.** `program-detay`'ın süre kartları
**hafta bazlı**; global sırayla indekslemek yanlış seansa yanlış süreyi verir.

---

## 5 · Denetim aracı — ilk gerçek koşusunun bilançosu

`tools/denetim.mjs` (DEVIR-9'da yazıldı) bu turda **15 ölü etkileşim**
kapattırdı; dördü aylardır oradaydı ve hiçbir nöbet yakalamamıştı. Ayrıca
`fit-planim-rozetler-v1`'de bir "sahte durum" daha buldu.

Aracın kendisi de üç kez kör çıktı ve üçü de kodda yorumla kayıtlı — özet
`DENETIM.md`'de. Ek olarak `DENETIM.md`'nin kendi örnek listesindeki bir bulgu
**yanlış çıktı** ("katalogda Programa Başla ölü"); silinmedi, düzeltilip
kayıtta bırakıldı.

---

## 6 · Geri alınan yargı

**"Programa Başla hiçbir şey yapmıyor" YANLIŞTI.** R10-TAKVIM ölçümle itiraz
etti, dört kırılımda yeniden ölçüldü (üye/misafir × çerezli/çerezsiz), düğme
**çalışıyordu**. Lead'in ilk ölçümü hatalıydı.

Kalemin doğru hâli: **başlıyor ama takvime oturmuyordu** — ve bu tur onu kapattı.
Yayımlanmış akış dokümanı da düzeltildi; yanlış yargı silinmedi, yerine doğrusu
ve neyin yanlış olduğu yazıldı.

---

## 7 · AÇIK kalemler

Önceki turdan devam eden D11 (§9.4 sıralama, ürün kararı), D14 (Esneklik ve
Postür farkındalığı testleri yok), D15, D17 (`hesabim-v1`'de 11 ölü hesap
yönetimi düğmesi), D18 (üst bant 4 adsız sosyal bağlantı) duruyor.

**Bu turda kapananlar:** D8 · D9 · D10 · D12 · D13 · D16.

**Yeni:**

| No | Konu |
|---|---|
| D19 | `challengeGunTamamla()` hiçbir kayıt üretmiyor — kanıt kademesinin son boş hanesi |
| D20 | **Program içerikleri gerçek veri değil.** `program-detay` gövdesi 4 haftalık plan için elle yazılmış; öteki üç slug yalnız başlığı değiştiriyor. `TOPLAM=12` slug'a göre türetilemiyor, varsayılan `gunler:[1,3,5]` sayfa metninden alınıyor, sayfa haftada 2 kart gösterirken program 12 seans sayıyor (4×2=8 ≠ 12). Dört programın planını yazmak ayrı iş. **Aşağıdaki üç kalemin de kökü budur.** |
| D21 | Hero'daki "Bugünün Antrenmanı" sabit olarak Hafta 2 sekmesine atlıyor, program durumuna bakmıyor |
| D22 | `.ics` seans süresi 45 dk sabit — şemada seans süresi alanı yok |
| D23 | `fit-planim-programim-v1:608` plan silmede hâlâ `window.confirm` (R6'dan kalma) |
| D24 | Gün başına ısınma metni hareket ADI içermiyor — depoda adlı ısınma hareketi listesi yok (`hareket-isinma-soguma-v1` kavramsal, `.ex-card` 0) |
| D25 | Su sayfasındaki haftalık grafiğin geçmiş 6 günü örnek veri — şemada günlük su geçmişi yok. **Sayfa bunu kullanıcıya yazıyor.** |
| D26 | `fit-planim-v1`'in "Enerji dengesi" kartı hâlâ sabit |
| D27 | §7.4'ün altı ekseni **yalnız `fit-planim-gecmis`'te**. `aktivite-gunlugu` "bugünün kayıtları"nı tutuyor; program/kas grubu/ekipman/tamamlanma alanı orada hiç yok. Oraya bu eksenleri koymak hiç eşleşmeyecek çip basmak olurdu. Geri almak için o sayfaya tarihli kayıt şeması gerekir. **Kapsam daraltıldı, kapanmadı.** |
| D28 | **Süzgeç çipleri `aria-pressed` taşımıyor** — kabuk `.ff` bileşeni (`fit-shell.js:2479`) çipe `role="option"` verip `aria-pressed`i açıkça siliyor, yerine `aria-selected` yazıyor; ikisi aynı öğede duramaz. Ölçüldü: `.ff` içinde `aria-pressed` 0, `aria-selected` 23/23. `.ff` DIŞINDA kural uygulandı (rapor dönemi 2/2, hareket seçici 5/5). Kabuk sözleşmesini değiştirmek lead'in kararı. |
| D29 | Rapor kayıtları **döneme bölmüyor** — `gecmis[].tarih` serbest metin (`'bugün'`, `'3 gün önce'`). Süre rakamları `hafta[]`'den geldiği için döneme daralıyor; kayıt sayısı ve kanıt kırılımı defterin tamamını kapsıyor. **Bu ekranda yazılı**, bölünmüş gibi gösterilmedi. ISO tarih alanı gerekir. |
| D30 | R10-ILERLEME **yeni nöbet yazmadı** — bu turun kazanımları (kanıt kademesi görünürlüğü, §7.4 süzme sayıları, boş depo dürüstlüğü) nöbete bağlı değil. Var olan altı nöbet koşuldu, hiçbiri gevşetilmedi. |
| D31 | FPX yardımcı bloğu iki Fit Planım sayfasında **birebir kopya** (depodaki mevcut desen). Ortak dosyaya taşımak kabuk dosyası gerektiriyor. |

---

## 7b · Kanıt kademesinin GÖRÜNÜR hâli (R10-ILERLEME)

Kanıt kademesi şemada durmakla kalmadı, kullanıcıya gösterildi. Kademe **renkle
tek başına anlatılmıyor** — kelime + ikon + çerçeve (düz/kesikli/noktalı), yani
gri baskıda ve renk körlüğünde de ayrık (belge: "grafikler yalnız renkle
okunmayacak"). Ekranda:

```
Alt vücut ve core · bugün · 26 dk        [⏱ kronometreyle ölçüldü]
Sabah Esneme Videosu · dün · 20 dk       [▶ video izlendi]
Üst vücut · 3 gün önce · 25 dk           [✎ senin beyanın]
Akşam yürüyüşü · 4 gün önce · 38 dk      [▣ cihazdan geldi]
```

Defter istatistiği artık **"1 / 5 kronometreyle ölçülmüş"** diyor — kullanıcı
kendi geçmişinin ne kadar sağlam olduğunu görüyor. Ayrıca dört kademenin ne
demek olduğu sayfada bir kez sözlük olarak yazılı.

**İki "kaynak" karışmıyor:** `aktivite-gunlugu`'ndaki eksen **"cihaz kaynağı"**
oldu (saat/telefon/manuel), `gecmis[].kaynak` ise **kanıt kademesi**. İkisi
akraba ama aynı şey değil; iki sayfada da farkı anlatan not var. "Antrenör
verdi" rozeti de kanıt sözlüğünden ayrı görsel dile taşındı — *planı kimin
yazdığı*, *kaydın neye dayandığı* değildir.

**Boş depo dürüstlüğü — ajanın kendi yakaladığı.** Kabuğun BOŞ durumu
`hafta:[62,74,90,96,118,142]` ile geliyor; hiç antrenman yapmamış kullanıcıda
bile dolu. Bu sayıları "senin haftan" diye basmak uydurma olurdu. Haftalık süre
artık ancak `gecmis[]` doluysa gösteriliyor. Ölçüldü (boş depo): "— bu hafta
hareket" · "Haftalık süre kaydın yok" · "Kıyaslamak için iki hafta gerek" ·
sabit "7 / 30" ve "%78" ve "+%25" **0** · kabuk varsayılan sayıları **basılmıyor**.

**§5.8 raporlama** — PDF **üretilmiyor ve bu ekranda yazılı**; üretilen CSV
gerçek (ölçüldü: `dadafit-haftalik-rapor-2026-08-23.csv` · 466 bayt · 12 satır ·
BOM'lu). "Antrenörle paylaş" sahte gönderim yapmıyor, ne gideceğini yazıp
antrenör sayfasına kapı açıyor.

**§7.4 filtreler** — `fit-planim-gecmis`'te `.fgroup` 0 → **6 eksen, 23 çip**;
Program/Kas grubu/Ekipman çipleri **kayıtlı planlardan üretiliyor**, veri yoksa
eksen hiç basılmıyor. Ölçülen süzme: `durum=atlandi` 9→1 · `veren=antrenor` 9→2
· `atlandi+antrenor` →0 (+ boş durum). URL senkronu çalışıyor.

**Tasarım kararı, bildirilmiş:** depodaki `.fpx-ops` deseni bu düğmeleri
`opacity:0` ile hover arkasına saklıyor; ajan **kullanmadı**. Gerekçe iki katlı
ve doğru: görünmeyen düğme olmayan düğmedir, **ayrıca `getClientRects()`
`opacity:0` elemanı "görünür" sayar** — yani ölçüm de yalan söylerdi.

---

## 8 · Yeni dosyalar

- `assets/js/fit-takvim.js` — `window.FIT_TAKVIM`; sözleşmesi dosyanın başında.
  **Depoya YAZMAZ**, yazma tek kapıdan (`FIT_SHELL.state`).
- `tests/program-takvim.mjs` — 127 ölçüm. Taban `8358446`'da aradığı 7 çapanın
  hepsi 0 kez geçiyor. C bölümü kanıt kademesini tutuyor: sabit `dk:25/kcal:280`
  geri gelirse kırmızıya döner.
- `tests/bugunku-antrenman.mjs` — taban `8358446`'da **16 sorunla** kırmızı.
