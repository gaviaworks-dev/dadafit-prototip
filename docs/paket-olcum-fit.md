olcum v1 · 2026-08-25 · şerit: FIT
kaynak tablo: `dadagastro-profil/docs/hesap-mimarisi/uyelik-paketleri.md §6` (v2)

# FIT ŞERİDİ — PAKET TABLOSU ÖLÇÜMÜ

**Ne bu:** `uyelik-paketleri.md §6`'daki FF1–FF13 · FP1–FP15 · §6.3
satırlarının, aynı numaralarla, `Bugün` ve `Kanıt` sütunları **ölçülerek**
doldurulmuş hâli.

**Ölçüm dili (yalnız bu beşi):**
`VAR` · `YARIM` · `YOK` · `SADECE ARAYÜZ` · `KAPSAM DIŞI (E2)`

**`VAR` bu depoda ne demek:** Fit'te sunucu yoktur. Bir satır `VAR`
işaretlendiyse **tarayıcıda gerçekten çalışıyor** demektir (hesaplıyor,
`localStorage`'a yazıyor, okuduğunu geri veriyor) — sunucu tarafı olduğu
anlamına gelmez. `SADECE ARAYÜZ`, ekranın tam çizildiği ama davranışın
sahte/statik olduğu satırdır.

**Kanıt:** `dosya:satır`. Tahmin yok; ölçülemeyene sebebi yazıldı.

---

## 0 · ÖLÇÜMÜN ÖZETİ

| Ölçüm | Sayı |
|---|---|
| §6.1 Ücretsiz satırı (FF1–FF13) | 13 |
| §6.2 Pro satırı (FP1–FP15) | 15 |
| §6.3 Pro Max AI | 1 (soru) |
| Kapsam dışı işaretli satır (tabloda hazır) | 2 |
| **EK BULGU** satırı (makette var, tabloda yok) | **5** |
| **Toplam ölçülen satır** | **33** |

**Dağılım (FF1–FF13 + FP1–FP15 = 28 satır):**

| Sonuç | Adet |
|---|---|
| `VAR` | **7** |
| `YARIM` | **6** |
| `SADECE ARAYÜZ` | **12** |
| `YOK` | **3** |
| ölçülemedi | **0** |

---

## 1 · PAKET KAPILARI — bugün gerçekten ne çalışıyor?

§7.3'ün istediği üçlü ayrım (04 §B.2 dili), Fit'te ölçüldü:

| Kapı | Mekanizma | Ayrım |
|---|---|---|
| **Kademe anahtarı** | `localStorage.dm_user.paket` ∈ {`ucretsiz`,`pro`,`pro_max`} | **kapı gibi davranıyor** — kabuk menü kaleminin adını, hedefini ve ikonunu gerçekten değiştiriyor (`assets/js/fit-shell.js:432-443`) |
| **Pro kapısı** | `data-pro-gate` → `#proGate` açılır penceresi | **tüketicisi var** (11 dosya · 26 tetikleyici) ama **içerik gizlemiyor**: kilitli satır zaten kilitli çizilmiş bir teaser'dır, arkasında içerik yok (`assets/js/fit-shell.js:925-943`) |
| **Ödeme sorunu bayrağı** | `localStorage.dm_user.odemeSorunu` | **tüketicisi tek**: menü kalemini "Aboneliğim — İşlem Gerekli"ye çeviriyor (`fit-shell.js:437-438`). Başka hiçbir yerde okunmuyor |

🔴 **Daima `false` döndüren kapı Fit'te YOKTUR.** Üçünün de tüketicisi var;
üçü de istemci tarafındadır, sunucu kapısı değildir.

**`data-pro-gate` tetikleyicisinin dağılımı (26 adet · 11 dosya):**
`dadafit-hub`(5) · `profil-v1`(3) · `arama-fit`(2) · `dadafit-kopru`(2) ·
`egzersiz-detay`(2) · `enerji-defteri`(2) · `enerji-defteri-dengele`(2) ·
`enerji-defteri-haftalik`(2) · `enerji-defteri-su`(2) · `pro-v1`(2) ·
`program-detay`(2).

---

## 2 · KOTALARIN NEREDEN OKUNDUĞU (§7.4 · P6)

🔴 **Fit'te yönetim paneli YOKTUR** (67 HTML'in tamamı public yüzeydir;
`sa-admin*` kalıbı bu depoda aranmış, bulunamamıştır). Dolayısıyla
"panelden okunuyor" seçeneği bugün hiçbir kota için doğru değildir.

