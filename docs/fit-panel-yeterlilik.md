# DadaFit Yönetim Paneli — YETERLİLİK ÖLÇÜMÜ

> **Soru (Beyar):** *"Bu admin panelle full-stack'e geçsek, panel public sitenin
> tamamını yönetmeye yeter mi?"*
> **Ölçüm tarihi:** 2026-08-30 · **Yöntem:** tarayıcıda Playwright + kaynak
> okuma (grep tek başına kanıt sayılmadı, her satır ekranda ya da kodda
> doğrulandı). Sunucu `http://127.0.0.1:8788/`.
> **Eksen:** var olan bir ekranın o içeriği gerçekten **doğurup·değiştirip·
> öldürüp·sıralayıp·yayından kaldırabildiği** mi; SEO · taksonomi · sabit
> metin · ayar/limit yönetimi var mı. Bir ekranın **var olması** komşu ajanın
> (A11-senk) sorusu; o ekranın **yetmesi** bu belgenin sorusu.

## ⚠ Ölçüm anı — sabit değil

Bu tur admin dosyalarını **A7 · A8 · lead eşzamanlı** düzenliyor. Ölçüm
sırasında dosya sayısı bir oturumda **52 → 55**'e çıktı (üç yeni dosya
ölçüm başladıktan sonra doğdu). Aşağıdaki iki bulgu **çift ölçüldü** ve iki
seferinde de aynı çıktı; yine de bir ekran altında değişmiş olabilir:

- `admin-destek-v1.html` **şu an kırık**: `TEMSILCI is not defined`
  (satır 273, `TEMSILCI.map(...)` — dizi hiçbir yerde tanımlı değil).
  Tarayıcıda ölçüldü: kuyruk kartları **render olmuyor**, sekme sayaçları
  `Yanıt bekleyen —`, `Çözülen —`, `Kapatılan —` gösteriyor (ekran görüntüsü
  alındı). Bu, "Destek Talepleri" ekranını bu an için **fiilen kullanılamaz**
  kılıyor — düzeltmesi tek satır (`TEMSILCI` dizisini tanımlamak) ama ölçüm
  anında böyle durdu.
- `admin-antrenorler-v1.html`: konsolda `Cannot set properties of null
  (setting 'innerHTML')` — `admin-denetim.mjs` kapısında da aynı hata
  bağımsız ölçüldü. Kaynak hedefi (`#atKaynak`) DOM'da var; hata başka bir
  `getElementById` çağrısında (id eşzamanlı düzenlemeyle kaymış olabilir).

Bu iki ekran aşağıdaki tablolarda **"kısmi"** işaretlendi ve gerekçesi konsol
hatasına bağlandı; kalıcıysa bir sonraki turda "hiç" düzeyine düşer.

---

## Baz rakamlar — bu turda yeniden ölçüldü (eskiler bayattı)

| Ölçü | Eski (R19) | **Şimdi (R20)** | Kaynak |
|---|---|---|---|
| Public sayfa sayısı | 60 (iddia) | **54** | `ls *.html` (admin-* hariç) = `admin-sayfalar-v1.html`in kendi satır sayısıyla (54) birebir örtüşüyor |
| Meta description eksik | 43/60 | **38/54** (kodun kendi ölçümü) · bağımsız grep **37/54** | `admin-sayfalar-v1.html:130` kendi ölçümünü basıyor; grep farkı (37↔38) muhtemelen bir sayfanın boş `content=""` taşımasından — ekran rakamı esas alındı |
| Canonical | 0/60 | **0/54** | doğrulandı, iki yoldan (grep + `admin-sayfalar-v1.html:130`) aynı sayı |
| Admin ekranı (üst-menü, "liste" düzeyi) | 21 (plan §3) | **33** | `docs/qa/admin-ekleme-kapisi.mjs` çıktısı — plan §3 R17'de yazıldı, K6 dönüşü + R19 kalemleri (anatomi·rehber·sözlük·sss·yasal·planlar·abonelikler·faturalar·kuponlar) tabloyu güncellemeden eklendi |
| Form sayfası | — | **20** | `docs/qa/admin-form-kalibi.mjs` |
| Toplam admin dosyası | — | **52 → 55** (ölçüm sırasında büyüdü) | `ls admin-*.html` |

---

## Bölüm 1 · Tam yönetilenler

