/* =====================================================================
   DADAFIT — İNTERAKTİF ANATOMİ / KAS HARİTASI TESTİ      (H2 · 6. oturum)
   ---------------------------------------------------------------------
   Neyi kanıtlar (brief'in 11 kabul ölçütü, tek tek ve ÖLÇEREK):
     1.  `anatomi-v1.html` HTTP 200
     2.  Her bölge tıklanabilir — DÖRT SVG'deki HER [data-kas] path'i tek
         tek, GERÇEK fare tıklamasıyla. Tıklama noktası path'in kendi
         dolgusundan (`isPointInFill`) seçiliyor ve tıklamadan önce
         `elementFromPoint` ile o path'e düştüğü doğrulanıyor — yani
         "üstünü başka bir katman kapatmış" durumu da yakalanır.
     3.  Panel her kasta dolu — altı alanın (TR+Latince · fonksiyon ·
         köken/yapışma · komşular · hareketler · güvenlik) hepsi boş değil
     4.  Karşılıksız bölge 0 — ÇİFT YÖNLÜ: SVG→veri ve veri→SVG
     5.  Hareket köprüleri HTTP 200
     6.  `?kas=` derin bağlantısı — her slug doğrudan açıldığında doğru
         kası seçili ve doğru görünümü (ön/arka) açık getiriyor
     7.  @390 yatay taşma 0 ve harita panelin ÜSTÜNDE (geometriyle)
     8.  Klavye — Tab ile bölgeye ulaşılıyor, Enter seçiyor, aria-pressed
     9.  Banner LİSTE ailesi — @1440 544 · @1024 607 · @390 587, birebir
     10. Konsol hatası 0 @1440 ve @390
     11. Menü kalemi — "Hareketi Anlamak" üst menüde VE drawer'da, üst menü
         kalem sayısı bozulmamış, grubun href'leri diskte

   Çalıştırma:
     python3 -m http.server 8822 &
     export PW_HOME=~/.pw
     node tests/anatomi.mjs http://localhost:8822
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync, readFileSync } from 'node:fs';

const BASE  = process.argv[2] || 'http://localhost:8822';
const SAYFA = 'anatomi-v1.html';
const KOK   = new URL('..', import.meta.url);
const DISK  = new Set(readdirSync(KOK).filter(f => f.endsWith('.html')));

/* H1'in branch'inde üretilen, bu worktree'de HENÜZ olmayan sayfa.
   Menü kalemi brief gereği şimdi yazılıyor; kırıklık birleştirmeden
   sonra kapanır. Test bunu "bilinen açık" olarak raporlar, sessizce
   geçmez. */
const BIRLESTIRME_SONRASI = new Set(['sozluk-v1.html', 'sozluk-detay-v1.html']);

/* Egzersiz kütüphanesinin GERÇEK slug'ları — uydurma slug yakalanır */
const GERCEK_HAREKET = new Set([
  'goblet-squat','plank','dambil-kurek','sinav',
  'hamle','dambil-omuz-press','dambil-biceps','dead-bug',
  'kettlebell-swing','bant-cekme','kopru','bant-yana-acma',
  'hava-squat','ters-sinav','superman','yuzucu',
  'barfiks','sehpa-dips','bulgar-split-squat','tek-bacak-kopru',
  'yan-plank','dag-tirmanisi','burpee','dambil-gogus-press',
  'dambil-romanya'
]);

/* Brief'in kanonik 27 slug sözlüğü — eksiği olamaz */
const KANONIK = [
  'boyun','trapez-ust','deltoid-on','deltoid-yan','gogus','serratus',
  'biceps','on-kol-fleksor','karin-duz','karin-yan',
  'kalca-fleksor','quadriceps','adduktor','tibialis-on',
  'trapez-orta-alt','latissimus','romboid','deltoid-arka','rotator-manset',
  'triceps','on-kol-ekstansor','erector-spinae',
  'gluteus-maximus','gluteus-medius','hamstring','gastrocnemius','soleus'
];

const BANNER = { 1440: 544, 1024: 607, 390: 587 };

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);
const not = (m) => console.log('  · ' + m);

