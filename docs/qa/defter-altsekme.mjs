/* =====================================================================
   NÖBET · Egzersizlerim — dört modül sekmesi + dört Enerji Defteri
   alt sekmesi                                            (R16/2 · birleştirme)
   ---------------------------------------------------------------------
   NEYİ KODLUYOR: `enerji-defteri-dengele-v1` · `enerji-defteri-su-v1` ·
   `enerji-defteri-haftalik-v1` · `aktivite-gunlugu-v1` sayfaları
   `egzersizlerim-v1.html`in içine taşındı. Sözleşme:

     · Modül şeridi DÖRT kalem taşır; her biri kendi panelini açar,
       diğer üçü `hidden` olur.
     · Enerji Defteri panelinin İÇİNDE `data-fit-tabs-scope` ile
       kapsanmış DÖRT alt sekme vardır (`defter-*` önekli anahtarlar);
       alt şerit dış panelleri, dış şerit alt panelleri GÖRMEZ.
     · Sekme değişince modül kimlik kartı YERİNDE kalır (scroll yok).
     · Sayfa gövdesinde silinen beş sayfaya giden bağlantı KALMAZ.
     · Tekrar eden `id` yoktur; konsol temizdir; yatay taşma yoktur;
       `.fit-tab` dokunma hedefi ≥ 44px'tir (kit §6).

   TABAN COMMIT'TE KIRMIZI: birleştirmeden önce bu sayfada `aktivite`
   sekmesi ve dört alt sekmenin hiçbiri yoktu — nöbet 9173acc'de
   "modül sekmesi 3/4" ve "alt sekme 0/4" ile düşer.

   KOŞ:  PW_HOME=$HOME/.pw node docs/qa/defter-altsekme.mjs
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';

const URL = 'http://127.0.0.1:8099/egzersizlerim-v1.html';
const OLU = ['enerji-defteri-dengele-v1.html', 'enerji-defteri-su-v1.html',
             'enerji-defteri-haftalik-v1.html', 'dadafit-kopru-v1.html',
             'aktivite-gunlugu-v1.html'];
const MODUL = ['egzersizlerim', 'antrenorum', 'defter', 'aktivite'];
const ALT   = ['defter-bugun', 'defter-dengele', 'defter-su', 'defter-haftalik'];
const EN    = [1440, 1024, 390];

const rapor = [];
let kirmizi = 0;
function ol(ad, deger, bekle, ok) {
  const gecti = ok === undefined ? deger === bekle : ok;
  if (!gecti) kirmizi++;
  rapor.push((gecti ? '  yeşil ' : '  KIRMIZI ') + ad + ' → ' + deger + '  (beklenen ' + bekle + ')');
}

const b = await chromium.launch();

/* Sekmeye tıklama YOK-TOLERANSLI: taban commit'te bu sayfada `aktivite`
   sekmesi ve dört alt sekme HİÇ YOKTU. `pg.click` orada 30 sn bekleyip
   istisna atardı ve nöbet SAYI üretmeden düşerdi (DENETIM §5: "exit 1
   yetmez, kaç sorunla kırmızı olduğu yazmalı"). Eksik sekme artık sessizce
   `false` döner ve ilgili ölçüm eksik sayılır. */
async function tikla(pg, sec) {
  const el = await pg.$(sec);
  if (!el) return false;
  try { await el.click({ timeout: 2000 }); return true; }
  catch (e) { return false; }
}

