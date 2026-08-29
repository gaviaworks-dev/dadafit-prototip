/* =====================================================================
   DADAFIT — BUGÜNKÜ ANTRENMAN + SU + GÜN SONU NÖBETİ  (R10 · şema v2)
   ---------------------------------------------------------------------
   NEYİ KODLUYOR
   Belgenin §3.3'ü "bugün ne yapacağım" ekranını tarif ediyor. Bu tur
   öncesinde depoda 0 dosyada geçen altı şey vardı: ısınma · setler arası
   dinlenme · gereken ekipman · form sayfası · form/güvenlik uyarısı ·
   alternatif hareket. Buna "hareketi geç" ve "antrenmanı bitir" eklendi.
   §6 su takibi oturumlukdu (D16), §3.7 gün sonu formu oturumlukdu (D12).

   Bu nöbet üç sözleşmeyi birden tutar:
     1. OLUŞTURUCU şema v2 alanlarını gerçekten YAZIYOR mu (sayıyla).
     2. FİT PLANIM o alanları GÖRÜNÜR basıyor mu — ve v1 planda
        UYDURMUYOR mu (alan yoksa satır da yok).
     3. Su · gün sonu · antrenman kaydı YENİLEMEDEN SONRA duruyor mu,
        ve "Antrenmanı bitir" kanıt kademesine 'olculdu' yazıyor mu.

   GÖRÜNÜRLÜK: her ölçüm `el.getClientRects().length > 0` ile alınır.
   DOM varlığı ve innerText kelime araması kanıt sayılmaz (DENETIM §2).

   K27 — TABAN KOŞUSU (kırmızı kanıtı):
     git worktree add /tmp/r10-taban 8358446
     (cd /tmp/r10-taban && python3 -m http.server 8815)
     node tests/bugunku-antrenman.mjs http://localhost:8815

   Çalıştırma:
     node tests/bugunku-antrenman.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE   = process.argv[2] || 'http://localhost:8811';
const KOD    = 'kadin-kas-orta-salon-4-sirt-yok';   /* deterministik plan */
const OLUSTUR= 'antrenman-olusturucu-v1.html';
const PLANIM = 'programlarim-v1.html#programlarim';
const SU     = 'enerji-defteri-su-v1.html';

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);
const esit = (a, b, m) => a === b ? ok(`${m} (${a})`) : rec(m, `beklenen ${b}, ölçülen ${a}`);
const enAz = (a, b, m) => a >= b ? ok(`${m} (${a})`) : rec(m, `en az ${b} bekleniyordu, ölçülen ${a}`);

const browser = await chromium.launch();
const konsol = [];

async function ctxAc(girisli = true, tohum = null){
  const ctx = await browser.newContext({ viewport:{ width:1440, height:1000 } });
  await ctx.addInitScript(([g, t]) => { try {
    localStorage.setItem('dm-cookie-consent','accepted');
    if (g) localStorage.setItem('dm_user', JSON.stringify({auth:true, roles:['kullanici'], verified:false, level:0}));
    else   localStorage.removeItem('dm_user');
    /* TOHUM YALNIZ BİR KEZ. `addInitScript` HER gezinmede çalışır;
       koşulsuz yazarsak `reload()` planı baştan tohumlar ve az önce
       konan işaretler silinir — sonda kendi ölçtüğü kalıcılığı yok eder.
       (Bu nöbet yazılırken tam bu kusura düşüldü: "işaretler durmuyor"
       diyen üç kırmızı, kodun değil sondanın kusuruydu.) */
    if (t && !localStorage.getItem('dm_fit_planlar_v1')) localStorage.setItem('dm_fit_planlar_v1', t);
  } catch(e){} }, [girisli, tohum]);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') konsol.push(m.text()); });
  page.on('pageerror', e => konsol.push('pageerror: ' + e.message));
  return { ctx, page };
}
const gorunur = (page, sel) => page.evaluate(
  s => [...document.querySelectorAll(s)].filter(e => e.getClientRects().length > 0).length, sel);