/* ---- veri dosyasını node tarafında da oku (SVG↔veri karşılaştırması) ---- */
const VERI = (() => {
  const src = readFileSync(new URL('assets/js/anatomi-veri.js', KOK), 'utf8');
  const kap = { window: {} };
  new Function('window', src)(kap.window);
  return kap.window.ANATOMI_VERI;
})();

/* ---- dört SVG'nin data-kas listesi (dosyadan, tarayıcısız) ---- */
const SVG_SLUG = {};
for (const [ad, yol] of Object.entries(VERI.haritalar)) {
  const s = readFileSync(new URL(yol, KOK), 'utf8');
  SVG_SLUG[ad] = [...s.matchAll(/data-kas="([a-z0-9-]+)"/g)].map(m => m[1]);
}

const browser = await chromium.launch();

/* =================================================================
   1 · SAYFA VAR MI
   ================================================================= */
{
  const r = await fetch(`${BASE}/${SAYFA}`);
  if (r.status === 200) ok(`${SAYFA} → HTTP 200`);
  else rec('sayfa yok', `${SAYFA} → HTTP ${r.status}`);
}

/* =================================================================
   4 · KARŞILIKSIZ BÖLGE 0 — ÇİFT YÖNLÜ (tarayıcısız, dosyadan)
   ================================================================= */
{
  const kaslar = VERI.kaslar;
  const sorun = [];

  /* kanonik 27'nin hepsi veride var mı */
  const eksikKanonik = KANONIK.filter(s => !kaslar[s]);
  if (eksikKanonik.length) sorun.push('kanonik sözlükten eksik: ' + eksikKanonik.join(', '));

  for (const [ad, liste] of Object.entries(SVG_SLUG)) {
    const gorunum = ad.endsWith('-on') ? 'on' : 'arka';
    /* SVG → veri */
    const karsiliksiz = liste.filter(s => !kaslar[s]);
    if (karsiliksiz.length) sorun.push(`${ad}: veride karşılığı yok → ${karsiliksiz.join(', ')}`);
    /* yanlış görünüme konmuş bölge */
    const yanlis = liste.filter(s => kaslar[s] && kaslar[s].gorunum !== gorunum);
    if (yanlis.length) sorun.push(`${ad}: yanlış görünümde → ${yanlis.join(', ')}`);
    /* veri → SVG */
    const beklenen = Object.keys(kaslar).filter(s => kaslar[s].gorunum === gorunum);
    const svgdeYok = beklenen.filter(s => !liste.includes(s));
    if (svgdeYok.length) sorun.push(`${ad}: veride var, SVG'de yok → ${svgdeYok.join(', ')}`);
    /* kanonik 27'den bu görünüme düşenler */
    const kanonikBu = KANONIK.filter(s => kaslar[s] && kaslar[s].gorunum === gorunum);
    const kanonikYok = kanonikBu.filter(s => !liste.includes(s));
    if (kanonikYok.length) sorun.push(`${ad}: kanonik slug SVG'de yok → ${kanonikYok.join(', ')}`);
  }

  const say = VERI.sayim();
  if (!sorun.length) ok(`karşılıksız bölge 0 — 4 SVG × ${say.toplam} kas (ön ${say.on} · arka ${say.arka}) çift yönlü eşleşti, kanonik 27/27 var`);
  else rec('karşılıksız bölge', sorun.join('\n      '));
}

