/* =====================================================================
   DADAFIT — R8 · AJAN-C · MODAL İSKELETİ + ANATOMİ PANELİ
   ---------------------------------------------------------------------
   Neyi kanıtlar (kalem 11 · 12 · 13 · 14 — her biri SAYIYLA):

   11 · "Randevu Al" popup'ı üç yoldan da kapanıyor (profil-v1.html)
        a) Esc  b) dışarı tıklama  c) kapat düğmesi
        + odak TETİKLEYEN elemana dönüyor
        + body scroll kilidi çözülüyor (computed overflow önce/açık/sonra)
   12 · Anatomi paneli dokunmatik dar ekranda DİYALOG: 20 ardışık Tab
        odağı panelde tutuyor, 10 Shift+Tab sarmalıyor, Esc kapatıyor,
        odak dokunulan bölgeye dönüyor
   13 · Panel orta başlıkları accordion: aria-expanded değişiyor, klavyeyle
        açılıp kapanıyor, başlık tipografisi gövdeden ayrışıyor (4 sayı)
   14 · Çip aralığı tek değer ve açıldı · @390 yatay taşma 0

   HEDEF kontrolü (HTTP değil): sayfaların h1'i beklenen kayıtla eşleşiyor.

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/modal-anatomi.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE = process.argv[2] || 'http://localhost:8811';
const sorunlar = [];
const gecen = [];
const ok  = (m) => gecen.push(m);
const rec = (baslik, detay) => sorunlar.push({ baslik, detay });

const browser = await chromium.launch();

/* --------------------------------------------------------------------
   0 · HEDEF KONTROLÜ — HTTP 200 değil, sayfanın KENDİSİ
   -------------------------------------------------------------------- */
{
  const bekle = [
    ['/profil-v1.html?role=diyetisyen&view=public', 'Elif Şahin'],
    ['/anatomi-v1.html', 'Anatomi Haritası']
  ];
  for (const [yol, h1Bekle] of bekle) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + yol, { waitUntil: 'networkidle', timeout: 30000 });
    const h1 = (await page.evaluate(() => {
      const el = document.querySelector('h1');
      return el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
    }));
    if (h1.includes(h1Bekle)) ok(`hedef ${yol} → h1 "${h1}" beklenen "${h1Bekle}" ile eşleşti`);
    else rec('hedef h1', `${yol} → h1 "${h1}", beklenen içinde "${h1Bekle}"`);
    await ctx.close();
  }
}

