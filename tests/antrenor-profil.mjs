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

  /* ---- 1 · HEDEF ---- */
  const h1 = await page.$eval('h1', e => e.textContent.trim()).catch(() => null);
  eq('1 · h1 metni', h1, H1);
  if(h1 !== H1){ /* hedef yanlışsa gerisi anlamsız */ await ctx.close(); continue; }

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
    const band = document.querySelector('.cp-band');
    const y = e => e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : null;
    /* bölüm sırasında kaçıncı blok: main'in doğrudan çocukları arasında */
    const kids = [...document.querySelector('main.page-main').children]
                   .filter(e => e.getBoundingClientRect().height > 0);
    return {
      etiket: lbl ? lbl.textContent.trim() : null,
      hucre: cells.length,
      grup: row.getAttribute('role'),
      ariaLabel: row.getAttribute('aria-label'),
      yerTutucu: cells.filter(c => c.hasAttribute('data-yer-tutucu')).length,
      ytAria: cells.filter(c => c.querySelector('[aria-label]')).length,
      sonrasiSekme: y(row) < y(bar),
      sonrasiBand: band ? y(row) > y(band) : false,
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
    eq('3 · randevu kartından SONRA', exp.sonrasiBand, 'true');
    eq('3 · sekme çubuğundan ÖNCE', exp.sonrasiSekme, 'true');
    eq('3 · main içindeki sıra (kırıntı ayrı sayılırsa 4.)', exp.sira, 3);
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
    eq('5 · sekme sayısı', tb.sekme, 4);
    eq('5 · panel sayısı', tb.panel, 4);
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
    for(let i=0;i<4;i++){ await page.keyboard.press('ArrowRight'); await page.waitForTimeout(90); adim.push((await nerede()).tab); }
    await page.keyboard.press('Home'); await page.waitForTimeout(90);
    const home = await nerede();
    await page.keyboard.press('End'); await page.waitForTimeout(90);
    const end = await nerede();
    console.log('     klavye izi: → ' + adim.join(' | → ') + ' | Home→' + home.tab + ' | End→' + end.tab);
    /* 4 sekmede 4 sağ ok = başa döner */
    eq('6 · → ×4 başa dönüyor', adim[3], 'hakkinda');
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
    const e = document.querySelector('.cp-portre');
    if(!e) return { yok:true };
    return { yt: e.getAttribute('data-yer-tutucu'), aria: e.getAttribute('aria-label'), rol: e.getAttribute('role') };
  });
  if(portre.yok) rec('4b · .cp-portre YOK');
  else if(!portre.yt) rec('4b · .cp-portre yer tutucu işareti taşımıyor — iskelet portre bekliyor, kutudaki kare portre değil');
  else if(!portre.aria) rec('4b · .cp-portre durumu anlatan aria-label taşımıyor');
  else ok('4b · portre kutusu yer tutucu olarak işaretli: ' + portre.yt);

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

  /* ---- 8 · taşma + konsol ---- */
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if(tasma <= 0) ok('8 · yatay taşma 0');
  else rec(`8 · yatay taşma ${tasma}px`);
  if(errs.length) rec('8 · konsol hatası: ' + errs.join(' | '));
  else ok('8 · konsol hatası 0');

  await ctx.close();
}

await browser.close();
console.log('\n════════════════════════════════════');
if(fail){ console.log(`✗ ${fail} sorun:\n  - ` + bad.join('\n  - ')); process.exit(1); }
console.log('✓ antrenor-profil: tüm ölçütler geçti');
