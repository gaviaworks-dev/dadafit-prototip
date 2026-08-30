/* =====================================================================
   FIT_ADMIN_VERI — YÖNETİM PANELİNİN OKUDUĞU ÖLÇÜLMÜŞ ANLIK GÖRÜNTÜ
   ---------------------------------------------------------------------
   🔴 BU DOSYA ELLE DÜZENLENMEZ. Üreteci: tools/admin-veri-uret.mjs
   Ölçüm tarihi: 2026-08-30

   NE OLDUĞU — ve ne OLMADIĞI
   Buradaki her satır depodan MEKANİK OLARAK okundu; hiçbiri uydurulmadı.
   Ama bu tablolar verinin KAYNAĞI DEĞİL, KOPYASIDIR. Kaynak hâlâ sayfaların
   içinde:

     HAREKET  ← egzersiz-detay-v1.html  (VERI)  + egzersiz-kutuphane-v1.html (kart)
     SOZLUK   ← egzersiz-kutuphane-v1.html süzgeç şeridi
     TEST     ← fit-testi-detay-v1.html (VERI)
     PROGRAM  ← program-liste-v1.html kartları
     PROGRAM_DETAY ← program-detay-v1.html (VERI)
     HEDEF    ← program-liste + programlar-merkezi hedef çipleri (iki ayrı ilan)
     SAYFA    ← depodaki *.html dosyalarının <title> ve <meta> etiketleri

   Kopyanın tehlikesi sessizce ayrışmaktır; bu yüzden
   `docs/qa/hareket-katalog-esitlik.mjs` tarayıcıda `window.ED_VERI` ile bu
   tabloyu karşılaştırır. Ayrışırlarsa ölçüm kırmızıya döner.

   Panel gerçek yazmayı getirdiğinde bu dosya silinir ve iki taraf da tek
   sözleşme modülünden okur. Kararın tam gerekçesi üreteç başlığındadır.
   ===================================================================== */