/* =====================================================================
   1 · OLUŞTURUCU — şema v2 alanlarını yazıyor mu
   ===================================================================== */
console.log('\n1 · Oluşturucu şema v2 alanlarını yazıyor mu');
let planJSON = null;
{
  const { ctx, page } = await ctxAc(true);
  await page.goto(`${BASE}/${OLUSTUR}?plan=${KOD}`, { waitUntil:'domcontentloaded', timeout:30000 });
  try { await page.waitForSelector('#wgKaydet', { timeout:10000 }); } catch {}

  const isinmaGor = await gorunur(page, '.wg-isinma');
  enAz(isinmaGor, 1, 'sonuç ekranında GÖRÜNÜR ısınma şeridi');

  const kaydetVar = await page.$('#wgKaydet');
  if (!kaydetVar) rec('kaydet düğmesi yok', '#wgKaydet bulunamadı — plan kaydedilemedi, şema ölçülemiyor');
  else {
    await page.click('#wgKaydet');
    await page.waitForTimeout(400);
    const m = await page.evaluate(() => {
      const d = JSON.parse(localStorage.getItem('dm_fit_planlar_v1') || '{}');
      const p = (d.planlar || [])[0];
      if (!p) return null;
      let tot = 0, gun = 0, isinma = 0;
      const c = { dinlenme:0, ekipman:0, video:0, uyari:0, alternatif:0, alternatifAd:0 };
      (p.gunler || []).forEach(g => {
        gun++; if (g.isinma) isinma++;
        (g.hareketler || []).forEach(h => {
          tot++;
          Object.keys(c).forEach(k => {
            const v = h[k];
            if (v == null) return;
            if (Array.isArray(v) ? v.length : String(v).length) c[k]++;
          });
        });
      });
      return { gun, isinma, tot, c, ham: localStorage.getItem('dm_fit_planlar_v1') };
    });
    if (!m) rec('plan kaydedilmedi', 'localStorage["dm_fit_planlar_v1"] boş');
    else {
      planJSON = m.ham;
      esit(m.isinma, m.gun,  'gunler[].isinma dolu (gün başına)');
      esit(m.c.dinlenme, m.tot, 'hareketler[].dinlenme dolu');
      esit(m.c.ekipman,  m.tot, 'hareketler[].ekipman dolu');
      esit(m.c.video,    m.tot, 'hareketler[].video dolu');
      esit(m.c.uyari,    m.tot, 'hareketler[].uyari dolu');
      enAz(m.c.alternatif, 1,   'hareketler[].alternatif dolu (en hafif hareketlerde BOŞ olması doğru)');
      esit(m.c.alternatifAd, m.c.alternatif, 'alternatif taşıyan her hareket alternatifAd de taşıyor');
    }
  }
  await ctx.close();
}

/* =====================================================================
   2 · FİT PLANIM §3.3 — altı alan GÖRÜNÜR mü
   ===================================================================== */
