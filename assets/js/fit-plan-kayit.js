/* =====================================================================
   DadaFit · PLAN KAYDI — TEK KAYNAK  (REVİZYON 6 · madde 18–19 sözleşmesi)
   ---------------------------------------------------------------------
   Antrenman Oluşturucu (H3) ürettiği planı buraya YAZAR.
   Fit Planım sayfaları buradan OKUR. İki taraf da kendi depolama
   kodunu yazmaz — çağrı yüzeyi yalnız bu dosyadadır.

   DEPOLAMA
     localStorage['dm_fit_planlar_v1']  →  { planlar:[Plan], aktifId:string|null }
     (kabuğun `dm_fit_*` anahtar ailesiyle aynı önek — fit-shell.js pref())

   PLAN ŞEMASI
     {
       id        : 'plan_<zaman>_<rastgele>',   // FIT_PLAN üretir
       ad        : 'Ev · 3 gün · Başlangıç',    // görünen ad
       olusturma : '2026-08-21T09:00:00.000Z',  // ISO
       kaynak    : 'antrenman-olusturucu',      // hangi motor ürettiyse
       secimler  : { gunSayisi, seviye, hedef, mekan, ekipman:[], sure, cinsiyet },
       gunler    : [ {
           no        : 1,
           ad        : 'Gün 1',
           odak      : 'İtiş',
           isinma    : '5 dk hafif tempo + omuz çevirme',   // v2 · §3.3
           hareketler: [ {
               slug, ad, set, tekrar, sure,                 // set/tekrar/sure serbest
               dinlenme  : 60,          // v2 · saniye — setler arası
               ekipman   : ['dambıl'],  // v2 · gereken ekipman
               video     : 'slug',      // v2 · form videosu (egzersiz-detay slug'ı)
               uyari     : '…',         // v2 · form/güvenlik uyarısı
               alternatif  : 'slug',    // v2 · "bu bana uymuyor" karşılığı
               alternatifAd: 'Şınav (Push-up)'  // v2 · alternatifin GÖRÜNEN adı
           } ]
       } ],
       ilerleme  : {                            // anahtar: 'g<gunNo>-h<hareketIdx>'
          'g1-h0': { yapildi:true, seviye:'tam', tarih:'2026-08-21T…',
                     agirlik:12, tekrarYapilan:10, efor:7 }   // v2 · §5.3/§5.4
       }
     }

   ŞEMA v2 — R10 · belge §3.3 · §5.3 · §5.4
     Eklenen alanların HEPSİ İSTEĞE BAĞLI. Eski planlar (v1) kırılmaz:
     alan yoksa okuyan taraf göstermez, uydurmaz. Oluşturucu bu alanları
     doldurmaya başlayana kadar Fit Planım onları basitçe atlar — yarım
     dolu bir kart, sahte dolu bir karttan iyidir.

     gunler[].isinma                → §3.3 ısınma
     hareketler[].dinlenme (sn)     → §3.3 setler arası dinlenme
     hareketler[].ekipman []        → §3.3 gereken ekipman
     hareketler[].video (slug)      → §3.3 form videosu
     hareketler[].uyari             → §3.3 form/güvenlik uyarısı
     hareketler[].alternatif (slug) → §3.3 "bu hareket bana uymuyor"
     hareketler[].alternatifAd      → alternatifin GÖRÜNEN adı. Slug→ad tablosu
       yalnız Oluşturucu'da; okuyan sayfa slug'ı güzelleştirirse FABRİKASYON
       yapar ('sinav' → "Sinav", doğrusu "Şınav (Push-up)"). Ad yoksa okuyan
       taraf etiketi adsız basar — uydurmaz.
     ilerleme[k].agirlik/tekrarYapilan/efor → §5.3 performans · §5.4 hareket bazlı
       Bu üçü aynı zamanda KANIT: yalnız gerçekten yapan girebilir.

   İLERLEME SEVİYELERİ (sabit, uydurulmayacak)
     'tam'    → tamamlandı
     'yarim'  → yarım bırakıldı
     'atlandi'→ atlandı
   ===================================================================== */
