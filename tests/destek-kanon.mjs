/* =====================================================================
   DADAFIT — DESTEK KANONU NÖBETİ  (Dalga 3 · 2026-08-26)
   ---------------------------------------------------------------------
   Kanon: docs/destek-kanonu.md (Diet pilotundan birebir kopya, K8).
   Sözleşme: docs/hesap-sozlesmesi.md §1.7 · §2.2.

   Kardeşi tests/destek-akisi.mjs AKIŞI tutuyor (iki sayfa, sekme rayı,
   kart iskeleti). Bu dosya KANONU tutuyor — ikisi ayrı nöbet:

   1  Dört genişlikte (1440/1024/768/390) yatay taşma 0 · konsol hatası 0.
   2  DÖRT DURUM: `acik · yanit-bekleyen · cozulen · kapatilan` + "Tümü".
      🔴 Hiçbir kartın data-durum'u `tumu` OLMAZ — "Tümü" bir DURUM değil bir
      GÖRÜNÜM seçimidir (kanon §6.2). Süzgeç adrese yazılır; geçersiz ya da
      ESKİ (`yanitlandi`/`kapandi`) değer sessizce "Tümü"ye düşer.
   3  Sayfalama 10/sayfa (kaynak Gastro, kanon §9/D5) · rozet 152px kolonu
      aşmıyor · h1 tek · h2 korundu.
   4  GEÇİŞ MATRİSİ EKRANDA (kanon §2.1, üye için):
      kapatilan → yalnız [Yeniden Aç] · yanıt kutusu yerine gerekçe+çıkış
      cozulen   → [Kapat] + [Yeniden Aç]
      yanit-bekleyen / acik → yalnız [Kapat]
      Üye hiçbir talebi `yanit-bekleyen`e ya da `cozulen`e SOKAMAZ.
      Yanıt yazmak topu karşı tarafa atar (kanon §3.1): cozulen → acik.
      Y8.5'in iki bloğu: "Taleplerin" 11 kalem + aktif işaretli, dört durum
      (12 → 11: Video Seansları modülü 2026-08-29'da kalktı, ona ait
      DF-2026-H9DKR6 talebi de düştü — ölçüt zayıflamadı, küme küçüldü)
      birden; "Beklerken" Çözüm Merkezi'nin altı konusuna bağlı.
   5  TALEP NUMARASI: DF-<yıl>-<6 karakter>, alfabe 30 karakter,
      I·O·S·0·1·5 YOK (kanon §5.2). Yeni talep de aynı kalıptan doğar ve
      "Açık talep" durumunda başlar. Ek dosya: TEK dosya (`multiple` yok).
   6  "Beklerken"in çapası hedefte konu kartını AÇIYOR.
   7  AKTÖR AYRIMI (Dalga 3 · Diet'in *AsSupport deseni):
      🔴 ÜYENİN TABLOSU 5 GEÇİŞTE KİLİTLİ — destek kolu eklendi diye
         üyeninki büyümüş görünemez.
      🔴 DESTEK KOLU ÜYENİNKİNE SIZMAMIŞ: destek yalnız `cozulen` yazar,
         üye `cozulen`e hiçbir durumdan giremez; destek kapatmaz/yeniden
         açmaz. Argümansız çağrı hâlâ ÜYENİN tablosuna düşer.
      🔴 Yanıtın yan etkisi simetrik: üye yazınca `acik`, destek yazınca
         `yanit-bekleyen`; kapatılan talepte ikisi de `null`.
      Ayrıca YAZIŞMA TUTARLILIĞI: `yanit-bekleyen` ve `cozulen` durumundaki
      taleplerin yazışmasında SON SÖZ destek ekibinindir; `acik` olanlarda
      son söz üyenindir. Durum, yazışmadan okunabilir olmalıdır.

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/destek-kanon.mjs                        # varsayılan 8811
     node tests/destek-kanon.mjs http://localhost:8833
   ===================================================================== */
import { chromium } from './_pw.mjs';

