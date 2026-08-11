# DadaFit — arayüz prototipi

DadaMutfak ekosisteminin hareket ve antrenman modülü **DadaFit**'in public arayüz
prototipi. Tarayıcıda gezilmek üzere hazırlanmıştır.

## Bu nedir

- **Bir arayüz prototipidir.** Tasarım ve akış incelemesi için hazırlanmıştır; bitmiş
  bir ürün değildir.
- **Veriler örnektir.** Sayfalarda görünen kullanıcılar, antrenörler, programlar,
  ölçümler, fiyatlar ve istatistikler temsilîdir; gerçek veri değildir.
- **Arka uç yoktur.** Statik HTML, CSS ve JavaScript'ten oluşur. Formlar kayıt
  göndermez; durum bilgisi yalnız tarayıcının kendi belleğinde tutulur.
- **Arama motorlarına kapalıdır.** Tüm sayfalar `noindex, nofollow` etiketi taşır.

## Nasıl gezilir

Kök dizindeki `index.html` sayfası bütün ekranların listesini verir.

| | |
|---|---|
| Başlangıç | `dadafit-hub-v1.html` |
| Üye görünümü | adrese `?auth=1` ekleyin |
| Ziyaretçi görünümü | adrese `?auth=0` ekleyin |

Görünüm tercihi tarayıcıda saklanır: bir kez `?auth=1` açıldıysa diğer sayfalar da üye
görünür; ziyaretçiye dönmek için bir kez `?auth=0` çağırmak gerekir.

## Kapsam

Pakette DadaFit'in public sayfaları ve bunların bağlandığı ortak sayfalar (giriş,
hesap, bildirimler, rozetler, Pro, yasal metinler, hakkımızda, S.S.S., iletişim)
bulunur. DadaFit dışına giden bağlar — diğer Dada dünyaları, portal ve yönetim
panelleri — mevcut referans siteye yönlendirilir.

## Yerelde çalıştırma

```bash
python3 -m http.server 8080
# → http://127.0.0.1:8080/
```