(function (kok) {
  'use strict';

  var ANAHTAR   = 'dm_fit_planlar_v1';
  var SEVIYELER = ['tam', 'yarim', 'atlandi'];

  /* ---- düşük seviye: oku / yaz ------------------------------------ */
  function bos() { return { planlar: [], aktifId: null }; }

  function oku() {
    try {
      var ham = kok.localStorage.getItem(ANAHTAR);
      if (!ham) return bos();
      var d = JSON.parse(ham);
      if (!d || !Array.isArray(d.planlar)) return bos();
      if (typeof d.aktifId === 'undefined') d.aktifId = null;
      return d;
    } catch (e) { return bos(); }
  }

  function yaz(d) {
    try { kok.localStorage.setItem(ANAHTAR, JSON.stringify(d)); return true; }
    catch (e) { return false; }          /* kota dolu / gizli kip */
  }

  function yeniId() {
    return 'plan_' + Date.now().toString(36) + '_' +
           Math.random().toString(36).slice(2, 8);
  }

  function ilerlemeAnahtari(gunNo, hareketIdx) {
    return 'g' + gunNo + '-h' + hareketIdx;
  }

  /* ---- olay: kayıt değişince dinleyenler haberdar olsun ------------ */
  function haberVer(tur, id) {
    try {
      kok.dispatchEvent(new CustomEvent('fit-plan-degisti', {
        detail: { tur: tur, id: id }
      }));
    } catch (e) {}
  }

  /* ---- genel yüzey ------------------------------------------------- */
  var API = {

    ANAHTAR:   ANAHTAR,
    SEVIYELER: SEVIYELER,

    /* localStorage yazılabiliyor mu (gizli kip / kota) */
    kullanilabilir: function () {
      try {
        kok.localStorage.setItem('__fit_test__', '1');
        kok.localStorage.removeItem('__fit_test__');
        return true;
      } catch (e) { return false; }
    },

    /* Planı kaydeder. id taşıyorsa GÜNCELLER, taşımıyorsa yeni kayıt açar.
       Dönen değer: kaydedilen planın id'si (yazılamazsa null). */
    kaydet: function (plan) {
      if (!plan || typeof plan !== 'object') return null;
      var d = oku();
      var p = JSON.parse(JSON.stringify(plan));

      if (!p.id) p.id = yeniId();
      if (!p.olusturma) p.olusturma = new Date().toISOString();
      if (!p.ilerleme || typeof p.ilerleme !== 'object') p.ilerleme = {};
      if (!Array.isArray(p.gunler)) p.gunler = [];
      p.guncelleme = new Date().toISOString();

      var i = d.planlar.findIndex(function (x) { return x.id === p.id; });
      if (i > -1) d.planlar[i] = p; else d.planlar.unshift(p);

      if (!d.aktifId) d.aktifId = p.id;
      if (!yaz(d)) return null;
      haberVer('kaydet', p.id);
      return p.id;
    },

    /* Yeniden eskiye sıralı kayıt listesi */
    listele: function () {
      return oku().planlar.slice().sort(function (a, b) {
        return String(b.olusturma).localeCompare(String(a.olusturma));
      });
    },

    getir: function (id) {
      if (!id) return null;
      var p = oku().planlar.filter(function (x) { return x.id === id; })[0];
      return p || null;
    },

    sil: function (id) {
      var d = oku();
      var n = d.planlar.length;
      d.planlar = d.planlar.filter(function (x) { return x.id !== id; });
      if (d.planlar.length === n) return false;
      if (d.aktifId === id) d.aktifId = d.planlar.length ? d.planlar[0].id : null;
      if (!yaz(d)) return false;
      haberVer('sil', id);
      return true;
    },

    aktifYap: function (id) {
      var d = oku();
      if (!d.planlar.some(function (x) { return x.id === id; })) return false;
      d.aktifId = id;
      if (!yaz(d)) return false;
      haberVer('aktif', id);
      return true;
    },

    /* Aktif plan nesnesi (yoksa null) */
    aktif: function () {
      var d = oku();
      if (!d.aktifId) return null;
      return d.planlar.filter(function (x) { return x.id === d.aktifId; })[0] || null;
    },

    /* Tek hareketi işaretler.
       durum: {yapildi:boolean, seviye:'tam'|'yarim'|'atlandi',
               agirlik?:number, tekrarYapilan?:number, efor?:1..10}
       yapildi:false verilirse kayıt SİLİNİR (işaret geri alınır).

       v2 — son üç alan §5.3 performans ve §5.4 hareket bazlı ilerlemeyi
       besliyor; aynı zamanda KANIT: yalnız gerçekten yapan girebilir.
       Verilmezse YAZILMAZ (undefined alan üretilmiyor); var olan bir kaydın
       üzerine kısmi güncelleme gelirse eski değerler KORUNUR. */
    isaretle: function (id, gunNo, hareketIdx, durum) {
      var d = oku();
      var p = d.planlar.filter(function (x) { return x.id === id; })[0];
      if (!p) return false;
      if (!p.ilerleme) p.ilerleme = {};

      var k = ilerlemeAnahtari(gunNo, hareketIdx);
      durum = durum || {};

      if (durum.yapildi === false) {
        delete p.ilerleme[k];
      } else {
        var sev = SEVIYELER.indexOf(durum.seviye) > -1 ? durum.seviye : 'tam';
        var eski = p.ilerleme[k] || {};
        var yeni = {
          yapildi: true,
          seviye:  sev,
          tarih:   durum.tarih || new Date().toISOString()
        };
        /* v2 alanları: verilmişse yaz, verilmemişse ESKİSİNİ KORU.
           Kısmi güncelleme (yalnız seviye değişti) performans verisini
           silmemeli — sessiz veri kaybı kusurdur. */
        ['agirlik','tekrarYapilan','efor'].forEach(function(alan){
          if (typeof durum[alan] === 'number')      yeni[alan] = durum[alan];
          else if (typeof eski[alan] === 'number')  yeni[alan] = eski[alan];
        });
        p.ilerleme[k] = yeni;
      }
      p.guncelleme = new Date().toISOString();
      if (!yaz(d)) return false;
      haberVer('ilerleme', id);
      return true;
    },

    isaret: function (id, gunNo, hareketIdx) {
      var p = API.getir(id);
      if (!p || !p.ilerleme) return null;
      return p.ilerleme[ilerlemeAnahtari(gunNo, hareketIdx)] || null;
    },

    /* Özet — Fit Planım üst kartı bunu basar.
       toplam  : plandaki hareket sayısı
       yapilan : 'tam' + 'yarim' işaretli hareket sayısı ('atlandi' sayılmaz)
       oran    : 0–100 tam sayı
       aktifGun: ilk tamamlanmamış günün no'su (hepsi bittiyse son gün) */
    ozet: function (id) {
      var p = API.getir(id || (oku().aktifId));
      if (!p) return null;

      var toplam = 0, yapilan = 0, sonTarih = null, aktifGun = null;

      (p.gunler || []).forEach(function (g) {
        var gToplam = (g.hareketler || []).length;
        var gYapilan = 0;
        toplam += gToplam;

        (g.hareketler || []).forEach(function (_, i) {
          var it = (p.ilerleme || {})[ilerlemeAnahtari(g.no, i)];
          if (!it || !it.yapildi) return;
          if (it.seviye !== 'atlandi') { yapilan++; gYapilan++; }
          if (it.tarih && (!sonTarih || it.tarih > sonTarih)) sonTarih = it.tarih;
        });

        if (aktifGun === null && gToplam > 0 && gYapilan < gToplam) aktifGun = g.no;
      });

      if (aktifGun === null && (p.gunler || []).length) {
        aktifGun = p.gunler[p.gunler.length - 1].no;
      }

      return {
        id:       p.id,
        ad:       p.ad || 'Planım',
        toplam:   toplam,
        yapilan:  yapilan,
        oran:     toplam ? Math.round((yapilan / toplam) * 100) : 0,
        sonTarih: sonTarih,
        aktifGun: aktifGun,
        gunSayisi:(p.gunler || []).length
      };
    },

    /* Tüm kayıtları siler — yalnız "verilerimi temizle" akışı için */
    temizle: function () {
      try { kok.localStorage.removeItem(ANAHTAR); haberVer('temizle', null); return true; }
      catch (e) { return false; }
    }
  };

  kok.FIT_PLAN = API;

})(window);