| Public karşılığı | Admin karşılığı | Oluştur | Düzenle | Sil | Sırala | Yayın durumu | SEO | Taksonomi | Sabit metin | Ayar/limit | Not |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Hareket kütüphanesi (`egzersiz-kutuphane-v1`, `egzersiz-detay-v1`, 25 hareket) | `admin-hareketler-v1` + `admin-hareket-form-v1` | ✅ | ✅ | ✅ (formun içinde, `data-yikici`) | — | ✅ | ✅ | ✅ (bkz. Taksonomi ekranı) | — | — | Liste 25/25 gerçek satır (`admin-icerik-olcum.mjs`); silme satırda değil formda |
| Program kataloğu (`programlar-merkezi`, `program-liste`, `program-detay`) | `admin-programlar-v1` + `admin-program-form-v1` + `admin-program-kurgu-v1` | ✅ | ✅ | ✅ | ✅ (`program-kurgu` hafta/gün/hareket sürükle + ok-tuşu) | ✅ | ✅ | — | — | — | 9/9 gerçek satır |
| Challenge kataloğu (`challenge-merkezi`, `challenge-v1`) | `admin-challenge-v1` + `admin-challenge-form-v1` | ✅ | ✅ | ✅ | — | ✅ | ✅ | — (tip alanı formda) | — | — | 3/3 gerçek satır; tip seçimi hedef alanlarını değiştiriyor (plan §7.4) |
| Fit Testleri (`fit-testleri-v1`, `fit-testi-detay-v1`) | `admin-testler-v1` + `admin-test-form-v1` | ✅ | ✅ | ✅ | — | ✅ | ✅ | — | — | — | 7/7 gerçek satır; en büyük form (34 alan/11 bölüm) |
| Taksonomi (kas bölgesi·ekipman·seviye·hedef·+1) | `admin-taksonomi-v1` | ✅ (modal) | ✅ | ✅ | ❌ (bilerek — dosyanın kendi notu §2.4) | — | — | (bu ekranın kendisi) | — | — | Gastro'nun iki kolonlu kalıbı; drag-drop bilinçli dışarıda bırakıldı |
| Statik sayfalar + SEO (tüm 54 public sayfa) | `admin-sayfalar-v1` + `admin-sayfa-form-v1` | ✅ | ✅ | ✅ | — | ✅ (`durum/taslak/yayin`) | ✅ (başlık·açıklama·robots·canonical·og·odak sözcük) | — | — | — | 54/54 satır; canonical alanı gerçek — bugün 0 sayfada dolu ama alan hazır ve dürüst not var |
| Hareket rehberi (8 sayfa: hub + 7 makale) | `admin-rehber-v1` + `admin-rehber-form-v1` | ✅ | ✅ | ✅ | ✅ (`FIT_ADMIN.sirala`) | ✅ | ✅ | — | — | — | 8 slug'ın 8'i de eşleşiyor (`hareket-rehberi` hub dâhil) |
| Genel sözlük (`sozluk-v1`, `sozluk-detay-v1`, 254 terim) | `admin-sozluk-v1` + `admin-sozluk-form-v1` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | (kategori alanı formda) | — | — | Dosyanın kendi notu: "BUGÜNE KADAR hiçbir admin ekranı" yokmuş, bu turda doğdu |
| S.S.S. (`destek-v1`in akordiyonu, 24 kayıt) | `admin-sss-v1` + iki form (`sss-form`, `sss-konu-form`) | ✅ | ✅ | ✅ | ✅ (ok tuşu) | ✅ (`gorunur`) | — | (kategori) | — | — | "VERİ GERÇEK" notu: 24 kayıt `destek-v1.html`in akordiyonundan alındı |
| Yasal metinler (`yasal-v1`) | `admin-yasal-v1` + `admin-yasal-form-v1` | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | — | |
| Bildirim şablonları (`bildirimler-v1` tetikleyicileri) | `admin-bildirim-v1` + `admin-bildirim-form-v1` | ✅ | ✅ | ✅ | — | ✅ (`aktif/durum`) | — | (kanal: e-posta/uygulama) | ✅ (şablon metni) | — | 4 sayaç da `SABLONLAR` dizisinden gerçekten sayılıyor |
| Sponsorluk ve Reklam (`reklam-ver-v1`) | `admin-reklam-v1` + 2 form (alan/kampanya) | ✅ (2 hedef) | ✅ | ✅ | — | ✅ | — | — | — | — | Üç sekme (alan·kampanya·kreatif) plan kararınca tek ekranda |
| Menü ve Navigasyon (kabuğun 10 dizisi: NAV·BOTTOM·ACCOUNT·FOOTER_*·PLAN_*·DESTEK_TABS·RAIL) | `admin-menu-v1` | ✅ (modal) | ✅ | ✅ | ✅ (sürükle + ok tuşu, kendi `node-grip` sürücüsü) | ✅ (`gor` = herkes/üye) | — | — | ✅ (kalem adları) | — | 10 ailenin 10'u da `FIT_SHELL.menu()`'den okunuyor (D9); ikinci kopya yok |
| Paketler ve Özellikler (`pro-v1`, `paketlerim-v1`, `fit-paket.js`) | `admin-paketler-v1` | ✅ (modal) | ✅ | ✅ | — | ✅ | — | (kademe/grup/modül) | ✅ | ✅ | En büyük yüzey: 225 alan, 7 bölüm, 12 modal — D8 kararınca Gastro'nun üstüne inşa edilmiş (kademe/grup/modül CRUD) |
| Hizmetler ve Satışlar (antrenör paket satışı, K6) | `admin-hizmetler-v1` | ✅ (onay/red) | ✅ | — | — | — | — | — | — | ✅ (iade politikası metni) | K6'nın açık kalemini (ödeme yok, iade yok) kapatan tam ekran: "İade talepleri" sekmesi + Onayla/Ek belge iste/Reddet üçlüsü |
| Kazançlar ve Ödemeler (K13 komisyon akışı) | `admin-odemeler-v1` | — | — | — | — | — | — | — | — | **kısmi** (aşağı bak) | Akış doğru ama K13 sabiti kendi kopyasında — bkz. Bölüm 2 |
| Kuponlar (K6 dönüşü) | `admin-kuponlar-v1` + `admin-kupon-form-v1` | ✅ | ✅ | ✅ | — | ✅ (`aktif/durum`) | — | — | — | ✅ (indirim tipi/limiti) | |
| Planlar (Pro/Pro Max) | `admin-planlar-v1` + `admin-plan-form-v1` | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | ✅ (kapsam metni) | ✅ (fiyat) | |
| Abonelikler (üye planları) | `admin-abonelikler-v1` | — | — | — | — | ✅ (durum) | — | — | — | — | Liste + durum yönetimi var; tekil aboneliğin **düzenleme/iptal yüzeyi yok** → Bölüm 2 |
| Faturalar (K13 fatura eşiği) | `admin-faturalar-v1` | — | — | — | — | — | — | — | — | — | Liste var; tekil faturanın işlem yüzeyi yok → Bölüm 2 |
| Log Yönetimi | `admin-log-v1` | — | — | — | — | — | — | — | — | — | Yapısal olarak "tam" sayılamaz — dosyanın kendi notu: gerçek bir işlem-kaydı modülü **yok**, hedefler gerçek ama kayıtlar örnek. Bu, panelin kendi eylemlerini henüz üretmemesinden kaynaklanıyor (backend gelince dolar), ekran tasarımı eksiksiz |

