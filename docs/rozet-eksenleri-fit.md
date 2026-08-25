olcum v1 · 2026-08-25 · şerit: FIT · iş kalemi: Y2.5-b

# FIT ŞERİDİ — ROZET EKSENLERİ ÖLÇÜMÜ

**Ne bu:** K2 gereği Fit kendi rozet dünyasını kuracak; Gastro'nun motoru
**desendir**, katalog değil. Bu belge Fit'in bugünkü rozet yüzeyini ölçer ve
**hangi eksenlerin sayılabilir durumda olduğunu** bildirir.

🔴 **KURAL ÖNERİLMEDİ, EKSEN ÖLÇÜLDÜ.** Bu belgede "şu rozeti verelim"
cümlesi yoktur. "Bu markada şu olaylar sayılabilir durumda" cümlesi vardır.

**Kaynaklar:** `rozetler-v1.html` (608 satır) · `fit-planim-rozetler-v1.html`
(377 satır) · `assets/js/fit-plan-kayit.js` (`FIT_PLAN` sözleşme modülü) ·
veri giren ekranlar.

---

## 1 · İKİ ROZET YÜZEYİ VAR — ayrımı önce koymak gerekiyor

| Sayfa | Ne | Veri kaynağı |
|---|---|---|
| **`rozetler-v1.html`** | **Rozet galerisi** — 8 aile · 42 rozet · 8 basamaklı yolculuk | **Tamamen statik.** Sayfanın kendi notu: *"Bu ekrandaki sayılar örnek bir hesaba aittir; gerçek kullanıcı verisi değildir"* (`:389`) |
| **`fit-planim-rozetler-v1.html`** | **"Challenge ve Rozetler"** — aktif challenge · seri kuralı · **3** rozet kartı | **Karma.** Challenge tarafı `FIT_PLAN`den **gerçekten** okuyor (`:176`, `:338-339`); rozet tarafı markup'a yazılı 3 karttan ibaret (`:117-136`) |

⚠ **Ölçülen kusur, kayda geçer:** `fit-planim-rozetler-v1.html:112` galeriye
giden bağlantıyı **"DadaGastro rozetleri"** diye etiketliyor — ama hedef
`rozetler-v1.html`, yani Fit'in kendi galerisi. Metin hatası; rozet işi
başlamadan düzeltilmeli.

---

## 2 · "YOLCULUK" KAVRAMI — 8 basamak

**Yer:** `rozetler-v1.html:340-375` (`.ladder-sec`).

### 2.1 · Kavramın kendi cümlesi

Sayfanın anlattığı (`:345`):
> *"Basamakların tek ölçüsü var: kaç gün hareket ettiğin. Başlangıç'tan
> Kendi Yolun'a sekiz basamak — **hiçbiri başka kullanıcıyla kıyas içermez.**"*

Ve `:335`:
> *"Rozetler kıyas için değil, kendi kilometre taşların için — ölçü
> başkasının sonucu değil, senin başlangıç noktan."*

🔴 **Bu, Gastro'nun topluluk kademesinden kavramsal olarak AYRILAN noktadır.**
Gastro'da kademe topluluk puanına bağlıdır; Fit'te **tek ölçü aktif gün
sayısıdır** ve sıralama bilerek yoktur (`hesabim-v1.html:571-583` sıralama
anahtarı bu yüzden sökülmüştür).

### 2.2 · Sekiz basamak — eşikleriyle

| # | Basamak | `data-rank` | Eşik | Durum (makette) | Rozet sayısı |
|---|---|---|---|---|---|
| 1 | Başlangıç | `baslangic` | **1 aktif gün** | tamamlandı | 9 rozet açıldı |
| 2 | İlk Hafta | `ilk-hafta` | **7 aktif gün** | tamamlandı | 6 rozet açıldı |
| 3 | **İlk Ay** | `ilk-ay` | **20 aktif gün** | **buradasın** | 15 rozet açıldı |
| 4 | Üç Ay | `uc-ay` | **45 aktif gün** | kilitli | 6 rozet bekliyor |
| 5 | Altı Ay | `alti-ay` | **90 aktif gün** | kilitli | 2 rozet bekliyor |
| 6 | Bir Yıl | `bir-yil` | **180 aktif gün** | kilitli | 2 rozet bekliyor |
| 7 | İki Yıl | `iki-yil` | **365 aktif gün** | kilitli | 1 rozet bekliyor |
| 8 | Kendi Yolun | `kendi-yolun` | **500 aktif gün** | kilitli | 1 rozet bekliyor |

