/* =====================================================================
   DADAFIT — "ANTRENMAN OLUŞTURUCU" SAYFA TESTİ  (H3 · 7. oturum)
   ---------------------------------------------------------------------
   Neyi kanıtlar (brief'in 15 kabul ölçütü, tek tek):
      1. `antrenman-olusturucu-v1.html` HTTP 200
      2. Pop-up yok — role="dialog" / aria-modal / örtü katmanı 0
      3. Her adım ileri-geri çalışıyor; geri dönünce seçimler korunuyor;
         yanıtsız adımda İleri ilerletmiyor
      4. Üretilen plandaki her hareket köprüsü 200 ve 25 gerçek slug'dan
      5. Karşılıksız kombinasyon 0 — 40 seçim bileşimi, hepsi dolu plan
      6. Determinizm — aynı seçim iki kez, birebir aynı plan
      7. Gün sayısı → bölünme: 3 full body · 4 üst/alt · 5–6 push/pull/legs
      8. Ekipman süzme — "ekipmansız"da dambıl/kettlebell/bant hareketi yok
      9. Seviye set/tekrar aralığını değiştiriyor (üç seviye, üç çıktı)
     10. "Baştan başla" adım 1'e dönüyor, seçimleri siliyor
     11. `?plan=` aynı planı geri kuruyor; bozuk değer 404 vermiyor
     12. Banner LİSTE ailesi — @1440 544 · @1024 607 · @390 587
     13. @390 yatay taşma 0 · konsol hatası 0 (@1440 ve @390)
     14. Kural tablosu ↔ kod uyumu — tasks/H3-KURALLAR.md §9 bloğu ile
         sayfadaki blok karakter karakter aynı; ayrıca anlamsal eşitlik
     15. Menü — "Antrenman Oluşturucu" üst menüde ve drawer'da, hedefi 200
     16. HAREKET ADLARI KANONİK — KURALLAR.havuz'daki her `ad`,
         egzersiz-kutuphane-v1.html kartının `data-name`'i ile birebir
         (K40 ilkesi: köprü etiketi vardığı kartla aynı şeyi söylesin)
     17. HAFTALIK TEKRAR YASAĞI — 40 bileşimde aynı hareket haftada
         birden fazla geçmiyor. Havuzun tükendiği uç bileşimlerde zarif
         düşüş serbesttir; AMA düşüş SAYILIR ve arayüzde görünür olmak
         zorundadır (gün gerekçesinde "tekrar yasağı bu günde esnedi" +
         sonuç şeridi). Görünmeyen düşüş = kırmızı.
     18. EKİPMANSIZ PLANDA ÇEKİŞ VAR — "yok" seçildiğinde planda en az
         bir `cekis` kalıbı hareketi bulunuyor (ters-sinav · superman ·
         yuzucu). Beyar'ın "ekipmansız planda sırt çalışmıyor"
         tespitinin nöbetçisi.
     19. goblet-squat EKİPMANSIZ PLANDA YOK — dambıl/kettlebell ister;
         ekipmansız havuzdaki yerini hava-squat aldı.
     21. EKİPMAN ADIMI ALTI SEÇENEK, HEPSİ SÜZÜYOR (R6 · madde 16) —
         ızgara boş kutu bırakmıyor, her seçeneğin havuzu ölçülüyor ve
         "yok" ile "salon" küme seçenekleri ötekileri temizliyor
         (tekKip). Dekoratif seçenek = kırmızı.
     20. GÜNÜN KALIBI KORUNUYOR — bir güne kendi kalıbı dışından hareket
         ancak o günün kalıbındaki KULLANILMAMIŞ hareketler gün boyunu
         dolduramadığında girebilir. (§7'nin "itiş gününe bacak
         doldurulmaz" sözünün nöbetçisi; tekrar yasağı bu sözü ezerse
         "İtiş Günü B" bacak/core hareketleriyle dolar — ölçüldü.)

   Çalıştırma:
     python3 -m http.server 8833 &
     node tests/workout-generator.mjs http://localhost:8833
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readFileSync, readdirSync } from 'node:fs';

const BASE  = process.argv[2] || 'http://localhost:8833';
const SAYFA = 'antrenman-olusturucu-v1.html';
const ROOT  = new URL('..', import.meta.url);
const PAGES = readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html').sort();

/* egzersiz-kutuphane-v1.html'in kart özniteliklerinden okunan 25 gerçek slug */
const GERCEK = new Set([
  'goblet-squat','plank','dambil-kurek','sinav','hamle','dambil-omuz-press',
  'dambil-biceps','dead-bug','kettlebell-swing','bant-cekme','kopru','bant-yana-acma',
  'hava-squat','ters-sinav','superman','yuzucu','barfiks','sehpa-dips',
  'bulgar-split-squat','tek-bacak-kopru','yan-plank','dag-tirmanisi','burpee',
  'dambil-gogus-press','dambil-romanya'
]);
/* ekipman gerektiren hareketler — "ekipmansız" planda bunlardan HİÇBİRİ olamaz.
   `goblet-squat` burada: tanımı gereği dambıl/kettlebell ister, ekipmansız
   havuzdaki yerini `hava-squat` aldı. */
const EKIPMANLI = new Set([
  'goblet-squat','dambil-kurek','dambil-omuz-press','dambil-biceps','dambil-gogus-press',
  'dambil-romanya','kettlebell-swing','bant-cekme','bant-yana-acma','barfiks'
]);
/* ekipmansız havuzun çekiş hareketleri — 18. ölçüt bunları arıyor */
const EKIPMANSIZ_CEKIS = new Set(['ters-sinav','superman','yuzucu']);
/* R15 banner aile ölçüleri — liste ailesi */
const BANNER = { 1440:544, 1024:607, 390:587 };

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