| Kota | Tabloda | Makette | Nereden okunuyor | Kanıt |
|---|---|---|---|---|
| **FF1 · 25 temel egzersiz** | 25 | **25** | **kart sayısı olarak markup'a gömülü** — ayrıca metinde iki kez yazılı | `egzersiz-kutuphane-v1.html` 25 kart · `:702`, `:714` |
| **FF9 · 1 aktif hedef** | 1 | **kota değil, tek alan** | Sağlık profilinde "Amacın" **tek değerli bir alandır** (liste değil), bu yüzden sayısal kota diye bir şey yok | `fit-planim-saglik-profil-v1.html` "Amacın · Hareket alışkanlığı kazanmak" |
| **FF10 · Son 7 günlük geçmiş** | 7 gün | **kota YOK** | 7 gün yalnız bir **filtre çipi**dir; yanında `Son 30 gün` ve `30 günden eski` çipleri de açıktır — geçmişe erişim hiçbir yerde kesilmiyor | `fit-planim-gecmis-v1.html:83-85` |
| **FF13/FP1 · reklam** | var/yok | **reklam alanı YOK** | Sitede hiçbir sayfada reklam yuvası yok; `reklam-ver-v1.html` **reklam satış sayfasıdır**, reklam gösteren sayfa değil | `reklam-ver-v1.html:742,816` |
| **Challenge telafi hakkı** | tabloda yok | **2 / ay** | **JS'e gömülü**: `Math.max(0, 2 - (c.telafi \|\| 0))` | `fit-planim-rozetler-v1.html:339` |
| **Hakkımda uzunluğu** | tabloda yok | **160** | HTML `maxlength` | `hesabim-v1.html:533` |
| **Profil fotoğrafı en küçük kenar** | tabloda yok | **200×200** | metne gömülü, doğrulama yok | `hesabim-v1.html:413`, `:488` |

🔴 **P6 ölçümü:** bugün **hiçbir kota ayardan okunmuyor**; hepsi ya markup'a
ya JS'e gömülüdür. Fit'te değiştirilecek bir ayar kaynağı yok — kurulacak.

---

## 3 · §6.1 · DADA FIT — Ücretsiz

