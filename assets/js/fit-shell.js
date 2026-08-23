/* =====================================================================
 DADAFIT — ORTAK KABUK JS (TEK KAYNAK)
 ---------------------------------------------------------------------
 Bu dosya DadaFit public sayfalarının ortak kabuğunu (üst bant, header,
 ana menü, mobil drawer, mobil alt bar, görüş bildir, çerez, giriş kapısı,
 footer, başa dön) TEK YERDEN üretir ve davranışını kurar.

 Menüye kalem eklemek = aşağıdaki NAV / BOTTOM / FOOTER_COLS dizilerinde
 TEK satır. Sayfa dosyalarına kabuk markup'ı KOPYALANMAZ.
 Desen kaynağı: assets/js/sa-shell.js (yönetim paneli bölüm listesi).
 Eşi: assets/css/fit-shell.css

 Sayfa sözleşmesi:
 <body data-brand="fit" data-fit-page="<anahtar>">
 <div id="fitShellTop"></div>
 <main class="page-main" id="pageMain"> … </main>
 <div id="fitShellBottom"></div>
 <script src="assets/js/fit-shell.js"></script>
 <script> … sayfa JS … </script>
 data-fit-page verilmezse dosya adından çözülür.
 ===================================================================== */
(function(){
'use strict';

/* ============================================================
 1 · TEK MENÜ LİSTESİ
 ============================================================ */
/* ------------------------------------------------------------------
 MENÜ SÖZLEŞMESİ (2026 revizyon · DadaDiet header mantığı)
 · Bir hedefe YALNIZ BİR kalem gider. Aynı sayfaya farklı adla ikinci
 bir kapı açılmaz (ölçüm: eski menüde 5 kalem 2 hedefe gidiyordu,
 buna karşılık 7 gerçek rehber sayfası menüde hiç yoktu).
 · Paneli olan başlık da GERÇEK bağlantıdır: panel hover ile açılır,
 başlığa tıklanınca kendi merkez sayfasına gidilir.
 · Panelsiz başlık chevron TAŞIMAZ (dd yok → düz link).
 ------------------------------------------------------------------ */
/* ============================================================
 EKOSİSTEM ADRESLERİ — belge §14
 ------------------------------------------------------------
 "Doğrudan başka prototiplerin HTML sayfalarına bağımlı bağlantılar
 oluşturma · entegrasyonlar yapılandırılabilir servis adresleri üzerinden
 tasarlanmalıdır." Statik prototipte bunun karşılığı: adresler sayfalara
 ve markup'a gömülmez, TEK yerden okunur. Gerçek servis adresleri
 belirlendiğinde yalnız bu nesne değişir.

 DadaFit'in KENDİ akışları (giriş, hesap, çıkış, Planım) buraya BAKMAZ —
 bağımsız görünmesi gerekiyor (belge §1). Burada yalnız kardeş ürünlere
 giden kontrollü ekosistem kapıları var.
 ============================================================ */
/* Kardeş ürünlerin servis kökü. Gerçek adres belirlendiğinde YALNIZ bu satır
   değişir — sayfalara dokunulmaz (aşağıdaki yeniden yazma katmanı sayesinde). */
var ECO_BASE = 'https://by4r.github.io/dadamutfak-view/v7-6cu356/';
var ECO = {
  base:    ECO_BASE,
  gastro:  ECO_BASE + 'anasayfa-portal-v3a.html',
  diet:    ECO_BASE + 'saglik-hub-v1.html',
  gourmet: ECO_BASE + 'kesfet-v1.html',
  campus:  ECO_BASE + 'akademi-v1.html'
};
/* DadaFit'in kendi çıkış hedefi — eskiden DadaMutfak portalına gidiyordu. */
var FIT_LOGOUT = 'dadafit-hub-v1.html?auth=0';

var NAV = [
  /* 1 · HAREKET — DadaFit Egzersizleri ile Hareket Rehberi bu şemsiye altında (belge §3.1).
 Rehberin yedi alt sayfası artık menüde: eskiden yalnız ?bolge= varyantlarıyla
 kütüphaneye giden dört kopya kalem vardı, gerçek sayfalar erişilemezdi. */
  /* R8 madde 4 — `hareket-merkezi-v1` KALDIRILDI (sayfa silindi).
     Bölümün kök hedefi artık DadaFit Egzersizleri: kalan sayfalar içinde
     bölümün asıl varış noktası o (h1 "DadaFit Egzersizleri"). */
  { key:'hareket', label:'Hareket', href:'egzersiz-kutuphane-v1.html', icon:'fa-solid fa-person-running',
    match:['egzersiz-kutuphane-v1','egzersiz-detay-v1','hareket-rehberi-v1',
           'hareket-yeni-baslayanlar-v1','hareket-dogru-form-v1','hareket-sureye-gore-v1',
           'hareket-hedefe-gore-v1','hareket-bolgeye-gore-v1','hareket-masa-basi-v1',
           'hareket-isinma-soguma-v1','hareket-sozluk-v1',
           /* K34 · "Hareketi Anlamak" grubunun sayfaları — aktif durum bu kalemde
              toplanıyor, üst menüde AYRI bir kalem açılmıyor. */
           'sozluk-v1','sozluk-detay-v1','anatomi-v1','antrenman-olusturucu-v1'],
    /* PANEL ÜÇ KALEM, TEK KOLON (kullanıcı kararı — KARARLAR.md K7).
       Panel önce iki kolonlu 11 kalemdi (belge §2'nin listesi). Yedi "rehber
       konusu" + sözlük panelden çıkarıldı: bunlar zaten Hareket Rehberi
       sayfasının İÇERİĞİ ve o sayfa sekizinin de kartını taşıyor
       (ölçüldü: hareket-rehberi-v1.html sekiz hedefin sekizine de link veriyor).
       Menüde tekrarlanmaları paneli şişiriyordu; erişim kaybı YOK, bir tık
       derinleşti. Panel tek kolona indiği için `wide:true` de kalktı. */
    dd:[
      /* R8 madde 4 — "Hareket Merkezi" kalemi KALDIRILDI (sayfa silindi). */
      {label:'DadaFit Egzersizleri', desc:'Tek tek hareketleri bul ve uygula', href:'egzersiz-kutuphane-v1.html', icon:'fa-solid fa-dumbbell'},
      {label:'Hareket Rehberi', desc:'Nasıl ve neden — yedi rehber konusu ve sözlük', href:'hareket-rehberi-v1.html', icon:'fa-solid fa-book-open'},
      /* ---- K34 · "HAREKETİ ANLAMAK" — ETİKETLİ GRUP, AYRI MENÜ KALEMİ DEĞİL ----
         Karar: üç yeni modül (sözlük · anatomi · antrenman oluşturucu) üst
         menüde kendi başlıklarını ALMAZ; Hareket kaleminin altında tek bir
         etiketli grup olur. Böylece üst menü kalem sayısı beşte kalır ve
         panelin tek kolonlu yapısı (K7) bozulmaz.

         NASIL ÇÖZÜLDÜ: dizi zaten düz kalemi destekliyordu — `navHtml()`
         `d.group` gelirse `<div class="dd-group">` basıyor (fit-shell.js
         satır ~373) ve `.dd-group` biçimi CSS'te hazırdı (fit-shell.css
         satır 466 ve 1054). Yani üreticiye masaüstü tarafında hiçbir ek
         yapılmadı. Tek değişiklik drawer tarafında: `drawerNavHtml()` grubu
         eskiden FİLTRELEYİP atıyordu, artık `.d-sub-group` olarak basıyor
         (biçimi de CSS'te zaten vardı — satır 1055). */
      /* R8 madde 3 — {group:'Hareketi Anlamak'} ayracı KALDIRILDI.
         Altındaki üç kalem (Spor Sözlüğü · Anatomi Haritası · Antrenman
         Oluşturucu) yerinde ve aynı sırada duruyor; panel tek kolon,
         artık kesintisiz altı kalem. `.dd-group` / `.d-sub-group`
         biçimleri CSS'te duruyor — başka kalem kullanabilir, silinmedi. */
      {label:'Spor Sözlüğü', desc:'Salon dilinin tam karşılığı — terim terim', href:'sozluk-v1.html', icon:'fa-solid fa-spell-check'},
      {label:'Anatomi Haritası', desc:'Gövde üzerinden kas kas — ne yapar, nereye tutunur', href:'anatomi-v1.html', icon:'fa-solid fa-person-rays'},
      /* H3 · 7. oturum — kalem AÇILDI. Önceki turda yorumdaydı çünkü sayfa
         henüz yoktu; artık `antrenman-olusturucu-v1.html` diskte. Yorumun
         kendi talimatı uygulandı: slug yukarıdaki NAV `match` dizisine ve
         BOTTOM "Hareket" kalemine de eklendi. */
      {label:'Antrenman Oluşturucu', desc:'Birkaç seçimle gün gün antrenman planı', href:'antrenman-olusturucu-v1.html', icon:'fa-solid fa-wand-magic-sparkles'}
    ] },

  /* 2 · PROGRAMLAR — belge §2'nin beş kalemi. Fit Testleri ve Video Seansları
 Faz 5'te üretildi; menüye ancak sayfalar diskte olduğu için bağlandı. */
  { key:'programlar', label:'Programlar', href:'programlar-merkezi-v1.html', icon:'fa-solid fa-clipboard-list',
    match:['programlar-merkezi-v1','program-liste-v1','program-detay-v1','programini-bul-v1',
           'fit-testleri-v1','fit-testi-detay-v1','fit-testi-sonuc-v1',
           'video-seanslari-v1','video-seans-detay-v1'],
    /* E5 — "Programlar" ile "Tüm Programlar" ayrımı netleşti.
       ÖLÇÜM (değişiklik öncesi, NAV/BOTTOM/FOOTER dizilerinden okundu):
         Programlar (başlık)        → programlar-merkezi-v1.html
         Programlar Merkezi (panel) → programlar-merkezi-v1.html   ← AYNI HEDEF
         Tüm Programlar (panel)     → program-liste-v1.html        ← farklı hedef
         Programlar (alt bar)       → programlar-merkezi-v1.html
         Programlar (footer)        → programlar-merkezi-v1.html
       Yani başlık ile panelin ilk kalemi aynı yere gidiyordu (menü
       sözleşmesinin "bir hedefe yalnız bir kalem" kuralının ihlali);
       "Tüm Programlar" ise gerçekten başka bir sayfa. KARAR: tekrar eden
       kalem silindi, farklı hedefli kalemin etiketi netleştirildi
       (KARARLAR.md K16). */
    dd:[
      {label:'Tüm Programlar', desc:'4 · 8 · 12 haftalık planların filtrelenebilir tam listesi', href:'program-liste-v1.html', icon:'fa-solid fa-clipboard-list'},
      /* R13 — pop-up kalktı: kalem artık kendi tam sayfasına gidiyor */
      {label:'Programını Bul', desc:'Altı soruyla sana uygun üç program', href:'programini-bul-v1.html', icon:'fa-solid fa-wand-magic-sparkles'},
      {label:'Fit Testleri', desc:'Seviyeni kendi ölçümünle belirle', href:'fit-testleri-v1.html', icon:'fa-solid fa-clipboard-check'},
      {label:'Video Seansları', desc:'Eğitmen eşliğinde çalış', href:'video-seanslari-v1.html', icon:'fa-solid fa-circle-play'}
    ] },

  /* 3 · ENERJİ DEFTERİ ÜST MENÜDEN ÇIKTI (G1 · KARARLAR.md K18).
 Beyar: "Enerji defterini profile koyabilirsin."
 Kalem beş alt kalemle üst düzeydeydi; artık Fit Planım / profil bağlamının
 altında. Erişim üç kapıdan sürüyor ve hiçbiri kırılmadı:
   · Fit Planım sekme rayı (PLAN_TABS'ta kendi kalemi)
   · Hesap menüsü (ACCOUNT_ITEMS · "profil" bağlamı)
   · Footer "DadaFit" kolonu
 Alt kalemlerinin hedefleri de kayboldu değil, sahiplerine taşındı:
   Aktivite Günlüğü ve Bağlı Uygulamalar → Planım kabuğu + hesap menüsü,
   #dengele / #su / #haftalik çapaları → G2'de kendi sayfalarına dönüştü. */

  /* 4 · CHALLENGE — PANELSİZ DÜZ BAĞLANTI (kullanıcı kararı, KARARLAR.md K17).
 Panel beş kalemdi: merkez + üç DURUM kalemi (?durum=aktif / yaklasan / gecmis)
 + örnek detay. Beyar: "header'daki challenge'da dropdown'lar var, hepsi aynı
 yere, tek bir buton olsun" ve "aktif / yaklaşan / tamamlanan challenge olarak
 sunmana gerek yok, hepsi tek bir yerde".
 Durum artık YALNIZ kart rozeti ve merkez sayfasının kendi filtre ekseni.
 Erişim kaybı yok: eski ?durum= adresleri aynı sayfaya düşüyor ve sayfa
 parametreyi okuyup çipi işaretlemeye devam ediyor (ölçüldü). */
  { key:'challenge', label:'Challenge', href:'challenge-merkezi-v1.html', icon:'fa-solid fa-trophy',
    match:['challenge-merkezi-v1','challenge-v1'] },

  /* 5 · ANTRENÖRLER — PANELSİZ DÜZ BAĞLANTI (kullanıcı kararı, KARARLAR.md K10).
 Faz 3'te belge §2'ye uyularak dört kalemlik panel verilmişti; kullanıcı
 başlığın tıklanınca doğrudan dizine gitmesini istedi. Alt kalemlerin hepsi
 zaten dizin sayfasından erişilebilir: banner'daki "Sana Uygun Antrenörü Bul"
 ve "Antrenör Ol" düğmeleri, kartlardan antrenör profili, randevu ise
 Planım > Antrenörüm. Yani panel kalkınca erişim kaybı yok. */
  { key:'antrenorler', label:'Antrenörler', href:'antrenorler-v1.html', icon:'fa-solid fa-user-tie',
    match:['antrenorler-v1','antrenor-detay-v1','antrenor-ol-v1'] }
];

/* Mobil alt bar — belge §3.2 / §19: BEŞTEN FAZLA sabit öğe olamaz. */
var BOTTOM = [
  {label:'Ana Sayfa',  href:'dadafit-hub-v1.html',        icon:'fa-solid fa-house',           match:['dadafit-hub-v1']},
  /* K34: "Hareketi Anlamak" sayfaları (sozluk-v1 · sozluk-detay-v1 · anatomi-v1
     · antrenman-olusturucu-v1) alt barda da Hareket kalemini aktif etsin —
     ayrı bir alt bar kalemi açılmıyor, §3.2'nin "beşten fazla sabit öğe
     olamaz" kuralı korunuyor. */
  {label:'Hareketler', href:'egzersiz-kutuphane-v1.html',    icon:'fa-solid fa-person-running',  match:['egzersiz-kutuphane-v1','egzersiz-detay-v1','hareket-rehberi-v1','hareket-yeni-baslayanlar-v1','hareket-dogru-form-v1','hareket-sureye-gore-v1','hareket-hedefe-gore-v1','hareket-bolgeye-gore-v1','hareket-masa-basi-v1','hareket-isinma-soguma-v1','hareket-sozluk-v1','sozluk-v1','sozluk-detay-v1','anatomi-v1','antrenman-olusturucu-v1']},
  {label:'Programlar', href:'programlar-merkezi-v1.html', icon:'fa-solid fa-dumbbell', center:true, match:['programlar-merkezi-v1','program-liste-v1','program-detay-v1','programini-bul-v1','challenge-merkezi-v1','challenge-v1']},
  /* R8 madde 1 — `cls` alanı: alt bar kalemi oturuma bağlandı (bn-plan). */
  {label:'Planım',     cls:'bn-plan', href:'fit-planim-v1.html',         icon:'fa-solid fa-list-check',      match:['fit-planim-v1','enerji-defteri-v1','enerji-defteri-dengele-v1','enerji-defteri-su-v1','enerji-defteri-haftalik-v1','dadafit-kopru-v1','fit-planim-programim-v1','fit-planim-gecmis-v1','fit-planim-ilerleme-v1','fit-planim-rozetler-v1','fit-planim-kaydettiklerim-v1','fit-planim-randevular-v1','fit-planim-saglik-profil-v1','fit-planim-veri-izin-v1']},
  /* §1 — belge alt bar son kalemini "Profil" diye adlandırıyor. */
  {label:'Profil',     href:'giris-v1.html',              icon:'fa-solid fa-user', id:'bnAccount'}
];

/* ============================================================
 FOOTER — 9. tur revizyonu · BEŞ ALAN
 ------------------------------------------------------------
 Revizyon dokümanının mimarisi, birebir:
   Marka Alanı | Hareket ve Öğren | Programlar ve Uzman Desteği |
   Enerji ve Denge | Uygulama
 Marka (sol) ve uygulama (sağ) alanları FOOTER_RAW'da sabit durur;
 ARADAKİ ÜÇ MENÜ bu dizidedir. Kalem eklemek = TEK SATIR.

 · Doküman "Dada Fit Egzersizleri" (boşluklu) yazıyor; depo markası
   bitişik ("DadaFit") ve üst menüde de `DadaFit Egzersizleri` geçiyor
   → tutarlılık için bitişik yazıldı.
 · "Planım" kalemi footer'dan KALDIRILDI. Doküman: "Planım ve
   İlerlemem footer'a eklenmeyecek, header'da kalacak."
 · Enerji Defteri günlük kayıt ekranını, Haftalık Özet son yedi günün
   özetini açar — iki AYRI sayfa, işlevleri aynı değil (doküman şartı).
 · `enerji-ihtiyaci-v1.html` paralel bir dalda üretiliyor; bu dalda
   henüz yok, birleştirmeden sonra 200 dönecek. Bağlantı bilerek yazıldı.
 ============================================================ */
var FOOTER_COLS = [
  { key:'hareket', title:'Hareket ve Öğren', links:[
      /* R8 madde 4 — "Hareket Merkezi" kalemi KALDIRILDI (sayfa silindi). */
      {label:'DadaFit Egzersizleri', href:'egzersiz-kutuphane-v1.html'},
      {label:'Hareket Rehberi',      href:'hareket-rehberi-v1.html'},
      {label:'Spor Sözlüğü',         href:'sozluk-v1.html'},
      {label:'Anatomi Haritası',     href:'anatomi-v1.html'},
      {label:'Antrenman Oluşturucu', href:'antrenman-olusturucu-v1.html'}
  ]},
  { key:'programlar', title:'Programlar ve Uzman Desteği', links:[
      {label:'Tüm Programlar', href:'program-liste-v1.html'},
      {label:'Programını Bul', href:'programini-bul-v1.html'},
      {label:'Fit Testleri',   href:'fit-testleri-v1.html'},
      {label:'Challenge',      href:'challenge-merkezi-v1.html'},
      {label:'Antrenörler',    href:'antrenorler-v1.html'},
      {label:'Antrenör Ol',    href:'antrenor-ol-v1.html'}
  ]},
  { key:'enerji', title:'Enerji ve Denge', links:[
      {label:'Enerji Defteri',                   href:'enerji-defteri-v1.html'},
      {label:'Enerji Köprüsü',                   href:'dadafit-kopru-v1.html'},
      {label:'Günlük Enerji İhtiyacını Hesapla', href:'enerji-ihtiyaci-v1.html'},
      {label:'Aktivite Günlüğü',                 href:'aktivite-gunlugu-v1.html'},
      {label:'Su Takibi',                        href:'enerji-defteri-su-v1.html'},
      {label:'Haftalık Özet',                    href:'enerji-defteri-haftalik-v1.html'}
  ]}
];

/* ============================================================
 KURUMSAL BANT — sütunların İÇİNDE değil, AYRI YATAY BANT.
 ------------------------------------------------------------
 Doküman: "Çözüm Merkezi ile Öneri ve Şikâyet geri plana
 atılmamalıdır" → ikisi de bandın ortasında (4. ve 5. sıra) ve
 diğer altı kalemle AYNI biçimde (aynı punto, ağırlık, renk).

 Hedefler diskte doğrulandı, hiçbiri uydurulmadı:
   Çözüm Merkezi    → destek-v1.html              (destek hub'ı — R8 madde 6+35)
   Öneri ve Şikâyet → iletisim-v1.html#conForm   (ayrı sayfası YOK;
     iletişim formu "Öneri ve şikâyetlerini de bu formdan iletebilirsin"
     diyor ve konu seçimine göre ilgili ekibe yönlendiriyor)
 ============================================================ */
var FOOTER_CORP = [
  {label:'Hakkımızda',                    href:'hakkimizda-v1.html'},
  {label:'Künye',                         href:'hakkimizda-v1.html#kunye'},
  {label:'İletişim',                      href:'iletisim-v1.html'},
  /* R8 madde 6+35 — "Çözüm Merkezi" BANTTA KALIYOR, yalnız HEDEFİ değişti:
     `destek-talepleri-v1.html` → `destek-v1.html`.
     Ara bir turda kalem banttan tamamen kaldırılmıştı (bant 8→7); lead
     bunu geri aldı ve F'nin ölçümüyle gerekçelendirdi:
     gastro footer'ındaki "Çözüm Merkezi" misafirde `/sss`'ye, girişte
     `/hesabim/destek`'e gidiyor — yani TALEP LİSTESİNE değil DESTEK
     HUB'INA. Karşılığımız `destek-v1.html` (h1 "Destek", AJAN-F üretti).
     Üç şart birden kapanıyor:
       · kalem 35 → footer'da `destek-talepleri-v1` geçişi 0
       · 9. tur dokümanı → "Çözüm Merkezi geri plana atılmamalıdır" korunur
       · `tests/footer-yapi.mjs` → kurumsal bant 8 kalem kalır
     K29 uyumlu: ölçü referanstan alındı, hedef DadaFit'in kendi sayfası. */
  {label:'Çözüm Merkezi',                 href:'destek-v1.html'},
  {label:'Öneri ve Şikâyet',              href:'iletisim-v1.html#conForm'},
  {label:'İş Birliği',                    href:'reklam-ver-v1.html#isbirligi'},
  {label:'Reklam ve Marka İş Birlikleri', href:'reklam-ver-v1.html#reklam'},
  {label:'Sponsorlar ve Partnerler',      href:'hakkimizda-v1.html#partnerler'}
];

/* ============================================================
 YASAL BANT — DOKUNULMAZ
 ------------------------------------------------------------
 Revizyon dokümanının dipnotu: "Dada Fit'in mevcut yasal bandına
 hiçbir şekilde müdahale edilmeyecektir. Yasal bağlantıların
 metinleri, sıralaması, yönlendirmeleri, renkleri ve görsel yapısı
 mevcut haliyle korunacaktır."

 Aşağıdaki altı kalem eski FOOTER_COLS'un "Yasal ve Sağlık"
 kolonundan KARAKTER KARAKTER kopyalandı: metin, sıra ve hedef aynı.
 Punto (14px), ağırlık (500) ve renk (rgba(255,255,255,.92)) de
 CSS'te aynı bırakıldı.

 Kolon yerine yatay bant: mimari beş alana indi (doküman §Mimari) ve
 dokümanın mobil sıralaması yasal bandı 7. — yani EN ALT — sıraya
 koyuyor. @1440'ta altı kalemin toplam genişliği 707 px, wrap içi
 alan 1176 px olduğu için bant TEK SATIR kalıyor (ölçüldü).
 `tests/footer-yapi.mjs` §10 bu altı kalemi nöbette tutuyor.
 ============================================================ */
var FOOTER_LEGAL = { title:'Yasal ve Sağlık', links:[
      {label:'Kullanım Koşulları',      href:'yasal-v1.html?metin=kullanim'},
      {label:'Gizlilik ve KVKK',        href:'yasal-v1.html?metin=kvkk'},
      {label:'Çerez Politikası',        href:'yasal-v1.html?metin=cerez'},
      {label:'Üyelik ve İptal Koşulları',href:'yasal-v1.html?metin=uyelik'},
      {label:'Sağlık Bilgilendirmesi',  href:'saglik-bilgilendirme-v1.html'},
      {label:'Veri ve İzin Politikası', href:'yasal-v1.html?metin=veri-izin'}
  ]};

/* ============================================================
 FİT PLANIM — kişisel alan alt menüsü (belge §9.1, on kalem)
 Kalem eklemek = bu dizide TEK SATIR. Sayfa yalnız
 <div id="fitPlanTop" data-plan-page="…" data-plan-title="…"
 data-plan-sub="…"></div> yazar; başlık, breadcrumb ve
 sekme rayı buradan üretilir.
 ============================================================ */
/* ------------------------------------------------------------------
 PLANIM ALTI SEKMEYE SADELEŞTİ (belge §4)
 ------------------------------------------------------------------
 Ray on bir kalemdi; belge altı ana başlık istiyor:
   Bugün · Plan ve Takvim · Aktivite Kayıtlarım · İlerlemem ·
   Kaydettiklerim · Antrenörüm

 Eşleme (yeni sayfa üretilmedi, mevcut sayfalar yeni başlık altına girdi):
   programim  → Plan ve Takvim        (aktif program + haftalık plan + takvim)
   gecmis     → Aktivite Kayıtlarım   (tamamlanan antrenman + manuel aktivite + set geçmişi)
   ilerleme   → İlerlemem             (rozet ve challenge ilerlemesi de bu başlığın altında)
   kaydett…   → Kaydettiklerim
   randevular → Antrenörüm            (randevu + mesaj + paylaşılan program/belge)

 RAYDAN ÇIKANLAR ve nereye gittikleri:
   defter  → ana menüde kendi başlığı oldu (belge §2: "Enerji Defteri'ni Planım
             alanından çıkararak ana menüde doğrudan erişilebilir hâle getir")
   kopru   → Enerji Defteri içindeki açıklayıcı sistem (belge §5: "Enerji Köprüsü,
             Planım veya Hesabım sekmesi olarak gösterilmemelidir")
   rozetler→ İlerlemem'in içeriği (belge §4.4 rozetleri İlerlemem altında sayıyor)
   saglik  → Hesabım > Sağlık ve Hareket Profilim (belge §5)
   veri    → Hesabım > Veri ve İzinlerim (belge §5)

 İKİ LİSTE, TEK KAYNAK:
 · PLAN_TABS  → sekme rayında görünen ALTI kalem
 · PLAN_PAGES → #fitPlanTop kullanan TÜM sayfalar (ray dışı olanlar dahil)
 Ray dışı sayfalar hâlâ Planım kabuğunu (banner + breadcrumb) kullanıyor;
 anahtarları PLAN_PAGES'te durmazsa başlık/breadcrumb çözümü boşa düşer.
 ------------------------------------------------------------------ */
/* R9 · K66 — RAY ÜÇE İNDİ. Yeni belge §2 Planım rayının içeriğini açılır
   menüye taşıyor; rayda yalnız "Planım" kümesi kalıyor (§3 Bugün · §4 Plan ve
   Takvim · §5 İlerlemem). Aktivite Kayıtlarım · Kaydettiklerim · Antrenörüm ·
   Enerji Defteri raydan İNDİ ama SİLİNMEDİ — PLAN_EXTRA'ya geçtiler, yani
   banner/breadcrumb çözümleri ve data-plan-page anahtarları aynen çalışıyor.
   Erişim kaybı yok: dördü de açılır menüde kendi kalemini aldı. */
var PLAN_TABS = [
  {key:'bugun',     label:'Bugün',          href:'fit-planim-v1.html',           icon:'fa-solid fa-sun',           desc:'Bugünkü antrenman, hareket ve toparlanma özeti'},
  {key:'programim', label:'Plan ve Takvim', href:'fit-planim-programim-v1.html', icon:'fa-solid fa-calendar-days', desc:'Aktif program, haftalık plan, takvim'},
  {key:'ilerleme',  label:'İlerlemem',      href:'fit-planim-ilerleme-v1.html',  icon:'fa-solid fa-chart-line',    desc:'Süre, gelişim, challenge, rozetler'}
];

/* Ray dışında kalan ama Planım kabuğunu kullanan sayfalar. Ray'da GÖRÜNMEZLER;
   yalnız banner/breadcrumb çözümü ve eski data-plan-page anahtarlarının
   kırılmaması için burada dururlar. */
var PLAN_EXTRA = [
  /* G2 — Enerji Defteri dört ayrı sayfaya bölündü; üçü ray dışı alt sayfa.
     Ray'da yalnız 'Enerji Defteri' (bugun) kalemi görünür, alt sekmeler
     sayfanın kendi .fit-tabs şeridinden gezinilir. */
  {key:'defter-dengele',  label:'Dengele',        href:'enerji-defteri-dengele-v1.html',  icon:'fa-solid fa-scale-balanced', desc:'Yediğini hareketle dengele'},
  {key:'defter-su',       label:'Su Takibi',      href:'enerji-defteri-su-v1.html',       icon:'fa-solid fa-droplet',        desc:'Günlük su hedefin'},
  {key:'defter-haftalik', label:'Haftalık Özet',  href:'enerji-defteri-haftalik-v1.html', icon:'fa-solid fa-calendar-week',  desc:'Haftanın hareket ve enerji tablosu'},
  /* R9 · K66 — raydan inip menüye geçen dört sayfa. Ray'da GÖRÜNMEZLER,
     kabuğu (banner + breadcrumb) kullanmaya devam ederler. */
  {key:'testlerim',      label:'Fit Test Sonuçlarım',href:'fit-test-sonuclarim-v1.html',       icon:'fa-solid fa-clipboard-check',   desc:'Test arşivin, kategori kapsamın ve kendi başlangıcınla karşılaştırman'},
  {key:'gecmis',         label:'Aktivite Kayıtlarım',href:'fit-planim-gecmis-v1.html',         icon:'fa-solid fa-clock-rotate-left', desc:'Tamamlanan antrenman ve aktiviteler'},
  {key:'kaydettiklerim', label:'Kaydettiklerim',     href:'fit-planim-kaydettiklerim-v1.html', icon:'fa-solid fa-bookmark',          desc:'Hareket, program, rehber, seans, antrenör'},
  {key:'randevular',     label:'Antrenörüm',         href:'fit-planim-randevular-v1.html',     icon:'fa-solid fa-user-tie',          desc:'Randevular, mesajlar, paylaşılanlar'},
  {key:'defter',         label:'Enerji Defteri',     href:'enerji-defteri-v1.html',            icon:'fa-solid fa-bolt',              desc:'Günlük denge · su · haftalık özet'},
  {key:'aktivite',  label:'Aktivite Günlüğü',           href:'aktivite-gunlugu-v1.html',         icon:'fa-solid fa-shoe-prints',            desc:'Adım, süre, mesafe, yaklaşık enerji'},
  {key:'cihazlar',  label:'Bağlı Uygulamalar',          href:'bagli-uygulamalar-v1.html',        icon:'fa-solid fa-plug-circle-check',      desc:'Apple Health · Health Connect · saat'},
  {key:'kopru',     label:'Enerji Köprüsü',             href:'dadafit-kopru-v1.html',            icon:'fa-solid fa-arrow-right-arrow-left', desc:'Beslenme ile hareketin buluştuğu yer'},
  {key:'rozetler',  label:'Challenge ve Rozetler',      href:'fit-planim-rozetler-v1.html',      icon:'fa-solid fa-medal',                  desc:'Kilometre taşların'},
  {key:'saglik',    label:'Sağlık ve Hareket Profilim', href:'fit-planim-saglik-profil-v1.html', icon:'fa-solid fa-heart-pulse',            desc:'Kısıt, hedef, tercih'},
  {key:'veri',      label:'Veri ve İzinlerim',          href:'fit-planim-veri-izin-v1.html',     icon:'fa-solid fa-shield-halved',          desc:'Neyi kiminle paylaştığın · uygulama tercihleri'}
];
var PLAN_PAGES = PLAN_TABS.concat(PLAN_EXTRA);
/* geriye dönük ad — kabuk içinde "Planım alanının tamamı" anlamında kullanılıyordu */
var PLAN_NAV = PLAN_PAGES;

/* Hesap menüsü — belge §3.3: Dada Gastro hesap aksiyonları (Mutfak Defterim /
 Tarif Ekle / Alışveriş Listem …) DadaFit hesap menüsünde DURMAZ; onlara
 ekosistem değiştiriciden (üst bant marka barı)
 geçilir. Burada yalnız DadaFit kalemleri var. */
/* ============================================================
 AÇILIR KULLANICI MENÜSÜ — yeni belge §2
 ------------------------------------------------------------
 K66 · KARARIN DEVRİLDİĞİ YER. Eski hâli şunu diyordu:
   "Planım ile Hesabım birbirine karıştırılmamalıdır" (önceki belge §5)
 ve bu yüzden menü = 19 hesap kalemi, ray = 7 sekme idi.

 Yeni belge §2 bunun TERSİNİ istiyor ve Beyar "belge birebir uygulansın"
 dedi. Artık:
   · Planım rayının içeriği (Aktivite Kayıtlarım · Kaydettiklerim ·
     Challenge ve Rozetler · Fit Test Sonuçlarım · Antrenörüm · Enerji
     Defterim) MENÜDE, üç başlıklı grup hâlinde
   · 19 hesap kalemi tek "Hesap ve Ayarlar" kalemine KATLANDI —
     hesabim-v1 içindeki çapa bölümleri (#guvenlik #dil #bildirim #dondur
     #sil) yerinde duruyor, menüden değil sayfadan geziliyor
   · Bildirimler menüden ÇIKTI — §1 "header'da duracak, menüye tekrar
     konmayacak" diyor; zil zaten head-actions'ta
 Toplam 11 kalem (belge §2 birebir).
 ============================================================ */

/* §14 · üyelik kalemi kademeye göre ad değiştirir. Kaynak: dm_user.paket.
   Prototip kancası — kademe yoksa "ucretsiz" varsayılır. */
function uyelikKalemi(){
  var paket='ucretsiz', odemeSorunu=false;
  try{
    var u=JSON.parse(localStorage.getItem('dm_user')||'{}');
    if(u && u.paket) paket=String(u.paket);
    odemeSorunu = !!(u && u.odemeSorunu);
  }catch(e){}
  if(odemeSorunu) return {label:'Aboneliğim — İşlem Gerekli', href:'uyelik-faturalandirma-v1.html#paket',
                          icon:'fa-solid fa-triangle-exclamation', cls:'acct-uyari', desc:'Ödeme alınamadı, güncelle'};
  if(paket==='pro_max')  return {label:'Pro Max Üyeliğim', href:'uyelik-faturalandirma-v1.html#paket',
                                 icon:'fa-solid fa-crown', cls:'acct-pro', desc:'Paket, yenileme, fatura'};
  if(paket==='pro')      return {label:'Aboneliğim',       href:'uyelik-faturalandirma-v1.html#paket',
                                 icon:'fa-solid fa-crown', cls:'acct-pro', desc:'Paket, yenileme, fatura'};
  return {label:"Pro'ya Yükselt", href:'pro-v1.html', icon:'fa-solid fa-crown', cls:'acct-pro', desc:'Tüm programlar, video seansları, testler'};
}

var ACCOUNT = [
  {grup:'Günlük Takibim'},
  {label:'Enerji Defterim',      href:'enerji-defteri-v1.html',            icon:'fa-solid fa-bolt',              desc:'Günlük denge · su · haftalık özet'},
  {label:'Aktivite Kayıtlarım',  href:'fit-planim-gecmis-v1.html',         icon:'fa-solid fa-clock-rotate-left', desc:'Tamamlanan antrenman ve aktiviteler'},
  {label:'Kaydettiklerim',       href:'fit-planim-kaydettiklerim-v1.html', icon:'fa-solid fa-bookmark',          desc:'Hareket, program, rehber, seans, antrenör'},

  {grup:'Gelişimim'},
  {label:"Challenge'larım ve Rozetlerim", href:'fit-planim-rozetler-v1.html', icon:'fa-solid fa-medal',          desc:'Kilometre taşların'},
  /* YER TUTUCU KAPANDI — sayfa geldi (R9-DOKUMAN) ve bağlandı. Ölçüldü:
     HTTP 200 · h1 "Fit Test Sonuçlarım" · breadcrumb çözülüyor · 7 bölüm ·
     konsol hatası 0 · yatay taşma 0. `docs/icerik-bekleyen.md` kaydı
     kütüğün 3. kuralı gereği silindi.
     `yerTutucu` MEKANİZMASI duruyor (`accountHtml()` · `drawerAccountHtml()`):
     bir sonraki bağlanmamış kalem için hazır — ölü `href="#"` bırakmadan
     odak dışı, aria-disabled, "Yakında" etiketli kalem basar. */
  {label:'Fit Test Sonuçlarım',  href:'fit-test-sonuclarim-v1.html',       icon:'fa-solid fa-clipboard-check',   desc:'Test arşivin, kategori kapsamın ve kendi başlangıcınla karşılaştırman'},
  {label:'Antrenörüm',           href:'fit-planim-randevular-v1.html',     icon:'fa-solid fa-user-tie',          desc:'Randevular, mesajlar, paylaşılanlar'},

  {grup:'Profil ve Üyelik'},
  {label:'Sağlık ve Hareket Profilim', href:'fit-planim-saglik-profil-v1.html', icon:'fa-solid fa-heart-pulse',  desc:'Kısıt, hedef, tercih'},
  uyelikKalemi(),
  {label:'Hesap ve Ayarlar',     href:'hesabim-v1.html',                   icon:'fa-solid fa-gear',              desc:'Profil, güvenlik, dil, birimler, veri'},
  {label:'Destek Merkezi',       href:'destek-v1.html',                    icon:'fa-solid fa-circle-question',   desc:'Yardım ve taleplerin'},
  {sep:true},
  /* "DadaMutfak'a dön" kalemi burada YOK (belge §1: DadaFit'in hesap ve üyelik
     yapısı bağımsız görünmeli). Ekosistem geçişi üst banttaki marka barında. */
  {label:'Çıkış', href:FIT_LOGOUT, icon:'fa-solid fa-right-from-bracket', cls:'acct-logout'}
];

/* ============================================================
 2 · AKTİF SAYFA ÇÖZÜMÜ
 ============================================================ */
var FILE = (location.pathname.split('/').pop() || 'dadafit-hub-v1.html').replace(/\.html$/,'');
var PAGE = document.body.getAttribute('data-fit-page') || FILE;
function isActive(item){
  if(!item.match) return false;
  for(var i=0;i<item.match.length;i++){ if(item.match[i]===PAGE) return true; }
  return false;
}
/* Planım alanındaki herhangi bir sayfada mıyız? (header düğmesi + drawer bölümü için) */
var PLAN_ACTIVE = PLAN_NAV.some(function(p){ return p.href.replace(/\.html$/,'') === PAGE; });
var ILERLEME_ACTIVE = (PAGE === 'fit-planim-ilerleme-v1');
var AVA = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop&exp=7&gam=6&sat=-9&high=8&vib=5";
var MARK = '<svg class="fit-mark" viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="11.5" fill="#009d4f"/><path d="M25 8 L13.6 26 H19.8 L18.2 36 L30.4 17.6 H23.8 Z" fill="#fff"/></svg>';
var WORD = '<span class="fit-word"><b>Dada</b><span class="ft">Fit</span></span>';

/* ============================================================
 3 · KABUK MARKUP ÜRETİMİ
 ============================================================ */
function navHtml(){
  return NAV.map(function(it){
    var act = isActive(it) ? ' class="active"' : '';
    /* panelsiz başlık: chevron YOK, aria-haspopup YOK — düz bağlantı (DadaDiet kuralı) */
    if(!it.dd) return '<div class="nav-item"><a href="'+it.href+'"'+act+'>'+it.label+'</a></div>';
    var items = it.dd.map(function(d){
      if(d.group) return '<div class="dd-group">'+d.group+'</div>';
      return '<a href="'+d.href+'"><i class="'+d.icon+'"></i> <span>'+d.label+(d.desc?'<small>'+d.desc+'</small>':'')+'</span></a>';
    }).join('\n            ');
    return '<div class="nav-item">\n          <a href="'+it.href+'"'+(act||' class=""')+' aria-haspopup="true" aria-expanded="false">'+it.label+' <i class="fa-solid fa-chevron-down"></i></a>\n          <div class="dropdown">\n            '+items+'\n          </div>\n        </div>';
  }).join('\n        ');
}

/* Mobil drawer — masaüstü menüsünün birebir karşılığı + Planım rayı.
 Planım masaüstünde header düğmesi olduğu için burada kendi katlanır bölümünü alır;
 aksi hâlde mobilde plan alt sayfalarına hiçbir kapı kalmazdı. */
function drawerNavHtml(){
  var planActive = PLAN_ACTIVE;
  var out = NAV.map(function(it){
    var act = isActive(it) ? ' active' : '';
    if(!it.dd) return '<div class="d-item"><a class="d-link'+act+'" href="'+it.href+'"><i class="'+it.icon+'"></i> '+it.label+'</a></div>';
    /* K34 · GRUP BAŞLIĞI DRAWER'DA DA GÖRÜNÜR.
       Eskiden `d.group` filtrelenip atılıyordu; "Hareketi Anlamak" grubu
       mobilde etiketsiz kalıyordu. Artık `.d-sub-group` olarak basılıyor —
       biçimi fit-shell.css satır 1055'te zaten tanımlıydı, CSS'e ekleme
       YAPILMADI. `ddOnly` davranışı aynen korunuyor. */
    var subs = it.dd.filter(function(d){return !d.ddOnly;}).map(function(d){
      if(d.group) return '<div class="d-sub-group">'+d.group+'</div>';
      return '<a href="'+d.href+'"><i class="'+d.icon+'"></i> '+d.label+'</a>';
    }).join('\n        ');
    /* Satırın kendisi GERÇEK BAĞLANTI, chevron ayrı bir aç/kapa düğmesi.
       (Eskiden tüm satır <button> idi; panelden "… Merkezi" kalemi kalkınca
       mobilde merkez sayfaya hiç kapı kalmazdı.) */
    return '<div class="d-item d-has-sub'+(act?' open':'')+'">\n      <div class="d-row">\n        <a class="d-link'+act+'" href="'+it.href+'"><i class="'+it.icon+'"></i> '+it.label+'</a>\n        <button class="d-toggle" type="button" aria-expanded="'+(act?'true':'false')+'" aria-label="'+it.label+' alt menüsü"><i class="fa-solid fa-chevron-down"></i></button>\n      </div>\n      <div class="d-sub">\n        '+subs+'\n      </div>\n    </div>';
  });
  /* slice(1): kök kalem ("Bugün") atlanır — üstteki "Planım" satırı zaten
     aynı sayfaya giden gerçek bağlantı; aynı hedefe iki kapı olmaz. */
  /* slice(1): kök kalem ("Bugün") atlanır — üstteki "Planım" satırı zaten
     aynı sayfaya giden gerçek bağlantı. Ray dışı sayfalar drawer'da da
     görünmez; onlara kendi sahiplerinden gidilir (Enerji Defteri ana menüde,
     rozetler İlerlemem içinde, sağlık/veri Hesabım'da). */
  var planSubs = PLAN_TABS.slice(1).map(function(p){
    return '<a href="'+p.href+'"><i class="'+p.icon+'"></i> '+p.label+'</a>';
  }).join('\n        ');
  out.push('<div class="d-item d-plan d-has-sub'+(planActive?' open':'')+'">\n      <div class="d-row">\n        <a class="d-link'+(planActive?' active':'')+'" href="fit-planim-v1.html"><i class="fa-solid fa-list-check"></i> Planım</a>\n        <button class="d-toggle" type="button" aria-expanded="'+(planActive?'true':'false')+'" aria-label="Planım alt menüsü"><i class="fa-solid fa-chevron-down"></i></button>\n      </div>\n      <div class="d-sub">\n        '+planSubs+'\n      </div>\n    </div>');

  /* R9 · K66 — AÇILIR MENÜNÜN MOBİL KARŞILIĞI.
     ÖLÇÜLEN KUSUR: §2 rayın içeriğini açılır menüye taşıdı, ama açılır menü
     @390'da hiç yok (`.acct-wrap` gizli) ve drawer'ın alt şeridi yalnız dört
     ince bağlantı taşıyordu. Sonuç: @390'da hub'dan iki sıçramada
     `fit-planim-gecmis-v1` ve `fit-planim-kaydettiklerim-v1` sayfalarına
     HİÇBİR kapı kalmıyordu (ölçüldü — tabanda drawer'ın Planım bölümü ikisini
     de taşıyordu, K66 ile ray üçe inince düştüler).
     Çözüm: menü mobilde de aynı KAYNAKTAN (ACCOUNT) basılır. Ayrı liste
     tutulmaz — masaüstünde eklenen kalem mobilde kendiliğinden görünür.
     Katlanır DEĞİL, hep açık: kullanıcı kendi alanını bulmak için gizli bir
     ok aramak zorunda kalmasın. Bölüm başlıkları `.d-sub-group` — drawer'ın
     zaten kullandığı dil, yeni görsel dil icat edilmedi. */
  out.push('<div class="d-item d-acct-block">\n      <div class="d-sub d-acct-sub">\n        '+drawerAccountHtml()+'\n      </div>\n    </div>');
  return out.join('\n    ');
}

/* ACCOUNT dizisinin drawer karşılığı. Masaüstündeki `accountHtml()` ile TEK
   KAYNAK, iki biçim: burada `desc` alt satırı basılmaz (drawer satırı dar) ve
   "Çıkış" atlanır — drawer'ın alt şeridinde zaten var, aynı hedefe ikinci kapı
   açılmaz. Yer tutucu kalem burada da <a> DEĞİL: odak sırasına girmez. */
function drawerAccountHtml(){
  return ACCOUNT.filter(function(a){ return !a.sep && a.cls !== 'acct-logout'; }).map(function(a){
    if(a.grup) return '<div class="d-sub-group">'+a.grup+'</div>';
    if(a.yerTutucu) return '<span class="d-soon" data-yer-tutucu="'+a.yerTutucu+
      '" aria-disabled="true" aria-label="'+a.label+' — sayfa henüz yayında değil, yakında">'+
      '<i class="'+a.icon+'"></i> '+a.label+'<em class="acct-soon-tag">Yakında</em></span>';
    return '<a href="'+a.href+'"'+(a.cls?' class="'+a.cls+'"':'')+'><i class="'+a.icon+'"></i> '+a.label+'</a>';
  }).join('\n        ');
}

function bottomNavHtml(){
  return BOTTOM.map(function(b){
    var act = isActive(b) ? ' active' : '';
    var id  = b.id ? ' id="'+b.id+'"' : '';
    var ico = b.center ? '<span class="bn-fab"><i class="'+b.icon+'"></i></span>' : '<i class="'+b.icon+'"></i>';
    return '<a href="'+b.href+'"'+id+' class="bn-item'+(b.center?' bn-center':'')+(b.cls?' '+b.cls:'')+act+'">'+ico+'<span>'+b.label+'</span></a>';
  }).join('\n  ');
}

/* Üç orta menü. Başlık GERÇEK <button> — mobilde accordion, masaüstünde
   `disabled` (kalem listesi hep açık). aria-expanded/aria-controls ikilisi
   kurulum sırasında (bkz. "FOOTER ACCORDION" IIFE) genişliğe göre boyanır. */
function footerColsHtml(){
  return FOOTER_COLS.map(function(c){
    var links = c.links.map(function(l){
      return '<a href="'+l.href+'">'+l.label+'</a>';
    }).join('\n          ');
    return '<div class="foot-col" data-foot-col="'+c.key+'">\n'+
      '        <h5 class="fc-head"><button type="button" class="fc-toggle" id="fcb-'+c.key+'"'+
      ' aria-expanded="true" aria-controls="fcp-'+c.key+'">'+
      '<span class="fc-title">'+c.title+'</span>'+
      '<i class="fa-solid fa-chevron-down fc-chev" aria-hidden="true"></i></button></h5>\n'+
      '        <div class="fc-links" id="fcp-'+c.key+'" role="region" aria-labelledby="fcb-'+c.key+'">\n          '+
      links+'\n        </div>\n      </div>';
  }).join('\n      ');
}

/* Kurumsal bant — sekiz kalem, aralarında ince dikey ayraç (@1440 tek satır). */
function footerCorpHtml(){
  return FOOTER_CORP.map(function(l){
    return '<a href="'+l.href+'">'+l.label+'</a>';
  }).join('<span class="sep" aria-hidden="true"></span>');
}

/* Yasal bant — DOKUNULMAZ. Metin, sıra, hedef ve renk mevcut haliyle. */
function footerLegalHtml(){
  var links = FOOTER_LEGAL.links.map(function(l){
    return '<a href="'+l.href+'">'+l.label+'</a>';
  }).join('<span class="sep" aria-hidden="true"></span>');
  /* R8 madde 2 — GÖRÜNÜR BAŞLIK KALDIRILDI. Bağlantıların metni, sırası,
     hedefi ve rengi AYNEN duruyor; kalkan yalnız <h5 class="fl-head">.
     Bandın adı `aria-label`'da kalıyor — ekran okuyucu bandı hâlâ
     "Yasal ve Sağlık" diye duyurur, görsel olarak başlık yok. */
  return '<nav class="foot-lawband" aria-label="'+FOOTER_LEGAL.title+'">'+
         links+'</nav>';
}

var TOPBAR = ''+
'<div class="topbar">\n'+
'  <div class="wrap">\n'+
'    <div class="tb-left">\n'+
'      <a href="egzersiz-kutuphane-v1.html"><i class="fa-solid fa-dumbbell" style="color:var(--fit)"></i> 25 hareket</a>\n'+
'      <span class="tb-div"></span>\n'+
'      <div class="tb-soc">\n'+
'        <a href="#"><i class="fa-brands fa-instagram"></i></a>\n'+
'        <a href="#"><i class="fa-brands fa-youtube"></i></a>\n'+
'        <a href="#"><i class="fa-brands fa-pinterest"></i></a>\n'+
'      </div>\n'+
'    </div>\n'+
'    <div class="tb-right">\n'+
'      <nav class="brand-switch" aria-label="Dada dünyaları">\n'+
'        <a class="bs-item bs-gastro" href="'+ECO.gastro+'" title="DadaGastro"><i class="fa-solid fa-utensils"></i><span class="bs-name"><span class="bd">Dada</span><span class="sf">Gastro</span></span></a>\n'+
'        <a class="bs-item bs-diet" href="'+ECO.diet+'" title="DadaDiet"><i class="fa-solid fa-leaf"></i><span class="bs-name"><span class="bd">Dada</span><span class="sf">Diet</span></span></a>\n'+
'        <a class="bs-item bs-fit is-active" href="dadafit-hub-v1.html" aria-current="page"><i class="fa-solid fa-dumbbell"></i><span class="bs-name"><span class="bd">Dada</span><span class="sf">Fit</span></span></a>\n'+
'        <a class="bs-item bs-gourmet" href="'+ECO.gourmet+'" title="DadaGourmet"><i class="fa-solid fa-map-location-dot"></i><span class="bs-name"><span class="bd">Dada</span><span class="sf">Gourmet</span></span></a>\n'+
'        <a class="bs-item bs-campus" href="'+ECO.campus+'" title="DadaCampus"><i class="fa-solid fa-graduation-cap"></i><span class="bs-name"><span class="bd">Dada</span><span class="sf">Campus</span></span></a>\n'+
'      </nav>\n'+
'      <div class="tb-lang" id="tbLang">\n'+
'        <button class="tb-lang-btn" id="tbLangBtn" type="button" aria-haspopup="true" aria-expanded="false">\n'+
'          <i class="fa-solid fa-globe"></i><span>EN</span><i class="fa-solid fa-chevron-down tb-lang-caret"></i>\n'+
'        </button>\n'+
'        <div class="tb-lang-menu" id="tbLangMenu" role="menu">\n'+
'          <a href="#" role="menuitem" data-lang="tr">TR <span>Türkçe</span></a>\n'+
'          <a href="#" role="menuitem" class="active" data-lang="en">EN <span>English</span></a>\n'+
'        </div>\n'+
'      </div>\n'+
'    </div>\n'+
'  </div>\n'+
'</div>';

function accountHtml(){
  /* R11/M15 · Beyar: "Dropdown kısmı section'lı BAŞLIKSIZ olacak — aynı
     Diet'in dropdown'ındaki tab menü yapısını alabilirsin."

     KARDEŞ MARKA (dadadiet.com hesap menüsü) ölçüldü: grup BAŞLIĞI yok,
     kalem AÇIKLAMASI yok. İkon + tek satır etiket; gruplar ince AYRAÇ
     çizgisiyle ayrılıyor; aktif kalem yumuşak hap ile işaretli.

     Burada iki şey değişti, kalemlerin kendisi ve sırası DEĞİŞMEDİ:
     · `{grup:'…'}` kalemi artık başlık değil AYRAÇ basıyor
     · kalemlerin `desc` alt satırı basılmıyor (veri duruyor — mobil
       çekmece `drawerAccountHtml()` onu kullanmaya devam ediyor;
       orada dikey alan bol ve açıklama iş görüyor)
     Sonuç: iki satıra taşan kalem kalmadı, menü kısaldı, kaydırma azaldı. */
  var ilkGrupGorulduMu = false;
  return ACCOUNT.map(function(a){
    if(a.sep) return '<div class="acct-div"></div>';
    if(a.grup){
      /* İlk grup profil başlığının hemen altında; orada zaten bir ayraç
         var, ikincisini basmak çift çizgi yapardı. */
      if(!ilkGrupGorulduMu){ ilkGrupGorulduMu = true; return ''; }
      return '<div class="acct-div"></div>';
    }
    /* YER TUTUCU KALEM — hedef sayfa henüz üretilmedi.
       <a href="#"> DEĞİL <span>: menüde tıklanınca sayfa başına zıplayan ölü
       bağlantı bırakmıyoruz. Mağaza düğmelerinin deseni (footer-yapi §6:
       "yayımlanmadıysa aktif bağlantı gibi çalışmamalı") burada da geçerli —
       odak sırasına girmez, aria-disabled taşır, "Yakında" görünür yazar. */
    if(a.yerTutucu) return '<span class="acct-soon" data-yer-tutucu="'+a.yerTutucu+
      '" aria-disabled="true" aria-label="'+a.label+' — sayfa henüz yayında değil, yakında">'+
      '<i class="'+a.icon+'"></i> <span>'+a.label+'<em class="acct-soon-tag">Yakında</em>'+
      '</span></span>';
    /* desc BASILMIYOR — R11/M15, yukarıdaki gerekçe. */
    return '<a href="'+a.href+'"'+(a.cls?' class="'+a.cls+'"':'')+'><i class="'+a.icon+'"></i> <span>'+a.label+
           '</span></a>';
  }).join('\n            ');
}

function headerHtml(){
  return ''+
'<header class="header">\n'+
'  <div class="h-top">\n'+
'    <div class="wrap">\n'+
'      <a class="brand fit-brand" href="dadafit-hub-v1.html" aria-label="DadaFit">'+MARK+WORD+'</a>\n'+
'      <nav class="nav">\n        '+navHtml()+'\n      </nav>\n'+
'      <div class="head-actions">\n'+
'        <button class="icon-btn" aria-label="Ara" onclick="location.href=\'arama-fit-v1.html\'"><i class="fa-solid fa-magnifying-glass"></i></button>\n'+
/* PLANIM — ana menüye girmez; kişisel buton olarak burada durur ve HER İKİ oturum
 durumunda da görünür (DadaDiet head-actions sırası: arama · Planım · Giriş/Hesap). */
'        <a class="btn-login btn-plan'+(PLAN_ACTIVE?' active':'')+'" href="fit-planim-v1.html"'+(PLAN_ACTIVE?' aria-current="page"':'')+'><i class="fa-solid fa-list-check"></i> Planım</a>\n'+
/* §1 — İLERLEMEM header'a çıktı. Belge sırası: Arama · Planım · İlerlemem ·
 Bildirimler · Profil. İkon düğme: Planım zaten metinli, ikisi yan yana metinli
 olsa dar ekranda head-actions taşardı (ölçüm: 1440'ta 6 öğe zaten sığıyor). */
'        <a class="icon-btn head-prog'+(ILERLEME_ACTIVE?' active':'')+'" href="fit-planim-ilerleme-v1.html" aria-label="İlerlemem"'+(ILERLEME_ACTIVE?' aria-current="page"':'')+'><i class="fa-solid fa-chart-line"></i></a>\n'+
'        <button class="btn-login" onclick="location.href=\'giris-v1.html\'"><i class="fa-regular fa-user"></i> Giriş Yap</button>\n'+
'        <a class="icon-btn head-bell" href="bildirimler-v1.html" aria-label="Bildirimler"><i class="fa-solid fa-bell"></i><span class="hb-badge">3</span></a>\n'+
'        <div class="acct-item acct-wrap">\n'+
'          <button class="acct-btn" aria-label="Hesabım" aria-haspopup="true">\n'+
'            <span class="acct-ava" style="background-image:url(\''+AVA+'\')"></span>\n'+
'            <i class="fa-solid fa-chevron-down acct-caret"></i>\n'+
'          </button>\n'+
'          <div class="acct-menu">\n'+
'            <div class="acct-id">\n'+
'              <span class="acct-ava" style="background-image:url(\''+AVA+'\')"></span>\n'+
'              <span class="acct-id-txt"><b>Elif Şahin</b><small>@elifsahin</small></span>\n'+
'            </div>\n'+
'            <div class="acct-div"></div>\n'+
'            '+accountHtml()+'\n'+
'          </div>\n'+
'        </div>\n'+
'        <button class="icon-btn hamburger" id="hamburger" aria-label="Menü"><i class="fa-solid fa-bars"></i></button>\n'+
'      </div>\n'+
'    </div>\n'+
'  </div>\n'+
'</header>';
}

function drawerHtml(){
  return ''+
'<div class="drawer-overlay" id="drawerOverlay"></div>\n'+
'<aside class="drawer" id="drawer" aria-label="Mobil menü">\n'+
'  <div class="drawer-head">\n'+
'    <a class="drawer-brand" href="dadafit-hub-v1.html" aria-label="DadaFit">'+MARK+WORD+'</a>\n'+
'    <button class="drawer-close" id="drawerClose" aria-label="Menüyü kapat"><i class="fa-solid fa-xmark"></i></button>\n'+
'  </div>\n'+
'  <nav class="drawer-nav">\n    '+drawerNavHtml()+'\n  </nav>\n'+
'  <div class="drawer-foot">\n'+
'    <button class="btn btn-primary drawer-login" style="width:100%" onclick="location.href=\'giris-v1.html\'"><i class="fa-regular fa-user"></i> Giriş Yap</button>\n'+
'    <div class="drawer-acct">\n'+
'      <span class="da-ava" style="background-image:url(\''+AVA+'\')"></span>\n'+
'      <div class="da-info">\n'+
'        <b>Elif Şahin</b>\n'+
'        <div class="da-links">\n'+
/* R9 · K66 — "Planım" ve "Ayarlar" bu şeritten kalktı: ikisi de artık
 drawer'ın kendi gövdesinde gerçek kalem ("Planım" nav satırı · "Hesap ve
 Ayarlar" hesap bölümü). Aynı hedefe farklı adla ikinci kapı açılmaz.
 KALANLAR ikisi de zorunlu: "Bildirimler" §1 gereği menüde YOK ve zil @390'da
 gizli — drawer bu sayfanın tek mobil kapısı. "Çıkış" hesap bölümünde bilerek
 basılmıyor, yeri burası. */
'          <a href="bildirimler-v1.html">Bildirimler</a>\n'+
'          <a href="'+FIT_LOGOUT+'">Çıkış</a>\n'+
'        </div>\n'+
'      </div>\n'+
'    </div>\n'+
/* "Antrenör Bul" kısayolu kaldırıldı: drawer menüsündeki "Antrenörler" ile aynı hedefe
 gidiyordu (aynı hedefe farklı adla ikinci kapı açılmaz kuralı).
 "DadaMutfak'a dön" kısayolu da kaldırıldı (belge §1: DadaFit bir alt sayfa gibi
 görünmemeli, hesap/üyelik yapısı bağımsız olmalı). Ekosistem geçişi üst bandın
 marka barında duruyor; kontrollü bağlantı orada. */
'    <div class="drawer-lang" id="drawerLang">\n'+
'      <button class="drawer-lang-toggle" type="button" aria-haspopup="true" aria-expanded="false">\n'+
'        <span class="drawer-lang-label"><i class="fa-solid fa-globe"></i> Dil</span>\n'+
'        <span class="drawer-lang-cur"><span id="drawerLangCur">EN — English</span> <i class="fa-solid fa-chevron-down"></i></span>\n'+
'      </button>\n'+
'      <div class="drawer-lang-list" role="menu">\n'+
'        <button type="button" data-lang="tr" data-name="Türkçe"><b>TR</b> Türkçe</button>\n'+
'        <button type="button" class="active" data-lang="en" data-name="English"><b>EN</b> English</button>\n'+
'      </div>\n'+
'    </div>\n'+
'  </div>\n'+
'</aside>';
}

var FEEDBACK_HTML = `<span class="fb-rail" aria-hidden="true"></span>
<a class="feedback-tab" href="#" id="fbTab" aria-label="Görüş Bildir — öneri ve şikayet">
  <i class="fa-solid fa-comment-dots"></i> Görüş Bildir
</a>

<!-- ===== GÖRÜŞ BİLDİR MODAL ===== -->
<div class="fb-overlay" id="fbOverlay"></div>
<div class="fb-modal" id="fbModal" role="dialog" aria-modal="true" aria-label="Görüş Bildir">
  <div class="fb-panel">
    <div class="fb-head">
      <div>
        <h3>Görüş Bildir</h3>
        <p>Önerin, şikayetin veya sorun — hepsine kulak veriyoruz.</p>
      </div>
      <button class="fb-close" id="fbClose" type="button" aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="fb-body">
      <form id="fbForm">
        <!-- M17: konu tipine göre alan seti değişir (Onedio referansı, mevcut dil korunarak) -->
        <div class="fb-topics" role="group" aria-label="Konu seç">
          <button class="fb-topic active" type="button" data-topic="oneri"><i class="fa-solid fa-lightbulb"></i> Önerim var</button>
          <button class="fb-topic" type="button" data-topic="soru"><i class="fa-solid fa-circle-question"></i> Bir sorum var</button>
          <button class="fb-topic" type="button" data-topic="sorun"><i class="fa-solid fa-bug"></i> Teknik sorun</button>
          <button class="fb-topic" type="button" data-topic="ihlal"><i class="fa-solid fa-shield-halved"></i> İhlal bildirimi</button>
          <button class="fb-topic" type="button" data-topic="puan"><i class="fa-solid fa-face-smile"></i> Puan ver</button>
        </div>

        <div class="fb-fields active" data-for="oneri">
          <div class="fb-chiprow" role="group" aria-label="İlgili alan">
            <button class="chip active" type="button">Hareketler</button>
            <button class="chip" type="button">Programlar</button>
            <button class="chip" type="button">Enerji Defteri</button>
            <button class="chip" type="button">Uygulama</button>
            <button class="chip" type="button">Diğer</button>
          </div>
          <div class="fb-field"><textarea required placeholder="Önerini anlat *"></textarea></div>
          <div class="fb-field"><input type="email" placeholder="E-posta adresin (opsiyonel)" /></div>
        </div>

        <div class="fb-fields" data-for="soru">
          <div class="fb-field">
            <select class="fb-select" required>
              <option value="" selected disabled>Sorunun konusu *</option>
              <option>Üyelik & Hesap</option>
              <option>Hareket & Program</option>
              <option>Antrenör randevusu</option>
              <option>DadaFit Pro & Ödeme</option>
              <option>Diğer</option>
            </select>
          </div>
          <div class="fb-field"><textarea required placeholder="Sorunu yaz *"></textarea></div>
          <div class="fb-field"><input type="email" required placeholder="E-posta adresin (cevap için) *" /></div>
        </div>

        <div class="fb-fields" data-for="sorun">
          <div class="fb-field">
            <select class="fb-select" required>
              <option value="" selected disabled>Sorunu nerede yaşadın? *</option>
              <option>Ana sayfa</option>
              <option>Hareket / Egzersiz sayfası</option>
              <option>Arama</option>
              <option>Üyelik & Giriş</option>
              <option>Planım / Enerji Defteri</option>
              <option>Mobil uygulama</option>
            </select>
          </div>
          <div class="fb-field"><textarea required placeholder="Sorunu kısaca anlat — ne yaptın, ne oldu? *"></textarea></div>
          <button class="fb-shot" type="button"><i class="fa-solid fa-image"></i> Ekran görüntüsü ekle <small>(opsiyonel)</small></button>
          <div class="fb-field"><input type="email" placeholder="E-posta adresin (opsiyonel)" /></div>
        </div>

        <div class="fb-fields" data-for="ihlal">
          <div class="fb-field"><input type="url" required placeholder="İhlal içeren sayfanın linki *" /></div>
          <div class="fb-field">
            <select class="fb-select" required>
              <option value="" selected disabled>İhlal türü *</option>
              <option>Telif hakkı</option>
              <option>Uygunsuz içerik</option>
              <option>Spam / yanıltıcı içerik</option>
              <option>Diğer</option>
            </select>
          </div>
          <div class="fb-field"><textarea required placeholder="Açıklama *"></textarea></div>
          <div class="fb-field"><input type="email" required placeholder="E-posta adresin *" /></div>
        </div>

        <div class="fb-fields" data-for="puan">
          <p class="fb-q">DadaFit deneyimini nasıl puanlarsın?</p>
          <div class="fb-emoji" role="group" aria-label="Puan">
            <button type="button" data-val="1" aria-label="Çok kötü">😡</button>
            <button type="button" data-val="2" aria-label="Kötü">🙁</button>
            <button type="button" data-val="3" aria-label="İdare eder">😐</button>
            <button type="button" data-val="4" aria-label="İyi">🙂</button>
            <button type="button" data-val="5" aria-label="Harika">😍</button>
          </div>
          <div class="fb-field"><textarea placeholder="Eklemek istediğin bir şey var mı? (opsiyonel)"></textarea></div>
          <div class="fb-field"><input type="email" placeholder="E-posta adresin (opsiyonel)" /></div>
        </div>

        <label class="fb-kvkk">
          <input type="checkbox" required />
          <span><a href="yasal-v1.html?metin=aydinlatma">Aydınlatma Metni</a>'ni ve <a href="yasal-v1.html?metin=kvkk">KVKK Metni</a>'ni okudum, onaylıyorum.</span>
        </label>
        <button class="btn btn-primary fb-send" type="submit"><i class="fa-solid fa-paper-plane"></i> Gönder</button>
      </form>
      <div class="fb-success" id="fbSuccess" hidden>
        <span class="ok"><i class="fa-solid fa-check"></i></span>
        <h4>Görüşün bize ulaştı</h4>
        <p>Teşekkürler! Ekibimiz en kısa sürede inceleyip gerekirse e-posta ile dönüş yapacak.</p>
      </div>
    </div>
  </div>
</div>`;

var COOKIE_HTML = `<div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Çerez onayı" aria-live="polite">
  <div class="cookie-inner">
    <div class="cookie-text">
      <span class="cookie-ico"><i class="fa-solid fa-cookie-bite"></i></span>
      <p>Sana daha iyi bir deneyim sunmak için çerezler kullanıyoruz. Siteyi kullanmaya devam ederek çerez kullanımını kabul etmiş olursun. <a href="yasal-v1.html?metin=cerez">Çerez Politikası</a> · <a href="yasal-v1.html?metin=aydinlatma">KVKK Aydınlatma Metni</a></p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="btn-cookie-reject" id="cookieReject">Reddet</button>
      <button type="button" class="btn-cookie-accept" id="cookieAccept">Tümünü Kabul Et</button>
    </div>
  </div>
</div>
`;

var LGGATE_HTML = `<div class="lg-overlay" id="lgOverlay"></div>
<div class="lg-gate" id="lgGate" role="dialog" aria-modal="true" aria-label="Giriş gerekli">
  <div class="lg-panel">
    <button class="lg-close" id="lgClose" type="button" aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
    <span class="lg-ico"><i class="fa-solid fa-lock"></i></span>
    <h4 id="lgTitle">Bu işlem için giriş yap</h4>
    <p id="lgDesc">Kaydetmek, yorum yapmak ve takip etmek için DadaFit hesabına giriş yapman gerekiyor.</p>
    <div class="lg-acts">
      <a class="btn btn-primary" href="giris-v1.html"><i class="fa-regular fa-user"></i> Giriş Yap</a>
      <a class="btn btn-ghost" href="giris-v1.html?tab=kayit">Üye Ol</a>
    </div>
  </div>
</div>

<!-- ===== PRO-GATE (ücretli premium kilit — pro-v1 F1 dili) ===== -->
<div class="pg-overlay" id="pgOverlay"></div>
<div class="pro-gate" id="proGate" role="dialog" aria-modal="true" aria-label="Pro içerik">
  <div class="pg-panel">
    <button class="pg-close" id="pgClose" type="button" aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
    <span class="pg-ico"><i class="fa-solid fa-crown"></i></span>
    <span class="pg-tag"><i class="fa-solid fa-lock"></i> DadaFit Pro</span>
    <h4 id="pgTitle">Bu içerik Pro'da</h4>
    <p id="pgDesc">Derin program ve video içeriği DadaFit Pro üyeliğinle açılır.</p>
    <ul class="pg-feats">
      <li><i class="fa-solid fa-check"></i> İleri çok-haftalık programlar</li>
      <li><i class="fa-solid fa-check"></i> Eğitmen eşliğinde video serileri</li>
      <li><i class="fa-solid fa-check"></i> Diyetisyen + antrenör ortak plan</li>
    </ul>
    <div class="pg-acts">
      <a class="btn btn-ghost" href="pro-v1.html">Pro'yu İncele</a>
      <a class="btn btn-fit" href="pro-odeme-v1.html"><i class="fa-solid fa-crown"></i> Pro'ya Geç</a>
    </div>
  </div>
</div>


`;

var FOOTER_RAW = `<footer class="footer orange">
  <div class="wrap">
    <div class="foot-grid">
      <!-- 1 · MARKA ALANI (sol sabit) -->
      <div class="foot-brand">
        <div class="foot-lockup"><span class="fl-mark"><i class="fa-solid fa-bolt"></i></span><span class="fl-word"><span class="bd">Dada</span><span class="sf">Fit</span></span></div>
        <!-- Marka açıklaması — revizyon dokümanından BİREBİR -->
        <p class="foot-tag">Bilimsel temelli hareket içerikleri, uygulanabilir programlar ve ölçülebilir takip araçlarıyla aktif yaşamı herkes için erişilebilir kılıyoruz.</p>
        <!-- SOSYAL — Beyar kararı: YALNIZ Instagram ve YouTube.
             X · Facebook · LinkedIn footer'dan kaldırıldı, geri eklenmez. -->
        <div class="foot-soc">
          <!-- YER TUTUCU — gerçek hesap adresi gelince değişecek · docs/icerik-bekleyen.md -->
          <a href="#" data-yer-tutucu="instagram" aria-label="Instagram — hesap adresi henüz yok, yakında"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
          <!-- YER TUTUCU — gerçek hesap adresi gelince değişecek · docs/icerik-bekleyen.md -->
          <a href="#" data-yer-tutucu="youtube" aria-label="YouTube — hesap adresi henüz yok, yakında"><i class="fa-brands fa-youtube" aria-hidden="true"></i></a>
        </div>
      </div>
      <!-- 2·3·4 · HAREKET VE ÖĞREN / PROGRAMLAR VE UZMAN DESTEĞİ / ENERJİ VE DENGE -->
      <!--FOOT-COLS-->
      <!-- 5 · UYGULAMA ALANI (sağ sabit)
           R11/M4 · Beyar: "Footer'da sağ altta 'yakında' diye bir şey
           kalmayacak — Gourmet'teki gibi yapabilirsin."

           KARDEŞ MARKALAR ÖLÇÜLDÜ (canlı, aynı gün):
             dadadiet.com   → <span>İndir<b>App Store</b></span>
             dadagourmet.com→ <span class="ab-store">App Store</span> · üstte "İndir"
             dadagastro.com → <a class="store-badge" aria-disabled="true"
                                 title="Yakında"><span>İndir</span><b>App Store</b></a>
           Üçünde de görünen yazı "İndir"; üçünde de ayrı bir
           "uygulama henüz yayımlanmadı" paragrafı YOK.

           Doküman şartı DEVAM EDİYOR: "Uygulama henüz yayımlanmadıysa
           mağaza butonları aktif indirme bağlantısı gibi çalışmamalıdır."
           Bu yüzden kutular hâlâ <a href> DEĞİL, <span aria-disabled="true">:
           tıklanamaz, odak sırasına girmez. Gastro'nun kalıbı izlenerek
           title="Yakında" eklendi — durum bilgisi kayboldu sanılmasın,
           yalnız görsel gürültü kalktı. Ekran okuyucu için aynı bilgi
           aria-label icinde de duruyor.
           QR kod KONMADI — gerçek indirme adresi olmadığı için sahte QR
           üretilmedi. Adres gelince docs/icerik-bekleyen.md'deki kalem
           işlenecek. -->
      <div class="foot-app">
        <h5>DadaFit'i İndir</h5>
        <p class="ap-tag">Antrenmanını yanında taşı. Programların, günlük aktiviten ve enerji takibin tek uygulamada.</p>
        <div class="ap-stores" role="group" aria-label="Mobil uygulama mağazaları — uygulama henüz yayımlanmadı">
          <span class="ap-store" aria-disabled="true" title="Yakında"><i class="fa-brands fa-apple" aria-hidden="true"></i><span class="fs-txt"><small>İndir</small><b>App Store</b></span></span>
          <span class="ap-store" aria-disabled="true" title="Yakında"><i class="fa-brands fa-google-play" aria-hidden="true"></i><span class="fs-txt"><small>İndir</small><b>Google Play</b></span></span>
        </div>
      </div>
    </div>
    <!-- 6 · KURUMSAL BANT — sütunların içinde değil, ayrı yatay bant -->
    <nav class="foot-corp" aria-label="Kurumsal bağlantılar"><!--FOOT-CORP--></nav>
    <!-- 7 · YASAL BANT — DOKUNULMAZ (metin · sıra · hedef · renk aynı) -->
    <!--FOOT-LEGAL-->
    <div class="foot-bottom">
      <span class="fb-left">© 2026 <b><span class="bd">Dada</span><span class="sf">Fit</span></b> · Tüm hakları saklıdır.</span>
      <a href="https://gaviaworks.com" target="_blank" rel="noopener"><span class="gw-code">&lt;/&gt;</span> GaviaWorks</a>
    </div>
  </div>
</footer>
`;

function footerHtml(){
  return FOOTER_RAW
    .replace('<!--FOOT-COLS-->',  footerColsHtml())
    .replace('<!--FOOT-CORP-->',  footerCorpHtml())
    .replace('<!--FOOT-LEGAL-->', footerLegalHtml());
}

/* ============================================================
 4 · MOUNT — kabuk markup'i sayfaya basilir
 ============================================================ */
var _top = document.getElementById('fitShellTop');
if(_top){
  _top.outerHTML = TOPBAR + '\n' + headerHtml() + '\n' + drawerHtml() +
    '\n<nav class="bottom-nav" aria-label="Mobil alt navigasyon">\n  ' + bottomNavHtml() + '\n</nav>\n' +
    FEEDBACK_HTML + '\n' + COOKIE_HTML;
}
var _bot = document.getElementById('fitShellBottom');
if(_bot){
  /* DadaMentor kaldirildi (belge §1 ve §21: yerine baska bir yapay zeka
     asistani da eklenmez). Not: MENTOR_HTML kendi icinde de bir
     <button id="toTop"> tasiyordu, yani sayfada AYNI id'den iki dugme
     olusuyordu — blok kalkinca o cift-id hatasi da kapandi. */
  _bot.outerHTML = LGGATE_HTML + '\n' + footerHtml() +
    '\n<button class="to-top" id="toTop" type="button" aria-label="Basa don"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button>';
}

/* ---- FİT PLANIM kişisel kabuğu: banner + breadcrumb + sekme rayı ---- */
/* R11/M17 · plan profilinin kapak görseli — tek yerde, 14 sayfa ortak */
var PLAN_KAPAK = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80&auto=format&fit=crop&sat=-12';
var _plan = document.getElementById('fitPlanTop');
if(_plan){
  var pk    = _plan.getAttribute('data-plan-page') || 'bugun';
  var ptit  = _plan.getAttribute('data-plan-title') || 'Fit Planım';
  var psub  = _plan.getAttribute('data-plan-sub') || '';
  var cur   = null;
  /* Başlık/breadcrumb çözümü TÜM plan sayfalarından (ray dışındakiler dahil),
     ray ise YALNIZ altı sekmeden üretilir (belge §4). */
  for(var pi=0;pi<PLAN_PAGES.length;pi++){ if(PLAN_PAGES[pi].key===pk) cur=PLAN_PAGES[pi]; }
  /* G2 — sekme rayı B1'de sabitlenen ORTAK bileşene geçti (.fit-tabs).
     Sayfa geçişi kipi: kalemler <a>, aktif olan aria-selected="true" +
     aria-current="page" taşır; bileşen JS'i bu kipte panel yönetmez,
     yalnız rolleri kurar (bkz. fit-shell.js → [data-fit-tabs]). */
  /* Alt sayfalar rayda ÜST kalemini işaretler: defter-su / defter-dengele /
     defter-haftalik açıkken ray "Enerji Defteri"ni aktif gösterir. Ölçümde
     bu üç sayfada raydaki hiçbir kalem aktif değildi. */
  var RAY_UST = {'defter-dengele':'defter','defter-su':'defter','defter-haftalik':'defter'};
  var rayKey = RAY_UST[pk] || pk;
  var tabs = PLAN_TABS.map(function(it){
    var on = it.key===rayKey;
    return '<a class="fit-tab" href="'+it.href+'" aria-selected="'+(on?'true':'false')+'"'+
           (on?' aria-current="page"':'')+'><i class="'+it.icon+'"></i> '+it.label+'</a>';
  }).join('\n        ');
  /* R11/M17 · Beyar: "enerji-defteri'nin profilini DadaGastro'nun aynısı
     yap — dadagastro.com/sefler/admin, burasının aynısını yapacaksın."

     ÖNCESİ: 544px DÜZ KOYU banner (.lib-top.fp-top); profil altta küçük bir
     avatar+ad satırıydı (.fp-who).
     ŞİMDİ: kardeş markanın şef profili deseni — yuvarlak köşeli kapak
     görseli + üstüne binen beyaz kimlik kartı + sayaç şeridi.
     Biçim kabukta: fit-shell.css → "PLAN PROFİL BAŞLIĞI".

     Desen DadaFit'te zaten vardı (profil-v1 `.pf-top`) ve referansla
     birebirdi (banner 280/24px · avatar 128 · stats 16px) — plan sayfaları
     onu kullanmıyordu. profil-v1'e DOKUNULMADI; rol koşullu 69 kuralı
     taşımak yerine ölçülen değerlerle sade bir sürüm yazıldı.

     Kapak görseli sabit (parallax) — kardeş markada da öyle
     (`.pf-banner px-band`); `data-fit-px` ile kabuğun parallax bileşenine
     bağlanıyor (R11/M2). */
  _plan.outerHTML =
   '<section class="fp-profil">\n'+
   '  <div class="wrap">\n'+
   '    <nav class="lib-crumb pf-crumb" aria-label="Sayfa yolu">\n'+
   '      <a href="dadafit-hub-v1.html" class="crumb-home">'+
   '<i class="fa-solid fa-house" aria-hidden="true"></i>'+
   '<span class="sr-only">DadaFit ana sayfa</span></a>\n'+
   '      <i class="fa-solid fa-chevron-right"></i>\n'+
   '      <a href="fit-planim-v1.html">Fit Planım</a>\n'+
   '      <i class="fa-solid fa-chevron-right"></i>\n'+
   '      <span class="cur">'+(cur?cur.label:ptit)+'</span>\n'+
   '    </nav>\n'+
   '    <div class="fp-kapak" data-fit-px style="--px-img:url(\''+PLAN_KAPAK+'\')">\n'+
   '      <span class="fp-kapak-mark"><i class="fa-solid fa-bolt"></i> Fit Planım · kişisel alanın</span>\n'+
   '    </div>\n'+
   '    <div class="fp-kimlik">\n'+
   '      <span class="fp-ava2" style="background-image:url(\''+AVA+'\')"></span>\n'+
   '      <div class="fp-kimlik-id">\n'+
   '        <h1>'+ptit+'</h1>\n'+
   '        <span class="fp-handle2 fp-name">Elif Şahin</span>\n'+
   (psub? '        <p class="fp-lead2">'+psub+'</p>\n' : '')+
   '        <div class="fp-kimlik-meta">\n'+
   '          <span class="fp-state"><i class="fa-solid fa-user"></i> Ücretsiz üye · 3 haftadır burada</span>\n'+
   '          <a href="fit-planim-rozetler-v1.html"><i class="fa-solid fa-award"></i> Rozetlerim</a>\n'+
   '        </div>\n'+
   '      </div>\n'+
   '    </div>\n'+
   '  </div>\n'+
   '</section>\n'+
   '<div class="pf-tabbar fp-tabbar">\n'+
   '  <div class="wrap">\n'+
   '    <nav class="fit-tabs" data-fit-tabs="planim" aria-label="Fit Planım bölümleri">\n        '+tabs+'\n    </nav>\n'+
   '  </div>\n'+
   '</div>\n'+
   /* R8 madde 36 — PROTOTİP UYARISI ÇIKTI, GİRİŞ KAPISI KALDI.
    Blok 13 sayfada görünüyordu (4 enerji-defteri + 9 fit-planim) ve iki işi
    birden yapıyordu: "bu veriler örnektir" prototip uyarısı + misafirin
    giriş CTA'sı. Beyar: cümle gitsin, düğmeler kalsın.
    Çıkan: `<i class="fa-circle-info">` + "veriler örnektir" paragrafı.
    Kalan: `.fp-gate-acts` (Giriş Yap · Ücretsiz hesap oluştur), `data-lg-only`
    kapısı, `.fp-gate` sarmalayıcısı — yani 13 sayfada giriş CTA'sı korundu.
    Blok artık info kutusu değil CTA bandı; biçimi de ona göre değişti
    (fit-shell.css `.fp-gate-in`). */
   '<div class="wrap fp-gate" data-lg-only>\n'+
   '  <div class="fp-gate-in">\n'+
   '    <span class="fp-gate-acts"><a class="btn btn-primary" href="giris-v1.html"><i class="fa-regular fa-user"></i> Giriş Yap</a><a class="btn btn-ghost" href="giris-v1.html?tab=kayit">Ücretsiz hesap oluştur</a></span>\n'+
   '  </div>\n'+
   '</div>';
}

/* ---- PLAN KABUĞU · dikişi rayın dibine çek (Beyar · Revize 1) --------
 Ölçülen sorun: kabuk, yapışkan sekme rayı ile beyaz gövde arasına
 `.fp-gate` (Giriş Yap / Ücretsiz hesap oluştur) basıyor; Enerji Defteri
 sayfalarında ayrıca `.wrap.ed-subtabs` ve `.wrap.fp-actions` da araya
 giriyor. Hepsi SAYDAM `.wrap`, yani sayfa zemini üstünde yüzüyorlar.
 Sonuç: gövdenin yuvarlak üst köşesi banner'dan ~340px aşağı düşüyor ve
 "banner'ın altındaki panel" okuması kayboluyor (14 sayfa).

 Beyar kararı: ray DÜZ kalsın, yuvarlaklık panelde olsun. Bunun tutması
 için araya giren saydam blokları panelin İÇİNE alıyoruz — düğmeler
 kaybolmuyor, yerleri değişmiyor; yalnız zeminleri gri yerine panelin
 kendisi oluyor ve panel rayın hemen altından başlıyor.

 Neden burada, neden dikiş işaretleyicisinde değil: taşıma YALNIZ plan
 kabuğuna özgü. Genel kural yapılsaydı dadafit-hub · dadafit-kopru ·
 challenge · program-detay · antrenor-ol sayfalarındaki
 `.wrap.fit-band-panel` (banner kenarına BİLEREK oturtulmuş koyu yüzen
 kart) de gövdenin içine çekilir ve o tasarım bozulurdu.
 Bu blok, dikiş işaretleyicisinden ÖNCE koşmak zorunda (dosya sonundaki
 "BANNER → GÖVDE DİKİŞİ" bloğu taşınmış hâli görsün diye).
 --------------------------------------------------------------------- */
(function(){
  var ray = document.querySelector('.pf-tabbar.fp-tabbar');
  if(!ray) return;
  var ana = ray.parentElement; if(!ana) return;

  var tamEnEsik = ana.clientWidth * 0.94;
  var tasinacak = [], hedef = null, n = ray.nextElementSibling, adim = 0;

  while(n && adim++ < 8){                 /* 8 = kaçak döngü emniyeti */
    var cs = getComputedStyle(n);
    var bg = cs.backgroundColor;
    var saydam = !bg || bg === 'transparent' ||
                 /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)$/.test(bg);
    var tamEn  = n.getBoundingClientRect().width >= tamEnEsik;

    if(!saydam && tamEn){ hedef = n; break; }   /* gövde bandı bulundu */
    tasinacak.push(n);
    n = n.nextElementSibling;
  }

  if(!hedef || !tasinacak.length) return;

  /* sırayı koruyarak gövdenin en başına al */
  for(var i = tasinacak.length - 1; i >= 0; i--){
    hedef.insertBefore(tasinacak[i], hedef.firstChild);
  }
})();

/* hero'lu sayfa: body[data-fit-hero="1"] → header hero uzerinde seffaf baslar */
var HERO_MODE = document.body.getAttribute('data-fit-hero') === '1';

/* ------------------------------------------------------------------
 HEADER ŞEFFAF MODU — hero'ya ek olarak BANNER'lı sayfalar da girer.
 Ölçülen referans (dadadiet.com/diyetisyenler, 1440px):
 · scroll 0  → header.at-top · background rgba(0,0,0,0) · box-shadow none
 · scroll 400 → at-top düşer · background rgba(255,255,255,.94) + gölge
 Yani kardeş ürün at-top'ı tam-ekran hero sayfasına özel KULLANMIYOR;
 koyu banner taşıyan liste sayfalarında da header banner'ın üzerinde
 şeffaf duruyor. DadaFit'te bu mod yalnız data-fit-hero ile açılıyordu,
 16 banner sayfası hep katıydı.

 Karar tek yerde verilir: sayfa koyu banner taşıyor mu?
 · .lib-top  → liste/rehber banner'ı (16 sayfa)
 · #fitPlanTop → Planım kabuğu; .fp-top banner'ı yukarıda ondan üretildi
 Bayrak body'ye yazılır, banner'ın üst boşluğunu CSS oradan çözer
 (bkz. fit-shell.css "BANNER ÜZERİNDE ŞEFFAF HEADER").
 ------------------------------------------------------------------ */
/* .cp-top SONRADAN EKLENDİ: antrenör detayının banner'ı bu sınıfı taşıyor ve
   over-mode'a girmediği için header o sayfada koyu görselin üstünde KATI
   kalıyordu (ölçüldü: scroll=0 → rgb(255,255,255)). Diğer banner sayfalarıyla
   tutarsızdı. Eşlik eden yerleşim kuralları fit-shell.css'te. */
/* TÜM KOYU BANNER SINIFLARI over-mode'a girer. Başlangıçta yalnız .lib-top ve
   .fp-top vardı; kullanıcı antrenör detayında (.cp-top) ve antrenör ol
   sayfasında (.ol-top) header'ın koyu görselin üstünde KATI kaldığını bildirdi.
   Tek tek kovalamak yerine banner sınıflarının tamamı listelendi — her biri
   için eşlik eden yerleşim kuralı fit-shell.css'te (margin → padding çevrimi). */
/* R11/M17 · `.fp-top` LİSTEDEN ÇIKARILDI. Plan sayfalarının banner'ı artık
   koyu değil, BEYAZ profil başlığı (`.fp-profil`). Şeffaf header modu beyaz
   zeminin üstünde marka yazısını da beyaz boyuyor → logo görünmez olurdu.
   (Aynı gerekçeyle `profil-v1` de bu listede hiç olmadı: KARARLAR K23 —
   "beyaz profil kapağı, koyu banner ailesiyle aynı dil değil".)
   `tests/header-banner.mjs` bu sayfalarda artık KATI header bekliyor. */
var OVER_MODE = HERO_MODE || !!document.querySelector(
  '.lib-top, .cp-top, .kp-top, .chl-hero, .pd-hero, .fs-top, .ol-top, .ed-top');
if(OVER_MODE) document.body.setAttribute('data-fit-over','1');

/* ------------------------------------------------------------------
 BANNER AİLESİ — liste mi, detay mı? (Beyar: "liste ve detay sayfalarındaki
 bannerların dikeydeki uzunlukları KENDİ İÇLERİNDE tutarlı olsun, belli bir
 uzunluğa fixle")
 Sınıf adı ayırmıyor: `video-seans-detay` ve `fit-testi-detay` de `.lib-top`
 kullanıyor, yani `.lib-top` = liste demek değil. Ayrım DOSYA ADINDAN
 yapılıyor — repodaki tek istikrarlı işaret bu:
   *-detay-*  ya da bilinen detay sayfaları → detay ailesi
   geri kalan banner'lı sayfalar           → liste ailesi
 CSS iki token okuyor: --hero-h-list / --hero-h-detail. */
var DETAY_PAGES = ['challenge-v1','egzersiz-detay-v1','antrenor-detay-v1','program-detay-v1'];
var IS_DETAY = /-detay(-|$)/.test(PAGE) || DETAY_PAGES.indexOf(PAGE) > -1;
document.body.setAttribute('data-fit-hero-kind', IS_DETAY ? 'detay' : 'liste');

/* ------------------------------------------------------------------
 R6 · MADDE 4 — BANNER İKİ KOLONA AYRILIR: SOL İÇERİK + SAĞ İSTATİSTİK
 ------------------------------------------------------------------
 ÖLÇÜM (Playwright, 8. oturum, kardeş markalar @1440):
   dadadiet.com/diyetisyenler   .lst-stats  flex/COLUMN  gap 16px
   dadagastro.com/tarifler      .lst-stats  flex/COLUMN  gap 16px
   dadagastro.com/mutfak-sozlugu .lst-stats flex/COLUMN  gap 16px
 Üçünde de kolon `.wrap`ın SAĞ kenarına dayanıyor (kolon sağ kenarı 1308 =
 wrap sağ kenarı), sol kolonla arasındaki boşluk **39 px**, kolonun alt
 kenarı sol kolonun alt kenarıyla **birebir** (Δ = 0.0 px, üçünde de).
 ≤1024'te kolon sol kolonun ALTINA düşüyor ve yatay sıraya dönüyor.

 NEDEN JS: iki kolon CSS'te ancak sol kolonun kendi kapsayıcısı varsa
 kurulabiliyor. Referans da aynısını yapıyor (`.lh-main`). `.wrap`ı grid'e
 çevirip istatistiği bütün satırlara yaydırmak denendi: satır sayısı sayfadan
 sayfaya değiştiği için `grid-row:1/-1` çalışmıyor, `span N` ise N−1 tane
 boş satır aralığı (row-gap) üretip banner'ı büyütüyor — sabit yükseklik
 ailesinde kabul edilemez. Bu yüzden sol kolon burada tek bir
 `<div class="lib-main">` içine alınıyor.

 İşaretleme 25 sayfada tek tek değiştirilmiyor; sıralama korunuyor:
 `.lib-stats` dışındaki her çocuk, belge sırasıyla `.lib-main`e giriyor.
 R15'in `order:1` numarası (işaretlemede CTA istatistikten önce geliyordu)
 böylece gereksizleşiyor — istatistik kolondan tamamen çıktı.

 GERİ ALMA: bu IIFE silinir + `fit-shell.css`'teki "R6 · MADDE 4" bloğu
 silinirse eski tek kolonlu düzen geri gelir.
 ------------------------------------------------------------------ */
(function(){
  if(!document.body.hasAttribute('data-fit-hero-kind')) return;
  var stats = document.querySelector('.lib-stats');
  if(!stats) return;
  var wrap = stats.parentElement;
  if(!wrap || !wrap.classList.contains('wrap')) return;   /* beklenmedik yapı: dokunma */
  if(wrap.querySelector(':scope > .lib-row')) return;     /* zaten kurulmuş */

  /* KIRINTI İKİ KOLONUN DIŞINDA KALIR — referansın yapısı bu:
       .wrap > nav.rd-crumb            (tam genişlik, kolonların ÜSTÜNDE)
       .wrap > [ .lh-main | .lst-stats ]
     Kırıntı `.lib-main`in içine alınırsa sağdaki kolon kırıntı satırıyla
     aynı hizada başlıyor ve iri sayı ince kırıntı satırıyla yarışıyor
     (ölçüldü: 6 sayfada ilk sayının üst kenarı kırıntının 0.8 px üstünde).
     Referansta bu olmuyor çünkü kırıntı kolonların üstünde ayrı bir satır. */
  var ilk = wrap.firstElementChild;
  var krumb = (ilk && ilk !== stats &&
               (/crumb/.test(ilk.className || '') || ilk.tagName === 'NAV')) ? ilk : null;

  var satir = document.createElement('div');  satir.className = 'lib-row';
  var sol   = document.createElement('div');  sol.className   = 'lib-main';

  var kids = [].slice.call(wrap.childNodes);
  wrap.insertBefore(satir, stats);
  satir.appendChild(sol);
  kids.forEach(function(n){
    if(n === stats || n === satir || n === krumb) return;
    sol.appendChild(n);
  });
  satir.appendChild(stats);
})();

/* ============================================================
 4b · TEK KAYDIRMA KİLİDİ — "layout sağa kayıyor" bug'ının kökü
 ------------------------------------------------------------
 Eskiden altı ayrı yer (drawer, görüş modalı, giriş kapısı, pro kapısı,
 sihirbaz, kabuk dışı sayfa scriptleri) doğrudan
 document.body.style.overflow='hidden' yazıyordu. Dikey kaydırma çubuğu
 kaybolunca clientWidth ~15px büyüyor, ortalanmış .wrap yeniden
 konumlanıyor ve TÜM SAYFA yana sıçrıyordu. Üstelik iki katman üst üste
 açılıp biri kapanınca (dropdown → drawer → link) kilit erken kalkıyordu.

 Çözüm iki parçalı:
 · CSS: html{scrollbar-gutter:stable} → oluk her zaman rezerve, kilit
 açılıp kapansa da genişlik DEĞİŞMEZ.
 · JS: sayaçlı tek kilit. N kez kilitlenip N kez açılmadan serbest kalmaz.
 Ek güvenlik olarak scrollbar-gutter desteklemeyen tarayıcıda
 padding telafisi uygulanır.
 ============================================================ */
var _lockCount = 0, _lockPad = '';
function lockScroll(){
  if(_lockCount++ > 0) return;
  var sbw = window.innerWidth - document.documentElement.clientWidth;
  var gutterOK = window.CSS && CSS.supports && CSS.supports('scrollbar-gutter','stable');
  if(sbw > 0 && !gutterOK){
    _lockPad = document.body.style.paddingRight;
    document.body.style.paddingRight = sbw + 'px';
  }
  document.body.classList.add('scroll-locked');
}
function unlockScroll(){
  if(_lockCount === 0) return;
  if(--_lockCount > 0) return;
  document.body.classList.remove('scroll-locked');
  document.body.style.paddingRight = _lockPad;
  _lockPad = '';
}
/* ============================================================
 EKOSİSTEM BAĞLANTILARININ TEK NOKTADAN YÖNETİMİ — belge §14
 ------------------------------------------------------------
 Belge: "Doğrudan başka prototiplerin HTML sayfalarına bağımlı bağlantılar
 oluşturma. Entegrasyonlar yapılandırılabilir servis adresleri üzerinden
 tasarlanmalıdır."

 Sayfa markup'ında kardeş ürüne giden 37 bağlantı hâlâ eski kökü yazıyor
 (ölçüldü). 35 dosyayı tek tek düzenlemek yerine kök TEK yerden (ECO_BASE)
 okunur ve yükleme anında yeniden yazılır: artık markup'taki eski önek bir
 ADRES değil, "burası ekosistem bağlantısı" işaretidir. Gerçek servis adresi
 belirlendiğinde yalnız ECO_BASE değişir, hiçbir sayfaya dokunulmaz.

 Bağlantılar ayrıca işaretlenir (data-eco="gastro|diet|gourmet|campus|eko")
 ki hangi sistemle veri/gezinme paylaşıldığı ölçülebilir ve raporlanabilir
 olsun — belge §14 "hangi sistemle paylaşıldığı açıkça gösterilmelidir" diyor.
 ============================================================ */
(function(){
  var LEGACY = 'https://by4r.github.io/dadamutfak-view/v7-6cu356/';
  /* hedef sayfadan hangi kardeş ürün olduğunu çıkar */
  function which(path){
    if(/saglik-hub|gunluk-kalori|diyetisyen/.test(path)) return 'diet';
    if(/kesfet/.test(path))   return 'gourmet';
    if(/akademi/.test(path))  return 'campus';
    if(/tarif|anasayfa-portal|ogun|menu/.test(path)) return 'gastro';
    return 'eko';
  }
  var n = 0;
  document.querySelectorAll('a[href^="'+LEGACY+'"]').forEach(function(a){
    var path = a.getAttribute('href').slice(LEGACY.length);
    a.setAttribute('href', ECO_BASE + path);
    a.setAttribute('data-eco', which(path));
    /* dış sisteme çıkıyor: yeni sekme + güvenli rel (kullanıcı DadaFit'ten düşmesin) */
    if(!a.hasAttribute('target')){ a.setAttribute('target','_blank'); a.setAttribute('rel','noopener'); }
    n++;
  });

window.FIT_SHELL = window.FIT_SHELL || {};
  window.FIT_SHELL.ecoLinks = n;      /* ölçüm/rapor için: kaç bağlantı yazıldı */
})();

/* ============================================================
 ODAK TUZAĞI — belge §20
 ------------------------------------------------------------
 Belge üç şey istiyor:
 · "Modal açıldığında focus modal içine taşınmalıdır"
 · "Modal kapandığında focus önceki öğeye dönmelidir"
 · "Escape tuşuyla modal kapatılabilmelidir"
 Escape zaten her katmanda vardı; ilk ikisi HİÇBİR katmanda yoktu — modal
 açıkken Tab'lamak kullanıcıyı arkadaki sayfaya götürüyor, kapanınca odak
 <body>'ye düşüyordu (klavye kullanıcısı yerini kaybediyor).

 Katman başına ayrı kod yazmak yerine tek yardımcı: trapFocus(el) odağı
 içeri alır, Tab/Shift+Tab'ı döngüye sokar ve geri döndürme işini üstlenir;
 döndürdüğü fonksiyon çağrılınca odak açan öğeye geri gider.
 Kaydırma kilidiyle aynı desen: SAYAÇ YOK, çünkü her katman kendi
 release'ini tutuyor ve aç/kapa durum korumalı.
 ============================================================ */
function trapFocus(el){
if(!el) return function(){};
var SEL = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),'+
          'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
var prev = document.activeElement;
function items(){
  return Array.prototype.filter.call(el.querySelectorAll(SEL), function(n){
    /* görünmeyen öğe odak sırasına girmez */
    return n.offsetWidth > 0 || n.offsetHeight > 0 || n === document.activeElement;
  });
}
  /* Odağı içeri al — AMA GERÇEKTEN GÖRÜNÜR OLDUĞUNDA.
     Katmanlar sınıf ekleyerek açılıyor (.show / .open) ve CSS geçişi bitene
     kadar öğe odaklanamaz durumda: `.fb-modal` `visibility:hidden` +
     `transition: … visibility .25s` ile açılıyor, `visibility:hidden` bir
     öğede `.focus()` SESSİZCE NO-OP'tur.

     ÖLÇÜM (görüş modalı, 6 koşu × 12 kare örneklendi):
       kare 0 → visibility:hidden · checkVisibility()=false · activeElement=BODY
       kare 1 → visibility:visible · opacity≈0.09  · odak fbClose'a oturuyor
     Yani odaklanabilirlik ilk karede DEĞİL, ikinci karede geliyor. Eski kod
     tek bir yedek rAF deneme yapıyordu; kare bütçesi bir kare bile kayınca
     (gerçek fare tıklaması, yavaş boyama, GC) ikinci deneme de görünmezliğe
     denk gelip odak açan düğmede kalıyordu → süit 6 koşuda 3 kez düşüyordu.

     Çözüm: tek atış yerine SINIRLI KARE YOKLAMASI. Her karede önce öğenin
     gerçekten görünür olup olmadığına bakılır (checkVisibility varsa o,
     yoksa computed visibility + kutu ölçüsü); görünürse odak denenir.
     Odak içeri girene kadar en fazla MAX_FRAMES kare denenir — .25s'lik geçiş
     60fps'te ~15 kare, 20 kare üst sınır bunu güvenle kapsar ve sonsuz döngü
     riski yoktur. Odak içeri girer girmez yoklama durur, böylece kullanıcı
     modal içinde başka bir öğeye geçtiyse geri çekilmez. */
  var MAX_FRAMES = 20;
  function visible(n){
    if(!n) return false;
    if(typeof n.checkVisibility === 'function'){
      return n.checkVisibility({ visibilityProperty:true, contentVisibilityAuto:true });
    }
    var cs = window.getComputedStyle(n);
    if(cs.visibility === 'hidden' || cs.display === 'none') return false;
    return n.offsetWidth > 0 || n.offsetHeight > 0 || n.getClientRects().length > 0;
  }
  function focusIn(tries){
    if(!document.contains(el)) return;
    if(el.contains(document.activeElement)) return;   /* zaten içeride */
    if(visible(el)){
      var list = items();
      if(list.length){ list[0].focus(); }
      else { el.setAttribute('tabindex','-1'); el.focus(); }
      if(el.contains(document.activeElement)) return; /* oturdu */
    }
    if(tries >= MAX_FRAMES) return;                   /* üst sınır: pes et */
    if(typeof requestAnimationFrame === 'function'){
      requestAnimationFrame(function(){ focusIn(tries + 1); });
    } else {
      setTimeout(function(){ focusIn(tries + 1); }, 16);
    }
  }
  if(typeof requestAnimationFrame === 'function') requestAnimationFrame(function(){ focusIn(0); });
  else setTimeout(function(){ focusIn(0); }, 0);
  /* Sayfa YÜKLENİRKEN açılan katman (ör. ?lg=1 giriş kapısı) için ek deneme:
     kabuk script'i parse edilirken open() çağrılıyor, rAF 'load' tamamlanmadan
     çalışıyor ve tarayıcı load sonrası odağı <body>'ye geri alıyor.
     ÖLÇÜM: ?lg=1 ile açılan kapıda odak "scroll-locked" (yani body) kalıyordu,
     aynı katmana elle trapFocus çağrıldığında lgClose'a oturuyordu. */
  if(document.readyState !== 'complete'){
    window.addEventListener('load', function once(){
      window.removeEventListener('load', once);
      if(document.contains(el) && !el.contains(document.activeElement)) focusIn(0);
    });
  }

function onKey(e){
  if(e.key !== 'Tab') return;
  var cur = items();
  if(!cur.length) return;
  var first = cur[0], last = cur[cur.length - 1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  else if(!el.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', onKey, true);

return function release(){
  document.removeEventListener('keydown', onKey, true);
  /* odak açan öğeye döner — hâlâ DOM'da ve odaklanabilirse */
  if(prev && document.contains(prev) && typeof prev.focus === 'function'){
    try{ prev.focus(); }catch(e){}
  }
};
}

window.FIT_SHELL = window.FIT_SHELL || {};
window.FIT_SHELL.eco = ECO;
window.FIT_SHELL.trapFocus = trapFocus;
window.FIT_SHELL.lockScroll = lockScroll;
window.FIT_SHELL.unlockScroll = unlockScroll;

/* ============================================================
 5 · KABUK DAVRANISI
 ============================================================ */
/* ---- ortak chrome davranışı (hub satır içi bloklarından birebir) ---- */
/* ===== ORTAK CHROME JS (v3a'dan, sayfa-bağımsız hale getirildi) =====
 SS paramları: ?dd=1 (mega+dil açık) · ?drawer=1 · ?cc=1 (çerez) · ?fb=1 (görüş modal)
 Header VARSAYILAN KATI. Hero'lu sayfa şeffaf başlangıç isterse aşağıdaki
 heroMode bayrağını kendi kopyasında true yapar (v3a davranışı). */

// SS paramları
// ===== Login-state simülasyonu (mockup) — İA §2.3 sözleşmesi =====
// ?auth=1 → localStorage dm_auth='1' + body.is-auth ; ?auth=0 → temizle (logout)
// param yoksa localStorage'a bakılır. Çıkış linkleri ?auth=0'a yönlendirir (M7).
(function(){
  /* C1 — tek auth/rol token dm_user{auth,roles[],verified,level}. Eski dm_auth/dm_business
 migrate+silinir. Kök kuralı: auth ⟹ roles "kullanici" ile başlar; isletme operatörü
 ["kullanici","isletme"]. Class additive (is-auth/has-business AYNEN) + body[data-roles]. */
  var KEY='dm_user', OK={kullanici:1,antrenor:1,diyetisyen:1,isletme:1};
  function rd(){ try{var r=localStorage.getItem(KEY);return r?JSON.parse(r):null;}catch(e){return null;} }
  function wr(u){ try{localStorage.setItem(KEY,JSON.stringify(u));}catch(e){} }
  var u=rd();
  if(!u){                                   // migrasyon: eski binary flag → dm_user (bir kez)
    var oa=false,ob=false;
    try{oa=localStorage.getItem('dm_auth')==='1';}catch(e){}
    try{ob=localStorage.getItem('dm_business')==='1';}catch(e){}
    if(oa||ob){ u={auth:true,roles:['kullanici'],verified:false,level:0}; if(ob)u.roles.push('isletme'); wr(u); }
  }
  try{localStorage.removeItem('dm_auth');localStorage.removeItem('dm_business');}catch(e){}  // eski anahtar temizliği
  var qs=location.search;                    // URL-param (demo/SS akışı korunur + yeni roller)
  function ens(){ if(!u)u={auth:false,roles:[],verified:false,level:0}; }
  function addR(r){ ens(); if(OK[r]&&u.roles.indexOf(r)<0)u.roles.push(r); }
  if(qs.indexOf('auth=1')>-1){ ens(); u.auth=true; }
  else if(qs.indexOf('auth=0')>-1){ u=null; try{localStorage.removeItem(KEY);}catch(e){} }
  if(qs.indexOf('business=1')>-1){ ens(); u.auth=true; addR('isletme'); }
  else if(qs.indexOf('business=0')>-1){ if(u){var bi=u.roles.indexOf('isletme'); if(bi>-1)u.roles.splice(bi,1);} }
  var rm=/[?&]role=(antrenor|diyetisyen|isletme)/.exec(qs); if(rm){ ens(); u.auth=true; addR(rm[1]); }
  if(u){
    if(qs.indexOf('verified=1')>-1)u.verified=true; else if(qs.indexOf('verified=0')>-1)u.verified=false;
    var lm=/[?&]level=(\d+)/.exec(qs); if(lm)u.level=parseInt(lm[1],10)||0;
    if(u.auth&&u.roles.indexOf('kullanici')<0)u.roles.unshift('kullanici');   // kök her zaman önde
    wr(u);
  }
  var b=document.body, authed=!!(u&&u.auth);   // DOM: eski class kanalı (additive) + data-roles
  if(authed){
    b.classList.add('is-auth');
    if(u.roles.indexOf('isletme')>-1)b.classList.add('has-business');   // C3 köprü sinyali — AYNEN
    b.setAttribute('data-roles',u.roles.join(' '));
    if(u.verified)b.setAttribute('data-verified','1');
    if(u.level)b.setAttribute('data-level',String(u.level));
  }
  var bnA=document.getElementById('bnAccount');   // M6 — bottom-nav Hesap hedefi
  /* belge §3.3: Fit alt barında hesap kalemi Gastro defterine değil hesaba gider */
  if(bnA)bnA.setAttribute('href', authed?'hesabim-v1.html':'giris-v1.html');
})();

if(location.search.indexOf('dd=1')>-1){document.querySelector('.nav-item').classList.add('open');var _l=document.getElementById('tbLang');if(_l)_l.classList.add('open');}
if(location.search.indexOf('drawer=1')>-1){window.addEventListener('DOMContentLoaded',function(){document.getElementById('drawer').classList.add('open');document.getElementById('drawerOverlay').classList.add('open');var _s=document.querySelector('.d-has-sub');if(_s)_s.classList.add('open');});}

// header: VARSAYILAN katı (içerik sayfası). heroMode=true → hero üstünde şeffaf,
// ~60px scroll sonrası katı (v3a davranışı; ?hdr=solid ile yine zorla katı)
(function(){
  var header=document.querySelector('.header');
  /* hero VEYA banner → header üstte şeffaf, ~60px scroll sonrası katı */
  var overMode=OVER_MODE;
  var forceSolid=location.search.indexOf('hdr=solid')>-1;
  if(!overMode||forceSolid){ document.body.removeAttribute('data-fit-over'); return; }  // katı kal — at-top hiç eklenmez
  function onScroll(){ if(window.scrollY<60){header.classList.add('at-top');} else {header.classList.remove('at-top');} }
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
})();

// save / favorite toggle (recipes + products) — sayfada varsa çalışır
document.querySelectorAll('.r-save, .p-fav, .feat-save').forEach(function(btn){
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    btn.classList.toggle('saved');
    var i=btn.querySelector('i');
    if(btn.classList.contains('saved')){i.classList.remove('fa-regular');i.classList.add('fa-solid');}
    else{i.classList.remove('fa-solid');i.classList.add('fa-regular');}
  });
});

/* ---- "TÜMÜNÜ GÖR" SLIDER'LARI — data-track / data-dir ile genel ----
 Eskiden ok yalnız sabit 620px kaydırıyordu: uçta basınca hiçbir şey olmuyor,
 ok yine de aktif görünüyordu; ray klavyeyle kullanılamıyor, kaydırılacak
 içerik olmasa bile oklar duruyordu. Şimdi:
 · kaydırma miktarı görünür genişliğe göre hesaplanır (kart hizası bozulmaz)
 · uçlarda oklar disabled olur, hiç taşma yoksa ok grubu tamamen gizlenir
 · ray klavyeyle odaklanabilir; ok tuşları / Home / End çalışır
 · içerik veya boyut değişince durum yeniden ölçülür */
(function(){
  var tracks = {};
  document.querySelectorAll('.row-nav button[data-track]').forEach(function(b){
    var id = b.getAttribute('data-track');
    (tracks[id] = tracks[id] || []).push(b);
  });

  Object.keys(tracks).forEach(function(id){
    var t = document.getElementById(id);
    if(!t) return;
    var btns = tracks[id];
    var nav  = btns[0].closest('.row-nav');

    function step(){
      var first = t.firstElementChild;
      var card  = first ? first.getBoundingClientRect().width : 274;
      var gap   = parseFloat(getComputedStyle(t).columnGap || getComputedStyle(t).gap) || 0;
      var per   = Math.max(1, Math.floor(t.clientWidth / (card + gap)));
      return per * (card + gap);
    }
    function update(){
      var max = t.scrollWidth - t.clientWidth;
      var scrollable = max > 2;
      if(nav) nav.hidden = !scrollable;
      btns.forEach(function(b){
        var prev = b.getAttribute('data-dir') === 'prev';
        b.disabled = !scrollable || (prev ? t.scrollLeft <= 1 : t.scrollLeft >= max - 1);
      });
      /* kaydırılabilir ray klavye ile gezilebilir olsun */
      if(scrollable){
        if(!t.hasAttribute('tabindex')) t.setAttribute('tabindex','0');
        if(!t.hasAttribute('role')){ t.setAttribute('role','group'); }
        if(!t.hasAttribute('aria-label')) t.setAttribute('aria-label','Yatay kaydırılabilir liste');
      }
    }

    btns.forEach(function(b){
      b.addEventListener('click', function(){
        t.scrollBy({left: b.getAttribute('data-dir')==='prev' ? -step() : step(), behavior:'smooth'});
        if(t._pauseAuto) t._pauseAuto();
      });
    });

    t.addEventListener('keydown', function(e){
      if(e.target !== t) return;                    // kart içindeki odak kendi işini görsün
      var d = 0;
      if(e.key==='ArrowRight') d = step();
      else if(e.key==='ArrowLeft') d = -step();
      else if(e.key==='Home') { e.preventDefault(); t.scrollTo({left:0,behavior:'smooth'}); return; }
      else if(e.key==='End')  { e.preventDefault(); t.scrollTo({left:t.scrollWidth,behavior:'smooth'}); return; }
      if(!d) return;
      e.preventDefault();
      t.scrollBy({left:d, behavior:'smooth'});
    });

    t.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    if(window.ResizeObserver) new ResizeObserver(update).observe(t);
    update();
  });
})();

/* ---- NAV PANELİ — DadaDiet kuralı: panel hover ile açılır, BAŞLIK TIKLANINCA
 kendi merkez sayfasına gidilir. Eski davranış her tıklamada preventDefault
 uyguluyordu: başlık ölü bağlantıydı, panel açıkken ikinci bir sekmeye tıklamak
 odak + toggle çakışması üretiyordu. Dokunmatikte hover olmadığı için ilk dokunuş
 paneli açar, ikinci dokunuş bağlantıyı izler. ---- */
(function(){
  var HOVER = window.matchMedia('(hover:hover) and (pointer:fine)');
  function closeAll(except){
    document.querySelectorAll('.nav-item.open').forEach(function(o){
      if(o===except)return;
      o.classList.remove('open');
      var t=o.querySelector(':scope > a'); if(t)t.setAttribute('aria-expanded','false');
    });
  }
  document.querySelectorAll('.nav-item').forEach(function(it){
    var trigger=it.querySelector(':scope > a');
    if(!trigger || !it.querySelector('.dropdown,.mega'))return;

    /* masaüstü: hover — CSS zaten açıyor, aria durumunu JS senkronlar */
    it.addEventListener('mouseenter',function(){
      if(!HOVER.matches)return;
      closeAll(it); trigger.setAttribute('aria-expanded','true');
    });
    it.addEventListener('mouseleave',function(){
      if(!HOVER.matches)return;
      it.classList.remove('open'); trigger.setAttribute('aria-expanded','false');
    });

    trigger.addEventListener('click',function(e){
      if(HOVER.matches) return;                 // fare/klavye: bağlantı normal çalışsın
      if(it.classList.contains('open')) return; // dokunmatikte ikinci dokunuş → git
      e.preventDefault();                       // dokunmatikte ilk dokunuş → paneli aç
      closeAll(it);
      it.classList.add('open');
      trigger.setAttribute('aria-expanded','true');
    });

    /* klavye: panel odakla açılır, Tab ile içine girilir */
    it.addEventListener('focusin',function(){ closeAll(it); it.classList.add('open'); trigger.setAttribute('aria-expanded','true'); });
    it.addEventListener('focusout',function(e){
      if(it.contains(e.relatedTarget))return;
      it.classList.remove('open'); trigger.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('click',function(e){ if(!e.target.closest('.nav-item')) closeAll(null); });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    var open=document.querySelector('.nav-item.open');
    if(open){var t=open.querySelector(':scope > a');open.classList.remove('open');if(t){t.setAttribute('aria-expanded','false');t.focus();}}
  });
})();

// ---- HESAP / EKLE dropdown (header sağ blok, login-state) tıkla-aç ----
document.querySelectorAll('.acct-item').forEach(function(it){
  var trigger=it.querySelector('.icon-btn,.acct-btn');
  if(!trigger||!it.querySelector('.acct-menu'))return;
  trigger.addEventListener('click',function(e){
    e.preventDefault();
    var wasOpen=it.classList.contains('open');
    document.querySelectorAll('.acct-item.open').forEach(function(o){o.classList.remove('open')});
    if(!wasOpen)it.classList.add('open');
  });
});
document.addEventListener('click',function(e){
  if(!e.target.closest('.acct-item'))document.querySelectorAll('.acct-item.open').forEach(function(o){o.classList.remove('open')});
});

// ---- LG-GATE (giriş kapısı) — logged-out mikro-aksiyon kapısı ----
(function(){
  var gate=document.getElementById('lgGate');
  var overlay=document.getElementById('lgOverlay');
  if(!gate)return;
  var _lgRelease = null;                         /* §20 odak tuzağı */
  function open(title,desc){
    if(document.body.classList.contains('is-auth'))return false;   // logged-in: kapı yok
    if(gate.classList.contains('show'))return true;                // zaten açık — kilidi ikinci kez sayma
    if(title)document.getElementById('lgTitle').textContent=title;
    if(desc)document.getElementById('lgDesc').textContent=desc;
    gate.classList.add('show');overlay.classList.add('show');lockScroll();
    _lgRelease = trapFocus(gate);                /* §20 */
    return true;
  }
  /* durum korumalı: kapalıyken çağrılan close() başka bir katmanın kilidini düşürmez */
  function close(){
    if(!gate.classList.contains('show'))return;
    gate.classList.remove('show');overlay.classList.remove('show');unlockScroll();
    if(_lgRelease){ _lgRelease(); _lgRelease = null; }   /* §20 */
  }
  window.__lgGate=open;window.__lgGateClose=close;
  document.getElementById('lgClose').addEventListener('click',close);
  overlay.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&gate.classList.contains('show'))close();});
 // data-lg-gate taşıyan öğeler logged-out'ta kapıyı açar (capture: sayfa toggle'ından önce keser)
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-lg-gate]');
    if(!t)return;
    if(document.body.classList.contains('is-auth'))return;          // logged-in: normal davranış
    e.preventDefault();e.stopPropagation();
    open(t.getAttribute('data-lg-title'),t.getAttribute('data-lg-desc'));
  },true);
  if(location.search.indexOf('lg=1')>-1){open();}                    // SS paramı
})();