window.FIT_ADMIN_VERI = (function () {
  'use strict';

  var HAREKET = [
    {"slug":"bant-cekme","ad":"Bant Çekme (Band Row)","kategori":"Üst vücut · Çekiş","bolge":"Sırt & Postür","seviye":"Başlangıç","ekipman":"Direnç bandı","sure":"~6 dk","kas":"sirt","ekipmanKod":"direncbandi","lv":1,"sureBant":["10","15","20","30"],"pop":64,"birincil":["Latissimus dorsi","Rhomboid"],"ikincil":["Trapezius (orta)","Biceps","Arka deltoid"],"alternatif":["ters-sinav","dambil-kurek","yuzucu","superman"]},
    {"slug":"bant-yana-acma","ad":"Bant Yana Açma","kategori":"Omuz · İzolasyon","bolge":"Omuz","seviye":"Orta","ekipman":"Direnç bandı","sure":"~5 dk","kas":"omuz","ekipmanKod":"direncbandi","lv":2,"sureBant":["5","10","15","20"],"pop":57,"birincil":["Deltoid (orta)"],"ikincil":["Trapezius (üst)","Arka deltoid","Rhomboid"],"alternatif":["dambil-omuz-press","yuzucu","bant-cekme","superman"]},
    {"slug":"barfiks","ad":"Barfiks (Pull-up)","kategori":"Üst vücut · Kuvvet","bolge":"Sırt & Kol","seviye":"İleri","ekipman":"Barfiks barı","sure":"~8 dk","kas":"sirt","ekipmanKod":"barfiksbari","lv":3,"sureBant":["15","20","30"],"pop":86,"birincil":["Latissimus dorsi","Biceps"],"ikincil":["Trapezius (alt)","Rhomboid","Ön kol"],"alternatif":["ters-sinav","dambil-kurek","bant-cekme","superman"]},
    {"slug":"bulgar-split-squat","ad":"Bulgar Split Squat","kategori":"Alt vücut · Tek bacak","bolge":"Bacak & Kalça","seviye":"İleri","ekipman":"Ekipmansız","sure":"~8 dk","kas":"bacak","ekipmanKod":"ekipmansiz","lv":3,"sureBant":["15","20","30"],"pop":71,"birincil":["Quadriceps","Gluteus"],"ikincil":["Hamstring","Adduktor","Core"],"alternatif":["hamle","hava-squat","goblet-squat","tek-bacak-kopru"]},
    {"slug":"burpee","ad":"Burpee","kategori":"Tüm vücut · Kondisyon","bolge":"Tüm vücut","seviye":"İleri","ekipman":"Ekipmansız","sure":"~7 dk","kas":"tumvucut","ekipmanKod":"ekipmansiz","lv":3,"sureBant":["10","15","20","30"],"pop":90,"birincil":["Quadriceps","Gluteus","Pectoralis major"],"ikincil":["Deltoid","Triceps","Core"],"alternatif":["dag-tirmanisi","hava-squat","sinav","kettlebell-swing"]},
    {"slug":"dag-tirmanisi","ad":"Dağ Tırmanışı (Mountain Climber)","kategori":"Core · Kondisyon","bolge":"Karın & Core","seviye":"Orta","ekipman":"Ekipmansız","sure":"~5 dk","kas":"karin","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["5","10","15","20","30"],"pop":87,"birincil":["Rectus abdominis","İliopsoas (kalça fleksörü)"],"ikincil":["Deltoid","Quadriceps","Obliq"],"alternatif":["plank","yan-plank","burpee","dead-bug"]},
    {"slug":"dambil-biceps","ad":"Dambıl Biceps Curl","kategori":"Üst vücut · İzolasyon","bolge":"Kol","seviye":"Başlangıç","ekipman":"Dambıl","sure":"~5 dk","kas":"biceps","ekipmanKod":"dambil","lv":1,"sureBant":["15","20","30"],"pop":74,"birincil":["Biceps brachii"],"ikincil":["Brachialis","Brachioradialis (ön kol)"],"alternatif":["dambil-kurek","bant-cekme","barfiks","ters-sinav"]},
    {"slug":"dambil-gogus-press","ad":"Dambıl Göğüs Press","kategori":"Üst vücut · Kuvvet","bolge":"Göğüs & Kol","seviye":"Orta","ekipman":"Dambıl","sure":"~8 dk","kas":"gogus","ekipmanKod":"dambil","lv":2,"sureBant":["15","20","30"],"pop":82,"birincil":["Pectoralis major","Triceps"],"ikincil":["Ön deltoid","Core"],"alternatif":["sinav","dambil-omuz-press","sehpa-dips","dambil-kurek"]},
    {"slug":"dambil-kurek","ad":"Dambıl Kürek Çekme","kategori":"Üst vücut · Kuvvet","bolge":"Sırt & Postür","seviye":"Orta","ekipman":"Dambıl","sure":"~8 dk","kas":"sirt","ekipmanKod":"dambil","lv":2,"sureBant":["15","20","30"],"pop":88,"birincil":["Latissimus dorsi","Rhomboid"],"ikincil":["Trapezius (orta/alt)","Biceps","Arka deltoid"],"alternatif":["bant-cekme","ters-sinav","barfiks","yuzucu"]},
    {"slug":"dambil-omuz-press","ad":"Dambıl Omuz Press","kategori":"Üst vücut · Kuvvet","bolge":"Omuz & Kol","seviye":"Orta","ekipman":"Dambıl","sure":"~7 dk","kas":"omuz","ekipmanKod":"dambil","lv":2,"sureBant":["15","20","30"],"pop":79,"birincil":["Deltoid (ön/orta)"],"ikincil":["Triceps","Trapezius (üst)","Core"],"alternatif":["bant-yana-acma","dambil-gogus-press","sinav","sehpa-dips"]},
    {"slug":"dambil-romanya","ad":"Dambıl Romanya Deadlift","kategori":"Alt vücut · Arka zincir","bolge":"Bacak arkası & Kalça","seviye":"Orta","ekipman":"Dambıl","sure":"~8 dk","kas":"bacak","ekipmanKod":"dambil","lv":2,"sureBant":["15","20","30"],"pop":68,"birincil":["Hamstring","Gluteus"],"ikincil":["Erector spinae","Ön kol (kavrama)","Core"],"alternatif":["kettlebell-swing","kopru","tek-bacak-kopru","goblet-squat"]},
    {"slug":"dead-bug","ad":"Dead Bug (Ölü Böcek)","kategori":"Core · Kontrol","bolge":"Karın & Core","seviye":"Başlangıç","ekipman":"Ekipmansız","sure":"~5 dk","kas":"karin","ekipmanKod":"ekipmansiz","lv":1,"sureBant":["5","10","15","20"],"pop":72,"birincil":["Rectus abdominis","Transversus abdominis"],"ikincil":["Obliq","İliopsoas (kalça fleksörü)"],"alternatif":["plank","yan-plank","kopru","dag-tirmanisi"]},
    {"slug":"goblet-squat","ad":"Goblet Squat","kategori":"Alt vücut · Kuvvet","bolge":"Bacak & Kalça","seviye":"Orta","ekipman":"Dambıl / Kettlebell","sure":"~8 dk","kas":"bacak","ekipmanKod":"dambil","lv":2,"sureBant":["5","10","15","20","30"],"pop":98,"birincil":["Quadriceps","Gluteus"],"ikincil":["Hamstring","Core","Adduktor"],"alternatif":["hava-squat","bulgar-split-squat","hamle","dambil-romanya"]},
    {"slug":"hamle","ad":"Hamle (Lunge)","kategori":"Alt vücut · Denge","bolge":"Bacak & Kalça","seviye":"Başlangıç","ekipman":"Ekipmansız","sure":"~7 dk","kas":"bacak","ekipmanKod":"ekipmansiz","lv":1,"sureBant":["10","15","20","30"],"pop":83,"birincil":["Quadriceps","Gluteus"],"ikincil":["Hamstring","Adduktor","Core"],"alternatif":["bulgar-split-squat","hava-squat","goblet-squat","tek-bacak-kopru"]},
    {"slug":"hava-squat","ad":"Hava Squat (Bodyweight Squat)","kategori":"Alt vücut · Temel","bolge":"Bacak & Kalça","seviye":"Başlangıç","ekipman":"Ekipmansız","sure":"~5 dk","kas":"bacak","ekipmanKod":"ekipmansiz","lv":1,"sureBant":["5","10","15","20","30"],"pop":95,"birincil":["Quadriceps","Gluteus"],"ikincil":["Hamstring","Core","Baldır"],"alternatif":["goblet-squat","hamle","bulgar-split-squat","kopru"]},
    {"slug":"kettlebell-swing","ad":"Kettlebell Swing","kategori":"Tüm vücut · Güç","bolge":"Kalça & Arka zincir","seviye":"İleri","ekipman":"Kettlebell","sure":"~9 dk","kas":"tumvucut","ekipmanKod":"kettlebell","lv":3,"sureBant":["15","20","30"],"pop":69,"birincil":["Gluteus","Hamstring"],"ikincil":["Erector spinae","Core","Trapezius"],"alternatif":["dambil-romanya","kopru","burpee","goblet-squat"]},
    {"slug":"kopru","ad":"Köprü (Glute Bridge)","kategori":"Alt vücut · Aktivasyon","bolge":"Kalça","seviye":"Orta","ekipman":"Ekipmansız","sure":"~5 dk","kas":"kalca","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["5","10","15","20","30"],"pop":61,"birincil":["Gluteus maximus"],"ikincil":["Hamstring","Erector spinae","Core"],"alternatif":["tek-bacak-kopru","dambil-romanya","kettlebell-swing","dead-bug"]},
    {"slug":"plank","ad":"Plank (Şınav Duruşu)","kategori":"Core · İzometrik","bolge":"Karın & Core","seviye":"Orta","ekipman":"Ekipmansız","sure":"~5 dk","kas":"karin","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["5","10","15","20","30"],"pop":92,"birincil":["Rectus abdominis","Transversus abdominis"],"ikincil":["Deltoid","Gluteus","Erector spinae"],"alternatif":["yan-plank","dead-bug","dag-tirmanisi","kopru"]},
    {"slug":"sehpa-dips","ad":"Sehpa Dips (Bench Dips)","kategori":"Üst vücut · Kuvvet","bolge":"Triceps & Omuz","seviye":"Orta","ekipman":"Ekipmansız","sure":"~6 dk","kas":"triceps","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["5","10","15","20","30"],"pop":76,"birincil":["Triceps brachii"],"ikincil":["Ön deltoid","Pectoralis major (alt)"],"alternatif":["sinav","dambil-gogus-press","dambil-omuz-press","plank"]},
    {"slug":"sinav","ad":"Şınav (Push-up)","kategori":"Üst vücut · Kuvvet","bolge":"Göğüs & Omuz","seviye":"Orta","ekipman":"Ekipmansız","sure":"~6 dk","kas":"gogus","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["10","15","20","30"],"pop":85,"birincil":["Pectoralis major","Triceps"],"ikincil":["Ön deltoid","Core","Serratus anterior"],"alternatif":["dambil-gogus-press","sehpa-dips","dambil-omuz-press","plank"]},
    {"slug":"superman","ad":"Superman (Yüzüstü Uzanma)","kategori":"Sırt · Aktivasyon","bolge":"Sırt & Bel","seviye":"Başlangıç","ekipman":"Ekipmansız","sure":"~4 dk","kas":"sirt","ekipmanKod":"ekipmansiz","lv":1,"sureBant":["5","10","15","20"],"pop":63,"birincil":["Erector spinae"],"ikincil":["Gluteus","Arka deltoid","Trapezius (alt)"],"alternatif":["yuzucu","kopru","ters-sinav","dead-bug"]},
    {"slug":"tek-bacak-kopru","ad":"Tek Bacak Köprü","kategori":"Alt vücut · Tek taraf","bolge":"Kalça","seviye":"Orta","ekipman":"Ekipmansız","sure":"~6 dk","kas":"kalca","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["5","10","15","20","30"],"pop":59,"birincil":["Gluteus maximus","Gluteus medius"],"ikincil":["Hamstring","Core"],"alternatif":["kopru","bulgar-split-squat","dambil-romanya","hamle"]},
    {"slug":"ters-sinav","ad":"Ters Şınav (Inverted Row)","kategori":"Üst vücut · Çekiş","bolge":"Sırt & Postür","seviye":"Orta","ekipman":"Ekipmansız","sure":"~7 dk","kas":"sirt","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["10","15","20","30"],"pop":66,"birincil":["Latissimus dorsi","Rhomboid"],"ikincil":["Trapezius (orta/alt)","Biceps","Arka deltoid"],"alternatif":["barfiks","dambil-kurek","bant-cekme","yuzucu"]},
    {"slug":"yan-plank","ad":"Yan Plank","kategori":"Core · İzometrik","bolge":"Karın & Yan gövde","seviye":"Orta","ekipman":"Ekipmansız","sure":"~5 dk","kas":"karin","ekipmanKod":"ekipmansiz","lv":2,"sureBant":["5","10","15","20"],"pop":77,"birincil":["Obliq (iç/dış eğik karın)","Quadratus lumborum"],"ikincil":["Gluteus medius","Deltoid","Core"],"alternatif":["plank","dead-bug","dag-tirmanisi","kopru"]},
    {"slug":"yuzucu","ad":"Yüzücü (Y-T-W Kaldırış)","kategori":"Sırt · Postür","bolge":"Sırt & Omuz","seviye":"Başlangıç","ekipman":"Ekipmansız","sure":"~5 dk","kas":"sirt","ekipmanKod":"ekipmansiz","lv":1,"sureBant":["5","10","15","20"],"pop":55,"birincil":["Trapezius (orta/alt)","Rhomboid"],"ikincil":["Arka deltoid","Erector spinae"],"alternatif":["superman","bant-cekme","ters-sinav","bant-yana-acma"]}
  ];

  /* Taksonomi sözlüğü — kütüphane süzgecinde İLAN EDİLEN terimler.
     Kaç harekette kullanıldığı ilan edilmez, sayılır (admin-taksonomi). */
  var SOZLUK = {
    kas:     [
      {"kod":"gogus","ad":"Göğüs","ikon":""},
      {"kod":"sirt","ad":"Sırt","ikon":""},
      {"kod":"omuz","ad":"Omuz","ikon":""},
      {"kod":"biceps","ad":"Biceps","ikon":""},
      {"kod":"triceps","ad":"Triceps","ikon":""},
      {"kod":"onkol","ad":"Ön kol","ikon":""},
      {"kod":"karin","ad":"Karın ve gövde merkezi","ikon":""},
      {"kod":"bacak","ad":"Bacak","ikon":""},
      {"kod":"kalca","ad":"Kalça","ikon":""},
      {"kod":"tumvucut","ad":"Tüm vücut","ikon":""}
    ],
    ekipman: [
      {"kod":"ekipmansiz","ad":"Ekipmansız","ikon":"fa-solid fa-person"},
      {"kod":"dambil","ad":"Dambıl","ikon":"fa-solid fa-dumbbell"},
      {"kod":"halter","ad":"Halter","ikon":"fa-solid fa-dumbbell"},
      {"kod":"kettlebell","ad":"Kettlebell","ikon":"fa-solid fa-weight-hanging"},
      {"kod":"direncbandi","ad":"Direnç bandı","ikon":"fa-solid fa-grip-lines"},
      {"kod":"kablo","ad":"Kablo","ikon":"fa-solid fa-link"},
      {"kod":"sabitmakine","ad":"Sabit makine","ikon":"fa-solid fa-gear"},
      {"kod":"askibandi","ad":"Askı bandı","ikon":"fa-solid fa-grip-lines-vertical"},
      {"kod":"sagliktopu","ad":"Sağlık topu","ikon":"fa-solid fa-circle"},
      {"kod":"pilatestopu","ad":"Pilates topu","ikon":"fa-regular fa-circle"},
      {"kod":"step","ad":"Step","ikon":"fa-solid fa-stairs"},
      {"kod":"bench","ad":"Bench","ikon":"fa-solid fa-couch"},
      {"kod":"barfiksbari","ad":"Barfiks barı","ikon":"fa-solid fa-minus"},
      {"kod":"atlamaipi","ad":"Atlama ipi","ikon":"fa-solid fa-rotate"},
      {"kod":"foamroller","ad":"Foam roller","ikon":"fa-solid fa-scroll"}
    ],
    seviye:  [
      {"kod":"1","ad":"Başlangıç","ikon":""},
      {"kod":"2","ad":"Orta","ikon":""},
      {"kod":"3","ad":"İleri","ikon":""}
    ],
    sure:    [
      {"kod":"5","ad":"5 dk","ikon":""},
      {"kod":"10","ad":"10 dk","ikon":""},
      {"kod":"15","ad":"15 dk","ikon":""},
      {"kod":"20","ad":"20 dk","ikon":""},
      {"kod":"30","ad":"30 dk","ikon":""}
    ]
  };

  var TEST = [
    {"slug":"baslangic-seviyesi","ad":"Başlangıç Seviyesi Testi","kategori":"Genel değerlendirme","sure":"8–10 dakika","sureKisa":"8–10 dk","soru":"30 saniyede destek almadan kaç kez tam kalkıp oturdun?","ekipmanSay":4,"adimSay":5,"uygunSay":3,"uygunDegilSay":3,"bant":[{"olcut":"0–7 tekrar","lv":1,"prog":"4-hafta-ev-antrenmani"},{"olcut":"8–12 tekrar","lv":2,"prog":"4-hafta-ev-antrenmani"},{"olcut":"13 tekrar ve üzeri","lv":3,"prog":"12-hafta-guc-temeli"}]},
    {"slug":"mobilite","ad":"Mobilite Değerlendirmesi","kategori":"Hareket açıklığı","sure":"6–8 dakika","sureKisa":"~8 dk","soru":"Dizlerini bükmeden öne uzandığında ellerin nereye ulaştı?","ekipmanSay":3,"adimSay":5,"uygunSay":3,"uygunDegilSay":3,"bant":[{"olcut":"Dizlerimin üzerinde kaldı","lv":1,"prog":"8-hafta-mobilite"},{"olcut":"Baldır / ayak bileği hizasına ulaştı","lv":2,"prog":"8-hafta-mobilite"},{"olcut":"Avuç içim ayak tabanına değdi","lv":3,"prog":"12-hafta-guc-temeli"}]},
    {"slug":"denge","ad":"Denge Değerlendirmesi","kategori":"Denge ve kontrol","sure":"5–7 dakika","sureKisa":"~7 dk","soru":"Gözlerin açıkken tek ayak üstünde kaç saniye dengede kalabildin? (kısa olan taraf)","ekipmanSay":3,"adimSay":5,"uygunSay":3,"uygunDegilSay":3,"bant":[{"olcut":"10 saniyeden az","lv":1,"prog":"4-hafta-ev-antrenmani"},{"olcut":"10–29 saniye","lv":2,"prog":"4-hafta-ev-antrenmani"},{"olcut":"30 saniye ve üzeri","lv":3,"prog":"12-hafta-guc-temeli"}]},
    {"slug":"temel-kuvvet","ad":"Temel Kuvvet Değerlendirmesi","kategori":"Kuvvet","sure":"8–10 dakika","sureKisa":"8–10 dk","soru":"Seçtiğin varyasyonda formunu bozmadan kaç tekrar yaptın?","ekipmanSay":3,"adimSay":5,"uygunSay":3,"uygunDegilSay":3,"bant":[{"olcut":"0–5 tekrar","lv":1,"prog":"4-hafta-ev-antrenmani"},{"olcut":"6–14 tekrar","lv":2,"prog":"4-hafta-ev-antrenmani"},{"olcut":"15 tekrar ve üzeri","lv":3,"prog":"12-hafta-guc-temeli"}]},
    {"slug":"dayaniklilik","ad":"Dayanıklılık Değerlendirmesi","kategori":"Kalp–solunum dayanıklılığı","sure":"10–12 dakika","sureKisa":"~12 dk","soru":"Üçüncü dakikanın sonunda konuşma testinde neredeydin?","ekipmanSay":4,"adimSay":5,"uygunSay":3,"uygunDegilSay":3,"bant":[{"olcut":"Cümle kuramadım, nefesim yetmedi","lv":1,"prog":"4-hafta-ev-antrenmani"},{"olcut":"Kısa cümlelerle konuşabildim","lv":2,"prog":"12-hafta-guc-temeli"},{"olcut":"Rahatça konuşabildim","lv":3,"prog":"8-hafta-salon-kondisyon"}]},
    {"slug":"masa-basi-yasam","ad":"Masa Başı Yaşam Değerlendirmesi","kategori":"Gün içi hareket","sure":"6–8 dakika","sureKisa":"~8 dk","soru":"Ortalama bir iş gününde kaç saatini oturarak geçiriyorsun?","ekipmanSay":3,"adimSay":5,"uygunSay":3,"uygunDegilSay":3,"bant":[{"olcut":"9 saat ve üzeri","lv":1,"prog":"4-hafta-ev-antrenmani"},{"olcut":"6–8 saat","lv":2,"prog":"8-hafta-mobilite"},{"olcut":"5 saat ve altı","lv":3,"prog":"12-hafta-guc-temeli"}]},
    {"slug":"hareket-aliskanligi","ad":"Hareket Alışkanlığı Testi","kategori":"Süreklilik","sure":"5–6 dakika","sureKisa":"~6 dk","soru":"Son dört haftada haftada ortalama kaç gün en az 20 dakika hareket ettin?","ekipmanSay":3,"adimSay":5,"uygunSay":3,"uygunDegilSay":2,"bant":[{"olcut":"0–1 gün","lv":1,"prog":"4-hafta-ev-antrenmani"},{"olcut":"2–3 gün","lv":2,"prog":"4-hafta-ev-antrenmani"},{"olcut":"4 gün ve üzeri","lv":3,"prog":"12-hafta-guc-temeli"}]}
  ];

  var PROGRAM = [
    {"ad":"8 Haftalık Güç Temeli","slug":"4-hafta-ev-antrenmani","hedef":"Güç","hedefKod":"guc","hafta":8,"lv":2,"seviye":"Orta","ekipmanKod":"dambil","plan":"8 hafta · haftada 3 gün · 24 antrenman","ozet":"Dambılla kademeli güç gelişimi — hafta hafta artan, takip etmesi kolay plan.","pro":false,"pop":98},
    {"ad":"Evde HIIT","slug":"8-hafta-mobilite","hedef":"Kilo Yönetimi","hedefKod":"kilo","hafta":4,"lv":2,"seviye":"Orta","ekipmanKod":"vucut","plan":"4 hafta · haftada 4 gün · 16 antrenman","ozet":"Ekipmansız, kısa ve yoğun seanslar — küçük alanda yüksek tempo.","pro":false,"pop":94},
    {"ad":"Yeni Başlayan 4 Hafta","slug":"12-hafta-guc-temeli","hedef":"Başlangıç","hedefKod":"guc","hafta":4,"lv":1,"seviye":"Başlangıç","ekipmanKod":"vucut","plan":"4 hafta · haftada 3 gün · 12 antrenman","ozet":"Hareketle ilk tanışma, baskısız — temel form ve alışkanlık kurma.","pro":false,"pop":91},
    {"ad":"Mobilite & Esneklik","slug":"8-hafta-salon-kondisyon","hedef":"Mobilite","hedefKod":"mobilite","hafta":4,"lv":1,"seviye":"Başlangıç","ekipmanKod":"vucut","plan":"4 hafta · her gün 10 dk · 28 seans","ozet":"Eklem sağlığı ve günlük rahatlık — her gün 10 dakikalık akış.","pro":false,"pop":86},
    {"ad":"Düşük Tempo Kondisyon","slug":"4-hafta-ev-antrenmani","hedef":"Dayanıklılık","hedefKod":"dayaniklilik","hafta":8,"lv":1,"seviye":"Başlangıç","ekipmanKod":"vucut","plan":"8 hafta · haftada 3 gün · 24 antrenman","ozet":"Sürdürülebilir tempoda nefes ve dayanıklılık — zorlamadan, istikrarla.","pro":false,"pop":81},
    {"ad":"Dik Duruş Programı","slug":"8-hafta-mobilite","hedef":"Mobilite","hedefKod":"mobilite","hafta":12,"lv":2,"seviye":"Orta","ekipmanKod":"bant","plan":"12 hafta · haftada 3 gün · 36 antrenman","ozet":"Masa başı sırt ve boyun için düzeltici plan — postürü kademeli toparlar.","pro":true,"pop":76},
    {"ad":"Yağ Yakım Devresi","slug":"12-hafta-guc-temeli","hedef":"Kilo Yönetimi","hedefKod":"kilo","hafta":8,"lv":2,"seviye":"Orta","ekipmanKod":"dambil","plan":"8 hafta · haftada 4 gün · 32 antrenman","ozet":"Devre antrenmanıyla kalori yakımı — beslenme köprüsüyle birlikte ilerler.","pro":false,"pop":72},
    {"ad":"Koşuya Hazırlık 12 Hafta","slug":"8-hafta-salon-kondisyon","hedef":"Dayanıklılık","hedefKod":"dayaniklilik","hafta":12,"lv":3,"seviye":"İleri","ekipmanKod":"vucut","plan":"12 hafta · haftada 3 gün · 36 antrenman","ozet":"İlk 10K'na kademeli hazırlık — koş-yürü dengesiyle güvenli ilerleme.","pro":false,"pop":68},
    {"ad":"İleri Güç & Hacim","slug":"4-hafta-ev-antrenmani","hedef":"Güç","hedefKod":"guc","hafta":12,"lv":3,"seviye":"İleri","ekipmanKod":"dambil","plan":"12 hafta · haftada 4 gün · 48 antrenman","ozet":"Deneyimliler için periyotlanmış güç planı — hacim ve yoğunluk dönüşümlü.","pro":true,"pop":63}
  ];

  var PROGRAM_DETAY = [
    {"slug":"4-hafta-ev-antrenmani","ad":"4 Hafta Ev Antrenmanı","tur":"Hazır Program · Başlangıç"},
    {"slug":"8-hafta-mobilite","ad":"8 Hafta Mobilite Planı","tur":"Hazır Program · Başlangıç"},
    {"slug":"12-hafta-guc-temeli","ad":"12 Hafta Güç Temeli","tur":"Hazır Program · Orta · Pro"},
    {"slug":"8-hafta-salon-kondisyon","ad":"8 Hafta Salon Kondisyon","tur":"Hazır Program · İleri · Pro"}
  ];

  var HEDEF = [
    {"kod":"guc","ad":"Güç & Kondisyon","ikon":"fa-solid fa-dumbbell","kaynak":"program-liste-v1.html","kullanim":3},
    {"kod":"kilo","ad":"Kilo Yönetimi","ikon":"fa-solid fa-scale-balanced","kaynak":"program-liste-v1.html","kullanim":2},
    {"kod":"mobilite","ad":"Mobilite","ikon":"fa-solid fa-child-reaching","kaynak":"program-liste-v1.html","kullanim":2},
    {"kod":"dayaniklilik","ad":"Dayanıklılık","ikon":"fa-solid fa-heart-pulse","kaynak":"program-liste-v1.html","kullanim":2},
    {"kod":"guc","ad":"Güç","ikon":"fa-solid fa-dumbbell","kaynak":"programlar-merkezi-v1.html","kullanim":2},
    {"kod":"mobilite","ad":"Mobilite","ikon":"fa-solid fa-child-reaching","kaynak":"programlar-merkezi-v1.html","kullanim":3},
    {"kod":"kondisyon","ad":"Kondisyon","ikon":"fa-solid fa-heart-pulse","kaynak":"programlar-merkezi-v1.html","kullanim":2},
    {"kod":"aliskanlik","ad":"Hareket alışkanlığı","ikon":"fa-solid fa-seedling","kaynak":"programlar-merkezi-v1.html","kullanim":1}
  ];

  var SAYFA = [
    {"dosya":"aktivite-gunlugu-v1.html","baslik":"Aktivite Günlüğü — günlük adım, süre ve hareket kayıtların | DadaFit","aciklama":"DadaFit Aktivite Günlüğü: günlük adım, aktif süre, yürüyüş, koşu, bisiklet, mesafe ve yaklaşık enerji kullanımın tek yerde. Aktiviteni elle ekle, düzenle, sil; kaynağını ve son senkronizasyon zamanını gör.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"anatomi-v1.html","baslik":"Anatomi Haritası — DadaFit · Hangi hareket hangi kası çalıştırıyor","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"antrenman-olusturucu-v1.html","baslik":"Antrenman Oluşturucu — DadaFit · Birkaç seçimle gün gün antrenman planı","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"antrenor-detay-v1.html","baslik":"Selin Aksoy — DadaFit Onaylı Antrenör | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"antrenor-ol-v1.html","baslik":"Antrenör Ol — DadaFit Onaylı Antrenör Başvurusu | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"antrenor-panelim-v1.html","baslik":"Antrenör Panelim — Paketler, Danışanlar, Randevular ve Kazanç | DadaFit","aciklama":"DadaFit onaylı antrenörün kendi paneli: sattığın hizmet paketleri, danışanların, randevu takvimin ve hakediş defterin tek ekranda.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"antrenorler-v1.html","baslik":"Antrenörler — DadaFit Onaylı Antrenörler | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"arama-fit-v1.html","baslik":"DadaFit — Arama","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"bagli-uygulamalar-v1.html","baslik":"Bağlı Uygulamalar — sağlık ve aktivite bağlantıların | DadaFit","aciklama":"Apple Health, Android Health Connect, akıllı saat ve manuel veri girişi bağlantılarını tek yerden yönet: bağlantı durumu, verilen izinler, son senkronizasyon, hangi verinin hangi yöne aktığı ve bağlantıyı kesme.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"bildirimler-v1.html","baslik":"Bildirimler — Antrenman, Program ve Challenge Akışın | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"challenge-merkezi-v1.html","baslik":"Challenge Merkezi — DadaFit · Aktif, yaklaşan ve tamamlanan challenge'lar","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"challenge-v1.html","baslik":"Challenge — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"challengelarim-v1.html","baslik":"Challenge'larım — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"dadafit-hub-v1.html","baslik":"DadaFit — Ana Sayfa · Beslenme ve Hareket Köprüsü","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"dadafit-kopru-v1.html","baslik":"DadaFit — Enerji Köprüsü · Antrenmanını ekle, bütçeni aç","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"destek-talebi-detay-v1.html","baslik":"Destek Talebi Detayı — Yazışma ve Talep Durumu | DadaFit","aciklama":"Açtığın DadaFit destek talebinin numarası, durumu, açılış tarihi ve destek ekibiyle yazışmanın tamamı. Yanıt yazabilir, işin bittiyse talebi kapatabilirsin.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"destek-v1.html","baslik":"Destek Merkezi — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"egzersiz-detay-v1.html","baslik":"Goblet Squat — Egzersiz Detayı · Set Takibi | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"egzersiz-kutuphane-v1.html","baslik":"DadaFit Egzersizleri — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"egzersizlerim-v1.html","baslik":"Egzersizlerim — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"enerji-defteri-dengele-v1.html","baslik":"Dengele — Enerji Defteri | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"enerji-defteri-haftalik-v1.html","baslik":"Haftalık Özet — Enerji Defteri | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"enerji-defteri-su-v1.html","baslik":"Su Takibi — Enerji Defteri | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"enerji-ihtiyaci-v1.html","baslik":"Günlük Enerji İhtiyacı — DadaFit · Mifflin-St Jeor ile BMR ve TDEE tahmini","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"fit-planim-veri-izin-v1.html","baslik":"Veri ve İzinlerim — Fit Planım · DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"fit-testi-detay-v1.html","baslik":"Fit Testi Detayı — uygunluk taraması ve adım adım uygulama | DadaFit","aciklama":"Seçtiğin Fit Testinin amacı, kimler için uygun olduğu, süresi, ekipmanı ve adım adım uygulaması. Test öncesi fiziksel aktivite uygunluk taraması zorunludur; riskli yanıtta test başlamaz.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"fit-testi-sonuc-v1.html","baslik":"Fit Testi Sonucun — başlangıç seviyen ve önerilen program | DadaFit","aciklama":"Tamamladığın Fit Testinin sonuç özeti, sana uygun başlangıç seviyesi, önerilen program ve antrenöre danışma yönlendirmesi. Karşılaştırma başkasıyla değil, kendi başlangıç noktanla.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"fit-testleri-v1.html","baslik":"Fit Testleri — hareket kapasiteni ölç | DadaFit","aciklama":"DadaFit Fit Testleri: yedi değerlendirme kategorisiyle hareketliliğini, dengeni, kuvvetini ve günlük hareket alışkanlığını ölç. Sonuç uygun başlangıç seviyeni ve önerilen programı gösterir.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"giris-v1.html","baslik":"DadaFit Girişi ve Üyeliği","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hakkimizda-v1.html","baslik":"DadaFit Hakkında — Hareket, Enerji ve Denge Platformu","aciklama":"DadaFit; günlük hareketi, egzersizleri, antrenman programlarını, enerji dengesini, toparlanmayı ve antrenör desteğini tek bir deneyimde birleştiren bağımsız hareket ve sağlıklı yaşam platformudur. Hikâyemiz, değerlerimiz, ekibimiz ve künye bilgileri.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-bolgeye-gore-v1.html","baslik":"Bölgeye Göre Egzersizler — Hareket Rehberi","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-dogru-form-v1.html","baslik":"Doğru Form Rehberi — Hareket Rehberi","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-hedefe-gore-v1.html","baslik":"Hedefe Göre Hareket — Hareket Rehberi","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-isinma-soguma-v1.html","baslik":"Isınma, Soğuma ve Esneme — Hareket Rehberi","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-masa-basi-v1.html","baslik":"Masa Başı Hareketleri — Hareket Rehberi","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-rehberi-v1.html","baslik":"Hareket Rehberi — DadaFit · Doğru Hareket & Günlük Aktivite","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-sozluk-v1.html","baslik":"Hareket Sözlüğü — Hareket Rehberi","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-sureye-gore-v1.html","baslik":"Süreye Göre Hareketler — Hareket Rehberi","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hareket-yeni-baslayanlar-v1.html","baslik":"Yeni Başlayanlar İçin Hareket — Hareket Rehberi · DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"hesabim-v1.html","baslik":"Hesap Ayarları — Üyelik, Ödeme ve Güvenlik | DadaFit","aciklama":"DadaFit hesabını tek yerden yönet: profil bilgileri, bildirim tercihleri, üyelik ve paketin, ödeme geçmişin, faturaların, güvenlik, dil ve birim tercihleri, hesabı dondurma ve silme.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"iletisim-v1.html","baslik":"İletişim — Bize Ulaşın · Destek, Antrenör Başvurusu ve İş Birliği | DadaFit","aciklama":"DadaFit'e ulaş: üyelik ve hesap, program ve egzersiz içeriği, DadaFit Pro ve ödeme, antrenör başvurusu, teknik sorun, iş birliği ve reklam. Konuyu seç, mesajın doğru ekibe düşsün.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"index.html","baslik":"DadaFit — Prototip","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"mesajlarim-v1.html","baslik":"Mesajlarım — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"odemelerim-v1.html","baslik":"Ödemelerim — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"paketlerim-v1.html","baslik":"Paketlerim — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"pro-odeme-v1.html","baslik":"DadaFit Pro ödeme — aboneliğini başlat","aciklama":"DadaFit Pro aboneliğini başlat: paket özeti, dönem ve yenileme tarihleri, kart bilgileri ve onay adımı tek ekranda. Ödeme geçmişin ve faturaların hesabında tutulur.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"pro-v1.html","baslik":"DadaFit Pro — Ücretsiz, Pro ve Pro Max paketleri","aciklama":"DadaFit üyelik kademeleri: Ücretsiz, Pro ve Pro Max. Programlar, video serileri, Antrenman Oluşturucu, Enerji Defteri, ilerleme takibi ve antrenör avantajları paket paket karşılaştırılıyor.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"profil-v1.html","baslik":"Elif’in Hareket Defteri — Kullanıcı Profili · DadaFit","aciklama":"DadaFit kullanıcı profili: paylaşılan hareketler, form ipuçları, kaydedilenler, tamamlanan antrenmanlar ve rutin koleksiyonları.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"program-detay-v1.html","baslik":"4 Hafta Ev Antrenmanı · Program | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"program-liste-v1.html","baslik":"Programlar — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"programini-bul-v1.html","baslik":"Programını Bul — DadaFit · Birkaç soruyla sana uygun programa ulaş","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"programlar-merkezi-v1.html","baslik":"Programlar Merkezi — DadaFit · Programlar ve Challenge'lar tek çatı altında","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"programlarim-v1.html","baslik":"Programlarım — DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"reklam-ver-v1.html","baslik":"DadaFit Medya Kiti — Reklam, Sponsorluk ve İş Birliği","aciklama":"DadaFit medya kiti: hareket, program ve antrenör içeriklerinde reklam alanları, yerleşim senaryoları, sponsorluk paketleri ve marka iş birliği modelleri.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"rozetlerim-v1.html","baslik":"Rozetlerim — DadaFit · Rozet, puan, kademe ve liderlik","aciklama":"Kazandığın rozetler, topladığın puan, hareket yolculuğundaki basamağın ve liderlik tablosundaki sıran tek ekranda.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"saglik-bilgilendirme-v1.html","baslik":"Sağlık Bilgilendirmesi — DadaFit · Genel bilgi ile kişisel tavsiye ayrımı","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"sozluk-detay-v1.html","baslik":"Terim — Spor Sözlüğü | DadaFit","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"sozluk-v1.html","baslik":"Spor Sözlüğü — DadaFit · Antrenman dilinin A'dan Z'ye karşılığı","aciklama":"","robots":"noindex, nofollow","canonical":false},
    {"dosya":"veri-islem-kaydi-v1.html","baslik":"İşlem Kaydı — Veri ve İzinlerim · DadaFit","aciklama":"Verine kimin, ne zaman ve hangi amaçla eriştiğinin kaydı. Kendi görüntülemelerin, antrenörünün erişimleri, bağlı uygulama senkronları ve yönetim erişimleri tek listede.","robots":"noindex, nofollow","canonical":false},
    {"dosya":"yasal-v1.html","baslik":"Yasal Metinler — Kullanım, Üyelik, Gizlilik ve Veri İzinleri · DadaFit","aciklama":"DadaFit kullanım koşulları, üyelik ve iptal koşulları, gizlilik ve KVKK politikası, çerez politikası, veri ve izin politikası ile platform bilgilendirme metni tek sayfada.","robots":"noindex, nofollow","canonical":false}
  ];

  return {
    OLCUM_TARIHI: '2026-08-30',
    HAREKET: HAREKET, SOZLUK: SOZLUK, TEST: TEST,
    PROGRAM: PROGRAM, PROGRAM_DETAY: PROGRAM_DETAY, HEDEF: HEDEF, SAYFA: SAYFA,
    /* slug → hareket; alternatif bağlantıları çözmek için */
    hareket: function (slug) {
      for (var i = 0; i < HAREKET.length; i++) if (HAREKET[i].slug === slug) return HAREKET[i];
      return null;
    },
    /* slug → program detayı; katalog kartının açtığı sayfa gerçekten o mu */
    programDetay: function (slug) {
      for (var i = 0; i < PROGRAM_DETAY.length; i++) if (PROGRAM_DETAY[i].slug === slug) return PROGRAM_DETAY[i];
      return null;
    }
  };
})();