| # | Özellik | Bugün | Kanıt |
|---|---|---|---|
| FF1 | 25 temel egzersiz | **VAR** | `egzersiz-kutuphane-v1.html` — 25 hareket kartı sayıldı; metinde de iki kez "25 hareket" yazılı (`:702`, `:714`). Filtre/arama çalışıyor |
| FF2 | Görsel + adım adım hareket anlatımı | **VAR** | `egzersiz-detay-v1.html:131` numaralı adım listesi; adım sayısı **elle yazılmıyor, sayılıyor** (`:418-420`). Hareket verisi `:709+` veri dizisinden geliyor (ör. `:771`, `:850`) |
| FF3 | Kas grubu · ekipman · seviye filtresi | **VAR** | `egzersiz-kutuphane-v1.html:286` (kas) · `:300` (ekipman) · `:328` (seviye). **Ek olarak `:319` süre filtresi de var** — tabloda yok |
| FF4 | Yeni Başlayanlar 4 Haftalık Program | **SADECE ARAYÜZ** | `program-liste-v1.html:372` "Yeni Başlayan 4 Hafta" kartı var; `program-detay-v1.html:1252` "4 hafta × haftada 3 = 12" plan metni var. Program **başlatma** akışı `FIT_PLAN`e yazıyor ama bu program özelinde ücretsiz/ücretli ayrımı çizilmemiş |
| FF5 | Aylık 30 Günlük Hareket Challenge | **VAR** | `challenge-v1.html` — "30 Günde Hareket Alışkanlığı" (`:636`), 30 günlük takvim (`:676`), veri `:1063`. Seri + telafi hakkı gerçekten hesaplanıyor (`fit-planim-rozetler-v1.html:338-339`) |
| FF6 | Temel Enerji Defteri | **VAR** | `enerji-defteri-v1.html:539` "Bugün deftere eklediklerin" · `:635` hareketle açılan alan. Üç alt yüzey ayrı sayfa: `-su`, `-haftalik`, `-dengele` |
| FF7 | Alınan/harcanan enerji görünümü | **VAR** | `enerji-defteri-v1.html:635-636` — "Yaptığın her hareket günlük enerji alanını büyütür"; denge yüzeyi `enerji-defteri-dengele-v1.html` |
| FF8 | TDEE ve günlük enerji hesabı | **VAR** | `enerji-ihtiyaci-v1.html` — **gerçek Mifflin-St Jeor hesabı**: katsayılar `:430-431` (`kiloKat:10, boyKat:6.25, yasKat:5`, sabit `erkek:5 / kadin:-161`), aktivite katsayısı seti `:437-443`, `bmrHesapla()` `:488`, `hesapla()` `:494`. Doğrulama aralıkları da var (`yas:15-100`) |
| FF9 | 1 aktif hedef | **SADECE ARAYÜZ** | `fit-planim-saglik-profil-v1.html` "Amacın" satırı — tek değerli alan, "Değiştir" düğmesi form açmıyor. **Kota mekanizması yok**; bkz. §2 |
| FF10 | Son 7 günlük hareket geçmişi | **SADECE ARAYÜZ** | `fit-planim-gecmis-v1.html:83` "Son 7 gün" **filtre çipi**; yanında `Son 30 gün` (`:84`) ve `30 günden eski` (`:85`) çipleri de açık. Geçmiş **kesilmiyor** — bu bir kota değil, bir süzgeç |
| FF11 | Temel ilerleme takibi ve rozetler | **YARIM** | İlerleme **çalışıyor**: `fit-planim-ilerleme-v1.html:113` haftalık grafik `state.hafta[]`den (`:739-741`), veri `FIT_PLAN`den. Rozet tarafı **statik**: `fit-planim-rozetler-v1.html:113-135` üç rozet kartı markup'a yazılı, `rozetler-v1.html:390` kendi notu "bu ekrandaki sayılar örnek bir hesaba aittir" diyor |
| FF12 | Antrenör profillerini inceleme | **VAR** | `antrenorler-v1.html` — 8 `coach-card`; `antrenor-detay-v1.html` sekiz antrenörün verisi `:1117-1124`; profil `?slug=` ile çözülüyor |
| FF13 | Standart destek + reklamlı kullanım | **YARIM** | Destek **var**: 3 sayfa, 9 konu (`destek-talepleri-v1.html:485-493`), 3 durum. **Reklam YOK**: sitede reklam yuvası bulunmadı; `reklam-ver-v1.html` reklam **satan** sayfadır (`:742` "Reklam alanları", `:816` "Reklam sitede nerede yaşıyor?") — yani ücretsiz kademenin "reklamlı" olması bugün **kurgu düzeyinde bile yok** |
| — | ~~Gastro tarif bağlantıları~~ | **KAPSAM DIŞI (E2)** | — |

---

## 4 · §6.2 · DADA FIT — Pro

