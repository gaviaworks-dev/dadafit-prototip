# FAZ 5 — SAYFA SPEC'LERİ (kaynak belgeden birebir)

Bu dosya `tools/FAZ5-BRIEF.md`'nin eki. Brief **nasıl** çalışacağını söyler;
bu dosya **ne** üreteceğini söyler. Aşağıdaki maddeler kaynak belgeden
(`dada-fit.docx`, §7 · §8 · §10 · §15 · §24) **birebir** alınmıştır.

**Kural: bu listelerin dışına çıkma.** Belge bir alanı saymıyorsa uydurma;
gerekli gördüğün ek alanı raporunda "belge dışı, şu sebeple ekledim" diye bildir.

---

## `fit-testleri-v1.html` — §8 (liste sayfası)

**Yedi test kategorisi (tam liste, eksiksiz olacak):**
Başlangıç Seviyesi Testi · Mobilite Değerlendirmesi · Denge Değerlendirmesi ·
Temel Kuvvet Değerlendirmesi · Dayanıklılık Değerlendirmesi ·
Masa Başı Yaşam Değerlendirmesi · Hareket Alışkanlığı Testi

Her kart `fit-testi-detay-v1.html?test=<slug>` hedefine gider (benzersiz slug).
Sayfa "Programımı Bul sihirbazını **destekleyen bağımsız** alan" olarak konumlanır.

**Sağlık sınırı (§8, zorunlu):** "Testler tıbbi teşhis, hastalık tanısı veya tedavi
önerisi üretmemelidir." → `.hr-note` ile sayfada açıkça yazılı olacak.

## `fit-testi-detay-v1.html` — §8 (detay)

Her testte **bu on alan** bulunacak:
Test amacı · Kimler için uygun olduğu · Tahmini süre · Gerekli ekipman ·
Güvenlik uyarısı · Adım adım uygulama · Sonuç özeti · Uygun başlangıç seviyesi ·
Önerilen program · Antrenöre danışma yönlendirmesi

**Fiziksel aktivite uygunluk taraması (§8, zorunlu ve bu sayfada):**
"Test başlamadan önce kısa bir fiziksel aktivite uygunluk taraması gösterilmelidir.
Riskli cevaplarda test **durdurulmalı** ve kullanıcı uzman desteğine yönlendirilmelidir."
→ Tarama gerçekten çalışacak: riskli cevap seçilince akış DURACAK (test adımları
açılmayacak) ve uzman desteği yönlendirmesi görünecek. Bu davranış ölçülecek.

## `fit-testi-sonuc-v1.html` — §8 (sonuç)

Sonuç özeti · Uygun başlangıç seviyesi · Önerilen program (gerçek program sayfasına
bağlanacak) · Antrenöre danışma yönlendirmesi (`antrenorler-v1.html`).
Sonuç **tanı gibi** sunulmayacak; §8 sağlık sınırı burada da yazılı olacak.
Karşılaştırma başkasıyla değil kullanıcının kendi başlangıcıyla (§4).

## `aktivite-gunlugu-v1.html` — §7

**İçerik (tam liste):** Günlük adım · Aktif süre · Yürüyüş · Koşu · Bisiklet ·
Tamamlanan antrenman · Mesafe · Yaklaşık enerji kullanımı · İsteğe bağlı nabız
bilgisi · Manuel aktivite ekleme · Aktivite düzenleme · Aktivite silme ·
Aktivite kaynağı · Son senkronizasyon zamanı

Ekle/düzenle/sil gerçekten çalışacak (istemci tarafı, kalıcılık gerekmez) ve ölçülecek.
Enerji değerleri **"yaklaşık"** ibaresiyle (§13).

## `bagli-uygulamalar-v1.html` — §7

**Dört seçenek:** Apple Health · Android Health Connect · Akıllı saatler · Manuel veri girişi