---

## Bölüm 2 · Kısmen yönetilenler — neyi eksik

| Public karşılığı | Admin karşılığı | Oluştur | Düzenle | Sil | Sırala | Yayın | SEO | Taksonomi | Sabit metin | Ayar/limit | Eksik olan (tek cümle) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Anatomi haritası (`anatomi-v1.html`, `anatomi-veri.js`) | `admin-anatomi-v1` + `admin-anatomi-form-v1` | ✅ | ✅ | ✅ | — | ✅ (`durum`) | ❌ | — | — | — | `admin-form-kalibi.mjs` ölçtü: anatomi-form'da SEO sekmesi **yok** (diğer 8 içerik formunun 8'inde var) — public sayfası gerçek olduğu için başlık/açıklama alanı da olmalı |
| Antrenörler (`antrenorler-v1`, `antrenor-detay-v1`, `antrenor-ol-v1`) | `admin-antrenorler-v1` + `admin-antrenor-form-v1` | ✅ | ✅ | ✅ | — | ✅ | ✅ | — | — | — | (1) **Ölçüm anında konsol hatası** (`innerHTML` null) — kuyruk render'ı şüpheli, iki kez ölçüldü. (2) Dosyanın kendi itirafı (satır 200-206): onaylı antrenör dizini `antrenor-detay-v1.html`in VERİ haritasından **ikinci bir kopya**; ortak `fit-antrenor.js` yok — panelde bir antrenörü düzenlemek public'teki gerçek kaydı değiştirmiyor |
| Destek Talepleri (`destek-v1`, `destek-talebi-detay-v1`, `dm_fit_destek_v1`) | `admin-destek-v1` + `admin-destek-talep-v1` | — (kuyruk, oluşturma üyeden gelir) | ✅ (durum/yanıt, talep detayında) | — | — | — | — | — | — | ✅ (SSS yönlendirmesi) | **Ekran şu an kırık** — `TEMSILCI is not defined`, kuyruk kartları hiç render olmuyor (ekran görüntüsü alındı, satır 273). Atama özelliği (`Atama` seçimi) bu yüzden kullanılamıyor. `dm_fit_destek_v1`i okuyan kod var (satır 1538) — bağın kendisi doğru kurulmuş, çalışma anı bozuk |
| Moderasyon (yorum/içerik bildirimi) | `admin-moderasyon-v1` | — | ✅ (onayla/gizle/sil/uyar) | ✅ | — | — | — | (tür: challenge·program·egzersiz·antrenör·mesaj) | — | — | **"Yorum" türü tanımlı değil.** `profil-v1.html`deki danışan yorumları (212 + 120 adet, K16'da gerçek sayaca bağlandı) `tur` sözlüğünde yok — 5 tür var, yorum/değerlendirme altıncı tür olarak eksik; bir kullanıcı yorumu şikâyet ederse bu kuyrukta görünmeyecek bir tür |
| Üye detayı (`hesabim-v1`, `profil-v1`, `dm_fit_hesap_v1`/`dm_fit_izin_v1`/`dm_fit_faydali_v1`/`dm_fit_test_v1`) | `admin-uye-detay-v1` | — | — (bkz. not) | ✅ (rol/durum) | — | — | — | — | — | — | Ekranın kendi künyesi dürüst: `dm_user`de olmayan alanlar (üyelik tarihi, paket, son giriş) bilerek **"—"** kalıyor. Ama bölüm başlıkları var olduğu hâlde (Abonelik ve ödeme · Destek geçmişi · Yetki ve güvenlik) **hiçbiri yeni doğan yedi `dm_fit_*` anahtarını okumuyor** — bu bir tasarım kusuru değil, tek-tarayıcı prototipin yapısal sınırı (admin başka kullanıcının localStorage'ını göremez); backend geldiğinde bu bölümlerin arkasına gerçek üye tablosu gerekecek |
| Kazançlar ve Ödemeler (K13) | `admin-odemeler-v1` | — | — | — | — | — | — | — | — | **kısmi** | Akış (komisyon hesabı, ay sonu ödeme, alt sınır, iade→komisyon geri gitmez) doğru kurulu — ama `PARAM.komisyonOran=10` (satır 367), `altSinirKurus=100000` (satır 369) **kendi kopyası**, `admin-ayarlar-v1.html`in K13 alanlarından (`komisyon`, `altSinir`) **okumuyor**. `admin-ayarlar-v1.html`in kendisi de hiçbir `localStorage` yazmıyor (0 `setItem`) — yani Ayarlar'a girilen sayı bugün **hiçbir ekrana ulaşmıyor** |
| Ayarlar (K13 + sağlık sabitleri) | `admin-ayarlar-v1` | — | ✅ (form var, doğrulanıyor) | — | — | — | — | — | ✅ (sağlık uyarı metinleri, kaldırılamaz) | **kısmi** | (1) `Aktivite katsayıları` (kcal/dk, adım/dk) tamamen **"—"** — `KCAL_DK` sabiti `egzersizlerim-v1.html:3008`de sayfa betiğinin içinde, paylaşılan modülde değil; panel okuyamıyor (ekranın kendi notu doğru). (2) `Su hesabı sabitleri`nin 4'te 3'ü gerçek okunuyor, 4.'sü (`EK_ADIM_ML`, yuvarlama adımı) `fit-su.js`de **VAR ama dışa verilmiyor** — ekran bunu "—" ile dürüstçe gösteriyor ama düzeltilebilir (tek satır export). (3) Kaydet düğmesi hiçbir yere yazmıyor (yukarıya bak) |
| Raporlar | `admin-raporlar-v1` | — | — | — | — | — | — | — | — | — | Kendi `KOMISYON_ORAN=10` sabiti var (satır 162, yorumda "Ayarlar → Para parametreleri" yazıyor ama okumuyor) — Ayarlar'daki ile **üçüncü bağımsız kopya** (Ödemeler ikincisiydi) |
| Abonelikler | `admin-abonelikler-v1` + `admin-abonelik-detay-v1` | — | — | — | — | ✅ | — | — | — | — | `admin-form-kalibi.mjs` kusur olarak işaretledi: detay ekranının **"Yeni …" düğmesi yok, muafiyet gerekçesi de yok, düzenlenebilir alan da form çıkışı da yok** — tek abonelik kaydını değiştirecek/iptal edecek yüzey yok, yalnız görüntüleniyor |
| Faturalar | `admin-faturalar-v1` + `admin-fatura-detay-v1` | — | — | — | — | — | — | — | — | — | Aynı kusur: `admin-fatura-detay-v1.html`in de ne düzenleme alanı ne form çıkışı var (`admin-ekleme-kapisi.mjs` iki ekranı da "kusurlu" işaretledi) |

---

## Bölüm 3 · Hiç yönetilmeyenler

| Public karşılığı | Neden yönetilmiyor | Hangi ekran gerekiyor |
|---|---|---|
| Kullanıcı yorumları/değerlendirmeleri (`profil-v1.html` "Yorumlar" 212 + "Danışan Yorumları" 120, K16 ile gerçek "Faydalı" sayacına bağlandı) | Moderasyon kuyruğunun `tur` sözlüğünde bu tür **hiç yok**; silme/gizleme yüzeyi de yok | `admin-moderasyon-v1`e altıncı tür (`yorum`) eklenmeli — motor zaten var, yalnız sözlüğe bir satır eksik |
| Aktivite katsayıları (`KCAL_DK`, `egzersizlerim-v1.html:3008`) | Paylaşılan bir veri modülünde değil, sayfa betiğinin içinde gömülü; Ayarlar'ın kendi notu bunu doğruluyor | Yeni bir veri modülü: `assets/js/fit-aktivite-veri.js` (taksonomi/rozet modüllerinin izlediği kalıp) — doğduğunda Ayarlar'daki "—" otomatik dolar |
| K13 para parametrelerinin **tek kaynağı** (komisyon %, alt sınır, ödeme günü, fatura eşiği) | Üç ayrı ekran (`admin-ayarlar-v1`, `admin-odemeler-v1`, `admin-raporlar-v1`) üç ayrı sabit taşıyor; hiçbiri diğerini okumuyor, hiçbiri `localStorage`a yazmıyor | Ortak salt-okuma ucu (kabuğun `FIT_SHELL.menu()` ile aynı desende: `FIT_ADMIN.paraParam()` gibi tek bir kaynak) — bugün maket olduğu için üç kopya sessizce yaşıyor, backend geldiğinde üçü ayrı ayrı yazılmazsa biri yalan söyler |
| İçerik üreticiliği eşikleri (K12) | Fit'te bu üyelik basamağının **arkasında hiçbir veri yok** (plan §10 madde 3'ün doğrulanmış hâli); Ayarlar'daki dört alan (`esik_program`, `esik_ipucu`, `esik_takip`, `esik_takipci`) bilerek boş bırakılmış ve şerh dürüst | Bu bir eksik ekran değil, bir **açık ürün kararı** — K12'nin Fit karşılığı (hangi eylem "üretici" sayılır) önce Beyar tarafından karara bağlanmalı, panel o zaman dolar |
| `admin-medya-v1.html` (medya kütüphanesi) | **Silindi** — Beyar kararı, Gastro'da karşılığı yok | Yok; bu bir kayıp değil bilinçli kapsam daralması. Medya artık yalnız form-içi bileşen (`FIT_ADMIN.medya()`), o hâliyle her formda erişilebilir |
| Aylık/haftalık genel istatistikler (ziyaretçi, dönüşüm, trafik kaynağı) | Statik prototipte gerçek trafik verisi yok; `admin-raporlar-v1` KPI'ları depo içi verilerden (kayıtlı içerik sayısı vb.) türetiliyor, gerçek ziyaretçi metriği yok | Bu, backend'in kendisiyle gelir (analytics entegrasyonu) — Ayarlar'daki `ga`/`pixel` alanları (Google Analytics, Meta Pixel) zaten bu boşluğu bekliyor, ekran tasarımı eksik değil |

---

## Koda gömülü sabit/limit — tarandı

| Sabit | Nerede | Panelden okunuyor mu | Not |
|---|---|---|---|
| `EK_ADIM_ML=50` (su yuvarlama adımı) | `assets/js/fit-su.js:69` | ❌ | Modülde var, dışa verilmiyor; Ayarlar bunu biliyor ve "—" yazıyor (dürüst, düzeltmesi tek satır export) |
| `EK_TAVAN_ML=1500`, `DK_BASINA_ML`, `KCAL_BASINA_ML` | `assets/js/fit-su.js` | ✅ | `FIT_SU` nesnesinden dışa veriliyor, Ayarlar gerçekten okuyor |
| `KCAL_DK={yuruyus:4.2,kosu:10.5,bisiklet:7.4,antrenman:6.6}` | `egzersizlerim-v1.html:3008` | ❌ | Sayfa betiğinin içinde, paylaşılan modül yok |
| `komisyonOran:10` | `admin-odemeler-v1.html:367` | ❌ (kendi kopyası) | Yorum "Ayarlar → Para parametreleri" diyor ama okumuyor |
| `KOMISYON_ORAN=10` | `admin-raporlar-v1.html:162` | ❌ (üçüncü kopya) | Aynı sabitin bağımsız üçüncü tekrarı |
| `altSinirKurus:100000` (1000 TL) | `admin-odemeler-v1.html:369` | ❌ | K13'ün alt sınır alanı, Ayarlar'la bağlı değil |
| Ayarlar'ın kendi K13 alanları (`komisyon`,`altSinir`,`odemeGunu`,`fatura`,`iade`,`abonelik_komisyon`,`duraklatma_ay`) | `admin-ayarlar-v1.html` | — | Form var, doğrulanıyor, ama `localStorage.setItem` **0 kez** çağrılıyor — girilen değer sayfa yenilenince kaybolur, kimseye ulaşmaz |
| K12 üretici eşikleri (`esik_program` vb.) | `admin-ayarlar-v1.html:713-734` | — | Bilerek boş — bkz. Bölüm 3 |

---

## Özet

- **Ölçülen modül:** 29 (admin'in üst-menü/sidebar düzeyindeki tüm kalemleri) + 6 bağımsız detay/form eki (abonelik-detay, fatura-detay dâhil) = pratikte **panelin tamamı**.
- **Tam:** 20 modül.
- **Kısmi:** 9 modül (anatomi·antrenörler·destek·moderasyon·üye detayı·ödemeler·ayarlar·raporlar·abonelikler+faturalar).
- **Hiç:** kavramsal olarak 3 gerçek boşluk (yorum moderasyonu türü, K13 tek-kaynak sorunu, aktivite katsayıları modülü) + 2 bilinçli kapsam dışı (medya, gerçek analytics) — bunlar ayrı "ekran" değil, ya bir sözlük satırı ya bir veri modülü eksikliği.
- **Koda gömülü, panelden okunamayan sabit:** **5** (`EK_ADIM_ML`, `KCAL_DK`, ve K13 komisyon/alt sınırının **üç** bağımsız kopyası — bu üçü tek sorunun üç görünümü).
- **En ağır beş boşluk (gereken ekranla birlikte):**
  1. **Destek Talepleri şu an render olmuyor** (`TEMSILCI is not defined`) — düzeltme: `TEMSILCI` dizisini tanımlamak (tek satır, mevcut ekranın içinde).
  2. **K13 para parametreleri üç bağımsız kopyada yaşıyor**, Ayarlar hiçbir yere yazmıyor — düzeltme: tek okuma ucu (`FIT_ADMIN.paraParam()` benzeri) + Ayarlar'ın gerçekten `localStorage`a yazması.
  3. **Kullanıcı yorumları moderasyon kuyruğunda yok** — düzeltme: `admin-moderasyon-v1`in `tur` sözlüğüne `yorum` eklemek.
  4. **Abonelik ve fatura detay ekranlarının yazma/düzenleme yüzeyi yok** — düzeltme: ikisine de en az durum değiştirme + not ekleme formu.
  5. **Antrenör dizini ikinci bir kopya + ölçüm anında konsol hatası** — düzeltme: ortak `fit-antrenor.js` modülü (plan zaten bunu borç olarak işaretlemiş) + `#atKaynak` dışındaki kırık `getElementById` çağrısının onarımı.

Ölçülemeyen tek şey: yazma yüzeylerinin **gerçek** bir sunucuya gittiğinde
davranışı — bu turun kapsamı dışında, panel geneli zaten "maket" olduğunu
tek dürüst şeritle söylüyor (`docs/qa/admin-yazma-kapisi.mjs`: 54 ekran, 0 kusur).
