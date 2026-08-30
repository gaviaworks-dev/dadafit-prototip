/* =====================================================================
   FIT_ADMIN_ABONELIK — abonelik listesinin TEK veri kaynağı   (R20)
   ---------------------------------------------------------------------
   NEDEN AYRI DOSYA — ÖLÇÜLEN KUSUR (Beyar, R20): "Görüntüle" liste
   ekranıyla AYNI sayfada gizli bir kartı açıyordu. Ayrı bir detay
   sayfası (`admin-abonelik-detay-v1.html`) kurulunca dizi iki dosyada
   yaşamasın diye buraya taşındı — `fit-admin-uye-veri.js`in deseninin
   aynısı: "kayıt iki yerde yaşamaz" (o dosyanın kendi şerhi).

   VERİ ÖRNEK. Adlar `admin-uyeler-v1.html`in üye listesinden ve
   `fit-fatura.js`in personasından alındı; uydurulan tek şey abonelik
   satırlarının kendisi (bkz. admin-abonelikler-v1.html kaynak şeridi).
   ===================================================================== */
(function () {
  'use strict';

  var DURUM = {
    aktif:     { ad:'Aktif',                    rz:'ok',   ico:'fa-circle-check' },
    donemsonu: { ad:'Dönem sonunda bitecek',    rz:'wait', ico:'fa-hourglass-half' },
    iptal:     { ad:'İptal edilmiş',            rz:'off',  ico:'fa-circle-minus' },
    basarisiz: { ad:'Ödemesi başarısız',        rz:'stop', ico:'fa-triangle-exclamation' }
  };

  var LISTE = [
    { no:'ABN-2026-0412', uye:'Elif Şahin',      mail:'elif@ornek.com',              plan:'pro', durum:'aktif',
      basla:'2026-02-15', yenile:'2026-09-15', kart:'Visa •••• 4242', marka:'fa-brands fa-cc-visa',
      gecmis:[['2026-08-15','Dönem yenilendi · DFT-2026-004128','Otomatik tahsilat'],
              ['2026-07-15','Dönem yenilendi · DFT-2026-003844','Otomatik tahsilat'],
              ['2026-02-20','Şubat dönemi iade edildi · DFT-2026-002995','Cayma hakkı'],
              ['2026-02-15','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0388', uye:'Ahmet Yıldırım',  mail:'ahmet.yildirim@eposta.com',   plan:'pro', durum:'aktif',
      basla:'2026-01-08', yenile:'2026-09-08', kart:'Mastercard •••• 8871', marka:'fa-brands fa-cc-mastercard',
      gecmis:[['2026-08-08','Dönem yenilendi','Otomatik tahsilat'],
              ['2026-01-08','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0355', uye:'Gizem Polat',     mail:'gizem.polat@eposta.com',      plan:'pro', durum:'aktif',
      basla:'2025-11-22', yenile:'2026-09-22', kart:'Visa •••• 1109', marka:'fa-brands fa-cc-visa',
      gecmis:[['2026-08-22','Dönem yenilendi','Otomatik tahsilat'],
              ['2025-11-22','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0341', uye:'İpek Doğan',      mail:'ipek.dogan@eposta.com',       plan:'pro', durum:'aktif',
      basla:'2025-09-30', yenile:'2026-09-30', kart:'Troy •••• 5520', marka:'fa-solid fa-credit-card',
      gecmis:[['2026-08-30','Dönem yenilendi','Otomatik tahsilat'],
              ['2025-09-30','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0402', uye:'Ceren Aktaş',     mail:'ceren.aktas@eposta.com',      plan:'pro', durum:'donemsonu',
      basla:'2026-03-05', yenile:'2026-09-05', kart:'Mastercard •••• 3390', marka:'fa-brands fa-cc-mastercard',
      gecmis:[['2026-08-26','İptal istendi · dönem sonunda bitecek','Üye'],
              ['2026-08-05','Dönem yenilendi','Otomatik tahsilat'],
              ['2026-03-05','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0377', uye:'Kerem Aslan',     mail:'kerem.aslan@eposta.com',      plan:'pro', durum:'donemsonu',
      basla:'2026-07-14', yenile:'2026-09-14', kart:'Visa •••• 7712', marka:'fa-brands fa-cc-visa',
      gecmis:[['2026-08-29','İptal istendi · dönem sonunda bitecek','Üye'],
              ['2026-07-14','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0298', uye:'Emre Şen',        mail:'emre.sen@eposta.com',         plan:'pro', durum:'basarisiz',
      basla:'2026-06-21', yenile:'2026-08-21', kart:'Visa •••• 6634', marka:'fa-brands fa-cc-visa',
      gecmis:[['2026-08-25','Üçüncü deneme başarısız · yetersiz bakiye','Ödeme sağlayıcı'],
              ['2026-08-23','İkinci deneme başarısız','Ödeme sağlayıcı'],
              ['2026-08-21','Yenileme tahsilatı başarısız','Ödeme sağlayıcı'],
              ['2026-06-21','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0267', uye:'Naz Erdem',       mail:'naz.erdem@eposta.com',        plan:'pro', durum:'basarisiz',
      basla:'2026-07-30', yenile:'2026-08-30', kart:'Mastercard •••• 2048', marka:'fa-brands fa-cc-mastercard',
      gecmis:[['2026-08-30','Yenileme tahsilatı başarısız · kart süresi dolmuş','Ödeme sağlayıcı'],
              ['2026-07-30','Abonelik başladı','Üye']] },
    { no:'ABN-2026-0181', uye:'Hakan Uçar',      mail:'hakan.ucar@eposta.com',       plan:'pro', durum:'iptal',
      basla:'2026-05-08', yenile:null, kart:'Visa •••• 9003', marka:'fa-brands fa-cc-visa',
      gecmis:[['2026-06-02','Abonelik bitti · hesap kullanıcı isteğiyle kapatıldı','Üye'],
              ['2026-05-30','İptal istendi','Üye'],
              ['2026-05-08','Abonelik başladı','Üye']] },
    { no:'ABN-2025-0904', uye:'Leyla Şimşek',    mail:'leyla.simsek@eposta.com',     plan:'pro', durum:'iptal',
      basla:'2025-12-11', yenile:null, kart:'Troy •••• 4417', marka:'fa-solid fa-credit-card',
      gecmis:[['2026-03-11','Abonelik bitti','Dönem sonu'],
              ['2026-02-28','İptal istendi','Üye'],
              ['2025-12-11','Abonelik başladı','Üye']] }
  ];

  function bul(no){
    for (var i = 0; i < LISTE.length; i++) if (LISTE[i].no === no) return LISTE[i];
    return null;
  }

  window.FIT_ADMIN_ABONELIK = { DURUM: DURUM, LISTE: LISTE, bul: bul };
})();
