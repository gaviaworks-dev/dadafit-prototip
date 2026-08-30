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

  /* `masa` — DESTEK MASASININ yapabileceği durum geçişleri.
     🔴 B2 · GASTRO'DAN BİREBİR ÖLÇÜLDÜ:
     `app/Domain/Gastro/Enums/SupportStatus.php:81-95` (`destekGecisleri()`).
       Açık           → Çözülen
       Yanıt bekleyen → Çözülen
       Çözülen        → —   (tekrarı `resolved_at`i sessizce tazelerdi)
       Kapatılan      → —   (kapatma ÜYENİN sözüdür, masa onu geri alamaz)
     Detay ekranı bu diziyi okur; kendi listesini YAZMAZ. Eskiden ekran
     dört durumun dördünü de bir açılır menüde sunuyordu — masaya
     "Kapatılan"ı ve "Açık"a geri dönüşü veriyordu ki ikisi de K8
     kanonunda masanın fiili değil.

     `yanit` — bu durumda yanıt yazılabilir mi (`acceptsReply()`,
     aynı dosya :118-121: Kapatılan hariç hepsi). */
  var DURUM = [
    { id:'acik',           ad:'Açık talep',     ico:'fa-inbox',        rozet:'wait',
      masa:['cozulen'], yanit:true,
      yon:'Ekipten yanıt bekliyor. Bu kuyruk sıfırlanmadan gün kapanmaz.' },
    { id:'yanit-bekleyen', ad:'Yanıt bekleyen', ico:'fa-reply',        rozet:'wait',
      masa:['cozulen'], yanit:true,
      yon:'Ekip yazdı, top üyede. Yanıt gelmezse hatırlatma gider.' },
    { id:'cozulen',        ad:'Çözülen',        ico:'fa-circle-check', rozet:'ok',
      masa:[], yanit:true,
      yon:'Sorun giderildi, talep kapanışa hazır. Üye yeniden yazarsa açığa döner.' },
    { id:'kapatilan',      ad:'Kapatılan',      ico:'fa-lock',         rozet:'off',
      masa:[], yanit:false,
      yon:'Kapatılan talebe yeni yanıt yazılmaz; yazışma kayıtta okunur kalır.' }
  ];
  function durumBul(id){ for (var i=0;i<DURUM.length;i++) if (DURUM[i].id===id) return DURUM[i]; return DURUM[0]; }

  var TEMSILCI = ['Atanmadı', 'Ece Demir', 'Barış Yıldırım', 'Nur Aslan'];

  /* ---- yazışma ------------------------------------------------------
     🔴 B2 · GASTRO KIYASININ AÇTIĞI EKSİK. Ölçüldü:
     `resources/views/admin/destek/talep.blade.php:73-105` — masanın talep
     ekranında SOL KOLONUN TAMAMI yazışmadır (`.act-list` / `.act-row`,
     her satırda yazan + gövde + tarih). Fit'in detay ekranında yazışma
     hiç yoktu; künye satırı "yazışma gövdesi bu makette yok" diyordu ama
     `mesaj:3` alanı üç mesaj olduğunu İDDİA ediyordu — arkasında bir şey
     olmayan bir sayı.

     `mesaj` artık AYRI ALAN DEĞİL, dizinin uzunluğundan türer (aşağıda):
     ikinci kopya tutmak, ikisinin ayrı düşmesi demekti.

     Kim: 'uye' | 'ekip'. Son mesajın kimden geldiği DURUMLA TUTARLIDIR
     (K8 kanonu): `acik` üyede biter (top ekipte), `yanit-bekleyen` ·
     `cozulen` · `kapatilan` ekipte biter. Her dizinin son tarihi kaydın
     `son` alanıyla aynıdır — iki yerde iki tarih olmaz. */
  var TALEP = [
    { no:'DF-2026-B4TXN2', durum:'acik',           uye:'Elif Şahin', mail:'elif.sahin@eposta.com',    konu:'Aktivite ve cihaz bağlantıları',
      baslik:'Apple Health adım verisi iki gündür aktarılmıyor', son:'2026-08-11', atanan:'Ece Demir',
      yazisma:[
        ['uye','2026-08-09','Apple Health bağlantım kurulu görünüyor ama iki gündür adım verisi DadaFit tarafına geçmiyor. Saatte adımlar sayılıyor, uygulamada 0 yazıyor.'],
        ['ekip','2026-08-10','Merhaba, bağlantıyı kayıtta görüyoruz. Telefonda Ayarlar > Gizlilik > Sağlık altında DadaFit için "Adım" izninin açık olduğunu doğrular mısınız? İzin kapanınca bağlantı kurulu kalır ama veri akmaz.'],
        ['uye','2026-08-11','İzin açık, kapatıp yeniden açtım, hâlâ aynı. Bağlantıyı kaldırıp yeniden kurmayı deneyeyim mi?']
      ] },
    { no:'DF-2026-T6NGX4', durum:'acik',           uye:'Kaan Erdem', mail:'kaan.erdem@eposta.com',    konu:'Uygulama hatası',
      baslik:'Challenge rozetim tamamlandığı hâlde düşmedi', son:'2026-07-23', atanan:'Atanmadı',
      yazisma:[
        ['uye','2026-07-23','30 günlük su challenge\'ını dün tamamladım, ilerleme çubuğu %100 gösteriyor ama rozet profilimde çıkmadı. Uygulamayı kapatıp açtım, değişmedi.']
      ] },
    { no:'DF-2026-QW3JZ8', durum:'yanit-bekleyen', uye:'Zeynep Aydın', mail:'zeynep.aydin@eposta.com',  konu:'Programlar ve planım',
      baslik:'Programını Bul sonucundaki program planıma eklenmedi', son:'2026-07-29', atanan:'Barış Yıldırım',
      yazisma:[
        ['uye','2026-07-27','Programını Bul testini bitirdim, sonuç ekranında bir program önerildi ve "Planıma ekle" dedim. Fit Planım\'da hiçbir şey görünmüyor.'],
        ['ekip','2026-07-29','Merhaba, kaydınızda o gün açılmış bir plan kaydı görünmüyor — ekleme adımı tamamlanmadan sayfadan çıkılmış olabilir. Testi tekrarlamanıza gerek yok: sonuç ekranınız hesabınızda duruyor, Programını Bul > Son sonucum üzerinden yeniden ekleyebilirsiniz. Aynı yerde takılırsa ekran görüntüsüyle yazın.']
      ] },
    { no:'DF-2026-M2VYP7', durum:'yanit-bekleyen', uye:'Burak Toprak', mail:'burak.toprak@eposta.com',  konu:'Aktivite ve cihaz bağlantıları',
      baslik:'Antrenman geçmişimde iki günlük boşluk görünüyor', son:'2026-07-27', atanan:'Ece Demir',
      yazisma:[
        ['uye','2026-07-25','21 ve 22 Temmuz\'da iki antrenman yaptım, ikisi de geçmişte yok. O günlerde uygulamaya girmiştim.'],
        ['ekip','2026-07-26','Merhaba, o iki günü kayıtta arıyoruz. Antrenmanları saatten mi yoksa doğrudan uygulamadan mı başlatmıştınız?'],
        ['uye','2026-07-26','Saatten başlattım, ikisi de saatte duruyor.'],
        ['ekip','2026-07-27','Teşekkürler, bu bilgi belirleyici. Saatten başlatılan antrenmanın aktarımı cihaz bağlantısına bağlı ve o tarihlerde bağlantınız bir kez düşmüş görünüyor. Kayıtlar saatte durduğu için kaybolmadı; bağlantıyı yenilediğinizde geriye dönük aktarılacak. Yenileme sonrası iki günün geldiğini doğrular mısınız?']
      ] },
    { no:'DF-2026-A8RUC3', durum:'yanit-bekleyen', uye:'Merve Çelik', mail:'merve.celik@eposta.com',   konu:'Antrenör ve randevu',
      baslik:'Antrenör randevumu ertelemek istiyorum', son:'2026-07-21', atanan:'Nur Aslan',
      yazisma:[
        ['uye','2026-07-20','Cuma günkü randevumu bir hafta ertelemek istiyorum ama randevu ekranında erteleme seçeneği göremedim.'],
        ['ekip','2026-07-21','Merhaba, erteleme antrenörün onayına bağlı olduğu için randevu ekranından değil, antrenörünüzle mesajlaşma üzerinden yürüyor. Antrenörünüze yeni tarihi yazın; onayladığında randevu kendiliğinden taşınır. Yanıt alamazsanız buraya yazın, biz iletelim.']
      ] },
    { no:'DF-2026-K7WQ9M', durum:'cozulen',        uye:'Onur Kılıç', mail:'onur.kilic@eposta.com',    konu:'DadaFit Pro ve ödeme',
      baslik:'Pro üyeliğim yenilendi ama paket ücretsize düştü', son:'2026-08-14', atanan:'Barış Yıldırım',
      yazisma:[
        ['uye','2026-08-12','Pro üyeliğim bu ay yenilendi, ödeme kartımdan geçti. Ama uygulamada paketim Ücretsiz görünüyor ve Pro özellikleri kapalı.'],
        ['ekip','2026-08-13','Merhaba, ödemenizi tahsil edilmiş olarak görüyoruz; abonelik kaydı ödemeyle eşleşmemiş. Kaydı elle eşleştirdik.'],
        ['uye','2026-08-14','Şimdi Pro göründü, teşekkürler.'],
        ['ekip','2026-08-14','Rica ederiz. Kesinti olan günler için bir sonraki yenilemenize yansıtılmak üzere not düşüldü. Talebi çözüldü olarak işaretliyoruz; aynı sorun tekrarlarsa bu talebe yazmanız yeterli.']
      ] },
    { no:'DF-2026-U2FZR8', durum:'cozulen',        uye:'İpek Yalçın', mail:'ipek.yalcin@eposta.com',   konu:'Uygulama hatası',
      baslik:'Enerji defterinde su takibi her gün sıfırlanıyor', son:'2026-06-26', atanan:'Ece Demir',
      yazisma:[
        ['uye','2026-06-24','Enerji Defteri\'nde su bardaklarını işaretliyorum, ertesi gün açtığımda hepsi sıfırlanmış oluyor. Geçmiş günlerde de hiçbir kayıt görünmüyor.'],
        ['ekip','2026-06-26','Merhaba, defter kaydınız tarayıcının kendi belleğinde tutuluyordu ve tarayıcı ayarınız site verisini çıkışta siliyordu. Ayarı düzelttikten sonra kayıtlar kalıcı olacak; ne yazık ki silinen geçmiş günler geri getirilemiyor. Talebi çözüldü olarak işaretliyoruz.']
      ] },
    { no:'DF-2026-Z4KMD9', durum:'kapatilan',      uye:'Tolga Demirci', mail:'tolga.demirci@eposta.com', konu:'Üyelik ve fatura',
      baslik:'Fatura adresimi güncellemek istiyorum', son:'2026-07-22', atanan:'Nur Aslan',
      yazisma:[
        ['uye','2026-07-21','Fatura adresim eski işyerim olarak kayıtlı, güncellemek istiyorum.'],
        ['ekip','2026-07-22','Merhaba, fatura adresi Hesabım > Fatura bilgileri ekranından değiştirilebiliyor; değişiklik bir sonraki faturadan itibaren geçerli oluyor. Kesilmiş faturaların adresi yasal olarak değiştirilemiyor.']
      ] },
    { no:'DF-2026-P7XBW2', durum:'kapatilan',      uye:'Ayşe Korkmaz', mail:'ayse.korkmaz@eposta.com',  konu:'Antrenör ve randevu',
      baslik:'Antrenör randevum takvimde iki kez göründü', son:'2026-07-17', atanan:'Nur Aslan',
      yazisma:[
        ['uye','2026-07-16','Salı günkü randevum takvimde iki kez görünüyor. İki kez ücretlendirilir miyim?'],
        ['ekip','2026-07-17','Merhaba, ücretlendirme tek — kayıtta tek randevu var, ikinci satır takvim görünümünün tekrar basmasından kaynaklanıyordu ve düzeltildi. Talebi kapatıyoruz.']
      ] },
    { no:'DF-2026-E3QHT6', durum:'kapatilan',      uye:'Cem Uysal', mail:'cem.uysal@eposta.com',     konu:'Hesap ve giriş',
      baslik:'Bildirim tercihlerim her girişte sıfırlanıyor', son:'2026-07-10', atanan:'Barış Yıldırım',
      yazisma:[
        ['uye','2026-07-08','Bildirim tercihlerimde e-posta bildirimlerini kapatıyorum, her girişte yeniden açık geliyor.'],
        ['ekip','2026-07-09','Merhaba, tercih kaydınıza bakıyoruz. Kapatma işlemini yaptıktan sonra "Kaydet" düğmesine basıyor musunuz? Anahtar kendi başına kaydetmiyor.'],
        ['ekip','2026-07-10','Kaydınızda kaydedilmiş bir kapatma yok; ekranın kaydetmeden çıkıldığında uyarı vermemesi bize ait bir eksiklik ve geliştirme listesine alındı. Tercihi sizin adınıza kapattık. Talebi kapatıyoruz.']
      ] },
    { no:'DF-2026-N9GVJ4', durum:'kapatilan',      uye:'Deniz Arda', mail:'deniz.arda@eposta.com',    konu:'Uygulama hatası',
      baslik:'Egzersiz kütüphanesinde ekipman süzgeci boş sonuç döndürüyor', son:'2026-07-03', atanan:'Ece Demir',
      yazisma:[
        ['uye','2026-07-02','Egzersiz kütüphanesinde ekipman olarak "Kettlebell" seçtiğimde hiç sonuç çıkmıyor, oysa kettlebell hareketleri var.'],
        ['ekip','2026-07-03','Merhaba, sorunu doğruladık: o hareketlerin ekipman etiketi eksik girilmişti, süzgeç doğru çalışıyordu ama eşleşecek etiket yoktu. Etiketler tamamlandı, süzgeç artık sonuç veriyor. Talebi kapatıyoruz.']
      ] }
  ];

  /* `mesaj` TÜRETİLİR — elle yazılan sayı diziyle ayrı düşerdi. */
  TALEP.forEach(function (t) { t.mesaj = t.yazisma.length; });

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