for (const w of EN) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1000 } });
  const pg = await ctx.newPage();
  const hata = [];
  pg.on('console', m => { if (m.type() === 'error') hata.push(m.text()); });
  pg.on('pageerror', e => hata.push(String(e)));

  rapor.push('\n=== ' + w + ' px ===');
  await pg.goto(URL, { waitUntil: 'load' });
  await pg.waitForTimeout(500);

  /* ---- 1 · tekrar eden id ---- */
  const dupe = await pg.evaluate(() => {
    const say = {};
    document.querySelectorAll('[id]').forEach(e => { say[e.id] = (say[e.id] || 0) + 1; });
    return Object.keys(say).filter(k => say[k] > 1);
  });
  ol('tekrar eden id', dupe.length + (dupe.length ? ' (' + dupe.join(', ') + ')' : ''), 0, dupe.length === 0);

  /* ---- 2 · silinen sayfalara bağlantı (gövde + kabuk ayrı sayılır) ---- */
  const bag = await pg.evaluate(o => {
    const say = (kok) => [...kok.querySelectorAll('a[href]')]
      .filter(a => o.some(x => a.getAttribute('href').indexOf(x) > -1)).length;
    return { govde: say(document.getElementById('pageMain')), tum: say(document) };
  }, OLU);
  ol('gövdede silinen sayfaya bağlantı', bag.govde, 0);
  rapor.push('  bilgi · kabuk dahil toplam: ' + bag.tum + ' (kabuk menüsü Ajan 4/lead\'in işi)');

  /* ---- 3 · dört modül sekmesi ---- */
  let modulOk = 0;
  for (const k of MODUL) {
    if (!(await tikla(pg, '[data-fit-tabs] .fit-tab[data-tab="' + k + '"]'))) {
      rapor.push('  ! ' + k + ' → modül sekmesi YOK'); continue;
    }
    await pg.waitForTimeout(160);
    const d = await pg.evaluate(key => {
      const govde = document.querySelector('.modul-govde');
      const panes = [...govde.children].filter(e => e.matches('.fit-pane[data-pane]'));
      return {
        acik: panes.filter(p => !p.hidden).map(p => p.getAttribute('data-pane')),
        hedef: key
      };
    }, k);
    if (d.acik.length === 1 && d.acik[0] === k) modulOk++;
    else rapor.push('  ! ' + k + ' → açık panel: ' + JSON.stringify(d.acik));
  }
  ol('modül sekmesi doğru panel açtı', modulOk + '/4', '4/4', modulOk === 4);

  /* ---- 4 · dört alt sekme (Enerji Defteri paneli içinde) ---- */
  await tikla(pg, '[data-fit-tabs] .fit-tab[data-tab="defter"]');
  await pg.waitForTimeout(160);
  let altOk = 0;
  for (const k of ALT) {
    if (!(await tikla(pg, '[data-fit-tabs="defterAlt"] .fit-tab[data-tab="' + k + '"]'))) {
      rapor.push('  ! ' + k + ' → alt sekme YOK'); continue;
    }
    await pg.waitForTimeout(160);
    const d = await pg.evaluate(key => {
      const kapsam = document.querySelector('[data-pane="defter"]');
      const alt = [...kapsam.querySelectorAll('.fit-pane[data-pane]')];
      return {
        acik: alt.filter(p => !p.hidden).map(p => p.getAttribute('data-pane')),
        defterAcik: !kapsam.hidden
      };
    }, k);
    if (d.defterAcik && d.acik.length === 1 && d.acik[0] === k) altOk++;
    else rapor.push('  ! ' + k + ' → açık alt panel: ' + JSON.stringify(d.acik));
  }
  ol('alt sekme doğru panel açtı', altOk + '/4', '4/4', altOk === 4);

  /* ---- 5 · kimlik kartı alt sekme değişince YERİNDE kalıyor mu ---- */
  const kartTop = [];
  for (const k of ALT) {
    if (!(await tikla(pg, '[data-fit-tabs="defterAlt"] .fit-tab[data-tab="' + k + '"]'))) continue;
    await pg.waitForTimeout(160);
    kartTop.push(await pg.evaluate(() => {
      const e = document.querySelector('.fp-profil, .fp-kimlik');
      return e ? Math.round(e.getBoundingClientRect().top) : null;
    }));
  }
  const sabit = kartTop.length === ALT.length && kartTop.every(t => t !== null && t === kartTop[0]);
  ol('kimlik kartı boundingBox.top sabit', kartTop.join(' · '), 'dördü de aynı', sabit);

  /* ---- 6 · .fit-tab dokunma hedefi (kit §6 · 44px) ---- */
  const kisa = await pg.evaluate(() => {
    return [...document.querySelectorAll('.fit-tab')]
      .filter(t => t.getClientRects().length > 0)
      .map(t => ({ k: t.getAttribute('data-tab'), h: Math.round(t.getBoundingClientRect().height) }))
      .filter(x => x.h < 44);
  });
  ol('.fit-tab yüksekliği < 44px olan', kisa.length + (kisa.length ? ' ' + JSON.stringify(kisa) : ''), 0, kisa.length === 0);

  /* ---- 7 · yatay taşma (her sekme ve alt sekme açıkken) ---- */
  let tasma = 0;
  for (const k of MODUL) {
    if (!(await tikla(pg, '[data-fit-tabs] .fit-tab[data-tab="' + k + '"]'))) continue;
    await pg.waitForTimeout(160);
    if (k === 'defter') {
      for (const a of ALT) {
        if (!(await tikla(pg, '[data-fit-tabs="defterAlt"] .fit-tab[data-tab="' + a + '"]'))) continue;
        await pg.waitForTimeout(160);
        if (await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) tasma++;
      }
    } else if (await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) tasma++;
  }
  ol('yatay taşan sekme', tasma, 0);

  /* ---- 8 · hash ---- */
  const hashler = { '#defter': 'defter', '#aktivite': 'aktivite',
                    '#defter-su': 'defter-su', '#defter-haftalik': 'defter-haftalik',
                    '#su': 'defter-su', '#dengele': 'defter-dengele', '#haftalik': 'defter-haftalik' };
  let hashOk = 0;
  for (const h of Object.keys(hashler)) {
    await pg.goto(URL + h, { waitUntil: 'load' });
    await pg.waitForTimeout(420);
    const secili = await pg.evaluate(() =>
      [...document.querySelectorAll('[data-fit-tabs] .fit-tab[aria-selected="true"]')]
        .map(t => t.getAttribute('data-tab')));
    if (secili.indexOf(hashler[h]) > -1) hashOk++;
    else rapor.push('  ! ' + h + ' → seçili: ' + JSON.stringify(secili) + ' (beklenen ' + hashler[h] + ')');
  }
  ol('hash doğru sekmeyi açtı', hashOk + '/' + Object.keys(hashler).length,
     Object.keys(hashler).length + '/' + Object.keys(hashler).length,
     hashOk === Object.keys(hashler).length);

  /* ---- 9 · konsol ---- */
  ol('konsol hatası', hata.length + (hata.length ? ' → ' + hata.slice(0, 3).join(' | ') : ''), 0, hata.length === 0);

  await ctx.close();
}

await b.close();
console.log(rapor.join('\n'));
console.log('\n' + (kirmizi === 0 ? 'YEŞİL — kırmızı 0' : 'KIRMIZI — ' + kirmizi + ' ölçüm düştü'));
process.exit(kirmizi === 0 ? 0 : 1);