/* =====================================================================
 ⚠ R15'TE ATLANDI — Beyar kararı, 2026-08-29:
   "Kırmızı testleri devre dışı bırak — silme, sadece atlanacak duruma
    getir. Bir daha test güncellemesiyle uğraşma. Bir şey kırılırsa
    tarayıcıda ölç ve kanıtla, yeterli."
 ---------------------------------------------------------------------
 İDDİALAR SİLİNMEDİ, dosya olduğu gibi duruyor — yalnız koşmuyor.
 Kırmızı olma sebebi (ölçüldü, 2026-08-29):
   eski kararı kodluyor: destek-v1.html#taleplerim @1440 → HTTP null
 Yeniden açmak için:  FIT_TESTI_ZORLA=1 node tests/destek-kanon.mjs
 ===================================================================== */
if (!process.env.FIT_TESTI_ZORLA) {
  console.log('ATLANDI (R15) — eski kararı kodluyor: destek-v1.html#taleplerim @1440 → HTTP null');
  process.exit(0);
}

/* 🔴 ŞARTNAMEYE ÇEKİLDİ — Dalga 4 · §Ö (v1.10.0).
   Bu nöbet §Ö öncesi işaretlemeyi kodluyordu: satırlar `.tk-item`/`.tk-row`,
   süzgeç `.df-fchip`, rozet `.tk-badge st-*`. Şartname üçünü de değiştirdi:
   §Ö7 liste kiti `.pnl-card > .pc-body > .set-list > a.set-row` (tablo ve
   kendi satır kiti kullanılmaz) · §Ö4 süzgeç İKİNCİ `.pf-tabbar > .pf-tabs`
   ve kalemler `a.dt` · §Ö24/§Ö25 rozet `.pstat` ve DÖRT durum DÖRT ayrı
   sınıf. Ölçütler zayıflamadı, seçicileri kuralın söylediği kite taşındı. */
const BASE = process.argv[2] || 'http://localhost:8811';
const S={hub:'destek-v1.html',liste:'destek-v1.html#taleplerim',detay:'destek-talebi-detay-v1.html'};
let fail=0; const bad=m=>{fail++;console.log('  ✗ '+m)}; const ok=m=>console.log('  ✓ '+m);
const b=await chromium.launch();

async function sayfa(w){
  const ctx=await b.newContext({viewport:{width:w,height:w<600?844:1000}});
  const p=await ctx.newPage(); const hata=[];
  p.on('console',m=>{if(m.type()==='error')hata.push(m.text().slice(0,160))});
  p.on('pageerror',e=>hata.push('PAGEERROR '+e.message.slice(0,160)));
  return {ctx,p,hata};
}
const git=async(p,u)=>{const r=await p.goto(BASE+'/'+u,{waitUntil:'networkidle'});await p.waitForTimeout(400);return r};

/* ---- 1 · DÖRT GENİŞLİK: taşma + konsol ---- */
console.log('\n1 · Yatay taşma ve konsol hatası — 1440/1024/768/390');
for(const w of [1440,1024,768,390]){
  const {ctx,p,hata}=await sayfa(w);
  for(const u of [S.hub,S.liste,S.detay,S.detay+'?talep=DF-2026-Z4KMD9',S.liste+'?durum=cozulen',S.liste+'?durum=yanitlandi']){
    const r=await git(p,u); if(!r||r.status()!==200){bad(`${u} @${w} → HTTP ${r&&r.status()}`);continue}
    const t=await p.evaluate(()=>({d:document.documentElement.scrollWidth,w:window.innerWidth}));
    if(t.d>t.w) bad(`taşma @${w} ${u} → ${t.d} > ${t.w}`);
  }
  if(hata.length) bad(`konsol @${w}: ${hata.join(' | ')}`); else ok(`@${w} taşma 0 · konsol 0`);
  await ctx.close();
}

