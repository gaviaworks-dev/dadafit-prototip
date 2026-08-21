/* =====================================================================
   DADAFIT — PLAN KAYDI + İLERLEME İŞARETİ TESTİ  (REVİZYON 6 · madde 18)
   ---------------------------------------------------------------------
   Neyi kanıtlar (maddenin kabul ölçütleri, tek tek):
      1. Sözleşme modülü (`assets/js/fit-plan-kayit.js`) HTTP 200 ve iki
         sayfada da yüklü — FIT_PLAN yüzeyi tarayıcıda var.
      2. Sonuç ekranında "Planı Kaydet" var; basınca plan gerçekten
         kaydediliyor ve SAYFA YENİLENDİKTEN SONRA duruyor.
      3. Kaydedilen nesne sözleşmenin şemasına uyuyor (id · ad · kaynak ·
         olusturma · secimler · gunler[].hareketler[] · ilerleme) ve
         plandaki hareket sayısı ekrandaki plana eşit.
      4. `fit-planim-programim-v1.html` planı TAM basıyor: gün sayısı ·
         hareket sayısı · her satırda set ve tekrar/süre.
      5. Bir hareket işaretlenip sayfa yenilendiğinde işaret DURUYOR.
      6. Üç seviye de çalışıyor (tam · yarim · atlandi) ve aynı düğmeye
         ikinci kez basmak işareti GERİ ALIYOR.
      7. `FIT_PLAN.ozet()` oranı DOM'daki ilerleme göstergesiyle BİREBİR
         aynı (yüzde metni + çubuğun genişliği).
      8. GİRİŞ YAPILMAMIŞ kullanıcıda akış KIRILMIYOR: kaydet düğmesi
         duruyor, kabuğun dürüst kapısını açıyor (`data-lg-gate` →
         #lgGate görünür) ve plan bağlantısı (`?plan=`) yerinde —
         girişsiz kullanıcının kalıcılığı odur.
      9. Kayıt yokken DÜRÜST BOŞ DURUM çıkıyor, uydurma plan yok.
     10. Aynı seçim ikinci kez kaydedilince yeni kayıt AÇILMIYOR (kod
         deterministik olduğu için var olan güncelleniyor).
     11. Konsol hatası 0 · yatay taşma 0 — @1440 ve @390.

   K27 — TABAN KOŞUSU (kırmızı kanıtı):
     git worktree add /tmp/r6-taban 8bf5c66
     (cd /tmp/r6-taban && python3 -m http.server 8814)
     node tests/plan-kayit.mjs http://localhost:8814
   Taban commit'te `assets/js/fit-plan-kayit.js` yok, sonuç ekranında
   kaydet eylemi yok, Programım sayfasında plan bloğu yok → süit kırmızı.

   Çalıştırma:
     python3 -m http.server 8811 &
     node tests/plan-kayit.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE   = process.argv[2] || 'http://localhost:8811';
const OLUSTUR= 'antrenman-olusturucu-v1.html';
const PLANIM = 'fit-planim-programim-v1.html';
const MODUL  = 'assets/js/fit-plan-kayit.js';
/* deterministik seçim — motor aynı planı her seferinde kurar */
const KOD    = 'kadin-kas-orta-salon-4-sirt-yok';

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

/* ---------- 1 · sözleşme modülü diskte / ağda var mı ---------- */
{
  const r = await fetch(`${BASE}/${MODUL}`);
  if (r.status === 200) ok(`sözleşme modülü ${MODUL} → HTTP 200`);
  else rec('sözleşme modülü yok', `${MODUL} → HTTP ${r.status} — madde 18 bu modül olmadan kurulamaz`);
}

const browser = await chromium.launch();

/* tarayıcı bağlamı — istenirse girişli, her zaman temiz depolama */
async function ctxAc(w, h, girisli = true) {
  const ctx = await browser.newContext({ viewport:{ width:w, height:h } });
  /* Bağlam zaten temiz açılıyor; plan anahtarına DOKUNULMUYOR — bu betik
     her gezinmede çalışır, silseydi yenileme sınaması kendi kendini
     kandırırdı (plan "uçmuş" görünürdü). */
  await ctx.addInitScript((g) => { try {
    localStorage.setItem('dm-cookie-consent','accepted');
    if (g) localStorage.setItem('dm_user', JSON.stringify({auth:true, roles:['kullanici'], verified:false, level:0}));
    else localStorage.removeItem('dm_user');
  } catch(e){} }, girisli);
  return ctx;
}
function konsolBagla(page, kova) {
  page.on('console', m => { if (m.type() === 'error') kova.push(m.text()); });
  page.on('pageerror', e => kova.push('pageerror: ' + e.message));
}
const tasma = page => page.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth);

