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
         köken/yapışma · komşular · hareketler · güvenlik) hepsi boş değil.
         R6 · M11/M14: hareket kartları panelin İÇİNDE ve sayfada TEK kez;
         `.an-kaynak` künye satırı DOM'da 0.
     4.  Karşılıksız bölge 0 — ÇİFT YÖNLÜ: SVG→veri ve veri→SVG
     5.  Hareket köprüleri HTTP 200
     6.  `?kas=` derin bağlantısı — her slug doğrudan açıldığında doğru
         kası seçili ve doğru görünümü (ön/arka) açık getiriyor
     7.  @390 yatay taşma 0 ve harita panelin ÜSTÜNDE (geometriyle)
     8.  Klavye — Tab ile bölgeye ulaşılıyor, Enter seçiyor, aria-pressed
     9.  Banner LİSTE ailesi — @1440 544 · @1024 607 · @390 587, birebir
     10. Konsol hatası 0 @1440 ve @390
     12. R6 · M14 — kas seçildikten sonra KAYDIRMADAN hareket listesi
         viewport içinde (@1440 ve @390) ve içeriği gerçekten değişiyor
     13. R6 · M11 — `anatomi-veri.js` içindeki `kaynak` alanı 29/29 kayıtta
         duruyor (K38 sözleşmesi ekranı değil VERİYİ bağlar)
     14. R6 · M15 — sağlık notu ve saglik-bilgilendirme bağlantısı duruyor,
         dikey boşluğu simetrik
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
    /* R6 · M21 — İKİNCİL GÖRÜNÜM MEŞRU, KARŞILIKSIZLIK DEĞİL.
       Render'dan segmentlenen harita gerçek anatomiyi izliyor: gastrocnemius
       hem önden hem arkadan, trapez hem arkadan hem omuz üstünden görünür.
       Kural ZAYIFLATILMADI, doğru yere taşındı: bir bölgenin veri kaydı
       OLMAK ZORUNDA (üstte ölçülüyor) ve kası KENDİ birincil görünümünde
       de bulunmak zorunda (altta ölçülüyor). İkincil görünüm serbest. */
    const ikincil = liste.filter(s => kaslar[s] && kaslar[s].gorunum !== gorunum);
    const ikincilOksuz = ikincil.filter(s => {
      const birincilAd = ad.replace(/-(on|arka)$/, '-' + kaslar[s].gorunum);
      return !(SVG_SLUG[birincilAd] || []).includes(s);
    });
    if (ikincilOksuz.length)
      sorun.push(`${ad}: ikincil görünümde var ama BİRİNCİL görünümünde yok → ${ikincilOksuz.join(', ')}`);
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
   13 · R6 · M11 — `kaynak` ALANI VERİDE DURUYOR (K38)
   Ekrandan kaldırıldı; sözleşme veride. Alan silinirse burası kırmızı.
   ================================================================= */
{
  const kaslar = Object.entries(VERI.kaslar);
  const eksik = kaslar.filter(([, k]) => !k.kaynak || !String(k.kaynak).trim()).map(([s]) => s);
  if (!eksik.length) ok(`kaynak alanı ${kaslar.length}/${kaslar.length} kayıtta duruyor (K38)`);
  else rec('kaynak alanı silinmiş', eksik.join(', '));
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
        /* R6 · M14 — kartlar artık panelin İÇİNDE, alt section kalktı */
        kartSayisi: document.querySelectorAll('.an-sec[data-alan="hareketler"] .an-card').length,
        kartToplam: document.querySelectorAll('.an-card').length,
        kaynakSatiri: document.querySelectorAll('.an-kaynak').length,
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
    if (r.kartSayisi < 1) bosAlan.push(`${slug} → panelin hareket bandında kart yok`);
    /* R6 · M14 — aynı liste sayfada İKİ KEZ basılmayacak */
    if (r.kartToplam !== r.kartSayisi)
      bosAlan.push(`${slug} → hareket kartı sayfada iki yerde: bantta ${r.kartSayisi}, toplam ${r.kartToplam}`);
    /* R6 · M11 — kaynak künyesi ekrana basılmayacak */
    if (r.kaynakSatiri !== 0) bosAlan.push(`${slug} → .an-kaynak DOM'da (${r.kaynakSatiri})`);

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

  if (!bosAlan.length) ok(`panel ${slugs.length}/${slugs.length} kasta dolu — sekiz alanın hepsi + panel içi hareket bandı`);
  else rec('boş panel alanı', bosAlan.join('\n      '));

  if (!derinKirik.length) ok(`?kas= derin bağlantısı ${slugs.length}/${slugs.length} slug'da doğru kası ve doğru görünümü açtı`);
  else rec('derin bağlantı', derinKirik.join('\n      '));

  await ctx.close();
}