| # | Özellik | Bugün | Kanıt |
|---|---|---|---|
| FP1 | Reklamsız kullanım | **YOK** | FF13 ile aynı ölçüm: reklam yuvası hiçbir sayfada yok, dolayısıyla "reklamsızlık" diye ayırt edilebilir bir Pro avantajı da yok. ⚠ Ölçüm sürprizi: `pro-v1.html`de **"Reklamsız" sözcüğü hiç geçmiyor** — ne kademe kartlarında ne karşılaştırma tablosunda. Yalnız iki yerde söz olarak var: `hesabim-v1.html:712` (aktif paket avantajı) ve `profil-v1.html:3528` (Pro kapısı listesi) |
| FP2 | Tüm çok haftalık programlar | **SADECE ARAYÜZ** | `program-liste-v1.html:342-464` — 9 program kartı (8 Haftalık Güç Temeli · Evde HIIT · Yeni Başlayan 4 Hafta · Mobilite & Esneklik · Düşük Tempo Kondisyon · Dik Duruş · Yağ Yakım Devresi · Koşuya Hazırlık 12 Hafta · İleri Güç & Hacim). **Kart düzeyinde Pro/Ücretsiz etiketi yok** — ayrım yalnız `pro-v1.html` karşılaştırma tablosunda söz olarak duruyor |
| FP3 | Güç · HIIT · mobilite · esneklik · postür · ofis | **VAR** | Altısının da karşılığı var: Güç (`program-liste:342,464`) · HIIT (`:357`) · Mobilite & Esneklik (`:387`) · Postür/Dik Duruş (`:418`, `programlar-merkezi:193` "Masa Başı Boyun ve Omuz") · Kondisyon (`:402`). Ofis ekseni ayrıca `hareket-masa-basi-v1.html` |
| FP4 | Orta ve ileri seviye egzersizler | **YARIM** | Seviye **filtre ekseni olarak var** (`egzersiz-kutuphane-v1.html:328`) ve `hareket-yeni-baslayanlar-v1.html` ayrı bir yüzey. Ama katalogda **25 hareketin tamamı ücretsiz** — "ileri seviye" diye ayrılmış, kilitli bir alt küme yok |
| FP5 | Tüm antrenman video serileri | **YARIM** | `video-seanslari-v1.html` — **18 seans** kartı; bunlardan **9'u `vs-free`** işaretli, kalan 9'unda etiket yok. Yani ücretsiz/Pro ayrımı **görsel olarak yarım çizilmiş**. `video-seans-detay-v1.html` detay yüzeyi var. ⚠ `pro-v1.html:295` bu kalemi **"yakında"** etiketiyle basıyor |
| FP6 | Kural tabanlı Antrenman Oluşturucu | **VAR** | `antrenman-olusturucu-v1.html` (99 KB) plan üretiyor ve `FIT_PLAN.kaydet()` ile `localStorage['dm_fit_planlar_v1']`e **gerçekten yazıyor** (`assets/js/fit-plan-kayit.js:1-11`). On sayfa bu modülü okuyor |
| FP7 | Ekipman ve gün sayısına göre program | **VAR** | Plan şemasında alan olarak duruyor: `secimler:{ gunSayisi, seviye, hedef, mekan, ekipman:[], sure, cinsiyet }` (`assets/js/fit-plan-kayit.js:17`) ve oluşturucu bunları soruyor |
| FP8 | Antrenman takvimi ve hatırlatmalar | **VAR** | `assets/js/fit-takvim.js` **gerçek `.ics` üretiyor**, `VALARM` dahil (`:187`). Hatırlatma saati plan başına saklanıyor (`fit-planim-programim-v1.html:1077-1083`), dışa aktarımda "her seans için 30 dakika önce hatırlatma" taşınıyor (`:1108`). ⚠ Push/e-posta hatırlatması **yok** — o yalnız tercih anahtarı olarak var (`hesabim-v1.html:611`) |
| FP9 | Sınırsız hareket ve program geçmişi | **YARIM** | Geçmiş yüzeyi çalışıyor (`fit-planim-gecmis-v1.html`, `FIT_PLAN`den okuyor) ve **hiçbir yerde kesilmiyor** — yani bugün zaten "sınırsız". Ama Ücretsiz/Pro ayrımı **hiç kurulmamış**, ikisi ayırt edilemiyor |
| FP10 | Kilo · ölçü · tekrar · performans takibi | **VAR** | Plan şemasında alan alan duruyor: `ilerleme['g1-h0'] = { yapildi, seviye, tarih, agirlik, tekrarYapilan, efor }` (`assets/js/fit-plan-kayit.js:33-35`). Ölçüm girişi ayrıca `fit-planim-saglik-profil-v1.html` "Ölçümlerin" bölümünde |
| FP11 | Haftalık/aylık ilerleme grafikleri | **VAR** | `fit-planim-ilerleme-v1.html:113` `#fpxHaftaChart` — `state.hafta[]`den çiziliyor (`:739-741`), `role="img"` + `aria-label` ile erişilebilir. Dönem raporu `:156-162`, "Başlangıç ve bugün" `:190` |
| FP12 | Gelişmiş rozetler ve challenge'lar | **SADECE ARAYÜZ** | `rozetler-v1.html` — 42 rozet, 8 aile, 8 basamak **tamamen statik**; sayfanın kendi notu: "Bu ekrandaki sayılar örnek bir hesaba aittir; gerçek kullanıcı verisi değildir" (`:390`). Challenge tarafında seri/telafi **gerçekten hesaplanıyor** ama Pro ayrımı yok |
| FP13 | Sağlık ve aktivite uygulaması entegrasyonu | **SADECE ARAYÜZ** | Ayrıntılı ölçüm §5'te |
| FP14 | Antrenöre gönderilebilir gelişim raporu | **SADECE ARAYÜZ** | `fit-planim-ilerleme-v1.html:175` `#fpxRaporPaylas` — "Antrenörle paylaş" düğmesi var, gerçek bir gönderim yok. Karşı taraf yüzeyi de var: `fit-planim-randevular-v1.html:496` "Antrenörüne gönderdiğin dosyalar aşağıdaki listede görünür" |
| FP15 | Antrenör randevusu · mesajlaşma · öncelikli destek | **YARIM** | Randevu **var** (`fit-planim-randevular-v1.html:124` "Yaklaşan ve geçmiş randevular", rezervasyon formu `antrenor-detay-v1.html:1065-1097`), mesajlaşma **var** (`fit-planim-randevular-v1.html:184`). **Öncelikli destek YOK** — destek sisteminde öncelik/SLA kavramının karşılığı yok |
| — | ~~Diet/Gastro senkronizasyonu~~ | **KAPSAM DIŞI (E2)** | — |

