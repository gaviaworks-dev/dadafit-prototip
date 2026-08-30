/* =====================================================================
   DadaFit · YÖNETİM PANELİ KABUĞU — TEK KAYNAK   (R17)
   ---------------------------------------------------------------------
   Sayfa sözleşmesi tek satırdır ve DEĞİŞMEDİ:

     <body class="adm-body" data-adm="challenge">
       <div id="fitAdminTop"></div>
       <main class="adm-main"> <div class="adm-page"> … sayfanın içeriği …

   `data-adm` sidebar'da hangi kalemin aktif olduğunu söyler. İkon rail,
   bölüm menüsü, üst çubuk, daralt tutamağı, mobil çekmece ve aktif
   işaretleme buradan basılır — 21 ekranın hiçbiri menüyü kendi yazmaz.

   🔴 R17 · KABUK GASTRO'YA ÇEKİLDİ. R16/2'de basılan kabuk ölçülerek
   değil UYDURULARAK kurulmuştu: tek katmanlı BEYAZ sidebar, ortada dar
   arama, üst barda sayfa başlığı, sidebar'ın altında tam genişlik daralt
   düğmesi. Gastro'nun kendi kaynağı okundu
   (`dadagastro-profil/resources/views/admin/layout.blade.php` +
   `public/reference/admin/sa-shell.css` · salt okuma, kod alınmadı) ve
   basılan yapı onunkine çekildi:

     · İKON RAIL (76px, en koyu #19160F) — Fit'te menünün DÖRT BÖLÜMÜNÜ
       seçer. Gastro'da rail dünya seçicisidir çünkü orada beş marka var;
       Fit tek markadır ama menüsü aynı dört bölüme ayrılır (plan §1).
       Uydurulmuş "yakında" dünyası eklenmedi.
     · BÖLÜM MENÜSÜ (264px, koyu #211E16 = kitin --fit-dark'ı) — üstünde
       küçük yeşil YÖNETİM üst etiketi + büyük DadaFit.
     · ÜST BAR (64px, açık) — arama SOLDA ve GENİŞ (max 420px), sağda
       site bağlantısı + yuvarlak harf avatarı + ad/rol + açılır ok.
     · SAYFA BAŞLIĞI ÜST BARDA DEĞİL, GÖVDEDE (`.adm-head`).
     · DARALT TUTAMAĞI menünün DIŞ kenarında yüzer (`.sa-divider`),
       dikey ortada; eski tam genişlik düğme söküldü.

   ⚠ BU DOSYA `fit-shell.js`in YERİNE GEÇMEZ. Admin sayfaları public
   kabuğu (header/footer) YÜKLEMEZ; iki kabuk aynı sayfada iki sabit üst
   şerit demek olurdu.

   MENÜ HARİTASI — TEK VERİ DİZİSİ
   Bölümler ve kalemler aşağıdaki `MENU`dedir. Sıra ve bölümleme
   `docs/fit-admin-plan.md` §1–§3'ten gelir. Yeni ekran eklemek buraya bir
   satır yazmaktır.
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
    { ico:'fa-solid fa-gauge-high', kalem: [
      { id:'genel', ad:'Genel Bakış', ico:'fa-solid fa-gauge-high', href:'admin-v1.html' }
    ]},
    { bolum:'Ana içerik', ico:'fa-solid fa-dumbbell', kalem: [
      /* 🔴 R19 · HAREKET KÜTÜPHANESİ BİR GRUP OLDU.
         Ölçülen eksik (`fit-yonetilmeyenler.md` C-6): eski kalem YALNIZ 25
         egzersizi yönetiyordu; hareket rehberi (9 sayfa · 153 madde), spor
         sözlüğü (254 terim × 10 kategori) ve anatomi haritası (31 kas ·
         12 hareket · 4 harita) hiçbir ekranda yoktu. Belgenin önerisi
         birebir uygulandı: "admin-hareketler bir Hareket Kütüphanesi
         bölümüne dönüşmeli, altında dört kalem". */
      { id:'hareketler', ad:'Hareket Kütüphanesi', ico:'fa-solid fa-dumbbell', href:'admin-hareketler-v1.html',
        alt: [
          { id:'hareketler', ad:'Egzersizler',      href:'admin-hareketler-v1.html' },
          { id:'rehber',     ad:'Rehber Sayfaları', href:'admin-rehber-v1.html' },
          { id:'sozluk',     ad:'Spor Sözlüğü',     href:'admin-sozluk-v1.html' },
          { id:'anatomi',    ad:'Anatomi Haritası', href:'admin-anatomi-v1.html' }
        ]},
      { id:'programlar', ad:'Programlar',          ico:'fa-solid fa-clipboard-list',href:'admin-programlar-v1.html' },
      { id:'challenge',  ad:"Challenge'lar",       ico:'fa-solid fa-trophy',        href:'admin-challenge-v1.html' },
      { id:'testler',    ad:'Fit Testleri',        ico:'fa-solid fa-stopwatch',     href:'admin-testler-v1.html' },
      { id:'taksonomi',  ad:'Taksonomi',           ico:'fa-solid fa-tags',          href:'admin-taksonomi-v1.html' },
      /* Medya kütüphanesi ORTAK kalemdir (dört markanın hepsinde aynı),
         markaya özel değil. Gastro'da karşılığı YOK; üstüne inşa edildi
         (plan §11/D3): grep `media-library|MediaLibrary` → 0 isabet. */
      { id:'medya',      ad:'Medya Kütüphanesi',   ico:'fa-solid fa-photo-film',    href:'admin-medya-v1.html' },
      { id:'sayfalar',   ad:'Sayfalar ve SEO',     ico:'fa-solid fa-file-lines',    href:'admin-sayfalar-v1.html' }
    ]},
    { bolum:'Operasyon', ico:'fa-solid fa-headset', kalem: [
      { id:'uyeler',      ad:'Üyeler ve Yetki',        ico:'fa-solid fa-users',          href:'admin-uyeler-v1.html' },
      { id:'antrenorler', ad:'Antrenörler',            ico:'fa-solid fa-user-check',     href:'admin-antrenorler-v1.html' },
      { id:'moderasyon',  ad:'Moderasyon',             ico:'fa-solid fa-shield-halved',  href:'admin-moderasyon-v1.html' },
      { id:'destek',      ad:'Destek Talepleri',       ico:'fa-solid fa-life-ring',      href:'admin-destek-v1.html' },
      { id:'sss',         ad:'S.S.S.',                 ico:'fa-solid fa-circle-question',href:'admin-sss-v1.html' },
      { id:'hizmetler',   ad:'Hizmetler ve Satışlar',  ico:'fa-solid fa-basket-shopping',href:'admin-hizmetler-v1.html' },
      /* 🔴 K6 GERİ ALINDI (2026-08-30): Fit'te abonelik VARDIR. Gastro'nun
         beşlisinin (Planlar · Creator Planları · Abonelikler · Faturalar ·
         Kuponlar) Fit karşılığı dörtlü; "Creator Planları"nın karşılığı
         antrenör hizmet paketi onayıdır ve o `hizmetler`de yaşıyor.
         Gastro da bu beşliyi TEK açılır grup altında topluyor
         (layout.blade.php:326) — desen birebir alındı. */
      { id:'abonelik',    ad:'Abonelikler',            ico:'fa-solid fa-credit-card',    href:'admin-planlar-v1.html',
        alt: [
          { id:'planlar',     ad:'Planlar',     href:'admin-planlar-v1.html' },
          { id:'abonelikler', ad:'Abonelikler', href:'admin-abonelikler-v1.html' },
          { id:'faturalar',   ad:'Faturalar',   href:'admin-faturalar-v1.html' },
          { id:'kuponlar',    ad:'Kuponlar',    href:'admin-kuponlar-v1.html' }
        ]},
      { id:'odemeler',    ad:'Kazançlar ve Ödemeler',  ico:'fa-solid fa-money-bill-wave',href:'admin-odemeler-v1.html' },
      { id:'rozetler',    ad:'Rozetler ve Kademeler',  ico:'fa-solid fa-medal',          href:'admin-rozetler-v1.html' },
      { id:'log',         ad:'Log Yönetimi',           ico:'fa-solid fa-list-check',     href:'admin-log-v1.html' }
    ]},
    { bolum:'Yapılandırma', ico:'fa-solid fa-sliders', kalem: [
      { id:'menu',      ad:'Menü ve Navigasyon',     ico:'fa-solid fa-bars',            href:'admin-menu-v1.html' },
      { id:'reklam',    ad:'Sponsorluk ve Reklam',   ico:'fa-solid fa-bullhorn',        href:'admin-reklam-v1.html' },
      { id:'paketler',  ad:'Paketler ve Özellikler', ico:'fa-solid fa-layer-group',     href:'admin-paketler-v1.html' },
      { id:'bildirim',  ad:'Bildirim Şablonları',    ico:'fa-solid fa-bell',            href:'admin-bildirim-v1.html' },
      { id:'ayarlar',   ad:'Ayarlar',                ico:'fa-solid fa-sliders',         href:'admin-ayarlar-v1.html' },
      { id:'yasal',     ad:'Yasal Belgeler',         ico:'fa-solid fa-scale-balanced',  href:'admin-yasal-v1.html' },
      { id:'raporlar',  ad:'Raporlar',               ico:'fa-solid fa-chart-line',      href:'admin-raporlar-v1.html' }
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
      for (var j = 0; j < k.length; j++) {
        if (k[j].id === id) return k[j];
        var a = k[j].alt || [];
        for (var x = 0; x < a.length; x++) if (a[x].id === id) return a[x];
      }
    }
    return null;
  }
  /* Aktif kalem bir ALT kalemse, üst grubu da bulunmalı: grup açık
     işaretlenir ve chevron döner. Yoksa kullanıcı hangi grubun içinde
     olduğunu göremez — Gastro'nun `$pricingActive` mantığının karşılığı. */
  function ustGrupBul(id){
    for (var i = 0; i < MENU.length; i++) {
      var k = MENU[i].kalem;
      for (var j = 0; j < k.length; j++) {
        var a = k[j].alt || [];
        for (var x = 0; x < a.length; x++) if (a[x].id === id) return k[j];
      }
    }
    return null;
  }

  /* Aktif kalemin hangi bölümde olduğunu bul — ikon rail o bölümü işaretler. */
  function bolumIx(aktif){
    for (var i = 0; i < MENU.length; i++) {
      var k = MENU[i].kalem;
      for (var j = 0; j < k.length; j++) {
        if (k[j].id === aktif) return i;
        var a = k[j].alt || [];
        for (var x = 0; x < a.length; x++) if (a[x].id === aktif) return i;
      }
    }
    return 0;
  }

  /* ---- 1) İKON RAIL — 76px, en koyu katman ----------------------------
     Gastro'da rail dünya seçicisidir (beş marka). Fit tek markadır, ama
     menüsü aynı dört bölüme ayrılır — rail o dört bölümü seçer ve tıklama
     menüyü ilgili bölüm başlığına kaydırır. Ölü bağlantı ya da "yakında"
     kutusu YOK: rail'deki her ikonun arkasında gerçekten var olan bir
     bölüm duruyor. */
  function railHtml(bIx){
    var out = '<aside class="sa-rail" id="saRail" aria-label="Bölümler">' +
      '<a class="sa-rail-logo" href="admin-v1.html" data-tip="DadaFit Yönetim" aria-label="DadaFit Yönetim">' +
        '<i class="fa-solid fa-bolt" aria-hidden="true"></i></a>' +
      '<div class="sa-rail-div"></div>';
    MENU.forEach(function (g, i) {
      var ad = g.bolum || 'Genel Bakış';
      var n = 0;
      g.kalem.forEach(function (k) { n += (SAYAC[k.id] || 0); });
      out += '<button class="sa-rail-ico' + (i === bIx ? ' is-active' : '') + '" type="button"' +
        ' data-rail="' + i + '" data-tip="' + esc(ad) + '" aria-label="' + esc(ad) + '">' +
        '<i class="' + g.ico + '" aria-hidden="true"></i>' +
        (n ? '<span class="pl-cnt">' + n + '</span>' : '') + '</button>';
    });
    out += '<div class="sa-rail-foot">' +
      '<a class="sa-sig" href="https://gaviaworks.com" target="_blank" rel="noopener" ' +
      'data-tip="Gaviaworks" aria-label="Gaviaworks — gaviaworks.com">' +
      '<i class="fa-solid fa-g" aria-hidden="true"></i></a></div>';
    return out + '</aside>';
  }

  /* ---- 2) BÖLÜM MENÜSÜ — 264px, koyu (elevated) ---------------------- */
  function menuHtml(aktif){
    var out = '<nav class="sa-menu" id="saMenu" aria-label="Yönetim menüsü">' +
      '<div class="sa-menu-head">' +
        '<span class="smh-eyebrow">Yönetim</span>' +
        '<span class="smh-title">DadaFit</span>' +
      '</div><div class="sa-mnav" id="saMnav">';
    MENU.forEach(function (g, i) {
      if (g.bolum) out += '<div class="sa-msec" id="saSec' + i + '">' + esc(g.bolum) + '</div>';
      else out += '<div id="saSec' + i + '" hidden></div>';
      g.kalem.forEach(function (k) {
        var alt = k.alt || [];
        /* Grup AÇIK sayılır: aktif kalem grubun kendisiyse ya da alt
           kalemlerinden biriyse. Gastro'nun `$pricingActive` mantığı. */
        var altAktif = alt.some(function (a) { return a.id === aktif; });
        var on = (k.id === aktif && !alt.length) || (k.id === aktif);
        var acik = alt.length && (on || altAktif);
        var n = SAYAC[k.id] || 0;
        alt.forEach(function (a) { n += (SAYAC[a.id] || 0); });

        if (!alt.length) {
          out += '<a class="sa-mlink adm-item' + (on ? ' is-active is-on' : '') + '" href="' + esc(k.href) + '"' +
                 ' title="' + esc(k.ad) + '"' + (on ? ' aria-current="page"' : '') + '>' +
                 '<i class="' + k.ico + '" aria-hidden="true"></i>' + esc(k.ad) +
                 (n ? '<span class="pl-cnt cnt" aria-label="' + n + ' bekleyen">' + n + '</span>' : '') +
                 '</a>';
          return;
        }

        /* 🔴 K-1 (Gastro'nun kendi kanonu, layout.blade.php:352 yorumu):
           ÜST BAŞLIĞA TIKLAMAK İLK ALT SAYFAYA GİDER. "Yalnız aç/kapa"
           değil — bu yüzden `<a href>`, `<button>` değil. Chevron'a
           tıklamak yalnız açar/kapar (aşağıdaki dinleyici). */
        var altId = 'saAlt' + (k.id || '').replace(/[^a-z0-9]/gi, '');
        out += '<a class="sa-mlink adm-item' + (acik ? ' is-open' : '') +
                 ((on || altAktif) ? ' is-active is-on' : '') + '" href="' + esc(k.href) + '"' +
               ' title="' + esc(k.ad) + '" aria-expanded="' + (acik ? 'true' : 'false') + '"' +
               ' aria-controls="' + altId + '"' +
               ((on || altAktif) ? ' aria-current="page"' : '') + '>' +
               '<i class="' + k.ico + '" aria-hidden="true"></i>' +
               '<span class="mlink-label">' + esc(k.ad) + '</span>' +
               (n ? '<span class="pl-cnt cnt" aria-label="' + n + ' bekleyen">' + n + '</span>' : '') +
               '<i class="fa-solid fa-chevron-down mlink-caret" aria-hidden="true"></i>' +
               '</a>';
        out += '<div class="sa-submenu-dark" id="' + altId + '"' + (acik ? '' : ' hidden') + '>' +
          alt.map(function (a) {
            var aOn = (a.id === aktif);
            return '<a class="' + (aOn ? 'is-active' : '') + '" href="' + esc(a.href) + '"' +
                   ' title="' + esc(a.ad) + '"' + (aOn ? ' aria-current="page"' : '') + '>' +
                   esc(a.ad) + '</a>';
          }).join('') + '</div>';
      });
    });
    out += '</div><div class="sa-menu-foot">' +
      '<a class="sa-mlink" href="dadafit-hub-v1.html" target="_blank" rel="noopener">' +
        '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Siteyi gör</a>' +
      '</div></nav>';
    /* DIVIDER TUTAMAĞI — menünün DIŞ kenarında yüzen, dikey ortada sekme.
       Gastro'da ayrı bir toggle düğmesi YOK; katla/aç bu tutamaktadır. */
    out += '<button class="sa-divider" id="saDivider" type="button" ' +
      'aria-label="Menüyü daralt" aria-expanded="true" aria-controls="saMenu">' +
      '<span class="sa-grip"></span></button>';
    return out;
  }

  /* ---- 3) ÜST İNCE BAR — arama SOLDA ve GENİŞ ------------------------
     🔴 SAYFA BAŞLIĞI BURADA DEĞİL. Gastro'da başlık gövdenin içinde,
     kartların üstünde (`.pnl-page-head`); üst bar yalnız arama + araçlar
     taşır. R16/2'de başlık üst bardaydı ve gövdede hiç tekrar etmiyordu. */
  function topHtml(){
    return '<header class="pnl-top adm-top" id="admTop">' +
      '<button class="pnl-burger adm-burger" type="button" id="admBurger" ' +
        'aria-label="Menüyü aç" aria-expanded="false">' +
        '<i class="fa-solid fa-bars" aria-hidden="true"></i></button>' +
      /* YÖNETİMDE ARAMA — Gastro'da "Kullanıcı, içerik ara…". Burada
         DÜRÜST karşılığı: 21 ekranın kendisi aranır. Sunucu olmadığı için
         içerik araması yapılamaz; yer tutucu ne vaat ediyorsa onu veriyor. */
      '<div class="pnl-search t-ara">' +
        '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
        '<input type="search" id="admAra" placeholder="Ekran ara…" autocomplete="off" ' +
        'role="combobox" aria-expanded="false" aria-controls="admAraPop" aria-label="Yönetimde ara" />' +
        '<div class="t-ara-pop" id="admAraPop" role="listbox" hidden></div>' +
      '</div>' +
      '<div class="pnl-top-tools t-acts">' +
        '<a class="pnl-bell" href="dadafit-hub-v1.html" target="_blank" rel="noopener" ' +
          'data-tip="Siteyi gör" aria-label="Siteyi gör">' +
          '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>' +
        '<button class="pnl-me" type="button" id="admMe" aria-expanded="false" aria-haspopup="true">' +
          '<span class="pm-ava">YY</span>' +
          '<span class="pm-id"><span class="pm-name">Yasin Yavuz</span>' +
          '<span class="pm-role">Süper Admin</span></span>' +
          '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>' +
        '</button>' +
        '<div class="pnl-menu" id="admMeMenu">' +
          '<div class="pmenu-head"><b>Yasin Yavuz</b><span>Süper Admin</span></div>' +
          '<a href="hesabim-v1.html"><i class="fa-solid fa-user" aria-hidden="true"></i> Hesabım</a>' +
          '<a href="admin-ayarlar-v1.html"><i class="fa-solid fa-sliders" aria-hidden="true"></i> Ayarlar</a>' +
          '<div class="pmenu-div"></div>' +
          '<a href="dadafit-hub-v1.html"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Siteyi gör</a>' +
        '</div>' +
      '</div></header>';
  }

  function kur(){
    var yuva = document.getElementById('fitAdminTop');
    if (!yuva) return;
    var id = aktifId();
    var k = kalemBul(id);
    var bIx = bolumIx(id);

    yuva.innerHTML = '<div class="sa-app">' + railHtml(bIx) + menuHtml(id) + topHtml() +
                     '<div class="pnl-overlay adm-scrim" id="admScrim"></div></div>';

    if (k && !document.title) document.title = k.ad + ' — DadaFit Yönetim';

    /* ---- mobil çekmece — rail + menü TEK birim olarak açılır ---- */
    var perde = document.getElementById('admScrim');
    var dugme = document.getElementById('admBurger');
    function ac(a){
      document.body.classList.toggle('nav-open', a);
      if (dugme) dugme.setAttribute('aria-expanded', a ? 'true' : 'false');
      document.body.style.overflow = a ? 'hidden' : '';
    }
    if (dugme) dugme.addEventListener('click', function(){ ac(!document.body.classList.contains('nav-open')); });
    if (perde) perde.addEventListener('click', function(){ ac(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') ac(false); });

    /* ---- alt menü aç/kapa — chevron'a tıklama --------------------
       K-1 gereği başlığın KENDİSİ ilk alt sayfaya gider; yalnız chevron
       aç/kapa yapar. Klavye: başlık odaktayken ← kapatır, → açar (ağaç
       gezinme kanonu), böylece fareye gerek kalmaz. */
    function altAc(link, ac){
      var kutu = document.getElementById(link.getAttribute('aria-controls'));
      if (!kutu) return;
      kutu.hidden = !ac;
      link.classList.toggle('is-open', ac);
      link.setAttribute('aria-expanded', ac ? 'true' : 'false');
    }
    yuva.querySelectorAll('.sa-mlink[aria-controls]').forEach(function (link) {
      var ok = link.querySelector('.mlink-caret');
      if (ok) ok.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        altAc(link, link.getAttribute('aria-expanded') !== 'true');
      });
      link.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight'){ e.preventDefault(); altAc(link, true); }
        else if (e.key === 'ArrowLeft'){ e.preventDefault(); altAc(link, false); }
      });
    });

    /* ---- rail: bölüm seçici ---- */
    var mnav = document.getElementById('saMnav');
    yuva.querySelectorAll('.sa-rail-ico[data-rail]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = b.getAttribute('data-rail');
        var hedef = document.getElementById('saSec' + i);
        yuva.querySelectorAll('.sa-rail-ico').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        if (document.body.classList.contains('sa-collapsed')) daraltUygula(false);
        if (hedef && mnav) mnav.scrollTo({ top: Math.max(0, hedef.offsetTop - 18), behavior: 'smooth' });
      });
    });

    /* ---- daralt tutamağı ---- */
    var DAR = 'dm_fit_admin_dar';
    var grip = document.getElementById('saDivider');
    function daraltUygula(d){
      document.body.classList.toggle('sa-collapsed', d);
      if (grip){
        grip.setAttribute('aria-label', d ? 'Menüyü genişlet' : 'Menüyü daralt');
        grip.setAttribute('aria-expanded', d ? 'false' : 'true');
      }
      try { localStorage.setItem(DAR, d ? '1' : '0'); } catch (e) {}
    }
    var dar = false;
    try { dar = localStorage.getItem(DAR) === '1'; } catch (e) {}
    if (dar) document.body.classList.add('sa-collapsed');
    daraltUygula(dar);
    if (grip) grip.addEventListener('click', function(){
      daraltUygula(!document.body.classList.contains('sa-collapsed'));
    });

    /* ---- hesap açılır menüsü ---- */
    var me = document.getElementById('admMe');
    var meMenu = document.getElementById('admMeMenu');
    if (me && meMenu){
      me.addEventListener('click', function (e) {
        e.stopPropagation();
        var acik = meMenu.classList.toggle('open');
        me.setAttribute('aria-expanded', acik ? 'true' : 'false');
      });
      document.addEventListener('click', function () {
        meMenu.classList.remove('open'); me.setAttribute('aria-expanded','false');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape'){ meMenu.classList.remove('open'); me.setAttribute('aria-expanded','false'); }
      });
    }

    /* ---- yönetimde arama ---- */
    var ara = document.getElementById('admAra');
    var pop = document.getElementById('admAraPop');
    if (ara && pop){
      var duz = [];
      MENU.forEach(function (g) {
        g.kalem.forEach(function (x) { duz.push({ ad:x.ad, href:x.href, ico:x.ico, bolum:g.bolum || 'Genel Bakış' }); });
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
              '<small>' + esc(x.bolum) + '</small></a>';
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
        if (!e.target.closest || !e.target.closest('.pnl-search')) kapat();
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
        /* 🔴 R19 · GİZLİ SEKMEDEKİ ZORUNLU ALAN TUZAĞI — kabukta çözüldü.
           ÖLÇÜLDÜ (`admin-yazma-kapisi.mjs`, 3 ekranda): form içi sekme
           kipinde `required` bir alan KAPALI panelde kalırsa tarayıcı
           "An invalid form control … is not focusable" atıyor;
           `reportValidity()` false dönmüyor, **istisna** atıyor ve
           doğrulama yarıda kalıyor. Sonucu bu depodaki en sinsi yalan:
           ekran hiçbir şey doğrulamadan "Form doğrulandı" diyor.

           ⚠ İLK DENEMEM YANLIŞTI ve ölçüm söyledi: geçersiz alanın
           sekmesine tıklamak ÖTEKİ panelleri gizliyor, yani ikinci
           panelde duran ikinci geçersiz alan yine odaklanamıyordu.
           Doğrusu: önce HEPSİNİ aç, doğrula, sonra ilk geçersiz alanın
           sekmesini seç. Tarayıcı böylece bütün formu görüyor. */
        var kapali = [];
        f.querySelectorAll('.sa-form-panel[hidden]').forEach(function (pn) {
          kapali.push(pn); pn.hidden = false;
        });
        var gecti = false;
        try { gecti = f.reportValidity(); }
        catch (hata) {
          console.warn('[FIT_ADMIN.maketKaydet] reportValidity istisna attı:', hata && hata.message);
          gecti = false;
        }
        if (gecti) {
          kapali.forEach(function (pn) { pn.hidden = true; });   /* eski hâline dön */
        } else {
          /* İlk geçersiz alanın sekmesini seç, ötekileri kapat —
             kullanıcı eksiği nerede olduğunu görsün. */
          var ilk = f.querySelector(':invalid');
          var panel = ilk && ilk.closest ? ilk.closest('.sa-form-panel') : null;
          var anahtar = panel && panel.getAttribute('data-form-panel');
          var sekme = anahtar && document.querySelector('.sa-form-tab[data-panel="' + anahtar + '"]');
          if (sekme) sekme.click();
          else kapali.forEach(function (pn) { if (pn !== panel) pn.hidden = true; });
          if (ilk && ilk.focus) ilk.focus();

          /* Hata notu BAŞARI notundan AYRI sınıftadır (`.adm-maket-hata`).
             Aynı sınıfı paylaşsalardı "not basıldı mı" diye ölçen kapı
             dürüst bir hata mesajını yalan sayardı — ölçüldü, saydı. */
          var uy = dugme.parentNode.querySelector('.adm-maket-hata');
          if (!uy) {
            uy = document.createElement('span');
            uy.className = 'adm-maket-hata';
            uy.style.cssText = 'font-size:12.5px;font-weight:600;color:var(--hs-danger);display:inline-flex;align-items:center;gap:7px';
            dugme.parentNode.appendChild(uy);
          }
          var eksik = f.querySelectorAll(':invalid').length;
          uy.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ' +
            eksik + ' zorunlu alan eksik — ' + esc(ne) + ' doğrulanmadı.';
          var eskiNot = dugme.parentNode.querySelector('.adm-maket-not');
          if (eskiNot) eskiNot.remove();
          return;
        }
        var eskiUy = dugme.parentNode.querySelector('.adm-maket-hata');
        if (eskiUy) eskiUy.remove();
        var not = dugme.parentNode.querySelector('.adm-maket-not');
        if (!not){
          not = document.createElement('span');
          not.className = 'adm-maket-not';
          not.style.cssText = 'font-size:12.5px;font-weight:600;color:var(--hs-warn);display:inline-flex;align-items:center;gap:7px';
          dugme.parentNode.appendChild(not);
        }
        not.style.color = 'var(--hs-warn)';
        not.innerHTML = '<i class="fa-solid fa-circle-info" aria-hidden="true"></i> ' +
          'Form doğrulandı — ' + esc(ne) + ' KAYDEDİLMEDİ. Bu prototipte sunucu yok.';
      });
    }
  };


  /* ==================================================================
     ORTAK BİLEŞEN KATMANI — R19
     ------------------------------------------------------------------
     Kaynak ölçümü: `docs/gastro-olcum/ortak-bilesenler.md`. Gastro'nun
     `sa-ui.js` ailesi YAPI olarak alındı, kod olarak değil. Ölçülmüş üç
     kusuru burada tekrarlanmadı (CSS §20 başlığında sayıldı): üç kopya
     modal CSS'i, CSS'siz `danger` flash'ı, merkezî olmayan sıralama.

     Sabitler Gastro'dan birebir: toast 2600 ms / çıkış 260 ms · onay
     kapanış 220 ms · token menüsü 248px / debounce 250 ms / yerel limit 40
     · sıralama animasyonu 150 ms · z-index 60 / 200 / 205 / 210.
     ================================================================== */

  var SBT = { toastMs:2600, toastCik:260, onayKapan:220, tokenLimit:40, tokenDebounce:250 };

  /* ---- TOAST — Gastro `saToast` -------------------------------------
     Gövde her tipte koyu; tip yalnız ikon rengini değiştirir. */
  var toastKap = null;
  function toast(metin, ayar){
    ayar = ayar || {};
    if (!toastKap){
      toastKap = document.createElement('div');
      toastKap.className = 'sa-toast-wrap';
      document.body.appendChild(toastKap);
    }
    var tip = ayar.tip || 'ok';
    var ico = ayar.ico || (tip === 'danger' ? 'fa-circle-exclamation'
                        : tip === 'info'   ? 'fa-circle-info' : 'fa-circle-check');
    var d = document.createElement('div');
    d.className = 'sa-toast' + (tip !== 'ok' ? ' ' + tip : '');
    d.setAttribute('role', tip === 'danger' ? 'alert' : 'status');
    var i = document.createElement('i'); i.className = 'fa-solid ' + ico; i.setAttribute('aria-hidden','true');
    var s = document.createElement('span'); s.textContent = metin;   /* textContent — XSS yüzeyi yok */
    d.appendChild(i); d.appendChild(s); toastKap.appendChild(d);
    requestAnimationFrame(function(){ d.classList.add('show'); });
    setTimeout(function(){
      d.classList.remove('show');
      setTimeout(function(){ if (d.parentNode) d.parentNode.removeChild(d); }, SBT.toastCik);
    }, ayar.ms || SBT.toastMs);
    return d;
  }

  /* ---- ONAY MODALI — Gastro `saConfirm` -----------------------------
     TEK tanım (Gastro'da CSS üç kopya). Escape · perde · Vazgeç kapatır;
     açılışta ONAY düğmesi odağı alır; kapanınca tetikleyene döner. */
  function onay(ayar){
    ayar = ayar || {};
    var tetik = document.activeElement;
    var yikici = !!ayar.yikici;
    var ov = document.createElement('div');
    ov.className = 'sa-ov sa-modal-ov';
    var m = document.createElement('div');
    m.className = 'sa-modal' + (yikici ? ' danger' : '');
    m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');

    var ik = document.createElement('div'); ik.className = 'sa-modal-ico';
    ik.innerHTML = '<i class="fa-solid ' + (ayar.ico || (yikici ? 'fa-trash-can' : 'fa-circle-question')) + '" aria-hidden="true"></i>';
    var h = document.createElement('h3'); h.textContent = ayar.baslik || 'Emin misin?';
    var p = document.createElement('p'); p.textContent = ayar.metin || '';
    var ac = document.createElement('div'); ac.className = 'sa-modal-acts';
    var iptal = document.createElement('button');
    iptal.type = 'button'; iptal.className = 'btn btn-ghost'; iptal.textContent = ayar.iptal || 'Vazgeç';
    var tamam = document.createElement('button');
    tamam.type = 'button';
    tamam.className = 'btn ' + (yikici ? 'btn-danger' : 'btn-primary');
    tamam.textContent = ayar.onayla || (yikici ? 'Sil' : 'Onayla');
    ac.appendChild(iptal); ac.appendChild(tamam);
    m.appendChild(ik); m.appendChild(h); if (ayar.metin) m.appendChild(p); m.appendChild(ac);
    ov.appendChild(m); document.body.appendChild(ov);
    m.setAttribute('aria-label', h.textContent);

    if (kok.FIT_SHELL && FIT_SHELL.lockScroll) FIT_SHELL.lockScroll();
    requestAnimationFrame(function(){ ov.classList.add('open'); tamam.focus(); });

    function kapat(){
      ov.classList.remove('open');
      document.removeEventListener('keydown', tus, true);
      setTimeout(function(){
        if (ov.parentNode) ov.parentNode.removeChild(ov);
        if (kok.FIT_SHELL && FIT_SHELL.unlockScroll) FIT_SHELL.unlockScroll();
        if (tetik && tetik.focus) tetik.focus();
      }, SBT.onayKapan);
    }
    /* Odak tuzağı — modal açıkken Tab iki düğme arasında döner. */
    function tus(e){
      if (e.key === 'Escape'){ e.preventDefault(); kapat(); return; }
      if (e.key !== 'Tab') return;
      var od = [iptal, tamam];
      var ix = od.indexOf(document.activeElement);
      e.preventDefault();
      od[(ix + (e.shiftKey ? -1 : 1) + od.length) % od.length].focus();
    }
    document.addEventListener('keydown', tus, true);
    ov.addEventListener('mousedown', function(e){ if (e.target === ov) kapat(); });
    iptal.addEventListener('click', kapat);
    tamam.addEventListener('click', function(){ kapat(); if (ayar.onay) ayar.onay(); });
    return { kapat: kapat };
  }

  /* ---- YIKICI EYLEM DELEGESİ — Gastro'nun ayırt edici deseni --------
     Belge geneli, CAPTURE fazında. Her ekranda ayrı `onclick` yazılmaz:
     `data-yikici="…"` taşıyan her düğme kendiliğinden onay ister.
     `data-onaysiz` ile tek tek muaf tutulur (Gastro'da 64 kullanım).
     🔴 Native `confirm()` bu depoda da YASAK — Gastro'da doğrulandı
     (`resources/views/admin/**` altında sıfır çağrı). */
  document.addEventListener('click', function (e) {
    var d = e.target.closest && e.target.closest('[data-yikici]');
    if (!d || d.hasAttribute('data-onaysiz') || d.__onaylandi) return;
    e.preventDefault(); e.stopPropagation();
    var ad = d.getAttribute('data-yikici') || 'Bu kayıt';
    var fiil = d.getAttribute('data-fiil') || 'sil';
    var METIN = {
      sil:    ['Silinsin mi?',        '“' + ad + '” kalıcı olarak silinecek. Bu işlem geri alınamaz.', 'Sil'],
      arsiv:  ['Arşivlensin mi?',     '“' + ad + '” arşive taşınacak; yayından kalkar ama silinmez.',  'Arşivle'],
      yayin:  ['Yayından kalksın mı?','“' + ad + '” public tarafta görünmeyi bırakacak.',              'Yayından kaldır'],
      reddet: ['Reddedilsin mi?',     '“' + ad + '” reddedilecek ve başvuru sahibine bildirilecek.',   'Reddet'],
      iade:   ['İade edilsin mi?',    '“' + ad + '” için iade başlatılacak. K5 gereği komisyon geri gitmez.', 'İade et']
    };
    var t = METIN[fiil] || METIN.sil;
    onay({
      yikici: true, baslik: t[0], metin: t[1], onayla: t[2],
      onay: function () {
        /* Yeniden tetikle — bayrakla, delege ikinci kez yakalamasın. */
        d.__onaylandi = true;
        d.click();
        d.__onaylandi = false;
      }
    });
  }, true);

  /* ---- FLASH ŞERİDİ -------------------------------------------------
     Gastro'da server-render; burada JS'ten de basılabilir. DÖRT tip de
     CSS'te tanımlı (Gastro'da `danger` inline stildi — ölçüldü). */
  function flash(tip, metin, kap){
    var s = document.createElement('div');
    s.className = 'sa-flash is-' + (tip || 'ok');
    s.setAttribute('role', tip === 'error' ? 'alert' : 'status');
    var ico = tip === 'error' ? 'fa-triangle-exclamation'
            : tip === 'warn'  ? 'fa-circle-exclamation'
            : tip === 'note'  ? 'fa-circle-info' : 'fa-circle-check';
    s.innerHTML = '<i class="fa-solid ' + ico + '" aria-hidden="true"></i>';
    var b = document.createElement('div'); b.textContent = metin; s.appendChild(b);
    var x = document.createElement('button');
    x.type = 'button'; x.className = 'fl-x'; x.setAttribute('aria-label','Bildirimi kapat');
    x.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    x.addEventListener('click', function(){ if (s.parentNode) s.parentNode.removeChild(s); });
    s.appendChild(x);
    var hedef = kap || document.querySelector('.adm-page');
    if (hedef) hedef.insertBefore(s, hedef.firstChild);
    return s;
  }

  /* ---- ÇOKLU SEÇİM / ETİKET — Gastro `.ms-*` ------------------------
     Gizli input HER ZAMAN basılır; çip yalnız görünümdür (POST'u gizli
     input taşır). Türkçe katlama `toLocaleLowerCase('tr')` — düz
     `toLowerCase()` 'İ'yi katlamıyor ve "İzmir" araması eşleşmiyordu
     (Gastro'nun ölçülmüş kusuru, aynı çözüm).
     🔴 FİT EKİ: `serbest:true` kipi. Gastro'nun admin `.ms-*` kitinde
     serbest değer ekleme YOK; public tarafında var. Etiket alanları
     katalogla sınırlı olamayacağı için admin'e taşındı. */
  function etiket(kok_, ayar){
    var el = typeof kok_ === 'string' ? document.querySelector(kok_) : kok_;
    if (!el) return null;
    ayar = ayar || {};
    var katalog = ayar.katalog || [];       /* [{id,ad,ico}] */
    var ad = ayar.ad || el.getAttribute('data-name') || 'etiket[]';
    var ico = ayar.ico || el.getAttribute('data-icon') || '';
    var serbest = !!ayar.serbest;
    var tekli = !!ayar.tekli;
    var secili = (ayar.secili || []).slice();

    el.classList.add('ms-field');
    el.innerHTML = '<div class="ms-box"><input class="ms-search" type="text" ' +
      'placeholder="' + esc(ayar.ipucu || 'Ara ve seç…') + '" ' +
      'aria-label="' + esc(ayar.ipucu || 'Ara ve seç…') + '" autocomplete="off" ' +
      'role="combobox" aria-expanded="false"></div><div class="ms-menu" role="listbox"></div>';
    var kutu = el.querySelector('.ms-box');
    var girdi = el.querySelector('.ms-search');
    var menu = el.querySelector('.ms-menu');
    var imlec = -1;

    function bul(id){
      for (var i = 0; i < katalog.length; i++) if (String(katalog[i].id) === String(id)) return katalog[i];
      return { id:id, ad:id };
    }
    function cipCiz(){
      Array.prototype.slice.call(kutu.querySelectorAll('.ms-chip,input[type=hidden]'))
        .forEach(function(n){ n.parentNode.removeChild(n); });
      secili.forEach(function(id){
        var o = bul(id);
        var c = document.createElement('span');
        c.className = 'ms-chip';
        c.innerHTML = (ico ? '<i class="fa-solid ' + ico + ' ms-ico" aria-hidden="true"></i>' : '') +
          '<span></span><button type="button" class="ms-x" aria-label="' + esc(o.ad) + ' kaldır">' +
          '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';
        c.querySelector('span').textContent = o.ad;
        c.querySelector('.ms-x').addEventListener('click', function(e){
          e.stopPropagation(); kaldir(id);
        });
        kutu.insertBefore(c, girdi);
        var g = document.createElement('input');
        g.type = 'hidden'; g.name = ad; g.value = id;
        kutu.insertBefore(g, girdi);
      });
    }
    function degisti(){
      cipCiz();
      el.dispatchEvent(new CustomEvent('ms:change', { bubbles:true, detail:{ ids: secili.slice() } }));
    }
    function ekle(id){
      if (tekli) secili = [id];
      else if (secili.indexOf(id) < 0) secili.push(id);
      girdi.value = ''; degisti(); ciz();
    }
    function kaldir(id){
      secili = secili.filter(function(x){ return String(x) !== String(id); });
      degisti(); ciz();
    }
    function ciz(){
      var q = girdi.value.trim().toLocaleLowerCase('tr');
      var liste = katalog.filter(function(o){
        return !q || String(o.ad).toLocaleLowerCase('tr').indexOf(q) >= 0;
      }).slice(0, SBT.tokenLimit);
      menu.innerHTML = '';
      liste.forEach(function(o, i){
        var on = secili.indexOf(o.id) >= 0;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ms-opt' + (on ? ' is-sel' : '') + (i === imlec ? ' kbd-active' : '');
        b.setAttribute('role','option'); b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.innerHTML = (o.ico || ico ? '<i class="fa-solid ' + (o.ico || ico) + '" aria-hidden="true"></i>' : '') +
          '<span></span><i class="fa-solid fa-check ms-check" aria-hidden="true"></i>';
        b.querySelector('span').textContent = o.ad;
        /* mousedown — click DEĞİL: blur menüyü kapatmadan önce yakalanmalı. */
        b.addEventListener('mousedown', function(e){
          e.preventDefault();
          if (on) kaldir(o.id); else ekle(o.id);
        });
        menu.appendChild(b);
      });
      if (!liste.length){
        var bos = document.createElement('div');
        bos.className = 'ms-empty';
        bos.textContent = serbest && q
          ? 'Listede yok — eklemek için Enter’a bas.'
          : 'Eşleşen seçenek yok';
        menu.appendChild(bos);
      }
    }
    function ac(a){
      menu.classList.toggle('show', a);
      kutu.classList.toggle('is-open', a);
      girdi.setAttribute('aria-expanded', a ? 'true' : 'false');
      if (a) ciz(); else imlec = -1;
    }
    kutu.addEventListener('click', function(){ girdi.focus(); ac(true); });
    girdi.addEventListener('focus', function(){ ac(true); });
    girdi.addEventListener('input', function(){ imlec = -1; ciz(); });
    girdi.addEventListener('keydown', function(e){
      var opt = menu.querySelectorAll('.ms-opt');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
        if (!opt.length) return;
        e.preventDefault();
        imlec += (e.key === 'ArrowDown' ? 1 : -1);
        if (imlec < 0) imlec = opt.length - 1;
        if (imlec >= opt.length) imlec = 0;
        ciz(); menu.querySelectorAll('.ms-opt')[imlec].scrollIntoView({ block:'nearest' });
      } else if (e.key === 'Enter'){
        e.preventDefault();
        if (imlec >= 0 && opt[imlec]) { opt[imlec].dispatchEvent(new MouseEvent('mousedown')); return; }
        var q = girdi.value.trim();
        if (serbest && q){
          var yeni = { id:q, ad:q };
          if (!katalog.some(function(o){ return String(o.id) === q; })) katalog.push(yeni);
          ekle(q);
        }
      } else if (e.key === 'Backspace' && !girdi.value && secili.length){
        kaldir(secili[secili.length - 1]);
      } else if (e.key === 'Escape'){ ac(false); girdi.blur(); }
    });
    document.addEventListener('click', function(e){
      if (!el.contains(e.target)) ac(false);
    });
    degisti();
    return {
      deger: function(){ return secili.slice(); },
      ayarla: function(v){ secili = (v || []).slice(); degisti(); }
    };
  }

  /* ---- SIRALAMA — MERKEZÎ sürücü ------------------------------------
     🔴 Gastro'da SortableJS 1.15.2 CDN'den geliyor ama merkezî değil:
     altı ekran kendi `Sortable.create` satırını basıyor (15 çağrı) ve
     `defer` tuzağı beş formda ayrı ayrı çözülmüş (`whenSortableReady`).
     Burada tek sürücü, kütüphanesiz — buildless depoya CDN bağımlılığı
     eklemeden. HTML5 sürükle-bırak + KLAVYE (Gastro'nunkinde klavye yok;
     faresiz kullanıcı sırayı hiç değiştiremiyordu).
     Sıra DOM sırasından türer, `[data-field="position"]` 0'dan yazılır. */
  function sirala(kap, ayar){
    var el = typeof kap === 'string' ? document.querySelector(kap) : kap;
    if (!el) return null;
    ayar = ayar || {};
    var oge = ayar.oge || '.st-card';
    var tut = ayar.tutamak || '.ie-drag';
    var suru = null;

    function ogeler(){ return Array.prototype.slice.call(el.querySelectorAll(':scope > ' + oge)); }
    function yenidenNumarala(){
      ogeler().forEach(function(n, i){
        var s = n.querySelector('.st-num, .iu-pos');
        if (s) s.textContent = i + 1;
        var p = n.querySelector('[data-field="position"], .iu-pos-input');
        if (p) p.value = i;
      });
      if (ayar.degisti) ayar.degisti(ogeler());
    }
    function tasi(n, yon){
      var l = ogeler(), i = l.indexOf(n), j = i + yon;
      if (i < 0 || j < 0 || j >= l.length) return;
      if (yon > 0) el.insertBefore(l[j], n); else el.insertBefore(n, l[j]);
      yenidenNumarala();
      var t = n.querySelector(tut); if (t) t.focus();
      toast('Sıra değişti — ' + (i + 1) + '. sıradan ' + (j + 1) + '. sıraya', { tip:'info', ms:1400 });
    }

    el.addEventListener('pointerdown', function(e){
      var t = e.target.closest && e.target.closest(tut);
      if (!t) return;
      var n = t.closest(oge); if (!n) return;
      n.setAttribute('draggable','true');
    });
    el.addEventListener('dragstart', function(e){
      var n = e.target.closest && e.target.closest(oge);
      if (!n) return;
      suru = n; n.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', ''); } catch (x) {}
    });
    el.addEventListener('dragover', function(e){
      if (!suru) return;
      e.preventDefault();
      var n = e.target.closest && e.target.closest(oge);
      if (!n || n === suru) return;
      ogeler().forEach(function(x){ x.classList.remove('is-over'); });
      n.classList.add('is-over');
      var k = n.getBoundingClientRect();
      var sonra = (e.clientY - k.top) > k.height / 2;
      el.insertBefore(suru, sonra ? n.nextSibling : n);
    });
    el.addEventListener('dragend', function(){
      if (!suru) return;
      suru.classList.remove('is-dragging');
      suru.removeAttribute('draggable');
      ogeler().forEach(function(x){ x.classList.remove('is-over'); });
      suru = null; yenidenNumarala();
    });
    /* Klavye — tutamak odaktayken ↑/↓ taşır. */
    el.addEventListener('keydown', function(e){
      var t = e.target.closest && e.target.closest(tut);
      if (!t) return;
      if (e.key === 'ArrowUp'){ e.preventDefault(); tasi(t.closest(oge), -1); }
      else if (e.key === 'ArrowDown'){ e.preventDefault(); tasi(t.closest(oge), 1); }
    });
    yenidenNumarala();
    return { yenile: yenidenNumarala };
  }

  /* ---- TEKRARLAYAN SATIR (repeater) ---------------------------------
     Gastro'nun `.st-card` + `.add-row` ikilisi. Şablon `<template>`de
     durur; `{i}` sıra numarasıyla değişir. Silme YIKICI delegesine
     bağlanmaz (henüz kaydedilmemiş satır kalıcı bir şey silmez). */
  function tekrar(ayar){
    var liste = typeof ayar.liste === 'string' ? document.querySelector(ayar.liste) : ayar.liste;
    var ekleD = typeof ayar.ekle === 'string' ? document.querySelector(ayar.ekle) : ayar.ekle;
    var sablon = typeof ayar.sablon === 'string' ? document.querySelector(ayar.sablon) : ayar.sablon;
    if (!liste || !sablon) return null;
    var s = sirala(liste, { oge: ayar.oge || '.st-card', degisti: ayar.degisti });
    var enAz = ayar.enAz || 0, enCok = ayar.enCok || 0;

    function tazele(){
      var n = liste.querySelectorAll(ayar.oge || '.st-card').length;
      if (ekleD) ekleD.disabled = (enCok > 0 && n >= enCok);
      liste.querySelectorAll('.ie-del').forEach(function(b){ b.disabled = (n <= enAz); });
    }
    function ekle(){
      var n = liste.querySelectorAll(ayar.oge || '.st-card').length;
      var html = sablon.innerHTML.replace(/\{i\}/g, n);
      var kutu = document.createElement('div');
      kutu.innerHTML = html.trim();
      var yeni = kutu.firstElementChild;
      liste.appendChild(yeni);
      s.yenile(); tazele();
      var ilk = yeni.querySelector('input,select,textarea');
      if (ilk) ilk.focus();
      return yeni;
    }
    if (ekleD) ekleD.addEventListener('click', function(e){ e.preventDefault(); ekle(); });
    liste.addEventListener('click', function(e){
      var d = e.target.closest && e.target.closest('.ie-del');
      if (!d) return;
      e.preventDefault();
      var n = d.closest(ayar.oge || '.st-card');
      if (n) n.parentNode.removeChild(n);
      s.yenile(); tazele();
    });
    tazele();
    return { ekle: ekle, tazele: tazele };
  }

  /* ---- ZENGİN METİN EDİTÖRÜ — `.adm-ed` -----------------------------
     🔴 TinyMCE'nin KENDİSİ gelmedi, SÖZLEŞMESİ geldi. Gerekçe
     `docs/fit-admin-plan.md` §11/D1. Araç çubuğu düğme listesi, sırası,
     ayraç yerleri, üç profil ve `block_formats` Gastro'nun
     `public/vendor/tinymce-config.js`inden BİREBİR — backend turu aynı
     config'i devralsın diye.

     Gastro'nun ölçülmüş iki kararı da taşındı:
       · `underline` gövde-blok profilinde BİLEREK yok (purifier `span`a
         izin vermediği için altı çizgi sessizce kayboluyordu — "editör
         kullanıcıya yalan söylerdi").
       · Submit'te içerik senkronu ZORUNLU (Gastro `triggerSave`); burada
         gizli textarea her `input`ta yazılır, unutulacak bir adım yok. */
  var ED_PROFIL = {
    varsayilan: {
      yukseklik: 420,
      bloklar: [['p','Paragraf'],['h2','Başlık 2'],['h3','Başlık 3'],['h4','Başlık 4'],['blockquote','Alıntı']],
      arac: ['undo','redo','|','blocks','|','bold','italic','underline','strikeThrough','|',
             'justifyLeft','justifyCenter','justifyRight','|','insertUnorderedList','insertOrderedList','outdent','indent','|',
             'blockquote','link','image','table','|','removeFormat','code']
    },
    satir: {
      yukseklik: 140,
      bloklar: null,
      arac: ['bold','italic','underline','|','link','|','removeFormat']
    },
    govde: {
      yukseklik: 420,
      bloklar: [['p','Paragraf'],['h2','Başlık 2'],['blockquote','Alıntı']],
      /* underline YOK — Gastro'nun gerekçesiyle aynı. */
      arac: ['undo','redo','|','blocks','|','bold','italic','|',
             'insertUnorderedList','insertOrderedList','|','blockquote','link','|','removeFormat','code']
    }
  };
  var ED_IKON = {
    undo:'fa-rotate-left', redo:'fa-rotate-right',
    bold:'fa-bold', italic:'fa-italic', underline:'fa-underline', strikeThrough:'fa-strikethrough',
    justifyLeft:'fa-align-left', justifyCenter:'fa-align-center', justifyRight:'fa-align-right',
    insertUnorderedList:'fa-list-ul', insertOrderedList:'fa-list-ol',
    outdent:'fa-outdent', indent:'fa-indent',
    blockquote:'fa-quote-left', link:'fa-link', image:'fa-image', table:'fa-table',
    removeFormat:'fa-eraser', code:'fa-code'
  };
  var ED_AD = {
    undo:'Geri al', redo:'İleri al', bold:'Kalın', italic:'İtalik', underline:'Altı çizili',
    strikeThrough:'Üstü çizili', justifyLeft:'Sola hizala', justifyCenter:'Ortala',
    justifyRight:'Sağa hizala', insertUnorderedList:'Madde listesi', insertOrderedList:'Numaralı liste',
    outdent:'Girintiyi azalt', indent:'Girintiyi artır', blockquote:'Alıntı', link:'Bağlantı',
    image:'Görsel ekle', table:'Tablo ekle', removeFormat:'Biçimi temizle', code:'Kaynağı gör'
  };

  function editor(alan, tip){
    var ta = typeof alan === 'string' ? document.querySelector(alan) : alan;
    if (!ta || ta.__edKuruldu) return null;
    var pr = ED_PROFIL[tip || ta.getAttribute('data-ed') || 'varsayilan'] || ED_PROFIL.varsayilan;

    var kutu = document.createElement('div');
    kutu.className = 'adm-ed' + (pr.yukseklik === 140 ? ' is-inline' : '');
    var bar = document.createElement('div');
    bar.className = 'adm-ed-bar'; bar.setAttribute('role','toolbar');
    bar.setAttribute('aria-label','Metin biçimlendirme');
    var yuz = document.createElement('div');
    yuz.className = 'adm-ed-yuz';
    yuz.contentEditable = 'true';
    yuz.setAttribute('role','textbox'); yuz.setAttribute('aria-multiline','true');
    yuz.setAttribute('aria-label', ta.getAttribute('aria-label') || ta.getAttribute('placeholder') || 'İçerik');
    yuz.setAttribute('data-bos', ta.getAttribute('placeholder') || 'Yazmaya başla…');
    yuz.innerHTML = ta.value || '';
    var ayak = document.createElement('div');
    ayak.className = 'adm-ed-ayak';
    ayak.innerHTML = '<span><b class="ed-kelime">0</b> kelime</span><span><b class="ed-karakter">0</b> karakter</span>';

    pr.arac.forEach(function(k){
      if (k === '|'){
        var s = document.createElement('span'); s.className = 'adm-ed-sep'; s.setAttribute('aria-hidden','true');
        bar.appendChild(s); return;
      }
      if (k === 'blocks'){
        if (!pr.bloklar) return;
        var sel = document.createElement('select');
        sel.className = 'adm-ed-sel'; sel.setAttribute('aria-label','Blok biçimi');
        pr.bloklar.forEach(function(b){
          var o = document.createElement('option'); o.value = b[0]; o.textContent = b[1]; sel.appendChild(o);
        });
        sel.addEventListener('change', function(){
          yuz.focus();
          document.execCommand('formatBlock', false, '<' + sel.value + '>');
          yaz();
        });
        bar.appendChild(sel); return;
      }
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'adm-ed-b';
      b.setAttribute('data-k', k);
      b.setAttribute('title', ED_AD[k] || k);
      b.setAttribute('aria-label', ED_AD[k] || k);
      b.innerHTML = '<i class="fa-solid ' + (ED_IKON[k] || 'fa-circle') + '" aria-hidden="true"></i>';
      b.addEventListener('mousedown', function(e){ e.preventDefault(); });
      b.addEventListener('click', function(){ komut(k); });
      bar.appendChild(b);
    });

    function komut(k){
      yuz.focus();
      if (k === 'blockquote'){ document.execCommand('formatBlock', false, '<blockquote>'); }
      else if (k === 'link'){
        var s = String(window.getSelection());
        var u = window.prompt('Bağlantı adresi', 'https://');
        if (!u) return;
        if (s) document.execCommand('createLink', false, u);
        else document.execCommand('insertHTML', false, '<a href="' + esc(u) + '">' + esc(u) + '</a>');
      }
      else if (k === 'image'){
        /* Gastro'da editörden görsel yükleme yolu YOK (`images_upload_url`
           tanımsız), yalnız URL yapıştırılıyor. Fit'te medya kütüphanesi
           VAR — editör oraya bağlanır. Bu, Gastro'nun üstüne inşa. */
        medya({ tekli:true, sec:function(m){
          yuz.focus();
          document.execCommand('insertHTML', false,
            '<img src="' + esc(m[0].url) + '" alt="' + esc(m[0].alt || '') + '">');
          yaz();
        }});
        return;
      }
      else if (k === 'table'){
        var satir = '<tr>' + '<td>&nbsp;</td>'.repeat(3) + '</tr>';
        document.execCommand('insertHTML', false,
          '<table><thead><tr><th>Başlık</th><th>Başlık</th><th>Başlık</th></tr></thead><tbody>' +
          satir.repeat(2) + '</tbody></table><p><br></p>');
      }
      else if (k === 'code'){
        var ham = kutu.classList.toggle('is-kaynak');
        if (ham){ yuz.textContent = yuz.innerHTML; yuz.style.whiteSpace = 'pre-wrap'; yuz.style.fontFamily = 'ui-monospace,Menlo,monospace'; }
        else { yuz.innerHTML = yuz.textContent; yuz.style.whiteSpace = ''; yuz.style.fontFamily = ''; }
      }
      else document.execCommand(k, false, null);
      yaz(); durum();
    }
    function durum(){
      bar.querySelectorAll('.adm-ed-b[data-k]').forEach(function(b){
        var k = b.getAttribute('data-k');
        var acik = false;
        try { acik = document.queryCommandState(k); } catch (e) {}
        b.classList.toggle('is-on', !!acik);
        b.setAttribute('aria-pressed', acik ? 'true' : 'false');
      });
    }
    function yaz(){
      ta.value = kutu.classList.contains('is-kaynak') ? yuz.textContent : yuz.innerHTML;
      var d = yuz.textContent.trim();
      ayak.querySelector('.ed-kelime').textContent = d ? d.split(/\s+/).length : 0;
      ayak.querySelector('.ed-karakter').textContent = d.length;
    }
    yuz.addEventListener('input', yaz);
    yuz.addEventListener('keyup', durum);
    yuz.addEventListener('mouseup', durum);
    yuz.addEventListener('focus', function(){ kutu.classList.add('is-focus'); });
    yuz.addEventListener('blur', function(){ kutu.classList.remove('is-focus'); yaz(); });
    /* Yapıştırma DÜZ METİN — Word'den gelen `style` çöpü editörü kirletir. */
    yuz.addEventListener('paste', function(e){
      e.preventDefault();
      var t = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, t);
    });

    kutu.appendChild(bar); kutu.appendChild(yuz); kutu.appendChild(ayak);
    ta.classList.add('adm-ed-kaynak');
    ta.parentNode.insertBefore(kutu, ta.nextSibling);
    ta.__edKuruldu = true;
    /* Submit senkronu — Gastro'nun `triggerSave`i. Burada her `input`ta
       zaten yazılıyor; submit'te bir kez daha, geç odak kaybı için. */
    var f = ta.form;
    if (f) f.addEventListener('submit', yaz);
    yaz();
    return { yaz: yaz, deger: function(){ return ta.value; } };
  }

  /* ---- MEDYA KÜTÜPHANESİ — 🔴 GASTRO'DA YOK, KURULDU -----------------
     Ölçüm: `media-library|MediaLibrary|media.index` → 0 isabet · `alt_text`
     → 0 · klasörleme yok. Gastro'da görsel yalnız formun içindeki yükleme
     kutusundan gelir; bir daha bulunamaz, alt metni sorulmaz.

     Fit'te kütüphane bir VARLIK: klasör · arama · alt metin · yeniden
     kullanım · tekli/çoklu seçim. Beyar'ın kalemi: "yükleme, seçme,
     kırpma, alt metin, klasörleme".

     ⚠ DÜRÜSTLÜK: sunucu yok. Yüklenen dosya `URL.createObjectURL` ile
     yalnız SEKME ÖMRÜ boyunca yaşar ve panel bunu yazıyla söyler. */
  var MEDYA_KATALOG = null;
  function medyaKatalog(){
    if (MEDYA_KATALOG) return MEDYA_KATALOG;
    /* Katalog uydurulmadı — deponun kendi görsel klasörlerinden okundu. */
    MEDYA_KATALOG = (kok.FIT_MEDYA_VERI || []).slice();
    return MEDYA_KATALOG;
  }
  function medya(ayar){
    ayar = ayar || {};
    var tekli = !!ayar.tekli;
    var tetik = document.activeElement;
    var oge = medyaKatalog();
    var secili = [];
    var klasor = 'hepsi';
    var q = '';

    var ov = document.createElement('div');
    ov.className = 'sa-ov sa-modal-ov mk-ov';
    ov.innerHTML =
      '<div class="mk-panel" role="dialog" aria-modal="true" aria-label="Medya kütüphanesi">' +
        '<div class="mk-head">' +
          '<h3>Medya kütüphanesi</h3>' +
          '<div class="mk-ara"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
          '<input type="search" placeholder="Dosya adı ya da alt metinde ara…" aria-label="Medyada ara" autocomplete="off"></div>' +
        '</div>' +
        '<div class="mk-govde">' +
          '<div class="mk-klasor" role="tablist" aria-label="Klasörler"></div>' +
          '<div class="mk-icerik"><div class="mk-izgara" role="listbox" ' +
            (tekli ? '' : 'aria-multiselectable="true" ') + 'aria-label="Medya öğeleri"></div></div>' +
          '<div class="mk-yan"></div>' +
        '</div>' +
        '<div class="mk-ayak">' +
          '<span class="mk-say"></span>' +
          '<button type="button" class="btn btn-ghost mk-iptal">Vazgeç</button>' +
          '<button type="button" class="btn btn-primary mk-sec">Seç</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    if (kok.FIT_SHELL && FIT_SHELL.lockScroll) FIT_SHELL.lockScroll();
    requestAnimationFrame(function(){ ov.classList.add('open'); });

    var klKap = ov.querySelector('.mk-klasor');
    var izgara = ov.querySelector('.mk-izgara');
    var yan = ov.querySelector('.mk-yan');
    var sayEl = ov.querySelector('.mk-say');
    var araEl = ov.querySelector('.mk-ara input');

    function klasorler(){
      var m = { hepsi: oge.length };
      oge.forEach(function(o){ m[o.klasor] = (m[o.klasor] || 0) + 1; });
      return m;
    }
    function suzulmus(){
      var s = q.trim().toLocaleLowerCase('tr');
      return oge.filter(function(o){
        if (klasor !== 'hepsi' && o.klasor !== klasor) return false;
        if (!s) return true;
        return (o.ad + ' ' + (o.alt || '')).toLocaleLowerCase('tr').indexOf(s) >= 0;
      });
    }
    function klCiz(){
      var m = klasorler();
      klKap.innerHTML = '';
      Object.keys(m).forEach(function(k){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mk-kl' + (k === klasor ? ' is-on' : '');
        b.setAttribute('role','tab'); b.setAttribute('aria-selected', k === klasor ? 'true' : 'false');
        b.innerHTML = '<i class="fa-solid ' + (k === 'hepsi' ? 'fa-images' : 'fa-folder') + '" aria-hidden="true"></i>' +
          '<span></span><span class="mk-kl-n">' + m[k] + '</span>';
        b.querySelectorAll('span')[0].textContent = k === 'hepsi' ? 'Tüm medya' : k;
        b.addEventListener('click', function(){ klasor = k; klCiz(); ciz(); });
        klKap.appendChild(b);
      });
    }
    function yanCiz(){
      if (!secili.length){
        yan.innerHTML = '<div class="fhint">Bir öğe seç — alt metni ve ölçüsü burada görünür.</div>';
        return;
      }
      var o = secili[secili.length - 1];
      yan.innerHTML =
        '<div class="mk-onizle" style="background-image:url(' + esc(o.url) + ')" role="img" aria-label="' + esc(o.alt || o.ad) + '"></div>' +
        '<label for="mkAlt">Alt metin</label>' +
        '<input id="mkAlt" type="text" value="' + esc(o.alt || '') + '" placeholder="Görsel ne anlatıyor?">' +
        '<div class="fhint" style="margin-top:8px">Ekran okuyucu bunu okur. Boş bırakılan görsel erişilemez sayılır.</div>' +
        '<div class="fhint" style="margin-top:14px"><b>Dosya</b> ' + esc(o.ad) + '</div>' +
        '<div class="fhint"><b>Klasör</b> ' + esc(o.klasor) + '</div>' +
        (o.olcu ? '<div class="fhint"><b>Ölçü</b> ' + esc(o.olcu) + '</div>' : '');
      var alt = yan.querySelector('#mkAlt');
      alt.addEventListener('input', function(){ o.alt = alt.value; ciz(); });
    }
    function ciz(){
      var l = suzulmus();
      izgara.innerHTML = '';
      if (!l.length){
        izgara.style.display = 'block';
        izgara.innerHTML = API.bos('fa-image', 'Bu klasörde eşleşen görsel yok',
          'Aramayı temizle ya da başka bir klasör seç.');
      } else {
        izgara.style.display = '';
        l.forEach(function(o){
          var on = secili.indexOf(o) >= 0;
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'mk-oge' + (on ? ' is-sel' : '');
          b.setAttribute('role','option'); b.setAttribute('aria-selected', on ? 'true' : 'false');
          b.innerHTML = '<span class="mk-gorsel" style="background-image:url(' + esc(o.url) + ')"></span>' +
            '<span class="mk-ad"></span>' +
            (o.alt ? '' : '<span class="mk-alt-yok">alt metin yok</span>') +
            '<span class="mk-tik"><i class="fa-solid fa-check" aria-hidden="true"></i></span>';
          b.querySelector('.mk-ad').textContent = o.ad;
          b.addEventListener('click', function(){
            if (tekli) secili = [o];
            else if (on) secili = secili.filter(function(x){ return x !== o; });
            else secili.push(o);
            ciz(); yanCiz();
          });
          izgara.appendChild(b);
        });
      }
      sayEl.textContent = l.length + ' öğe' + (secili.length ? ' · ' + secili.length + ' seçili' : '');
      ov.querySelector('.mk-sec').disabled = !secili.length;
    }
    function kapat(){
      ov.classList.remove('open');
      document.removeEventListener('keydown', tus, true);
      setTimeout(function(){
        if (ov.parentNode) ov.parentNode.removeChild(ov);
        if (kok.FIT_SHELL && FIT_SHELL.unlockScroll) FIT_SHELL.unlockScroll();
        if (tetik && tetik.focus) tetik.focus();
      }, SBT.onayKapan);
    }
    function tus(e){ if (e.key === 'Escape'){ e.preventDefault(); kapat(); } }
    document.addEventListener('keydown', tus, true);
    ov.addEventListener('mousedown', function(e){ if (e.target === ov) kapat(); });
    ov.querySelector('.mk-iptal').addEventListener('click', kapat);
    ov.querySelector('.mk-sec').addEventListener('click', function(){
      var s = secili.slice(); kapat();
      if (ayar.sec) ayar.sec(s);
    });
    araEl.addEventListener('input', function(){ q = araEl.value; ciz(); });
    klCiz(); ciz(); yanCiz();
    setTimeout(function(){ araEl.focus(); }, 60);
    return { kapat: kapat };
  }

  /* ---- GÖRSEL YÜKLEME ALANI — Gastro `<x-admin.image-upload>` -------
     Ölçülmüş sabitler korundu: kutu 240px, döşeme 148×92.
     ⚠ Sunucu yok: dosya `createObjectURL` ile sekme ömrü kadar yaşar. */
  function yukle(kap, ayar){
    var el = typeof kap === 'string' ? document.querySelector(kap) : kap;
    if (!el) return null;
    ayar = ayar || {};
    var cok = !!ayar.cok;
    var enCok = ayar.enCok || (cok ? 8 : 1);
    var kabul = ayar.kabul || 'image/*';
    var dosyalar = [];

    el.innerHTML =
      '<div class="iu-drop" tabindex="0" role="button" aria-label="Görsel seç ya da sürükle">' +
        '<span class="iu-ico"><i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i></span>' +
        '<b>Görseli sürükle ya da seçmek için tıkla</b>' +
        '<small>' + esc(ayar.not || 'JPG · PNG · WebP · en çok ' + enCok + ' dosya. Kütüphaneden de seçebilirsin.') + '</small>' +
        '<span class="btn btn-ghost" style="pointer-events:none">Kütüphaneden seç</span>' +
      '</div>' +
      '<input type="file" hidden ' + (cok ? 'multiple ' : '') + 'accept="' + esc(kabul) + '">' +
      '<div class="iu-grid"></div>';
    var drop = el.querySelector('.iu-drop');
    var girdi = el.querySelector('input[type=file]');
    var izgara = el.querySelector('.iu-grid');
    var s = sirala(izgara, { oge:'.iu-tile', tutamak:'.iu-tile', degisti: ayar.degisti });

    function ciz(){
      izgara.innerHTML = '';
      dosyalar.forEach(function(d, i){
        var t = document.createElement('div');
        t.className = 'iu-tile';
        t.style.backgroundImage = 'url(' + d.url + ')';
        t.setAttribute('role','img'); t.setAttribute('aria-label', d.ad);
        t.innerHTML = '<span class="iu-pos">' + (i + 1) + '</span>' +
          '<button type="button" class="iu-x" aria-label="' + esc(d.ad) + ' kaldır">' +
          '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
          '<input type="hidden" data-field="position" value="' + i + '">';
        t.querySelector('.iu-x').addEventListener('click', function(){
          dosyalar = dosyalar.filter(function(x){ return x !== d; }); ciz();
        });
        izgara.appendChild(t);
      });
      s.yenile();
      if (ayar.degisti) ayar.degisti(dosyalar.slice());
    }
    function al(liste){
      Array.prototype.slice.call(liste).forEach(function(f){
        if (dosyalar.length >= enCok){ toast('En çok ' + enCok + ' dosya eklenebilir.', { tip:'danger' }); return; }
        dosyalar.push({ ad:f.name, url:URL.createObjectURL(f), alt:'' });
      });
      ciz();
      toast('Görsel eklendi — bu prototipte sunucu yok, dosya yalnız bu sekmede yaşar.', { tip:'info' });
    }
    drop.addEventListener('click', function(){
      medya({ tekli: !cok, sec: function(m){
        m.forEach(function(o){ if (dosyalar.length < enCok) dosyalar.push({ ad:o.ad, url:o.url, alt:o.alt }); });
        ciz();
      }});
    });
    drop.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); drop.click(); }
    });
    drop.addEventListener('dragover', function(e){ e.preventDefault(); drop.classList.add('is-over'); });
    drop.addEventListener('dragleave', function(){ drop.classList.remove('is-over'); });
    drop.addEventListener('drop', function(e){
      e.preventDefault(); drop.classList.remove('is-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length) al(e.dataTransfer.files);
    });
    girdi.addEventListener('change', function(){ al(girdi.files); girdi.value = ''; });
    return { deger: function(){ return dosyalar.slice(); } };
  }

  /* ---- SEO SKORU ----------------------------------------------------
     Gastro'nun `.seo-score` halkası ve ölçüt listesi zaten kabukta (§19).
     Bu, ÖLÇÜTLERİ tek yerden hesaplar; altı ekran ayrı ayrı yazmasın. */
  var SEO_OLCUT = [
    { ad:'Meta başlık 30–60 karakter', alan:'meta_title',  sina:function(v){ return v.length >= 30 && v.length <= 60; } },
    { ad:'Meta açıklama 70–160 karakter', alan:'meta_desc', sina:function(v){ return v.length >= 70 && v.length <= 160; } },
    { ad:'Slug yazılmış ve kısa', alan:'slug', sina:function(v){ return !!v && v.length <= 60; } },
    { ad:'Canonical adres verilmiş', alan:'canonical', sina:function(v){ return /^https?:\/\//.test(v); } },
    { ad:'Paylaşım görseli seçilmiş', alan:'og_image', sina:function(v){ return !!v; } },
    { ad:'Odak anahtar başlıkta geçiyor', alan:'focus', sina:function(v, f){
        var t = (f.meta_title || '').toLocaleLowerCase('tr');
        return !!v && t.indexOf(v.toLocaleLowerCase('tr')) >= 0; } }
  ];
  function seo(form, kutu){
    var f = typeof form === 'string' ? document.querySelector(form) : form;
    var k = typeof kutu === 'string' ? document.querySelector(kutu) : kutu;
    if (!f || !k) return null;
    function hesapla(){
      var v = {};
      SEO_OLCUT.forEach(function(o){
        var el = f.querySelector('[name="' + o.alan + '"]');
        v[o.alan] = el ? String(el.value || '').trim() : '';
      });
      var gecen = 0;
      var sat = SEO_OLCUT.map(function(o){
        var ok = false;
        try { ok = o.sina(v[o.alan], v); } catch (e) {}
        if (ok) gecen++;
        return '<div class="seo-chk ' + (ok ? 'pass' : 'fail') + '">' +
          '<i class="fa-solid ' + (ok ? 'fa-circle-check' : 'fa-circle') + '" aria-hidden="true"></i>' +
          esc(o.ad) + '</div>';
      }).join('');
      var p = Math.round(gecen / SEO_OLCUT.length * 100);
      k.innerHTML =
        '<div class="seo-score"><div class="score-ring" style="--p:' + p + '">' +
        '<span class="score-num">' + p + '</span></div>' +
        '<div class="score-meta"><b>' + gecen + ' / ' + SEO_OLCUT.length + ' ölçüt geçti</b>' +
        '<span>Alanları doldurdukça yükselir</span></div></div>' +
        '<div class="seo-checks">' + sat + '</div>';
      return p;
    }
    f.addEventListener('input', hesapla);
    f.addEventListener('change', hesapla);
    hesapla();
    return { hesapla: hesapla };
  }


  API.toast   = toast;
  API.onay    = onay;
  API.flash   = flash;
  API.etiket  = etiket;
  API.sirala  = sirala;
  API.tekrar  = tekrar;
  API.editor  = editor;
  API.medya   = medya;
  API.yukle   = yukle;
  API.seo     = seo;
  API.SBT     = SBT;

  kok.FIT_ADMIN = API;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();

})(window);
