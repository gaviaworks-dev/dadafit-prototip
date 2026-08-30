/* =====================================================================
   FIT_ADMIN_DESTEK — destek kuyruğunun TEK veri kaynağı   (R20)
   ---------------------------------------------------------------------
   NEDEN AYRI DOSYA — ÖLÇÜLEN KUSUR (Beyar, R20): "Aç" liste ekranıyla
   AYNI sayfada gizli bir kartı açıyordu. Gastro'da bu eylemin karşılığı
   ölçüldü: `admin.destek.talep` — AYRI sayfa, AYRI rota
   (`resources/views/admin/destek/talep.blade.php`). Ayrı bir detay
   sayfası (`admin-destek-talep-v1.html`) kurulunca dizi iki dosyada
   yaşamasın diye buraya taşındı.

   K8 KANONU DEĞİŞMEDİ: dört durum (açık · yanıt bekleyen · çözülen ·
   kapatılan), sırası ve yönü sabit — yalnız verinin YAŞADIĞI dosya
   değişti.
   ===================================================================== */
(function () {
  'use strict';

  var DURUM = [
    { id:'acik',           ad:'Açık talep',     ico:'fa-inbox',        rozet:'wait',
      yon:'Ekipten yanıt bekliyor. Bu kuyruk sıfırlanmadan gün kapanmaz.' },
    { id:'yanit-bekleyen', ad:'Yanıt bekleyen', ico:'fa-reply',        rozet:'wait',
      yon:'Ekip yazdı, top üyede. Yanıt gelmezse hatırlatma gider.' },
    { id:'cozulen',        ad:'Çözülen',        ico:'fa-circle-check', rozet:'ok',
      yon:'Sorun giderildi, talep kapanışa hazır. Üye yeniden yazarsa açığa döner.' },
    { id:'kapatilan',      ad:'Kapatılan',      ico:'fa-lock',         rozet:'off',
      yon:'Kapatılan talebe yeni yanıt yazılmaz; yazışma kayıtta okunur kalır.' }
  ];
  function durumBul(id){ for (var i=0;i<DURUM.length;i++) if (DURUM[i].id===id) return DURUM[i]; return DURUM[0]; }

  var TEMSILCI = ['Atanmadı', 'Ece Demir', 'Barış Yıldırım', 'Nur Aslan'];

  var TALEP = [
    { no:'DF-2026-B4TXN2', durum:'acik',           uye:'Elif Şahin', mail:'elif.sahin@eposta.com',    konu:'Aktivite ve cihaz bağlantıları',
      baslik:'Apple Health adım verisi iki gündür aktarılmıyor', son:'2026-08-11', mesaj:3, atanan:'Ece Demir' },
    { no:'DF-2026-T6NGX4', durum:'acik',           uye:'Kaan Erdem', mail:'kaan.erdem@eposta.com',    konu:'Uygulama hatası',
      baslik:'Challenge rozetim tamamlandığı hâlde düşmedi', son:'2026-07-23', mesaj:3, atanan:'Atanmadı' },
    { no:'DF-2026-QW3JZ8', durum:'yanit-bekleyen', uye:'Zeynep Aydın', mail:'zeynep.aydin@eposta.com',  konu:'Programlar ve planım',
      baslik:'Programını Bul sonucundaki program planıma eklenmedi', son:'2026-07-29', mesaj:3, atanan:'Barış Yıldırım' },
    { no:'DF-2026-M2VYP7', durum:'yanit-bekleyen', uye:'Burak Toprak', mail:'burak.toprak@eposta.com',  konu:'Aktivite ve cihaz bağlantıları',
      baslik:'Antrenman geçmişimde iki günlük boşluk görünüyor', son:'2026-07-27', mesaj:3, atanan:'Ece Demir' },
    { no:'DF-2026-A8RUC3', durum:'yanit-bekleyen', uye:'Merve Çelik', mail:'merve.celik@eposta.com',   konu:'Antrenör ve randevu',
      baslik:'Antrenör randevumu ertelemek istiyorum', son:'2026-07-21', mesaj:3, atanan:'Nur Aslan' },
    { no:'DF-2026-K7WQ9M', durum:'cozulen',        uye:'Onur Kılıç', mail:'onur.kilic@eposta.com',    konu:'DadaFit Pro ve ödeme',
      baslik:'Pro üyeliğim yenilendi ama paket ücretsize düştü', son:'2026-08-14', mesaj:3, atanan:'Barış Yıldırım' },
    { no:'DF-2026-U2FZR8', durum:'cozulen',        uye:'İpek Yalçın', mail:'ipek.yalcin@eposta.com',   konu:'Uygulama hatası',
      baslik:'Enerji defterinde su takibi her gün sıfırlanıyor', son:'2026-06-26', mesaj:3, atanan:'Ece Demir' },
    { no:'DF-2026-Z4KMD9', durum:'kapatilan',      uye:'Tolga Demirci', mail:'tolga.demirci@eposta.com', konu:'Üyelik ve fatura',
      baslik:'Fatura adresimi güncellemek istiyorum', son:'2026-07-22', mesaj:3, atanan:'Nur Aslan' },
    { no:'DF-2026-P7XBW2', durum:'kapatilan',      uye:'Ayşe Korkmaz', mail:'ayse.korkmaz@eposta.com',  konu:'Antrenör ve randevu',
      baslik:'Antrenör randevum takvimde iki kez göründü', son:'2026-07-17', mesaj:3, atanan:'Nur Aslan' },
    { no:'DF-2026-E3QHT6', durum:'kapatilan',      uye:'Cem Uysal', mail:'cem.uysal@eposta.com',     konu:'Hesap ve giriş',
      baslik:'Bildirim tercihlerim her girişte sıfırlanıyor', son:'2026-07-10', mesaj:3, atanan:'Barış Yıldırım' },
    { no:'DF-2026-N9GVJ4', durum:'kapatilan',      uye:'Deniz Arda', mail:'deniz.arda@eposta.com',    konu:'Uygulama hatası',
      baslik:'Egzersiz kütüphanesinde ekipman süzgeci boş sonuç döndürüyor', son:'2026-07-03', mesaj:3, atanan:'Ece Demir' }
  ];

  var BUGUN = new Date('2026-08-30T00:00:00');
  function gunFarki(iso){
    return Math.max(0, Math.round((BUGUN - new Date(iso + 'T00:00:00')) / 86400000));
  }
  function basHarf(x){
    return String(x || '').trim().split(/\s+/).slice(0, 2)
      .map(function (p) { return p.charAt(0); }).join('').toLocaleUpperCase('tr');
  }
  function bul(no){ for (var i=0;i<TALEP.length;i++) if (TALEP[i].no===no) return TALEP[i]; return null; }
  function sayi(id){ return TALEP.filter(function(t){ return t.durum===id; }).length; }

  window.FIT_ADMIN_DESTEK = {
    DURUM: DURUM, TALEP: TALEP, TEMSILCI: TEMSILCI,
    durumBul: durumBul, gunFarki: gunFarki, basHarf: basHarf, bul: bul, sayi: sayi
  };
})();
