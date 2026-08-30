/* =====================================================================
   DadaFit · YÖNETİM PANELİ — BİLDİRİM ŞABLONLARI   (R19)
   ---------------------------------------------------------------------
   NEDEN AYRI DOSYA
   Şablon listesi (`admin-bildirim-v1.html`) ve şablon formu
   (`admin-bildirim-form-v1.html`) AYNI kayıtları gösteriyor. Diziyi iki
   sayfaya kopyalasaydık biri düzeltildiğinde öteki sessizce yalan
   söylerdi. Kardeşleri: `fit-admin-veri.js` · `fit-admin-uye-veri.js`.

   🔴 ŞABLON METİNLERİ ÖRNEKTİR. Bu depoda bildirim metni tutan bir modül
   yok (ölçüldü: `bildirimler-v1.html` listeyi kendi markup'ında taşıyor,
   `fit-shell.js`te bir şablon dizisi yok).

   ÖRNEK OLSA DA TETİKLEYİCİLER GERÇEK: her şablon bu depoda gerçekten
   çalışan bir olaya bağlı — rozet kazanma ve kademe atlama
   `fit-rozet.js`, challenge günü `fit-challenge.js`, su hedefi
   `fit-su.js`, destek yanıtı K8 kanonundaki dört durumdan biri.

   DEĞİŞKEN SÖZLÜĞÜ bir SÜS DEĞİL: ad → örnek değer. Önizleme bu
   sözlükten doldurulur, ikinci bir örnek kümesi tutulmaz. Bir şablonun
   KULLANILABİLİR değişkenleri ilan edilmez, `degiskenleriniSay()` ile
   şablonun KENDİ metninden sayılır — ilan edilen liste ile metnin
   kullandığı liste zamanla ayrışır ve o an ekran yalan söyler.
   ===================================================================== */