/* --------------------------------------------------------------------
   11 · RANDEVU POPUP'I — ÜÇ KAPATMA YOLU
   -------------------------------------------------------------------- */
{
  const URL = BASE + '/profil-v1.html?role=diyetisyen&view=public';

  for (const yol of ['esc', 'disari', 'dugme']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

    const durum = () => page.evaluate(() => {
      const m = document.getElementById('aptModal');
      const a = document.activeElement;
      return {
        acik: !!m && m.classList.contains('show'),
        gorunur: m ? getComputedStyle(m).visibility : null,
        overflow: getComputedStyle(document.body).overflow,
        odak: a ? (a.id || a.tagName) : null
      };
    });

    const once = await durum();
    const tetik = await page.$('#openApt');
    if (!tetik) { rec(`11/${yol}`, '#openApt bulunamadı — seçici doğrulanmalı'); await ctx.close(); continue; }
    await tetik.click();
    await page.waitForTimeout(350);
    const acikken = await durum();
    if (!acikken.acik) { rec(`11/${yol}`, 'popup hiç açılmadı'); await ctx.close(); continue; }

    /* AÇILIŞ ODAĞI — odak tuzağından AYRI ölçülmeli (AJAN-G'nin uyarısı).
       Tuzak ilk Tab'da odağı içeri çektiği için "20/20 içeride" ölçümü
       açılış odağı hiç düşmese bile yeşil gelir; kusuru maskeler.
       Kap `visibility .25s` geçişi taşıdığında tek rAF yetmiyordu. */
    if (yol === 'esc') {
      const ao = await page.evaluate(() => {
        const p = document.querySelector('#aptModal .apt-panel');
        const a = document.activeElement;
        return { ic: !!(p && a && p.contains(a)), ad: a ? (a.id || a.tagName) : null };
      });
      if (ao.ic) ok(`11 · açılış odağı modalın İÇİNE düştü ("${ao.ad}") — tuzaktan bağımsız ölçüldü`);
      else rec('11 · açılış odağı', `modal açık ama odak dışarıda ("${ao.ad}") — ekran okuyucu açılışı duymaz`);
    }

    if (yol === 'esc')    await page.keyboard.press('Escape');
    if (yol === 'disari') await page.mouse.click(12, 12);            // panelin dışı
    if (yol === 'dugme')  await page.click('#aptClose', { timeout: 4000 });
    await page.waitForTimeout(400);
    const sonra = await durum();

    const hata = [];
    if (sonra.acik) hata.push('popup hâlâ açık (.show duruyor)');
    if (sonra.gorunur !== 'hidden') hata.push(`visibility "${sonra.gorunur}", beklenen "hidden"`);
    if (sonra.odak !== 'openApt') hata.push(`odak "${sonra.odak}", beklenen tetikleyici "openApt"`);
    if (sonra.overflow !== once.overflow) hata.push(`body overflow "${once.overflow}" → "${sonra.overflow}" (kilit çözülmedi)`);
    if (acikken.overflow !== 'hidden') hata.push(`açıkken body overflow "${acikken.overflow}", beklenen "hidden"`);

    if (!hata.length)
      ok(`11 · ${yol} kapatıyor — overflow ${once.overflow} → açıkken ${acikken.overflow} → ${sonra.overflow}, odak "${sonra.odak}"`);
    else rec(`11 · ${yol}`, hata.join(' | '));
    await ctx.close();
  }
}