// ---- DİL SEÇİCİ (üst bant dropdown) ----
(function(){
  var lang=document.getElementById('tbLang');
  if(!lang)return;
  var btn=document.getElementById('tbLangBtn');
  btn.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    var open=lang.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  lang.querySelectorAll('.tb-lang-menu a').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      lang.querySelectorAll('.tb-lang-menu a').forEach(function(x){x.classList.remove('active')});
      a.classList.add('active');
      btn.querySelector('span').textContent=a.getAttribute('data-lang').toUpperCase();
      lang.classList.remove('open');btn.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('#tbLang')){lang.classList.remove('open');btn.setAttribute('aria-expanded','false');}
  });
})();

// ---- MOBİL DRAWER aç/kapa ----
(function(){
  var drawer=document.getElementById('drawer');
  var overlay=document.getElementById('drawerOverlay');
  var burger=document.getElementById('hamburger');
  var closeBtn=document.getElementById('drawerClose');
  /* durum korumalı aç/kapa — kilit sayacı yalnız gerçek geçişte hareket eder */
  var releaseFocus = null;                      /* §20 odak tuzağı bırakma işi */
  function open(){
    if(drawer.classList.contains('open'))return;
    drawer.classList.add('open');overlay.classList.add('open');lockScroll();
    releaseFocus = trapFocus(drawer);            /* odak drawer'ın içine */
  }
  function close(){
    if(!drawer.classList.contains('open'))return;
    drawer.classList.remove('open');overlay.classList.remove('open');unlockScroll();
    if(releaseFocus){ releaseFocus(); releaseFocus = null; }   /* odak hamburgere geri */
  }
  burger.addEventListener('click',open);
  closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
 // accordion: alt menülü öğeler tıkla-aç
  /* akordeon: yalnız chevron düğmesi açar/kapatır — satırın kendisi bağlantıdır */
  drawer.querySelectorAll('.d-has-sub .d-toggle').forEach(function(tg){
    tg.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var item=tg.closest('.d-item');
      var wasOpen=item.classList.contains('open');
      drawer.querySelectorAll('.d-item.open').forEach(function(o){
        o.classList.remove('open');
        var t=o.querySelector('.d-toggle'); if(t)t.setAttribute('aria-expanded','false');
      });
      if(!wasOpen){item.classList.add('open');tg.setAttribute('aria-expanded','true');}
    });
  });
 // alt link veya direkt linke tıklayınca drawer kapansın (chevron hariç)
  drawer.querySelectorAll('.d-sub a, a.d-link, .drawer-foot a, .drawer-foot > button').forEach(function(a){
    a.addEventListener('click',close);
  });
 // drawer dil seçici — aç/kapa liste + seçim (drawer kapanmaz, N dile ölçeklenir)
  var dl=document.getElementById('drawerLang');
  if(dl){
    var dlToggle=dl.querySelector('.drawer-lang-toggle');
    dlToggle.addEventListener('click',function(){
      var open=dl.classList.toggle('open');
      dlToggle.setAttribute('aria-expanded',open?'true':'false');
    });
    dl.querySelectorAll('.drawer-lang-list button').forEach(function(b){
      b.addEventListener('click',function(){
        dl.querySelectorAll('.drawer-lang-list button').forEach(function(x){x.classList.remove('active')});
        b.classList.add('active');
        document.getElementById('drawerLangCur').textContent=b.getAttribute('data-lang').toUpperCase()+' — '+b.getAttribute('data-name');
        dl.classList.remove('open');dlToggle.setAttribute('aria-expanded','false');
      });
    });
  }
})();

