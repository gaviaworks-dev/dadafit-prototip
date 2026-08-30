# DadaFit · Public Yüzey — Mantık Kopuklukları

**Ölçüm tarihi:** 2026-08-30 · **Kapsam:** 75 HTML sayfası, 16 JS modülü (11.725 satır)
**Yöntem:** statik sayım (grep/python) + Playwright ile çalışan tarayıcıda ölçüm
(`python3 -m http.server 8788`, oturum `?auth=1`).

---

## 🟢 R20 KAPANIŞ — 2026-08-30, aynı gün

**Bu belge ölçüldüğü turda hiçbir kod değiştirilmemişti. R20'de 22 kalemin
tamamı ele alındı.** Beyar'ın kuralı: *"Sahte davranış kalmayacak. Bir düğme
çalışmıyorsa ya çalışsın ya kalksın. Bir vaat karşılıksızsa ya karşılığı
kurulsun ya vaat kalksın. 'Kaydedildi' diyen her yer gerçekten kaydetsin."*

Aşağıdaki her satır **tarayıcıda ölçülerek** kapandı; "eklendi/çalışıyor"
kanıt sayılmadı (`DENETIM.md`).

| # | Sınıf | Nasıl kapandı | Kapanış ölçümü |
|---|---|---|---|
| K1 | yarım eylem | 6 form `dm_fit_hesap_v1`e yazıyor **ve açılışta geri okuyor**; doğrulama geçmeden "Kaydedildi" yok; şifre kartı düz metin şifre YAZMIYOR | ad değiştir → kaydet → yenile → değer **duruyor**; 6/6 form |
| K2 | yarım eylem | `startSub` artık `dm_user.paket` yazıyor (okuyan 2 yüzey hazırdı) | `dm_user.paket:"pro"`; hesabım rozeti **Ücretsiz → Pro** |
| K3 | karşılıksız vaat | test ve antrenör ölçüleri açıldı (`dm_fit_test_v1` · `dm_fit_antrenor_bilgi_v1`, **ikisi de sağlık verisi taşımıyor**); km/adım ailesi K5'in cihaz hunisiyle beslendi | **ölçüsüz rozet 0/50** (eskiden 4); test çözüldü → `test-ilk` kazanıldı; 12 km → **`km-10` kazanıldı**, `olcular().km:12` |
| K4 | karşılıksız vaat | eksik türlere `data-kaydet` düğmesi: rehber (9 sayfa) · test (7 kart) · antrenör · challenge | 6 türün 6'sı dolabiliyor |
| K5 | karşılıksız vaat | aktivite kayıtları `dm_fit.gecmis`e yazıyor; sabit 6 tohum söküldü; **oto-tahmin (dk × sabit hız) söküldü**; bağlı uygulamaya dayalı gerçek **Kaynak seçici** | ekle → yenile → **duruyor**; bağlantı yokken seçici `disabled` + dürüst metin; bağlıyken `kaynak:'cihaz'` |
| K6 | karşılıksız vaat | ücretli randevu önce paket hakkından düşüyor (`dm_fit_paket_hakki_v1`), yoksa karttan tahsil + fatura | Aylık Paket → `{kalan:3,toplam:4}`, fatura 11→12; sonraki seans → `kalan:2`, fatura **12'de sabit** (çift faturalama yok) |
| K7 | sahte bağ | antrenör paneli `state.read().randevular`ı basıyor; 4+2 sabit satır kaldırıldı | panelde **2 gerçek randevu**; boş durumda dürüst boş durum |
| K8 | sahte bağ | `FIT_FATURA.ekle()` açıldı; `startSub` ve `randevuAl` oraya yazıyor; gerçek satır "· senin kaydın" etiketiyle ayrılıyor | defter 10→11; 3 yenileme sonrası **11→11→11** (kalıcı, tekrarlamıyor) |
| K9 | yarım eylem | üye tarafına İptal/Ertele, antrenör tarafına Onayla/Ertele/Tamamlandı/Gelmedi — hepsi `randevuDurum(i,d)` çağırıyor | `durum` **"onay-bekliyor" → "onaylandi"** ve → **"iptal"** |
| K10 | sahte bağ | `fit-su.js` de kabuktan enjekte ediliyor (`_suYukle`), `fit-rozet.js` için R15/6'da yapılanın aynısı | `rozetlerim-v1`de `FIT_SU` **object** (eskiden undefined) |
| K11 | sahte bağ | `antrenmanTamamla` içinde `durum='tamamlandi'` anında arşivleme; çift sayımı `arsivlendi` bayrağı önlüyor | 3/3 bitir → arşiv **1**, `bitenProgram` **1** (eskiden 0) |
| K12 | sahte bağ | dinlenme günleri arşiv kaydıyla taşınıyor (`_arsivKaydi`), rozet motoru aktif + arşiv topluyor, tarihe göre tekilleştiriyor | program değişti → dinlenme **2 → 3** (eskiden 1 → 0) |
| K13 | ölü veri | `bugun.tarih` eklendi, sıfırlama **okuma anında**; ayrıca kayıt kendi `tarihISO`suna bakıyor — geriye dönük kayıt bugüne yazmıyor | 9 gün önce 40dk + 3 gün önce 30dk + bugün 20dk → ekran **"20 dk"** (eskiden 90) |
| K14 | ölü veri | `gecmis[].tarih` sabiti söküldü, eski kayıtlardan da siliniyor; `FIT_SHELL.tarihEtiket(iso)` tek biçimleyici | etiketler **"Bugün" · "3 gün önce" · "21 Ağustos 2026"**; `tarih` alanı taşıyan **0**; "undefined" basan **0** |
| K15 | karşılıksız vaat | tohum `hafta:[62,74,90,96,118,142]` söküldü; `haftalik(n)` `tarihISO`dan türetiyor; `veriVar` yanlışsa boş durum | boş depoda `veriVar:false`, toplam **0 dk**; kayıt sonrası gerçek haftalara dağılıyor |
| K16 | yarım eylem | "Faydalı" (6) gerçek sayaç (`dm_fit_faydali_v1`, aç/kapa, kalıcı) · kapak/avatar gerçek `<input type=file>` + önizleme + dürüst şerit · "Mesaj" (4) **kaldırıldı** — `fit-mesaj.js` yalnız üye→antrenör yönünü destekliyor, bağlamak yanlış kişiyle sohbet açardı | JS karşılığı olmayan düğme **0**; 18 → 19 → yenile → **19** |
| K17 | yarım eylem | **kök neden**: form demo değerlerle DOLU geliyordu (Ad="Selin"…), yani "boş" submit aslında geçerli bir formdu. 9 zorunlu alanın varsayılanları söküldü | boş → başarı **0**, `dm_user` **null**; yarım → **0**/null; tam → **1** + `durum:'beklemede'` |
| K18 | yarım eylem | `reklam-ver` gerçek doğrulama + dürüst şerit; `giris-v1` kayıt artık `?auth=1` çıkışına gidiyor | boş reklam formu başarı **0**; kayıt sonrası `body.is-auth` **true** |
| K19 | yarım eylem | 10 gösterim anahtarı `dm_fit_izin_v1`e yazıyor ve geri okunuyor; gerçek olan 3 `data-fit-pref` anahtarına **dokunulmadı** | 10/10 anahtar yazıyor; kapat → yenile → **kapalı** |
| K20 | ölü veri | `suEkle`/`suSifirla` söküldü (`bugun.su` yalnız `fit-su.js` göçü için duruyor); `programArsivle` K11'e, `randevuDurum` K9'a bağlandı | `suEkle`/`suSifirla` → **undefined** |
| K21 | yarım eylem | talep `dm_fit_destek_v1`e yazılıyor, hem liste hem detay oradan da okuyor; dürüstlük şeridi **korundu** | 11 → 12 satır; yenile → **12** (çift kayıt yok); tıkla → detay açılıyor, "Talep bulunamadı" **0** |
| K22 | ölü veri | **kod değişikliği gerekmedi** — `6e0b51d` commit'i bu belgeden önce kapatmış, belge bayattı | `bin-tekrar` işaret düğmesi **0** + "hareketi aç" bağlantısı; `hareket-aliskanligi`nde düğme **1** (doğru) |

