# KUYRUK

**Kural (Beyar, 2026-08-24):** Gelen her mesajdaki her ayrı istek tek tek buraya
yazılır, durumu BEKLIYOR olur. Sırayla işlenir; biten BITTI olur ve tek satır rapor
verilir. Bir iş bitince yeni mesaj beklenmeden kuyruğa bakılır, BEKLIYOR varsa
doğrudan ona geçilir. Kuyruk boşalınca "kuyruk boş" denir.

**Ek kural (Beyar):** iş bitince **doğrudan canlıya alınır** — sormadan push edilir.
Tek istisna: bağımsız ölçüm KIRMIZI dönerse push edilmez, önce düzeltilir.

---

| # | İstek | Durum | Not |
|---|---|---|---|
| K1 | Kuyruk sistemini kur, bundan sonra her oturumda uygula | **BITTI** | Bu dosya |
| K2 | R32 · topbar dil ayracı boşluğu | **BITTI** | ayraç iki yanı 18/4 → 16/16 · commit `b80422d` |
| K3 | R34 · plan sekme rayı 14 sayfada ortalansın | **BITTI** | 14/14 sayfa sol=sağ=405 · gecmis'teki tekil kural kaldırıldı · K69 · commit `24e18f7` |
| K4 | R26 · hero tam ekran, beyaz panel görünmesin | **BITTI** | dört ekranda 22px → 0px · dikiş tabanı korundu · commit `33da546` |
| K5 | R27 · tarif kartları DadaGastro kalıbına | **BITTI** | kart opak beyaz · referans canlıdan ölçüldü, token'lar birebir tuttu · commit `71f2ba6` `dadac5f` |
| K6 | R30 · etiket boşluğu + 2'den fazlada "+N" | **BITTI** | 18 kartta tek değer 16px · "+N" mekanizması hazır, veri 2'yi aşmadığı için 0/18 tetikleniyor · commit `20eb785` `3753ddb` |
| K7 | R31 · başlık 2 satırken kart bozulmasın | **BITTI** | 18 kart tek yükseklik 425.28px (3 genişlik) · kırpma 0/18 · commit `0ac40d5` |
| K8 | R28 · akordeon başlığı altına soft ayraç | **BITTI** | soft ayraç `rgb(216,235,224)` · nefes 18/18 simetrik · commit `69ea772` |
| K9 | R29 · "ÖNCE OKU"da tek bölüm açık kalsın | **BITTI** | 3 tıklamada da tam 1 açık · klavye ✓ · commit `1339368` |
| K10 | R33 · video seans detay sayaç hizası | **BITTI** | kök neden: kırık HTML yorumu ekranda hayalet metin olarak kalmış, flex'i 641px'e şişirmiş · 641→107px · commit `4f7e5bc` |
| K11 | Bağımsız ölçüm + push + canlı doğrulama (R26–R34) | **BITTI** | yerel 11/11 + canlı 11/11 GEÇTİ · push `f37845b..e7ced9c` |
| K12 | Linkleri "şu linkte şunu değiştirdim" biçiminde ver | **BITTI** | aşağıdaki listede |
| K13 | R14 · destek-v1 + pro-v1 profil kalıbı | **BEKLIYOR** | Beyar kararı bekliyor (kapak görseli/kimlik verisi yok) |
| K14 | R35 · Yeni Başlayanlar giriş metni `justify` + canlıya al | **BITTI** | mevcut `.jt-flow` kancası kullanıldı · @390'da otomatik sola dönüyor (nehir yok) · commit `174db5a` |
| K15 | R1 · Ana sayfa tarif kartları DadaGastro `/tarifler` kart yapısına geçsin (rozet sol üst, kalp sağ üst, görsel, başlık, tek satır künye, ayraçlı yazar satırı) — olmayan veri uydurulmayacak | **BEKLIYOR** | Keşif yapıldı, onay bekliyor |
| K16 | R2 · Bölüm başlığındaki marka lockup'ı: ayraç çizgisi DadaGastro renginde, "DadaGastro" yazısı büyük, "KÖPRÜ İŞ BAŞINDA" daha küçük | **BEKLIYOR** | Keşif yapıldı, onay bekliyor |
| K17 | R3 · `hareket-yeni-baslayanlar-v1` en alttaki bilgilendirme kutusu header genişliğine yayılsın; aynı desen başka sayfalarda varsa hepsi birden | **BEKLIYOR** | Kanon genişlik sayfadan alınacak, desen envanteri çıkarılacak |
| K18 | R5 · `hesabim-v1` Faturalar sekmesi: "Fatura Bilgilerim" formu popup'a taşınsın, başlık sağ üstüne düzenle düğmesi, Kurumsal/Bireysel'e göre zorunlu alan, gömülü form kalksın | **BEKLIYOR** | Sitedeki mevcut modal kalıbı ölçülecek |
| K19 | R6 · `hesabim-v1` Diğer Modüller sekmesi: ızgaranın içine kart gibi düşmüş bölünmüş cümle ("yukarıdaki bölümden" / "seçersin.") tek parça ve ızgara dışına | **BEKLIYOR** | Kök neden DOM'dan ölçülecek |
| K20 | R7 · `hareket-hedefe-gore-v1` sayfasındaki yazı justify olsun | **BEKLIYOR** | K14'teki `.jt-flow` kancası kullanılacak |

---

## Açık borçlar (kuyrukta değil, karar bekliyor)

- **R18 · `?sayfa=N` derin bağlantısı** — sayfalama kabuk `.pagi`'ye taşınırken kalktı;
  `FIT_PAGI` desteklemiyor, Egzersiz Kütüphanesi'nde de yok. İstenirse tüm `.pagi`
  kullanıcılarına birden eklenir.
- **Zebra deseni** — Beyar `fit-planim-gecmis`'te "zebra var" dedi, ölçüm bulamadı
  (hiç `nth-child`/alternatif zemin kuralı yok). Hangi ekran kastedildiği netleşmeli.
- **`#uyelik`/`#odeme` çapa gecikmesi** — `#hsRail` aktif sekme vurgusu ilk yüklemede
  geç güncelleniyor (scrollspy zamanlaması, bu turun regresyonu değil).
- **R19 · kapak yüksekliği** — DadaFit 240px (DadaDiet paritesi, K68); DadaGastro 280px
  kullanıyor. Üç marka arasında bilinçli sapma.