// ---- SÜRÜKLE-KAYDIR (mouse ile yatay slider'lar) ----
// Sayfa kendi track selector'larını alttaki listeye ekler (.row-track hazır gelir)
(function(){
  function enableDrag(el){
    el.classList.add('drag-scroll');
    var down=false,startX=0,startScroll=0,moved=false;
    el.addEventListener('pointerdown',function(e){
      if(e.pointerType==='touch')return;           // touch zaten native kayar
      down=true;moved=false;startX=e.clientX;startScroll=el.scrollLeft;
    });
    el.addEventListener('pointermove',function(e){
      if(!down)return;
      var dx=e.clientX-startX;
      if(Math.abs(dx)>4){moved=true;el.classList.add('dragging');}
      el.scrollLeft=startScroll-dx;
    });
    function up(){down=false;setTimeout(function(){el.classList.remove('dragging');},0);}
    el.addEventListener('pointerup',up);
    el.addEventListener('pointercancel',up);
    el.addEventListener('pointerleave',up);
 // sürükleme sonrası yanlışlıkla tıklamayı engelle
    el.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
 // dikey wheel'i yatay scroll'a çevir (trackpad/mouse)
    el.addEventListener('wheel',function(e){
      if(el.scrollWidth<=el.clientWidth)return;
      if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
      e.preventDefault();el.scrollLeft+=e.deltaY;
    },{passive:false});
  }
  ['.row-track','.cat-track','.grid-4','.vid-grid','.chips','.chef-row','.disc-grid'].forEach(function(sel){
    document.querySelectorAll(sel).forEach(enableDrag);
  });
})();