---

## 5 · FP13 DOĞRULAMASI — "Bağlı Uygulamalar" maket kapsamı

**Doğrulandı:** FP13 = envanterdeki **F10 · "Bağlı Uygulamalar"**, dosyası
`bagli-uygulamalar-v1.html` (1087 satır). `#diger` köprü kartlarından biri
oraya gidiyor (`hesabim-v1.html:1190`).

**Ölçüm: DÖRT bağlantı** (`:313`, `:428`, `:531`, `:629`):

| `data-app` | Görünen ad | Varsayılan durum |
|---|---|---|
| `apple-health` | Apple Health | `on` |
| `health-connect` | Android Health Connect | `off` |
| `akilli-saat` | Akıllı saatler | `on` |
| `manuel` | Manuel veri girişi | `on` |

**Sayfanın vaat ettiği veri sözleşmesi — üç yönlü** (`:236-262`):

**(a) DadaFit'e GELEN** — *"Yalnız açtığın izin kadarı okunur":*
adım sayısı ve mesafe · aktif süre ve antrenman oturumları · yaklaşık enerji
kullanımı (cihaz tahmini) · nabız ve uyku (**yalnız sen açarsan**).

**(b) DadaFit'ten GİDEN** — *"Yalnız tek bir şey çıkar ve o da ayrı bir
izne bağlıdır":* DadaFit'te tamamladığın antrenman oturumu (süre, tür,
yaklaşık enerji). Yazma izni **bağlantı başına ayrı** — Apple Health ve
Health Connect için tek tek.

**(c) HİÇBİR KOŞULDA GİTMEYEN** — sağlık ve hareket profili, ağrı/kısıt
bilgisi · antrenör yazışması ve randevu kayıtları · ödeme ve fatura bilgisi ·
Enerji Defteri öğün kayıtları.

**Ek yüzey:** senkron sıklığı ayarı (`:740-746` "Ne sıklıkla güncellensin?"),
bağlantı başına "durum · izin · son senkron" alanları, boş durum ekranı
(`:731`).

**Tıbbi şerh sayfada yazılı** (`:263-268`): *"Adım, nabız ve yaklaşık enerji
değerleri cihazının tahminidir; klinik ölçüm değildir."*

🔴 **Ölçüm sonucu: `SADECE ARAYÜZ`.** Gerçek bir SDK/OAuth bağlantısı, gerçek
bir senkron, gerçek bir izin akışı **yoktur** — anahtarlar durum değiştirir,
veri gelmez. **Backend yazılmadı** (yönerge gereği).

