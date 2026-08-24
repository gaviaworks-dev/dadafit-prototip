# REVİZYON-12 — GÖZDEN GEÇİRME LİSTESİ

**Yerel sunucu:** http://127.0.0.1:8788 · ayakta bırakıldı
(düşerse: `cd /Users/gaviaworks/Developer/Projects/dadafit-prototip && python3 -m http.server 8788 --bind 127.0.0.1 &`)

**Durum:** 24 madde kapandı (R1–R13 · R15–R25) · 1 açık (R14) · 8 madde toplandı, plan bekliyor (R26–R33)
**Yayın:** https://gaviaworks-dev.github.io/dadafit-prototip (aynı içerik canlıda da var)

---

## Kapanan maddeler

| # | Ne değişti | Nereye bakılacak |
|---|---|---|
| **R1** | Beyaz gövde ile gri bölüm arasındaki gölge bandı kalktı; geçiş tek adımda. | [hareket-yeni-baslayanlar-v1.html](http://127.0.0.1:8788/hareket-yeni-baslayanlar-v1.html) — giriş metninin bittiği, "BAŞLARKEN" bölümünün başladığı sınır |
| **R2** | Alıntı ile "terim sayfası" bağlantısı arası 32px'ten 16px'e indi. | [sozluk-v1.html](http://127.0.0.1:8788/sozluk-v1.html) — "Adım uzunluğu" terimine tıklayıp akordeonu **aç**, alıntının altına bak |
| **R3** | Kontrol paneli altındaki gölge gitti, gri gövde beyaza döndü; kart kenarı hairline ile okunuyor. | [sozluk-v1.html](http://127.0.0.1:8788/sozluk-v1.html) — harf rayı/kategori çiplerinin hemen altı |
| **R4** | "Program durumun" ayrı gri bant olmaktan çıktı, yuvarlak köşeli beyaz panelin içine girdi. | [program-detay-v1.html?slug=8-hafta-mobilite](http://127.0.0.1:8788/program-detay-v1.html?slug=8-hafta-mobilite) — hero'nun hemen altı |
| **R5** | Kart içi çip rayı, açıklama 3 ya da 4 satır olsun fark etmeksizin aynı hizada başlıyor. | [fit-testleri-v1.html](http://127.0.0.1:8788/fit-testleri-v1.html) — ilk satırdaki üç kartın "~10 dk · Mat + sandalye" şeritleri |
| **R6** | Sağ panel (Test künyesi + CTA) sol kolonun dibinden çıkıp sağ sütuna oturdu. | [fit-testi-detay-v1.html?test=baslangic-seviyesi](http://127.0.0.1:8788/fit-testi-detay-v1.html?test=baslangic-seviyesi) — sayfanın sağ tarafı |
| **R7** | Koyu yeşil kutudaki açıklama tek akan paragraf oldu; "Evet" ve "Her soruyu bir kez yanıtlarsın" satır kırmıyor. | [fit-testi-detay-v1.html?test=baslangic-seviyesi](http://127.0.0.1:8788/fit-testi-detay-v1.html?test=baslangic-seviyesi) — tarama kutusunun içi |
| **R8** | 1. sorunun üstündeki nefes 6px'ten 22px'e çıktı, soru kutuya yapışmıyor. | [fit-testi-detay-v1.html?test=denge](http://127.0.0.1:8788/fit-testi-detay-v1.html?test=denge) — yeşil kutunun bittiği, "1 · Bir hekim sana…" sorusunun başladığı yer |
| **R9** | Sonuç kartı ile "Test künyesi" arasındaki 0px yapışıklık gitti (künye sağ sütuna geçti). | [fit-testi-detay-v1.html?test=denge](http://127.0.0.1:8788/fit-testi-detay-v1.html?test=denge) — "Sonuç girişi kapalı" kartının altı |
| **R10** | "Antrenör değil program mı arıyorsun?" şeridinin üstündeki 0px boşluk 46px oldu, iki komşusu arasında dengeli. | [antrenorler-v1.html](http://127.0.0.1:8788/antrenorler-v1.html) — sayfalamanın altı, koyu "Antrenör müsün?" bloğunun üstü |
| **R11** | Hesap menüsüne "Aboneliğim ve Ödemelerim" eklendi (11 → 12 kalem), "Hesap ve Ayarlar"ın üstünde. | [hesabim-v1.html](http://127.0.0.1:8788/hesabim-v1.html) — sağ üstteki avatara tıklayıp menüyü **aç** |
| **R12** | İki katmanlı sekme tek raya indi; kaldırılan kalemler CTA şeridine taşındı, sondaki gri bölüm aynı zemine alındı. | [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) — profil başlığının altındaki sekme bölgesi |
| **R13** | Düz koyu banner gitti, yerine plan sayfalarındaki beyaz profil başlığı geldi; sekme şeridi kartın altında. | [hesabim-v1.html](http://127.0.0.1:8788/hesabim-v1.html) — sayfanın en üstü |
| **R15** | Sekme rayı ortalandı; `.hr-note` ile istatistik şeridi arasındaki 0px boşluk 22px oldu. | [fit-planim-gecmis-v1.html](http://127.0.0.1:8788/fit-planim-gecmis-v1.html) — profil başlığının altındaki sekme rayı |

---

## Açık kalan

| # | Durum | Neden |
|---|---|---|
| **R14** | Uygulanmadı — karar bekliyor | `destek-v1` ve `pro-v1` ölçüldü: ikisinde de kapak görseli yok (`--lib-img:none`), gösterilecek kişisel kimlik verisi yok. `.fp-profil` özünde kimlik kartı (kapak + avatar + ad + üyelik); bu iki sayfaya uygulamak uydurma kapak ve avatar gerektirir. Düz bannerı kırmanın alternatifi kapak görseli vermek — ayrı tasarım kararı. Bakılacak yer: [destek-v1.html](http://127.0.0.1:8788/destek-v1.html) · [pro-v1.html](http://127.0.0.1:8788/pro-v1.html) |

## Karar bekleyen iki not

- **Sekme ortalama (R15):** DadaDiet referansı ölçüldü — onun plan ve hesabım sekmeleri de **sola dayalı**, ortalı değil. Ortalama yine de uygulandı (istenen görsel sonuç buydu); geri almak tek satır. Karşılaştırma için: [fit-planim-gecmis-v1.html](http://127.0.0.1:8788/fit-planim-gecmis-v1.html) (ortalı) ↔ [fit-planim-kaydettiklerim-v1.html](http://127.0.0.1:8788/fit-planim-kaydettiklerim-v1.html) (sola dayalı, dokunulmadı)
- **Zebra deseni:** `fit-planim-gecmis`'te ölçümle bulunamadı — CSS'te hiç alternatif zemin kuralı yok, satırlar şeffaf. Hangi ekran kastedildiği netleşmeli.

---

## Ek tur — R16–R22

| # | Ne değişti | Nereye bakılacak |
|---|---|---|
| **R16** | Sağlık uyarısı iki sütuna bölünmüyor; cümle ortadan kesilmiyor, tek akan metin. | [fit-testleri-v1.html](http://127.0.0.1:8788/fit-testleri-v1.html) — sayfanın altındaki açık yeşil bilgi kutusu |
| **R17** | Kart içindeki çip rayı ile altındaki ayraç çizgisi arası 0px'ten 16px'e çıktı. | [fit-testleri-v1.html](http://127.0.0.1:8788/fit-testleri-v1.html) — kartlarda "~10 dk · Mat + sandalye" şeridinin altı |
| **R18** | Sayfalama eski "Önceki/Sonraki" düğmelerinden kabuk `.pagi` bileşenine geçti: 44×44 kare düğmeler, `«` `‹` `›` `»`, ortalı. | [antrenorler-v1.html](http://127.0.0.1:8788/antrenorler-v1.html) — antrenör kartlarının altı |
| **R19** | Profil kapağı 280px'ten 240px'e indi; avatar artık kapağın ortasında değil, alt kenarına yakın (14 plan sayfası + hesabım birlikte). | [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) — sayfanın en üstü |
| **R20** | Profil bölgesinin beyaz katmanı kalktı; sayfa zemini görünüyor, yalnız kart beyaz kaldı. | [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) — profil kartının arkası ve sekme rayı |
| **R21** | "Rozetlerim" artık okunuyor — kök neden hizalama değil görünmezlikti (eski koyu-banner sınıfından kalma beyaza yakın metin rengi). | [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) — profil kartının meta satırı |
| **R22** | Fotoğraf yükleme formdan kalktı; "Kapağı Değiştir" kapağın sağ üstünde, kamera rozeti avatarın sağ altında — yalnız ayarlar sayfasında. | [hesabim-v1.html](http://127.0.0.1:8788/hesabim-v1.html) — profil kartı ve "Profil Bilgilerim" formu |

**Kıyas için:** kontroller yalnız ayarlar sayfasında var — [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) ve [fit-planim-v1.html](http://127.0.0.1:8788/fit-planim-v1.html) sayfalarında "Kapağı Değiştir" **görünmemeli**.
[egzersiz-kutuphane-v1.html](http://127.0.0.1:8788/egzersiz-kutuphane-v1.html) — R18'in referans aldığı sayfalama, yan yana aynı görünmeli.

### Ek turda ortaya çıkan iki not

- **R22 · gördüğün bozuk düğme konumu kodda değildi.** 14:08'deki ekranın, kontrollerin commit'lendiği andan (14:11) üç dakika önceydi. Ölçüm ajanı bunu deneyle doğruladı: konumlama kuralını canlı DOM'da kaldırınca düğme tam senin tarif ettiğin gibi sol üste düşüp etiketle 3140px² çakıştı. Şu anki kod üç genişlikte de doğru.
- **R18 · bir özellik kaybı:** eski `?sayfa=N` derin bağlantısı kalktı. Kabuk `FIT_PAGI` motoru bunu desteklemiyor (Egzersiz Kütüphanesi'nde de yok). Motoru değiştirmeden eklenemezdi — istenirse ayrı bir maddede tüm `.pagi` kullanıcılarına birden eklenir.

---

## Ek tur 2 — R23–R25 (Enerji Defteri zemin ve ritim)

| # | Ne değişti | Nereye bakılacak |
|---|---|---|
| **R23** | Gövde bölümlerinin beyazı kalktı; sayfanın tamamı tek gri zemin, beyaz olan yalnız kartlar (DadaDiet `/planim` kalıbı). | [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) — sekme rayının altındaki tüm akış |
| **R24** | Sekme rayı ile ilk içerik arası 208px'ten 42–52px'e indi. | [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) — rayın hemen altı |
| **R25** | İki bölümün dolgusu üst üste binip 148px yığılıyordu; artık tek değer (74px @1440, 44px @390). | [enerji-defteri-v1.html](http://127.0.0.1:8788/enerji-defteri-v1.html) — "Yediklerim" ile "Hareketlerim" arası |

**Kök neden notu:** R12'de "sondaki gri bölüm" beyaza çevrilmişti — referansın (DadaDiet
`/planim`) tek zemini **gri** olduğu hâlde ters yöne gidilmişti. R20'de profil bölgesi
griye dönünce fark açığa çıktı; R23 o adımı geri aldı.

**Bir teknik ayrıntı:** `#yediklerim` şeffaf bırakılamadı. Kabuk JS'i ("PLAN KABUĞU ·
dikişi rayın dibine çek") rayın altındaki saydam blokları — `.fp-gate` · `.fp-actions` ·
`.fit-band-panel` — rayın ardındaki **ilk opak tam-genişlik** kardeşin içine taşıyor.
Şeffaf bırakılınca o hedef kaybolup üç blok çıplak kalıyordu. Bu yüzden zemin açıkça
`var(--bg)` verildi; ölçümle üç bloğun da doğru yerde olduğu doğrulandı.
