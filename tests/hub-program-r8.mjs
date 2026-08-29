/* =====================================================================
   DADAFIT — R8 / AJAN-E NÖBETİ  (hub · program · testler · hakkımızda)
   ---------------------------------------------------------------------
   REVİZYON 8 kalem 21–33'ün ölçülebilir olanlarını kilitler. Her ölçüt
   bir SAYI ya da ikili sonuç üretir; hiçbiri "var mı yok mu" değil.

   Taban commit 654f353'te bu dosyanın KIRMIZI dönmesi beklenir (K27) —
   ölçütlerin hepsi o commit'te ölçülmüş ve başarısız olduğu doğrulanmış
   değerlerdir.

   Çalıştırma:
     node tests/hub-program-r8.mjs                 # http://localhost:8811
     node tests/hub-program-r8.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE = process.argv[2] || 'http://localhost:8811';
let hata = 0, gecti = 0;
const ok  = (m) => { gecti++; console.log('  ✓ ' + m); };
const ng  = (m) => { hata++;  console.log('  ✗ ' + m); };
const esit= (a,b,m) => (a===b ? ok(`${m} — ${a}`) : ng(`${m} — beklenen ${b}, ölçülen ${a}`));
const enAz= (a,b,m) => (a>=b  ? ok(`${m} — ${a} ≥ ${b}`) : ng(`${m} — ${a} < ${b}`));

/* Bağlantı hedefleri HTTP ile değil, HEDEF SAYFANIN h1'iyle doğrulanır. */
const H1_KAYDI = {
  'antrenman-olusturucu-v1.html': 'Birkaç seçimle gün gün antrenman planı',
  'program-liste-v1.html'       : 'Hedefini seç, plan seni adım adım taşısın'
};

const browser = await chromium.launch();

async function sayfa(width){
  const ctx = await browser.newContext({ viewport:{ width, height: width<600?844:900 } });
  const p = await ctx.newPage();
  p.__dortyuz = [];
  p.on('response', r => { if(r.status()>=400) p.__dortyuz.push(r.status()+' '+r.url()); });
  return { ctx, p };
}
const git = async (p,u) => { await p.goto(BASE+'/'+u, { waitUntil:'networkidle' }); await p.waitForTimeout(260); };

/* ==================================================================
   21 · dadafit-hub · arama inputu SAĞDA ve filtre satırıyla aynı hizada
   ================================================================== */
