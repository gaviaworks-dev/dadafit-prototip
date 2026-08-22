/* =====================================================================
   DADAFIT — ANTRENÖR PROFİLİ: İSKELET + DANIŞAN DENEYİMİ + SEKME (R8/G)
   ---------------------------------------------------------------------
   Kurgu kaynağı: dadadiet.com/diyetisyen/dyt-elif-sahin — Playwright ile
   @1440 ve @390'da ÖLÇÜLDÜ (bkz. tasks/r8-ilerleme/ajan-g.md). Bu sınama
   HTTP değil HEDEF kontrol eder: sayfanın h1 metni beklenen kayıtla
   eşleşmezse hiçbir ölçüm anlamlı değildir, önce o düşer.

   Neyi kanıtlar:
   1. HEDEF — h1 metni "Selin Aksoy" ve sekme çubuğu bu sayfada.
   2. KALEM 37 · iskelet ölçüleri referansla eşleşiyor:
      .ab-grid gap 30 · yan kolon 320px · .ab-side gap 18 ·
      .info-card h4 14px + alt çizgi · .ic-row dolgu 10px 0 ·
      .ic-row b 13.5px · .ic-row span 13px · sekme çubuğu alt nefesi 30 ·
      sekme şeridi .wrap içeriğinin TAMAMI · sağlık bandı SON bölüm.
   3. KALEM 38 · "Danışan deneyimi" satırı var, referans konumunda
      (sekme çubuğundan ÖNCE, randevu kartından SONRA), 3 hücre.
   4. KALEM 38 · üçüncü hücre yer tutucu taşıyor (sayı uydurulmadı).
   4b. DEVIR-7 §5e/4 · portre kutusu yer tutucu olarak işaretli (kutudaki
      kare portre değil; görsel üretilmedi, işaret kondu).
   5. KALEM 39 · "Challenge'lar" sekmesi var ve paneli yer tutucu taşıyor.
   6. KALEM 39 · WAI-ARIA tabs: role=tablist/tab/tabpanel · aria-selected
      TEK sekmede true · aria-controls ↔ pane id 1:1 · roving tabindex ·
      ok tuşları döngü · Home/End · Tab TEK SEFERDE panele geçiyor
      (odaklanabilir öğesi olmayan panelde tabindex=0 şart).
   7. Banner detay ailesi sabiti korunuyor: 560 @1440 · 617 @1024 · 726 @390.
   8. Konsol hatası 0 · yatay taşma 0 (üç genişlikte).
   9. RANDEVU MODALI (`#aptModal`) altı borcunu da ödüyor: Esc · dışarı
      tıklama · kapat düğmesi · odak içeri · odak tetikleyene dönüyor ·
      body scroll kilidi çözülüyor (computed overflow önce/sonra).

   Çalıştırma:
     node tests/antrenor-profil.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE = process.argv[2] || 'http://localhost:8811';
const URL  = `${BASE}/antrenor-detay-v1.html`;

const H1        = 'Selin Aksoy';
const BANNER    = { 1440:560, 1024:617, 390:726 };   /* detay ailesi sabiti */

let fail = 0; const bad = [];
const rec = m => { fail++; bad.push(m); };
const ok  = m => console.log('  ✓ ' + m);
const eq  = (tag, got, want) => {
  if(String(got) === String(want)) ok(`${tag} = ${got}`);
  else rec(`${tag}: beklenen ${want}, ölçülen ${got}`);
};

const browser = await chromium.launch();