/* =================================================================
   3 · PANEL HER KASTA DOLU  +  6 · ?kas= DERİN BAĞLANTISI
   Her slug için sayfa ?kas=<slug> ile AÇILIYOR: hem panel alanları
   hem seçili bölge hem görünüm tek turda ölçülüyor.
   ================================================================= */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const bosAlan = [], derinKirik = [];
  const slugs = Object.keys(VERI.kaslar);

  for (const slug of slugs) {
    await page.goto(`${BASE}/${SAYFA}?kas=${slug}`, { waitUntil: 'networkidle', timeout: 30000 });
    const r = await page.evaluate((s) => {
      const q = (sel) => document.querySelector(sel);
      const metin = (sel) => { const e = q(sel); return e ? e.textContent.trim() : ''; };
      const alan = (ad) => {
        const e = document.querySelector(`.an-sec[data-alan="${ad}"]`);
        if (!e) return '';
        /* başlık hariç gövde metni */
        const h = e.querySelector('h3');
        const kopya = e.cloneNode(true);
        if (h) kopya.querySelector('h3').remove();
        return kopya.textContent.replace(/\s+/g, ' ').trim();
      };
      const secili = [...document.querySelectorAll('[data-kas][aria-pressed="true"]')].map(e => e.getAttribute('data-kas'));
      const svg = q('#anStage svg');
      return {
        ad: metin('#anAd'),
        latin: metin('#anLatin'),
        fonksiyon: alan('fonksiyon'),
        koken: alan('koken'),
        komsu: alan('komsu'),
        hareketler: alan('hareketler'),
        ekipman: alan('ekipman'),
        guvenlik: alan('guvenlik'),
        secili,
        gorunum: svg ? svg.getAttribute('data-gorunum') : null,
        kartSayisi: document.querySelectorAll('#anCards .an-card').length,
        onPressed: q('button[data-gorunum="on"]')?.getAttribute('aria-pressed'),
        arkaPressed: q('button[data-gorunum="arka"]')?.getAttribute('aria-pressed')
      };
    }, slug);

    const k = VERI.kaslar[slug];
    /* --- 3 · altı alanın hepsi dolu mu --- */
    for (const [ad, deger] of Object.entries({
      'TR ad': r.ad, 'Latince': r.latin, 'fonksiyon': r.fonksiyon,
      'köken/yapışma': r.koken, 'komşular': r.komsu,
      'hareketler': r.hareketler, 'ekipman': r.ekipman, 'güvenlik': r.guvenlik
    })) {
      if (!deger || deger.length < 3) bosAlan.push(`${slug} → "${ad}" boş`);
    }
    if (r.kartSayisi < 1) bosAlan.push(`${slug} → alt ızgarada hareket kartı yok`);

    /* --- 6 · doğru kas seçili + doğru görünüm açık mı --- */
    if (r.ad !== k.ad) derinKirik.push(`${slug} → panel başlığı "${r.ad}", beklenen "${k.ad}"`);
    if (r.secili.length !== 1 || r.secili[0] !== slug)
      derinKirik.push(`${slug} → seçili bölge [${r.secili.join(',') || 'yok'}]`);
    if (r.gorunum !== k.gorunum)
      derinKirik.push(`${slug} → açılan harita "${r.gorunum}", beklenen "${k.gorunum}"`);
    const beklenenPressed = k.gorunum === 'on' ? ['true', 'false'] : ['false', 'true'];
    if (r.onPressed !== beklenenPressed[0] || r.arkaPressed !== beklenenPressed[1])
      derinKirik.push(`${slug} → ÖN/ARKA düğmesi aria-pressed ${r.onPressed}/${r.arkaPressed}`);
  }

  if (!bosAlan.length) ok(`panel ${slugs.length}/${slugs.length} kasta dolu — sekiz alanın hepsi + alt ızgara`);
  else rec('boş panel alanı', bosAlan.join('\n      '));

  if (!derinKirik.length) ok(`?kas= derin bağlantısı ${slugs.length}/${slugs.length} slug'da doğru kası ve doğru görünümü açtı`);
  else rec('derin bağlantı', derinKirik.join('\n      '));

  await ctx.close();
}