Kanıt: `rozetler-v1.html:363-371` (sekiz `.rank-step` düğmesi).

### 2.3 · Mevcut basamak paneli — hangi alanlar var

`.rank-now` bloğu (`:349-358`) şu veri noktalarını basıyor:

| Alan | Değer (makette) | Kanıt |
|---|---|---|
| Sıra | `Mevcut basamak · 3 / 8` | `:352` |
| Basamak adı + sayaç | `İlk Ay · 26 aktif gün` | `:353` |
| Sonraki basamak + kalan | `Üç Ay — 19 aktif gün kaldı` | `:354` |
| Kaçırma kuralı | *"Kaçırdığın gün geri saymaz; kaldığın yerden devam eder."* | `:354` |
| İlerleme çubuğu | `%24` | `:355` |
| Çubuk altı meta | `26 aktif gün` ↔ `Üç Ay'a 45` | `:356` |

### 2.4 · Basamak ↔ rozet bağı — Fit'e özgü ikinci eksen

🔴 **Fit'te her rozetin bir basamağı vardır.** Her `.badge-card` bir
`data-rank` taşır (`:403` ve devamı) ve her rozet ipucunun sonunda
`.tip-rank` ile *"Başlangıç basamağı"* / *"Üç Ay basamağı"* yazar.

