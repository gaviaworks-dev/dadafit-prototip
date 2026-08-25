# KUYRUK

**Kural (Beyar, 2026-08-24):** Gelen her mesajdaki her ayrı istek tek tek buraya
yazılır, durumu BEKLIYOR olur. Sırayla işlenir; biten BITTI olur ve tek satır rapor
verilir. Bir iş bitince yeni mesaj beklenmeden kuyruğa bakılır, BEKLIYOR varsa
doğrudan ona geçilir. Kuyruk boşalınca "kuyruk boş" denir.

**Ek kural (Beyar):** iş bitince **doğrudan canlıya alınır** — sormadan push edilir.
Tek istisna: bağımsız ölçüm KIRMIZI dönerse push edilmez, önce düzeltilir.

**Ek kural (Beyar, 2026-08-25) — TEMPO:** Bir madde tek sayfa için geldiyse önce O
SAYFA düzeltilir, ölçülür, kapatılır. Aynı kusurun başka sayfalarda olup olmadığı
AYRI bir madde olarak kuyruğa yazılır, o turda taranmaz. 66 sayfa taraması ancak
Beyar "her yer" derse yapılır. Bir maddeye 10 dakikadan fazla harcanıyorsa durulur,
bulunan söylenir ve devam sorulur.

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
| K29 | R10 · Plan sayfalarındaki İKİNCİ sekme rayı kalksın, kalemleri üstteki profil rayına taşınsın | **BITTI** | Ray artık BÖLÜME göre: planım sayfalarında 3 kalem (K66 korundu), 4 defter sayfasında `DEFTER_TABS` 4 kalem · ikinci ray **3 sayfadan** kalktı (`dengele`·`su`·`haftalik`) · kök neden: K66'da `defter` anahtarı raydan düşünce kabuktaki `RAY_UST` eşlemesi ÖLÜ kalmış, 4/4 defter sayfasında hiçbir kalem aktif değildi · R12·G7 aynı kaldırmayı yalnız `enerji-defteri-v1`e uygulamıştı (dersler §15) · doğrulama: 14 sayfa × 4 genişlik ray=1 · 16/16 tıklama @1440 · 32/32 tıklama @390 (çerez banner'ı açık ve kapalı) · **bağlantı kaybı 0**, dört hedef de +1 |
| K30 | R11 · `destek-v1` sekme rayı ortalansın | **BITTI** | `.pf-tabs.is-center` opt-in sınıfı kabuğa eklendi (`.fit-tabs.is-center` kanonunun ikizi), destek çiftine işaretlendi · ilk deneme `@media(max-width:900px)` ile ortalamayı kapatıyordu — ölçüm bunun kaba olduğunu gösterdi (ray 2 kalem, @390'da bile taşmıyor), `justify-content:safe center`e geçildi · 5 genişlik × 2 sayfa sol=sağ · KAPSAM: destek rayı TEK ray, iki sayfada birden görünüyor; yalnız birini ortalamak R34'teki zıplamayı geri getirirdi |
| K31 | R12 · `destek-talepleri-v1` beyaz panelin üst köşeleri 22px radius | **BITTI** | Öncül yanlış, kusur gerçek (dersler §18): 22px yarıçap ZATEN uygulanmıştı, okunmayan **dolguydu** — panel `--bg-cream`, altındaki sayfa zemini de aynı · envanter: 49 dikişten 42'si `is-onbanner` (köşe koyu banner'da okunur, 6'sı krem ve sorunsuz), **7'si ray-altı** (köşe YALNIZ dolguyla okunur) · ray-altı 4 beyaz / **3 krem** → `destek-talepleri`·`antrenor-ol`·`arama-fit` `--paper`e çekildi, ray-altı 7/7 beyaz · piksel nöbeti 47/48 okunuyor · render 3/3 doğrulandı, kart kiti kenarla ayrışmaya devam ediyor |
| K32 | R13 · `fit-planim-programim-v1` bölüm başlığı ile kart arası nefes | **BITTI** | Öncül sayfa adında kaydı: "Alt Vücut ve Core" `fit-planim-programim`'de sabit metin değil — **5 günlük** üretilmiş planın 5. gününün adı (`antrenman-olusturucu` PPL şablonu), sayfaya `dm_fit_planlar_v1`'den geliyor; kusuru üretmek için gerçek plan üretildi, veri uydurulmadı · Ölçüm (3 genişlikte birebir aynı): `.pp-kok` → koyu `.fp-card.is-dark` **0px** — sayfadaki TEK aykırı aralık · sayfanın kendi ritmi: pp-kart→gunler-ust **22px**, gunler-ust→gunler 14px, gün kartları arası 16px, koyu kart→fp-grid **22px**, fp-grid→hr-note 34px · `.pp-kok{margin-bottom:22px}` — değer sayfanın kendi blok kanonundan, iki yerde zaten geçiyor · render planlı ve boş durumda doğrulandı |
| K33 | R14-B · Program tamamlanma akışı — SPEC KEŞFİ (kod yazma, ölç+raporla, sonra DUR) | **BITTI** | **1→2→3→4 UYGULANDI** (Beyar onayı). #1 gün tanımı: her hareket bir KARAR almış (tam|yarim|**atlandi**) → gün biter; `oran` dokunulmadı, atlanan yapılmış sayılmıyor — kanıt: son testte `oran=%93` ama `bitti=true`. Şema v3 `gunDurum` + `gunDurumu()`/`gunKayitIsaretle()`. #2 `ozet().bitti`+`bitenGun`; `aktifGun` ölçütü karara geçti (tamamı atlanmış gün sonsuza kadar 'sırada' kalıyordu); plan bitince hiçbir gün 'Sırada' demiyor. #3 mevcut `.pp-simdi` yuvası DURUM yuvasına döndü (yeni eleman yok, çakışma 0, komşu arası 13px, 4 genişlik) + aria-live gün/plan cümlesi. #4 köprü KABUKTA (`fit-plan-degisti`→`antrenmanTamamla`, kaynak='beyan', dk/kcal=null çünkü planda süre verisi YOK); mühür `kayit` ile tek seferlik — gün geri açılıp tekrar bitince ikinci kayıt yazılmıyor. ÇATALLANMA GİDERİLDİ: `fit-planim-v1` kendi `yapilan>=toplam` ölçütünü kullanıyordu (atlanan yüzünden o ekranda gün ASLA bitmiyordu), tek kaynağa çekildi. `dk` de `kcal` gibi üç durumlu oldu; geçmiş 'süre —' basıyor, uydurma 25dk/280kcal yok. Zincir uçtan uca: gün→geçmiş→program.biten→'tamamlandi'→arşiv. #5–#7 sonraki tur, #6 (bitiş ekranı) DadaDiet referansı ölçülmeden yapılmayacak. |
| K34 | `challenge-v1` sayfa ortasındaki `.chl-track` panelinin dikiş köşesi beyaz-üstüne-beyaz, okunmuyor | **BEKLIYOR** | K31 taramasından çıktı · banner altı dikiş DEĞİL, sekme rayı altındaki panel — ayrı yapı, ayrı karar |
| K35 | `.pf-tabs` rayı 4 sayfada daha sola dayalı (`hesabim` · `profil` · `sss` · `uyelik-faturalandirma`) — ortalansın mı | **BEKLIYOR** | K30'dan çıktı · ayrı raylar (6–10 kalem), destek çiftinden farklı karar olabilir |

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