/* --------------------------------------------------------------------
   12 · ANATOMİ PANELİ — DOKUNMATİK DAR EKRANDA DİYALOG + ODAK TUZAĞI
   -------------------------------------------------------------------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/anatomi-v1.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(700);

  /* seçiciyi ÖNCE doğrula — B24 dersi: yanlış seçici 0 döndürür ve
     "kusur" gibi görünür. */
  const bolgeSayisi = await page.evaluate(() => document.querySelectorAll('#anStage [data-kas]').length);
  if (!bolgeSayisi) rec('12 · seçici', '#anStage [data-kas] → 0 düğüm; SVG yüklenmemiş olabilir');

  const acildi = await page.evaluate(() => {
    const el = document.querySelector('#anStage [data-kas]');
    if (!el) return null;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return el.getAttribute('data-kas');
  });
  await page.waitForTimeout(450);

  /* taban commit'te #anSheet HİÇ YOK — sınama çökmemeli, KIRMIZI vermeli */
  const sheetAcik = await page.evaluate(() => {
    const s = document.getElementById('anSheet');
    return !!s && s.classList.contains('show');
  });

  if (!sheetAcik) {
    rec('12 · diyalog', `bölgeye (${acildi}) dokunuldu ama panel diyalog olarak açılmadı — ` +
      `#anSheet ${await page.evaluate(() => !!document.getElementById('anSheet')) ? 'var ama .show almadı' : 'DOM\'da hiç yok'}`);
  } else {
    ok(`12 · dokunmatik @390 — bölgeye (${acildi}) dokununca panel DİYALOG olarak açıldı (${bolgeSayisi} bölge taranabilir)`);

    const nerede = () => page.evaluate(() => {
      const a = document.activeElement;
      if (!a) return { ic: false, ad: 'yok' };
      return {
        ic: !!(a.closest && a.closest('#anPanel')),
        ad: a.tagName.toLowerCase() + (a.className && typeof a.className === 'string' ? '.' + a.className.split(' ')[0] : '')
      };
    });

    /* 20 ardışık Tab */
    let icerde = 0; const disariAdim = [];
    for (let i = 1; i <= 20; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(30);
      const n = await nerede();
      if (n.ic) icerde++; else disariAdim.push(`${i}:${n.ad}`);
    }
    if (icerde === 20) ok('12 · 20 ardışık Tab — odak 20/20 adımda panel içinde');
    else rec('12 · Tab tuzağı', `20 Tab'ın ${icerde}'i içeride; dışarı kaçan adımlar → ${disariAdim.join(', ')}`);

    /* 10 Shift+Tab */
    let sIcerde = 0; const sDisari = [];
    for (let i = 1; i <= 10; i++) {
      await page.keyboard.press('Shift+Tab');
      await page.waitForTimeout(30);
      const n = await nerede();
      if (n.ic) sIcerde++; else sDisari.push(`${i}:${n.ad}`);
    }
    if (sIcerde === 10) ok('12 · 10 Shift+Tab — odak 10/10 adımda panel içinde (geriye de sarmalıyor)');
    else rec('12 · Shift+Tab tuzağı', `10 Shift+Tab'ın ${sIcerde}'i içeride; kaçanlar → ${sDisari.join(', ')}`);

    /* Esc + odak dönüşü */
    const kilitAcik = await page.evaluate(() => getComputedStyle(document.body).overflow);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const k = await page.evaluate(() => {
      const a = document.activeElement;
      return {
        acik: (function(){ const s = document.getElementById('anSheet'); return !!s && s.classList.contains('show'); })(),
        overflow: getComputedStyle(document.body).overflow,
        odakKas: a ? a.getAttribute('data-kas') : null
      };
    });
    const h = [];
    if (k.acik) h.push('Esc sonrası diyalog hâlâ açık');
    if (k.odakKas !== acildi) h.push(`odak data-kas="${k.odakKas}", beklenen tetikleyici "${acildi}"`);
    if (k.overflow === 'hidden') h.push(`body overflow "${k.overflow}" — scroll kilidi çözülmedi`);
    if (!h.length) ok(`12 · Esc kapatıyor — odak tetikleyen bölgeye ("${k.odakKas}") döndü, overflow ${kilitAcik} → ${k.overflow}`);
    else rec('12 · Esc / odak dönüşü', h.join(' | '));
  }
  await ctx.close();
}

/* --------------------------------------------------------------------
   12b · MASAÜSTÜ — TUZAK KURULMUYOR (regresyon nöbeti)
   Inline panelde odak tuzağı BİR KUSURDUR: klavye kullanıcısı footer'a
   ulaşamaz. @1440'ta odağın panelden ÇIKABİLDİĞİNİ kanıtlıyoruz.
   -------------------------------------------------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/anatomi-v1.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);
  /* GÖRÜNÜR ilk odaklanabilir — `.an-kapat` @1440'ta display:none olduğu
     için ham `querySelector` onu bulup focus()'u sessizce düşürüyordu ve
     ölçüm sahte geçiyordu (odak body'de kalınca ilk Tab zaten "dışarı"
     sayılıyor). Seçiciyi doğrulamadan sayı raporlanmaz. */
  const baslangic = await page.evaluate(() => {
    const l = [...document.querySelectorAll('#anPanel a[href],#anPanel button:not([disabled])')]
      .filter((e) => e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    if (!l.length) return null;
    l[0].focus();
    return { n: l.length, ad: l[0].tagName.toLowerCase() + '.' + (l[0].className.split(' ')[0] || ''),
             odakli: document.activeElement === l[0] };
  });
  if (!baslangic || !baslangic.odakli) rec('12b · seçici', '@1440 panelde görünür odaklanabilir bulunamadı');
  let cikti = 0;
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(20);
    const disarida = await page.evaluate(() => {
      const a = document.activeElement;
      return !!a && !(a.closest && a.closest('#anPanel'));
    });
    if (disarida) { cikti = i + 1; break; }
  }
  const sheetVar = await page.evaluate(() => {
    const s = document.getElementById('anSheet');
    return !!s && s.classList.contains('show');
  });
  if (cikti && !sheetVar && baslangic && baslangic.odakli)
    ok(`12b · @1440 panel inline — panelde ${baslangic.n} görünür odaklanabilir var, ` +
       `odak "${baslangic.ad}"tan başlayıp ${cikti}. Tab'da panelden serbestçe çıkıyor (tuzak KURULMUYOR)`);
  else rec('12b · masaüstü serbestliği',
    `@1440'ta odak 25 Tab boyunca panelden çıkamadı (sheet .show=${sheetVar}) — inline panelde tuzak kusurdur`);
  await ctx.close();
}