/* ---- 2 · DÖRT DURUM ---- */
console.log('\n2 · Dört durum · süzgeç · sayfalama');
{
  const {ctx,p,hata}=await sayfa(1440);
  await git(p,S.liste);
  const d=await p.evaluate(()=>{
    const li=[...document.querySelectorAll('#tkList .set-row')];
    const c={}; li.forEach(x=>{const k=x.getAttribute('data-durum');c[k]=(c[k]||0)+1});
    return {toplam:li.length,sayim:c,
      cip:[...document.querySelectorAll('#tkFilter .dt')].map(b=>b.getAttribute('data-f')),
      cipMetin:[...document.querySelectorAll('#tkFilter .dt')].map(b=>b.textContent.replace(/\s+/g,' ').trim()),
      gorunur:li.filter(x=>!x.hidden).length,
      pagi:[...document.querySelectorAll('#tkPagi .pg')].map(b=>b.textContent.trim()||b.getAttribute('aria-label')),
      not:(document.querySelector('#tkPagi .pagi-note')||{}).textContent,
      tumuDurum:li.some(x=>x.getAttribute('data-durum')==='tumu'),
      rozet:[...new Set(li.map(x=>x.querySelector('.pstat').className))],
      etiket:[...new Set(li.map(x=>x.querySelector('.pstat').textContent.trim()))]
    };
  });
  console.log('   ', JSON.stringify(d.sayim), '· görünür', d.gorunur, '· sayfa düğmeleri', JSON.stringify(d.pagi));
  console.log('    not:', d.not);
  console.log('    etiketler:', JSON.stringify(d.etiket));
  if(d.toplam!==11) bad('talep sayısı '+d.toplam+', 11 bekleniyordu');
  if(d.gorunur!==10) bad('1. sayfada '+d.gorunur+' satır, 10 bekleniyordu');
  if(d.tumuDurum) bad('bir kartın data-durum değeri "tumu" — kanon §6.2 ihlali');
  const bekCip=['tumu','acik','yanit-bekleyen','cozulen','kapatilan'];
  if(d.cip.join(',')!==bekCip.join(',')) bad('çipler '+d.cip.join(','));
  const bekEt=['Açık talep','Yanıt bekleyen','Çözülen','Kapatılan'];
  if(!bekEt.every(e=>d.etiket.includes(e))) bad('etiket eksik: '+JSON.stringify(d.etiket));
  if(!d.pagi.length) bad('sayfalama rayı basılmadı');
  if(!fail) ok('11 talep · 4 durum · 5 çip · 10/sayfa · "tumu" hiçbir kartta yok');

  /* süzgeç sayfa değişiminde korunuyor mu */
  await p.evaluate(()=>document.querySelector('#tkFilter .dt[data-f="kapatilan"]').click());
  await p.waitForTimeout(300);
  const f=await p.evaluate(()=>({url:location.search,gor:[...document.querySelectorAll('#tkList .set-row')].filter(x=>!x.hidden).length,
    not:(document.querySelector('#tkPagi .pagi-note')||{}).textContent}));
  if(f.url!=='?durum=kapatilan') bad('süzgeç adrese yazılmadı: '+f.url);
  if(f.gor!==4) bad('kapatılan süzgecinde '+f.gor+' satır, 4 bekleniyordu');
  else ok('süzgeç ?durum=kapatilan · 4 satır · '+f.not);

  /* geçersiz eski değer sessizce "tümü"ye düşer */
  await git(p,S.liste+'?durum=yanitlandi');
  const g=await p.evaluate(()=>({on:document.querySelector('#tkFilter .dt.active').getAttribute('data-f'),
    gor:[...document.querySelectorAll('#tkList .set-row')].filter(x=>!x.hidden).length}));
  if(g.on!=='tumu') bad('eski değer "yanitlandi" tümüye düşmedi: '+g.on);
  else ok('geçersiz/eski ?durum= sessizce "tumu"ya düştü ('+g.gor+' satır)');
  if(hata.length) bad('konsol: '+hata.join(' | '));
  await ctx.close();
}

/* ---- 3 · ROZET KOLONU + <h2> ---- */
console.log('\n3 · Rozet genişliği · başlık öğesi');
{
  const {ctx,p}=await sayfa(1440);
  await git(p,S.liste);
  const m=await p.evaluate(()=>{
    /* .pstat white-space:nowrap taşıyor → SARMAZ; ölçülecek olan METNİN
       152px kolona SIĞIP sığmadığıdır: scrollWidth > clientWidth taşmadır.
       Kutunun kendisi grid hücresine gerildiği için genişliği hep 152'dir,
       o yüzden kutu genişliği ölçüt DEĞİLDİR. */
    const w=[...document.querySelectorAll('#tkList .set-row:not([hidden]) .pstat')].map(b=>({t:b.textContent.trim(),w:b.scrollWidth,c:b.clientWidth,h:Math.round(b.getBoundingClientRect().height)}));
    return {rozet:w, kolon:Math.round(document.querySelector('#tkList .set-row:not([hidden])').getBoundingClientRect().width),
      h2:[...document.querySelectorAll('h2')].map(x=>x.textContent.replace(/\s+/g,' ').trim()),
      h1:document.querySelectorAll('h1').length};
  });
  const tasan=m.rozet.filter(r=>r.w>r.c); const yuk=[...new Set(m.rozet.map(r=>r.h))];
  console.log('    rozet yüksekliği:',JSON.stringify(yuk),'· 152px kolonu aşan:',tasan.length);
  if(tasan.length) bad('rozet metni 152px kolonu aşıyor: '+JSON.stringify(tasan));
  if(yuk.length!==1) bad('rozet yükseklikleri ayrışıyor (bir kısmı sarmış olabilir): '+JSON.stringify(yuk));
  if(m.h1!==1) bad('h1 sayısı '+m.h1);
  console.log('    h2:',JSON.stringify(m.h2));
  if(!fail) ok('rozet tek satır · h1 tek · h2 korundu');
  await ctx.close();
}