**Kabuk katmanı** (`fit-shell.js` · `fit-rozet.js`) yalnız lead tarafından yazıldı;
sayfa tarafı dört ajana bölündü (dosya kümeleri ayrık tutuldu).
**Çapraz denetim bir yalan yakaladı:** K17 "kapandı" diye raporlanmıştı, bağımsız
sonda boş formda hâlâ rol yazıldığını ölçtü ve kalem geri açıldı.

**Kapanış kapıları:** `kabuk-r18-nobet` **100/100 sayfa · konsol 0 · taşma 0 ·
footer var** · `admin-denetim` ölü bağlantı **0**.

---

> Tahmin yok. Her bulgunun altındaki sayı ya `grep`/`python` sayımıdır ya da
> tarayıcıda koşan bir sondanın çıktısıdır. Ölçülemeyen şey "ölçülmedi" yazar.

---

## Önce: ölçülüp TEMİZ çıkanlar

Bunlar aranıp bulunamayan kusurlardır; bir daha aranmasın diye yazıldı.

| Ne arandı | Ölçüm | Sonuç |
|---|---|---|
| Erişilemez sayfa (girişi 0 olan) | 75 sayfanın bağlantı grafiği çıkarıldı | **0** |
| `href="#"` boş bağlantı | tüm depo | **1** (`programlarim-v1.html`, çapa hedefi gerçek) |
| Kırık sayfa-arası derin bağlantı (`sayfa.html#sekme`) | 129 bağlantı, 19 benzersiz hedef, tarayıcıda tek tek açıldı | **0 kırık** — hepsi doğru sekmeyi/alt sekmeyi seçiyor |
| localStorage anahtarı: yazan 0 / okuyan 0 | 17 anahtar | anahtar düzeyinde **0** (kusur ALAN düzeyinde, bkz. K2 · K13 · K14 · K20) |
| `dm_fit_sound` · `dm_fit_vibe` · `dm_fit_motion` | `data-fit-pref` ile yazılıyor, `FIT_SHELL.pref()` ile okunuyor | **bağ gerçek** |
| Randevu → sohbet yüzeyi | randevu yazıldı, `mesajlarim-v1.html` sohbet sayısı 0 → 1 | **bağ gerçek** |

⚠ Derin bağlantı sondası ilk turda **19/19 kırık** dedi (`getElementById` ile
bakmıştı); sekmeler DOM'da id taşımıyor, hash'i JS çözüyor. Sonda kördü, kod
doğruydu — `docs/lessons.md`'deki "sonda körlüğü" dersinin aynısı.