Panel-analizin "dördün en büyük işi" değerlendirmesi ölçümle uyumludur:
dört sağlayıcı × iki yön × izin başına ayrı onay + senkron zamanlaması,
Fit'e özgü ve diğer üç markada karşılığı olmayan bir yüzeydir.

---

## 6 · P5 ÖLÇÜMÜ — antrenör seansı abonelikten ayrı mı?

🔴 **EVET, ayrı — ve maket bunu KENDİ CÜMLESİYLE söylüyor.**

**Kanıt 1 — `hesabim-v1.html:787`:**
> *"Antrenör paketleri DadaFit Pro üyeliğinden ayrı tahsil edilir;
> iptali antrenörünle anlaştığın koşullara bağlıdır."*

**Kanıt 2 — ayrı kartlar.** `#uyelik` çapası **iki** kart taşır:
"Üyelik ve Paketim" (₺99/ay, `:686`) ve **"Antrenör Paketlerim"** (₺1.400/ay,
`:763`). Bir kartın içinde diğerinin bedeli sayılmıyor.

**Kanıt 3 — ayrı tahsilat satırları.** Ödeme geçmişinde iki kalem ayrı
satırdır: `DadaFit Pro — Aylık ₺99,00` (`:812`) ve `Antrenör paketi —
Selin Aksoy ₺1.400,00` (`:818`). Faturalar da ayrı: `DFT-2026-004128`
(Pro) ve `DFT-2026-004095` (antrenör paketi) — `:912`, `:918`.

**Kanıt 4 — hizmet fiyatları antrenör başına değişiyor.**
`antrenor-detay-v1.html`: Birebir Seans `₺450`/seans · Aylık Paket
`₺1.600`/ay (`:1065-1066`); program paketleri `₺2.400` · `₺3.200` ·
`₺4.800` (`:859,872,885`). Sekiz antrenörün seans ücreti `₺380`–`₺520`
arası (`:1117-1124`). Abonelik bedeli **tek** (₺99), hizmet bedeli
**değişken** — P5'in tanımı bu.

**P5'in "indirim veya öncelik" şıkkı da makette var:** `pro-v1.html:315`
Pro Max'in özelliği olarak *"Antrenör görüşmesi avantajları"*, karşılaştırma
tablosunda ayrı satır (`:365`). Ama bu avantajın **ne olduğu tanımlı değil** —
oran, tutar veya öncelik kuralı hiçbir yerde yazılı değil.

→ **P5 Fit'te bugün karşılanmış durumdadır.** Bu turda sökülecek veya
düzeltilecek bir şey ölçülmedi.

---

## 7 · §6.3 · Pro Max AI — "makette AI ile ilgili bir şey var mı?"

🔴 **YOK — ve bu, Fit'te BİLİNÇLİ BİR KARARDIR.**

**Aranan:** `yapay zek` · `AI` · `akıllı öneri` · `makine öğren` · `GPT` ·
`asistan` — 67 HTML ve 6 JS dosyasında. **Dört isabet çıktı, dördü de AI'ın
YOKLUĞUNU anlatıyor:**

| Kanıt | Ne diyor |
|---|---|
| `KARARLAR.md:81` | *"belge §21 eklenmeyecek modülleri sayarken **yapay zekâ sohbet asistanı**'nı açıkça yasaklıyor"* |
| `assets/js/fit-shell.js:1027-1028` | *"DadaMentor kaldırıldı (belge §1 ve §21: yerine başka bir yapay zekâ asistanı da eklenmez)"* — kod **sökülmüş** |
| `destek-talebi-detay-v1.html:83` | *"Bu bir SOHBET BOTU DEĞİL (belge §21: yapay zekâ sohbet asistanı eklenmez)"* |
| `arama-fit-v1.html:1076` | `dp.get('ai')` — **AI değil**, "aktif indeks" demo parametresi. Yanlış eşleşme, kayda geçer |

**Yani:** Fit'te AI kodu, AI kapı anahtarı ve AI ekranı **yoktur**; olmaması
belgeye bağlanmış bir karardır ve bir modül (DadaMentor) bu karar yüzünden
**sökülmüştür**.

