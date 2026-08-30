/* =====================================================================
   DadaFit · YÖNETİM PANELİ KABUĞU — TEK KAYNAK   (R16/2)
   ---------------------------------------------------------------------
   Sayfa sözleşmesi tek satırdır:

     <body class="adm-body" data-adm="challenge">
       <div id="fitAdminTop"></div>
       <main class="adm-main"> … sayfanın kendi içeriği … </main>

   `data-adm` sidebar'da hangi kalemin aktif olduğunu söyler; başka hiçbir
   şey yazılmaz. Sidebar, üst çubuk, mobil çekmece ve aktif işaretleme
   buradan basılır — 21 ekranın hiçbiri menüyü kendi yazmaz.

   NEDEN: R15'te public tarafta ölçülen kusurun aynısı burada 21 kez
   doğardı. Menü sayfaya yazılsaydı bir kalem eklendiğinde 21 dosya
   değişirdi ve biri unutulduğunda kimse fark etmezdi.

   ⚠ BU DOSYA `fit-shell.js`in YERİNE GEÇMEZ, ONUNLA ÇALIŞMAZ.
   Admin sayfaları public kabuğu (header/footer/çekmece) YÜKLEMEZ; iki
   kabuk aynı sayfada iki `position:fixed` üst çubuk demek olurdu. Admin
   yalnız `fit-shell.css`i (tokenler + bileşenler) ve bu dosyayı yükler.

   MENÜ HARİTASI — TEK VERİ DİZİSİ
   Bölümler ve kalemler aşağıdaki `MENU`dedir. Sıra ve bölümleme
   `docs/fit-admin-plan.md` §1–§3'ten gelir; oradaki kanon "Genel Bakış +
   ANA İÇERİK · OPERASYON · YAPILANDIRMA"dır ve dört markada aynıdır.
   Yeni ekran eklemek buraya bir satır yazmaktır.
   ===================================================================== */