/* ---------- sihirbaz sürücüsü ---------- */
async function ac(page){
  await page.goto(`${BASE}/${SAYFA}`, { waitUntil:'domcontentloaded', timeout:30000 });
  /* Sayfa hiç yoksa (K27 taban koşusu) sihirbaz asla kurulmaz. Burada
     patlamak yerine sessizce dön: aşağıdaki `kuruldu` kapısı temiz bir
     kırmızı yazsın, yığın izi değil. */
  try {
    await page.waitForFunction(() => !!document.querySelector('.wg-step.on .wg-opt'), null, { timeout:8000 });
  } catch { /* kuruldu kapısı raporlayacak */ }
}
/* Seçenek yoksa 30 sn beklemek yerine 4 sn'de düşsün: K27 taban koşusunda
   (havuz 12, "barfiksbari" seçeneği yok) süit temiz kırmızı yazsın, kilitlenmesin. */
const sec    = (page,k,v) => page.click(`.wg-step.on .wg-opt[data-k="${k}"][data-v="${v}"]`, { timeout:4000 });
const ileri  = async page => { await page.click('#wgNext'); await page.waitForTimeout(20); };
const geri   = async page => { await page.click('#wgBack'); await page.waitForTimeout(20); };

async function durum(page){
  return page.evaluate(() => ({
    adim: document.querySelector('.wg-step.on')?.getAttribute('data-ix'),
    no:   document.getElementById('wgNo').textContent.trim(),
    rayOn:[...document.querySelectorAll('#wgRail li')].map(li => li.classList.contains('on')),
    uyari: document.getElementById('wgWarn').classList.contains('on'),
    footGizli: document.getElementById('wgFoot').style.display === 'none',
    risk: document.querySelectorAll('.wg-risk').length,
    secili: [...document.querySelectorAll('.wg-opt[aria-pressed="true"]')]
              .map(b => b.getAttribute('data-k') + ':' + b.getAttribute('data-v')),
    url: location.search,
    serit: [...document.querySelectorAll('.wg-uyari')].map(e => e.textContent.replace(/\s+/g,' ').trim()).join(' ~ '),
    gunler: [...document.querySelectorAll('.wg-gun')].map(g => ({
      ad: g.querySelector('.wg-gun-ad').textContent.trim(),
      nicin: [...g.querySelectorAll('.wg-nicin li')].map(li => li.textContent.replace(/\s+/g,' ').trim()),
      hrk: [...g.querySelectorAll('.wg-hrk a')].map(a => ({
        slug: a.getAttribute('data-slug'),
        href: a.getAttribute('href'),
        recete: [...a.querySelectorAll('.wg-recete span')].map(s => s.textContent.trim()).join(' / ')
      }))
    }))
  }));
}

/* tek tam tur — beş adımı yanıtla, plana çık.
   Bir seçenek ya da düğme yoksa (taban koşusu) yığın izi fırlatmak yerine
   BOŞ plan dönüyor: ölçütler bunu kendi diliyle kırmızı yazsın. */
async function tur(page, o){
  const {cinsiyet='erkek', hedef='kas', seviye='orta',
         ekipman=['yok'], odak=[], gun='3', durumlar=['yok']} = o || {};
  try {
    await ac(page);
    await sec(page,'cinsiyet',cinsiyet); await ileri(page);
    await sec(page,'hedef',hedef);       await ileri(page);
    await sec(page,'seviye',seviye);     await ileri(page);
    for (const e of ekipman) await sec(page,'ekipman',e);
    for (const d of odak)    await sec(page,'odak',d);
    await ileri(page);
    await sec(page,'gun',String(gun));
    for (const d of durumlar) await sec(page,'durum',d);
    await ileri(page);
    return durum(page);
  } catch (e) {
    return { adim:null, no:'', rayOn:[], uyari:false, footGizli:false, risk:0,
             secili:[], url:'', serit:'', gunler:[], hata:e.message.split('\n')[0] };
  }
}
const duz = d => d.gunler.map(g => g.ad + '|' + g.hrk.map(h => h.slug + '@' + h.recete).join(',')).join(' || ');

const browser = await chromium.launch();

/* ---------- 1 · sayfa var mı ---------- */
{
  const r = await fetch(`${BASE}/${SAYFA}`);
  if (r.status === 200) ok(`${SAYFA} → HTTP 200`);
  else rec('sayfa yok', `${SAYFA} → HTTP ${r.status}`);
}

