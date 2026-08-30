/* =====================================================================
   DadaFit · YÖNETİM PANELİ — ÜYE VERİSİ   (R19)
   ---------------------------------------------------------------------
   NEDEN AYRI DOSYA
   Üye listesi (`admin-uyeler-v1.html`) ve üye detayı
   (`admin-uye-detay-v1.html`) AYNI kayıtları gösteriyor. Diziyi iki
   sayfaya kopyalasaydık, biri düzeltildiğinde öteki sessizce yalan
   söylerdi — bu depoda üç kez temizlenen "aynı soruya iki cevap"
   kusuru. Bu yüzden kayıtlar TEK yerde durur ve iki sayfa da onu okur.
   Kardeşleri: `fit-admin-veri.js` · `fit-medya-veri.js` · `fit-il-veri.js`.

   🔴 VERİ ÖRNEKTİR. Bu prototipte sunucu ve üye veritabanı yok. Aşağıdaki
   on dört kayıt makettir ve ekranlar bunu kaynak şeridinde söyler.

   🔴 UYDURULMAYAN İKİ ALAN — ölçülmüş kısıt:
   `dm_user` şeması `{auth, roles[], verified, level}`tır (fit-shell.js
   §profil kartı, ölçüldü). Şemada **üyelik tarihi** ve **paket** alanı
   YOKTUR; bu yüzden kayıtlarda o iki alan hiç tanımlanmadı ve ekranlarda
   "—" basılır. Örnek bir tarih yazmak, olmayan bir alanı varmış gibi
   göstermek olurdu.

   `puan` ve `gun` ÖRNEKTİR ama `kademe` ÖRNEK DEĞİL: kademe hiçbir
   kayda yazılmaz, `fit-rozet.js`in kuralıyla (iki barajı BİRLİKTE geçtiği
   en yüksek kademe) bu ikisinden TÜRETİLİR.

   ADLAR UYDURULMADI: antrenör rolündekiler sitedeki antrenör dizininin
   kendi adlarıdır — panel ile public yüzey aynı kişiyi iki farklı adla
   göstermesin diye.
   ===================================================================== */