/* ---- 4 · YENİDEN AÇ + KAPAT + YANIT YAN ETKİSİ ---- */
console.log('\n4 · Geçiş kuralları ekranda');
{
  const {ctx,p,hata}=await sayfa(1440);
  const durumOku=()=>p.evaluate(()=>({
    durum:document.querySelector('.tk-t:not([hidden])').dataset.status,
    /* §Ö2 · banner kalktı; rozet §Ö17'nin "Talep Bilgileri" kartında. */
    rozet:document.getElementById('mBadge').textContent.trim(),
    kapat:!document.getElementById('tkCloseBtn').hidden,
    yeniden:!document.getElementById('tkReopenBtn').hidden,
    form:!document.getElementById('tkReplyForm').hidden,
    kapali:document.getElementById('tkClosedNote').classList.contains('show'),
    not:document.getElementById('tkActNote').textContent.slice(0,40)
  }));
  /* kapatılan talep */
  await git(p,S.detay+'?talep=DF-2026-Z4KMD9');
  let d=await durumOku();
  console.log('    kapatilan →',JSON.stringify(d));
  if(d.durum!=='kapatilan'||d.kapat||!d.yeniden||d.form||!d.kapali) bad('kapatılan talebin ekranı yanlış');
  else ok('kapatilan: yanıt kutusu kapalı · gerekçe+çıkış blok · [Yeniden Aç] tek düğme');
  /* yeniden aç */
  await p.evaluate(()=>document.getElementById('tkReopenInline').click());
  await p.waitForTimeout(400);
  const mo=await p.evaluate(()=>({b:document.getElementById('tkModalTitle').textContent,
    y:document.getElementById('tkModalYes').textContent.trim()}));
  if(!/yeniden aç/i.test(mo.b)) bad('yeniden aç penceresi yanlış: '+mo.b);
  await p.evaluate(()=>document.getElementById('tkModalYes').click());
  await p.waitForTimeout(500);
  d=await durumOku();
  console.log('    yeniden açıldı →',JSON.stringify(d));
  if(d.durum!=='acik'||!d.kapat||d.yeniden||!d.form||d.kapali) bad('yeniden açma sonrası ekran yanlış');
  else ok('yeniden aç → acik · yanıt kutusu açıldı · sistem satırı düştü');
  const sys=await p.evaluate(()=>[...document.querySelectorAll('.tk-t:not([hidden]) .is-sys')].map(x=>x.textContent.replace(/\s+/g,' ').trim()));
  console.log('    sistem satırları:',JSON.stringify(sys));

  /* cozulen: iki düğme */
  await git(p,S.detay+'?talep=DF-2026-K7WQ9M');
  d=await durumOku();
  console.log('    cozulen →',JSON.stringify(d));
  if(d.durum!=='cozulen'||!d.kapat||!d.yeniden||!d.form) bad('cozulen ekranı yanlış');
  else ok('cozulen: [Kapat] + [Yeniden Aç] birlikte · yanıt kutusu açık');

  /* yanıt yazınca cozulen → acik */
  await p.evaluate(()=>{const t=document.getElementById('tkReply');t.value='Aynı sorunu bugün tekrar gördüm, seans yine kilitli açıldı.';t.dispatchEvent(new Event('input'))});
  await p.evaluate(()=>document.getElementById('tkReplyForm').dispatchEvent(new Event('submit',{cancelable:true})));
  await p.waitForTimeout(400);
  d=await durumOku();
  if(d.durum!=='acik') bad('yanıt yazınca cozulen→acik olmadı: '+d.durum);
  else ok('kanon §3.1 · yanıt yazmak topu karşı tarafa attı: cozulen → acik');

  /* yanit-bekleyen */
  await git(p,S.detay+'?talep=DF-2026-QW3JZ8');
  d=await durumOku();
  if(d.durum!=='yanit-bekleyen'||!d.kapat||d.yeniden) bad('yanit-bekleyen ekranı yanlış: '+JSON.stringify(d));
  else ok('yanit-bekleyen: yalnız [Kapat] · üye cozulen/yanit-bekleyen\'e SOKAMIYOR');

  /* taleplerin: aktif işaretli, 11 kalem, 4 durum */
  const yan=await p.evaluate(()=>{
    /* `.tk-card` KALKTI (2026-08-29): talep detayının beş kartı kitin
       `.pnl-card`ına çekildi (docs/fit-kit.md §2 — sayfa tek kart
       sözlüğü taşısın diye). Seçici kit adına güncellendi. */
    const a=[...document.querySelectorAll('.pnl-card .tk-others a[href*="?talep="]')];
    return {n:a.length,aktif:a.filter(x=>x.getAttribute('aria-current')==='page').map(x=>x.getAttribute('href')),
      durumlar:[...new Set(a.map(x=>x.querySelector('.ot span').textContent.split('·')[1].trim()))],
      beklerken:[...document.querySelectorAll('.tk-others a[href^="destek-v1.html#konu-"]')].length};
  });
  console.log('    Taleplerin:',yan.n,'· aktif:',JSON.stringify(yan.aktif),'· durumlar:',JSON.stringify(yan.durumlar),'· Beklerken:',yan.beklerken);
  if(yan.n!==11) bad('Taleplerin '+yan.n+' kalem');
  if(yan.aktif.length!==1) bad('aktif talep işareti '+yan.aktif.length);
  if(yan.durumlar.length!==4) bad('Taleplerin dört durumu göstermiyor');
  /* 6 → 5: Video Seansları modülü 2026-08-29'da kalktı, Çözüm Merkezi'nin
     "Video seansları" konu akordeonu ve ona giden çapraz geçiş de düştü. */
  if(yan.beklerken!==5) bad('Beklerken '+yan.beklerken+' konu');
  if(hata.length) bad('konsol: '+hata.join(' | '));
  await ctx.close();
}