/* ---------- 14 · KURAL TABLOSU ↔ KOD (ağdan bağımsız, önce koşsun) ---------- */
{
  const md   = readFileSync(new URL('tasks/H3-KURALLAR.md', ROOT), 'utf8');
  const html = readFileSync(new URL(SAYFA, ROOT), 'utf8');
  const m = md.match(/\n```js\n([\s\S]*?)\n```\n/);
  const h = html.match(/\/\* ==KURALLAR-BASLANGIC== \*\/\n([\s\S]*?)\n {2}\/\* ==KURALLAR-BITIS== \*\//);
  if (!m)      rec('kural tablosu', 'tasks/H3-KURALLAR.md içinde ```js bloğu yok');
  else if (!h) rec('kural tablosu', `${SAYFA} içinde ==KURALLAR-BASLANGIC==/==BITIS== işaretleri yok`);
  else if (m[1] !== h[1]) {
    let i = 0; while (m[1][i] === h[1][i]) i++;
    rec('kural tablosu ayrışmış',
        `belge ile kod ${i}. karakterde ayrılıyor:\n      belge: ${JSON.stringify(m[1].slice(i-50, i+50))}\n      kod  : ${JSON.stringify(h[1].slice(i-50, i+50))}`);
  } else ok(`kural tablosu ↔ kod birebir aynı (${m[1].length} karakter)`);
}

/* ---------- 16 · HAREKET ADLARI KANONİK KAYNAKLA BİREBİR ----------
   Kanonik kaynak `egzersiz-kutuphane-v1.html` kartlarının `data-name`
   değeridir (koordinatör kararı, K40'ın ilkesi: köprü etiketi vardığı
   kartla aynı şeyi söylemeli). Plan kartındaki ad ile hareketin
   kütüphanedeki adı ayrışırsa burası kırmızıya döner. */
{
  const lib = readFileSync(new URL('egzersiz-kutuphane-v1.html', ROOT), 'utf8');
  const kanonik = {};
  for (const mm of lib.matchAll(/href="egzersiz-detay-v1\.html\?slug=([a-z-]+)"[^>]*data-name="([^"]+)"/g))
    kanonik[mm[1]] = mm[2];

  const md = readFileSync(new URL('tasks/H3-KURALLAR.md', ROOT), 'utf8');
  const blok = md.match(/\n```js\n([\s\S]*?)\n```\n/);
  const K = blok ? new Function(blok[1] + '; return KURALLAR;')() : null;

  if (!K) rec('hareket adları', 'KURALLAR bloğu okunamadı');
  else {
    const sapma = K.havuz
      .filter(h => kanonik[h.slug] !== h.ad)
      .map(h => `${h.slug}: KURALLAR "${h.ad}" ≠ kütüphane "${kanonik[h.slug] ?? '(kart yok)'}"`);
    const eksik = K.havuz.filter(h => !(h.slug in kanonik)).map(h => h.slug);
    const fazla = Object.keys(kanonik).filter(s2 => !K.havuz.some(h => h.slug === s2));
    if (!sapma.length && !eksik.length && !fazla.length)
      ok(`hareket adları kanonik: ${K.havuz.length}/${K.havuz.length} kalem egzersiz-kutuphane data-name ile birebir`);
    else rec('hareket adı sapması',
      [...sapma, ...(eksik.length ? [`kütüphanede kartı olmayan slug: ${eksik.join(' · ')}`] : []),
       ...(fazla.length ? [`havuzda karşılığı olmayan kütüphane kartı: ${fazla.join(' · ')}`] : [])].join('\n      '));
  }
}

/* ---------- 2 · pop-up yok — SİTE GENELİ ---------- */
{
  const ctx = await browser.newContext({ viewport:{ width:1440, height:900 } });
  const kirli = [];
  const page = await ctx.newPage();
  for (const f of PAGES) {
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil:'domcontentloaded', timeout:30000 });
      await page.waitForTimeout(120);
      const r = await page.evaluate(() => {
        const q = s => document.querySelectorAll(s).length;
        const kalinti = q('.wz-overlay') + q('.wz-modal') + q('#wzModal') + q('#wzOverlay') +
                        q('[data-fit-wizard]') + q('[data-fit-wizard-host]');
        /* sihirbaz içeriği taşıyan katman var mı? kabuğun kendi katmanları
           (çerez, giriş kapısı, geri bildirim) sihirbaz değildir, sayılmaz */
        const katman = [...document.querySelectorAll('[role="dialog"],[aria-modal]')]
          .filter(el => el.querySelector('.wg-opt,.wg-card,.pb-opt,.pb-card')).length;
        return { kalinti, katman };
      });
      if (r.kalinti || r.katman) kirli.push(`${f} — kalıntı ${r.kalinti} · katman ${r.katman}`);
    } catch (e) { rec('gezinme', `${f} — ${e.message}`); }
  }
  await page.close();
  if (!kirli.length) ok(`pop-up düğümü ${PAGES.length}/${PAGES.length} sayfada 0`);
  else rec('pop-up kalıntısı', kirli.join('\n      '));
  await ctx.close();
}