**Her bağlantı için beş alan:** Bağlantı durumu · Verilen izinler · Son senkronizasyon ·
Hangi verilerin aktarıldığı · Bağlantıyı kesme

"Sağlık ve aktivite izinleri **ayrı ayrı** yönetilebilmelidir. İzinler isteğe bağlı,
**geri alınabilir** ve **açıklamalı** olmalıdır." → izin anahtarları tek tek açılıp
kapanacak, her birinin yanında ne işe yaradığını söyleyen açıklama olacak.

## `video-seanslari-v1.html` — §10

**Sekiz filtre (tam liste):** Hedef · Süre · Seviye · Ekipman · Antrenör ·
Hareket türü · Ücretsiz · Pro

Filtreler gerçekten süzecek, URL parametresine yansıyacak, geri/ileri çalışacak (§23).
Filtre düğmelerinde `aria-pressed` (§20).

## `video-seans-detay-v1.html` — §10

**On dört alan (tam liste):** Başlık · Açıklama · Antrenör · Süre · Seviye · Ekipman ·
Çalışan bölgeler · Isınma bilgisi · Video bölümleri · Kaldığın yerden devam ·
Tamamlandı olarak işaretle · Kaydet · Programa ekle · Benzer seanslar · Güvenlik uyarısı

Not: video **dosyası eklenmeyecek** (§18 performans; repoda ağır medya yok).
Bölüm listesi + ilerleme durumu arayüz olarak kurulacak, poster/placeholder kullanılacak.

## `uyelik-faturalandirma-v1.html` — §15

**Sekiz alan (tam liste):** Aktif paket · Başlangıç tarihi · Bitiş tarihi ·
Yenileme tarihi · Ödeme geçmişi · Faturalar · Paket değiştirme · Abonelik iptali

**Paket yapısı (§15, birebir):**
- Ücretsiz: Temel egzersiz kütüphanesi · Başlangıç programı · Temel Enerji Defteri ·
  Su takibi · Temel Challenge · Hareket Rehberi
- Pro: Tüm programlar · Video seansları · Gelişmiş ilerleme · Fit Testleri ·
  Aktivite ve cihaz bağlantıları · Program önerileri · Gelişmiş Challenge sistemi
- Pro Max: Pro özelliklerinin tamamı · Antrenör görüşmesi avantajları · Kişisel program
  değerlendirmesi · Dada Diet entegrasyonu · Dada Gastro tarif önerileri · Öncelikli destek

"Paketlerin içerikleri **karşılaştırma tablosunda** açıkça gösterilmelidir."
`pro-v1.html` ve `pro-odeme-v1.html` ile çelişme — ikisini de oku, aynı adları kullan.

## `destek-talepleri-v1.html` + `destek-talebi-detay-v1.html`

**Belge bu iki sayfanın alanlarını saymıyor** — yalnız §5'te "Destek Taleplerim"
modülü ve §24'te dosya adları geçiyor. Bu yüzden kapsam **dar** tutulacak
(bkz. `KARARLAR.md` K4): talep listesi (durum · konu · tarih · numara), durum
süzgeci, yeni talep formu (gerçek `<label>`, hata yalnız renkle değil §20), ve
detayda mesajlaşma dizisi + talep kapatma. Belge dışı modül (canlı sohbet,
yapay zekâ asistanı — §21) **eklenmeyecek**.

---

## Hepsi için ortak

- Sayfalar birbirine bağlanacak; **henüz üretilmemiş** bir sayfaya link verilmeyecek.
  Aynı dalgada üretilen 10 sayfa birbirine bağlanabilir (hepsi var olacak).
- Menüye/footer'a bağlama işi **ana oturumda** (Faz 3). Sen `index.html`'e de dokunma.
- Hesabım menüsündeki üç geçici href (`Bağlı Uygulamalar` · `Üyelik/Ödeme/Fatura` ·
  `Destek Talepleri`) bu dalga bitince gerçek hedeflerine bağlanacak — ana oturum yapar.