/* ---- 5 · TALEP NUMARASI + EK DOSYA ---- */
console.log('\n5 · Talep numarası kalıbı ve ek dosya alanı');
{
  const {ctx,p,hata}=await sayfa(1440);
  await git(p,S.liste);
  const ALF='ABCDEFGHJKLMNPQRTUVWXYZ2346789';
  const nums=await p.evaluate(()=>[...document.querySelectorAll('#tkList .set-row')].map(x=>x.getAttribute('data-no')));
  const kotu=nums.filter(n=>!/^DF-2026-[A-Z0-9]{6}$/.test(n)||[...n.slice(8)].some(c=>!ALF.includes(c)));
  if(kotu.length) bad('kalıba uymayan numara: '+kotu.join(', ')); else ok('11 numaranın 11\'i DF-2026-<6 karakter>, I·O·S·0·1·5 yok');
  /* yeni talep gönder */
  await p.evaluate(()=>{
    /* Kategori "Video seansları" idi; modül kalkınca o seçenek de kalktı
       ve boş `value` doğrulamayı düşürüyordu. Var olan bir kategoriye
       çevrildi — ölçüt aynı: yeni talep "Açık talep" doğuyor mu. */
    document.getElementById('tkKategori').value='Uygulama hatası';
    document.getElementById('tkBaslik').value='Program listesi boş görünüyor';
    document.getElementById('tkMesaj').value='Programlar sayfasında liste bugün boş açılıyor, süzgeci sıfırlasam da değişmiyor.';
  });
  await p.evaluate(()=>document.getElementById('tkForm').dispatchEvent(new Event('submit',{cancelable:true})));
  await p.waitForTimeout(400);
  const y=await p.evaluate(()=>({no:document.querySelector('#tkList .set-row').getAttribute('data-no'),
    durum:document.querySelector('#tkList .set-row').getAttribute('data-durum'),
    rozet:document.querySelector('#tkList .set-row .pstat').textContent.trim(),
    toplam:document.querySelectorAll('#tkList .set-row').length,
    not:(document.querySelector('#tkPagi .pagi-note')||{}).textContent}));
  console.log('    yeni talep:',JSON.stringify(y));
  if(!/^DF-2026-[ABCDEFGHJKLMNPQRTUVWXYZ2346789]{6}$/.test(y.no)) bad('üretilen numara kalıp dışı: '+y.no);
  if(y.durum!=='acik'||y.rozet!=='Açık talep') bad('yeni talep "Açık talep" doğmadı');
  else ok('yeni talep '+y.no+' · "Açık talep" · toplam '+y.toplam);
  const ek=await p.evaluate(()=>{
    const i=document.getElementById('tkEk');
    return {var:!!i,accept:i&&i.getAttribute('accept'),multiple:i&&i.hasAttribute('multiple'),
      metin:(document.getElementById('tkEkHelp')||{}).textContent.replace(/\s+/g,' ').trim()};
  });
  console.log('    ek dosya:',JSON.stringify(ek));
  if(!ek.var||ek.multiple) bad('ek dosya alanı yok ya da çoklu');
  else ok('ek dosya: tek dosya · '+ek.accept);
  if(hata.length) bad('konsol: '+hata.join(' | '));
  await ctx.close();
}