/* =================================================================
   2 · HER BÖLGE TIKLANABİLİR — DÖRT SVG, GERÇEK FARE TIKLAMASI

   R6 · MADDE 21 ile YENİDEN YAZILDI. Harita artık iki katmanlı:
   altta Higgsfield render'ı (<image>), üstte segmentlenmiş <path>'ler.
   Bölgeler eski soyut ovallere göre çok daha İNCE olduğu için sonda
   sıkılaştırıldı — ölçüt zayıflamadı, tam tersine sertleşti:

     · örnekleme ızgarası 12×12 → 40×40 (ince şerit kaçmasın)
     · nokta `isPointInFill` ile path'in GERÇEK dolgusundan seçiliyor
     · `elementFromPoint` + `closest('[data-kas]')` ile üstünü başka
       bölgenin kapatmadığı doğrulanıyor (render katmanı altta)
     · bölge görünür alana ANLIK kaydırılıyor, geçişler kapatılıyor
     · görünüm geçişi düğmelerden yapılıyor (tam sayfa yenilemesi yok);
       cinsiyet ve görünüm AYRI AYRI, her biri mount doğrulanarak —
       ikisi aynı anda tıklanınca iki fetch yarışıp yanlış dosya
       mount ediyordu
   ================================================================= */
{
  const kirik = [];
  let toplamTik = 0, toplamBolge = 0;

  for (const w of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w === 1440 ? 1200 : 844 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${SAYFA}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.addStyleTag({ content: '*,*::before,*::after{scroll-behavior:auto !important;transition:none !important;animation:none !important}' });

    const gorunumeGec = async (cins, gor) => {
      await page.evaluate(c => { document.querySelectorAll('button[data-cinsiyet]').forEach(b => { if (b.dataset.cinsiyet === c) b.click(); }); }, cins);
      await page.waitForTimeout(350);
      await page.evaluate(g => { document.querySelectorAll('button[data-gorunum]').forEach(b => { if (b.dataset.gorunum === g) b.click(); }); }, gor);
      await page.waitForSelector(`#anStage svg[data-cinsiyet="${cins}"][data-gorunum="${gor}"]`, { timeout: 10000 });
      await page.waitForTimeout(150);
    };

    for (const cins of ['erkek', 'kadin']) {
      for (const gor of ['on', 'arka']) {
        const ad = `${cins}-${gor}`;
        try { await gorunumeGec(cins, gor); }
        catch (e) { kirik.push(`@${w} ${ad} — harita yüklenmedi: ${e.message.split('\n')[0]}`); continue; }

        const liste = await page.evaluate(() =>
          [...document.querySelectorAll('#anStage svg [data-kas]')].map(e => e.getAttribute('data-kas')));
        if (w === 1440) toplamBolge += liste.length;

        for (const slug of liste) {
          await page.evaluate(s => {
            const el = document.querySelector(`#anStage svg [data-kas="${s}"]`);
            if (el) el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
          }, slug);
          await page.waitForTimeout(200);

          const nokta = await page.evaluate(s => {
            const svg = document.querySelector('#anStage svg');
            const el = svg && svg.querySelector(`[data-kas="${s}"]`);
            if (!el) return { hata: "path DOM'da yok" };
            const bb = el.getBBox(), ctm = el.getScreenCTM();
            if (!ctm) return { hata: 'getScreenCTM null' };
            const pt = svg.createSVGPoint();
            let en = null, enR = -1;
            for (let i = 1; i < 40; i++) for (let j = 1; j < 40; j++) {
              pt.x = bb.x + bb.width * i / 40;
              pt.y = bb.y + bb.height * j / 40;
              if (!el.isPointInFill(pt)) continue;
              const sp = pt.matrixTransform(ctm);
              const t = document.elementFromPoint(sp.x, sp.y);
              if (!t || t.closest('[data-kas]') !== el) continue;
              let rad = 0;
              for (let k = 2; k <= 24; k += 2) {
                const ok = [[k,0],[-k,0],[0,k],[0,-k]].every(([dx, dy]) => {
                  const q = document.elementFromPoint(sp.x + dx, sp.y + dy);
                  return q && q.closest('[data-kas]') === el;
                });
                if (ok) rad = k; else break;
              }
              if (rad > enR) { enR = rad; en = { x: sp.x, y: sp.y, rad }; }
            }
            return en ? en : { hata: 'dolgu içinde ve üstü açık nokta bulunamadı' };
          }, slug);

          if (nokta.hata) { kirik.push(`@${w} ${ad}/${slug} — ${nokta.hata}`); continue; }

          await page.mouse.click(nokta.x, nokta.y);
          await page.waitForTimeout(200);
          toplamTik++;

          const sonuc = await page.evaluate(() => ({
            ad: document.querySelector('#anAd')?.textContent.trim(),
            secili: [...document.querySelectorAll('#anStage svg [data-kas][aria-pressed="true"]')].map(e => e.getAttribute('data-kas'))
          }));
          const bek = VERI.kaslar[slug].ad;
          if (sonuc.ad !== bek) kirik.push(`@${w} ${ad}/${slug} — tıklandı, panel "${sonuc.ad}" gösterdi`);
          else if (sonuc.secili.length !== 1 || sonuc.secili[0] !== slug)
            kirik.push(`@${w} ${ad}/${slug} — aria-pressed [${sonuc.secili.join(',') || 'yok'}]`);

          /* İkincil görünümdeki bölgeye tıklamak kası KENDİ görünümüne
             götürür — doğru davranış. Sıradaki ölçüm için geri al. */
          const yerinde = await page.evaluate(([c, g]) => {
            const s = document.querySelector('#anStage svg');
            return !!s && s.dataset.cinsiyet === c && s.dataset.gorunum === g;
          }, [cins, gor]);
          if (!yerinde) await gorunumeGec(cins, gor);
        }
      }
    }
    await ctx.close();
  }

  if (!kirik.length)
    ok(`her bölge gerçek fare tıklamasıyla seçildi — ${toplamTik} tıklama (${toplamBolge} bölge × @1440 ve @390), yanlış kas 0`);
  else rec('tıklanamayan bölge', kirik.join('\n      '));
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
    /* R9 · NÖBET DÜZELTMESİ: `sec()` ASENKRON — ok tuşundan hemen sonra
       `aria-pressed` henüz taşınmamış oluyor. Ölçüm beklemeden yapılınca
       ölçüt YANLIŞ SEBEPLE geçiyordu: roving tabindex öncesi Tab, seçili
       OLMAYAN bir bölgeye düşüyordu, dolayısıyla `secili[0] !== bulundu`
       koşulu ok tuşu hiç işlemese bile sağlanıyordu. Yani bu ölçüt ok
       tuşunu hiç sınamıyormuş. Artık seçimin gerçekten TAŞINMASINI bekliyor
       ve taşınmazsa kırmızıya dönüyor. */
    await page.waitForFunction(
      (onceki) => {
        const s = document.querySelector('[data-kas][aria-pressed="true"]');
        return s && s.getAttribute('data-kas') !== onceki;
      }, bulundu, { timeout: 2000 }
    ).catch(() => {});
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
   12 · R6 · M14 — SEÇİM SONRASI HAREKET LİSTESİ VİEWPORT İÇİNDE
   Kullanıcı haritayı ekrana getirir (ızgaranın başına kaydırır), bir
   bölgeye GERÇEK fare tıklamasıyla dokunur ve BAŞKA HİÇBİR KAYDIRMA
   YAPMADAN değişen hareket listesini görür. Ölçüm iki eşikle:
     · brief'in ölçütü        → band.top < innerHeight
     · sabit alt gezinme çubuğu varsa (@390 `.bottom-nav`) onun da ÜSTÜNDE
   14 · M15 — sağlık notu duruyor ve dikeyde simetrik.
   ================================================================= */
for (const w of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 1440 ? 900 : 844 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent', 'accepted'); } catch (e) {} });
  await page.goto(`${BASE}/${SAYFA}`, { waitUntil: 'networkidle', timeout: 30000 });

  /* haritayı ekrana getir — kullanıcı zaten oraya bakıyor */
  await page.evaluate(() => document.querySelector('.an-grid').scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(150);

  /* seçili OLMAYAN bir bölgenin kendi dolgusundan tıklanabilir nokta bul */
  const hedef = await page.evaluate(() => {
    const list = [...document.querySelectorAll('#anStage [data-kas]')].filter(e => e.getAttribute('aria-pressed') !== 'true');
    for (const el of list) {
      const bb = el.getBBox(), svg = el.ownerSVGElement, ctm = el.getScreenCTM();
      if (!ctm) continue;
      for (let i = 1; i < 12; i++) for (let j = 1; j < 12; j++) {
        const pt = svg.createSVGPoint();
        pt.x = bb.x + (bb.width * i) / 12;
        pt.y = bb.y + (bb.height * j) / 12;
        if (!el.isPointInFill(pt)) continue;
        const ek = pt.matrixTransform(ctm);
        if (document.elementFromPoint(ek.x, ek.y) !== el) continue;
        return { slug: el.getAttribute('data-kas'), x: ek.x, y: ek.y };
      }
    }
    return null;
  });

  if (!hedef) { rec('M14 seçim', `@${w} kaydırmadan tıklanabilir bölge bulunamadı`); await ctx.close(); continue; }

  const once = await page.evaluate(() => ({
    metin: document.querySelector('.an-sec[data-alan="hareketler"]').textContent.replace(/\s+/g, ' ').trim(),
    sy: window.scrollY
  }));

  await page.mouse.click(hedef.x, hedef.y);
  await page.waitForTimeout(200);

  const sonra = await page.evaluate(() => {
    const band = document.querySelector('.an-sec[data-alan="hareketler"]');
    const r = band.getBoundingClientRect();
    const bn = document.querySelector('.bottom-nav');
    const bnTop = bn && getComputedStyle(bn).position === 'fixed' && bn.getBoundingClientRect().height > 10
      ? Math.round(bn.getBoundingClientRect().top) : null;
    return {
      metin: band.textContent.replace(/\s+/g, ' ').trim(),
      top: Math.round(r.top), bottom: Math.round(r.bottom),
      kart: band.querySelectorAll('.an-card').length,
      vh: window.innerHeight, sy: window.scrollY, bnTop,
      live: document.getElementById('anLive').textContent.trim(),
      ad: document.querySelector('#anAd')?.textContent.trim()
    };
  });

  const sorun = [];
  if (sonra.sy !== once.sy) sorun.push(`sayfa kendiliğinden kaydı (${once.sy} → ${sonra.sy})`);
  if (sonra.metin === once.metin) sorun.push('hareket listesi seçimden sonra DEĞİŞMEDİ');
  if (!(sonra.top < sonra.vh)) sorun.push(`band.top ${sonra.top} ≥ innerHeight ${sonra.vh}`);
  if (sonra.bnTop !== null && !(sonra.top < sonra.bnTop)) sorun.push(`band.top ${sonra.top} sabit alt çubuğun (top ${sonra.bnTop}) altında`);
  if (sonra.kart < 1) sorun.push('bantta hareket kartı yok');
  if (!/hareket listelendi|hareket yok/.test(sonra.live)) sorun.push(`#anLive bildirimi beklenen biçimde değil: "${sonra.live}"`);

  if (!sorun.length)
    ok(`@${w} seçim (${hedef.slug} → "${sonra.ad}") sonrası hareket listesi KAYDIRMADAN görünür — band.top ${sonra.top} < ${sonra.bnTop !== null ? 'alt çubuk ' + sonra.bnTop : 'innerHeight ' + sonra.vh}, ${sonra.kart} kart, aria-live doğru`);
  else rec('M14 seçim görünürlüğü', `@${w} → ` + sorun.join(' | '));

  /* --- 14 · M15 sağlık notu --- */
  const not = await page.evaluate(() => {
    const n = document.querySelector('.hr-note');
    if (!n) return { yok: true };
    const sec = n.closest('.sec');
    const grid = document.querySelector('.an-grid');
    const nr = n.getBoundingClientRect(), sr = sec.getBoundingClientRect(), gr = grid.getBoundingClientRect();
    return {
      ust: Math.round(nr.top - gr.bottom),
      alt: Math.round(sr.bottom - nr.bottom),
      link: n.querySelector('a[href="saglik-bilgilendirme-v1.html"]') ? 1 : 0,
      metin: n.textContent.replace(/\s+/g, ' ').trim().length,
      ayriSection: document.querySelectorAll('#anCardsSec').length
    };
  });
  if (not.yok) rec('M15 sağlık notu', `@${w} .hr-note DOM'da yok — uyarı kayboldu`);
  else {
    const s2 = [];
    if (!not.link) s2.push('saglik-bilgilendirme-v1.html bağlantısı yok');
    if (not.metin < 100) s2.push(`uyarı metni kısaldı (${not.metin} karakter)`);
    if (Math.abs(not.ust - not.alt) > 2) s2.push(`dikey boşluk simetrik değil: üst ${not.ust} · alt ${not.alt}`);
    if (!s2.length) ok(`@${w} sağlık notu duruyor — üst ${not.ust} px · alt ${not.alt} px (fark ${Math.abs(not.ust - not.alt)}), bağlantı var`);
    else rec('M15 sağlık notu', `@${w} → ` + s2.join(' | '));
  }

  await ctx.close();
}

/* =================================================================
   11 · MENÜ KALEMİ — üst menü + drawer
   ================================================================= */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  /* R8 madde 4 — hareket-merkezi-v1 kaldırıldı; ölçüm aynı kabuğu yükleyen
     egzersiz-kutuphane-v1'e taşındı (dropdown markup'ı sayfadan bağımsız). */
  await page.goto(`${BASE}/egzersiz-kutuphane-v1.html`, { waitUntil: 'networkidle', timeout: 30000 });

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

  /* ---- R8 MADDE 3 · NÖBET TERSİNE ÇEVRİLDİ, KALDIRILMADI ----------------
     K34 bu iki ölçütü "grup başlığı GÖRÜNMELİ" diye kurmuştu (üç yeni modül
     üst menüde kendi kalemini almasın, etiketli grup altında toplansın).
     Beyar R8 madde 3'te ayracın kendisini kaldırdı: "Divider'ı kaldır,
     altındaki maddeler kaybolmayacak."
     K34'ün ASIL garantisi — üç modülün menüde kalması ve üst menünün
     şişmemesi — aşağıdaki iki ölçütte (kalem sayısı 4 · grubun kalemleri
     hem üstte hem drawer'da) AYNEN duruyor. Değişen yalnız görsel etiket:
     artık VARLIĞI gerileme sayılıyor. */
  if (!m.gruplar.length) ok('üst menü: "Hareketi Anlamak" ayracı yok (R8 madde 3)');
  else rec('menü grubu', `Hareket panelinde ayraç hâlâ var: [${m.gruplar.join(', ')}] — R8 madde 3: 0 olmalı`);

  if (!m.drawerGrup.length) ok('drawer: "Hareketi Anlamak" ayracı yok (R8 madde 3)');
  else rec('drawer grubu', `drawer'da ayraç hâlâ var: [${m.drawerGrup.join(', ')}] — R8 madde 3: 0 olmalı`);

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
