# DEVIR-9 — Kullanıcı alanı belgesi turu

**Taban:** `903cbf1` → **bitiş:** `bd08a43` (+ bu not)
**Nöbet:** 29/29 yeşil · site taraması 201 yükleme 0 sorun · yapışıklık 0
**Ekip:** R9-KABUK (kabuk · K66 · nöbetler) · R9-DOKUMAN (belge · sayfalar)

Turun girdisi `Kullanıcı Giriş Sonrası/DadaFit Giriş Sonrası Kullanıcı Alanı.docx`
(837 paragraf, 18 bölüm). Belge prototiple **ölçülerek** karşılaştırıldı: 26
sayfanın `main` metni Playwright ile döküldü, `dm_fit` ve `dm_fit_planlar_v1`
**tohumlanıp** dolu-durum ekranları ayrıca ölçüldü — boş durumla yetinilmedi.
29 eksik çıktı; Faz A/B/C kapandı, Faz D açık bırakıldı.

---

## Yapılanlar

### Faz A · kabuk (K66)
Belge §2 menü mimarisini prototipin tersine kuruyor. Beyar "belge birebir
uygulansın" dedi; bu K25'i ve `fit-shell.js`'teki yazılı *"Planım ile Hesabım
karıştırılmaz"* kararını geçersiz kıldı.

- `ACCOUNT` → **11 kalem / 3 grup**; 19 hesap kalemi tek "Hesap ve Ayarlar"a katlandı
- Bildirimler menüden çıktı (§1: header'da durur, menüye tekrar konmaz)
- header'a **İlerlemem**; sıra Ara · Planım · İlerlemem · Bildirimler · Profil
- alt bar: Hareket → **Hareketler**, Hesabım → **Profil**
- `PLAN_TABS` 7 → 3; inen dördü `PLAN_EXTRA`'ya (sayfalar duruyor, yetim değil)
- `uyelikKalemi()` — §14 dinamik üyelik başlığı, dört kırılım
- `drawerAccountHtml()` — menü mobilde de aynı `ACCOUNT` kaynağından

### Faz B · sayfalar (10 dosya)
gün+tarih · gün sonu formu (zorluk · efor · enerji · ağrı · not) · boş durum
2→4 aksiyon · **challenge kartı `dm_fit.challenge`'a bağlandı** (sabit "Gün 7"
gitti) · Kaydettiklerim 6→9 tür + 5 aksiyon + 6 koleksiyon · bildirim kalem
işlemleri · promosyon/yıllık/dondurma/iptal nedeni/iade · Antrenörüm kartı +
dosya paylaşımı · ₺149→₺99 · °C/°F · sıralama anahtarı kaldırıldı · rozet metni
tutulabilir hâle geldi.

### Faz C · yeni sayfa
`fit-test-sonuclarim-v1.html` (§10): 9 kayıt · 8 kategori · 7 karşılaştırma.
Veri `fit-testi-sonuc-v1`'den **birebir** alındı, uydurulmadı.

### Denetim altyapısı (yeni)
`DENETIM.md` + `tools/denetim.mjs` — bkz. aşağıdaki tuzaklar.

---

## Tuzaklar — B33'ten devam

**B33 · `:last-of-type` tür başına çalışır.** Karışık eleman türlerinden oluşan
kardeş listesinde "son blok" kuralı yanlış elemana iner: son `<fieldset>` ile
son `<div>` ayrı ayrı seçilir. Açık sınıf kullan (`.fpx-alan-son`).

**B34 · `fieldset{border:0}` özgüllüğü.** (0,1,1) olan bu sıfırlama, (0,1,0) olan
sınıf kuralının `border-bottom`unu ezer. Sıfırlarken yalnız üst/yan kenarları sil.

**B35 · Kapalı menüde `visibility:hidden` çocuklara MİRAS kalır.** `.acct-menu`
kapalıyken içindeki grup başlıkları "görünmüyor" ölçülür. Hover'lı ölçüm şart.
Bu, yeni nöbette 3 sahte kırmızı üretti.

**B36 · Nöbet dosyalarının 8'i 8811 DIŞINDA porta varsayılan**
(8821/8822/8831/8841/8843/8851/8852). URL vermeden koşarsan **8 sahte kırmızı**
alırsın. Her zaman `node tests/X.mjs http://localhost:8811`.