/* =================================================================
   2 · HER BÖLGE TIKLANABİLİR — DÖRT SVG, GERÇEK FARE TIKLAMASI
   ================================================================= */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await ctx.newPage();
  const kirik = [];
  let toplamTik = 0;

  for (const [ad, liste] of Object.entries(SVG_SLUG)) {
    const [cinsiyet, gorunum] = ad.split('-');
    /* haritayı aç: o görünümdeki ilk kas + istenen cinsiyet */
    const ilk = liste[0];
    try {
      await page.goto(`${BASE}/${SAYFA}?kas=${ilk}&cinsiyet=${cinsiyet}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector(`#anStage svg[data-gorunum="${gorunum}"][data-cinsiyet="${cinsiyet}"]`, { timeout: 10000 });
    } catch (e) {
      kirik.push(`${ad} — harita hiç yüklenmedi: ${e.message.split('\n')[0]}`);
      continue;
    }

    for (const slug of liste) {
      /* path'in KENDİ dolgusundan bir nokta bul, ekran koordinatına çevir */
      /* Bölge görünüm alanına alınmadan `elementFromPoint` null döner
         (ayak/baldır bölgeleri sayfanın altında kalıyordu). */
      await page.evaluate((s) => {
        const el = document.querySelector(`#anStage [data-kas="${s}"]`);
        if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
      }, slug);

      const nokta = await page.evaluate((s) => {
        const el = document.querySelector(`#anStage [data-kas="${s}"]`);
        if (!el) return { hata: 'path DOM\'da yok' };
        const bb = el.getBBox();
        const svg = el.ownerSVGElement;
        const ctm = el.getScreenCTM();
        if (!ctm) return { hata: 'getScreenCTM null' };
        for (let i = 1; i < 12; i++) {
          for (let j = 1; j < 12; j++) {
            const p = svg.createSVGPoint();
            p.x = bb.x + (bb.width  * i) / 12;
            p.y = bb.y + (bb.height * j) / 12;
            if (!el.isPointInFill(p)) continue;
            const ek = p.matrixTransform(ctm);
            const ust = document.elementFromPoint(ek.x, ek.y);
            /* tıklama gerçekten bu path'e düşüyor mu? */
            if (ust !== el) continue;
            return { x: ek.x, y: ek.y };
          }
        }
        return { hata: 'dolgu içinde ve üstü açık nokta bulunamadı' };
      }, slug);

      if (nokta.hata) { kirik.push(`${ad}/${slug} — ${nokta.hata}`); continue; }

      await page.mouse.click(nokta.x, nokta.y);
      toplamTik++;

      const sonuc = await page.evaluate(() => ({
        ad: document.querySelector('#anAd')?.textContent.trim(),
        secili: [...document.querySelectorAll('[data-kas][aria-pressed="true"]')].map(e => e.getAttribute('data-kas'))
      }));
      const bek = VERI.kaslar[slug].ad;
      if (sonuc.ad !== bek) kirik.push(`${ad}/${slug} — tıklandı ama panel "${sonuc.ad}" gösterdi`);
      else if (sonuc.secili.length !== 1 || sonuc.secili[0] !== slug)
        kirik.push(`${ad}/${slug} — aria-pressed [${sonuc.secili.join(',') || 'yok'}]`);
    }
  }

  if (!kirik.length) ok(`${toplamTik} bölgenin ${toplamTik}'i gerçek fare tıklamasıyla seçildi (4 SVG)`);
  else rec('tıklanamayan bölge', kirik.join('\n      '));

  await ctx.close();
}