---

## 8 · EK BULGULAR — makette VAR, tabloda YOK

§7.2 gereği eklenen satırlar.

| # | Özellik | Bugün | Kanıt |
|---|---|---|---|
| **EK-1** | **Üçüncü kademe zaten kurulu: "Pro Max"** | **SADECE ARAYÜZ** | `pro-v1.html:7` başlık, `:235` `<h1>` "Ücretsiz, Pro ve Pro Max". Üç kart: `.pro-card t0` (₺0, `:266`) · `.pro-card t2 featured` (₺99, "En popüler", `:287`) · `.pro-card t3` (₺199, `:309`). Kabuk JS'i de üç değerli: `ucretsiz`/`pro`/`pro_max` (`fit-shell.js:432-443`). **Bu satır P1'in doğrudan konusudur** |
| **EK-2** | **Paket karşılaştırma tablosu — 18 özellik satırı × 3 sütun** | **VAR** | `pro-v1.html:334` `#karsilastir`, tablo `:342-374`. Üç grup başlığı: "Hareket ve program" (`:347`) · "Ölçüm ve Enerji Defteri" (`:356`) · "Antrenör, ekosistem ve destek" (`:363`). Sonda fiyat satırı (`.cmp-pricerow`, `:371`). Yatay kaydırma + `role="region"` ile erişilebilir |
| **EK-3** | **Fiyat şerhi: "Fiyat onay bekliyor"** | **VAR** | Üç fiyatın da yanında `.price-flag` (`pro-v1.html:269`, `:291`, `:312`) ve karşılaştırma tablosunun fiyat satırında (`:371`). SSS'te de yazılı: *"Bu ekrandaki tutarlar prototip için temsilîdir ve 'Fiyat onay bekliyor' ibaresiyle işaretlenmiştir"* (`:437`). **E5 (fiyatlandırma kapsam dışı) ile uyumlu** |
| **EK-4** | **Promosyon kodu yüzeyi** | **SADECE ARAYÜZ** | `uyelik-faturalandirma-v1.html:946-980` — `#promosyon` bölümü: kod formu (`#ufPromoForm`), durum satırı, sonuç kartı (kod · indirim tutarı · kampanya süresi · ilk uygulanacağı tahsilat). Kaynak tabloda hiçbir markada bu satır yok |
| **EK-5** | **Üyelik dondurma (abonelik dondurma)** | **SADECE ARAYÜZ** | `uyelik-faturalandirma-v1.html:1009-1035` — `.uf-frozen` durumu + `.uf-freeze` kurulumu. **Hesap dondurmadan AYRI bir kavram**: hesabı değil aboneliği dondurur. `hesabim-v1.html:1265` bunu doğruluyor: *"DadaFit Pro üyeliği otomatik durmaz"* |

---

## 9 · 🔴 K6 ↔ P1 GERİLİMİ — ölçüm

**Çözülmedi. Ölçüldü ve bildiriliyor.**

### 9.1 · İki kararın metni

- **K6:** *"Fit'te abonelik YOKTUR; maketteki abonelik blokları sökülür ve
  yerine antrenör hizmet paketi gelir."*
- **P1:** *"Üç paket, dört markada aynı isim: Ücretsiz · Pro · Pro Max AI.
  Marka adı önek."* → "Dada Fit Pro"

### 9.2 · Makette ölçülen: üç ayrı para ilişkisi, tek kutu değil

| # | İlişki | Kim kime öder | Bedel | Yüzey |
|---|---|---|---|---|
| **(1)** | **Platform aboneliği** | üye → DadaFit | ₺99 / ₺199 ay | `pro-v1.html` · `pro-odeme-v1.html` · `uyelik-faturalandirma-v1.html` · `hesabim-v1.html#uyelik` kart A |
| **(2)** | **Antrenör hizmeti** | üye → antrenör | ₺380–₺520/seans · ₺1.400–₺1.600/ay · paket ₺2.400–₺4.800 | `antrenor-detay-v1.html` · `hesabim-v1.html#uyelik` kart B · `fit-planim-randevular-v1.html` |
| **(3)** | **Üyeden üyeye abonelik** | üye → üye (üretici) | ₺49 / ay | `profil-v1.html` "Üyelik" sekmesi |

