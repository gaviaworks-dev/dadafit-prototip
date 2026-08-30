/* =====================================================================
   FIT_ADMIN_ANTRENOR — antrenör başvuru kuyruğunun TEK veri kaynağı (R20)
   ---------------------------------------------------------------------
   NEDEN AYRI DOSYA — ÖLÇÜLEN KUSUR (Beyar, R20): "İncele" liste
   ekranıyla AYNI sayfada gizli bir kartı açıyordu. Fit'te bu başvuru
   incelemesinin Gastro'da doğrudan karşılığı yok (fit-admin-plan.md §10:
   "Gastro'da şef ayrı kalem değil, üye detayının sekmesi"); en yakın
   Gastro deseni zengin kayıt için ölçülen `show` sayfalarıdır (kullanıcı,
   tarif, abonelik, fatura — hepsi AYRI sayfa). Başvuru künyesi 14 alan +
   belge listesi + karar geçmişi taşıyor — modalin 2-4 alan eşiğinin çok
   üstünde — bu yüzden AYRI SAYFA seçildi, Gastro'nun genel "zengin kayıt
   → ayrı sayfa" kuralına göre.

   Ayrı bir detay sayfası (`admin-antrenor-basvuru-v1.html`) kurulunca
   dizi iki dosyada yaşamasın diye buraya taşındı.
   ===================================================================== */