/* ---- 6 · ÇÖZÜM MERKEZİ ÇAPASI ---- */
console.log('\n6 · "Beklerken" çapası hedefte kartı açıyor mu');
{
  const {ctx,p,hata}=await sayfa(1440);
  await git(p,S.hub+'#konu-saglik');
  const a=await p.evaluate(()=>{
    const q=document.getElementById('konu-saglik');
    return {acik:q&&q.classList.contains('open'),
      digerAcik:[...document.querySelectorAll('.qa.open')].length,
      h1:document.querySelector('h1').textContent.trim(),
      sekme:[...document.querySelectorAll('.pf-tabs .dt')].map(x=>x.textContent.replace(/\s+/g,' ').trim())};
  });
  console.log('   ',JSON.stringify(a));
  if(!a.acik||a.digerAcik!==1) bad('çapa kartı açmadı');
  else ok('#konu-saglik açıldı, tek kart açık · h1 "'+a.h1+'"');
  if(hata.length) bad('konsol: '+hata.join(' | '));
  await ctx.close();
}

/* ---- 7 · AKTÖR AYRIMI + YAZIŞMA TUTARLILIĞI ---- */
console.log('\n7 · Aktör ayrımı (ÜYE / DESTEK) ve yazışmanın durumu doğrulaması');
{
  const {ctx,p,hata}=await sayfa(1440);
  await git(p,S.detay);
  const t=await p.evaluate(()=>{
    const F=window.FIT_DESTEK; if(!F) return null;
    const say=o=>Object.values(o).reduce((a,v)=>a+v.length,0);
    const uye=F.gecisler('uye'), destek=F.gecisler('destek');
    return {
      uyeTablo:uye, destekTablo:destek,
      uyeToplam:say(uye), destekToplam:say(destek),
      varsayilanUyeMi:JSON.stringify(F.gecisler())===JSON.stringify(uye),
      uyeCozulenYazabilirMi:Object.keys(uye).some(k=>uye[k].includes('cozulen')),
      destekKapatirMi:Object.keys(destek).some(k=>destek[k].includes('kapatilan')),
      destekYenidenAcarMi:Object.keys(destek).some(k=>destek[k].includes('acik')),
      yanEtki:{
        uye:['acik','yanit-bekleyen','cozulen','kapatilan'].map(d=>F.yanitEtkisi('uye',d)),
        destek:['acik','yanit-bekleyen','cozulen','kapatilan'].map(d=>F.yanitEtkisi('destek',d))
      }
    };
  });
  if(!t){ bad('window.FIT_DESTEK tutamağı yok — destek kolu ölçülemiyor'); }
  else {
    console.log('    üye toplam',t.uyeToplam,'· destek toplam',t.destekToplam,
                '· varsayılan üye mi:',t.varsayilanUyeMi);
    console.log('    yan etki üye   :',JSON.stringify(t.yanEtki.uye));
    console.log('    yan etki destek:',JSON.stringify(t.yanEtki.destek));
    if(t.uyeToplam!==5) bad(`ÜYE TABLOSU BÜYÜDÜ: ${t.uyeToplam} geçiş, kanon §2.1 beş diyor`);
    const bekUye={'acik':['kapatilan'],'yanit-bekleyen':['kapatilan'],'cozulen':['kapatilan','acik'],'kapatilan':['acik']};
    if(JSON.stringify(t.uyeTablo)!==JSON.stringify(bekUye)) bad('üye tablosu kanon §2.1 ile birebir değil: '+JSON.stringify(t.uyeTablo));
    if(!t.varsayilanUyeMi) bad('argümansız çağrı üyenin tablosuna düşmüyor');
    if(t.uyeCozulenYazabilirMi) bad('🔴 ÜYE cozulen yazabiliyor — "çözüldü" beyanı destek ekibinindir');
    if(t.destekToplam!==2) bad(`destek kolu ${t.destekToplam} geçiş, 2 bekleniyordu (acik→cozulen · yanit-bekleyen→cozulen)`);
    if(t.destekKapatirMi) bad('🔴 destek kolu kapatabiliyor — kapatma ÜYENİN fiilidir');
    if(t.destekYenidenAcarMi) bad('🔴 destek kolu yeniden açabiliyor — o da üyenin fiilidir');
    if(JSON.stringify(t.yanEtki.uye)!==JSON.stringify(['acik','acik','acik',null])) bad('üye yanıt yan etkisi yanlış');
    if(JSON.stringify(t.yanEtki.destek)!==JSON.stringify(['yanit-bekleyen','yanit-bekleyen','yanit-bekleyen',null])) bad('destek yanıt yan etkisi yanlış');
    if(!fail) ok('üye 5\'te kilitli · destek 2 · sızma yok · yan etki simetrik · kapatılanda ikisi de null');
  }
  /* yazışma, durumu doğruluyor mu */
  const tut=await p.evaluate(()=>[...document.querySelectorAll('.tk-t')].map(t=>{
    const ms=[...t.querySelectorAll('.bub-list > .bub')];
    const son=ms.filter(m=>!m.classList.contains('is-sys')).pop();
    return {no:t.dataset.tk,durum:t.dataset.status,
      /* §Ö20 · gönderen ayrımı sınıfı: gelen '.bub.in' (destek ekibi),
         giden '.bub.out' (üye). Eski 'is-team'/'is-me' adları kalktı. */
      sonSoz:son&&son.classList.contains('in')?'destek':'uye',
      sonSatir:ms[ms.length-1].classList.contains('is-sys')
        ? ms[ms.length-1].textContent.replace(/\s+/g,' ').trim().split('·')[0].trim() : null};
  }));
  const yanlis=tut.filter(x=>
    ((x.durum==='yanit-bekleyen'||x.durum==='cozulen') && x.sonSoz!=='destek') ||
    (x.durum==='acik' && x.sonSoz!=='uye'));
  const cozSys=tut.filter(x=>x.durum==='cozulen'&&!/Destek ekibi/.test(x.sonSatir||''));
  const kapSys=tut.filter(x=>x.durum==='kapatilan'&&!/kapattın/.test(x.sonSatir||''));
  console.log('    durum→son söz:',JSON.stringify(tut.map(x=>x.durum+':'+x.sonSoz)));
  if(yanlis.length) bad('durumu yazışmasıyla çelişen talep: '+JSON.stringify(yanlis));
  else ok('11 talebin 11\'inde durum yazışmadan okunuyor (yanit-bekleyen/cozulen → son söz destekte, acik → üyede)');
  if(cozSys.length) bad('cozulen talepte destek beyanı sistem satırı yok: '+JSON.stringify(cozSys.map(x=>x.no)));
  else ok('cozulen taleplerde "Destek ekibi ... çözüldü olarak işaretledi" satırı var — destek kolunun görünür izi');
  if(kapSys.length) bad('kapatilan talepte kapatma satırı yok');
  if(hata.length) bad('konsol: '+hata.join(' | '));
  await ctx.close();
}

await b.close();
console.log('\n'+'='.repeat(58));
console.log(fail? `✗ ${fail} SORUN` : '✓ QA TEMİZ');
process.exit(fail?1:0);
