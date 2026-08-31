/* =====================================================================
   PAKET KADEMESİ — TEK KAYNAK SONDASI
   ---------------------------------------------------------------------
   NEDEN VAR: kademeyi okuyan yüzeyler iki ayrı kaynaktan okuyordu.
     · `assets/js/fit-shell.js` ve `hesabim-v1.html` → `dm_user.paket`
       (doğru kaynak; paket SATIN ALINIR, `pro-odeme` oraya yazar)
     · `paketlerim-v1.html` ve `odemelerim-v1.html` → yalnız `?paket=`
       sorgu parametresi, **varsayılanı `'pro'`**
   Sonuç ölçülmüştü: ücretsiz üye Paketlerim'de kendini Pro görüyordu ve
   Ödemelerim ona "sonraki tahsilat 15 Eylül" diyordu; Pro Max üyeye de
   Pro satılmaya çalışılıyordu.

   NE ÖLÇER: üç kademenin (ucretsiz · pro · pro_max) her biri için DÖRT
   yüzey aynı kullanıcı hakkında AYNI şeyi mi söylüyor.
     1. Kabuk profil kartı  → `.fp-badge.is-paket`   (her sayfada)
     2. `hesabim-v1.html`   → `[data-paket]`
     3. `paketlerim-v1.html`→ `#pkAktif .sub-tier-badge`
     4. `odemelerim-v1.html`→ `#odAbone .sub-tier-badge`
   Ayrıca `?paket=` anahtarının GÖSTERİM amaçlı çalışmaya devam ettiğini
   ve gerçek kademeyi kalıcı olarak EZMEDİĞİNİ denetler.

   Son olarak UÇTAN UCA: `pro-odeme-v1.html` akışı tamamlanınca yazdığı
   kademe dört yüzeyde de görünüyor mu — tohumlanmış değil, gerçekten
   satın alınmış kademe.

   KULLANIM
     python3 -m http.server 8788 &
     PW_HOME=~/.pw node docs/qa/kademe-tek-kaynak.mjs
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';

/* `dm_user.paket` değeri ←→ ekranda okunması gereken ad.
   ⚠ İki ayrı yazım var ve ikisi de gerçek: depo anahtarı `pro_max`
   (alt çizgili, `pro-odeme-v1.html` onu yazıyor), `FIT_PAKET` kademe
   anahtarı `promax` (çizgisiz). Sonda ikisini de tanır. */
const KADEMELER = [
  { depo: null,      ad: 'Ücretsiz', qp: 'ucretsiz' },
  { depo: 'pro',     ad: 'Pro',      qp: 'pro' },
  { depo: 'pro_max', ad: 'Pro Max',  qp: 'promax' }
];

const YUZEYLER = [
  { ad: 'kabuk',      url: '/hesabim-v1.html',     sel: '.fp-badge.is-paket' },
  { ad: 'hesabim',    url: '/hesabim-v1.html',     sel: '[data-paket]' },
  { ad: 'paketlerim', url: '/paketlerim-v1.html',  sel: '#pkAktif .sub-tier-badge' },
  { ad: 'odemelerim', url: '/odemelerim-v1.html',  sel: '#odAbone .sub-tier-badge' }
];

const browser = await chromium.launch();
const hatalar = [];
const bekle = (k, d, ek) => { if (!k) hatalar.push(d + (ek ? ' — ' + ek : '')); return k; };

async function oku(ctx, yuzey, ek) {
  const pg = await ctx.newPage();
  pg.on('pageerror', e => hatalar.push(`${yuzey.ad} pageerror: ${e.message}`));
  await pg.goto(BASE + yuzey.url + (ek || ''), { waitUntil: 'load' });
  await pg.waitForTimeout(600);
  const t = await pg.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : null;
  }, yuzey.sel);
  await pg.close();
  return t;
}