// ---- FOOTER REVEAL — footer yüksekliğini ölç, içerik sonuna boşluk aç ----
(function(){
  var main=document.getElementById('pageMain');
  var foot=document.querySelector('.footer');
  if(!main||!foot)return;
  function fit(){
    if(window.matchMedia('(min-width:641px)').matches){
      /* R11 · KESİRLİ yükseklik. `offsetHeight` tam sayıya yuvarlar; footer
         439.5px iken 440 döner ve perde alt kenarı footer'ın üstünden
         0.1–1 px sapar. 60 sayfada "tek değer" istenen ölçümde bu sapma
         11 farklı değer üretiyordu. `getBoundingClientRect()` kesirli
         okur, boşluk tam 0'a oturur. */
      main.style.marginBottom=foot.getBoundingClientRect().height+'px';
    }else{
      main.style.marginBottom='';
    }
  }
  fit();
  window.addEventListener('resize',fit);
  window.addEventListener('load',fit);          // logo/font yüklenince yükseklik oturur
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  /* R11 · PERDEYİ DIŞARIDAN YENİDEN ÖLÇTÜRME KAPISI.
     Footer yüksekliğini ölçümden SONRA değiştiren tek şey accordion'un
     açılıp kapanması. Ölçüm o an bayatlıyor; aşağıdaki accordion IIFE'si
     her geçişten sonra bunu çağırıyor. Başka hiçbir yerden çağrılmıyor. */
  window.FIT_SHELL = window.FIT_SHELL || {};
  window.FIT_SHELL.perdeyiOlc = fit;
})();