/* =====================================================================
   ANA AKIŞ — iki genişlikte
   ===================================================================== */
for (const [w, h] of [[1440, 1000], [390, 844]]) {
  const etiket = '@' + w;
  const konsol = [];
  const ctx  = await ctxAc(w, h, true);
  const page = await ctx.newPage();
  konsolBagla(page, konsol);

  /* ---- sonuç ekranını deterministik bağlantıyla aç ---- */
  await page.goto(`${BASE}/${OLUSTUR}?plan=${KOD}`, { waitUntil:'domcontentloaded', timeout:30000 });
  try { await page.waitForFunction(() => !!document.getElementById('wgResult'), null, { timeout:8000 }); } catch {}
  await page.waitForTimeout(500);

  /* FIT_PLAN yüzeyi yüklü mü */
  const yuzey = await page.evaluate(() => {
    if (!window.FIT_PLAN) return null;
    return ['kaydet','listele','getir','sil','aktifYap','aktif','isaretle','ozet']
      .filter(k => typeof window.FIT_PLAN[k] !== 'function');
  });
  if (yuzey === null) rec(`${etiket} FIT_PLAN yok`, `${OLUSTUR} sözleşme modülünü yüklemiyor (window.FIT_PLAN tanımsız)`);
  else if (yuzey.length) rec(`${etiket} FIT_PLAN eksik`, 'eksik çağrı: ' + yuzey.join(' · '));
  else ok(`${etiket} FIT_PLAN yüzeyi oluşturucuda tam (8 çağrı)`);

  /* ---- 2 · kaydet düğmesi + ekrandaki plan ---- */
  const ekran = await page.evaluate(() => ({
    kaydet: !!document.getElementById('wgKaydet'),
    gun:    document.querySelectorAll('#wgPlan .wg-gun').length,
    hareket:document.querySelectorAll('#wgPlan .wg-hrk a').length,
    baglanti: !!document.getElementById('wgUrl')
  }));
  if (!ekran.kaydet) {
    rec(`${etiket} "Planı Kaydet" yok`, 'sonuç ekranında #wgKaydet bulunamadı — plan hâlâ uçuyor (madde 18)');
  } else ok(`${etiket} sonuç ekranında "Planı Kaydet" var (${ekran.gun} gün · ${ekran.hareket} hareket)`);

  if (ekran.kaydet) {
    await page.click('#wgKaydet');
    await page.waitForTimeout(300);

    /* ---- 3 · kaydedilen nesne sözleşmeye uyuyor mu ---- */
    const kayit = await page.evaluate(() => {
      const ham = localStorage.getItem('dm_fit_planlar_v1');
      if (!ham) return null;
      const d = JSON.parse(ham);
      const p = (d.planlar || [])[0];
      if (!p) return { bos:true };
      return {
        aktifId: d.aktifId, id: p.id, ad: p.ad, kaynak: p.kaynak,
        olusturma: p.olusturma, secimler: p.secimler,
        gun: (p.gunler || []).length,
        hareket: (p.gunler || []).reduce((a, g) => a + (g.hareketler || []).length, 0),
        ilkHareket: ((p.gunler || [])[0] || {}).hareketler?.[0] || null,
        ilerleme: p.ilerleme
      };
    });

    if (!kayit || kayit.bos) {
      rec(`${etiket} kayıt yazılmadı`, 'localStorage["dm_fit_planlar_v1"] boş — "Planı Kaydet" hiçbir şey kaydetmedi');
    } else {
      const eksik = [];
      if (!/^plan_/.test(kayit.id || '')) eksik.push('id sözleşmenin "plan_…" biçiminde değil');
      if (!kayit.ad) eksik.push('ad yok');
      if (kayit.kaynak !== 'antrenman-olusturucu') eksik.push(`kaynak "${kayit.kaynak}" (beklenen "antrenman-olusturucu")`);
      if (!kayit.olusturma) eksik.push('olusturma yok');
      if (!kayit.secimler || !kayit.secimler.gunSayisi) eksik.push('secimler.gunSayisi yok');
      if (!kayit.ilerleme || typeof kayit.ilerleme !== 'object') eksik.push('ilerleme nesnesi yok');
      if (kayit.aktifId !== kayit.id) eksik.push('kaydedilen plan aktif yapılmadı');
      const h = kayit.ilkHareket || {};
      if (!h.slug || !h.ad) eksik.push('hareket kaydı slug/ad taşımıyor');
      if (h.set === undefined) eksik.push('hareket kaydı set taşımıyor');
      if (h.tekrar === undefined && h.sure === undefined) eksik.push('hareket kaydı tekrar/süre taşımıyor');
      if (kayit.gun !== ekran.gun) eksik.push(`kayıtta ${kayit.gun} gün, ekranda ${ekran.gun}`);
      if (kayit.hareket !== ekran.hareket) eksik.push(`kayıtta ${kayit.hareket} hareket, ekranda ${ekran.hareket}`);
      if (eksik.length) rec(`${etiket} kayıt şeması`, eksik.join('\n      '));
      else ok(`${etiket} kayıt sözleşmeye uyuyor — ${kayit.gun} gün · ${kayit.hareket} hareket · "${kayit.ad}"`);

      /* ---- 10 · aynı seçim ikinci kez: yeni kayıt açılmamalı ---- */
      await page.goto(`${BASE}/${OLUSTUR}?plan=${KOD}`, { waitUntil:'domcontentloaded', timeout:30000 });
      await page.waitForTimeout(500);
      await page.click('#wgKaydet');
      await page.waitForTimeout(300);
      const sayi = await page.evaluate(() => (window.FIT_PLAN ? FIT_PLAN.listele().length : -1));
      if (sayi === 1) ok(`${etiket} aynı seçim ikinci kez kaydedildi, kayıt sayısı hâlâ 1 (kopya açılmıyor)`);
      else rec(`${etiket} kopya kayıt`, `aynı seçim iki kez kaydedilince ${sayi} kayıt oluştu`);

      /* ---- 2b · yenileme sonrası plan duruyor mu ---- */
      await page.reload({ waitUntil:'domcontentloaded' });
      await page.waitForTimeout(400);
      const kaldi = await page.evaluate(() => (window.FIT_PLAN ? FIT_PLAN.listele().length : -1));
      if (kaldi >= 1) ok(`${etiket} sayfa yenilendikten sonra plan duruyor (${kaldi} kayıt)`);
      else rec(`${etiket} plan uçtu`, 'yenilemeden sonra kayıt kalmadı');
    }
  }

  /* =====================================================================
     PLAN GÖRÜNTÜLEME + İŞARETLEME
     ===================================================================== */
  await page.goto(`${BASE}/${PLANIM}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(700);

  const bas = await page.evaluate(() => {
    const p = window.FIT_PLAN ? FIT_PLAN.aktif() : null;
    const satir = [...document.querySelectorAll('#ppPlan .pp-sat')];
    return {
      modul: !!window.FIT_PLAN,
      kok: !!document.getElementById('ppPlan'),
      planVar: !!p,
      gunDom: document.querySelectorAll('#ppPlan .pp-gun').length,
      gunPlan: p ? (p.gunler || []).length : 0,
      satirDom: satir.length,
      satirPlan: p ? (p.gunler || []).reduce((a, g) => a + (g.hareketler || []).length, 0) : 0,
      receteEksik: satir.filter(r => r.querySelectorAll('.pp-recete span').length < 2).length,
      koprusuz: satir.filter(r => !r.querySelector('a[href*="egzersiz-detay-v1.html?slug="]')).length,
      isaretsiz: satir.filter(r => r.querySelectorAll('.pp-isaret button').length !== 3).length,
      ad: p ? p.ad : null
    };
  });

  if (!bas.kok) {
    rec(`${etiket} plan bloğu yok`, `${PLANIM} içinde #ppPlan yok — kaydedilen plan görüntülenemiyor (madde 18.3)`);
  } else if (!bas.planVar) {
    rec(`${etiket} plan okunamadı`, 'FIT_PLAN.aktif() null — kaydedilen plan Programım sayfasına düşmüyor');
  } else {
    const hata = [];
    if (bas.gunDom !== bas.gunPlan) hata.push(`DOM'da ${bas.gunDom} gün kartı, planda ${bas.gunPlan} gün`);
    if (bas.satirDom !== bas.satirPlan) hata.push(`DOM'da ${bas.satirDom} hareket satırı, planda ${bas.satirPlan} hareket`);
    if (bas.receteEksik) hata.push(`${bas.receteEksik} satırda set/tekrar reçetesi eksik`);
    if (bas.koprusuz) hata.push(`${bas.koprusuz} satır kütüphane kartına köprü vermiyor`);
    if (bas.isaretsiz) hata.push(`${bas.isaretsiz} satırda üç seviyeli işaret kontrolü yok`);
    if (hata.length) rec(`${etiket} plan tam basılmıyor`, hata.join('\n      '));
    else ok(`${etiket} plan tam basılıyor — ${bas.gunDom} gün · ${bas.satirDom} hareket · set/tekrar/köprü/işaret her satırda`);
  }

  if (bas.planVar) {
    /* ---- 5·6 · işaretle → yenile → duruyor mu · geri alma ---- */
    const isaretle = async (gun, ix, sev) => {
      await page.evaluate((g) => {
        const d = document.querySelector(`#ppPlan .pp-gun[data-gun="${g}"]`);
        if (d) d.open = true;
      }, gun);
      await page.waitForTimeout(80);
      await page.click(`#ppPlan .pp-gun[data-gun="${gun}"] .pp-sat:nth-child(${ix + 1}) button.${sev}`);
      await page.waitForTimeout(180);
    };
    await isaretle(1, 0, 'tam');
    await isaretle(1, 1, 'yarim');
    await isaretle(2, 0, 'atlandi');

    const canli = await page.evaluate(() => ({
      ozet: FIT_PLAN.ozet(),
      yuzde: (document.querySelector('#ppOzet b') || {}).textContent,
      bar: (document.querySelector('#ppPlan .fp-bar>span') || {}).style?.width,
      basili: document.querySelectorAll('#ppPlan .pp-isaret button[aria-pressed="true"]').length,
      live: (document.getElementById('ppLive') || {}).textContent
    }));

    const sev = await page.evaluate(() => {
      const p = FIT_PLAN.aktif();
      return { g1h0: (p.ilerleme['g1-h0'] || {}).seviye,
               g1h1: (p.ilerleme['g1-h1'] || {}).seviye,
               g2h0: (p.ilerleme['g2-h0'] || {}).seviye };
    });
    if (sev.g1h0 === 'tam' && sev.g1h1 === 'yarim' && sev.g2h0 === 'atlandi')
      ok(`${etiket} üç seviye de yazılıyor: tam · yarim · atlandi`);
    else rec(`${etiket} işaret seviyeleri`, JSON.stringify(sev));

    /* 7 · ozet() ↔ DOM birebir */
    if (canli.ozet && canli.yuzde === '%' + canli.ozet.oran && canli.bar === canli.ozet.oran + '%')
      ok(`${etiket} FIT_PLAN.ozet().oran (${canli.ozet.oran}) DOM göstergesiyle birebir (metin "${canli.yuzde}" · çubuk ${canli.bar})`);
    else rec(`${etiket} oran ayrışması`,
      `ozet().oran=${canli.ozet && canli.ozet.oran} · DOM metni "${canli.yuzde}" · çubuk "${canli.bar}"`);

    if (canli.basili === 3) ok(`${etiket} üç işaret de arayüzde basılı görünüyor`);
    else rec(`${etiket} işaret göstergesi`, `aria-pressed="true" düğme sayısı ${canli.basili}, beklenen 3`);

    if (canli.live && /tamamlandı|işaretlendi/i.test(canli.live)) ok(`${etiket} aria-live bildirimi çalışıyor`);
    else rec(`${etiket} aria-live`, `bildirim boş: "${canli.live}"`);

    /* yenile → işaretler duruyor mu */
    await page.reload({ waitUntil:'domcontentloaded' });
    await page.waitForTimeout(700);
    const sonra = await page.evaluate(() => ({
      ozet: FIT_PLAN.ozet(),
      yuzde: (document.querySelector('#ppOzet b') || {}).textContent,
      isaret: FIT_PLAN.isaret(FIT_PLAN.aktif().id, 1, 0)
    }));
    if (sonra.isaret && sonra.isaret.seviye === 'tam' && sonra.yuzde === '%' + sonra.ozet.oran)
      ok(`${etiket} yenilemeden sonra işaretler duruyor (%${sonra.ozet.oran})`);
    else rec(`${etiket} işaret uçtu`, JSON.stringify(sonra));

    /* 6b · aynı düğmeye ikinci basış işareti geri alıyor */
    await page.evaluate(() => { const d = document.querySelector('#ppPlan .pp-gun[data-gun="1"]'); if (d) d.open = true; });
    await page.waitForTimeout(80);
    await page.click('#ppPlan .pp-gun[data-gun="1"] .pp-sat:nth-child(1) button.tam');
    await page.waitForTimeout(200);
    const geri = await page.evaluate(() => FIT_PLAN.isaret(FIT_PLAN.aktif().id, 1, 0));
    if (!geri) ok(`${etiket} aynı düğmeye ikinci basış işareti geri alıyor`);
    else rec(`${etiket} geri alma`, `işaret duruyor: ${JSON.stringify(geri)}`);
  }

  /* ---- 11 · taşma + konsol ---- */
  const t = await tasma(page);
  if (t <= 0) ok(`${etiket} Programım sayfasında yatay taşma 0`);
  else rec(`${etiket} yatay taşma`, `${t} px`);
  if (!konsol.length) ok(`${etiket} konsol hatası 0`);
  else rec(`${etiket} konsol`, konsol.join(' | '));

  await ctx.close();
}