/* ---------- 15 · MENÜ ---------- */
{
  const ctx  = await browser.newContext({ viewport:{ width:1440, height:900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil:'networkidle', timeout:30000 });
  const r = await page.evaluate(() => {
    const say = sel => [...document.querySelectorAll(sel)]
      .filter(a => (a.getAttribute('href')||'').includes('antrenman-olusturucu-v1'))
      .map(a => a.textContent.replace(/\s+/g,' ').trim());
    return { ust: say('.dd a, .dd-item, header a'), drawer: say('#fitDrawer a, .drawer a, .d-sub a') };
  });
  if (r.ust.length)    ok(`üst menüde "Antrenman Oluşturucu" var (${r.ust.length} kalem)`);
  else                 rec('menü · üst', 'üst menüde antrenman-olusturucu-v1 kalemi yok');
  if (r.drawer.length) ok(`drawer'da "Antrenman Oluşturucu" var (${r.drawer.length} kalem)`);
  else                 rec('menü · drawer', "drawer'da antrenman-olusturucu-v1 kalemi yok");
  await ctx.close();
}

/* ---------- 12 · BANNER — LİSTE AİLESİ, üç genişlik ---------- */
for (const [w, beklenen] of Object.entries(BANNER)) {
  const width = +w;
  const ctx  = await browser.newContext({ viewport:{ width, height: width < 600 ? 844 : 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${SAYFA}`, { waitUntil:'networkidle', timeout:30000 });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const el = document.querySelector('.lib-top');
    return { h: el ? Math.round(el.getBoundingClientRect().height * 10) / 10 : null,
             aile: document.body.getAttribute('data-fit-hero-kind') };
  });
  if (r.aile !== 'liste') rec('banner ailesi', `@${width} data-fit-hero-kind="${r.aile}" — "liste" bekleniyordu`);
  else if (r.h === beklenen) ok(`banner @${width} = ${r.h} px (liste ailesi)`);
  else rec('banner yüksekliği', `@${width} ölçülen ${r.h} px — beklenen ${beklenen} px`);
  await ctx.close();
}

/* ---------- ADIM / MOTOR SINAMALARI — @1440 ve @390 ---------- */
for (const width of [1440, 390]) {
  console.log(`\n=== @${width} ===`);
  const ctx  = await browser.newContext({ viewport:{ width, height: width < 600 ? 844 : 900 } });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console',   m => { if (m.type() === 'error') konsol.push(m.text()); });
  page.on('pageerror', e => konsol.push('PAGEERROR ' + e.message));
  await ac(page);

  const kuruldu = await page.evaluate(() =>
    !!document.getElementById('wgNo') && document.querySelectorAll('.wg-step').length >= 6
    && typeof window.AO_KURALLAR === 'object');
  if (!kuruldu) {
    rec('sihirbaz kurulmadı', `@${width} — ${SAYFA} içinde adım rayı / alt bar / KURALLAR yok`);
    await ctx.close();
    continue;
  }

  /* --- 3a · açılış --- */
  {
    const d = await durum(page);
    if (d.adim === '0' && d.no === 'Adım 1 / 5' && d.rayOn.join() === 'true,false,false,false,false')
      ok('açılış: adım 1 / 5, ray ilk kalemde');
    else rec('açılış', JSON.stringify(d));
  }

  /* --- 3b · yanıtsız adımda İleri ilerletmiyor --- */
  {
    await ileri(page);
    const d = await durum(page);
    if (d.adim === '0' && d.uyari) ok('yanıtsız adımda İleri ilerletmiyor, uyarı çıkıyor');
    else rec('boş adım kapısı', JSON.stringify(d));
  }

  /* --- 3c · beş adım ileri-geri, seçimler korunuyor --- */
  {
    await sec(page,'cinsiyet','kadin'); await ileri(page);
    await sec(page,'hedef','guc');      await ileri(page);
    await sec(page,'seviye','ileri');   await ileri(page);
    let d = await durum(page);
    if (d.adim !== '3' || d.no !== 'Adım 4 / 5') rec('adım 4', JSON.stringify(d));

    /* adım 4: ekipman zorunlu, odak isteğe bağlı → odak boşken de ilerlemeli */
    await ileri(page);
    d = await durum(page);
    if (d.adim !== '3' || !d.uyari) rec('adım 4 · zorunlu ekipman', JSON.stringify(d));
    await sec(page,'ekipman','dambil');
    await ileri(page);
    d = await durum(page);
    if (d.adim === '4' && d.no === 'Adım 5 / 5')
      ok('adım 1 → 5 ileri çalışıyor · isteğe bağlı soru ilerlemeyi kilitlemiyor');
    else rec('adım 5', JSON.stringify(d));

    await geri(page); await geri(page); await geri(page); await geri(page);
    d = await durum(page);
    const korundu = ['cinsiyet:kadin','hedef:guc','seviye:ileri','ekipman:dambil']
      .every(x => d.secili.includes(x));
    if (d.adim === '0' && d.no === 'Adım 1 / 5' && korundu)
      ok('beş adım geri çalışıyor, dört yanıt da korunuyor');
    else rec('geri', JSON.stringify(d));
  }

  /* --- 10 · Baştan başla --- */
  {
    const d0 = await tur(page, { gun:'3' });
    if (!d0.gunler.length) rec('tur', 'plan üretilmedi');
    await page.click('#wgRestart'); await page.waitForTimeout(90);
    const d = await durum(page);
    if (d.adim === '0' && d.no === 'Adım 1 / 5' && d.secili.length === 0 && d.url === '')
      ok('"Baştan başla" adım 1\'e dönüyor, seçimleri ve ?plan= siliyor');
    else rec('baştan başla', JSON.stringify({adim:d.adim, no:d.no, secili:d.secili, url:d.url}));
  }

  /* --- 7 · gün sayısı → bölünme --- */
  {
    const PPL = /İtiş|Çekiş|Bacak/;
    const UST_ALT = /Üst Vücut|Alt Vücut/;
    const BEKLENEN = {
      /* `ad` her günü tek tek denetler; 5 günlük bölünmede son iki gün
         push/pull/legs'in üst-alt tamamlayıcısıdır (H3-KURALLAR.md §4). */
      '3': { anahtar:'full-body', ad:() => /Tüm Vücut/ },
      '4': { anahtar:'ust-alt',   ad:() => UST_ALT },
      '5': { anahtar:'ppl',       ad:(i) => i < 3 ? PPL : UST_ALT },
      '6': { anahtar:'ppl',       ad:() => PPL }
    };
    const hata = [];
    for (const g of ['3','4','5','6']) {
      const d = await tur(page, { gun:g, ekipman:['yok','dambil','kettlebell','bant'] });
      const anahtar = await page.evaluate(n => window.AO_KURALLAR.bolunme[n].anahtar, g);
      if (d.gunler.length !== +g) hata.push(`${g} gün → ${d.gunler.length} gün üretildi`);
      if (anahtar !== BEKLENEN[g].anahtar) hata.push(`${g} gün → bölünme "${anahtar}", "${BEKLENEN[g].anahtar}" bekleniyordu`);
      const kotu = d.gunler.filter((x, i) => !BEKLENEN[g].ad(i).test(x.ad));
      if (kotu.length) hata.push(`${g} gün → beklenmeyen gün adı: ${kotu.map(x => x.ad).join(' · ')}`);
      /* 5–6 gün: ilk üç gün gerçekten itiş → çekiş → bacak sırasında mı */
      if (g === '5' || g === '6') {
        const ilk3 = d.gunler.slice(0,3).map(x => x.ad).join(' | ');
        if (!/İtiş.*Çekiş.*Bacak/.test(ilk3)) hata.push(`${g} gün → ilk üç gün push/pull/legs değil: ${ilk3}`);
      }
    }
    if (!hata.length) ok('gün sayısı → bölünme: 3 full body · 4 üst/alt · 5–6 push/pull/legs');
    else rec('bölünme kuralı', hata.join('\n      '));
  }

  /* --- 8 · ekipman süzme --- */
  {
    const hata = [];
    for (const gun of ['3','4','5','6']) {
      const d = await tur(page, { gun, ekipman:['yok'] });
      const kacak = d.gunler.flatMap(g => g.hrk.map(h => h.slug)).filter(s => EKIPMANLI.has(s));
      if (kacak.length) hata.push(`${gun} gün · ekipmansız → ${[...new Set(kacak)].join(', ')}`);
    }
    /* karşı kontrol: bant seçilince bant hareketi GERÇEKTEN giriyor mu */
    const db = await tur(page, { gun:'5', ekipman:['bant'] });
    const bantVar = db.gunler.flatMap(g => g.hrk.map(h => h.slug))
      .some(s => s === 'bant-cekme' || s === 'bant-yana-acma');
    if (!bantVar) hata.push('bant seçildiği hâlde planda hiç bant hareketi yok');
    if (!hata.length) ok('ekipman süzme çalışıyor: ekipmansızda dambıl/kettlebell/bant yok, bant seçilince giriyor');
    else rec('ekipman süzme', hata.join('\n      '));
  }

  /* --- 18 · EKİPMANSIZ PLANDA ÇEKİŞ VAR ----------------------------------
     Beyar'ın tespiti: "ekipmansız planda sırt çalışmıyor". Kataloğa üç
     ekipmansız çekiş hareketi girdi (ters-sinav · superman · yuzucu);
     bu ölçüt onların planda GERÇEKTEN göründüğünün nöbetçisidir.
     --- 19 · goblet-squat ekipmansız planda YOK (dambıl/kettlebell ister) */
  {
    const KALIP = await page.evaluate(() =>
      Object.fromEntries(window.AO_KURALLAR.havuz.map(h => [h.slug, h.kalip])));
    const hata = [], bulunan = new Set();
    for (const gun of ['3','4','5','6'])
      for (const seviye of ['baslangic','orta','ileri']) {
        const d = await tur(page, { gun, seviye, ekipman:['yok'] });
        const slug = d.gunler.flatMap(g => g.hrk.map(h => h.slug));
        const cekis = slug.filter(x => KALIP[x] === 'cekis');
        if (!cekis.length) hata.push(`${gun} gün · ${seviye} · ekipmansız → planda hiç çekiş hareketi yok`);
        cekis.forEach(x => bulunan.add(x));
        if (slug.includes('goblet-squat'))
          hata.push(`${gun} gün · ${seviye} · ekipmansız → goblet-squat planda (dambıl/kettlebell ister)`);
        const dis = cekis.filter(x => !EKIPMANSIZ_CEKIS.has(x));
        if (dis.length) hata.push(`ekipmansız planda beklenmeyen çekiş: ${[...new Set(dis)].join(' · ')}`);
      }
    if (!hata.length) {
      ok(`ekipmansız planda çekiş var — 12 bileşimin 12'sinde (${[...bulunan].sort().join(' · ')})`);
      ok('goblet-squat ekipmansız planda hiç çıkmıyor (12 bileşim)');
    } else rec('ekipmansız çekiş / goblet-squat', hata.join('\n      '));
  }

  /* --- 9 · seviye set/tekrar/dinlenme aralığını değiştiriyor --- */
  {
    const cikti = {};
    for (const sv of ['baslangic','orta','ileri']) {
      const d = await tur(page, { seviye:sv, hedef:'kas', gun:'3', ekipman:['yok','dambil','kettlebell','bant'] });
      cikti[sv] = d.gunler[0].hrk[0].recete;
    }
    const farkli = new Set(Object.values(cikti)).size;
    if (farkli === 3) ok(`seviye reçeteyi değiştiriyor: ${Object.entries(cikti).map(([k,v]) => k+'='+v).join(' · ')}`);
    else rec('seviye ekseni', `üç seviye ${farkli} farklı çıktı verdi: ${JSON.stringify(cikti)}`);

    /* hedef ekseni de ayrı ayrı çalışıyor mu (set eki + dinlenme çarpanı) */
    const hCikti = {};
    for (const hd of ['kilo','kas','guc']) {
      const d = await tur(page, { seviye:'orta', hedef:hd, gun:'3', ekipman:['yok','dambil','kettlebell','bant'] });
      hCikti[hd] = d.gunler[0].hrk[0].recete;
    }
    if (new Set(Object.values(hCikti)).size === 3)
      ok(`hedef reçeteyi değiştiriyor: ${Object.entries(hCikti).map(([k,v]) => k+'='+v).join(' · ')}`);
    else rec('hedef ekseni', `üç hedef ${new Set(Object.values(hCikti)).size} farklı çıktı verdi: ${JSON.stringify(hCikti)}`);
  }

  /* --- 6 · determinizm --- */
  {
    const secim = { cinsiyet:'kadin', hedef:'guc', seviye:'ileri',
                    ekipman:['dambil','bant'], odak:['sirt','omuz'], gun:'5' };
    const a = duz(await tur(page, secim));
    const b = duz(await tur(page, secim));
    const c = duz(await tur(page, secim));
    if (a === b && b === c && a.length) ok('determinizm: aynı seçim 3 kez, birebir aynı plan');
    else rec('determinizm', `çıktılar ayrıştı:\n      1: ${a}\n      2: ${b}\n      3: ${c}`);

    /* farklı seçim gerçekten farklı plan versin — sabit çıktı üretmiyoruz */
    const d = duz(await tur(page, { ...secim, gun:'3' }));
    if (d !== a) ok('farklı seçim farklı plan veriyor (motor sabit çıktı basmıyor)');
    else rec('determinizm', 'farklı gün sayısı aynı planı verdi — motor seçimleri okumuyor olabilir');
  }

  /* --- 5 · karşılıksız kombinasyon 0 (40 bileşim)
         + 17 · HAFTALIK TEKRAR YASAĞI (aynı koşuda ölçülüyor) --------------
     Havuz 12'den 25'e çıkınca uç durumlar arttı; bileşim sayısı 24'ten
     40'a çıkarıldı. Aynı turlarda tekrar yasağı da ölçülüyor:
       · gün İÇİ tekrar → MUTLAK, bir tane bile olsa kırmızı
       · günler ARASI tekrar → havuz tükendiğinde serbest (zarif düşüş),
         ama SAYILIR ve arayüzde görünmek zorundadır                        */
  {
    const EK = [['yok'],['dambil'],['bant'],['kettlebell'],['barfiksbari'],['salon'],
                ['dambil','bant'],['bant','kettlebell'],['dambil','barfiksbari'],
                ['yok','dambil','kettlebell','bant'],
                ['yok','dambil','kettlebell','bant','barfiksbari']];
    const bos = []; const slugSet = new Set(); let sayi = 0;
    const yasakHata = [];
    let tuttu = 0, dustu = 0, dususYerlesim = 0, gunIci = 0;
    const dususDetay = [];
    /* 20 · günün kalıbı — kural tablosundan okunuyor, teste kopyalanmıyor */
    const K20 = await page.evaluate(() => ({
      havuz: window.AO_KURALLAR.havuz.map(h => ({slug:h.slug, kalip:h.kalip, gerek:h.gerek})),
      bolunme: Object.fromEntries(Object.entries(window.AO_KURALLAR.bolunme)
        .map(([g,v]) => [g, v.gunler.map(x => x.kalip)])),
      /* küme seçenekleri ("yok" → [] · "salon" → dört ekipman) kural
         tablosundan okunuyor; teste ikinci bir liste yazılmıyor (R6 · m16) */
      kume: (window.AO_KURALLAR.ekipmanSuzme && window.AO_KURALLAR.ekipmanSuzme.kume) || {}
    }));
    /* seçimi gerçek ekipmanlara açar — motorun ekipmanAc()'inin aynısı */
    const ekAc = (ek) => {
      const out = [];
      ek.forEach(v => (K20.kume[v] || [v]).forEach(x => { if (!out.includes(x)) out.push(x); }));
      return out;
    };
    const kalipHata = []; let disariCikan = 0;

    for (const gun of ['3','4','5','6'])
      for (const ek of EK) {
        const hedef = ['kilo','kas','guc'][sayi % 3];
        const seviye = ['baslangic','orta','ileri'][sayi % 3];
        const d = await tur(page, { gun, ekipman:ek, hedef, seviye });
        sayi++;
        const etiket = `${gun}g/${ek.join('+')}/${hedef}/${seviye}`;
        const toplam = d.gunler.reduce((a,g) => a + g.hrk.length, 0);
        if (d.gunler.length !== +gun || d.gunler.some(g => g.hrk.length === 0))
          bos.push(`${etiket} → ${d.gunler.length} gün, ${toplam} hareket`);
        d.gunler.forEach(g => g.hrk.forEach(h => slugSet.add(h.slug)));

        /* --- tekrar sayımı + kalıp koruması: gün sırasıyla yürü --- */
        const ekEtkin = ekAc(ek);          /* "salon" burada dört ekipmana açılır */
        const kalipli = K20.havuz.filter(h =>
          !h.gerek.length || h.gerek.some(x => ekEtkin.includes(x)));
        const kalipOf = Object.fromEntries(kalipli.map(h => [h.slug, h.kalip]));
        const kullanilmis = new Set();
        let tekrar = 0; const gunlerTekrarli = [];
        for (let gi = 0; gi < d.gunler.length; gi++) {
          const g = d.gunler[gi];
          const bugun = g.hrk.map(h => h.slug);

          /* --- 20 · günün kalıbı dışından hareket ne zaman meşru --- */
          const gunKalip = K20.bolunme[gun][gi];
          const disari = bugun.filter(x => !gunKalip.includes(kalipOf[x]));
          if (disari.length) {
            disariCikan++;
            const taze = kalipli.filter(h => gunKalip.includes(h.kalip) && !kullanilmis.has(h.slug)).length;
            if (taze >= bugun.length)
              kalipHata.push(`${etiket} · "${g.ad}" → kalıp dışı ${disari.join(', ')} girdi ama günün kalıbında ${taze} kullanılmamış hareket duruyordu (gün ${bugun.length} hareket)`);
          }

          if (new Set(bugun).size !== bugun.length) {
            gunIci++;
            yasakHata.push(`${etiket} · "${g.ad}" → aynı hareket AYNI GÜN içinde iki kez: ${bugun.join(', ')}`);
          }
          const yineleyen = bugun.filter(x => kullanilmis.has(x));
          if (yineleyen.length) {
            tekrar += yineleyen.length;
            gunlerTekrarli.push(g);
            /* düşüş GİZLENEMEZ — o günün gerekçesinde yazmak zorunda */
            if (!g.nicin.some(c => /tekrar yasağı bu günde esnedi/.test(c)))
              yasakHata.push(`${etiket} · "${g.ad}" → ${yineleyen.join(', ')} haftada ikinci kez geçiyor ama gün gerekçesinde yazmıyor`);
          }
          bugun.forEach(x => kullanilmis.add(x));
        }

        if (!tekrar) tuttu++;
        else {
          dustu++; dususYerlesim += tekrar;
          dususDetay.push(`${etiket} → ${tekrar} yerleşim (${gunlerTekrarli.map(g => g.ad).join(' · ')})`);
          /* sonuç şeridi de aynı sayıyı söylemeli */
          const m = /(\d+) yerde esnedi/.exec(d.serit || '');
          if (!m) yasakHata.push(`${etiket} → ${tekrar} tekrar var ama sonuç şeridinde "… yerde esnedi" uyarısı yok`);
          else if (+m[1] !== tekrar) yasakHata.push(`${etiket} → şerit "${m[1]} yerde esnedi" diyor, ölçülen ${tekrar}`);
        }
      }

    if (!bos.length) ok(`karşılıksız kombinasyon 0 — ${sayi} bileşimin ${sayi}'si dolu plan döndürdü (${slugSet.size} farklı hareket)`);
    else rec('karşılıksız kombinasyon', bos.join('\n      '));

    /* --- 4 · plandaki her hareket 25 gerçek slug'dan --- */
    const sahte = [...slugSet].filter(s => !GERCEK.has(s));
    if (!sahte.length) ok(`plandaki ${slugSet.size} hareketin hepsi 25 gerçek slug'dan`);
    else rec('uydurma slug', sahte.join(' · '));

    /* --- 20 · günün kalıbı korunuyor mu --- */
    if (!kalipHata.length)
      ok(`günün kalıbı korunuyor — kalıp dışı hareket ${disariCikan} günde girdi, hepsinde günün kalıbı gerçekten tükenmişti`);
    else rec('günün kalıbı bozuldu', kalipHata.join('\n      '));

    /* --- 17 · tekrar yasağı raporu --- */
    if (!tuttu) yasakHata.push(`${sayi} bileşimin HİÇBİRİNDE yasak tutmadı — 999 cezası uygulanmamış olabilir`);
    if (!yasakHata.length) {
      ok(`haftalık tekrar yasağı: ${sayi} bileşimin ${tuttu}'sinde MUTLAK tuttu · ${dustu}'sinde zarif düşüş (${dususYerlesim} yerleşim) · gün içi tekrar ${gunIci}`);
      if (dustu) console.log('      düşüş gereken bileşimler (hepsi arayüzde yazılı):\n      · ' + dususDetay.join('\n      · '));
    } else rec('tekrar yasağı', yasakHata.join('\n      '));
  }

  /* --- risk dalı — kişisel plan üretilmiyor --- */
  {
    const d = await tur(page, { gun:'4', durumlar:['agri'] });
    if (d.risk === 1 && d.gunler.length === 0)
      ok('risk yanıtında kişiye özel plan üretilmiyor, uzmana yönlendiriyor');
    else rec('risk dalı', JSON.stringify({ risk:d.risk, gun:d.gunler.length }));
  }

  /* --- 11 · ?plan= --- */
  {
    const secim = { cinsiyet:'erkek', hedef:'kilo', seviye:'baslangic',
                    ekipman:['dambil','bant'], odak:['core'], gun:'6' };
    const a = await tur(page, secim);
    const kod = a.url;
    if (!/^\?plan=/.test(kod)) rec('?plan= yazılmıyor', `sonuçta URL "${kod}"`);
    else {
      await page.goto(`${BASE}/${SAYFA}${kod}`, { waitUntil:'domcontentloaded', timeout:30000 });
      await page.waitForTimeout(300);
      const b = await durum(page);
      if (duz(a) === duz(b) && b.footGizli)
        ok(`?plan= aynı planı geri kuruyor (${kod.slice(0,60)})`);
      else rec('?plan= geri kurmuyor', `\n      üretilen: ${duz(a)}\n      geri kurulan: ${duz(b)}`);
    }

    /* bozuk değerler: 404 yok, adım 1'e düşüyor, konsol patlamıyor */
    const BOZUK = ['?plan=', '?plan=abc', '?plan=erkek-kas', '?plan=uzayli-kas-orta-yok-3-0-yok',
                   '?plan=erkek-kas-orta-lazer-3-0-yok', '?plan=erkek-kas-orta-yok-9-0-yok',
                   '?plan=a-b-c-d-e-f-g-h-i'];
    const kotu = [];
    for (const q of BOZUK) {
      const r = await fetch(`${BASE}/${SAYFA}${q}`);
      if (r.status !== 200) { kotu.push(`${q} → HTTP ${r.status}`); continue; }
      await page.goto(`${BASE}/${SAYFA}${q}`, { waitUntil:'domcontentloaded', timeout:30000 });
      await page.waitForTimeout(250);
      const d = await durum(page);
      if (d.adim !== '0') kotu.push(`${q} → adım ${d.adim} (1 bekleniyordu)`);
    }
    if (!kotu.length) ok(`bozuk ?plan= değerlerinin ${BOZUK.length}'si de 200 · adım 1'e düşüyor`);
    else rec('bozuk ?plan=', kotu.join('\n      '));
  }

  /* --- 14b · KURALLAR anlamsal eşitlik (sayfadaki nesne ↔ belgedeki blok) --- */
  {
    const md = readFileSync(new URL('tasks/H3-KURALLAR.md', ROOT), 'utf8');
    const m = md.match(/\n```js\n([\s\S]*?)\n```\n/);
    const belge = m ? new Function(m[1] + '; return KURALLAR;')() : null;
    const sayfa = await page.evaluate(() => window.AO_KURALLAR);
    if (belge && JSON.stringify(belge) === JSON.stringify(sayfa))
      ok(`sayfadaki KURALLAR nesnesi belgedeki blokla anlamsal olarak da aynı (havuz ${sayfa.havuz.length} kalem)`);
    else rec('KURALLAR anlamsal fark', 'belge bloğu ile window.AO_KURALLAR ayrışıyor');
  }

  /* --- 21 · EKİPMAN ADIMI (R6 · madde 16) ---
     Altı seçenek: dördü kataloğun gerçek `data-ekipman` değeri, ikisi
     küme adı ("yok" boş küme · "salon" dördü birden). Her biri havuzu
     GERÇEKTEN süzmeli; ızgara boş kutu bırakmamalı. */
  {
    await page.goto(`${BASE}/${SAYFA}`, { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForFunction(() => !!document.querySelector('.wg-step.on .wg-opt'), null, { timeout:8000 });
    await sec(page, 'cinsiyet', 'kadin'); await ileri(page);
    await sec(page, 'hedef', 'kas');      await ileri(page);
    await sec(page, 'seviye', 'orta');    await ileri(page);
    await page.waitForTimeout(120);

    const e21 = await page.evaluate(() => {
      const K = window.AO_KURALLAR;
      const kume = (K.ekipmanSuzme && K.ekipmanSuzme.kume) || {};
      const suz = (secim) => {
        const ac = [];
        secim.forEach(v => (kume[v] || [v]).forEach(x => { if (ac.indexOf(x) < 0) ac.push(x); }));
        return K.havuz.filter(h => !h.gerek.length || h.gerek.some(g => ac.indexOf(g) > -1)).length;
      };
      const opts = [...document.querySelectorAll('.wg-step.on .wg-opt[data-k="ekipman"]')];
      const satir = {};
      opts.forEach(o => { const t = Math.round(o.getBoundingClientRect().top); satir[t] = (satir[t] || 0) + 1; });
      return {
        secenek: opts.map(o => o.getAttribute('data-v')),
        satirlar: Object.values(satir),
        dokunma: Math.min(...opts.map(o => Math.round(o.getBoundingClientRect().height))),
        havuz: Object.fromEntries(Object.keys(K.ekipman).map(v => [v, suz([v])])),
        tekKip: (K.ekipmanSuzme && K.ekipmanSuzme.tekKip) || []
      };
    });

    const h21 = [];
    if (e21.secenek.length !== 6) h21.push(`ekipman adımında ${e21.secenek.length} seçenek var, madde 16 altı istiyor: ${e21.secenek.join(' · ')}`);
    /* boş kutu: son satır ilk satır kadar dolu olmalı (tek kolon da geçerli) */
    const enCok = Math.max(...e21.satirlar);
    if (e21.satirlar.some(n => n !== enCok))
      h21.push(`ızgara boş kutu bırakıyor — satır dolulukları: ${e21.satirlar.join(' / ')}`);
    if (e21.dokunma < 44) h21.push(`dokunma hedefi ${e21.dokunma} px (< 44)`);
    /* dekoratif seçenek yasak: her seçeneğin havuzu tabandan farklı olmalı */
    const taban = e21.havuz.yok;
    const dekoratif = Object.entries(e21.havuz).filter(([v, n]) => v !== 'yok' && n === taban).map(([v]) => v);
    if (dekoratif.length) h21.push(`havuzu değiştirmeyen (dekoratif) seçenek: ${dekoratif.join(' · ')}`);
    if (e21.havuz.salon !== (await page.evaluate(() => window.AO_KURALLAR.havuz.length)))
      h21.push(`"salon" havuzu ${e21.havuz.salon}, kataloğun tamamı olmalı`);
    if (e21.tekKip.join(',') !== 'yok,salon') h21.push(`tekKip listesi "${e21.tekKip.join(',')}"`);

    /* tekKip davranışı — ölçülüyor, varsayılmıyor */
    await sec(page, 'ekipman', 'dambil'); await sec(page, 'ekipman', 'bant');
    await sec(page, 'ekipman', 'salon');
    const sonra = await page.evaluate(() =>
      [...document.querySelectorAll('.wg-opt[data-k="ekipman"][aria-pressed="true"]')].map(o => o.getAttribute('data-v')));
    if (sonra.join(',') !== 'salon') h21.push(`"salon" ötekileri temizlemedi: ${sonra.join(' · ')}`);
    await sec(page, 'ekipman', 'dambil');
    const geri = await page.evaluate(() =>
      [...document.querySelectorAll('.wg-opt[data-k="ekipman"][aria-pressed="true"]')].map(o => o.getAttribute('data-v')));
    if (geri.join(',') !== 'dambil') h21.push(`başka seçim "salon"u temizlemedi: ${geri.join(' · ')}`);

    if (!h21.length)
      ok(`ekipman adımı 6 seçenek · ızgara dolu (${e21.satirlar.join('+')}) · dokunma ${e21.dokunma} px · havuz ` +
         Object.entries(e21.havuz).map(([v, n]) => `${v}:${n}`).join(' · '));
    else rec('ekipman adımı (madde 16)', h21.join('\n      '));
  }

  /* --- 13 · yatay taşma + konsol --- */
  {
    await tur(page, { gun:'6', ekipman:['yok','dambil','kettlebell','bant'], seviye:'ileri' });
    const tasma = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (tasma <= 0) ok('yatay taşma 0 (sonuç ekranı dolu hâldeyken)');
    else rec('yatay taşma', `@${width} → ${tasma} px`);
    if (!konsol.length) ok('konsol hatası 0');
    else rec('konsol', konsol.join(' | '));
  }

  await ctx.close();
}

/* ---------- 4b · hareket köprülerinin hepsi HTTP 200 ---------- */
{
  const kirik = [];
  for (const s of GERCEK) {
    const r = await fetch(`${BASE}/egzersiz-detay-v1.html?slug=${s}`);
    if (r.status !== 200) kirik.push(`${s} → ${r.status}`);
  }
  /* menü hedefi + alt aksiyon hedefleri */
  for (const h of ['antrenman-olusturucu-v1.html','egzersiz-kutuphane-v1.html',
                   'programini-bul-v1.html','hareket-merkezi-v1.html',
                   'saglik-bilgilendirme-v1.html','antrenorler-v1.html',
                   'hareket-yeni-baslayanlar-v1.html','assets/svg/govde-erkek-on.svg',
                   'assets/svg/govde-kadin-on.svg']) {
    const r = await fetch(`${BASE}/${h}`);
    if (r.status !== 200) kirik.push(`${h} → ${r.status}`);
  }
  if (!kirik.length) ok(`${GERCEK.size} hareket köprüsü + 9 sayfa/varlık hedefi HTTP 200`);
  else rec('kırık hedef', kirik.join(' · '));
}

await browser.close();

console.log('');
if (fail) { console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