for(const width of [1440, 1024, 390]){
  console.log(`\n───────── @${width}px ─────────`);
  const ctx = await browser.newContext({ viewport:{ width, height:1000 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if(m.type() === 'error') errs.push('console.error: ' + m.text()); });

  await page.goto(URL, { waitUntil:'domcontentloaded' });
  await page.waitForSelector('.cp-tabbar .fit-tabs', { timeout:8000 });
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForTimeout(500);

  /* ---- 1 · HEDEF ----
     R9'DA ÇEVRİLDİ (silinmedi): ölçüt eskiden `h1.textContent` idi.
     Referansta (dadadiet `.pf-head h1`) doğrulama rozeti h1'in İÇİNDE
     duruyor — ölçülen metin "Dyt. Elif Şahin Doğrulandı". İskelet birebir
     alınınca buradaki h1 de "Selin Aksoy DadaFit Onaylı" oldu; eski ölçüt
     doğru işaretlemeyi kırmızı gösteriyordu. Ölçüt GEVŞEMEDİ, KESKİNLEŞTİ:
     artık h1'in isim parçası (`[data-at="ad"]`, slug'a bağlanan düğüm) TAM
     eşleşmek zorunda VE rozetin h1 içinde olduğu ayrıca doğrulanıyor. */
  const hedef = await page.evaluate(() => {
    const h = document.querySelector('h1');
    if(!h) return { yok:true };
    const ad = h.querySelector('[data-at="ad"]');
    return { yok:false, ad: ad ? ad.textContent.trim() : null,
             rozet: !!h.querySelector('.cp-verify'),
             tam: h.textContent.replace(/\s+/g,' ').trim() };
  });
  if(hedef.yok){ rec('1 · h1 YOK'); await ctx.close(); continue; }
  eq('1 · h1 isim düğümü', hedef.ad, H1);
  if(hedef.rozet) ok('1 · doğrulama rozeti h1\'in İÇİNDE (referans deseni): ' + hedef.tam);
  else rec('1 · doğrulama rozeti h1\'in içinde değil — referansta `.pf-verify` h1\'in çocuğu');
  if(hedef.ad !== H1){ /* hedef yanlışsa gerisi anlamsız */ await ctx.close(); continue; }

  /* ---- 7 · banner ailesi sabiti ---- */
  const bh = await page.$eval('.cp-top', e => Math.round(e.getBoundingClientRect().height));
  eq(`7 · .cp-top yüksekliği`, bh, BANNER[width]);

  /* ---- 3 · danışan deneyimi satırı: VAR MI, KAÇ HÜCRE, NEREDE ---- */
  const exp = await page.evaluate(() => {
    const row = document.querySelector('.cp-exp .cp-stats');
    if(!row) return { yok:true };
    const lbl = document.querySelector('.cp-exp .cp-exp-lbl');
    const cells = [...row.querySelectorAll('.cps')];
    const bar = document.querySelector('.cp-tabbar');
    const kart = document.querySelector('.cp-head');
    const y = e => e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : null;
    /* R9: blok sırası artık referansın kendi kabında ölçülüyor —
       `.cp-top > .wrap` çocukları = `.pf-top > .wrap` çocukları */
    const kids = [...document.querySelector('.cp-top .wrap').children]
                   .filter(e => e.getBoundingClientRect().height > 0);
    return {
      etiket: lbl ? lbl.textContent.trim() : null,
      hucre: cells.length,
      grup: row.getAttribute('role'),
      ariaLabel: row.getAttribute('aria-label'),
      yerTutucu: cells.filter(c => c.hasAttribute('data-yer-tutucu')).length,
      ytAria: cells.filter(c => c.querySelector('[aria-label]')).length,
      sonrasiSekme: y(row) < y(bar),
      sonrasiKart: kart ? y(row) > y(kart) : false,
      heroIcinde: !!document.querySelector('.cp-top .cp-exp'),
      sira: kids.indexOf(document.querySelector('.cp-exp')) + 1,
      toplamBlok: kids.length
    };
  });
  if(exp.yok) rec('3 · "Danışan deneyimi" satırı (.cp-exp .cp-stats) YOK');
  else {
    eq('3 · deneyim satırı etiketi', exp.etiket, 'Danışan deneyimi');
    eq('3 · deneyim hücre sayısı', exp.hucre, 3);
    eq('3 · satır role', exp.grup, 'group');
    /* ---- KONUM · REFERANSLA EŞLEME ----
       Referansta (`.pf-top > .wrap` çocukları) sıra:
         1 kırıntı · 2 banner görseli · 3 kimlik kartı (+eylem düğmeleri)
         · 4 `.pf-stats` istatistik satırı   → sonra sekme çubuğu.
       Burada kırıntı `.cp-top`un İÇİNDE olduğu için `main` düzeyinde
       bir blok eksik sayılır; aynı sıra `main` çocuklarında şöyle:
         1 .cp-top (banner + kırıntı + kimlik) · 2 .cp-band (eylem
         düğmeleri) · 3 .cp-exp (istatistik satırı) → 4 .cp-body (sekme).
       Yani kırıntı ayrı sayılırsa DA 4. blok. Ölçülen sayı: 3. */
    /* ---- R9'DA ÇEVRİLEN İKİ ÖLÇÜT (silinmedi, YERİ DEĞİŞTİ) ----
       ÖNCE: şerit `main`in çıplak çocuğuydu ve ölçüt "randevu kartından
       (`.cp-band`) SONRA · main'de 3. blok" diyordu. `.cp-band` R9'da
       KALDIRILDI: içindeki ₺450 kutusu referansta karşılığı olmayan bir
       desendi (referansta hero'da fiyat yok) ve Beyar "berbat bir yerde"
       dedi; eylem düğmeleri kimlik kartına, fiyat "Seanslar" sekmesine
       gitti. Ölçüt referansın KENDİ ilişkisine çevrildi:
       `.pf-stats`, `.pf-top` İÇİNDE ve `.pf-head`in HEMEN ALTINDA —
       blok sırasında 4. (kırıntı 1 · banner 2 · kimlik kartı 3 · şerit 4).
       Ölçüt sayısı düşmedi: iki ölçüt yerine ÜÇ ölçüt var. */
    eq('3 · kimlik kartından SONRA (referans .pf-head → .pf-stats)', exp.sonrasiKart, 'true');
    eq('3 · şerit hero bölümünün İÇİNDE (referans .pf-top)', exp.heroIcinde, 'true');
    eq('3 · sekme çubuğundan ÖNCE', exp.sonrasiSekme, 'true');
    eq('3 · hero blok sırası (kırıntı·banner·kart·şerit)', exp.sira, 4);
    /* ---- 4 · sayı uydurulmadı ---- */
    eq('4 · yer tutucu hücre sayısı', exp.yerTutucu, 1);
    if(exp.ytAria < 1) rec('4 · yer tutucu hücrenin durumunu anlatan aria-label yok');
    else ok('4 · yer tutucu hücrede aria-label var');
  }

  /* ---- 5 + 6 · sekmeler ---- */
  const tb = await page.evaluate(() => {
    const bar = document.querySelector('.cp-tabbar [data-fit-tabs]');
    if(!bar) return { yok:true };
    const tabs  = [...bar.querySelectorAll('.fit-tab')];
    const panes = [...document.querySelectorAll('.fit-pane[data-pane]')];
    const ids   = panes.map(p => p.id);
    return {
      barRole: bar.getAttribute('role'),
      sekme: tabs.length,
      panel: panes.length,
      anahtarlar: tabs.map(t => t.getAttribute('data-tab')),
      rolTab: tabs.filter(t => t.getAttribute('role') === 'tab').length,
      rolPanel: panes.filter(p => p.getAttribute('role') === 'tabpanel').length,
      seciliTrue: tabs.filter(t => t.getAttribute('aria-selected') === 'true').length,
      tabindex0: tabs.filter(t => t.getAttribute('tabindex') === '0').length,
      /* aria-controls ↔ pane id eşleşmesi 1:1 */
      ctrlEsit: tabs.every(t => ids.includes(t.getAttribute('aria-controls'))),
      ctrlTekil: new Set(tabs.map(t => t.getAttribute('aria-controls'))).size === tabs.length,
      labelledby: panes.every(p => document.getElementById(p.getAttribute('aria-labelledby'))),
      chlPane: (() => {
        const p = document.querySelector('.fit-pane[data-pane="challenge"]');
        return p ? { var:true, yt:p.getAttribute('data-yer-tutucu'), bos:!!p.querySelector('.lib-empty') } : { var:false };
      })(),
      chlSayac: !!document.querySelector('.fit-tab[data-tab="challenge"] .cnt')
    };
  });
  if(tb.yok) rec('5 · sekme çubuğu YOK');
  else {
    eq('6 · tablist rolü', tb.barRole, 'tablist');
    /* R9'DA ÇEVRİLDİ: 4 → 5. Referansta "Hizmetler" sekmesi VAR ve fiyat
       yalnız orada duruyor; karşılığı olan "Seanslar" sekmesi eklendi
       (Hakkında'nın hemen ardında — referanstaki sıra). */
    eq('5 · sekme sayısı', tb.sekme, 5);
    eq('5 · panel sayısı', tb.panel, 5);
    if(tb.anahtarlar.includes('seanslar')) ok('5 · "seanslar" sekmesi var (referans "Hizmetler")');
    else rec('5 · "seanslar" sekmesi YOK — anahtarlar: ' + tb.anahtarlar.join(','));
    eq('5 · "seanslar" sekmesi Hakkında\'nın hemen ardında (referans sırası)',
       tb.anahtarlar[1], 'seanslar');
    if(tb.anahtarlar.includes('challenge')) ok('5 · "challenge" sekmesi var');
    else rec('5 · "challenge" sekmesi YOK — anahtarlar: ' + tb.anahtarlar.join(','));
    eq('6 · role=tab taşıyan sekme', tb.rolTab, tb.sekme);
    eq('6 · role=tabpanel taşıyan panel', tb.rolPanel, tb.panel);
    eq('6 · aria-selected="true" sayısı', tb.seciliTrue, 1);
    eq('6 · tabindex=0 sekme sayısı (roving)', tb.tabindex0, 1);
    if(tb.ctrlEsit && tb.ctrlTekil) ok('6 · aria-controls ↔ pane id 1:1');
    else rec('6 · aria-controls ↔ pane id eşleşmesi bozuk');
    if(tb.labelledby) ok('6 · her panelin aria-labelledby hedefi var');
    else rec('6 · bir panelin aria-labelledby hedefi yok');
    /* içerik uydurulmadı */
    if(!tb.chlPane.var) rec('5 · challenge paneli YOK');
    else {
      if(tb.chlPane.yt) ok('5 · challenge paneli data-yer-tutucu taşıyor: ' + tb.chlPane.yt);
      else rec('5 · challenge paneli data-yer-tutucu TAŞIMIYOR (içerik uydurulmuş olabilir)');
      if(tb.chlPane.bos) ok('5 · challenge paneli kurulu boş-durum bileşenini (.lib-empty) kullanıyor');
      else rec('5 · challenge paneli boş-durum bileşenini kullanmıyor');
    }
    if(tb.chlSayac) rec('5 · challenge sekmesinde sayaç var — eşleşme kaydı yokken sayı basılmamalı');
    else ok('5 · challenge sekmesinde uydurma sayaç yok');
  }

  /* ---- 6 · KLAVYE: ok tuşları + Home/End + Tab ---- */
  const nerede = () => page.evaluate(() => {
    const a = document.activeElement;
    return { tab: a ? a.getAttribute('data-tab') : null,
             sekmeGrubunda: !!(a && a.closest('[data-fit-tabs]')),
             panel: !!(a && a.classList && a.classList.contains('fit-pane')) };
  });
  const ilk = await page.$('.cp-tabbar .fit-tab');
  if(!ilk) rec('6 · klavye denenemedi, sekme bulunamadı');
  else {
    await ilk.focus();
    const adim = [];
    /* R9'DA ÇEVRİLDİ: 4 → 5 (sekme sayısı kadar sağ ok = başa döner) */
    for(let i=0;i<5;i++){ await page.keyboard.press('ArrowRight'); await page.waitForTimeout(90); adim.push((await nerede()).tab); }
    await page.keyboard.press('Home'); await page.waitForTimeout(90);
    const home = await nerede();
    await page.keyboard.press('End'); await page.waitForTimeout(90);
    const end = await nerede();
    console.log('     klavye izi: → ' + adim.join(' | → ') + ' | Home→' + home.tab + ' | End→' + end.tab);
    /* 5 sekmede 5 sağ ok = başa döner */
    eq('6 · → ×5 başa dönüyor', adim[4], 'hakkinda');
    eq('6 · Home ilk sekme', home.tab, 'hakkinda');
    eq('6 · End son sekme', end.tab, 'challenge');
    if(home.sekmeGrubunda && end.sekmeGrubunda) ok('6 · ok/Home/End odağı sekme grubundan çıkarmıyor');
    else rec('6 · ok tuşları odağı sekme grubunun dışına attı');
    /* Tab: aktif sekmeden TEK SEFERDE panele */
    await page.keyboard.press('Home'); await page.waitForTimeout(120);
    await page.keyboard.press('Tab');  await page.waitForTimeout(120);
    const t1 = await nerede();
    if(t1.panel) ok('6 · Tab ×1 → seçili panelin kendisi (odaklanabilir öğesi yok, tabindex=0)');
    else rec('6 · Tab ×1 paneli ATLADI — odak: ' + JSON.stringify(t1));
    if(!t1.sekmeGrubunda) ok('6 · Tab sekme grubundan çıkıyor (tuzak değil)');
    else rec('6 · Tab sekme grubundan çıkamadı — odak tuzağı');
    /* seçim tek sekmede kalıyor */
    const sonSecili = await page.$$eval('.cp-tabbar .fit-tab', ts => ts.filter(t => t.getAttribute('aria-selected')==='true').length);
    eq('6 · klavye gezintisi sonrası aria-selected="true"', sonSecili, 1);
  }

  /* ---- 2 · İSKELET ÖLÇÜLERİ (referanstan) ---- */
  const sk = await page.evaluate(() => {
    const c = s => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
    const b = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
    const abg = c('.ab-grid'), abs = c('.ab-side'), h4 = c('.info-card h4'),
          icr = c('.ic-row'), icb = c('.ic-row b'), ics = c('.ic-row span:not(.ic-ico)'),
          bar = c('.cp-tabbar'), body = c('.cp-body');
    const tabsBox = b('.cp-tabbar .fit-tabs'), wrapBox = b('.cp-tabbar .wrap');
    const wrapCs  = c('.cp-tabbar .wrap');
    const main = document.querySelector('main.page-main');
    const kids = [...main.children].filter(e => e.getBoundingClientRect().height > 0);
    const disc = document.querySelector('.cp-disclaimer');
    return {
      gridGap: abg && abg.columnGap, gridCols: abg && abg.gridTemplateColumns,
      sideGap: abs && abs.rowGap,
      h4fs: h4 && h4.fontSize, h4pb: h4 && h4.paddingBottom, h4bd: h4 && h4.borderBottomWidth,
      icrPad: icr && (icr.paddingTop + ' ' + icr.paddingBottom), icrBd: icr && icr.borderTopWidth,
      icbFs: icb && icb.fontSize, icsFs: ics && ics.fontSize,
      barMb: bar && bar.marginBottom, bodyPt: body && body.paddingTop, bodyPb: body && body.paddingBottom,
      /* sekme şeridi .wrap içeriğinin tamamını kaplıyor mu (referans: 1176/1176) */
      seritTam: tabsBox && wrapBox ? Math.round(tabsBox.width) === Math.round(wrapBox.width - parseFloat(wrapCs.paddingLeft) - parseFloat(wrapCs.paddingRight)) : false,
      seritW: tabsBox && Math.round(tabsBox.width),
      discSon: !!disc && kids[kids.length-1] === disc,
      discBg: disc && getComputedStyle(disc).backgroundColor
    };
  });
  eq('2 · .ab-grid sütun aralığı', sk.gridGap, '30px');
  eq('2 · .ab-side satır aralığı', sk.sideGap, '18px');
  eq('2 · .info-card h4 punto', sk.h4fs, '14px');
  eq('2 · .info-card h4 alt dolgu', sk.h4pb, '13px');
  eq('2 · .info-card h4 alt çizgi', sk.h4bd, '1px');
  eq('2 · .ic-row dolgu (üst alt)', sk.icrPad, '10px 10px');
  eq('2 · .ic-row üst çizgi yok', sk.icrBd, '0px');
  eq('2 · .ic-row b punto', sk.icbFs, '13.5px');
  eq('2 · .ic-row span punto', sk.icsFs, '13px');
  eq('2 · sekme çubuğu alt nefesi', sk.barMb, '30px');
  eq('2 · .cp-body üst dolgusu', sk.bodyPt, '40px');
  eq('2 · .cp-body alt dolgusu', sk.bodyPb, width <= 640 ? '44px' : '74px');
  if(sk.seritTam) ok(`2 · sekme şeridi .wrap içeriğinin tamamı (${sk.seritW}px)`);
  else rec(`2 · sekme şeridi tam genişlik değil (${sk.seritW}px)`);
  if(width > 1024) eq('2 · .ab-grid yan kolon', /320px$/.test(sk.gridCols || '') ? '320px' : sk.gridCols, '320px');
  if(sk.discSon) ok('2 · sağlık bilgilendirme bandı SON bölüm (referans .pf-disclaimer)');
  else rec('2 · sağlık bilgilendirme bandı son bölüm DEĞİL');

  /* ---- 4b · portre yer tutucusu (DEVIR-7 §5e kalem 4) ---- */
  const portre = await page.evaluate(() => {
    /* R9'DA ÇEVRİLEN SEÇİCİ: `.cp-portre` → `.cp-ava`. Kutu koyu banner'ın
       üstündeki serbest daireden referansın kimlik kartındaki `.pf-ava`
       yuvarlağına taşındı; sınıf adı da referansınkine hizalandı.
       ÖLÇÜT AYNI, üstelik bir kalem GENİŞLEDİ: kutunun 128 px'lik referans
       ölçüsünde ve daire olduğu da artık ölçülüyor. */
    const e = document.querySelector('.cp-ava');
    if(!e) return { yok:true };
    const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    return { yt: e.getAttribute('data-yer-tutucu'), aria: e.getAttribute('aria-label'), rol: e.getAttribute('role'),
             w: Math.round(r.width), h: Math.round(r.height), radius: cs.borderTopLeftRadius };
  });
  if(portre.yok) rec('4b · .cp-ava YOK');
  else if(!portre.yt) rec('4b · .cp-ava yer tutucu işareti taşımıyor — iskelet portre bekliyor, kutudaki kare portre değil');
  else if(!portre.aria) rec('4b · .cp-ava durumu anlatan aria-label taşımıyor');
  else ok('4b · portre kutusu yer tutucu olarak işaretli: ' + portre.yt);
  if(!portre.yok){
    if(portre.w === portre.h) ok(`4b · portre kutusu kare tabanlı (${portre.w}×${portre.h})`);
    else rec(`4b · portre kutusu kare değil (${portre.w}×${portre.h})`);
    eq('4b · portre yuvarlak (referans .pf-ava r50%)', portre.radius, '50%');
    if(width > 1024) eq('4b · portre çapı (referans .pf-ava 128)', portre.w, 128);
  }

  /* ---- 9 · RANDEVU MODALI (LEAD eklemesi · AJAN-C bulgusu) ----
     Altı borç: Esc · dışarı tıklama · kapat düğmesi · odak İÇERİ ·
     odak tetikleyene DÖNÜYOR · scroll kilidi çözülüyor.
     "Dışarı tıklama" ham koordinatla denenir: `.apt-modal` bütün
     pencereyi kapladığı için `#aptOverlay`e seçiciyle tıklanamaz
     (Playwright: "#aptModal … subtree intercepts pointer events") —
     kusurun kök nedeni zaten bu, ölçüm de onu taklit etmeli. */
  {
    const acik = () => page.evaluate(() => document.getElementById('aptModal').classList.contains('show'));
    const ovf  = () => page.evaluate(() => getComputedStyle(document.body).overflow);
    const ici  = () => page.evaluate(() => !!(document.activeElement && document.activeElement.closest('#aptModal')));
    const odakId = () => page.evaluate(() => document.activeElement ? document.activeElement.id : '');
    const kapali = await ovf();
    /* Ölçütler BİRBİRİNİ BOZMASIN: bir borç ödenmiyorsa (ör. Esc
       kapatmıyorsa) modal açık kalır ve sonraki `#ctaBook` tıklaması
       modalın altında kalıp sınamayı ÇÖKERTİR — taban ağacında tam
       olarak bu oldu. Her alt ölçütten önce durum zorla sıfırlanır;
       böylece kırmızı çıktı hangi borcun ödenmediğini tek tek söyler. */
    const sifirla = async () => {
      await page.evaluate(() => {
        const m = document.getElementById('aptModal'), o = document.getElementById('aptOverlay');
        if(m) m.classList.remove('show');
        if(o) o.classList.remove('show');
        document.body.style.overflow = '';
        if(document.activeElement && document.activeElement.blur) document.activeElement.blur();
      });
      await page.waitForTimeout(320);
    };
    const acKlavyeyle = async () => {   /* tıklama değil: modal açıksa tıklama engellenir */
      await page.evaluate(() => document.getElementById('ctaBook').focus());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(430);
    };

    /* 9a · Esc */
    await sifirla(); await acKlavyeyle();
    if(await acik()) ok('9 · modal açılıyor');
    else rec('9 · modal AÇILMADI');
    eq('9 · açıkken body overflow', await ovf(), 'hidden');
    if(await ici()) ok('9 · odak modalın İÇİNE taşındı (' + (await odakId()) + ')');
    else rec('9 · odak modala girmedi — odak: ' + (await odakId()));
    await page.keyboard.press('Escape'); await page.waitForTimeout(420);
    if(!(await acik())) ok('9 · Esc kapatıyor');
    else rec('9 · Esc KAPATMIYOR');
    eq('9 · Esc sonrası body overflow (kilit çözüldü)', await ovf(), kapali);
    eq('9 · Esc sonrası odak tetikleyene döndü', await odakId(), 'ctaBook');

    /* 9b · dışarı tıklama */
    await sifirla(); await acKlavyeyle();
    await page.mouse.click(6, 6); await page.waitForTimeout(420);
    if(!(await acik())) ok('9 · dışarı tıklama kapatıyor');
    else rec('9 · dışarı tıklama KAPATMIYOR');

    /* 9c · kapat düğmesi + odak dönüşü + kilit */
    await sifirla(); await acKlavyeyle();
    await page.click('#aptClose', { timeout:5000 }).catch(() => rec('9 · kapat düğmesine tıklanamadı'));
    await page.waitForTimeout(420);
    if(!(await acik())) ok('9 · kapat düğmesi kapatıyor');
    else rec('9 · kapat düğmesi KAPATMIYOR');
    eq('9 · kapat sonrası odak tetikleyene döndü', await odakId(), 'ctaBook');
    eq('9 · kapat sonrası body overflow (kilit çözüldü)', await ovf(), kapali);

    /* 9d · odak tuzağı */
    await sifirla(); await acKlavyeyle();
    let disari = 0;
    for(let i=0;i<24;i++){ await page.keyboard.press('Tab'); if(!(await ici())) disari++; }
    eq('9 · 24 Tab boyunca panel dışına düşen adım', disari, 0);
    await sifirla();
  }

  /* =====================================================================
     10 · ÜCRET NEREDE? — BEYAR'IN ŞİKÂYETİNİN ÖLÇÜSÜ (R9)
     ---------------------------------------------------------------------
     Beyar: "burda 450 tl kartı berbat bir yerde".
     ÖNCEKİ ÖLÇÜM (R9 öncesi, @1440): fiyat `.cp-cta` içindeydi — 262×285 px
     koyu kutu, y592, tek başına solda, sağında 914 px boş alan.
     REFERANS ÖLÇÜMÜ (dadadiet/diyetisyen/dyt-elif-sahin): hero'da ve sekme
     çubuğunun ÜSTÜNDE hiçbir yerde ₺ geçmiyor. Fiyat yalnız "Hizmetler"
     sekmesindeki `.svc-card > .svc-foot > .svc-price > b` içinde.
     Bu ölçüt tam olarak onu kilitler: sekme çubuğunun üstünde para YOK,
     seans kartının ayağında VAR.
     ===================================================================== */
  const ucret = await page.evaluate(() => {
    const bar = document.querySelector('.cp-tabbar');
    const barY = bar ? bar.getBoundingClientRect().top + window.scrollY : 0;
    const para = /(₺\s*[\d.]|[\d.]\s*₺|\bTL\b)/;
    /* yalnız YAPRAK düğümler; kapsayıcılar çocuklarının metnini tekrarlar */
    const yaprak = [...document.querySelectorAll('body *')].filter(e =>
      e.children.length === 0 && para.test(e.textContent || ''));
    const gorunur = e => { const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const ustte = yaprak.filter(e => gorunur(e) &&
      (e.getBoundingClientRect().top + window.scrollY) < barY &&
      !e.closest('#aptModal') && !e.closest('.apt-modal'));
    const foot = document.querySelector('.svc-card .svc-foot .svc-price b');
    return {
      ustteSayi: ustte.length,
      ustteMetin: ustte.slice(0,4).map(e => (e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40)),
      ayaktaVar: !!foot,
      ayaktaMetin: foot ? foot.textContent.trim() : null,
      /* referansta 3 hizmet kartı vardı; burada da 3 seans */
      kart: document.querySelectorAll('.svc-card').length,
      fiyatliKart: document.querySelectorAll('.svc-card .svc-price b').length,
      randevuDugmesi: document.querySelectorAll('.svc-card .svc-book').length,
      /* hero'da fiyat kutusu kalmadı mı */
      eskiKutu: !!document.querySelector('.cp-cta') || !!document.querySelector('.cp-band') || !!document.querySelector('.cta-price')
    };
  });
  if(ucret.ustteSayi === 0) ok('10 · sekme çubuğunun ÜSTÜNDE ücret yok (referansla birebir)');
  else rec(`10 · sekme çubuğunun üstünde ${ucret.ustteSayi} ücret düğümü var: ${ucret.ustteMetin.join(' | ')}`);
  if(!ucret.eskiKutu) ok('10 · eski yalnız duran ₺ kutusu (.cp-cta/.cp-band/.cta-price) kaldırıldı');
  else rec('10 · eski ₺ kutusu hâlâ sayfada');
  if(ucret.ayaktaVar) ok('10 · ücret seans kartının ayağında: ' + ucret.ayaktaMetin);
  else rec('10 · `.svc-card .svc-foot .svc-price b` YOK — ücret referanstaki yerinde değil');
  eq('10 · seans kartı sayısı (referans 3 hizmet kartı)', ucret.kart, 3);
  eq('10 · ücret taşıyan kart', ucret.fiyatliKart, 3);
  eq('10 · her kartın kendi Randevu düğmesi', ucret.randevuDugmesi, 3);

  /* ---- 11 · SEANS KARTI İSKELETİ — referans `.svc-card` ölçüleri ----
     Ölçülen referans (@1440): .svc-grid gap 22 · kart pad 24px 22px · r16 ·
     1px çizgi · .svc-foot üst dolgu 18 + ÜST ÇİZGİ 1px · .svc-price b 23/700
     · span 12/500 · .svc-book pad 12/18 · r12 · 13.5/700. */
  {
    const sv = await page.evaluate(() => {
      const c = s => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
      const g = c('.svc-grid'), k = c('.svc-card'), f = c('.svc-foot'),
            b = c('.svc-price b'), sp = c('.svc-price span'), bk = c('.svc-book'),
            tg = c('.svc-tag'), ic = c('.svc-ico'), h3 = c('.svc-card h3');
      if(!k) return { yok:true };
      return { gap:g&&g.gap, pad:k.paddingTop+' '+k.paddingRight, r:k.borderTopLeftRadius, bd:k.borderTopWidth,
               fpt:f&&f.paddingTop, fbd:f&&f.borderTopWidth, fdisp:f&&f.display,
               bfs:b&&b.fontSize, bfw:b&&b.fontWeight, spfs:sp&&sp.fontSize, spfw:sp&&sp.fontWeight,
               bkpad:bk&&(bk.paddingTop+' '+bk.paddingRight), bkr:bk&&bk.borderTopLeftRadius,
               bkfs:bk&&bk.fontSize, bkfw:bk&&bk.fontWeight,
               tgfs:tg&&tg.fontSize, tgfw:tg&&tg.fontWeight, tgr:tg&&tg.borderTopLeftRadius,
               icw:ic&&ic.width, icr:ic&&ic.borderTopLeftRadius, h3fs:h3&&h3.fontSize, h3fw:h3&&h3.fontWeight };
    });
    if(sv.yok) rec('11 · `.svc-card` YOK');
    else {
      eq('11 · .svc-grid aralığı', sv.gap, '22px');
      eq('11 · .svc-card dolgusu (üst/sağ)', sv.pad, '24px 22px');
      eq('11 · .svc-card yarıçapı', sv.r, '16px');
      eq('11 · .svc-card çizgisi', sv.bd, '1px');
      eq('11 · .svc-tag punto', sv.tgfs, '10.5px');
      eq('11 · .svc-tag ağırlığı', sv.tgfw, '700');
      eq('11 · .svc-tag yarıçapı', sv.tgr, '8px');
      eq('11 · .svc-ico ölçüsü', sv.icw, '48px');
      eq('11 · .svc-ico yarıçapı', sv.icr, '12px');
      eq('11 · .svc-card h3 punto', sv.h3fs, '18px');
      eq('11 · .svc-card h3 ağırlığı', sv.h3fw, '700');
      eq('11 · .svc-foot üst dolgusu', sv.fpt, '18px');
      eq('11 · .svc-foot ÜST ÇİZGİSİ', sv.fbd, '1px');
      eq('11 · .svc-price b punto', sv.bfs, '23px');
      eq('11 · .svc-price b ağırlığı', sv.bfw, '700');
      eq('11 · .svc-price span punto', sv.spfs, '12px');
      eq('11 · .svc-price span ağırlığı', sv.spfw, '500');
      eq('11 · .svc-book dolgusu (üst/sağ)', sv.bkpad, '12px 18px');
      eq('11 · .svc-book yarıçapı', sv.bkr, '12px');
      eq('11 · .svc-book punto', sv.bkfs, '13.5px');
      eq('11 · .svc-book ağırlığı', sv.bkfw, '700');
    }
  }

  /* ---- 12 · KİMLİK KARTI — referans `.pf-head` ölçüleri + KIRPILMA ----
     Ölçülen referans (@1440): kart genişliği = wrap içeriği − 56 (1120/1176)
     · pad 26px 30px 28px · r16 · 1px çizgi · gap 26 · h1 29/700 ·
     `.pf-handle` 14/600 · `.pf-meta` 13/500 · `.pf-actions` gap 9 ·
     kart banner'ın alt kenarına BİNİYOR.
     KIRPILMA: `.cp-top` yüksekliği kabuk tarafından kilitli (560/617/726) ve
     `overflow:hidden`; içerik sığmazsa SESSİZCE kesilir. İlk kurulumda @390
     tam olarak bu oldu (35 px kırpılma, ölçüldü). Nöbet burada. */
  {
    const kk = await page.evaluate(() => {
      const h = document.querySelector('.cp-head'); if(!h) return { yok:true };
      const cs = getComputedStyle(h), r = h.getBoundingClientRect();
      const wrap = document.querySelector('.cp-top .wrap'), wcs = getComputedStyle(wrap), wr = wrap.getBoundingClientRect();
      const ic = Math.round(wr.width - parseFloat(wcs.paddingLeft) - parseFloat(wcs.paddingRight));
      const bn = document.querySelector('.cp-banner');
      const top = document.querySelector('.cp-top'), tr = top.getBoundingClientRect();
      const son = document.querySelector('.cp-exp').getBoundingClientRect();
      const id = getComputedStyle(document.querySelector('.cp-id h1'));
      const spec = getComputedStyle(document.querySelector('.cp-spec'));
      const meta = getComputedStyle(document.querySelector('.cp-meta'));
      const act = getComputedStyle(document.querySelector('.cp-actions'));
      return { w:Math.round(r.width), icerikW:ic, pad:cs.paddingTop+' '+cs.paddingRight+' '+cs.paddingBottom,
               r:cs.borderTopLeftRadius, bd:cs.borderTopWidth,
               bindirme: bn ? Math.round(bn.getBoundingClientRect().bottom - r.top) : null,
               bannerR: bn ? getComputedStyle(bn).borderTopLeftRadius : null,
               kirpilma: Math.round(son.bottom - tr.bottom),
               h1fs:id.fontSize, h1fw:id.fontWeight, specfs:spec.fontSize, specfw:spec.fontWeight,
               metafs:meta.fontSize, metafw:meta.fontWeight, actgap:act.gap };
    });
    if(kk.yok) rec('12 · `.cp-head` kimlik kartı YOK');
    else {
      /* referans kenar payı ölçüldü: @1440 28+28=56 (1120/1176) ·
         @390 12+12=24 (334/358). Genişliğe göre ayrı beklenti. */
      const pay = width > 640 ? 56 : 24;
      eq(`12 · kart genişliği = wrap içeriği − ${pay} (referans @1440 1120/1176 · @390 334/358)`, kk.w, kk.icerikW - pay);
      eq('12 · kart yarıçapı', kk.r, '16px');
      eq('12 · kart çizgisi', kk.bd, '1px');
      eq('12 · h1 ağırlığı', kk.h1fw, '700');
      eq('12 · uzmanlık satırı (referans .pf-handle 14/600)', kk.specfw, '600');
      eq('12 · meta satırı (referans .pf-meta 13/500)', kk.metafs + '/' + kk.metafw, '13px/500');
      eq('12 · eylem kolonu aralığı (referans .pf-actions gap 9)', kk.actgap, '9px');
      if(width > 1024){
        eq('12 · kart dolgusu (referans 26/30/28)', kk.pad, '26px 30px 28px');
        eq('12 · h1 punto (referans .pf-head h1 29px)', kk.h1fs, '29px');
        eq('12 · uzmanlık satırı puntosu', kk.specfs, '14px');
      }
      if(kk.bindirme > 0) ok(`12 · kart banner'ın alt kenarına biniyor (${kk.bindirme}px)`);
      else rec(`12 · kart banner'a BİNMİYOR (${kk.bindirme}px) — referansta .pf-head .pf-banner'ın üstüne taşar`);
      if(kk.kirpilma <= 0) ok(`12 · hero içeriği kırpılmıyor (alt kenara ${Math.abs(kk.kirpilma)}px kaldı)`);
      else rec(`12 · HERO İÇERİĞİ KIRPILIYOR: son blok bölümün alt kenarını ${kk.kirpilma}px aşıyor (.cp-top overflow:hidden)`);
    }
  }

  /* ---- 14 · ODAK HALKASI GÖRÜNÜR MÜ (R9) ----
     R9'da kimlik kartındaki eylem düğmeleri KOYU cam panelden BEYAZ kartın
     üstüne taşındı. Zemin değişince odak halkasının okunurluğu da değişir;
     bu ölçüt onu nöbete alıyor. Ölçülen şey renk ADI değil, halkanın
     düğmenin KENDİ zeminiyle aynı renk olup olmadığı — "beyaz halka kötüdür"
     diye bir kural yok, "zeminle aynı renk halka görünmez" diye bir kural var.
     Odak GERÇEK Tab ile veriliyor: `el.focus()` bazı tarayıcılarda
     `:focus-visible` kurmaz ve ölçüm sessizce yanlış çıkar. */
  {
    const hedefler = ['#ctaBook', '#ctaMsg', '#ctaSave'];
    for(const sel of hedefler){
      /* Odak KLAVYE ile verilmeli: `el.focus()` tek başına bazı durumlarda
         `:focus-visible` kurmuyor. Önce elemana odaklanılıyor, sonra bir
         adım geri + bir adım ileri ile son giriş kipi klavyeye çevriliyor.
         Geri-ileri çifti hedefe dönmezse (araya odaklanabilir bir öğe
         girebilir) doğrudan odak + Tab kipi denenip DURUM RAPORLANIYOR;
         sessizce "geçti" demiyor. */
      await page.evaluate(s => document.querySelector(s).focus(), sel);
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      let dondu = await page.evaluate(s => document.activeElement === document.querySelector(s), sel);
      if(!dondu){
        await page.keyboard.press('Tab');
        dondu = await page.evaluate(s => document.activeElement === document.querySelector(s), sel);
      }
      if(!dondu) await page.evaluate(s => document.querySelector(s).focus(), sel);
      const o = await page.evaluate(s => {
        const e = document.querySelector(s);
        if(document.activeElement !== e) return { odaksiz:true, nerede:(document.activeElement||{}).id || String((document.activeElement||{}).className).slice(0,30) };
        const cs = getComputedStyle(e);
        return { fv: e.matches(':focus-visible'), w: cs.outlineWidth, st: cs.outlineStyle,
                 oc: cs.outlineColor, bg: cs.backgroundColor };
      }, sel);
      if(o.odaksiz){ rec(`14 · ${sel} odaklanamadı — odak: ${o.nerede}`); continue; }
      if(!o.fv) rec(`14 · ${sel} klavye odağında :focus-visible kurulmuyor`);
      else if(o.st === 'none' || parseFloat(o.w) < 2) rec(`14 · ${sel} odak halkası yok/ince (${o.w} ${o.st})`);
      else if(o.oc === o.bg) rec(`14 · ${sel} odak halkası düğmenin kendi zeminiyle AYNI renk (${o.oc}) — görünmez`);
      else ok(`14 · ${sel} odak halkası görünür (${o.w} ${o.st} ${o.oc} · zemin ${o.bg})`);
    }
  }

  /* ---- 8 · taşma + konsol ---- */
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if(tasma <= 0) ok('8 · yatay taşma 0');
  else rec(`8 · yatay taşma ${tasma}px`);
  if(errs.length) rec('8 · konsol hatası: ' + errs.join(' | '));
  else ok('8 · konsol hatası 0');

  await ctx.close();
}

/* =====================================================================
   13 · BÜTÜN ANTRENÖR SLUG'LARI (R9)
   ---------------------------------------------------------------------
   ÖRNEKLEM DEĞİL TARAMA: `selin-aksoy` düzelirken diğerleri bozulmasın.
   Slug listesi sayfanın KENDİ `VERI` haritasından okunuyor — sınamaya
   elle yazılsaydı harita büyüdüğünde sessizce eksik kalırdı.
   Her slug'da ölçülen: aile sabiti · h1 isim düğümü slug'a bağlı mı ·
   uzmanlık satırı slug'a bağlı mı · seans ücreti slug'a bağlı mı ·
   hero'da ücret sızıntısı yok mu · hero kırpılmıyor mu · yatay taşma.
   ===================================================================== */
console.log('\n───────── 13 · slug taraması ─────────');
{
  const ctx = await browser.newContext({ viewport:{ width:1440, height:1000 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil:'domcontentloaded' });
  const sluglar = await page.evaluate(() => {
    /* harita sayfa JS'inin içinde; kaynaktan okunuyor */
    const src = [...document.querySelectorAll('script')].map(s => s.textContent).join('\n');
    const blok = src.match(/var VERI = \{([\s\S]*?)\n  \};/);
    if(!blok) return [];
    return [...blok[1].matchAll(/'([a-z-]+)'\s*:\s*\{/g)].map(m => m[1]);
  });
  if(sluglar.length < 2){ rec('13 · slug haritası okunamadı — tarama yapılamadı'); }
  else {
    console.log('     ' + sluglar.length + ' slug: ' + sluglar.join(', '));
    const gorulen = { ad:new Set(), unvan:new Set(), fiyat:new Set() };
    let kotu = 0;
    for(const width of [1440, 390]){
      await page.setViewportSize({ width, height:1000 });
      for(const sl of sluglar){
        await page.goto(`${URL}?slug=${sl}`, { waitUntil:'load' });
        await page.waitForTimeout(260);
        const m = await page.evaluate(() => {
          const top = document.querySelector('.cp-top');
          const son = document.querySelector('.cp-exp');
          const bar = document.querySelector('.cp-tabbar');
          const barY = bar.getBoundingClientRect().top + window.scrollY;
          const para = /(₺\s*[\d.]|[\d.]\s*₺)/;
          const ustte = [...document.querySelectorAll('body *')].filter(e => {
            if(e.children.length) return false;
            if(!para.test(e.textContent || '')) return false;
            if(e.closest('#aptModal')) return false;
            const r = e.getBoundingClientRect();
            return r.height > 0 && (r.top + window.scrollY) < barY;
          }).length;
          return {
            ustte,
            h: Math.round(top.getBoundingClientRect().height),
            ad: (document.querySelector('h1 [data-at="ad"]')||{}).textContent,
            unvan: (document.querySelector('.cp-spec')||{}).textContent,
            fiyat: (document.querySelector('.svc-card .svc-price b[data-at="fiyat"]')||{}).textContent,
            modal: (document.querySelector('#aptSvc label .sp')||{}).textContent,
            kirpilma: Math.round(son.getBoundingClientRect().bottom - top.getBoundingClientRect().bottom),
            tasma: document.documentElement.scrollWidth - window.innerWidth,
            baslik: document.title
          };
        });
        const hata = [];
        if(m.h !== BANNER[width]) hata.push(`banner ${m.h}≠${BANNER[width]}`);
        if(!m.ad) hata.push('h1 isim düğümü boş');
        if(!m.unvan) hata.push('uzmanlık satırı boş');
        if(!m.fiyat) hata.push('seans ücreti boş');
        if(m.fiyat && m.modal && m.fiyat !== m.modal) hata.push(`kart ücreti ${m.fiyat} ≠ modal ${m.modal}`);
        if(m.ustte > 0) hata.push(`sekme çubuğunun ÜSTÜNDE ${m.ustte} ücret düğümü`);
        if(m.kirpilma > 0) hata.push(`hero ${m.kirpilma}px kırpılıyor`);
        if(m.tasma > 0) hata.push(`yatay taşma ${m.tasma}`);
        if(m.baslik.indexOf(m.ad || '§') < 0) hata.push('sayfa başlığı slug\'a bağlı değil');
        if(width === 1440){ gorulen.ad.add(m.ad); gorulen.unvan.add(m.unvan); gorulen.fiyat.add(m.fiyat); }
        if(hata.length){ kotu++; rec(`13 · ${sl} @${width}: ` + hata.join(' · ')); }
      }
      if(!kotu) ok(`13 · @${width} · ${sluglar.length} slug'ın hepsi geçti (banner ${BANNER[width]} · kırpılma 0 · taşma 0)`);
    }
    /* slug'a bağlı olmayan alan = her antrenörde aynı değer demektir */
    eq('13 · farklı ad sayısı (hepsi slug\'a bağlı)', gorulen.ad.size, sluglar.length);
    if(gorulen.unvan.size > 1) ok(`13 · uzmanlık satırı slug'a bağlı (${gorulen.unvan.size} farklı değer)`);
    else rec('13 · uzmanlık satırı her antrenörde AYNI — slug\'a bağlı değil');
    if(gorulen.fiyat.size > 1) ok(`13 · seans ücreti slug'a bağlı (${gorulen.fiyat.size} farklı değer)`);
    else rec('13 · seans ücreti her antrenörde AYNI — slug\'a bağlı değil');
  }
  await ctx.close();
}
await browser.close();
console.log('\n════════════════════════════════════');
if(fail){ console.log(`✗ ${fail} sorun:\n  - ` + bad.join('\n  - ')); process.exit(1); }
console.log('✓ antrenor-profil: tüm ölçütler geçti');