/* =====================================================================
   9 · KAYIT YOKKEN DÜRÜST BOŞ DURUM
   ===================================================================== */
{
  const ctx = await ctxAc(1440, 900, true);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${PLANIM}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(600);
  const bos = await page.evaluate(() => {
    const k = document.getElementById('ppPlan');
    if (!k) return null;
    return {
      metin: k.textContent.replace(/\s+/g, ' ').trim(),
      gun: k.querySelectorAll('.pp-gun').length,
      kapi: !!k.querySelector('a[href="antrenman-olusturucu-v1.html"]')
    };
  });
  if (!bos) rec('boş durum', '#ppPlan yok');
  else if (bos.gun === 0 && /plan/i.test(bos.metin) && bos.kapi)
    ok('kayıt yokken dürüst boş durum: uydurma plan yok, Antrenman Oluşturucu\'ya kapı var');
  else rec('boş durum', `gün kartı ${bos.gun} · kapı ${bos.kapi} · metin "${bos.metin.slice(0, 80)}"`);
  await ctx.close();
}

/* =====================================================================
   8 · GİRİŞ YAPILMAMIŞ KULLANICI — akış kırılmıyor
   ===================================================================== */
{
  const konsol = [];
  const ctx = await ctxAc(1440, 900, false);
  const page = await ctx.newPage();
  konsolBagla(page, konsol);
  await page.goto(`${BASE}/${OLUSTUR}?plan=${KOD}`, { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(700);

  const d = await page.evaluate(() => {
    const b = document.getElementById('wgKaydet');
    return {
      auth: document.body.classList.contains('is-auth'),
      kaydet: !!b,
      kapi: !!(b && b.hasAttribute('data-lg-gate')),
      gunler: document.querySelectorAll('#wgPlan .wg-gun').length,
      baglanti: (document.getElementById('wgUrl') || {}).value || ''
    };
  });

  if (d.auth) rec('giriş durumu', 'girişsiz bağlam kurulamadı (body.is-auth duruyor) — ölçüm geçersiz');
  else if (!d.kaydet) rec('girişsiz akış', 'kaydet düğmesi girişsizken kayboluyor — akış kırılıyor');
  else if (!d.kapi) rec('girişsiz akış', 'kaydet düğmesi girişsizken data-lg-gate taşımıyor (sessiz kayıt ya da sessiz hata)');
  else if (!d.gunler) rec('girişsiz akış', 'girişsiz kullanıcıya plan üretilmiyor');
  else if (!/\?plan=/.test(d.baglanti)) rec('girişsiz akış', 'plan bağlantısı yok — girişsiz kullanıcının kalıcılığı kalmıyor');
  else {
    await page.click('#wgKaydet');
    await page.waitForTimeout(400);
    const kapi = await page.evaluate(() => {
      const g = document.getElementById('lgGate');
      return { acik: !!(g && g.classList.contains('show')),
               kayit: !!localStorage.getItem('dm_fit_planlar_v1') };
    });
    if (kapi.acik && !kapi.kayit)
      ok(`girişsiz kullanıcı: plan görünüyor (${d.gunler} gün) · kaydet dürüst kapıyı açıyor · sessiz kayıt yok · ?plan= bağlantısı yerinde`);
    else rec('girişsiz kapı', `kapı açık:${kapi.acik} · sessiz kayıt:${kapi.kayit}`);
  }
  if (konsol.length) rec('girişsiz konsol', konsol.join(' | '));
  await ctx.close();
}

await browser.close();

console.log('');
if (fail) { console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