(function (kok) {
  'use strict';

  /* ⚠ R16/2 · GASTRO'NUN GERÇEK SIDEBAR'I ÖLÇÜLDÜ ve bu dizi ona çekildi.
     Kaynak: `dadagastro-profil/resources/views/admin/layout.blade.php`
     (salt okuma, kod alınmadı — yalnız bölümleme ve sıra).
     İlk taslağımda DÖRT SAPMA vardı, dördü de düzeltildi:
       1. Rozetler ve Kademeler YAPILANDIRMA'daydı → Gastro'da OPERASYON.
       2. Log Yönetimi YAPILANDIRMA'daydı → Gastro'da OPERASYON.
       3. Raporlar OPERASYON'daydı → Gastro'da YAPILANDIRMA (bölümün sonu).
       4. Gastro alt gruplu kalemler taşıyor ("Dolapta Ne Var?" · "Mutfak
          Sırları" · "Video Mutfağı"); taslak düz listeydi. `alt` alanı eklendi.

     BİLEREK AYRILAN İKİ NOKTA (gerekçesiyle):
     · Gastro'da **Rozetler** ve **Kademeler** AYRI iki kalem. Fit'te tek
       kalem: ikisi de `fit-rozet.js`in aynı motorundan geliyor ve kademe
       eşiği rozet puanından hesaplanıyor. İki ekrana bölmek, tek veri
       kaynağını iki yüzeye dağıtmak olurdu — bu depoda üç kez temizlenen
       "aynı soruya iki cevap" kusuru.
     · Gastro'da reklam **yedi** kalem (Sponsorlar · Reklam Alanları · Reklam
       Paketleri · Kampanyalar · Kreatifler · Sponsorluk · Sponsorluk Raporu).
       Fit'te bugün reklam yüzeyi tek sayfa (`reklam-ver-v1.html`); yedi
       kalemlik bir menü, arkasında altı boş ekran demek olurdu. Tek kalem +
       sekme olarak kuruldu; Fit'in reklam ürünü büyüyünce Gastro'nun
       kırılımına açılır.

     Gastro'nun abonelik kalemleri (Planlar · Creator Planları · Abonelikler ·
     Faturalar · Kuponlar) Fit'e GELMEZ — K6: Fit'te abonelik yoktur, üye
     üreticiden hizmet satın alır. Karşılığı "Hizmetler ve Satışlar"dır. */
  var MENU = [
    { kalem: [
      { id:'genel', ad:'Genel Bakış', ico:'fa-solid fa-gauge-high', href:'admin-v1.html' }
    ]},
    { bolum:'Ana içerik', kalem: [
      { id:'hareketler', ad:'Hareket Kütüphanesi', ico:'fa-solid fa-dumbbell',      href:'admin-hareketler-v1.html' },
      { id:'programlar', ad:'Programlar',          ico:'fa-solid fa-clipboard-list',href:'admin-programlar-v1.html' },
      { id:'challenge',  ad:"Challenge'lar",       ico:'fa-solid fa-trophy',        href:'admin-challenge-v1.html' },
      { id:'testler',    ad:'Fit Testleri',        ico:'fa-solid fa-stopwatch',     href:'admin-testler-v1.html' },
      { id:'taksonomi',  ad:'Taksonomi',           ico:'fa-solid fa-tags',          href:'admin-taksonomi-v1.html' },
      { id:'sayfalar',   ad:'Sayfalar ve SEO',     ico:'fa-solid fa-file-lines',    href:'admin-sayfalar-v1.html' }
    ]},
    { bolum:'Operasyon', kalem: [
      { id:'uyeler',      ad:'Üyeler ve Yetki',        ico:'fa-solid fa-users',          href:'admin-uyeler-v1.html' },
      { id:'antrenorler', ad:'Antrenörler',            ico:'fa-solid fa-user-check',     href:'admin-antrenorler-v1.html' },
      { id:'moderasyon',  ad:'Moderasyon',             ico:'fa-solid fa-shield-halved',  href:'admin-moderasyon-v1.html' },
      { id:'destek',      ad:'Destek Talepleri',       ico:'fa-solid fa-life-ring',      href:'admin-destek-v1.html' },
      { id:'hizmetler',   ad:'Hizmetler ve Satışlar',  ico:'fa-solid fa-basket-shopping',href:'admin-hizmetler-v1.html' },
      { id:'odemeler',    ad:'Kazançlar ve Ödemeler',  ico:'fa-solid fa-money-bill-wave',href:'admin-odemeler-v1.html' },
      { id:'rozetler',    ad:'Rozetler ve Kademeler',  ico:'fa-solid fa-medal',          href:'admin-rozetler-v1.html' },
      { id:'log',         ad:'Log Yönetimi',           ico:'fa-solid fa-list-check',     href:'admin-log-v1.html' }
    ]},
    { bolum:'Yapılandırma', kalem: [
      { id:'menu',      ad:'Menü ve Navigasyon',     ico:'fa-solid fa-bars',        href:'admin-menu-v1.html' },
      { id:'reklam',    ad:'Sponsorluk ve Reklam',   ico:'fa-solid fa-bullhorn',    href:'admin-reklam-v1.html' },
      { id:'paketler',  ad:'Paketler ve Özellikler', ico:'fa-solid fa-layer-group', href:'admin-paketler-v1.html' },
      { id:'bildirim',  ad:'Bildirim Şablonları',    ico:'fa-solid fa-bell',        href:'admin-bildirim-v1.html' },
      { id:'ayarlar',   ad:'Ayarlar',                ico:'fa-solid fa-sliders',     href:'admin-ayarlar-v1.html' },
      { id:'raporlar',  ad:'Raporlar',               ico:'fa-solid fa-chart-line',  href:'admin-raporlar-v1.html' }
    ]}
  ];

  /* Kuyruk sayaçları. Bir kalemin sayacı SIFIRSA BASILMAZ — "0 bekleyen"
     bir bilgi değil, gürültüdür. Değerler bugün örnek; gerçek kaynak
     doğunca aynı ad okunur. */
  var SAYAC = { antrenorler: 3, destek: 5, moderasyon: 2 };

  function esc(t){
    return String(t == null ? '' : t)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function aktifId(){
    var b = document.body.getAttribute('data-adm');
    if (b) return b;
    /* Öznitelik yoksa adresten düş — ölü bir sidebar'dansa doğru tahmin. */
    var d = (location.pathname.split('/').pop() || '').replace(/^admin-?|-v1\.html$/g, '');
    return d || 'genel';
  }

  function kalemBul(id){
    for (var i = 0; i < MENU.length; i++) {
      var k = MENU[i].kalem;
      for (var j = 0; j < k.length; j++) if (k[j].id === id) return k[j];
    }
    return null;
  }

  function sidebarHtml(aktif){
    var out = '<aside class="adm-side" id="admSide" aria-label="Yönetim menüsü">' +
      '<a class="adm-brand" href="admin-v1.html">' +
        '<span class="mark"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>' +
        '<span><b>DadaFit</b><small>Yönetim</small></span>' +
      '</a>' +
      '<nav class="adm-nav" aria-label="Bölümler">';
    MENU.forEach(function (g) {
      if (g.bolum) out += '<div class="adm-sec">' + esc(g.bolum) + '</div>';
      g.kalem.forEach(function (k) {
        var on = (k.id === aktif);
        var n = SAYAC[k.id] || 0;
        out += '<a class="adm-item' + (on ? ' is-on' : '') + '" href="' + esc(k.href) + '"' +
               ' title="' + esc(k.ad) + '"' + (on ? ' aria-current="page"' : '') + '>' +
               '<i class="' + k.ico + '" aria-hidden="true"></i>' + esc(k.ad) +
               (n ? '<span class="cnt" aria-label="' + n + ' bekleyen">' + n + '</span>' : '') +
               '</a>';
      });
    });
    /* MENÜYÜ DARALT — Gastro'da ölçüldü ("Menüyü daralt/genişlet").
       Daraltılmış hâlde kalemler yalnız ikon; ad `title` ve `aria-label`
       olarak kalır, yani bilgi kaybolmaz. Tercih localStorage'da durur. */
    out += '</nav>' +
      '<button class="adm-daralt" type="button" id="admDaralt" aria-label="Menüyü daralt">' +
        '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i><span>Menüyü daralt</span>' +
      '</button>';
    return out + '</aside><div class="adm-scrim" id="admScrim" hidden></div>';
  }

  function topHtml(k){
    var ad = k ? k.ad : 'Yönetim';
    return '<header class="adm-top">' +
      '<button class="adm-burger" type="button" id="admBurger" aria-label="Menüyü aç" aria-expanded="false">' +
        '<i class="fa-solid fa-bars" aria-hidden="true"></i></button>' +
      '<div class="t-ttl"><div class="t-crumb"><a href="admin-v1.html">Yönetim</a> · ' + esc(ad) + '</div>' +
      '<h1>' + esc(ad) + '</h1></div>' +
      /* YÖNETİMDE ARAMA — Gastro'da ölçüldü ("Kullanıcı, içerik ara…").
         Burada GERÇEKTEN çalışıyor ve dürüst bir şey arıyor: 21 ekranın
         kendisi. Sunucu olmadığı için içerik araması yapamayız; ekran
         araması yapabiliriz ve yirmi bir kalemli bir menüde bu asıl işe
         yarayan şey. Yer tutucu ne vaat ediyorsa onu veriyor. */
      '<div class="t-ara">' +
        '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
        '<input type="search" id="admAra" placeholder="Ekran ara…" autocomplete="off" ' +
        'role="combobox" aria-expanded="false" aria-controls="admAraPop" aria-label="Yönetimde ara" />' +
        '<div class="t-ara-pop" id="admAraPop" role="listbox" hidden></div>' +
      '</div>' +
      '<div class="t-acts">' +
        '<a class="btn btn-ghost" href="dadafit-hub-v1.html" target="_blank" rel="noopener">' +
          '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Siteyi gör</a>' +
        '<div class="t-who"><span>YY</span><div><b>Yasin Yavuz</b><small>Yönetici</small></div></div>' +
      '</div></header>';
  }

  function kur(){
    var yuva = document.getElementById('fitAdminTop');
    if (!yuva) return;
    var id = aktifId();
    var k = kalemBul(id);
    yuva.innerHTML = sidebarHtml(id);

    var ana = document.querySelector('.adm-main');
    if (ana) ana.insertAdjacentHTML('afterbegin', topHtml(k));

    if (k && !document.title) document.title = k.ad + ' — DadaFit Yönetim';

    /* ---- mobil çekmece ---- */
    var yan = document.getElementById('admSide');
    var perde = document.getElementById('admScrim');
    var dugme = document.getElementById('admBurger');
    function ac(a){
      if (!yan) return;
      yan.classList.toggle('is-open', a);
      if (perde){ perde.hidden = !a; perde.classList.toggle('is-on', a); }
      if (dugme) dugme.setAttribute('aria-expanded', a ? 'true' : 'false');
      document.body.style.overflow = a ? 'hidden' : '';
    }
    if (dugme) dugme.addEventListener('click', function(){ ac(!yan.classList.contains('is-open')); });
    if (perde) perde.addEventListener('click', function(){ ac(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') ac(false); });

    /* ---- menüyü daralt ---- */
    var DAR = 'dm_fit_admin_dar';
    var darDugme = document.getElementById('admDaralt');
    function darUygula(d){
      document.body.classList.toggle('adm-dar', d);
      if (darDugme){
        darDugme.setAttribute('aria-label', d ? 'Menüyü genişlet' : 'Menüyü daralt');
        darDugme.querySelector('span').textContent = d ? 'Genişlet' : 'Menüyü daralt';
        darDugme.querySelector('i').className = 'fa-solid fa-chevron-' + (d ? 'right' : 'left');
      }
    }
    var dar = false;
    try { dar = localStorage.getItem(DAR) === '1'; } catch (e) {}
    darUygula(dar);
    if (darDugme) darDugme.addEventListener('click', function(){
      dar = !dar; darUygula(dar);
      try { localStorage.setItem(DAR, dar ? '1' : '0'); } catch (e) {}
    });

    /* ---- yönetimde arama ---- */
    var ara = document.getElementById('admAra');
    var pop = document.getElementById('admAraPop');
    if (ara && pop){
      var duz = [];
      MENU.forEach(function (g) {
        g.kalem.forEach(function (x) { duz.push({ ad:x.ad, href:x.href, ico:x.ico, bolum:g.bolum || '' }); });
      });
      var imlec = -1;
      function kapat(){ pop.hidden = true; ara.setAttribute('aria-expanded','false'); imlec = -1; }
      function ciz(){
        var q = ara.value.trim().toLocaleLowerCase('tr');
        if (!q){ kapat(); return; }
        var bul = duz.filter(function (x) {
          return x.ad.toLocaleLowerCase('tr').indexOf(q) >= 0 ||
                 x.bolum.toLocaleLowerCase('tr').indexOf(q) >= 0;
        });
        if (!bul.length){
          pop.innerHTML = '<div class="t-ara-bos">Bu adla bir ekran yok. ' +
            'Bu prototipte içerik araması yapılamaz — sunucu yok.</div>';
        } else {
          pop.innerHTML = bul.map(function (x, i) {
            return '<a class="t-ara-sat' + (i === imlec ? ' is-on' : '') + '" role="option" href="' + esc(x.href) + '">' +
              '<i class="' + x.ico + '" aria-hidden="true"></i><b>' + esc(x.ad) + '</b>' +
              (x.bolum ? '<small>' + esc(x.bolum) + '</small>' : '') + '</a>';
          }).join('');
        }
        pop.hidden = false; ara.setAttribute('aria-expanded','true');
      }
      ara.addEventListener('input', function(){ imlec = -1; ciz(); });
      ara.addEventListener('keydown', function (e) {
        var sat = pop.querySelectorAll('.t-ara-sat');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
          if (!sat.length) return;
          e.preventDefault();
          imlec += (e.key === 'ArrowDown' ? 1 : -1);
          if (imlec < 0) imlec = sat.length - 1;
          if (imlec >= sat.length) imlec = 0;
          ciz();
        } else if (e.key === 'Enter'){
          var hedef = pop.querySelector('.t-ara-sat.is-on') || pop.querySelector('.t-ara-sat');
          if (hedef){ e.preventDefault(); location.href = hedef.getAttribute('href'); }
        } else if (e.key === 'Escape'){ ara.value = ''; kapat(); }
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest || !e.target.closest('.t-ara')) kapat();
      });
    }
  }

  /* ==================================================================
     ORTAK YARDIMCILAR — 21 ekran bunları paylaşır
     ================================================================== */
  var API = {
    MENU: MENU,
    esc: esc,
    n: function (x){ return Number(x || 0).toLocaleString('tr-TR'); },
    tl: function (kurus){
      /* Para kuruş TAMSAYISI olarak tutulur, float değil (fit-fatura.js
         deseni). Ekranda TL'ye burada çevrilir. */
      return (Number(kurus || 0) / 100).toLocaleString('tr-TR',
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
    },
    tarih: function (iso){
      if (!iso) return '—';
      var t = new Date(iso); if (isNaN(t)) return '—';
      return t.toLocaleDateString('tr-TR', { day:'numeric', month:'short', year:'numeric' });
    },

    /* Kaynak şeridi — her ekranın en üstünde, TEK satır.
       tip: 'canli' → gerçekten çalışan bir sözleşme modülünden okunuyor
            'ornek' → örnek veri, yazma yüzeyi maket */
    kaynak: function (tip, metin){
      var canli = (tip === 'canli');
      return '<div class="adm-src ' + (canli ? 'is-canli' : 'is-ornek') + '">' +
        '<i class="fa-solid ' + (canli ? 'fa-circle-check' : 'fa-circle-info') + '" aria-hidden="true"></i>' +
        '<div>' + metin + '</div></div>';
    },

    /* Boş durum — kit §9, DÖRT PARÇASI DA yazılır. */
    bos: function (ico, baslik, metin, eylem){
      return '<div class="fp-card fpx-bos" style="box-shadow:none;border:0">' +
        '<span class="pe-ico"><i class="fa-solid ' + ico + '" aria-hidden="true"></i></span>' +
        '<h4>' + esc(baslik) + '</h4><p>' + esc(metin) + '</p>' +
        (eylem ? eylem : '') + '</div>';
    },

    /* Durum rozeti — kit §5, yeni durum rengi üretilmez. */
    rozet: function (durum, metin, ico){
      return '<span class="fp-badge ' + durum + '">' +
        (ico ? '<i class="fa-solid ' + ico + '" aria-hidden="true"></i> ' : '') + esc(metin) + '</span>';
    },

    /* Toplu seçim — tablo başlığındaki kutu ve satır kutuları.
       Seçim yokken çubuk BASILMAZ (hidden), çünkü boş bir toplu eylem
       çubuğu tıklanacak bir şey vaat edip vermiyor. */
    secimKur: function (kok){
      var tablo = kok.querySelector('.adm-table'); if (!tablo) return;
      var cubuk = kok.querySelector('.adm-bulk');
      var hepsi = tablo.querySelector('thead input[type=checkbox]');
      function satirlar(){ return Array.prototype.slice.call(tablo.querySelectorAll('tbody input[type=checkbox]')); }
      function tazele(){
        var s = satirlar().filter(function(x){ return x.checked; }).length;
        if (cubuk){
          cubuk.hidden = (s === 0);
          var b = cubuk.querySelector('b'); if (b) b.textContent = s + ' satır seçildi';
        }
        if (hepsi){
          var t = satirlar().length;
          hepsi.checked = (s > 0 && s === t);
          hepsi.indeterminate = (s > 0 && s < t);
        }
      }
      if (hepsi) hepsi.addEventListener('change', function(){
        satirlar().forEach(function(x){ x.checked = hepsi.checked; }); tazele();
      });
      tablo.addEventListener('change', function(e){
        if (e.target.matches('tbody input[type=checkbox]')) tazele();
      });
      /* HÜCRENİN TAMAMI DOKUNMA HEDEFİ (WCAG 2.5.8).
         Onay kutusu görsel olarak 18px ve öyle kalmalı — tablo satırında
         44px'lik bir kutu ritmi bozar. Hedefi büyütmenin CSS'le yolu yok:
         `transform:scale()` denendi, çizimle birlikte isabet sınamasını da
         ölçeklediği için hedefi de küçülttü (ölçüldü). Bunun yerine hücre
         tıklanabilir yapıldı — 44px'in çok üstünde bir alan, görsel
         değişiklik sıfır. Kutunun kendi tıklaması iki kez tetiklenmesin
         diye kaynak kutuysa geçilir. */
      tablo.addEventListener('click', function (e) {
        var h = e.target.closest && e.target.closest('td.sel, th.sel');
        if (!h || e.target.matches('input[type=checkbox]')) return;
        var k = h.querySelector('input[type=checkbox]');
        if (!k) return;
        k.checked = !k.checked;
        k.dispatchEvent(new Event('change', { bubbles: true }));
      });
      tazele();
    },

    /* Tabloda arama — sunucu yok, satırlar yerinde süzülür.
       Sonuç 0 ise boş durum basılır (kit §9). */
    aramaKur: function (girdi, tablo, sayac){
      if (!girdi || !tablo) return;
      var govde = tablo.querySelector('tbody');
      var bosSatir = null;
      function uygula(){
        var q = girdi.value.trim().toLocaleLowerCase('tr');
        var n = 0;
        Array.prototype.slice.call(govde.querySelectorAll('tr')).forEach(function (tr) {
          if (tr === bosSatir) return;
          var ok = !q || tr.textContent.toLocaleLowerCase('tr').indexOf(q) >= 0;
          tr.hidden = !ok; if (ok) n++;
        });
        if (sayac) sayac.textContent = n;
        if (n === 0){
          if (!bosSatir){
            bosSatir = document.createElement('tr');
            bosSatir.innerHTML = '<td colspan="' + tablo.querySelectorAll('thead th').length + '">' +
              API.bos('fa-magnifying-glass', 'Bu aramayla kayıt bulunamadı',
                      'Arama kutusunu boşalt ya da başka bir sözcük dene.') + '</td>';
            govde.appendChild(bosSatir);
          }
          bosSatir.hidden = false;
        } else if (bosSatir) bosSatir.hidden = true;
      }
      girdi.addEventListener('input', uygula);
      uygula();
    },

    /* Maket yazma. Sunucu yok; form doğrulanır, sonra ekran DÜRÜSTÇE
       söyler. Sessizce "kaydedildi" demek bu depodaki en açık yalandır. */
    maketKaydet: function (dugme, ne, form){
      if (!dugme) return;
      dugme.addEventListener('click', function (e) {
        e.preventDefault();
        /* 🔴 R16/2 · DOĞRULAMA YALANI DÜZELTİLDİ.
           ÖNCEKİ HÂL: `dugme.closest('form')`. Kaydet düğmesi kartın ALT
           ÇUBUĞUNDA, `<form>` ise kart GÖVDESİNDE olduğunda `closest` **null**
           dönüyordu ve `if (f && …)` koşulu sessizce atlanıyordu: ekran hiçbir
           şey doğrulamadan "Form doğrulandı" diyordu. Boş zorunlu alanla da
           diyordu — yani bu depoda en çok kovaladığımız şeyi, maket olanı
           gerçekmiş gibi göstermeyi, tam da dürüstlük yardımcısının kendisi
           yapıyordu. Ajan H üç ekranda ölçüp yakaladı.
           YENİ HÂL: form üç yoldan aranır ve BULUNAMAZSA sessizce geçilmez —
           konsola yazılır, çünkü doğrulanmayan bir form kusurdur, varsayılan
           değil.
             1. çağıranın verdiği `form` (en güvenilir)
             2. düğmenin `form` özniteliği / kendi ata zinciri
             3. düğmenin bulunduğu kartın içindeki tek `<form>` */
        var f = form ||
                (dugme.form) ||
                dugme.closest('form') ||
                (function () {
                  var kart = dugme.closest('.adm-card, .pnl-card, .fp-card');
                  var hepsi = kart ? kart.querySelectorAll('form') : [];
                  return hepsi.length === 1 ? hepsi[0] : null;
                })();
        if (!f) {
          console.warn('[FIT_ADMIN.maketKaydet] Doğrulanacak form bulunamadı — ' +
            'düğmeye üçüncü argüman olarak formu ver. Not basılmadı:', ne);
          return;
        }
        if (!f.reportValidity()) return;
        var not = dugme.parentNode.querySelector('.adm-maket-not');
        if (!not){
          not = document.createElement('span');
          not.className = 'adm-maket-not';
          not.style.cssText = 'font-size:12.5px;font-weight:600;color:var(--hs-warn);display:inline-flex;align-items:center;gap:7px';
          dugme.parentNode.appendChild(not);
        }
        not.innerHTML = '<i class="fa-solid fa-circle-info" aria-hidden="true"></i> ' +
          'Form doğrulandı — ' + esc(ne) + ' KAYDEDİLMEDİ. Bu prototipte sunucu yok.';
      });
    }
  };

  kok.FIT_ADMIN = API;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();

})(window);