/* --------------------------------------------------------------------
   13 · ACCORDION + ORTA BAŞLIK TİPOGRAFİSİ (dört sayı)
   -------------------------------------------------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/anatomi-v1.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);

  const accSayi = await page.evaluate(() => document.querySelectorAll('#anPanel .an-acc').length);
  if (accSayi < 5) rec('13 · accordion sayısı', `#anPanel .an-acc → ${accSayi}, beklenen ≥5`);
  else ok(`13 · panel gövdesinde ${accSayi} accordion başlığı (button + aria-expanded)`);

  /* dört tipografi sayısı — başlık vs gövde */
  const tip = await page.evaluate(() => {
    const b = document.querySelector('#anPanel .an-acc');
    const g = document.querySelector('#anPanel .an-sec p, #anPanel .an-uyari p');
    if (!b || !g) return null;
    const cb = getComputedStyle(b), cg = getComputedStyle(g);
    return {
      basW: parseInt(cb.fontWeight, 10), basS: parseFloat(cb.fontSize),
      govW: parseInt(cg.fontWeight, 10), govS: parseFloat(cg.fontSize)
    };
  });
  if (!tip) rec('13 · tipografi', 'başlık ya da gövde seçicisi düğüm döndürmedi');
  else {
    const h = [];
    if (!(tip.basW > tip.govW)) h.push(`başlık weight ${tip.basW} ≤ gövde ${tip.govW}`);
    if (!(tip.basS > tip.govS)) h.push(`başlık size ${tip.basS} ≤ gövde ${tip.govS}`);
    if (!h.length)
      ok(`13 · başlık gövdeden ayrışıyor — başlık ${tip.basW}/${tip.basS}px · gövde ${tip.govW}/${tip.govS}px ` +
         `(Δweight ${tip.basW - tip.govW} · Δsize ${(tip.basS - tip.govS).toFixed(1)}px)`);
    else rec('13 · tipografi ayrışması', h.join(' | ') +
      ` — ölçülen: başlık ${tip.basW}/${tip.basS}px, gövde ${tip.govW}/${tip.govS}px`);
  }

  /* klavyeyle aç/kapa + aria-expanded */
  const kl = await page.evaluate(() => {
    const b = document.querySelector('#anPanel .an-acc');
    if (!b) return null;
    const govde = document.getElementById(b.getAttribute('aria-controls'));
    const bas = { exp: b.getAttribute('aria-expanded'), gizli: govde ? govde.hidden : null };
    b.focus();
    return { bas, odakli: document.activeElement === b, govdeVar: !!govde };
  });
  if (!kl || !kl.govdeVar) rec('13 · accordion yapısı', 'aria-controls ile eşleşen gövde bulunamadı');
  else if (!kl.odakli) rec('13 · klavye', 'accordion başlığı odak alamıyor (button değil?)');
  else {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const kapali = await page.evaluate(() => {
      const b = document.querySelector('#anPanel .an-acc');
      const g = document.getElementById(b.getAttribute('aria-controls'));
      return { exp: b.getAttribute('aria-expanded'), gizli: g.hidden };
    });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const tekrarAcik = await page.evaluate(() => {
      const b = document.querySelector('#anPanel .an-acc');
      const g = document.getElementById(b.getAttribute('aria-controls'));
      return { exp: b.getAttribute('aria-expanded'), gizli: g.hidden };
    });
    const h = [];
    if (kl.bas.exp !== 'true')        h.push(`açılış aria-expanded "${kl.bas.exp}", beklenen "true"`);
    if (kapali.exp !== 'false')       h.push(`1. Enter sonrası aria-expanded "${kapali.exp}", beklenen "false"`);
    if (kapali.gizli !== true)        h.push('1. Enter sonrası gövde gizlenmedi');
    if (tekrarAcik.exp !== 'true')    h.push(`2. Enter sonrası aria-expanded "${tekrarAcik.exp}", beklenen "true"`);
    if (tekrarAcik.gizli !== false)   h.push('2. Enter sonrası gövde geri gelmedi');
    if (!h.length) ok('13 · klavye — Enter ile aria-expanded true→false→true, gövde gizlenip geri geliyor');
    else rec('13 · accordion davranışı', h.join(' | '));
  }
  await ctx.close();
}