/* ---- FOOTER ACCORDION — YALNIZ ÜÇ ORTA MENÜ, YALNIZ MOBİLDE ----
   Doküman: "Üç orta menü mobilde açılır-kapanır accordion olarak
   çalışmalıdır." Marka alanı, uygulama alanı, kurumsal bant ve yasal
   bant accordion DEĞİL — onlar hep açık.

   Masaüstünde (≥641px) üç sütun AÇIK durur ve başlık düğmesi `disabled`
   olur: odak sırasına girmez, tıklamayla kapanamaz. Mobilde (≤640px)
   üçü de KAPALI başlar, düğme etkinleşir; klavyede Enter/Space gerçek
   <button> olduğu için tarayıcıdan gelir.

   R11: açılış/kapanış footer yüksekliğini değiştirir → geçiş bittiğinde
   perde YENİDEN ÖLÇÜLÜR (FIT_SHELL.perdeyiOlc). */
(function(){
  var kolonlar = [].slice.call(document.querySelectorAll('.foot-col[data-foot-col]'));
  if(!kolonlar.length) return;
  var mq = window.matchMedia('(max-width:640px)');

  function olc(){ if(window.FIT_SHELL && window.FIT_SHELL.perdeyiOlc) window.FIT_SHELL.perdeyiOlc(); }

  function boya(kol, acik){
    var btn = kol.querySelector('.fc-toggle');
    kol.classList.toggle('is-open', acik);
    if(btn) btn.setAttribute('aria-expanded', acik ? 'true' : 'false');
  }

  function kur(){
    var mobil = mq.matches;
    kolonlar.forEach(function(kol){
      var btn = kol.querySelector('.fc-toggle');
      if(!btn) return;
      btn.disabled = !mobil;                    /* masaüstünde etkin değil */
      boya(kol, mobil ? false : true);          /* masaüstü: hep açık */
    });
    olc();
  }

  kolonlar.forEach(function(kol){
    var btn = kol.querySelector('.fc-toggle');
    if(!btn) return;
    btn.addEventListener('click', function(){
      if(btn.disabled) return;
      boya(kol, btn.getAttribute('aria-expanded') !== 'true');
      olc();                                    /* geçiş başlarken */
      setTimeout(olc, 240);                     /* geçiş bittikten sonra */
    });
  });

  kur();
  if(mq.addEventListener) mq.addEventListener('change', kur);
  else if(mq.addListener) mq.addListener(kur);
})();

// ---- GÖRÜŞ BİLDİR (kenar etiketi → modal) ----
(function(){
  var tab=document.getElementById('fbTab');
  var modal=document.getElementById('fbModal');
  var overlay=document.getElementById('fbOverlay');
  if(!tab||!modal)return;
  var form=document.getElementById('fbForm');
  var success=document.getElementById('fbSuccess');
  var releaseFocus = null;                      /* §20 */
  function open(){
    if(modal.classList.contains('show'))return;
    modal.classList.add('show');overlay.classList.add('show');lockScroll();
    releaseFocus = trapFocus(modal);
  }
  function close(){
    if(!modal.classList.contains('show'))return;
    modal.classList.remove('show');overlay.classList.remove('show');unlockScroll();
    if(releaseFocus){ releaseFocus(); releaseFocus = null; }
    setTimeout(function(){form.hidden=false;success.hidden=true;form.reset();},300);
  }
  tab.addEventListener('click',function(e){e.preventDefault();open();});
  document.getElementById('fbClose').addEventListener('click',close);
  overlay.addEventListener('click',close);
  modal.addEventListener('click',function(e){if(e.target===modal)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
 // M17 — konu tipine göre alan seti: aktif pane görünür, pasif pane'lerin
 // input'ları disable edilir (gizli required alanlar submit'i bloklamasın)
  function syncPanes(){
    var cur=modal.querySelector('.fb-topic.active').getAttribute('data-topic');
    modal.querySelectorAll('.fb-fields').forEach(function(p){
      var on=p.getAttribute('data-for')===cur;
      p.classList.toggle('active',on);
      p.querySelectorAll('input,textarea,select,button').forEach(function(el){el.disabled=!on});
    });
  }
  modal.querySelectorAll('.fb-topic').forEach(function(t){
    t.addEventListener('click',function(){
      modal.querySelectorAll('.fb-topic').forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');
      syncPanes();
    });
  });
  syncPanes();
 // emoji + chip seçimleri (tek seçim)
  modal.querySelectorAll('.fb-emoji button').forEach(function(b){
    b.addEventListener('click',function(){
      modal.querySelectorAll('.fb-emoji button').forEach(function(x){x.classList.remove('active')});
      b.classList.add('active');
    });
  });
  modal.querySelectorAll('.fb-chiprow .chip').forEach(function(c){
    c.addEventListener('click',function(){
      modal.querySelectorAll('.fb-chiprow .chip').forEach(function(x){x.classList.remove('active')});
      c.classList.add('active');
    });
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    form.hidden=true;success.hidden=false;
  });
  if(location.search.indexOf('fb=1')>-1){open();}
})();

// ---- ÇEREZ ONAY BANNER ----
(function(){
  var banner=document.getElementById('cookieBanner');
  if(!banner)return;
  var KEY='dm-cookie-consent';
  var force=location.search.indexOf('cc=1')>-1;   // SS/test için zorla göster
  function stored(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  function dismiss(val){
    try{localStorage.setItem(KEY,val);}catch(e){}
    banner.classList.remove('show');if(window.__bnUpdate)window.__bnUpdate();
  }
  if(force || !stored()){
    setTimeout(function(){banner.classList.add('show');if(window.__bnUpdate)window.__bnUpdate();},700);
  }
  document.getElementById('cookieAccept').addEventListener('click',function(){dismiss('accepted');});
  document.getElementById('cookieReject').addEventListener('click',function(){dismiss('rejected');});
})();


/* ---- mobil alt katman yöneticisi ---- */
/* ===== MOBİL ALT KATMAN YÖNETİCİSİ (revize2/mobil1 — kanonik) =====
 Kural: ekranda en fazla 1 sabit alt şerit. Çerez onayı (geçici, öncelikli)
 ya da sayfanın kendi aksiyon şeridi (window.__bottomStrips) açıkken global
 bottom-nav gizlenir; şerit olan sayfalarda nav ayrıca aşağı kaydırınca gizlenir. */
window.__bottomStrips=window.__bottomStrips||[];
setTimeout(function(){
  var nav=document.querySelector('.bottom-nav');
  if(!nav)return;
  var cookie=document.getElementById('cookieBanner');
  var strips=window.__bottomStrips.map(function(s){return document.querySelector(s);}).filter(Boolean);
  var lastY=window.scrollY||0;
  function stripShown(){for(var i=0;i<strips.length;i++){if(strips[i]&&strips[i].classList.contains('show'))return true;}return false;}
  function update(){
    var y=window.scrollY||0;
    if(stripShown()){nav.classList.add('bn-hidden');lastY=y;return;}
    if(strips.length===0||y<80){nav.classList.remove('bn-hidden');lastY=y;return;}
    if(y-lastY>12){nav.classList.add('bn-hidden');lastY=y;}
    else if(lastY-y>12){nav.classList.remove('bn-hidden');lastY=y;}
  }
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update,{passive:true});
  document.addEventListener('click',function(){setTimeout(update,60);},true);
  window.__bnUpdate=update;update();
},0);

/* ---- aktif nav: aria-current + self-link başa kaydırma ---- */
(function(){
  if(window.__dfActiveNav)return; window.__dfActiveNav=true;
 // mevcut sayfa dosya adı (querystring/hash hariç)
  var here=(location.pathname.split('/').pop()||'').toLowerCase();
 // aktif nav linkleri: desktop nav, mobil drawer, bottom-nav
  var sel='.nav a.active, .d-link.active, .bn-item.active';
  var links=document.querySelectorAll(sel);
  links.forEach(function(a){
    if(a.tagName!=='A')return;                 // drawer'da <button> trigger'lar hariç
    a.setAttribute('aria-current','page');
    var href=(a.getAttribute('href')||'').trim();
    if(!href||href.charAt(0)==='#')return;     // pür anchor → dokunma
    var file=href.split('#')[0].split('?')[0].split('/').pop().toLowerCase();
    if(file && file===here){                   // SELF link → boş-tık yerine başa kaydır
      a.addEventListener('click',function(e){
        e.preventDefault();
        window.scrollTo({top:0,behavior:'smooth'});
      });
    }
  });
})();

/* ---- scroll-reveal + başa dön (DadaMentor paneli kaldırıldı — belge §1/§21) ---- */
// ---- ÖLÇÜLÜ SCROLL-REVEAL (FOUC-güvenli; .reveal hedefi yoksa no-op; class 'in') ----
(function(){
  var els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(!('IntersectionObserver' in window))return;
  document.documentElement.classList.add('reveal-ready');
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12,rootMargin:'0px 0px -7% 0px'});
  els.forEach(function(el){io.observe(el);});
})();
// ---- SCROLL-TO-TOP (sağ-alt; scrollY eşiği, dipte gizle) ----
(function(){
  var btn=document.getElementById('toTop');
  if(!btn)return;
  var smooth=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function upd(){
    var y=window.scrollY||document.documentElement.scrollTop;
    var max=document.documentElement.scrollHeight-window.innerHeight;
    btn.classList.toggle('show', y>620 && (max-y)>120);
  }
  btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:smooth?'smooth':'auto'});});
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  upd();
})();
/* ============================================================
 FİT DURUM MODÜLÜ — program ve challenge yaşam döngüsü (belge §11 · §8.4)
 Tek kayıt: localStorage['dm_fit'] = {
 program:{slug,ad,durum,hafta,gun,toplam,biten,kacan},
 challenge:{slug,ad,durum,gun,toplam,seri,telafi},
 bugun:{dk,kcal,tamam}, gecmis:[…], hafta:[dk…]
 }
 durum ∈ devam · duraklatildi · birakildi · tamamlandi
 Sayfalar bu modülü çağırır; her sayfa kendi state'ini kurmaz.
 ============================================================ */