(function (kok) {
  'use strict';

  var DEGISKEN = {
    '{{ad}}':            'Yasin',
    '{{uye_adi}}':       'yasinyavuz',
    '{{rozet_adi}}':     '7 Aktif Gün',
    '{{rozet_puani}}':   '25',
    '{{kademe_adi}}':    'Düzenli',
    '{{kademe_sira}}':   '3',
    '{{challenge_adi}}': '30 Günde Hareket Alışkanlığı',
    '{{gun}}':           '12',
    '{{program_adi}}':   'Yeni Başlayanlar 4 Haftalık Program',
    '{{antrenor_adi}}':  'Elif Demir',
    '{{randevu_tarihi}}':'3 Eylül 2026, 18:30',
    '{{talep_no}}':      'DT-2418',
    '{{tutar}}':         '99,00 ₺',
    '{{su_hedefi}}':     '2,6 L',
    '{{site_adi}}':      'DadaFit'
  };

  var SABLONLAR = [
    { key:'hosgeldin', ad:'Hoş geldin', tetik:'uye.kayit_tamamlandi', kanal:'ikisi', durum:'aktif',
      dg:['{{ad}}','{{site_adi}}'],
      konu:'{{ad}}, DadaFit\'e hoş geldin',
      govde:'Merhaba {{ad}},\n\nDadaFit hesabın hazır. İlk hareketini kaydettiğin gün ilk rozetin de açılıyor — nereden başlayacağını bilmiyorsan Yeni Başlayanlar programı seni adım adım götürür.\n\nİyi çalışmalar.',
      baslik:'Hoş geldin, {{ad}}', metin:'Hesabın hazır. İlk hareketini kaydet, ilk rozetin açılsın.',
      hedef:'programlarim-v1.html' },

    { key:'sifre', ad:'Şifre sıfırlama', tetik:'uye.sifre_sifirlama_istendi', kanal:'eposta', durum:'aktif',
      dg:['{{ad}}','{{site_adi}}'],
      konu:'Şifre sıfırlama isteğin',
      govde:'Merhaba {{ad}},\n\nŞifreni sıfırlamak için aşağıdaki bağlantıya tıkla. Bağlantı 30 dakika geçerli.\n\nBu isteği sen yapmadıysan bir şey yapmana gerek yok, şifren değişmez.',
      baslik:'Şifre sıfırlama', metin:'Bağlantı 30 dakika geçerli.',
      hedef:'giris-v1.html' },

    { key:'rozet', ad:'Rozet kazanıldı', tetik:'rozet.kazanildi', kanal:'ikisi', durum:'aktif',
      dg:['{{ad}}','{{rozet_adi}}','{{rozet_puani}}'],
      konu:'Yeni rozet: {{rozet_adi}}',
      govde:'{{ad}}, {{rozet_adi}} rozetini kazandın ve +{{rozet_puani}} puan aldın.\n\nRozet defterin geri alınmaz: bir kez kazanılan rozet, ölçün düşse bile durur.',
      baslik:'{{rozet_adi}} kazanıldı', metin:'+{{rozet_puani}} puan. Rozet defterine eklendi.',
      hedef:'rozetlerim-v1.html' },

    { key:'kademe', ad:'Kademe atlandı', tetik:'rozet.kademe_yukseldi', kanal:'ikisi', durum:'aktif',
      dg:['{{ad}}','{{kademe_adi}}','{{kademe_sira}}'],
      konu:'{{kademe_adi}} kademesine geçtin',
      govde:'{{ad}}, artık {{kademe_adi}} kademesindesin ({{kademe_sira}}. basamak).\n\nKademe iki eşikle atlanır: puan ve aktif gün. İkisini birlikte geçtiğin için buradasın — puan hızlı toplanır, gün toplanmaz.',
      baslik:'{{kademe_adi}} kademesindesin', metin:'{{kademe_sira}}. basamak. Puan ve aktif gün eşiğini birlikte geçtin.',
      hedef:'rozetlerim-v1.html' },

    { key:'challenge-basladi', ad:'Challenge başladı', tetik:'challenge.katilim_basladi', kanal:'uygulama', durum:'aktif',
      dg:['{{ad}}','{{challenge_adi}}','{{gun}}'],
      konu:'{{challenge_adi}} başladı',
      govde:'{{ad}}, {{challenge_adi}} bugün başladı ve {{gun}} gün sürecek.\n\nHer gün işaretlemeyi unutma; telafi hakkın sınırlı.',
      baslik:'{{challenge_adi}} başladı', metin:'{{gun}} gün sürecek. Bugünü işaretlemeyi unutma.',
      hedef:'challengelarim-v1.html' },

    { key:'challenge-hatirlatma', ad:'Challenge günü hatırlatması', tetik:'challenge.gun_isaretlenmedi', kanal:'uygulama', durum:'aktif',
      dg:['{{ad}}','{{challenge_adi}}','{{gun}}'],
      konu:'Bugünü henüz işaretlemedin',
      govde:'{{ad}}, {{challenge_adi}} için bugünü henüz işaretlemedin. {{gun}}. gündesin.',
      baslik:'Bugünü işaretlemedin', metin:'{{challenge_adi}} · {{gun}}. gün. Serini bozma.',
      hedef:'challengelarim-v1.html' },

    { key:'antrenman', ad:'Antrenman hatırlatması', tetik:'plan.gun_yaklasti', kanal:'uygulama', durum:'aktif',
      dg:['{{ad}}','{{program_adi}}'],
      konu:'Bugün antrenman günün',
      govde:'{{ad}}, {{program_adi}} için bugün bir antrenman günü.',
      baslik:'Bugün antrenman günün', metin:'{{program_adi}} · planındaki günü aç.',
      hedef:'programlarim-v1.html' },

    { key:'su', ad:'Su hedefi hatırlatması', tetik:'su.hedef_gerisinde', kanal:'uygulama', durum:'kapali',
      dg:['{{ad}}','{{su_hedefi}}'],
      konu:'Su hedefinin gerisindesin',
      govde:'{{ad}}, bugünkü su hedefin {{su_hedefi}} ve henüz yarısına gelmedin.',
      baslik:'Su hedefin {{su_hedefi}}', metin:'Günün yarısı geçti, hedefin gerisindesin.',
      hedef:'egzersizlerim-v1.html#defter-su' },

    { key:'randevu', ad:'Antrenör randevusu onaylandı', tetik:'randevu.onaylandi', kanal:'ikisi', durum:'aktif',
      dg:['{{ad}}','{{antrenor_adi}}','{{randevu_tarihi}}'],
      konu:'Randevun onaylandı: {{randevu_tarihi}}',
      govde:'{{ad}}, {{antrenor_adi}} ile randevun {{randevu_tarihi}} için onaylandı.\n\nSeans bedeli aboneliğe dâhil değildir; antrenörle ayrıca görüşülür.',
      baslik:'Randevun onaylandı', metin:'{{antrenor_adi}} · {{randevu_tarihi}}',
      hedef:'mesajlarim-v1.html' },

    { key:'destek', ad:'Destek talebi yanıtlandı', tetik:'destek.yanit_yazildi', kanal:'ikisi', durum:'aktif',
      dg:['{{ad}}','{{talep_no}}'],
      konu:'{{talep_no}} numaralı talebine yanıt geldi',
      govde:'{{ad}}, {{talep_no}} numaralı destek talebine yanıt yazıldı.\n\nTalep şu an “yanıt bekleyen” durumunda; sen yazınca “açık”a döner.',
      baslik:'Talebine yanıt geldi', metin:'{{talep_no}} · yanıt bekleyen durumunda.',
      hedef:'destek-talebi-detay-v1.html' },

    { key:'odeme', ad:'Ödeme alındı', tetik:'odeme.tahsil_edildi', kanal:'eposta', durum:'aktif',
      dg:['{{ad}}','{{tutar}}'],
      konu:'Ödemen alındı',
      govde:'{{ad}}, {{tutar}} tutarındaki ödemen alındı. Faturan hesabındaki Ödemelerim bölümünde.',
      baslik:'Ödemen alındı', metin:'{{tutar}} · faturan Ödemelerim\'de.',
      hedef:'odemelerim-v1.html' }
  ];

  var KANAL_AD = { ikisi:'E-posta + uygulama', eposta:'Yalnız e-posta', uygulama:'Yalnız uygulama içi' };
  var KANAL_IKO = { ikisi:'fa-solid fa-tower-broadcast', eposta:'fa-solid fa-envelope', uygulama:'fa-solid fa-mobile-screen' };

  /* Bir şablonun GERÇEKTEN kullandığı değişkenler — metinden sayılır.
     `dg` alanı bir İLAN'dır ve ikisi ayrışabilir; ekran ayrışmayı
     gösterebilsin diye ikisi de duruyor. */
  function degiskenleriSay(s){
    var metin = [s.konu, s.govde, s.baslik, s.metin].join(' ');
    var bulunan = metin.match(/\{\{[a-z_]+\}\}/g) || [];
    var teklesmis = [];
    bulunan.forEach(function (d) { if (teklesmis.indexOf(d) < 0) teklesmis.push(d); });
    return teklesmis;
  }

  function bul(key){
    for (var i = 0; i < SABLONLAR.length; i++) if (SABLONLAR[i].key === key) return SABLONLAR[i];
    return null;
  }

  /* Şablon metnindeki değişkenleri örnek değerlerle doldurur — önizleme
     ve test gönderimi ikisi de bunu kullanır. */
  function doldur(metin){
    return String(metin == null ? '' : metin).replace(/\{\{[a-z_]+\}\}/g, function (m) {
      return DEGISKEN[m] !== undefined ? DEGISKEN[m] : m;
    });
  }

  kok.FIT_ADMIN_BILDIRIM = {
    OLCUM_TARIHI: '2026-08-30',
    DEGISKEN: DEGISKEN, SABLONLAR: SABLONLAR,
    KANAL_AD: KANAL_AD, KANAL_IKO: KANAL_IKO,
    degiskenleriSay: degiskenleriSay, bul: bul, doldur: doldur
  };

})(window);