(function () {
  'use strict';

  var INCELEYEN = ['Yasin Yavuz', 'Deniz Korkmaz', 'Ela Bozkurt'];

  var DURUM = {
    'bekleyen':   { ad:'Bekliyor',            rz:'wait', ico:'fa-hourglass-half' },
    'ek-belge':   { ad:'Ek belge bekleniyor', rz:'wait', ico:'fa-file-circle-question' },
    'onaylanan':  { ad:'Onaylandı',           rz:'ok',   ico:'fa-circle-check' },
    'reddedilen': { ad:'Reddedildi',          rz:'stop', ico:'fa-circle-xmark' }
  };

  var BASVURU = [
    { id:'b-2041', ad:'Naz Erdem', durum:'bekleyen', tarih:'2026-08-28',
      unvan:'Evde antrenman ve başlangıç', sehir:'Bursa', ilce:'Nilüfer',
      mail:'naz.erdem@eposta.com', tel:'0(536) 442 10 63', kul:'@nazerdem',
      uzmanlik:'Evde antrenman · Yeni başlayan · Kilo yönetimi', calisma:'Online',
      deneyim:3, kurum:'Türkiye Fitness Federasyonu · Antrenörlük 1. Kademe',
      studyo:'—', inceleyen:'',
      bio:'Ekipmansız, evde yapılabilen programlarla yeni başlayanları hareketle tanıştırıyorum. Altı yıldır grup dersi veriyorum, iki yıldır birebir çalışıyorum.',
      sosyal:'instagram.com/nazerdem.fit',
      belge:[['antrenorluk-sertifikasi.pdf','Sertifika','2026-08-28','İncelenecek'],
             ['ilk-yardim-belgesi.pdf','Ek belge','2026-08-28','İncelenecek']],
      gecmis:[['2026-08-28','Başvuru alındı','Naz Erdem']] },

    { id:'b-2039', ad:'Onur Kılıç', durum:'bekleyen', tarih:'2026-08-27',
      unvan:'Kuvvet ve kondisyon', sehir:'Ankara', ilce:'Çankaya',
      mail:'onur.kilic@eposta.com', tel:'0(543) 771 09 22', kul:'@onurkilic',
      uzmanlik:'Kuvvet · Kondisyon · Sporcu performansı', calisma:'Online ve yüz yüze',
      deneyim:5, kurum:'ACSM · Certified Personal Trainer',
      studyo:'Kavaklıdere Performans Merkezi', inceleyen:'',
      bio:'Beş yıldır kuvvet ve kondisyon çalışıyorum. Programlarım periyotlanmış, ölçüme dayalı ve haftalık geri bildirimle ilerliyor.',
      sosyal:'—',
      belge:[['acsm-cpt-sertifika.pdf','Sertifika','2026-08-27','İncelenecek']],
      gecmis:[['2026-08-27','Başvuru alındı','Onur Kılıç']] },

    { id:'b-2036', ad:'Pelin Yalçın', durum:'bekleyen', tarih:'2026-08-25',
      unvan:'Pilates ve mobilite', sehir:'İstanbul', ilce:'Kadıköy',
      mail:'pelin.yalcin@eposta.com', tel:'0(532) 908 14 77', kul:'@pelinyalcin',
      uzmanlik:'Pilates · Mobilite · Postür', calisma:'Yüz yüze',
      deneyim:7, kurum:'Pilates Mat ve Reformer sertifikası',
      studyo:'Moda Pilates Stüdyo', inceleyen:'Deniz Korkmaz',
      bio:'Yedi yıldır mat ve reformer pilates çalışıyorum. Masa başı çalışanlarda postür ve bel-boyun ağrısına odaklanıyorum.',
      sosyal:'instagram.com/pelinyalcin.pilates',
      belge:[['pilates-mat-sertifika.pdf','Sertifika','2026-08-25','İncelenecek'],
             ['reformer-sertifika.jpg','Sertifika','2026-08-25','İncelenecek'],
             ['studyo-belgesi.pdf','Ek belge','2026-08-25','İncelenecek']],
      gecmis:[['2026-08-26','İnceleyene atandı · Deniz Korkmaz','Yasin Yavuz'],
              ['2026-08-25','Başvuru alındı','Pelin Yalçın']] },

    { id:'b-2018', ad:'Serkan Aydoğdu', durum:'ek-belge', tarih:'2026-08-19',
      unvan:'Salon ve kondisyon', sehir:'İzmir', ilce:'Karşıyaka',
      mail:'serkan.aydogdu@eposta.com', tel:'0(535) 226 88 41', kul:'@serkanaydogdu',
      uzmanlik:'Salon antrenmanı · Kondisyon', calisma:'Yüz yüze',
      deneyim:2, kurum:'—', studyo:'Karşıyaka Spor Salonu', inceleyen:'Yasin Yavuz',
      bio:'İki yıldır salonda birebir çalışıyorum. Yeni başlayanları ekipmanla tanıştırmaya ve doğru forma odaklanıyorum.',
      sosyal:'—',
      belge:[['sertifika-foto.jpg','Sertifika','2026-08-19','Okunmuyor']],
      gecmis:[['2026-08-21','Ek belge istendi · sertifika fotoğrafı okunmuyor','Yasin Yavuz'],
              ['2026-08-20','İnceleyene atandı · Yasin Yavuz','Yasin Yavuz'],
              ['2026-08-19','Başvuru alındı','Serkan Aydoğdu']] },

    { id:'b-2011', ad:'Tuğba Er', durum:'ek-belge', tarih:'2026-08-16',
      unvan:'Yoga ve esneklik', sehir:'Antalya', ilce:'Muratpaşa',
      mail:'tugba.er@eposta.com', tel:'0(541) 330 62 05', kul:'@tugbaer',
      uzmanlik:'Yoga · Esneklik · Nefes', calisma:'Online ve yüz yüze',
      deneyim:4, kurum:'Yoga Alliance · RYT 200', studyo:'Lara Yoga',
      inceleyen:'Ela Bozkurt',
      bio:'Dört yıldır yoga eğitmenliği yapıyorum. Esneklik ve nefes çalışmasını hareket programının içine yerleştiriyorum.',
      sosyal:'instagram.com/tugbaer.yoga',
      belge:[['ryt200-sertifika.pdf','Sertifika','2026-08-16','Süresi geçmiş'],
             ['kimlik-on.jpg','Kimlik','2026-08-16','Onaylandı']],
      gecmis:[['2026-08-18','Ek belge istendi · sertifika tarihi güncellenmeli','Ela Bozkurt'],
              ['2026-08-17','İnceleyene atandı · Ela Bozkurt','Yasin Yavuz'],
              ['2026-08-16','Başvuru alındı','Tuğba Er']] },

    { id:'b-1902', ad:'Merve Tan', durum:'onaylanan', tarih:'2026-06-04',
      unvan:'Güç, kondisyon ve kilo yönetimi', sehir:'İzmir', ilce:'Bornova',
      mail:'merve.tan@eposta.com', tel:'0(542) 903 77 14', kul:'@mervetan',
      uzmanlik:'Güç · Kondisyon · Kilo yönetimi', calisma:'Online',
      deneyim:6, kurum:'ACSM · Certified Personal Trainer', studyo:'—',
      inceleyen:'Yasin Yavuz',
      bio:'Altı yıldır güç ve kondisyon çalışıyorum; kilo yönetiminde hareketi beslenmeden ayırmadan planlıyorum.',
      sosyal:'instagram.com/mervetan.fit',
      belge:[['acsm-cpt-sertifika.pdf','Sertifika','2026-06-04','Onaylandı']],
      gecmis:[['2026-06-09','Onaylandı · dizine alındı','Yasin Yavuz'],
              ['2026-06-05','İnceleyene atandı · Yasin Yavuz','Yasin Yavuz'],
              ['2026-06-04','Başvuru alındı','Merve Tan']] },

    { id:'b-1840', ad:'Selin Aksoy', durum:'onaylanan', tarih:'2026-04-28',
      unvan:'Egzersiz ve spor bilimleri uzmanı', sehir:'İstanbul', ilce:'Beşiktaş',
      mail:'selin.aksoy@eposta.com', tel:'0(532) 214 88 09', kul:'@selinaksoyfit',
      uzmanlik:'Kilo yönetimi · Mobilite · Yeni başlayan', calisma:'Online',
      deneyim:6, kurum:'ACSM · Pilates Mat sertifikası', studyo:'—',
      inceleyen:'Yasin Yavuz',
      bio:'Egzersiz ve spor bilimleri mezunuyum. Kilo yönetimi ve mobilite alanında altı yıldır birebir çalışıyorum.',
      sosyal:'instagram.com/selinaksoy.fit',
      belge:[['antrenorluk-sertifikasi.pdf','Sertifika','2026-04-28','Onaylandı']],
      gecmis:[['2026-05-02','Onaylandı · dizine alındı','Yasin Yavuz'],
              ['2026-04-29','İnceleyene atandı · Yasin Yavuz','Yasin Yavuz'],
              ['2026-04-28','Başvuru alındı','Selin Aksoy']] },

    { id:'b-1798', ad:'Burak Demir', durum:'onaylanan', tarih:'2026-04-12',
      unvan:'Kuvvet ve kondisyon antrenörü', sehir:'Ankara', ilce:'Çankaya',
      mail:'burak.demir@eposta.com', tel:'0(533) 118 45 20', kul:'@burakdemir',
      uzmanlik:'Kuvvet · Kondisyon', calisma:'Online ve yüz yüze',
      deneyim:8, kurum:'NSCA · CSCS', studyo:'Ankara Kuvvet Merkezi',
      inceleyen:'Deniz Korkmaz',
      bio:'Sekiz yıldır kuvvet ve kondisyon antrenörlüğü yapıyorum. Kayıt tutmayan programı program saymam.',
      sosyal:'—',
      belge:[['nsca-cscs-sertifika.pdf','Sertifika','2026-04-12','Onaylandı']],
      gecmis:[['2026-04-18','Onaylandı · dizine alındı','Deniz Korkmaz'],
              ['2026-04-13','İnceleyene atandı · Deniz Korkmaz','Yasin Yavuz'],
              ['2026-04-12','Başvuru alındı','Burak Demir']] },

    { id:'b-1702', ad:'Zeynep Arı', durum:'onaylanan', tarih:'2026-02-27',
      unvan:'Koşu, dayanıklılık ve başlangıç', sehir:'İzmir', ilce:'Alsancak',
      mail:'zeynep.ari@eposta.com', tel:'0(538) 447 20 96', kul:'@zeynepari',
      uzmanlik:'Koşu · Dayanıklılık · Yeni başlayan', calisma:'Online',
      deneyim:5, kurum:'Atletizm Federasyonu · Koşu antrenörlüğü', studyo:'—',
      inceleyen:'Ela Bozkurt',
      bio:'Beş yıldır koşu ve dayanıklılık çalışıyorum. İlk 5 km hedefiyle gelen herkese ayrı plan yazıyorum.',
      sosyal:'instagram.com/zeynepari.kosu',
      belge:[['kosu-antrenorlugu.pdf','Sertifika','2026-02-27','Onaylandı']],
      gecmis:[['2026-03-05','Onaylandı · dizine alındı','Ela Bozkurt'],
              ['2026-02-28','İnceleyene atandı · Ela Bozkurt','Yasin Yavuz'],
              ['2026-02-27','Başvuru alındı','Zeynep Arı']] }
  ];

  function bul(id){ for (var i=0;i<BASVURU.length;i++) if (BASVURU[i].id===id) return BASVURU[i]; return null; }
  function bas2(x){ return String(x).trim().split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join('').toLocaleUpperCase('tr'); }

  window.FIT_ADMIN_ANTRENOR = {
    INCELEYEN: INCELEYEN, DURUM: DURUM, BASVURU: BASVURU, bul: bul, bas2: bas2
  };
})();