(function (kok) {
  'use strict';

  /* Dört rol var çünkü Fit'te dördü de gerçekten ayrı bir yüzey görüyor:
     antrenör adayı başvuru kuyruğunda bekler (admin-antrenorler), antrenör
     hizmet satar (admin-hizmetler), yönetici bu paneli açar. */
  var ROL = {
    uye:      { ad:'Üye',            ico:'fa-user' },
    aday:     { ad:'Antrenör adayı', ico:'fa-user-clock' },
    antrenor: { ad:'Antrenör',       ico:'fa-user-check' },
    yonetici: { ad:'Yönetici',       ico:'fa-user-shield' }
  };

  /* ⚠ DURUM ROL DEĞİLDİR. `askida` / `kapali` bir yetki değil bir hesap
     hâlidir; tabloda ayrı kolonda, ayrı bileşenle (`.fp-badge`) durur. */
  var DURUM = {
    aktif:  { ad:'Aktif',      rz:'ok',   ico:'fa-circle-check' },
    askida: { ad:'Askıda',     rz:'wait', ico:'fa-pause' },
    kapali: { ad:'Kapatılmış', rz:'off',  ico:'fa-circle-minus' }
  };

  var UYELER = [
    { id:'u-1041', ad:'Selin Aksoy', mail:'selin.aksoy@eposta.com', kul:'@selinaksoyfit',
      rol:'antrenor', durum:'aktif', puan:3120, gun:402, sehir:'İstanbul', tel:'0(532) 214 88 09',
      alim:[],
      gecmis:[['2026-05-02','Antrenör başvurusu onaylandı','Yasin Yavuz'],
              ['2024-03-11','Hesap açıldı','Kayıt formu']] },

    { id:'u-1088', ad:'Burak Demir', mail:'burak.demir@eposta.com', kul:'@burakdemir',
      rol:'antrenor', durum:'aktif', puan:2410, gun:300, sehir:'Ankara', tel:'0(533) 118 45 20',
      alim:[],
      gecmis:[['2026-04-18','Antrenör başvurusu onaylandı','Yasin Yavuz'],
              ['2024-06-02','Hesap açıldı','Kayıt formu']] },

    { id:'u-1120', ad:'Merve Tan', mail:'merve.tan@eposta.com', kul:'@mervetan',
      rol:'antrenor', durum:'aktif', puan:1450, gun:120, sehir:'İzmir', tel:'0(542) 903 77 14',
      alim:[],
      gecmis:[['2026-06-09','Antrenör başvurusu onaylandı','Yasin Yavuz'],
              ['2025-01-19','Hesap açıldı','Kayıt formu']] },

    { id:'u-1207', ad:'Naz Erdem', mail:'naz.erdem@eposta.com', kul:'@nazerdem',
      rol:'aday', durum:'aktif', puan:210, gun:24, sehir:'Bursa', tel:'0(536) 442 10 63',
      alim:[['2026-08-12','Selin Aksoy','Tanışma Görüşmesi',0,'tamam']],
      gecmis:[['2026-08-28','Antrenör başvurusu alındı','Naz Erdem'],
              ['2026-07-30','Hesap açıldı','Kayıt formu']] },

    { id:'u-0912', ad:'Ahmet Yıldırım', mail:'ahmet.yildirim@eposta.com', kul:'@ahmety',
      rol:'uye', durum:'aktif', puan:680, gun:52, sehir:'İstanbul', tel:'0(505) 771 32 08',
      alim:[['2026-08-21','Burak Demir','Aylık Paket',160000,'tamam'],
            ['2026-07-19','Burak Demir','Birebir Seans',52000,'tamam']],
      gecmis:[['2026-08-21','Hizmet satın alındı · Aylık Paket','Ahmet Yıldırım'],
              ['2025-11-04','Hesap açıldı','Kayıt formu']] },

    { id:'u-0977', ad:'Ceren Aktaş', mail:'ceren.aktas@eposta.com', kul:'@cerenaktas',
      rol:'uye', durum:'aktif', puan:320, gun:26, sehir:'Antalya', tel:'0(537) 620 91 45',
      alim:[['2026-08-05','Merve Tan','Birebir Seans',46000,'tamam']],
      gecmis:[['2026-08-05','Hizmet satın alındı · Birebir Seans','Ceren Aktaş'],
              ['2026-02-14','Hesap açıldı','Kayıt formu']] },

    { id:'u-1015', ad:'Emre Şen', mail:'emre.sen@eposta.com', kul:'@emresen',
      rol:'uye', durum:'askida', puan:95, gun:6, sehir:'Kocaeli', tel:'0(544) 300 18 72',
      alim:[],
      gecmis:[['2026-08-14','Hesap askıya alındı · yorum kuralı ihlali','Yasin Yavuz'],
              ['2026-06-21','Hesap açıldı','Kayıt formu']] },

    { id:'u-0854', ad:'Gizem Polat', mail:'gizem.polat@eposta.com', kul:'@gizempolat',
      rol:'uye', durum:'aktif', puan:1980, gun:195, sehir:'İstanbul', tel:'0(539) 812 55 30',
      alim:[['2026-08-18','Selin Aksoy','Aylık Paket',160000,'tamam'],
            ['2026-06-11','Selin Aksoy','Aylık Paket',160000,'tamam'],
            ['2026-05-03','Selin Aksoy','Birebir Seans',45000,'iade']],
      gecmis:[['2026-08-18','Hizmet satın alındı · Aylık Paket','Gizem Polat'],
              ['2026-05-09','İade talebi açıldı','Gizem Polat'],
              ['2025-02-27','Hesap açıldı','Kayıt formu']] },

    { id:'u-1156', ad:'Hakan Uçar', mail:'hakan.ucar@eposta.com', kul:'@hakanucar',
      rol:'uye', durum:'kapali', puan:40, gun:3, sehir:'Adana', tel:'0(546) 271 04 19',
      alim:[],
      gecmis:[['2026-06-02','Hesap kullanıcı isteğiyle kapatıldı','Hakan Uçar'],
              ['2026-05-08','Hesap açıldı','Kayıt formu']] },

    { id:'u-0703', ad:'İpek Doğan', mail:'ipek.dogan@eposta.com', kul:'@ipekdogan',
      rol:'uye', durum:'aktif', puan:3850, gun:520, sehir:'İzmir', tel:'0(532) 664 27 81',
      alim:[['2026-08-02','Zeynep Arı','Aylık Paket',160000,'tamam'],
            ['2026-04-14','Zeynep Arı','Birebir Seans',41000,'tamam']],
      gecmis:[['2026-08-02','Hizmet satın alındı · Aylık Paket','İpek Doğan'],
              ['2023-09-15','Hesap açıldı','Kayıt formu']] },

    { id:'u-1183', ad:'Kerem Aslan', mail:'kerem.aslan@eposta.com', kul:'@keremaslan',
      rol:'uye', durum:'aktif', puan:130, gun:11, sehir:'Ankara', tel:'0(535) 108 63 27',
      alim:[['2026-08-24','Merve Tan','Tanışma Görüşmesi',0,'tamam']],
      gecmis:[['2026-08-24','Tanışma görüşmesi alındı','Kerem Aslan'],
              ['2026-07-12','Hesap açıldı','Kayıt formu']] },

    { id:'u-1231', ad:'Leyla Şimşek', mail:'leyla.simsek@eposta.com', kul:'@leylasimsek',
      rol:'uye', durum:'aktif', puan:0, gun:1, sehir:'Eskişehir', tel:'0(541) 559 76 02',
      alim:[],
      gecmis:[['2026-08-29','Hesap açıldı','Kayıt formu']] },

    { id:'u-0888', ad:'Zeynep Arı', mail:'zeynep.ari@eposta.com', kul:'@zeynepari',
      rol:'antrenor', durum:'aktif', puan:2900, gun:380, sehir:'İzmir', tel:'0(538) 447 20 96',
      alim:[],
      gecmis:[['2026-03-05','Antrenör başvurusu onaylandı','Yasin Yavuz'],
              ['2024-01-22','Hesap açıldı','Kayıt formu']] },

    { id:'u-0001', ad:'Yasin Yavuz', mail:'yasin.yavuz@eposta.com', kul:'@yasinyavuz',
      rol:'yonetici', durum:'aktif', puan:750, gun:60, sehir:'İstanbul', tel:'0(530) 000 00 00',
      alim:[],
      gecmis:[['2023-05-02','Hesap açıldı · yönetici','Sistem']] }
  ];

  /* Şemada karşılığı OLMAYAN alanların adı — ekranlar bu listeden okuyup
     "—" basar ve nedenini yazar. İki ekran ayrı ayrı hatırlamak zorunda
     kalmasın diye burada duruyor. */
  var KAYNAKSIZ = {
    uyelikTarihi: '`dm_user` şemasında kayıt tarihi alanı yok (ölçüldü).',
    paket:        '`dm_user` şemasında paket alanı yok (ölçüldü); abonelik K6 ile geri geldi ama şema henüz yok.',
    sonGiris:     '`dm_user` oturum damgası tutmuyor; son giriş zamanı hiçbir yerde saklanmıyor.',
    dogumTarihi:  'Kayıt formunda doğum tarihi alanı yok.'
  };

  /* Kademe TÜRETİLİR, kayda yazılmaz. Motorun kuralı: `minPuan` VE
     `minGun` barajlarını BİRLİKTE geçtiği en yüksek kademe. Tek ölçütle
     atlanmaz. Motor yüklenmemişse null döner ve ekran bunu söyler. */
  function kademeBul(puan, gun){
    var R = kok.FIT_ROZET;
    if (!R || !R.KADEMELER || !R.KADEMELER.length) return null;
    var son = R.KADEMELER[0];
    R.KADEMELER.forEach(function (k) {
      if (puan >= k.minPuan && gun >= k.minGun) son = k;
    });
    return son;
  }

  function bul(id){
    for (var i = 0; i < UYELER.length; i++) if (UYELER[i].id === id) return UYELER[i];
    return null;
  }

  kok.FIT_ADMIN_UYE = {
    OLCUM_TARIHI: '2026-08-30',
    ROL: ROL, DURUM: DURUM, UYELER: UYELER, KAYNAKSIZ: KAYNAKSIZ,
    kademeBul: kademeBul, bul: bul,
    /* Ad baş harfleri — avatar görseli olmayan üye için (kabuk `.u-ava.initials`). */
    basHarf: function (x) {
      return String(x || '').trim().split(/\s+/).slice(0, 2)
        .map(function (p) { return p.charAt(0); }).join('').toLocaleUpperCase('tr');
    }
  };

})(window);