/* =================================================================
   8 · KLAVYE — Tab ile bölgeye ulaşma, Enter ile seçme, aria-pressed
   ================================================================= */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await ctx.newPage();
  const sorun = [];
  await page.goto(`${BASE}/${SAYFA}`, { waitUntil: 'networkidle', timeout: 30000 });

  /* görünüm düğmesinden başla, Tab'la ilerle */
  let bulundu = null;
  try { await page.focus('button[data-gorunum="on"]', { timeout: 10000 }); }
  catch (e) { sorun.push('ÖN/ARKA geçiş düğmesi yok — sayfa yüklenmemiş olabilir'); }
  for (let i = 0; i < 12 && !bulundu; i++) {
    await page.keyboard.press('Tab');
    bulundu = await page.evaluate(() => {
      const a = document.activeElement;
      return a && a.hasAttribute && a.hasAttribute('data-kas') ? a.getAttribute('data-kas') : null;
    });
  }
  if (!bulundu) sorun.push('Tab ile hiçbir [data-kas] bölgesine odak gelmedi (12 Tab denendi)');
  else {
    ok(`Tab ile bölgeye odak geldi → ${bulundu}`);
    await page.keyboard.press('Enter');
    const r1 = await page.evaluate(() => ({
      ad: document.querySelector('#anAd')?.textContent.trim(),
      secili: [...document.querySelectorAll('[data-kas][aria-pressed="true"]')].map(e => e.getAttribute('data-kas')),
      odak: document.activeElement?.getAttribute?.('data-kas') || null,
      url: location.search
    }));
    if (r1.ad !== VERI.kaslar[bulundu].ad) sorun.push(`Enter sonrası panel "${r1.ad}", beklenen "${VERI.kaslar[bulundu].ad}"`);
    if (r1.secili.length !== 1 || r1.secili[0] !== bulundu) sorun.push(`Enter sonrası aria-pressed [${r1.secili.join(',') || 'yok'}]`);
    if (!r1.url.includes('kas=' + bulundu)) sorun.push(`Enter sonrası URL güncellenmedi: "${r1.url}"`);

    /* ok tuşu komşu bölgeye geçiyor mu */
    await page.keyboard.press('ArrowRight');
    const r2 = await page.evaluate(() => ({
      secili: [...document.querySelectorAll('[data-kas][aria-pressed="true"]')].map(e => e.getAttribute('data-kas')),
      odak: document.activeElement?.getAttribute?.('data-kas') || null
    }));
    if (!r2.secili.length || r2.secili[0] === bulundu) sorun.push(`ArrowRight seçimi değiştirmedi (hâlâ ${r2.secili[0] || 'yok'})`);
    else if (r2.odak !== r2.secili[0]) sorun.push(`ArrowRight sonrası odak "${r2.odak}", seçili "${r2.secili[0]}"`);
    else ok(`ok tuşu komşu bölgeye geçti → ${bulundu} → ${r2.secili[0]} (odak da taşındı)`);
  }

  if (!sorun.length) ok('klavye: Enter seçiyor, aria-pressed doğru, URL güncelleniyor');
  else rec('klavye', sorun.join('\n      '));
  await ctx.close();
}

/* =================================================================
   7 · @390 DÜZEN + 9 · BANNER ÖLÇÜSÜ + 10 · KONSOL
   ================================================================= */