console.log('\n2 · Fit Planım §3.3 — belge alanları görünür mü');
if (planJSON) {
  const { ctx, page } = await ctxAc(true, planJSON);
  await page.goto(`${BASE}/${PLANIM}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(700);

  const ex = await gorunur(page, '.fpx-ex');
  enAz(ex, 1, 'günün hareket kalemi görünür');
  /* ex === 0 ise §3.3 kartı hiç kurulmamıştır (taban commit'teki hâl).
     Aşağıdaki ölçümler o durumda "0 === 0" diye sessizce yeşile döner ve
     nöbet kör olur; bu yüzden her biri ex>0 şartına bağlı. */
  const kartVar = ex > 0;
  esit(await gorunur(page, '#fpxIsinma'), 1, 'ısınma bloğu görünür');
  if (kartVar) {
    esit(await gorunur(page, '.fpx-ekip'), ex, 'her harekette gereken ekipman görünür');
    esit(await gorunur(page, '.fpx-ex-uyari'), ex, 'her harekette form/güvenlik uyarısı görünür');
    esit(await gorunur(page, '.fpx-ex-bag i.fa-circle-play'), ex, 'her harekette form sayfası bağlantısı görünür');
    enAz(await gorunur(page, '.fpx-ex-bag i.fa-shuffle'), 1, 'alternatif hareket bağlantısı görünür');
    esit(await gorunur(page, '.fpx-gec'), ex, '"hareketi geç" düğmesi görünür');
    const dinlenmeSatir = await page.evaluate(() =>
      [...document.querySelectorAll('.fpx-ex-olcu')]
        .filter(e => e.getClientRects().length > 0 && /sn dinlenme/.test(e.textContent)).length);
    esit(dinlenmeSatir, ex, 'her harekette setler arası dinlenme yazılı');
  } else {
    rec('§3.3 kartı yok', '.fpx-ex kalemi 0 — ekipman · uyarı · form bağlantısı · alternatif · geç · dinlenme ölçülemedi');
  }
  esit(await gorunur(page, '#fpxKron'), 1, 'süre sayacı görünür');
  esit(await gorunur(page, '#fpxBitirBant'), 1, '"antrenmanı bitir" bandı görünür');

  /* aria-pressed sözleşmesi */
  const pressedEksik = await page.evaluate(() =>
    [...document.querySelectorAll('.fpx-mark, .fpx-gec')]
      .filter(b => !b.classList.contains('fpx-perf-ac') && !b.hasAttribute('aria-pressed')).length);
  esit(pressedEksik, 0, 'işaret/geç düğmelerinde aria-pressed eksiği');

  /* --- kron çalışmadan bitir açılmıyor, sessiz kayıt yok --- */
  const bitirVar = await page.$('#fpxBitir');
  if (!bitirVar) rec('"Antrenmanı bitir" yok', '#fpxBitir bulunamadı — antrenman kaydı ve kanıt kademesi ölçülemedi');
  else {
  const kapali = await page.evaluate(() => document.getElementById('fpxBitir').disabled);
  esit(kapali, true, 'sayaç çalışmadan "Antrenmanı bitir" kapalı');
  const g0 = await page.evaluate(() => (JSON.parse(localStorage.getItem('dm_fit')||'{}').gecmis||[]).length);
  await page.evaluate(() => document.getElementById('fpxBitir').click());
  await page.waitForTimeout(400);
  const g1 = await page.evaluate(() => (JSON.parse(localStorage.getItem('dm_fit')||'{}').gecmis||[]).length);
  esit(g1, g0, 'kapalı düğmeye tıklamak sessiz kayıt AÇMIYOR');

  /* --- işaretle · geç · performans --- */
  await page.click('.fpx-ex[data-i="0"] .fpx-mark:not(.fpx-perf-ac)');
  await page.waitForTimeout(200);
  await page.click('.fpx-ex[data-i="1"] .fpx-gec');
  await page.waitForTimeout(200);
  await page.click('.fpx-ex[data-i="2"] .fpx-perf-ac');
  await page.waitForTimeout(200);
  esit(await gorunur(page, '#fpxPerf2'), 1, 'performans paneli açılıyor');
  await page.fill('#fpxKg2', '12.5');  await page.locator('#fpxKg2').blur(); await page.waitForTimeout(150);
  await page.fill('#fpxTk2', '10');    await page.locator('#fpxTk2').blur(); await page.waitForTimeout(150);
  await page.selectOption('#fpxEf2', '7'); await page.waitForTimeout(300);

  const il = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('dm_fit_planlar_v1'));
    const p = d.planlar.find(x => x.id === d.aktifId);
    return p.ilerleme;
  });
  const anah = Object.keys(il);
  const atlandi = anah.filter(k => il[k].seviye === 'atlandi').length;
  const perf = anah.filter(k => typeof il[k].agirlik === 'number'
                             && typeof il[k].tekrarYapilan === 'number'
                             && typeof il[k].efor === 'number').length;
  esit(atlandi, 1, "'atlandi' seviyesi plana yazıldı");
  esit(perf, 1, 'agirlik + tekrarYapilan + efor plana yazıldı');

  /* ODAK NÖBETİ — bu tam olarak yaşandı ve ölçümle yakalandı:
     `isaretle()` boya()'yı tetikliyor, boya() innerHTML'i tazeliyor ve
     düzenlenen `<input>` DOM'dan siliniyordu. Sonuç: kg alanına "20"
     yazıp Tab'a basınca odak KG ALANINA geri dönüyor, sonraki "12" oraya
     yazılıyor ve ağırlık 1220 oluyordu. Klavyeyle üç alan sırayla
     dolabilmeli. */
  await page.click('.fpx-ex[data-i="3"] .fpx-perf-ac');
  await page.waitForTimeout(200);
  await page.focus('#fpxKg3');
  await page.keyboard.type('20');
  await page.keyboard.press('Tab'); await page.waitForTimeout(350);
  esit(await page.evaluate(() => document.activeElement.id), 'fpxTk3',
       'Tab performans alanları arasında ilerliyor (odak kaybolmuyor)');
  await page.keyboard.type('12');
  await page.keyboard.press('Tab'); await page.waitForTimeout(350);
  const klavye = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('dm_fit_planlar_v1'));
    const p = d.planlar.find(x => x.id === d.aktifId);
    const k = Object.keys(p.ilerleme).find(x => /-h3$/.test(x));
    return k ? p.ilerleme[k] : null;
  });
  esit(klavye && klavye.agirlik, 20,       'klavyeyle girilen ağırlık doğru yazıldı');
  esit(klavye && klavye.tekrarYapilan, 12, 'klavyeyle girilen tekrar doğru yazıldı');
  esit(await gorunur(page, '#fpxPerf3'), 1, 'düzenleme sırasında panel açık kalıyor');

  /* --- sayaç 1 sn üstüne çıkınca bitir açılıyor, kaynak 'olculdu' --- */
  await page.waitForTimeout(1600);
  const acik = await page.evaluate(() => document.getElementById('fpxBitir').disabled);
  esit(acik, false, 'sayaç çalışınca "Antrenmanı bitir" açılıyor');
  await page.click('#fpxBitir');
  await page.waitForTimeout(400);
  const kayit = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('dm_fit') || '{}');
    return { adet:(s.gecmis||[]).length, ilk:(s.gecmis||[])[0] || null, dk:(s.bugun||{}).dk };
  });
  esit(kayit.adet, 1, 'antrenman kaydı düştü');
  esit(kayit.ilk && kayit.ilk.kaynak, 'olculdu', 'kanıt kademesi ölçülen süreden geliyor');
  enAz(kayit.dk || 0, 1, 'bugun.dk ölçülen süreyle arttı');

  /* --- yenileme: işaretler ve performans DURUYOR --- */
  await page.reload({ waitUntil:'domcontentloaded' });
  await page.waitForTimeout(700);
  const durdu = await page.evaluate(() => ({
    basili: [...document.querySelectorAll('.fpx-mark:not(.fpx-perf-ac)')]
              .filter(b => b.getAttribute('aria-pressed') === 'true').length,
    gec:    [...document.querySelectorAll('.fpx-gec')]
              .filter(b => b.getAttribute('aria-pressed') === 'true').length,
    kayitli:[...document.querySelectorAll('.fpx-ex-kayitli')]
              .filter(e => e.getClientRects().length > 0).length
  }));
  esit(durdu.basili, 3, 'yenilemeden sonra "yapıldı" işaretleri duruyor');
  esit(durdu.gec, 1,    'yenilemeden sonra "atlandı" işareti duruyor');
  esit(durdu.kayitli, 2,'yenilemeden sonra girilen performans GÖRÜNÜR duruyor');
  }

  await ctx.close();
} else {
  rec('§3.3 ölçülemedi', 'oluşturucu plan üretemediği için Fit Planım ölçümü atlandı');
}

/* =====================================================================
   3 · v1 (ESKİ ŞEMA) PLAN — kırılmıyor ve UYDURMUYOR
   ===================================================================== */
console.log('\n3 · v1 plan kırılmıyor, eksik alanı uydurmuyor');
{
  const v1 = JSON.stringify({ aktifId:'p_v1', planlar:[{
    id:'p_v1', ad:'Eski Plan (v1)', kaynak:'antrenman-olusturucu',
    olusturma:'2026-01-01T00:00:00.000Z', secimler:{ gunSayisi:1 },
    gunler:[{ no:1, ad:'Gün 1', odak:'İtiş', hareketler:[
      { slug:'sinav', ad:'Şınav (Push-up)', set:3, tekrar:'8-12', sure:null },
      { slug:'plank', ad:'Plank',           set:3, tekrar:null,   sure:'30-45 sn' }
    ]}],
    ilerleme:{} }] });
  const { ctx, page } = await ctxAc(true, v1);
  await page.goto(`${BASE}/${PLANIM}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(700);
  esit(await gorunur(page, '.fpx-ex'), 2, 'v1 planın hareketleri basılıyor');
  esit(await gorunur(page, '#fpxIsinma'), 0,      'v1 planda ısınma UYDURULMUYOR');
  esit(await gorunur(page, '.fpx-ekip'), 0,       'v1 planda ekipman UYDURULMUYOR');
  esit(await gorunur(page, '.fpx-ex-uyari'), 0,   'v1 planda uyarı UYDURULMUYOR');
  esit(await gorunur(page, '.fpx-ex-bag'), 0,     'v1 planda form/alternatif bağlantısı UYDURULMUYOR');
  enAz(await gorunur(page, '.fpx-mark:not(.fpx-perf-ac)'), 2, 'v1 planda işaretleme çalışmayı sürdürüyor');
  await ctx.close();
}

/* =====================================================================
   4 · SU TAKİBİ — kalıcı ve İKİ SAYFADA AYNI  (§6 · D16)
   ===================================================================== */
console.log('\n4 · Su takibi kalıcı ve iki sayfada aynı');
{
  const { ctx, page } = await ctxAc(true);
  await page.goto(`${BASE}/${SU}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(500);
  const btn = await page.$('#suEkle');
  if (!btn) rec('"Bardak Ekle" eylemi yok', `${SU} içinde #suEkle bulunamadı — sayaç hâlâ bağlanmamış`);
  else {
    await page.click('#suEkle'); await page.click('#suEkle'); await page.click('#suEkle');
    await page.waitForTimeout(300);
    esit(await page.evaluate(() => (JSON.parse(localStorage.getItem('dm_fit')||'{}').bugun||{}).su), 3,
         'üç tıklama dm_fit.bugun.su\'ya yazıldı');
    esit(await gorunur(page, '#suBardaklar .glass.full'), 3, 'dolu bardak sayısı ekranda');

    await page.reload({ waitUntil:'domcontentloaded' });
    await page.waitForTimeout(500);
    esit(await gorunur(page, '#suBardaklar .glass.full'), 3, 'YENİLEMEDEN sonra sayaç duruyor');

    await page.goto(`${BASE}/${PLANIM}`, { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForTimeout(600);
    const planimSu = await page.evaluate(() => {
      const k = document.getElementById('fpxSuEkle');
      if (!k) return null;
      const kart = k.closest('.fp-card');
      return { dolu: [...kart.querySelectorAll('.fp-day.on')].filter(e => e.getClientRects().length > 0).length,
               rozet: (kart.querySelector('.fp-badge')||{}).textContent || '' };
    });
    if (!planimSu) rec('Fit Planım su kartı yok', '#fpxSuEkle bulunamadı');
    else {
      esit(planimSu.dolu, 3, 'Fit Planım su kartı AYNI depoyu okuyor');
      if (/\b3\s*\/\s*8\b/.test(planimSu.rozet)) ok('Fit Planım rozeti "3 / 8 bardak"');
      else rec('su rozeti ayrışmış', `beklenen "3 / 8", ölçülen "${planimSu.rozet.trim()}"`);
    }
    await page.click('#fpxSuEkle'); await page.waitForTimeout(300);
    await page.goto(`${BASE}/${SU}`, { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForTimeout(500);
    esit(await gorunur(page, '#suBardaklar .glass.full'), 4, 'Fit Planım\'dan eklenen bardak Su Takibi\'nde görünüyor');
  }
  await ctx.close();
}

/* =====================================================================
   5 · GÜN SONU (§3.7) — kalıcı ve forma geri basılıyor
   ===================================================================== */
console.log('\n5 · Gün sonu kaydı kalıcı');
{
  const { ctx, page } = await ctxAc(true);
  await page.goto(`${BASE}/${PLANIM}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(600);
  await page.click('#fpxGunSonuAc'); await page.waitForTimeout(300);
  await page.click('input[name="fpxZorluk"][value="zor"]');
  await page.click('input[name="fpxEfor"][value="8"]');
  await page.click('input[name="fpxEnerji"][value="yorgun"]');
  await page.fill('#fpxGunNotu', 'sabah yaptım');
  await page.click('#fpxGunSonu button[type="submit"]');
  await page.waitForTimeout(400);
  const gs = await page.evaluate(() => (JSON.parse(localStorage.getItem('dm_fit')||'{}').bugun||{}).gunSonu);
  if (!gs) rec('gün sonu kaydı yok', 'dm_fit.bugun.gunSonu yazılmadı — kayıt hâlâ oturumluk');
  else {
    esit(gs.zorluk, 'zor',    'zorluk kaydedildi');
    esit(gs.efor,   8,        'efor kaydedildi');
    esit(gs.enerji, 'yorgun', 'enerji kaydedildi');
    esit(gs.not,    'sabah yaptım', 'not kaydedildi');
    await page.reload({ waitUntil:'domcontentloaded' });
    await page.waitForTimeout(600);
    await page.click('#fpxGunSonuAc'); await page.waitForTimeout(300);
    const geri = await page.evaluate(() => ({
      zorluk:(document.querySelector('input[name="fpxZorluk"]:checked')||{}).value,
      efor:  (document.querySelector('input[name="fpxEfor"]:checked')||{}).value,
      not:   document.getElementById('fpxGunNotu').value
    }));
    esit(geri.zorluk, 'zor', 'yenilemeden sonra zorluk forma geri basıldı');
    esit(geri.efor,   '8',   'yenilemeden sonra efor forma geri basıldı');
    esit(geri.not, 'sabah yaptım', 'yenilemeden sonra not forma geri basıldı');
  }
  await ctx.close();
}

/* =====================================================================
   6 · GİRİŞSİZ — kapı açılıyor, sessiz yazım yok
   ===================================================================== */
console.log('\n6 · Girişsiz kullanıcı: kapı açılıyor, sessiz yazım yok');
{
  const { ctx, page } = await ctxAc(false);
  await page.goto(`${BASE}/${SU}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(500);
  const once = await page.evaluate(() => localStorage.getItem('dm_fit'));
  const btn = await page.$('#suEkle');
  if (!btn) rec('"Bardak Ekle" eylemi yok', '#suEkle bulunamadı');
  else {
    await page.click('#suEkle');
    await page.waitForTimeout(600);
    esit(await gorunur(page, '#lgGate'), 1, 'girişsizde kabuk kapısı açıldı');
    const sonra = await page.evaluate(() => localStorage.getItem('dm_fit'));
    esit(sonra === once, true, 'girişsizde depoya SESSİZ yazım yok');
  }
  await ctx.close();
}

/* =====================================================================
   7 · KONSOL
   ===================================================================== */
console.log('\n7 · Konsol');
esit(konsol.length, 0, 'konsol/JS hatası');
if (konsol.length) konsol.slice(0, 5).forEach(k => console.log('      · ' + k));

await browser.close();

console.log('');
if (fail) {
  console.log(`✗ ${fail} sorun`);
  bad.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
  process.exit(1);
}
console.log('✓ 0 sorun — §3.3 bugünkü antrenman · §6 su · §3.7 gün sonu sözleşmesi tutuyor');