(function(){
  var KEY='dm_fit';
  /* ============================================================
     ŞEMA v2 — R10 · belge §3.7 · §4.3 · §5.2 · §5.3 · §6
     ------------------------------------------------------------
     Belgenin kapatılamayan sekiz kalemi tek bir sebebe bağlıydı:
     şemada alan yoktu. Eklenenler ve hangi kalemi açtıkları:

       program.baslangic   ISO tarih   → §5.2 tahmini bitiş · §4 aylık görünüm
       program.gunler[]    1=Pzt…7=Paz → §4.3 "haftanın hangi günleri"
       program.saat        'HH:MM'     → §4.3 hatırlatma saati
       bugun.su            bardak      → §6 su takibi (D16: oturumluktu)
       bugun.gunSonu{}     §3.7 alanları (not·zorluk·efor·enerji·agri)
       gecmis[].kaynak     KANIT KADEMESİ — aşağıda
       program.tasimalar{} 1=Pzt kalıbının TEK SEANSLIK istisnası → §4.3/2
       program.dinlenmeler[] belirli tarihi dinlenmeye çevirir → §4.3/3
       arsiv[]             biten/bırakılan programlar → "Geçmiş programların"

     KANIT KADEMESİ (akış denetiminden geldi, belgede yok):
     Bugüne kadar aynı "antrenman tamamlandı" dört ayrı yerde dört farklı
     kalitede kayıt üretiyordu ve uygulama dördünü aynı sayıyordu:
       egzersiz-detay      → çalışan kronometreden ÖLÇÜLDÜ
       video-seans-detay   → videonun nominal süresi
       program-detay       → SABİT dk:25 kcal:280 (uydurma)
       challengeGunTamamla → hiçbir şey
     Artık her kayıt neye dayandığını taşıyor. Rozet/seri buna bakabilir,
     kullanıcı kendi geçmişinin ne kadar sağlam olduğunu görebilir.
     ============================================================ */
  var KAYNAKLAR = ['olculdu','video','cihaz','beyan'];
  var BOS = { surum:2, program:null, arsiv:[], challenge:null, randevular:[],
              bugun:{dk:0,kcal:0,tamam:false,su:0,gunSonu:null},
              gecmis:[], hafta:[62,74,90,96,118,142] };
  function clone(o){ return JSON.parse(JSON.stringify(o)); }

  /* GÖÇ — v1 kayıtları KIRILMAZ. Eksik alan varsayılanla tamamlanır, var olan
     hiçbir değer ezilmez. Yazma anında değil OKUMA anında yapılıyor: kullanıcı
     depoyu hiç açmasa bile eski kayıt yeni koda güvenli girer. */
  function goc(v){
    if(!v || typeof v !== 'object') return clone(BOS);
    if(v.surum === 2) return v;
    v.surum = 2;
    v.bugun = v.bugun || {dk:0,kcal:0,tamam:false};
    if(typeof v.bugun.su !== 'number') v.bugun.su = 0;
    if(!('gunSonu' in v.bugun))        v.bugun.gunSonu = null;
    if(!Array.isArray(v.arsiv)) v.arsiv = [];
    if(v.program){
      if(!('baslangic' in v.program)) v.program.baslangic = null;
      if(!Array.isArray(v.program.gunler)) v.program.gunler = [];
      if(!('saat' in v.program))      v.program.saat = null;
      /* tasimalar: TEK seansın istisnası. gunler[] haftalık KALIP, istisnayı
         tutamaz. Anahtar seans numarası, değer o seansın yeni tarihi. */
      if(!v.program.tasimalar)  v.program.tasimalar  = {};
      /* dinlenmeler: belirli bir TARİHİ antrenman günü olmaktan çıkarır.
         gunler[]'den gün silmek başka şey — o kalıcı kalıp değişikliği. */
      if(!Array.isArray(v.program.dinlenmeler)) v.program.dinlenmeler = [];
    }
    /* Eski geçmiş kayıtlarının kaynağı BİLİNMİYOR. 'olculdu' demek yalan
       olurdu; en zayıf kademeye değil, dürüst olana yazıyoruz. */
    (v.gecmis||[]).forEach(function(g){ if(!g.kaynak) g.kaynak = 'beyan'; });
    return v;
  }
  function read(){
    try{ var r=localStorage.getItem(KEY); return r?goc(JSON.parse(r)):clone(BOS); }
    catch(e){ return clone(BOS); }
  }
  function write(v){
    try{ localStorage.setItem(KEY,JSON.stringify(v)); }catch(e){}
    document.dispatchEvent(new CustomEvent('fit:state',{detail:v}));
    return v;
  }
  var API = {
    read:read, write:write, reset:function(){ return write(clone(BOS)); },

    /* ---- program yaşam döngüsü (belge §8.3 · §11) ---- */
    /* Aktif program varken yenisine başlamak ESKİSİNİ SİLİYORDU: biten, kacan,
       baslangic sessizce yok oluyordu ve "Geçmiş programların" kartını
       besleyecek veri kalmıyordu (kart bu yüzden sabit HTML'di). Artık eski
       program arşive geçiyor. Sessiz veri kaybı bir kusurdur, özellik değil. */
    programArsivle:function(){
      var s=read();
      if(s.program){
        s.arsiv.unshift({slug:s.program.slug, ad:s.program.ad,
          durum:s.program.durum, biten:s.program.biten||0, kacan:s.program.kacan||0,
          toplam:s.program.toplam||0, baslangic:s.program.baslangic||null,
          bitis:new Date().toISOString()});
        s.program=null;
      }
      return write(s);
    },
    programBasla:function(p){
      var s=read();
      /* Üzerine yazmadan önce arşivle. Çağıran ayrıca uyarmalı — bu yalnız
         veriyi kurtarır, kullanıcıya sormanın yerini tutmaz. */
      if(s.program){
        s.arsiv.unshift({slug:s.program.slug, ad:s.program.ad,
          durum:s.program.durum==='tamamlandi'?'tamamlandi':'birakildi',
          biten:s.program.biten||0, kacan:s.program.kacan||0,
          toplam:s.program.toplam||0, baslangic:s.program.baslangic||null,
          bitis:new Date().toISOString()});
      }
      s.program={slug:p.slug,ad:p.ad,durum:'devam',hafta:1,gun:1,
                 toplam:p.toplam||12,biten:0,kacan:0,
                 /* v2 — program artık TAKVİME oturuyor. Bunlar olmadan program
                    bir liste; "yarın 07:30, Gün 2" denemez, hatırlatma kurulamaz,
                    aylık görünüm çizilemez, bitiş tarihi hesaplanamaz. */
                 baslangic:(p&&p.baslangic)||null,
                 gunler:(p&&p.gunler)||[],
                 saat:(p&&p.saat)||null,
                 tasimalar:{}, dinlenmeler:[]};
      return write(s);
    },
    /* §4.3 madde 2 — tek seansı başka güne taşı. Kalıbı değiştirmez. */
    seansTasi:function(seansNo, tarih){
      var s=read();
      if(s.program){ if(tarih) s.program.tasimalar[String(seansNo)]=tarih;
                     else delete s.program.tasimalar[String(seansNo)]; }
      return write(s);
    },
    /* §4.3 madde 3 — belirli bir tarihi dinlenme günü yap / geri al. */
    dinlenmeEkle:function(tarih){
      var s=read();
      if(s.program && s.program.dinlenmeler.indexOf(tarih)<0) s.program.dinlenmeler.push(tarih);
      return write(s);
    },
    dinlenmeKaldir:function(tarih){
      var s=read();
      if(s.program) s.program.dinlenmeler=s.program.dinlenmeler.filter(function(t){return t!==tarih;});
      return write(s);
    },
    /* Takvimi sonradan da kurulabilsin: kullanıcı programı başlatırken
       atlayabilir, Plan ve Takvim'den doldurur. */
    programPlanla:function(o){
      var s=read();
      if(s.program){
        if(o&&o.baslangic!==undefined) s.program.baslangic=o.baslangic;
        if(o&&o.gunler)                s.program.gunler=o.gunler;
        if(o&&o.saat!==undefined)      s.program.saat=o.saat;
      }
      return write(s);
    },
    /* §5.2 — tahmini bitiş. Kaçırılan gün CEZA DEĞİL: programı öteler.
       Haftalık antrenman sayısı bilinmiyorsa 3 varsayılır (kataloğun modu). */
    bitisTahmini:function(){
      var s=read(), p=s.program;
      if(!p||!p.baslangic) return null;
      var bas=new Date(p.baslangic);
      if(isNaN(bas)) return null;
      var haftalik=(p.gunler&&p.gunler.length)||3;
      var kalan=Math.max(0,(p.toplam||0)-(p.biten||0))+(p.kacan||0);
      /* KUSUR DÜZELTİLDİ (R10): kalan haftalar BAŞLANGIÇ tarihine ekleniyordu.
         Oysa biten seanslar zaten zaman tüketti — fonksiyon "hiç antrenman
         yapılmamış gibi" hesaplıyordu ve `biten` arttıkça tahmini bitiş GERİYE
         gidiyordu (biten=toplam olduğunda bitiş neredeyse başlangıç oluyordu).
         Ölçülen çelişki: aylık takvim son antrenmanı 18 Eylül'e çizerken çip
         31 Ağustos diyordu.
         Doğrusu: kalan süre BUGÜNE eklenir. Program henüz başlamadıysa
         (başlangıç ileri tarihli) referans başlangıçtır. */
      var bugun=new Date(); bugun.setHours(0,0,0,0);
      var ref=new Date(Math.max(bas.getTime(), bugun.getTime()));
      ref.setDate(ref.getDate()+Math.ceil(kalan/haftalik)*7);
      /* Saat 12:00'ye sabitleniyor. Yerel GECE YARISI kullanınca `toISOString()`
         UTC'ye çevirirken günü geriye atıyordu: TR (UTC+3) için bitmiş bir
         program "dün" bitiyor görünüyordu. Öğlen, ±12 saatlik hiçbir dilimde
         gün sınırını geçmez. */
      ref.setHours(12,0,0,0);
      return ref.toISOString();
    },

    /* §6 — su takibi. D16'da "oturumluk" diye açık kalmıştı; artık kalıcı. */
    suEkle:function(n){ var s=read(); s.bugun.su=Math.max(0,(s.bugun.su||0)+(n||1)); return write(s); },
    suSifirla:function(){ var s=read(); s.bugun.su=0; return write(s); },

    /* §3.7 — gün sonu. D12'de "şemada yer yok" diye açık kalmıştı.
       Hepsi isteğe bağlı; boş gönderilen alan yazılmaz, silinmez. */
    gunSonuKaydet:function(v){
      var s=read();
      s.bugun.gunSonu = {
        not:(v&&v.not)||'', zorluk:(v&&v.zorluk)||null, efor:(v&&v.efor)||null,
        enerji:(v&&v.enerji)||null, agri:(v&&v.agri)||'',
        tarih:new Date().toISOString()
      };
      s.bugun.tamam = true;
      return write(s);
    },
    programDurakla:function(){ var s=read(); if(s.program)s.program.durum='duraklatildi'; return write(s); },
    programDevam:function(){   var s=read(); if(s.program)s.program.durum='devam';        return write(s); },
    programBirak:function(){   var s=read(); if(s.program)s.program.durum='birakildi';    return write(s); },
    programYenidenBasla:function(){
      var s=read();
      if(s.program){ s.program.durum='devam'; s.program.hafta=1; s.program.gun=1; s.program.biten=0; s.program.kacan=0; }
      return write(s);
    },
    /* kaçırılan gün: kaydır = planı ötele · atla = günü tüket. İkisinde de suçluluk dili yok. */
    gunKaydir:function(){ var s=read(); if(s.program){ s.program.kacan=(s.program.kacan||0)+1; } return write(s); },
    gunAtla:function(){   var s=read(); if(s.program){ s.program.gun++; } return write(s); },

    /* ---- tamamlanan antrenman → Enerji Defteri + ilerleme (belge §19) ---- */
    antrenmanTamamla:function(a){
      var s=read(), dk=(a&&a.dk)||25, ad=(a&&a.ad)||'Antrenman';
      /* kcal ÜÇ DURUM taşır — eskiden ikisi aynıydı ve bu, kanıt kademesinin
         tam da öldürmeye çalıştığı uydurmayı üretiyordu:
           sayı verildi (0 dahil) → o sayı
           açıkça null verildi   → BİLİNMİYOR, sayıya çevrilmez
           hiç verilmedi         → 280 (eski çağrılar kırılmasın)
         Eskiden `(a&&a.kcal)||280` yüzünden `kcal:0` ve `kcal:null` de 280'e
         düşüyordu: çağıran "bilmiyorum" diyemiyor, uydurmak zorunda kalıyordu. */
      var kcal;
      if      (a && typeof a.kcal === 'number') kcal = a.kcal;
      else if (a && 'kcal' in a)                kcal = null;
      else                                      kcal = 280;
      /* KANIT KADEMESİ — çağıran neye dayandığını SÖYLEMEK ZORUNDA.
         Söylemezse 'beyan' yazılır, çünkü söylenmeyen şey ölçülmüş sayılamaz.
         Uydurma bir kademe yazmaktansa zayıf ama doğru olanı yazıyoruz. */
      var kaynak = (a&&a.kaynak && KAYNAKLAR.indexOf(a.kaynak)>=0) ? a.kaynak : 'beyan';
      s.bugun.dk += dk; s.bugun.kcal += (kcal||0); s.bugun.tamam = true;
      s.gecmis.unshift({tarih:'bugün',ad:ad,dk:dk,kcal:kcal,kaynak:kaynak});
      if(s.hafta && s.hafta.length) s.hafta[s.hafta.length-1] += dk;
      if(s.program && s.program.durum==='devam'){
        s.program.biten++;
        if(s.program.biten>=s.program.toplam){ s.program.durum='tamamlandi'; }
        else { s.program.gun++; if(s.program.gun>7){ s.program.gun=1; s.program.hafta++; } }
      }
      return write(s);
    },

    /* ---- challenge (belge §8.4) ---- */
    challengeKatil:function(c){
      var s=read();
      s.challenge={slug:c.slug,ad:c.ad,durum:'devam',gun:1,toplam:c.toplam||30,seri:1,telafi:0};
      return write(s);
    },
    challengeGunTamamla:function(){
      var s=read();
      if(s.challenge && s.challenge.durum==='devam'){
        s.challenge.gun++; s.challenge.seri++;
        if(s.challenge.gun>s.challenge.toplam){ s.challenge.gun=s.challenge.toplam; s.challenge.durum='tamamlandi'; }
      }
      return write(s);
    },
    /* esnek seri kuralı: ayda iki telafi; üçüncüde seri baştan (belge §15) */
    challengeGunKacir:function(){
      var s=read();
      if(s.challenge && s.challenge.durum==='devam'){
        if((s.challenge.telafi||0) < 2){ s.challenge.telafi=(s.challenge.telafi||0)+1; }
        else { s.challenge.seri=0; }
        s.challenge.gun++;
      }
      return write(s);
    },
    challengeBirak:function(){ var s=read(); if(s.challenge)s.challenge.durum='birakildi'; return write(s); },

    /* ---- randevu yaşam döngüsü (belge §11, 9 adım) ---- */
    randevuAl:function(r){
      var s=read();
      s.randevular = s.randevular || [];
      s.randevular.unshift({antrenor:r.antrenor, slug:r.slug, hizmet:r.hizmet, fiyat:r.fiyat,
                            tarih:r.tarih, saat:r.saat, durum:'onay-bekliyor'});
      return write(s);
    },
    randevuDurum:function(i,d){ var s=read(); if(s.randevular&&s.randevular[i])s.randevular[i].durum=d; return write(s); },
    randevuEtiket:function(d){
      return {'onay-bekliyor':'Onay bekliyor','onaylandi':'Onaylandı','tamamlandi':'Tamamlandı',
              'iptal':'İptal edildi','ertelendi':'Ertelendi','gelmedi':'Gelinmedi'}[d]||d;
    },
    randevuRozet:function(d){
      return {'onay-bekliyor':'wait','onaylandi':'ok','tamamlandi':'ok',
              'iptal':'off','ertelendi':'wait','gelmedi':'stop'}[d]||'off';
    },

    /* durum → okunur etiket (renge EK OLARAK metin — belge §14.3) */
    etiket:function(d){
      return {devam:'Devam ediyor', duraklatildi:'Duraklatıldı', birakildi:'Bırakıldı',
              tamamlandi:'Tamamlandı'}[d] || 'Başlanmadı';
    },
    rozet:function(d){
      return {devam:'ok', duraklatildi:'wait', birakildi:'off', tamamlandi:'ok'}[d] || 'off';
    }
  };
  window.FIT_SHELL = window.FIT_SHELL || {};
  window.FIT_SHELL.state = API;
})();

/* ============================================================
 SİHİRBAZ KABUKTAN ÇIKTI — R13 (5. tur)
 "Bana Uygun Başlangıcı Bul / Programını Bul" sihirbazı 4. turda burada,
 kabuğun içinde duruyordu: modal kipte örtü katmanı + role="dialog" +
 aria-modal üretiyor, satır içi kipte aynı paneli programlar merkezine
 basıyordu. Beyar (5. tur): "Pop-up tamamen kalksın; sihirbaz kendi tam
 sayfası olsun." Referans: dadadiet.com/diyetisyen-bul.

 ARTIK: motorun tamamı `programini-bul-v1.html` içinde, sayfa JS'i olarak.
 Kabukta ne örtü katmanı ne modal ne de `data-fit-wizard` tetikleyicisi
 var; menü kalemi ve sayfalardaki düğmeler düz bağlantı olarak o sayfaya
 gidiyor. `.wz-*` CSS ailesi de fit-shell.css'ten kaldırıldı.
 ============================================================ */

/* ============================================================
 R6 · MADDE 1-2-3 · SAYFA ALTI "SAĞLIK VE GÜVENLİK" SECTION'I KALDIRILDI
 ------------------------------------------------------------
 Eskiden burada bir IIFE vardı: `<section class="fit-health">` üretip
 `#pageMain`'in son çocuğu yapıyordu (B10'un çözümü, R11). Blok 60
 sayfanın hepsine basılıyordu ve Beyar'ın ölçümüyle okunmuyordu.

 NE KAYBOLMADI:
 · **Yasal banda dokunulmadı.** Footer'ın yasal bandındaki
   `saglik-bilgilendirme-v1.html` bağlantısı yerinde — uyarı siteden
   kaybolmuyor, yalnız her sayfanın altına section olarak basılmıyor.
 · **Üç tercih taşındı**, silinmedi: sayaç sesi (`dm_fit_sound`),
   titreşim (`dm_fit_vibe`) ve hareketi azaltma (`dm_fit_motion`)
   `fit-planim-veri-izin-v1.html`'de "Uygulama tercihleri" kartında.
   **localStorage anahtarları değişmedi**, kayıtlı tercih kaybolmadı.
 · `FIT_SHELL.pref(anahtar)` API'si aşağıda **duruyor** —
   `egzersiz-detay-v1.html` sayaç sesi/titreşimi için bunu okuyor.
 · `dm_fit_motion` açıkken `html.reduce-motion` sınıfı **her sayfada**
   uygulanıyor; bunu aşağıdaki "hareket azaltma" IIFE'si yapıyor
   (zaten ayrı bir bloktu, sağlık şeridine bağlı değildi).

 `<body data-fit-nohealth>` işareti artık hiçbir şey yapmıyor; sayfalarda
 kullanılmıyordu, geriye dönük zararsız.
 ============================================================ */
(function(){
  window.FIT_SHELL = window.FIT_SHELL || {};
  window.FIT_SHELL.pref = function(k){ try{ return localStorage.getItem(k)==='1'; }catch(e){ return false; } };
})();