Basamak kartına tıklanınca galeri **o basamağın rozetlerine süzülür**
(`:362` `.ladder-hint`: *"Bir basamağa dokun — o basamakta açılan rozetleri
aşağıda gör"*; filtre şeridi `:392-397`, JS `:507+`).

→ **Bu, Gastro'nun deseninde olmayan bir bağdır**: Fit'te rozetin *ailesi*
(ne ölçtüğü) ile *basamağı* (ne zaman açıldığı) **iki ayrı eksendir**.

---

## 3 · SEKİZ ROZET SERİSİ — tam liste

**Toplam 42 rozet · 21 kazanılmış · 21 yolda** (`:385-388` `.bgal-stat` sayaç
pilleri doğruluyor).

Her serinin başında **`.badge-src` "Ölçü:" satırı** vardır — seri hangi
veriden türediğini kendisi söyler. Bu, desen belgesi için doğrudan
kullanılabilir bir alandır.

### 3.1 · Başlangıç — `data-cat="baslangic"` · 5/5 · `:399`

**Ölçü:** *"ilk kez yapılanlar — kişisel kilometre taşların."*

| Rozet | Basamak | Tetik metni (`.tip-how`) |
|---|---|---|
| İlk Hareket | `baslangic` | İlk hareketini tamamla |
| İlk Antrenman | `baslangic` | Bir antrenmanı sonuna kadar götür |
| İlk Program Günü | `baslangic` | Bir programın 1. gününü tamamla |
| İlk Adım | `ilk-hafta` | Bir challenge'ın ilk gününü tamamla |
| İlk Ay Tamam | `ilk-hafta` | Başlangıcından 30 gün sonra hareket et |

### 3.2 · Aktif Gün ve Seri — `aktif-gun` · 3/8 · `:412`

**Ölçü:** *"aktif olunan gün sayısı ve üst üste hareket edilen gün (seri)."*

| Rozet | Basamak | Eşik |
|---|---|---|
| 7 Aktif Gün | `baslangic` | toplam 7 gün |
| 5 Gün Seri | `ilk-hafta` | 5 gün üst üste |
| 20 Aktif Gün | `ilk-ay` | toplam 20 gün |
| 10 Gün Seri | `ilk-ay` | 10 gün üst üste |
| 50 Aktif Gün | `uc-ay` | toplam 50 gün |
| 100 Aktif Gün | `alti-ay` | toplam 100 gün |
| 250 Aktif Gün | `bir-yil` | toplam 250 gün |
| 500 Aktif Gün | `kendi-yolun` | toplam 500 gün |

**Seri kuralı burada tanımlı** (`:421`): *"Bir gün kaçırmak seriyi sıfırlamaz
— ay içinde **iki telafi hakkın** var."*

### 3.3 · Kuvvet — `kuvvet` · 3/5 · `:428`

**Ölçü:** *"kuvvet çalışılan gün sayısı · set, tekrar ve ağırlık gelişimi."*

| Rozet | Basamak | Eşik |
|---|---|---|
| İlk Kuvvet Günü | `baslangic` | bir kuvvet çalışması |
| Kuvvette İlerleme | `ilk-ay` | bir harekette ağırlık ya da tekrar artır |
| 10 Kuvvet Günü | `ilk-ay` | toplam 10 kuvvet günü |
| Plank 60 Saniye | `ilk-ay` | 60 sn plank (hareket-özel) |
| 25 Kuvvet Günü | `uc-ay` | toplam 25 kuvvet günü |

⚠ **"Plank 60 Saniye" tek hareket-özel rozettir** — diğer 41'i toplu ölçüye
bağlıdır. Desen belgesinde bu ayrı bir tetik türüdür.

### 3.4 · Hareket Süresi — `sure` · 2/5 · `:441`

**Ölçü:** *"haftalık ve toplam hareket süresi (dakika)."*

| Rozet | Basamak | Eşik |
|---|---|---|
| İlk 10 Dakika | `baslangic` | tek seferde 10 dk |
| 300 Dakika Toplam | `ilk-hafta` | toplam 300 dk |
| Haftada 150 Dakika | `ilk-ay` | **haftalık** 150 dk |
| 10 Saat Toplam | `ilk-ay` | toplam 600 dk |
| 50 Saat Toplam | `alti-ay` | toplam 3.000 dk |

⚠ **İki farklı pencere var:** "tek seferde" · "haftalık" · "toplam".
Üçü ayrı sayaç ister.

### 3.5 · Program ve Challenge — `program` · 2/5 · `:454`

**Ölçü:** *"tamamlanan program günü, program tamamlama oranı ve challenge
ilerlemesi."*

| Rozet | Basamak | Eşik |
|---|---|---|
| İlk Challenge Tamam | `baslangic` | bir challenge'ı tamamla |
| Programın Yarısı | `ilk-hafta` | bir programın %50'si |
| İlk Program Tamam | `ilk-ay` | program tamamlama |
| 30 Gün Tamam | `ilk-ay` | 30 challenge günü |
| Üç Challenge | `uc-ay` | 3 challenge tamamlama |

### 3.6 · Çeşitlilik ve Toparlanma — `cesitlilik` · 3/5 · `:467`

**Ölçü:** *"hareket çeşitliliği ve planlı dinlenme günü. **Dinlenme de
ilerlemenin parçasıdır.**"*

| Rozet | Basamak | Eşik |
|---|---|---|
| Beş Farklı Hareket | `baslangic` | bir haftada 5 farklı hareket |
| Dinlenmeyi Bilen | `ilk-hafta` | bir dinlenme gününü planına al |
| Isınma ve Soğuma | `ilk-ay` | 10 antrenmanı ısınma+soğuma ile bitir |
| On Farklı Hareket | `ilk-ay` | 10 farklı hareket türü |
| Dengeli Ay | `uc-ay` | bir ayda kardiyo da ekle |

🔴 **"Dinlenmeyi Bilen" ölçüm açısından dikkate değer:** rozetin tetiği
*hareket etmek* değil, *hareket etmemeyi planlamak*. Gastro'nun deseninde
karşılığı olmayan bir tetik türüdür.

### 3.7 · Adım — `adim` · 1/4 · `:480`

**Ölçü:** *"günlük adım sayısı. Şu anki ortalaman günde 6.400 adım."*

| Rozet | Basamak | Eşik |
|---|---|---|
| İlk 5.000 Adım | `baslangic` | bir günde 5.000 adım |
| 7.500 Adım | `ilk-ay` | bir günde 7.500 adım |
| Yürüyen Hafta | `ilk-ay` | 3+ gün adım hedefini tuttur |
| 10.000 Adım | `uc-ay` | bir günde 10.000 adım |

🔴 **Bu serinin veri kaynağı dışarıdadır** — adım verisi telefondan/saatten
gelir (`bagli-uygulamalar-v1.html`). Bkz. §5, E7.

### 3.8 · Kişisel Kilometre Taşları — `kilometre` · 2/5 · `:492`

**Ölçü:** *"kendi başlangıç noktana göre gelişim. **Bu ailedeki hiçbir rozet
başka kullanıcıyla karşılaştırma içermez.**"*

| Rozet | Basamak | Eşik |
|---|---|---|
| Kendi Rekorun | `ilk-ay` | bir harekette kendi rekorunu geç |
| Başlangıcının İki Katı | `ilk-ay` | haftalık süreyi başlangıcın 2 katına çıkar |
| Sekiz Hafta Kesintisiz | `uc-ay` | 8 hafta üst üste en az 1 hareket |
| Bir Yıllık Yolculuk | `bir-yil` | üyelikte 365 gün |
| İki Yıllık Yolculuk | `iki-yil` | üyelikte 730 gün |

🔴 **"Kendi Rekorun" ve "Başlangıcının İki Katı" öz-referanslı tetiklerdir:**
eşik sabit bir sayı değil, **kullanıcının kendi geçmişinden hesaplanır.**
Makette bunun örneği de yazılı: *"62 dk → 142 dk"*.

---

## 4 · GÖRSEL DİL — desen belgesine giren biçim kararları

Rozet kartının **tek** yapısı vardır (`:403`, örnek kart); 42'sinin hepsi
aynı kalıptır.

| Katman | Kazanılmış rozet | Kilitli rozet |
|---|---|---|
| Kart sınıfı | `.badge-card` | `.badge-card.locked` |
| Kilit ikonu | yok | `.badge-lock` (`fa-lock`) |
| İkon | `.badge-ico` dolu | `.badge-ico` soluk |
| Alt satır | `<span>8 Tem 2026</span>` | `<span>Yolda</span>` |
| Durum notu | `.b-note.earned` — *"Kazanıldı · 8 Tem 2026"* | `.b-note.locked` — **tek satırda** `26 / 50 gün · 24 kaldı` + `.b-prog` yüzde çubuğu |
| İpucu | `.badge-tip` — başlık + açıklama + `.tip-how` (nasıl kazanılır) + `.tip-rank` (basamak) | aynı, `.tip-how` ikonu `fa-lock` |
| Erişilebilirlik | `tabindex="0"` — ipucu klavyeyle de açılır | aynı |

🔴 **Gastro'nun "korunacak iki kararı" Fit maketinde ZATEN görsel karşılığını
bulmuş durumdadır:**
1. **nullable `earned_at`** → kart ya tarih basıyor ya `Yolda`
2. **tek satırda ilerleme** → `.b-note.locked` tek satırda `x / y · z kaldı`

Desen transferinde çevrilecek kavram yok; yapılacak iş bu görselin altına
motor koymaktır.

**Seri başlığı kalıbı** (`.badge-head`, `:400`): başlık + ikon +
`.bh-cnt` sayacı (`3 / 8`). Altında **`.badge-src` "Ölçü:" satırı** —
serinin hangi veriden türediğini kullanıcıya söyleyen açık cümle.
Bu, Fit'in ölçülebilirlik duruşunun görünen yüzüdür.

**Galeri üstü sayaç şeridi** (`.bgal-stat`, `:385-388`): `21 kazanıldı` ·
`21 yolda` · `582 dk toplam hareket`.

---

## 5 · EKSENLER — hangi veri makette GİRİLİYOR, hangi ekranda?

Bu bölüm §3'ün serilerini **veri girişine** bağlar. Sütunlar:
*eksen · rozette kullanılıyor mu · makette giriliyor mu · hangi ekranda ·
nerede saklanıyor.*

| # | Eksen | Rozette | Makette giriliyor mu | Giriş ekranı | Saklama |
|---|---|---|---|---|---|
| **E1** | **Aktif gün** (bir günde en az bir hareket) | 8 rozet + **tüm merdiven** | **EVET** | `aktivite-gunlugu-v1.html:630-680` kayıt formu · `fit-planim-programim-v1.html` gün tamamlama | `FIT_PLAN.gunDurum['g1'] = {durum:'tamamlandi', tarih, kayit}` (`fit-plan-kayit.js:38-40`) |
| **E2** | **Seri** (üst üste gün) + telafi hakkı | 2 rozet | **EVET** — hesaplanıyor | `fit-planim-rozetler-v1.html:338-339` | türetilmiş; telafi tavanı JS'e gömülü (`2`) |
| **E3** | **Hareket süresi** (dk) — tek seferlik · haftalık · toplam | 5 rozet | **EVET** | `aktivite-gunlugu-v1.html:657` `#agDk` (`number`, `min=1 max=600`) | kayıt satırı + `FIT_PLAN` |
| **E4** | **Kuvvet günü** | 3 rozet | **KISMEN** — antrenman türü seçiliyor ama "kuvvet" ayrı bir tür değil | `aktivite-gunlugu-v1.html:638-643` — 4 tür: `yuruyus` · `kosu` · `bisiklet` · `antrenman` | kayıt satırı `data-tur` |
| **E5** | **Set / tekrar / ağırlık gelişimi** | 2 rozet | **EVET** | Program günü işaretleme akışı | `FIT_PLAN.ilerleme['g1-h0'] = {yapildi, seviye, tarih, **agirlik**, **tekrarYapilan**, **efor**}` (`fit-plan-kayit.js:33-35`) |
| **E6** | **Program günü / tamamlama oranı** | 3 rozet | **EVET** | `fit-planim-programim-v1.html` · `program-detay-v1.html` | `FIT_PLAN.gunDurum` + `FIT_PLAN.ozet()` |
| **E7** | **Adım sayısı** | 4 rozet | **EVET, iki yoldan** | (a) elle: `aktivite-gunlugu-v1.html:668` `#agAdimIn` (`number`, `max=100000`) · (b) cihazdan: `bagli-uygulamalar-v1.html` "Adım sayısı ve mesafe" (`:241`) | kayıt satırı; cihaz yolu **SADECE ARAYÜZ** |
| **E8** | **Challenge ilerlemesi** | 3 rozet | **EVET** | `challenge-v1.html:676` 30 günlük takvim · veri `:1063` | `FIT_PLAN` üzerinden (`fit-planim-rozetler-v1.html:176`) |
| **E9** | **Hareket çeşitliliği** (kaç farklı hareket / tür) | 2 rozet | **TÜRETİLEBİLİR** — ayrı giriş yok, kayıtlardan sayılır | `aktivite-gunlugu` tür alanı + `FIT_PLAN.gunler[].hareketler[].slug` | türetilmiş |
| **E10** | **Planlı dinlenme günü** | 2 rozet | **EVET** | `fit-planim-programim-v1.html:896` "Dinlenme günü ekle → takvimde gün seç → `dinlenmeEkle`" · takvimde ayrı etiket `:1010` | plan içinde gün türü |
| **E11** | **Isınma ve soğuma** | 1 rozet | **KISMEN** — plan şemasında `isinma` alanı var, soğuma alanı yok | plan verisi | `FIT_PLAN.gunler[].isinma` (`fit-plan-kayit.js:22`) |
| **E12** | **Kişisel rekor** (öz-referanslı) | 1 rozet | **TÜRETİLEBİLİR** | E5'in `agirlik`/`tekrarYapilan` geçmişinden | türetilmiş |
| **E13** | **Başlangıca göre gelişim** (haftalık süre × 2) | 1 rozet | **TÜRETİLEBİLİR** | E3'ün haftalık toplamından | türetilmiş; `fit-planim-ilerleme-v1.html:190` "Başlangıç ve bugün" bölümü zaten bu ekseni gösteriyor |
| **E14** | **Üyelik yaşı** (365 / 730 gün) | 2 rozet | **HAYIR** — hesap açılış tarihi makette hiçbir yerde yok | — | **YOK** |
| **E15** | **Kesintisiz hafta** (8 hafta) | 1 rozet | **TÜRETİLEBİLİR** | E1'in haftalık kümelemesinden | türetilmiş |
| **E16** | **Tek hareket performansı** (plank 60 sn) | 1 rozet | **KISMEN** — `FIT_PLAN.ilerleme`de `sure` hareket düzeyinde var | program günü işaretleme | `FIT_PLAN.gunler[].hareketler[].sure` |

**Girişi olmayan tek eksen: E14 (üyelik yaşı).** Diğer 15'inin ya doğrudan
girişi ya da türetim kaynağı makette vardır.

### 5.1 · Nabız ve mesafe — rozette YOK, veride VAR

Ölçüm bütünlüğü için kayda geçer: `aktivite-gunlugu-v1.html` iki alan daha
topluyor ama **hiçbir rozet bunları kullanmıyor**:

| Alan | Giriş | Kanıt |
|---|---|---|
| **Mesafe (km)** | `#agKm` — `number`, `min=0 max=300 step=0.1` | `:663` |
| **Nabız** | `#agNabiz` — `number`, `min=30 max=230`, *(isteğe bağlı)* | `:673` · başlıkta da "isteğe bağlı" `:395` |

Bağlı Uygulamalar da ikisini sayıyor: *"Adım sayısı ve **mesafe**"* ·
*"**Nabız** ve uyku — yalnız sen açarsan"* (`bagli-uygulamalar-v1.html:241,244`).

→ **İki sayılabilir eksen daha var, bugün rozete bağlı değil.**
(Nabız için sayfanın kendi tıbbi şerhi geçerlidir: *"cihazının tahminidir;
klinik ölçüm değildir"*, `:263-268`.)

### 5.2 · Sayılabilir olayların listesi — kullanıcının makette yaptıkları

Rozet motoru için tetikleyici olabilecek, **makette gerçekten yapılabilen**
eylemler:

| Olay | Nerede | Bugün gerçekten oluyor mu |
|---|---|---|
| Aktivite kaydı ekleme | `aktivite-gunlugu-v1.html` kayıt formu | **EVET** (form doğrulamalı, listeye ekliyor) |
| Program günü tamamlama | `fit-planim-programim-v1.html` | **EVET** (`FIT_PLAN.gunKayitIsaretle`) |
| Hareket işaretleme (set/tekrar/ağırlık/efor) | program günü akışı | **EVET** (`FIT_PLAN.isaretle`) |
| Plan oluşturma | `antrenman-olusturucu-v1.html` | **EVET** (`FIT_PLAN.kaydet`) |
| Planı aktif yapma / arşivleme / yeniden başlama | Fit Planım | **EVET** (`aktifYap` · `planArsivIsaretle` · `yenidenBasla`) |
| Dinlenme günü ekleme | `fit-planim-programim-v1.html:896` | **EVET** |
| Challenge gününü tamamlama | `challenge-v1.html` | **EVET** |
| Su kaydı | `enerji-defteri-su-v1.html` | **EVET** — ⚠ hiçbir rozet su eksenini kullanmıyor |
| Öğün / enerji kaydı | `enerji-defteri-v1.html:539` | **EVET** — ⚠ rozete bağlı değil |
| Fit Testi tamamlama | `fit-testi-detay-v1.html` · `fit-test-sonuclarim-v1.html` | **EVET** — ⚠ rozete bağlı değil, 7 test var (`fit-testleri-v1.html:291-411`) |
| Hareket/program kaydetme (yer imi) | `fit-planim-kaydettiklerim-v1.html` | **EVET** — rozete bağlı değil |
| Takvime aktarma (`.ics`) | `assets/js/fit-takvim.js` | **EVET** — rozete bağlı değil |
| Antrenör randevusu alma | `antrenor-detay-v1.html:1065-1097` | **SADECE ARAYÜZ** |
| Cihaz bağlama | `bagli-uygulamalar-v1.html` | **SADECE ARAYÜZ** |

🔴 **Rozete bağlı olmayan ama sayılabilir durumda olan beş eksen ölçüldü:**
su · enerji/öğün kaydı · fit testi · kaydetme · takvime aktarma.
Bunların rozetleşip rozetleşmeyeceği **karar konusudur, ölçüm konusu değil.**

---

## 6 · DEPOLAMA SÖZLEŞMESİ — motorun bugün okuyacağı yer

Fit'te rozet motoru yazılacaksa okuyacağı tek kaynak ölçüldü:
**`assets/js/fit-plan-kayit.js` · `window.FIT_PLAN`**
→ `localStorage['dm_fit_planlar_v1']`

**API yüzeyi (16 çağrı):** `kullanilabilir` · `kaydet` · `listele` ·
`getir` · `sil` · `aktifYap` · `aktif` · `isaretle` · `planArsivIsaretle` ·
`bitisKartiKapat` · `yenidenBasla` · `gunDurumu` · `gunKayitIsaretle` ·
`isaret` · `ozet` · `temizle`.

**Modülü okuyan 10 sayfa:** `aktivite-gunlugu` · `antrenman-olusturucu` ·
`fit-planim` · `fit-planim-programim` · `fit-planim-gecmis` ·
`fit-planim-ilerleme` · `fit-planim-kaydettiklerim` · `fit-planim-randevular` ·
`fit-planim-rozetler` · `fit-planim-saglik-profil`.

**Sözleşme kuralı markup'ta yazılı** (`fit-planim-rozetler-v1.html:161-164`):
> *"`window.FIT_PLAN` tek kaynaktır. Bu blok kendi depolama kodunu YAZMAZ —
> yalnız FIT_PLAN'ı okur ve `FIT_PLAN.isaretle()` çağırır. Modül yoksa sayfa
> sessizce boş duruma düşer."*

**`dm_fit_*` anahtar ailesi (9 anahtar):** `dm_fit_planlar_v1` ·
`dm_fit_motion` · `dm_fit_ex` · `dm_fit_recent` · `dm_fit_video` ·
`dm_fit_sound` · `dm_fit_vibe` · `dm_fit_kcal_hidden` · `dm_fit_`.
Ayrıca kabuk `dm_user` (paket kademesi) ve `dm_auth` okuyor.

→ **Rozet motoru için "olay-güdümlü" desenin Fit'teki karşılığı bu modüldür.**
`isaretle` · `gunKayitIsaretle` · `kaydet` · `yenidenBasla` çağrıları
doğal tetik noktalarıdır.

---

## 7 · ÖZET — desen belgesine giden ölçümler

| Ölçüm | Fit |
|---|---|
| Kademe merdiveni | **8 basamak**, tek ölçü **aktif gün sayısı** (puan DEĞİL) |
| Rozet ailesi | **8** |
| Rozet sayısı | **42** (21 kazanılmış / 21 yolda) |
| Rozet başına eksen | 1 aile ekseni + 1 basamak bağı = **iki eksen** |
| Ölçülebilir eksen | **16** — 15'inin girişi veya türetim kaynağı var, **1'inin (üyelik yaşı) yok** |
| Rozete bağlı olmayan sayılabilir eksen | **7** (su · enerji/öğün · fit testi · kaydetme · takvim · mesafe · nabız) |
| Öz-referanslı tetik | **3** (Kendi Rekorun · Başlangıcının İki Katı · Sekiz Hafta Kesintisiz) |
| Hareket-özel tetik | **1** (Plank 60 Saniye) |
| Negatif-eylem tetiği | **1** (Dinlenmeyi Bilen — hareket etmemeyi planlamak) |
| Sıralama / liderlik tablosu | **YOK — bilinçli ürün duruşu** (`hesabim-v1.html:571-583`) |
| Editöryal (elle verilen) rozet | **YOK** — 42'sinin hepsi ölçüme bağlı |
| Motor | **YOK** — galeri statik; tetiklenecek depolama sözleşmesi (`FIT_PLAN`) hazır |
| Admin yönetimi | **YOK** — Fit'te yönetim paneli yok |

🔴 **Gastro deseninden Fit'e taşınırken ölçülen üç fark** (öneri değil, ölçüm):
1. **Kademe ölçüsü farklı:** Gastro puan, Fit **aktif gün**.
2. **Basamak ↔ rozet bağı Gastro'da yok:** Fit'te her rozetin bir basamağı var
   ve galeri basamağa göre süzülüyor.
3. **Editöryal rozet Fit'te yok:** Gastro'nun `trigger_key = null` yolu
   (Dada Şefi · Editör Onaylı) Fit maketinde karşılıksızdır — 42 rozetin
   hepsi ölçülebilir veriye bağlıdır.

---

*Ölçüm sonu. Kural önerilmedi.*