for (const W of [1440, 390]) {
  console.log(`\n══════ @${W}px ══════`);

  for (const k of KADEMELER) {
    const ctx = await browser.newContext({ viewport: { width: W, height: 1100 }, reducedMotion: 'reduce' });
    await ctx.addInitScript((paket) => {
      try {
        localStorage.setItem('dm-cookie-consent', 'all');
        const u = { auth: true, roles: ['kullanici'], verified: false, level: 0 };
        if (paket) u.paket = paket;
        localStorage.setItem('dm_user', JSON.stringify(u));
      } catch (e) {}
    }, k.depo);

    const okunan = {};
    for (const y of YUZEYLER) okunan[y.ad] = await oku(ctx, y);

    const hepsi = Object.keys(okunan).map(a => okunan[a]);
    const uyumlu = hepsi.every(t => t && t.indexOf(k.ad) >= 0);
    bekle(uyumlu, `@${W} · dm_user.paket=${k.depo || '(yok)'} için yüzeyler ayrışıyor`,
      JSON.stringify(okunan));
    console.log(`  ${(k.depo || 'yok').padEnd(8)} → beklenen "${k.ad}"  ` +
      YUZEYLER.map(y => `${y.ad}:${okunan[y.ad] || 'YOK'}`).join(' · ') + (uyumlu ? '  ✅' : '  🔴'));

    await ctx.close();
  }

  /* ---- `?paket=` yalnız GÖSTERİM: ekranı değiştirir, kaydı değiştirmez ---- */
  {
    const ctx = await browser.newContext({ viewport: { width: W, height: 1100 }, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('dm-cookie-consent', 'all');
        localStorage.setItem('dm_user', JSON.stringify({ auth: true, roles: ['kullanici'], verified: false, level: 0 }));
      } catch (e) {}
    });
    /* Gerçek kademe Ücretsiz; URL Pro Max diyor. */
    const gosterim = await oku(ctx, YUZEYLER[2], '?paket=promax');
    bekle(gosterim && gosterim.indexOf('Pro Max') >= 0,
      `@${W} · ?paket= maket anahtarı gösterimi değiştirmiyor`, String(gosterim));

    const pg = await ctx.newPage();
    await pg.goto(BASE + '/paketlerim-v1.html?paket=promax', { waitUntil: 'load' });
    await pg.waitForTimeout(500);
    const kayit = await pg.evaluate(() => {
      try { return (JSON.parse(localStorage.getItem('dm_user') || 'null') || {}).paket || null; }
      catch (e) { return 'OKUNAMADI'; }
    });
    await pg.close();
    bekle(kayit === null, `@${W} · ?paket= gerçek kademeyi EZDİ`, `dm_user.paket=${kayit}`);

    /* URL'den sonra parametresiz açılış yine gerçek kademeyi göstermeli */
    const sonra = await oku(ctx, YUZEYLER[2]);
    bekle(sonra && sonra.indexOf('Ücretsiz') >= 0,
      `@${W} · ?paket= sonrası kalıcı sapma var`, String(sonra));
    console.log(`  ?paket=promax → gösterim "${gosterim}" · kayıt ${kayit === null ? 'DEĞİŞMEDİ' : kayit} · sonraki açılış "${sonra}"  ` +
      (gosterim && kayit === null && sonra && sonra.indexOf('Ücretsiz') >= 0 ? '✅' : '🔴'));
    await ctx.close();
  }
}

/* ---- UÇTAN UCA · satın al, dört yüzeyde de gör ---- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('dm-cookie-consent', 'all');
      localStorage.setItem('dm_fit_fatura_v1', JSON.stringify({
        tip: 'bireysel', ulke: 'TR', efatura: false, varsayilan: true,
        ftAd: 'Elif Şahin', ftTel: '5551112233', ftEposta: 'elif@ornek.com',
        ftIl: 'İstanbul', ftIlce: 'Kadıköy',
        ftAdres: 'Caferağa Mah. Moda Cad. No:12 D:4', ftPosta: '34710'
      }));
    } catch (e) {}
  });

  const pg = await ctx.newPage();
  pg.on('pageerror', e => hatalar.push(`uçtan uca pageerror: ${e.message}`));
  await pg.goto(BASE + '/paketlerim-v1.html', { waitUntil: 'load' });
  await pg.waitForTimeout(500);
  const once = await pg.evaluate(() => {
    const el = document.querySelector('#pkAktif .sub-tier-badge');
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : null;
  });
  bekle(once && once.indexOf('Ücretsiz') >= 0, 'uçtan uca · başlangıçta Ücretsiz olmalıydı', String(once));

  await pg.goto(BASE + '/pro-odeme-v1.html?plan=promax', { waitUntil: 'load' });
  await pg.waitForTimeout(500);
  await pg.click('label[for="agreePro"]');
  await pg.click('#startSub');
  await pg.waitForTimeout(800);
  await pg.close();

  const sonra = {};
  for (const y of YUZEYLER) sonra[y.ad] = await oku(ctx, y);
  const hepsiProMax = Object.keys(sonra).every(a => sonra[a] && sonra[a].indexOf('Pro Max') >= 0);
  bekle(hepsiProMax, 'uçtan uca · satın alınan kademe her yüzeyde görünmüyor', JSON.stringify(sonra));
  console.log(`\n  UÇTAN UCA · Ücretsiz "${once}" → Pro Max satın alındı → ` +
    YUZEYLER.map(y => `${y.ad}:${sonra[y.ad]}`).join(' · ') + (hepsiProMax ? '  ✅' : '  🔴'));
  await ctx.close();
}

await browser.close();
console.log('\n' + '─'.repeat(60));
if (hatalar.length) {
  console.log(`🔴 ${hatalar.length} BULGU:`);
  hatalar.forEach(h => console.log('   · ' + h));
  process.exit(1);
}
console.log('✅ GEÇTİ — dört yüzey üç kademede de aynı şeyi söylüyor; ?paket= yalnız gösterim.');
