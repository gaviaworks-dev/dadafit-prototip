# TODO — yer tutucular

Bu turda (**12 eksik kalem** işi · 2026-08-26) çizilen ekranlarda bırakılan
**yer tutucu** içeriklerin kaydı. Kural üçlüsü: metin **Türkçe**, işaretlemede
**`data-placeholder`** niteliği, ve **bu dosyada bir satır**.

🔴 **LOREM IPSUM YOK.** Aşağıdaki yedi kalemin hepsi anlamlı Türkçe metindir;
hiçbiri anlamsız dolgu değildir. Gerçek içerik gelince metin değişir, nitelik
ve bu satır silinir.

⚠ **SÖZLEŞME ÇAKIŞMASI — lead'e bildirildi, tek başıma birleştirmedim.**
Bu depoda **zaten** bir yer tutucu sözleşmesi var: `docs/icerik-bekleyen.md`,
niteliği **`data-yer-tutucu`**, anahtarı slug. Bu turun görev metni ise
**`data-placeholder` + `todo.md`** istedi. İkisini birleştirmek bir karardır
ve bende değil; görev metnine uydum, çakışmayı raporladım. `icerik-bekleyen.md`
bu dosyaya işaret eden bir satır taşıyor, iki liste birbirini kaybetmesin.

| # | slug | Dosya · satır | Bugün ne yazıyor | Gerçek içerik ne olacak |
|---|---|---|---|---|
| 1 | `fatura-satici-kunyesi` | `fatura-detay-v1.html:163` | "DadaFit — ticari unvan, adres, vergi dairesi ve vergi numarası satışa açılmadan önce yazılacak." | DadaFit'in **ticari unvanı · açık adresi · vergi dairesi · vergi kimlik numarası**. Satışa açılmadan (BILLING_SALES_OPEN) önce **zorunlu**; faturada yasal olarak bulunması gerekir. |
| 2 | `veri-listesi-sayilari` | `fit-planim-veri-izin-v1.html:136` | Sekiz veri grubu, örnek kayıt sayıları ve ilk kayıt tarihleriyle | Üyenin **gerçek** kayıt sayıları ve ilk kayıt tarihleri. Grup adları ve saklama süreleri gerçektir, yalnız **sayılar** yer tutucudur. |
| 3 | `sifre-sifirlama-hesabi` | `giris-v1.html:786` | `e***@eposta.com` | Sıfırlama bağlantısının açıldığı hesabın **maskeli** e-posta adresi. Tam adres basılmaz — bağlantıyı ele geçiren biri hesabı öğrenmemeli. |
| 4 | `dogrulama-hesabi` | `giris-v1.html:845` | `elif.sahin@eposta.com` | Doğrulama bağlantısının gönderildiği adres. Burada **tam** basılır: kullanıcı kendi kutusuna bakacağı için maskelenmez. |
| 5 | `2fa-kurulum-anahtari` | `hesabim-v1.html:1807` | `JBSW Y3DP EHPK 3PXP` | Doğrulayıcı uygulamaya girilecek **TOTP kurulum anahtarı**. Her kullanıcıya özel üretilir ve **yalnız kurulum sırasında bir kez** gösterilir. ⚠ Bu değer bir sırdır; kayda, günlüğe ve ekran görüntüsüne girmemeli. |
| 6 | `2fa-kurtarma-kodlari` | `hesabim-v1.html:1826` | Liste boş doğar; JS on kod üretir (karışan karakterler ayıklı) | Sunucuda üretilmiş, **hash'lenerek saklanan** on tek kullanımlık kod. Üretim biçimi (karışan karakterlerin ayıklanması) korunmalı — destek talep numarasıyla aynı ilke. |
| 7 | `islem-kaydi-satirlari` | `veri-islem-kaydi-v1.html:140` | On beş örnek erişim kaydı (sen · antrenörün · bağlı uygulamalar · yönetim) | Üyenin **gerçek** erişim kaydı. Dört erişim türü, süzgeç ve "satırlar silinmez" kuralı gerçektir; yalnız **satırların kendisi** yer tutucudur. |

## Nasıl kapatılır

1. Gerçek içerik gelince metni değiştir.
2. `data-placeholder` niteliğini **sil**.
3. Bu tablodan satırı **sil**.
4. Satır kalmazsa bu dosyayı sil.