/* ---- erişilebilirlik: "içeriğe atla" bağlantısı + kabuk işaretleri ---- */
(function(){
  if(document.getElementById('fitSkip')) return;
  var a = document.createElement('a');
  a.id = 'fitSkip'; a.className = 'skip-link'; a.href = '#pageMain';
  a.textContent = 'İçeriğe atla';
  document.body.insertBefore(a, document.body.firstChild);
  var m = document.getElementById('pageMain');
  if(m){ m.setAttribute('tabindex','-1'); m.setAttribute('role','main'); }
  var nav = document.querySelector('.nav');
  if(nav) nav.setAttribute('aria-label','DadaFit ana menü');
  /* etiketi olmayan form alanlarına erişilebilir ad ver */
  document.querySelectorAll('input,select,textarea').forEach(function(el){
    if(el.type==='hidden') return;
    if(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return;
    if(el.id && document.querySelector('label[for="'+el.id+'"]')) return;
    if(el.closest('label')) return;
    var ph = el.getAttribute('placeholder');
    if(!ph && el.tagName==='SELECT'){
      var o = el.querySelector('option[disabled], option[value=""]');
      if(o) ph = o.textContent.replace(/\*/g,'').trim();
    }
    if(ph) el.setAttribute('aria-label', ph);
  });
})();

/* ---- hareket azaltma tercihi: sayfa açılışında uygula ---- */
(function(){
  try{ if(localStorage.getItem('dm_fit_motion')==='1') document.documentElement.classList.add('reduce-motion'); }catch(e){}
})();

/* ---- Ziyaretçi ↔ üye görünümü (belge §9.3 · §19) ----
 Giriş yapılmışsa [data-lg-only] şeritleri (ziyaretçiye "bu veriler örnektir"
 diyen bilgilendirme kapısı) kalkar. Her sayfada tekrar yazılmasın diye kabukta.
 NOT: eskiden burada bir de "Örnek görünüm" ROZETİ (.demo-tag/.fp-demo)
 senkronlanıyordu — rozet ailesi bu turda tüm depodan kaldırıldı (D1). */
(function(){
  function sync(){
    var authed = document.body.classList.contains('is-auth');
    document.querySelectorAll('[data-lg-only]').forEach(function(el){ el.style.display = authed ? 'none' : ''; });
    var st = document.querySelector('.fp-state');
    if(st && authed) st.textContent = 'Ücretsiz üye · kendi verin';
  }
  sync();
  window.addEventListener('storage', sync);
  window.FIT_SHELL = window.FIT_SHELL || {};
  window.FIT_SHELL.syncAuthView = sync;
})();


/* ===================================================================
 İKİNCİL PANELİN YERİ — referans kompozisyonu geri getirir
 (2026-08-11 referans kıyaslama turu)

 Sorun: Faz 1'de banner yüksekliği kuralı için iki kolonlu hero'ların
 ikincil paneli (enerji defteri kartı, challenge ilerleme kartı) bandın
 DIŞINA alınmıştı. Ölçüm gösterdi ki bu, referansta olmayan bir
 kompozisyon: 1440'ta bant 489px→255px'e düşüyor, metin kolonu bandın
 sol yarısında kalıyor, sağ yarı boşalıyor ve kart bandın altına
 sarkıyor. Mobilde ise negatif margin paneli hero CTA'sının üstüne
 bindirip düğmeyi tıklanamaz yapıyordu.

 Çözüm — ikisini birlikte sağlar:
 · ≥641px: panel hero ızgarasının ikinci kolonuna GERİ TAŞINIR
 → referans kompozisyonu (metin solda, panel sağda, ikisi de bandın
 içinde). Banner kuralı dikey boşluk daraltmasıyla sağlanır.
 · ≤640px: panel banddan çıkar (referansta da tek kolona iniyordu);
 bant kısalır, hiçbir içerik gizlenmez, hiçbir düğme örtülmez.
 =================================================================== */
(function(){
  var wrap = document.querySelector('.fit-band-panel');
  if(!wrap) return;
  /* Fit Planım akışındaki panel (enerji-defteri) banda geri taşınmaz:
 o sayfa kaynak belgenin §9'u gereği kişisel kabuk banner'ı kullanıyor. */
  if(wrap.classList.contains('fp-inflow')) return;

  var grid = document.querySelector('.df-hero, .chl-grid, .kp-hero');
  if(!grid) return;

  var panel = wrap.firstElementChild;
  if(!panel) return;

  /* Ana sayfa hero'su TAM EKRAN olduğu için (bkz. fit-shell.css "ANA SAYFA HERO'SU
 TAM EKRAN" bloğu) Enerji Defteri kartı HER genişlikte bandın içinde kalır —
 banddan çıkarma yalnız banner kuralına tabi diğer sayfalar için geçerlidir. */
  /* panel taşındığında boşalan sarmalayıcı yer kaplamasın — içinde boşluk metin
 düğümü kaldığı için CSS :empty tutmuyor, JS ile kapatılır. */
  function sarmalayiciyiGuncelle(){
    wrap.style.display = wrap.querySelector('*') ? '' : 'none';
  }

  if(document.body.getAttribute('data-fit-hero') === '1'){
    if(panel.parentNode !== grid) grid.appendChild(panel);
    sarmalayiciyiGuncelle();
    return;
  }

  /* ---- R15 (5. tur) · SABİT AİLE BANNER'INDA PANEL GERİ TAŞINMAZ ----
     Bu mekanizma, banner'ın yüksekliği SERBEST olduğu dönemde yazıldı:
     panel hero ızgarasının ikinci kolonuna geri taşınıyor, referans
     kompozisyonu (metin solda, panel sağda) böyle kuruluyordu.

     R15 ile banner iki aileye ve SABİT yüksekliğe bağlandı
     (liste 544 · detay 560 @1440). Ölçüm: geri taşınan paneller kutuya
     sığmıyor — `dadafit-kopru` enerji kartı tek başına 391.2 px, kutunun
     verdiği içerik alanı 370 px; `challenge-v1` zaman çizelgesi 187.2 px
     ve banner içeriğini 550.1 px'e çıkarıyordu. R15.3 bu durumda paneli
     banner'ın ALTINA almayı söylüyor — yani bandın içinde bırakmayı.

     Bu yüzden geri taşıma artık YALNIZ ana sayfanın tam-ekran hero'sunda
     (`data-fit-hero="1"`, yukarıdaki erken dönüş) çalışıyor. Aileye bağlı
     her banner'da panel bandın içinde kalır. */
  if(document.body.hasAttribute('data-fit-hero-kind')){
    if(panel.parentNode !== wrap) wrap.appendChild(panel);
    sarmalayiciyiGuncelle();
    return;
  }

  var mq = window.matchMedia('(min-width:641px)');
  function place(){
    if(mq.matches){
      if(panel.parentNode !== grid) grid.appendChild(panel);
    }else{
      if(panel.parentNode !== wrap) wrap.appendChild(panel);
    }
    sarmalayiciyiGuncelle();
  }
  place();
  if(mq.addEventListener) mq.addEventListener('change', place);
  else if(mq.addListener) mq.addListener(place);
})();


/* =====================================================================
 ORTAK FİLTRE BİLEŞENİ — .ff (TEK KAYNAK)
 ---------------------------------------------------------------------
 Sayfa sözleşmesi (tek satır):
 <div class="lib-filters ff" data-ff data-ff-label="program" …>
 · İçindeki .fgroup[data-group] kalemleri facet olarak okunur.
 · Facet başlığı .lbl (yoksa aria-label ya da ilk <span>) metnidir.
 · Sonuç sayacı: data-ff-count=".lib-count" (var olan düğüm taşınır).
 · Sıralama: data-ff-sort=".lib-sort" (var olan blok taşınır).
 · Sıfırla: data-ff-clear="#fClear" (var olan düğmeye tıklanır).

 KRİTİK TASARIM KISITI — .fgroup KUTUSU YAŞAMAYA DEVAM EDER
 Sayfa filtre motorları çipleri doğrudan seçmiyor; ÖNCE grup kutusunu
 buluyorlar:
 filters.querySelectorAll('.fgroup') → her grupta .df-fchip'leri bağla
 filters.querySelector('.fgroup[data-group="…"]') → "Tümü"yü aç/kapa
 Bu yüzden .fgroup SİLİNMEZ, İÇİ BOŞALTILMAZ: olduğu gibi popover'ın
 gövdesine TAŞINIR ve panelin altında kalmaya devam eder. Böylece sayfa
 scripti (bu dosyadan SONRA çalışır) her şeyi yerinde bulur; bileşen
 yalnızca kabuğu ve yerleşimi değiştirir, davranışa hiç dokunmaz.
 Aynı nedenle mobil çekmece de panelin İÇİNE basılır (body'ye değil):
 çekmece açıkken bile .fgroup panelin torunu olarak kalır.
 ===================================================================== */
(function(){
  var panels = document.querySelectorAll('[data-ff]');
  if(!panels.length) return;

  var MQ = window.matchMedia('(max-width:900px)');
  var uid = 0;

  function txt(el){ return el ? (el.textContent||'').replace(/\s+/g,' ').trim() : ''; }

  /* çipin "Tümü" (filtresiz) kalemi mi olduğu — sayfa motorlarının ortak sözleşmesi */
  function isAll(chip){ return chip.getAttribute('data-val') === 'all'; }

  function build(panel){
    var groups = Array.prototype.slice.call(panel.querySelectorAll('.fgroup[data-group]'));
    if(!groups.length) return;

    panel.classList.add('ff');
    var id = 'ff' + (++uid);

    /* ---- iskelet ---- */
    var bar = document.createElement('div');
    bar.className = 'ff-bar';
    bar.innerHTML = '<span class="ff-bar-lbl" aria-hidden="true"><i class="fa-solid fa-sliders"></i></span>';

    var chipsRow = document.createElement('div');
    chipsRow.className = 'ff-chips';
    chipsRow.setAttribute('aria-label','Aktif filtreler');
    chipsRow.setAttribute('aria-live','polite');

    var res = document.createElement('div');
    res.className = 'ff-res';

    /* ---- mobil çekmece ---- */
    var sheetOv = document.createElement('div');
    sheetOv.className = 'ff-sheet-ov';
    var sheet = document.createElement('div');
    sheet.className = 'ff-sheet';
    sheet.setAttribute('role','dialog');
    sheet.setAttribute('aria-modal','true');
    sheet.setAttribute('aria-label','Filtrele');
    sheet.innerHTML =
      '<div class="ff-sheet-h"><h3><i class="fa-solid fa-sliders"></i> Filtrele</h3>'+
      '<button class="ff-sheet-close" type="button" aria-label="Filtre panelini kapat"><i class="fa-solid fa-xmark"></i></button></div>'+
      '<div class="ff-sheet-body"></div>'+
      '<div class="ff-sheet-foot">'+
      '  <button class="btn btn-ghost ff-sheet-clear" type="button"><i class="fa-solid fa-rotate-left"></i> Sıfırla</button>'+
      '  <button class="btn btn-primary ff-sheet-apply" type="button">Sonuçları gör</button>'+
      '</div>';
    var sheetBody = sheet.querySelector('.ff-sheet-body');

    /* ---- facet'ler ---- */
    var facets = groups.map(function(g, gi){
      var key   = g.getAttribute('data-group');
      var lblEl = g.querySelector('.lbl') || g.querySelector(':scope > span');
      var label = txt(lblEl) || g.getAttribute('aria-label') || key;
      label = label.replace(/\s*(filtresi|seç)$/i,'').trim();
      if(lblEl) lblEl.remove();

      var chips = Array.prototype.slice.call(g.querySelectorAll('.df-fchip'));

      /* grup içine sıkışmış "Filtreyi sıfırla" düğmesi varsa önce dışarı al —
         popover'ın içinde durmasın (sayfa onu id ile bulmaya devam eder) */
      Array.prototype.slice.call(g.querySelectorAll('.fclear')).forEach(function(fc){
        panel.appendChild(fc);
      });

      var facet = document.createElement('div');
      facet.className = 'ff-facet';
      var popId = id+'-p'+gi;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ff-btn';
      btn.setAttribute('aria-haspopup','true');
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-controls', popId);
      btn.innerHTML = '<span class="ff-btn-t">'+label+'</span><span class="ff-n">0</span><i class="fa-solid fa-chevron-down ff-car" aria-hidden="true"></i>';

      var pop = document.createElement('div');
      pop.className = 'ff-pop';
      pop.id = popId;
      pop.setAttribute('role','group');
      pop.setAttribute('aria-label', label);
      var head = document.createElement('div');
      head.className = 'ff-pop-h';
      head.innerHTML = '<b>'+label+'</b><button class="ff-pop-clear" type="button">Temizle</button>';
      pop.appendChild(head);

      /* ---- ARAMA ALANI — HER EKSENDE (R5, 4. tur) ----
         "Tümü" bir seçenek değil, seçimin yokluğu → sayıma girmez.
         EŞİK TAMAMEN KALKTI. Tarihçe: C3'te eşik 8'di (yalnız Kas Grubu 10 ve
         Ekipman 15 arama alıyordu), sonra 5'e indi. Beyar 4. turda kararı
         netleştirdi: *"Seviye için de bir arama yapalım, çünkü o da tutarlı
         olsun."* Yani ölçüt seçenek sayısı DEĞİL, aynı sayfadaki eksenlerin
         aynı iç düzeni kullanması. Dört seçenekli bir eksende arama kutusu
         işlevsel olarak gereksiz olabilir ama panelin anatomisi tek olur ve
         kullanıcı hangi ekseni açarsa açsın aynı şeyi görür. */
      var realChips = chips.filter(function(c){ return !isAll(c); });
      var search = null, empty = null;
      if(realChips.length > 0){
        search = document.createElement('div');
        search.className = 'ff-search';
        search.innerHTML =
          '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>'+
          '<input type="search" autocomplete="off" spellcheck="false" '+
          'placeholder="'+label+' ara" aria-label="'+label+' seçenekleri içinde ara" '+
          'aria-controls="'+popId+'-list">'+
          '<button class="ff-search-x" type="button" aria-label="Aramayı temizle" hidden>'+
          '<i class="fa-solid fa-xmark"></i></button>';
        pop.appendChild(search);
        empty = document.createElement('p');
        empty.className = 'ff-empty';
        empty.setAttribute('role','status');
        empty.hidden = true;
        empty.textContent = 'Eşleşen seçenek yok.';
      }

      /* .fgroup KUTUSUYLA BİRLİKTE taşınır (yukarıdaki kısıt) — sayfa motoru
         hem grubu hem çipleri eskisi gibi bulur, listener'ları düşmez */
      g.id = g.id || (popId + '-list');
      g.setAttribute('role','listbox');
      g.setAttribute('aria-multiselectable','true');
      g.setAttribute('aria-label', label);
      chips.forEach(function(c){
        c.setAttribute('role','option');
        /* aria-pressed ile aria-selected aynı öğede DURAMAZ (rol çakışır);
           çoklu seçim listesinin doğru sözleşmesi option+aria-selected. */
        c.removeAttribute('aria-pressed');
        c.setAttribute('aria-selected', c.classList.contains('on') ? 'true':'false');
      });
      pop.appendChild(g);
      if(empty) pop.appendChild(empty);

      facet.appendChild(btn);
      facet.appendChild(pop);

      var allChip = chips.filter(isAll)[0] || null;
      return {key:key, label:label, el:facet, btn:btn, pop:pop, chips:chips, allChip:allChip,
              realChips:realChips, group:g, search:search, empty:empty,
              input: search ? search.querySelector('input') : null,
              clearBtn:head.querySelector('.ff-pop-clear')};
    });

    /* ---- bar içeriği ---- */
    facets.forEach(function(f){ bar.appendChild(f.el); });

    var spacer = document.createElement('div'); spacer.className = 'ff-spacer';
    bar.appendChild(spacer);

    var total = document.createElement('span');
    total.className = 'ff-total';
    total.innerHTML = '<b>0</b> filtre';
    bar.appendChild(total);

    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'ff-reset';
    reset.innerHTML = '<i class="fa-solid fa-xmark"></i> Temizle';
    bar.appendChild(reset);

    var openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'ff-open';
    openBtn.innerHTML = '<i class="fa-solid fa-sliders"></i> Filtrele <span class="ff-n">0</span>';
    bar.appendChild(openBtn);

    /* ---- sayfadaki mevcut sayaç ve sıralama bloklarını sonuç satırına taşı ---- */
    var countSel = panel.getAttribute('data-ff-count');
    var sortSel  = panel.getAttribute('data-ff-sort');
    var countHost = countSel ? document.querySelector(countSel) : null;
    var sortHost  = sortSel  ? document.querySelector(sortSel)  : null;
    /* YENİ YERLEŞİM: sayaç ve sıralama ayrı bir satırda değil, çubuğun SAĞ
       UCUNDA. Eski kurguda çubuğun sağı boş kalıyor, altına ikinci bir satır
       daha geliyordu; iki satır arasındaki ölü alan bileşeni "yarım" gösteriyordu. */
    if(countHost){ countHost.classList.add('ff-count'); bar.appendChild(countHost); }
    if(sortHost){ sortHost.classList.add('ff-sort'); bar.appendChild(sortHost); }

    /* eski .lib-bar kabuğu boşaldıysa yer kaplamasın */
    document.querySelectorAll('.lib-bar').forEach(function(lb){
      if(!lb.querySelector('*')) lb.remove();
    });

    /* ---- DOM'a yerleştir ---- */
    panel.appendChild(bar);
    panel.appendChild(chipsRow);
    if(res.children.length) panel.appendChild(res);
    /* çekmece body'ye DEĞİL panele basılır: açıkken bile .fgroup panelin
       torunu kalsın (sayfa motorlarının kapsam sorguları çalışmaya devam etsin).
       position:fixed olduğu için görsel olarak yine ekrana yapışır. */
    panel.appendChild(sheetOv);
    panel.appendChild(sheet);
    panel.classList.add('ff-ready');

    /* ---- sayfanın kendi "sıfırla" düğmesi varsa ona bağlan ---- */
    var pageClear = panel.getAttribute('data-ff-clear');
    var pageClearEl = pageClear ? document.querySelector(pageClear) : null;
    /* eski .fclear düğmesi bar'a taşınmışsa gizle — bileşenin kendi reset'i var */
    panel.querySelectorAll('.fclear').forEach(function(b){ b.style.display='none'; });

    /* =============== durum senkronu =============== */
    /* URL yalnız KULLANICI bir şey değiştirdikten sonra yazılır. Açılıştaki
       ilk senkronda yazsaydık ?bolge=ust-vucut gibi alias adresler kullanıcı
       hiçbir şey yapmadan kanonik biçime çevrilir, paylaşılan bağlantı bozulurdu. */
    var dirty = false;
    function selectedOf(f){
      return f.chips.filter(function(c){ return !isAll(c) && c.classList.contains('on'); });
    }
    function sync(){
      var totalSel = 0;
      chipsRow.innerHTML = '';
      var lbl = document.createElement('span');
      lbl.className = 'ff-chips-lbl';
      lbl.textContent = 'Seçili:';
      chipsRow.appendChild(lbl);

      facets.forEach(function(f){
        var sel = selectedOf(f);
        totalSel += sel.length;
        f.btn.classList.toggle('has-sel', sel.length>0);
        f.btn.querySelector('.ff-n').textContent = sel.length;
        sel.forEach(function(c){
          var chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'ff-chip';
          var name = txt(c);
          chip.innerHTML = '<span class="ff-chip-g">'+f.label+':</span> '+name+
                           '<span class="ff-x" aria-hidden="true"><i class="fa-solid fa-xmark"></i></span>';
          chip.setAttribute('aria-label', f.label+' — '+name+' filtresini kaldır');
          chip.addEventListener('click', function(){ c.click(); });
          chipsRow.appendChild(chip);
        });
      });

      /* çiplerin aria-selected'i durumla birlikte yürür.
         aria-pressed HER TURDA yeniden siliniyor: kurulumda bir kez silmek
         yetmiyordu — iki sayfanın kendi boyama fonksiyonu kabuktan SONRA
         çalışıp özniteliği geri koyuyor ve `role="option"` ile çakışıyordu
         (doğrulama ajanı 24 çipte ölçtü: fit-testleri 15, aktivite-gunlugu 9). */
      facets.forEach(function(f){
        f.chips.forEach(function(c){
          c.setAttribute('aria-selected', c.classList.contains('on') ? 'true':'false');
          if(c.hasAttribute('aria-pressed')) c.removeAttribute('aria-pressed');
        });
      });

      panel.classList.toggle('has-sel', totalSel>0);
      total.querySelector('b').textContent = totalSel;
      openBtn.querySelector('.ff-n').textContent = totalSel;
      var applyBtn = sheet.querySelector('.ff-sheet-apply');
      if(applyBtn) applyBtn.textContent = totalSel ? ('Sonuçları gör ('+totalSel+' filtre)') : 'Sonuçları gör';

      if(dirty) writeURL();
    }

    /* =============== TEK DURUM NESNESİ + URL =================
       Tek gerçek kaynak DOM'daki çip durumudur; state onun okunmuş hâli.
       İki motor (sayfa motoru + bu bileşen) aynı çipe bakar, ikinci bir
       kopya durum tutulmaz — kopyalar ayrışır. */
    function readState(){
      var st = {};
      facets.forEach(function(f){
        var v = selectedOf(f).map(function(c){ return c.getAttribute('data-val'); });
        if(v.length) st[f.key] = v;
      });
      return st;
    }
    /* eski/alias parametreler: yazarken düşürülür, yoksa kullanıcının
       kaldırdığı seçim yeniden yüklemede geri gelir (ör. ?bolge=ust-vucut
       egzersiz kütüphanesinde dört kas çipini açıyor) */
    var LEGACY = (panel.getAttribute('data-ff-legacy')||'').split(/[,\s]+/).filter(Boolean);

    function writeURL(){
      var st = readState();
      var q = new URLSearchParams(location.search);
      facets.forEach(function(f){ q.delete(f.key); });
      LEGACY.forEach(function(k){ q.delete(k); });
      Object.keys(st).forEach(function(k){ q.set(k, st[k].join(',')); });
      var qs = q.toString();
      history.replaceState(null, '', location.pathname + (qs? '?'+qs : '') + location.hash);
    }

    /* URL → DOM. Sayfa motorunun kendi derin bağlantı okuması BİTTİKTEN
       sonra çalışır (window load) ve YALNIZ FARKI tıklar; iki kez
       tetiklenip seçimi geri almaz. */
    function restoreFromURL(){
      var q = new URLSearchParams(location.search);
      facets.forEach(function(f){
        var raw = q.get(f.key);
        if(raw === null) return;
        var want = raw.split(',').filter(Boolean);
        f.chips.forEach(function(c){
          if(isAll(c)) return;
          var v = c.getAttribute('data-val');
          var on = c.classList.contains('on');
          if(want.indexOf(v) > -1 && !on) c.click();
          else if(want.indexOf(v) < 0 && on) c.click();
        });
      });
      sync();
    }

    /* çip tıklamaları sayfa motoruna ait; biz yalnız SONRASINDA durumu okuruz */
    facets.forEach(function(f){
      f.chips.forEach(function(c){ c.addEventListener('click', function(){ dirty = true; setTimeout(sync,0); }); });
      f.clearBtn.addEventListener('click', function(){
        dirty = true;
        if(f.allChip){ f.allChip.click(); }
        else { selectedOf(f).forEach(function(c){ c.click(); }); }
        setTimeout(sync,0);
      });

      /* ---- ARAMA (C3): yazdıkça süz, eşleşme yoksa boş durum ---- */
      if(f.input){
        var norm = function(t){ return (t||'').toLocaleLowerCase('tr').replace(/\s+/g,' ').trim(); };
        var xBtn = f.search.querySelector('.ff-search-x');
        var run = function(){
          var q = norm(f.input.value);
          var shown = 0;
          f.chips.forEach(function(c){
            /* "Tümü" aramada gizlenir: seçenek değil, sıfırlama kalemi */
            var hide = isAll(c) ? !!q : (q && norm(c.textContent).indexOf(q) < 0);
            c.hidden = !!hide;
            if(!hide && !isAll(c)) shown++;
          });
          if(f.empty) f.empty.hidden = !(q && shown === 0);
          if(xBtn) xBtn.hidden = !q;
        };
        f.input.addEventListener('input', run);
        f.input.addEventListener('keydown', function(e){
          if(e.key === 'Escape'){ e.stopPropagation(); if(f.input.value){ f.input.value=''; run(); } else closeFacets(null); return; }
          if(e.key === 'ArrowDown'){ e.preventDefault(); focusChip(f, 0); }
        });
        if(xBtn) xBtn.addEventListener('click', function(){ f.input.value=''; run(); f.input.focus(); });
        f.runSearch = run;
      }

      /* ---- KLAVYE: ok tuşlarıyla gezinme ----
         Dinleyici POPOVER'a değil FACET'e bağlı: odak henüz açma düğmesindeyken
         ArrowDown ile panele girilebilsin (arama alanı olmayan eksenlerde
         tek giriş yolu bu). */
      f.el.addEventListener('keydown', function(e){
        if(['ArrowDown','ArrowUp','Home','End'].indexOf(e.key) < 0) return;
        if(!f.el.classList.contains('open')){
          if(e.key !== 'ArrowDown') return;
          e.preventDefault();
          f.btn.click();                                   /* kapalıyken ArrowDown açar */
          return;
        }
        var vis = visibleChips(f);
        if(!vis.length) return;
        e.preventDefault();
        if(document.activeElement === f.btn || (f.input && document.activeElement === f.input)){
          if(e.key === 'ArrowDown'){ focusChip(f, 0); return; }
          if(e.key === 'End'){ focusChip(f, vis.length-1); return; }
          if(e.key === 'Home'){ focusChip(f, 0); return; }
          return;
        }
        var i = vis.indexOf(document.activeElement);
        if(i < 0){ focusChip(f, 0); return; }
        var j = e.key === 'ArrowDown' ? Math.min(i+1, vis.length-1)
              : e.key === 'ArrowUp'   ? (i<=0 ? -1 : i-1)
              : e.key === 'Home'      ? 0 : vis.length-1;
        if(j === -1){ (f.input || f.btn).focus(); return; }
        focusChip(f, j);
      });
    });

    function visibleChips(f){
      return f.chips.filter(function(c){ return !c.hidden && c.offsetParent !== null; });
    }
    function focusChip(f, i){
      var vis = visibleChips(f);
      if(vis[i]) vis[i].focus();
    }

    function resetAll(){
      dirty = true;
      if(pageClearEl){ pageClearEl.click(); }
      else{
        facets.forEach(function(f){
          if(f.allChip) f.allChip.click();
          else selectedOf(f).forEach(function(c){ c.click(); });
        });
      }
      setTimeout(sync,0);
    }
    reset.addEventListener('click', resetAll);
    sheet.querySelector('.ff-sheet-clear').addEventListener('click', resetAll);

    /* =============== popover aç/kapa (masaüstü) =============== */
    function closeFacets(except){
      facets.forEach(function(f){
        if(f===except) return;
        f.el.classList.remove('open');
        f.btn.setAttribute('aria-expanded','false');
        f.pop.style.maxHeight = '';
      });
    }

    /* ---- PANELİ GÖRÜNÜR ALANA KELEPÇELE (R6, 4. tur) ----
       Beyar: "Bazen bu drop yukarıda çıkıyor, arama kısmını aktif hale
       getiremiyorum. Olabildiğince aşağıdan çıkması lazım."

       ESKİ DAVRANIŞ: alt kenar taşınca `above > below` ise DOĞRUDAN yukarı
       çevriliyordu. Filtre çubuğu sayfanın ortasında olduğu için `above`
       çoğu zaman `below`dan büyük çıkıyor ve panel varsayılan olarak yukarı
       açılıyordu (ölçüldü: challenge-merkezi'nin üç ekseninde de yukarı).

       YENİ SIRA — üç kademe:
       1. AŞAĞI AÇ (varsayılan). Yer varsa hiçbir şey yapılmaz.
       2. Yer yoksa SAYFAYI KAYDIRARAK YER AÇ. Filtre çubuğu `sticky top:112`
          olduğu için sayfa aşağı kaydıkça çubuk yukarı gidip altında yer
          açılıyor. Kaydırma anlık (`behavior:auto`) — yumuşak kaydırmada
          ölçüm hareket hâlindeki kutuyu okur.
       3. O da yetmiyorsa YUKARI ÇEVİR (son çare) ya da yükseklikten kırp;
          hangisi daha çok yer veriyorsa. Yukarı açıldığında bile arama alanı
          panelin en üstünde ve yapışkan kaldığı için görünür ve odaklanabilir
          durumda kalır. */
    function placePop(f){
      var pop = f.pop;
      f.el.classList.remove('flip','up');
      pop.style.maxHeight = '';
      var vw = document.documentElement.clientWidth;
      var vh = window.innerHeight;
      var r  = pop.getBoundingClientRect();
      if(r.right > vw - 12) f.el.classList.add('flip');

      /* panelin doğal boyu — CSS tavanı (min(60vh,420px)) zaten uygulanmış */
      var need = Math.min(pop.scrollHeight, r.height || pop.scrollHeight);
      var br = f.btn.getBoundingClientRect();
      var below = vh - br.bottom - 18;

      /* 2. kademe — aşağıda yer yoksa sayfayı kaydırıp yer aç */
      if(below < need){
        var doc = document.documentElement;
        var room = Math.max(0, doc.scrollHeight - (window.scrollY + vh));
        var delta = Math.min(need - below, room);
        if(delta > 1){
          window.scrollTo({top: window.scrollY + delta, behavior: 'auto'});
          br = f.btn.getBoundingClientRect();
          below = vh - br.bottom - 18;
        }
      }

      var above = br.top - 18;
      if(below < need){
        /* 3. kademe — SON ÇARE.
           `above > below` yeterli ölçüt DEĞİL: filtre çubuğu sayfanın
           ortasındayken üstte hep daha çok yer olur ve panel varsayılan
           olarak yukarı açılırdı (ölçüldü: sayfa başındayken 23 eksenin
           11'i yukarı). Beyar'ın kuralı "olabildiğince aşağı".
           Bu yüzden aşağıda KULLANILABİLİR bir yer kaldığı sürece
           (MIN_DOWN) panel aşağı açılır ve yalnız BOYUNDAN kırpılır;
           panel kendi içinde kaydırılır, arama alanı yapışkan olduğu için
           tepede kalır. Yukarı çevirme yalnız aşağısı gerçekten
           kullanılamayacak kadar darsa devreye girer. */
        var MIN_DOWN = 200;   /* başlık 34 + arama 48 + ~3 seçenek + dolgu */
        if(below < MIN_DOWN && above > below){
          f.el.classList.add('up');
          pop.style.maxHeight = Math.floor(Math.min(above, need)) + 'px';
        } else {
          pop.style.maxHeight = Math.max(MIN_DOWN, Math.floor(below)) + 'px';
        }
      }
      /* odak panele: arama alanı varsa oraya, yoksa ilk seçeneğe (C3).
         GECİKMELİ: .ff-pop `visibility:hidden` + `transition:… visibility`
         ile açılıyor; görünmez öğede .focus() SESSİZCE NO-OP'tur (aynı tuzak
         KARARLAR.md K1'de modal katmanları için ölçülmüştü). Sınırlı kare
         yoklamasıyla gerçekten görünür olduğu karede odaklanıyoruz. */
      var target = f.input || visibleChips(f)[0];
      if(target) focusWhenVisible(target, f.el);
      if(f.input && f.runSearch) f.runSearch();
    }

    var MAX_FRAMES = 20;
    function reallyVisible(n){
      if(!n) return false;
      if(typeof n.checkVisibility === 'function') return n.checkVisibility({visibilityProperty:true});
      var cs = getComputedStyle(n);
      if(cs.visibility === 'hidden' || cs.display === 'none') return false;
      return n.offsetWidth > 0 || n.offsetHeight > 0;
    }
    function focusWhenVisible(node, holder, tries){
      tries = tries || 0;
      if(!document.contains(node)) return;
      if(!holder.classList.contains('open')) return;      /* bu arada kapandıysa bırak */
      if(holder.contains(document.activeElement) && document.activeElement !== holder) return;
      if(reallyVisible(node)){ node.focus(); return; }
      if(tries >= MAX_FRAMES) return;
      requestAnimationFrame(function(){ focusWhenVisible(node, holder, tries+1); });
    }
    facets.forEach(function(f){
      f.btn.addEventListener('click', function(e){
        e.stopPropagation();
        var willOpen = !f.el.classList.contains('open');
        closeFacets(f);
        f.el.classList.toggle('open', willOpen);
        f.btn.setAttribute('aria-expanded', willOpen?'true':'false');
        if(willOpen) placePop(f);
      });
    });
    document.addEventListener('click', function(e){
      if(!e.target.closest('.ff-facet')) closeFacets(null);
    });
    document.addEventListener('keydown', function(e){
      if(e.key!=='Escape') return;
      if(sheet.classList.contains('open')){ closeSheet(); return; }
      var open = facets.filter(function(f){ return f.el.classList.contains('open'); })[0];
      closeFacets(null);
      if(open) open.btn.focus();      /* odak kaybolmasın (§20 odak dönüşü) */
    });
    /* panelden Tab ile çıkıldığında panel kapansın — açık kalan panel
       arkadaki karta tıklamayı engelliyordu */
    panel.addEventListener('focusout', function(e){
      var open = facets.filter(function(f){ return f.el.classList.contains('open'); })[0];
      if(!open) return;
      setTimeout(function(){
        if(!open.el.contains(document.activeElement)){
          open.el.classList.remove('open');
          open.btn.setAttribute('aria-expanded','false');
        }
      }, 0);
    });
    /* Çubuk sticky: sayfa kayınca açma düğmesinin ekrandaki yeri değişir,
       panelin yön/kırpma hesabı bayatlar. Kaydırma ve yeniden boyutlandırmada
       yeniden yerleştir (yalnız açık panel için, rAF ile tek kare). */
    var placeQueued = false;
    function replaceOpen(){
      if(placeQueued) return;
      placeQueued = true;
      requestAnimationFrame(function(){
        placeQueued = false;
        facets.forEach(function(f){ if(f.el.classList.contains('open')) placePop(f); });
      });
    }
    window.addEventListener('resize', replaceOpen);
    window.addEventListener('scroll', replaceOpen, {passive:true});

    /* =============== mobil çekmece =============== */
    function openSheet(){
      if(sheet.classList.contains('open')) return;
      facets.forEach(function(f){ sheetBody.appendChild(f.el); f.el.classList.remove('open'); });
      sheet.classList.add('open'); sheetOv.classList.add('open');
      if(window.FIT_SHELL && FIT_SHELL.lockScroll) FIT_SHELL.lockScroll();
      if(window.__bnUpdate) window.__bnUpdate();
      var first = sheetBody.querySelector('.df-fchip');
      if(first) first.focus();
    }
    function closeSheet(){
      if(!sheet.classList.contains('open')) return;
      sheet.classList.remove('open'); sheetOv.classList.remove('open');
      if(window.FIT_SHELL && FIT_SHELL.unlockScroll) FIT_SHELL.unlockScroll();
      if(window.__bnUpdate) window.__bnUpdate();
      /* facet'leri bar'a geri al — masaüstüne dönüşte yerli yerinde olsun */
      facets.forEach(function(f){ bar.insertBefore(f.el, spacer); });
      openBtn.focus();
    }
    openBtn.addEventListener('click', openSheet);
    sheetOv.addEventListener('click', closeSheet);
    sheet.querySelector('.ff-sheet-close').addEventListener('click', closeSheet);
    sheet.querySelector('.ff-sheet-apply').addEventListener('click', closeSheet);
    function onMQ(){ if(!MQ.matches) closeSheet(); }
    if(MQ.addEventListener) MQ.addEventListener('change', onMQ);
    else if(MQ.addListener) MQ.addListener(onMQ);

    /* sayfa motoru derin bağlantıdan çip açmış olabilir → ilk senkron */
    sync();
    /* sayfa scriptleri bu dosyadan SONRA çalışır; bir tur daha oku */
    setTimeout(sync, 0);
    /* URL'den geri yükleme load'da: sayfa motorunun kendi derin bağlantı
       okuması bitmiş olur, biz yalnız farkı tıklarız (idempotent) */
    window.addEventListener('load', function(){ restoreFromURL(); });
  }

  panels.forEach(build);
})();



/* =====================================================================
 TEK SATIR ETİKET RAYI — [data-tagrow]  (ORTAK YARDIMCI · TEK KAYNAK)
 ---------------------------------------------------------------------
 Sözleşme: <div class="… " data-tagrow><span>…</span><span>…</span></div>
 · Kutuya sığmayan etiketler GİZLENİR (display:none), sona "+N" rozeti gelir.
 · N = gizlenen etiket sayısına BİREBİR eşittir (uydurma sayı yok).
 · Rozet tıklanabilir DEĞİL: <span aria-hidden="true">, tabindex yok,
   pointer-events:none (CSS). Kart bağlantısının içinde durduğu için
   tıklanabilir olsaydı ikinci bir hedef üretirdi.
 · Genişlik değişince yeniden hesaplanır (ResizeObserver varsa o, yoksa resize).
 Ölçüm sözleşmesi: hesap bittiğinde scrollWidth <= clientWidth ve
 scrollHeight == tek satır yüksekliği olur.
 ===================================================================== */
(function(){
  var rows = document.querySelectorAll('[data-tagrow]');
  if(!rows.length) return;

  function layout(row){
    /* 1 · her şeyi geri aç, rozeti kaldır → temiz ölçüm zemini */
    var more = row.querySelector('.tagrow-more');
    if(more) more.remove();
    var items = Array.prototype.filter.call(row.children, function(c){
      return !c.classList.contains('tagrow-more');
    });
    items.forEach(function(c){ c.style.display=''; });
    if(!items.length) return;

    var avail = row.clientWidth;
    if(!avail) return;

    /* gap'i CSS'ten oku — sabit sayı gömmek kart genişliği değişince tutmuyor */
    var cs  = getComputedStyle(row);
    var gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;

    /* 2 · sığanları say */
    var used = 0, fit = 0, i;
    for(i=0;i<items.length;i++){
      var w = items[i].getBoundingClientRect().width;
      var next = used + (fit? gap:0) + w;
      if(next > avail + .5) break;
      used = next; fit++;
    }
    if(fit === items.length) return;           /* hepsi sığdı → rozet yok */

    /* 3 · rozet için yer aç: rozeti bas, sığmayana kadar geri çekil */
    var badge = document.createElement('span');
    badge.className = 'tagrow-more';
    badge.setAttribute('aria-hidden','true');
    row.appendChild(badge);

    while(fit > 0){
      badge.textContent = '+' + (items.length - fit);
      for(i=0;i<items.length;i++) items[i].style.display = (i<fit? '' : 'none');
      if(row.scrollWidth <= row.clientWidth + .5) break;
      fit--;
    }
    if(fit === 0){                              /* tek etiket bile sığmadı */
      badge.textContent = '+' + items.length;
      items.forEach(function(c){ c.style.display='none'; });
    }
    /* ekran okuyucu için gerçek metin kart bağlantısının aria-label'ında değil,
       gizlenen etiketlerde kalıyor; rozet yalnız görsel özet olduğu için
       aria-hidden — bilgi kaybı yok, tekrar yok. */
  }

  function all(){ Array.prototype.forEach.call(rows, layout); }

  all();
  /* yazı tipi geç yüklenirse genişlikler değişir → bir tur daha */
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(all);
  window.addEventListener('load', all);

  if(window.ResizeObserver){
    var ro = new ResizeObserver(function(ents){
      ents.forEach(function(e){ layout(e.target); });
    });
    Array.prototype.forEach.call(rows, function(r){ ro.observe(r); });
  } else {
    var t=null;
    window.addEventListener('resize', function(){ clearTimeout(t); t=setTimeout(all,120); });
  }
})();



/* =====================================================================
 SEKME BİLEŞENİ — [data-fit-tabs]  (ORTAK · TEK KAYNAK · CSS eşi .fit-tabs)
 ---------------------------------------------------------------------
 Sözleşme:
 <div class="fit-tabs" data-fit-tabs="<ad>" aria-label="…">
   <button class="fit-tab" data-tab="hakkinda">Hakkında</button>
   <button class="fit-tab" data-tab="yorumlar">Yorumlar</button>
 </div>
 …
 <div class="fit-pane" data-pane="hakkinda">…</div>
 <div class="fit-pane" data-pane="yorumlar" hidden>…</div>

 · role=tablist / role=tab / role=tabpanel, aria-selected, aria-controls
   ve roving tabindex BURADA kurulur — sayfa markup'ında tekrarlanmaz.
 · Klavye: ← → ile komşu sekme, Home/End ile uç sekme, seçilen odaklanır.
   Tab tuşu sekme şeridinden ÇIKAR (roving tabindex: yalnız aktif olan 0).
 · SAYFA ZIPLAMASI YOK: bileşen scrollTo/scrollIntoView ÇAĞIRMAZ.
   (Eski antrenör detay sekmesi geçişte window.scrollTo yapıyordu; ölçüm
   sözleşmesi "içerik kapsayıcısının boundingBox.top değişmiyor" diyor.)
 · <a href> kipinde JS hiç devreye girmez: sekmeler sayfa geçişidir,
   aktif olan markup'ta aria-selected="true" taşır.
 ===================================================================== */
(function(){
  var bars = document.querySelectorAll('[data-fit-tabs]');
  if(!bars.length) return;

  bars.forEach(function(bar){
    var tabs = Array.prototype.slice.call(bar.querySelectorAll('.fit-tab'));
    if(!tabs.length) return;

    /* ---- sayfa geçişi kipi: <a> sekmeler ---- */
    var linkMode = tabs.every(function(t){ return t.tagName === 'A'; });
    bar.setAttribute('role', linkMode ? 'navigation' : 'tablist');
    if(linkMode){
      tabs.forEach(function(t){
        var on = t.getAttribute('aria-selected') === 'true';
        if(on) t.setAttribute('aria-current','page');
      });
      return;
    }

    /* ---- panel kipi ---- */
    var name  = bar.getAttribute('data-fit-tabs') || 'ft';
    var scope = bar.closest('[data-fit-tabs-scope]') || document;
    var panes = Array.prototype.slice.call(scope.querySelectorAll('.fit-pane[data-pane]'));

    tabs.forEach(function(t, i){
      var key = t.getAttribute('data-tab');
      var pane = panes.filter(function(p){ return p.getAttribute('data-pane') === key; })[0];
      t.setAttribute('role','tab');
      t.id = t.id || (name + '-tab-' + key);
      if(pane){
        pane.id = pane.id || (name + '-pane-' + key);
        pane.setAttribute('role','tabpanel');
        pane.setAttribute('aria-labelledby', t.id);
        t.setAttribute('aria-controls', pane.id);
      }
      /* açılış durumu: markup'ta aria-selected ya da .active varsa o, yoksa ilki */
      var on = t.getAttribute('aria-selected') === 'true' || t.classList.contains('active');
      if(!tabs.some(function(x){ return x.getAttribute('aria-selected')==='true' || x.classList.contains('active'); })) on = (i===0);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      t.classList.toggle('active', on);
      if(pane){
        pane.hidden = !on;
        /* R8 · WAI-ARIA APG: SEÇİLİ PANEL TAB SIRASINA GİRER.
           Kusur (AJAN-G ölçtü, antrenor-detay-v1 "Hakkında" paneli):
           panelin içinde odaklanabilir öğe yoksa Tab paneli tamamen
           atlıyor, klavye kullanıcısı içeriğe hiç uğramadan alttaki
           CTA'ya düşüyordu. APG "Tabs" deseni tam bu durum için
           tabpanel'e tabindex="0" veriyor. Seçili olmayan panel zaten
           `hidden`, odak sırasına girmez. */
        pane.setAttribute('tabindex', on ? '0' : '-1');
      }
    });

    function select(tab, focus){
      tabs.forEach(function(t){
        var on = (t === tab);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
        t.classList.toggle('active', on);
        var key = t.getAttribute('data-tab');
        panes.forEach(function(p){
          if(p.getAttribute('data-pane') !== key) return;
          p.hidden = !on;
          p.setAttribute('tabindex', on ? '0' : '-1');   /* APG — bkz. açılış bloğu */
        });
      });
      if(focus) tab.focus();
      /* mobilde seçilen sekme şeridin dışındaysa YALNIZ şeridi kaydır —
         sayfa scroll'una dokunulmaz (dikey zıplama olmaz) */
      if(bar.scrollWidth > bar.clientWidth){
        var br = bar.getBoundingClientRect(), tr = tab.getBoundingClientRect();
        if(tr.left < br.left)       bar.scrollLeft += (tr.left - br.left) - 8;
        else if(tr.right > br.right) bar.scrollLeft += (tr.right - br.right) + 8;
      }
      if(window.__bnUpdate) window.__bnUpdate();
      bar.dispatchEvent(new CustomEvent('fit:tabchange',{bubbles:true,detail:{key:tab.getAttribute('data-tab')}}));
    }

    tabs.forEach(function(t){
      t.addEventListener('click', function(){ select(t, false); });
    });

    bar.addEventListener('keydown', function(e){
      var i = tabs.indexOf(document.activeElement);
      if(i < 0) return;
      var j = null;
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i+1) % tabs.length;
      else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i-1+tabs.length) % tabs.length;
      else if(e.key === 'Home') j = 0;
      else if(e.key === 'End')  j = tabs.length-1;
      else return;
      e.preventDefault();
      select(tabs[j], true);
    });
  });
})();


