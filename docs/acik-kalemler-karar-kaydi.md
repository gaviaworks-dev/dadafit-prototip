# Açık kalemler · karar kaydının kendisiyle ilgili iki iş

**Tur:** 2026-08-31, fatura adresi + rozet köşesi turunun yan bulguları
**Durum:** ikisi de AÇIK · bu turda **bilerek düzeltilmedi**, ayrı kalem
**Kim açtı:** Commit C hazırlanırken K6'yı doğrulamak için karar kaydı okundu;
çelişki oradan çıktı.

Bu belge kod kusuru değil, **karar kaydının kusurunu** yazıyor. İkisi de tek
başına bir dosya değiştirmeyi değil, Beyar'ın bir karar vermesini gerektiriyor.

---

## A1 · Gastro'daki K6 bayat — Fit'te abonelik kararının iki kopyası zıt

### Ölçüm

`CLAUDE.md`, dört marka hesap mimarisi kararlarının gerekçesinin **bu depoda
değil**, Gastro'nun `docs/hesap-mimarisi/08-kararlar.md` dosyasında olduğunu
söylüyor. O dosya okundu (salt okuma, **dokunulmadı**):

| Kaynak | K6 ne diyor | Damga |
|---|---|---|
| `CLAUDE.md:98` (bu depo) | **"Fit'te abonelik VARDIR."** Eski hâli *"abonelik YOKTUR; maketteki abonelik blokları sökülür"* idi ve Beyar bu turda geri aldı. | 🔴 GÜNCELLENDİ · **2026-08-30 (R16/2)** |
| `…/dadagastro/docs/hesap-mimarisi/08-kararlar.md:173` | **"K6 · FİT ABONELİK MAKETİ SÖKÜLECEK — … Fit'te abonelik yoktur.** Yerine antrenör hizmet paketi satın alma ekranı gelir." | belge başlığı **2026-08-25**, dosyanın son commit'i `78d17ef4` · **2026-08-26** |

Yani karar **2026-08-30'da bu depoda geri alındı, kaynak dosyaya hiç
yazılmadı.** Gastro kopyasında ne bir güncelleme notu, ne "R16", ne "geri
alındı" ifadesi var (arandı, sıfır eşleşme).

### Neden önemli

`CLAUDE.md:108` (K10) sözleşmenin dört depoda **birebir aynı** olmasını ve
"değiştiren, dördünü birden değiştirir ve sürüm damgasını yükseltir" kuralını
koyuyor. K6 bu kuralın delindiği ilk ölçülmüş yer. Gastro kopyasını okuyan biri
bugün Fit'te abonelik olmadığı sonucuna varır ve şu üç yüzeyin sökülmesi
gerektiğini düşünür — oysa üçü de bilerek duruyor:
`pro-v1.html` · `pro-odeme-v1.html` · `assets/js/fit-fatura.js`'in
`tur:"uyelik"` faturaları.

### Beyar kararı (2026-08-31)

**(a) geçerli — 30 Ağustos tarihli `CLAUDE.md` günceldir, Fit'te abonelik
vardır.** Gastro'daki kopya bayattır ve **bu turda ona dokunulmadı.**

### Yapılacak

- [ ] Gastro deposunda `docs/hesap-mimarisi/08-kararlar.md` K6 bloğu
      2026-08-30 hâline güncellensin (geri alma notu + gerekçe).
- [ ] Aynı güncelleme Diet ve Gourmet kopyalarına da taşınsın (K10).
- [ ] `docs/hesap-sozlesmesi.md` sürüm damgası yükseltilsin.

**Kapsam uyarısı:** bu iş **başka depolarda** yapılır; bu depoda karşılığı yok.

---

## A2 · Kod içindeki K-numaraları hangi seriye ait olduğunu yazmıyor

### Ölçüm

Depoda **dört ayrı K-serisi** dolaşıyor ve numaraları çakışıyor:

| Seri | Nerede | K6 orada ne | K8 orada ne |
|---|---|---|---|
| Dört marka hesap mimarisi | `CLAUDE.md:98` · `106` | Fit aboneliği | Destek (Diet pilot) |
| Bu deponun ürün kararları | `KARARLAR.md:124` · `173` | Kalan 13 boş `href="#"` | Header'ın katı durumu tam opak |
| Spec kopuklukları | `docs/fit-spec-kopukluklari.md:174` · `:207` | Randevu alınıyor, ödeme adımı yok | Randevu ve abonelik faturaya dönüşmüyor |
| Gastro karar kaydı (dış depo) | `…/08-kararlar.md:173` | Fit abonelik maketi sökülecek | — |

Kod bu serileri **ayırt etmeden** atıf yapıyor:

| Satır | Yazdığı | Gerçekte kastettiği |
|---|---|---|
| `pro-odeme-v1.html:933` | `/* K8 — abonelik faturaya düşer */` | **spec kopukluk K8** |
| `pro-odeme-v1.html:623` | `<!-- … K8: abonelik burada faturaya düşer -->` | **spec kopukluk K8** |
| `antrenor-detay-v1.html:1129` | `<!-- … K8: randevu/paket ödemesi burada faturaya düşer -->` | **spec kopukluk K8** |
| `odemelerim-v1.html:1098` | `/* K8 · örnek defter satırlarının yanında … */` | **spec kopukluk K8** |

`CLAUDE.md`'yi okuyup koda bakan biri bu satırlarda **"Destek"** kararına atıf
görür. Bu turda Commit C hazırlanırken tam olarak bu oldu: "K6 fatura kaydını
gerektiriyor mu" sorusunun cevabı üç ayrı belgede aranmak zorunda kaldı.

### Yapılacak

- [ ] Atıf biçimi kararlaştırılsın; öneri: seri ön eki —
      `HM-K6` (hesap mimarisi) · `KR-K6` (KARARLAR.md) · `SK-K8` (spec kopukluk).
- [ ] Karar verildikten sonra mevcut atıflar tek turda dönüştürülsün.

**Bu turda BİLEREK düzeltilmedi** (Beyar: *"Bunu da not düş, düzeltme, ayrı
kalem."*). Ön ek biçimi kararlaşmadan atıfları değiştirmek, ikinci bir
uydurma seri üretmek olurdu.