**B37 · Ray daralması mobilde kapı kapatır.** `PLAN_TABS` 7→3 inince
`fit-planim-gecmis-v1` ve `fit-planim-kaydettiklerim-v1` **@390'da tamamen
kapısız kaldı** — masaüstünde açılır menüden gidiliyordu ama mobilde açılır menü
yok, drawer da raydan besleniyordu. Lead'in 1440-only ölçümü bunu KAÇIRDI.
Ray/menü değişikliği her zaman @390'da da ölçülmeli.

**B38 · Ölçüm aracının kendi hazırlığı ölçütü bozar.** `tools/denetim.mjs` üç
kez kör çıktı: (a) özet yalnız `main`'den alınıyordu → 3 sayfada **91 yanlış
"ölü"**; (b) `odak` ölçüte konunca her tıklama canlı göründü → araç kendi
bulduğu gerçek kusurları **kaybetti**; (c) `scrollIntoView` tıklamadan ÖNCE
kaydırmayı değiştiriyordu, `kaydirma` da ölçütün parçasıydı → yine her şey canlı.
Yanlış negatif yanlış pozitiften pahalıdır: biri gürültü yapar, öteki kusuru saklar.

**B40 · Kaldırılan metni yorumda BİREBİR alıntılama.** `fit-planim-rozetler-v1`'de
bir ajan kaldırdığı cümleyi açıklayıcı yorumunda alıntıladı; lead kaynakta grep
atıp "iş yapılmamış" sandı ve ajanı bitmiş işe geri gönderdi. Kaynak araması
render kanıtı değildir (DENETIM.md §2) — ama yorum da aramayı kirletmemeli.

**B41 · `data-lg-gate` YALNIZ çıkışta kapı açar.** Girişte düğmenin kendi işi
yoksa düğme ölüdür. Bu turda 15 örnek kapatıldı (randevular 9 · kaydettiklerim 1
· bugün 1 · 4 çip `aria-pressed`); `hesabim-v1`'de **11 örnek AÇIK kaldı** (D17).

**B42 · `prompt()` ile bağlamak "bağlamak" değildir.** Tarayıcı yerel diyaloğu
bastırdığında düğme yine hiçbir şey yapmaz. `tools/denetim.mjs` bunu ölü saymakta
haklıydı; çözüm satır içi form.

**B43 · Süzgeç çipi `aria-pressed` taşımalı.** Yalnız `.on` sınıfı yetmiyor: hem
ekran okuyucu durumu göremiyor, hem `denetim.mjs:119` seçili çipi ayıklayamayıp
sahte "ölü" üretiyor.

**B39 · Rapor "bitti" derken atlamış olabilir.** Bir ajan gönderilen dört maddeyi
hiç yapmadan sonraki faza geçti ve raporunda söz etmedi. Lead ölçmeseydi kapanmış
sayılacaktı. `DENETIM.md` §4 ve §7 bunun için var.

---

## Bilinçli sapmalar

- **Aktivite kayıtları iki sayfa kaldı.** Belge §7 tekleştiriyor; birleştirme iki
  sayfayı da yeniden yazmak demekti, getirisi karşılamadı. İş bölümü iki tarafta
  da kullanıcıya cümleyle söylendi ve karşılıklı bağlandılar.
- **§9.4 Sıralama uygulanmadı** — ürün kararı bekliyor (aşağıda).
- **`vsRozet` anahtarı korundu.** Var olan bir özelliği bir cümle uğruna silmek
  yerine `fit-planim-rozetler-v1`'in tutulamayan metni düzeltildi.
- **Adres şeması** (`/hesabim/planim`) uygulanmadı — prototip düz `.html`.

## Yanlış alarm — geri alındı

`#odeme-gecmisi` ray işaretlemesi diye bir kusur **yok**. İlk ölçüm yumuşak
kaydırma bitmeden alınmıştı (450 ms, ~2000px için yetmiyor). Üç genişlikte de
gözcü doğru: `scroll-padding-top 112 + scroll-margin-top 88 = 200 ≤ eşik 208`.
Düzeltilseydi çalışan bir şey bozulacaktı.