/* =====================================================================
   BANNER → GÖVDE DİKİŞİ  (Beyar · Revize 1)
   ---------------------------------------------------------------------
   Banner'dan sonraki İLK opak, tam-en, yapışkan-olmayan, görünür banda
   `.fit-seam` basar; o bant banner'ın dibine KOMŞUysa `.is-onbanner` da
   ekler (22px binme). Biçimin tamamı CSS'te
   (fit-shell.css → "BANNER → GÖVDE DİKİŞİ").

   Neden JS: 66 sayfada gövdenin sınıf adı 30'dan fazla çeşit; ayrıca
   #fitPlanTop gibi bloklar ÇALIŞMA ANINDA banner+ray üretiyor, yani doğru
   kardeş ancak enjeksiyon bittikten sonra bilinebiliyor. Bu blok bilerek
   plan kabuğu enjeksiyonundan SONRA duruyor.

   ELEME ÖLÇÜTLERİ ve gerekçeleri:
   · getClientRects().length===0 → gizli blok. DENETIM.md §2: görünürlük
     `getClientRects()` ile ölçülür, offsetParent'a güvenilmez.
   · position sticky/fixed → sekme rayı (.pf-tabbar z-index:40 · .fs-tabbar ·
     .chl-tabbar) ve modal perdeleri; bunlar gövde değil.
   · saydam zemin → .wrap.fit-band-panel · .wrap.fp-gate · .chl-pane
   · TAM-EN ŞARTI: dikiş sayfayı boydan boya kesen bir BAND'dır. Bu şart
     `.wrap`ları (max-width 1176) eler. Şartsız iniş yapsaydık
     dadafit-hub / dadafit-kopru / antrenor-ol sayfalarında
     `.fit-band-panel > *` (koyu #1e1b14 yüzen kart, kendi radius'u var)
     dikiş sanılır ve üst köşeleri bozulurdu.

   İNİŞ (descend): saydam ama TAM-EN bir sarmalayıcıya rastlarsak içine
   iner, aynı ölçütleri çocuklarına uygularız. challenge-v1 böyle:
   gövde `.chl-track` main'in torunu, `.chl-pane` (saydam, tam-en) içinde.
   ===================================================================== */
(function(){
  var BAN = '.lib-top,.cp-top,.kp-top,.ol-top,.ed-top,.fs-top,'+
            '.pd-hero,.chl-hero,.df-top,.au-top';
  var main = document.querySelector('main.page-main');
  if(!main) return;

  var kids = Array.prototype.slice.call(main.children);
  var bi = -1;
  for(var i=0;i<kids.length;i++){
    if(kids[i].matches && kids[i].matches(BAN)){ bi = i; break; }
  }
  if(bi < 0) return;                    /* koyu banner yok (ör. profil-v1) */

  /* tam-en = sayfa genişliğinin en az %94'ünü kaplayan band */
  var esik = main.clientWidth * 0.94;
  function tamEn(el){ return el.getBoundingClientRect().width >= esik; }

  var komsu = true;                     /* hâlâ banner'ın dibinde miyiz? */
  var kuyruk = kids.slice(bi+1);
  var basildi = false;

  while(kuyruk.length && !basildi){
    var el = kuyruk.shift();

    /* R11/M22 · SIFIR ALANLI BLOK KOMŞULUĞU KESMEZ.
       `getClientRects().length` 0×0 bir eleman için 1 dönebiliyor; bu
       yüzden ekranda HİÇ YER KAPLAMAYAN bloklar "araya giren blok" sayılıp
       `is-onbanner`ı düşürüyordu. Ölçülen kusur: dadafit-hub'da hero ile
       beyaz gövde arasında `.wrap.fit-band-panel` var ama BOŞ (kabuk
       `.fit-band-panel:empty{display:none}` diyor) — 0×0. Gövde dikişi
       alıyordu ama binme almıyordu, köşe beyaz üstünde beyaz kalıyordu.
       Alanı olmayan blok görünmez sayılır ve komşuluğu bozmaz. */
    var kutu = el.getBoundingClientRect();
    if(el.getClientRects().length === 0 || kutu.width < 1 || kutu.height < 1) continue;

    var cs = getComputedStyle(el);
    if(cs.position === 'sticky' || cs.position === 'fixed'){ komsu = false; continue; }
    if(!tamEn(el)){ komsu = false; continue; }

    var bg = cs.backgroundColor;
    var saydam = !bg || bg === 'transparent' ||
                 /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)$/.test(bg);

    if(saydam){
      /* saydam ama tam-en → içine in, sırayı bozmadan başa ekle */
      kuyruk = Array.prototype.slice.call(el.children).concat(kuyruk);
      komsu = false;
      continue;
    }

    el.classList.add('fit-seam');
    if(komsu) el.classList.add('is-onbanner');
    basildi = true;
  }
})();


/* =====================================================================
   PARALLAX BAND  (Beyar · Revize 11 · M2)
   ---------------------------------------------------------------------
   `data-fit-px` taşıyan banda kardeş markanın sabit-görsel düzeneğini
   kurar (biçim: fit-shell.css → "PARALLAX BAND").

   Band iki özel değer bildirir, JS onları okur:
     --px-img   → sabit duracak GÖRSEL   (zorunlu; yoksa band atlanır)
     --px-veil  → görselin üstündeki perde (isteğe bağlı; genelde gradient)
   Ayrıca --px-x / --px-y ile görselin odak noktası verilebilir.

   `--px-shift` scroll'da GÜNCELLENMEZ. Görsel zaten `position:fixed`;
   parallax'ı yaratan şey bandın onun üstünden kaymasıdır. Shift yalnız
   "bu band ekranın ortasındayken görselin hangi kısmı görünsün" sorusunu
   çözer, o yüzden resize/load yeter — scroll dinleyicisi yok, bedava.
   ===================================================================== */
(function(){
  var bantlar = [];

  function guncelle(b){
    var cs = getComputedStyle(b.band);
    /* köşe yarıçapı banddan alınır: dikişli bir banda da uygulanabilsin */
    b.clip.style.setProperty('--px-r',
      (cs.borderRadius && cs.borderRadius !== '0px') ? cs.borderRadius : '0px');

    var r      = b.band.getBoundingClientRect();
    var vh     = window.innerHeight;
    var merkez = r.top + window.scrollY + r.height / 2;
    var enCok  = Math.max(0, document.documentElement.scrollHeight - vh);
    var hedef  = Math.min(Math.max(merkez - vh / 2, 0), enCok);
    b.clip.style.setProperty('--px-shift', (merkez - hedef - vh / 2).toFixed(1) + 'px');
  }

  var hedefler = document.querySelectorAll('[data-fit-px]');
  for(var i = 0; i < hedefler.length; i++){
    var band = hedefler[i];
    var cs   = getComputedStyle(band);
    var img  = (cs.getPropertyValue('--px-img') || '').trim();
    if(!img || img === 'none') continue;          /* görsel yoksa dokunma */

    if(cs.position === 'static') band.style.position = 'relative';

    var clip  = document.createElement('div');
    clip.className = 'px-clip';
    clip.setAttribute('aria-hidden','true');

    var media = document.createElement('div');
    media.className = 'px-media';
    media.style.backgroundImage = img;
    clip.appendChild(media);

    var perde = (cs.getPropertyValue('--px-veil') || '').trim();
    if(perde && perde !== 'none'){
      var veil = document.createElement('div');
      veil.className = 'px-veil';
      veil.style.backgroundImage = perde;
      clip.appendChild(veil);
    }

    var ox = (cs.getPropertyValue('--px-x') || '').trim();
    var oy = (cs.getPropertyValue('--px-y') || '').trim();
    if(ox) clip.style.setProperty('--px-x', ox);
    if(oy) clip.style.setProperty('--px-y', oy);

    band.classList.add('px-band');
    band.insertBefore(clip, band.firstChild);
    bantlar.push({ band: band, clip: clip });
  }

  if(!bantlar.length) return;

  function hepsi(){ for(var k = 0; k < bantlar.length; k++) guncelle(bantlar[k]); }
  hepsi();
  window.addEventListener('resize', hepsi);
  window.addEventListener('load', hepsi);
})();


/* =====================================================================
   SAYFALAMA MOTORU  (Beyar · Revize 11 · M6)
   ---------------------------------------------------------------------
   Biçim fit-shell.css → "SAYFALAMA". Bu blok yalnız davranışı kurar.

   Kullanım (sayfa tarafından çağrılır):
     var pagi = FIT_PAGI({
       kap:     document.getElementById('libPagi'),   // <nav> kabı
       sayfaBoy:12,
       birim:   'hareket',                            // özet satırındaki ad
       liste:   function(){ return gorunurKartlar },  // O ANKİ süzülmüş dizi
       ciz:     function(gosterilecek, hepsi){ ... }  // sayfayı ekrana bas
     });
     pagi.yenile();     // filtre değişince — 1. sayfaya döner
     pagi.git(3);       // belirli sayfaya

   Neden kabukta: Beyar "liste sayfalarında" dedi, tek sayfa değil.
   Tek kaynak olmazsa her liste kendi sayfalamasını yazar ve ilk/son
   atlama bir yerde unutulur.

   Kalemler:  «  ‹  1 2 3 … N  ›  »
   · ilk/son sayfaya atla  → DadaHaber referansı
   · önceki/sonraki        → Gastro referansı
   · pencere: aktif sayfanın iki yanı; arada boşluk kalırsa "…"
   ===================================================================== */
window.FIT_PAGI = function(cfg){
  var kap = cfg.kap;
  if(!kap) return { yenile:function(){}, git:function(){}, ciz:function(){} };
  var boy   = cfg.sayfaBoy || 12;
  var birim = cfg.birim || 'kayıt';
  var sayfa = 1;

  function toplamSayfa(n){ return Math.max(1, Math.ceil(n / boy)); }

  /* gösterilecek sayfa numaraları — aktifin iki yanı + ilk + son */
  function pencere(aktif, son){
    var set = {}, ekle = function(n){ if(n >= 1 && n <= son) set[n] = 1; };
    ekle(1); ekle(son);
    for(var d = -1; d <= 1; d++) ekle(aktif + d);
    var liste = Object.keys(set).map(Number).sort(function(a,b){ return a - b; });
    var cikti = [];
    for(var i = 0; i < liste.length; i++){
      if(i && liste[i] - liste[i-1] > 1) cikti.push('...');
      cikti.push(liste[i]);
    }
    return cikti;
  }

  function dugme(ic, opt){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pg' + (opt.cls ? ' ' + opt.cls : '');
    b.innerHTML = ic;
    if(opt.label) b.setAttribute('aria-label', opt.label);
    if(opt.aktif){ b.classList.add('active'); b.setAttribute('aria-current','page'); }
    if(opt.kapali) b.disabled = true;
    else if(opt.git) b.addEventListener('click', function(){ git(opt.git); });
    return b;
  }

  function ciz(){
    var hepsi = cfg.liste() || [];
    var son   = toplamSayfa(hepsi.length);
    if(sayfa > son) sayfa = son;

    var bas = (sayfa - 1) * boy;
    cfg.ciz(hepsi.slice(bas, bas + boy), hepsi);

    kap.innerHTML = '';
    /* tek sayfalık sonuçta ray gösterilmez — ama özet satırı KALIR
       (Beyar: "bu pagination'un altında bir ufak boşluk ve yazı olacak") */
    if(son > 1){
      kap.appendChild(dugme('<i class="fa-solid fa-angles-left" aria-hidden="true"></i>',
        { cls:'arrow', label:'İlk sayfa',    kapali: sayfa === 1,   git:1 }));
      kap.appendChild(dugme('<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>',
        { cls:'arrow', label:'Önceki sayfa', kapali: sayfa === 1,   git: sayfa - 1 }));

      pencere(sayfa, son).forEach(function(n){
        if(n === '...'){
          var d = document.createElement('span');
          d.className = 'pg-dots'; d.textContent = '…'; d.setAttribute('aria-hidden','true');
          kap.appendChild(d); return;
        }
        kap.appendChild(dugme(String(n), { aktif: n === sayfa, git: n, label: n + '. sayfa' }));
      });

      kap.appendChild(dugme('<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>',
        { cls:'arrow', label:'Sonraki sayfa', kapali: sayfa === son, git: sayfa + 1 }));
      kap.appendChild(dugme('<i class="fa-solid fa-angles-right" aria-hidden="true"></i>',
        { cls:'arrow', label:'Son sayfa',     kapali: sayfa === son, git: son }));
    }

    var not = document.createElement('span');
    not.className = 'pagi-note';
    not.setAttribute('aria-live','polite');
    if(hepsi.length === 0){
      not.textContent = 'Sonuç yok';
    } else {
      var ilk = bas + 1, sonKayit = Math.min(bas + boy, hepsi.length);
      not.textContent = hepsi.length + ' ' + birim +
        (son > 1 ? ' · ' + ilk + '–' + sonKayit + ' gösteriliyor · sayfa ' + sayfa + ' / ' + son : '');
    }
    kap.appendChild(not);
  }

  function git(n){
    var son = toplamSayfa((cfg.liste() || []).length);
    sayfa = Math.min(Math.max(1, n), son);
    ciz();
    /* sayfa değişince listenin başına dön — kullanıcı ortada kalmasın */
    if(cfg.ust){
      var y = cfg.ust.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  }

  return { yenile: function(){ sayfa = 1; ciz(); }, git: git, ciz: ciz };
};


/* =====================================================================
   GÖRÜŞ BİLDİR ŞERİDİNİ BANNER MERKEZİNE HİZALA  (Beyar · R11/M19)
   ---------------------------------------------------------------------
   Beyar: "Görüş Bildir butonu her tarafta yukarı çekilecek, banner'ın
   merkezinin hizasında olacak."

   Öncesi CSS'te `top:50%` — VIEWPORT'un ortası. Banner yüksekliği sayfaya
   göre değişiyor (544 @1440 liste · 560 detay · 607 @1024 · 726 @390) ve
   pencere boyu da değişken; ikisi hiçbir zaman aynı yere denk gelmiyordu.
   Burada banner'ın dikey merkezi ölçülüp `--fb-top` yazılıyor.
   Şerit `position:fixed` kalıyor — kullanıcı kaydırırken yer değiştirmesi
   istenmiyor, bu yüzden ölçü scroll'da yenilenmiyor (yalnız resize/load).
   Banner taşımayan sayfada değer YAZILMAZ, CSS'teki `50%` yedeği kalır.
   ===================================================================== */
(function(){
  var BAN = '.lib-top, .fp-profil .fp-kapak, .cp-top, .kp-top, .chl-hero,' +
            '.pd-hero, .fs-top, .ol-top, .ed-top, .df-top, .au-top, .pf-banner';
  function hizala(){
    var el = document.querySelector(BAN);
    if(!el || el.getClientRects().length === 0){
      document.documentElement.style.removeProperty('--fb-top');
      return;
    }
    var r = el.getBoundingClientRect();
    var merkez = r.top + window.scrollY + r.height / 2;
    /* pencereden taşarsa kırp — yoksa düğme görünmeyen yükseklikte kalır */
    var enCok = Math.max(140, window.innerHeight - 140);
    document.documentElement.style.setProperty('--fb-top',
      Math.min(Math.max(merkez, 140), enCok).toFixed(0) + 'px');
  }
  hizala();
  window.addEventListener('resize', hizala);
  window.addEventListener('load', hizala);
})();

})();