console.log('\n21 · hub arama/filtre hizası');
{
  const { ctx, p } = await sayfa(1440);
  await git(p,'dadafit-hub-v1.html');
  const r = await p.evaluate(() => {
    const s=document.querySelector('#kutuphane .df-search'), f=document.querySelector('#kutuphane .df-filterbar');
    if(!s||!f) return {yok:1, s:!!s, f:!!f};
    const rs=s.getBoundingClientRect(), rf=f.getBoundingClientRect();
    /* içerik kolonunun sağ kenarı = kart ızgarasının sağ kenarı (wrap'in
       DOLGU kutusu değil; .wrap yatay padding taşır) */
    const kolon=document.querySelector('#kutuphane .hub-grid').getBoundingClientRect();
    /* İKİ OKUMA BİRDEN ölçülür (lead'in −13 px'inin cevabı):
       (A) Beyar'ın adlandırdığı iki eleman — arama KUTUSU ve filtre SATIRI
       (C) gözün gerçekten okuduğu şey — input metni ile "Seviye:" metninin
           dikey ORTASI. Üst kenar farkı (B) 13 px'tir ama bu hizasızlık
           değil: 20 px'lik etiket 48 px'lik satırda dikey ortalanıyor. */
    const inp=document.querySelector('#dfSearchInput');
    const lbl=document.querySelector('#kutuphane .df-filterbar .lbl');
    const M=e=>{const r=e.getBoundingClientRect();return Math.round(r.top+r.height/2)};
    return { ustFark:Math.round(rf.top-rs.top),
             optikFark: M(lbl)-M(inp),
             aramaSagKenar:Math.round(rs.right), wrapSagKenar:Math.round(kolon.right),
             aramaSolda: rs.left < rf.left,
             tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  if(r.yok){ ng(`seçici bulunamadı (.df-search=${r.s} .df-filterbar=${r.f})`); }
  else {
    esit(r.ustFark, 0, '@1440 arama KUTUSU ile filtre SATIRI üst kenarı aynı y\'de (fark px)');
    esit(r.optikFark, 0, '@1440 input metni ile "Seviye:" metninin dikey ortası aynı (fark px)');
    esit(r.aramaSagKenar, r.wrapSagKenar, '@1440 arama kutusu içerik kolonunun sağ kenarında');
    esit(r.aramaSolda, false, '@1440 arama filtrenin SOLUNDA değil (sağda)');
    esit(r.tasma, 0, '@1440 yatay taşma');
  }
  await ctx.close();
}
{
  const { ctx, p } = await sayfa(390);
  await git(p,'dadafit-hub-v1.html');
  const r = await p.evaluate(() => {
    const s=document.querySelector('#kutuphane .df-search'), f=document.querySelector('#kutuphane .df-filterbar');
    const rs=s.getBoundingClientRect(), rf=f.getBoundingClientRect();
    /* DOM sırası: .df-filterbar önce, .df-search sonra */
    const domSira = [...s.parentElement.children].indexOf(f) < [...s.parentElement.children].indexOf(s);
    return { altAlta: rs.top >= rf.bottom - 1 || rf.top >= rs.bottom - 1,
             gorselSiraDomIle: domSira ? (rf.top <= rs.top) : (rs.top <= rf.top),
             tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  esit(r.altAlta, true, '@390 arama ile filtre alt alta (üst üste binmiyor)');
  esit(r.gorselSiraDomIle, true, '@390 görsel sıra = DOM sırası (ekran okuyucu ile gören aynı sırayı alıyor)');
  esit(r.tasma, 0, '@390 yatay taşma');
  await ctx.close();
}

/* ==================================================================
   22 · "Köprü İş Başında" üst etiketinde DadaGastro amblemi
   ================================================================== */
console.log('\n22 · DadaGastro amblemi');
for(const W of [1440,390]){
  const { ctx, p } = await sayfa(W);
  await git(p,'dadafit-hub-v1.html');
  const r = await p.evaluate(() => {
    const m=document.querySelector('.dg-mark');
    if(!m) return {yok:1};
    const eb=m.closest('.eyebrow');
    const sec=eb.closest('section');
    const kardes=[...document.querySelectorAll('.sec-head .eyebrow')].filter(e=>e!==eb);
    const secIci=e=>Math.round(e.getBoundingClientRect().top - e.closest('section').getBoundingClientRect().top);
    const h2=sec.querySelector('.sec-head h2');
    return { erisilebilirAd: (m.getAttribute('aria-label')||'').length>0,
             yerTutucu: m.getAttribute('data-yer-tutucu'),
             renk: getComputedStyle(m).color,
             etiketMetni: eb.textContent.replace(/\s+/g,' ').trim(),
             secIciUst: secIci(eb),
             kardesUst: [...new Set(kardes.map(secIci))],
             h2Ara: Math.round(h2.getBoundingClientRect().top - eb.getBoundingClientRect().bottom),
             tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  if(r.yok) ng(`@${W} .dg-mark bulunamadı`);
  else {
    esit(r.erisilebilirAd, true, `@${W} amblemin erişilebilir adı var`);
    esit(r.yerTutucu, 'dadagastro-amblemi', `@${W} data-yer-tutucu işareti`);
    esit(r.renk, 'rgb(225, 72, 39)', `@${W} DadaGastro marka rengi (#E14827)`);
    esit(r.etiketMetni.includes('Köprü İş Başında'), true, `@${W} etiket metni korundu`);
    esit(r.kardesUst.length===1 && r.kardesUst[0]===r.secIciUst, true,
         `@${W} eyebrow hizası kardeşlerle aynı (section içi üst = ${r.secIciUst})`);
    esit(r.h2Ara, 14, `@${W} eyebrow → h2 arası (ev standardı 14)`);
    esit(r.tasma, 0, `@${W} yatay taşma`);
  }
  esit(p.__dortyuz.length, 0, `@${W} 4xx isteği`);
  await ctx.close();
}

/* ==================================================================
   23 · antrenman-olusturucu · dikkat durumu kırmızı + İKİNCİ İŞARET
   ================================================================== */
console.log('\n23 · dikkat durumu vurgusu');
{
  const { ctx, p } = await sayfa(1440);
  await git(p,'antrenman-olusturucu-v1.html');
  /* riskli seçeneğin bulunduğu adıma kadar ilerle */
  const tikla = async (sel) => {
    try { const e = await p.$(sel); if(!e) return false;
          await e.click({ timeout: 2500 }); return true; }
    catch { return false; }          /* taban ağacında görünmeyebilir — çökme yerine devam */
  };
  for(let i=0;i<8;i++){
    if(await p.$('.wg-opt[data-risk="1"]')) break;
    await tikla('.wg-opt:not([aria-pressed="true"])');
    await tikla('#wgNext, .wg-next, [data-ileri]');
    await p.waitForTimeout(220);
  }
  const r = await p.evaluate(() => {
    const rs=[...document.querySelectorAll('.wg-opt[data-risk="1"]')];
    if(!rs.length) return {yok:1};
    /* kural verisiyle karşılaştır — sunumda ikinci liste tutulmadığının kanıtı */
    const kuralSayisi = (window.AO_KURALLAR && window.AO_KURALLAR.riskli || []).length;
    rs[0].click();
    const cs=getComputedStyle(rs[0]);
    const b=rs[0].querySelector('b');
    const rozet=rs[0].querySelector('.wg-dikkat');
    const risksiz=document.querySelector('.wg-opt:not([data-risk])');
    return { sayi:rs.length, kuralSayisi,
      kenarlik:cs.borderTopColor, zemin:cs.backgroundColor,
      baslikRenk:getComputedStyle(b).color,
      rozetMetni:rozet?rozet.textContent.trim():null,
      rozetIkon:rozet?!!rozet.querySelector('i'):false,
      solSerit:/inset/.test(cs.boxShadow) && /4px/.test(cs.boxShadow),
      risksizKenarlik:risksiz?getComputedStyle(risksiz).borderTopColor:null };
  });
  if(r.yok) ng('riskli seçenek (data-risk="1") bulunamadı');
  else {
    esit(r.sayi, r.kuralSayisi, 'riskli seçenek sayısı KURALLAR.riskli ile birebir');
    esit(r.kenarlik, 'rgb(163, 43, 16)', 'seçili riskli seçeneğin kenarlığı #A32B10');
    esit(r.zemin, 'rgb(255, 245, 242)', 'seçili riskli seçeneğin zemini #FFF5F2 (kontrast 6.73:1)');
    esit(r.baslikRenk, 'rgb(140, 36, 9)', 'başlık rengi #8C2409 (kontrast 8.26:1 · AAA)');
    /* İKİNCİ İŞARET — renk körlüğü: renk tek başına taşımıyor */
    esit(r.rozetMetni, 'Dikkat', 'ikinci işaret 1: görünür "Dikkat" rozeti');
    esit(r.rozetIkon, true, 'ikinci işaret 2: rozette uyarı ikonu');
    esit(r.solSerit, true, 'ikinci işaret 3: 4px sol şerit iç gölgesi');
    esit(r.risksizKenarlik!=='rgb(163, 43, 16)', true, 'risksiz seçenek kırmızıya boyanmıyor');
  }
  await ctx.close();
}

/* ==================================================================
   24 · antrenman oluşturucu ana sayfada ÖNİZLEME olarak var
   ================================================================== */
console.log('\n24 · hub\'da oluşturucu önizlemesi');
{
  const { ctx, p } = await sayfa(1440);
  await git(p,'dadafit-hub-v1.html');
  const r = await p.evaluate(() => {
    const sec=document.querySelector('#olusturucu');
    if(!sec) return {yok:1};
    const bag=[...sec.querySelectorAll('a[href="antrenman-olusturucu-v1.html"]')];
    return { adim:[...sec.querySelectorAll('.ao-steps li')].length,
             ornekGun:[...sec.querySelectorAll('.ao-gun')].length,
             bagSayi:bag.length, href:bag[0]?bag[0].getAttribute('href'):null,
             kabukDisi: !sec.closest('header') && !sec.closest('footer'),
             tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  if(r.yok) ng('#olusturucu önizleme bölümü yok');
  else {
    esit(r.kabukDisi, true, 'önizleme sayfa gövdesinde (kabuk menüsünde değil)');
    enAz(r.bagSayi, 1, 'oluşturucuya giden gövde bağlantısı sayısı');
    esit(r.adim, 5, 'önizlemedeki adım sayısı (motorun ADIMLAR uzunluğu)');
    esit(r.ornekGun, 4, 'örnek çıktıdaki gün sayısı (KURALLAR.bolunme["4"])');
    esit(r.tasma, 0, 'yatay taşma');
    /* HEDEF kontrol — HTTP değil, hedef sayfanın h1'i */
    const res = await p.goto(BASE+'/'+r.href, {waitUntil:'domcontentloaded'});
    esit(res.status(), 200, 'hedef HTTP durumu');
    const h1 = await p.$eval('h1', e=>e.textContent.trim());
    esit(h1, H1_KAYDI['antrenman-olusturucu-v1.html'], 'HEDEF h1 beklenen kayıtla eşleşiyor');
  }
  await ctx.close();
}

/* ==================================================================
   25 · "Tüm Programlar" hedefi
   ================================================================== */
console.log('\n25 · "Tüm Programlar" hedefi');
{
  const { ctx, p } = await sayfa(1440);
  await git(p,'dadafit-hub-v1.html');
  const href = await p.evaluate(() => {
    const a=[...document.querySelectorAll('#programlar a')].find(x=>/Tüm Programlar/.test(x.textContent));
    return a?a.getAttribute('href'):null;
  });
  esit(href, 'program-liste-v1.html', 'hub §programlar "Tüm Programlar" hedefi');
  if(href){
    const res=await p.goto(BASE+'/'+href,{waitUntil:'domcontentloaded'});
    esit(res.status(), 200, 'hedef HTTP durumu');
    const h1=await p.$eval('h1',e=>e.textContent.trim());
    esit(h1, H1_KAYDI['program-liste-v1.html'], 'HEDEF h1 beklenen kayıtla eşleşiyor');
  }
  await ctx.close();
}

/* ==================================================================
   26 · program-detay · "Genel Bakış" etiketi başlığa yapışık değil
   27 · #pgWrap kart bandı nefes alıyor
   ================================================================== */
console.log('\n26 + 27 · program-detay etiket ve kart nefesi');
for(const W of [1440,390]){
  const { ctx, p } = await sayfa(W);
  await git(p,'program-detay-v1.html');
  const r = await p.evaluate(() => {
    const eb=document.querySelector('.pd-over-main .eyebrow');
    const h2=document.querySelector('.pd-over-main h2');
    const kart=document.querySelector('#pgWrap .fp-card');
    const hero=document.querySelector('.pd-hero');
    const sonraki=document.querySelector('#genel-bakis');
    const sm=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sec-pad-sm'));
    const R=e=>{const b=e.getBoundingClientRect();return {u:b.top+scrollY,a:b.bottom+scrollY};};
    return { ebVar:!!eb, kartVar:!!kart,
      etiketAra: (eb&&h2)?Math.round(R(h2).u-R(eb).a):null,
      kartUst: (kart&&hero)?Math.round(R(kart).u-R(hero).a):null,
      kartAlt: (kart&&sonraki)?Math.round(R(sonraki).u-R(kart).a):null,
      secPadSm: sm,
      tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  if(!r.ebVar) ng(`@${W} .pd-over-main .eyebrow yok`);
  else esit(r.etiketAra, 14, `@${W} "Genel Bakış" etiketi ↔ başlık arası (kardeş değeri 14)`);
  if(!r.kartVar) ng(`@${W} #pgWrap .fp-card yok`);
  else {
    enAz(r.kartUst, r.secPadSm, `@${W} #pgWrap kart ÜST nefesi ≥ --sec-pad-sm`);
    enAz(r.kartAlt, r.secPadSm, `@${W} #pgWrap kart ALT nefesi ≥ --sec-pad-sm`);
  }
  esit(r.tasma, 0, `@${W} yatay taşma`);
  await ctx.close();
}

/* ==================================================================
   28 · fit-testleri · info altta ve içerik genişliğinde, divider yok
   ================================================================== */
console.log('\n28 · fit-testleri sağlık notu + divider');
for(const W of [1440,390]){
  const { ctx, p } = await sayfa(W);
  await git(p,'fit-testleri-v1.html');
  const r = await p.evaluate(() => {
    const sec=document.querySelectorAll('main.page-main > section')[1];
    const kids=[...sec.querySelector('.wrap').children];
    const not=sec.querySelector('.hr-note');
    const grid=document.querySelector('#ftGrid');
    const cnt=document.querySelector('.ff-bar .ff-count');
    const cs=cnt?getComputedStyle(cnt,'::before'):null;
    return { notIndeks:kids.indexOf(not), sonIndeks:kids.length-1,
      notKutuG:Math.round(not.getBoundingClientRect().width),
      gridG:Math.round(grid.getBoundingClientRect().width),
      notPG:Math.round(not.querySelector('p').getBoundingClientRect().width),
      dividerVar: !!(cs && cs.content!=='none' && parseFloat(cs.width)>0),
      tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  esit(r.notIndeks, r.sonIndeks, `@${W} sağlık notu DOM sırasında SONDA`);
  esit(r.notKutuG - r.gridG, 0, `@${W} not genişliği = içerik kolonu (fark px)`);
  enAz(r.notPG, Math.round(r.gridG*0.7), `@${W} not paragrafı kutuyu dolduruyor (--measure kapağı kalktı)`);
  esit(r.dividerVar, false, `@${W} filtre satırındaki dikey divider`);
  esit(r.tasma, 0, `@${W} yatay taşma`);
  await ctx.close();
}

/* ==================================================================
   29 · fit-testi-detay · boşluklar tek değer
   ================================================================== */
console.log('\n29 · fit-testi-detay boşluk ritmi');
for(const W of [1440,768,390]){
  const { ctx, p } = await sayfa(W);
  await git(p,'fit-testi-detay-v1.html?test=temel-kuvvet');
  const r = await p.evaluate(() => {
    const col=document.querySelector('.ft-col');
    const kids=[...col.children].filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().height>4);
    const ic=[];for(let i=1;i<kids.length;i++)ic.push(Math.round(kids[i].getBoundingClientRect().top-kids[i-1].getBoundingClientRect().bottom));
    /* BANNER SINIRI HARİÇ: .lib-top aile yükseklikleri K-A §4 ile kilitli */
    const secs=[...document.querySelectorAll('main.page-main > section')].filter(s=>!s.classList.contains('lib-top'));
    const sg=[];for(let i=1;i<secs.length;i++){const a=secs[i-1],c=secs[i];
      sg.push(Math.round(parseFloat(getComputedStyle(a).paddingBottom)+(c.getBoundingClientRect().top-a.getBoundingClientRect().bottom)+parseFloat(getComputedStyle(c).paddingTop)));}
    return { icFarkli:[...new Set(ic)], secFarkli:[...new Set(sg)],
      tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  esit(r.icFarkli.length, 1, `@${W} kolon içi ara — kaç farklı değer (${r.icFarkli.join('·')})`);
  esit(r.secFarkli.length, 1, `@${W} içerik section araları — kaç farklı değer (${r.secFarkli.join('·')})`);
  esit(r.tasma, 0, `@${W} yatay taşma`);
  await ctx.close();
}

/* ==================================================================
   30 · fit-testi-detay · sayı yazımı rakamla (Beyar kararı)
   ================================================================== */
console.log('\n30 · "7 soru · 1 dakikadan kısa"');
/* Beyar kararı iki adımda geldi: önce "Yedi→7", sonra ikinci yarı da
   ("yaklaşık 1 dakika" → "1 dakikadan kısa"). Gerekçe: "yaklaşık" aralıkla
   ya da yuvarlanmış değerle eşleşir; rakamla "1" ile birleşince değişken
   yerine konmamış şablon izlenimi veriyordu. Sekiz slug'ın hepsi ölçülür. */
for(const W of [1440,390]){
  const { ctx, p } = await sayfa(W);
  for(const sl of ['temel-kuvvet','baslangic-seviyesi','hareketlilik','denge','ust-vucut','dayaniklilik','masa-basi','haftalik-hareket']){
    await git(p,`fit-testi-detay-v1.html?test=${sl}`);
    const r = await p.evaluate(() => {
      const bul=[];
      document.querySelectorAll('*').forEach(e=>{ if(e.children.length===0 && /soru\s*·|adım\s*·/.test(e.textContent))
        bul.push({txt:e.textContent, satir:Math.round(e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight))}); });
      const g=document.body.innerText;
      return { yedi:/Yedi soru/.test(g), bes:/Beş adım/.test(g), yaklasik:/yaklaşık/.test(g), bul,
        tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
    });
    esit(r.yedi, false, `@${W} ${sl} · "Yedi" kalmadı`);
    esit(r.bes,  false, `@${W} ${sl} · "Beş adım" kalmadı`);
    esit(r.yaklasik, false, `@${W} ${sl} · "yaklaşık" kalmadı`);
    esit(r.bul.filter(x=>/^7 soru · 1 dakikadan kısa$/.test(x.txt.trim())).length, 2, `@${W} ${sl} · "7 soru · 1 dakikadan kısa" geçiş sayısı`);
    esit(r.bul.filter(x=>/^5 adım · ısınma ve soğuma dahil$/.test(x.txt.trim())).length, 1, `@${W} ${sl} · "5 adım · ısınma ve soğuma dahil" geçiş sayısı`);
    esit(r.bul.every(x=>x.satir===1), true, `@${W} ${sl} · ifadeler tek satır`);
    esit(r.tasma, 0, `@${W} ${sl} · yatay taşma`);
  }
  await ctx.close();
}

/* ==================================================================
   31 · KALKTI — video-seansları · "Sırala" ölçütü
   ------------------------------------------------------------------
   🔴 Video Seansları modülü 2026-08-29'da Beyar kararıyla TAMAMEN
   kaldırıldı (menü kalemi · iki sayfa · Pro paket matrisi satırı ·
   reklam envanteri yuvası · Kaydettiklerim süzgeci · destek talebi).
   Bu bölüm yalnız `video-seanslari-v1.html`i ölçüyordu; sayfa artık
   diskte yok, ölçüt de düştü. Ölçüt ZAYIFLATILMADI — ölçtüğü yüzey
   kalktı. Numara 31 §W5 gereği geri dönüştürülmez, boş kalır.
   ================================================================== */

/* ==================================================================
   32 · challenge-merkezi · section içi kartlar tek yükseklik ailesinde
   ================================================================== */
console.log('\n32 · challenge-merkezi kart tutarlılığı');
for(const W of [1440,390]){
  const { ctx, p } = await sayfa(W);
  await git(p,'challenge-merkezi-v1.html');
  const r = await p.evaluate(() => {
    const gruplar=[];
    document.querySelectorAll('main.page-main > section').forEach((s,i)=>{
      for(const sel of ['.cc-card','.fp-card']){
        const k=[...s.querySelectorAll(sel)].filter(c=>c.getBoundingClientRect().height>0);
        if(k.length>1){ const h=k.map(c=>Math.round(c.getBoundingClientRect().height));
          gruplar.push({ad:`section#${i} ${sel}`,n:k.length,h,fark:Math.max(...h)-Math.min(...h)}); }
      }
    });
    /* ölü boşluk = kart iç yüksekliği − (son çocuğun altı − ilk çocuğun üstü) */
    const oluBosluk=[...document.querySelectorAll('.cm-esit > .fp-card')]
      .filter(c=>c.getBoundingClientRect().height>0).map(c=>{
        const cs=getComputedStyle(c), r=c.getBoundingClientRect();
        const ic=[...c.children].filter(k=>k.getBoundingClientRect().height>0);
        if(!ic.length) return {px:0};
        const icAlt=Math.max(...ic.map(k=>k.getBoundingClientRect().bottom));
        return {px: Math.round(r.bottom - parseFloat(cs.paddingBottom) - icAlt)};
      });
    return { gruplar, oluBosluk, tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  if(!r.gruplar.length) ng(`@${W} kart grubu bulunamadı — seçici yanlış`);
  if(W>=641){
    /* IZGARA VAR → yan yana duran kartlar tek yükseklik ailesinde olmalı */
    for(const g of r.gruplar)
      (g.fark<=2) ? ok(`@${W} ${g.ad} ×${g.n} maks−min = ${g.fark} px (≤2) [${g.h.join('·')}]`)
                  : ng(`@${W} ${g.ad} ×${g.n} maks−min = ${g.fark} px (>2) [${g.h.join('·')}]`);
  } else {
    /* TEK KOLON → hizalanacak komşu yok; ölçüt ÇEVRİLİR (K62: nöbet
       düşürülmez): kart yüksekliği kendi içeriğine eşit, dolgu altında
       ölü boşluk 0 olmalı. Eşit yükseklik burada sadece boşluk üretirdi.

       REGRESYON NÖBETİ — TABANDA DA YEŞİL, KASITLI.
       Bu dal bir kalemi KAPATTIĞINI iddia etmiyor: @390'da böyle bir kusur
       hiç olmadı. R8'de eşit yüksekliği ızgara için açarken bu riski kısa
       süre ben yarattım ve `min-width:641px` ile geri aldım. Nöbet, birinin
       eşit yüksekliği yeniden GLOBAL açmasını yakalamak için duruyor.
       "Tabanda geçen ölçüt yanlış yazılmıştır" kuralının istisnası budur. */
    esit(r.oluBosluk.filter(x=>x.px>2).length, 0,
         `@${W} tek kolonda dolgu altı ölü boşluk taşıyan kart sayısı [${r.oluBosluk.map(x=>x.px).join('·')}]`);
  }
  esit(r.tasma, 0, `@${W} yatay taşma`);
  await ctx.close();
}

/* ==================================================================
   33 · hakkımızda · yasal metinler ↔ künye arası
   ================================================================== */
console.log('\n33 · hakkımızda künye ↔ yasal metinler');
for(const W of [1440,390]){
  const { ctx, p } = await sayfa(W);
  await git(p,'hakkimizda-v1.html');
  const r = await p.evaluate(() => {
    const k=document.querySelector('#kunye .kunye-grid'), l=document.querySelector('#kunye .legal-block');
    const sp=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sec-pad'));
    return { ara:Math.round(l.getBoundingClientRect().top-k.getBoundingClientRect().bottom), secPad:sp,
      tasma:document.documentElement.scrollWidth-document.documentElement.clientWidth };
  });
  esit(r.ara, r.secPad, `@${W} künye ↔ yasal metinler arası = --sec-pad (K-A rampasıyla tutarlı)`);
  esit(r.tasma, 0, `@${W} yatay taşma`);
  await ctx.close();
}

await browser.close();
console.log(`\n${'='.repeat(60)}`);
console.log(`GEÇTİ ${gecti} · KALDI ${hata}`);
console.log('='.repeat(60));
process.exit(hata ? 1 : 0);