/* --------------------------------------------------------------------
   14 · ÇİP ARALIĞI — TEK DEĞER, AÇILDI, @390 TAŞMA 0
   -------------------------------------------------------------------- */
{
  for (const w of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/anatomi-v1.html', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);

    const c = await page.evaluate(() => {
      const kaplar = [...document.querySelectorAll('#anPanel .an-chips')];
      if (!kaplar.length) return null;
      const degerler = kaplar.map((k) => {
        const s = getComputedStyle(k);
        return { row: s.rowGap, col: s.columnGap };
      });
      const cip = document.querySelector('#anPanel .an-chip');
      return {
        n: kaplar.length,
        benzersiz: [...new Set(degerler.map((d) => d.row + '/' + d.col))],
        cipYuksek: cip ? Math.round(cip.getBoundingClientRect().height) : null,
        cipSayi: document.querySelectorAll('#anPanel .an-chip').length
      };
    });
    const tasma = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);

    if (!c) { rec('14 · seçici', `@${w} #anPanel .an-chips → 0 düğüm`); await ctx.close(); continue; }

    const h = [];
    if (c.benzersiz.length !== 1) h.push(`çip kaplarında ${c.benzersiz.length} farklı gap: ${c.benzersiz.join(' · ')}`);
    const [r, k] = c.benzersiz[0].split('/');
    if (r !== k) h.push(`satır/kolon aralığı farklı: ${r} / ${k} — tek değer bekleniyor`);
    if (parseFloat(r) < 12) h.push(`gap ${r}, beklenen ≥12px (önceki 8px dardı)`);
    if (tasma > 0) h.push(`@${w} yatay taşma ${tasma}px`);
    /* K53 — dokunma hedefi çapı KÜÇÜLMEMELİ */
    const altSinir = w === 390 ? 44 : 36;
    if (c.cipYuksek !== null && c.cipYuksek < altSinir)
      h.push(`K53 ihlali: çip yüksekliği ${c.cipYuksek}px < ${altSinir}px`);

    if (!h.length)
      ok(`14 · @${w} — ${c.n} çip kabı, hepsinde TEK gap ${r}, ${c.cipSayi} çip, çip yüksekliği ${c.cipYuksek}px (≥${altSinir}, K53 korundu), yatay taşma ${tasma}`);
    else rec(`14 · @${w}`, h.join(' | '));
    await ctx.close();
  }
}

await browser.close();

/* --------------------------------------------------------------------
   RAPOR
   -------------------------------------------------------------------- */
console.log('\n=== R8 · AJAN-C — MODAL İSKELETİ + ANATOMİ ===\n');
for (const g of gecen) console.log('  ✓ ' + g);
if (!sorunlar.length) {
  console.log(`\n✓ ${gecen.length} ölçümün hepsi geçti\n`);
  process.exit(0);
}
console.log(`\n✗ ${sorunlar.length} sorun\n`);
for (const s of sorunlar) console.log(`  · ${s.baslik}\n      ${s.detay}`);
console.log('');
process.exit(1);