---

## AÇIK kalemler

| No | Konu | Neden açık |
|---|---|---|
| D8 | §4.3 takvim planlama (7 aksiyon: gün değiştir · taşı · dinlenme ekle · hatırlatma saati · yeniden oluştur · takvime aktar · Google/Apple) | Plan şemasına tarih/hatırlatma alanı gerekir |
| D9 | §3.3 antrenman detayı (ısınma · dinlenme · ekipman · video · alternatif · geç · bitir) | `fit-plan-kayit.js` **sözleşmesini** değiştirir, Antrenman Oluşturucu'yu da açar |
| D10 | §5.8 raporlama · §5.4 hareket bazlı ilerleme · §7.4 filtreler | Yeni veri alanları gerekir |
| D11 | §9.4 Sıralama | **Ürün kararı** — bugünkü ton "kimseyle sıralanmazsın" |
| D12 | Gün sonu kaydı (§3.7) **oturumluk** | `dm_fit.bugun` şemasında not/zorluk/efor/enerji/ağrı alanı yok; şema kabukta |
| D13 | Koleksiyon üyeliği temsilî | Gerçek üyelik yeni bir depo anahtarı ister |
| D14 | §10.2'nin **Esneklik** ve **Postür farkındalığı** kategorilerinin kataloğda testi yok | Sayfa bunu "ölçülmedi" diye gösteriyor; iki yeni test ayrı iş |
| D15 | Test kayıtları sayfa içi sabit veri | `fit-testi-sonuc-v1` ile elle senkron; gerçek arşiv depo anahtarı ister |
| D16 | Su takibi sayacı oturumluk | Su verisi `dm_fit` şemasında yok |
| D17 | `hesabim-v1`'de **11 ölü hesap yönetimi düğmesi** (fotoğraf yükle · kaldır ×3 · varsayılan yap · ödeme yöntemi ekle · bağla ×2 · oturum kapat ×3) | Hesap yönetimi akışlarının tamamı — ayrı iş |
| D18 | Üst bantta **4 adsız sosyal bağlantı** (`aria-label` yok) | Kabuk dosyası; `docs/icerik-bekleyen.md`'de `ustbant-sosyal` olarak zaten kayıtlı |

---

## Akış denetiminden gelen, belgeden bağımsız açık kalemler

Turun ortasında program ve challenge modülleri ayrıca ölçüldü. Belgeyle ilgisi
yok ama aynı ürünün açık yaraları:

- **"Programa Başla" hiçbir şey yapmıyor** — `state.program` tıklamadan önce de
  sonra da `null` (misafir ve üye). Katalog programı hiç başlatılamıyor.
- **Challenge'ın hiçbir içeriğe bağlantısı yok** — `challenge-v1` ve
  `challenge-merkezi-v1`'den egzersiz/hareket/video seansına **0 bağlantı**.
- **`challenge-v1`'de 32 ölü etkileşim** — takvim gün kutularının otuzu ve
  "Bugünün hareketini yap" düğmesi (`tools/denetim.mjs` ile doğrulandı).
- **Ana sayfa challenge bandı statik** — `"7 / 30"` sabit yazılı.
- **30/30'da ödül yok** — kilitli rozet kilitli kalıyor.
- **Rozet sayıları çelişiyor** — profil "9 kazanıldı", galeri 23.
- **Kanıt kademesi yok** — aynı "antrenman tamamlandı" dört ayrı yerde dört
  farklı kalitede kayıt üretiyor: ölçülmüş kronometre (`egzersiz-detay:1470`) ·
  video süresi · **sabit `dk:25, kcal:280`** (`program-detay:1060`) · hiçbir şey
  (`challengeGunTamamla`). Uygulama dördünü aynı sayıyor.

## K27 taban sayıları

| Nöbet | Taban `903cbf1` | Bugün |
|---|---|---|
| `plan-account.mjs` (yeniden yazıldı) | **26 sorun** | 0 |
| `kabuk-r8.mjs` §6 (güncellendi) | **2 sorun** | 0 |

Taban ölçümü `git stash` ile değil **ayrı `git worktree` + ayrı port** ile
alındı — aynı ağaçta ikinci ajan çalışıyordu.