**K4 Fit'e (2)'yi veriyor.** (1) ve (3) K4'te Fit'e verilmemiş.
**K6 "abonelik yok" derken hangisini kastediyor, ölçüm ayırt edemez.**

### 9.3 · Gerilimin dört başlığı

**G-1 · P1'in üç paketi Fit'te ZATEN KURULU.**
Fit'in üç kademesinin adı `Ücretsiz` · `Pro` · `Pro Max`. P1'in istediği
üçlü ile fark **tek kelime**: üçüncünün sonundaki `AI`. Yani P1, K6'nın
söktürmek istediği yapıyı **neredeyse birebir geri istiyor**.

**G-2 · Fit'in "Pro Max"i AI paketi değil.**
İçeriği (`pro-v1.html:313-320`): antrenör görüşmesi avantajları · kişisel
program değerlendirmesi · öncelikli destek · Dada Diet entegrasyonu ·
Dada Gastro tarif önerileri. **AI yok.** Dahası son ikisi **E2 kapsamındadır**
(çapraz marka) — yani altı özellikten ikisi bu turda listeden düşer, geriye
üç kalem kalır.

**G-3 · Fit'te AI YASAKLI.**
§7'de ölçüldü: belge §21 yapay zekâ asistanını **açıkça yasaklıyor**,
`DadaMentor` bu yüzden **sökülmüş** (`fit-shell.js:1027-1028`). "Pro Max AI"
adının Fit'te hem içerik hem karar düzeyinde karşılığı yok.

**G-4 · P3'ün "yakında" istisnası Fit'te ZATEN AŞILMIŞ.**
P3, "yakında"yı **yalnız Pro Max AI vitrini** için serbest bırakıyor. Ama
`pro-v1.html` bugün **Pro kartında üç kez** "yakında" basıyor:
- `:295` Video Seansları `<span class="soon">yakında</span>`
- `:296` Fit Testleri `<span class="soon">yakında</span>`
- `:301` Aktivite ve cihaz bağlantıları `<span class="soon">yakında</span>`

Yani Fit'te "yakında" bugün **Pro Max vitrininde değil, Pro vitrininde**
kullanılıyor. P3'ün istisna kapsamı ile makette ölçülen kullanım **örtüşmüyor**.

### 9.4 · Sökümün yüzeyi — K6 uygulanırsa ne kadar iş?

Ölçülen abonelik yüzeyi:

| Yüzey | Ne | Büyüklük |
|---|---|---|
| **Tam sayfa** | `uyelik-faturalandirma-v1.html` | 1885 satır · 6 çapa · 6 form-card |
| **Tam sayfa** | `pro-v1.html` | 583 satır · 6 bölüm |
| **Tam sayfa** | `pro-odeme-v1.html` | 596 satır · kart formu + dönem + başarı ekranı |
| **Çapa** | `hesabim-v1.html#uyelik` kart A | `:686-761` |
| **Çapa** | `hesabim-v1.html#odeme` | `:794-880` |
| **Çapa** | `hesabim-v1.html#fatura` + `#ftModal` | `:882-944` + `:1363-1435` |
| **Bildirim satırı** | "Kampanya ve DadaFit Pro fırsatları" | `hesabim-v1.html:642` |
| **Kabuk** | `uyelikKalemi()` + `#proGate` | `fit-shell.js:431-443`, `:925-943` |
| **Kapı** | `data-pro-gate` tetikleyicileri | **26 adet · 11 dosya** |
| **Profil** | üyeden-üyeye abonelik sekmesi | `profil-v1.html:2260+` |

🔴 **K6'nın "abonelik blokları sökülür" hükmü, ölçülen hâliyle 3 tam sayfa,
3 hesap çapası, 26 kapı tetikleyicisi ve bir profil sekmesi demektir.**
P1 aynı yapının üçünü de geri istiyor.

🔴 **KARAR BEYAR'INDIR. Bu belge yalnız ölçer.**

---

*Ölçüm sonu. `Bugün` sütununda tahmin yoktur; ölçülemeyen satır yoktur.*
