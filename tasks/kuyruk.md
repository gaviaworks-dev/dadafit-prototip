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
| K15 | R1 · Ana sayfa tarif kartları DadaGastro `/tarifler` kart yapısına geçsin | **BITTI** | Yapı canlıdan ölçüldü · kart yüksekliği tek değer 363px (referans 363) · veri uydurulmadı, Gastro prototipinden 3 gerçek tarif yansıtıldı · Gastro turuncusu sızıntısı 0 · commit `0988ddc` |
| K16 | R2 · Bölüm başlığındaki marka lockup'ı | **BITTI** | Ayraç yeşilden #E14827'ye (renk canlıdan iki yöntemle ölçüldü) · marka 11.5→16px, Gastro ağırlığı 300 (referans paritesi) · kuyruk 12→10.5px · commit `0988ddc` |
| K17 | R3 · Bilgilendirme kutusu header menü genişliğine | **BITTI** | Kusur öncülü doğrulanmadı: kutu üstündeki ızgarayla ZATEN hizalıydı, dar olan makale kolonunun tamamıydı · köprü kartları + kutu kanon 1176'ya çıktı, okuma kolonu 840'ta kaldı · 8 sayfa × 3 genişlik GEÇTİ |
| K18 | R5 · `hesabim-v1` fatura bilgileri popup'a | **BITTI** | Kabuğun `.fb-*` modalı yeniden kullanıldı (yeni bileşen yok) · odak tuzağı 14 Tab GEÇTİ · Escape/dışarı tıklama/odak geri dönüşü ✓ · Kurumsal'da vergi dairesi zorunlu (form geçersiz), Bireysel'de değil · gömülü form kalktı, tekrarlı ID yok |
| K19 | R6 · `hesabim-v1` Diğer Modüller bozuk metni | **BITTI** | Kök neden: kartın `<a>`si İÇİNE ikinci `<a href="#bildirim">` yazılmış; iç içe `<a>` geçersiz, ayrıştırıcı dış bağlantıyı orada kapatıyor → bağlantı ızgaranın 6. kartı, "seçersin." anonim ızgara kalemi oluyordu · cümle ızgara dışına `.hs-state` not satırı olarak alındı · anonim metin 0, iç içe bağlantı 0, kart 7→6 (3 genişlik) |
| K20 | `hareket-hedefe-gore-v1` yazı justify | **BITTI** | Giriş metnine `.jt-flow` (kardeş sayfa R35/K14 ile birebir kalıp) · @1440 kelime arası 1.55×/1.34×, @1024 1.81×, @640 2.62×, @390 otomatik sola dönüyor · @640 nehri bilinen açık borç (devir notu §3.2), kardeş sayfada da var (2.01×) |
| K21 | R7 · `anatomi-v1` kas haritası denetimi | **BITTI** | 4 görünüm × 18 bölge = **72/72 ÇALIŞIYOR** · doğru kas 72/72 · `kas` parametresi 72/72 · panel 72/72 · ipucu↔panel uyumsuz 0 · JS hatası 0 · KUSUR YOK, düzeltme gerekmedi |
| K22 | R8 · seçim şekli kasın konturunu izlesin | **BITTI** | Kutu görünen **9** bölge-görünüm çifti, hepsi ARKA haritalarda: trapez-ust·trapez-orta-alt·romboid (×2 harita) + kadın erector-spinae·latissimus·gluteus-maximus · üreteç düzeltildi (lif yönünde eğik kesim + omurga şeridi) · kadın romboid TEK TARAFA düşüyordu, giderildi · **latissimus'un %34'ünü erector-spinae dikdörtgeni yiyordu** (ajanın B bulgusu, doğrulandı) → örtüşme 0/72 · ön haritalar birebir değişmedi |
| K24 | Çerez banner'ı anatomi haritasının üstünü kapatıyor — ilk ziyarette `adduktor` %97 erişilemez (@1440, harita alanının %12'si kapalı) | **BEKLIYOR** | Kabuk düzeyinde (`.cookie-banner` fixed z95, 66 sayfa) — Beyar kararı |
| K25 | Anatomi @390 dokunma hedefi: 10 bölge WCAG 2.5.8 (24px) altında, dokuzu kadın gövdesinde | **BEKLIYOR** | Ajan ölçümü, doğrulanmadı — kapsam dışıydı |
| K26 | Ön gövdedeki 5 kasa tıklayınca model arkaya dönüyor (baldır·trapez / TFL·brachioradialis·adduktor) — kusur mu tasarım mı | **BEKLIYOR** | Beyar kararı |
| K27 | `hesabim-v1` gerçek sekme | **BITTI** | WAI-ARIA tabs deseni (tablist/tab/tabpanel + ok tuşları + gezici tabindex) · kalıp `challenge-v1`den · 10/10 sekme doğru · derin bağlantı, `?tab=` alias, geri tuşu, sayfa içi çapa hepsi çalışıyor · sayfa 10454px → 2226px · paneller işaretlemede AÇIK doğuyor (JS düşerse 47 sayfadan gelen çapalar kırılmaz) |
| K28 | `aktivite-gunlugu-v1` best-practice revizyon | **BITTI** | En ağır kusur: iki başlık bloğunda İKİ `.lead` üst üste biniyordu, metin okunmuyordu — kabuk ızgarası her lead'i aynı hücreye pinliyor · tuzak kaynakta kapatıldı (66 sayfa tarandı, kusur yalnız bu sayfada) · `.ff-pop-clear` 49×19 → 57×26 ve kontrast 3.54 → 5.45 · birincil ölçüm döşemesine tipografik hiyerarşi (yayılma denendi, ızgarayı bozdu, geri alındı) · denetçi hata 7 → 6 |
| K23 | R9 · banner sayaç bloğu kanona | **BITTI** | `.an-fact` satır-içi şerit → kanon `.lib-stat` (b 29px/700 · span 12.5px/500 · mt 6px — referansla birebir) · sayısal olmayan iki kalem VERİDEKİ sayılara ayrıldı (16 ön · 15 arka · 2 gövde modeli), uydurma sayı yok · banner yüksekliği referansla aynı (544/607/587) |

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