---

## Bulgular

### K1 · Hesabım'daki altı form "Kaydedildi" yazıyor, hiçbir şey kaydetmiyor
**Sınıf:** yarım eylem
**Nerede:** `hesabim-v1.html:726` · `:845` · `:907` · `:1032` · `:1072` · `:1157`
(formlar) — ortak işleyici `hesabim-v1.html:1865-1873`
**Ölçüm:** 6 `form[data-savecard]`. `submit` işleyicisi `e.preventDefault()` yapıp
`.hs-saved` rozetini 2.5 saniye gösteriyor; **0 `localStorage` yazması, 0 API
çağrısı.** Etkilenen kartlar: Profil Bilgilerim · Profil Görünürlüğü · Bildirim
Tercihlerim · Güvenlik · İki Adımlı Doğrulama · Dil ve Bölge.
**Etki:** Kullanıcı adını değiştirip "Değişiklikleri Kaydet"e basar, yeşil tikli
**"Kaydedildi"** yazısını görür, sayfayı yeniler — eski değer geri gelir. Ekran
yalan söylüyor; destek talebindeki en ucuz kusur türü budur.
**Öneri:** Ya alanlar `dm_user`/yeni bir `dm_fit_hesap_v1` anahtarına yazılsın, ya
da rozet metni maket dürüstlüğüne çevrilsin (destek formundaki "gönderilmedi —
bu ekran maket" deseni zaten depoda var).

---

### K2 · "Aboneliği Başlat" başarı ekranı açıyor, abonelik açmıyor
**Sınıf:** yarım eylem
**Nerede:** `pro-odeme-v1.html:736-757` (tıklama işleyicisi) · `:725-729`
(`durumGoster`)
**Ölçüm:** Tarayıcıda ölçüldü — kart alanları ve onay kutusu geçildikten sonra
`body.pay-done` **true** oluyor, `dm_user` değeri **değişmiyor**
(`{"auth":true,"roles":["kullanici"],"verified":false,"level":0}` aynen kalıyor).
Depoda `dm_user.paket` alanını **yazan 0 yer**, **okuyan 2 yer** var
(`assets/js/fit-shell.js:1617`, `hesabim-v1.html:2106`).
**Etki:** Kullanıcı Pro'ya abone olur, "Aboneliğin başladı" ekranını görür; profil
ve hesap sayfalarındaki paket rozeti **hâlâ "Ücretsiz"** der. Fatura da düşmez
(bkz. K8).
**Öneri:** `startSub` en azından `dm_user.paket='pro'` yazsın — okuyan iki yüzey
zaten hazır bekliyor.

---

### K3 · 50 rozetin 9'u hiçbir yoldan kazanılamaz (4.170 puanın 950'si)
**Sınıf:** karşılıksız vaat
**Nerede:** `assets/js/fit-rozet.js:171-175` (km/adım ailesi) · `:187` `:191`
`:195` `:199` (`olcut:null` taşıyanlar)
**Ölçüm:** Katalogda **50 rozet**, toplam **4.170 puan**.
· **5 rozet** `olcut:'km'`/`'adim'` (km-10 · km-100 · km-500 · adim-100k ·
adim-1m — **725 puan**). `fit-rozet.js:255-258` bu ikisini yalnız
`kaynak==='olculdu'|'cihaz'` kayıtlarındaki `metrik.km`/`metrik.adim`'dan sayıyor.
Depoda `metrik.km` yazan **0**, `metrik.adim` yazan **0**, `kaynak:'cihaz'` yazan
**0** çağıran var (ölçüldü). `metrik` yazan tek yer `egzersiz-detay-v1.html:1533`
ve o `{tekrar,set,kg,dk}` yazıyor.
· **4 rozet** `olcut:null` (test-ilk · test-3 · antrenor-bilgi · antrenor-tam —
**225 puan**). Kataloğun kendi şerhi bunu söylüyor: Fit testi sonucu bilerek
saklanmıyor (`fit-testi-detay-v1.html:865` — sağlık verisi kararı), antrenörle
paylaşılan bilgi formu için hiçbir `dm_fit_*` anahtarı yok.
**Etki:** Rozetlerim ekranında dokuz kart ömür boyu "%0 · yolda" durur. `su-ilk`
gibi hemen düşen rozetlerin yanında bunlar sistemin bozuk olduğunu düşündürür.
**Öneri:** km/adım ailesi bir cihaz köprüsü doğana kadar `olcut:null`+`kaynakNot`
kalıbına geçsin (ekran o kalıbı zaten dürüstçe basıyor); test rozetleri ya
kalksın ya sağlık verisi olmayan bir "test çözüldü" sayacına bağlansın.

---

### K4 · "Kaydettiklerim"in altı süzgecinden dördü hiç dolmaz
**Sınıf:** karşılıksız vaat
**Nerede:** `egzersizlerim-v1.html:885-894` (çipler) · `assets/js/fit-kayit.js:50-57`
(tür sözlüğü) · `fit-kayit.js:203` (`[data-kaydet]` sözleşmesi)
**Ölçüm:** `FIT_KAYIT` **6 tür** tanımlıyor (hareket · program · rehber ·
challenge · antrenor · test) ve ekranda **6 süzgeç çipi** var. Depoda
`data-kaydet` düğmesi **34 tane**: `egzersiz-kutuphane-v1.html` **25**
(tür=hareket), `program-liste-v1.html` **9** (tür=program). Diğer **4 tür için 0
düğme** — `hareket-*` rehber sayfalarında, `challenge-v1.html`de,
`antrenor-detay-v1.html`de ve `fit-testleri-v1.html`de kaydet düğmesi yok.
**Etki:** "Rehber", "Challenge", "Fit Test", "Antrenör" çiplerine basan kullanıcı
her seferinde "Bu süzgeçle kayıt yok" görür ve kendi kaydını kaybettiğini sanır.
**Öneri:** Ya dört çip düğme gelene kadar basılmasın, ya dört detay sayfasına
`data-kaydet` düğmesi eklensin (motor hazır, sözleşme tek satır).

---

### K5 · Bağlı uygulamalar izin veriyor, cihazdan hiçbir veri gelmiyor
**Sınıf:** karşılıksız vaat
**Nerede:** `bagli-uygulamalar-v1.html` (1.087 satır, 4 uygulama kartı,
`data-perm` anahtarlı izin anahtarları) · durum kaydı `:871-874`
**Ölçüm:** Sayfa bağlantı durumunu ve izinleri gerçekten saklıyor
(`FIT_SHELL.state.read().baglantilar`). Ama izinlerin vaat ettiği verinin
depoya giren karşılığı **0**: `kaynak:'cihaz'` yazan **0** çağıran,
`metrik.adim` yazan **0**, `metrik.km` yazan **0**.
Sayfa 8 yerden `egzersizlerim-v1.html#aktivite`ye yolluyor; oradaki "Aktivite
Kayıtlarım" listesi ise **sabit bir tohum dizisi**
(`egzersizlerim-v1.html:2996-3002`, 6 kayıt, `kaynak:'saat'|'telefon'|'manuel'`)
ve **hiçbir `localStorage` yazması yok** — yenilemede kullanıcının eklediği
kayıt kaybolur.
**Etki:** "Akıllı saatini bağla, adımların Fit'e aksın" denen akışın sonunda
adım rozeti 0, defter tohum veriyle dolu, kullanıcının eklediği kayıt uçuyor.
**Öneri:** Aktivite kayıtları `dm_fit.gecmis`e `kaynak:'cihaz'` + `metrik` ile
yazılsın; o tek değişiklik hem K3'ün km/adım ailesini hem bu sayfayı açar.

---

### K6 · Randevu alınıyor, ödeme adımı yok, paket hakkı düşmüyor
**Sınıf:** karşılıksız vaat
**Nerede:** `antrenor-detay-v1.html:835` `:849` `:863` (üç hizmet kartı, üçü de
"Randevu") · `:1247` (`randevuAl`) · `odemelerim-v1.html:1167-1174` (`PAKETLER`)
**Ölçüm:** "Aylık Paket" (₺1.600) dâhil üç hizmetin üçü de aynı randevu modalini
açıyor; modalde **ödeme adımı yok** (`antrenor-detay-v1.html` içinde kart/ödeme
alanı **0**). Randevu `{antrenor,slug,hizmet,fiyat,tarih,saat,durum}` olarak
`dm_fit.randevular`a yazılıyor — **`fiyat` alanını okuyan 0 yer** var.
`odemelerim-v1.html`deki "Seans paketleri" kartı `kalan:2` / `kalan:5` gösteriyor;
bu iki sayıyı **düşüren 0 kod** var.
**Etki:** CLAUDE.md K4 kararı ("üye üreticiden hizmet satın alır") böyle diyor; makette satın alma
bedava ve sonsuz. Paket hakkı 2'de donmuş kalıyor.
**Öneri:** Ücretli hizmetler için randevu onayı `pro-odeme-v1.html` kalıbında bir
ödeme adımına bağlansın; `randevuAl` paket hakkından düşsün.

---

### K7 · Üyenin aldığı randevu antrenörün paneline hiç ulaşmıyor
**Sınıf:** sahte bağ
**Nerede:** `antrenor-detay-v1.html:1247` (yazan) · `antrenor-panelim-v1.html:427-500`
(gösteren)
**Ölçüm:** `dm_fit.randevular`ı **okuyan 3 yer** var:
`egzersizlerim-v1.html:2508`, `destek-v1.html:1666+`, `assets/js/fit-mesaj.js`.
`antrenor-panelim-v1.html` **listede yok** — "Yaklaşan randevular" kartındaki 4
satır ile "Geçmiş randevular" kartındaki 2 satır **tamamen sabit HTML**.
**Etki:** Üye randevu alır, kendi ekranında görür, antrenörün panelinde hiç
görünmez. (Sayfanın kendi şerhi bunu kabul ediyor: `antrenor-panelim-v1.html:485`
"onaylama ve erteleme bu turda çizilmedi".)
**Öneri:** Panel `FIT_SHELL.state.read().randevular`ı okusun; onay düğmesi
K9 ile birlikte açılsın.

---

### K8 · Randevu ve abonelik hiçbir faturaya dönüşmüyor
**Sınıf:** sahte bağ
**Nerede:** `assets/js/fit-fatura.js:43` (`DEFTER`) · `odemelerim-v1.html:1162`
(`SEANSLAR`) · `:1167` (`PAKETLER`) · `:1176` (`GECMIS`)
**Ölçüm:** Tarayıcıda ölçüldü: randevu yazıldıktan sonra `FIT_FATURA.defter`
**10 satır** (değişmedi), `odemelerim-v1.html`de yeni randevunun tarihi
**yok**. Dört dizi de koda gömülü sabit; `dm_fit_fatura_v1` anahtarına yalnız
**alıcı künyesi** yazılıyor (`odemelerim-v1.html:1637`), fatura satırı değil.
**Etki:** "Belgeleri Faturalar sekmesinde bulursun" cümlesinin karşılığı yok;
kullanıcının kendi harcaması defterde görünmüyor.
**Öneri:** `FIT_FATURA`ya `ekle()` açılsın; `randevuAl` ve `startSub` oraya
yazsın. Defter zaten kuruş tamsayısı ve KDV ayrıştırmasıyla doğru kurulmuş.

---

### K9 · Randevu ömür boyu "Onay bekliyor" kalıyor
**Sınıf:** yarım eylem
**Nerede:** `assets/js/fit-shell.js:3146` (`randevuDurum`) · yazan tek yer
`antrenor-detay-v1.html:1247`
**Ölçüm:** `randevuDurum(i,d)` API'sinin **çağıranı 0**. `randevuAl` `durum`
parametresini destekliyor ama tek çağıran onu **geçmiyor** → her randevu
`'onay-bekliyor'` doğuyor ve orada kalıyor. Ölçüldü:
`[{…,"durum":"onay-bekliyor"}]`. Sistemde tanımlı 6 durum
(`onay-bekliyor · onaylandi · tamamlandi · iptal · ertelendi · gelmedi`) ve bunların
etiket/rozet sözlükleri (`randevuEtiket` 3 çağıran, `randevuRozet` 2 çağıran) var —
yani **beş durumu gösterecek kod hazır, o duruma sokacak kod yok**.
**Etki:** Üye "Onaylandı", "Tamamlandı" ya da "İptal" hâlini hiçbir zaman göremez;
geçmiş randevu kavramı hiç doğmaz.
**Öneri:** İptal/erteleme düğmeleri üye tarafına (`egzersizlerim#antrenorum`),
onay düğmesi antrenör paneline bağlansın — ikisi de `randevuDurum`u çağırır.

---

### K10 · Rozetlerim sayfası su modülünü yüklemiyor: aynı rozet iki sayfada iki farklı sayı
**Sınıf:** sahte bağ
**Nerede:** `rozetlerim-v1.html:415-421` (script satırları) · `assets/js/fit-rozet.js:300`
(`FIT_SU` yoksa `{suGun:0,suSeri:0}`)
**Ölçüm:** Tarayıcıda ölçüldü.
· `egzersizlerim-v1.html` → `window.FIT_SU` **true**, su rozetleri `simdi:1`
· `rozetlerim-v1.html` → `window.FIT_SU` **false**, aynı rozetler `simdi:0`,
  `oran:0` (mühürlenmiş `su-ilk` bile "%100 kazanıldı · şimdi 0" diyor)
`fit-rozet.js` ve `fit-mesaj.js` kabuktan **her sayfaya** enjekte ediliyor
(`fit-shell.js:1289-1323`); `fit-su.js` enjekte **edilmiyor** ve yalnız **4
sayfada** script satırı var (`admin-bildirim` · `challenge` · `egzersizlerim` ·
`programlarim`). Rozet motorunu kullanan **12 sayfanın 9'unda** su ölçüsü kör.
**Etki:** Su hedefini tutan kullanıcı, rozet koleksiyonunun asıl sayfasında
ilerlemesini **0** görür. Mühür kalıcı olduğu için "kazanıldı ama %0" gibi
kendisiyle çelişen bir kart çıkar.
**Öneri:** `fit-su.js` de `_modulYukle` ile kabuktan enjekte edilsin —
`fit-rozet.js` için zaten aynı sebeple (aynı yorumda yazılı) yapılmış.

---

### K11 · Programı bitirmek "İlk Program" rozetini vermiyor; rozet bir sonraki programa başlayınca düşüyor
**Sınıf:** sahte bağ
**Nerede:** `assets/js/fit-shell.js:3043-3045` (biten>=toplam → durum='tamamlandi')
· `fit-shell.js:2873` (`programArsivle`) · `assets/js/fit-rozet.js:279`
(`bitenProgram` yalnız `arsiv`den sayılıyor)
**Ölçüm:** Tarayıcıda ölçüldü — 3 seanslık program başlatıldı, 3 seans
tamamlandı:
`{programDurum:"tamamlandi", biten:3, arsivUzunluk:0, bitenProgram:0,
program-ilk: durum:"yolda", simdi:0}`.
Sonra **başka bir program** başlatıldı: `bitenProgram:1` oldu.
`programArsivle()` API'sinin **çağıranı 0**; arşive yazan tek yol
`programBasla`nın içindeki otomatik arşivleme.
**Etki:** Kullanıcı programı bitirir, kutlama ekranını görür, rozet gelmez.
Haftalar sonra alakasız bir program başlattığında "İlk Program" bildirimi düşer.
**Öneri:** `antrenmanTamamla` içinde `durum='tamamlandi'` olduğu anda
`programArsivle()` çağrılsın (arşiv şeması zaten `durum` alanını taşıyor).

---

### K12 · Dinlenme rozetinin ölçüsü yeni programda sıfırlanıyor
**Sınıf:** sahte bağ
**Nerede:** `assets/js/fit-rozet.js:281` (`dinlenme = s.program.dinlenmeler.length`)
**Ölçüm:** Tarayıcıda ölçüldü — bir dinlenme günü eklendi (`dinlenme:1`), sonra
yeni program başlatıldı: **`dinlenme:0`**. Ölçü yalnız **aktif programın**
`dinlenmeler[]` dizisinden okunuyor; arşive geçen program dinlenme günlerini
birlikte götürüyor (`programArsivle` `dinlenmeler`i arşiv kaydına **yazmıyor**).
**Etki:** `dinlenme-5` rozeti ("Beş günü planlı dinlenmeye ayır") ancak **tek bir
program içinde** 5 dinlenme günü olan kullanıcıya düşer; program değiştiren
kullanıcının sayacı geri gider.
**Öneri:** Dinlenme günleri kümülatif sayılsın (arşiv kaydına taşınsın ya da
`gecmis` benzeri tarihli bir kümede tutulsun).

---

### K13 · Enerji Defteri'ndeki "bugün" sayıları hiç sıfırlanmıyor
**Sınıf:** ölü veri
**Nerede:** `assets/js/fit-shell.js:2818` (`bugun:{dk,kcal,tamam,su,gunSonu}`) ·
`:3025` (`s.bugun.dk += …`) · gösteren `programlarim-v1.html:1932-1933`
**Ölçüm:** Tarayıcıda ölçüldü — 9 gün önce (40 dk), 3 gün önce (30 dk) ve bugün
(20 dk) tarihli üç kayıt yazıldı. Sonuç: **`bugun.dk = 90`**, ekranda
**"90 dk bugün hareket"** yazıyor. Doğrusu 20.
`bugun` nesnesinin **5 alanı** var (`dk · kcal · tamam · su · gunSonu`) ve
**tarih alanı yok**; depoda gün dönümünde sıfırlayan **0 kod** var.
`bugun.gunSonu` da tek yuvalı: dünkü gün sonu notu bugün de "bugünün notu"
olarak okunuyor (`programlarim-v1.html:2111`).
**Etki:** İlk günden sonra Enerji Defteri'nin bütün "bugün" rakamları ömür boyu
toplamdır. Aynı depodaki `fit-su.js` bunu doğru yapıyor
(`gunler:{'YYYY-MM-DD':…}`) — kabuk tek geride kalan.
**Öneri:** `bugun`a `tarih:'YYYY-MM-DD'` eklensin; `read()` göçünde tarih
bugünden farklıysa `bugun` sıfırlansın (`gunSonu` dâhil).

---

### K14 · Her geçmiş kaydının tarihi harfi harfine "bugün"
**Sınıf:** ölü veri
**Nerede:** `assets/js/fit-shell.js:3034` (`tarih:'bugün'` sabiti) · gösteren
`egzersizlerim-v1.html:2257` · `programlarim-v1.html:3874`
**Ölçüm:** Üç kayıt (9 gün önce · 3 gün önce · bugün) yazıldı,
`gecmis[].tarih` alanı: **`["bugün","bugün","bugün"]`**. Gerçek tarih ayrı bir
alanda (`tarihISO`) doğru duruyor ve rozet motoru onu kullanıyor; **ekrana basılan
alan yanlış olanı.**
**Etki:** Enerji Defteri listesi ve Aktivite Kayıtlarım'da her satır "bugün"
diyor; kullanıcı ne zaman ne yaptığını okuyamıyor.
**Öneri:** `tarih` alanı silinsin, ekranlar `tarihISO`yu biçimlesin (kod
`programlarim-v1.html:3861`de bu serbest metnin sorun olduğunu zaten yazmış).

---

### K15 · Haftalık grafiğin 6 çubuğundan 5'i uydurma
**Sınıf:** karşılıksız vaat
**Nerede:** `assets/js/fit-shell.js:2819` (`hafta:[62,74,90,96,118,142]`) ·
`:3042` (yalnız son eleman artıyor) · gösteren `programlarim-v1.html:4175`
**Ölçüm:** Boş depoda bile `hafta` dizisi 6 sabit değerle doğuyor.
`antrenmanTamamla` **yalnız son elemanı** artırıyor
(`s.hafta[s.hafta.length-1] += dk`); ölçüldü: 90 dk kayıt sonrası dizi
`[62,74,90,96,118,232]`. Diğer **5 değeri yazan 0 kod**, hafta kaydırması yapan
**0 kod** var.
**Etki:** "Bu haftanın ritmi" grafiği hiç antrenman yapmamış kullanıcıya bile
beş haftalık düzenli bir geçmiş gösteriyor. Depodaki kanıt kademesi
disiplininin (uydurma sayı yazma) tam tersi.
**Öneri:** Dizi boş doğsun ve `tarihISO`dan haftalık toplanarak türetilsin; veri
yoksa grafik "henüz yeterli kayıt yok" desin.

---

### K16 · Profil sayfasında 12 düğme hiçbir şey yapmıyor
**Sınıf:** yarım eylem
**Nerede:** `profil-v1.html:1922` (Kapağı Değiştir) · `:1927` (fotoğraf değiştir)
· `:2461` `:2468` `:2475` `:2482` (danışan satırlarında "Mesaj") · `:3017`
`:3030` `:3043` `:3194` `:3207` `:3220` ("Faydalı")
**Ölçüm:** Bu düğmelerin id'si, `data-*` niteliği ve sınıf adı hiçbir JS
dosyasında (16 modül + sayfa içi script) geçmiyor:
`hz-cancel` **6 geçiş (hepsi HTML)**, `rev-help` **15 geçiş (hepsi HTML/CSS)**,
`pf-cover-edit` **3**, `pf-ava-edit` **5** — JS'te **0**.
Aynı sayfadaki `data-follow-cta` ve `data-hz-book` düğmeleri **bağlı**
(`profil-v1.html:3696` · `:3712`), yani kusur seçici.
**Etki:** "Faydalı" düğmesine basan kullanıcı hiçbir tepki almaz; yorumun
"18 değerlendirme faydalı buldu" sayısı da değişmez.
**Öneri:** Ya `aria-disabled` + tek satır gerekçe (antrenör panelindeki desen),
ya sayacı localStorage'da tutan üç satırlık bir işleyici.

---

### K17 · Antrenör başvurusu: boş form kabul ediliyor, rol verilmiyor
**Sınıf:** yarım eylem
**Nerede:** `antrenor-ol-v1.html:733-738` (submit) · `:491` (Fotoğrafı Değiştir)
· `:555` (Sertifikanı Yükle) · `:556` (Kaldır)
**Ölçüm:** Form `novalidate`; submit işleyicisi **hiçbir alanı denetlemiyor**,
doğrudan formu gizleyip başarı kutusunu açıyor. Sayfada `localStorage` geçişi
**0**, `dm_user` geçişi **0** → başvuru sonrası kullanıcı **antrenör rolü
almıyor** (rol yalnız `?role=antrenor` URL parametresiyle veriliyor,
`fit-shell.js:2143`). Üç yükleme düğmesinin (`up-mini` **3 geçiş**, `up-zone`
**6 geçiş**, `.x`) JS karşılığı **0**.
**Etki:** Kullanıcı boş bir formu gönderip "Başvurun alındı" görür; sonra
`antrenor-panelim-v1.html`e girmeye çalışırsa rolü olmadığı için giremez.
Sertifika yükleme düğmesi tıklanır ama dosya seçici açılmaz.
**Öneri:** En azından zorunlu alan denetimi + başarıda `dm_user.roles`a
`'antrenor'` eklenmesi (`beklemede` bayrağıyla).

---

### K18 · Reklam formu ve kayıt formu da doğrulamasız başarı gösteriyor
**Sınıf:** yarım eylem
**Nerede:** `reklam-ver-v1.html:1484-1489` · `giris-v1.html:1174-1182`
**Ölçüm:**
· `reklam-ver-v1.html`: `rvForm` için **submit işleyicisi yok**; gönder düğmesi
`e.preventDefault()` yapıp `showSuccess()` çağırıyor. **0 doğrulama, 0 kayıt.**
· `giris-v1.html`: kayıt formu doğrulamayı geçiyor (`validate(fKayit)`) ama
başarıda yalnız bir kutu açıyor — **oturum açılmıyor, `dm_user` yazılmıyor.**
Giriş formu ise doğru çalışıyor (`?auth=1` ile yönlendiriyor,
`giris-v1.html:1156-1162`).
**Etki:** "Ücretsiz hesap oluştur" akışının sonunda kullanıcı hâlâ misafirdir ve
bunu anlamak için giriş formuna dönmesi gerekir.
**Öneri:** Kayıt başarısı `?auth=1`e yönlendirsin (giriş formuyla aynı çıkış).

---

### K19 · Veri ve İzinler sayfasındaki anahtarların çoğu hiçbir şey saklamıyor
**Sınıf:** yarım eylem
**Nerede:** `fit-planim-veri-izin-v1.html:264-266`
**Ölçüm:** Sayfadaki `.fp-sw` anahtarları ikiye ayrılıyor. `data-fit-pref`
taşıyan **3 tanesi** gerçekten yazıyor (`dm_fit_sound` · `dm_fit_vibe` ·
`dm_fit_motion` — bunlar `FIT_SHELL.pref()` ile okunuyor, **bağ gerçek**).
`:not([data-fit-pref])` olan geri kalanı için kodun kendi yorumu: *"gösterim
amaçlı anahtarlar (izinler, bildirimler) — kayıt tutmaz"*; işleyici yalnız
`aria-checked` boyuyor.
**Etki:** Veri izinlerini kapatan kullanıcı sayfayı yenileyince hepsini açık
bulur — hem de mahremiyet ekranında.
**Öneri:** İzinler `dm_fit_izin_v1` gibi tek bir anahtara yazılsın; yazılamıyorsa
ekranda "bu turda saklanmıyor" satırı dursun (destek formundaki dürüst şerit
deseni).

---

### K20 · Ölü API yüzeyi: çağıranı 0 olan 4 fonksiyon, okuyanı 0 olan 1 alan
**Sınıf:** ölü veri
**Nerede:** `assets/js/fit-shell.js:2964` (`suEkle`) · `:2965` (`suSifirla`) ·
`:2873` (`programArsivle`) · `:3146` (`randevuDurum`)
**Ölçüm:** Depo genelinde çağıran sayıları:
`suEkle` **0** (tek geçiş `programlarim-v1.html:1944`, o da bir yorum satırı) ·
`suSifirla` **0** · `programArsivle` **0** · `randevuDurum` **0**.
`dm_fit.bugun.su` alanını **yazan 0**, okuyan **1** yer var — o da
`fit-su.js`in bir defalık göç okuması. R18'de su tek kaynağa (`dm_fit_su_v1`)
taşınmış, kabuk tarafı geride kalmış.
**Etki:** Doğrudan kullanıcıya değil; ama bir sonraki geliştirici `suEkle`yi
çağırırsa **iki ayrı su deposu** doğar — bu depoda üç kez temizlenmiş
"aynı soruya iki cevap" kusurunun tekrarı.
**Öneri:** `suEkle`/`suSifirla`/`bugun.su` sökülsün (göç kodu okumaya devam
edebilir); `programArsivle` ve `randevuDurum` K11 ve K9 ile bağlansın.

---

### K21 · Destek talebi oluşturuluyor, açıldığında "Talep bulunamadı" diyor
**Sınıf:** yarım eylem
**Nerede:** `destek-v1.html:1721-1790` (yeni satırı DOM'a ekliyor) ·
`destek-talebi-detay-v1.html:1117` (`?talep=` çözümü)
**Ölçüm:** Yeni talep satırı `list.insertBefore` ile **yalnız DOM'a** ekleniyor;
`localStorage` yazması **0** → sayfa yenilenince kaybolur. Satırın `href`i
`destek-talebi-detay-v1.html?talep=<yeni-no>`; detay sayfası **6 sabit talep**
tanıyor, tanımayanı doğru biçimde "Talep bulunamadı" ile karşılıyor.
**Etki:** Kullanıcı talebini gönderir, listede görür, tıklar — talep yok.
**Hafifletici:** Form başarı kutusu bunu açıkça söylüyor: *"Talebin
**gönderilmedi** — bu ekran maket, arkasında sunucu yok."* Kusur dürüstçe
etiketlenmiş; yine de tıklanabilir bir satır üretiyor.
**Öneri:** Yeni satır tıklanamaz (`<div>`) basılsın ya da talep
`dm_fit_destek_v1` benzeri bir anahtara yazılıp detay sayfası oradan da okusun.

---

### K22 · Challenge motoru metrik alabiliyor, hiçbir sayfa metrik göndermiyor
**Sınıf:** ölü veri
**Nerede:** `assets/js/fit-challenge.js:385` (`isaretle(slug, ek)`) ·
çağıranlar `challenge-v1.html:1401` `:1405` · `challengelarim-v1.html:308`
**Ölçüm:** `isaretle`nin **3 çağıranının hiçbiri `ek` parametresini
geçmiyor** → motorun `antrenmanTamamla`ya yazdığı kayıt her seferinde
`metrik:null`, `dk:null`, `kcal:null`, `kaynak:'beyan'` oluyor
(`fit-challenge.js:392-400`). Sayısal hedefli challenge (`bin-tekrar`,
"21 günde 1.000 tekrar") **beyanı elediği için** challenge ekranından
işaretlemekle ilerlemiyor; yalnız `egzersiz-detay-v1.html`in set sayacından
ilerliyor.
**Etki:** Challenge sayfasındaki "Bugünü işaretle" düğmesi süreli hedefli
challenge'ta sayacı **hiç** kıpırdatmıyor. Motor bunu `elenenBeyan` sayacıyla
gösterebiliyor ama düğmenin kendisi sözünü tutmuyor gibi görünüyor.
**Öneri:** Süreli hedefli challenge'ta günlük işaret düğmesi yerine "hareketi aç"
bağlantısı basılsın (seri tipinde zaten öyle yapılıyor,
`challenge-v1.html:1259`).

---

## Özet tablosu

| Sınıf | Bulgu | Numaralar |
|---|---:|---|
| **yarım eylem** | 8 | K1 · K2 · K9 · K16 · K17 · K18 · K19 · K21 |
| **karşılıksız vaat** | 5 | K3 · K4 · K5 · K6 · K15 |
| **sahte bağ** | 5 | K7 · K8 · K10 · K11 · K12 |
| **ölü veri** | 4 | K13 · K14 · K20 · K22 |
| **Toplam** | **22** | |

### En ağır beş

1. **K13** — "bugün" rakamları hiç sıfırlanmıyor; ölçüldü: 3 farklı güne yazılan
   90 dakikanın tamamı "90 dk bugün hareket" olarak basılıyor.
2. **K1** — Hesabım'daki 6 form yeşil tikle "Kaydedildi" diyor, 0 yazma yapıyor.
3. **K3** — 50 rozetin 9'u (4.170 puanın 950'si) hiçbir yoldan kazanılamıyor.
4. **K10** — Rozetlerim sayfası `fit-su.js`i yüklemiyor; aynı su rozeti iki
   sayfada iki farklı ilerleme gösteriyor (1 ↔ 0).
5. **K11** — Programı bitirmek "İlk Program" rozetini vermiyor; rozet ancak
   başka bir programa başlayınca düşüyor.

### Bir cümlelik desen

Kopuklukların üçte ikisi tek bir yerden geliyor: **bir eylemin sonucunu yazacak
alan var, yazan çağrı yok.** `randevuDurum` · `programArsivle` · `dm_user.paket` ·
`metrik.km` · `dm_fit_kayit_v1`in dört türü — beşinde de okuyan taraf hazır,
yazan taraf hiç doğmamış.