for (const w of [1440, 1024, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console', m => { if (m.type() === 'error') konsol.push(`[${w}] ${m.text()}`); });
  page.on('pageerror', e => konsol.push(`[${w}] pageerror: ${e.message}`));

  await page.goto(`${BASE}/${SAYFA}`, { waitUntil: 'networkidle', timeout: 30000 });

  /* 9 · banner LİSTE ailesi */
  const b = await page.evaluate(() => {
    const t = document.querySelector('.lib-top');
    return {
      h: t ? Math.round(t.getBoundingClientRect().height) : null,
      aile: document.body.getAttribute('data-fit-hero-kind')
    };
  });
  if (b.aile !== 'liste') rec('banner ailesi', `@${w} data-fit-hero-kind="${b.aile}", beklenen "liste"`);
  if (b.h === BANNER[w]) ok(`@${w} banner ${b.h} px — LİSTE ailesiyle birebir`);
  else rec('banner ölçüsü', `@${w} banner ${b.h} px, beklenen ${BANNER[w]} px`);

  /* 7 · yatay taşma + düzen */
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (tasma <= 0) ok(`@${w} yatay taşma 0`);
  else rec('yatay taşma', `@${w} → ${tasma} px`);

  if (w === 390) {
    const g = await page.evaluate(() => {
      const mEl = document.getElementById('anMap');
      const pEl = document.getElementById('anPanel');
      const gEl = document.querySelector('.an-grid');
      if (!mEl || !pEl) return { yok: true };
      const m = mEl.getBoundingClientRect(), p = pEl.getBoundingClientRect();
      return { mAlt: Math.round(m.bottom), pUst: Math.round(p.top), mUst: Math.round(m.top),
               sutun: gEl ? getComputedStyle(gEl).gridTemplateColumns : '—' };
    });
    if (g.yok) rec('mobil düzen', '@390 #anMap / #anPanel DOM\'da yok');
    else if (g.mAlt <= g.pUst && g.mUst < g.pUst)
      ok(`@390 harita panelin ÜSTÜNDE — harita alt kenarı ${g.mAlt} ≤ panel üst kenarı ${g.pUst} (tek kolon: ${g.sutun})`);
    else rec('mobil düzen', `@390 harita alt ${g.mAlt} · panel üst ${g.pUst} — harita üstte değil`);
  }

  /* 10 · konsol */
  if (w !== 1024) {
    if (!konsol.length) ok(`@${w} konsol hatası 0`);
    else rec('konsol hatası', konsol.join(' | '));
  }
  await ctx.close();
}

/* =================================================================
   11 · MENÜ KALEMİ — üst menü + drawer
   ================================================================= */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/hareket-merkezi-v1.html`, { waitUntil: 'networkidle', timeout: 30000 });

  const m = await page.evaluate(() => {
    const navItems = [...document.querySelectorAll('.nav > .nav-item')];
    const hareket = navItems.find(n => n.querySelector('a')?.textContent.trim().startsWith('Hareket'));
    const dd = hareket ? hareket.querySelector('.dropdown') : null;
    const gruplar = dd ? [...dd.querySelectorAll('.dd-group')].map(g => g.textContent.trim()) : [];
    const linkler = dd ? [...dd.querySelectorAll('a')].map(a => a.getAttribute('href')) : [];
    const drawerGrup = [...document.querySelectorAll('.drawer-nav .d-sub-group')].map(g => g.textContent.trim());
    const drawerLink = [...document.querySelectorAll('.drawer-nav .d-item .d-sub a')].map(a => a.getAttribute('href'));
    return {
      ustKalemSayisi: navItems.length,
      ustKalemler: navItems.map(n => n.querySelector('a')?.textContent.trim().replace(/\s+/g, ' ')),
      gruplar, linkler, drawerGrup, drawerLink,
      panelKolon: dd ? getComputedStyle(dd).gridTemplateColumns : null
    };
  });

  /* Taban ölçüsü: NAV dizisi DÖRT kalem taşıyor (Hareket · Programlar ·
     Challenge · Antrenörler). Enerji Defteri K18 ile üst menüden çıkmıştı.
     K34'ün amacı bu sayının ŞİŞMEMESİ — "Hareketi Anlamak" ayrı kalem
     olsaydı 5 olurdu. */
  if (m.ustKalemSayisi === 4) ok(`üst menü kalem sayısı 4 — şişmedi (${m.ustKalemler.map(s => s.split(' ')[0]).join(' · ')})`);
  else rec('üst menü kalem sayısı', `${m.ustKalemSayisi}, beklenen 4 → ${m.ustKalemler.join(' | ')}`);

  if (m.gruplar.includes('Hareketi Anlamak')) ok('üst menü: "Hareketi Anlamak" grup başlığı Hareket panelinde');
  else rec('menü grubu', `üst menüde "Hareketi Anlamak" yok — bulunan gruplar: [${m.gruplar.join(', ') || 'yok'}]`);

  if (m.drawerGrup.includes('Hareketi Anlamak')) ok('drawer: "Hareketi Anlamak" grup başlığı görünüyor');
  else rec('drawer grubu', `drawer'da "Hareketi Anlamak" yok — bulunan: [${m.drawerGrup.join(', ') || 'yok'}]`);

  const beklenenAlt = ['sozluk-v1.html', 'anatomi-v1.html'];
  const ustEksik = beklenenAlt.filter(h => !m.linkler.includes(h));
  const drwEksik = beklenenAlt.filter(h => !m.drawerLink.includes(h));
  if (!ustEksik.length && !drwEksik.length) ok(`grubun iki kalemi hem üst menüde hem drawer'da (${beklenenAlt.join(' · ')})`);
  else rec('grup kalemleri', `üstte eksik [${ustEksik}] · drawer'da eksik [${drwEksik}]`);

  /* href'ler diskte var mı */
  const yerel = [...new Set([...m.linkler, ...m.drawerLink])].filter(h => h && !/^https?:/.test(h));
  const yok = yerel.filter(h => !DISK.has(h.split(/[?#]/)[0]));
  const beklenenYok = yok.filter(h => BIRLESTIRME_SONRASI.has(h.split(/[?#]/)[0]));
  const gercekYok  = yok.filter(h => !BIRLESTIRME_SONRASI.has(h.split(/[?#]/)[0]));
  if (!gercekYok.length) ok(`Hareket panelindeki ${yerel.length} yerel hedefin ${yerel.length - yok.length}'i diskte`);
  else rec('kırık menü hedefi', gercekYok.join(' · '));
  if (beklenenYok.length) not(`BİLİNEN AÇIK — H1 branch'inde üretiliyor, birleştirme sonrası doğrulanacak: ${beklenenYok.join(' · ')}`);

  /* H3 · 7. OTURUMDA BEKLENTİ TERSİNE ÇEVRİLDİ.
     Bu blok önceki turda "antrenman-olusturucu MENÜDE OLMAMALI" diyordu —
     çünkü o tur H3 yalnız keşif yapıyordu, sayfa yoktu ve bağlanırsa 60
     sayfada kırık bağlantı olurdu. Sayfa artık diskte ve menü kalemi açıldı;
     bekleyiş bayatladı ve sınamayı yanlış yere kırmızıya döndürüyordu
     (kırılan bir şey yoktu — bir üstteki kontrol "yerel hedeflerin hepsi
     diskte" diye zaten geçiyordu). Beklenti şimdi doğru yönde: kalem menüde
     OLMALI ve hedefi diskte OLMALI. Kalem geri alınırsa bu kırmızıya döner. */
  const h3Kalem = yerel.filter(h => h.includes('antrenman-olusturucu'));
  if (!h3Kalem.length) rec('eksik menü kalemi', '"Hareketi Anlamak" grubunda antrenman-olusturucu-v1.html yok');
  else if (yok.some(h => h.includes('antrenman-olusturucu'))) rec('kırık menü hedefi', 'antrenman-olusturucu-v1.html menüde ama diskte yok');
  else ok(`antrenman-olusturucu-v1.html menüde ve hedefi diskte (${h3Kalem.length} kalem)`);

  await ctx.close();
}

/* =================================================================
   5 · HAREKET KÖPRÜLERİ HTTP 200  +  uydurma slug yok
   ================================================================= */
{
  const hedefler = new Set();
  const uydurma = [];
  for (const [slug, k] of Object.entries(VERI.kaslar)) {
    for (const h of (k.hareketler || [])) {
      if (!GERCEK_HAREKET.has(h)) uydurma.push(`${slug} → ${h}`);
      hedefler.add(`egzersiz-detay-v1.html?slug=${h}`);
    }
  }
  if (!uydurma.length) ok(`hareket köprülerinin hepsi 12 gerçek slug'dan (${hedefler.size} farklı hedef)`);
  else rec('uydurma hareket slug\'ı', uydurma.join(' · '));

  const kirik = [];
  for (const h of hedefler) {
    const r = await fetch(`${BASE}/${h}`);
    if (r.status !== 200) kirik.push(`${h} → ${r.status}`);
  }
  if (!kirik.length) ok(`${hedefler.size} hareket köprüsünün hepsi HTTP 200`);
  else rec('kırık hareket köprüsü', kirik.join(' · '));

  /* ekipman köprüsü — H1'in liste sayfası; detay slug'ı UYDURULMADI */
  const sz = VERI.sozlukHref;
  if (/sozluk-detay/.test(sz)) rec('uydurma sözlük slug\'ı', `ekipman köprüsü "${sz}" — liste sayfasına bağlanmalıydı`);
  else {
    const r = await fetch(`${BASE}/${sz}`);
    if (r.status === 200) ok(`ekipman köprüsü ${sz} → HTTP 200`);
    else not(`BİLİNEN AÇIK — ekipman köprüsü ${sz} → HTTP ${r.status}; H1 branch'inde üretiliyor, birleştirme sonrası doğrulanacak`);
  }
}

await browser.close();

console.log('');
if (fail) { console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
