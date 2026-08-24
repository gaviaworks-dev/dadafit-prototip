# REVİZYON-12 — GÖZDEN GEÇİRME LİSTESİ

**Yerel sunucu:** http://127.0.0.1:8788 · ayakta bırakıldı
(düşerse: `cd /Users/gaviaworks/Developer/Projects/dadafit-prototip && python3 -m http.server 8788 --bind 127.0.0.1 &`)

**Durum:** 14 madde kapandı ve canlıda doğrulandı · 1 madde açık (R14)
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
